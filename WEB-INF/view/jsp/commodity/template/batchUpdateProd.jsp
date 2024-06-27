<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<style>
  #aliSkuInfo {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  #batchAli1688SkuInfoBox {
    padding: 5px 20px 0;
  }
  .skuInfoItem {
    width: 16%;
    height: 250px;
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    padding: 5px;
    box-shadow: 1px 1px 15px 1px #e7e3e3;
    box-sizing: border-box;
  }
  .skuInfoItem img {
    width: 170px;
    height: 170px;
  }
  .fontBold {
    font-weight: bold;
  }
  .img-content {
    position: relative;
    width: 170px;
    left: 50%;
    margin-left: -85px;
  }
  .img-content .layui-form-checkbox {
    position: absolute;
    top: 10px;
    left: 5px;
  }
  #restText,
  #overText {
    line-height: 32px;
  }

  .update-page-top {
    width: 100%;
    height: 400px;
    padding: 20px 0 20px 60px;
    display: flex;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom: 1px solid #e7e3e3;
  }
  .prod_attr_left{
    width: 350px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .prod_attr_line {
    width: 40px;
  }
  .pointer {
    cursor: pointer;
  }
  .point_text {
    font-size: 14px;
    font-weight: 600;
    color: #434649;
    line-height: 32px;
  }
  .d_flex {
    display: flex;
  }
  .search_box {
    position: relative;
    padding-left: 10px;
    display: flex;
    box-sizing: content-box;
  }
  .attr_search {
    justify-content: space-between;
    height: 50px;
  }
  .search_icon {
    width: 40px;
    height: 30px;
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
    border-left: none;
    justify-content: center;
    align-items: center;
  }
  #attrListLeft {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
  }
  .attr_check_item {
    min-width: 50%;
    margin: 8px 0px;
  }
  .prod_attr_line {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .line_top, .line_bottom {
    width: 1px;
    height: 185px;
    background-color: #ddd;
  }
  .line_arrow {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .left-arrow,
  .right-arrow {
    width: 10px;
    height: 10px;
    border-top: 2px solid #428bca;
    border-left: 2px solid #428bca;
    border-bottom: 2px solid transparent;
    border-right: 2px solid transparent;
  }
  .left-arrow {
    transform: rotate(-45deg);
  }
  .right-arrow {
    transform: rotate(135deg);
  }
  .left-arrow:hover,
  .right-arrow:hover {
    border-top: 2px solid #0785f3;
    border-left: 2px solid #0785f3;
  }

  .hideAnimation {
    position: relative;
    animation: hide 0.8s forwards; /* 应用名为 "hide" 的动画效果，持续时间为 1 秒，动画结束后保持最终状态 */
  }
  .showAnimation {
    position: relative;
    animation: show 0.8s forwards;
  }

  @keyframes hide {
    from {
      left: 0px;
    }
    to {
      left: -410px;
    }
  }

  @keyframes show {
    from {
      left: -410px;
    }
    to {
      left: 0px; 
    }
  }

  #supplier_sku_table {
    height: 100%;
    background: #fff;
    font-size: 12px;
    width: calc(100vw - 80px);
    overflow: auto;
    /* height: 200px; */
  }

  .supplier_info {
    padding: 0 40px;
  }
  .taRight {
    padding-top: 10px;
  }
  #supplier_sku_table .bg_pink {
    background-color: pink !important;
  }
  #logisAttrList1 input {
    display: none !important;
  }
  .applier_toggle_col {
    display: none;
  }
  .attr_right {
    display: none;
  }

  .logisAttrList_td .xm-select-parent {
    z-index: 0;
  }
  /* ztt20240409表格重写样式start */
  .supplier-sku-table {
    width: 100%;
    background-color: #fff;
    color: #666;
    text-align: center;
    border-collapse: collapse;
    display: block;
    border-spacing: 0px;
    display: block;
  }
  .supplier-sku-table>thead {
    display: block;
    color: #666666;
  }
  .supplier-sku-table>thead th {
    position: relative;
    user-select: none;
    background-color: #f2f2f2;
  }
  .supplier-sku-table>thead th:not(.non-resizable):after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    cursor: col-resize;
    height: 100%;
  }
  .supplier-sku-table>thead>tr{
    display: table;
    width: 100%;
    table-layout: fixed;
    box-sizing: border-box;
  }
  .supplier-sku-table>tbody>tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    box-sizing: border-box;
    height: 68px !important;
  }
  .supplier-sku-table>thead>tr>th {
    height: 40px;
    text-align: center;
    border: 1px solid #e6e6e6;
    padding: 0 3px;
    box-sizing: border-box;
  }
  .supplier-sku-table>tbody>tr>td {
    height: 50px;
    text-align: center;
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 0 3px;
    box-sizing: border-box;
  }
  .supplier-sku-table>tbody{
    display: block;
  }
  .supplier-sku-table th:first-child{
    position: sticky;
    left: 0;
    z-index: 1;
  }
  .supplier-sku-table th:nth-child(2){
    position: sticky;
    left: 71px;
    z-index: 1;
  }

  .supplier-sku-table th:nth-child(3){
    position: sticky;
    left: 142px;
    z-index: 1;
  }
  .supplier-sku-table th:nth-child(4){
    position: sticky;
    left: 262px;
    z-index: 1;
  }
  .supplier-sku-table .w70 {
    width: 71px;
  }
  .supplier-sku-table .w100 {
    width: 100px;
  }
  .supplier-sku-table .w120 {
    width: 120px;
  }
  .supplier-sku-table .w150 {
    width: 150px;
  }
  .supplier-sku-table .w180 {
    width: 180px;
  }
  /* ztt20240409表格重写样式end */
