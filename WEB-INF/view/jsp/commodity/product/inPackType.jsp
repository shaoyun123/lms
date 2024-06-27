<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>入库包装类型</title>
<div class="layui-fluid" id="LAY-work-develop-pl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" id="searchForm_inPackType"
                        autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购专员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${buyers}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${bizzOwners}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="bizzOwner" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入库包装类型</label>
                                <div class="layui-input-block">
                                    <select name="inPackType" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${inPackTypeList}" var="inPackType">
                                            <option value="${inPackType.code}">${inPackType.name}</option>
                                        </c:forEach>
                                        <option value="noSet">未设置</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchType" lay-search>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="model">型号</option>
                                        <option value="specification">规格</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" type="text" class="layui-input" placeholder="多个逗号分隔"
                                        maxlength="1000000">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchTimeType" lay-search>
                                        <option value="3">更新时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="inPackTypeTime">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSaleType" lay-search>
                                        <option value="">全部</option>
                                        <option value="0">停售</option>
                                        <option value="1" selected="selected">在售</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="searchBtn_inPackType" class="layui-btn layui-btn-sm keyHandle" type="button"
                                    data-type="reload">搜索</button>
                                <button type="reset" id="searchReset_inPackType"
                                    class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>

                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="storagePackType_search_cate"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="productlistCard">
                <div class="layui-card-header">
                    <span class="numCount">商品数量<span id="sSkuNum"></span></span>
                    <permTag:perm funcCode="export_inPackType">
                        <button type="button" class="layui-btn layui-btn-sm ml10" id="export_inPackType">导出</button>
                    </permTag:perm>

                    <span class="fr">
                        <permTag:perm funcCode="setList_inPackType">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="setListBtn_inPackType">批量设置</button>
                        </permTag:perm>
                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="inPackTypeTable" lay-filter="inPackTypeTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 批量设置 -->
<script type="text/html" id="updateListPop_inPackType">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form lay-filter="updateListForm_inPackType" class="layui-form" id="updateListForm_inPackType">
                        <div class="layui-form-item pora">
                            <div class="layui-form-item" notNull>
                                <label class="layui-form-label">入库包装类型</label>
                                <div class="layui-input-block">
                                    <select name="inPackType" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${inPackTypeList}" var="inPackType">
                                            <option value="${inPackType.code}">${inPackType.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item" notNull>
                                <label class="layui-form-label">商品子SKU</label>
                                <div class="layui-input-block">
                                    <textarea name="skuList" style="height: 350px;" placeholder="一行一个" id="refund_remark" class="layui-textarea"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="pl_imageTpl">
    {{#  if(typeof(d.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)"  title="点击可设置图片"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)" title="点击可设置图片"/>
    {{# } }}
    <input data-id="{{ d.id }}" type="file" hidden name="skuImg">
</script>

<script type="text/html" id="sSku_inPackType">
    <div style="text-align: left">
        <span class="inpacktype_templet_sSku">{{d.sSku}}</span>
        <span style="float: right; position: relative;top: 15px;">
        {{#  if(d.isSpecialMake == '1'){ }}
        <span class="hp-badge layui-bg-red fr" title="定制产品">定</span>
        {{#  } }}
        </span>
    </div>
</script>

<script type="text/html" id="updateTime_inPackType">
    <div>
        {{ layui.admin.Format( d.auditTime, "yyyy-MM-dd")}}
    </div>
</script>

<script type="text/html" id="editBar_inPackType">
    <a type="button" class="layui-btn layui-btn-xs" lay-event="edit_inPackType">修改</a>
</script>

<script type="text/javascript" src="${ctx}/static/js/commodity/product/inPackType.js"></script>