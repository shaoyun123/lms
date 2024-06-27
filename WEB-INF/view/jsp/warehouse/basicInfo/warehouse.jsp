<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>仓库管理</title>

<div class="layui-fluid" id="warehouse"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <button class="layui-btn layui-btn-sm disN" id="warehouse_search" >搜索</button>
                    <button class="layui-btn layui-btn-sm" id="warehouse_add">新增</button>
                </div>
            </div>
            <%-- 表格模块 --%>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="warehouse_table1" lay-filter="warehouse_table1"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 工具栏 --%>
<script type="text/html" id="warehouse_bar">
    <button class="layui-btn layui-btn-xs" lay-event="warehouse_tr_edit">编辑</button>
    <button class="layui-btn layui-btn-xs" lay-event="warehouse_tr_del">删除</button>
    <button class="layui-btn layui-btn-xs" lay-event="warehouse_tr_edit_resource">授权角色</button>
</script>

<%-- 编辑详情弹框 --%>
<script type="text/html" id="warehouse_tpl1">
    <div class="p20">
        <form action="" class="layui-form" id="warehouse_form2">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">仓库名称</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" class="layui-input" required name="warehouseName">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">海外仓国家</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" class="layui-input" name="overseasWhCountry">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">地址</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" class="layui-input" name="address">
                    </div>
                </div>
            </div>
            <!-- <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">普源仓库ID</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="number" class="layui-input" name="allRootId">
                    </div>
                </div>
            </div> -->
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-inline" style="width:300px">
                        <textarea class="layui-textarea" name="remark"></textarea>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" style="margin-left: 80px">
                    <input type="checkbox" name="isDefault" title="是否默认仓库" lay-skin="primary">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" style="margin-left: 80px">
                    <input type="checkbox" name="ifFbaDefault" title="是否fba默认仓库" lay-skin="primary">
                </div>
            </div>
            <!-- <div class="layui-form-item">
                <div class="layui-inline" style="margin-left: 80px">
                    <input type="checkbox" name="shelfCheck" title="上架时是否校验库位" lay-skin="primary" checked>
                </div>
            </div> -->
            <div class="layui-form-item">
                <div class="layui-inline" style="margin-left: 80px">
                    <input type="checkbox" name="isSplitComp" title="拆分组合品" lay-skin="primary">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" title="一条龙流程SKU缺货订单数量限制">一条龙缺货订单数 ≥ </label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="number" class="layui-input" name="osoOrderNum">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" title="一条龙流程SKU缺货商品数量限制">一条龙缺货商品数 ≥ </label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="number" class="layui-input" name="osoSkuNum">
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="editRoleResourceLayer">
    <div style="padding:10px 20px 20px 20px">
        <table id="editRoleResourceTable"></table>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/warehouse.js"></script>