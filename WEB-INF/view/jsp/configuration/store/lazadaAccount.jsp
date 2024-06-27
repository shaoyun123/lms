<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>lazada店铺</title>
<style>
    .lazadaStyle {
        display: flex;
        margin-bottom: 20px;
    }

    .lazadaStyle_label {
        width: 80px;
        line-height: 32px;
    }

    .lazadaStyle_block {
        display: flex;
        margin-left: 50px;
    }
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" id="lazadaAcctSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-row">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <div class="layui-form-label labelSel">
                                            <select name="status" lay-search>
                                                <option value="">全部</option>
                                                <option value="true" selected>启用中</option>
                                                <option value="false">已停用</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" name="storeAcct" placeholder="店铺名称,逗号分割查询多个"
                                                class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select name="acctQueryFlag" lay-search>
                                            <option value="1">精确</option>
                                            <option value="0">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" id="lazada_account_depart_sel" placeholder="部门" lay-search
                                        lay-filter="lazada_account_depart_sel" class="orgs_hp_custom">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block sellect-seller">
                                            <select name="salespersonId" id="lazada_account_salesman_sel" lay-search
                                                lay-filter="lazada_account_salesman_sel" class="users_hp_custom"
                                                data-rolelist="lazada专员">
                                                <option value="">销售员</option>
                                            </select>
                                        </div>
                            </div>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                <label class="layui-form-label">下载订单</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <select name="orderDownloadStatus" lay-search>--%>
<%--                                        <option value="">请选择</option>--%>
<%--                                        <option value="true">已开启</option>--%>
<%--                                        <option value="false">已关闭</option>--%>
<%--                                    </select>--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding: 9px 0px;width: 95px;">同步Listing状态</label>
                                <div class="layui-input-block">
                                    <select name="syncStatus" lay-search>
                                        <option value=""></option>
                                        <option value="1">初始</option>
                                        <option value="2">同步中</option>
                                        <option value="3">成功</option>
                                        <option value="4">失败</option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自动删除</label>
                                <div class="layui-input-block">
                                    <select name="autoDelete" lay-search>
                                        <option value=""></option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-row">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <label class="layui-form-label">备注</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" name="remark">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <input type="text" name="syncDesc" placeholder="同步异常备注" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="grossRateMin" type="number" min="0" placeholder="请输入数字" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="grossRateMax" type="number" min="0" placeholder="请输入数字" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">可用额度</label>
                                    <div class="layui-input-block dis_flex">
                                        <input class="layui-input" name="listingQuotaRemainMin" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                        <input class="layui-input" name="listingQuotaRemainMax" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">排序</label>
                                    <div class="layui-input-block">
                                        <select name="orderByType" lay-search>
                                            <option value=""></option>
                                            <option value="refreshTokenAsc">refresh_token到期正序</option>
                                            <option value="refreshTokenDesc">refresh_token到期倒序</option>
                                            <option value="accessTokenAsc">access_token到期正序</option>
                                            <option value="accessTokenDesc">access_token到期倒序</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">平台状态</label>
                                    <div class="layui-input-block">
                                        <select name="lazadaStoreStatus" lay-search>
                                            <option value="">全部</option>
                                            <option value="active">active</option>
                                            <option value="inactive">inactive</option>
                                            <option value="delete">delete</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">预售</label>
                                    <div class="layui-input-block">
                                        <select name="lazadaPreOrderConfigStatus" lay-search>
                                            <option value="">请选择</option>
                                            <option value="1">已开启</option>
                                            <option value="0">已取消</option>
                                            <option value="2">已暂停</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺标签</label>
                                <div class="layui-input-block">
                                    <select name="storeTagList"
                                            xm-select="lazadaAccount_search_storeTagList"
                                            lay-filter="lazadaAccount_search_storeTagList"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                    ></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">延长收货</label>
                                    <div class="layui-input-block">
                                        <select name="holidayMode" lay-search>
                                        <option value="">请选择</option>
                                        <option value="1">已开启</option>
                                        <option value="0">未开启</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-row">
                                    <label class="layui-form-label">自动上传视频设置</label>
                                    <div class="layui-input-block">
                                        <select name="lazadaVideoStatus" lay-search>
                                            <option value="">请选择</option>
                                            <option value="true">已开启</option>
                                            <option value="false">未开启</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload"
                                    id="lazadaSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="lazadaAccountCard">
                <div class="layui-card-body">
                    <div class="dis_flex">
                        <div class="dis_flex">
                        <div class="layui-tab" lay-filter="lazada_acct_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" lay-id="1">数量(<span id="lazadaAccount_colLen"></span>)</li>
