<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>ebay店铺</title>
<style>
    .select2-container {
        z-index: 123456789;
    }

    .fieldBox {
        float: left;
        width: 20%;
        height: 25px;
    }

    .select2-container .select2-dropdown.select2-dropdown--below {
        width: 850px !important;
    }

    #ebaySalesPlatAccountAddForm .select2-container .select2-selection--multiple {
        box-sizing: border-box;
        cursor: pointer;
        display: block;
        height: 38px;
        width: 850px;
        user-select: none;
        -webkit-user-select: none;
    }

    #ebaySalesPlatAccountAddForm .select2-container--default .select2-selection--multiple .select2-selection__rendered {
        box-sizing: border-box;
        list-style: none;
        margin: 0;
        padding: 0 5px;
        width: 850px;
        height: 100%
    }

    #ebaySalesPlatAccountAddForm .select2-container--default .select2-selection--multiple .select2-selection__choice {
        padding: 3px 5px;
        background-color: #fbfbfb;
        border: 1px solid #e6e6e6;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .fr {
        float: right;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card clearfix">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="ebayAcctSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="dis_flex">
                                    <select name="status" lay-search>
                                        <option value="">全部</option>
                                        <option value="true" selected>启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                    <input type="text" name="storeAcct" placeholder="店铺名称,逗号分割查询多个" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="ebay_account_depart_sel" placeholder="部门" lay-search
                                            lay-filter="ebay_account_depart_sel" class="orgs_hp_custom">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block dis_flex">
                                    <select id="ebay_account_salesman_sel" lay-search
                                            lay-filter="ebay_account_salesman_sel" class="users_hp_custom"
                                            data-rolelist="ebay专员">
                                        <option value="">销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服专员</label>
                                <div class="layui-input-block dis_flex">
                                    <select name="customServicerId" class="layui-select" lay-search>
                                        <option value="">客服</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block dis_flex">
                                    <select name="ebayManager" id="ebayManager" lay-filter="ebayManagerFilter" lay-search>
                                      <option value="">主管</option>
                                    </select>
                                    <select name="ebayLeader" id="ebayLeader" lay-filter="ebayLeaderFilter" lay-search>
                                      <option value="">组长</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block dis_flex">
                                    <select name="" id="ebaySyncListingStatus" lay-filter="ebaySyncListingStatusFilter" lay-search>
                                         <option value="">同步listing状态</option>
                                         <option value="0">未同步</option>
                                         <option value="2">同步中</option>
                                         <option value="3">同步成功</option>
                                         <option value="4">同步失败</option>
                                     </select>
                                   <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">账号类型</label>
                                <div class="layui-input-block">
                                    <select id="ebay_account_type" lay-search lay-filter="ebay_account_type">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库类型</label>
                                <div class="layui-input-block">
                                    <select id="ebay_account_warehouse" lay-search lay-filter="ebay_account_warehouse">
                                        <option value=""></option>
                                        <option value="0">国内仓</option>
                                        <option value="1">虚拟仓</option>
                                        <option value="2">海外仓</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">主站点</label>
                                <div class="layui-input-block">
                                    <input id="ebay_main_site_input" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">普源别名</label>
                                <div class="layui-input-block dis_flex">
                                    <select name="allrootAliasNameSearchType" lay-search>
                                        <option value="">请选择</option>
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                                    <input type="text" name="allrootAliasNameStr" placeholder="普源别名" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn  layui-btn-sm keyHandle"
                                            data-type="reload" id="ebaySearch" style="margin-left: -40px">搜索
                                    </button>
                                    <button id="resetEbayAccount" type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="ebayAccountCard">
                <div class="layui-card-body">
                    <div class="dis_flex">
                        <div class="layui-tab" lay-filter="ebay_acct_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" lay-id="1">数量(<span id="ebayAccount_colLen"></span>)</li>
                                <li lay-id="2">7天内到期域名(<span id="ebay_acct_domain_overdue_number"></span>)</li>
                                <li lay-id="3">2.0授权失败店铺(<span id="ebay_acct_error_auth_number"></span>)</li>
                            </ul>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="ebayAcct_import_adjust_store">
                                    <a type="button" class="layui-btn layui-btn-sm" target="_blank" href="/lms/static/templet/ebay导入excel调价模板.xlsx">
                                        下载调价店铺模板
                                    </a>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="ebayAcct_import_adjust_store">
                                        导入调价店铺
                                    </button>
                                    <input type="file" id="ebayAcct_import_adjust_store_file" hidden>
                                </permTag:perm>
                                <button class="layui-btn layui-btn-sm" id="ebay_syncEbayListing">同步listing</button>
                                <permTag:perm funcCode="ebayAccount_exportInfo_permTag">
                                    <button class="layui-btn layui-btn-sm" id="ebayAccount_exportInfo">导出</button>
                                </permTag:perm>
                            </div>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="ebayAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
                                    <permTag:perm funcCode="delete_allListing_ebayStore">
                                        <option value="6">删除所有Listing</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="set_store_vacation">
                                        <option value="7">设置店铺休假</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="end_store_vacation">
                                        <option value="8">结束店铺休假</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="ebayBatchEnableAcctStatus">
                                        <option value="9">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="ebayBatchUnableAcctStatus">
                                        <option value="10">批量停用店铺</option>
                                    </permTag:perm>
                                    <option value="11">修改图片域名</option>
                                    <option value="12">批量修改PayPal</option>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editEbayAcctBtn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="addEbayToken">授权ebay账号
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                    <table class="layui-table" id="ebayTable" lay-filter="ebayTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="setStoreBreak_tpl">
    <form class="layui-form" id="" lay-filter="">
        <div class="layui-form-item">
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">休假开始时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="breakStartTime" readonly>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">休假结束时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="breakEndTime" readonly>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label">显示message</label>
                <div class="layui-input-block">
                    <textarea cols="30" rows="10" class="layui-textarea" id="showText"></textarea>
                </div>
            </div>
            <div class="layui-col-md8 layui-col-lg8">
                <label class="layui-form-label" style="width:150px">HideFixedPriceStoreItems</label>
                <div class="layui-input-block" margin-left="150px">
                    <input type="checkbox" lay-skin="primary" lay-filter="hideFixedPriceStoreItems"
                           name="hideFixedPriceStoreItems">
                </div>
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="ebayAcctStatusTpl">
    {{# if(d.status == false){ }}
    <font color="red">已停用</font>
    {{# } else { }}
    已启用
    {{# } }}
</script>
<!--订单下载状态的开启和关闭-->
<script type="text/html" id="orderDownStatusTemplet">
    <div class="layui-form-item">
        <permTag:perm funcCode="order_download_ebayStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                   checked>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_download_ebayStore">
            {{# if(d.orderDownloadStatus){ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus"
                   checked disabled>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderDownloadStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script>
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="ebayTableBar">
    {{# if (d.accessKey) { }}
    <permTag:perm funcCode="reAuthEbayAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="getRestfulToken" title="ebay2.0重新授权">重授2.0</a><br>
    </permTag:perm>
    {{# }else { }}
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="getRestfulToken">授权2.0</a><br>
    {{# } }}
    <permTag:perm funcCode="editEbayAcctBtn">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br>
    </permTag:perm>
    <permTag:perm funcCode="ebayCheckAccessToken">
    <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
  </permTag:perm>
</script>


<!-- ebay添加基本信息模态框内容 -->
<script type="text/html" id="addEbayInfoLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="ebaySalesPlatAccountAddForm"
              lay-filter="ebaySalesPlatAccountAddForm">
            <div id="ebayAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseEbayAcct">启用店铺</button>
            </div>
            <div id="ebayAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delEbayAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="platCode" value="ebay">
            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="acctDetailId">

            <!-- <div class="layui-form-item">
                <label class="layui-form-label">PayPal邮箱1(默认)</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalEmail1" id="paypalEmail1" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">PayPal邮箱2</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalEmail2" id="paypalEmail2" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">PayPal邮箱3</label>
                <div class="layui-input-block">
                    <input type="text" name="paypalEmail3" id="paypalEmail3" class="layui-input">
                </div>
            </div> -->
            <div class="layui-form-item" pane="">
                <label class="layui-form-label">销售站点</label>
                <div class="layui-input-block">
                    <div class="col-sm-9" id="ebaySiteDiv">
                    </div>
                </div>
            </div>
            <div class="layui-form-item" pane="">
                <label class="layui-form-label">仓库属性</label>
                <div class="layui-input-block">
                    <div class="col-sm-9" id='ebaySoreHousesCheck'>
                        <input type='checkbox' id="soreHouses_in" lay-skin='primary' title="国内仓" value="0"/>
                        <input type='checkbox' id="soreHouses_invented" lay-skin='primary' title="虚拟仓" value="1"/>
                        <input type='checkbox' id="soreHouses_out" lay-skin='primary' title="海外仓" value="2"/>
                    </div>
                </div>
            </div>

            <%-- <div class="layui-form-item">
                <label class="layui-form-label">自动下架</label>
                <div class="layui-input-block">
                    <input type="checkbox" id="isAutoStopSale" name="isAutoStopSale" lay-skin="switch" lay-text="开启|关闭">
                    （自动下架30天内无销量产品）
                </div>
            </div> --%>
            <div class="layui-form-item">
                <label class="layui-form-label">图片域名</label>
                <div class="layui-input-block">
                    <input type="text" name="imgDomain" placeholder="请输入图片地址"
                           class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">销售员</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="salespersonId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">客服专员</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="customServicerId" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                
                <div class="layui-inline">
                    <label class="layui-form-label">组长</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="leaderId" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>

                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="sellLeaderId" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">
                        <span class="colorRed">*</span>账号类型
                    </label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="acctType" class="layui-select" lay-search>
                            <option></option>
                        </select>
                    </div>
                </div>

                <div class="layui-inline">
                    <label class="layui-form-label">设置自动退款</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="ebayAutoRefundAmount" lay-verify="required"
                               class="layui-input">
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">普源别名</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="allrootAliasName" placeholder="请输入源别名"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">欧盟税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                               class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="taxNumber" placeholder="税号"
                            class="layui-input">
                    </div>
                </div>
            </div>

            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>

            <div class="layui-form-item disN">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit="" lay-filter="addEbayAcct" id="addEbayAcct">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- ebay弹出框详情 -->
<!-- ebay授权账号 -->
<script type="text/html" id="addEbayTokenLayer">
    <div class="p20">
        <div class="mb10 alertColor">
            <p>提示：授权时请勿关闭本窗口或刷新页面，请在5分钟内按顺序完成操作。</p>
            <p> 提示：授权时，请勿重复点击按钮，耐心等待；不要让浏览器阻止新页面弹出。 </p>
            <p> 提示：授权完成后，请去设置账号基础信息以及关联商户。</p>
        </div>
        <div class="mb10">
            <button class="layui-btn" id="getEbaySessionId">第一步，点击本按钮，在弹出的新页面中登录并进行授权</button>
            <input type="hidden" id="ebaySessionID">
        </div>
        <div>
            <button class="layui-btn" id="saveEbayToken">第二步，在上一步授权成功后，点击本按钮，获取该店铺的访问令牌</button>
        </div>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/ebayAccount.js"></script>

<script>
    var ebayAcctSiteData = [];
    <c:forEach items = "${ebaySites}" var = "ebaySite" >
    var site = {};
    site.id = ${ebaySite.getSiteId()};
    site.name = "${ebaySite.getSite().getSiteChineseName()}";
    ebayAcctSiteData.push(site);
    </c:forEach>
</script>


<!-- ebay 生成token modal -->
<script type="text/html" id="ebayRestfulTokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="ebayRestfulTokenAddForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：登录ebay账号，点击Agree同意授权。复制网页地址栏中的code参数</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="autoUrl" onclick="var self = this;window.open(self.value)"
                           style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的code，点击保存，即可获取token</label>
                <div class="layui-input-block">
                    <textarea type="text" name="code" placeholder="请输入Code" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="editEbaySalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editEbaySalesPersonForm">
            <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">客服专员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="customServicerId" lay-verify="required" class="layui-select" lay-search>
                        <option></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">ebay主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderId" class="layui-select" lay-search>
                        <option></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组长</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="leaderId" class="layui-select" lay-search>
                        <option></option>
                    </select>
                </div>
            </div>

        </form>
    </div>
</script>

<script type="text/html" id="tokenExpireTime_ebay">
    <div>
        {{# if(d.expiryWarnStatus){ }}
        <font color="#FF0000"> {{ Format(d.accessTokenExpiryTime,"yyyy-M-d h:m:s")}}</font>
        {{# }else{ }}
        {{ Format(d.accessTokenExpiryTime,"yyyy-M-d h:m:s")}}
        {{# } }}
        <!--{{# if (d.accessTokenExpiryTime) { }}-->
        <!--<span class="layui-badge" lay-event="refreshToken2" style="cursor:pointer">刷新token</span>-->
        <!--{{# } }}-->
    </div>

</script>
<!--处理ebay店铺同步状态-->
<script type="text/html" id="ebayAcccount_ebaySyncStatus">
    <span style="">
                {{# if(d.syncStatus == 1){ }}
                    <span class="layui-skyblue">同步中</span>
                {{# }else if (d.syncStatus == 2) { }}
                    <span class="layui-skyblue">同步中</span>
                {{# }else if (d.syncStatus == 3) { }}
                    <span class="layui-green">同步成功</span>
                {{# }else if ( d.syncStatus == 4 || d.syncStatus == 5 ) { }}
                    <span class="layui-gray">同步失败</span>
                {{# }else { }}
                    <span class="layui-orange">未同步</span>
                {{# } }}
            </span>
</script>

<script type="text/html" id="ebayAcccount_ebayAuthStatus">
    <span style="">
                {{# if(d.authStatus == 1){ }}
                    <span class="layui-skyblue">成功</span>
                {{# }else if(d.authStatus == 0) { }}
                    <span class="layui-skyblue">失败</span>
                {{# } }}
            </span>
</script>

<!--处理ebay店铺同步时间-->
<script type="text/html" id="ebayAcccount_lastSyncTime">
    {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!--ebay店铺名称-->
<script type="text/html" id="ebay_acct_name_template">
    <div style="font-size: 12px; text-align: left">
        <span style="color:#999;">店铺名称:</span> {{ d.storeAcct}}<br>
        <span style="color:#999;">普源名称:</span> {{ d.allrootAliasName}}<br>
    </div>
</script>
<!--ebay人员信息-->
<script type="text/html" id="ebay_person_info_template">
    <div style="font-size: 12px; text-align: left">
        <span style="color:#999;">销售:</span> {{ d.salesperson}}<br>
        <span style="color:#999;">客服:</span> {{ d.customServicer}}<br>
        {{# if(d.sellLeaderName){ }}
        <span style="color:#999;">主管:</span> {{ d.sellLeaderName}}<br>
        {{#} }}
        {{# if(d.leaderName){ }}
        <span style="color:#999;">组长:</span> {{ d.leaderName}}<br>
        {{#} }}
    </div>
</script>
<!-- 仓库账号类型模板 -->
<script type="text/html" id="ebay_acct_warehouse_type_templet">

    <div style="font-size: 12px;text-align: left ">
        <span style="color:#999;">账号类型:</span> {{ d.acctType}}<br>
        <span style="color:#999;">仓库类型：</span>
        {{# if (d.storeWarehouses == 0) { }}
        国内仓
        {{# }else if(d.storeWarehouses == 1){ }}
        虚拟仓
        {{# }else if(d.storeWarehouses == 2){ }}
        海外仓
        {{# } }}
        <br>
    </div>
</script>
<!-- 导出 -->
<script type="text/html" id="ebayAcct_exportInfo_tpl">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="ebayAcct_exportInfo_checkAll"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="exportTemplateForm_producttpl"
                          id="ebayAcct_exportInfo_form">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">店铺信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="账号" title="账号" disabled
                                                     checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="PayPal邮箱1(默认)"
                                                     title="PayPal邮箱1(默认)" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="PayPal邮箱2"
                                                     title="PayPal邮箱2" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="PayPal邮箱3"
                                                     title="PayPal邮箱3" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="销售站点" title="销售站点"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="仓库属性" title="仓库属性"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="自动下架" title="自动下架"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="图片域名" title="图片域名"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="销售员" title="销售员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="客服专员" title="客服专员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="账号类型" title="账号类型"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="销售主管" title="销售主管"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="普源别名" title="普源别名"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="设置自动退款" title="设置自动退款"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="备注" title="备注"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="同步状态" title="同步状态"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="同步异常备注" title="同步异常备注"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">账号信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="公司" title="公司"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册时间" title="注册时间"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册人" title="注册人"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="注册邮箱" title="注册邮箱"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="好评率" title="好评率"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="信用" title="信用"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="主站点" title="主站点"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="主站点等级" title="主站点等级"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">账号管理</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="accountField" value="PayPal余额"
                                                     title="PayPal余额" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">账号表现</legend>
                        </fieldset>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="可刊登商品数量额度" title="可刊登商品数量额度" lay-skin="primary">
                        </div>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="可刊登商品数量剩余" title="可刊登商品数量剩余" lay-skin="primary">
                        </div>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="可刊登商品金额额度" title="可刊登商品金额额度" lay-skin="primary">
                        </div>
                         <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="可刊登商品金额剩余" title="可刊登商品金额剩余" lay-skin="primary">
                        </div>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="在线数量" title="在线数量" lay-skin="primary">
                        </div>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="近31天订单数" title="近31天订单数" lay-skin="primary">
                        </div>
                        <div class="fieldBox">
                            <input type="checkbox" name="accountField" value="近31天销售额" title="近31天销售额" lay-skin="primary">
                        </div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="batchUpdateAcctCurrencyLayer">
    <div class="p20">
        <form action="" class="layui-form " id="batchUpdateAcctCurrencyForm">
            <div class="layui-inline">
                <label class="layui-form-label">币种</label>
                <div class="layui-input-inline" style="width:300px">
                    <select type="text" name="currency" class="layui-select" lay-search>
                        <option value="">请选择</option>
                        <option value="CNY">CNY</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" type="submit" lay-submit="" lay-filter="updateAcctCurrency"
                            id="updateAcctCurrency">确定
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary" id="updateAcctCurrencyReset">取消</button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="editEbayDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editEbayDomainForm">
            <div class="layui-inline-item">
                <label class="layui-form-label">域名</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="domainId" lay-verify="required" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>


<script type="text/html" id="editEbayPayPal">
        <form class="layui-form" id="editEbayPayPalForm" lay-filter="editEbayPayPalForm">
            <div class="layui-inline-item" style="text-align: right;margin: 15px;width: 85%;">
                应用到 listing
            </div>
            <div class="layui-inline-item" style="width:90%;">
                <label class="layui-form-label">PayPal邮箱1</label>
                <div class="layui-input-block dis_flex">
                    <input class="layui-input" name="paypalEmail1">
                    <input type="radio" name="paypalEmail" value="paypalEmail1" title="">
                </div>
            </div>
            <div class="layui-inline-item" style="width:90%;">
                <label class="layui-form-label">PayPal邮箱2</label>
                <div class="layui-input-block dis_flex">
                    <input class="layui-input" name="paypalEmail2">
                    <input type="radio" name="paypalEmail" value="paypalEmail2" title="">
                </div>
            </div>
            <div class="layui-inline-item" style="width:90%;">
                <label class="layui-form-label">PayPal邮箱3</label>
                <div class="layui-input-block dis_flex">
                    <input class="layui-input" name="paypalEmail3">
                    <input type="radio" name="paypalEmail" value="paypalEmail3" title="">
                </div>
            </div>

        </form>
</script>
