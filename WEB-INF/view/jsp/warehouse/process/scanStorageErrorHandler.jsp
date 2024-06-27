<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>前端异常处理</title>
<div class="layui-fluid" id="scan_storage_error_container"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="scan_storage_error_form">
                        <input type="hidden" id="scan_storage_error_hidden_mark" value="0">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="scan_error_search_type">
                                        <option value="scan_feed_back_time" selected>反馈时间</option>
                                        <option value="scan_deal_time">处理时间</option>
                                    </select>
                                </div>
                                
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="scan_error_checked_time_input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" class="warehouseId" lay-search lay-filter="scan_error_warehouseId">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0px;margin-left:25px;text-align: left;">
                                    <select name="purErrorFeedbackCode" lay-filter="purErrorFeedbackCode" id="purErrorFeedbackCode">
                                        <option value=""></option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select xm-select="scan_storage_error_type" name="errorRemarks" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购单号</label>
                                <div class="layui-input-block">
                                    <input name="scan_error_bill_number" type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">入库单号</label>
                                <div class="layui-input-block">
                                    <input name="scan_error_storage_number" type="text" class="layui-input"
                                           placeholder="支持多个逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input name="scan_error_sku" type="text" class="layui-input" placeholder="多个使用逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">处理人</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="dealPersonId">
                                    <div>
                                        <input name="dealPersonName" id="scan_storage_error_deal_person_Id" type="text"
                                               class="layui-input" placeholder="渐进搜索">
                                    </div>
                                    <div class="dimResultDivDealPersonName"></div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select xm-select="scan_error_pur_order_person" name="scan_error_pur_order_person"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">点货员</label>
                                <div class="layui-input-block">
                                    <select xm-select="scan_error_scan_person" name="scan_error_scan_person"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">错货明细</label>
                                <div class="layui-input-block">
                                    <select name="errorGoodsDetail">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">楼栋</label>
                                <div class="layui-input-block">
                                    <select name="buildNo" class="buildNo" id="scan_error_buildNo" xm-select="scan_error_buildNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">楼层</label>
                                <div class="layui-input-block">
                                    <select name="floorNo" class="floorNo" id="scan_error_floorNo" xm-select="scan_error_floorNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN" id="scan_error_orderRuleName">
                                <label class="layui-form-label">排序规则</label>
                                <div class="layui-input-block">
                                    <select name="orderRuleName">
                                        <option value="0">按反馈时间顺序排列</option>
                                        <option value="1">按反馈时间倒序排列</option>
                                        <option value="2">按处理时间顺序排列</option>
                                        <option value="3" selected>按处理时间倒序排列</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN" id="processStatusList_filter">
                                <label class="layui-form-label">状态筛选</label>
                                <div class="layui-input-block">
                                    <select xm-select="processStatusList" name="processStatusList"
                                            xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="">全部</option>
                                        <option value="0">待处理</option>
                                        <option value="1">已处理</option>
                                        <option value="3">作废</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-m2 pl20">
                                <button class="layui-btn layui-btn-sm layui-btn-normal" id="scan_error_search_button"
                                        type="button">搜索
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" id="scan_error_del_button" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格模块 --%>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="scan_storage_error_handler_mark_div">
                        <ul class="layui-tab-title">
                            <li class="layui-this">待处理(<span id="error_need_handle_number">0</span>)</li>
                            <li>已处理(<span id="error_handled_number">0</span>)</li>
                            <li>作废(<span id="error_invalid_number">0</span>)</li>
                            <li>全部(<span id="all_status_number">0</span>)</li>
                            <%--2021/6/9 导出按钮--%>
                            <li>
                                    <permTag:perm funcCode="scanStorageErrorHandler_export">

                                    <button class="layui-btn layui-btn-sm layui-btn-normal" id="export_excel_button"
                                            type="button">导出
                                    </button>
                                    </permTag:perm>
                            </li>
                        </ul>
                         <permTag:perm funcCode="batchEnterErrorGoodsDetail">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="batchEnterGoodsDetail" style="position: absolute;right: 100px;top: 10px;">
                                错货明细批量录入
                            </span>
                        </permTag:perm>
                       
                        <span 
                        class="layui-btn layui-btn-sm layui-btn-normal"
                        id="scanStorageErrorHandler_printLocationCode"
                        style="position: absolute;right: 20px;top: 10px;">
                        打印库位
                        </span>
                    </div>
                    <table class="layui-table" id="scan_storage_error_handler_table"
                           lay-filter="scan_storage_error_handler_table"></table>
                    <%--底部分页--%>
                    <div id="scan_storage_error_handler_table_div" class="zmFixedPage"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="scanStorageErrorHandlerwarehouse">
    {{#   layui.each(d, function(index, item){ }}
    <option value="{{item.id}}">{{item.warehouseName}}</option>
    {{# }) }}
</script>
<script type="text/html" id="errorGoodsDetailDiv">
    <option value=""></option>
    {{#   layui.each(d, function(index, item){ }}
    <option value="{{item.name}}">{{item.name}}</option>
    {{# }) }}
</script>
<!-- 单号 -->
<script type="text/html" id="bill_storage_number">
    <div style="text-align: left;" class="bill_storage_number_div">
        <div style="white-space: nowrap;">采购：<span class="billNumber_val">{{d.billNumber||''}}</span></div>
        <div style="white-space: nowrap;" class="editWarehousing_div" sku_val="{{d.sku||''}}" id_val="{{d.purOrderStorageErrorId||''}}">入库：<span class="storageNumber_val">{{d.storageNumber||''}}</span>
            {{# if(d.errorTypeName.includes('巡视异常')&&d.processStatus=='0'){ }}
            <permTag:perm funcCode="editErrorGoodsDetail">
                <span style="color:#1E9FFF;cursor:pointer;" class="editWarehousing_button">编辑</span>
            </permTag:perm>
            {{# } }}
        </div>
    </div>
</script>
<!-- SKU -->
<script type="text/html" id="sku_storage">
    <div style="text-align: left">
        <div><span style="color: grey;">SKU:</span>{{d.sku || ''}}</div>
        <div><span style="color: grey;">库位:</span>{{d.locationCode || ''}}</div>
        <div><span style="color: grey;">入库数量:</span><span class="storageNum_val">{{d.storageNum || ''}}</span></div>
        {{# if(d.errorRemark=='错货'){ }}
            <div><span style="color: grey;">错货数量:</span>{{d.errorGoodsDetailCount || ''}}</div>
        {{# } }}
    </div>
</script>
<!-- 异常 -->
<script type="text/html" id="error_type_remark">
    <div style="text-align: left">
        <div>类型：{{d.errorTypeName || ''}}</div>
        <div>明细：{{d.errorRemark || ''}}</div>
    </div>
</script>
<%-- 工具栏 --%>
<script type="text/html" id="scan_storage_error_handler_action">
    {{# if(d.processStatus=='0'&&d.errorRemark=='错货'){ }}
    <permTag:perm funcCode="enterErrorGoodsDetail">
        <button class="layui-btn layui-btn-xs" lay-event="scan_storage_error_batchEnterGoodsDetail_event">错货明细录入</button>
    </permTag:perm>
    {{# } }}
    {{# if(d.processStatus=='0'||d.processStatus=='3'){ }}
    <button class="layui-btn layui-btn-xs" lay-event="scan_storage_error_handler_deal_event">处理</button>
    <br>
    {{# } }}
    {{# if(d.processStatus=='0'||d.processStatus=='1'){ }}
    <button class="layui-btn layui-btn-xs" lay-event="scan_storage_error_handler_invalid_event">作废</button>
    {{# } }}
</script>
<!-- 状态栏 -->
<script type="text/html" id="scan_storage_error_handler_status">
    {{# if(d.processStatus==0){ }}
        <span>待处理</span>
    {{# }else if(d.processStatus==1){ }}
        <span>已处理</span>
    {{# }else if(d.processStatus==3){ }}
        <span>作废</span>
    {{# }else{ }}
        <span></span>
    {{# } }}
</script>
<%--规格--%>
<script type="text/html" id="scan_storage_spec">
    <div style="text-align: left">
        {{# if(d.skuShort){ }}
        <div><span style="color: grey;">简称:</span>{{d.skuShort}}
            <div style="clear: left"></div>
        </div>
        {{# } }}
        {{# if(d.unit){ }}
        <div><span style="color: grey;">单位:</span>{{d.unit}}
            <div style="clear: left"></div>
        </div>
        {{# } }}
        {{# if(d.style){ }}
        <div><span style="color: grey;">款式:</span>{{d.style}}
            <div style="clear: left"></div>
        </div>
        {{# } }}
    </div>
</script>
<%--人员--%>
<script type="text/html" id="scan_storage_person_pl">
    <div style="text-align: left" class="scan_storage_person_pl_div">
        {{# if(d.purchaseBuyer){ }}
        <div><span style="color: grey;">采购:</span><span class="purchaseBuyer_val">{{d.purchaseBuyer || ''}}</span>
            <div style="clear: left"></div>
        </div>
        {{# } }}
        {{# if(d.devPerson){ }}
        <div><span style="color: grey;">开发:</span>{{d.devPerson || ''}}
            <div style="clear: left"></div>
        </div>
        {{# } }}
    </div>
</script>
<!-- 仓库人员 -->
<script type="text/html" id="storage_person">
    <div style="text-align: left">
        <div><span style="color: grey;">点货:</span>{{d.posScanPerson || ''}}
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">反馈:</span>{{d.purErrorFeedbackCode==3 ? (d.modifyer ||d.creator || ''): (d.creator || '')}}
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">处理:</span>{{d.dealPerson || ''}}
            <div style="clear: left"></div>
        </div>
      
        <div><span style="color: grey;">作废:</span><span class="scanStorageErrorHandler_invalidName">{{d.invalidName || ''}}</span>
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">错货处理:</span><span class="scanStorageErrorHandler_invalidName">{{d.errorGoodsDetailModifyer || ''}}</span>
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">制单:</span>{{d.posCreator || ''}}
            <div style="clear: left"></div>
        </div>
    </div>
</script>
<%--日期--%>
<script type="text/html" id="scan_storage_date_pl">
    <div style="text-align: left">
        <div><span style="color: grey;">反馈:</span>{{ layui.admin.Format( d.feedbackTime, "yyyy-MM-dd hh:mm:ss")}}
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">处理:</span>{{ layui.admin.Format( d.dealTime, "yyyy-MM-dd hh:mm:ss")}}
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">作废:</span><span class="scanStorageErrorHandler_invalidTime">{{ layui.admin.Format( d.invalidTime, "yyyy-MM-dd hh:mm:ss")}}</span>
            <div style="clear: left"></div>
        </div>
        <div><span style="color: grey;">错货处理:</span><span class="scanStorageErrorHandler_invalidTime">{{ layui.admin.Format( d.errorGoodsDetailTime, "yyyy-MM-dd hh:mm:ss")}}</span>
            <div style="clear: left"></div>
        </div>
    </div>
</script>
<script src="${ctx}/static/js/warehouse/scanStorageErrorHandler.js"></script>
<script src="${ctx}/static/js/warehouse/exportExceptionFeedback.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>