<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<title>lazada类目属性</title>
<div class="layui-fluid" id="lazada_cateAttr">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaCateSearchForm">
                        <div class="layui-form-item">
                            <!-- 站点和属性的select的id和name自己搞定 -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteCode" lay-filter="lazadaCategoryAttr_siteCode">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">属性</label>
                                <div class="layui-input-block">
                                    <select name="attrNullable" id="">
                                        <option value="">全部</option>
                                        <option value="false">未填写</option>
                                        <option value="true">已填写</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">类目id</label>
                                <div class="layui-input-block">
                                   <input class="layui-input" name="cateIdInput">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <!-- 类目这里 我那个公共页面有用法 -->
                                <label class="layui-form-label">类目</label>
                                <div class="layui-input-block">
<%--                                    <button id="lazadaCate_cateSelBtn" type="button"--%>
<%--                                            class="layui-btn layui-btn-sm layui-btn-primary">选择分类--%>
<%--                                    </button>--%>
<%--                                    <i class="layui-icon layui-icon-delete"--%>
<%--                                       onclick="clearCate('lazadaCate_searchNameText','lazadaCate_searchCateId')"--%>
<%--                                       style="cursor:pointer" title="删除产品类目"></i>--%>
                                    <input class="layui-input" id="lazadaCategoryAttr_lazadaCates" />
                                </div>
                            </div>
                            <input id="lazadaCate_searchCateId" type="hidden" name="categoryId">
                            <div class="layui-col-md3 layui-col-lg3">
                                <button type="button" class="layui-btn layui-btn-sm keyHandle" data-type="reload"
                                        id="lazadaCate_search">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="lazadaCate_reset">清空
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="lazadaCate_searchNameText"></div>
                </div>
            </div>
            <div class="layui-card" id="lazadaCategoryAttrCard">
                <div class="layui-card-header">
                    <button class="layui-btn layui-btn-sm" type="button" id="lazadaCatesync">同步</button>
                </div>
                <div class="layui-card-body" id="lazadaCateTableDiv">
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="lazadaCateTable" lay-filter="lazadaCateTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="lazadaCateAttrValueTpl">
    {{# var attrsArry=d.cateAttrs;}}
    {{# for (var i  in attrsArry) { }}
    {{# if(attrsArry[i].attributeValue){ }}
    {{#    if(attrsArry[i].attributeNameTrans){ }}
            {{#    if(attrsArry[i].attributeValueTrans){ }}
                <span>{{attrsArry[i].attributeNameTrans}}({{attrsArry[i].attributeName}}):{{attrsArry[i].attributeValueTrans}}({{attrsArry[i].attributeValue}})</span><br/>
            {{#    }else{ }}
                <span>{{attrsArry[i].attributeNameTrans}}({{attrsArry[i].attributeName}}):{{attrsArry[i].attributeValue}}</span><br/>
            {{#    } }}
            {{#    }else{ }}
            {{#    if(attrsArry[i].attributeValueTrans){ }}
                <span>{{attrsArry[i].attributeName}}:{{attrsArry[i].attributeValueTrans}}({{attrsArry[i].attributeValue}})</span><br/>
            {{#    }else{ }}
                <span>{{attrsArry[i].attributeName}}:{{attrsArry[i].attributeValue}}</span><br/>
            {{#    } }}
    {{#    } }}
    {{# }else{ }}

        {{# if(attrsArry[i].attributeNameTrans){ }}
            <span>{{attrsArry[i].attributeNameTrans}}({{attrsArry[i].attributeName}}):</span><br/>
        {{#    }else{ }}
            <span>{{attrsArry[i].attributeName}}:</span><br/>
        {{#   } }}
    {{# } }}

    {{# } }}
</script>

<!--<script type="text/html" id="lazadaCateNameTpl">-->
    <!--<span>-->
    <!--{{# if(d.categoryNameTrans){ }}-->
        <!--{{d.categoryNameTrans}}({{d.categoryName}})-->
    <!--{{# }else{ }}-->
        <!--{{d.categoryName}}-->
    <!--{{# }}}-->
    <!--</span><br/>-->
<!--</script>-->

<!-- 编辑按钮-->
<script type="text/html" id="editLazadaCateAttrBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-xs" lay-event="delAttr">删除属性</a>
</script>

<script type="text/html" id="editLazadaCateAttrLayer">
    <div class="p20">
        <form id="lazadaSelCateAttrForm" class="layui-form">
            <input type="hidden" name="categoryId">
            <div class="layui-card-body layui-row">
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="editCateDefalutValue" id="editCateDefalutValue">
                        立即提交
                    </button>
                    <!--<button type="reset" class="layui-btn layui-btn-primary">重置</button>-->
                </div>
            </div>
        </form>
    </div>
</script>


<script src="${ctx}/static/js/publishs/lazada/categoryAttr.js"></script>
<script src="${ctx}/static/utils.js"></script>


