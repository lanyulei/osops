layui.use(['layer', 'form', 'table', 'common'], function() {
	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		common = layui.common;

	var tableIns =table.render({
		elem: '#flinklist',
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
				field: 'webname',
				width: 150,
				title: '网站名称',
				align:'center',
			}, {
				field: 'alink',
				width: 250,
				title: '链接地址',
				align:'center',
				templet: '#linkTpl'
			}, {
				field: 'email',
				title: '站长邮箱',
				align:'center',
				width: 200
			}, {
				field: 'addtime',
				title: '添加时间',
				align:'center',
				width: 130
			}, {
				field: 'dispos',
				title: '展示位置',
				align:'center',
		        width: 100
			}, {
				title: '操作',
				width: 200,
				align: 'center',
				toolbar: '#flinkbar',
				fixed: 'right',
			}]
		],
		url: '../../datas/flink.json',
		page: true,
		even: true,
	});


	//监听工具条
	table.on('tool(flinkTables)', function(obj) {
		var data = obj.data;
		if (obj.event === 'del') {
			layer.confirm('真的删除行么', function(index) {
				obj.del();
				layer.close(index);
			});
		} else if (obj.event === 'edit') {
			layer.alert('编辑行：<br>' + JSON.stringify(data))
		}
	});


	$('.larry-btn a.layui-btn').on('click',function(){
          var type = $(this).data('type');
          active[type] ? active[type].call(this) : '';
	});
    
    var active = {
         getSelect:function(){
            if($('#search_input').val()){
                var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});
                setTimeout(function(){
                     common.larryCmsSuccess('未查询到指定对象( 哈哈！这里是静态演示页，未使用本地存储和sessionStorage存储数据，露个脸我准备开始闪啦...！ )','查询结果提示！',10);
                     layer.close(index);
                },800);
            }else{
                layer.tips('建议还是请输入点什么再搜索吧！比如网站名称、展示位置', $('#search_input'), {
                   tips: [3, '#5FB878']
                });
            }
         },
		addLink: function() {
			var index = layer.open({
				title: "友情链接添加",
				type: 2,
				skin:'larry-green',
				offset: ['85px', '130px'],
				area: ['540px', '450px'],
				content: "flinkadd.html",
			});
		},
         delLink:function(){
         	common.larryCmsError('数据批量删除失败！',common.larryCore.errorTit,10);
         }
    };
    
    // 表格自适应解决
    // $(window).on('resize',function(){
    //       var tableHeaderW = $('.layui-table-header').outerWidth();
    //       var allSetW = 0;
    //       var numN = 0
    //       var divstyle = new Array();
    //       $('.layui-table-view .layui-table-header').find('th').each(function(k,o){
    //             if($(this).children('.layui-table-cell').outerWidth() !=50){
    //             	allSetW += $(this).children('.layui-table-cell').outerWidth();
    //             }else{
    //             	numN++;
    //                 divstyle.push($(this).children('div').attr('class'));
    //             }
    //       });
    //       console.log(tableHeaderW);
    //       console.log(allSetW);
    //       console.log(divstyle);
    //       var numN_w = (numN)*50;
    //       if(tableHeaderW>(allSetW+numN_w)){
    //       	  var avgW = (tableHeaderW-allSetW-50)/(numN);
    //           for(var i in divstyle){
    //           	  var cssName = divstyle[i].split("layui-table-cell ")[1];
    //           	  $('.layui-table-view .layui-table-header th .'+cssName).css({
    //           	  	"width":avgW,
    //           	  });
              	 
    //           	  var pos = cssName.split("layui-table-cell laytable-cell-1-");

    //           }

    //       }else{
          	
    //       }
    // }).resize();

});