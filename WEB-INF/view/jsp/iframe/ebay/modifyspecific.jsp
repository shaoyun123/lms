<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改Specifics</title>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between
    }

    .layui-form-select dl {
        z-index: 99999
    }

    .card-header {
        background: #ccc;
        line-height: 42px;
        margin: 10px 0;
        padding: 0 10px;
    }

    .itemcard {
        margin: 10px 0;
    }

    .card-header .layui-form-checkbox span {
        color: #4a4a4a;
        font-weight: bold;
        font-size: 20px;
        line-height: 30px;
    }

    #ebayPulish_listDetailForm .imageLeft {
        width: 260px;
        height: 260px;
        margin-right: 20px;
        float: left;
        margin-top: 5px;
        border: 1px solid #ccc;
    }

    #ebayPulish_listDetailForm .imageRight {
        width: 150px;
        display: inline-block;
        border: 1px solid #ccc;
        margin: 0 5px 5px 0;
    }

    #ebayPulish_listDetailForm .imageRight span {
        cursor: pointer;
        color: #73a1bf;
    }

    #ebayPulish_listDetailForm .imageRight .removeEbayImg {
        float: right;
    }

    .ebayPublishStyleLeftBar {
        float: left;
        border: 1px solid #e8e8e8;
        border-left: none;
        border-top: none;
        box-sizing: border-box;
        width: 150px;
    }

    .ebayPublishStyleLeftBar>div {
        width: 100%;
        text-align: center;
        padding: 9px 0;
        cursor: pointer;
    }

    .ebayPublishStyleRightTem {
        /* background: #ffff00; */
        overflow: hidden;
    }

    .ebayPublishStyleRightTem>ul>li {
        width: 16%;
        text-align: center;
        cursor: pointer;
        float: left;
        margin: 10px;
        vertical-align: bottom;
    }

    .ebayPublishStyleRightTem>ul>li>img {
        width: 122px;
        height: 113px;
    }

    .et_activeStyle {
        opacity: 0.5;
    }

    .layui-table td {
        word-break: break-all !important;
    }

    #LAY-publishs-ebay-publish .layui-tab-content {
        padding: 10px 0 !important;
    }

    .xm-select-parent .xm-form-select dl {
        position: static !important;
    }

    #LAY-publishs-ebay-publish .layui-table-box,
    .layui-table-view,
    #LAY-publishs-ebay-publish .layui-border-box .layui-table-view {
        overflow: auto !important;
    }

    #layui-layer9 table tr {
        height: 300px;
    }

    #modifyspecific .layui-form-label {
        width: 150px;
    }

    .fr {
        float: right;
    }

    .result {
        width: 300px;
    }

    .red {
        color: red
    }

    .green {
        color: green
    }

    .w_50 {
        width: 50%
    }
