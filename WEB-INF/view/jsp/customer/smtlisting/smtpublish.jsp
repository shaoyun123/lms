<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <!-- 富文本样式 -->
            <link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
            <link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
            <title>速卖通刊登</title>
            <style>
                #smt_publish_search_form .layui-form-switch {
                    margin-top: 4px !important;
                    margin-left: 10px;
                }

                /* #smt_publish_search_form .layui-row>div {
                    margin-bottom: 10px;
                } */

                #smt_publish_search_form .labelSelect {
                    padding: 0 0 0 15px;
                    width: 95px;
                }

                #smt_publish_search_form .labelSelectMore {
                    padding: 0 0 0 5px;
                    width: 105px;
                }

                #smt_publish_search_form .labelSelectMoreMore {
                    padding: 0 0 0 15px;
                    width: 155px;
                }

                #smt_publish_search_form .labelSel{
                    padding: 0 0 0 15px;
                    width: 95px;
                }

                #smt_publish_search_form .input-block-ml {
                    margin-left: 170px;
                }

                .smt_publish_form_btns {
                    display: flex;
                    align-items: center;
                }

                #smtPublish_extImg {
                    overflow: hidden
                }

                #smtPublish_extImg li {
                    float: left;
                    margin-right: 10px
                }

                #smt_publish_search_form .layui-form-item {
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

                #smtPublish_table th,
                #smtPublish_table td {
                    text-align: center;
                    padding: 5px 0;
                    white-space: normal;
                    overflow: visible;
                    word-wrap: break-word;
                }

                .smtPublish_table_head table,
                .smtPublish_table_body table {
                    width: 100%;
                    margin: 0;
                    table-layout: fixed;
                }

                .smtPublish_subImg_UL li {
                    float: left;
                    margin: 5px
                }

                .dis_flex {
                    display: flex;
                    justify-content: space-between;
                }

                .flex-center{
                    display: flex;
                    align-items: center;
                }

                .dis_flex_start {
                    display: flex;
                    justify-content: flex-start;
                }

                .smtPulish_listDetailTpl_container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 20%);
                }

                .smtPulish_listDetailTpl_container .smtPublish_mentalProperty_checkbox {
                    height: 32px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .smtPulish_span_lh32 {
                    line-height: 32px;
                }

                img.smtPublish_imgCss {
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                    padding: 1px;
                    margin: auto;
                }

                div .findGoods {
                    width: 60px;
                    height: 60px;
                }

                div .epz_out {
                    position: relative !important;
                    border: 1px solid #ccc;
                }

                .smtPublish_subImg_UL .ImgDivOut {
                    position: relative;
                }

                .smtPublish_table_hide_rows {
                    display: none;
                }

                .redStar:before {
                    content: "*";
                    color: red;
                    font-size: 20px;
                    padding: 5px;
                }

                .mt10 {
                    margin-top: 10px;
                }

                .smtpublish_imgBorder {
                    margin: 10px;
                    border: 1px solid rgb(204, 204, 204);
                }

                #layernewsmtpublish .layui-form-label {
                    width: 180px;
                }

                #layernewsmtpublish .layui-input-block {
                    margin-left: 210px;
                }

                .smtPublish_input_notetext {
                    line-height: 29px;
                    font-size: 12px;
                    color: gray;
                }

                /* 时间线树 */
                #smtPulish_listDetailTpl_TimeLineTree {
                    position: fixed;
                    z-index: 1000;
                    right: 20px;
                    top: 50px;
                }
                #smtPublish_editDetailForm .unit{
                    font-weight: bold;
                    font-size: 16px;
                }

                #smtPulish_listDetailTpl_TimeLineTree li {
                    padding: 6px 15px;
                }

                #smtPulish_listDetailTpl_TimeLineTree li a,
                #smtPulish_listDetailTpl_TimeLineTree li i {
                    color: #1e9fff;
                }

                .smtPublish-batchPublish-multi .xm-select-parent {
                    width: 400px;
                }

                .smtPublish-checkbox-other-input {
                    width: auto;
                    height: 25px;
                }


                .smtpublish-checkboxGrid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 25%);
                }

                .smtpublish-checkboxGrid span {
                    height: 25px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .smtTemplatefont {
                    color: red;
                    font-size: 40px;
                    margin: 20px;
                }

                .smtPublish-dropdown {
                    position: relative;
                    display: inline-block;
                }

                .smtPublish-dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 160px;
                    border: 1px solid #ebeef5;
                    border-radius: 4px;
                    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
                    padding: 12px 0;
                }

                .smtPublish-dropdown-content div:hover {
                    background-color: #f1f1f1;
                    color: #009688;
                }

                .smtPublish-dropdown-content div {
                    padding: 0 16px;
                    line-height: 38px;
                    font-size: 13px;

                }

                .smtPublish-dropdown:hover .smtPublish-dropdown-content {
                    display: block;
                    z-index: 99;
                }

                .smtPublish-desc-pc-info .layui-input {
                    width: 120px;
                }

                .smtPulish-rowFlexClass,
                .smtPulish-rowFlexClassText {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    border: 1px solid #eee;
                    align-items: center;
                    font-size: 16px;
                }

                .smtPulish-rowFlexClass {
                    height: 120px;
                }

                .smtPulish-rowFlexClassText {
                    height: 240px;
                }

                .smtPulish-rowFlexLeft {
                    width: 120px;
                    text-align: center;
                    height: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    padding: 20px 0;
                }

                .smtPulish-rowFlexClass .smtPulish-textFlexCloumn {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }

                .smtPulish-rowFlexClass .smtPulish-textClass {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    font-size: 14px;
                    color: #333;
                    line-height: 26px;
                    white-space: pre-wrap;
                }

                .smtPulish-textTplClass{
                    overflow-y: scroll;
                    height: 200px;
                    font-size: 14px;
                    color: #333;
                    line-height: 26px;
                    padding: 10px;
                    border: 1px solid #e6e1e1;
                    white-space: pre-wrap;
                }

                .smtPulish-mult-ellipsis-1 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    font-size: 14px;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                .smtPulish-rowFlexClass_line_content {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                }

                .smtPulish-rowFlexRight {
                    width: 120px;
                    text-align: center;
                    align-items: center;
                }

                .smtPulish-rowflexline {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    font-size: 12px;
                }

                .smtPublish-desc-label {
                    width: 100%;
                    line-height: 40px;
                    font-size: 14px;
                }

                .smtPublish-desc-textarea {
                    min-height: 306px;
                    height: 306px;
                    display: block;
                    resize: vertical;
                    padding: 5px 15px;
                    line-height: 1.5;
                    box-sizing: border-box;
                    width: 100%;
                    font-size: inherit;
                    color: #606266;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
                }

                .smtPublish-skuInfo-row-width {
                    min-width: 200px;
                }

                .smtPublish-skuInfo-row-padding {
                    padding: 9px 0;
                }

                .smtPublish-skuInfo-row-ml {
                    margin-left: 85px;
                }
                .smtpublish_tplimg_grid{
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 16.6%);
                }
                #smtPublish_SubSkuInfo2 .uploadLocalSkuImg{
                    width: 70px;
                    position: absolute;
                    left: 15px;
                    opacity: 0;
                }
                #smtPublish_editDetail_video .layui-icon{
                    margin-top: 0;
                    right: 0;
                }
                #layernewsmtpublish .selfImgIcon {
                    color: red;
                    width: 10px;
                    padding-top: 40px;
                    font-size: 12px;
                    margin-left: 1px;
                }
                .uploadQualificationInfo{
                    position: absolute;
                    left: 0;
                    width: 94px;
                    height: 30px;
                    opacity: 0;
                }
                .smtPublish_orange_notetext {
                    line-height: 29px;
                    font-size: 12px;
                    color: #e1935e;
                }
                #smtPublish_qualificationInfoView  .layui-form-label{
                    width: 140px;
                    padding: 9px 15px 9px 0;
                }
                #smtPublish_qualificationInfoView  .layui-input-block{
                    margin-left: 160px;
                }

                .w200 {
                    width: 200px;
                }

                .priceUs {
                    margin-left: 5px;
                    margin-bottom: 10px;
                }

                .text-red {
                    color: red;
                }
                .text-bold{
                    font-weight: bold;;
                }
                .ml-45{
                    margin-left: 45px;
                }

                .ae_half_manage_table_join {
                    display: block;
                }

                .ae_half_manage_table_not_join {
                    display: none;
                }

                .color_blue .layui-this {
                    color: #1E9FFF;
                }

                .smt_publist_toolbar .layui-form-onswitch {
                    border-color: #009688;
                    background-color: #009688;
                }
                .flex{
                    display: flex;
                    align-items: center;
                }
                .ml-4{
                    margin-left: 4px;
                }
                .ml-20{
                    margin-left: 20px;
                }
                .mt-10{
                    margin-top: 10px;
                }
                .p-20{
                    padding: 20px;
                }
            </style>
            <div class="layui-fluid" id="smt_publish">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form action="" class="layui-form" id="smt_publish_search_form" lay-filter="smt_publish_search_form">
                                    <div class="layui-form-item layui-row">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select id="smtPublish_group_sel" name="orgId"
                                                    lay-filter="orgs_hp_smtPersion_pb" class="orgs_hp_custom"
                                                    lay-search>
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">销售员</label>
                                            <div class="layui-input-block">
                                                <select id="smtPublish_salesman_sel" name="salePersonId"
                                                    lay-filter="users_hp_smtPersion_pb" lay-search
                                                    class="users_hp_custom" data-roleList="smt专员">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctId" data-platcode="aliexpress" xm-select-search
                                                    id="smtPublish_storeAcct_sel" lay-filter="smtPublish_storeAcct_sel"
                                                    xm-select="smtPublish_storeAcct_sel" xm-select-search-type="dl"
                                                    xm-select-skin="normal" class="store_hp_custom">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">在售状态</label>
                                            <div class="layui-input-block">
                                                <select name="isSales" xm-select="smt_publish_isSales"
                                                    lay-filter="smt_publish_isSales">
                                                    <option value="">全部</option>
                                                    <option value="2" selected>全部在售</option>
                                                    <option value="1" selected>部分在售</option>
                                                    <option value="0">全部停售</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg4 layui-col-md4">
                                            <div class="layui-form-label labelSelect">
                                                <select name="searchType">
                                                    <option value="pSku">父SKU</option>
                                                    <option value="sSku">子SKU</option>
                                                    <option value="cnTitle">中文标题</option>
                                                    <option value="enTitle">英文标题</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md10 layui-col-lg10">
                                                    <input name="searchValue" class="layui-input" autocomplete="off" value=""
                                                        placeholder="父子sku支持多个查询,以','隔开">
                                                </div>
                                                <div class="layui-col-md2 layui-col-lg2">
                                                    <input type="checkbox" name="isExactQuery" lay-skin="switch"
                                                        lay-text="精确|模糊">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">侵权状态</label>
                                            <div class="layui-input-block">
                                                <select name="tortBanListing">
                                                    <option value="">全部</option>
                                                    <option value="SMT_TORT">SMT侵权</option>
                                                    <option value="SMT_NOT_TORT" selected>SMT不侵权</option>
                                                    <option value="ANY_PLAT">所有平台都不侵权</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">禁售状态</label>
                                            <div class="layui-input-block">
                                                <select name="isProhibit">
                                                    <option value="">全部</option>
                                                    <option value="true">禁售</option>
                                                    <option selected value="false">非禁售</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">图片状态</label>
                                            <div class="layui-input-block">
                                                <select name="imgStatusList" xm-select="smt_publish_imgStatusList">
                                                    <option value="">全部</option>
                                                    <option value="1" selected>有图</option>
                                                    <option value="2" selected>部分</option>
                                                    <option value="3">无图</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div id="smtPublish_searchTpl_special_linkage"></div>
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <label class="layui-form-label labelSelectMoreMore">
                                                <select name="auditTimeLabel">
                                                    <option value="baseModelAuditTime">审核时间</option>
                                                    <option value="baseModelTime">基础模板创建时间</option>
                                                    <option value="smtModelTime">速卖通模板创建时间</option>
                                                </select>
                                            </label>
                                            <div class="layui-input-block input-block-ml">
                                                <input type="text" class="layui-input"
                                                    id="smtPublish_searchTpl_auditTime" name="auditTime">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">排序</label>
                                            <div class="layui-input-block">
                                                <select name="orderByType" lay-search>
                                                    <option value="1">审核时间倒序</option>
                                                    <option value="2">审核时间正序</option>
                                                    <option value="3">创建时间倒序</option>
                                                    <option value="4">创建时间正序</option>
                                                    <option value="5">SMT30天销量倒序</option>
                                                    <!-- <option value="6">SMT30天销量正序</option> -->
                                                    <option value="7">公司30天销量倒序</option>
                                                    <!-- <option value="8">公司30天销量正序</option> -->
                                                    <option value="9">shopee30天销量倒序</option>
                                                    <option value="10">全托管30天销量倒序</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2 smtpublish_preAvailableStockType">
                                            <div class="layui-form-label labelSel" style="display:flex;width:160px;">
                                                <select name="preAvailableStockType">
                                                    <option value="1">预计可用库存含在途</option>
                                                    <option value="2">预计可用库存不含在途</option>
                                                </select>
                                                <select name="preAvailableAllSku">
                                                    <option value="true">全部属性</option>
                                                    <option value="false">部分属性</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block" style="margin-left: 180px;">
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input name="preAvailableStockMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                                </div>
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input name="preAvailableStockMax" autocomplete="off" class="layui-input inputRad">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 unlistingTempCon">
                                            <label class="layui-form-label">暂不刊登</label>
                                            <div class="layui-input-block">
                                                <select name="unlistingTemp">
                                                    <option value="">全部</option>
                                                    <option value="false" selected>否</option>
                                                    <option value="true">是</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2 salesCountType">
                                            <div class="layui-form-label labelSelectMore">
                                                <select name="salesCountType">
                                                    <option value="1">SMT销量</option>
                                                    <option value="2">公司销量</option>
                                                    <option value="3">全托管销量</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input name="minSalesCount" type="number" autocomplete="off" class="layui-input">
                                                </div>
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input name="maxSalesCount" type="number" autocomplete="off" class="layui-input">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 smtpublish_isLongDeliveryCategory">
                                            <label class="layui-form-label">是否长发货期类目</label>
                                            <div class="layui-input-block">
                                                <select name="isLongDeliveryCategory">
                                                    <option value=""></option>
                                                    <option value="true">是</option>
                                                    <option value="false">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block clearfix smt_publish_form_btns">
                                                <span id="smt_publish_search_submit" lay-submit
                                                    class="layui-btn layui-btn-sm"
                                                    lay-filter="smt_publish_search_submitFilter">搜索</span>
                                                <a class="layui-btn layui-btn-sm layui-btn-primary" type="reset"
                                                    id="smt_publish_search_reset"
                                                    lay-filter="smt_publish_search_reset">清空</a>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div id="smtPublish_cateDiv"></div>
                            </div>
                        </div>
                        <div class="layui-card" id="smtPublishCard">
                            <div class="layui-tab" lay-filter="smt_publish_tab">
                                <div class="layui-card-header">
                                    <div class="fixTab">
                                    <ul class="layui-tab-title color_blue">
                                        <li data-value="-2" class="layui-this" id="smtPublish_tplNum">
                                        速卖通模板(<span>0</span>)</li>
                                        <li data-value="0" id="smtPublish_toListingNum">待刊登(<span>0</span>)</li>
                                        <li data-value="3" id="smtPublish_listingNum">刊登中(<span>0</span>)</li>
                                        <li data-value="1" id="smtPublish_listingSuccNum">刊登成功(<span>0</span>)</li>
                                        <li data-value="2" id="smtPublish_listingFailNum">刊登失败(<span>0</span>)</li>
                                    </ul>
                                    <div id="smtPublish_tab_leftBtns">
                                    </div>
    </div>
                                </div>
                            <div class="layui-card-body">
