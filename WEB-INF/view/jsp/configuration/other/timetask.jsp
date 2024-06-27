<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>定时报表</title>

<style>
    .timetaskApp .daysCss {
        font-weight: 700;
        color: #ccc;
    }

    #timetask_addOrEditLayer_content,
    #timetask_serviceAddOrEditLayer_content {
        padding: 10px 40px 0 0;
    }

    .timetask_serviceInput {
        width: 150px;
        margin-left: 10px;
    }

    #timetask_serviceAddOrEditLayer_content .xm-select-parent {
        width: 100%;
    }

    #timetask_serviceAddOrEditLayer_content .tasktime_param {
        display: flex;
        line-height: 36px;
    }

    .layui-table-page>div {
        width: 80% !important;
    }
    /* .timetask_reportFieldsStrShow{
      color: #f00;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    } */
    .timetask_overflow_four{
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
    }
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
    /* #timetask_serviceAddOrEditLayerId {
      overflow: visible;
    } */
    #timetask_serviceAddOrEditLayerId .tagsinput-primary .bootstrap-tagsinput {
      max-height: 100px;
      overflow-y: auto;
    }
    #timetask_serviceAddOrEditLayerId .timeItem,
    #timetaskCard .timeItem{
      background: #f0f9eb;
      height: 25px;
      display: inline-block;
      line-height: 25px;
      width: 70px;
      text-align: center;
      position: relative;
      margin: 5px;
      border-radius: 5px;
    }
    #timetask_serviceAddOrEditLayerId .timeItem>span.close {
      position: absolute;
      cursor: pointer;
      right: 0;
      border-radius: 50%;
      display: inline-block;
      width: 15px;
      height: 15px;
      font-size: 12px;
      line-height: 15px;
      color: #ff0000;
    }
    .exportTimeStr-container {
      text-align: left;
    }
</style>

<div class="layui-fluid timetaskApp">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="timetaskForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select lay-search name="status">
                                        <option value=""></option>
                                        <option value="1">已启用</option>
                                        <option value="0">未启用</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">报表名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="name" autocomplete="false" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">分类</label>
                                <div class="layui-input-block">
                                    <select name="configType" lay-search>
                                        <option value="">请选择</option>
                                        <option value="9999">未分类</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">收件人</label>
                                <div class="layui-input-block">
                                    <input type="text" name="recipientNames" autocomplete="false" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit lay-filter="timetask_filter">查询</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="timetaskCard">
                <div class="fixHigh">
                    <div class="layui-card-header" style="display:flex;justify-content: space-between;    align-items: center;">
                        <permTag:perm funcCode="timetask_addBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="timetask_newAddBtn">新建</span>
                        </permTag:perm>
                        <permTag:perm funcCode="timetask_deleteBtn">
                          <span class="layui-btn layui-btn-sm layui-btn-danger" id="timetask_deleteBtn">删除</span>
                        </permTag:perm>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="timetask_table"
                           lay-filter="timetask_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 表格---状态 --%>
