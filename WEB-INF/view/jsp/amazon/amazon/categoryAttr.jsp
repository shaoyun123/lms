<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>亚马逊类目属性</title>
<style>
  #amazonCateMapping_Form .layui-form-switch {
    margin-top: 3px !important;
  }
</style>

<div class="layui-fluid" id="amazonCateMapping"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card"><!--card-->
                <div class="layui-card-body"><!--card.body-->
                    <form class="layui-form" id="amazonCateMapping_Form" lay-filter="amazonCateMapping_Form">
                        <div class="layui-form-item">
                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="salesSite" lay-search>
                                        <c:forEach items="${amazonMakets}" var="amazonMaket">
                                            <option value="${amazonMaket.getMarketName()}">${amazonMaket.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否导入</label>
                                <div class="layui-input-block">
                                    <select name="isImport" id=""  lay-search>
                                        <option value="">请选择</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">类目Id</label>
                                <div class="layui-input-block">
                                    <input placeholder="多个输入英文逗号分隔" class="layui-input" id="LAY-amazon-cate-mapping-hidden" name="categoryId">
                                </div>
                                <%--<div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                            id="amazonCaateMapping_item">选择类目
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('LAY-amazon-cate-mapping-div','LAY-amazon-cate-mapping-hidden')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-amazon-cate-mapping-hidden" name="categoryId">
                                </div>--%>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                              <label class="layui-form-label">全路径</label>
                              <div class="layui-input-block" style="display: flex;">
                                  <input type="text" class="layui-input" name="fullCateName">
                                  <input type="checkbox" name="fullCateNameSearchType" lay-skin="switch" lay-text="精确|模糊" checked>
                              </div>
                          </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                        id="amazonCateMapping_search">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>

                    </form>
                    <div id="LAY-amazon-cate-mapping-div"></div>
                </div>
            </div>
            <div class="layui-card" id="amazonCateMappingCard">
                <div class="layui-card-body" id="amazonCateMappingTableDiv">
                    <div class="layui-card-header" style="display: flex;justify-content: space-between">
                        <div style="display: flex">
                            <permTag:perm funcCode="amazon_cateAttr_tree_import">
                                <button type="button" class="layui-btn layui-btn-sm ml10" id="amazonCateAttrTreeImportBar">
                                    类目树维护
                                </button>
                            </permTag:perm>
                            <permTag:perm funcCode="amazon_cateAttr_attr_import">
                                <button type="button" class="layui-btn layui-btn-sm ml10" id="amazonCateAttrImportBar">
                                    类目属性维护
                                </button>
                            </permTag:perm>
                        </div>
                        <permTag:perm funcCode="amazon_cateAttr_batchDelete">
                        <a class="layui-btn layui-btn-sm layui-btn-danger" id="amazonCateAttr_batchDelete">批量删除属性</a>
                        </permTag:perm><%-- <button type="button" class="layui-btn  layui-btn-sm ml10" onclick="document.getElementById('sInfoExcel_productlist').click()">导入</button>
                             <input type="file" name="sInfoExcel" id="sInfoExcel_productlist" hidden>--%>
                    </div>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="amazonCateAttrTable" lay-filter="amazonCateAttrTable"></table>
                </div>

            </div>
        </div>
    </div>
</div>

<!-- 编辑按钮-->
<script type="text/html" id="amazonCateMappingEditBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-xs" lay-event="delAttr">删除属性</a>
</script>

<%--弹窗 :多文件导入--%>
<script type="text/html" id="amazonCateAttrImportBar_Layer">
    <!--精确select-->
    <div class="layui-form" lay-filter="amazonCateAttrImportForm">
        <div class="layui-form-item" id="amazonCateMapping_Form2" style="width: 40%;">
            <label class="layui-form-label">站点</label>
            <div class="layui-input-block">
                <select name="popSalesSite" id="selectSite" lay-search>
                    <c:forEach items="${amazonMakets}" var="amazonMaket">
                        <option value="${amazonMaket.getMarketName()}">${amazonMaket.getName()}</option>
                    </c:forEach>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-upload" style="margin:0px 15px 0px 15px">
                <button type="button" class="layui-btn layui-btn-normal" id="testList">选择文件</button>
                <div class="layui-upload-list">
                    <table class="layui-table">
                        <thead>
                        <tr>
                            <th>文件名</th>
                            <th>大小</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="demoList"></tbody>
                    </table>
                </div>
                <button type="button" class="layui-btn" id="testListAction">开始上传</button>
                <%--<button type="button" class="layui-btn" id="back">返回</button>--%>
            </div>
        </div>
    </div>

</script>

<!-- 弹窗 :编辑 -->
<script type="text/html" id="amazonCateAttrEdit_Layer">
    <div class="p20">
        <form class="layui-form" id="amazonCateMappingEdit_Form" lay-filter="amazonCateMappingEdit_Form">

        </form>
    </div>
</script>

<script type="text/html" id="bullet_points_tpl">
    {{# if(d.bulletPoints){d.bulletPoints.split("#,#").forEach(function(bulletPoint){ }}
    <span>{{bulletPoint}}</span><br>
    {{#    });} }}
</script>

<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/categoryAttr.js"></script>