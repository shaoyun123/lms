<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>收货点货识别规则</title>
<style>
  .disf {
    display: flex;
  }
  .rrw50 {
    width: 50px;
  }
  .rrlh34 {
    line-height: 34px;
  }
  .rrwp90 {
    width: 90%;
  }
  .rrw110{
    width: 110px;
  }
  .rrmb10 {
    margin-bottom: 10px;
  }
  .rrtl {
    text-align: left;
  }
  .rrgray {
    color: #999;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
      <div class="layui-col-lg12 layui-col-md12">
          <!-- 搜索条件 -->
          <div class="layui-card">
              <div class="layui-card-body">
                   <form class="layui-form" id="receivegoodstransformruleForm">
                      <div class="layui-form-item">
                          <div class="layui-col-lg4 layui-col-md4">
                              <label class="layui-form-label labelSel">
                                <select name="timeType">
                                  <option value="1">创建时间</option>
                                  <option value="2">修改时间</option>
                              </select>
                              </label>
                              <div class="layui-input-block">
                                <input type="text" class="layui-input" id="receivegoodstransformrule_times" name="times" readonly>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">规则名称</label>
                              <div class="layui-input-block">
                                <input type="text" class="layui-input" autocomplete="off" name="ruleName">
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">规则状态</label>
                            <div class="layui-input-block">
                              <select name="status">
                                <option value="">全部</option>
                                <option value="1">启用</option>
                                <option value="0">关闭</option>
                              </select>
                            </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label labelSel">
                                <select name="userType">
                                  <option value="1">创建人</option>
                                  <option value="2">修改人</option>
                                </select>
                              </label>
                              <div class="layui-input-block">
                                <select name="userIdList"
                                  id="receivegoodstransformrule_creatorIdList"
                                  xm-select="receivegoodstransformrule_creatorIdList"
                                  xm-select-search
                                  xm-select-search-type="dl"
                                  xm-select-skin="normal">
                            </select> 
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2" style="padding-left:5px;">
                              <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="receivegoodstransformrule_submit">查询</span>
                              <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
          <%-- 操作 --%>
          <div class="layui-card" id="receivegoodstransformrule_card">
            <div class="fixHigh">
              <div class="layui-card-header">
                  <div class="fixTab">
                      <!-- 页签点击结构 -->
                      <div class="layui-tab" lay-filter="receivegoodstransformrule_tabs" id="receivegoodstransformrule_tabs">
                          
                      </div>
                      <!-- 下面的div放按钮,结构不要变化 -->
                      <div>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="receivegoodstransformrule_addLayerBtn">
                          新增
                        </span>
                      </div>
                  </div>
              </div>
            </div>
            <!-- 下面放表格 -->
            <div class="layui-card-body">
                <table class="layui-table" lay-filter="receivegoodstransformrule_tableFilter" id="receivegoodstransformrule_table"></table>
            </div>
          </div>
      </div>
  </div>
</div>

<!-- 表格操作 -->
<script type="text/html" id="receivegoodstransformrule_tableIdBar">
  <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a></div>
  <div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</a></div>
</script>
<!-- 表格---状态 -->
<script type="text/html" id="receivegoodstransformrule_status">
  <div class="layui-form">
    {{# if(d.status){ }}
       <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" checked lay-filter="receivegoodstransformrule_tableStatus{{d.id}}">
    {{# }else{ }}
       <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="receivegoodstransformrule_tableStatus{{d.id}}">
    {{# } }}
  </div>
</script>
<!-- 表格---判断条件 -->
<script type="text/html" id="receivegoodstransformrule_judgeCondition">
  <div class="rrtl">
    {{# if(d.judgeConditionDto && d.judgeConditionDto.startStr){ }}
    <div><span class="rrgray">开头是:</span> {{d.judgeConditionDto.startStr}}</div>
    {{# } }}
    {{# if(d.judgeConditionDto && d.judgeConditionDto.containStr){ }}
    <div><span class="rrgray">其中包含:</span> {{d.judgeConditionDto.containStr}}</div>
    {{# } }}
    {{# if(d.judgeConditionDto && d.judgeConditionDto.endStr){ }}
    <div><span class="rrgray">结尾是:</span> {{d.judgeConditionDto.endStr}}</div>
    {{# } }}
    {{# if(d.judgeConditionDto && d.judgeConditionDto.strLength){ }}
    <div><span class="rrgray">总长度:</span> {{d.judgeConditionDto.strLength}}</div>
    {{# } }}
  </div>
</script>
<!-- 表格---执行规则 -->
<script type="text/html" id="receivegoodstransformrule_executeRule">
  <div class="rrtl">
    {{# if(d.executeRuleDto && d.executeRuleDto.startReserveLength){ }}
    <div>从开头开始保留{{d.executeRuleDto.startReserveLength}}位数</div>
    {{# } }}
    {{# if(d.executeRuleDto && d.executeRuleDto.endReserveLength){ }}
    <div>从末尾开始保留{{d.executeRuleDto.endReserveLength}}位数</div>
    {{# } }}
    {{# if(d.executeRuleDto && d.executeRuleDto.submitLengthDto && d.executeRuleDto.submitLengthDto.startSubmitLength && d.executeRuleDto.submitLengthDto.endSubmitLength  ){ }}
    <div>从第 {{d.executeRuleDto.submitLengthDto.startSubmitLength}}位数开始保留到第{{d.executeRuleDto.submitLengthDto.endSubmitLength}}位数</div>
    {{# } }}
  </div>
</script>

<!-- 弹框-新增识别规则 -->
<script type="text/html" id="receivegoodstransformrule_ruleLayer">
  <form class="layui-form p20" id="receivegoodstransformrule_ruleLayerForm"></form>
</script>
<script type="text/html" id="receivegoodstransformrule_ruleLayerFormTpl">
  <form class="layui-form">
    {{# if(d.id){ }}
    <input type="hidden" name="id" value="{{d.id}}">
    {{# } }}
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>规则名称</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" autocomplete="off" name="ruleName" value="{{d.name}}">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">备注</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" autocomplete="off" name="remark" value="{{d.remark}}">
      </div>
    </div>
    <div class="layui-form-item disf judgeCondition">
      <label class="layui-form-label"><font color="red">*</font>判断条件</label>
      <div class="layui-row">
        <div class="layui-col-lg6 layui-col-md6 disf rrlh34 rrmb10">
          <label class="layui-form-label">开头是</label>
          <div>
            <input type="text" class="layui-input" autocomplete="off" name="startStr" value="{{d.judgeConditionDto.startStr}}">
          </div>
        </div>
        <div class="layui-col-lg6 layui-col-md6 disf rrlh34 rrmb10">
          <label class="layui-form-label">其中包含</label>
          <div>
            <input type="text" class="layui-input" autocomplete="off" name="containStr" value="{{d.judgeConditionDto.containStr}}">
          </div>
        </div>
        <div class="layui-col-lg6 layui-col-md6 disf rrlh34">
          <label class="layui-form-label">结尾是</label>
          <div>
            <input type="text" class="layui-input" autocomplete="off" name="endStr" value="{{d.judgeConditionDto.endStr}}">
          </div>
        </div>
        <div class="layui-col-lg6 layui-col-md6 disf rrlh34">
          <label class="layui-form-label">总长度</label>
          <div>
            <input type="number" class="layui-input" name="strLength" value="{{d.judgeConditionDto.strLength}}" placeholder="请在输入框中填写数字" min="1">
          </div>
        </div>
      </div>
    </div>
    <div class="layui-form-item disf executeRule">
      <label class="layui-form-label"><font color="red">*</font>执行规则</label>
      <div class="rrwp90">
        <div class="rrlh34 disf rrmb10">
          <div>
            <input type="radio" name="ruleItems" value="1">
          </div>
          <div class="disf rrlh34">
            <div>从第</div>
            <input class="layui-input rrw110" name="startSubmitLength" value="{{d.executeRuleDto.submitLengthDto.startSubmitLength}}" min="1" type="number">
            <div class="rrw110">位数  保留到第</div>
            <input class="layui-input rrw110" name="endSubmitLength" value="{{d.executeRuleDto.submitLengthDto.endSubmitLength}}" min="1" type="number">
            <div>位数</div>
          </div>
        </div>
        <div class="rrlh34 disf rrmb10">
          <div>
            <input type="radio" name="ruleItems" value="2">
          </div>
          <div class="disf rrlh34">
            <div class="rrw110">从开头开始保留</div>
            <input class="layui-input rrw110" name="startReserveLength" value="{{d.executeRuleDto.startReserveLength}}" min="1" type="number">
            <div>位数</div>
          </div>
        </div>
        <div class="rrlh34 disf">
          <div>
            <input type="radio" name="ruleItems" value="3">
          </div>
          <div class="disf rrlh34">
            <div class="rrw110">从末尾开始保留</div>
            <input class="layui-input rrw110" name="endReserveLength" value="{{d.executeRuleDto.endReserveLength}}" min="1" type="number">
            <div>位数</div>
          </div>
        </div>
      </div>
    </div>
  </form>
</script>


<script src="${ctx}/static/js/warehouse/receivegoodstransformrule.js"></script>