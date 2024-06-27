<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>


<title>活动登记</title>
<style>
    #shopee_activity_searchForm .layui-form-item{
        margin-bottom:0
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="shopee_activity_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_activity_depart_sel" lay-search lay-filter="shopee_activity_depart_sel"  class="orgs_hp_custom" name="depart">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  id="shopee_activity_salesman_sel" lay-search lay-filter="shopee_activity_salesman_sel"  class="users_hp_custom" data-rolelist="shopee专员" name="salesman" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="shopee_activity_store_sel" lay-filter="shopee_activity_store_sel" xm-select="shopee_activity_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" name="storeAcctIdList"
                                            data-platcode="shopee"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">活动时间</label>
                                <div class="layui-input-block"  id="activityOrderTimeDiv">
                                    <input type="text" class="layui-input" id="activityTime" name="activityTime">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">产品id</label>
                                <div class="layui-input-block">
                                    <input type="text" id="actvt_itemId" autocomplete="off" class="layui-input" onblur="commonBlurMoreNum(event)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品父SKU</label>
                                <div class="layui-input-block"  id="activityProdPSkuDiv">
                                    <input type="text" class="layui-input" id="activityProdPSku" name="activityProdPSku" onblur="commChangeInputVal(this.value,event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">浏览量</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="viewsMin" onkeypress="commonKeyPressInputNotNega(event)">
                                    <span class="ml10 mr10">-</span>
                                    <input type="text" class="layui-input" name="viewsMax"  onkeypress="commonKeyPressInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="searchSalesType">
                                    <option value="1">7天销量</option>
                                    <option value="2">30天销量</option>
                                    <option value="3">60天销量</option>
                                    <option value="4">90天销量</option>
                                </select></label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="salesMin" onkeypress="commonKeyPressInputNotNega(event)">
                                    <span class="ml10 mr10">-</span>
                                    <input type="text" class="layui-input" name="salesMax"  onkeypress="commonKeyPressInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">登记天数</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="addDaysMin" onkeypress="commonKeyPressInputNotNega(event)">
                                    <span class="ml10 mr10">-</span>
                                    <input type="text" class="layui-input" name="addDaysMax"  onkeypress="commonKeyPressInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登天数</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input" name="listingDaysMin" onkeypress="commonKeyPressInputNotNega(event)">
                                    <span class="ml10 mr10">-</span>
                                    <input type="text" class="layui-input" name="listingDaysMax"  onkeypress="commonKeyPressInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="issueSearchBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="shopee_activity_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="shopee_actvt_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:left;margin: 3px 0 0 12px">
                                <li class="layui-this" id="actvtBefore">未开始(<span id="tolnum_span_before"></span>)</li>
                                <li shopee_actvt_type="2" id="actvtOn">进行中(<span id="tolnum_span_on"></span>)</li>
                                <li shopee_actvt_type="3" id="actvtAfter">已结束(<span id="tolnum_span_after"></span>)</li>
                            </div>
                            <div style="float:left;margin: 3px 0 0 12px">
                            <permTag:perm funcCode="download_shopee_temp">
                                <a href="${ctx}/static/templet/shopeeActvtRegiTemp.xlsx" class="layui-btn layui-btn-sm" target="_blank">模板下载</a>
                            </permTag:perm>
                            </div>
                            <div style="float:left;margin: 3px 0 0 9px">
                                <permTag:perm funcCode="import_activity_info">
                                <a class="layui-btn layui-btn-sm" onclick="document.getElementById('import_actvt').click()">导入</a>
                                <input type="file" hidden id="import_actvt">
                                </permTag:perm>
                            </div>
                            <div style="float:right;margin: 3px 0 0 5px">
                                <permTag:perm funcCode="add_actvt_btn">
                                     <button type="button" id="add_actvt" class="layui-btn layui-btn-sm layui-btn-normal">新增活动</button>
                                </permTag:perm>
                                    </div>
                            <div style="float:right;margin-top:3px">
                            <permTag:perm funcCode="export_actvt_info">
                                <button type="button" id="actvt_export" class="layui-btn layui-btn-sm layui-btn-normal">导出</button>
                            </permTag:perm>
                            </div>
                            <div style="float:right;margin-top:3px;margin-right:5px">
                                <permTag:perm funcCode="batch_delete_info">
                                    <button type="button" id="batch_delete_info" class="layui-btn layui-btn-sm layui-btn-danger">批量删除</button>
                                </permTag:perm>
                            </div>
                        </ul>
                        <div class="layui-tab-content" id="issue_processing_div" style="">
                            <table id="before_actvt_table" lay-filter="before_actvt_table"></table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="exportActvtInfotpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="exportActvtInfoForm_producttpl"  lay-filter="exportActvtInfoForm_producttpl" autocomplete="off">
                        <div class="layui-form-item" notNull>
                            <label class="layui-form-label">开始时间</label>
                            <div class="layui-input-block">
                                <input name="beginTime" id="beginTime_export_actvt_tpl" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" notNull>
                            <label class="layui-form-label">结束时间</label>
                            <div class="layui-input-block">
                                <input name="endTime" id="endTime_export_actvt_tpl" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">导出类型</label>
                            <div class="layui-input-block">
                                <select name="Export_Type" id="Export_Type">
                                    <option value='1'>未开始<option>
                                    <option value='2'>进行中<option>
                                    <option value='3'>已结束<option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="processactvtBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
<script type="text/html" id="tb_addupdate">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="addOrEditActvtForm_tort" lay-filter="addOrEditActvtForm_tort">
            <input type="hidden" name="id" name="id">
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">活动价</label>
                <div class="layui-input-block">
                    <input name="activityPrice" class="layui-input"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">活动数量</label>
                <div class="layui-input-block">
                    <input name="activityQuantity"  class="layui-input"/>
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label">开始时间</label>
                <div class="layui-input-block">
                    <input name="beginTime" id="actvt_start_time"  class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">结束时间</label>
                <div class="layui-input-block">
                    <input name="endTime" id="actvt_end_time" class="layui-input">
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/activityRegistration.js"></script>
