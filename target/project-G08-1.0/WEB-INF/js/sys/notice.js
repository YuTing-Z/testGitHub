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
        vm.notice.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        notice: {
            status: 0,
            noticeType: 1
        },
        noticeStateList: [],
        noticeTypeList: []
    },
    methods: {
        add() {
            //控制显示
            vm.showList = false;

            vm.notice['_method'] = 'POST';
            this.handleSubmit();
        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/sys/notice/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.notice = res.data;
                        vm.notice['_method'] = 'PUT';

                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });
        },
        queryNotice() {
            var options = {};
            options.url = "/sys/notice";
            options.sortOrder = "desc";
            options.sortName = "noticeId";
            options.id = "noticeId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'noticeId',
                    title: '公告ID',
                    sortable: true
                },
                {
                    field: 'noticeTitle',
                    title: '公告标题',
                    sortable: true
                },
                {
                    field: 'noticeType',
                    title: '公告类型',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">通知</span>';
                        else
                            return '<span class="badge badge-info">公告</span>';
                    }
                },
                {
                    field: 'noticeContent',
                    title: '公告内容',
                    sortable: true
                },
                {
                    field: 'status',
                    title: '公告状态',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">关闭</span>';
                    }
                },

                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.noticeId + '\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.noticeId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.notice = {
                status: 0
            }
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-notice').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-notice").bootstrapValidator({
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
            var url = "/sys/notice";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.notice['_method']) ? "post" : vm.notice['_method'],
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(vm.notice),
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

        var params2 =
            {
                method: "dictDataByType",
                type: "sys_notice_type"
            };

        axios.get("/sys/dictData/byType", {params: params}).then(function (res) {
            vm.noticeStateList = res.data.data;

            axios.get("/sys/dictData/byType", {params: params2}).then(function (res) {
                vm.noticeTypeList = res.data.data;
                vm.queryNotice();
            });

        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated() {
        init();
    }

});
