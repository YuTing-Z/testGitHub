

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        post: {
            status:0
        },
        postStateList: []
    },
    methods: {
  
        queryGen() {
            var options = {};
            options.url = "/tool/gen";
            options.sortOrder = "desc";
            options.sortName = "createTime";
            options.uniqueId = "tableName"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
		            field: 'tableName',
		            title: '表名称',
                    sortable: true
		        },
		        {
		            field: 'tableComment',
		            title: '表描述',
                    sortable: true
		        },
		        {
		            field: 'createTime',
		            title: '创建时间',
                    sortable: true
		        },
		        {
		            field: 'updateTime',
		            title: '更新时间'
		        },
		        {
		            title: '操作',
		            align: 'center',
		            formatter: function(value, row, index) {
		                var msg = '<a class="btn btn-primary btn-xs" href="javascript:void(0)" onclick="vm.genCode(\'' + row.tableName + '\')"><i class="fa fa-bug"></i>生成代码</a> ';
		                return msg;
		            }
		        }];

            $.table.init(options);
        },
     // 生成代码
		genCode(tableName) {
		    $.modal.confirm("确定要生成" + tableName + "表代码吗？", function() {

		        layer.msg('执行成功,正在生成代码请稍后…', { icon: 1 });
				// $.operate.submit( "/tool/gen/code/"+tableName, "", "get");
				window.location.href="/tool/gen/code/"+tableName;
		    })
		},
		//批量生成代码
		batchGenCode() {
			var rows = $("#bootstrap-table").bootstrapTable("getSelections");
		    if (rows.length == 0) {
		        $.modal.alertWarning("请选择要生成的数据");
		        return;
		    }
		    $.modal.confirm("确认要生成选中的" + rows.length + "条数据吗?", function() {
				var names = [];
				$(rows).each(function (index, item) {
					names.push(item["tableName"]);
				});
		        layer.msg('执行成功,正在生成代码请稍后…', { icon: 1 });
				window.location.href="/tool/gen/code/"+names.join(",");
		    });
		}
    },
    mounted() {
    	 this.queryGen();
    }

});
