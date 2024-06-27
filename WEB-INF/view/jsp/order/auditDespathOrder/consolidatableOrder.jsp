<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>可合并订单</title>
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
                
                .text_l {
                    text-align: left;
                }
                
                .refresh_icon {
                    margin-left: 5px;
                    cursor: pointer;
                }
            </style>
            <div class="layui-fluid" id="LAY-consolidatableOrder">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="consolidatableOrderForm" lay-filter="consolidatableOrderForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <label class="layui-form-label">订单时间</label>
                                            <div class="layui-input-block">
                                                <input name="times" id="consolidatableOrder_orderTime" class="layui-input" lay-verify="required"/>
                                            </div>
                                        </div>
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
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label labelSel">
                                                <select lay-filter="consolidatableOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                                    <option value="1">销售</option>
                                                    <option value="2">客服</option>
                                                </select>
                                            </label>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" id="consolidatableOrder_salePersonsSelect" xm-select="consolidatableOrder_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
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
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">买家指定物流</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="buyerRequireShippingType">
                                            </div>
                                        </div>
                                        <div class="layui-col-md8 layui-col-lg8" style="text-align:right;">
                                            <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="consolidatableOrderSearch" lay-filter="consolidatableOrderSearch">查询
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div class="fGrey">注：收件信息和发货仓库完全一致的订单才允许合并，具体规则请参考“合单规则”</div>
                                    <div>
                                        <%-- <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mergeAllOrders">合并所有订单</button> --%>
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mergeChoosedOrders">合并选择订单</button>
                                    </div>
                                </div>
                                <div class="layui-tab" lay-filter="" id="">
                                    <div class="">
                                    </div>
                                    <div class="layui-tab-content">
                                        <table lay-filter="consolidatableOrder_table" class="layui-table" id="consolidatableOrder_table"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 表格渲染模板 -->
            <script type="text/html" id="FBAdelivery_imageTpl">
                <div>
                    <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="toAuditorder_id_tpl">
                <div class="alignLeft">
                    <input type="hidden" class="toAuditOrder_col_id" value="{{d.id}}">
                    <div>{{d.id||""}}
                        <span class="gray">[{{d.storeAcct||""}}]</span>
                        {{# if(d.operOrderType ==2){ }}
                      <span class="layui-badge">合</span>
                      {{# } }}
                    </div>
                    <div>
                        <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    </div>
                </div>
            </script>
            
            <script type="text/html" id="toAuditorder_platOrderAmt_tpl">
                <div class="alignLeft">
                    <div><span>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                    <div><span class="gray">利润(RMB)</span><span>{{d.profit||""}}</span></div>
                    <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
                </div>
            </script>

            <script type="text/html" id="toAuditorder_prodQuantity_tpl">
            <div class="alignLeft">
                <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
                <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
                <div><span class="gray">计费重：</span><span>{{d.priceWeight}}g</span></div>
                </div>
            </script>

            <script type="text/html" id="toAuditorder_shippingUsername_tpl">
                <div class="alignLeft">
                    <div>{{d.shippingUsername||""}}</div>
                    <div>[{{d.shippingCountryCnName||""}}]</div>
                </div>
            </script>

            <script type="text/html" id="toAuditorder_logisTypeName_tpl">
                <div class="alignLeft">
                <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
                </div>
            </script>

            <script type="text/html" id="toAuditorder_time_tpl">
                <div class="alignLeft">
                <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                </div>
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
                                    <input type="radio" name="isIgnoreLogis" lay-filter="isIgnoreLogis" value="true" title="买家指定物流方式不同也合单">
                                </div>
                                <div>
                                    <input type="radio" name="isIgnoreLogis" lay-filter="isIgnoreLogis" value="false" title="买家指定物流方式不同<b style='color:red;font-size: 20px;'>不</b>合单">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </script>

            <!-- 表格渲染模板 -->
            <script src="${ctx}/static/js/order/consolidatableOrder.js"></script>