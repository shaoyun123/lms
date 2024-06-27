<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
<title>账号管理</title>
<style lang="en">
    .label_reset {
        padding: 0 10px !important;
    }
    /*第二层表格样式*/
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"],
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList{
        padding: 0
    }
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"]>table>tbody>tr>td:first-child,
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList table tr>td:first-child
    {
        border-left: none;
    }
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"]>table>tbody>tr>td:last-child,
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList table tr>td:last-child
    {
        border-right: none;
    }
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"]>table>tbody>tr:first-child>td,
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList table tr:first-child>td {
        border-top:none;
    }
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"]>table>tbody>tr:last-child>td,
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList table tr:last-child>td  {
        border-bottom:none;
    }
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"]>table>tbody>tr>td,
    #LAY-financial-paypal-accountManage #accountManage_tbody td[colspan="3"] td.acctM_storeAcctList table tr>td {
        border-left: none;
        border-right: none
    }
</style>
<div class="layui-fluid" id="LAY-financial-paypal-accountManage">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row" id="FORM--paypal-accountManage">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="component-form-group" name="searchForm_accountManage">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">paypal账号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="paypalEmailStr" class="layui-input" placeholder="多个以,隔开">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">公司</label>
                                    <div class="layui-input-block">
                                        <select name="belongsCompanyStr" xm-select="belongsCompany_accountManage" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='belongsCompany_accountManage'>
                                            <option value=""></option>
                                            <c:forEach items="${companyList}" var="company">
                                                <option value="${company.name}">${company.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">状态</label>
                                    <div class="layui-input-block">
                                        <select name="status">
                                            <option value="">全部</option>
                                            <option value="1">可用</option>
                                            <option value="0">停用</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">授权状态</label>
                                    <div class="layui-input-block">
                                        <select name="authStatus" lay-verify="required" lay-filter="aihao">
                                            <option value="">全部</option>
                                            <option value="1">已授权</option>
                                            <option value="0">未授权</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">可否打款</label>
                                    <div class="layui-input-block">
                                        <select name="ifPayAble" lay-verify="required" lay-filter="aihao">
                                            <option value="">全部</option>
                                            <option value="1">可打款</option>
                                            <option value="0">不可打款</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">备注(模糊)</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="note" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">ebay店铺</label>
                                    <div class="layui-input-block">
                                        <select name="ebayStoreIdStr" xm-select="ebayStoreId_accountManage" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='ebayStoreId_accountManage'>
                                            <option></option>
                                            <c:forEach items="${ebayStoreList}" var="ebayStore">
                                                <option value="${ebayStore.id}">${ebayStore.storeAcct}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">负责人</label>
                                    <div class="layui-input-block">
                                        <select name="responsorIdStr" xm-select="responsorId_accountManage" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='responsorId_accountManage'>
                                            <option></option>
                                            <c:forEach items="${paypalResponsorList}" var="responsor">
                                                <option value="${responsor.id}">${responsor.userName}${responsor.status ? '' : '(已离职)'}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">账号类型</label>
                                    <div class="layui-input-block">
                                        <select name="typeStr" xm-select="type_accountManage" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='type_accountManage'>
                                            <option></option>
                                            <c:forEach items="${paypalAcctTypeList}" var="typeEnum">
                                                <option value="${typeEnum.code}">${typeEnum.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label label_reset">
                                        <select name="timeType" class="hiddenContent">
                                            <option value="1">备注更新时间</option>
                                            <option value="2">日志更新时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input name="timeStr" type="text" readonly class="layui-input" id="noteUpdateTime_accountManage">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <select name="ebayStoreStatus">
                                            <option value="">ebay店铺状态</option>
                                            <option value="0">被禁用</option>
                                            <option value="1">未禁用</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <input type="checkbox" name="ifLimitOver180" lay-skin="primary" value="true" title="限制超180天">
                                    </div>
                                </div>
                                <input type="hidden" name="orderByType">
                                <input type="hidden" name="orderByFiled">
                                <input type="hidden" name="acctStatus">
                                <div class="layui-col-lg2 layui-col-md2" style="padding: 0 20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" id="searchPaypalBtn_accM" type="button">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_account">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card" id="accountManageCard">
                <div class="layui-card-header" id="LAY-paypal-accountManage">
                    <div>
                        <div style="float:left;">
                            <ul class="layui-tab-title fl" id="statusIcon_paypalAccountManage">
                                <li class="layui-this" data-code="" onclick="queryByIcon_paypalAccountManage(this)">全部(<span></span>)</li>
                        <c:forEach items="${paypalAcctStatusList}" var="acctStatus">
                            <li data-code="${acctStatus.code}" onclick="queryByIcon_paypalAccountManage(this)">${acctStatus.name}(<span></span>)</li>
                        </c:forEach>
                            </ul>
                        </div>
                    </div>


                    <%--<button class="layui-btn-sm layui-btn ml20" id="updateBalanceByListBtn" type="button">批量更新余额</button>--%>
                    <%--<button class="layui-btn-sm layui-btn" id="SyncDisputeByListBtn" type="button">批量同步纠纷</button>--%>
                    <%--<permTag:perm funcCode="updateByExcel_productlist">--%>

                    <%--</permTag:perm>--%>
                    <permTag:perm funcCode="sendEmail_paypalAccountManage">
                        <button class="layui-btn-sm layui-btn" id="sendEmail_paypalAccountManage" type="button">发送邮件</button>
                    </permTag:perm>
                    <div class="fr" style="z-index: 20200305;position: relative; margin: 6px 10px;">
                        <div class="btnSelect_hp fl" style="width: 68px;margin-top: 7px;margin-right: 15px;">
                            <div class="title_btnSelect">批量操作</div>
                            <div class="optionBox_btnSelect">
                                <div class="optionCanvas_btnSelect">
                                    <div class="option_btnSelect" id="updateBalanceByListBtn" type="button">更新余额</div>
                                    <div class="option_btnSelect" id="SyncDisputeByListBtn" type="button">同步纠纷</div>
                                    <div class="option_btnSelect" id="ableStatusByListBtn" type="button">启用</div>
                                    <div class="option_btnSelect" id="disableStatusByListBtn" type="button">停用</div>
                                    <permTag:perm funcCode="setAcctPayAble">
                                    <div class="option_btnSelect" id="payableByListBtn" type="button">可付</div>
                                    <div class="option_btnSelect" id="disPayableByListBtn" type="button">不可付</div>
                                    </permTag:perm>
                                    <permTag:perm funcCode="delPaypalBtn">
                                        <div class="option_btnSelect" id="deleteByListBtn" type="button">删除</div>
                                    </permTag:perm>
                                    <div class="option_btnSelect" id="updatePaypalStatusByListBtn" type="button">修改状态</div>
                                    <div class="option_btnSelect" id="setEbayStoreVacation" type="button">店铺休假</div>
                                    <div class="option_btnSelect" id="overEbayStoreVacation" type="button">结束休假</div>
                                    <div class="option_btnSelect" id="addMoreNote_accountManage" type="button">备追加注</div>
                                </div>
                            </div>
                        </div>
                        <button class="layui-btn-sm layui-btn" id="export_paypalAccountManage" type="button">导出</button>
                        <button class="layui-btn-sm layui-btn" id="add_paypal" type="button">
                            新增paypal
                        </button>
                        <button class="layui-btn-sm layui-btn" id="downLoadTemplat_paypalAccountManage" type="button">
                            下载模板
                        </button>
                        <button class="layui-btn-sm layui-btn layui-btn-danger" id="updateRemainAmtByExcelBtn_paypalAccountManage" type="button">
                            导入修改
                        </button>
                        <input name="updateRemainAmtByExcel" id="updateRemainAmtByExcel_file" type="file" hidden>
                    </div>
                </div>
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 laui-col-md12">
                        <div class="accountManage_table_head layui-table-header">
                            <table class="layui-table" id="table_accountManage" lay-filter="table_accountManage"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--新增账号弹框-->
<script type="text/html" id="add_paypal_layer">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" action="" lay-filter="component-form-element" name="addOrEditPaypalAcctForm">
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">paypal邮箱：</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">所属公司：</label>
                <div class="layui-input-block">
                    <select name="belongsCompany">
                        <c:forEach items="${companyList}" var="company">
                            <option value="${company.name}">${company.name}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">账号类型：</label>
                <div class="layui-input-block">
                    <select name="type">
                        <option></option>
                        <c:forEach items="${paypalAcctTypeList}" var="typeEnum">
                            <option value="${typeEnum.code}">${typeEnum.name}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">负责人：</label>
                <div class="layui-input-block">
                    <select name="responsorId">
                        <option></option>
                        <c:forEach items="${paypalResponsorList}" var="responsor">
                            <c:if test="${responsor.status}">
                                <option value="${responsor.id}">${responsor.userName}</option>
                            </c:if>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">银行卡号 </label>
                <div class="layui-input-block">
                    <input name="bankNo" class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <textarea name="note" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<%--修改ebay店铺弹窗--%>
<script type="text/html" id="update_store_layer">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form name="editStoreForm" class="layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">paypal邮箱</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">ebay账号</label>
                <div class="layui-input-block">
                    <select xm-select="accM_select" xm-select-type="2" xm-select-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">日志备注</label>
                <div class="layui-input-block">
                    <textarea name="logRemark" placeholder="请输入" class="layui-textarea"></textarea>
                </div>
            </div>
            <%--<div class="layui-form-item">--%>
            <%--<div class="layui-input-block">--%>
            <%--<button type="button" class="layui-btn">保存</button>--%>
            <%--</div>--%>
            <%--</div>--%>
        </form>
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
            <legend>操作日志</legend>
        </fieldset>
        <div style="padding-left:20px">
            <table class="layui-table" id="storeOperLogTab">
            </table>
        </div>
    </div>
</script>
<%--修改ebay站点弹窗--%>
<script type="text/html" id="update_site_layer">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form name="storeSiteForm" class="layui-form" lay-filter="storeSiteForm">
            <div class="layui-form-item">
                <label class="layui-form-label">paypal邮箱</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalAcct"  class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">ebay账号</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="storeAcct">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">站点(多个之间用逗号隔开)</label>
                <div class="layui-input-block">
                    <input type="checkbox" name="storeSite" title="美国" value="0">
                    <input type="checkbox" name="storeSite" title="加拿大" value="2" >
                    <input type="checkbox" name="storeSite" title="英国" value="3">
                    <input type="checkbox" name="storeSite" title="澳大利亚" value="15">
                    <input type="checkbox" name="storeSite" title="法国" value="71">
                    <input type="checkbox" name="storeSite" title="德国" value="77">
                    <input type="checkbox" name="storeSite" title="ebay汽车" value="100">
                    <input type="checkbox" name="storeSite" title="西班牙" value="186">
                    <%--<input type="checkbox" title="爱尔兰海外仓" value="-1">--%>
                </div>
            </div>

        </form>
    </div>
</script>
<%--授权弹窗--%>
<script id="auth_paypal_pop" type="text/html">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form id="authPaypalForm" class="layui-form">
            <div class="layui-form-item">
                <p>获取密钥的步骤:</p>
                <p>一、进入网址&nbsp&nbsp<a style="cursor: pointer;color: blueviolet" onclick="window.open('https://www.paypal.com/signin?returnUri=https%3A%2F%2Fdeveloper.paypal.com%2Fdeveloper%2Fapplications','_blank')" >https://www.paypal.com/signin?returnUri=https%3A%2F%2Fdeveloper.paypal.com%2Fdeveloper%2Fapplications</a></p>
                <p>二、输入账号密码登录</p>
                <p>三、检查是否已经创建REST API apps,如果有,则选择1个进入，直接获得clientId和secret.跳过四、五、六步骤</p>
                <p>四、点击Generate Live Access Token</p>
                <p>五、点击Generate Credential</p>
                <p>六、找到当前页面下的REST API apps, 点击其下方Create App，创建一个App</p>
                <p>七、查看 client ID 和secret，复制填入下面的输入框中</p>
            </div>
            <input type="hidden" name="paypalAcctId">
            <div class="layui-form-item">
                <label class="layui-form-label">paypal账号</label>
                <div class="layui-input-block">
                    <input name="paypalAcct" class="layui-input" readonly>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">client ID</label>
                <div class="layui-input-block">
                    <input name="client_id" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">secret</label>
                <div class="layui-input-block">
                    <input name="secret" class="layui-input">
                </div>
            </div>
        </form>
    </div>

</script>
<%--关联账号模板--%>
<script type="text/html" id="subEmailTab_accountManage">
    <table style="width: 100%">
        {{# for(var i = 0; i < d.subEmailList.length; i++ ){ }}
        <tr>
            <td>
                <div style="color:cornflowerblue;cursor: pointer" onclick="countSiteLisitingByPaypalEmail(`{{d.subEmailList[i].paypalEmail}}`)">{{d.subEmailList[i].paypalEmail}}</div>
                <div>
                    {{# if (d.subEmailList[i].relationStatus == 0) { }}
                        <span style="color: orange">未检测</span>
                    {{# } }}
                    {{# if (d.subEmailList[i].relationStatus == 1) { }}
                    <span style="color: green">关联中</span>
                    {{# } }}
                    {{# if (d.subEmailList[i].relationStatus == 2) { }}
                    <span style="color: red">未关联</span>
                    {{# } }}
                    {{# if (d.subEmailList[i].relationStatus == 3) { }}
                    <span style="color: gainsboro">无需检测</span>
                    {{# } }}
                    {{# if (d.subEmailList[i].relationStatus == 4) { }}
                    <span style="color: red">未授权</span>
                    {{# } }}
                </div>
            </td>
        </tr>
        {{# } }}
    </table>
</script>
<%--操作栏--%>
<script type="text/html" id="paypalAccountManage_bar">
    <div class="btnSelect_hp">
        <div class="title_btnSelect">操作</div>
        <div class="optionBox_btnSelect">
            <div class="optionCanvas_btnSelect">
                {{# if (d.expiresTime == null) { }}
                <permTag:perm funcCode="authPaypalBtn">
                <div class="option_btnSelect" lay-event="auth" >授权</div>
                </permTag:perm>
                {{# } }}
                <permTag:perm funcCode="updPaypalBtn">
                <div class="option_btnSelect" lay-event="edit" >修改</div>
                </permTag:perm>
                <div class="option_btnSelect" lay-event="updateAcctStatus" >修改状态</div>
                <div class="option_btnSelect" lay-event="queryLog" >日志</div>

            </div>
        </div>
    </div>
    <%--{{# if (d.expiresTime == null) { }}--%>
    <%--<a class="layui-btn layui-btn-xs" lay-event="auth" >授权</a>--%>
    <%--{{# } }}--%>
    <%--<a class="layui-btn layui-btn-xs" lay-event="edit" >修改</a>--%>
    <%--<a class="layui-btn layui-btn-xs" lay-event="updateAcctStatus" >修改状态</a>--%>
    <%--<a class="layui-btn layui-btn-xs" lay-event="queryLog" >日志</a>--%>
</script>
<%--纠纷同步详情--%>
<script type="text/html" id="syncResult_accountManage">
    <div>
        {{# if(d.lastSyncResult == 0 ) { }} <span class="fontGrey">未同步</span> {{# } }}
        {{# if(d.lastSyncResult == 1 ) { }} <span class="fontGreen" onmouseenter="showTip(`{{(d.lastSyncTime ? Format(d.lastSyncTime,'yyyy-MM-dd hh:mm:ss'): '') + '执行; ' + (d.lastSyncMsg || '')}}`, this)" onmouseleave="removeTip(this)" >成功</span> {{# } }}
        {{# if(d.lastSyncResult == 2 ) { }} <span class="fontRed"  onmouseenter="showTip(`{{(d.lastSyncTime ? Format(d.lastSyncTime,'yyyy-MM-dd hh:mm:ss'): '') + '执行; ' + (d.lastSyncMsg || '')}}`, this)" onmouseleave="removeTip(this)" >失败</span> {{# } }}
    </div>
</script>
<%--paypal账号展示模板--%>
<script type="text/html" id="paypalEmailTemp_accountManage">
    <div onmouseenter="showTip(`{{
        (d.status ? '启用中' : '停用中') + ';'
        + (d.expiresTime != null ? '已授权' : '未授权') + ';'
        + (d.ifPayAble ? '可打款' : '不可打款') + ';'
    }}`,this)" onmouseleave="removeTip(this)" onclick="countSiteLisitingByPaypalEmail(`{{d.paypalEmail}}`)" class="canClickEl">
        <span class="pora copySpan">
          <a href="javascript:;">{{d.paypalEmail}}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
        </span>
    </div>
</script>
<%--发送邮件弹窗--%>
<script type="text/html" id="sendEmailPop_accountManage">
    <div class="p20">
        <form class="layui-form" >
            <div class="layui-form-item">
                <textarea class="layui-textarea" id="toSendEmailArea" placeholder="多个之间以逗号隔开"></textarea>
            </div>
        </form>
    </div>
</script>
<%--修改paypal状态弹窗--%>
<script type="text/html" id="updateAcctStatusPop_accountManage">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" id="updateAcctStatusForm_accountManage" lay-filter="updateAcctStatusForm_accountManage">
            <div class="layui-form-item">
                <label class="layui-form-label">paypal状态</label>
                <div class="layui-input-block">
                    <select name="acctStatus" >
                        <c:forEach items="${paypalAcctStatusList}" var="acctStatus">
                            <option value="${acctStatus.code}">${acctStatus.name}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<%--显示日志弹窗--%>
<script type="text/html" id="showLogPop_accountManage">
    <div style="padding-top: 20px;padding-right: 40px;">
        <table class="layui-table" id="logTable_accountManage"></table>
    </div>
</script>

<script type="text/html" id="setStoreBreak_accountManage">


    <form class="layui-form">
        <div class="layui-form-item">
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">ebay店铺</label>
                <div class="textBox" id="ebayStoreNameBox_accountManage"></div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">休假开始时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="breakStartTime_accountManage" readonly>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">休假结束时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="breakEndTime_accountManage" readonly>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">显示message</label>
                <div class="layui-input-block">
                    <textarea cols="30" rows="10" class="layui-textarea" id="showText_accountManage"></textarea>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label" style="width:150px">HideFixedPriceStoreItems</label>
                <div class="layui-input-block" margin-left="150px">
                    <input type="checkbox" lay-skin="primary" lay-filter="hideFixedPriceStoreItems_accountManage" name="hideFixedPriceStoreItems" id="hideFixedPriceStoreItemsChecked">
                </div>
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="addMoreNotePop_accountManage">
    <div>
        <form class="layui-form" id="addMoreNoteForm_accountManage">
            <div class="layui-form-item">
                <div class="layui-block">
                    <label class="layui-form-label">备注</label>
                    <textarea class="layui-textarea" name="note"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/financial/paypal/accountManage.js"></script>

<style>
    .fontGrey{
        color: grey;
    }
    .fontRed{
        color: red;
    }
    .fontGreen{
        color: green;
    }
    .textBox{
        word-wrap:break-word
    }
    .sortBox_accountmanage{
        position: absolute;
        width: 5px;
        height:15px;
        margin-left:5px;
        cursor: pointer;
    }
    .sortBox_accountmanage i:first-child{
        position: relative;
        height:5px;
        top:-5px;
        color: grey;
    }
    .sortBox_accountmanage i:last-child{
        position: relative;
        height:5px;
        top:-53px;
        color: grey;
    }
    .sortBox_accountmanage i:hover{
        color: #000;
    }
</style>