</style>
<script type="text/html" id="prodlist_batchUpdateProductLayer">
  <div class="update-page-top">
    <!-- 左侧属性复选框 -->
    <div class="prod_attr_left">
      <div class="attr_search d_flex">
        <span class="point_text">选择要修改的属性</span>
        <div class="search_box">
            <input type="text" id="updateProdInputSearch" placeholder="输入检索属性" class="layui-input">
            <div class="search_icon d_flex" id="searchAttrIcon" style="cursor: pointer;">
              <i class="layui-icon layui-icon-search"></i>
            </div>
        </div>
      </div>
      <div id="attrListLeft" class="layui-form"></div>
    </div>
    <!-- 展开收缩 -->
    <div class="prod_attr_line">
      <div class="line_top"></div>
      <div class="pointer">
        <div class="line_arrow" id="showArrow" style="display: none;">
          <div class="right-arrow"></div>
          <div class="right-arrow" style="position:relative;right: 5px"></div>
        </div>
        <div class="line_arrow" id="hideArrow">
          <div class="left-arrow" style="position:relative;left: 5px"></div>
          <div class="left-arrow"></div>
        </div>
      </div>
      <div class="line_bottom"></div>
    </div>
    <!-- 属性展示区域 -->
    <div class="prod_attr_right" style="flex: 1;overflow: auto;">
      <form class="layui-form" action="" lay-filter="component-form-group" id="batchUpdateProduct"
        autocomplete="off" onsubmit="return false;">
        <div style="padding: 20px 0 10px; border-bottom: 1px solid #eee">
          <div class="layui-form-item attr_right" name="title">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
                <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>商品名称</label>
                <div class="layui-input-inline" style="width: 55%;">
                    <input type="text" class="layui-input" name="title">
                </div>
                <div class="layui-input-inline" style="width: 100px;">
                  <input id="isTitleSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isTitleSingle">
                </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="purchaseChannel">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>商品简称</label>
              <div class="layui-input-inline" style="width: 55%;">
                  <input type="text" class="layui-input" name="purchaseChannel">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isPurchaseChannelSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isPurchaseChannelSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="isSale">
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label w120">销售状态</label>
              <div class="layui-input-inline overflowSelect">
                <select name="isSale" lay-search>
                  <option value=""></option>
                  <option value="false">停售</option>
                  <option value="true">在售</option>
              </select>
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isIsSaleSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isIsSaleSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="notSaleReason">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>停售原因</label>
              <div class="layui-input-inline overflowSelect">
                <select name="notSaleReason" id="notSaleReasonInfo" lay-filter="notSaleReason" lay-search></select>
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isNotSaleReasonSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isNotSaleReasonSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="material">
            <div class="layui-col-lg6 layui-col-md6 requireAttr" id="materialContent" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>材质</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" name="material">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isMaterialSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isMaterialSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="suttleWeight">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>商品净重(g)</label>
              <div class="layui-input-inline">
                  <input name="suttleWeight" class="layui-input" min="0" onkeyup="checktNumPositive(this)"
                        onblur="getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isSuttleWeightSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isSuttleWeightSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="unit">
            <div class="layui-col-lg6 layui-col-md6 requireAttr" id="unitContent" notNull>
              <div style="display: flex;justify-content: flex-start;">
                <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>单位</label>
                <div class="layui-input-inline overflowSelect" id="batchUpdate_init">
                  <select name="unit" id="unitInfo" lay-filter="unit" lay-search></select>
                </div>
                <div class="layui-input-inline" style="width: 100px;">
                  <input id="isUnitSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isUnitSingle">
                </div>
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="packSpecification">
            <div class="layui-col-lg6 layui-col-md6 requireAttr" notNull>
              <div style="display: flex;justify-content: flex-start;">
                <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>包装规格</label>
                <div class="layui-input-inline overflowSelect">
                  <select name="packSpecification" id="packSpec" lay-filter="packSpecification" lay-search></select>
                </div>
                <div class="layui-input-inline" style="width: 100px;">
                  <input id="isPackSpecificationSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isPackSpecificationSingle">
                </div>
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="packDesc">
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label w120">入库要求</label>
              <div class="layui-input-inline">
                  <input type="text" class="layui-input" name="packDesc">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isPackDescSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isPackDescSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="stockWarnCycle">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>定制产品预警周期</label>
              <div class="layui-input-inline">
                  <input name="stockWarnCycle" class="layui-input" placeholder="" min="0" value="5">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isStockWarnCycleSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isStockWarnCycleSingle">
              </div>
            </div>
          </div>

          <div class="layui-form-item attr_right" name="buyer">
            <div class="layui-col-md6 layui-col-lg6 requireAttr" notNull>
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>采购员</label>
              <div class="layui-input-inline overflowSelect">
                <select name="buyer" id="buyer" style="width: 110px" lay-filter="buyer" lay-search></select>
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isBuyerSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isBuyerSingle">
              </div>
            </div>
          </div>

          <div class="layui-form-item attr_right" name="purchaseDlvrDays" >
            <div class="layui-col-lg6 layui-col-md6 requireAttr" notNull>
                <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>定制产品到货天数</label>
                <div class="layui-input-inline">
                    <input name="purchaseDlvrDays" class="layui-input" min='0'>
                </div>
                <div class="layui-input-inline" style="width: 100px;">
                  <input id="isPurchaseDlvrDaysSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isPurchaseDlvrDaysSingle">
                </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="productSize">
            <div class="layui-col-lg6 layui-col-md6">
              <label class="layui-form-label w120">商品长宽高(cm)</label>
              <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
                <input type="text" class="layui-input" name="productLength">
              </div>
              <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
                <input type="text" class="layui-input" name="productWidth">
              </div>
              <div class="layui-input-inline" style="width: 60px;" >
                <input type="text" class="layui-input" name="productHeight">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isProductSizeSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isProductSizeSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="outerBoxSize" id="outerBoxSize">
            <div class="layui-col-lg6 layui-col-md6 requireAttr">
              <label class="layui-form-label w120"><span class="redStar" style="color: red">*</span>外箱长宽高(cm)</label>
              <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
                <input type="text" class="layui-input" name="outerBoxLength">
              </div>
              <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
                <input type="text" class="layui-input" name="outerBoxWidth">
              </div>
              <div class="layui-input-inline" style="width: 60px" >
                <input type="text" class="layui-input" name="outerBoxHeight">
              </div>
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isOuterBoxSizeSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isOuterBoxSizeSingle">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" style="display: flex;" name="logisAttrList">
            <div class="layui-col-md11 layui-col-lg11 requireAttr" notNull id="logisContent">
              <div class="layui-input-inline" style="width: 100px;">
                <input id="isLogisAttrListSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isLogisAttrListSingle">
              </div>
              <label class="layui-form-label" style="width: 60px"><span class="redStar" style="color: red">*</span>物流属性</label>
              <div class="layui-input-block" id="logisAttrList1">
              </div>
            </div>
          </div>
          <div class="layui-form-item attr_right" name="liquidNetContentMl" id="liquidNetContentMl">
            <div class="layui-col-md6 layui-col-lg6">
              <label class="layui-form-label w120">液体净含量(ml)</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" name="liquidNetContentMl">
              </div>
              <!-- <div class="layui-input-inline" style="width: 100px;">
                <input id="isLiquidNetContentMlSingle" type="checkbox" title="单独修改" lay-skin="primary" lay-filter="isLiquidNetContentMlSingle">
              </div> -->
            </div>
          </div>
          
        </div>
      </form>
    </div>
  </div>

  <div class="supplier_info">
    <form class="layui-form" action="" lay-filter="component-form-group" id="updateListForm_productlist"
      autocomplete="off">
      <div id="apply-info" class="disN" style="padding: 20px 0 10px; border-bottom: 1px solid #eee">
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label w120">采购URL</label>
                <div class="layui-input-inline">
                    <input name="purchaseUrl" class="layui-input" min='0' placeholder="">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label w120">最小订货量</label>
                <div class="layui-input-inline">
                    <input name="minOrderNum" class="layui-input" min='0' placeholder="">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label w120">采购基数</label>
                <div class="layui-input-inline">
                    <input name="purBaseNum" class="layui-input" min='0' placeholder="">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label w120">供应商商品报价￥</label>
                <div class="layui-input-inline">
                    <input name="prodprice" class="layui-input" min='0' placeholder="" >
                </div>
            </div>
      
            <div class="layui-inline">
                <label class="layui-form-label w120">供应商包装</label>
                <div class="layui-input-inline">
                    <select name="ifSupplierPackOfDefaultOnline" lay-search>
                        <option value="">默认供应商的</option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                </div>
            </div>
      
            <div class="layui-inline">
                <label class="layui-form-label w120">供应商包装费用￥</label>
                <div class="layui-input-inline">
                    <input name="supplierpackfee" class="layui-input" min='0' placeholder="">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label w120">仓库包装费用￥</label>
                <div class="layui-input-inline">
                    <input name="stockPackFeeOfDefaultOnline" class="layui-input" min='0' placeholder="">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label w120">下单备注</label>
                <div class="layui-input-inline">
                    <input type="text" name="note" class="layui-input" placeholder="">
                </div>
            </div>
            <div class="layui-inline">
              <button class="layui-btn layui-btn-sm layui-bg-blue" style="margin-left: 20px" type="button" onclick="handleMulSetTable()">批量应用</button>
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="fl" style="padding-top: 10px;height: 32px">
            <span title="勾选此项，下面变更供应商信息时，会删除原有的供应商信息，仅保留本次修改的供应商信息">
            <input type="checkbox" name="removeOldSupplier" title="移除原有默认供应商" lay-skin="primary">
            </span>
        </div>
        <p style="padding-top: 10px;margin-left: 40%;display: none;" id="match-info">
          <button class="layui-btn layui-btn-sm layui-bg-blue" style="margin-left: 20px" type="button" onclick="handleMulMatchTable('1')">批量精确匹配</button>
          <button class="layui-btn layui-btn-sm layui-bg-blue" style="margin-left: 20px" type="button" onclick="handleMulMatchTable('2')">批量模糊匹配</button>
          <button class="layui-btn layui-btn-sm layui-bg-red" style="margin-left: 20px" type="button" onclick="clearMAatch1688Info()">清空匹配信息</button>
          <i id="syncIcon" class="layui-icon layui-icon-tips disN" 
            onmouseenter="showTip(`1.自动匹配，匹配款式和1688属性完全相等<br />2.模糊匹配，匹配款式中包含1688属性所有词汇，不包括分隔符'-'<br />3.为了减少匹配1688属性的工作，请尽量填写款式时，使用原1688的描写，多个属性用字符'-'隔开`,this)"
            onmouseleave="removeTip(this)" style="display: inline;margin-left: 5px;"></i>
        </p>
      </div>
      <!-- 供应商表格 -->
     <div id="supplier_sku_table">
       <table class="supplier-sku-table" id="sku_dropTable">
         <thead>
           <tr>
            <th class="w70 non-resizable">
              <input type="checkbox" name="selectList" lay-skin="primary" lay-filter="selectAll" /> 
             </th>
            <th class="w70 non-resizable">
              图片
             </th>
            <th class="w120 non-resizable">
              商品SKU  
             </th>
            <th class="w150">
              款式
             </th>
            <th class="title_tr bg_pink w150">
              商品名称<font color="red">*</font>
              
            </th>
            <th class="isSale_tr bg_pink w150">
              销售状态
              
            </th>
            <th class="purchaseChannel_tr bg_pink w150">
              商品简称<font color="red">*</font>
              
            </th>
            <th class="notSaleReason_tr bg_pink w150">
              停售原因<font color="red">*</font>
              
            </th>
            <th class="material_tr bg_pink w150">
              材质<font color="red">*</font>
              
            </th>
            <th class="suttleWeight_tr bg_pink w150">
              商品净重<font color="red">*</font>
              
            </th>
            <th class="unit_tr bg_pink w150">
              单位<font color="red">*</font>
            </th>
             <th class="packSpecification_tr bg_pink w150">
              包装规格<font color="red">*</font>
              
            </th>
            <th class="packDesc_tr bg_pink w150">
              入库要求
            </th>
            <th class="stockWarnCycle_tr bg_pink w150">
              定制产品预警周期<font color="red">*</font>
            </th>
            <th class="buyer_tr bg_pink w150">
              采购员<font color="red">*</font>
            </th>
             <th class="purchaseDlvrDays_tr bg_pink w150">
              定制产品到货天数<font color="red">*</font>
            </th>  
            <th class="productSize_tr bg_pink w180">
              商品长宽高
            </th>
            <th class="outerBoxSize_tr bg_pink w180">
              外箱长宽高<font color="red">*</font>
            </th>
            <th class="logisAttrList_tr bg_pink w150">
              物流属性<font color="red">*</font>
            </th>
            <th class="liquidNetContentMl_tr bg_pink w150">
              液体净含量
            </th>
            <th class="applier_toggle_col disN w100">
              供应商<font color="red">*</font>
            </th>
            <th class="applier_toggle_col disN w100">
              采购URL<span style="color: red">*</span>
            </th>
            <th class="applier_toggle_col disN w150">
              1688属性
            </th>
            <th class="applier_toggle_col disN w100">
              最小订货量
            </th>
            <th class="applier_toggle_col disN w100">
              <span title="供应商报价(不可编辑,自动计算)=供应商商品报价 + 供应商包装费用">供应商报价(¥)</span><font color="red">*</font>
            </th>
            <th class="applier_toggle_col disN w100">
              <span title="一键生成1688订单时，采购数量将乘以该值，并向上取整">采购基数<font color="red">*</font><i class="layui-icon layui-icon-about" ></i></span>
            </th>
             <th class="applier_toggle_col disN w100">
              <span>供应商商品报价(¥)</span><font color="red">*</font>
              
            </th>
             <th class="applier_toggle_col disN w100">
              <span>供应商包装</span>
              
            </th>
             <th class="applier_toggle_col disN w100">
              <span>供应商包装费用(¥)</span>
              
            </th>
             <th class="applier_toggle_col disN w100">
              <span>仓库包装费用(¥)</span>
              
            </th>
             <th class="applier_toggle_col disN w150">
              <span>下单备注</span>
              
            </th>
             <th class="applier_toggle_col disN w100">操作</th>
           </tr>
         </thead>

         <tbody id="update_skuTbale_subTbody">
         </tbody>
       </table>
     </div>
    </form>
  </div>













   
