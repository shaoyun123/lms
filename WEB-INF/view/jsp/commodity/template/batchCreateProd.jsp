<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<style>
  #batchCreate_init .layui-form-select {
    width: 120px;
  }
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
  .resizer {
    position: absolute;
    right: 0;
    top: 0;
    width: 5px;
    height: 100%;
    cursor: col-resize;
    user-select: none;
}
</style>
<script type="text/html" id="prodlist_batchCreateProductLayer">
  <form class="layui-form" action="" lay-filter="component-form-group" id="batchCreateProduct"
    autocomplete="off" onsubmit="return false;">
    <div style="padding: 20px 0 10px; border-bottom: 1px solid #eee">
      <div class="layui-form-item">
        <div class="layui-col-md6 layui-col-lg6" notNull>
            <label class="layui-form-label"><span style="color: red">*</span>采购链接</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="purchaseUrl" value="">
            </div>
        </div>
        <div class="layui-col-lg1 layui-col-md1">
          <button class="layui-btn layui-btn-sm" style="margin-left: 20px" type="button" onclick="getPskuDetailByLink()">获取</button>
        </div>

        <div class="layui-col-lg3 layui-col-md3" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>供应商</label>
            <div class="layui-input-block" hp-select>
                <input type="text" class="layui-input" name="supplier" id="batchSupplier">
                <input type="hidden" class="layui-input" name="supplierId" >
                <ul hp-select-optionContain id="supplierUl" class="supplierUl productlistSearch"></ul>
            </div>
        </div>
        
        <div class="layui-col-lg1 layui-col-md1">
          <button class="layui-btn layui-btn-sm" style="margin-left: 20px" type="button" onclick="addSupplier()">新增供应商</button>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md2 layui-col-lg2" notNull>
            <label class="layui-form-label"><span style="color: red">*</span>商品父SKU</label>
            <div class="layui-input-inline" style="width: 150px">
                <input type="text" class="layui-input" style="width: 150px" name="pSku" id="batchPSku"
                onfocus="savePSkuVal(this)" onblur="changePSku(this)">
            </div>
        </div>

        <div class="layui-col-lg2 layui-col-md2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>开发专员</label>
            <div class="layui-input-block">
                <select name="bizzOwner" id="bizzOwner" lay-filter="bizzOwner" lay-search>
                </select>
            </div>
        </div>
        <div class="layui-col-lg2 layui-col-md2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>责任人</label>
            <div class="layui-input-block">
              <select name="responsor" id="responsor" lay-filter="responsor" lay-search>
              </select>
            </div>
        </div>
        <div class="layui-col-lg1 layui-col-md1">
          <label class="layui-form-label">特殊包装</label>
          <input id="isSpecialPack_prod" type="checkbox" title="" lay-skin="primary">
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <label class="layui-form-label">特殊包装备注</label>
          <div class="layui-input-block">
              <input type="text" class="layui-input" id="specialPackDesc">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">商品标签</label>
            <div class="layui-input-block">
              <select name="prodAttrList1" xm-select="prodAttrList1" id="prodAttr1"
                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                lay-filter='batchCreate_prodAttrList'>
              </select>
            </div>
        </div>

        <div class="layui-col-lg6 layui-col-md6">
          <label class="layui-form-label">英文标题</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="enTitle" >
            </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-lg2 layui-col-md2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>新类目</label>
          <div class="layui-input-block">
              <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                  id="create_searchCate_btn">选择分类
              </button>
              <input type="hidden" name="cateId" value="" id="product_cate_tree_cateId">
              <input type="hidden" value="" id="product_cate_tree_cateTree"/>
              <i class="layui-icon layui-icon-delete"
                  onclick="clearCate('product_cate_tree_name','product_cate_tree_cateId')"
                  style="cursor:pointer" title="删除产品类目"></i>
              <span class="layui-btn layui-btn-sm layui-btn-primary" onclick="searchCate()">
                <i class="layui-icon layui-icon-search"></i>
              </span>
          </div>
        </div>
        <div class="layui-col-md8">
          <label class="layui-form-label"></label>
            <div class="layui-input-block">
              <span id="product_cate_tree_name" style="line-height: 32px;"></span>
            </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md6 layui-col-lg6" notNull>
          <label class="layui-form-label" style="width: 85px"><span style="color: red">*</span>产品区分方式</label>
          <div class="layui-input-block" id="diffMethodList">
          </div>
        </div>
        <div class="layui-col-md4 layui-col-lg4">
          <label class="layui-form-label">区分方式备注</label>
          <div class="layui-input-block">
              <input class="layui-input" name="productDiffMethodNote" lay-skin="primary"
              onmouseenter="$(this).val() ? showTip($(this).val(),this) : () => {}"
              onmouseleave="removeTip(this)">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md6 layui-col-lg6" notNull>
          <label class="layui-form-label" style="width: 85px"><span style="color: red">*</span>按父SKU同步尺寸和重量</label>
          <div class="layui-input-block">
            <input type="radio" name="ifSycSizeWeight" value="true" title="是">
            <input type="radio" name="ifSycSizeWeight" value="false" title="否">
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 20px 0 10px; border-bottom: 1px solid #eee">
      <div class="layui-form-item">
        <div class="layui-col-md6 layui-col-lg6" notNull>
            <label class="layui-form-label"><span style="color: red">*</span>商品名称</label>
            <div class="layui-input-inline" style="width: 55%;">
                <input type="text" class="layui-input" name="title">
            </div>
        </div>
        <div class="layui-col-md3 layui-col-lg3" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>商品简称</label>
          <div class="layui-input-block">
              <input type="text" class="layui-input" name="purchaseChannel">
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">入库要求</label>
          <div class="layui-input-block">
              <input type="text" class="layui-input" name="packDesc">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-lg2 layui-col-md2" style="display: flex;justify-content: space-around;" id="materialContent">
          <div style="display: flex;">
            <label class="layui-form-label"><span style="color: red">*</span>材质</label>
            <div class="layui-input-inline" style="width: 120px" >
              <input type="text" class="layui-input" name="material1">
            </div>
            <div class="layui-input-inline" style="width: 80px;">
              <input id="isMaterialSingle" type="checkbox" title="单独" lay-skin="primary" lay-filter="isMaterialSingle">
            </div>
          </div>
        </div>
        <div class="layui-col-lg2 layui-col-md2" notNull>
          <div>
            <label class="layui-form-label"><span style="color: red">*</span>是否定制</label>
            <div class="layui-input-block">
              <select name="isSpecialMake" id="isSpecialMake" lay-search>
                <option value="">请选择</option>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-col-lg2 layui-col-md2" id="unitContent">
          <div style="display: flex;justify-content: flex-start;">
            <label class="layui-form-label"><span style="color: red">*</span>单位</label>
            <div class="layui-input-inline" id="batchCreate_init" style="width: 120px;">
              <select name="unit" id="unitInfo" lay-filter="unit" lay-search></select>
            </div>
            <div class="layui-input-inline" style="width: 85px;">
              <input id="isUnitSingle" type="checkbox" title="单独" lay-skin="primary" lay-filter="isUnitSingle">
            </div>
          </div>
        </div>
        
        <div class="layui-col-lg3 layui-col-md3" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>包装规格</label>
          <div class="layui-input-block">
            <select name="packSpecification" id="packSpec" lay-search></select>
          </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <label class="layui-form-label">商品长宽高(cm)</label>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
            <input type="text" class="layui-input" name="productLength">
          </div>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
            <input type="text" class="layui-input" name="productWidth">
          </div>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;" >
            <input type="text" class="layui-input" name="productHeight">
          </div>
        </div>
      </div>
      <div class="layui-form-item" style="display: flex;">
        <div style="width: 15px; padding-left: 40px">
          <input id="isLogisArrSingle" type="checkbox"
            lay-skin="primary" lay-filter="isLogisArrSingle">
        </div>
        <div class="layui-col-md11 layui-col-lg11" id="logisContent">
          <label class="layui-form-label"><span style="color: red">*</span>物流属性</label>
          <div class="layui-input-block" id="logisAttrList">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md3 layui-col-lg3">
          <label class="layui-form-label">液体净含量(ml)</label>
          <div class="layui-input-inline">
            <input type="text" class="layui-input" name="liquidNetContentMl">
          </div>
          <div class="layui-input-inline" style="width: 80px;">
            <input id="isLiquidSingle" type="checkbox" title="单独" lay-skin="primary" lay-filter="isLiquidSingle">
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-col-md2 layui-col-lg2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>采购员</label>
          <div class="layui-input-block">
            <select name="buyer" id="buyer" style="width: 110px" lay-filter="buyer" lay-search></select>
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>默认发货库</label>
          <div class="layui-input-block">
            <select name="defaultDlvrWh" id="defaultDlvrWhId" style="width: 110px" lay-filter="defaultDlvrWhId" lay-search></select>
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2" notNull>
          <label class="layui-form-label"><span style="color: red">*</span>起批量</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="minOrderQuantity">
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">供应商包装费(￥)</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="supplierPackFee">
          </div>
        </div>
        <div class="layui-col-md3 layui-col-lg3">
          <label class="layui-form-label">下单备注</label>
          <div class="layui-input-inline">
            <input type="text" class="layui-input" name="purNote">
          </div>
          <div class="layui-input-inline" style="width: 80px;">
            <input id="isRemarkSingle" type="checkbox" title="单独" lay-skin="primary" lay-filter="isRemarkSingle">
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 20px 0 10px; border-bottom: 1px solid #eee">
      <div class="layui-form-item">
        <div class="layui-col-md2 layui-col-lg2">
          <button class="layui-btn layui-btn-sm" style="margin-left: 20px" type="button" onclick="addSkuByNum()">数字递增</button>
          <button class="layui-btn layui-btn-sm" type="button" onclick="addSkuByEng()">字母递增</button>
          <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" onclick="removeSkuByAdd()">移除递增</button>
        </div>
        <div class="layui-col-md1 layui-col-lg1">
          <label class="layui-form-label" style="font-weight: bold;float:right">批量设置</label>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">商品净重(g)</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="multiWeight">
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">外箱长宽高(cm)</label>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;">
            <input type="text" class="layui-input" name="multiLength">
          </div>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;">
            <input type="text" class="layui-input" name="multiWidth">
          </div>
          <div class="layui-input-inline" style="width: 60px;margin-right: 5px;">
            <input type="text" class="layui-input" name="multiHeight">
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">供应商报价(￥)</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="multiPrice">
          </div>
        </div>
        <div class="layui-col-md2 layui-col-lg2">
          <label class="layui-form-label">采购基数</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="multiPurchase">
          </div>
        </div>
        <div class="layui-col-md1 layui-col-lg1">
          <button class="layui-btn layui-btn-sm" style="margin-left: 20px" type="button" onclick="handleMulSet()">批量应用</button>
        </div>
      </div>
    </div>
    <!-- 子sku表格 -->
    <div id="sku_table">
      <table class="layui-table">
        <thead>
        <tr>
            <th width="80">图片<div class="resizer"></div></th>
            <th><span style="color: red">*</span>商品子SKU<div class="resizer"></div></th>
            <th><span style="color: red">*</span>款式<div class="resizer"></div></th>
            <th><span style="color: red">*</span>商品净重(g)<div class="resizer"></div></th>
            <th><span style="color: red">*</span>外箱长宽高(cm)<div class="resizer"></div></th>
            <th><span style="color: red">*</span>供应商报价(￥)<div class="resizer"></div></th>
            <th>货号<div class="resizer"></div></th>
            <th><span style="color: red">*</span>采购基数<div class="resizer"></div></th>
            <th>1688属性<div class="resizer"></div></th>
            <th class="hidden logisAttrList_tr">物流属性<div class="resizer"></div></th>
            <th class="hidden liquid_tr">液体净含量(ml)<div class="resizer"></div></th>
            <th class="hidden material_tr">材质<div class="resizer"></div></th>
            <th class="hidden unit_tr">单位<div class="resizer"></div></th>
            <th class="hidden remark_tr">下单备注<div class="resizer"></div></th>
            <th>操作<div class="resizer"></div></th>
        </tr>
        </thead>
        <tbody id="skuTbale_subTbody">
        </tbody>
      </table>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md2 layui-col-md-offset10">
        <div style="display: flex;justify-content: flex-end;padding-right: 20px">
          <input type="text" class="layui-input" id="addRowCount" style="width: 80px;" placeholder="输入行数">
          <button class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left: 20px" type="button" onclick="addTableRow(this)">新增N行</button>
        </div>
      </div>
    </div>
  </form>
