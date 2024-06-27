<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/7/30
  Time: 15:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Amazon新模板</title>
</head>
<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
<style>
    .descItem {
      margin-top: 10px;
      margin-left: 20px;
    }
    .label_select {
        padding: 0 !important;
        margin-left: 5px;
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

    .w_80 {
        width: 80% !important;
        display: inline-block;
    }

    .storeTemplateSearchDom {
        display: none;
    }

    .imgBox_prodTpl {
        width: 177px;
        border: 1px solid rgb(204, 204, 204);
        overflow: hidden;
    }

    .detailImg_prodtpl {
        width: 150px;
        height: 150px;
        border: 1px solid #f2f2f2
    }

    [data-id=assistImgContains1] .detailImg_prodtpl {
        width: 150px;
        height: 200px;
        border: 1px solid #f2f2f2
    }

    .redStar:before {
        content: "*";
        color: red;
        font-size: 20px;
        position: relative;
        top: 7px;
        right: 10px;
    }
    .ImgDivOut .layui-form-radio,
    .swatch .layui-form-radio {
        margin: 0;
    }

    .layui-table-box, .layui-table-view {
        overflow: visible;
    }

    .layui-table-body {
        overflow: initial;
    }
    #amazonTempGenerateFromGPTLayTplId .layui-form-label {
      width: 100px;
      padding: 0 10px;
    }
    #amazonTempGenerateFromGPTPromptId .layui-form-label {
      width: 100px;
    }
    #amazonTempGenerateFromGPTLayTplId .layui-form-label.first-label {
      padding: 9px 10px;
    }
    #amazonTempGenerateFromGPTLayTplId .layui-input-block,
    #amazonTempGenerateFromGPTPromptId .layui-input-block {
      margin-left: 130px;
    }
