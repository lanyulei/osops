var larryTab;

layui.config({
	base: '/static/common/lib/'
});

layui.use(['jquery','larryElem','layer','common','form','larryMenu','larryTab'],function(){
	var $ = layui.$,
		larryElem = layui.larryElem,
		layer = layui.layer,
		common = layui.common,
		form = layui.form,
		// 页面上下文菜单
		larryMenu = layui.larryMenu();
		//核心操作
		larryTab = layui.larryTab({
			top_menu: '#larry_top_menu',
			left_menu: '#larry_left_menu',
			larry_elem: '#larry_tab',
			spreadOne: true
		});
    // 页面禁止双击选中
    $('body').bind("selectstart", function() {return false;});

    // 菜单初始化
    // 方法1：
	larryTab.menuSet({
		  tyep:'GET',
		  url: '/static/backstage/datas/data.json?t='+Math.random(),
		  topFilter: 'TopMenu',
		  lefFilter: 'LarrySide'
	});
    larryTab.menu();
    // 方法2：
    /*$.ajaxSettings.async = false;
	$.getJSON('/static/backstage/datas/data.json?t=' + Math.random(), function(menuData) {
		larryTab.menuSet({
			data: menuData,
			spreadOne: false,
			topFilter: 'TopMenu',
			lefFilter: 'LarrySide'
		});
		larryTab.menu();
	});
    $.ajaxSettings.async = true;*/
    // 1监听导航菜单点击事件 请注释2
    $('#larry_top_menu li').on('click',function(){
    	 var group = $(this).children('a').data('group');
    	 larryTab.on('click(TopMenu)',group);
    	 //监听左侧菜单点击事件
    	 larryTab.on('click(LarrySide)',group,function(data){
              larryTab.tabAdd(data.field);
    	 });
    })
    $('#larry_top_menu li').eq(0).click();
    // 2若不存在顶级菜单 注释以上顶级菜单监听js
	// larryTab.on('click(LarrySide)','0', function(data) {
	// 	larryTab.tabAdd(data.field);
	// });
	$(document).ready(function() {
		var fScreen = localStorage.getItem("fullscreen_info");
		var themeName = localStorage.getItem('themeName');
		if (themeName) {
			$("body").attr("class", "");
			$("body").addClass("larryTheme-" + themeName);
		}
		if (fScreen && fScreen != 'false') {
			var fScreenIndex = layer.alert('按ESC退出全屏', {
				title: '进入全屏提示信息',
				skin: 'layui-layer-lan',
				closeBtn: 0,
				anim: 4,
				offset: '100px'
			}, function() {
				entryFullScreen();
				$('#FullScreen').html('<i class="larry-icon larry-quanping"></i>退出全屏');
				layer.close(fScreenIndex);
			});
		}
	});
	// 刷新iframe
	$("#refresh_iframe").click(function() {
		$('#larry_tab_content').children('.layui-show').children('iframe')[0].contentWindow.location.reload(true);
	});
	// 常用操作
	$('#buttonRCtrl').find('dd').each(function() {
		$(this).on('click', function() {
			var eName = $(this).children('a').attr('data-eName');
			larryTab.tabCtrl(eName);
		});
	});

    //清除缓存
    $('#clearCached').on('click', function () {
        larryTab.cleanCached();
        layer.alert('缓存清除完成!本地存储数据也清理成功！', { icon: 1, title: '系统提示' }, function () {
            location.reload();//刷新
        });
    });
    
    $('#larryTheme').on('click', function() {
		var fScreen = localStorage.getItem('fullscreen_info');
		var themeName = localStorage.getItem('themeName');
		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			shadeClose: false,
			shade: 0.35,
			area: ['490px', '365px'],
			isOutAnim: true,
			resize: false,
			anim: Math.ceil(Math.random() * 6),
			content: $('#LarryThemeSet').html(),
			success: function(layero, index) {
				if (fScreen && fScreen != 'false') {
					$("input[lay-filter='fullscreen']").attr("checked", "checked");
				}
				if (themeName) {
					$("#themeName option[value='" + themeName + "']").attr("selected", "selected");
				}
				form.render();
			}
		});
		// 全屏开启
		form.on('switch(fullscreen)', function(data) {
			var fValue = data.elem.checked;
			localStorage.setItem('fullscreen_info', fValue); //fullscreen_info:fValue

		});
        // tabSession开启
		form.on('switch(tabSession)', function(data) {
			var tabS = data.elem.checked;
			localStorage.setItem('tabSessions', tabS); //tabSessions:tabS
		});
		// tab选项卡切换是否自动刷新
		form.on('switch(autoRefresh)',function(data){
            var auto = data.elem.checked;
			localStorage.setItem('autoRefresh', auto); 
		});
		// 主题设置
		form.on('select(larryTheme)', function(data) {
			var themeValue = data.value;
			localStorage.setItem('themeName', themeValue); //themeName:themeValue
			if (themeName) {
				$("body").attr("class", "");
				$("body").addClass("larryTheme-" + themeName);
			}
			form.render('select');
		});

		return false;
        // 是否存入数据库
		// form.on('submit(submitlocal)',function(data){
		// })
	});
    
    // 全屏切换
	$('#FullScreen').bind('click', function() {
		var fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement;
		if (fullscreenElement == null) {
			entryFullScreen();
			$(this).html('<i class="larry-icon">&#xe604;</i>退出全屏');
		} else {
			exitFullScreen();
			$(this).html('<i class="larry-icon">&#xe604;</i>全屏');
		}
	});

	// 进入全屏：
	function entryFullScreen() {
		var docE = document.documentElement;
		if (docE.requestFullScreen) {
			docE.requestFullScreen();
		} else if (docE.mozRequestFullScreen) {
			docE.mozRequestFullScreen();
		} else if (docE.webkitRequestFullScreen) {
			docE.webkitRequestFullScreen();
		}
	}

	// 退出全屏
	function exitFullScreen() {
		var docE = document;
		if (docE.exitFullscreen) {
			docE.exitFullscreen();
		} else if (docE.mozCancelFullScreen) {
			docE.mozCancelFullScreen();
		} else if (docE.webkitCancelFullScreen) {
			docE.webkitCancelFullScreen();
		}
	}
	// 支持作者
	$('#dianzhan').click(function(event) {
		layer.open({
			type: 1,
			title: false,
			closeBtn: true,
			shadeClose: false,
			shade: 0.75,
			area: ['520px', '288px;'],
			content: '<img src="/static/backstage/images/dianzhan.jpg"/>'
		})
	});
	// 登出系统
	$('#logout').on('click',function(){
		var url ='/accounts/logout/';
		console.log(url);
		common.logOut('退出登陆提示！','你真的确定要退出系统吗？',url);
	});

    var larryMenuData = [
		[{
			text: "刷新当前页",
		    func: function() {
		    	$(".layui-tab-content .layui-tab-item").each(function() {
		    		if ($(this).hasClass('layui-show')) {
		    			$(this).children('iframe')[0].contentWindow.location.reload(true);
		    		}
		    	});
		    }
		},{
			text: "重载主框架",
			func: function() {
				document.location.reload();
			}
		},{
			text: "设置系统主题",
		    func: function() {
			    $("#larryTheme").trigger("click");
		    }
		}, {
			text: "选项卡常用操作",
			data: [
				[{
					text: "定位当前选项卡",
					func: function() {
						$("#tabCtrD").trigger("click");
					}
				},{
					text: "关闭当前选项卡",
					func: function() {
						$("#tabCtrA").trigger("click");
					}
				}, {
					text: "关闭其他选项卡",
					func: function() {
						$("#tabCtrB").trigger("click");
					}
				}, {
					text: "关闭全部选项卡",
					func: function() {
						$("#tabCtrC").trigger("click");
					}
				}]
			]
		}],
		[{
			text: "访问作者博客",
			func: function() {
				window.open('http://fdevops.com');
			}
		}]
	];
	larryMenu.ContentMenu(larryMenuData,{
         name: "body" 
	},$('body'));
	$('#larry_body').mouseover(function(){
        larryMenu.remove();
	});


	$('.pressKey').on('click', function() {
		var titW = parseInt($('#larry_tab').width() - 270);
		var $tabUl = $('#larry_tab').find('li'),
			all_li_w = 0;
		$tabUl.each(function(i, n) {
			all_li_w += $(n).outerWidth(true);
		});
		if (titW >= all_li_w) {
			layer.tips('当前没有可移动的选项卡！', $(this), {
				tips: [3, '#FF5722']
			});
		}
	});

     
    function key(e) {
        var keynum;
        if (window.event) {
            keynum = e.keyCode;
        } else if (e.which) {
            keynum = e.which;
        }
        if(e.altKey && keynum == 76){
         	 lockSystem();
         }
    }
	// 锁屏控制提示
    $('#lock').mouseover(function(){
   	   layer.tips('请按Alt+L快速锁屏！', '#lock', {
             tips: [1, '#FF5722'],
             time: 1500
       });
    });
    var locked = 0;
    // 锁定屏幕
   function lockSystem(){
   		
   	   var url = '/static/backstage/datas/lock.json';
   	   locked = 1;
   	   $.post(
   	   	   url,
   	   	   function(data){
   	   	   if(data.lock){
   	   	   	  checkLockStatus(locked);
   	   	   }else{
              layer.alert('锁屏失败，请稍后再试！');
   	   	   }
   	   });
   	   startTimer();
   	   
   }
   
   // 点击锁屏
   $('#lock').click(function(){
   	    lockSystem();
   });
   // 解锁进入系统
   $('#unlock').click(function(){
   	    unlockSys();
   });
   function unlockSys(){
   	   if($('#unlock_pass').val() == 'larrycms'){
           locked = 0;
   	   	   checkLockStatus(locked);
   	   	   return;
   	   }else{
   	   	   layer.tips('模拟锁屏，输入密码：larrycms 解锁', $('#unlock'), {
				tips: [3, '#FF5722'],
				time:1000
			});
   	   	   return;
   	   }  
   }
   // 监控lock_password 键盘事件
   $('#unlock_pass').keypress(function(e){
        if (window.event && window.event.keyCode == 13) {
            unlockSys();
            return false;
        }
    });
    $(document).keydown(function() {
        return key(arguments[0])
    });
    function startTimer(){
   	    var today=new Date();
        var h=today.getHours();
        var m=today.getMinutes();
        var s=today.getSeconds();
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        $('#time').html(h+":"+m+":"+s);
        t=setTimeout(function(){startTimer()},500);
   }
   // 锁屏状态检测
   function checkLockStatus(locked){
        // 锁屏
        if(locked == 1){
        	$('.lock-screen').show();
            $('#locker').show();
            $('#larry_admin_out').hide();
            $('#lock_password').val('');
        }else{
        	$('.lock-screen').hide();
            $('#locker').hide();
            $('#larry_admin_out').show();
        }
    } 
    
    // 兼容蛋疼的移动端
	$('#larryMobile').on('click', function() {
		if ($('.larry-mobile #larry_left').css("display") == "none") {
			$('.larry-mobile #larry_left').show();
		} else {
			$('.larry-mobile #larry_left').hide();
		}
        
        if ($('.larry-mobile .larrycms-top-menu').css("display") == "none") {
			$('.larry-mobile .larrycms-top-menu').show();
		} else {
			$('.larry-mobile .larrycms-top-menu').hide();
		}

	});
    var device = layui.device();
	// 兼容IE8 chrome 60以下版本 calc
	if(device.ie && device.ie <9){
          $('.larrycms-top').width($('#larry_admin_out').width()-200);
	}else if(navigator.userAgent.indexOf("Chrome") <= 60 && navigator.userAgent.indexOf("Chrome") > -1){
          $('.larrycms-top').width($('#larry_admin_out').width()-200);
	}

});