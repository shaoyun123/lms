/**

 @Name：layui.table 表格操作
 @Author：贤心
 @License：MIT

 */

layui.define(['laytpl', 'laypage', 'layer', 'form'], function(exports) {
    "use strict";

    var $ = layui.$,
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form,
        hint = layui.hint(),
        device = layui.device()

        //外部接口
        , table = {
            config: {
                checkName: 'LAY_CHECKED' //是否选中状态的字段名
                ,
                indexName: 'LAY_TABLE_INDEX' //下标索引名
            } //全局配置项
            ,
            cache: {} //数据缓存
            ,
            index: layui.table ? (layui.table.index + 10000) : 0

            //设置全局项
            ,
            set: function(options) {
                var that = this;
                that.config = $.extend({}, that.config, options);
                return that;
            }

            //事件监听
            ,
            on: function(events, callback) {
                return layui.onevent.call(this, MOD_NAME, events, callback);
            }
        }

        //操作当前实例
        , thisTable = function() {
            var that = this,
                options = that.config,
                id = options.id;

            id && (thisTable.config[id] = options);
            id && (thisTable.that[id] = that); // 记录当前实例对象
            return {
                reload: function(options) {
                    that.reload.call(that, options);
                },
                config: options
            }
        }

        // 解析自定义模板数据
        ,parseTempData = function(obj){
            obj = obj || {};

            var options = this.config || {}
                ,item3 = obj.item3 // 表头数据
                ,content = obj.content; // 原始内容

            // 是否编码 HTML
            if(options.escape) content = util.escape(content);

            // 获取模板
            var templet = obj.text && item3.exportTemplet || (item3.templet || item3.toolbar);

            // 获取模板内容
            if(templet){
                content = typeof templet === 'function'
                    ? templet.call(item3, obj.tplData, obj.obj)
                    : laytpl($(templet).html() || String(content)).render(obj.tplData);
            }

            // 是否只返回文本
            return obj.text ? $('<div>'+ content +'</div>').text() : content;
        }

        //字符常量
        , MOD_NAME = 'table', ELEM = '.layui-table', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled', NONE = 'layui-none'

        , ELEM_VIEW = 'layui-table-view', ELEM_HEADER = '.layui-table-header', ELEM_BODY = '.layui-table-body', ELEM_MAIN = '.layui-table-main', ELEM_FIXED = '.layui-table-fixed', ELEM_FIXL = '.layui-table-fixed-l', ELEM_FIXR = '.layui-table-fixed-r', ELEM_TOOL = '.layui-table-tool', ELEM_TOTAL = '.layui-table-total', ELEM_PAGE = '.layui-table-page', ELEM_SORT = '.layui-table-sort', ELEM_EDIT = 'layui-table-edit', ELEM_HOVER = 'layui-table-hover'

        //thead区域模板
        , TPL_HEADER = function(options) {
            var rowCols = '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}';

            options = options || {};
            return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', '<thead>', '{{# layui.each(d.data.cols, function(i1, item1){ }}', '<tr>', '{{# layui.each(item1, function(i2, item2){ }}', '{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}', '{{# if(item2.fixed === "right"){ right = true; } }}', function() {
                if (options.fixed && options.fixed !== 'right') {
                    return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
                }
                if (options.fixed === 'right') {
                    return '{{# if(item2.fixed === "right"){ }}';
                }
                return '';
            }(), '<th data-field="{{ item2.field||i2 }}" {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} ' + rowCols + ' {{# if(item2.unresize){ }}data-unresize="true"{{# } }}>', '<div class="layui-table-cell laytable-cell-', '{{# if(item2.colspan > 1){ }}', 'group', '{{# } else { }}', '{{d.index}}-{{item2.field || i2}}', '{{# if(item2.type !== "normal"){ }}', ' laytable-cell-{{ item2.type }}', '{{# } }}', '{{# } }}', '" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>', '{{# if(item2.type === "checkbox"){ }}' //复选框
                , '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}>', '{{# } else { }}', '<span>{{item2.title||""}}</span>', '{{# if(!(item2.colspan > 1) && item2.sort){ }}', '<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>', '{{# } }}', '{{# } }}', '</div>', '</th>', (options.fixed ? '{{# }; }}' : ''), '{{# }); }}', '</tr>', '{{# }); }}', '</thead>', '</table>'
            ].join('');
        }

        //tbody区域模板
        , TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', '<tbody></tbody>', '</table>'].join('')

        //主模板
        , TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">'

            , '{{# if(d.data.toolbar){ }}', '<div class="layui-table-tool"></div>', '{{# } }}'

            , '<div class="layui-table-box">', '{{# var left, right; }}', '<div class="layui-table-header">', TPL_HEADER(), '</div>', '<div class="layui-table-body layui-table-main">', TPL_BODY, '</div>'

            , '{{# if(left){ }}', '<div class="layui-table-fixed layui-table-fixed-l">', '<div class="layui-table-header">', TPL_HEADER({ fixed: true }), '</div>', '<div class="layui-table-body">', TPL_BODY, '</div>', '</div>', '{{# }; }}'

            , '{{# if(right){ }}', '<div class="layui-table-fixed layui-table-fixed-r">', '<div class="layui-table-header">', TPL_HEADER({ fixed: 'right' }), '<div class="layui-table-mend"></div>', '</div>', '<div class="layui-table-body">', TPL_BODY, '</div>', '</div>', '{{# }; }}', '</div>'

            , '{{# if(d.data.totalRow){ }}', '<div class="layui-table-total">', '<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ', '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>', '<tbody><tr><td><div class="layui-table-cell" style="visibility: hidden;">Total</div></td></tr></tbody>', '</table>', '</div>', '{{# } }}'

            , '{{# if(d.data.page){ }}', '<div class="layui-table-page">', '<div id="layui-table-page{{d.index}}"></div>', '</div>', '{{# } }}'

            , '<style>', '{{# layui.each(d.data.cols, function(i1, item1){', 'layui.each(item1, function(i2, item2){ }}', '.laytable-cell-{{d.index}}-{{item2.field||i2}}{ ', '{{# if(item2.width){ }}', 'width: {{item2.width}}px;', '{{# } }}', ' }', '{{# });', '}); }}', '</style>', '</div>'
        ].join('')

        , _WIN = $(window), _DOC = $(document), LayuiTableColFilter = [
            '<span class="layui-table-filter layui-inline">',
            '<span class="layui-tablePlug-icon layui-tablePlug-icon-filter"><i class="layui-icon layui-icon-search"></i></span>',
            '</span>'
        ]

        //构造器
        , Class = function(options) {
            var that = this;
            that.index = ++table.index;
            that.config = $.extend({}, that.config, table.config, options);
            that.render();
        };

    //默认配置
    Class.prototype.config = {
        limit: 10 //每页显示的数量
        ,
        loading: true //请求数据时，是否显示loading
        ,
        cellMinWidth: 60 //所有单元格默认最小宽度
        ,
        text: {
            none: '无数据'
        }
    };

    //表格渲染
    Class.prototype.render = function() {
        var that = this,
            options = that.config;
        options.loading = false;
        options.elem = $(options.elem);
        options.where = options.where || {};
        options.id = options.id || options.elem.attr('id');

        //请求参数的自定义格式
        options.request = $.extend({
            pageName: 'page',
            limitName: 'limit'
        }, options.request)

        //响应数据的自定义格式
        options.response = $.extend({
            statusName: 'code',
            statusCode: 0,
            msgName: 'msg',
            dataName: 'data',
            countName: 'count'
        }, options.response);

        //如果 page 传入 laypage 对象
        if (typeof options.page === 'object') {
            options.limit = options.page.limit || options.limit;
            options.limits = options.page.limits || options.limits;
            that.page = options.page.curr = options.page.curr || 1;
            delete options.page.elem;
            delete options.page.jump;
        }

        if (!options.elem[0]) return that;

        that.setArea(); //动态分配列宽高

        //开始插入替代元素
        var othis = options.elem,
            hasRender = othis.next('.' + ELEM_VIEW)

            //主容器
            , reElem = that.elem = $(laytpl(TPL_MAIN).render({
                VIEW_CLASS: ELEM_VIEW,
                data: options,
                index: that.index //索引
            }));

        options.index = that.index;

        //生成替代元素
        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
        othis.after(reElem);

        //各级容器
        that.layHeader = reElem.find(ELEM_HEADER);
        that.layMain = reElem.find(ELEM_MAIN);
        that.layBody = reElem.find(ELEM_BODY);
        that.layFixed = reElem.find(ELEM_FIXED);
        that.layFixLeft = reElem.find(ELEM_FIXL);
        that.layFixRight = reElem.find(ELEM_FIXR);
        that.layTool = reElem.find(ELEM_TOOL);
        that.layTotal = reElem.find(ELEM_TOTAL);
        that.layPage = reElem.find(ELEM_PAGE);

        that.layTool.html(
            laytpl($(options.toolbar).html() || '').render(options)
        );

        if (options.height) that.fullSize(); //设置body区域高度

        //如果多级表头，则填补表头高度
        if (options.cols.length > 1) {
            var th = that.layFixed.find(ELEM_HEADER).find('th');
            th.height(that.layHeader.height() - 1 - parseFloat(th.css('padding-top')) - parseFloat(th.css('padding-bottom')));
        }

        //请求数据
        // that.pullData(that.page);
        that.pullData(that.page, that.loading()); // 修改表格重载的时候也loading
        that.events();
    };

    //根据列类型，定制化参数
    Class.prototype.initOpts = function(item) {
        var that = this,
            options = that.config,
            initWidth = {
                checkbox: 48,
                space: 15,
                numbers: 40
            };

        //让 type 参数兼容旧版本
        if (item.checkbox) item.type = "checkbox";
        if (item.space) item.type = "space";
        if (!item.type) item.type = "normal";

        if (item.type !== "normal") {
            item.unresize = true;
            item.width = item.width || initWidth[item.type];
        }
    };

    //动态分配列宽高
    Class.prototype.setArea = function() {
        var that = this,
            options = that.config,
            colNums = 0 //列个数
            ,
            autoColNums = 0 //自动列宽的列个数
            ,
            autoWidth = 0 //自动列分配的宽度
            ,
            countWidth = 0 //所有列总宽度和
            ,
            cntrWidth = options.width || function() { //获取容器宽度
                //如果父元素宽度为0（一般为隐藏元素），则继续查找上层元素，直到找到真实宽度为止
                var getWidth = function(parent) {
                    var width, isNone;
                    parent = parent || options.elem.parent()
                    width = parent.width();        
                    try {
                        isNone = parent.css('display') === 'none';
                    } catch (e) {}
                    if(options.widthoutWidthLimit){ // bug-10259 bug-10622  解决平台类目映射的映射处理的oa属性值有值时渲染Maximum问题
                        if (parent[0] && (!width || isNone)) return getWidth(parent.parent());
                    }else{
                        // 10259 切换到某些页签时，初始化页面列表被挤压变形
                        if ((parent[0] && (!width || isNone))||width <= 100) return getWidth(parent.parent());
                    }
                    return width;
                };
                return getWidth();
            }();
        //统计列个数
        that.eachCols(function() {
            colNums++;
        });

        //减去边框差
        cntrWidth = cntrWidth - function() {
            return (options.skin === 'line' || options.skin === 'nob') ? 2 : colNums + 1;
        }();

        //遍历所有列
        layui.each(options.cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                var width;

                if (!item2) {
                    item1.splice(i2, 1);
                    return;
                }

                that.initOpts(item2);
                width = item2.width || 0;

                if (item2.colspan > 1) return;

                if (/\d+%$/.test(width)) {
                    item2.width = width = Math.floor((parseFloat(width) / 100) * cntrWidth);
                } else if (!width) { //列宽未填写
                    item2.width = width = 0;
                    autoColNums++;
                }

                countWidth = countWidth + width;
            });
        });

        that.autoColNums = autoColNums; //记录自动列数

        //如果未填充满，则将剩余宽度平分。否则，给未设定宽度的列赋值一个默认宽
        (cntrWidth > countWidth && autoColNums) && (
            autoWidth = (cntrWidth - countWidth) / autoColNums
        );

        layui.each(options.cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                var minWidth = item2.minWidth || options.cellMinWidth;
                if (item2.colspan > 1) return;
                if (item2.width === 0) {
                    item2.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth); //不能低于设定的最小宽度
                }
            });
        });

        //高度铺满：full-差距值
        if (options.height && /^full-\d+$/.test(options.height)) {
            that.fullHeightGap = options.height.split('-')[1];
            options.height = _WIN.height() - that.fullHeightGap;
        }
    };

    //表格重载
    Class.prototype.reload = function(options) {
        var that = this;
        if (that.config.data && that.config.data.constructor === Array) delete that.config.data;
        that.config = $.extend({}, that.config, options);
        that.render();
    };

    //页码
    Class.prototype.page = 1;

    //获得数据
    Class.prototype.pullData = function(curr, loadIndex) {
        var that = this,
            options = that.config,
            request = options.request,
            response = options.response,
            sort = function() {
                if (typeof options.initSort === 'object') {
                    that.sort(options.initSort.field, options.initSort.type);
                }
            };

        that.startTime = new Date().getTime(); //渲染开始时间
        // console.log(options)
        if (options.url) { //Ajax请求
            var params = {};
            params[request.pageName] = curr;
            params[request.limitName] = options.limit;
            loading.show();
            var dataObj = $.extend(params, options.where);
            // var contentType = options.contentType ? (options.contentType.indexOf('application/json')== -1 ? 'application/x-www-form-urlencoded': 'application/json') : 'application/x-www-form-urlencoded';
            var contentType = options.contentType ? options.contentType : 'application/x-www-form-urlencoded';
            var submitData;
            if (contentType.indexOf('application/json') > -1) {
                submitData = JSON.stringify(dataObj);
            } else if (contentType == 'application/x-www-form-urlencoded') {
                submitData = dataObj;
            }
            $.ajax({
                type: options.method || 'get',
                url: options.url,
                contentType: contentType,
                data: submitData,
                dataType: 'json',
                beforeSend: function() {
                    // console.log(contentType, dataObj)
                    // console.log('发送请求前>>>>')
                },
                success: function(res) {
                    typeof options.created === 'function' && options.created(res);
                    if (res[response.statusName] != response.statusCode) {
                        that.renderForm();
                        that.layMain.html('<div class="' + NONE + '">' + (res[response.msgName] || '返回的数据状态异常') + '</div>');
                    } else {
                        that.renderData(res, curr, res[response.countName]), sort();
                        options.time = (new Date().getTime() - that.startTime) + ' ms'; //耗时（接口请求+视图渲染）
                    }
                    loadIndex && layer.close(loadIndex);
                    loading.hide();
                    if (!options.unFixedTableHead) {
                        $(options.elem).closest('.layui-card-body').prev('.layui-card-header').addClass('toFixedContain')
                        $(options.elem).next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                    }

                    typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
                    // 字段筛选
                    addFieldFilter.call(that);
                },
                error: function(e, m) {
                    that.layMain.html('<div class="' + NONE + '">数据接口请求异常</div>');
                    that.renderForm();
                    loading.hide();
                    loadIndex && layer.close(loadIndex);
                }
            });
        } else if (options.data && options.data.constructor === Array) { //已知数据
            loading.show();
            var res = {},
                startLimit = curr * options.limit - options.limit

            res[response.dataName] = options.data.concat().splice(startLimit, options.limit);
            res[response.countName] = options.data.length;

            that.renderData(res, curr, options.data.length), sort();
            loading.hide();
            if (!options.unFixedTableHead) {
                $(options.elem).closest('.layui-card-body').prev('.layui-card-header').addClass('toFixedContain')
                $(options.elem).next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
            }

            typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
            // 字段筛选
            addFieldFilter.call(that);
        }
    };

    //遍历表头
    Class.prototype.eachCols = function(callback) {
        var cols = $.extend(true, [], this.config.cols),
            arrs = [],
            index = 0;

        //重新整理表头结构
        layui.each(cols, function(i1, item1) {
            layui.each(item1, function(i2, item2) {
                //如果是组合列，则捕获对应的子列
                if (item2.colspan > 1) {
                    var childIndex = 0;
                    index++
                    item2.CHILD_COLS = [];
                    layui.each(cols[i1 + 1], function(i22, item22) {
                        if (item22.PARENT_COL || childIndex == item2.colspan) return;
                        item22.PARENT_COL = index;
                        item2.CHILD_COLS.push(item22);
                        childIndex = childIndex + (item22.colspan > 1 ? item22.colspan : 1);
                    });
                }
                if (item2.PARENT_COL) return; //如果是子列，则不进行追加，因为已经存储在父列中
                arrs.push(item2)
            });
        });

        //重新遍历列，如果有子列，则进入递归
        var eachArrs = function(obj) {
            layui.each(obj || arrs, function(i, item) {
                if (item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
                callback(i, item);
            });
        };

        eachArrs();
    };

    //数据渲染
    Class.prototype.renderData = function(res, curr, count, sort) {
        var that = this,
            options = that.config,
            data = res[options.response.dataName] || [],
            totalRowData = res[options.response.totalRowName], //合计行数据
            trs = [],
            trs_fixed = [],
            trs_fixed_r = []

            //渲染视图
            , render = function() { //后续性能提升的重点
                if (!sort && that.sortKey) {
                    return that.sort(that.sortKey.field, that.sortKey.sort, true);
                }
                layui.each(data, function(i1, item1) {
                    var tds = [],
                        tds_fixed = [],
                        tds_fixed_r = [],
                        numbers = i1 + options.limit * (curr - 1) + 1; //序号

                    if (item1.length === 0) return;
                    if (!sort) {
                        item1[table.config.indexName] = i1;
                    }

                    that.eachCols(function(i3, item3) {
                        var field = item3.field || i3,
                            content = item1[field],
                            cell = that.getColElem(that.layHeader, field);

                        if (content === undefined || content === null) content = '';
                        if (item3.colspan > 1) return;

                        //td内容
                        var td = ['<td data-field="' + field + '" ' + function() {
                            var attr = [];
                            if (item3.edit) attr.push('data-edit="' + item3.edit + '"'); //是否允许单元格编辑
                            if (item3.align) attr.push('align="' + item3.align + '"'); //对齐方式
                            if (item3.templet) attr.push('data-content="' + content + '"'); //自定义模板
                            if (item3.toolbar) attr.push('data-off="true"'); //自定义模板
                            if (item3.event) attr.push('lay-event="' + item3.event + '"'); //自定义事件
                            if (item3.style) attr.push('style="' + item3.style + '"'); //自定义样式
                            if (item3.minWidth) attr.push('data-minwidth="' + item3.minWidth + '"'); //单元格最小宽度
                            return attr.join(' ');
                        }() + '>', '<div class="layui-table-cell laytable-cell-' + function() { //返回对应的CSS类标识
                            var str = (options.index + '-' + field);
                            return item3.type === 'normal' ? str :
                                (str + ' laytable-cell-' + item3.type);
                        }() + '">' + function() {
                            var tplData = $.extend(true, {
                                LAY_INDEX: numbers
                            }, item1);

                            //渲染复选框列视图
                            if (item3.type === 'checkbox') {
                                return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" ' + function() {
                                    var checkName = table.config.checkName;
                                    //如果是全选
                                    if (item3[checkName]) {
                                        item1[checkName] = item3[checkName];
                                        return item3[checkName] ? 'checked' : '';
                                    }
                                    return tplData[checkName] ? 'checked' : '';
                                }() + '>';
                            } else if (item3.type === 'numbers') { //渲染序号
                                return numbers;
                            }

                            //解析工具列模板
                            if (item3.toolbar) {
                                return laytpl($(item3.toolbar).html() || '').render(tplData);
                            }
                            return item3.templet ? function() {
                                return typeof item3.templet === 'function' ?
                                    item3.templet(tplData) :
                                    laytpl($(item3.templet).html() || String(content)).render(tplData)
                            }() : content;
                        }(), '</div></td>'].join('');

                        tds.push(td);
                        if (item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
                        if (item3.fixed === 'right') tds_fixed_r.push(td);
                    });

                    trs.push('<tr data-index="' + i1 + '">' + tds.join('') + '</tr>');
                    trs_fixed.push('<tr data-index="' + i1 + '">' + tds_fixed.join('') + '</tr>');
                    trs_fixed_r.push('<tr data-index="' + i1 + '">' + tds_fixed_r.join('') + '</tr>');
                });

                //if(data.length === 0) return;

                that.layBody.scrollTop(0);
                that.layMain.find('.' + NONE).remove();
                //直接.html会存在内存泄露，先empty，再.html modify by zhaoyd 20211220
                that.layMain.find('tbody').empty();
                that.layFixLeft.find('tbody').empty();
                that.layFixRight.find('tbody').empty();

                that.layMain.find('tbody').html(trs.join(''));
                that.layFixLeft.find('tbody').html(trs_fixed.join(''));
                that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

                that.renderForm();
                that.syncCheckAll();
                that.haveInit ? that.scrollPatch() : setTimeout(function() {
                    that.scrollPatch();
                }, 50);
                that.haveInit = true;
                layer.close(that.tipsIndex);
            };

        that.key = options.id || options.index;
        table.cache[that.key] = data; //记录数据

        //显示隐藏分页栏
        that.layPage[data.length === 0 && curr == 1 ? 'addClass' : 'removeClass'](HIDE);

        //排序
        if (sort) {
            return render();
        }

        if (data.length === 0) {
            that.renderForm();
            that.layFixed.remove();
            that.layMain.find('tbody').html('');
            that.layMain.find('.' + NONE).remove();
            return that.layMain.append('<div class="' + NONE + '">' + options.text.none + '</div>');
        }

        render();
        that.renderTotal(data,totalRowData); //数据合计
        //同步分页状态
        if (options.page) {
            options.page = $.extend({
                elem: 'layui-table-page' + options.index,
                count: count,
                limit: options.limit,
                limits: options.limits || [10, 20, 30, 40, 50, 60, 70, 80, 90],
                groups: 3,
                layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
                prev: '<i class="layui-icon">&#xe603;</i>',
                next: '<i class="layui-icon">&#xe602;</i>',
                jump: function(obj, first) {
                    if (!first) {
                        //分页本身并非需要做以下更新，下面参数的同步，主要是因为其它处理统一用到了它们
                        //而并非用的是 options.page 中的参数（以确保分页未开启的情况仍能正常使用）
                        that.page = obj.curr; //更新页码
                        options.limit = obj.limit; //更新每页条数

                        that.pullData(obj.curr, that.loading());
                    }
                }
            }, options.page);
            options.page.count = count; //更新总条数
            laypage.render(options.page);
        }
    };

    //数据合计行
    Class.prototype.renderTotal = function(data,totalRowData) {
        var that = this,
            options = that.config,
            totalNums = {};

        if (!options.totalRow) return;

        layui.each(data, function(i1, item1) {
            if (item1.length === 0) return;

            that.eachCols(function(i3, item3) {
                var field = item3.field || i3,
                    content = item1[field];

                if (item3.totalRow) {
                    totalNums[field] = (totalNums[field] || 0) + (parseFloat(content) || 0);
                }
            });
        });

        that.dataTotal = {};

        var tds = [];
        that.eachCols(function(i3, item3) {
            var field = item3.field || i3;
            var content = function(){
                    var text = item3.totalRowText || ''
                        ,decimals = 'totalRowDecimals' in item3 ? item3.totalRowDecimals : 2
                        ,thisTotalNum = parseFloat(totalNums[field]).toFixed(decimals)
                        ,tplData = {}
                        ,getContent;

                    tplData[field] = thisTotalNum;

                    //获取自动计算的合并内容
                    getContent = item3.totalRow ? (parseTempData.call(that, {
                        item3: item3
                        ,content: thisTotalNum
                        ,tplData: tplData
                    }) || text) : text;

                    //如果直接传入了合计行数据，则不输出自动计算的结果
                    return totalRowData ? (totalRowData[item3.field] || getContent) : getContent;
                }();
            //td内容
            var td = ['<td data-field="' + field + '" ' + function() {
                var attr = [];
                if (item3.align) attr.push('align="' + item3.align + '"'); //对齐方式
                if (item3.style) attr.push('style="' + item3.style + '"'); //自定义样式
                if (item3.minWidth) attr.push('data-minwidth="' + item3.minWidth + '"'); //单元格最小宽度
                return attr.join(' ');
            }() + ' class="' + function() { //追加样式
                var classNames = [];
                if (item3.hide) classNames.push(HIDE); //插入隐藏列样式
                if (!item3.field) classNames.push('layui-table-col-special'); //插入特殊列样式
                return classNames.join(' ');
            }() + '">', '<div class="layui-table-cell laytable-cell-' + function() { //返回对应的CSS类标识
                // var str = (options.index + '-' + item3.key);
                var str = (options.index + '-' + field);
                return item3.type === 'normal' ? str :
                    (str + ' laytable-cell-' + item3.type);
            }() + '">' + function() {
                var totalRow = item3.totalRow || options.totalRow;

                //如果 totalRow 参数为字符类型，则解析为自定义模版
                if(typeof totalRow === 'string'){
                    return laytpl(totalRow).render($.extend({
                        TOTAL_NUMS: totalNums[field]
                    }, item3));
                }
                return content;
            }()
                ,'</div></td>'].join('');

            item3.field && (that.dataTotal[field] = content);
            tds.push(td);
        });

        that.layTotal.find('tbody').html('<tr>' + tds.join('') + '</tr>');
    };

    //找到对应的列元素
    Class.prototype.getColElem = function(parent, field) {
        var that = this,
            options = that.config;
        return parent.eq(0).find('.laytable-cell-' + (options.index + '-' + field) + ':eq(0)');
    };

    //渲染表单
    Class.prototype.renderForm = function(type) {
        form.render(type, 'LAY-table-' + this.index);
    }

    //数据排序
    Class.prototype.sort = function(th, type, pull, formEvent) {
        const newSortColObj={
            'dailySale_orderNum':'dailySale_orderNum',
            'dailySale_orderAmt':'dailySale_orderAmt',
            'dailySale_orderFee':'dailySale_orderFee',
            'dailySale_otherCurrencyFee':'dailySale_otherCurrencyFee',
            'dailySale_orderRefundNum':'dailySale_orderRefundNum',
            'dailySale_orderRefundAmt':'dailySale_orderRefundAmt',
            'dailySale_prodCost':'dailySale_prodCost',
            'dailySale_shippingCost':'dailySale_shippingCost',
            'dailySale_storageCost':'dailySale_storageCost',
            'dailySale_profit':'dailySale_profit',
            'dailySale_avgOrderAmt':'dailySale_avgOrderAmt',
            'shopee_accer_listingLimitRate': 'listingLimitRate',
            'shopee_accer_listingLimit': "listingLimit"
        }
    
        var that = this,
            field, res = {},
            options = that.config,
            filter = options.elem.attr('lay-filter'),
            data = table.cache[that.key],
            thisData;

        //字段匹配
        if (typeof th === 'string') {
            that.layHeader.find('th').each(function(i, item) {
                var othis = $(this),
                    _field = othis.data('field');
                if (_field === th) {
                    th = othis;
                    field = _field;
                    return false;
                }
            });
        }

        try {
            var field = field || th.data('field');

            //如果欲执行的排序已在状态中，则不执行渲染
            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return;
                }
            }

            var elemSort = that.layHeader.find('th .laytable-cell-' + options.index + '-' + field).find(ELEM_SORT);
            that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
            elemSort.attr('lay-sort', type || null);
            that.layFixed.find('th')
        } catch (e) {
            return hint.error('Table modules: Did not match to field');
        }

        //记录排序索引和类型
        that.sortKey = {
            field: field,
            sort: type
        };

        if (options.sortType !== 'server' || !options.url) {
            // 非服务器端分页的情况，一般是data模式或者url模式中设置了其他的sortType（非server即可）
            // data模式的即使设置了sortType:'server'也忽略直接按照前端排序走
            const isNewSort = newSortColObj[field]
            if (type === 'asc') { //升序
                thisData =isNewSort ? that.newLayuiSort(data,  newSortColObj[field]) : layui.sort(data, field);
            } else if (type === 'desc') { //降序
                thisData =isNewSort ? that.newLayuiSort(data, newSortColObj[field], true) : layui.sort(data, field, true);
            } else { //清除排序
                thisData =isNewSort ? that.newLayuiSort(data, table.config.indexName) : layui.sort(data, table.config.indexName);
                // delete that.sortKey;
            }
            res[options.response.dataName] = thisData;
            that.renderData(res, that.page, that.count, true);
        } else {
            // 服务器端分页，目前是在sort回调里面重载表格，后面要优化一下
            res[options.response.dataName] = data;
            // 前面加了一个判断的作用是避免重复无用的渲染浪费资源
            formEvent || that.renderData(res, that.page, that.count, true);
        }

        if (formEvent) {
            layui.event.call(th, MOD_NAME, 'sort(' + filter + ')', {
                field: field,
                type: type
            });
        }
    };

    // 新排序layui.sort
    // 将数组中的成员对象按照某个 key 的 value 值进行排序
    Class.prototype.newLayuiSort = function(arr, key, desc){
        var that = this
        ,clone = JSON.parse(
        JSON.stringify(arr || [])
        );
        
        // 若未传入 key，则直接返回原对象
        if(that.type(arr) === 'object' && !key){
        return clone;
        } else if(typeof arr !== 'object'){ //若 arr 非对象
        return [clone];
        }
        
        // 开始排序
        clone.sort(function(o1, o2){
        var v1 = o1[key]
        ,v2 = o2[key];
        
        /*
        * 特殊数据
        * 若比较的成员均非对象
        */

        // 若比较的成员均为数字
        if(!isNaN(o1) && !isNaN(o2)) return o1 - o2;
        // 若比较的成员只存在某一个非对象
        if(!isNaN(o1) && isNaN(o2)){
            if(key && typeof o2 === 'object'){
            v1 = o1;
            } else {
            return -1;
            }
        } else if (isNaN(o1) && !isNaN(o2)){
            if(key && typeof o1 === 'object'){
            v2 = o2;
            } else {
            return 1;
            }
        }

        /*
        * 正常数据
        * 即成员均为对象，也传入了对比依据： key
        * 若 value 为数字，按「大小」排序；若 value 非数字，则按「字典序」排序
        */

        // value 是否为数字
        var isNum = [!isNaN(v1), !isNaN(v2)];

        // 若为数字比较
        if(isNum[0] && isNum[1]){
            if(v1 && (!v2 && v2 !== 0)){ //数字 vs 空
            return 1;
            } else if((!v1 && v1 !== 0) && v2){ //空 vs 数字
            return -1;
            } else { //数字 vs 数字
            return v1 - v2;
            }
        };
        
        /**
         * 字典序排序
         */
        
        // 若为非数字比较
        if(!isNum[0] && !isNum[1]){
            // 字典序比较
            if(v1 > v2){
            return 1;
            } else if (v1 < v2) {
            return -1;
            } else {
            return 0;
            }
        }
        
        // 若为混合比较
        if(isNum[0] || !isNum[1]){ //数字 vs 非数字
            return -1;
        } else if(!isNum[0] || isNum[1]) { //非数字 vs 数字
            return 1;
        }

        });

        desc && clone.reverse(); // 倒序
        return clone;
    };

    //typeof 类型细分 -> string/number/boolean/undefined/null、object/array/function/…
    Class.prototype._typeof = Class.prototype.type = function(operand){
    if(operand === null) return String(operand);
    
    //细分引用类型
    return (typeof operand === 'object' || typeof operand === 'function') ? function(){
      var type = Object.prototype.toString.call(operand).match(/\s(.+)\]$/) || [] //匹配类型字符
      ,classType = 'Function|Array|Date|RegExp|Object|Error|Symbol'; //常见类型字符
      
      type = type[1] || 'Object';
      
      //除匹配到的类型外，其他对象均返回 object
      return new RegExp('\\b('+ classType + ')\\b').test(type) 
        ? type.toLowerCase() 
      : 'object';
    }() : typeof operand;
  };

    //请求loading
    Class.prototype.loading = function() {
        return;
    };

    //同步选中值状态
    Class.prototype.setCheckData = function(index, checked) {
        var that = this,
            options = that.config,
            cols = that.config.cols[0],
            thisData = table.cache[that.key];
        if (!thisData[index]) return;
        if (thisData[index].constructor === Array) return;
        thisData[index][options.checkName] = checked;
    };

    //同步全选按钮状态
    Class.prototype.syncCheckAll = function() {
        var that = this,
            options = that.config,
            checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]'),
            syncColsCheck = function(checked) {
                that.eachCols(function(i, item) {
                    if (item.type === 'checkbox') {
                        item[options.checkName] = checked;
                    }
                });
                return checked;
            };

        if (!checkAllElem[0]) return;

        if (table.checkStatus(that.key, that).isAll) {
            if (!checkAllElem[0].checked) {
                checkAllElem.prop('checked', true);
                that.renderForm('checkbox');
            }
            syncColsCheck(true);
        } else {
            if (checkAllElem[0].checked) {
                checkAllElem.prop('checked', false);
                that.renderForm('checkbox');
            }
            syncColsCheck(false);
        }
    };

    //获取cssRule
    Class.prototype.getCssRule = function(field, callback) {
        var that = this,
            style = that.elem.find('style')[0],
            sheet = style.sheet || style.styleSheet || {},
            rules = sheet.cssRules || sheet.rules;
        layui.each(rules, function(i, item) {
            if (item.selectorText === ('.laytable-cell-' + that.index + '-' + field)) {
                return callback(item), true;
            }
        });
    };

    //铺满表格主体高度
    Class.prototype.fullSize = function() {
        var that = this,
            options = that.config,
            height = options.height,
            bodyHeight;

        if (that.fullHeightGap) {
            height = _WIN.height() - that.fullHeightGap;
            if (height < 135) height = 135;
            that.elem.css('height', height);
        }

        //tbody区域高度
        bodyHeight = parseFloat(height) - parseFloat(that.layHeader.height()) - 1;
        if (options.toolbar) {
            bodyHeight = bodyHeight - that.layTool.outerHeight();
        }
        if (options.page) {
            bodyHeight = bodyHeight - that.layPage.outerHeight() - 1;
        }
        // console.log(options)
        if (options.totalRow) {
            bodyHeight = bodyHeight - that.layTotal.outerHeight()
        }
        that.layMain.css('height', bodyHeight);
    };

    //获取滚动条宽度
    Class.prototype.getScrollWidth = function(elem) {
        var width = 0;
        if (elem) {
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

    //滚动条补丁
    Class.prototype.scrollPatch = function() {
        var that = this,
            layMainTable = that.layMain.children('table'),
            scollWidth = that.layMain.width() - that.layMain.prop('clientWidth') //纵向滚动条宽度
            ,
            scollHeight = that.layMain.height() - that.layMain.prop('clientHeight') //横向滚动条高度
            ,
            getScrollWidth = that.getScrollWidth(that.layMain[0]) //获取主容器滚动条宽度，如果有的话
            ,
            outWidth = layMainTable.outerWidth() - that.layMain.width(); //表格内容器的超出宽度

        //如果存在自动列宽，则要保证绝对填充满，并且不能出现横向滚动条
        if (that.autoColNums && outWidth < 5 && !that.scrollPatchWStatus) {
            var th = that.layHeader.eq(0).find('thead th:last-child'),
                field = th.data('field');
            that.getCssRule(field, function(item) {
                var width = item.style.width || th.outerWidth();
                item.style.width = (parseFloat(width) - getScrollWidth - outWidth) + 'px';

                //二次校验，如果仍然出现横向滚动条
                if (that.layMain.height() - that.layMain.prop('clientHeight') > 0) {
                    item.style.width = parseFloat(item.style.width) - 1 + 'px';
                }

                that.scrollPatchWStatus = true;
            });
        }

        if (scollWidth && scollHeight) {
            if (!that.elem.find('.layui-table-patch')[0]) {
                var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); //补丁元素
                patchElem.find('div').css({
                    width: scollWidth
                });
                that.layHeader.eq(0).find('thead tr').append(patchElem)
            }
        } else {
            that.layHeader.eq(0).find('.layui-table-patch').remove();
        }

        //固定列区域高度
        var mainHeight = that.layMain.height(),
            fixHeight = mainHeight - scollHeight;
        that.layFixed.find(ELEM_BODY).css('height', layMainTable.height() > fixHeight ? fixHeight : 'auto');

        //表格宽度小于容器宽度时，隐藏固定列
        that.layFixRight[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE);

        //操作栏
        that.layFixRight.css('right', scollWidth - 1);
    };

    //事件处理
    Class.prototype.events = function() {
        var that = this,
            options = that.config,
            _BODY = $('body'),
            dict = {},
            th = that.layHeader.find('th'),
            resizing, ELEM_CELL = '.layui-table-cell',
            filter = options.elem.attr('lay-filter');

        //拖拽调整宽度
        th.on('mousemove', function(e) {
            var othis = $(this),
                oLeft = othis.offset().left,
                pLeft = e.clientX - oLeft;
            if (othis.attr('colspan') > 1 || othis.data('unresize') || dict.resizeStart) {
                return;
            }
            dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
            _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
        }).on('mouseleave', function() {
            var othis = $(this);
            if (dict.resizeStart) return;
            _BODY.css('cursor', '');
        }).on('mousedown', function(e) {
            var othis = $(this);
            if (dict.allowResize) {
                var field = othis.data('field');
                e.preventDefault();
                dict.resizeStart = true; //开始拖拽
                dict.offset = [e.clientX, e.clientY]; //记录初始坐标

                that.getCssRule(field, function(item) {
                    var width = item.style.width || othis.outerWidth();
                    dict.rule = item;
                    dict.ruleWidth = parseFloat(width);
                    dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
                });
            }
        });
        //拖拽中
        _DOC.on('mousemove', function(e) {
            if (dict.resizeStart) {
                e.preventDefault();
                if (dict.rule) {
                    var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
                    if (setWidth < dict.minWidth) setWidth = dict.minWidth;
                    dict.rule.style.width = setWidth + 'px';
                    layer.close(that.tipsIndex);
                }
                resizing = 1
            }
        }).on('mouseup', function(e) {
            if (dict.resizeStart) {
                dict = {};
                _BODY.css('cursor', '');
                that.scrollPatch();
            }
            if (resizing === 2) {
                resizing = null;
            }
        });

        //排序
        th.on('click', function() {
            var othis = $(this),
                elemSort = othis.find(ELEM_SORT),
                nowType = elemSort.attr('lay-sort'),
                type;

            if (!elemSort[0] || resizing === 1) return resizing = 2;

            if (nowType === 'asc') {
                type = 'desc';
            } else if (nowType === 'desc') {
                type = null;
            } else {
                type = 'asc';
            }
            that.sort(othis, type, null, true);
        }).find(ELEM_SORT + ' .layui-edge ').on('click', function(e) {
            var othis = $(this),
                index = othis.index(),
                field = othis.parents('th').eq(0).data('field')
            layui.stope(e);
            if (index === 0) {
                that.sort(field, 'asc', null, true);
            } else {
                that.sort(field, 'desc', null, true);
            }
        });

        //复选框选择
        that.elem.on('click', 'input[name="layTableCheckbox"]+', function() {
            var checkbox = $(this).prev(),
                childs = that.layBody.find('tr').not('.layui-hide').find('input[name="layTableCheckbox"]'),
                index = checkbox.parents('tr').eq(0).data('index'),
                checked = checkbox[0].checked,
                isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';

            //全选
            if (isAll) {
                childs.each(function(i, item) {
                    //改为当前item定义index,适配表格合并，并不影响原功能
                    var itemindex = $(item).parents('tr').eq(0).data('index')
                    item.checked = checked;
                    that.setCheckData(itemindex, checked);
                });
                that.syncCheckAll();
                that.renderForm('checkbox');
            } else {
                that.setCheckData(index, checked);
                that.syncCheckAll();
            }
            layui.event.call(this, MOD_NAME, 'checkbox(' + filter + ')', {
                checked: checked,
                data: table.cache[that.key] ? (table.cache[that.key][index] || {}) : {},
                type: isAll ? 'all' : 'one'
            });
        });

        //行事件
        that.layBody.on('mouseenter', 'tr', function() {
            var othis = $(this),
                index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').addClass(ELEM_HOVER)
        }).on('mouseleave', 'tr', function() {
            var othis = $(this),
                index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').removeClass(ELEM_HOVER)
        });

        //单元格编辑
        that.layBody.on('change', '.' + ELEM_EDIT, function() {
            var othis = $(this),
                value = this.value,
                field = othis.parent().data('field'),
                index = othis.parents('tr').eq(0).data('index'),
                data = table.cache[that.key][index];

            data[field] = value; //更新缓存中的值

            layui.event.call(this, MOD_NAME, 'edit(' + filter + ')', {
                value: value,
                data: data,
                field: field
            });
        }).on('blur', '.' + ELEM_EDIT, function() {
            var templet, othis = $(this),
                field = othis.parent().data('field'),
                index = othis.parents('tr').eq(0).data('index'),
                data = table.cache[that.key][index];
            that.eachCols(function(i, item) {
                if (item.field == field && item.templet) {
                    templet = item.templet;
                }
            });
            othis.siblings(ELEM_CELL).html(
                templet ? laytpl($(templet).html() || this.value).render(data) : this.value
            );
            othis.parent().data('content', this.value);
            othis.remove();
        });

        //单元格事件
        that.layBody.on('click', 'td', function() {
            var othis = $(this),
                field = othis.data('field'),
                editType = othis.data('edit'),
                elemCell = othis.children(ELEM_CELL);

            layer.close(that.tipsIndex);
            if (othis.data('off')) return;

            //显示编辑表单
            if (editType) {
                if (editType === 'select') { //选择框
                    //var select = $('<select class="'+ ELEM_EDIT +'" lay-ignore><option></option></select>');
                    //othis.find('.'+ELEM_EDIT)[0] || othis.append(select);
                } else { //输入框
                    var input = $('<input class="layui-input ' + ELEM_EDIT + '">');
                    input[0].value = othis.data('content') || elemCell.text();
                    othis.find('.' + ELEM_EDIT)[0] || othis.append(input);
                    input.focus();
                }
                return;
            }

            //如果出现省略，则可查看更多
            if (elemCell.find('.layui-form-switch,.layui-form-checkbox')[0]) return; //限制不出现更多（暂时）

            /*if(Math.round(elemCell.prop('scrollWidth')) > Math.round(elemCell.outerWidth())){
              that.tipsIndex = layer.tips([
                '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 16) +'px;'+ function(){
                  if(options.size === 'sm'){
                    return 'padding: 4px 15px; font-size: 12px;';
                  }
                  if(options.size === 'lg'){
                    return 'padding: 14px 15px;';
                  }
                  return '';
                }() +'">'
                  ,elemCell.html()
                ,'</div>'
                ,'<i class="layui-icon layui-table-tips-c">&#x1006;</i>'
              ].join(''), elemCell[0], {
                tips: [3, '']
                ,time: -1
                ,anim: -1
                ,maxWidth: (device.ios || device.android) ? 300 : 600
                ,isOutAnim: false
                ,skin: 'layui-table-tips'
                ,success: function(layero, index){
                  layero.find('.layui-table-tips-c').on('click', function(){
                    layer.close(index);
                  });
                }
              });
            }*/
        });

        //工具条操作事件
        that.layBody.on('click', '*[lay-event]', function() {
            var othis = $(this),
                index = othis.parents('tr').eq(0).data('index'),
                tr = that.layBody.find('tr[data-index="' + index + '"]'),
                ELEM_CLICK = 'layui-table-click',
                data = table.cache[that.key][index];

            layui.event.call(this, MOD_NAME, 'tool(' + filter + ')', {
                data: table.clearCacheKey(data),
                event: othis.attr('lay-event'),
                tr: tr,
                del: function() {
                    table.cache[that.key][index] = [];
                    tr.remove();
                    that.scrollPatch();
                },
                update: function(fields) {
                    fields = fields || {};
                    layui.each(fields, function(key, value) {
                        if (key in data) {
                            var templet, td = tr.children('td[data-field="' + key + '"]');
                            data[key] = value;
                            that.eachCols(function(i, item2) {
                                if (item2.field == key && item2.templet) {
                                    templet = item2.templet;
                                }
                            });
                            td.children(ELEM_CELL).html(
                                templet ? laytpl($(templet).html() || value).render(data) : value
                            );
                            td.data('content', value);
                        }
                    });
                },
                updateLine: function(fields) { //新增方法,由于null在响应的时候被json忽律
                    fields = fields || {};
                    layui.each(fields, function(key, value) {
                        // if (key in data) {
                        var templet, td = tr.children('td[data-field="' + key + '"]');
                        data[key] = value;
                        that.eachCols(function(i, item2) {
                            if (item2.field == key && item2.templet) {
                                templet = item2.templet;
                            }
                        });
                        td.children(ELEM_CELL).html(
                            templet ? laytpl($(templet).html() || value).render(data) : value
                        );
                        td.data('content', value);
                        // }
                    });
                }
            });
            tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
        });

        //同步滚动条
        that.layMain.on('scroll', function() {
            var othis = $(this),
                scrollLeft = othis.scrollLeft(),
                scrollTop = othis.scrollTop();

            that.layHeader.scrollLeft(scrollLeft);
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);

            layer.close(that.tipsIndex);
        });

        _WIN.on('resize', function() { //自适应
            that.fullSize();
            that.scrollPatch();
        });
    };

    //初始化
    table.init = function(filter, settings) {
        settings = settings || {};
        var that = this,
            elemTable = filter ? $('table[lay-filter="' + filter + '"]') : $(ELEM + '[lay-data]'),
            errorTips = 'Table element property lay-data configuration item has a syntax error: ';

        //遍历数据表格
        elemTable.each(function() {
            var othis = $(this),
                tableData = othis.attr('lay-data');

            try {
                tableData = new Function('return ' + tableData)();
            } catch (e) {
                hint.error(errorTips + tableData)
            }

            var cols = [],
                options = $.extend({
                    elem: this,
                    cols: [],
                    data: [],
                    skin: othis.attr('lay-skin') //风格
                    ,
                    size: othis.attr('lay-size') //尺寸
                    ,
                    even: typeof othis.attr('lay-even') === 'string' //偶数行背景
                }, table.config, settings, tableData);

            filter && othis.hide();

            //获取表头数据
            othis.find('thead>tr').each(function(i) {
                options.cols[i] = [];
                $(this).children().each(function(ii) {
                    var th = $(this),
                        itemData = th.attr('lay-data');

                    try {
                        itemData = new Function('return ' + itemData)();
                    } catch (e) {
                        return hint.error(errorTips + itemData)
                    }

                    var row = $.extend({
                        title: th.text(),
                        colspan: th.attr('colspan') || 0 //列单元格
                        ,
                        rowspan: th.attr('rowspan') || 0 //行单元格
                    }, itemData);

                    if (row.colspan < 2) cols.push(row);
                    options.cols[i].push(row);
                });
            });

            //获取表体数据
            othis.find('tbody>tr').each(function(i1) {
                var tr = $(this),
                    row = {};
                //如果定义了字段名
                tr.children('td').each(function(i2, item2) {
                    var td = $(this),
                        field = td.data('field');
                    if (field) {
                        return row[field] = td.html();
                    }
                });
                //如果未定义字段名
                layui.each(cols, function(i3, item3) {
                    var td = tr.children('td').eq(i3);
                    row[item3.field] = td.html();
                });
                options.data[i1] = row;
            });
            table.render(options);
        });

        return that;
    };

    //表格选中状态
    table.checkStatus = function(id, thattable) {
        var nums = 0,
            invalidNum = 0,
            arr = [],
            data = table.cache[id] || [];
        if (thattable) {
            var cols = thattable.config.cols[0];
            var mergelength = $('#' + thattable.config.id).siblings('.layui-table-view').find('td[data-field="checkboxcol"]').length;
        }
        //计算全选个数
        layui.each(data, function(i, item) {
            if (item.constructor === Array) {
                invalidNum++; //无效数据，或已删除的
                return;
            }
            if (item[table.config.checkName]) {
                nums++;
                arr.push(table.clearCacheKey(item));
            }
        });
        // 解决tablemerge的表格全选bug
        if (cols && cols[0].merge) {
            var actnums = mergelength - invalidNum;
        } else {
            var actnums = (data.length - invalidNum);
        }
        return {
            data: arr //选中的数据
            ,
            isAll: data.length ? (nums === actnums) : false //是否全选
        };
    };

    // 表格导出
    table.exportFile = function(id, data, options){
        data = data || table.clearCacheKey(table.cache[id]);
        options = typeof options === 'object' ? options : function(){
            var obj = {};
            options && (obj.type = options);
            return obj;
        }();

        var type = options.type || 'csv';
        var thatTable = thisTable.that[id];
        var config = thisTable.config[id] || {};
        var textType = ({
            csv: 'text/csv'
            ,xls: 'application/vnd.ms-excel'
        })[type];
        var alink = document.createElement("a");

        if(device.ie) return hint.error('IE_NOT_SUPPORT_EXPORTS');

        alink.href = 'data:'+ textType +';charset=utf-8,\ufeff'+ encodeURIComponent(function(){
            var dataTitle = []
                ,dataMain = []
                ,dataTotal = []
                ,fieldsIsHide = {};

            //表头和表体
            layui.each(data, function(i1, item1){
                var vals = [];
                if(typeof id === 'object'){ //如果 id 参数直接为表头数据
                    layui.each(id, function(i, item){
                        i1 == 0 && dataTitle.push(item || '');
                    });
                    layui.each(table.clearCacheKey(item1), function(i2, item2){
                        vals.push('"'+ (item2 || '') +'"');
                    });
                } else {
                    table.eachCols(id, function(i3, item3){
                        if(item3.field && item3.type == 'normal'){
                            //不导出隐藏列
                            if(item3.hide){
                                if(i1 == 0) fieldsIsHide[item3.field] = true; //记录隐藏列
                                return;
                            }

                            var content = item1[item3.field],
                                td = thatTable.layBody.find('tr[data-index="'+ i1 +'"]>td');

                            if(content === undefined || content === null) content = '';

                            i1 == 0 && dataTitle.push(item3.title || '');
                                // function() {
                                //     return typeof item3.templet === 'function' ?
                                //         item3.templet(tplData) :
                                //         laytpl($(item3.templet).html() || String(content)).render(tplData)
                                // }()
                            vals.push('"'+ parseTempData.call(thatTable, {
                                item3: item3
                                ,content: content
                                ,tplData: item1
                                ,text: 'text'
                                ,obj: {
                                    td: function(field){
                                        return td.filter('[data-field="'+ field +'"]');
                                    }
                                }
                            }) + '"');
                        }
                    });
                }
                dataMain.push(vals.join(','));
            });

            //表合计
            thatTable && layui.each(thatTable.dataTotal, function(key, value){
                // FBA产品管理
                if(key == 'acoas' || key == 'collection'){
                    let _value = $("#" + id).next().find(".layui-table-total td[data-field="+ key +"]>div").text()
                    fieldsIsHide[key] || dataTotal.push(_value)
                }else{
                    fieldsIsHide[key] || dataTotal.push(value);
                }
            });

            return dataTitle.join(',') + '\r\n' + dataMain.join('\r\n') + '\r\n' + dataTotal.join(',');
        }());

        // alink.download = (options.title || config.title || 'table_'+ (config.index || '')) + '.' + type;
        alink.download = type;
        document.body.appendChild(alink);
        alink.click();
        document.body.removeChild(alink);
    };

    //表格重载
    thisTable.config = {};

    //记录所有实例
    thisTable.that = {}; //记录所有实例对象

    var eachChildCols = function (index, cols, i1, item2) {
        //如果是组合列，则捕获对应的子列
        if (item2.colGroup) {
            var childIndex = 0;
            index++;
            item2.CHILD_COLS = [];
            // 找到它的子列所在cols的下标
            var i2 = i1 + (parseInt(item2.rowspan) || 1);
            layui.each(cols[i2], function (i22, item22) {
                //如果子列已经被标注为{PARENT_COL_INDEX}，或者子列累计 colspan 数等于父列定义的 colspan，则跳出当前子列循环
                if (item22.PARENT_COL_INDEX || (childIndex >= 1 && childIndex == (item2.colspan || 1))) return;
                item22.PARENT_COL_INDEX = index;

                item2.CHILD_COLS.push(item22);
                childIndex = childIndex + (item22.hide ? 0 : parseInt(item22.colspan > 1 ? item22.colspan : 1));
                eachChildCols(index, cols, i2, item22);
            });
        }
    };

    // 遍历表头
    table.eachCols = function(id, callback, cols){
        var config = thisTable.config[id] || {}
            ,arrs = [], index = 0;

        cols = $.extend(true, [], cols || config.cols);

        //重新整理表头结构
        layui.each(cols, function(i1, item1){
            if (i1) return true; // 只需遍历第一层
            layui.each(item1, function(i2, item2){
                eachChildCols(index, cols, i1, item2);
                if(item2.PARENT_COL_INDEX) return; //如果是子列，则不进行追加，因为已经存储在父列中
                arrs.push(item2)
            });
        });

        //重新遍历列，如果有子列，则进入递归
        var eachArrs = function(obj){
            layui.each(obj || arrs, function(i, item){
                if(item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
                typeof callback === 'function' && callback(i, item);
            });
        };

        eachArrs();
    };

    table.reload = function(id, options) {
        var config = thisTable.config[id];
        options = options || {};
        config.where = options.where ? options.where : config.where;
        if (!config) return hint.error('The ID option was not found in the table instance');
        if (options.data && options.data.constructor === Array) delete config.data;
        return table.render($.extend(true, {}, config, options));
    };

    //核心入口
    table.render = function(options) {
        var inst = new Class(options);
        return thisTable.call(inst);
    };

    //清除临时Key
    table.clearCacheKey = function(data) {
        data = $.extend({}, data);
        delete data[table.config.checkName];
        delete data[table.config.indexName];
        return data;
    };

    //自动完成渲染
    table.init();
    // 获得某个节点的位置 offsetTop: 是否获得相对top window的位移
    function getPosition(elem, _window, offsetTop) {
        _window = _window || window;
        elem = elem.length ? elem.get(0) : elem;
        var offsetTemp = {};
        if (offsetTop && _window.top !== _window.self) {
            var frameElem = _window.frames.frameElement;
            offsetTemp = getPosition(frameElem, _window.parent, offsetTop);
        }
        var offset = elem.getBoundingClientRect();

        return {
            top: offset.top + (offsetTemp.top || 0),
            left: offset.left + (offsetTemp.left || 0)
        };
    }
    // 字段过滤的相关功能
    var addFieldFilter = function() {
        var that = this;
        var tableId = that.key;
        var tableView = that.elem;

        that.eachCols(function(index, item) {
            if (item.type === 'normal') {
                var field = item.field;
                if (!field) {
                    return;
                }
                var thElem = tableView.find('th[data-field="' + field + '"]');
                if (!item.filter) {
                    thElem.find('.layui-table-filter').remove();
                } else {
                    if (!thElem.find('.layui-table-filter').length) {
                        $(LayuiTableColFilter.join('')).insertAfter(thElem.find('.layui-table-cell>span:not(.layui-inline)')).click(function(event) {
                            layui.stope(event);
                            var filterActive = tableView.find('.layui-table-filter.layui-active');
                            if (filterActive.length && filterActive[0] !== this) {
                                // 目前只支持单列过滤，多列过滤会存在一些难题，不好统一，干脆只支持单列过滤
                                filterActive.removeClass('layui-active');
                                that.layBody.find('tr.' + HIDE).removeClass(HIDE);
                            }
                            var mainElem = tableView.find('.layui-table-main');
                            var nodes = [];
                            layui.each(mainElem.find('td[data-field="' + field + '"]'), function(index, elem) {
                                elem = $(elem);
                                var textTemp = elem.text();
                                if (nodes.indexOf(textTemp) === -1) {
                                    nodes.push(textTemp);
                                }
                            });
                            var layerWidth = 200;
                            var layerHeight = 300;
                            var btnElem = $(this);
                            var btnPosition = getPosition(btnElem.find('.layui-tablePlug-icon-filter'));
                            var topTemp = btnPosition.top;
                            var leftTemp = btnPosition.left + btnElem.width();
                            if (leftTemp + layerWidth > $(document).width()) {
                                leftTemp -= (layerWidth + btnElem.width());
                            }
                            let filterLayerIndex = layer.open({
                                content: '',
                                title: null,
                                type: 1,
                                // area: [layerWidth + 'px', layerHeight + 'px'],
                                area: layerWidth + 'px',
                                shade: 0.1,
                                closeBtn: 0,
                                fixed: false,
                                resize: false,
                                shadeClose: true,
                                offset: [topTemp + 'px', leftTemp + 'px'],
                                isOutAnim: false,
                                maxmin: false,
                                success: function(layero, index) {
                                    layero.find('.layui-layer-content').html('<table id="layui-tablePlug-col-filter" lay-filter="layui-tablePlug-col-filter"></table>');
                                    table.render({
                                        elem: '#layui-tablePlug-col-filter',
                                        data: nodes.map(function(value, index1, array) {
                                            var nodeTemp = {
                                                name: value
                                            };
                                            nodeTemp[table.config.checkName] = !that.layBody.find('tr.' + HIDE).filter(function(index, item) {
                                                return $(item).find('td[data-field="' + field + '"]').text() === value;
                                            }).length;
                                            return nodeTemp;
                                        }),
                                        page: false,
                                        skin: 'nob',
                                        // id: 'layui-tablePlug-col-filter-layer',
                                        even: false,
                                        height: nodes.length > 8 ? layerHeight : null,
                                        size: 'sm',
                                        style: 'margin: 0;',
                                        limit: nodes.length,
                                        cols: [
                                            [
                                                { type: 'checkbox', width: 40 },
                                                {
                                                    field: 'name',
                                                    title: '全选<span class="table-filter-opt-invert" onclick="layui.tablePlug && layui.tablePlug.tableFilterInvert(this);">反选</span>'
                                                }
                                            ]
                                        ]
                                    })
                                },
                                end: function() {
                                    btnElem[that.layBody.find('tr.' + HIDE).length ? 'addClass' : 'removeClass']('layui-active');
                                }
                            });

                            // 监听字段过滤的列选择的
                            table.on('checkbox(layui-tablePlug-col-filter)', function(obj) {
                                if (obj.type === 'all') {
                                    that.layBody.find('tr')[obj.checked ? 'removeClass' : 'addClass'](HIDE);
                                } else {
                                    layui.each(that.layBody.first().find('tr td[data-field="' + field + '"]'), function(index, elem) {
                                        elem = $(elem);
                                        if (elem.text() === obj.data.name) {
                                            var trElem = elem.parent();
                                            that.layBody.find('tr[data-index="' + trElem.data('index') + '"]')[obj.checked ? 'removeClass' : 'addClass'](HIDE);
                                        }
                                    });
                                }
                                // that.resize();
                            });

                        });
                    } else {
                        // thElem.find('.layui-table-filter')[that.layBody.find('tr.' + HIDE).length ? 'addClass' : 'removeClass']('layui-active');
                        thElem.find('.layui-table-filter').removeClass('layui-active');
                    }
                }
            }
        }, that.config.cols);
    };


    exports(MOD_NAME, table);
});