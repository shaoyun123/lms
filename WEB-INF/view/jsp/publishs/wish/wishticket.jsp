<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>wish ticket</title>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css">
<link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all">
<link rel="stylesheet" href="${ctx}/static/vue/css/wishticket.css">
<style>
</style>

<div class="layui-fluid" id="wishticket_app" v-cloak>
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" id="wishticketForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="wishticket_depart_sel"
                                        lay-search
                                        lay-filter="wishticket_depart_sel"
                                        class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="wishticket_salesman_sel"
                                        lay-search
                                        lay-filter="wishticket_salesman_sel"
                                        class="users_hp_custom"
                                        name="salesPersonId"
                                        data-rolelist="wish专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="wishticket_store_sel"
                                        lay-filter="wishticket_store_sel"
                                        xm-select="wishticket_store_sel"
                                        class="users_hp_store_multi"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        data-platcode="wish"
                                        name="storeAcctIds">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                     <input type="text" class="layui-input" autocomplete="off" name="timeValue" id="wishticket_times" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">内容</label>
                                <div class="layui-input-block">
                                     <input type="text" class="layui-input" autocomplete="off" name="message">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">订单号</label>
                                <div class="layui-input-block">
                                     <input type="text" class="layui-input" autocomplete="off" name="orderId">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">买家账号</label>
                                <div class="layui-input-block">
                                     <input type="text" class="layui-input" autocomplete="off" name="buyerName">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">订单类型</label>
                                <div class="layui-input-block">
                                    <select name="ticketType">
                                        <option value="">全部</option>
                                        <option value="PRE_PURCHASE">售前</option>
                                        <option value="ORDER">售后</option>
                                        <%-- <option value="POST_CUSTOMER_SUPPORT">客户支持</option> --%>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">问题类型</label>
                                <div class="layui-input-block">
                                    <select name="subLabels"
                                        xm-select="wishticket_subLabel"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                    >
                                        <option value="damaged item">物品破损</option>
                                        <option value="late or missing">丢货或发货太迟</option>
                                        <option value="item does not match listing">商详描述不符</option>
                                        <option value="item is poor quality">商品质量太差</option>
                                        <option value="other">其他原因</option>
                                        <option value="wrong item delivered">商品寄错了</option>
                                        <option value="item doesn't fit">尺寸不符合</option>
                                        <option value="ordered by mistake">下错订单</option>
                                        <option value="item did not arrive">商品未到货</option>
                                        <option value="item is counterfeit">假货</option>
                                        <option value="wrong size delivered">尺寸寄错了</option>
                                        <option value="0">未选择理由</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="state" v-model="stateVal">
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"
                                    lay-submit
                                    lay-filter="wishticket_filter" @click="wishticket_search">搜索</span>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="wishticketCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="wishticket_tabs"
                            id="wishticket_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this" data-index="1">未处理<span></span></li>
                                    <li  data-index="2">已回复<span></span></li>
                                    <li  data-index="0">已关闭<span></span></li>
                                    <li  data-index="">全部<span></span></li>
                                </ul>
                            </div>
                            <div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" @click="syncByStoreHandle">
                                    同步ticket
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body"  v-if="searchData.length>0">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <div class="wishticket_left">
                                <div class="wishticket_title">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" @click="allSelectedHandle">全选</span>
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" @click="batchSyncHandle">批量同步</span>
                                </div>
                                <ul class="wishticket_item">
                                    <li v-for="item in searchData" :key="item.ticketId" :class="{wishticket_active: isActive == item.ticketId}">
                                        <div>
                                            <p>
                                                <input type="checkbox" :value="item.ticketId" v-model="checkedTickets">
                                            </p>
                                            <div @click="showTicketDetail(item.ticketId)" class="wishticket_item_title">
                                                <p>
                                                    <span>{{item.buyerName}}</span>
                                                    <span>{{Format(item.updatedAt, 'yyyy-MM-dd')}}</span>
                                                </p>
                                                <p>
                                                    <span style="font-size:10px;color:#ccc;">({{item.storeAcct}})</span>
                                                </p>
                                                <p>
                                                    {{item.message}}
                                                </p>
                                            </div>
                                        </div>
                                        <span v-show="item.state== 'AWAITING_MERCHANT' && item.overtime" class="wishticket_timeout">超时未处理</span>
                                    </li>
                                </ul>
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div class="wishticket_dialogBox">
                                <div class="wishticket_dialogBox_header" style="text-align:right;">
                                   <span class="layui-btn layui-btn-sm layui-btn-normal" @click="officialSupHandle">
                                        官方支持
                                   </span>
                                   <span class="layui-btn layui-btn-sm layui-btn-normal" @click="closeHandle">
                                        关闭
                                   </span>
                                </div>
                                <div class="wishticket_dialogBox_content">
                                    <div v-for="reply in replies" :key="reply.id" class="wishticket_message" v-show="reply.message.length>0">
                                        <div v-html="markedHandle(reply.message|| '')"></div>
                                        <span style="color:#656565;">翻译:</span>
                                        <div v-html="markedHandle(reply.transMessage || '')"></div>
                                        <div v-show="reply.supFiles.length>0">
                                            <img v-for="supFile in reply.supFiles" :key="supFile.id" :src="supFile.url" :alt="supFile.fileName" width="150" height="150">
                                        </div>
                                    </div>
                                </div>
                                <div class="wishticket_dialogBox_tool">
                                    <el-select :value="wishTemplateSelect" placeholder="请选择" size="small">
                                        <el-option
                                        v-for="item in wishTemplateData"
                                        :key="item.id"
                                        :label="item.templateName"
                                        :value="item.emailContent"
                                        @click.native="wishTemplateChange(item.emailContent)">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="wishticket_dialogBox_response" contentEditable="true" ref="dialogBox-response" @blur="responseHandle" @keyup="responseHandle">
                                </div>
                            </div>
                            <div style="text-align:right;margin-top:10px;">
                            <span>{{contentLength}}/2000</span>
                                <el-button type="primary" size="small" @click="sendMsgHandle">发送</el-button>
                            </div>
                        </el-col>
                        <el-col :span="6">
                        <%-- 先判断类型是不是订单,是,走订单的渲染,不是,走产品的渲染 --%>
                            <div class="wishticket_right">
                                <el-tabs type="border-card" v-if="type=='ORDER'">
                                    <el-tab-pane v-for="(item, index) in orders" :label="'订单' +(index+1)" :key="item.ticketId">
                                        <%-- 订单ID是否存在 --%>
                                        <div v-show="item.orderId">
                                            <p>
                                                <!-- <span>{{window.location.host.includes('mx')?'普源单号:':'OA订单号:'}}</span> -->
                                                <span>OA订单号</span>
                                                <span class="pora copySpan">
                                                    <a>{{item.orderId}}</a>
                                                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
                                                </span>
                                                <span>({{item.allrootOrderStatus}}, {{item.orderTotal}})</span>
                                            </p>
                                            <p>
                                                <span>订单时间:</span>
                                                <span>{{item.orderTime}}</span>
                                            </p>
                                            <p>
                                                <span>收件人:</span>
                                                <span>{{item.adName}}</span>
                                            </p>
