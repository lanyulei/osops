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

	common.larryCmsLoadJq('../common/plus/jquery.leoweather.min.js', function() {
		$('#weather').leoweather({
			format: '，{时段}好！<span id="colock">现在时间是：<strong>{年}年{月}月{日}日 星期{周} {时}:{分}:{秒}</strong>，</span> <b>{城市}天气</b> {天气} {夜间气温}℃ ~ {白天气温}℃'
		});
		$('#closeInfo').on('click', function() {
			$('#infoSwitch').hide();
		});
	});

	common.larryCmsLoadJq('../common/plus/echarts.min.js', function() {
			var myChart = echarts.init(document.getElementById('larry_counts'));
			option = {
				title: {
					text: '用户访问来源',
					subtext: '纯属虚构',
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
				},
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [{
						value: 335,
						name: '直接访问'
					}, {
						value: 310,
						name: '邮件营销'
					}, {
						value: 234,
						name: '联盟广告'
					}, {
						value: 135,
						name: '视频广告'
					}, {
						value: 1548,
						name: '搜索引擎'
					}],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}]
			};
			myChart.setOption(option);
			window.onresize = function(){
                 myChart.resize();
			};
	});
});