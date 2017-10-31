layui.use(['layer', 'form', 'table', 'common'], function() {
	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		common = layui.common;

	var tableIns = table.render({
		elem: '#userTables',
		cols: [
			[{
				checkbox: true,
				width: 60,
				fixed: true
			}, {
				field: 'id',
				width: 80,
				title: 'ID',
				sort: true,
				// fixed: true
			}, {
				field: 'username',
				width: 150,
				title: '用户名',
				align: 'center',
			}, {
				field: 'group',
				width: 150,
				title: '用户组',
				align: 'center',
			}, {
				field: 'phone',
				width: 150,
				title: '手机号',
				align: 'center',
			}, {
				field: 'status',
				width: 150,
				title: '状态',
				align: 'center',
			}, {
				field: 'lastip',
				width: 150,
				title: '最后一次登录ip',
				align: 'center',
			}, {
				field: 'lasttime',
				width: 150,
				title: '上一次登录时间',
				align: 'center',
			}, {
				title: '常用操作',
				width: 260,
				align: 'center',
				toolbar: '#userbar',
				fixed:"right"
			}]

		],
		url: '../../datas/user.json',
		page: true,
		even: true,

	});

	//监听工具条
	table.on('tool(userTables)', function(obj) {
		var data = obj.data;
		if (obj.event === 'edit') {
			layer.alert('编辑行：<br>' + JSON.stringify(data))
		}else if (obj.event === 'shouquan') {
			layer.alert('授权行：<br>' + JSON.stringify(data))
		}else if (obj.event === 'disable') {
			layer.alert('禁用行：<br>' + JSON.stringify(data))
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