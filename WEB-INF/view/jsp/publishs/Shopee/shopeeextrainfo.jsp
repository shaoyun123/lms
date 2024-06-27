<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
</style>
<title>商品补充信息</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="shopee_searchForm" action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类目</label>
                                <div class="layui-input-block">
                                    <button id="shopee_cateBtn" type="button"
                                            class="layui-btn layui-btn-primary layui-btn-sm">请选择
                                    </button>
                                </div>
                                <input id="shopee_cateId" name="cateId" type="hidden">
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select xm-select="shopee_selectMan" xm-select-search xm-select-search-type="dl"
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
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="salesSite" lay-search>
                                        <c:forEach items="${shopeeSites}" var="shopeeSite">
                                            <option value="${shopeeSite.getCode()}">${shopeeSite.getName()}</option>
                                        </c:forEach>
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
                                    <select name="isListingAble">
                                        <option value="" selected>全部</option>
                                        <option value="true">国内仓不禁售</option>
                                        <option value="false">国内仓禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="operatorSearchType">
                                        <option value="creatorId">创建人</option>
                                        <option value="modifierId">修改人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="operatorSearchValue" lay-search>
                                        <option value="">请选择</option>
                                        <c:forEach items="${shopeeSpecialists}" var="shopeeSpecialist">
                                            <option value="${shopeeSpecialist.id}">${shopeeSpecialist.userName}</option>
                                        </c:forEach>
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
                                           id="shopeeExtraInfoTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">shopee类目ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shopeeCategoryId" class="layui-input"
                                           id="shopeeCategoryId">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">shopee类目名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shopeeCategoryName" class="layui-input"
                                           id="shopeeCategoryName">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button id="shopee_searchBtn" type="button" class="layui-btn layui-btn-sm keyHandle">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="shopee_reset">清空
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="shopee_cateDiv"></div>
                </div>
            </div>
            <div class="layui-card" id="shopeeExtraInfoCard">
                <div class="layui-card-header dis_flex">
                    <div class="numCount">数量<span id="shopee_countSpan">0</span></div>
                    <span>
                        <permTag:perm funcCode="batch_update_extra_info_shopee">
                            <button id="shopee_batchUpdateBtn" type="button" class="layui-btn layui-btn-sm">批量修改</button>
                        </permTag:perm>
                        <permTag:perm funcCode="delete_extra_info_shopee">
                            <button id="shopee_delBtn" type="button" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                        </permTag:perm>
                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="shopee_table" lay-filter='shopee_table-filter'>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
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
    <permTag:perm funcCode="add_extra_info_shopee">
        {{#  if(d.id){ }}
            <div>
                <a class="layui-btn layui-btn-xs" lay-event="et_editAssiData">修改</a>
            </div>
        {{#  } else { }}
        <div><a class="layui-btn layui-btn-xs" lay-event="et_editAssiData">添加</a></div>
        {{#  } }}
    </permTag:perm>
</script>

<script type="text/html" id="shopee_editAssiDataTpl">
    <form id="shopee_editAssiDataForm" class="layui-form">
        <input type="hidden" name="salesSite">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header">shopee分类</div>
                    <div class="layui-card-body layui-row">
                        <div class="shopeeCateDiv layui-col-lg12 layui-col-md12">
                            <label class="layui-form-label">分类</label>
                            <div class="layui-input-block">
                                <button id="shopee_cateIdBtn1" type="button"
                                        class="layui-btn layui-btn-normal layui-btn-sm">选择shopee分类
                                </button>
                                <button id="shopee_cateSearch1" class="layui-btn layui-btn-primary layui-btn-sm"
                                        type="button">
                                    <i class="layui-icon layui-icon-search"></i>
                                </button>
                                <h4 id="shopee_cateText1" style="display: inline;"></h4>
                            </div>
                            <input id="shopee_cateId1" name="shopeeCategoryId" type="hidden">
                        </div>
                    </div>
                </div>
                <div class="layui-col-md12 shopeeCateSpecifics">
                    <div class="layui-card">
                        <div class="layui-card-header">分类属性信息</div>
                        <div class="layui-card-body layui-row">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="shopee_cateSearchTpl">
    <div class="p10">
        <form id="shopee_cateSearchForm" class="layui-form">
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
        <table id="shopee_cateSearchTable"></table>
    </div>
</script>
<script>
    layui.use(['admin', 'formSelects'], function () {
        var formSelects = layui.formSelects;
        //商品归属人多选
        formSelects.data('shopee_selectMan', 'local', {
            arr: [
                <c:forEach items="${bizzOwners}" var="bizzOwner">
                {name: '${bizzOwner.userName}', value: '${bizzOwner.id}'},
                </c:forEach>
            ]
        });
    })
</script>
<script src="${ctx}/static/js/publishs/shopee/shopeeextrainfo.js"></script>
