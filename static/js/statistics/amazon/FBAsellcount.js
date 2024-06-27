layui.use(['form', 'table', 'laydate', 'formSelects'], function() {
    var $ = layui.$,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render()
    formSelects = layui.formSelects,
        render_hp_orgs_users("#FBAsellstatics_form"); //渲染部门销售员店铺三级联动
    var FBAsellcount_global_siteEnum;
    getInitFBAAmazonSite(true)
        //获取站点
    function getInitFBAAmazonSite(isFirst) {
        if (FBAsellcount_global_siteEnum == null || FBAsellcount_global_siteEnum == undefined) {
            //赋值
            initAjaxSync('/enum/getSiteEnum.html?platCode=amazon', 'POST', {}, function(returnData) {
                var data = returnData.data;

                var map_FBAdelivery_global_siteEnum = new Map();
                for (var i in data) {
                    map_FBAdelivery_global_siteEnum.set(data[i].code, data[i].name)
                }
                FBAsellcount_global_siteEnum = map_FBAdelivery_global_siteEnum;
            })
        }
        if (isFirst) {
            var canSelSiteList = [];
            FBAsellcount_global_siteEnum.forEach(function(value, key) {
                var obj = {};
                obj.site = key;
                obj.siteName = value;
                canSelSiteList.push(obj);
            });
            appendSelect('FBAsellstatics_form', 'FBAsellcount_amazonSite', canSelSiteList, 'site', 'siteName');
            form.render('select');
        }
        return FBAsellcount_global_siteEnum;
    }

    function initAjaxSync(url, method, data, func, contentType, isLoad) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: false,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
            }
        })
    }

    //监听店铺下拉选择
    form.on('select(FBAsellcount_store)', function(data) {
        var storeTmp = data.value;
        var sites = data.elem[data.elem.selectedIndex].dataset.sites;
        FBAsellcount_global_siteEnum = getInitFBAAmazonSite();
        var canSelSiteList = [];
        if (storeTmp) { //选择了店铺
            if (!$.isEmptyObject(sites)) {
                var siteList = sites.split(",");
                for (var i = 0; i < siteList.length; i++) {
                    var obj = {};
                    obj.site = siteList[i];
                    obj.siteName = FBAsellcount_global_siteEnum.get(siteList[i]);
                    canSelSiteList.push(obj);
                }
            }
        } else {
            FBAsellcount_global_siteEnum.forEach(function(value, key) {
                var obj = {};
                obj.site = key;
                obj.siteName = value;
                canSelSiteList.push(obj);
            });
        }
        appendSelect('FBAsellstatics_form', 'FBAsellcount_amazonSite', canSelSiteList, 'site', 'siteName');
        form.render('select');
    });

    //填充下拉框
    function appendSelect(pre, dom, data, id, name) {
        $('#' + pre + ' #' + dom + '').empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].name || data[i][name];
            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        $('#' + pre + ' #' + dom + '').append(option)
    }

    //日期范围
    laydate.render({
        elem: '#FBAsellcount_counttime',
        type: 'date',
        range: true
    });

    var nowdate = new Date()
    var endDate = Format(new Date(), 'yyyy-MM-dd')
    var oneweekdate = Format(new Date(nowdate - 7 * 24 * 3600 * 1000), 'yyyy-MM-dd')
    $('#FBAsellcount_counttime').val(oneweekdate + ' - ' + endDate)
    setTimeout(function() {
        $('#FBAsellcount_submit').click()
    }, 0)


    form.on('submit(FBAsellcount_submit)', function(obj) {
        var data = obj.field
        dateArr = (data.time || "").split(' - ')
        if (dateArr.length > 1) {
            data.startDate = dateArr[0]
            data.endDate = dateArr[1]
        } else {
            layer.msg("请选择日期")
            return false
        }

        getSellcountTable(data)
    })



    function getSellcountTable(data) {
        var cols = [ //表头
            { field: 'storeAcct', title: '店铺', width: 80, fixed: 'left' },
            {
                field: 'saleSite',
                title: '销售员',
                templet: '#FBAsellcountsalSiteandsalesman_tpl',
                width: 100,
                fixed: 'left'
            },
            { field: 'image', title: '图片', width: 80, templet: '#FBAsellcountimg_tpl', fixed: 'left' },
            { field: 'parentAsin', title: 'ParentASIN', width: 100, templet: '#FBAsellcountparent_tpl', fixed: 'left' },
            { field: 'asin', title: 'ASIN', width: 100, templet: '#FBAsellcountasin_tpl', fixed: 'left' },
            { field: 'sellerSku', title: 'MSKU', width: 100, templet: "#FBAsellcountseller_tpl", fixed: 'left' },
            { field: 'prodSSku', title: '商品SKU', width: 80, fixed: 'left' },
            { field: 'saleRankDiff', title: '排名', width: 120, fixed: 'left', templet: '#FBAsellcountdiff_tpl' },
            { field: 'currentRowSum', title: '小计', width: 80, fixed: 'left', sort: true }
        ]
        var dateArr = getAll(data.startDate, data.endDate).reverse()
        for (var i in dateArr) {
            cols.push({ title: dateArr[i], field: dateArr[i], templet: "", sort: true, width: 100 })
        }

        table.render({
            method: 'post',
            elem: '#FBAsellstatics_table',
            url: ctx + '/amazonFbaOrder/searchByCondition.html', // 数据接口
            totalRow: true,
            cols: [cols],
            where: data,
            page: true,
            sort: 'server',
            height: 'full-200', //高度最大化减去差值
            limits: [50, 100, 200], // 每页条数的选择项
            limit: 50, //默认显示50条
            created: function(res, count) {
                res.data.summary.storeAcct = '总计'
                res.data.summary.currentRowSum = res.data.summary.totalAmount
                res.data.list.push(res.data.summary)
                res.data = res.data.list
            },
            done: function(res, curr, count) {
                $('.FBAsellcountexpand').click(function() {
                    var isopen = $(this).attr('data-open')
                    if (isopen === 'close') {
                        $(this).siblings('.showsku').removeClass('hide')
                        $(this).text('收起')
                        $(this).attr('data-open', 'open')
                    } else {
                        $(this).siblings('.showsku').addClass('hide')
                        $(this).text('展开')
                        $(this).attr('data-open', 'close')
                    }
                })
                imageLazyloadInner('layui-table-fixed .layui-table-body');
                $('.layui-table-header').removeClass('toFixedContain')
            }
        });
    }

    //监听排序
    table.on('sort(FBAsellstatics_table)', function(obj) {
        obj.type = obj.type === 'asc' ? 1 : 0
        if (obj.field === 'currentRowSum') {
            $('#FBAsellstatics_form input[name="isSortByTotal"]').val(1)
            $('#FBAsellstatics_form input[name="sortType"]').val(obj.type)
            $('#FBAsellstatics_form input[name="sortDate"]').val(0)
        } else {
            $('#FBAsellstatics_form input[name="isSortByTotal"]').val(0)
            $('#FBAsellstatics_form input[name="sortDate"]').val(obj.field)
            $('#FBAsellstatics_form input[name="sortType"]').val(obj.type)
        }

        $('#FBAsellcount_submit').click()
            // }
    });

    Date.prototype.format = function() {　　　　　
        var s = '';　　　　　
        var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));　　　　　
        var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());　　　　　
        s += this.getFullYear() + '-'; // 获取年份。
        　　　　　
        s += mouth + "-"; // 获取月份。
        　　　　　
        s += day; // 获取日。
        　　　　　
        return (s); // 返回日期。
        　　
    };

    　　
    function getAll(begin, end) {　　　　
        var arr = [];　　　　
        var ab = begin.split("-");　　　　
        var ae = end.split("-");　　　　
        var db = new Date();　　　　
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);　　　　
        var de = new Date();　　　　
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);　　　　
        var unixDb = db.getTime() - 24 * 60 * 60 * 1000;　　　　
        var unixDe = de.getTime() - 24 * 60 * 60 * 1000;　　　　
        for (var k = unixDb; k <= unixDe;) {　　　　　　 //console.log((new Date(parseInt(k))).format());
            　　　　　　
            k = k + 24 * 60 * 60 * 1000;　　　　　　
            arr.push((new Date(parseInt(k))).format());　　　　
        }　　　　
        return arr;
    }
});