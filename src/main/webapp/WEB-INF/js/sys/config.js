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
        vm.config.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        config: {
            status: 0
        },
        configStateList: []
    },
    methods: {
        add() {
            //控制显示
            vm.showList = false;

            vm.config['_method'] = 'POST';
            this.handleSubmit();
        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/sys/config/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.config = res.data;
                        vm.config['_method'] = 'PUT';

                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });
        },
        queryConfig() {
            var options = {};
            options.url = "/sys/config";
            options.sortOrder = "desc";
            options.sortName = "configId";
            options.id = "configId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'configId',
                    title: '参数主键',
                    sortable: true
                },
                {
                    field: 'configName',
                    title: '参数名称',
                    sortable: true
                },
                {
                    field: 'configKey',
                    title: '参数键名',
                    sortable: true
                },
                {
                    field: 'configValue',
                    title: '参数键值',
                    sortable: true
                },
                {
                    field: 'configType',
                    title: '系统内置',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == 'Y')
                            return '<span class="badge badge-primary">是</span>';
                        else
                            return '<span class="badge badge-danger">否</span>';
                    }
                },

                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.configId + '\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.configId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.config = {
                status: 0
            }
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-config').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-config").bootstrapValidator({
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
            var url = "/sys/config";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.config['_method']) ? "post" : vm.config['_method'],
                dataType: "json",
                contentType:"application/json",
                data:  JSON.stringify(vm.config),
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
                type: "sys_yes_no"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.configStateList = res.data.data;
            vm.queryConfig();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated() {
        init();
    }

});
