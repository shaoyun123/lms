<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>物流异常</title>
            <style>
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                .ma {
                    margin: 0 auto;
                }
                
                .skyblue {
                    color: skyblue;
                }
                
                .mt {
                    margin-top: 10px;
                }
                
                .ml {
                    margin-left: 10px;
                }
                
                .fr {
                    float: right;
                }
                
                .mr10 {
                    margin-right: 10px;
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
                
                .lh_42 {
                    line-height: 42px;
                }
                
                .lh_36 {
                    line-height: 36px;
                }
                
                .w_100 {
                    width: 100px;
                }
                
                .hide {
                    display: none;
                }
                
                .select_label {
                    padding: 0px!important;
                }
                
                .gray {
                    color: gray;
                }
                
                .text_l {
                    text-align: left;
                }           
                
                .externalContainabnorlmalorder {
                    position: relative;
                    width: 0;
                    float: left;
                    height: 0;
                    z-index: 20190918;
                }
                
                .externalPopAuditorder {
                    clear: left;
                    position: relative;
                    left: -35.667vw;
                    top: 40px;
                    width: 35vw;
                    border: 1px solid #e6e6e6;
                    background-color: lightyellow;
                    padding: 20px 0;
                    border-radius: 5px;
                    box-shadow: 1px 1px 1px grey;
                }
                
                .externalBox {
                    width: 85%;
                    line-height: 32px;
                    text-align: center;
                    border: 1px solid #e6e6e6;
                    margin-left: 15%;
                    cursor: pointer;
                }
                
                .externalBox:hover {
                    border: 1px solid grey;
                }
                
                .showExternal {
                    border: 1px solid #1E9FFF!important;
                }
                
                .refresh_icon {
                    margin-left: 5px;
                    cursor: pointer;
                }
                #LAY-logisticsAnomaly .layui-btn+.layui-btn{
                    margin-left: 0!important;
                }

                .dis_flex_start {
                    display: flex;
                    justify-content: flex-end;
                    flex-direction: column;
                }

                .mtb {
                    margin: 5px 0;
                }

                .pageSortfix{
                    background:#fff;
                    width: 100%;
                    position: fixed;
                    bottom: 0;
                    left:100px;
                }
                .hide{
                    display: none!important;
                }
                .logisticsAnomaly_store_style .xm-select-dl{
                    width:-webkit-fill-available !important;
                }
            </style>
            <div class="layui-fluid" id="LAY-logisticsAnomaly">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="logisticsAnomalyForm" lay-filter="logisticsAnomalyForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                          <label class="layui-form-label labelSel">
                                            <select name="orderTimeType">
                                              <option value="createTimeCn">创建时间</option>
                                              <option value="orderTimeCn">订单时间</option>
                                              <option value="shippingTime">发货时间</option>
                                            </select>
                                          </label>
                                          <div class="layui-input-block">
                                              <input type="text" class="layui-input" id="logisticsAnomaly_time" name="time" lay-verify="required" readonly>
                                          </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="logisticsAnomaly_orgs">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label labelSel">
                                                <select lay-filter="logisticsAnomaly_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                                    <option value="1">销售</option>
                                                    <option value="2">客服</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" class="users_hp_custom" lay-filter="logisticsAnomaly_salePersonsSelect" id="logisticsAnomaly_salePersonsSelect" xm-select="logisticsAnomaly_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 logisticsAnomaly_store_style">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctIds"
                                                class="users_hp_store_multi"
                                                id="logisticsAnomaly_store"
                                                xm-select="logisticsAnomalyStoreAcctIds" 
                                                xm-select-search 
                                                xm-select-search-type="dl" 
                                                xm-select-skin="normal" 
                                                lay-filter="logisticsAnomalyStoreAcctIds">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                          <label class="layui-form-label">国家/地区</label>
                                          <div class="layui-input-block">
                                              <select name="shippingCountryCodes" xm-select="shippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                              </select>
                                          </div>
                                        </div>
                                      
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">订单编号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderIds" class="layui-input" placeholder="多个编号使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">店铺单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                          <label class="layui-form-label">跟踪号</label>
                                          <div class="layui-input-block">
                                              <input type="text" name="logisTrackingNos" class="layui-input" placeholder="">
                                          </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                          <div class="layui-form-label labelSel">
                                              <select name="agentCompany" lay-filter="logisticsAnomalycompanyType">
                                                  <option value="logisticsModes">物流方式集</option>
                                                  <option value="companys">物流公司</option>
                                                  <option value="agents">货代公司</option>
                                              </select>
                                          </div>
                                          <div class="layui-input-block">
                                              <select name="logisticsCompanyId" lay-filter="logisticsAnomalycompany" lay-search></select>
                                          </div>
                                      </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">物流方式</label>
                                            <div class="layui-input-block">
                                              <select name="logisTypeIds" id="logisTypeIds_xm_select_logisticsAnomaly" xm-select="logisTypeIds_xm_select_logisticsAnomaly" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                              </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">处理人</label>
                                            <div class="layui-input-block">
                                              <select name="processUserIds"
                                                id="logisticsAnomaly_processUserId"
                                                lay-filter="logisticsAnomaly_processUserId" 
                                                id="logisticsAnomaly_processUserId"
                                                xm-select="logisticsAnomaly_processUserId"
                                                xm-select-search xm-select-search-type="dl"
                                                xm-select-skin="normal">
                                              </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                         <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">物流状态</label>
                                            <div class="layui-input-block">
                                              <select name="orderStatusName" 
                                              id="logisticsAnomaly_orderStatusName"
                                              lay-filter="logisticsAnomaly_orderStatusName" 
                                              id="logisticsAnomaly_orderStatusName"
                                              xm-select="logisticsAnomaly_orderStatusName"
                                              xm-select-search 
                                              xm-select-search-type="dl"
                                              xm-select-skin="normal">
                                              </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                          <label class="layui-form-label">排序方式</label>
                                          <div class="layui-input-block">
                                              <select name="sortType"  lay-search>
                                                <option value="">请选择</option>
                                                  <option value="createTimeAsc">创建时间正序</option>
                                                  <option value="createTimeDesc">创建时间倒序</option>
                                                  <option value="orderTimeAsc">订单时间正序</option>
                                                  <option value="orderTimeDesc">订单时间倒序</option>
                                                  <option value="deliveryTimeAsc">发货时间正序</option>
                                                  <option value="deliveryTimeDesc">发货时间倒序</option>
                                                  <option value="orderAmountAsc">订单金额正序</option>
                                                  <option value="orderAmountDesc">订单金额倒序</option>
                                                  <option value="orderProfitAsc">订单利润正序</option>
                                                  <option value="orderProfitDesc">订单利润倒序</option>
                                              </select>
                                          </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                          <div class="layui-form-label" style="padding: 0 15px">
                                              <select name="searchType" lay-search>
                                                  <option value="sSku">商品SKU</option>
                                                  <option value="pSku">店铺SKU</option>
                                              </select>
                                          </div>
                                          <div class="layui-input-block" style="display: flex;">
                                              <input name="searchValue" style="width:70%" type="text" class="layui-input">
                                              <input name="switchSearchValue" type="checkbox" lay-skin="switch" lay-text="精确|模糊">
                                          </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">是否组包</label>
                                            <div class="layui-input-block">
                                                <select name="hasHandover">
                                                    <option value=""></option>
                                                    <option value="true">是</option>
                                                    <option value="false">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-input-block" style="display: flex;justify-content: flex-end; margin-top: 10px">
                                              <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-submit="" id="logisticsAnomalySearch" lay-filter="logisticsAnomalySearch" style="margin-right: 10px;">查询</button>
                                              <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" lay-submit="" id="logisticsAnomalyReset" lay-filter="logisticsAnomalySReset">清空</button>

                                          </div>
                                        </div>
                                        <input class="hide" type="text" name="limit" value="5000">
                                        <input class="hide" type="text" name="page" value="1">
                                        <input class="hide" type="text" name="processStatus" value="0">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card" id="logisticsAnomalyCard">
                            <div class="layui-card-body">
                              <div class="layui-tab" lay-filter="logisticsAnomaly_Tab" id="logisticsAnomaly_Tab">
                                <div class="disFCenter">
                                  <div style="height:42px;">
                                    <ul class="layui-tab-title" style="width: 80%;">
                                    </ul>
                                  </div>
                                  <div>
                                    <button type="button" id="logisticsAnomaly_editRemarkBtn" class="layui-btn layui-btn-normal layui-btn-sm">编辑备注</button>
                                    <button type="button" id="logisticsAnomaly_handle" class="layui-btn layui-btn-normal layui-btn-sm hidden">处理</button>
                                    <button type="button" id="logisticsAnomaly_export" class="layui-btn layui-btn-normal layui-btn-sm hidden">导出</button>
                                  </div>
                                </div>
                                  <div class="layui-tab-content">
                                      <%--<table lay-filter="logisticsAnomaly_table" class="layui-table" id="logisticsAnomaly_table"></table>--%>
                                      <%--<div id="logisticsAnomalyPage" class="pageSortfix"></div>--%>
                                          <div id="logisticsAnomaly_table" style="width: 100%;height: 580px;" class="ag-theme-balham"></div>
                                          <div class="pageSortfix" id="logisticsAnomalyPage"></div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_logisticsAnomaly_detail">
                <div class="mg_50">
                    <table class="layui-table" id="logisticsAnomaly_detail_table" lay-filter="logisticsAnomaly_detail_table"></table>
                </div>
            </script>

            <script type="text/html" id="logisticsAnomaly_appointWarehouseTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="logisticsAnomaly_appointWarehouseTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">仓库类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓">
                                <input type="radio" name="warehouseType" value="WINIT" title="万邑通仓">
                            </div>
                        </div>
                    </div>
                </form>
            </script>

            <script type="text/html" id="logisticsAnomaly_editRemark">
              <form class="layui-form p20">
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                    </div>
                </div>
              </form>
            </script>


<!-- 表格渲染模板 -->
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>


<script src="${ctx}/static/js/smtissueinfo/logisticsanomaly.js"></script>