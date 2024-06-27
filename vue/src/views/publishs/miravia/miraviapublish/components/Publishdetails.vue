<template>
  <!-- 刊登详情/店铺商品弹窗 -->
  <el-dialog
    :model-value="showDialog"
    width="80%"
    class="detail-dialog"
    :title="action === 'update' ? '详情' : '生成店铺商品'"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div ref="detailRef" v-loading="loading">
      <el-form
        ref="formRef"
        size="default"
        status-icon
        :model="formData"
        :rules="formRules"
        :label-width="180"
      >
        <el-divider content-position="left"><h3>基础信息</h3></el-divider>
        <el-form-item label="平台类目" prop="categoryTreeName">
          <el-input
            v-model="formData.categoryTreeName"
            style="width: 1060px"
            readonly
            @click="handleCateDialogOpen('miravia')"
          />
        </el-form-item>
        <div style="margin: 0px 0 10px 180px; color: #bbb">
          {{ formData.cateTreeName }}
        </div>
        <el-form-item label="商品标题" prop="title">
          <!-- <el-input
            v-model="formData.title"
            maxlength="128"
            show-word-limit
            style="width: 500px"
            type="text"
            clearable
          ></el-input> -->
          <PlatTitle
            v-model="formData.title"
            :custom-type="'text'"
            :content-top="50"
            :max-length="128"
            :clearable="true"
            :show-word-limit="true"
            :input-width="'1060px'"
            :prod-p-id="formData.prodPId"
          />
          <el-button
            type="primary"
            style="margin-left: 10px"
            size="small"
            @click="getMiraviaProduct"
            >重新生成</el-button
          >
        </el-form-item>
        <div style="margin-left: 40px; margin-bottom: 10px">
          分类属性
          <el-button
            type="primary"
            size="small"
            style="margin-left: 20px"
            @click="handleSyncAttr"
            >同步</el-button
          >
        </div>
        <Prodattr
          v-if="prodListingMiraviaPropertyRequiredList.length"
          :prod-listing-miravia-property-list="
            prodListingMiraviaPropertyRequiredList
          "
          :attr-map-list="attrMapList"
          :is-required="true"
        />
        <el-button
          v-if="prodListingMiraviaPropertyNotRequiredList?.length > 0"
          type="primary"
          text
          bg
          style="margin-left: 40px; margin-bottom: 10px"
          @click="toggleAttr"
          >更多选填属性
          <span>{{ showNotRequired ? '-' : '+' }}</span></el-button
        >
        <div v-if="showNotRequired" class="label_item">
          <Prodattr
            :prod-listing-miravia-property-list="
              prodListingMiraviaPropertyNotRequiredList
            "
          />
        </div>
        <el-form-item
          class="is-required"
          label="产品描述"
          prop="productDescriptionNew"
        >
          <DescInfo
            ref="descRef"
            :store-acct-id="props.storeAcctId"
            :desc-obj="descObj"
            :full-table-data="fullTableData"
            @get-table-data="getSkuTableData"
            @change-desc="changeDesc"
          />
        </el-form-item>
        <el-divider content-position="left"><h3>图片信息</h3></el-divider>
        <div style="margin-left: 40px">
          <span style="color: red">*</span>商品图片
        </div>
        <div class="imgs_content">
          <div>
            <div class="main_img">
              <el-popover
                placement="right"
                width="450px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="mainImgUrl" />
                </template>
                <template #reference>
                  <el-image loading="lazy" :src="mainImgUrl" />
                </template>
              </el-popover>
            </div>
            <div class="color_red">(请选择白底图作为主图)</div>
            <div class="img_tool" style="width: 160px">
              <el-button
                type="primary"
                link
                :disabled="activeKey === '1' ? true : false"
                style="font-size: 12px"
                @click="handleSetWhite(mainImgUrl)"
                >设为白底图</el-button
              >
              <el-button
                type="primary"
                link
                :disabled="activeKey === '1' ? true : false"
                style="font-size: 12px"
                @click="handleSetScene(mainImgUrl)"
                >设为场景图</el-button
              >
            </div>
            <div class="img_tool" style="width: 160px">
              <OneClickCutout
                v-model:img-url="mainImgUrl"
                :disabled="activeKey === '1' ? true : false"
              />
            </div>
          </div>
          <div class="setting_img">
            <div class="upload_img">
              <el-button
                type="primary"
                size="small"
                :disabled="activeKey === '1' ? true : false"
                @click="uploadNetworkImg('basic')"
                >网络图片</el-button
              >
              <el-upload
                :action="'/api/lms/prodTpl/uploadPic.html'"
                :on-success="importSuccess"
                :on-error="importError"
                :show-file-list="false"
                style="margin: 0 10px"
                multiple
              >
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  >本地图片</el-button
                >
              </el-upload>
              <el-button
                type="primary"
                size="small"
                :disabled="activeKey === '1' ? true : false"
                @click="uploadTempImg('basic')"
                >模板图片</el-button
              >
              <span>说明：拖动图片调整顺序！商品图片要求1-8张</span>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div
                v-for="(item, index) in assistImgList"
                :key="index"
                class="small_item"
              >
                <el-popover
                  placement="right"
                  width="450px"
                  :hide-after="0"
                  trigger="hover"
                  :teleported="false"
                >
                  <template #default>
                    <el-image :id="index" :src="item" />
                  </template>
                  <template #reference>
                    <el-image
                      :id="index"
                      class="small_img"
                      :src="item"
                      draggable="true"
                      @dragstart="dragStart"
                      @drop="drop"
                      @dragover="dragover"
                    />
                  </template>
                </el-popover>
                <div style="height: 20px; line-height: 20px; width: 130px">
                  <div class="img_tool">
                    <el-button
                      type="primary"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      style="font-size: 12px"
                      @click="setMainImg(item, index)"
                      >设为主图</el-button
                    >
                    <el-button
                      type="danger"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      style="font-size: 12px"
                      @click="handleRemove(index)"
                      >移除</el-button
                    >
                  </div>
                  <div class="img_tool">
                    <el-button
                      type="primary"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      style="font-size: 12px"
                      @click="handleSetWhite(assistImgList[index])"
                      >设为白底图</el-button
                    >
                    <el-button
                      type="primary"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      style="font-size: 12px"
                      @click="handleSetScene(assistImgList[index])"
                      >设为场景图</el-button
                    >
                  </div>
                  <div class="img_tool">
                    <OneClickCutout
                      v-model:img-url="assistImgList[index]"
                      :disabled="activeKey === '1' ? true : false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-left: 40px; margin-top: 20px">营销图</div>
        <div style="display: flex">
          <div style="display: flex; width: 50%; justify-content: center">
            <div style="margin-left: 40px">1:1 白底图</div>
            <div class="setting_img" style="margin-left: 20px">
              <div class="upload_img">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadNetworkImg('white')"
                  >网络图片</el-button
                >
                <el-upload
                  :action="'/api/lms/prodTpl/uploadPic.html'"
                  :on-success="importWhiteSuccess"
                  :on-error="importError"
                  :show-file-list="false"
                  style="margin: 0 10px"
                  multiple
                >
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="activeKey === '1' ? true : false"
                    >本地图片</el-button
                  >
                </el-upload>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadTempImg('white')"
                  >模板图片</el-button
                >
              </div>
              <div v-if="formData.squareMarketImage">
                <el-popover
                  placement="right"
                  width="450px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="formData.squareMarketImage" />
                  </template>
                  <template #reference>
                    <el-image
                      class="small_img"
                      :src="formData.squareMarketImage"
                    />
                  </template>
                </el-popover>
              </div>
              <div v-if="formData.squareMarketImage">
                <div class="img_tool">
                  <OneClickCutout
                    v-model:img-url="formData.squareMarketImage"
                    :disabled="activeKey === '1' ? true : false"
                  />
                  <el-button
                    type="danger"
                    link
                    :disabled="activeKey === '1' ? true : false"
                    style="font-size: 12px"
                    @click="handleRemoveWhite()"
                    >移除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center">
            <div style="margin-left: 40px">3:4 场景图</div>
            <div class="setting_img" style="margin-left: 20px">
              <div class="upload_img">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadNetworkImg('scene')"
                  >网络图片</el-button
                >
                <el-upload
                  :action="'/api/lms/prodTpl/uploadPic.html'"
                  :on-success="importSceneSuccess"
                  :on-error="importError"
                  :show-file-list="false"
                  style="margin: 0 10px"
                  multiple
                >
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="activeKey === '1' ? true : false"
                    >本地图片</el-button
                  >
                </el-upload>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadTempImg('scene')"
                  >模板图片</el-button
                >
              </div>
              <div v-if="formData.longMarketImage">
                <el-popover
                  placement="right"
                  width="450px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="formData.longMarketImage" />
                  </template>
                  <template #reference>
                    <el-image
                      class="scene_img"
                      :src="formData.longMarketImage"
                    />
                  </template>
                </el-popover>
              </div>
              <div v-if="formData.longMarketImage">
                <div class="img_tool">
                  <OneClickCutout
                    v-model:img-url="formData.longMarketImage"
                    :disabled="activeKey === '1' ? true : false"
                  />
                  <el-button
                    type="danger"
                    link
                    :disabled="activeKey === '1' ? true : false"
                    style="font-size: 12px"
                    @click="handleRemoveScene()"
                    >移除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 视频信息 -->
        <Videoinfo
          v-if="isShowVideo"
          :form-data="formData"
          @update="updateFormData"
          @choose-media="chooseMedia"
          @change-is-cancel="changeIsCancel"
        />

        <el-divider content-position="left"><h3>其他信息</h3></el-divider>
        <div class="hs_content">
          <div v-if="hsInfoList?.length > 0">
            <span style="color: red">*</span>海关描述
          </div>
          <el-radio-group v-model="formData.hsCode" class="radio-group">
            <el-radio
              v-for="(item, index) in hsInfoList"
              :key="index"
              :value="item.hsCode"
            >
              <template #default>
                <div class="hs_main">
                  <div style="white-space: break-spaces">
                    {{ item.hsCodeDesc }}
                  </div>
                </div>
                <div class="hs_remark">
                  <div style="white-space: break-spaces">
                    {{ item.parentHsCodeDesc }}
                  </div>
                </div>
              </template>
            </el-radio>
          </el-radio-group>
        </div>
        <el-divider content-position="left"><h3>规格信息</h3></el-divider>
        <div style="display: flex">
          <el-form-item label="主规格">
            <el-select
              v-model="mulSetting.mainSet"
              filterable
              allow-create
              default-first-option
              clearable
              style="width: 150px"
              @change="changeMainSpec"
            >
              <el-option
                v-for="item in saleAttrList"
                :key="item.id"
                :value="item.attrNameId"
                :label="item.attrName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="次规格">
            <el-select
              v-model="mulSetting.assistSet"
              filterable
              allow-create
              default-first-option
              clearable
              style="width: 150px"
              @change="changeAssistSpec"
            >
              <el-option
                v-for="item in saleAttrList"
                :key="item.id"
                :value="item.attrNameId"
                :label="item.attrName"
                :disabled="item.attrNameId === mulSetting.mainSet"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item label="映射OA规格">
            <el-select
              v-model="mulSetting.mainOa"
              clearable
              style="width: 150px"
              @change="chooseMainOA"
            >
              <el-option :value="'color'" label="color"></el-option>
              <el-option :value="'size'" label="size"></el-option>
              <el-option :value="'style'" label="style"></el-option>
              <el-option value="color-size" label="color-size"></el-option>
              <el-option value="color-style" label="color-style"></el-option>
              <el-option value="style-size" label="style-size"></el-option>
              <el-option
                value="color-style-size"
                label="color-style-size"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="映射OA规格">
            <el-select
              v-model="mulSetting.assistOa"
              clearable
              style="width: 150px"
              @change="chooseAssistOA"
            >
              <el-option :value="'color'" label="color"></el-option>
              <el-option :value="'size'" label="size"></el-option>
              <el-option :value="'style'" label="style"></el-option>
              <el-option value="color-size" label="color-size"></el-option>
              <el-option value="color-style" label="color-style"></el-option>
              <el-option value="style-size" label="style-size"></el-option>
              <el-option
                value="color-style-size"
                label="color-style-size"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-divider content-position="left"><h3>变种信息</h3></el-divider>

        <div v-if="[-2, 0, 2].includes(Number(activeKey))" class="tool_btn">
          <div class="tool_btn-price">
            <div class="tool_btn-price-item">
              <span>毛利率</span>
              <ZInputNumber
                v-model="grossRate"
                :precision="2"
                size="small"
                clearable
                style="width: 150px"
              />
              <span>%</span>
            </div>
            <div class="tool_btn-price-item" style="margin-left: 20px">
              <span>优惠幅度</span>
              <ZInputNumber
                v-model="discountRate"
                :precision="2"
                size="small"
                clearable
                style="width: 150px; margin: 0 5px 0 10px"
              />
              <span>%</span>
            </div>
            <el-button
              type="primary"
              size="small"
              class="ml10"
              @click="handleReCountPrice"
              >定价</el-button
            >
          </div>
          <div class="tool_btn-sku">
            <span>商品SKU</span>
            <el-input
              v-model="addSku"
              placeholder="支持父、子SKU同时添加,多个用逗号分隔"
              size="small"
              style="width: 150px; margin: 0 10px"
            ></el-input>
            <el-button type="primary" size="small" @click="handleAddInfo"
              >新增变种</el-button
            >
          </div>
        </div>
        <div v-if="[-2, 0, 2].includes(Number(activeKey))">
          <el-form
            size="default"
            status-icon
            :model="mulSetting"
            :inline="true"
          >
            <span>批量设置</span>
            <el-form-item label="零售价(EUR)" style="margin-left: 50px">
              <el-input
                v-model="mulSetting.skuPrice"
                style="width: 70px"
                size="small"
                :disabled="activeKey === '1' ? true : false"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="促销价(EUR)">
              <el-input
                v-model="mulSetting.skuDiscountPrice"
                style="width: 60px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="重量(g)">
              <el-input
                v-model="mulSetting.packageWeight"
                style="width: 60px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="长(cm)" label-width="60">
              <el-input
                v-model="mulSetting.packageLength"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="长"
              />
            </el-form-item>
            <el-form-item label="宽(cm)" label-width="60">
              <el-input
                v-model="mulSetting.packageWidth"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="宽"
              />
            </el-form-item>
            <el-form-item label="高(cm)" label-width="60">
              <el-input
                v-model="mulSetting.packageHeight"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="高"
              />
            </el-form-item>
            <el-form-item label="库存" label-width="60">
              <el-input
                v-model="mulSetting.skuStock"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="库存"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSet"
                >填写</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <vxe-table
          ref="miraviaTableRef"
          :data="formData.prodListingSubSkuMiraviaList"
          border
        >
          <vxe-column title="OA属性" width="100">
            <template #default="{ row }">
              <div>color: {{ row.color }}</div>
              <div>size: {{ row.size }}</div>
              <div>style: {{ row.style }}</div>
            </template>
          </vxe-column>
          <vxe-column
            v-for="(item, cIndex) in mulSetting.skuProperty"
            :key="cIndex"
            :width="item.skuPropertyName !== '尺寸' ? 180 : 100"
          >
            <template #header>
              <span style="color: red">*</span>{{ item.skuPropertyName }}
            </template>
            <template #default="{ row, rowIndex }">
              <div style="display: flex">
                <div v-if="item.skuPropertyName !== '尺寸'" class="preview_img">
                  <el-popover
                    placement="right"
                    width="500px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default>
                      <el-image :src="row.skuImageList || ''" />
                    </template>
                    <template #reference>
                      <el-image
                        v-if="row.skuImageList"
                        loading="lazy"
                        style="width: 100px; height: 100px"
                        :src="row.skuImageList || ''"
                      />
                    </template>
                  </el-popover>
                </div>
                <div
                  v-if="item.skuPropertyName !== '尺寸'"
                  class="btn_position"
                >
                  <el-upload
                    :action="'/api/lms/prodTpl/uploadPic.html'"
                    :on-success="
                      (res) =>
                        importSkuImgSuccess(
                          res,
                          item.skuPropertyName,
                          cIndex,
                          rowIndex
                        )
                    "
                    :on-error="importError"
                    :show-file-list="false"
                    multiple
                  >
                    <el-button type="primary" link style="font-size: 12px"
                      >本地图片</el-button
                    >
                  </el-upload>
                  <el-button
                    type="primary"
                    link
                    style="font-size: 12px"
                    @click="uploadNetworkImg('list', rowIndex)"
                    >网络图片</el-button
                  >
                  <el-button
                    type="primary"
                    link
                    style="font-size: 12px"
                    @click="uploadTempImg('list', rowIndex)"
                    >模板图片</el-button
                  >
                  <el-button
                    type="danger"
                    link
                    style="font-size: 12px"
                    @click="renmoveSkuImg(rowIndex)"
                    >删除</el-button
                  >
                </div>
              </div>
              <el-input
                v-if="row.skuProperty[cIndex]"
                v-model="row.skuProperty[cIndex].skuPropertyValue"
                clearable
                size="small"
                required
                @input="
                  (val) =>
                    changeCustom(val, item.skuPropertyName, cIndex, rowIndex)
                "
              ></el-input>
            </template>
          </vxe-column>
          <vxe-column field="storeSSku">
            <template #header>
              <span style="color: red">*</span>卖家SKU
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <span style="color: red">*</span>成本(EUR)
            </template>
            <template #default="{ row }">
              <el-input v-model="row.purchaseCostPrice" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <span style="color: red">*</span>零售价(EUR)
            </template>
            <template #default="{ row }">
              <el-input v-model="row.skuPrice" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <span style="color: red">*</span>促销价(EUR)
            </template>
            <template #default="{ row }">
              <el-input v-model="row.skuDiscountPrice" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <span style="color: red">*</span>重量(g)
            </template>
            <template #default="{ row }">
              <el-input v-model="row.packageWeight" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="190">
            <template #header>
              <span style="color: red">*</span>尺寸(cm)
            </template>
            <template #default="{ row }">
              <el-input
                v-model="row.packageLength"
                style="width: 50px"
                size="small"
                placeholder="长"
              ></el-input
              >*<el-input
                v-model="row.packageWidth"
                style="width: 50px"
                size="small"
                placeholder="宽"
              ></el-input
              >*<el-input
                v-model="row.packageHeight"
                style="width: 50px"
                size="small"
                placeholder="高"
              ></el-input>
            </template>
          </vxe-column>
          <vxe-column field="skuStock" width="80">
            <template #header> <span style="color: red">*</span>库存</template>
            <template #default="{ row }">
              <el-input v-model="row.skuStock" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column title="ean code" field="eanCode">
            <template #default="{ row }">
              <el-input v-model="row.eanCode" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column title="销售状态" filed="prodStatus" width="100">
            <template #default="{ row }">
              <el-switch
                v-model="row.prodStatus"
                inline-prompt
                active-text="开启"
                inactive-text="关闭"
              />
            </template>
          </vxe-column>
          <vxe-column
            v-if="[-2, 0, 2].includes(Number(activeKey))"
            title="操作"
            width="70"
          >
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="removeInfo(row)"
                >移除</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </el-form>
    </div>
    <template v-if="activeKey !== '1'" #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="publishOnTime(formRef)"
        >定时刊登</el-button
      >
      <el-button type="primary" @click="publish(formRef)">立即刊登</el-button>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog
    :model-value="showNetworkImg"
    title="网络图片"
    width="30%"
    :close-on-click-modal="false"
    @close="closeNetwork"
  >
    <el-input
      v-model="networkImgUrls"
      placeholder="请填写图片URL，多个地址用回车换行"
      type="textarea"
      :autosize="{ minRows: 6 }"
    ></el-input>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleUpload">确定</el-button>
        <el-button @click="closeNetwork">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 类目组件 -->
  <CateDialog
    v-if="showCateDialog"
    :show-dialog="showCateDialog"
    :handle-cate-dialog-type="handleCateDialogType"
    :prod-p-id="prodPId"
    :store-acct-id="storeAccId"
    @close-dialog="handleCateDialogClose($event)"
  />

  <ChooseTplImage
    v-model="tplImgVisible"
    :limit="remainderLimit"
    :params="tplImgParams"
    @get-tpl-img="getTplImg"
  />
  <!-- 定时刊登 -->
  <el-dialog
    v-model="dialogVisible"
    width="600px"
    title="定时刊登"
    :close-on-click-modal="false"
  >
    <el-form :scroll-to-error="true" size="default" :label-width="180">
      <el-form-item label="定时刊登开始时间" prop="listTiming">
        <el-date-picker
          v-model="listTiming"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择定时刊登开始时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handlePublsih">确定</el-button>
      <el-button @click="cancelPublish">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import { onMounted, reactive, ref, provide } from 'vue';
  import {
    queryMiraviaPublishTitle,
    initMiraviaProduct,
    queryCateAttr,
    queryHsCodeAndText,
    addSkuInfo,
    handleCreate,
    handleUpdate,
    getDetail,
    syncCateAttr,
    getBizDictByCode,
    genStoreListingAndPublish,
    reCountPriceApi
  } from '@/api/publishs/miraviapublish';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import CateDialog from '@/components/CateDialog.vue';
  import { tansferImageApi } from '@/api/publishs/sheinpublish';
  import { debounce } from 'lodash-es';
  import { comHidePopover } from '@/utils/common';
  import DescInfo from './DescInfo.vue';
  // import Editor from '@/components/Editor/index.vue';
  import Videoinfo from './Videoinfo.vue';
  import Prodattr from './Prodattr.vue';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import OneClickCutout from '@/components/OneClickCutout/index.vue';
  import {
    UNIT_TYPE_CN_OPTION_LIST,
    UNIT_TYPE_EN_OPTION_LIST
  } from './enum.js';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    storeAccId: {
      type: Number,
      default: 0
    },
    prodPId: {
      type: Number,
      default: 0
    },
    listingId: {
      type: Number,
      default: 0
    },
    activeKey: {
      type: String,
      default: ''
    },
    listingStatus: {
      type: Number,
      default: -2
    }
  });

  const emit = defineEmits(['close', 'getTableData']);
  const formRef = ref(null);
  const mainImageUrlList = ref([]); // 主图 辅图
  const prodListingMiraviaPropertyRequiredList = ref([]);
  const prodListingMiraviaPropertyNotRequiredList = ref([]);
  const isShowVideo = ref(false);
  // 产品描述
  const descObj = ref({});
  const formData = reactive({
    storeAcctId: props.storeAccId,
    prodPId: props.prodPId,
    categoryId: '', // 类目的叶子id
    categoryTreeName: '',
    cateTreeName: '',
    title: '',
    longMarketImage: '', // 场景图
    squareMarketImage: '', // 白底图
    templateVideoUrl: '', // 基础模板的视频
    videoUrl: '', // 本地上传的视频链接或者模板视频的链接
    mediaCenterVideoUrl: '', // 媒体中心的视频
    videoSource: '', // local 本地视频 center 媒体中心视频
    mediaId: '',
    posterUrl: '',
    videoFileName: '', // 视频名称
    hsCode: '',
    productDescription: '',
    prodListingMiraviaPropertyList: [], // 分类属性
    mainImageUrls: '',
    hasVideo: false, // 是否有视频
    isCancelVideo: false,
    hsText: '',
    mainImageUrlList: [],
    prodListingSubSkuMiraviaList: [] // 变种信息
  });
  const formRules = reactive({
    categoryTreeName: [
      { required: true, message: '请选择平台类目', trigger: 'change' }
    ],
    title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }]
  });
  const loading = ref(false);

  // const skuSubSpecList = ref([]); // 变种信息 规格动态列
  const mulSetting = reactive({
    mainSet: '', // 主规格
    assistSet: '', // 次规格
    mainOa: '',
    assistOa: '',

    skuProperty: [],
    color: '',
    size: '',
    style: '',
    skuImageList: '',
    eanCode: '',
    packageWeight: '', // 重量
    skuPrice: '', // 建议零售价
    skuStock: '', // 库存
    skuDiscountPrice: '', // 促销价
    supplierPrice: '', // 价格
    purchaseCostPrice: '', // 成本
    packageLength: '', // 长
    packageWidth: '', // 宽
    packageHeight: '' // 高
  });

  onMounted(() => {
    if (props.action === 'create') {
      initMiravia();
    }
    if (props.action === 'update') {
      getPublishDetail();
    }
  });

  const assistImgList = ref([]);
  const mainImgUrl = ref(''); // 主图
  const skuImageMap = ref([]);
  const logisAttrList = ref('');
  // 初始化 生成商品弹窗
  const initMiravia = async () => {
    try {
      const { code, data } = await initMiraviaProduct({
        prodPId: props.prodPId,
        storeAcctId: props.storeAccId
      });
      if (code === '0000') {
        let equalList = [
          'title',
          'cateTreeName',
          'categoryTreeName',
          'categoryId',
          'videoUrl',
          'templateVideoUrl',
          'mediaCenterVideoUrl'
        ];
        equalList.forEach((item) => {
          formData[item] = data[item] || '';
        });
        mainImageUrlList.value = data.mainImageUrlList || []; // 图片列表 第一张为主图
        // 主图
        mainImgUrl.value = mainImageUrlList.value[0] || '';
        // 辅图
        assistImgList.value = mainImageUrlList.value.slice(1);
        if (
          formData.videoUrl ||
          formData.mediaCenterVideoUrl ||
          formData.templateVideoUrl
        ) {
          formData.hasVideo = true;
        }
        isShowVideo.value = true;
        formData.squareMarketImage = data.squareMarketImage || '';
        // 描述
        descObj.value = {
          info: JSON.parse(data.productDescriptionNew).moduleList || []
        };
        // 增加 skuProperty
        data.prodListingSubSkuMiraviaDtoList?.forEach((item) => {
          item.skuProperty = mulSetting.skuProperty;
        });
        logisAttrList.value = data?.logisAttrList;
        // 变种信息
        formData.prodListingSubSkuMiraviaList =
          data.prodListingSubSkuMiraviaDtoList || [];
        // sku包含的所有图片以及映射关系
        skuImageMap.value = data.skuImageMap || [];
        changeWeightAndSize();
        mapSaleStatus();
        // 映射的平台类目id
        if (formData.categoryId) {
          queryCateAttrList();
          querySaleCateAttrList();
          handleSpecData();
          getHsCodeAndText();
        }
        // 定价
        initPrice(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 映射销售状态
  const mapSaleStatus = () => {
    // 修改变种信息中的销售状态 active => true  inactive => false
    formData.prodListingSubSkuMiraviaList?.forEach((item) => {
      if (item.prodStatus === 'active') {
        item.prodStatus = true;
      }
      if (item.prodStatus === 'inactive') {
        item.prodStatus = false;
      }
    });
  };

  // 修改重量和尺寸为整数
  const changeWeightAndSize = () => {
    formData.prodListingSubSkuMiraviaList?.forEach((item) => {
      item.packageWeight = Math.round(item.packageWeight).toString();
      item.packageLength = Math.round(item.packageLength).toString();
      item.packageWidth = Math.round(item.packageWidth).toString();
      item.packageHeight = Math.round(item.packageHeight).toString();
    });
  };

  // 获取刊登详情
  const detailProdPId = ref(null);
  const detailInfo = ref({});
  const tempSkuImgMap = ref([]);
  const getPublishDetail = async () => {
    try {
      const { code, data } = await getDetail({
        listingId: props.listingId
      });
      if (code === '0000') {
        tempSkuImgMap.value = data.skuImageMap;
        Object.keys(formData).forEach((item) => {
          if (data[item]) formData[item] = data[item];
        });
        descObj.value = {
          info: JSON.parse(data.productDescriptionNew).moduleList || []
        };

        mainImgUrl.value = data.mainImageUrlList[0] || '';
        mainImageUrlList.value = data.mainImageUrlList || [];
        // 辅图
        assistImgList.value = data.mainImageUrlList?.slice(1);
        if (
          formData.videoUrl ||
          formData.mediaCenterVideoUrl ||
          formData.templateVideoUrl
        ) {
          formData.hasVideo = true;
        }
        isShowVideo.value = true;
        // 获取海关信息
        getHsCodeAndText();
        // 获取分类属性
        // 如果不是销售属性 展示在分类属性中
        data.prodCateAttrMiraviaDtoList?.forEach((item) => {
          if (!item.attrValueId) {
            item.attrValueId = item.attrValue || '';
          }
        });

        judgeAttrComponent(data);

        detailInfo.value = data;
        detailProdPId.value = data.prodPId;
        querySaleCateAttrList(data);
        data.prodListingSubSkuMiraviaDtoList?.forEach((item) => {
          item.skuProperty = item?.skuProperty
            ? JSON.parse(item.skuProperty)
            : '';
        });
        formData.prodListingSubSkuMiraviaList =
          data.prodListingSubSkuMiraviaDtoList;
        // 修改重量和尺寸为整数
        changeWeightAndSize();
        mapSaleStatus();
        // 定价
        initPrice(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 类目属性组件类型判断
  const judgeAttrComponent = (data) => {
    let prodCateAttrMiraviaDtoList = [];
    let multiObj = {};
    data.prodCateAttrMiraviaDtoList?.forEach((val) => {
      // 详情 将单位/单位计数再反显为中文
      if (val.attrNameId === 200315261) {
        val.attrValueId = val.attrValueId ? val.attrValueId : 1;
        val.attrName = '单位计数';
      }
      if (val.attrNameId === 300248001) {
        val.attrValueId = val.attrValueId ? val.attrValueId : 2002091090;
        val.attrName = '单位';
        val.optionalValueList = UNIT_TYPE_CN_OPTION_LIST;
      }

      // 将多选的属性整合
      if ([4, 8].includes(Number(val.attributeShowTypeValue))) {
        let { attrNameId } = val;
        if (!multiObj[attrNameId]) {
          if (val.attrValueId) {
            val['attrValueId'] = [val.attrValueId];
          }
          multiObj[attrNameId] = val;
        } else {
          multiObj[attrNameId].attrValueId?.push(val.attrValueId);
        }
      } else {
        prodCateAttrMiraviaDtoList.push(val);
      }
    });
    let list = Object.values(multiObj);
    prodCateAttrMiraviaDtoList = prodCateAttrMiraviaDtoList?.concat(list);

    // 区分必填项和非必填项 将商品物流属性防在必填项中
    prodListingMiraviaPropertyRequiredList.value =
      prodCateAttrMiraviaDtoList?.filter((item) => {
        return item.required || item.attrName === '危险品';
      });
    prodListingMiraviaPropertyNotRequiredList.value =
      prodCateAttrMiraviaDtoList?.filter((item) => {
        return !item.required && item.attrName !== '危险品';
      });
  };

  // 商品物流属性类目映射
  const attrMapList = ref([]);
  const getBizDict = async () => {
    try {
      const { code, data } = await getBizDictByCode();
      if (code === '0000') {
        // 获取商品物流属性的 optionalValueList
        let list = prodListingMiraviaPropertyRequiredList.value?.filter(
          (item) => item.attrName === '危险品'
        );
        let optionalValueList = list[0]?.optionalValueList;
        let attrIdList = [];
        let attrNameList = [];
        data?.forEach((item) => {
          if (logisAttrList.value?.indexOf(item.name) > -1) {
            attrMapList.value.push(item.name);
            attrNameList.push(item.code);
          }
        });
        optionalValueList.forEach((item) => {
          if (attrNameList?.includes(item.name)) {
            attrIdList.push(item.id);
          }
        });
        prodListingMiraviaPropertyRequiredList.value?.forEach((item) => {
          if (item.attrName === '危险品') {
            item.attrValueId = attrIdList;
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 改变描述
  const changeDesc = ({ type, val }) => {
    descObj.value[type] = val;
  };

  // 获取子sku table数据
  const fullTableData = ref([]);
  const getSkuTableData = () => {
    const { fullData } = miraviaTableRef.value.getTableData();
    fullTableData.value = fullData;
  };

  // 获取产品标题
  const getMiraviaProduct = async () => {
    try {
      const { code, data } = await queryMiraviaPublishTitle(props.prodPId);
      if (code === '0000') {
        formData.title = data || '';
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 同步分类属性
  const handleSyncAttr = () => {
    if (!formData.categoryId) {
      return ElMessage.warning('请先选择平台类目！');
    }
    try {
      ElMessageBox.confirm(
        '重新同步分类属性可能导致当前填写的分类属性数据丢失，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        loading.value = true;
        let params = {
          storeAcctId: props.storeAccId,
          cateId: formData.categoryId
        };
        const { code } = await syncCateAttr(params);
        loading.value = false;
        if (code === '0000') {
          ElMessage.success('同步成功！');
        }
      });
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const showCateDialog = ref(false);
  const handleCateDialogType = ref('');
  // 打开类目弹窗
  const handleCateDialogOpen = (type) => {
    showCateDialog.value = true;
    handleCateDialogType.value = type;
  };

  // 选择完平台类目
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    showCateDialog.value = e.isShow;
    if (handleCateDialogType.value == 'miravia') {
      formData.categoryTreeName = e.cate.value.fullCateName;
      formData.categoryId = e.cate.value.categoryId;
    }
    queryCateAttrList();
    querySaleCateAttrList(undefined, 'changeCate');
    getHsCodeAndText();
  };

  // 根据类目获取类目属性
  const queryCateAttrList = async () => {
    try {
      const { code, data } = await queryCateAttr({
        categoryId: formData.categoryId,
        isSaleProp: false, // 不是销售属性
        prodPId:
          formData.prodListingSubSkuMiraviaList[0].prodPId ||
          detailProdPId.value,
        firstProdTempId: formData.prodListingSubSkuMiraviaList[0].prodTempId,
        multiSku: getIsMultiSku(formData.prodListingSubSkuMiraviaList) // 单属性不映射
      });
      if (code === '0000') {
        // 初始默认值: 300248001的是单位 展示 个/件->2002091090 ;200315261的是单位计数 展示 1
        data.forEach((item) => {
          if (item.attrNameId === 200315261) {
            item.attrValueId = 1;
            item.attrName = '单位计数';
          }
          if (item.attrNameId === 300248001) {
            item.attrValueId = 2002091090;
            item.attrName = '单位';
            item.optionalValueList = UNIT_TYPE_CN_OPTION_LIST;
          }
          if (
            item.attrName === '品牌' &&
            (!item.defaultValueList || item.defaultValueList.length == 0)
          ) {
            item.defaultValueList = ['No Brand'];
          }
        });
        // 对有默认值的属性进行回显 根据defaultValueList
        let handleDeafultAttr = data.map((item) => {
          // judgeAttrShowType(item) 返回单选1 多选2 单选自定义下拉单选3 文本框4 多选自定义下拉5
          // 2,5是多选
          if ([2, 5].includes(judgeAttrShowType(item))) {
            if (
              Array.isArray(item.defaultValueList) &&
              item.defaultValueList.length > 0
            ) {
              item.attrValueId = [];
              item.defaultValueList.forEach((cItem) => {
                const option =
                  item.optionalValueList?.filter((v) => v.name === cItem) || [];
                item.attrValueId.push(option.length ? option[0].id : cItem);
              });
            }
          } else {
            // 单选
            if (item.defaultValueList?.length) {
              item.defaultValueList.forEach((cItem) => {
                const option =
                  item.optionalValueList?.filter((v) => v.name === cItem) || [];
                // 文本框
                if (judgeAttrShowType(item) === 4) {
                  // 文本框直接展示值
                  item.attrValueId = option.length ? cItem : '';
                } else {
                  item.attrValueId = option.length ? option[0].id : cItem;
                }
              });
            }
          }
          return item;
        });
        // 如果不是销售属性 展示在分类属性中
        prodListingMiraviaPropertyRequiredList.value =
          handleDeafultAttr?.filter((item) => {
            return item.required || item.attrName === '危险品';
          });
        prodListingMiraviaPropertyNotRequiredList.value =
          handleDeafultAttr?.filter((item) => {
            return !item.required && item.attrName !== '危险品';
          });
        getBizDict();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 判断属性展示类型
  const judgeAttrShowType = (item) => {
    /**
     * 根据平台返回调整:
     * attributeShowTypeValue 3 单选下拉
     * attributeShowTypeValue 4 多选下拉
     * attributeShowTypeValue 8 自定义输入多选下拉框
     * attributeShowTypeValue为其他 optionalValueList有选项 自定义输入单选下拉框
     * attributeShowTypeValue为其他 optionalValueList无选项或者字段都没有 自定义输入单选下拉框
     * **/
    if (item.attributeShowTypeValue == 3) {
      return 1;
    } else if (item.attributeShowTypeValue == 4) {
      return 2;
    } else if (
      item.attributeShowTypeValue != 3 &&
      item.attributeShowTypeValue != 4 &&
      item.attributeShowTypeValue != 8 &&
      item?.optionalValueList?.length
    ) {
      return 3;
    } else if (
      item.attributeShowTypeValue != 3 &&
      item.attributeShowTypeValue != 4 &&
      item.attributeShowTypeValue != 8 &&
      !item?.optionalValueList
    ) {
      return 4;
    } else if (item.attributeShowTypeValue == 8) {
      return 5;
    }
  };
  provide('judgeAttrShowType', judgeAttrShowType);

  // 判断是否是单属性sku列表
  const getIsMultiSku = (list = []) => {
    return list.length > 1 ? true : false;
  };

  // 根据类目获取类目属性 销售属性
  const saleAttrList = ref([]);
  const querySaleCateAttrList = async (res, type = '') => {
    let skuTableList = formData?.prodListingSubSkuMiraviaList || [];
    if (res && res.prodListingSubSkuMiraviaDtoList.length) {
      skuTableList = res.prodListingSubSkuMiraviaDtoList;
    }

    try {
      const { code, data } = await queryCateAttr({
        categoryId: formData.categoryId,
        isSaleProp: true, // 不是销售属性
        prodPId: skuTableList[0]?.prodPId || detailProdPId.value,
        firstProdTempId: skuTableList[0].prodTempId,
        multiSku: getIsMultiSku(skuTableList) // 单属性不映射
      });
      if (code === '0000') {
        saleAttrList.value = data || [];
        // 如果是销售属性 则作为规格信息下拉数据
        if (props.action === 'create') {
          initAttrData();
        }
        if (props.action === 'update') {
          // 切换平台类目id
          if (type === 'changeCate') {
            initAttrData();
          } else {
            // 详情逻辑不动
            // 根据第一条数据的skuProperty 可以确定表格的列数 以及主规格 次规格的值
            let skuColumn =
              detailInfo.value?.prodListingSubSkuMiraviaDtoList[0]?.skuProperty;
            // 单属性不返回skuProperty 不映射
            if (skuColumn) {
              let skuColumnCopy = JSON.parse(JSON.stringify(skuColumn));
              if (skuColumnCopy) {
                let mainObj = skuColumnCopy[0];
                let assistObj = skuColumnCopy[1] || {};
                // 判断规格是否是自定义 进行不同的回显
                let isNotMainCustom = saleAttrList.value?.some((item) => {
                  return item.attrNameId == mainObj?.skuPropertyId;
                });
                let isNotAssistCustom = saleAttrList.value?.some(
                  (item) => item.attrNameId == assistObj?.skuPropertyId
                );

                // 刚进入详情 不映射OA规格 只有切换平台类目才映射
                mulSetting.mainSet = isNotMainCustom
                  ? mainObj?.skuPropertyId
                  : mainObj?.skuPropertyName;
                mulSetting.mainOa = '';

                mulSetting.assistSet = isNotAssistCustom
                  ? assistObj?.skuPropertyId
                  : assistObj?.skuPropertyName;
                mulSetting.assistOa = '';

                skuColumnCopy?.forEach((item) => {
                  item.skuPropertyValue = '';
                  item.propertyValueId = '';
                  item.skuPropertyId = '';
                });
              }
              mulSetting.skuProperty = skuColumnCopy ? skuColumnCopy : [];
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 根据销售属性默认主规格和次规格数据
  const initAttrData = () => {
    // 单属性商品不映射
    // 多属性:
    // 根据返回的saleAttrType去映射 1 主规格 2 次规格 可能为null; oaAttrGroupName 代表oa映射枚举
    // let attrColorId = '';
    // let attrSizeId = '';

    const mainIndex = saleAttrList.value?.findIndex(
      (item) => Number(item.saleAttrType) === 1
    );
    const assistIndex = saleAttrList.value?.findIndex(
      (item) => Number(item.saleAttrType) === 2
    );
    mulSetting.mainSet =
      mainIndex > -1 ? saleAttrList.value[mainIndex].attrNameId : '';
    mulSetting.mainOa =
      mainIndex > -1 ? saleAttrList.value[mainIndex].oaAttrGroupName : '';
    mulSetting.assistSet =
      assistIndex > -1 ? saleAttrList.value[assistIndex].attrNameId : '';
    mulSetting.assistOa =
      assistIndex > -1 ? saleAttrList.value[assistIndex].oaAttrGroupName : '';
    // let newData = formData.prodListingSubSkuMiraviaList[0] || {};
    // if (newData.color && !newData.size) {
    //   mulSetting.mainSet = attrColorId;
    //   mulSetting.mainOa = 'color';
    // }
    // if (!newData.color && newData.size) {
    //   mulSetting.mainSet = attrSizeId;
    //   mulSetting.mainOa = 'size';
    // }
    // // 多属性 基础模板里的color有值时，自动选择颜色系列为主规格，并映射OA的color
    // // 当基础模板里的size有值时，自动选择尺寸系列为次规格，并映射OA的size
    // if (newData.color && newData.size) {
    //   mulSetting.mainSet = attrColorId;
    //   mulSetting.mainOa = 'color';
    //   mulSetting.assistSet = attrSizeId;
    //   mulSetting.assistOa = 'size';
    // }
    handleSpecData();
    handleMapSkuImage(mulSetting.mainOa); // 初始化时 颜色系列规格属性默认是 color
  };

  // 对颜色系列的图片(或者customizedPic 为 true)进行初始化映射
  // 主规格一致的sku必须取相同的sku图 图片取两个sku拥有的图片的第一张图片
  const handleMapSkuImage = (spec) => {
    if (spec) {
      let skuImageMapCopy =
        props.action === 'create'
          ? JSON.parse(JSON.stringify(skuImageMap.value))
          : JSON.parse(JSON.stringify(tempSkuImgMap.value));
      // 获取主规格属性值（比如 color: red, size： L）相同的数据, 获取到数据中对应的 prodTempId
      // prodTempId 则对应 skuImageMap 的 key
      // 先替换 skuImageMap key 为规格属性
      formData.prodListingSubSkuMiraviaList?.forEach((item) => {
        let newSpec = specificationMap(spec, item);
        Object.keys(skuImageMapCopy)?.forEach((cItem) => {
          if (Number(cItem) === Number(item.prodTempId)) {
            let newList = skuImageMapCopy[newSpec] || [];
            skuImageMapCopy[newSpec] = newList?.concat(skuImageMapCopy[cItem]);
            delete skuImageMapCopy[cItem];
          }
        });
      });

      formData.prodListingSubSkuMiraviaList?.map((item) => {
        let newSpec = specificationMap(spec, item);
        item.skuImageList =
          (skuImageMapCopy[newSpec] && skuImageMapCopy[newSpec][0]?.name) || '';
        return item;
      });
    } else {
      // 清空映射OA规格 自动映射模板sku图片当前项的第一张
      formData.prodListingSubSkuMiraviaList?.forEach((item) => {
        Object.keys(tempSkuImgMap.value)?.forEach((tItem) => {
          if (Number(tItem) === Number(item.prodTempId)) {
            item.skuImageList = tempSkuImgMap.value[tItem][0]?.name;
          }
        });
      });
    }
  };

  // 是否显示不必填的属性
  const showNotRequired = ref(false);
  const toggleAttr = () => {
    showNotRequired.value = !showNotRequired.value;
  };

  const dropEl = reactive({
    startEl: null, // 拖动开始的元素
    endEl: null // 拖动的结束元素
  });
  const detailRef = ref(null);
  const dragStart = (e) => {
    dropEl.startEl = e.target || e.srcElement;
    comHidePopover(detailRef);
  };

  const dragover = (e) => {
    e.preventDefault();
  };

  const drop = (e) => {
    dropEl.endEl = e.target || e.srcElement;
    e.preventDefault();
    // 拖动元素，放置目标
    if (dropEl.startEl && dropEl.endEl) {
      // 交换
      let startI = dropEl.startEl.id;
      let endI = dropEl.endEl.id;
      assistImgList.value[startI] = dropEl.endEl.src;
      assistImgList.value[endI] = dropEl.startEl.src;
    }
  };

  // 本地上传图片
  const importSuccess = (res) => {
    if (res.code === '0000') {
      if (assistImgList.value.length + 1 >= 8) {
        return ElMessage.warning('商品图片仅支持1-8张');
      }
      assistImgList.value.push(res.msg);
      concatMainAssitImg();
    } else {
      ElMessage.error(res.msg);
    }
  };

  // 设为主图
  const setMainImg = (src, index) => {
    assistImgList.value[index] = mainImgUrl.value;
    mainImgUrl.value = src;
    ElMessage.success('设置主图成功！');
    concatMainAssitImg();
  };

  // 移除图片
  const handleRemove = (index) => {
    assistImgList.value.splice(index, 1);
    concatMainAssitImg();
  };

  const showNetworkImg = ref(false); // 网络图片
  const networkImgUrls = ref('');
  const netWorkType = ref('');
  const rowIndex = ref(0);

  // 上传网络图片
  const uploadNetworkImg = (type = '', idx) => {
    showNetworkImg.value = true;
    networkImgUrls.value = '';
    netWorkType.value = type;
    rowIndex.value = idx;
  };
  // 模板图片选择后处理 basic 商品图片 white 白底图 scene 场景图 list 变种信息sku图
  const handleUpload = () => {
    let imgList = networkImgUrls.value.split('\n');
    if (netWorkType.value === 'basic') {
      if (assistImgList.value.length + 1 + imgList.length > 8) {
        return ElMessage.warning(
          `商品图片仅支持1-8张, 您最多还能上传${
            8 - assistImgList.value.length - 1
          }张！`
        );
      }
      assistImgList.value = assistImgList.value.concat(imgList);
    }
    if (netWorkType.value === 'white') {
      if (
        imgList.length > 1 ||
        formData.squareMarketImage.length + imgList.length > 1
      ) {
        return ElMessage.warning('白底图只支持1张！');
      }
      formData.squareMarketImage = imgList[0];
    }
    if (netWorkType.value === 'scene') {
      if (
        imgList.length > 1 ||
        formData.longMarketImage.length + imgList.length > 1
      ) {
        return ElMessage.warning('场景图只支持1张！');
      }
      handleSetScene(imgList[0]);
    }
    if (netWorkType.value === 'list') {
      // 变种信息列表上传网络图片
      if (imgList?.length > 1) {
        return ElMessage.warning('sku预览图只支持一张图片！');
      }
      formData.prodListingSubSkuMiraviaList[rowIndex.value].skuImageList =
        imgList[0];
    }
    showNetworkImg.value = false;
    concatMainAssitImg();
  };
  const closeNetwork = () => {
    showNetworkImg.value = false;
  };

  // 本地上传白底图图片
  const importWhiteSuccess = (res) => {
    if (res.code === '0000') {
      if (formData.squareMarketImage.length >= 1) {
        return ElMessage.warning('白底图仅支持1张');
      }
      formData.squareMarketImage = res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };

  // 本地上传场景图图片
  const importSceneSuccess = (res) => {
    if (res.code === '0000') {
      if (formData.longMarketImage.length >= 1) {
        return ElMessage.warning('场景图仅支持1张');
      }
      handleSetScene(res.msg);
    } else {
      ElMessage.error(res.msg);
    }
  };

  // 移除白底图
  const handleRemoveWhite = () => {
    formData.squareMarketImage = '';
  };

  // 移除场景图
  const handleRemoveScene = () => {
    formData.longMarketImage = '';
  };

  // 设为白底图
  const handleSetWhite = (url) => {
    formData.squareMarketImage = url;
  };

  // 设为场景图
  const handleSetScene = (url) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let image = new Image();
    image.src = url;
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = async () => {
      const realWidth = image.width;
      const realHeight = image.height;
      canvas.width = realWidth - 250;
      canvas.height = realHeight;
      // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
      // 将左右各裁剪125像素后， 放入3:4场景图
      ctx.drawImage(
        image,
        125,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // 将 canvas 转换为新的图片文件
      const newImageURL = canvas.toDataURL('image/jpeg');

      // 将图片base64转换为图片链接
      let reg =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
      if (reg.test(newImageURL)) {
        let obj = {
          base64FileStr: newImageURL
        };
        try {
          const { code, msg } = await tansferImageApi(obj);
          if (code === '0000') {
            formData.longMarketImage = msg || '';
          }
        } catch (err) {
          console.log(err);
          formData.longMarketImage = url;
        }
      }
    };
  };

  const importError = () => {};

  // 点击模板图片
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const remainderLimit = ref(0);
  const uploadTempType = ref('');
  const uploadTempImg = async (type, idx) => {
    // 最多上传图片限制
    remainderLimit.value =
      type !== 'basic' ? 1 : 8 - assistImgList.value.length;

    if (type === 'list') {
      await emit('getTableData');
      rowIndex.value = idx;
    }
    uploadTempType.value = type;
    tplImgVisible.value = true;

    tplImgParams.value = {
      platCode: 'miravia',
      prodSSkus: formData.prodListingSubSkuMiraviaList.map(
        (item) => item.prodSSku
      )
    };
  };

  // 渲染选择的模板图片
  const getTplImg = (imgUrlList) => {
    if (uploadTempType.value === 'list') {
      formData.prodListingSubSkuMiraviaList[rowIndex.value].skuImageList =
        imgUrlList[0];
    }

    if (uploadTempType.value === 'basic') {
      assistImgList.value = assistImgList.value.concat(imgUrlList);
    }
    if (uploadTempType.value === 'white') {
      formData.squareMarketImage = imgUrlList[0];
    }
    if (uploadTempType.value === 'scene') {
      formData.longMarketImage = imgUrlList[0];
    }
  };

  // 合并主图和辅图
  const concatMainAssitImg = () => {
    mainImageUrlList.value = [mainImgUrl.value].concat(assistImgList.value);
  };

  // 获取海关信息
  const hsInfoList = ref([]);
  const getHsCodeAndText = async () => {
    try {
      let params = {
        categoryId: formData.categoryId,
        title: formData.title,
        mainImageUrls: mainImgUrl.value,
        storeAcctId: props.storeAccId
      };
      const { code, data } = await queryHsCodeAndText(params);
      if (code === '0000') {
        hsInfoList.value = data || [];
        // 默认选中第一个
        if (data.length) {
          formData.hsCode = hsInfoList.value[0].hsCode;
        }
        hsInfoList.value?.forEach((item) => {
          item.hsCodeDesc = item.hsCodeDesc?.replace(/<br\/>/g, '\n') || '';
          item.parentHsCodeDesc =
            item.parentHsCodeDesc?.replace(/<br\/>/g, '\n') || '';
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 本地上传视频文件后更新 formData
  const updateFormData = (res) => {
    formData.videoUrl = res.data;
    formData.mediaCenterVideoUrl = '';
    formData.posterUrl = '';
    formData.mediaId = '';
    formData.videoFileName =
      res.data.split('/')[res.data.split('/').length - 1];
    formData.hasVideo = true;
    formData.videoSource = 'local';
  };

  // 从媒体中心选择
  const chooseMedia = (data) => {
    let { url, name, coverUrl, storeName } = data[0];
    formData.mediaCenterVideoUrl = url;
    formData.videoFileName = name;
    formData.posterUrl = coverUrl;
    formData.mediaId = storeName;
    formData.videoUrl = '';
    formData.hasVideo = true;
    formData.videoSource = 'center';
  };

  // 切換取消上传视频
  const changeIsCancel = (val) => {
    formData.isCancelVideo = val[0];
  };

  // 选择主规格后
  const changeMainSpec = () => {
    // 将次规格选择的数据 映射OA规格清空
    mulSetting.assistSet = '';
    mulSetting.assistOa = '';
    mulSetting.mainOa = '';
    // formData.prodListingSubSkuMiraviaList?.forEach((item) => {
    //   item.skuImageList = '';
    // });
    handleSpecData();
  };

  // 选择次规格后
  const changeAssistSpec = (val) => {
    if (val && !mulSetting.mainSet) {
      mulSetting.assistSet = '';
      return ElMessage.warning('请先选择主规格！');
    }
    mulSetting.assistOa = '';
    handleSpecData();
  };
  const miraviaTableRef = ref(null);

  // 获取规格名称
  const getSkuPropertyName = (attrNameId) => {
    let chooseList = saleAttrList.value?.filter((item) => {
      return item.attrNameId === attrNameId;
    });
    if (chooseList?.length > 0) {
      return chooseList[0]?.attrName;
    } else {
      return attrNameId;
    }
  };

  // 初始化表格数据动态规格规格属性
  const initTableRowProperty = (row) => {
    let addProperty = JSON.parse(JSON.stringify(mulSetting.skuProperty));
    addProperty?.forEach((cItem) => {
      row.skuProperty?.forEach((sItem) => {
        if (cItem.skuPropertyName === sItem.skuPropertyName) {
          cItem.skuPropertyValue = sItem.skuPropertyValue || '';
          cItem.propertyValueId = sItem.propertyValueId || '';
          cItem.skuPropertyId = sItem.skuPropertyId || '';
        }
      });
    });
    row.skuProperty = addProperty;
  };

  // 动态列 规格数据
  // 初始init 选择主规格/次规格都会调用这个
  const handleSpecData = () => {
    let mainSkuPropertyName = getSkuPropertyName(mulSetting.mainSet);
    let assistSkuPropertyName = getSkuPropertyName(mulSetting.assistSet);

    mulSetting.skuProperty = [];
    if (mulSetting.mainSet) {
      mulSetting.skuProperty = [
        {
          skuPropertyValue: '',
          skuPropertyName: mainSkuPropertyName,
          propertyValueId: '',
          skuPropertyId: '',
          mainOa: mulSetting.mainOa,
          assistOa: ''
          // assistOa: mulSetting.assistOa
        }
      ];
      if (mulSetting.assistSet) {
        mulSetting.skuProperty.push({
          skuPropertyValue: '',
          skuPropertyName: assistSkuPropertyName,
          propertyValueId: '',
          skuPropertyId: '',
          // mainOa: mulSetting.mainOa,
          mainOa: '',
          assistOa: mulSetting.assistOa
        });
      }
    }

    // 增加 skuProperty 用于变种信息列表绑定
    // 根据主次规格选中的OA规格去映射颜色/尺寸输入框
    // 当主次规则发生转化时 将输入框的数据一并转换
    formData.prodListingSubSkuMiraviaList?.forEach((item) => {
      initTableRowProperty(item);
    });

    if (props.action == 'create') {
      mapOASpec();
    }
    miraviaTableRef.value.refreshColumn();
  };

  // 根据选中的oa规格去映射颜色和尺寸
  const specificationMap = (spec, row) => {
    if (spec === 'color-style') {
      return row.color + `${row.color && row.style ? '-' : ''}` + row.style;
    } else if (spec === 'color-size') {
      return row.color + `${row.color && row.size ? '-' : ''}` + row.size;
    } else if (spec === 'style-size') {
      return row.style + `${row.style && row.size ? '-' : ''}` + row.size;
    } else if (spec === 'color-style-size') {
      return (
        row.color +
        `${row.color ? '-' : ''}` +
        row.style +
        `${row.style && row.size ? '-' : ''}` +
        row.size
      );
    } else if (spec === 'color') {
      return row.color;
    } else if (spec === 'size') {
      return row.size;
    } else if (spec === 'style') {
      return row.style;
    }
  };

  // 根据选的OA规格 来映射子sku (改变主次规格的下拉 也会调用这个 传参是main assist)
  const mapOASpec = (type = 'custom') => {
    // 根据选择的OA规格，映射变种信息列表中的OA属性，将OA属性的值填充到动态的规格列中
    let mainOASpec = mulSetting.mainOa; // 主属性
    let assistOASpec = mulSetting.assistOa; // 次属性
    formData.prodListingSubSkuMiraviaList?.forEach((item) => {
      item.skuProperty?.forEach((cItem, cIndex) => {
        if (cIndex === 0) {
          cItem.mainOa = mainOASpec;
        }
        if (cIndex === 1) {
          cItem.assistOa = assistOASpec;
        }
        if (type === 'main' || type === 'custom') {
          if (cItem.mainOa && cItem.mainOa === mainOASpec) {
            cItem.skuPropertyValue = specificationMap(mainOASpec, item);
          }
        }
        if (type === 'assist' || type === 'custom') {
          if (cItem.assistOa && cItem.assistOa === assistOASpec) {
            cItem.skuPropertyValue = specificationMap(assistOASpec, item);
          }
        }
      });
    });
  };

  // 选择映射OA规格
  const chooseMainOA = () => {
    if (!mulSetting.mainSet) {
      return ElMessage.warning('请先选择主规格！');
    }
    // 根据选择的OA规格，映射变种信息列表中的OA属性，将OA属性的值填充到动态的规格列中
    mapOASpec('main');
    let chooseMain = saleAttrList.value?.filter((item) => {
      return item.attrNameId === mulSetting.mainSet;
    });

    // attr_name != "尺寸"的属性都可以挂载sku图
    console.log('chooseMain[0]?.attrName', chooseMain);
    if (chooseMain && chooseMain[0]?.attrName !== '尺寸') {
      handleMapSkuImage(mulSetting.mainOa);
    }
  };

  const chooseAssistOA = () => {
    if (!mulSetting.assistSet) {
      return ElMessage.warning('请先选择次规格！');
    }
    mapOASpec('assist');
    let chooseAssist = saleAttrList.value?.filter((item) => {
      return item.attrNameId === mulSetting.assistSet;
    });
    if (chooseAssist && chooseAssist[0]?.attrName !== '尺寸') {
      handleMapSkuImage(mulSetting.assistOa);
    }
  };

  // 自定义变种信息
  const changeCustom = debounce((val, skuPropName, idx, rowIndex) => {
    // 根据 映射OA规格 对应 OA属性
    // 相同的 OA属性 赋予相同的自定义属性值

    // 根据 skuPropName 获取映射的OA规格
    let oaSpec = '';
    mulSetting.skuProperty?.forEach((item, index) => {
      if (item.skuPropertyName === skuPropName) {
        if (index === 0) {
          oaSpec = mulSetting.mainOa;
        } else {
          oaSpec = mulSetting.assistOa;
        }
      }
    });
    // OA属性的值
    if (oaSpec) {
      let currentprodPId =
        formData.prodListingSubSkuMiraviaList[rowIndex]['prodPId'];
      let targetAttrVal =
        formData.prodListingSubSkuMiraviaList[rowIndex][oaSpec];
      formData.prodListingSubSkuMiraviaList?.forEach((item) => {
        if (
          item[oaSpec] === targetAttrVal &&
          item['prodPId'] == currentprodPId
        ) {
          item.skuProperty?.forEach((cItem, cIndex) => {
            if (cIndex === idx) {
              cItem.skuPropertyValue = val;
            }
          });
        }
      });
    }
  }, 200);

  // 移除变种信息
  const removeInfo = (row) => {
    formData.prodListingSubSkuMiraviaList =
      formData.prodListingSubSkuMiraviaList.filter(
        (item) => item.prodTempId !== row.prodTempId
      );
  };

  // 批量设置
  const handleSet = () => {
    let obj = {
      packageWeight: '', // 重量
      skuPrice: '', // 建议零售价
      skuStock: '', // 库存
      skuDiscountPrice: '', // 促销价
      supplierPrice: '', // 价格
      purchaseCostPrice: '', // 成本
      packageLength: '', // 长
      packageWidth: '', // 宽
      packageHeight: '' // 高
    };
    Object.keys(obj).forEach((item) => {
      formData.prodListingSubSkuMiraviaList.forEach((cItem) => {
        if (mulSetting[item] !== '') {
          cItem[item] = mulSetting[item];
        }
      });
    });
  };

  const addSku = ref('');
  // 新增变种
  const handleAddInfo = async () => {
    if (!addSku.value) {
      return ElMessage.warning('请填写新增的sku');
    }
    let skuArr = addSku.value?.split(',');
    if (skuArr?.length === 1) {
      // 只新增一条sku时，进行重复校验
      let listIds = formData.prodListingSubSkuMiraviaList.map(
        (item) => item.storeSSku
      );
      if (listIds.includes(skuArr[0].trim())) {
        return ElMessage.warning('商品已存在！');
      } else {
        handleAddSku();
      }
    }
    if (skuArr.length > 1) {
      // 新增多条sku时， 不用进行重复校验
      handleAddSku();
    }
  };

  // 新增变种信息接口调用
  const handleAddSku = async () => {
    try {
      let params = {
        storeAcctId: props.storeAccId,
        prodSSku: addSku.value
      };
      const { code, data } = await addSkuInfo(params);
      if (code === '0000') {
        let skuList = data || [];
        let listIds = formData.prodListingSubSkuMiraviaList.map(
          (item) => item.prodTempId
        );

        // 如果新增的变种不存在 就添加进列表
        skuList?.forEach((item) => {
          if (
            props.action === 'create' &&
            !skuImageMap.value[item.prodTempId]
          ) {
            skuImageMap.value[item.prodTempId] = [item];
          } else if (!tempSkuImgMap.value[item.prodTempId]) {
            tempSkuImgMap.value[item.prodTempId] = [item];
          }
          item.name = item.skuImageList;
          if (!listIds.includes(item.prodTempId)) {
            initTableRowProperty(item);
            formData.prodListingSubSkuMiraviaList =
              formData.prodListingSubSkuMiraviaList.concat([item]);
          }
        });
        mapOASpec();
        handleMapSkuImage(mulSetting.mainOa);
        mapSaleStatus();
        ElMessage.success('新增成功！');
        changeWeightAndSize();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // sku 图片上传
  const importSkuImgSuccess = (res, skuPropName, idx, rowIndex) => {
    if (res.code === '0000') {
      formData.prodListingSubSkuMiraviaList[rowIndex].skuImageList = res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };

  const renmoveSkuImg = (index) => {
    formData.prodListingSubSkuMiraviaList[index].skuImageList = '';
  };

  const handleClose = () => {
    emit('close');
  };

  const prodListingMiraviaPropertyList = ref([]);
  const handlePlatAttr = () => {
    prodListingMiraviaPropertyList.value = [];
    let allList = prodListingMiraviaPropertyRequiredList.value.concat(
      prodListingMiraviaPropertyNotRequiredList.value
    );
    let allListCopy = JSON.parse(JSON.stringify(allList));
    allListCopy?.forEach((item) => {
      // 将单位/单位计数再转换为英文
      if (item.attrNameId === 300248001) {
        item.attrName = 'unit count type';
        item.optionalValueList = UNIT_TYPE_EN_OPTION_LIST;
      }
      if (item.attrNameId === 200315261) {
        item.attrName = 'Unit Count';
      }
      // 将多选属性拆开
      if (Array.isArray(item.attrValueId)) {
        item.optionalValueList?.forEach((cItem) => {
          if (item.attrValueId.includes(cItem.id)) {
            let newItem = {};
            newItem.attrValue = cItem.name;
            newItem.attrValueId = cItem.id;
            newItem.attrName = item.attrName;
            newItem.attrNameId = item.attrNameId;
            prodListingMiraviaPropertyList.value.push({ ...item, ...newItem });
          }
        });
      } else {
        // 自定义的属性 属性值id 为空
        let chooseVal = item.optionalValueList?.filter(
          (cItem) => cItem.id === item.attrValueId
        );
        if (chooseVal && chooseVal[0]?.name) {
          item.attrValue = chooseVal[0]?.name;
        } else {
          item.attrValue = item.attrValueId;
          item.attrValueId = '';
        }
        prodListingMiraviaPropertyList.value.push(item);
      }
    });

    formData.prodListingMiraviaPropertyList =
      prodListingMiraviaPropertyList.value;
  };

  // 生成-5 到 -10000 的随机数
  const createRandom = () => {
    return Math.floor(Math.random() * (5 - -10000)) - 10000;
  };

  const handleTableList = () => {
    // 如果都不是自定义的规格信息
    // 判断是否是下拉框选中的规格还是自定义的规格
    // 判断主规格
    let chooseMainAttr = saleAttrList.value?.filter(
      (item) => item.attrNameId === mulSetting.mainSet
    );
    // 判断次规格
    let chooseAssitAttr = saleAttrList.value?.filter(
      (item) => item.attrNameId === mulSetting.assistSet
    );
    formData.prodListingSubSkuMiraviaList?.forEach((item) => {
      item.skuProperty?.forEach((cItem, cIndex) => {
        if (chooseMainAttr && cIndex === 0) {
          // select 选择的主规格 子sku属性值为input自定义，那么属性值id propertyValueId 随机分配小于-5的值
          cItem.skuPropertyId = mulSetting.mainSet;
          cItem.propertyValueId = createRandom();
        }
        if (chooseAssitAttr && cIndex === 1) {
          // select 选择的次规格
          cItem.skuPropertyId = mulSetting.assistSet;
          cItem.propertyValueId = createRandom();
        }
        if (JSON.stringify(chooseMainAttr) === '[]' && cIndex === 0) {
          // 自定义主规格 规格属性名id skuPropertyId 固定为 -2
          cItem.skuPropertyId = -2;
          cItem.propertyValueId = createRandom();
        }
        if (JSON.stringify(chooseAssitAttr) === '[]' && cIndex === 1) {
          // 自定义次规格 规格属性名id skuPropertyId 固定为 -3
          cItem.skuPropertyId = -3;
          cItem.propertyValueId = createRandom();
        }
      });
    });
  };

  // 定时刊登
  let dialogVisible = ref(false);
  let publishOnTimeFormEl = ref();
  let listTiming = ref();
  const publishOnTime = (formEl) => {
    dialogVisible.value = true;
    publishOnTimeFormEl.value = formEl;
  };
  const handlePublsih = () => {
    if (!listTiming.value) {
      ElMessage.warning('请选择定时刊登时间');
      return;
    }
    if (listTiming.value.getTime() <= new Date().getTime()) {
      ElMessage.warning('定时刊登时间需要大于当前时间');
      return;
    }
    handleSave(publishOnTimeFormEl.value, false, listTiming.value.getTime());
    dialogVisible.value = false;
  };

  const cancelPublish = () => {
    dialogVisible.value = false;
    listTiming.value = '';
  };

  // 立即刊登
  const publish = (formEl) => {
    handleSave(formEl, true);
  };

  // 保存&定时刊登||立即刊登
  // isPublishNow：true立即刊登||false定时刊登
  // listTiming： 定时刊登时间
  const handleSave = (formEl, isPublishNow, listTiming) => {
    if (!formEl) return;
    // 合并图片
    mainImageUrlList.value = [mainImgUrl.value, ...assistImgList.value];
    formData.mainImageUrlList = mainImageUrlList.value;
    // 写入产品属性
    handlePlatAttr();

    // 处理变种信息数据
    handleTableList();

    // 对于 skuPropertyValue 相同的 skuProperty
    // propertyValueId 随机值相同
    // 校验 sku 属性必填
    let notExistValue = false;
    const valueMap = new Map();
    for (const item of formData.prodListingSubSkuMiraviaList) {
      let obj = {
        storeSSku: item.storeSSku,
        purchaseCostPrice: item.purchaseCostPrice,
        skuPrice: item.skuPrice,
        skuDiscountPrice: item.skuDiscountPrice,
        packageWeight: item.packageWeight,
        packageLength: item.packageLength,
        packageWidth: item.packageWidth,
        packageHeight: item.packageHeight
      };
      const skuArray = item.skuProperty;
      for (const skuItem of skuArray) {
        const { skuPropertyValue, propertyValueId } = skuItem;
        if (skuPropertyValue === '' || Object.values(obj).includes('')) {
          notExistValue = true;
        }
        if (!valueMap.has(skuPropertyValue)) {
          valueMap.set(skuPropertyValue, propertyValueId);
        } else {
          skuItem.propertyValueId = valueMap.get(skuPropertyValue);
        }
      }
    }

    if (notExistValue) {
      return ElMessage.warning('请完整填写sku属性！');
    }

    // 取消勾选视频
    if (formData.isCancelVideo) {
      formData.videoUrl = '';
      formData.mediaCenterVideoUrl = '';
      formData.mediaId = '';
      formData.posterUrl = '';
      formData.videoFileName = '';
    } else {
      if (!formData.videoUrl && !formData.mediaCenterVideoUrl) {
        // 没有上传视频 选择的模板视频
        formData.videoUrl = formData.templateVideoUrl;
      }
    }

    let prodListingSubSkuMiraviaList = JSON.parse(
      JSON.stringify(formData.prodListingSubSkuMiraviaList)
    );

    // 修改变种信息中的销售状态 active <=> true  inactive <=> false
    prodListingSubSkuMiraviaList?.forEach((item) => {
      item.prodStatus = item.prodStatus === true ? 'active' : 'inactive';
    });
    // 限制重量和尺寸为整数
    let reg = /^[+]{0,1}(\d+)$/;
    let isNum = '';
    prodListingSubSkuMiraviaList?.forEach((item) => {
      if (
        !item.packageWeight.match(reg) ||
        !item.packageLength.match(reg) ||
        !item.packageWidth.match(reg) ||
        !item.packageHeight.match(reg)
      ) {
        isNum = true;
      }
    });
    if (isNum) {
      return ElMessage.warning('重量和尺寸必须为整数！');
    }

    prodListingSubSkuMiraviaList?.forEach((item) => {
      item.skuProperty = JSON.stringify(item.skuProperty);
    });
    let params = Object.assign({}, formData);
    formEl.validate(async (valid) => {
      if (valid) {
        // 获取海关信息 hsText
        if (formData.hsCode) {
          hsInfoList.value?.forEach((item) => {
            if (item.hsCode === formData.hsCode) {
              formData.hsText = item.hsCodeDesc;
            }
          });
        } else {
          if (hsInfoList.value?.length > 0) {
            return ElMessage.warning('请选择海关描述！');
          }
        }

        // 校验分类属性必填
        let prodListingMiraviaPropertyRequiredList =
          prodListingMiraviaPropertyList.value?.filter(
            (item) => item.required && item.attrName !== '危险品'
          );
        let attrValueList = prodListingMiraviaPropertyRequiredList?.filter(
          (cItem) => cItem.attrValue
        );
        if (
          attrValueList?.length !==
          prodListingMiraviaPropertyRequiredList?.length
        ) {
          return ElMessage.warning('请选择必填的分类属性！');
        }
        // 产品描述校验必填
        if (!descObj.value.info?.length > 0) {
          return ElMessage.warning('产品描述为必填，请添加！');
        }
        try {
          // 定时刊登&立即刊登
          if (isPublishNow || listTiming) {
            const { code } = await genStoreListingAndPublish({
              ...params,
              id: props.listingId,
              listingStatus: props.listingStatus,
              prodListingSubSkuMiraviaList: prodListingSubSkuMiraviaList,
              productDescriptionNew: JSON.stringify({
                moduleList: descObj.value.info
              }),
              publishNow: !!isPublishNow, // true --> 为生成后立即刊登======>false --> 为生成后设置定时刊登
              listTiming: listTiming ? listTiming : '' //定时刊登时间
            });
            if (code === '0000') {
              ElMessage.success('操作成功！');
              emit('close', 'update');
            }
          } else {
            // 保存
            const { code } =
              props.action === 'update'
                ? await handleUpdate({
                    ...params,
                    id: props.listingId,
                    listingStatus: props.listingStatus,
                    prodListingSubSkuMiraviaList: prodListingSubSkuMiraviaList,
                    productDescriptionNew: JSON.stringify({
                      moduleList: descObj.value.info
                    })
                  })
                : await handleCreate({
                    ...params,
                    prodListingSubSkuMiraviaList: prodListingSubSkuMiraviaList,
                    productDescriptionNew: JSON.stringify({
                      moduleList: descObj.value.info
                    })
                  });
            if (code === '0000') {
              ElMessage.success('保存成功！');
              emit('close', 'update');
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  // #region 定价
  const grossRate = ref(); // 毛利率
  const discountRate = ref(); // 优惠幅度
  const initPrice = (data) => {
    grossRate.value = data.grossRate * 100;
    discountRate.value = data.discountRate * 100;
  };
  const handleReCountPrice = async () => {
    try {
      let params = formData.prodListingSubSkuMiraviaList.map((item) => ({
        storeAcctId: props.storeAccId,
        storeSSku: item.storeSSku,
        prodSId: item.prodSId,
        grossRate: [null, undefined, ''].includes(grossRate.value)
          ? ''
          : grossRate.value / 100,
        discountRate: [null, undefined, ''].includes(discountRate.value)
          ? ''
          : discountRate.value / 100
      }));
      const { code, data = [], msg } = await reCountPriceApi(params);
      if (code === '0000') {
        formData.prodListingSubSkuMiraviaList.forEach((item) => {
          const curObj = data.filter((v) => v.storeSSku === item.storeSSku)[0];
          if (curObj) {
            item.skuDiscountPrice = curObj.listingPrice;
            item.skuPrice = curObj.guidPrice;
          }
        });
        ElMessage.success(msg);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // #endregion 定价
</script>
<style lang="scss" scoped>
  .detail-dialog {
    margin-top: 100px;
    .el-dialog__body {
      overflow-y: auto;
      max-height: 650px;
    }
    .el-loading-mask {
      top: -24px;
    }
    .el-loading-spinner {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
    }
  }
  .tooltipText {
    color: red;
  }
  .label_item {
    display: flex;
    flex-wrap: wrap;
    // margin: 0 80px;
  }
  .label-text {
    // display: flex;
    // justify-content: flex-end;
    text-align: right;
    width: 110px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .imgs_content {
    display: flex;
    margin-top: 20px;
    margin-left: 40px;
  }
  .imgs_content,
  .wrap_imgs_content {
    .setting_img {
      position: relative;
      flex: 1;
    }
    .main_img {
      width: 160px;
      height: 160px;
      margin-right: 20px;
      border: 1px dashed #dddddd;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    span {
      padding-left: 10px;
    }
    .tip {
      position: absolute;
      bottom: 0;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
  .tool_btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-price,
    &-sku {
      display: flex;
      align-items: center;
      span {
        flex: none;
      }
    }
    &-price-item {
      align-items: center;
    }
  }
  .color_red {
    color: red;
  }
  .upload_img {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .img_tool {
    width: 130px;
    display: flex;
    justify-content: space-between;
    .el-button {
      margin-left: 0;
    }
  }
  .small_item {
    margin-right: 18px;
    margin-bottom: 18px;
  }
  .small_img {
    width: 130px;
    height: 130px;
    object-fit: contain;
    border: 1px dashed #dddddd;
    box-sizing: border-box;
  }
  .video_box {
    width: 320px;
    height: 180px;
    border: 1px dashed #dddddd;
  }
  .video_file_name {
    width: 150px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .no_video {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #aaa;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    align-items: self-start;
    .el-radio {
      margin: 10px 0;
      height: auto;
      width: 100%;
      display: flex;
      :deep(.el-radio__input) {
        width: 25px;
      }
      :deep(.el-radio__label) {
        flex: 1;
      }
    }
  }
  .hs_main {
    width: 100%;
    padding: 5px;
    background: rgb(243, 246, 249);
    border-bottom: 1px solid #eee;
  }
  .hs_remark {
    padding: 5px;
    background: #fdfbfb;
  }
  .hs_content {
    margin-left: 40px;
    max-height: 350px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .btn_position {
    width: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .preview_img {
    width: 80px;
    height: 80px;
    border: 1px dashed #ddd;
    img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    .el-image,
    :deep(.el-image__inner) {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
    }
  }
</style>
<style lang="scss">
  .detail-dialog {
    margin-top: 100px;
    .el-dialog__body {
      overflow-y: auto;
      max-height: 600px;
    }
    .el-loading-mask {
      top: -24px;
    }
    .el-loading-spinner {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      width: auto;
    }
  }
  .scene_img {
    width: 130px;
    height: 130px;
    object-fit: contain;
    border: 1px dashed #dddddd;
    box-sizing: border-box;
    img {
      object-fit: contain;
    }
  }
  .tooltipText {
    color: red;
  }
  .el-radio {
    vertical-align: top;
    margin-top: -2px;
    margin-bottom: 1px;
  }
</style>
