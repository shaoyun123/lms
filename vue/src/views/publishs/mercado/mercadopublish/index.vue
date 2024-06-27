<template>
  <!-- 美科多刊登页面 -->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="mercadoData.formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="部门">
          <el-tree-select
            v-model="mercadoData.formData.orgId"
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
        <el-form-item label="销售员">
          <el-select
            v-model="mercadoData.formData.salePersonId"
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
        <el-form-item label="店铺">
          <el-select
            v-model="mercadoData.formData.storeAcctId"
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
        <el-form-item
          v-if="activeName == '商品'"
          label="OA新类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="mercadoData.formData.cateName"
            :options="mercadoData.initFormData.oaList"
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
        <el-form-item
          v-if="activeName == '商品'"
          label="开发类型"
          prop="devType"
        >
          <el-select
            v-model="mercadoData.formData.devType"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in mercadoData.initFormData.devTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          label="商品标签"
          prop="prodAttrList"
        >
          <el-select
            v-model="mercadoData.formData.prodAttrList"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in mercadoData.initFormData.prodAttrList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          label="物流属性"
          prop="logisAttrList"
        >
          <el-select
            v-model="mercadoData.formData.logisAttrList"
            placeholder="请选择"
            :class="
              mercadoData.formData.logisAttrList.length > 1 ? 'hideTag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="mercadoData.formData.logisAttrList.length > 1"
                type="info"
                >已选{{ mercadoData.formData.logisAttrList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in mercadoData.initFormData.logisAttr"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          label="开发专员"
          prop="bizzOwnerIds"
        >
          <el-select
            v-model="mercadoData.formData.bizzOwnerIds"
            placeholder="请选择"
            :class="
              mercadoData.formData.bizzOwnerIds.length > 1 ? 'hideTag' : ''
            "
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="mercadoData.formData.bizzOwnerIds.length > 1"
                type="info"
                >已选{{ mercadoData.formData.bizzOwnerIds.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in mercadoData.initFormData.bizzOwnerIds"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="isSaleList">
          <el-select
            v-model="mercadoData.formData.isSaleList"
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="0"
            clearable
            multiple
          >
            <el-option :value="2" label="全部在售" />
            <el-option :value="1" label="部分在售" />
            <el-option :value="0" label="全部停售" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          label="商品类型"
          prop="multiSub"
        >
          <el-select v-model="mercadoData.formData.multiSub">
            <el-option value="" label="全部" />
            <el-option value="false" label="单属性" />
            <el-option value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="生成情况"
          prop="isGeneral"
        >
          <el-select v-model="mercadoData.formData.isGeneral">
            <el-option value="" label="全部" />
            <el-option value="false" label="未生成" />
            <el-option value="true" label="已生成" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item
          v-if="activeName != '商品'"
          label="平台类目"
          prop="mercateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="mercadoData.formData.mercateName"
            :options="mercadoData.initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              value: 'categoryId',
              children: 'childList'
            }"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item prop="tortBanListing" label="侵权状态"
          ><el-select
            v-model="mercadoData.formData.tortBanListing"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="所有平台不侵权" value="ANY_PLAT" />
            <el-option label="mercado不侵权" value="CURRENT_PLAT_NO_TORT" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="mercadoData.formData.timeType" class="form_left">
            <el-option value="CREATE_TIME" label="创建时间" />
            <el-option
              v-if="activeName == '商品' || activeName == '待刊登'"
              value="AUDIT_TIME"
              label="审核时间"
            />
            <el-option
              v-if="activeName != '商品'"
              value="GENERAL_TIME"
              label="生成时间"
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
            v-model="mercadoData.formData.time"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          />
        </el-form-item>
        <el-form-item prop="canSaleBool" label="是否禁售"
          ><el-select v-model="mercadoData.formData.canSaleBool">
            <el-option value="false" label="非禁售" />
            <el-option value="true" label="禁售" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          prop="modelCreatorId"
          label="模板创建人"
        >
          <el-select
            v-model="mercadoData.formData.modelCreatorId"
            filterable
            clearable
          >
            <el-option
              v-for="item in mercadoData.initFormData.modelCreatorId"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select
        ></el-form-item>
        <el-form-item v-else prop="creators" label="创建人">
          <el-select
            v-model="mercadoData.formData.creators"
            placeholder="请选择"
            :class="mercadoData.formData.creators.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="mercadoData.formData.creators.length > 1"
                type="info"
                >已选{{ mercadoData.formData.creators.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in mercadoData.initFormData.creators"
              :key="item"
              :label="item"
              :value="item"
            /> </el-select
        ></el-form-item>
        <el-form-item prop="searchSkuType">
          <el-select
            v-model="mercadoData.formData.searchSkuType"
            class="form_left"
          >
            <el-option value="pSku" label="父SKU" />
            <el-option value="sSku" label="模板子SKU" />
            <el-option value="cnTitle" label="商品中文" />
            <el-option value="enTitle" label="商品英文" />
          </el-select>
          <el-input
            v-model="mercadoData.formData.skuList"
            placeholder="多个逗号隔开"
            style="width: 270px !important"
            class="form_left form_right"
          />
          <el-select
            v-model="mercadoData.formData.vagueSearch"
            class="form_right WH80"
          >
            <el-option value="false" label="精确" />
            <el-option value="true" label="模糊" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          prop="searchSalesType"
          class="form_range"
        >
          <el-select
            v-model="mercadoData.formData.searchSalesType"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="7日销量" value="1"></el-option>
            <el-option label="15日销量" value="2"></el-option>
            <el-option label="30日销量" value="3"></el-option>
          </el-select>
          <el-input
            v-model="mercadoData.formData.salesMin"
            placeholder=">="
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="mercadoData.formData.salesMax"
            placeholder="<="
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName == '刊登失败'"
          prop="listingFailType"
          label="失败类型"
          ><el-select v-model="mercadoData.formData.listingFailType" clearable>
            <el-option :value="1" label="创建失败" />
            <el-option :value="2" label="推送失败" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '刊登失败'"
          prop="errorMessage"
          label="错误查询"
        >
          <el-input
            v-model="mercadoData.formData.errorMessage"
            placeholder="错误信息"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品' || activeName == '待刊登'"
          prop="salesSite"
          ><el-select
            v-model="mercadoData.formData.salesSite"
            class="form_left"
            placeholder="站点"
            :class="mercadoData.formData.salesSite.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="mercadoData.formData.salesSite.length > 1"
                type="info"
                >已选{{ mercadoData.formData.salesSite.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in mercadoData.initFormData.saleSite"
              :key="item"
              :label="item"
              :value="item"
            /> </el-select
          ><el-select
            v-model="mercadoData.formData.isListing"
            class="form_right"
            clearable
            placeholder="刊登情况"
          >
            <el-option value="true" label="已刊登" />
            <el-option value="false" label="未刊登" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          prop="isComplete"
          label="变种属性状态"
          ><el-select v-model="mercadoData.formData.isComplete" clearable>
            <el-option value="1" label="完整" />
            <el-option value="0" label="不完整" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item prop="salesSort" label="排序方式">
          <el-select
            v-model="mercadoData.formData.salesSort"
            placeholder="请选择"
            clearable
            filterable
            @change="
              mercadoData.formData.salesSort == 9 ||
              mercadoData.formData.salesSort == 10 ||
              mercadoData.formData.salesSort == 11
                ? (mercadoData.formData.orderType = '14')
                : ''
            "
          >
            <el-option
              v-if="activeName == '刊登中'"
              label="定时刊登时间"
              value="1"
            ></el-option>
            <el-option
              v-if="activeName == '商品'"
              label="美客多模板创建时间"
              value="2"
            ></el-option>
            <el-option
              v-if="activeName != '商品'"
              label="生成店铺商品时间"
              value="3"
            ></el-option>
            <el-option
              v-if="activeName == '商品' || activeName == '待刊登'"
              label="基础模板审核时间"
              value="4"
            ></el-option>
            <el-option
              v-if="
                activeName == '商品' ||
                activeName == '待刊登' ||
                activeName == '刊登失败'
              "
              label="全平台30天MX销量"
              value="MX"
            ></el-option>
            <el-option
              v-if="
                activeName == '商品' ||
                activeName == '待刊登' ||
                activeName == '刊登失败'
              "
              label="全平台30天BR销量"
              value="BR"
            ></el-option>
            <el-option
              v-if="
                activeName == '商品' ||
                activeName == '待刊登' ||
                activeName == '刊登失败'
              "
              label="全平台30天CL销量"
              value="CL"
            ></el-option>
            <el-option
              v-if="
                activeName == '商品' ||
                activeName == '待刊登' ||
                activeName == '刊登失败'
              "
              label="全平台30天CO销量"
              value="CO"
            ></el-option>
            <el-option label="30天销量" value="11"></el-option>
            <el-option label="15天销量" value="10"></el-option>
            <el-option label="7天销量" value="9"></el-option>
          </el-select>
          <el-select v-model="mercadoData.formData.orderType">
            <el-option
              v-if="
                !(
                  mercadoData.formData.salesSort == 9 ||
                  mercadoData.formData.salesSort == 10 ||
                  mercadoData.formData.salesSort == 11
                )
              "
              label="正序"
              value="15"
            ></el-option>
            <el-option label="倒序" value="14"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          class="form_range"
          prop="priceMin"
          label="成本"
        >
          <el-input
            v-model="mercadoData.formData.priceMin"
            placeholder="￥"
            clearable
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="mercadoData.formData.priceMax"
            placeholder="￥"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          class="form_range"
          prop="weightMin"
          label="重量(g)"
        >
          <el-input
            v-model="mercadoData.formData.weightMin"
            clearable
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="mercadoData.formData.weightMax"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName == '商品'"
          prop="preStockType"
          class="form_range"
        >
          <el-select
            v-model="mercadoData.formData.preStockType"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="预计可用含在途" value="1"></el-option>
            <el-option label="预计可用不含在途" value="2"></el-option>
          </el-select>
          <el-input
            v-model="mercadoData.formData.preStockMin"
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="mercadoData.formData.preStockMax"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- <span style="font-size: 12px">{{ mercadoData.formData.cateName }}</span> -->
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="name in tabsName"
          :key="name"
          :label="name"
          :name="name"
        >
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :scroll-y="{ gt: 10 }"
            :element-loading-text="loadingText"
            :height="height"
            border
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="图片" width="100">
              <template #default="{ row }">
                <ImagePop :src="row.pImg || ''" />
              </template>
            </vxe-column>
            <vxe-column field="enTitle" title="英文标题" />
            <vxe-column field="bizzOwner" title="商品名/开发专员" width="180">
              <template #default="{ row }">
                商品名：{{ row.cnTitle }}<br />
                开发专员：{{ row.bizzOwner }}
              </template>
            </vxe-column>
            <vxe-column title="全平台销量" width="130">
              <template #default="{ row }">
                7天：{{ row.saleNumMercadoSeven }}<br />
                15天：{{ row.saleNumMercadoFifteen }}<br />
                30天：{{ row.saleNumMercadoThirty }}
              </template>
            </vxe-column>
            <vxe-column
              v-if="
                activeName == '商品' ||
                activeName == '待刊登' ||
                activeName == '刊登失败'
              "
              title="全平台BR/CL/MX/CO销量"
              width="130"
            >
              <template #default="{ row }">
                7天：{{ row.saleNumBRSeven }}/{{ row.saleNumCLSeven }}/{{
                  row.saleNumMXSeven
                }}/{{ row.saleNumCOSeven }}<br />
                15天：{{ row.saleNumBRFifteen }}/{{ row.saleNumCLFifteen }}/{{
                  row.saleNumMXFifteen
                }}/{{ row.saleNumCOFifteen }}<br />
                30天：{{ row.saleNumBRThirty }}/{{ row.saleNumCLThirty }}/{{
                  row.saleNumMXThirty
                }}/{{ row.saleNumCOThirty }}
              </template>
            </vxe-column>
            <vxe-column field="pSku" title="父SKU" width="200">
              <template #default="{ row }">
                <!-- row.prodPId 71725-->
                <div @click="openPskuDetails(row.prodPId)">
                  商品父SKU:<span style="color: #409eff">{{ row.pSku }}</span>
                </div>
                店铺父SKU:{{ row.storePSku
                }}<el-popover
                  v-if="activeName == '刊登失败' && row.listingRespMsg"
                  placement="top-start"
                  trigger="hover"
                  :content="row.listingRespMsg"
                  :width="500"
                >
                  <template #reference>
                    <el-tag
                      v-if="activeName == '刊登失败' && row.cbtItemId"
                      type="info"
                      effect="dark"
                      >推送失败</el-tag
                    ><el-tag
                      v-if="activeName == '刊登失败' && !row.cbtItemId"
                      type="info"
                      effect="dark"
                      >创建失败</el-tag
                    >
                  </template>
                </el-popover>
                <div v-if="activeName != '商品' && activeName != '待刊登'">
                  刊登站点:{{ row.globalSites }}
                </div>
                <div
                  v-if="
                    activeName == '商品' ||
                    activeName == '待刊登' ||
                    activeName == '刊登失败'
                  "
                >
                  禁售站点:{{
                    row.prohibitSites && row.prohibitSites.length != 0
                      ? row.prohibitSites.join(',')
                      : ''
                  }}
                </div>
                <div
                  v-if="
                    activeName == '商品' ||
                    activeName == '待刊登' ||
                    activeName == '刊登成功' ||
                    activeName == '刊登失败'
                  "
                >
                  已刊登站点:{{ row.alreadyListingSites || '' }}
                </div>
              </template>
            </vxe-column>
            <vxe-column :width="activeName == '商品' ? 500 : 420">
              <template #header>
                <div style="display: flex; justify-content: space-around">
                  <div style="width: 100px">模板子SKU</div>
                  <div>店铺子SKU</div>
                  <div>颜色</div>
                  <div>尺寸</div>
                  <div>在售</div>
                  <div v-if="activeName == '商品'" style="width: 50px">
                    预计可用库存含在途/不含在途
                  </div>
                </div>
              </template>
              <template #default="{ row }">
                <vxe-table
                  :data="
                    row.sInfoList && row.sInfoList.slice(0, row.displayCount)
                  "
                  :show-header="false"
                >
                  <vxe-column field="sSku" width="120">
                    <template #default="{ row: sonRow }">
                      {{ sonRow.sSku }}
                      <el-tag v-if="activeName == '刊登成功'" effect="dark"
                        >已</el-tag
                      >
                    </template>
                  </vxe-column>
                  <vxe-column field="storeSSku" width="120" />
                  <vxe-column field="color" />
                  <vxe-column field="size" />
                  <vxe-column field="isSale" width="40"
                    ><template #default="{ row: sonRow }">{{
                      sonRow.isSale ? '是' : '否'
                    }}</template>
                  </vxe-column>
                  <vxe-column v-if="activeName == '商品'">
                    <template #default="{ row: sonRow }">{{
                      (sonRow.preAvailableStockAll || 0) +
                      '/' +
                      (sonRow.preAvailableStock || 0)
                    }}</template>
                  </vxe-column>
                </vxe-table>
                <div
                  v-if="row.sInfoList"
                  :class="[row.sInfoList.length <= 3 ? 'hideBtn' : '']"
                  @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
                >
                  <a v-if="row.sInfoList" style="color: #409eff">{{
                    row.displayCount > 3 ? '收起' : '展开所有'
                  }}</a>
                </div>
              </template></vxe-column
            >

            <vxe-column
              v-if="
                ['待刊登', '刊登中', '刊登成功', '刊登失败'].indexOf(
                  activeName
                ) != -1
              "
              title="售价(USD)"
              width="90"
            >
              <template #default="{ row }"
                >MX: {{ row.sInfoList && row.sInfoList[0].mlmRetailPrice
                }}<br />BR: {{ row.sInfoList && row.sInfoList[0].mlbRetailPrice
                }}<br />CL: {{ row.sInfoList && row.sInfoList[0].mlcRetailPrice
                }}<br />CO: {{ row.sInfoList && row.sInfoList[0].mcoRetailPrice
                }}<br />CBT:
                {{ row.sInfoList && row.sInfoList[0].cbtRetailPrice }}
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeName != '商品'"
              field="creator"
              title="创建人"
              width="80"
            />
            <vxe-column field="fullCateName" title="美客多类目" />
            <vxe-column title="时间" width="170">
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
                  }}
                </div>
                <div
                  v-if="
                    activeName == '待刊登' ||
                    activeName == '刊登中' ||
                    activeName == '刊登成功' ||
                    activeName == '刊登失败'
                  "
                >
                  创建：{{
                    row.createTime
                      ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
                <div
                  v-if="
                    activeName == '待刊登' ||
                    activeName == '刊登中' ||
                    activeName == '刊登成功' ||
                    activeName == '刊登失败'
                  "
                >
                  生成：{{
                    row.generalTime
                      ? parseTime(row.generalTime, '{y}-{m}-{d} {h}:{i}')
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
                  刊登：{{
                    row.listingTime
                      ? parseTime(row.listingTime, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
                <div v-if="activeName == '刊登中' && row.listTiming">
                  定时刊登开始时间:<br />
                  {{
                    row.listTiming
                      ? parseTime(row.listTiming, '{y}-{m}-{d} {h}:{i}')
                      : ''
                  }}
                </div>
              </template></vxe-column
            >
            <!-- v-if="activeName != '商品'" -->
            <vxe-column v-if="activeName != '商品'" title="操作" width="70">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  @click="getDetail(row.id, row.prodPId)"
                  >详情</el-button
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
      <div class="tools_btn">
        <el-button
          v-permission="['mercadoPublishWeight']"
          type="primary"
          @click="getPublishWeight"
          >设置刊登重量</el-button
        >
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
            <el-dropdown-item @click="publishNow('定时')">
              定时刊登
            </el-dropdown-item>
            <el-dropdown-item @click="singlePublishNow">
              单个立即刊登
            </el-dropdown-item>
          </template>
        </el-dropdown>
        <el-button
          v-if="activeName == '刊登中'"
          type="primary"
          @click="cancelRepublish"
          >取消定时刊登</el-button
        >
        <el-button
          v-if="activeName == '刊登失败'"
          type="primary"
          :disabled="publishLoad"
          @click="republish"
          >重新发布</el-button
        >
        <el-button
          v-if="activeName == '刊登成功' || activeName == '刊登失败'"
          type="primary"
          @click="gotopublish"
          >转待刊登</el-button
        >
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :cate-search-value="mercadoData.formData.cateSearchValue"
      :handle-cate-dialog-type="'oa'"
      @close-dialog="handleCateDialogClose($event)"
    />
    <!-- 转待刊登 -->
    <el-dialog
      v-model="showDialogGotoPublish"
      width="20%"
      title="商品转待刊登"
      :close-on-click-modal="false"
    >
      <el-form size="default" status-icon :label-width="180"
        ><el-radio-group v-model="gotoPublishRadio">
          <el-radio value="1" size="large">按照搜索结果执行转待刊登</el-radio>
          <el-radio value="2" size="large"
            >按照列表选中商品执行转待刊登</el-radio
          ></el-radio-group
        >
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleGotoPublish"
          >转待刊登</el-button
        >
      </template>
    </el-dialog>
    <!-- 立即刊登&定时刊登&重新刊登 -->
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
        <el-form-item label="站点" required>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            style="margin-right: 20px"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="checkedSites"
            @change="handleCheckedSitesChange"
          >
            <el-checkbox v-for="item in sites" :key="item" :label="item">{{
              sitesName[item]
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="巴西站点listing type" required>
          <el-select
            v-model="dialogForm.listingType"
            :disabled="dialogForm.disabledVal"
          >
            <el-option value="gold_pro" label="Premium" />
            <el-option value="gold_special" label="Classic" />
          </el-select>
        </el-form-item>
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
        <el-form-item v-if="publishType == '定时刊登'" label="间隔时间">
          <el-input-number
            v-model="dialogForm.interval"
            placeholder="正整数"
            :min="0"
            :precision="0"
            :step="1"
          />min
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
    <!-- 单个立即刊登 -->
    <el-dialog
      v-model="showDialogSinglePublishNow"
      width="40%"
      title="单个立即刊登"
      :close-on-click-modal="false"
    >
      <el-form
        v-loading="singlePublishLoad"
        size="default"
        status-icon
        :label-width="180"
      >
        <el-form-item label="站点" required>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            style="margin-right: 20px"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="checkedSites"
            @change="handleCheckedSitesChange"
          >
            <el-checkbox v-for="item in sites" :key="item" :label="item">{{
              sitesName[item]
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="巴西站点listing type" required>
          <el-select
            v-model="dialogForm.listingType"
            :disabled="dialogForm.disabledVal"
          >
            <el-option value="gold_pro" label="Premium" />
            <el-option value="gold_special" label="Classic" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :disabled="singlePublishLoad"
          @click="singlePublish()"
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
    <HandleWeight
      v-model="weightVisible"
      :init-list="initList"
      @get-config-log="getConfigLog"
    />
  </div>
</template>
<script setup name="publishsmercadomercadopublish">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { parseTime } from '@/utils/common';
  import {
    queryOaNewCategory,
    getCateTree,
    shortcuts,
    getProdTagListApi,
    getLogisListApi,
    getDevTypeListApi,
    getListuserbyrole,
    getModelCreatorList
  } from '@/api/common';
  // import { Delete } from '@element-plus/icons-vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import useUserStore from '@/store/modules/user';
  import CateDialog from '@/components/CateDialog.vue';
  import DetailDialog from './components/DetailDialog.vue';
  import HandleWeight from './components/handleWeight.vue';
  import PskuDetailDialog from '@/components/PskuDetail/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    getPaymentsData,
    getDepartData,
    getStoreInfo
  } from '@/api/eBay/payments';
  import {
    queryProdList,
    generalStoreProd,
    delStoreProd,
    mercadoPublishListing,
    mercadoPublishListingOne,
    updateListingTiming,
    cancelListingTiming,
    changeToWaitingForListing,
    mercadoWeightConfigLog,
    mercadoCreators,
    getMercadoPublishDetail
  } from '@/api/publishs/mercadopublish';
  import { sites, sitesName, tabsName, listingStatus } from './enum';

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

  // 刊登详情--start--
  const showDetailDialog = ref(false);
  let detailDialogFormVisible = ref();
  const getDetail = async (id, prodPId) => {
    const { data } = await getMercadoPublishDetail(id);
    data.prodPId = prodPId;
    detailDialogFormVisible.value = data;
    showDetailDialog.value = true;
  };
  const handelEditDialogClose = (e) => {
    detailDialogFormVisible.value = null;
    showDetailDialog.value = e.isShow;
  };
  // 刊登详情--end--

  const mercadoData = reactive({
    // 初始化查询条件
    initFormData: {
      saleSite: ['MLM', 'MLB', 'MLC', 'MCO'],
      oaList: [], // oa类目
      merList: [], // 美客多类目
      bizzOwnerIds: [], //  开发专员:多选
      modelCreatorId: [], // 创建人
      prodAttrList: [], //  商品标签
      logisAttr: [], //  物流属性:多选
      devTypeList: [] //  开发类型:多选
    },
    // form表单数据
    formData: {
      salesSite: [],
      isListing: '',
      cateOaIdList: [],
      // mercateName: '',
      // mercadoCateIdList: [],
      orgId: '', // 部门
      salePersonId: '', // 销售员
      //店铺Id，必选
      storeAcctId: '',
      //OA新类目
      cateOaId: '',
      //开发类型
      devType: '',
      //商品标签
      prodAttrList: '',
      //物流属性
      logisAttrList: [],
      //开发专员
      bizzOwnerIds: [],
      // 模板创建人
      modelCreatorId: '',
      //在售状态
      isSaleList: [],
      //商品类型
      multiSub: '',
      //生成情况
      isGeneral: 'false',
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
      skuList: '',
      //页签标识 (0, "待刊登"),(1, "刊登成功"), (2, "刊登失败"),(3, "刊登中"),
      listingStatus: -1,
      isComplete: '1', // 变种属性状态
      preStockType: '1',
      searchSalesType: '1', // 7天销量
      creators: [],
      orderType: '15',
      page: 0,
      limit: 50
    }
  });
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const loadingText = ref('');
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    mercadoData.formData.logisAttrList = [];
    mercadoData.formData.cateOaId = '';
    mercadoData.formData.timeType = 'CREATE_TIME';
    mercadoData.formData.skuList = '';
    mercadoData.formData.vagueSearch = 'false';
    mercadoData.formData.time = [];
    mercadoData.formData.searchSKUType = 'pSku';
    mercadoData.formData.searchSKUValue = '';
    mercadoData.formData.cateOaIdList = [];
    // mercadoData.formData.mercadoCateIdList = [];
    // mercadoData.formData.mercateName = [];
    mercadoData.formData.priceMax = '';
    mercadoData.formData.weightMax = '';
    mercadoData.formData.preStockMin = '';
    mercadoData.formData.preStockMax = '';
  };

  const activeName = ref('商品');
  const handleClick = (tab) => {
    if (activeName.value != tab.paneName && tab.paneName != '商品') {
      mercadoData.formData.timeType = 'CREATE_TIME';
      // mercadoData.formData.isGeneral = 'true';
    } else if (activeName.value != tab.paneName && tab.paneName == '商品') {
      mercadoData.formData.timeType = 'CREATE_TIME';
      // mercadoData.formData.isGeneral = 'false';
      mercadoData.formData.isComplete = '1';
    }

    if (tab.paneName == '商品') {
      // mercadoData.formData.mercadoCateIdList = [];
      // mercadoData.formData.mercateName = [];
    } else {
      mercadoData.formData.priceMin = '';
      mercadoData.formData.priceMax = '';
      mercadoData.formData.weightMin = '';
      mercadoData.formData.weightMax = '';
      mercadoData.formData.preStockMin = '';
      mercadoData.formData.preStockMax = '';
    }

    if (activeName.value != tab.paneName) {
      mercadoData.formData.salesSort = '';
    }
    activeName.value = tab.paneName;
    currentPage.value = 1;
    // onSubmit();
    tableData.value = [];
  };

  //   提交查询
  const onSubmit = async () => {
    tableData.value = null;
    mercadoData.formData.page = currentPage.value;
    mercadoData.formData.limit = pageSize.value;
    if (mercadoData.formData.time && mercadoData.formData.time.length != 0) {
      mercadoData.formData.startTime =
        mercadoData.formData.time[0] + ' 00:00:00';
      mercadoData.formData.endTime = mercadoData.formData.time[1] + ' 23:59:59';
    } else {
      mercadoData.formData.startTime = '';
      mercadoData.formData.endTime = '';
    }

    if (mercadoData.formData.storeAcctId.length == 0) {
      ElMessage.warning('请选择店铺');
      return;
    }
    // 站点和刊登情况两个查询条件必须同时都选中，才进行查询
    if (
      (mercadoData.formData.salesSite.length == 0 &&
        mercadoData.formData.isListing != '') ||
      (mercadoData.formData.salesSite.length != 0 &&
        mercadoData.formData.isListing == '' &&
        (activeName.value == '商品' ||
          activeName.value == '待刊登' ||
          activeName.value == '刊登成功' ||
          activeName.value == '刊登失败'))
    ) {
      ElMessage.warning(
        mercadoData.formData.salesSite.length == 0
          ? '请选择站点'
          : '请选择刊登情况'
      );
      return;
    }

    if (activeName.value != '待刊登') {
      mercadoData.formData.isListing = '';
      mercadoData.formData.salesSite = [];
    }

    tableDataLoading.value = true;
    mercadoData.formData.listingStatus = listingStatus[activeName.value];
    if (activeName.value != '商品') {
      mercadoData.formData.modelCreatorId = '';
      mercadoData.formData.isComplete = '';
      mercadoData.formData.isGeneral = true; // 生成情况：已生成
      mercadoData.formData.devType = '';
      mercadoData.formData.prodAttrList = '';
      mercadoData.formData.logisAttrList = [];
      mercadoData.formData.bizzOwnerIds = [];
      mercadoData.formData.multiSub = '';
      mercadoData.formData.searchSalesType = '';
    } else {
      mercadoData.formData.creators = [];
      mercadoData.formData.isGeneral = false; // 生成情况：未生成
    }
    if (activeName.value != '刊登失败') {
      mercadoData.formData.errorMessage = '';
      mercadoData.formData.listingFailType = '';
    }
    if (
      mercadoData.formData.cateName &&
      mercadoData.formData.cateName.length != 0
    ) {
      mercadoData.formData.cateOaIdList = [];
      mercadoData.formData.cateName.forEach((item) => {
        mercadoData.formData.cateOaIdList.push(item[item.length - 1]);
      });
    } else {
      mercadoData.formData.cateOaIdList = [];
    }
    // if (
    //   mercadoData.formData.mercateName.length &&
    //   mercadoData.formData.mercateName.length != 0
    // ) {
    //   mercadoData.formData.mercadoCateIdList = [];
    //   mercadoData.formData.mercateName.forEach((item) => {
    //     mercadoData.formData.mercadoCateIdList.push(item[item.length - 1]);
    //   });
    // } else {
    //   mercadoData.formData.mercadoCateIdList = [];
    // }

    if (
      mercadoData.formData.skuList != '' &&
      !Array.isArray(mercadoData.formData.skuList)
    ) {
      mercadoData.formData.skuList = mercadoData.formData.skuList.split(',');
    } else if (
      mercadoData.formData.skuList == '' &&
      !Array.isArray(mercadoData.formData.skuList)
    ) {
      mercadoData.formData.skuList = [];
    }

    // 1-12：定时刊登时间倒序；13：定时刊登时间正序
    // 2-1：美客多模板创建时间倒序；2：美客多模板创建时间正序
    // 3-5：生成店铺商品时间倒序；6：生成店铺商品时间正序
    // 4-3：基础模板审核时间倒序；4：基础模板审核时间正序
    // 14：倒序 15：正序
    let salesSort = '';
    if (['BR', 'CL', 'MX', 'CO'].includes(mercadoData.formData.salesSort)) {
      salesSort = mercadoData.formData.orderType;
    } else if (mercadoData.formData.salesSort == 1) {
      salesSort = { 14: '12', 15: '13' }[mercadoData.formData.orderType];
    } else if (mercadoData.formData.salesSort == 2) {
      salesSort = { 14: '1', 15: '2' }[mercadoData.formData.orderType];
    } else if (mercadoData.formData.salesSort == 3) {
      salesSort = { 14: '5', 15: '6' }[mercadoData.formData.orderType];
    } else if (mercadoData.formData.salesSort == 4) {
      salesSort = { 14: '3', 15: '4' }[mercadoData.formData.orderType];
    } else {
      salesSort = mercadoData.formData.salesSort;
    }
    const { data, code, count } = await queryProdList({
      ...mercadoData.formData,
      countryCode: ['BR', 'CL', 'MX', 'CO'].includes(
        mercadoData.formData.salesSort
      )
        ? mercadoData.formData.salesSort
        : '', // 排序查询条件--国家
      salesSort: salesSort // 排序查询条件--正序倒序
    });
    if (code == '0000' && count == 0) {
      tableDataLoading.value = false;
      tableData.value = [];
    } else if (code == '0000') {
      tableDataLoading.value = false;
      tableData.value = data.map((item) => {
        item.displayCount = 3;
        return item;
      });
    }
    total.value = count;
  };
  let tableDataRef = ref();
  // 设置刊登重量

  const weightVisible = ref(false);
  const initList = ref();
  const getPublishWeight = () => {
    // tableDataLoading.value = true;
    getConfigLog();
  };
  const getConfigLog = async () => {
    const { data, code } = await mercadoWeightConfigLog();
    if (code == '0000' && data && data.length != 0) {
      initList.value = data;
    }
    weightVisible.value = true;
  };
  // 生成店铺商品
  const getListing = async () => {
    tableDataLoading.value = true;
    loadingText.value = '生成店铺商品处理中，请等待...';
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return;
    }
    let listingInfoList = [];
    checkedData.forEach((item) => {
      let modelSId = [];
      if (item.sInfoList && item.sInfoList.length > 0) {
        modelSId = item.sInfoList.map((cItem) => cItem.modelSId);
      }
      listingInfoList.push({
        storeAcctId: mercadoData.formData.storeAcctId,
        pSku: item.pSku,
        modelPId: item.modelPId,
        sInfo: {
          modelSIdList: modelSId
        }
      });
    });
    const { data, code } = await generalStoreProd({
      listingInfoList: listingInfoList
    });
    console.log(code);
    console.log(data);
    if (code == '0000' && data && data.submitCount != 0) {
      tableDataLoading.value = false;
      // let str = '';
      // data.forEach((item) => {
      //   str += item + '</br>';
      // });
      // ElMessageBox.alert(str, '提示', {
      //   confirmButtonText: '取消'
      // });
      let msg = '';
      msg += `本次提交生成店铺商品SKU${data.submitCount}个，成功${data.successCount}个，异常${data.errorCount}个，异常明细如下:<br/>`;
      data.failDetail.forEach((item) => {
        msg += `${item}<br/>`;
      });
      ElMessageBox.alert(
        `<div style="width: 800px;overflow: hidden;overflow-wrap: break-word;">${msg}</div>`,
        '操作结果',
        {
          dangerouslyUseHTMLString: true,
          customClass: 'mercadoElMsg',
          confirmButtonText: '取消'
        }
      );
      if (activeName.value == '商品') {
        // modelPId || pSku
        tableData.value = tableData.value.filter(
          (item) => !data.successModelPIdList.includes(item.modelPId)
        );
        total.value = total.value - data.successCount;
      } else {
        onSubmit();
      }
      // } else if (code == '0000' && (!data || data.length == 0)) {
      //   tableDataLoading.value = false;
      //   ElMessage.success('操作成功');
      //   if (activeName.value == '商品') {
      //     let checkedData = tableDataRef.value[0].getCheckboxRecords();
      //     let checkedSkus = checkedData.map((item) => item.modelPId);
      //     // modelPId || pSku
      //     tableData.value = tableData.value.filter(
      //       (item) => !checkedSkus.includes(item.modelPId)
      //     );
      //     total.value = total.value - checkedSkus.length;
      //   } else {
      //     onSubmit();
      //   }
    }
    loadingText.value = '';
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
    let listingIds = [];
    checkedData.forEach((item) => {
      item.sInfoList.forEach((cItem) => {
        listingIds.indexOf(cItem.listingId) == -1
          ? listingIds.push(cItem.listingId)
          : '';
      });
    });
    ElMessageBox.confirm('确定要删除店铺商品吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, msg } = await delStoreProd(listingIds.join(','));
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
  const handleCheckAllChange = (val) => {
    checkedSites.value = val ? sites : [];
    isIndeterminate.value = false;
    val == true ? (dialogForm.disabledVal = false) : disabledMLB();
  };
  const handleCheckedSitesChange = (value) => {
    value.indexOf('MLB') == -1
      ? disabledMLB()
      : (dialogForm.disabledVal = false);
    const checkedCount = value.length;
    checkAll.value = checkedCount === sites.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < sites.length;
  };
  const dialogForm = reactive({
    time: '',
    disabledVal: true,
    listingType: 'gold_special'
  });
  // 非巴西站点不能修改
  const disabledMLB = () => {
    dialogForm.disabledVal = true;
    dialogForm.listingType = 'gold_special';
  };
  const resetDialog = () => {
    checkAll.value = false;
    isIndeterminate.value = false;
    checkedSites.value = [];
    dialogForm.disabledVal = true;
    dialogForm.interval = '';
    dialogForm.listingType = 'gold_special';
    dialogForm.time = '';
  };
  const publishType = ref('');
  const publishLoad = ref(false);
  // 立即刊登&定时刊登
  const publishNow = (type) => {
    if (type == '定时') {
      publishType.value = '定时刊登';
    } else if (type == '立即') {
      publishType.value = '立即刊登';
      reListingBool.value = false;
    }
    resetDialog();
    showDialogPublishNow.value = true;
  };
  // 单个立即刊登
  const showDialogSinglePublishNow = ref(false);
  const singlePublishLoad = ref(false);

  const singlePublishNow = () => {
    let checkedData = tableDataRef.value[1].getCheckboxRecords();
    if (checkedData.length != 1) {
      ElMessage.warning('请选择一条数据且只能选中一条');
      return false;
    } else {
      showDialogSinglePublishNow.value = true;
    }
  };
  const singlePublish = async () => {
    let checkedData = tableDataRef.value[1].getCheckboxRecords();
    let listingIdList = [],
      listingType = dialogForm.listingType;
    checkedData.forEach((item) => {
      listingIdList.push(item.sInfoList[0].listingId);
    });
    if (checkedSites.value.length == 0) {
      ElMessage.warning('请选择站点');
      return false;
    }
    const { code, msg } = await mercadoPublishListingOne({
      listingIdList,
      globalSites: checkedSites.value,
      listingType,
      reListingBool: reListingBool.value
    });
    if (code == '0000') {
      ElMessageBox.alert(msg, '操作结果', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      });
      showDialogSinglePublishNow.value = false;
      onSubmit();
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
    let listingIdList = [],
      listingType = dialogForm.listingType;
    checkedData.forEach((item) => {
      listingIdList.push(item.sInfoList[0].listingId);
    });
    if (checkedSites.value.length == 0) {
      ElMessage.warning('请选择站点');
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
    publishLoad.value = true;
    if (publishType.value == '立即刊登') {
      const { code, msg } = await mercadoPublishListing({
        listingIdList,
        globalSites: checkedSites.value,
        listingType,
        reListingBool: reListingBool.value
      });
      if (code == '0000') {
        ElMessage.success(msg);
        showDialogPublishNow.value = false;
        onSubmit();
      }
    } else if (publishType.value == '定时刊登') {
      const { code, msg } = await updateListingTiming({
        idList: listingIdList,
        interval: dialogForm.interval,
        saleSiteList: checkedSites.value.join(','),
        listingType,
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
  const cancelRepublish = async () => {
    let checkedData = tableDataRef.value[2].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择一条数据');
      return false;
    }
    let idList = checkedData.map((item) => item.id);
    const { code, msg } = await cancelListingTiming(idList.join(','));
    if (code == '0000') {
      ElMessage.success(msg);
      onSubmit();
    }
  };
  // 转待刊登
  let showDialogGotoPublish = ref(false),
    gotoPublishRadio = ref('1');

  const gotopublish = async () => {
    showDialogGotoPublish.value = true;
  };
  const handleGotoPublish = async () => {
    if (gotoPublishRadio.value == '1') {
      // 按照搜索结果执行转待刊登
      const { code, data } = await changeToWaitingForListing(
        mercadoData.formData
      );
      if (code == '0000') {
        ElMessageBox.alert(data, '操作结果', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭'
        });
        showDialogGotoPublish.value = false;
        onSubmit();
      }
    } else if (gotoPublishRadio.value == '2') {
      // 按照列表选中商品执行转待刊登
      let checkedData;
      if (activeName.value == '刊登成功') {
        checkedData = tableDataRef.value[3].getCheckboxRecords();
      } else if (activeName.value == '刊登失败') {
        checkedData = tableDataRef.value[4].getCheckboxRecords();
      }
      if (checkedData.length == 0) {
        ElMessage.warning('请选择一条数据');
        return false;
      }

      const { code, data } = await changeToWaitingForListing({
        listingIds: checkedData.map((item) => item.id),
        listingStatus: listingStatus[activeName.value]
      });
      if (code == '0000') {
        ElMessageBox.alert(data, '操作结果', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '关闭'
        });
        showDialogGotoPublish.value = false;
        onSubmit();
      }
    }
  };

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
      getCateTree(),
      mercadoCreators()
    ])
      .then((res) => {
        // 商品标签
        mercadoData.initFormData.prodAttrList = res[0].data.map(
          (item) => item.name
        );
        //物流属性
        mercadoData.initFormData.logisAttr = res[1].data.map(
          (item) => item.name
        );
        //开发类型
        mercadoData.initFormData.devTypeList = res[2].data.map(
          (item) => item.name
        );
        //创建人
        mercadoData.initFormData.modelCreatorId = res[3].data.map((item) => ({
          value: item.creatorId,
          label: item.creator
        }));
        //开发专员
        mercadoData.initFormData.bizzOwnerIds = res[4].data.map((item) => ({
          value: item.id,
          label: item.userName
        }));
        //OA新类目
        mercadoData.initFormData.oaList = JSON.parse(res[5].data);
        // 美客多类目
        mercadoData.initFormData.merList = res[6].data;
        // creators
        mercadoData.initFormData.creators = res[7].data;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  });

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
    row.displayCount = row.sInfoList.length;
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
      !mercadoData.formData.orgId &&
      !mercadoData.formData.salePersonId &&
      mercadoData.formData.storeAcctId.length === 0
    ) {
      storeAcctIdList = [];
    }

    // 选择部门或者销售人员 没有选择店铺
    if (
      (mercadoData.formData.orgId || mercadoData.formData.salePersonId) &&
      mercadoData.formData.storeAcctId.length === 0
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
        mercadoData.formData.storeAcctId.length > 0
          ? mercadoData.formData.storeAcctId
          : storeAcctIdList
    };
    const { data } = await getPaymentsData(params);
    paymentsList.value = data;
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'mercado专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };

  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'mercado专员',
      orgId: mercadoData.formData.orgId,
      salePersonId: mercadoData.formData.salePersonId,
      platCode: 'mercado',
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
    mercadoData.formData.storeAcctId = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    mercadoData.formData.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    mercadoData.formData.salePersonId = '';
    mercadoData.formData.storeAcctId = '';
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
    mercadoData.formData.cateName = e.cate.value.fullCateName;
    mercadoData.formData.cateOaId = e.cate.value.categoryId;
  };

  // const handleCateDialogOpen = () => {
  //   showCateDialog.value = true;
  // };
  // 类目组件 end
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 350;
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
  .mercadoElMsg {
    --el-messagebox-width: 800px;
  }
</style>
