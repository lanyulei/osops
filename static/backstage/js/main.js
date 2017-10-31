layui.use(['jquery', 'common', 'layer', 'element'], function() {
	var $ = layui.jquery,
		layer = layui.layer,
		common = layui.common,
		element = layui.element;

	$('#shortcut section.panel').on('click', function() {
		var title = $(this).children('.right-value').find('h3').text();
		var href = $(this).children('.right-value').find('a').data('href');
		var icon = $(this).children('larry-ico').children('i').text();
		var data = {
			title: title,
			href: href,
			icon: icon
		}
		top.larryTab.tabAdd(data);
	});
    
	$('.larry-panel .tools').on('click',function(){
           if($(this).hasClass('down')){
               $(this).addClass('up').removeClass('down');
               $(this).children('i').remove();
               $(this).append('<i class="larry-icon">&#xe9eb;</i>');
               $(this).parent('.larry-panel-header').siblings('.larry-panel-body').slideToggle();
           }else{
               $(this).addClass('down').removeClass('up');
               $(this).children('i').remove();
               $(this).append('<i class="larry-icon">&#xe93a;</i>');
               $(this).parent('.larry-panel-header').siblings('.larry-panel-body').slideToggle();
           }
	});

	common.larryCmsLoadJq('/static/common/plus/jquery.leoweather.min.js', function() {
		$('#weather').leoweather({
			format: '，{时段}好！<span id="colock">现在时间是：<strong>{年}年{月}月{日}日 星期{周} {时}:{分}:{秒}</strong>，</span> <b>{城市}天气</b> {天气} {夜间气温}℃ ~ {白天气温}℃'
		});
		$('#closeInfo').on('click', function() {
			$('#infoSwitch').hide();
		});
	});

});