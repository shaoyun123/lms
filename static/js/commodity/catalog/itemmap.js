/**
 * 类目映射的js
 * 1:我们的商品类目来源于速卖通的类目
 * 2：处理我们的类目与shoppe各个站点之间类目id的映射关系
 */
layui.use(['admin', 'form', 'table'], function() {
    var $ = layui.$,
        layer = layui.layer,
        table = layui.table,
        admin = layui.admin,
        form = layui.form;
    //选择分类弹框
    $('#itemMapSelectSort').find('button').click(function() {
        admin.itemCat_select('layer-commodity-catalog-itemmap', 'itemmap_choosed_cate_id_input', 'choosedCateShow')
    })
    form.render('radio');
    form.render('select');

    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#cateMappingTable",
        method: 'post',
        url: ctx + "/prodcate/getCateMappingPage.html",
        cols: [
            [
                {type: 'checkbox', width:30},
                { field: "smtCateName", title: "SMT类目", templet: '#smtCateNameTpl' },
                //{ field: "amazonCateName", title: "Amazon类目" },
                { field: "smtCateId", title: "OA类目id"},
                // { field: "cnscCateId", title: "shopee_cnsc", templet: '#shopeecnscTpl' },
                // { field: "myCateId", title: "shopee_my", templet: '#shopeemyTpl' },
                // { field: "thCateId", title: "shopee_th", templet: '#shopeethTpl' },
                // { field: "idCateId", title: "shopee_id", templet: '#shopeeidTpl' },
                // { field: "sgCateId", title: "shopee_sg", templet: '#shopeesgTpl' },
                // { field: "twCateId", title: "shopee_tw", templet: '#shopeetwTpl' },
                // { field: "phCateId", title: "shopee_ph", templet: '#shopeephTpl' },
                // { field: "vnCateId", title: "shopee_vn", templet: '#shopeevnTpl' },
                // { field: "brCateId", title: "shopee_br", templet: '#shopeebrTpl' },
                // { field: "mxCateId", title: "shopee_mx", templet: '#shopeemxTpl' },
                // { field: "coCateId", title: "shopee_co", templet: '#shopeecoTpl' },
                // { field: "clCateId", title: "shopee_cl", templet: '#shopeeclTpl' },
                // { field: "plCateId", title: "shopee_pl", templet: '#shopeeplTpl' },
                // { field: "esCateId", title: "shopee_es", templet: '#shopeeesTpl' },
                // { field: "frCateId", title: "shopee_fr", templet: '#shopeefrTpl' },
                { field: "fyndiqCateId", title: "fyndiq类目", templet: '#fyndiqCateIdTpl'},
                // { field: "allrootCateId", title: "普源映射类目",templet:'#im_allRootCateTpl' },
                {title: '操作',align: 'center', toolbar: '#im_Bar',width: '10%'}
                /*{title: '操作', width: 300, align: 'center', toolbar: '#customsBar'}*/
            ]
        ],
        page: true,
        id: "cateMappingTable",
        limits: [100, 500, 1000],
        limit: 100
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(cateMappingTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;
        if (layEvent === 'edit') { //编辑对应的普源id
            var objTd = $(obj.tr[0]).find('td');
            var dataObj={};
            dataObj.smtCateId= data.smtCateId;
            // dataObj.myCateId = $.trim(objTd.eq(2).find('input').val());
            // dataObj.thCateId = $.trim(objTd.eq(3).find('input').val());
            // dataObj.idCateId = $.trim(objTd.eq(4).find('input').val());
            // dataObj.sgCateId = $.trim(objTd.eq(5).find('input').val());
            // dataObj.twCateId = $.trim(objTd.eq(6).find('input').val());
            // dataObj.phCateId = $.trim(objTd.eq(7).find('input').val());
            // dataObj.vnCateId = $.trim(objTd.eq(8).find('input').val());
            // dataObj.brCateId = $.trim(objTd.eq(9).find('input').val());
            // dataObj.mxCateId = $.trim(objTd.eq(10).find('input').val());
            // dataObj.coCateId = $.trim(objTd.eq(11).find('input').val());
            // dataObj.clCateId = $.trim(objTd.eq(12).find('input').val());
            // dataObj.plCateId = $.trim(objTd.eq(13).find('input').val());
            // dataObj.esCateId = $.trim(objTd.eq(14).find('input').val());
            // dataObj.frCateId = $.trim(objTd.eq(15).find('input').val());
            // dataObj.cnscCateId = $.trim(objTd.eq(3).find('input').val());
            dataObj.name="fyndiq类目"
            dataObj.fyndiqCateId = $.trim(objTd.eq(3).find('input').val());
            // dataObj.allrootCateId = $.trim(objTd.eq(5).find('input').val());
            $.ajax({
                type: "POST",
                url: ctx + "/prodcate/saveAllrootCateMapping.html",
                data: dataObj,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("保存成功",{icon:1});
                    } else {
                        layer.msg(returnData.msg,{icon:5});
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                }
            });
        }else if (layEvent === 'updateFyndiq') {
            var objTd = $(obj.tr[0]).find('td');
            commonReturnPromise({
                url: '/lms/prodcate/updateFyndiqCategoryByCateId',
                type: 'post',
                params: {fyndiqCateId: $.trim(objTd.eq(16).find('input').val())}
            }).then(res => {
                layer.msg(res || '操作成功！')
            })
        }
    });

    //CheckBox监听事件
    form.on('radio(im_radio)', function(data) {
        $("#mappingSearchForm input[name='checkedCateId']").val('');
        $('#choosedCateShow').html('');
        if (data.value === 'fyndiqItemMap') {
            $('#itemMapSearchType').removeClass('disN');
            $('#itemMapSelectSort').addClass('disN');
            $('#itemMapShopeeType').addClass('disN');
            $('#itemmapCard_header').addClass('disN');
        } else if(data.value=="smtItemMap"){
            $('#itemMapSearchType').addClass('disN');
            $('#itemMapSelectSort').removeClass('disN');
            $('#itemMapShopeeType').addClass('disN');
            $('#itemmapCard_header').addClass('disN');
        // }else{
        //     $('#itemMapSearchType').addClass('disN');
        //     $('#itemMapSelectSort').addClass('disN');
        //     $('#itemMapShopeeType').removeClass('disN');
        //     $('#itemmapCard_header').removeClass('disN');
        }
    })

    var active = {
        reload: function() {
            var smtCateId = '';
            var amazonCateId = '';
            var shopeeSearchId = '';
            var fyndiqCateId = '';
            var checkedPlat = $("#mappingSearchForm input[name='platCate']:checked").val();
            var shopeeSearchSite = $("#mappingSearchForm select[name='shopeeSearchSite']").val();
            var checkedCateId = $("#mappingSearchForm input[name='checkedCateId']").val();
            if (checkedPlat == 'smtItemMap') {
                smtCateId = checkedCateId;
            } else if (checkedPlat == 'amazonItemMap') {
                amazonCateId = checkedCateId;
            } else if (checkedPlat == 'shopeeItemMap') {
                shopeeSearchId = $("#mappingSearchForm input[name='shopeeSearchId']").val().replaceAll('，',',');
            }else if (checkedPlat == 'fyndiqItemMap') {
                fyndiqCateId = $("#mappingSearchForm input[name='fyndiqCateId']").val();
            }
            //执行重载
            table.reload('cateMappingTable', {
                page: { curr: 1 },
                where: {
                    smtCateId: smtCateId,
                    amazonCateId: amazonCateId,
                    shopeeSearchId: shopeeSearchId,
                    shopeeSearchSite: shopeeSearchSite,
                    fyndiqCateId: fyndiqCateId,
                }
            });
        }
    };
    /**
     * 搜索
     */
    $("#cateMappingSearchBtn").click(function() {
        active.reload.call(this);
    });
    /**
     * 从老OA同步分类映射
     */
    $("#syncShopeeMapping").click(function() {
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + "/prodcate/syncMapping.html",
            success: function(returnData) {
                loading.hide();
                if(returnData.code='0000'){
                    layer.msg("同步完成",{icon:1});
                }else{
                    layer.msg("同步失败"+returnData.msg,{icon:5});
                }
            }
        })
    });

    /**
     * 清空
     */
    $("#cateMappingResetBtn").click(function() {
        $('#choosedCateShow').html('');
        $("#itemmap_choosed_cate_id_input").val('');
        $("input[name=platCate]").eq(0).next().trigger("click")
        form.render();
    });

    //ztt-改
    $('#setShopeeSpecialBtn').on('click', function(){
        // cateMappingTable
        commonTableCksSelected('cateMappingTable').then(function(result){
            var idsArr = result.map(function(item){
                return item.id;
            });
            shopeeSpecialHandle('设置shopee特货', idsArr, true);
        }).catch(function(err){
            layer.msg(err,{icon:2});
        })

    });

    $('#cancelShopeeSpecialBtn').on('click', function(){
        commonTableCksSelected('cateMappingTable').then(function(result){
            var idsArr = result.map(function(item){
                return item.id;
            });
            shopeeSpecialHandle('取消shopee特货', idsArr, false);
        }).catch(function(err){
            layer.msg(err,{icon:2});
        })
    })
    //ztt-改-统一弹框
    function shopeeSpecialHandle(title,idsArr, isSet){
        layer.open({
            type:1,
            title: title,
            area: ['600px', '400px'],
            btn: ['确定', '取消'],
            content: $('#shopeeSpecialLayer').html(),
            id: 'shopeeSpecialLayerId',
            success:function(layero, index){
                form.render('select');
            },
            yes: function(index,layero){
                var obj = {};
                obj.ids = idsArr.join(); //id值字符串集合
                obj.shopeeSearchSite = layero.find('[name=shopeeSite]').val();
                obj.ifSpecial = isSet; //是否特货
                commonReturnPromise({
                    url: '/lms/prodcate/setCateIfSpecial.html',
                    dataType: "json",
                    type: 'post',
                    params: obj
                }).then(function(result){
                    layer.msg('设置成功',{icon:1});
                    layer.close(index);
                    $('#cateMappingSearchBtn').trigger('click');
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            }
        })
    }
});