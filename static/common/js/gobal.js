layui.config({
	base: '/static/common/lib/'
});
layui.use(['jquery','layer','element','common'],function(){
	var $ = layui.$,
	layer = layui.layer,
	common = layui.common,
	device = layui.device(),
	element = layui.element;

	$(document).ready(function() {
		// 浏览器兼容检查
		if (device.ie && device.ie < 9) {
			common.larryCmsError('本系统最低支持ie8，您当前使用的是古老的 IE' + device.ie + '！ \n 建议使用IE9及以上版本的现代浏览器', common.larryCore.tit);
		}
        // 移动设备适配
        if(device.android || device.ios){
             if($('#larry_admin_out').length>0){
                $('#larry_admin_out').addClass('larry-mobile');
             }else{
                $('body').addClass('larry-mobile');
             }
        }else{
            if($('#larry_admin_out').length>0){
                if($('#larry_admin_out').hasClass('larry-mobile')){
                    $('#larry_admin_out').removeClass('larry-mobile');
                }
             }else{
                if($('body').hasClass('larry-mobile')){
                    $('body').removeClass('larry-mobile');
                }
             }
        }
	});
});
 