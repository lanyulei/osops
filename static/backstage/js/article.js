layui.use(['layer', 'form', 'table', 'common'], function() {
	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		common = layui.common;

	var tableIns = table.render({
		elem: '#article',
		cols: [
			[{
				checkbox: true,
				width: 60,
				fixed: true
			}, {
				field: 'id',
				width: 60,
				title: 'ID',
				sort: true,
			}, {
				field: 'title',
				width: 400,
				title: '文章标题',
				align: 'center',
				templet: '#titleTpl'
			}, {
				field: 'chanel',
				width: 120,
				title: '所属栏目',
				align: 'center',
			}, {
				field: 'autor',
				width: 120,
				title: '作者',
				align: 'center',
			}, {
				field: 'status',
				width: 150,
				title: '审核状态',
				align: 'center',
				templet: '#statusTpl'
			}, {
				field: 'sendtime',
				width: 150,
				title: '发布时间',
				align: 'center',
			}, {
				field: 'pubtime',
				width: 150,
				title: '审核时间',
				align: 'center',
			}, {
				title: '常用操作',
				width: 200,
				align: 'center',
				toolbar: '#articleBar',
				fixed:"right"
			}]

		],
		url: '../../datas/article.json',
		page: true,
		even: true,

	});

	//监听工具条
	table.on('tool(articles)', function(obj) {
		var data = obj.data;
		if (obj.event === 'yulan') {
			layer.alert('预览：<br>' + JSON.stringify(data))
		}else if (obj.event === 'edit') {
			layer.alert('编辑行：<br>' + JSON.stringify(data))
		}else if (obj.event === 'shenhe') {
			layer.alert('审核行：<br>' + JSON.stringify(data))
		}else if (obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				obj.del();
				layer.close(index);
			});
		}
	});

	$('#larry_group .layui-btn').on('click',function(){
          var type = $(this).data('type');
          active[type] ? active[type].call(this) : '';
	});

	var active = {
        add:function(){
           common.larryCmsMessage('最近好累，还是过段时间在写吧！','error');
        },
        edit:function(){
           common.larryCmsMessage('最近好累，还是过段时间在写吧！','error');
        },
        del:function(){
           common.larryCmsMessage('最近好累，还是过段时间在写吧！','error');
        }

	};
});