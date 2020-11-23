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
        vm.post.status = $("input[name='status']:checked").val();
    });
}

var vm = new Vue({
    el: "#app",
    data: {
        showList: true
    },
    methods: {
        queryOnline() {
            var options = {};
            options.url = "/monitor/online";
            // options.sortOrder = "desc";
            // options.sortName = "postId";
            // options.id = "postId"; //主键
            options.columns = [
                {
                    checkbox: true
                },
                {
                    field: 'sessionId',
                    title: '会话Id',
                    visible:false
                },
                {
                    field: 'userId',
                    title: '用户编号',
                    visible:false
                },
                {
                    field: 'loginName',
                    title: '登录名称',
                },
                {
                    field: 'deptName',
                    title: '部门名称'
                },
                {
                    field: 'ipaddr',
                    title: '主机'
                },
                {
                    field: 'loginLocation',
                    title: '登录地点'
                },
                {
                    field: 'browser',
                    title: '浏览器'
                },
                {
                    field: 'os',
                    title: '操作系统'
                },
                {
                    field: 'startTime',
                    title: '登录时间'
                },
                {
                    field: 'lastTime',
                    title: '最后访问时间'
                },
                {
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var actions = [];
                        actions.push(' <a class="btn btn-danger btn-xs" href="javascript:void(0)" onclick="vm.forceLogout(\'' + row.sessionId + '\')"><i class="fa fa-remove"></i>强制退出</a>');
                        return actions.join("");
                    }
                }];

            $.table.init(options);
        },
        forceLogout(sessionId){
            var param={}
            param.sessionId=sessionId;
            $.operate.submit("/monitor/online/forceLogout",param);
        }

    },
    mounted() {
        this.queryOnline();
    },
    updated() {
        init();
    }



});
