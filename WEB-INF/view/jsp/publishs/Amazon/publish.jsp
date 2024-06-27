<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<title>amazon刊登</title>
<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
<style>
#createTempAndPublishAmazonTpl .layui-border-box.layui-table-view,
#createTempAndPublishAmazonTpl .layui-table-box,
#createTempAndPublishAmazonTpl .layui-table-box .layui-table-body  {
  overflow: visible;
}
.descItem {
    margin-top: 10px;
    margin-left: 20px;
  }
.descItem span{
  display: inline-block;
  max-width: 800px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.bg-grey {
      background-color: #eee;
  }
  .redTitle {
    color: #f00;
  }
  .greenTitle {
    color: green;
  }
  #amazonPublish_extImg {
    overflow: hidden
  }
  .testClass {
    display: none;
  }
  .ImgDivOut .layui-form-radio,
  .swatch .layui-form-radio {
      margin: 0;
  }

  #amazonPublish_extImg li {
    float: left;
    margin-right: 10px
  }

  #amazonPublish_searchForm .layui-form-item {
    margin-bottom: 0
  }

  td[class="colspan_td"] > table > tbody tr:first-child td {
    border-top: none;
  }

  td[class="colspan_td"] > table > tbody tr:last-child td {
    border-bottom: none;
  }

  td[class="colspan_td"] > table > tbody tr td {
    border-left: none;
    border-right: none;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
  }

  #amazonPublish_table th,
  #amazonPublish_table td {
    text-align: center;
    padding: 5px 0;
    white-space: normal;
    overflow: visible;
    word-wrap: break-word;
  }

  .amazonPublish_table_head table,
  .amazonPublish_table_body table {
    width: 100%;
    margin: 0;
    table-layout: fixed;
  }
  .amazonSubImg_UL li {
    float: left;
    margin: 5px
  }
  .redStar:before {
    content: "*";
    color: red;
    font-size: 20px;
    position: relative;
    top: 7px;
    right: 10px;
  }
  
  .disN {
    display: none;
  }

  #amazonPublish_table .amazonPublish-listfail:hover {
    cursor: pointer;
  }
  .amazonPublish_detail_table img,
  .imgContains img {
    width: 100px;
    height: 100px;
  }
  .amazonPublish_extPic_edit_local{
    margin-left: 5px;
  }
  .mg_50 {
    margin: 20px 50px;
  }
  #amazonPublishaddHiddenAttrInfo .layui-form-checkbox span{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 240px;
  }
  #amazonGenerateFromGPTLayTplId .layui-form-label {
    width: 100px;
    padding: 0 10px;
  }
  #amazonGenerateFromGPTPromptId .layui-form-label {
    width: 100px;
  }
  #amazonGenerateFromGPTLayTplId .layui-form-label.first-label {
    padding: 9px 10px;
  }
  #amazonGenerateFromGPTLayTplId .layui-input-block,
  #amazonGenerateFromGPTPromptId .layui-input-block {
    margin-left: 130px;
  }
