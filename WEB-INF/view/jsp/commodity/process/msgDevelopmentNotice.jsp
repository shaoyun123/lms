<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>开发通知</title>
<style>
    #msg_development_searchForm .layui-form-item{
        margin-bottom:0
    }
    table.colspantable td{
        border:0px;
    }
    .ms-cont2{display: none;}
    .ms-cont2,.ms-cont1{cursor: pointer;}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="msg_development_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" style="">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="first_orgs" class="user_org_costom_all" data-roleList="" id="user_org_costom_all_id" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门处理状态</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="org_process_status" name="org_process_status" lay-filter="org_process_status_filter" lay-search>
                                        <option></option>
                                        <option value="0">未处理</option>
                                        <option value="1">处理中</option>
                                        <option value="2">已处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="display: none">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="develop_msg_organize" lay-filter="orgs_hp_devPerson_develop_msg"  class="orgs_hp_custom" data-id="develop_msg_devPerson" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">需求人</label>
                                <div class="layui-input-block">
                                    <select name="develop_msg_creatorIdStr" lay-filter="develop_msg_creatorIdStr" lay-search="" class="users_hp_custom" data-id="develop_msg_creatorIdStr" data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">需求类型</label>
                                <div class="layui-input-block">
                                    <select name="demandType"  xm-select="msg_typetpl" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='msg_typetpl'>
                                        <c:forEach items="${msgType}" var="developer">
                                            <option value="${developer.id}">${developer.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div hidden id="msgDevelopmentNotice_msgTypeDiv">
                                <c:forEach items="${msgType}" var="developer">
                                    <option value="${developer.id}">${developer.name}</option>
                                </c:forEach>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="prod_status" name="prod_status" lay-search>
                                        <option></option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">我的处理状态</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="my_process_status" name="my_process_status" lay-search>
                                        <option></option>
                                        <option value="1">已处理</option>
                                        <option value="0">未处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label labelSel">
                                    <select id="query_sku" name="query_sku" lay-search>
                                        <option value="1">父sku</option>
                                        <option value="2">子sku</option>
                                    </select>
                                </label>
                                <div class="layui-input-block"  id="activityOrderTimeDiv">
                                    <input type="text" class="layui-input" id="sku_input" name="sku_input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label labelSel">
                                 <select id="query_name_type" name="query_name_type" lay-search>
                                    <option value="1">中文名称</option>
                                    <option value="2">需求备注</option>
                                </select>
                                </label>

                                <div class="layui-input-block">
                                    <input type="text" id="msg_name" name="msg_name" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label labelSel">
                                    <select id="query_time_type" name="query_time_type" lay-search>
                                        <option value="0">创建时间</option>
                                        <option value="1">发布时间</option>
                                    </select>
                                </label>
                                <div class="layui-input-block"  id="msgOrderTimeDiv">
                                    <input type="text" class="layui-input" id="msg_time" name="msg_time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="msgSearchBtn">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                        <input type="hidden" name="queryType" value="1">
                    </form>
                </div>
            </div>
            <div class="layui-card" id="msg_development_card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="msg_development_tab_filter">
                        <ul class="layui-tab-title">
                            <div style="float:left;margin: 3px 0 0 12px">
                                <li class="msgDevelopmentNotice_labelTab" data-type="0"  id="toPublish" >待发布(<span id="tolnum_span_toPublish"></span>)</li>
                                <li class="msgDevelopmentNotice_labelTab layui-this" data-type="1" id="beforeProcess">待处理(<span id="tolnum_span_before"></span>)</li>
                                <li class="msgDevelopmentNotice_labelTab" data-type="2" id="processing">已处理(<span id="tolnum_span_on"></span>)</li>
                                <li class="msgDevelopmentNotice_labelTab" data-type="3" id="cancel">已作废(<span id="tolnum_span_after"></span>)</li>
                            </div>
                            <div class="fl">
                                <span class="layui-btn layui-btn-sm layui-btn-sm" id="msgDevelopmentNotice_export">导出</span>
                            </div>
                            <div style="float:right;margin: 3px 0 0 5px">
                                <span class="layui-btn layui-btn-sm copymsgNoticePsku">复制父SKU</span>
                                <span class="layui-btn layui-btn-sm" onclick="handlemsgNoticeAll()" id="msgDevelopmentNotice_handleAll">批量处理</span>
                                <span class="layui-btn layui-btn-sm" onclick="expandmsgNoticeAll()" id="msgDevelopmentNotice_expandAll">展开所有</span>
                                <span class="layui-btn layui-btn-sm" onclick="PackUpmsgNoticeAll()">收起所有</span>
                                <permTag:perm funcCode="add_msg_btn">

                                <button type="button" id="publish_msg" class="layui-btn layui-btn-sm layui-btn-normal">发布</button>

                                <button type="button" id="add_msg" class="layui-btn layui-btn-sm layui-btn-normal">新建开发通知</button>
                                </permTag:perm>

                              </div>
                        </ul>
                        <div class="layui-tab-content" id="msg_table_div" style="">
                            <table id="msg_development_table" lay-filter="msg_development_table"></table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var developTypeArr = new Array();
    <c:forEach items="${msgType}" var="developer">
    var obj = {};
    obj['name'] = '${developer.name}';
    obj['value'] = '${developer.id}';
    developTypeArr.push(obj);
    </c:forEach>
</script>
<script type="text/html" id="storePskuTpl">
    {{# d.tempPSkuList = d.tempPSku.split(',')}}
    {{# if(d.tempPSkuList){ }}
        {{#  layui.each(d.tempPSkuList, function(index, item){ }}
             <a href="javascrpt:;" id="prodDetail" data-id="" data-psku="{{item}}" style="color:blue;text-align: left">{{ item }}</a> <br/>
        {{# }) }}
    {{# }; }}
</script>


<script type="text/html" id="msgDevelopmentNotice_demandType">
    {{# d.typeCodeList = d.demandType.split(',')}}
    {{# if(d.typeCodeList){ }}
    {{#  layui.each(d.typeCodeList, function(index, item){ }}
    <div>
        {{msgDevelopmentNotice_getNoticeType(item)}}
    </div>
    {{# }) }}
    {{# }; }}
</script>

<script type="text/html" id="titleTpl">
    {{d.cnTitle}}<br>
    <span style="color:#ccc;">{{d.prodPSku}}</span><br>
    {{# if (d.isSale == '0'){ }}
    <span class="hp-badge layui-bg-red">停</span>
    {{#  } }}
    {{# if (d.devType) { }}
    <span class="hp-badge layui-bg-blue  fr layTitle" lay-title="{{d.devType}}">{{getAliasOfDevType(d.devType)}}</span>
    {{# } }}
</script>
<script type="text/html" id="sskuTpl">
   <div class="copySpan">
    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="msgDevelopmentNotice_copyTxt(this)" style="top:-20px;left:44px;">复制sku</button>
      <div class="ms-cont1" >{{d.prodSSku}}</div>
      <div class="ms-cont2">{{d.prodSSku}}</div>
   </div>
</script>
<script type="text/html" id="pImageTpl">
    {{# if(d.pImg != null){ }}
    <img width="60" height="60" src="${tplIVP}{{d.pImg }}!size=60x60" class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
    {{# }else{ }}
    <img width="60" height="60" src="${ctx}/static/img/kong.png" class="img_show_hide b1" data-onerror="layui.admin.img_noFind()">
    {{# }; }}
</script>
<script type="text/html" id="batch_develop_msg_org_layer">
    <div class="layui-col-md3">
        <div style="display: inline-block; padding: 4px;">
            <form class="layui-form" id="develop_msg_orgTreeForm">
                <span id="un_listing_text" style="color: #00B83F;margin-left:9px;display:block;word-break:keep-all;"></span><br>
                <div id="batch_develop_msg_orgXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/html" id="develop_msg_process_tpl">
    <table class="layui-table colspantable" style="width: 300px;margin-left: -5px" id="develop_msg_process_tpl_table" >
        {{#  layui.each(d.platDealList, function(index, item){ }}
        {{#  if(index <4 ) { }}
            {{#  if(index == d.platDealList.length-1){ }}
            <tr style="">
                {{#  }else{ }}
            <tr style="border-bottom: 1px solid #e6e6e6 !important">
                {{#  } }}
        {{# }else{ }}
            {{#  if(index == d.platDealList.length-1){ }}
            <tr style="display: none;" class="myj-hide">
            {{#  }else{ }}
            <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{#  } }}
        {{# } }}
                <td style="width:140px;padding-left: 5px;">
                    {{item.userOrgName}}
                </td>
                <td style="width:140px;text-align: center;" onmouseover="showTip(`{{(item.dealPerson < item.salePerson) ? ('以下人员未处理：' + item.nodealPerson) : ('以下人员已处理：' + item.processedPerson) }}`,this)" data-tipId="" onmouseout="removeTip(this)"
                >
                    {{#if (item.dealPerson === 0) {}} 未处理 {{# } }}
                    {{#if (item.dealPerson > 0 && item.dealPerson < item.salePerson) {}} 处理中 {{# } }}
                    {{#if (item.dealPerson === item.salePerson) {}} 已处理 {{# } }}
                    <span style="color: #999;"> [{{item.dealPerson}}</span>
                    <span>/{{item.salePerson}}]</span>
                </td>
            </tr>
        {{#  }); }}
    </table>
    {{#  if(d.platDealList.length > 4){ }}
    <a href="javascript:" onclick="msgOnline_changeColspantable(this);" class="msgDevelopmentNoticeInfoShow" style="float:right;">+ 展开</a>
    {{# } }}
</script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/msgDevelopmentNotice.js"></script>

<script type="text/javascript">
    var msgBtn = ['关闭'];
    var msgBtn1 = ['关闭'];

    <permTag:perm funcCode="process_msg_btn">
        msgBtn = ['处理','关闭'];
        <permTag:perm funcCode="add_msg_btn">
            msgBtn = ['保存','处理','关闭'];
        </permTag:perm>
    </permTag:perm>
    <permTag:perm funcCode="add_msg_btn">
        msgBtn = ['保存','关闭'];
        msgBtn1 = ['保存','保存并发布','关闭'];
        <permTag:perm funcCode="process_msg_btn">
            msgBtn = ['保存','处理','关闭'];
        </permTag:perm>
    </permTag:perm>


</script>

<script type="text/html" id="processMsgBar">
    <%--
        <a class="layui-btn layui-btn-xs process-btn" lay-event="process">处理</a><br/>
    --%>
    <%--
    <permTag:perm funcCode="edit_msg_btn">
--%>
   <a class="layui-btn layui-btn-xs edit-btn" lay-event="edit">详情</a><br/>
<%--
    </permTag:perm>
--%>
    <div class="genBatchProcess-btn">
        <permTag:perm funcCode="genBatchProcess_msg_btn">
            <a class="layui-btn layui-btn-xs" lay-event="genBatchProcess">代人处理</a><br/>
        </permTag:perm>
    </div>
    <permTag:perm funcCode="cancel_msg_btn">
        <a class="layui-btn layui-btn-danger layui-btn-xs cancel-btn" lay-event="cancel">作废</a><br/>
    </permTag:perm>
    <permTag:perm funcCode="del_msg_btn">
        <a class="layui-btn layui-btn-danger layui-btn-xs del-btn" lay-event="del">删除</a>
    </permTag:perm>
</script>

<script type="text/javascript" src="${ctx}/static/js/commodity/process/imagePreview.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/msgdevelopButton.js"></script>

