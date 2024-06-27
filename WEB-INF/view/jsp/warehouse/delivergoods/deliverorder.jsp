<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>发货单</title>
<style>
#deliverorder_content>.layui-card-header {
    display: flex;
    justify-content: space-between;
}
#deliverorder_content .layui-tab .layui-tab-title {
   border-bottom-width: 0 !important;
   border-bottom-style: none;
}
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2" id="agentCompany">
                                <label class="layui-form-label">货代公司</label>
                                <div class="layui-input-block">
                                    <select lay-search name="agentCompany" id="deliveryorder_agentCompany" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN" id="logisticsCompany">
                                <label class="layui-form-label">物流公司</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="logisticsCompany" 
                                        id="logistics_company"
                                        xm-select="deliverorder_logisticsCompany" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal" 
                                        >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3" id = warehouseInvoiceNo>
                                <label class="layui-form-label">发货单</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="invoiceNo">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">包裹号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="packageNo">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="deliverorder_createTime" id="deliverorder_createTime" readonly>
                                </div>
                            </div>

                            <div id="expressTypeStatus">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">发货方式</label>
                                    <div class="layui-input-block">
                                        <select id="delivery_type" lay-search lay-filter="delivery_type">
                                            <option value=""></option>
                                            <option value="1">物流自取</option>
                                            <option value="2">快递发货</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">快递号</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" autocomplete="off" name="express_no">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">快递状态</label>
                                    <div class="layui-input-block">
                                        <select id='express_status' lay-search lay-filter="express_status">
                                            <option value=""></option>
                                            <option value="0">快递收件(揽件)</option>
                                            <option value="1">在途中</option>
                                            <option value="2">正在派件</option>
                                            <option value="3">已签收</option>
                                            <option value="4">派送失败</option>
                                            <option value="5">疑难件</option>
                                            <option value="6">退件签收</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <%-- 正常单还是作废单 --%>
                            <input type="hidden" class="layui-input" autocomplete="off" name="status" value="true" id="deliverorder_status">
                            <div class="layui-col-lg1 layui-col-md1" style="padding-left:5px;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="deliverorder_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="deliverorder_content">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="deliverorder-tabs" id="deliverorder-tabs">
                                <ul class="layui-tab-title">
                                    <li>未生成<span></span></li>
                                    <li class="layui-this">正常单<span>(0)</span></li>
                                    <li>已作废<span></span></li>
                                </ul>
                            </div>
                            <div>
                            <a type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="deliverorder_newAdd">
                            新建发货</a>
                                <permTag:perm funcCode="invoice_detail_newAdd">
                                    <a type="button" class="layui-btn layui-btn-normal layui-btn-sm disN" id="invoice_detail_newAdd">新建包裹</a>
                                </permTag:perm>
                                <permTag:perm funcCode="invoice_main_newAdd">
                                    <a type="button" class="layui-btn layui-btn-normal layui-btn-sm disN" id="invoice_main_newAdd">生成发货单</a>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
               <div class="layui-card-body">
                 <table class="layui-table" id="deliverorder_table"  lay-filter="deliverorder_tableFilter"></table>
               </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格操作栏 --%>
<script type="text/html" id="deliverorder_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
  <a class="layui-btn layui-btn-xs" lay-event="preview" href="${ctx}/static/html/deliverprint.html?id={{d.id}}" target="_blank">预览</a><br>
  {{# if(d.status){ }}
  <a class="layui-btn layui-btn-xs" lay-event="abandon">作废</a>
  {{# }else{ }}
  <a class="layui-btn layui-btn-xs" lay-event="normal">转正常单</a>
  {{# } }}
  <a class="layui-btn layui-btn-xs" lay-event="export">导出</a>
</script>
<%-- 新增开发单弹框 --%>
<script type="text/html" id="deliverorder_newAddLayer">
    <form class="layui-form layui-row" style="margin:15px 50px 10px 0;">
        <div class="layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-md4">
                    <label class="layui-form-label">货代公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="add_agentCompany" lay-search id="add_agentCompany">    
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">包裹号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_packageNo">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">重量(kg)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_weight">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="add_expressCompany" lay-search id="add_expressCompany">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递单号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_expressNo" id = "add_expressNo">
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div style="margin: 0 50px 0 43px;">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>包裹号</th>
                    <th>重量(kg)</th>
                    <th>操作</th>
                </tr> 
            </thead>
            <tbody id="add_deliverorder_tbody" style="text-align: center">
            </tbody>
        </table>
    </div>
</script>


<%-- 新增包裹单弹框 --%>
<script type="text/html" id="invoice_detail_newAddLayer">
    <form class="layui-form layui-row" style="margin:15px 50px 10px 0;">
        <div class="layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-md4">
                    <label class="layui-form-label">包裹号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="invoice_detail_add_packageNo">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">重量(kg)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="invoice_detail_add_weight">
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div style="margin: 0 50px 0 43px;">
        <table class="layui-table">
            <thead>
            <tr>
                <th>序号</th>
                <th>物流公司</th>
                <th>物流方式</th>
                <th>包裹号</th>
                <th>重量(kg)</th>
                <th>备注</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody id="invoice_detail_add_tbody" style="text-align: center">
            </tbody>
        </table>
    </div>
</script>


<%-- 未生成的表格操作栏 --%>
<script type="text/html" id="invoiceDetail_tableIdBar">
    <a class="layui-btn layui-btn-xs" lay-event="delete">删除</a>
</script>


<script type="text/html" id="deliver_type_templet">
    <div>
        {{# if(d.deliveryType == 1){ }}
        物流自取
        {{# }if(d.deliveryType == 2){ }}
        快递发货
        {{# } }}
    </div>
</script>

<script type="text/html" id="deliver_status_templet">
    <div>
        {{# if(d.expressNoStatus == '已签收'){ }}
            已签收({{Format(d.deliveryTime,'yyyy-MM-dd hh:mm:ss')}})
        {{# }if(d.expressNoStatus != null && d.expressNoStatus != '已签收'){  }}
            {{d.expressNoStatus}}
        {{# } }}
    </div>
</script>

<%-- 弹框--生成正常单 --%>
<script type="text/html" id="deliverorder_generatorLayer">
    <form class="layui-form layui-row" style="margin:15px 50px 10px 0;">
        <div class="layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-md4">
                    <label class="layui-form-label">货代公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="generator_agentCompany" lay-search id="generator_agentCompany">    
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="generator_expressCompany" lay-search id="generator_expressCompany">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递单号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="generator_expressNo" id = "generator_expressNo">
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div style="margin: 0 50px 0 43px;">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>包裹号</th>
                    <th>重量(kg)</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr> 
            </thead>
            <tbody id="generator_deliverorder_tbody" style="text-align: center">
            </tbody>
        </table>
    </div>
</script>

<%-- 备注弹框 --%>
<script type="text/html" id="generator_remarkLayer">
    <div class="layui-form" style="padding:20px;">
        <textarea placeholder="请输入内容" class="layui-textarea" name="remark" style="height:450px;"></textarea>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/deliverorder.js"></script>