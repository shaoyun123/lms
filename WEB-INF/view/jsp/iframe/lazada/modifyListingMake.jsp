<%--copy shopee在线商品和lazada修改子sku图片--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>修改品牌</title>
<style>
    #lazadamodifyListingMakeTabForm {
        display: flex;
        justify-content: space-between;
    }

    /*有用到，别删，新品牌下拉高度 ！！！*/
    .dimResultDiv {
        height: 500px;
        overflow: auto;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="lazadamodifyListingMakeTab">
                        <form class="layui-form" lay-filter="" id="lazadamodifyListingMakeTabForm">
                            <div><input type="hidden" name="storeAcctId"></div>
                            <div class="layui-inline">
                                <label class="layui-form-label">新品牌</label>
                                <div class="layui-input-inline dimSearchContent" style="width: 400px;">
                                    <%--<input type="hidden" name="newBrandId">--%>
                                    <div>
                                        <input name="" id="LMLMNewBrandId" type="text" class="layui-input"
                                               placeholder="渐进搜索" autocomplete="off">
                                    </div>
                                    <div class="dimResultDivNewBrand"></div>
                                </div>
                                <button type="button" id="LMLMSyncBrand"
                                        class="layui-btn layui-btn-normal layui-btn-sm">同步品牌
                                </button>
                                <button type="button" id="LMLMBatchModify"
                                        class="layui-btn layui-btn-normal layui-btn-sm">批量修改
                                </button>
                            </div>
                        </form>
                        <ul class="layui-tab-title">
                            <li class="layui-this">数量(<span id="lazadamodifyListingMakeTabCount"></span>)</li>
                        </ul>
                        <div id="">
                            <table class="layui-table" id="lazadamodifyListingMakeTable"
                                   lay-filter="lazadamodifyListingMakeTableLayFilter"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="LMLMResult">
    {{# if(d.result && d.result.indexOf("SUCCESS") >= 0){ }}
        <span style="color:#1E9FFF">{{d.result || ''}}</span>
    {{# } }}
    {{# if(d.result && d.result.indexOf("ERROR") >= 0){ }}
        <span style="color:red">{{d.result || ''}}</span>
    {{# } }}
</script>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            formSelects = layui.formSelects,
            $ = layui.$;
        form.render();

        // 远程搜索功能
        var dim_newBrandId = new DimSearch('#LMLMNewBrandId', 'newBrandId',
            {
                url: '/onlineProductLazada/queryBrandByName',
                type: 'get',
                query: 'name',
                label: 'nameEn',
                isIncludeData: true,
                name: '.dimResultDivNewBrand'
            });
        dim_newBrandId.init();

        // 获取选中行ID
        var idList = localStorage.getItem('itemIds');

        // 查询表格数据，渲染表格
        getDataMLMLqueryBrandByIdList(idList.split(",")).then(res => {
            $("#lazadamodifyListingMakeTabForm input[name=storeAcctId]").val(res[0].storeAcctId)
            tableRender(res)
            $("#lazadamodifyListingMakeTabCount").text(res.length)
        })

        function tableRender(res){
            table.render({
                elem: "#lazadamodifyListingMakeTable",
                cols: [
                    [
                        {type: "checkbox", width: 32},
                        {field: "storeAcct", title: "店铺"},
                        {field: "itemId", title: "item_id"},
                        {field: "brand", title: '原品牌'},
                        {field: "", title: '修改结果',templet: '#LMLMResult'}
                    ],
                ],
                id: "lazadamodifyListingMakeTable",
                data: res,
                limit: 10000,
            });
        }

        // 批量修改
        $("#LMLMBatchModify").click(function () {
            let checkStatus = table.checkStatus('lazadamodifyListingMakeTable');
            let tableData = layui.table["cache"]["lazadamodifyListingMakeTable"];
            let checkData = checkStatus.data, newData = $("#LMLMNewBrandId").val();
            if (checkData.length < 1) {
                layer.msg('请勾选要修改的数据')
                return false;
            }
            getDataMLMLBatchModifyStores(checkData.map((item) => {
                return Object.assign(item, {newBrand: newData})
            })).then(res => {
                // 根据返回数据，重新生成表格数据
                tableData.forEach((item,index) => {
                    if(res[item.id]){
                        tableData[index]["result"] = res[item.id]
                    }
                })
                // 重新渲染表格
                tableRender(tableData)
            })
        })

        // 同步品牌
        $("#LMLMSyncBrand").click(function () {
            getDataMLMLSync($("#lazadamodifyListingMakeTabForm input[name=storeAcctId]").val()).then(res=>{
                layer.msg(res)
            })
        })

        // 批量修改接口
        function getDataMLMLBatchModifyStores(obj) {
            return commonReturnPromise({
                url: ctx + `/onlineProductLazada/batchUpdateBrand`,
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify(obj)
            })
        }

        // 同步品牌接口
        function getDataMLMLSync(id) {
            return commonReturnPromise({
                url: ctx + `/onlineProductLazada/syncLazadaBrands/` + id,
                type: 'GET'
            })
        }

        // 查询表格
        function getDataMLMLqueryBrandByIdList(arr) {
            return commonReturnPromise({
                url: ctx + `/onlineProductLazada/queryBrandByIdList`,
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify(arr)
            })
        }
    })
</script>