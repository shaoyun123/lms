<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <title>店铺sku维护</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" lay-filter="publish_storeSkuManage_searchForm" id="publish_storeSkuManage_searchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">商品子SKU</label>
                                    <div class="layui-input-block">
                                        <input name="sSku" type="text" placeholder="单个精确查询" class="layui-input" maxlength="35">
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺子SKU</label>
                                    <div class="layui-input-block">
                                        <input name="storeSkuStr" type="text" placeholder="多个精确查询,以逗号隔开，最多1000个" class="layui-input" maxlength="20000">
                                    </div>
                                </div>
                                <!-- <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">平台</label>
                                    <div class="layui-input-block">
                                        <select name="platCode">
                                            <option></option>
                                            <c:forEach items="${platCodeEnumList}" var="platCode">
                                                <option value="${platCode.name}">${platCode.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div> -->

                                <div class="layui-col-md3 layui-col-lg3 pl20">
                                    <button class="layui-btn layui-btn-sm keyHandle" id="publish_storeSkuManage_searchBtn" type="button">搜索</button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- 表格渲染 -->
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab" lay-filter="publish_storeSkuManage_tab">
                            <div class="layui-card-header" style="width: 888px">
                                <span class="numCount">数量(<span id="publish_storeSkuManage_table_data_num"></span>)</span>
                                <div class="layui-btn layui-btn-danger layui-btn-sm ml10" id="deleList">批量删除</div>
                                <div class="fr">
                                    <div class="layui-btn layui-btn-sm ml10" id="add_storeSkuManage_btn">新增</div>
                                    <div class="layui-btn layui-btn-sm ml10" id="download_storeSkuManage_templat">模板下载</div>
                                    <div class="layui-btn layui-btn-warn layui-btn-sm ml10" id="add_storeSkuManage_byExcel_btn">批量导入</div>
                                    <div class="layui-btn layui-btn-warn layui-btn-sm ml10" id="export_storeSkuManage_btn">批量导出</div>
                                    <input hidden type="file" id="file_addprodSSkuMappingExcelFile">
                                </div>
                            </div>

                            <%--<div class="layui-col-lg12 layui-col-md12">--%>
                                <%--<div class="layui-col-md6 layui-col-lg6" style="height: auto;">--%>
                                    <div class="layui-tab-content" id="publish_storeSkuManage_data_table_content">
                                        <table class="layui-table" id="publish_storeSkuManage_data_table" lay-filter="publish_storeSkuManage_data_table"></table>
                                    </div>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--新增映射-->
    <script type="text/html" id="publish_storeSkuManage_add_layer">
        <div class="p20">
            <form action="" class="layui-form" id="add_prodSSkuMapping_form" lay-filter="add_prodSSkuMapping_form">
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">商品SKU</label>
                    <div class="layui-input-block">
                        <input type="text" name="sSku" autocomplete="off" class="layui-input" placeholder="基础商品SKU">
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">店铺SKU</label>
                    <div class="layui-input-block">
                        <input type="text" name="storeSku" autocomplete="off" class="layui-input" placeholder="店铺SKU">
                    </div>
                </div>
                <!-- <div class="layui-form-item">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <select name="platCode">
                            <option></option>
                            <c:forEach items="${platCodeEnumList}" var="platCode">
                                <option value="${platCode.name}">${platCode.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div> -->
            </form>
        </div>
    </script>
    <script type="text/html" id="publish_storeSkuManage_prod_sku_tpl">
        <input type="text" id="publish_storeSkuManage_prod_sku_{{d.id}}" class="layui-input publish_storeSkuManage_prod_sku_td_input" old_id="{{d.id}}" value="{{d.prod_sku || ''}}">
    </script>
    <script type="text/html" id="publish_storeSkuManage_table_operate_tpl">
        <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
        <a class="layui-btn layui-btn-xs" lay-event="dele">删除</a>
    </script>

    <script type="text/javascript" src="${ctx}/static/js/publishs/public/storeSkuManage.js"></script>