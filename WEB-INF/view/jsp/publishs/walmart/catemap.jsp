<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>沃尔玛类目映射</title>

<style>
.disFlex {
    display: flex;
}
#walmartCateLayerContainer .layui-form-label {
    width:120px;
}
#walmartCateLayerContainer .layui-input-block {
    margin-left: 150px;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="walmartCatemap_searchForm">
                        <div class="layui-form-item">
                            <label class="layui-form-label">搜索类目</label>
                            <div class="layui-input-block">
                                <input type="radio" name="cate" lay-filter="walmart_cateFilter" value="产品类目" title="产品类目" checked>
                                <input type="radio" name="cate" lay-filter="walmart_cateFilter" value="walmart类目" title="walmart类目">
                            </div>
                        </div>
                        <div class="layui-form-item productCateClass">
                            <label class="layui-form-label">产品类目</label>
                            <div class="layui-input-block" style="display:flex;">
                                <div>
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="walmartprod_cateBtn">选择类目</span>
                                    <input id="walmartprod_cateId" name="categoryId" type="hidden">
                                    <i class="layui-icon layui-icon-delete"
                                        onclick="clearCate('walmartprod_cateDiv','walmartprod_cateId')"
                                        style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                                <div id="walmartprod_cateDiv"></div>
                            </div>
                        </div>
                        <div class="layui-form-item walmartCateClass disN">
                            <label class="layui-form-label">walmart站点</label>
                            <div class="layui-input-block" style="width:150px;">
                                <select name="walmartSite" lay-search>
                                    <option value="us">US</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item walmartCateClass disN">
                            <label class="layui-form-label">walmart类目</label>
                            <div class="layui-input-block" style="display:flex;">
                                <div>
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="walmart_cateBtn">
                                    walmart类目
                                    </span>
                                    <input name="walmartCategoryName" type="hidden">
                                    <i class="layui-icon layui-icon-delete" style="cursor:pointer" title="删除walmart类目" id="walmart_cateIcon">
                                    </i>
                                </div>
                                <div id="walmart_cateDiv"></div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2 walmart_cateSelect">
                                <label class="layui-form-label">是否映射</label>
                                <div class="layui-input-block">
                                    <select name="mappingSite" lay-search>
                                        <option value="US">US</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 walmart_cateSelect">
                                <input type="radio" name="mappingType" value="0" title="全部" checked>
                                <input type="radio" name="mappingType" value="1" title="已映射">
                                <input type="radio" name="mappingType" value="2" title="未映射">
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 walmart_cateSearch">
                                <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="walmartCatemap_submit">
                                    查询
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="walmartCatemapCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 下面的div放按钮,结构不要变化 -->
                            <div style="text-align:right;width:100%;">
                                <span class="layui-btn layui-btn-sm" id="walmart_import">导入类目映射</span>
                                <span class="layui-btn layui-btn-sm" id="walmart_cateBatch">批量映射类目</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="walmartCate_table" lay-filter="walmartCate_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-操作 --%>
<script type="text/html" id="walmart_toolBar">
    <span class="layui-btn layui-btn-xs" lay-event="mapping">类目映射</span>
</script>

<%-- 弹框-类目映射(编辑+批量) --%>
<script type="text/html" id="walmartCateLayer">
    <div style="padding:20px;" id="walmartCateLayerContainer"></div>
</script>
<script type="text/html" id="walmartCateLayerContainerTpl">
    <div class="layui-form-item">
        <div class="layui-form-label">Product Tax Code</div>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="productTaxCode" value="{{d.productTaxCode}}">
        </div>
    </div>
    <div>
        <table class="layui-table">
            <thead>
                <tr>
                    <th width="26">站点</th>
                    <th>类目映射</th>
                    <th>属性映射(颜色,尺寸,款式)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>US</td>
                    <td>
                        <div class="layui-form disFlex">
                            <select name="oneLevel" lay-filter="us_oneLevelCate_filter">
                                {{#  layui.each(d, function(index, item){ }}
                                <option value="{{item.parentCategoryName}}" data-original='{{JSON.stringify(item)}}'>{{item.parentCategoryName}}</option>
                                {{# }) }}
                            </select>
                            <select name="twoLevel">
                                {{#  layui.each(d[0].walmartList, function(index, item){ }}
                                    <option value="{{item.id}}">{{item.fullCategoryName}}</option>
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                    <td>
                        <div class="layui-form disFlex">
                            <select name="color">
                                <option value="">请选择</option>
                                {{#  layui.each(d[0].categoryVarietyAttributeList, function(index, item){ }}
                                    <option value="{{item}}">{{item}}</option>
                                {{# }) }}
                            </select>
                            <select name="size">
                                <option value="">请选择</option>
                                {{#  layui.each(d[0].categoryVarietyAttributeList, function(index, item){ }}
                                    <option value="{{item}}">{{item}}</option>
                                {{# }) }}
                            </select>
                            <select name="style">
                                <option value="">请选择</option>
                                {{#  layui.each(d[0].categoryVarietyAttributeList, function(index, item){ }}
                                    <option value="{{item}}">{{item}}</option>
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</script>

<%-- 弹框-类目映射(选择) --%>
<script type="text/html" id="walmartCateSelLayer">
    <div style="padding:20px;" id="walmartCateSelLayerContainer"></div>
</script>
<script type="text/html" id="walmartCateSelLayerContainerTpl">
    <div>
        <table class="layui-table">
            <thead>
                <tr>
                    <th width="26">站点</th>
                    <th>类目映射</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>US</td>
                    <td>
                        <div class="layui-form disFlex">
                            <select name="oneLevel" lay-filter="us_oneLevelCate_filter">
                                {{#  layui.each(d, function(index, item){ }}
                                <option value="{{item.parentCategoryName}}" data-original='{{JSON.stringify(item)}}'>{{item.parentCategoryName}}</option>
                                {{# }) }}
                            </select>
                            <select name="twoLevel">
                                {{#  layui.each(d[0].walmartList, function(index, item){ }}
                                    <option value="{{item.id}}">{{item.fullCategoryName}}</option>
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</script>


<script src="${ctx}/static/js/publishs/walmart/catemap.js?v=${ver}"></script>