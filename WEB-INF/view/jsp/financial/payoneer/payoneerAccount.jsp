<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>Payoneer账号</title>
<style>
    .select2-container{
        z-index: 123456789;
    }
    .select2-container  .select2-dropdown.select2-dropdown--below{
        width: 850px!important;
    }
   #payoneerAccountAddForm .select2-container .select2-selection--multiple{
        box-sizing: border-box;
        cursor: pointer;
        display: block;
        height: 38px;
        width: 850px;
        user-select: none;
        -webkit-user-select: none;
    }
    #payoneerAccountAddForm .select2-container--default .select2-selection--multiple .select2-selection__rendered{
        box-sizing: border-box;
        list-style: none;
        margin: 0;
        padding:0 5px;
        width: 850px;
        height:100%
    }
    #payoneerAccountAddForm .select2-container--default .select2-selection--multiple .select2-selection__choice {
        padding: 3px 5px;
        background-color: #fbfbfb;
        border: 1px solid #e6e6e6;
    }
</style>
<div class="layui-fluid">
    <div class="layui-col-space15">
       <div class="layui-card" style="margin-top: 10px">
          <div class="layui-card-body">
            <form action="" class="layui-form" id="payoneerAcctSearchForm">
                <div class="layui-inline w100">
                    <div class="layui-input-inline">
                        <select name="status">
                            <option value="" selected="selected">状态</option>
                            <option value="true">启用中</option>
                            <option value="false">已停用</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline" style="width:180px">
                    <div class="layui-input-inline">
                        <input type="text" name="acct" placeholder="店铺名称" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" style="width:180px">
                    <select name="auditStatus" >
                        <option value="" >审核状态</option>
                        <option value="0">未绑定</option>
                        <option value="1">待审核</option>
                        <option value="2">审核通过</option>
                        <option value="3">审核失败</option>
                    </select>
                </div>
                <div class="layui-inline">
                    <div class="layui-input-inline">
                        <button type="button" class="layui-btn layui-btn-sm ml20 keyHandle" data-type="reload" id="payoneerSearch">搜索</button>
                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                    </div>
                </div>
            </form>
            <div class="poab">
                <div class="layui-inline">
                    <div class="layui-input-inline">
                        <button class="layui-btn layui-btn-sm" id="addAcct_payoneerAccount">新增payoneer账号</button>
                    </div>
                    <div class="layui-input-inline w100 layui-form" >
                        <select name="hello" lay-filter="operListBtn_payoneerAccount" >
                            <option value="" disabled selected>批量操作</option>
                            <option value="1">批量刷新Token</option>
                            <option value="2">批量刷新状态</option>
                            <option value="3">批量刷新余额</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>
       </div>
       <div class="layui-card" id="payoneerAccountCard">
          <div class="layui-card-body">
             <table class="layui-table" id="payoneerAcctTable" lay-filter="payoneerAcctTable"></table>
          </div>
       </div>
    </div>
</div>

        <!-- 工具条模板,写在script里面 -->
        <script type="text/html" id="payoneerTableBar">
            <a class="layui-btn layui-btn-xs" lay-event="toBindAcct">授权</a>
            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
        </script>

<script type="text/javascript" src="${ctx}/static/js/financial/payoneer/payoneerAccount.js"></script>

<!-- 新建账号 -->
<script type="text/html" id="addPayoneerInfoLayer">
   <div class="p20">
    <form action="" class="layui-form layui-form-pane" id="payoneerAccountAddForm"  lay-filter="payoneerAccountAddForm">
        <div class="layui-form-item">
            <label class="layui-form-label">账号</label>
            <div class="layui-input-block">
                <input type="text" name="acct" id="paypalEmail1" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea name="remark" placeholder="" class="layui-textarea"></textarea>
            </div>
        </div>
    </form>
   </div>
</script>

<!-- 绑定账号 modal -->
<script type="text/html" id="payoneerRestfulTokenModalLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="payoneerRestfulTokenAddForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：登录payoneer账号，确认授权</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="autoUrl" onclick="var self = this;window.open(self.value)" style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：刷新账号审核状态，当审核通过后，刷新token，以便后续余额、交易详情等查询</label>
            </div>
        </form>
    </div>
</script>

<script  type="text/html"  id="tokenExpireTime_payoneer">
    <div>
        {{# if (d.expiration) { }}
        {{ Format(d.expiration,"yyyy-M-d h:m:s")}}<i class="layui-icon layui-icon-refresh pointHand fr" lay-event="refreshToken"></i>
        <%--<span class="layui-badge" lay-event="refreshToken2" style="cursor:pointer">刷新token</span>--%>
        {{# } }}
    </div>
</script>

<!--payoneer账号审核状态-->
<script type="text/html" id="payoneerAcccount_auditStatus">
    <span style="">
                {{# if(d.auditStatus == 0){ }}
                    <span class="layui-skyblue">未绑定</span>
                {{# }else if (d.auditStatus == 1) { }}
                    <span class="layui-skyblue">待审核</span>
                {{# }else if (d.auditStatus == 2) { }}
                    <span class="layui-green">审核通过</span>
                {{# }else if (d.auditStatus == 3) { }}
                    <span class="layui-gray">审核失败</span>
                {{# }}}
        <i class="layui-icon layui-icon-refresh pointHand fr" lay-event="refreshStatus"></i>
            </span>
</script>

<script type="text/html" id="subAcct_payoneerAccount">
    <table style="width:100%">
        {{# for (var i in d.finPayoneerSubAcctDtoList) { }}
        <tr>
            <td>{{d.finPayoneerSubAcctDtoList[i].currency}}</td>
            <td>{{d.finPayoneerSubAcctDtoList[i].balance}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="payoneerAccount_balanceTime">
    <div>{{d.balanceTime ? (Format(new Date(d.balanceTime), "yyyy-MM-dd hh:mm:ss")) : ""}}
        {{# if (d.auditStatus == 2) {}}
        <i class="layui-icon layui-icon-refresh pointHand fr" lay-event="refreshBalance"></i>
        {{# } }}
    </div>
</script>