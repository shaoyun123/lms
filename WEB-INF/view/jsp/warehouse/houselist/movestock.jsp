<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
        <title>移库取货</title>
        <style type="text/css">
            #LAY-movestock .dis_flex_between {
                display: flex;
                justify-content: space-between;
            }
            #LAY-movestock .w_80{
                width: 80%;
            }
            .pd {
                padding: 10px!important;
            }
            .dis_flex_start {
                display: flex;
                justify-content: flex-start;
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
            .movestock_page{
                position: fixed;
                bottom: 0px;
                left: 80px;
                background:#fff;
                width: 100%;
                height: 50px;
            }
            #LAY-movestock{
                padding-bottom: 50px;
            }
            .movestock_header .layui-icon{
                margin-top: 0px;
                right: 0px;
            }
            #movestockCard #movestockCard-handleBtn .layui-form-checkbox .layui-icon {
              margin: 0 -20px 0 0;
            }
            #movestock_transfer_typeId {
              overflow: visible;
            }
        </style>
        <div class="layui-fluid" id="LAY-movestock">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form" id="movestock_search_form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">仓库</label>
                                        <div class="layui-input-block">
                                            <select name="warehouseId" class="warehouseId" lay-filter="movestock_warehouseId" id="warehouseId" lay-verify="required"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">移库类型</label>
                                        <div class="layui-input-block">
                                            <select name="transferTypeList" xm-select="sku_location_transfer_type"
                                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                                id="sku_location_transfer_type">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">批次号</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="batchNumbers" placeholder="单个模糊">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">当时库位</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="currentLocation" placeholder="单个模糊">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">SKU</label>
                                        <div class="layui-input-block">
                                            <input name="skus" type="text" placeholder="商品sku，支持多个逗号" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">取货人</label>
                                        <div class="layui-input-block dimSearchContent">
                                            <input type="hidden" name="consigneeId">
                                            <div>
                                                <input name="consigneeName" id="movestock_consigneeId" type="text" class="layui-input" placeholder="渐进搜索">
                                            </div>
                                            <div class="dimResultDivconsigneeName"></div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">上架人</label>
                                        <div class="layui-input-block dimSearchContent">
                                            <input type="hidden" name="moveLocationUserId">
                                            <div>
                                                <input name="moveLocationUserName" id="movestock_moveLocationUserId" type="text" class="layui-input" placeholder="渐进搜索">
                                            </div>
                                            <div class="dimResultDivmoveLocationUserId"></div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">楼栋</label>
                                        <div class="layui-input-block">
                                            <select name="buildingNo" class="buildNo" lay-filter="movestock_buildNo">
                                             </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">生产批次</label>
                                        <div class="layui-input-block">
                                            <select name="generateBatchType">
                                                <option value="0">未生成</option>
                                                <option value="1">已生成</option>
                                                <option value="2" selected>全部</option>
                                             </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">取货状态</label>
                                        <div class="layui-input-block">
                                            <select name="consignStatus">
                                                <option value="0">未取件</option>
                                                <option value="1">已取件</option>
                                                <option value="2" selected>全部</option>
                                             </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">移库状态</label>
                                        <div class="layui-input-block">
                                            <select name="moveLocationType">
                                                <option value="0">未移库</option>
                                                <option value="1">已移库</option>
                                                <option value="" selected>全部</option>
                                             </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">排序方式</label>
                                        <div class="layui-input-block">
                                            <select name="orderByType">
                                                <option value="0">按创建时间倒序</option>
                                                <option value="1">按库位正序</option>
                                                <option value="2">按库位倒序</option>
                                                <option value="3">按sku正序</option>
                                                <option value="4">按sku倒序</option>
                                             </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select name="dateType">
                                                <option value="1">创建时间</option>
                                                <option value="2">取货时间</option>
                                                <option value="3">上架时间</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" id="whMoveStockTime"
                                                   name="whMoveStockTimeInput">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">楼层</label>
                                        <div class="layui-input-block">
                                            <select name="currentFloor" class="floorNo">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">创建人</label>
                                        <div class="layui-input-block dimSearchContent">
                                            <!-- <input type="hidden" name="creatorId"> -->
                                            <div>
                                                <input name="creatorIdsStr" id="movestock_creator" type="text" class="layui-input">
                                            </div>
                                            <!-- <div class="dimResultDivCreatorName"></div> -->
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">目标通道</label>
                                        <div class="layui-input-block">
                                            <input name="targetAisle" id="" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">业务单号</label>
                                        <div class="layui-input-block">
                                            <input name="tranOrderId" id="" class="layui-input" placeholder="英文逗号分割">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                      <label class="layui-form-label">备注</label>
                                      <div class="layui-input-block">
                                          <input name="remark" class="layui-input">
                                      </div>
                                  </div>
                                    <input type="hidden" name="limit" value="50">
                                    <input type="hidden" name="page" value="1">
                                    <input type="hidden" name="status" value="true">
                                    <div class="layui-col-md12 layui-col-lg12" style="text-align: right;">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit lay-filter="movestock_submit" id="movestock_submit">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card" id="movestockCard">
                        <div class="fixHigh">
                          <div class="layui-card-header">
                            <div class="fixTab">
                              <!-- 页签点击结构 -->
                              <div class="layui-tab" lay-filter="movestock-tabs"
                              id="movestock-tabs">
                                  <ul class="layui-tab-title">
                                      <li class="layui-this">有效<span></span></li>
                                      <li>作废<span class=""></span></li>
                                      <li>全部<span></span></li>
                                  </ul>
                              </div>
                              <div style="display:flex;justify-content: center;align-items: center;" id="movestockCard-handleBtn">
                                <div class="layui-form">
                                  <input type="checkbox" name="urgent" title="紧急批次" lay-skin="primary" id="movestock_urgent">
                                </div>
                                <permTag:perm funcCode="movestock_generate">
                                      <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="movestock_generateBatch">生成批次</button>
                                </permTag:perm>
                                <permTag:perm funcCode="movestock_generateAll">
                                    <div class="layui-form" style="display:inline-block;margin: 0 5px;">
                                        <select id="movestock_batchSelectNumber">
                                            <option value="">选择数量上限</option>
                                            <option value="30">30</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="150">150</option>
                                            <option value="200">200</option>
                                        </select>
                                    </div>
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestock_generateAll">批量生成批次</span>
                                </permTag:perm>
                                <div class="layui-form" style="display:inline-block;margin: 0 5px;">
                                  <select lay-filter="movestock_printFilter">
                                      <option value="">打印</option>
                                      <option value="printBatchNo">打印批次号</option>
                                      <option value="printTransferOrder">打印调拨单</option>
                                  </select>
                                </div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="movestock_print_batch">
                                  打印批次号
                                </span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="movestock_print_allocation_order">打印调拨单</span>
                                <permTag:perm funcCode="movestock_import">
                                      <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestock_import" title="导入Excel共三列,表头分别为“SKU” 、“目标通道”、“移库类型">导入需求</span>
                                      <input type="file" name="movestock_import_file" id="movestock_import_file" hidden>
                                </permTag:perm>
                                <%-- 另一个下拉框 --%>
                                <div class="layui-form" style="display:inline-block;margin: 0 5px;">
                                    <select lay-filter="movestock_downloadFilter">
                                        <option value="">下载</option>
                                        <permTag:perm funcCode="movestock_export_transfer">
                                            <option value="export_transfer">移库取货数量</option>
                                        </permTag:perm>
                                        <option value="export_transfer_four_sales">父商品前4个子商品销量</option>
                                        <option value="export_transfer_all_sales">父商品全部子商品销量</option>
                                        <option value="export_transfer_down_tempalte">下载导入模板</option>
                                        <option value="export_pandian">盘点导出</option>
                                    </select>
                                </div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="movestock_export_transfer">
                                  移库取货数量
                                </span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="movestock_export_transfer_sales">导出父商品前4个子商品销量</span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="movestock_export_all_transfer_sales">导出父商品全部子商品销量</span>
                                <permTag:perm funcCode="movestock_update_transfer_type">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestock_update_transfer_type">修改类型</span>
                                </permTag:perm>
                                <permTag:perm funcCode="movestock_del">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestock_batchDel">批量作废</span>
                                </permTag:perm>
                              </div>
                              <div style="display:none;" id="movestockCardTab2-handleBtn">
                                 <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestockTab2_batchDel">作废调拨单</span>
                              </div>
                              <div id="movestockCardTab3-handleBtn" style="display:none;">
                                <span class="fGrey">表格中置灰为作废状态，无底色为有效状态</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="layui-card-body">
                            <table class="layui-table" id="movestock_data_table" lay-filter="movestock_data_table"></table>
                            <div class="movestock_page"><div id="movestock_page"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 渲染表格数据 -->
        <script type="text/html" id="movestock_batchNumber">
          <div>
            <span>{{d.batchNumber || ''}}</span>
            {{# if(d.urgent){ }}
            <span class="layui-badge">急</span>
            {{# } }}
          </div>
        </script>

        <script type="text/html" id="currentStock">
            <div class="text_l"><span class="font_color">真实:</span><span>{{(typeof d.currentRealInventory)!="undefined"?d.currentRealInventory:''}}</span></div>
            <div class="text_l"><span class="font_color">可用:</span><span>{{(typeof d.currentAvailableInventory)!="undefined"?d.currentAvailableInventory:''}}</span></div>
            <div class="text_l"><span class="font_color">占用:</span><span>{{(typeof d.currentOccupyInventory)!="undefined"?d.currentOccupyInventory:''}}</span></div>
            <div class="text_l"><span class="font_color">应有:</span><span>{{(typeof d.locationExpectedQuantity)!="undefined"?d.locationExpectedQuantity:''}}</span></div>
        </script>
        
        <script type="text/html" id="movestock_operator">
            <div class="text_l"><span class="font_color">创建:</span><span>{{d.creator||""}}</span></div>
            <div class="text_l"><span class="font_color">批次:</span><span>{{d.batchUserName||""}}</span></div>
            <div class="text_l"><span class="font_color">取货:</span><span>{{d.consigneeName||""}}</span></div>
            <div class="text_l"><span class="font_color">上架:</span><span>{{d.moveLocationUserName || d.auditor||""}}</span></div>
        </script>

        <script type="text/html" id="movestock_operatTime">
            <div class="text_l"><span class="font_color">创建:</span><span>{{Format((d.createTime),"yyyy-MM-dd hh:mm:ss")}}</span></div>
            <div class="text_l"><span class="font_color">批次:</span><span>{{Format((d.batchTime),"yyyy-MM-dd hh:mm:ss")}}</span></div>
            <div class="text_l"><span class="font_color">取货:</span><span>{{Format((d.consigneeTime),"yyyy-MM-dd hh:mm:ss")}}</span></div>
            <div class="text_l"><span class="font_color">上架:</span><span>{{Format((d.moveLocationTime || d.auditTime || ''),"yyyy-MM-dd hh:mm:ss")}}</span></div>
        </script>
        <script type="text/html" id="movestock_transfer_type">
            <form class="layui-form" action="" lay-filter="component-form-group" id="movestock_transfer_type_form">
            <div class="p20">
                <label class="layui-form-label">移库类型</label>
                <div class="layui-input-block">
                    <select name="script_transfer_type" id="script_transfer_type" lay-filter="" lay-search="" >
                        <option value="">全部</option>
                    </select>
                </div>
            </div>
            </form>
        </script>
        <script src="${ctx}/static/js/warehouse/movestock.js"></script>
        <script src="${ctx}/static/js/ireport/print.js"></script>
