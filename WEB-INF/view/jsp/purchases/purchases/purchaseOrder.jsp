<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采购订单</title>
<style>
    /*select2样式*/
    #purchaseOrder_saleOrderLayer {
        height: 200px !important;
    }

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

    .dis_flex_start {
        display: flex;
        justify-content: flex-start;
    }

    .pd {
        padding: 10px!important;
    }

    .stockin_title {
        line-height: 31px;
        font-size: 16px;
        font-weight: 600;
        margin: 0 10px;
    }

    .pl_10 {
        padding-left: 10px !important;
    }

    #LAY-purchaseorder .layui-form-label {
        width: 85px !important;
    }

    #LAY-purchaseorder .layui-input-block {
        margin-left: 120px !important;
    }

    .fr {
        float: right;
    }

    .mr_10 {
        margin-right: 10px;
    }

    .m_20 {
        margin: 20px !important;
    }
    .purchaseOrder_refundDetailTableWrap .layui-table-body.layui-table-main{
        padding-bottom: 20px;
    }
    .prod_tag {
        height: 20px;
        padding: 5px;
        margin-right: 5px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        background-color: rgb(236, 245, 255);
        border: 1px solid rgb(217, 236, 255);
        color: rgb(64, 158, 255);
        border-radius: 4px;
    }
    .danger_tag {
        height: 20px;
        padding: 5px;
        margin-right: 5px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        background-color: rgb(254, 240, 240);
        border: 1px solid #fab6b6;
        color: #f56c6c;
        border-radius: 4px;
    }
    .system-tag,
    .buy-tag {
        padding: 0px 5px;
        height: 20px;
        margin-right: 5px;
        line-height: 1;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        border: 1px solid rgb(217, 236, 255);
        color: black;
        border-radius: 4px;
    }
    .system-tag {
        background-color: rgb(199, 235, 252);
    }
    .buy-tag {
        background-color: rgb(187, 229, 211);
    }
