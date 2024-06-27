<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>黑名单地址</title>
<style type="text/css">
    .blacklist_header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .blacklistDetailDefault{
        text-align:left;
    }
    .blacklistDetailHidden{
        overflow:hidden;
        max-height:135px;
    }
    .blacklistDetailShow{
        overflow:inherit;
        max-height:10000px;
    }
    .blacklist_expand {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .newAddBlackListForm {
        padding: 10px 52px 20px 0;
    }
    .newAddBlackListCondition{
        display: flex;
        padding: 10px 52px 20px 45px;
    }
    .newAddBlackListCondition .newAddBlackListCondition_left {
        width: 800px;
        min-height: 420px;
        overflow-y:auto;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
    }
    .newAddBlackListCondition .newAddBlackListCondition_right {
        width: 200px;
        min-height: 420px;
        margin-left: 20px;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
    }
    .newAddBlackListCondition_left .newAddBlackListCondition_left_title,
    .newAddBlackListCondition_right .newAddBlackListCondition_right_title{
            height: 28px;
            line-height: 28px;
            background: #eee;
            border-bottom: 1px solid #ccc;
            padding-left: 20px;
    }
    .newAddBlackListCondition_right .newAddBlackListCondition_right_body {
        padding: 20px 0 0 20px;
    }
    #blacklistLeftChooseCondition,
    #blacklistLeftChooseCondition li {
        padding: 5px;
    }
    .blacklist_center {
        padding: 20px;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                     <form class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">规则状态</label>
                                <div class="layui-input-block">
                                    <select lay-search name="status" lay-search>
                                        <option value="true">启用</option>
                                        <option value="false">停用</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">规则名称</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="ruleName">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="remark">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1" style="padding-left:5px;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="blacklist_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 操作 --%>
            <div class="layui-card">
                <div class="layui-card-header blacklist_header">
                    <a class="layui-btn layui-btn-sm layui-btn-normal" id="blacklist_newAdd">新增</a>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="blacklist_table" lay-filter="blacklist_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 表格详情渲染 --%>
<script type="text/html" id="blacklist_ruleDetail">
    <div class="blacklistDetailHidden blacklistDetailDefault">
        <div class="blacklistDetailDiv">
                <%-- 国家 --%>
                {{# if(d.detail.country){  }}
                    {{# if(d.detail.country.shippingCountryName.length){  }}
                    <div>
                        <strong>国家/地区是:</strong>
                        {{# layui.each(d.detail.country.shippingCountryName, function(index, item){ }}
                        <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 州/省 --%>
                {{# if(d.detail.province){  }}
                    {{# if(d.detail.province.ruleValueList.length){  }}
                    <div>
                    <strong>州/省是:</strong>
                        {{# layui.each(d.detail.province.ruleValueList, function(index, item){ }}
                        <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 城市 --%>
                {{# if(d.detail.city){  }}
                    {{# if(d.detail.city.ruleValueList.length){  }}
                    <div>
                        <strong>城市是:</strong>
                        {{# layui.each(d.detail.city.ruleValueList, function(index, item){ }}
                        <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 收货地址1 --%>
                {{# if(d.detail.addressOne){  }}
                    {{# if(d.detail.addressOne.ruleValueList.length){  }}
                    <div>
                        <strong>收货地址1是:</strong>
                        {{# layui.each(d.detail.addressOne.ruleValueList, function(index, item){ }}
                            <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 收货地址2 --%>
                {{# if(d.detail.addressTwo){  }}
                    {{# if(d.detail.addressTwo.ruleValueList.length){  }}
                    <div>
                            <strong>收货地址2是:</strong>
                            {{# layui.each(d.detail.addressTwo.ruleValueList, function(index, item){ }}
                            <span>{{item}};</span>
                            {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 收货邮编 --%>
                {{# if(d.detail.zip){  }}
                    {{# if(d.detail.zip.ruleValueList.length){  }}
                    <div>
                            <strong>邮编是:</strong>
                            {{# layui.each(d.detail.zip.ruleValueList, function(index, item){ }}
                            <span>{{item}};</span>
                            {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 收件人姓名 --%>
                {{# if(d.detail.buyer){  }}
                    {{# if(d.detail.buyer.ruleValueList.length){  }}
                    <div>
                            <strong>收件人是:</strong>
                            {{# layui.each(d.detail.buyer.ruleValueList, function(index, item){ }}
                            <span>{{item}};</span>
                            {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 收件人电话 --%>
                {{# if(d.detail.phone){  }}
                    {{# if(d.detail.phone.ruleValueList.length){  }}
                    <div>
                        <strong>收件人电话是:</strong>
                        {{# layui.each(d.detail.phone.ruleValueList, function(index, item){ }}
                        <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
                <%-- 付款邮箱 --%>
                {{# if(d.detail.email){  }}
                    {{# if(d.detail.email.ruleValueList.length){  }}
                    <div>
                        <strong>付款邮箱是:</strong>
                        {{# layui.each(d.detail.email.ruleValueList, function(index, item){ }}
                            <span>{{item}};</span>
                        {{# }) }}
                    </div>
                    {{# } }}
                {{# } }}
        </div>
    </div>
</script>
<%-- 表格操作弹框 --%>
<script type="text/html" id="blacklist_tableIdBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="edit">修改</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</a></div>
    {{# if(!d.status){  }}
        <div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="enable">启用</a></div>
    {{# }else{ }}
        <div><a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">停用</a></div>
    {{# } }}
    <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a></div>
</script>

<%-- 新增/编辑/复制黑名单地址弹框 --%>
<script type="text/html" id="blacklist_newAddBlacklist">
    <div id="newAddBlackListContainer"></div>
</script>
<%-- 新增/编辑/复制黑名单地址弹框模板--%>
<script type="text/html" id="newAddBlackListContainerTpl">
    <%-- 表单元素 --%>
    {{# if(d.id){ }}
     <input type="hidden" name="id" value="{{d.id}}"> 
    {{# } }}

    {{# if(d.priority){ }}
     <input type="hidden" name="priority" value="{{d.priority}}"> 
    {{# } }}

    <input type="hidden" name="status" value="{{d.status}}"> 
    <div class="layui-form newAddBlackListForm">
        <div class="layui-form-item">
            <label class="layui-form-label">规则名称</label>
            <div class="layui-input-block">
            <input type="text" name="ruleName" autocomplete="off" class="layui-input" value="{{d.ruleName}}">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
            <input type="text" name="remark" autocomplete="off" class="layui-input" value="{{d.remark}}">
            </div>
        </div>
    </div>
    <%-- 条件选择 --%>
    <div class="newAddBlackListCondition">
        <%-- 已选条件 --%>
        <div class="newAddBlackListCondition_left">
            <div class="newAddBlackListCondition_left_title">
                已选条件
            </div>
            <div class="newAddBlackListCondition_left_body">
                <ul id="blacklistLeftChooseCondition">
                 {{# if(d.detail.country){ }}
                        <li ztt-name="country">
                            <strong>国家/地区是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="country">{{d.detail.country.shippingCountryName[0] }}</a>
                            <input type="hidden" name="ztt-country-code" value='{{JSON.stringify(d.detail.country)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.province){ }}
                        <li ztt-name="province">
                            <strong>州/省是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="province">{{d.detail.province.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-province-code" value='{{JSON.stringify(d.detail.province)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.city){ }}
                        <li ztt-name="city">
                            <strong>城市是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="city">{{d.detail.city.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-city-code" value='{{JSON.stringify(d.detail.city)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.addressOne){ }}
                        <li ztt-name="addressOne">
                            <strong>收货地址1是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="addressOne">{{d.detail.addressOne.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-addressOne-code" value='{{JSON.stringify(d.detail.addressOne)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.addressTwo){ }}
                        <li ztt-name="addressTwo">
                            <strong>收货地址2是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="addressTwo">{{d.detail.addressTwo.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-addressTwo-code" value='{{JSON.stringify(d.detail.addressTwo)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.zip){ }}
                        <li ztt-name="zip">
                            <strong>收货邮编是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="zip">{{d.detail.zip.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-zip-code" value='{{JSON.stringify(d.detail.zip)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.buyer){ }}
                        <li ztt-name="buyer">
                            <strong>收件人姓名是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="buyer">{{d.detail.buyer.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-buyer-code" value='{{JSON.stringify(d.detail.buyer)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.phone){ }}
                        <li ztt-name="phone">
                            <strong>收件人电话是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="phone">{{d.detail.phone.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-phone-code" value='{{JSON.stringify(d.detail.phone)}}'>
                        </li>
                 {{# } }}
                 {{# if(d.detail.email){ }}
                        <li ztt-name="email">
                            <strong>付款邮箱是:</strong>
                            <a href="javascript:;" class="ztt-a" ztt-key="email">{{d.detail.email.ruleValueList[0] }}</a>
                            <input type="hidden" name="ztt-email-code" value='{{JSON.stringify(d.detail.email)}}'>
                        </li>
                 {{# } }}
                </ul>
            </div>
        </div>
        <%-- 选择条件 --%>
        <div class="newAddBlackListCondition_right">
            <div class="newAddBlackListCondition_right_title">
                选择条件
            </div>
            <div class="newAddBlackListCondition_right_body">
                {{#  layui.each(d.conditionArr, function(index, item){ }}
                    {{# if(d.detail[item.key]){ }}
                    <div class="layui-form">
                        <input type="checkbox" lay-filter="blackListCondition" lay-skin="primary" title="{{item.value}}" 
                        name="{{item.key}}" checked>
                    </div>
                    {{#  }else{ }}
                    <div class="layui-form">
                        <input type="checkbox" lay-filter="blackListCondition" lay-skin="primary" title="{{item.value}}" 
                        name="{{item.key}}">
                    </div>
                    {{# } }}
                <br />
               {{#  }) }}
            </div>
        </div>
    </div>
</script>

<%-- 国家弹框 --%>
<script type="text/html" id="blacklist_countryEdit">
  <div id="blacklist_countryEditContainer"  class="blacklist_center"></div>
</script>
<script type="text/html" id="blacklist_countryEditContainerTpl">
<div class="layui-form">
 <select name="blacklist_country" lay-search>
    <option value=""></option>
    {{# if(d.countries){ }}
        {{#  layui.each(d.countries, function(index, item){ }}
          {{# if(d.default == item.abbr){ }}
            <option value="{{item.abbr}}" selected>{{item.name}}({{item.abbr}})</option>
          {{# }else{ }}
            <option value="{{item.abbr}}">{{item.name}}({{item.abbr}})</option>
          {{# } }}
        {{#  }) }}
    {{# } }}
 </select>
</div>
</script>

<%-- 州省弹框 --%>
<script type="text/html" id="blacklist_provinceEdit">
  <div id="blacklist_provinceEditContainer" class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_provinceEditContainerTpl">
      <input type="text" class="layui-input" name="blacklist_province" value="{{d.default}}">
</script>

<%-- 城市弹框 --%>
<script type="text/html" id="blacklist_cityEdit">
  <div id="blacklist_cityEditContainer" class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_cityEditContainerTpl">
    <input type="text" class="layui-input" name="blacklist_city" value="{{d.default}}">
</script>

<%-- 收件人弹框 --%>
<script type="text/html" id="blacklist_buyerEdit">
  <div id="blacklist_buyerEditContainer" class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_buyerEditContainerTpl">
  <input type="text" class="layui-input" name="blacklist_buyer" value="{{d.default}}">
</script>

<%-- 收货地址1弹框 --%>
<script type="text/html" id="blacklist_addressOneEdit">
  <div id="blacklist_addressOneEditContainer" class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_addressOneEditContainerTpl">
    <input type="text" class="layui-input" name="blacklist_addressOne" value="{{d.default}}">
</script>

<%-- 收货地址2弹框 --%>
<script type="text/html" id="blacklist_addressTwoEdit">
  <div id="blacklist_addressTwoEditContainer" class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_addressTwoEditContainerTpl">
    <input type="text" class="layui-input" name="blacklist_addressTwo" value="{{d.default}}">
</script>

<%-- 收件人电话弹框 --%>
<script type="text/html" id="blacklist_phoneEdit">
  <div id="blacklist_phoneEditContainer"  class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_phoneEditContainerTpl">
      <input type="text" class="layui-input" name="blacklist_phone" value="{{d.default}}">
</script>

<%-- 收件人邮箱弹框 --%>
<script type="text/html" id="blacklist_emailEdit">
  <div id="blacklist_emailEditContainer"   class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_emailEditContainerTpl">
      <input type="text" class="layui-input" name="blacklist_email" value="{{d.default}}">
</script>

<%-- 收件人邮编弹框 --%>
<script type="text/html" id="blacklist_zipEdit">
  <div id="blacklist_zipEditContainer"  class="blacklist_center">
  </div>
</script>
<script type="text/html" id="blacklist_zipEditContainerTpl">
    <input type="text" class="layui-input" name="blacklist_zip" value="{{d.default}}">
</script>


<script src="${ctx}/static/js/order/blacklist.js"></script>
