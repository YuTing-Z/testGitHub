$(function () {
   init();
});

function selTreeValue(parentId,parentName){
    $("#parentId").val( parentId);
    $("#parentMenuName").val(parentName);
    vm.menu.parentId=parentId;
    vm.menu.parentMenuName=parentName;
}

function init() {
    //icheck
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    //icheck值改变的事件
    $(".i-checks").on("ifChanged",function(){
        vm.menu.menuType=$("input[name='menuType']:checked").val();
        vm.menu.visible=$("input[name='visible']:checked").val();
    });

    var options = {
        "url": "/sys/menu",
        "idKey": "menuId",
        "pIdKey": "parentId",
        "name": "menuName",
    };
    localStorage.setItem("options",JSON.stringify(options));
}
var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        menuStateList: [],
        menu:{}
    },
    methods:{
        queryMenu(){
            var options={
                url:"/sys/menu",
                id:"menuId",
                columns:[
                    {
                        field: 'check',
                        checkbox: true
                    },
                    {
                        field: 'menuName',
                        title: '菜单名称',
                        align: "center",
                    },
                    {field: 'orderNum', title: '排序', align: 'center'},
                    {field: 'url', title: '请求地址'},
                    {
                        title: '类型',
                        field: 'menuType',
                        width: '10%',
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value == 'M') {
                                return '<span class="label label-success">目录</span>';
                            }
                            else if (value == 'C') {
                                return '<span class="label label-primary">菜单</span>';
                            }
                            else if (value == 'F') {
                                return '<span class="label label-warning">按钮</span>';
                            }
                        }

                    },
                    {
                        field: 'visible',
                        title: '可见',
                        width: '10%',
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '<span class="badge badge-primary">显示</span>';
                            } else if (value == 1) {
                                return '<span class="badge badge-danger">隐藏</span>';
                            }
                        }
                    },

                    {field: 'perms', title: '权限标识'},
                    {
                        field: 'operate',
                        title: '操作',
                        align: 'center',
                        formatter:function (value,row,index) {
                            var actions=[];
                            actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\''+row.menuId+'\')"><i class="fa fa-edit"></i>编辑</a>');
                            actions.push(' <a class="btn btn-info btn-xs" href="javascript:void(0)" onclick="vm.add(\''+row.menuId+'\',\''+row.menuName+'\')"><i class="fa fa-edit"></i>新增</a>');
                            actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\''+row.menuId+'\')"><i class="fa fa-remove"></i>删除</a>');
                            return actions.join("");
                        }
                    },
                ],
                showField:"menuName",
                pid:"parentId",
            }
            $.treegrid.init(options);

        },
        add(menuId,menuName){
            vm.showList=false;
            vm.menu={
                menuType:'M',
                visible:'0',
                icon:'',
                parentId:'0',
                parentMenuName:''
            };


            if(!$.common.isEmpty(menuId)){
                vm.menu.parentId=menuId;
                vm.menu.parentMenuName=menuName;
            }

            vm.menu['_method']='POST';
            //提交处理(提交前的验证)
            this.handleSubmit();
        },
        back(){
            vm.showList=true;
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-menu').data('bootstrapValidator').resetForm(true)

        },
        selectIcon(){
            $("#iconDiv").show();
        },
        selectMenuTree(){
            $.modal.openUrl("选择菜单","/sys/menu/tree","380","380");
        },
        handleSubmit(){
            $("#form-menu").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields:{},
                submitHandler: function(validator, form, submitButton) {
                    vm.saveOrUpdate();
                }
            })
        },
        saveOrUpdate(){
            var url ="/sys/menu";

            if(isNaN(vm.menu.parentId)){
                vm.menu.parentId='0';
            }
            $.ajax({
                url:url,
                type: $.common.isEmpty(vm.menu['_method'])?"post":vm.menu['_method'],
                dataType:"json",
                contentType:"application/json",
                data: JSON.stringify(vm.menu),
                success:function (res) {
                    if(res.status==200){
                        $.modal.msgSuccess(res.msg);
                        vm.back();
                    }else{
                        $.modal.msgError(res.msg);
                    }
                },
                error:function () {
                    $.modal.alertError("服务器正忙，请稍后再试...");
                }
            });
        },
        edit(id){

            //控制显示
            vm.showList=false;

            //绑定menu对象,根据id从数据查询信息
            $.ajax({
                url:"/sys/menu/"+id,
                type:"get",
                dataType:"json",
                success:function (res) {

                    if(res.status==200){
                        vm.menu=res.data;

                        vm.menu['_method']='PUT';
                        //提交处理(提交前的验证)
                        vm.handleSubmit();
                    }
                },
                error:function () {
                    $.modal.alertError("服务器正忙...")
                }
            });


        }
    },
    mounted(){
        //先查询菜单的状态
        var params =
            {
                method: "dictDataByType",
                type: "sys_show_hide"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.menuStateList=res.data.data;
            vm.queryMenu();
        }).catch(function(error){
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated(){
        init();
    }
});
