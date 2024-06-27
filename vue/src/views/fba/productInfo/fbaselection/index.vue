<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="fbaSelection.formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="fbaSelection.formData.cateName"
            :options="fbaSelection.initFormData.oaList"
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
        <el-form-item label="开发类型" prop="devTypes">
          <el-select
            v-model="fbaSelection.formData.devTypes"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in fbaSelection.initFormData.devTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrList">
          <el-select
            v-model="fbaSelection.formData.prodAttrList"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in fbaSelection.initFormData.prodAttrList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="logisAttrStr">
          <el-select
            v-model="fbaSelection.formData.logisAttrRelation"
            class="form_left"
          >
            <el-option value="and" label="物流属性(与)" />
            <el-option value="or" label="物流属性(或)" />
          </el-select>
          <MultiSelect
            v-model="fbaSelection.formData.logisAttrStr"
            class="form_right"
            :option-obj="{
              optionList: fbaSelection.initFormData.logisAttr
            }"
          />
        </el-form-item>
        <el-form-item label="开发专员" prop="bizzOwnerIdListStr">
          <MultiSelect
            v-model="fbaSelection.formData.bizzOwnerIdListStr"
            class="form_right"
            :option-obj="{
              optionList: fbaSelection.initFormData.bizzOwnerIds,
              value: 'value',
              label: 'label'
            }"
          />
        </el-form-item>
        <el-form-item label="在售状态" prop="isSale">
          <el-select v-model="fbaSelection.formData.isSale">
            <el-option value="" label="全部" />
            <el-option value="1" label="在售" />
            <el-option value="0" label="停售" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="商品类型" prop="multiSub">
        <el-select v-model="fbaSelection.formData.multiSub">
          <el-option value="" label="全部" />
          <el-option value="false" label="单属性" />
          <el-option value="true" label="多属性" />
        </el-select>
      </el-form-item> -->
        <br />
        <el-form-item label="站点" prop="site">
          <el-select v-model="fbaSelection.formData.site">
            <el-option value="US" label="US" />
            <el-option value="JP" label="JP" />
            <el-option value="GB" label="GB" />
            <el-option value="DE" label="DE" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName === '基础模板'"
          label="是否选品"
          prop="ifChoose"
        >
          <el-select v-model="fbaSelection.formData.ifChoose" clearable>
            <el-option value="1" label="是" />
            <el-option value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="选品人"
          prop="chooserIdStr"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="fbaSelection.formData.chooserIdStr"
            :options="fbaSelection.initFormData.chooseDepart"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              children: 'childOrgList',
              value: 'id'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="tortPlat" label="侵权状态">
          <MultiSelect
            v-model="fbaSelection.formData.tortPlat"
            class="form_right"
            :option-obj="{
              optionList: tortPlatStatus,
              value: 'value',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item prop="searchSKUType">
          <el-select
            v-model="fbaSelection.formData.searchSKUType"
            class="form_left"
          >
            <el-option value="pSku" label="父SKU" />
            <el-option value="sSku" label="子SKU" />
            <el-option value="sSku2" label="子SKU精确" />
          </el-select>
          <el-input
            v-model="fbaSelection.formData.searchSKUValue"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="searchType">
          <el-select
            v-model="fbaSelection.formData.searchType"
            class="form_left"
          >
            <el-option value="cnTitle" label="中文名称" />
            <el-option value="enTitle" label="英文标题" />
          </el-select>
          <el-input
            v-model="fbaSelection.formData.searchValue"
            class="form_right"
          />
        </el-form-item>
        <br v-if="activeName == '基础模板'" />

        <el-form-item prop="timeType">
          <el-select v-model="fbaSelection.formData.timeType" class="form_left">
            <el-option value="createTime" label="模板创建时间" />
            <el-option value="checkTime" label="模板审核时间" />
          </el-select>
          <el-date-picker
            v-model="fbaSelection.formData.searchTimeList"
            value-format="YYYY-MM-DD"
            type="daterange"
            class="form_right"
            :shortcuts="shortcuts"
            unlink-panels
            style="width: 200px"
          />
        </el-form-item>
        <br v-if="activeName !== '基础模板'" />
        <el-form-item prop="orderByStr" label="排序方式">
          <el-select
            v-model="fbaSelection.formData.orderByStr"
            filterable
            clearable
          >
            <el-option value="p.audit_time desc" label="模板审核时间倒序" />
            <el-option
              value="p.model_create_time desc"
              label="模板创建时间倒序"
            />
            <el-option value="psc.sale_num desc" label="30天销量倒序" />
            <!-- 非基础模板，默认选品时间倒序，基础模板，默认模板审核时间倒序 -->
            <el-option
              v-if="activeName != '基础模板'"
              value="_TIME"
              label="选品时间倒序"
            /> </el-select
        ></el-form-item>
        <el-form-item v-if="activeName != '基础模板'" prop="timeType1">
          <el-select
            v-model="fbaSelection.formData.timeType1"
            class="form_left"
          >
            <el-option value="选品时间" label="选品时间" />
            <el-option
              v-if="activeName == '刊登成功'"
              value="刊审时间"
              label="刊审时间"
            />
          </el-select>
          <el-date-picker
            v-model="fbaSelection.formData.chooseTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            :shortcuts="shortcuts"
            unlink-panels
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item
          v-if="activeName == '刊登成功'"
          prop="publishAsin"
          label="刊登ASIN"
        >
          <el-input v-model="fbaSelection.formData.publishAsin" />
        </el-form-item>
        <el-form-item
          v-if="activeName == '基础模板'"
          prop="existYiwuStock"
          label="义乌仓库存"
        >
          <el-select v-model="fbaSelection.formData.existYiwuStock" clearable>
            <el-option value="1" label="有" />
            <el-option value="0" label="无" />
          </el-select>
        </el-form-item>
        <!-- <br v-if="activeName == '刊登成功'" /> -->
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="name in tabsName"
          :key="name"
          :label="name + '(' + tabsNameCount[name] + ')'"
          :name="name"
        >
          <vxe-table
            v-if="activeName == '基础模板'"
            ref="tableDataRefBase"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :scroll-y="{ gt: 10 }"
            border
          >
            <vxe-column
              v-if="activeName != '基础模板'"
              type="checkbox"
              width="40"
            />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.pImg || ''" />
              </template>
            </vxe-column>
            <vxe-column title="商品名" width="150">
              <template #default="{ row }">
                {{ row.cnTitle }}<br />
                <el-tag>{{ row.logisAttrList }}</el-tag>
              </template>
            </vxe-column>
            <vxe-column title="父SKU" width="110">
              <template #default="{ row }">
                <div @click="openPskuDetails(row.id)">
                  <span style="color: #409eff">{{ row.pSku }}</span>
                </div>
                [{{ row.bizzOwner }}]
              </template>
            </vxe-column>
            <vxe-column v-if="activeName == '基础模板'" width="800">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div style="width: 30px" type="checkbox"></div>
                  <div style="width: 100px">子SKU</div>
                  <div style="width: 60px">成本(￥)</div>
                  <div style="width: 60px">重量(g)</div>
                  <div style="width: 100px">7/15/30销量</div>
                  <div style="width: 110px">义乌仓预计可用<br />不含在途</div>
                  <div style="width: 80px">义乌仓在途</div>
                  <div style="width: 50px">在售</div>
                  <div style="width: 80px">是否选品</div>
                  <div style="width: 80px">选品人</div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  ref="fbaSskuRef"
                  :data="
                    row.fbaVarients &&
                    row.fbaVarients.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <!-- <vxe-column width="40">
                    <template #default="{ row: sonRow }">
                      <el-checkbox-group v-model="sonRow.checked">
                        <el-checkbox />
                      </el-checkbox-group>
                    </template>
                  </vxe-column> -->
                  <vxe-column type="checkbox" width="40" />
                  <vxe-column width="100">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.sSku }}
                    </template>
                  </vxe-column>
                  <vxe-column field="cost" width="60" />
                  <vxe-column field="weight" width="60" />
                  <vxe-column width="100"
                    ><template #default="{ row: sonRow }"
                      >{{ sonRow.sevenSales || 0 }}/{{
                        sonRow.fifteenSales || 0
                      }}/{{ sonRow.thirtySales || 0 }}</template
                    >
                  </vxe-column>
                  <vxe-column width="110"
                    ><template #default="{ row: sonRow }">
                      {{ sonRow.preAvailableStock }}
                    </template>
                  </vxe-column>
                  <vxe-column width="80"
                    ><template #default="{ row: sonRow }">
                      {{ sonRow.orderNotInNum }}
                    </template>
                  </vxe-column>
                  <vxe-column field="isSale" width="50"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.isSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <vxe-column field="ifChoose" width="80"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.ifChoose ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <vxe-column field="chooserName"></vxe-column>
                </vxe-table>
                <div
                  v-if="row.fbaVarients"
                  :class="[row.fbaVarients.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.fbaVarients" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >
            <vxe-column title="选品状态" width="80">
              <template #default="{ row }">
                {{ row.ifChoose ? '已选品' : '未选品' }}
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeName == '基础模板'"
              field="devTip"
              title="开发思路"
              width="150"
            ></vxe-column>
            <vxe-column
              field="saleNumMercadoSeven"
              title="侵权信息"
              width="120"
            >
              <template #default="{ row }">
                <div
                  v-for="item in [
                    'wish',
                    'joom',
                    'ebay',
                    'amazon',
                    'smt',
                    'shopee',
                    'lazada'
                  ]"
                  :key="item"
                  :style="[row[tortPlat[item][0]] ? '' : 'height:0']"
                >
                  {{ row[tortPlat[item][0]] ? item + '侵权' : '' }}
                  <el-tag
                    v-if="row[tortPlat[item][0]] && row[tortPlat[item][1]]"
                    type="danger"
                    >{{ row[tortPlat[item][1]] }}</el-tag
                  >
                </div>
              </template></vxe-column
            >
            <vxe-column
              field="saleNumMercadoFifteen"
              title="禁售站点"
              width="80"
            >
              <template #default="{ row }">
                {{ Array.from(new Set(row.prodProhibit)).join('\n') }}
              </template>
            </vxe-column>
            <vxe-column field="tplCreateTime" title="创建时间" width="100">
              <template #default="{ row }">
                {{
                  row.tplCreateTime
                    ? parseTime(row.tplCreateTime, '{y}-{m}-{d}')
                    : ''
                }}
              </template></vxe-column
            >
            <vxe-column title="操作" width="100">
              <template #default="{ row, rowIndex }">
                <el-button
                  v-permission="['creatAndEditFbaSelectionBtn']"
                  type="primary"
                  @click="createSelection(row, rowIndex)"
                  >选品</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <vxe-table
            v-if="activeName != '基础模板'"
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.pImg || ''" />
              </template>
            </vxe-column>
            <vxe-column title="商品名" width="150">
              <template #default="{ row }">
                {{ row.cnTitle }}<br />
                <el-tag>{{ row.logisAttrList }}</el-tag>
              </template>
            </vxe-column>
            <vxe-column title="父SKU" width="90">
              <template #default="{ row }">
                <div @click="openPskuDetails(row.id)">
                  <span style="color: #409eff">{{ row.pSku }}</span>
                </div>
                [{{ row.bizzOwner }}]
                <el-tooltip
                  v-if="
                    row.fbaChooseItems && row.fbaChooseItems.ifReChoosed == true
                  "
                  content="重复选品"
                  placement="bottom"
                >
                  <el-tag type="warning">重</el-tag>
                </el-tooltip>
              </template>
            </vxe-column>
            <vxe-column field="salesType" title="销售方式" width="120"
              ><template #default="{ row }">
                {{ row.fbaChooseItems.salesType }}
              </template>
            </vxe-column>
            <vxe-column field="modelPId" title="成本(￥)" width="110">
              <template #default="{ row }">
                商品:{{ row.fbaChooseItems.totalCost }}<br />头程:{{
                  row.fbaChooseItems.headLogisticsPrice
                }}
              </template>
            </vxe-column>
            <vxe-column field="fullCateName" title="重量(g)" width="110">
              <template #default="{ row }">
                商品重:{{ row.fbaChooseItems.totalWeight }}<br />体积重:{{
                  row.fbaChooseItems.volumeWeight
                }}
              </template>
            </vxe-column>
            <vxe-column field="createTime" title="长宽高(cm)" width="90">
              <template #default="{ row }">
                长:{{ row.fbaChooseItems.length }}<br />宽:{{
                  row.fbaChooseItems.width
                }}<br />高:{{ row.fbaChooseItems.height }}
              </template>
            </vxe-column>
            <vxe-column title="定价($)" width="100">
              <template #default="{ row }">
                售价:{{ row.fbaChooseItems.predictPrice }}<br />配送:{{
                  row.fbaChooseItems.fbaDeliveryPrice
                }}<br />佣金:{{ row.fbaChooseItems.brokerage }}
              </template>
            </vxe-column>
            <vxe-column title="毛利" width="150">
              <template #default="{ row }">
                毛利(￥):{{ row.fbaChooseItems.grossMargin }}<br />销售毛利率:{{
                  math.multiply(row.fbaChooseItems.saleGrossMargin, 1000) / 10
                }}%<br />成本毛利率:{{
                  math.multiply(row.fbaChooseItems.costGrossMargin, 1000) / 10
                }}%
              </template>
            </vxe-column>
            <vxe-column title="竞品" width="110">
              <template #default="{ row }">
                <div v-for="item in ['asin1', 'asin2', 'asin3']" :key="item">
                  <a
                    v-if="row.fbaChooseItems[item]"
                    target="_blank"
                    :href="row.fbaChooseItems[item + 'Src']"
                    style="color: #409eff; cursor: pointer"
                    >{{ row.fbaChooseItems[item] }}</a
                  >
                </div>
              </template>
            </vxe-column>
            <vxe-column
              :title="
                activeName == '待刊登审核'
                  ? '刊登商品(ASIN/店铺子SKU)'
                  : '刊登ASIN'
              "
              width="140"
            >
              <template #default="{ row }">
                <a
                  v-if="row.fbaChooseItems.publishAsin"
                  target="_blank"
                  :href="
                    'https://www.amazon.com/dp/' +
                    row.fbaChooseItems.publishAsin
                  "
                  style="color: #409eff; cursor: pointer"
                  >{{ row.fbaChooseItems.publishAsin }}</a
                >
                <div v-if="activeName == '待刊登审核'">
                  店铺子SKU:{{
                    row.sellerSkuList && row.sellerSkuList.join(',')
                  }}
                </div>
              </template>
            </vxe-column>
            <vxe-column field="pSku" title="备注" width="130">
              <template #default="{ row }">
                选品:{{ row.fbaChooseItems.saleRemark }}<br />选审:{{
                  row.fbaChooseItems.auditRemark
                }}<br />刊审:{{ row.fbaChooseItems.publishAuditRemark }}
              </template>
            </vxe-column>
            <vxe-column field="auditTime" title="人员" width="100">
              <template #default="{ row }">
                选品:{{ row.fbaChooseItems.creator }}<br />选审:{{
                  row.fbaChooseItems.auditor
                }}<br />刊审:{{ row.fbaChooseItems.publishAuditor }}
              </template>
            </vxe-column>
            <vxe-column title="时间" width="120">
              <template #default="{ row }">
                选品:{{
                  row.fbaChooseItems.createTime
                    ? parseTime(row.fbaChooseItems.createTime, '{y}-{m}-{d}')
                    : ''
                }}<br />选审:{{
                  row.fbaChooseItems.auditTime
                    ? parseTime(row.fbaChooseItems.auditTime, '{y}-{m}-{d}')
                    : ''
                }}<br />刊审:{{
                  row.fbaChooseItems.publishAuditTime
                    ? parseTime(
                        row.fbaChooseItems.publishAuditTime,
                        '{y}-{m}-{d}'
                      )
                    : ''
                }}
              </template></vxe-column
            >
            <vxe-column title="操作" min-width="100">
              <template #default="{ row }">
                <el-button
                  v-if="
                    activeName == '待选品审核' ||
                    activeName == '待重新选品' ||
                    activeName == '选品失败'
                  "
                  v-permission="['creatAndEditFbaSelectionBtn']"
                  type="primary"
                  @click="createSelectionRow(row.fbaChooseItems.id)"
                  >选品</el-button
                >
                <el-button
                  v-if="
                    activeName == '待选品审核' ||
                    activeName == '选品成功' ||
                    activeName == '选品失败'
                  "
                  v-permission="['selectionCheckBtn']"
                  type="primary"
                  @click="review(row)"
                  >选品审核</el-button
                >
                <el-button
                  v-if="
                    activeName == '选品成功' ||
                    activeName == '待刊登审核' ||
                    activeName == '刊登失败'
                  "
                  type="primary"
                  @click="getSelection(row)"
                  >提交刊登</el-button
                >
                <el-button
                  v-if="
                    activeName == '待刊登审核' ||
                    activeName == '刊登成功' ||
                    activeName == '刊登失败'
                  "
                  v-permission="['publishCheckBtn']"
                  type="primary"
                  @click="reviewPublish(row)"
                  >刊登审核</el-button
                >
                <el-button type="primary" @click="handleShowLog(row)"
                  >操作日志</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
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
      <!-- 批量操作 -->
      <div class="common_batch_btns">
        <el-dropdown
          v-if="activeName != '基础模板'"
          v-loading="exportLoading"
          split-button
          type="primary"
        >
          导出
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleExportBySearch"
                >查询条件导出</el-dropdown-item
              >
              <el-dropdown-item @click="handleExportByCheck"
                >选中导出</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-card>
    <!-- 类目组件 -->
    <!-- <CateDialog
    v-if="showCateDialog"
    :showDialog="showCateDialog"
    :cateSearchValue="fbaSelection.formData.cateSearchValue"
    :handleCateDialogType="'oa'"
    @closeDialog="handleCateDialogClose($event)"
  /> -->
    <!-- 选品 -->
    <el-dialog
      width="45%"
      title="选品"
      :model-value="selectionShowDialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="selectionCloseDialog"
    >
      <!-- :inline="true" -->
      <el-form size="default" status-icon :label-width="120"
        ><el-form-item label="父SKU">
          <el-input v-model="selectionDialogForm.pSku" readonly disabled />
        </el-form-item>
        <el-form-item label="销售方式">
          <el-input
            v-model="selectionDialogForm.salesType"
            @focus="getVal"
            @blur="calculateSalesTypeBtn(1)"
          >
            <template #append>
              <el-button class="primaryBtn" @click="calculateSalesTypeBtn(0)"
                >更新</el-button
              >
            </template>
          </el-input>
        </el-form-item>
        <el-input v-if="selectionDialogForm.a"></el-input>
        <div style="display: flex">
          <el-form-item label="商品成本(￥)">
            <el-input
              v-model="selectionDialogForm.totalCost"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="长(cm)">
            <el-input
              v-model="selectionDialogForm.length"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
          <el-form-item label="宽(cm)">
            <el-input
              v-model="selectionDialogForm.width"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
          <el-form-item label="高(cm)">
            <el-input
              v-model="selectionDialogForm.height"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="商品重量(g)">
            <el-input
              v-model="selectionDialogForm.totalWeight"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="体积重量(g)">
            <el-input
              v-model="selectionDialogForm.volumeWeight"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="头程费(￥)">
            <el-input
              v-model="selectionDialogForm.headLogisticsPrice"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item :label="`预估售价(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.predictPrice"
              style="width: 149px"
            >
              <template #append>
                <el-button class="primaryBtn" @click="calculatePredictPriceBtn"
                  >计算</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="`FBA配送费(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.fbaDeliveryPrice"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item :label="`佣金(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.brokerage"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="毛利(￥)">
            <el-input
              v-model="selectionDialogForm.grossMargin"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="销售毛利率">
            <el-input
              v-model="selectionDialogForm.saleGrossMargins"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="成本毛利率">
            <el-input
              v-model="selectionDialogForm.costGrossMargins"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="竞品ASIN1" required>
            <el-input v-model="selectionDialogForm.asin1" />
          </el-form-item>
          <el-form-item label="竞品ASIN2">
            <el-input v-model="selectionDialogForm.asin2" />
          </el-form-item>
          <el-form-item label="竞品ASIN3">
            <el-input v-model="selectionDialogForm.asin3" />
          </el-form-item>
        </div>
        <el-form-item label="销售备注">
          <el-input v-model="selectionDialogForm.saleRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="selectionSubmitDialog"
            >提交选品</el-button
          >
          <el-button @click="selectionCloseDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 选品审核 -->
    <el-dialog
      width="45%"
      title="选品审核"
      :model-value="reviewShowDialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="reviewCloseDialog"
    >
      <el-form size="default" status-icon :label-width="120"
        ><el-form-item label="父SKU">
          <el-input v-model="selectionDialogForm.pSku" readonly disabled />
        </el-form-item>
        <el-form-item label="销售方式">
          <el-input
            v-model="selectionDialogForm.salesType"
            @focus="getVal"
            @blur="calculateSalesTypeBtn(1)"
          >
            <template #append>
              <el-button class="primaryBtn" @click="calculateSalesTypeBtn(0)"
                >更新</el-button
              >
            </template>
          </el-input>
        </el-form-item>
        <el-input v-if="selectionDialogForm.a"></el-input>
        <div style="display: flex">
          <el-form-item label="商品成本(￥)">
            <el-input
              v-model="selectionDialogForm.totalCost"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="长(cm)">
            <el-input
              v-model="selectionDialogForm.length"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
          <el-form-item label="宽(cm)">
            <el-input
              v-model="selectionDialogForm.width"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
          <el-form-item label="高(cm)">
            <el-input
              v-model="selectionDialogForm.height"
              @focus="getVal"
              @blur="calculateSalesTypeBtn(2)"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="商品重量(g)">
            <el-input
              v-model="selectionDialogForm.totalWeight"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="体积重量(g)">
            <el-input
              v-model="selectionDialogForm.volumeWeight"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="头程费(￥)">
            <el-input
              v-model="selectionDialogForm.headLogisticsPrice"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item :label="`预估售价(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.predictPrice"
              style="width: 149px"
            >
              <template #append>
                <el-button class="primaryBtn" @click="calculatePredictPriceBtn"
                  >计算</el-button
                >
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="`FBA配送费(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.fbaDeliveryPrice"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item :label="`佣金(${selectionDialogForm.currency})`">
            <el-input
              v-model="selectionDialogForm.brokerage"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="毛利(￥)">
            <el-input
              v-model="selectionDialogForm.grossMargin"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="销售毛利率">
            <el-input
              v-model="selectionDialogForm.saleGrossMargins"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
          <el-form-item label="成本毛利率">
            <el-input
              v-model="selectionDialogForm.costGrossMargins"
              :readonly="activeName == '基础模板'"
              :disabled="activeName == '基础模板'"
            />
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="竞品ASIN1" required>
            <el-input v-model="selectionDialogForm.asin1" />
          </el-form-item>
          <el-form-item label="竞品ASIN2">
            <el-input v-model="selectionDialogForm.asin2" />
          </el-form-item>
          <el-form-item label="竞品ASIN3">
            <el-input v-model="selectionDialogForm.asin3" />
          </el-form-item>
        </div>
        <el-form-item label="销售备注">
          <el-input v-model="selectionDialogForm.saleRemark" type="textarea" />
        </el-form-item>
        <el-tooltip
          :disabled="selectionDialogForm.allTortPlat == ''"
          :content="selectionDialogForm.allTortPlat"
          placement="bottom"
        >
          <el-form-item label="侵权信息">
            <el-input
              v-model="selectionDialogForm.allTortPlat"
              readonly
              disabled
            >
              <!-- <el-tag v-for="item in selectionDialogForm.allTortPlat" :key="item">{{
            item
          }}</el-tag> -->
            </el-input>
          </el-form-item>
        </el-tooltip>
        <div style="display: flex">
          <el-tooltip
            :disabled="selectionDialogForm.devTip == ''"
            :content="selectionDialogForm.devTip"
            placement="bottom"
          >
            <el-form-item label="开发思路">
              <el-input
                v-model="selectionDialogForm.devTip"
                readonly
                disabled
                style="width: 425px"
              />
            </el-form-item>
          </el-tooltip>
          <el-form-item label="是否重复选品">
            <el-radio-group
              v-model="selectionDialogForm.ifReChoosed"
              readonly
              disabled
            >
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="审核结果">
          <el-radio-group v-model="selectionDialogForm.auditResult">
            <el-radio value="选品成功">选品成功</el-radio>
            <el-radio value="待重新选品">需修改重新提交</el-radio>
            <el-radio value="选品失败">选品失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            "
          >
            <el-select
              v-model="remarkSelect"
              placeholder="选择常用备注"
              clearable
              @change="changeRemark"
            >
              <el-option
                v-for="(item, index) in remarkOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-input v-model="selectionDialogForm.auditRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="reviewSubmitDialog">确认</el-button>
          <el-button @click="reviewCloseDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 刊登审核 -->
    <el-dialog
      width="30%"
      title="刊登审核"
      :model-value="reviewPublishShowDialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="reviewPublishCloseDialog"
    >
      <el-form size="default" status-icon :label-width="120"
        ><el-form-item label="审核结果">
          <el-radio-group v-model="reviewPublishDialogForm.ifPass">
            <el-radio value="true">刊登成功</el-radio>
            <el-radio value="false">刊登失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="reviewPublishDialogForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="reviewPublishSubmitDialog"
            >确认</el-button
          >
          <el-button @click="reviewPublishCloseDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 提交刊登 -->
    <el-dialog
      width="30%"
      title="提交刊登"
      :model-value="submitShowDialog"
      destroy-on-close
      :close-on-click-modal="false"
      @close="submitCloseDialog"
    >
      <el-form size="default" status-icon :label-width="120">
        <el-form-item label="刊登ASIN">
          <el-input v-model="submitDialogForm.publishAsin" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="submitDialog">确认</el-button>
          <el-button @click="submitCloseDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <PskuDetailDialog
      v-if="showPskuDetailDialog"
      :show-dialog="showPskuDetailDialog"
      :prod-p-id="prodPId"
      @close-dialog="handelPskuDialogClose($event)"
    />

    <OperateLog
      v-if="showLogDialog"
      :is-visible="showLogDialog"
      :choose-id="chooseId"
      :item-name="itemName"
      :p-sku="pSku"
      @close="closeShowDialog"
    />
  </div>
