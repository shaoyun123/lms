<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<title>发货地址</title>
<style>
 .shipAddress_info .shipAddress_infoItem{
    width: 500px;
    float: left;
    border: 1px solid #ccc;
    box-sizing: border-box;
 }
 .shipAddress_info .shipAddress_infoItem:nth-child(2){
    margin: 0 5px;
 }
 .shipAddress_info .shipAddress_infoItem .shipAddress_infoItem_title {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #ccc;
    padding-left: 10px;
    background: #f4f4f4;
    color: #669fc7;
 }
 .shipAddress_info .shipAddress_infoItem .shipAddress_infoItem_content{
     padding-right: 10px;
     padding-top: 5px;
 }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-row">
                        <div class="layui-col-lg9 layui-col-md9">
                            <form class="layui-form">
                                <div class="layui-form-item">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <label class="layui-form-label">地址名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="addressName">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">地址类型</label>
                                        <div class="layui-input-block">
                                            <select name="addressType">
                                                <option value="">请选择地址类型</option>
                                                <option value="0">内地仓</option>
                                                <option value="1">FBA发货</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3 pl20">
                                        <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="shipAddress_submit">查询</span>
                                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div style="float: right;">
                            <button class="layui-btn layui-btn-sm" type="button" id="shipAddress_newAdd">添加</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="shipAddress_table" lay-filter="shipAddress_tableFilter"></table>
                </div>
            </div>

        </div>
    </div>
