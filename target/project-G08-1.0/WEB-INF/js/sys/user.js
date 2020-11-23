
$(function () {
    $("#app").css("height", $(window).height());
    $('#app').layout();

    //日期范围限制
    var start = {
        elem: '#start',
        format: 'YYYY-MM-DD hh:mm:ss',
        //min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istime: true,
        istoday: true,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD hh:mm:ss',
        //min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: true,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    laydate(start);
    laydate(end);

    //初始化select2和icheck
    init();

});


function init() {
    //select2
    $("[name='post']").select2();
    //select2值改变事件
    $("[name='post']").on("change", function () {
        vm.user.postIds = $("[name='post']").select2("val");
    });

    //icheck
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    //icheck值改变的事件
    $(".i-checks").on("ifChanged", function () {
        var roleIds = [];
        $("input[name='role']:checked").each(function (index, item) {
            roleIds.push($(item).val());
        });
        vm.user.roleIds = roleIds;
    });


}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        showEdit: false,
        userStateList: [],
        user: {
            dept: {}
        },
        sexList: [],
        postList: [],
        roleList: []
    },
    methods: {

        add() {
            //控制显示
            vm.showEdit = true;
            vm.showList = false;

            //实始化user对象
            vm.user = {
                dept: {},
                status: false,
                postIds: [],
                roleIds: []
            };

            //加载数据
            this.loadData();

            //提交处理(提交前的验证)
            this.handleSubmit();

        },
        edit(id) {

            //控制显示
            vm.showEdit = true;
            vm.showList = false;

            //实始化user对象
            vm.user = {
                dept: {},
                postIds: [],
                roleIds: []
            };

            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/sys/user/"+id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.user=res.data;
                        //把status变成boolean类型
                        vm.user.status=vm.user.status==0?true:false;
                        vm.user['_method']='put';
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });

            //加载和绑定数据
            this.loadData();

            //提交处理(提交前的验证)
            this.handleSubmit();
        },
        loadData() {
            //加载性别
            $.ajax({
                url: "/sys/dictData/byType",
                type: "get",
                dataType: "json",
                data: {type: "sys_user_sex"},
                async: false,
                success: function (res) {
                    vm.sexList = res.data;
                },
                error: function () {
                    $.modal.alertError("系统正忙，请稍后再试");
                }
            });

            //加载岗位
            $.ajax({
                url: "/sys/post/listAll",
                type: "get",
                dataType: "json",
                async: false,
                success: function (res) {
                    vm.postList = res.data;//vm.unique(res.rows,'postName');
                },
                error: function () {
                    $.modal.alertError("系统正忙，请稍后再试");
                }
            });

            //加载角色
            $.ajax({
                url: "/sys/role/listAll",
                type: "get",
                dataType: "json",
                async: false,
                success: function (res) {
                    vm.roleList = res.data;//vm.unique(res.rows,'roleName');
                },
                error: function () {
                    $.modal.alertError("系统正忙，请稍后再试");
                }
            });
        },
        queryDeptTree() {
            var options = {
                url: "/sys/dept",
                idKey: "deptId",
                pIdKey: "parentId",
                name: "deptName",
                expandAll:true,
                clk: zOnClick
            };

            function zOnClick(event, treeName, treeNode) {
                $("input[name='deptId']").val(treeNode.deptId);
                $("input[name='deptName']").val(treeNode.deptName);

                vm.user.dept.deptName = $("input[name='deptName']").val();
                vm.user.dept.deptId = $("input[name='deptId']").val();
                if(vm.showList) {
                    $.table.refresh();
                }
            }

            $.tree.init(options);
        },
        dept() {
            alert("跳转到部门管理页面");
        },
        queryUser() {
            var options = {};
            options.url = "/sys/user";
            options.sortOrder = "desc";
            options.sortName = "userId";
            options.id = "userId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'userId',
                    title: '用户ID',
                    align: "center",
                    sortable: true

                },  {
                    field: 'userName',
                    title: '用户名称',
                    sortable: true
                }, {
                    field: 'dept.deptName',
                    title: '部门',
                    sortable: true
                }, {
                    field: 'email',
                    title: '邮箱',
                    sortable: true
                }, {
                    field: 'phonenumber',
                    title: '手机',
                    sortable: true
                }, {
                    field: 'status',
                    title: '状态',
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                }, {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        if(editFlag)
                             actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.userId + '\')"  ><i class="fa fa-edit"></i>编辑</a>');
                        if(removeFlag)
                            actions.push(' <a  class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.userId + '\')" ><i  class="fa fa-remove"></i>删除</a>');
                        actions.push(' <a class="btn btn-info btn-xs" href="javascript:void(0)" onclick="vm.updatePassword(\'' + row.userId + '\',\'' + row.userName + '\')"><i class="fa fa-key"></i>重置</a>');
                        return actions.join("");
                    }
                }
            ];

            $.table.init(options);
        },
        removeAll() {
            $.operate.remove();
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            vm.user.dept={};

            //this.queryUser();
            $("#bootstrap-table").bootstrapTable("refresh");
            //重置验证
            $('#form-user').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-user").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {},
                submitHandler: function(validator, form, submitButton) {


                    vm.user.status == true ? vm.user.status = 0 : vm.user.status = 1;
                    vm.saveOrUpdate();
                }
            })
            /*.on('success.form.bv', function (e) {
                debugger;
                vm.saveOrUpdate();
                return false;
            });*/
        },
        saveOrUpdate() {
            var url = "/sys/user";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.user['_method'])?"post":vm.user['_method'],
                dataType: "json",
                contentType:"application/json",
                data: JSON.stringify(vm.user),
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
        },
        updatePassword(userId, userName) {
            vm.user = {
                userId: '',
                userName: '',
                password: '',

                dept: {}
            };
            vm.user.userId = userId;
            vm.user.userName = userName;
            //修改密码
            $.modal.openHtml('重置密码', $("#passwordLayer"), "500", "300", function (index) {
                vm.user['_method']="PUT";
                $.operate.submit("/sys/user/resetPwd",vm.user,"POST");
                layer.close(index);
                $.modal.msgSuccess("重置成功");
            })
        },
        unique(arrs,name){
            let result = {};
            let finalResult=[];
            for(let i=0;i<arrs.length;i++){
                result[arrs[i][name]]=arrs[i];
                //因为songs[i].postName不能重复,达到去重效果,且这里必须知晓"postName"或是其他键名
            }
            for(item in result){
                finalResult.push(result[item]);
            }
            return finalResult;
        }
    },
    mounted() {

        $.ajax({
            url:'/sys/dictData/byType',
            type:'get',
            data:{'type':'sys_normal_disable'},
            dataType:'json',
            success:function (res) {
                if(res.status==200){
                    vm.userStateList=res.data;
                    //再初始化部门和用户列表
                    vm.queryDeptTree();
                    vm.queryUser();
                }else{
                    $.modal.msgError('查询用户状态失败');
                }
            }
        });
    },
    updated() {
        init();
    }
});
