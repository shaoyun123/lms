<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<style>
    .showTipElem:hover {
        color: orange;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .numCount {
        border: 1px solid #e8e8e8;
        padding: 5px !important;
        border-bottom: none;
        line-height: 30px;
        margin-top: 5px;
    }

    .aep-devNote {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;

    }

    .aep-devNote:hover {
        -webkit-line-clamp: 1000;
    }

    .attr-w-400 {
        width: 400px;
    }

    #shopee_cnsc_editAssiDataForm .shopeeCateSpecifics .layui-card-body .attrs .layui-input-inline {
        width: 350px;
    }
    .shopee_cnsc_header_icon{
       width: 160px;
    }
    .shopee_cnsc_header_icon span{
        margin-top: 13px;
    }
    .shopee_cnsc_header_icon .layui-icon{
        right: 0;
        top: -11px !important;
    }
    .shopee_cnsc_second_header_icon{
       width: 140px;
    }
    .shopee_cnsc_second_header_icon .layui-icon{
        right: 0;
        top: 6px !important;
    }
</style>
<title>CNSC商品补充信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="shopee_cnsc_searchForm" action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">OA新类目</label>
                                <div class="layui-input-block">
                                    <input id="shopeecnsc_extra_oaNewcateIds">
                                </div>
                                <input id="searchForm_shopee_cnsc_cateId" name="cateId" type="hidden">
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select xm-select="shopee_cnsc_selectMan" xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">补充信息</label>
                                <div class="layui-input-block">
                                    <select name="completeStatus">
                                        <option value="">全部</option>
                                        <option value="1">已添加</option>
                                        <option value="2">未添加</option>
                                        <option value="3">不完整</option>
                                        <option value="4">已失效</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="searchType">
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">模板子SKU</option>
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
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
                                        <option value="" selected>全部</option>
                                        <option value="true">在售</option>
                                        <option value="false">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="timeType">
                                        <option value="CREATE_TIME">创建时间</option>
                                        <option value="AUDIT_TIME">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="time" type="text" class="layui-input" placeholder="选择时间"
                                           id="ee_cnsc_time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="isShopeeTort">
                                        <option value="">全部</option>
                                        <option value="true">shopee侵权</option>
                                        <option value="false" selected>shopee不侵权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售状态</label>
                                <div class="layui-input-block">
                                    <select name="listingAbleEnum">
                                        <option value="" selected>全部</option>
                                        <option value="ALL">全部禁售</option>
                                        <option value="PORTION">部分禁售</option>
                                        <option value="NOT_ALL">非禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="operatorSearchType" lay-filter="operatorSearchTypeFilter">
                                        <option value="creatorId">创建人</option>
                                        <option value="modifierId">修改人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="operatorSearchValue" lay-search>
                                        <option value="">请选择</option>

                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label  labelSel">
                                    <select name="infoTimeType">
                                        <option value="createTime">信息创建时间</option>
                                        <option value="modifyTime">信息修改时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="infoTime" autocomplete="off" class="layui-input"
                                           id="shopeeCnscExtraInfoTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">CNSC类目ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shopeeCnscCategoryId" class="layui-input"
                                           id="shopeeCnscCategoryId">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">CNSC类目</label>
                                <div class="layui-input-block">
                                    <input id="shopeecnsc_extra_cnsccateIds">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button id="shopee_cnsc_searchBtn" type="button"
                                        class="layui-btn layui-btn-sm keyHandle">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                        id="shopee_cnsc_reset">
                                    清空
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="shopee_cnsc_cateDiv"></div>
                </div>
            </div>
            <div class="layui-card" id="shopeeExtraInfoCard">
                <div class="layui-card-header dis_flex">
                    <div class="numCount">数量<span id="shopee_countSpan">0</span></div>
                    <div class="disflex layui-form" style="align-items: center;">
                        <permTag:perm funcCode="batch_sync_extra_info_shopee_cnsc">
                            <div class="disflex mr10" style="align-items: center;">
                                <span class="mr10">店铺7日销量</span>
                                <input type="text" class="layui-input w100" name="minSales" onkeypress="commonKeyPressInputNotNega(event)">
                                <span>~</span>
                                <input type="text" class="layui-input w100" name="maxSales" onkeypress="commonKeyPressInputNotNega(event)">
                            </div>
                            <div class="shopee_cnsc_header_icon">
                                <input type="checkbox" name="isFilterCategoryNotAdjustedListing" value="1" title="过滤类目未调整listing" lay-skin="primary"> 
                            </div>
                            <div class="shopee_cnsc_second_header_icon">
                                <input type="checkbox" name="isCheckAvaliableLogistics" value="1" title="校验可用物流" lay-skin="primary"> 
                            </div>
                            <button id="shopee_cnsc_batchSyncBtn" type="button"
                                    class="layui-btn layui-btn-normal layui-btn-sm" lay-tips="过滤修改类目后无可用物流listing">修改在线listing类目</button>
                        </permTag:perm>
                        <permTag:perm funcCode="batch_update_extra_info_shopee_cnsc">
                            <button id="shopee_cnsc_batchUpdateBtn" type="button"
                                    class="layui-btn layui-btn-sm">批量修改</button>
                        </permTag:perm>
                        <permTag:perm funcCode="delete_extra_info_shopee_cnsc">
                            <button id="shopee_cnsc_delBtn" type="button"
                                    class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                        </permTag:perm>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="shopee_cnsc_table" lay-filter='shopee_cnsc_table-filter'>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/request.js"></script>
