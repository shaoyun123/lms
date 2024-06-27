<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt修改欧盟责任人</title>
<style>
  .con {
    margin-left:100px;
  }
  .colorRed {
    color:red
  }
  .fontSize20 {
    font-size:20px;
  }
</style>
<div class="layui-fluid" id="LAY-smtProductQualification">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div><span class="colorRed fontSize20">*</span>调整项<span style="color:#ff9900;padding:10px;">针对以下带 * 的资质项仅表示该类目下必须上传的资质，不用必须勾选，只需要勾选本次需要修改的资质项</span>
            <form class="layui-form checkboxForm" style="padding:10px 100px"> </form>
        </div>
        <div>资质信息<span style="color:#ff9900;padding:10px;">如果你在以下国家售卖商品，请提交该国家要求的商品资质，否则商品可能无法在该国家展示</span></div>
        <input type="hidden" class="containerData" />
        <div class="con container"> </div>
       </div>
       <div class="layui-card-body">
          <div class="disFCenter">
            <div>数量(<span id="smtProductQualification_total"></span>)</div>
            <button
              type="reset"
              class="layui-btn layui-btn-sm layui-btn-danger"
              id="smtProductQualification_update"
            >
              批量调整
            </button>
          </div>
          <table
            class="layui-table"
            id="smtProductQualification_table"
            lay-filter="smtProductQualification_table"
          ></table>
        </div>
    </div>
  </div>
</div>

<script type="text/html" id="smtProductQualification_table_result_info">
  <div class="result"></div>
  <input
    type="text"
    name="{{'itemId_'+d.itemId}}"
    class="hidden"
    value="{{d.itemId}}"
  />
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtProductQualification.js"
></script>