<%--                                            <p>--%>
<%--                                                <span>收件地址:</span>--%>
<%--                                                <span>{{item.address}}</span>--%>
<%--                                            </p>--%>
                                            <p>
                                                <span>物流单号:</span>
                                                <span>{{item.trackingNumber}}</span>
                                            </p>
                                            <p>
                                                <span>物流状态:</span>
                                                <span>{{item.allrootShippingStatus}}</span>
                                            </p>
                                            <p>
                                                <span>发货时间:</span>
                                                <span>{{item.shippedDate}}</span>
                                            </p>
                                            <hr>
                                            <div>
                                                <div style="display:flex;">
                                                    <div style="padding:10px;">
                                                        <img width="60" height="60" v-if="item.mainImage" :src="item.mainImage" class="img_show_hide b1" />
                                                        <img width="60" height="60" v-else src="${ctx}/static/img/kong.png" class="img_show_hide b1" />
                                                    </div>
                                                    <div>
                                                        <p>
                                                            <span style="color:#000;">产品名称:</span>
                                                            <span>{{item.enTitle}}</span>
                                                        </p>
                                                        <p>
                                                            <span style="color:#000;">SKU:</span>
                                                            <span>{{item.sku}}</span>
                                                        </p>
                                                        <p>
                                                            <span style="color:#000;">规格:</span>
                                                            <span v-show="item.color">{{item.color}}</span>
                                                            <span v-show="item.color && item.size">,</span>
                                                            <span v-show="item.size">{{item.size}}</span>
                                                        </p>
                                                        <p>
                                                            <span v-show="item.price">{{item.price}}</span>
                                                            <span v-show="item.price && item.quantity">x</span>
                                                            <span v-show="item.quantity">{{item.quantity}}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                            <p>
                                                <!-- <span v-if="window.location.host.includes('mx')" class="layui-btn layui-btn-sm layui-btn-normal" @click="logsHandle(item.orderId)">
                                                    日志
                                                </span> -->
                                                <span class="layui-btn layui-btn-sm layui-btn-normal" @click="refundHandle(item.orderId)">
                                                    退款
                                                </span>
                                            </p>


                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                                <%-- type=PRE_PURCHASE(售前) --%>
                                <div v-else>
                                    <div v-if="prods.length>0" style="text-align:center;">
                                        <div style="padding:10px;">
                                            <img width="150" height="150" v-if="prods[0].mainImage" :src="prods[0].mainImage" class="img_show_hide b1" @click="imgJump(prods[0].productId)"  style="cursor:pointer;" />
                                            <img width="150" height="150" v-else src="${ctx}/static/img/kong.png" class="img_show_hide b1" />
                                        </div>
                                        <p>
                                            <span>产品名称:</span>
                                            <span>{{prods[0].enTitle}}</span>
                                        </p>
                                        <p>
                                            <span>SKU:</span>
                                            <span>{{prods[0].sku}}</span>
                                        </p>
                                    </div>
                                    <div v-else  style="text-align:center;">
                                        暂无产品信息
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
    <!-- 日志弹框 -->
    <el-dialog title="日志" :visible.sync="dialogTableVisible" @close="handleClose" :modal-append-to-body="false">
        <el-table :data="logsData">
            <el-table-column property="opDate" label="操作日期" width="100"></el-table-column>
            <el-table-column property="operator" label="操作人"></el-table-column>
            <el-table-column property="logs" label="操作结果"></el-table-column>
        </el-table>
    </el-dialog>

    <%-- 退款弹框 --%>
    <el-dialog title="退款" :visible.sync="dialogRefundVisible" @close="handleClose" :modal-append-to-body="false">
        <el-select v-model="refundSelect" placeholder="请选择" size="small">
            <el-option
            v-for="item in refundData"
            :key="item.value"
            :label="item.name"
            :value="item.value">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRefundVisible = false" size="small">关闭</el-button>
            <el-button type="primary" @click="refundConfirmFn" size="small">确认</el-button>
        </span>
    </el-dialog>
</div>



<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
<script src="${ctx}/static/js/publishs/wish/marked.min.js"></script>
<script src="${ctx}/static/js/publishs/wish/wishticket.js"></script>
