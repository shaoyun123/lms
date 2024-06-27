<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>华为云隐私号</title>
<div class="layui-fluid">
    <div class="layui-col-space15">
        <div class="layui-card" style="margin-top: 10px">
            <div class="layui-card-body">
                <form action="" class="layui-form" id="hwcPhoneSearchForm">
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">虚拟号码</label>
                        <div class="layui-input-block">
                            <input type="text" name="virtualPhoneListStr" placeholder="精确查询，多个用逗号隔开"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">真实号码</label>
                        <div class="layui-input-block">
                            <input type="text" name="realPhoneListStr" placeholder="精确查询，多个用逗号隔开" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <div class="layui-input-inline">
                            <button type="button" class="layui-btn layui-btn-sm ml20 keyHandle" data-type="reload"
                                    id="hwcPhoneSearch">搜索
                            </button>
                            <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                        </div>
                    </div>
                </form>
                <div class="poab">
                    <div class="layui-inline">
                        <div class="layui-input-inline">
                            <button class="layui-btn layui-btn-sm" id="hwcPhone_refreshAllPhone">同步号码</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-card" id="hwcPhoneCard">
            <div class="layui-card-header">
                <div class="fr">
                    <button class="layui-btn layui-btn-sm layui-btn-warm" id="hwcPhone_batchAuthBtn">批量授权</button>
                    <button class="layui-btn layui-btn-sm layui-btn-danger" id="hwcPhone_batchUnAuthBtn">批量解除授权</button>
                    <button class="layui-btn layui-btn-sm" id="hwcPhone_batchbindBtn">批量绑定</button>
                    <button class="layui-btn layui-btn-sm layui-btn-warm" id="hwcPhone_batchUnbindBtn">批量解绑</button>
                </div>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="hwcPhoneTable" lay-filter="hwcPhoneTable"></table>
            </div>
        </div>
    </div>
</div>

<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="hwcPhoneTableBar">
<a class="layui-btn layui-btn-xs" lay-event="toBindAcct">授权</a>
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/huaweicloud/hwcPhone.js"></script>

<script type="text/html" id="hwcPhone_authUserListTpl">
<div class="alignLeft">
    <input type="hidden" class="hwcPhone_authUserBox_id" value="{{d.id}}">
    {{# if (d.authUserIdListStr) {}}
    {{# let authUserIdList = d.authUserIdListStr.split(','); let authUserNameList = d.authUserNameListStr.split(','); }}
    {{# for (let i = 0; i < authUserIdList.length; ++i) { }}
    <div class="layui-btn layui-btn-xs hwcPhone_authUserBox" data-id="{{authUserIdList[i]}}"
         data-name="{{authUserNameList[i]}}">{{authUserNameList[i]}}
    </div>
    {{# } }}
    {{# } }}
</div>
</script>

<script type="text/html" id="hwcPhone_authUserPop">
<div class="p20">
    <form class="layui-form" id="hwcPhone_authUserForm" lay-filter="hwcPhone_authUserForm">
        <div class="layui-card">
            <div class="ml20" id="hwcPhone_bindUserContains" style="line-height: 25px;">
            </div>
        </div>
    </form>
</div>
</script>

<script type="text/html" id="hwcPhone_batchBindPop">
<div class="p20">
    <form class="layui-form" id="hwcPhone_batchBindForm" lay-filter="hwcPhone_batchBindForm" autocomplete="off">
        <div class="layui-form-item">
            <label class="layui-form-label">手机号码</label>
            <div class="layui-input-block">
                <input class="layui-input" name="realPhone" maxlength="11" placeholder="11位手机号码">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">归属人</label>
            <div class="layui-input-block">
                <input class="layui-input" name="belonger" placeholder="归属人">
            </div>
        </div>
    </form>
</div>
</script>