</style>
<body>
<div class="layui-fluid" id="storeTemplate">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="storeTemplateForm">
                        <div class="layui-form-item">
                          <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-block">
                              <select id="amazonTemplate_group_sel" name="orgId"
                                      lay-filter="orgs_hp_template_pb" class="orgs_hp_custom" data-roleList="amazon专员" lay-search>
                                <option value=""></option>
                              </select>
                            </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="amazonTemplateBizzOwnerIdList" id="amazonTemplateBizzOwnerIdList" xm-select="amazonTemplateBizzOwnerIdList" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">责任人</label>
                              <div class="layui-input-block">
                                  <select name="responsor" id="storeTemplateResponsor" lay-search>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 storeTemplateSearchDom">
                              <label class="layui-form-label">创建人</label>
                              <div class="layui-input-block">
                                  <select name="tplCreatorId" id="storeTemplateTplCreatorId" lay-search>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">开发类型</label>
                              <div class="layui-input-block">
                                  <select name="devTypeList" id="storeTemplateDevTypeList" xm-select="devTypeList" xm-select-search
                                          xm-select-search-type="dl" xm-select-skin="normal">
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <div class="layui-form-label label_select">
                                  <select name="searchSKUType" lay-filter="searchSKUType" lay-search>
                                      <option value="pSku">父SKU</option>
                                      <option value="sSku">子SKU</option>
                                  </select>
                              </div>
                              <div class="layui-input-block">
                                  <input class="layui-input" name="searchSKUValue" placeholder="多个英文逗号分隔">
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 BasicsTemp">
                              <label class="layui-form-label">成本</label>
                              <div class="layui-input-block">
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <input type="number" class="layui-input" placeholder="￥" autocomplete="off" name="priceMin">
                                  </div>
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <input type="number" class="layui-input" placeholder="￥" autocomplete="off" name="priceMax">
                                  </div>
                              </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                              <label class="layui-form-label">OA类目</label>
                              <div class="layui-input-block">
                                  <input type="hidden" name="cateId">
                                  <input type="text" class="w_80 layui-input" name="cateName"
                                          placeholder="选择分类" readonly>
                                  <i class="layui-icon layui-icon-delete" id="storeTemplateClearCate"
                                      style="cursor:pointer" title="删除产品类目"></i>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 storeTemplateSearchDom">
                              <label class="layui-form-label">亚马逊类目</label>
                              <div class="layui-input-block">
                                  <a class="layui-btn layui-btn-xs" id="storeTemplate_creatListing">选择分类</a>
                                  <i class="layui-icon layui-icon-delete" id="storeTemplateClearAmazonCate"
                                     style="cursor:pointer" title="删除产品类目"></i>
                                  <input type="hidden" id="storeTemplate_cateItemId"
                                         name="categoryId" value="">
                              </div>
                            </div>
                            
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">站点</label>
                              <div class="layui-input-block">
                                  <%--<select name="salesSite" id="storeTemplate_site_sel" lay-search--%>
                                  <%--lay-filter="storeTemplate_site_sel" xm-select="storeTemplate_site_sel"--%>
                                  <%--xm-select-search xm-select-search-type="dl"--%>
                                  <%--xm-select-skin="normal"></select>--%>
                                  <select name="salesSite" id="storeTemplateSalesSite" lay-search></select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <div class="layui-form-label label_select">
                                  <select name="searchType" lay-filter="searchType" lay-search>
                                      <option value="cnTitle">中文名</option>
                                      <option value="enTitle">英文名</option>
                                  </select>
                              </div>
                              <div class="layui-input-block">
                                  <input class="layui-input" name="searchValue">
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label label_select">
                                    <select name="logisAttrRelation" lay-filter="logisAttrRelation" lay-search>
                                        <option value="and">物流属性(与)</option>
                                        <option value="or">物流属性(或)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="logisAttr" id="storeTemplateLogisAttr" xm-select="logisAttr" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 BasicsTemp">
                              <label class="layui-form-label">重量(g)</label>
                              <div class="layui-input-block">
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <input type="number" class="layui-input" placeholder="g" autocomplete="off" name="weightMin">
                                  </div>
                                  <div class="layui-col-md6 layui-col-lg6">
                                      <input type="number" class="layui-input" placeholder="g" autocomplete="off" name="weightMax">
                                  </div>
                              </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSaleStr" id="storeTemplateisSaleStr" xm-select="isSaleStr" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <%--<option value="">全部</option>--%>
                                        <%--<option value="1" selected>在售</option>--%>
                                        <%--<option value="0">停售</option>--%>
                                            <option value="0">停售</option>
                                            <option value="1">部分在售</option>
                                            <option value="2">在售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">禁售状态</label>
                              <div class="layui-input-block">
                                  <select name="sellable" lay-filter="sellable" lay-search>
                                      <option value="null">全部</option>
                                      <option value="true" selected>不禁售</option>
                                      <option value="false">禁售</option>
                                  </select>
                              </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">图片状态</label>
                              <div class="layui-input-block">
                                  <%--<select name="imgStatus" xm-select="imgStatus" xm-select-search-type="dl"--%>
                                          <%--xm-select-skin="normal">--%>
                                      <%--<option value="">全部</option>--%>
                                      <%--<option value="1" selected>有图</option>--%>
                                      <%--<option value="2" selected>部分</option>--%>
                                      <%--<option value="3">无图</option>--%>
                                  <%--</select>--%>
                                  <select name="imgStatus" lay-search>
                                      <option value="0">无图</option>
                                      <option value="1">部分有图</option>
                                      <option value="2" selected>全有图</option>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">侵权状态</label>
                              <div class="layui-input-block">
                                  <%--<select name="tortPlat" xm-select="tortPlat" xm-select-search--%>
                                          <%--xm-select-search-type="dl" xm-select-skin="normal">--%>
                                      <%--<option value="0">wish侵权</option>--%>
                                      <%--<option value="1">wish不侵权</option>--%ebay/publish>
                                      <%--<option value="2">ebay侵权</option>--%>
                                      <%--<option value="3">ebay不侵权</option>--%>
                                      <%--<option value="4">smt侵权</option>--%>
                                      <%--<option value="5">smt不侵权</option>--%>
                                      <%--<option value="6">joom侵权</option>--%>
                                      <%--<option value="7">joom不侵权</option>--%>
                                      <%--<option value="8">amazon侵权</option>--%>
                                      <%--<option value="9" selected>amazon不侵权</option>--%>
                                      <%--<option value="10">shopee侵权</option>--%>
                                      <%--<option value="11">shopee不侵权</option>--%>
                                      <%--<option value="12">lazada侵权</option>--%>
                                      <%--<option value="13">lazada不侵权</option>--%>
                                  <%--</select>--%>
                                  <select name="tortPlat" lay-search>
                                      <option value="CURRENT_PLAT">amazon不侵权</option>
                                      <option value="ANY_PLAT" selected>所有平台都不侵权</option>
                                      <option value="ALL">全部</option>
                                  </select>
                              </div>
                            </div> 
                            
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">亚马逊模板</label>
                              <div class="layui-input-block">
                                  <select name="haveAmazonModel" lay-filter="haveAmazonModel" lay-search>
                                      <option value="">全部</option>
                                      <option value="true">有</option>
                                      <option value="false">无</option>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label label_select">
                                    <select name="timeType" lay-filter="timeType" lay-search>
                                        <option value="createTime">创建时间</option>
                                        <option value="auditTime">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input class="layui-input" readonly placeholder="请选择时间" id="storeTemplate_createTime"
                                           name="createTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByType" lay-filter="orderByType" lay-search>
                                        <option></option>
                                        <option value="1">创建时间倒序</option>
                                        <option value="2">创建时间正序</option>
                                        <option value="3">审核时间倒序</option>
                                        <option value="4">审核时间正序</option>
                                        <option value="5">30天销量倒序</option>
                                        <option value="6">30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg8 layui-col-md8 storeTemplateSearchDom">
                              <div class="layui-input-block">
                                  <pre id="storeTemplateAmazonListingdiv3" name="fullCateName"></pre>
                                  <%--<div></div>--%>
                              </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1 fr">
                                <a class="layui-btn layui-btn-sm" id="storeTemplateSearch">搜索</a>
                                <a class="layui-btn layui-btn-sm ml10" id="storeTemplateReset">清空</a>
                            </div>
                            <br>
                            
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="storeTemplateCard">
                <div class="layui-card-body">
                    <div class="dis_flex row_module_js">
                        <div class="layui-tab" lay-filter="storeTemplateTabFilter" id="storeTemplateTabFilter">
                            <ul class="layui-tab-title">
                                <li status="0" class="layui-this">基础模板(<span id="storeTemplateBaseTab"></span>)</li>
                                <li status="1">亚马逊模板(<span id="storeTemplateAmazonTab"></span>)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="layui-tab-content p10">
                        <table class="layui-table" style="margin: 0px;" id="storeTemplateAmazonTable"
                               lay-filter="storeTemplateAmazonTable"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<script type="text/javascript" src="${ctx}/static/jquery-ui.min.js"></script>

