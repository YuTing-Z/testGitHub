var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        // showEdit:false,
        role: {},
        roleStateList: []
    },
    methods: {

        add() {
            //控制显示
            // vm.showEdit=true;
            vm.showList = false;

            vm.role = {
                status: false,
                menuIds:[]
            };

            this.loadData();
            vm.role['_method'] = 'POST';
            //提交处理(提交前的验证)
            this.handleSubmit();

        },
        edit(id) {
            //控制显示
            // vm.showEdit=true;
            vm.showList = false;
            vm.role = {
                menuIds:[]
            };

            //绑定user对象,根据id从数据查询信息
            $.ajax({
                url: "/sys/role/" + id,
                type: "get",
                dataType: "json",
                success: function (res) {
                    if (res.status == 200) {
                        vm.role = res.data;
                        //把status变成boolean类型
                        vm.role.status=vm.role.status==0?true:false;
                        vm.role['_method'] = 'PUT';
                        //加载和绑定数据
                        vm.loadData(id);
                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error: function () {
                    $.modal.alertError("服务器正忙...")
                }
            });


        },
        loadData(id) {
            var  url= "";
            if($.common.isEmpty(id)){
               url="/sys/menu"
            }else{
                url= '/sys/menu/findByRoleId/' +id;
            }
            var treeOptions = {
                url: url,
                idKey: "menuId",
                pIdKey: "parentId",
                name: "menuName",
                checkFlag: true,
                expandAll: false,
                clk: zOnClick
            };
            $.tree.init(treeOptions);
            function zOnClick(event, treeName, treeNode) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                var checkedNodes = tree.getCheckedNodes();
                var menuIds = [];
                for(var node of checkedNodes){
                    menuIds.push(node.menuId);
                }
                vm.role.menuIds=menuIds;
                event.preventDefault();
            }
        },
        queryRole() {
            var options = {};
            options.url = "/sys/role";
            options.sortOrder = "desc";
            options.sortName = "roleId";
            options.id = "roleId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'roleId',
                    title: '角色ID',
                    align: "center",
                    sortable: true

                }, {
                    field: 'roleName',
                    title: '角色名称',
                    sortable: true
                }, {
                    field: 'roleKey',
                    title: '权限字符',
                    sortable: true
                }, {
                    field: 'roleSort',
                    title: '显示顺序',
                    sortable: true
                }, {
                    field: 'createTime',
                    title: '创建时间'
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
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\'' + row.roleId + '\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\'' + row.roleId + '\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }
            ];

            $.table.init(options);
        },
        back() {
            vm.showEdit = false;
            vm.showList = true;
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-role').data('bootstrapValidator').resetForm(true)
        },
        handleSubmit() {
            $("#form-role").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {},
                submitHandler: function (validator, form, submitButton) {
                    vm.role.status = vm.role.status == true ? 0 : 1;
                    vm.saveOrUpdate();
                }
            })
        },
        saveOrUpdate() {


            var url = "/sys/role";
            $.ajax({
                url: url,
                type: $.common.isEmpty(vm.role['_method']) ? "post" : vm.role['_method'],
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(vm.role),
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
                    vm.roleStateList=res.data;
                    vm.queryRole();
                }else{
                    $.modal.msgError('查询角色状态失败');
                }
            }
        })
    }
});
