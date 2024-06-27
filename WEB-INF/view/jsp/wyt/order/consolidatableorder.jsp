<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>可合并订单(海外仓)</title>
            <style>
                .fr {
                    float: right;
                }
                
                .skyblue {
                    color: skyblue;
                }
                
                .hidden {
                    display: none;
                }
                
                .dis_flex {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .dis_flex_space {
                    display: flex;
                    justify-content: space-between;
                }
                
                .dis_flex_around {
                    display: flex;
                    justify-content: space-around;
                }
                
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .gray {
                    color: gray;
                }

                .silver{
                    color:silver
                }
                .whitesmoke{
                    background-color: whitesmoke;
                }
                
                .text_l {
                    text-align: left;
                }
                
                .refresh_icon {
                    margin-left: 5px;
                    cursor: pointer;
                }
            </style>
            <div class="layui-fluid" id="LAY-consolidatableOrderWinit">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="consolidatableOrderWinitForm" lay-filter="consolidatableOrderWinitForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platCodes" id="platCodes" lay-filter="platCodes" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctIds" id="storeAcct" xm-select="storeAcct" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">订单编号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="ids" class="layui-input" placeholder="多个编号使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">店铺单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">买家指定物流</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="buyerRequireShippingType">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="consolidatableOrderWinitSearch" lay-filter="consolidatableOrderWinitSearch">查询</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div>
                                        <permTag:perm funcCode="consolidatableorder_mergeAll">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mergeAllOrders">合并所有订单</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="consolidatableorder_mergeSelected">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mergeChoosedOrders">合并选择订单</button>
                                        </permTag:perm>
                                    </div>
                                </div>
                                <div class="layui-tab" lay-filter="" id="">
                                    <div class="">
                                    </div>
                                    <div class="layui-tab-content">
                                        <!-- <table lay-filter="consolidatableOrderWinit_table" class="layui-table" id="consolidatableOrderWinit_table"></table> -->
                                        <table class="layui-table" id="consolidatableOrderWinit_table"  lay-filter="consolidatableOrderWinit_table">
                                            <thead>
                                                <th><div class="layui-form"><input type="checkbox" class="layui-input" lay-filter="allChecked" lay-skin="primary"></div></th>
                                                <th>订单号</th>
                                                <th>订单金额</th>
                                                <th>商品</th>
                                                <th>收件人</th>
                                                <th>物流</th>
                                                <th>时间</th>
                                                <th>状态</th>
                                            </thead>
                                            <tbody style="text-align: center;" id="consolidatableOrderWinit_table_body">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script type="text/html" id="consolidatableOrderWinit_table_bodytpl">
                {{#  layui.each(d, function(index, item){ }}
                   <tr data-index="{{index}}">
                       <td rowspan="{{Number(item.otherPlatOrders.length)+1||1}}" data-field="checkRow">
                           <div class="layui-form"><input type="checkbox" class="layui-input" lay-skin="primary" value="{{item.id}}"></div>
                       </td>
                       <td rowspan="1">
                           <div>
                            <input type="hidden" class="toAuditOrder_col_id" value="{{item.id}}">
                            <div>{{item.id||""}}
                                <span class="gray">[{{item.storeAcct||""}}[{{item.allrootAliasName||""}}]]</span>
                            </div>
                            <div>
                                <a>{{item.platOrderId}}{{# if(item.platStoreOrderId){ }}({{item.platStoreOrderId}}){{# }}}</a>
                            </div>
                           </div>
                       </td>
                       <td rowspan="1">
                        <div>
                            <div><span>{{item.currency||""}}</span><span>{{item.platOrderAmt||""}}<span></div>
                            <div><span class="gray">利润(RMB)</span><span>{{item.profit||""}}</span></div>
                        </div>
                        </td>
                       <td rowspan="1">
                           <div>
                            <div><span class="gray">种类：</span><span>{{item.skuQuantity||""}}</span></div>
                            <div><span class="gray">数量：</span><span>{{item.prodQuantity||""}}</span></div>
                            <div><span class="gray">重量：</span><span>{{item.realWeight||item.preWeight||""}}g</span></div>
                           </div>
                       </td>
                       <td rowspan="1">
                           <div>
                            <div>{{item.shippingUsername||""}}</div>
                            <div>[{{item.shippingCountryCnName||""}}]</div>
                           </div>
                       </td>
                       <td rowspan="1">
                           <div>
                            <div><span class="gray">买家:</span><span>{{item.buyerRequireShippingType||""}}<span></div>
                            <div><span class="gray">发货:</span><span>[{{item.logisTypeName||""}}]</span><span>[{{item.logisTrackingNo||""}}]</span></div>
                           </div>
                       </td>
                       <td rowspan="1">
                           <div>
                            <div><span class="gray">订单:</span><span>{{Format(item.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{item.orderDay|| '0'}})<span></div>
                            <div><span class="gray">申号:</span><span>{{Format(item.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                            <div><span class="gray">发货:</span><span>{{Format(item.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                           </div>
                       </td>
                       <td rowspan="1">
                           <div>
                               {{item.platOrderStatus}}
                           </div>
                       </td>
                       {{# if(item.otherPlatOrders&&item.otherPlatOrders.length>0){ }}
                       {{# layui.each(item.otherPlatOrders, function(childindex, childitem){ }}
                       <tr class="silver whitesmoke">
                        <td rowspan="1">
                            <div>
                             <input type="hidden" class="toAuditOrder_col_id" value="{{childitem.id}}">
                             <div>{{childitem.id||""}}
                                 <span class="silver">[{{childitem.storeAcct||""}}[{{childitem.allrootAliasName||""}}]]</span>
                             </div>
                             <div>
                                 <a class="silver">{{childitem.platOrderId}}{{# if(childitem.platStoreOrderId){ }}({{childitem.platStoreOrderId}}){{# }}}</a>
                             </div>
                            </div>
                        </td>
                        <td rowspan="1">
                         <div>
                             <div><span>{{childitem.currency||""}}</span><span>{{childitem.platOrderAmt||""}}<span></div>
                             <div><span class="silver">利润(RMB)</span><span>{{childitem.profit||""}}</span></div>
                         </div>
                         </td>
                        <td rowspan="1">
                            <div>
                             <div><span class="silver">种类：</span><span>{{childitem.skuQuantity||""}}</span></div>
                             <div><span class="silver">数量：</span><span>{{childitem.prodQuantity||""}}</span></div>
                             <div><span class="silver">重量：</span><span>{{childitem.realWeight||childitem.preWeight||""}}g</span></div>
                            </div>
                        </td>
                        <td rowspan="1">
                            <div>
                             <div>{{childitem.shippingUsername||""}}</div>
                             <div>[{{childitem.shippingCountryCnName||""}}]</div>
                            </div>
                        </td>
                        <td rowspan="1">
                            <div>
                             <div><span class="silver">买家:</span><span>{{childitem.buyerRequireShippingType||""}}<span></div>
                             <div><span class="silver">发货:</span><span>[{{childitem.logisTypeName||""}}]</span><span>[{{childitem.logisTrackingNo||""}}]</span></div>
                            </div>
                        </td>
                        <td rowspan="1">
                            <div>
                             <div><span class="silver">订单:</span><span>{{Format(childitem.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{childitem.orderDay|| '0'}})<span></div>
                             <div><span class="silver">申号:</span><span>{{Format(childitem.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                             <div><span class="silver">发货:</span><span>{{Format(childitem.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                            </div>
                        </td>
                        <td rowspan="1">
                            <div>
                                {{childitem.platOrderStatus}}
                            </div>
                        </td>
                    </tr>
                        {{# }) }}
                       {{# } }}
                   </tr>
                {{# }) }}
            </script>

            <!-- 表格渲染模板 -->
            <script type="text/html" id="FBAdelivery_imageTpl">
                <div>
                    <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="toAuditorder_id_tpl">
                <input type="hidden" class="toAuditOrder_col_id" value="{{d.id}}">
                <div>{{d.id||""}}
                    <span class="gray">[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span>
                </div>
                <div>
                    <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                </div>
            </script>
            
            <script type="text/html" id="toAuditorder_platOrderAmt_tpl">
                <div><span>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                <div><span class="gray">利润(RMB)</span><span>{{d.profit||""}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
            </script>

            <script type="text/html" id="toAuditorder_prodQuantity_tpl">
                <div><span class="gray">种类：</span><span>{{d.skuQuantity||""}}</span></div>
                <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
            </script>

            <script type="text/html" id="toAuditorder_shippingUsername_tpl">
                <div>{{d.shippingUsername||""}}</div>
                <div>[{{d.shippingCountryCnName||""}}]</div>
            </script>

            <script type="text/html" id="toAuditorder_logisTypeName_tpl">
                <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
            </script>

            <script type="text/html" id="toAuditorder_time_tpl">
                <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
            </script>


            <script type="text/html" id="toAuditorder_option_tpl">
                <button class="layui-btn layui-btn-xs" lay-event="toAuditOrder_modify">修改订单</button>
                <button class="layui-btn layui-btn-xs" lay-event="toAuditorder_demolition">拆分订单</button>
                <button class="layui-btn layui-btn-xs" lay-event="">邮件</button>
                <button class="layui-btn layui-btn-xs" lay-event="toAuditOrder_remark">备注</button>
            </script>

            <script type="text/html" id="toAuditorder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="add_product_img">
                <div>
                    <img width="60" height="60" data-original="{{d.image||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="add_product_psku">
                <div>{{d.parent.pSku}}</div>
            </script>

            <script type="text/html" id="orginal_order_products">
                <div class="dis_flex">
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                    <div>
                        <div>{{d.prodSSku||""}}</div>
                        <div>{{d.prodSSku||""}}</div>
                        <div><span>Color</span>{{d.style||""}}</div>
                    </div>
                    <div><span>×</span><span>{{d.platQuantity||""}}</span></div>
                </div>
            </script>
            <script type="text/html" id="orginal_order_stock">
                <div><span class="gray">库存sku：{{d.availableStock||"0"}}</span></div>
                <div><span class="gray">当前数量：{{d.prodQuantity||"0"}}</span></div>
            </script>

            <script type="text/html" id="orginal_order_demolition">
                <input type="checkbox" class="layui-input" lay-filter="isDemolition" name="isDemolition">
            </script>

            <script type="text/html" id="orginal_order_number">
                <input type="number" class="layui-input" name="demolitionQuality">
            </script>

            <script type="text/html" id="toAuditorder_edit_ListingID">
                <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
            </script>

            </script>

            <script type="text/html" id="toAuditorder_edit_platUnitPrice">
                <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}">
            </script>

            <script type="text/html" id="toAuditorder_edit_platQuantity">
                <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
            </script>

            <script type="text/html" id="toAuditorder_edit_platOrderDetailAmt">
                <input type="number" class="layui-input" value="{{d.platOrderDetailAmt||0}}">
            </script>

            <script type="text/html" id="toAuditorder_edit_option">
                <!-- <button class="layui-btn layui-btn-xs" lay-event="toAuditOrder_modify">修改订单</button> -->
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>

            <!-- 表格渲染模板 -->


            <!-- 合单弹框 -->
            <script type="text/html" id="pop_consolidatable_mergeOrder">
                <div class="mg_50">
                    <form class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-md6 layui-col-lg6">
                                <div>
                                    <input type="radio" checked name="isIgnoreLogis" lay-filter="isIgnoreLogis" value="false" title="买家指定物流方式不同不合单" lay-verify="required">
                                </div>
                                <div>
                                    <input type="radio" name="isIgnoreLogis" lay-filter="isIgnoreLogis" value="true" title="买家指定物流方式不同也合单" lay-verify="required">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </script>

            <!-- 表格渲染模板 -->
            <script src="${ctx}/static/js/order/winit/consolidatableorder.js"></script>