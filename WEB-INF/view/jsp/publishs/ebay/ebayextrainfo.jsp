<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>  
<style>
	.showTipElem:hover{
        color : orange;
    }

    .dis_flex{
        display: flex;
        justify-content:space-between;
    }

   .numCount {
    border: 1px solid #e8e8e8;
    padding: 5px !important;
    border-bottom: none;
    line-height: 30px;
    margin-top:5px;
   }
    .aep-devNote {
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;

    }
    .aep-devNote:hover {
        -webkit-line-clamp: 1000;
    }
</style>
<title>商品补充信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="ee_searchForm" action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类目</label>
                                <div class="layui-input-block">
                                    <button id="ee_cateBtn" type="button" class="layui-btn layui-btn-primary layui-btn-sm">请选择</button>
                                </div>
                                <input id="ee_cateId" name="cateId" type="hidden">
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select xm-select="ee_selectMan" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">补充信息</label>
                                <div class="layui-input-block">
                                    <select name="isComplete">
                                        <option value="">全部</option>
                                        <option value="true">已添加</option>
                                        <option value="false">未添加</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteId">
                                        <c:forEach items="${ebaySites}" var="ebaySite">
                                            <option value="${ebaySite.getSiteId()}">${ebaySite.getSite().getSiteChineseName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="searchType">
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">模板子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" type="text" class="layui-input" placeholder="父子sku支持多个查询">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="true">在售</option>
                                        <option value="false">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="timeType">
                                            <c:forEach items="${timeTypes}" var="timeType">  
                                            <option value="${timeType.name()}">${timeType.getText()}</option>
                                      </c:forEach>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="time" type="text" class="layui-input" placeholder="选择时间" id="ee_time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="isEbayTort">
                                        <option value="">全部</option>
                                        <option value="true">ebay侵权</option>
                                        <option value="false">ebay不侵权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售状态</label>
                                <div class="layui-input-block">
                                    <select name="isListingAble">
                                        <option value="">全部</option>
                                        <option value="true">国内仓不禁售</option>
                                        <option value="false">国内仓禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">类目状态</label>
                                <div class="layui-input-block">
                                    <select name="isCateComplete">
                                        <option value="">全部</option>
                                        <option value="false">不完整</option>
                                        <option value="true">完整</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">属性状态</label>
                                <div class="layui-input-block">
                                    <select name="isAspectsComplete">
                                        <option value="">全部</option>
                                        <option value="false">不完整</option>
                                        <option value="true">完整</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">模板类型</label>
                                <div class="layui-input-block">
                                    <select name="tplType" lay-search>
                                        <option value=""></option>
                                        <option value="0">直邮</option>
                                        <option value="1">精品</option>
                                        <option value="2">精铺</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3 pl20">
                                    <button id="ee_searchBtn" type="button" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="ee_reset">清空</button>
                            </div>
                        </div>
                    </form>
                    <div id="ee_cateDiv"></div>
                </div>
            </div>
            <div class="layui-card" id="ebayectainfoCard">
                <div class="layui-card-header dis_flex">
                    <div class="numCount">数量<span id="ee_countSpan">0</span></div>
                    <span>
                        <button id="ee_exportBtn" type="button" class="layui-btn layui-btn-sm">导入ibay模板</button>
                        <button id="ee_delBtn" type="button" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="ee_table" lay-filter='ee_table-filter'>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="ee_platTortTpl">
    <div style="width: 300px;text-align:left;" class="layui-form">
        {{#  if(d.isWishTort){ }}
        <input type="checkbox" checked disabled title="wish" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="wish" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.wishTortReason ? d.wishTortReason : ''}}</span>
        <br>
        {{#  if(d.isJoomTort){ }}
        <input type="checkbox" disabled checked title="joom" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="joom" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.joomTortReason ? d.joomTortReason : ''}}</span>
        <br>
        {{#  if(d.isEbayTort){ }}
        <input type="checkbox" disabled checked title="ebay" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="ebay" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span>
        <br>
        {{#  if(d.isAmazonTort){ }}
        <input type="checkbox" disabled checked title="amazon" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="amazon" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span>
        <br>
        {{#  if(d.isSmtTort){ }}
        <input type="checkbox" disabled checked title="smt" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="smt" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.smtTortReason ? d.smtTortReason : ''}}</span>
        <br>
        {{#  if(d.isShopeeTort){ }}
        <input type="checkbox" disabled checked title="shopee" lay-skin="primary">
        {{#  } else { }}
          <input type="checkbox" disabled  title="shopee" lay-skin="primary">
        {{#  } }} 
        <span class="w120 inline_table hv20">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span>
        <br>
        
    </div>
</script>
<script type="text/html" id="ee_imageTpl">
    {{#  if(typeof(d.mainImgUri) !="undefined"){ }}
                <img width="60" height="60" data-original="${tplIVP}/{{ d.mainImgUri }}"  data-onerror='layui.admin.img_noFind()' class="img_show_hide lazy b1">
  {{#  } }}
</script>
<script type="text/html" id="ee_owner">
    {{#  if(d.bizzOwner){ }}
    <div style="text-align: left"><span style="color:grey">开发:</span> {{d.bizzOwner}}</div>
    {{#  } }}
    {{#  if(d.responsor){ }}
    <div style="text-align: left"><span style="color:grey">责任:</span> {{d.responsor}}</div>
    {{#  } }}
</script>
<script type="text/html" id="ee_phTpl">
    {{#  layui.each(d.prodProhibitMappings, function(index, $value){ }}
	    <div class="pointHand showTipElem" onmouseover="showProhibitReason(`{{ $value.lisintgInableMsg }}`,this)" data-tipId="" onmouseout="removeTip(this)">
            {{ $value.platCode }}
            {{#  if($value.salesSite){ }}
            -{{ $value.salesSite }}
            {{#  } }}
            -{{#  if($value.stockLocation == 1){ }}
                国内仓
            {{#  } }}
            -{{#  if($value.stockLocation == 2){ }}
                虚拟仓
            {{#  } }}
        </div>
	  {{#  }); }}
</script>
<script type="text/html" id="ee_categoryTpl">
    <div style="text-align: left"><span style="color:grey">category1:</span> {{d.category1 || ''}}</div>
    <div style="text-align: left"><span style="color:grey">category2:</span> {{d.category2 || ''}}</div>
</script>
<script type="text/html" id="ee_editBtnTpl">
    {{#  if(d.ebayAssiDataId){ }}
    <div><a class="layui-btn layui-btn-xs" lay-event="et_editAssiData">修改</a></div>
    {{#  } else { }}
    <div><a class="layui-btn layui-btn-xs" lay-event="et_editAssiData">添加</a></div>
    {{#  } }}
    <div><a class="layui-btn layui-btn-xs" lay-event="et_ebay_prodProhibit">设置禁售</a></div>
</script>

<script type="text/html" id="ee_editAssiDataTpl">
    <form id="ee_editAssiDataForm" class="layui-form">
        <input type="hidden" name="siteId">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header">ebay分类</div>
                    <div class="layui-card-body layui-row">
                        <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                            <label class="layui-form-label">第一分类</label>
                            <div class="layui-input-block">
                                <button id="ee_ebayCateIdBtn1" type="button" class="layui-btn layui-btn-normal layui-btn-sm">选择ebay分类</button>
                                <button id="ee_ebayCateSearch1" class="layui-btn layui-btn-primary layui-btn-sm" type="button">
                                    <i class="layui-icon layui-icon-search"></i>
                                </button>
                                <h4 id="ee_ebayCateText1" style="display: inline;"></h4>
                                <a id="ee_ebayCateRefresh" style="cursor: pointer"><i title="刷新类目specifics规则" class="layui-icon layui-icon-refresh"></i></a>
                            </div>
                            <input id="ee_ebayCateId1" name="ebayCateId1" type="hidden">
                        </div>
                        <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                            <label class="layui-form-label">第二分类</label>
                            <div class="layui-input-block">
                                <button id="ee_ebayCateIdBtn2" type="button" class="layui-btn layui-btn-normal layui-btn-sm">选择ebay分类</button>
                                <button id="ee_ebayCateSearch2" class="layui-btn layui-btn-primary layui-btn-sm" type="button">
                                    <i class="layui-icon layui-icon-search"></i>
                                </button>
                                <h4 id="ee_ebayCateText2" style="display: inline;"></h4>
                            </div>
                            <input id="ee_ebayCateId2" name="ebayCateId2" type="hidden">
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 ebayCateSpecifics">
                <div class="layui-card">
                    <div class="layui-card-header">分类属性信息</div>
                    <div class="layui-card-body layui-row">
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 ebayCustomSpecifics">
                <div class="layui-card">
                    <div class="layui-card-header">自定义属性信息</div>
                    <div class="layui-card-body layui-row">
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label"></label>
                        <div class="layui-inline">
                            <button type="button" id="ee_addCustomAttr" class="layui-btn layui-btn-normal">添加自定义属性</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="ee_ebayCateSearchTpl">
    <div class="p10">
        <form id="ebayExtra_cateSearchForm" class="layui-form">
            <input type="hidden" name="sourceBtnId">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                <label class="layui-form-label">关键字</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">搜索</button>
                </div>
            </div>
        </form>
        <table id="ee_ebayCateSearchTable"></table>
    </div>
</script>
<%--设置禁售--%>
<script type="text/html" id="et_ebay_prodProhibitTpl">
    <div id="et_ebay_prod_prohibit_div">
    </div>
</script>
<script type="text/html" id="et_ebay_prodProhibitTplForm" >
    <form id="et_ebay_prodProhibitForm" class="layui-form">
        {{ each data v i}}
        <div class="p20">
            <div class="layui-input-block">
                {{ if (v.domesticWarehouse) }}
                 <input type="checkbox" lay-skin="primary" value="{{ v.salesSiteId }}" name="domestic" checked title="{{ v.cnTitle }} -- 国内仓">
                {{ else }}
                <input type="checkbox" lay-skin="primary" value="{{ v.salesSiteId }}" name="domestic"  title="{{ v.cnTitle }} -- 国内仓" >
                {{  /if}}

                {{ if (v.overseasWarehouse) }}
                <input type="checkbox" lay-skin="primary" value="{{ v.salesSiteId }}" name="overseas" checked title="{{ v.cnTitle }} -- 虚拟仓">
                {{ else }}
                <input type="checkbox" lay-skin="primary" value="{{ v.salesSiteId }}" name="overseas" title="{{ v.cnTitle }} -- 虚拟仓">
                {{  /if}}
            </div>
        </div>
        {{ /each }}
    </form>
</script>
<script>
    layui.use(['admin', 'formSelects'], function() {
        var formSelects = layui.formSelects;
        //商品归属人多选
        formSelects.data('ee_selectMan','local',{arr:[
            <c:forEach items="${bizzOwners}" var="bizzOwner">  
                {name: '${bizzOwner.userName}',value: '${bizzOwner.id}'},
        </c:forEach>
        ]});
    })
</script>
<script src="${ctx}/static/js/publishs/ebay/ebayextrainfo.js"></script>
