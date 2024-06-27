//已生成的详情框
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;

    var ids = [];
    var idsStr = $("#wish_copyListing_ids_hidden").val();
    if (idsStr) {
        ids = idsStr.split(",");
    }

    if (ids.length < 1) {
        layer.closeAll();
        layer.msg("必须先选中商品");
        return;
    }
    $.ajax({
        type: 'post',
        url: ctx + '/onlineProductWish/listSelectAllSkuInfo.html',
        dataType: 'json',
        traditional: true,
        data: {
            ids: ids
        },
        success: function (returnSkuData) {
            if (returnSkuData.code == "0000") {
                var skuInfoStr = "";
                $(returnSkuData.data).each(function () {
                    skuInfoStr += "店铺父SKU:" + this.pSku + "(商品父SKU:" + this.prodPSku + ")<br>";
                });
                $("#wishOnline_skusInfo").append(skuInfoStr);
            }else {
                layer.alert(returnSkuData.msg, {icon: 2});
            }
        }
    });
    $.ajax({
        type: 'post',
        url: ctx + '/sys/liststore.html',
        dataType: 'json',
        data: {
            roleNames: "wish专员",
            platCode: "wish"
        },
        traditional: true,
        success: function (returnData) {
            if (returnData.code == "0000") {
                $(returnData.data).each(function () {
                    // console.log(this);
                    $("#wishOnline_copyStore").append("<option value='" + this.id + "'>" + this.storeAcct + "</option>");
                });
                layui.formSelects.render('copyStore_wishPublish');

            }else {
                layer.alert(returnData.msg, {icon: 2});
            }
        }

    });

});

function wishOnline_copyListing() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var copyStore = layui.formSelects.value("copyStore_wishOnline");
    var copyStoreList = [];
    for (var j = 0; j < copyStore.length; j++) {
        copyStoreList.push(copyStore[j].val);
    }
    if (copyStoreList.length < 1) {
        layer.msg("至少选一个店铺");
        return;
    }

    var ids = [];
    var idsStr = $("#wish_copyListing_ids_hidden").val();
    if (idsStr) {
        ids = idsStr.split(",");
    }

    if (ids.length < 1) {
        layer.closeAll();
        layer.msg("必须先选中商品");
        return;
    }

    var detailData = {};
    detailData.copySyncPIds = ids;
    detailData.copy2StoreIds = copyStoreList;
    $.ajax({
        type: 'post',
        url: ctx + '/wishlisting/copyOnlineListing.html',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(detailData),
        success: function (returnData) {
            if (returnData.code == "0000") {
                layer.closeAll();
                layer.msg("复制成功");
            } else {
                console.log(returnData.code);
                layer.alert(returnData.msg, {icon: 2});
            }
        }
    });
}