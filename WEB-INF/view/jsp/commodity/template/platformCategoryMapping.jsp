<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>平台类目映射</title>
<style>
  .attrValueBox {
    position: relative;
    z-index: 999;
    text-align: center;
    background-color: #f2f2f2;
    border-top: 1px solid #e6e6e6;
    padding: 10px;
    line-height: 30px;
    transform: translateY(20px);
  }

  h3 {
    margin: 10px;
  }
  .layui-table {
    width: 100% !important;
  }
  .batchMapPlat {
    position: relative;
    display: inline-block;
    width: 50%;
    margin: 0 5px;
  }
  td .batchMapPlat {
    width: 100%;
    margin: 0 5px;
  }

  /* #mapPlatAttrValue .layui-table-cell.laytable-cell-2-2 {
    width: 100%;
  } */
  .layui-table-cell {
    margin: 0 auto !important;
  }
  .layui-table-box,
  .layui-table-view {
    margin-top: 0;
    overflow: visible !important;
  }
  .layui-table-header {
    overflow: visible;
  }
  .layui-table-body.layui-table-main {
    overflow: visible !important;
  }
  #batchplatAttrMapbox .layui-form-select dl {
    max-width: 100%;
  }
  #LAY-iframe-itemCat .layui-col-md3,
  #LAY-iframe-itemCat .layui-col-xs3 {
    width: 24%;
    height: 305px;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 2px 10px;
    border: 1px solid #ccc;
  }

  #LAY-iframe-itemCat ul li {
    position: relative;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 20px;
  }

  #LAY-iframe-itemCat .layui-col-xs12 ul li {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #LAY-iframe-itemCat .layui-col-xs3 ul li i {
    position: absolute;
    top: 4px;
    right: 5px;
  }

  #LAY-iframe-itemCat ul li:hover {
    background-color: #f4f6f7;
    color: #438eb9;
  }

  #LAY-iframe-itemCat ul li.cat_active:hover {
    background-color: #6fb3e0;
    color: #fff;
  }

  #LAY-iframe-itemCat input {
    display: inline-block;
    width: 200px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
  }

  #LAY-iframe-itemCat input:focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }

  #LAY-iframe-itemCat input:focus,
  #LAY-iframe-itemCat input:hover {
    border-color: #57a3f3;
  }

  .cat_common {
    padding: 3px;
    margin: 3px auto;
    border: 1px solid #f8f8f8;
    box-sizing: border-box;
    font-weight: 700;
    background-color: #f8faff;
    color: #7c9eb2;
    cursor: pointer;
  }

  .cat_active {
    background-color: #6fb3e0;
    color: #fff;
  }
  .mapbox {
    padding: 20px;
  }
  .disabled {
    display: none !important;
  }
  .visibility_hidden {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
  }
  #temabso {
    /* position: absolute; */
    top: 0;
    /* right: -250px; */
    width: 530px;
    display: flex;
    align-items: center;
  }
  .pfcm-overhidden {
    text-align: -webkit-right;
  }
  .pfcm-overhidden .disfx {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 32px;
    width: 720px;
  }
  .pfcm-overhidden .salesInputs {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pfcm-overhidden .salesInputs>input {
    width: 70px;
    margin: 0 5px;
  }
  .pfcm-overhidden .unlistingcheckbox {
    margin-left: 20px;
  }
  .pfcm-overhidden .unlistingcheckbox .layui-icon {
    position: absolute;
    left: -10px;
    top: 6px;
  }
  .platAttrMapThree .xm-select-dl{
    z-index: 20231228
  }
  .temuRemark{
    position: absolute;
    top: 5px;
    left: 15%;
    color: red;
    font-size: 16px;
  }
</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <!-- 搜索条件 -->
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form layui-clear" lay-filter="pcm_searchForm" id="pcm_searchBtnForm" autocomplete="off">
            <div class="layui-form-item">
              <div class="layui-col-md12 layui-col-lg12">
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select name="plat" lay-filter="platchoose" lay-search>
                    <option value="">单选、必选</option>
                    <!-- lazada,ebay,aliexpress,shopee -->
                    <option value="originOA">originOA</option>
                    <option value="ebay">ebay</option>
                    <option value="aliexpress">aliexpress</option>
                    <option value="shopee">shopee</option>
                    <option value="lazada">lazada</option>
                    <option value="mercado">mercado</option>
                    <option value="ozon">ozon</option>
                    <option value="tiktok">tiktok</option>
                    <option value="shein自营">shein自营</option>
                    <option value="shein商城">shein商城</option>
                    <option value="miravia">miravia</option>
                    <option value="temu">temu</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">产品类目</label>
                <div class="layui-input-block">
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="pcm_plat_searchCate_btn">选择分类</button>
                  <input type="hidden" name="cateId" value="" id="plat_cateId_search_inp" />
                  <i id="clearPlat" class="layui-icon layui-icon-delete" style="cursor: pointer" title="删除产品类目"></i>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">OA新类目</label>
                <div class="layui-input-block">
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="pcm_searchCate_btn">选择分类</button>
                  <input type="hidden" name="cateId" value="" id="product_cateId_search_inp" />
                  <i id="clearOAnew" class="layui-icon layui-icon-delete" style="cursor: pointer" title="删除产品类目"></i>
                </div>
              </div>

              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">类目映射状态</label>
                <div class="layui-input-block">
                  <select name="cate" lay-search="">
                    <option value="">全部</option>
                    <option value="1">已映射</option>
                    <option value="0">未映射</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">类目属性映射状态</label>
                <div class="layui-input-block">
                  <select name="cateAttr" lay-search="">
                    <option value="">全部</option>
                    <option value="1">完整</option>
                    <option value="0">不完整</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2 showForShopee disN">
                <label class="layui-form-label">修改人</label>
                <div class="layui-input-block">
                  <select
                  name="modifier"
                  id="pfcm_modifier"
                  xm-select="xm_pfcm_modifier"
                  xm-select-search
                  xm-select-search-type="dl"
                  xm-select-skin="normal">
                  </select>
                </div>
              </div>
              </div>

              <div class="layui-col-md12 layui-col-lg12">
              <div class="layui-col-md2 layui-col-lg2 showForShopee disN">
                <label class="layui-form-label">排序方式</label>
                <div class="layui-input-block">
                  <select name="orderBy" lay-search id="pfcm_orderBy">
                    <option value="">全部</option>
                    <option value="1">完整</option>
                    <option value="0">不完整</option>
                  </select>
                </div>
              </div>

              <div class="layui-col-md2 layui-col-lg2" style="margin-left: 60px;">
                <button id="pcm_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button" lay-submit data-type="reload">搜索</button>
                <button type="reset" id="pcm_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
              </div>
            </div>
            </div>

            <div class="layui-col-l12 layui-col-md12" id="platCategory"></div>
            <input type="hidden" id="platCateId" name="platCateId">

            <div class="layui-col-l12 layui-col-md12" id="OAnewCategory"></div>
            <input type="hidden" id="cateOaId" name="cateOaId">
          </form>
        </div>
      </div>
      <div class="layui-card" id="pcm_productlistCard">
        <div class="layui-card-header pfcm-overhidden showForShopee disN">
          <div class="disfx">
            <div class="layui-form">
              <div class="layui-form-label">店铺7日销量</div>
              <div class="layui-input-block salesInputs">
                <input type="text" class="layui-input" name="minSales">
                <span>~</span>
                <input type="text" class="layui-input" name="maxSales">
              </div>
            </div>
            <div class="layui-form unlistingcheckbox">
              <input type="checkbox" name="isFilterCategoryNotAdjustedListing" title="过滤类目未调整listing" lay-skin="primary">
            </div>
            <div class="layui-form unlistingcheckbox">
              <input type="checkbox" name="isCheckAvaliableLogistics" title="校验可用物流" lay-skin="primary">
            </div>
            <span class="layui-btn layui-btn-sm" id="pfcm_editShopeeListing"  lay-tips="过滤修改类目后无可用物流listing">修改shopee在线listing类目</span>
          </div>
        </div>
        <div class="layui-card-body">
          <table class="layui-table" id="pcm_sProdTable" lay-filter="pcm_sProdTable"></table>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/html" id="layer_work_develop_pl">
  <div class="layui-fluid" id="LAY-iframe-itemCat">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md12">
        <input type="text" id="itemCat_input" />
        <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
      </div>
    </div>
  </div>
</script>
<script type="text/html" id="editOperBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit" id="editattribute">映射</a>
</script>
<script type="text/html" id="mapProcessing">
  <div class="mapbox">
    <input type="hidden" id="mapCateAttrId" />
    <form class="layui-form layui-form-pane" id="mapProcessingForm">
      <div class="layui-col-md12 layui-col-lg12" style="position: relative;">
        <label class="layui-form-label">平台类目</label>
        <div class="temuRemark">Temu刊登不支持自动映射成分比例，如需刊登需要填写成分比例的类目请手动刊登！</div>
        <div class="layui-input-block">
          <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="plat_choose">选择分类</button>
          <input type="hidden" name="cateName" value="" id="plat_choose_inp" />
          <input type="hidden" name="cateId" value="" id="plat_chooseid_inp" />
          <input type="hidden" name="cateIds" value="" id="plat_cateIds_inp" />
        </div>
        <div class="layui-col-md12 layui-col-lg12" id="platAttr"></div>
      </div>
      <div class="platAttrMapbox">
        <h3 class="disabled">属性映射</h3>
        <!-- //!克隆节点的盒子 -->
        <div id="batchplatAttrMapbox"></div>
        <div class="layui-col-md12 layui-col-lg12">
          <div class="layui-form-item" style="display: none">
            <div class="layui-input-block taRight">
              <button class="layui-btn" lay-submit="" lay-filter="addBtn" id="submitAddResource">提交</button>
              <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</script>

<script type="text/html" id="mapPlatAttrValue">
  <div class="layui-form-item">
    <select name="mapPlatAttrValueChoose" lay-verify="required" lay-filter="mapPlatAttrValueChoose" id="mapPlatAttrValueChoosev" lay-search></select>
  </div>
</script>
<input type="hidden" name="action" value="" id="action" />
<!-- //!克隆节点 -->
<div class="clone">
  <div class="layui-col-md12 layui-col-lg12 platAttrMapOne visibility_hidden">
    <div class="layui-col-md12 layui-col-lg12">
      <div class="layui-col-md12 layui-col-lg12 attrValueBox">
        <input type="hidden" id="platCateAttrId" value="" />
        <div class="layui-col-md2 layui-col-lg2" id="platCateAttrName">:平台属性名1</div>
        <div class="layui-col-md2 layui-col-lg2" id="pmc_Input_type">：录入类型</div>
        <div class="layui-col-md8 layui-col-lg8">
          <!-- //!映射OA属性名  platAttrMapFive -->
          <div class="platAttrMapFive disabled">
            <div class="layui-col-md4 layui-col-lg4">
              <div class="layui-col-md5 layui-col-lg5">映射OA属性名</div>
              <div class="layui-col-md7 layui-col-lg7">
                <select name="cateAttrName" id="cateAttrName" lay-search="" lay-filter="cateAttrName" readonly></select>
              </div>
            </div>
          </div>
          <!-- //!直接默认平台属性值  platAttrMapThree -->
          <div class="layui-col-md4 layui-col-lg4 platAttrMapThree disabled">
            <div class="layui-col-md5 layui-col-lg5">直接默认平台属性值</div>
            <div class="layui-col-md7 layui-col-lg7">
              <div class="inp"></div>
              <select name="defaultPlatAttrValuesel" lay-search="" id="defaultPlatAttrValuesel" lay-filter="defaultPlatAttrValuesel" readonly>
                :optionlocation
                <option value=""></option>
                <option value="OA_color">OA_color</option>
                <option value="OA_size">OA_size</option>
                <option value="OA_style">OA_style</option>
              </select>
            </div>
            <!-- 多选 -->
            <div class="layui-col-md7 layui-col-lg7 disN defaultPlatAttrValueselMultiParent">
              <select  xm-select-search
                  id="defaultPlatAttrValueselMulti"
                  xm-select="defaultPlatAttrValueselMulti" xm-select-search-type="dl" xm-select-create="">
              </select>
            </div>
          </div>

          <!-- //!直接默认平台单位  platAttrMapThree -->
          <div class="layui-col-md4 layui-col-lg4" id="platUnit">
            <div class="layui-col-md5 layui-col-lg5">直接默认平台单位</div>
            <div class="layui-col-md7 layui-col-lg7">
              <div class="iptmapUnit"></div>
              <select name="defaultPlatUnitsel" lay-search="" id="defaultPlatUnitsel" lay-filter="defaultPlatUnitsel" readonly>
                :optionlocation
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- //!table的盒子  platAttrMapFour -->
    <div class="layui-col-md12 layui-col-lg12 platAttrMapFour disabled">
      <div class="batchMapPlat layui-form"></div>
      <table class="layui-table" id="tablebox" lay-filter="tablebox"></table>
      <!-- <input type="hidden" name="cateId" value="" id="plat_choose_inp" /> -->
    </div>
  </div>
</div>
<iframe id="productlist_customCodeIframe" scrolling="yes" class="disN"> </iframe>

<script type="text/html" id="platformCategoryMapping_cateNameTpl">
  <div>{{d.cateName}}</div>
  <div class="{{d.complete ? 'fGreen' : 'fRed'}}">{{d.complete ? '完整' : '不完整'}}</div>
</script>

<!-- <span>OA属性值：</span><input type="text" id="iptAttrValue" class="layui-input" placeholder="批量映射平台属性值" disabled />
<select name="platAttrValue" id="platAttrValue" lay-search="" readonly></select> -->
--> <%--富文本编辑器--%>
<!-- <%--<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>--%> -->
<!-- <script type="text/javascript" src="${ctx}/static/request.js"></script> -->
<script src="${ctx}/static/util/we.js"></script>
<script src="${ctx}/static/js/commodity/template/platformCategoryMapping.js"></script>

<script src="${ctx}/static/UploadImage.js"></script>
<!-- <script type="text/javascript" src="${ctx}/static/js/commodity/product/productlist.js?v=${ver}"></script> -->
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js?v=${ver}"></script>
<!-- <script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script> -->
