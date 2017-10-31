layui.use(['jquery', 'common'], function() {
	var $ = layui.jquery,
		common = layui.common;

	common.larryCmsLoadJq('/backstage/subgroup/js/jquery-migrate.min.js', function() {
		$(function() {
			if ($.browser.msie && $.browser.version < 10) {
				$('.jq22-explain').show();
			}

			var $animate = $('#animate');
			var $btn = $('.tabCnt').find('li');
			$btn.click(function() {
				$(this).addClass('active').siblings().removeClass('active');
				$animate.removeClass().addClass($(this).text() + ' animated infinite');
				setTimeout(removeClass, 1000);
			});

			function removeClass() {
				$animate.removeClass();
			}

			var $tabNavItem = $('.tabNav').find('a');
			var $tabPane = $('.tabPane');
			$tabNavItem.each(function(i) {
				$(this).click(function() {
					$(this).parent().addClass('active').siblings().removeClass('active');
					$tabPane.eq(i).addClass('active').siblings().removeClass('active');
					return false;
				});
			});
		});

	});
});