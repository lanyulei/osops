/**
 * LarryCMS Common模块
 * Autor: Larry 
 * site: www.larrycms.com
 * Date :2017-01-24
 */
layui.define(['element','layer','jquery'],function(exports){
   var $ = layui.$,
       device = layui.device(),
       layer = layui.layer,
       element = layui.element;
   var LarryCommon = {
        larryCore: {
            tit: 'LarryCMS提示您：',
            version: 'LarryCMSV1.9',
            errorTit:'LarryCMS错误提示！',
            errorDataTit:'数据源配置出错',
            paramsTit:'LarryMS参数错误提示',
            closeTit:'关闭失败提示'
        },
        closeIndexs: {},
       /**
        * 关闭弹出层
        */
        larryCmsClose: function() {
            if (!this.closeIndexs['_' + this.index]) {
                this.closeIndexs['_' + this.index] = true;
                return layer.close(this.index);
            }
        },
        /**
         * 弹出警告消息框
         * @param msg 消息内容
         * @param callback 回调函数
         * @return {*|undefined}
         */
        larryCmsalert: function(msg, callback) {
            this.larryCmsClose();
            return this.index = layer.alert(msg, {
                end: callback,
                scrollbar: false
            });
        },
       /**
        * @description 抛出异常错误信息
        * @link        http://www.larrycms.com/
        * @copyright   [LarryCMS]
        * @author Larry_qin 2017-08-10
        * @param       {[type]}                 msg   [description]
        * @param       {[type]}                 title [description]
        * @return      {[type]}                       [description]
        */
       larryCmsError: function(msg,title){
           parent.layer.alert(msg,{
              title: title,
              skin:'larry-debug',
			  icon: 2,
			  time: 0,
			  resize: false,
			  zIndex: layer.zIndex,
			  anim: Math.ceil(Math.random() * 6)
           });
           return;
       },
       /**
        * @description 成功提示信息
        * @link        http://www.larrycms.com/
        * @copyright   [LarryCMS]
        * @author Larry_qin 2017-08-10
        * @param       {[type]}                 msg   [description]
        * @param       {[type]}                 title [description]
        * @param       {[type]}                 time [description]
        * @return      {[type]}                       [description]
        */
        larryCmsSuccess: function(msg, title,time) {
            this.larryCmsClose();
            return this.index = parent.layer.alert(msg, {
                title: title,
                skin:'larry-green',
                icon: 1,
                time: (time || 0) * 1000,
                resize: false,
                zIndex: layer.zIndex,
                anim: Math.ceil(Math.random() * 6)
            });
        },
       /**
        * @description 确认对话框
        * @link        http://www.larrycms.com/
        * @copyright   [LarryCMS]
        * @author Larry_qin 2017-08-11
        * @param       {[type]}                 msg  [提示消息内容]
        * @param       {[type]}                 callback_ok [确认的回调函数]
        * @param       {[type]}                 callback_no  [取消的回调函数]
        * @return      {[type]}                      [description]
        */
        larryCmsConfirm: function(msg, callback_ok, callback_no) {
            var self = this;
            return this.index = layer.confirm(msg, {
                icon: 3,
                skin:'larry-green',
                title: self.larryCore.tit,
                offset: '200px',
                closeBtn: 0,
                skin: 'layui-layer-molv',
                anim: Math.ceil(Math.random() * 6),
                btn: ['确定', '取消']
            }, function(index) {
                if (callback_ok && typeof callback_ok == "function") {
                    callback_ok.call(this);
                }
                layer.close(index);
            }, function(index) {
                if (callback_no && typeof callback_no == "function") {
                    callback_no.call(this);
                }
                layer.close(index);
            });
        },
       // 系统消息提示处理
       /**
        * @description 
        * @link        http://www.larrycms.com/
        * @copyright   [LarryCMS]
        * @author Larry_qin 2017-08-11
        * @param       {[type]}                 msg  [description]
        * @param       {[type]}                 mark [description]
        * @return      {[type]}                      [description]
        */
       larryCmsMessage: function(msg,mark,time){
           var  that = this;
            msg = msg || 'default';
            mark = mark || 'other';
            Time = time || 2000;
            var htmlcon = htmldoc(function() {/*
                <div class="larrycms-message" id="messageBox">
                    <div class="message-con clearfix" id="msgstatus">
                        <i id="larryicon" class="larry-icon"></i>
                        <div id="resultmsg" class='resultmsg'>larry</div>
                    </div>
                </div>               
            */});
            var screenHeight = $(window).height();
            if(msg != 'default'){
            	if(mark == 'success' || mark == 'error'){
                    var index = layer.open({
                        type: 1,
                        closeBtn: 0, 
                        anim: Math.ceil(Math.random() * 6),
                        shadeClose: false,
                        shade: 0,
                        title: false,
                        area: ['520px', 'auto'],
                        content: htmlcon,
                        time: Time,
                        resize: false,
                        offset: [(screenHeight > 760) ? ((screenHeight - 320) / 2 + "px") : "60px"],
                        success: function(layero, index) {
                            $("#resultmsg").text(msg);
                            if(mark == 'success'){
                                $('#larryicon').addClass('larry-chenggongtishi1');
                            }else{
                                $('#messageBox').addClass('larry-message-error');
                                $('#larryicon').addClass('larry-Error');
                            }
                            var conh = $('#messageBox').height();
                            if (conh > 97) {
                                $('#messageBox').addClass('addWidth');
                                $('#layui-layer' + index + ' .layui-layer-content').width(620);
                                $('#layui-layer' + index + ' .layui-layer-content').height($('#messageBox').height());
                                if ($('#messageBox').height() > 97) {
                                    var mtop = ($('#messageBox').height() - 90) / 2;
                                    $('#larryicon').css({"margin-top": mtop});
                                }
                            }
                        }
                    });
            	}else{
            		var index = layer.open({
                        type: 1,
                        closeBtn: 0,
                        anim: Math.ceil(Math.random() * 6),
                        shadeClose: false,
                        shade: 0,
                        title: false,
                        area: ['720px', 'auto'],
                        content: htmlcon,
                        time: 2000,
                        resize: false,
                        offset: [(screenHeight > 760) ? (screenHeight - 360) / 2 + "px" : "40px"],
                        success: function(layero, index) {
                            $("#resultmsg").text(that.larryCore.tit+msg);
                            $('#messageBox').addClass('larry-message-tips');
                            $('#larryicon').addClass('larry-xiaoxitishi');
                            var conh = $('#messageBox').height();
                            if (conh > 100) {
                                $('#messageBox').addClass('addWidth');
                                $('#layui-layer' + index + ' .layui-layer-content').width(720);
                                $('#layui-layer' + index + ' .layui-layer-content').height($('#messageBox').height());
                                if ($('#messageBox').height() > 100) {
                                    var mtop = ($('#messageBox').height() - 90) / 2;
                                    $('#larryicon').css({"margin-top": mtop});
                                }
                            }
                        }
                    });
            	}
            }else{

            }
            return;
       },
       /**
        * @description 加载jq第三方插件（可以使用layui Jq 也可以自定义传入任何版本的jq，并让依赖jq的第三方插件正常运行随调随用）
        * @link        http://www.larrycms.com/
        * @copyright   [LarryCMS]
        * @author Larry_qin 2017-08-10
        * @param       {[type]}                 jsUrl    [description]
        * @param       {Function}               callback [description]
        * @return      {[type]}                          [description]
        */
       larryCmsLoadJq: function(jsUrl,callback,jqUrl){
            
            var urlArray = jsUrl.split("?")[0].split("/");
            var js_src = urlArray[urlArray.length -1];
           
            var scripts = document.getElementsByTagName("script");
            // 构建plugin
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", jsUrl);
            script.setAttribute("async", true);
	        script.setAttribute("defer", true);

            var jqUrl = arguments[2] ? arguments[2] : '../common/js/jquery-1.12.4.min.js';
            var urlArrayJq = jqUrl.split("?")[0].split("/");
            var jq_src = urlArrayJq[urlArrayJq.length - 1];
            //环境中无$对象存在的时执行（基本用不上）
			if(!$) {
				// 构建jq
				var jq = document.createElement("script");
				jq.setAttribute("type", "text/javascript");
				jq.setAttribute("src", jqUrl);
				jq.setAttribute("async", false);
				jq.setAttribute("defer", false);
				var head = document.getElementsByTagName("head")[0];
			}

            var body = document.getElementsByTagName("body")[0];

            var userAgent = navigator.userAgent;
            // 判断jq及插件是否存在
			if(!!scripts && 0 != scripts.length) {
                var jsName = new Array();
                for (var i = 0; i < scripts.length; i++) {
					var jsArray = scripts[i].src.split("?")[0].split("/");
					jsName[i] = jsArray[jsArray.length - 1];
				}
				var num = $.inArray('layui.js', jsName);
				// 判断插件是否存在
				if(($.inArray(jq_src, jsName) == -1) && ($.inArray(js_src, jsName) == -1)) {
                    if (!window.jQuery && $) {
						window.jQuery = $;
						body.appendChild(script);
					}else if(!window.jQuery && !$) {
						head.appendChild(jq);
						body.appendChild(script);
					}else{
                        body.appendChild(script);
                    }
					runHack();
					return true;
				}else if(($.inArray(jq_src, jsName) != -1) && ($.inArray(js_src, jsName) == -1)) {
					var num2 = $.inArray(jq_src, jsName);
					body.appendChild(script);
					runHack();
					return true;
				}else if(($.inArray(jq_src, jsName) != -1) && ($.inArray(js_src, jsName) != -1)){
					//jq存在 插件也存在，当然直接使用咯！
					runHack();
					return true;
				}else{
					layer.alert('上下文环境中未检测到jquery文件引入，任何依赖jquery的第三方插件将不能正常运行！！！');
				}
			}
			function runHack() {
				// IE
				if (document.all) {
					script.onreadystatechange = function() {
						var state = this.readyState;
						if (state === 'loaded' || state === 'complete') {                         
							callback();
						}
					};
				} else {
					//firefox, chrome
					script.onload = function() {
						callback();
					};
				}
			}
       },
       // 退出系统注销登录
        logOut: function (title, text, url,type, dataType, data, callback) {
            parent.layer.confirm(text, {
                title: title,
                resize: false,
                btn: ['确定退出系统', '不，我点错了！'],
                btnAlign: 'c',
                icon: 3

            }, function () {

			location.href = url;
            }, function () {
                layer.msg('返回系统', {
                    time: 1500,
                    btnAlign: 'c',
                    btn: ['OK']
                });
            });
        }
   };
   /**
    * @description html处理函数
    * @link        http://www.larrycms.com/
    * @copyright   [LarryCMS]
    * @author Larry_qin 2017-08-11
    * @param       {Function}               fn [description]
    * @return      {[type]}                    [description]
    */
   function htmldoc(fn){
   	    return fn.toString().split('\n').slice(1,-1).join('\n')+'\n';
   }
   exports('common',LarryCommon);
});