<%--                                <li lay-id="2">7天内到期域名(<span id="lazada_acct_domain_overdue_number"></span>)</li>--%>
                            </ul>
                        </div>
                        <div class="layui-form">
                            <select lay-filter="lazadaAccountBtnSelect" name="lazadaAccountBtnSelect" lay-search>
                                    <option value="下载模板">下载模板</option>
                                <permTag:perm funcCode="editLazadaAcctBtn">
                                    <option value="新增店铺">新增店铺</option>
                                </permTag:perm>
                                    <option value="修改店铺">修改店铺</option>
                                <permTag:perm funcCode="exportLazadaLicenseInfoBtn">
                                    <option value="授权信息">授权信息</option>
                                </permTag:perm>
                                <permTag:perm funcCode="lazadaAccountPresaleBtn">
                                    <option value="预售设置">预售设置</option>
                                </permTag:perm>
                            </select>
                        </div>
                            <button class="layui-btn layui-btn-sm layui-btn-danger ml20" id="lazadaAccountExportBtn">导入Excel</button>
                            <input type="file" id="addLazadaInfoByImportFile" hidden>
                            <input id="lazada_importAuthInfo" hidden>
                            <input id="lazada_importEditStore" hidden>
                            <input id="lazada_importPresale" hidden>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm" id="lazada_syncLazadaListing">同步listing</button>
                            </div>
                            <div class="layui-input-inline w150 layui-form">
                                <select name="hello" lay-filter="lazadaAcctBatchOper" lay-search>
                                    <option value="" disabled selected>批量操作</option>
                                    <option value="3">修改信息</option>
<%--                                    <permTag:perm funcCode="order_download_lazadaStore">--%>
<%--                                        <option value="4">开启订单下载</option>--%>
<%--                                        <option value="5">关闭订单下载</option>--%>
<%--                                    </permTag:perm>--%>
<%--                                    <option value="6">修改图片域名</option>--%>
<%--                                    <option value="7">批量自动刊登</option>--%>
                                    <permTag:perm funcCode="lazadaBatchEnableAcctStatus">
                                        <option value="8">批量启用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="lazadaBatchUnableAcctStatus">
                                        <option value="9">批量停用店铺</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="lazadaBatchAddStoreTags">
                                        <option value="10">批量添加店铺标签</option>
                                    </permTag:perm>
<%--                                    <permTag:perm funcCode="lazadaBatchEnableAcctStatus">--%>
                                        <option value="11">批量开启延长收货</option>
<%--                                    </permTag:perm>--%>
<%--                                    <permTag:perm funcCode="lazadaBatchUnableAcctStatus">--%>
                                        <option value="12">批量关闭延长收货</option>
