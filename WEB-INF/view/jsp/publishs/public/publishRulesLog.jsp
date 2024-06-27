<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>日志</title>
<style> </style>
<div id="publishRules_logTpl"></div>
<script type="text/html" id="publishRules_logCon">
	<div>
		<table class="layui-table" lay-size="sm">
			<thead>
				<tr>
				<th style="width: 20%;text-align: center;">时间</th>
				<th style="width: 10%;text-align: center;">操作人</th>
				<th style="width: 15%;text-align: center;">规则id/名称</th>
				<th style="width: 55%;">日志</th>
				</tr>
			</thead>
			<tbody>
				{{# if(d.length>0){ }}
					{{# layui.each(d, function(i, item){ }}
						<tr>
						<td style="width: 20%;text-align: center;">{{item.createTime }}</td>
						<td style="width: 10%;text-align: center;">{{item.creator}}</td>
						<td style="width: 15%;text-align: center;">
							<div>{{item.ruleId}}</div>
							<div>{{item.ruleName}}</div>
						</td>
						<td style="width: 55%;white-space: break-spaces;word-break: break-word;">
							{{# layui.each(item.logs, function(j, log){ }}
								[{{log.modifyField}}变更]：[{{log.oldData}}] => {{log.newData}}；<br>
							{{# }) }}
						</td>
						</tr>
					{{# }) }}
				{{# }else{ }}
					<tr><td colspan="5">暂无数据</td></tr>
				{{# } }}
			</tbody>
		</table>
	</div>
</script>