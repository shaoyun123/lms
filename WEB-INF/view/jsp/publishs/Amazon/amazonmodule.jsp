<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>Amazon模板</title>


<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <%-- 搜索模块 --%>
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" lay-filter="amazonmodule_form" id="amazonmodule_formId" method="post">
            <div class="layui-form-item">
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">启用状态</label>
                <div class="layui-input-block">
                    <select name="amazonmodule_modeStatus" lay-verify="required">
                      <option value="0">全部</option>
                      <option value="true">已启用</option>
                      <option value="false">未启用</option>
                    </select>
                </div>
              </div>
              <div class="layui-col-lg5 layui-col-md5">
                <label class="layui-form-label">店铺名称</label>
                <div class="layui-input-block">
                  <input type="text" name="amazonmodule_storeName" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">编辑状态</label>
                <div class="layui-input-block">
                  <select name="amazonmodule_editStatus" lay-verify="required">
                      <option value="0">全部</option>
                      <option value="true">已编辑</option>
                      <option value="false">未编辑</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <span class="layui-btn layui-btn-sm" lay-submit lay-filter='amazonmodule_form_btn'>搜索</span>
                  <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
      <%-- 表格模块 --%>
      <div class="layui-card">
          <div class="layui-card-body">
            <table class="layui-hide" id="amazonmodule_tableId" lay-filter="amazonmodule_tableFilter"></table>
          </div>
      </div>
      <%-- 工具栏 --%>
      <script type="text/html" id="amazonmodule_tableIdBar">
         <button class="layui-btn layui-btn-xs" lay-event="amazonmodule_tableEdit">编辑</button>
      </script>
    </div>
  </div>
</div>

<%-- 编辑详情弹框 --%>
<script type="text/html" id="amazonmodule_storeDetail">
    <div class="layui-tab" lay-filter="amazonmodule_tab">
      <ul class="layui-tab-title">
        <li class="layui-this">英语</li>
        <li>德语</li>
        <li>法语</li>
        <li>西班牙语</li>
        <li>意大利语</li>
          <li>日语</li>
      </ul>
      <div class="layui-tab-content">
        <div class="layui-tab-item layui-show">
            <div style="display: flex;padding: 0 20px;">
              <div style="width:50px;">描述头</div>
              <div style="flex:1;">
                  <textarea  id="en_amazonmodule_descHead" autofocus>  
                  </textarea>
              </div>
            </div>
            <div style="display: flex;margin-top: 30px;padding: 0 20px;">
              <div style="width:50px;">描述尾</div>
              <div style="flex:1;">
                  <textarea id="en_amazonmodule_descFooter" autofocus>  
                  </textarea>
              </div>
            </div>
        </div>
        <div class="layui-tab-item">
        <div style="display: flex;padding: 0 20px;">
            <div style="width:50px;">描述头</div>
              <div style="flex:1;">
                  <textarea id="de_amazonmodule_descHead" autofocus>  
                  </textarea>
              </div>
            </div>
            <div style="display: flex;margin-top: 30px;padding: 0 20px;">
              <div style="width:50px;">描述尾</div>
              <div style="flex:1;">
                  <textarea id="de_amazonmodule_descFooter" autofocus>  
                  </textarea>
              </div>
            </div>
        </div>
        <div class="layui-tab-item">
        <div style="display: flex;padding: 0 20px;">
            <div style="width:50px;">描述头</div>
              <div style="flex:1;">
                  <textarea id="fra_amazonmodule_descHead" autofocus>  
                  </textarea>
              </div>
            </div>
            <div style="display: flex;margin-top: 30px;padding: 0 20px;">
              <div style="width:50px;">描述尾</div>
              <div style="flex:1;">
                  <textarea id="fra_amazonmodule_descFooter" autofocus>  
                  </textarea>
              </div>
            </div>
        </div>
        <div class="layui-tab-item">
            <div style="display: flex;padding: 0 20px;">
              <div style="width:50px;">描述头</div>
              <div style="flex:1;">
                  <textarea id="spa_amazonmodule_descHead" autofocus>  
                  </textarea>
              </div>
            </div>
            <div style="display: flex;margin-top: 30px;padding: 0 20px;">
              <div style="width:50px;">描述尾</div>
              <div style="flex:1;">
                  <textarea id="spa_amazonmodule_descFooter" autofocus>  
                  </textarea>
              </div>
            </div>
        </div>
        <div class="layui-tab-item">
            <div style="display: flex;padding: 0 20px;">
              <div style="width:50px;">描述头</div>
              <div style="flex:1;">
                  <textarea id="it_amazonmodule_descHead" autofocus>  
                  </textarea>
              </div>
            </div>
            <div style="display: flex;margin-top: 30px;padding: 0 20px;">
              <div style="width:50px;">描述尾</div>
              <div style="flex:1;">
                  <textarea id="it_amazonmodule_descFooter" autofocus>
                  </textarea>
              </div>
            </div>
        </div>
          <div class="layui-tab-item">
              <div style="display: flex;padding: 0 20px;">
                  <div style="width:50px;">描述头</div>
                  <div style="flex:1;">
                  <textarea id="jp_amazonmodule_descHead" autofocus>
                  </textarea>
                  </div>
              </div>
              <div style="display: flex;margin-top: 30px;padding: 0 20px;">
                  <div style="width:50px;">描述尾</div>
                  <div style="flex:1;">
                  <textarea id="jp_amazonmodule_descFooter" autofocus>
                  </textarea>
                  </div>
              </div>
          </div>
      </div>
    </div>
</script>

<script src="${ctx}/static/js/publishs/amazon/amazonmodule.js"></script>
<script src="${ctx}/static/simditor/module.js"></script>
<script src="${ctx}/static/simditor/hotkeys.js"></script>
<script src="${ctx}/static/simditor/simditor.js"></script>