<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>eaby-刊登拍卖</title>
<style></style>
<div id="ebay_genauctionModel">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="ebay_genauction_form">
        <div class="layui-form-item layui-row">
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">刊登天数</label>
            <div class="layui-input-block">
              <select name="listingDuration" id="ebay_genauction_listingDuration"></select>
            </div>
          </div>
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">一口价的</label>
            <div class="layui-input-block disflex">
              <input type="number" class="layui-input" name="fixedPricePercent" />
              <span class="w50">%</span>
              <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="ebay_genauction_fixedPrice">应用</button>
            </div>
          </div>
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">当前拍卖价</label>
            <div class="layui-input-block disflex">
              <select name="calculateType">
                <option value="1"><b>+</b></option>
                <option value="2">-</option>
                <option value="3" selected>*</option>
                <option value="4">=</option>
              </select>
              <input type="number" name="calculatePrice" class="layui-input" />
              <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="ebay_genauction_buyItNowPrice">应用</button>
            </div>
          </div>
          <div class="layui-col-md2 layui-col-lg2">
            <div class="fr">
              <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="ebay_genauction_publish">批量生成</button>
              <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="ebay_genauction_online">立即刊登</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="layui-card">
    <div class="layui-card-body">
      <table id="ebay_genauction_table" lay-filter="ebay_genauction_table" class="layui-table"></table>
    </div>
  </div>
</div>

<script type="text/html" id="ebay_genauction_imageTpl">
  <div>
    <img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.mainImgUri }}" data-onerror="layui.admin.img_noFind()" />
  </div>
</script>

<script type="text/html" id="ebay_genauction_buyItNowPrice_tpl">
  <input type="number" class="layui-input" name="buyItNowPrice" value="{{d.buyItNowPrice}}" onkeypress="commonKeyPressInputFloat(event)" />
  <!-- 刊登 -->
  <input type="text" name="storeAcctId" value="{{d.storeAcctId}}" hidden />
  <input type="text" name="siteId" value="{{d.siteId}}" hidden />
  <input type="text" name="prodTempVarietyId" value="{{d.prodTempVarietyId}}" hidden />
  <input type="text" name="prodPId" value="{{d.prodPId}}" hidden />
  <input type="text" name="isOverSeasWh" value="{{d.isOverSeasWh}}" hidden />
  <!-- 在线商品 -->
  <input type="text" name="prodSyncSId" value="{{d.prodSyncSId}}" hidden />
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/genauctionModel.js"></script>
