layui.use(['jquery', 'layer','common'], function() {
	var $ = layui.jquery,
	   common = layui.common,
		layer = layui.layer;

    $('#nums').text($('.icon_lists').find('li').length);
     $("#search_text").focus();
	$("#search_icon").click(function() {
		var txt = $("#search_text").val();
		if ($.trim(txt) != "") {
			$(".icon_lists li").hide().filter(":contains('" + txt + "')").show();
		} else {
			common.larryCmsMessage('请输入点什么再搜索吧！', 'error', 1500);
			$(".icon_lists li").show();
		}
	});

	$("#search_text").keydown(function() {
		if (event.keyCode == "13") {
			var txt = $("#search_text").val();
			if ($.trim(txt) != "") {
				$(".icon_lists li").hide().filter(":contains('" + txt + "')").show();
			} else {
				common.larryCmsMessage('请输入点什么再搜索吧！', 'error', 1500);
				$(".icon_lists li").show();
			}
		}
	});

	common.larryCmsLoadJq('../../common/plus/clipboard.min.js', function() {
		$('.icon_lists').find('li').each(function(k, v) {

			$(v).attr('data-clipboard-text', $(v).children('.code').text());
		});
		var btns = document.querySelectorAll('li');
		var clipboard = new Clipboard(btns);

		clipboard.on('success', function(e) {
			common.larryCmsMessage('已成功复制' + e.text, 'success', 1500);
		});

	});
    
});
