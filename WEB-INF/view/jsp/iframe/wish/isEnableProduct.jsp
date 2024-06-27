<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>wish子商品上下架</title>
<style>
    #LAY_adjustPriceProcess .layui-form-label {
        padding: 9px 5px;
    }

    #LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
        margin-right: 0;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .w_100 {
        width: 100px;
    }

    #LAY_adjustPriceProcess .layui-form {
        margin: 0 10px;
    }

    #LAY_adjustPriceProcess .layui-form-checkbox span {
        line-height: inherit;
    }

    #LAY_adjustPriceProcess .layui-form-checkbox {
        line-height: 30px !important;
    }

    .numCount {
        border: 1px solid #e8e8e8;
        border-bottom: none;
        display: inline-block;
        padding: 0 5px;
        text-align: center;
        line-height: 30px;
    }

    .mg_10 {
        margin: 0 10px;
    }

    #LAY_adjustPriceProcess .layui-input-block {
        margin-left: 70px !important;
    }

    #LAY_adjustPriceProcess .layui-form-label {
        width: 60px !important;
    }

    #LAY_adjustPriceProcess .layui-btn-sm {
        padding: 0 5px !important;
    }
</style>

<div class="layui-fluid" id="LAY_adjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <%--<div class="layui-col-lg2 layui-col-md2">--%>
                            <%--<label class="layui-form-label">商品SKU</label>--%>
                            <%--<div class="layui-input-block">--%>
                            <%--<input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">--%>
                            <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                            <%--<select id="wish_idEnable_sskuSearchType">--%>
                            <%--<option value="0">模糊</option>--%>
                            <%--<option value="1">精确</option>--%>
                            <%--</select>--%>
                            <%--</div>--%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="wish_idEnable_sskuSearchType">
                                    <option value="1">精确</option>
                                </select>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select placeholder="" name="storeAcct" id="wishSubProd_depart_sel" lay-search
                                            lay-filter="wishSubProd_depart_sel" class="orgs_hp_custom"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select placeholder="" name="saleName" id="wish_salesman_sel" lay-search
                                            lay-filter="wish_salesman_sel" class="users_hp_custom"
                                            data-rolelist="wish专员"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" lay-filter="component-form-element">
                                    <select id="wish_isEnableProd_store_sel" lay-search
                                            lay-filter="wish_isEnableProd_store_sel" class="store_hp_custom"
                                            data-platcode="wish">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select name="is_sale_s" id="is_sale_s">
                                        <option value='1'>上架中
                                        <option>
                                        <option value='0'>已下架
                                        <option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1" style="text-align:right">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload"
                                        id="adjustPriceSearchBtn">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                        id="adjustPriceResetBtn">清空
                                </button>
                            </div>
                        </div>
                        <div id="wishIsEnableProductCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                    <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span
                            id="tolnum_span_wish_stop"></span>)
                    </div>
                    <div class="dis_flex mg_10">
                        <div class="layui-form">
                            <input type="checkbox" id="is_sellamount" title="刊登180天0销量" lay-skin="primary">
                        </div>
                        <div class="layui-form">
                            <input type="checkbox" id="is_onsell" title="促销SKU" lay-skin="primary">
                        </div>
                        <div class="layui-form">
                            <input type="checkbox" id="is_zero" title="库存为0" lay-skin="primary">
                        </div>
                        <button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量上架
                        </button>
                        <div class="layui-form">
                            <input type="checkbox" id="iepp_isYellow" title="黄钻产品" lay-skin="primary">
                        </div>
                        <div class="layui-form">
                            <input type="checkbox" id="is_modifystockzero" title="是否标零" lay-skin="primary">
                        </div>
                        <button type="button" id="wish_batchDisEnableProd"
                                class="layui-btn layui-btn-danger layui-btn-sm">
                            批量下架
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="enableProdTable" lay-filter="adjustPriceTable"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div>
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        <input type="text" class="layui-input" id="newPrice" style="height:28px" value={{ d.newPrice
                               || '' }}>
                    </script>
                    <script type="text/html" id="saleStatsTpl">
                        {{# if(d.isSale != null){ }}
                        {{# if(d.isSale == '1'){ }}
                        <span style="color:blue">上架中</span>
                        {{# }else if(d.isSale == '0'){ }}
                        <span style="color:red">已下架</span>
                        {{#  } }}
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/isEnableProduct.js"></script>
<script>
    //多选渲染函数
    function select_multi(name, arr) {
        var formSelects = layui.formSelects
        formSelects.render({
            name: name, //xm-select的值
            type: 2, //select样式为checkbox
            data: {
                arr: arr,
                name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
                val: 'value'
            }
        })
    }

    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var platAccts = [];
        $.ajax({
            type: "POST",
            url: ctx + "/wishIsEnableProduct/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (returnData) {
                for (var i = 0; i < returnData.length; i++) {
                    var a = {name: returnData[i].storeAcct, value: returnData[i].id}
                    platAccts.push(a);
                }
                //属性多选
                //select_multi('selectAttr_store',platAccts)
                formSelects.data('selectAttr_store', 'local', {arr: platAccts})
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    })
</script>