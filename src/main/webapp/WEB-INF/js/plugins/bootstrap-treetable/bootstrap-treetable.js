/**
 * bootstrap-treetable
 * v1.0.7-beta
 * @author swifly
 * @url https://gitee.com/cyf783/bootstrap-treetable/
 */
(function($) {
    "use strict";

    var BootstrapTreeTable = function(el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.data_list = null; //用于缓存格式化后的数据-按父分组
        this.data_obj = null; //用于缓存格式化后的数据-按id存对象
        this.hiddenColumns = []; //用于存放被隐藏列的field
        this.lastAjaxParams; //用户最后一次请求的参数
        this.hasSelectItem = false; // 是否有radio或checkbox
        this.hasFixWidth = false; //是否有固定宽度
        this.leftFrozenColumns = [];
        this.rightFrozenColumns = [];
        this.noFrozenColumns = [];
        this.init();
        var self = this;
        $(window).resize(function() {
            self.autoReSize();
        });
    };
    // 初始化
    BootstrapTreeTable.prototype.init = function() {
        // 初始化容器
        this.initContainer();
        // 初始化工具栏
        this.initToolbar();
        // 初始化表头
        this.initHeader();
        // 初始化表体
        this.initBody();
        // 初始化数据服务
        this.initServer();
    };
    // 初始化容器
    BootstrapTreeTable.prototype.initContainer = function() {
        var self = this;
        // 在外层包装一下div，样式用的bootstrap-table的
        var $container = $("<div class='bootstrap-tree-table'></div>");
        var $treetable = $("<div class='treetable-box'></div>");
        var $bodyBox = $("<div class='treetable-body-box'></div>");
        self.$el.before($container);
        $container.append($treetable);
        $treetable.append($bodyBox);
        $bodyBox.append(self.$el);
        self.$el.addClass("table treetable-table");
        if (self.options.striped) {
            self.$el.addClass('table-striped');
        }
        if (self.options.bordered) {
            self.$el.addClass('table-bordered');
        }
        if (self.options.hover) {
            self.$el.addClass('table-hover');
        }
        if (self.options.condensed) {
            self.$el.addClass('table-condensed');
        }
        if (self.options.width) {
            $container.css('width',self.options.width);
            $treetable.css('width',self.options.width);
        }
        // 默认高度
        if (self.options.height) {
            $bodyBox.css("height", self.options.height);
        }
        self.$el.html("");
    };
    // 初始化工具栏
    BootstrapTreeTable.prototype.initToolbar = function() {
        var self = this;
        var $toolbar = $("<div class='treetable-bars'></div>");
        if (self.options.toolbar) {
            $(self.options.toolbar).addClass('tool-left');
            $toolbar.append($(self.options.toolbar));
        }
        var $rightToolbar = $('<div class="btn-group tool-right">');
        $toolbar.append($rightToolbar);
        self.$el.parent().parent().before($toolbar);
        // 是否显示刷新按钮
        if (self.options.showRefresh) {
            var $refreshBtn = $('<button class="btn btn-default btn-outline" type="button" aria-label="refresh" title="刷新"><i class="'+self.options.toolRefreshClass+'"></i></button>');
            $rightToolbar.append($refreshBtn);
            self.registerRefreshBtnClickEvent($refreshBtn);
        }
        // 是否显示列选项
        if (self.options.showColumns) {
            var $columns_div = $('<div class="btn-group pull-right" title="列"><button type="button" aria-label="columns" class="btn btn-default btn-outline dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="'+self.options.toolColumnsClass+'"></i> <span class="caret"></span></button></div>');
            var $columns_ul = $('<ul class="dropdown-menu dropdown-menu-right columns" role="menu"></ul>');
            $.each(self.options.columns, function(i, column) {
                if (!(column.checkbox || column.radio)) {
                    var _li = null;
                    if (typeof column.visible == "undefined" || column.visible == true) {
                        _li = $('<li role="menuitem"><label><input type="checkbox" checked="checked" data-field="' + column.field + '" value="' + column.field + '" > ' + column.title + '</label></li>');
                    } else {
                        _li = $('<li role="menuitem"><label><input type="checkbox" data-field="' + column.field + '" value="' + column.field + '" > ' + column.title + '</label></li>');
                        self.hiddenColumns.push(column.field);
                    }
                    $columns_ul.append(_li);
                }
            });
            $columns_div.append($columns_ul);
            $rightToolbar.append($columns_div);
            // 注册列选项事件
            self.registerColumnClickEvent();
        } else {
            $.each(self.options.columns, function(i, column) {
                if (!(column.checkbox || column.radio)) {
                    if (!(typeof column.visible == "undefined" || column.visible == true)) {
                        self.hiddenColumns.push(column.field);
                    }
                }
            });
        }
    };
    // 初始化隐藏列
    BootstrapTreeTable.prototype.initHiddenColumns = function() {
        var self = this;
        $.each(self.hiddenColumns, function(i, field) {
            self.$el.parent().parent().parent().find("." + field + "_cls").hide();
        });
    };
    // 初始化表头
    BootstrapTreeTable.prototype.initHeader = function() {
        var self = this;
        var $thr = $('<tr></tr>');
        $.each(self.options.columns, function(i, column) {
            var $th;
            column = $.extend({}, BootstrapTreeTable.COLUMN_DEFAULTS, column);
            if(column.width){
                column.width += (column.width.indexOf("%") == -1&&column.width.indexOf("px") == -1)?"px":"";
            }
            if ((!self.hasFixWidth) && column.width) {
                self.hasFixWidth = column.width.indexOf("px") > -1 ? true : false;
            }
            self.options.columns[i]=column;
            // 判断有没有选择列
            // 选择列永远在左边第一列
            if (column.checkbox || column.radio) {
                self.hasSelectItem = true;
                self.leftFrozenColumns.push(column);
            }else{
                if(column.fixed){
                    if(column.fixed=="left"){
                        self.leftFrozenColumns.push(column);
                    }else if(column.fixed=="right"){
                        self.rightFrozenColumns.push(column);
                    }else{
                        self.noFrozenColumns.push(column);
                    }
                }else{
                    self.noFrozenColumns.push(column);
                }
            }
        });
        // 因有可能出现冻结列，所以这里合并列配置
        var _columns = self.leftFrozenColumns.concat(self.noFrozenColumns).concat(self.rightFrozenColumns);
        $.each(_columns, function(i, column) {
            var $th;
            // 判断有没有选择列
            if (i == 0 && (column.checkbox || column.radio)) {
                $th = $('<th style="width:36px"></th>');
            } else {
                $th = $('<th style="' + ((column.width) ? ('width:' + column.width) : '') + '" class="' + column.field + '_cls"></th>');
            }
            $th.text(column.title);
            $thr.append($th);
        });
        var $thead = $('<thead class="treetable-thead"></thead>');
        $thead.append($thr);
        self.$el.append($thead);

        var $headBox = $("<div class='treetable-fixed treetable-head-box'></div>");
        var $topTable = $("<table id='"+self.$el.attr("id")+"_header'></table>");
        $headBox.append($topTable);
        self.$el.parent().before($headBox);
        self.cloneTable(self.$el,$topTable,0,_columns.length-1);
        self.$el.find('thead th').each(function(index, el) {
            $(el).html("");
        });
        // header跟着滚动
        self.$el.parent().scroll(function(){
            var left=self.$el.parent().scrollLeft();//获取滚动的距离
            self.$el.parent().parent().find("#"+self.$el.attr("id")+"_header").parent().css({"left":-left});
        });
    };
    // 初始化表体
    BootstrapTreeTable.prototype.initBody = function() {
        var self = this;
        var $tbody = $('<tbody class="treetable-tbody"></tbody>');
        self.$el.append($tbody);
    };
    // 初始化数据服务
    BootstrapTreeTable.prototype.initServer = function(parms) {
        var self = this;
        // 加载数据前先清空
        self.data_list = {};
        self.data_obj = {};
        var $tbody = self.$el.find("tbody");
        // 添加加载loading
        var $loading = '<tr><td colspan="' + self.options.columns.length + '"><div style="display: block;text-align: center;">正在努力地加载数据中，请稍候……</div></td></tr>'
        $tbody.html($loading);
        if (self.options.url) {
            $.ajax({
                type: self.options.type,
                url: self.options.url,
                data: parms ? parms : self.options.ajaxParams,
                dataType: "JSON",
                success: function(data, textStatus, jqXHR) {
                    self.renderTable(data);
                    self.trigger('load-success', data);
                },
                error: function(res, textStatus) {
                    var _errorMsg = '<tr><td colspan="' + self.options.columns.length + '"><div style="display: block;text-align: center;">' + res.responseText + '</div></td></tr>'
                    $tbody.html(_errorMsg);
                    self.trigger('load-error', textStatus, res);
                },
            });
        } else {
            if(self.options.data){
                self.renderTable(self.options.data);
                self.trigger('load-success', self.options.data);
            }else{
                self.trigger('load-error');
            }
        }
    };
    // 加载完数据后渲染表格
    BootstrapTreeTable.prototype.renderTable = function(data) {
        var self = this;
        var $tbody = self.$el.find("tbody");
        // 先清空
        $tbody.html("");
        if (!data || data.length <= 0) {
            var _empty = '<tr><td colspan="' + self.options.columns.length + '"><div style="display: block;text-align: center;">没有找到匹配的记录</div></td></tr>'
            $tbody.html(_empty);
            return;
        }
        // 缓存并格式化数据
        self.formatData(data);
        // 获取所有根节点
        var rootNode = self.data_list["_root_"];
        // 开始绘制
        if (rootNode) {
            $.each(rootNode, function(i, item) {
                var _child_row_id = "row_id_" + i
                self.recursionNode(item, 1, _child_row_id, "row_root");
            });
        }
        // 下边的操作主要是为了查询时让一些没有根节点的节点显示
        $.each(data, function(i, item) {
            if (!item.isShow) {
                var tr = self.renderRow(item, false, 1, "", "");
                $tbody.append(tr);
            }
        });
        self.$el.append($tbody);
        self.registerExpanderEvent();
        self.registerRowClickEvent();
        self.initHiddenColumns();
        self.autoReSize();
        //self.frozen();
    };
    // 动态设置表头宽度及表体偏移量
    BootstrapTreeTable.prototype.autoReSize = function(initFlag) {
        var self = this;
        // 原表的thead
        var $el_thead = self.$el.find("thead");
        // 新的header_table
        var $header_table = self.$el.parent().parent().find("#"+self.$el.attr("id")+"_header");
        var $thead = $header_table.find("thead");
        var _width = $el_thead.children(":first").width();
        if(self.hasScroll(true)){
            // 表格宽度加上滚动条的宽度
            $header_table.width(_width+self.getScrollWidth());
            // 如果有滚动条就下个线吧，要不别扭。。。
            self.$el.parent().css("border-bottom","1px solid #e7eaec");
        }else{
            $header_table.width("auto");
            self.$el.parent().css("border-bottom","0");
        }
        $thead.css("width", _width);
        // 设置表体偏移量
        self.$el.parent().css("margin-top",$header_table.height());
    };
    // 固定设置
    BootstrapTreeTable.prototype.frozen = function() {
        var self = this;
        var $table = self.$el;
        var _tableId = $table.attr("id");
        var $bodyBox = $table.parent();
        var $tableBox = $bodyBox.parent();
        var _noNum = self.noFrozenColumns.length;
        var _leftNum = self.leftFrozenColumns.length;
        var _rightNum = self.rightFrozenColumns.length;
        $table.find("td").attr("noWrap","nowrap");
        if ($table.width() > $tableBox.width()) {
            if(self.leftFrozenColumns.length>0){
                var $leftBox = $("<div class='treetable-fixed treetable-fixed-l'></div>");
                var $_bodyBox = $("<div></div>");
                self.mergeAttributes($bodyBox,$_bodyBox);
                var $leftTable = $("<table></table>");
                $leftBox.append($_bodyBox);
                $_bodyBox.append($leftTable);
                $tableBox.append($leftBox);
                self.cloneTable(self.$el,$leftTable,0,_leftNum-1);
                $leftBox.css("left",$tableBox.offset().left);
                $leftBox.css("top",0);
                $_bodyBox.height($_bodyBox.height()-self.getScrollWidth($bodyBox[0]));
                var $_headBox = $("<div class='treetable-fixed treetable-head-box'></div>");
                $leftBox.append($_headBox);
                var $topTable = $("<table></table>");
                $_headBox.append($topTable);
                self.cloneTable($tableBox.find("#"+$table.attr("id")+"_header"),$topTable,0,_leftNum-1);
            }
            if(self.rightFrozenColumns.length>0){
                var $rightBox = $("<div class='treetable-fixed treetable-fixed-r'></div>");
                var $_bodyBox = $("<div></div>");
                self.mergeAttributes($bodyBox,$_bodyBox);
                var $rightTable = $("<table></table>");
                $rightBox.append($_bodyBox);
                $_bodyBox.append($rightTable);
                $tableBox.append($rightBox);
                self.cloneTable(self.$el,$rightTable,_noNum+_leftNum,_noNum+_leftNum+_rightNum-1);
                $rightBox.css("right",self.getScrollWidth($bodyBox[0]));
                $rightBox.css("top",0);
                $_bodyBox.height($_bodyBox.height()-self.getScrollWidth($bodyBox[0]));
                var $_headBox = $("<div class='treetable-fixed treetable-head-box'></div>");
                $rightBox.append($_headBox);
                var $topTable = $("<table></table>");
                $_headBox.append($topTable);
                self.cloneTable($tableBox.find("#"+$table.attr("id")+"_header"),$topTable,_noNum+_leftNum,_noNum+_leftNum+_rightNum-1);
            }
            $tableBox.find('.treetable-head-box').each(function(index, el) {
                $(el).css({"top":0});
            });
        }
        // 给table外面的div滚动事件绑定一个函数
        $bodyBox.scroll(function(){
            // 获取滚动的距离
            var left=$bodyBox.scrollLeft();
            // 获取滚动的距离
            var top=$bodyBox.scrollTop();
            $tableBox.find("#"+$table.attr("id")+"_header").parent().css({"left":-left});
            $tableBox.find('.treetable-fixed .treetable-body-box').each(function(index, el) {
                $(el).scrollTop(top);
            });
        });
    };
    // 克隆 从0开始(oSrcTable,iRowStart,iRowEnd,iColumnEnd)
    BootstrapTreeTable.prototype.cloneTable = function($table,$newTable,iColumnStart,iColumnEnd) {
        var self = this;
        // 克隆 table 属性
        self.mergeAttributes($table,$newTable);
        if($table.find("thead")&&$table.find("thead").length>0){
            var $newThead = $("<thead></thead>");
            self.mergeAttributes($table.find("thead"),$newThead);
            $table.find("thead tr").each(function(i,o){
                var $newTr = $("<tr></tr>");
                self.mergeAttributes($(o),$newTr);
                var _width = 0;
                $(o).find("th").each(function(index, el) {
                    if(index >= iColumnStart && index <= iColumnEnd){
                        $newTr.append($(el).clone(true));
                        _width += $(el).width();
                    }
                });
                $newThead.append($newTr);
            });
            $newTable.append($newThead);
        }
        if($table.find("tbody")&&$table.find("tbody").length>0){
            var $newTbody = $("<tbody></tbody>");
            self.mergeAttributes($table.find("tbody"),$newTbody);
            $table.find("tbody tr").each(function(i,o){
                var $newTr = $("<tr></tr>");
                self.mergeAttributes($(o),$newTr);
                $(o).find("td").each(function(index, el) {
                    if(index >= iColumnStart && index <= iColumnEnd){
                        $newTr.append($(el).clone(true));
                    }
                });
                $newTbody.append($newTr);
            });
            $newTable.append($newTbody);
        }
    };
    // 合并属性
    BootstrapTreeTable.prototype.mergeAttributes = function($s,$t) {
        var attrs = $s.get(0).attributes;
        var i = attrs.length - 1;
        for(;i>=0;i--){
            var name = attrs[i].name;
            if(name.toLowerCase() === 'id' || attrs[i].value=="" || attrs[i].value==null ||attrs[i].value=="null"){
                continue;
            }
            try{
                $t.attr(name,attrs[i].value);
            }catch(e){
            }
        }
    };
    // 缓存并格式化数据
    BootstrapTreeTable.prototype.formatData = function(data) {
        var self = this;
        var _root = self.options.rootIdValue ? self.options.rootIdValue : null
        $.each(data, function(index, item) {
            // 添加一个默认属性，用来判断当前节点有没有被显示
            item.isShow = false;
            // 这里兼容几种常见Root节点写法
            // 默认的几种判断
            var _defaultRootFlag = item[self.options.parentId] == '0' ||
                item[self.options.parentId] == 0 ||
                item[self.options.parentId] == null ||
                item[self.options.parentId] == '';
            if (!item[self.options.parentId] || (_root ? (item[self.options.parentId] == self.options.rootIdValue) : _defaultRootFlag)) {
                if (!self.data_list["_root_"]) {
                    self.data_list["_root_"] = [];
                }
                if (!self.data_obj["id_" + item[self.options.id]]) {
                    self.data_list["_root_"].push(item);
                }
            } else {
                if (!self.data_list["_n_" + item[self.options.parentId]]) {
                    self.data_list["_n_" + item[self.options.parentId]] = [];
                }
                if (!self.data_obj["id_" + item[self.options.id]]) {
                    self.data_list["_n_" + item[self.options.parentId]].push(item);
                }
            }
            self.data_obj["id_" + item[self.options.id]] = item;
        });
    };
    // 递归获取子节点并且设置子节点
    BootstrapTreeTable.prototype.recursionNode = function(parentNode, lv, row_id, p_id) {
        var self = this;
        var $tbody = self.$el.find("tbody");
        var _ls = self.data_list["_n_" + parentNode[self.options.id]];
        var $tr = self.renderRow(parentNode, _ls ? true : false, lv, row_id, p_id);
        $tbody.append($tr);
        if (_ls) {
            $.each(_ls, function(i, item) {
                var _child_row_id = row_id + "_" + i
                self.recursionNode(item, (lv + 1), _child_row_id, row_id)
            });
        }
    };
    // 绘制行
    BootstrapTreeTable.prototype.renderRow = function(item, isP, lv, row_id, p_id) {
        var self = this;
        // 标记已显示
        item.isShow = true;
        item.row_id = row_id;
        item.p_id = p_id;
        item.lv = lv;
        var $tr = $('<tr id="' + row_id + '" pid="' + p_id + '" dataid="' + item[self.options.id] + '"></tr>');
        var _icon = self.options.expanderCollapsedClass;
        if (self.options.expandAll) {
            $tr.css("display", "table");
            _icon = self.options.expanderExpandedClass;
        } else if (lv == 1) {
            $tr.css("display", "table");
            _icon = (self.options.expandFirst) ? self.options.expanderExpandedClass : self.options.expanderCollapsedClass;
        } else if (lv == 2) {
            if (self.options.expandFirst) {
                $tr.css("display", "table");
            } else {
                $tr.css("display", "none");
            }
            _icon = self.options.expanderCollapsedClass;
        } else {
            $tr.css("display", "none");
            _icon = self.options.expanderCollapsedClass;
        }
        // 因有可能出现冻结列，所以这里合并列配置
        var _columns = self.leftFrozenColumns.concat(self.noFrozenColumns).concat(self.rightFrozenColumns);
        $.each(_columns, function(index, column) {
            // 判断是不是选择列
            if (column.checkbox || column.radio) {
                var $td = $('<td style="text-align:center;width:36px"></td>');
                if (column.radio) {
                    var $ipt = $('<input name="select_item" type="radio" value="' + item[self.options.id] + '"></input>');
                    $td.append($ipt);
                }
                if (column.checkbox) {
                    var $ipt = $('<input name="select_item" type="checkbox" value="' + item[self.options.id] + '"></input>');
                    $td.append($ipt);
                }
                $tr.append($td);
            } else {
                var $td = $('<td name="' + column.field + '" class="' + column.field + '_cls"></td>');
                if (column.width) {
                    $td.css("width", column.width);
                }
                if (column.align) {
                    $td.css("text-align", column.align);
                }
                if (self.options.expandColumn == index) {
                    $td.css("text-align", "left");
                }
                if (column.valign) {
                    $td.css("vertical-align", column.valign);
                }
                if (self.options.showTitle) {
                    $td.addClass("ellipsis");
                }
                // 增加formatter渲染
                if (column.formatter) {
                    $td.html(column.formatter.call(self, item[column.field], item, index));
                } else {
                    if (self.options.showTitle) {
                        // 只在字段没有formatter时才添加title属性
                        $td.attr("title", item[column.field]);
                    }
                    $td.text(item[column.field]);
                }
                if (self.options.expandColumn == index) {
                    if (!isP) {
                        $td.prepend('<span class="treetable-expander"></span>')
                    } else {
                        $td.prepend('<span class="treetable-expander ' + _icon + '"></span>')
                    }
                    for (var int = 0; int < (lv - 1); int++) {
                        $td.prepend('<span class="treetable-indent"></span>')
                    }
                }
                $tr.append($td);
            }
        });
        return $tr;
    };
    //是否有滚动条，true:垂直滚动条  false:水平滚动条
    BootstrapTreeTable.prototype.hasScroll = function(flag){
        var self = this;
        var box = self.$el.parent()[0];
        //offsetHeight=scrollHeight=clientHeight则没有滚动条
        //垂直滚动条
        if(flag&&box.scrollHeight>box.clientHeight){
            return true;
        }
        //水平滚动条
        if((!(flag))&&box.offsetHeight-box.clientHeight>0){
            return true;
        }
        return false;
    };
    //获取滚动条宽度
    BootstrapTreeTable.prototype.getScrollWidth = function(elem){
        var width = 0;
        if(elem){
          width = elem.offsetWidth - elem.clientWidth;
        } else {
          elem = document.createElement('div');
          elem.style.width = '100px';
          elem.style.height = '100px';
          elem.style.overflowY = 'scroll';

          document.body.appendChild(elem);
          width = elem.offsetWidth - elem.clientWidth;
          document.body.removeChild(elem);
        }
        return width;
    };
    // 注册刷新按钮点击事件
    BootstrapTreeTable.prototype.registerRefreshBtnClickEvent = function(btn) {
        var self = this;
        $(btn).off('click').on('click', function() {
            self.refresh();
        });
    };
    // 注册列选项事件
    BootstrapTreeTable.prototype.registerColumnClickEvent = function() {
        var self = this;
        $(".bootstrap-tree-table .treetable-bars .columns label input").off('click').on('click', function() {
            var $this = $(this);
            if ($this.prop('checked')) {
                self.showColumn($(this).val());
            } else {
                self.hideColumn($(this).val());
            }
        });
    };
    // 注册行点击事件
    BootstrapTreeTable.prototype.registerRowClickEvent = function() {
        var self = this;
        self.$el.find("tbody").find("tr").find("td").off('click dblclick').on('click dblclick', function(e) {
            var $td = $(this),
                $tr = $td.parent(),
                item = self.data_obj["id_" + $tr.attr("dataid")],
                field = $td.attr("name"),
                value = item[field];
            self.trigger(e.type === 'click' ? 'click-cell' : 'dbl-click-cell', field, value, item, $td);
            self.trigger(e.type === 'click' ? 'click-row' : 'dbl-click-row', item, $tr, field);
            if (self.hasSelectItem) {
                var $ipt = $tr.find("input[name='select_item']");
                if ($ipt.attr("type") == "radio") {
                    $ipt.prop('checked', true);
                    self.$el.find("tbody").find("tr").removeClass("treetable-selected");
                    $tr.addClass("treetable-selected");
                } else {
                    if ($ipt.prop('checked')) {
                        $ipt.prop('checked', false);
                        $tr.removeClass("treetable-selected");
                    } else {
                        $ipt.prop('checked', true);
                        $tr.addClass("treetable-selected");
                    }
                }
            }
        });
    };
    // 注册小图标点击事件--展开缩起
    BootstrapTreeTable.prototype.registerExpanderEvent = function() {
        var self = this;
        self.$el.find("tbody").find("tr").find(".treetable-expander").off('click').on('click', function() {
            var _isExpanded = $(this).hasClass(self.options.expanderExpandedClass);
            var _isCollapsed = $(this).hasClass(self.options.expanderCollapsedClass);
            if (_isExpanded || _isCollapsed) {
                var tr = $(this).parent().parent();
                var row_id = tr.attr("id");
                var _ls = self.$el.find("tbody").find("tr[id^='" + row_id + "_']"); //下所有
                if (_isExpanded) {
                    $(this).removeClass(self.options.expanderExpandedClass);
                    $(this).addClass(self.options.expanderCollapsedClass);
                    if (_ls && _ls.length > 0) {
                        $.each(_ls, function(index, item) {
                            $(item).css("display", "none");
                        });
                    }
                } else {
                    $(this).removeClass(self.options.expanderCollapsedClass);
                    $(this).addClass(self.options.expanderExpandedClass);
                    if (_ls && _ls.length > 0) {
                        $.each(_ls, function(index, item) {
                            // 父icon
                            var _p_icon = $("#" + $(item).attr("pid")).children().eq(self.options.expandColumn).find(".treetable-expander");
                            if (_p_icon.hasClass(self.options.expanderExpandedClass)) {
                                $(item).css("display", "table");
                            }
                        });
                    }
                }
            }
        });
    };
    // 刷新数据
    BootstrapTreeTable.prototype.refresh = function(parms) {
        var self = this;
        if (parms) {
            self.lastAjaxParams = parms;
        }
        self.initServer(self.lastAjaxParams);
    };
    // 添加数据刷新表格
    BootstrapTreeTable.prototype.appendData = function(data) {
        var self = this;
        // 下边的操作主要是为了查询时让一些没有根节点的节点显示
        $.each(data, function(i, item) {
            var _data = self.data_obj["id_" + item[self.options.id]];
            var _p_data = self.data_obj["id_" + item[self.options.parentId]];
            var _c_list = self.data_list["_n_" + item[self.options.parentId]];
            var row_id = ""; //行id
            var p_id = ""; //父行id
            var _lv = 1; //如果没有父就是1默认显示
            var tr; //要添加行的对象
            if (_data && _data.row_id && _data.row_id != "") {
                row_id = _data.row_id; // 如果已经存在了，就直接引用原来的
            }
            if (_p_data) {
                p_id = _p_data.row_id;
                if (row_id == "") {
                    var _tmp = 0
                    if (_c_list && _c_list.length > 0) {
                        _tmp = _c_list.length;
                    }
                    row_id = _p_data.row_id + "_" + _tmp;
                }
                _lv = _p_data.lv + 1; //如果有父
                // 绘制行
                tr = self.renderRow(item, false, _lv, row_id, p_id);

                var _p_icon = $("#" + _p_data.row_id).children().eq(self.options.expandColumn).find(".treetable-expander");
                var _isExpanded = _p_icon.hasClass(self.options.expanderExpandedClass);
                var _isCollapsed = _p_icon.hasClass(self.options.expanderCollapsedClass);
                // 父节点有没有展开收缩按钮
                if (_isExpanded || _isCollapsed) {
                    // 父节点展开状态显示新加行
                    if (_isExpanded) {
                        tr.css("display", "table");
                    }
                } else {
                    // 父节点没有展开收缩按钮则添加
                    _p_icon.addClass(self.options.expanderCollapsedClass);
                }

                if (_data) {
                    $("#" + _data.row_id).before(tr);
                    $("#" + _data.row_id).remove();
                } else {
                    // 计算父的同级下一行
                    var _tmp_ls = _p_data.row_id.split("_");
                    var _p_next = _p_data.row_id.substring(0, _p_data.row_id.length - 1) + (parseInt(_tmp_ls[_tmp_ls.length - 1]) + 1);
                    // 画上
                    $("#" + _p_next).before(tr);
                }
            } else {
                tr = self.renderRow(item, false, _lv, row_id, p_id);
                if (_data) {
                    $("#" + _data.row_id).before(tr);
                    $("#" + _data.row_id).remove();
                } else {
                    // 画上
                    var tbody = self.$el.find("tbody");
                    tbody.append(tr);
                }
            }
            item.isShow = true;
            // 缓存并格式化数据
            self.formatData([item]);
        });
        self.registerExpanderEvent();
        self.registerRowClickEvent();
        self.initHiddenColumns();
    };
    // 展开/折叠指定的行
    BootstrapTreeTable.prototype.toggleRow = function(id) {
        var self = this;
        var _rowData = self.data_obj["id_" + id];
        var $row_expander = $("#" + _rowData.row_id).find(".treetable-expander");
        $row_expander.trigger("click");
    };
    // 展开指定的行
    BootstrapTreeTable.prototype.expandRow = function(id) {
        var self = this;
        var _rowData = self.data_obj["id_" + id];
        var $row_expander = $("#" + _rowData.row_id).find(".treetable-expander");
        var _isCollapsed = $row_expander.hasClass(self.$el.options.expanderCollapsedClass);
        if (_isCollapsed) {
            $row_expander.trigger("click");
        }
    };
    // 折叠 指定的行
    BootstrapTreeTable.prototype.collapseRow = function(id) {
        var self = this;
        var _rowData = self.data_obj["id_" + id];
        var $row_expander = $("#" + _rowData.row_id).find(".treetable-expander");
        var _isExpanded = $row_expander.hasClass(self.$el.options.expanderExpandedClass);
        if (_isExpanded) {
            $row_expander.trigger("click");
        }
    };
    // 展开所有的行
    BootstrapTreeTable.prototype.expandAll = function() {
        var self = this;
        self.$el.find("tbody").find("tr").find(".treetable-expander").each(function(i, n) {
            var _isCollapsed = $(n).hasClass(self.options.expanderCollapsedClass);
            if (_isCollapsed) {
                $(n).trigger("click");
            }
        })
    };
    // 折叠所有的行
    BootstrapTreeTable.prototype.collapseAll = function() {
        var self = this;
        self.$el.find("tbody").find("tr").find(".treetable-expander").each(function(i, n) {
            var _isExpanded = $(n).hasClass(self.options.expanderExpandedClass);
            if (_isExpanded) {
                $(n).trigger("click");
            }
        })
    };
    // 显示指定列
    BootstrapTreeTable.prototype.showColumn = function(field) {
        var self = this;
        var _index = $.inArray(field, self.hiddenColumns);
        if (_index > -1) {
            self.hiddenColumns.splice(_index, 1);
        }
        self.$el.parent().parent().parent().find("." + field + "_cls").show();
        //是否更新列选项状态
        if (self.options.showColumns) {
            var $input = $(".bootstrap-tree-table .treetable-bars .columns label").find("input[value='" + field + "']")
            $input.prop("checked", 'checked');
        }
        self.autoReSize();
    };
    // 隐藏指定列
    BootstrapTreeTable.prototype.hideColumn = function(field) {
        var self = this;
        self.hiddenColumns.push(field);
       self.$el.parent().parent().parent().find("." + field + "_cls").hide();
        //是否更新列选项状态
        if (self.options.showColumns) {
            var $input = $(".bootstrap-tree-table .treetable-bars .columns label").find("input[value='" + field + "']")
            $input.prop("checked", '');
        }
        self.autoReSize();
    };
    // 获取已选行
    BootstrapTreeTable.prototype.getSelections = function() {
        var self = this;
        if (self.hasSelectItem) {
            // 所有被选中的记录input
            var $ipt = self.$el.find("tbody").find("tr").find("input[name='select_item']:checked");
            var chk_value = [];
            // 如果是radio
            if ($ipt.attr("type") == "radio") {
                var _data = self.data_obj["id_" + $ipt.val()];
                chk_value.push(_data);
            } else {
                $ipt.each(function(_i, _item) {
                    var _data = self.data_obj["id_" + $(_item).val()];
                    chk_value.push(_data);
                });
            }
            return chk_value;
        }
        return;
    };
    // 触发事件
    BootstrapTreeTable.prototype.trigger = function(name) {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.tree.table';
        self.options[BootstrapTreeTable.EVENTS[name]].apply(self.options, args);
        self.$el.trigger($.Event(name), args);

        self.options.onAll(name, args);
        self.$el.trigger($.Event('all.bs.tree.table'), [name, args]);
    };
    // 销毁
    BootstrapTreeTable.prototype.destroy = function() {
        var self = this;
        var $container = self.$el.parent().parent().parent();
        self.$el.insertBefore($container);
        $(self.options.toolbar).insertBefore(self.$el);
        $container.remove();
        this.$el.html(this.$el_.html());
    };

    // 组件方法
    BootstrapTreeTable.METHODS = [
        "getSelections",
        "refresh",
        "appendData",
        "toggleRow",
        "expandRow",
        "collapseRow",
        "expandAll",
        "collapseAll",
        "showColumn",
        "hideColumn",
        "destroy"
    ];

    // 组件事件
    BootstrapTreeTable.EVENTS = {
        'all.bs.tree.table': 'onAll',
        'click-cell.bs.tree.table': 'onClickCell',
        'dbl-click-cell.bs.tree.table': 'onDblClickCell',
        'click-row.bs.tree.table': 'onClickRow',
        'dbl-click-row.bs.tree.table': 'onDblClickRow',
        'load-success.bs.tree.table': 'onLoadSuccess',
        'load-error.bs.tree.table': 'onLoadError'
    };
    // 默认配置
    BootstrapTreeTable.DEFAULTS = {
        id: 'id', // 选取记录返回的值,用于设置父子关系
        parentId: 'parentId', // 用于设置父子关系
        rootIdValue: null, // 设置根节点id值----可指定根节点，默认为null,"",0,"0"
        data: null, // 构造table的数据集合
        type: "GET", // 请求数据的ajax类型
        url: null, // 请求数据的ajax的url
        ajaxParams: {}, // 请求数据的ajax的data属性
        expandColumn: 0, // 在哪一列上面显示展开按钮
        expandAll: false, // 是否全部展开
        expandFirst: true, // 是否默认第一级展开--expandAll为false时生效
        striped: false, // 是否各行渐变色
        bordered: true, // 是否显示边框
        hover: true, // 是否鼠标悬停
        condensed: false, // 是否紧缩表格
        columns: [], // 列
        toolbar: null, // 顶部工具条
        width: 0, // 表格宽度
        height: 0, // 表格高度
        showTitle: true, // 是否采用title属性显示字段内容（被formatter格式化的字段不会显示）
        showColumns: true, // 是否显示内容列下拉框
        showRefresh: true, // 是否显示刷新按钮
        expanderExpandedClass: 'bstt-icon bstt-chevron-down', // 展开的按钮的图标
        expanderCollapsedClass: 'bstt-icon bstt-chevron-right', // 缩起的按钮的图标
        toolRefreshClass: 'bstt-icon bstt-refresh', // 工具栏刷新按钮
        toolColumnsClass: 'bstt-icon bstt-columns', // 工具栏列按钮
        onAll: function(data) {
            return false;
        },
        onLoadSuccess: function(data) {
            return false;
        },
        onLoadError: function(status) {
            return false;
        },
        onClickCell: function(field, value, row, $element) {
            return false;
        },
        onDblClickCell: function(field, value, row, $element) {
            return false;
        },
        onClickRow: function(row, $element) {
            return false;
        },
        onDblClickRow: function(row, $element) {
            return false;
        }
    };

    BootstrapTreeTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        field: undefined,
        title: undefined,
        align: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        visible: true,
        fixed:undefined,//固定列。可选值有：left（固定在左）、right（固定在右）。一旦设定，对应的列将会被固定在左或右，不随滚动条而滚动。 注意：如果是固定在左，该列必须放在表头最前面；如果是固定在右，该列必须放在表头最后面。
        formatter: undefined,
    };

    $.fn.bootstrapTreeTable = function(option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this),
                data = $this.data('bootstrap.tree.table'),
                options = $.extend({}, BootstrapTreeTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if ($.inArray(option, BootstrapTreeTable.METHODS) < 0) {
                    throw new Error("Unknown method: " + option);
                }
                if (!data) {
                    return;
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bootstrap.tree.table');
                }
            }
            if (!data) {
                $this.data('bootstrap.tree.table', (data = new BootstrapTreeTable(this, options)));
            }
        });
        return typeof value === 'undefined' ? this : value;
    };
})(jQuery);