<script type="text/javascript" src="${ctx}/static/util/we.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>


<%--这里主要是为了使用刊登状态列--%>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>

<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/js/work/amazon/storeTemplate.js"></script>
<script src="${ctx}/static/util/downloadImage.js"></script>

<%-- 引入富文本 --%>
<script src="${ctx}/static/simditor/module.js"></script>
<script src="${ctx}/static/simditor/hotkeys.js"></script>
<script src="${ctx}/static/simditor/simditor.js"></script>
<script type="text/html" id="storeTemplateTableColsImg">
    <div>
        <img width="60" height="60" data-original="{{d.pImg}}" class="img_show_hide b1 lazy"
             data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<!--模板table -- 操作 -->
<script type="text/html" id="storeTemplateOption">
    <a class="layui-btn layui-btn-xs" id="prodDetail_smtListing" data-id="{{d.id}}" prodpsku="{{d.pSku}}" type="amazon">商品详情</a><br>
    <button class="layui-btn layui-btn-xs" lay-event="modify">新建模板</button>
</script>

<!--模板table -- 操作 -->
<script type="text/html" id="storeTemplateAmazonOption">
    <button class="layui-btn layui-btn-xs" lay-event="amazonCopy">复制</button><br>
    <button class="layui-btn layui-btn-xs" lay-event="amazonModify">修改</button><br>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="amazonDelete">删除</button><br>
    <%--<button class="layui-btn layui-btn-xs">复制</button>--%>
</script>

