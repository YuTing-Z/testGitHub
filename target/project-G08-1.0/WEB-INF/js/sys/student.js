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
        vm.student.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        student: {
            status: 0
        },
        studentStateList: []
    },
    methods: {
        add() {
            //控制显示
            vm.showList = false;

            vm.student['_method'] = 'POST';
            this.handleSubmit();
        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
               url: "/sys/student/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.student = res.data;
                        vm.student['_method'] = 'PUT';

                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });
        },
        queryStudent() {
            var options = {};
            options.url = "/sys/student";
            options.sortOrder = "desc";
            options.sortName = "id";
            options.id = "id"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                        {
                            field: 'id',
                            title: '学号 ',
                            sortable: true
                        },
                        {
                            field: 'name',
                            title: '姓名',
                            sortable: true
                        },
                        {
                            field: 'age',
                            title: '年龄',
                            sortable: true
                        },
                        {
                            field: 'gender',
                            title: '性别',
                            sortable: true
                        },
                        {
                            field: 'address',
                            title: '地址',
                            sortable: true
                        },
                        {
                            field: 'birthday',
                            title: '生日',
                            sortable: true
                        },
                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.id + '\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.id + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.student = {
                status: 0
            }
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-student').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-student").bootstrapValidator({
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
            var url = "/sys/student";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.student['_method']) ? "post" : vm.student['_method'],
                dataType: "json",
                contentType:"application/json",
                data:  JSON.stringify(vm.student),
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
            vm.studentStateList = res.data.data;
            vm.queryStudent();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated() {
        init();
    }

});
