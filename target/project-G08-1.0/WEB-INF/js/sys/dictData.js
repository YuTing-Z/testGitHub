
$(function () {
    init();
});

function init() {
    //icheck
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $("input[ value='0']").iCheck('check');


    //icheck值改变的事件
    $(".i-checks").on("ifChanged",function(){
        vm.dictData.status=$("input[name='status']:checked").val();
        vm.dictData.isDefault=$("input[name='isDefault']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true,
        dictData:{},
        dictTypeList: [],
        dictDataStateList:[]

    },
    methods: {
        queryDictData() {
            var options = {};
            options.url = "/sys/dictData";
            options.sortOrder = "desc";
            options.sortName = "dictCode";
            options.id = "dictCode"; //主键
            options.columns = [
                {
                field: 'state',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            },
                {
                    field: 'dictCode',
                    title: '字典编码',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },

                {
                    field: 'dictLabel',
                    title: '字典标签',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'dictSort',
                    title: '字典排序',
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                },
                {
                    field: 'dictValue',
                    title: '字典键值',
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
                    formatter: function (value,row,index) {
                        if(value=='0')
                            return '<span class="badge badge-primary">正常</span>';
                        else
                            return '<span class="badge badge-danger">停用</span>';
                    }
                },
                {
                    field: 'createTime',
                    title: '创建时间',
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
                        var actions = [];
                        actions.push('<a class="btn btn-primary btn-xs " href="javascript:void(0);" onclick="vm.edit(\'' + row.dictCode + '\')"><i class="fa fa-edit"></i>编辑</a> ');
                        actions.push('<a class="btn btn-danger btn-xs "  href="javascript:void(0);" onclick="$.operate.remove(\'' + row.dictCode + '\')"><i class="fa fa-remove"></i>删除</a> ');
                        return actions.join('');
                    }
                }];
            $.table.init(options);
        },
        add() {
            vm.showList=false;
            vm.dictData={
                status:0,
                isDefault:0
            };
            vm.dictData.dictId=localStorage.getItem("dictId");
            vm.dictData.dictType=localStorage.getItem("dictType");
            //提交处理(提交前的验证)
            this.handleSubmit();
        },
        handleSubmit(){
            $("#form-dictData").bootstrapValidator({
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
            var url = "/sys/dictData";
            $.ajax({
                url:url,
                type: $.common.isEmpty(vm.dictData['_method'])?"post":vm.dictData['_method'],
                dataType:"json",
                contentType:"application/json",
                data:JSON.stringify(vm.dictData),
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
                url: "/sys/dictData/"+id,
                type:"get",
                dataType:"json",
                success:function (res) {
                    if(res.status==200){
                        vm.dictData=res.data;
                        vm.dictData['_method']='put';
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
            $('#form-dictData').data('bootstrapValidator').resetForm(true)
        }
    },
    mounted() {

        $("#searchForm input[name='dictType']").val(localStorage.getItem("dictType"));

        //先查询状态
        var params =
            {
                method: "dictDataByType",
                type: "sys_show_hide"
            };



        axios.get("/sys/dictData/byType", {params:params}).then(function (res) {
            vm.dictDataStateList = res.data.data;

            vm.queryDictData();
        }).catch(function (error) {
            $.modal.msgError('查询数据字典失败');
        });
    }

});
