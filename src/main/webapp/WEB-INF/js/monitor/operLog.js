$(function () {
    init();
});

function init() {
    //icheck
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    //icheck值改变的事件
    $(".i-checks").on("ifChanged", function () {
        vm.operLog.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        operLog: {
            status: 0
        },
        operLogStateList: []
    },
    methods: {
        add() {
            //控制显示
            vm.showList = false;

            vm.operLog['_method'] = 'POST';
            this.handleSubmit();
        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/monitor/operLog/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.operLog = res.data;
                        vm.operLog['_method'] = 'PUT';

                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });
        },
        queryOperLog() {
            var options = {};
            options.url = "/monitor/operLog";
            options.sortOrder = "desc";
            options.sortName = "operId";
            options.id = "operId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'operId',
                    title: '日志主键',
                    sortable: true,
                    visible:false
                },
                {
                    field: 'title',
                    title: '模块标题',
                    sortable: true
                },
                {
                    field: 'businessType',
                    title: '业务类型',
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-default">其它</span>';
                        else if (value == '1')
                            return '<span class="badge badge-primary">新增</span>';
                        else if (value == '3')
                            return '<span class="badge badge-danger">删除</span>';
                        else
                            return '<span class="badge badge-info">修改</span>';
                    }
                },
                {
                    field: 'method',
                    title: '方法名称',
                    sortable: true
                },
                {
                    field: 'requestMethod',
                    title: '请求方式',
                    sortable: true
                },

                {
                    field: 'operName',
                    title: '操作人员',
                    sortable: true
                },
                {
                    field: 'deptName',
                    title: '部门名称',
                    sortable: true
                },
                {
                    field: 'operIp',
                    title: '主机地址',
                    sortable: true
                },
                {
                    field: 'operLocation',
                    title: '操作地点',
                    sortable: true
                },

                {
                    field: 'status',
                    title: '操作状态',
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.operId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.operLog = {
                status: 0
            }
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-operLog').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-operLog").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {},
                submitHandler: function (validator, form, submitButton) {
                    vm.saveOrUpdate();
                }
            })
            /*.on('success.form.bv', function (e) {
                vm.saveOrUpdate();
                return false;
            });*/
        },
        saveOrUpdate() {
            var url = "/monitor/operLog";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.operLog['_method']) ? "post" : vm.operLog['_method'],
                dataType: "json",
                contentType:"application/json",
                data:  JSON.stringify(vm.operLog),
                success: function (res) {
                    if (res.status == 200) {
                        $.modal.msgSuccess(res.msg);
                        vm.back();
                    } else {
                        $.modal.msgError(res.msg);
                    }
                },
                error: function (error) {
                    $.modal.alertError("服务器正忙，请稍后再试...");
                }
            });
        }
    },
    mounted() {
        //先查询岗位的状态
        var params =
            {
                method: "dictDataByType",
                type: "sys_common_status"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.operLogStateList = res.data.data;
            vm.queryOperLog();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated() {
        init();
    }

});
