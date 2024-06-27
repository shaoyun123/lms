<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>导出模板</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="fl" >
                        <form class="layui-form" lay-filter="exporttemplate_searchForm" id="exporttemplate_searchForm">
                            <select name="templateType" id="exporttemplate_templateType" lay-filter="exporttemplate_templateType" lay-search>
                            </select>
                        </form>
                    </div>
                    <div class="fr">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="exporttemplate_copyAddCaseTypeBtn">复制新增</span>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="exporttemplate_addCaseTypeBtn">新增</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="exporttemplate_table"  lay-filter="exporttemplate_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 操作 --%>
<script type="text/html" id="exporttemplate_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span>
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</span>
    </div>
</script>

<%-- 新增/修改弹框 --%>
<script type="text/html" id="exporttemplate_editOrAddTemplateTpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg4 layui-col-md4">
            <form class="layui-form" id="exporttemplate_editOrAddTemplateForm" lay-filter="exporttemplate_editOrAddTemplateForm" autocomplete="off">
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">模板名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="name">
                    </div>
                </div>
                <div class="layui-form-item" notNull id="exporttemplate_editOrAddTemplateTpl_logisticsTypeId">
                    <label class="layui-form-label">头程方式</label>
                    <div class="layui-input-block">
                        <select name="logisticsTypeId" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea type="text" class="layui-textarea"  name="remark"></textarea>
                    </div>
                </div>
                <div>
                    <div class="layui-btn layui-btn-sm" id="exporttemplate_addOneSheetBtn">新增sheet</div>
                </div>
                <div class="layui-form-item mt10" id="exporttemplate_sheetTableBox">
                </div>
            </form>
        </div>
        <div id="exporttemplate_titleBox" class="layui-col-lg8 layui-col-md8">
            <form class="layui-form" action="" lay-filter="exporttemplate_exportForm" id="exporttemplate_exportForm">
                <input name="curEId" type="hidden">
                <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                    <%--<legend style="font-size:14px">入库单信息</legend>--%>
                <%--</fieldset>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="OA入库单号" title="OA入库单号" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="万邑通单号" title="万邑通单号" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="目的仓" title="目的仓" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="头程渠道" title="头程渠道" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="销售渠道" title="销售渠道" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="Winit产品编码" title="Winit产品编码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="目的仓编码" title="目的仓编码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="验货仓编码" title="验货仓编码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="目标上架时间" title="目标上架时间" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="海外仓实际上架时间" title="海外仓实际上架时间" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱数" title="箱数" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="商品种类" title="商品种类" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="商品总数" title="商品总数" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="总重量(kg)" title="总重量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="入库单状态" title="入库单状态" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="提交时间" title="提交时间" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="发货时间" title="发货时间" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="摊分费用状态" title="摊分费用状态" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="总包装材料费(￥)" title="总包装材料费(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="总头程运费(￥)" title="总头程运费(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="总关税+VAT(￥)" title="总关税+VAT(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="总入库费用(￥)" title="总入库费用(￥)" lay-skin="primary"></div>--%>
                <%--<div style="clear:left"></div>--%>
                <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                    <%--<legend style="font-size:14px">箱子信息</legend>--%>
                <%--</fieldset>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱号" title="箱号" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="万邑通箱子条码" title="万邑通箱子条码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子规格名称" title="箱子规格名称" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子成本(￥)" title="箱子成本(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子长度(cm)" title="箱子长度(cm)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子宽度(cm)" title="箱子宽度(cm)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子高度(cm)" title="箱子高度(cm)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子重量(kg)" title="箱子重量(kg)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子中sku种类" title="箱子中sku种类" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="箱子中货物总数" title="箱子中货物总数" lay-skin="primary"></div>--%>
                <%--<div style="clear:left"></div>--%>
                <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                    <%--<legend style="font-size:14px">子包裹信息</legend>--%>
                <%--</fieldset>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="注册sku" title="注册sku" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="商品条码" title="商品条码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="配货单id" title="配货单id" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="数量" title="数量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="实际上架数量" title="实际上架数量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="平均入库成本(￥)" title="平均入库成本(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="发货成本(￥)" title="发货成本(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="包装材料费(￥)" title="包装材料费(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="头程运费(￥)" title="头程运费(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="万邑通入库费(￥)" title="万邑通入库费(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="关税+VAT(￥)" title="关税+VAT(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard" title="注册申报价值*发货数量"><input type="checkbox" lay-filter="exporttemplate_exportField" value="申报总价" title="申报总价" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard" title="英国申报价值*发货数量"><input type="checkbox" lay-filter="exporttemplate_exportField" value="申报总价(英国)" title="申报总价(英国)" lay-skin="primary"></div>--%>
                <%--<div style="clear:left"></div>--%>
                <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                    <%--<legend style="font-size:14px">发货计划信息</legend>--%>
                <%--</fieldset>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="计划id" title="计划id" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="计划单号" title="计划单号" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="计划数量" title="计划数量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="配货数量" title="配货数量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="发货数量" title="发货数量" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="流程状态" title="流程状态" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="配货状态" title="配货状态" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="预估成本(￥)" title="预估成本(￥)" lay-skin="primary"></div>--%>
                <%--<div style="clear:left"></div>--%>
                <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                    <%--<legend style="font-size:14px">商品信息</legend>--%>
                <%--</fieldset>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="父sku" title="父sku" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="商品sku" title="商品sku" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="物流属性" title="物流属性" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="海关编码" title="海关编码" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="是否带电" title="是否带电" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="是否带磁" title="是否带磁" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="图片路径" title="图片路径" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="采购成本" title="采购成本" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="内包装成本(￥)" title="内包装成本(￥)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="注册申报价值" title="注册申报价值" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="英国申报价值" title="英国申报价值" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="注册链接" title="注册链接" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="中文名称" title="中文名称" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="英文名称" title="英文名称" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="全类目" title="全类目" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="一级类目" title="一级类目" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="一级类目中文" title="一级类目中文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="一级类目英文" title="一级类目英文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="二级类目" title="二级类目" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="二级类目中文" title="二级类目中文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="二级类目英文" title="二级类目英文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="叶子类目" title="叶子类目英文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="叶子类目中文" title="叶子类目中文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="叶子类目英文" title="叶子类目英文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="销售员" title="销售员" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="净重(g)" title="净重(g)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="包装重量(g)" title="包装重量(g)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="毛重(g)" title="毛重(g)" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="材质" title="材质" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="品牌" title="品牌" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="款式" title="款式" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="单位" title="单位" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="规格" title="规格" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="报关中文" title="报关中文" lay-skin="primary"></div>--%>
                <%--<div class="fieldBox_standard"><input type="checkbox" lay-filter="exporttemplate_exportField" value="报关英文" title="报关英文" lay-skin="primary"></div>--%>
                <%--<div style="clear:left"></div>--%>
            </form>
        </div>
    </div>
</script>

<style>
    .exporttemplate_sheetTableDiv{
        border: 1px solid #f2f2f2;
    }
</style>

<script src="${ctx}/static/js/wyt/config/exporttemplate.js"></script>