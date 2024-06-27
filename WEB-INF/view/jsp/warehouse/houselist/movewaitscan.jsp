<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <title>移库待点货</title>
    <style>
        #LAY-movewaitscan .layui-form-label {
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
        .ml {
            margin-left: 10px;
        }
        #LAY-stockinorder .layui-btn+.layui-btn {
            margin-left: 0px!important;
        }
        table.colspantable td{
            border:0px;
        }
    </style>
    <div class="layui-fluid" id="LAY-movewaitscan">
        <div class="layui-row  layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form  class="layui-form" id="movewaitscan_form">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label">
                                        <select name="skuSearchType" id="movewaitscan_skuSearchType">
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
                                        <select name="storeId" id="movewaitscan_warehouseList"></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2" style="padding-left:10px;">
                                    <div class="layui-form-label">
                                        <select name="orderType" id="movewaitscan_orderType">
                                            <option value="0">采购入库单</option>
                                            <option value="1">采购订单</option>
                                            <option value="2">1688单号</option>
                                            <option value="3">快递单号</option>
                                    </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="orderNumber" id="movewaitscan_orderNumber" class="layui-input" placeholder="默认模糊查询">
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <div class="layui-form-label ml">
                                        <select name="timeType">
                                            <option value="0">制单时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="timerange" id="movewaitscan_timerange_input" class="layui-input" readonly>
                                    </div>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1" style="text-align:right">
                                    <button class="layui-btn layui-btn-sm"  lay-filter="movewaitscan_search_btn" id="movewaitscan_search_btn">查询</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-tab" id="movewaitscan_data_count_tab"  lay-filter="movewaitscan_data_count_tab">
                        <div class="layui-card-header dis_flex">
                            <div style="float:left;" >
                                <ul class="layui-tab-title fl">
                                    <li class="layui-this" data-index="0">数量(<span class="num" id="movewaitscan_data_count_span" ></span>)</li>
                                </ul>
                            </div>
                        </div>
                        <table class="layui-table" style="margin: 0;" id="movewaitscan_dataTable" lay-filter="movewaitscan_dataTable"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--商品sku模板-->
<script type="text/html" id="movewaitscan_prodSSku_tpl">
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
            <td style="width:30%;text-align: left;padding-left: 5px;color: #000;">
                {{item.prodSSku}}
            </td>
            <td style="width:40%;text-align: center;color: #000;"> {{item.title  }}</td>
            <td style="width:30%;text-align: center;color: #000;">
                <div>[<span class="font_weight">{{d.warehouseName}}</span>]</div>
                <div>{{item.stockLocation ||''  }}</div>
            </td>
        </tr>
        {{#  }); }}
    </table>
</script>
<script type="text/javascript" src="${ctx}/static/js/warehouse/movewaitscan.js"></script>
