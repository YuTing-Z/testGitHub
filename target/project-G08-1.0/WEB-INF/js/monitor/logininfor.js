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
        vm.logininfor.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        logininfor: {
            status: 0
        },
        logininforStateList: []
    },
    methods: {
        add() {
            //控制显示
            vm.showList = false;

            vm.logininfor['_method'] = 'POST';
            this.handleSubmit();
        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/monitor/logininfor/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.logininfor = res.data;
                        vm.logininfor['_method'] = 'PUT';

                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });
        },
        queryLogininfor() {
            var options = {};
            options.url = "/monitor/logininfor";
            options.sortOrder = "desc";
            options.sortName = "infoId";
            options.id = "infoId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'infoId',
                    title: '访问ID',
                    sortable: true
                },
                {
                    field: 'userName',
                    title: '用户账号',
                    sortable: true
                },
                {
                    field: 'ipaddr',
                    title: '登录IP地址',
                    sortable: true
                },
                {
                    field: 'loginLocation',
                    title: '登录地点',
                    sortable: true
                },
                {
                    field: 'browser',
                    title: '浏览器类型',
                    sortable: true
                },
                {
                    field: 'os',
                    title: '操作系统',
                    sortable: true
                },
                {
                    field: 'status',
                    title: '登录状态',
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                },
                {
                    field: 'msg',
                    title: '提示消息',
                    sortable: true
                },
                {
                    field: 'loginTime',
                    title: '访问时间',
                    sortable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.infoId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.logininfor = {
                status: 0
            }
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-logininfor').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-logininfor").bootstrapValidator({
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
            var url = "/monitor/logininfor";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.logininfor['_method']) ? "post" : vm.logininfor['_method'],
                dataType: "json",
                contentType:"application/json",
                data:  JSON.stringify(vm.logininfor),
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
                type: "sys_normal_disable"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.logininforStateList = res.data.data;
            vm.queryLogininfor();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated() {
        init();
    }

});