<%--                                    </permTag:perm>--%>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="editLazadaAcctBtn">
                                    <button 
                                        class="layui-btn layui-btn-sm layui-btn-normal" 
                                        id="addLazadaInfo"
                                        type="button">添加lazada账号基本信息
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>        
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="lazadaTable" lay-filter="lazadaTable"></table>
                    <script type="text/html" id="lazadaAcctStatusTpl">
                        OA状态：
                        {{# if(d.status == false){ }}
                        <font color="red">已停用</font>
                        {{# } else { }}
                        已启用
                        {{# } }}
                        <br />平台状态：{{d.lazadaStoreStatus || ''}}
                    </script>

                    <!--订单下载状态的开启和关闭-->
<%--                    <script type="text/html" id="orderDownloadStatusTemplet">--%>
<%--                        <div class="layui-form-item">--%>
<%--                            <permTag:perm funcCode="order_download_lazadaStore">--%>
<%--                                {{# if(d.orderDownloadStatus){ }}--%>
<%--                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"--%>
<%--                                    lay-filter="orderDownloadStatus" checked>--%>
<%--                                {{# }else{ }}--%>
<%--                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"--%>
<%--                                    lay-filter="orderDownloadStatus">--%>
<%--                                {{# } }}--%>
<%--                                <div style="display: none">{{d.id}}</div>--%>
<%--                            </permTag:perm>--%>
<%--                            <permTag:lacksPerm funcCode="order_download_lazadaStore">--%>
<%--                                {{# if(d.orderDownloadStatus){ }}--%>
<%--                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"--%>
<%--                                    lay-filter="orderDownloadStatus" checked disabled>--%>
<%--                                {{# }else{ }}--%>
<%--                                <input type="checkbox" lay-skin="switch" lay-text="开启|关闭"--%>
<%--                                    lay-filter="orderDownloadStatus" disabled>--%>
<%--                                {{# } }}--%>
<%--                            </permTag:lacksPerm>--%>
<%--                        </div>--%>
<%--                    </script>--%>

                    <!--处理lazada店铺同步时间-->
                    <%--<script type="text/html" id="lazadaLastSyncTime">--%>
                        <%--{{--%>
                        <%--Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")--%>
                        <%--}}--%>
                        <%--{{# if(d.listingQuotaLimit){ }}--%>
                        <%--Listing额度:{{d.listingQuotaLimit}}--%>
                        <%--{{# } }}--%>
                    <%--</script>--%>
                    <!--处理lazada店铺同步状态-->
                    <script type="text/html" id="lazadaSyncStatus">
                        <span style="">
                            <a style="display: none;">{{d.syncDesc}}</a>
                            {{# if(d.syncStatus == 1){ }}
                            <span class="layui-skyblue">同步中</span>
                            {{# }else if (d.syncStatus == 2) { }}
                            <span class="layui-skyblue">同步中</span>
                            {{# }else if (d.syncStatus == 3) { }}
                            <span class="layui-green" lay-tips="{{d.syncDesc}}" onclick="layui.admin.copyTxt(this)">同步成功</span>
                            {{# }else if (d.syncStatus == 4) { }}
                            <span class="layui-gray" lay-tips="{{d.syncDesc}}" onclick="layui.admin.copyTxt(this)">同步失败</span>
                            {{# }else { }}
                            <span class="layui-orange">未同步</span>
                            {{# } }}
                        </span><br>
                        {{Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
                    </script>
                    <!-- 工具条模板,写在script里面 -->
                    <script type="text/html" id="lazadaTableBar">
                        <permTag:perm funcCode="editLazadaAcctBtn">
<%--                            {{# if(d.accessToken){ }}--%>
                            <a class="layui-btn layui-btn-xs" lay-event="auth">API授权</a><br />
<%--                            {{# }else{ }}--%>
<%--                            <a class="layui-btn layui-btn-xs" lay-event="auth">授权</a><br />--%>
<%--                            {{# } }}--%>
                            <a class="layui-btn layui-btn-xs" lay-event="edit"> 编辑 </a><br />
                            <a class="layui-btn layui-btn-xs" lay-event="storeTagList"> 店铺标签 </a><br />
                        </permTag:perm>
                        <permTag:perm funcCode="lazadaCheckAccessToken">
                          <a class="layui-btn layui-btn-xs" lay-event="checkAccessToken">查看授权</a>
                        </permTag:perm>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<%--    延长收货--%>
<script type="text/html" id="holidayPeriodLayer">
    <div style="margin:20px 10px;">
        <span style="color:red;">*</span> 起始日期
        <input type="text" class="layui-input" autocomplete="off" id="holidayPeriodTime">
    </div>
</script>
<script type="text/html" id="lazada_importAuthInfoLayer">

</script>
<!-- lazada添加基本信息模态框内容 -->
<script type="text/html" id="addLazadaInfoLayer">
    <div style="padding:20px">
        <form action="" class="layui-form layui-form-pane" id="lazadaSalesPlatAccountAddForm">
            <div id="lazadaAcctReuseDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-xs" lay-submit="" lay-filter="reuseLazadaAcct">启用店铺</button>
            </div>
            <div id="lazadaAcctDelDiv" class="layui-hide taRight mb10">
                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-submit="" lay-filter="delLazadaAcct">
                    停用店铺
                </button>
            </div>

            <input type="hidden" name="platCode" value="lazada">
            <input type="hidden" name="acctBaseId">
            <input type="hidden" name="acctDetailId">

            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">店铺名称</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="storeAcct" required lay-verify="required" placeholder="请输入店铺名称"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select lay-filter="lazadaAccountSalesSite" name="salesSite" lay-verify="required" required class="layui-select" lay-search>
                            <option value="">选择站点</option>
                            <c:forEach items="${lazadaSites}" var="lazadaSite">
                                <option value="${lazadaSite.getCode()}">${lazadaSite.getName()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">品牌</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="brand" placeholder="请输入品牌" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">注册邮箱</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="registerEmail" required lay-verify="required" placeholder="请输入注册邮箱" class="layui-input">
                    </div>
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
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">销售主管</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="sellLeaderId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">折扣率</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="discountRate" value="0.59" placeholder="请输入折扣率" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">lazada组长</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="leaderId" class="layui-select" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-inline lazadaAcctManufacturer" style="display:none;">
                    <label class="layui-form-label">运输方式</label>
                    <div class="layui-input-inline" style="width:300px">
                        <select name="manufacturer" class="layui-select"  lay-search>
                            <option selected>LGS</option>
                            <option>泰国陆运</option>
                        </select>
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
                <div class="layui-inline">
                    <label class="layui-form-label">欧盟税号</label>
                    <div class="layui-input-inline" style="width:300px">
                        <input type="text" name="eoriNumber" placeholder="请输入欧盟税号"
                               class="layui-input">
                    </div>
                </div>
            </div>

            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea type="text" name="acctBaseRemark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>

            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addLazadaAcct" id="addLazadaAcct">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/configuration/store/lazadaAccount.js"></script>

<script type="text/html" id="editLazadaSalesPersonLayer">
    <div class="p20">
        <form action="" class="layui-form" id="editLazadaSalesPersonForm">
            <div class="layui-form-item">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="salespersonId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售主管</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="sellLeaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">客服</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="customServicerId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">lazada组长</label>
                <div class="layui-input-inline" style="width:300px">
                    <select name="leaderId" lay-verify="required" class="layui-select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- lazada 鉴权 -->
<script type="text/html" id="lazadaAuthLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="lazadaAuthForm">
            <div class="layui-form-item layui-form-text" style="font-size:18px;">
                非chat API授权
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：完成授权后，复制网页地址栏中的code参数，因授权步骤繁琐请根据教程操作<a href="/lms/static/templet/API授权教程.pdf"
    target="_blank" style="color:#1e9fff">授权说明</a></label>
                <div class="layui-input-block">
                    <input class="layui-input otherApi" onclick="var self = this;window.open(self.value)"
                        style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的code，点击保存，即可成功授权</label>
                <div class="layui-input-block">
                    <textarea type="text" name="code1" placeholder="请输入code" class="layui-input"></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text" style="font-size:18px;">
                chat API授权
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：完成授权后，复制网页地址栏中的code参数，因授权步骤繁琐请根据教程操作<a href="/lms/static/templet/chat授权教程.pdf"
    target="_blank" style="color:#1e9fff">授权说明</a></label>
                <div class="layui-input-block">
                    <input class="layui-input chatApi" onclick="var self = this;window.open(self.value)" style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的code，点击保存，即可成功授权</label>
                <div class="layui-input-block">
                    <textarea type="text" name="code2" placeholder="请输入code" class="layui-input"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="editLazadaDomainLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="editLazadaDomainForm">
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

<%-- lazada表格-自动刊登展示 --%>
<script type="text/html" id="lazada_autoHandle">
    {{d.autoDelete ? '已开启': '已关闭' }}
    <div>
        {{# if(d.autoPublishCateIds){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="hasSet">已设置</span>
        {{# }else{ }}
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="notSet">未设置</span>
        {{# } }}
    </div>
    {{# if (d.autoDelete){ }}
    每天删除{{d.autoDeleteNum}}
    {{# if (d.autoDeleteSalesType == 1){ }}
    ，30天销量=0
    {{# }else if(d.autoDeleteSalesType == 2){ }}
    ，60天销量=0
    {{# }else{ }}
    ，90天销量=0
    {{# } }}
    {{# } }}
</script>


<%-- lazada未/已设置自动刊登弹框 --%>
<script type="text/html" id="lazada_setedLayer">
    <div style="padding:20px;" id="lazada_setedContainer">
    </div>
</script>
<script type="text/html" id="lazada_setedContainerTpl">
    <div class="lazadaStyle">
        <div class="lazadaStyle_label">
            <div><strong>自动删除</strong></div>
        </div>
        <div class="lazadaStyle_block">
            <div class="layui-form">
                {{# if(d.autoDelete){ }}
                <input type="radio" name="autoDelete" value="false" title="关闭">
                <input type="radio" name="autoDelete" value="true" title="开启" checked>
                {{# }else{ }}
                <input type="radio" name="autoDelete" value="false" title="关闭" checked>
                <input type="radio" name="autoDelete" value="true" title="开启">
                {{# } }}
            </div>
            <div style="display:flex;line-height:32px;">
                <span>每天删除</span>
                <div style="margin: 0 10px;">
                    <input type="number" class="layui-input" max="200" name="autoDeleteNum"
                        value="{{d.autoDeleteNum || ''}}" oninput="if(value>200)value=200">
                </div>
                <%--<span>listing.(最大50)</span>--%>
                <span>listing.(最大200)</span>
            </div>
            <div style="display:flex;line-height:32px;">
                <select id="autoDeleteSalesType" name="autoDeleteSalesType" lay-filter="autoDeleteSalesTypeFilter" lay-search>
                    {{# if(d.autoDeleteSalesType == 1){ }}
                    <option value="1" selected>30天销量=0</option>
                    <option value="2">60天销量=0</option>
                    <option value="3">90天销量=0</option>
                    {{#  } else if(d.autoDeleteSalesType == 2){ }}
                    <option value="1">30天销量=0</option>
                    <option value="2" selected>60天销量=0</option>
                    <option value="3">90天销量=0</option>
                    {{#  } else { }}
                    <option value="1">30天销量=0</option>
                    <option value="2">60天销量=0</option>
                    <option value="3" selected>90天销量=0</option>
                    {{#  } }}
                </select>
            </div>
        </div>
    </div>
    <div class="lazadaStyle">
        <div class="lazadaStyle_label">
            <div><strong>刊登天数 ≥ </strong></div>
        </div>
        <div class="lazadaStyle_block">
            <div class="layui-form dis_flex">
                    <input class="layui-input" value="{{d.autoDeleteGreatListingTime||''}}" name="autoDeleteGreatListingTime" min="5" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"> <div style="height: 32px;line-height: 32px"> 天</div>
            </div>
        </div>
    </div>
    <div class="lazadaStyle">
        <div class="lazadaStyle_label">
            <div><strong>评论次数 ≤ </strong></div>
        </div>
        <div class="lazadaStyle_block">
            <div class="layui-form">
                <input class="layui-input" value="{{d.lazadaCommentLte===0?0:(d.lazadaCommentLte||'')}}" name="lazadaCommentLte" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
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
                    <button type="reset" class="layui-btn layui-btn-primary" id="updateAcctCurrencyReset">取消
                    </button>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 店铺标签设置 -->
<script type="text/html" id="lazada_acct_set_storetag_tpl">
    <div class="layui-card">
        <div class="layui-card-body layui-form">
            <div class="fRed">{{d.bacthTitle}}</div>
            <div id="lazada_acct_set_storetag_form">
                {{# layui.each(d.tagList, function(index, item){ }}
                <input type="checkbox" name="storeTag" title="{{item.name}}" value="{{item.name}}" lay-skin="primary" {{ item.checked ? "checked" : "" }}>
                {{# }) }}
            </div>
        </div>
    </div>
</script>
<%-- lazada表格-预售 --%>
<script type="text/html" id="lazadaAcct_presale_tpl">
    <div>
        {{# if(d.lazadaPreOrderConfigStatus === 1 ){ }}
        <div>已开启</div>
        {{# }else if(d.lazadaPreOrderConfigStatus === 0){ }}
        <div>已取消</div>
        {{# }else if(d.lazadaPreOrderConfigStatus === 2){ }}
        <div>已暂停</div>
        {{# } }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setPreSale">设置</span>
    </div>
</script>
<%-- lazada表格-自动上传视频设置 --%>
<script type="text/html" id="lazadaAcct_mediaCenter_tpl">
    {{# if(d.lazadaVideoStatus ){ }}
    <div>已开启</div>
    {{# }else{ }}
    <div>未开启</div>
    {{# } }}
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setMediaCenter">设置</span>
</script>
<%-- 自动上传视频至店铺media center --%>
<script type="text/html" id="lazadaAcct_mediaCenter_layer">
    <form class="layui-form" id="lazadaAcct_mediaCenterDeleteForm" style="padding: 10px;">
        <input type="hidden" name="id">
        <div class="layui-form-item">
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">自动上传视频</label>
                <div class="layui-input-block">
                    <input type="radio" name="status" value='true' title="开启">
                    <input type="radio" name="status" value='false' title="关闭" checked>
                </div>
            </div>
            <b>视频上传不处理条件设置：</b>
            <div class="layui-col-12 layui-col-md12" style="margin-top: 10px;">
                <label class="layui-form-label">商品父SKU</label>
                <div class="layui-input-inline">
                    <textarea type="textarea" style="width: 300px;" class="layui-textarea" name="prodPSkus" placeholder="支持输入多个，英文逗号分隔"></textarea>
                </div>
            </div>
        </div>
    </form>
</script>
<!-- 预售设置 -->
<script type="text/html" id="lazada_acct_set_presale_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="lazada_acct_set_presale_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">预售</label>
                    <div class="layui-input-block">
                        <input type="radio" name="status" value="1" title="开启预售">
                        <input type="radio" name="status" value="0" title="取消预售">
                        <input type="radio" name="status" value="2" title="暂停预售定时任务">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">第1优先预售条件:</label>
                    <div class="layui-input-block disflex">
                        <div class="w50" style="padding: 4px 5px 0 0;">item_id</div>
                        <textarea name="itemIdsStr"class="layui-textarea" placeholder="支持填入多个，英文逗号隔开"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">第2优先预售条件:</label>
                    <div class="layui-input-block disflex">
                        <div class="disflex">
                            <div style="width: 142px;">
                                <select name="salesType" lay-search>
                                    <option value="">请选择销量</option>
                                    <option value="7">listing7天销量&ge;</option>
                                    <option value="30">listing30天销量&ge;</option>
                                    <option value="60">listing60天销量&ge;</option>
                                    <option value="90">listing90天销量&ge;</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" class="layui-input w150" name="salesDay" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                            </div>
                        </div>
                        <div class="disflex ml20">
                            <div style="width: auto;padding: 4px 5px 0 0;">且0库存子商品占比&ge;</div>
                            <input type="text" name="secondZeroRatio" class="layui-input w100" placeholder="填入正整数" onkeypress="commonKeyPressInputNotNega(event)">
                            <span>%</span>
                        </div>
                        <div class="disflex ml20">
                            <div style="width: auto;padding: 4px 5px 0 0;">且到货天数</div>
                            <input type="text" name="secondLeftArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                            <span>-</span>
                            <input type="text" name="secondRightArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">第3优先预售条件:</label>
                    <div class="layui-input-block disflex">
                        <div style="width: auto;padding: 4px 5px 0 0;">基础模板审核通过天数&le;</div>
                        <input type="text" name="auditTimeDayLte" class="layui-input w150" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        <div style="width: auto;padding: 4px 5px 0 0;" class="inline_block ml20">且0库存子商品占比&ge;</div>
                        <input type="text" name="thirdZeroRatio" class="layui-input w100" placeholder="填入正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        <span>%</span>
                        <div style="width: auto;padding: 4px 5px 0 0;" class="inline_block ml20">且到货天数</div>
                        <input type="text" name="thirdLeftArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                        <span>-</span>
                        <input type="text" name="thirdRightArrivalDay" class="layui-input w100" placeholder="填入0或正整数" onkeypress="commonKeyPressInputNotNega(event)">
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
<%-- lazada表格-性感图片过滤设置 --%>
<script type="text/html" id="lazadaAcct_filterSexImg_tpl">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setFilterSexImg">设置</span>
    </div>
</script>
<!-- 性感图片过滤设置 -->
<script type="text/html" id="lazada_acct_filter_sex_img_tpl">
    <div class="layui-card">
        <input id="lazadaAccount_siteSingle" type="hidden">
        <input id="lazadaAccount_storeAcctId" type="hidden">
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">
            <legend>设置过滤性感图片SKU：</legend>
        </fieldset>
        <div style="padding: 10px 20px">
        <textarea id='lazadaAccount_filter_sku' class="layui-textarea" placeholder="多个英文逗号分隔"></textarea>
        </div><button style="float: right;margin-right:20px;" class="layui-btn layui-btn-sm layui-btn-normal" id="lazadaAccount_save_btn">保存</button>
        <br>
        <fieldset class="layui-elem-field layui-field-title">
            <legend>设置过滤性感图片类目：</legend>
        </fieldset>
        <div class="layui-card-body">
            <div style="display: flex;justify-content: space-between">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="lazadaAccount_delete_btn">批量删除</button>
                <div>
                    <input class="layui-input" id="lazadaAccountlazadaCates" />
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="lazadaAccount_cate_select_btn">添加类目</button>
                </div>
<%--                <i class="layui-icon layui-icon-delete"--%>
<%--                   onclick="clearCateAndOtherElementArray('lazadaAccountLayer_category_text','lazadaAccountLayer_category_Id' ,'lazadaAccountLayer_category_cate_site_id')"--%>
<%--                   style="cursor:pointer" title="删除产品类目"></i>--%>
<%--                <input id="lazadaAccountLayer_category_Id" type="hidden" name="categoryId">--%>
            </div>
            <table class="layui-table" id="lazadaFilterSexImgTable" lay-filter="lazadaFilterSexImgTable"></table>
        </div>
    </div>
</script>
<script type="text/html" id="lazadaFilterSexImgTableBar">
   <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">移除</a>
</script>