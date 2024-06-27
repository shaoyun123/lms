<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>海外仓其他出库单</title>
<style type="text/css">
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .hidden {
        display: none !important;
    }

    .stockin_title {
        line-height: 31px;
        font-size: 16px;
        font-weight: 600;
        margin: 0 10px;
    }

    .pd {
        padding: 10px !important;
    }

    .dis_flex_start {
        display: flex;
        justify-content: flex-start;
    }

    .text_l {
        text-align: left;
    }

    .font_color {
        color: #aaa !important;
    }

    .font_weight {
        font-weight: 600 !important;
    }

    #LAY-reststockout .canClickEl {
        color: #000 !important;
    }

    #LAY-reststockout .layui-btn+.layui-btn {
        margin-left: 0px !important;
    }

    /* .hide {
        display: none;
    } */

    .fieldBox_purchaseOrder {
        float: left;
        width: 20%;
        height: 25px;
    }
</style>
<div class="layui-fluid" id="LAY-reststockout">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="overseas_out_rest_stock_out_search_form">
                        <input type="hidden" name="overseas_process_status" value="0">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label labelSel">
                                    <select name="registerSkuSearchType">
                                        <option value="1">注册SKU(精)</option>
                                        <option value="2">注册SKU(模)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="registerSkus">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="overseasStorageId" id="overseas_out_rest_out_warehouseList"
                                        lay-search=""></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">经办人</label>
                                <div class="layui-input-block">
                                    <select name="directorId" id="overseas_out_rest_out_directorList"
                                        lay-search=""></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">出库类别</label>
                                <div class="layui-input-block">
                                    <select name="overseasOutType" id="overseas_out_rest_out_out_typeList"
                                        lay-search=""></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">出库单</label>
                                <div class="layui-input-block">
                                    <input name="overseasStockOutNumbers" type="text" placeholder="支持多个精确查询"
                                        class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">出库单备注</label>
                                <div class="layui-input-block">
                                    <input name="problemRemark" type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="0">制单时间</option>
                                        <option value="1">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input"
                                        name="overseas_out_rest_stock_out_time_range_input"
                                        id="overseas_out_rest_stock_out_time_range_input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button type="button" class="layui-btn layui-btn-sm"
                                    id="overseas_out_rest_out_search">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-tab" id="overseas_out_rest_stock_out_data_count_tab"
                    lay-filter="overseas_out_rest_stock_out_data_count_tab">
                    <div class="layui-card-header dis_flex">
                        <div style="float:left;">
                            <ul class="layui-tab-title fl">
                                <li class="layui-this" data-index="0">未审核(<span class="num"
                                        id="overseas_out_rest_stock_out_data_count_span0" data-index="0"></span>)</li>
                                <li data-index="1">已审核(<span class="num"
                                        id="overseas_out_rest_stock_out_data_count_span1" data-index="1"></span>)</li>
                                <li data-index="3">作废(<span class="num"
                                        id="overseas_out_rest_stock_out_data_count_span2" data-index="3"></span>)</li>
                            </ul>
                        </div>
                        <div>
                            <a href="${ctx}/static/templet/importOtherStorageTemplate.xlsx">下载导入模板</a>
                        </div>
                        <div class="btn-group">
                            <permTag:perm funcCode="overseas_out_add_purchaserOtherStorageOut">
                                <button type="button" class="layui-btn layui-btn-sm"
                                    id="overseas_out_rest_stock_out_other_add">新增</button>
                            </permTag:perm>
                            <permTag:perm funcCode="overseas_out_audit_purchaserOtherStorageOut">
                                <button type="button" class="layui-btn layui-btn-sm "
                                    id="overseas_out_rest_stock_out_batch_check_rest_out_order">批量审核</button>
                            </permTag:perm>
                            <!-- 导出功能暂时不做                            -->
                            <!-- <permTag:perm funcCode="export_purchaserOtherStorageOut">
                                <button type="button" class="layui-btn layui-btn-sm "
                                    id="overseas_out_reststockout_exportOtherStorageOutBtn">导出</button>
                            </permTag:perm> -->
                        </div>
                    </div>
                    <table class="layui-table" id="overseas_out_rest_stock_out_dataTable"
                        lay-filter="overseas_out_rest_stock_out_dataTable" style="margin-top: 0px;"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 渲染表格数据 -->
<script type="text/html" id="overseas_out_rebackorder_imageTpl">
            <div>
                <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
            </div>
        </script>