</template>
<script setup name="fbaproductInfofbaselection">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    queryOaNewCategory,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole
    // getStoreList
  } from '@/api/common';
  import {
    getPersonAndOrgsByRole,
    queryChooseItemsTemplate,
    queryFbaChooseItemsTemplate,
    calculatePredictPrice,
    calculateSalesType,
    saveFbaChooseItems,
    checkRepeatProdPID,
    updateChooseItemsAudit,
    updateChooseItemsPublishStatus,
    queryFbaChooseItemsDtoById,
    reEditFbaChooseItems,
    publishAsin,
    getUsualRemark
  } from '@/api/fba/fbaselection';
  import {
    tabsName,
    itemsStatus,
    tortPlat,
    tortPlatStatus,
    tempOrderBy
  } from './enum';
  import { math, transferDate } from '@/utils/common.js';
  import { transBlob } from '@/utils/downloadFile';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import OperateLog from './components/operatelog.vue';
  // import RemarkManage from './components/remarkmanage.vue';
  const fbaSelection = reactive({
    // 初始化查询条件
    initFormData: {
      oaList: [], // oa类目
      bizzOwnerIds: [], //  开发专员:多选
      chooseDepart: [], // 选品部门
      // fbaChoosePerson: [], // 选品人
      prodAttrList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      // OA新类目
      cateName: [],
      //开发类型
      devTypes: '',
      //商品标签
      prodAttrList: [],
      //物流属性
      logisAttrRelation: 'and',
      logisAttrStr: [],
      //开发专员
      bizzOwnerIdListStr: [],
      //在售状态
      isSale: '1',
      //商品类型
      // multiSub: '',
      //侵权状态
      tortPlat: [],
      // 父SKU/子SKU
      searchSKUType: 'pSku',
      searchSKUValue: '',
      // 中文名称/英文标题
      searchType: 'cnTitle',
      searchValue: '',
      //模板创建时间，createTime，checkTime
      timeType: 'createTime',
      searchTimeList: [], //  时间
      // startTime: '',
      // endTime: '',
      // 排序方式
      orderByStr: 'p.audit_time desc',
      // 选品人
      // fbaChoosePerson: '',
      // 选品时间
      timeType1: '',
      chooseTime: [], //  时间
      // 刊登ASIN
      publishAsin: '',
      //页签标识 基础模板: 0,待选品审核: 1,选品成功: 2,选品失败: 3, 待刊登审核: 4,刊登成功: 5,刊登失败: 6,
      itemsStatus: '',
      page: 1,
      limit: 50,
      site: '', // 站点
      ifChoose: '', // 是否选品
      // chooseDepart: [], // 选品部门
      chooserIdStr: [], // 选品人 ID
      existYiwuStock: ''
    }
  });
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
  const tabsNameCount = reactive({
    基础模板: 0,
    待重新选品: 0,
    待选品审核: 0,
    选品成功: 0,
    选品失败: 0,
    待刊登审核: 0,
    刊登成功: 0,
    刊登失败: 0
  });
  // 计算预估售价
  const calculatePredictPriceBtn = async () => {
    let obj = {
      site: fbaSelection.formData.site, // 根据新增站点选品
      salesType: selectionDialogForm.salesType,
      length: selectionDialogForm.length,
      width: selectionDialogForm.width,
      height: selectionDialogForm.height,
      volumeWeight: selectionDialogForm.volumeWeight,
      totalCost: selectionDialogForm.totalCost,
      totalWeight: selectionDialogForm.totalWeight,
      headLogisticsPrice: selectionDialogForm.headLogisticsPrice,
      predictPrice: selectionDialogForm.predictPrice
    };
    const { code, data } = await calculatePredictPrice(obj);
    if (code == '0000') {
      ElMessage.success('计算成功');
      for (let key in data) {
        if (key == 'saleGrossMargin' || key == 'costGrossMargin') {
          selectionDialogForm[key] = data[key];
          selectionDialogForm[key + 's'] = (data[key] * 1000) / 10 + '%';
        } else {
          selectionDialogForm[key] = data[key];
        }
      }
    }
  };
  const lengthWidthHeight = ref({
    salesType: '',
    length: '',
    width: '',
    height: ''
  });
  const getVal = function () {
    lengthWidthHeight.value.salesType = selectionDialogForm.salesType;
    lengthWidthHeight.value.length = selectionDialogForm.length;
    lengthWidthHeight.value.width = selectionDialogForm.width;
    lengthWidthHeight.value.height = selectionDialogForm.height;
  };
  // 计算销售方式
  const calculateSalesTypeBtn = async (type) => {
    let obj = {};
    if (type == 0) {
      //  点击调用，会修改长宽高
      obj = {
        salesType: selectionDialogForm.salesType
      };
    } else if (type == 1) {
      // 失去焦点调用，会修改长宽高，如果销售方式输入值没改变，则不需要调用接口
      if (lengthWidthHeight.value.salesType == selectionDialogForm.salesType) {
        return;
      }
      obj = {
        salesType: selectionDialogForm.salesType
      };
    } else if (type == 2) {
      //  失去焦点调用，不会修改长宽高，如果长宽高输入值没改变，则不需要调用接口
      if (
        lengthWidthHeight.value.length == selectionDialogForm.length &&
        lengthWidthHeight.value.width == selectionDialogForm.width &&
        lengthWidthHeight.value.height == selectionDialogForm.height
      ) {
        return;
      }
      obj = {
        salesType: selectionDialogForm.salesType,
        length: selectionDialogForm.length,
        width: selectionDialogForm.width,
        height: selectionDialogForm.height
      };
    }
    // let salesType = selectionDialogForm.salesType;
    const { code, data } = await calculateSalesType({
      ...obj,
      site: fbaSelection.formData.site
    });
    if (code == '0000') {
      ElMessage.success('更新成功');
      for (let key in data) {
        selectionDialogForm[key] = data[key];
      }
    }
  };
  // 选品--start--
  const fbaSskuRef = ref(null);
  const selectRecords = ref([]);
  const selectionShowDialog = ref(false);
  const createSelection = async (row, rowIndex) => {
    const $table = fbaSskuRef.value;
    selectRecords.value = $table[rowIndex].getCheckboxRecords();
    let sSkuList = selectRecords.value.map((item) => item.sSku);
    // if (sSkuList.length == 0) {
    //   return ElMessage.warning('请选择子SKU');
    // }
    selectionDialogForm.pSku = row.pSku;
    selectionDialogForm.salesType = sSkuList.join('+');
    selectionDialogForm.prodPId = row.id;
    selectionShowDialog.value = true;
    calculateSalesTypeBtn(0);
  };
  const selectionDialogForm = reactive({
    // 来自基础模板页返回的list 的 id
    prodPId: '',
    // 商品父SKU
    pSku: '',
    // 销售方式，模板子SKU组成，传多个的用+号拼接 ABC+DEF2
    salesType: '',
    // 商品成本:每个SKU的(采购成本+内包装成本)多个一卖 求和
    totalCost: '',
    // 长：取商品子SKU的最大长。
    length: '',
    // 宽：取商品子SKU的最大宽
    width: '',
    // 高：每个SKU的高累加，考虑到叠高因素。每个SKU的高 = 高（多个一卖-1）叠高
    height: '',
    // 商品重量
    totalWeight: '',
    // 体积重量
    volumeWeight: '',
    // 头程费
    headLogisticsPrice: '',
    // 预估售价
    predictPrice: '',
    // FBA配送费
    fbaDeliveryPrice: '',
    // 佣金
    brokerage: '',
    // 毛利(预估售价-FB配送费-佣金)汇率-商品成本-头程费
    grossMargin: '',
    // 销售毛利(预估售价汇率)100%,保留千位数
    saleGrossMargin: '',
    // 成本毛利(商品成本+头程费)100%,保留千位数
    costGrossMargin: '',
    // 竞品ASIN1
    asin1: '',
    // 竞品ASIN2
    asin2: '',
    // 竞品ASIN3
    asin3: '',
    // 销售备注
    saleRemark: '',
    existYiwuStock: '',
    // 币种
    currency: ''
  });
  const fulfilSaveFbaChooseItems = async () => {
    const { code } = await saveFbaChooseItems({
      ...selectionDialogForm,
      site: fbaSelection.formData.site
    });
    if (code == '0000') {
      ElMessage.success('提交成功');
      // onSubmit();
      selectionCloseDialog();
    }
  };

  // 提交选品
  const selectionSubmitDialog = () => {
    submitSelect();
    let fnCopy = submitSelect;
    submitSelect = null;
    setTimeout(() => {
      submitSelect = fnCopy;
    }, 1000);
  };

  let submitSelect = async () => {
    if (activeName.value == '基础模板') {
      const { code, data } = await checkRepeatProdPID({
        pSku: selectionDialogForm.pSku,
        site: fbaSelection.formData.site
      });
      if (code == '0000' && data == true) {
        ElMessageBox.confirm('该产品已选品，是否继续选品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fulfilSaveFbaChooseItems();
        });
      } else if (code == '0000' && data == false) {
        fulfilSaveFbaChooseItems();
      }
    } else {
      selectionDialogForm.height = selectionDialogForm.height * 1;
      delete selectionDialogForm.profitList;

      const { code } = await reEditFbaChooseItems(selectionDialogForm);
      if (code == '0000') {
        ElMessage.success('提交成功');
        // onSubmit();
        selectionCloseDialog();
      }
    }
  };
  const selectionCloseDialog = () => {
    for (let key in selectionDialogForm) {
      selectionDialogForm[key] = '';
    }
    selectionShowDialog.value = false;
  };
  const createSelectionRow = async (id) => {
    const { code, data } = await queryFbaChooseItemsDtoById({ id });
    if (code == '0000') {
      for (let key in data) {
        if (key == 'saleGrossMargin' || key == 'costGrossMargin') {
          selectionDialogForm[key] = data[key];
          selectionDialogForm[key + 's'] = (data[key] * 1000) / 10 + '%';
        } else {
          selectionDialogForm[key] = data[key];
        }
      }
      selectionShowDialog.value = true;
    }
  };
  // 选品--end--

  // 选品审核 ---start---
  const reviewShowDialog = ref(false);
  const review = async (row) => {
    const { code, data } = await queryFbaChooseItemsDtoById({
      id: row.fbaChooseItems.id
    });
    if (code == '0000') {
      for (let key in data) {
        if (key == 'saleGrossMargin' || key == 'costGrossMargin') {
          selectionDialogForm[key] = data[key];
          selectionDialogForm[key + 's'] = (data[key] * 1000) / 10 + '%';
        } else {
          selectionDialogForm[key] = data[key];
        }
      }
      let str = '';
      ['wish', 'joom', 'ebay', 'amazon', 'smt', 'shopee', 'lazada'].forEach(
        (item) => {
          data[tortPlat[item][0]] ? (str += item + '侵权:') : '';
          data[tortPlat[item][0]] && data[tortPlat[item][1]]
            ? (str += data[tortPlat[item][1]] + '；')
            : '';
        }
      );
      selectionDialogForm.allTortPlat = str;
      // let strList = [];
      // ['wish', 'joom', 'ebay', 'amazon', 'smt', 'shopee', 'lazada'].forEach(
      //   (item) => {
      //     let str = '';
      //     data[tortPlat[item][0]] ? (str += item + '侵权:') : '';
      //     data[tortPlat[item][0]] && data[tortPlat[item][1]]
      //       ? (str += data[tortPlat[item][1]])
      //       : '';
      //     strList.push(str);
      //   }
      // );
      // selectionDialogForm.allTortPlat = strList.filter((item) => item != '');
    }
    selectionDialogForm.id = row.fbaChooseItems.id;
    reviewShowDialog.value = true;
    getUsualRemarkList();
  };
  const remarkList = ref([]);
  const remarkOptions = ref([]);
  // 获取常用备注
  const getUsualRemarkList = async () => {
    const { code, data } = await getUsualRemark();
    if (code === '0000') {
      remarkList.value = data;
      remarkOptions.value = [];
      data?.forEach((item) => {
        let obj = {
          label: item.name,
          value: item.name
        };
        remarkOptions.value.push(obj);
      });
    }
  };

  // 选择常用备注
  const remarkSelect = ref('');
  const changeRemark = async (val) => {
    if (val) {
      selectionDialogForm.auditRemark =
        selectionDialogForm.auditRemark + ' ' + val;
      remarkSelect.value = '';
    }
  };

  const reviewSubmitDialog = async () => {
    // selectionDialogForm.modifyTime = new Date().getTime();
    const { code } = await updateChooseItemsAudit(selectionDialogForm);
    if (code == '0000') {
      ElMessage.success('提交成功');
      // onSubmit();
      reviewCloseDialog();
    }
  };
  const reviewCloseDialog = () => {
    for (let key in selectionDialogForm) {
      selectionDialogForm[key] = '';
    }
    reviewShowDialog.value = false;
  };
  // 刊登审核
  const reviewPublishShowDialog = ref(false);
  const reviewPublish = async (row) => {
    reviewPublishDialogForm.id = row.fbaChooseItems.id;
    reviewPublishShowDialog.value = true;
  };
  const reviewPublishDialogForm = reactive({
    id: '',
    ifPass: '',
    remark: ''
  });
  const reviewPublishSubmitDialog = async () => {
    const { code } = await updateChooseItemsPublishStatus({
      id: reviewPublishDialogForm.id,
      ifPass: reviewPublishDialogForm.ifPass,
      publishAuditRemark: reviewPublishDialogForm.remark
    });
    if (code == '0000') {
      ElMessage.success('提交成功');
      // onSubmit();
      reviewPublishCloseDialog();
    }
  };
  const reviewPublishCloseDialog = () => {
    reviewPublishDialogForm.id = '';
    reviewPublishDialogForm.ifPass = '';
    reviewPublishDialogForm.remark = '';
    reviewPublishShowDialog.value = false;
  };
  // 选品审核 ---end---
  // 提交刊登 ---start---
  const submitShowDialog = ref(false);
  const getSelection = async (row) => {
    submitDialogForm.id = row.fbaChooseItems.id;
    submitShowDialog.value = true;
  };

  const submitDialogForm = reactive({
    id: '',
    publishAsin: ''
  });
  const submitDialog = async () => {
    const { code } = await publishAsin({
      id: submitDialogForm.id,
      publishAsin: submitDialogForm.publishAsin
    });
    if (code == '0000') {
      ElMessage.success('提交成功');
      // onSubmit();
      submitCloseDialog();
    }
  };
  const submitCloseDialog = () => {
    submitDialogForm.id = '';
    submitDialogForm.publishAsin = '';
    submitShowDialog.value = false;
  };
  // 提交刊登 ---end---

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    fbaSelection.formData.searchSKUValue = '';
    fbaSelection.formData.searchValue = '';
    fbaSelection.formData.searchTimeList = [];
    fbaSelection.formData.chooseTime = [];
    fbaSelection.formData.logisAttrRelation = 'and';
    handleReset();
    if (activeName.value == '基础模板') {
      fbaSelection.formData.orderByStr = 'p.audit_time desc';
    } else {
      fbaSelection.formData.orderByStr = '_TIME';
    }
  };

  const activeName = ref('基础模板');
  const handleClick = (tab) => {
    if (activeName.value != tab.paneName && tab.paneName != '刊登成功') {
      // 刊登ASIN清空
      fbaSelection.formData.publishAsin = '';
      // 刊审时间清空
      fbaSelection.formData.timeType1 = '选品时间';
    }
    if (activeName.value != tab.paneName && tab.paneName == '基础模板') {
      // 排序方式默认值
      fbaSelection.formData.orderByStr = 'p.audit_time desc';
    } else if (activeName.value != tab.paneName && tab.paneName != '基础模板') {
      // 排序方式默认值
      fbaSelection.formData.orderByStr = '_TIME';
    }
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };

  const getFbaSelTime = function (timeObj) {
    let obj = {};
    if (timeObj.searchTimeList && timeObj.searchTimeList.length != 0) {
      obj.searchTime =
        timeObj.searchTimeList[0] + ' - ' + timeObj.searchTimeList[1];
    } else {
      obj.searchTime = '';
    }
    obj.fbaChooseTimeStart =
      obj.fbaChooseTimeEnd =
      obj.publishTimeStart =
      obj.publishTimeEnd =
        '';
    if (timeObj.chooseTime && timeObj.chooseTime.length != 0) {
      if (fbaSelection.formData.timeType1 == '选品时间') {
        obj.fbaChooseTimeStart = timeObj.chooseTime[0];
        obj.fbaChooseTimeEnd = timeObj.chooseTime[1];
      } else if (fbaSelection.formData.timeType1 == '刊审时间') {
        obj.publishTimeStart = timeObj.chooseTime[0];
        obj.publishTimeEnd = timeObj.chooseTime[1];
      }
    }

    // 处理下类目
    if (timeObj.cateName.length && timeObj.cateName.length != 0) {
      timeObj.cateOa = [];
      let cateOa = [];
      timeObj.cateName.forEach((item) => {
        cateOa.push(item[item.length - 1]);
      });
      obj.cateOaIds = cateOa.join(',');
    }
    return obj;
  };

  const handleReset = () => {
    fbaSelection.formData.cateOa = [];
    fbaSelection.formData.cateOaIds = '';
    fbaSelection.formData.tempCreatTimeStart = '';
    fbaSelection.formData.tempCreatTimeEnd = '';
    fbaSelection.formData.auditTimeStart = '';
    fbaSelection.formData.auditTimeEnd = '';
    fbaSelection.formData.fbaChooseTimeStart = '';
    fbaSelection.formData.fbaChooseTimeEnd = '';
  };

  //   提交查询
  const onSubmit = async () => {
    if (fbaSelection.formData.site === '') {
      return ElMessage.warning('请选择站点！');
    }
    tableData.value = null;
    tableDataLoading.value = true;
    fbaSelection.formData.page = currentPage.value;
    fbaSelection.formData.limit = pageSize.value;
    handleReset();
    let timeObj = getFbaSelTime(fbaSelection.formData);
    for (let key in timeObj) {
      fbaSelection.formData[key] = timeObj[key];
    }
    if (activeName.value !== '基础模板') {
      fbaSelection.formData.itemsStatus = itemsStatus[activeName.value][0];
    } else {
      delete fbaSelection.formData.itemsStatus;
    }
    let res, data, code, count;
    // 非基础模板排序字段
    if (activeName.value != '基础模板') {
      fbaSelection.formData.tempOrderBy =
        tempOrderBy[fbaSelection.formData.orderByStr] || '';
    } else {
      fbaSelection.formData.tempOrderBy = '';
    }
    let form = new FormData();
    console.log(
      'fbaSelection.formData.chooserIdStr',
      fbaSelection.formData.chooserIdStr
    );
    for (let key in fbaSelection.formData) {
      if (key === 'chooserIdStr') {
        const chooserIdStr = fbaSelection.formData.chooserIdStr
          ?.map((item) => item[item.length - 1])
          .join();
        form.append(key, chooserIdStr);
      } else {
        form.append(key, fbaSelection.formData[key]);
      }
    }
    if (activeName.value == '基础模板') {
      res = await queryChooseItemsTemplate(form);
    } else {
      res = await queryFbaChooseItemsTemplate(form);
    }
    data = res.data;
    code = res.code;
    count = res.count;
    if (code == '0000' && count == 0) {
      tableData.value = [];
    } else if (code == '0000') {
      tableData.value = data.map((item) => {
        item.displayCount = 3;
        if (
          item.prodProhibitMappingList &&
          item.prodProhibitMappingList.length != 0
        ) {
          item.prodProhibit = item.prodProhibitMappingList.map(
            (items) => items.platCode
          );
        } else {
          item.prodProhibit = [];
        }
        return item;
      });
    }
    tableDataLoading.value = false;
    tabsNameCount[activeName.value] = count;
    total.value = count;
  };
  // 基础模板
  let tableDataRefBase = ref();
  let tableDataRef = ref();
  // const userList = ref([]);

  onMounted(async () => {
    //OA新类目
    {
      const { data } = await queryOaNewCategory();
      fbaSelection.initFormData.oaList = JSON.parse(data);
    }
    //开发专员
    {
      const { data } = await getListuserbyrole();
      fbaSelection.initFormData.bizzOwnerIds = data.map((item) => ({
        value: item.id,
        label: item.userName
      }));
    }
    //选品人
    {
      let formData = new FormData();
      formData.append('roleNames', 'amazon专员');
      const { data } = await getPersonAndOrgsByRole(formData);
      // 删除子节点,因为这是获取平台的店铺
      let arr = [];
      mapChooseDepart(arr, data.orgTree, data.userList);
      fbaSelection.initFormData.chooseDepart = arr;
    }
    //商品标签
    {
      const { data } = await getProdTagListApi();
      fbaSelection.initFormData.prodAttrList = data.map((item) => item.name);
    }
    //物流属性
    {
      const { data } = await getLogisListApi();
      fbaSelection.initFormData.logisAttr = data.map((item) => item.name);
    }
    //开发类型
    {
      const { data } = await getDevTypeListApi();
      fbaSelection.initFormData.devTypeList = data.map((item) => item.name);
    }
  });

  const mapChooseDepart = (arr, orgTree, userList) => {
    orgTree.forEach((item, index) => {
      arr.push({
        ...item,
        name: item.org_name || item.name,
        childOrgList: []
      });
      if (item.childOrgList?.length) {
        mapChooseDepart(arr[index].childOrgList, item.childOrgList, userList);
      }
      const curSale = userList.filter((v) => item.id === v.org_id);
      if (curSale.length) {
        curSale.forEach((v) => {
          item.childOrgList.push({ ...v, name: v.user_name });
        });
        arr[index].childOrgList = item.childOrgList;
      }
    });
  };

  // 分页--start
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
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
    row.displayCount = row.fbaVarients.length;
  };

  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };
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

  // #region ---- 批量操作start
  const findTable = () => {
    const $table = tableDataRef.value;
    const tableIndex = tabsName.findIndex((item) => item === activeName.value);
    return $table[tableIndex];
  };
  // 导出 exportType  0导出选中的  1按查询条件导出
  // 查询条件导出
  const exportLoading = ref(false);
  const handleExportBySearch = () => {
    handleReset();
    let timeObj = getFbaSelTime(fbaSelection.formData);
    for (let key in timeObj) {
      fbaSelection.formData[key] = timeObj[key];
    }
    if (activeName.value !== '基础模板') {
      fbaSelection.formData.itemsStatus = itemsStatus[activeName.value][0];
    } else {
      delete fbaSelection.formData.itemsStatus;
    }
    // 非基础模板排序字段
    if (activeName.value != '基础模板') {
      fbaSelection.formData.tempOrderBy =
        tempOrderBy[fbaSelection.formData.orderByStr] || '';
    } else {
      fbaSelection.formData.tempOrderBy = '';
    }
    let form = new FormData();
    for (let key in fbaSelection.formData) {
      form.append(key, fbaSelection.formData[key]);
    }
    form.append('exportType', 1);
    transBlob({
      url: '/lms/fba/chooseItems/exportFbaChooseItemsTemplateAsExcel',
      contentType: 'application/x-www-form-urlencoded',
      data: {
        ...form,
        site: fbaSelection.formData.site
      },
      fileName: 'FBA选品' + transferDate(new Date().getTime()) + '.xls'
    }).finally(() => {
      exportLoading.value = false;
      ElMessage.success('下载成功');
    });
  };
  // 选中导出
  const handleExportByCheck = () => {
    const checkedList = findTable().getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    let params = {
      exportType: 0,
      idSTR: checkedList.map((item) => item.fbaChooseItems?.id).join(),
      site: fbaSelection.formData.site
    };
    exportLoading.value = true;
    transBlob({
      url: '/lms/fba/chooseItems/exportFbaChooseItemsTemplateAsExcel',
      contentType: 'application/x-www-form-urlencoded',
      data: params,
      fileName: 'FBA选品' + transferDate(new Date().getTime()) + '.xls'
    }).finally(() => {
      exportLoading.value = false;
      ElMessage.success('下载成功');
    });
  };
  // #endregion  ---- 批量操作end

  // 操作日志
  const showLogDialog = ref(false);
  const chooseId = ref('');
  const itemName = ref('');
  const pSku = ref('');

  const handleShowLog = (row) => {
    showLogDialog.value = true;
    chooseId.value = row.fbaChooseItems?.id;
    itemName.value = row.cnTitle;
    pSku.value = row.fbaChooseItems?.pSku;
  };

  const closeShowDialog = () => {
    showLogDialog.value = false;
  };
</script>
<style scoped lang="scss">
  .primaryBtn {
    background-color: #409eff !important;
    color: #ffffff !important;
  }
</style>
