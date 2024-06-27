<template>
  <!-- smt违规处罚页面 -->
  <div class="app-container">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="侵权类型" prop="violationTypeList">
          <ZSelect
            v-model="formData.violationTypeList"
            :items="initFormData.violationTypeList"
          />
          <!-- <el-select
            v-model="formData.violationTypeList"
            :class="formData.violationTypeList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.violationTypeList.length > 1" type="info"
                >已选{{ formData.violationTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.violationTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctIdList">
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="initFormData.storeData"
          ></z-cascader>
        </el-form-item>
        <el-form-item prop="peopleType">
          <el-select v-model="formData.peopleType" class="form_left">
            <el-option value="bizzOwnerId" label="开发专员" />
            <el-option value="responsorId" label="责任人" />
          </el-select>
          <el-select
            v-model="formData.peopleVal"
            class="form_right"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in initFormData.creatorIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开发建议" prop="devSug">
          <el-select v-model="formData.devSug" clearable>
            <el-option :value="true" label="已处理" />
            <el-option :value="false" label="未处理" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售处理" prop="saleHandle">
          <el-select v-model="formData.saleHandle" clearable>
            <el-option :value="true" label="已处理" />
            <el-option :value="false" label="未处理" />
          </el-select>
        </el-form-item>
        <el-form-item label="案件产品" prop="caseProd">
          <el-select v-model="formData.caseProd" clearable>
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="violationCountLeft"
          label="扣分/记次"
          class="form_range"
        >
          <el-input v-model="formData.violationCountLeft" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.violationCountRight" clearable></el-input>
        </el-form-item>
        <el-form-item prop="skuType">
          <el-select v-model="formData.skuType" class="form_left">
            <el-option value="itemIdList" label="itemId" />
            <el-option value="prodSSkuList" label="商品子SKU" />
            <el-option value="prodPSkuList" label="商品父SKU" />
          </el-select>
          <el-input v-model="formData.skuVal" clearable class="form_right" />
        </el-form-item>
        <el-form-item label="是否匹配SKU" prop="matchSkuFlag">
          <el-select v-model="formData.matchSkuFlag" clearable>
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select v-model="formData.timeType" class="form_left">
            <el-option value="punishDate" label="处罚时间" />
            <el-option value="devSugDate" label="开发建议时间" />
            <el-option value="saleHandleDate" label="销售处理时间" />
          </el-select>
          <el-date-picker
            v-model="formData.time"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown split-button type="primary">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="最多复制1w个"
              placement="top"
            >
              一键复制
            </el-tooltip>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in needCopyList" :key="item.code">
                  <div>
                    <el-dropdown-item @click="handleCopySkuInfo(item.code)">
                      {{ item.fieldName }}
                    </el-dropdown-item>
                  </div>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs
        v-model="activeKey"
        v-loading="tableDataLoading"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="
            item.count !== '' && activeKey == item.status
              ? `${item.label}(${item.count})`
              : item.label
          "
          :name="item.status"
        >
          <!-- :scroll-y="{ gt: 10 }" -->
          <vxe-table
            ref="tableDataRef"
            :scroll-y="{ enabled: false }"
            :data="tableData"
            :show-overflow="true"
            :height="height"
            :edit-config="{
              trigger: 'click',
              mode: 'cell'
            }"
            border
            :column-config="{ resizable: true }"
            @resizable-change="resizableChange"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="缩略图" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.image" />
                <el-tag
                  v-if="row.caseProd == true"
                  style="
                    background-color: #ff5722;
                    color: #fff;
                    border-color: #fff;
                  "
                  size="small"
                  >案件产品</el-tag
                >
              </template>
            </vxe-column>
            <vxe-column
              field="violationType"
              title="违规类型"
              :width="SMT_VIOLATIONPENALTIES['violationType'] || 80"
            >
              <template #default="{ row }">
                <TooltipText
                  :text="row.violationType"
                  :init-tool-field="initTool.violationType"
                />
              </template>
            </vxe-column>
            <vxe-column
              field="itemId"
              title="itemID"
              :width="SMT_VIOLATIONPENALTIES['itemId'] || 80"
            >
              <template #default="{ row }">
                <TooltipText
                  :text="row.itemId"
                  :init-tool-field="initTool.itemId"
                />
                <el-icon
                  v-if="row.itemId"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.itemId)"
                  ><CopyDocument
                /></el-icon>
              </template>
            </vxe-column>
            <vxe-column
              field="prodPSku"
              title="商品父SKU"
              :width="SMT_VIOLATIONPENALTIES['prodPSku'] || 100"
            >
              <template #default="{ row }">
                <!-- <div @click="openPskuDetails(row.prodPSku)">
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                </div> -->
                <TooltipText
                  :text="row.prodPSku"
                  :init-tool-field="initTool.prodPSku"
                />
                <el-icon
                  v-if="row.prodPSku"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.prodPSku)"
                  ><CopyDocument
                /></el-icon>
              </template>
            </vxe-column>
            <vxe-column
              field="prodSSku"
              title="商品子SKU"
              :width="SMT_VIOLATIONPENALTIES['prodSSku'] || 100"
            >
            </vxe-column>
            <vxe-column
              field="violationCount"
              title="扣分/计次"
              :width="SMT_VIOLATIONPENALTIES['violationCount'] || 55"
            >
            </vxe-column>
            <vxe-column
              field="violationReason"
              title="违规原因"
              :width="SMT_VIOLATIONPENALTIES['violationReason'] || 300"
            >
              <template #default="{ row }">
                <!-- <div @click="openPskuDetails(row.prodPSku)">
                  <span style="color: #409eff">{{ row.prodPSku }}</span>
                </div> -->
                <TooltipText
                  :text="row.violationReason"
                  :init-tool-field="initTool.violationReason"
                />
              </template>
            </vxe-column>
            <vxe-column
              field="violationBrand"
              title="侵权品牌名"
              :width="SMT_VIOLATIONPENALTIES['violationBrand'] || 60"
            >
            </vxe-column>
            <vxe-column title="侵权图片" min-width="180">
              <template #default="{ row }">
                <div v-if="row.prodPSku">
                  <div
                    v-for="i in row.prodPSku.split(',')"
                    :key="i"
                    style="display: flex; align-items: center"
                  >
                    <!-- <img
                      v-if="
                        row.prodPSkuImageMap[i] && row.prodPSkuImageMap[i] != ''
                      "
                      :src="row.prodPSkuImageMap[i]"
                      style="width: 80px; height: 80px"
                    /> -->
                    <span>{{ i }}</span>
                    <ImagePop
                      v-if="
                        row.prodPSkuImageMap[i] && row.prodPSkuImageMap[i] != ''
                      "
                      :src="row.prodPSkuImageMap[i]"
                    />
                  </div>
                </div>
                <div v-if="row.prodSSku">
                  <div v-for="i in row.prodSSku.split(',')" :key="i">
                    <img
                      v-if="
                        row.prodSSkuImageMap[i] && row.prodSSkuImageMap[i] != ''
                      "
                      :src="row.prodSSkuImageMap[i]"
                      style="width: 60px; height: 60px"
                    />
                    {{ i }}
                  </div>
                </div>
              </template>
            </vxe-column>
            <!-- <vxe-column field="caseProd" title="案件产品" width="50">
              <template #default="{ row }">
                <span v-if="row.caseProd == true">是</span>
                <span v-else-if="row.caseProd == false">否</span>
              </template>
            </vxe-column> -->
            <vxe-column title="店铺/销售/业绩归属人" min-width="120">
              <template #default="{ row }">
                <!-- 悬浮展示 -->
                <el-tooltip placement="right">
                  <template #content>
                    <template
                      v-if="
                        row.violationCountMap &&
                        JSON.stringify(row.violationCountMap) != '{}'
                      "
                    >
                      <div
                        v-for="(val, key) in row.violationCountMap"
                        :key="key"
                      >
                        {{ key }}:{{ val }}
                      </div>
                    </template>
                    <template v-else>
                      <div
                        v-for="(val, key) in {
                          商品信息质量违规: 0,
                          知识产权禁限售违规: 0,
                          交易违规及其他: 0,
                          知识产权严重违规: 0
                        }"
                        :key="key"
                      >
                        {{ key }}:{{ val }}
                      </div>
                    </template>
                  </template>
                  <div>店铺:{{ row.storeAcct }}</div>
                </el-tooltip>
                <div>销售:{{ row.salesperson }}</div>
                <div>开发专员:{{ row.bizzOwnerList?.join(',') }}</div>
                <div>责任人:{{ row.responsorList?.join(',') }}</div>
              </template>
            </vxe-column>
            <vxe-column
              field="remark"
              title="备注"
              :width="SMT_VIOLATIONPENALTIES['remark'] || 100"
              :edit-render="{ name: 'input' }"
              :slots="{ edit: 'edit' }"
              ><template #edit="{ row }">
                <el-input
                  v-model="row.remark"
                  @focus="getRemark(row)"
                  @blur="handleRemark(row)"
                ></el-input>
              </template>
              <template #default="{ row }">
                <TooltipText
                  :text="row.remark"
                  :init-tool-field="initTool.remark"
                />
              </template>
            </vxe-column>
            <vxe-column field="devSug" title="开发建议" min-width="90">
              <template #default="{ row }">
                <div v-if="row.devSug">
                  {{ row.devSugUser }}:{{ row.devSug }}
                </div>
                <div>
                  {{
                    row.devSugTime
                      ? parseTime(row.devSugTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
              </template>
            </vxe-column>
            <vxe-column field="saleHandle" title="销售处理" min-width="90">
              <template #default="{ row }">
                <div v-if="row.saleHandle">已处理</div>
                <div v-if="row.saleHandle">
                  {{ row.saleHandleUser }}:{{ row.saleHandle }}
                </div>
                <div>
                  {{
                    row.saleHandleTime
                      ? parseTime(row.saleHandleTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
              </template>
            </vxe-column>
            <vxe-column title="时间" min-width="140">
              <template #default="{ row }">
                处罚时间:
                <div>
                  {{
                    row.punishTime
                      ? parseTime(row.punishTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
                编辑时间:
                <div>
                  {{
                    row.modifyTime
                      ? parseTime(row.modifyTime, '{y}-{m}-{d} {h}:{i}:{s}')
                      : ''
                  }}
                </div>
              </template></vxe-column
            >
            <vxe-column
              title="操作"
              field="opt"
              :width="SMT_VIOLATIONPENALTIES['opt'] || 105"
            >
              <template #default="{ row }">
                <el-button
                  v-permission="['smtViolationpenaltiesEditBtn']"
                  type="primary"
                  @click="getDetail(row)"
                  >编辑</el-button
                >
                <el-button
                  v-permission="['smtViolationpenaltiesDevsuggestBtn']"
                  type="primary"
                  @click="devSuggest(row)"
                  >开发建议</el-button
                >
                <el-button
                  v-permission="['smtViolationpenaltiesSellerhandleBtn']"
                  type="primary"
                  @click="sellerHandle(row)"
                  >销售处理</el-button
                >
              </template></vxe-column
            >
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="limit"
              background
              :page-sizes="[1000, 2000, 5000, 10000]"
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
        <el-button
          v-permission="['smtViolationpenaltiesSellerhandleBtn']"
          type="primary"
          @click="sellerHandle('batch')"
          >销售处理</el-button
        >
        <el-button
          v-permission="['smtViolationpenaltiesDevsuggestBtn']"
          type="primary"
          @click="devSuggest('batch')"
          >开发建议</el-button
        >
        <el-button
          v-permission="['smtViolationpenaltiesSyncBtn']"
          type="primary"
          @click="syncViolationFunc"
          >同步侵权库</el-button
        >
      </div>
    </el-card>
    <!-- <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    /> -->
    <!-- 刊登详情 -->
    <DetailDialog
      v-if="publishVisible"
      :row-data="rowData"
      :show-dialog="publishVisible"
      @handle-search="handleSearch"
      @close-dialog="closeDialog"
    />
    <!-- 开发建议 -->
    <el-dialog v-model="devSuggestVisible" width="30%" title="开发建议">
      <el-form size="default">
        <el-form-item label="建议" required>
          <el-input v-model="suggestion" type="input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="devSuggestVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDevSuggestDialog"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 销售处理 -->
    <el-dialog v-model="sellerHandleVisible" width="30%" title="销售处理">
      <el-form size="default">
        <el-form-item label="处理方式" required>
          <el-input v-model="handle" type="input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sellerHandleVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSellerHandleDialog"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="customeraliexpressviolationpenalties">
  import { ref, reactive, onMounted, computed } from 'vue';
  // import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZSelect from '@/components/ZSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { shortcuts, getStoreList } from '@/api/common';
  import {
    parseTime,
    copy,
    comGetTableHeight,
    transferDate
  } from '@/utils/common';
  import { listuserbyrole } from '@/api/publishs/ozontemp';
  import { ElMessage, ElMessageBox } from 'element-plus';
  // import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    listViolationTypes,
    queryAmazonVioList,
    devSug,
    saleHandle,
    syncViolation,
    getBatchCopyEnum,
    batchCopyList,
    editRemark
  } from '@/api/smt/violationpenalties';
  import TooltipText from '@/components/TooltipText.vue';
  import useUserStore from '@/store/modules/user';

  const initFormData = reactive({
    // 初始化查询条件
    violationTypeList: []
  });
  const formData = ref({
    page: 1,
    limit: 1000,
    //店铺Id，必选
    storeAcctIdList: [],
    listingStatus: '-1',
    violationTypeList: [],
    peopleType: 'bizzOwnerId',
    //开发专员
    peopleVal: '',
    skuType: 'itemIdList',
    timeType: 'punishDate',
    time: [] //  时间
  });
  // 获取需要复制的枚举值
  const needCopyList = ref([]);
  const getNeedCopyList = async () => {
    const { data } = await getBatchCopyEnum();
    needCopyList.value = data;
  };
  // 点击一键复制
  const handleCopySkuInfo = async (copyCode) => {
    const checkedList = tableDataRef.value[0].getCheckboxRecords();
    // 有勾选 就传productIdList
    let params = {};
    params = checkedList?.length
      ? { itemList: checkedList.map((item) => item.itemId) }
      : {};

    // 查询条件
    filterParams();

    const { code, msg } = await batchCopyList({
      batchCopyFieldCode: copyCode,
      ...params,
      ...formData.value
    });
    if (code === '0000') {
      // 复制到粘贴板
      copy(msg);
    }
  };

  // tab list
  const tabList = ref([
    { label: '违规数量', count: '', status: '-1', index: 0 }
  ]);
  const activeKey = ref('-1');

  const searchCard = ref();
  const height = ref();
  let violationTypeList = [];
  let SMT_VIOLATIONPENALTIES = {};
  onMounted(async () => {
    SMT_VIOLATIONPENALTIES =
      JSON.parse(localStorage.getItem('SMT_VIOLATIONPENALTIES')) || {};
    // 获取table高度
    height.value = comGetTableHeight(searchCard, true, true);
    // 一键复制枚举
    getNeedCopyList();
    let form1 = new FormData();
    form1.append('role', '开发专员');
    Promise.all([
      getStoreList('aliexpress'),
      listuserbyrole(form1),
      listViolationTypes()
    ])
      .then((res) => {
        // 店铺
        initFormData.storeData = res[0].data?.children;
        //开发专员 // 责任人？？
        initFormData.creatorIdList = res[1].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        // 获取侵权类型
        res[2].data.forEach((item) => {
          violationTypeList.push({
            // value: item,
            // label: item == '' ? '暂无' : item,
            id: item,
            name: item == '' ? '暂无' : item
          });
        });
        initFormData.violationTypeList = violationTypeList;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
    // 时间默认最近31天
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
    formData.value.time = [
      transferDate(start),
      transferDate(new Date().getTime())
    ];
  });

  // // 高度
  // const height = computed(() => {
  //   const clientHeight =
  //     window.innerHeight ||
  //     document.documentElement.clientHeight ||
  //     document.body.clientHeight ||
  //     937;
  //   return clientHeight - 250;
  // });

  // // 商品父SKU弹窗
  // const showPskuDetailDialog = ref(false);
  // let prodPId = ref();
  // const openPskuDetails = async (id) => {
  //   prodPId.value = id;
  //   showPskuDetailDialog.value = true;
  // };
  // const handelPskuDialogClose = (e) => {
  //   prodPId.value = '';
  //   showPskuDetailDialog.value = e.isShow;
  // };
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    // formData.value.violationTypeList = [];
    formData.value['itemIdList'] = [];
    formData.value['prodSSkuList'] = [];
    formData.value['prodPSkuList'] = [];
    formData.value.skuVal = '';
    formData.value['bizzOwnerId'] = '';
    formData.value['responsorId'] = '';
    formData.value.peopleVal = '';
    formData.value['punishDateLeft'] = '';
    formData.value['punishDateRight'] = '';
    formData.value['devSugDateLeft'] = '';
    formData.value['devSugDateRight'] = '';
    formData.value['saleHandleDateLeft'] = '';
    formData.value['saleHandleDateRight'] = '';
    formData.value.time = [];
  };

  const handleClick = () => {
    onSubmit();
  };
  // 表格编辑，备注
  const remark = ref('');
  const getRemark = (row) => {
    remark.value = row.remark;
  };
  const handleRemark = async (row) => {
    let obj = {};
    if (!row.remark || row.remark == '') {
      obj = { id: row.id };
      //   ElMessage.warning('提交的数据为空，保存失败');
      //   row.remark = remark.value;
      //   return;
    } else {
      obj = {
        id: row.id,
        remark: row.remark
      };
    }
    const { code, msg } = await editRemark(obj);
    if (code == '0000') {
      ElMessage.success(msg);
    }
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const filterParams = () => {
    formData.value.page = currentPage.value;
    formData.value.limit = limit.value;
    // itemId/父sku/子sku
    formData.value['itemIdList'] =
      formData.value['prodSSkuList'] =
      formData.value['prodPSkuList'] =
        [];
    if (formData.value.skuVal) {
      formData.value[formData.value.skuType] = formData.value.skuVal.split(',');
    }
    // 开发专员/责任人
    formData.value['bizzOwnerId'] = formData.value['responsorId'] = '';
    if (formData.value.peopleVal) {
      formData.value[formData.value.peopleType] = formData.value.peopleVal;
    }
    // 处罚日期/开发处理日期/销售处理日期
    formData.value['punishDateLeft'] =
      formData.value['punishDateRight'] =
      formData.value['devSugDateLeft'] =
      formData.value['devSugDateRight'] =
      formData.value['saleHandleDateLeft'] =
      formData.value['saleHandleDateRight'] =
        '';
    if (formData.value.time?.length > 0) {
      formData.value[formData.value.timeType + 'Left'] =
        formData.value.time[0] + ' 00:00:00';
      formData.value[formData.value.timeType + 'Right'] =
        formData.value.time[1] + ' 23:59:59';
    }
  };
  // 提交查询
  const onSubmit = async () => {
    tableData.value = null;
    filterParams();
    tableDataLoading.value = true;
    const { data, code, count } = await queryAmazonVioList({
      ...formData.value
    });
    tableDataLoading.value = false;
    if (code == '0000') {
      tableData.value = data;
    }
    total.value = count;
    getTabCount(total.value);
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  let tableDataRef = ref(null);
  const selectRecords = ref([]);
  // 获取复选框选中的数据;
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = tableDataRef.value;
    let index = tabList.value.filter(
      (item) => item.status == activeKey.value
    )[0].index;
    selectRecords.value = $table[index].getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else {
      return true;
    }
  };

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 编辑弹窗
  const publishVisible = ref(false);
  const rowData = ref({});
  const getDetail = async (row) => {
    rowData.value = row;
    publishVisible.value = true;
  };
  const closeDialog = async (val = '') => {
    publishVisible.value = false;
    if (val?.isSearch) {
      // onSubmit();
      const { data, code } = await queryAmazonVioList({
        itemIdList: [rowData.value.itemId]
      });
      if (code == '0000') {
        // violationBrand,prodPSku,prodPSkuImageMap,prodSSku,prodSSkuImageMap,remark,caseProd
        rowData.value.violationBrand = data[0].violationBrand;
        rowData.value.prodPSku = data[0].prodPSku;
        rowData.value.prodPSkuImageMap = data[0].prodPSkuImageMap;
        rowData.value.prodSSku = data[0].prodSSku;
        rowData.value.prodSSkuImageMap = data[0].prodSSkuImageMap;
        rowData.value.remark = data[0].remark;
        rowData.value.caseProd = data[0].caseProd;
        rowData.value.image = data[0].image;
      }
    }
  };
  const batch = ref(false);
  // 开发建议弹窗
  const devSuggestVisible = ref(false);
  const suggestion = ref('');
  const devSuggest = async (isBatch) => {
    suggestion.value = '';
    if (isBatch == 'batch' && getSelectedList()) {
      batch.value = true;
      devSuggestVisible.value = true;
    } else if (isBatch != 'batch') {
      batch.value = isBatch;
      devSuggestVisible.value = true;
    }
  };
  const saveDevSuggestDialog = async () => {
    if (!suggestion.value) {
      return ElMessage.warning('请输入建议');
    }
    let ids;
    // 单个or批量
    if (batch.value == true) {
      ids = selectRecords.value.map((item) => item.id).join();
    } else {
      ids = batch.value.id;
    }
    const { code, msg } = await devSug({
      ids: ids,
      suggestion: suggestion.value
    });
    if (code == '0000') {
      ElMessage.success(msg);
      if (batch.value == true) {
        // 批量
        onSubmit();
      } else {
        batch.value.devSugUser = userName;
        batch.value.devSug = suggestion.value;
        batch.value.devSugTime = new Date().getTime();
      }
    }
    devSuggestVisible.value = false;
  };

  // 销售处理弹窗
  const sellerHandleVisible = ref(false);
  const handle = ref('');
  const sellerHandle = async (isBatch) => {
    handle.value = '';
    if (isBatch == 'batch' && getSelectedList()) {
      batch.value = true;
      sellerHandleVisible.value = true;
    } else if (isBatch != 'batch') {
      batch.value = isBatch;
      sellerHandleVisible.value = true;
    }
  };
  const saveSellerHandleDialog = async () => {
    if (!handle.value) {
      return ElMessage.warning('请输入处理方式');
    }
    let ids;
    // 单个or批量
    if (batch.value == true) {
      ids = selectRecords.value.map((item) => item.id).join();
    } else {
      ids = batch.value.id;
    }
    const { code, msg } = await saleHandle({
      ids: ids,
      handle: handle.value
    });
    if (code == '0000') {
      ElMessage.success(msg);
      if (batch.value == true) {
        // 批量
        onSubmit();
      } else {
        batch.value.saleHandleUser = userName;
        batch.value.saleHandle = handle.value;
        batch.value.saleHandleTime = new Date().getTime();
      }
    }
    sellerHandleVisible.value = false;
  };
  // 同步侵权库
  const syncViolationFunc = () => {
    if (getSelectedList()) {
      let ids = selectRecords.value.map((item) => item.id);
      ElMessageBox.confirm(
        `已选中${ids.length}条数据，确定是否全部同步侵权库?`,
        '同步侵权库',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'Warning'
        }
      ).then(async () => {
        const { code, msg } = await syncViolation({ ids: ids.join() });
        if (code == '0000') {
          ElMessage.success(msg);
          onSubmit();
        }
      });
    }
  };

  // 分页
  const currentPage = ref(1);
  const limit = ref(1000);
  const total = ref(0);
  const handleSizeChange = (val) => {
    limit.value = val;
    onSubmit();
  };
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };

  const initTool = ref({});
  function resizableChange({ column }) {
    if (column.resizeWidth < column.width) {
      initTool.value[column.field] = true;
    } else {
      initTool.value[column.field] = false;
    }
    SMT_VIOLATIONPENALTIES[column.field] = column.resizeWidth;
    localStorage.setItem(
      'SMT_VIOLATIONPENALTIES',
      JSON.stringify(SMT_VIOLATIONPENALTIES)
    );
  }
</script>

<style scoped lang="scss">
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
</style>
