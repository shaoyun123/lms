<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>组织用户</title>
<%-- css代码 --%>
<style>
    .timetask_status_off{
        color: #909399;
        background-color: #f4f4f5;
        border-color: #e9e9eb;
        padding: 5px;
        border-radius: 5px;
    }
    .timetask_status_on{
        color: #67c23a;
        background-color: #f0f9eb;
        border:1px solid #e1f3d8;
        padding: 5px;
        border-radius: 5px;
    }
    /* 表格样式 */
    #LAY-configuration-staff-organization td .layui-table-cell {
        height: inherit;
        line-height: 15px;
        white-space: normal;
        overflow: visible;
        word-wrap: break-word
    }

    .mt10 {
        margin-top: 10px
    }

    .orgFlexLayout {
        display: flex;
        flex-direction: column;
        align-items: baseline;
    }

    .orgFlexLayout-item {
        margin-bottom: 10px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .fsize18 {
        font-weight: bold;
        font-size: 18px;
        margin: 10px;
    }

    .bordereee {
        border: 1px solid #eee;
        border-radius: 20px;
        padding: 10px;
    }
</style>
<%-- html代码 --%>
<div class="layui-fluid" id="LAY-configuration-staff-organization">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <div>
                    <permTag:perm funcCode="addOrgBtn">
                        <button class="layui-btn layui-btn-sm" id="addSysOrgBtn">添加组织</button>
                    </permTag:perm>
                    <permTag:perm funcCode="editSysOrgBtn">
                        <button disabled class="layui-btn  layui-btn-sm" id="editSysOrgBtn">修改组织</button>
                    </permTag:perm>
                    <permTag:perm funcCode="delSysOrgBtn">
                        <button disabled class="layui-btn  layui-btn-sm" id="delSysOrgBtn">删除组织</button>
                    </permTag:perm>
                    <permTag:perm funcCode="addSysUserBtn">
                        <button class="layui-btn layui-btn-sm" id="addSysUserBtn">添加用户</button>
                    </permTag:perm>
                    <button class="layui-btn layui-btn-sm" id="singleDownStoreTemplateBtn"
                            onclick="javascript: window.open('${ctx}/sys/singleStoreAcctTemplateDownload.html')">
                        单人授权店铺模板下载
                    </button>
                    <button class="layui-btn layui-btn-sm" id="multipleDownStoreTemplateBtn"
                            onclick="javascript: window.open('${ctx}/sys/multipleStoreAcctTemplateDownload.html')">
                        多人授权店铺模板下载
                    </button>
                    <button class="layui-btn layui-btn-sm" id="multipleDownStoreImportBtn">多人授权店铺模板导入</button>
                    <button class="layui-btn layui-btn-sm" id="allResource">查看系统功能</button>
                </div>
                <div class="poab" style="top:10px;">
                    <form action="" class="layui-form" id="userSearchForm">
                        <div class="layui-inline">
                            <div class="layui-input-inline" style="width:110px">
                                <select name="status" id="userStatusSel" lay-search>
                                    <option value="">全部</option>
                                    <option value="true" selected="selected">启用中</option>
                                    <option value="false">已停用</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline" style="width:110px">
                                <select name="companyName" id="userCompanyNameSel" lay-search>
                                    <option value="" selected="selected">所属公司</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline" style="width:150px">
                                <input type="text" name="loginName" placeholder="登录名" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline" style="width:150px">
                                <input type="text" name="roleName" placeholder="角色名称" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit=""
                                        data-type="reload" id="userSearchBtn">搜索用户
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="layui-card" style="overflow:hidden">
            <div class="layui-card-body">
                <div class="layui-col-md3">
                    <div style="display: inline-block; padding: 4px; overflow: auto;">
                        <form class="layui-form" id="orgTreeForm">
                            <div id="orgXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
                        </form>
                    </div>
                </div>
                <div class="layui-col-md9">
                    <table class="layui-table" id="userTable" lay-filter="userTable"></table>
                    <script type="text/html" id="userLeaderBar">
                    {{# if(d.isLeader == true){ }}
                    <span>是</span> {{# } else { }}
                    <span></span> {{# } }}
                    </script>
                    <script type="text/html" id="userStatusBar">
                    {{# if(d.status == true){ }}
                    <span>启用中</span> {{# } else { }}
                    <span><font style="color: red">停用中</font></span> {{# } }}
                    </script>
                    <script type="text/html" id="userGenderBar">
                    {{# if(d.gender != null){ }} {{# if(d.gender == true){ }}
                    <span>男</span> {{# } else { }}
                    <span>女</span> {{# } }} {{# } }}
                    </script>
                    <script type="text/html" id="userRoleBar">
                    {{# if(d.sysRoles.length == 0){ }} {{# } else { }} {{# layui.each(d.sysRoles, function(index, item){ }} {{# if( item.name != undefined ){ }}
                    <span>{{ item.name }}</span><br/> {{# } }} {{# }); }} {{# } }}
                    </script>

                    <script type="text/html" id="userOperBar">
                    <div class="orgFlexLayout">
                        {{# if(d.buttonAuditAuth){ }}
                        <div class="orgFlexLayout-item">
                            <permTag:perm funcCode="organizationAuthCate">
                                <button class="layui-btn layui-btn-xs" id="organizationAuthCate"
                                        lay-event="organizationAuthCate">授予类目
                                </button>
                            </permTag:perm>
                            <permTag:perm funcCode="authResource">
                                <button class="layui-btn layui-btn-xs" lay-event="authResource">授予资源</button>
                            </permTag:perm>
                        </div>
                        <div class="orgFlexLayout-item">
                            <permTag:perm funcCode="authStoreAcct">
                                <input type="hidden" id="authUserId"/>
                                <button class="layui-btn layui-btn-xs" lay-event="authStoreAcct">授予店铺</button>
                            </permTag:perm>
                            <permTag:perm funcCode="authWarehouseForUser">
                                <button class="layui-btn layui-btn-xs" lay-event="authWarehouseForUser">授予仓库</button>
                            </permTag:perm>

                        </div>
                        <div class="orgFlexLayout-item">
                          <permTag:perm funcCode="authTimetaskForUserPerm">
                            <button class="layui-btn layui-btn-xs" lay-event="authTimetask" type="button">授予报表</button>
                          </permTag:perm>
                          <permTag:perm funcCode="authLabelDictForUserPerm">
                            <button class="layui-btn layui-btn-xs" lay-event="authLabelDict" type="button">授予字典</button>
                          </permTag:perm>
                        </div>
                        <div>
                            <permTag:perm funcCode="editUser">
                                <button class="layui-btn layui-btn-xs" lay-event="editUser">编辑</button>
                            </permTag:perm>
                            <permTag:perm funcCode="authStoreAcctAndPayPal">
                                <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="import"
                                        id="organization_import{{d.id}}" title="导入PayPal授权">导入
                                </button>
                            </permTag:perm>
                                {{# if(d.status == 1){ }}
                            <permTag:perm funcCode="offStoreAcct">
                                <button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="disableStoreAcct"
                                        style="margin-left: 10px">
                                    停用
                                </button>
                            </permTag:perm>
                                {{# }else{ }}
                            <permTag:perm funcCode="onStoreAcct">
                                <button class="layui-btn layui-btn-warm layui-btn-xs" lay-event="enableStoreAcct"
                                        style="margin-left: 10px">启用
                                </button>
                            </permTag:perm>
                                {{# } }}
                        </div>
                        {{# } }}
                    </div>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 类目表 -->
<script type="text/html" id="organization_cateLayer">
<div class="layui-form">
    <div style="margin: 10px">
                <span style="width: 60%;float: left;margin-right: 20px">
                    <input class="layui-input" id="organization_cateSearchInp" placeholder="类目搜索">
                </span>
        <span class="layui-btn layui-btn-sm" id="organization_searchCateBtn">搜索</span>
    </div>
    <div id="organization_cateXTree"></div>
</div>
<form class="layui-form" id="organization_cateForm">
    <input type="hidden" name="cateIds" id="organization_cateIds">
    <span id="organization_cateName"></span>
</form>
</script>

<!-- 添加组织弹框 -->
<div class="disN" id="orgManageLayer">
    <div class="p20">
        <form class="layui-form layui-form-pane" id="addOrgForm">
            <div class="layui-form-item">
                <label class="layui-form-label">组织名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" class="layui-input" lay-verify="required|uniqueOrg" placeholder="必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组织代号</label>
                <div class="layui-input-block">
                    <input type="text" name="code" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" lay-filter="addPOrgIdSel">
                <label class="layui-form-label">上级组织</label>
                <div class="layui-input-block">
                    <select name="pOrgId" lay-filter="pOrg" id="addpOrgSel" lay-verify="required" lay-search>
                        <option value="" selected>请选择</option>
                        <option value="0">无上级组织</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组织排序</label>
                <div class="layui-input-block">
                    <input type="number" name="sort" min="0" class="layui-input" placeholder="同级组织的排序">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit='' lay-filter="addOrg" id="submitAddOrg">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- 编辑组织弹框 -->
<div class="disN" id="editOrgManageLayer" lay-filter="editOrgManageLayer">
    <div class="p20">
        <form class="layui-form layui-form-pane" id="editOrgForm">
            <input type="hidden" name="id" class="layui-input" lay-verify="required">
            <div class="layui-form-item">
                <label class="layui-form-label">组织名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" class="layui-input" lay-verify="required|uniqueOrg" placeholder="必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组织代号</label>
                <div class="layui-input-block">
                    <input type="text" name="code" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">上级组织</label>
                <div class="layui-input-block">
                    <select name="pOrgId" lay-filter="pOrg" id="editpOrgSel" lay-verify="required" lay-search>
                        <option value="" selected>请选择</option>
                        <option value="0">无上级组织</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">组织排序</label>
                <div class="layui-input-block">
                    <input type="number" name="sort" min="0" class="layui-input" placeholder="同级组织的排序">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea placeholder="请输入内容" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
            <div class="layui-form-item" style="display:none">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit lay-filter="editOrgBtn" id="submitEditOrg">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- 授与资源弹出框 -->
<div class="disN" id="resourceTreeLayer">
    <div class="p20">
        <form class="layui-form" id="resourceForm">
            <input type="hidden" name="id" class="layui-input">
            <div id="resourceXTree" style=" width:500px;padding: 10px 0 25px 5px;"></div>
        </form>
    </div>
</div>
<script type="text/html" id="acctTreeLayer">
<input id="organization_input_userid" type="hidden">
<div class="layui-card" style="box-shadow:none;">
    <div class="layui-card-body">
        <!-- <div class="layui-col-md12 fsize18">
            授予平台
        </div>
        <div class="layui-col-md12 bordereee">
            <span style="color:red">*</span>
            若选中“平台”保存，新增该平台店铺时，默认继承授权。
            <div class="layui-form" id="userPlatAuthAddForm">
            </div>
        </div> -->
        <div class="layui-col-md12 fsize18">
            授予店铺
        </div>
        <div class="layui-col-md12">
            <div class="layui-col-md6">
                <form class="layui-form bordereee" id="organization_layerform1">
                    未授权店铺
                    <div class="layui-form-item dis_flex">
                        <select name="platCode" id="organization_searchCondition1_platcode" xm-select="organization_searchCondition1_platcode" xm-select-search 
                            xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                        <input class="layui-input" placeholder="多值逗号分隔" id="organization_searchCondition1">
                        <a class="layui-btn layui-btn-sm layui-btn-normal" id="organizationSearchBtn_unAuthorized">查找</a>
                        <a class="layui-btn layui-btn-sm layui-btn-normal" id="organizationExportBtn_unAuthorized">导出</a>
                    </div>
                    <div class="layui-form-item dis_flex">
                        <a class="layui-btn layui-btn-sm layui-btn-normal"
                           id="organization_add_authorization">批量添加授权</a>
                        <span>已选择：<span name="checkData">0</span></span>
                    </div>
                    <table id="acctTreeLayerTable1" lay-filter="acctTreeLayerTable1"></table>
                    <input type="hidden" name="page" value="1">
                    <input type="hidden" name="limit" value="100">
                    <div id="acctTreeLayerTablepage1"></div>
                </form>

            </div>
            <div class="layui-col-md6">
                <form class="layui-form bordereee" id="organization_layerform2">
                    已授权店铺
                    <div class="layui-form-item dis_flex">
                        <select name="platCode" id="organization_searchCondition2_platcode" xm-select="organization_searchCondition2_platcode" xm-select-search 
                            xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                        <input class="layui-input" placeholder="多值逗号分隔" id="organization_searchCondition2">
                        <a class="layui-btn layui-btn-sm layui-btn-normal" id="organizationSearchBtn_authorized">查找</a>
                        <a class="layui-btn layui-btn-sm layui-btn-normal" id="organizationExportBtn_authorized">导出</a>
                    </div>
                    <div class="layui-form-item dis_flex">
                        <a class="layui-btn layui-btn-sm layui-btn-normal"
                           id="organization_delete_authorization">批量移除授权</a>
                        <span>已选择：<span name="checkData">0</span></span>
                    </div>
                    <table id="acctTreeLayerTable2" lay-filter="acctTreeLayerTable2"></table>
                    <input type="hidden" name="page" value="1">
                    <input type="hidden" name="limit" value="100">
                    <div id="acctTreeLayerTablepage2"></div>
                </form>

            </div>
        </div>
    </div>
</div>
</script>
<script type="text/html" id="acctTreeLayerTableBtn1">
<a style="color:#1E9FFF" lay-event="create">添加授权</a>
</script>
<script type="text/html" id="acctTreeLayerTableBtn2">
<a style="color:#1E9FFF" lay-event="delete">移除授权</a>
</script>
<!-- 授与paypal账号弹出框 -->
<div class="disN" id="paypalTreeLayer">
    <div class="p20">
        <%--<blockquote class="layui-elem-quote" style="padding: 10px;">--%>
        <%--若选中“平台”保存，新增该平台店铺时，默认继承授权；<br/> 若选中“全选”，新增任何店铺时，默认继承授权。--%>
        <%--</blockquote>--%>
        <form class="layui-form" id="paypalForm">
            <input type="hidden" name="id" class="layui-input">
            <div id="paypalXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
        </form>
    </div>
</div>

<!-- 添加用户弹框 -->
<div class="disN" id="addUserLayer">
    <div class="p20">
        <form class="layui-form layui-form-pane " action="" id="addUserForm">
            <input type="hidden" name="id" class="layui-input">
            <div class="layui-form-item">
                <label class="layui-form-label">登录名</label>
                <div class="layui-input-block">
                    <input type="text" name="loginName" class="layui-input" lay-verify="required|uniqueLoginName"
                           placeholder="必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">登录密码</label>
                <div class="layui-input-block" style="display:flex;justify-content:flex-start;">
                    <input type="text" name="loginPwd" id="loginPwd" class="layui-input" lay-verify="required"
                           placeholder="必填">
                    <a class="layui-btn layui-btn-sm" style="margin: 0 10px;" onclick="set_org_pwdRandom(this)">随机密码</a>
                    <a class="layui-btn layui-btn-sm layui-btn-primary" onclick="set_org_pwdNumRandom(this)">简易密码</a>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">属于组织</label>
                <div class="layui-input-block">
                    <select name="orgId" id="addOrgSel" lay-verify="required" lay-search>
                        <option value="" selected>请选择组织</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">属于公司</label>
                <div class="layui-input-block">
                    <select name="companyName" id="addCompanyNameSel" lay-verify="required" lay-search>
                        <option value="" selected>请选择公司</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">姓名</label>
                <div class="layui-input-block">
                    <input type="text" name="userName" class="layui-input" placeholder="必填，真实姓名" lay-verify="required">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">性别</label>
                <div class="layui-input-block">
                    <select name="gender" lay-filter="gender" lay-search>
                        <option value="" selected>请选择</option>
                        <option value="true">男</option>
                        <option value="false">女</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" lay-filter="birthday">
                <label class="layui-form-label">生日</label>
                <div class="layui-input-block">
                    <input type="text" name="birthdayStr" class="layui-input" id="addBirthday">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">邮箱</label>
                <div class="layui-input-block">
                    <input type="text" name="email" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">手机</label>
                <div class="layui-input-block">
                    <input type="text" name="mobile" class="layui-input">
                </div>
            </div>
            <%--<div class="layui-form-item">
    <label class="layui-form-label">地址</label>
    <div class="layui-input-block">
    <input type="text" name="address"  class="layui-input">
    </div>
    </div>--%>
            <div class="layui-form-item" pane=''>
                <label class="layui-form-label">部门主管</label>
                <div class="layui-input-block">
                    <input id="addUserCheckBox" type="checkbox" name="isLeader" value="true" lay-text="是|否"
                           lay-skin="switch">
                </div>
            </div>
            <div class="layui-form-item" pane=''>
                <label class="layui-form-label">角色</label>
                <div class="layui-input-block" id="addRoleDiv">

                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="addUser" id="submitAddUser">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- 编辑用户弹框 -->
<div class="disN" id="editUserLayer">
    <div class="p20">
        <form class="layui-form layui-form-pane " action="" id="editUserForm" lay-filter="editUserForm">
            <input name="id" type="hidden" class="layui-input">
            <div class="layui-form-item">
                <label class="layui-form-label">登录名</label>
                <div class="layui-input-block">
                    <input type="text" name="loginName" class="layui-input" lay-verify="required|uniqueLoginName"
                           placeholder="必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">登录密码</label>
                <div class="layui-input-block" style="display:flex;justify-content:flex-start;">
                    <input type="text" lay-verify="pass" lay-verType="tips" name="loginPwd" id="editLoginPwd" class="layui-input" placeholder="不填则为不修改密码">
                    <a class="layui-btn layui-btn-sm" style="margin: 0 10px;" onclick="set_org_pwdRandom(this)">随机密码</a>
                    <a class="layui-btn layui-btn-sm layui-btn-primary" onclick="set_org_pwdNumRandom(this)">简易密码</a>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">属于组织</label>
                <div class="layui-input-block">
                    <select name="orgId" id="editOrgSel" lay-search>
                        <option value="" selected>请选择</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">属于公司</label>
                <div class="layui-input-block">
                    <select name="companyName" id="editCompanyNameSel" lay-verify="required" lay-search>
                        <option value="" selected>请选择公司</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">姓名</label>
                <div class="layui-input-block">
                    <input type="text" name="userName" class="layui-input" placeholder="必填，真实姓名" lay-verify="required">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">性别</label>
                <div class="layui-input-block">
                    <select name="gender" lay-filter="gender" id="editGenderSel" lay-search>
                        <option value="" selected>请选择</option>
                        <option value="true">男</option>
                        <option value="false">女</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" lay-filter="birthday">
                <label class="layui-form-label">生日</label>
                <div class="layui-input-block">
                    <input type="text" name="birthdayStr" id="editBirthday" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">邮箱</label>
                <div class="layui-input-block">
                    <input type="text" name="email" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">手机</label>
                <div class="layui-input-block">
                    <input type="text" name="mobile" class="layui-input">
                </div>
            </div>
            <%--<div class="layui-form-item">
    <label class="layui-form-label">地址</label>
    <div class="layui-input-block">
    <input type="text" name="address"  class="layui-input">
    </div>
    </div>--%>
            <div class="layui-form-item" pane>
                <label class="layui-form-label">部门主管</label>
                <div class="layui-input-block">
                    <input id="editUserCheckBox" type="checkbox" name="isLeader" value="true" lay-text="是|否"
                           lay-skin="switch">
                </div>
            </div>
            <div class="layui-form-item" pane>
                <label class="layui-form-label">角色</label>
                <div class="layui-input-block" id="editRoleDiv">

                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="*" lay-filter="editUserBtn" id="submitEditUser">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</div>
<-- 授权仓库模板 -->
<script type="text/html" id="org_authWarehouseTpl">
<form id="org_authWarehouseForm" class="layui-form p20">
    <div class="layui-form-item">
        <label class="layui-form-label">仓库:</label>
        <div class="layui-input-block">
            <input lay-filter="org_checkProdhouseAll" type="checkbox" name="checkAll" lay-skin="primary" title="全部"> {{#
            layui.each(d, function(index, item){ }}
            <input lay-filter="org_checkProdhouseOne" type="checkbox" name="prodWarehouse" value="{{item.id}}"
                   lay-skin="primary" title="{{item.warehouseName}}"> {{# }); }}
        </div>
    </div>
</form>
</script>


//授予标签字典
<script type="text/html" id="org_authLabelDictLayer">
  <div style="padding:20px;">
    <table class="layui-table" id="org_authLabelDictLayer_table"></table>
  </div>
</script>
//授予报表
<script type="text/html" id="org_authTimetaskLayer">
  <div style="padding:20px;" class="layui-form">
      <div class="layui-form-item layui-row">
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label">状态</label>
            <div class="layui-input-block">
                <select lay-search name="status">
                    <option value=""></option>
                    <option value="1">已启用</option>
                    <option value="0">未启用</option>
                </select>
            </div>
        </div>

        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label">报表名称</label>
            <div class="layui-input-block">
                <input type="text" name="name" autocomplete="false" class="layui-input">
            </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
          <div class="layui-input-block">
          <span class="layui-btn layui-btn-sm layui-btn-normal" id="org_authTimetaskLayer_searchBtn">定位</span>
          </div>
        </div>
      </div>
    <table class="layui-table" id="org_authTimetaskLayer_table"></table>
  </div>
</script>
<%-- 表格---状态 --%>
<script type="text/html" id="org_timetask_status">
<div>
    {{# if(d.status){ }}
    <span class="timetask_status_on">已启用</span>
    {{# }else{ }}
    <span class="timetask_status_off">未启用</span>
    {{# } }}
</div>
</script>
<%-- 表格---定时发送日期 --%>
<script type="text/html" id="org_timetask_sendDays">
<div class="alignLeft">
    <p>
        <span class="daysCss">几号:</span>
        <span>{{d.exportDays || ''}}</span>
    </p>
    <p>
        <span class="daysCss">周几:</span>
        <span>{{d.exportWeeks || ''}}</span>
    </p>
</div>
</script>
<%-- 表格---收件人 --%>
<script type="text/html" id="org_timetask_recipientIds">
{{# if(d.recipients && d.recipients.length>0){ }}
{{#  layui.each(d.recipients, function(index, item){ }}
<span>{{item.userName}}</span>,
{{# }); }}
{{# } }}
</script>


<script type="text/javascript" src="${ctx}/static/request.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/javascript" src="${ctx}/static/js/configuration/staff/organization.js"></script>