</script>
<script type="text/html" id="batchAdd_logisAttrListLayer">
  {{# layui.each(d.logisAttrList, function(index, item) { }}
    <input type="checkbox" lay-skin="primary" name="logisAttrList" title="{{item.name}}" value="{{item.name}}">
  {{#}) }}
</script>

<script type="text/html" id="batchAdd_diffMethodLayer">
  {{# layui.each(d.diffMethodList, function(index, item) { }}
    <input type="checkbox" lay-skin="primary" name="diffMethodList" title="{{item.name}}" value="{{item.name}}">
  {{#}) }}
</script>

<script type="text/html" id="batchAdd_subTableLayer">
  {{# layui.each(d, function(index, item) { }}
    <tr>
      <td>
        {{#  if(item.image){ }}
          <img width="60" height="60" src="{{ item.image }}" imgname="" name="image" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
        {{#  } else { }}
          <img width="60" height="60" src="${ctx}/static/img/kong.png" data-onerror="layui.admin.img_noFind()"/>
        {{# } }}
      </td>
      <td name="sSkuTd">
        <input type="text" class="layui-input" name="sSku" value="{{item.sSku || ''}}" onchange="changeSSku1(this)" />
      </td> // 商品子SKU
      <td name="styleTd">
        <input type="text" class="layui-input" name="style" value="{{item.style || '' }}" />
      </td>
      <td name="suttleWeightTd">
        <input type="text" class="layui-input" name="suttleWeight" value="{{item.suttleWeight || '' }}" />
      </td> // 商品净重
      <td width="180">
        <div style="display: flex">
          <input type="text" class="layui-input" name="outerBoxLength" style="width: 50px;margin-right: 10px" value="{{item.outerBoxLength || '' }}" />
          <input type="text" class="layui-input" name="outerBoxWidth" style="width: 50px;margin-right: 10px" value="{{item.outerBoxWidth || '' }}" />
          <input type="text" class="layui-input" name="outerBoxHeight" style="width: 50px" value="{{item.outerBoxHeight || '' }}" />
        </div>
      </td> // 外箱长宽高
      <td name="priceTd">
        <input type="text" class="layui-input" name="prodPrice" value="{{item.prodPrice || '' }}" />
      </td> // 供应商报价
      <td name="articleNoTd">
        <input type="text" class="layui-input" name="articleNo" value="{{item.articleNo || '' }}" />
      </td> // 货号
      <td name="purBaseNumTd">
        <input type="text" class="layui-input" name="purBaseNum" value="{{item.purBaseNum || '' }}" />
      </td> // 采购基数
      <td width="150">
        <span name="attrStr" >{{item.attrStr || '' }}</span>
      </td>
      <td class="logisAttrList_td">
        <select name="logisAttrList"
          class="table_logisInfo"
          xm-select="table_logisInfo{{index + tableLength}}"
          xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
          lay-filter="table_logisInfo"
        >
        </select>
      </td> // 物流属性
      <td class="liquid_td">
        <input type="text" class="layui-input" name="liquidNetContentMl" value="{{item.prodSInfoExtends?.liquidNetContentMl || '' }}" />
      </td> // 液体净含量
      <td class="material_td">
        <input type="text" class="layui-input" name="material" value="{{item.material || '' }}" />
      </td> // 材质
      <td class="unit_td">
        <select name="unit" class="table_unitInfo" style="width: 110px" lay-filter="table_unitInfo" lay-search></select>
      </td> // 单位
      <td class="remark_td">
        <input type="text" class="layui-input" name="purNote" value="{{item.purNote || '' }}" />
      </td> // 下单备注
      <td class="hidden">
        <input name="offerId" value="{{ item.offerId || '' }}" />
        <input name="specId" value="{{ item.specId || '' }}" />
      </td>
      <td>
        <button class="layui-btn layui-btn-xs layui-btn-danger" type="button" onclick="removeCreateRow(this)">移除</button>
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

<script type="text/html" id="batchAli1688SkuInfoList">
  <div id="aliSkuInfo">
    {{# layui.each(d, function(index, item) { }}
      <div class="skuInfoItem">
        <div>
          <span class="fontBold">{{ item.attrStr }}</span>
        </div>
        <div style="margin: 5px 0">
          <span>采购价(￥): <span>{{ item.purchaseCostPrice }}</span></span>
          <span style="padding-left: 20px">可售数量: <span>{{ item.amountOnSale }}</span></span>
        </div>
        <div class="img-content">
          <input type="checkbox" lay-skin="primary" name="skuCheck"
            style="{{item.style}}" image="{{item.image}}" attrStr="{{item.attrStr}}"
            offerId="{{item.offerId}}" specId="{{item.specId}}" articleNo="{{ item.articleNo}}">
          {{#  if(item.image){ }}
          <img src="{{item.image}}" class="pointHand img_show_hide lazy" onclick="setChooseCheck(this)" />
          {{#  } else { }}
          <img src="${ctx}/static/img/kong.png" class="pointHand img_show_hide lazy" data-onerror="layui.admin.img_noFind()" onclick="setChooseCheck(this)"/>
          {{# } }}
        </div>
      </div>
    {{#}) }}
    <div style="width: 16%;"></div>
    <div style="width: 16%;"></div>
    <div style="width: 16%;"></div>
    <div style="width: 16%;"></div>
  </div>
</script>


<script>
  var tableUnitList = []
  var tableLogisArrList = []
  var tableSubList = []
  var requestArrCreate = []
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
  // 批量创建
  $('#productlist_batchAddProduct').click(function() {
    var popIndex = layer.open({
        title: '批量创建',
        type: 1, 
        area: ['100%', '100%'],
        id: 'batchCreateProductId',
        btn: ['保存', '保存草稿', '关闭'],
        content: $('#prodlist_batchCreateProductLayer').html(),
        success: async function(layero) {
          layuiOpenPop = true
          //弹出分类框
          $('#create_searchCate_btn').click(function() {
            cateLayerOpenOnlyLeaf('oa','','layer_work_develop_pl1','product_cate_tree_name', 'product_cate_tree_cateTree','product_cate_tree_cateId')
          })
          $('#isSpecialMake').val('false')

          // 弹框底边栏样式
          let $target = layero.find('.layui-layer-btn.layui-layer-btn-')
          let $html = `<button class="layui-btn layui-btn-sm layui-btn-normal" style="position: absolute;left: 30px;margin-top: 5px" id="addNewSsku">保存并继续新增子SKU</button>`
          $($target).append($html)
          // 无需采样
          $('#addNewSsku').on('click', function() {
            handleSaveFn('addSsku')
          })

          // 开发专员 责任人初始化数据
          // 获取商品标签
          await getCreateProductTag()

          // 获取产品区分方式数据
          getDiffMethod()
          
          // 获取物流属性
          getCreateLogisAttrList()
          
          layui.form.on('checkbox(isMaterialSingle)', function(data){
            // 材质单独
            if (data.elem.checked) {
              $('.material_tr').show()
              $('.material_td').show()
            } else {
              $('.material_td').hide()
              $('.material_td input').val('')
              $('.material_tr').hide()
            }
          })
          layui.form.on('checkbox(isUnitSingle)', function(data){
            // 单位单独
            if (data.elem.checked) {
              $('.unit_tr').show()
              $('.unit_td').show()
              setTableUnitSelectData('base')
            } else {
              $('.unit_tr').hide()
              $('.unit_td input').val('')
              $('.unit_td').hide()
            }
            layui.form.render()
          })
          // 液体净含量单独
          layui.form.on('checkbox(isLiquidSingle)', function(data){
            if (data.elem.checked) {
              $('.liquid_tr').show()
              $('.liquid_td').show()
            } else {
              $('.liquid_tr').hide()
              $('.liquid_td input').val('')
              $('.liquid_td').hide()
            }
            layui.form.render()
          })
          layui.form.on('checkbox(isLogisArrSingle)', function(data){
            // 物流属性单独
            if (data.elem.checked) {
              $('.logisAttrList_tr').show()
              $('.logisAttrList_td').show()
              setTableLogisSelectDataCreate('base')
            } else {
              $('.logisAttrList_tr').hide()
              $('.logisAttrList_td').hide()
              $('.logisAttrList_td input').val('')
              
            }
            layui.form.render()
          })

          layui.form.on('checkbox(isRemarkSingle)', function(data){
            // 下单备注单独
            if (data.elem.checked) {
              $('.remark_tr').show()
              $('.remark_td').show()
            } else {
              $('.remark_tr').hide()
              $('.remark_td').hide()
            }
            layui.form.render()
          })
          
          // 监听供应商input获取焦点事件
          $('#batchCreateProduct').on('focus input propertychange', '#batchSupplier', function () {
            batchSearchSupplier(this)
          })
          
          let batchCreate_initData = JSON.parse(window.localStorage.getItem('batchCreate_initData'))
          if(batchCreate_initData && batchCreate_initData.length != 0){
              let Confirmindex = layer.confirm('存在草稿，是否恢复草稿数据', { btn: ['使用草稿','清除草稿记录','仅关闭'] }, function() {
                initBatchCreateData(batchCreate_initData)
                layer.close(Confirmindex)
              }, function() {
                window.localStorage.removeItem('batchCreate_initData')
              })
          }
          createDropTbale()
        },
        yes: function(index, layero) {
          handleSaveFn()
        },
        btn2: function(index, layero) {
          // 存草稿
          let params = handleSaveParams1('save')
          window.localStorage.setItem('batchCreate_initData',JSON.stringify(params))
          layer.msg('存草稿成功')
          return false
        },
        end: function() {
          layuiOpenPop = false
        }
    })
  })

  function createDropTbale() {
    var table = document.getElementById('sku_table');
    var resizableCols = table.getElementsByTagName('th');
    var minWidth = 40; // 列最小宽度

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
            for (var j = 0; j < table.rows?.length; j++) {
              table.rows[j].cells[colIndex].style.width = width + 'px';
            }
          }
        }

        function onMouseUp() {
          // 刷新一下物流属性多选
          $('#skuTbale_subTbody tr').each(function(index, item) {
            let dom = $('.logisAttrList_td').find('.table_logisInfo')[index]
            let xmSelect = $(dom).attr('xm-select')
            layui.formSelects.value(xmSelect, layui.formSelects.value(xmSelect, 'name'))
          }) 
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  }

  // 匹配数字或英文字母
  function checkLastChar(str) {
    var pattern = /[a-zA-Z0-9]$/;
    return pattern.test(str);
  }

  // 搜索供应商
  function batchSearchSupplier(t) {
    var that = t
    if (!that.value) {
        return
    }
    $.ajax({
        url: ctx + '/prodSupplier/searchSupplier.html',
        type: 'post',
        data: { name: $(t).val() },
        success: function(data) {
          $('#supplierUl').empty()
            //字符串拼接
            var suppliers = ''
            for (var i = 0; i < data.length; i++) {
                var supplieri = data[i].supplier;
                let id = data[i].id
                let provideidentification = (data[i].provideIdentification == true) ? "是" : data[i].provideIdentification == false ? "否" : ""
                let ifdivision = (data[i].ifDivision == true) ? "是" : data[i].ifDivision == false ? "否" : ""
                let str = '<li supplierId="' + id + '" class="dimResultDivItem" data-provideidentification="' + provideidentification + '" data-ifdivision="' + ifdivision + '">' + supplieri + '</li>'
                suppliers += str;
            }
            var ul = $('#supplierUl');
            ul.empty();
            ul.append(suppliers);
            console.log('suppliers', suppliers)

            //样式设置
            ul.css('display', 'block');
            var lis = $('#supplierUl').find('li');
            lis.mouseover(function () {
                $(this).css({ background: '#009688', color: '#fff' });
            });
            lis.mouseout(function () {
                $(this).css({ background: '', color: '' })
            });
            //li的点击事件
            lis.click(function () {
                let provideIdentification = $(this).attr('data-provideidentification');
                let ifDivision = $(this).attr('data-ifdivision');
                $(that).val($(this).text());
                $(that).closest('tr').find('[supplierId]').val($(this).attr('supplierId'))
                $('#batchCreateProduct').find('[name=supplierId]').val($(this).attr('supplierId'))
                $(that).closest('tr').find('.provideidentification').text(provideIdentification);
                $(that).closest('tr').find('.ifDivision').text(ifDivision);
                ul.css('display', 'none')
            });
            //判断input是否为空
            if ($(that).val() == '') {
                $(that).next('ul').empty();
                $(that).closest('tr').find('.ifDivision').text('');
                $(that).closest('tr').find('.provideidentification').text('');
            }
        }
    })
  }

  // 保存并继续新增子SKU
  function addNewSskuFn() {
    // 清空采购链接和供应商
    $('#batchCreateProduct').find('[name=purchaseUrl]').val('')
    $('#batchCreateProduct').find('[name=supplier]').val('')
    $('#batchCreateProduct').find('[name=supplierId]').val('')
    // 将现在子 SKU 行置灰 不允许修改
    $('#skuTbale_subTbody tr').each(function(index, item) {
      $(item).css({
        'background': '#f2f2f2'
      })
      $(item).attr('isdisabled', true)
      $(item).find('input').each((index, cItem) => {
        $(cItem).prop('disabled', true)
      })
      $(item).find('button').each((index, cItem) => {
        $(cItem).prop('disabled', true)
      })
      $(item).find('select').each((index, cItem) => {
        $(cItem).prop('disabled', true)
      })
      $(item).find('.table_logisInfo').each((index, cItem) => {
        let xmSelect = $(item).find('.table_logisInfo').attr('xm-select')
        // let val = $(item).find('[name=logisAttrList]').val()
        // layui.formSelects.render(xmSelect, {
        //   init: val?.split(',') || []
        // }).disabled()
        layui.formSelects.disabled(xmSelect)
      }) 
      layui.form.render('select')
    })
  }

  // 保存
  function handleSaveFn(type='save') {
    // 保存
    if (!$('#isLogisArrSingle').prop('checked')) {
      $('#logisContent').attr('notNull', true)
    } else {
      $('#logisContent').removeAttr('notNull')
    }
    if (!$('#isUnitSingle').prop('checked')) {
      $('#unitContent').attr('notNull', true)
    } else {
      $('#unitContent').removeAttr('notNull')
    }
    if (!$('#isMaterialSingle').prop('checked')) {
      $('#materialContent').attr('notNull', true)
    } else {
      $('#materialContent').removeAttr('notNull')
    }
    // 校验必填项
    if (!checkNotNull('#batchCreateProduct')) {
      return false
    }

    let ifSycSizeWeight = $('#batchCreateProduct').find('[name=ifSycSizeWeight]:checked').val()
    if (ifSycSizeWeight === undefined) {
        layer.msg('请选择按父SKU同步尺寸和重量')
        return
    }

    // 长宽高必须大于0
    let productLength = $('#batchCreateProduct').find('[name=productLength]').val()
    let productWidth = $('#batchCreateProduct').find('[name=productWidth]').val()
    let productHeight = $('#batchCreateProduct').find('[name=productHeight]').val()
    if ((productLength && productLength <= 0) || 
    (productWidth && productWidth <= 0) || 
    (productHeight && productHeight <= 0) || 
    (productLength && !isNumber(productLength))||
    (productWidth && !isNumber(productWidth)) ||
    (productHeight && !isNumber(productHeight))) {
      layer.msg('商品长宽高需大于0')
      return false
    }
    let sskuLength = $('#skuTbale_subTbody tr').length || 0
    if (sskuLength < 1) {
      layer.msg('请添加商品子SKU')
      return false
    }
    let isEmpty = false
    $('#skuTbale_subTbody tr').each(function(index, item) {
      let sSku = $(item).find('[name=sSku]').val() || ''
      let suttleWeight = $(item).find('[name=suttleWeight]').val() || ''
      let outerBoxLength = $(item).find('[name=outerBoxLength]').val() || ''
      let outerBoxWidth = $(item).find('[name=outerBoxWidth]').val() || ''
      let outerBoxHeight = $(item).find('[name=outerBoxHeight]').val() || ''
      let prodPrice = $(item).find('[name=prodPrice]').val() || ''
      let purBaseNum = $(item).find('[name=purBaseNum]').val() || ''
      let logisAttrItemVal = $(item).find('[name=logisAttrList]').val() || ''
      let materialItemVal = $(item).find('[name=material]').val() || ''
      let unitItemVal = $(item).find('[name=unit]').val() || ''
      let liquidItemVal = $(item).find('[name=liquidNetContentMl]').val() || ''

      let isdisabled = $(item).attr('isdisabled')

      // 如果物流属性 单独 勾选，那么列表中物流属性必填
      if ($('#isLogisArrSingle').prop('checked') && !logisAttrItemVal && !isdisabled) {
        isEmpty = true
        layer.msg('请选择表格第' + (index + 1) + '行的物流属性')
        return false
      }
      if ($('#isLiquidSingle').prop('checked') && !liquidItemVal && logisAttrItemVal.indexOf('液体') !== -1 && !isdisabled){
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的液体净含量')
        return false
      }
      if (liquidItemVal && !/^[1-9]\d*$/.test(liquidItemVal) && !isdisabled) {
        isEmpty = true
        layer.msg('表格第' + (index + 1) + '行的液体净含量(ml)必须是大于0的整数')
        return false
      }
      if ($('#isMaterialSingle').prop('checked') && !materialItemVal && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的材质')
        return false
      }
      if ($('#isUnitSingle').prop('checked') && !unitItemVal && !isdisabled) {
        isEmpty = true
        layer.msg('请选择表格第' + (index + 1) + '行的单位')
        return false
      }
      if (!sSku && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的商品子SKU')
        return false
      }
      if (!suttleWeight && suttleWeight != '0' && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的商品净重')
        return false
      }
      if ((!outerBoxLength || !outerBoxWidth || !outerBoxHeight) && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的外箱长宽高')
        return false
      }
      if (!prodPrice && prodPrice != '0' && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的供应商报价')
        return false
      }
      if (!purBaseNum && purBaseNum != '0' && !isdisabled) {
        isEmpty = true
        layer.msg('请填写表格第' + (index + 1) + '行的采购基数')
        return false
      }
      // 子sku的最后一个字符只允许是数字或英文字母
      if (!checkLastChar(sSku) && !isdisabled) {
        isEmpty = true
        layer.msg('子sku的最后一个字符只能是数字或英文字母')
        return false
      }
      // 长宽高必须大于0
      if ((outerBoxLength <= 0 || outerBoxWidth <= 0 || outerBoxHeight <= 0 || !isNumber(outerBoxLength) || !isNumber(outerBoxWidth) || !isNumber(outerBoxHeight)) && !isdisabled) {
        isEmpty = true
        layer.msg('表格第' + (index + 1) + '行的外箱长宽高需大于0')
        return false
      }
    })
    let logisAttrList = []
    $('#batchCreateProduct').find('input[name=\'logisAttrList\']:checked').each(function() {
      logisAttrList.push(this.value)
    })  
    let liquidNetContentMl = $('#batchCreateProduct').find('input[name=\'liquidNetContentMl\']').val()
    // 当物流属性勾选 液体（0-15ml）或者液体> 15ml
    // 同时没有勾选液体净含量的单独 液体净含量必填
    if ((logisAttrList.indexOf('液体(0-15ml)') > -1 || logisAttrList.indexOf('液体(>15ml)') > -1) && !$('#isLiquidSingle').prop('checked')) {
      if (liquidNetContentMl === '' || liquidNetContentMl === undefined) {
        isEmpty = true
        layer.msg('请填写液体净含量(ml)')
        return false
      }
      if (!/^[1-9]\d*$/.test(liquidNetContentMl)) {
        isEmpty = true
        layer.msg('液体净含量(ml)必须是大于0的整数')
        return false
      }
    }
    if(isEmpty) return false
    downloadUrlToFile1()
    Promise.allSettled(requestArrCreate).then(res => {
      let params = handleSaveParams1()
      if (params.subList?.length === 0) {
        return layer.msg('请新增子SKU')
      }
      loading.show()

        $.ajax({
          type: "post",
          url: ctx + "/product/batchAddByPurchaseUrl",
          dataType: "json",
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(params),
          success: function(res) {
            loading.hide()
            if (res.code === '0000') {
              layer.msg('批量创建成功', {icon: 7, backgroundColor: 'green'})
              if (type === 'save') {
                layer.closeAll()
                $('#pl_searchBtn').trigger('click')
              }
              if (type === 'addSsku') {
                addNewSskuFn()
              }
            } else {
              layer.msg(res.msg)
              //addNewSskuFn()
            }
          },
          error: function() {
            loading.hide()
            layer.msg('发送请求失败')
          }
        })
    })

  }

  function savePSkuVal(self) {
    localStorage.setItem('batchCreatePSku', $(self).val() || '')
  }

  function changePSku(self) {
    let prePSku = localStorage.getItem('batchCreatePSku')
    let currentPSku = $(self).val() || ''
    if (currentPSku !== prePSku) {
      if (currentPSku == '') {
        layer.msg('请输入父sku')
        return
      }
      localStorage.setItem('batchCreatePSku', $(self).val() || '')
      // 更新渲染父sku信息
      $.ajax({
        type: 'post',
        url: ctx + '/product/getPProd.html',
        dataType: 'json',
        async: true,
        data: JSON.stringify({ 'pSku': currentPSku }),
        contentType: 'application/json',
        success: function(returnData) {
          if (returnData.code === '0000') {
            let obj = returnData.data
            batchCreateSetPskuInfo(obj)
          } else {
            if (returnData.msg?.indexOf('父sku不存在')) {
              layer.msg('这是个全新的父sku')
            } else {
              layer.msg(returnData.msg, {
                icon: 2
              });
            }
            // 清空父sku
            batchCreateSetPskuInfo()
          }
        }
      })
    }
  }

  function batchCreateSetPskuInfo(obj = {}) {
    $('#bizzOwner').val(obj.bizzOwnerId || '')
    $('#responsor').val(obj.responsorId || '')
    $('#isSpecialPack_prod').prop('checked', obj?.isSpecialPack || false)
    $('#specialPackDesc').val(obj.specialPackDesc || '')
    layui.formSelects.render('prodAttrList1')
    layui.formSelects.value('prodAttrList1', obj.prodAttrList?.split(',') || []);  
    $('#batchCreateProduct').find('[name=enTitle]').val(obj.enTitle || '')
    
    $('#product_cate_tree_cateId').val(obj?.prodPInfoCateOaDTO?.cateOaId || '')
    $('#product_cate_tree_cateTree').val(obj?.prodPInfoCateOaDTO?.cateName || '')
    $('#product_cate_tree_name').text(obj?.prodPInfoCateOaDTO?.cateTreeName || '')
    if (JSON.stringify(obj) === '{}') {
      $('#batchCreateProduct').find('[name=ifSycSizeWeight]').prop("checked", false)
    } else {
      $('#batchCreateProduct').find('[name=ifSycSizeWeight][value=' + obj?.ifSycSizeWeight + ']').prop("checked", true)
    }

    $('#diffMethodList input')?.each((index, item) => {
      $(item).prop('checked', false)
    })
    let productDiffMethod = obj?.productDiffMethod?.split(',') || []
    for (var i = 0; i < productDiffMethod?.length; i++) {
      var checkAttr = $('#diffMethodList input[value=\'' + productDiffMethod[i] + '\']')
      checkAttr.prop('checked', true)
    }
    $('#batchCreateProduct').find('[name=productDiffMethodNote]').val(obj?.productDiffMethodNote || '')

    layui.form.render('checkbox')
    layui.form.render('select')
    layui.form.render('radio')
  }

  function initBatchCreateData(data) {
    // 回显草稿箱数据
    $('#batchCreateProduct').find('[name=purchaseUrl]').val(data.purchaseUrl || '')
    $('#batchCreateProduct').find('[name=supplier]').val(data.prodSupplier.supplier || '')
    $('#batchCreateProduct').find('[name=supplierId]').val(data.prodSupplier.id || '')
    $('#batchCreateProduct').find('[name=enTitle]').val(data.prodPInfoDto?.enTitle || '')
    $('#batchPSku').val(data.prodPInfoDto?.pSku || '')
    $('#bizzOwner').val(data.prodPInfoDto?.bizzOwnerId || '')
    $('#responsor').val(data.prodPInfoDto?.responsorId || '')
    $('#isSpecialPack_prod').prop('checked', data.prodPInfoDto?.isSpecialPack)
    $('#specialPackDesc').val(data.prodPInfoDto?.specialPackDesc || '')
    $('#product_cate_tree_cateId').val(data.prodPInfoDto?.prodPInfoCateOaDTO.cateOaId || '')
    $('#product_cate_tree_cateTree').val(data.prodPInfoDto?.prodPInfoCateOaDTO.cateName || '')
    $('#product_cate_tree_name').text(data.prodPInfoDto?.prodPInfoCateOaDTO.cateTreeName || '')
    $('#batchCreateProduct').find('[name=ifSycSizeWeight][value=' + data.prodPInfoDto?.ifSycSizeWeight + ']').attr("checked", true)

    $('#batchCreateProduct').find('[name=title]').val(data.title || '')
    $('#batchCreateProduct').find('[name=purchaseChannel]').val(data.purchaseChannel || '')
    $('#batchCreateProduct').find('[name=packDesc]').val(data.packDesc || '')
    $('#batchCreateProduct').find('[name=material1]').val(data.material || '')
    $('#isSpecialMake').val(data.isSpecialMake)
    $('#batchCreateProduct').find('[name=liquidNetContentMl]').val(data.prodSInfoExtends?.liquidNetContentMl)

    $('#unitInfo').val(data.unit || '')
    $('#packSpec').val(data.packSpecification || '')
    $('#batchCreateProduct').find('[name=productLength]').val(data.productLength || '')
    $('#batchCreateProduct').find('[name=productWidth]').val(data.productWidth || '')
    $('#batchCreateProduct').find('[name=productHeight]').val(data.productHeight || '')
    let logisAttr = data.logisAttrList?.split(',') || []
    for (var i = 0; i < logisAttr?.length; i++) {
      var checkAttr = $('#logisAttrList input[value=\'' + logisAttr[i] + '\']')
      checkAttr.prop('checked', true)
    }

    $('#batchCreateProduct').find('[name=buyer]').val(data.buyer || '')
    $('#defaultDlvrWhId').val(data.defaultDlvrWhId || '')
    $('#batchCreateProduct').find('[name=minOrderQuantity]').val(data.minOrderQuantity)
    $('#batchCreateProduct').find('[name=supplierPackFee]').val(data.supplierPackFee)
    $('#batchCreateProduct').find('[name=purNote]').val(data.purNote)

    $('#batchCreateProduct').find('[name=productDiffMethodNote]').val(data.prodPInfoDto?.productDiffMethodNote || '')
    let productDiffMethod = data.prodPInfoDto.productDiffMethod?.split(',') || []
    for (var i = 0; i < productDiffMethod?.length; i++) {
      var checkAttr = $('#diffMethodList input[value=\'' + productDiffMethod[i] + '\']')
      checkAttr.prop('checked', true)
    }

    let firstOne = data.subList[0] || {}
    if (firstOne.unit != undefined){
      $('#isUnitSingle').prop('checked', 'true')
    }
    if (firstOne.logisAttrList != undefined){
      $('#isLogisArrSingle').prop('checked', 'true')
    }
    if (firstOne.material != undefined){
      $('#isMaterialSingle').prop('checked', 'true')
    }
    if (firstOne.prodSInfoExtends?.liquidNetContentMl != undefined){
      $('#isLiquidSingle').prop('checked', 'true')
    }
    
    layui.laytpl($("#batchAdd_subTableLayer").html()).render(data.subList || [], function(html){
      $('#skuTbale_subTbody').append(html)
      toggleList()
      setTableLogisSelectDataCreate('wrap', data.subList)
      setTableUnitSelectData('wrap', data.subList)
      layui.form.render()
      let indexArr = []
      data.subList?.forEach((item, index) => {
        if (item.isdisabled == 'true') {
          indexArr.push(index)
        }
      })
      $('#skuTbale_subTbody tr').each(function(index, item) {
        if (indexArr.includes(index)) {
          $(item).css({
            'background': '#f2f2f2'
          })
          $(item).attr('isdisabled', true)
          $(item).find('input').each((cIndex, cItem) => {
            $(cItem).prop('disabled', true)
          })
          $(item).find('button').each((cIndex, cItem) => {
            $(cItem).prop('disabled', true)
          })
          $(item).find('select').each((cIndex, cItem) => {
            $(cItem).prop('disabled', true)
          })
  
          let xmSelect = $(item).find('.table_logisInfo').attr('xm-select')
          let val = $(item).find('[name=logisAttrList]').val()
          
          layui.formSelects.value(xmSelect, val?.split(','))
          layui.formSelects.disabled(xmSelect)
  
          layui.form.render('select')
        }
  
      })
    });

    layui.formSelects.render('prodAttrList1')
    layui.formSelects.value('prodAttrList1', data.prodPInfoDto.prodAttrList?.split(',') || []);  

  }

  // 处理要保存的数据格式
  function handleSaveParams1 (type = '') {
    let logisAttrList = []
    $('#batchCreateProduct').find('input[name=\'logisAttrList\']:checked').each(function() {
      logisAttrList.push(this.value)
    })
    let infoObj = serializeObject($('#batchCreateProduct'))
    let cateTreeName = $('#product_cate_tree_name').text() || ''
    if (type !== 'save') {
      cateTreeName = cateTreeName?.replace('OA新类目：', '')
      cateTreeName = cateTreeName?.replace('OA新类目: ', '')
    }
    let prodPInfoDto = {
      pSku: $('#batchPSku').val(), // 父sku
      bizzOwnerId: $('#bizzOwner').val() || '', // 开发专员id
      enTitle: $('#batchCreateProduct').find('[name=enTitle]').val(),
      responsorId: $('#responsor').val() || '', // 责任人id
      isSpecialPack: $('#isSpecialPack_prod').prop('checked'), // 是否特殊包装
      specialPackDesc: $('#specialPackDesc').val() || '', // 特殊包装备注
      prodAttrList: infoObj.prodAttrList1 || '', // 商品标签
      aliexpressCateForecast: cateTreeName, // 速卖通类目预测结果
      bizzOwner: $('#bizzOwner option:selected').text() || '', // 开发专员名字
      responsor: $('#responsor option:selected').text() || '', // 责任人名字
      productDiffMethod: infoObj.diffMethodList || '', // 产品区分方式
      productDiffMethodNote: infoObj.productDiffMethodNote || '', // 区分方式备注
      ifSycSizeWeight: infoObj.ifSycSizeWeight, // 是否同步尺寸
      prodPInfoCateOaDTO: {
        cateOaId: $('#product_cate_tree_cateId').val() || '',
        cateName: $('#product_cate_tree_cateTree').val() || '',
        cateTreeName: cateTreeName
      }
    }
    let prodSupplier = {
      id: $('#batchCreateProduct').find('[name=supplierId]').val() || '', // 供应商id
      supplier: $('#batchCreateProduct').find('[name=supplier]').val() || '' // 供应商名称
    }
    let subList = []
    let logisAttrListParams = ''
    let unitParams = ''
    let materialParams = ''
    $('#skuTbale_subTbody tr').each(function(index, item) {

      let subSkuObj = {
        sSku: '',
        logisAttrList: '',
        style: '',
        material: '',
        unit: '',
        suttleWeight: '',
        outerBoxLength: '',
        outerBoxWidth: '',
        outerBoxHeight: '',
        image: '',
        prodPrice: '',
        purBaseNum: '',
        articleNo: '',
        offerId: '',
        specId: '',
        attrStr: '',
        purNote: '',
        prodSInfoExtends: {
          liquidNetContentMl: ''
        }
      }
      subSkuObj.sSku = $(item).find('[name=sSku]').val() || ''
      subSkuObj.style = $(item).find('[name=style]').val() || ''
      subSkuObj.articleNo = $(item).find('[name=articleNo]').val() || ''
      let imageUrl =''
      if (type === 'save') { // 草稿
        imageUrl = $(item).find('[name=image]').attr('src') || ''
        logisAttrListParams =  logisAttrList?.join(',') || ''
        unitParams = $('#batchCreateProduct').find('[name=unit]').val() || ''
        materialParams = $('#batchCreateProduct').find('[name=material1]').val() || ''
        if ($('#isLogisArrSingle').prop('checked')) {
          subSkuObj.logisAttrList = $(item).find('[name=logisAttrList]').val() || ''
        } else {
          delete subSkuObj.logisAttrList
        }
        if ($('#isUnitSingle').prop('checked')) {
          subSkuObj.unit = $(item).find('[name=unit]').val() || ''
        } else {
          delete subSkuObj.unit
        }
        if ($('#isLiquidSingle').prop('checked')) {
          subSkuObj.prodSInfoExtends.liquidNetContentMl = $(item).find('[name=liquidNetContentMl]').val()
        } else {
          delete subSkuObj.prodSInfoExtends
        }
        if ($('#isMaterialSingle').prop('checked')) {
          subSkuObj.material = $(item).find('[name=material]').val() || ''
        } else {
          delete subSkuObj.material
        }
        if ($('#isRemarkSingle').prop('checked')) {
          subSkuObj.purNote = $(item).find('[name=purNote]').val() || ''
        } else {
          delete subSkuObj.purNote
        }
      } else {
        imageUrl = $(item).find('[name=image]').attr('imgname') || ''
        logisAttrListParams = logisAttrList?.join(',') || $('#skuTbale_subTbody tr:last').find('[name=logisAttrList]').val() || ''
        unitParams = $('#batchCreateProduct').find('[name=unit]').val() || $('#skuTbale_subTbody tr:last').find('[name=unit]').val() || ''
        materialParams = $('#batchCreateProduct').find('[name=material1]').val() || $('#skuTbale_subTbody tr:last').find('[name=material]').val() || ''
        subSkuObj.logisAttrList = $(item).find('[name=logisAttrList]').val() || logisAttrList.join(',') || ''
        subSkuObj.material = $(item).find('[name=material]').val() || $('#batchCreateProduct').find('[name=material1]').val() || ''
        subSkuObj.purNote = $(item).find('[name=purNote]').val() || $('#batchCreateProduct').find('[name=purNote]').val() || ''
        subSkuObj.unit = $(item).find('[name=unit]').val() || $('#batchCreateProduct').find('[name=unit]').val() || ''
        subSkuObj.prodSInfoExtends.liquidNetContentMl = $(item).find('[name=liquidNetContentMl]').val() || $('#batchCreateProduct').find('[name=liquidNetContentMl]').val() || ''
      }
      subSkuObj.suttleWeight = $(item).find('[name=suttleWeight]').val() || ''
      subSkuObj.outerBoxLength = $(item).find('[name=outerBoxLength]').val() || ''
      subSkuObj.outerBoxWidth = $(item).find('[name=outerBoxWidth]').val() || ''
      subSkuObj.outerBoxHeight = $(item).find('[name=outerBoxHeight]').val() || ''
      subSkuObj.image = imageUrl
      subSkuObj.prodPrice = $(item).find('[name=prodPrice]').val() || ''
      subSkuObj.purBaseNum = $(item).find('[name=purBaseNum]').val() || ''
      subSkuObj.offerId = $(item).find('[name=offerId]').val() || ''
      subSkuObj.specId = $(item).find('[name=specId]').val() || ''
      subSkuObj.attrStr = $(item).find('[name=attrStr]').text() || ''
      subSkuObj.isdisabled = $(item).attr('isdisabled')
      if (type === 'save') {
        subList.push(subSkuObj)
      } else {
        if (!$(item).attr('isdisabled')) {
          subList.push(subSkuObj)
        }
      }
    })

    let params = {
      purchaseUrl: $('#batchCreateProduct').find('[name=purchaseUrl]').val() || '',
      buyer: infoObj.buyer,
      packWeight: $('#packSpec option:selected').attr('weight'), // 包装重量
      packDesc: infoObj.packDesc, // 入库要求
      logisAttrList: logisAttrListParams,
      title: infoObj.title,
      purchaseChannel: infoObj.purchaseChannel, // 产品简称
      material: materialParams,
      unit: unitParams,
      packSpecification: infoObj.packSpecification,
      defaultDlvrWhId: infoObj.defaultDlvrWh,
      isSpecialMake: infoObj.isSpecialMake,
      productLength: infoObj.productLength,
      productWidth: infoObj.productWidth,
      productHeight: infoObj.productHeight,
      defaultDlvrWh: $('#defaultDlvrWhId option:selected').text() || '',
      supplierPackFee: infoObj.supplierPackFee,
      purNote: infoObj.purNote,
      minOrderQuantity: infoObj.minOrderQuantity,
      subList: subList,
      prodPInfoDto,
      prodSupplier
    }
    let liquidNetContentMl = $('#batchCreateProduct').find('input[name=\'liquidNetContentMl\']').val()
    if (liquidNetContentMl !== '' && liquidNetContentMl !== undefined) {
      let prodSInfoExtends = {
        liquidNetContentMl
      }
      params.prodSInfoExtends = prodSInfoExtends
    }
    return params
  }

  // 表格动态列 单位 物流属性 下拉数据填充
  function setTableUnitSelectData(type, subList) {
    let unitSelectStr = '<option value="">请选择</option>'
    tableUnitList?.forEach(item => {
      unitSelectStr += '<option value="' + item.name + '" :select"'+ item.name +'">' + item.name + '</option>'
    })
    $('.unit_td').each(function(index, item) {
      if (type === 'wrap') {
        let unitSelect = subList[index].unit
        unitSelectStr = unitSelectStr.replace(':select"' + unitSelect + '"', 'selected')
      }
      $(item).find('.table_unitInfo').append(unitSelectStr)
    }) 
  }

  function setTableLogisSelectDataCreate(type, subList) {
    let logisSelectStr = ''
    tableLogisArrList?.forEach(item => {
      logisSelectStr += '<option value="' + item.name + '">' + item.name + '</option>'
    })
    $('.logisAttrList_td').each(function(index, item) {
      $(item).find('.table_logisInfo').append(logisSelectStr)
      layui.formSelects.render('table_logisInfo' + index)
    })
    if (type === 'wrap') {
      $('.logisAttrList_td').each(function(index, item) {
        let xmSelect = $(item).find('.table_logisInfo').attr('xm-select')
        layui.formSelects.value(xmSelect, subList[index].logisAttrList?.split(','))
      })  
    }
    if (type === 'base') {
      $('#skuTbale_subTbody tr').each(function(index, item) {
        if ($(item).attr('isdisabled')) {
          layui.formSelects.disabled('table_logisInfo' + index)
          layui.form.render('select')
        }
      })  
    }
  }

  // 获取一个可用的PSKU
  function getAvailablePsku(fun) {
    $.ajax({
      type: "post",
      url: ctx + "/product/getOneAvailablePsku",
      //url: ctx + "/product/getOneAvailablePskuForTest", // for test
      dataType: "json",
      contentType: 'application/json;charset=utf-8',
      //data: JSON.stringify({ // for test
      //  userName: '熊学山',
      //  id: '30'
      //}),
      success: function(res) {
        if (res.code === '0000') {
            let pSku = res.data.pSku || '';
            // 填充商品父 SKU
            $('#batchCreateProduct').find('[name=pSku]').val(pSku)
            fun(res.data.bizzOwnerId, res.data.responsorId)
        } else {
            layer.msg(res.msg)
        }
      }
    })
  }

  // 根据采购链接获取1688商品信息
  function getPskuDetailByLink() {
    // 存在子sku数据 且存在没有被禁用的
    let sskuListLength = $('#skuTbale_subTbody tr')?.length
    let disabledList = []
    $('#skuTbale_subTbody').find('tr').each((index, item) => {
      disabledList.push($(item).attr('isdisabled'))
    })
    let list = disabledList?.filter(item => item !== 'true')
    if (sskuListLength > 0 && list?.length > 0) {
      layer.confirm('再次获取会清空当前已录入数据，是否重复获取？', function (index) {
        clearSubSkuInfo()
        // 清空未被禁用的子sku信息
        $('#skuTbale_subTbody tr').each((index, item) => {
          if (!$(item).attr('isdisabled')) {
            $(item).remove()
          }
        })

        fetchInitData()
        layer.close(index)
      })
    } else {
      fetchInitData()
    }
  }

  function fetchInitData() {
    // 填充页面数据
    $.ajax({
      type: "post",
      url: ctx + "/product/getDataByPurchaseUrl",
      dataType: "json",
      data: {
        purchaseUrl: $('#batchCreateProduct').find('[name=purchaseUrl]').val()
      },
      success: function(res) {
        if (res.code === '0000') { // 如果已经存在子sku的数据，先进行清空
          let data = res.data
          handleInputInfo(data)
          showAliSkuDialog(data.subList)
          if (res.msg) {
            layer.msg(res.msg)
          }
        } else if (res.code === '5555') {
          // 没有供应商 备用信息 暂不处理
          layer.msg(res.msg)
        } else {
          layer.msg(res.msg)
        }
      }
    })
  }

  // 根据采购链接填充页面数据
  function handleInputInfo(data) {
    let { id, supplier} = data.prodSupplier
    let { title, material, buyer, minOrderQuantity } = data
    $('#batchCreateProduct').find('[name=supplier]').val(supplier)
    $('#batchCreateProduct').find('[name=supplierId]').val(id)
    $('#batchCreateProduct').find('[name=title]').val(title)
    $('#batchCreateProduct').find('[name=material1]').val(material)
    $('#batchCreateProduct').find('[name=buyer]').val(buyer)
    $('#batchCreateProduct').find('[name=minOrderQuantity]').val(minOrderQuantity)

    layui.form.render()
  }

  // 清空子sku信息
  function clearSubSkuInfo() {
    $('#batchCreateProduct').find('[name=supplier]').val('')
    $('#batchCreateProduct').find('[name=supplierId]').val('')
    $('#batchCreateProduct').find('[name=title]').val('')
    $('#batchCreateProduct').find('[name=material1]').val('')
    $('#batchCreateProduct').find('[name=buyer]').val('')
    $('#batchCreateProduct').find('[name=minOrderQuantity]').val('')
    layui.form.render()
  }

  var tableLength = 0
  // 阿里SKU信息弹窗
  function showAliSkuDialog(aliSkuInfoList) {
    var index = layer.open({
      title: '阿里sku信息',
      type: 1, //不加该属性,就会出现[object Object]
      resize: true,
      move: '.layui-layer-title',
      moveOut: true,
      area: ['85%', '95%'],
      id: 'addGroupListId1',
      shadeClose: false,
      btn: ['保存', '关闭'],
      content: $('#ali1688SkuInfoDialog').html(),
      success: function(layero, index) {
        layui.laytpl($("#batchAli1688SkuInfoList").html()).render(aliSkuInfoList, function(html){
          $('#batchAli1688SkuInfoBox').append(html)
          layui.form.render()
        });
        layui.form.on('checkbox(batchAli1688SkuInfoCheck)', function(data){
          // 全选
          $('.skuInfoItem').each(function(index, item) {
            $(item).find('[type=checkbox]').prop('checked', data.elem.checked)
          })
          layui.form.render()
        })
      },
      yes: function() {
        var selectedList = $('#aliSkuInfo [type=checkbox]:checked')
        let subSkuList = []
        // 判断是多品还是单品 选择的数据+列表中有的数据
        let sSkuTableList = tableLength = $('#skuTbale_subTbody tr').length

        let sSkuCount = selectedList?.length + sSkuTableList
        selectedList.each(function(index, item) {
          let skuInfo = {
              sSku: sSkuCount > 1 ? $('#batchPSku').val() + '-' : $('#batchPSku').val(),
              attrStr: $(item).attr('attrStr'),
              offerId: $(item).attr('offerId'),
              specId: $(item).attr('specId'),
              image: $(item).attr('image'),
              style: $(item).attr('style'),
              articleNo: $(item).attr('articleNo')
          }
          subSkuList.push(skuInfo)
        })
        tableSubList = subSkuList
        layui.laytpl($("#batchAdd_subTableLayer").html()).render(subSkuList, function(html){
          $('#skuTbale_subTbody').append(html)
          setTableUnitSelectData()
          layui.form.render()

          let logisSelectStr = ''
          tableLogisArrList?.forEach(item => {
            logisSelectStr += '<option value="' + item.name + '">' + item.name + '</option>'
          })
          $('#skuTbale_subTbody tr').each(function(index, item) {
            if (!$(item).attr('isdisabled')) {
              $(item).find('.table_logisInfo').append(logisSelectStr)
              layui.formSelects.render('table_logisInfo' + index)
            }
          }) 
         // layui.formSelects.render()
        });

        toggleList()
        
        layer.close(index)
      }
    })
  }

  function toggleList() {
    // 根据单独勾选 确认列表表头
    if ($('#isLogisArrSingle').prop('checked')) {
      $('.logisAttrList_tr').show()
      $('.logisAttrList_td').show()
    } else {
      $('.logisAttrList_tr').hide()
      $('.logisAttrList_td').hide()
    }
    if ($('#isUnitSingle').prop('checked')) {
      $('.unit_tr').show()
      $('.unit_td').show()
    } else {
      $('.unit_tr').hide()
      $('.unit_td').hide()
    }
    if ($('#isMaterialSingle').prop('checked')) {
      $('.material_tr').show()
      $('.material_td').show()
    } else {
      $('.material_tr').hide()
      $('.material_td').hide()
    }
    if ($('#isLiquidSingle').prop('checked')) {
      $('.liquid_tr').show()
      $('.liquid_td').show()
    } else {
      $('.liquid_tr').hide()
      $('.liquid_td').hide()
    }
    if ($('#isRemarkSingle').prop('checked')) {
      $('.remark_tr').show()
      $('.remark_td').show()
    } else {
      $('.remark_tr').hide()
      $('.remark_td').hide()
    }
  }

  // 移除sku
  function removeCreateRow(obj) {
    $(obj).parents('tr').remove();
  }

  // 获取商品标签 单位 默认发货仓 规格
  function getCreateProductTag() {
    //return new Promise((resolve, reject) => {
      let ajax = new Ajax(false)
      ajax.post({
        url: ctx + '/product/getProductlistConfig',
        success: function (res) {
          if (res.code === '0000') {
            let prodTags = res.data.prodTags || []
            let unitList = tableUnitList = res.data.unitList || []
            let wareHouseList = res.data.wareHouseList || []
            let packSpecList = res.data.packSpecList || []
            let buyerList = res.data.buyers || []
            let bizzOwnersList = res.data.bizzOwners || []
            let responsorList = res.data.responsorList || []
            appendSelect($('#batchCreateProduct').find('select[name="bizzOwner"]'), bizzOwnersList, 'id', 'userName')
            appendSelect($('#batchCreateProduct').find('select[name="responsor"]'), responsorList, 'id', 'userName')
  
            commonRenderSelect('unitInfo', unitList, {
              name: 'name',
              code: 'name'
            });
            commonRenderSelect('defaultDlvrWhId', wareHouseList, {
              name: 'warehouseName',
              code: 'id'
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
  
            // 默认发货库 包装规格 isDefault true
            let defaultWareHouse = wareHouseList.find(item => item.isDefault === true)
            let defaultWareHouseId = defaultWareHouse?.id || ''
            let defaultPackSpec = packSpecList.find(item => item.ifDefault === true)
            let defaulSpecId = defaultPackSpec?.id || ''
            $('#defaultDlvrWhId').val(defaultWareHouseId)
            // 默认包装规格 气泡袋11cm*13cm
            $('#packSpec').val(defaulSpecId)
  
            appendSelect($('#batchCreateProduct').find('select[name="prodAttrList1"]'), prodTags, 'name', 'name')
            layui.formSelects.render('prodAttrList1')
  
            layui.form.render()
            getAvailablePsku((bizzOwner, responsor) => {
              // 初始化默认归属人
              console.log('dom', $('#batchCreateProduct').find('select[name="bizzOwner"]'), bizzOwner)
              $('#batchCreateProduct').find('select[name="bizzOwner"]').val(bizzOwner)
              $('#batchCreateProduct').find('select[name="responsor"]').val(responsor)
              layui.form.render()
            })
          }
        }
        //error: function() {
        //  reject('服务器异常')
        //}
      //})
    })
  }

  // 获取产品区分方式
  function getDiffMethod() {
    var layer = layui.layer,
    laytpl = layui.laytpl;
    let ajax = new Ajax(false)
    ajax.post({
        url: ctx + '/product/queryAllProductDiffMethod',
        success: function (res) {
        if (res.code === '0000') {
          let productDiffMethod = res.data?.map(item => {
              return {
                  name: item
              }
          })
          let data = {
            diffMethodList: productDiffMethod
          }
          laytpl($("#batchAdd_diffMethodLayer").html()).render(data, function(html){
              $('#diffMethodList').html(html)
          });
          layui.form.render()
        } else {
            layer.msg('初始化产品区分方式失败:' + res.msg)
        }
      }
    })
  }
  // 获取物流属性
  function getCreateLogisAttrList () {
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
            laytpl($("#batchAdd_logisAttrListLayer").html()).render(data, function(html){
                $('#logisAttrList').html(html)
            });
            layui.form.render()
          } else {
            layer.msg('初始化物流属性失败:' + res.msg)
          }
        }
      })
    }

  // 新增N行
  function addTableRow(self) {
    let lineCount = $('#addRowCount').val()
    if (lineCount === '') {
      return layer.msg('请输入行数')
    } else {
      // 在表格中新增 lineCount 行，数据同上一行商品信息，没有上一行， 则为空
      // 获取上一行数据，则为表格的最后一行数据
      let sSkuTableList = $('#skuTbale_subTbody tr').length
      let lastRow = sSkuTableList > 0 ? $('#skuTbale_subTbody').find('tr:last') : ''
      let lastUnit = $(lastRow).find('[name=unit]').val()
      let lastMaterial = $(lastRow).find('[name=material]').val()
      let lastRemark = $(lastRow).find('[name=purNote]').val()
      let lastLogisAttrList = $(lastRow).find('[name=logisAttrList]').val()
      if (lastRow) {
        let addHtml = $(lastRow).html()
        let addStr = '<tr>' + addHtml + '</tr>'

        // 获取lastRow 的子sku
        let lastSku = $(lastRow).find('[name=sSku]').attr('value')

        if (lastSku.indexOf('-') <= -1 && !$(lastRow).attr('isdisabled')) {
          $(lastRow).find('[name=sSku]').val(lastSku + '-')
        }
        
        let beforeSku = lastSku?.split('-')[0] || lastSku
        addStr = addStr.replace(/name="sSku" value=".*?"/, function() {
          return 'name="sSku" value="' + beforeSku + '-' + '"'
        })

        for (let i = 0; i < lineCount; i++) {
          addStr = addStr.replace(/xm-select=".*?"/g, function(){
            return 'xm-select="table_logisInfo-' + sSkuTableList + i + '"'
          })
          $('#skuTbale_subTbody').append(addStr)
          layui.formSelects.render("table_logisInfo-" + sSkuTableList + i)
        }
        // 新增的行 style置空
        let newDom = $("#skuTbale_subTbody tr").slice($('#skuTbale_subTbody tr').length - lineCount, $('#skuTbale_subTbody tr').length)
        $(newDom).each(function(index, item) {
          $(item).find('input').prop('disabled', false)
          $(item).find('button').prop('disabled', false)
          $(item).find('select').prop('disabled', false)

          $(item).find('[name=styleTd]').find('input').val('')
          $(item).find('[name=unit]').val(lastUnit)
          $(item).find('[name=material]').val(lastMaterial)
          $(item).find('[name=purNote]').val(lastRemark)

          layui.formSelects.value("table_logisInfo-" + sSkuTableList + index, lastLogisAttrList?.split(','))
          layui.formSelects.undisabled("table_logisInfo-" + sSkuTableList + index)
        })
        layui.form.render()
      } else {
        let obj = {
          image: '',
          sSku: lineCount > 1 ? $('#batchPSku').val() + '-' : $('#batchPSku').val(),
          style: '',
          suttleWeight: '',
          outerBoxLength: '',
          outerBoxWidth: '',
          outerBoxHeight: '',
          prodPrice: '',
          purBaseNum: '',
          attrStr: '',
          material: ''
        }
        let emptyDataSubList = []
        for (let i = 0; i < lineCount; i++) {
          emptyDataSubList.push(obj)
        }
        layui.laytpl($("#batchAdd_subTableLayer").html()).render(emptyDataSubList, function(html){
          $('#skuTbale_subTbody').append(html)
        });
        toggleList()
        setTableLogisSelectDataCreate()
      }
      layui.form.render()

      createDropTbale()
    }
  }

  // 将url转为file
  function downloadUrlToFile1() {
    requestArrCreate = []
    $('#skuTbale_subTbody tr').each(function(index, item) {
      let url = $(item).find('[name=image]').attr('src') || ''
      if (url?.indexOf('cbu01.alicdn.com/img/ibank') > -1) {
        const fileName = 'image.jpg'; // 文件名
        requestArrCreate.push(new Promise((resolve, reject) => {
          loading.show()
          urlToFile(url, fileName).then(file => {
            getUrlByFile1(file, $(item), resolve)
          }).catch(err => {
            reject('图片转换文件失败')
          })
        }))
      }
    })
  }

  function getUrlByFile1(file, self, resolve) {
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

  // 数字递增
  function addSkuByNum() {
    if ($('#skuTbale_subTbody tr')?.length <= 1) {
      return
    }
    let numList = []
    let disabledCount = 0
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if ($(item).attr('isdisabled')) {
        let sSkuVal = $(item).find('[name=sSkuTd]').find('input').val()  
        let lastStr = sSkuVal.split('-')[1] || ''
        numList.push(lastStr)
        disabledCount ++
      }
    })
    numList = numList.filter(item => !/[A-Za-z]/.test(item));
    let maxNum = numList?.length > 0 ? Math.max(...numList) : 0
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if (!$(item).attr('isdisabled')) {
        let sSkuVal = $(item).find('[name=sSkuTd]').find('input').val()  
        // 判断是否已经递增过
        let lastStr = sSkuVal.split('-')[1]
        if (lastStr) {
          sSkuVal = sSkuVal.split('-')[0] + '-'
        }
        // 获取最大的数字
        let sSkuNumStr = sSkuVal + (maxNum + index + 1 - disabledCount)
        $(item).find('[name=sSkuTd]').find('input').val(sSkuNumStr)
      }
    })
    layui.form.render()
  }

  // 字母递增
  function addSkuByEng() {
    if ($('#skuTbale_subTbody tr')?.length <= 1) {
      return
    }
    let letterList = []
    let disabledCount = 0
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if ($(item).attr('isdisabled')) {
        let sSkuVal = $(item).find('[name=sSkuTd]').find('input').val()  
        let lastStr = sSkuVal.split('-')[1] || ''
        letterList.push(lastStr)
        disabledCount ++
      }
    })
    letterList = letterList.filter(item => /[A-Za-z]/.test(item));
    letterList = letterList?.map(item => getNumberByLetter(item))
    let maxNum = letterList?.length > 0 ? Math.max(...letterList) : 0
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if (!$(item).attr('isdisabled')) {
        let sSkuVal = $(item).find('[name=sSkuTd]').find('input').val()  
        // 判断是否已经递增过
        let lastStr = sSkuVal.split('-')[1]
        if (lastStr) {
          sSkuVal = sSkuVal.split('-')[0] + '-'
        }
        // 获取最大的字母
        let sSkuNumStr = sSkuVal + getLetter((maxNum + index + 1 - disabledCount))
        $(item).find('[name=sSkuTd]').find('input').val(sSkuNumStr)
      }
    })
    layui.form.render()
  }
  // 移除递增
  function removeSkuByAdd() {
    if ($('#skuTbale_subTbody tr')?.length <= 1) {
      return
    }
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if (!$(item).attr('isdisabled')) {
        let sSkuVal = $(item).find('[name=sSkuTd]').find('input').val()
        // 判断是否已经递增过
        let lastStr = sSkuVal.split('-')[1]
        if (lastStr) {
          sSkuVal = sSkuVal.split('-')[0] + '-'
          $(item).find('[name=sSkuTd]').find('input').val(sSkuVal)
        }
      }
    })
    layui.form.render()
  }

  // 批量应用
  function handleMulSet() {
    $('#skuTbale_subTbody tr').each(function(index, item) {
      if (!$(item).attr('isdisabled')) {
        let multiWeight = $('#batchCreateProduct').find('[name="multiWeight"]').val() || ''
        $(item).find('[name=suttleWeightTd]').find('input').attr('value', multiWeight)
  
        let multiLength = $('#batchCreateProduct').find('[name="multiLength"]').val() || ''
        $(item).find('[name=outerBoxLength]').attr('value', multiLength)
        let multiWidth = $('#batchCreateProduct').find('[name="multiWidth"]').val() || ''
        $(item).find('[name=outerBoxWidth]').attr('value', multiWidth)
        let multiHeight = $('#batchCreateProduct').find('[name="multiHeight"]').val() || ''
        $(item).find('[name=outerBoxHeight]').attr('value', multiHeight)
  
        let multiPrice = $('#batchCreateProduct').find('[name="multiPrice"]').val() || ''
        $(item).find('[name=priceTd]').find('input').attr('value', multiPrice)
        let multiPurchase = $('#batchCreateProduct').find('[name="multiPurchase"]').val() || ''
        $(item).find('[name=purBaseNumTd]').find('input').attr('value', multiPurchase)
      }
    })
    layui.form.render()
  }

  let letterArr = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y']
  // 根据index 返回字母
  function getLetter(n){
    let res = ''
    function chu(n){
        let r = parseInt(n / 23)
        let mod = n % 23
        if (mod === 0) {
            res = letterArr[22] + res
            r--
        } else {
            res = letterArr[mod - 1] + res
        }
        if (r > 0) {
            chu(r)
        }
    }
    chu(n);
    return res
  }

  // 根据字母返回index A -> 1  AA -> 24
  function getNumberByLetter(letter) {
    let res = 0;
    for (let i = 0; i < letter.length; i++) {
      let index = letterArr.indexOf(letter[i]);
      if (index !== -1) {
        res = res * 23 + (index + 1);
      }
    }
    return res;
  }

  function addSupplier() {
    var index = layer.open({
      title: '新增供应商',
      type: 1, //不加该属性,就会出现[object Object]
      area: ['800px', '600px'],
      id: 'addsupplierId1',
      shadeClose: false,
      content: $('#addsupplierLayer').html(),
      btn: ['保存', '关闭'],
      success: function() {
        //所属类目渲染
        alertCateSelect($('#addSuppFrom #xtreeAddBtn'), $('#addSuppFrom [name=supportCateIds]'), $('#addSuppFrom #xtreeAddDiv'))
            // 初始化必填项
        initNotNull('#addSuppFrom')
        // 可选省份初始化
        initSelectIcon(layui.form,'PROVINCE_CODE','#addSuppFrom [name=province]',true)
            //常规用法
        layui.laydate.render({
          elem: '#pl_UncoopTime',
          type: 'datetime'
        })
        layui.form.render('checkbox')
        layui.form.render('select')
      },
      yes: function(index, layero) {
          // 校验有无选择类目
          var cateLsit = $('#addSuppFrom [name=supportCateIds]').val()
          if (!cateLsit || cateLsit.length == 0) {
              layer.msg('请选择所属类目')
              return false
          }
          // 校验必填项
          if (!checkNotNull('#addSuppFrom')) {
              return false
          }

          //处理数据
          var data = serializeObject($('#addSuppFrom'))
          data.isSupportCust = $('#isSupportCust').prop('checked')
          data.isCooperate = true
          if ($('#isCooperate').is(':checked')) {
              data.isCooperate = false
              data.uncooperativeReason = $('#uncoopReasonTag').val()
          }
          var uncooperativeTime = data['uncooperativeTime']
          if (uncooperativeTime != '') {
              uncooperativeTime = uncooperativeTime.replace(/-/g, '/')
              var d = new Date(uncooperativeTime)
              var uncoopTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
              data['uncooperativeTime'] = uncoopTime
          }

          data.mobile == ''?data.mobile = 'null':'';
          data.contact == ''?data.contact = 'null':'';

          loading.show()
          $.ajax({
              type: 'post',
              url: ctx + '/product/addProdSupplier.html',
              dataType: 'json',
              data: data,
              success: function(returnData) {
                  loading.hide()
                  if (returnData.code == '0000') {
                      layer.close(index)
                      layer.msg('添加供应商成功')
                  } else {
                      layer.msg(returnData.msg)
                  }
              },
              error: function() {
                  loading.hide()
                  layer.msg('发送请求失败')
              }
          })
      },
  })
  }

  function searchCate() {
    layer.open({
        type: 1,
        title: '标题搜索分类',
        content: $("#addprodpinfo_searchCateTpl").html(),
        id: 'addprodpinfo_searchCateTplId',
        area: ['65%', '60%'],
        success: function(layero,index){
            let defaultVal = $('#batchCreateProduct').find('[name=enTitle]').val();
            layero.find('[name=title]').val(defaultVal);
            $('#addprodpinfo_searchCate_btn').on('click', function(){
                let title = layero.find('[name=title]').val();
                if(!title){
                    return layer.msg('请先输入标题',{icon:1});
                }
                commonReturnPromise({
                    url: '/lms/product/AliexpressCategoryForecast.html',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        subject: title
                    })
                }).then(res => {
                    // console.log(res); //渲染表格相关
                    //循环数据渲染到表格里面,然后给选择绑定事件
                    let str = '';
                    let forecastCate = []
                    for(let i=0; i<res.length; i++){
                        let item = res[i];
                        // console.log(item);
                        str += '<tr><td>' +item.id + '</td><td>'+item.cateTreeName+'</td><td>'+ item.score + '%</td>\
                                <td>'+ '<span class="layui-btn layui-btn-normal layui-btn-sm cateHandle" cateoaId="'
                                    +item.id +'" cateName="'+item.cateName+'" cateTreeName="'+ item.cateTreeName+'">选择</span></td></tr>';
                        forecastCate.push(item.categoryId)
                    };
                    $('#addprodpinfo_searchCateTbody').empty().append(str);
                    $('#addEditSKU_form [name=aliexpressCateForecast]').val(forecastCate.join(';'))
                    searchCateSelectHandle(layero, index);
                });
            });
        }
    });
} 
  function searchCateSelectHandle(layero ,index){
    layero.on('click', '.cateHandle', function(){
        let cateOaId = $(this).attr('cateoaid');
        let cateName = $(this).attr('catename');
        let cateTreeName = comRepEnglishQuote($(this).attr('catetreename'))
        $('#product_cate_tree_cateId').val(cateOaId);
        $('#product_cate_tree_cateTree').val(cateName);
        $('#product_cate_tree_name').text('OA新类目: ' + cateTreeName);
        layer.close(index);
    });
  }

  function changeSSku1(obj) {
    $(obj).attr("value",$(obj).val())
  }

  function setChooseCheck(obj) {
    let checkDom = $(obj).parent('.img-content').find('[name=skuCheck]')
    let isChecked = $(checkDom).prop('checked')
    $(obj).parent('.img-content').find('[name=skuCheck]').prop('checked', !isChecked)
    layui.form.render('checkbox')
  }

</script>