<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>lazada仅调整促销价</title>
<style>
</style>
<div class="layui-fluid" id="lay_lazadamodifypromotion">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="lazadaadjustpromoForm" class="layui-form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<div class="layui-form-label" style="padding: 0px">--%>
                                    <%--<select name="skuType">--%>
                                        <%--<option value="0">商品子sku</option>--%>
                                        <%--<option value="1">商品父sku</option>--%>
                                    <%--</select>--%>
                                <%--</div>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input type="text" name="skuList" autocomplete="off" class="layui-input"--%>
                                           <%--placeholder="默认模糊查询">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select name="searchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1">精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <div class="layui-form-label" style="padding: 0px">
                                        <select name="skuType">
                                            <option value="0">商品子sku</option>
                                            <option value="1">商品父sku</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="skuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select name="searchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjustpromotion_org" lay-filter="lazada_adjustpromotion_org" name="orgId"
                                            class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjustpromotion_users" lay-filter="lazada_adjustpromotion_users" name="salePersonIds"
                                            class="users_hp_custom" data-rolelist="lazada专员" lay-search>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="lazada_adjustpromotion_store" name="storeAcctIdList"
                                            class="store_hp_custom" data-platcode="lazada" lay-search>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">当前促銷价格</label>
                                <div class="layui-input-block">
                                    <select name="calculateType">
                                        <option value="1"><b>+</b></option>
                                        <option value="2">-</option>
                                        <option value="3" selected>*</option>
                                        <option value="4">=</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <input type="number" class="layui-input" name="newPriceInput" min=0>
                            </div>

                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="layui-input-block">
                                        <button type="button" id="lazadapromotionewPriceBtn"
                                                class="fr layui-btn layui-btn-normal layui-btn-sm">一键应用
                                        </button>
                                    </div>
                                </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="grossProfitRate" placeholder="例如: 0.3"
                                           type="number">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" id=""
                                        lay-filter="lazadaadjustpromotionSearch"
                                        lay-submit="lazadaadjustpromotionSearch">计算
                                </button>
                                <%--<a class="layui-btn layui-btn-sm ml20" id="lazadaadjustpromotionCalculate">计算</a>--%>
                            </div>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                <div class="layui-input-block">--%>
<%--                                <button type="button" id="lazadapromotionbatchUpadatePrice"--%>
<%--                                        class="fr layui-btn layui-btn-normal layui-btn-sm">批量调价--%>
<%--                                </button>--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            </div><div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">促销差价</label>
                                <div class="layui-input-block">
                                    <select name="symbol">
                                        <option value=">">></option>
                                        <option value="<"><</option>
                                        <option value="=">=</option>
                                        <option value="!=">≠</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <input type="number" class="layui-input" name="promotionSpreadPrice">
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                 <label class="layui-form-label">促销价差价幅度</label>
                                 <div class="layui-input-block" style="display:flex;">
                                     <input class="layui-input" name="specialPriceDiffPercentGte">
                                     <div class="layui-form-mid layui-word-aux">%</div>
                                     <input class="layui-input" name="specialPriceDiffPercentLte">
                                     <div class="layui-form-mid layui-word-aux">%</div>
                                 </div>
                             </div>
                             <div class="layui-col-md2 layui-col-lg2">
                                 <div class="layui-form-label" style="padding-top:0;">
                                     <select name="saleChoice">
                                         <option value="0">7天销量</option>
                                         <option value="1">30天销量</option>
                                         <option value="2">60天销量</option>
                                         <option value="3">90天销量</option>
                                         <option value="4">180天销量</option>
                                     </select>
                                 </div>
                                 <div class="layui-input-block" style="display:flex;">
                                     <input class="layui-input" name="saleGte">
                                     <input class="layui-input" name="saleLte">
                                 </div>
                             </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="adjustpromotion_site_sel" lay-filter="adjustpromotion_site_sel"
                                            xm-select="adjustpromotion_site_sel" class="salesSiteList" name="salesSiteList" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            </div><div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" id="lazadaadjustpromotionSearch"
                                        lay-filter="lazadaadjustpromotionSearch" lay-tips="查询所有符合条件的在线商品"
                                        lay-submit="lazadaadjustpromotionSearch">查询
                                </button>
                                <a class="layui-btn ml20 layui-btn-sm" id="lazadaadjustpromotionFilter" lay-tips="筛选当前页符合条件商品">筛选</a>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                    <span>数量(<span id="lazadapromotionNum"></span>)</span>
                    <button type="button" id="lazadapromotionbatchUpadatePrice" class="layui-btn layui-btn-normal layui-btn-sm">批量调价</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="lazadamodifypromotiontable"
                           lay-filter="lazadamodifypromotiontable"></table>

                    <script type="text/html" id="lazadaAdjustpromotion_sales">
                    {{d.sevenSales||0}}/{{d.thirtySales||0}}/{{d.sixtySales||0}}/{{d.ninetySales||0}}/{{d.hundredOfEightySales||0}}
                    </script>
                    <script type="text/html" id="lazadaAdjustpromotion_priceInfo">
                        <input type="number" class="layui-input newSpecialprice id{{d.id}}" style="height:28px"
                               value="{{d.newSpecialPrice||d.specialPrice}}" data-specialPrice="{{d.specialPrice}}"  onblur="lazadaOnline_adjustpro(this)">
                    </script>
                    <script type="text/html" id="lazadaAdjustpromotion_specialPriceDiffPercent">
                        {{# if(d.specialPriceDiffPercent*1 > 20 || d.specialPriceDiffPercent*1 < -20){}}
                            <span style="color:red;">{{d.specialPriceDiffPercent}}%</span>
                        {{# }else{ }}
                            <span>{{d.specialPriceDiffPercent}}%</span>
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/adjustpromotion.js"></script>
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

    /* layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function() {
         var formSelects = layui.formSelects;
         var platAccts = [];
         $.ajax({
             type: "POST",
             url: ctx + "/lazadaBatchOperation/getPlatData.html",
             data: {},
             async: false,
             dataType: "json",
             success: function(returnData) {
                 for (var i = 0; i < returnData.length; i++) {
                     var a = {
                         name: returnData[i].storeAcct,
                         value: returnData[i].id
                     }
                     platAccts.push(a);
                 }
                 formSelects.data('selectAttr_store', 'local', {
                     arr: platAccts
                 })
             },
             error: function() {
                 layer.msg("服务器正忙");
             }
         });
     })*/
</script>