</style>
<div class="layui-fluid">
    <template class="layui-row layui-col-space15" id="modifyspecific">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form">
                        <div class="dis_flex">
                            <input type="checkbox" :checked="isAll" name="chenckall" title="全部" lay-skin="primary" lay-filter="chenckall">
                            <div class="w_50">
                                <label class="layui-form-label">Brand</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" v-model="brand">
                                </div>
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" @click="applyBrand()">一键应用</button>
                            </div>
                            <input type="button" class="layui-btn layui-btn-normal" @click="batchModify" onclick="javascript:;" value="批量提交">
                        </div>
                        <div v-for="(item ,index) in items" class="itemcard">
                            <div class="card-header">
                                <input type="checkbox" :checked="item.ischecked" :data-index="index" :title="item.storeAcct+'----'+item.itemId" lay-skin="primary" lay-filter="itemCheckbox" :data-index="index" name="peritemCheckBox">
                            </div>
                            <div class="card-body dis_flex">
                                <form :id="'ee_editAssiDataForm'+index" class="layui-form">
                                    <div class="layui-row layui-col-space15">
                                        <div class="layui-col-md12">
                                            <div class="layui-card">
                                                <div class="layui-card-header">ebay分类</div>
                                                <div class="layui-card-body layui-row">
                                                    <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                                                        <label class="layui-form-label">第一分类</label>
                                                        <div class="layui-input-block">
                                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" @click="chooseEbayCate1(index,item.siteId)">选择ebay分类</button>
                                                            <button class="layui-btn layui-btn-primary layui-btn-sm" @click="searchCate(index,'1')" type="button">
                                                                <i class="layui-icon layui-icon-search"></i>
                                                            </button>
                                                            <h4 style="display: inline;">{{item.cont1}}</h4>
                                                        </div>
                                                        <input v-model="item.primaryCateId" name="ebayCateId1" type="hidden">
                                                    </div>
                                                    <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                                                        <label class="layui-form-label">第二分类</label>
                                                        <div class="layui-input-block">
                                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" @click="chooseEbayCate2(index,item.siteId)">选择ebay分类</button>
                                                            <button class="layui-btn layui-btn-primary layui-btn-sm" @click="searchCate(index,'2')" type="button">
                                                                <i class="layui-icon layui-icon-search"></i>
                                                            </button>
                                                            <h4 style="display: inline;">{{item.cont2}}</h4>
                                                        </div>
                                                        <input v-model="item.secondCateid" name="ebayCateId2" type="hidden">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 ebayCateSpecifics">
                                            <div class="layui-card">
                                                <div class="layui-card-header">分类属性信息</div>
                                                <div class="layui-card-body layui-row">
                                                    <div v-for="(speitem,speindex) in item.specificsData" class="layui-col-md12 layui-col-lg12">
                                                        <label class="layui-form-label">{{speitem.attrName}}</label>
                                                        <!-- 取值数量maxValuesNums大于1即为多选 -->
                                                        <%--<div v-if="speitem.maxValuesNums<=1">--%>
                                                        <%--speitem.isMultiValues == true 是多选--%>
                                                        <div v-if="!speitem.isMultiValues">
                                                            <!-- 类型为输入框FreeText -->
                                                            <!-- 单选可填写下拉框 -->
                                                            <div v-if="(speitem.valMode == 'FreeText')" class="layui-input-block">
                                                                <div class="layui-input-inline">
                                                                    <input type="text" class="layui-input" :name="speitem.attrName+'_'+index" v-model="item.specific[speitem.attrName]" :value="item.specific[speitem.attrName]" :list="speitem.attrName+index">
                                                                    <datalist :id="speitem.attrName+index">
                                                                        <option value="">请选择</option>
                                                                        <option v-for="(option,optionindex) in speitem.attrList" :value="option">{{option}}</option>
                                                                    </datalist>
                                                                </div>
                                                                <div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填</span><span v-else>选填</span></div>
                                                            </div>
                                                            <!-- 单选不可填写下拉框 -->
                                                            <div v-else class="layui-input-block">
                                                                <div class="layui-input-inline">
                                                                    <select :value="item.specific[speitem.attrName]" v-model="item.specific[speitem.attrName]" :name="speitem.attrName+'_'+index">
                                                                        <option value="">请选择</option>
                                                                        <option v-for="(option,optionindex) in speitem.attrList" :value="option">{{option}}</option>
                                                                    </select>
                                                                </div>
                                                                <div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填</span><span v-else>选填</span></div>
                                                            </div>
                                                        </div>
                                                        <!-- 取值数量大于1即为多选 反之为单选-->
                                                        <div v-else>
                                                            <div v-if="(speitem.valMode === 'FreeText')">
                                                                <div class="layui-input-block">
                                                                    <input v-for="(option,optionindex) in speitem.attrList" type="checkbox" :name="speitem.attrName+'_'+index" :value="option"  lay-skin="primary" :title="option" :checked="ischecked(item.specific,speitem.attrName,option)">
                                                                    <input v-for="(customoption,customopindex) in getArrayfromStr(item.specific[speitem.attrName],',')" v-if="!(speitem.attrList.indexOf(customoption)>-1)" type="checkbox" :name="speitem.attrName+'_'+index" :value="customoption"  lay-skin="primary" :title="customoption" checked>
                                                                    <div class="layui-input-inline" style="float: none;margin-top: 3px;">
                                                                        <input type="text" class="layui-input" placeholder="自定义属性" :name="speitem.attrName+'_'+index+'_custom'">
                                                                    </div>
                                                                    <%--<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填,最多不超过{{speitem.aspectMaxLength||''}}个</span><span v-else>选填,最多不超过{{speitem.aspectMaxLength||''}}个</span></div>--%>
                                                                <%--<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填,最多不超过{{speitem.maxValuesNums}}个</span><span v-else>选填,最多不超过{{speitem.maxValuesNums}}个</span></div>--%>
                                                                </div>
                                                            </div>
                                                            <div v-else>
                                                                <div class="layui-input-block">
                                                                    <div class="layui-form-item">
                                                                        <div class="layui-input-block">
                                                                            <input v-for="(option,optionindex) in speitem.attrList" :name="speitem.attrName+'_'+index" type="checkbox" :value="option"  lay-skin="primary" :title="option" :checked="ischecked(item.specific,speitem.attrName,option)">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <%--<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填,最多不超过{{speitem.maxValuesNums}}个</span><span v-else>选填,最多不超过{{speitem.maxValuesNums}}个</span></div>--%>
                                                                <%--<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;"><span v-if="speitem.minValuesNums>0">必填,最多不超过{{speitem.aspectMaxLength||''}}个</span><span v-else>选填,最多不超过{{speitem.aspectMaxLength||''}}个</span></div>--%>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 ebayCustomSpecifics">
                                            <div class="layui-card">
                                                <div class="layui-card-header">自定义属性信息</div>
                                                <div class="layui-card-body layui-row">
                                                    <div v-for="(customitem,customindex) in item.customizeSpecific" class="layui-form-item">
                                                        <div class="layui-inline">
                                                            <div class="layui-input-inline">
                                                                <input type="text" :value="customitem.name" v-model="customitem.name" placeholder="自定义属性名称" autocomplete="off" class="layui-input">
                                                            </div>
                                                            <div class="layui-form-mid">-</div>
                                                            <div class="layui-input-inline">
                                                                <input type="text" :value="customitem.valuedata" v-model="customitem.valuedata" placeholder="自定义属性值" autocomplete="off" class="layui-input">
                                                            </div>
                                                            <div class="layui-input-inline">
                                                                <span style="cursor: pointer;color: #73a1bf;height: 100%;vertical-align: -webkit-baseline-middle;" @click="deleteCustomSpecific(index,customindex)">移除</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label"></label>
                                                    <div class="layui-inline">
                                                        <button type="button" class="layui-btn layui-btn-normal" @click="addCustomSpecific(index)">添加自定义属性</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div class="fr w_300 result" :class="submitData[getIndex('itemId',submitData,item.itemId)].color" v-if="submitData&&(getIndex('itemId',submitData,item.itemId)>-1)">操作执行结果：{{submitData[getIndex('itemId',submitData,item.itemId)].result}}</div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </template>
</div>
<!-- 搜索分类 -->
<script type="text/html" id="ee_ebayCateSearchTpl">
    <div class="p10">
        <form id="specifics_cateSearchForm" class="layui-form">
            <input type="hidden" name="sourceBtnId">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                    <label class="layui-form-label">关键字</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" @click="searchTrigger">搜索</button>
                </div>
            </div>
        </form>
        <table id="ee_ebayCateSearchTable"></table>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/modifyspecific.js"></script>