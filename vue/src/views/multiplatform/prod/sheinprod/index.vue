<template>
  <el-card class="shein_prod search_card">
    <el-form
      ref="formRef"
      :model="formData"
      :inline="true"
      :label-width="100"
      class="search_form"
    >
      <el-form-item prop="key">
        <el-select v-model="formData.key" class="form_left">
          <!-- <el-option value="0" label="供应商货号" /> -->
          <!-- <el-option value="1" label="SKC" /> -->
          <el-option value="2" label="供应商SKU" />
          <el-option value="3" label="商品父SKU" />
          <el-option value="4" label="商品子SKU" />
          <el-option value="5" label="shein sku" />
          <el-option value="6" label="shein skc" />
        </el-select>
        <el-input
          v-model="formData.val"
          class="form_right"
          placeholder="单个模糊，多个精确"
        />
      </el-form-item>
      <el-form-item
        label="OA新类目"
        prop="cateName"
        class="search_item_cascader"
      >
        <el-cascader
          v-model="formData.cateName"
          :options="initFormData.oaList"
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
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="店铺" prop="storeAcctId">
        <el-select
          v-model="formData.storeAcctId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in selectData.storeData"
            :key="item.id"
            :label="item.storeAcct"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="stockType1" class="form_range">
        <el-select
          v-model="formData.stockType1"
          placeholder="请选择"
          class="form_left"
        >
          <el-option :value="0" label="义乌仓库存" />
          <el-option :value="1" label="佛山仓库存" />
          <el-option :value="2" label="shein待发" />
          <el-option :value="3" label="shein可用" />
          <el-option :value="4" label="shein在途" />
        </el-select>
        <el-input
          v-model="formData.stockMin"
          placeholder=">="
          class="form_right"
        />
        <div class="range_link">-</div>
        <el-input v-model="formData.stockMax" placeholder="<=" />
      </el-form-item>
      <el-form-item label="商品标签" prop="prodTag">
        <el-select
          v-model="formData.prodTag"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in initFormData.prodAttrTagArr"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sortType">
        <el-select v-model="formData.sortType" clearable>
          <el-option :value="1" label="供货价倒序" />
          <el-option :value="0" label="供货价正序" />
          <el-option :value="3" label="利润倒序" />
          <el-option :value="2" label="利润正序" />
          <el-option :value="4" label="总销量倒序" />
          <el-option :value="5" label="总销量正序" />
          <el-option :value="6" label="义务仓真实库存倒序" />
          <el-option :value="7" label="义务仓真实库存正序" />
          <el-option :value="8" label="佛山仓真实库存倒序" />
          <el-option :value="9" label="佛山仓真实库存正序" />
          <el-option :value="11" label="同步时间倒序" />
          <el-option :value="10" label="同步时间正序" />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="开发员" prop="bizzOwner">
        <el-select
          v-model="formData.bizzOwner"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in initFormData.lazadaPerson"
            :key="item.id"
            :label="item.user_name"
            :value="item.user_name"
          ></el-option>
          <template #footer>
            <el-checkbox>全部</el-checkbox>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="采购员" prop="buyer">
        <el-select
          v-model="formData.buyer"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in initFormData.lazadaLeavedUser"
            :key="item.id"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="saleDayType1" class="form_range">
        <el-select
          v-model="formData.saleDayType1"
          placeholder="请选择"
          class="form_left"
        >
          <el-option :value="0" label="shein可售天数" />
          <el-option :value="1" label="总可售天数" />
        </el-select>
        <el-input
          v-model="formData.saleDayMin"
          placeholder=">="
          class="form_right"
        />
        <div class="range_link">-</div>
        <el-input v-model="formData.saleDayMax" placeholder="<=" />
      </el-form-item>
      <el-form-item label="商品层次" prop="productLevel">
        <el-select
          v-model="formData.productLevel"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in initFormData.allProductLevel"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="daySalesType1" class="form_range">
        <el-select
          v-model="formData.daySalesType1"
          placeholder="请选择"
          class="form_left"
        >
          <el-option :value="0" label="shein日均销量" />
          <el-option :value="4" label="shein今日销量" />
          <el-option :value="1" label="shein7天销量" />
          <el-option :value="2" label="shein本月销量" />
          <el-option :value="3" label="shein上月销量" />
        </el-select>
        <el-input
          v-model="formData.daySalesMin"
          placeholder=">="
          class="form_right"
        />
        <div class="range_link">-</div>
        <el-input v-model="formData.daySalesMax" placeholder="<=" />
      </el-form-item>
      <el-form-item label="是否建议备货" prop="isPreStock">
        <el-select v-model="formData.isPreStock" clearable>
          <el-option :value="true" label="是" />
          <el-option :value="false" label="否" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否可以调拨" prop="isTran">
        <el-select v-model="formData.isTran" clearable>
          <el-option :value="true" label="是" />
          <el-option :value="false" label="否" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否建议采购" prop="isBuy">
        <el-select v-model="formData.isBuy" clearable>
          <el-option :value="true" label="是" />
          <el-option :value="false" label="否" />
        </el-select>
      </el-form-item> -->
      <br />
      <el-form-item label="水洗唛" prop="uploadWateringMarkLable">
        <el-select v-model="formData.uploadWateringMarkLable" clearable>
          <el-option :value="false" label="未上传" />
          <el-option :value="true" label="已上传" />
        </el-select>
      </el-form-item>
      <el-form-item label="环保贴" prop="uploadEnvProLable">
        <el-select v-model="formData.uploadEnvProLable" clearable>
          <el-option :value="false" label="未上传" />
          <el-option :value="true" label="已上传" />
        </el-select>
      </el-form-item>
      <el-form-item label="眼镜贴" prop="uploadGlasseLable">
        <el-select v-model="formData.uploadGlasseLable" clearable>
          <el-option :value="false" label="未上传" />
          <el-option :value="true" label="已上传" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
        <el-button @click="resetForm">清空</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 数据列表展示 -->
  <el-card class="list_card">
    <div class="flex_between">
      <div>
        <el-tag>数量({{ total }})</el-tag>
        <span style="margin-left: 10px; font-size: 15px; vertical-align: middle"
          >当前选中 {{ selectCount }} 条数据</span
        >
        <el-button type="primary" @click="downloadExcel">导出</el-button>
      </div>
      <div class="flex_between">
        <el-dropdown style="margin: 0 10px">
          <el-button type="primary">
            修改信息<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editLabel">设置标签</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  action
                  :http-request="(file) => handleUpload(file, 1)"
                  :show-file-list="false"
                  style="margin-right: 12px"
                  >上传水洗唛</el-upload
                >
              </el-dropdown-item>
              <el-dropdown-item
                ><el-upload
                  action
                  :http-request="(file) => handleUpload(file, 2)"
                  :show-file-list="false"
                  style="margin-right: 12px"
                  >上传环保贴</el-upload
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><el-upload
                  action
                  :http-request="(file) => handleUpload(file, 3)"
                  :show-file-list="false"
                  style="margin-right: 12px"
                  >上传眼镜贴</el-upload
                ></el-dropdown-item
              >
              <el-dropdown-item @click="handleDelete(1)"
                >删除水洗唛</el-dropdown-item
              >
              <el-dropdown-item @click="handleDelete(2)"
                >删除环保贴</el-dropdown-item
              >
              <el-dropdown-item @click="handleDelete(3)"
                >删除眼镜贴</el-dropdown-item
              >
              <el-dropdown-item @click="modifySalesPerson"
                >修改自营销售</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-button type="primary" style="margin-right: 12px">
          <a
            style="color: #fff; text-decoration: none"
            href="/api/lms/static/templet/importSheinProdExcel.xlsx"
            target="_blank"
            >下载模板</a
          >
        </el-button> -->
        <el-upload
          :action="'/api/lms/sheinProducts/importSheinProdExcel'"
          :on-success="uploadSbsSuccess"
          :on-error="uploadError"
          :on-progress="handleProgress"
          :show-file-list="false"
        >
          <el-button type="primary">导入表格</el-button>
        </el-upload>
      </div>
    </div>
    <div style="margin: 5px 0">
      <el-checkbox-group v-model="formData.labelNames">
        <el-checkbox
          v-for="item in selectData.labelNameArr"
          :key="item"
          :label="item"
        />
      </el-checkbox-group>
    </div>
    <vxe-table
      ref="tableDataRef"
      v-loading="loading"
      :show-overflow="true"
      :data="tableData"
      :height="height"
      :scroll-y="{ gt: 10 }"
      border
      @checkbox-change="changeTableCheckbox"
      @checkbox-all="changeTableAllCheckbox"
    >
      <vxe-column type="checkbox" width="40" />
      <vxe-column title="图片" width="100">
        <template #default="{ row }">
          <ImagePop :src="row.url + row.prodSInfo.image || ''" />
          <!-- <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="row.url + row.prodSInfo.image || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="row.url + row.prodSInfo.image"
                loading="lazy"
                :src="row.url + row.prodSInfo.image || ''"
              />
            </template> </el-popover> -->
        </template>
      </vxe-column>
      <vxe-column title="SKU" width="200">
        <template #default="{ row }">
          <el-tooltip content="点击复制" placement="bottom">
            <div>
              供应商SKU：<span
                :style="row.active1"
                @mouseenter="mouseEnter(row, 'active1')"
                @mouseleave="mouseLeave(row, 'active1')"
                @click="copy(row.supplierSku)"
                >{{ row.supplierSku }}</span
              >
            </div>
          </el-tooltip>
          <el-tooltip content="点击复制" placement="bottom">
            <div>
              商品父SKU：<span
                :style="row.active2"
                @mouseenter="mouseEnter(row, 'active2')"
                @mouseleave="mouseLeave(row, 'active2')"
                @click="copy(row.prodPSku)"
                >{{ row.prodPSku }}</span
              >
            </div></el-tooltip
          >
          <el-tooltip content="点击复制" placement="bottom">
            <div>
              商品子SKU：<span
                :style="row.active3"
                @mouseenter="mouseEnter(row, 'active3')"
                @mouseleave="mouseLeave(row, 'active3')"
                @click="copy(row.prodSSku)"
                >{{ row.prodSSku }}</span
              >
            </div></el-tooltip
          >
          shein skc：{{ row.skc }}<br />
          shein sku：{{ row.skuCode }}<br />
          <!-- 总出库量：{{ row.extra ? row.extra.allSale : '' }}<br /> -->
          上架日期：{{
            row.publishTime ? parseTime(row.publishTime, '{y}-{m}-{d}') : ''
          }}{{ row.publishDay ? '(' + row.publishDay + ')' : '' }}

          <div style="display: flex">
            <div v-if="row.wateringMark">
              <el-popover
                placement="right"
                width="500px"
                :hide-after="0"
                trigger="hover"
                @show="
                  openPDFPreview1(row.wateringMark, `pdfCanvasWater${row.id}`)
                "
              >
                <template #default>
                  <canvas :id="`pdfCanvasWater${row.id}`"></canvas>
                  <div
                    style="
                      color: rgb(64, 158, 255);
                      cursor: pointer;
                      text-align: center;
                    "
                    @click="
                      downloadPdf1(row.wateringMark, `${row.supplierSku}水洗唛`)
                    "
                  >
                    {{ row.supplierSku }}水洗唛
                  </div>
                </template>
                <template #reference>
                  <div class="tag_blue">水</div>
                </template>
              </el-popover>
            </div>
            <div v-if="row.envPro">
              <el-popover
                placement="right"
                :hide-after="0"
                trigger="hover"
                popper-class="custom_pop"
                @show="openPDFPreview1(row.envPro, `pdfCanvasLabel${row.id}`)"
              >
                <template #default>
                  <canvas :id="`pdfCanvasLabel${row.id}`"></canvas>
                  <div
                    style="
                      color: rgb(64, 158, 255);
                      cursor: pointer;
                      text-align: center;
                    "
                    @click="
                      downloadPdf1(row.envPro, `${row.supplierSku}环保贴`)
                    "
                  >
                    {{ row.supplierSku }}环保贴
                  </div>
                </template>
                <template #reference>
                  <div class="tag_blue">环</div>
                </template>
              </el-popover>
            </div>
            <div v-if="row.glasse">
              <el-popover
                placement="right"
                :hide-after="0"
                trigger="hover"
                popper-class="custom_pop"
                @show="openPDFPreview1(row.glasse, `pdfCanvasLabel${row.id}`)"
              >
                <template #default>
                  <canvas :id="`pdfCanvasLabel${row.id}`"></canvas>
                  <div
                    style="
                      color: rgb(64, 158, 255);
                      cursor: pointer;
                      text-align: center;
                    "
                    @click="
                      downloadPdf1(row.glasse, `${row.supplierSku}眼镜贴`)
                    "
                  >
                    {{ row.supplierSku }}眼镜贴
                  </div>
                </template>
                <template #reference>
                  <div class="tag_blue">眼</div>
                </template>
              </el-popover>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="OA商品信息" width="170">
        <template #default="{ row }">
          商品名称：{{ row.prodSInfo.title }}<br />
          款式：{{ row.prodSInfo.style }}<br />
          oa分类：
          {{
            row.cateTreeName
              ? row.cateTreeName.split('>>')[
                  row.cateTreeName.split('>>').length - 1
                ]
              : ''
          }}
        </template>
      </vxe-column>
      <vxe-column title="shein商品信息" width="150">
        <template #default="{ row }">
          shein分类：{{ row.categoryName }}<br />
          shein属性：{{ row.attribute }}<br />
          shein标签：{{ row.prodTag }}<br />
          供应状态：{{ row.supplyStatus }}<br />
          上架状态：{{ row.onShelf == true ? '在售' : '停售' }}<br />
          商品层次：{{ row.prodLevel }}
        </template>
      </vxe-column>
      <vxe-column title="人员" width="130">
        <template #default="{ row }">
          <div>店铺：{{ row.storeAcct }}</div>
          <div>开发：{{ row.bizzOwner }}</div>
          <div>采购：{{ row.prodSInfo.buyer }}</div>
          <div>销售：{{ row.salesperson }}</div>
        </template>
      </vxe-column>
      <vxe-column title="供货价(CNY)" field="supplyPrice" width="65">
      </vxe-column
      ><vxe-column title="采购成本" width="50">
        <template #default="{ row }">
          {{
            row.avgCost && row.avgCost != 0
              ? row.avgCost
              : row.prodSInfo.purchaseCostPrice
          }}
        </template>
      </vxe-column>
      <vxe-column title="利润" width="110">
        <template #default="{ row }">
          利润：{{ row.profit }}<br />
          <!-- 利润/供货价 -->
          利润率：{{
            row.profit / row.supplyPrice && row.supplyPrice != 0
              ? ((row.profit / row.supplyPrice) * 100).toFixed(1) + '%'
              : ''
          }}
        </template>
      </vxe-column>
      <vxe-column title="shein销量" width="90">
        <template #default="{ row }">
          日均：{{ row.dailySale }}<br />
          今日：{{ row.daySales }}<br />
          7天：{{ row.skuSevenSale }}<br />
          本月：{{ row.extra ? row.extra.monthlySale : '' }}<br />
          上月：{{ row.extra ? row.extra.lastMonthlySale : '' }}
        </template>
      </vxe-column>
      <vxe-column title="shein库存" width="100">
        <template #default="{ row }">
          待发：{{ row.orderedBnShip }}<br />
          可用：{{ row.stockNum }}<br />
          在途：{{ row.inTran }}<br />
          供应商可用：{{ row.supplierAvailableStock }}
        </template>
      </vxe-column>
      <vxe-column title="义乌仓库存" width="100">
        <template #default="{ row }">
          可用：{{ row.currentStock }}<br />
          在途：{{ row.onwayStock }}<br />
          未占用：{{ row.preAvailableStock }}<br />
        </template>
      </vxe-column>
      <vxe-column title="佛山仓库存" width="100">
        <template #default="{ row }">
          可用：{{ row.currentStock2 }}<br />
          在途：{{ row.onwayStock2 }}<br />
          未占用：{{ row.preAvailableStock2 }}<br />
          采购未审核：{{ row.amount }}
        </template>
      </vxe-column>
      <vxe-column title="可售天数" width="120">
        <template #default="{ row }">
          shein可售：{{ row.saleNum }}<br />
          总共可售：{{ row.sumStock }}
        </template>
      </vxe-column>
      <vxe-column title="是否建议备货" width="60">
        <template #default="{ row }">
          {{ row.sugPreStock ? '是' : '否' }}
        </template>
      </vxe-column>
      <vxe-column title="建议备货数量" width="60">
        <template #default="{ row }">
          {{ row.sugPreStock || '' }}
        </template>
      </vxe-column>
      <vxe-column title="是否可以调拨" width="60">
        <template #default="{ row }">
          {{ row.isTran == true ? '是' : '否' }}
        </template>
      </vxe-column>
      <!-- <vxe-column title="销量" width="120">
        <template #default="{ row }">
          <div>7天: {{ row.extra ? row.extra.sevenSale : '-' }}</div>
          <div>15天: {{ row.extra ? row.extra.fiftySale : '-' }}</div>
          <div>30天: {{ row.extra ? row.extra.thirtySale : '-' }}</div>
          <div>总销量: {{ row.extra ? row.extra.allSale : '-' }}</div>
        </template>
      </vxe-column>
      <vxe-column title="库存" width="160"
        ><template #default="{ row }">
          当前库存(义乌)：{{ row.currentStock }} <br />
          在途库存(义乌)：{{ row.onwayStock }} <br />
          当前库存(佛山)：{{ row.currentStock2 }} <br />
          在途库存(佛山)：{{ row.onwayStock2 }}
        </template></vxe-column
      > -->
      <vxe-column title="供应商链接"
        ><template #default="{ row }">
          <el-link :href="row.purchaseUrl" target="_blank" type="primary">{{
            row.supplier
          }}</el-link>
        </template></vxe-column
      >
      <!-- <vxe-column title="是否建议采购" field="" width="120"></vxe-column
      ><vxe-column title="建议采购数量" width="120"></vxe-column> -->
      <!-- <vxe-column title="操作"
        ><template #default="{ row }">
        </template></vxe-column
      > -->
    </vxe-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="formData.page"
        v-model:page-size="formData.limit"
        background
        :page-sizes="[50, 100, 300]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
  <el-dialog
    v-model="editLabelDialog"
    width="30%"
    title="设置标签"
    :close-on-click-modal="false"
  >
    <el-form size="default">
      <el-checkbox
        v-for="item in selectData.labelNameArr"
        :key="item"
        v-model="editLabelForm"
        :label="item"
      />
    </el-form>
    <template #footer>
      <el-button type="primary" @click="editLabelSave()">确定</el-button>
      <el-button @click="editLabelDialog = false">关闭</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="modifySalesPersonDialog"
    width="30%"
    title="修改shein自营销售员"
    :close-on-click-modal="false"
  >
    <el-form size="default">
      <el-form-item label="销售员">
        <el-select
          v-model="modifySalesPersonSalesName"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in initFormData.salesPersonList"
            :key="item.id"
            :label="item.user_name"
            :value="item.user_name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="modifySalesPersonSave()"
        >修改</el-button
      >
      <el-button @click="modifySalesPersonDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="multiplatformprodsheinprod">
  import { onMounted, reactive, ref, computed } from 'vue';
  import axios from 'axios';
  import { parseTime, copy } from '@/utils/common';
  import {
    getProdTagListApi,
    queryOaNewCategory,
    getCustomers
  } from '@/api/common';
  import { getSysUserList } from '@/api/multiplatform/aesupportprod';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getStoreInfo } from '@/api/eBay/payments';
  import {
    updateEmpty,
    uploads,
    getProducts,
    updateLabelName,
    editSales,
    getAllProductLevel
  } from '@/api/multiplatform/sheinprod';
  import { getDepartData } from '@/api/eBay/payments';
  import useUserStore from '@/store/modules/user';
  import ImagePop from '@/components/ImagePop/index.vue';
  import * as pdfjs from 'pdfjs-dist';
  // import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker';

  // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  pdfjs.GlobalWorkerOptions.workerSrc =
    '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.val = '';
    formData.stockMin = '';
    formData.stockMax = '';
    formData.saleDayMin = '';
    formData.saleDayMax = '';
    formData.daySalesMin = '';
    formData.daySalesMax = '';
    formData.stockType = '';
    formData.saleDayType = '';
    formData.daySalesType = '';
    // daySalesMin
    getStoreList();
  };
  // 初始化查询条件
  const initFormData = reactive({
    oaList: [], // oa类目
    salesPersonList: [], // 销售员
    lazadaLeavedUser: [], // 采购
    lazadaPerson: [], // 开发
    allProductLevel: [], // 商品层次
    prodAttrTagArr: [] //  商品标签
  });
  // 分页--start
  const total = ref(0);
  // 设置每页count
  const handleSizeChange = (val) => {
    formData.limit = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    formData.page = val;
    onSubmit();
  };
  // 分页--end
  const formData = reactive({
    page: 1,
    limit: 50,
    cateTreeName: [],
    storeAcctId: '',
    bizzOwner: '',
    buyer: '',
    stockMin: '',
    stockMax: '',
    stockType1: 0,
    prodTag: '',
    title: '',
    isBuy: true,
    key: '2',
    val: '',
    labelNames: [],
    prodAttrLists: [], // 商品标签
    // supplierSku: '', // 单个模糊供应商sku
    // supplierSkus: [], // 多个精确供应商sku
    // skc: '', // 单个模糊skc
    // skcs: [], // 多个精确skc
    // supplierNumber: '', // 单个模糊供应商货号
    // supplierNumbers: [], // 多个精确供应商货号
    // skuType: true, // sku类型  skuType ==true 单个模糊
    isPreStock: '',
    isTran: '',
    productLevel: '',
    saleDayType1: 0,
    saleDayMin: '',
    saleDayMax: '',
    daySalesType1: 0,
    daySalesMin: '',
    daySalesMax: '',
    sortType: 11
  });
  // 处理数据为数字类型
  // const handleInt = (args) => {
  //   args.forEach((item) => {
  //     formData[item] == ''
  //       ? delete formData[item]
  //       : (formData[item] = formData[item] * 1);
  //   });
  // };
  // 查询
  const onSubmit = async () => {
    // 类目
    let cateOa = [];
    if (formData.cateName) {
      formData.cateName.forEach((item) => {
        cateOa.push(item[item.length - 1]);
      });
      formData.cateTreeName = cateOa;
    }
    // 供应商货号，sku，skc，商品父SKU、商品子SKU
    const f = [
      ['supplierNumber', 'supplierNumbers'],
      ['skc', 'skcs'],
      ['supplierSku', 'supplierSkus'],
      ['prodPSku', 'prodPSkus'],
      ['prodSSku', 'prodSSkus'],
      ['skuCode', 'skuCodes'],
      ['skc', 'skcs']
    ];
    formData.prodPSku =
      formData.prodSSku =
      formData.supplierSku =
      formData.skuCode =
      formData.skc =
        '';
    formData.prodPSkus =
      formData.prodSSkus =
      formData.supplierSkus =
      formData.skuCodes =
      formData.skcs =
        [];
    if (formData.val && formData.val != '') {
      formData.val.includes(',')
        ? (formData[f[formData.key][1]] = formData.val.split(','))
        : (formData[f[formData.key][0]] = formData.val);
      formData.val.includes(',')
        ? (formData.skuType = false)
        : (formData.skuType = true);
    } else {
      delete formData.skuType;
    }
    // console.log(formData);
    // int类型
    // handleInt(['storeAcctId', 'stockMin', 'stockMax', 'sortType']);
    // for (let item in formData) {
    //   if (
    //     formData[item] == '' ||
    //     formData[item] == undefined ||
    //     formData[item].length == 0
    //   ) {
    //     delete formData[item];
    //   }
    // }

    if (formData.stockMin == '' && formData.stockMax == '') {
      formData.stockType = '';
    } else {
      formData.stockType = formData.stockType1;
    }
    if (formData.saleDayMin == '' && formData.saleDayMax == '') {
      formData.saleDayType = '';
    } else {
      formData.saleDayType = formData.saleDayType1;
    }
    if (formData.daySalesMin == '' && formData.daySalesMax == '') {
      formData.daySalesType = '';
    } else {
      formData.daySalesType = formData.daySalesType1;
    }

    loading.value = true;
    const { data, code, count } = await getProducts(formData);
    if (code == '0000') {
      if (data == '未查到数据') {
        tableData.value = [];
      } else {
        tableData.value = data;
      }
      total.value = count;
    } else {
      tableData.value = [];
    }
    loading.value = false;
    selectCount.value = 0;
  };

  const selectCount = ref(0);
  const changeTableCheckbox = (e) => {
    selectCount.value = e.records.length;
  };
  const changeTableAllCheckbox = (e) => {
    selectCount.value = e.records.length;
  };

  onMounted(async () => {
    getStoreList();
    //OA新类目
    {
      const { data } = await queryOaNewCategory();
      initFormData.oaList = JSON.parse(data);
    }
    {
      // 获取商品标签
      const { data } = await getProdTagListApi();
      initFormData.prodAttrTagArr = data;
    }
    {
      // 开发
      const { data } = await getCustomers();
      initFormData.lazadaPerson = data.userList;
    }
    {
      // 采购员
      const { data } = await getSysUserList();
      initFormData.lazadaLeavedUser = data.purchasingAgentList;
    }
    {
      // 商品层次
      const { data } = await getAllProductLevel();
      initFormData.allProductLevel = data;
    }
  });
  const tableDataRef = ref();
  // 添加商品模板[type=0导出]
  const downloadExcel = async () => {
    ElMessage.warning('导出处理中，请稍后');
    loading.value = true;
    const checkedData = tableDataRef.value.getCheckboxRecords();
    formData.idList = checkedData.map((item) => item.id);
    axios({
      method: 'POST',
      url: '/api/lms/sheinProducts/export',
      data: formData,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob',
      dataType: 'json'
    })
      .then((res) => {
        if (res.statusText == 'OK') {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = 'shein商品.xlsx';
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
        }
        loading.value = false;
      })
      .catch((err) => {
        console.log(err);
        loading.value = false;
      });
  };

  const loading = ref(false);
  const mouseEnter = (row, active) => {
    row[active] = {
      color: '#409EFF',
      cursor: 'pointer'
    };
  };
  const mouseLeave = (row, active) => {
    row[active] = '';
  };

  // 获取用户名
  let { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 列表数据
  const tableData = ref([]);
  // 店铺
  const selectData = reactive({
    storeData: [],
    labelNameArr: ['暂时缺货', '停产', '低利润']
  });
  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'shein自营专员',
        orgId: '',
        platCode: 'shein自营',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 设置标签 --start--
  const editLabelDialog = ref(false);
  const editLabelForm = ref([]);
  // 打开
  const editLabel = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    if (checkedData.length == 1) {
      editLabelForm.value = checkedData[0].prodTag
        ? checkedData[0].prodTag.split(',')
        : [];
    } else {
      editLabelForm.value = [];
    }
    editLabelDialog.value = true;
  };
  const getCheckboxRecords = () => {
    const checkedData = tableDataRef.value
      .getCheckboxRecords()
      .map((item) => item.id);
    return checkedData;
  };

  // 保存
  const editLabelSave = async () => {
    const checkedData = getCheckboxRecords();
    let paramsArr = [];
    checkedData.forEach((item) => {
      let obj = {};
      obj.id = item;
      obj.prodTag = editLabelForm.value.join(',');
      paramsArr.push(obj);
    });
    const { code } = await updateLabelName({ updateList: paramsArr });
    if (code == '0000') {
      editLabelDialog.value = false;
      editLabelForm.value = [];
      ElMessage.success('修改成功');
      onSubmit();
    }
  };
  // 设置标签 --end--
  const handleProgress = () => {
    loading.value = true;
    ElMessage.warning('导入表格处理中,请稍后');
  };
  const uploadSbsSuccess = (res) => {
    if (res.code == '0000') {
      let str = '';
      str += `成功${res.data.successCount}条，失败${
        res.data.errorCount
      }条，失败原因：${res.data.failList.join('\n')}`;
      ElMessageBox.confirm(str, '导入成功', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
    } else {
      ElMessageBox.confirm(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
    // 刷新
    onSubmit();
  };
  const uploadError = () => {
    ElMessage.error('导入新增失败！');
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 330;
  });

  const getSelectedList = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return false;
    } else {
      return true;
    }
  };

  const handleUpload = async (rawFile, type) => {
    if (getSelectedList()) {
      const checkedData = tableDataRef.value.getCheckboxRecords();
      let arr = [];
      checkedData.forEach((item) => {
        arr.push({
          storeAcctId: item.storeAcctId,
          skc: item.skc,
          supplierSku: item.supplierSku
        });
      });

      const fd = new FormData();
      fd.append('pdf', rawFile.file);
      fd.append('list', JSON.stringify(arr));
      fd.append('uploadType', type);
      const { code, msg } = await uploads(fd);
      if (code == '0000') {
        // 刷新
        ElMessage.success(msg);
        onSubmit();
      }
    }
  };

  // 删除1水洗唛2环保贴3眼镜贴
  const handleDelete = (type) => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }
    let arr = [];
    checkedData.forEach((item) => {
      arr.push({
        storeAcctId: item.storeAcctId,
        skc: item.skc,
        supplierSku: item.supplierSku
      });
    });
    let arrCon = ['', '水洗唛', '环保贴', '眼镜贴'];
    ElMessageBox.confirm(
      `确定要删除${arrCon[type]}吗？删除后将不可恢复`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        const { code, msg } = await updateEmpty(type, arr);
        if (code == '0000') {
          // 刷新
          ElMessage.success(msg);
          onSubmit();
        }
      })
      .catch(() => {});
  };

  // 修改自营销售 --start--
  const modifySalesPersonDialog = ref(false);
  const modifySalesPersonSalesName = ref();
  // 打开
  const modifySalesPerson = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择至少一条数据');
      return;
    }

    const { data } = await getDepartData({
      roleNames: 'shein自营专员'
    });
    initFormData.salesPersonList = data.userList;
    modifySalesPersonDialog.value = true;
  };

  // 保存
  const modifySalesPersonSave = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    let ids = checkedData.map((item) => item.id);
    const { code } = await editSales({
      ids: ids.join(','),
      salesName: modifySalesPersonSalesName.value
    });

    if (code == '0000') {
      modifySalesPersonDialog.value = false;
      modifySalesPersonSalesName.value = '';
      ElMessage.success('修改成功');
      onSubmit();
    }
  };
  // 修改自营销售 --end--

  // 预览pdf
  const openPDFPreview1 = (padfUrl, canvasEl) => {
    // PDF文件的URL
    const pdfUrl = padfUrl;

    // 创建一个新的PDF文档实例
    pdfjs.getDocument(pdfUrl).promise.then((pdf) => {
      // 获取第一页
      pdf.getPage(1).then((page) => {
        const canvas = document.getElementById(canvasEl);
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale: 2.5 });

        // 设置画布大小以匹配PDF页面尺寸
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 将PDF页面渲染到画布上
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    });
  };

  // 下载 pdf
  const downloadPdf1 = (url, name) => {
    const a = document.createElement('a');
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob);
        a.download = name; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
  };
</script>
<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }
  .flex_between {
    display: flex;
    justify-content: space-between;
  }
  :deep(.hide_tag) {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .tag_blue {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-left: 5px;
    background: rgb(64, 158, 255);
    line-height: 22px;
    text-align: center;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
  }
  .custom_pop {
    min-width: 300px !important;
    width: auto !important;
  }
</style>