<script type="text/html" id="shopee_platTortTpl">
<div style="width: 300px;text-align:left;" class="layui-form">
    {{# if(d.isWishTort){ }}
    <input type="checkbox" checked disabled title="wish" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="wish" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.wishTortReason ? d.wishTortReason : ''}}</span>
    <br>
    {{# if(d.isJoomTort){ }}
    <input type="checkbox" disabled checked title="joom" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="joom" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.joomTortReason ? d.joomTortReason : ''}}</span>
    <br>
    {{# if(d.isEbayTort){ }}
    <input type="checkbox" disabled checked title="ebay" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="ebay" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span>
    <br>
    {{# if(d.isAmazonTort){ }}
    <input type="checkbox" disabled checked title="amazon" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="amazon" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span>
    <br>
    {{# if(d.isSmtTort){ }}
    <input type="checkbox" disabled checked title="smt" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="smt" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.smtTortReason ? d.smtTortReason : ''}}</span>
    <br>
    {{# if(d.isShopeeTort){ }}
    <input type="checkbox" disabled checked title="shopee" lay-skin="primary">
    {{# } else { }}
    <input type="checkbox" disabled title="shopee" lay-skin="primary">
    {{# } }}
    <span class="w120 inline_table hv20">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span>
    <br>

</div>
</script>
<script type="text/html" id="ebay_enTitle">
{{#  if(d.enTitle){ }}
<div style="text-align: left">{{d.enTitle}}</div>
{{#  } }}
{{#  if(d.cateCnName){ }}
<div style="text-align: left"><span style="color:grey">分类:</span> {{d.cateCnName}}</div>
{{#  } }}
</script>
<script type="text/html" id="ee_imageTpl">
{{#  if(typeof(d.mainImgUri) !="undefined"){ }}
<img width="60" height="60" data-original="${tplIVP}/{{ d.mainImgUri }}" data-onerror='layui.admin.img_noFind()'
     class="img_show_hide lazy b1">
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
<script type="text/html" id="shopee_phTpl">
{{#  layui.each(d.prodProhibitMappings, function(index, $value){ }}
<div class="pointHand showTipElem" onmouseover="showProhibitReason(`{{ $value.lisintgInableMsg }}`,this)"
     data-tipId="" onmouseout="removeTip(this)">
    {{ $value.platCode }}
    {{# if($value.salesSite){ }}
    -{{ $value.salesSite }}
    {{# } }}
    -{{# if($value.stockLocation == 1){ }}
    国内仓
    {{# } }}
    -{{# if($value.stockLocation == 2){ }}
    海外仓
    {{# } }}
</div>
{{#  }); }}
</script>
<script type="text/html" id="shopee_createrAndmodifier_tpl">
<div><span>创建人：</span><span>{{d.creator||""}}</span></div>
<div><span>修改人：</span><span>{{d.modifier||""}}</span></div>
</script>
<script type="text/html" id="shopee_createTime_tpl">
<div><span>创建：</span><span>{{d.createTime ? Format(new Date(d.createTime),"yyyy-MM-dd hh:mm:ss"):""}}</span></div>
<div><span>修改：</span><span>{{d.modifyTime ? Format(new Date(d.modifyTime),"yyyy-MM-dd hh:mm:ss"):""}}</span></div>
</script>
<%--<script type="text/html" id="shopee_categoryTpl">
    <div style="text-align: left"><span style="color:grey">categoryId:</span> {{d.categoryId || ''}}</div>
</script>--%>
<script type="text/html" id="shopee_editBtnTpl">
<permTag:perm funcCode="add_extra_info_shopee_cnsc">
    {{# if(d.id){ }}
    <div>
        <a class="layui-btn layui-btn-xs" lay-event="et_editAssiData_cnsc">修改</a>
    </div>
    {{# } else { }}
    <div><a class="layui-btn layui-btn-xs" lay-event="et_editAssiData_cnsc">添加</a></div>
    {{# } }}
</permTag:perm>
</script>

<script type="text/html" id="shopee_cnsc_editAssiDataTpl">
<form id="shopee_cnsc_editAssiDataForm" class="layui-form">
    <input type="hidden" name="salesSite">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">shopeeCNSC分类</div>
                <div class="layui-card-body layui-row">
                    <div class="shopeeCateDiv layui-col-lg12 layui-col-md12">
                        <label class="layui-form-label">分类</label>
                        <div class="layui-input-block">
                            <button id="shopee_cnsc_cateIdBtn" type="button"
                                    class="layui-btn layui-btn-normal layui-btn-sm">选择shopeeCNSC分类
                            </button>
                            <button id="shopee_cnsc_cateSearch" class="layui-btn layui-btn-primary layui-btn-sm"
                                    type="button">
                                <i class="layui-icon layui-icon-search"></i>
                            </button>
                            <h4 id="shopee_cnsc_cateText" style="display: inline;"></h4>
                        </div>
                        <input id="shopee_cnsc_cateId" name="shopeeCnscCategoryId" type="hidden">
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 shopeeCateSpecifics">
                <div class="layui-card">
                    <div class="layui-card-header">shopeeCNSC分类属性信息</div>
                    <div class="layui-card-body layui-row">
                        <div class="attrs">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
</script>
<script type="text/html" id="shopee_cnsc_cateSearchTpl">
<div class="p10">
    <form id="shopee_cnsc_cateSearchForm" class="layui-form">
        <input type="hidden" name="sourceBtnId">
        <div class="layui-form-item">
            <div class="layui-inline layui-col-md10">
                <label class="layui-form-label">关键字</label>
                <div class="layui-input-block">
                    <input type="text" name="title" required="" <%--lay-verify="required"--%> placeholder="请输入标题"
                           autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline layui-col-md1">
                <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">搜索</button>
            </div>
        </div>
    </form>
    <table id="shopee_cnsc_cateSearchTable"></table>
</div>
</script>
<script>
layui.use(['admin', 'formSelects','form'], function () {
  let formSelects = layui.formSelects;
  let form = layui.form;
  let shopee_selectMan_options = [];
  commonReturnPromise({
    url: `/lms/shopee/shopeeCnscExtraInfo/getBizzOwnersAndShopeeSpecialists`
  }).then(res => {
    let bizzOwners = res.bizzOwners;
    let shopeeSpecialists = res.shopeeSpecialists;
    bizzOwners.forEach(e => {
      let obj = { name: e.userName, value: e.id }
      shopee_selectMan_options.push(obj)
    });
    formSelects.data('shopee_cnsc_selectMan', 'local', {
      arr: [...shopee_selectMan_options]
    });
    let $operatorSearchValue = $('#shopee_cnsc_searchForm select[name=operatorSearchValue]');
    res.creatorList.forEach(e => {
        $operatorSearchValue.append('<option value=' + e.creatorId + '>' + e.creator + '</option>')
    });
    form.render()
    form.on('select(operatorSearchTypeFilter)', function(data){
      $operatorSearchValue.html('');
      let value = data.value;
      if(value == 'creatorId'){//创建人
        res.creatorList.forEach(e => {
          $operatorSearchValue.append('<option value=' + e.creatorId + '>' + e.creator + '</option>')
        });
      }else{
        res.modifierList.forEach(e => {
          $operatorSearchValue.append('<option value=' + e.modifierId + '>' + e.modifier + '</option>')
        });
      }
      form.render('select')
    });
  });
});
</script>
<script src="${ctx}/static/js/publishs/shopee/shopeeCnscExtrainfo.js"></script>
