<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/9/2
  Time: 14:47
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>lazada调整库存</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="LazadaAdjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label lazadaStock-item-label">商品SKU</label>
                                <div class="layui-input-inline lazadaStock-item-input">
                                    <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，英文逗号分隔" onblur="shopeeAdjustStock_handleSku(this.value,event)">
                                </div>
                                <div class="layui-col-md3 layui-cil-lg3">
                                    <select id="shopee_modifyStock_skuSearchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                                <button type="button" id="lazadaAdjustStockNewStockBySku" class="layui-btn layui-btn-normal layui-btn-sm">一键调整</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 通过sku调整库存 -->
<script type="text/html" id="lazadaAdjustStockBySkuModal">
    <div class="layui-card watermark">
        {{# if(d.count != 0 ){ }}
        <div class="layui-card-header">本次共调整<span class="shopeeadjustStock-font-weight ml10 mr10">{{d.count}}</span>个SKU（已去重）</div>
        <div class="layui-card-body">
            <form action="" class="layui-from" id="lazadaAdjustStockBySkuForm">
                <div class="layui-form-item">
                    <label class="layui-form-label">
                        <font class="fRed">*</font>调整库存为:
                    </label>
                    <div class="layui-input-block">
                        <input type="number" min="0" class="layui-input" name="count">
                    </div>
                </div>
            </form>
        </div>
        {{# }else{ }}
        <div class="taCenter">无有效商品SKU，请重新输入</div>
        {{# } }}
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/lazadaModifyStock.js"></script>
