<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>订单shopee发送消息</title>
<style></style>
<div id="orderShopeeSendMsg">
  <div class="layui-card">
    <div class="layui-card-header dis_flex_space" style="align-items: center;">
      <div class="w150"><font class="fRed">*</font>消息类型:文本消息</div>
      <div class="layui-form disFCenter">
        <select
          v-model="tplInfo.languageCode"
          filterable
          clearable
          placeholder="语言"
          class="w100"
          lay-filter="languageCodeSearch"
        >
          <option value="">请选择</option>
          <option
            v-for="item in languageList"
            :key="item"
            :value="item"
          >{{item == 'ru'? '俄语' : item}}</option>
        </select>

        <select
          v-model="tplInfo.templateTypeName"
          class="w100"
          filterable
          clearable
          placeholder="模板类型"
          lay-filter="templateTypeNameSearch"
        >
          <option value="">请选择</option>
          <option
            v-for="item in tplTypeList"
            :key="item"
            :value="item"
          >{{item}}</option>
        </select>

        <select
          v-model="tplId"
          class="w100"
          filterable
          clearable
          placeholder="模板名称"
          lay-filter="tplIdSearch"
        >
          <option value="">请选择</option>
          <option
            v-for="item in tplNameList"
            :key="item.id"
            :value="item.id"
          >{{item.name}}</option>
        </select>
      </div>
      <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" @click="orderShopeeSendMsg_add">新增消息</button>
    </div>
    <div class="layui-card-body">
      <form action="" class="layui-form" id="orderShopeeSendMsglForm">
        <div class="layui-form-item disflex" v-for="(item, index) in messageList" :key="item.id">
          <div style="width: 100%">
            <label class="layui-form-label"><font class="fRed">*</font>消息{{ index + 1 }}</label>
            <div class="layui-input-block disflex">
              <input type="text" class="layui-input" name="msg" v-model="item.value" oninput="commonInputLimitWord(this,600)" />
              <button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml10" @click="orderShopeeSendMsg_del(index)">删除</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
