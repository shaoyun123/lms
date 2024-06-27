<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>OA新类目</title>
<style>
  .contentright {
    position: relative;
    padding-top: 5px;
    top: 0;
    left: 65%;
    width: 30%;
    height: 20px;
  }
  .p20 {
    padding: 20px 40px 0 40px;
  }
  .p40 {
    padding-left: 20px;
  }
  .p10 {
    margin-top: 10px;
  }
</style>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <div>
            <button class="layui-btn layui-btn-normal layui-btn-sm" id="addCategoryBtn">添加类目</button>
            <button class="layui-btn layui-btn-normal layui-btn-sm" id="modifyCategoryBtn">修改类目</button>
            <button class="layui-btn layui-btn-normal layui-btn-sm" id="removeCategoryBtn">删除类目</button>
            <button class="layui-btn layui-btn-normal layui-btn-sm" id="copyCategoryBtn">复制类目</button>
            <div style="float: right">
              <!-- <button class="layui-btn layui-btn-normal layui-btn-sm" id="integrityDetection" > 完整性检测 </button> -->
              <button class="layui-btn layui-btn-normal layui-btn-sm" id="adddAttribute">新增属性</button>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-row layui-col-space10">
            <div class="layui-col-md4 layui-col-lg4">
              <!-- 树形节点 -->
              <form class="layui-form" id="resourceManageTreeForm">
                <div id="resourceMangeXTree" style="position: absolute; left: 0; top: 0; padding: 10px 5px 25px 5px; background: #fff; overflow-y: auto; height: 750px"></div>
              </form>
            </div>
            <!-- 显示表格 -->
            <div class="layui-col-md8 layui-col-lg8" style="height: 790px">
              <table class="layui-table" id="resourceTable" lay-filter="resourceTable"></table>
              <div class="layui-input-block taRight"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具条模板,写在script里面，使用laytpl -->
    <script type="text/html" id="resourceOperBar">
      <a class="layui-btn layui-btn-xs" lay-event="edit" id="editattribute">修改</a>
    </script>
    <!-- 工具条模板,写在script里面，使用laytpl -->
    <script type="text/html" id="removeOperBar">
      <a class="layui-btn layui-btn-xs" lay-event="edit" id="removeattribute">移除</a>
    </script>

    <!-- 添加资源弹出层 -->
    <div class="disN" id="addLayer">
      <div class="p20">
        <form class="layui-form layui-form-pane" id="addForm">
          <input type="hidden" name="pcateId" id="pcateId" />
          <input type="hidden" name="id" id="id" />
          <div class="layui-form-item">
            <label class="layui-form-label">类目名称</label>
            <div class="layui-input-block">
              <input type="text" name="cateName" class="layui-input"  placeholder="必填"  />
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">父类目</label>
            <div class="layui-input-block">
              <input type="text" name="parentCateName" class="layui-input" lay-verify="required" placeholder="必填" disabled  />
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">类目排序</label>
            <div class="layui-input-block operationBox">
              <input type="number" name="sort"  class="layui-input" placeholder="正整数" min='0'/>
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

    <!-- 新增/修改属性 -->
    <script type="text/html" id="newaAttribute">
      <div class="p10">
        <form class="layui-form layui-form-pane" id="addAttribute">
          <input type="hidden" name="id" />
          <input type="hidden" name="cateOaId" />
          <div class="layui-col-md7 layui-col-lg7 p40">
            <div class="layui-form-item">
              <label class="layui-form-label">属性名</label>
              <div class="layui-input-block">
                <input type="text" name="attrName" class="layui-input" placeholder="限制50个字符" />
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label" id="isMandatory">是否必填</label>
              <div class="layui-input-block">
                <input type="radio" name="fill" value="1" title="必填" checked />
                <input type="radio" name="fill" value="0" title="非必填" />
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">排序</label>
              <div class="layui-input-block">
                <div class="operationBox">
                  <input type="number" name="sort" class="layui-input" placeholder="正整数" min='0' />
                </div>
              </div>
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="contentright">
              <div class="operationBox" style="position: absolute;top: 0;left: 0;height: 36px;width: 60%;margin-top: 8px;">
                <input type="number" name="code" class="layui-input" style="float: left;width: 100%;" id="adddrow" min='1'/>
              </div>
              <button type="button" class="layui-btn layui-btn-normal" style="float: right; margin-right: 10px;" id="addRow_AttrRoleTable">新增行</button>
            </div>
          </div>
          <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-form-item" style="display: none">
              <div class="layui-input-block taRight">
                <button class="layui-btn" lay-submit="" lay-filter="resource_editBtn" id="attribute">提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="layui-col-md12 layui-col-lg12">
        <form class="layui-form" id="attributeForm">
          <div style="padding:20px">
            <table id="queryAttrRoleTable" style="text-align: center" lay-filter="queryAttrRoleTable"></table>
          </div>
        </form>
      </div>
    </script>

    <script type="text/html" id="resource_editRoleResourceLayer">
      <div style="padding:10px 20px 20px 20px">
        <table id="resource_resource_editRoleResourceTable" style="text-align: center"></table>
      </div>
    </script>

    <!-- 复制类目弹出框 -->
    <script type="text/html" id="copyCategory">
      <div class="layui-col-md12 layui-col-lg12">
        <form class="layui-form layui-form-pane" id="copyCategory_Form">
          <input type="hidden" name="coppiedCateOaId" id="coppiedCateOaId" />
          <div class="layui-form-item">
            <label class="layui-form-label">原类目名</label>
            <div class="layui-input-block">
              <input type="text" name="coppiedNewCateName" class="layui-input"  placeholder="必填"/>
            </div>
          </div>
          <div class="layui-form-item">
            <label class="layui-form-label">新类目名</label>
            <div class="layui-input-block">
              <input type="text" name="newCateOaName" class="layui-input" placeholder="必填" />
            </div>
          </div>
        </form>
      </div>
    </script>

    <script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
    <script type="text/javascript" src="${ctx}/static/js/commodity/template/OAcategory.js"></script>
  </div>
</div>
