<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>临时位置</title>
<style>
    .floatLeft {
        float: left;
    }
    .floatRignt {
        float: right;
    }
    .p0h24 {
        padding: 0 10px;
        margin: 0 10px;
        height: 24px;
        line-height: 24px;
    }
    .willChoose {
        color: red;
    }
    .tipsRed {
        color: brown;
        border: 1px solid brown;
    }
</style>
<div class="layui-fluid" id="stockTemporaryLocation"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-header" style="padding: 20px 0 20px 10px;">
                    <form class="layui-form" id="stockTemporaryLocation_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">操作时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="operationTime" id="stockTemporaryLocation_operationTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="width:320px;">
                                <label class="layui-form-label">操作人</label>
                                <div class="layui-input-block">
                                    <input name="modifier" type="text" class="layui-input" placeholder="输入渐进搜索，支持离职人员查询">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">临时位置</label>
                                <div class="layui-input-block">
                                    <input name="tempLocationName" type="text" class="layui-input" placeholder="模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2"  style="width:415px;">
                                <label class="layui-form-label">sku</label>
                                <div class="layui-input-block">
                                    <input name="sSkuList" type="text" class="layui-input" placeholder="商品子SKU;单个模糊搜索;多个精确查询,逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="padding-left: 30px; width: 80px;">
                                    <span class="layui-btn layui-btn-sm" id="stockTemporaryLocation_form_search" style="transform: translateY(-5px);">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header" style="padding: 20px 20px 0;">
                    <div class="floatLeft">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="stockTemporayLocation_bulkremoveList">删除</button>
                    </div>
                    <div class="floatRignt">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="stockTemporayLocation_temporarylocation">临时位置设置</span>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="stockTemporayLocation_addList">新增</button>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="stockTemporayLocation_fileList">下载模板</button>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="stockTemporayLocation_bulkImportList"
                                onclick="BatchImport()">批量导入</button>
                        <input type="file" name="file" id="stockTemporayLocation_importProdTempLocation_file" hidden>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="exportDataBtn">导出</button>
                    </div>
                </div>
                <div class="layui-card-body" id="stockTemporaryLocation_table">
                    <table class="layui-table" id="stockTemporaryLocation_table1" lay-filter="stockTemporaryLocation_table1"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 表格操作按钮 -->
<script type="text/html" id="stockTemporaryLocation_templete_btn">
    <button type="button" class="layui-btn layui-btn-sm p0h20" lay-event="stockTemporayLocation_changeList">修改</button>
    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger p0h20" lay-event="stockTemporayLocation_removeList">删除</button>
</script>

<!-- 新增修改数据-layer弹窗 -->
<script type="text/html" id="stockTemporaryLocation_DataListLayer">
    <form class="layui-form p20" id="stockTemporaryLocationAddDataList_DataListLayer_form">
        <div class="layui-form-item">
            <div class="layui-col-lg12 layui-col-md12 mb10">
                <label class="layui-form-label">sku<span class="willChoose">*</span></label>
                <div class="layui-input-block">
                    <input name="prodSSku" type="text" class="layui-input" placeholder="请填写SKU">
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12 mb10">
                <label class="layui-form-label">临时位置<span class="willChoose">*</span></label>
                <div class="layui-input-block">
                    <input name="tempLocationName" type="text" class="layui-input" placeholder="请填写临时位置">
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12 mb10">
                <label class="layui-form-label">临时位置数量</label>
                <div class="layui-input-block">
                    <input name="tempLocationNum" type="number" class="layui-input" placeholder="输入" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                </div>
            </div>
        </div>
    </form>
</script>
<!-- ztt20231213-临时位置 -->
<script type="text/html" id="stockTemporayLocation_temporarylocationLayer">
  <div style="padding:20px;">
    <div style="text-align: right;">
      <span class="layui-btn layui-btn-sm layui-btn-normal refresh">刷新楼层</span>
    </div>
    <div>
      <table class="layui-table">
        <thead>
          <tr>
            <th>仓库</th>
            <th>楼栋</th>
            <th>楼层</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</script>
<script src="${ctx}/static/js/warehouse/stockTemporaryLocation.js"></script>