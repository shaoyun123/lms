<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>批量boost</title>
<style>
  #LAY-shopeeBacthBoost .layui-form-label {
    width: 130px;
  }
  #LAY-shopeeBacthBoost .layui-input-block {
    margin-left: 160px;
  }
  #LAY-shopeeBacthBoost .w400 {
    width: 400px;
  }
  #LAY-shopeeBacthBoost .letf-btn {
    text-align: right;
  }
</style>
<div class="layui-fluid" id="LAY-shopeeBacthBoost">
  <div class="layui-card">
    <div class="layui-card-header">筛选条件</div>
    <div class="layui-card-body">
      <form class="layui-form" action="" id="shopeeBacthBoost-form">
        <div class="layui-form-item disflex">
          <div class="w150 disflex">
            <font class="fRed mr10">*</font>
            <select
              name="storeType"
              lay-filter="shopeeBacthBoost-form-siteStore"
            >
              <option value="1">站点</option>
              <option value="2">店铺</option>
            </select>
          </div>
          <div class="ml10 w400">
            <select
              name="storeAcctIdList"
              xm-select="shopeeBacthBoostSiteAndStore"
              xm-select-search
              xm-select-search-type="dl"
              xm-select-skin="normal"
            ></select>
          </div>
        </div>
        <div class="layui-form-item disflex">
          <div class="w150">
            <select name="salesSearchType">
              <option value="0">Listing7天销量</option>
              <option value="1">Listing30天销量</option>
              <option value="2">Listing90天销量</option>
            </select>
          </div>
          <div class="ml10 disflex w400">
            <input
              type="number"
              min="0"
              name="salesMin"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
            <input
              type="number"
              min="0"
              name="salesMax"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">收藏数</label>
          <div class="layui-input-block disflex w400">
            <input
              type="number"
              min="0"
              name="likesAmountStart"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
            <input
              type="number"
              min="0"
              name="likesAmountEnd"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">浏览量</label>
          <div class="layui-input-block disflex w400">
            <input
              type="number"
              min="0"
              name="viewAmountStart"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
            <input
              type="number"
              min="0"
              name="viewAmountEnd"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">现价(站点币种)</label>
          <div class="layui-input-block disflex w400">
            <input
              type="number"
              min="0"
              name="currentPriceStart"
              class="layui-input"
              onblur="this.value=this.value.replace('e','')"
            />
            <input
              type="number"
              min="0"
              name="currentPriceEnd"
              class="layui-input"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">刊登时间</label>
          <div class="layui-input-block w400">
            <input
              id="shopeeBacthBoost-listing-time"
              name="listingTime"
              class="layui-input"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">排序方式</label>
          <div class="layui-input-block w400">
            <select name="orderBy">
              <option value="0">7日销量升序</option>
              <option value="1">7日销量降序</option>
              <option value="2">30日销量升序</option>
              <option value="3">30日销量降序</option>
              <option value="4">90日销量升序</option>
              <option value="5">90日销量降序</option>
              <option value="6">收藏量升序</option>
              <option value="7">收藏量降序</option>
              <option value="8">浏览量升序</option>
              <option value="9">浏览量降序</option>
              <option value="10">刊登时间升序</option>
              <option value="11">刊登时间降序</option>
            </select>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">每个店铺Boost数量</label>
          <div class="layui-input-block w400">
            <input
              type="number"
              min="0"
              name="boostAmount"
              class="layui-input"
              onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
              onblur="if(this.value=='0'){this.value=''}"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-input-block w400 letf-btn">
            <a
              href="javascript:;"
              class="layui-btn layui-btn-normal"
              id="shopeeBacthBoost-rep-boost"
              >替换Boost</a
            >
            <a
              href="javascript:;"
              class="layui-btn layui-btn-normal"
              id="shopeeBacthBoost-ontime-boost"
              >定时Boost</a
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<script src="${ctx}/static/js/publishs/shopee/batchBoost.js"></script>
