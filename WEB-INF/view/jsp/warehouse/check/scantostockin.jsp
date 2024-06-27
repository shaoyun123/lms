<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>点货入库</title>
<style type="text/css">
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .pd {
        padding: 10px;
    }

    .text_l {
        text-align: left;
    }

    .font_color {
        color: #aaa !important;
    }

    .remark_stronger {
        background: antiquewhite;
        color: red !important;
        font-size: 16px !important;
        font-weight: 600;
    }

    .remark_stronger .layui-table-cell {
        color: red !important;
    }

    .tex0 {
        font-size: 16px;
        margin: 0 20px;
    }
    .unit_stockin {
        margin-top: 20px;
        color: red !important;
        font-weight: bold;
        font-size: 35px;     
	    animation: breath 1s linear 1s 6 alternate;
    }

    @keyframes breath { 
        0%   { font-size: 35px; }
        100% { font-size: 45px; }
    }
    .scantostockin-li {
      margin: 5px;
      width: 220px;
    }
    #scantostockin_warehouseReceipt li {
      text-align: left;
      width: 100px;
    }
</style>
<div class="layui-fluid" id="LAY-scantostockin">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body toFixedContain">
                    <form class="layui-form" id="scantostockin_search_from">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label" style="width: 90px;">跟踪号/采购单号/1688单号</label>
                              <div class="layui-input-block" style="margin-left: 120px;">
                                <input name="scantostockin_orderNumber" id="scantostockin_orderNumber" type="text"
                                    placeholder="请输入" class="layui-input" style="margin-top: 6px;">
                                  </div>
                                <%-- <div></div> --%>
                                <%-- <input type="hidden" id="scantostockin_orderNumberHidden"> --%>
                            </div>
                            <div class="layui-col-md5 layui-col-lg5 pl20" id="scantostockin_auto_generate_div">
                                <permTag:perm funcCode="add_scanStorageOrder">
                                    <input type="checkbox" value="0" title="自动生成采购入库单"
                                        lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                </permTag:perm>
                                <input type="checkbox" value="1" title="自动打印标签" lay-filter="scantostockin_chk_filter"
                                    lay-skin="primary">
                                <input type="checkbox" value="2" title="不显示已入库未审核数据"
                                    lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                <input type="checkbox" value="3" title="不显示已完全入库商品"
                                    lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                <div>
                                    <input type="checkbox" value="4" title="不显示部分已入库已审核数据"
                                        lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                    <!-- <permTag:perm funcCode="select_oufOfStock">
                                        <input type="checkbox" value="5" title="查询缺货订单" id="queryOutOfStockOrderId"
                                            lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                    </permTag:perm> -->
                                    <permTag:perm funcCode="scantostockin_generate_outorder">
                                        <input type="checkbox" value="6" title="单品缺货入库单(非AE托管单)" id="singleOutOfStockInOrderId"
                                            lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                    </permTag:perm>
                                      <input type="checkbox" value="7" title="AE托管缺货入库单" id="aeOutOfStockOrderId"
                                          lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                        <input type="checkbox" value="8" title="平台仓缺货入库单" id="platcodeOutOfStockOrderId"
                                          lay-filter="scantostockin_chk_filter" lay-skin="primary">
                                </div>

                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl20" id="scantostockin_print_setting_chk">
                                <label class="layui-form-label">打印SKU数量</label>
                                <%--<input type="radio" name="printNum" value="0" title="1个">--%>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="number" id="scantostockin_print_num_input" class="layui-input"
                                        placeholder="设置打印数量，此框内的数量优先级最高" lay-tips="设置打印数量，此框内的数量优先级最高">
                                </div>
                                <input type="radio" name="printNum" value="1" title="入库数">
                                <input type="radio" name="printNum" value="2" title="自定义" checked>
                                <!-- <permTag:perm funcCode="set_scanStorageOrder">
                                    <button type="button" class="layui-btn layui-btn-sm"
                                        id="scantostockin_set_label_print">设置</button>
                                </permTag:perm> -->
                                <button type="button" class="layui-btn layui-btn-sm" id="scantostockin_printTestPage"
                                title="打印测试页">打印测试页</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                <div class="dis_flex toFixedContain" style="height: 40px;line-height: 40px;padding-top: 5px">
                    <div class="layui-row" style="width: 100%">
                        <div class="layui-col-xs8 layui-col-sm8 layui-col-md8">
                            <div class="layui-col-xs3 layui-col-sm3 layui-col-md2" style="padding-left: 5px;">
                               <span style="float: left;">定位</span>  <input type="text" class="layui-input" id="scantostockin_sku_input" style="width: 70%;">
                            </div>
                                   <div class="layui-col-lg1 layui-col-md1">
                                       <form class="layui-form">
                                       <select id="scantostockin_scanErrorTypeSel"></select>
                                       </form>
                                   </div>

                                   <div class="layui-col-lg1 layui-col-sm1" style="margin-top:-5px;" id="scantostockin_scan_allErrorBatch">
                                      <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">异常</button>
                                        <ul class="hidden">
                                          <permTag:perm funcCode="scantostockin_batcn_scanFeedError">
                                          <li id="scantostockin_scan_feedErrorBatch_liBtn">反馈异常</li>
                                        </permTag:perm>
                                        <permTag:perm funcCode="scantostockin_batcn_cancelFeedError">
                                          <li id="scantostockin_scan_cancelErrorBatch_liBtn">取消异常</li>
                                        </permTag:perm>
                                        </ul>
                                       <permTag:perm funcCode="scantostockin_batcn_scanFeedError">
                                           <button class="layui-btn layui-btn-sm disN"
                                                   id="scantostockin_scan_feedErrorBatch_btn" title="反馈异常">反馈异常</button>
                                       </permTag:perm>
                                       <permTag:perm funcCode="scantostockin_batcn_cancelFeedError">
                                           <button class="layui-btn layui-btn-sm disN"
                                                   id="scantostockin_scan_cancelErrorBatch_btn" title="取消异常">取消异常</button>
                                       </permTag:perm>

                                   </div>
                                   <div class="layui-col-lg2 layui-col-md2" id="scantostockin_sku_number_div" style="padding-left: 10px;">&nbsp;</div>
                            <div class="layui-col-lg1 layui-col-md1"> 
                              已选sku数：<span id="scantostockin_sku_number_span"> 0 </span>
                            </div>
                            <div  class="layui-col-lg2 layui-col-md2" id="scantostockin_package_number_div" style="padding-left: 5px;">
                              &nbsp;
                            </div>
                            <!-- <permTag:perm funcCode="update_scanStorageOrder">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <input type="text" class="layui-input" id="scantostockin_sku_bacthUpdate_input" style="display: inline;width: 30%">
                                    <button type="button" class="layui-btn layui-btn-sm" id="scantostockin_sku_bacthUpdate_button">应用入库数量</button>
                                </div>
                            </permTag:perm> -->
                        </div>
                        <div class="layui-col-xs4 layui-col-sm4 layui-col-md4" style="z-index: 100;text-align: right;">
                            
                            <permTag:perm funcCode="add_scanStorageOrder" >
                                <button type="button" class="layui-btn layui-btn-sm disN" id="scantostockin_patchprintA4"
                                        title="批量打印入库单(A4)">打入库单</button>
                            </permTag:perm>
                            <permTag:perm funcCode="add_scanStorageOrder">
                                <button type="button" class="layui-btn layui-btn-sm disN"
                                        id="scantostockin_generate_storage_btn" title="生成/修改入库单">生成/修改入库单</button>
                            </permTag:perm>
                            <permTag:perm funcCode="add_scanStorageOrder">
                                <button type="button" class="layui-btn layui-btn-sm"
                                        id="scantostockin_generate_print_btn">生成且打印</button>
                            </permTag:perm>
                            <permTag:perm funcCode="del_scanStorageOrder">
                                <button type="button" class="layui-btn layui-btn-sm disN"
                                        id="scantostockin_delete_storage_btn" title="作废入库单">作废</button>
                            </permTag:perm>
                            <button type="button" class="layui-btn layui-btn-sm"
                                    id="scantostockin_print_sku_btn" title="打印SKU标签">打SKU标签</button>
                            <!-- <permTag:perm funcCode="audit_scanStorageOrder">
                                <button type="button" class="layui-btn layui-btn-sm"
                                        id="scantostockin_cahnge_audit_btn">直接转核单</button>
                            </permTag:perm> -->
                            <permTag:perm funcCode="scantostockin_cahnge_process">
                                <button type="button" class="layui-btn layui-btn-sm"
                                    id="scantostockin_cahnge_process_btn">一条龙审核</button>
                            </permTag:perm>
                            <div id="scantostockin_warehouseReceipt" style="display: inline-block;position: relative;">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">入库单操作</button>
                                <ul class="hidden">
                                  <permTag:perm funcCode="add_scanStorageOrder">
                                  <li id="scantostockin_patchprintA4LiBtn"title="批量打印入库单(A4)">
                                    打入库单
                                  </li>
                                </permTag:perm>
                                <permTag:perm funcCode="add_scanStorageOrder">
                                  <li id="scantostockin_generate_storage_liBtn" title="生成/修改入库单">
                                    生成/修改入库单
                                  </li>
                                </permTag:perm>
                                <permTag:perm funcCode="del_scanStorageOrder">
                                  <li id="scantostockin_delete_storage_liBtn" title="作废入库单">作废</li>
                                </permTag:perm>
                                </ul>
                            </div>
                            <permTag:perm funcCode="exit_defective">
                                <input type="hidden" id="scantostockin_exit_defective_input">
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body" style="padding-top: 0px">
                    <table class="layui-table" id="scantostockin_data_table" lay-filter="scantostockin_data_table">
                    </table>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>

