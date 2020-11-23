//菜单组件值
var menuItem=Vue.extend({
    name:"menu-item",
    props:{item:{}},
    template:[
        '<li>',
        '<a href="#" v-if="item.parentId===0">',
        '<i v-if="item.icon!=null" :class="item.icon"></i>',
        '<span class="nav-label">{{item.menuName}}</span>',
        '<span class="fa arrow"></span>',
        '</a>',
        '<ul v-if="item.parentId===0"  class="nav nav-second-level"  >',
        '<menu-item :item="item" v-for="item in item.children"></menu-item>',
        '</ul>',
        '<a v-if="item.parentId!==0" :href="item.url" class="J_menuItem" ><i v-if="item.icon!=null" :class="item.icon"></i> {{item.menuName}}</a>',
        '</li> '
    ].join('')
});

//创建组件
Vue.component('menu-item',menuItem);

var vm = new Vue({
    el: ".mainApp",
    data: {
        user: {},
        password:"",
        newPassword:"",
        menuList:{}
    },
    methods: {
        logout() {
            $.modal.confirm("您确定要安全退出本次登录吗?",function () {
                $.modal.loading("正在退出...");
                setTimeout(function () {
                    window.location.href = "/sys/user/logout";
                },500)
            });
        },
        toggleFullScreen() {
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement) {// current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        },
        updatePassword() {
            //修改密码
            $.modal.openHtml('修改密码', $("#passwordLayer"), "500", "300", function () {
                console.log(vm.user.loginName,vm.password,vm.newPassword);
            })
        },
        lockScreen() {
            window.location.href = "lockscreen.html";
        },
        clearCache() {
            //    清空缓存
            window.sessionStorage.clear();
            window.localStorage.clear();

            $.modal.loading("正在清空缓存...");

            setTimeout(function () {
                $.modal.closeLoading();
                layer.msg("清空成功")
            },1000);
        },
        refresh() {
            //    刷新
            $("iframe").each(function (index, item) {
                if ($(item).css("display") == "inline") {
                    $(item).prop("src", $(item).prop("src"));
                }
            })
        },
        getUser() {
            $.getJSON("/sys/user/currentUser", function (res) {
                    vm.user = res.data;
                    localStorage.setItem("currentUser",JSON.stringify(res.data));
            })
        },
        getMenuList(){
            $.getJSON("/sys/menu/list", function (r) {
                //r是扁平化的tree的数据，现在要进行处理一下
                var res = $.common.setTreeData(r,"menuId","parentId","children");
                vm.menuList=res;
            })
        }
    },
    //创建后的生命周期
    created: function () {
        this.getUser();
        this.getMenuList();
    },
    //修改后的生命周期
    updated: function () {
        //加载菜单手风琴的样式
        $('#side-menu').metisMenu();

        //通过遍历给菜单项加上data-index属性
        $(".J_menuItem").each(function (index) {
            if (!$(this).attr('data-index')) {
                $(this).attr('data-index', index);
            }
        });

        //二级菜单增加事件
        $('.J_menuItem').on('click', $.menu.menuItem);


    }




});
