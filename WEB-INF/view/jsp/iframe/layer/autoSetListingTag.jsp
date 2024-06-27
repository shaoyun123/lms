<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<title>自动标签配置</title>
<style>
  .el-select-dropdown {
    z-index: 99999999 !important;
  }

  .cell-highLight {
    background-color: #fdf5e6;
  }
  .fieldBox_autoSetListing {
    float: left;
    width: 20%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<div class="layui-fluid" id="LAY-autoSetTag-page">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-header disFCenter">
          <div class="fRed" style="line-height: 20px">
            日志结果添加标签逻辑：当最新一条日志满足条件时触发，每条日志仅触发一次标签操作。
            <br />
            修改内容后请先点击"保存"按钮，否则点击“处理在线listing”按钮，只会按照未修改前的条件进行处理。
          </div>

          <div>
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal"
              @click="handleDealListing"
              >处理在线listing</a
            >
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal"
              @click="handleAdd"
              >新增行</a
            >
          </div>
        </div>
        <div class="layui-card-body disflex" id="LAY-autoSetTag-page-card">
          <!-- 表格的数据渲染 -->
          <el-table
            :data="tableData"
            height="600"
            border
            :cell-class-name="highLightCurCell"
            @row-click="handleRowClick"
          >
            <el-table-column width="55">
              <template slot="header" slot-scope="scope">
                <el-checkbox
                  v-model="allChecked"
                  @change="handleAllChecked"
                ></el-checkbox>
              </template>
              <template slot-scope="{row}">
                <el-checkbox
                  v-model="row.checked"
                  :disabled="!(row.triggerConditionType===0 &&!row.isNewTr)"
                  @change="handleOneChecked"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="在线listing标签"
              prop="listingTagId"
              width="150"
            >
              <template slot-scope="{row}">
                <div v-if="!row.isEditRow" class="row-cell">
                  {{ renderListingTag(row.listingTagId) }}
                </div>
                <template v-else>
                  <el-select
                    v-model="row.listingTagId"
                    placeholder="请选择标签"
                    filterable
                    size="small"
                  >
                    <el-option
                      v-for="item in tagList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="配置对象" prop="processingType" width="150">
              <template slot-scope="{row}">
                <div v-if="!row.isEditRow" class="row-cell">
                  {{ renderProcessingType(row.processingType) }}
                </div>
                <el-select
                  v-else
                  v-model="row.processingType"
                  placeholder="请选择配置对象"
                  filterable
                  size="small"
                  @change="handleChangeProcessingType(row)"
                >
                  <el-option
                    v-for="item in processingTypeList"
                    ::key="item.code"
                    :label="item.desc"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="标签操作" prop="type" width="150">
              <template slot-scope="{row}">
                <div v-if="!row.isEditRow" class="row-cell">
                  {{ renderType(row.type) }}
                </div>
                <el-select
                  v-else
                  v-model="row.type"
                  placeholder="请选择标签操作"
                  filterable
                  size="small"
                  @change="handleChangeType(row)"
                >
                  <el-option
                    v-for="item in typeList"
                    ::key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="标签条件" prop="listingTagCondition">
              <template slot-scope="{row}">
                <div v-if="!row.isEditRow" class="row-cell">
                  {{ getTagConditionDesc(row) }}
                </div>
                <div v-else class="disflex">
                  <el-select
                    v-model="row.triggerConditionType"
                    placeholder="请选择"
                    filterable
                    size="small"
                    @change="handleChangeTriggerConditionType(row)"
                  >
                    <template
                      v-for="item in triggerConditionTypeList"
                      :key="item.code"
                    >
                      <el-option
                        v-if="item.show"
                        :label="item.desc"
                        :value="item.code"
                      ></el-option>
                    </template>
                  </el-select>
                  <el-select
                    v-model="row.conditionInclude"
                    placeholder="请选择"
                    filterable
                    size="small"
                    @change="handleConditionInclude(row)"
                  >
                    <el-option label="包含" :value="true"></el-option>
                    <el-option
                      v-if="row.triggerConditionType==0"
                      label="不包含"
                      :value="false"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="row.triggerConditionType===0"
                    v-model="row.conditionListingFilterCodeList"
                    :multiple-limit="row.conditionInclude ? 9999 : 1"
                    clearable
                    multiple
                    filterable
                    collapse-tags
                    size="small"
                  >
                    <el-option
                      v-for="item in prodFilterListingTypeList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    v-else-if="row.triggerConditionType===1"
                    v-model="row.conditionLogText"
                    size="small"
                    clearable
                  ></el-input>
                  <el-select
                    v-else-if="row.triggerConditionType===2"
                    v-model="row.autoAdjustPriceLogCodeList"
                    clearable
                    multiple
                    filterable
                    collapse-tags
                    size="small"
                  >
                    <el-option
                      v-for="item in autoAdjustPriceLogEnum"
                      :key="item.code"
                      :label="item.desc"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-else-if="row.triggerConditionType===3"
                    v-model="row.developmentNoticeTypeList"
                    clearable
                    multiple
                    filterable
                    collapse-tags
                    size="small"
                  >
                    <el-option
                      v-for="item in developDictList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="适用店铺" prop="shopCount" width="100">
              <template slot-scope="{row,$index }">
                <el-button type="text" @click="handleOpenStore(row,$index)">{{
                  row.shopCount
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="{row,$index }">
                <div class="fRed row-cell" @click="handleRemove(row,$index)">
                  移除
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="autoSetListing_matchStorePop">
  <div
    class="p10"
    style="display: flex;justify-content: space-between;flex-direction: column;"
  >
    <div class="layui-tab layui-tab-card">
      <form
        class="layui-form"
        lay-filter="matchStoreForm_autoSetListing"
        id="matchStoreForm_autoSetListing"
      >
        <div class="layui-form-item layui-row" style="padding: 5px 0;">
          <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">全选</label>
            <div class="layui-input-block" style="line-height: 30px!important;">
              <input
                type="checkbox"
                lay-skin="primary"
                title=""
                lay-filter="matchStoreForm_autoSetListing_checkAll"
              />
            </div>
          </div>
          <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">店铺</label>
            <div class="layui-input-block">
              <input
                type="text"
                lay-skin="primary"
                title=""
                name="storeAcct"
                placeholder="单个模糊，多个精确逗号分隔"
                autocomplete="off"
                class="layui-input"
              />
            </div>
          </div>
          <div class="layui-col-md4 layui-col-lg4">
            <div class="layui-input-block" style="line-height: 30px!important;">
              <button
                type="button"
                class="layui-btn ml20 layui-btn-sm keyHandle"
                lay-submit
                lay-filter="matchStoreForm_autoSetListing_submit"
              >
                搜索
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="layui-tab layui-tab-card">
      <div
        class="layui-card-header"
        style="color: #468847;background-color: #dff0d8"
      >
        已选择店铺
        <button
          type="button"
          class="layui-btn ml20 layui-btn-xs"
          name="autoSetListingCopy"
          id="autoSetListingCopy"
          style="margin-left:100px;"
        >
          一键复制
        </button>
        <button
          type="button"
          class="layui-btn ml20 layui-btn-xs"
          name="autoSetListingCopy"
          id="autoSetListingEmpty"
          style="margin-left:100px;"
        >
          清空
        </button>
      </div>
      <div class="layui-card-body">
        <form
          class="layui-form"
          id="matchStoreForm_autoSetListing_checked"
          lay-filter="matchStoreForm_autoSetListing_checked"
        ></form>
      </div>
    </div>
  </div>
</script>

<script
  type="text/javascript"
  src="${ctx}/static/js/common/autoSetListingTag.js"
></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
