(function ($) {
    $.extend({
        modal: {
            openHtml: function (title, content, width, height, callback) {
                layer.open({
                    type: 1,
                    title: title,
                    maxmin: true, // 开启最大化最小化按钮
                    area: [width + 'px', height + 'px'],
                    content: content,
                    skin: 'layui-layer-molv', // 样式类名
                    btn: ['确定', '取消'],
                    yes: callback
                });
            },
            openUrl: function (title, url, width, height) {
                layer.open({
                    type: 2,
                    title: title,
                    maxmin: true, // 开启最大化最小化按钮
                    area: [width + 'px', height + 'px'],
                    content: url
                    // skin: 'layui-layer-molv', //样式类名
                });
            },
            confirm: function (content, callback) {
                layer.confirm(content, {
                    icon: 3,
                    title: "系统提示",
                    skin: 'layui-layer-molv',
                    btn: ['确定', '取消'],
                    btnClass: ["btn btn-primary", "btn btn-danger"]
                }, function (index) {
                    layer.close(index);
                    callback();
                });
            },
            alert: function (content, icon) {
                if ($.common.isEmpty(icon)) {
                    layer.alert(content);
                } else {
                    layer.alert(content, {
                        icon: icon,
                        title: "系统提示",
                        skin: 'layui-layer-molv',
                        btn: ['确定'],
                        btnClass: ["btn btn-primary"]
                    })
                }
            },
            msg: function (content, icon, shade, time) {
                if ($.common.isEmpty(icon)) {
                    layer.msg(content);
                } else {
                    return layer.msg(content, {
                        icon: icon,
                        time: time == false ? false : 1000,
                        shade: $.common.isEmpty(shade) ? 0.1 : shade,
                        shift: 5
                    });
                }
            },
            alertWarning: function (content) {
                this.alert(content, 3);
            },
            alertError: function (content) {
                this.alert(content, 2);
            },
            alertSuccess: function (content) {
                this.alert(content, 1);
            },
            msgWarning: function (content) {
                this.msg(content, 3);
            },
            msgError: function (content) {
                this.msg(content, 2);
            },
            msgSuccess: function (content) {
                this.msg(content, 1);
            },
            loading: function (content) {
                // return this.msg(content,16,0.9,false);
                $.blockUI({
                    message: "<div class='loaderbox'><i class='fa fa-spinner'></i>" + content + "</div>"
                });
            },
            closeLoading: function () {
                $.unblockUI();
            }
        },
        common: {
            /* tree数据的转换 id pid==> id children */
            setTreeData(source, id, parentId, children) {
                let cloneData = JSON.parse(JSON.stringify(source));
                let tree = cloneData.filter(father => {
                    let branchArr = cloneData.filter(child => {
                        return father[id] == child[parentId]
                    });
                    if (branchArr.length > 0) {
                        father[children] = branchArr
                    }
                    return father[parentId] == 0    // 如果第一层不是parentId=0，请自行修改
                });
                return tree;
            },
            isEmpty: function (value) {
                if (value == null || this.trim(value) == "" || value == undefined) {
                    return true;
                }
                return false;
            },
            trim: function (value) {
                if (value == "")
                    return "";
                return value.toString().replace(/(^\s*)|(\s*$)|\r|\n/g, "");
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
        tree: {
            setting: {},
            data: {},
            _options: {},
            init: function (options) {
                var defaults = {
                    idKey: "id",
                    pIdKey: "pId",
                    rootId: "0",
                    options: "name",
                    selectMulti: false,
                    checkFlag: false,
                    nocheckInherit: true,
                    expandAll:true
                };
                var options = $.extend(defaults, options);
                $.tree._options = options;
                var setting = {
                    data: {// 表示tree的数据格式
                        simpleData: {
                            enable: true,// 表示使用简单数据模式
                            idKey: options.idKey,// 设置之后deptId为在简单数据模式中的父子节点关联的桥梁
                            pIdKey: options.pIdKey,// 设置之后parentId为在简单数据模式中的父子节点关联的桥梁和deptId互相对应
                            rootId: options.rootId// parentId为0的表示根节点
                        },
                        key: {
                            name: options.name
                        }
                    },
                    view: {// 表示tree的显示状态
                        selectMulti: options.selectMulti// 表示禁止多选
                    },
                    check: {// 表示tree的节点在点击时的相关设置
                        enable: options.checkFlag,// 是否显示radio/checkbox
                        chkStyle: "checkbox",// 值为checkbox或者radio表示
                        nocheckInherit: options.nocheckInherit
                    },
                    callback: {
                        onClick: options.clk,
                        onCheck:options.clk
                    }
                };
                $.tree.setting = setting;
                var tree;
                $.ajax({
                    type: "get",
                    url: options.url+"/list",
                    dataType: "json",
                    success: function (data) {
                        $.tree.data = data;
                        tree = $.fn.zTree.init($("#tree"), setting, data);

                        if(options.expandAll=="first"){
                            // 展开一级节点
                             var nodes = tree.getNodesByParam("level", 0);
                             for (var i = 0; i < nodes.length; i++) {
                                 tree.expandNode(nodes[i], true, false, false);
                             }
                        }else {
                            tree.expandAll(options.expandAll); //折叠所有节点
                        }

                    }
                })

                // 按钮事件
                $(".changeDirection").click(function () {
                    $(".changeDirection").toggle();
                });

                $("#btnExpand").click(function () {
                    tree.expandAll(true); // 展开所有节点
                });
                $("#btnCollapse").click(function () {
                    tree.expandAll(false); // 折叠所有节点
                });
                $("#btnRefresh").click(function () {
                    tree = $.fn.zTree.init($("#tree"), $.tree.setting, $.tree.data);
                    // 展开一级节点
                    var nodes = tree.getNodesByParam("level", 0);
                    for (var i = 0; i < nodes.length; i++) {
                        tree.expandNode(nodes[i], true, false, false);
                    }
                    // 展开一级节点
                    nodes = tree.getNodesByParam("level", 1);
                    for (var i = 0; i < nodes.length; i++) {
                        tree.expandNode(nodes[i], true, false, false);
                    }
                });

            },
            search: function (value) {
                // 当前树
                var tree = $.fn.zTree.getZTreeObj("tree");
                // 所有节点
                var nodes = tree.getNodes();
                if ($.common.isEmpty(value)) {
                    this.showAllNode(nodes);
                    return;
                }
                this.hideAllNode(nodes);
                var nodeList = tree.getNodesByParamFuzzy($.tree._options.name, $("#keywords").val());
                this.updateNodes(nodeList);
            },
            showAllNode: function (nodes) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                nodes = tree.transformToArray(nodes);
                for (var i = nodes.length - 1; i >= 0; i--) {
                    if (nodes[i].getParentNode() != null) {
                        tree.expandNode(nodes[i], false, false, false, false);
                    } else {
                        tree.expandNode(nodes[i], true, true, false, false);
                    }
                    tree.showNode(nodes[i]);
                    this.showAllNode(nodes[i].children);
                }
            },
            hideAllNode: function (nodes) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                nodes = tree.transformToArray(nodes);
                for (var i = nodes.length - 1; i >= 0; i--) {
                    tree.hideNode(nodes[i]);
                }
            },
            updateNodes: function (nodeList) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                tree.showNodes(nodeList);
                for (var i = 0, l = nodeList.length; i < l; i++) {
                    var treeNode = nodeList[i];
                    this.showChildren(treeNode);
                    this.showParent(treeNode)
                }
            },
            showChildren: function (treeNode) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                if (treeNode.isParent) {
                    for (var idx in treeNode.children) {
                        var node = treeNode.children[idx];
                        tree.showNode(node);
                        this.showChildren(node);
                    }
                }
            },
            showParent: function (treeNode) {
                var tree = $.fn.zTree.getZTreeObj("tree");
                var parentNode;
                while ((parentNode = treeNode.getParentNode()) != null) {
                    tree.showNode(parentNode);
                    tree.expandNode(parentNode, true, false, false);
                    treeNode = parentNode;
                }
            }
        },
        table: {
            _options: {},
            init: function (options) {
                $.table._options = options;
                var defaults = {
                    sortOrder: "asc",
                    pagination: true,
                    pageSize: 10,
                    showHeader: true,                    // 显示头部，默认显示
                    showExport: true,                    // 显示导出
                    showColumns: true,                  // 是否显示所有的列（选择显示的列）
                    showRefresh: true
                };
                var options = $.extend(defaults, options);
                $("#bootstrap-table").bootstrapTable({
                    url: options.url+"/list" ,      // 请求后台的URL（*）
                    sortOrder: options.sortOrder,                   // 排序方式
                    sortName: options.sortName,                  // 排序列
                    columns: options.columns,
                    uniqueId: options.id,                     // 每一行的唯一标识，一般为主键列
                    smartDisplay: false,
                    method: 'GET',                      // 请求方式（*）
                    toolbar: '#toolbar',              // 工具按钮用哪个容器
                    striped: true,                      // 是否显示行间隔色
                    cache: false,                       // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true,                   // 是否显示分页（*）
                    showPaginationSwitch: false,         // 显示切换分页
                    showFooter: false,                    // 显示底部，默认不显示
                    showFullscreen: false,               // 显示全屏
                    showHeader: options.showHeader,                    // 显示头部，默认显示
                    showExport: options.showExport,                    // 显示导出
                    showColumns: options.showColumns,                  // 是否显示所有的列（选择显示的列）
                    showRefresh: options.showRefresh,                  // 是否显示刷新按钮
                    sortable: true,                     // 是否启用排序

                    contentType: "application/x-www-form-urlencoded",// servlet分页要加上此行
                    sidePagination: "server",           // 分页方式：client客户端分页，server服务端分页（*）
                    queryParams: function (params) { // 查询参数
                        var search = {};
                        $.each($("#searchForm").serializeArray(), function (i, field) {
                            search[field.name] = field.value
                        });
                        search.pageNum = params.offset / params.limit + 1;
                        search.pageSize = params.limit;
                        search.orderColumn = params.sort;
                        search.orderStyle = params.order;
                        return search;
                    },
                    pageNumber: 1,                      // 初始化加载第一页，默认第一页,并记录
                    pageSize: 10,                     // 每页的记录行数（*）
                    pageList: [10, 15, 20, 30],        // 可供选择的每页的行数（*）
                    search: false,                      // 是否显示表格搜索(客户端搜索)
                    strictSearch: true,
                    minimumCountColumns: 2,             // 最少允许的列数
                    clickToSelect: true,                // 是否启用点击选中行

                    showToggle: true,                   // 是否显示详细视图和列表视图的切换按钮
                    cardView: false,                    // 是否显示详细视图
                    detailView: false,                  // 是否显示父子表

                });
            },
            refresh: function () {
                var params = $("#bootstrap-table").bootstrapTable("getOptions");
                params.pageNumber=1;
                $("#bootstrap-table").bootstrapTable("refresh", params);
            }

        },
        treegrid: {
            isOdd: true,
            _options: {},
            init: function (options) {
                $.treegrid._options = options;
                var $table = $('#bootstrap-table');
                $table.bootstrapTable({
                    url: options.url + "/list",
                    height: $(window).height(),
                    method: 'get', // 请求方式（*）
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    toolbar: '#toolbar', // 工具按钮用哪个容器
                    striped: true, // 是否显示行间隔色
                    cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: false, // 是否显示分页（*）
                    sortable: false, // 是否启用排序,
                    showHeader: true,                    // 显示头部，默认显示
                    showExport: true,                    // 显示导出
                    showColumns: true,                  // 是否显示所有的列（选择显示的列）
                    showRefresh: true,                  // 是否显示刷新按钮
                    showToggle: true,                   // 是否显示详细视图和列表视图的切换按钮
                    sidePagination: "client", // 分页方式：client客户端分页client客户端分页，server服务端分页（*）
                    // pageNumber: 1, //初始化加载第一页，默认第一页
                    // pageSize: 10, //每页的记录行数（*）
                    // pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                    idField: options.id,
                    columns: options.columns,
                    queryParams: function (params) { // 查询参数
                        var search = {};
                        $.each($("#searchForm").serializeArray(), function (i, field) {
                            search[field.name] = field.value
                        });
                        /* search.pageNo = params.offset / params.limit + 1;
                         search.pageSize = params.limit;
                         search.orderColumn = params.sort;
                         search.orderStyle = params.order;*/
                        return search;
                    },


                    // bootstrap-table-treegrid.js 插件配置 -- start

                    // 在哪一列展开树形
                    treeShowField: options.showField,
                    // 指定父id列
                    parentIdField: options.pid,

                    onResetView: function (data) {
                        $table.treegrid({
                            //initialState: 'collapsed',// 所有节点都折叠
                            initialState: 'expanded',// 所有节点都展开，默认展开
                            treeColumn: 1,
                            expanderExpandedClass: 'glyphicon glyphicon-chevron-down',  // 图标样式
                            expanderCollapsedClass: 'glyphicon glyphicon-chevron-right',
                            onChange: function () {
                                $table.bootstrapTable('resetWidth');
                            }
                        });
                    }
                    ,
                    onCheck: function (row) {

                        var datas = $table.bootstrapTable('getData');

                        // 勾选子类
                        selectChilds(datas, row, options.id, options.pid, true);



                        // 勾选父类
                        //selectParentChecked(datas, row, options.id, options.pid);

                        changeParent(datas, row, options.id, options.pid);

                        // 刷新数据
                        $table.bootstrapTable('load', datas);
                    },

                    onUncheck: function (row) {
                        var datas = $table.bootstrapTable('getData');
                        //取消勾选子类
                        selectChilds(datas, row, options.id, options.pid, false);

                        changeParent(datas, row, options.id, options.pid);

                        $table.bootstrapTable('load', datas);
                    },
                    // bootstrap-table-treetreegrid.js 插件配置 -- end
                });

                /**
                 * 选中父项时，同时选中子项
                 *
                 * @param datas
                 *            所有的数据
                 * @param row
                 *            当前数据
                 * @param id
                 *            id 字段名
                 * @param pId
                 *            父id字段名
                 */
                function selectChilds(datas, row, id, pId, checked) {
                    for (var i in datas) {
                        if (datas[i][pId] == row[id]) {
                            datas[i].check = checked;
                            selectChilds(datas, datas[i], id, pId, checked);
                        }
                    }
                }

                function selectParentChecked(datas, row, id, pId) {
                    for (var i in datas) {
                        if (datas[i][id] == row[pId]) {
                            datas[i].check = true;
                            selectParentChecked(datas, datas[i], id, pId);
                        }
                    }
                }

                // 改变父菜单
                function changeParent(datas,row,id,pId) {
                    var count=0;
                    var selectNums=0;

                    //找出父菜单下的所有子菜单
                    for (var i in datas) {
                        //父菜单为一样的，即同一级子菜单
                        if (datas[i][pId] == row[pId]) {
                            count++
                            //选中的子菜单
                            if(datas[i].check==true){
                                selectNums++;
                            }
                        }



                    }

                    for (var i in datas) {
                        //找到父菜单
                        if (datas[i][id] == row[pId]) {
                            //父菜单是否选中，看子菜单是否全选
                            datas[i].check = selectNums==count;
                            break
                        }
                    }
                }
            },
            refresh: function () {
                $("#bootstrap-table").bootstrapTable("refresh");
            },
            toggle: function () {
                if (this.isOdd) {
                    $("#bootstrap-table").treegrid('collapseAll');
                    this.isOdd = false;
                } else {
                    $("#bootstrap-table").treegrid('expandAll');
                    this.isOdd = true;
                }

            }

        },
        operate: {
            // 操作
            submit: function (url, param, type, dataType) {
                $.modal.loading("正在处理中，请稍后...");
                $.ajax({
                    url: url,
                    data: param,
                    type: $.common.isEmpty(type) ? "post" : type,
                    dataType: $.common.isEmpty(dataType) ? "json" : dataType,
                    success: function (res) {
                        if (res.status == 200) {
                            $.modal.closeLoading();
                            $.modal.msgSuccess(res.msg);
                            if (jQuery.isEmptyObject($.treegrid._options)) {
                                // 刷新表格
                                $.table.refresh();
                            } else {
                                // 刷新网格
                                $.treegrid.refresh();
                            }
                        } else {
                            $.modal.closeLoading();
                            $.modal.alertError(res.msg);
                        }


                    },
                    error: function (error) {
                        $.modal.alertError("服务器正忙，请稍后再试！");
                        $.modal.closeLoading();
                    }
                });

            },
            // 删除
            remove: function (id) {

                var $table = $("#bootstrap-table");
                if ($.common.isEmpty(id)) {
                    // 删除多个，还需要判断：是否有选中的行
                    var rows = $table.bootstrapTable("getSelections");
                    if (rows.length == 0) {
                        $.modal.alertWarning("请至少选择一条记录");
                        return;
                    }

                    $.modal.confirm("确认要删除选中的" + rows.length + "条数据吗?", function () {
                        var ids = [];
                        var options = "";
                        if (jQuery.isEmptyObject($.treegrid._options)) {
                            options = $.table._options;
                        } else {
                            options = $.treegrid._options;
                        }
                        $(rows).each(function (index, item) {
                            ids.push(item[options.id]);
                        });


                        var param = {
                            "_method": "DELETE"
                        };
                        var url = options.url + "/remove/" + ids.join(",");
                        $.operate.submit(url, param,"delete");
                    });
                } else {
                    // 删除一个
                    $.modal.confirm("确认要删除当前选中行的数据吗?", function () {
                        var options = "";
                        if (jQuery.isEmptyObject($.treegrid._options)) {
                            options = $.table._options;
                        } else {
                            options = $.treegrid._options;

                        }

                        var param = {
                            "_method": "DELETE"
                        };
                        var url = options.url + "/remove/" + id;
                        $.operate.submit(url, param,"delete");
                    });
                }
            }
        },
        form: {
            reset: function () {
                $("#searchForm")[0].reset();
            }
        },
        menu: {
            // 对应的事件
            menuItem: function () {
                var dataUrl, dataIndex, menuName, topWindow, flag = true;
                if (arguments.length == 3) {
                    dataUrl = arguments[0];
                    dataIndex = arguments[1];
                    menuName = arguments[2];
                    topWindow = $(window.parent.document);
                } else {
                    // 获取标识数据
                    dataUrl = $(this).attr('href');
                    dataIndex = $(this).data('index');
                    menuName = $.trim($(this).text());
                    topWindow = $(window.document);
                }
                if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;


                // 选项卡菜单已存在
                $('.J_menuTab', topWindow).each(function () {
                    debugger
                    if ($(this).data('id') == dataUrl && dataUrl!="/sys/dictType/dictData" || $(this).context.innerText.trim()==menuName  ) {
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                            $.menu.scrollToTab(this);
                            // 显示tab对应的内容区
                            $('.J_mainContent .J_iframe', topWindow).each(function () {
                                if ($(this).data('id') == dataUrl) {
                                    $(this).show().siblings('.J_iframe').hide();
                                    return false;
                                }
                            });
                        }
                        flag = false;
                        return false;
                    }
                });

                // 选项卡菜单不存在
                if (flag) {
                    var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
                    $('.J_menuTab', topWindow).removeClass('active');

                    // 添加选项卡对应的iframe
                    var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                    $('.J_mainContent', topWindow).find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

                    // 添加选项卡
                    $('.J_menuTabs .page-tabs-content', topWindow).append(str);
                    $.menu.scrollToTab($('.J_menuTab.active'));
                }
                return false;
            },
            // 滚动到指定选项卡
            scrollToTab: function (element) {

                var marginLeftVal = $.menu.calSumWidth($(element).prevAll()),
                    marginRightVal = $.menu.calSumWidth($(element).nextAll());
                // 可视区域非tab宽度
                var tabOuterWidth = $.menu.calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
                // 可视区域tab宽度
                var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
                // 实际滚动宽度
                var scrollVal = 0;
                if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                    scrollVal = 0;
                } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                    if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                        scrollVal = marginLeftVal;
                        var tabElement = element;
                        while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                            scrollVal -= $(tabElement).prev().outerWidth();
                            tabElement = $(tabElement).prev();
                        }
                    }
                } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                    scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
                }
                $('.page-tabs-content').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            },
            // 计算元素集合的总宽度
            calSumWidth: function (elements) {

                var width = 0;
                $(elements).each(function () {
                    width += $(this).outerWidth(true);
                });
                return width;
            }
        }
    });
})(jQuery);
