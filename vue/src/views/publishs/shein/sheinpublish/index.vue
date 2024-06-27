<template>
  <!-- 美科多刊登页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="sheinData.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="sheinData.formData.orgId"
            placeholder="请选择"
            :data="selectData.departData"
            check-strictly
            :props="defaultProps"
            :render-after-expand="false"
            :empty-text="'No matching Data'"
            clearable
            filterable
            @node-click="handleNodeClick"
            @clear="clearDepart"
          />
        </el-form-item>
        <el-form-item label="销售员" prop="salePersonId">
          <el-select
            v-model="sheinData.formData.salePersonId"
            placeholder="请选择"
            clearable
            filterable
            @change="changeSalers"
            @clear="resetSearch"
          >
            <el-option
              v-for="item in selectData.salersData"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctId">
          <el-select
            v-model="sheinData.formData.storeAcctId"
            placeholder="请选择"
            clearable
            filterable
            @change="acctGetListingLimit"
          >
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="OA新类目" prop="cateName">
        <el-input
          v-model="sheinData.formData.cateName"
          readonly
          @click="handleCateDialogOpen()"
          ><template #append>
            <el-button
              :icon="Delete"
              @click="
                sheinData.formData.cateOaId = sheinData.formData.cateName =
                  ''
              "
            />
          </template>
        </el-input>
      </el-form-item> -->
        <el-form-item
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="sheinData.formData.cateName"
            :options="sheinData.initFormData.oaList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="开发类型" prop="devType">
          <el-select
            v-model="sheinData.formData.devType"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in sheinData.initFormData.devTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="商品标签" prop="tag">
          <el-select
            v-model="sheinData.formData.tag"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in sheinData.initFormData.prodAttrList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="物流属性" prop="logisAttrList">
          <el-select
            v-model="sheinData.formData.logisAttrList"
            placeholder="请选择"
            :class="
              sheinData.formData.logisAttrList.length > 1 ? 'hideTag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="sheinData.formData.logisAttrList.length > 1"
                type="info"
                >已选{{ sheinData.formData.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in sheinData.initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="activeName != '商品'"
          prop="canSaleBool"
          label="是否禁售"
          ><el-select v-model="sheinData.formData.canSaleBool">
            <el-option value="true" label="非禁售" />
            <el-option value="false" label="禁售" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="开发专员" prop="bizzOwnerIds">
          <el-select
            v-model="sheinData.formData.bizzOwnerIds"
            :class="sheinData.formData.bizzOwnerIds.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="sheinData.formData.bizzOwnerIds.length > 1"
                type="info"
                >已选{{ sheinData.formData.bizzOwnerIds.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in sheinData.initFormData.bizzOwnerIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br />
        <!-- <el-form-item label="在售状态" prop="isSale">
          <el-select v-model="sheinData.formData.isSale">
            <el-option value="" label="全部" />
            <el-option value="true" label="在售" />
            <el-option value="false" label="停售" />
          </el-select>
        </el-form-item> -->
        <el-form-item
          v-if="activeName == '商品'"
          label="生成情况"
          prop="isGeneral"
        >
          <el-select v-model="sheinData.formData.isGeneral">
            <el-option value="" label="全部" />
            <el-option :value="true" label="未生成" />
            <el-option :value="false" label="已生成" />
          </el-select>
        </el-form-item>
        <el-form-item prop="tortBanListing" label="侵权状态"
          ><el-select
            v-model="sheinData.formData.tortBanListing"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="所有平台不侵权" value="ANY_PLAT" />
          </el-select>
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select v-model="sheinData.formData.timeType" class="form_left">
            <el-option
              v-if="activeName == '商品'"
              value="CREATE_TIME"
              label="创建时间"
            />
            <el-option
              v-if="activeName != '商品'"
              value="GENERAL_TIME"
              label="生成时间"
            />
            <el-option
              v-if="activeName == '商品' || activeName == '待刊登'"
              value="AUDIT_TIME"
              label="审核时间"
            />
            <el-option
              v-if="activeName != '商品' && activeName != '待刊登'"
              value="LISTING_TIME"
              label="刊登时间"
            />
            <el-option
              v-if="activeName == '刊登中'"
              value="LIST_TIME"
              label="定时刊登时间"
            />
          </el-select>
          <el-date-picker
            v-model="sheinData.formData.time"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="salesSort" label="排序方式">
          <el-select
            v-model="sheinData.formData.salesSort"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-if="activeName == '商品'"
              label="创建时间倒序"
              :value="1"
            ></el-option>
            <el-option
              v-if="activeName == '商品'"
              label="创建时间正序"
              :value="0"
            ></el-option>
            <el-option
              v-if="activeName == '待刊登'"
              label="审核时间倒序"
              :value="3"
            ></el-option>
            <el-option
              v-if="activeName == '待刊登'"
              label="审核时间正序"
              :value="2"
            ></el-option>
            <el-option
              v-if="activeName != '商品'"
              :value="1"
              label="生成时间倒序"
            ></el-option>
            <el-option
              v-if="activeName != '商品'"
              label="生成时间正序"
              :value="0"
            ></el-option>
            <el-option
              v-if="
                activeName == '刊登中' ||
                activeName == '刊登成功' ||
                activeName == '刊登失败'
              "
              label="刊登时间倒序"
              :value="3"
            ></el-option>
            <el-option
              v-if="
                activeName == '刊登中' ||
                activeName == '刊登成功' ||
                activeName == '刊登失败'
              "
              label="刊登时间正序"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchSkuType">
          <el-select
            v-model="sheinData.formData.searchSkuType"
            class="form_left"
          >
            <el-option value="pSku" label="父SKU" />
            <el-option value="sSku" label="模板子SKU" />
            <el-option value="cnTitle" label="商品中文" />
            <el-option value="enTitle" label="商品英文" />
          </el-select>
          <el-input
            v-model="sheinData.formData.skuListStr"
            placeholder="多个逗号隔开"
            class="form_left form_right"
          />
          <el-select
            v-model="sheinData.formData.vagueSearch"
            class="form_right WH80"
          >
            <el-option value="false" label="精确" />
            <el-option value="true" label="模糊" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          label="刊登状态"
          prop="publishingStatus"
        >
          <el-select v-model="sheinData.formData.publishingStatus">
            <el-option value="" label="全部" />
            <el-option :value="false" label="未刊登" />
            <el-option :value="true" label="已刊登" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName != '商品' && activeName != '待刊登'"
          label="提交人"
          prop="listingUserId"
        >
          <el-select v-model="sheinData.formData.listingUserId" clearable>
            <el-option
              v-for="item in sheinData.initFormData.listingUser"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- <span style="font-size: 12px">{{ sheinData.formData.cateName }}</span> -->
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs
        v-model="activeName"
        v-loading="tableDataLoading"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="name in tabsName"
          :key="name.label"
          :label="name + `(${tabListCount[name]})`"
          :name="name"
        >
          <vxe-table
            ref="tableDataRef"
            :data="tableData"
            :element-loading-text="loadingText"
            :height="height"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.pimg" />
              </template>
            </vxe-column>
            <vxe-column field="enTitle" title="英文标题" />
            <vxe-column field="bizzOwner" title="商品名/开发专员" width="280">
              <template #default="{ row }">
                商品名：{{ row.cnTitle }}<br />
                开发专员：{{ row.bizzOwner }}
              </template>
            </vxe-column>
            <vxe-column field="prodPSku" title="父SKU" width="200">
              <template #default="{ row }">
                <div @click="openPskuDetails(row.prodPId)">
                  商品父SKU:<span style="color: #409eff">{{ row.psku }}</span>
                </div>
                <el-tag
                  v-if="row.published && row.published.length != 0"
                  type="success"
                  >已刊登</el-tag
                >
                <div v-if="activeName != '商品'">
                  店铺父SKU:{{ row.storePSku
                  }}<el-tag v-if="activeName == '刊登成功'" effect="dark"
                    >已</el-tag
                  >
                </div>

                <el-popover
                  v-if="activeName == '刊登失败' && row.listingRespMsg"
                  placement="top-start"
                  trigger="hover"
                  :content="row.listingRespMsg"
                  :width="500"
                >
                  <template #reference>
                    <el-tag
                      v-if="activeName == '刊登失败'"
                      type="info"
                      effect="dark"
                      @click="copy(row.listingRespMsg)"
                      >败</el-tag
                    >
                  </template>
                </el-popover>
              </template>
            </vxe-column>
            <vxe-column :width="activeName == '商品' ? 600 : 700">
              <template #header>
                <div style="display: flex; justify-content: center">
                  <div v-if="activeName == '商品'" style="width: 130px">
                    基础模板子SKU
                  </div>
                  <div v-if="activeName != '商品'" style="width: 130px">
                    店铺子SKU
                  </div>
                  <div style="width: 90px">颜色</div>
                  <div style="width: 80px">尺寸</div>
                  <div style="width: 80px">款式</div>
                  <div style="width: 50px">在售</div>
                  <!-- <div style="width: 100px">预计可用库存含在途/不含在途</div> -->
                  <div v-if="activeName != '商品'" style="width: 90px">
                    供货价(CNY)
                  </div>
                  <div style="width: 40px">采购成本</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="row.sinfo && row.sinfo.slice(0, row.displayCount)"
                  :show-header="false"
                >
                  <vxe-column
                    v-if="activeName == '商品'"
                    field="ssku"
                    width="140"
                  >
                    <template #default="{ row: sonRow }">
                      {{ sonRow.ssku }}
                      <el-tag v-if="sonRow.published" type="success"
                        >已刊登</el-tag
                      >
                    </template></vxe-column
                  >
                  <vxe-column
                    v-if="activeName != '商品'"
                    field="storeSSku"
                    width="140"
                  >
                    <template #default="{ row: sonRow }">
                      {{ sonRow.storeSSku }}
                      <el-tag v-if="sonRow.published" type="success"
                        >已刊登</el-tag
                      >
                    </template></vxe-column
                  >
                  <vxe-column field="color" />
                  <vxe-column field="size" />
                  <vxe-column field="style" />
                  <vxe-column field="isSale" width="40"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.isSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <!-- <vxe-column>
                    <template #default="{ row: sonRow }">{{
                      (sonRow.preAvailableStockAll || 0) +
                      '/' +
                      (sonRow.preAvailableStock || 0)
                    }}</template>
                  </vxe-column> -->
                  <vxe-column v-if="activeName != '商品'" field="costPrice">
                  </vxe-column>
                  <vxe-column field="price" />
                </vxe-table>
                <div
                  v-if="row.sinfo"
                  :class="[row.sinfo.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.sinfo" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column title="时间" width="160">
              <template #default="{ row }">
                <div v-if="activeName == '商品'">
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d}')
                      : ''
                  }}<br />
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d}')
                      : ''
                  }}
                </div>
                <div v-if="activeName == '待刊登'">
                  审核：{{
                    row.auditTime
                      ? parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}<br />
                  生成：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
                <div
                  v-if="
                    activeName == '刊登中' ||
                    activeName == '刊登成功' ||
                    activeName == '刊登失败'
                  "
                >
                  生成：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}<br />
                  刊登：{{
                    row.listingTime
                      ? parseTime(row.listingTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
                <!-- <div v-if="activeName == '刊登中' && row.listTiming">
                  定时刊登开始时间:<br />
                  {{
                    row.listTiming
                      ? parseTime(row.listTiming, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div> -->
              </template></vxe-column
            >
            <vxe-column
              v-if="activeName != '商品' && activeName != '待刊登'"
              field="listingUserName"
              title="提交人"
            />
            <vxe-column v-if="activeName != '商品'" title="操作" width="70">
              <template #default="{ row }">
                <el-button type="primary" @click="getDetail(row.id)"
                  >详情</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="limit"
              background
              :page-sizes="[50, 100, 200, 500]"
              layout="prev, pager, next, sizes, total"
              :total="total"
              :small="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn">
        <span v-if="activeName == '商品' || activeName == '待刊登'">
          <span>当前可用额度：{{ storeAcctListingLimit }}</span>
          <span :class="{ rotate: isRefresh }" @click="handleRefresh">
            <el-icon color="#409EFC" size="18"><Refresh /></el-icon>
          </span>
        </span>
        <el-button
          v-if="activeName == '商品'"
          :disabled="loadingText != ''"
          type="primary"
          @click="getListing"
          >生成店铺商品</el-button
        >
        <el-button
          v-if="activeName == '待刊登' || activeName == '刊登失败'"
          type="danger"
          :style="[activeName == '待刊登' ? 'margin: 0 10px 10px 10px' : '']"
          @click="deleteListing"
          >删除店铺商品</el-button
        >

        <el-dropdown v-if="activeName == '待刊登'" style="margin-right: 10px">
          <el-button type="primary">
            刊登<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-item @click="publishNow('立即')">
              立即刊登
            </el-dropdown-item>
            <!-- <el-dropdown-item @click="publishNow('定时')">
              定时刊登
            </el-dropdown-item> -->
          </template>
        </el-dropdown>
        <!-- <el-button
          v-if="activeName == '刊登中'"
          type="primary"
          @click="cancelRepublish"
          >取消定时刊登</el-button
        > -->
        <el-button
          v-if="activeName == '刊登失败'"
          type="primary"
          :disabled="publishLoad"
          @click="republish"
          >重新发布</el-button
        >
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="sheinData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />

    <el-dialog
      v-model="showDialogPublishNow"
      width="40%"
      :title="reListingBool == true ? '重新刊登' : publishType"
      :close-on-click-modal="false"
    >
      <el-form
        v-loading="publishLoad"
        size="default"
        status-icon
        :label-width="180"
      >
        <el-form-item
          v-if="publishType == '定时刊登'"
          label="定时刊登开始时间"
          required
        >
          <el-date-picker
            v-model="dialogForm.time"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :disabled="publishLoad"
          @click="publishLoad ? '' : handleEditDialog()"
          >刊登</el-button
        >
      </template>
    </el-dialog>
    <DetailDialog
      v-if="showDetailDialog"
      :show-dialog="showDetailDialog"
      :form-data="detailDialogFormVisible"
      :tab-name="activeName"
      @close-dialog="handelEditDialogClose($event)"
    />
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />
  </div>
</template>
<script setup name="publishssheinsheinpublish">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { parseTime, copy } from '@/utils/common';
  import {
    queryOaNewCategory,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole,
    getModelCreatorList
  } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import useUserStore from '@/store/modules/user';
  import CateDialog from '@/components/CateDialog.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import {
    getPaymentsData,
    getDepartData,
    getStoreInfo
  } from '@/api/eBay/payments';
  import {
    getListingLimitUserList,
    getStoreAcctListingLimit,
    getCateAttrAndValues,
    generateStoreProduct,
    getDetailInfo,
    queryProdList,
    deleteStoreProducts,
    publishNows,
    timingPublish
    // cancelListTiming
  } from '@/api/publishs/sheinpublish';
  import { tabsName, listingStatus } from './enum';

  // 商品父SKU弹窗----
  const showPskuDetailDialog = ref(false);
  let prodPId = ref();
  const openPskuDetails = async (id) => {
    prodPId.value = id;
    showPskuDetailDialog.value = true;
  };
  const handelPskuDialogClose = (e) => {
    prodPId.value = '';
    showPskuDetailDialog.value = e.isShow;
  };
  // 选择店铺后，查询当前店铺可用额度
  let storeAcctListingLimit = ref('');
  const acctGetListingLimit = async () => {
    if (sheinData.formData.storeAcctId == '') {
      storeAcctListingLimit.value = '';
      return false;
    }
    const { code, data } = await getStoreAcctListingLimit(
      sheinData.formData.storeAcctId
    );
    if (code == '0000' && data) {
      ElMessage.success('查询成功');
      storeAcctListingLimit.value = data;
    } else {
      storeAcctListingLimit.value = '';
    }
  };
  // 点击刷新按钮
  const handleRefresh = () => {
    acctGetListingLimit();
  };
  // 刊登详情--start--
  const showDetailDialog = ref(false);
  let detailDialogFormVisible = ref();
  const getDetail = async (id, type) => {
    tableDataLoading.value = true;
    try {
      if (type == '生成店铺商品') {
        // 生成店铺商品
        const { data } = await generateStoreProduct({
          prodPId: id,
          storeAcctId: sheinData.formData.storeAcctId
        });
        data.listingId = '';
        detailDialogFormVisible.value = data;
        // detailDialogFormVisible.value.flag = true;
        showDetailDialog.value = true;
      } else {
        // 查看详情
        // 详情接口
        const { data } = await getDetailInfo(id);
        data.listingId = id;
        detailDialogFormVisible.value = data; // 获取的选中的值
        showDetailDialog.value = true;
        // 类目属性和规格属性接口
        {
          const { data, code } = await getCateAttrAndValues({
            prodPId: detailDialogFormVisible.value.prodPId,
            categoryId: detailDialogFormVisible.value.categoryId,
            storeAcctId: detailDialogFormVisible.value.storeAcctId,
            platCode: 'shein自营'
          });
          if (code == '0000') {
            detailDialogFormVisible.value.option = data; // 获取的选项--和选中的值的字段一模一样...
          }
        }
      }
    } finally {
      tableDataLoading.value = false;
    }
  };
  const handelEditDialogClose = (e) => {
    detailDialogFormVisible.value = null;
    showDetailDialog.value = e.isShow;
    // 保存成功--调用查询
    if (e.save == true) {
      if (activeName.value == '商品') {
        const checkedData = tableDataRef.value[0].getCheckboxRecords();
        tableData.value = tableData.value.filter(
          (item) => item.prodPId != checkedData[0].prodPId
        );
        let count = total.value - 1;
        tabListCount.value[activeName.value] = count;
        total.value = count;
      } else {
        onSubmit();
      }
    }
  };
  // 刊登详情--end--
  const sheinData = reactive({
    // 初始化查询条件
    initFormData: {
      listingUser: [], // 提交人
      oaList: [], // oa类目
      sheinList: [], // shein类目
      bizzOwnerIds: [], //  开发专员:多选
      prodAttrList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      cateOaIdList: [],
      orgId: '', // 部门
      salePersonId: '', // 销售员
      //店铺Id，必选
      storeAcctId: '',
      //OA新类目
      cateOaId: '',
      //开发类型
      devType: '',
      //商品标签
      tag: [],
      //物流属性
      logisAttrList: [],
      //开发专员
      bizzOwnerIds: [],
      //在售状态
      isSale: 'true',
      //生成情况
      isGeneral: true, // true: 未生成；false：已生成
      // 刊登状态
      publishingStatus: false,
      //侵权状态
      tortBanListing: 'ANY_PLAT',
      //时间，CREATE_TIME,AUDIT_TIME,GENERAL_TIME
      timeType: 'CREATE_TIME',
      time: [], //  时间
      startTime: '',
      endTime: '',
      //是否禁售
      canSaleBool: 'false',
      //sku查询类型，参考mercado模板
      searchSkuType: 'pSku',
      vagueSearch: 'false',
      skuListStr: '',
      listingStatus: -1,
      // 成本
      priceMin: '',
      priceMax: '',
      // 供货价
      basePriceLeft: '',
      basePriceRight: '',
      page: 0,
      limit: 50
    }
  });
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const tabListCount = ref({
    商品: 0,
    待刊登: 0,
    刊登中: 0,
    刊登成功: 0,
    刊登失败: 0
  });
  const loadingText = ref('');
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    sheinData.formData.cateOaId = '';
    sheinData.formData.cateOaIdList = [];
    sheinData.formData.skuListStr = '';
    sheinData.formData.vagueSearch = 'false';
    sheinData.formData.time = [];
    sheinData.formData.priceMax = '';
    sheinData.formData.basePriceRight = '';
  };

  const activeName = ref('商品');
  const handleClick = (tab) => {
    if (activeName.value != tab.paneName && tab.paneName != '商品') {
      sheinData.formData.timeType = 'GENERAL_TIME';
      sheinData.formData.salesSort = '';
      // sheinData.formData.isGeneral   = 'true';
    } else if (activeName.value != tab.paneName && tab.paneName == '商品') {
      // sheinData.formData.isGeneral   = 'false';
      sheinData.formData.salesSort = '';
      sheinData.formData.timeType = 'CREATE_TIME';
    }

    if (tab.paneName != '商品') {
      sheinData.formData.isGeneral = ''; // 生成情况
      sheinData.formData.publishingStatus = ''; // 刊登情况
    } else {
      sheinData.formData.isGeneral = true; // 生成情况
      sheinData.formData.publishingStatus = false; // 刊登情况
      sheinData.formData.basePriceLeft = ''; // 供货价
      sheinData.formData.basePriceRight = '';
    }

    if (tab.paneName == '商品' || tab.paneName == '待刊登') {
      sheinData.formData.listingUserName = ''; // 提交人
    }

    // if (activeName.value != tab.paneName) {
    //   sheinData.formData.salesSort = '';
    // }
    activeName.value = tab.paneName;
    currentPage.value = 1;
    tableData.value = [];
    onSubmit();
  };

  //   提交查询
  const onSubmit = async () => {
    tableData.value = null;
    sheinData.formData.page = currentPage.value;
    sheinData.formData.limit = limit.value;
    if (sheinData.formData.time && sheinData.formData.time.length != 0) {
      sheinData.formData.startTime = sheinData.formData.time[0] + ' 00:00:00';
      sheinData.formData.endTime = sheinData.formData.time[1] + ' 23:59:59';
    } else {
      sheinData.formData.startTime = '';
      sheinData.formData.endTime = '';
    }

    if (sheinData.formData.storeAcctId.length == 0) {
      ElMessage.warning('请选择店铺');
      return;
    }
    // 商品父SKU-商品子SKU-商品中文-商品英文
    sheinData.formData['prodPSkus'] =
      sheinData.formData['prodSSkus'] =
      sheinData.formData['cnTitles'] =
      sheinData.formData['enTitles'] =
        [];
    if (sheinData.formData.skuListStr != '') {
      sheinData.formData.skuList = sheinData.formData.skuListStr.split(',');
    } else {
      sheinData.formData.skuList = [];
    }

    tableDataLoading.value = true;
    sheinData.formData.listingStatus = listingStatus[activeName.value];
    if (activeName.value != '刊登失败') {
      sheinData.formData.errorMessage = '';
    }
    if (
      sheinData.formData.cateName &&
      sheinData.formData.cateName.length != 0
    ) {
      sheinData.formData.cateOaIdList = [];
      sheinData.formData.cateName.forEach((item) => {
        sheinData.formData.cateOaIdList.push(item[item.length - 1]);
      });
    } else {
      sheinData.formData.cateOaIdList = [];
    }

    // if (
    //   sheinData.formData.skuList != '' &&
    //   !Array.isArray(sheinData.formData.skuList)
    // ) {
    //   sheinData.formData.skuList =
    //     sheinData.formData.skuList.split(',');
    // } else if (
    //   sheinData.formData.skuList == '' &&
    //   !Array.isArray(sheinData.formData.skuList)
    // ) {
    //   sheinData.formData.skuList = [];
    // }

    const { data, code, count } = await queryProdList(sheinData.formData);
    if (code == '0000' && count == 0) {
      tableData.value = [];
    } else if (code == '0000') {
      tableData.value = data.map((item) => {
        item.displayCount = 3;
        item.published =
          item.sinfo && item.sinfo.filter((c) => c.published == true);
        return item;
      });
    }
    tableDataLoading.value = false;
    tabListCount.value[activeName.value] = count;
    total.value = count;
  };
  let tableDataRef = ref();
  // 生成店铺商品
  const getListing = async () => {
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length != 1) {
      ElMessage.warning('只能选择一条数据');
      return;
    }
    getDetail(checkedData[0].prodPId, '生成店铺商品');

    // let listingInfoList = [];
    // checkedData.forEach((item) => {
    //   let modelSId = [];
    //   if (item.skuList && item.skuList.length > 0) {
    //     modelSId = item.skuList.map((cItem) => cItem.modelSId);
    //   }
    //   listingInfoList.push({
    //     storeAcctId: sheinData.formData.storeAcctId,
    //     pSku: item.pSku,
    //     modelPId: item.modelPId,
    //     sInfo: {
    //       modelSIdList: modelSId
    //     }
    //   });
    // });
    // const { data, code } = await generalStoreProd({
    //   listingInfoList: listingInfoList
    // });
    // if (code == '0000' && data && data.length != 0) {
    //   tableDataLoading.value = false;
    //   let msg = '';
    //   msg += `本次提交生成店铺商品SKU${data.submitCount}个，成功${data.successCount}个，异常${data.errorCount}个，异常明细如下:<br/>`;
    //   data.failDetail.forEach((item) => {
    //     msg += `${item}<br/>`;
    //   });
    //   ElMessageBox.alert(
    //     `<div style="width: 800px;overflow: hidden;overflow-wrap: break-word;">${msg}</div>`,
    //     '操作结果',
    //     {
    //       dangerouslyUseHTMLString: true,
    //       customClass: 'sheinMallElMsg',
    //       confirmButtonText: '取消'
    //     }
    //   );
    //   onSubmit();
    // } else if (code == '0000' && (!data || data.length == 0)) {
    //   tableDataLoading.value = false;
    //   ElMessage.success('操作成功');
    //   onSubmit();
    // }
    // loadingText.value = '';
  };
  // 删除店铺商品
  const deleteListing = () => {
    let checkedData;
    if (activeName.value == '待刊登') {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    } else if (activeName.value == '刊登失败') {
      checkedData = tableDataRef.value[4].getCheckboxRecords();
    }
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm('确定要删除店铺商品吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, msg } = await deleteStoreProducts({
        listingIds: ids.join(',')
      });
      if (code == '0000') {
        ElMessage.success(msg);
        onSubmit();
      }
    });
  };
  const showDialogPublishNow = ref(false);
  const reListingBool = ref(false); //false:立即刊登；true：重新刊登
  const checkAll = ref(false);
  const isIndeterminate = ref(false);
  const checkedSites = ref([]);

  const dialogForm = reactive({
    time: '',
    disabledVal: true
  });
  const resetDialog = () => {
    checkAll.value = false;
    isIndeterminate.value = false;
    checkedSites.value = [];
    dialogForm.disabledVal = true;
    dialogForm.time = '';
  };
  const publishType = ref('');
  const publishLoad = ref(false);
  // 立即刊登&定时刊登
  const publishNow = (type) => {
    if (type == '定时') {
      publishType.value = '定时刊登';
      resetDialog();
      showDialogPublishNow.value = true;
    } else if (type == '立即') {
      publishType.value = '立即刊登';
      reListingBool.value = false;
      handleEditDialog();
    }
  };
  const handleEditDialog = async () => {
    let checkedData;
    if (activeName.value == '待刊登') {
      checkedData = tableDataRef.value[1].getCheckboxRecords();
    } else if (activeName.value == '刊登失败') {
      checkedData = tableDataRef.value[4].getCheckboxRecords();
      publishType.value = '立即刊登';
      reListingBool.value = true;
    }
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    let listTiming = '';
    if (publishType.value == '定时刊登') {
      if (dialogForm.time) {
        listTiming = dialogForm.time;
      } else {
        ElMessage.warning('请选择定时刊登时间');
        return false;
      }
    }
    let listingIdList = checkedData.map((item) => item.id);
    publishLoad.value = true;
    if (publishType.value == '立即刊登') {
      const { code, msg } = await publishNows({
        listingIds: listingIdList.join(','),
        isMall: false
      });
      if (code == '0000') {
        ElMessage.success(msg);
        showDialogPublishNow.value = false;
        onSubmit();
      }
    } else if (publishType.value == '定时刊登') {
      const { code, msg } = await timingPublish({
        listingIds: listingIdList.join(','),
        listTiming
      });
      if (code == '0000') {
        ElMessage.success(msg);
        showDialogPublishNow.value = false;
        onSubmit();
      }
    }
    publishLoad.value = false;
  };
  // 取消定时刊登
  // const cancelRepublish = async () => {
  //   let checkedData = tableDataRef.value[2].getCheckboxRecords();
  //   if (checkedData.length == 0) {
  //     ElMessage.warning('请选择一条数据');
  //     return false;
  //   }
  //   let idList = checkedData.map((item) => item.id);
  //   const { code, msg } = await cancelListTiming({
  //     listingIds: idList.join(',')
  //   });
  //   if (code == '0000') {
  //     ElMessage.success(msg);
  //     onSubmit();
  //   }
  // };
  // 重新发布
  const republish = async () => {
    // 即立即刊登，传参不同reListingBool：true重新发布
    checkedSites.value = [''];
    await handleEditDialog();
  };

  onMounted(async () => {
    // 部门
    getPaymentsList();
    // 销售员
    getDepartmentList();
    // 店铺
    getStoreList();
    Promise.all([
      getProdTagListApi(),
      getLogisListApi(),
      getDevTypeListApi(),
      getModelCreatorList(),
      getListuserbyrole(),
      queryOaNewCategory(),
      // getPlatCategoryTreeApi('shein自营'),
      getListingLimitUserList()
    ])
      .then((res) => {
        // 商品标签
        sheinData.initFormData.prodAttrList = res[0].data.map(
          (item) => item.name
        );
        //物流属性
        sheinData.initFormData.logisAttr = res[1].data.map((item) => item.name);
        //开发类型
        sheinData.initFormData.devTypeList = res[2].data.map(
          (item) => item.name
        );
        //开发专员
        sheinData.initFormData.bizzOwnerIds = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        sheinData.initFormData.oaList = JSON.parse(res[5].data);
        // // shein类目
        // sheinData.initFormData.sheinList = res[6].data;
        // 提交人
        sheinData.initFormData.listingUser = res[6].data;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  });
  // 分页--start
  const currentPage = ref(1);
  const limit = ref(50);
  const total = ref(0);
  // 设置每页count
  const handleSizeChange = (val) => {
    limit.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };
  // 分页--end
  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.sinfo.length;
  };
  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
  //  部门-销售员-店铺联动 -- start
  // 列表数据
  const paymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);
  // 获取 payments 列表数据
  const getPaymentsList = async () => {
    let storeAcctIdList = [];
    // 部门 销售人员 店铺没有筛选
    if (
      !sheinData.formData.orgId &&
      !sheinData.formData.salePersonId &&
      sheinData.formData.storeAcctId.length === 0
    ) {
      storeAcctIdList = [];
    }
    // 选择部门或者销售人员 没有选择店铺
    if (
      (sheinData.formData.orgId || sheinData.formData.salePersonId) &&
      sheinData.formData.storeAcctId.length === 0
    ) {
      if (selectData.storeData.length) {
        storeAcctIdList = selectData.storeData.map((item) => item.id);
      } else {
        // 如果销售人员下没有数据的话 传 -1
        storeAcctIdList = [-1];
      }
    }
    let params = {
      storeAcctIdList:
        sheinData.formData.storeAcctId.length > 0
          ? sheinData.formData.storeAcctId
          : storeAcctIdList
    };
    const { data } = await getPaymentsData(params);
    paymentsList.value = data;
  };
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'shein自营专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };
  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'shein自营专员',
      orgId: sheinData.formData.orgId,
      salePersonId: sheinData.formData.salePersonId,
      platCode: 'shein自营',
      lmsAppUserName: userName.value
    };
    const { data } = await getStoreInfo(params);
    selectData.storeData = data;
  };
  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreList();
    });
  };
  const changeSalers = () => {
    sheinData.formData.storeAcctId = [];
    getStoreList();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    sheinData.formData.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    sheinData.formData.salePersonId = '';
    sheinData.formData.storeAcctId = '';
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end
  // 类目组件 start
  const showCateDialog = ref(false);
  const handleCateDialogClose = (e) => {
    showCateDialog.value = e.isShow;
    if (!e.cate) {
      return;
    }
    sheinData.formData.cateName = e.cate.value.fullCateName;
    sheinData.formData.cateOaId = e.cate.value.categoryId;
  };
  // 类目组件 end
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 300;
  });
  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };
</script>
<style scoped lang="scss">
  :deep(.WH80) {
    width: 80px !important;
    .el-input.el-input--small {
      width: 80px;
    }
  }

  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }

  .search_item_cascader {
    :deep(.el-input) {
      height: 24px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 0 0 0 5px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 40px;
      }
      span:last-child {
        width: 30px;
      }
      input {
        min-width: 10px;
        height: auto;
        margin: 0;
      }
    }
  }
</style>
<style>
  .sheinMallElMsg {
    --el-messagebox-width: 800px;
  }
</style>
