<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>订单amazonEmail配置</title>
<style></style>
<div id="orderAmazonEmail">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="orderAmazonEmailForm">
        <div class="layui-form-item disflex w100%">
          <div>
            <label class="layui-form-label"><font class="fRed">*</font>模板类型</label>
            <div class="layui-input-block">
              <select name="emailType" lay-search lay-filter="orderAmazonEmailForm_emailType">
                <option value="">请选择模板类型</option>
                <option v-for="item in emailTypeList" :key="item.typeName" :value="item.typeName">{{ item.typeName }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="layui-form-label"><font class="fRed">*</font>模板名称</label>
            <div class="layui-input-block">
              <select name="emailTemplateName" lay-search lay-filter="orderAmazonEmailForm_emailTemplateName">
                <option value="">请选择模板名称</option>
                <option v-for="item in emailTemplateNameList" :value="item.id" :key="item.id">{{ item.name }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"><font class="fRed">*</font>联系原因</label>
          <div class="layui-input-block">
            <input type="radio" name="sendType" value="1" title="通知配送订单存在问题" checked />
            <!--其它这个按钮没找到其对应的接口，先设置为disabled-->
            <input type="radio" name="sendType" value="2" title="其它" disabled class="layui-disabled" />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"><font class="fRed">*</font>正文</label>
          <div class="layui-input-block">
            <textarea name="emailContent" class="layui-textarea" rows="13" placeholder="限定2000个字符" maxlength="2000"></textarea>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
