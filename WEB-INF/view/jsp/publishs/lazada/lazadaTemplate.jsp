<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>lazada模板</title>
            <style>
                .label_select {
                    padding: 0!important;
                    margin-left: 5px;
                }
                
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                #LAY-lazadatemplate .layui-btn+.layui-btn {
                    margin-left: 0px!important;
                    margin-top: 5px
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
                    overflow: visible!important;
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
                
                .dis_flex {
                    display: flex;
                    justify-content: space-between;
                }

                .redStar:before{
                    content: "*";
                    color: red;
                    font-size: 20px;
                    position: relative;
                    top: 7px;
                    right: 10px;
                }

                #layernewlazada .dropdown-datalist ul{
                    left:0px;
                }
            </style>
            <div class="layui-fluid" id="LAY-lazadatemplate">
                <template class="layui-row layui-col-space15" id="lazadatemplate">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="lazadaTemplatForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">产品类目</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="w_80 layui-input" v-model="formData.cateName" name="cateName" @click="chooseCate('lazada_Template_lazadaproduct')" placeholder="选择分类" readonly>
                                                    <i class="layui-icon layui-icon-delete" @click="clearCate" style="cursor:pointer" title="删除产品类目"></i>
                                                </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">开发专员</label>
                                            <div class="layui-input-block">
                                                <select name="bizzOwnerIdList" xm-select="bizzOwnerIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option value="">请选择</option>
                                                <option v-for="(item,index) in businessOwnerData" :value="item.id">{{item.userName}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">在售状态</label>
                                            <div class="layui-input-block">
                                                <select xm-select="isSaleListLazadaTemp" name="isSaleList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                    <option value=""></option>
                                                    <option value="2" selected>全部在售</option>
                                                    <option value="1" selected>部分在售</option>
                                                    <option value="0">全部停售</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">商品标签</label>
                                            <div class="layui-input-block">
                                                <select name="prodAttrList" lay-filter="prodAttrList">
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
                                                    <option value="pSku2">父SKU(精确)</option>
                                                    <option value="sSku2">子SKU(精确)</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="searchSKUValue" v-model="formData.searchSKUValue">
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
                                                    <input type="text" class="layui-input" name="searchValue" v-model="formData.searchValue">
                                                </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                                <div class="layui-form-label label_select">
                                                    <select name="logisAttrRelation" lay-filter="logisAttrRelation">
                                                        <option value="and">物流属性(与)</option>
                                                        <option value="or">物流属性(或)</option>
                                                    </select>
                                                </div>
                                                <div class="layui-input-block">
                                                        <select name="logisAttr" xm-select="logisAttr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                                <option v-for="(option,index) in logisAttr" :value="option.name">{{option.name}}</option>
                                                            </select>
                                                </div>
                                        </div>
                                        <div class="layui-col-lg4 layui-col-md4">
                                                <div class="layui-form-label label_select">
                                                    <select name="timeType" lay-filter="timeType">
                                                        <option value="createTime">创建时间</option>
                                                        <option value="auditTime">审核时间</option>
                                                    </select>
                                                </div>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" id="time" name="time" readonly>
                                                </div>
                                        </div>
                                        <!-- <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">禁售平台</label>
                                            <div class="layui-input-block">
                                                <select name="prohibitPlat" lay-filter="prohibitPlat">
                                                <option value="">请选择</option>
                                                <option v-for="(option,index) in platForm" :value="option.name">{{option.name}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">禁售站点</label>
                                            <div class="layui-input-block">
                                                <select name="prohibitSalesSiteIdList" xm-select="prohibitSalesSiteIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                    <option v-for="(option,index) in forbiddenSite" :value="option.code">{{option.name}}</option>
                                                </select>
                                            </div>
                                        </div> -->
                                        <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">站点</label>
                                                <div class="layui-input-block dis_flex">
                                                    <select name="salesSite" lay-filter="salesSite">
                                                    <option v-for="(sitename,siteindex) in siteData" :value="sitename.code" :selected="sitename.code==='MY'">{{sitename.name}}</option>
                                                    </select>
                                                    <select name="sellable" lay-filter="sellable">
                                                        <option value="null">全部</option>
                                                        <option value="false">禁售</option>
                                                        <option value="true" selected>不禁售</option>
                                                    </select>
                                                </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">创建人</label>
                                                <div class="layui-input-block">
                                                    <select name="creatorId" lay-filter="creatorId" lay-search>
                                                        <option value="">请选择</option>
                                                        <option v-for="(item,index) in creatorData" :value="item.id">{{item.userName}}</option>
                                                    </select>
                                                </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" v-if="currentIndex=='foundationTempTable'">
                                            <label class="layui-form-label">lazada模板</label>
                                            <div class="layui-input-block">
                                                <select name="haveLazadaModel" lay-filter="haveLazadaModel">
                                                <option value="null">全部</option>
                                                <option value="true">有</option>
                                                <option value="false">无</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">侵权状态</label>
                                            <div class="layui-input-block">
                                                <select name="tortPlatLazada" xm-select="tortPlatLazada" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option value="0">wish侵权</option>
                                                <option value="1">wish不侵权</option>
                                                <option value="2">ebay侵权</option>
                                                <option value="3">ebay不侵权</option>
                                                <option value="4">smt侵权</option>
                                                <option value="5">smt侵权</option>
                                                <option value="6">joom侵权</option>
                                                <option value="7">joom不侵权</option>
                                                <option value="8">amazon侵权</option>
                                                <option value="9">amazon不侵权</option>
                                                <option value="10">shopee侵权</option>
                                                <option value="11">shopee不侵权</option>
                                                <option value="12">lazada侵权</option>
                                                <option value="13" selected>lazada不侵权</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">开发类型</label>
                                            <div class="layui-input-block">
                                                <select name="devTypeList" xm-select="devTypeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option v-for="(devType,devTypeindex) in devTypeData" :value="devType.name">{{devType.name}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" v-if="currentIndex==='lazadaTempTable'">
                                            <label class="layui-form-label">禁售类目</label>
                                            <div class="layui-input-block">
                                                <select name="banCategory" lay-filter="banCategory">
                                                    <option value="">全部</option>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">排序方式</label>
                                            <div class="layui-input-block">
                                                <select name="orderByType" lay-filter="orderByType">
                                                    <option value="1">创建时间倒序</option>
                                                    <option value="2">创建时间正序</option>
                                                    <option value="3">审核时间倒序</option>
                                                    <option value="4">审核时间正序</option>
                                                    <option value="5">30天销量倒序</option>
                                                    <option value="6">30天销量正序</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div v-if="currentIndex==='lazadaTempTable'" class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">组合模板</label>
                                            <div class="layui-input-block">
                                                <select name="groupTemplate" lay-filter="groupTemplate">
                                                    <option value="">全部</option>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">lazada类目</label>
                                                <div class="layui-input-block">
<%--                                                    <input type="text" class="w_80 layui-input" v-model="formData.lazadaCatename" name="lazadaCatename" @click="chooseLazadaCate()" placeholder="选择分类" readonly>--%>
<%--                                                    <i class="layui-icon layui-icon-delete" @click="clearlazadaCate" style="cursor:pointer" title="删除lazada类目"></i>--%>
                                                    <input class="layui-input" id="lazadaTemp_lazadaCates" />
                                                </div>
                                        </div>
                                        <div v-if="currentIndex=='foundationTempTable'" class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">模板类型</label>
                                            <div class="layui-input-block">
                                                <select name="tplType" lay-filter="tplType" lay-search>
                                                    <option value=""></option>
                                                    <option value="0">直邮</option>
                                                    <option value="1">亚马逊精品</option>
                                                    <option value="2">亚马逊精铺</option>
                                                    <option value="3">亚马逊铺货</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div v-if="currentIndex==='lazadaTempTable'" class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">必填项状态</label>
                                            <div class="layui-input-block">
                                                <select name="complete" lay-filter="complete">
                                                    <option value="">全部</option>
                                                    <option value="true">已完整</option>
                                                    <option value="false">不完整</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div v-if="currentIndex==='lazadaTempTable'" class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">是否推荐类目</label>
                                            <div class="layui-input-block">
                                                <select name="sugCate" lay-filter="sugCate">
                                                    <option value="">全部</option>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 label_select">
                                            <button type="button" class="layui-btn layui-btn-sm" @click="searchSubmit('')">搜索</button>
                                            <button type="reset" @click="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                        <div class="layui-card-body">
                                <div class="layui-tab">
                                    <div class="dis_flex">
                                        <ul class="layui-tab-title">
                                            <li class="layui-this" @click="searchSubmit('foundationTempTable')">基础模板({{count.foundationTempTable}})</li>
                                            <li @click="searchSubmit('lazadaTempTable')">lazada模板({{count.lazadaTempTable}})</li>
                                        </ul>
                                        <div>
                                            <a class="layui-btn layui-btn-sm" lay-tips="最大复制10000条" style="margin-top: 5px;" @click="lazadaTemplateCopyPskuBtn">一键复制父SKU</a>
                                        <permTag:perm funcCode="lazada_temp_batch_delete">
                                        <a v-if="currentIndex!=='foundationTempTable'" class="layui-btn layui-btn-sm" id="deleteLazadaTemplateBtn" @click="deleteLazadaTemplateBtn">批量删除</a>
                                        </permTag:perm>
                                            <a v-if="currentIndex==='foundationTempTable'" class="layui-btn layui-btn-sm" @click="lazadaTemplateNewTemplateBtn">新建组合模板</a>
                                        </div>
                                    </div>
                                        <div class="layui-tab-content">
                                          <div class="layui-tab-item layui-show">
                                              <table class="layui-table" id="foundationTempTable" lay-filter="foundationTempTable"></table>
                                          </div>
                                          <div class="layui-tab-item">
                                              <table class="layui-table" id="lazadaTempTable" lay-filter="lazadaTempTable"></table>
                                          </div>
                                        </div>
                                </div>
                                <div id="pageSort"></div>
                        </div>
                        </div>
                    </div>
                </template>
            </div>
            <!-- 新建lazada模板弹框 -->
            <script type="text/html" id="newLazadaTemp">
                <form id="layernewlazada" class="layui-form">
                    <input name="type" type="hidden">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-body layui-row">
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">商品父sku</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="pSku" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">系统类目</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="cateTreeName" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">英文标题</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="enTitle" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">中文名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="cnTitle" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">固定描述</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入内容" name="fixDesc" class="layui-textarea" readonly></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">随机描述</label>
                                        <div class="layui-input-block">
                                            <textarea placeholder="请输入内容" name="prodDesc" class="layui-textarea mt" readonly></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-body layui-row">
                                    <div class="ebayCateDiv layui-col-lg8 layui-col-md8">
                                        <label class="layui-form-label">站点刊登</label>
                                        <div class="layui-input-block">
                                            <select id="site" lay-filter="site" name="site" lay-filter="site">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                                        <label class="layui-form-label">lazada类目</label>
                                        <div class="layui-input-block">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseCate">选择分类</button>
                                            <button class="layui-btn layui-btn-primary layui-btn-sm" type="button" id="searchRecommandCate" data-prodpid="">
                                                    <i class="layui-icon layui-icon-search"></i>
                                            </button>
                                            <h4 style="display: inline;" id="conf"></h4>
                                            <span style="color: red;" class="warningStatusTips"></span>
                                            <span style="color: red;" class="warningCateIdTips">请使用推荐类目</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-header"><label class="layui-form-label">类目属性</label></div>
                                <div class="layui-card-body layui-row">
                                    <div class="layui-col-md12 layui-col-lg12">
                                        <div class="layui-input-block" id="normalAttrList">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-header"><label class="layui-form-label">变种参数</label></div>
                                <div class="layui-card-body layui-row">
                                    <div class="layui-col-md12 layui-col-lg12" id="salePropAttrList">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12">
                            <div class="layui-card">
                                <div class="layui-card-body layui-row">
                                    <div style="display: inline;">
                                        <div class="layui-col-md2">
                                            <label class="layui-form-label">变种参数名</label>
                                            <div class="layui-input-inline">
                                                <input type="text" class="layui-input replaceNameLazada">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2">
                                            <label class="layui-form-label">一键替换为</label>
                                            <div class="layui-input-inline">
                                                <input type="text" class="layui-input replaceNewNameLazada">
                                            </div>
                                        </div>
                                        <button type="button" class="layui-btn layui-btn-sm lazadaTempRep">替换</button>
                                    </div>
                                    <div class="fr"><button type="button" class="layui-btn layui-btn-sm" id="newLine">新增一行</button></div>
                                    <table class="layui-table" id="propertyTable" lay-filter="propertyTable"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </script>
            <!-- 新建lazada模板弹框 -->
            <!-- 搜索推荐分类 -->
            <script type="text/html" id="lazadaCateSearchTpl">
                <div class="p10">
                    <form id="lazadaCateSearchForm" class="layui-form">
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
                    <table id="lazadaCateSearchTable"></table>
                </div>
            </script>
            <!-- 搜索分类 -->
            <!-- 表格数据模板 -->
            <script type="text/html" id="fundationTempOption">
                <button class="layui-btn layui-btn-sm" lay-event="newTemplate">新建lazada模板</button>
            </script>
            <script type="text/html" id="lazadaTempOption">
                <button class="layui-btn layui-btn-sm" lay-event="modifyLazada">修改</button>
                <button class="layui-btn layui-btn-primary layui-btn-sm" lay-event="deleteLazada">删除</button>
            </script>
            <script type="text/html" id="lazada_imageTpl">
                <div>
                    <img width="60" height="60" data-original="${tplIVP}{{d.pImg}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="lazada_time">
                <div style="text-align:left"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div style="text-align:left"><span>审核：</span><span>{{Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
            </script>

            <script type="text/html" id="lazadaTem_time">
                <div style="text-align:left"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div style="text-align:left"><span>更新：</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
            </script>

            <script type="text/html" id="fundation_ssku">
                <div>
                    <table class="layui-table colspantable" style="">
                        {{# layui.each(d.varients, function(index, item){ }} {{# if(index
                        <3){ }} <tr style="border-bottom: 1px solid #e6e6e6 !important;">
                            <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.sSku }}</td>
                            <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                                {{item.color}}
                            </td>
                            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size }}</td>
                            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.isSale||'')}}</td>
                            <td style="width:120px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.haveLazadaModel||'')}}</td>
                            </tr>
                            {{# }else{ }}
                            <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expand hidden">
                                <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.sSku }}</td>
                                <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                                    {{item.color}}
                                </td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size }}</td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.isSale||'')}}</td>
                                <td style="width:120px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.haveLazadaModel||'')}}</td>
                            </tr>
                            {{# } }} {{# }); }}
                    </table>
                    {{# if(d.varients.length>3){ }}
                    <div class="expandall" data-tag="1" onclick="expandAll(this);">展开所有</div>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="lazada_ssku">
                <div>
                    <table class="layui-table colspantable" style="">
                        {{# layui.each(d.varients||[], function(index, item){ }} {{# if(index
                        <3){ }} <tr style="border-bottom: 1px solid #e6e6e6 !important;">
                            <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.sSku }}</td>
                            <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                                {{item.color}}
                            </td>
                            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size }}</td>
                            <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.isSale||'')}}</td>
                            </tr>
                            {{# }else{ }}
                            <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expand hidden">
                                <td style="width:150px;text-align: center;color: #000;font-size: 12px;"> {{item.sSku }}</td>
                                <td style="width:80px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                                    {{item.color}}
                                </td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{item.size }}</td>
                                <td style="width:80px;text-align: center;color: #000;font-size: 12px;"> {{transBoolentoStr(item.isSale||'')}}</td>
                            </tr>
                            {{# } }} {{# }); }}
                    </table>
                    {{# if((d.varients||[]).length>3){ }}
                    <div class="expandall" data-tag="1" onclick="expandAll(this);">展开所有</div>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="lazadalayer_sku">
                {{# if(d.tempSku){ }}
                <div>{{d.tempSku}}</div>
                {{# }else{ }}
                <input type="text" class="layui-input" name="ssku_line" /> {{# }}}
            </script>

            <script type="text/html" id="lazadalayer_proper">
                <div style="text-align:left"><span>颜色：</span>{{d.color||""}}</div>
                <div style="text-align:left"><span>尺寸：</span>{{d.size||""}}</div>
                <div style="text-align:left"><span>款式：</span>{{d.style||""}}</div>
            </script>

            <script type="text/html" id="lazadalayer_saleProp">
                {{# for(var i in d.salePropAttrList){ }}
                <div class="layui-form-item">
                    <%--<label class="layui-form-label">{{d.salePropAttrList[i].attributeLabel}}</label>--%>
                    <%--<div class="layui-input-block">--%>
                        <%--<input type="text" class="layui-input" value="{{d.salePropAttrList[i].attributeValue||''}}" name="{{d.salePropAttrList[i].attributeName+'&'+d.tempSku+'&'+1}}">--%>
                    <%--</div>--%>
                    <label class="layui-form-label" style="width:120px;padding: 0;"><input class="layui-input lazadatemplateinputfocus" value="{{d.salePropAttrList[i].attributeLabel}}" name="{{i+'&'+d.LAY_TABLE_INDEX+'&'+ 99}}"></label>
                    <div class="layui-input-block" style="margin-left: 120px;">
                        <input type="text" style="width: 70%;display: inline-block;" class="layui-input lazadatemplateinputvaluefocus" value="{{d.salePropAttrList[i].attributeValue||''}}" name="{{i+'&'+d.LAY_TABLE_INDEX+'&'+1}}">
                    </div>
                </div>
                {{# }}}
            </script>

            <script type="text/html" id="lazadalayer_skuAttr">
                {{# for(var i in d.skuAttrList){ }}
                <div class="layui-form-item">
                    <label class="layui-form-label">{{d.skuAttrList[i].attributeLabel}}</label>
                    <div class="layui-input-block">
                        {{# console.log(getInputType(d.skuAttrList[i].inputType),'123')}} {{# if(getInputType(d.skuAttrList[i].inputType)==="numeric"){ }}
                        <input type="number" class="layui-input" name="{{d.skuAttrList[i].attributeName+'&'+d.tempSku+'&'+2}}"> {{# }else if(getInputType(d.skuAttrList[i].inputType)==="multiEnumInput"){ }}
                        <div class="layui-input-inline">
                            <input type="text" class="layui-input" name="{{d.skuAttrList[i].attributeName+'&'+d.tempSku+'&'+2}}" list="{{d.skuAttrList[i].attributeName}}">
                            <datalist id="{{d.skuAttrList[i].attributeName}}">
                                <option value="">请选择</option>
                                {{# for(var j in getOption(d.skuAttrList[i].options)){ }}
                                {{# console.log(getOption(d.skuAttrList[i].option)[j])}}
                                {{# if(getOption(d.skuAttrList[i].options)[j]===d.skuAttrList[i].attributeValue){ }}
                                <option  value="{{getOption(d.skuAttrList[i].options)[j]}}" selected>{{getOption(d.skuAttrList[i].options)[j]}}</option>
                                {{# }else{ }}
                                <option  value="{{getOption(d.skuAttrList[i].options)[j]}}">{{getOption(d.skuAttrList[i].options)[j]}}</option>
                                {{# } }}
                                {{# } }}
                            </datalist>
                        </div>
                        {{# }else if(getInputType(d.skuAttrList[i].inputType)==="singleSelect"){ }}
                        <select name="{{d.skuAttrList[i].attributeName+'&'+d.tempSku+'&'+2}}">
                            <option value="">请选择</option>
                            {{# for(var j in getOption(d.skuAttrList[i].options)){ }}
                            {{# if(getOption(d.skuAttrList[i].options)[j]===d.skuAttrList[i].attributeValue){ }}
                            <option  value="{{getOption(d.skuAttrList[i].options)[j]}}" selected>{{getOption(d.skuAttrList[i].options)[j]}}</option>
                            {{# }else{ }}
                            <option  value="{{getOption(d.skuAttrList[i].options)[j]}}">{{getOption(d.skuAttrList[i].options)[j]}}</option>
                            {{# } }}
                            {{# } }}
                    </select> {{# }else{ }}
                        <input type="text" class="layui-input" name="{{d.skuAttrList[i].attributeName+'&'+d.tempSku+'&'+2}}" value="{{d.skuAttrList[i].attributeValue||''}}"> {{# } }}
                    </div>
                </div>
                {{# } }}
            </script>

            <script type="text/html" id="lazadalayerOption">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" style="vertial-align:top" lay-event="moveout">移除</button>
                <%--<button type="button" class="layui-btn layui-btn-sm" style="vertial-align:top" lay-event="addAttr">新增变种属性</button>--%>
            </script>
            <!-- 表格数据模板 -->
            <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
            <script src="/lms/static/js/publishs/lazada/lazadatemplate.js"></script>
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