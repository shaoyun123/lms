<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>菜单资源</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div>
                            <button class="layui-btn layui-btn-normal layui-btn-sm" id="addSysResourceBtn">添加顶层菜单</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md4 layui-col-lg4">
                                <form class="layui-form" id="resourceManageTreeForm">
                                    <div id="resourceMangeXTree" style="position:absolute;left:0;top:0;padding: 10px 5px 25px 5px;background:#fff;overflow-y:auto;height:750px"></div>
                                </form>
                            </div>
                            <div class="layui-col-md8 layui-col-lg8" style="height:790px">
                                <table class="layui-table" id="resourceTable" lay-filter="resourceTable"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/html" id="resourceTypeBar">
        {{# if(d.type == 1){ }}
        <span>菜单</span> {{# } else if(d.type == 2) { }}
        <span>按钮</span> {{# } else if(d.type == 3) { }}
        <span>片段</span> {{# } else if(d.type == 9) { }}
        <span>其他</span> {{# } }}
    </script>
    <!-- 工具条模板,写在script里面，使用laytpl -->
    <script type="text/html" id="resourceOperBar">
        <a class="layui-btn layui-btn-xs" lay-event="addSub">增加子节点</a>
        <a class="layui-btn layui-btn-xs" lay-event="queryRoleAndUser">查看授权角色</a>
        <a class="layui-btn layui-btn-xs" lay-event="editRoleResource">授权角色</a>
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
    </script>
 

    <!-- 添加资源弹出层 -->
    <div class="disN" id="addLayer">
        <div class="p20">
            <form class="layui-form layui-form-pane" id="addForm">
                <input type="hidden" name="parentId" id="parentId">
                <div class="layui-form-item">
                    <label class="layui-form-label">资源类型</label>
                    <div class="layui-input-block">
                        <select name="type" id="addTypeSel" lay-search>
                                    <option value="1" selected>菜单</option>
                                    <option value="2" >按钮</option>
                                    <option value="3" >片段</option>
                                    <option value="9" >其他</option>
                                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">资源名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" class="layui-input" lay-verify="required" placeholder="必填">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">标签页名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="tabName" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">资源Code</label>
                    <div class="layui-input-block">
                        <input type="text" name="code" class="layui-input"  placeholder="按钮权限必填，要和自定义标签的funcCode一致">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">url</label>
                    <div class="layui-input-block">
                        <input type="text" name="url" class="layui-input"  placeholder="菜单权限必填，路径，文件夹或文件名">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">排序</label>
                    <div class="layui-input-block">
                        <input type="number" name="sort" class="layui-input" lay-verify="required|number" placeholder="必填，同级顺序">
                    </div>
                </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">资源路径</label>
                        <div class="layui-input-block">
                            <input type="text" name="smallIcon" class="layui-input" placeholder="只有顶层菜单需要图标美化"  >
                        </div>
                    </div>

                    <div class="layui-form-item">
                      <label class="layui-form-label">资源图标</label>
                      <!--资源图标现在用于记录目录绝对路径，如果为app配置，则继续使用图标名称-->
                      <div class="layui-input-block">
                          <input type="text" name="bigIcon" class="layui-input">
                      </div>
                    </div>

                    <div class="layui-form-item" style="display: none">
                        <div class="layui-input-block taRight">
                            <button class="layui-btn" lay-submit="" lay-filter="addBtn" id="submitAddResource">提交</button>
                            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                        </div>
                    </div>
            </form>
        </div>
    </div>

    <!-- 修改资源弹出层 -->
    <div class="disN" id="editLayer">
        <div class="p20">
            <form class="layui-form layui-form-pane " id="editForm">
                <input type="hidden" name="id">
                <div class="layui-form-item">
                    <label class="layui-form-label">资源类型</label>
                    <div class="layui-input-block">
                        <select name="type" id="editTypeSel" lay-search>
                                    <option value="1">菜单</option>
                                    <option value="2" >按钮</option>
                                    <option value="3" >片段</option>
                                    <option value="9" >其他</option>
                                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">资源名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" class="layui-input" lay-verify="required" placeholder="必填">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">标签页名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="tabName" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">资源Code</label>
                    <div class="layui-input-block">
                        <input type="text" name="code" class="layui-input"  placeholder="按钮权限必填，要和自定义标签的funcCode一致">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">url</label>
                    <div class="layui-input-block">
                        <input type="text" name="url" class="layui-input"  placeholder="菜单权限必填，路径，文件夹或文件名">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">排序</label>
                    <div class="layui-input-block">
                        <input type="number" name="sort" class="layui-input" lay-verify="required|number" placeholder="必填，同级顺序">
                    </div>
                </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">资源路径</label>
                        <!--资源图标现在用于记录目录绝对路径，如果为app配置，则继续使用图标名称-->
                        <div class="layui-input-block">
                            <input type="text" name="smallIcon" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">资源图标</label>
                      <!--资源图标现在用于记录目录绝对路径，如果为app配置，则继续使用图标名称-->
                      <div class="layui-input-block">
                          <input type="text" name="bigIcon" class="layui-input">
                      </div>
                    </div>

                    <div class="layui-form-item" style="display: none">
                        <div class="layui-input-block taRight">
                            <button class="layui-btn" lay-submit="" lay-filter="resource_editBtn" id="resource_submitEditResource">提交</button>
                            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                        </div>
                    </div>
            </form>
        </div>
    </div>
<script type="text/html" id="queryRoleAndUserLayer">
    <div style="padding:20px"  >
        <table  id="queryRoleAndUserTable"  style="text-align: center"></table>
    </div>
</script>

<script type="text/html" id="resource_editRoleResourceLayer">
    <div style="padding:10px 20px 20px 20px">
        <table id="resource_resource_editRoleResourceTable" style="text-align: center"></table>
    </div>
</script>

<script type="text/html" id="typeTpl">
    {{#  if(d.type == 1){ }}
        角色
    {{#  } else { }}
        用户
    {{#  } }}
</script>

<script type="text/html" id="statusTpl">
    {{#  if(d.status == 1){ }}
        启用
    {{#  } else { }}
    <span style="color: red">停用</span>
    {{#  } }}
</script>



    <script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
    <script type="text/javascript" src="${ctx}/static/js/configuration/staff/resource.js"></script>