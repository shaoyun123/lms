; (function ($, layui, window, document, undefined) {
    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            table = layui.table,
            formSelects = layui.formSelects,
            element = layui.element,
            upload = layui.upload,
            laydate = layui.laydate,
            laypage = layui.laypage,
            laytpl = layui.laytpl
        $ = layui.$

        // shop_arr: shopeeOnline页面选中的数据
        delBundleDealName = {
            init: function () {
                let idArr = shop_arr.filter(item => item.ifBundleDeal).map(item => item.itemId)
                $('#shop_delBundleDeal_itemIds').val(idArr.join())
                this.itemIdtotal(idArr.length)
            },
            // 对输入失焦后，多个用逗号隔离的数据进行处理和记总数
            blurhandleItemIds: function () {
                var _this = this
                $('#shop_delBundleDeal_itemIds').blur(function () {
                    let curList = _this.dealInputData()
                    $(this).val(curList.join())
                    _this.itemIdtotal(curList.length) //记总数
                })
            },
            // 对输入多个用逗号隔离的数据进行处理
            dealInputData: function () {
                var inputDom = $('#shop_delBundleDeal_itemIds')
                let _curList = inputDom.val().replace(/，/g, ',').replace(/\s+/g, "");//中文逗号转为英文逗号，空格全部删掉
                let curList = _curList.split(',')
                    .filter(item => !!item && Number(item))  //去掉空字符串和非数字的
                    .map(item => Number(item))  //转为int
                return curList
            },
            // 记总数
            itemIdtotal: function (total) {
                $("#shop_delBundleDeal_total").text(total)
            },
            // 监听批量移除按钮
            batchOnline: function () {
                var _this = this
                $('#shop_delBundleDeal_batch_del').click(function () {
                    layer.confirm('确认批量删除?', { icon: 3, title: '提示' }, lms_debounce(function (index) {
                        let curList = _this.dealInputData()
                        $(this).val(curList.join())
                        _this.itemIdtotal(curList.length) //记总数
                        _this.batchOnlineAjax(curList)
                            .then(() => {
                                layer.alert('已提交后台处理，请关闭窗口', { icon: 1, skin: 'layer-ext-demo' })
                            })
                    }, 3000, true));
                })
            },
            batchOnlineAjax: function (arr) {
                return commonReturnPromise({
                    url: ctx + '/shopee/shopeeIsEnableProduct/removeBundleDealByItemIdList',
                    params: JSON.stringify(arr),
                    contentType: 'application/json',
                    type: 'post'
                })
            }
        }
        // 初始化
        delBundleDealName.init()
        // 对输入多个用逗号隔离的数据进行处理和记总数                                                    
        delBundleDealName.blurhandleItemIds()
        // 监听批量上架按钮
        delBundleDealName.batchOnline()

    });

})(jQuery, layui, window, document);