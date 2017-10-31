layui.use(['jquery', 'layer', 'form', 'upload'], function() {
	var $ = layui.$,
		layer = layui.layer,
		upload = layui.upload,
		form = layui.form;


	var uploadInst = upload.render({
		elem: '#larry_photo' //绑定元素
			,
		url: '/upload/' //上传接口
			,
		done: function(res) {
			//上传完毕回调
		},
		error: function() {
			//请求异常回调
		}
	});
});