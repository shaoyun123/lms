<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>采购入库单</title>
            <style>
                #LAY-stockinorder .layui-form-label {
                    padding: 0!important;
                    line-height: 31px!important;
                }

                .dis_flex {
                    display: flex;
                    justify-content: space-between;
                }

                .dis_flex_start {
                    display: flex;
                    justify-content: flex-start;
                }

                .laytable-cell-1-SKU {
                    padding: 0 !important;
                }

                .pd {
                    padding: 10px!important;
                }

                .icon_refresh {
                    margin: 5px 10px!important;
                    cursor: pointer;
                    font-weight: 700;
                }

                .stockin_title {
                    line-height: 31px;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 10px;
                }

                .border {
                    border-top: 1px solid #e6e6e6;
                    border-bottom: 1px solid #e6e6e6;
                }

                .ml {
                    margin-left: 10px;
                }

                #LAY-stockinorder .layui-btn+.layui-btn {
                    margin-left: 0px!important;
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

                #LAY-stockinorder .canClickEl {
                    color: #000!important;
                }

                .layui-layer-page .layui-layer-content {
                    overflow-x: hidden!important;
                }

                .gredBack {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                .fieldBox_purchaseOrder {
                    float: left;
                    width: 20%;
                    height: 25px;
                }

                .trLineBox {
                    float: left;
                    width: 100%;
                    height: 50px;
                }
                table.colspantable td{
                    border:0px;
                }
                .layui-card-header .layui-icon {
                    position: sticky;
                }

                .layui-table img {
                    max-width: 120px;
                }
                .remark_stronger {
                    background: antiquewhite;
                    color: red !important;
                    font-size: 16px !important;
                    font-weight: 600;
                    word-break: break-word;
                }
                .remark_stronger .layui-table-cell {
                    color: red !important;
                }
            </style>
            <div class="layui-fluid" id="LAY-stockinorder">
                <div class="layui-row  layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form  class="layui-form" id="stockinForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label">
                                                <select name="skuSearchType" id="stockinskuSearchType">
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
                                                <select name="storeId" id="stockinwarehouseList"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId" lay-filter="stockin_buyerOrg" class="orgs_hp_custom" id="stockin_buyerOrg">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">采购员</label>
                                            <div class="layui-input-block">
                                                <select name="buyerList" id="stockin_buyerList" xm-select="stockin_buyerList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" class="users_hp_custom" data-roleList="采购专员" ></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">制单人</label>
                                            <div class="layui-input-block">
                                                <select name="preparedId" id="stockinlisterList" lay-search ></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">点货人</label>
                                            <div class="layui-input-block">
                                                <select name="scanPersonId" id="stockinscanPersonList" lay-search ></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">供应商</label>
                                            <div class="layui-input-block dimSearchContent">
                                                <input type="hidden" name="stockin_supplierId" id="stockinorder_supplierId_input">
                                                <div>
                                                    <input id="stockinorder_searchSupplier_input"  name="supplierName" class="layui-input" />
                                                </div>
                                                <div class="dimResultDiv"></div>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" style="padding-left:10px;">
                                            <div class="layui-form-label">
                                                <select name="orderType" id="orderType">
                                                    <option value="0">采购入库单</option>
                                                    <option value="1">采购订单</option>
                                                    <option value="2">1688单号</option>
                                                    <option value="3">快递单号</option>
                                            </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderNumber" id="stockinorder_orderNumber" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">入库单备注</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="remark" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">内部标签</label>
                                            <div class="layui-input-block">
                                                <select name="insiteNoteType" id="stockininsiteNoteType"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">审核人</label>
                                            <div class="layui-input-block">
                                                <select name="auditorId" id="stockinauditorList" lay-search ></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2" style="padding-left:10px;">
                                            <label class="layui-form-label">排序方式</label>
                                            <div class="layui-input-block">
                                                <select name="orderByStr" id="orderByStr">
                                                    <option value="pstorage.create_time desc">创建时间倒序</option>
                                                    <option value="pstorage.create_time asc">创建时间正序</option>
                                                    <option value="warning.pre_available_stock desc">预计可用库存倒序</option>
                                                    <option value="warning.pre_available_stock asc">预计可用库存正序</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <div class="layui-form-label ml">
                                                <select name="timeType">
                                                    <option value="0">制单时间</option>
                                                    <option value="1">审核时间</option>
                                                    <option value="2">装车时间</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="timerange" id="stockinorder_timerange_input" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 only-show-unchecktab">
                                            <label class="layui-form-label">是否装车</label>
                                            <div class="layui-input-block">
                                                <select name="isLoading">
                                                    <option value="">请选择</option>
                                                    <option value="true">是</option>
                                                    <option value="false">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1" style="text-align:right">
                                            <button class="layui-btn layui-btn-sm"  lay-filter="stockinorder_search_btn" id="stockinorder_search_btn">查询</button>
                                            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-tab" id="stockinorder_data_count_tab"  lay-filter="stockinorder_data_count_tab">
                                <div class="layui-card-header dis_flex">
                                    <div style="float:left;" >
                                        <ul class="layui-tab-title fl">
                                            <li class="layui-this" data-index="0">未审核(<span class="num" id="stockinorder_data_count_span0" data-index="0"></span>)</li>
                                            <li  data-index="1">已审核(<span class="num" id="stockinorder_data_count_span1" data-index="1"></span>)</li>
                                            <li  data-index="3">作废(<span class="num"  id="stockinorder_data_count_span3" data-index="3"></span>)</li>
                                        </ul>
                                    </div>
                                    <div id="stockinorder_package_number_div" style="padding-left: 5px;display: inline-block;position: relative;width: 120px;"></div>
                                    <div class="pl20" id="stockinorder_print_setting_chk" >
                                        <span style="float: left">打印SKU数量</span>
                                        <%--<input type="radio" name="printNum" value="0" title="1个">--%>
                                        <form class="layui-form" id="stockinorder_print_form" action="" style="display: inline">
                                            <div class="layui-col-md2 layui-col-lg2" style="margin-top: 5px">
                                                <input type="number"  id="stockinorder_print_num_input" class="layui-input"  placeholder="设置打印数量，此框内的数量优先级最高" lay-tips="设置打印数量，此框内的数量优先级最高">
                                            </div>
                                            <input type="radio" name="printNum" value="1" title="入库数">
                                            <input type="radio" name="printNum" value="2" title="自定义" checked>
                                            <!-- <permTag:perm funcCode="set_scanStorageOrder">
                                                <button type="button" style="margin-right: 20px;" class="layui-btn layui-btn-sm" id="stockinorder_set_label_print">设置</button>
                                            </permTag:perm> -->
                                         </form>
                                        <div style="float: right;">
                                            <permTag:perm funcCode="print_purchaserOrderStorage">
                                                <button class="layui-btn layui-btn-sm" id="stockinorder_patchprint">打印标签</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="printTest_purchaserOrderStorage">
                                                <button class="layui-btn layui-btn-sm" id="stockinorder_print_test_btn" title="打印测试页">打印测试页</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <permTag:perm funcCode="exportPdaData_purchaserOrderStorage">
                                            <button class="layui-btn layui-btn-sm" id="exportPdaData">导出PDA点货数据</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="add_purchaserOrderStorage">
                                            <button class="layui-btn layui-btn-sm" id="newStockinOrder">新增</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="auditBacth_purchaserOrderStorage">
                                            <button class="layui-btn layui-btn-sm" id="stockinorder_patchcheck">批量审核</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="deleteBatch_purchaserOrderStorage">
                                            <button class="layui-btn layui-btn-sm layui-btn-danger" id="stockinorder_patchdelete">批量作废</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="printPOrder_purchaserOrderStorage">
                                           <button class="layui-btn layui-btn-sm" id="stockinorder_patchprintA4" title="批量打印入库单(A4)">打印入库单</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="export_purchaserOrderStorage">
                                            <button type="button" class="layui-btn layui-btn-sm" id="stockinorder_exportPurOrderStorageBtn">导出入库单</button>
                                        </permTag:perm>
                                    </div>
                                </div>
                                <table class="layui-table" style="margin: 0;" id="stockinorder_dataTable" lay-filter="stockinorder_dataTable"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--修改入库单弹窗-->
            <script type="text/html" id="stockinorder_update_layer">
                <div class="layui-row  layui-col-space15">
                    <div class="layui-tab pd" lay-filter="stockinorder_detail_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this">详情</li>
                            <li isLog="1">日志</li>
                        </ul>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <div class="layui-col-lg12 layui-col-md12">
                                    <form  class="layui-form  pd" id="stockinorder_update_bill_form">
                                        <div class="layui-form-item">
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">采购订单</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="mainBillNumber" id="layer_orderNo" style="background-color: #cccccc" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">采购仓库</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="warehouseName" style="background-color: #cccccc"  class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">订单金额(￥)</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="prevPayMoney" style="background-color: #cccccc" class="layui-input" placeholder="" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">供应商</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="supplierName" style="background-color: #cccccc" class="layui-input" placeholder="" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">部门</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="orgName"  style="background-color: #cccccc" class="layui-input" disabled>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">采购专员</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="buyer" style="background-color: #cccccc"  class="layui-input" disabled>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <form  class="layui-form  pd border" id="stockinorder_update_storage_form">
                                        <div class="layui-form-item">
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">单号</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="storageNumber"  id="stockinorder_update_storageNumber_input" class="layui-input" style="background-color: #cccccc" readonly>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">制单时间</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="createTime" class="layui-input" style="background-color: #cccccc" readonly>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">快递方式</label>
                                                <div class="layui-input-block">
                                                    <select name="layerdeliverType" id="stockinlayerdeliverType" lay-verify="required" lay-search="">
                                                </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">快递单号</label>
                                                <div class="layui-input-block">
                                                    <input type="text" class="layui-input" name="deliveryNumber" lay-verify="required">
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">内部标签</label>
                                                <div class="layui-input-block">
                                                    <select xm-select="layerinsiteNoteType" xm-select-skin="normal" name="layerinsiteNoteType" id="stockinlayerinsiteNoteType" lay-verify="required"></select>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
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
                                        <div class="stockin_title">入库商品</div>
                                        <!-- 20190826 普源暂不支持修改时增加或则删除商品-->
                                        <%--<button class="layui-btn layui-btn-sm" id="stockinorder_update_addItem_btn">添加商品</button>--%>
                                    </div>
                                    <div class="pd">
                                        <table class="layui-table" id="stockinorder_update_addItem_table" lay-filter="stockinorder_update_addItem_table"></table>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-tab-item p20">
                                <div class="layui-tab layui-tab-brief">
                                    <div class="layui-show">
                                        <table class="layui-table" id="stockinorder_purStorageLogTab" lay-filter="stockinorder_purStorageLogTab"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </script>
            <script type="text/html" id="tpl_stockinorderNo">
                <input type="hidden" class="purchaseOrderMainId" value="{{d.id}}">
                <div >
                    <div class="text_l" style="position: relative;">
                        <span class="font_color">入库:</span>
                        <span class="showSpan">{{d.storageNumber || ''}}</span>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.storageNumber}}')" style="display: {{d.storageNumber ? 'inline-block':'none'}}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                        <span class="{{d.scanType==1 || d.scanType==5 || d.scanType==6 ? 'layui-badge': ''}}">
                            {{d.scanType==1 || d.scanType==5 || d.scanType==6 ? '龙': ''}}
                        </span>
                    </div>
                    <div class="text_l"><span class="font_color">采购:</span>
                        <span class="showSpan">
                            {{d.mainBillNumber || ''}}
                        </span>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.mainBillNumber}}')" style="display: {{d.mainBillNumber ? 'inline-block':'none'}}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    </div>
                    <div class="text_l"><span class="font_color">1688:</span>
                        <span class="canClickEl showSpan clcikRoutTo" data-routUrl="https://trade.1688.com/order/new_step_order_detail.htm?orderId={{d.ali1688OrderNo || ''}}">
                            <a>{{d.ali1688OrderNo || ''}}</a>
                        </span>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.ali1688OrderNo}}')" style="display: {{d.ali1688OrderNo ? 'inline-block':'none'}}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    </div>
                </div>
            </script>

            <script type="text/html" id="tpl_stockinorderSku">
                {{d.detailDtos[0].prodSSku}}<br>
                {{d.detailDtos[0].title  }}<br>
                款式: {{d.detailDtos[0].style}}
            </script>

            <script type="text/html" id="tpl_stockinordeNote">
                <span style="word-break: break-all">{{d.detailDtos[0].note || ''}}</span>
            </script>
            <script type="text/html" id="tpl_stockinordepackDesc">
                <span style="word-break: break-all">{{d.detailDtos[0].packDesc || ''}}</span>
            </script>
            <script type="text/html" id="tpl_stockinorderImg">
                <img  class="img_show_hide wish_imgCss lazy" data-original="${tplIVP}/{{d.skuImage}}" style="display: block;width: 90px;height: 90px;" data-onerror="layui.admin.img_noFind()">
            </script>

            <script type="text/html" id="tpl_stockinlocation">
                <!-- <div >
                    {{# if(d.stockLocation){ }}
                    <div>{{d.stockLocation}}</div>
                    <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                    {{# }}}
                </div> -->
                <div>[<span class="font_weight">{{d.warehouseName||''}}</span>]</div>
                <div>{{d.detailDtos[0].stockLocation ||''  }}</div>
            </script>
            <script type="text/html" id="tpl_stockinMoney">
                <div>含税单价：{{d.detailDtos[0].buyerPrice}}</div>
                <div>入库金额：{{d.detailDtos[0].storageMoney  }}</div>
                <div>总金额：{{d.totalStorageMoney}}</div>
            </script>
            <script type="text/html" id="tpl_stockintotalStorageNum">
                <div>采购/入库：{{d.detailDtos[0].buyNumber}}/{{d.detailDtos[0].storageNum  }}</div>
                <div>采购总/入库总：{{d.totalBuyNumber}}/{{d.totalStorageNum}}</div>
                {{# if(d.processStatus == 0){ }}
                    <div>预计可用：{{d.detailDtos[0].avaiableStock}}</div>
                {{# } }}
            </script>

            <!--商品sku模板-->
            <script type="text/html" id="stockinorder_prodSSku_tpl">
                <table class="layui-table colspantable" style="width: 100%;" >
                    {{#  layui.each(d.detailDtos, function(index, item){ }}
                    {{#  if(index <1){ }}
                    {{#  if(index ==d.detailDtos.length-1){ }}
                    <tr style="">
                        {{#  }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important">
                        {{#  } }}
                        {{# }else{ }}
                        {{#  if(index == d.detailDtos.length-1){ }}
                    <tr>
                        {{#  }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important;" >
                        {{#  } }}
                        {{# } }}
                        <td style="width:18%;text-align: left;padding-left: 5px;color: #000;">
                            {{item.prodSSku}}<br>
                            {{item.title  }}<br>
                            款式: {{item.style}}
                        </td>
                        <td style="width:10%;" class="remark_stronger">
                            {{item.note || ''}}
                        </td>
                        <td style="width:10%;text-align: left;padding-left: 5px;color: #000;">
                            <span style="word-break: break-all">{{item.packDesc || ''}}</span>
                        </td>
                        <td style="width:15%;text-align: center;color: #000;">
                            <img  class="img_show_hide wish_imgCss lazy" data-original="${tplIVP}/{{d.skuImage}}" style="display: block;width: 100px;height: 100px;" data-onerror="layui.admin.img_noFind()">
                        <%--<img src="123!size=100x100" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>--%>
                        </td>
                        <td style="width:10%;text-align: center;color: #000;">
                            <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                            <div>{{item.stockLocation ||''  }}</div>
                        </td>
                        <td style="width:9%;text-align: center;color: #000;"> {{item.buyerPrice  }}</td>
                        <td style="width:8%;text-align: center;color: #000;"> {{item.storageNum  }}</td>
                        <td style="width:10%;text-align: center;color: #000;"> {{item.storageMoney  }}</td>
                        <td style="width:8%;text-align: center;color: #000;"> {{item.buyNumber  }}</td>
                    </tr>
                    {{#  }); }}
                </table>
            </script>
            <script type="text/html" id="stockinorder_prodSSku_tpl1">
                <table class="layui-table colspantable" style="width: 100%;" >
                    {{#  layui.each(d.detailDtos, function(index, item){ }}
                    {{#  if(index <1){ }}
                    {{#  if(index ==d.detailDtos.length-1){ }}
                    <tr style="">
                        {{#  }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important">
                        {{#  } }}
                        {{# }else{ }}
                        {{#  if(index == d.detailDtos.length-1){ }}
                    <tr>
                        {{#  }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important;" >
                        {{#  } }}
                        {{# } }}
                        <td style="width:18%;text-align: left;padding-left: 5px;color: #000;">
                            {{item.prodSSku}}<br>
                            {{item.title  }}<br>
                            款式: {{item.style}}
                        </td>
                        <td style="width:10%;" class="remark_stronger">
                            {{item.note || ''}}
                        </td>
                        <td style="width:10%;text-align: left;padding-left: 5px;color: #000;">
                            <span style="word-break: break-all">{{item.packDesc || ''}}</span>
                        </td>
                        <td style="width:15%;text-align: center;color: #000;">
                            <img  class="img_show_hide wish_imgCss lazy" data-original="${tplIVP}/{{d.skuImage}}" style="display: block;width: 100px;height: 100px;" data-onerror="layui.admin.img_noFind()">
                        <%--<img src="123!size=100x100" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>--%>
                        </td>
                        <td style="width:14%;text-align: center;color: #000;">
                            <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                            <div>{{item.stockLocation ||''  }}</div>
                        </td>
                        <td style="width:9%;text-align: center;color: #000;"> {{item.buyerPrice  }}</td>
                        <td style="width:6%;text-align: center;color: #000;"> {{item.storageNum  }}</td>
                        <td style="width:7%;text-align: center;color: #000;"> {{item.storageMoney  }}</td>
                        <td style="width:6%;text-align: center;color: #000;"> {{item.buyNumber  }}</td>
                        <td style="width:7%;text-align: center;color: #000;"> {{item.avaiableStock }}</td>
                    </tr>
                    {{#  }); }}
                </table>
            </script>

            <script type="text/html" id="tpl_deliveryNumber">
                <div >
                    <div>[<span class="font_weight">{{ d.deliveryTypeName || '' }}</span>]</div>
                    <div>
                        <span class="canClickEl showSpan clcikRoutTo" data-routUrl="https://www.baidu.com/s?wd={data}">
                            <a>{{d.deliveryNumber || ''}}</a>
                        </span>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.deliveryNumber}}')" style="display: {{d.deliveryNumber ? 'inline-block':'none'}}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    </div>
                </div>
            </script>

            <script type="text/html" id="stockin_tpl_createTime">
                <div >
                    <div class="text_l"><span class="font_color">制单:</span><span>{{Format((d.createTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    <div class="text_l"><span class="font_color">反馈:</span><span>{{Format((d.feedbackTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    {{# if(d.processStatus == "1"){ }}
                    <div class="text_l"><span class="font_color">审核</span>:
                        <span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                    </div>
                    {{# } }}
                    {{# if(d.processStatus == "3"){ }}
                    <div class="text_l"><span class="font_color">作废</span>:
                        <span>{{Format(d.invalidTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                    </div>
                    {{# } }}
                    {{# if(d.processStatus == "0"){ }}
                    <div class="text_l"><span class="font_color">装车</span>:
                        <span>{{Format(d.loadingTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                    </div>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="stockin_tpl_creator">
                <div class="text_l"><span class="font_color">采购:</span><span>{{d.buyer}}</span></div>
                <div class="text_l"><span class="font_color">制单:</span><span>{{d.creator}}</span></div>
                <div class="text_l"><span class="font_color">点货:</span><span>{{ d.scanPerson || ''}}</span></div>
                <div class="text_l"><span class="font_color">反馈:</span><span>{{ d.feedbackPerson || ''}}</span></div>
                <div class="text_l"><span class="font_color">修改:</span><span>{{ d.modifyer || ''}}</span></div>
                {{# if(d.processStatus == "1"){ }}
                <div class="text_l"><span class="font_color">审核:</span><span>{{d.auditor || ''}}</span></div>
                {{# } }}
                {{# if(d.processStatus == "3"){ }}
                    <div class="text_l"><span class="font_color">作废:</span><span>{{d.invalidUser || "" }}</span></div>
                {{# } }}
            </script>

            <script type="text/html" id="stockinorder_table_operqte_tpl">
                <a class="layui-btn layui-btn-xs" lay-event="view">查看</a><br>
                <permTag:perm funcCode="detail_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
                </permTag:perm>
                {{# if(d.processStatus == "0"){ }}
                <%-- <permTag:perm funcCode="view_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs" lay-event="view">查看</a><br>
                </permTag:perm> --%>
                <permTag:perm funcCode="audit_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs" lay-event="check">审核</a><br>
                </permTag:perm>
                <%--<permTag:perm funcCode="delete_purchaserOrderStorage">--%>
                    <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="abodon">作废</a><br>--%>
                <%--</permTag:perm>--%>
                {{# } }}
                {{# if(d.processStatus == "1"){ }}
                <permTag:perm funcCode="add_purchaserOrderStorageBack">
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="back" title="生成退回单">退回</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "1"){ }}
                <permTag:perm funcCode="scanload_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs" lay-event="scanload">装车</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "0"){ }}
                <permTag:perm funcCode="unAuditScanload_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs" lay-event="scanload">装车</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "0"){ }}
                <permTag:perm funcCode="unAuditPrint_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs"  href="${ctx}/static/html/storageprint.html?storageNumber={{d.storageNumber}}" target="_blank"  lay-tips="预览打印">打印</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "1"){ }}
                <permTag:perm funcCode="auditedPrint_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs"  href="${ctx}/static/html/storageprint.html?storageNumber={{d.storageNumber}}" target="_blank"  lay-tips="预览打印">打印</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "3"){ }}
                <permTag:perm funcCode="abodonPrint_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-xs"  href="${ctx}/static/html/storageprint.html?storageNumber={{d.storageNumber}}" target="_blank"  lay-tips="预览打印">打印</a><br>
                </permTag:perm>
                {{# } }}
                {{# if(d.processStatus == "0"){ }}
                <permTag:perm funcCode="delete_purchaserOrderStorage">
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="abodon">作废</a><br>
                </permTag:perm>
                {{# } }}
            </script>
            <!--导出采购入库单--->
            <script type="text/html" id="stockinorder_exportPurStorageOrderPop">
                <form class="layui-form">
                    <div><input type="checkbox" title="全选" lay-filter="stockinorder_exportPurStorageInfo_selectAll"></div>
                </form>
                <div class="p20">
                    <div class="layui-tab layui-tab-card">
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show p20">
                                <form class="layui-form" id="stockinorder_exportPurStorageInfoForm" lay-filter="stockinorder_exportPurStorageInfoForm">
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">基本信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库单号" title="入库单号" disabled lay-skin="primary" checked></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购单号" title="采购单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="1688单号" title="1688单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="1688卖家名称" title="1688卖家名称" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="供应商" title="供应商" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购员" title="采购员" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="仓库" title="仓库" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">子表信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="子SKU" title="子SKU" checked lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品名称" title="商品名称" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="开发时间" title="开发时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="销售状态" title="销售状态" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="停售时间" title="停售时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品分类" title="商品分类" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品单位" title="商品单位" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="规格尺寸" title="规格尺寸" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="父SKU" title="父SKU" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="库位" title="库位" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="含税单价" title="含税单价" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库数量" title="入库数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库金额" title="入库金额" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购数量" title="采购数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购金额" title="采购金额" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购到货天数" title="采购到货天数" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购入库时间差" title="采购入库时间差" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="预计可用库存" title="预计可用库存" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                        <legend style="font-size:14px">基本信息</legend>
                                    </fieldset>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购总数量" title="采购总数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次入库数量" title="本次入库数量" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次入库金额" title="本次入库金额" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="快递方式" title="快递方式" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="快递单号" title="快递单号" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库备注" title="入库备注" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="流程状态" title="流程状态" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="经办人" title="经办人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="制单人" title="制单人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核人" title="审核人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="点货人" title="点货人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="最后修改人" title="最后修改人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="作废人" title="作废人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购审核人" title="采购审核人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库制单日期" title="入库制单日期" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购审核时间" title="采购审核时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库审核时间" title="入库审核时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="点货类型" title="点货类型" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="扫描装车人" title="扫描装车人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="扫描装车时间" title="扫描装车时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="上架区域" title="上架区域" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="异常类型" title="异常类型" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="反馈人" title="反馈人" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="反馈时间" title="反馈时间" lay-skin="primary"></div>
                                    <div class="fieldBox_purchaseOrder"><input type="checkbox" value="作废时间" title="作废时间" lay-skin="primary"></div>
                                    <div style="clear:left"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </script>
<%@ include file="/WEB-INF/view/jsp/purchases/purchases/createStockInOrder.jsp"%>
<%@ include file="/WEB-INF/view/jsp/purchases/purchases/createStockBackOrder.jsp"%>
<%@ include file="/WEB-INF/view/jsp/warehouse/check/printsetting.jsp"%>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js"></script>
<script type="text/javascript" src="${ctx}/static/js/purchases/stockinorder.js"></script>