<%--子模板templet 表格--%>
<script type="text/html" id="storeTemplate_aep_producttpl">
    {{# if (d.varients) { }}
    <table id="aep_intable_tpl" style="text-align:center;width: 100%">
        <tbody>
        {{# for(var i =0; i < d.varients.length; ++i) { var $value = d.varients[i] }}
        {{# if (i<7) { }}
        <tr>
            {{# } else {}}
        <tr class="myj-hide">
            {{# } }}
            <td width='30%' style="text-align: left;padding-left: 10px;">{{ $value.sSku || '' }}</td>
            <td width='20%'>{{ $value.color || '' }}</td>
            <td width='20%'>{{ $value.size || '' }}</td>
            <td width='20%'>{{ $value.style || '' }}</td>
            <td width='10%'>{{# if ($value.haveAmazonModel){}}
                有
                {{# } else{ }}
                无
                {{# } }}
            </td>
        </tr>
        {{# } }}
        </tbody>
    </table>
    {{#  if(d.varients.length > 7) { }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow"
       style="float:right;"><span>+ 展开</span>({{d.varients.length}})</a>
    {{# } }}
    {{# } }}
</script>
<%--亚马逊模板子sku--%>
<script type="text/html" id="storeTemplateThemeTableOaAttr">
    <select lay-filter="storeTemplateThemeTableOaAttrSelect" name="storeTemplateThemeTableOaAttrSelect" lay-search>
        {{# layui.each(d.oaAttr||[], function(index, item){ }}
        <option value={{item}}>{{item}}</option>
        {{# }); }}
    </select>
    <%--</form>--%>
</script>


<%--亚马逊模板子sku--%>
<script type="text/html" id="storeTemplate_ssku">
    <div>
        <table class="layui-table colspantable" style="">
            {{# layui.each(d.amazonPublishModelSDtoList||[], function(index, item){ }} {{# if(index
            <3){ }}
            <tr style="border-bottom: 1px solid #e6e6e6 !important;">
                <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.prodSSku || '' }}</td>
                <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                    {{item.color || ''}}
                </td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size || '' }}</td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                    {{transBoolentoStr(item.sale||'')}}
                </td>
            </tr>
            {{# }else{ }}
            <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expand hidden">
                <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.prodSSku || ''}}</td>
                <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                    {{item.color || ''}}
                </td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size || '' }}</td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                    {{transBoolentoStr(item.isSale||'')}}
                </td>
            </tr>
            {{# } }} {{# }); }}
        </table>
        {{# if((d.amazonPublishModelSDtoList||[]).length>3){ }}
        <div class="expandall" data-tag="1" onclick="expandAll(this);">展开所有</div>
        {{# } }}
    </div>
</script>

<!--模板table -- 刊登状态 -->
<script type="text/html" id="storetmplate_aep_storeNumTpl">
    <span style="color:#999;">刊登数:</span>
    <a href="javascrpt:;" style="color:blue" onclick="producttpl_getListingStatus('{{d.id}}','aliexpress')">{{
        d.storeNum}}</a>
    <i title="打开Amazon商品" class="layui-icon" style="color: #009688;cursor: pointer;"
       lay-event="aep_openItem">&#xe615;</i>
</script>


<!-- 新模板start -->
<script id="storeTemplateContainer0" type="text/html">
    <div class="layui-col-lg8 layui-col-md8">
        <label class="layui-form-label redStar">标题</label>
        <div class="layui-input-block" style="display:flex;line-height: 32px;">
            <input name="enTitle" class="layui-input ifFocusInput"  data-prodpsku="{{d.pSku}}"  value="{{ d.enTitle||'' }}">
        </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <div id="titleRemark" style="display: flex;height: 18px;line-height: 18px;font-size:12px;margin-left: 110px;">
      </div>
    </div>
</script>
<script id="storeTemplateContainer1" type="text/html">
  <input name="creator" type="hidden" value="{{ d.creator||'' }}">
  <input name="creatorId" type="hidden" value="{{ d.creatorId||'' }}">
  <input name="modifyId" type="hidden" value="{{ d.modifyId||'' }}">
  <input name="modifyer" type="hidden" value="{{ d.modifyer||'' }}">
  <input name="createTime" type="hidden" value="{{ d.createTime||'' }}">
  
  <div class="layui-form-item">
      <div class="layui-col-lg8 layui-col-md8">
          <label class="layui-form-label redStar">父SKU</label>
          <div class="layui-input-block">
              <input name="pSku" class="layui-input" readonly value="{{ d.pSku||'' }}">
              <input type="hidden" name="storePSku" class="layui-input" readonly value="{{ d.storePSku||'' }}">

          </div>
      </div>
      <div class="layui-col-lg8 layui-col-md8">
          <label class="layui-form-label redStar">OA类目</label>
          <div class="layui-input-block">
              <input name="cateTreeName" class="layui-input" readonly value="{{ d.cateTreeName||'' }}">
          </div>
      </div>
      <input type="hidden" value="{{ d.id }}" name="amazonNewPublishId">
  </div>
</script>

<script id="storeTemplateContainer2" type="text/html">
  <div class="layui-form-item" id="newTempSSkuTitle" style="display: none;">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">标题（子）</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input ifFocusInput" data-prodpsku="{{d.pSku}}" name="subTitle" id="newTempSubTitle">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点1</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_1" maxlength="500" value="{{ d.sellingPointStyle1_1||'' }}">
        <span id="AmazonTemplate_sellingPoint1Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999">
          <span id="AmazonTemplate_sellingPoint1_1Count">{{ d.sellingPoint1Length || 0}}</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg2 layui-col-md2">
      <button type="button" class="layui-btn layui-btn-sm" id="applyTempDesc">引用基础模板描述</button>
      <span class="layui-btn layui-btn-sm" id="amazonTempGenerateFromGPT">GPT生成</span>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点2</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_2" maxlength="500" value="{{ d.sellingPointStyle1_2||'' }}">
        <span id="AmazonTemplate_sellingPoint2Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_2Count">{{ d.sellingPoint2Length || 0}}</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点3</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_3" maxlength="500" value="{{ d.sellingPointStyle1_3||'' }}">
        <span id="AmazonTemplate_sellingPoint3Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_3Count">{{ d.sellingPoint3Length || 0}}</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点4</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_4" maxlength="500" value="{{ d.sellingPointStyle1_4||'' }}">
        <span id="AmazonTemplate_sellingPoint4Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_4Count">{{ d.sellingPoint4Length || 0}}</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg8 layui-col-md8">
      <label class="layui-form-label redStar">卖点5</label>
      <div class="layui-input-block" style="display: flex;line-height: 32px;">
        <input class="layui-input" name="sellingPoint1_5" maxlength="500" value="{{ d.sellingPointStyle1_5||'' }}">
        <span id="AmazonTemplate_sellingPoint5Length" style="margin-left: 10px; font-weight: 700;width:70px;color: #999"">
          <span id="AmazonTemplate_sellingPoint1_5Count">{{ d.sellingPoint5Length || 0}}</span> / 500
        </span>
      </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12 mt10">
      <label class="layui-form-label">商品描述</label>
      <div class="layui-input-block">
        <textarea id="amazonTemplateDesc" style="display: none"></textarea>
      </div>
    </div>
    <div class="layui-col-lg10 layui-col-md10">
      <label class="layui-form-label">检索词:
      </label>
      <div class="layui-input-block">
        <div class="tagsinput-primary form-group">
          <input class="tagsinput layui-input" name="keyword" data-role="tagsinput" type="text" value="{{ d.keyword||'' }}">
        </div>
      </div>
    </div>
  </div>
</script>

<script id="NewAmazonTemplateContainer" type="text/html">
</script>   

<script type="text/html" id="amazonCateSpecificsTempNew">
  <div class="layui-col-md12 amazonCateSpecifics">
    <div class="layui-card">
      <div class="layui-card-header">分类属性
        <a class="layui-btn layui-btn-xs" id="temp_toogleLangBtn">切换语言</a>
      </div>
      <div class="layui-card-body layui-row" id="createRequireVal">
        {{# layui.each(d.cateList||[], function(index, item){ }}
        {{# if(item.required){ }}
        {{# if(item.validValues){ }}
        <div class="layui-form-item toggleClass requireEle">
          <label class="layui-form-label redStar" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
          <span class="disN labelField">{{item.fieldName}}</span>
          <div class="layui-input-inline">
          <select lay-search>
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
          <label class="layui-form-label redStar" style="width: 200px;" lay-tips="{{item.definition}}" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
          <span class="disN labelField">{{item.fieldName}}</span>
          <div class="layui-input-inline">
            <input type="text" class="layui-input" name="{{item.fieldName}}" value="{{item.defaultValue||''}}">
          </div>
          {{# if(item.fieldName == 'package_length' || item.localLabelName == 'package_length'){ }}
            <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('createRequireVal')">转换成inch</button>
            <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('createRequireVal')">转换成cm</button>
          {{# } }}
          {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('createRequireVal')">转换成oz</button>
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('createRequireVal')">转换成g</button>
          {{# } }}
        </div>
        {{# } }} {{# } }}
        {{# }); }}
        <a class="layui-btn layui-btn-xs" id="publish_moreAttrBtn">更多选填属性</a>
        <div style="display: none;" id="optionCreateValue">
        {{# layui.each(d.cateList||[], function(index, item){ }}
        {{# if(!item.required){ }}
        {{# if(item.validValues){ }}
          <div class="layui-form-item">
            <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <select lay-search>
                <option></option>
                {{# layui.each(item.validValues.split("#,#")||[], function(index, cItem){ }}
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
        {{# } }}{{# } }}
        {{# if(item.test){ }}
        {{# if(item.validValues){ }}
          <div class="layui-form-item testClass">
            <label class="layui-form-label" style="width: 200px;" data-local="{{item.localLabelName}}" data-eng="{{item.fieldName}}">{{item.salesSite == 'JP'?item.localLabelName:item.fieldName}}</label>
            <span class="disN labelField">{{item.fieldName}}</span>
            <div class="layui-input-inline">
              <select lay-search>
                <option></option>
                {{# layui.each(item.validValues.split("#,#")||[], function(index, cItem){ }}
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
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToInch('optionCreateValue')">转换成inch</button>
              <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToCm('optionCreateValue')">转换成cm</button>
            {{# } }}
            {{# if(item.fieldName == 'package_weight' || item.localLabelName == 'package_weight'){ }}
                <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToOz('optionCreateValue')">转换成oz</button>
                <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="tranferToG('optionCreateValue')">转换成g</button>
            {{# } }}
          </div>
        {{# } }}{{# } }}
        {{# }); }}
      
        </div>
    </div>
</div>
</script>

<script type="text/html" id="storeTempAndPublishAmazon">
  <form class="layui-form p10" id="AmazonTemplateCreateForm" onsubmit="return false;">
    <%--//第二步：建立视图。用于呈现渲染结果。--%>
    <div id="storeTemplateView1"></div>
    <div class="layui-form-item">
        <input name="storeTemplateBaseId" type="hidden">
        <hr>
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label redStar">站点</label>
            <div class="layui-input-block">
                <select class="salesSite" name="salesSite" lay-filter="storeTemplateSalesSite" lay-search>
                    <option></option>
                </select>
            </div>
        </div>
        <div class="layui-col-lg6 layui-col-md6" style="margin-left: 50px;display:flex">
            <div class="redStar" style="width: 200px;">子类目<a class="layui-btn layui-btn-xs"
               id="storeTemplateLayer_creatListing" style="margin: 10px">选择分类</a>
              </div>
              <input type="hidden" id="amazon_template_creatListing_cateItem-hidden2"
                     name="recommendedBrowseNode" value="" data-id="">
              <div id="storeTemplateAmazonListingName" style="flex:1;display:flex;align-items:center"></div>
            <input id="publish_ebayCateId1" name="ebayCateId1" type="hidden">
        </div>

        <div class="layui-col-lg2 layui-col-md2" id="createFulfillmentCenterIdTemp"></div>

        <div id="storeTemplateView0"></div>
        
        <hr>
        <div style="display: flex">
          <h2>类目属性</h2>
          <div class="layui-col-lg8 layui-col-md8" style="margin-bottom: 5px;display:none" id="newTempSkuAttr">
            <label class="layui-form-label">类目属性</label>
            <div class="layui-input-inline" style="width: 50%;display:flex;align-items:center">
              <select id="newTempSkuChoose" name="newTempSkuChoose" lay-filter="newTempSkuChoose">
              </select>
              <button type="button" class="layui-btn layui-btn-xs" style="margin-left: 10px" id="newTempApplyOtherAttr">应用至其他变种</button>
            </div>
          </div>
        </div>
        <hr>
        <div id="newStoreTemplate_editspecificForm"></div>
        <hr>
        <div id="storeTemplateView2"></div>
        <hr>
        <div class="layui-col-lg4 layui-col-md4">
          <label class="layui-form-label salesType redStar">售卖形式</label>
          <div class="layui-input-block" id="salesType">
            <input type="radio" name="salesType" lay-filter="salesType" value="1" title="单品">
            <input type="radio" name="salesType" lay-filter="salesType" value="2" title="多变种">
          </div>
      </div>
        <div class="layui-col-lg5 layui-col-md5 variationClassBox">
            <label class="layui-form-label variationClass redStar">variation theme</label>
            <div class="layui-input-block">
                <select name="variationTheme" lay-filter="variationTheme" lay-search>
                    <option></option>
                </select>
            </div>
        </div>
        <a class="layui-btn layui-btn-sm" id="publishCreateHandleSku" style="margin-left: 15px">生成sku</a>
        <br>
        <table class="layui-table" id="publishThemeTable"></table>
        <hr>
        <h2>变种参数</h2>
        <hr>
        <div class="layui-col-lg12 layui-col-md12" style="margin-bottom: 20px">
          <div style="float: left;margin-left: 15px" class="disN multi-box">
            <input type="checkbox" class="allid-cbox" lay-filter="allBox" lay-skin="primary" name="id">
          </div>
            <a class="layui-btn layui-btn-xs layui-btn-danger" id="storeTemplateDetaleSelected" style="float: right;">批量删除</a>
            <a class="layui-btn layui-btn-xs" id="publishCreateIncreaseRow" style="float: right;margin-right: 20px">新增一行</a>
        </div>

        <div id="publishInfoCreateTable"></div>        
        <hr>
    </div>
</form>
</script>

<script type="text/html" id="storeTempApplyDescLayer">
  <div id="storeTempApplyDescContent"></div>
</script>

<script type="text/html" id="storeTempApplyDesc">
  <div class="layui-form">
    {{# layui.each(d ||[], function(index, item){ }}
    <div class="descItem">
      <input class="descInput" type="checkbox" value="{{item}}" lay-skin="primary" name="original" title="{{item}}">
    </div>
    {{# }); }}
  </div>
</script>

<script type="text/html" id="publishThemeTableOaAttr">
    <select lay-filter="publishThemeTableOaAttrSelect" name="publishThemeTableOaAttrSelect" class="publishThemeTableOaAttrSelect" lay-search>
        {{# layui.each(d.oaAttr||[], function(index, item){ }}
          <option value={{item}}>{{item}}</option>
        {{# }); }}
    </select>
</script>

<!-- 对应 publishInfoCreateTable -->
<script type="text/html" id="prodListingSubSkuAmazonsCreateTable">
  {{# layui.each(d.prodListingSubSkuAmazons|| [], function(index, item){ }}
    <div class="amazon_publish_variant">
    <table class="layui-table">
      <thead>
      <tr>
        <th></th>
        <th>主图</th>
        <th name="ssku">商品子SKU</th>
        {{#if(!item.isEdit){}}
        <!-- <th>UPC/EAN</th> -->
        <th>product_id</th>
        {{# } }}
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <th data-key="{{cItem?.split(":")[1]||''}}">{{cItem?.split(":")[0]||''}}</th>
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <th data-key="colorMapValue">colormap</th>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <th data-key="sizeMapValue">sizemap</th>
        {{# } }}
        <!-- <th>价格</th>
        <th>重量</th> -->
        <!-- <th>库存</th> -->
        <th>操作</th>
      </tr>
      </thead>
      <tbody id="amazonPublish_create_newSubSkuInfo">
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
              <input type="radio" class="img-cbox imgRadio" lay-skin="primary" name="{{ 'imgCbox' + index }}" value={{
                item.imgNameList?.toString() || '' }} shortname="{{item.shortImgName || item.imgName }}" lay-filter="swatchRadio" select="false">
              <span>设为swatch图</span>
            </div>
            <img name="mainImg" src="{{item.imgNameList?.toString() || item.imgName}}" shortname="{{item.shortImgName || item.imgName}}" width="150" height="150">
          </input>
        </td>
        <td>
          <input name="storeSSku" class="layui-input" value="{{item.sSku||item.prodSSku ||''}}">
          <input style="display:none" class="layui-input" name="prodListingSubSkuAmazonsStoreSSku">
          <div class="addBtn">
            <a class="layui-btn layui-btn-xs" onclick="storeAmazonPublish_new_autoSetWeightPrice(this,`{{item.externalProductIdType}}`)">自动补充</a>
          </div>
          <input type="hidden" value="{{item.id}}" name="prodListingSubSkuAmazonsId">
          <input type="hidden" value="{{item.sSku || item.prodSSku}}" name="prodSSku">
          <input type="hidden" value="{{item.id}}" name="prodTempId">
          <input type="hidden" value="{{item.color}}" name="color">
          <input type="hidden" value="{{item.size}}" name="size">
          <input type="hidden" value="{{item.attrKeyVal}}" name="attrKeyVal">
          
        </td>
        {{#if(!item.isEdit){}}
        <!-- <td class="externalProductIdType">{{item.externalProductIdType||''}}</td> -->
        <td>
          <input type='text' readonly class="layui-input" name="externalProductId" value="{{item.externalProductId ||''}}">
          <div>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_regenerate(this,`{{item.externalProductIdType}}`)">重新生成</a>
            <a class="layui-btn layui-btn-xs" onclick="amazonPublish_subsku_empty(this,{{item.id}})">清空</a>
          </div>
        </td>
        {{# } }}
        {{# layui.each(d.varietionThemeTable||[], function(index, cItem){ }}
        <%--现根据亚马逊新模板中的修改弹窗参照修改,spliceString这个属性不清楚什么情况下显示--%>
        {{#if(cItem.split(":")[1]?.length * 1 > 8){ }}
        <td class="tdVal" data-key="spliceString">
          <span class="themeValue">{{item.spliceString || ''}}</span>
          <input style="display:none" class="layui-input" name="spliceString" value="{{item.spliceString || ''}}">
        </td>
        {{# }else{ }}
        <td class="tdVal" data-key="{{cItem.split(":")[1]||''}}">
          <span class="themeValue">{{item[cItem.split(":")[1]]}}</span>
          <input style="display:none" class="layui-input" name="sizeColor" value="{{item[cItem.split(":")[1]]}}">
        </td>
        {{# } }}
        {{# }); }}
        {{#if(item.colorMapValue){}}
        <td class="tdVal" data-key="colorMapValue" id="colorMapValue">
          <!-- <span class="themeValue">{{item.colorMapValue||''}}</span> -->
          <div name="colorMapValueDiv">
            <select class="layui-input" name="colorMapValue" lay-search>
              {{# layui.each(item.colorMap||[], function(index, color){}}
                <option value="{{ color }}" {{color==item.colorMapValue?"selected":""}}>{{color}}</option>
              {{# }) }}
            </select>
          </div>

        </td>
        {{# } }}
        {{#if(item.sizeMapValue){}}
        <td class="tdVal" data-key="sizeMapValue">
          <!-- <span class="themeValue">{{item.sizeMapValue||''}}</span> -->
          <div name="sizeMapValueDiv">
            <select class="layui-input" name="sizeMapValue" lay-search>
              {{# layui.each(item.sizeMap||[], function(index, size){}}
                <option value="{{ size }}" {{size==item.sizeMapValue?"selected":""}}>{{size}}</option>
              {{# }) }}
            </select>
          </div>
        </td>
        {{# } }}
        <!-- <td>
          <div class="disflex">
            <input type="number" class="layui-input changePrice{{item.id}}" name="standardPrice" min="0" value="{{item.standardPrice||''}}">
            <label class="ml10">{{item.currency ||''}}</label>
          </div>
        </td> -->
        <!-- <td class="cskuWeight">{{item.weight||''}}</td> -->
        <!-- <td>
          <input type="number" class="layui-input quantity" min="0" name="quantity" value="{{item.quantity||'300'}}"
            onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
          >
        </td> -->
        <td>
          <a class="layui-btn layui-btn-xs" onclick="removeAmazonSkuInfo(this)">移除</a>
          <a class="layui-btn layui-btn-xs" name="saveBtn" onclick="amazonPublish_subsku_save(this,{{item.id}})">保存</a>
        </td>
      </tr>
      </tbody>
    </table>
    <h3>辅图
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 storeTemplate_addLocalPicture">本地图片</button>
      <button type="button" class="layui-btn layui-btn-sm mt05" onclick="publish_addPicture($(this))">网络图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05 addImgByTpl" data-prodssku="{{item.sSku || item.prodSSku}}" onclick="amazon_publish_addImgByTpl($(this),true)">模板图片</button>
      <button type="button" class="layui-btn layui-btn-sm ml5 mt05" onclick="cancelSwatch($(this))">不选择swatch图</button>
      <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
        <span class="layui-bg-red">说明！</span>
        <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
        <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">9</span>张，已经选用了<span class="curImgNum">{{item.otherImageUrl?.length ? item.otherImageUrl.split("|").length: 0}}</span>张辅图</span>
      </div>
    </h3>
    <div class="layui-clear pl20 imgContains dis_flex">
      <ul class="uploadImgUL ui-sortable" style="width: 100%;">
        {{# layui.each(item.otherImageList ||[], function(index, cItem){ }}
        <li draggable="true" class="imgBox_prodTpl" data-src="{{cItem}}" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
          <div class="ImgDivOut">
            <div style="width: 100%; display:flex;justify-content: center">
                <input type="radio" class="img-cbox" style="margin-left:-10px" value="{{cItem||''}}" shortname="{{ item.otherImageUrl?.split('|')[index]}}" lay-filter="swatchRadio" select="false">
                <span>设为swatch图</span>
            </div>
            <div class="ImgDivIn">
              <%--<input type="hidden" name="extImg" value="{{cItem||''}}">--%>
              <img style="height:150px;max-width: 150px" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" src="{{cItem}}" shortname="{{ item.otherImageUrl?.split('|')[index]}}" >
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

<!-- 新模板end -->

<!-- GPT生成 -->
<script type="text/html" id="amazonTempGenerateFromGPTLayTpl">
  <form class="layui-form" style="padding: 20px 10px 0 0;">
    <div class="layui-form-item">
      <span style="margin-left:130px;">输入生成内容所需关键词,逗号分割:</span>
      <permTag:perm funcCode="amazon_template_gpt_prompt_config_perm">
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
        <span class="layui-btn layui-btn-sm gpt-template-copy">复制勾选内容</span>
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
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_1">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点2" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_2">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点3" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_3">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点4" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_4">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="卖点5" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <input type="text" class="layui-input gpt-content" name="sellingPoint1_5">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">
        <input type="checkbox" title="产品描述" lay-skin="primary" class="gpt_s_ckeckbox" lay-filter="gpt_s_check_filter">
      </div>
      <div class="layui-input-block">
        <textarea class="layui-textarea gpt-content" name="amazonTemplateDesc"></textarea>
      </div>
    </div>
  </form>
</script>

<!-- GPT生成-prompt配置 -->
<script type="text/html" id="amazonTempGenerateFromGPTPrompt">
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
