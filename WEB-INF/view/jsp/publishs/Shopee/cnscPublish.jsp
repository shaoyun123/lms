<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
    <title>CNSC刊登</title>
    <!-- 这个页面跟shopee刊登页面的区别在于接口 CV-->
    <style>
      #shopeeCNSCPublish_extImg {
        overflow: hidden
      }

      #shopeeCNSCPublish_extImg li {
        float: left;
        margin-right: 10px
      }

      .dis_flex {
        display: flex;
        justify-content: flex-start;
      }

      #shopeeCNSCPublish_searchForm .layui-form-item {
        margin-bottom: 0
      }

      td[class="colspan_td"]>table>tbody tr:first-child td {
        border-top: none;
      }

      td[class="colspan_td"]>table>tbody tr:last-child td {
        border-bottom: none;
      }

      td[class="colspan_td"]>table>tbody tr td {
        border-left: none;
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
      }

      #shopeeCNSCPublish_table th,
      #shopeeCNSCPublish_table td {
        text-align: center;
        padding: 5px 0;
        white-space: normal;
        overflow: visible;
        word-wrap: break-word;
      }

      .shopeeCNSCPublish_table_head table,
      .shopeeCNSCPublish_table_body table {
        width: 100%;
        margin: 0;
        table-layout: fixed;
      }

      #shopeeCNSCPublish_pagination {
        position: fixed;
        z-index: 999999;
        bottom: 0;
        background: #fff;
        /* box-shadow: 10px 10px 5px #888; */
        width: 100%;
      }
      #shopeeCNSCPublish_detail_atributes .label-attr-width{
        width: 300px;
      } 
      #shopee_cnscPublish_morePublish_export {
        position: relative;
      }
      #shopee_cnscPublish_morePublish_exportBtn {
        position: absolute;
        overflow: hidden;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
        opacity: 0;
      }
      #shopeePulish_selWaterForm2 .long_check_box_title span{
        padding-left: 27px;
        white-space: pre-wrap;
      }
      #shopeePulish_selWaterForm2 .long_check_box_title .layui-form-checkbox[lay-skin=primary] i{
        top: -35px;
      }
      #shopeeCNSCPublish_editDetailForm .layui-form-label{
        width: 130px;
        padding: 9px 5px;
      }
      #shopeeCNSCPublish_editDetailForm .layui-input-block{
        margin-left: 140px;
      }
      #shopeeCNSCPublish_detail_cnscDesc,
      #shopeeCNSCPublish_detail_Desc {
        white-space: pre-line;
      }
    </style>
    <div class="layui-fluid" id="shopee_cnscPublish">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
          <div class="layui-card">
            <div class="layui-card-body">
              <form action="" class="layui-form" id="shopeeCNSCPublish_searchForm" lay-filter="shopeeCNSCPublish_searchForm">
                <div class="layui-form-item layui-row">
                  <input name="listingStatus" value="-2" type="hidden">
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                      <select id="shopeeCNSCPublish_group_sel" name="orgId" lay-filter="shopeeCNSCPublish_group_sel"
                        class="orgs_hp_custom" lay-search>
                        <option value=""></option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-block">
                      <select id="shopeeCNSCPublish_salesman_sel" name="sellerId"
                        lay-filter="shopeeCNSCPublish_salesman_sel" lay-search class="users_hp_custom"
                        data-roleList="shopee专员">
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                      <select name="storeAcctId" id="shopeeCNSCPublish_searchForm_storeAcctId" data-platcode="shopee" class="store_hp_custom" lay-filter="shopeeCNSCPublish_searchForm_storeAcctId">
                        <option value=""></option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                      <select name="salesSite" lay-search>
                        <option value="">请选择</option>
                        <c:forEach items="${siteIds}" var="siteId">
                          <option value="${siteId.getCode()}">${siteId.getName()}</option>
                        </c:forEach>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">OA新类目</label>
                    <div class="layui-input-block">
                      <input id="shop_cnsc_oaNewCates" name="oaNewCates"/>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">OA新类目ID</label>
                    <div class="layui-input-block">
                      <input name="cateOaIdListInput" class="layui-input" onblur="commonBlurMoreNum(event)">
                    </div>
                  </div>
                  <!-- <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">选择类目</label>
                    <div class="layui-input-block">
                      <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                        id="shopeeCNSCPublish_item">选择类目</button>
                      <i class="layui-icon layui-icon-delete"
                        onclick="clearCate('LAY-publishs-shopee-cnscPublish-div','LAY-publishs-shopee-cnscPublish-hidden')"
                        style="cursor:pointer" title="删除产品类目"></i>
                      <input type="hidden" id="LAY-publishs-shopee-cnscPublish-hidden" name="cateId">
                    </div>
                  </div> -->

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
                        <option>
                          <c:forEach items="${prodTagMap}" var="prodTag">
                        <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                        </c:forEach>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">物流属性</label>
                    <div class="layui-input-block">
                      <select xm-select="selectAttr_shopee_cnscPublish" name="logisAttrContents" xm-select-search xm-select-search-type="dl"
                        xm-select-skin="normal">
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2 disN">
                    <label class="layui-form-label">普货特货</label>
                    <div class="layui-input-block">
                      <select name="specFlag">
                        <option value="false">普货</option>
                        <option value="true">特货</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">商品归属人</label>
                    <div class="layui-input-block">
                      <select xm-select="selectMan_shopee_cnscPublish" name="bizzOwnerIds" xm-select-search
                        xm-select-search-type="dl" xm-select-skin="normal">
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">CNSC类目</label>
                    <div class="layui-input-block">
                      <input id="shop_cnsc_cnscCates" name="cnscCates"/>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">CNSC类目ID</label>
                    <div class="layui-input-block">
                      <input name="cateIdListCNSCInput" class="layui-input" onblur="commonBlurMoreNum(event)"/>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">侵权状态</label>
                    <div class="layui-input-block">
                      <select name="tortBanListing" lay-search>
                        <%-- <c:forEach items="${tortBanListings}" var="tortBanListing">
                          <option value="${tortBanListing.name()}">${tortBanListing.getText()}</option>
                        </c:forEach> --%>
                        <option value="CURRENT_PLAT">shopee不侵权</option>
                        <option value="ANY_PLAT">所有平台都不侵权</option>
                        <option value="ALL">全部</option>  
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">在售状态</label>
                    <div class="layui-input-block">
                      <select name="saleStatusList" xm-select="shopeeCNSCPublish_searchForm_saleStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                        <option value="">请选择</option>
                        <option value="2" selected>全部在售</option>
                        <option value="1" selected>部分在售</option>
                        <option value="0">完全停售</option>
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
                    <label class="layui-form-label">生成情况</label>
                    <div class="layui-input-block">
                      <select name="existListing">
                        <option value="">全部</option>
                        <option value="false" selected>未生成</option>
                        <option value="true">已生成</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">是否禁售</label>
                    <div class="layui-input-block">
                      <select name="canSaleBool">
                        <option value="true" selected>非禁售</option>
                        <option value="false">禁售</option>
                        <option value="">全部</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label  labelSel">
                      <select name="timeType">
                        <option value="CREATE_TIME">创建时间</option>
                        <option value="AUDIT_TIME">审核时间</option>
                        <option value="PUBLISH_TIME">刊登时间</option>
                      </select>
                    </div>
                    <div class="layui-input-block">
                      <input type="text" name="time" autocomplete="off" class="layui-input" id="shopeeCNSCPublishTime">
                    </div>
                  </div>
                  <div class="layui-col-lg4 layui-col-md4">
                    <!-- <label class="layui-form-label">库存</label>
                    <div class="layui-input-block">
                      <input type="checkbox" name="filterZeroStock" lay-skin="primary" title="过滤零库存">
                    </div> -->
                    <div class="layui-form-label labelSel" style="padding-right: 0px;width: 200px;display: flex;">
                      <select name="warehouseId" id="shopeeCNSCPublishWarehouseId"></select>
                      <select name="isIncludeStockAll" lay-filter="shopeeCNSCPublishIsIncludeStockAll">
                        <option value="true">预计可用库存(含在途)</option>
                        <option value="false">预计可用库存(不含在途)</option>
                      </select>
                    </div>
                    <div class="layui-input-block disflex" style="margin-left: 200px;">
                      <div>
                        <select name="stockAttrType" lay-search>
                          <option value="1">部分属性</option>
                          <option value="2">全部属性</option>
                        </select>
                      </div>
                      <div class="disflex">
                        <div><input type="text" class="layui-input" name="stockMin" placeholder=">="></div>
                        <div><input type="text" class="layui-input" name="stockMax" placeholder="<="></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">本人设置</label>
                    <div class="layui-input-block">
                      <select id="shopee_cnscPublish_mack_listing_select_unqiue_id" name="mackListingType">
                        <option value="">请选择</option>
                        <option value="1" selected>可刊登</option>
                        <option value="0">不刊登</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label  labelSel">
                      <select name="searchType" lay-filter="shopeeCNSCPublish_showHideVagueFlag">
                        <option value="pSkus">父SKU</option>
                        <option value="sSkus">模板子SKU</option>
                        <option value="cnTitle">商品中文</option>
                        <option value="enTitle">商品英文</option>
                      </select>
                    </div>
                    <div class="layui-input-block">
                      <div class="layui-col-md8 layui-col-lg8">
                        <input name="searchText" type="text" class="layui-input" placeholder="">
                      </div>
                      <div id="shopee_cnscPublish_skuVagueFlag_div" class="layui-col-md4 layui-col-lg4">
                        <select name="skuVagueFlag">
                          <option value="false">精确</option>
                          <option value="true">模糊</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-md4 layui-col-lg4 failInfo hidden">
                    <label class="layui-form-label">错误查询</label>
                    <div class="layui-input-block">
                      <div class="layui-col-md6 layui-col-lg6">
                        <select name="listingRespCode" lay-search>
                          <option value="">请选择</option>
                          <option value="分层失败">分层失败</option>
                          <option value="不可刊登">不可刊登</option>
                          <option value="刊登信息问题">刊登信息问题</option>
                          <option value="刊登超时">刊登超时</option>
                        </select>
                      </div>
                      <div class="layui-col-md6 layui-col-lg6">
                        <input name="listingRespMsg" placeholder="错误信息" class="layui-input" autocomplete="off">
                      </div>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label labelSel">
                      <select name="searchSalesType" id="searchSalesType" lay-search>
                        <option value="1">7日销量</option>
                        <option value="2">15日销量</option>
                        <option value="3">30日销量</option>
                      </select>
                    </div>
                    <div class="layui-input-block dis_flex">
                      <input type="text" name="salesMin" autocomplete="off" class="layui-input" id="salesMin">
                      <input type="text" name="salesMax" autocomplete="off" class="layui-input" id="salesMax">
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label">排序</div>
                    <div class="layui-input-block">
                      <select name="salesSort" id="shopee_cnscPublish_salesSort" lay-search>
                        <option value="1">7日销量倒序排列</option>
                        <option value="2">15日销量倒序排列</option>
                        <option value="3">30日销量倒序排列</option>
                        <option value="4">模板创建时间升序</option>
                        <option value="5">模板创建时间降序</option>
                        <option value="8">模板审核时间升序</option>
                        <option value="9">模板审核时间降序</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label">商品重量(g)</div>
                    <div class="layui-input-block dis_flex">
                      <input type="text" name="weightMin" autocomplete="off" class="layui-input"/>
                      <input type="text" name="weightMax" autocomplete="off" class="layui-input"/>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2 cnscTitleRepeated disN">
                    <div class="layui-form-label" style="padding: 9px 15px 9px 5px;width: 90px;">CNSC标题重复</div>
                    <div class="layui-input-block">
                      <select name="cnscTitleRepeated" lay-search>
                        <option value="">请选择</option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2 show-basic-list">
                    <div class="layui-form-label">生成待刊登数据失败</div>
                    <div class="layui-input-block">
                      <select name="generateFailedTag" id="shopee_cnscPublish_generateFailedTag" lay-search>
                        <option value="">请选择</option>
                        <option value="true">有</option>
                        <option value="false">无</option>
                      </select>
                    </div>
                  </div>
                  <div class="layui-col-lg2 layui-col-md2 show-basic-list">
                    <div class="layui-form-label">生成待刊登数据失败原因</div>
                    <div class="layui-input-block">
                        <input class="layui-input" name="generateFailedErrMsg" id="shopee_cnscPublish_generateFailedErrMsg"/>
                    </div>
                  </div>
                  <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-label">商品成本</div>
                    <div class="layui-input-block" style="display: flex;">
                      <select name="allProperties">
                        <option value="false">部分属性</option>
                        <option value="true">全部属性</option>
                      </select>
                      <input type="text" name="costMin" autocomplete="off" class="layui-input"/>
                      <input type="text" name="costMax" autocomplete="off" class="layui-input"/>
                    </div>
                  </div>
                  <div class="layui-col-lg5 layui-col-md5">
                    <div style="margin-left:20px">
                      <button class="layui-btn layui-btn-sm keyHandle" type="button"
                        onClick="shopee_cnscPublish_searchBtn()" id="shopeeCNSCPublish_search">搜索</button>
                      <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset"
                        id="shopeeCNSCPublish_reset">清空
                      </button>
                      <div id="shopeeCNSCPublish_save" class="inline_block pora"></div>
                      <button class="layui-btn layui-btn-sm" type="button" id="pSku_copyBtn" style="margin-left: 30px"
                        onmouseover="showTip(`最多复制1w个`,this)" data-tipId="" onmouseout="removeTip(this)" lay-filter="pSku_copyBtn"
                      >
                        一键复制父SKU
                      </button>
                      <input class="disN" type="text" id="skuCopy">
                    </div>
                  </div>
                </div>
              </form>
              <div id="LAY-publishs-shopee-cnscPublish-div"></div>
            </div>
          </div>
          <div class="layui-card" id="shopeeCNSCPublishCard">

            <div class="layui-card-body">
              <div id="shopee_btn_show_hide" style="position: absolute; right: 10px; z-index: 999">
                <a class="layui-btn layui-btn-normal layui-btn-sm" id="shopeeCNSCPublish_batchDeleteGenerateFailedTag">删除生成失败标签</a>
                <a class="layui-btn layui-btn-normal layui-btn-sm" id="shopeeCNSCPublish_importSearchImage" lay-tips="上传文件内仅需一列，表头为Image Link;支持导入五千张图片">批量以图搜图</a>
                <a class="layui-btn layui-btn-normal layui-btn-sm" id="shopeeCNSCPublish_morePublishBtn">CNSC一对多刊登</a>
                <a class="layui-btn layui-btn-normal layui-btn-sm" id="shopeeCNSCPublish_batchHandleBtn">批量设置想|不想刊登</a>
                <button id="shopeeCNSCPublish_btn_editListingTitle" class="layui-btn layui-btn-sm layui-btn-normal disN"
                  type="button" onclick="batchEditTitle_shopeeCNSCPublish()">批量修改CNSC标题
                </button>
                <button id="shopeeCNSCPublish_btn_delListing" class="layui-btn layui-btn-sm layui-btn-danger disN"
                  type="button" onclick="deletelisting_shopeeCNSCPublish()">删除店铺商品
                </button>
                <button id="shopeeCNSCPublish_btn_exportListing" class="layui-btn layui-btn-sm disN" type="button"
                  onclick="exportListing_shopeeCNSCPublish()">导出店铺商品</button>
                <%--<button id="shopeeCNSCPublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger"
                  type="button" onclick="exportskumapping_shopeeCNSCPublish()">导出SKU映射</button>--%>
                  <button id="shopeeCNSCPublish_btn_genListing2" class="layui-btn layui-btn-sm layui-btn-primary"
                    type="button" onclick="genToListingProd_shopeeCNSCPublish2()">生成店铺商品2.0(API)</button>
                  <div class="layui-input-inline w100 layui-form disN" id="shopeeCNSCPublish_div_selPubStyle">
                    <select id="shopeeCNSCPublish_selPubStyle" lay-filter="shopeeCNSCPublish_selPubStyle_filter">
                      <option value="" disabled selected>刊登</option>
                      <option value="1">立即刊登</option>
                      <option value="2">定时刊登</option>
                    </select>
                  </div>
                  <button id="shopeeCNSCPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                    type="button" onclick="shopeeCNSCPublish__canclePublishOnTiming()">取消定时刊登
                  </button>
                  <button id="shopeeCNSCPublish_btn_pubNow" class="layui-btn layui-btn-sm layui-btn-danger disN"
                    type="button" onclick="shopeeListingCNSCPublish()">立即刊登
                  </button>
                  <button id="shopeeCNSCPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                    type="button" onclick="shopeeCNSCPublish_OnTiming()">定时刊登
                  </button>
                  <button type="button" id="shopeeCNSCPublish_btn_copyListing"
                    class="layui-btn layui-btn-sm layui-btn-primary disN"
                    onclick="shopeeCNSCPublish__copy_listing()">批量复制</button>
                  <button id="shopeeCNSCPublish_btn_rePublish" class="layui-btn layui-btn-sm layui-btn-danger disN"
                    type="button" onclick="shopeeCNSCPublish_rePublish()">重新刊登
                  </button>
              </div>
              <div class="layui-tab" lay-filter="shopeeCNSCPublish_tab">
                <div style="height:42px;line-height:42px;">
                  <ul class="layui-tab-title">
                    <li data-value="-2" class="layui-this" id="shopeeCNSCPublish_totalNum">商品(0)</li>
                    <li data-value="0" id="shopeeCNSCPublish_toListingNum">待刊登(0)</li>
                    <li data-value="3" id="shopeeCNSCPublish_listingNum">刊登中(0)</li>
                    <li data-value="1" id="shopeeCNSCPublish_listingSucNum">刊登成功(0)</li>
                    <li data-value="2" id="shopeeCNSCPublish_listingFailNum">刊登失败(0)</li>
                    <li data-value="4" id="shopeeCNSCPublish_notInSale">已删除</li>
                  </ul>
                </div>
                <div class="layui-tab-content">
                  <div id="shopeeCNSCPublish_table">

                  </div>
                  <div id="shopeeCNSCPublish_pagination"></div>
                  <!--模板文件-->
                  <script type="text/html" id="shopeeCNSCPublish_tpl">
                <div class="shopeeCNSCPublish_table_head">
                    <table class="layui-table">
                        <colgroup class="shopeeTheadCol">
                          <col width="3%"/>
                          <col width="70px" />
                          <col width="10%" />
                          <col width="6%" />
                          <col width="5%" />
                          <col width="120px"/>
                          <col width="120px"/>
                          <col width="80px"/>
                          <col width="60px"/>
                          <col width="60px"/>
                          <col width="100px"/>
                          <col width="80px"/>
                          <col width="80px"/>
                        </colgroup>
                      <thead>
                      <tr>
                        <th>
                          <div class="layui-form">
                            <input type="checkbox" lay-skin="primary" id="shopeeCNSCPublish_AllChecked">
                          </div>
                        </th>
                        <th>缩略图</th>
                        <th>标题/店铺</th>
                        <th>OA新类目&CNSC类目</th>
                          <th>销量</th>
                        <th>父SKU</th>
                        <!-- <th class="cateInfo">类目id</th> -->
                        <!-- <th class="storeSkuInfo">店铺父SKU</th> -->
                        <th>模板子SKU</th>
                        <th class="storeSubSkuInfo">店铺子SKU</th>
                        <th>颜色</th>
                        <th>尺寸</th>
                        <th>重量</th>
                        <th>在售</th>
                        <th>可用/在途/未派</th>
                        <th class="sonListingStatus">状态</th>
                        <th class="failInfo">失败原因</th>
                        <th class="timeClass">时间</th>
                        <th class="creator">创建人</th>
                        <th>操作</th>
                      </tr>
                      </thead>
                    </table>
                  </div>
                  <div class="shopeeCNSCPublish_table_body" style="margin-top: -2px">
                      <table class="layui-table">
                          <colgroup class="shopeeTbodyCol">
                            <col width="3%"/>
                            <col width="70px" />
                            <col width="10%" />
                            <col width="6%" />
                            <col width="5%" />
                            <col width="120px"/>
                            <col width="120px"/>
                            <col width="80px"/>
                            <col width="60px"/>
                            <col width="60px"/>
                            <col width="60px"/>
                            <col width="100px"/>
                            <col width="80px"/>
                            <col width="80px"/>
                          </colgroup>
                          <tbody>
                          {{ each data v i}}
                          <tr>
                            <td>
                              <div class="layui-form">
                                <input type="checkbox" lay-skin="primary" value={{ v.id }} name="id" data-generatefailedtagid="{{ v.generateFailedTagId }}">
                              </div>
                            </td>
                            <td>
                              <%-- {{ if judgeEffective(v.pImg) }}
                              <img width="60" height="60" data-original="{{ v.pImg }}" src="{{ v.pImg }}" class="img_show_hide lazy b1"  data-onerror="layui.admin.img_noFind()">
                              {{ else }}
                                <span>暂无图片</span>
                              {{/if}} --%>
                              <img width="60" height="60" data-original="{{GlobalDomainImgSrc(v.pImg)}}" src="{{ v.pImg }}"  class="img_show_hide lazy b1"  data-onerror="isEffectiveUrl()">
                              <input type="text" name="pSku" value="{{v.pSku}}" class="hidden">
                              <input type="text" name="prodPId" value="{{v.prodPId}}" class="hidden">
                            </td>
                            <td>
                              <strong>店铺标题:</strong><span>{{v.name || ''}}</span><br>
                              <strong>CNSC标题:</strong><span>{{v.globalProductName || ''}}</span><br>
                              <!-- {{if v.listingStatus !='-2'}} -->
                                <strong>店铺:</strong><span>{{v.storeAcct || ''}}</span>
                              <!-- {{/if}} -->
                               {{if v.listingStatus!=-2 && v.tagListStr}}
                               <div>
                                  <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">CNSC标题重复</span>
                               </div>
                               {{/if}}
                            </td>
                            <td>
                             <div lay-tips="OA新类目:{{v.cateOaNameTree}}<br>cnsc类目:{{v.platCategoryNameTree}}">
                              {{v.cateOaName}}{{!v.catOaeName && !v.cateOaId? '':':'}}{{v.cateOaId}}
                              <br>
                              {{v.platCategoryName}}{{!v.platCategoryName && !v.platCategoryId? '':':'}}{{v.platCategoryId}}
                             </div>
                            </td>

                              <td>
                                  7日：{{v.saleNumShopeeSeven }}
                                  <br>
                                  15日：{{v.saleNumShopeeFifteen }}
                                  <br>
                                  30日：{{v.saleNumShopeeThirty }}
                                  <br>
                              </td>
                            <td>
                              <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} data-psku="{{v.pSku}}" data-oanewcate="true" style="color:blue">商品:{{ v.pSku }}</a>
                              <div class="storeSkuInfo">店铺:{{ v.storePSku || ''}}</div>
                                {{if v.prodProhibitMappingList}}
                                    <div class="pointHand showTipElem" onmouseover="shopeeCNSCPublish_showProhibitList(this,{{v.remark}})" onmouseout="removeTip(this)">禁售说明</div>
                                {{/if}}
                                {{if v.onlinePublishStatus||v.existListing}}
                                {{if v.onlinePublishStatus}}
                                <span class="layui-bg-green">已刊登</span>
                                {{/if}}
                                {{if v.existListing}}
                                <span class="layui-bg-orange">已生成</span>
                                {{/if}}
                                <br/>
                                {{/if}}
                                {{if v.mackListingType}}
                                {{if v.mackListingType == 0}}
                                <br> <span class="layui-bg-orange">不想刊登</span>
                                {{/if}}
                                {{/if}}
                                {{if v.listingStatus == 0}}
                                <span class="layui-bg-orange hp-badge ml5 shopeeCNSCPublish_status  shopeeCNSCPublish-unlist">待</span>
                                <span class="layui-hide shopeeCNSCPublish-unlistreason">{{v.listingRespMsg}}</span>
                                {{else if v.listingStatus == 1}}
                                <span class="layui-bg-green hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-listsucc">已</span>
                                {{else if v.listingStatus == 2}}
                                <span class="layui-bg-gray hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-listfail">败</span>
                                {{else if v.listingStatus == 3}}
                                <span class="layui-bg-blue hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-inlist">中</span>
                                    {{if v.storeAcct}}
                                    <br/><span style="color:#FFC0CB;">{{v.storeAcct}}</span>
                                    {{/if }}
                                {{else if v.listingStatus == 4}}
                                <span class="layui-bg-blue hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-inlist">下</span>
                                {{/if}}
                                {{if v.listingStatus==-2 && v.generateFailedTagErrMsg}}
                                <div>
                                   <span class="hp-badge layui-bg-red" lay-tips="{{v.generateFailedTagErrMsg}}" style="width:auto;padding:0 5px!important;">生成待刊登数据失败</span>
                                </div>
                                {{/if}}
                            </td>
                            <!-- <td class="cateInfo">
                                  <span>{{ v.categoryId }}</span>
                            </td> -->
                            <!-- <td class="storeSkuInfo">
                                {{ v.storePSku }}<br/>
                                {{if v.listingStatus == 0}}
                                <span class="layui-bg-orange hp-badge ml5 shopeeCNSCPublish_status  shopeeCNSCPublish-unlist">待</span>
                                <span class="layui-hide shopeeCNSCPublish-unlistreason">{{v.listingRespMsg}}</span>
                                {{else if v.listingStatus == 1}}
                                <span class="layui-bg-green hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-listsucc">已</span>
                                {{else if v.listingStatus == 2}}
                                <span class="layui-bg-gray hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-listfail">败</span>
                                {{else if v.listingStatus == 3}}
                                <span class="layui-bg-blue hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-inlist">中</span>
                                    {{if v.storeAcct}}
                                    <br/><span style="color:#FFC0CB;">{{v.storeAcct}}</span>
                                    {{/if }}
                                {{else if v.listingStatus == 4}}
                                <span class="layui-bg-blue hp-badge ml5 shopeeCNSCPublish_status shopeeCNSCPublish-inlist">下</span>
                                {{/if}}
                            </td> -->
                            <td colspan="7"  style="padding: 10px 0" class="colspan_td">
                              <table style='width: 100%'>
                                <tbody>
                                {{ each v.prodListingSubSkuShopees }}
                                {{if $index<5}}
                                    <tr>
                                {{else}}
                                <tr   class="myj-hide">
                                {{ /if }}
                                  <td width="120">
                                      <span>
                                          {{if $value.sSku}}
                                              {{ $value.sSku }}
                                          {{else}}
                                              <font class="layui-gray">不存在</font>
                                          {{/if}}
                                      </span>
                                      {{if $value.listingStatus == 0}}
                                      <span class="layui-bg-orange hp-badge ml5 shopeeCNSCPublish-unlist">待</span>
                                      <span class="layui-hide shopeeCNSCPublish-unlistreason">{{v.listingRespMsg}}</span>
                                      {{else if $value.listingStatus == 1}}
                                      <span class="layui-bg-green hp-badge ml5">已</span>
                                      {{else if $value.listingStatus == 2}}
                                      <span class="layui-bg-gray hp-badge ml5">败</span>
                                      {{else if $value.listingStatus == 3}}
                                      <span class="layui-bg-blue hp-badge ml5">中</span>
                                      {{else if $value.listingStatus == 4}}
                                      <span class="layui-bg-blue hp-badge ml5">下</span>
                                      {{/if}}
                                  </td>
                                  <td class="storeSubSkuInfo" width="120">{{ $value.storeSSku }}</td>
                                  <td  width="80">{{ $value.color }}</td>
                                  <td width="60">{{ $value.size }}</td>
                                  <td width="60">{{ $value.weight }}</td>
                                  <td width="60">
                                      {{if null==$value.sale}}
                                      {{else if $value.sale}}
                                    <span class="layui-green">在售</span>
                                    {{else}}
                                    <span class="layui-gray">停售</span>
                                    {{/if}}
                                  </td>
                                  <td width="80">
                                    {{ each $value.stockInfoList }}
                                    <div class="mt05">{{$value.warehouseName}}: {{ (($value.currentStock || 0) - ($value.reservationStock || 0))  + '/' + ($value.onwayStock || 0) + '/' + ($value.preReservationStock)}}</div>
                                    {{ /each }}
                                  </td>
                                  <td class="sonListingStatus" width="80">
                                    {{if $value.listingStatus == -1}}
                                    <span class="layui-yellow">待生成</span>
                                    {{else if $value.listingStatus == 0}}
                                    <span class="layui-orange">待刊登</span>
                                    {{else if $value.listingStatus == 1}}
                                    <span class="layui-green">刊登成功</span>
                                    {{else if $value.listingStatus==2 }}
                                    <span class="layui-gray">刊登失败</span>
                                    {{else if $value.listingStatus==3 }}
                                    <span class="layui-skyblue">刊登中</span>
                                      {{else if $value.listingStatus==4 }}
                                      <span class="layui-skyblue">已删除</span>
                                    {{/if}}
                                  </td>
                                </tr>
                                {{ /each }}
                                </tbody>
                              </table>
                              {{  if(v.prodListingSubSkuShopees && v.prodListingSubSkuShopees.length > 5)}}
                              <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuShopees.length}})</a>
                              {{/if}}
                            </td>
                            <td class="failInfo">
                                {{ if v.listingRespMsg  }}
                                <span>{{v.listingRespMsg }}</span>
                                {{else}}
                                {{ each v.prodListingSubSkuShopees }}
                                {{ if $index==1}}
                                <span>{{ $value.listingRespMsg }}</span>
                                {{/if}}
                                {{ /each }}
                                {{/if}}
                            </td>
                            <td class="timeClass">
                                  <div class="auditTime">
                                      {{if v.auditTime}}
                                      <span class="layui-green">审核于:{{v.auditTime| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{/if}}
                                  </div>
                                  <div class="listingTime">
                                      {{if v.listingTime}}
                                      <span class="layui-green">刊登于:{{v.listingTime| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{/if}}
                                  </div>
                                  <div class="listTiming">
                                      {{if v.listTiming}}
                                      <span class="layui-green">定时:{{v.listTiming| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{else}}
                                      <span class="layui-green">刊登中</span>
                                      {{/if}}
                                  </div>
                            </td>
                            <td class="creator">
                              {{v.creator}}
                            </td>
                            <td>
                              <div class="detailInfoBtn"><button  type="button" class="layui-btn layui-btn-xs mb3" onclick="getlistingDetail_shopeeCNSCPublish('{{v.id}}')">详情</button><br></div>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接</button><br>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态</button><br>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="producttpl_getTraslation('{{v.prodPId }}','cht')" dataid="{{v.prodPId }}">刊登翻译</button><br>
                              <div class="shopeeCNSCPublish_publishBtn"><button  type="button" class="layui-btn layui-btn-xs mb3  layui-btn-warm" onclick="shopeeListingCNSCPublish('{{v.id}}')">发布上架</button><br></div>
                              <button  type="button" class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn" dataid="{{v.prodPId}}">开发思路</button><br>
                              <%--设置想刊登/不想刊登--%>
                                {{if v.mackListingType == 0}}
                                <button type="button" class="layui-btn layui-btn-xs mb3 "
                                        onclick="shopeeCNSCProductMackListingType('{{v.pSku}}','{{v.prodPId}}' ,'{{v.mackListingType}}')">取消不想刊登
                                </button><br>
                                {{/if}}
                                {{if !v.mackListingType || v.mackListingType == ''}}
                                <button type="button" class="layui-btn layui-btn-xs mb3 "
                                        onclick="shopeeCNSCProductMackListingType('{{v.pSku}}','{{v.prodPId}}' ,'{{v.mackListingType}}')">设置不想刊登
                                </button><br>
                                {{/if}}
                                {{if v.listingStatus==-2 && v.generateFailedTagErrMsg}}
                                <button type="button" class="layui-btn layui-btn-xs mb3 layui-btn-normal"
                                        onclick="shopeeCNSCDeleteGenerateFailedTag('{{v.generateFailedTagId}}')">删除生成失败标签
                                </button><br>
                                {{/if}}
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

    <!--待发布详情弹框-->
    <script type="text/html" id="shopeePulish_listDetailTpl">
  <div class="layui-fluid">
    <div class="layui-row">
      <div class="layui-col-lg12 layui-col-md12">
        <form action="" class="layui-form" id="shopeeCNSCPublish_editDetailForm">
            <input hidden name="listingId" value="{{d.prodListingShopee.id}}">
            <input hidden name="storeAcctId" value="{{d.prodListingShopee.storeAcctId}}">
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">店铺父SKU:</label>
              <div class="layui-input-block">
                <input name="storePSku" data-sku="{{d.prodPInfo.pSku||''}}" value="{{d.prodListingShopee.storePSku}}" type="text" class="layui-input">
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">店铺刊登标题:</label>
              <div class="layui-input-block">
                <input name="name"  value="{{d.prodListingShopee.name||''}}" type="text" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">
                <div>CNSC刊登标题:</div>
                {{# if(d.prodListingShopee.tagListStr){ }}
                  <div class="tag_repeat" style="height: 20px;"><span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">
                    CNSC标题重复
                    <i class="xm-iconfont icon icon-close" onclick="shopeeCNSCPublish_editDetailForm_delTag(this)"></i>
                  </span></div>
                {{#  } }}
              </label>
              <div class="layui-input-block">
                <input name="globalProductName"  value="{{d.prodListingShopee.globalProductName||''}}" id="prohibitInputId"  data-prodpid="{{d.prodListingShopee.prodPId}}"  data-tagliststr="{{d.prodListingShopee.tagListStr || ''}}" type="text" class="layui-input ifFocusInput">
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">店铺产品描述:</label>
                <div class="layui-input-block">
                    <!-- <textarea name="description" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingShopee.description}}</textarea> -->
                    <div id="shopeeCNSCPublish_detail_Desc"></div>
                </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label w90 p09">CNSC产品描述:</label>
              <div class="layui-input-block">
                <div id="shopeeCNSCPublish_detail_cnscDesc"></div>
                  <!-- <textarea name="globalProductDescription" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingShopee.globalProductDescription || ''}}</textarea> -->
              </div>
          </div>
          </div>
          <div calss="layui-card">
              <label class="layui-form-label">类目选择:</label>
              <div class="layui-input-block">
                  <button id="shopeeCNSCPublish_cateIdBtn" type="button"
                          class="layui-btn layui-btn-normal layui-btn-sm">选择shopee分类
                  </button>
                  <button id="shopeeCNSCPublish_cateRecomm" class="layui-btn layui-btn-primary layui-btn-sm"
                          type="button">
                      <i class="layui-icon layui-icon-search"></i>
                  </button>
                  <h4 id="shopeeCNSCPublish_cateText" style="display: inline;"></h4>
              </div>
              <input id="shopeeCNSCPublish_cateId" name="categoryId" value="{{d.prodListingShopee.categoryId}}" type="hidden">
            </div>
          <!--<div calss="layui-card">-->
                <!--<label class="layui-form-label">类目属性:</label>-->
                <!--<div class="layui-input-block">-->
                    <!--<input name="atributes"  value="{{d.prodListingShopee.attributes}}" type="text" class="layui-input" disabled>-->
                <!--</div>-->
          <!--</div>-->
          <div calss="layui-card">
              <label class="layui-form-label">类目属性:</label>
                  <div id="shopeeCNSCPublish_detail_atributes" style="border:3px solid #000">
              </div>
          </div>



          <div class="layui-card">
            <div class="layui-card-header">图片</div>

            <div class="layui-card-body">
              <div id="img_content">
                <table>
                  <tbody>
                  <td style="vertical-align:top;">
                    <div id="shopeeCNSCPublish_mainImg">
                      <div class="ImgDivIn" style="height:300px;width: 280px">
                        <input type="hidden" name="mainImg" value="{{d.mainImage}}">
                        <img style="height:260px;width: 260px" src="{{GlobalDomainImgSrc(d.mainImage)}}" >
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="waterFirstPic_shopeeCNSCPublish()">首图水印</button>
                      <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="addExtPic_shopeeCNSCPublish()">网络图片</button>
                      <button style="float:left; margin-right: 10px;" type="button" class="layui-btn layui-btn-sm" onclick="addTplPic_shopeeCNSCPublish()">模板图片</button>
                      <div style="float:left" class="shopeeCNSCPublish_extPic_edit_local"></div>
                    </div>
                    <div class="pull-left" id="img_num">
                      <div class="p0">
                        <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                          <span class="layui-bg-red">说明！</span>
                          <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                          <span class="fColor2 mLeft10">「辅图最多选用<span id="maxImgNum" class="fRed">8</span>张，已经选用了<span id="shopeeCNSCPublish_curImgNum" class="fGreen">{{d.extImages.length}}</span>张辅图」</span>
                        </div>
                      </div>
                    </div>
                    <div id="">
                      <ul id="shopeeCNSCPublish_extImg">
                        {{#  layui.each(d.extImages, function(index, prodImage){ }}
                        <li draggable="false" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                          <div class="ImgDivOut">
                            <div class="ImgDivIn" style="width:150px;height:150px;">
                              <input type="hidden" name="extImg" value="{{prodImage}}">
                              <img width="150" height="150" src="{{GlobalDomainImgSrc(prodImage)}}" >
                            </div>
                            <div class="imgDivDown" style="width:150px">
                              <a onclick="setMainImg_shopeeCNSCPublish(this);" href="javascript:void(0);" style="float:left;
      color: #73a1bf;">设为主图</a>
                              <a onclick="delImg_shopeeCNSCPublish(this);" href="javascript:void(0);" style="float:right;
      color: #73a1bf;">移除</a>
                            </div>
                          </div>

                        </li>
                        {{#  }); }}
                      </ul>
                    </div>
                  </td>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="layui-card">
              <div class="layui-card-header">
                  <span>SKU信息</span>
              </div>
              <div class="layui-card-body" style="display:flex">

                  <button onclick="shopeeCNSCPublish_UpdateSku()" type="button" class="layui-btn layui-btn-sm">
                      使用商品SKU
                  </button>
                  <label class="layui-form-label">sku后缀批量</label>
                  <div style="width:80px">
                      <select name="sufixSetType" id="shopeeCNSCPublish_sufixSetType"
                              lay-filter="shopeeCNSCPublish_sufixSetType">
                          <option value="1">添加</option>
                          <option value="2">替换</option>
                          <option value="3">删除</option>
                      </select>
                  </div>
                  <input style="width:120px" type="text" class="layui-input" name="originalsku">
                  <div class="shopeeCNSCPublish_replacehide disN">
                      <label class="layui-form-label">替换为</label>
                      <input type="text" class="layui-input" name="newsku" style="width:120px">
                  </div>
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal"
                          onclick="shopeeCNSCPublish_batchSetSkuSufix(this)">批量设置后缀
                  </button>
                      <button type="button" style="width:120px"
                              class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-normal disN"
                              onclick="addShopeeSubListing()">
                          添加一行
                      </button>
                      <button type="button"
                              class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-warm disN"
                              onclick="shopeeListingCNSCPublish_updatePrice()">
                          更新价格
                      </button>
                      <div class="disflex ml10" id="shopeeCNSCPublish_batchSku">
                        <input style="width:130px" type="text" name="oasize" class="layui-input addShopeeSubListing"
                              placeholder="批量修改OA_Size">
                        <input style="width:130px" type="text" name="oacolor" class="layui-input addShopeeSubListing"
                        placeholder="批量修改OA_Color">
                        <input style="width:130px" type="text" name="oastyle" class="layui-input addShopeeSubListing"
                        placeholder="批量修改OA_Style">
                        <button type="button"
                                class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-normal disN"
                                onclick="shopeeCNSCPublishFailColorStyleSize(this)">
                            应用
                      </button>
                      </div>
              </div>
          </div>
            <div class="layui-card-body">
              <table class="layui-table">
                <thead>
                <tr>
                  <th hidden>id</th>
                  <th>图片</th>
                  <th>店铺SKU</th>
                  <th>OA_Size</th>
                  <th>OA_Color</th>
                  <th>OA_Style</th>
                  <th>刊登价格(当地币种)</th>
                  <th>全球商品刊登价格(人民币)</th>
                  <th>刊登数量</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody id="shopeeCNSCPublish_SubSkuInfo">
                {{#  layui.each(d.subSkuShopeeDtos, function(index, subSkuShopeeDto){ }}
                <tr>
                  <td hidden>{{subSkuShopeeDto.id}}</td>
                  <td>
                      <img width="60" height="60" data-original="{{GlobalDomainImgSrc(subSkuShopeeDto.subImgUrl)}}"  src="{{GlobalDomainImgSrc(subSkuShopeeDto.subImgUrl)}}"  class="shopeeCNSCPublish_subImgUrl img_show_hide lazy b1">
                  </td>
                  <td class="shopeeStoreSSku"><input name="storeSSku" type="text" data-ssku="{{subSkuShopeeDto.sSku||''}}" class="layui-input" value="{{subSkuShopeeDto.storeSSku}}"></td>
                  <td><input type='text' class="layui-input shopeeCNSCPublish_subSize" value='{{subSkuShopeeDto.oaSize}}'></td>
                  <td><input type='text' class="layui-input shopeeCNSCPublish_subColor" value="{{subSkuShopeeDto.oaColor || ''}}"></td>
                  <td><input type='text' class="layui-input shopeeCNSCPublish_subStyle" value="{{subSkuShopeeDto.oaStyle || ''}}"></td>
                  <td>
                      <input type='number' class="layui-input" value='{{subSkuShopeeDto.price}}'>
                  </td>
                  <td>
                    <input type='number' class="layui-input" value='{{subSkuShopeeDto.globalProductVariationPrice}}'>
                  </td>
                  <td><input type='number' class="layui-input" value='{{subSkuShopeeDto.stock}}'></td>
                    <td>
                       {{# if(subSkuShopeeDto.prodTempId){ }}
                        <button type="button" class="layui-btn layui-btn-sm mt05" onclick="tpl_listReferPrice('{{subSkuShopeeDto.prodTempId}}')" >估价</button>
                        {{#  } }}
                        {{# if(subSkuShopeeDto.listingStatus==1 || subSkuShopeeDto.listingStatus==3||d.subSkuShopeeDtos.length==1){ }}
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled  mt05" >移除</button>
                        {{# }else{ }}
                        <button type="button" class="layui-btn layui-btn-sm  mt05" onclick="removeShopeeSubListing(this)">移除</button>
                        <button type="button" class="layui-btn layui-btn-sm  mt05" onclick="shopeeCNSCPublish_editVarPic(this)">修改图片</button>
                        <span class="layui-btn layui-btn-sm mt05" onclick="shopeeCNSCPublish_deleteVarPic(this)">移除图片</button>
                        {{# } }}
                    </td>
                </tr>
                {{#  }); }}
                </tbody>
              </table>
                  </div>
        </form>
      </div>
    </div>
</div>
</script>

    <script>
      // //多选渲染函数
      // function select_multi(name, arr) {
      //     var formSelects = layui.formSelects
      //     formSelects.render({
      //         name: name, //xm-select的值
      //         type: 2, //select样式为checkbox
      //         data: {
      //             arr: arr,
      //             name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
      //             val: 'value'
      //         }
      //     })
      // }

      layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        //属性多选
        formSelects.data('selectAttr_shopee_cnscPublish', 'local',
          {
            arr: [
              <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                {name: '${logisAttrEnum.getName()}',value: '${logisAttrEnum.getName()}'},
                {name: '不含 ${logisAttrEnum.getName()}',value: 'no_${logisAttrEnum.getName()}'},
              </c:forEach>
            ]
          }
        )
        //商品归属人多选
        formSelects.data('selectMan_shopee_cnscPublish', 'local',
          {
            arr: [
              <c:forEach items="${bizzOwners}" var="bizzOwner">
                {name: '${bizzOwner.userName}', value: '${bizzOwner.id}'},
              </c:forEach>
            ]
          }
        )
      })
    </script>

    <!--定时刊登-->
    <script type="text/html" id="shopeePulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_listTimingForm">
            <div class="layui-form-item">
                <label class="layui-form-label">定时刊登开始时间:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="shopeePulish_listTiming" name="listTiming" autocomplete="off" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">listing刊登间隔(分):</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="listInterval" autocomplete="off">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">刊登时间段:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="shopeePulish_canPublish_listTiming" name="canPublishListTiming" autocomplete="off" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">自动分配促销:</label>
                <input type="checkbox" lay-filter="shopeePulish_autoProm_filter"  name="autoProm" lay-skin="switch" lay-text="开启|关闭">
            </div>
            <div class="layui-form-item shopeePulish_show_promotionIdList disN">
                <label class="layui-form-label">促销活动</label>
                <div class="layui-input-block">
                    <select name="promotionIdList" xm-select="stortAcctPromotionList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                    </select>
                </div>
            </div>

            <div class="layui-form-item shopeePulish_show_promotionId">
                    <label class="layui-form-label">促销活动</label>
                    <div class="layui-input-block">
                        <select lay-search  name="stortAcctPromotion">
                            <option value="">不促销</option>
                        </select>
                    </div>
            </div>
        </form>
    </div>
</script>

    <script type="text/html" id="shopeePulish_publishNowTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_publishNowForm">
            <div class="layui-form-item">
                    <label class="layui-form-label">促销活动</label>
                    <div class="layui-input-block">
                        <select lay-search  name="stortAcctPromotion">
                            <option value="">不促销</option>
                        </select>
                    </div>
            </div>
        </form>
    </div>
</script>



    <!-- 复制listing-->
    <script type="text/html" id="shopeePulish_copyListingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <table class="layui-table">
                <tr>
                    <td>本次生成模板父SKU</td>
                    <td>店铺</td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <label id="shopeeCNSCPublish_skusInfo"></label>
                        </div>
                    </td>
                    <td>
                        <div class="layui-input-block">
                            <select xm-select="copyStore_shopeeCNSCPublish" name="copyStoreIds" xm-select-search
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

    <!--刊登前水印选择-->
    <script type="text/html" id="shopeePulish_selWaterTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_selWaterForm">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="waterImageId" lay-search="" >
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="waterFontId" lay-search="" >
                </select>
            </div>
        </div>
    </form>
</script>


    <!--商品--生成店铺商品2.0（api）弹框-->
    <script type="text/html" id="shopeePulish_selWaterTp2">
    <form class="layui-form" id="shopeePulish_selWaterForm2" style="padding:20px;">
        <!-- <p style="padding: 10px;">注意：所选的数据在生成数据时</p>
        <p style="padding: 10px;"> 1.自动过滤具体店铺：未生成，未刊登</p> -->
        <div>过滤条件</div>
        <div class="mt10"><input type="checkbox" name="filterCondition" value="1" title="1.下列店铺中若存在已生成或已刊登的商品与已选商品相同，已选商品将不刊登；" lay-skin="primary" checked disabled></div>
        <div class="mt10"><input type="checkbox" name="filterCondition" value="2" title="2.下列店铺中若存在已生成但未刊登商品中与已选商品的子sku相同，已选商品将不刊登" lay-skin="primary" checked></div>
        <div class="mt10 long_check_box_title"><input type="checkbox" value="3" name="filterCondition" title="3.下列店铺中若存在已刊登商品中与已选商品子sku相同，则将校验已刊登商品30天及历史销量，若销量均为0则下架原商品，刊登已选商品；若销量不全为0，则已选商品不刊登。" lay-skin="primary" checked></div>
        <div>请输入刊登店铺名:</div>
        <textarea class="layui-textarea mt10" name="shopName" placeholder="多个店铺，逗号分隔"></textarea>
    </form>
</script>


    <script type="text/html" id="shopeeCNSCPublish_cateSearchTpl">
    <div class="p10">
        <form id="shopeeCNSCPublish_cateSearchForm" class="layui-form">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                    <label class="layui-form-label">关键字</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required="" <%--lay-verify="required"--%> placeholder="请输入标题"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="shopeeCNSCPublish_cateSearchBtn">搜索</button>
                </div>
            </div>
        </form>
        <table id="shopeeCNSCPublish_cateSearchTable"></table>
    </div>
</script>

    <!--刊登商品设置选择-->
    <script type="text/html" id="shopee_cnscPublish_Product_Mack_Listing_Type">
    <form class="layui-form" action="" lay-filter="component-form-group"
          id="shopee_cnscPublish_Product_Mack_Listing_Type_Form">
        <div style="text-align:center;padding:30px 0;">
<%--            <label class="layui-form-label" id="shopee_cnscPublish_product_mack_listing_show_txt"></label>--%>
            <span id="shopee_cnscPublish_product_mack_listing_show_txt"></span>
            <input id="shopee_cnscPulish_p_sku_lising_type_text" type="hidden" name="pSku" class="layui-input" readonly>
            <input id="shopee_cnscPulish_p_id_hidden_lising_type_text" type="hidden" name="prodId" class="layui-input" >
        </div>
    </form>
</script>

    <script type="text/html" id="shopee_cnscPublish_prohibit_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopee_cnscPublish_prohibit_Table" lay-filter="shopee_cnscPublish_prohibit_Table"></table>
        </div>
    </div>
</script>

<!-- CNSC一对多刊登 -->
<script type="text/html" id="shopee_cnscPublish_morePublish_tpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shopee_cnscPublish_morePublish_form">
        <div class="layui-form-item">
          <label class="layui-form-label">禁售是否刊登</label>
          <div class="layui-input-block">
            <input type="radio" name="allowProhibit" value="1" title="是">
            <input type="radio" name="allowProhibit" value="0" title="否" checked>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">是否允许重复刊登</label>
          <div class="layui-input-block">
            <input type="radio" name="allowRepeat" value="1" title="是" checked>
            <input type="radio" name="allowRepeat" value="0" title="否" >
          </div>
        </div>
        <div class="layui-form-item">
          <a class="layui-btn layui-btn-normal layui-btn-sm" target="_blank" href="/lms/static/templet/shopeePublishItemToOtherShopsTemplate.xlsx">下载模板</a>
          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="shopee_cnscPublish_morePublish_export">
            <input type="file" id="shopee_cnscPublish_morePublish_exportBtn"  accept=".xls,.xlsx,"
            onchange="shopee_cnscPublish_morePublish_exportFile(this,event)">
            导入EXCEL
          </button>
        </div>
        <div class="mt10">提示：操作结果可至OA-配置-定时报表-动态查询查看，报表名称：CNSC一对多刊登日志。</div>
      </form>
    </div>
  </div>
</script>

<!-- 生成店铺商品报错提示 Others分类-->
<script type="text/html" id="shopeePulish_generateListTpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <table id="shopeePulish_generateListTpl_table" class="layui-table"></table>
    </div>
  </div>
</script>

<!-- 批量修改CNSC标题 -->
<script type="text/html" id="shopeePulish_batchEditTitltTpl">

  <div class="layui-col-md12">
    <div class="layui-form-item mt10 ml10">
      <div class="layui-col-lg5 layui-col-md5">
        <label
          class="layui-form-label"
          style="width: 40px; padding: 5px 10px 5px 5px"
          >原标题</label
        >
        <div class="layui-input-block" style="margin-left: 55px">
          <textarea
            class="layui-textarea form-textarea"
            name="shopeePulish_batchEditTitltTpl_old_title"
            id="shopeePulish_batchEditTitltTpl_old_title"
            placeholder="请输入需要替换词，为空将全量调整标题"
          ></textarea>
        </div>
      </div>
      <div class="layui-col-lg5 layui-col-md5">
        <label class="layui-form-label">替换/修改为</label>
        <div class="layui-input-block">
          <textarea
            class="layui-textarea form-textarea"
            name="shopeePulish_batchEditTitltTpl_new_title"
            id="shopeePulish_batchEditTitltTpl_new_title"
            placeholder="请输入，可用下划线代替原标题在其前后增加，例如：_apple"
          ></textarea>
        </div>
      </div>
      <div class="layui-col-lg2 layui-col-md2">
        <button
          class="layui-btn layui-btn-normal layui-btn-sm ml10"
          id="shopeePulish_batchEditTitltTpl_apply_btn"
        >
          一键应用
        </button>
      </div>
    </div>
    <div class="layui-card">
      <div class="disFCenter" style="height: 42px;padding:0 15px;color:#333">
        <div>
          数量(<span id="tolnum_span_shopee_modifyTitle"></span>)
        </div>
        <div class="disflex layui-form" style="align-items: center;">
          <input type="checkbox" name="removeTag" id="shopeePulish_batchEditTitltTpl_removeTag_btn" title="移除CNSC标题重复标签" lay-skin="primary" checked>
          <button
            class="layui-btn layui-btn-normal layui-btn-sm"
            id="shopeePulish_batchEditTitltTpl_save_btn"
          >
            保存
          </button>
        </div>
      </div>
      <div class="layui-card-body">
        <!-- 表格的数据渲染 -->
        <table
          class="layui-table"
          id="shopeePulish_batchEditTitltTpl_Table"
          lay-filter="shopeePulish_batchEditTitltTpl_Table"
        ></table>
      </div>
    </div>
  </div>
</script>

    <script src="${ctx}/static/js/publishs/shopee/cnscPublish.js"></script>
    <script src="${ctx}/static/jquery-ui.min.js"></script>
    <script src="${ctx}/static/tagsinput/tagsinput.js"></script>

    <script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
    <%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
      <script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
      <script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>