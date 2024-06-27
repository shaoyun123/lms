<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>亚马逊类目映射</title>

<div class="layui-fluid" id="amazonCateMapping"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card"><!--card-->
                <div class="layui-card-body"><!--card.body-->

                    <form class="layui-form" id="amazonCateMapping_Form">
                        <div class="layui-form-item">
                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                        <select name="salesSite">
                                            <c:forEach items="${amazonMakets}" var="amazonMaket">
                                                <option value="${amazonMaket.getMarketName()}">${amazonMaket.getName()}</option>
                                            </c:forEach>
                                        </select>
                                </div>
                            </div>

                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">属性填写</label>
                                <div class="layui-input-block">
                                    <!--<div class="layui-col-md9 layui-col-lg9">-->
                                    <!--<input name="salesSite" type="text" class="layui-input" placeholder="">-->
                                    <!--</div>-->
                                        <select name="fillflag">
                                            <option value="">全部</option>
                                            <option value="true">已填写</option>
                                            <option value="false">未填写</option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">选择类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                            id="amazonCaateMapping_item">选择类目
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('LAY-amazon-cate-mapping-div','LAY-amazon-cate-mapping-hidden')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-amazon-cate-mapping-hidden" name="categoryId">
                                </div>
                            </div>
                            <div  class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" id="amazonCateMapping_search">搜索
                                </button>
                            </div>
                        </div>
                        
                        


                    </form>
                    <div id="LAY-amazon-cate-mapping-div"></div>
                </div>
            </div>
            <div class="layui-card" id="amazonCateMappingCard">
                <div class="layui-card-body" id="amazonCateMappingTableDiv">
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="amazonCateMappingTable" lay-filter="amazonCateMappingTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 编辑按钮-->
<script type="text/html" id="amazonCateMappingEditBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
</script>

<!-- 弹窗 :编辑 -->
<script type="text/html" id="amazonCateMappingEdit_Layer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="amazonCateMappingEdit_Form">
            <input type="text" name="id" hidden>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">模板类型</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="tempFileName" required lay-verify="required" class="layui-select">
                            <option value="">请选择</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">feed_product_type</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="feedProductType" required lay-verify="required"
                               placeholder="请输入feed_product_type"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">item_type</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="itemType" placeholder="请输入item_type"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">recommended_browse_node</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="recommendedBrowseNode"
                               placeholder="请输入recommended_browse_node"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">color</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="colorKeyName" placeholder="请输入color"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">size</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="sizeKeyName" placeholder="请输入size"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">color_size</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="colorSizeKeyName"
                               placeholder="请输入color_size"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">卖点</label>
                <div class="layui-input-block allBulletPointsClass">
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit lay-filter="updateAmazonCateMapping" id="updateAmazonCateMapping">提交</button>
                </div>
            </div>
        </form>
        <button class="layui-btn layui-btn-xs" onclick="add_bullet_point()" style="position:absolute;bottom:184px;left:70px">新增</button>
    </div>
</script>

<script type="text/html" id="bullet_points_tpl">
    {{# if(d.bulletPoints){d.bulletPoints.split("#,#").forEach(function(bulletPoint){ }}
        <span>{{bulletPoint}}</span><br>
    {{#    });} }}
</script>

<script src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script src="${ctx}/static/js/publishs/amazon/amazonCateMapping.js"></script>