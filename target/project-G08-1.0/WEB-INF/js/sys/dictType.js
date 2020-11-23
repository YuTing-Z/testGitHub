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
        vm.dictType.status=$("input[name='status']:checked").val();
    });
}
var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        dictType:{},
        dictTypeStateList: []
    },
    methods: {
        queryDictType() {

            var options = {};
            options.url = "/sys/dictType";
            options.sortOrder = "desc";
            options.sortName = "dictId";
            options.id = "dictId"; //主键
            options.columns = [
                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'dictId',
                    title: '字典主键',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'dictName',
                    title: '字典名称',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'dictType',
                    title: '字典类型',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'status',
                    title: '状态',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if (value == '0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                },
                {
                    field: 'createBy',
                    title: '创建者',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },

                {
                    field: 'remark',
                    title: '备注',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions=[];
                        actions.push('<a class="btn btn-success btn-xs" href="javascript:void(0)" onclick="vm.edit(\''+row.dictId+'\')"><i class="fa fa-edit"></i>编辑</a>');
                        actions.push(' <a class="btn btn-info btn-xs" href="javascript:void(0)"   onclick="vm.detail(\''+row.dictId+'\',\''+row.dictType+'\',\''+row.dictName+'\')"><i class="fa fa-list-ul"></i>列表</a>');
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="$.operate.remove(\''+row.dictId+'\')"><i class="fa fa-remove"></i>删除</a>');
                        return actions.join("");
                    }
                }];
            $.table.init(options);
        },
        add() {
            vm.showList=false;
            vm.dictType={
                status:0
            };
            //提交处理(提交前的验证)
            this.handleSubmit();
        },
        handleSubmit(){
            $("#form-dictType").bootstrapValidator({
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
                /*.on('success.form.bv', function(e) {
                vm.saveOrUpdate();
                return false;
            });*/
        },
        saveOrUpdate(){
            var url = "/sys/dictType";
            $.ajax({
                url:url,
                type: $.common.isEmpty(vm.dictType['_method'])?"post":vm.dictType['_method'],
                dataType:"json",
                contentType:"application/json",
                data:JSON.stringify(vm.dictType),
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
                url: "/sys/dictType/"+id,
                type:"get",
                dataType:"json",
                success:function (res) {
                    if(res.status==200){
                        vm.dictType=res.data;
                        vm.dictType['_method']='put';
                    }
                },
                error:function () {
                    $.modal.alertError("服务器正忙...")
                }
            });

            //提交处理(提交前的验证)
            this.handleSubmit();
        },
        back(){
            vm.showList=true;
            $("#bootstrap-table").bootstrapTable("refresh");

            //重置验证
            $('#form-dictType').data('bootstrapValidator').resetForm(true)
        },
        detail(dictId,dictType,dictName){
            localStorage.setItem("dictId",dictId);
            localStorage.setItem("dictType",dictType);
            $.menu.menuItem("/sys/dictType/dictData",100,dictName);

            // parent.$('.J_menuItem').on('click', $.menu.menuItem);
        }
    },
    mounted() {
        //先查询状态
        var params =
            {
                method: "dictDataByType",
                type: "sys_show_hide"
            };

        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.dictTypeStateList = res.data.data;

            vm.queryDictType();
        }).catch(function (error) {
            $.modal.msgError('查询用户状态失败');
        });
    },
    updated(){
        init();
    }
});