<%--                                <div class="layui-tab" lay-filter="smt_publish_tab">--%>
<%--                                    <div class="fixTab">--%>
<%--                                        <ul class="layui-tab-title">--%>
<%--                                            <li data-value="-2" class="layui-this" id="smtPublish_tplNum">--%>
<%--                                                速卖通模板(<span>0</span>)</li>--%>
<%--                                            <li data-value="0" id="smtPublish_toListingNum">待刊登(<span>0</span>)</li>--%>
<%--                                            <li data-value="3" id="smtPublish_listingNum">刊登中(<span>0</span>)</li>--%>
<%--                                            <li data-value="1" id="smtPublish_listingSuccNum">刊登成功(<span>0</span>)</li>--%>
<%--                                            <li data-value="2" id="smtPublish_listingFailNum">刊登失败(<span>0</span>)</li>--%>
<%--                                        </ul>--%>
<%--                                        <div id="smtPublish_tab_leftBtns">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show-2 layui-show" style="margin-bottom: -45px;">
                                            <!-- 速卖通模板 -->
                                            <table id="smt_publish_tpl_table" lay-filter="smt_publish_tpl_table"
                                                class="layui-table"></table>
                                        </div>
                                        <div class="layui-tab-item layui-show0" style="margin-bottom: -45px;">
                                            <table id="smt_publish_tolisting_table"
                                                lay-filter="smt_publish_tolisting_table" class="layui-table"></table>
                                        </div>
                                        <div class="layui-tab-item layui-show3" style="margin-bottom: -45px;">
                                            <table id="smt_publish_listing_table" lay-filter="smt_publish_listing_table"
                                                class="layui-table"></table>
                                        </div>
                                        <div class="layui-tab-item layui-show1" style="margin-bottom: -45px;">
                                            <table id="smt_publish_listingsucc_table"
                                                lay-filter="smt_publish_listingsucc_table" class="layui-table"></table>
                                        </div>
                                        <div class="layui-tab-item layui-show2" style="margin-bottom: -45px;">
                                            <table id="smt_publish_listingfail_table"
                                                lay-filter="smt_publish_listingfail_table" class="layui-table"></table>
                                        </div>
                                        <!-- <div id="smtPublish_pagination" class="customPagination"></div> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script type="text/html" id="smtPublish_searchTpl_special">
           {{# if(d.status==-2){ }}
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">开发专员</label>
                    <div class="layui-input-block">
                        <select name="bizzOwnerId" lay-search>
                            <option value="">开发专员角色</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">开发类型</label>
                    <div class="layui-input-block">
                        <select name="devType" lay-search id="smt_publish_devType">
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">生成状态</label>
                    <div class="layui-input-block">
                        <select name="isListing" lay-search>
                            <option value="">全部</option>
                            <option value="true">已生成</option>
                            <option value="false" selected>未生成</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">刊登状态</label>
                    <div class="layui-input-block">
                        <select name="syncStatus" lay-search>
                            <option value="">全部</option>
                            <option value="true">已刊登</option>
                            <option value="false" selected>未刊登</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSelectMore">
                        <select name="logisticsType">
                            <option value="1">物流属性与</option>
                            <option value="2">物流属性或</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <select id="smt_publish_logisticsSelect"
                            xm-select="smt_publish_logisticsSelect" xm-select-search
                            xm-select-search-type="dl" name="logisAttrs"
                            xm-select-skin="normal"></select>
                    </div>
                </div>

                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                        <select name="prodAttrList" lay-search>
                        </select>
                    </div>
                </div>

                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">SMT类目</label>
                    <div class="layui-input-block">
                        <a class="layui-btn layui-btn-primary layui-btn-sm"
                            id="smtPublish_selectCateBtn">选择类目</a>
                        <i class="layui-icon layui-icon-delete"
                            onclick="clearCate('smtPublish_cateDiv','smtPublish_cateId')"
                            style="cursor:pointer" title="删除产品类目"></i>
                        <input type="hidden" id="smtPublish_cateId" name="cateId">
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">OA新类目</label>
                    <div class="layui-input-block">
                        <input name="oaCateIdList" id="smtpublish_newcate" class="layui-input">
                    </div>
                </div>

                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">重量</label>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <input type="number" name="minWeight" placeholder="g"
                                autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input type="number" name="maxWeight" placeholder="g"
                                autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label labelSelectMore">
                        <select name="priceType">
                            <option value="1">($)刊登预估价</option>
                            <option value="2">(￥)刊登预估价</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <input type="number" name="minSalePrice" placeholder="$"
                                autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input type="number" name="maxSalePrice" placeholder="$"
                                autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">可用视频</label>
                    <div class="layui-input-block">
                        <select name="usefulVideo" lay-search >
                            <option value="">请选择</option>
                            <option value="true">有</option>
                            <option value="false">无</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">刊登覆盖</label>
                    <div class="layui-input-block">
                        <select name="isUpStandard" lay-search>
                        <option value="">全部</option>
                        <option value="true">达标</option>
                        <option value="false">不达标</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2" >
                    <label class="layui-form-label">模板创建人</label>
                    <div class="layui-input-block">
                        <select name="tplCreatorId" lay-search>
                            <option value="">请选择</option>
                            {{# layui.each(d.tplCreatorList,function(index,item){ }}
                                <option value="{{item.id}}">{{item.loginName}}</option>
                            {{# }) }}
                        </select>
                    </div>
                </div>
            {{# } }}
            {{# if(d.status!=-2){ }}
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">刊登创建人</label>
                    <div class="layui-input-block">
                        <select name="listingCreatorId" lay-search>
                            <option value="">请选择</option>
                            {{# layui.each(d.publishCreatorList,function(index,item){ }}
                                <option value="{{item.id}}">{{item.user_name}}</option>
                            {{# }) }}
                        </select>
                    </div>
                </div>
            {{# } }}
        </script>

            <!--tab left btns -->
            <script type="text/html" id="smtPublish_tab_leftBtns_Tpl">
            {{# if(d=='0'){ }}
            <permTag:perm funcCode="smtPublish_publish_rightNow">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_publish()">立即刊登</button>
            </permTag:perm>
            <permTag:perm funcCode="smtPublish_publish_onTime">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_publish_onTime()">定时刊登</button>
            </permTag:perm>
            {{# } }}
            {{# if(d=='3'){ }}
            <permTag:perm funcCode="smtPublish_publish_onTime_cancel">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_publish_onTime_cancel()">取消定时刊登</button>
            </permTag:perm>
            {{# } }}
            {{# if(d=='2'){ }}
            <permTag:perm funcCode="smtPublish_publish_again">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_publish()">重新刊登</button>
            </permTag:perm>
            {{# } }}
            {{# if(d=='0'|| d=='2' ){ }}
            <permTag:perm funcCode="smtPublish_publish_delete">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_del()">删除</button>
            </permTag:perm>
            {{# } }}
            {{# if(d=='-2'){ }}
            <permTag:perm funcCode="smtPublish_publish_preserveCategory">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_publish_preserveCategory()">维护长发货期类目</button>
            </permTag:perm>
            {{# } }}
            {{# if(d=='-2' ){ }}
<%--            <permTag:perm funcCode="smtPublish_unlistingTemp_batch">--%>
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_batchUnlistingTemp()">批量设置暂不刊登</button>
<%--            </permTag:perm>--%>
            <permTag:perm funcCode="smtPublish_publish_batch">
                <button class="layui-btn layui-btn-sm" type="button" onclick="smtPublish_batchPublish()">批量生成</button>
            </permTag:perm>
            {{# } }}

        </script>

            <!-- 速卖通模板table相关的 -->
            <!-- 商品 -->
            <script type="text/html" id="smtPublish_cnTitleTpl">
            {{#  if(d.devType=='1'){ }}
        <span style="color: grey">[wish开发]</span><br>
    {{#  } else if(d.devType=='2') { }}
        <span style="color: grey">[供应商新品]</span><br>
    {{#  } else if(d.devType=='3') { }}
        <span style="color: grey">[ebay开发]</span><br>
    {{#  } else if(d.devType=='4') { }}
        <span style="color: grey">[smt开发]</span><br>
    {{#  } else if(d.devType=='5') { }}
        <span style="color: grey">[阿里销售产品]</span><br>
    {{#  } else if(d.devType=='6') { }}
        <span style="color: grey">[采集爆款开发]</span><br>
    {{#  }else{ }}
    {{#  } }}

    <span>{{d.cnTitle}}
    	{{#  if(d.isSupplierOrigiImg){ }}
	    <span class="layui-bg-blue hp-badge ml5" title="供应商原图">供</span>
	    {{#  } }}
	    {{#  if(d.selfImgStatus == 1){ }}
	    <span class="layui-bg-red hp-badge ml5" title="有自拍图">自</span>
	    {{#  } }}
        {{#  if(d.mackRefineStatus == true){ }}
            {{#  if(d.selfImgStatus== 1 || d.selfImgStatus == 2){   }}
                <span class="layui-bg-green hp-badge ml5" title="精修商品">精</span>
            {{#  } }}
	    {{#  } }}
    </span>
    <br>
    <span>
        <span style="color:#999;">开发：</span>{{d.bizzOwner || ""}}
    </span>
    <br>
    <span>
        <span style="color:#999;">SMT类目：</span>{{d.cateTreeName || ""}}
    </span>
    <div><span style="color: #999;">模板创建人：</span>{{d.tplCreators || ""}}</div>
    <div><span style="color: #999;">模板修改人：</span>{{d.tplModifier || ""}}</div>
    </script>

            <!-- subSku -->
            <script type="text/html" id="smtPublish_producttpl">
            <table id="smtPublish_intable_tpl" style="text-align:center;width: 100%">
                <tbody>
                    {{# if(d.subList&&d.subList.length>0){ }}
                        {{# for(var i =0; i < d.subList.length; ++i) { var $value = d.subList[i] }}
                        {{# if (i<7) { }}
                        <tr>
                            {{# } else { }}
                        <tr  class="myj-hide">
                            {{# } }}
                            <td width='40%' style="text-align: left;padding-left: 10px;">
                            <span>{{ $value.prodTempVarietyDto?$value.prodTempVarietyDto.sSku : ''}}</span>
                            {{# if($value.syncStatus){ }}
                                <span class="layui-bg-green hp-badge ml5 smtPublish_status smtPublish-listsucc">已</span>
                            {{#  }  }}
                            {{# if($value.syncStatus.toString()=='false'){ }}
                            <span class="layui-bg-orange hp-badge ml5 smtPublish_status smtPublish-listsucc">未</span>
                            {{# } }}
                            </td>
                            <td width='10%'>{{ $value.prodTempVarietyDto?$value.prodTempVarietyDto.weight : '' }}</td>
                            <td width='10%'>
                                {{# if($value.prodTempVarietyDto&&$value.prodTempVarietyDto.id){ }}
                                    <span class="canClickEl" onclick="tpl_listReferPrice({{ $value.prodTempVarietyDto.id}})">{{$value.prodTempVarietyDto? $value.prodTempVarietyDto.cost : ''}}</span>
                                {{# } }}
                            </td>
                            <td width='30%'>
                                    {{ $value.prodTempVarietyDto && $value.prodTempVarietyDto.preAvailableStockAll || 0 }}/{{ $value.prodTempVarietyDto && $value.prodTempVarietyDto.preAvailableStock || 0}}
<%--                                {{ (($value.prodTempVarietyDto && $value.prodTempVarietyDto.stockNum !=undefined ?$value.prodTempVarietyDto.stockNum : 0) - ($value.prodTempVarietyDto && $value.prodTempVarietyDto.reservationNum !=undefined ?$value.prodTempVarietyDto.reservationNum : 0))  + '/' + ($value.prodTempVarietyDto && $value.prodTempVarietyDto.orderNotInNum !=undefined ? $value.prodTempVarietyDto.orderNotInNum : '') + '/' + ($value.prodTempVarietyDto && $value.prodTempVarietyDto.lackUnPaiNum !=undefined ?$value.prodTempVarietyDto.lackUnPaiNum : '') }}--%>
                            </td>
                            <td width='10%'>
                                {{# if ($value.prodTempVarietyDto&&$value.prodTempVarietyDto.isSale){}}
                                <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled" lay-skin="primary">
                                    <i class="layui-icon layui-icon-ok"></i>
                                </div>
                                {{# } else{ }}
                                <div class="layui-unselect layui-form-checkbox layui-checkbox-disbaled layui-disabled"
                                     lay-skin="primary">
                                    <i class="layui-icon layui-icon-ok"></i>
                                </div>
                                {{# } }}
                            </td>
                        </tr>
                        {{# } }}
                        {{# } }}
                    </tbody>
                </table>
                {{#  if(d.subList&&d.subList.length > 7) { }}
                <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{d.subList.length}})</a>
                {{# } }}
        </script>

            <!-- 刊登状态 -->
            <script type="text/html" id="smtPublish_storeNumTpl">
            <span  style="color:#999;">刊登数:</span>
            <a href="javascrpt:;" style="color:blue" onclick="producttpl_getListingStatus({{ d.prodPId }},'aliexpress')">{{ d.storeNum||0}}</a>
            <i title="打开速卖通商品" class="layui-icon" style="color: #009688;cursor: pointer;" lay-event="smtPublish_openItem">&#xe615;</i>
        </script>

            <!-- 销量 -->
            <script type="text/html" id="smtPublish_salesNumTpl">
            <span  style="color:#999;">SMT:</span> {{ d.smtSalesNum || 0}}<br>
            <span  style="color:#999;">公司:</span> {{ d.totalSalesNum || 0}}<br>
            <span  style="color:#999;">全托管:</span> {{ d.fullManageSalesNum || 0}}<br>
            <span  style="color:#999;">竞品:</span> <a href="javascrpt:;" style="color:blue" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}',function(){openSmtComp({{d.prodPId}})})">{{ d.compSalesNum||0}}</a>
        </script>

            <!-- 侵权状态 -->
            <script type="text/html" id="smtPublish_tortTpl">
            <div style="text-align:left; line-height:13px" class="layui-form">
                {{#  if(d.isListingAble == false){ }}
                <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" checked lay-filter="smtPublish_prohibit" value="{{d.prodPId}}">
                {{#  }else{ }}
                <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" lay-filter="smtPublish_prohibit" value="{{d.prodPId}}">
                {{#  } }}
                <br><br>
                {{#  if(d.isWishTort){ }}
                <input type="checkbox" checked disabled title="wish" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="wish" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.wishTortReason ? d.wishTortReason : ''}}</span><br>

                {{#  if(d.isJoomTort){ }}
                <input type="checkbox" checked disabled title="joom" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="joom" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.joomTortReason ? d.joomTortReason : ''}}</span><br>

                {{#  if(d.isEbayTort){ }}
                <input type="checkbox" checked disabled title="ebay" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="ebay" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span><br>

                {{#  if(d.isAmazonTort){ }}
                <input type="checkbox" checked disabled title="amazon" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="amazon" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span><br>

                {{#  if(d.isSmtTort){ }}
                <input type="checkbox" checked disabled title="smt" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="smt" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.smtTortReason ? d.smtTortReason : ''}}</span><br>

                {{#  if(d.isShopeeTort){ }}
                <input type="checkbox" checked disabled title="shopee" lay-skin="primary">
                {{#  }else{ }}
                  <input type="checkbox" disabled  title="shopee" lay-skin="primary">
                {{#  } }}
                <span class="w_50 inline_table hv20 small_apn">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span><br>
            </div>
        </script>
            <!-- 时间 -->
            <script type="text/html" id="smtPublish_timeTpl">
            <span  style="color:#999;float: left;">&nbsp;&nbsp;审&nbsp;&nbsp;&nbsp;核:</span> {{ Format(d.auditTime, "yyyy-MM-dd")}}<br>
            <span  style="color:#999;float: left;">&nbsp;&nbsp;自拍图:</span> {{ Format(d.selfImgTime, "yyyy-MM-dd")}}<br>
            <span  style="color:#999;float: left;">&nbsp;&nbsp;SMT模板修改:</span> {{ Format(d.tplModifyTime, "yyyy-MM-dd")}}<br>
            <!-- <span  style="color:#999;float: left;">最后上架:</span>   {{#  if(d.gmtCreate){ }} {{ Format(d.gmtCreate, "yyyy-MM-dd")}}<br>  {{# } }} -->
        </script>

            <!-- 刊登table相关 -->
            <!-- table缩略图 -->
            <script type="text/html" id="smt_publish_img_tpl">
            <input type="hidden" class="id{{d.id||d.modelPId}}" />
            <input type="hidden" class="sku{{d.pSku}}" />
            <div class="imgDiv sell-hot-icon-box" style="margin-right: 0px;">
                <div class="findGoods epz-out">
                    {{#if(d.pImage !=null){ }}
                    <img class="img_show_hide smtPublish_imgCss lazy" data-original="{{d.pImage}}" style="display: block;" data-onerror="layui.admin.img_noFind()"> {{# } }}
                </div>
            </div>
        </script>

            <!-- 商品名 -->
            <script type="text/html" id="smt_publish_title_tpl">
            {{#  if(d.devType=='1'){ }}
            <span style="color: grey">[wish开发]</span><br>
        {{#  } else if(d.devType=='2') { }}
            <span style="color: grey">[供应商新品]</span><br>
        {{#  } else if(d.devType=='3') { }}
            <span style="color: grey">[ebay开发]</span><br>
        {{#  } else if(d.devType=='4') { }}
            <span style="color: grey">[smt开发]</span><br>
        {{#  } else if(d.devType=='5') { }}
            <span style="color: grey">[阿里销售产品]</span><br>
        {{#  } else if(d.devType=='6') { }}
            <span style="color: grey">[采集爆款开发]</span><br>
        {{#  }else{ }}
        {{#  } }}

        <span>{{d.cnTitle}}
            {{#  if(d.isSupplierOrigiImg){ }}
            <span class="layui-bg-blue hp-badge ml5" title="供应商原图">供</span>
            {{#  } }}
            {{#  if(d.selfImgStatus == 1){ }}
            <span class="layui-bg-red hp-badge ml5" title="有自拍图">自</span>
            {{#  } }}
            {{#  if(d.mackRefineStatus == true){ }}
                {{#  if(d.selfImgStatus== 1 || d.selfImgStatus == 2){   }}
                    <span class="layui-bg-green hp-badge ml5" title="精修商品">精</span>
                {{#  } }}
            {{#  } }}
        </span>
        <br>
        </script>

            <!-- 开发专员 -->
            <script type="text/html" id="smt_publish_bizzOwner_tpl">
            {{# if(d.bizzOwner){ }}
                <div>{{d.bizzOwner || ''}}>{{d.storeAcct || ''}}</div>
                {{# } }}
        </script>

            <!-- 父sku -->
            <script type="text/html" id="smt_publish_sku_tpl">
            <a href="javascrpt:;" id="prodDetail" data-id={{d.prodPId}} style="color:blue">{{d.prodPSku }}</a>
                {{# if(d.onlinePublishStatus) { }}
                <span class="layui-bg-green">已刊登</span>
                {{# } }}
                {{# if(d.existListing){ }}
                <span class="layui-bg-orange">已生成</span>
                {{# } }}
                <br/>
                <!-- <div class="storeSkuInfo">
                    <span>店铺父SKU:</span>
                    {{d.storePSku || ''}}
                    {{# if(d.storePSku && d.listingStatus == 0){ }}
                        <span class="layui-bg-orange hp-badge ml5 smtPublish_status smtPublish-unlist">待</span>
                    {{# }else if(d.storePSku && d.listingStatus == 1){ }}
                        <span class="layui-bg-green hp-badge ml5 smtPublish_status smtPublish-listsucc">已</span>
                    {{# }else if(d.storePSku && d.listingStatus == 2){ }}
                        <span class="layui-bg-gray hp-badge ml5 smtPublish_status smtPublish-listfail">败</span>
                        <span class="layui-hide smtPublish-listfailreason">{{d.listingRespMsg}}</span>
                    {{# }else if(d.storePSku && d.listingStatus == 3){ }}
                        <span class="layui-bg-blue hp-badge ml5 smtPublish_status smtPublish-inlist">中</span>
                    {{# } }}
                </div> -->
        </script>

            <!-- 销量 -->
            <script type="text/html" id="smt_publish_salenum_tpl">
            <div>
                7日：{{d.saleNumAliexpressSeven!='undefined' ? d.saleNumAliexpressSeven : ''}}
                <br>
                15日：{{d.saleNumAliexpressFifteen !='undefined' ? d.saleNumAliexpressFifteen : '' }}
                <br>
                30日：{{d.saleNumAliexpressThirty !='undefined' ? d.saleNumAliexpressThirty : '' }}
            </div>
        </script>

            <!-- 子表 -->
            <script type="text/html" id="smt_publish_productInfo_tpl">
            <table class="layui-table colspantable smtPublish_table_son" lay-skin="nob" id="smtPublish_data_table_son_{{d.id}}" lay-filter="smtPublish_data_table_son_{{d.id}}" >
            {{# if(d.subList&&d.subList.length){  }}
                {{# layui.each(d.subList,function(index,item){  }}
                <tr class="{{index==d.subList.length-1?'':'smtPublish_table_row'}} {{index<3?'':'smtPublish_table_hide_rows'}}" >
                    <td style="width:140px">
                        <span>
                            {{# if(item.prodSSku){ }}
                                {{item.prodSSku || ''}}
                                {{# }else{  }}
                                <font class="layui-gray">不存在</font>
                                {{# } }}
                        </span>
                        {{# if(item.prodSSku && d.listingStatus == 0){ }}
                            <span class="layui-bg-orange hp-badge ml5 smtPublish_status  smtPublish-unlist">待</span>
                        {{# }else if(item.prodSSku && d.listingStatus == 1){ }}
                            <span class="layui-bg-green hp-badge ml5 smtPublish_status smtPublish-listsucc">已</span>
                        {{# }else if(item.prodSSku && d.listingStatus == 2){ }}
                            <span class="layui-bg-gray hp-badge ml5 smtPublish_status smtPublish-listfail" title="复制" onclick="smtPublish_copyFailReason(this,event)">败</span>
                            <span class="layui-hide smtPublish-listfailreason">{{d.listingRespMsg || ''}}</span>
                        {{# }else if(item.prodSSku && d.listingStatus == 3){ }}
                            <span class="layui-bg-blue hp-badge ml5 smtPublish_status smtPublish-inlist">中</span>
                        {{# } }}
                    </td>
                    <td class="storeSubSkuInfo" style="width:145px">{{item.storeSSku || ''}}</td>
                    <td style="width:60px">{{item.prodTempVarietyDto?item.prodTempVarietyDto.color : ''}}</td>
                    <td style="width:60px">{{item.prodTempVarietyDto?item.prodTempVarietyDto.size: ''}}</td>
                    <td class="listingInfo" style="width:60px">{{item.price || ''}}</td>
                    <td class="listingInfo" style="width:60px">{{item.priceCny || ''}}</td>
                    <td style="width:50px">
                        {{# if(item.prodTempVarietyDto&&item.prodTempVarietyDto.isSale!='undefined'){ }}
                            <span class="{{item.isSale?'layui-green':'layui-gray'}} {{item.isSale?'smtPublish-isSale':'smtPublish-isNotSale'}}">{{item.prodTempVarietyDto&&item.prodTempVarietyDto.isSale? '在售':'停售'}}</span>
                        {{# } }}
                    </td>
                    <td class='smtpublish_table_preAvailableStockType' style="width:60px">{{ item.prodTempVarietyDto && item.prodTempVarietyDto.preAvailableStockAll || 0 }}/{{ item.prodTempVarietyDto && item.prodTempVarietyDto.preAvailableStock || 0}} </td>
                </tr>
                {{#  });  }}
                {{# }  }}
            </table>
            {{# if(d.subList&&d.subList.length>3){ }}
            <a href="javascript:" onclick="smtPublish_changeColspantable(this);" class="productListSkuShow"><span>+ 展开</span>({{d.subList.length}})</a>
            {{# } }}
        </script>

            <!--时间 -->
            <script type="text/html" id="smt_publish_listingTime_tpl">
            <div class="auditTime">
                {{# if(d.createTime){ }}
                    <div class="layui-green">创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>
                {{# } }}
            </div>
            <div class="listingTime">
                {{# if(d.listTiming){ }}
                    <div class="layui-green">定时刊登:{{Format(d.listTiming,'yyyy-MM-dd hh:mm:ss')}}</div>
                {{# } }}
            </div>
        </script>
            <!-- 操作 -->
            <script type="text/html" id="smt_publist_toolbar">
            <div class="layui-btn-container smt_publist_toolbar">
                {{# if(!d.hasOwnProperty('listingStatus')){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="viewTpl">查看模板</button></div>
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="goodsDetailbindTpl">生成刊登</button></div>
                <form class="layui-form">
                    <div style="font-size: 12px;display:inline-block;line-height:30px;">暂不刊登
                    {{# if(d.unlistingTemp == true){ }}
                        <input type="checkbox" data-modelPId="{{d.modelPId}}" lay-skin="switch" lay-filter="smt_publist_toolbar_checkbox" lay-text="是|否" checked>
                    {{# } else { }}
                        <input type="checkbox" data-modelPId="{{d.modelPId}}" lay-skin="switch" lay-filter="smt_publist_toolbar_checkbox" lay-text="是|否">
                    {{# } }}
                    </div>
                </form>
                {{# } }}
                {{# if(d.hasOwnProperty('listingStatus')&&d.listingStatus!='-2'){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="goodsDetail">详情</button></div>
                {{# } }}
                {{# if(d.listingStatus=='0'){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="publishListing">立即刊登</button></div>
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="publishListingOntime">定时刊登</button></div>
                {{# } }}
                {{# if(d.listingStatus=='3'){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="publishListingOntimeCancel">取消定时刊登</button></div>
                {{# } }}
                {{# if( d.listingStatus=='0'|| d.listingStatus=='2' ){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="deletelisting">删除</button></div>
                {{# } }}
                {{# if(d.listingStatus=='2'){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="publishListing">重新刊登</button></div>
                {{# } }}
            </div>
        </script>

            <!--待发布详情弹框-->
            <script type="text/html" id="smtPulish_listDetailTpl">
            <div class="layui-tab layui-tab-brief">
                <ul class="layui-tab-title">
                    <li class="layui-this">商品信息</li>
                    <li>产品详描描述</li>
                    <li>欧盟责任人和商品资质</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show">
                        <div  id="smtPulish_listDetailTpl_TimeLineTree">
                            <ul>
                                <li data-id="smtPublish_editDetail_basicInfo" onclick="smtPulish_Location(this)">
                                    <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">基本信息</a>
                                </li>
                                <li data-id="smtPublish_editDetail_mainPic" onclick="smtPulish_Location(this)">
                                    <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">主图</a>
                                </li>
                                <li data-id="smtPublish_editDetail_video" onclick="smtPulish_Location(this)">
                                    <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">商品视频</a>
                                </li>
                                <li data-id="smtPublish_editDetail_placePrice" onclick="smtPulish_Location(this)">
                                    <i class="layui-icon layui-icon-tree"></i>
                                        <a href="javascript:;">发货地 & 区域定价</a>
                                    </li>
                                <li data-id="smtPublish_editDetail_SKUInfo" onclick="smtPulish_Location(this)">
                                <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">SKU信息</a>
                                </li>
                                <li data-id="smtPublish_editDetail_otherInfo" onclick="smtPulish_Location(this)">
                                    <i class="layui-icon layui-icon-tree"></i>
                                    <a href="javascript:;">其他信息</a>
                                </li>
                            </ul>
                        </div>
                    <div style="height: calc(100vh - 172px); overflow-y: scroll;">
                            <div class="layui-row">
                                <div class="layui-col-lg12 layui-col-md12">
                                    <form action="" class="layui-form" id="smtPublish_editDetailForm"
                                        lay-filter="smtPublish_editDetailForm">
                                        <input name="storeAcctId" type="text" value="{{d.storeAcctId||''}}" hidden>
                                        <input name="prodPId" type="text" value="{{d.prodPId||''}}" hidden>
                                        <input name="ssku" type="text" hidden>
                                        <!-- 基本信息 -->
                                        <div calss="layui-card">
                                            <div class="layui-card-header" id='smtPublish_editDetail_basicInfo'>
                                                <span>基本信息</span>
                                            </div>
                                            <div class="layui-card-body">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">标题:</label>
                                                    <div class="layui-input-block ">
                                                        <div class="layui-col-md9">
                                                            <input name="title" value="{{d.title}}" class="layui-input ifFocusInput"
                                                                data-prodpid="{{d.prodPId}}">
                                                            <!-- <div>剩余字数：{{128-d.title.length}}</div> -->
                                                        </div>
                                                        <div class="layui-col-md3">
                                                            <button class="layui-btn layui-btn-sm" style="margin-left: 20px;"
                                                                type="button" onClick="smtPublish_randomTitle()">随机</button>
                                                            <button class="layui-btn layui-btn-sm" type="button"
                                                                onClick="smtPublish_restore('{{d.title}}')">还原</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">基础模板:</label>
                                                    <div class="layui-input-block flex-center" id="smtPublish_prodTitle">
                                                        {{d.prodTitle || ''}}
                                                    </div>
                                                </div>

                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">SMT分类:</label>
                                                    <div class="layui-input-block">
                                                        <div class="layui-col-md9">
                                                            <input name="smtCategoryName" value="{{d.smtCategoryName}}"
                                                                data-id="{{d.smtCategoryId}}" type="text" readonly
                                                                class="layui-input">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">分类属性:</label>
                                                    <div class="layui-input-block">
                                                        <div id="smtPulish_cag_prop"></div>
                                                        <!-- 更多選填屬性 -->
                                                        <div class="layui-form-item" id="smtPulish_cag_prop_more_label">
                                                            <label class="layui-form-label" style="color: #51bf7e;"
                                                                onclick="smtPublish_showMoreProperty()">更多选填属性</label>
                                                        </div>
                                                        <div id="smtPulish_cag_prop_more"></div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">自定义属性:</label>
                                                    <div class="layui-input-block">
                                                        <div class="disflex">
                                                            <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                                                onclick="smtPublish_addProper()">添加自定义属性</button>
                                                            <button class="layui-btn layui-btn-sm  layui-btn-danger ml10"
                                                                type="button" onclick="smtPublish_delProper()">删除全部</button>
                                                            <div class="ml10 smtPublish_input_notetext">(仅支持数字和英文，不支持其它字符)</div>
                                                        </div>
                                                        <div id="smtPublish_listDetailTpl_addproper"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 商品图片 -->
                                        <div class="layui-card">
                                            <div class="layui-card-header" id="smtPublish_editDetail_mainPic">
                                                <span>商品图片</span>
                                            </div>
                                            <div class="layui-card-body">
                                                <div class="layui-form-item">
                                                    <div class="layui-form-label">
                                                        <font color="red">*</font>主图
                                                    </div>
                                                    <div class="layui-input-block">
                                                        <div class="disflex mb10" data-maxImg="6" data-minImg="1"
                                                            data-imgObjType="1" data-id="mainwwImgContains">
                                                            <div class="uploadLocalImgBtn"></div>
                                                            <button type="button"
                                                                class="layui-btn layui-btn-sm uploadNetImgBtn ml10">网络图片</button>
                                                            <button type="button"
                                                                class="layui-btn layui-btn-sm smtPublish-uploadTplImgBtn ml10" data-limit="6">模板图片</button>
                                                            <button type="button"
                                                                class="layui-btn layui-btn-sm ml10 layui-btn-danger"
                                                                onclick="smtPublish_delAllMainImg()">删除全部</button>
                                                            <div style="line-height:30px" class="ml10">
                                                                <span class="layui-bg-red">说明!</span>
                                                                <span>需要上传的图片像素：1000*1000，且最多六张</span>
                                                            </div>
                                                        </div>
                                                        <ul class="smtPublish_subImg_UL uploadImgUL ui-sortable"
                                                            id="smtPublish_mainImages">
                                                            {{# if(d.mainImages ){ }}
                                                            {{# layui.each(d.mainImages.split(','),function(index,item){ }}
                                                            <li draggable="true"
                                                                style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden"
                                                                class="ui-sortable-handle">
                                                                <div class="ImgDivOut">
                                                                    <div class="ImgDivIn">
                                                                        <img src="{{item}}" style="height:150px;width: 150px"
                                                                            alt=""
                                                                            class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                                            title="双击即可复制路径" />
                                                                    </div>
                                                                    <div class="imgDivDown">
                                                                        <div class="disflex" style="justify-content: space-around;">
                                                                            <a class="fl" onclick="smtPublish_copyImg(this);" href="javascript:void(0);">
                                                                                复制
                                                                            </a>
                                                                            <a onclick="smtPublish_delImg(this);" href="javascript:void(0);">
                                                                                移除
                                                                            </a>
                                                                        </div>
                                                                        <div class="disflex" style="justify-content: space-around;">
                                                                            <a class="fl" onclick="smtPublish_setWhiteBgMap(this);" href="javascript:void(0);">
                                                                                设为白底图
                                                                            </a>
                                                                            <a class="fl" onclick="smtPublish_setSceneGraph(this);" href="javascript:void(0);">
                                                                                设为场景图
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            {{# }) }}
                                                            {{# } }}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-form-label"><font color="red">*</font>营销图</div>
                                                    <div class="layui-input-block disflex">
                                                        <div>
                                                            <div class="disflex mb10" data-maxImg="2" data-minImg="1"
                                                                data-imgObjType="1" data-id="marketfirstImgContains">
                                                                <div class="uploadLocalImgBtn"></div>
                                                                <button type="button"
                                                                    class="layui-btn layui-btn-sm uploadNetImgBtn ml10">网络图片</button>
    <button type="button" class="layui-btn layui-btn-sm tempImgBtn" data-imagetype="2">模板图片</button>
<%--    <button type="button" class="layui-btn layui-btn-sm autoFillImgBtn2">自动填充白底图</button>--%>
                                                                <div style="line-height:30px" class="ml10">
                                                                    <span class="layui-bg-red">说明!</span>
                                                                    <span>宽高比例必须为1:1，像素不能低于 800x800</span>
                                                                </div>
                                                            </div>
                                                            <ul class="smtPublish_subImg_UL" style="overflow: hidden;"
                                                                id="smtPublish_market1Images">
                                                                {{# if(d.market1Images){ }}
                                                                <li draggable="true"
                                                                    style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                                                    <div class="ImgDivOut">
                                                                        <div class="ImgDivIn">
                                                                            <img src="{{d.market1Images}}"
                                                                                style="height:150px;width: 150px" alt=""
                                                                                class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                                                title="双击即可复制路径" />
                                                                        </div>
                                                                        <div class="imgDivDown disflex"
                                                                            style="justify-content: space-around;">
                                                                            <div class="smtPublish_subImg_imgTop">1:1</div>
                                                                            <a class="fl" onclick="smtPublish_mattingImg(this);"
                                                                                href="javascript:void(0);">抠图</a>
                                                                            <a onclick="smtPublish_delImg(this);"
                                                                                href="javascript:void(0);">移除</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                {{# } }}
                                                            </ul>
                                                        </div>
                                                        <div class="ml20">
                                                            <div class="disflex mb10" data-maxImg="2" data-minImg="1"
                                                                data-imgObjType="1" data-id="marketsecondImgContains">
                                                                <div class="uploadLocalImgBtn"></div>
                                                                <button type="button"
                                                                    class="layui-btn layui-btn-sm uploadNetImgBtn ml10">网络图片</button>
    <button type="button" class="layui-btn layui-btn-sm tempImgBtn" data-imagetype="1">模板图片</button>
<%--    <button type="button" class="layui-btn layui-btn-sm autoFillImgBtn1">自动填充场景图</button>--%>
                                                                <div style="line-height:30px" class="ml10">
                                                                    <span class="layui-bg-red">说明!</span>
                                                                    <span>宽高比例必须为3:4，像素要求不能低于 750x1000</span>
                                                                </div>
                                                            </div>
                                                            <ul class="smtPublish_subImg_UL" style="overflow: hidden;"
                                                                id="smtPublish_market2Images">
                                                                {{# if(d.market2Images){ }}
                                                                <li draggable="true"
                                                                    style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                                                    <div class="ImgDivOut">
                                                                        <div class="ImgDivIn">
                                                                            <img src="{{d.market2Images}}"
                                                                                style="height:200px;width: 150px" alt=""
                                                                                class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                                                title="双击即可复制路径" />
                                                                        </div>
                                                                        <div class="imgDivDown disflex"
                                                                            style="justify-content: space-around;">
                                                                            <div class="smtPublish_subImg_imgTop">3:4</div>
                                                                            <a class="fl" onclick="smtPublish_copyImg(this);"
                                                                                href="javascript:void(0);">复制</a>
                                                                            <a onclick="smtPublish_delImg(this);"
                                                                                href="javascript:void(0);">移除</a>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                {{# } }}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 商品视频 -->
                                        <div class="layui-card">
                                            <div class="layui-card-header disflex" id="smtPublish_editDetail_video">
                                                <span>商品视频</span>
                                            </div>
                                            <div class="layui-card-body">
                                                <div class="layui-form-item">
                                                    <div class="layui-form-label"> </div>
                                                    <div class="layui-input-block">
                                                        <ul class="disflex" style="flex-wrap: wrap;display: flex;" id="smtPublish_editDetail_video_list">
                                                            {{# layui.each(d.videoList, function(index, videoItem){  }}
                                                            <li style="width: 220px;height: 170px;align-items: center;" class="disflex" data-id="{{videoItem.id}}" data-prodpsku="{{videoItem.sku}}" data-location="{{videoItem.location}}">
                                                                <div class="ml10">
                                                                    <input type="radio" name="checkedVideo" value="{{videoItem.location}}" {{ videoItem.checked ? "checked" : "" }} data-isfirstchecked="{{videoItem.checked ? true: false}}" data-id="{{ videoItem.id }}" data-sku="{{videoItem.sku}}" lay-filter="smtPublish_editDetail_video_checked">
                                                                </div>
                                                                <div>
                                                                    <div class="taCenter">{{ videoItem.sku }}</div>
                                                                    <div class="common_play_video" data-video="{{videoItem.location}}" style="position:absolute;background-color:rgba(0,0,0,0.1);width:150px;height:150px;cursor:pointer;">
                                                                        <i class="layui-icon layui-icon-play" style="font-size:40px;position:relative;left:55px;top:70px;color:#000;"></i>
                                                                    </div>
                                                                    <div style="border:1px solid #e6e6e6;width:150px">
                                                                        <img src="{{videoItem.picture }}!size=150x150" alt="{{ videoItem.videoname }}" width='150' height='150' />
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            {{# }) }}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 发货地 & 区域定价 -->
                                        <div class="layui-card">
                                            <div class="layui-card-header" id="smtPublish_editDetail_placePrice">
                                                <span>发货地 & 区域定价</span>
                                            </div>
                                            <div class="layui-card-body">
                                                <div class="layui-form-item">
                                                    <div class="layui-form-label">发货地</div>
                                                    <div class="layui-input-block" id="smtPublish_deliveryPlace"></div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-form-label">区域定价</div>
                                                    <div class="layui-input-block">
                                                        <div class="disflex mb5 mt10">
                                                            <input type="checkbox" lay-skin="primary" title="设置区域定价"
                                                                name="setAreaPrice" {{d.adjustPriceStatus==1 ? 'checked' : '' }}>
                                                            <select name="adjustPriceType"
                                                                lay-filter="smtPublish_adjustPriceType" placeholder="选择调价方式">
                                                                <option value="">选择调价方式</option>
                                                                <option value="1" {{d.adjustPriceType==1 ? 'selected' : '' }}>
                                                                    百分比调整
                                                                </option>
                                                                <option value="2" {{d.adjustPriceType==2 ? 'selected' : '' }}>
                                                                    金额调整
                                                                </option>
                                                                <option value="3" {{d.adjustPriceType==3 ? 'selected' : '' }}>
                                                                    直接报价
                                                                </option>
                                                            </select>
                                                            <div id="smtPublish_regionPriceTpl_div" class="{{d.adjustPriceType!=3?'hidden':''}}">
                                                                <div class="layui-form-label">国家模板</div>
                                                                <div class="layui-input-block">
                                                                    <select name="regionPriceTpl" id="smtPublish_regionPriceTpl" lay-filter="smtPublish_regionPriceTpl" lay-search></select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="layui-col-md6">
                                                                <div class="{{d.adjustPriceType==3?'hidden' :''}}">
                                                                    <table class="layui-table" id="smtPublish_placePrice_table"
                                                                lay-filter="smtPublish_placePrice_table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>发货地</th>
                                                                        <th>调价模板</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id="smtPublish_placePriceInfo">
                                                                    {{# layui.each(d.placePriceList, function(index, RowItem){
                                                                    }}
                                                                    {{# if(RowItem.placeName.includes('NONE')){ }}
                                                                    <tr data-name="{{RowItem.placeName}}">
                                                                        <td></td>
                                                                        <td>
                                                                            <select name="{{RowItem.placeName}}" lay-search
                                                                                class="smtPublish_placePrice_table_priceTpl">
                                                                                <option value="">请选择调价模板</option>
                                                                                {{#
                                                                                layui.each(RowItem.priceArr,function(_,optionItem){
                                                                                }}
                                                                                {{#
                                                                                if(d.adjustPriceType==optionItem.adjustPriceType){
                                                                                }}
                                                                                {{# if(optionItem.selected){ }}
                                                                                <option value="{{optionItem.id}}" selected>
                                                                                    {{optionItem.templateName}}</option>
                                                                                {{# }else{ }}
                                                                                <option value="{{optionItem.id}}">
                                                                                    {{optionItem.templateName}}</option>
                                                                                {{# } }}
                                                                                {{# } }}
                                                                                {{# }) }}
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                    {{# }else{ }}
                                                                    <tr data-name="{{RowItem.placeName}}">
                                                                        <td>{{RowItem.placeName}}</td>
                                                                        <td>
                                                                            <select name="{{RowItem.placeName}}" lay-search
                                                                                class="smtPublish_placePrice_table_priceTpl">
                                                                                <option value="">请选择调价模板</option>
                                                                                {{#
                                                                                layui.each(RowItem.priceArr,function(_,optionItem){
                                                                                }}
                                                                                {{#
                                                                                if(d.adjustPriceType==optionItem.adjustPriceType){
                                                                                }}
                                                                                {{# if(optionItem.selected){ }}
                                                                                <option value="{{optionItem.id}}" selected>
                                                                                    {{optionItem.templateName}}</option>
                                                                                {{# }else{ }}
                                                                                <option value="{{optionItem.id}}">
                                                                                    {{optionItem.templateName}}</option>
                                                                                {{# } }}
                                                                                {{# } }}
                                                                                {{# }) }}
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                    {{# } }}
                                                                    {{# }) }}
                                                                </tbody>
                                                            </table>
                                                                </div>
                                                                <div class="{{d.adjustPriceType != 3 ? 'hidden':''}}" id="smtPublish_placePrice_country">
                                                                    <div class="smtPulish_listDetailTpl_container"></div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- SKU信息 -->
                                        <div class="layui-card">
                                            <div class="layui-card-header" id="smtPublish_editDetail_SKUInfo">
                                                <span>SKU信息</span>
                                            </div>
                                            <div class="layui-card-body">
                                                <div class="layui-form-item layui-row">
                                                    <div class="layui-col-md2">
                                                        <div class="layui-form-label">毛利率</div>
                                                        <div class="layui-input-block disflex"><input type="number" min="0"
                                                                class="layui-input" name="grossProfitRate"
                                                                placeholder="如20%，请直接填写20"
                                                                value="{{d.grossRate?Math.round(d.grossRate * 100):''}}"><span
                                                                style="padding: 4px 20px;">%</span></div>
                                                    </div>
                                                    <div class="layui-col-md2">
                                                        <div class="layui-form-label">优惠幅度</div>
                                                        <div class="layui-input-block disflex"><input type="number" min="0"
                                                                class="layui-input" name="discountRate"
                                                                value="{{!!d.discountRate?Math.round(d.discountRate*100):''}}"
                                                                placeholder="如20%，请直接填写20"><span
                                                                style="padding: 4px 20px;">%</span>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md2">
                                                        <div class="layui-form-label">定价方式</div>
                                                        <div class="layui-input-block">
                                                            <select name="shippingType">
                                                                <option value="">listing默认定价</option>
                                                                <option value="USD5_LESS_GENERAL">&lt;5USD 普货</option>
                                                                <option value="SPECIAL">特货</option>
                                                                <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                                                                <option value="GENERAL_OLD">普货（旧版）</option>
                                                                <option value="USD5_USD8_GENERAL">5-8美金普货</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md1">
                                                        <button class="layui-btn layui-btn-sm" type="button"
                                                            onclick="smtPublish_estimatePrice()">估算价格</button>
                                                    </div>
                                                    <div class="layui-col-md2 {{d.adjustPriceType=='3' ? '':'hidden'}}" id="smtPublish_placePrice_country_btn">
                                                        <div class="layui-col-md8">
                                                            <div class="layui-input-block ml20">
                                                                <select name="adjustType">
                                                                    <option value="">默认值</option>
                                                                    <option value="ECONOMYECONOMY">常见1:俄西经济</option>
                                                                    <option value="ECONOMYSIMPLE">常见2:俄经济西简易</option>
                                                                    <option value="SIMPLESIMPLE">常见3:俄西简易</option>
                                                                    <option value="STANDARDSIMPLE">常见4:俄标准西简易</option>
                                                                    <option value="STANDARDSTANDARD">常见5:全标准</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="layui-col-md4">
                                                            <button class="layui-btn layui-btn-sm" type="button"
                                                                onclick="smtPublish_regionPriceFixPrice()">估算区域刊登价</button>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md3 disflex">
                                                        <div class="ml40">
                                                            <input type="text" class="layui-input" name="skus" placeholder="支持父SKU、子SKU同时填入">
                                                        </div>
                                                        <div>
                                                            <button class="layui-btn layui-btn-sm" type="button"
                                                            onclick="smtPublish_addSku()">一键添加SKU</button>
                                                        </div>
                                                        <div class="ml10">
                                                            <button class="layui-btn layui-btn-sm" type="button"
                                                            onclick="smtPublish_batchEditSku()">批量修改属性映射</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <table class="layui-table" id="smtPublish_listingInfo_sub_tab2"
                                                    lay-filter="smtPublish_listingInfo_sub_tab2">
                                                    <thead>
                                                        <tr>
                                                            <th class="w20" data-sort="0">
                                                                <input type="checkbox" lay-skin="primary" name='allchecked'
                                                                    checked lay-filter="smtPublish_listingInfo_allCheked">
                                                            </th>
                                                            {{# if(d.aliexpressListingSkuDtos[0]&&d.aliexpressListingSkuDtos[0].imgAttrName){
                                                            }}
                                                            <th data-sort="0" data-oaname="{{d.aliexpressListingSkuDtos[0].imgOaAttrName}}" data-name="imgAttrName" data-attrid="{{d.aliexpressListingSkuDtos[0].imgAttrId}}" data-attrname="{{d.aliexpressListingSkuDtos[0].imgAttrName}}">{{d.aliexpressListingSkuDtos[0].imgAttrName}}</th>
                                                            {{# } }}
                                                            {{# layui.each(d.skuTheadCols,function(key,value){ }}
                                                                <th data-sort="0" data-attrid="{{value.attrId}}" data-attrname="{{value.name}}" data-oaname="{{value.oaAttrName}}" data-name="{{value.key}}" style="width: 140px !important;">{{value.name}}</th>
                                                            {{# }) }}
                                                            <th data-sort="0" data-attrendtag="true" class="attrEndTag" style="width:180px">店铺子SKU</th>
                                                            <th data-sort="0">重量(g)</th>
                                                            <th data-sort="0">成本(￥)</th>
                                                            <th data-sort="0">发货地</th>
                                                            <th class="layui-form-item smtPublish-skuInfo-row-width" data-sort="0" >
                                                                <div class="layui-form-label smtPublish-skuInfo-row-padding">库存</div>
                                                                <div class="layui-input-block smtPublish-skuInfo-row-ml"><input type="number"
                                                                        class="layui-input" name="stock"
                                                                        onblur="smtPublish_blurAllStock(this)"></div>
                                                                <!-- <div>库存</div> -->
                                                            </th>
                                                            <th class="layui-form-item" style="min-width: 230px;" data-sort="0">
                                                                <div class="layui-form-label smtPublish-skuInfo-row-padding" style="width: 65px;">刊登价($)</div>
                                                                <div class="layui-input-block disflex" style="align-items: center;margin-left: 65px;">
                                                                    <div  class="w50"  style="flex: none;">
                                                                        <select name="priceOperation">
                                                                            <option value="=">=</option>
                                                                            <option value="+">+</option>
                                                                            <option value="-">-</option>
                                                                            <option value="*">*</option>
                                                                        </select>
                                                                    </div>
                                                                    <input type="number" class="layui-input" name="price">
                                                                    <a href="javascript:;" class="layui-btn layui-btn-xs" onclick="smtPublish_estimateAllPrice()">一键应用</a>
                                                                </div>
                                                            </th>
                                                            <th class="layui-form-item" style="min-width: 230px;" data-sort="0">
                                                                <div class="layui-form-label smtPublish-skuInfo-row-padding" style="width: 65px;">刊登价(￥)</div>
                                                                <div class="layui-input-block disflex" style="align-items: center;;margin-left: 65px;">
                                                                    <div  class="w50" style="flex: none;">
                                                                        <select name="priceOperationCny">
                                                                            <option value="=">=</option>
                                                                            <option value="+">+</option>
                                                                            <option value="-">-</option>
                                                                            <option value="*">*</option>
                                                                        </select>
                                                                    </div>
                                                                    <input type="number" class="layui-input" name="priceCny">
                                                                    <a href="javascript:;" class="layui-btn layui-btn-xs" onclick="smtPublish_estimateAllPriceCny()">
                                                                        一键应用
                                                                    </a>
                                                                </div>
                                                            </th>
                                                            <th data-sort="0" style="min-width: 60px;">预估利润(&yen;)</th>
                                                            {{# if(d.aliexpressListingSkuDtos[0] && d.aliexpressListingSkuDtos[0].adjustPriceData && d.aliexpressListingSkuDtos[0].adjustPriceData.length){ }}
                                                                {{# layui.each(d.aliexpressListingSkuDtos[0].adjustPriceData,function(elemIndex,elem){ }}
                                                                <th data-sort="{{elem.sort}}" data-code="{{elem.code}}" data-name="{{elem.name}}" class="layui-form-elem" style="min-width: 200px">
                                                                    <div class="layui-form-label smtPublish-skuInfo-row-padding">{{elem.name}}({{elem.code}})</div>
                                                                    <div class="layui-input-block smtPublish-skuInfo-row-ml">
                                                                        <select name="regionPriceFixPriceByShipType" lay-filter="smtPublish_regionPriceFixPriceByShipType">
                                                                            <option value="GENERALECONOMY" {{elem.type == 'GENERALECONOMY' ? 'selected' : ''}}>普货-经济</option>
                                                                            <option value="GENERALSIMPLE"  {{elem.type == 'GENERALSIMPLE' ? 'selected' : ''}}>普货-简易</option>
                                                                            <option value="GENERALSTANDARD"  {{elem.type == 'GENERALSTANDARD' ? 'selected' : ''}}>普货-标准</option>
                                                                            <option value="SPECIALECONOMY"  {{elem.type == 'SPECIALECONOMY' ? 'selected' : ''}}>特货-经济</option>
                                                                            <option value="SPECIALSIMPLE" {{elem.type == 'SPECIALSIMPLE' ? 'selected' : ''}}>特货-简易</option>
                                                                            <option value="SPECIALSTANDARD" {{elem.type == 'SPECIALSTANDARD' ? 'selected' : ''}}>特货-标准</option>
                                                                        </select>
                                                                    </div>
                                                                </th>
                                                                {{# }) }}
                                                            {{# } }}
                                                            <th data-sort="9999">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="smtPublish_SubSkuInfo2">
                                                        {{# layui.each(d.aliexpressListingSkuDtos,function(index,item){ }}
                                                        <tr data-place={{item.deliveryPlace}} data-prodssku="{{item.prodSSku}}" data-prodpId="{{item.prodPId}}" data-isnewtr="false" data-prodpsku="{{item.prodPSku}}">
                                                            <td class="taCenter w20" data-sort="0"><input type="checkbox" lay-skin="primary"
                                                                    name='singlechecked' checked
                                                                    lay-filter="smtPublish_listingInfo_sCheked">
                                                            </td>
                                                            {{# if(d.aliexpressListingSkuDtos[0].imgAttrName){ }}
                                                            <td style="min-width: 140px !important;" data-sort="0">
                                                                <div class="imgDiv sell-hot-icon-box">
                                                                    <div class="epz-out w_100 attrimage">
                                                                        {{#if(item.skuImage !=null){ }}
                                                                        <img class="img_show_hide smtPublish_imgCss lazy"
                                                                            data-original="{{item.skuImage}}"
                                                                            style="display: block;"
                                                                            src="{{item.skuImage}}"
                                                                            data-onerror="layui.admin.img_noFind()">
                                                                        {{# }else{ }}
                                                                        <img src="/lms/static/img/kong.png"/>
                                                                       {{# } }}
                                                                    </div>
                                                                    <div class="mb5 disflex">
                                                                        <a href="javascript:;" type="button" class="layui-btn layui-btn-xs" style="padding: 0 11px; border-radius:10%;">上传图片</a>
                                                                        <input type="file" class="uploadLocalSkuImg" style="width: 70px;">
                                                                        <a href="javascript:;" type="button" class="layui-btn layui-btn-xs layui-btn-danger ml10 removeSkuImg" style="padding: 0 17px; border-radius:10%">删除</a>
                                                                    </div>
                                                                    <div class="disflex imgAttr">
                                                                        <div>
                                                                            <select name="imgAttr" onchange="smt_publish_imgAttr" lay-filter="smt_publish_imgAttr" data-attrname="{{item.imgAttrName}}"  data-attrid="{{item.imgAttrId}}" data-oaname="{{item.imgOaAttrName}}" data-imgval="{{item.imgAttrValue}}">
                                                                                {{# layui.each(d.skuList[item.imgAttrName],function(skuKey,skuValue){ }}
                                                                                    <option value="{{skuValue.value}}"  {{skuValue.value==item.imgAttrValueId ? 'selected' : '' }}>{{skuValue.name}}</option>
                                                                                {{#  }) }}
                                                                            </select>
                                                                        </div>
                                                                        <div class="taCenter ml10"><input type="text" value="{{item.imgCustomValue===undefined ? '' : item.imgCustomValue}}" name="imgAttrName" class="layui-input" onblur="smtPublish_attrInputBlur(event)"></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            {{# } }}
                                                            {{# if(item.attr1Name!==undefined){ }}
                                                                <td data-sort="0" style="min-width: 140px !important;" >
                                                                    <div class="disflex">
                                                                        <div>
                                                                            <select name="attr1" data-attrname="{{item.attr1Name}}" lay-filter="smt_publish_attr1" data-oaname="{{item.attr1OaAttrName}}"  data-attrid="{{item.attr1Id}}">
                                                                                {{# layui.each(d.skuList[item.attr1Name],function(skuKey,skuValue){ }}
                                                                                    <option value="{{skuValue.value}}"  {{skuValue.value==item.attr1ValueId ? 'selected' : '' }}  >{{skuValue.name}}</option>
                                                                                {{#  }) }}
                                                                            </select>
                                                                        </div>
                                                                        <div class="taCenter ml10">
                                                                            <input type="text" value="{{item.attr1CustomValue === undefined ? '' : item.attr1CustomValue}}" class="layui-input" name="attr1Name" onblur="smtPublish_attrInputBlur(event)">
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            {{# } }}
                                                            {{# if(item.attr2Name!==undefined){ }}
                                                                <td data-sort="0" style="min-width: 140px !important;" >
                                                                    <div class="disflex">
                                                                        <div>
                                                                            <select name="attr2" data-attrname="{{item.attr2Name}}"  data-attrid="{{item.attr2Id}}" lay-filter="smt_publish_attr2" data-oaname="{{item.attr2OaAttrName}}">
                                                                                {{# layui.each(d.skuList[item.attr2Name],function(skuKey,skuValue){ }}
                                                                                    <option value="{{skuValue.value}}"  {{skuValue.value==item.attr2ValueId ? 'selected' : '' }}  >{{skuValue.name}}</option>
                                                                                {{#  }) }}
                                                                            </select>
                                                                        </div>
                                                                        <div class="taCenter ml10">
                                                                            <input type="text" value="{{item.attr2CustomValue=== undefined ? '' : item.attr2CustomValue}}" class="layui-input" name="attr2Name" onblur="smtPublish_attrInputBlur(event)">
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            {{# } }}
                                                            {{# if(item.attr3Name!==undefined){ }}
                                                                <td data-sort="0" style="min-width: 140px !important;">
                                                                    <div class="disflex">
                                                                        <div>
                                                                            <select name="attr3"  data-attrname="{{item.attr3Name}}"  data-attrid="{{item.attr3Id}}" data-oaname="{{item.attr3OaAttrName}}" lay-filter="smt_publish_attr3">
                                                                                {{# layui.each(d.skuList[item.attr3Name],function(skuKey,skuValue){ }}
                                                                                    <option value="{{skuValue.value}}"  {{skuValue.value==item.attr3ValueId ? 'selected' : '' }}>{{skuValue.name}}</option>
                                                                                {{#  }) }}
                                                                            </select>
                                                                        </div>
                                                                        <div class="taCenter ml10">
                                                                            <input type="text" value="{{item.attr3CustomValue=== undefined ? '' : item.attr3CustomValue}}" class="layui-input" name="attr3Name" onblur="smtPublish_attrInputBlur(event)">
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            {{# } }}
                                                        <td class="taCenter smtPublish_skuInfo_storeSSku" style="min-width:180px"
                                                            attr-prodSSku="{{item.prodSSku}}" data-sort="0">
                                                            <input class="layui-input"
                                                                name="skuInfo_storeSSku"
                                                                data-last="{{item.storeSSku ||''}}"
                                                                data-origin="{{item.storeSSku ||''}}"
                                                                onchange="smtPublish_skuInfo_storeSSkuBlur(this)"
                                                                value="{{item.storeSSku ||''}}"/>
                                                        </td>
                                                        <td class="taCenter skuInfo_weight" data-sort="0">{{item.weight || ''}}</td>
                                                        <td class="taCenter skuInfo_cost" data-sort="0">{{item.cost || ''}}</td>
                                                        <td class="taCenter" id="smtPublish_skuInfo_deliveryPlace" data-sort="0">
                                                            {{item.deliveryPlace ||''}}
                                                        </td>
                                                        <td class="taCenter smtPublish-skuInfo-row-width" data-sort="0">
                                                            <input type="number" class="layui-input smtPublish_stock"
                                                                name="skuInfo_stock"
                                                                value="{{item.stock || item.stock == 0 ? item.stock : ''}}"/>
                                                        </td>
                                                        <td class="taCenter" style="min-width: 230px;" data-sort="0">
                                                            <input type="number" 
                                                                class="layui-input smtPublish_price"
                                                                name="skuInfo_price" 
                                                                onkeypress="commonKeyPressInputFloat(event)"
                                                                onblur="smtPublish_skuInfo_blur_price(this)"
                                                                value="{{item.price || item.price == 0 ? item.price : ''}}"
                                                            />
                                                        </td>
                                                        <td class="taCenter" style="min-width: 230px;" data-sort="0">
                                                            <input type="number" 
                                                                class="layui-input smtPublish_priceCny" 
                                                                name="skuInfo_priceCny" 
                                                                onkeypress="commonKeyPressInputFloat(event)" 
                                                                onblur="smtPublish_skuInfo_blur_priceCny(this)"
                                                                value="{{item.priceCny || item.priceCny == 0 ? item.priceCny : ''}}"
                                                            />
                                                        </td>
                                                        <td class="taCenter smtPublish_estimateProfit" data-sort="0" style="min-width: 60px;">
                                                            {{item.estimateProfit==undefined? '' : '&yen;'+item.estimateProfit}}
                                                        </td>
                                                        {{# if(item.adjustPriceData && item.adjustPriceData.length){ }}
                                                            {{# layui.each(item.adjustPriceData,function(elemIndex,elem){ }}
                                                                <td class="taCenter smtPublish-skuInfo-row-width" data-sort="{{elem.sort}}">
                                                                    <div class="disFCenter">
                                                                        <div class="w50 unit">$</div>
                                                                        <input class="layui-input smtPublish_{{elem.code}}"
                                                                            onblur="smtPublish_skuInfo_blur_area_price(this)"
                                                                            onchange="smtPublish_changeRegionPriceFixPrice(this)" name="smtPublish_{{elem.code}}" 
                                                                            value="{{elem.price}}" data-code="{{elem.code}}" 
                                                                            data-sort="{{elem.sort}}" data-name="{{elem.name}}"
                                                                        />
                                                                    </div>
                                                                    <div class="disFCenter">
                                                                        <div class="w50 unit">￥</div>
                                                                        <input class="layui-input smtPublish_{{elem.code}}"
                                                                            onblur="smtPublish_skuInfo_blur_area_priceCny(this)"
                                                                            onchange="smtPublish_changeRegionPriceFixPrice(this)" name="smtPublish_{{elem.code}}_priceCny" value="{{elem.priceCny}}" data-code="{{elem.code}}" 
                                                                            data-sort="{{elem.sort}}" data-name="{{elem.name}}"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            {{# }) }}
                                                        {{# } }}
                                                        <td class="taCenter w100" data-sort="9999">
                                                            <a href="javascript:;" type="button" data-prodssku="{{item.prodSSku}}" class="layui-btn layui-btn-xs changeAttrVal" style="border-radius:10%;">修改属性映射</a>
                                                            <a href="javascript:;" type="button" class="layui-btn layui-btn-xs layui-btn-danger mt10 delAttrTr" style="border-radius:10%">删除</a>
                                                        </td>
                                                        </tr>
                                                        {{# }) }}
                                                    </tbody>
                                                </table>
                                            </div>
                                </div>
                                <!-- 其他信息 -->
                                <div class="layui-card">
                                    <div class="layui-card-header" id="smtPublish_editDetail_otherInfo">
                                        <span>其他信息</span>
                                    </div>
                                    <div class="layui-card-body">
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>min计量单位
                                            </div>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md4">
                                                    <select name="productUnit" id="smtPublish_productUnit">
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">销售方式</div>
                                            <div class="layui-input-block disflex">
                                                <input type="checkbox" name="packageType"
                                                    {{d.extra&&d.extra.packageType?'checked':''}} lay-skin="primary"
                                                    title="打包出售">
                                                <div class="smtPublish_input_notetext">(勾选打包出售后，每包数量必填)</div>
                                                <div class="mr10 ml10 smtPulish_span_lh32">,每包</div>
                                                <input class="layui-input w100" type="number"
                                                    value="{{d.extra&&d.extra.lotNum||''}}" name="lotNum" min="1">
                                                <div class="ml10 smtPublish_input_notetext">(选择打包出售的情况下，每包数量必须大于1)</div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">批发价</div>
                                            <div class="layui-input-block disflex">
                                                <input type="checkbox" lay-skin="primary" title="支持批发" name="isBulk"
                                                    {{d.extra&&d.extra.isBulk?'checked':''}}>
                                                <div class="smtPublish_input_notetext">(勾选支持批发后，起批量和减免折扣必填)</div>
                                                <div class="mr10 ml10 smtPulish_span_lh32">，起批量</div>
                                                <input class="layui-input w100" type="number"
                                                    value="{{d.extra&&d.extra.bulkOrder||''}}" name="bulkOrder" min="2">
                                                <span class="ml10 mr10 smtPublish_input_notetext">(起批量:2-100000)</span>
                                                <span class="mr10 smtPulish_span_lh32">包，在零售价基础上减免</span>
                                                <input class="layui-input w100" type="number"
                                                    value="{{d.extra&&d.extra.bulkDiscount||''}}" name="bulkDiscount"
                                                    onblur="smtPublishBulkDiscount(this)">
                                                <div class="ml10 smtPulish_span_lh32">%,即</div>
                                                <div id="smtPublish_bulkDiscount" class="smtPulish_span_lh32"></div>
                                                <div class="smtPulish_span_lh32">折</div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>发货期
                                            </div>
                                            <div class="layui-input-block disflex">
                                                <input type="number" min="1" max="7" name="deliveryTime"
                                                    value="{{d.extra&&d.extra.deliveryTime||'7'}}" class="layui-input w100">
                                                <span class="smtPublish_input_notetext">（除部分定制等特殊类目外，发货期需小于7天）</span>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>包装后重量
                                            </div>
                                            <div class="layui-input-block">
                                                <div class="disflex mb10">
                                                    <input type="number" min="0" name="grossWeight" class="layui-input w100"
                                                        value="{{d.extra&&d.extra.grossWeight||''}}">
                                                    <span class="ml10 smtPublish_input_notetext">(单位：千克，每件/个0.5千克)</span>
                                                </div>
                                                <div class="mb10 disflex">
                                                    <input type="checkbox" title="自定义计算" name="isPackSell" lay-skin="primary"
                                                        {{d.extra&&d.extra.isPackSell?'checked':''}}>
                                                    <div class="ml10 smtPublish_input_notetext">(勾选自定义计算后，件数和重量必须填)</div>
                                                </div>
                                                <div class="disflex mb10">
                                                    <span class="mr10 smtPulish_span_lh32">卖家购买</span>
                                                    <input type="number" min="1" name="baseUnit" class="layui-input w100"
                                                        value="{{d.extra&&d.extra.baseUnit||''}}">
                                                    <span class="ml10 smtPulish_span_lh32">件以内，按单件重量计算运费</span>
                                                </div>
                                                <div class="disflex mb10">
                                                    <span class="smtPulish_span_lh32 mr10">在此基础上，买家每多买</span>
                                                    <input type="number" min="1" name="addUnit" class="layui-input w100"
                                                        value="{{d.extra&&d.extra.addUnit||''}}">
                                                    <span class="mr10 ml10 smtPulish_span_lh32">件，重量增加</span>
                                                    <input type="number" min="0" name="addWeight" class="layui-input w100"
                                                        value="{{d.extra&&d.extra.addWeight||''}}">
                                                    <span class="ml10 smtPulish_span_lh32">kg</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>包装后尺寸:
                                            </div>
                                            <div class="layui-input-block disflex">
                                                <input type="number" min="0" name="packageLength" class="layui-input w100"
                                                    placeholder="长" value="{{d.extra&&d.extra.packageLength||'10'}}">
                                                <span class="mr10 ml10 smtPulish_span_lh32">X</span>
                                                <input type="number" min="0" name="packageWidth"
                                                    value="{{d.extra&&d.extra.packageWidth||'10'}}" class="layui-input w100"
                                                    placeholder="宽">
                                                <span class="mr10 ml10 smtPulish_span_lh32">X</span>
                                                <input type="number" min="0" name="packageHeight"
                                                    value="{{d.extra&&d.extra.packageHeight||'5'}}" class="layui-input w100"
                                                    placeholder="高">
                                                <span class="ml10 smtPublish_input_notetext">(单位：厘米，每件/个1000cm^3)</span>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>库存扣减:
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="radio" class="layui-input" name="reduceStrategy"
                                                    {{d.extra&&d.extra.reduceStrategy!='place_order_withhold' ?'checked':''}}
                                                    title="付款减库存" value="payment_success_deduct">
                                                <input type="radio" class="layui-input" name="reduceStrategy"
                                                    {{d.extra&&d.extra.reduceStrategy=='place_order_withhold' ?'checked':''}}
                                                    title="下单减库存" value="place_order_withhold">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>运费模板:
                                            </div>
                                            <div class="layui-input-block disflex">
                                                <div class="layui-col-md4">
                                                    <select name="freightTemplateId" id="smtPublish_freightTemplate" lay-search>
                                                    </select>
                                                </div>
                                                <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" type="button"
                                                    onclick="smtPublish_freightTpl_sync()">同步</button>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>服务模板:
                                            </div>
                                            <div class="layui-input-block disflex">
                                                <div class="layui-col-md4">
                                                    <select name="promiseTemplateId" id="smtPublish_promiseTemplate" lay-search>
                                                    </select>
                                                </div>
                                                <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" type="button"
                                                    onclick="smtPublish_serveTpl_sync()">同步</button>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-form-label">商品分组:</div>
                                            <div class="layui-input-block disflex">
                                                <div class="layui-col-md4">
                                                    <select name="groupId" id="smtPublish_group" lay-search></select>
                                                </div>
                                                <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" type="button"
                                                    onclick="smtPublish_proGroup_sync()">同步</button>
                                            </div>
                                        </div>
                                        <div class="layui-form-item" id="isOpenJoinAEHalf">
                                            <div class="layui-form-label">
                                                <font color="red">*</font>半托管:
                                            </div>
                                            <div class="layui-input-block" id="isJoin">
                                                <input type="radio" name="isJoin"
                                                    title="参与" value="true" lay-filter="ae_half_isJoin">
                                                <input type="radio" name="isJoin"
                                                    title="不参与" value="false" lay-filter="ae_half_isJoin">
                                            </div>
                                        </div>
                                        <div class="layui-form-item ae_half_manage_table_not_join" id="isNotOpenJoinAEHalf">
                                            <div class="text-bold ml-45"><span class="text-red">*</span>半托管: 当前账号未开半托管业务</div>
                                        </div>

                                        <div class="layui-card" id="ae_half_manage_info" class="ae_half_manage_table_not_join">
                                            <div class="layui-card-header" id="smtPublish_editDetail_SKUInfo">
                                                <span>填写半托管信息</span>
                                            </div>

                                        <div class="layui-card-body">
                                            <div class="layui-inline" id="handleSet">
                                                <div>批量填写</div>
                                                <form action="" class="layui-form">
                                                    <div class="layui-col-md layui-col-lg2">
                                                        <label class="layui-form-label">是否原箱</label>
                                                        <div class="layui-input-block">
                                                            <select name="originalBox" id="handleOriginalBox">
                                                                <option value="">请选择</option>
                                                                <option value="true">是</option>
                                                                <option value="false">否</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div class="layui-col-md layui-col-lg2">
                                                        <label class="layui-form-label">重量(g)</label>
                                                        <div class="layui-input-block">
                                                            <div>
                                                                <input type="number" name="packageWeight" autocomplete="off" class="layui-input" onblur="changePackageWeight(event)">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md4 layui-col-lg3">
                                                        <label class="layui-form-label">包装尺寸(cm)</label>
                                                        <div id="package_info" class="layui-input-block disflex">
                                                            <div>
                                                                <input type="number" name="packageLength" placeholder="长" autocomplete="off" class="layui-input w100" onblur="changePackageInfo(event)">
                                                            </div>
                                                            <div>
                                                                <input type="number" name="packageWidth" placeholder="宽" autocomplete="off" class="layui-input w100" onblur="changePackageInfo(event)">
                                                            </div>
                                                            <div>
                                                                <input type="number" name="packageHeight" placeholder="高" autocomplete="off" class="layui-input w100" onblur="changePackageInfo(event)">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md2 layui-col-lg2">
                                                        <label class="layui-form-label">特殊商品类型</label>
                                                        <div class="layui-input-block">
                                                            <select  xm-select="handleSpecialProductTypeList" name="oldSpecialProductTypeList" xm-select-search>
                                                                <option value="">请选择</option>
                                                                <option value="general">普货</option>
                                                                <option value="274526">带电</option>
                                                                <option value="274452">弱磁</option>
                                                                <option value="274259">液体</option>
                                                                <option value="274511">粉末</option>
                                                                <option value="274363">膏体</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md1 layui-col-lg2"  class="handleSetbasePriceUsd">
                                                        <label class="layui-form-label">价格($)</label>
                                                        <div class="layui-input-block">
                                                            <div>
                                                                <input type="number" name="basePriceUsd" autocomplete="off" onblur="handleChangeBasePriceUsd(event)" class="layui-input">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md1 layui-col-lg2" class="handleSetbasePriceCny">
                                                        <label class="layui-form-label">价格(￥)</label>
                                                        <div class="layui-input-block">
                                                            <div>
                                                                <input type="number" name="basePriceCny" autocomplete="off"  onblur="handleChangeBasePriceCny(event)" class="layui-input">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md1 layui-col-lg2">
                                                        <label class="layui-form-label">JIT库存</label>
                                                        <div class="layui-input-block">
                                                            <div>
                                                                <input type="number" name="sellableQuantity" autocomplete="off" class="layui-input">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md1">
                                                        <span type="button" class="layui-btn layui-btn-sm" lay-submit lay-filter="formAeHalfBatchSet">应用</span>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="disflex">
                                                <div class="layui-col-md1 layui-col-lg2">
                                                    <label class="layui-form-label">毛利率</label>
                                                    <div class="layui-input-block">
                                                        <input id="gross_input" type="number" name="gross" placeholder="输入小数,如0.3" autocomplete="off" class="layui-input">
                                                    </div>

                                                </div>
                                                <div class="layui-col-md1">
                                                    <span type="button" class="layui-btn layui-btn-sm" lay-submit lay-filter="formAeHalfBatchGross" onclick="handle_make_price()">定价</span>
                                                </div>
                                            </div>

                                            <div id="smtPublish_listingInfo_sub_sku_table"></div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                </form>
                            </div>
                    </div>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-tab layui-tab-brief pora" lay-filter="smtPulish_desc_tab">
                        <ul class="layui-tab-title taCenter">
                            <li data-value="1" class="layui-this">手机版</li>
                            <li data-value="2">电脑版</li>
                        </ul>
                        <div style="position:absolute; right:20px; top: 0;" class="disflex">
                            <form class="layui-form hidden smtPublish-desc-pc-info" id="smtPublish_desc_pc_info">
                                <div class="layui-form-item">
                                    <div class="layui-form-label">信息模块：</div>
                                    <div class="layui-input-block disflex">
                                        <select name="moduleId" id="smtPublish_moduleId">
                                        </select>
                                        <button class="layui-btn layui-btn-sm mr30" type="button"
                                            onclick="smtPublish_syncListdetailmodule()">同步</button>
                                        <select name="position" class="w120">
                                            <option value="">请选择呈现位置</option>
                                            <option value="top">最顶端</option>
                                            <option value="bottom">最低端</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                            <button class="layui-btn layui-btn-sm" id="smtPulish_wirelessToPc" onclick="smtPublish_wirelessToPc()">生成PC描述</button>
                            <button style="opacity: 1;" class="layui-btn layui-btn-primary smtPublish-dropdown layui-btn-sm">
                               <span> 添加模块</span>
                               <div class="smtPublish-dropdown-content">
                                   <div onclick="smtPublish_desc_addText()">文本模块</div>
                                   <div onclick="smtPublish_desc_addImg()">图片模块</div>
                                   <div onclick="smtPublish_desc_addImgText()">图文模块</div>
                               </div>
                            </button>
                            <button class="layui-btn layui-btn-sm" onclick="smtPublish_desc_preview()">预览效果</button>
                        </div>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <div class="layui-card">
                                    <div class="layui-card-body uploadImgUL ui-sortable" id="smtPublish_desc_modules_phone">
                                      <!-- 描述内容 -->
                                    </div>
                                </div>
                            </div>
                            <div class="layui-tab-item">
                                <div class="layui-card">
                                    <div class="layui-card-body uploadImgUL ui-sortable"  id="smtPublish_desc_modules_pc"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-row">
                        <div class="layui-col-lg12 layui-col-md12">
                            <form action="" class="layui-form" id="smtPublish_editDetailForm_qualificationInfo" lay-filter="smtPublish_editDetailForm_qualificationInfo">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">欧盟责任人</label>
                                    <div class="layui-input-block ">
                                        <div class="layui-col-md6">
                                        <select name="msrEuId" id="smtPublish_msrEuId" lay-search>
                                            <option value="">请选择</option>
                                        </select>
                                        </div>
                                        <div class="layui-col-md3">
                                            <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" data-smtcategoryId="{{d.smtCategoryId}}" data
                                                type="button" onClick="smtPublish_EUResponsiblePerson_sync(this)">同步</button>
                                        </div>

                                    </div>
                                </div>
                                {{#if(d.qualificationList.length){}}
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">资质信息</label>
                                        <div class="layui-input-block">
                                            <div style="line-height: 14px;padding:9px 0" class="layui-orange">如果你在以下国家售卖商品，请提交改国家要求的商品资质，否则商品可能无法再该国家展示</div>
                                            <div id="smtPublish_qualificationInfoView"></div>
                                        </div>
                                    </div>
                                {{#}}}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </script>

            <!--模板弹窗 sku信息table -->
            <script type="text/html" id="smtPublish_SubSkuInfo2_tpl">
            {{# layui.each(d,function(index,item){ }}
            <tr data-place={{item.deliveryPlace}}>
                <td class="taCenter w30" data-sort="0"><input type="checkbox" lay-skin="primary" name='singlechecked' lay-filter="smtPublish_listingInfo_sCheked"></td>
                {{# if(d[0].imgAttrName){ }}
                <td style="width: 140px !important;" data-sort="0">
                    <div class="imgDiv sell-hot-icon-box" style="margin-right: 0px;">
                        <div class="epz-out w_100">
                            {{#if(item.skuImage !=null){ }}
                                <img class="img_show_hide smtPublish_imgCss lazy" data-original="{{item.skuImage}}!size=100x100" style="display: block;" data-onerror="layui.admin.img_noFind()">
                            {{# } }}
                        </div>
                        <%--<div class="taCenter">{{item.imgAttrValue || ''}}</div>--%>
                        <div class="taCenter">{{item.imgCustomValue || ''}}</div>
                    </div>
                </td>
                {{# } }}
                <td class="taCenter smtPublish_skuInfo_storeSSku" style="width:180px" attr-prodSSku="{{item.prodSSku}}" data-sort="0">
                    <input class="layui-input "
                    name="skuInfo_storeSSku"
                    data-last="{{item.storeSSku ||''}}"
                    data-origin="{{item.storeSSku ||''}}"
                    onblur="smtPublish_skuInfo_storeSSkuBlur(this)"
                    value="{{item.storeSSku ||''}}"/></td>
                <td class="taCenter skuInfo_weight" data-sort="0">{{item.weight || ''}}</td>
                <td class="taCenter skuInfo_cost" data-sort="0">{{item.cost || ''}}</td>
                {{# layui.each(d[0],function(firstKey,firstValue){ }}
                    {{# if(firstKey.includes('CustomValue')&&firstKey!='imgCustomValue'){ }}
                        <td data-sort="0">{{item[firstKey] || ''}}</td>
                    {{# } }}
                {{# }) }}
                <td class="taCenter" id="smtPublish_skuInfo_deliveryPlace" data-sort="0">{{item.deliveryPlace || ''}}</td>
                <td class="taCenter" data-sort="0">
                    <input type="number" class="layui-input smtPublish_stock" name="skuInfo_stock" value="{{item.stock || ''}}">
                </td>
                <td class="taCenter" data-sort="0">
                    <input type="number" 
                        onkeypress="commonKeyPressInputFloat(event)" 
                        class="layui-input smtPublish_price" 
                        name="skuInfo_price" 
                        value="{{item.price || ''}}" 
                        onblur="smtPublish_skuInfo_blur_price(this)"
                    />
                </td>
                <td class="taCenter" data-sort="0">
                    <input type="number" 
                        onkeypress="commonKeyPressInputFloat(event)" 
                        onblur="smtPublish_skuInfo_blur_priceCny(this)"
                        class="layui-input smtPublish_priceCny" 
                        name="skuInfo_priceCny"
                        value="{{item.priceCny || ''}}" 
                    />
                </td>
            </tr>
        {{#  }) }}
        </script>

        <!-- 资质信息 -->
        <script type="text/html" id="smtPublish_qualificationInfoTpl">
            {{#layui.each(d.qualificationList,function(index, key){}}
            <div class="layui-card">
                <div class="layui-card-header" id="{{'smtPublish_qualificationInfo_'+index}}">{{index}}-{{key[0].qualificationName}}</div>
                <div class="layui-card-body">
                    {{#layui.each(key,function(itemIndex, item){}}
                    <div class="layui-form-item">
                        <label class="layui-form-label">{{!!item.required ? '<font class="fRed">*</font>':''}}{{item.label}}</label>
                        <div class="layui-input-block qualificationitem">
                            {{#if(item.qualificationType=='image'){}}
                            <div class="disflex" style="align-items: center;">
                                <button class="layui-btn layui-btn-primary layui-btn-sm">上传本地文件</button>
                                <input type="file" accept="image/*" name="{{item.qualificationKey}}" class="uploadQualificationInfo" onchange="qualificationUploadImage(event)"/>
                                <div style="width: 50px;" class="ml10">
                                    <img class="img_show_hide smtPublish_imgCss lazy"
                                    data-required="{{item.required}}"
                                    data-original="{{item.qualificationValue || '/lms/static/img/kong.png'}}"
                                    style="display: block;"
                                    src="{{item.qualificationValue || '/lms/static/img/kong.png'}}"
                                    data-onerror="layui.admin.img_noFind()"/>
                                </div>
                                <div class="{{item.qualificationValue ? 'fRed ml10 delteImg':'fRed ml10 delteImg hidden'}}">删除</div>
                            </div>
                            {{#}else{}}
                            <div class="disflex">
                                <div class="layui-col-md9">
                                    <input name="{{item.qualificationKey}}" class="layui-input" data-required="{{item.required}}" value="{{item.qualificationValue || ''}}" onblur="qualificationInputBlur(event)"/>
                                </div>
                            </div>
                            {{#}}}
                            <div class="smtPublish_orange_notetext">{{item.tips}}</div>
                        </div>
                    </div>
                    {{#})}}
                </div>
            </div>
            {{#})}}
            <div style="position: fixed;top: 100px;right: 100px">
                <ul>
                    {{#layui.each(d.qualificationList,function(index, key){}}
                    <li data-id="{{'smtPublish_qualificationInfo_'+index}}" onclick="smtPulish_Location(this)" class="blue" style="padding: 6px 15px;">
                        <i class="layui-icon layui-icon-tree"></i>
                        <a href="javascript:;" class="blue">{{index}}-{{key[0].qualificationName}}</a>
                    </li>
                    {{#})}}
                </ul>
            </div>
        </script>

        <!-- 半托管信息 table -->
        <script type="text/html" id="smtPublish_AEHalfSkuInfoTable">
            <table class="layui-table" id="smtPublish_aeHalfListingInfo_sub_tab2"
                lay-filter="smtPublish_aeHalfListingInfo_sub_tab2">
                <thead>
                    <tr>
                        <th data-sort="0">店铺</th>
                        <th data-sort="0">SKU属性</th>
                        <th data-sort="0"><span class="text-red">*</span>SKU编码</th>
                        <th data-sort="0"><span class="text-red">*</span>是否原箱</th>
                        <th data-sort="0" style="width:80px"><span class="text-red">*</span>重量(g)</th>
                        <th data-sort="0" style="width:200px"><span class="text-red">*</span>包装尺寸(cm)</th>
                        <th data-sort="0"><span class="text-red">*</span>特殊商品类型</th>
                        <th data-sort="0"><span class="text-red">*</span>价格(不含预估物流服务费)</th>
                        <th data-sort="0"><span class="text-red">*</span>JIT库存</th>
                        <th data-sort="0">货品条码</th>
                    </tr>
                </thead>
                <tbody id="smtPublish_AESubSkuInfo2">
                    {{# layui.each(d.subHalfManageExtraList,function(index,item){ }}
                    <tr data-prodssku="{{item.prodSSku}}"  data-prodSId="{{item.prodSId}}"  data-storeAccId="{{item.halfManangeStoreAcctId}}"  data-storeAccId="{{item.halfManangeStoreAcctId}}"  data-storeSSku="{{item.storeSSku}}" data-isnewtr="false" data-prodpsku="{{item.prodPSku}}">
                    <!-- 店铺 -->
                    <td style="min-width:100px">
                        <div>{{item.smtStoreAcct}}</div>
                    </td>
                    <!-- sku属性 -->
                    <td style="min-width:150px"
                        data-sort="0">
                        <div class="aeSkuProperty">{{item.skuProperty}}</div>
                    </td>
                    <!-- sku编码 -->
                    <td class="taCenter" data-sort="0" style="min-width:120px">
                        <div class="taCenter ml10">
                            <input name="aeStoreSSku" type="text" value="{{item.storeSSku=== undefined ? '' : item.storeSSku}}" class="layui-input aeStoreSSku" onblur="smtPublish_aeHalfInfo_storeSSkuBlur(this)">
                        </div>
                    </td>
                    <!-- 是否原箱 -->
                    <td class="taCenter skuInfo_cost" data-sort="0" style="width:100px">
                        <select name="originalBox">
                            <option value="true" {{item.originalBox === true ? 'selected' : '' }}>是</option>
                            <option value="false"  {{item.originalBox === false ? 'selected' : '' }}>否</option>
                        </select>
                    </td>
                    <!-- 重量 -->
                    <td class="taCenter" data-sort="0" style="min-width:80px">
                        <div class="taCenter ml10">
                            <input type="number" name="packageWeight"  value="{{item.packageWeight=== undefined ? '' : item.packageWeight}}" class="layui-input" onblur="changePackageWeight(event)">
                        </div>
                    </td>
                    <!-- 包装尺寸 -->
                    <td class="taCenter" id="smtPublish_skuInfo_packageInfo" data-sort="0">
                        <div class="disflex">
                            <input type="text" placeholder="长" name="packageLength" value="{{item.packageLength=== undefined ? '' : (item.packageLength > 0 && item.packageLength < 1 ? 1 : item.packageLength )}}" class="layui-input w100" onblur="changePackageInfo(event)">
                            <input type="text" placeholder="宽" name="packageWidth" value="{{item.packageWidth=== undefined ? '' : (item.packageWidth > 0 && item.packageWidth < 1 ? 1 : item.packageWidth )}}" class="layui-input w100" onblur="changePackageInfo(event)">
                            <input type="text" placeholder="高" name="packageHeight" value="{{item.packageHeight=== undefined ? '' : (item.packageHeight > 0 && item.packageHeight < 1 ? 1 : item.packageHeight )}}" class="layui-input w100" onblur="changePackageInfo(event)">
                        </div>
                    </td>
                    <!-- 特殊商品类型 -->
                    <td class="taCenter logisAttrList_td" data-sort="0" style="min-width: 220px;">
                        <select name="oldSpecialProductTypeList"
                            class="table_logisInfo"
                            xm-select="isDisabledSpecialProType_{{index}}"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter="table_logisInfo">
                            <option value="">请选择</option>
                        </select>
                        </div>
                    </td>
                    <!-- 价格(不含预估物流服务费) -->
                    <td class="taCenter" style="min-width: 110px;" data-sort="0">
                        <div class="disflex">
                            $<input type="number"
                                class="layui-input smtPublish_price w100 priceUs"
                                name="basePriceUsd"
                                value="{{item.basePriceUsd || item.basePriceUsd == 0 ? item.basePriceUsd : ''}}"
                                onblur="changeBasePriceUsd(event)"
                            />
                        </div>
                        <div class="disflex">
                            ￥<input type="number"
                            class="layui-input smtPublish_price w100"
                            name="basePriceCny"
                            value="{{item.basePriceCny || item.basePriceCny == 0 ? item.basePriceCny : ''}}"
                            onblur="changeBasePriceCny(event)"
                            />
                        </div>
                    </td>
                    <!-- JIT库存 -->
                    <td class="taCenter" style="width: 100px;" data-sort="0">
                        <input type="text"
                            class="layui-input smtPublish_sellableQuantity"
                            name="sellableQuantity"
                            value="{{item.sellableQuantity || item.sellableQuantity == 0 ? item.sellableQuantity : ''}}"
                        />
                    </td>
                    <!-- 货品条码 -->
                    <td class="taCenter smtPublish_estimateProfit" data-sort="0" style="width: 100px;">
                        <input type="text"
                            class="layui-input smtPublish_priceCny"
                            name="scItemBarCode"
                            value="{{item.scItemBarCode ? item.scItemBarCode : ''}}"
                        />
                    </td>
                    </tr>
                    {{# }) }}
                </tbody>
            </table>
        </script>

            <!--定时刊登-->
            <script type="text/html" id="smtPulish_listTimingTpl">
            <div class="p20">
                <form class="layui-form" action="" lay-filter="component-form-group" id="smtPulish_listTiming_form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">定时刊登开始时间:</label>
                        <div class="layui-input-block">
                            <input class="layui-input" id="smtPulish_listTiming" name="listTiming">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">listing刊登间隔(分):</label>
                        <div class="layui-input-block">
                            <input class="layui-input" type="number" name="listInterval" min="0">
                        </div>
                    </div>
                </form>
            </div>
        </script>

            <!-- smt模板弹框（只静态显示） -->
            <script type="text/html" id="smtpublish_newSmtTemp">
    <form id="layernewsmtpublish" class="layui-form">
        <div class="layui-row layui-col-space15">
            <div class="layui-card-header"><h2>基本信息</h2></div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body layui-row">
                        <div class="layui-col-lg8 layui-col-md8 mt10">
                            <label class="layui-form-label">关键词</label>
                            <div class="layui-input-block">
                                <textarea name="keyword" class="layui-textarea" readonly></textarea>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8 mt10">
                            <label class="layui-form-label">Wish Tags</label>
                            <div class="layui-input-block">
                                <textarea name="wishTags" class="layui-textarea mt" readonly></textarea>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8 mt10">
                            <label class="layui-form-label">标题</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input mt" name="title" readonly>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8 mt10">
                            <label class="layui-form-label">SMT分类</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="smtCategoryName" readonly>
                                <input type="hidden" name="smtCategoryId">
                                <input type="hidden" name="id">
                                <input type="hidden" name="prodPId">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md8"><label class="layui-form-label">分类属性</label>
                <div class="layui-input-block" id="smtpublishSMTnormalAttrList">
                </div>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header"><label class="layui-form-label">自定义属性</label></div>
                    <div class="layui-card-body layui-row">
                        <div class="layui-col-md8 layui-col-lg8">
                            <div class="layui-input-block">
                                <div id="smtpublishSMTsalePropAttrList">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header">
                        <h2>商品图片</h2></div>
                    <div class="layui-card-body layui-row">
                        <div class="layui-col-md12">
                            <div class="layui-card"><label class="layui-form-label redStar smtPublishFontContain" style="width: 300px;">主图</label>
                                <div class="layui-card-body layui-row">
                                    <div class="layui-clear pl20 imgContains" data-maxImg="6" data-minImg="1" data-imgObjType="1"
                                         data-id="smtpublish_mainImgContains1" style="display: flex;">
                                    </div>
                                </div>
                                <div class="layui-card-header"><label class="layui-form-label redStar smtPublishFontContain" style="width: 300px;">辅图</label></div>
                                <div class="layui-card-body layui-row">
                                    <div class="pl20 layui-clear imgContains" data-maxImg="8" data-minImg="0" data-imgObjType="4"
                                         data-id="smtpublish_remarkImgContains1">
                                    </div>
                                </div>
                                <div class="layui-card-header"><label class="layui-form-label redStar">营销图</label></div>
                                <div class="layui-card-body layui-row dis_flex_start">
                                    <div class="pl20 layui-clear imgContains" data-maxImg="1" data-minImg="0" data-imgObjType="3"
                                         data-id="smtpublish_assistImgContains1">
                                    </div>
                                    <div class="pl20 layui-clear imgContains" data-maxImg="1" data-minImg="0" data-imgObjType="2"
                                         data-id="smtpublish_assistImgContains2">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12" id="smtPublishsmfs">
                <div class="layui-card">
                    <div class="layui-card-header"><h2>售卖方式</h2></div>
                    <div class="layui-card-body layui-row" id="">
                        <div class="layui-form-item">
                            <div class="layui-form-label redStar">
                                min计量单位
                            </div>
                            <div class="layui-input-block">
                                <div class="layui-col-md4">
                                    <select name="productUnit" id="_smtpublish_productUnit">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-form-label">销售方式</div>
                            <div class="layui-input-block dis_flex_start">
                                <input type="checkbox" name="packageType" lay-skin="primary" title="打包出售" value="true">
                                <div class="smtpublish_input_notetext">(勾选打包出售后，每包数量必填)</div>
                                <div class="mr10 ml10 smtpublish_span_lh32">,每包</div>
                                <input class="layui-input w100" type="number" value="" name="lotNum" min="1">
                                <div class="ml10 smtpublish_input_notetext">(选择打包出售的情况下，每包数量必须大于1)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header"><h2>SKU信息</h2></div>
                    <div class="layui-card-body layui-row" id="smtSkuAll">
                        <table class="layui-table" lay-size="sm">
                            <thead>
                            <tr>
                                <th></th>
                                <th>OA属性名</th>
                                <th>映射平台属性名</th>
                                <th>是否可设置图片</th>
                                <th>设置图片属性</th>
                            </tr>
                            </thead>
                            <tbody id="smtpublishskuParentTable">
                            </tbody>
                        </table>
                        <form class="layui-form" id="skuToTable">
                            <table class="layui-table" lay-size="sm">
                                <thead id="smtpublishLayertable_thead">
                                </thead>
                                <tbody id="smtpublishLayertable">

                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<!-- 批量设置暂不刊登 -->
<script type="text/html" id="smtPublish_batchUnlistingTemp_layout">
    <form class="layui-form" lay-filter="smtPublish_batchUnlistingTemp_Form" style="margin-top:30px;">
        <div class="layui-form-item">
            <div class="layui-input-block">
                <input type="radio" name="unlistingTemp" value="true" title="暂不刊登" checked/>
                <input type="radio" name="unlistingTemp" value="false" title="取消暂不刊登"/>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>设置店铺</label>
            <div class="layui-input-block">
                <select name="bacthStoreAcct" xm-select-search xm-select="smtPublish_batchUnlistingTemp_store"
                id="smtPublish_batchUnlistingTemp_store" xm-select-search-type="dl" xm-select-skin="normal">
                </select>
            </div>
        </div>
    </form>
</script>

<!-- 维护长发货期类目 -->
<script type="text/html" id="smtPublish_preserveLongtimeCategory_layout">
    <form class="layui-form" id="smtPublish_preserveLongtimeCategory_form">
        <div class="p-20">
            <div class="flex">
                <span>维护的类目刊登时发货期默认值为</span>
                <div class="layui-form-item ml-4">
                    <select name="deliveryDays" id="deliveryDays" xm-select-search lay-filter="select_preserveCategory">
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>
            </div>
            <div class="flex mt-10">
                <div>上次修改时间:<span class="modifyTime ml-4"></span></div>
                <div class="ml-20">修改人:<span class="modifier ml-4"></span></div>
                <button class="layui-btn layui-btn-normal layui-btn-sm ml-20" type="button" onclick="smtPublish_exportPreserveCategory()">导出当前类目</button>
            </div>
            <div class="flex mt-10">更新类目:
                <input value="选择文件" class="ml-4" type="file" id="smtPublish_uploadImgFile">
            </div>
            <div class="text-red mt-10">(叶子类目ID需在第一列)</div>
            <div>
                <table id="smt_publish_selectUploadFile_table"
                lay-filter="smt_publish_selectUploadFile_table" class="layui-table"></table>
            </div>
        </div>
    </form>
</script>
            <!-- 批量生成 -->
            <script type="text/html" id="smtPublish_batchPublish_layout">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" >
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-form-item">
                            <label class="layui-form-label"><font class="fRed">*</font>刊登店铺</label>
                            <div class="layui-input-block disflex smtPublish-batchPublish-multi">
                                <select name="bacthStoreAcct"  xm-select-search
                                    xm-select="smtPublish_batchPublish_store"
                                    id="smtPublish_batchPublish_store"
                                    xm-select-search-type="dl" xm-select-skin="normal">
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">选中视频</label>
                            <div class="layui-input-block">
                                <input type="checkbox" lay-skin="switch" name="isSelectVideo" id="smtPublish_batchPublish_isSelectVideo" lay-text="选中|不选">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="disflex" style="overflow-y: auto;height:350px;padding:10px 0 0 0">
                    <div class="layui-card w_50">
                        <div class="layui-card-header">商品分组</div>
                        <div class="layui-card-body">
                            <div id="smtPublish_batchPublish_goodsGroup"></div>
                        </div>
                    </div>
                    <div class="layui-card w_50">
                        <div class="layui-card-header">欧盟责任人</div>
                        <div class="layui-card-body">
                            <div id="smtPublish_batchPublish_msrEuId" data-categoryids=""></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
            <!-- 批量生成的商品分组 -->
            <script type="text/html" id="smtPublish_batchPublish_goodsGroup_Tpl">
    {{# if(d&&d.length){ }}
    {{# layui.each(d,function(index,item){ }}
            <div class="layui-form-item">
                <label class="layui-form-label">{{item.storeAcct}}</label>
                <div class="layui-input-block disflex">
                    <select name="batchPublish_group_{{item.storeAcctId}}" id="smtPublish_batchPublish_group_{{item.storeAcctId}}" >
                        <option value="">请选择（非必填）</option>
                        {{# if(item.productGroupList.length){ }}
                            {{# layui.each(item.productGroupList,function(index,groupItem){ }}
                            <option value="{{groupItem.groupId}}">{{groupItem.groupName}}</option>
                            {{# }) }}
                            {{#  } }}
                    </select>
                    <button class="layui-btn layui-btn-sm ml10 mr30" type="button" onclick="smtPublish_batch_proGroup_sync('{{item.storeAcctId}}')">同步</button>
                </div>
            </div>
            {{#  }) }}
            {{#  }else{ }}
        <div>暂无数据</div>
        {{# } }}
</script>
<!-- 批量生成的欧盟责任人 -->
<!-- 如果只有一个店铺只有一个欧盟责任人，则初始化选中 -->
<script type="text/html" id="smtPublish_batchPublish_msrEuId_Tpl">
{{# if(d&&d.length){ }}
{{# layui.each(d,function(index,item){ }}
<div class="layui-form-item">
    <label class="layui-form-label">{{item.name}}</label>
    <div class="layui-input-block disflex">
        <select name="batchPublish_msrEuId_{{item.value}}" id="smtPublish_batchPublish_msrEuId_{{item.value}}" >
            <option value="">请选择（非必填）</option>
            {{# if(item.msrEuIdList.length){ }}
                {{# layui.each(item.msrEuIdList,function(index,msrEudIItem){ }}
                <option value="{{msrEudIItem.msrEuId}}" {{item.msrEuIdList.length===1 ? 'selected':""}}>{{msrEudIItem.msrEuName}}</option>
                {{# }) }}
            {{#  } }}
        </select>
        <button class="layui-btn layui-btn-sm ml10 mr30" type="button" onclick="smtPublish_batch_msrEuId_sync('{{item.value}}')">同步</button>
    </div>
</div>
{{#  }) }}
{{#  }else{ }}
<div>暂无数据</div>
{{# } }}
</script>

            <!-- 侵权品牌商品刊登 -->
            <script type="text/html" id="smtPublish_infringement_brand">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <table id="smtPublish_infringement_brand_table" class="layui-table" lay-filter="smtPublish_infringement_brand_table"></table>
                    </div>
                </div>
            </script>

            <!-- 批量刊登失败原因 -->
            <script type="text/html" id="smtPublish_batchPublish_fail_reason">
    {{# if(d.length){ }}
        {{# layui.each(d,function(index,item){ }}
            <div style="line-height: 24px; margin-bottom: 10px;" ><span class="fRed mr10">{{item.key}}</span><span>{{item.value}}</span></div>
            {{# }) }}
    {{#} }}
</script>

            <!-- 文本编辑框 -->
            <script type="text/html" id="smtPublish_desc_text_modal">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form action="" id="smtPublish_desc_text_form">
                            <div class="smtPublish-desc-label">标题（非必填）</div>
                            <div><input type="text" class="layui-input" name="title" autocomplete="off" maxlength="218"></div>
                            <div class="smtPublish-desc-label">文本内容（非必填）</div>
                            <textarea name="content" class="layui-textarea smtPublish-desc-textarea" ></textarea>
                        </form>
                    </div>
                </div>
            </script>

            <!-- 添加图片通过url -->
            <script type="text/html" id="smtPublish_desc_imgUrl_modal">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form action="" class="layui-form mb20" id="smtPublish_desc_img_form">
                            {{# layui.each(d,function(index){ }}
                                <div class="layui-form-item mr10 mb20">
                                    <div class="layui-form-label">链接{{index+1}}</div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="imgUrl{{index+1}}" onblur="smtPublish_desc_isImgurl(this)">
                                    </div>
                                </div>
                            {{# }) }}
                        </form>
                        <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
                    </div>
                </div>
            </script>

            <!-- 图片超链接 -->
            <script type="text/html" id="smtPublish_desc_targetURL">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form mb20">
                            <div class="layui-form-item">
                                <input type="text" class="layui-input" id="smtPublish_desc_targetURL_input"
                                    name="targetURL" placeholder="请输入该图片跳转URL"
                                    onblur="smtPublish_desc_isurl(this)"
                                >
                            </div>
                       </form>
                       <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
                    </div>
                </div>
            </script>

            <!-- 模板描述 -->
            <script type="text/html" id="smtPublish_tplDesc_tpl">
                <div>
                    {{# layui.each(d,function(elemIndex,elem){ }}
                        <div class="layui-card layui-form" style="padding-left: 40px;margin-top: 15px;">
                            <div>
                                <input type="checkbox" name="descTpl" data-proddesc="{{elem.prodDesc}}" lay-skin="primary" title="{{elem.pSku}}">
                            </div>
                            <div class="layui-card-body">
                                <div class="smtPulish-textTplClass">{{elem.prodDesc}}</div>
                            </div>
                        </div>
                    {{# }) }}
                </div>
            </script>

            <!-- 修改类目属性 -->
            <script type="text/html" id="smtPublish_skuInfo_change_tpl">
                <div class="layui-card">
                    <div class="layui-card-header"></div>
                    <div class="layui-card-body disFCenter">
                       {{# layui.each(d,function(index,item){ }}
                            <table class="layui-table w120" data-colname="{{item.name}}">
                                <thead>
                                  <tr>
                                    <th>{{item.oaname}}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{{item.oaname}}</td>
                                  </tr>
                                </tbody>
                            </table>
                            {{# if(index+1!==d.length){ }}
                                <img src="/lms/static/img/exchange.png" class="w50 changeAttrVal"/>
                            {{#  } }}
                        {{#  }) }}
                    </div>
                </div>
            </script>

            <script type="text/html" id="smtPublish_skuInfo_add_tpl">
                <div id="smtPublish_skuInfo_add_tplId"></div>
            </script>

            <!-- 富文本 -->
            <script src="${ctx}/static/simditor/module.js"></script>
            <script src="${ctx}/static/simditor/hotkeys.js"></script>
            <script src="${ctx}/static/simditor/simditor.js"></script>

            <script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
            <script src="${ctx}/static/jquery-ui.min.js"></script>
            <script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>

            <script src="${ctx}/static/js/publishs/aliexpress/smtpublish.js"></script>
            <script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>

            <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
            <script src="${ctx}/static/components/lodash.js"></script>

            <%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
                <%@ include file="/WEB-INF/view/jsp/commodity/template/productoptimize.jsp" %>