<script type="text/html" id="timetask_status">
<div>
    {{# if(d.status){ }}
    <span class="timetask_status_on">已启用</span>
    {{# }else{ }}
    <span class="timetask_status_off">未启用</span>
    {{# } }}
</div>
</script>

<%-- 表格---收件人 --%>
<script type="text/html" id="timetask_recipientIds">
{{# if(d.recipients && d.recipients.length>0){ }}
{{#  layui.each(d.recipients, function(index, item){ }}
<span>{{item.userName}}</span>,
{{# }); }}
{{# } }}
</script>

<%-- 表格---定时发送日期 --%>
<script type="text/html" id="timetask_sendDays">
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
<%-- 表格---定时发送时间 --%>
<script type="text/html" id="timetask_sendTime">
<div>
    {{# if(d.exportHour){ }}
    <span>{{d.exportHour || ''}}</span>
    <span>:</span>
    {{# } }}
    <span>{{d.exportMinute || ''}}</span>
</div>
</script>

<%-- 表格---报表字段 --%>
<script type="text/html" id="timetask_reportFieldsStr">
<div class="timetask_reportFieldsStrShow timetask_overflow_four" lay-tips="{{d.reportFieldsStr}}">{{d.reportFieldsStr}}</div>
</script>

<%-- 表格---创建信息 --%>
<script type="text/html" id="publish_time">
    <div>
        <span style="color:grey">创建人:</span>{{ d.creator}}
    </div>
    <div>
        <span style="color:grey">创建时间:</span>{{ layui.admin.Format( d.createTime, "yyyy-MM-dd")}}
    </div>
</script>

<%-- 表格---编辑 --%>
<script type="text/html" id="timetask_toolbar">
<permTag:perm funcCode="timetask_config">
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="config">技术配置</span><br>
</permTag:perm>
<permTag:perm funcCode="timetask_service">
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">业务编辑</span><br>
</permTag:perm>
<permTag:perm funcCode="timetask_immediate">
    <span class="layui-btn layui-btn-xs layui-btn-warm" lay-event="immediate">立即执行</span>
</permTag:perm>
<permTag:perm funcCode="timetask_dynamicSearch">
<%--    <a href="#/route/configuration/other/timetask">--%>
        <span class="layui-btn layui-btn-xs" lay-event="dynamicSearch">动态查询</span>
<%--    </a>--%>
</permTag:perm>
<permTag:perm funcCode="timetask_checkAccessTokenPerm">
<span class="layui-btn layui-btn-xs" lay-event="checkAccessToken">授权用户</span>
</permTag:perm>
</script>

<script type="text/html" id="timetask_dynamicSearchLayerContent">
    <div class="p20">
        <div class="layui-card">
            <div class="layui-card-body">
                <form id="timetask_dynamicSearchForm" class="layui-form">
                    {{# if(d.statisticReportSearchParams.length>0){ }}
                    {{# layui.each(d.statisticReportSearchParams, function(index, item){ }}
                    <div class="layui-col-lg2 layui-col-md2 dynamicSearchParam">
                        <input type="hidden" data-name="param" value="{{item.param}}">
                        <input type="hidden" data-name="type" value="{{item.type}}">
                        <input type="hidden" data-name="alias" value="{{item.alias}}">
                        <label class="layui-form-label">{{item.alias}}</label>
                        <div class="layui-col-lg2 layui-col-md2">
                            <select data-name="paramRelation" lay-search>
                                <option value="0" {{item.paramRelation== 0 ? 'selected' : ''}}>=</option>
                                <option value="1" {{item.paramRelation== 1 ? 'selected' : ''}}>></option>
                                <option value="2" {{item.paramRelation== 2 ? 'selected' : ''}}><</option>
                                <option value="3" {{item.paramRelation== 3 ? 'selected' : ''}}>>=</option>
                                <option value="4" {{item.paramRelation== 4 ? 'selected' : ''}}><=</option>
                            </select>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <input data-name="paramValue" type="text" class="layui-input timetask_serviceInput" value="{{item.paramValue || ''}}">
                        </div>
                    </div>
                    {{# }); }}
                    {{# } }}
                </form>
            </div>
        </div>
        <div class="clearLeft"></div>
        <div class="layui-card">
            <div class="layui-card-header">
                <div class="fl">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="timetask_dynamicSearchBtn">查询</span>
                </div>
                <div class="fr">
                    <span class="layui-btn layui-btn-sm layui-btn-danger" id="timetask_dynamicExportBtn">导出</span>
                </div>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="timetask_dynamicSearchTable" lay-filter="timetask_tableFilter"></table>
            </div>
            <div id="timetask_pagination" class="customPagination"></div>
        </div>
    </div>
</script>

<script type="text/html" id="timetask_dynamicSearchLayer">
    <div id="timetask_dynamicSearchLayerContains"></div>
</script>

<%-- 弹框---技术配置 --%>
<script type="text/html" id="timetask_addOrEditLayer">
<div id="timetask_addOrEditLayer_content"></div>
</script>
<%-- 弹框---技术配置-模板 --%>
<script type="text/html" id="timetask_addOrEditLayer_contentTpl">
<form class="layui-form" id="timetask_addOrEditLayer_form">
    {{# if(d.id){ }}
    <input type="hidden" name="id" value="{{d.id}}">
    {{# } }}
    <div class="layui-form-item">
        <label class="layui-form-label">前提要求</label>
        <div class="layui-input-block">
            <blockquote class="site-text layui-elem-quote">
                1. SQL不能添加sql注释（如 -- 张三）<br>
                2. 查询条件用别名处理，如单表sys_user的条件查询 select * from sys_user where [username] 此处后序可以通过条件进行赋值<br>
                对于联表查询如关联sys_role 取别名的时候需要如 select * from sys_user t1 left join sys_user_role t2 on t1,id = t2.user_id
                where
                [t2.role_id]<br>
                3. 对于处理时间类型 SELECT * FROM sys_user WHERE [create_time(0)] and [create_time(1)] 规则和上述差不多 但是这里用(0) 代替 >=
                ,(1)代替<= 的规则进行<br>
                4. SQL中不允许传入(insert|update|delete|create|drop|alter|trigger|grant|execute|lock|event|truncate)
                等敏感关键字<br>
                5. SQL中不允许使用limit 1<br>
                6. 对于字段别名的问题,不能使用逗号,可以使用#或则|等其他符号代替分割 参考如 activity_type AS '活动类型(0:单次活动#1:连续活动-开启定时任务)'<br>
                7. SQL书写时，建议现在Navicat等工具上书写后赋值过来，避免SQL错误<br>
                8. SQL写完后务必点击<span style="color: red;font-weight: bolder">检测</span>按钮<br>
                9. SQL中使用中文作为别名的， 别名需要用单引号 '' 包括起来<br>
                10. 多句sql组合执行。仅会返回最后一条sql的结果。且多句sql要换行输入
            </blockquote>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">数据源：</label>
        <div class="layui-input-block">
            <input type="radio" name="dataSource" value="READ_ONLY" title="OA库" {{(d.dataSource=='READ_ONLY' || !d.dataSource)? 'checked': ''}}>
            <input type="radio" name="dataSource" value="BI" title="BI库"  {{d.dataSource=='BI'? 'checked': ''}}>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">报表名称</label>
        <div class="layui-input-block">
            <input type="text" name="name" autocomplete="false" class="layui-input" value="{{d.name || ''}}">
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">
            <div>SQL</div>
            <span class="layui-btn layui-btn-xs layui-btn-normal checkBtn">检测</span>
        </label>
        <div class="layui-input-block">
            <textarea name="executeSql" class="layui-textarea">{{d.executeSql || ''}}</textarea>
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">备注</label>
        <div class="layui-input-block">
            <input type="text" name="remark" autocomplete="false" class="layui-input" value="{{d.remark || ''}}">
        </div>
    </div>

    <div class="layui-form-item">
        <label class="layui-form-label">参数配置</label>
        <div class="layui-input-block">
            <table class="layui-table">
                <thead>
                <tr>
                    <th>参数</th>
                    <th>别名</th>
                    <th>类型</th>
                </tr>
                </thead>
                <tbody id="timetask_addOrEditLayer_tbody">
                {{# if(d.statisticReportSearchParams.length>0){ }}
                {{# layui.each(d.statisticReportSearchParams, function(index, item){ }}
                <tr name="{{item.param || ''}}">
                    <td>{{item.param}}</td>
                    <td>
                        <input type="text" autocomplete="false" class="layui-input" value="{{item.alias || ''}}"
                               required lay-verify="required">
                    </td>
                    <td>
                        <div class="layui-form">
                            <select lay-search>
                                <option value="0" {{item.type== 0 ?
                                'selected': ''}}>string</option>
                                <option value="1" {{item.type== 1 ?
                                'selected': ''}}>int</option>
                                <option value="2" {{item.type== 2 ?
                                'selected': ''}}>decimal</option>
                                <option value="3" {{item.type== 3 ?
                                'selected': ''}}>date</option>
                            </select>
                        </div>
                    </td>
                </tr>
                {{# }); }}
                {{# } }}
                </tbody>
            </table>
        </div>
    </div>
</form>
</script>

<%-- 弹框---业务编辑 --%>
<script type="text/html" id="timetask_serviceAddOrEditLayer">
<div id="timetask_serviceAddOrEditLayer_content"></div>
</script>
<%-- 弹框---业务编辑-模板 --%>
<script type="text/html" id="timetask_serviceAddOrEditLayer_contentTpl">
<form class="layui-form" id="timetask_serviceAddOrEditLayer_form">
    <input type="hidden" name="id" value="{{d.id}}">
    <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">报表名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" autocomplete="false" class="layui-input" value="{{d.name || ''}}">
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">状态</label>
                <div class="layui-input-block">
                    <select lay-search name="status">
                        {{# if(d.status== 0){ }}
                        <option value="true">已启用</option>
                        <option value="false" selected>未启用</option>
                        {{# }else if(d.status ==1){ }}
                        <option value="true" selected>已启用</option>
                        <option value="false">未启用</option>
                        {{# } }}
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">定时发送日期</label>
                <div class="layui-input-block">
                    <select lay-search name="exportType" lay-filter="timetaskLayer_exportType">
                        <option value="1" {{d.exportType==1 ?
                        'selected': ''}}>按星期</option>
                        <option value="0" {{d.exportType==0 ?
                        'selected': ''}}>按日期</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item tasktimeLayer_dates {{d.exportType==0 ? '': 'disN'}}">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">定时发送日期</label>
                <div class="layui-input-block" style="display:flex;">
                    <select name="exportDays"
                            lay-filter="timetask_exportDays"
                            xm-select="timetask_exportDays"
                            xm-select-search
                            xm-select-search-type="dl"
                            xm-select-skin="normal">
                        {{# layui.each(d.daysArr, function(index, item){ }}
                        <option value="{{item}}">{{item}}</option>
                        {{# }); }}
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item tasktimeLayer_weeks {{d.exportType==0 ? 'disN': ''}}">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">定时发送星期</label>
                <div class="layui-input-block" style="display:flex;">
                    <select name="exportWeeks"
                            lay-filter="timetask_exportWeeks"
                            xm-select="timetask_exportWeeks"
                            xm-select-search
                            xm-select-search-type="dl"
                            xm-select-skin="normal">
                        <option value="1">星期一</option>
                        <option value="2">星期二</option>
                        <option value="3">星期三</option>
                        <option value="4">星期四</option>
                        <option value="5">星期五</option>
                        <option value="6">星期六</option>
                        <option value="7">星期日</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">定时时间</label>
                <div class="layui-input-block" style="display:flex;">
                    <select name="exportHour" lay-search>
                        {{# layui.each(d.hoursArr, function(index, item){ }}
                        <option value="{{item.key}}">{{item.val}}</option>
                        {{# }); }}
                    </select>
                    <select name="exportMinute" lay-search>
                        {{# layui.each(d.minutesArr, function(index, item){ }}
                        <option value="{{item.key}}">{{item.val}}</option>
                        {{# }); }}
                    </select>
                </div>
            </div>
            <div class="layui-col-lg6 layui-col-md6">
              <span class="layui-btn layui-btn-sm addTimeBtn" style="margin-left:20px;">新增时间</span>
            </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-input-block exportTimeStr">
              {{# layui.each(d.exportTimeStr && d.exportTimeStr.split(','), function(index, item){ }}
                  <span class="timeItem">
                    <span class="time">{{item}}</span>
                    <span class="close">X</span>
                  </span>
                {{# }); }}
            </div>
          </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6">
                <label class="layui-form-label">分类</label>
                <div class="layui-input-block" style="display:flex;">
                    <select name="configType" lay-search></select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg6 layui-col-md6" title="如果查询数据为空是否仍然发送邮件">
                <label class="layui-form-label">发送空邮件<i class="layui-icon layui-icon-about" ></i></label>
                <div class="layui-input-block" style="display:flex;">
                    <input name="ifSendVoidFile" type="checkbox" lay-skin="primary" />
                </div>
            </div>
        </div>
        <%--<div class="layui-form-item">--%>
            <%--<label class="layui-form-label">导出字段</label>--%>
            <%--<div class="layui-input-block">--%>
                <%--<div>--%>
                    <%--{{# if(d.exportFieldsArr.length == d.reportFieldsArr.length){ }}--%>
                    <%--<input type="checkbox" name="allCked" title="全选" lay-skin="primary" checked--%>
                           <%--lay-filter="tasktime_allCkedFilter">--%>
                    <%--{{# }else{ }}--%>
                    <%--<input type="checkbox" name="allCked" title="全选" lay-skin="primary"--%>
                           <%--lay-filter="tasktime_allCkedFilter">--%>
                    <%--{{# } }}--%>
                <%--</div>--%>
                <%--<div class="timetask_serviceCks">--%>
                    <%--{{# layui.each(d.reportFieldsArr, function(index, item){ }}--%>
                    <%--{{# if(d.exportFieldsArr.includes(item)){ }}--%>
                    <%--<input type="checkbox" title="{{item}}" lay-skin="primary" checked lay-filter="tasktime_ckedFilter">--%>
                    <%--{{# }else{ }}--%>
                    <%--<input type="checkbox" title="{{item}}" lay-skin="primary" lay-filter="tasktime_ckedFilter">--%>
                    <%--{{# } }}--%>
                    <%--{{# }); }}--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>
        <div class="layui-form-item">
            <label class="layui-form-label"><strong>条件参数</strong></label>
            <div class="layui-input-block tasktime_conditionParams">
                {{# if(d.statisticReportSearchParams.length>0){ }}
                {{# layui.each(d.statisticReportSearchParams, function(index, item){ }}
                <div class="tasktime_param">
                    <input type="hidden" value="{{item.id}}">
                    <span style="margin-right:10px;">{{item.alias}}</span>
                    <select  lay-search>
                        <option value="0" {{item.paramRelation== 0 ?
                        'selected' : ''}}>=</option>
                        <option value="1" {{item.paramRelation== 1 ?
                        'selected' : ''}}>></option>
                        <option value="2" {{item.paramRelation== 2 ?
                        'selected' : ''}}><</option>
                        <option value="3" {{item.paramRelation== 3 ?
                        'selected' : ''}}>>=</option>
                        <option value="4" {{item.paramRelation== 4 ?
                        'selected' : ''}}><=</option>
                    </select>
                    <input type="text" class="layui-input timetask_serviceInput" value="{{item.paramValue || ''}}">
                </div>
                {{# }); }}
                {{# } }}
            </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">发送格式</label>
          <div class="layui-input-block">
            <span>
              <input type="radio" lay-filter="timetaskSendFormatFilter" name="sendFormat" value="表格" title="表格" {{d.sendFormat=='表格'? 'checked': ''}}>
            </span>
            <span title="仅支持20列&40行以内的数据生成图片">
              <input type="radio" lay-filter="timetaskSendFormatFilter" name="sendFormat" value="图片" title="图片" {{d.sendFormat=='图片'? 'checked': ''}}>
            </span>

            <span title="仅支持6列&10行以内的数据生成文字">
              <input type="radio" lay-filter="timetaskSendFormatFilter" name="sendFormat" value="文字" title="文字" {{d.sendFormat=='文字'? 'checked': ''}}>
            </span>

          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">发送方式</label>
          <div class="layui-input-block">
            <input type="radio" lay-filter="timetaskSendTypeFilter" name="sendType" value="钉钉单人" title="钉钉单人" {{d.sendType=='钉钉单人'? 'checked': ''}}>
            <input type="radio" lay-filter="timetaskSendTypeFilter" name="sendType" value="邮件" title="邮件" {{d.sendType=='邮件'? 'checked': ''}}>
            <input type="radio" lay-filter="timetaskSendTypeFilter" name="sendType" value="钉钉群聊" title="钉钉群聊" {{d.sendType=='钉钉群聊'? 'checked': ''}}>
          </div>
        </div>
        {{# if(['钉钉单人','邮件'].includes(d.sendType)){ }}
        <div class="layui-form-item singleAndEmail">
        {{# }else{ }}
        <div class="layui-form-item singleAndEmail disN">
        {{# } }}
            <label class="layui-form-label">收件人</label>
            <div class="layui-input-block">
                <div class="tagsinput-primary form-group">
                    <input type="text" name="recipientIds" class="layui-input" id="timetask_receivers_input"
                           placeholder="请在下面编辑" readonly>
                    <span style="color: #428bca;padding-left: 10px;cursor: pointer"
                          id="timetask_receivers_btn">编辑收件人</span>
                </div>
            </div>
        </div>
        {{# if(['钉钉单人','邮件'].includes(d.sendType)){ }}
        <div class="layui-form-item singleAndEmail">
        {{# }else{ }}
        <div class="layui-form-item singleAndEmail disN">
        {{# } }}
          <label class="layui-form-label">分数据发送设置</label>
          <div class="layui-input-block">
              <select name="separateDataSend" lay-search>
                <option value="">请选择</option>
                {{#  layui.each(d.separateDataSendArr, function(index, item){ }}
                  {{# if(d.separateDataSend == item){ }}
                  <option value="{{item}}" selected>{{item}}</option>
                  {{# }else{ }}
                  <option value="{{item}}">{{item}}</option>
                  {{# } }}
                {{# }); }}
              </select>
              <div><font color="red">设置分数据发送人后,系统根据表格中的表头字段将数据按接收人拆分后发送.</font></div>
          </div>
        </div>
        {{# if(['钉钉单人','邮件'].includes(d.sendType)){ }}
        <div class="layui-form-item groupChatId disN">
        {{# }else{ }}
        <div class="layui-form-item groupChatId">
        {{# } }}
          <label class="layui-form-label">群聊ID</label>
          <div class="layui-input-block">
              <input type="text" class="layui-input" name="dingGroupId" value="{{d.dingGroupId	 || ''}}" placeholder="请联系开发配置openConverstionId">
          </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="remark" value="{{d.remark || ''}}">
            </div>
        </div>
    </div>
</form>
</script>

<%-- 弹框-业务配置-邮箱编辑 --%>
<script type="text/html" id="tasktime_serviceEmailLayer">
<div style="display: inline-block; padding: 4px; overflow: auto;">
    <form class="layui-form" id="tasktime_serviceEmailXTreeForm">
        <div class="timetask_userNames_div">
            <input id="timetask_userNames_input" type="text" name="userNames" placeholder="登录名" autocomplete="false" class="layui-input"  style="display: inline-block;width: 280px;">
            <button class="layui-btn layui-btn-sm layui-btn-normal" id="timetask_userNames_btn">搜索</button>
        </div>
        <div class="timetask_roleName_div" style="margin-top:10px;">
            <input id="timetask_roleName_input" type="text" name="roleName" placeholder="角色名称 回车搜索" autocomplete="false" class="layui-input"  style="display: inline-block;width: 280px;">
        </div>
        <div id="tasktime_serviceEmailXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
    </form>
</div>
</script>

<%-- 弹框-授权用户 --%>
<script type="text/html" id="tasktime_authUserLayer">
  <div style="padding:20px;" id="tasktime_authUserLayerContainer">

  </div>
</script>
<%-- 弹框-授权用户--模板 --%>
<script type="text/html"  id="tasktime_authUserLayerContainerTpl">
  <div class="layui-form layui-row layui-col-space10">
    <div class="layui-col-lg6 layui-col-md6">
      <h2>授权用户</h2>
      <div class="layui-col-lg7 layui-col-md7">
        <select
        xm-select="storeAndPlatCodeAuthLayer_xmTimetask"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal">
        {{#  layui.each(d.userList, function(index, item){ }}
          <option value="{{item.userId}}">{{item.userName}}({{item.name}})</option>
        {{# }); }}
      </select>
      </div>
      <div class="layui-col-lg3 layui-col-md3" style="margin-left:10px;">
        <span class="layui-btn layui-btn-sm addAuthBtn">新增授权</span>
      </div>
      <div>
        <table class="layui-table">
          <thead>
            <tr>
              <th>登录名</th>
              <th>部门</th>
              <th>操作</th>
            <tr>
          </thead>
          <tbody class="authUser">
            {{#  layui.each(d.tableList, function(index, item){ }}
            <tr>
              <td>{{item.userName}}</td>
              <td>{{item.name}}</td>
              <td><span class="layui-btn layui-btn-sm cancelBtn" data-id="{{item.userId}}">取消授权</span></td>
            </tr>
            {{# }); }}
          </tbody>
        </table>
      </div>
    </div>
    <div class="layui-col-lg6 layui-col-md6">
      <h2>授权角色</h2>
      <div class="layui-col-lg7 layui-col-md7">
        <select
        xm-select="storeAndPlatCodeAuthRoleLayer_xmTimetask"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal">
        {{#  layui.each(d.roleList, function(index, item){ }}
          <option value="{{item.id}}">{{item.name}}</option>
        {{# }); }}
      </select>
      </div>
      <div class="layui-col-lg3 layui-col-md3" style="margin-left:10px;">
        <span class="layui-btn layui-btn-sm addAuthRoleBtn">新增授权</span>
      </div>
      <div>
        <table class="layui-table">
          <thead>
            <tr>
              <th>角色名</th>
              <th>操作</th>
            <tr>
          </thead>
          <tbody class="authRole">
            {{#  layui.each(d.roleTableList, function(index, item){ }}
            <tr>
              <td>{{item.name}}</td>
              <td><span class="layui-btn layui-btn-sm cancelRoleBtn" data-id="{{item.id}}">取消授权</span></td>
            </tr>
            {{# }); }}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</script>
<!-- 角色名称 -->
<script type="text/html" id="timetaskRoleNameTpl">
    <div id="timetask_roleName_container" class="layui-form">
        <div id="timetaskRoleNameXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
    </div>
</script>



<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script src="${ctx}/static/js/configuration/other/timetask.js"></script>
<script src="${ctx}/static/util/exportExcel.js"></script>
