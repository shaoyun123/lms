<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>alipay账号</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <button class="layui-btn layui-btn-sm" id="add_alipay">添加alipay</button>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="alipayAcctTable" lay-filter="alipayAcctTable" lay-even lay-skin="line" lay-size="lg"></table>
                </div>
            </div>
        </div>
    </div>
    <!-- 添加支付宝账号弹窗start-->
    <div class="disN"   id="addAlipayAcctlayer">
    	<div class="p20">
           <form action="" class="layui-form" id="addAlipayAcctForm" lay-filter="addAlipayAcctForm">
               <div class="layui-form-item">
                   <label class="layui-form-label">账号</label>
                   <div class="layui-input-block">
                       <input type="text"  name="alipayAcct"    class="layui-input" placeholder="请输入支付宝账号">
                       <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">所属公司</label>
                   <div class="layui-input-block">
                       <select name="companyName" id="addAplipayCompSelect"></select>
                        <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
                <div class="layui-form-item" style="display: none;">
					<div class="layui-input-block">
					 	 <button class="layui-btn" lay-submit="" lay-filter="addAlipayAcct" id="submitAddAlipayAcct">提交</button>
					 </div>
  				</div>
           </form>
        </div>
     </div>
     <!-- 添加支付宝账号弹窗end-->
     <!-- 修改支付宝账号弹窗start-->
    <script type="text/html"   id="updateAlipayAcctlayer">
    	<div class="p20">
           <form  class="layui-form" id="updateAlipayAcctForm" >
               <div class="layui-form-item">
                   <label class="layui-form-label">账号</label>
            	    <input type="hidden" name="id" class="layui-input" lay-verify="required">
                   <div class="layui-input-block">
                       <input type="text"  name="alipayAcct"  disabled="disabled"  class="layui-input"  placeholder="请输入支付宝账号">
                       <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">所属公司</label>
                   <div class="layui-input-block">
                       <select name="companyName"  id="updateAplipayCompSelect" ></select>
                        <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">账单下载</label>
                   <div class="layui-input-block">
                       <select name="autoDownloadBillStatus"  id="autoDownloadBillSelect" >
                           <option value=""></option>
                           <option value="true" >是</option>
                           <option value="false">否</option>
                       </select>
                       <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
                <div class="layui-form-item" style="display: none;">
					<div class="layui-input-block">
					 	 <button class="layui-btn" lay-submit="" lay-filter="updateAlipayAcct" id="submitUpdateAlipayAcct">提交</button>
					 </div>
  				</div>
           </form>
        </div>
     </script>
     <!-- 修改支付宝账号弹窗end-->
     <div class="layui-card-body">
            <!-- 表格的数据操作 -->
           <script type="text/html" id="alipay_operate"  >
 				<a class="layui-btn layui-btn-xs" lay-event="update">修改</a>
                 {{# if(d.status == true){ }}
                  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="stopUse">停用</a> {{# }else{ }}
                <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="openUse">启用</a> {{# } }}
                <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="authToken">授权</a>
                <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="cancelAuthToken">取消授权</a>
           </script>
     </div>
</div>

<script type="text/javascript" src="${ctx}/static/js/financial/alipay/alipayAcct.js"></script>
<script type="text/html" id="app_token_status_templet">
    <div>
        {{# if(d.appAuthToken != null){ }}
            已授权
        {{# }else{ }}
            未授权
        {{# } }}
    </div>
</script>
<script type="text/html" id="alipayGetAuthTokenLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="alipayGetAuthTokenForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤一：进入下方链接：登录支付宝账号，点击授权。复制网页地址栏中的app_auth_code参数</label>
                <div class="layui-input-block">
                    <input class="layui-input" value="https://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id=2019122060082148&redirect_uri=https%3a%2f%2flms.epean.com.cn"
                           onclick="var self = this;window.open(self.value)" style="cursor: pointer;color:blueviolet">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">步骤二：填入获取的code，点击获取token，即可获取token</label>
                <div class="layui-input-block">
                    <textarea type="text" name="code"  placeholder="请输入Code" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>