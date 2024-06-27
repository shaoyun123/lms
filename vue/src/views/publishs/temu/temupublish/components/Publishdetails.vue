<template>
  <!-- 刊登详情/店铺商品弹窗 -->
  <el-dialog
    :model-value="showDialog"
    width="75%"
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
        <el-form-item label="平台类目" prop="catsIds">
          <el-cascader
            v-model="formData.catsIds"
            style="width: 500px"
            :options="oaList"
            :filter-method="filterCascader"
            filterable
            collapse-tags
            :props="{
              multiple: false,
              label: 'title',
              children: 'data'
            }"
            clearable
            @change="changeCate"
          ></el-cascader>
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="syncCateData"
            >同步</el-button
          >
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="handleRecommendedCategory"
            >推荐类目</el-button
          >
        </el-form-item>
        <div class="label_title">产品属性</div>

        <Propertyitems
          ref="propertyItemsRef"
          :prod-listing-temu-property-list="
            formData.prodListingTemuPropertyList
          "
          :action="action"
          :active-key="activeKey"
          :ingredient-list="ingredientList"
          :multi-prod-attr-list="multiProdAttrList"
          :ingredient-data-item="ingredientDataItem"
          :is-include-ingredient="isIncludeIngredient"
          :is-trigger-change-select="isTriggerChangeSelect"
          @update-property-list-width-child="updatePropertyListWidthChild"
          @add-domain="addDomain"
          @remove-domain="removeDomain"
          @trigger-done="triggerDone"
        />

        <el-form-item
          v-if="isShowSize"
          label="商品尺码"
          :prop="
            requiredIdList.includes(sizeClassId) || formData.catType === 1
              ? 'businessId'
              : ''
          "
        >
          <el-select v-model="formData.businessId" placeholder="请选择尺码模板">
            <el-option
              v-for="item in sizeTempList"
              :key="item.id"
              :label="item.name"
              :value="item.businessId"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="ayncTemplate"
            >同步</el-button
          >
        </el-form-item>

        <el-divider content-position="left"><h3>产品信息</h3> </el-divider>
        <el-form-item
          v-if="action === 'update'"
          label="店铺父SKU"
          prop="storePSku"
          size="default"
        >
          <el-input
            v-model="formData.storePSku"
            style="width: 500px"
            :readonly="activeKey === '1' ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="productName">
          <PlatTitle
            v-model="formData.productName"
            :custom-type="'text'"
            :content-top="50"
            :input-width="'500px'"
            :readonly="activeKey === '1' ? true : false"
            :max-length="formData.titleLimit"
            :prod-p-id="prodPId"
            :show-word-limit="true"
            clearable
          />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <!-- <el-input
            v-model="formData.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
            style="width: 500px"
            :readonly="activeKey === '1' ? true : false"
          >
          </el-input> -->
          <DescInfo
            ref="descRef"
            :store-acct-id="storeAccId"
            :desc-obj="descObj"
            :full-table-data="fullTableData"
            @get-table-data="getSkuTableData"
            @change-desc="changeDesc"
          />
        </el-form-item>
        <el-form-item label="产品轮播图" required>
          <div class="imgs_content">
            <div class="main_img">
              <el-popover
                placement="right"
                width="450px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="formData.materialImgUrl" />
                </template>
                <template #reference>
                  <el-image loading="lazy" :src="formData.materialImgUrl" />
                </template>
              </el-popover>
            </div>
            <div class="setting_img">
              <div class="upload_img">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadNetworkImg"
                  >网络图片</el-button
                >
                <el-upload
                  :action="'/api/lms/prodTpl/uploadPic.html'"
                  :on-success="importSuccess"
                  :on-error="importError"
                  :show-file-list="false"
                  style="margin: 0 10px"
                  :disabled="activeKey === '1' ? true : false"
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
                <span>说明：拖动图片调整顺序！产品轮播图仅支持5-10张</span>
              </div>
              <div style="display: flex; flex-wrap: wrap">
                <div
                  v-for="(item, index) in formData.carouselImageUrlList"
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
                      <el-image :id="index" class="small_img" :src="item" />
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
                  <div style="height: 26px; line-height: 26px">
                    <el-button
                      type="primary"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      @click="setMainImg(item, index)"
                      >设为主图</el-button
                    >
                    <el-button
                      type="danger"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      @click="handleRemove(index)"
                      >移除</el-button
                    >
                  </div>
                  <div style="height: 26px; line-height: 26px" class="flex">
                    <el-button
                      type="primary"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      @click="addToDescImageList(item)"
                      >添加至描述</el-button
                    >
                    <el-dropdown trigger="click">
                      <el-button style="margin-left: 0px" link
                        ><el-icon :size="14"><MagicStick /></el-icon
                        ><el-icon :size="8"><arrow-down /></el-icon>
                      </el-button>

                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>
                            <OneClickCutout
                              v-model:img-url="
                                formData.carouselImageUrlList[index]
                              "
                              :btn-type="cutoutImageBtnType"
                              :disabled="activeKey === '1' ? true : false"
                          /></el-dropdown-item>
                          <el-dropdown-item>
                            <el-button
                              link
                              style="font-size: 12px"
                              @click="openToMeiTu(item, index)"
                              >美图秀秀</el-button
                            ></el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品素材图" required>
          <div class="imgs_content">
            <div class="main_img">
              <el-popover
                placement="right"
                width="450px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="formData.materialImgUrl" />
                </template>
                <template #reference>
                  <el-image loading="lazy" :src="formData.materialImgUrl" />
                </template>
              </el-popover>
            </div>
            <div class="setting_img">
              <div class="upload_img tip">
                <span
                  >说明：素材图仅支持一张，将自动获取产品轮播图的第一张图片</span
                >
              </div>
            </div>
          </div>
        </el-form-item>
        <el-divider content-position="left"><h3>外包装信息</h3> </el-divider>
        <el-form-item label="外包装图片" required>
          <div class="wrap_imgs_content">
            <div class="setting_img">
              <div class="upload_img">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeKey === '1' ? true : false"
                  @click="uploadNetworkImg('wrap')"
                  >网络图片</el-button
                >
                <el-upload
                  :action="'/api/lms/prodTpl/uploadPic.html'"
                  :on-success="importSuccessWrap"
                  :on-error="importError"
                  :show-file-list="false"
                  style="margin: 0 10px"
                  :disabled="activeKey === '1' ? true : false"
                  multiple
                >
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="activeKey === '1' ? true : false"
                    >本地图片</el-button
                  >
                </el-upload>
                <span
                  >说明：外包装图片要求1-6张，需要包含正拍、侧拍和俯拍图片</span
                >
              </div>
            </div>
            <div>
              <div style="display: flex; flex-wrap: wrap">
                <div
                  v-for="(item, index) in formData.outerPackageImageUrlList"
                  :key="index"
                  class="small_item"
                >
                  <el-popover
                    placement="right"
                    width="450px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default>
                      <el-image :id="index" class="small_img" :src="item" />
                    </template>
                    <template #reference>
                      <el-image :id="index" class="small_img" :src="item" />
                    </template>
                  </el-popover>
                  <div style="height: 26px; line-height: 26px">
                    <el-button
                      type="danger"
                      link
                      :disabled="activeKey === '1' ? true : false"
                      @click="handleRemoveWrap(index)"
                      >移除</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="外包装类型" prop="packageType">
          <el-select
            v-model="formData.packageType"
            style="width: 200px"
            :disabled="activeKey === '1' ? true : false"
            clearable
          >
            <el-option label="硬包装" :value="0"></el-option>
            <el-option label="软包装+硬物" :value="1"></el-option>
            <el-option label="软包装+软物" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div>
            <div style="color: #ccc">
              硬包装：外包装为黑色瓦楞纸箱，或者彩色纸箱已塑封：如笔记本电脑、电饭煲、带鞋盒的鞋子等
            </div>
            <div style="color: #ccc">
              软包装+硬物：商品外包装形状会随着挤压改变形状，但商品不会：如笔记本、手串装饰等
            </div>
            <div style="color: #ccc">
              软包装+软物：商品外包装形状以及商品形状会随着挤压改变形状：如衣服、毛绒玩具等
            </div>
          </div>
        </el-form-item>
        <el-form-item label="外包装形状" prop="packageShape">
          <el-select
            v-model="formData.packageShape"
            style="width: 200px"
            :disabled="activeKey === '1' ? true : false"
            clearable
          >
            <el-option label="不规则形状" :value="0"></el-option>
            <el-option label="长方体" :value="1"></el-option>
            <el-option label="圆柱体" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="left">
          <h3>变种信息</h3>
        </el-divider>
        <div v-if="[-2, 0, 2].includes(Number(activeKey))" class="tool_btn">
          <el-button type="primary" size="small" @click="handleAddInfo"
            >新增变种</el-button
          >
        </div>
        <div v-if="[-2, 0, 2].includes(Number(activeKey))">
          <el-form
            size="default"
            status-icon
            :model="mulSetting"
            :label-width="90"
            :inline="true"
          >
            <span>批量设置</span>
            <el-form-item label="敏感属性">
              <el-select
                v-model="mulSetting.sensitive"
                style="width: 70px"
                size="small"
                :disabled="activeKey === '1' ? true : false"
                @change="changeSensitive"
              >
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
              <el-select
                v-model="mulSetting.sensitiveTypeList"
                style="width: 140px"
                size="small"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
              >
                <el-option
                  v-for="item in sensitiveList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span
                v-if="
                  mulSetting.sensitive &&
                  (mulSetting.sensitiveTypeList?.includes('110001') ||
                    mulSetting.sensitiveTypeList?.includes('120001'))
                "
                style="margin: 0 10px"
                >储电容量(wh)</span
              >
              <el-input
                v-if="
                  mulSetting.sensitive &&
                  (mulSetting.sensitiveTypeList?.includes('110001') ||
                    mulSetting.sensitiveTypeList?.includes('120001'))
                "
                v-model="mulSetting.maxBatteryCapacity"
                type="number"
                style="width: 60px"
                size="small"
              ></el-input>

              <span
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('170001')
                "
                style="margin: 0 10px"
                >刀具长度(cm)</span
              >
              <el-input
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('170001')
                "
                v-model="mulSetting.maxKnifeLength"
                type="number"
                style="width: 60px"
                size="small"
              ></el-input>
              <span
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('170001')
                "
                style="margin: 0 10px"
                >刀尖角度</span
              >
              <el-input
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('170001')
                "
                v-model="mulSetting.knifeAngle"
                type="number"
                style="width: 60px"
                size="small"
              ></el-input>

              <span
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('140001')
                "
                style="margin: 0 10px"
                >液体容量(ml)</span
              >
              <el-input
                v-if="
                  mulSetting.sensitive &&
                  mulSetting.sensitiveTypeList?.includes('140001')
                "
                v-model="mulSetting.maxLiquidCapacity"
                type="number"
                style="width: 60px"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格(CNY)">
              <el-input
                v-model="mulSetting.supplierPriceCny"
                style="width: 60px"
                size="small"
                @change="changeBatchSupplierPriceCny"
              />
            </el-form-item>
            <el-form-item label="价格(USD)">
              <el-input
                v-model="mulSetting.supplierPriceUsd"
                style="width: 60px"
                size="small"
                @change="changeBatchSupplierPriceUsd"
              />
            </el-form-item>
            <el-form-item label="长(cm)" label-width="60">
              <el-input
                v-model="mulSetting.length"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="长"
              />
            </el-form-item>
            <el-form-item label="宽(cm)" label-width="60">
              <el-input
                v-model="mulSetting.width"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="宽"
              />
            </el-form-item>
            <el-form-item label="高(cm)" label-width="60">
              <el-input
                v-model="mulSetting.height"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="高"
              />
            </el-form-item>
            <el-form-item label="重量(g)" label-width="90">
              <el-input
                v-model="mulSetting.weight"
                style="width: 60px; margin-right: 10px"
                size="small"
                placeholder="重量"
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
          ref="temuSkuTableRef"
          :data="formData.prodListingSubSkuTemuDtoList"
          border
        >
          <vxe-column title="预览图" width="200">
            <template #default="{ row, rowIndex }">
              <div style="display: flex">
                <div class="preview_img">
                  <el-popover
                    placement="right"
                    width="500px"
                    :hide-after="0"
                    trigger="hover"
                  >
                    <template #default>
                      <el-image :src="row.thumbUrl || ''" />
                    </template>
                    <template #reference>
                      <el-image
                        v-if="row.thumbUrl"
                        loading="lazy"
                        :src="row.thumbUrl || ''"
                      />
                    </template>
                  </el-popover>
                </div>

                <div
                  style="
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                  "
                >
                  <el-button
                    type="primary"
                    size="small"
                    @click="uploadNetworkImg('list', rowIndex)"
                    >网络图片</el-button
                  >
                  <el-upload
                    :action="'/api/lms/prodTpl/uploadPic.html'"
                    :on-success="(event) => importSuccessList(event, rowIndex)"
                    :on-error="importError"
                    :show-file-list="false"
                    multiple
                  >
                    <el-button type="primary" size="small">本地图片</el-button>
                  </el-upload>
                  <el-button
                    type="primary"
                    size="small"
                    @click="uploadTempImg('list', rowIndex)"
                    >模板图片</el-button
                  >
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column
            title="店铺子SKU"
            field="storeSSku"
            width="150"
          ></vxe-column>
          <template v-if="prodCateAttrTemuList.length === 0">
            <vxe-column
              v-for="(typeItem, typeIndex) in defaultHaveTypeList"
              :key="typeIndex"
              width="140"
            >
              <template #header>
                <el-select
                  v-model="typeItem.parentSpecId"
                  class="m-2"
                  placeholder="选择框"
                  size="small"
                  @change="changeSelectType(typeIndex, typeItem.parentSpecId)"
                >
                  <el-option
                    v-for="item in selfSelectPropertyOption"
                    :key="item.parentSpecId"
                    :label="item.parentSpecName"
                    :value="item.parentSpecId"
                    :disabled="
                      disabledTypeFn(item.parentSpecId, typeItem.parentSpecId)
                    "
                  />
                </el-select>
              </template>
              <template #default="{ row }">
                <div :key="randomKey">
                  <el-input
                    ref="randomInputRef"
                    v-model="
                      row.prodListingSubSkuTemuPropertyList[typeIndex].specName
                    "
                    size="small"
                    style="width: 120px"
                    :readonly="activeKey === '1' ? true : false"
                  ></el-input>
                </div>
              </template>
            </vxe-column>
          </template>
          <template v-if="prodCateAttrTemuList.length > 0">
            <vxe-column title="模板属性">
              <template #default="{ row }">
                <div v-if="row.color">颜色：{{ row.color }}</div>
                <div v-if="row.size">尺寸：{{ row.size }}</div>
                <div v-if="row.style">款式：{{ row.style }}</div>
              </template>
            </vxe-column>

            <vxe-colgroup title="平台属性">
              <template #header>
                <div>
                  平台属性
                  <span style="color: red">
                    <el-tooltip
                      effect="light"
                      popper-class="tooltipText"
                      content="该类目不支持模板属性刊登，请选择相应的平台属性进行刊登"
                      placement="right"
                      ><el-icon :size="18" style="vertical-align: text-bottom"
                        ><Warning
                      /></el-icon>
                    </el-tooltip>
                  </span>
                </div>
              </template>
              <vxe-column
                v-for="(item, index) in prodCateAttrTemuList"
                :key="index"
              >
                <template #header>
                  <div>
                    <span v-if="!item.isCustom" style="color: red">*</span>
                    <span v-if="!item.isCustom">{{ item.name }}</span>
                    <el-select
                      v-if="item.isCustom"
                      v-model="item.name"
                      style="width: 110px"
                      size="small"
                      clearable
                    >
                      <el-option
                        v-for="(pItem, pIndex) in parentSpecOption"
                        :key="pIndex"
                        :value="pItem.parentSpecName"
                        :label="pItem.parentSpecName"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <!-- <span>映射模板属性</span> -->
                    <el-select
                      v-model="item.pname"
                      style="width: 110px"
                      size="small"
                      placeholder="映射模板属性"
                      clearable
                      @change="(event) => changePlatPropSelect(event, index)"
                    >
                      <el-option
                        v-for="(cItem, cIndex) in platPropsOption"
                        :key="cIndex"
                        :value="cItem.value"
                        :label="cItem.label"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
                <template #default="{ row }">
                  <el-select
                    v-if="!item.isCustom"
                    v-model="row.prodListingSubSkuTemuPropertyList[index].vid"
                    style="width: 110px"
                    size="small"
                    clearable
                    @change="
                      (event) => changePlatProp(event, row, item.pname, index)
                    "
                  >
                    <el-option
                      v-for="(cItem, key) in item.optionalValueList"
                      :key="key"
                      :value="cItem.vid"
                      :label="cItem.value"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    v-if="item.isCustom"
                    v-model="
                      row.prodListingSubSkuTemuPropertyList[index].specName
                    "
                    size="small"
                    style="width: 110px"
                    @input="
                      (event) => changeCustom(event, row, item.pname, index)
                    "
                  ></el-input>
                </template>
              </vxe-column>
            </vxe-colgroup>
          </template>
          <vxe-column title="敏感属性">
            <template #header
              ><span class="color_red">*</span>敏感属性</template
            >
            <template #default="{ row }">
              <el-select
                v-model="row.sensitive"
                style="width: 80px"
                size="small"
                :disabled="activeKey === '1' ? true : false"
              >
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
              <el-select
                v-model="row.sensitiveTypeList"
                style="width: 140px"
                size="small"
                :disabled="activeKey === '1' ? true : false"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
              >
                <el-option
                  v-for="item in sensitiveList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div
                v-if="
                  row.sensitiveTypeList?.includes('110001') ||
                  row.sensitiveTypeList?.includes('120001')
                "
                style="margin-top: 10px"
              >
                <span style="display: inline-block; width: 80px"
                  >储电容量(wh)</span
                >
                <el-input
                  v-model="row.maxBatteryCapacity"
                  type="number"
                  :min="0"
                  :max="100"
                  size="small"
                  style="width: 140px"
                ></el-input>
              </div>
              <div
                v-if="row.sensitiveTypeList?.includes('170001')"
                style="margin-top: 10px"
              >
                <span style="display: inline-block; width: 80px"
                  >刀具长度(cm)</span
                >
                <el-input
                  v-model="row.maxKnifeLength"
                  type="number"
                  size="small"
                  :min="0"
                  :max="15"
                  style="width: 140px"
                ></el-input>
              </div>
              <div
                v-if="row.sensitiveTypeList?.includes('170001')"
                style="margin-top: 10px"
              >
                <span style="display: inline-block; width: 80px">刀具角度</span>
                <el-input
                  v-model="row.knifeAngle"
                  type="number"
                  size="small"
                  :min="0"
                  :max="15"
                  style="width: 140px"
                ></el-input>
              </div>
              <div
                v-if="row.sensitiveTypeList?.includes('140001')"
                style="margin-top: 10px"
              >
                <span style="display: inline-block; width: 80px"
                  >液体容量(ml)</span
                >
                <el-input
                  v-model="row.maxLiquidCapacity"
                  type="number"
                  size="small"
                  :min="0"
                  :max="100"
                  style="width: 140px"
                ></el-input>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="supplierPrice" width="120">
            <template #header><span class="color_red">*</span>价格</template>
            <template #default="{ row }">
              <div class="supplierPrice_content">
                <div
                  v-for="priceItem in row.priceList"
                  :key="priceItem.currency"
                  class="flex"
                  style="margin-bottom: 5px"
                >
                  <span style="width: 8px">{{
                    priceItem.current ? '*' : ''
                  }}</span>
                  <span style="width: 10px; text-align: right">{{
                    priceItem.currencySign
                  }}</span>
                  <ZInputNumber
                    v-model="priceItem.price"
                    style="width: 60px"
                    :precision="2"
                    size="small"
                    :min="0"
                    :readonly="activeKey === '1' ? true : false"
                    @change="changeSupplierPrice($event, priceItem, row)"
                  />
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="体积(单位为cm)">
            <template #header
              ><span class="color_red">*</span>体积(单位为cm)</template
            >
            <template #default="{ row }">
              <el-input
                v-model="row.length"
                style="width: 50px; margin-right: 10px"
                size="small"
                placeholder="长"
                :readonly="activeKey === '1' ? true : false"
              />
              <el-input
                v-model="row.width"
                style="width: 50px; margin-right: 10px"
                size="small"
                placeholder="宽"
                :readonly="activeKey === '1' ? true : false"
              />
              <el-input
                v-model="row.height"
                style="width: 50px"
                size="small"
                placeholder="高"
                :readonly="activeKey === '1' ? true : false"
              />
            </template>
          </vxe-column>
          <vxe-column field="weight" width="80">
            <template #header><span class="color_red">*</span>重量(g)</template>
            <template #default="{ row }">
              <el-input
                v-model="row.weight"
                style="width: 60px"
                size="small"
                :readonly="activeKey === '1' ? true : false"
              />
            </template>
          </vxe-column>
          <vxe-column
            v-if="[-2, 0, 2].includes(Number(activeKey))"
            title="操作"
            width="70"
          >
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="removeInfo(row)"
                >移除</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </el-form>
    </div>
    <template v-if="activeKey !== '1'" #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
    </template>
  </el-dialog>

  <ChooseTplImage
    v-model="tplImgVisible"
    :limit="remainderLimit"
    :params="tplImgParams"
    @get-tpl-img="getTplImg"
  />

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

  <el-dialog
    :model-value="showAddDialog"
    title="新增商品子SKU"
    width="30%"
    :close-on-click-modal="false"
    @close="closeAddDialog"
  >
    <el-form :model="skuInfoForm">
      <el-form-item label="商品子SKU" size="default" prop="prodSSkuStr">
        <el-input
          v-model="skuInfoForm.prodSSkuStr"
          type="text"
          placeholder="多个使用逗号分隔"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="closeAddDialog">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <RecommendedCategory
    v-if="showRecommendedCategory"
    :show-dialog="showRecommendedCategory"
    :info="recommendedCategoryInfo"
    @done="recommendedCategoryDone"
    @close="closeRecommendedCategory"
  />
