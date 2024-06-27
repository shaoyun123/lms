<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>订单重寄</title>
<style></style>
<div id="orderResend">
  <div class="layui-card">
    <div class="layui-card-body">
      <div class="mg_50">
        <div class="layui-tab" lay-filter="orderLog">
          <ul class="layui-tab-title">
            <li class="layui-this">详情</li>
          </ul>
          <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
              <form class="layui-form" id="order_resend_editForm" lay-filter="order_resend_editForm">
                <div class="layui-form-item">
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">店铺单号</label>
                    <div class="layui-input-block">
                      <input type="text" name="platOrderId" class="layui-input layui-disabled" style="color: #555 !important" readonly lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                      <input type="text" name="platCode" readonly class="layui-disabled layui-input" style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                      <input type="text" name="storeAcct" readonly class="layui-disabled layui-input" style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                      <input type="text" name="siteName" class="layui-disabled layui-input" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">交易ID</label>
                    <div class="layui-input-block">
                      <input type="text" name="platTransactionId" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">币种</label>
                    <div class="layui-input-block">
                      <input type="text" name="currency" class="layui-disabled layui-input" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">订单金额</label>
                    <div class="layui-input-block">
                      <input name="platOrderAmt" type="text" lay-verify="required" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">出货仓库</label>
                    <div class="layui-input-block">
                      <select name="warehouseId" lay-search></select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">买家指定物流</label>
                    <div class="layui-input-block">
                      <input type="text" name="buyerRequireShippingType" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">卖家邮箱</label>
                    <div class="layui-input-block">
                      <input type="text" name="sellerEmail" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">买家邮箱</label>
                    <div class="layui-input-block">
                      <input type="text" name="buyerEmail" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">买家ID</label>
                    <div class="layui-input-block">
                      <input type="text" name="buyerUserId" class="layui-input layui-disabled" readonly style="color: #555 !important" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>收件人</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingUsername" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>收件人电话</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingPhoneNumber" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>收件人邮编</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingZip" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label"><font class="fRed">*</font>地址1</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingStreet1" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">地址2</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingStreet2" class="layui-input" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>城市</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingCity" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>州/省</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingState" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label"><font class="fRed">*</font>国家/地区</label>
                    <div class="layui-input-block">
                      <input type="text" name="shippingCountryCode" class="layui-input" lay-verify="required" />
                    </div>
                  </div>
                  <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label"><font class="fRed">*</font>备注类型</label>
                    <div class="layui-input-block">
                      <div class="layui-col-md6 layui-col-lg6">
                        <input type="text" name="noteType" class="layui-input layui-disabled" value="重寄订单" readonly style="color: #555 !important; height: 34px" />
                      </div>
                      <div class="layui-col-md6 layui-col-lg6">
                        <input type="text" name="noteContent" class="layui-input" lay-verify="required" placeholder="备注内容" style="height: 34px" />
                      </div>
                    </div>
                  </div>
                  <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                </div>
                <div class="layui-form-item">
                  <div class="layui-col-lg4 layui-col-md4 disflex">
                    <input type="text" class="layui-input" />
                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="order_resend_addProducts">添加商品</button>
                  </div>
                </div>
                <div class="layui-form-item">
                  <div class="layui-col-lg12 layui-col-md12">
                    <table class="layui-table" id="order_resend_product_table" lay-filter="order_resend_product_table"></table>
                  </div>
                </div>
                <button type="button" hidden id="order_savebtn">保存</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 重寄 table -->
<script type="text/html" id="order_resend_edit_option">
  <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
</script>

<script type="text/html" id="order_resend_detail_img_tpl">
  <div>
    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
  </div>
</script>
<script type="text/html" id="order_resend_edit_ListingID">
  <input type="text" class="layui-input" name="" value="{{d.itemId||''}}" />
</script>
<script type="text/html" id="order_resend_edit_Prodsku">
  <div class="disflex">
    <input type="text" class="layui-input" name="" value="{{d.prodSSku}}" />
    <i class="layui-icon refresh_icon">&#xe669;</i>
  </div>
</script>
<script type="text/html" id="order_resend_edit_prodQuantity">
  <input type="number" class="layui-input" name="" value="{{d.prodQuantity||''}}" onkeypress="commonKeyPressInputPositiveInt(event)" min="1" />
  <input type="hidden" name="platQuantity" value="{{d.platQuantity}}" />
  <input type="hidden" name="platDetailTranscationId" value="{{d.platDetailTranscationId}}" />
  <input type="hidden" name="platOrderItemId" value="{{d.platOrderItemId}}" />
</script>
<script type="text/html" id="order_resend_edit_platOrderDetailAmt">
  <input type="number" class="layui-input" value="{{d.platOrderDetailAmt===undefined ? '' : d.platOrderDetailAmt }}" placeholder="销售金额" min="0" step="1" onblur="commonFormatNonnegativeBlur(this)" />
</script>

<!-- 添加商品弹框 -->
<script type="text/html" id="pop_order_resend_addProducts">
  <div class="mg_50">
    <span class="numCount">数量(<span id="pop_order_resend_addProducts_num"></span>)</span>
    <table class="layui-table" id="order_resend_addProducts_table" lay-filter="order_resend_addProducts_table"></table>
  </div>
</script>
<script type="text/html" id="order_resend_add_product_img">
  <div>
    <img width="60" height="60" data-original="${tplIVP}{{d.image||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
  </div>
</script>

<script type="text/html" id="order_resend_add_product_psku">
  <div>{{d.parent.pSku}}</div>
</script>
<script src="${ctx}/static/js/order/orderResend.js"></script>