</style>
<div class="layui-fluid" id="LAY-purchaseorder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body" style="z-index: 10002">
                    <form class="layui-form layui-clear keyEnterToSearchForm" lay-filter="purcaseOrder_searchForm" id="purcaseOrder_searchForm" autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label label_reset">
                                    <select name="timeType" class="hiddenContent">
                                        <option value="1">制单时间</option>
                                        <option value="2">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="timeRange" id="timeRange_purchaseOrder" type="text" class="layui-input hiddenContent" readonly />
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerIdListStr" xm-select="buyer_purchaseOrderNew" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='buyer_purchaseOrder1' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${buyers}" var="buyer">
                                            <option value="${buyer.id}" name="purchaseOption">${buyer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" xm-select="bizzOwner_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='bizzOwner_purchaseOrder' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">跟单专员</label>
                                <div class="layui-input-block">
                                    <select name="followerIdList" xm-select="followerIdList_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='followerIdList_purchaseOrder' lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="searchSupplier_purchaseOrder" name="supplierName" class="layui-input" />
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
                                <label class="layui-form-label">付款账号</label>
                                <div class="layui-input-block">
                                    <select name="purAcctId" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${purAcctList}" var="purAcct">
                                            <option value="${purAcct.id}">${purAcct.acct}</option>
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
                                            <option value="${ali1688StatusEnum.type}">${ali1688StatusEnum.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">一键下单</label>
                                <div class="layui-input-block">
                                    <select name="autoPurAble">
                                        <option></option>
                                        <option value="1">可</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购金额</label>
                                <div class="layui-input-block flex_between">
                                    <input name="totalProdMoneyMin" type="text" class="layui-input w_40" placeholder="≥" onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('只能输入数字，小数点后只能保留两位');this.value='';}" />
                                    <input name="totalProdMoneyMax" type="text" class="layui-input w_40" placeholder="≤" onkeyup="if(this.value && ! /^[0-9]+(.[0-9]{0,2})?$/.test(this.value)){alert('只能输入数字，小数点后只能保留两位');this.value='';}" />
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="aliRefundStatus">
                                        <option value="">1688退款状态</option>
                                        <option value="0">未申请退款</option>
                                        <option value="1">等待卖家同意</option>
                                        <option value="2">等待买家修改</option>
                                        <option value="3">等待买家发货</option>
                                        <option value="4">等待卖家收货</option>
                                        <option value="5">退款成功</option>
                                        <option value="6">退款失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="orderType">
                                        <option value="">订单类型</option>
                                        <option value="1">1688</option>
                                        <option value="2">淘宝订单</option>
                                    </select>
                                </div>
                            </div>
                            
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="ifCreateAliOrder">
                                    <option value="">有无阿里单号</option>
                                    <option value="false">无</option>
                                    <option value="true">有</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="createAli1688OrderStatus">
                                    <option value="">创建1688</option>
                                    <option value="0">未创建</option>
                                    <option value="1">创建中</option>
                                    <option value="2">创建成功</option>
                                    <option value="3">创建失败</option>
                                </select>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否可付</label>
                                <div class="layui-input-block">
                                    <select name="payAble" lay-search="">
                                        <option ></option>
                                        <option value="1">可付</option>
                                        <option value="0">不可付</option>
                                    </select>
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
                                        <option value="1" selected>采购单号</option>
                                        <option value="2">1688单号</option>
                                        <option value="3">快递单号</option>
                                        <option value="4">快递单号(尾数模糊)</option>
                                        <option value="5">淘宝货源主单号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchOrderNo" type="text" class="layui-input" placeholder="单号支持多个精确(英文逗号分隔)/单个模糊" />
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="refundStatus">
                                        <option value="">OA退款状态</option>
                                        <option value="0">未申请退款</option>
                                        <option value="1">待确认申请</option>
                                        <option value="2">已确认申请</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="hasPurNote" >
                                        <option value="">下单备注</option>
                                        <option value="true">有</option>
                                        <option value="false">无</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="orderBy" class="hiddenContent">
                                        <option value="t1.create_time desc">创建时间倒序</option>
                                        <option value="t1.create_time asc">创建时间正序</option>
                                        <option value="t1.pay_able_time desc">可付时间倒序</option>
                                        <option value="t1.pay_able_time asc">可付时间正序</option>
                                        <option value="t1.audit_time desc">审核时间倒序</option>
                                        <option value="t1.audit_time asc">审核时间正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <input type="checkbox" name="ifSpeed" id="ifSpeed_purcaseOrder_searchForm" lay-skin="primary" title="加急">
                                </div>
                            </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">快递方式</label>
                                    <div class="layui-input-block">
                                        <select name="logisticNameListStr" xm-select="logisticName_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='logisticName_purchaseOrder' lay-search>
                                            <option></option>
                                            <c:forEach items="${logisticNameList}" var="logisticName">
                                                <option value="${logisticName.code}">${logisticName.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">sku种类</label>
                                    <div class="layui-input-block flex_between">
                                        <input name="totalSkuMin" type="text" class="layui-input w_40" placeholder="≥" onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}" />
                                        <input name="totalSkuMax" type="text" class="layui-input w_40" placeholder="≤" onkeyup="if(this.value && ! /^[0-9]+?$/.test(this.value)){alert('只能输入正整数');this.value='';}" />
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">商品总数</label>
                                    <div class="layui-input-block flex_between">
                                        <input name="totalAmountMin" type="text" class="layui-input w_40" placeholder="≥" onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}" />
                                        <input name="totalAmountMax" type="text" class="layui-input w_40" placeholder="≤" onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}" />
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <select name="payType">
                                            <option value="">付款方式</option>
                                            <c:forEach items="${payTypeList}" var="payType">
                                                <option value="${payType.code}">${payType.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <select name="ifHasExpressNo">
                                            <option value="">有无快递单号</option>
                                            <option value="true">有</option>
                                            <option value="false">无</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <input type="checkbox" id="purcaseOrder_searchForm_ifSupplierDiff" lay-skin="primary" title="供应商不一致">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <select name="diffSupplierDealMethod">
                                            <option value="">供应商处理</option>
                                            <option value="1">不换供应商</option>
                                            <option value="2">换供应商-系统已存在</option>
                                            <option value="3">换供应商-系统未录入</option>
                                        </select>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2" >
                                    <label class="layui-form-label">新品采样</label>
                                    <div class="layui-input-block">
                                        <select name="ifNewSampling" lay-search="">
                                            <option ></option>
                                            <option value="true">是</option>
                                            <option value="false">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" >
                                    <label class="layui-form-label">实付预估<br>运费差额</label>
                                    <div class="layui-input-block flex_between">
                                        <input name="logisticFeeDifferenceMin" type="text" class="layui-input w_40" placeholder="≥" onblur="if(this.value && ! /^(\-)?\d+(\.\d{1,2})?$/.test(this.value)){alert('实付预估运费差额只能输入数字，小数点后只能保留两位');this.value='';}" />
                                        <input name="logisticFeeDifferenceMax" type="text" class="layui-input w_40" placeholder="≤" onblur="if(this.value && ! /^(\-)?\d+(\.\d{1,2})?$/.test(this.value)){alert('实付预估运费差额只能输入数字，小数点后只能保留两位');this.value='';}" />
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2" >
                                    <label class="layui-form-label">仓库签收</label>
                                    <div class="layui-input-block">
                                        <select name="ifWarehouseReceive" lay-search="">
                                            <option ></option>
                                            <option value="true">是</option>
                                            <option value="false">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl_10" style="float: right;margin-top: 0px">
                                    <button id="searchBtn_purchaseOrder" class="layui-btn layui-btn-sm keyHandle" type="button">查询</button>
                                    <div id="reset_purchaseOrder" class="layui-btn layui-btn-primary layui-btn-sm">清空</div>
                                    <div id="purchaseOrder_save" class="inline_block pora"></div>
                                </div>

                        </div>
                        <input name="auditStatus" type="hidden" value="0" class="hiddenContent">
                        <input name="ifPullInvalid" type="hidden" value="" class="hiddenContent">
                        <input name="ifNormal" type="hidden" value="" class="hiddenContent">
                    </form>
                    <form id="stockInStatusForm_purchaseOrder">
                        <input type="checkbox" hidden name="stockInStatus" value="1">
                        <input type="checkbox" hidden name="stockInStatus" value="2">
                        <input type="checkbox" hidden name="stockInStatus" value="3">
                    </form>
                </div>
            </div>
            <div class="layui-card" id="purchaseOrderCard">
                <div class="layui-card-header" style="z-index: 10000;height: auto;">
                    <div style="float:left;">
                        <ul class="layui-tab-title fl">
                            <li class="layui-this numCount_purchaseOrder" data-auditstatus="0">未审核(<span id="noAuditNum_purchaseOrder"></span>)</li>
                            <li class="numCount_purchaseOrder" data-auditstatus="1">已审核(<span id="hasAuditNum_purchaseOrder"></span>)</li>
                            <li class="numCount_purchaseOrder" data-auditstatus="3">废弃(<span id="deleteNum_purchaseOrder"></span>)</li>
                            <li class="numCount_purchaseOrder" data-ifpullinvalid="1">归档订单(<span id="pullInvalidNum_purchaseOrder"></span>)</li>
                        </ul>
                        <div class="btnSelect_hp fl" style="width: 100px;margin-top: 7px;margin-right: 15px;">
                            <div class="title_btnSelect">新增修改↓</div>
                            <div class="optionBox_btnSelect">
                                <div class="optionCanvas_btnSelect">
                                    <permTag:perm funcCode="addPurOrder">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_createPurOrderBtn">新增采购订单</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_batchUpdate">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_updatePurOrderByListBtn">批量修改</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_mergeOrder">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_mergeOrderBtn">合并采购单</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_downloadTpl">
                                        <input type="file" hidden id="fileForAddByExcel_purchaseOrder">
                                        <div type="button" class="option_btnSelect" id="downTemplate_addByExcel_purchaseOrder">下载模板</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="addPurOrderByExcel">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_addPurOrderByExcelBtn">导入新增采购单</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_changeStore">
                                        <div id="purchaseOrder_changeStore" class="option_btnSelect" type="button">转仓</div>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                        <div class="btnSelect_hp fl" style="width: 100px;margin-top: 7px;margin-right: 15px;">
                            <div class="title_btnSelect">订单处理↓</div>
                            <div class="optionBox_btnSelect">
                                <div class="optionCanvas_btnSelect">
                                    <permTag:perm funcCode="audit_purchaserOrder">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_auditPurOrderBtn">审核</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaserOrder_markPay">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_markPayAble">标记可付</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaserOrder_cancelPay">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_canclePayAble">取消可付</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaserOrder_speedOrder">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_speedOrderBtn">加急</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="disable_purchaseOrder">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_disablePurOrderBtn">作废</div>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                        <div class="btnSelect_hp fl" style="width: 100px;margin-top: 7px;margin-right: 15px;">
                            <div class="title_btnSelect">1688信息↓</div>
                            <div class="optionBox_btnSelect">
                                <div class="optionCanvas_btnSelect">
                                    <permTag:perm funcCode="purchaseOrder_generate1688Order">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_createAli1688OrderBtn">生成1688订单</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_snyc1688Order">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_syncInfoFromAli1688Btn">同步1688订单</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_updateCreditRemain">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_updateCreditRemainBtn">诚E赊余额</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="purchaseOrder_batchPayLink">
                                        <div type="button" class="option_btnSelect" id="purchaseOrder_getMultiPayUrlBtn">批量支付链接</div>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                        <permTag:perm funcCode="purchaseOrder_exportPurOrder">
                            <button type="button" class="layui-btn layui-btn-sm" id="purchaseOrder_exportPurOrderBtn">导出采购订单</button>
                        </permTag:perm>
                        <permTag:perm funcCode="purchaseOrder_exportOrderInfo">
                            <button type="button" class="layui-btn layui-btn-sm" id="purchaseOrder_exportPurOrderDetailBtn">导出订单明细</button>
                        </permTag:perm>
                            <%--<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="updateFollowerByExcelBtn">导入修改跟单员</button>--%>
                            <%--<input type="file" hidden id="fileForUpdateFollowerByExcel_purchaseOrder">--%>
                    </div>
                    <div class="fr fRed">
                        超过180天的采购单，系统将不再展示
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div class="layui-card-body" id="purchaseOrder_tableDiv">
                    <div class="checkbox-group toFixedContain">
                        <div class="layui-form stockInStatusCheckBox disN">
                            <input type="checkbox" name="stockInStatus" value="1" title="未完全入库(<font id=NotAllInNum_purchaseOrder></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrder">
                            <input type="checkbox" name="stockInStatus" value="2" title="完全入库未审核(<font id=NotAuditStockInNum_purchaseOrder></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrder">
                            <input type="checkbox" name="stockInStatus" value="3" title="入库已审核(<font id=AuditStockInNum_purchaseOrder></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrder">
                            <input type="checkbox" name="stockInStatus" value="4" title="异常订单(<font id=AbNormalNum_purchaseOrder></font>)" lay-skin="primary" lay-filter="stockInStatusCheckBox_purchaseOrder">
                        </div>
                    </div>
                    <table class="layui-table" id="purchaseOrder_table" lay-filter="purchaseOrder_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 采购订单弹框 -->
<script type="text/html" id="purOrderDetail_pop">
    <div>
        <div class="layui-col-lg12 layui-col-md12 layui-tab-card mb10">
            <div class="layui-tab layui-card">
                <ul class="layui-tab-title isCreateHidden">
                    <li class="layui-this">详情</li>
                    <li id="purOrderLogLab" class="disN">操作日志</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">
                        <form class="layui-form layui-clear" lay-filter="purOrderMainInfoForm" id="purOrderMainInfoForm" autocomplete="off">
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
                                        <select name="storeId" lay-search="" lay-filter="storeId_purOrderDetail">
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
                                            <input id="searchSupplier_purchaseOrderDetailForm"  name="supplierName" class="layui-input" placeholder="可添加的sku自动检索第一供应商" />
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
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">下单账号</label>
                                    <div class="layui-input-block">
                                        <select name="purAcctId" lay-search lay-filter="pur1688AcctId_purOrderDetail">
                                            <option value=""></option>
                                            <c:forEach items="${purAcctList}" var="purAcct">
                                                <option value="${purAcct.id}">${purAcct.acct}</option>
                                            </c:forEach>
                                        </select>
                                        <input disabled class="layui-input disN gredBack" data-name="purAcctId">
                                    </div>
                                </div>
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
                                    <label class="layui-form-label">1688单号</label>
                                    <div class="layui-input-block">
                                        <input name="ali1688OrderNo" type="text" class="layui-input" />
                                        <input disabled class="layui-input disN gredBack" data-name="ali1688OrderNo">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">内部标签</label>
                                    <div class="layui-input-block layui-form">
                                        <select name="note" data-name="note" xm-select="note_purchaseOrder_AddForm" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='note_purchaseOrder_AddForm'>
                                            <option></option>
                                            <c:forEach items="${purInsideTagList}" var="purInsideTag">
                                                <option value="${purInsideTag.code}">${purInsideTag.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">预估运费(￥)</label>
                                    <div class="layui-input-block">
                                        <input name="predictLogisticFee" type="text" class="layui-input disAbleInp" readonly/>
                                        <input disabled class="layui-input disN gredBack" data-name="predictLogisticFee">

                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">买家留言</label>
                                    <div class="layui-input-block">
                                        <textarea name="purNote" type="text" class="layui-input" placeholder="发送给卖家的留言，创建1688订单前可编辑"></textarea>
                                        <textarea disabled class="layui-input disN gredBack" data-name="purNote"></textarea>
                                    </div>
                                </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">采购备注</label>
                                    <div class="layui-input-block">
                                        <input name="memo" type="text" class="layui-input" placeholder="公司内部员工自用" />
                                    </div>
                                </div>
<%--                                <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                    <label class="layui-form-label">跟单专员</label>--%>
<%--                                    <div class="layui-input-block">--%>
<%--                                        <select name="followerId" lay-filter='followerIdList_purchaseOrderDetail' lay-search>--%>
<%--                                        </select>--%>
<%--                                    </div>--%>
<%--                                </div>--%>

                                <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                    <%--<div class="fl ml20" title="根据sku的链接类型决定">--%>
                                        <%--<input name="orderType" type="checkbox" class="ml20" value="2" title="淘宝订单" disabled lay-skin="primary"/>--%>
                                    <%--</div>--%>
                                <%--</div>--%>
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
                                    <input type="text" class="layui-input" id="detailMoney_purOrderDetailList" autocomplete="off" placeholder="采购单价">
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
                                <table class="layui-table" id="purchaseOrderLogTab" lay-filter="purchaseOrderLogTab"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="skuSelectPop_purchaseOrder">
    <div class="p20">
        <div class="layui-card" id="productlistCard">
            <div class="layui-card-header">
                <span class="numCount">商品数量<span id="sSkuNum_purchaseOrder"></span></span>
                <span id="ifSelectStopSale" class="layui-btn layui-btn-sm">包含停售产品</span>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="skuSelectTab_purchaseOrder" lay-filter="skuSelectTab_purchaseOrder"></table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="purOrder_minPrice">
    <span onmouseenter="showTip(`{{d.purOrderMinPrice1688No || ''}}`, this)"
        onmouseleave="removeTip(this)" style="cursor: pointer;"
        class="canClickEl showSpan clcikRoutTo pora"
        data-routUrl="https://trade.1688.com/order/new_step_order_detail.htm?orderId={data}">
        <a style="display: none;">{{d.purOrderMinPrice1688No || ''}}</a>
        <span>{{d.purOrderMinPrice || ''}}</span>
    </span>
</script>

<script type="text/html" id="img_skuSelectPop_purchaseOrder">
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
</script>
<script type="text/javascript">
    var allRefundStatudEnum = ${aliRefundStatusEnums};
    var allRefundStatusJson = {}
    for (var i = 0; i < allRefundStatudEnum.length; ++i) {
        allRefundStatusJson[allRefundStatudEnum[i].type] = allRefundStatudEnum[i].name
    }
    function getAliRefundStatusName(type) {
        return allRefundStatusJson[type]
    }
</script>
<script type="text/html" id="orderNo_purchaseOrder">
    <div class="secondary">
        {{# if (d.orderType == 1) {}}
        「1688」
        {{# } }}
        {{# if (d.orderType == 2) {}}
        「淘宝」
        {{# } }}
    </div>
    <input type="hidden" class="purchaseOrderMainId" value="{{d.id}}">
    {{# if(d.speedLevel > 0) {}}
    <div class="speed_purchaseOrder"></div>
    {{# }}}
    <div style="text-align: center;color: grey;">
        {{# if (d.aliRefundStatus) {}}
        「退款: {{ getAliRefundStatusName(d.aliRefundStatus) }}」
        {{# }}}
    </div>
    <div style="text-align: left">
        <span style="color: grey;">采购: </span>
        <span class="pora copySpan">
            <a class="billNumber">{{d.billNumber}}</a>
        </span>
        <span onclick="layui.admin.onlyCopyTxt('{{d.billNumber}}')" style="z-index:200;vertical-align: middle;display: {{d.billNumber ? 'inline-block':'none'}}; cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
        </span>
    </div>

    <div style="text-align: left" class="doubleClickToSet"><span style="color: grey;">1688: </span>
        <span class="canClickEl showSpan clcikRoutTo pora copySpan" data-routUrl="https://trade.1688.com/order/new_step_order_detail.htm?orderId={data}">
            <a>{{d.ali1688OrderNo || ''}}</a>
        </span>
        <span onclick="layui.admin.onlyCopyTxt('{{d.ali1688OrderNo}}')" style="z-index:200;vertical-align: middle;display: {{d.ali1688OrderNo ? 'inline-block':'none'}}; cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
        </span>
        <input type="text" class="disN editInp" data-name="ali1688OrderNo" data-id="{{d.id}}">
        <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>
    </div>
    {{# if (d.tbOriginOrderNo) {}}
    <div style="text-align: left">
        <span style="color: grey;">淘宝货源主单号: </span>
        <span class="pora copySpan">
            <a class="tbOriginOrderNo">{{d.tbOriginOrderNo}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
        </span>
    </div>
    {{# } }}
    <div style="text-align: left" class="doubleClickToSet"><span style="color: grey;">物流: </span>
        <span class="canClickEl showSpan pora clcikRoutTo" data-routUrl="https://www.baidu.com/s?wd={data}"
        onmouseenter='purchaseOrder_queryLogistic(this,`{{JSON.stringify(d.goodsWarehousingList)}}`)' data-tipId="" onmouseleave="removeTip(this, 1000)">
           <a>{{d.logisticOrderNo || ''}}</a>
        </span>
        <span onclick="layui.admin.onlyCopyTxt('{{d.logisticOrderNo}}')" style="z-index:200;vertical-align: middle;display: {{d.logisticOrderNo ? 'inline-block':'none'}}; cursor:pointer">
         <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
         </span>
        <input type="text" class="disN editInp" placeholder="多物流单号以逗号隔开" data-name="logisticOrderNo" data-id="{{d.id}}">
        <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>
    </div>
</script>

<script type="text/html" id="purchaseOrder_hover_logistic">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="purchaseOrder_hover_logistic_table" lay-filter="purchaseOrder_hover_logistic_table"></table>
        </div>
    </div>
</script>

<script type="text/html" id="purchaseOrder_recieveItem">
    <span>{{d.consigneeName}} {{Format(d.collectgoodsTime || '',"yyyy-MM-dd hh:mm:ss")}}</span>
</script>

<script type="text/html" id="logisticFee_purchaseOrder">
    <div class="alignLeft freeClickBox">
        <div>
            <div class="doubleClickToSet">
                <div><span title="采购账号">「{{d.ali1688Acct}}」</span></div>
                <span style="color: grey;">物流费：</span>
                <span class="showSpan">{{(d.logisticFee != null && d.logisticFee != undefined) ? d.logisticFee : ''}}</span>
                <input type="text" class="disN editInp" data-name="logisticFee" data-id="{{d.id}}">
                <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" title="双击修改">&#xe642;</i>
            </div>
        </div>

        <div><span style="color: grey;">预付款：</span>{{d.prevPayMoney}}
            {{# if (d.actPayMoney) { }}
            &nbsp;「<span style="color: red" title="差额">{{accSub(d.prevPayMoney, d.actPayMoney)}}</span>」
            {{# } }}
        </div>
        <%--<div><span style="color: grey;">1688物流费：</span>{{d.ali1688LogisticFee || ''}}</div>--%>
        <div><span style="color: grey;">1688金额：</span>{{d.actPayMoney || ''}}</div>
        {{# if (d.ifRefund) {}}
        <div><span style="color: grey;">实退款金额：</span>{{d.aliReceiveRefund || ''}}</div>
        {{# } }}
    </div>
    {{# if (d.ali1688OrderStatus == 1 && d.payMsg) {}}
    <div><span style="color: red;" onmouseover="showTip(`{{d.payMsg}}`,this)" data-tipId="" onmouseout="removeTip(this,300)">「支付失败」</span></div>
    {{# } }}
</script>

<script type="text/html" id="responsor_purchaseOrder">
    <div class="alignLeft">
        <div><span style="color: grey;">采购：</span>{{d.buyer}}</div>
        <div><span style="color: grey;">制单：</span>{{d.creator}}</div>
        <div><span style="color: grey;">审核：</span>{{d.auditor || ''}}</div>
        <div><span style="color: grey;">跟单：</span>{{d.follower || ''}}</div>
    </div>
</script>

<script type="text/html" id="supplierBox_purchaseOrder">
    <div class="alignLeft supplierNameTabContains">
        <div><span style="color: grey;">供应商：</span>
            {{# if (d.supplierAliLoginId) {}}
                {{# if (d.orderType == 1) {}}
                <a class="supplierNameTabContains" target="_blank" href="http://amos.alicdn.com/getcid.aw?v=2&uid={{d.supplierAliLoginId}}&site=cnalichn&s=2&groupid=0&charset=utf-8"><img border="0" src="${ctx}/static/img/aliLogo.gif" title="联系卖家" /></a>
                {{#}}}
                {{# if (d.orderType == 2) {}}
                <a class="supplierNameTabContains" target="_blank" href="http://amos.alicdn.com/getcid.aw?v=2&uid={{d.supplierAliLoginId}}&site=cntaobao&s=2&groupid=0&charset=utf-8"><img border="0" src="${ctx}/static/img/aliLogo.gif" title="联系卖家" /></a>
                {{#}}}
            {{#}}}
            {{d.supplierName}}
            <span onclick="layui.admin.onlyCopyTxt('{{d.supplierName}}')" style="z-index:200;vertical-align: middle;display: {{d.supplierName ? 'inline-block':'none'}}; cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
        </div>
        <div><span style="color: grey;">卖家名：</span>{{d.ali1688SellerName || ''}}
            <span onclick="layui.admin.onlyCopyTxt('{{d.ali1688SellerName}}')" style="z-index:200;vertical-align: middle;display: {{d.ali1688SellerName ? 'inline-block':'none'}}; cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
        </div>
    </div>
</script>
<script type="text/html" id="purchaseConf_purchaseOrder">
    <div class="alignLeft">
        <div>
            <span>「{{d.storeName}}」</span>
            {{#  if(d.payType == 'alipay'){ }}
            <span class="hp-badge layui-bg-blue pointHand fr" title="支付宝支付">支</span>
            {{#  } }}
            {{#  if(d.payType == 'assureTrade'){ }}
            <span class="hp-badge layui-bg-orange pointHand fr" title="跨境宝支付">跨</span>
            {{#  } }}
            {{#  if(d.payType == 'creditBuy'){ }}
            <span class="hp-badge layui-bg-red pointHand fr" title="诚E赊">赊</span>
            {{#  } }}
            {{#  if(d.payType == 'period'){ }}
            <span class="hp-badge layui-bg-green pointHand fr" title="账期交易">账</span>
            {{#  } }}
        </div>
        <div><span style="color: grey;">预估运费：</span>{{d.predictLogisticFee != null ? d.predictLogisticFee : ''}}</div>
        <div><span style="color: grey;">sku种类：</span>{{d.totalSku}}</div>
        <div><span style="color: grey;">商品总数：</span>{{d.totalAmount}}</div>
    </div>

</script>



<script type="text/html" id="diffrence_purchaseOrder">
    {{# if (d.actPayMoney) { }}
    <div>{{accSub(d.prevPayMoney, d.actPayMoney)}}</div>
    {{# } }}
</script>

<script type="text/html" id="payAblepurchaseOrder">
    <div><input type="checkbox" lay-skin="primary" {{d.payAble==1 ? "checked" : ""}} disabled></div>
</script>

<script type="text/html" id="createAli1688OrderStatus_purchaseOrder">
    {{# if (d.createAli1688OrderStatus == 0){ }}<span style="color: orange">未创建</span>{{# }}} {{# if (d.createAli1688OrderStatus == 1){ }}<span style="color: grey">创建中</span>{{# }}} {{# if (d.createAli1688OrderStatus == 2){ }}<span style="color: limegreen">创建成功</span>{{#
    }}} {{# if (d.createAli1688OrderStatus == 3){ }}<span style="color: red" onmouseover="showTip(`{{d.createAli1688FailReason}}`,this)" data-tipId="" onmouseout="removeTip(this,300)">创建失败</span>{{# }}}
</script>

<script type="text/html" id="status_purchaseOrder">
    <div><span style="color: grey;">审核状态:</span> {{# if (d.auditStatus == 0){ }}未审核{{# }}} {{# if (d.auditStatus == 1){ }}已审核{{# }}} {{# if (d.auditStatus == 3){ }}废弃{{# }}}
    </div>
    <div><span style="color: grey;">是否可付:</span> {{# if (d.payAble == 0){ }}未标记{{# }}} {{# if (d.payAble == 1){ }}已标记{{# }}}
    </div>
</script>


<script type="text/html" id="notInStoreAmount_purchaseOrder">
    <div style="text-align: left">
        <div><span style="color: grey;">预到:</span>{{format(d.delivDay,'yyyy-MM-dd')}}</div>
        <div><span style="color: grey;">数量：</span>{{accSub(d.totalAmount, d.inAmount)}}</div>
        <div><span style="color: grey;">金额：</span>{{accSub(d.prevPayMoney,d.inMoney)}}</div>
    </div>
</script>


<script type="text/html" id="notInStoreMoney_purchaseOrder">
    {{# if (d.prevPayMoney) { }}
    <div>{{accSub(d.prevPayMoney, d.inMoney)}}</div>
    {{# } }}
</script>

<script type="text/html" id="purchaseOrderTable_bar">
    <div>
        <permTag:perm funcCode="update_purchaseOrder">
            <div class="layui-btn layui-btn-xs" lay-event="detail">订单详情</div>
        </permTag:perm>
    </div>
    {{#if (d.auditStatus == 0) { }}
    <div>
        <permTag:perm funcCode="disableOrder_purchaseOrder">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">订单作废</div>
        </permTag:perm>
    </div>
    {{# }else if (d.auditStatus == 1 && d.stockInStatus <=1 && !d.ifPullInvalid) { }} <div>
        <permTag:perm funcCode="createstockin_purchaseOrder">
            <div class="layui-btn layui-btn-xs layui-btn-primary" lay-event="createstockin">建入库单</div>
        </permTag:perm>
    </div>
    {{# } }}
    {{#if (d.auditStatus == 1) {}}
        {{#if (!d.ifPullInvalid){}}
            {{# if (d.refundStatus < 2) { }}
                <permTag:perm funcCode="refund_purchaseOrder">
                    <div>
                        <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="refund">申请退款</div>
                    </div>
                </permTag:perm>
                {{# if (d.refundStatus == 1) {}}
                    <permTag:perm funcCode="refund_purchaseOrder">
                        <div>
                            <div class="layui-btn layui-btn-xs" lay-event="cancelRefund">取消退款</div>
                        </div>
                    </permTag:perm>
                    <permTag:perm funcCode="confirmRefund_purchaseOrder">
                        <div>
                            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="confirmRefund" title="确认申请退款">确认申请</div>
                        </div>
                    </permTag:perm>
                {{# } }}
            {{# } }}
            {{# if (d.refundStatus == 2) { }}
                <permTag:perm funcCode="refund_purchaseOrder">
                    <div>
                        <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="refund">申请退款</div>
                    </div>
                </permTag:perm>
                <permTag:perm funcCode="refund_purchaseOrder">
                    <div>
                        <div class="layui-btn layui-btn-xs" lay-event="cancelRefund">取消退款</div>
                    </div>
                </permTag:perm>
            {{# } }}
            <permTag:perm funcCode="pullInvalid_purchaseOrder">
                <div>
                    <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="pullInvalid">订单归档</div>
                </div>
            </permTag:perm>
        {{# }}}
        {{#if (d.ifPullInvalid) {}}
        <permTag:perm funcCode="pullInvalidInfo_purchaseOrder">
            <div>
                <div class="layui-btn layui-btn-xs layui-btn-primary" lay-event="pullInvalidDetail">归档详情</div>
            </div>
        </permTag:perm>
        <permTag:perm funcCode="cancelpullInvalid_purchaseOrder">
            <div>
                <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="cancelPullInvalid">取消归档</div>
            </div>
        </permTag:perm>
        {{# }}}
        <permTag:perm funcCode="purchaseOrder_markAbNormal">
            <div>
                <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="markAbNormal">标记异常</div>
            </div>
        </permTag:perm>
    {{# }}}
    <permTag:perm funcCode="purchaseOrder_dealDiffSupplier">
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="dealDiffSupplier">供应商处理</div>
        </div>
    </permTag:perm>
</script>

<!-- 详情的保存按钮权限 -->
<script type="text/html" id="purchaseOrder_layerDetailSaveBtn">
  <permTag:perm funcCode="purchaseOrder_layerDetailSaveBtnPermTag"><span>保存</span></permTag:perm>
</script>

<script type="text/html" id="purchaseOrder_dealDiffSupplierLayer">
    <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form layui-clear" lay-filter="purchaseOrder_dealDiffSupplierForm" id="purchaseOrder_dealDiffSupplierForm" autocomplete="off">
                    <div class="layui-form-item">
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label">处理结果</label>
                            <div class="layui-input-block">
                                <input type="radio" value="1" name="diffSupplierDealMethod" title="不换供应商">
                                <input type="radio" value="2" name="diffSupplierDealMethod" title="换供应商-系统已存在">
                                <input type="radio" value="3" name="diffSupplierDealMethod" title="换供应商-系统未录入">
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                               <input type="text" name="diffSupplierRemark" class="layui-input">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="date_purchaseOrder">
    <div class="alignLeft">
        <div><span style="color: grey;">制单:</span>{{format(d.createTime,'yyyy-MM-dd')}}</div>
        <div><span style="color: grey;">可付:</span>{{format(d.payAbleTime,'yyyy-MM-dd')}}</div>
        <div><span style="color: grey;">审核:</span>{{format(d.auditTime,'yyyy-MM-dd')}}</div>
    </div>
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
<script type="text/html" id="buyerAmount_purOrderDetail">
    <div><input class="layui-input amountInp_purOrderDetail" value="{{d.amount}}" /></div>
</script>
<script type="text/html" id="originCost_purOrderDetail">
    <div><input class="layui-input originCostInp_purOrderDetail" value="{{d.originCost || d.purchaseCostPrice}}" /></div>
    <div>
        {{# if (d.waitChangePrice != null && d.waitChangePrice < (d.originCost || d.purchaseCostPrice)) {}}
        <span title="此sku在价格变动记录中未审核的（调整后商品报价+调整后供应商包装费）的最小值">待调整价: {{d.waitChangePrice}}</span>
        {{# } }}
    </div>
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
    < d.prodSupplierPurOrderDtoSet.length; i++) {}} 
    <div style="display: flex;justify-content:space-between">
        <a class="linkBox" target="_blank" href="{{d.prodSupplierPurOrderDtoSet[i].purchaseUrl}}">
            <div class="overContentEllipsis" style="max-width: 80px;text-align: left">{{d.prodSupplierPurOrderDtoSet[i].supplier}}</div>
            {{# if (d.prodSupplierPurOrderDtoSet[i].offerId && d.prodSupplierPurOrderDtoSet[i].specId != null) {}}
            <i class="layui-icon layui-icon-face-smile" style="font-size: 15px; color: cornflowerblue;" title="已经匹配1688信息:{{d.supplierRefDtoList[i].attrStr}}">&#xe6af;</i>
             {{#}}}
        </a>
        <div style="display: flex;align-items: center">
            {{# if (d.prodSupplierPurOrderDtoSet[i].isSystemProdSupplier == true) { }}
                <div class="system-tag" onmouseenter="showTip('SKU在系统中配置的供应商', this)" onmouseleave="removeTip(this)">系统</div>
            {{# } }}
            {{# if (d.prodSupplierPurOrderDtoSet[i].isHistProdSupplier == true) { }}
                <div class="buy-tag"  onmouseenter="showTip('近半年下过单的供应商', this)" onmouseleave="removeTip(this)">买过</div>
            {{# } }}
        </div>
    </div>
    {{# }}}
</script>
<script type="text/html" id="purOrder_oldLowestPriceBox">
    <a href="{{d.sameProductUrl || 'javascript;'}}" target="_blank" class="canClickEl">{{d.sameProductLowestPrice || ''}}</a>
</script>

<!-- 采购订单的table的供应商包装 列 -->
<script type="text/html" id="ifSupplierPack_purOrderDetail">
    {{#  if(d.ifSupplierPack){ }}
    <div><input type="checkbox" {{d.ifSupplierPack ? 'checked' : ''}} disabled lay-skin="primary"> </div>
    {{#  } }}
    {{#  if(d.supplierPackFee || d.supplierPackFee === 0){ }}
    <span>费用(￥): {{d.supplierPackFee }}</span>
    {{#  } }}
</script>

<!-- 采购订单的table的供应商包装费用(￥) 列 -->
<%--<script type="text/html" id="supplierPackFee_purOrderDetail">--%>
    <%--{{# if(d.supplierRefDtoList.length){ }}--%>
        <%--{{#   layui.each(d.supplierRefDtoList,function(index,item){ }}--%>
            <%--{{#  if(item.supplierId == d.supplierId && item.supplierPackFee != undefined){ }}--%>
                <%--<div>{{item.supplierPackFee}}</div>--%>
            <%--{{#  } }}--%>
        <%--{{#  }) }}--%>
    <%--{{#  } }}--%>
    <%--{{#   layui.each(d.supplierRefDtoList,function(index,item){ }}--%>
            <%--{{#  if(!!item.ifDefault && item.supplierPackFee != undefined){ }}--%>
                <%--<div>{{item.supplierPackFee}}</div>--%>
            <%--{{#  } }}--%>
        <%--{{#  }) }}--%>
<%--</script>--%>

<script type="text/html" id="updateListPop_purchaseOrder">
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
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">付款方式</label>
                                <div class="layui-input-block">
                                    <select name="payType">
                                        <option value=""></option>
                                        <c:forEach items="${payTypeList}" var="payType">
                                            <option value="${payType.code}">${payType.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <!-- 订单状态在“未审核”和“已审核”的时候可以批量操作。  审核状态   0 未审核  1 审核通过  3废弃 -->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">内部标签</label>
                                <div class="layui-input-block layui-form">
                                    <select name="note" data-name="note" xm-select="note_purchaseOrder_AddForm" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='note_purchaseOrder_AddForm'>
                                        <option></option>
                                        <c:forEach items="${purInsideTagList}" var="purInsideTag">
                                            <option value="${purInsideTag.code}">${purInsideTag.name}</option>
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

<script type="text/html" id="multiPayUrl_purchaseOrder">
    <div class="m_20">
        <table class="layui-table" id="multiPayUrlTable_purchaseOrder" lay-filter="multiPayUrlTable_purchaseOrder"></table>
    </div>
</script>
<script type="text/html" id="multiPayUrlTable_purchaseOrder_bar">
    <div>
        {{# if (d.orderType === '淘宝订单') { }}
            <div class="layui-btn layui-btn-xs" lay-event="confirmPay" title="将通过系统自动进行付款，无须跳转链接">确认付款</div>
        {{# } }}
    </div>
</script>

<script type="text/html" id="daylysSales_purchaseOrder">
    <div>{{d.fiveSalesNum || 0}} / {{d.fifteenSalesNum || 0}} / {{d.thirtySalesNum || 0}}</div>
</script>

<script type="text/html" id="title_purOrder_subDetailList">
    <%--<div class="copySpan">--%>
                    <%--<span>--%>
            <%--<a class="overContentEllipsis trLineBox" title="{{d.title + (d.packDesc ? ('(' + d.packDesc + ')') : '')}}">{{d.title}}</a>--%>
            <%--<button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>--%>
        <%--</span>--%>
    <%--</div>--%>
    <div class="alignLeft">
    <div class="copySpan">
    <span>商品名称:</span>
        <span>
            <a >{{d.title + (d.packDesc ? ('(' + d.packDesc + ')') : '')}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
        </span>
    </div>
    <div><span>开发专员:<span> {{d.bizzOwner || ''}}</span></div>
    </div>
</script>

<script type="text/html" id="purOrder_skuAndStockLocation">
    <div class="alignLeft">
        <div style="cursor: pointer">SKU: 
            <span name="prodSku" onclick="showSaleOrderInfo(this)" data-id="{{d.id}}" style="color: cornflowerblue">
                {{d.sSku || ''}}
            </span>
            <span onclick="layui.admin.onlyCopyTxt('{{d.sSku}}')" style="z-index:200;vertical-align: middle;display: {{d.sSku ? 'inline-block':'none'}}; cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
        </div>
        <div>库位: {{d.stockLocation || ''}}</div>
        {{# if(d.prodTag) { }}
            {{# layui.each(d.prodTag?.split(',') || [],function(index,item){ }}
                <span class="prod_tag">{{item || ''}}</span>
            {{# }) }}
        {{#} }}
    </div>
    {{# if(d.failMsg) {}}
    <div class="purchaseOrder_failCreate1688" title="{{d.failMsg}}"></div>
    {{# }}}
</script>

<script type="text/html" id="purOrder_bizzOwnerAndTitle">
    <div class="alignLeft">
        <div>商品名称: {{d.title || ''}}</div>
        <div>开发专员: {{d.bizzOwner || ''}}</div>
    </div>
</script>

<script type="text/html" id="purchaseorder_scanInfoTpl">
    <div class='overContentEllipsis4' title="{{d.scanInfo || ''}}" >{{d.scanInfo || ''}}</div>
</script>

<%--导出采购订单--%>
<script type="text/html" id="purchaseOrder_exportPurMainInfoPop">
    <form class="layui-form"  id="exportPurMainInfoForm_purchaseOrder" lay-filter="exportPurMainInfoForm_purchaseOrder">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_exportPurMainInfo_purchaseOrder"></div>
        <div class="p20">
            <div class="layui-tab layui-tab-card">
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">基本信息</legend>
                        </fieldset>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" title="采购单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购账号" title="采购账号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="地址id" title="地址id" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购部门" title="采购部门" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购员" title="采购员" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="仓库" title="仓库" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="支付方式" title="支付方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购备注" title="采购备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="买家留言" title="买家留言" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="仓库备注" title="仓库备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="内部便签" title="内部便签" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="供应商" title="供应商" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核人" title="审核人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核状态" title="审核状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核时间" title="审核时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="概览信息" title="概览信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="预估运费(¥)" title="预估运费(¥)" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="sku种类" title="sku种类" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="货物总数量" title="货物总数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="货物总金额" title="货物总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="减免金额" title="减免金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="已入库数" title="已入库数" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="已入库金额" title="已入库金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="到货日期" title="到货日期" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="预付款" title="预付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="实付款" title="实付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流渠道" title="物流渠道" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流单号" title="物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流费用" title="物流费用" lay-skin="primary"></div>
                        <%--<div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流状态" title="物流状态" lay-skin="primary"></div>--%>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流信息" title="物流信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="阿里卖家名称" title="阿里卖家名称" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688单号" title="1688单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688订单状态" title="1688订单状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688退款状态" title="1688退款状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688退款金额" title="1688退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否可付" title="是否可付" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="可付时间" title="可付时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="摊分方式" title="摊分方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="创建人" title="创建人" lay-skin="primary"></div>
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
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="发货时间" title="发货时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="完成时间" title="完成时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="异常订单" title="异常订单" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="处理供应商结果" title="处理供应商结果" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="处理供应商备注" title="处理供应商备注" lay-skin="primary"></div>
                        <div style="clear:left"></div>

                    </div>
                </div>
            </div>
        </div>
    </form>

</script>

<%--导出订单详情--%>
<script type="text/html" id="purchaseOrder_exportPurDetailInfoPop">
    <form class="layui-form" id="exportPurDetailInfoForm_purchaseOrder" lay-filter="exportPurDetailInfoForm_purchaseOrder">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_exportPurDetailInfo_purchaseOrder"></div>

        <div class="p20">
            <div class="layui-tab layui-tab-card">
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">

                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">子表信息</legend>
                        </fieldset>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" title="子SKU" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="图片" title="图片" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="商品名称" title="商品名称" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="款式" title="款式" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="父SKU" title="父SKU" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="有效匹配1688" title="有效匹配1688  " lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="无税单价" title="无税单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="税率" title="税率" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="单商品税金" title="单商品税金" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="含税单价" title="含税单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购数量" title="采购数量" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="总金额(不含税)" title="总金额(不含税)" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="含税总金额" title="含税总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="最低采购单价" title="最低采购单价" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="纯商品成本" title="纯商品成本" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="已入库数量" title="已入库数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="未入库数量" title="未入库数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="不良品数量" title="不良品数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="不良品原因" title="不良品原因" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="下单备注" title="下单备注" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="累计净重(g)" title="累计净重(g)" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否供应商包装" title="是否供应商包装" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="供应商包装费" title="供应商包装费" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="仓库包装费" title="仓库包装费" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="库位" title="库位" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="货号" title="货号" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否新品采样" title="是否新品采样" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="近一年最低采购成本价" title="近一年最低采购成本价" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">主表信息</legend>
                        </fieldset>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" title="采购单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购账号" title="采购账号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="地址id" title="地址id" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购部门" title="采购部门" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购员" title="采购员" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="仓库" title="仓库" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="支付方式" title="支付方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="采购备注" title="采购备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="买家留言" title="买家留言" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="仓库备注" title="仓库备注" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="内部便签" title="内部便签" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="供应商" title="供应商" checked lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核人" title="审核人" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核状态" title="审核状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="审核时间" title="审核时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="概览信息" title="概览信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="预估运费(¥)" title="预估运费(¥)" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="sku种类" title="sku种类" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="货物总数量" title="货物总数量" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="货物总金额" title="货物总金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="减免金额" title="减免金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="已入库数" title="已入库数" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="已入库金额" title="已入库金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="到货日期" title="到货日期" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="预付款" title="预付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="实付款" title="实付款" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流渠道" title="物流渠道" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流单号" title="物流单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流费用" title="物流费用" lay-skin="primary"></div>
                        <%--<div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流状态" title="物流状态" lay-skin="primary"></div>--%>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="物流信息" title="物流信息" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="阿里卖家名称" title="阿里卖家名称" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688单号" title="1688单号" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688订单状态" title="1688订单状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688退款状态" title="1688退款状态" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="1688退款金额" title="1688退款金额" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="是否可付" title="是否可付" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="可付时间" title="可付时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="摊分方式" title="摊分方式" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="创建人" title="创建人" lay-skin="primary"></div>
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
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="发货时间" title="发货时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="完成时间" title="完成时间" lay-skin="primary"></div>
                        <div class="fieldBox_purchaseOrder"><input type="checkbox" name="baseField" value="异常订单" title="异常订单" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="deailPop_purchaseOrder">
    <table class="layui-table" id="deailShowTable_purchaseOrder" lay-filter="deailShowTable_purchaseOrder" style="margin-top: 0"></table>
</script>

<script type="text/html" id="purchaseOrder_disablePurOrderLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-card-body">
                <div class="layui-tab-content">
                    <form class="layui-form" id="purchaseOrder_disablePurOrderForm" lay-filter="purchaseOrder_disablePurOrderForm">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-block">
                            <input type="text" name="memo" class="layui-input" placeholder="该备注将替换采购备注" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="refundRequirePop_purchaseOrder">
    <div class="layui-tab layui-tab-card">
        <div class="layui-card-body">
            <div class="layui-tab-content">
                <div class="layui-form-item">
                    <div class="secondary  layui-col-lg9 layui-col-md9" style="font-size: 10px;line-height: 15px">
                        <p id="refundTips">tips：未发货的订单，只能按原订单金额退款</p>
                        <p style="padding-left: 35px">每款产品的退款金额不得大于实付金额。其余额外费用可计入退款运费金额</p>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        运费:<span id="refundRequirePop_purchaseOrder_logisticsFeeSpan"></span>
                    </div>
                </div>

                <form class="layui-form" id="refundRequireForm" lay-filter="refundRequireForm">
                    <div class="layui-form-item">
                        <div class="layui-col-lg4 layui-col-md4" notNull>
                            <label class="layui-form-label">退款原因</label>
                            <div class="layui-input-block">
                                <select name="refundReason" lay-search lay-filter="refundReason">
                                    <option value=""></option>
                                    <c:forEach items="${refundReasonList}" var="refundReason">
                                        <option value="${refundReason.name}">${refundReason.name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">退款物流单号</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundLogisticNo" class="layui-input" />
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundRemark" class="layui-input" />
                            </div>
                        </div>
                        <%--<input type="hidden" name="requireRefund" class="layui-input" />--%>
                        <%--<input type="hidden" name="refundAmout" class="layui-input" />--%>
                    </div>
                    <div class="layui-form-item purchaseOrder_refundDetailTableWrap">
                        <table class="layui-table" id="purchaseOrder_refundDetailTable" lay-filter="purchaseOrder_refundDetailTable"></table>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">退款服务</label>
                            <div class="layui-input-block">
                                <select name="refund" lay-search lay-filter="refundService" id="refundService">
                                    <option value=""></option>
                                    <option value="仅退款">退款</option>
                                    <!-- <option value="退货退款">退货退款</option> -->
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">货品情况</label>
                            <div class="layui-input-block">
                                <select name="goodsStatus" lay-search lay-filter="goodsStatus" id="goodsStatus">
                                    <option value=""></option>
                                    <option value="已收到全部(部分)商品">已收到全部（部分）商品</option>
                                    <option value="没有收到货品">没有收到货品</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">平台退款原因</label>
                            <div class="layui-input-block">
                                <select name="platRefundReason" lay-filter="purchaseOrderrefundReason" id="purchaseOrderrefundReason">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">退款货品金额</label>
                            <div class="layui-input-block">
                                <input type="text" id="applyRefundMoney" name="refundMoney" disabled class="layui-input disAbleInp">
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label class="layui-form-label">退款运费金额</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundLogisticFee" class="layui-input">
                            </div>
                        </div>

                        <!-- <div class="layui-col-lg4 layui-col-md4 refundInfo" style="display: none;">
                            <label class="layui-form-label">退货地址</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundAmount" disabled class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4 refundInfo" style="display: none;">
                            <label class="layui-form-label">退货方式</label>
                            <div class="layui-input-block">
                                <input type="text" name="refundAmount" class="layui-input">
                            </div>
                        </div> -->
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-lg12 layui-col-md12">
                            <label class="layui-form-label">退款说明</label>
                            <div class="layui-input-block">
                                <textarea class="layui-textarea" name="refundDeclare" placeholder="如需申请1688/淘宝退款，需填写该项"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="pullInvalidPop_purchaseOrder">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-card-body">
                <div class="layui-tab-content">
                    <form class="layui-form" id="pullInvalidForm" lay-filter="pullInvalidForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">退款原因</label>
                                <div class="layui-input-block">
                                    <input name="refundReason" class="layui-input gredBack" disabled/>
                                </div>
                            </div>

                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">退款物流单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="refundLogisticNo" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">退款备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="refundRemark" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">实退金额(￥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="aliReceiveRefund" class="layui-input gredBack" disabled/>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4" notNull>
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
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">归档备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="pullInvalidRemark" class="layui-input" />
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <!-- <div class="layui-form-item">
                                <table class="layui-table" id="purchaseOrder_refundDetailTable" lay-filter="purchaseOrder_refundDetailTable"></table>
                            </div> -->
                            <table class="layui-table" id="purchaseOrder_refundDetailTableForPullInvalid" lay-filter="purchaseOrder_refundDetailTableForPullInvalid"></table>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="purchaseOrder_updateCreditRemainPop">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-card-body">
                <div class="layui-tab-content">
                    <form class="layui-form" id="purchaseOrder_updateCreditRemainForm" lay-filter="purchaseOrder_updateCreditRemainForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg6 layui-col-md6">
                                <label class="layui-form-label">诚E赊余额</label>
                                <div class="layui-input-block">
                                    <input name="remain" class="layui-input"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="purchaseOrder_changeStorePop">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-card-body">
                <div class="layui-tab-content">
                    <form class="layui-form" id="purchaseOrder_changeStoreForm" lay-filter="purchaseOrder_changeStoreForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">转入仓库</label>
                                <div class="layui-input-block">
                                    <select name="toStoreId">
                                        <option value=""></option>
                                        <c:forEach items="${wareHouseList}" var="store">
                                            <c:if test="${store.warehouseName == '昆山仓' ||store.warehouseName == '义乌仓'}">
                                                <option value="${store.id}">${store.warehouseName}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg12 layui-col-md12">
                                <label class="layui-form-label">采购订单</label>
                                <div class="layui-input-block">
                                    <textarea class="layui-textarea" name="billNumberList" placeholder="多个用逗号隔开"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script id="purchaseOrder_mergeOrderPop" type="text/html">
     <form class="layui-form" id="purchaseOrder_mergeOrderPop_searchForm" autocomplete="off">
         <div class="layui-form-item mt10">
             <div class="layui-col-md2 layui-col-lg2">
                 <label class="layui-form-label">采购员</label>
                 <div class="layui-input-block">
                     <select name="buyerId" xm-select="buyer_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                         <option value=""></option>
                         <c:forEach items="${buyers}" var="buyer">
                             <option value="${buyer.id}">${buyer.userName}</option>
                         </c:forEach>
                     </select>
                 </div>
             </div>
             <div class="layui-col-md2 layui-col-lg2">
                 <label class="layui-form-label">制单日期</label>
                 <div class="layui-input-block">
                     <input name="times" id="purchaseOrder_mergeOrderPop_times" type="text" class="layui-input" readonly />
                 </div>
             </div>
             <div class="layui-col-md2 layui-col-lg2">
                 <label class="layui-form-label">仓库</label>
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
                 <label class="layui-form-label">是否可付</label>
                 <div class="layui-input-block">
                     <select name="payAble">
                         <option value=""></option>
                         <option value="true">可付</option>
                         <option value="false">不可付</option>
                     </select>
                 </div>
             </div>
             <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">制单人员</label>
                <div class="layui-input-block">
                    <select name="creatorId" xm-select="creator_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                    </select>
                </div>
            </div>
             <div class="layui-col-md1 layui-col-lg1 ml10">
                 <a id="searchBtn_purchaseOrder_mergeOrderPop" class="layui-btn layui-btn-sm" type="button">查询</a>
             </div>
          </div>
      </form>
      <button class="layui-btn layui-btn-sm" id="purchaseOrder_batchMergeOrderBtn">合并采购单</button>
      <div class="layui-card">
          <div class="layui-card-body">
              <table class="layui-table" id="purchaseOrder_mergeOrderTable" lay-filter="purchaseOrder_mergeOrderTable"></table>
          </div>
      </div>
    </script>


<script id="purchaseOrder_saleOrderPop" type="text/html">
    <table class="layui-table">
        <thead>
        <tr>
            <th>序号</th>
            <th>订单号</th>
            <th>平台</th>
            <th>购买数量</th>
            <th>售价</th>
            <th>运费(￥)</th>
            <th>毛利(￥)</th>
            <th>店铺销售</th>
            <th>预估重量</th>
            <th>称重重量</th>
            <th>创建时间</th>
            <th>订单时间</th>
            <th>发货时间</th>
            <th>状态</th>
        </tr>
        </thead>
        <tbody id="saleOrderTbale_subTbody">
        </tbody>
      </table>
</script>
<script type="text/html" id="saleOrder_subTableLayer">
    {{# layui.each(d, function(index, item) { }}
        <tr>
            <td name="index">{{ saleDetailStartIndex + index + 1}}</td>
            <td name="id">{{ item.id}}</td>
            <td name="platCode">{{ item.plat_code}}</td>
            <td name="prodQuantity">{{ item.prod_quantity}}</td>
            <td name="platUnitPrice"><span style="color:gray">{{item.currency || ''}}</span>{{ item.plat_order_detail_amt}}</td>
            <td name="shippingCost">{{ item.shipping_cost}}</td>
            <td name="profit">{{ item.profit}}</td>
            <td name="salesperson">{{ item.salesperson}}</td>
            <td name="preWeight">{{ item.pre_weight}}</td>
            <td name="realWeight">{{ item.real_weight}}</td>
            <td name="createTime">
                <div>{{ Format(item.create_time,"yyyy-MM-dd hh:mm:ss")}}</div>
            </td>
            <td name="orderTimeCn">
                <div>{{ Format(item.order_time_cn,"yyyy-MM-dd hh:mm:ss")}}</div>
            </td>
            <td name="shippingTime">
                <div>{{ Format(item.shipping_time,"yyyy-MM-dd hh:mm:ss")}}</div>
            </td>
            <td name="processStatusCn" class="blueBtnBg">{{ item.process_status_cn}}</td>
        </tr>
    {{#}) }}
  </script>
<script id="purchaseOrder_markAbNormalPop" type="text/html">
    <form class="layui-form" id="purchaseOrder_markAbNormalForm" lay-filter="purchaseOrder_markAbNormalForm">
        <div class="layui-tab layui-tab-card">
            <div class="layui-form-item">
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">处理结果</label>
                    <div class="layui-input-block">
                        <input type="radio" class="layui-radio" name="ifNormal" value="false" title="标记异常">
                        <input type="radio" class="layui-radio" name="ifNormal" value="true" title="取消标记">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">采购备注</label>
                    <div class="layui-input-block">
                        <textarea class="layui-textarea" name="memo"> </textarea>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="purchaseOrder_diffSupplierResult">
    {{#if (d.assistInfo) {}}
    <div>

            {{#if (d.assistInfo.diffSupplierDealMethod == 1) {}}
        不换供应商
            {{# } }}
            {{#if (d.assistInfo.diffSupplierDealMethod == 2) {}}
        换供应商-系统已存在
            {{# } }}
            {{#if (d.assistInfo.diffSupplierDealMethod == 3) {}}
        换供应商- 系统未录入
            {{# } }}

    </div>
    <div>
        {{d.assistInfo.diffSupplierRemark}}
    </div>
    {{# } }}
</script>

<%@ include file="/WEB-INF/view/jsp/purchases/purchases/createStockInOrder.jsp"%>
<script type="text/javascript" src="${ctx}/static/js/purchases/purchaseorder.js"></script>
<style type="text/css">
    .gredBack {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .fieldBox_purchaseOrder {
        float: left;
        width: 20%;
        height: 25px;
    }

    .trLineBox {
        float: left;
        width: 100%;
        height: 50px;
    }

    .followRemarkBox{
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
</style>

<script id="purchaseOrder_articleNo" type="text/html">
    <div>{{d.articleNo || ''}}</div>
    {{# if (d.ifMatchRepeat) { }}
        <span class="prod_tag">重复</span>
    {{# } }}
    <br>
    {{# if (d.ifNewSampling) { }}
        <span class="prod_tag">新品</span>
    {{# } }}

</script>
