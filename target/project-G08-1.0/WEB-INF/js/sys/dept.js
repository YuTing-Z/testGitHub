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
    $(".i-checks").on("ifChanged",function(){
        vm.dept.status=$("input[name='status']:checked").val();
    });

    var options = {
        "url": "/sys/dept",
        "idKey": "deptId",
        "pIdKey": "parentId",
        "name": "deptName",
    };
    localStorage.setItem("options",JSON.stringify(options));
}
function selTreeValue(parentId,parentName){
    $("#parentId").val( parentId);
    $("#parentMenuName").val(parentName);
    vm.dept.parentId=parentId;
    vm.dept.parentMenuName=parentName;
}
var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        dept: {},
        deptStateList: []
    },
    methods: {

        add(deptId,deptName) {
            //控制显示
            vm.showList = false;
            vm.dept = {
                parentId:'',
                parentMenuName:'',
                status: 0
            };

            if(!$.common.isEmpty(deptId)){
                vm.dept.parentId=deptId;
                vm.dept.parentMenuName=deptName;
            }
            vm.dept['_method']='POST';
            //提交处理(提交前的验证)
            this.handleSubmit();

        },
        edit(id) {
            //控制显示
            vm.showList = false;
            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/sys/dept/"+id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.dept = res.data;

                        vm.dept['_method']='PUT';
                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });


        },
        queryDept() {

            var options = {};
            options.url = "/sys/dept";
            options.id = "deptId"; //主键
            options.showField = "deptName";
            options.pid = "parentId";
            options.columns = [
                {
                    field: 'check',
                    checkbox: true
                },
                {
                    field: 'deptName',
                    title: '部门名称',
                    align: "left"
                },
                {
                    field: 'orderNum',
                    title: '排序',
                    align: "left"
                },
                {
                    field: 'status',
                    title: '状态',
                    align: "left",
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                },
                {
                    field: 'phone',
                    title: '电话',
                    align: "center"
                },
                {
                    title: '操作',
                    align: 'left',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.deptId + '\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-info btn-xs" href="javascript:void(0)" onclick="vm.add(\'' + row.deptId + '\',\'' + row.deptName + '\')"><i class="fa fa-edit"></i>新增</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.deptId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];

            $.treegrid.init(options);
        },
        back() {
            vm.showList = true;
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-dept').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-dept").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {},
                submitHandler: function(validator, form, submitButton) {
                    vm.saveOrUpdate();
                }
            });
        },
        saveOrUpdate() {
            var url ="/sys/dept";

            if(isNaN(vm.dept.parentId)){
                vm.dept.parentId='0';
            }

            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.dept['_method'])?"post":vm.dept['_method'],
                dataType: "json",
                contentType:"application/json",
                data: JSON.stringify(vm.dept),
                success: function (res) {
                    if (res.status == 200) {
                        $.modal.msgSuccess(res.msg);
                        vm.back();
                    } else {
                        $.modal.msgError(res.msg);
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙，请稍后再试...");
                }
            });
        }, selectMenuTree() {
            $.modal.openUrl("选择菜单", "/sys/dept/tree", "380", "380");
        }
    },
    mounted() {
        //先查询部门状态
        var params =
            {
                method: "dictDataByType",
                type: "sys_normal_disable"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.deptStateList = res.data.data;
            vm.queryDept();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated(){
        init();
    }
});
