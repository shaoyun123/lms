<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>修改在线listing标签</title>
<style>
  .el-table-filter {
    z-index: 20231121 !important;
  }
  .el-table__column-filter-trigger {
    margin-left: 10px;
  }
  #lazadaUpdateListingTags_add_tplId {
    overflow: visible !important;
  }
</style>
<div class="layui-fluid" id="LAY-lazadaUpdateListingTags">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-header disFCenter">
          <div>
            <div class="w200" style="display: inline-block">
              <select
                name="listingTags"
                id="lazadaUpdateListingTags_tags"
                lay-filter="lazadaUpdateListingTags_tags"
                xm-select="lazadaUpdateListingTags_tags"
                xm-select-search
                xm-select-search-type="dl"
                xm-select-skin="normal"
                data-platcode="lazada"
              ></select>
            </div>
            <el-button size="mini" type="primary" @click="handleBatchAdd"
              >批量添加</el-button
            >
            <el-button size="mini" type="warning" @click="handleBatchRemove"
              >批量移除</el-button
            >
          </div>
          <el-button
            size="mini"
            type="danger"
            class="ml10"
            @click="handleRemoveAll"
            >清空已有标签</el-button
          >
        </div>
        <div class="layui-card-body">
          <el-table
            :data="tableData"
            height="400"
            border
            size="mini"
            row-key="itemIdVariId"
            :span-method="objectSpanMethod"
          >
            <el-table-column label="店铺" prop="storeAcct" width="180">
            </el-table-column>
            <el-table-column label="item_id" prop="itemId" width="180">
              <template slot="header" slot-scope="scope">
                <el-checkbox
                  v-model="allCheckedProduct"
                  size="mini"
                  @click.stop.native="()=>{}"
                  @change="handleAllCheckedProduct"
                ></el-checkbox>
                <span class="ml10">item_id</span>
              </template>
              <template slot-scope="{row}">
                <el-checkbox
                  v-model="row.checkedProduct"
                  size="mini"
                  @change="handleCheckedProduct(row)"
                  >{{ row.itemId }}</el-checkbox
                >
                <i
                  class="el-icon-circle-plus ml10"
                  style="color: #409eff; font-size: 16px"
                  @click="handleAddTag('productListingTagInfoList',row)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              label="product标签"
              prop="productListingTagInfoList"
            >
              <template slot-scope="{row}">
                <el-tag
                  v-for="tag in row.productListingTagInfoList"
                  :key="tag"
                  closable
                  size="mini"
                  @close="handleRemoveProductTag(row,tag)"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="taRight mt10">
            <el-button size="mini" type="primary" @click="handleSave"
              >确定</el-button
            >
            <el-button size="mini" @click="handleClose">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="lazadaUpdateListingTags_add_tpl">
  <div class="layui-card lazada_onlineproducts_bacthListingtag">
    <div class="layui-card-body layui-form">
      <div class="layui-form-item">
        <label class="layui-form-label">新增标签</label>
        <div class="layui-input-block disflex">
          <select
            name="addListingTagIdList"
            xm-select="lazadaUpdateListingTagsaddTag"
            lay-filter="lazadaUpdateListingTagsaddTag"
            xm-select-search
            xm-select-search-type="dl"
            xm-select-skin="normal"
          ></select>
        </div>
      </div>
    </div>
  </div>
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/lazada/updateLisitingTags.js"
></script>
