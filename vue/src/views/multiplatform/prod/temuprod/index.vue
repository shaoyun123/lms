<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="temu_prod search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
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
        <el-form-item label="销售人员" prop="salesPersonId">
          <el-select
            v-model="formData.salesPersonId"
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
        <el-form-item label="店铺" prop="storeAcctIdList">
          <el-select
            v-model="formData.storeAcctIdList"
            class="mul-input"
            :class="formData.storeAcctIdList.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.storeAcctIdList.length > 1" type="info"
                >已选{{ formData.storeAcctIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点">
          <el-select
            v-model="formData.salesSiteList"
            class="mul-input"
            :class="formData.salesSiteList.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.salesSiteList.length > 1" type="info"
                >已选{{ formData.salesSiteList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.siteList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sellerSkuKey">
          <el-select v-model="formData.sellerSkuKey" class="form_left">
            <el-option value="sellerSkuCodeStr" label="SKU货号" />
            <el-option value="sellerSkuStr" label="SKU ID" />
            <el-option value="sellerSkcCodeStr" label="SKC货号" />
            <el-option value="sellerSkcStr" label="SKC ID" />
          </el-select>
          <el-input v-model="formData.sellerSkuVal" class="form_right" />
        </el-form-item>
        <el-form-item label="打印条码" prop="printCodeStr">
          <el-input v-model="formData.printCodeStr" />
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrTagList">
          <el-select
            v-model="formData.prodAttrTagList"
            class="mul-input"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
            filterable
          >
            <el-option
              v-for="item in prodAttrTagArrOption"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="销售状态" prop="saleStatusList">
          <el-select
            v-model="formData.saleStatusList"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
          >
            <el-option :value="-1" label="无" />
            <el-option :value="1" label="售卖" />
            <el-option :value="0" label="不卖" />
          </el-select>
        </el-form-item>
        <el-form-item label="包装备注" prop="packDescStatus">
          <el-select v-model="formData.packDescStatus" clearable>
            <el-option value="1" label="有" />
            <el-option value="0" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="包装备注内容" prop="packDesc">
          <el-input v-model="formData.packDesc" clearable />
        </el-form-item>
        <el-form-item label="水洗唛" prop="wateringMarkStatus">
          <el-select v-model="formData.wateringMarkStatus" clearable>
            <el-option value="0" label="未上传" />
            <el-option value="1" label="已上传" />
          </el-select>
        </el-form-item>
        <el-form-item label="triman标签" prop="englishLabelStatus">
          <el-select v-model="formData.englishLabelStatus" clearable>
            <el-option value="0" label="未上传" />
            <el-option value="1" label="已上传" />
          </el-select>
        </el-form-item>
        <el-form-item class="form_range">
          <el-select
            v-model="typeForm.salesType"
            placeholder="请选择销量"
            class="form_left"
          >
            <el-option value="1" label="今日销量" />
            <el-option value="7" label="7日销量" />
            <el-option value="30" label="30日销量" />
          </el-select>
          <el-input
            v-model="typeForm.salesNumLowerLimit"
            placeholder=">="
            class="form_right"
          />
          <div class="range_link">-</div>
          <el-input v-model="typeForm.salesNumUpperLimit" placeholder="<=" />
        </el-form-item>
        <el-form-item label="是否缺货" prop="outOfStock">
          <el-select v-model="formData.outOfStock" clearable>
            <el-option :value="false" label="否" />
            <el-option :value="true" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式" prop="orderBy">
          <el-select
            v-model="formData.orderBy"
            placeholder="排序方式"
            clearable
          >
            <el-option
              v-for="item in ORDER_TYPE_STATUS"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="SKU剩余库存"
          prop="skuStockType"
          class="form_range"
        >
          <el-select
            v-model="typeForm.skuStockType"
            placeholder="<="
            class="range_left"
          >
            <el-option value="warehouseInventoryNumMax" label="<="></el-option>
            <el-option value="warehouseInventoryNumMin" label=">"></el-option>
          </el-select>
          <el-input
            v-model="typeForm.skuStock"
            style="width: 70px"
            class="form_right"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="SKU可售天数"
          prop="salesDayType"
          class="form_range"
        >
          <el-select
            v-model="typeForm.salesDayType"
            placeholder="<="
            class="range_left"
          >
            <el-option value="availableSaleDaysMax" label="<="></el-option>
            <el-option value="availableSaleDaysMin" label=">"></el-option>
          </el-select>
          <el-input
            v-model="typeForm.salesDay"
            style="width: 70px"
            class="form_right"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存状态" prop="warehouseInventoryStatus">
          <el-select
            v-model="formData.warehouseInventoryStatus"
            placeholder="请选择库存状态"
            clearable
          >
            <el-option value="0" label="已断货" />
            <el-option value="1" label="已断码" />
            <el-option value="2" label="即将断码" />
            <el-option value="3" label="建议备货" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片审核状态" prop="pictureAuditStatus">
          <el-select
            v-model="formData.pictureAuditStatus"
            placeholder="请选择"
            clearable
          >
            <el-option value="" label="全部" />
            <el-option value="2" label="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否有侵权信息" prop="tortOrHaveTortReason">
          <el-select
            v-model="formData.tortOrHaveTortReason"
            placeholder="请选择"
            clearable
          >
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售备注" prop="salespersonRemark">
          <el-select
            v-model="formData.salespersonRemark"
            filterable
            allow-create
            placeholder="请选择"
            clearable
          >
            <el-option :value="1" label="有备注" />
            <el-option :value="2" label="无备注" />
          </el-select>
        </el-form-item>
        <el-form-item label="有无Temu类目" prop="salespersonRemark">
          <el-select
            v-model="formData.hasCate"
            filterable
            allow-create
            placeholder="请选择"
            clearable
          >
            <el-option :value="1" label="有" />
            <el-option :value="0" label="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="Temu分类" prop="categoryId" style="width: 220px">
          <el-button type="primary" @click="handleChooseCate"
            >选择类目</el-button
          >
          <el-icon class="ml10 gray_text" @click="handleDelCate"
            ><Delete
          /></el-icon>
        </el-form-item>
        <el-form-item label="评分" prop="minMark" style="width: 220px">
          <div class="flex">
            <el-input
              v-model="formData.minMark"
              placeholder="≥"
              style="width: 55px"
            ></el-input>
            <span class="mx-4">-</span>
            <el-input
              v-model="formData.maxMark"
              placeholder="≤"
              style="width: 55px"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="评论数" prop="minCommentNum" style="width: 220px">
          <div class="flex">
            <el-input
              v-model="formData.minCommentNum"
              placeholder="≥"
              style="width: 55px"
            ></el-input>
            <span class="mx-4">-</span>
            <el-input
              v-model="formData.maxCommentNum"
              placeholder="≤"
              style="width: 55px"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="minOnSalesDurationOffline" style="width: 220px">
          <div class="flex">
            <el-select
              v-model="formData.onSalesDurationOfflineType"
              style="width: 100px"
              @change="changeOnSalesDurationOfflineType"
            >
              <el-option :value="1" label="有站点加入时长"></el-option>
              <el-option :value="0" label="无站点加入时长"></el-option>
            </el-select>
            <ZInputNumber
              v-model="formData.minOnSalesDurationOffline"
              placeholder="≥"
              :min="0"
              style="width: 55px"
            ></ZInputNumber>
            <span class="mx-4">-</span>
            <ZInputNumber
              v-model="formData.maxOnSalesDurationOffline"
              :min="0"
              placeholder="≤"
              style="width: 55px"
            ></ZInputNumber>
          </div>
        </el-form-item>
        <el-form-item label="品质分" prop="minAfsScore" style="width: 220px">
          <div class="flex">
            <el-input
              v-model="formData.minAfsScore"
              placeholder="≥"
              style="width: 55px"
            ></el-input>
            <span class="mx-4">-</span>
            <el-input
              v-model="formData.maxAfsScore"
              placeholder="≤"
              style="width: 55px"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="刊登时间" prop="publishTime">
          <el-date-picker
            v-model="formData.publishTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            :shortcuts="shortcuts"
            :default-time="['2023-10-11 00:00:00', '2023-10-11 23:59:59']"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPaymentsList()">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="list_card">
      <div class="flexBetween">
        <el-button type="primary" @click="handleExportConfig">导出</el-button>
        <div class="flexBetween">
          <el-button
            v-permission="['temuHandlePurchaseStockUp']"
            type="primary"
            @click="handlePurchaseStockUp"
            >申请采购备货</el-button
          >
          <!-- 需要授权 -->
          <el-button
            v-permission="['temuHandlePrintFoodCate']"
            type="primary"
            @click="handlePrintFoodCate"
            >打印食品标类目</el-button
          >
          <el-dropdown style="margin: 0 10px">
            <el-button type="primary">
              修改信息<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editLabel">设置标签</el-dropdown-item>
                <el-dropdown-item @click="editStatus"
                  >修改销售状态</el-dropdown-item
                >
                <el-dropdown-item @click="editRemark"
                  >修改包装备注</el-dropdown-item
                >
                <el-dropdown-item>
                  <el-upload
                    action
                    :http-request="handleUploadWaterMark"
                    :show-file-list="false"
                    style="margin-right: 12px"
                    >上传水洗唛</el-upload
                  >
                </el-dropdown-item>
                <el-dropdown-item
                  ><el-upload
                    action
                    :http-request="uploadEnLabel"
                    :show-file-list="false"
                    style="margin-right: 12px"
                    >上传triman标签</el-upload
                  ></el-dropdown-item
                >
                <el-dropdown-item @click="handleWaterDelete()"
                  >删除水洗唛</el-dropdown-item
                >
                <el-dropdown-item @click="handleLabelDelete()"
                  >删除triman标签</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary">
              下载模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="downloadExcel(0)"
                  >添加商品模板</el-dropdown-item
                >
                <el-dropdown-item @click="downloadExcel(1)"
                  >货件计划模板</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary">
              导入模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-upload
                    :action="'/api/lms/temu/fbm/addItemByExcel'"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                  >
                    导入商品模板
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-upload
                    :action="'/api/lms/temu/fbm/importPlatWhShipment'"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                  >
                    导入货件计划模板
                  </el-upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" @click="createPack">申请平台备货</el-button>
        </div>
      </div>
      <div>
        <el-checkbox
          v-for="item in formData.labelNameArr"
          :key="item"
          :label="item"
          @change="handleFormChange($event, item)"
        />
      </div>
      <!-- v-for index in 1 用于ref获取嵌套子表格时，获取的格式为一个数组 不可删 -->
      <div v-for="index in 1" :key="index">
        <vxe-table
          ref="tableDataRef"
          v-loading="loading"
          :data="paymentsList"
          :height="height"
          :scroll-y="{ enabled: false }"
          border
          :row-config="{ keyField: 'sellerSkc' }"
          :checkbox-config="{ reserve: true }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          @checkbox-change="changeTableCheckbox"
          @checkbox-all="changeTableAllCheckbox"
        >
          <vxe-column type="checkbox" width="45" />
          <vxe-column title="Product信息" width="180px">
            <template #default="{ row }">
              <div
                v-if="row.saleStatus !== undefined"
                style="margin-bottom: 4px"
              >
                <el-tag
                  v-if="row.saleStatus === 1"
                  effect="dark"
                  type="success"
                >
                  售卖
                </el-tag>
                <el-tag v-if="row.saleStatus === 0" effect="dark" type="danger">
                  不卖
                </el-tag>
              </div>
              <div v-if="row.prodAttrList" class="flex-wrap">
                <el-tag
                  v-for="attrItem in row.prodAttrList.split(',')"
                  :key="attrItem"
                  class="tag-item"
                  effect="dark"
                  >{{ attrItem }}</el-tag
                >
              </div>
              <div v-if="row.labelNames" class="flex-wrap">
                <el-tag
                  v-for="lableItem in row.labelNames"
                  :key="lableItem"
                  class="tag-item"
                  effect="dark"
                  type="success"
                  >{{ lableItem }}</el-tag
                >
              </div>
              <div>{{ row.productName }}</div>
              <div class="mt-5">
                <span class="text-bold">SKC货号</span>：{{
                  row.sellerSkcCode || '-'
                }}
              </div>
              <div class="mt-5">
                <span class="text-bold">SKCID</span>：{{ row.sellerSkc || '-' }}
                <el-icon
                  v-if="row.sellerSkc"
                  class="copy_icon"
                  color="#aaa"
                  @click="copy(row.sellerSkc)"
                  ><CopyDocument
                /></el-icon>
              </div>
              <div class="mt-5">
                <span class="text-bold">图片审核状态</span>：{{
                  getStatus(row.pictureAuditStatus)
                }}
              </div>
              <div class="mt-5">
                <span class="text-bold">店铺</span>：{{ row.storeAcct || '-' }}
              </div>
              <div class="mt-5">
                <span class="text-bold">销售</span>：{{
                  row.salesperson || '-'
                }}
              </div>
              <div class="mt-5">
                <span class="text-bold">分类</span>：{{ row.cateCnName || '-' }}
              </div>
              <div class="mt-5">
                <span class="text-bold">Temu类目</span>：{{
                  row.cateTreeName || '-'
                }}
              </div>
              <div class="mt-5">
                <div class="flex">
                  <div class="mr-4">
                    <span class="text-bold">评分</span>：{{ row.mark }}
                  </div>
                  <span class="text-bold">评论数</span>：{{ row.commentNum }}
                </div>
                <span class="text-bold">加入站点时长</span>：{{
                  row.onSalesDurationOffline
                }}
                <div>
                  <span class="text-bold">品质分</span>：{{ row.afsScore }}
                </div>
                <div>
                  <span class="text-bold">刊登时间</span>：{{
                    transferDate(row.listingTime)
                  }}
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="侵权信息" width="140px">
            <template #default="{ row }">
              <div
                v-for="tortItem in row?.prodTortInfoList"
                :key="tortItem.id"
                class="mt-8"
              >
                <div v-if="tortItem.ifTort || tortItem.tortReason" class="flex">
                  <el-tag :type="tortItem.ifTort ? 'danger' : 'info'"
                    >{{ tortItem.platCode
                    }}{{ tortItem.ifTort ? '' : '不' }}侵权</el-tag
                  >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="tortItem.tortReason"
                    placement="bottom"
                  >
                    <div class="tort_info">
                      {{ tortItem?.tortReason || '' }}
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <div style="display: flex">
                <div style="width: 40px"></div>
                <div style="width: 85px">图片</div>
                <div style="width: 145px">SKU</div>
                <div class="temu_thead">责任人</div>
                <div class="temu_thead">重量(g)</div>
                <div class="temu_thead">成本/申报价格</div>
                <div class="temu_thead">货件计划</div>
                <div class="flex-center" style="width: 90px">
                  <div>中转仓</div>
                  <div>可用/在途/未派</div>
                </div>
                <div style="width: 120px">今日/7天/30天销量</div>
                <div class="temu_thead">备货时间/备货数量</div>
                <div class="temu_thead">平台缺货/建议备货数</div>
                <div class="temu_thead">可售天数</div>
                <div class="temu_thead">平台库存数量</div>
                <div style="width: 110px">操作</div>
              </div>
            </template>
            <template #default="{ row }">
              <vxe-table
                ref="innerTable"
                :data="
                  row.subDtoList && row.subDtoList.slice(0, row.displayCount)
                "
                :checkbox-config="{ reserve: true, enabled: false }"
                :row-config="{ keyField: 'id' }"
                :show-header="false"
                @checkbox-change="changeInnerTableCheckbox"
              >
                <vxe-column type="checkbox" width="40" />
                <vxe-column width="85">
                  <template #default="{ row: sonRow }">
                    <div class="flex-center">
                      <el-tooltip :content="sonRow.packDesc" placement="bottom">
                        {{ sonRow.packDesc ? '包装备注' : '' }}
                      </el-tooltip>
                      <ImagePop :src="sonRow.subProdImage" />
                      <div>{{ sonRow.className || '-' }}</div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column width="145">
                  <template #default="{ row: sonRow }">
                    <el-tooltip content="点击复制" placement="bottom">
                      <div>
                        店铺：<span
                          :style="sonRow.active1"
                          @mouseenter="mouseEnter(sonRow, 'active1')"
                          @mouseleave="mouseLeave(sonRow, 'active1')"
                          @click="copy(sonRow.sellerSkuCode)"
                          >{{ sonRow.sellerSkuCode || '-' }}</span
                        >
                      </div>
                    </el-tooltip>

                    <div>
                      商品：<span>{{ sonRow.prodSSku || '-' }}</span>
                      <el-icon
                        v-if="sonRow.prodSSku"
                        class="copy_icon"
                        color="#aaa"
                        @click="copy(sonRow.prodSSku)"
                        ><CopyDocument
                      /></el-icon>
                    </div>
                    <el-tooltip content="点击复制" placement="bottom">
                      <div>
                        条码：<span
                          :style="sonRow.active3"
                          @mouseenter="mouseEnter(sonRow, 'active3')"
                          @mouseleave="mouseLeave(sonRow, 'active3')"
                          @click="copy(sonRow.printCode)"
                          >{{ sonRow.printCode || '-' }}</span
                        >
                      </div></el-tooltip
                    >
                    <el-tooltip content="点击复制" placement="bottom">
                      <div>
                        SKU ID：<span @click="copy(sonRow.printCode)">{{
                          sonRow.sellerSku || '-'
                        }}</span>
                      </div></el-tooltip
                    >
                    <div style="display: flex">
                      <div v-if="sonRow.wateringMark">
                        <el-popover
                          placement="right"
                          width="500px"
                          :hide-after="0"
                          trigger="hover"
                          @show="
                            openPDFPreview(
                              sonRow.wateringMark,
                              `pdfCanvasWater${sonRow.printCode}`
                            )
                          "
                        >
                          <template #default>
                            <canvas
                              :id="`pdfCanvasWater${sonRow.printCode}`"
                            ></canvas>
                            <div
                              style="
                                color: rgb(64, 158, 255);
                                cursor: pointer;
                                text-align: center;
                              "
                              @click="
                                downloadPdf(
                                  sonRow.wateringMark,
                                  `${sonRow.sellerSkuCode}水洗唛`
                                )
                              "
                            >
                              {{ sonRow.sellerSkuCode }}水洗唛
                            </div>
                          </template>
                          <template #reference>
                            <div class="tag_blue">水</div>
                          </template>
                        </el-popover>
                      </div>

                      <div v-if="sonRow.englishLabel">
                        <el-popover
                          placement="right"
                          :hide-after="0"
                          trigger="hover"
                          popper-class="custom_pop"
                          @show="
                            openPDFPreview(
                              sonRow.englishLabel,
                              `pdfCanvasLabel${sonRow.printCode}`
                            )
                          "
                        >
                          <template #default>
                            <canvas
                              :id="`pdfCanvasLabel${sonRow.printCode}`"
                            ></canvas>
                            <div
                              style="
                                color: rgb(64, 158, 255);
                                cursor: pointer;
                                text-align: center;
                              "
                              @click="
                                downloadPdf(
                                  sonRow.englishLabel,
                                  `${sonRow.sellerSkuCode}triman标签`
                                )
                              "
                            >
                              {{ sonRow.sellerSkuCode }}triman标签
                            </div>
                          </template>
                          <template #reference>
                            <div class="tag_blue">标</div>
                          </template>
                        </el-popover>
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>开发: {{ sonRow.bizzOwner || '-' }}</div>
                    <div>采购: {{ sonRow.buyer || '-' }}</div>
                    <div>责任: {{ sonRow.responsor || '-' }}</div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>净重: {{ getCount(sonRow.suttleWeight) }}</div>
                    <div>
                      毛重:
                      <span v-if="sonRow.suttleWeight && sonRow.packWeight">{{
                        (sonRow.suttleWeight + sonRow.packWeight).toFixed(1)
                      }}</span>
                      <span v-else>-</span>
                    </div>
                    <div>平台: {{ getCount(sonRow.wmsWeight) }}</div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>
                      <div>
                        成本: <span v-if="sonRow.purchaseCostPrice">￥</span
                        >{{ sonRow.purchaseCostPrice }}
                      </div>
                      <div>
                        申报价格:
                        <div
                          :style="
                            sonRow.storeCurrency !== 'CNY'
                              ? 'margin-left: 10px'
                              : ''
                          "
                        >
                          <span v-if="sonRow.storeCurrency === 'CNY'">*</span
                          ><span>￥</span>{{ sonRow.supplierPrice }}
                        </div>
                        <div
                          :style="
                            sonRow.storeCurrency !== 'USD'
                              ? 'margin-left: 10px'
                              : ''
                          "
                        >
                          <span v-if="sonRow.storeCurrency === 'USD'">*</span
                          ><span>$ </span>{{ sonRow.supplierPriceUsd }}
                        </div>
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>待发: {{ getCount(sonRow.shipmentWaitNum) }}</div>
                    <div>缺货: {{ getCount(sonRow.shipmentOutOfNum) }}</div>
                  </template>
                </vxe-column>
                <vxe-column width="90">
                  <template #default="{ row: sonRow }">
                    <div>
                      <div>
                        {{ sonRow.availableStock }}/{{
                          sonRow.orderNotInNum
                        }}/{{ sonRow.lackUnPaiNum }}
                      </div>
                      <div
                        v-if="
                          sonRow.stockUpSkuGroupDtoList &&
                          sonRow.stockUpSkuGroupDtoList.length
                        "
                      >
                        <el-tooltip placement="bottom" effect="light">
                          <template #content>
                            <div class="flex-column">
                              <div class="text-bold">sku已申请采购备货</div>
                              <div
                                v-for="(
                                  item, index
                                ) in sonRow.stockUpSkuGroupDtoList"
                                :key="index"
                              >
                                <span class="mr-4">#{{ item.prodSSku }}#</span
                                >{{ item.orderStateName }}:{{
                                  item.detailCount
                                }}
                              </div>
                            </div>
                          </template>
                          <el-button type="success">备</el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column width="120">
                  <template #default="{ row: sonRow }">
                    <div class="flex-center">
                      <div>
                        {{ getCount(sonRow.todaySaleVolume) }}/{{
                          getCount(sonRow.lastSevenDaysSaleVolume)
                        }}/{{ getCount(sonRow.lastThirtyDaysSaleVolume) }}
                      </div>
                      <div>
                        <div
                          class="flex-center"
                          @click="
                            handleSaleChart(
                              sonRow.sellerSkc,
                              row.subDtoList,
                              sonRow.sellerSkuCode
                            )
                          "
                        >
                          <el-icon color="#888" size="24"
                            ><TrendCharts
                          /></el-icon>
                          <el-button link type="primary">销量趋势</el-button>
                        </div>
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <span
                      :class="{
                        color_red:
                          new Date(sonRow.lastPurchaseTime).toDateString() ===
                          new Date().toDateString()
                      }"
                      >{{ getTime(sonRow.lastPurchaseTime) }}</span
                    >
                    备货数量：{{ getCount(sonRow.lastPurchaseQuantity) }}
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>缺货: {{ getCount(sonRow.lackQuantity) }}</div>
                    <div>建议备货: {{ getCount(sonRow.adviceQuantity) }}</div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>可售: {{ getCount(sonRow.availableSaleDays) }}</div>
                    <div>
                      库存可售:
                      {{ getCount(sonRow.availableSaleDaysFromInventory) }}
                    </div>
                    <div>
                      仓内库存可售:
                      {{ getCount(sonRow.warehouseAvailableSaleDays) }}
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>
                      仓内可用: {{ getCount(sonRow.warehouseInventoryNum) }}
                    </div>
                    <div>已发货: {{ getCount(sonRow.waitReceiveNum) }}</div>
                    <div>
                      待审核备货: {{ getCount(sonRow.waitApproveInventoryNum) }}
                    </div>
                  </template>
                </vxe-column>
                <vxe-column width="110" fixed="right">
                  <template #default="{ row: sonRow }">
                    <el-button type="primary" @click="lookHandleLog(sonRow)"
                      >日志</el-button
                    >
                    <el-popconfirm
                      title="确定要删除此商品吗？将不可恢复"
                      @confirm="handleDelete(sonRow)"
                    >
                      <template #reference>
                        <el-button type="danger">删除</el-button>
                      </template>
                    </el-popconfirm>

                    <el-popconfirm
                      v-if="sonRow.wateringMark"
                      title="确定要删除此水洗唛吗？删除后将不可恢复"
                      @confirm="handleWaterDelete(sonRow)"
                    >
                      <template #reference>
                        <el-button type="danger">删除水洗唛</el-button>
                      </template>
                    </el-popconfirm>

                    <el-popconfirm
                      v-if="sonRow.englishLabel"
                      title="确定要删除此triman标签吗？删除后将不可恢复"
                      @confirm="handleLabelDelete(sonRow)"
                    >
                      <template #reference>
                        <el-button type="danger">删除triman标签</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </vxe-column>
              </vxe-table>
              <div
                v-if="row.subDtoList"
                :class="[row.subDtoList.length <= 3 ? 'hideBtn' : '']"
                @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
              >
                <a
                  v-if="row.subDtoList"
                  style="color: #409eff; text-align: center; cursor: pointer"
                  >{{ row.displayCount > 3 ? '收起' : '展开所有' }}</a
                >
              </div>
            </template>
          </vxe-column>
          <vxe-column title="销售备注" width="140px" :edit-render="{}">
            <template #default="{ row }">
              <div class="flex-center">
                <el-tooltip
                  effect="dark"
                  :content="row.salespersonRemark"
                  placement="bottom-end"
                >
                  <div class="remark_container">
                    {{ row.salespersonRemark }}
                  </div>
                </el-tooltip>
                <Edit
                  v-if="!row.salespersonRemark"
                  style="width: 18px; height: 18px"
                />
              </div>
            </template>
            <template #edit="{ row }">
              <vxe-textarea
                v-model="row.salespersonRemark"
                v-loading="row?.remarkLoading"
                :autosize="{ minRows: 1, maxRows: 10 }"
                :maxlength="1000"
                resize="vertical"
                @blur="handleChangeRemark(row)"
              ></vxe-textarea>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            background
            :page-sizes="[50, 100, 500]"
            layout="prev, pager, next,sizes, total"
            :total="total"
            :small="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
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
          v-for="item in formData.labelNameArr"
          :key="item"
          :label="item"
          @change="handleChange($event, item)"
        />
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editLabelSave()">确定</el-button>
        <el-button @click="editLabelDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editStatusDialog"
      width="25%"
      title="修改销售状态"
      align-center
      :close-on-click-modal="false"
      @close="editStatusClose"
    >
      <el-form
        ref="editStatusRef"
        :model="editStatusForm"
        size="default"
        status-icon
      >
        <el-form-item>
          <el-select
            v-model="editStatusForm.selectData"
            @change="changeEditStatus"
          >
            <el-option value="1" label="售卖" />
            <el-option value="0" label="不卖" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="editStatusForm.selectData === '0'"
          class="sales_remark_box"
          label="销售备注"
          prop="newSalespersonRemark"
          :rules="{
            required: true,
            trigger: 'blur',
            message: '请输入销售备注'
          }"
        >
          <el-input
            v-model="editStatusForm.newSalespersonRemark"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="editStatusSave(editStatusRef)"
          >确定</el-button
        >
        <el-button @click="editStatusClose()">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="editRemarkDialog"
      width="30%"
      title="修改包装备注"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="dialogForm.textarea"
        :rows="4"
        type="textarea"
        placeholder="请输入包装备注"
      />
      <template #footer>
        <el-button type="primary" @click="editRemarkSave()">确定</el-button>
        <el-button @click="editRemarkDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 货件计划 -->
    <Packupdetail
      v-if="showPackup"
      ref="packupDetailRef"
      :is-visible="showPackup"
      :data-arr="dataArr"
      :address-list="state.addressList"
      @close="handleClosePackup"
    />

    <!-- 导出 -->
    <!-- <Exportdialog
      :is-visible="showExport"
      :payments-list="paymentsList"
      :export-select="exportSelect"
      :search-form="formData"
      @close="handleCloseExport"
    /> -->

    <!-- 导出配置 -->
    <ExportConfig
      v-if="showExport"
      :show-dialog="showExport"
      config-type="'MULTIPLATFORM_PROD_TEMUPROD'"
      :checkbox-data="temuExportConfigCheckboxData"
      :checked-row-list="checkedRowList"
      :loading="loading"
      @close-dialog="handleLogRuleClose($event)"
      @export-dialog="exportDialog"
    />

    <!-- sku销量图表 -->
    <SalesChart
      v-model="showSalesChart"
      :chart-info="chartInfo"
      :current-seller-sku="currentSellerSku"
      :current-sku-list="currentSkuList"
    />

    <!-- 查看日志 -->
    <LogDialog v-model="logVisible" :current-seller-sku="currentLogSellerSku" />

    <!-- 打印食品类目 -->
    <PrintFoodCateDialog v-model="showCateDialog" />

    <!-- temu类目 -->
    <TemuCate
      v-model="showTemuCate"
      :has-cate-list="hasCateList"
      @done="selectTemuCateDone"
    />

    <!-- 申请采购备货 -->
    <PurchaseStockUp
      v-if="showPurchaseStockUp"
      :show-dialog="showPurchaseStockUp"
      :checked-id-list="checkedStockUpIdList"
      @close="closePurchaseStockUp"
      @success="successPurchaseStockUp"
    />
  </div>
</template>

<script setup name="multiplatformprodtemuprod">
  import ImagePop from '@/components/ImagePop/index.vue';
  import { nextTick, onMounted, reactive, ref, computed, watch } from 'vue';
  import axios from 'axios';

  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import {
    searchItem,
    listdict,
    getLabelList,
    batchUpdateSaleStatus,
    batchUpdateLabelName,
    batchUpdatePackDesc,
    getAddress,
    getSite,
    deleteItem,
    deleteWaterMark,
    deleteEnglishLabel,
    updateSalespersonRemarkApi,
    getSalesCountApi,
    getExportHeader
  } from '@/api/multiplatform/temuprod';
  import Packupdetail from './component/Packupdetail.vue';
  import PurchaseStockUp from './component/PurchaseStockUp.vue';
  import SalesChart from './component/SalesChart.vue';
  // import Exportdialog from './component/Exportdialog.vue';
  import useUserStore from '@/store/modules/user';
  import { parseTime, copy } from '@/utils/common';
  import ExportConfig from '@/components/ExportConfig/index.vue';
  import * as pdfjs from 'pdfjs-dist';
  import { cloneDeep } from 'lodash-es';
  import { transferDate } from '@/utils/common';
  import { shortcuts } from '@/api/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { transBlob } from '@/utils/downloadFile';
  import LogDialog from './component/LogDialog.vue';
  import PrintFoodCateDialog from './component/PrintFoodCate.vue';
  import TemuCate from './component/TemuCate.vue';
  import { ORDER_TYPE_STATUS } from './constants.js';

  // import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker';

  // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  pdfjs.GlobalWorkerOptions.workerSrc =
    '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.js';

  const dataArr = ref([]);
  const createPack = async () => {
    let checkedData = [];
    if (!innerTable.value) {
      return ElMessage.warning('请选择一条数据');
    }
    innerTable.value &&
      innerTable.value.forEach((item) => {
        if (item.getCheckboxRecords().length > 0) {
          checkedData = checkedData.concat(item.getCheckboxRecords());
        }
      });
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    // 处理选中的数据格式
    let dataInfo = {};
    checkedData.forEach((item) => {
      let { sellerSkc } = item;
      if (!dataInfo[sellerSkc]) {
        dataInfo[sellerSkc] = {
          sellerSkc,
          productName: item.productName,
          sellerSkcCode: item.sellerSkcCode,
          subDtoList: []
        };
      }
      dataInfo[sellerSkc].subDtoList.push(item);
    });
    dataArr.value = Object.values(dataInfo).map((item) => {
      item.isShowInput = false;
      item.lastPurchaseQuantityInput = item.lastPurchaseQuantity;
      return item;
    });

    showPackup.value = true;
  };

  // 点击展示父子sku销量图表
  const showSalesChart = ref(false);
  const currentSellerSku = ref('');
  const currentSkuList = ref([]);
  const chartInfo = ref({});
  const handleSaleChart = async (sellerSkc, currentList, sellerSku) => {
    currentSellerSku.value = sellerSku;
    currentSkuList.value = currentList;
    const { data } = await getSalesCountApi({
      sellerSkc
    });
    chartInfo.value = data;
    showSalesChart.value = true;
  };

  const showPackup = ref(false);
  const packupDetailRef = ref(null);

  // 关闭包装弹窗
  const handleClosePackup = () => {
    showPackup.value = false;
  };

  const state = reactive({
    // departList: [],
    salersList: [],
    storeList: [],
    addressList: []
  });

  // 获取收件地址信息
  const getAdressList = async () => {
    let params = {
      platCode: 'temu',
      alias: ''
    };
    const { code, data } = await getAddress(params);
    if (code === '0000') {
      state.addressList = data.list;
    }
  };

  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.maxMark = '';
    formData.maxCommentNum = '';
    formData.maxOnSalesDurationOffline = '';
    formData.maxAfsScore = '';
    formData.sellerSkuVal = '';
    typeForm.salesType = '';
    typeForm.salesNumLowerLimit = '';
    typeForm.salesNumUpperLimit = '';
    typeForm.skuStockType = 'warehouseInventoryNumMax';
    typeForm.skuStock = '';
    typeForm.salesDayType = 'availableSaleDaysMax';
    typeForm.salesDay = '';
  };

  const getCount = function (count) {
    if (count == undefined) {
      return '-';
    } else {
      return count;
    }
  };

  // 分页--start
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  watch(total, (newValue) => {
    return newValue;
  });

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    getPaymentsList();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    getPaymentsList();
  };
  // 分页--end
  const getTime = (time) => {
    if (!time) {
      return '';
    } else {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}');
    }
  };

  const formData = reactive({
    orgId: '', // 部门
    salesPersonId: '',
    salesPersonIdList: '', // 销售员
    storeAcctIdList: [], // 店铺storeAcctIdList
    sellerSkuKey: 'sellerSkuCodeStr',
    sellerSkuVal: '',
    salesSiteList: [], // 站点
    printCodeStr: '', // 打印条码
    title: '', // 标题
    salespersonRemark: '', // 销售备注
    prodAttrTagList: [], // 商品标签
    labelNameList: [], // 标签
    labelNameArr: [],
    saleStatusList: [-1, 1], // 销售状态 1 售卖 0 不卖 -1无 默认选择售卖+无
    packDescStatus: '', // 是否有包装备注 1有 0无 不传不筛选
    packDesc: '', // 包装备注
    wateringMarkStatus: '', // 水洗唛
    englishLabelStatus: '', // triman标签

    lastSevenDaysSaleVolumeMin: '',
    lastSevenDaysSaleVolumeMax: '', // 7日销量
    todaySaleVolumeMin: '',
    todaySaleVolumeMax: '', // 今日销量
    lastThirtyDaysSaleVolumeMin: '',
    lastThirtyDaysSaleVolumeMax: '', // 30日销量
    outOfStock: '', // 是否缺货
    warehouseInventoryStatus: '', // 库存状态
    pictureAuditStatus: '2', // 图片审核状态

    tortOrHaveTortReason: '', // 是否有侵权信息
    warehouseInventoryNumMin: '',
    warehouseInventoryNumMax: '',
    availableSaleDaysMin: '',
    availableSaleDaysMax: '', // sku 可售天数
    orderBy: '', // 排序
    hasCate: '', // 有无temu类目
    leafCateIds: [], // temu类目子节点列表
    minMark: '', // 评分
    maxMark: '',
    minCommentNum: '', // 评论
    maxCommentNum: '',
    minOnSalesDurationOffline: '', // 加入站点时长
    maxOnSalesDurationOffline: '',
    minAfsScore: '', // 品质分
    maxAfsScore: '',
    onSalesDurationOfflineType: 1,
    publishTime: [],
    minListingTime: '',
    maxListingTime: ''
  });

  const typeForm = reactive({
    salesType: '', // 销量类型
    salesNumLowerLimit: '',
    salesNumUpperLimit: '',
    skuStockType: 'warehouseInventoryNumMax',
    skuStock: '',
    salesDayType: 'availableSaleDaysMax',
    salesDay: ''
  });

  // const cIndex = ref();
  const changeTableCheckbox = () => {
    // // 获取父表格的选中项的 skc
    // let pSkc = e.row.sellerSkc;
    // // 将 skc 和子表格的 skc 进行比对 获取到子表格的索引
    // innerTable.value.forEach((item, index) => {
    //   if (item.data[0].sellerSkc === pSkc) {
    //     cIndex.value = index;
    //     innerTable.value[index].setAllCheckboxRow(e.checked);
    //   }
    // });
    // innerTable.value[e.rowIndex].setAllCheckboxRow(e.checked);
    // 选择父表格后，子表格不用勾选状态 直接获取下面所有子表格的数据
    // getAllCheckedData();
    // getAllPCheckedData();
  };
  const changeTableAllCheckbox = () => {
    // innerTable.value.forEach((item) => {
    //   item.setAllCheckboxRow(e.checked);
    // });
  };

  // 点击备注单元格编辑
  const handleChangeRemark = async (row) => {
    row.remarkLoading = true;
    try {
      const { msg } = await updateSalespersonRemarkApi({
        salespersonRemark: row.salespersonRemark,
        sellerSkc: row.sellerSkc
      });
      ElMessage.success(msg);
    } catch (err) {
      console.log('err :>> ', err);
    }
    row.remarkLoading = false;
  };

  const changeInnerTableCheckbox = () => {
    // let rowSellerSkc = e.row.sellerSkc;
    // let rowIdx;
    // paymentsList.value.forEach((item, index) => {
    //   if (item.sellerSkc === rowSellerSkc) {
    //     rowIdx = index;
    //   }
    // });
    // if (e?.records.length === e?.data.length) {
    //   // 全选
    //   tableDataRef.value[0].setCheckboxRow(paymentsList.value[rowIdx], true);
    // }
    // if (e?.records.length === 0) {
    //   // 取消全选
    //   tableDataRef.value[0].setCheckboxRow(paymentsList.value[rowIdx], false);
    // }
  };

  // 获取所有子表格选中的数据
  const getAllCheckedData = () => {
    let selectArr = [];
    innerTable.value.forEach((item) => {
      if (item.getCheckboxRecords().length > 0) {
        selectArr = selectArr.concat(item.getCheckboxRecords());
      }
    });
    return selectArr.map((item) => item.id);
  };

  // 获取父表格选中的数据 ===> 得出所有的子元素 id
  const getAllPCheckedData = () => {
    let selectPArr = [];
    let selectArr = []; // 选择的子元素
    tableDataRef.value.forEach((item) => {
      if (item.getCheckboxRecords().length > 0) {
        selectPArr = selectPArr.concat(item.getCheckboxRecords());
      }
    });
    let selectPArrSellerSkcs =
      selectPArr && selectPArr.map((item) => item.sellerSkc);
    paymentsList.value.forEach((item) => {
      if (selectPArrSellerSkcs.includes(item.sellerSkc)) {
        selectArr.push(...item.subDtoList);
      }
    });
    // 根据选中的 id 来获取全部的子元素
    return selectArr.map((item) => item.id);
  };

  const tableDataRef = ref();
  const innerTable = ref();

  // 获取checkbox
  const handleFormChange = (e, data) => {
    if (e) {
      formData.labelNameList.push(data);
    } else {
      formData.labelNameList = formData.labelNameList.filter(
        (item) => item != data
      );
    }
  };

  // 切换有无站点时长
  const changeOnSalesDurationOfflineType = () => {
    formData.minOnSalesDurationOffline = '';
    formData.maxOnSalesDurationOffline = '';
  };

  // 添加商品模板
  const downloadExcel = async (type) => {
    let filename = '';
    if (type == '0') {
      filename = '添加商品模板.xlsx';
    } else if (type == '1') {
      filename = '货件计划模板.xlsx';
    }
    axios({
      method: 'POST',
      url: '/api/lms/temu/fbm/downloadExcelTemplate',
      data: filename,
      headers: {
        'Content-Type': 'text/plain'
      },
      responseType: 'blob',
      dataType: 'json'
    })
      .then((res) => {
        if (res.statusText == 'OK') {
          const xlsx = 'application/vnd.ms-excel';
          const blob = new Blob([res.data], { type: xlsx }); //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          a.download = filename;
          a.href = window.URL.createObjectURL(blob);
          a.click();
          a.remove();
        }
      })
      .catch((err) => {
        console.log(err);
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
  const paymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: [],
    siteList: []
  });
  const salersDataCopy = ref([]);

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  const height = ref(400);
  const searchCardRef = ref();

  const calculateTableHeight = () => {
    const searchCardHeight = searchCardRef.value.$el.clientHeight;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    height.value = clientHeight - searchCardHeight - 180;
  };

  const prodAttrTagArrOption = ref([]);
  onMounted(async () => {
    calculateTableHeight();
    getAdressList();
    getDepartmentList();
    getStoreList();
    getSiteList();
    {
      // 获取商品标签
      const { data } = await listdict();
      prodAttrTagArrOption.value = data;
    }
    {
      // 另一个标签
      const { data } = await getLabelList();
      formData.labelNameArr = data.map((item) => item.name);
    }
  });

  const handleSearchData = () => {
    formData.todaySaleVolumeMin = '';
    formData.todaySaleVolumeMax = '';
    formData.lastSevenDaysSaleVolumeMin = '';
    formData.lastSevenDaysSaleVolumeMax = '';
    formData.lastThirtyDaysSaleVolumeMin = '';
    formData.lastThirtyDaysSaleVolumeMax = '';
    let { salesType, salesNumLowerLimit, salesNumUpperLimit } = typeForm;
    // 今日销量
    if (salesType === '1') {
      formData.todaySaleVolumeMin = salesNumLowerLimit;
      formData.todaySaleVolumeMax = salesNumUpperLimit;
    }
    // 7日销量
    if (salesType === '7') {
      formData.lastSevenDaysSaleVolumeMin = salesNumLowerLimit;
      formData.lastSevenDaysSaleVolumeMax = salesNumUpperLimit;
    }
    // 30日销量
    if (salesType === '30') {
      formData.lastThirtyDaysSaleVolumeMin = salesNumLowerLimit;
      formData.lastThirtyDaysSaleVolumeMax = salesNumUpperLimit;
    }
  };

  const getPaymentsList = async () => {
    formData.page = currentPage.value;
    formData.limit = pageSize.value;
    formData.sellerSkuStr = ''; // 平台sku
    formData.sellerSkuCodeStr = ''; // 平台sku货号
    formData.sellerSkcStr = ''; //平台skc
    formData.sellerSkcCodeStr = ''; // 平台skc货号
    formData.warehouseInventoryNumMin = ''; // sku 剩余库存
    formData.warehouseInventoryNumMax = '';
    formData.availableSaleDaysMin = ''; // sku 可售天数
    formData.availableSaleDaysMax = '';
    // 刊登时间
    if (formData.publishTime && formData.publishTime.length) {
      const [startTime, endTime] = formData.publishTime;
      formData.minListingTime = startTime;
      formData.maxListingTime = endTime;
    }
    handleSearchData();
    try {
      loading.value = true;
      formData.sellerSkuKey
        ? (formData[formData.sellerSkuKey] = formData.sellerSkuVal)
        : '';
      typeForm.skuStockType
        ? (formData[typeForm.skuStockType] = typeForm.skuStock)
        : '';
      typeForm.salesDayType
        ? (formData[typeForm.salesDayType] = typeForm.salesDay)
        : '';
      formData.salesPersonIdList =
        formData.salesPersonId == '' ? [] : [formData.salesPersonId];
      const { data, code, count } = await searchItem(formData);
      if (code == '0000' && data?.length != 0) {
        // paymentsList.value = data;
        paymentsList.value = data.map((item) => {
          item.displayCount = 3;
          item.remarkLoading = false;
          item.salespersonRemark = item.salespersonRemark?.replace(
            /<br>/g,
            '\n'
          );
          return item;
        });
      } else {
        paymentsList.value = [];
      }
      tableDataRef.value &&
        tableDataRef.value.forEach((item) => {
          item.clearCheckboxRow();
        });
      innerTable.value &&
        innerTable.value.forEach((item) => {
          item.clearCheckboxRow();
        });
      total.value = count;
      loading.value = false;
    } catch (err) {
      console.log(err);
    }
  };

  // 查看全部时，将所有都给到
  const viewAll = (row) => {
    row.displayCount = row.subDtoList.length;
  };

  // 收起多出部分时，只取前3条
  const hideList = (row) => {
    row.displayCount = 3;
  };

  const getStatus = (status) => {
    if (!status) {
      return '-';
    }
    const obj = {
      1: '未完成',
      2: '已完成'
    };
    return obj[status];
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    try {
      let params = {
        roleNames: 'temu专员'
      };
      const { data } = await getDepartData(params);
      selectData.departData = data.orgTree;
      selectData.salersData = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'temu专员',
        orgId: formData.orgId,
        salePersonId: formData.salesPersonId,
        platCode: 'temu',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取站点信息
  const getSiteList = async () => {
    try {
      let params = {
        platCode: 'temu'
      };
      const { data } = await getSite(params);
      selectData.siteList = data;
    } catch (err) {
      console.log(err);
    }
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
    formData.storeAcctId = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salesPersonIdList = '';
    formData.salesPersonId = '';
    formData.storeAcctId = [];
    getStoreList();
  };

  // 设置标签 --start--
  const editLabelDialog = ref(false);
  const editLabelForm = ref([]);

  // 打开
  const editLabel = () => {
    let selectIds = getAllCheckedData();
    let selectPIds = getAllPCheckedData();
    if (selectIds?.length == 0 && selectPIds?.length === 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    editLabelDialog.value = true;
  };
  // 获取checkbox
  const handleChange = (e, item) => {
    if (e) {
      editLabelForm.value.push(item);
    } else {
      editLabelForm.value = editLabelForm.value.filter(
        (newItem) => newItem != item
      );
    }
  };

  // 计算最终选中的 数据
  const judgeData = () => {
    let selectPIds = getAllPCheckedData();
    let selectIds = getAllCheckedData();
    let resultId = [];
    if (selectPIds?.length === 0) {
      // 没有选择父节点
      resultId = selectIds;
    }
    if (selectPIds?.length > 0) {
      // 选择了父节点
      if (selectIds?.length === 0) {
        // 没有选择子节点
        resultId = selectPIds;
      }
      if (selectIds?.length > 0) {
        // 选择了子节点
        // 判断子节点是否在选中的父节点的所有子节点中 两个数组并集
        resultId = selectPIds.concat(
          selectIds.filter(function (item) {
            return !(selectPIds.indexOf(item) > -1);
          })
        );
      }
    }
    return resultId;
  };
  // 保存
  const editLabelSave = async () => {
    let selectIds = judgeData();
    const { code, msg } = await batchUpdateLabelName({
      temuFbmItemIdList: selectIds,
      newLabelName: editLabelForm.value.join(',')
    });
    if (code == '0000') {
      editLabelDialog.value = false;
      ElMessage.success(msg);
    }
  };
  // 设置标签 --end--

  // 修改销售状态 --start--
  const editStatusDialog = ref(false);
  const editStatusForm = ref({
    selectData: '',
    newSalespersonRemark: ''
  });
  // 打开
  const editStatus = () => {
    let selectPIds = getAllPCheckedData();
    let selectIds = getAllCheckedData();
    if (selectIds?.length == 0 && selectPIds?.length === 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    editStatusDialog.value = true;
  };

  const editStatusRef = ref(null);

  // 切换售卖方式 清空备注
  const changeEditStatus = () => {
    editStatusForm.value.newSalespersonRemark = '';
  };

  // // 保存
  const editStatusSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        if (editStatusForm.value.selectData == '') {
          ElMessage.warning('请选择销售状态');
          return;
        }
        let selectIds = judgeData();
        // 销售备注传参
        const params =
          editStatusForm.value.selectData === '0'
            ? {
                newSalespersonRemark: editStatusForm.value.newSalespersonRemark
              }
            : {};
        const { code, msg } = await batchUpdateSaleStatus({
          temuFbmItemIdList: selectIds,
          newSaleStatus: editStatusForm.value.selectData,
          ...params
        });
        if (code == '0000') {
          editStatusDialog.value = false;
          ElMessage.success(msg);
        }
      }
    });
  };

  // 关闭批量修改销售备注弹窗
  const editStatusClose = () => {
    editStatusDialog.value = false;
    editStatusForm.value.selectData = '';
    editStatusForm.value.newSalespersonRemark = '';
  };
  // 修改销售状态 --end--
  // 修改包装备注
  const editRemarkDialog = ref(false);
  const dialogForm = ref({
    textarea: ''
  });
  const editRemark = () => {
    let selectPIds = getAllPCheckedData();
    let selectIds = getAllCheckedData();
    if (selectIds?.length == 0 && selectPIds?.length === 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    dialogForm.value.textarea = '';
    editRemarkDialog.value = true;
  };
  // 保存
  const editRemarkSave = async () => {
    let selectIds = judgeData();
    const { code, msg } = await batchUpdatePackDesc({
      temuFbmItemIdList: selectIds,
      newPackDesc: dialogForm.value.textarea
    });
    if (code == '0000') {
      editRemarkDialog.value = false;
      ElMessage.success(msg);
      getPaymentsList();
    }
  };
  // 修改销售状态 --end--
  const getSelectedList = () => {
    let selectPIds = getAllPCheckedData();
    let selectIds = getAllCheckedData();
    if (selectIds?.length == 0 && selectPIds?.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    } else {
      return true;
    }
  };

  const showExport = ref(false);
  // #region导出
  const checkedRowList = ref([]);
  const temuExportConfigCheckboxData = ref();
  const handleExportConfig = async () => {
    // 配置弹窗
    try {
      const { data } = await getExportHeader();
      let obj = [];
      for (let key in data) {
        if (key == 'product') {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            disabled: ['storeAcct', 'sellerSkc'],
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        } else if (key == 'variation') {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            disabled: ['printCode', 'sellerSku'],
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        } else {
          obj.push({
            label: key + '字段',
            field: key,
            isChecked: true,
            checkedData: [],
            children: [{ label: '', field: '', children: data[key] }]
          });
        }
      }
      temuExportConfigCheckboxData.value = obj;
      showExport.value = true;
      const checkedList = tableDataRef.value[0].getCheckboxRecords();
      checkedRowList.value = cloneDeep(checkedList);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleLogRuleClose = (e) => {
    temuExportConfigCheckboxData.value = [];
    showExport.value = e.isShow;
  };

  const exportLoading = ref(false);
  // 点击导出
  const exportDialog = (e) => {
    let obj = {};
    if (e.checkedType == '导出列表选中数据') {
      const checkedList = tableDataRef.value[0].getCheckboxRecords();
      if (checkedList.length == 0) {
        ElMessage.warning('没有在列表中选中数据，请检查后提交！');
        return false;
      }
      obj.sellerSkcList = checkedList.map((item) => item.sellerSkc);
    } else if (e.checkedType == '导出查询条件中的数据') {
      obj = formData;
    }
    e.data.forEach(
      (item) => (obj[`${item.field}ExportFields`] = item.checkedData)
    );

    exportLoading.value = true;
    transBlob({
      fileName: 'temu在线导出listing数据文件.xlsx',
      url: '/lms/temu/fbm/exportList',
      data: obj,
      contentType: 'application/json'
    }).then(() => {
      exportLoading.value = false;
      ElMessage.success('操作成功');
    });
  };
  // #endregion广告导出

  // 申请采购备货
  const showPurchaseStockUp = ref(false);
  const checkedStockUpIdList = ref([]);
  const handlePurchaseStockUp = () => {
    if (!innerTable.value) {
      return ElMessage.warning('请选择数据！');
    }
    checkedStockUpIdList.value = judgeData();
    if (checkedStockUpIdList.value.length == 0) {
      ElMessage.warning('请选择数据！');
      return;
    }
    showPurchaseStockUp.value = true;
  };

  // 采购备货成功
  const successPurchaseStockUp = () => {
    showPurchaseStockUp.value = false;
    getPaymentsList();
  };

  // 关闭采购备货弹窗
  const closePurchaseStockUp = () => {
    showPurchaseStockUp.value = false;
  };

  //  #region打印食品标类目
  const showCateDialog = ref(false);
  const handlePrintFoodCate = () => {
    showCateDialog.value = true;
  };
  // #endregion打印食品标类目

  // 搜索条件选择temu类目
  const hasCateList = ref([]);
  const showTemuCate = ref(false);
  const handleChooseCate = () => {
    if (formData.leafCateIds.length) {
      hasCateList.value = formData.leafCateIds;
    } else {
      hasCateList.value = [];
    }
    showTemuCate.value = true;
  };

  // 点击确认
  const selectTemuCateDone = (obj) => {
    formData.leafCateIds = obj.arr;
  };

  // 清空temu类目
  const handleDelCate = () => {
    formData.leafCateIds = [];
    hasCateList.value = [];
    ElMessage.success('已删除已选temu分类！');
  };
  const handleUploadWaterMark = (rawFile) => {
    if (getSelectedList()) {
      let selectIds = judgeData();
      const fd = new FormData();
      fd.append('pdf', rawFile.file);
      fd.append('idList', selectIds);
      axios({
        method: 'post',
        url: `/api/lms/temu/fbm/uploadWateringMark`,
        data: fd
      })
        .then((res) => {
          if (res.data.code === '0000') {
            ElMessage.success('上传水洗唛成功！');
            getPaymentsList();
          } else {
            ElMessage.error(res.data.msg || '上传失败');
          }
        })
        .catch(() => {
          ElMessage.error('上传失败');
        });
    }
  };

  const uploadEnLabel = (rawFile) => {
    if (getSelectedList()) {
      let selectIds = judgeData();
      const fd = new FormData();
      fd.append('pdf', rawFile.file);
      fd.append('idList', selectIds);
      axios({
        method: 'post',
        url: `/api/lms/temu/fbm/uploadEnglishLabel`,
        data: fd
      })
        .then((res) => {
          if (res.data.code === '0000') {
            ElMessage.success('上传triman标签成功！');
            getPaymentsList();
          } else {
            ElMessage.error(res.data.msg || '上传失败');
          }
        })
        .catch(() => {
          ElMessage.error('上传失败');
        });
    }
  };

  // 导入新增
  const uploadSuccess = (res) => {
    ElMessageBox.alert(
      `<div style="width: 400px;overflow: hidden;overflow-wrap: break-word;">${res.msg}</div>`,
      '操作结果',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '取消'
      }
    );
  };
  const uploadError = () => {
    ElMessage.error('请在左边选择需要上传的模板类型');
  };

  // 查看日志
  const logVisible = ref(false);
  const currentLogSellerSku = ref('');
  const lookHandleLog = (row) => {
    currentLogSellerSku.value = row.sellerSku;
    logVisible.value = true;
  };

  // 删除商品
  const handleDelete = async (row) => {
    try {
      const { code } = await deleteItem([row.id]);
      if (code === '0000') {
        ElMessage.success('删除成功！');
        getPaymentsList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 删除水洗唛
  const handleWaterDelete = (row = '') => {
    if (!row) {
      if (getSelectedList()) {
        let selectIds = judgeData();
        ElMessageBox.confirm('确定要删除水洗唛吗？删除后将不可恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteWaterMarkFn(selectIds);
          })
          .catch(() => {});
      }
    } else {
      deleteWaterMarkFn([row.id]);
    }
  };

  const deleteWaterMarkFn = async (list) => {
    try {
      loading.value = true;
      const { code } = await deleteWaterMark(list);
      if (code === '0000') {
        ElMessage.success('删除成功！');
        getPaymentsList();
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 删除triman标签
  const handleLabelDelete = (row) => {
    if (!row) {
      if (getSelectedList()) {
        let selectIds = judgeData();
        ElMessageBox.confirm(
          '确定要删除triman标签吗？删除后将不可恢复',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            deleteEnglishLableFn(selectIds);
          })
          .catch(() => {});
      }
    } else {
      deleteEnglishLableFn([row.id]);
    }
  };

  const deleteEnglishLableFn = async (list) => {
    try {
      loading.value = true;
      const { code } = await deleteEnglishLabel(list);
      if (code === '0000') {
        ElMessage.success('删除成功！');
        getPaymentsList();
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  // 预览pdf
  const openPDFPreview = (padfUrl, canvasEl) => {
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
  const downloadPdf = (url, name) => {
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
  .flexBetween {
    display: flex;
    justify-content: space-between;
  }
  .color_red {
    color: red;
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
  .temu_thead {
    flex: 1;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .flex-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .tag-item {
    margin: 0 4px 4px 0;
  }
  .tort_info {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-left: 2px;
  }
  .mt-8 {
    margin-top: 8px;
  }
  .text-bold {
    font-weight: bold;
  }
  .mt-5 {
    margin-top: 5px;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .remark_container {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mx-4 {
    margin: 0 4px;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .sales_remark_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    :deep(.el-form-item__content) {
      width: 100%;
    }
  }
  .w-8 {
    width: 8px;
  }
</style>
<style lang="scss">
  .custom_pop {
    min-width: 300px !important;
    width: auto !important;
  }
  :deep(.vxe-header--row .col--last .vxe-cell span) {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 0 5px;
  }
</style>
