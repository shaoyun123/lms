<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>ebay促销1.0</title>
            <style>
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                .mt {
                    margin-top: 10px;
                }
                
                .ml {
                    margin-left: 10px;
                }
                
                .m20 {
                    margin: 20px;
                }
                
                .hidden {
                    display: none;
                }
                
                .dis_flex {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .lh_42 {
                    line-height: 42px;
                }
                
                .w_100 {
                    width: 100px;
                }
                
                .hide {
                    display: none;
                }
            </style>
            <div class="layui-fluid" id="LAY-ebaypromotion">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="ebaypromotionForm" lay-filter="ebaypromotionForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId" id="orgTree" lay-filter="orgTree" class="orgs_hp_custom"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">销售员</label>
                                            <div class="layui-input-block">
                                                <select name="salesmanId" id="userList" lay-filter="userList" data-rolelist="ebay专员" class="users_hp_custom">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctId" id="storeAcct" class="store_hp_custom" data-platcode="ebay" lay-filter="ep2_sellerFilter" lay-search>
                                                <option value="">全部</option>  
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1">
                                            <div class="layui-input-block">
                                                <button type="button" id="asyncStore" class="layui-btn layui-btn-normal layui-btn-sm">同步</button>
                                            </div>
                                        </div>
                                        <!-- <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">站点</label>
                                            <div class="layui-input-block">
                                                <select name="site" id="ebaySite" xm-select="ebaySite" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                </select>
                                            </div>
                                        </div> -->
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">促销状态</label>
                                            <div class="layui-input-block">
                                                <select name="pormotionStatus" id="promotionStatus">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label label_select">开始时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="startTime" id="ebaypromotionStartTime" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label label_select">结束时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="endTime" id="ebaypromotionEndTime" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">促销名称</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="promotionSaleName">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-sm " lay-submit="" lay-filter="ebayPromotionSearch">查询</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div><button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="new_promotion">新增</button></div>
                                <table class="layui-table" id="ebaypromotionTable" lay-filter="ebaypromotionTable"></table>
                                <div id="pageSort"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 新增促销弹框 -->
            <script type="text/html" id="pop_ebay_promotion">
                <form class="layui-form mg_50" id="layerForm" lay-filter="layerForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">促销名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="promotionSaleName" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeAcctId" id="layer_store" required lay-verify="required"></select>
                        </div>
                    </div>
                    <!-- <div class="layui-form-item">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-block">
                            <select name="" id=""></select>
                        </div>
                    </div> -->
                    <div class="layui-form-item">
                        <label class="layui-form-label">开始时间</label>
                        <div class="layui-input-block">
                            <input type="text" id="layer_startTime" name="promotionStartTime" required lay-verify="required" class="layui-input" readonly>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">结束时间</label>
                        <div class="layui-input-block">
                            <input type="text" id="layer_endTime" name="promotionEndTime" required lay-verify="required" class="layui-input" readonly>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">促销类型</label>
                        <div class="layui-input-block">
                            <input type="radio" name="promotionSaleType" lay-filter="promotionSaleType" title="价格优惠" value="PriceDiscountOnly" checked>
                            <input type="radio" name="promotionSaleType" lay-filter="promotionSaleType" title="免第一运费" value="FreeShippingOnly">
                            <input type="radio" name="promotionSaleType" lay-filter="promotionSaleType" title="价格优惠且免第一运费" value="PriceDiscountAndFreeShipping">
                        </div>
                    </div>
                    <div class="layui-form-item promotionSaleTypeRow">
                        <label class="layui-form-label">优惠明细</label>
                        <div class="layui-input-block">
                            <div class="dis_flex radiorow">
                                <input type="radio" name="discountType" checked lay-filter="discountType" title="在原价上优惠" value="Percentage">
                                <input type="text" name="discountValue1" required lay-verify="ifChecked" autocomplete="off" class="layui-input w_100">
                                <span class="ml w_100" style="line-height:32px">%</span>
                            </div>
                            <div class="dis_flex radiorow mt">
                                <input type="radio" name="discountType" lay-filter="discountType" title="在原价上降价" value="Price">
                                <input type="text" required name="discountValue2" lay-verify="ifChecked" autocomplete="off" class="layui-input w_100">
                            </div>
                        </div>
                    </div>
                    <!-- 用于触发表单提交验证表单，同时存储所选促销类型 -->
                    <input type="text" class="hide" lay-submit="" value="PriceDiscountOnly" lay-filter="layersubmitform" id="layersubmitform">
                </form>
            </script>
            <!-- 新增促销弹框 -->

            <!-- 表格渲染模板 -->
            <!-- 表格渲染模板 -->
            <script src="/lms/static/js/publishs/ebay/ebaypromotion.js"></script>