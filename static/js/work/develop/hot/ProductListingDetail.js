// 刊登状态
function listing(prodPId, platCode) {
    layer = layui.layer;
    layer.open({
        type: 1,
        title: '刊登状态',
        area: ['90%', '90%'],
        btn: ['关闭'],
        content: $('#gatherhot_listingStatus').html(),
        success: function (layero, index) {
            $('#gatherhot_listing_status_prodPId').val(prodPId);
            if (platCode) {
                gatherhotGetListingSatus(platCode);
                $("#gatherhot_listing_num_span_ebay").parents("li").removeClass("layui-this");
                $("#gatherhot_listing_num_span_aliexpress").parents("li").addClass("layui-this");
            } else {
                gatherhotGetListingSatus('ebay');
            }
        }
    })
}

function gatherhotGetListingSatus(platCode) {
    var ifHadAjax = $('#ifHadAjax_' + platCode).val();
    if (ifHadAjax == '1') {
        showPlatTree(platCode);
    } else {
        var data = {
            platCode: platCode,
            prodPId: $('#gatherhot_listing_status_prodPId').val()
        };
        loading.show();
        $.ajax({
            type: 'post',
            url: ctx + '/prodTpl/getListingStatus.html',
            dataType: 'json',
            data: data,
            success: function (returnData) {
                loading.hide();
                if (returnData.code == '0000') {
                    setPlatTree(platCode, returnData.data)
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                loading.hide();
            }
        })
    }
}

function showPlatTree(platCode) {
    $('.platTree').hide()
    $('#producttpl_Tree_' + platCode).show()
}
