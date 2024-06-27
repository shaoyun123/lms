<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>调拨单</title>
            <style>
                .fr {
                    float: right;
                }
                
                .skyblue {
                    color: skyblue;
                }
                
                .hidden {
                    display: none!important;
                }
                
                .dis_flex_align {
                    display: flex;
                    justify-content: space-between;
                }

                .dis_flex_start_align {
                    display: flex;
                    justify-content: start;
                }     
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .gray {
                    color: gray;
                }
                
                .text_l {
                    text-align: left;
                }

                #LAY-transferOrder .layui-btn+.layui-btn{
                    margin-left: 0!important;
                }

                .t_head{
                    width:25%;
                    border-right:1px solid #e6e6e6;
                    text-align: center;
                }

                .mtb {
                    margin: 5px 0;
                }

                .pd{
                    padding: 10px;
                }
                .redfont{
                    color:red!important;
                }
                .expandAlltransferOrder{
                    color:lightblue;
                    cursor: pointer;
                }
                #transferOrder_pagination {
                  height: 32px;
                  position: fixed;
                  bottom: 0;
                  left: 30px;
                  background: #fff;
                  z-index: 999999;
                  width: 100%;
                  box-shadow: 0 2px 4px #000;
                  padding: 3px 15%;
                }
            </style>
            <div class="layui-fluid" id="LAY-transferOrder">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="transferorderForm" lay-filter="transferorderForm">
                                    <div class="layui-form-item">
                                      <input type="hidden" name="page" value="1">
                                      <input type="hidden" name="limit" value="100">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">商品子SKU</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="skus" class="layui-input" placeholder="多个SKU使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">调出仓库</label>
                                            <div class="layui-input-block">
                                                <select name="outStorageId"  lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">调入仓库</label>
                                            <div class="layui-input-block">
                                                <select name="intoStorageId"  lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">调拨类型</label>
                                            <div class="layui-input-block">
                                                <select name="tranType" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">制单人</label>
                                            <div class="layui-input-block">
                                                <select name="createId"  lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">调拨单</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="tranOrderIds" class="layui-input" placeholder="多个调拨单号使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">备注</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="remark">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">是否配货</label>
                                            <div class="layui-input-block">
                                                <select name="consigneeStatus">
                                                    <option ></option>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <div class="layui-form-label" style="padding:0;margin-left: 5px;">
                                                <select name="timeType">
                                                    <option value="1">制单时间</option>
                                                    <option value="0">审核时间</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="transferorder_time" name="time" lay-verify="required" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">是否生成批次</label>
                                            <div class="layui-input-block">
                                               <select name="generateBatch">
                                                    <option value=""></option>
                                                    <option value="1">是</option>
                                                    <option value="0">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit id="transferOrderSearch" lay-filter="transferOrderSearch">查询</button>
                                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                            </div>
                                        </div>
                                        <button type="button" class="hidden" lay-submit id="actualtransferOrder_export" lay-filter="actualtransferOrder_export">导出</button>
                                        <input type="hidden" name="status" value="0">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab" lay-filter="transferOrder_Tab" id="transferOrder_Tab">
                                    <div class="dis_flex_align">
                                        <div style="height:42px;">
                                            <ul class="layui-tab-title" style="width: 80%;">
                                                <li data-index="0" class="layui-this">未审核(<span></span>)</li>
                                                <li data-index="4">已配货(<span></span>)</li>
                                                <li data-index="5">仓库少货(<span></span>)</li>
                                                <li data-index="1">已审核(<span></span>)</li>
                                                <li data-index="2">作废(<span></span>)</li>
                                            </ul>
                                        </div>
                                        <input type="file" name="uploadTemplate" id="transferOrder_uploadTemplate" class="hidden">
                                        <div>
                                          <span class="layui-btn layui-btn-normal layui-btn-sm disN" id="transferOrder_onestopreview">一条龙审核</span>
                                            <permTag:perm funcCode="transferOrder_relocationAndPickup">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_relocationAndPickup">生成移库取货</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_batchAudit">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_batchAudit">批量审核</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_batchInvalid">
                                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" id="transferOrder_batchInvalid">批量作废</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_download">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_download">下载模板</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_upload">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_upload" onclick="document.getElementById('transferOrder_uploadTemplate').click()">上传表格</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_new">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_new">新增</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="transferOrder_export">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_export">导出</button>
                                        </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <table lay-filter="transferOrder_table" class="layui-table" id="transferOrder_table"></table>
                                        <div id="transferOrder_pagination"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 二级表格渲染模板 -->
            <script type="text/html" id="transferorder_detail_tpl">
                {{# if(d.detailList){ }}
                     <table class="layui-table" style="width:100%;text-align: center;color: #000;">
                         {{# layui.each(d.detailList, function(index, item){ }}
                         {{# if(index < 5){ }}
                         <tr>
                             <td style="width:25%;">{{item.prodSSku||''}}</td>
                             <td style="width:25%;">{{item.title||''}}</td>
                             <td style="width:20%;">{{item.outTaxPer||''}}</td>
                             <td style="width:15%;">{{item.outNumber||''}}</td>
                             <td style="width:10%;">{{item.inTaxPer||''}}</td>
                         </tr>
                         {{# }else{ }}
                         <tr class="hidden expandrow">
                            <td style="width:25%;">{{item.prodSSku||''}}</td>
                            <td style="width:25%;">{{item.title||''}}</td>
                            <td style="width:20%;">{{item.outTaxPer||''}}</td>
                            <td style="width:15%;">{{item.outNumber||''}}</td>
                            <td style="width:10%;">{{item.inTaxPer||''}}</td>
                        </tr>
                         {{# } }}
                         {{# }) }}
                     </table>
                     {{# if(d.detailList.length > 5){ }}
                     <div class="expandAlltransferOrder" data-flag="close">展开</div>
                     {{# } }}
                {{# } }}
             </script>
             <!-- 其他成本 -->
            <script type="text/html" id="transferorder_costs_tpl">
                <div><span class="gray">包装人工费:</span><span>{{d.packPersonFee||""}}<span></div>
                <div><span class="gray">包装材料费:</span><span>{{d.packMaterialsFee||""}}</span></div>
                <div><span class="gray">头程运费:</span><span>{{d.headFreight||""}}</span></div>
                <div><span class="gray">关税:</span><span>{{d.tariff||""}}</span></div>
            </script>

            <script type="text/html" id="transferorder_operator_tpl">
                <div style="text-align: left;">
                    <div><span class="gray">制单:</span><span>{{d.creator||""}}<span></div>
                    <div><span class="gray">批次:</span><span>{{d.batchUserName||""}}<span></div>
                    <div><span class="gray">取货:</span><span>{{d.consigneeName||""}}<span></div>
                    {{# if(d.status!=2){ }}
                    <div><span class="gray">审核:</span><span>{{d.auditor||""}}</span></div>
                    {{# }else{ }}
                    <div><span class="gray">作废:</span><span>{{d.invalidUser||""}}</span></div>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="transferorder_time_tpl">
                <div style="text-align: left;">
                    <div style="white-space: nowrap;"><span class="gray">制单:</span><span>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}<span></div>
                    <div style="white-space: nowrap;"><span class="gray">批次:</span><span>{{Format(d.batchTime,'yyyy-MM-dd hh:mm:ss')}}<span></div>
                    <div style="white-space: nowrap;"><span class="gray">取货:</span><span>{{Format(d.consigneeTime,'yyyy-MM-dd hh:mm:ss')}}<span></div>
                    {{# if(d.status!=2){ }}
                    <div style="white-space: nowrap;"><span class="gray">审核:</span><span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    {{# }else{ }}
                    <div style="white-space: nowrap;"><span class="gray">作废:</span><span>{{Format(d.invalidTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="transferorder_option_tpl">
                <div>
                    {{# if(d.status==0){  }}
                    <permTag:perm funcCode="transferOrder_modify">
                    <span class="layui-btn layui-btn-xs" lay-event="transferOrder_modify">修改</span><br>
                   </permTag:perm>
                    <permTag:perm funcCode="transferOrder_audit">
                    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="transferorder_auth">审核</span><br>
                    </permTag:perm>
                    <permTag:perm funcCode="transferOrder_abondon">
                    <span class="layui-btn layui-btn-xs layui-btn-warm" lay-event="transferorder_abondon">作废</span><br>
                   </permTag:perm>
                    <permTag:perm funcCode="transferOrder_print">
                    <span class="layui-btn layui-btn-xs " lay-event="transferorder_print" target="_blank"  lay-tips="预览打印">打印</span><br>
                    </permTag:perm>
                    {{# }else if(d.status==4){ }}
                    <permTag:perm funcCode="transferOrder_audit">
                    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="transferorder_auth">审核</span><br>
                    </permTag:perm>
                    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="transferorder_detail">详情</span><br>
                    <permTag:perm funcCode="transferOrder_print">
                    <span class="layui-btn layui-btn-xs " lay-event="transferorder_print" target="_blank"  lay-tips="预览打印">打印</span><br>
                    </permTag:perm>
                    {{# }else if(d.status==5||d.status==1||d.status==2){}}
                    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="transferorder_detail">详情</span><br>
                    <permTag:perm funcCode="transferOrder_print">
                    <span class="layui-btn layui-btn-xs " lay-event="transferorder_print" target="_blank"  lay-tips="预览打印">打印</span><br>
                    </permTag:perm>
                    {{# } }}
                </div>
            </script>

            <script type="text/html" id="transferorder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="orginal_order_number">
                <input type="number" class="layui-input" name="demolitionQuality">
            </script>

            <script type="text/html" id="transferorder_edit_option">
                <!-- <button class="layui-btn layui-btn-xs" lay-event="transferOrder_modify">修改订单</button> -->
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>

            <!-- 表格渲染模板 -->

            <!-- 细分表头 -->
            <script type="text/html" id="transferOrder_Detil">
                <div class='dis_flex_align'>
                <div class='t_head' style="width:25%;">SKU</div>
                <div class='t_head' style="width:25%;">商品名称</div>
                <div class='t_head' style="width:20%;">出库单价(￥)</div>
                <div class='t_head' style="width:15%;">出库数量</div>
                <div class='t_head' style="width:10%;">入库单价(￥)</div>
                </div>
             </script>
             <!-- 细分表头 -->
            <!-- 商品详情 -->
            <script type="text/html" id="pop_transferorder_detail">
                <div class="mg_50">
                    <table class="layui-table" id="transferorder_detail_table" lay-filter="transferorder_detail_table"></table>
                </div>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_transferorder_newandeditorder">
                <div class="mg_50">
                    <form class="layui-form" id="transferorder_editForm" lay-filter="transferorder_editForm">
                        <div class="layui-form-item">
                            <!-- <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="tranOrderId" class="layui-input" readonly>
                                </div>
                            </div> -->
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label"><span class="redfont">*</span>调出仓库</label>
                                <div class="layui-input-block">
                                    <select name="outStorageId" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label"><span class="redfont">*</span>调入仓库</label>
                                <div class="layui-input-block">
                                    <select name="intoStorageId" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label"><span class="redfont">*</span>调拨类型</label>
                                <div class="layui-input-block">
                                    <select name="tranType" lay-search lay-verify="required">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">快递方式</label>
                                <div class="layui-input-block">
                                    <select name="deliveryType" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">快递单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="deliveryNumber" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="remark" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">包装人工费(￥)</label>
                                <div class="layui-input-block">
                                    <input type="number" name="packPersonFee" class="layui-input" value="0">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">包装材料费(￥)</label>
                                <div class="layui-input-block">
                                    <input type="number" name="packMaterialsFee" class="layui-input" value="0">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">头程运费(￥)</label>
                                <div class="layui-input-block">
                                    <input type="number" name="headFreight" class="layui-input" value="0">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">关税(￥)</label>
                                <div class="layui-input-block">
                                    <input type="number" name="tariff" class="layui-input" value="0">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <button type="button" id="updateCosts" class="layui-btn layui-btn-xs layui-btn-normal">更新入库成本</button>
                                </div>
                            </div>
                            <button type="button" class="hidden" id="transferedit_submit" lay-filter="transferedit_submit" lay-submit></button>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4 dis_flex_start_align btngroup">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="transferOrder_addProducts">添加商品</button>
                                <!-- <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" onclick="downloadModel()">下载模板</button>
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" onclick="importbtn(this)">导入商品</button>
                                <input type="file" name="sInfoExcel" id="transferOrder_importPro_input" class="hidden"> -->
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12 ">
                                <table class="layui-table">
                                    <thead>
                                        <tr>
                                            <th>图片</th>
                                            <th>商品sku</th>
                                            <th>商品名称</th>
                                            <th>出库含税单价(￥)</th>
                                            <th style="min-width:100px">出库数量</th>
                                            <th>出库金额</th>
                                            <th>包装人工费(￥)</th>
                                            <th>包装材料费(￥)</th>
                                            <th>头程运费(￥)</th>
                                            <th>关税(￥)</th>
                                            <th>入库含税单价(￥)</th>
                                            <th>入库金额(￥)</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody id="productsDetail">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </script>

            <script type="text/html" id="productsDetailtpl">
                {{# if(d){  }}
                {{#  layui.each(d, function(index, item){ }}
                <tr data-outerBoxHeight="{{item.outerBoxHeight||0}}" 
                data-outerBoxLength="{{item.outerBoxLength||0}}"
                data-outerBoxWidth="{{item.outerBoxWidth||0}}"
                data-suttleWeight ="{{item.suttleWeight||0}}"
                data-packWeight = "{{item.packWeight||0}}"
                data-index = "{{item.prodSId||0}}"
                >
                    <td data-field="image" data-image="{{item.image}}">
                        <img width="60" height="60" data-original="${tplIVP}{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                    </td>
                    <td data-field="prodSSku">{{item.prodSSku||''}}</td>
                    <td data-field="title">{{item.title||""}}</td>
                    <td data-field="outTaxPer">{{item.outTaxPer!==undefined?item.outTaxPer:''}}</td>
                    <td data-field="outNumber" style="min-width:100px"><input class="layui-input" type="number" value="{{item.outNumber||0}}"></td>
                    <td data-field="outPrice">{{item.outPrice!=undefined?item.outPrice:''}}</td>
                    <td data-field="packPersonFee">{{item.packPersonFee!=undefined?item.packPersonFee:""}}</td>
                    <td data-field="packMaterialsFee">{{item.packMaterialsFee!=undefined?item.packMaterialsFee:""}}</td>
                    <td data-field="headFreight">{{item.headFreight!=undefined?item.headFreight:""}}</td>
                    <td data-field="tariff">{{item.tariff!=undefined?item.tariff:""}}</td>
                    <td data-field="inTaxPer">{{item.inTaxPer!=undefined?item.inTaxPer:""}}</td>
                    <td data-field="inPrice">{{item.inPrice!=undefined?item.inPrice:""}}</td>
                    <td><button class="layui-btn layui-btn-primary layui-btn-sm" type="button" onclick="$(this).parents('tr').remove()">移除</button></td>
                </tr>
                {{#  }) }}
                {{# } }}
            </script>
            
    <!-- 添加商品弹框 -->
        <script type="text/html" id="transferOrder_addProduct">
            <div class="layui-row  layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <form class="layui-form  pd" >
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <button  type="button" class="layui-btn layui-btn-sm">查询</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="pd">
                        <table class="layui-table" id="transferOrder_addProduct_table" lay-filter="transferOrder_addProduct_table"></table>
                    </div>
                </div>
            </div>
        </script>

<!-- 生成移库取货 -->
<script type="text/html" id="pop_transferorder_relocationAndPickup">
      <form class="layui-form" style="margin: 10px">
          <div class="layui-form-item">
              <label class="layui-form-label">移库类型</label>
              <div class="layui-input-block">
                  <select name="transferType"></select>
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label">目标通道</label>
              <div class="layui-input-block">
                  <input type="text" class="layui-input" name="targetChannel">
              </div>
          </div>
      </form>
</script>
<!-- 一条龙审核 -->
<script type="text/html" id="transferOrder_onestopreviewLayer">
  <div style="padding: 10px">
    <form class="layui-form" style="display: flex;margin-left:-50px;">
      <div class="layui-form-item">
        <label class="layui-form-label">调拨单</label>
          <div class="layui-input-block">
            <input type="text" name="requestOrder" class="layui-input" id="oneStopTransferId">
          </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">数量</label>
          <div class="layui-input-block">
            <input type="text" name="requestNum" class="layui-input" id="onStopTransferNum">
          </div>
      </div>
    </form>
    <table class="layui-table">
      <!-- <thead>
        <tr>
          <th>调拨单</th>
          <th>SKU</th>
          <th>调拨类型</th>
          <th>业务单号</th>
          <th>数量</th>
        </tr>
      </thead> -->
      <tbody id="transferOrder_onestopreviewTbody"></tbody>
    </table>
  </div>
</script>

<!-- 表格渲染模板 -->
<script src="${ctx}/static/js/warehouse/transferOrder.js"></script>
