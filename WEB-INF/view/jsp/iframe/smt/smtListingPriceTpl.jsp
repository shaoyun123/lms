<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt刊登价预估</title>
<style>
  #aep_smtListing_countryList {
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
  }
</style>
<!-- smt模板的商品详情,smt刊登管理的商品详情 -->
<div class="layui-fluid">
  <div style="padding: 20px 20px 0 20px" id="aep_smtListing_estimatePriceTpl">
    <div class="layui-tab-item layui-show">
      <form id="aep_smtListingPrice" class="layui-form" autocomplete="false">
        <input type="hidden" name="prodPId" value="1" />
        <div class="layui-row">
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">成本(￥)</label>
            <div class="layui-input-block">
              <input class="layui-input" name="cost" value="" placeholder="商品成本" />
            </div>
          </div>
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">商品毛重(g)</label>
            <div class="layui-input-block">
              <input class="layui-input" name="weight" value="" placeholder="商品重量" />
            </div>
          </div>
        </div>
        <div class="layui-row">
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">毛利率(%)</label>
            <div class="layui-input-block">
              <input class="layui-input" name="grossProfitRate" value="" placeholder="如20%,请直接填写20" />
            </div>
          </div>
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">优惠幅度(%)</label>
            <div class="layui-input-block">
              <input class="layui-input" name="discountRate" value="30" />
            </div>
          </div>
          <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label">定价方式</label>
            <div class="layui-input-block">
              <select name="shippingType" lay-filter="aep_smtShippingType">
                <option value="">子SKU默认定价</option>
                <option value="USD5_LESS_GENERAL"><5USD 普货</option>
                <option value="SPECIAL">特货</option>
                <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                <option value="GENERAL_OLD">普货（旧版）</option>
                <option value="USD5_USD8_GENERAL">5-8美金普货</option>
              </select>
            </div>
          </div>

          <div class="layui-col-md2 layui-col-lg2">
            <label class="layui-form-label"></label>
            <div class="layui-input-block">
              <button type="submit" lay-submit lay-filter="aep_smtListingPrice" class="layui-btn layui-btn-sm">更新</button>
            </div>
          </div>
        </div>
      </form>
      <div class="layui-card">
        <div class="layui-card-header disflex" style="background-color: #d7d7d7" id="aep_smtListing_country_header" data-show="true">
          <div>区域定价</div>
          <div class="h100 aep-smtListing-tohideIcon"><i class="layui-icon">&#xe61a;</i></div>
          <div class="h100 hidden aep-smtListing-toShowIcon"><i class="layui-icon">&#xe619;</i></div>
        </div>
        <div class="layui-card-body">
          <form action="" class="layui-form" id="aep_smtListing_countryList"></form>
        </div>
      </div>
      <form action="" class="layui-form disflex">
        <select name="adjustType" id="aep_smtListing_adjustType">
          <option value="ECONOMYECONOMY">常见1:俄西经济</option>
          <option value="ECONOMYSIMPLE">常见2:俄经济西简易</option>
          <option value="SIMPLESIMPLE">常见3:俄西简易</option>
          <option value="STANDARDSIMPLE">常见4:俄标准西简易</option>
          <option value="STANDARDSTANDARD">常见5:全标准</option>
        </select>
        <button type="button" class="layui-btn layui-btn-sm" id="aep_smtListing_batchEstimateRegionPrice">估算区域定价和刊登价</button>
      </form>
      <div>
        <table class="layui-table" id="aep_smtListingPriceTable">
          <thead>
            <tr>
              <th>模板子SKU</th>
              <th style="min-width: 50px">成本</th>
              <th style="min-width: 50px">商品毛重(g)</th>
              <th>商品抛重(g)</th>
              <th>定价</th>
              <th>刊登价</th>
              <th>预估利润(&yen;)</th>
              <th data-order="9999">操作</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtListingPriceTpl.js"></script>
<!-- <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/publish.js"></script> -->
