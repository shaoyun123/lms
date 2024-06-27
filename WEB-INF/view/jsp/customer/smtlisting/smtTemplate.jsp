<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<title>速卖通模板</title>
<style>
    .label_select {
        padding: 0 !important;
        margin-left: 5px;
    }

    .fr {
        float: right;
    }

    .w_80 {
        width: 80% !important;
        display: inline-block;
    }

    #pageSort {
        position: fixed;
        background: #fff;
        width: 100%;
        z-index: 99999;
        bottom: 0;
        left: 100px;
        border-top: 1px solid #ccc;
    }

    .layui-table-view,
    .layui-table-main,
    .layui-table-box {
        overflow: visible !important;
    }

    .mt {
        margin-top: 10px;
    }

    .expandall {
        color: lightskyblue;
        position: relative;
        bottom: 0;
        right: 0;
        cursor: pointer;
        display: inline;
    }

    .hidden {
        display: none;
    }

    .dis_flex_start {
        display: flex;
        justify-content: flex-start;
    }

    .dis_flex_center {
        display: flex;
        justify-content: space-between;
    }

    .redStar:before {
        content: "*";
        color: red;
        font-size: 20px;
        padding: 5px;
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

    [data-id=assistImgContains2] .detailImg_prodtpl {
        width: 150px;
        height: 200px;
        border: 1px solid #f2f2f2
    }

    #smtLayertable input[type=file] {
        opacity: 0;
        margin: 20px 0;
    }

    .checkboxGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 25%);
    }

    .checkboxGrid span {
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .checkboxGridLayer {
        display: grid;
        grid-template-columns: repeat(auto-fill, 50%);
    }

    .checkboxGridLayer span {
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    #layernewsmt .layui-form-label {
        width: 180px;
    }

    #layernewsmt .layui-input-block {
        margin-left: 210px;
    }

    .smtTemplate-input-danger {
        border-color: #FF5722 !important
    }

    .smtTemplatefont {
        color:red;
        font-size: 40px;
        margin: 20px;
    }
    
    .ImgDivIn .imgHide{
        display: none;
    }
    #layernewsmt .selfImgIcon {
        color: red;
        width: 10px;
        padding-top: 40px;
        font-size: 12px;
        margin-left: 5px;
    }
    #smtTemp_supplyReq_con .layui-form-label {
        width: 280px;
    }
    #smtTemp_supplyReq_con .layui-input-block {
        margin-left: 310px;
    }
