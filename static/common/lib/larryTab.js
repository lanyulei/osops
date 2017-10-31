/**
 * @Date 2017-08-10
 * LarryMS larryTab模块
 * Autor: Larry 
 * site: www.larrycms.com
 * @copyright [www.larrycms.com]
 * @link      http://www.larrycms.com/
 * @version   [v1.9] 
 * @param     {[type]}                 exports){} [description]
 * @return    {[type]}                              [description]
 */
layui.define(['jquery', 'larryElem', 'layer', 'common'], function(exports) {
  var $ = layui.$,
    element = layui.larryElem,
    layer = parent.layer === undefined ? layui.layer : parent.layer,
    common = layui.common;
    module_name = 'larryTab';

  var cacheName = 'larrymenu';
  var gobalTabIndex = 0;
  var LarryTab = function() {
    /**
     *  默认配置 
     */
    this.config = {
      top_menu: undefined, //顶部顶级菜单
      data: undefined, //数据源
      url: undefined, //数据源地址
      type: 'GET', //读取方式
      cached: true, //是否启用菜单数据项缓存，默认localStorage
      spreadOne: false, //设置是否只展开一个二级菜单
      topFilter: 'TopMenu', //顶级菜单过滤器
      left_menu: undefined, //左侧二级导航
      leftFilter: 'LarrySide', //左侧菜单过滤器
      larry_elem: undefined, //tab选项卡容器
      tabFilter: 'larryTab', //tab过滤器
      maxTab: 50, //默认允许最大打开tab个数
      tabSession: true, //是否开启已打开tab选项卡缓存
      closed: true, // 选项卡是否包含删除按钮进而可关闭操作
      contextMenu: false, //是否屏蔽页面右键，使用页面级自定义右键菜单
      autoRefresh: false, //是否支持选项卡重新打开时自动刷新操作
    }
  };
  /**
   * @param  {[type]}  options [传入参数配置]
   */
  LarryTab.prototype.set = function(options) {
    var that = this;
    $.extend(true, that.config, options);
    return that;
  };
  var ELEM = {};
  var LeftNavElem = new Array();
  // 版本号
  LarryTab.prototype.version = '2.0.0';
  LarryTab.prototype.copyright = 'www.larrycms.com';
  // 菜单独立设置
  LarryTab.prototype.menuSet = function(options) {
    var that = this;
    if (!options.hasOwnProperty('data') && !options.hasOwnProperty('url')) {
      common.larryCmsError('没有传入数据源:data 或 url参数，菜单项无法正常初始化！', common.larryCore.errorTit);
    }
    var allow = ['top_menu', 'left_menu', 'data', 'url', 'type', 'cached', 'spreadOne', 'topFilter', 'leftFilter'];
    var option = configFilter(options, allow);
    // 传入参数进行配置
    $.extend(that.config, options);
    return that;
  };
  // Tab独立设置
  LarryTab.prototype.tabSet = function(options) {
    var that = this;
    var allow = ['larry_elem', 'maxTab', 'tabSession', 'closed', 'contextMenu', 'autoRefresh'];
    // 参数检查
    var option = configFilter(options, allow);
    // 传入参数进行配置
    $.extend(that.config, option);
    return that;
  };
  // 初始化操作
  /**
   * [init description] 页面初始化TabSession
   * @return {[type]} [description]
   */
  LarryTab.prototype.init = function() {
    var that = this;
    // 1、主题设置初始化
    if (localStorage.getItem('fullscreen_info') || localStorage.getItem('tabSessions')) {
      var fullScreen = JSON.parse(localStorage.getItem('fullscreen_info'));
      var tabSessions = JSON.parse(localStorage.getItem('tabSessions'));
      if (localStorage.getItem('themeName')) {
        var theme = localStorage.getItem('themeName');
        $("#themeName option[value='" + theme + "']").attr("selected", 'selected');
      }
      if (fullScreen) {
        $('#checkboxfull').attr('checked', 'checked');
      }
      if (tabSessions) {
        $('#checkboxtabSession').attr('checked', 'checked');
        that.config.tabSession = tabSessions;
      } else {
        that.config.tabSession = tabSessions;
        sessionStorage.removeItem('tabMenu');
        sessionStorage.removeItem('currentTabMenu');
      }

    } else if (that.config.tabSession) {
      $('#checkboxtabSession').attr('checked', 'checked');
    }

    if (localStorage.getItem('autoRefresh')) {
      var autoRefreshs = JSON.parse(localStorage.getItem('autoRefresh'));
      if (autoRefreshs) {
        $('#autoRefresh').attr('checked', 'checked');
        that.config.autoRefresh = autoRefreshs;
      } else {
        that.config.autoRefresh = autoRefreshs;
      }
    } else if (that.config.autoRefresh) {
      $('#autoRefresh').attr('checked', 'checked');
    }
    //2、tab选项卡初始化
    if (that.config.tabSession) {
      //开启了tabSession
      that.session(function(session) {
        // tabMenu是否存在
        if (session.getItem('tabMenu')) {
          //若存在则还原tabMenu
          var tabMenus = JSON.parse(session.getItem('tabMenu'));
          $.each(tabMenus, function(k, v) {
            that.recoveryTab(v);
          });
          var currentTabMenu = JSON.parse(session.getItem('currentTabMenu'));
          if (currentTabMenu) {
            that.changeTab(currentTabMenu.id);
          } else {
            taht.changeTab(tabMenus[0].id);
          }
          gobalTabIndex = tabMenus.length;
        }else{
          // 将默认首页存入session
          var tabFirst = $('#larry_tab_title li').eq(0);
          if (tabFirst.length) {
            //读取session
            var tabMenu = JSON.parse(session.getItem('tabMenu')) || [];
            var current = {
              icon: tabFirst.children('i').data('icon'),
              title: tabFirst.find('em').text() == undefined ? tabFirst.find('em').text() : '后台首页',
              href: $('#larry_tab_content iframe').eq(0).attr('src'),
              id: tabFirst.attr('lay-id'),
              closed: false
            };
            tabMenu.push(current);
            session.setItem('tabMenu', JSON.stringify(tabMenu));
            session.setItem('currentTabMenu', JSON.stringify(current));
          }
        }
      });
    }
    // 其他初始化
        
    // 3、事件初始化
    $('#larry_tab').on("click", "#larry_tab_title li", function() {
      var cid = $(this).attr("lay-id");
      that.changeTab(cid);
      if(that.config.autoRefresh){
         var autoRefreshPage = ELEM.contentBox.find('.layui-tab-item').children('iframe[data-id='+cid+']');
         autoRefreshPage.attr('src',autoRefreshPage.attr('src'));
      }
    });
    $('#larry_tab').on("click", "#larry_tab_title li i.layui-tab-close", function() {
      if (that.config.closed) {
        that.deleteTab($(this).parent("li").attr('lay-id'));
        that.tabMove(1, 1);
      }
    });
    // 4、窗口状态变化监听
    $(window).on('resize', function() {
      $('#larry_admin_out').width($(window).width()).height($(window).height());
      $('#larry_body').width($('#larry_admin_out').width() - $('#larry_left').width() - 2);
      $('#larry_body').height($('#larry_admin_out').height() - 108);
      $('#larry_tab').width($('#larry_body').width()).height($('#larry_body').height());
      // ifrmae
      $('#larry_tab_content').width($('#larry_tab').width()).height($('#larry_tab').height() - $('#larry_title_box').height()-$('#larry_footer').innerHeight()+5);
      $('#larry_tab_content').find('iframe').each(function() {
           $(this).height($('#larry_tab_content').height());
           $(this).width($('#larry_tab_content').width());
      });
    }).resize();
    //5、菜单开关
    $('#menuSwitch').on('click', function() {
      $("#larry_admin_out").toggleClass("hideLeftNav");
    });
  };
  // 菜单处理
  LarryTab.prototype.menu = function() {
    var _that = this;
    var _config = _that.config;
    if (_config.data === undefined && _config.url === undefined) {
      common.larryCmsError('LarryMS Error: 请为菜单项配置数据源【Data or Url】!', common.larryCore.errorDataTit);
    }
    if (_config.data !== undefined && typeof(_config.data) === 'object') {
      _that.larryCompleteMenu(_config.data);
      _that.init();
    } else {
      //若未传入data参数 通过url方式获取
      $.ajax({
        type: _config.type,
        url: _config.url,
        async: false,
        dataType: 'json',
        success: function(result, status, xhr) {
          // 取得数据
          _that.larryCompleteMenu(result);
        },
        error: function(xhr, status, error) {
          common.larryCmsError('LarryMS Error: ' + error, common.larryCore.errorDataTit);
        },
        complete: function() {
          _that.init();
        }
      });
    }
    return _that;
  };
  /**
   * [larryCompleteMenu 菜单扩展处理程序]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  LarryTab.prototype.larryCompleteMenu = function(data) {
    var that = this;
    var _config = that.config;
    var $leftNav = elemCheck(_config.left_menu, 'left_menu');
    //左侧导航设置正确
    if ($leftNav !== 'error') {
      // 顶级菜单容器过滤
      var $topNav = elemCheck(_config.top_menu, 'top_menu');
      // 开启了顶部菜单
      if ($topNav !== 'undefined') {
        var html = getHtml(data, 'on');
        // 存入localStorage.larry_menu
        window.localStorage.setItem('larry_menu', JSON.stringify(html));
        LeftMenuElem = html.left;
        // 生成初始化菜单数据
        $topNav.html(html.top);
        $leftNav.html(html.left[0]);
        element.init();
        that.config.top_menu = $topNav;
        that.config.left_menu = $leftNav;
      } else { // 未开启顶部菜单，只有左侧菜单暂时只支持2级导航
        var html = getHtml(data, 'off');
        window.localStorage.setItem('larry_menu', JSON.stringify(html));
        LeftMenuElem = html;
        $leftNav.html(html);
        element.init();
        _that.config.left_menu = $leftNav;
      }
    }
  };

  /**
   * @description 事件绑定处理
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {[type]}                 events   [description]
   * @param       {[type]}                 group    [description]
   * @param       {Function}               callback [description]
   * @return      {[type]}                          [description]
   */
  LarryTab.prototype.on = function(events, group, callback) {
    var that = this;
    var _config = that.config;
    var res = eventsCheck(events);
    var gp = group != undefined ? group : '0';
    // 顶级菜单处理
    if (res.eventName === 'click' && res.filter === _config.topFilter) {
      _config.left_menu.html(LeftMenuElem[group]);
      _config.left_menu.attr('data-group', group);
      element.init();
    }
    // 左侧导航菜单
    if (res.eventName === 'click' && res.filter === _config.leftFilter) {
      if (_config.left_menu.attr('lay-filter') !== undefined) {

        _config.left_menu.find('li').each(function() {
          var $this = $(this);

          // 是否同时只允许展开一个菜单
          if (_config.spreadOne) {
            $this.on('click', function() {
              if ($this.hasClass('layui-nav-itemed')) {
                $this.siblings().removeClass('layui-nav-itemed');
              }
            });
          }
          if ($this.find('dl').length > 0) {
            var $dd = $this.find('dd').each(function() {
              $(this).on('click', function() {
                var $a = $(this).children('a');
                var href = $a.data('url');
                var icon = $a.children('i:first').data('icon');
                var title = $a.children('cite').text();
                var data = {
                  elem: $a,
                  field: {
                    href: href,
                    icon: icon,
                    title: title,
                    group: gp
                  }
                };
                callback(data);
              });
            });
          } else {
            $this.on('click', function() {
              var $a = $this.children('a');
              var href = $a.data('url');
              var icon = $a.children('i:first').data('icon');
              var title = $a.children('cite').text();
              var data = {
                elem: $a,
                field: {
                  href: href,
                  icon: icon,
                  title: title,
                  group: gp
                }
              };
              callback(data);
            });
          }

        });
      }
    }
    return that;
  };
  // 清除缓存
  LarryTab.prototype.cleanCached = function() {
    layui.data(cacheName, null);
    localStorage.clear();
    sessionStorage.clear();
    clearCookie();
  };
  /**
   * ==============================Tab 相关操作 ==================================
   */

  /**
   * @return  {[type]} [init 对象初始化]
   */
  LarryTab.prototype.tabInit = function() {
    var that = this;
    var _config = that.config;
    $container = elemCheck(_config.larry_elem, 'larry_elem');
    _config.larry_elem = $container;
    ELEM.titleBox = $container.children('ul.layui-tab-title');
    ELEM.contentBox = $container.children('div.layui-tab-content');
    ELEM.tabFilter = $container.attr('lay-filter');
    ELEM.tabCtrlBox = $container.find('#buttonRCtrl');
    return that;
  };
  /**
   * @description 查询tab是否存在，如果存在则返回索引值，不存在返回-1
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {[type]}                 title [description]
   * @param       {[type]}                 url   [description]
   * @return      {[type]}                       [description]
   */
  LarryTab.prototype.exists = function(title) {
    var tabIndex = -1;
    var that = ELEM.titleBox === undefined ? this.tabInit() : this;
    ELEM.titleBox.find('li').each(function(i, e) {
      var $em = $(this).children('em');
      if ($em.text() === title) {
        tabIndex = i;
      };
    });
    return tabIndex;
  };
  // 获取tabid
  LarryTab.prototype.getTabId = function(title) {
    var tabId = -1;
    var that = ELEM.titleBox === undefined ? this.tabInit() : this;
    ELEM.titleBox.find('li').each(function(i, e) {
      var $em = $(this).children('em');
      if ($em.text() === title) {
        tabId = $(this).attr('lay-id');
      }
    });
    return tabId;
  };

  /**
   * @description 获取当前获得焦点的tabid
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @return      {[type]}                 [description]
   */
  LarryTab.prototype.getCurrentTabId = function() {
    var that = this;
    var _config = that.config;
    return $(_config.larry_elem).find('ul.layui-tab-title').children('li.layui-this').attr('lay-id');
  };
  /**
   * @description 添加选择卡，如果选择卡存在则获取焦点
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {[type]}                 data [description]
   * @return      {[type]}                      [description]
   */
  LarryTab.prototype.tabAdd = function(data) {
    var that = this;
    var _config = that.config;
    var tabIndex = that.exists(data.title);
    // 判断tab选项卡是否已打开
    if (tabIndex == -1) {
      // 进一步判断有没有超出同时打开最大允许数量
      if (_config.maxTab !== 'undefined') {
        var currentTabCount = ELEM.titleBox.children('li').length;
        if (typeof _config.maxTab === 'number') {
          if (currentTabCount === _config.maxTab) {
            common.larryCmsError('为了保障系统流畅运行，默认最多只能同时打开' + _config.maxTab + '个选项卡，或请设置最大打开个数', common.larryCore.tit);
            return;
          }
        }
        if (typeof _config.maxTab === 'object') {
          var max = _config.maxTab.max || 50;
          var msg = _config.maxTab.tipMsg || '为了保障系统流畅运行，默认最多只能同时打开' + max + '个选项卡。';
          if (currentTabCount === max) {
            common.larryCmsError(msg, common.larryCore.tit);
            return;
          }
        }
      }
      gobalTabIndex++;
      var content = '<iframe src="' + data.href + '" data-group="' + data.group + '" data-id="' + gobalTabIndex + '" name="ifr_' + gobalTabIndex + '" id="ifr' + gobalTabIndex + '"  class="larry-iframe"></iframe>';
      var title = '';
      if (data.icon !== undefined) {
        title += '<i class="larry-icon">' + data.icon + '</i>';
      }
      title += '<em>' + data.title + '</em>';
      if (_config.closed) {
        title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + gobalTabIndex + '">&#x1006;</i>';
      }
      // 添加tab
      element.tabAdd(ELEM.tabFilter, {
        title: title,
        content: content,
        id: gobalTabIndex
      });
      //iframe 自适应
      ELEM.contentBox.find('iframe[data-id=' + gobalTabIndex + ']').each(function() {
        $(this).height(ELEM.contentBox.height());
        layer.msg('正在加载请稍后...', {
          icon: 6
        });
      });
      $('#ifr' + gobalTabIndex).load(function() {
          parent.layer.closeAll();
      });
      if (_config.closed) {
        //监听关闭事件
        ELEM.titleBox.find('li').children('i.layui-tab-close[data-id=' + gobalTabIndex + ']').on('click', function() {

          that.deleteTab($(this).parent('li').attr('lay-id'));
          that.tabMove(1, 1);
        });
      }
      var changeId = that.getTabId(data.title);
      that.changeTab(changeId);

      that.tabMove(tabIndex, 0);
      that.pageEffect(changeId);
      // 设置tabSession缓存
      if (_config.tabSession) {
        that.session(function(session) {
          // 先读取已有session
          var tabMenu = JSON.parse(session.getItem('tabMenu')) || [];
          var currentTab = {
            title: data.title,
            href: data.href,
            icon: data.icon,
            closed: _config.closed,
            group: data.group,
            id: gobalTabIndex
          }
          tabMenu.push(currentTab);
          session.setItem('tabMenu', JSON.stringify(tabMenu));
          session.setItem('currentTabMenu', JSON.stringify(currentTab));
        });
      }
    } else {
      var changeId = that.getTabId(data.title);
      that.changeTab(changeId);
      if(that.config.autoRefresh){
         // ELEM.contentBox.children('.layui-show').find('iframe')[0].contentWindow.location.reload(true);
         var autoRefreshPage = ELEM.contentBox.find('.layui-tab-item').children('iframe[data-id='+changeId+']');
         autoRefreshPage.attr('src',autoRefreshPage.attr('src'));
      }
      that.tabMove(tabIndex, 0);
      that.pageEffect(changeId,true);
    }
  };
  
  /**
   * @description 页面加载效果
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-26
   * @param       {[type]}                 id     [description]
   * @param       {[type]}                 status [description]
   * @return      {[type]}                        [description]
   */
  LarryTab.prototype.pageEffect = function(id,status){
       //页面淡出效果
        var index = layer.load(1);
        if (status) {
            ELEM.contentBox.find('iframe[data-id=' + id + ']').css({ "opacity": "0", "margin-top": "50px" }).delay(100).animate({ opacity: '1', marginTop: "0" }, 200);
            layer.close(index);
        } else {
            ELEM.contentBox.find('iframe[data-id=' + id + ']').css({ "opacity": "0", "margin-top": "50px" }).load(function() {
                $(this).delay(100).animate({ opacity: '1', marginTop: "0" }, 200);
                layer.close(index);
            });
        }
  };
  /**
   * @description 从session中还原tab选项卡
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {[type]}                 tabObj [description]
   * @return      {[type]}                        [description]
   */
  LarryTab.prototype.recoveryTab = function(tab) {
        var that = this;
        var _config = that.config;
        var tabIndex = that.exists(tab.title);
        if (tabIndex == -1) {
            var content = '<iframe src="' + tab.href + '" data-group="' + tab.group + '" data-id="'  + tab.id + '" name="ifr_' + tab.id + '" id="ifr' + tab.id + '"  class="larry-iframe"></iframe>';
            var title = '';
            if (tab.icon !== undefined) {
                title += '<i class="larry-icon">' + tab.icon + '</i>';
            }
            title += '<em>' + tab.title + '</em>';
            if (_config.closed) {
                title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + tab.id + '">&#x1006;</i>';
            }
            element.tabAdd(ELEM.tabFilter, {
                title: title,
                content: content,
                id: tab.id
            });
            that.tabMove(tabIndex, 0);
            that.pageEffect(tab.id);
        } else {
            element.tabChange(ELEM.tabFilter, that.getTabId(tab.title));
            that.tabMove(tabIndex, 1);
            that.pageEffect(tab.id,true);
        }
    };
  /**
   * @description 删除指定的tab选项卡
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {[type]}                 id [description]
   * @return      {[type]}                    [description]
   */
  LarryTab.prototype.deleteTab = function(id) {
    var that = this;
    if (that.config.tabSession) {
      that.session(function(session) {
        var tabMenu = JSON.parse(session.getItem('tabMenu'));
        for (var i = 0; i < tabMenu.length; i++) {
          if (tabMenu[i].id == id) {
            tabMenu.splice(i, 1);
          }
        }
        session.setItem('tabMenu', JSON.stringify(tabMenu));
        var currentTabMenu = JSON.parse(session.getItem('currentTabMenu'));
        if (currentTabMenu.id == id) {
          session.setItem('currentTabMenu', JSON.stringify(tabMenu.pop()));
        }
      });
    }
    element.tabDelete(that.config.tabFilter, id).init();
  };
  /**
   * @description 改变tab
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-24
   * @param       {[type]}                 id [description]
   * @return      {[type]}                    [description]
   */
  LarryTab.prototype.changeTab = function(id) {
    var that = this;
    if (that.config.tabSession) {
      that.session(function(session) {
        var currentTabMenu = JSON.parse(session.getItem('currentTabMenu'));
        if (!currentTabMenu) return false;
        if (currentTabMenu.id != id) {
          var tabMenu = JSON.parse(session.getItem('tabMenu'));
          for (var i = 0; i < tabMenu.length; i++) {
            if (tabMenu[i].id == id) {
              session.setItem('currentTabMenu', JSON.stringify(tabMenu[i]));
              break;
            }
          }
        }
      });
    }
    element.tabChange(that.config.tabFilter, id).init();
  };
  /**
   * @description 判断菜单选项卡是否已超出了总宽度,若超过则激活左右移动按钮
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param int index 大于等于0时表示菜单选项卡已经存在，才有移动的需求
   * @param int scene 为1时表示删除tab菜单选项卡，为0时表示切换或是添加菜单选项卡
   * @return      {[type]}                       [description]
   */
  LarryTab.prototype.tabMove = function(tabIndex, scene) {
    var _that = this;
    //取得菜单选项卡总宽度
    var $tabNav = ELEM.titleBox.find('li'),
      all_tab_width = 0;
    $tabNav.each(function(i, n) {
      all_tab_width += $(n).outerWidth(true);
    });
    if (!$tabNav[0]) return;
    $(window).on('resize', function() {
      // 在窗口改变后重新获取外层固定宽度
      var larryTabTitW = parseInt(ELEM.titleBox.parent('#larry_tab').width() - 270);
      var currentTab_w = parseInt(ELEM.titleBox.find('.layui-this').outerWidth(true));

      if (all_tab_width > larryTabTitW) {
        var m_left_w = larryTabTitW - all_tab_width;
        if (m_left_w < 0) {
          if (tabIndex >= 0) {
            var currentTab_left = parseInt(ELEM.titleBox.find('.layui-this').position().left);
            var currentTab_ml = parseInt(ELEM.titleBox.css("marginLeft"));
            var current_ml = currentTab_left + parseInt(currentTab_ml);
            if (current_ml <= 0) {
              m_left_w = 0 - currentTab_left;
            } else {
              var is_show = -(currentTab_ml - larryTabTitW + parseInt(ELEM.titleBox.find('.layui-this').outerWidth(true)) + currentTab_left);
              if (is_show <= 0) {
                m_left_w = larryTabTitW - currentTab_left - parseInt(ELEM.titleBox.find('.layui-this').outerWidth(true));
              } else {
                if (scene == 1 && parseInt(currentTab_ml) < 0) {
                  m_left_w = larryTabTitW - currentTab_left - parseInt(ELEM.titleBox.find('.layui-this').outerWidth(true));
                  if (m_left_w > 0) {
                    m_left_w = 0;
                  }
                } else if (scene != 1 && parseInt(currentTab_ml) <= 0) {
                  m_left_w = larryTabTitW - currentTab_left - parseInt(ELEM.titleBox.find('.layui-this').outerWidth(true));
                  if (m_left_w > 0) {
                    m_left_w = 0;
                  }
                } else {
                  return;
                }
              }
            }
          }
          ELEM.titleBox.css({
            "marginLeft": m_left_w
          });
        }
        if (m_left_w == 0 && all_tab_width < larryTabTitW) {

        } else {
          ELEM.titleBox.find('span').remove();
        }
      } else {
        ELEM.titleBox.css({
          "marginLeft": 0
        });
      }
      // 绑定左右箭头点击事件

      $('.pressKey').on('click', function() {
        if (all_tab_width > larryTabTitW) {
          if ($(this).attr('id') == 'titleRight') {
            var curTabM = parseInt(ELEM.titleBox.css("marginLeft"));
            if (Math.abs(curTabM) + larryTabTitW >= (all_tab_width - currentTab_w)) {
              ELEM.titleBox.css({
                "marginLeft": larryTabTitW - all_tab_width
              });

            } else {
              ELEM.titleBox.css({
                "marginLeft": curTabM - larryTabTitW
              });
            }
            //当选项卡打开过多时会很卡
            // if(Math.abs(curTabM) == (all_tab_width-larryTabTitW)){
            //  layer.tips('已达到最右侧,别点了滚不动啦！', $(this), {
            //    tips: [1, '#FF5722']
            //  });
            // }
            return;
          }
          if ($(this).attr('id') == 'titleLeft') {
            var curTabM = parseInt(ELEM.titleBox.css("marginLeft"));
            if (curTabM + larryTabTitW < 0) {
              ELEM.titleBox.css({
                "marginLeft": curTabM + larryTabTitW
              });
            } else {
              ELEM.titleBox.css({
                "marginLeft": 0
              });
            }
            //当选项卡打开过多时会很卡
            // if (Math.abs(curTabM) == 0) {
            //  layer.tips('已滚动到最左侧了', $(this), {
            //    tips: [1, '#FF5722']
            //  });
            // }
            return;
          }
        }
      });
      // 拖拽功能实用性不是很强，以后有时间再搞: write by larry 8.20 am 04:03
    }).resize();
  };
  /**
     * @description tab选项卡相关控制操作及页面右键菜单控制
     * @link        http://www.larrycms.com/
     * @copyright   [LarryCMS]
     * @author Larry_qin 2017-08-15
     * @param       {[type]}                 eventsName [description]
     * @return      {[type]}                            [description]
  */
  LarryTab.prototype.tabCtrl = function(eventsName) {
    var that = this;
    var _config = that.config;
    var currentTabID = that.getCurrentTabId();
    switch (eventsName) {
      case 'positionCurrent' : //定位当前选项卡
        var $cur_li = $(_config.larry_elem).find('ul.layui-tab-title').children('li.layui-this');
        var cur_href = $('#ifr'+currentTabID).attr("src");
        var cur_gp = $('#ifr'+currentTabID).data('group');  
        var cur_data = {
            title: $cur_li.children('em').text(),
            content:'<iframe src="' + cur_href + '" data-group="' + cur_gp + '" data-id="'  + currentTabID + '" name="ifr_' + currentTabID + '" id="ifr' + currentTabID + '"  class="larry-iframe"></iframe>',
            id: currentTabID
        };
        that.tabAdd(cur_data);
        that.tabMove(currentTabID, 0);
        break;
      case 'closeCurrent': //关闭当前
        if (currentTabID > 0) {
          that.deleteTab(currentTabID);
          that.tabMove(currentTabID, 1);
        } else {
          common.larryCmsError(common.larryCore.tit + '：默认首页不能关闭的哦！', common.larryCore.closeTit);
        }
        break;
      case 'closeOther': //关闭其他
        if (ELEM.titleBox.children('li').length > 2) {
          ELEM.titleBox.children('li').each(function() {
            var $t = $(this);
            var id1 = $t.find('i.layui-tab-close').data('id');
            if (id1 != currentTabID && id1 !== undefined) {
              that.deleteTab($t.attr('lay-id'));
              that.tabMove(currentTabID, 1);
            }
          });
        } else if (ELEM.titleBox.children('li').length == 2) {
          common.larryCmsError(common.larryCore.tit + '：【默认首页】不能作为其他选项卡关闭！', common.larryCore.closeTit);
        } else {
          common.larryCmsError(common.larryCore.tit + '：当前无其他可关闭选项卡！', common.larryCore.closeTit);
        }
        break;
      case 'closeAll': //全部关闭
        if (ELEM.titleBox.children('li').length > 1) {
          ELEM.titleBox.children('li').each(function() {
            var $t = $(this);
            var id1 = $t.find('i.layui-tab-close').data('id');
            if (id1 > 0) {
              that.deleteTab(id1);
              that.tabMove(0, 1);
            }
          });
        } else {
          common.larryCmsError(common.larryCore.tit + '：当前无其他可关闭选项卡！', common.larryCore.closeTit);
        }
        break;
      case 'refreshAdmin': //刷新最外层框架
        layer.confirm('您确定真的要重新加载后台系统界面！', {
          title: common.larryCore.tit,
          time: 0,
          resize: false,
          btn: ['我很确定', '不,我点错了'],
          btnAlign: 'c',
          zIndex: layer.zIndex,
          anim: Math.ceil(Math.random() * 6)
        }, function() {
          location.reload();
        }, function() {
          return;
        });

        break;
    }
  };
  /**
   * @description 定义sessionStorage
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-15
   * @param       {Function}               callback [description]
   * @return      {[type]}                          [description]
   */
  LarryTab.prototype.session = function(callback) {
    if (!window.sessionStorage) {
      return false;
    }
    callback(window.sessionStorage);
  };
  /**
   * www.larrycms.com
   * [getHtml getHtml 功能函数]
   * @param  {[type]} data      [description]
   * @param  {[type]} topStatus [description]
   * @return {[type]}           [description]
   */
  function getHtml(data, topStatus) {
    // 开启顶部导航
    if (topStatus == 'on') {
      var ulHtml = {
        top: '',
        left: []
      };
      // 第一层循环取出top_menu
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          ulHtml.top += '<li class="layui-nav-item layui-this">';
        } else {
          ulHtml.top += '<li class="layui-nav-item">';
        }
        ulHtml.top += '<a  data-group="' + i + '"">';
        ulHtml.top += '<i class="larry-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
        ulHtml.top += '<cite>' + data[i].title + '</cite>';
        ulHtml.top += '</a>'
        ulHtml.top += '</li>';
        // 进入第二层左侧二级导航
        if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
          ulHtml.left[i] = '';
          for (var j = 0; j < data[i].children.length; j++) {
            if (i == 0 && j == 0) {
              ulHtml.left[i] += '<li class="layui-nav-item layui-this">';
            } else if (j == 0 && (data[i].children[j].children !== undefined && data[i].children[j].children !== null && data[i].children[j].children.length > 0)) {
              ulHtml.left[i] += '<li class="layui-nav-item layui-nav-itemed">';
            } else if (j == 0 && !(data[i].children[j].children !== undefined && data[i].children[j].children !== null && data[i].children[j].children.length > 0)) {
              ulHtml.left[i] += '<li class="layui-nav-item layui-this">';
            } else if (data[i].children[j].spread && j != 0) {
              ulHtml.left[i] += '<li class="layui-nav-item layui-nav-itemed">';
            } else {
              ulHtml.left[i] += '<li class="layui-nav-item">';
            }
            // 有三级菜单
            if (data[i].children[j].children !== undefined && data[i].children[j].children !== null && data[i].children[j].children.length > 0) {
              ulHtml.left[i] += '<a>';
              if (data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
                // 暂时只定义一种用法
                ulHtml.left[i] += '<i class="larry-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
              }
              ulHtml.left[i] += '<cite>' + data[i].children[j].title + '</cite>';
              ulHtml.left[i] += '</a>';
              ulHtml.left[i] += '<dl class="layui-nav-child">';
              // for循环取出第三级菜单
              for (var k = 0; k < data[i].children[j].children.length; k++) {
                if (j == 0 && k == 0) {
                  ulHtml.left[i] += '<dd class="layui-this">';
                } else {
                  ulHtml.left[i] += '<dd>';
                }
                ulHtml.left[i] += '<a data-url="' + data[i].children[j].children[k].url + '">';
                if (data[i].children[j].children[k].icon !== undefined && data[i].children[j].children[k].icon !== '') {
                  // 暂时只定义一种用法
                  ulHtml.left[i] += '<i class="larry-icon" data-icon="' + data[i].children[j].children[k].icon + '">' + data[i].children[j].children[k].icon + '</i>';
                }
                ulHtml.left[i] += '<cite>' + data[i].children[j].children[k].title + '</cite>';
                ulHtml.left[i] += '</a>';
                ulHtml.left[i] += '</dd>';
              }
              ulHtml.left[i] += '</dl>';
            } else { //无三级菜单
              var dataUrl = (data[i].children[j].url !== undefined && data[i].children[j].url !== '') ? 'data-url="' + data[i].children[j].url + '"' : '';
              ulHtml.left[i] += '<a ' + dataUrl + '>';
              if (data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
                // 暂时只定义一种用法
                ulHtml.left[i] += '<i class="larry-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
              }
              ulHtml.left[i] += '<cite>' + data[i].children[j].title + '</cite>';
              ulHtml.left[i] += '</a>';
            }
            ulHtml.left[i] += '</li>';
          }
        }
      }
      return ulHtml;
    } else {
      // 只定义左侧导航且二级
      var ulhtml = '';
      for (var i = 0; i < data.length; i++) {

        if (i == 0) {
          ulHtml += '<li class="layui-nav-item layui-this">';
        } else {
          ulHtml += '<li class="layui-nav-item">';
        }

        if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
          ulHtml += '<a>';
          if (data[i].icon !== undefined && data[i].icon !== '') {
            ulHtml += '<i class="larry-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
          }
          ulHtml += '<cite>' + data[i].title + '</cite>';
          ulHtml += '</a>';
          ulHtml += '<dl class="layui-nav-child">';
          for (var j = 0; j < data[i].children.length; j++) {
            ulHtml += '<dd>';
            ulHtml += '<a data-url="' + data[i].children[j].url + '">';
            if (data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
              ulHtml += '<i class="larry-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
            }
            ulHtml += '<cite>' + data[i].children[j].title + '</cite>';
            ulHtml += '</a>';
            ulHtml += '</dd>';
          }
          ulHtml += '</dl>';
        } else {
          var dataUrl = (data[i].url !== undefined && data[i].url !== '') ? 'data-url="' + data[i].url + '"' : '';
          ulHtml += '<a ' + dataUrl + '>';
          ulHtml += '<i class="larry-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
          ulHtml += '<cite>' + data[i].title + '</cite>';
          ulHtml += '</a>';
        }
        ulHtml += '</li>';
      }


      return ulHtml;
    }
  }
  /**
   * 针对传入容器进行检查
   * @param  elem 容器
   * @param  elemName 系统容器名
   * @return {[type]}
   */
  function elemCheck(elem, elemName) {
    var $container;
    if (elemName != 'top_menu') {
      if (typeof(elem) !== 'string' && typeof(elem) !== 'object') {
        common.larryCmsError(elemName + '参数未定义或设置出错', common.larryCore.paramsTit);
        $container = 'error';
        return $container;
      }
    } else {
      if (typeof(elem) !== 'string' && typeof(elem) !== 'object') {
        $container = 'undefined';
        return $container;
      }
    }
    // 若为字符串
    if (typeof(elem) === 'string') {
      $container = $('' + elem + '');
    }
    // 若为object
    if (typeof(elem) === 'object') {
      $container = elem;
    }
    if ($container.length === 0) {
      common.larryCmsError(elemName + ': 您设置了 ' + elemName + '参数，但DOM文档中找不到定义的【 ' + elem + ' 】元素', common.larryCore.paramsTit);
      $container = 'error';
      return $container;
    }
    var filter = $container.attr('lay-filter');
    if (filter === undefined || filter === '') {
      common.larryCmsError('请为【' + elem + '】容器设置一个lay-filter过滤器', 'lay-filter设置提示');
    }
    return $container;
  }


  /**
   * @description 事件过滤检查
   * @link        http://www.larrycms.com/
   * @copyright   [LarryCMS]
   * @author Larry_qin 2017-08-14
   * @param       {[type]}                 events [description]
   * @return      {[type]}                        [description]
   */
  function eventsCheck(events) {
    var result = {
      eventName: '',
      filter: ''
    };
    if (typeof(events) !== 'string') {
      common.larryCmsError('事件名设置错误，请参考LarryMS API文档.', common.larryCore.errorTit);
    }
    var lIndex = events.indexOf('(');
    result.eventName = events.substr(0, lIndex);
    result.filter = events.substring(lIndex + 1, events.indexOf(')'));
    return result;
  }


  /**
   * config传入参数过滤处理
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  function configFilter(obj, allow) {
    var newO = {};
    for (var o in obj) {
      if ($.inArray(o, allow)) {
        newO[o] = obj[o];
      }
    }
    return newO;
  }
  // 清除cookie
  function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  }
  // 测试方法
  LarryTab.prototype.test = function(callback,msg){
        console.log(msg);
        callback();
  };
  // 创建LarryTab对象
  var larryTab = new LarryTab();

  exports(module_name, function(options) {
    return larryTab.set(options);
  });
});