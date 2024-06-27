<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>线下采购订单</title>
<style>
    /*select2样式*/
    .label_reset {
        padding: 0 10px !important;
    }
    .w_40 {
        width: 40% !important;
    }
    .flex_between {
        display: flex;
        justify-content: space-between;
    }
    .pl_10 {
        padding-left: 10px !important;
    }
    #LAY-purchaseOrderOff .layui-form-label {
        width: 85px !important;
    }
    #LAY-purchaseOrderOff .layui-input-block {
        margin-left: 120px !important;
    }
    .fr {
        float: right;
    }
    .m_20 {
        margin: 20px !important;
    }
</style>
<div class="layui-fluid" id="LAY-purchaseOrderOff">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body" style="z-index: 10002">
                    <form class="layui-form layui-clear keyEnterToSearchForm" lay-filter="purchaseOrderOff_searchForm" id="purchaseOrderOff_searchForm" autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label label_reset">
                                    <select name="timeType" class="hiddenContent">
                                        <option value="1">制单时间</option>
                                        <option value="2">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="timeRange" id="timeRange_purchaseOrderOff" type="text" class="layui-input hiddenContent" readonly />
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerIdListStr" xm-select="buyer_purchaseOrderOff" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='buyer_purchaseOrderOff' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${buyers}" var="buyer">
                                            <option value="${buyer.id}">${buyer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" xm-select="bizzOwner_purchaseOrderOff" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='bizzOwner_purchaseOrderOff' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="searchSupplier_purchaseOrderOff"  name="supplierName" class="layui-input" />
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">标签</label>
                                <div class="layui-input-block">
                                    <select name="note" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${purInsideTagList}" var="tag">
                                            <option value="${tag.code}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购仓库</label>
                                <div class="layui-input-block">
                                    <select name="storeId">
                                        <option value=""></option>
                                        <c:forEach items="${wareHouseList}" var="store">
                                            <option value="${store.id}">${store.warehouseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单状态</label>
                                <div class="layui-input-block">
                                    <select name="ali1688OrderStatus" id="statue_1688">
                                        <option></option>
                                        <c:forEach items="${ali1688StatusEnums}" var="ali1688StatusEnum">
                                            <%--<c:if test="ali1688StatusEnum.pmsName != ''">--%>
                                                <option value="${ali1688StatusEnum.type}">${ali1688StatusEnum.pmsName}</option>
                                            <%--</c:if>--%>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购金额</label>
                                <div class="layui-input-block flex_between">
                                    <input name="totalProdMoneyMin" type="text" class="layui-input w_40" onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('只能输入数字，小数点后只能保留两位');this.value='';}" />
                                    <input name="totalProdMoneyMax" type="text" class="layui-input w_40" onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('只能输入数字，小数点后只能保留两位');this.value='';}" />
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label label_reset">
                                    <select name="searchType" class="hiddenContent">
                                        <option value="1">子SKU</option>
                                        <option value="2">父SKU</option>
                                        <option value="3">子SKU(精确)</option>
                                        <option value="4">父SKU(精确)</option>
                                        <option value="5">采购备注</option>
                                        <option value="6">商品名称</option>
                                        <option value="7">制单人</option>
                                        <option value="8">审核人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" maxlength="2000" type="text" class="layui-input" placeholder="sku支持多个精确查询,英文逗号分隔" />
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label label_reset">
                                    <select name="searchOrderNoType" class="hiddenContent">
                                        <option value="1">采购单号</option>
                                        <option value="2">pms单号</option>
                                        <option value="3">快递单号</option>
                                        <option value="4">快递单号(尾数模糊)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchOrderNo" type="text" class="layui-input" placeholder="单号支持多个精确查询,英文逗号分隔" />
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="status" class="hiddenContent">
                                        <option value="">同步普源状态</option>
                                        <option value="true">成功</option>
                                        <option value="false">失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="orderBy" class="hiddenContent">
                                        <option value="t1.id desc">创建时间倒序</option>
                                        <option value="t1.id asc">创建时间正序</option>
                                        <option value="t1.pay_able_time desc">可付时间倒序</option>
                                        <option value="t1.pay_able_time asc">可付时间正序</option>
                                        <option value="t1.audit_time desc">审核时间倒序</option>
                                        <option value="t1.audit_time asc">审核时间正序</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">快递方式</label>
                                <div class="layui-input-block">
                                    <select name="logisticNameListStr" xm-select="logisticName_purchaseOrderOff" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='logisticName_purchaseOrderOff' lay-search>
                                        <option></option>
                                        <c:forEach items="${logisticNameList}" var="logisticName">
                                            <option value="${logisticName.code}">${logisticName.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 pl_10 fr">
                                <button id="searchBtn_purchaseOrderOff" class="layui-btn layui-btn-sm keyHandle" type="button">查询</button>
                                <div id="reset_purchaseOrderOff" class="layui-btn layui-btn-primary layui-btn-sm">清空</div>
                            </div>
                        </div>
                        <input name="auditStatus" type="hidden" value="0" class="hiddenContent">
                        <input name="ifPullInvalid" type="hidden" value="" class="hiddenContent">
                    </form>
                    <form id="stockInStatusForm_purchaseOrderOff">
                        <input type="checkbox" hidden name="stockInStatus" value="1">
                        <input type="checkbox" hidden name="stockInStatus" value="2">
                        <input type="checkbox" hidden name="stockInStatus" value="3">
                    </form>
                </div>
            </div>
            <div class="layui-card" id="purchaseOrderOffCard">
                <%--<div class="layui-card-header" style="z-index: 10000;height: auto;">--%>
                <div class="layui-card-header" style="z-index: 10000;height: auto;">
                    <div style="float:left;">
                        <ul class="layui-tab-title fl">
                            <li class="layui-this numCount_purchaseOrderOff" data-auditstatus="-1">新建(<span id="InitNum_purchaseOrderOff"></span>)</li>
                            <li class="layui-this numCount_purchaseOrderOff" data-auditstatus="0">未接单(<span id="noAuditNum_purchaseOrderOff"></span>)</li>
                            <li class="numCount_purchaseOrderOff" data-auditstatus="1">已接单(<span id="hasAuditNum_purchaseOrderOff"></span>)</li>
                            <li class="numCount_purchaseOrderOff" data-auditstatus="3">废弃(<span id="deleteNum_purchaseOrderOff"></span>)</li>
                            <li class="numCount_purchaseOrderOff" data-ifpullinvalid="1">归档订单(<span id="pullInvalidNum_purchaseOrderOff"></span>)</li>
                        </ul>
                        <permTag:perm funcCode="exportPurOrder_purchaseOrderOff">
                            <button type="button" class="layui-btn layui-btn-sm ml10" id="exportPurOrderBtn_purchaseOrderOff">导出采购订单</button>
                        </permTag:perm>
                        <permTag:perm funcCode="exportPurOrderDetail_purchaseOrderOff">
                            <button type="button" class="layui-btn layui-btn-sm ml10" id="exportPurOrderDetailBtn_purchaseOrderOff">导出订单明细</button>
                        </permTag:perm>
                        <%--<permTag:perm funcCode="addPurOrderByExcel">--%>
                            <%--<button type="button" class="layui-btn layui-btn-sm layui-btn-danger ml10" id="addPurOrderByExcelBtn">导入新增采购单</button>--%>
                            <%--<input type="file" hidden id="fileForAddByExcel_purchaseOrderOff">--%>
                            <%--<button type="button" class="layui-btn layui-btn-sm ml10" id="downTemplate_addByExcel_purchaseOrderOff">下载模板</button>--%>
                        <%--</permTag:perm>--%>
                    </div>

                    <span style="float:right;">
                        <permTag:perm funcCode="createPurOrderBtn_purchaseOrderOff">
                            <button type="button" class="layui-btn layui-btn-sm" id="createPurOrderBtn_purchaseOrderOff">新增采购订单</button>
                        </permTag:perm>
                        <permTag:perm funcCode="syncToPms_purchaseOrderOff">
                            <button type="button" class="layui-btn layui-btn-sm" id="syncToPms_purchaseOrderOff">同步给PMS</button>
                        </permTag:perm>
                        <permTag:perm funcCode="disable_purchaseOrderOff">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="disablePurOrderBtn_purchaseOrderOff">作废</button>
                        </permTag:perm>
                     </span>
                    <div style="clear: both"></div>
                </div>
                <div class="layui-card-body">
                    <div class="checkbox-group toFixedContain">
                        <div class="layui-form stockInStatusCheckBox disN">
                            <input type="checkbox" name="stockInStatus" value="1" title="未完全入库(<font id=NotAllInNum_purchaseOrderOff></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrderOff">
                            <input type="checkbox" name="stockInStatus" value="2" title="完全入库未审核(<font id=NotAuditStockInNum_purchaseOrderOff></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrderOff">
                            <input type="checkbox" name="stockInStatus" value="3" title="入库已审核(<font id=AuditStockInNum_purchaseOrderOff></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrderOff">
                        </div>
                    </div>
                    <table class="layui-table" id="purchaseOrderOff_table" lay-filter="purchaseOrderOff_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 采购订单弹框 -->
<script type="text/html" id="purOrderDetailOff_pop">
    <div>
        <div class="layui-col-lg12 layui-col-md12 layui-tab-card mb10">
            <div class="layui-tab layui-card">
                <ul class="layui-tab-title isCreateHidden">
                    <li class="layui-this">详情</li>
                    <li id="purOrderLogLab" class="disN">操作日志</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">
                        <form class="layui-form layui-clear" lay-filter="purOrderMainInfoForm_purchaseOrderOff" id="purOrderMainInfoForm_purchaseOrderOff" autocomplete="off">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">单号</label>
                                    <div class="layui-input-block">
                                        <input name="billNumber" type="text" class="layui-input" disabled placeholder="自动生成" />
                                        <input disabled class="layui-input disN gredBack" data-name="billNumber">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">制单时间</label>
                                    <div class="layui-input-block">
                                        <input name="createTime" type="text" class="layui-input" disabled placeholder="自动生成" />
                                        <input disabled class="layui-input disN gredBack" data-name="createTime">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" notNull>
                                    <label class="layui-form-label">采购仓库</label>
                                    <div class="layui-input-block">
                                        <select name="storeId" lay-search="">
                                            <option value=""></option>
                                            <c:forEach items="${wareHouseList}" var="store">
                                                <option value="${store.id}">${store.warehouseName}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="storeId">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" notNull>
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="purOrgId" lay-search="">
                                            <option value=""></option>
                                            <c:forEach items="${firstOrgList}" var="org">
                                                <option value="${org.id}">${org.name}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="purOrgId">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" notNull>
                                    <label class="layui-form-label">采购专员</label>
                                    <div class="layui-input-block">
                                        <select name="buyerId" lay-search="" lay-filter="buyerId_purOrderDetail">
                                            <option ></option>
                                            <c:forEach items="${buyers}" var="buyer">
                                                <option value="${buyer.id}">${buyer.userName}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="buyer">
                                    </div>
                                </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">摊付方式</label>
                                    <div class="layui-input-block">
                                        <select name="avgType" lay-search="">
                                            <option value="1">金额</option>
                                            <option value="2">重量</option>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="avgType">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2" notNull>
                                    <label class="layui-form-label">供应商</label>
                                    <div class="layui-input-block dimSearchContent">
                                        <input type="hidden" name="supplierId">
                                        <div>
                                            <input id="searchSupplier_purchaseOrderOffDetailForm" class="layui-input" placeholder="可添加的sku自动检索第一供应商" />
                                        </div>
                                        <div class="dimResultDiv"></div>
                                        <input disabled class="layui-input disN gredBack" data-name="supplierName">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" notNull>
                                    <label class="layui-form-label">付款方式</label>
                                    <div class="layui-input-block">
                                        <select name="payType">
                                            <option value=""></option>
                                            <c:forEach items="${payTypeList}" var="payType">
                                                <option value="${payType.code}">${payType.name}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="payType">
                                    </div>
                                </div>
                                <%--<div class="layui-col-md2 layui-col-lg2">--%>
                                    <%--<label class="layui-form-label">付款账号</label>--%>
                                    <%--<div class="layui-input-block">--%>
                                        <%--<select name="purAcctId" lay-search lay-filter="pur1688AcctId_purOrderDetail">--%>
                                            <%--<option value=""></option>--%>
                                            <%--<c:forEach items="${purAcctList}" var="purAcct">--%>
                                                <%--<option value="${purAcct.id}">${purAcct.acct}</option>--%>
                                            <%--</c:forEach>--%>
                                        <%--</select>--%>
                                        <%--<input disabled class="layui-input disN gredBack" data-name="purAcctId">--%>
                                    <%--</div>--%>
                                <%--</div>--%>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">收件人</label>
                                    <div class="layui-input-block">
                                        <select name="receiverId" lay-search lay-filter="receiverId_purOrderDetail">
                                            <option></option>
                                            <c:forEach items="${receiverList}" var="receiver">
                                                <option value="${receiver.id}" data-buyerId="${receiver.buyerId}">${receiver.receiver}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="receiverId">
                                    </div>
                                </div>
                                <div id="purReceiverOptionDiv" class="disN">
                                    <c:forEach items="${receiverList}" var="receiver">
                                        <option value="${receiver.id}" data-buyerId="${receiver.buyerId}">${receiver.receiver}</option>
                                    </c:forEach>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">收货地址</label>
                                    <div class="layui-input-block">
                                        <select name="purReceiveAddressId" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${addressList}" var="address">
                                                <option value="${address.id}" >${address.province} ${address.city} ${address.district} ${address.street} ${address.detail}</option>
                                            </c:forEach>
                                            <%--${address.city}${address.distict}${address.street}${address.detail}--%>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="purReceiveAddressId">
                                    </div>
                                </div>
                                <%--<div id="purReceiveAddressOptionDiv" class="disN">--%>
                                    <%--<c:forEach items="${pur1688ReceiveAddressList}" var="address">--%>
                                        <%--<option value="${address.addressId}" data-acctId="${address.acctId}">${address.fullName}收,${address.address}</option>--%>
                                    <%--</c:forEach>--%>
                                <%--</div>--%>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">预计到货日期</label>
                                    <div class="layui-input-block">
                                        <input name="delivDay" type="text" class="layui-input" readonly/>
                                        <input disabled class="layui-input disN gredBack" data-name="delivDay">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">快递方式</label>
                                    <div class="layui-input-block">
                                        <%--<input name="logisticName" type="text" class="layui-input"/>--%>
                                        <select name="logisticName" lay-search>
                                            <option></option>
                                            <c:forEach items="${logisticNameList}" var="logisticName">
                                                <option value="${logisticName.code}">${logisticName.name}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="logisticName">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">快递单号</label>
                                    <div class="layui-input-block">
                                        <input name="logisticOrderNo" type="text" class="layui-input" />
                                        <input disabled class="layui-input disN gredBack" data-name="logisticOrderNo">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">快递费(￥)</label>
                                    <div class="layui-input-block">
                                        <input name="logisticFee" type="text" class="layui-input" />
                                        <input disabled class="layui-input disN gredBack" data-name="logisticFee">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">预付款(￥)</label>
                                    <div class="layui-input-block">
                                        <input name="prevPayMoney" type="text" class="layui-input" placeholder="货物金额+快递费" readonly/>
                                        <input disabled class="layui-input disN gredBack" data-name="prevPayMoney">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">货物应付(￥)</label>
                                    <div class="layui-input-block">
                                        <input name="totalProdMoney" type="text" class="layui-input" readonly placeholder="根据子表计算" />
                                        <input disabled class="layui-input disN gredBack" data-name="totalProdMoney">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">减免金额(￥)</label>
                                    <div class="layui-input-block flex_between">
                                        <input name="discountMoney" type="text" class="layui-input" />
                                        <input disabled class="layui-input disN gredBack" data-name="discountMoney">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">线下订单号</label>
                                    <div class="layui-input-block">
                                        <input name="ali1688OrderNo" type="text" class="layui-input" />
                                        <input disabled class="layui-input disN gredBack" data-name="ali1688OrderNo">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">内部标签</label>
                                    <div class="layui-input-block layui-form" lay-filter="inside_tagFilter">
                                        <select name="note" xm-select="note_purchaseOrderOff_AddForm" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='note_purchaseOrderOff_AddForm'>
                                            <option></option>
                                            <c:forEach items="${purInsideTagList}" var="purInsideTag">
                                                <option value="${purInsideTag.code}">${purInsideTag.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>

                                <div class="layui-col-md4 layui-col-lg4">
                                    <label class="layui-form-label">买家留言</label>
                                    <div class="layui-input-block">
                                        <textarea name="purNote" type="text" class="layui-input" placeholder="发送给卖家的留言，创建1688订单前可编辑"></textarea>
                                        <textarea disabled class="layui-input disN gredBack" data-name="purNote"></textarea>
                                    </div>
                                </div>

                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">采购备注</label>
                                    <div class="layui-input-block">
                                        <input name="memo" type="text" class="layui-input" placeholder="公司内部员工自用" />
                                    </div>
                                </div>

                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="fl ml20">
                                        <input name="ifBuySample" type="checkbox" class="ml20" value="1" title="新品采样" lay-skin="primary"/>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div class="layui-col-lg12 layui-col-md12">

                            <div class="layui-col-md4 layui-col-lg4 ml20">
                                <input id="toAddSkuInp_purOrderInfo" autocomplete="off" type="text" class="layui-input" placeholder="多个以逗号隔开" />
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <span class="layui-btn layui-btn-sm ml20" id="toAddSkuInpBtn_purOrderInfo">查询sku</span>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <span class="layui-btn layui-btn-sm ml20" id="toMatchReceiverInfo_purOrderInfo">匹配收货信息</span>
                            </div>
                            <div class="layui-col-md5 layui-col-lg5 fr">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="text" class="layui-input" id="detailMoney_purOrderOfflineList" autocomplete="off" placeholder="采购单价">
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <input type="text" class="layui-input" id="detailNum_purOrderDetailList" autocomplete="off" placeholder="采购数量">
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="layui-btn layui-btn-sm ml20" id="updateByList_purOrderDetailList">批量修改</div>
                                </div>
                            </div>
                        </div>
                        <div class="ml20">
                            <table class="layui-table" id="purOrderDetailTable_orderInfo" lay-filter="purOrderDetailTable_orderInfo"></table>
                        </div>
                    </div>

                    <div class="layui-tab-item p20">
                        <div class="layui-tab layui-tab-brief">
                            <div class="layui-show">
                                <table class="layui-table" id="purchaseOrderOffLogTab" lay-filter="purchaseOrderOffLogTab"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="skuSelectPop_purchaseOrderOff">
    <div class="p20">
        <div class="layui-card" id="productlistCard">
            <div class="layui-card-header">
                <span class="numCount">商品数量<span id="sSkuNum_purchaseOrderOff"></span></span>
                <span id="ifSelectStopSale" class="layui-btn layui-btn-sm">包含停售产品</span>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="skuSelectTab_purchaseOrderOff" lay-filter="skuSelectTab_purchaseOrderOff"></table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="img_skuSelectPop_purchaseOrderOff">
    {{# if(typeof(d.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.image }}" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" /> {{# } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png" class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" /> {{# } }}
</script>


<script type="text/html" id="operType_purOrderLog">
    {{# if (d.operType == 1) {}}创建采购单{{# }}}
    {{# if (d.operType == 2) {}}修改采购单{{# }}}
    {{# if (d.operType == 3) {}}审核采购单{{# }}}
    {{# if (d.operType == 4) {}}可付变更{{# }}}
    {{# if (d.operType == 5) {}}发起创建1688订单{{# }}}
    {{# if (d.operType == 6) {}}创建1688订单{{# }}}
    {{# if (d.operType == 7) {}}取消1688订单{{# }}}
    {{# if (d.operType == 9) {}}作废{{# }}}
    {{# if (d.operType == 0) {}}app收货{{# }}}
    {{# if (d.operType == 11) {}}申请退款{{# }}}
    {{# if (d.operType == 12) {}}订单归档{{# }}}
    {{# if (d.operType == 13) {}}取消归档{{# }}}
    {{# if (d.operType == 14) {}}修改退款信息{{# }}}
    {{# if (d.operType == 15) {}}确认退款申请{{# }}}
    {{# if (d.operType == 16) {}}取消退款{{# }}}
    {{# if (d.operType == 17) {}}重新申请退款{{# }}}
    {{# if (d.operType == 18) {}}取消审核{{# }}}
    {{# if (d.operType == 19) {}}同步给pms{{# }}}

</script>

<script type="text/html" id="orderNo_purchaseOrderOff">
    <input type="hidden" class="purchaseOrderOffMainId" value="{{d.id}}"> {{# if(d.speedLevel > 0) {}}
    <div class="speed_purchaseOrderOff"></div>
    {{# }}}
    <div>
        <%--<span style="color: grey;">采购: </span>--%>
        <span class="pora copySpan">
            <a>{{d.billNumber}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
        </span>
    </div>
    <div style="color: grey;">{{d.ifBuySample ? '新品采样' : ''}}</div>

    <%--<div style="text-align: left"><span style="color: grey;">pms: </span>--%>
        <%--<span class="canClickEl showSpan clcikRoutTo pora copySpan" data-routUrl="https://trade.1688.com/order/new_step_order_detail.htm?orderId={data}">--%>
            <%--<a>{{d.ali1688OrderNo || ''}}</a>--%>
            <%--<button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>--%>
        <%--</span>--%>
        <%--<input type="text" class="disN editInp" data-name="ali1688OrderNo" data-id="{{d.id}}">--%>
        <%--&lt;%&ndash;<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>&ndash;%&gt;--%>
    <%--</div>--%>

    <%--<div style="text-align: left"><span style="color: grey;">物流: </span>--%>
        <%--<span class="canClickEl showSpan pora clcikRoutTo copySpan" data-routUrl="https://www.baidu.com/s?wd={data}">--%>
           <%--<a>{{d.logisticOrderNo || ''}}</a>--%>
           <%--<button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>--%>
        <%--</span>--%>
        <%--<input type="text" class="disN editInp" data-name="logisticOrderNo" data-id="{{d.id}}">--%>
        <%--&lt;%&ndash;<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>&ndash;%&gt;--%>
    <%--</div>--%>
</script>

<script type="text/html" id="logisticFee_purchaseOrderOff">
    <div class="alignLeft freeClickBox">
        <%--<div><span style="color: grey;">总货款：</span>{{d.totalProdMoney}}</div>--%>
        <div>
            <div>
                <span style="color: grey;">物流费：</span>
                <span class="showSpan">{{(d.logisticFee != null && d.logisticFee != undefined) ? d.logisticFee : ''}}</span>
                <input type="text" class="disN editInp" data-name="logisticFee" data-id="{{d.id}}">
                <%--<i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>--%>
            </div>
        </div>

        <div><span style="color: grey;">商品费：</span>{{d.totalProdMoney}}</div>
        <%--<div><span style="color: grey;">1688物流费：</span>{{d.ali1688LogisticFee || ''}}</div>--%>
        <div><span style="color: grey;">总金额：</span>{{d.prevPayMoney || ''}}</div>
        {{# if (d.ifRefund) {}}
        <div><span style="color: grey;">实退款金额：</span>{{d.aliReceiveRefund || ''}}</div>
        {{# } }}
    </div>
</script>

<script type="text/html" id="responsor_purchaseOrderOff">
    <div class="alignLeft">
        <div><span style="color: grey;">采购：</span>{{d.buyer}}</div>
        <div><span style="color: grey;">制单：</span>{{d.creator}}</div>
    </div>
</script>

<script type="text/html" id="purchaseConf_purchaseOrderOff">
    <div class="alignLeft">
        <div><span style="color: grey;">sku种类：</span>{{d.totalSku}}</div>
        <div><span style="color: grey;">商品总数：</span>{{d.totalAmount}}</div>
    </div>
</script>

<script type="text/html" id="logisticList_purchaseOrderOff">
    {{# var logisticList = getLogisticArr(d.logisticOrderNo); for (var i = 0; i < logisticList.length; ++i) { }}
        <div style="text-align: left">
            <span style="color: grey;">[{{d.logisticName}}] </span>
            <span class="canClickEl showSpan clcikRoutTo pora copySpan" data-routUrl="https://www.baidu.com/s?wd={data}">
                <a>{{logisticList[i]}}</a>
                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
            </span>
        </div>
    {{# } }}
</script>

<script type="text/html" id="diffrence_purchaseOrderOff">
    {{# if (d.actPayMoney) { }}
    <div>{{accSub(d.prevPayMoney, d.actPayMoney)}}</div>
    {{# } }}
</script>

<script type="text/html" id="auditStatus_purchaseOrderOff">
    <div><input type="checkbox" lay-skin="primary" {{d.auditStatus==1 ? "checked" : ""}} disabled></div>
</script>

<script type="text/html" id="payAblepurchaseOrderOff">
    <div><input type="checkbox" lay-skin="primary" {{d.payAble==1 ? "checked" : ""}} disabled></div>
</script>

<script type="text/html" id="createAli1688OrderStatus_purchaseOrderOff">
    {{# if (d.createAli1688OrderStatus == 0){ }}<span style="color: orange">未创建</span>{{# }}} {{# if (d.createAli1688OrderStatus == 1){ }}<span style="color: grey">创建中</span>{{# }}} {{# if (d.createAli1688OrderStatus == 2){ }}<span style="color: limegreen">创建成功</span>{{#
    }}} {{# if (d.createAli1688OrderStatus == 3){ }}<span style="color: red" onmouseover="showCreate1688FailReason(`{{d.createAli1688FailReason}}`,this)" data-tipId="" onmouseout="removeFailReasonTip(this)">创建失败</span>{{# }}}
</script>

<script type="text/html" id="status_purchaseOrderOff">
    <div><span style="color: grey;">审核状态:</span> {{# if (d.auditStatus == 0){ }}未审核{{# }}} {{# if (d.auditStatus == 1){ }}已审核{{# }}} {{# if (d.auditStatus == 3){ }}废弃{{# }}}
    </div>
    <div><span style="color: grey;">是否可付:</span> {{# if (d.payAble == 0){ }}未标记{{# }}} {{# if (d.payAble == 1){ }}已标记{{# }}}
    </div>
</script>


<script type="text/html" id="notInStoreAmount_purchaseOrderOff">
    <div style="text-align: left">
        <div><span style="color: grey;">数量：</span>{{accSub(d.totalAmount, d.inAmount)}}</div>
        <div><span style="color: grey;">金额：</span>{{accSub(d.prevPayMoney,d.inMoney)}}</div>
    </div>
</script>


<script type="text/html" id="notInStoreMoney_purchaseOrderOff">
    {{# if (d.prevPayMoney) { }}
    <div>{{accSub(d.prevPayMoney, d.inMoney)}}</div>
    {{# } }}
</script>

<script type="text/html" id="purchaseOrderOffTable_bar">
    <div>
        <permTag:perm funcCode="update_purchaseOrderOff">
            <div class="layui-btn layui-btn-xs" lay-event="detail">订单详情</div>
        </permTag:perm>
    </div>
    {{#if (d.auditStatus == -1) { }}
    <div>
        <permTag:perm funcCode="newDisableOrder_purchaseOrderOff">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">订单作废</div>
        </permTag:perm>
    </div>
    {{# }else if (d.auditStatus == 0) { }} <div>
        <permTag:perm funcCode="unDisableOrder_purchaseOrderOff">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">订单作废</div>
        </permTag:perm>
    </div>
    {{# }else if (d.auditStatus == 1 && d.stockInStatus <=1 && !d.ifPullInvalid) { }} <div>
        <permTag:perm funcCode="createstockin_purchaseOrderOff">
            <div class="layui-btn layui-btn-xs layui-btn-primary" lay-event="createstockin">建入库单</div>
        </permTag:perm>
    </div>
    {{# } }} {{#if (d.auditStatus == 1 && !d.ifPullInvalid) {}}
            {{# if (d.refundStatus < 2) { }}
                <permTag:perm funcCode="refund_purchaseOrderOff">
                    <div>
                        <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="refund">申请退款</div>
                    </div>
                </permTag:perm>
                {{# if (d.refundStatus == 1) {}}
                    <permTag:perm funcCode="refund_purchaseOrderOff">
                        <div>
                            <div class="layui-btn layui-btn-xs" lay-event="cancelRefund">取消退款</div>
                        </div>
                    </permTag:perm>
                    <permTag:perm funcCode="confirmRefund_purchaseOrderOff">
                        <div>
                            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="confirmRefund" title="确认申请退款">确认申请</div>
                        </div>
                    </permTag:perm>
                {{# } }}
            {{# } }}
            {{# if (d.refundStatus == 2) { }}
                <permTag:perm funcCode="refund_purchaseOrderOff">
                    <div>
                        <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="refund">重新申请</div>
                    </div>
                </permTag:perm>
            {{# } }}
        <permTag:perm funcCode="orderPullInvalid_purchaseOrderOff">
            <div>
                <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="pullInvalid">订单归档</div>
            </div>
        </permTag:perm>
    {{# }}}
    {{#if (d.auditStatus == 1 && d.ifPullInvalid) {}}
    <permTag:perm funcCode="pullInvalid_purchaseOrderOff">
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-primary" lay-event="pullInvalidDetail">归档详情</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="cancelPullInvalid_purchaseOrderOff">
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="cancelPullInvalid">取消归档</div>
        </div>
    </permTag:perm>
    {{# }}}
</script>


<script type="text/html" id="date_purchaseOrderOff">
    <div><span style="color: grey;">制单:</span>{{format(d.createTime,'yyyy-MM-dd')}}</div>
    <div><span style="color: grey;">预到:</span>{{format(d.delivDay,'yyyy-MM-dd')}}</div>
</script>

<script type="text/html" id="image_purOrderDetail">
    {{# if(typeof(d.image) !="undefined"){ }}
    <img width="60" height="60" src="${tplIVP}{{ d.image }}" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" /> {{# } else { }}
    <img width="60" height="60" src="${ctx}/static/img/kong.png" class="lazy" /> {{# } }}
</script>

<script type="text/html" id="purOrderDetailTable_bar">
    <div>
        <div class="layui-btn layui-btn-xs layui-btn-danger deleteBtn_purOrderDetail">删除</div>
    </div>
</script>
<script type="text/html" id="buyerAmount_purOrderOffline">
    <div><input class="layui-input amountInp_purOrderDetail" value="{{d.amount}}" /></div>
</script>
<script type="text/html" id="originCost_purOrderOffline">
    <div><input class="layui-input originCostInp_purOrderDetail" value="{{d.originCost || d.purchaseCostPrice}}" /></div>
</script>

<script type="text/html" id="taxPrice_purOrderDetail">
    <div>
        <div class="taxPrice_purOrderDetail">{{d.taxPrice}}</div>
    </div>
</script>

<script type="text/html" id="subTotalMoney_purOrderDetail">
    <div>
        <div class="subTotalMoney_purOrderDetail">{{accMul(d.originCost,d.amount)}}</div>
    </div>
</script>
<script type="text/html" id="totalWeight_subDetailList">
    <div>
        <div class="subTotalWeight_purOrderDetail">
            {{d.totalWeight}}
        </div>
    </div>
</script>
<script type="text/html" id="subSupplierList_purOrderDetail">
    {{# for (var i = 0; i
    < d.supplierRefDtoList.length; i++) {}} <div>
        <a class="linkBox" target="_blank" href="{{d.supplierRefDtoList[i].purchaseUrl}}">
            <div class="overContentEllipsis">{{d.supplierRefDtoList[i].supplierName}}</div>
            {{# if (d.supplierRefDtoList[i].offerId) {}}
            <i class="layui-icon layui-icon-face-smile" style="font-size: 15px; color: cornflowerblue;" title="已经匹配1688信息:{{d.supplierRefDtoList[i].attrStr}}">&#xe6af;</i> {{#}}}
        </a>
    </div>
    {{# }}}
</script>
<script type="text/html" id="purOffline_oldLowestPriceBox">
    <a href="{{d.sameProductUrl || 'javascript;'}}" target="_blank" class="canClickEl">{{d.sameProductLowestPrice || ''}}</a>
</script>

<script type="text/html" id="newLowestPriceBox_purOrderDetail">
    <div>
        <span class="fGrey">最低: </span><a class="canClickEl" target="_blank" href="{{d.supplierRefDtoList[0].lowestSameProdUrl || 'javascript;'}}">{{d.supplierRefDtoList[0].sameProdLowestPrice || ''}}</a>
    </div>
    <div>
        <span class="fGrey">同款: </span><a class="canClickEl" onclick="lowestPriceCompareHandle({{d.offerId}})">{{d.supplierRefDtoList[0].sameProdCount || ''}}</a>
    </div>
</script>

<script type="text/html" id="updateListPop_purchaseOrderOff">
    <div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="updateListForm_purOrderMain" id="updateListForm_purOrderMain" autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="purOrgId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${firstOrgList}" var="org">
                                            <option value="${org.id}">${org.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购专员</label>
                                <div class="layui-input-block">
                                    <select name="buyerId" lay-search="">
                                        <option ></option>
                                        <c:forEach items="${buyers}" var="buyer">
                                            <option value="${buyer.id}">${buyer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="multiPayUrl_purchaseOrderOff">
    <div class="m_20">
        <table class="layui-table" id="multiPayUrlTable_purchaseOrderOff" lay-filter="multiPayUrlTable_purchaseOrderOff"></table>
    </div>
</script>
<script type="text/html" id="multiPayUrlTable_purchaseOrderOff_bar">
    <div>
        <div class="layui-btn layui-btn-xs" lay-event="showDetail">详情</div>
    </div>
</script>

<script type="text/html" id="daylysSales_purchaseOrderOff">
    <div>{{d.fiveSalesNum || 0}} / {{d.fifteenSalesNum || 0}} / {{d.thirtySalesNum || 0}}</div>
</script>

<script type="text/html" id="title_purOrder_subDetailList">
    <div class="copySpan">
        <span>
            <a >{{d.title + (d.packDesc ? ('(' + d.packDesc + ')') : '')}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
        </span>
    </div>
</script>

<%--导出采购订单--%>
<script type="text/html" id="purchaseOrderOff_exportPurMainInfoPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_exportPurMainInfo_purchaseOrderOff"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" id="exportPurMainInfoForm_purchaseOrderOff" lay-filter="exportPurMainInfoForm_purchaseOrderOff">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">基本信息</legend>
                        </fieldset>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" title="采购单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购账号" title="采购账号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="地址id" title="地址id" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购部门" title="采购部门" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购员" title="采购员" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="仓库" title="仓库" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="支付方式" title="支付方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购备注" title="采购备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="买家留言" title="买家留言" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="仓库备注" title="仓库备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="内部便签" title="内部便签" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="供应商" title="供应商" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核人" title="审核人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核状态" title="审核状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核时间" title="审核时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="概览信息" title="概览信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="sku种类" title="sku种类" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="货物总数量" title="货物总数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="货物总金额" title="货物总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="减免金额" title="减免金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="已入库数" title="已入库数" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="已入库金额" title="已入库金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="到货日期" title="到货日期" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="预付款" title="预付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="实付款" title="实付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流渠道" title="物流渠道" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流单号" title="物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流费用" title="物流费用" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流状态" title="物流状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="阿里卖家名称" title="阿里卖家名称" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688单号" title="1688单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688订单状态" title="1688订单状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688退款金额" title="1688退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="是否可付" title="是否可付" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="可付时间" title="可付时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="摊分方式" title="摊分方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="创建人" title="创建人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否归档" title="是否归档" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档类型" title="归档类型" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档备注" title="归档备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档时间" title="归档时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档人" title="归档人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款状态" title="退款状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款金额" title="退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款数量" title="退款数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款原因" title="退款原因" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款物流单号" title="退款物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款备注" title="退款备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款人" title="退款人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款时间" title="退款时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="跟单员" title="跟单员" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="跟单备注" title="跟单备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="最后入库时间" title="最后入库时间" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<%--导出订单详情--%>
<script type="text/html" id="purchaseOrderOff_exportPurDetailInfoPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_exportPurDetailInfo_purchaseOrderOff"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" id="exportPurDetailInfoForm_purchaseOrderOff" lay-filter="exportPurDetailInfoForm_purchaseOrderOff">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">子表信息</legend>
                        </fieldset>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" title="子SKU" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="图片" title="图片" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="商品名称" title="商品名称" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="款式" title="款式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="父SKU" title="父SKU" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="有效匹配1688" title="有效匹配1688  " lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="无税单价" title="无税单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="税率" title="税率" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="单商品税金" title="单商品税金" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="含税单价" title="含税单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购数量" title="采购数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="总金额(不含税)" title="总金额(不含税)" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="含税总金额" title="含税总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="最低采购单价" title="最低采购单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="纯商品成本" title="纯商品成本" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="已入库数量" title="已入库数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="不良品数量" title="不良品数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="不良品原因" title="不良品原因" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="入库要求" title="入库要求" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">主表信息</legend>
                        </fieldset>r
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" title="采购单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购账号" title="采购账号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="地址id" title="地址id" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购部门" title="采购部门" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购员" title="采购员" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="仓库" title="仓库" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="支付方式" title="支付方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="采购备注" title="采购备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="买家留言" title="买家留言" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="仓库备注" title="仓库备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="内部便签" title="内部便签" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="供应商" title="供应商" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核人" title="审核人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核状态" title="审核状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="审核时间" title="审核时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="概览信息" title="概览信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="sku种类" title="sku种类" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="货物总数量" title="货物总数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="货物总金额" title="货物总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="减免金额" title="减免金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="已入库数" title="已入库数" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="已入库金额" title="已入库金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="到货日期" title="到货日期" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="预付款" title="预付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="实付款" title="实付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流渠道" title="物流渠道" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流单号" title="物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流费用" title="物流费用" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="物流状态" title="物流状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="阿里卖家名称" title="阿里卖家名称" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688单号" title="1688单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688订单状态" title="1688订单状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="1688退款金额" title="1688退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="是否可付" title="是否可付" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="可付时间" title="可付时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="摊分方式" title="摊分方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrderOff"><input type="checkbox" name="baseField" value="创建人" title="创建人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否归档" title="是否归档" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档类型" title="归档类型" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档备注" title="归档备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档时间" title="归档时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="归档人" title="归档人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款状态" title="退款状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款金额" title="退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款数量" title="退款数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款原因" title="退款原因" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款物流单号" title="退款物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款备注" title="退款备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款人" title="退款人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="退款时间" title="退款时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="跟单员" title="跟单员" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="跟单备注" title="跟单备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="最后入库时间" title="最后入库时间" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="deailPop_purchaseOrderOff">
    <table class="layui-table" id="deailShowTable_purchaseOrderOff" lay-filter="deailShowTable_purchaseOrderOff" style="margin-top: 0"></table>
</script>

<script type="text/html" id="refundRequirePop_purchaseOrderOff">
    <div class="layui-tab layui-tab-card">
        <div class="layui-card-body">
            <div class="layui-tab-content">
                <form class="layui-form" id="refundRequireForm" lay-filter="refundRequireForm">
                    <div class="layui-form-item">
                        <div class="layui-col-lg6 layui-col-md6" notNull>
                            <label class="layui-form-label">退款原因</label>
                            <div class="layui-input-block">
                                <select name="refundReason" lay-search>
                                    <option value=""></option>
                                    <c:forEach items="${refundReasonList}" var="refundReason">
                                        <option value="${refundReason.name}">${refundReason.name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg6 layui-col-md6" notNull>
                            <label class="layui-form-label">退款金额(￥)</label>
                            <div class="layui-input-block">
                                <input type="text" name="requireRefund" class="layui-input" />
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-lg6 layui-col-md6" notNull>
                            <label class="layui-form-label">退货数量</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundAmout" class="layui-input" />
                            </div>
                        </div>

                        <div class="layui-col-lg6 layui-col-md6">
                            <label class="layui-form-label">退款物流单号</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundLogisticNo" class="layui-input" />
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-lg12 layui-col-md12">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundRemark" class="layui-input" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="pullInvalidPop_purchaseOrderOff">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-card-body">
                <div class="layui-tab-content">
                    <form class="layui-form" id="pullInvalidForm" lay-filter="pullInvalidForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg6 layui-col-md6">
                                <label class="layui-form-label">退款原因</label>
                                <div class="layui-input-block">
                                    <input name="refundReason" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                            <div class="layui-col-lg6 layui-col-md6">
                                <label class="layui-form-label">退款金额(￥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="requireRefund" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg6 layui-col-md6">
                                <label class="layui-form-label">退货数量</label>
                                <div class="layui-input-block">
                                    <input type="text" name="refundAmout" class="layui-input gredBack" disabled/>
                                </div>
                            </div>

                            <div class="layui-col-lg6 layui-col-md6">
                                <label class="layui-form-label">退款物流单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="refundLogisticNo" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12">
                                <label class="layui-form-label">退款备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="refundRemark" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12">
                                <label class="layui-form-label">实退金额(￥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="aliReceiveRefund" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12" notNull>
                                <label class="layui-form-label">归档类型</label>
                                <div class="layui-input-block">
                                    <select name="pullInvalidType" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${invalidTypeList}" var="invalidType">
                                            <option value="${invalidType.name}">${invalidType.name}</option>
                                        </c:forEach>
                                    </select>
                                    <input class="layui-input gredBack disN" disabled name="pullInvalidTypeInp">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12">
                                <label class="layui-form-label">归档备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="pullInvalidRemark" class="layui-input" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<%@ include file="/WEB-INF/view/jsp/purchases/purchases/createStockInOrder.jsp"%>
<style type="text/css">
    .gredBack {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .fieldBox_purchaseOrderOff {
        float: left;
        width: 20%;
        height: 25px;
    }

    .trLineBox {
        float: left;
        width: 100%;
        height: 50px;
    }
</style>

<script type="text/javascript" src="${ctx}/static/js/purchases/purchaseorderoff.js"></script>
