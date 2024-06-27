<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>采购退回单</title>
            <style>
                .dis_flex {
                    display: flex;
                    justify-content: space-between;
                }

                .dis_flex_start {
                    display: flex;
                    justify-content: flex-start;
                }

                #LAY-rebackorder .layui-form-label {
                    padding: 0!important;
                    line-height: 31px!important;
                }

                .pd {
                    padding: 10px!important;
                }

                .ml {
                    margin-left: 10px;
                }

                .text_l {
                    text-align: left;
                }

                .font_color {
                    color: #aaa!important;
                }

                .font_weight {
                    font-weight: 600 !important;
                }

                #LAY-rebackorder .canClickEl {
                    color: #000!important;
                }
                .icon_refresh {
                    margin: 5px 10px!important;
                    cursor: pointer;
                    font-weight: 700;
                    display: inline;
                }
                .stockin_title {
                    line-height: 31px;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 10px;
                }
                #LAY-rebackorder .layui-btn+.layui-btn {
                    margin-left: 0px!important;
                }
                .fieldBox_purchaseOrder {
                    float: left;
                    width: 20%;
                    height: 25px;
                }
                form.border {
                    border-top: 1px solid #e6e6e6;
                    border-bottom: 1px solid #e6e6e6;
                }
            </style>
            <div class="layui-fluid" id="LAY-rebackorder">
                <div class="layui-row  layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form  class="layui-form" id="rebackorder_search_form">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label">
                                                <select name="skuSearchType" id="rebackorderskuSearchType">
                                                    <option value="1">子SKU</option>
                                                    <option value="2">父SKU</option>
                                                    <option value="3">子SKU精确</option>
                                                    <option value="4">父SKU精确</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="skuList" class="layui-input" placeholder="默认模糊查询">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">仓库</label>
                                            <div class="layui-input-block">
                                                <select name="storeId" id="rebackorder_warehouseList" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">采购员</label>
                                            <div class="layui-input-block">
                                                <select name="buyerList" id="rebackorder_buyerList" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">制单人</label>
                                            <div class="layui-input-block">
                                                <select name="preparedId" id="rebackorder_listerList" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">供应商</label>
                                            <div class="layui-input-block dimSearchContent">
                                                <input type="hidden" name="reback_supplierId_input" id="reback_supplierId_input">
                                                <div><input id="reback_searchSupplier_input"  name="supplierName" class="layui-input" /></div>
                                                <div class="dimResultDiv"></div>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" style="padding-left:10px;">
                                            <div class="layui-form-label">
                                                <select name="orderType" id="rebackorderType">
                                                    <option value="backNumberList">采购退回单</option>
                                                    <option value="storageNumberList">采购入库单</option>
                                                    <option value="billNumberList">采购订单</option>
                                                    <option value="aliNumberList">1688单号</option>
                                                    <option value="deliveryNumberList">快递单号</option>
                                            </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderNumber" class="layui-input" placeholder="">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">出库单备注</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="remark" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">内部标签</label>
                                            <div class="layui-input-block">
                                                <select name="internalLabelList" id="rebackorder_insiteNoteBackType"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <div class="layui-form-label ml">
                                                <select name="timeType">
                                                    <option value="0">制单时间</option>
                                                    <option value="1">审核时间</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="timerange" id="rebackorder_timerange_input" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" style="text-align:right">
                                            <button type="button" class="layui-btn layui-btn-sm"  lay-filter="rebackorder_search_btn" id="rebackorder_search_btn">查询</button>
                                            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card" id="rebackorderCard">
                            <div class="layui-tab" id="rebackorder_data_count_tab"  lay-filter="rebackorder_data_count_tab">
                                    <div class="layui-card-header dis_flex">
                                        <ul class="layui-tab-title fl">
                                            <li class="layui-this" data-index="0">未审核(<span class="num" id="rebackorder_data_count_span0" data-index="0"></span>)</li>
                                            <li  data-index="1">已审核(<span class="num" id="rebackorder_data_count_span1"  data-index="1"></span>)</li>
                                            <li  data-index="3">作废(<span class="num"  id="rebackorder_data_count_span3"  data-index="3"></span>)</li>
                                        </ul>
                                        <div class="btn-group">
                                            <permTag:perm funcCode="add_purchaserOrderStorageBack">
                                                <button class="layui-btn layui-btn-sm" id="rebackorder_add_btn">新增</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="audit_purchaserOrderStorageBack">
                                                <button class="layui-btn layui-btn-sm" id="rebackorder_bacthAudit_btn">批量审核</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="export_purchaserOrderStorageBack">
                                                <button class="layui-btn layui-btn-sm" id="rebackorder_export_btn">导出退回单</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                <table class="layui-table" id="rebackorder_dataTable" lay-filter="rebackorder_dataTable"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--编辑采购退回单弹窗-->
            <script type="text/html" id="rebackorder_modify_layer">
                <div class="layui-row  layui-col-space15">
                    <div class="layui-tab" lay-filter="rebackorder_detail_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this">详情</li>
                            <li isLog="1">日志</li>
                        </ul>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <div class="layui-col-lg12 layui-col-md12">
                                    <form  class="layui-form  pd" id="rebackorder_update_bill_form">
                                        <div class="layui-form-item">
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">原入库单</label>
                                                <div class="layui-input-block ">
                                                    <input type="text" name="storageNumber" id="rebackorder_update_storageNumber_input" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">采购仓库</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="warehouseName" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">部门</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="orgName" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">采购专员</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="buyer" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">供应商</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="supplierName" class="layui-input"  disabled>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <form  class="layui-form  pd border" id="rebackorder_update_reback_form">
                                        <div class="layui-form-item">
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">单号</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="backNumber" id="layer_rebackorderNo" class="layui-input" placeholder="系统生成" readonly>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">制单时间</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="createTime" id="layer_rebackordertime" readonly placeholder="当前提交时间">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">快递方式</label>
                                                <div class="layui-input-block">
                                                    <select name="deliveryType" id="rebackorderlayer_deliverType" lay-verify="required" lay-search=""></select>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">快递单号</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="deliveryNumber" lay-verify="required">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">公司付快递费</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="deliveryCost" lay-verify="required">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">退回物流费</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="logisticFee" lay-verify="required">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">付款方式</label>
                                                <div class="layui-input-block">
                                                    <select name="payType" id="rebackorderlayer_payTypeList" lay-verify="required"></select>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg4 layui-col-md4">
                                                <label class="layui-form-label">退回地址</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="backAddress" lay-verify="required">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg42 layui-col-md2">
                                                <label class="layui-form-label">内部标签</label>
                                                <div class="layui-input-block">
                                                    <select xm-select="rebackorderlayer_insiteNoteType" xm-select-skin="normal" name="internalLabel" id="rebackorderlayer_insiteNoteType" lay-verify="required"></select>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">实际退回金额</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="actBackMoney" class="layui-input">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg2 layui-col-md2">
                                                <label class="layui-form-label">备注</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="remark" class="layui-input">
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="layui-col-lg12 layui-col-md12">
                                    <div class="dis_flex_start pd">
                                        <div class="stockin_title">退回商品</div>
                                        <!--20190827普源不支持增加或则删除sku-->
                                     <%--   <button class="layui-btn layui-btn-sm" id="rebackorder_modify_addItem_btn">添加商品</button>--%>
                                    </div>
                                    <div class="pd">
                                        <table class="layui-table" id="rebackorder_update_sku_table" lay-filter="rebackorder_update_sku_table"></table>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-tab-item p20">
                                <div class="layui-tab layui-tab-brief">
                                    <div class="layui-show">
                                        <table class="layui-table" id="rebackorder_purStorageBackLogTab" lay-filter="stockinorder_purStorageLogTab"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </script>
            <!--添加商品弹窗-->
            <script type="text/html" id="rebackorder_additem_layer">
                <div class="layui-row  layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form  class="layui-form  pd" id="">
                            <div class="layui-form-item">
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">商品SKU</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="layer_sku" id="rebackorder_additem_sku_input" class="layui-input" placeholder="">
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <div class="layui-input-block">
                                        <button class="layui-btn layui-btn-sm" id="rebackorder_additem_search_btn">查询</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="pd">
                            <table class="layui-table" id="rebackorder_additem_table" lay-filter="rebackorder_additem_table"></table>
                        </div>
                    </div>
                </div>
            </script>
            <script type="text/html" id="rebackorder_rebackorderNo_tpl">
                <div class="text_l">
                    <span class="font_color">退回:</span>
                    <span class="canClickEl showSpan clcikRoutTo pora copySpan">
                        <a>{{d.backNumber || ''}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                    </span>
                </div>
                <div class="text_l">
                    <span class="font_color">入库:</span>
                    <span class="canClickEl showSpan clcikRoutTo pora copySpan">
                        <a>{{d.storageNumber || ''}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                    </span>
                </div>
                <div class="text_l">
                    <span class="font_color">采购:</span>
                    <span class="canClickEl showSpan clcikRoutTo pora copySpan">
                        <a>{{d.mainBillNumber || ''}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                    </span>
                </div>
                <div class="text_l">
                    <span class="font_color">1688:</span>
                    <span class="canClickEl showSpan clcikRoutTo pora copySpan" data-routUrl="https://trade.1688.com/order/new_step_order_detail.htm?orderId={{d.ali1688OrderNo || ''}}">
                        <a>{{d.ali1688OrderNo || ''}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                    </span>
                </div>
            </script>
            <!--库位模板-->
            <script type="text/html" id="rebackorder_stockinlocation_tpl">
                {{# if(d.stockLocation){ }}
                    <div>{{d.stockLocation}}</div>
                    <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                {{# }}}
            </script>
            <script type="text/html" id="rebackorder_deliveryNumber_tpl">
                <div style="font-size: 10px;line-height: 20px;text-align: left;">
                    <div>[<span class="font_weight">{{d.deliveryTypeName || ''}}</span>]</div>
                    <div>
                        <span class="canClickEl showSpan pora clcikRoutTo copySpan" data-routUrl="https://www.baidu.com/s?wd={data}">
                            <a>{{d.deliveryNumber || ''}}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                         </span>
                    </div>
                    <div><span class="">快递费</span>: {{d.deliveryCost || '0'}}</div>
                    <div><span class="">退回物流费</span>:{{d.logisticFee || '0'}}</div>
                </div>
            </script>
            <!--退回金额-->
            <script type="text/html" id="rebackorder_backMoney_tpl">
                <div style="font-size: 10px;line-height: 20px;text-align: left;">
                    <div title="含运费退回单价*数量 求和"><span class="">退回总额：</span>{{d.backMoney || '0'}}</div>
                    <div title="含税单价*数量 求和"><span class="">含税总额：</span>{{d.totalBackMoney || '0'}}</div>
                    <div><span class="">实际退回金额：</span>{{d.actBackMoney || '0'}}</div>
                </div>
            </script>
            <script type="text/html" id="purBackOrder_createTime">
                <div class="text_l"><span class="font_color">制单时间:</span><span>{{Format((d.createTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div class="text_l">
                    {{# if(d.auditTime){ }}
                        <span class="font_color">审核时间</span>:<span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                    {{# }}}
                </div>
            </script>
            <script type="text/html" id="rebackorder_tpl_creator">
                <div class="text_l"><span class="font_color">采购:</span><span>{{d.buyer}}</span></div>
                <div class="text_l"><span class="font_color">制单:</span><span>{{d.creator}}</span></div>
                <div class="text_l">
                    {{# if(d.auditor){ }}
                        <span class="font_color">审核:</span><span>{{d.auditor}}</span>
                    {{# }}}
                </div>
            </script>
            <!--采购退回单操作-->
            <script type="text/html" id="stockin_tpl_option">
                <a class="layui-btn layui-btn-xs" lay-event="edit">详情</a><br>
                {{# if(d.processStatus == "0"){}}
                <permTag:perm funcCode="operation_purchaserOrderStorageBack_abodon">
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="abodon">作废</a><br>
                </permTag:perm>
                {{# }}}
            </script>
            <!--退回单价-->
            <script type="text/html" id="rebackorder_backPrice_tpl">
                <input  class="layui-input" name="backPrice" value="{{d.backPrice}}" min="0">
            </script>
            <!--本次退回数量-->
            <script type="text/html" id="rebackorder_rebackNum_tpl">
                <input class="layui-input" name="backNum" value="{{d.backNum}}" min="0" readonly style="background-color: #cccccc" >
            </script>
            <script type="text/html" id="rebackorder_sku_operate_tpl">
                {{# if(d.backNumber == null ||d.backNumber==''){ }}
                <permTag:perm funcCode="operation_purchaserOrderStorageBack">
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                </permTag:perm>
                {{# }}}
            </script>
            <!--导出采购退回单--->
            <script type="text/html" id="rebackinorder_export_pop">
                <form class="layui-form">
                    <div><input type="checkbox" title="全选" lay-filter="rebackinorder_export_selectAll"></div>
                </form>
                <div class="p20">
                    <div class="layui-tab layui-tab-card">
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show p20">
                                <form class="layui-form" id="rebackinorder_export_form" lay-filter="rebackinorder_export_form">
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">基本信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回单号" title="退回单号" disabled lay-skin="primary" checked></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库单号" title="入库单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购单号" title="采购单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="1688单号" title="1688单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="供应商" title="供应商" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购员" title="采购员" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="仓库" title="仓库" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">子表信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="子SKU" title="子SKU" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品名称" title="商品名称  " lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="父SKU" title="父SKU" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购价格" title="采购价格" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="库位" title="库位" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库数量" title="入库数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回数量" title="退回数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回金额" title="退回金额" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">基本信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回总数量" title="退回总数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回总金额" title="退回总金额" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="快递方式" title="快递方式" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="快递单号" title="快递单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="退回备注" title="退回备注" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="流程状态" title="流程状态" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建人" title="创建人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建时间" title="创建时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核人" title="审核人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核时间" title="审核时间" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </script>

<%@ include file="/WEB-INF/view/jsp/purchases/purchases/createStockBackOrder.jsp"%>
<script type="text/javascript" src="${ctx}/static/js/purchases/rebackorder.js"></script>