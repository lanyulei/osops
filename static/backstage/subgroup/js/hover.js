layui.use(['jquery', 'layer','common'], function() {
	var $ = layui.jquery,
	   common = layui.common,
		layer = layui.layer;
	common.larryCmsLoadJq('../../common/plus/clipboard.min.js', function() {
		$('#effects').find('a').each(function(k, v) {

			$(v).attr('data-clipboard-text', $(v).attr('class'));
		});
		var btns = document.querySelectorAll('a');
		var clipboard = new Clipboard(btns);

		clipboard.on('success', function(e) {
			common.larryCmsMessage('已成功复制' + e.text, 'success', 1500);
		});

	});
});