</style>
<div class="amazonpublish_uploadPic"></div>
<div class="layui-fluid" id="amazon_publish">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="amazonPublish_searchForm" lay-filter="amazonPublish_searchForm">
            <div class="layui-form-item layui-row">

              <input name="listingStatus" value="-2" type="hidden">
              <input name="shippingStatus" value="" type="hidden">

              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select id="amazonPublish_group_sel" name="orgId"
                          lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" lay-search>
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select id="amazonPublish_salesman_sel" name="sellerId"
                          lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                          data-roleList="amazon专员">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select name="storeAcctId" data-platcode="amazon"
                          lay-filter="amazonPublish_storeAcctId"
                          lay-search class="store_hp_custom">
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select name="salesSite" lay-filter="amazonPublish_salesSite" class="site_hp_custom" placeholder="选择店铺后显示">
                    <option value=""></option>
                  </select>
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2 tempFileNameShow">
                <label class="layui-form-label">刊登模板</label>
                <div class="layui-input-block">
                  <select name="tempFileName" id="tempFileNameItem" placeholder="刊登时必选" lay-search>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 tempFileNameHide disN">
                <label class="layui-form-label">模板创建人</label>
                <div class="layui-input-block">
                  <select xm-select="amazonPublish_createrId" id="amazonPublish_createrId" name="creatorId" xm-select-search
                          xm-select-search-type="dl" xm-select-skin="normal"></select>
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">图片状态</label>
                <div class="layui-input-block">
                  <select name="hasWhiteImg">
                    <option value="">全部</option>
                    <option value="0">无图</option>
                    <option value="1">部分有图</option>
                    <option value="2" selected>全有图</option>
                  </select>
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">选择类目</label>
                <div class="layui-input-block">
                  <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                          id="amazonPublish_item">选择类目
                  </button>
                  <i class="layui-icon layui-icon-delete"
                     onclick="clearCate('LAY-publishs-amazon-publish-div','LAY-publishs-amazon-publish-hidden')"
                     style="cursor:pointer" title="删除产品类目"></i>
                  <input type="hidden" id="LAY-publishs-amazon-publish-hidden" name="cateId">
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">开发类型</label>
                <div class="layui-input-block">
                  <select name="devType" lay-search>
                    <option value="" selected>全部</option>
                    <c:forEach items="${devTypeEnums}" var="devType">
                      <option value="${devType.getName()}">${devType.getName()}</option>
                    </c:forEach>
                  </select>
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品标签</label>
                <div class="layui-input-block">
                  <select name="tag" lay-search>
                            <option value="" selected>全部
                        <c:forEach items="${prodTagMap}" var="prodTag">
                            <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                        </c:forEach>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select xm-select="selectAttr_amazon" xm-select-search xm-select-search-type="dl"
                          xm-select-skin="normal" lay-filter='selectAttr_amazon' name="logisAttrContents">
                    <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                      <option value="${logisAttrEnum.getName()}">${logisAttrEnum.getName()}</option>
                      <option value='no_${logisAttrEnum.getName()}'>
                        不含${logisAttrEnum.getName()}</option>
                    </c:forEach>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品归属人</label>
                <div class="layui-input-block" style="display: flex;">
                  <select id="selectDepart_amazon" lay-filter="selectDepart_amazon" name="bizzOwnerDepart">
                    <option value="">请选择部门</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                  <select xm-select="selectMan_amazon" id="selectMan_amazon" name="bizzOwnerIds" xm-select-search
                          xm-select-search-type="dl" xm-select-skin="normal">
                    <option value="">请选择人员</option>
                  </select>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">侵权状态</label>
                <div class="layui-input-block">
                  <select name="tortBanListing">
                    <%--<c:forEach items="${tortBanListings}" var="tortBanListing">--%>
                      <%--<option value="${tortBanListing.name()}">${tortBanListing.getText().replace("该平台","amazon")}</option>--%>
                    <%--</c:forEach>--%>
                      <option value="CURRENT_PLAT">amazon不侵权</option>
                      <option value="ANY_PLAT" selected>所有平台都不侵权</option>
                      <option value="ALL">全部</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">是否禁售</label>
                <div class="layui-input-block">
                  <select name="isCanSale">
                    <option value="" >全部</option>
                    <option value="true" selected>非禁售</option>
                    <option value="false">禁售</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">在售状态</label>
                <div class="layui-input-block">
                  <%--<select name="isSale">--%>
                    <%--<option value="">全部</option>--%>
                    <%--<option value="true" selected>在售</option>--%>
                    <%--<option value="false">停售</option>--%>
                  <%--</select>--%>
                  <select name="isSaleStr" id="amaPublishisSaleStr" xm-select="isSaleStr" xm-select-search
                          xm-select-search-type="dl" xm-select-skin="normal">
                    <option value="0">停售</option>
                    <option value="1">部分在售</option>
                    <option value="2">在售</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">刊登情况</label>
                <div class="layui-input-block">
                  <select name="isPublish">
                    <option value="">全部</option>
                    <option value="false" selected>未刊登</option>
                    <option value="true">已刊登</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">刊登人</label>
                <div class="layui-input-block">
                  <input type="text" placeholder="多个英文逗号分隔" class="layui-input" name="createIdList" value="" list="amazonPublishCreater">
                  <datalist id="amazonPublishCreater">
                    <option value="">请选择</option>
                  </datalist>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">生成情况</label>
                <div class="layui-input-block">
                  <select name="isGenerate">
                    <option value="">全部</option>
                    <option value="false" selected>未生成</option>
                    <option value="true">已生成</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2" id="amazon_time">
                <div class="layui-form-label labelSel">
                  <select name="timeType">
                      <option value="AUDIT_TIME">基础模板审核时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" name="time" autocomplete="off" class="layui-input"
                         id="amazonPublishTime">
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">重量(g)</label>
                <div class="layui-input-block">
                  <div class="layui-col-md6 layui-col-lg6">
                    <input type="number" class="layui-input"placeholder="g"  autocomplete="off" name="weightStart">
                  </div>
                  <div class="layui-col-md6 layui-col-lg6">
                    <input type="number" class="layui-input"placeholder="g"  autocomplete="off" name="weightEnd">
                  </div>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">成本</label>
                <div class="layui-input-block">
                  <div class="layui-col-md6 layui-col-lg6">
                    <input type="number" class="layui-input" placeholder="￥"  autocomplete="off" name="costStart">
                  </div>
                  <div class="layui-col-md6 layui-col-lg6">
                    <input type="number" class="layui-input" placeholder="￥" autocomplete="off" name="costEnd">
                  </div>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                <label class="layui-form-label">库存</label>
                <div class="layui-input-block">
                  <input type="checkbox" name="filterZeroStock" lay-skin="primary" title="过滤零库存">
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <div class="amazonPublish_searchType1">
                  <select name="searchType1" lay-filter="amazonPublish_showHideVagueFlag">
                    <option value="pSkus">模板父SKU</option>
                    <option value="sSkus">模板子SKU</option>
                    <option value="cnTitle">商品中文</option>
                    <option value="enTitle">商品英文</option>
                  </select>
                  </div>
                  <div class="amazonPublish_searchType2 disN">
                  <select name="searchType2" lay-filter="amazonPublish_showHideVagueFlag">
                    <option value="pSkus">模板父SKU</option>
                    <option value="sSkus">模板子SKU</option>
                    <option value="cnTitle">商品中文</option>
                    <option value="enTitle">商品英文</option>
                    <option value="storePSkuList">店铺父SKU</option>
                    <option value="storeSSkuList">店铺子SKU</option>
                  </select>
                  </div>
                </div>
                <div class="layui-input-block inputAndSelect">
                  <div class="layui-col-md7 layui-col-lg7">
                    <input name="searchText" type="text" class="layui-input  inputBorRadLeft" placeholder="" value="">
                  </div>
                  <div id="amazon_skuVagueFlag_div" class="layui-col-md5 layui-col-lg5">
                    <select name="skuVagueFlag">
                      <option value="false">精确</option>
                      <option value="true">模糊</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="layui-col-lg4 layui-col-md4">
              <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">错误类型</label>
                <div class="layui-input-block">
                  <select name="listingRespCode">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg6 layui-col-md6">
                <input class="layui-input" placeholder="错误信息" name="listingRespDesc">
              </div>
              </div>
                <div class="layui-col-lg2 layui-col-md2" id="orderByEl">
                    <label class="layui-form-label">排序</label>
                      <div class="layui-input-block">
                        <select name="orderBy">
                          <option value="1">基础模板审核时间倒序</option>
                          <option value="2">基础模板审核时间正序</option>
                          <option value="3">亚马逊直邮30天销量倒序</option>
                          <option value="4">公司30天销量倒序</option>
                          <option value="5">虾皮30天销量倒序</option>
                          <option value="6">eBay30天销量倒序</option>
                        </select>
                      </div>
                </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">自拍图状态</label>
                <div class="layui-input-block">
                  <%--<select name="selfImgStatus">--%>
                    <%--<option value="">全部</option>--%>
                    <%--<option value="0">无自拍图</option>--%>
                    <%--<option value="1">有自拍图</option>--%>
                  <%--</select>--%>
                    <%--0 无图   1  有图  2 部分有图--%>
                  <select name="selfImgStatus_amazonpublish" id="selfImgStatus_amazonpublish"  xm-select="selfImgStatus_amazonpublish" xm-select-search xm-select-search-type="dl"
                          xm-select-skin="normal">
                    <option value="1">有图</option>
                    <option value="2">部分有图</option>
                    <option value="0">无图</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 disN" id="amazonPublish_btn_keyword">
                <div class="layui-form-label labelSel">
                  <select name="keywordType">
                    <option value="1">关键词（分词）</option>
                    <option value="0">关键词（不分词）</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" name="keyword" autocomplete="off" class="layui-input"
                         id="" placeholder="多个以空格分隔">
                </div>
              </div>
              <div class="layui-col-lg4 layui-col-md4 disN" id="amazonPublish_btn_listingDataSource">
                <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">刊登数据来源</label>
                <div class="layui-input-block">
                  <select name="listingDataSource">
                    <option value="">全部</option>
                    <option value="1">商品刊登</option>
                    <option value="2">新模板刊登</option>
                  </select>
                </div>
                </div>
                  <div class="layui-col-lg6 layui-col-md6">
                    <select xm-select="amazonPublish_creater" id="amazonPublish_creater" name="creatorIds" xm-select-search
                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">全站点刊登状态</label>
                <div class="layui-input-block">
                  <select name="isSitePublish" id="isSitePublish_amazonPublsih">
                    <option value=""></option>
                    <option value="false">未刊登</option>
                    <option value="true">已刊登</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 pl20">
                  <button class="layui-btn layui-btn-sm" type="button"
                          onClick="amazonPublish_searchProd()" id="amazonPublish_search">搜索
                  </button>
                  <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset"
                          id="amazonPublish_reset">清空
                  </button>
                  <div id="amazonPublish_save" class="inline_block pora"></div>
              </div><br />
              <div class="layui-col-lg12 layui-col-md12 pl20" id="LAY-publishs-amazon-publish-div"></div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="amazonPublishCard">
        <div class="layui-card-body">
          <div id="amazon_btn_show_hide" style="position: absolute; right: 10px; z-index: 10">
            <permTag:perm funcCode="amazon_online_prod_export">
            <button class="layui-btn layui-btn-sm layui-btn-primary disN" type="button"
                    id="amazonPublish_btn_download"
                    onclick="amazonPublish_btn_download()">下载刊登文件
            </button>
            </permTag:perm>
              <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                      id="amazonPublish_btn_genListing"
                      onclick="amazonPublish_genToListingProd()">生成店铺商品
              </button>
              <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                      id="amazonPublish_btn_delListing"
                      onclick="amazonPublish_deletelisting()">删除店铺商品
              </button>
              <div class="layui-input-inline w100 layui-form disN" id="amazonPublish_div_selPubStyle">
                <select id="amazonPublish_selPubStyle" lay-filter="amazonPublish_selPubStyle_filter">
                  <option value="" disabled selected>刊登</option>
                  <option value="1">立即刊登</option>
                  <option value="2">定时刊登</option>
                </select>
              </div>
              <button id="amazonPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                      type="button" onclick="amazonPublish__canclePublishOnTiming()">取消定时刊登
              </button>

              <button id="amazonPublish_btn_pubNow" class="layui-btn layui-btn-sm disN" type="button"
                      onclick="amazonListingPublish('',false)">发布上架
              </button>
              <button id="amazonPublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger"
                      type="button" onclick="amazonPublish_exportskumapping()">导出SKU映射
              </button>
              <button id="amazonPublish_btn_setStoreItems" class="layui-btn layui-btn-sm layui-btn-primary disN"
                     type="button">生成店铺商品
             </button>
            <button id="amazonPublish_btn_resetStoreItems" class="layui-btn layui-btn-sm layui-btn-normal disN">取消生成文件</button>
              <button id="amazonPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-primary disN"
                      type="button" onclick="amazonPublish_OnTiming()">定时刊登
              </button>
              <button id="amazonPublish_btn_setShipping" class="layui-btn layui-btn-sm layui-btn-primary disN"
                      type="button" onclick="amazonPublish__setShipping()">设置运费
              </button>
              <button id="amazonPublish_btn_rePubNow" class="layui-btn layui-btn-sm layui-btn-primary disN"
                      type="button" onclick="amazonListingPublish('',false)">重新发布
              </button>
              <button  type="button" id="amazonPublish_btn_copyListing" class="layui-btn layui-btn-sm layui-btn-primary disN"
                     onclick="amazonPublish__copy_listing()">批量复制</button>
              <button  type="button" id="amazonPublish_btn_exportBaseInfo" class="layui-btn layui-btn-sm layui-btn-primary"
                       onclick="amazonPublish_exportBaseInfo()">导出基础信息</button>
            </div>
          <div class="layui-tab" lay-filter="amazonPublish_tab" id="amazonPublish_tab">
            <ul class="layui-tab-title" id="amazonPublishHeadTab">
              <li data-value="-2" class="layui-this" id="totalNum">商品</li>
              <li data-value="4" id="amazonPublishTemp">亚马逊模板</li>
              <li data-value="0" id="toListingNum">待刊登</li>
              <li data-value="6" id="amazonPublishToFile">待生成文件</li>
              <li data-value="3" id="amazon_listingNum">刊登中</li>
              <li data-value="1" id="listingSucNum">刊登成功</li>
              <li data-value="2" id="listingFailNum">刊登失败</li>
            </ul>
            <div class="layui-tab-content">
              <div id="amazonPublish_table">
              </div>
              <div id="amazonPublish_pagination" class="customPagination"></div>
              <!--模板文件-->
              <script type="text/html" id="amazonPublish_tpl_tableRender">
                <%--<div class="amazonPublishShow">--%>
                  <table id="amazonPublishTable" class="layui-table" lay-filter="amazonPublishTable"></table>
                <%--</div>--%>
              </script>

              <script type="text/html" id="amazonPublish_tpl">
                <%--<div class="amazonPublishHide">--%>
                <div class="amazonPublish_table_head">
                  <table class="layui-table">
                    <colgroup>
                      <col width="30px"/>
                      <col width="70px"/>
                      <col width="15%"/>
                      <col width="10%"/>
                      <%--<col width="7%"/>--%>
                      <col width="10px"/>
                      <col width="50px"/>
                      <col width="60px"/>
                      <col width="60px"/>
                      <col width="5%"/>
                      <col width="7%"/>
                        <col width="7%"/>
                      <col width="7%"/>
                      <col width="7%"/>
                    </colgroup>
                    <thead>
                    <tr>
                      <th>
                        <div class="layui-form">
                          <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                        </div>
                      </th>
                      <th>缩略图</th>
                      <th>标题</th>
                      <th>父SKU</th>
                      <%--<th class="storeSkuInfo">店铺父SKU</th>--%>
                      <th>
                      </th>
                      <th>模板子SKU</th>
                      <th class="storeSubSkuInfo">店铺子SKU</th>
                      <th>颜色</th>
                      <th>尺寸</th>
                      <th class="listingInfo">售价</th>
                      <th>在售</th>
                      <th>可用/在途/未派</th>
                      <th class="salesNum disN">销量</th>
                      <th class="timeClass">刊登</th>
                      <th>操作</th>
                    </tr>
                    </thead>
                  </table>
                </div>
                <div class="amazonPublish_table_body" style="margin-top: -6px">
                  <table class="layui-table">
                    <colgroup>
                      <col width="30px"/>
                      <col width="70px"/>
                      <col width="15%"/>
                      <col width="10%"/>
                      <%--<col width="7%"/>--%>
                      <col width="10px"/>
                      <col width="50px"/>
                      <col width="60px"/>
                      <col width="60px"/>
                      <col width="5%"/>
                      <col width="7%"/>
                      <col width="7%"/>
                      <col width="7%"/>
                      <col width="7%"/>
                    </colgroup>
                    <tbody>
                    {{ each data v i}}
                    <tr class="skus-tr">
                      <td>
                        <div class="layui-form">
                          <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{
                                 v.id }}
                                 name="id" data-lastsubmitid="{{v.lastSubmitId}}" data-storeAcctId="{{v.storeAcctId}}">
                        </div>
                      </td>
                      <td>
                        <img width="60" height="60" data-original="{{GlobalDomainImgSrc(v.mainImageUrl )}}"
                             class="img_show_hide lazy b1"
                             data-onerror="layui.admin.img_noFind()">
                      </td>
                      <td>
                          <div class="listingInfo">
                            {{ v.itemName }}<br/>
                          </div>
                          <div class="notlistingInfo">
                              {{ v.itemName }}<br/>
                              {{ if v.mackRefineStatus == 1}}
                                {{ if v.selfImgStatus == 1 || v.selfImgStatus == 2}}

                                <span class="hp-badge layui-bg-green" title="精修商品">精</span>
                                {{ /if}}
                              {{ /if}}
                          </div>
                        <span class="layui-gray listingSuccInfo">
                            <a target="_blank" style="color:blue"
                               href="https://www.amazon.com/c/{{ v.storeProdPId }}">{{ v.storeProdPId }}</a>
                        </span>
                        {{if v.listingStatus == 0}}
                          创建人：{{ v.creator||'' }}<br>
                        创建时间：{{v.createTime| dateFormat 'yyyy-MM-dd hh:mm'}}
                        {{/if}}
                      </td>
                      <td>
                        <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}}
                           style="color:blue">商品：<span class="pSku_div">{{v.pSku }}</span></a>
                          {{if v.onlinePublishStatus||v.existListing}}
                            {{if v.onlinePublishStatus}}
                            <span class="layui-bg-green">已刊登</span>
                            {{/if}}
                            {{if v.existListing}}
                            <span class="layui-bg-orange">已生成</span>
                            {{/if}}
                            <br/>
                          {{/if}}
                          <div style="color:#999;font-size: 5px">{{ v.prodAttrList}}</div>
                          <div>
                              {{each v.logisAliaList}}
                              <span class="layui-bg-red hp-badge ml5" title="物流属性:{{$value.logisAttr}}">{{ $value.alia }}</span>
                              {{/each }}
                          </div>

                      <div class="storeSkuInfo">
                        <div class="storeSku_div">
                          店铺：{{ v.storePSku||'不存在' }}
                        </div>
                        {{if v.listingStatus == 0}}
                        <span class="layui-bg-orange hp-badge ml5 amazonPublish_status  amazonPublish-unlist">待</span>
                        {{else if v.listingStatus == 1}}
                        <span class="layui-bg-green hp-badge ml5 amazonPublish_status amazonPublish-listsucc">已</span>
                        {{else if v.listingStatus == 2}}
                        <span class="layui-bg-gray hp-badge ml5 amazonPublish_status amazonPublish-listfail">败</span>
                        <span class="layui-hide amazonPublish-listfailreason">{{v.listingRespMsg}}</span>
                        {{else if v.listingStatus == 3}}
                        <span class="layui-bg-blue hp-badge ml5 amazonPublish_status amazonPublish-inlist">中</span>
                        {{else if v.listingStatus == 6}}
                        <span class="hp-badge ml5 amazonPublish_status" style="background-color: #5FB878;color: #fff;">文</span>
                        {{/if}}
                      </div>
                      </td>
                      <%--<td class="storeSkuInfo">--%>
                        <%--<div class="storeSku_div">--%>
                          <%--{{ v.storePSku||'不存在' }}--%>
                        <%--</div>--%>
                        <%--{{if v.listingStatus == 0}}--%>
                        <%--<span class="layui-bg-orange hp-badge ml5 amazonPublish_status  amazonPublish-unlist">待</span>--%>
                        <%--{{else if v.listingStatus == 1}}--%>
                        <%--<span class="layui-bg-green hp-badge ml5 amazonPublish_status amazonPublish-listsucc">已</span>--%>
                        <%--{{else if v.listingStatus == 2}}--%>
                        <%--<span class="layui-bg-gray hp-badge ml5 amazonPublish_status amazonPublish-listfail">败</span>--%>
                        <%--<span class="layui-hide amazonPublish-listfailreason">{{v.listingRespMsg}}</span>--%>
                        <%--{{else if v.listingStatus == 3}}--%>
                        <%--<span class="layui-bg-blue hp-badge ml5 amazonPublish_status amazonPublish-inlist">中</span>--%>
                        <%--{{else if v.listingStatus == 6}}--%>
                        <%--<span class="hp-badge ml5 amazonPublish_status" style="background-color: #5FB878;color: #fff;">文</span>--%>
                        <%--{{/if}}--%>
                      <%--</td>--%>
                      <td colspan="8" style="padding: 10px 0" class="colspan_td">
                        <table style='width: 100%'>
                          <tbody>
                          {{ each v.prodListingSubSkuAmazons }}
                          {{if $index<5}}
                          <tr>
                            {{else}}
                          <tr class="myj-hide">
                            {{ /if }}
                            <td width="30">
                              <div class="layui-form">
                                {{if $value.id != ''}}
                                <input type="checkbox" class="sid-cbox"
                                       lay-skin="primary"
                                       value={{$value.id}}>
                                {{/if}}
                                <input hidden type="text" class="prodTempId-text" value="{{$value.prodTempId}}">
                              </div>
                            </td>
                            <td width='160'>
                              <span>
                                  {{if $value.ssku}}
                                    {{ $value.ssku }}
                                  {{else}}
                                  <font class="layui-gray">不存在</font>
                                  {{/if}}
                              </span>
                              {{if $value.listingStatus == 0}}
                              <span class="layui-bg-orange hp-badge ml5  amazonPublish-unlist">待</span>
                              {{else if $value.listingStatus == 1}}
                              <span class="layui-bg-green hp-badge ml5 amazonPublish-listsucc">已</span>
                              {{else if $value.listingStatus == 2}}
                              <span class="layui-bg-gray hp-badge ml5 amazonPublish-listfail">败</span>
                              <span class="layui-hide amazonPublish-listfailreason">{{$value.listingRespMsg}}</span>
                              {{else if $value.listingStatus == 3}}
                              <span class="layui-bg-blue hp-badge ml5 amazonPublish-inlist">中</span>
                              {{else if v.listingStatus == 6}}
                              <span class="hp-badge ml5 amazonPublish_status" style="background-color: #5FB878;color: #fff;">文</span>
                              {{/if}}
                            </td>
                            <td class="storeSubSkuInfo" width='160'>{{ $value.storeSSku}}
                            </td>
                            <td>{{ $value.color }}</td>
                            <td>{{ $value.size }}</td>
                            <td class="listingInfo">{{ $value.standardPrice }}{{ $value.currency }}</td>
                            <td>
                              {{if null==$value.isSale}}
                              {{else if $value.isSale}}
                              <span class="layui-green amazonPublish-isSale">在售</span>
                              {{else}}
                              <span class="layui-gray amazonPublish-isNotSale">停售</span>
                              {{/if}}
                            </td>
                            <td>{{ (($value.stockNum || 0) - ($value.reservationNum || 0))  + '/' + ($value.orderNotInNum || 0) + '/' + ($value.lackUnPaiNum || 0) }}</td>
                          </tr>
                          {{ /each }}
                          </tbody>
                        </table>
                        {{ if v.prodListingSubSkuAmazons && v.prodListingSubSkuAmazons.length > 5}}
                        <a href="javascript:" onclick="changeColspantable(this);"
                           class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuAmazons.length}})</a>
                        {{/if}}
                      </td>
                      <td class="salesNum disN">
                          亚马逊：{{v.amazonSalesNum|| 0}}<br>
                          公司：{{v.compSalesNum|| 0}}<br>
                          虾皮：{{v.shopeeSalesNum|| 0}}
                      </td>
                      <td class="timeClass" style="width: 150px">
                          <div class="amazon_creater disN">刊登人：{{v.creator|| ""}}</div>
                          {{if v.createTime}}
                          <span class="layui-green createTime">创建时间:{{v.createTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span><br>
                          {{/if}}
                        <div class="auditTime">
                          {{if v.auditTime}}
                          <span class="layui-green">审核于:{{v.auditTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                          {{/if}}
                        </div>
                        <div class="listingTime">
                          {{if v.listingTime}}
                          <span class="layui-green">刊登于:{{v.listingTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                          {{/if}}
                        </div>
                        <div class="listTiming">
                          {{if v.listTiming}}
                          <span class="layui-green">定时:{{v.listTiming| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                          {{else}}
                          <span class="layui-green">刊登中</span>
                          {{/if}}
                        </div>
                        <div class="listFileTiming">
                          <span class="layui-green">生成刊登文件</span>
                        </div>
                      </td>
                      <td>
                        <div class="detailInfoBtn">
                          <button type="button" class="layui-btn layui-btn-xs mb3"
                                  onclick="amazonPublish__layer_amazon('{{v.id}}','{{v.listingDataSource}}','{{v.prodPId}}','{{v.categoryId}}','{{v.salesSite}}','{{v.pSku}}','{{v.listingStatus}}')">详情
                          </button>
                          <br>
                        </div>
                        <button type="button" class="layui-btn layui-btn-xs mb3"
                                onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接
                        </button>
                        <br>
                        <button type="button" class="layui-btn layui-btn-xs mb3"
                                onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态
                        </button>
                        <br>
                        <div class="publishBtn">
                          <button type="button"
                                  class="layui-btn layui-btn-warm  layui-btn-xs mb3"
                                  onclick="amazonListingPublish('{{v.id}}',false)">发布上架
                          </button>
                          <br>
                        </div>
                        <button type="button"
                                class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn"
                                dataid="{{v.prodPId}}">开发思路
                        </button>
                        <button class="layui-btn layui-btn-xs layui-btn-xs createTempAndPublishBtn" 
                            onclick="createTempAndPublish('{{v.prodPId}}')">建模刊登
                        </button>

                        <button class="layui-btn layui-btn-xs layui-btn-xs operateLogBtn" 
                            onclick="showOperateLog('{{v.pSku}}', '{{v.id}}')">操作日志
                        </button>
                        <br>
                      </td>
                    </tr>
                    {{ /each }}
                    </tbody>
                  </table>
                </div>
              </script>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 操作日志 -->
<script id="operateLogContainer" type="text/html">
  <div class="mg_50">
    <div id="operateLogTable"></div>
  </div>
</script>

<!-- 建模刊登start -->
<script id="storeTemplateModifyAmazonTemplateContainer0" type="text/html">
  <div class="layui-col-lg8 layui-col-md8">
    <label class="layui-form-label redStar">标题</label>
    <div class="layui-input-block">
      <div style="display: flex;line-height: 32px;">
        <input name="enTitle" class="layui-input ifFocusInput" data-prodpsku="{{d.prodPSku}}" value="{{ d.itemName||'' }}">
        <!-- <span id="amazonPublishAmazonTemplate_titleLength" class="{{(d.itemName||'').length>150 ? 'redTitle': 'greenTitle'}}" style="margin-left: 10px; font-weight: 700;">{{(d.itemName||'').length}}</span> -->
      </div>
        <div class="mt05">标题不含品牌，保存并发布时系统自动附加品牌</div>
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2 layui-col-md-offset1" style="display: none;" id="shippingType_publish">
    <label class="layui-form-label">发货类型</label>
    <div class="layui-input-block">
      <select name="shippingType">
        <option value=""></option>
        <option value="1">空运</option>
        <option value="2">海运</option>
      </select>
    </div>
  </div>
  <div class="layui-col-lg8 layui-col-md8">
    <div id="titleRemark" style="display: flex;height: 18px;line-height: 18px;font-size:12px;margin-left: 110px;">
    </div>
  </div>
</script>

<script id="storeTemplateModifyAmazonTemplateContainer1" type="text/html">
  <input name="creator" type="hidden" value="{{ d.creator||'' }}">
  <input name="creatorId" type="hidden" value="{{ d.creatorId||'' }}">
  <input name="modifyId" type="hidden" value="{{ d.modifyId||'' }}">
  <input name="modifyer" type="hidden" value="{{ d.modifyer||'' }}">
  <input name="createTime" type="hidden" value="{{ d.createTime||'' }}">
  <div class="layui-form-item">
      <div class="layui-col-lg8 layui-col-md8">
          <label class="layui-form-label redStar">父SKU</label>
          <div class="layui-input-block">
              <input name="pSku" class="layui-input" readonly value="{{ d.prodPSku||'' }}">
              <input type="hidden" name="storePSku" class="layui-input" readonly value="{{ d.storePSku||'' }}">

          </div>
      </div>
      <div class="layui-col-lg8 layui-col-md8">
          <label class="layui-form-label redStar">OA类目</label>
          <div class="layui-input-block">
              <input name="cateTreeName" class="layui-input" readonly value="{{ d.cateTreeName||'' }}">
          </div>
      </div>
  </div>
</script>

<script id="storeTemplateModifyAmazonTemplateContainer2" type="text/html">
  <div class="layui-form-item" id="createSSkuTitle" style="display: none;">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">标题（子）</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input ifFocusInput" data-prodpsku="{{d.prodPSku}}" name="subTitle" id="createSubTitle">
      </div>
    </div>
  </div>

  <div class="layui-form-item">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点1</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_1" maxlength="500">
        <span id="AmazonTemplate_sellingPoint1Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonTemplate_sellingPoint1_1Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg2 layui-col-md2">
      <button type="button" class="layui-btn layui-btn-sm" id="amazonApplyTempDesc">引用基础模板描述</button>
      <span class="layui-btn layui-btn-sm" id="amazonGenerateFromGPT">GPT生成</span>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点2</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_2" maxlength="500">
        <span id="AmazonTemplate_sellingPoint2Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_2Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点3</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_3" maxlength="500">
        <span id="AmazonTemplate_sellingPoint3Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_3Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点4</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_4" maxlength="500">
        <span id="AmazonTemplate_sellingPoint4Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_4Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点5</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_5" maxlength="500">
        <span id="AmazonTemplate_sellingPoint5Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_5Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10">
      <label class="layui-form-label redStar">商品描述</label>
      <div class="layui-input-block">
        <textarea id="amazonPublishDesc" style="display: none"></textarea>
        <!-- <textarea class="layui-textarea" name="prodDesc">{{ d.productDescription||'' }}</textarea> -->
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
      <label class="layui-form-label">关键词:
      </label>
      <div class="layui-input-block">
        <div class="tagsinput-primary form-group">
          <input class="tagsinput" name="genericKeywords" data-role="tagsinput" type="text" value="{{ d.genericKeywords||'' }}">
        </div>
        <!-- <input  type="text" name="genericKeywords"
                class="layui-input" value="{{d.genericKeywords}}"> -->
      </div>
    </div>
  </div>
</script>

<script id="AmazonTemplateContainer" type="text/html">
  <!-- <div class="layui-col-lg2 layui-col-md2" id="fulfillmentCenterIdTemp"> -->
    <label class="layui-form-label">仓库</label>
    <div class="layui-input-block">
      <select name="fulfillmentCenterId" id="createfulfillmentCenterId" lay-filter="newfulfillmentCenterId">
        <!-- <option value=''>请选择</option> -->
        {{# layui.each(d.fulfillmentCenterIdData||[], function(index, item){ }}
          {{# if((d.fulfillmentCenterId&&d.fulfillmentCenterId == item)){ }}
          <option value='{{item}}' selected>{{item}}</option>
          {{# }else{ }}
          <option value='{{item}}'>{{item}}</option>
          {{# } }}
        {{# }) }}
      </select>
    </div>
</script>   

<script type="text/html" id="amazonCateSpecificsTemp">
  <div class="layui-col-md12 amazonCateSpecifics">
    <div class="layui-card">
      <div class="layui-card-header">分类属性
        <a class="layui-btn layui-btn-xs" id="publish_toogleLangBtn">切换语言</a>
      </div>
      <div class="layui-card-body layui-row" id="requireValue">
        {{# layui.each(d.cateList||[], function(index, item){ }}
        {{# if(item.required){ }}
        {{# if(item.validValues){ }}
        <div class="layui-form-item toggleClass requireEle">
          <label class="layui-form-label redStar" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
          <span class="disN labelField">{{item.fieldName}}</span>
          <div class="layui-input-inline">
          <select>
              {{# if(item.fieldName != 'feed_product_type'){ }}
                <option></option> 
              {{# } }}
              {{# layui.each(item.validValues.split("#,#")||[], function(index, cItem){ }}
              <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
              {{# }); }}
            </select>
          </div>
        </div>
        {{# }else{ }}
        <div class="layui-form-item toggleClass requireEle">
          <label class="layui-form-label redStar" lay-tips="{{item.definition}}" style="width: 200px;" data-local="{{item.localLabelName}}"  data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
          <span class="disN labelField">{{item.fieldName}}</span>
          <div class="layui-input-inline">
            <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
          </div>
          {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('requireValue')">转换成inch</button>
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('requireValue')">转换成cm</button>
          {{# } }}
          {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('requireValue')">转换成oz</button>
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('requireValue')">转换成g</button>
          {{# } }}
        </div>
        {{# } }} {{# } }}
        {{# }); }}
        <div id="publish_hiddenAttrArea"></div>
        <div>
          <a class="layui-btn layui-btn-xs" id="publish_moreAttrBtn">更多选填属性</a>
        </div>
        <div style="display: none;" id="optionValue">
        {{# layui.each(d.cateList||[], function(index, item){ }}
        {{# if(!item.required){ }}
        {{# if(item.validValues){ }}
          <div class="layui-form-item">
            <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <select>
                <option></option>
                {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                {{# }); }}
              </select>
            </div>
          </div>
          {{# }else{ }}
          <div class="layui-form-item">
            <label class="layui-form-label" lay-tips="{{item.definition}}" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <input type="text" class="layui-input" value="{{item.defaultValue||''}}">
            </div>
          </div>
        {{# } }}{{# } }}
        {{# if(item.test){ }}
        {{# if(item.validValues){ }}
          <div class="layui-form-item testClass">
            <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <select>
                <option></option>
                {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                {{# }); }}
              </select>
            </div>
          </div>
          {{# }else{ }}
          <div class="layui-form-item testClass">
            <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
            </div>
            {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('optionValue')">转换成inch</button>
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('optionValue')">转换成cm</button>
            {{# } }}
            {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
                <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('optionValue')">转换成oz</button>
                <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('optionValue')">转换成g</button>
            {{# } }}
          </div>
        {{# } }}{{# } }}
        {{# }); }}
      
        </div>
    </div>
</div>
</script>

// 建模刊登
<script type="text/html" id="createTempAndPublishAmazon">
  <form class="layui-form p10" id="AmazonTemplateForm" onsubmit="return false;">
    <%--//第二步：建立视图。用于呈现渲染结果。--%>
    <div id="storeTemplateModifyAmazonTemplateView1"></div>
    <div class="layui-form-item">
        <input name="storeTemplateBaseId" type="hidden">
        <input name="upcExemptionFlag" type="hidden"/>
        <input name="logisAttrList" type="hidden"/>
        <input name="listingStatus" type="hidden"/>
        <hr>
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label redStar">站点</label>
            <div class="layui-input-block">
                <select class="salesSite" name="salesSite" lay-filter="storeTemplateSalesSite" disabled>
                    <option></option>
                </select>
            </div>
        </div>
        <div class="layui-col-lg6 layui-col-md6" style="margin-left: 50px;display:flex">
            <div class="redStar" style="width: 200px;">子类目<a class="layui-btn layui-btn-xs"
               id="storeTemplateLayer_creatListing" style="margin: 10px">选择分类</a>
              </div>
              <input type="hidden" id="amazon_online_creatListing_cateItem-hidden2"
                     name="recommendedBrowseNode" value="" data-id="">
              <div id="publishLayerAmazonListingName" style="flex:1;display:flex;align-items:center"></div>
            <input id="publish_ebayCateId1" name="ebayCateId1" type="hidden">
        </div>

        <div class="layui-col-lg2 layui-col-md2" id="fulfillmentCenterIdTemp"></div>
        <div id="storeTemplateModifyAmazonTemplateView0"></div>
        <hr>
        <div style="display: flex">
          <h2>类目属性</h2>
          <div id="createSSkuSelect" class="layui-col-lg5 layui-col-md5" style="margin-left: 20px;display: none">
            <div class="layui-input-inline" style="width: 50%;display:flex;align-items:center">
                <select id="createSkuChoose" name="createSkuChoose" lay-filter="createSkuChoose">
                </select>
                <button type="button" class="layui-btn layui-btn-xs" style="margin-left: 10px" id="createApplyOtherAttr">应用至其他变种</button>
            </div>
        </div>
        </div>
        <hr>
        <div id="storeTemplate_editspecificForm"></div>
        <hr>
        <div id="storeTemplateModifyAmazonTemplateView2"></div>
        <hr>
        <div class="layui-col-lg4 layui-col-md4">
          <label class="layui-form-label salesType redStar">售卖形式</label>
          <div class="layui-input-block">
            <input type="radio" name="salesType" lay-filter="salesType" value="1" title="单品">
            <input type="radio" name="salesType" lay-filter="salesType" value="2" title="多变种">
          </div>
      </div>
        <div class="layui-col-lg5 layui-col-md5 variationClassBox">
            <label class="layui-form-label variationClass redStar">variation theme</label>
            <div class="layui-input-block">
                <select name="variationTheme" lay-filter="variationTheme">
                    <option></option>
                </select>
            </div>
        </div>
        <a class="layui-btn layui-btn-sm" id="publisheHandleSku" style="margin-left: 15px">生成sku</a>
        <br>
        <table class="layui-table" id="publishThemeTable"></table>
        <hr>
        <h2>变种参数</h2>
        <hr>
        <div class="layui-col-lg12 layui-col-md12" style="margin-bottom: 20px">
          <div style="float: left;margin-left: 15px" class="multi-box">
            <input type="checkbox" class="allid-cbox" lay-filter="allBox" lay-skin="primary" name="id">
          </div>
        </div>
        <div id="storeTemplateModifyAmazonTemplateView3"></div>
        <a class="layui-btn layui-btn-xs layui-btn-danger" id="publishDetaleSelected" style="float: right;">批量删除</a>
        <a class="layui-btn layui-btn-xs" id="publishIncreaseRow" style="float: right;margin-right: 20px">新增一行</a>
        <div id="publishInfoTable"></div>        
        <hr>
    </div>
</form>
</script>

<script type="text/html" id="storeTemplateModifyAmazonTemplateContainer3">
  <div class="layui-col-lg3 layui-col-md3 layui-col-md-offset8" id="grossProfitRateCreateTemp" style="margin-bottom: 10px;">
    <label class="layui-form-label">毛利率</label>
    <div class="layui-input-inline" style="display:flex;align-items: center">
      <input class="layui-input" name="grossProfitRate" value="{{ d.grossProfitRate||'' }}">
      <span> % </span>
    </div>
    <button type="button" class="layui-btn layui-btn-sm" onclick="setPriceNewTemp('btnSetPrice')">定价</button>
  </div>
</script>

<script type="text/html" id="amazonTempApplyDescLayer">
  <div id="amazonTempApplyDescContent"></div>
</script>

<script type="text/html" id="amazonTempApplyDesc">
  <div class="layui-form">
    {{# layui.each(d ||[], function(index, item){ }}
    <div class="descItem">
      <input class="descInput" type="checkbox" value="{{item}}" lay-skin="primary" name="original" title="{{item}}">
    </div>
    {{# }); }}
  </div>
</script>

<%--亚马逊模板子sku--%>
<script type="text/html" id="publishThemeTableOaAttr">
  <select lay-filter="publishThemeTableOaAttrSelect" name="publishThemeTableOaAttrSelect">
    <option value="">请选择</option>
    {{# layui.each(d.oaAttr||[], function(index, item){ }}
        <option value={{item}} {{d.selectIndex ===  index ?"selected":""}}>{{item}}</option>
        {{# }); }}
    </select>
    <%--</form>--%>
</script>

<script type="text/html" id="prodListingSubSkuAmazonsTable">
  {{# layui.each(d.prodListingSubSkuAmazons|| [], function(index, item){ }}
    <div class="amazon_publish_variant">
    <table class="layui-table">
      <thead>
      <tr>
        <th rowspan="2"></th>
        <th rowspan="2">主图</th>
        <th name="ssku" rowspan="2">店铺子SKU</th>
        <th rowspan="2" class="upcExemptionFlag">UPC/EAN</th>
        <th rowspan="2" class="upcExemptionFlag">product_id</th>
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <th data-key="{{cItem?.split(":")[1]||''}}" rowspan="2">{{cItem?.split(":")[0]||''}}</th>
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <th data-key="colorMapValue" rowspan="2">colormap</th>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <th data-key="sizeMapValue" rowspan="2">sizemap</th>
        {{# } }}
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '成本' : 'FBA成本'}}(&yen;)</th>
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '重量' : 'FBA重量'}}(g)</th>
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '尺寸' : 'FBA尺寸'}}(cm)</th>
        <th rowspan="2">价格</th>
        <th colspan="3" class="fulfillmentCenterId">
          <div class="disflex" style="align-items: center;">
            <div class="w60">FBA定价</div>
            <div>
<%--              <select name="priceCate" lay-search>--%>
<%--                <option value="正常分类" selected>正常分类</option>--%>
<%--                <option value="美妆">美妆</option>--%>
<%--                <option value="服装与配饰">服装与配饰</option>--%>
<%--                <option value="母婴（非服饰）">母婴（非服饰）</option>--%>
<%--                <option value="家具（含户外家具）">家具（含户外家具）</option>--%>
<%--                <option value="个护健康（含个护用品）">个护健康（含个护用品）</option>--%>
<%--                <option value="工业和科学用品">工业和科学用品</option>--%>
<%--                <option value="电子产品配件">电子产品配件</option>--%>
<%--                <option value="珠宝首饰">珠宝首饰</option>--%>
<%--                <option value="汽车用品">汽车用品</option>--%>
<%--                <option value="钟表">钟表</option>--%>
<%--                <option value="食品">食品</option>--%>
<%--                <option value="消费类电子产品">消费类电子产品</option>--%>
<%--              </select>--%>
                  <select name="fbaPlatCommisionRuleId" lay-search>
                      <option></option>
                  {{# layui.each(d.getAllCommisionCateRuleData||[], function(index, cItem){ }}
                      <option value="{{cItem.id}}" {{cItem.id == d.fbaPlatCommisionRuleId?'selected':''}}>{{cItem.ruleName}}</option>
                  {{# }); }}
                  </select>
            </div>
          </div>
        </th>
          <th rowspan="2" class="notFulfillmentCenterId">库存</th>
        <th rowspan="2">操作</th>
      </tr>
      <tr>
        <th class="fulfillmentCenterId">派送费</th>
        <th  class="fulfillmentCenterId">快递单个头程(&yen;)</th>
        <th  class="fulfillmentCenterId">利润率</th>
      </tr>
      </thead>
      <tbody id="amazonPublish_newSubSkuInfo">
      <tr class="amazonPublish_detail_table">
        <td>
          <div class="layui-form">
            <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{
                   item.id }}
                   name="id" data-id="{{item.id}}">
          </div>
        </td>
        <td>
          <div>
            
              <div class="swatch">
                <input type="radio" class="img-cbox" lay-skin="primary" name="{{ 'imgCbox' + index }}" value={{
                  item.imgName }} shortname="{{item.shortImgName}}" lay-filter="swatchRadio" select="false">
                <span>设为swatch图</span>
              </div>
            <img name="mainImg" src="{{item.imgName||''}}" shortname="{{item.shortImgName}}" width="150" height="150">
          </div>
        </td>
        <td>
          <input name="storeSSku" class="layui-input" value="{{item.storeSSku||''}}" onfocus="saveSsku(this, 'create')" onblur="updateSsku(this, 'create')">
          <input style="display:none" class="layui-input" name="prodListingSubSkuAmazonsStoreSSku">
          <div class="addBtn">
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_new_autoSetWeightPrice(this,`{{item.externalProductIdType}}`, 'create')">自动补充</a>
          </div>
          <input type="hidden" value="{{item.id}}" name="prodListingSubSkuAmazonsId">
          <input type="hidden" value="{{item.sSku}}" name="prodSSku">
          <input type="hidden" value="{{item.id}}" name="prodTempId">
          <input type="hidden" value="{{item.color}}" name="color">
          <input type="hidden" value="{{item.size}}" name="size">
          <input type="hidden" value="{{item.style}}" name="style">
          <input type="hidden" value="{{item.attrKeyVal}}" name="attrKeyVal">
          <input type="hidden" value="{{item.purchaseCostPrice}}" name="purchaseCostPrice">
          <input type="hidden" value="{{item.weight}}" name="weight">
          <input type="hidden" value="{{item.currency}}" name="currency">
          <input type="hidden" value="{{item.outerBoxLength}}" name="outerBoxLength">
          <input type="hidden" value="{{item.outerBoxWidth}}" name="outerBoxWidth">
          <input type="hidden" value="{{item.outerBoxHeight}}" name="outerBoxHeight">
        </td>
        {{#if(!item.upcExemptionFlag){}}
        <td class="externalProductIdType upcExemptionFlag">{{item.externalProductIdType||''}}</td>
        <td class="upcExemptionFlag">
          <input type='text' readonly class="layui-input" name="externalProductId" value="{{item.externalProductId ||''}}">
          <div>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_regenerate(this,`{{item.externalProductIdType}}`)">重新生成</a>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_empty(this,{{item.id}})">清空</a>
          </div>
        </td>
        {{# } }}
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <%--现根据亚马逊新模板中的修改弹窗参照修改,spliceString这个属性不清楚什么情况下显示--%>
        {{#if(cItem?.split(":")[1]?.length * 1 > 8){ }}
        <td class="tdVal" data-key="spliceString">
          <span class="themeValue">{{item.spliceString || ''}}</span>
          <input style="display:none" class="layui-input" name="spliceString" value="{{item.spliceString || ''}}">
        </td>
        {{# }else{ }}
        <td class="tdVal" data-key="{{cItem?.split(":")[1]||''}}">
          <span class="themeValue">{{item[cItem?.split(":")[1]]}}</span>
          <input style="display:none" class="layui-input" name="sizeColor" value="{{item[cItem?.split(":")[1]]}}">
        </td>
        {{# } }}
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <td class="tdVal" data-key="colorMapValue" id="colorMapValue">
          <span class="themeValue">{{item.colorMapValue||''}}</span>
          <div style="display:none" name="colorMapValueDiv">
            <select class="layui-input" name="colorMapValue">
              {{# layui.each(item.colorMap||[], function(index, color){}}
                <option value="{{ color }}">{{color}}</option>
              {{# }) }}
            </select>
          </div>

        </td>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <td class="tdVal" data-key="sizeMapValue">
          <span class="themeValue">{{item.sizeMapValue||''}}</span>
          <div style="display:none" name="sizeMapValueDiv">
            <select class="layui-input" name="sizeMapValue">
              {{# layui.each(item.sizeMap||[], function(index, size){}}
                <option value="{{ size }}">{{size}}</option>
              {{# }) }}
            </select>
          </div>
        </td>
        {{# } }}
        <td class="purchaseCostPrice changePurchaseCostPrice changePurchaseCostPrice{{item.id}}">
          {{item.purchaseCostPrice}}
        </td>
        <td class="cskuWeight changeWeight changeWeight{{item.id}}">
            <span>{{item.weight||''}}</span>
            <input type="hidden" value="{{item.weight}}" />
        </td>
        <td class="outerBoxSize">
          <div>长：{{item.outerBoxLength}}</div>
          <div>宽：{{item.outerBoxWidth}}</div>
          <div class="cskuWeight">高：<span class="changeOuterBoxHeight changeOuterBoxHeight{{item.id}}">{{item.outerBoxHeight}}</span></div>
        </td>
        <td>
          <div class="disflex">
            <input type="number" class="layui-input changePrice changePrice{{item.id}}" name="standardPrice" min="0" value="{{item.standardPrice||''}}">
            <label class="ml10">{{item.currency ||''}}</label>
          </div>
          <a class="layui-btn layui-btn-xs fulfillmentCenterId" onclick="amazonPublish_updateProfitRate(this,'select')">更新利润率</a>
        </td>
        <td class="fbaCharge fulfillmentCenterId">{{item.fbaCharge||''}}</td>
        <td class="firstLogisticsFee fulfillmentCenterId">{{item.firstLogisticsFee||''}}</td>
        <td class="fbaProfitRate fulfillmentCenterId">
          <div>快递利润率：<span class="airTransportProfitRate">{{item.airTransportProfitRate||''}}</span></div>
          <div>空派利润率：<span class="airDeliveryProfitRate">{{item.airDeliveryProfitRate||''}}</span></div>
          <div>海运利润率：<span class="seaTransportProfitRate">{{item.seaTransportProfitRate||''}}</span></div>
        </td>
        <td class="notFulfillmentCenterId">
          <input type="number" class="layui-input quantity" min="0" name="quantity" value="{{item.quantity}}"
            onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
          >
        </td>
        <td>
          <a class="layui-btn layui-btn-xs" onclick="removeAmazonSku(this, 'create')">移除</a>
          {{# if(item.listingStatus==0 || item.listingStatus == 2){ }}
            <a class="layui-btn layui-btn-xs" name="saveBtn" onclick="amazonPublish_subsku_save(this,{{item.id}})">保存</a>
          {{# } }}
        </td>
      </tr>
      </tbody>
    </table>
    <h3>辅图
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 publish_addLocalPicture">本地图片</button>
      <button type="button" class="layui-btn layui-btn-sm mt05" onclick="publish_addPicture($(this))">网络图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 addImgByTpl" data-prodssku="{{item.sSku}}" onclick="amazon_publish_addImgByTpl($(this),true)">模板图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="cancelSwatch($(this))">不选择swatch图</button>
      <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
        <span class="layui-bg-red">说明！</span>
        <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
        <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">9</span>张，已经选用了<span class="curImgNum">{{item.otherImageUrl?.length ? item.otherImageUrl?.split("|").length: 0}}</span>张辅图</span>
      </div>
    </h3>
    <div class="layui-clear pl20 imgContains dis_flex">
      <ul class="uploadImgUL ui-sortable" style="width: 100%;">
        {{# layui.each(item.otherImageUrl && item.otherImageUrl.split("|")||[], function(index, cItem){ }}
        <li draggable="true" class="imgBox_prodTpl" data-src="{{cItem}}" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
          <div class="ImgDivOut">
            <div class="ImgDivIn" style="width:150px;height:150px">
              <%--<input type="hidden" name="extImg" value="{{cItem||''}}">--%>
              <img style="width:100%;height:100%;object-fit:contain;" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" src="{{cItem}}" >
            </div>
            <div class="imgDivDown" style="width:150px">
              <a onclick="amazonStore_setMainImg(this);" href="javascript:void(0);"style="float:left;color: #73a1bf;">设为主图</a>
              <a onclick="amazonStore_delImg(this);" href="javascript:void(0);" style="float:right;color: #73a1bf;">移除</a>
            </div>
          </div>
        </li>
        {{# }); }}
      </ul>
    </div>
    </div>
  {{# }); }}
</script>

<!-- 建模刊登end -->

<!--待发布详情弹框-->
<script type="text/html" id="amazonPulish_listDetailTpl">
  <div class="layui-fluid">
    <div class="layui-row">
      <div class="layui-col-lg12 layui-col-md12">
        <form action="" class="layui-form" id="amazonPublish_editDetailForm">
          <input name="amazonListingId" type="text" value="{{d.prodListingAmazon.id}}" hidden>
          <input type="hidden" value="{{d.prodListingAmazon.salesSite}}" name="salesSite">
          <input type="hidden" value="{{d.prodPInfo.logisAttrList}}" name="logisAttrList">
          <input type="hidden" value="{{d.upcExemptionFlag}}" name="upcExemptionFlag">
          <input type="hidden" value="{{d.prodListingAmazon.currency}}" name="currency">
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">店铺父SKU:
                <button id="wishPublish_upcase" type="button" class="layui-btn layui-btn-xs" onclick="amazonPublish_updatePsku('{{d.prodPInfo.id}}')">
                  更新父sku
                </button>
              </label>
              <div class="layui-input-block">
                <input name="storePSku" data-psku="{{d.prodPInfo.pSku}}"  data-pskuid="{{d.prodPInfo.id}}" value="{{d.prodListingAmazon.storePSku}}" type="text"
                       class="layui-input">
              </div>
            </div>
          </div>
          <input name="region" value="{{d.prodListingAmazon.region}}" type="text" class="layui-input disN">
          <input name="currency" value="{{d.prodListingAmazon.currency}}" type="text" class="layui-input disN">
          <input name="listingStatus" value="{{d.prodListingAmazon.listingStatus}}" type="text" class="layui-input disN">
          <input name="storeAcctId" value="{{d.prodListingAmazon.storeAcctId}}" type="text" class="layui-input disN">
          <input name="salesSite" value="{{d.prodListingAmazon.salesSite}}" type="text" class="layui-input disN">
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">刊登标题:
                <!--<button id="amazonPublish_upcase" type="button" class="layui-btn layui-btn-xs"-->
                        <!--onclick="amazonPublish_upCaseTitle()">-->
                  <!--首字母大写-->
                <!--</button>-->
              </label>
              <div class="layui-input-block">
                <input name="itemName" value="{{d.prodListingAmazon.itemName}}" data-prodpsku="{{d.prodPInfo.pSku}}" type="text"
                       class="layui-input ifFocusInput">
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">产品描述:</label>
              <div class="layui-input-block">
                   <textarea id="amazonPublish_Info_desc" style="display: none">
                  </textarea>
              </div>
            </div>
          </div>

            <div calss="layui-card">
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">刊登模板:</label>
                        <div class="layui-input-block">
                            <select name="tempFileName" readonly>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div calss="layui-card">
                <div class="layui-form-item">
                  <div class="layui-col-lg8 layui-col-md8">
                    <label class="layui-form-label">选择类目:</label>
                    <div class="layui-input-inline" style="width: 70%;">
                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                id="amazonPublish_cateItem_btn">选择类目
                        </button>
                        <input type="hidden" id="LAY-publishs-amazon-publish-hidden2" name="recommendedBrowseNode" value="{{d.prodListingAmazon.recommendedBrowseNode}}">
                        <div id="LAY-publishs-amazon-publish-div2">{{d.prodListingAmazon.fullCateName}}</div>
                    </div>
                    <div class="layui-input-inline" style="float: right;">
                      <select name="fulfillmentCenterId" id="oldfulfillmentCenterId" lay-filter="oldfulfillmentCenterId">
                        {{# layui.each(d.fulfillmentCenterIdData||[], function(index, item){ }}
                        {{# if((d.prodListingAmazon.fulfillmentCenterId&&d.prodListingAmazon.fulfillmentCenterId == item)||(!d.prodListingAmazon.fulfillmentCenterId&&'DEFAULT' == item)){ }}
                        <option value='{{item}}' selected>{{item}}</option>
                        {{# }else{ }}
                        <option value='{{item}}'>{{item}}</option>
                        {{# } }}
                        {{# }) }}
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2" style="display: none" id="shippingType_oldDetail">
                    <label class="layui-form-label">发货类型</label>
                    <div class="layui-input-block">
                      <select name="shippingType" lay-filter="shippingType_oldDetail">
                        <option value=""></option>
                        <option value="1">空运</option>
                        <option value="2">海运</option>
                      </select>
                    </div>
                  </div>
                </div>
            </div>

            <div calss="layui-card">
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 200px">feed_product_type:
                    </label>
                    <div class="layui-input-inline">
                        <input name="feedProductType" value="{{d.prodListingAmazon.feedProductType}}" type="text"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div calss="layui-card">
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 200px">item_type:
                    </label>
                    <div class="layui-input-inline">
                        <input name="itemType" value="{{d.prodListingAmazon.itemType}}" type="text"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div calss="layui-card">
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 200px">color_key_name:
                    </label>
                    <div class="layui-input-inline">
                        <input name="colorKeyName" value="{{d.prodListingAmazon.colorKeyName}}" type="text"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div calss="layui-card">
                <div class="layui-form-item">
                    <label class="layui-form-label" style="width: 200px">size_key_name:
                    </label>
                    <div class="layui-input-inline">
                        <input name="sizeKeyName" value="{{d.prodListingAmazon.sizeKeyName}}" type="text"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div>
                <div class="layui-form-item">

                  <label class="layui-form-label" style="width: 200px">color_size_key_name:
                  </label>
                  <div class="layui-input-inline">
                      <input name="colorSizeKeyName" value="{{d.prodListingAmazon.colorSizeKeyName}}" type="text"
                              class="layui-input">
                  </div>
                </div>
            </div>

            <div id="requireClass" class="requireClass">
              {{# layui.each(d.cateListNew||[], function(index, item){ }}
              {{# if(item.validValues){ }}
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.fieldName}}</label>
                  <div class="layui-input-inline">
                    <select>
                      <option></option>
                      {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                      <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                      {{# }); }}
                    </select>
                  </div>
                </div>
                {{# }else{ }}
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.fieldName}}</label>
                  <div class="layui-input-inline">
                    <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
                  </div>
                  {{# if(item.fieldName == 'package_length'){ }}
                    <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('requireClass')">转换成inch</button>
                    <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('requireClass')">转换成cm</button>
                  {{# } }}
                  {{# if(item.fieldName == 'package_weight'){ }}
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('requireClass')">转换成oz</button>
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('requireClass')">转换成g</button>
                  {{# } }}
                </div>
              {{# } }}
              {{# }); }}
            </div>

          <div calss="layui-card bullet_point_input">
            <div class="layui-form-item">
              <label class="layui-form-label">卖点:
              </label>
                <div id="bulletPoint_Id">

                </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label" style="width: 100px">亚马逊侵权品牌:
              </label>
              <div class="layui-input-block">
                <div style="color: red;line-height: 30px">{{ d.prodListingAmazon.tortBrand }}</div>
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">检索词:
              </label>
              <div class="layui-input-block">
                <input  type="text" name="genericKeywords"
                       class="layui-input" value="{{d.prodListingAmazon.genericKeywords}}">
              </div>
            </div>
          </div>

          <div calss="layui-card">
                <div class="layui-form-item">
                    <label class="layui-form-label">扩展属性:
                    </label>
                    <div class="layui-input-block">
                        <textarea name="attrKeyVal" type="text" class="layui-textarea"
                                    readonly></textarea>
                    </div>
                </div>
          </div>

          <div class="layui-card">
            <div class="layui-card-header">
              <span>SKU信息</span>
              <div class="fr" style="width: 550px;display: flex;box-sizing: border-box">
                <button type="button" class="addAmazonSubListing layui-btn layui-btn-sm layui-btn-warm disN" onclick="amazonListingPublish_updatePrice()">
                更新价格
                </button>
              </div>
              <button type="button"
                      class="addAmazonSubListing layui-btn layui-btn-sm layui-btn-normal fr disN"
                      onclick="addAmazonSubListing()">
                添加一行
              </button>
              
            </div>
            <div class="layui-card-body">
              <div style="float: left;margin-left: 15px" class="multi-box">
                <input id="allBoxOldTemp" type="checkbox" class="allid-cbox" lay-filter="allBox" lay-skin="primary" name="id">
              </div>
              <div class="layui-form-item" id="grossProfitRateOldTemp" >
                <div class="layui-col-lg3 layui-col-md3 layui-col-md-offset8" style="margin-bottom: 10px;">
                  <label class="layui-form-label">毛利率</label>
                  <div class="layui-input-inline" style="display:flex;align-items: center">
                    <input class="layui-input" name="grossProfitRate" value="{{ d.prodListingAmazon.grossProfitRate||'' }}">
                    <span> % </span>
                  </div>
                  <button type="button" class="layui-btn layui-btn-sm" onclick="setPriceOldTemp('btnSetPrice')">定价</button>
                </div>
              </div>
              <table class="layui-table" id="listingInfo_sub_tab">
                <thead>
                <tr>
                  <th hidden rowspan="2">id</th>
                  <th rowspan="2"></th>
                  <th rowspan="2">店铺SKU</th>
                  <th rowspan="2" class="upcExemptionFlag">UPC/EAN</th>
                  <th rowspan="2" class="upcExemptionFlag">product id</th>
                  <th rowspan="2">尺寸</th>
                  <th rowspan="2">颜色</th>
                  <th rowspan="2" class="basicInfo">{{d.isDefault ? '成本' : 'FBA成本'}}(&yen;)</th>
                  <th rowspan="2" class="basicInfo">{{d.isDefault ? '重量' : 'FBA重量'}}(g)</th>
                  <th rowspan="2" class="basicInfo">{{d.isDefault ? '尺寸' : 'FBA尺寸'}}(cm)</th>
                  <th rowspan="2">刊登价格</th>
                  <th rowspan="2" class="notFulfillmentCenterId">刊登数量</th>
                  <th colspan="3" class="fulfillmentCenterId">
                    <div class="disflex" style="align-items: center;">
                      <div class="w60">FBA定价</div>
                      <div>
<%--                        <select name="priceCate" lay-search>--%>
<%--                          <option value="正常分类" selected>正常分类</option>--%>
<%--                          <option value="美妆">美妆</option>--%>
<%--                          <option value="服装与配饰">服装与配饰</option>--%>
<%--                          <option value="母婴（非服饰）">母婴（非服饰）</option>--%>
<%--                          <option value="家具（含户外家具）">家具（含户外家具）</option>--%>
<%--                          <option value="个护健康（含个护用品）">个护健康（含个护用品）</option>--%>
<%--                          <option value="工业和科学用品">工业和科学用品</option>--%>
<%--                          <option value="电子产品配件">电子产品配件</option>--%>
<%--                          <option value="珠宝首饰">珠宝首饰</option>--%>
<%--                          <option value="汽车用品">汽车用品</option>--%>
<%--                          <option value="钟表">钟表</option>--%>
<%--                          <option value="食品">食品</option>--%>
<%--                          <option value="消费类电子产品">消费类电子产品</option>--%>
<%--                        </select>--%>
                        <select name="fbaPlatCommisionRuleId" lay-search>
                            <option></option>
                        {{# layui.each(d.getAllCommisionCateRuleData||[], function(index, cItem){ }}
                            <option value="{{cItem.id}}" {{cItem.id == d.prodListingAmazon.fbaPlatCommisionRuleId?'selected':''}}>{{cItem.ruleName}}</option>
                        {{# }); }}
                        </select>
                      </div>
                    </div>
                  </th>
                  <th rowspan="2">状态</th>
                  <th rowspan="2">操作</th>
                </tr>
                <tr>
                  <th class="fulfillmentCenterId">派送费</th>
                  <th  class="fulfillmentCenterId">快递单个头程(&yen;)</th>
                  <th  class="fulfillmentCenterId">利润率</th>
                </tr>
                </thead>
                <tbody id="amazonPublish_SubSkuInfo">
                {{# layui.each(d.subSkuAmazonDtos, function(index, subSkuAmazonDto){ }}
                <tr class="changePrice changePrice{{subSkuAmazonDto.id}} skuInfo">
                  <td hidden name="id">{{subSkuAmazonDto.id}}</td>
                  <td>
                    <div class="layui-form">
                      <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{
                        subSkuAmazonDto.id }}
                             name="id" data-id="{{subSkuAmazonDto.id}}">
                    </div>
                  </td>
                  <td name="storeSSku">{{subSkuAmazonDto.storeSSku}}</td>
                  <td hidden name="prodTempId">{{subSkuAmazonDto.prodTempId}}</td>
                    <td class="upcExemptionFlag">{{subSkuAmazonDto.externalProductIdType}}</td>
                    <td class="upcExemptionFlag"><input type='text' readonly class="layui-input amazonProductIdTypeId" value='{{subSkuAmazonDto.externalProductId || ""}}'>
                        {{# if(subSkuAmazonDto.listingStatus==0 ||subSkuAmazonDto.listingStatus==2){ }}
                        <button type="button"
                              class="layui-btn layui-btn-xs amazonPublish_clickGenUpcEan"
                              onclick="reFresh_productId_amazonListing(this,'{{subSkuAmazonDto.externalProductIdType}}')">重新生成
                        </button>
                       <button type="button"
                              class="layui-btn layui-btn-xs"
                              onclick="clear_productId_amazonListing(this,'{{subSkuAmazonDto.externalProductIdType}}')">清空
                        </button>
                        {{# } }}
                    </td>
                  <td><input type='text' class="layui-input" name="size" value='{{subSkuAmazonDto.size || ""}}'
                             onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                  </td>
                  <td><input type='text' class="layui-input" name="color" value='{{subSkuAmazonDto.color || ""}}'
                             onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\u0800-\u4e00\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                  </td>
                  <td class="purchaseCostPrice">
                    {{subSkuAmazonDto.purchaseCostPrice}}
                  </td>
                  {{# if(subSkuAmazonDto.weightUnit){ }}
                  <td>{{subSkuAmazonDto.weight}} {{subSkuAmazonDto.weightUnit}}({{subSkuAmazonDto.originWeight}}g)</td>
                  {{# }else{ }}
                  <td>{{subSkuAmazonDto.weight}} OZ[{{subSkuAmazonDto.originWeight}}g]</td>
                  {{# } }}
                  <td class="outerBoxSize">
                    <div>长：{{[null,undefined].includes(subSkuAmazonDto.outerBoxLength)?'':subSkuAmazonDto.outerBoxLength}}</div>
                    <div>宽：{{[null,undefined].includes(subSkuAmazonDto.outerBoxWidth)?'':subSkuAmazonDto.outerBoxWidth}}</div>
                    <div>高：{{[null,undefined].includes(subSkuAmazonDto.outerBoxHeight)?'':subSkuAmazonDto.outerBoxHeight}}</div>
                  </td>
                  <td>
                    <div class="layui-input-inline disflex">
                      <input type='number' class="layui-input price" value='{{subSkuAmazonDto.standardPrice}}' name="standardPrice">
                      <label style="line-height: 32px;">{{subSkuAmazonDto.currency}}</label>
                    </div>
                    <a class="layui-btn layui-btn-xs fulfillmentCenterId" onclick="amazonPublish_updateProfitRate(this,'input')">更新利润率</a>
                  </td>
                  <td class="notFulfillmentCenterId"><input type='number' class="layui-input quantity" value='{{subSkuAmazonDto.quantity}}'></td>
                  <td hidden>{{subSkuAmazonDto.prodSSku}}</td>
                  <td class="fbaCharge fulfillmentCenterId">{{subSkuAmazonDto.fbaCharge||''}}</td>
                  <td class="firstLogisticsFee fulfillmentCenterId">{{subSkuAmazonDto.firstLogisticsFee||''}}</td>
                  <td class="fbaProfitRate fulfillmentCenterId">
                    <div>快递利润率：<span class="airTransportProfitRate">{{subSkuAmazonDto.airTransportProfitRate||''}}</span></div>
                    <div>空派利润率：<span class="airDeliveryProfitRate">{{subSkuAmazonDto.airDeliveryProfitRate||''}}</span></div>
                    <div>海运利润率：<span class="seaTransportProfitRate">{{subSkuAmazonDto.seaTransportProfitRate||''}}</span></div>
                  </td>
                  <td>{{# if(subSkuAmazonDto.listingStatus==1){ }}
                    成功
                    {{# }else if(subSkuAmazonDto.listingStatus==2){ }}
                    失败
                    {{# }else if(subSkuAmazonDto.listingStatus==3){ }}
                    刊登中
                    <%--{{# }else if(subSkuAmazonDto.listingStatus==6){ }}--%>
                    <%--生成刊登文件--%>
                    {{# }else if(subSkuAmazonDto.listingStatus==0){ }}
                    待刊登
                    {{# } }}
                  </td>
                  <td>
                    {{# if(subSkuAmazonDto.listingStatus==1 || subSkuAmazonDto.listingStatus==3){ }}
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled">移除
                    </button>
                    {{# }else{ }}
                    <button type="button" class="layui-btn layui-btn-sm"
                            onclick="removeAmazonSubListing(this)">移除
                    </button>
                    {{# } }}
                    <input type="hidden" value="{{subSkuAmazonDto.prodSSku}}" name="prodSSku">
                    <input type="hidden" value="{{subSkuAmazonDto.purchaseCostPrice}}" name="purchaseCostPrice">
                    <input type="hidden" value="{{subSkuAmazonDto.weight}}" name="weight">
                    <input type="hidden" value="{{[null,undefined].includes(subSkuAmazonDto.outerBoxLength)?'':subSkuAmazonDto.outerBoxLength}}" name="outerBoxLength">
                    <input type="hidden" value="{{[null,undefined].includes(subSkuAmazonDto.outerBoxWidth)?'':subSkuAmazonDto.outerBoxWidth}}" name="outerBoxWidth">
                    <input type="hidden" value="{{[null,undefined].includes(subSkuAmazonDto.outerBoxHeight)?'':subSkuAmazonDto.outerBoxHeight}}" name="outerBoxHeight">
                    <input type="hidden" value="{{subSkuAmazonDto.currency}}" name="currency">
                  </td>
                </tr>
                <tr class="amazonPublish_detail_pic_class">
                  <td colspan="15">
                    <div>
                        <div class="ImgDivIn amazonPublish_mainImg" style="height:300px;width: 280px;float: left">
                          <input type="hidden" name="mainImg" value="{{subSkuAmazonDto.mainImageUrl}}">
                          <img style="height:150px;max-width: 150px" src="{{GlobalDomainImgSrc(subSkuAmazonDto.mainImageUrl )}} " class='b1'>
                        </div>

                        <div style="overflow: hidden">
                          <div>
                            <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="amazonPublish_addExtPic(this, 'isOldDetail')">网络图片</button>
                            <button type="button" class="layui-btn layui-btn-sm ml5 addImgByTpl" data-prodssku="{{subSkuAmazonDto.prodSSku}}" onclick="amazon_publish_addImgByTpl(this)">模板图片</button>
                            <div style="float:left" class="amazonPublish_extPic_edit_local"></div>
                            <div class="p0">
                                <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                    <span class="layui-bg-red">说明！</span>
                                    <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                    <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">{{d.subSkuMaxImgLimit}}</span>张，已经选用了<span class="curImgNum">
                                        {{# if(subSkuAmazonDto.otherImageUrl){ }}
                                            {{ subSkuAmazonDto.otherImageUrl?.split("\\|").length }}
                                        {{# }else{ }}
                                             0
                                        {{# } }}
                                      </span>张辅图</span>
                                </div>
                              </div>
                          </div>
                          <ul class="amazonSubImg_UL" style="overflow: hidden">
                            {{# if(subSkuAmazonDto.otherImageUrl){ }}
                                {{# layui.each(subSkuAmazonDto.otherImageUrl?.split("\\|"), function(index, prodImage){ }}
                                  <li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                      <div class="ImgDivOut">
                                          <div class="ImgDivIn" style="width:150px;height:150px">
                                              <input type="hidden" name="extImg" value="{{prodImage}}">
                                              <img style="width:100%;height:100%;object-fit:contain;" src="{{GlobalDomainImgSrc(prodImage )}} " shortname="" >
                                          </div>
                                          <div class="imgDivDown" style="width:150px">
                                                <a onclick="amazonPublish_setOldMainImg(this);" href="javascript:void(0);"style="float:left;color: #73a1bf;">设为主图</a>
                                                <a onclick="amazonPublish_delImg(this);" href="javascript:void(0);" style="float:right;color: #73a1bf;">移除</a>
                                          </div>
                                      </div>
                                  </li>
                                {{# }); }}
                              {{# } }}
                          </ul>
                        </div>
                    </div>
                  </td>
                </tr>
                {{# }); }}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</script>


<!--定时刊登-->
<script type="text/html" id="amazonPulish_listTimingTpl">
  <div class="p20">
    <form class="layui-form" action="" lay-filter="component-form-group">
      <div class="layui-form-item">
        <label class="layui-form-label">定时刊登开始时间:</label>
        <div class="layui-input-block">
          <input class="layui-input" id="amazonPulish_listTiming" name="listTiming">
        </div>
      </div>
    </form>
  </div>
</script>

<!-- 增删子sku-->
<script type="text/html" id="amazonPulish_listSubTrTpl">
  {{#  layui.each(d, function(index, subSkuAmazonDto){ }}
  <tr>
    <td hidden>{{subSkuAmazonDto.id}}</td>
    <td>
      {{# if(subSkuAmazonDto.subImgUri){ }}
      <img width="60" height="60" src="{{subSkuAmazonDto.subImgUri}}">
      <a class="img_ssku_uri disN">{{subSkuAmazonDto.subImgUri}}</a>
      {{# }else{ }}
      <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
      <a class="img_ssku_uri disN"></a>
      {{# } }}
    </td>
    <td>{{subSkuAmazonDto.storeSSku}}</td>
    <td><input type='text' name="size" class="layui-input" value='{{subSkuAmazonDto.size || ""}}'
               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
    </td>
    <td><input type='text' name="color" class="layui-input" value='{{subSkuAmazonDto.color || ""}}'
               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
    </td>
    <td><input type='number' class="layui-input" value='{{subSkuAmazonDto.msrp}}'></td>
    <td><input type='number' class="layui-input" value='{{subSkuAmazonDto.price}}'></td>
    <td><input type='number' class="layui-input" value='{{subSkuAmazonDto.shipping}}'></td>
    <td><input type='number' class="layui-input" value='{{subSkuAmazonDto.quantity}}'></td>
    <td>{{# if(subSkuAmazonDto.listingStatus==1){ }}
      成功
      {{# }else if(subSkuAmazonDto.listingStatus==2){ }}
      失败
      {{# }else if(subSkuAmazonDto.listingStatus==3){ }}
      刊登中
      {{# }else if(subSkuAmazonDto.listingStatus==0){ }}
      待刊登
      {{# } }}
    </td>
    <td>
      {{# if(subSkuAmazonDto.listingStatus==1 || subSkuAmazonDto.listingStatus==3){ }}
      <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
              onclick="removeAmazonSubListing(this)">移除
      </button>
      {{# }else{ }}
      <button type="button" class="layui-btn layui-btn-sm" onclick="removeAmazonSubListing(this)">移除</button>
      {{# } }}
    </td>
  </tr>
  {{#  }); }}
</script>

<script>
    var amazonSensArray1 = new Array();
    var amazonSalesSitesData = new Map();
    <c:forEach items = "${amazonMarkets}" var = "amazonMarket" >
      amazonSalesSitesData.set("${amazonMarket.getMarketName()}","${amazonMarket.getName()}");
    </c:forEach>

</script>

<script type="text/javascript">
    var amazonPublish_totalLogis =${logisAttrJsonList};
</script>

<!-- 复制listing-->
<script type="text/html" id="amazonPulish_copyListingTpl">
  <div class="p20">
    <form class="layui-form" action="" lay-filter="component-form-group">
      <table class="layui-table">
        <tr>
          <td>本次生成模板父SKU</td>
          <td>店铺(站点默认当前)</td>
        </tr>
        <tr>
          <td>
            <div>
              <label id="amazonPublish_skusInfo"></label>
            </div>
          </td>
          <td>
            <div class="layui-input-block">
              <select xm-select="copyStore_amazonPublish" name="copyStoreIds" xm-select-search
                      xm-select-search-type="dl" xm-select-skin="normal">
                {{# layui.each(d, function(index, storeInfo){ }}
                <option value="{{storeInfo.id}}">{{storeInfo.storeAcct}}</option>
                {{# }) }}
              </select>
            </div>
          </td>
        </tr>
      </table>
    </form>
  </div>
</script>

<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js?v=${ver}"></script>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>

<script src="${ctx}/static/js/publishs/amazon/publish.js?v=${ver}"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script src="${ctx}/static/tagsinput/tagsinput.js"></script>
<%-- 引入富文本 --%>
<script src="${ctx}/static/simditor/module.js"></script>
<script src="${ctx}/static/simditor/hotkeys.js"></script>
<script src="${ctx}/static/simditor/simditor.js"></script>
<script src="${ctx}/static/util/downloadImage.js"></script>

<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>

<%--亚马逊模板子sku--%>
<script type="text/html" id="amazonPublishSsku">
  <div>
    <table class="layui-table colspantable">
      {{# layui.each(d.prodListingSubSkuAmazons||[], function(index, item){ }} {{# if(index
      <3){ }}
      <tr style="border-bottom: 1px solid #e6e6e6 !important;">
        <td><input type='checkbox' lay-skin="primary" class="sid-cbox" lay-filter="amazonPublishSskuCheckbox"
                   value="{{item.id}}"></td>
        <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.ssku||'' }}</td>
        <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
          {{item.color||''}}
        </td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size||'' }}</td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
          {{transBoolentoStr(item.isSale||'')}}
        </td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
          {{(item.stockNum||0)  - (item.reservationNum || 0)}}/{{item.orderNotInNum||0}}/{{item.lackUnPaiNum||0}}
        </td>
      </tr>
      {{# }else{ }}
      <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expand hidden">
        <td><input type='checkbox' lay-skin="primary" class="sid-cbox" lay-filter="amazonPublishSskuCheckbox"
                   value="{{item.id}}"></td>
        <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.ssku||'' }}</td>
        <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
          {{item.color||''}}
        </td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size||'' }}</td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
          {{transBoolentoStr(item.isSale||'')}}
        </td>
        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
          {{(item.stockNum||0)  - (item.reservationNum || 0)}}/{{item.orderNotInNum||0}}/{{item.lackUnPaiNum||0}}
        </td>
      </tr>
      {{# } }} {{# }); }}
    </table>
    {{# if((d.prodListingSubSkuAmazons||[]).length>3){ }}
    <div class="expandall" data-tag="1" onclick="expandAll(this);">展开所有</div>
    {{# } }}
  </div>
</script>
<!--模板table -- 操作 -->
<script type="text/html" id="amazonPublishAmazonOption">
  <%--<button class="layui-btn layui-btn-xs" lay-event="amazonPublishTempDetail">详情</button><br>--%>
  <button class="layui-btn layui-btn-xs" lay-event="" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}')">
    竞品链接
  </button><br>
  <button class="layui-btn layui-btn-xs" lay-event="" onclick="producttpl_getListingStatus('{{d.prodPId}}')">刊登状态
  </button><br>
  <button class="layui-btn layui-btn-xs layui-btn-xs devIdeaWayBtn" dataid="{{d.prodPId}}">开发思路</button>
</script>
<%--修改亚马逊模板。--%>
<script type="text/html" id="amazonPublishModifyAmazonTemplate">
  <form class="layui-form p10" id="amazonPublishModifyAmazonTemplateForm">
    <div id="amazonPublishModifyAmazonTemplateView"></div>
  </form>
</script>

<%--第一步：编写模版。你可以使用一个script标签存放模板，如：--%>
<script id="amazonPublishModifyAmazonTemplateContainer" type="text/html">
  <div class="layui-form-item">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">父SKU</label>
      <div class="layui-input-block">
        <input name="pSku" class="layui-input" readonly value="{{ d.pSku||'' }}">
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">OA类目</label>
      <div class="layui-input-block">
        <input name="cateTreeName" class="layui-input" readonly value="{{ d.cateTreeName||'' }}">
      </div>
    </div>
    <input type="hidden" value="{{ d.id }}" name="amazonNewPublishId">
    <input name="upcExemptionFlag" type="hidden" value="{{d.upcExemptionFlag}}"/>
    <input name="logisAttrList" type="hidden" value="{{d.logisAttrList}}"/>
    <input name="listingStatus" type="hidden" value="{{d.listingStatus}}"/>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">标题</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input name="itemName" class="layui-input ifFocusInput" data-prodpsku="{{d.pSku}}" value="{{ d.itemName||'' }}">
        <!-- <span id="amazonPublishModifyAmazonTemplate_titleLength" class="{{(d.itemName||'').length>150 ? 'redTitle': 'greenTitle'}}" style="margin-left: 10px; font-weight: 700;">{{(d.itemName||'').length}}</span> -->
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <div style="display: flex;height: 18px;line-height: 18px;font-size:12px;margin-left: 110px;">
        {{d.titleLimitRemark || ''}}
      </div>
    </div>
  </div>
  <div class="layui-form-item" id="newTplSSkuTitleBox" style="display: none;">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">标题（子）</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input ifFocusInput" data-prodpsku="{{d.pSku}}" name="subTitle" id="newTplSSkuTitle">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">卖点1</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPointStyle1_1" value="{{ d.sellingPointStyle1_1||'' }}">
        <span id="AmazonDetail_sellingPoint1Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonDetail_sellingPoint1Count">0</span> / 500
        </span>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">卖点2</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPointStyle1_2" value="{{ d.sellingPointStyle1_2||'' }}">
        <span id="AmazonDetail_sellingPoint2Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonDetail_sellingPoint2Count">0</span> / 500
        </span>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">卖点3</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPointStyle1_3" value="{{ d.sellingPointStyle1_3||'' }}">
        <span id="AmazonDetail_sellingPoint3Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonDetail_sellingPoint3Count">0</span> / 500
        </span>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">卖点4</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPointStyle1_4" value="{{ d.sellingPointStyle1_4||'' }}">
        <span id="AmazonDetail_sellingPoint4Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonDetail_sellingPoint4Count">0</span> / 500
        </span>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">卖点5</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPointStyle1_5" value="{{ d.sellingPointStyle1_5||'' }}">
        <span id="AmazonDetail_sellingPoint5Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonDetail_sellingPoint5Count">0</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10">
      <label class="layui-form-label" style="width: 100px">亚马逊侵权品牌</label>
      <div class="layui-input-block">
        <div style="color: red;line-height: 30px">{{ d.tortBrand }}</div>
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10">
      <label class="layui-form-label redStar">商品描述</label>
      <div class="layui-input-block">
        <textarea class="layui-textarea" name="prodDesc" id="amazonPublishProdDesc" style="display: none">{{ d.prodDesc||'' }}</textarea>
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10 mb10">
        <label class="layui-form-label">刊登模板</label>
        <div class="layui-input-block">
            <div class="tagsinput-primary form-group">
                <input class="layui-input" readonly value="{{ d.tempFileName||'' }}">
            </div>
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10 mb10">
      <label class="layui-form-label">检索词</label>
      <div class="layui-input-block">
        <div class="tagsinput-primary form-group">
          <input class="tagsinput" name="tag" type="text" value="{{ d.tag||'' }}">
        </div>
      </div>
    </div>
    <div class="layui-col-lg2 layui-col-md2">
      <label class="layui-form-label redStar">站点</label>
      <div class="layui-input-block">
        <input class="layui-input" name="salesSite" id="salesSite" value="{{ d.salesSite||'' }}">
      </div>
    </div>
    <div class="layui-col-lg6 layui-col-md6">
      <label class="layui-form-label redStar">亚马逊子类目</label>
      <div class="layui-input-block">
        <input class="layui-input fullCateName" value="{{ d.fullCateName||'' }}">
        <input type="hidden" class="categoryId" value="{{ d.cateList[0]?.categoryId||'' }}">
      </div>
    </div>
    <div class="layui-col-lg2 layui-col-md2">
      <div class="layui-input-block">
        <select id="newfulfillmentCenterId" name="fulfillmentCenterId" lay-filter="newfulfillmentCenterId">
          {{# layui.each(d.fulfillmentCenterIdData||[], function(index, item){ }}
          {{# if((d.fulfillmentCenterId&&d.fulfillmentCenterId == item)||(!d.fulfillmentCenterId&&'DEFAULT' == item)){ }}
          <option value='{{item}}' selected>{{item}}</option>
          {{# }else{ }}
          <option value='{{item}}'>{{item}}</option>
          {{# } }}
          {{# }) }}
        </select>
      </div>
    </div>
    <div class="layui-col-lg2 layui-col-md2" style="display: none" id="shippingType_detail">
      <label class="layui-form-label">发货类型</label>
      <div class="layui-input-block">
        <select name="shippingType" lay-filter="shippingType_detail">
          <option value=""></option>
          <option value="1">空运</option>
          <option value="2">海运</option>
        </select>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div style="display: flex;">
      <h2>类目属性</h2>
      <div id="newTplSkuAttr" class="layui-col-lg5 layui-col-md5" style="margin-left: 20px;display: none">
        <div class="layui-input-inline" style="width: 50%;display:flex;align-items:center">
          <select id="newTplSkuChoose" name="newTplSkuChoose" lay-filter="newTplSkuChoose">
          </select>
          <button type="button" class="layui-btn layui-btn-xs" style="margin-left: 10px" id="newTplApplyOtherAttr">应用至其他变种</button>
        </div>
      </div>
    </div>
    <hr>
    <div id="amazonPublish_editspecificForm">
    </div>
    <hr>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">variation theme</label>
      <div class="layui-input-block">
        <input class="layui-input" readonly name="lazadaPublishVariationTheme">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <table class="layui-table" id="amazonPublishThemeTable" style="width: 500px;">
      <thead>
    <tr>
      <th>AMZ属性</th>
      <th>映射OA属性</th>
    </tr>
    </thead>
      <tbody>
      {{# layui.each(d.varietionThemeTable||[], function(index, item){ }}
      <tr>
        <td>{{item?.split(":")[0]||''}}</td>
        <td>{{item?.split(":")[1]||''}}</td>
      </tr>
      {{# }); }}
      </tbody>
    </table>
    <hr>
    <h2>变种参数</h2>
    <div style="float: left;margin-left: 15px" class="multi-box">
      <input id="allBoxNewTemp" type="checkbox" class="allid-cbox" lay-filter="allBox" lay-skin="primary" name="id">
    </div>
      <div id="grossProfitRateNewTemp" class="layui-col-lg3 layui-col-md3 layui-col-md-offset8" style="margin-bottom: 10px;">
        <label class="layui-form-label">毛利率</label>
        <div class="layui-input-inline" style="display:flex;align-items: center">
          <input class="layui-input" name="grossProfitRate" value="{{ d.grossProfitRate||'' }}">
          <span> % </span>
        </div>
        <button type="button" class="layui-btn layui-btn-sm" onclick="setPriceNewTemp('btnSetPrice')">定价</button>
      </div>
      <button type="button"
          class="addAmazonSkuListing layui-btn layui-btn-sm layui-btn-normal fr"
          onclick="addAmazonSkuListing('amazonPublishSkuTable')">
        添加一行
      </button>
    <hr>
    <div id="amazonPublishSkuTable"></div>
  </div>

</script>

<script type="text/html" id="amazonCateSpecificsNewTemp">
  <div class="layui-col-md12 amazonCateSpecifics">
    <div class="layui-card">
      <div class="layui-card-header">分类属性
        <a class="layui-btn layui-btn-xs" id="publish_toogleLangBtn">切换语言</a></div>
        <div class="layui-card-body layui-row" id="detailRequireVal">
          {{# layui.each(d.cateList||[], function(index, item){ }}
            {{# if(item.required){ }}
              {{# if(item.validValues){ }}
                <div class="layui-form-item toggleClass requireEle">
                  <label class="layui-form-label redStar" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <select>
                      <option></option>
                      {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                        <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                        {{# }); }}
                    </select>
                  </div>
                </div>
              {{# }else{ }}
                <div class="layui-form-item toggleClass requireEle">
                  <label class="layui-form-label redStar" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
                  </div>
                  {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('detailRequireVal')">转换成inch</button>
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('detailRequireVal')">转换成cm</button>
                  {{# } }}
                  {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('detailRequireVal')">转换成oz</button>
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('detailRequireVal')">转换成g</button>
                  {{# } }}
                </div>
              {{# } }} 
            {{# } }}
          {{# }); }}
          <div id="publish_hiddenAttrArea"></div>
          <div>
            <a class="layui-btn layui-btn-xs" id="publish_moreAttrBtn">更多选填属性</a>
          </div>
          <div style="display: none;" id="detailOptionVal">
          {{# layui.each(d.cateList||[], function(index, item){ }}
            {{# if(!item.required){ }}
              {{# if(item.validValues){ }}
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <select>
                      <option></option>
                      {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                      <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                      {{# }); }}
                    </select>
                  </div>
                </div>
              {{# }else{ }}
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <input type="text" class="layui-input" value="{{item.defaultValue||''}}">
                  </div>
                </div>
              {{# } }}
            {{# } }}
            {{# if(item.test){ }}
              {{# if(item.validValues){ }}
                <div class="layui-form-item testClass">
                  <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <select>
                      <option></option>
                      {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
                      <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
                      {{# }); }}
                    </select>
                  </div>
                </div>
              {{# }else{ }}
                <div class="layui-form-item testClass">
                  <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
                  <span class="disN labelField">{{item.fieldName}}</span>
                  <div class="layui-input-inline">
                    <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
                  </div>
                  {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
                    <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('detailOptionVal')">转换成inch</button>
                    <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('detailOptionVal')">转换成cm</button>
                  {{# } }}
                  {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('detailOptionVal')">转换成oz</button>
                      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('detailOptionVal')">转换成g</button>
                  {{# } }}
              </div>
              {{# } }}
            {{# } }}
          {{# }); }}

            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
  </div>

</script>
<script type="text/html" id="prodListingSubTable">
  {{# layui.each(d.prodListingSubSkuAmazons||[], function(index, item){ }}
    <div class="amazon_publish_variant">
    <table class="layui-table">
      <thead>
      <tr>
        <th rowspan="2"></th>
        <th rowspan="2">主图</th>
        <th name="ssku" rowspan="2">店铺子SKU</th>
        <th rowspan="2" class="upcExemptionFlag">UPC/EAN</th>
        <th rowspan="2" class="upcExemptionFlag">product_id</th>
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <th rowspan="2" data-key="{{cItem?.split(":")[1]||''}}">{{cItem?.split(":")[0]||''}}</th>
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <th rowspan="2" data-key="colorMapValue">colormap</th>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <th rowspan="2" data-key="sizeMapValue">sizemap</th>
        {{# } }}
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '成本' : 'FBA成本'}}(&yen;)</th>
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '重量' : 'FBA重量'}}(g)</th>
        <th rowspan="2" class="basicInfo">{{item.isDefault ? '尺寸' : 'FBA尺寸'}}(cm)</th>
        <th rowspan="2">价格</th>
        <th colspan="3" class="fulfillmentCenterId">
          <div class="disflex" style="align-items: center;">
            <div class="w60">FBA定价</div>
            <div>
<%--                <select name="priceCate" lay-search>--%>
<%--                  <option value="正常分类" selected>正常分类</option>--%>
<%--                  <option value="美妆">美妆</option>--%>
<%--                  <option value="服装与配饰">服装与配饰</option>--%>
<%--                  <option value="母婴（非服饰）">母婴（非服饰）</option>--%>
<%--                  <option value="家具（含户外家具）">家具（含户外家具）</option>--%>
<%--                  <option value="个护健康（含个护用品）">个护健康（含个护用品）</option>--%>
<%--                  <option value="工业和科学用品">工业和科学用品</option>--%>
<%--                  <option value="电子产品配件">电子产品配件</option>--%>
<%--                  <option value="珠宝首饰">珠宝首饰</option>--%>
<%--                  <option value="汽车用品">汽车用品</option>--%>
<%--                  <option value="钟表">钟表</option>--%>
<%--                  <option value="食品">食品</option>--%>
<%--                  <option value="消费类电子产品">消费类电子产品</option>--%>
<%--                </select>--%>
                  <select name="fbaPlatCommisionRuleId" lay-search>
                      <option></option>
                  {{# layui.each(d.getAllCommisionCateRuleData||[], function(index, cItem){ }}
                      <option value="{{cItem.id}}" {{cItem.id == d.fbaPlatCommisionRuleId?'selected':''}}>{{cItem.ruleName}}</option>
                  {{# }); }}
                  </select>
            </div>
          </div>
        </th>
        <th class="notFulfillmentCenterId" rowspan="2">库存</th>
        <th rowspan="2">操作</th>
      </tr>
      <tr>
        <th class="fulfillmentCenterId">派送费</th>
        <th class="fulfillmentCenterId">快递单个头程(&yen;)</th>
        <th class="fulfillmentCenterId">利润率</th>
      </tr>
      </thead>
      <tbody id="amazonPublish_newSubSkuInfo">
      <tr class="amazonPublish_detail_table">
        <td>
          <div class="layui-form">
            <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{
              item.id }}
                   name="id" data-id="{{item.id}}">
          </div>
        </td>
        <td>
          <div>
            <div class="swatch">
              <input type="radio" class="img-cbox" lay-skin="primary" name="{{ 'imgCbox' + index }}" value={{
                item.mainImageUrl }} lay-filter="swatchRadio" select="false">
              <span>设为swatch图</span>
            </div>
            <img name="mainImg" src="{{item.mainImageUrl||''}}" width="150" height="150">
          </div>
        </td>
        <td>
          <span name="storeSSku">{{item.storeSSku||''}}</span>
          <input style="display:none" class="layui-input" name="prodListingSubSkuAmazonsStoreSSku">
          <div style="display:none" class="addBtn">
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_new_autoSetWeightPrice(this,`{{item.externalProductIdType}}`, 'newTpl')">自动补充</a>
          </div>
          <input type="hidden" value="{{item.id}}" name="prodListingSubSkuAmazonsId">
          <input type="hidden" value="{{item.prodSSku}}" name="prodSSku">
          <input type="hidden" value="{{item.prodTempId}}" name="prodTempId">
          <input type="hidden" value="{{item.color}}" name="color">
          <input type="hidden" value="{{item.size}}" name="size">
          <input type="hidden" value="{{item.attrKeyVal}}" name="attrKeyVal">
          <input type="hidden" value="{{item.purchaseCostPrice}}" name="purchaseCostPrice">
          <input type="hidden" value="{{item.weight}}" name="weight">
          <input type="hidden" value="{{item.currency}}" name="currency">
          <input type="hidden" value="{{item.outerBoxLength}}" name="outerBoxLength">
          <input type="hidden" value="{{item.outerBoxWidth}}" name="outerBoxWidth">
          <input type="hidden" value="{{item.outerBoxHeight}}" name="outerBoxHeight">
        </td>
        <td class="externalProductIdType upcExemptionFlag">{{item.externalProductIdType||''}}</td>
        <td class="upcExemptionFlag">
          <input type='text' readonly class="layui-input" name="externalProductId" value="{{item.externalProductId ||''}}">
          <div>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_regenerate(this,`{{item.externalProductIdType}}`)">重新生成</a>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_empty(this,{{item.id}})">清空</a>
          </div>
        </td>
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <%--现根据亚马逊新模板中的修改弹窗参照修改,spliceString这个属性不清楚什么情况下显示--%>
        {{#if(cItem?.split(":")[1].length * 1 > 8){ }}
        <td class="tdVal" data-key="spliceString">
          <span class="themeValue">{{item.spliceString || ''}}</span>
          <input style="display:none" class="layui-input" name="spliceString" value="{{item.spliceString || ''}}">
        </td>
        {{# }else{ }}
        <td class="tdVal" data-key="{{cItem?.split(":")[1]||''}}">
          <span class="themeValue">{{item[cItem?.split(":")[1]]}}</span>
          <input style="display:none" class="layui-input" name="sizeColor" value="{{item[cItem?.split(":")[1]]}}">
        </td>
        {{# } }}
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <td class="tdVal" data-key="colorMapValue">
          <span class="themeValue">{{item.colorMapValue||''}}</span>
          <input style="display:none" class="layui-input" name="colorMapValue">
        </td>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <td class="tdVal" data-key="sizeMapValue">
          <span class="themeValue">{{item.sizeMapValue||''}}</span>
          <input style="display:none" class="layui-input" name="sizeMapValue">
        </td>
        {{# } }}
        <td class="purchaseCostPrice">{{item.purchaseCostPrice || ''}}</td>
        <td class="cskuWeight">{{item.weight||''}}</td>
        <td class="outerBoxSize">
          <div>长：{{item.outerBoxLength}}</div>
          <div>宽：{{item.outerBoxWidth}}</div>
          <div>高：{{item.outerBoxHeight}}</div>
        </td>
        <td>
          <div class="disflex">
            <input type="number" class="layui-input changePrice changePrice{{item.id}}" name="standardPrice" min="0" value="{{item.standardPrice||''}}">
            <label class="ml10">{{item.currency ||''}}</label>
          </div>
          <a class="layui-btn layui-btn-xs fulfillmentCenterId" onclick="amazonPublish_updateProfitRate(this,'input')">更新利润率</a>
        </td>
        <td class="fbaCharge fulfillmentCenterId">{{item.fbaCharge||''}}</td>
        <td class="firstLogisticsFee fulfillmentCenterId">{{item.firstLogisticsFee||''}}</td>
        <td class="fbaProfitRate fulfillmentCenterId">
          <div>快递利润率：<span class="airTransportProfitRate">{{item.airTransportProfitRate||''}}</span></div>
          <div>空派利润率：<span class="airDeliveryProfitRate">{{item.airDeliveryProfitRate||''}}</span></div>
          <div>海运利润率：<span class="seaTransportProfitRate">{{item.seaTransportProfitRate||''}}</span></div>
        </td>
        <td class="notFulfillmentCenterId">
          <input type="number" class="layui-input quantity" min="0" name="quantity" value="{{item.quantity||''}}"
            onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
          >
        </td>
        <td>
          <a class="layui-btn layui-btn-xs" onclick="removeAmazonSku(this, 'newTpl')">移除</a>
          {{# if(item.listingStatus==0 || item.listingStatus == 2){ }}
            <a class="layui-btn layui-btn-xs" name="saveBtn" onclick="amazonPublish_subsku_save(this,{{item.id}})">保存</a>
          {{# } }}
        </td>
      </tr>
      </tbody>
    </table>
    <h3>辅图
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 publish_addLocalPicture">本地图片</button>
      <button type="button" class="layui-btn layui-btn-sm mt05" onclick="publish_addPicture($(this))">网络图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 addImgByTpl" data-prodssku="{{item.prodSSku}}" onclick="amazon_publish_addImgByTpl($(this),true)">模板图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="cancelSwatch($(this))">不选择swatch图</button>
      <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
        <span class="layui-bg-red">说明！</span>
        <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
        <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">{{d.subSkuMaxImgLimit}}</span>张，已经选用了<span class="curImgNum">{{item.otherImageUrl?.split("|").length || 0}}</span>张辅图</span>
      </div>
    </h3>
    <div class="layui-clear pl20 imgContains dis_flex">
      <ul class="uploadImgUL ui-sortable" style="width: 100%;">
        {{# layui.each(item.otherImageUrl?.split("|")||[], function(cIndex, cItem){ }}
        <li draggable="true" class="imgBox_prodTpl" data-src="{{cItem}}" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
          <div class="ImgDivOut">
            <div style="width: 100%; display:flex;justify-content: center">
              <input type="radio" class="img-cbox" style="margin-left:-10px" name="{{ 'imgCbox' + index }}" value="{{cItem}}" lay-skin="primary" lay-filter="swatchRadio" select="false">
              <span>设为swatch图</span>
            </div>
            <div class="ImgDivIn" style="width:150px;height:150px">
              <%--<input type="hidden" name="extImg" value="{{cItem||''}}">--%>
              <img style="width:100%;height:100%;object-fit:contain;" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" src="{{cItem}}" >
            </div>
            <div class="imgDivDown" style="width:150px">
              <a onclick="amazonStore_setMainImg(this);" href="javascript:void(0);"style="float:left;color: #73a1bf;">设为主图</a>
              <a onclick="amazonStore_delImg(this);" href="javascript:void(0);" style="float:right;color: #73a1bf;">移除</a>
            </div>
          </div>
        </li>
        {{# }); }}
      </ul>
    </div>
    </div>
  {{# }); }}
</script>

<script type="text/html" id="amazonPublishaddHiddenAttrModal">
  <div class="layui-card">
    <div class="layui-card-body layui-form layui-col-lg12 layui-col-md12" id="amazonPublishaddHiddenAttrInfo">
      {{# layui.each(d.temporaryHiddenAttrObj, function(_,item){ }}
      <div class="layui-col-lg4 layui-col-md4" title="{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}">
        <input type="checkbox" name="hiddenAttr" title="{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}" value="{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}" lay-skin="primary" {{item.checked && 'checked'}}> 
      </div>
      {{# }); }}
    </div>
  </div>
</script>

<script type="text/html" id="amazonPublishaddHiddenAttrTpl">
  {{# layui.each(d.temporaryHiddenAttrList||[], function(index, item){ }}
  {{# if(item.required){ }}
  {{# if(item.validValues){ }}
  <div class="layui-form-item toggleClass requireEle hiddenAttrEle">
    <label class="layui-form-label redStar" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
    <span class="disN labelField">{{item.fieldName}}</span>
    <div class="layui-input-inline">
    <select>
        {{# if(item.fieldName != 'feed_product_type'){ }}
          <option></option> 
        {{# } }}
        {{# layui.each(item.validValues.split("#,#")||[], function(index, cItem){ }}
        <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
        {{# }); }}
      </select>
    </div>
  </div>
  {{# }else{ }}
  <div class="layui-form-item toggleClass requireEle hiddenAttrEle">
    <label class="layui-form-label redStar" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
    <span class="disN labelField">{{item.fieldName}}</span>
    <div class="layui-input-inline">
      <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
    </div>
    {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('requireValue')">转换成inch</button>
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('requireValue')">转换成cm</button>
    {{# } }}
    {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('requireValue')">转换成oz</button>
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('requireValue')">转换成g</button>
    {{# } }}
  </div>
  {{# } }} 
  {{# } }}
  {{# if(!item.required){ }}
  {{# if(item.validValues){ }}
    <div class="layui-form-item hiddenAttrEle">
      <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
      <span class="disN labelField">{{item.fieldName}}</span>
      <div class="layui-input-inline">
        <select>
          <option></option>
          {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
          <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
          {{# }); }}
        </select>
      </div>
    </div>
    {{# }else{ }}
    <div class="layui-form-item hiddenAttrEle">
      <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
      <span class="disN labelField">{{item.fieldName}}</span>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" value="{{item.defaultValue||''}}">
      </div>
    </div>
  {{# } }}{{# } }}
  {{# if(item.test){ }}
  {{# if(item.validValues){ }}
    <div class="layui-form-item testClass hiddenAttrEle">
      <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
      <span class="disN labelField">{{item.fieldName}}</span>
      <div class="layui-input-inline">
        <select>
          <option></option>
          {{# layui.each(item.validValues?.split("#,#")||[], function(index, cItem){ }}
          <option {{cItem==item.defaultValue?"selected":""}}>{{cItem}}</option>
          {{# }); }}
        </select>
      </div>
    </div>
    {{# }else{ }}
    <div class="layui-form-item testClass hiddenAttrEle">
      <label class="layui-form-label" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
      <span class="disN labelField">{{item.fieldName}}</span>
      <div class="layui-input-inline">
        <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
      </div>
      {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('optionValue')">转换成inch</button>
        <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('optionValue')">转换成cm</button>
      {{# } }}
      {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
          <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('optionValue')">转换成oz</button>
          <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('optionValue')">转换成g</button>
      {{# } }}
    </div>
  {{# } }}
  {{# } }}
  {{# }); }}
</script>

<!-- GPT生成 -->
<script type="text/html" id="amazonGenerateFromGPTLayTpl">
  <form class="layui-form" style="padding: 20px 10px 0 0;">
    <div class="layui-form-item">
      <span style="margin-left:130px;">输入生成内容所需关键词,逗号分割:</span>
      <permTag:perm funcCode="amazon_publish_gpt_prompt_config_perm">
      <span class="layui-btn layui-btn-sm" id="gpt_prompt_config">prompt配置</span>
      </permTag:perm>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label first-label">关键词</label>
      <div class="layui-input-block" style="display: flex;">
        <div style="width: 100%;">
          <input type="text" class="layui-input ifFocusInput" name="gpt_keywords">
        </div>
        <div style="width: 120px;margin-left:10px;">
          <span class="layui-btn layui-btn-sm" id="gpt_generate">生成</span>
          <span class="layui-btn layui-btn-sm layui-btn-primary" id="gpt_clear">清空</span>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="全选" lay-skin="primary" lay-filter="gpt_p_check_filter" name="gpt_p_check">
      </div>
      <div class="layui-input-block">
        <span>选择已生成内容应用至亚马逊模板/刊登:</span>
        <span class="layui-btn layui-btn-sm gpt-copy">复制勾选内容</span>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="标题" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input ifFocusInput gpt-content" name="enTitle">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点1" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_1" maxlength="500">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点2" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_2" maxlength="500">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点3" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_3" maxlength="500">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点4" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_4" maxlength="500">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点5" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_5" maxlength="500">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="产品描述" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <textarea class="layui-textarea gpt-content" name="amazonPublishDesc"></textarea>
      </div>
    </div>
  </form>
</script>

<!-- GPT生成-prompt配置 -->
<script type="text/html" id="amazonGenerateFromGPTPrompt">
  <form class="layui-form" style="padding: 20px 10px 0 0;">
    <div class="layui-form-item">
      <div class="layui-form-label">标题prompt</div>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="amazonTitlePrompt">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">卖点prompt</div>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="amazonSellingPointsPrompt">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">产品描述prompt</div>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="amazonDescriptionPrompt">
      </div>
    </div>
  </form>
</script>
