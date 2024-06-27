<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>取消订单</title>

            <div class="layui-fluid">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form action="" class="layui-form" id="smtCancelOrder_search_form">
                                    <div class="layui-form-item layui-row">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId" lay-filter="orgs_hp_smtCancelOrder"
                                                    class="orgs_hp_custom" lay-search>
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">客服</label>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" lay-filter="users_hp_smtCancelOrder"
                                                    lay-search class="users_hp_custom" data-rolelist="smt客服专员"
                                                    data-type="customservicer">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctIds" data-platcode="aliexpress" xm-select-search
                                                    id="smtCancelOrder_storeAcct" xm-select="smtCancelOrder_storeAcct"
                                                    xm-select-search-type="dl" xm-select-skin="normal"
                                                    lay-filter="smtCancelOrder_storeAcct_sel" class="store_hp_custom">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">店铺单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name='orderIds' class="layui-input"
                                                    placeholder="逗号分隔">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">订单支付时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" name='payTime' id="smtCancelOrder_search_payTime"
                                                    class="layui-input">
                                            </div>
                                        </div>
                                        <div id="smtPublish_searchTpl_special_linkage"></div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block">
                                                <span id="smtCancelOrder_search_submit" lay-submit
                                                    class="layui-btn layui-btn-sm"
                                                    lay-filter="smtCancelOrder_search_submitFilter">搜索</span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab" lay-filter="smtCancelOrder_tab">
                                    <div class="fixTab">
                                        <ul class="layui-tab-title">
                                            <li data-value="1" class="layui-this" id="smtCancelOrder_listNum_will">
                                                未处理(<span>0</span>)</li>
                                            <li data-value="2" id="smtCancelOrder_listNum_done">
                                                已处理(<span>0</span>)</li>
                                            <li data-value="null" id="smtCancelOrder_listNum_all">
                                                全部(<span>0</span>)</li>
                                        </ul>
                                        <div class="disFCenter formMid ml20">
                                            <div>
                                                <button class="layui-btn layui-btn-sm layui-btn-normal"
                                                    id="smtCancelOrder_batch_agree">批量同意</button>
                                                <button class="layui-btn layui-btn-sm layui-btn-danger"
                                                    id="smtCancelOrder_batch_refuse">批量拒绝</button>
                                            </div>
                                            <div>
                                                <button class="layui-btn layui-btn-sm layui-btn-normal"
                                                    id="smtCancelOrder_batch_copy">批量复制单号</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <!-- 速卖通模板 -->
                                        <table id="smtCancelOrder_table" lay-filter="smtCancelOrder_table"
                                            class="layui-table"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 操作栏 -->
            <script type="text/html" id="smtCancelOrder_table_toolbar">
                {{# if(d.handleStatus != 2){ }}
            <div>
                <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event='agree'>同意</button>
                <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="refuse">拒绝</button>
            </div>
            {{# } }}
            </script>

            <!-- 同意 -->
            <script type="text/html" id="smtCancelOrder_agree_linkage">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div>请再次确认{{d.isBatch ? '批量' : ''}}同意取消订单</div>
                    </div>
                </div>
            </script>
            <!-- 拒绝 -->
            <script type="text/html" id="smtCancelOrder_refuse_linkage">
                <div class="layui-card">
                    <div class="layui-card-body" style="padding-left: 0px;">
                        <form action="" class="layui-form" id="smtCancelOrder_refuse_form">
                           <label for="" class="layui-form-label w60"><font class="fRed">*拒绝理由</font></label>
                           <div class="layui-input-block" style="margin-left: 90px;">
                                <textarea name="refuseReason" required class="layui-textarea smtCancelOrder_refuse_form_refuseReason"></textarea>
                           </div>
                        </form>
                    </div>
                </div>
            </script>




            <script src="${ctx}/static/js/customer/aliexpress/cancelOrder.js"></script>