<script type="text/html" id="scantostockin_table_operate_tpl">
    <a class="layui-btn layui-btn-xs" lay-event="scantostockin_print_label">打印标签</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="scantostockin_feed_label">反馈异常</a><br>
    {{# if (d.showProductErrorBack != null && d.showProductErrorBack){ }}
    <button class="layui-btn layui-btn-xs" id="scantostockin_feedback_btn"
            onclick="scanToStockInFeedbackFunction('{{ d.prodSSku }}','{{ d.mainBillNumber }}','{{ d.storageNumber }}')">包装类型</button>
    {{# }}}
</script>
<!-- 渲染表格数据 -->
<script type="text/html" id="scantostockin_image_tpl">
                <div>
                    <img width="120" height="120" data-original="${tplIVP}{{d.image||''}}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>
<!--商品名称-->
<script type="text/html" id="scantostockin_title_tpl">
                <div class="scantostockin_title_tip_div"><span class="font_color">名称:</span>{{d.title}}</div>
                <div><span class="font_color">款式:</span>{{d.style}}</div>
            </script>
<script type="text/html" id="scantostockin_isSale_tpl">
                <div class="text_l"><span style="color:{{d.isSale ? 'black' : 'red'}};font-size:18px;font-weight:bold">
                                        {{# if (d.isSale != null ){ }}
                                        {{ d.isSale ? '在售' : '停售'}}
                                        {{# }}}
                                    </span>
                </div>
                <div class="text_l"><span style="color:{{ d.color }};font-size:18px;font-weight:bold ">
                                    {{ d.saleRank ? d.saleRank : ''}}
                                    </span>
                </div>
                <div class="text_l"><span style="color:#f00;font-size:18px;font-weight:bold ">
                  {{ d.repeatSku ? '重复' : ''}}
                  </span>
                </div>
                {{# if(d.storeId && d.storeId == 1){ }}
                <div class="text_l"><span class="font_color" title="昆山仓">
                                  预计库存周转天数:
                                    </span> {{ d.showAbleNum ? d.showAbleNum : ''}}
                </div>
                {{# } }}
                {{# if(d.curSaleDay != null && d.curSaleDay <= 3){ }}
                    <div class="disflex"><span  style="color:#f00;">可售天数:</span><h1 style="color:#f00;font-size: 32px;">{{d.curSaleDay}}</h1></div>
                {{# }else{ }}
                    <div>可售天数:{{d.curSaleDay || 0}}</div>
                {{# }}}
            </script>

<script type="text/html" id="scantostockin_packDQuality_tpl">
    <div>独立包装: {{d.alonePack ? '是' : '否'}}</div>
    <div>质检:{{d.ifNeedQualityCheck ? '是' : '否'}}</div>
</script>

<script type="text/html" id="scantostockin_prodSSku_tpl">
                <div class="scantostockin_high_div">
                    <input type="text" class="scantostockin_span_{{d.prodSSku}}" scantostockin style="width: 1px;height: 1px;border: 0px;padding: 0px;margin: 0px;"> 
                    <span class="pora copySpan">
                        <a class="prodSSkuCheck blue" style="cursor:pointer;">{{d.prodSSku || ""}}</a>
                    </span>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.prodSSku}}')" style="display: {{d.prodSSku ? 'inline-block':'none'}}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    {{# if(d.stockLocation){ }}
                        <div>{{d.stockLocation}}</div>
                    {{# }}}
                    <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                </div>
                {{# if(d.prodAttrList !=null && d.prodAttrList.indexOf('防疫用品') >-1 ){ }}
                    <div style="    color: red;font-weight: bold;">防疫用品</div>
                {{# }}}
                {{# if(d.ifNeedQualityCheck !=null && d.ifNeedQualityCheck ){ }}
                    <button type="button" class="layui-btn layui-btn-xs layui-btn-normal scantostockin_zhijian_btn">质检规范</button>
                    <span style="display: none;">{{d.qualityCheckRqmt}}</span>
                {{# }}}
                {{# if(d.pmarkCrash !=null && d.pmarkCrash){ }}
                        <div style="color:red;font-weight: bold;">缺货紧急</div>
                {{# }}}
                {{# if(d.multipleInfoList !=null && d.multipleInfoList.length > 0 ){ }}
                  <div><span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="scantostockin_multi_combi">多属性组合</span></div>
                {{# }}}
            </script>
            <!-- 采购数 -->
            <script type="text/html" id="scantostockin_buyNumber_tpl">
                <div>{{d.buyNumber}}</div>
                {{# if(!['个','件','条', '盒'].includes(d.unit)){ }}
                    <div class="unit_stockin">{{ d.unit }}</div>
                {{# } }}
            </script>
<!--本次入库数-->
<script type="text/html" id="scantostockin_notStorageNum_tpl">
                <permTag:perm funcCode="update_scanStorageOrder">
                    <span id="scantostockin_notStorageNum_span"></span>
                </permTag:perm>
                {{# if(d.notStorageNum > 0){ }}
                <input type="text" class="layui-input scantostockin_notStorageNum_show" id="scantostockin_storageNum_{{d.mainOrderId}}_{{d.detailId || '0'}}_{{d.prodSId}}" value="{{d.notStorageNum}}" type="number">
                {{# }else { }}
                <input type="text" class="layui-input scantostockin_notStorageNum_show" style="background-color: #cccccc" id="scantostockin_storageNum_{{d.mainOrderId}}_{{d.detailId || '0'}}_{{d.prodSId}}" value="{{d.notStorageNum}}" type="number" disabled>
                {{# }}}
                <input type="text" class="layui-input scantostockin_notStorageNum_hide" style="background-color: #cccccc" id="scantostockin_storageNum_{{d.mainOrderId}}_{{d.detailId || '0'}}_{{d.prodSId}}" value="{{d.notStorageNum}}" type="number" disabled>
            </script>
<script type="text/html" id="scantostockin_storageNumber_tpl">
                <div id="scantostockin_storageNumber_{{d.mainOrderId}}_{{d.prodSId}}" detailId="{{d.detailId}}">
                  
                    {{# if(d.notStorageNum ==0 || (d.processStatus ==null|| d.processStatus == 0) ){ }}
                    <span>{{d.storageNumber}}</span>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.storageNumber}}')" style="display: {{d.storageNumber ? 'inline-block':'none'}}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    {{# }}}
                </div>
            </script>
<!--缺货数量-->
<script type="text/html" id="scantostockin_outOfStockNum_tpl">
    {{# if(d.outOfStockNum != null && d.outOfStockNum > 0){ }}
        <div><h1 style="color:red;font-size: 32px;">{{d.outOfStockNum}}</h1></div>
    {{# }else{ }}
        <div>{{d.outOfStockNum || 0}}</div>
    {{# }}}
</script>
<script type="text/html" id="scantostockin_curSaleDay_tpl">
    {{# if(d.curSaleDay != null && d.curSaleDay <= 3){ }}
        <div><h1 style="color:red;font-size: 32px;">{{d.curSaleDay}}</h1></div>
    {{# }else{ }}
        <div>{{d.curSaleDay || 0}}</div>
    {{# }}}
</script>
<script type="text/html" id="scantostockin_defectiveNum_tpl">
                <div>{{d.defectiveNum || 0 }}  <i class="layui-icon layui-icon-edit" style="color: #009688" title="修改不良品数量">&#xe642;</i></div>
            </script>
<script type="text/html" id="scantostockin_defectiveRemark_tpl">
                <div>{{d.defectiveRemark || '' }}  <i class="layui-icon layui-icon-edit" style="color: #009688" title="修改不良品备注">&#xe642;</i></div>
            </script>
<!--库位-->
<script type="text/html" id="scantostockin_stockLocation_tpl">
                {{# if(d.stockLocation){ }}
                <div>{{d.stockLocation}}</div>
                {{# }}}
                <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
            </script>
<script type="text/html" id="scantostockin_specification_tpl">
                <div class="text_l"><span class="font_color">规格:</span>{{d.specification}}</div>
                <div class="text_l"><span class="font_color">型号:</span>{{d.model}}</div>
                <div class="text_l"><span class="font_color">款式:</span>{{d.style}}</div>
            </script>
<script type="text/html" id="scantostockin_zhijian_layer">
                <div class="layui-card">
                    <div class="layui-card-body" >
                        <div class="layui-form-item" id="scantostockin_zhijian_wangedit"></div>
                    </div>
                </div>
            </script>
<script type="text/html" id="scantostockin_warning">
                <div class="tex0">当前查询到的采购订单为多包裹订单;请手工点击【生成/修改入库单】来建单</div>
            </script>

<!-- 表格-商品信息 -->
<script type="text/html" id="scantostockin_prodInfo">
  <div style="text-align: center;">
    {{# if(d.hasErrorGoodsDetailSku){ }}
        <div><img style="width: 50px;height: 50px;" src="${ctx}/static/img/electronic_scale.png" /></div>
    {{# } }}
    <div>重:{{d.suttleWeight || ''}}</div>
  </div>
</script>
<!-- 表格-操作人 -->
<script type="text/html" id="scantostockin_scanPerson">
  <div style="text-align: left;">
    <!-- <div>开发:{{d.bizzOwner || ''}}</div> -->
    <div>采购:{{d.buyer || ''}}</div>
    <div>制单:{{d.creator || ''}}</div>
    <div>点货:{{d.scanPerson || ''}}</div>
  </div>
</script>

<script type="text/html" id="scanToStockInFeedbackScript">
    <div class='w_50 mg_t'>
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label">问题类型</label>
                <div class="layui-input-block">
                    <select name="scanToStockIn_issue_type" lay-verify="required">
                    </select>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                    <textarea name="scanToStockIn_sku_textarea" placeholder="一行一个" class="layui-textarea" readonly="readonly"></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">问题备注</label>
                <div class="layui-input-block">
                    <textarea name="scanToStockIn_issue_remark" placeholder="" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">问题类型<br/>(最多三张)</label>
                <div class="layui-input-block">
                    <button type="button" class="layui-btn" id="scanToStockIn_upload_btn"><i class="layui-icon"></i>选择图片</button>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <div id='div_prev' title=''></div>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 录入快递单号 -->
<script id="scantostockin_openModel_deliveryNumber_tpl" type="text/html">
    <div class="layui-card">
        <div class="layui-card-body layui-form">
            <input class="layui-input" name="deliveryNumber" placeholder="请输入" required />
        </div>
    </div>
</script>

<!-- 子SKU对比 -->
<script type="text/html" id="scantostockin_sunSku_layer">
  <div style="padding:20px;">
    <ul style="display: flex;justify-content: start;flex-wrap: wrap;"></ul>
  </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js"></script>
<script src="${ctx}/static/util/we.js"></script>
<script src="${ctx}/static/js/warehouse/scantostockin.js"></script>
<%@ include file="/WEB-INF/view/jsp/warehouse/check/printsetting.jsp"%>