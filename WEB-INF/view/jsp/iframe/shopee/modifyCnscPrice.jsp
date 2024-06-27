<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>shopee调整CNSC商品价格</title>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form id="shop_online_modifyCnscPrice_form" class="layui-form">
            <div class="layui-form-item" style="margin-bottom: 0">
              <div class="layui-col-lg4 layui-col-md4 disflex">
                <div style="width: 130px;">
                  <select name="type">
                    <option value="prodPSku">商品父SKU</option>
                    <option value="globalItemSku">全球商品SKU</option>
                    <option value="globalItemId">全球商品ItemId</option>
                    <option value="itemId">店铺商品ItemId</option>
                  </select>
                </div>
                <div style="flex:1">
                  <input
                    type="text"
                    name="list"
                    class="layui-input"
                    placeholder="精确查询，且SKU数量不能超过1000个"
                    onblur="handleSku(this.value,event)"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <button
                  class="layui-btn layui-btn-sm ml20 keyHandle"
                  type="button"
                  data-type="reload"
                  id="shop_online_modifyCnscPrice_search"
                >
                  搜索
                </button>
                <button
                  type="reset"
                  class="layui-btn layui-btn-sm layui-btn-primary"
                  id="shop_online_modifyCnscPrice_reset"
                >
                  清空
                </button>
              </div>
              <!-- </div>
              <div class="layui-form-item mt05"> -->
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">当前促销价</label>
                <div class="layui-input-block disflex">
                  <div style="width: 70px">
                    <select name="calType">
                      <option value="1"><b>+</b></option>
                      <option value="2">-</option>
                      <option value="3" selected>*</option>
                      <option value="4">=</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      class="layui-input"
                      name="newPriceInput"
                      onkeypress="commonKeyPressInputFloat(event)"
                    />
                  </div>
                  <button
                    type="button"
                    id="shop_online_modifyCnscPrice_operator"
                    class="fr layui-btn layui-btn-normal layui-btn-sm"
                  >
                    一键应用
                  </button>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">毛利率</label>
                <div class="layui-input-block disflex">
                  <input
                    class="layui-input"
                    name="newGrossRate"
                    placeholder="填写小数,例如0.3"
                  />
                  <button
                    type="button"
                    id="shop_online_modifyCnscPrice_grossRate"
                    class="fr layui-btn layui-btn-normal layui-btn-sm"
                  >
                    一键应用
                  </button>
                </div>
              </div>
            </div>
            <div id="shopeePromotionPrice_customsContent"></div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab">
            <div class="disFCenter">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="shop_online_modifyCnscPrice_total">0</span>)
                </li>
              </ul>
              <div class="ml20 disflex">
                <div>
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal"
                    id="shop_online_modifyCnscPrice_batchModify"
                    >批量修改</a
                  >
                </div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="shop_online_modifyCnscPrice_table"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/html" id="shop_online_modifyCnscPrice_newPrice">
  <input
    type="number"
    name="newPrice"
    class="layui-input"
    value="{{d.newPrice}}"
    onkeypress="commonKeyPressInputFloat(event)"
  />
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/shopee/modifyCnscPrice.js"
></script>
