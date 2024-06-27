<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>采购入库明细表</title>
<style>
    #storageDetail_search_form .layui-form-label {
        padding: 0!important;
        line-height: 31px!important;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="storageDetail_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label ml">
                                    <select name="timeType" id="storageDetail_timeType_sel">
                                        <option value="0">制单时间</option>
                                        <option value="1">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="timerange" id="storageDetail_timerange_input" class="layui-input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label" style="margin-left: 20px;">
                                    <select name="skuSearchType" id="stockinorder_skuSearchType">
                                        <option value="1">子SKU</option>
                                        <option value="2">父SKU</option>
                                        <option value="3">子SKU精确</option>
                                        <option value="4">父SKU精确</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="prodSSku" id="storageDetail_sku_input" autocomplete="off" class="layui-input" placeholder='商品子SKU'>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerId" id="storageDetail_buyer_sel"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发人员</label>
                                <div class="layui-input-block">
                                    <select name="developerId" id="storageDetail_developer_sel"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">整合人员</label>
                                <div class="layui-input-block">
                                    <select name="integratorId" id="storageDetail_integrator_sel"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">制单人</label>
                                <div class="layui-input-block">
                                    <select name="creatorId" id="storageDetail_creator_sel"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入库状态</label>
                                <div class="layui-input-block">
                                    <select name="WarehousingStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">已审核</option>
                                        <option value="0">未审核</option>
                                        <option value="3">已作废</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplyId" id="storageDetail_supplyId_hide">
                                    <div>
                                        <input id="storageDetail_searchSupplier_input" name="supplyName"  class="layui-input" />
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">审核人</label>
                                <div class="layui-input-block">
                                    <select name="auditorId" id="storageDetail_auditor_sel"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入库单</label>
                                <div class="layui-input-block">
                                    <input type="text" name="storageNumber" id="storageDetail_storageNumber_input" autocomplete="off" class="layui-input" placeholder='采购入库单号'>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="storageDetail_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="storageDetail_crad">
                <div class="layui-tab" lay-filter="storageDetail_tab">
                    <ul class="layui-tab-title">
                        <li class="layui-this" tab_type="1">数量(<span id="storageDetail_total_num"></span>)</li>
                        <div style='float:right;line-height: 40px;'>
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="storageDetail_export_btn">导出(六个月之内)</button>
                        </div>
                    </ul>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="storageDetail_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--入库单状态-->
<script type="text/html" id="storageDetail_processStatus_tpl">
    {{# if(d.processStatus == 0){ }}
    未审核
    {{# }else if(d.processStatus == 1){   }}
    <span style="color:green;">已审核</span>
    {{# }else if(d.processStatus == 3){   }}
    <span style="color:#FF5722">已作废</span>
    {{# } }}
</script>
<!--商品-->
<script type="text/html" id="storageDetail_prodSSku_tpl">
    <div style="text-align: center;">
        <div >sku:{{d.prodSSku||''}}</div>
        <div >库位:{{d.locationCode||''}}</div>
        <div style="color: grey;font-size: 10px;">{{d.title||''}}</div>
    </div>
</script>
<!--人员-->
<script type="text/html" id="storageDetail_person_tpl">
    <div style="text-align: left;">
        <div>开发：{{d.developer || '' }}</div>
        <div>采购：{{d.buyer || '' }}</div>
        <div>整合：{{d.integrator || '' }}</div>
    </div>
</script>
<!--采购信息-->
<script type="text/html" id="storageDetail_buyerInfo_tpl">
    <div>￥{{Number(d.taxPrice*d.buyNum).toFixed(2)}}<br>(￥{{d.taxPrice }}x{{d.buyNum}})</div>
</script>
<!--入库信息信息-->
<script type="text/html" id="storageDetail_storageInfo_tpl">
    <div>￥{{Number(d.taxPrice*d.storageNum).toFixed(2) }}<br> (￥{{d.taxPrice }}x{{d.storageNum}})</div>
</script>
<!--处理人-->
<script type="text/html" id="storageDetail_dealPerson_tpl">
    <div style="text-align: left;">
        <div>点货：{{d.scanPerson || '' }}</div>
        <div>装车:{{d.loadPerson || ''}}</div>
        <div>上架：{{d.auditor || '' }}</div>
    </div>
</script>
<!--时间-->
<script type="text/html" id="storageDetail_dealTime_tpl">
    <div style="text-align: left;">
        <div>采审：{{Format(d.mainBillAuditDate,'yyyy-MM-dd hh:mm:ss')}}</div>
        <div>收货：{{Format(d.receiptDate,'yyyy-MM-dd hh:mm:ss')}}</div>
        <div>点货：{{Format(d.scanDate,'yyyy-MM-dd hh:mm:ss')}}</div>
        <div>装车：{{Format(d.loadDate,'yyyy-MM-dd hh:mm:ss')}}</div>
        <div>上架：{{Format(d.shelvesDate,'yyyy-MM-dd hh:mm:ss')}}</div>
    </div>
</script>
<!--其它时效-->
<script type="text/html" id="storageDetail_otherDiffTimeStr_tpl">
    <div style="text-align: left;">
        <div>收货(D)：{{d.receiptDiffTimeStr || '' }}</div>
        <div>点货(m)：{{d.scanDiffTimeStr || '' }}</div>
        <div>装车(m)：{{d.loadDiffTimeStr || '' }}</div>
        <div>上架(m)：{{d.shelvesDiffTimeStr || '' }}</div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/warehouse/storagedetail.js"></script>