<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>角色</title>
<style>
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
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }

    .fsize18{
        font-weight: bold;
        font-size: 18px;
        margin:10px;
    }

    .bordereee{
        border: 1px solid #eee;
        border-radius: 20px;
        padding: 10px;
    }
</style>
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <!-- <div class="layui-card-header">搜索列表</div> -->
                    <div class="layui-card-body">
                        <form action="" class="layui-form" id="roleSearchForm" lay-filter="roleSearchForm">
                            <div class="layui-inline">
                                <div class="layui-input-inline w100">
                                    <select name="status" id="roleStatusSel" lay-search>
                                        <option value="" selected="selected">状态</option>
                                        <option value="true">启用中</option>
                                        <option value="false">已停用</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline" style="width:200px">
                                    <input type="text" name="name" id="name" placeholder="角色名称" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="roleSearchBtn">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary  layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </form>
                        <div class="poab" style="top:10px;">
                            <button class="layui-btn layui-btn-sm" id="addRoleBtn">添加角色</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card" id="staffRoleCard">
                    <!-- <div class="layui-card-header">表格</div> -->
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="rolemanagerTable" lay-filter="rolemanagerTable"></table>
                        <!-- 工具条模板,写在script里面，使用laytpl -->
                        <script type="text/html" id="roleIsBuildInBar">
                            {{# if(d.isBuiltIn == true){ }}
                            <font color="red">是</font>
                            {{# } else { }}
                            <font >否</font>
                            {{# } }}
                        </script>
                        <script type="text/html" id="roleOperBar">
                            <div style="text-align: left">
                                    <a class="layui-btn layui-btn-xs" lay-event="authResource">授予资源</a>
                                    <a class="layui-btn layui-btn-xs" lay-event="authAcct">授予店铺</a>
                                    <a class="layui-btn layui-btn-xs" lay-event="authWarehouseForRole">授予仓库</a>
                                    <a class="layui-btn layui-btn-xs" lay-event="authTimetask">授予报表</a>
                                    {{# if(d.isBuiltIn != true){ }}
                                        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                                        {{# if(d.status == true){ }}
                                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">停用</a>
                                        {{# }else{ }}
                                        <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="open">启用</a>
                                        {{# } }}
                                    {{# }else{ }}
                                        <a class="layui-btn layui-btn-xs" lay-event="editSort">编辑</a>
                                    {{# } }}
                            </div>
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 授与资源弹出框 -->
    <div class="disN" id="roleResourceTreeLayer">
        <div class="p20">
            <form class="layui-form" id="roleResourceForm">
                <input type="hidden" name="id" class="layui-input">
                <div id="roleResourceXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>

    <!-- 授与店铺弹出框 -->
    <%--<script type="text/html"  class="disN" id="roleAcctTreeLayer">--%>
        <%--<div class="p20">--%>
            <%--<blockquote class="layui-elem-quote" style="padding: 10px;">--%>
                <%--若选中“平台”保存，新增该平台店铺时，默认继承授权。--%>
                <%--<div class="layui-form" id="rolePlatAuthAddForm">--%>
                <%--</div>--%>
            <%--</blockquote>--%>
            <%--<form class="layui-form" id="roleAcctForm">--%>
                <%--<input type="hidden" name="id" class="layui-input">--%>
                <%--<div id="roleAcctXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>--%>
            <%--</form>--%>
        <%--</div>--%>
    <%--</script>--%>
<script type="text/html"  class="disN" id="roleAcctTreeLayer">
    <input id="role_input_userid" type="hidden">
    <div class="layui-card" style="box-shadow:none;">
        <div class="layui-card-body">
            <div class="layui-col-md12 fsize18">
                授予平台
            </div>
            <div class="layui-col-md12 bordereee">
                <span style="color:red">*</span>
                若选中“平台”保存，新增该平台店铺时，默认继承授权。
                <div class="layui-form" id="rolePlatAuthAddForm">
                </div>
            </div>
            <div class="layui-col-md12 fsize18">
                授予店铺
            </div>
            <div class="layui-col-md12">
                <div class="layui-col-md6">
                    <form class="layui-form bordereee" id="role_layerform1">
                        未授权店铺
                        <div class="layui-form-item dis_flex">
                            <select name="platCode" id="role_searchCondition1_platcode" xm-select="role_searchCondition1_platcode" xm-select-search 
                                xm-select-search-type="dl" xm-select-skin="normal">
                            </select>
                            <input class="layui-input" placeholder="多值逗号分隔" id="role_searchCondition1">
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="roleSearchBtn1">查找</a>
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="roleExportBtn1">导出</a>
                        </div>
                        <div class="layui-form-item dis_flex">
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="role_add_authorization">批量添加授权</a>
                            <span>已选择：<span name="checkData">0</span></span>
                        </div>
                        <table id="roleacctTreeLayerTable1" lay-filter="roleacctTreeLayerTable1"></table>
                        <input type="hidden" name="page" value="1">
                        <input type="hidden" name="limit" value="100">
                        <div id="roleacctTreeLayerTablepage1"></div>
                    </form>

                </div>
                <div class="layui-col-md6">
                    <form class="layui-form bordereee" id="role_layerform2">
                        已授权店铺
                        <div class="layui-form-item dis_flex">
                            <select name="platCode" id="role_searchCondition2_platcode" xm-select="role_searchCondition2_platcode" xm-select-search 
                            xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                            <input class="layui-input" placeholder="多值逗号分隔" id="role_searchCondition2">
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="roleSearchBtn2">查找</a>
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="roleExportBtn2">导出</a>
                        </div>
                        <div class="layui-form-item dis_flex">
                            <a class="layui-btn layui-btn-sm layui-btn-normal" id="role_delete_authorization">批量移除授权</a>
                            <span>已选择：<span name="checkData">0</span></span>
                        </div>
                        <table id="roleacctTreeLayerTable2" lay-filter="roleacctTreeLayerTable2"></table>
                        <input type="hidden" name="page" value="1">
                        <input type="hidden" name="limit" value="100">
                        <div id="roleacctTreeLayerTablepage2"></div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="roleacctTreeLayerTableBtn1">
    <a style="color:#1E9FFF" lay-event="create">添加授权</a>
</script>
<script type="text/html" id="roleacctTreeLayerTableBtn2">
    <a style="color:#1E9FFF" lay-event="delete">移除授权</a>
</script>
    <!-- 添加角色弹出层 -->
    <div class="disN" id="addRoleLayer">
        <div class="p20">
            <form class="layui-form layui-form-pane" id="addRoleForm">
                <div class="layui-form-item">
                    <label class="layui-form-label">名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" class="layui-input" lay-verify="required|unique">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">排序号</label>
                    <div class="layui-input-block">
                        <input type="text" name="sort" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea name="remark" class="layui-textarea"></textarea>
                    </div>
                </div>

                <div class="layui-form-item" style="display: none;">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit="" lay-filter="addRole" id="submitAddRole">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- 编辑角色弹出层 -->
    <div class="disN" id="editRoleLayer">
        <div class="p20">
            <form class="layui-form layui-form-pane" id="editRoleForm">
                <input type="hidden" name="id" class="layui-input" lay-verify="required">
                <div class="layui-form-item">
                    <label class="layui-form-label">名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" class="layui-input" lay-verify="required|unique">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">排序号</label>
                    <div class="layui-input-block">
                        <input type="text" name="sort" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <textarea name="remark" class="layui-textarea"></textarea>
                    </div>
                </div>
                <div class="layui-form-item disN">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit="" lay-filter="editBtn" id="submitEditBtn">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
        </div>
    </div>


<script type="text/html" id="sysRoleInsertSortLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="sysRoleInsertSort_FORM">
            <label class="layui-form-label">新排序号</label>
            <div class="layui-input-inline" style="width:100px">
                <input type="number" name="newSort" class="layui-input">
            </div>
        </form>
    </div>
</script>
    <-- 授权仓库模板 -->
    <script type="text/html" id="role_authWarehouseTpl">
        <form id="role_authWarehouseForm" class="layui-form p20">
            <div class="layui-form-item">
                <label class="layui-form-label">仓库:</label>
                <div class="layui-input-block">
                    <input lay-filter="role_checkProdhouseAll" type="checkbox" name="checkAll" lay-skin="primary" title="全部">
                    {{#  layui.each(d, function(index, item){ }}
                        <input lay-filter="role_checkProdhouseOne" type="checkbox" name="prodWarehouse" value="{{item.id}}" lay-skin="primary" title="{{item.warehouseName}}">
                    {{#  }); }}
                </div>
            </div>
        </form>
    </script>
    //授予报表
<script type="text/html" id="role_authTimetaskLayer">
  <div style="padding:20px;">
    <table class="layui-table" id="role_authTimetaskLayer_table"></table>
  </div>
</script>
<%-- 表格---状态 --%>
<script type="text/html" id="role_timetask_status">
<div>
    {{# if(d.status){ }}
    <span class="timetask_status_on">已启用</span>
    {{# }else{ }}
    <span class="timetask_status_off">未启用</span>
    {{# } }}
</div>
</script>
<%-- 表格---定时发送日期 --%>
<script type="text/html" id="role_timetask_sendDays">
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
<%-- 表格---收件人 --%>
<script type="text/html" id="role_timetask_recipientIds">
{{# if(d.recipients && d.recipients.length>0){ }}
{{#  layui.each(d.recipients, function(index, item){ }}
<span>{{item.userName}}</span>,
{{# }); }}
{{# } }}
</script>
    <script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
    <script type="text/javascript" src="${ctx}/static/js/configuration/staff/role.js"></script>