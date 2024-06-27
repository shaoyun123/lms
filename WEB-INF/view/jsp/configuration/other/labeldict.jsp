<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>标签字典</title>
<style>
  .labeldict-authBtn {
    position: absolute;
    right: 5px;
    top: 8px;
    display: inline-block;
    width: 40px;
    height: 25px;
    line-height: 25px;
    border: 1px solid #f00;
    text-align: center;
    color: #f00;
    font-weight: 700;
    cursor: pointer;
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .flex-1{
    flex: 1;
  }
  .text-red{
    color: #f00;
    font-weight: bold;
  }
  .remark-hide{
    display: none;
  }
  .min-h-30{
    min-height: 30px;
  }
  .w-40{
    width: 40px;
  }
</style>
<div class="layui-fluid">
    <div class="layui-row">
        <div class="layui-col-md2" style="position: fixed;z-index:99;">
              <div class="layui-side-scroll" style="height:500px;overflow-y:scroll;">
                <!-- 左侧子菜单 -->
                <ul class="layui-nav layui-nav-tree" id="leftSearchDiv">
                  <li class="layui-nav-item layui-this">
                    <a>全部义字典头</a>
                    <button class="layui-btn layui-btn-primary layui-btn-sm" id="addBizHeadBtn"><i class="layui-icon"></i></button>
                  </li>
                  <li class="layui-nav-item" onclick="searchTag(${dictCate.id},this)">
                    <a>列宽自动分配</a>
                  </li>
                </ul>
              </div>
            </div>
        <div class="layui-col-md10" style="margin-left: 16%;">
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>表格</span>
                    <button class="layui-btn layui-btn-sm disN" type="button" id="bizDictSearch" data-type="reload">提交</button>
                    <span style="position:absolute;top:0;right:10px">
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addBizDictDetail">
                          添加字典
                        </button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <div class="flex text-red">
                        <div class="w-40">说明：</div>
                        <div class="flex flex-1 min-h-30" lay-event="doubleClick" id="remarkDivWrapper">
                            <div id="remarkDivDom"></div>
                            <input type="text" name="codeIntroduce" class="layui-input remark-hide" id="remarkInputDom">
                        </div>
                    </div>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="bizDictDetailTable" lay-filter="bizDictDetailTable"></table>
                    <script type="text/html" id="bizDictDetailBar">
                        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                       {{#  if(d.headCode!='LMS_PARAM_CONFIG'){  }}                          
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                       {{#  } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
    <permTag:perm funcCode="labeldict_checkAccessTokenPerm">
      <span class="labeldict_checkAccessTokenPermExist"></span>
    </permTag:perm>
</div>
<!-- 添加字典头按钮的弹出框 -->
<div class="disN" id="bizDictheadLayer">
   <div class="p20">
        <div class="layui-row">
                <form class="layui-form layui-form-pane mt20" action="" id="addBizDictHeadForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">应用代码</label>
                        <div class="layui-input-block">
                            <input type="text" name="appCode" lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">平台代码</label>
                        <div class="layui-input-block">
                            <input type="text" name="platCode" lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">分组名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="bizzGrp" lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">字典名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="name" lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">字典头代码</label>
                        <div class="layui-input-block">
                            <input type="text" name="headCode" lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item" pane="">
                        <label class="layui-form-label">是否数字值</label>
                        <div class="layui-input-block">
                            <input type="checkbox" checked="checked" name="isNumber" lay-skin="switch" lay-text="是|否">
                        </div>
                    </div>
                    <div class="layui-form-item" pane="">
                        <label class="layui-form-label">是否固定</label>
                        <div class="layui-input-block">
                            <input type="checkbox" checked="checked" name="isFixed" lay-skin="switch" lay-text="是|否">
                        </div>
                    </div>
                    <div class="layui-form-item disN">
                        <div class="layui-input-block taRight">
                            <button class="layui-btn" lay-submit lay-filter="addBizDictHead" id="addBizDictHead">提交</button>
                            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                        </div>
                    </div>
                </form>
            </div>
   </div>
</div>

<!-- 添加自定义字典弹出框 -->
<script type="text/html" id="addBizDictLayer">
     <div class="p20">
            <div class="layui-row">
                    <form class="layui-form layui-form-pane mt20" action="" id="addBizDictForm" lay-filter="addBizDictForm">
                        <input type="hidden" name="id">
                        <div class="layui-form-item">
                            <label class="layui-form-label">字典头</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="headCode" disabled lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="name" class="layui-input" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-form-item inputCode">
                            <label class="layui-form-label">code</label>
                            <div class="layui-input-block">
                                <input type="text" name="code" class="layui-input" lay-verify="required">
                            </div>
                        </div>
                        <div class="layui-form-item hidden selectCode">
                            <label class="layui-form-label">code</label>
                            <div class="layui-input-block">
                                <select name="code" lay-search></select>
                            </div>
                        </div>
                        <div id="label_dict_task_email0">
                            <div class="layui-form-item">
                                <label class="layui-form-label">扩展1</label>
                                <div class="layui-input-block">
                                    <input type="text" name="extend1" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">扩展2</label>
                                <div class="layui-input-block">
                                    <input type="text" name="extend2" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">扩展3</label>
                                <div class="layui-input-block">
                                    <input type="text" name="extend3" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div id="label_dict_task_email1">
                            <div class="layui-form-item">
                                <label class="layui-form-label">已选择邮箱</label>
                                <div class="layui-input-block">
                                    <div class="tagsinput-primary form-group">
                                        <input type="text" name="extend1" class="layui-input" id="label_dict_taskEmail_text"  placeholder="请在下方编辑">
                                        <span style="color: #428bca;padding-left: 10px;cursor: pointer" id="label_dict_edit_email_user">编辑邮箱</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="label_dict_task_msg_notice">
                            <div class="layui-form-item">
                                <label class="layui-form-label" style="height: 38px" >不通知平台</label>
                                <div class="layui-input-block">
                                    <select name="entexd1"  xm-select="msg_plat_code" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='msg_plat_code'>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">不通知人员</label>
                                <div class="layui-input-block">
                                    <div class="tagsinput-primary form-group">
                                        <input type="text" name="extend2" class="layui-input" id="label_dict_task_msg_dev"  placeholder="请在下方编辑" disabled>
                                        <span style="color: #428bca;padding-left: 10px;cursor: pointer" id="label_dict_edit_msg_user">编辑通知人员</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">排序</label>
                            <div class="layui-input-block">
                                <input type="number" name="sort" class="layui-input" min="0">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">说明</label>
                            <div class="layui-input-block">
                                <input type="text" name="note" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item disN">
                            <div class="layui-input-block taRight">
                                <button class="layui-btn" lay-submit="" lay-filter="addBizDict" id="addBizDict">提交</button>
                                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                        </div>
                    </form>
                </div>
     </div>
</script>
<script type="text/html" id="label_dict_org_layer">
    <div class="layui-col-md3">
        <div style="display: inline-block; padding: 4px; overflow: auto;">
            <form class="layui-form" id="emai_task_orgXTreeForm">
                <div id="emai_task_orgXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>
</script>

<%-- 弹框-授权用户 --%>
<script type="text/html" id="labeldict_authUserLayer">
  <div style="padding:20px;" id="labeldict_authUserLayerContainer">
    
  </div>
</script>
<%-- 弹框-授权用户--模板 --%>
<script type="text/html"  id="labeldict_authUserLayerContainerTpl">
  <div class="layui-form layui-row layui-col-space10">
    <div class="layui-col-lg9 layui-col-md9">
      <select 
      xm-select="storeAndPlatCodeAuthLayer_xmLabeldict"
      xm-select-search 
      xm-select-search-type="dl" 
      xm-select-skin="normal">
      {{#  layui.each(d.userList, function(index, item){ }}
        <option value="{{item.userId}}">{{item.userName}}({{item.name}})</option>
      {{# }); }}
    </select>
    </div>
    <div class="layui-col-lg3 layui-col-md3">
      <span class="layui-btn layui-btn-sm addAuthBtn">新增授权</span>
    </div>
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
      <tbody>
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
</script>



<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/js/configuration/other/labeldict.js"></script>