</template>

<script setup>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  import MTImageEditor from 'mt-image-editor-sdk';
  import { getBase64Img } from '@/api/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import {
    defineProps,
    defineEmits,
    ref,
    reactive,
    onMounted,
    watch
    // nextTick
  } from 'vue';
  import {
    getCreateInfo,
    getPublishDetail,
    getSensitive,
    getProductName,
    getProductValue,
    updateDetail,
    createPublish,
    addProdSSkuInfos,
    getCateTree,
    syncCate,
    getSizeTemplate,
    syncSizeTemplate,
    checkTemplate,
    getTemuGoodsParentSpec
  } from '@/api/publishs/temupublish';
  import { comHidePopover } from '@/utils/common';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import DescInfo from '@/views/publishs/miravia/miraviapublish/components/DescInfo.vue';
  import OneClickCutout from '@/components/OneClickCutout/index.vue';

  import Propertyitems from './Propertyitems.vue';
  import RecommendedCategory from './RecommendedCategoryDialog.vue';
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
      type: [Number, String],
      default: 0
    },
    activeKey: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['close', 'getTableData']);

  onMounted(async () => {
    // 获取所有属性枚举项
    const { code, data } = await getTemuGoodsParentSpec({
      storeAcctId: props.storeAccId
    });
    if (code === '0000') {
      selfSelectPropertyOption.value = data;
      selfSelectPropertyOption.value.unshift({
        parentSpecName: '无',
        parentSpecId: '无'
      });
    }
    if (props.action === 'create') {
      getInfo();
    }

    if (props.action === 'update') {
      getDetail();
    }
    getSensitiveType();
    getCates();
  });

  const loading = ref(false);
  const oaList = ref([]);
  const formData = reactive({
    id: '',
    // catsName: [], // 平台类目
    catsIds: [],
    catType: null, // 类目的叶子catType
    leafCateId: '', // 类目的叶子id
    businessId: '', // 尺码
    storeAcctId: '', // 店铺编号
    salesSite: '', // 站点
    prodPId: '', // 商品父id
    productName: '', // 商品标题
    prodListingTemuPropertyList: [], // 类目属性
    storePSku: '', // 店铺父 sku
    description: '', // 描述
    prodListingSubSkuTemuDtoList: [], // 变种信息
    carouselImageUrlList: [], //轮播图
    outerPackageImageUrlList: [], // 外包装图
    packageType: '', // 外包装类型
    packageShape: '', // 外包装形状
    materialImgUrl: '', // 主图
    titleLimit: 250 // 标题限制字数
  });

  const mulSetting = reactive({
    sensitive: '', // 敏感属性
    sensitiveTypes: '', // 属性值
    sensitiveTypeList: [], // 属性值
    sensitiveValue: '',
    supplierPriceCny: '', // 价格
    supplierPriceUsd: '', // 价格
    length: '', // 长
    width: '', // 宽
    height: '', // 高
    weight: '', // 重量
    maxBatteryCapacity: '', // 储电容量
    maxKnifeLength: '', // 刀具长度
    maxLiquidCapacity: '', // 液体容量
    knifeAngle: '' // 刀尖角度
  });

  const formRules = reactive({
    catsIds: [{ required: true, message: '请选择平台类目', trigger: 'blur' }],
    storePSku: [
      { required: true, message: '请输入店铺父SKU', trigger: 'change' }
    ],
    productName: [{ required: true, message: '请生成标题', trigger: 'change' }],
    description: [
      { required: true, message: '请生成产品描述', trigger: 'change' }
    ],
    businessId: [
      { required: true, message: '请选择商品尺码', trigger: 'blur' }
    ],
    packageType: [
      { required: true, message: '请选择外包装类型', trigger: 'blur' }
    ],
    packageShape: [
      { required: true, message: '请选择外包装形状', trigger: 'blur' }
    ]
  });

  const randomInputRef = ref(null);
  const randomKey = ref(Math.random());

  // const setFocus = () => {
  //   nextTick(() => {
  //     randomInputRef.value.focus();
  //   });
  // };

  // watch(
  //   () => randomKey.value,
  //   (val) => {
  //     console.log('val', val);
  //     val && setFocus();
  //   }
  // );

  const catsIdsCopy = ref([]);
  const decriptionCopy = ref('');
  const descObj = ref({});

  const exchRate = ref(null);

  // 生成店铺商品前   获取信息
  const getInfo = async () => {
    loading.value = true;
    try {
      let params = {
        storeAcctId: props.storeAccId,
        salesSite: 'US',
        prodPId: props.prodPId
      };
      const { code, data } = await getCreateInfo(params);
      if (code === '0000') {
        Object.keys(formData).forEach((item) => {
          formData[item] = data[item];
        });
        if (
          formData.prodListingSubSkuTemuDtoList &&
          formData.prodListingSubSkuTemuDtoList.length
        ) {
          exchRate.value =
            formData.prodListingSubSkuTemuDtoList[0].usdToCnyRate;
        }
        // 接收类目的每一级id
        const allCateIdList = Object.keys(data)
          .filter((key) => key.startsWith('cate'))
          .map((key) => data[key]);
        allCateIdList?.forEach((item, index) => {
          formData['cate' + `${index + 1}` + 'Id'] = item;
        });
        // 初始回显平台默认类目
        formData.catsIds = data.leafCateId ? allCateIdList : [];
        // 用于回显尺码表
        formData.businessId = data.businessId ? Number(data.businessId) : '';
        // 获取该类目下属性映射回显
        getProperties();

        // 有默认类目节点返回
        if (formData.catsIds.length) {
          // 获取尺码表枚举和是否展示尺码表
          getSizeTemplateData();
          // 获取子列表平台属性列
          getProductTitle(formData.cate1Id);
        }
        formData.description = data.description.replace(/<br\/>/g, '\n');
        decriptionCopy.value = formData.description;
        cnTitle.value = data.cnTitle || '';
        enTitle.value = data.enTitle || '';
        // 产品描述
        descObj.value = {
          info: JSON.parse(data.description).moduleList || []
        };
        formData.carouselImageUrlList.splice(0, 1);
        initProdListingSubSkuTemuPropertyList();
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const defaultHaveTypeList = ref([]);
  const newSpecName = ref('');
  // 初始化商品自选类型
  const initProdListingSubSkuTemuPropertyList = () => {
    const defaultTypeList = ['color', 'style', 'size'];
    const haveTypeList = Object.keys(
      formData.prodListingSubSkuTemuDtoList[0]
    ).filter((key) => {
      return (
        defaultTypeList.includes(key) &&
        formData.prodListingSubSkuTemuDtoList[0][key]
      );
    });

    formData.prodListingSubSkuTemuDtoList =
      formData.prodListingSubSkuTemuDtoList.map((item) => {
        item.prodListingSubSkuTemuPropertyList = [];
        const defaultTypeObj = {
          color: '颜色',
          style: '风格',
          size: '尺码'
        };
        // 如果类型有三项存在 将款式和大小拼接在一起 作为'风格'
        if (item['color'] && haveTypeList.includes('color')) {
          // color 有值
          if (
            item['size'] &&
            item['style'] &&
            haveTypeList.includes('size') &&
            haveTypeList.includes('style')
          ) {
            const colorIndex = selfSelectPropertyOption.value.findIndex(
              (option) => option.parentSpecName === defaultTypeObj['color']
            );
            addPropertyItem(item, colorIndex, item.color);

            const styleIndex = selfSelectPropertyOption.value.findIndex(
              (option) => option.parentSpecName === defaultTypeObj['style']
            );
            const keyArr = ['style', 'size'];
            newSpecName.value = keyArr
              .filter((key) => item[key])
              .map((key) => item[key])
              .join(' - ');

            addPropertyItem(item, styleIndex, newSpecName.value);
          } else {
            // size !style haveTypeList:['color', 'size']
            // !size style haveTypeList:['color', 'style']
            // !size !style haveTypeList: ['color']
            haveTypeList?.forEach((type) => {
              const index = selfSelectPropertyOption.value.findIndex(
                (option) => {
                  return option.parentSpecName === defaultTypeObj[type];
                }
              );
              addPropertyItem(item, index, item[type]);
            });
          }
        } else {
          // color 没有值
          if (
            item['size'] &&
            item['style'] &&
            haveTypeList.includes('size') &&
            haveTypeList.includes('style')
          ) {
            const sizeIndex = selfSelectPropertyOption.value.findIndex(
              (option) => option.parentSpecName === defaultTypeObj['size']
            );
            const styleIndex = selfSelectPropertyOption.value.findIndex(
              (option) => option.parentSpecName === defaultTypeObj['style']
            );
            addPropertyItem(item, sizeIndex, item.size);
            addPropertyItem(item, styleIndex, item.style);
          } else {
            // size !style haveTypeList:['size']
            // !size style haveTypeList:['style']
            haveTypeList?.forEach((type) => {
              const index = selfSelectPropertyOption.value.findIndex(
                (option) => option.parentSpecName === defaultTypeObj[type]
              );
              addPropertyItem(item, index, item[type]);
            });
          }
        }
        if (item.prodListingSubSkuTemuPropertyList?.length === 1) {
          item.prodListingSubSkuTemuPropertyList.push({
            parentSpecId: '无',
            parentSpecName: '无',
            specName: ''
          });
        }
        return item;
      });

    defaultHaveTypeList.value =
      formData.prodListingSubSkuTemuDtoList[0].prodListingSubSkuTemuPropertyList;
  };

  const addPropertyItem = (item, index, specName) => {
    item.prodListingSubSkuTemuPropertyList.push({
      parentSpecId: selfSelectPropertyOption.value[index].parentSpecId,
      parentSpecName: selfSelectPropertyOption.value[index].parentSpecName,
      specName
    });
  };

  // 初始化商品规格属性是否可选
  const disabledTypeFn = (item, currentItem) => {
    const index = defaultHaveTypeList.value.findIndex((type) => {
      return type.parentSpecId === item && type.parentSpecId !== currentItem;
    });
    return index > -1;
  };

  // 平台属性改变选中的类型
  const changeSelectType = (typeIndex, specId) => {
    let parentSpecName = selfSelectPropertyOption.value.filter(
      (item) => item.parentSpecId === specId
    )[0].parentSpecName;
    formData.prodListingSubSkuTemuDtoList.forEach((item) => {
      item.prodListingSubSkuTemuPropertyList[typeIndex].parentSpecId = specId;
      item.prodListingSubSkuTemuPropertyList[typeIndex].parentSpecName =
        parentSpecName;
      item.prodListingSubSkuTemuPropertyList[typeIndex].specName = '';
    });
  };

  const prodCateAttrTemuList = ref([]);
  // 平台属性下拉框 颜色 尺寸 款式
  const platPropsOption = ref([
    { value: 'color', label: '颜色' },
    { value: 'size', label: '尺寸' },
    { value: 'style', label: '款式' }
  ]);

  // 自选属性枚举值
  const selfSelectPropertyOption = ref([]);
  const parentSpecOption = ref([]);
  // 获取父规格
  const getParentsSpec = async (type) => {
    try {
      const { code, data } = await getTemuGoodsParentSpec({
        storeAcctId: props.storeAccId
      });
      if (code === '0000') {
        parentSpecOption.value = data;
        // 新加一列自定义属性 到列表
        let column = {};
        column.name = '';
        column.isCustom = true; // 是自定义的规格属性

        if (type === 'detail') {
          let newData =
            formData.prodListingSubSkuTemuDtoList[0]
              ?.prodListingSubSkuTemuPropertyList;

          // 可添加自定义属性 但生成店铺时 没有添加 则添加 column  name = ''
          // 可添加自定义属性 但生成店铺时 添加了 则添加 column  name = 返回的 parentSpecName

          column.name =
            newData?.length === prodCateAttrTemuList.value?.length
              ? ''
              : newData[newData.length - 1]?.parentSpecName;

          formData.prodListingSubSkuTemuDtoList.forEach((item) => {
            if (
              item.prodListingSubSkuTemuPropertyList?.length ==
              prodCateAttrTemuList.value?.length
            ) {
              item.prodListingSubSkuTemuPropertyList.push(
                JSON.parse(JSON.stringify(column))
              );
            }
          });
          prodCateAttrTemuList.value.push(column);
        } else {
          prodCateAttrTemuList.value.push(column);
          formData.prodListingSubSkuTemuDtoList.forEach((item) => {
            item.prodListingSubSkuTemuPropertyList = JSON.parse(
              JSON.stringify(prodCateAttrTemuList.value)
            );
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 生成产品标题
  const getProductTitle = async (cate1Id) => {
    try {
      let params = {
        cateId: cate1Id || formData.catsIds[0], // 一级类目
        salesSite: 'US',
        prodPId: props.prodPId,
        leafCateId: formData.leafCateId
      };
      const { code, data } = await getProductName(params);
      if (code === '0000') {
        formData.productName = data.productName;
        formData.titleLimit = data.titleLimit;
        prodCateAttrTemuList.value = data.saleCateAttrTemuList || [];
        // 根据 inputMaxSpecNum 判断是否新增一行自定义规格
        if (prodCateAttrTemuList.value?.length) {
          let inputMaxSpecNum =
            data.saleCateAttrTemuList[0]?.inputMaxSpecNum || 0;
          if (inputMaxSpecNum === 1) {
            getParentsSpec();
          } else {
            formData.prodListingSubSkuTemuDtoList.forEach((item) => {
              item.prodListingSubSkuTemuPropertyList = JSON.parse(
                JSON.stringify(prodCateAttrTemuList.value)
              );
            });
          }
        } else {
          initProdListingSubSkuTemuPropertyList();
        }
        handleOption();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 根据平台类目变化获取产品属性
  const isIncludeIngredient = ref(false);
  const ingredientDataItem = ref({});
  const ingredientList = ref([]);
  const isTriggerChangeSelect = ref(false);
  const randomNumber = () => {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
  };

  const triggerDone = () => {
    isTriggerChangeSelect.value = false;
  };
  const getProperties = async () => {
    try {
      let params = {
        catId: formData.leafCateId,
        salesSite: salesSite.value || 'US',
        prodPId: props.prodPId
      };
      const { code, data } = await getProductValue(params);
      if (code === '0000') {
        let isNeedTriggerChange = false;
        formData.prodListingTemuPropertyList = data.map((item) => {
          if (item.controlType === 16) {
            isIncludeIngredient.value = true;
            // 包含成分的这一项
            ingredientDataItem.value.propertyChooseTitle =
              item.propertyChooseTitle;
            ingredientDataItem.value.numberInputTitle = item.numberInputTitle;
            ingredientDataItem.value.propertyVId = '';
            ingredientDataItem.value.propertyNumberInputValue = '';
          }
          // 生成刊登 根据接口返回的defaultValue去回显类目默认属性(有类目嵌套子类目情况)
          const foundDefaultItem = item.optionalValueList?.find(
            (v) => v.value === item.defaultValue
          );
          if (foundDefaultItem) {
            item.propertyVId = foundDefaultItem.vid;
            if (foundDefaultItem?.subCateAttrList?.length) {
              isNeedTriggerChange = props.action === 'create' ? true : false;
            }
          }
          return item;
        });
        isTriggerChangeSelect.value = isNeedTriggerChange;
        // 整理 controlType = 16 的数据为数组格式
        ingredientList.value = formData.prodListingTemuPropertyList.filter(
          (item) => {
            let ingredientRowList = [];
            let obj = {};
            if (item.controlType === 16) {
              obj.propertyChooseTitle = item.propertyChooseTitle;
              obj.numberInputTitle = item.numberInputTitle;
              ingredientRowList.push(obj);
              item.ingredientRowList = ingredientRowList;
              return item;
            }
          }
        );
        // 筛选出多选属性
        filterMultiProperty(formData.prodListingTemuPropertyList, 'name');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 将产品属性后面 添加产品属性子属性
  const updatePropertyListWidthChild = (val) => {
    formData.prodListingTemuPropertyList = val.temuPropertyList.concat(
      val.newPropSelectList
    );
  };

  // 添加成分属性
  const addDomain = (val) => {
    ingredientList.value[val.index].ingredientRowList?.push(
      val.newIngredientItem
    );
  };

  // 删除成分属性
  const removeDomain = (val) => {
    ingredientList.value[val.idx].ingredientRowList.splice(val.cIdx, 1);
  };

  // 获取类目
  const getCates = async () => {
    try {
      const { code, data } = await getCateTree();
      if (code === '0000') {
        oaList.value = JSON.parse(data);
      }
      if (formData.leafCateId) {
        getSizeTemplateData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取尺码模板
  // 商品尺码 必填 classId [11,12,13,14,107] 或者catType === 1 否则不必填
  const requiredIdList = [11, 12, 13, 14, 107];
  const sizeTempList = ref([]);
  const sizeClassId = ref(null);
  const getSizeTemplateData = async () => {
    try {
      let params = {
        catId: formData.leafCateId,
        storeAcctId: props.storeAccId
      };
      const { code, data } = await getSizeTemplate(params);
      if (code === '0000') {
        // data.classId只要有值返回 就展示尺码表和同步按钮
        if (
          data.classId !== null &&
          data.classId !== undefined &&
          data.classId !== ''
        ) {
          sizeClassId.value = Number(data.classId);
          sizeTempList.value = data.sizeCharts;
          isShowSize.value = true;
        } else {
          sizeClassId.value = '';
          isShowSize.value = false;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 同步尺码模板
  const ayncTemplate = async () => {
    try {
      const { code } = await syncSizeTemplate({
        storeAcctId: props.storeAccId
      });
      if (code === '0000') {
        ElMessage.success('同步成功！');
        getSizeTemplateData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 批量填写 价格联动
  const changeBatchSupplierPriceCny = (val) => {
    if (val === '') {
      return (mulSetting.supplierPriceUsd = null);
    }
    mulSetting.supplierPriceUsd = (
      Number(val || 0) / Number(exchRate.value)
    ).toFixed(2);
  };

  const changeBatchSupplierPriceUsd = (val) => {
    if (val === '') {
      return (mulSetting.supplierPriceCny = null);
    }
    mulSetting.supplierPriceCny = (
      Number(val || 0) * Number(exchRate.value)
    ).toFixed(2);
  };

  // 变种信息 价格联动 汇率usdToCnyRate
  const changeSupplierPrice = (val, item, row) => {
    const otherCurrency = item.currency === 'CNY' ? 'USD' : 'CNY';
    const otherItem = row.priceList.filter(
      (item) => item.currency === otherCurrency
    )[0];
    if (val === '') {
      otherItem.price = '';
    } else {
      switch (item.currency) {
        case 'CNY':
          otherItem.price = (
            Number(val || 0) / Number(row.usdToCnyRate)
          ).toFixed(2);
          break;
        case 'USD':
          otherItem.price = (
            Number(val || 0) * Number(row.usdToCnyRate)
          ).toFixed(2);
          break;
      }
    }
  };

  const salesSite = ref('');
  // 产品属性 多选
  const multiProdAttrList = ref([]);
  // 查询刊登详情
  const getDetail = async () => {
    loading.value = true;
    try {
      const { code, data } = await getPublishDetail({
        listingId: props.listingId
      });
      if (code === '0000') {
        Object.keys(formData).forEach((item) => {
          // 16 为文本输入成分比例 将成分属性集合
          handleProportion(data, 'prodListingTemuPropertyList');
          formData[item] = data[item];
        });

        if (
          formData.prodListingSubSkuTemuDtoList &&
          formData.prodListingSubSkuTemuDtoList.length
        ) {
          exchRate.value =
            formData.prodListingSubSkuTemuDtoList[0].usdToCnyRate;
        }
        // 筛选出产品属性多选属性 并整合
        getMultiSpec(data, 'prodListingTemuPropertyList');
        formData.businessId = Number(formData.businessId);
        formData.catsIds = [];
        for (let i = 1; i < 10; i++) {
          formData['cate' + i + 'Id'] = data['cate' + i + 'Id'];
          if (data['cate' + i + 'Id'] !== 0) {
            formData.catsIds.push(data['cate' + i + 'Id']);
            catsIdsCopy.value.push(data['cate' + i + 'Id']);
          }
        }
        decriptionCopy.value = data.description || '';
        cnTitle.value = data.cnTitle || '';
        enTitle.value = data.enTitle || '';
        // 产品描述
        descObj.value = {
          info: JSON.parse(data.description).moduleList || []
        };
        salesSite.value = data.salesSite;
        formData.carouselImageUrlList.splice(0, 1);
        prodCateAttrTemuList.value = data.prodCateAttrTemuList || [];
        formData.prodListingTemuPropertyList &&
          formData.prodListingTemuPropertyList.forEach((item) => {
            if (item.propertyPropName) {
              item.name = item.propertyPropName;
            }
          });
        if (prodCateAttrTemuList.value[0]?.inputMaxSpecNum === 1) {
          console.log('可自定义属性');
          getParentsSpec('detail');
        }
        handleOption();
        getCateType(oaList.value, formData.leafCateId);

        addPlatPropertyColumn();
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const filterMultiProperty = (prodListingTemuPropertyList, name) => {
    multiProdAttrList.value = [];
    prodListingTemuPropertyList?.forEach((item) => {
      if (item.chooseMaxNum > 1 && item.controlType !== 16) {
        // chooseMaxNum 是属性下拉框可以选择数量 大于1则为多选 1为单选
        multiProdAttrList.value.push(item[name]);
      }
    });
  };

  // 筛选出多选属性 并将多选属性整合 用于详情回显
  const getMultiSpec = (data, item) => {
    filterMultiProperty(data.prodListingTemuPropertyList, 'propertyPropName');

    let prodListingTemuPropertyList = [];
    let multiObj = {};
    data[item].forEach((val, index) => {
      val.keyId = randomNumber();
      // 将多选的属性整合
      if (multiProdAttrList.value.includes(val.propertyPropName)) {
        if (multiObj[val.propertyPropName] === undefined) {
          multiObj[val.propertyPropName] = index;
          data[item][index].propertyVId = [val.propertyVId];
          prodListingTemuPropertyList.push(data[item][index]);
        } else {
          data[item][multiObj[val.propertyPropName]].propertyVId.push(
            val.propertyVId
          );
        }
      } else {
        prodListingTemuPropertyList.push(val);
      }
      formData['prodListingTemuPropertyList'] = prodListingTemuPropertyList;
    });
  };

  // 处理成分比例controlType = 16 的数据
  const handleProportion = (data, item) => {
    // 相同 name 的合并成一条数据 将不同的propertyPropName,propertyPropValue等属性添加到 ingredientRowList 中
    let ingredientArr = data[item]?.filter((val) => val.controlType === 16);
    if (ingredientArr.length > 0) {
      isIncludeIngredient.value = true;
    }

    let result = {};
    let ingredientRowList = [];
    // 遍历输入的对象数组
    ingredientArr.forEach((val) => {
      // 包含成分的这一项 用来新增或者删除成分项
      ingredientDataItem.value.propertyChooseTitle = val.propertyChooseTitle;
      ingredientDataItem.value.numberInputTitle = val.numberInputTitle;
      ingredientDataItem.value.propertyVId = '';
      ingredientDataItem.value.propertyNumberInputValue = '';

      let name = val.propertyPropName;
      let obj = {
        propertyPropValue: val.propertyPropValue,
        propertyPropName: val.propertyPropName,
        propertyChooseTitle: val.propertyChooseTitle || '',
        numberInputTitle: val.numberInputTitle || '',
        propertyNumberInputValue: val.propertyNumberInputValue,
        propertyVId: val.propertyVId
      };
      if (Object.keys(result).includes(name)) {
        // 如果已存在相同属性值的项，则将当前对象的其他属性合并到已存在的项中
        ingredientRowList.push(obj);
        result[name].ingredientRowList = ingredientRowList;
      } else {
        ingredientRowList = [];
        // 如果不存在相同属性值的项，则创建一个新的项
        result[name] = val;
        if (val.propertyVId) {
          ingredientRowList.push(obj);
          result[name].ingredientRowList = ingredientRowList;
        } else {
          result[name].ingredientRowList = [obj];
        }
      }
    });

    // 将结果对象转换为数组形式
    ingredientList.value = Object.values(result);
  };

  // 平台属性默认为两列，如果只有一列，则默认添加一列 “无”
  const addPlatPropertyColumn = () => {
    let list =
      formData.prodListingSubSkuTemuDtoList[0]
        .prodListingSubSkuTemuPropertyList;

    if (list?.length === 1) {
      formData.prodListingSubSkuTemuDtoList?.forEach((item) => {
        item.prodListingSubSkuTemuPropertyList.push({
          parentSpecId: '无',
          parentSpecName: '无',
          specName: ''
        });
      });
    }
    defaultHaveTypeList.value =
      formData.prodListingSubSkuTemuDtoList[0].prodListingSubSkuTemuPropertyList;
  };

  const handleOption = () => {
    let propArr = platPropsOption.value.map((item) => item.value); // style  size  color
    propArr.forEach((item) => {
      if (!formData.prodListingSubSkuTemuDtoList[0][item]) {
        platPropsOption.value = platPropsOption.value.filter((cItem) => {
          return cItem.value !== item;
        });
      }
    });
  };

  const isShowSize = ref(false); // 是否展示商品尺码
  const cateType = ref('');
  // 选择完类目
  const changeCate = (e) => {
    if (!e) {
      // 清空标题和类目属性
      formData.prodListingTemuPropertyList = [];
      formData.productName = '';
      formData.businessId = '';
      ingredientList.value = [];
      return;
    }
    formData.catsIds = e;
    // 每一级的 cateid
    formData.leafCateId = formData.catsIds[formData.catsIds.length - 1];
    for (let i = 1; i < 10; i++) {
      formData['cate' + i + 'Id'] = 0;
    }
    formData.catsIds.forEach((item, index) => {
      formData['cate' + (index + 1) + 'Id'] = item;
    });
    // 选择类目 生成标题
    getProductTitle();
    // 选择类目 生成产品属性
    getProperties();

    if (formData.cate3Id === 1630 || formData.cate3Id === 1861) {
      // 猫玩具 狗玩具
      formData.description =
        decriptionCopy.value +
        '\n' +
        'WARNING: CHOCKING or INTESTINAL OBSTRUCTION HAZARD. Supervise your pet when using，Stop using if there is damage.Toys for pets only. Keep out of reach of children.';
    } else {
      formData.description = decriptionCopy.value;
    }
    // 清除选中的商品尺码
    formData.businessId = '';
    getCateType(oaList.value, formData.leafCateId);
    getSizeTemplateData();
  };

  // 是否进行商品尺码展示
  const getCateType = (data, id) => {
    data.map((item) => {
      if (item.value == id) {
        cateType.value = item.catType; // 结果赋值
        formData.catType = item.catType;
        return;
      } else {
        if (item.data) {
          getCateType(item.data, id);
        }
      }
    });
  };

  // 检查模板
  const sizeChartsContent = ref('');
  const checkTemplateData = async (callback) => {
    let sizeList = [];
    formData.prodListingSubSkuTemuDtoList.forEach((item) => {
      item.size && sizeList.push(item.size);
    });
    let content = '';
    sizeTempList.value.forEach((item) => {
      if (item.businessId === formData.businessId) {
        content = item.content;
      }
    });
    try {
      const { code, data } = await checkTemplate({
        storeAcctId: props.storeAccId,
        sizeList: sizeList,
        content: JSON.parse(content)
      });
      if (code === '0000') {
        if (data) {
          sizeChartsContent.value = JSON.parse(data);
        }
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 同步类目
  const syncCateData = async () => {
    if (!formData.catsIds) {
      return ElMessage.warning('请先选择平台类目');
    }
    try {
      let params = {
        storeAcctId: props.storeAccId,
        salesSite: salesSite.value || 'US',
        cateId: formData.leafCateId
      };
      const { code } = await syncCate(params);
      if (code === '0000') {
        ElMessage.success('同步成功！');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 推荐类目
  const cnTitle = ref('');
  const enTitle = ref('');
  const recommendedCategoryInfo = ref({});
  const showRecommendedCategory = ref(false);
  const handleRecommendedCategory = () => {
    recommendedCategoryInfo.value = {
      storeAcctId: props.storeAccId,
      salesSite: salesSite.value || 'US',
      cnTitle: cnTitle.value,
      enTitle: enTitle.value
    };
    showRecommendedCategory.value = true;
  };

  // 勾选推荐类目
  const recommendedCategoryDone = (data) => {
    showRecommendedCategory.value = false;
    // 回显产品属性
    changeCate(data[0].parentCatIds.split(',').map((item) => parseInt(item)));
  };

  // 关闭推荐类目弹窗
  const closeRecommendedCategory = () => {
    showRecommendedCategory.value = false;
  };

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  const sensitiveList = ref([]);
  // 获取敏感类型
  const getSensitiveType = async () => {
    try {
      const { code, data } = await getSensitive();
      if (code === '0000') {
        data.forEach((item) => {
          let params = {
            label: '',
            value: ''
          };
          params.value = Object.keys(item).join();
          params.label = item[params.value];
          sensitiveList.value.push(params);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formRef = ref(null);

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
      formData.carouselImageUrlList[startI] = dropEl.endEl.src;
      formData.carouselImageUrlList[endI] = dropEl.startEl.src;
    }
  };

  // 设为主图
  const setMainImg = (src, index) => {
    formData.carouselImageUrlList[index] = formData.materialImgUrl;
    formData.materialImgUrl = src;
    ElMessage.success('设置主图成功！');
  };

  // 移除图片
  const handleRemove = (index) => {
    formData.carouselImageUrlList.splice(index, 1);
  };

  // 添加至描述
  const addToDescImageList = (src) => {
    // 将当前图片添加至产品描述第一个图片楼层的末尾
    const descFirstImageFloorItem = descObj.value.info.find(
      (item) => item.type === 'image'
    );
    descFirstImageFloorItem.images.push({
      style: {},
      url: src
    });
  };

  // 一键抠图按钮类型
  const cutoutImageBtnType = 'default';

  // 美图秀秀弹窗
  const meiTuIndex = ref('');
  const openToMeiTu = (src = '', index) => {
    meiTuIndex.value = index;
    let imgWidth = window.innerWidth * 0.75;
    let imgHeight = window.innerHeight * 0.78;

    // 初始化
    MTImageEditor.init({
      moduleName: 'image-editor-sdk',
      accessKey: 'e2fpgd2lXdoG0z8Ml7BqyOUd5EgZxcvW',
      title: '美图秀秀',
      imageSrc: src,
      resizeAble: true,
      width: imgWidth,
      height: imgHeight
    });
  };

  // 根据base64转化为url
  const getImageUrl = async (newImageURL) => {
    let formData = new FormData();
    formData.append('AreaImgKey', newImageURL);
    try {
      let res = await getBase64Img(formData);
      if (res) {
        handledMeiTuSrc.value = res;
      }
    } catch (err) {
      console.log(err);
    }
  };

  //保存回调base64：图片数据
  const handledMeiTuSrc = ref('');
  MTImageEditor.saveImage((base64) => {
    MTImageEditor.close();
    // 点击保存 回显至操作图片
    getImageUrl(base64);
  });

  // 回显美图过的产品轮播图
  watch(
    () => handledMeiTuSrc.value,
    (val) => {
      if (val) {
        formData.carouselImageUrlList[meiTuIndex.value] = val;
      }
    }
  );

  // 本地上传图片
  const importSuccess = (res) => {
    if (res.code === '0000') {
      if (formData.carouselImageUrlList.length + 1 >= 10) {
        return ElMessage.warning('产品轮播图仅支持5-10张');
      }
      formData.carouselImageUrlList.push(res.msg);
    } else {
      ElMessage.error(res.msg);
    }
  };

  const importError = () => {};

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

  const closeNetwork = () => {
    showNetworkImg.value = false;
  };
  const handleUpload = () => {
    let imgList = networkImgUrls.value.split('\n');
    formData.outerPackageImageUrlList &&
    formData.outerPackageImageUrlList.length
      ? ''
      : (formData.outerPackageImageUrlList = []);
    if (netWorkType.value === 'wrap') {
      if (
        formData.outerPackageImageUrlList &&
        formData.outerPackageImageUrlList.length + imgList.length > 6
      ) {
        return ElMessage.warning(
          `外包装图片仅支持1-6张, 您最多还能上传${
            6 - formData.outerPackageImageUrlList.length
          }张！`
        );
      }
      formData.outerPackageImageUrlList =
        formData.outerPackageImageUrlList.concat(imgList);
    } else if (netWorkType.value === 'list') {
      // 变种信息列表上传网络图片
      if (imgList?.length > 1) {
        return ElMessage.warning('预览图只支持一张图片！');
      }
      formData.prodListingSubSkuTemuDtoList[rowIndex.value].thumbUrl =
        imgList[0];
    } else {
      if (formData.carouselImageUrlList.length + 1 + imgList.length > 10) {
        return ElMessage.warning(
          `产品轮播图仅支持5-10张, 您最多还能上传${
            10 - formData.carouselImageUrlList.length - 1
          }张！`
        );
      }
      formData.carouselImageUrlList =
        formData.carouselImageUrlList.concat(imgList);
    }
    showNetworkImg.value = false;
  };

  // 点击模板图片
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const remainderLimit = ref(0);
  const uploadTempType = ref('');
  const uploadTempImg = async (type, idx) => {
    // 最多上传图片限制
    remainderLimit.value =
      type === 'list' ? 1 : 10 - formData.carouselImageUrlList.length;

    if (type === 'list') {
      await emit('getTableData');
      rowIndex.value = idx;
    }
    uploadTempType.value = type;
    tplImgVisible.value = true;

    tplImgParams.value = {
      platCode: 'temu',
      prodSSkus: formData.prodListingSubSkuTemuDtoList.map(
        (item) => item.prodSSku
      )
    };
  };

  // 渲染选择的模板图片
  const getTplImg = (imgUrlList) => {
    if (uploadTempType.value === 'list') {
      const checkedTempImage = imgUrlList[0];
      formData.prodListingSubSkuTemuDtoList[rowIndex.value].thumbUrl =
        checkedTempImage;
    }

    if (uploadTempType.value === 'basic') {
      formData.carouselImageUrlList =
        formData.carouselImageUrlList.concat(imgUrlList);
    }
  };

  // 移除外包装图片
  const handleRemoveWrap = (index) => {
    formData.outerPackageImageUrlList.splice(index, 1);
  };

  // 外包装图片 本地上传图片
  const importSuccessWrap = (res) => {
    formData.outerPackageImageUrlList &&
    formData.outerPackageImageUrlList.length
      ? ''
      : (formData.outerPackageImageUrlList = []);
    if (res.code === '0000') {
      if (
        formData.outerPackageImageUrlList &&
        formData.outerPackageImageUrlList.length >= 6
      ) {
        return ElMessage.warning('外包装图片仅支持1-6张');
      }
      formData.outerPackageImageUrlList.push(res.msg);
    } else {
      ElMessage.error(res.msg);
    }
  };

  // 变种信息 本地上传图片
  const importSuccessList = (res, rowIndex) => {
    if (res.code === '0000') {
      formData.prodListingSubSkuTemuDtoList[rowIndex].thumbUrl = res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };

  // 批量设置
  const handleSet = () => {
    Object.keys(mulSetting).forEach((item) => {
      formData.prodListingSubSkuTemuDtoList.forEach((cItem) => {
        if (mulSetting[item] !== '') {
          if (item === 'supplierPriceCny') {
            cItem.priceList[0].price = mulSetting[item];
          } else if (item === 'supplierPriceUsd') {
            cItem.priceList[1].price = mulSetting[item];
          } else {
            cItem[item] = mulSetting[item];
          }
        }
        const obj = {
          110001: 'maxBatteryCapacity',
          120001: 'maxBatteryCapacity',
          170001: 'maxKnifeLength',
          140001: 'maxLiquidCapacity'
        };

        ['110001', '120001', '170001', '140001'].forEach((val) => {
          delete cItem[obj[val]];
        });
        cItem.sensitiveTypeList = mulSetting.sensitiveTypeList;
        if (mulSetting.sensitive) {
          mulSetting.sensitiveTypeList.forEach((item) => {
            cItem[obj[item]] = mulSetting[obj[item]];
          });
        }
      });
    });
  };

  const changeSensitive = (val) => {
    if (val === false) {
      mulSetting.sensitiveTypes = '';
    }
  };

  // 选择平台属性
  const changePlatPropSelect = (val, idx) => {
    formData.prodListingSubSkuTemuDtoList.forEach((item) => {
      item.prodListingSubSkuTemuPropertyList.forEach((cItem, cIndex) => {
        if (cIndex === idx) {
          cItem.vid = '';
          cItem.specName = '';
        }
      });
    });
  };
  const changePlatProp = (val, row, pname, idx) => {
    if (pname) {
      let propTarget = row[pname]; // 获取对应模板属性的值 10
      // 找到相同值的模板属性 再将其下拉框数据设置为相同
      formData.prodListingSubSkuTemuDtoList.forEach((item) => {
        if (item[pname] === propTarget) {
          item.prodListingSubSkuTemuPropertyList.forEach((cItem, cIndex) => {
            if (cIndex === idx) {
              cItem.vid = val;
            }
          });
        }
      });
    }
  };

  const changeCustom = (val, row, pname, idx) => {
    if (pname) {
      let propTarget = row[pname]; // 获取对应模板属性的值 10
      // 找到相同值的模板属性 再将其下拉框数据设置为相同
      formData.prodListingSubSkuTemuDtoList.forEach((item) => {
        if (item[pname] === propTarget) {
          item.prodListingSubSkuTemuPropertyList.forEach((cItem, cIndex) => {
            if (cIndex === idx) {
              cItem.specName = val;
            }
          });
        }
      });
    }
  };

  const handleSave = (formEl) => {
    if (!formEl) return;
    // 产品描述校验必填
    if (!descObj.value.info?.length > 0) {
      return ElMessage.warning('产品描述为必填，请添加！');
    }

    // 验证敏感属性 是否必填
    let isSensitive =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        if (item.sensitive) {
          return (
            item.sensitiveTypeList === undefined ||
            !item.sensitiveTypeList.length
          );
        }
      });
    if (isSensitive) {
      return ElMessage.warning('请选择敏感属性！');
    }
    formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.forEach((item) => {
        if (item.sensitive) {
          item.sensitiveTypes = item.sensitiveTypeList.join(',');
        }
      });

    // 校验敏感属性
    let isLimit100 =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        if (item.sensitive) {
          return (
            Number(item.maxBatteryCapacity) > 100 ||
            Number(item.maxLiquidCapacity) > 100
          );
        }
      });
    if (isLimit100) {
      return ElMessage.warning('敏感属性纯电、内电或者液体限制单位在100以内！');
    }
    let isLimit150 =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        if (item.sensitive) {
          return Number(item.maxKnifeLength) > 15;
        }
      });
    if (isLimit150) {
      return ElMessage.warning('敏感属性刀具限制单位在15以内！');
    }

    let allImgs = [formData.materialImgUrl].concat(
      formData.carouselImageUrlList
    );
    if (allImgs.length < 5 || allImgs.length > 10) {
      return ElMessage.warning('轮播图仅支持5-10张！');
    }
    if (
      !formData.outerPackageImageUrlList ||
      formData.outerPackageImageUrlList?.length === 0
    ) {
      return ElMessage.warning('请上传外包装图片！');
    }

    formData.prodListingSubSkuTemuDtoList?.forEach((row) => {
      row.supplierPrice = '';
      if (row.priceList && row.priceList.length) {
        // 找到当前币种
        row.supplierPrice = row.priceList.find((v) => v.current)?.price;
      }
    });
    // 校验价格
    let price =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        return item.supplierPrice === '' || item.supplierPrice === undefined;
      });
    if (price) {
      return ElMessage.warning('请填入价格！');
    }
    // 校验体积
    let vol =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        return (
          item.length === '' ||
          item.length === undefined ||
          item.width === '' ||
          item.width === undefined ||
          item.height === '' ||
          item.height === undefined
        );
      });
    if (vol) {
      return ElMessage.warning('请填入长宽高！');
    }
    // 校验重量
    let weight =
      formData.prodListingSubSkuTemuDtoList &&
      formData.prodListingSubSkuTemuDtoList.some((item) => {
        return item.weight === '' || item.weight === undefined;
      });
    if (weight) {
      return ElMessage.warning('请填入重量！');
    }

    let isSum100 = ingredientList.value?.filter((pItem) => {
      const ingredientArr = pItem?.ingredientRowList?.map(
        (item) => item.propertyNumberInputValue
      );
      const sumIngredient = ingredientArr?.reduce(
        (accumulator, currentValue) => {
          return (
            (Number(accumulator) * 1000 + Number(currentValue) * 1000) / 1000
          );
        },
        0
      );
      return sumIngredient !== 100;
    });
    // 判断成分是否必填 如果不是必填 则不必限制总和为 100，但不是必填项如果填写了，依旧要限制
    isSum100 = isSum100?.filter((pItem) => {
      const ingredientArr = pItem?.ingredientRowList?.map(
        (item) => item.propertyNumberInputValue
      );
      return !(
        ingredientArr?.includes(undefined) || ingredientArr?.includes('')
      );
    });
    if (isSum100?.length > 0) {
      ElMessage.warning('成分比例总和需为100,请重新填写！');
      return;
    }

    // 验证产品属性必填
    let isProperty =
      formData.prodListingTemuPropertyList &&
      formData.prodListingTemuPropertyList
        .filter((item) => item.required)
        .some((item) => {
          if (multiProdAttrList.value.includes(item.propertyPropName)) {
            return !item.propertyVId;
          } else {
            if (item.controlType === 0) {
              // 如果是输入框 没有 propertyVId，则需要校验 propertyPropValue 是否有值
              return (
                item.propertyPropValue === '' ||
                item.propertyPropValue === undefined
              );
            } else if (item.controlType === 16) {
              let arr = item?.ingredientRowList?.filter(
                (cItem) => !cItem.propertyNumberInputValue || !cItem.propertyVId
              );
              return arr?.length > 0;
            } else {
              return item.propertyVId === '' || item.propertyVId === undefined;
            }
          }
        });
    if (isProperty) {
      return ElMessage.warning('请选择产品属性！');
    }

    // 写入产品属性
    let prodListingTemuPropertyList = [];
    if (formData.prodListingTemuPropertyList) {
      formData.prodListingTemuPropertyList.forEach((item) => {
        if (
          JSON.stringify(catsIdsCopy.value) !== JSON.stringify(formData.catsIds)
        ) {
          delete item.id;
        }
        if (item.pid !== undefined) {
          item['propertyPId'] = item.pid || '';
        }
        if (item.name !== undefined) {
          item['propertyPropName'] = item.name || '';
        }
        if (item.refPid !== undefined) {
          item['propertyRefPId'] = item.refPid || '';
        }
        if (item.templatePid !== undefined) {
          item['propertyTemplatePId'] = item.templatePid || '';
        }
        if (item.valueUnit !== undefined) {
          item['propertyValueUnit'] =
            item.valueUnit || item.propertyValueUnit || '';
        }
        if (item.parentSpecId) {
          item.propertyParentSpecId = item.parentSpecId;
          delete item.parentSpecId;
        }
        // 输入框
        // controlType为0时 户输入propertyPropValue 对应的 propertyVId 前端默认给0
        if (item.controlType === 0) {
          item.propertyVId = 0;
        }

        // 多选拆开
        console.log('multiProdAttrList.value', item);
        if (multiProdAttrList.value.includes(item.propertyPropName)) {
          // let propertyVIdList = item.ingredientRowList?.map(
          //   (item) => item.propertyVId
          // );
          item.optionalValueList?.forEach((cItem) => {
            if (item.propertyVId.includes(cItem.vid)) {
              let newItem = {};
              newItem.propertyVId = cItem.vid;
              newItem.propertyPropValue = cItem.value;
              newItem['propertySpecId'] = cItem.specId;
              newItem['propertyParentSpecId'] =
                cItem.parentSpecId ||
                item.parentSpecId ||
                item.propertyParentSpecId;
              newItem['propertyVGroupId'] = cItem.group?.id;
              newItem['propertyVGroupName'] = cItem.group?.name;
              newItem['propertyValueExtendInfo'] = cItem.extendInfo;
              prodListingTemuPropertyList.push({ ...item, ...newItem });
            }
          });
        } else {
          item.optionalValueList?.forEach((cItem) => {
            let isCurproperty = false;
            if (multiProdAttrList.value.includes(item.propertyPropName)) {
              isCurproperty = item.propertyVId.includes(cItem.vid);
            } else {
              isCurproperty = item.propertyVId === cItem.vid;
            }
            if (isCurproperty) {
              item.propertyPropValue = cItem.value;
              item['propertySpecId'] = cItem.specId;
              item['propertyParentSpecId'] =
                cItem.parentSpecId ||
                item.parentSpecId ||
                item.propertyParentSpecId;
              item['propertyVGroupId'] = cItem.group?.id;
              item['propertyVGroupName'] = cItem.group?.name;
              item['propertyValueExtendInfo'] = cItem.extendInfo;
            }
          });
          prodListingTemuPropertyList.push(item);
        }
      });
    }

    prodListingTemuPropertyList = handleIngredientData(
      prodListingTemuPropertyList
    );
    console.log('prodListingTemuPropertyList', prodListingTemuPropertyList);

    // 验证商品尺码必填
    const isRequiredSize =
      requiredIdList.includes(sizeClassId.value) || formData.catType === 1;
    if (isShowSize.value && isRequiredSize) {
      if (!formData.businessId) {
        return ElMessage.warning('请选择商品尺码！');
      }
    }

    // 校验预览图必填
    let isEmptyImage = formData.prodListingSubSkuTemuDtoList?.some((item) => {
      return !item.thumbUrl;
    });
    if (isEmptyImage) {
      return ElMessage.warning('变种信息预览图必填！');
    }

    formEl.validate(async (valid) => {
      if (valid) {
        if (isShowSize.value && formData.businessId) {
          checkTemplateData(() => {
            saveSubmit(allImgs, prodListingTemuPropertyList);
          });
        } else {
          saveSubmit(allImgs, prodListingTemuPropertyList);
        }
      } else {
        return false;
      }
    });
  };

  // 处理成分比例的数据结构
  const handleIngredientData = (prodListingTemuPropertyList) => {
    // 不是成分比例 controlType = 16 的数据
    let notIngredientAttrList = prodListingTemuPropertyList?.filter(
      (item) => item.controlType !== 16
    );
    let ingredientAttrList = prodListingTemuPropertyList?.filter(
      (item) => item.controlType === 16
    );

    let expandList = []; // 成分比例数据 扁平化
    ingredientAttrList?.forEach((item) => {
      if (item.ingredientRowList?.length > 0) {
        item.ingredientRowList?.forEach((cItem) => {
          let obj = JSON.parse(JSON.stringify(item));
          obj.numberInputTitle = cItem.numberInputTitle || '';
          obj.propertyChooseTitle = cItem.propertyChooseTitle || '';
          obj.propertyNumberInputValue = cItem.propertyNumberInputValue || '';
          obj.propertyPropValue = cItem.propertyPropValue || '';
          obj.propertyVId = cItem.propertyVId || '';
          expandList.push(obj);
        });
      }
    });
    prodListingTemuPropertyList = notIngredientAttrList.concat(expandList);
    return prodListingTemuPropertyList;
  };

  // 平台属性写入
  const handlePlatProps = () => {
    // 获取自定义属性的选择值
    let customValue = {};
    prodCateAttrTemuList.value?.forEach((item) => {
      if (item.isCustom) {
        customValue = item;
      }
    });
    // 根据 选择的父规格名称name 获取 父规格id
    parentSpecOption.value?.forEach((item) => {
      if (item.parentSpecName === customValue.name) {
        customValue.id = item.parentSpecId;
      }
    });
    formData.prodListingSubSkuTemuDtoList.forEach((item) => {
      item.prodListingSubSkuTemuPropertyList?.forEach((cItem) => {
        let optionSelect = cItem.optionalValueList?.filter((e) => {
          return e.vid === cItem.vid;
        });
        let customSelect = '';
        if (cItem.isCustom) {
          customSelect = cItem;
        }
        let obj = {};
        if (optionSelect) {
          obj = {
            parentSpecId: cItem.parentSpecId,
            parentSpecName: cItem.name,
            specId: optionSelect[0]?.specId,
            specName: optionSelect[0]?.value,
            refPId: cItem.refPid,
            templatePId: cItem.templatePid,
            pId: cItem.pid,
            propName: cItem.name,
            propValue: optionSelect[0]?.value,
            vid: cItem.vid,
            valueUnit: cItem.valueUnit,
            valueGroupId: optionSelect[0]?.group.id,
            valueGroupName: optionSelect[0]?.group.name,
            valueExtendInfo: optionSelect[0]?.extendInfo
          };

          Object.keys(obj).forEach((key) => {
            cItem[key] = obj[key];
          });
          for (const prop in cItem) {
            if (
              Object.keys(obj).includes(prop) === false &&
              prop !== 'optionalValueList' &&
              prop !== 'name'
            ) {
              delete cItem[prop];
            }
          }
        }
        if (customSelect) {
          obj = {
            parentSpecId: customValue.id,
            parentSpecName: customValue.name,
            specName: customSelect.specName
          };

          Object.keys(obj).forEach((key) => {
            cItem[key] = obj[key];
          });
          for (const prop in cItem) {
            if (
              Object.keys(obj).includes(prop) === false &&
              prop !== 'optionalValueList' &&
              prop !== 'isCustom'
            ) {
              delete cItem[prop];
            }
          }
        }
      });
    });
  };

  const saveSubmit = async (allImgs, prodListingTemuPropertyList) => {
    handlePlatProps();

    loading.value = true;
    // 商品尺码 classId
    let classId = '';
    sizeTempList.value.forEach((item) => {
      if (item.businessId === formData.businessId) {
        classId = item.classId;
      }
    });
    try {
      let prodListingSubSkuTemuDtoList = JSON.parse(
        JSON.stringify(formData.prodListingSubSkuTemuDtoList)
      );
      prodListingSubSkuTemuDtoList?.forEach((item) => {
        // sku属性枚举选择无，则该SKU属性不传
        item.prodListingSubSkuTemuPropertyList =
          item.prodListingSubSkuTemuPropertyList?.filter((cItem) => {
            return cItem.parentSpecName && cItem.parentSpecId !== '无';
          });
      });

      let params = {
        ...formData,
        description: JSON.stringify({
          moduleList: descObj.value.info
        }),
        carouselImageUrlList: allImgs,
        prodListingTemuPropertyList,
        prodListingSubSkuTemuDtoList
      };
      let templateParams = {
        businessId: formData.businessId,
        catType: cateType.value,
        classId: classId,
        sizeChartsContent: JSON.stringify(sizeChartsContent.value)
      };
      if (!isShowSize.value) {
        templateParams = {};
      }
      if (!sizeChartsContent.value) {
        delete templateParams.sizeChartsContent;
      }
      if (!isShowSize.value) {
        delete templateParams.businessId;
        delete params.businessId;
      }
      let addParams = {
        storeAcctId: props.storeAccId,
        salesSite: 'US',
        prodPId: props.prodPId
      };
      const { code } =
        props.action === 'update'
          ? await updateDetail({ ...params, ...templateParams })
          : await createPublish({
              ...params,
              ...addParams,
              ...templateParams
            });
      if (code === '0000') {
        ElMessage.success('保存成功！');
        emit('close', 'update');
      }
      loading.value = false;
    } catch (err) {
      console.log(err);
      loading.value = false;
    }
  };

  const handleClose = () => {
    emit('close');
  };

  // 移除变种信息
  const removeInfo = (row) => {
    formData.prodListingSubSkuTemuDtoList =
      formData.prodListingSubSkuTemuDtoList.filter(
        (item) => item.prodTempId !== row.prodTempId
      );
  };

  const skuInfoForm = reactive({
    storeAcctId: props.storeAccId,
    salesSite: 'US',
    prodSSkuStr: ''
  });
  const skuInfoList = reactive([]); // 新增的变种信息

  // 新增变种信息
  const handleAddInfo = () => {
    showAddDialog.value = true;
    skuInfoForm.prodSSkuStr = '';
  };

  const showAddDialog = ref(false);
  const closeAddDialog = () => {
    showAddDialog.value = false;
  };

  const addSku = async () => {
    if (!skuInfoForm.prodSSkuStr) {
      return ElMessage.warning('请填写商品子SKU!');
    }
    try {
      const { code, msg, data } = await addProdSSkuInfos(skuInfoForm);
      let firstSkuItem = JSON.parse(
        JSON.stringify(
          formData.prodListingSubSkuTemuDtoList[0]
            .prodListingSubSkuTemuPropertyList
        )
      );
      data?.forEach((item) => {
        firstSkuItem?.forEach((item) => {
          item.specName = '';
        });
        // item.color = '';
        // item.size = '';
        // item.style = '';
        item.prodListingSubSkuTemuPropertyList = firstSkuItem;
      });

      skuInfoList.value = data || [];
      let listIds = formData.prodListingSubSkuTemuDtoList.map(
        (item) => item.prodTempId
      );
      skuInfoList.value.forEach((item) => {
        if (!listIds.includes(item.prodTempId)) {
          formData.prodListingSubSkuTemuDtoList =
            formData.prodListingSubSkuTemuDtoList.concat([item]);
        }
      });
      initProdListingSubSkuTemuPropertyList();
      if (code === '0000') {
        ElMessage.success('新增成功！');
      } else {
        ElMessageBox.alert(msg || '请求失败', '错误信息', {
          confirmButtonText: '确认',
          type: 'error'
        });
      }
      closeAddDialog();
    } catch (err) {
      console.log(err);
    }
  };

  // 获取子sku table数据
  const temuSkuTableRef = ref(null);
  const fullTableData = ref([]);
  const getSkuTableData = () => {
    const { fullData } = temuSkuTableRef.value.getTableData();
    fullTableData.value = fullData;
  };

  // 改变描述
  const changeDesc = ({ type, val }) => {
    descObj.value[type] = val;
  };
</script>

<style lang="scss" scoped>
  // .label_item {
  //   display: flex;
  //   flex-wrap: wrap;
  //   margin-left: 180px;
  // }
  .label_title {
    width: 180px;
    text-align: right;
    font-size: 14px;
    padding-right: 8px;
    box-sizing: border-box;
  }
  .title_limit {
    margin-left: 20px;
    font-size: 12px;
    color: #cccccc;
  }
  .wrap_imgs_content {
  }
  .imgs_content {
    display: flex;
    margin-top: 40px;
    width: 100%;
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
    .upload_img {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .small_item {
      border: 1px dashed #ccc;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .small_img {
      width: 108px;
      height: 100px;
      object-fit: contain;
      border-bottom: 1px dashed #ccc;
    }
    :deep(.el-popover) .el-image {
      height: auto;
      width: 100%;
    }
    span {
      padding-left: 10px;
    }
    .tip {
      position: absolute;
      bottom: 0;
    }
  }
  .tool_btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .color_red {
    color: red;
  }
  .px10 {
    padding: 0 10px;
  }
  .preview_img {
    width: 100px;
    height: 100px;
    border: 1px dashed #ddd;
    img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }
    .el-image,
    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
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
  .tooltipText {
    color: red;
  }
  .ingredient {
    min-width: 800px;
    width: 100%;
    display: flex;
    // flex-wrap: wrap;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  .ingredientWidth {
    width: 95%;
  }
  .ingredientFormItemStyle {
    display: flex;
    // flex-wrap: wrap;
    align-items: center;
    margin-top: 10px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .ml-20 {
    margin-left: 20px;
  }
  .p-10 {
    padding: 10px;
  }
  .supplierPrice_content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