</script>

<!-- 属性复选框 -->
<script type="text/html" id="batchUpdate_attrListLayer">
  {{# layui.each(d.attrList, function(index, item) { }}
    <div class="attr_check_item {{item.value}}">
      <input type="checkbox" lay-skin="primary" name="attr" title="{{item.name}}" value="{{item.value}}" lay-filter="toggleAttr">
    </div>
  {{#}) }}
</script>


<script type="text/html" id="batchUpdate_logisAttrListLayer">
  {{# layui.each(d.logisAttrList, function(index, item) { }}
    <input type="checkbox" lay-skin="primary" name="logisAttrList" title="{{item.name}}" value="{{item.name}}" />
  {{#}) }}
</script>

<script type="text/html" id="batchAdd_diffMethodLayer">
  {{# layui.each(d.diffMethodList, function(index, item) { }}
    <input type="checkbox" lay-skin="primary" name="diffMethodList" title="{{item.name}}" value="{{item.name}}">
  {{#}) }}
</script>

<script type="text/html" id="batchUpdate_subTableLayer">
  {{# layui.each(d, function(index, item) { }}
    <tr>
      <input type="hidden" refId value="{{ item.id || '' }}">
      <input type="hidden" supplierId value="{{ item.supplierId || '' }}">
      <input type="hidden" supplierDataId value="{{ item.supplierDataId || '' }}">
      <input type="hidden" url value="{{ item.purchaseUrl || '' }}">
      <td class="w70" style="position: sticky;left:0;z-index:1;background-color: #fff">
        <input type="checkbox" class="checkbox" name="selectListItem" lay-skin="primary" lay-filter="selectListItem" />
      </td>
      <td class="w70" style="position: sticky;left:71px;z-index:1;background-color: #fff">
        {{#  if(item.image){ }}
          <img width="60" height="60" src="${tplIVP}{{ item.image }}!size=60x60" imgname="" name="image" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
        {{#  } else { }}
          <img width="60" height="60" src="${ctx}/static/img/kong.png" data-onerror="layui.admin.img_noFind()"/>
        {{# } }}
      </td>
      <td name="sSkuTd" class="w120" style="position: sticky;left:142px;z-index:1;background-color: #fff">
        <input type="text" class="layui-input" readonly name="sSku" value="{{item.sSku || ''}}" onchange="changeInput(this)" />
      </td> // 商品子SKU
      <td name="styleTd" class="w150" style="position: sticky;left:262px;z-index:1;background-color: #fff">
        <input type="text" class="layui-input" name="style" value="{{item.style || '' }}" onchange="changeInput(this)" />
      </td> // 款式
      

      <td class="title_td w150">
        <input name="title" title type="text" class="layui-input" value="{{ item.title || '' }}" onchange="changeInput(this)">
      </td> // 商品名称
      <td class="isSale_td w150">
        <select name="isSale" class="table_isSaleInfo" lay-filter="table_isSaleInfo" lay-search></select>
      </td> // 销售状态
      <td class="purchaseChannel_td w150">
        <input name="purchaseChannel" purchaseChannel type="text" class="layui-input" value="{{ item.purchaseChannel || '' }}" onchange="changeInput(this)">
      </td> // 商品简称
      <td class="notSaleReason_td w150">
        <select name="notSaleReason" class="table_notSaleReasonInfo" lay-filter="table_notSaleReasonInfo" lay-search></select>
      </td> // 停售原因
      <td class="material_td w150">
        <input type="text" class="layui-input" name="material" value="{{item.material || '' }}" onchange="changeInput(this)" />
      </td> // 材质
      <td class="suttleWeight_td w150">
        <input type="text" class="layui-input" name="suttleWeight" value="{{item.suttleWeight || '' }}" onchange="changeInput(this)" />
      </td> // 商品净重
      <td class="unit_td w150">
        <select name="unit" class="table_unitInfo" lay-filter="table_unitInfo" lay-search></select>
      </td> // 单位
      <td class="packSpecification_td w150">
        <select name="packSpecification" class="table_packSpecificationInfo" style="width: 110px" lay-filter="table_packSpecificationInfo" lay-search></select>
      </td> // 包装规格
      <td class="packDesc_td w150">
        <input type="text" class="layui-input" name="packDesc" value="{{item.packDesc || '' }}" onchange="changeInput(this)" />
      </td> // 入库要求
      <td class="stockWarnCycle_td w150">
        <input type="text" class="layui-input" name="stockWarnCycle" value="{{item.stockWarnCycle || '' }}" onchange="changeInput(this)" />
      </td> // 预警周期
      <td class="buyer_td w150">
        <select name="buyer" class="table_buyerInfo" style="width: 110px" lay-filter="table_buyerInfo" lay-search></select>
      </td> // 采购员
      <td class="purchaseDlvrDays_td w150">
        <input type="text" class="layui-input" name="purchaseDlvrDays" value="{{item.purchaseDlvrDays || '' }}" onchange="changeInput(this)" />
      </td> // 定制产品到货天数
      <td class="productSize_td w180">
        <div style="display: flex">
          <input type="text" class="layui-input" name="productLength" style="width: 50px;margin-right: 10px" value="{{item.productLength || '' }}" onchange="changeInput(this)" />
          <input type="text" class="layui-input" name="productWidth" style="width: 50px;margin-right: 10px" value="{{item.productWidth || '' }}" onchange="changeInput(this)" />
          <input type="text" class="layui-input" name="productHeight" style="width: 50px" value="{{item.productHeight || '' }}" onchange="changeInput(this)" />
        </div>
      </td> // 商品长宽高
      <td class="outerBoxSize_td w180">
        <div style="display: flex">
          <input type="text" class="layui-input" name="outerBoxLength" style="width: 50px;margin-right: 10px" value="{{item.outerBoxLength || '' }}" onchange="changeInput(this)" />
          <input type="text" class="layui-input" name="outerBoxWidth" style="width: 50px;margin-right: 10px" value="{{item.outerBoxWidth || '' }}" onchange="changeInput(this)" />
          <input type="text" class="layui-input" name="outerBoxHeight" style="width: 50px" value="{{item.outerBoxHeight || '' }}" onchange="changeInput(this)" />
        </div>
      </td> // 外箱长宽高
      <td class="logisAttrList_td w150">
        <select name="logisAttrList"
          class="table_logisInfo"
          xm-select="table_logisInfo{{index}}"
          xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
          lay-filter="table_logisInfo">
        </select>
      </td> // 物流属性
      <td class="liquidNetContentMl_td w150">
        <input type="text" class="layui-input" name="liquidNetContentMl" value="{{item.liquidNetContentMl || '' }}" onchange="changeInput(this)" />
      </td> // 液体净含量



      
      <td class="applier_toggle_col w100" style="display: none">
        <div style="width:100%;position:relative">
        <input supplierName readonly placeholder="根据链接自动填充" type="text" class="layui-input supplierInfo disAbleInp" value="{{item.supplierName || ''}}">
        <ul class="supplierUl productlistSearch"></ul>
        </div>
      </td> // 供应商
      <td class="applier_toggle_col w100" style="display: none">
        <div style="display: flex;">
          <input purchaseUrl onblur="getSupplierAndClear(this)" type="text" class="layui-input supplier_purchaseurl"
          value="{{ item.purchaseUrl || ''}}" onchange="changeInput(this)">
          <div>
            <a onclick="redirectTo(this)" target="_blank" style="height: 32px;line-height: 32px; cursor:pointer">
              <i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i>
            </a>
          </div>
        </div>
      </td> // 采购url
      <td class="attrStr applier_toggle_col w150" style="display: none">
        <div style="display: flex;">
          <input attrStr readonly type="text" class="layui-input disAbleInp" onmouseleave="removeTip(this,500)" data-tipId=""
        onmouseenter="showPurchaseTable(this, 'update')" value="{{item.attrStr || ''}}" onchange="changeInput(this)"/>
        <input hidden offerId value="{{ item.offerId || '' }}"/>
        <input hidden specId value="{{ item.specId || '' }}"/>
        <input hidden articleNo value="{{ item.articleNo || '' }}"/>
        <button type="button" class="layui-btn layui-btn-normal layui-btn-xs"
         style="margin-left: 5px" onclick="toMatch1688_productlist(this, 'update')" title="匹配1688信息">匹配</button>
        </div>
      </td> // 1688 属性
      <td class="applier_toggle_col w100" style="display: none">
        <input name="minOrderNum" type="text" class="layui-input" value="{{ item.minOrderNum || '' }}" onchange="changeInput(this)">
      </td> // 最小订货量
      <td class="applier_toggle_col w100" style="display: none">
        <input quote type="text" readonly class="layui-input disAbleInp" value="{{ item.quote || '' }}" onchange="changeInput(this)">
      </td> // 供应商报价
      <td class="applier_toggle_col w100" style="display: none">
        <input purBaseNum type="text" placeholder="正数" class="layui-input" value="{{ item.purBaseNum || '' }}" onchange="changeInput(this)">
      </td> // 采购基数
      <td class="applier_toggle_col w100" style="display: none">
        <input prodPrice type="text" placeholder="正数" class="layui-input" value="{{item.prodPrice || ''}}" onchange="changeInput(this)" onblur="productlist_calSupplierQuote(this)">
      </td>  // 供应商商品报价
      <td class="applier_toggle_col w100" style="display: none">
        <input ifSupplierPack type="checkbox" class="layui-input" lay-skin="primary" {{item.ifSupplierPack ? 'checked' : ''}} value="{{ item.ifSupplierPack }}" onchange="changeInput(this)" lay-filter="productlist_supplierRefTab_ifSupplierPack">
      </td> // 供应商包装
      <td class="applier_toggle_col w100" style="display: none">
        <input supplierPackFee type="text" onblur="productlist_calSupplierQuote(this)"
          class="layui-input {{item.ifSupplierPack ? '' : 'disAbleInp'}}" {{item.ifSupplierPack ? '' : 'readonly'}}
          value="{{item.supplierPackFee != null ? item.supplierPackFee : ''}}" onchange="changeInput(this)">
      </td> // 供应商包装费用
      <td class="applier_toggle_col w100" style="display: none">
        <input stockPackFee type="text"
          class="layui-input {{item.ifSupplierPack ? ' disAbleInp' : ''}}" {{item.ifSupplierPack ? ' readonly' : ''}}
          value="{{item.supplierPackFee != null ? item.stockPackFee : ''}}" onchange="changeInput(this)">
      </td> // 仓库包装费用
      <td class="applier_toggle_col w150" style="display: none">
        <input note type="text" class="layui-input" maxlength="200" value="{{ item.note || ''}}" onchange="changeInput(this)">
      </td> // 下单备注
      <td class="applier_toggle_col w100" style="display: none">
        <button class="layui-btn layui-btn-xs layui-btn-danger" type="button" onclick="removeRow(this)">移除</button>
      </td>
    </tr>
  {{#}) }}
</script>

<%--阿里sku信息展示列表--%>
<script type="text/html" id="ali1688SkuInfoDialog">
  <div class="layui-form">
    <div>
      <div lay-filter="batchAliSkuInfoForm" id="batchAliSkuInfoForm">
        <div id="batchAli1688SkuInfoBox">
          <input type="checkbox" lay-skin="primary" id="batchAli1688SkuInfoCheck" lay-filter="batchAli1688SkuInfoCheck" title="全选">
          
        </div>
      </div>
    </div>
  </div>
</script>

<script>
  var tableUnitList = []
  var tableLogisArrList = []
  var tableSubList = []
  var requestArr = []
  var offSaleReasonsList = []
  var tablePackSpecList = []
  var tableBuyerList = []  
  let chooseData = []

  var attrList = [
    {name: '商品名称', value: 'title'},
    {name: '销售状态', value: 'isSale'},
    {name: '商品简称', value: 'purchaseChannel'},
    {name: '停售原因', value: 'notSaleReason'},
    {name: '材质', value: 'material'},
    {name: '商品净重', value: 'suttleWeight'},
    {name: '单位', value: 'unit'},
    {name: '包装规格', value: 'packSpecification'},
    {name: '入库要求', value: 'packDesc'},
    {name: '定制产品预警周期', value: 'stockWarnCycle'},
    {name: '采购员', value: 'buyer'},
    {name: '定制产品到货天数', value: 'purchaseDlvrDays'},
    {name: '商品长宽高', value: 'productSize'},
    {name: '外箱长宽高', value: 'outerBoxSize'},
    {name: '物流属性(含液体净含量)', value: 'logisAttrList'},
    {name: '液体净含量', value: 'liquidNetContentMl'},
    {name: '供应商采购信息', value: 'supplier'},
  ]

  layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate', 'element', 'upload', 'formSelects'], function() {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$,
        laydate = layui.laydate

    formSelects.render('logisAttr_productlist')
    formSelects.render('devType_productlist')
    formSelects.render('productlist_prodAttrList')
  
    form.render()
  })

  
  // 批量修改
  $('#productlist_updateListNew').click(function() {
    var checkStatus = layui.table.checkStatus('sProdTable'),
        data = checkStatus.data
    if (data.length == 0) {
        layer.msg('请至少选择1个商品')
        return
    }
    let pSku = data.map(item => item.pSku)

    pSku = Array.from(new Set(pSku))
    if (pSku?.length > 1) {
      layer.msg('请选择相同父sku的数据进行修改')
      return
    }
    // 检查是否组合品
    for (var i = 0; i < data.length; ++i) {
        if (data[i].isCombination == 1) {
            layer.msg('不可批量修改组合品')
            return
        }
    }
    //console.log(data, 'data=====')
    chooseData = data
    let popIndex = layer.open({
        title: '批量修改商品',
        type: 1, 
        area: ['100%', '100%'],
        id: 'batchUpdateProductId',
        btn: ['保存', '关闭'],
        content: $('#prodlist_batchUpdateProductLayer').html(),
        success: async function(index, layero) {
          layuiOpenPop = true

          $('#supplier_sku_table')[0].addEventListener('click', clickHandle)

          // 加载要修改的属性复选框
          renderAttrList(attrList)
          // 初始化下拉框数据
          await getProductTag()

          // 收起属性复选框
          $('#hideArrow').click(function() {
            $('#showArrow').show()
            $('#hideArrow').hide()
            $('.prod_attr_left').addClass('hideAnimation')
            $('.prod_attr_line').addClass('hideAnimation')
            $('.prod_attr_right').addClass('hideAnimation')
            $('.prod_attr_left').removeClass('showAnimation')
            $('.prod_attr_line').removeClass('showAnimation')
            $('.prod_attr_right').removeClass('showAnimation')
            // 获取收起的left
            //let leftValue = $('.prod_attr_left').css('left');
            //let rightW = $('prod_attr_right').css('width')
          })
          // 展开属性复选框
          $('#showArrow').click(function() {
            $('#hideArrow').show()
            $('#showArrow').hide()
            $('.prod_attr_left').removeClass('hideAnimation')
            $('.prod_attr_line').removeClass('hideAnimation')
            $('.prod_attr_right').removeClass('hideAnimation')
            $('.prod_attr_left').addClass('showAnimation')
            $('.prod_attr_line').addClass('showAnimation')
            $('.prod_attr_right').addClass('showAnimation')
          })

          // 要修改的属性筛选
          $('#searchAttrIcon').click(function() {
            filterAttr()
          })

          // 默认要修改的属性右侧不展示
          $('.attr_right').each((index, item) => {
            $(item).hide()
          })
          layui.form.on('checkbox(toggleAttr)', function(data){
            if (!data.elem.checked) {
              let attr = data.value.charAt(0).toUpperCase() + data.value.slice(1)
              $('#is'+ attr + 'Single').prop('checked', false)
              $('#supplier_sku_table tr').each((index, item) => {
                $(item).find('.'+ data.value + '_tr').hide()
                $(item).find('.'+ data.value + '_td').hide()
                if (data.value === 'logisAttrList') {
                  $(item).find('.liquidNetContentMl_tr').hide()
                  $(item).find('.liquidNetContentMl_td').hide()
                }
              })
            }
            $('.attr_right').each((index, item) => {
              let name = $(item).attr('name')
              if (name === data.value) {
                $(item).toggle()
                
                $('.logisAttrList_td').find('.xm-select-parent').each((index, item) => {
                  $(item)[0].addEventListener('click', function(event) {
                    var target = event.target;
                    let origin = $(target).parents('.logisAttrList_td').find('.xm-select-parent')[0]
                    var rect = origin.getBoundingClientRect();
                    var distanceFromLeft = rect.left;
                    var distanceFromBottom = window.innerHeight - rect.bottom;
                    var width = rect.width;
                    $(target).parents('.logisAttrList_td').find('dl').css({
                      'position': 'fixed',
                      'min-width': width + 'px',
                      'left': distanceFromLeft + 'px',
                      'bottom': distanceFromBottom + 40 + 'px',
                      'top': 'auto'
                    })
                  })
                })
              }
              if (data.value === 'logisAttrList' && name === 'liquidNetContentMl') {
                $('#liquidNetContentMl').toggle()
              }
            })
            if (data.value === 'supplier') {
              // 供应商信息列表显示
              // $('.supplier_info').toggle()
              $('#apply-info').toggle()
              $('#match-info').toggle()
              $('.applier_toggle_col').toggle()
            }
            layui.form.render()
          })

          $('.overflowSelect').each((index, item) => {
            $(item)[0].addEventListener('click', attrClickHandler)
          })
          // 检查是否有新增供应商权限
          if ($('#ifAddSupplier_produclist').length > 0) {
            $('.addsupplierBtn_productlist').removeClass('disN')
          }

          // 初始化自定义选择框
          initHpSelect('#updateListForm_productlist')
          
          // 供应商信息表
          supplierInfoTble(true)
          // 初始化1个供应商
          layui.form.render('select')
          layui.form.render('checkbox')
          // 包装规格选择事件
          layui.form.on('select(packspectag_updatelist)', function(data) {
          $('#updateListForm_productlist [name=packWeight]').val($('#updateListForm_productlist [name=packSpecification] option:selected').attr('weight'))
        })

          //弹出分类框
          $('#create_searchCate_btn').click(function() {
            cateLayerOpenOnlyLeaf('oa','','layer_work_develop_pl1','product_cate_tree_name', 'product_cate_tree_cateTree','product_cate_tree_cateId')
          })
          $('#isSpecialMake').val('false')
          
          // 获取物流属性      
          await getLogisAttrList()
         
          toggleTableTrTd()

          // 渲染供应商信息表格
          let renderList = []
          data?.forEach(item => {
            let originSubList = {
              image: '',
              sSku: '',
              style: '',
              supplierName: '',
              purchaseUrl: '',
              attrStr: '',
              minOrderNum: '',
              quote: '',
              purBaseNum: '',
              prodPrice: '',
              ifSupplierPack: '',
              supplierPackFee: '',
              stockPackFee: '',
              note: '',
              articleNo: '',
              specId: '',
              offerId: '',
              id: '',
              title: '',
              purchaseChannel: '',
              supplierId: '',
              supplierDataId: '',
              notSaleReason: '',
              suttleWeight: '',
              material: '',
              packDesc: '',
              stockWarnCycle: '',
              purchaseDlvrDays: '',
              productLength: '',
              productWidth: '',
              productHeight: '',
              outerBoxLength: '',
              outerBoxWidth: '',
              outerBoxHeight: '',
              liquidNetContentMl: '',
              subList: []
            }
            let supplierObj = item.supplier?.filter(v => v.ifDefault)[0] || item?.supplier[0] || []
            Object.keys(originSubList).forEach(cItem => {
              originSubList[cItem] = item[cItem] || supplierObj[cItem] || ''
              originSubList['supplierDataId'] = supplierObj['id']
              originSubList['ifSupplierPack'] = supplierObj['ifSupplierPack']
            })
            renderList.push(originSubList)
          })
          //console.log('renderList', renderList)
          let mulAttrList = []
          renderList?.forEach((item, index) => {
            if (item.subList?.length > 1) {
              let obj = {
                ifMultiple: true,
                subList: item.subList
              }
              mulAttrList.push(obj)
            } else {
              mulAttrList.push({})
            }
          }) 
          localStorage.setItem('subChooseInfo1', JSON.stringify(mulAttrList))
          layui.laytpl($("#batchUpdate_subTableLayer").html()).render(renderList, function(html){
            $('#update_skuTbale_subTbody').append(html)
            
            toggleTableList()
      
            // 列表单选下拉数据填充
            let singleSelectArr = [
              {attr: 'isSale', label: 'name', value: 'code', list: [{ name: '停售', code: false},{ name: '在售', code: true}]},
              {attr: 'notSaleReason', label: 'name', value: 'name', list: offSaleReasonsList},
              {attr: 'unit', label: 'name', value: 'name', list: tableUnitList},
              {attr: 'packSpecification', label: 'name', value: 'id', list: tablePackSpecList},
              {attr: 'buyer', label: 'userName', value: 'userName', list: tableBuyerList}
            ]
            singleSelectArr.forEach(item => {
              setTableSingleSelectData(item, data)
            })
            setTableLogisSelectData(data)
            layui.form.render()

            dropTableCol()
          });

          $('#update_skuTbale_subTbody tr').each((index, item) => {
            if (renderList[index]?.subList.length > 1) {
              $(item).find('[attrStr]').val('多属性组合')
              $(item).find('[attrStr]').css({'color': 'red'})
            }
          })

          // 供应商信息表格 复选框逻辑
          // 默认全部选中
          $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
            $(item).prop('checked', true)
          })
          $('#supplier_sku_table').find('[name=selectList]').prop('checked', true);
          
          layui.form.on('checkbox(selectAll)', function(e) {
            let isChecked = e.elem.checked
            $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
              $(item).prop('checked', isChecked);
            })
            layui.form.render()
          })

          layui.form.on('checkbox(selectListItem)', function() {
            let checkList = []
            $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
              checkList.push($(item).prop('checked'))
            })
            if (checkList.includes(false)) {
              $('#supplier_sku_table').find('[name=selectList]').prop('checked', false);
            } else {
              $('#supplier_sku_table').find('[name=selectList]').prop('checked', true);
            }
            layui.form.render()
          })
          layui.form.render()

        },
        yes: function(index, layero) {
          // 保存
          // 开始校验 
          // 非必填字段：入库要求，液体净含量(ml)，商品长宽高，销售状态
          var requireAttrList = [
            {name: '商品名称', value: 'title', type: 'input'},
            {name: '商品简称', value: 'purchaseChannel', type: 'input'},
            {name: '停售原因', value: 'notSaleReason', type: 'select'},
            {name: '材质', value: 'material', type: 'input'},
            {name: '商品净重', value: 'suttleWeight', type: 'input'},
            {name: '单位', value: 'unit', type: 'select'},
            {name: '包装规格', value: 'packSpecification', type: 'select'},
            {name: '定制产品预警周期', value: 'stockWarnCycle', type: 'input'},
            {name: '采购员', value: 'buyer', type: 'select'},
            {name: '定制产品到货天数', value: 'purchaseDlvrDays', type: 'input'},
            {name: '外箱长宽高', value: 'outerBoxSize', type: 'mulInput'},
            {name: '物流属性', value: 'logisAttrList', type: 'mulSelect'},
            {name: '供应商采购信息', value: 'supplier', type: 'input'},
          ]

          requireAttrList.map(item => item.value).forEach(item => {
            let attr = item.charAt(0).toUpperCase() + item.slice(1)
            let str = 'is' + attr + 'Single'
            if (!$('#' + str).prop('checked')) {
              $('#' + str).parents('.attr_right').find('.requireAttr').attr('notNull', true)
            } else {
              $('#' + str).parents('.attr_right').find('.requireAttr').removeAttr('notNull')
            }
          })
          // 校验属性部门必填项
          if (!checkNotNull('#batchUpdateProduct')) {
            return false
          }
          // 校验外箱长宽高
          // 长宽高必须大于0
          if (!$('#isOuterBoxSizeSingle').prop('checked') && $('#outerBoxSize').is(":visible")) {
            let outerBoxLength = $('#outerBoxSize').find('[name=outerBoxLength]').val()
            let outerBoxWidth = $('#outerBoxSize').find('[name=outerBoxWidth]').val()
            let outerBoxHeight = $('#outerBoxSize').find('[name=outerBoxHeight]').val()
            if (!outerBoxLength || !outerBoxWidth || !outerBoxHeight || outerBoxLength <= 0 || outerBoxWidth <= 0 || outerBoxHeight <= 0) {
              layer.msg('请填写外箱长宽高且商品长宽高需大于0')
              return false
            }
          }
        
          if (!$('#isLogisAttrListSingle').prop('checked') && $('#logisContent').is(":visible")) {
            let logisAttrList = []
            $('#batchUpdateProduct').find('input[name=\'logisAttrList\']:checked').each(function() {
              logisAttrList.push(this.value)
            })  
            let liquidNetContentMl = $('#batchUpdateProduct').find('input[name=\'liquidNetContentMl\']').val()
            // 当物流属性勾选 液体（0-15ml）或者液体> 15ml
            // 同时没有勾选液体净含量的单独 液体净含量必填
            if ((logisAttrList.indexOf('液体(0-15ml)') > -1 || logisAttrList.indexOf('液体(>15ml)') > -1) && !$('#isLiquidSingle').prop('checked')) {
              if (liquidNetContentMl === '' || liquidNetContentMl === undefined) {
                layer.msg('请填写液体净含量(ml)')
                return false
              }
              if (!/^[1-9]\d*$/.test(liquidNetContentMl)) {
                layer.msg('液体净含量(ml)必须是大于0的整数')
                return false
              }
            }
          }

          let isEmpty = false
          // 校验供应商表格部分必填项
          $('#update_skuTbale_subTbody tr').each(function(index, item) {
            if ($('#apply-info').is(":visible")) { 
              // 当勾选了供应商采购信息时
              // 校验 供应商 采购URL 供应商报价 采购基数 供应商商品报价 字段
              let suppliername = $(item).find('[suppliername]').val() || ''
              if (!suppliername) {
                isEmpty = true
                layer.msg('请选择表格第' + (index + 1) + '行的供应商')
                return false
              }
              let purchaseurl = $(item).find('[purchaseurl]').val() || ''
              if (!purchaseurl) {
                isEmpty = true
                layer.msg('请选择表格第' + (index + 1) + '行的采购URL')
                return false
              }
              let quote = $(item).find('[quote]').val() || ''
              if (!quote && quote != '0') {
                isEmpty = true
                layer.msg('请选择表格第' + (index + 1) + '行的供应商报价')
                return false
              }
              let purbasenum = $(item).find('[purbasenum]').val() || ''
              if (!purbasenum && purbasenum != '0') {
                isEmpty = true
                layer.msg('请选择表格第' + (index + 1) + '行的采购基数')
                return false
              }
              let prodprice = $(item).find('[prodprice]').val() || ''
              if (!prodprice && prodprice != '0') {
                isEmpty = true
                layer.msg('请选择表格第' + (index + 1) + '行的供应商商品报价')
                return false
              }

              let attrStrDom = $(item).find('[attrstr]')
              let isPack = $(item).find('[ifSupplierPack]').prop('checked')
              let packFee = $(item).find('[supplierpackfee]').val()

              if ($(attrStrDom).val() == '多属性组合' && !isPack) {
                  // 没有勾选供应商包装    
                  isEmpty = true
                  layer.msg('多属性组合商品，请勾选'  + (index + 1) + '行的供应商包装')
                  return false
              }
              if ($(attrStrDom).val() == '多属性组合' && packFee === '') {
                  // 没有勾选供应商包装    
                  isEmpty = true
                  layer.msg('请填写' + (index + 1) + '行的供应商包装费用')
                  return false
              }
            }

            // 当勾选了 单独修改 时，校验表格中新增的列必填
            requireAttrList?.forEach(item => {
              let attr = item.value.charAt(0).toUpperCase() + item.value.slice(1)
              let str = 'is' + attr + 'Single'
              let isCheckedSingle = $('#' + str).prop('checked')
              if (!isEmpty && isCheckedSingle) {
                let td = $('.'+ item.value + '_td')
                if (item.type == 'input') {
                  let val = $(td).find('input').val() || ''
                  if (!val) {
                    isEmpty = true
                    layer.msg('请填写表格第' + (index + 1) + '行的' + item.name)
                  }
                }
                if (item.type == 'select') {
                  let val = $(td).find('select').val() || ''
                  if (!val) {
                    isEmpty = true
                    layer.msg('请选择表格第' + (index + 1) + '行的' + item.name)
                  }
                }
                if (item.type == 'mulSelect') { // 物流属性
                  let val = $(td).find('[name=' + item.value + ']').val() || ''
                  if (!val) {
                    isEmpty = true
                    layer.msg('请选择表格第' + (index + 1) + '行的' + item.name)
                  }
                  let liquidNetContentMl = $('.liquidNetContentMl_td').find('input[name=\'liquidNetContentMl\']').val()
                  // 当物流属性勾选 液体（0-15ml）或者液体> 15ml
                  // 同时没有勾选液体净含量的单独 液体净含量必填
                  if ((val.indexOf('液体(0-15ml)') > -1 || val.indexOf('液体(>15ml)') > -1)) {
                    if (liquidNetContentMl === '' || liquidNetContentMl === undefined) {
                      isEmpty = true
                      layer.msg('请填写液体净含量(ml)')
                      return false
                    }
                    if (!/^[1-9]\d*$/.test(liquidNetContentMl)) {
                      isEmpty = true
                      layer.msg('液体净含量(ml)必须是大于0的整数')
                    }
                  }
                }
                if (item.type === 'mulInput') { // 外箱长宽高
                  let outerBoxLength = $(td).find('[name=outerBoxLength]').val()
                  let outerBoxWidth = $(td).find('[name=outerBoxWidth]').val()
                  let outerBoxHeight = $(td).find('[name=outerBoxHeight]').val()
                  if (!outerBoxLength || !outerBoxWidth || !outerBoxHeight || outerBoxLength <= 0 || outerBoxWidth <= 0 || outerBoxHeight <= 0) {
                    isEmpty = true
                    layer.msg('请填写表格第' + (index + 1) + '行的外箱长宽高且商品长宽高需大于0')
                  }
                }
              }
            })
          })
          
          if(isEmpty) return false

          downloadUrlToFile()
          Promise.allSettled(requestArr).then(res => {
            loading.show()
            let params = handleSaveParams()
              $.ajax({
                type: "post",
                url: ctx + "/product/batchUpdateProd",
                dataType: "json",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(params),
                success: function(res) {
                  loading.hide()
                  if (res.code === '0000') {
                    layer.msg('批量修改成功', {icon: 7, backgroundColor: 'green'})
                    removeClick()
                    layer.close(popIndex)
                    $('#pl_searchBtn').trigger('click')
                  } else {
                    layer.msg(res.msg)
                  }
                },
                error: function() {
                  loading.hide()
                  layer.msg('发送请求失败')
                }
              })
          })
          
        },
        cancel: function() {
          removeClick()
        },
        end: function() {
          layuiOpenPop = false
        }
    })
  })

  function removeClick() {
    $('.overflowSelect').each((index, item) => {
      $(item)[0].removeEventListener('click', attrClickHandler)
    })
    $('#supplier_sku_table')[0].removeEventListener('click', clickHandle)

  }

  function clickHandle(event) {
    //console.log('click')
    var target = event.target;
    if (target instanceof HTMLInputElement) {
        var rect = target.getBoundingClientRect();
        var distanceFromLeft = rect.left;
        var distanceFromBottom = window.innerHeight - rect.bottom;
        var width = rect.width;
        $(target).parent().next('dl').css({
          'position': 'fixed',
          'min-width': width + 'px',
          'left': distanceFromLeft + 'px',
          'bottom': distanceFromBottom + 40 + 'px',
          'top': 'auto'
        })
    }
  }

  function attrClickHandler(event) {
    var target = event.target;
    var rect = target.getBoundingClientRect();
    var distanceFromLeft = rect.left;
    var distanceFromTop = rect.top;
    var width = rect.width;
    $(target).parent().next('dl').css({
      'position': 'fixed',
      'min-width': width + 'px',
      'left': distanceFromLeft + 'px',
      'top': distanceFromTop + 40 + 'px',
      'bottom': 'auto'
    })
  }

  function toggleTableTrTd() {
     // 勾选单独后 列表中动态添加隐藏列
     attrList.map(item => item.value).forEach(item => {
      let attr = item.charAt(0).toUpperCase() + item.slice(1)
      let str = 'is' + attr + 'Single'
      layui.form.on(`checkbox(`+ str +`)`, function(data){
        // 单独修改
        if (data.elem.checked) {
          $('.' + item + '_tr').show()
          $('.' + item + '_td').show()
          if (item === 'logisAttrList') {
            $('.liquidNetContentMl_tr').show()
            $('.liquidNetContentMl_td').show()
            $('#logisContent').find('.redStar').hide()
            //console.log('fdsafdsf', $('.table_logisInfo').next())
            //$('.table_logisInfo').next()[0].on('click', function() { 
            //  console.log('fdsfdsafsfdsaf')
            //})
          }
          $('#' + str).parents('.requireAttr').find('.redStar').hide()
        } else {
          $('.' + item + '_td').hide()
          //$('.material_td input').val('')
          $('.' + item + '_tr').hide()
          if (item === 'logisAttrList') {
            $('.liquidNetContentMl_tr').hide()
            $('.liquidNetContentMl_td').hide()
            $('#logisContent').find('.redStar').show()
          }
          $('#' + str).parents('.requireAttr').find('.redStar').show()
        }
      })
     })

     
  }

  // 筛选要修改属性
  function filterAttr() {
    let inputVal = $('#updateProdInputSearch').val().trim()
    let resArr = attrList.filter(item => {
      return item.name.indexOf(inputVal) > -1
    })
    //renderAttrList(resArr)
    let data = { attrList: resArr.filter(item => item.name !== '液体净含量') }
    $('.attr_check_item').hide()
    data.attrList?.forEach(item => {
      $('#attrListLeft .'+ item.value).show()
    })
  }

  // 渲染要修改的属性
  function renderAttrList(arr) {
    let data = { attrList: arr.filter(item => item.name !== '液体净含量') }
    layui.laytpl($("#batchUpdate_attrListLayer").html()).render(data, function(html){
      $('#attrListLeft').html(html)
      layui.form.render()
    });
  }

  function toggleTableList() {
    // 根据单独勾选 确认列表表头
    attrList.map(item => item.value).forEach(item => {
      let attr = item.charAt(0).toUpperCase() + item.slice(1)
      let str = 'is' + attr + 'Single'

      if ($('#' + str).prop('checked')) {
        $('.' + item + '_tr').show()
        $('.' + item + '_td').show()
        // 把之前填写的清空
        //$('.' + item + '_td input').val('')
      } else {
        $('.' + item + '_td').hide()
        $('.' + item + '_tr').hide()
      }
     })
  }

  /***供应商信息表的增删 */
  function supplierInfoTble(ifList) {
    // 监听采购url是否变更 offerId
    $('#supplier_sku_table tbody').on('blur', '.supplier_purchaseurl', function () {
        let self = this
        // 获取当前行的匹配情况
        let offerId = $(self).closest('tr').find('[offerId]').val()
        if (!offerId) {
            return
        }
        let url = self.value
        let curOfferId = getOfferIdByPurchaseUrl(url)
        // 若更换了链接，清空匹配信息
        if (curOfferId !== offerId) {
          clearMatch_productlist(self)
        }
    });
  }

  function getOfferIdByPurchaseUrl(purchaseUrl) {
    if (!purchaseUrl) {
        return ''
    }
    if (purchaseUrl.indexOf('https://detail.1688.com/offer/') > -1) {
        return purchaseUrl.substring(purchaseUrl.indexOf('offer/') + 6, purchaseUrl.indexOf('.html'))
    } else if (purchaseUrl.indexOf('https://detail.tmall.com/item.htm') > -1 || purchaseUrl.indexOf('https://item.taobao.com/item.htm') > -1) {  
      return getParamMapFromUrl(purchaseUrl)['id']
    }
  }

  // 处理要保存的数据格式
  function handleSaveParams (type = '') {
    let logisAttrList = []
    $('#batchUpdateProduct').find('input[name=\'logisAttrList\']:checked').each(function() {
      logisAttrList.push(this.value)
    })
    let infoObj = serializeObject($('#batchUpdateProduct'))
    
    Object.keys(infoObj).forEach(v => {
      if (!$('#batchUpdateProduct').find('[name=' + v + ']').is(":visible")) {
        delete infoObj[v]
      }
    })
    // 是否移除原有供应商
    if ($('[name=removeOldSupplier]').prop('checked')) {
      infoObj.removeOldSupplier = true
    } else {
      infoObj.removeOldSupplier = false
    }
    infoObj.idList = chooseData.map(item => item.id)
    let subChooseInfo = JSON.parse(localStorage.getItem('subChooseInfo1')) || {}

    let detailList = []
    $('#update_skuTbale_subTbody tr').each(function(index, item) {
      let multiSubList = []
      let defaultSupplier = {
        id: $(item).find('[supplierDataId]').val() || '',
        supplierId: $(item).find('[supplierId]').val() || '',
        purchaseUrl: $(item).find('[purchaseUrl]').val() || '',
        minOrderNum: $(item).find('[name=minOrderNum]').val(),
        quote: $(item).find('[quote]').val() || '',
        prodPrice: $(item).find('[prodPrice]').val() || '',
        note: $(item).find('[note]').val() || '',
        articleNo: $(item).find('[articleNo]').val() || '',
        offerId: $(item).find('[offerId]').val() || '',
        specId: $(item).find('[specId]').val() || '',
        attrStr: $(item).find('[attrStr]').val() || '',
        purBaseNum: $(item).find('[purBaseNum]').val() || '',
        ifSupplierPack: $(item).find('[ifSupplierPack]').prop('checked') ? true : false,
        supplierPackFee: $(item).find('[supplierPackFee]').val(),
        stockPackFee: $(item).find('[stockPackFee]').val(),
        supplier: $(item).find('[supplierName]').val() || '',
        ...subChooseInfo[index]
      }

      let buyerId
      //console.log('tableBuyerList', tableBuyerList,$(item).find('[name=buyer]').val())
      tableBuyerList?.forEach(v => {
        if (v.userName === $(item).find('[name=buyer]').val()) {
          buyerId = v.id
        }
      })
      let isSale = $(item).find('[name=isSale]').val()

      let arr = ['title', 'notSaleReason', 'purchaseDlvrDays', 'purchaseChannel', 'buyer', 'logisAttrList', 'material', 'unit', 'stockWarnCycle',
      'suttleWeight', 'packSpecification', 'outerBoxLength', 'outerBoxWidth', 'outerBoxHeight', 'note']
      let detailObj= {
        id: $(item).find('[refId]').val() || '',
        sSku: $(item).find('[name=sSku]').val() || '',
        style: $(item).find('[name=style]').val()
      }

      arr.forEach(v => {
        if ($(item).find('.' + v + '_td').is(':visible')) {
          detailObj[v] = $(item).find('[name=' + v +']').val()
        }
        if ($(item).find('.buyer_td').is(':visible')) {
          detailObj.buyerId = buyerId
        }
      })

      if ($('#apply-info').is(":visible")) {
        detailObj.defaultSupplier = defaultSupplier
      }
      if ($('#isProductSizeSingle').prop('checked')) {
        detailObj.productLength = $(item).find('[name=productLength]').val() || ''
        detailObj.productWidth = $(item).find('[name=productWidth]').val() || ''
        detailObj.productHeight = $(item).find('[name=productHeight]').val() || ''
      }
      if ($('#isOuterBoxSizeSingle').prop('checked')) {
        detailObj.outerBoxLength = $(item).find('[name=outerBoxLength]').val() || ''
        detailObj.outerBoxWidth = $(item).find('[name=outerBoxWidth]').val() || ''
        detailObj.outerBoxHeight = $(item).find('[name=outerBoxHeight]').val() || ''
      }
      if ($('#isIsSaleSingle').prop('checked')) {
        detailObj.isSale = (isSale === '' || isSale === undefined) ? '' : isSale
      }
      if ($('#isPackDescSingle').prop('checked')) {
        detailObj.packDesc = $(item).find('[name=packDesc]').val() || ''
      }
      if ($('#isLogisAttrListSingle').prop('checked')) {
        detailObj.liquidNetContentMl = $(item).find('[name=liquidNetContentMl]').val() || ''
      }
      detailList.push(detailObj)
    })

    let params = {
      ...infoObj,
      detailList
    }
    //console.log('params', params)
    return params
  }

  // 单选下拉数据填充
  function setTableSingleSelectData(data, arr = []) {
    let selectStr = '<option value="">请选择</option>'
    data.list?.forEach(item => {
      selectStr += '<option value="' + item[data.value] + '" :select"'+ item[data.value]+ '">' + item[data.label] + '</option>'
    })
    if (data.list?.length > 0) {
      $('.' + data.attr + '_td').each(function(index, item) {
        if (arr.length) {
          let attrSelect = arr[index][data.attr]
          selectStr = selectStr.replace(':select"' + attrSelect + '"', 'selected')
        }
        $(item).find('.table_' + data.attr + 'Info').append(selectStr)
      }) 
    }
  }

  function setTableLogisSelectData(arr = []) {
    let logisSelectStr = ''
    tableLogisArrList?.forEach(item => {
      logisSelectStr += '<option value="' + item.name + '">' + item.name + '</option>'
    })
    $('.logisAttrList_td').each(function(index, item) {
      $(item).find('.table_logisInfo').append(logisSelectStr)
      layui.formSelects.render('table_logisInfo' + index)
    })
    if (arr.length) {
      $('.logisAttrList_td').each(function(index, item) {
        let xmSelect = $(item).find('.table_logisInfo').attr('xm-select')
        layui.formSelects.value(xmSelect, arr[index].logisAttrList?.split(','))
      })  
    }
  }

  // 移除sku
  function removeRow(obj) {
    $(obj).parents('tr').remove();
  }

  // 获取单位 规格
  // 停售原因
  function getProductTag() {
    return new Promise((resolve, reject) => {
      let ajax = new Ajax(false)
      ajax.post({
        url: ctx + '/product/getProductlistConfig',
        success: function (res) {
          if (res.code === '0000') {
            let prodTags = res.data.prodTags || []
            let unitList = tableUnitList = res.data.unitList || []
            let packSpecList = tablePackSpecList = res.data.packSpecList || []
            let buyerList = tableBuyerList = res.data.buyers || []
            let bizzOwnersList = res.data.bizzOwners || []
            let responsorList = res.data.responsorList || []

            let offSaleReasons = offSaleReasonsList = res.data.offSaleReasons || []
            commonRenderSelect('notSaleReasonInfo', offSaleReasons, {
              name: 'name',
              code: 'name'
            });

            appendSelect($('#batchUpdateProduct').find('select[name="bizzOwner"]'), bizzOwnersList, 'id', 'userName')
            appendSelect($('#batchUpdateProduct').find('select[name="responsor"]'), responsorList, 'id', 'userName')
  
            commonRenderSelect('unitInfo', unitList, {
              name: 'name',
              code: 'name'
            });
            commonRenderSelect('buyer', buyerList, {
              name: 'userName',
              code: 'userName'
            });
  
            let packSpecStr = '<option value="">请选择</option>'
            packSpecList?.forEach(item => {
              packSpecStr += '<option value="' + item.id + '" weight="' + item.weight + '" >' + item.name + '</option>'
            })
            $('#packSpec').append(packSpecStr)
  
            // 包装规格 isDefault true
            let defaultPackSpec = packSpecList.find(item => item.ifDefault === true)
            let defaulSpecId = defaultPackSpec?.id || ''
            // 默认包装规格 气泡袋11cm*13cm
            $('#packSpec').val(defaulSpecId)
  
            appendSelect($('#batchUpdateProduct').find('select[name="prodAttrList1"]'), prodTags, 'name', 'name')
            layui.formSelects.render('prodAttrList1')
  
            layui.form.render()

            resolve()
          }
        },
        error: function() {
          reject('服务器异常')
        }
      })
    })
  }
  // 获取物流属性
  function getLogisAttrList () {
    return new Promise((resolve, reject) => {
      var layer = layui.layer,
        laytpl = layui.laytpl;
        let ajax = new Ajax(false)
        ajax.post({
          url: ctx + '/enum/getLogisAttrEnum.html',
          success: function (res) {
            if (res.code === '0000') {
              let data = {
                logisAttrList: res.data
              }
              tableLogisArrList = res.data || []
              laytpl($("#batchUpdate_logisAttrListLayer").html()).render(data, function(html){
                  $('#logisAttrList1').html(html)
                });
              layui.form.render()
            } else {
              layer.msg('初始化物流属性失败:' + res.msg)
            }
            resolve()
          }, error: function() {
            reject('服务器异常')
          }
        })
    })
    }

  // 将url转为file
  function downloadUrlToFile() {
    requestArr = []
    $('#update_skuTbale_subTbody tr').each(function(index, item) {
      let url = $(item).find('[name=image]').attr('src') || ''
      if (url?.indexOf('cbu01.alicdn.com/img/ibank') > -1) {
        const fileName = 'image.jpg'; // 文件名
        requestArr.push(new Promise((resolve, reject) => {
          loading.show()
          urlToFile(url, fileName).then(file => {
            getUrlByFile(file, $(item), resolve)
          }).catch(err => {
            reject('图片转换文件失败')
          })
        }))
      }
    })
  }

  function getUrlByFile(file, self, resolve) {
    loading.show()
    let formData = new FormData()
    formData.append('file', file)
    $.ajax({
      url: ctx + '/product/uploadImgByFile',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(res) {
        let imgUrl = res.data || '';
        $(self).find('[name=image]').attr('imgname', imgUrl)
        resolve()
      },
      error: function(err) {
        console.log(err)
      }
    })
  }

  // 匹配
function handleMulMatchTable(type) {
    let checkList = []
    let checkedData = []
    $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
      checkList.push($(item).prop('checked'))
      if ($(item).prop('checked')) {
        // 选中的数据
        let id = $(item).parents('tr').find('[refId]').val()
        let arr = chooseData.filter(item => item.id == id)
        checkedData = checkedData.concat(arr)
      }
    })
    if (!checkList.includes(true)) {
      return layer.msg('请选勾选要匹配的数据')
    }
    var supplierList = []
    for (var i = 0; i < checkedData.length; ++i) {
      if (checkedData[i].isCombination == 1) {
          layer.msg('请不要选择组合品')
          return
      }
      supplierList = supplierList.concat(checkedData[i].supplier)
    }
    supplierList = supplierList.filter(item => item.ifDefault)
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/product/get1688InfoForList.html',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(supplierList),
        success: function(res) {
            loading.hide()
            if (res.code === '0000') {
              showMatchListTable(checkedData, res.data, type)
            } else {
                layer.msg(res.msg)
            }
        },
        error: function() {
            loading.hide()
            layer.msg('服务出错了，请联系软件开发部解决问题')
        }
    })
  }

  // 展现需匹配的供应商ref
  function showMatchListTable(data, matchData, type) { // data是checkedData
    // 封装数据
    let supplierList = []
    let supplier, subSupplierRefList, j
    for (var i = 0; i < data.length; ++i) {
        subSupplierRefList = data[i].supplier?.filter(item => item.ifDefault)
        let obj = subSupplierRefList[0]
       // for (j = 0; j < subSupplierRefList.length; ++j) {
        //}
        let style
        $('#update_skuTbale_subTbody tr').each((index, item) => {
          if (index === i) {
            style = $(item).find('[name=style]').val()
          }
        })
        supplier = {
            id: obj.id,
            prodId: data[i].id,
            supplierId: obj.supplierId,
            supplierName: obj.supplierName,
            sSku: data[i].sSku,
            style: style,
            purchaseUrl: obj.purchaseUrl,
            offerId: getOfferIdByPurchaseUrl(obj.purchaseUrl),
            specId: obj.specId,
            attrStr: obj.attrStr,
            articleNo: obj.articleNo,
        }
        supplierList.push(supplier)
    }
    // 保存全局数据 以便后续调用
    Ali1688ProdInfoMatchData = matchData
    toUpdateSupplierRefList = supplierList
    if (type === '1') {
      toAutoMatch1688Info(false)
    }
    if (type === '2') {
      toAutoMatch1688Info(false, true)
    }
}


 /**
  * 批量匹配
  * @param ifLike 是否模糊匹配
  * @param ifForce 是否强制匹配
  */
  function toAutoMatch1688Info(ifLike, ifForce) {
    loop1: for (var i = 0; i < toUpdateSupplierRefList.length; ++i) {
        // 根据offerId 获取可匹配的1688信息列表
        let syncList = Ali1688ProdInfoMatchData[toUpdateSupplierRefList[i].offerId]
            // 如果不是强制匹配，且当前行已经有属性信息  或者无可匹配的数据。则略过
        if (!ifForce && (toUpdateSupplierRefList[i].attrStr || !syncList || syncList.length == 0)) {
            continue
        }
        loop2: for (var j = 0; j < syncList.length; ++j) {
            let syncInfoMatched = syncList[j]
            // 如果非模糊匹配，则要求商品的款式 === 1688信息的属性
            if (!ifLike && toUpdateSupplierRefList[i].style == syncInfoMatched.attrStr) {
                toUpdateSupplierRefList[i].offerId = syncInfoMatched.offerId
                toUpdateSupplierRefList[i].specId = syncInfoMatched.specId
                toUpdateSupplierRefList[i].attrStr = syncInfoMatched.attrStr
                toUpdateSupplierRefList[i].minOrderNum = syncInfoMatched.minOrderQuantity                       
                toUpdateSupplierRefList[i].articleNo = syncInfoMatched.articleNo
                continue loop1
            } else if (ifLike) {
                // 如果是模糊匹配， 则用 “-” 分割1688信息的属性。 逐一判断 商品的款式中是否包含 这些属性值。 只要有1个不包含，则判定匹配不上
                let attrStrList = syncInfoMatched.attrStr.split('-')
                for (let k = 0; k < attrStrList.length; ++k) {
                    if (toUpdateSupplierRefList[i].style.indexOf(attrStrList[k]) < 0) {
                        continue loop2
                    }
                }
                toUpdateSupplierRefList[i].offerId = syncInfoMatched.offerId
                toUpdateSupplierRefList[i].specId = syncInfoMatched.specId
                toUpdateSupplierRefList[i].attrStr = syncInfoMatched.attrStr
                toUpdateSupplierRefList[i].minOrderNum = syncInfoMatched.minOrderQuantity
                toUpdateSupplierRefList[i].articleNo = syncInfoMatched.articleNo
                continue loop1
            }
        }
      }
      $('#update_skuTbale_subTbody tr').each(function(index, item) {
        toUpdateSupplierRefList?.forEach(cItem => {
          if ($(item).find('[supplierdataid]').val() == cItem.id) {
            $(item).find('[attrstr]').val(cItem.attrStr)
            $(item).find('[articleNo]').val(cItem.articleNo)
            $(item).find('[specId]').val(cItem.specId)
          }
        })
    })
      loading.hide()
  }

  function clearMAatch1688Info() {
    let checkList = []
    let checkedDataId = []
    $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
      checkList.push($(item).prop('checked'))
      if ($(item).prop('checked')) {
        // 选中的数据
        let id = $(item).parents('tr').find('[refId]').val()
        checkedDataId.push(id)
      }
    })

    chooseData?.forEach(item => {
      if (checkedDataId.includes(String(item.id))) {
        item.supplier?.forEach(cItem => {
          if (cItem.ifDefault) {
            cItem.attrStr = ''
            cItem.specId = ''
            cItem.articleNo = ''
          }
        })
      }
    })
    let subChooseInfo1 = JSON.parse(localStorage.getItem('subChooseInfo1'))
    $('#update_skuTbale_subTbody tr').each((index, item) => {
      if ($(item).find('[name=selectListItem]').prop('checked')) {
        subChooseInfo1[index] = {}
        $(item).find('[attrStr]').css({'color': 'black'})
      }
    })
    localStorage.setItem('subChooseInfo1', JSON.stringify(subChooseInfo1))
    if (!checkList.includes(true)) {
      return layer.msg('请选勾选要清空匹配信息的数据')
    }
    $('#update_skuTbale_subTbody tr').each(function(index, item) {
      if ($(item).find('[name=selectListItem]').prop('checked')) {
        $(item).find('[attrstr]').val('')
        $(item).find('[specId]').val('')
        $(item).find('[articleNo]').val('')
      }
    })
    layui.form.render()
}

  // 采购链接onblur
  function getSupplierAndClear(self) {
    getSupplierInfo(self)
    // 清空供应商的一些数据
    // 最小订货量，供应商报价，采购基数，供应商商品报价，1688属性，下单备注
    // 如果原先是供应商包装的，需要再移除供应商包装和供应商包装费用
    let tr = $(self).parents('tr')
    let url = $(tr).find('[url]').val()
    let purchaseUrl = $(self).val()
    if ((purchaseUrl && url !== purchaseUrl)) {
      $(tr).find('[name=minOrderNum]').val('')
      $(tr).find('[quote]').val('')
      $(tr).find('[purBaseNum]').val('')
      $(tr).find('[prodPrice]').val('')
      $(tr).find('[attrstr]').val('')
      $(tr).find('[note]').val('')
      if ($(tr).find('[ifsupplierpack]').prop('checked')) {
        $(tr).find('[ifsupplierpack]').prop('checked', false)
        // 供应商包装false 供应商包装费用disabled
        $(tr).find('[supplierpackfee]').val('')
        $(tr).find('[supplierpackfee]').attr('readonly', true)
        $(tr).find('[supplierpackfee]').addClass('disAbleInp')
      }
      layui.form.render()
    }
  }

  // 批量应用
  function handleMulSetTable() {
    let checkList = []
    $('#update_skuTbale_subTbody .checkbox').each((index, item) => {
      checkList.push($(item).prop('checked'))
    })
    if (!checkList.includes(true)) {
      return layer.msg('请选勾选要批量应用的数据')
    }
    $('#update_skuTbale_subTbody tr').each(function(index, item) {
      let isChecked = $(item).find('[name=selectListItem]').prop('checked')
      if (isChecked) {
        let purchaseUrl = $('#updateListForm_productlist').find('[name=purchaseUrl]').val() || ''
        purchaseUrl && $(item).find('[purchaseUrl]').attr('value', purchaseUrl)
        let url = $(item).find('[url]').val()
        if ((purchaseUrl && url !== purchaseUrl)) {
          getSupplierInfo($(item).find('[purchaseUrl]'))
          // 清空最小订货量等数据
          $(item).find('[name=minOrderNum]').val('')
          $(item).find('[prodprice]').val('')
          $(item).find('[purBaseNum]').val('')
          $(item).find('[prodPrice]').val('')
          $(item).find('[attrstr]').val('')
          $(item).find('[note]').val('')
          if ($(item).find('[ifsupplierpack]').prop('checked')) {
            $(item).find('[ifsupplierpack]').prop('checked', false)
            // 供应商包装false 供应商包装费用disabled
            $(item).find('[supplierpackfee]').val('')
            $(item).find('[supplierpackfee]').attr('readonly', true)
            $(item).find('[supplierpackfee]').addClass('disAbleInp')
            $(item).find('[stockpackfee]').attr('readonly', false)
            $(item).find('[stockpackfee]').removeClass('disAbleInp')
          }
        }
        let ifSupplier = $('#updateListForm_productlist').find('[name="ifSupplierPackOfDefaultOnline"]').val()
        if (ifSupplier !== '' && ifSupplier !== undefined) {
          if (JSON.parse(ifSupplier)) {
            $(item).find('[stockpackfee]').attr('readonly', true)
            $(item).find('[stockpackfee]').addClass('disAbleInp')
            $(item).find('[stockpackfee]').val('')
            $(item).find('[supplierpackfee]').attr('readonly', false)
            $(item).find('[supplierpackfee]').removeClass('disAbleInp')
          } else {
            $(item).find('[stockpackfee]').attr('readonly', false)
            $(item).find('[stockpackfee]').removeClass('disAbleInp')
            $(item).find('[supplierpackfee]').attr('readonly', true)
            $(item).find('[supplierpackfee]').addClass('disAbleInp')
            $(item).find('[supplierpackfee]').val('')
          } 
          $(item).find('[ifSupplierPack]').prop('checked', JSON.parse(ifSupplier))
        }
        
        let minOrderNum = $('#updateListForm_productlist').find('[name="minOrderNum"]').val()
        if (minOrderNum !== '' && minOrderNum !== undefined) {
          $(item).find('[name=minOrderNum]').val(minOrderNum)
        }
        let purBaseNum = $('#updateListForm_productlist').find('[name="purBaseNum"]').val()
        if(purBaseNum !== '' && purBaseNum !== undefined) {
          $(item).find('[purBaseNum]').val(purBaseNum)
        }
        let prodprice = $('#updateListForm_productlist').find('[name="prodprice"]').val()
        if (prodprice !== '' && prodprice !== undefined) {
           $(item).find('[prodprice]').val(prodprice)
        }
        let supplierPackFee = $('#updateListForm_productlist').find('[name="supplierpackfee"]').val()
        if (supplierPackFee !== '' && supplierPackFee !== undefined) {
          $(item).find('[supplierPackFee]').val(supplierPackFee)
        }
        let stockPackFee = $('#updateListForm_productlist').find('[name="stockPackFeeOfDefaultOnline"]').val()
        if (stockPackFee !== '' && stockPackFee !== undefined) {
          $(item).find('[stockPackFee]').val(stockPackFee)
        }
        let note = $('#updateListForm_productlist').find('[name="note"]').val() || ''
        if (note !== '') {
          $(item).find('[note]').val(note)
        }
        updateCalSupplierQuote($(item))
      }
      
      layui.form.render()
    })
  }

  function updateCalSupplierQuote(tr) {
    // 当前行供应商包装费input
    let supplierPackFeeInp = tr.find('[supplierPackFee]').val().trim()
    // 当前行供应商商品报价
    let prodPrice = tr.find('[prodPrice]').val().trim()
    let quote = accAdd(supplierPackFeeInp || 0, prodPrice || 0)
    tr.find('[quote]').val(quote)
  }

  function changeInput(obj) {
    $(obj).attr("value",$(obj).val())
  }


  function dropTableCol() {
    var table = document.getElementById('sku_dropTable');
    var resizableCols = table.getElementsByTagName('th');
    var minWidth = 70; // 列最小宽度

    for (var i = 0; i < resizableCols.length; i++) {
      resizableCols[i].addEventListener('mousedown', function(e) {
        var col = this;
        var colIndex = Array.prototype.indexOf.call(col.parentNode.children, col);
        var startX = e.pageX;
        var startWidth = col.offsetWidth;

        function onMouseMove(e) {
          var width = startWidth + (e.pageX - startX);
          if (width >= minWidth) {
            col.style.width = width + 'px';
            for (var j = 0; j < table.rows.length; j++) {
              table.rows[j].cells[colIndex].style.width = width + 'px';
            }
          }
        }

        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          $('#update_skuTbale_subTbody td.logisAttrList_td').find('.xm-select-label').css({
            'left': 0
          });
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  }

</script>