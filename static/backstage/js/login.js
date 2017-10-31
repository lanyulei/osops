layui.use(['jquery','common','layer','form','larryMenu'],function(){
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        common = layui.common;
    // 页面上下文菜单
    var larryMenu = layui.larryMenu();

    var mar_top = ($(document).height()-$('#larry_login').height())/2.5;
    $('#larry_login').css({'margin-top':mar_top});
    common.larryCmsSuccess('用户名：larry 密码：larry 无须输入验证码，输入正确后直接登录后台!','larryMS后台帐号登录提示',20);
    var placeholder = '';
    $("#larry_form input[type='text'],#larry_form input[type='password']").on('focus',function(){
          placeholder = $(this).attr('placeholder');
          $(this).attr('placeholder','');
    });
    $("#larry_form input[type='text'],#larry_form input[type='password']").on('blur',function(){
          $(this).attr('placeholder',placeholder);
    });
    
    common.larryCmsLoadJq('../../common/plus/jquery.supersized.min.js', function() {
        $.supersized({
            // 功能
            slide_interval: 3000,
            transition: 1,
            transition_speed: 1000,
            performance: 1,
            // 大小和位置
            min_width: 0,
            min_height: 0,
            vertical_center: 1,
            horizontal_center: 1,
            fit_always: 0,
            fit_portrait: 1,
            fit_landscape: 0,
            // 组件
            slide_links: 'blank',
            slides: [{
                image: '../backstage/images/login/1.jpg'
            }, {
                image: '../backstage/images/login/2.jpg'
            }, {
                image: '../backstage/images/login/3.jpg'
            }]
        });
    });

    form.on('submit(submit)',function(data){
        if(data.field.user_name == 'larry' && data.field.password == 'larry'){
            layer.msg('登录成功',{icon:1,time:1000});
            setTimeout(function(){
                window.location.href = 'index.html';
            },1000);
           
        }else{
            layer.tips('用户名:larry 密码：larry 无需输入验证码', $('#password'), {
               tips: [3, '#FF5722']
            });
        }
        return false;
    });

    // 右键菜单控制
    var larrycmsMenuData = [
        [{
            text: "刷新页面",
            func: function() {
                top.document.location.reload();
            }
        }, {
            text: "检查元素(F12)",
            func: function() {
                common.larryCmsError('抱歉！暂不支持此功能，可加入LarryCMS交流群下载源码',common.larryCore.tit);
            }
        }],
        [{
            text: "访问larryCMS官网",
            func: function() {
                window.open('http://www.larrycms.com');
            }
        },{
            text: "给larryMS点个赞",
            func: function() {
                window.open('http://fly.layui.com/case/u/109200');
            }
        }]
    ];
    larryMenu.ContentMenu(larrycmsMenuData,{
         name: "html" 
    },$('html'));
});
    