<%--TODO?????--%>
<%-- <script type="text/html" id="restockout_isSale_Tpl">
            {{# if(d.isSale ){ }}
                    <div style="color: forestgreen;">在售</div>
            {{# }else {}}
                <div style="color: red;">停售</div>
            {{# }}}
        </script>

        <script type="text/html" id="layer_rebackitemoption">
            {{# if(d.otherStorageOutNumber == null || d.otherStorageOutNumber == '' ){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
            {{# }}}
        </script>

        <script type="text/html" id="layer_restoutNum">
            <input type="number" class="layui-input" name="outNum" value="{{d.outNum}}" min="0">
        </script>--%>

<%--  <script type="text/html" id="tpl_restoutlocation">
      {{# if(d.warehouseName){ }}
      <div>{{d.stockLocation||''}}</div>
      <div>[<span class="font_weight">{{d.warehouseName||''}}</span>]</div>
      {{# }}}
  </script>--%>
<script type="text/html" id="overseas_out_tpl_rest_out_order_number">
            <div class="text_l"><span class="font_color">出库:</span>
                <span class="canClickEl showSpan clcikRoutTo pora copySpan">
                    <a>{{d.overseasStockOutNumber || ''}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                </span>
            </div>
        </script>


<script type="text/html" id="overseas_out_rest_out_tpl_creator">
            <div class="text_l"><span class="font_color">经办:</span><span>{{d.director}}</span></div>
            <div class="text_l"><span class="font_color">制单:</span> {{# if(d.creator){ }}<span>{{d.creator}}</span> {{# }}}</div>
            {{# if(d.auditor){ }}
                <div class="text_l"><span class="font_color">审核:</span><span>{{d.auditor}}</span></div>
            {{# }}}
            {{# if(d.invalidUser){ }}
                <div class="text_l"><span class="font_color">作废:</span><span>{{d.invalidUser}}</span></div>
            {{# }}}
        </script>

<script type="text/html" id="overseas_out_rest_out_tpl_createTime">
            <div class="text_l"><span class="font_color">制单:</span><span>{{Format((d.createTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# if(d.auditTime){ }}
                <div class="text_l"><span class="font_color">审核:</span><span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# }}}
            {{# if(d.invalidTime){ }}
            <div class="text_l"><span class="font_color">作废:</span><span>{{Format(d.invalidTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# }}}
        </script>

<script type="text/html" id="overseas_out_rest_stock_out_tpl_option">
    <permTag:perm funcCode="overseas_out_show_purchaserOtherStorageOut">
                <a class="layui-btn layui-btn-xs" lay-event="edit">详情</a>
    </permTag:perm>
            {{# if(d.processStatus=="0"){}}
    <permTag:perm funcCode="overseas_out_delete_purchaserOtherStorageOut">
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="abodon">作废</a>
    </permTag:perm>
            {{# }}}
    <permTag:perm funcCode="overseas_out_a_purchaserOtherStorageOut">
                <a class="layui-btn layui-btn-xs" href="${ctx}/static/html/overseas_storage_out_other_print.html?overseasStockOutNumber={{d.overseasStockOutNumber}}" target="_blank" lay-tips="预览打印">打印</a><br>
    </permTag:perm>
        </script>
<!-- 添加商品弹框 -->
<script type="text/html" id="overseas_out_layer_additem">
            <div class="layui-row  layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <form  class="layui-form  pd" id="">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="layer_sku" id="overseas_out_layer_sku" class="layui-input" placeholder="">
                                    <input hidden>     
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm" id="overseas_out_rest_stock_out_layer_search_item_btn">查询</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="pd">
                        <table class="layui-table" id="overseas_out_layer_item_table" lay-filter="overseas_out_layer_item_table"></table>
                    </div>
                </div>
            </div>
        </script>

<!-- 新增编辑弹框 -->
<script type="text/html" id="overseas_out_other_list_add_or_edit">
            <div class="layui-row" style="padding: 20px 40px 40px 0">
                <div class="layui-tab" lay-filter="overseas_out_rest_stock_out_detail_tab_filter">
                    <ul class="layui-tab-title">
                        <li class="layui-this">详情</li>
                        <li isLog="1">日志</li>
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <div class="layui-col-md12 layui-col-lg12">
                                <div class="layui-form">
                                    <form class="layui-form" id="overseas_out_new_rest_outForm">
                                        <input type="text" name="overseasStorageId" hidden>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="restoutNo" style="background-color: #cccccc" name="overseasStockOutNumber" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">出库类型</label>
                                            <div class="layui-input-block">
                                                <select name="overseasOutType" id="layer_overseasOutTypeList"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">仓库</label>
                                            <div class="layui-input-block">
                                                <select name="overseasStorageId" id="layer_overseasWarehouseList" lay-filter="layer_overseasWarehouseList" lay-search=""></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">经办人</label>
                                            <div class="layui-input-block">
                                                <select name="directorId" id="layer_overseasDirectorList" lay-search=""></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">问题备注</label>
                                            <div class="layui-input-block">
                                                <textarea placeholder="请输入内容" class="layui-textarea" id="overseas_out_rest_stock_out_problemRemark" name="problemRemark"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="layui-col-md12 layui-col-lg12 dis_flex_start pd" style="justify-content:space-between;">
                                        <div style="display:flex;">
                                            <div class="stockin_title">出库商品</div>
                                            <button type="button" class="layui-btn layui-btn-sm" id="overseas_out_rest_stock_out_add_item_btn">添加商品</button>
                                            <span class="layui-btn layui-btn-sm" id="overseas_out_rest_stock_out_add_item_import">导入Excel表格</span>
                                            <input type="file" name="sInfoExcel" id="overseas_out_rest_stock_out_add_item_import_input" class="hidden">
                                            <span style="margin-left:10px;"><font size="4" color="red">请使用Ctrl+F快捷键进行查找功能!</font></span>
                                        </div>
                                        <div>
                                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="overseas_out_reststockout_allCount">
                                                计数
                                            </span>
                                        </div>
                                    </div>
                                    <div class="layui-col-md12 layui-col-lg12 pd">
                                        <%-- <table class="layui-table" id="reststockout_add_table" lay-filter="reststockout_add_table"></table> --%>
                                        <table class="layui-table">
                                            <thead>
                                                <tr>
                                                    <th width="80">图片</th>
                                                    <th>
                                                        商品sku 
                                                        <font color="red" id="prodSku_btn">数量:0</font>
                                                    </th>
                                                    <th>商品名称</th>
                                                    <th width="80">含税单价(￥)</th>
                                                    <th>可用库存</th>
                                                    <th>
                                                        出库数量
                                                        <font color="red" id="outNumber_btn">总计:0</font>
                                                    </th>
                                                    <th>
                                                        出库金额
                                                        <font color="red" id="outMoney_btn">总额:0</font>
                                                    </th>
                                                    <th width="80">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody id="overseas_out_rest_stock_out_productsDetail">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-item p20">
                            <div class="layui-tab layui-tab-brief">
                                <div class="layui-show">
                                    <table class="layui-table" id="overseas_out_rest_stock_out_logTab" lay-filter="overseas_out_rest_stock_out_logTab"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </script>

<script type="text/html" id="overseas_out_rest_stock_out_products_detailTpl">
            {{# if(d){  }}
                {{#  layui.each(d, function(index, item){ }}
                <tr data-index = "{{item.registerId||0}}">
                    <%-- 图片 --%>
                    <td data-field="image" data-image="{{item.image || ''}}">
                        <img width="60" height="60" data-original="${tplIVP}{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                        <input type="hidden" value="{{item.prodPId || ''}}">
                    </td>
                    <%-- 商品SKU --%>
                    <td data-field="registerSku">{{item.registerSku||''}}</td>
                    <%-- 商品名称 --%>
                    <td data-field="title">
                        {{item.title||""}}
                        <input type="hidden" value="{{item.prodPSku || ''}}">
                    </td>
                    <%-- 含税单价 --%>
                    <td data-field="buyerPrice">{{item.buyerPrice === undefined ? '' : item.buyerPrice}}</td>
                    <%-- 可用库存 --%>
                    <td data-field="availableStock">{{item.availableStock}}</td>
                    <%-- 出库数量 --%>
                    <td data-field="outNum">
                        <input class="layui-input" type="number" value="{{item.outNum||0}}" min="0" name="outNum">
                    </td>
                    <%-- 出库金额 --%>
                    <td data-field="storageOutMoney">{{item.storageOutMoney || ''}}</td>
                    <%-- 操作 --%>
                    <td data-field="delete">
                        <span class="layui-btn layui-btn-danger layui-btn-xs" onclick="commonDelTr(this)">移除</span>
                    </td>
                </tr>
                {{#  }) }}
                {{# } }}
        </script>

<!--导出其它出库单--->
<script type="text/html" id="overseas_out_reststockout_exportOtherStorageOutPop">
            <form class="layui-form">
                <div><input type="checkbox" title="全选" lay-filter="overseas_out_reststockout_exportOtherStorageOutInfo_selectAll"></div>
            </form>
            <div class="p20">
                <div class="layui-tab layui-tab-card">
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show p20">
                            <form class="layui-form" id="overseas_out_reststockout_exportOtherStorageOutInfoForm" lay-filter="overseas_out_reststockout_exportOtherStorageOutInfoForm">
                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                    <legend style="font-size:14px">基本信息</legend>
                                </fieldset>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库单号" title="出库单号" disabled lay-skin="primary" checked></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库类别" title="出库类别" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="经办人" title="经办人" lay-skin="primary"></div>
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
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库数量" title="出库数量" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库金额" title="出库金额" lay-skin="primary"></div>
                                <div style="clear:left"></div>
                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                    <legend style="font-size:14px">基本信息</legend>
                                </fieldset>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次出库数量" title="本次出库数量" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次出库金额" title="本次出库金额" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="问题备注" title="入库备注" lay-skin="primary"></div>
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
<script src="${ctx}/static/js/wyt/houselist/reststockout.js"></script>