</div>
<%-- 表格工具条 --%>
<script type="text/html" id="shipAddress_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <%--<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>--%>
    {{# if(!d.isDefault){  }}
    <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="match">匹配物流</a>
    {{# }else{  }}
    <a class="layui-btn layui-btn-xs layui-btn-warn">默认配置</a>
    {{# } }}
</script>

<%-- 表格默认地址显示 --%>
<script type="text/html" id="shipAddress_default">
    <div>
        {{# if(d.isDefault){  }}
        <span>是</span>
        {{# }else{ }}
        <span>否</span>
        {{# } }}
    </div>
</script>

<%-- 表格交运方式显示 --%>
<script type="text/html" id="shipAddress_deliveryMode">
    <div>
        {{# if(d.deliveryMode == 1){  }}
        <span>上门揽收</span>
        {{# }else{ }}
        <span>卖家自送</span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="shipAddress_type">
    <div>
        {{# if(d.addressType == 0){  }}
        <span>内地仓发货</span>
        {{# }else{ }}
        <span>FBA发货</span>
        {{# } }}
    </div>
</script>


<%-- 揽收人/寄件人/退货人 --%>
<script type="text/html" id="shipAddress_collect">
    <div style="text-align: left;">
        <div><strong>联系人:</strong><span>{{d.collectContactName}}</span></div>
        <div><strong>公司名称:</strong><span>{{d.collectCompany}}</span></div>
        <div><strong>手机号码:</strong><span>{{d.collectContactMobile}}</span></div>
    </div>
</script>
<script type="text/html" id="shipAddress_sender">
    <div style="text-align: left;">
        <div><strong>Name:</strong><span>{{d.senderContactName}}</span></div>
        <div><strong>Company:</strong><span>{{d.senderCompany}}</span></div>
        <div><strong>Phone:</strong><span>{{d.senderContactMobile}}</span></div>
    </div>
</script>
<script type="text/html" id="shipAddress_return">
    <div style="text-align: left;">
        <div><strong>联系人:</strong><span>{{d.returnContactName}}</span></div>
        <div><strong>公司名称:</strong><span>{{d.returnCompany}}</span></div>
        <div><strong>手机号码:</strong><span>{{d.returnContactMobile}}</span></div>
    </div>
</script>

<%-- 如果不是默认地址展示物流方式 --%>
<script type="text/html" id="shipAddress_logisticsway">
    <div style="text-align: left;">
        {{# if(!d.isDefault){  }}
            {{#  layui.each(d.logisticsTypeNameList, function(index, item){ }}
               <div>{{item}}</div>
            {{# }) }}
        {{# }else{  }}
            <span></span>
        {{# } }}
    </div>
</script>


<%-- 编辑+添加发货地址 --%>
<script type="text/html" id="shipAddress_addAndEdit">
    <div style="padding:10px;">
       <form class="layui-form" id="shipAddress_addAndEditForm">
       </form>
    </div>
</script>
<%-- 编辑+添加发货地址模板 --%>
<script type="text/html" id="shipAddress_addAndEditFormTpl">
    <%-- 地址+默认设置 --%>
        <div class="layui-form-item">
            {{# if(d.id){  }}
               <input type="hidden" name="id"  value="{{d.id}}">
            {{# } }}
            <div class="layui-inline">
                <label class="layui-form-label"><font color="red">*</font>地址名称</label>
                <div class="layui-input-inline">
                    <input type="text" name="addressName"  autocomplete="off" class="layui-input" value="{{d.addressName}}" lay-verify="empty">
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">地址类型</label>
                <div class="layui-input-inline">
                    <select name="addressType">
                        <option value="">请选择地址类型</option>
                        <option value="0">内地仓发货</option>
                        <option value="1">FBA发货</option>
                    </select>
                </div>
            </div>
            
            <permTag:perm funcCode="shipAddress_default_checkbox">
                <div class="layui-inline">
                    <label class="layui-form-label">设为默认</label>
                    <div class="layui-input-inline">
                    {{# if(d.isDefault){ }}
                        <input type="checkbox" lay-skin="primary" name="isDefault" checked>
                    {{# }else{ }}
                        <input type="checkbox" lay-skin="primary" name="isDefault">
                    {{# } }}
                    </div>
                </div>
            </permTag:perm>
        </div>
        <div class="shipAddress_info">
            <div class="shipAddress_infoItem">
                <div class="shipAddress_infoItem_title">揽收信息</div>
                <div class="shipAddress_infoItem_content">
                    <%-- <div class="layui-form-item">
                        <label class="layui-form-label">交运方式</label>
                        <div class="layui-input-block">
                           {{# if(d.deliveryMode ==1){ }}
                             <input type="radio" name="deliveryMode" value="1" title="上门揽收" checked>
                             <input type="radio" name="deliveryMode" value="0" title="卖家自送">
                           {{# }else{ }}
                           <input type="radio" name="deliveryMode" value="1" title="上门揽收">
                           <input type="radio" name="deliveryMode" value="0" title="卖家自送" checked>
                           {{# } }}
                        </div>
                    </div> --%>
                    <div class="layui-form-item">
                        <label class="layui-form-label">联系人</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectContactName" 
                           value="{{d.collectContactName}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">公司名称</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectCompany"
                           value="{{d.collectCompany}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">联系地址</label>
                        <div class="layui-input-block">
                            <div class="layui-input-inline" style="width: 179px;">
                                <input type="hidden" name="collectCountry">
                                <select name="collectCountryCode" lay-filter="collectCountryCodeFilter" lay-verify="empty">
                                    <option value="">请选择</option>
                                    <option value="1">中国</option>
                                    <option value="2">美国</option>
                                </select>
                            </div>
                            <div class="layui-input-inline" style="width: 179px;">
                                <input type="hidden" name="collectProvince">
                                <select name="collectProvinceCode" lay-filter="collectProvinceCodeFilter" lay-verify="empty" lay-search>
                                    
                                </select>
                            </div>
                            <div class="layui-input-inline" style="width: 179px;margin-top:5px;">
                                <input type="hidden" name="collectCity">
                                <select name="collectCityCode"  lay-filter="collectCityCodeFilter" lay-verify="empty" lay-search>
                                    
                                </select>
                            </div>
                            <div class="layui-input-inline"  style="width: 179px;margin-top:5px;">
                                <input type="hidden" name="collectCounty">
                                <select name="collectCountyCode" lay-filter="collectCountyCodeFilter"  lay-verify="empty" lay-search>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">街道地址</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectStreet" 
                           value="{{d.collectStreet}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">邮政编码</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectPostcode" 
                           value="{{d.collectPostcode}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">手机号码</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectContactMobile" 
                           value="{{d.collectContactMobile}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">固定电话</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="collectContactPhone" 
                           value="{{d.collectContactPhone}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">电子邮件</label>
                        <div class="layui-input-block">
                           <input type="email" autocomplete="off" class="layui-input" name="collectContactEmail" 
                           value="{{d.collectContactEmail}}" lay-verify="empty">
                        </div>
                    </div>
                </div>
            </div>
            <div class="shipAddress_infoItem">
               <div class="shipAddress_infoItem_title">寄件人信息(填写英文)</div>
               <div class="shipAddress_infoItem_content">
                    <div class="layui-form-item">
                        <label class="layui-form-label">Name</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderContactName" 
                           value="{{d.senderContactName}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Company</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderCompany" 
                           value="{{d.senderCompany}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Address</label>
                        <div class="layui-input-block">
                            <div class="layui-input-inline" style="width: 179px;">
                                <input type="hidden" name="senderCountry">
                                <select name="senderCountryCode"  lay-filter="senderCountryCodeFilter" lay-verify="empty">
                                    <option value="">请选择</option>
                                    <option value="1">china(中国)</option>
                                    <option value="2">US(美国)</option>
                                </select>
                            </div>
                           <div class="layui-input-inline" style="width: 179px;">
                             <input type="hidden" name="senderProvince">
                            <select name="senderProvinceCode"  lay-filter="senderProvinceCodeFilter" lay-verify="empty" lay-search>
                            </select>
                            </div>
                            <div class="layui-input-inline" style="width: 179px;margin-top: 5px;">
                                <input type="hidden" name="senderCity">
                                <select name="senderCityCode"  lay-filter="senderCityCodeFilter" lay-verify="empty" lay-search>
                                </select>
                            </div>
                            <div class="layui-input-inline"  style="width: 179px;margin-top: 5px;">
                                <input type="hidden" name="senderCounty">
                                <select name="senderCountyCode" lay-filter="senderCountyCodeFilter"  lay-verify="empty" lay-search>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Street</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderStreet" 
                           value="{{d.senderStreet}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Zip Code</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderPostcode" 
                           value="{{d.senderPostcode}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Phone</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderContactPhone" 
                           value="{{d.senderContactPhone}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Mobile</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="senderContactMobile" 
                           value="{{d.senderContactMobile}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">Email</label>
                        <div class="layui-input-block">
                           <input type="email" autocomplete="off" class="layui-input" name="senderContactEmail" 
                           value="{{d.senderContactEmail}}" lay-verify="empty">
                        </div>
                    </div>
               </div>
            </div>
            <div class="shipAddress_infoItem">
               <div class="shipAddress_infoItem_title">退货地址</div>
               <div class="shipAddress_infoItem_content">
                    <div class="layui-form-item">
                        <label class="layui-form-label">退货联系人</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnContactName" 
                           value="{{d.returnContactName}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">退货公司</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnCompany" 
                           value="{{d.returnCompany}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">地址</label>
                        <div class="layui-input-block">
                           <div class="layui-input-inline" style="width: 179px;">
                                <input type="hidden" name="returnCountry">
                                <select name="returnCountryCode" lay-filter="returnCountryCodeFilter"  lay-verify="empty">
                                    <option value="">请选择</option>
                                    <option value="1">中国</option>
                                    <option value="2">美国</option>
                                </select>
                            </div>
                           <div class="layui-input-inline" style="width: 179px;">
                            <input type="hidden" name="returnProvince">
                            <select name="returnProvinceCode" lay-filter="returnProvinceCodeFilter"  lay-verify="empty" lay-search>
                                
                            </select>
                            </div>
                            <div class="layui-input-inline" style="width: 179px;margin-top: 5px;">
                                <input type="hidden" name="returnCity">
                                <select name="returnCityCode" lay-filter="returnCityCodeFilter"  lay-verify="empty" lay-search>
                                    
                                </select>
                            </div>
                            <div class="layui-input-inline"  style="width: 179px;margin-top: 5px;">
                                <input type="hidden" name="returnCounty">
                                <select name="returnCountyCode" lay-filter="returnCountyCodeFilter"  lay-verify="empty" lay-search>
                                    
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">退货街道</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnStreet" 
                           value="{{d.returnStreet}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">邮编</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnPostcode" 
                           value="{{d.returnPostcode}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">手机号码</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnContactMobile" 
                           value="{{d.returnContactMobile}}" lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">固定电话</label>
                        <div class="layui-input-block">
                           <input type="text" autocomplete="off" class="layui-input" name="returnContactPhone" 
                           value="{{d.returnContactPhone}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">邮箱</label>
                        <div class="layui-input-block">
                           <input type="email" autocomplete="off" class="layui-input" name="returnContactEmail" 
                           value="{{d.returnContactEmail}}"  lay-verify="empty">
                        </div>
                    </div>
                    <div style="padding: 0 0 10px 10px;">
                        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="shipAddress_returnCopy">应用揽收信息</button>
                    </div>
               </div>
            </div>
        </div>
        <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="shipAddress_addAndEditForm_submit">查询</span>
</script>

<%-- 匹配物流弹框 --%>
<script type="text/html" id="shipAddress_match">
  <div class="p20">
        <form class="layui-form" id="shipAddress_matchForm">
            
        </form>
  </div>
</script>
<%-- 物流方式渲染模板 --%>
<script type="text/html" id="shipAddress_matchFormTpl">
       <div class="layui-form-item">
            <label class="layui-form-label">物流方式</label>
            <div class="layui-input-block">
                <select name="logisticsTypeIdList" xm-select="shipAddress_logisticsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="shipAddress_logistics">
                    {{# if(d.logisticsArr){ }}
                        {{#  layui.each(d.logisticsArr, function(index, item){ }}
                            {{# if(d.logisticsTypeIdList.indexOf(item.value)>-1 ){ }}
                                <option value="{{item.value}}" selected="selected">{{ item.name }}</option>
                            {{# }else{ }}
                                <option value="{{item.value}}">{{ item.name }}</option>
                            {{# } }}
                        {{# }) }}

                    {{# } }}
                </select>
            </div>
        </div>
        <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="shipAddress__matchForm_submit">查询</span>
</script>


<script src="${ctx}/static/js/logistics/shipAddress.js"></script>