</style>
<div class="layui-fluid" id="LAY-smttemplate">
    <template class="layui-row layui-col-space15" id="smttemplate">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="smttemplateForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <input type="text" class="w_80 layui-input" v-model="formData.cateName"
                                           name="cateName" @click="chooseCate('lazada_Template_lazadaproduct')"
                                           placeholder="选择分类" readonly>
                                    <i class="layui-icon layui-icon-delete" @click="clearCate" style="cursor:pointer"
                                       title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">OA新类目</label>
                                <div class="layui-input-block">
                                    <input name="oaCateIdList" id="smttemp_newcate" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIds" xm-select="bizzOwnerIds" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="">请选择</option>
                                        <option v-for="(item,index) in businessOwnerData" :value="item.id">
                                            {{item.userName}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
<%--                                    <select name="sale" lay-filter="sale">--%>
<%--                                        <option value="">全部</option>--%>
<%--                                        <option value="1" selected>在售</option>--%>
<%--                                        <option value="0">停售</option>--%>
<%--                                    </select>--%>
                                    <select name="isSaleList" xm-select="isSaleList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="2">全部在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="prodAttrList" lay-filter="prodAttrList" lay-search>
                                        <option value="">请选择</option>
                                        <option v-for="(option,index) in productLabel" :value="option.name">{{option.name}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label label_select">
                                    <select name="searchSKUType" lay-filter="searchSKUType">
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSkuExact">父SKU(精确)</option>
                                        <option value="sSkuExact">子SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchSKUValue"
                                           v-model="formData.searchSKUValue" placeholder="多个SKU英文逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label label_select">
                                    <select name="searchType" lay-filter="searchType">
                                        <option value="cnTitle">中文名称</option>
                                        <option value="enTitle">英文标题</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchValue"
                                           v-model="formData.searchValue">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label label_select">
                                    <select name="logisticsType" lay-filter="logisticsType">
                                        <option value="1">物流属性(与)</option>
                                        <option value="2">物流属性(或)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="logisAttrs" xm-select="logisAttrs" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option v-for="(option,index) in logisAttrs" :value="option.name">
                                            {{option.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label label_select">
                                    <select name="timeType" lay-filter="timeType">
                                        <option value="auditTime">审核时间</option>
                                        <option value="createTime">创建时间(基础模板)</option>
                                        <option value="tplCreateTime">创建时间(SMT模板)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="smtTemplateTime" name="time" readonly placeholder="请选择">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售状态</label>
                                <div class="layui-input-block">
                                    <select name="isProhibit" lay-filter="isProhibit">
                                        <option value="">全部</option>
                                        <option value="true">禁售</option>
                                        <option value="false" selected>不禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">SMT模板</label>
                                <div class="layui-input-block">
                                    <select name="haveTpl" lay-filter="haveTpl">
                                        <option value="">全部</option>
                                        <option value="true">有</option>
                                        <option value="false">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量(g)</label>
                                <div class="layui-input-block dis_flex_start">
                                    <input class="layui-input" type="number" min="0"
                                           onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                                           v-model="formData.minWeight">
                                    <input class="layui-input" type="number" min="0"
                                           onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                                           v-model="formData.maxWeight">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品成本(￥)</label>
                                <div class="layui-input-block dis_flex_start">
                                    <input class="layui-input" type="number" min="0"
                                           onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                                           v-model="formData.minCost">
                                    <input class="layui-input" type="number" min="0"
                                           onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                                           v-model="formData.maxCost">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortPlat" xm-select="tortPlat" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="0">wish侵权</option>
                                        <option value="1">wish不侵权</option>
                                        <option value="2">ebay侵权</option>
                                        <option value="3">ebay不侵权</option>
                                        <option value="4">smt侵权</option>
                                        <option value="5" selected>smt不侵权</option>
                                        <option value="6">joom侵权</option>
                                        <option value="7">joom不侵权</option>
                                        <option value="8">amazon侵权</option>
                                        <option value="9">amazon不侵权</option>
                                        <option value="10">shopee侵权</option>
                                        <option value="11">shopee不侵权</option>
                                        <option value="12">lazada侵权</option>
                                        <option value="13">lazada不侵权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devTypes" xm-select="devTypes" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option v-for="(devType,devTypeindex) in devTypeData" :value="devType.name">
                                            {{devType.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">图片状态</label>
                                <div class="layui-input-block">
                                    <select name="imgStatus" id="smtTemplateImgStatus" xm-select="imgStatus" xm-select-search-type="dl"
                                            xm-select-skin="normal">
                                        <option value="">全部</option>
                                        <option value="1" selected>有图</option>
                                        <option value="2" selected>部分</option>
                                        <option value="3">无图</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" v-if="formData.aliexpressTpl">
                                <label class="layui-form-label">模板创建人</label>
                                <div class="layui-input-block">
                                    <select name="tplCreatorId" lay-filter="tplCreatorId" lay-search>
                                        <option value="">请选择</option>
                                        <option v-for="(item,index) in creatorData" :value="item.id">{{item.userName}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByType" lay-filter="orderByType" lay-search>
                                        <option value="1">创建时间(基础模板)倒序</option>
                                        <option value="2">创建时间(基础模板)正序</option>
                                        <option value="3" selected>审核时间倒序</option>
                                        <option value="4">审核时间正序</option>
                                        <option value="9">创建时间（SMT模板）倒序</option>
                                        <option value="10">创建时间（SMT模板）正序</option>
                                        <option value="5">SMT30天销量倒序</option>
                                        <option value="6">SMT30天销量正序</option>
                                        <option value="7">公司30天销量倒序</option>
                                        <option value="8">公司30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" id="smtTemplate_name" />
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" v-if="formData.aliexpressTpl">
                                <label class="layui-form-label">SMT类目</label>
                                <div class="layui-input-block">
                                    <input type="text" class="w_80 layui-input" v-model="formData.smtCatename"
                                           name="smtCatename" @click="chooseSMTCate()" placeholder="选择分类" readonly>
                                    <i class="layui-icon layui-icon-delete" @click="clearSMTCate" style="cursor:pointer"
                                       title="删除SMT类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" v-if="formData.aliexpressTpl">
                                <label class="layui-form-label">必填项状态</label>
                                <div class="layui-input-block">
                                    <select name="complete" lay-filter="complete">
                                        <option value="">全部</option>
                                        <option value="true" selected>已完整</option>
                                        <option value="false">不完整</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" v-if="formData.aliexpressTpl">
                                <label class="layui-form-label">自拍图</label>
                                <div class="layui-input-block">
                                    <select name="selfImgStatusList"  xm-select="smttpl_selfImgStatusList" xm-select-search-type="dl"
                                    xm-select-skin="normal">
                                        <option value="1" >有图</option>
                                        <option value="2" >部分</option>
                                        <option value="0">无图</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 label_select">
                                <a type="button" class="layui-btn layui-btn-sm" @click="searchSubmit('')">搜索</a>
                                <a type="reset" @click="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab">
                        <ul class="layui-tab-title">
                            <li class="layui-this" @click="searchSubmit('smttemplate_smtfoundationTempTable')">
                                基础模板({{count.smttemplate_smtfoundationTempTable}})
                            </li>
                            <li @click="searchSubmit('smttemplate_smtTempTable')">
                                速卖通模板({{count.smttemplate_smtTempTable}})
                            </li>
                        </ul>
                        <div style="position:relative;text-align:right;margin-top:-35px;" v-if="formData.aliexpressTpl && formData.complete == 'false'">
                            <div class="layui-btn layui-btn-sm" @click="smtTemp_supplyReqBtn()">补充必填项</div>
                        </div>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <table class="layui-table" id="smttemplate_smtfoundationTempTable"
                                       lay-filter="smttemplate_smtfoundationTempTable"></table>
                            </div>
                            <div class="layui-tab-item">
                                <table class="layui-table" id="smttemplate_smtTempTable"
                                       lay-filter="smttemplate_smtTempTable"></table>
                            </div>
                        </div>
                    </div>
                    <div id="pageSort"></div>
                </div>
            </div>
        </div>
    </template>
</div>
<!-- 新建smt模板弹框 -->
<script type="text/html" id="smtTemplate_newSmtTemp">
    <form id="layernewsmt" class="layui-form" lay-filter="smttemplete_layernewsmt">
        <div class="layui-row layui-col-space15">
            <div class="layui-card-header mt"><h2>基本信息</h2></div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body layui-row">
                        <div class="layui-col-lg8 layui-col-md8">
                            <label class="layui-form-label">关键词</label>
                            <div class="layui-input-block">
                                <textarea name="keyword" class="layui-textarea" readonly></textarea>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8">
                            <label class="layui-form-label">Wish Tags</label>
                            <div class="layui-input-block">
                                <textarea name="wishTags" class="layui-textarea mt" readonly></textarea>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8 mb10">
                            <label class="layui-form-label">标题</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input mt" name="title">
                                剩余字符： <b></b>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3" style="margin:11px;">
                            <a class="layui-btn layui-btn-xs" id="smtTemplateRandom">随机</a>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8">
                            <label class="layui-form-label">SMT分类</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="smtCategoryName" readonly>
                                <input type="hidden" name="smtCategoryId">
                                <input type="hidden" name="id">
                                <input type="hidden" name="prodPId">
                                <input type="hidden" name="sSkus">
                            </div>
                        </div>
                        <div class="layui-col-lg2 layui-col-md2" style="margin:3px 11px;">
                            <button type="button" class="layui-btn layui-btn-xs" id="chooseCate">
                                选择
                            </button>
                            <h4 style="display: inline;" id="conf"></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md7"><label class="layui-form-label">分类属性</label>
                <div class="layui-input-block" id="SMTnormalAttrList">
                </div>
            </div>
            <div class="layui-col-md5 prodDescAndFixDesc"><label class="layui-form-label">商品描述</label>
                <div class="layui-input-block">
                    <div class="layui-col-md11" style="margin:10px;">
                        <textarea name="prodDesc" placeholder="暂无信息" class="layui-textarea" rows="10" readonly></textarea>
                    </div>
                    <div class="layui-col-md11" style="margin:10px;">
                        <textarea name="fixDesc" placeholder="暂无信息" class="layui-textarea" rows="10" readonly></textarea>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-header"><label class="layui-form-label" style="width: 400px;">自定义属性&nbsp;&nbsp;(&nbsp;仅支持数字和英文，不支持其它字符&nbsp;)</label>
                    </div>
                    <div class="layui-card-body layui-row">
                        <div class="layui-col-md8 layui-col-lg8">
                            <div class="layui-input-block">
                                <div class="layui-input-block dis_flex_start">
                                    <a class="layui-btn layui-btn-normal layui-btn-xs" id="smtAddAttrList">添加自定义属性</a>
                                    <a class="layui-btn layui-btn-normal layui-btn-xs layui-btn-danger"
                                       id="SMTsalePropAttrListDelAllBtn">删除全部</a>
                                </div>
                                <div id="SMTsalePropAttrList">
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
                            <div class="layui-card"><label class="layui-form-label redStar">主图</label>
                                <div class="layui-card-body layui-row" style="padding: 10px 10px 10px 200px;">
                                    <div class="layui-clear pl20 imgContains" data-maxImg="20" data-minImg="1"
                                         data-imgObjType="1"
                                         data-id="mainImgContains1">
                                        <div class="uploadLocalImgBtn"
                                             style="margin-bottom:20px;display:inline-block"></div>
                                        <!--图片上传按钮-->
                                        <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片
                                        </button>
                                        <button type="button"
                                                class="layui-btn layui-btn-sm layui-btn-danger smtTemplateDeleteAll">
                                            批量删除
                                        </button>
                                        <%--<button type="button" class="layui-btn layui-btn-sm" onclick="downLoadAllImg(this)">全部下载--%>
                                        <%--</button>--%>
                                        <div class="smtTemplateFontContain" style="margin-bottom:15px">
                                            <span class="layui-bg-red">说明!</span>
                                            <span>
                                  「主图最多选用<font color="red">20</font>
                                   张,已经选用了<font class="curImgNum" color="green">0</font>
                                   张，主图至少<font color="blue">1</font>张」
                                </span>
                                        </div>
                                        <div class="layui-form">
                                            <ul class="uploadImgUL ui-sortable">
                                            </ul>
                                            <div class="kongImgDivOut" style="display: inline-block;">
                                                <img src="${ctx}/static/img/kong.png"
                                                     style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                                                <!--预览图片-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-card-header"><label class="layui-form-label redStar">辅图</label></div>
                                <div class="layui-card-body layui-row" style="padding: 10px 10px 10px 200px;">
                                    <div class="pl20 layui-clear imgContains" data-maxImg="20" data-minImg="0"
                                         data-imgObjType="4"
                                         data-id="remarkImgContains1">
                                        <div class="uploadLocalImgBtn"
                                             style="margin-bottom:20px;display:inline-block"></div>
                                        <!--图片上传按钮-->
                                        <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片
                                        </button>
                                        <button type="button"
                                                class="layui-btn layui-btn-sm layui-btn-danger smtTemplateDeleteAll">
                                            批量删除
                                        </button>
                                        <%--<button type="button" class="layui-btn layui-btn-sm" onclick="downLoadAllImg(this)">全部下载--%>
                                        <%--</button>--%>
                                        <div style="margin-bottom:15px" class="smtTemplateFontContain">
                                            <span class="layui-bg-red">说明!</span>
                                            <span>
                          「描述图最多选用<font color="red">20</font>张,已经选用了<font class="curImgNum" color="green">0</font>张」
                        </span>
                                        </div>
                                        <div class="layui-form">
                                            <ul class="uploadImgUL ui-sortable">
                                            </ul>
                                            <div class="kongImgDivOut" style="display: inline-block;">
                                                <img src="${ctx}/static/img/kong.png"
                                                     style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                                                <!--预览图片-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-card-header"><label class="layui-form-label redStar">营销图</label></div>
                                <div class="layui-card-body layui-row dis_flex_start"
                                     style="padding: 10px 10px 10px 200px;">
                                    <div class="pl20 layui-clear imgContains" data-maxImg="1" data-minImg="0"
                                         data-imgObjType="3"
                                         data-id="assistImgContains1">
                                        <div class="uploadLocalImgBtn"
                                             style="margin-bottom:20px;display:inline-block"></div>
                                        <!--图片上传按钮-->
                                        <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片
                                        </button>
                                        <button type="button" class="layui-btn layui-btn-sm tempImgBtn" data-imagetype="2">模板图片</button>
<%--                                        <button type="button" class="layui-btn layui-btn-sm autoFillImgBtn2">自动填充白底图</button>--%>
                                        <div style="margin-bottom:15px">
                                            <span class="layui-bg-red">说明!</span>
                                            <span>
                                                1:1
                                            </span>
                                            <span class="fRed">白底图</span>
                                        </div>
                                        <div class="layui-form">
                                            <ul class="uploadImgUL ui-sortable">
                                            </ul>
                                            <div class="kongImgDivOut" style="display: inline-block;">
                                                <img src="${ctx}/static/img/kong.png"
                                                     style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                                                <!--预览图片-->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pl20 layui-clear imgContains" data-maxImg="1" data-minImg="0"
                                         data-imgObjType="2"
                                         data-id="assistImgContains2">
                                        <div class="uploadLocalImgBtn"
                                             style="margin-bottom:20px;display:inline-block"></div>
                                        <!--图片上传按钮-->
                                        <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片
                                        </button>
                                        <button type="button" class="layui-btn layui-btn-sm tempImgBtn" data-imagetype="1">模板图片</button>
<%--                                        <button type="button" class="layui-btn layui-btn-sm autoFillImgBtn1">自动填充场景图</button>--%>
                                        <div style="margin-bottom:15px">
                                            <span class="layui-bg-red">说明!</span>
                                            <span>
                                                3:4
                                            </span>
                                            <span class="fRed">场景图</span>
                                        </div>
                                        <div class="layui-form">
                                            <ul class="uploadImgUL ui-sortable">
                                            </ul>
                                            <div class="kongImgDivOut" style="display: inline-block;">
                                                <img src="${ctx}/static/img/kong.png"
                                                     style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                                                <!--预览图片-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12" id="smtTemplatesmfs">
                <div class="layui-card">
                    <div class="layui-card-header"><h2>售卖方式</h2></div>
                    <div class="layui-card-body layui-row">
                        <div class="layui-form-item">
                            <div class="layui-form-label redStar">
                                min计量单位
                            </div>
                            <div class="layui-input-block">
                                <div class="layui-col-md4">
                                    <select name="productUnit" id="smtTemplate_productUnit">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-form-label">销售方式</div>
                            <div class="layui-input-block dis_flex_start">
                                <input type="checkbox" name="packageType" lay-skin="primary" title="打包出售" value="true">
                                <div class="smtTemplate_input_notetext">(勾选打包出售后，每包数量必填)</div>
                                <div class="mr10 ml10 smtTemplate_span_lh32">,每包</div>
                                <input class="layui-input w100" type="number" value="" name="lotNum" min="1" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                <div class="ml10 smtTemplate_input_notetext">(选择打包出售的情况下，每包数量必须大于1)</div>
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
                            <tbody id="skuParentTable">
                            </tbody>
                        </table>
                        <a class="layui-btn" id="smtLayerRenderTable">生成SKU</a>
                        <div id="skuToTable">
                            <form class="layui-form">
                                <table class="layui-table" lay-size="sm">
                                    <thead id="smtLayertable_thead">
                                    </thead>
                                    <tbody id="smtLayertable">
                                    </tbody>
                                </table>
                                <a class="layui-btn" id="smtLayerIncrease">添加图片属性</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<!--模板table -- 刊登状态 -->
<script type="text/html" id="smttemplete_aep_storeNumTpl">
    <span style="color:#999;">刊登数:</span>
    <a href="javascrpt:;" style="color:blue" onclick="producttpl_getListingStatus('{{d.id}}','aliexpress')">{{
        d.storeNum}}</a>
    <i title="打开速卖通商品" class="layui-icon" style="color: #009688;cursor: pointer;" lay-event="aep_openItem">&#xe615;</i>
</script>
<!--模板table -- 销量 -->
<script type="text/html" id="smttemplete_aep_salesNumTpl">
    <span style="color:#999;">SMT:</span> {{ d.smtSalesNum}}<br>
    <span style="color:#999;">公司:</span> {{ d.totalSalesNum}}<br>
    <span style="color:#999;">竞品:</span> <a href="javascrpt:;" style="color:blue"
                                            onclick="compUrl_producttpl('{{d.pSku}}','{{d.id}}',function(){openSmtComp(d.id)})">{{
        d.compSalesNum}}</a>
</script>
<!--模板table -- 侵权状态 -->
<script type="text/html" id="smttemplete_aep_tortTpl">
    <div style="text-align:left; line-height:13px" class="layui-form">
        {{# if(d.isListingAble == false){ }}
        <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" checked lay-filter="aep_prohibit"
               value="{{d.id}}">
        {{# }else{ }}
        <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" lay-filter="aep_prohibit"
               value="{{d.id}}">
        {{# } }}
        <br><br>
        {{# if(d.isWishTort){ }}
        <input type="checkbox" checked disabled title="wish" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="wish" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.wishTortReason ? d.wishTortReason : ''}}</span><br>

        {{# if(d.isJoomTort){ }}
        <input type="checkbox" checked disabled title="joom" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="joom" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.joomTortReason ? d.joomTortReason : ''}}</span><br>

        {{# if(d.isEbayTort){ }}
        <input type="checkbox" checked disabled title="ebay" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="ebay" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span><br>

        {{# if(d.isAmazonTort){ }}
        <input type="checkbox" checked disabled title="amazon" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="amazon" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span><br>

        {{# if(d.isSmtTort){ }}
        <input type="checkbox" checked disabled title="smt" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="smt" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.smtTortReason ? d.smtTortReason : ''}}</span><br>

        {{# if(d.isShopeeTort){ }}
        <input type="checkbox" checked disabled title="shopee" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="shopee" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span><br>

        {{# if(d.isLazadaTort){ }}
        <input type="checkbox" checked disabled title="tophatter" lay-skin="primary">
        {{# }else{ }}
        <input type="checkbox" disabled title="tophatter" lay-skin="primary">
        {{# } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.lazadaTortReason ? d.lazadaTortReason : ''}}</span><br>
    </div>
</script>
<!--模板table -- 时间 -->
<script type="text/html" id="smttemplete_aep_timeTpl">
    <span style="color:#999;float: left;">&nbsp;&nbsp;审&nbsp;&nbsp;&nbsp;核:</span> {{ Format(d.auditTime, "yyyy-MM-dd")}}
    <br>
    <span style="color:#999;float: left;">&nbsp;&nbsp;自拍图:</span> {{ Format(d.selfImgTime, "yyyy-MM-dd")}}
    <br>
    <span style="color:#999;float: left;">&nbsp;&nbsp;SMT模板:</span> {{ Format(d.tplCreateTime, "yyyy-MM-dd")}}
    {{#  if(d.aliexpressTpl){ }}
    <br>
    <span style="color:#999;float: left;">&nbsp;&nbsp;SMT模板修改:</span> {{ Format(d.tplModifyTime, "yyyy-MM-dd")}}
    {{#  } }}
</script>
<!--模板table -->
<!--模板table -- 操作 -->
<script type="text/html" id="smtTemplatefundationTempOption">
    <a class="layui-btn layui-btn-xs" id="prodDetail_smtListing" data-id="{{d.id}}" prodpsku="{{d.pSku}}">商品详情</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="newTemplates">新建模板</a>
</script>
<!--模板table -- 操作 -->
<script type="text/html" id="smtTempOption">
    <button class="layui-btn layui-btn-xs" lay-event="modifySmt">模板详情</button><br>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="deleteSmt">删除模板</button>
</script>
<!--模板table -- 商品 -->
<script type="text/html" id="smttemplete_aep_cnTitleTpl">
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
    <span class="fr">
    	{{#  if(d.prodAliexpressTags){ }}
		    {{#  if(d.prodAliexpressTags.indexOf('价格有优势') >-1 ){ }}
		        <span class="hp-badge" title="价格有优势">
		        	<i class="layui-icon" style="font-size: 20px; color: green;">&#xe6af;</i>
		        </span>
		    {{#  } }}
		    {{#  if(d.prodAliexpressTags.indexOf('价格无优势') >-1){ }}
		        <span class="hp-badge" title="价格无优势">
		        	<i class="layui-icon" style="font-size: 20px; color: red;">&#xe69c;</i>
		        </span>
		    {{#  } }}
		    {{#  if(d.prodAliexpressTags.indexOf('暂无同款') >-1){ }}
		    <span class="hp-badge layui-bg-blue" title="暂无同款">无</span>
		    {{#  } }}
	    {{#  } }}
    </span>
    <br>
    <span>
        <span style="color:#999;">开发:</span>{{d.bizzOwner || ""}}
        <br>
        <span style="color:#999;">销售:</span>{{d.salePersons || ""}}
         <br>
        <span style="color:#999;">模板创建人:</span>{{d.tplCreators || ""}}
        {{#  if(d.aliexpressTpl){ }}
        <br>
        <span style="color:#999;">模板修改人:</span>{{d.tplModifier || ""}}
	    {{#  } }}
    </span>
    <%--SMT模板展示--%>
    <br>
    <span>
    	{{#  if(d.aliexpressTemplateId == 1){ }}
		    <span style="color:#999;">SMT类目:</span>
	    {{#  } }}
    </span>
</script>

<%--子模板templet 表格--%>
<script type="text/html" id="smttemplete_aep_producttpl">
    {{# if (d.prodTempVarietyDtos) { }}
    <table id="aep_intable_tpl" style="text-align:center;width: 100%">
        <tbody>
        {{# for(var i =0; i < d.prodTempVarietyDtos.length; ++i) { var $value = d.prodTempVarietyDtos[i] }}
        {{# if (i<7) { }}
        <tr>
            {{# } else {}}
        <tr class="myj-hide">
            {{# } }}
            <td width='30%' style="text-align: left;padding-left: 10px;">{{ $value.sSku||'' }}</td>
            <td width='15%'>{{ $value.weight||'' }}</td>
            <td width='15%'><span class="canClickEl"
                                  onclick="tpl_listReferPrice({{ $value.id}})">{{ $value.cost||'' }}</span></td>
            <td width='10%'>
                {{# if ($value.isSale){}}
                <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled"
                     lay-skin="primary">
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
        </tbody>
    </table>
    {{#  if(d.prodTempVarietyDtos.length > 7) { }}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow"
       style="float:right;"><span>+ 展开</span>({{d.prodTempVarietyDtos.length}})</a>
    {{# } }}
    {{# } }}
</script>
<%-- 刊登翻译弹框 --%>
<script type="text/html" id="smtTemp_supplyReq">
    <p style="margin:10px;color:#aaa;">按类目展示未填的分类属性（必要），仅更新为空的模板，过滤已填写的模板</p>
    <form class="layui-form" lay-filter="smtTemp_supplyReq_form">
        <div class="layui-form-item cateSearchCon">
            <div class="layui-col-md6 layui-col-lg6">
                <label class="layui-form-label">速卖通类目</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="smtTemplate_cate" />
                </div>
            </div>
            <div class="layui-col-md4 layui-col-lg4 layui-col-md-offset1">
                <a class="layui-btn layui-btn-sm layui-btn-normal" id="smtTemplate_cate_search">搜索</a>
            </div>
        </div>
        <div id="smtTemp_supplyReq_con"></div>
    </form>
</script>

<!-- 表格数据模板 -->
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script src="${ctx}/static/util/we.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script type="text/javascript" src="${ctx}/static/util/regUtils.js?v=${ver}"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productoptimize.jsp" %>
<script src="${ctx}/static/js/customer/smtlisting/smtTemplate.js"></script>
<script src="${ctx}/static/util/ImgCompareUtil.js?v=${ver}"></script>
<script>
    function getInputType(inputType) {
        if (inputType === 'multiEnumInput' || inputType === 'enumInput') {
            return 'multiEnumInput'
        } else if (inputType === 'singleSelect' || inputType === 'multiSelect') {
            return 'singleSelect'
        } else if (inputType === 'numeric') {
            return 'numeric'
        } else {
            return 'text'
        }
    }

    function transBoolentoStr(Bool) {
        return Bool ? '是' : '否'
    }

    function getOption(str) {
        if (str) {
            return str.split("#,#")
        } else {
            return []
        }
    }

    function expandAll(_this) {
        var tag = $(_this).attr('data-tag')
        if (tag === '1') {
            $(_this).parents('td').find('.expand').removeClass('hidden')
            $(_this).text('收起')
            $(_this).attr('data-tag', '0')
        } else {
            $(_this).parents('td').find('.expand').addClass('hidden')
            $(_this).text('展开所有')
            $(_this).attr('data-tag', '1')
        }
    }
</script>