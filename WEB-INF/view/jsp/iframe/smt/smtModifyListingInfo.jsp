<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>smt修改lising</title>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<!-- 富文本样式 -->
<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/Huploadify/Huploadify.css"
  media="all"
/>
<style>
  /* 时间线树 */
  #smtOnline_updateListingInfo_listDetailTpl_TimeLineTree {
    position: fixed;
    z-index: 20000;
    right: 20px;
    top: 50px;
  }
  #smtOnline_updateListingInfo_listDetailTpl_TimeLineTree li {
    padding: 6px 15px;
  }

  #smtOnline_updateListingInfo_listDetailTpl_TimeLineTree li a,
  #smtOnline_updateListingInfo_listDetailTpl_TimeLineTree li i {
    color: #1e9fff;
  }

  #LAY_smtOnline_updateListingInfo .layui-card-header {
    font-size: 20px;
  }
  .smtModifyTitleDesc_find {
    display: flex;
    justify-content: center;
    padding: 0 120px 20px 120px;
  }

  .smtModifyTitleDesc_find span {
    line-height: 30px;
    flex: none;
  }

  .smtModifyTitleDesc_find input {
    flex: 5;
    margin-left: 10px;
    margin-right: 30px;
  }

  .smtModifyTitleDesc-dropdown-content {
    display: none;
    position: absolute;
    z-index: 99;
    background-color: #f9f9f9;
    width: 120px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 12px 0;
    transform: translateX(-10px);
  }

  .smtModifyTitleDesc-dropdown-content div:hover {
    background-color: #f1f1f1;
    color: #009688;
  }

  .smtModifyTitleDesc-dropdown:hover .smtModifyTitleDesc-dropdown-content {
    display: block;
    z-index: 99;
  }

  .smtModifyTitleDesc-dropdown-content div {
    padding: 0 16px;
    line-height: 38px;
    font-size: 13px;
  }

  .smtModifyTitleDesc-rowFlexClass {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border: 1px solid #eee;
    align-items: center;
    font-size: 16px;
  }

  .smtModifyTitleDesc-rowFlexLeft {
    width: 120px;
    text-align: center;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
  }

  .smtModifyTitleDesc-rowflexline {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
  }

  .smtModifyTitleDesc-rowFlexClass {
    height: 120px;
  }

  .smtModifyTitleDesc-rowFlexClassText {
    height: 240px;
  }

  .smtModifyTitleDesc-rowFlexClass .smtModifyTitleDesc-textFlexCloumn {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .smtModifyTitleDesc-rowFlexClass .smtModifyTitleDesc-textClass {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    font-size: 14px;
    color: #333;
    line-height: 26px;
    white-space: pre-wrap;
  }

  .smtModifyTitleDesc-rowFlexClass_line_content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .shopinfo-smtDesc {
    font-size: 16px;
    margin: 0 50px;
  }
  .title {
    font-size: 20px;
    margin: 20px 50px;
  }

  .smtModifyTitleDesc-PHinfo,
  .smtModifyTitleDesc-PCinfo {
    position: relative;
    margin: 50px 0 10px;
  }

  .disNsmtDesc {
    display: none !important;
  }

  .smtModifyTitleDesc_tplimg_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 16.6%);
  }

  /* 富文本高度
  #smtModifyTitleDesc_PCdesc .w-e-text-container {
    height: 80vh !important;
  } */
  .smtOnline_updateListingInfo-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: 10px;
  }

  .smtOnline_updateListingInfo-uploader-file {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  .smtOnline_updateListingInfo-disfcenter {
    display: flex;
    justify-content: center;
  }

  .smtOnline_updateListingInfo-align-center {
    align-items: center;
  }

  .smtOnline_updateListingInfo-bgYel {
    background: yellow;
  }

  .smtOnline_updateListingInfo-mt60 {
    margin-bottom: 60px;
  }

  .smtOnline_updateListingInfo .cell-highLight {
    background-color: #fdf5e6;
  }

  .smtOnline_updateListingInfo-fixedBtm {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    background: #fff;
    align-items: center;
    border-top: 1px solid #409eff;
    justify-content: center;
    z-index: 99999;
  }
  .el-select-dropdown {
    z-index: 99999999 !important;
  }
  .smtOnline_updateListingInfo_sale {
    width: 400px;
    display: flex;
    position: absolute;
    right: 110px;
    top: 0;
  }
</style>

<div class="layui-fluid" id="LAY_smtOnline_updateListingInfo">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div id="smtOnline_updateListingInfo_listDetailTpl_TimeLineTree">
        <ul>
          <li
            data-id="smtOnline_updateListingInfo_titleDesc"
            onclick="smtOnline_updateListingInfo_Location(this)"
          >
            <i class="layui-icon layui-icon-tree"></i>
            <a href="javascript:;">标题和描述</a>
          </li>
          <li
            data-id="smtOnline_updateListingInfo_sku_begin"
            onclick="smtOnline_updateListingInfo_Location(this)"
          >
            <i class="layui-icon layui-icon-tree"></i>
            <a href="javascript:;">修改子SKU信息</a>
          </li>
          <li
            data-id="smtOnline_updateListingInfo_sku_info"
            onclick="smtOnline_updateListingInfo_Location(this)"
          >
            <i class="layui-icon layui-icon-tree"></i>
            <a href="javascript:;">子SKU信息</a>
          </li>
        </ul>
      </div>
      <!-- 标题和描述 -->
      <div class="title" id="smtOnline_updateListingInfo_titleDesc">
        标题和描述
      </div>

      <div class="smtModifyTitleDesc_find layui-col-lg12 layui-col-md12">
        <span class="">字符</span>
        <input type="text" class="layui-input" id="smtModifyTitleDesc_origin" />
        <span>替换为：</span>
        <input
          type="text"
          class="layui-input"
          id="smtModifyTitleDesc_current"
        />
        <button
          class="layui-btn layui-btn-sm layui-btn-normal"
          id="smtModifyTitleDesc_repTitle"
        >
          替换（仅标题）
        </button>
        <button
          class="layui-btn layui-btn-sm layui-btn-normal"
          id="smtModifyTitleDesc_repTitleDesc"
          lay-verify="required"
        >
          替换（标题+描述）
        </button>
      </div>
      <div
        class="smtModifyTitleDesc_title layui-col-lg12 layui-col-md12"
        style="display: flex; justify-content: center"
      >
        <div class="layui-col-lg11 layui-col-md11" style="margin: 0 auto">
          <form action="" class="layui-from">
            <div class="layui-form-item">
              <label class="layui-form-label">标题:</label>
              <div class="layui-input-block">
                <input
                  type="text"
                  class="layui-input ifFocusInput"
                  data-prodpid=""
                  id=""
                  name="shopTiele_Desc"
                  value=""
                  oninput="smtModifyTitleDesc_titleNumNote(this)"
                  lay-verify="required"
                />
                <div id="smtModifyTitleDesc_title_numLimit"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="smtModifyTitleDesc_content layui-col-lg12 layui-col-md12">
        <div class="smtModifyTitleDesc-PHinfo" style="position: relative">
          <div class="shopinfo-smtDesc">商品详情-手机版</div>
          <div style="position: absolute; right: 120px; top: 0">
            <button
              class="layui-btn layui-btn-sm"
              onclick="smtModifyTitleDesc_wirelessToPc()"
            >
              生成PC描述
            </button>
            <button
              style="opacity: 1"
              class="layui-btn layui-btn-primary smtModifyTitleDesc-dropdown layui-btn-sm"
              id="smtModifyTitleDesc_checkDetails"
            >
              <span> 添加模块</span>
              <div class="smtModifyTitleDesc-dropdown-content">
                <div onclick="smtModifyTitleDesc_addText()">文本模块</div>
                <div onclick="smtModifyTitleDesc_addImg()">图片模块</div>
              </div>
            </button>
            <button
              class="layui-btn layui-btn-sm"
              onclick="smtModifyTitleDesc_preview()"
            >
              预览效果
            </button>
          </div>
        </div>

        <div class="layui-card">
          <div
            class="layui-card-body uploadImgUL ui-sortable"
            id="smtModifyTitleDesc_modules_phone"
          >
            <!-- 描述内容 -->
          </div>
        </div>
        <div class="smtModifyTitleDesc-PCinfo" style="position: relative">
          <div class="shopinfo-smtDesc">商品详情-电脑版</div>
        </div>
        <div class="layui-card">
          <div class="layui-card-body mb20">
            <div id="smtModifyTitleDesc_PCdesc"></div>
          </div>
        </div>
      </div>

      <!-- 子sku信息 -->
      <div id="LAY_smtOnline_updateListingInfo_sku">
        <div style="width: 5px; height: 850px"></div>
        <div class="title" id="smtOnline_updateListingInfo_sku_begin">
          修改子SKU信息
        </div>
        <el-card class="box-card">
          <div vclass="text item">
            <el-row
              v-for="item in initData"
              :key="item.id"
              :gutter="20"
              class="mb20"
            >
              <el-col :span="2">
                <div class="grid-content taCenter">
                  <font v-if="item.isMandatory" class="fRed">*</font
                  >{{ item.attrName }}
                </div>
              </el-col>
              <el-col :span="22">
                <div class="grid-content">
                  <!-- 下拉框+ 图片的 -->
                  <template v-if="item.customizedName && item.customizedPic">
                    <div
                      v-for="(elem,index) in item.chooseList"
                      :key="elem.id"
                      class="disflex mb10"
                    >
                      <div style="width: 24px">
                        <el-checkbox
                          v-if="elem.propertyValueId"
                          :checked="elem.checked"
                          v-model="elem.checked"
                          @change="checkOptionHandle($event,item,elem)"
                        >
                          <div style="height: 25px"></div>
                        </el-checkbox>
                      </div>
                      <el-select
                        filterable
                        placeholder="请选择"
                        v-model="elem.propertyValueId"
                        @visible-change="selPicHandle($event,elem,index,item)"
                        :popper-append-to-body="false"
                      >
                        <el-option
                          v-for="opItem in item.platCateAttrValueVOList"
                          :key="opItem.id"
                          :label="opItem.attrValue"
                          :value="opItem.id"
                          :disabled="opItem.checked"
                        >
                        </el-option>
                      </el-select>
                      <div class="ml20 w200">
                        <el-input
                          v-model="elem.propertyValueDefinitionName"
                          clearable
                          @change="inputAttrNameHandle($event,elem,item)"
                          placeholder="请输入内容,不支持中文字符"
                        >
                        </el-input>
                      </div>
                      <div v-if="!!elem.skuImage" class="disFCenter ml10">
                        <div>
                          <img
                            class="img_show_hide lazy w40"
                            :original="elem.skuImage"
                            v-model="elem.skuImage"
                            :src="elem.skuImage"
                            style="display: block"
                            :onerror="layui.admin.img_noFind()"
                          />
                        </div>
                        <a
                          href="javascript:void(0);"
                          class="ztt-a ml10"
                          @click="delImg(elem)"
                          >删除图片</a
                        >
                      </div>
                      <div v-else class="disFCenter pora w90 ovhi ml10">
                        <div class="disFCenter pora w90 ovhi ml10">
                          <a href="javascript:void(0);" class="ztt-a"
                            >上传图片</a
                          >
                          <input
                            type="file"
                            accept="image/*"
                            name="uploader-input"
                            class="smtOnline_updateListingInfo-uploader-file"
                            @change="uploadImg($event,elem)"
                          />
                        </div>
                      </div>
                    </div>
                    <!-- 新增关联销售功能 目前仅只支持单个销售属性 -->
                    <div
                      v-if="syncSSmtSkuDtoListShowCols.length===5 && item.chooseList.length>1"
                      class="smtOnline_updateListingInfo_sale"
                    >
                      <div class="w_100">
                        <el-input
                          v-model="newSkuStr"
                          placeholder="请输入模板父/子SKU，支持多个英文逗号分隔"
                        />
                      </div>
                      <el-button type="primary" @click="handleAddSku(item)"
                        >关联销售</el-button
                      >
                    </div>
                  </template>
                  <!-- 输入框 -->
                  <template
                    v-else-if="item.customizedName && !item.customizedPic"
                  >
                    <div class="smtOnline_updateListingInfo-grid">
                      <div
                        v-for="elem in item.platCateAttrValueVOList"
                        :key="elem.id"
                        class="disflex mr30"
                      >
                        <div style="width: 24px">
                          <el-checkbox
                            :checked="elem.checked"
                            v-model="elem.checked"
                            @change="inputChkHandle($event,item,elem)"
                          >
                            <div style="height: 25px"></div>
                          </el-checkbox>
                        </div>
                        <el-input
                          v-model="elem.propertyValueDefinitionName"
                          @change="inputAttrNameHandle($event,elem,item)"
                          placeholder="请输入内容,不支持中文字符"
                          clearable
                        ></el-input>
                      </div>
                    </div>
                  </template>
                  <!-- 没有图片没有自定义 -->
                  <template
                    v-else-if="!item.customizedName && !item.customizedPic"
                  >
                    <div class="smtOnline_updateListingInfo-grid">
                      <el-checkbox
                        v-for="elem in item.platCateAttrValueVOList"
                        :label="elem.attrValue"
                        :key="elem.id"
                        :checked="elem.checked"
                        v-model="elem.checked"
                        @change="placeCheckHandle($event,item,elem)"
                      >
                        {{ elem.attrValue }}
                      </el-checkbox>
                    </div>
                  </template>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mb20">
              <el-col :span="2">
                <div class="grid-content taCenter">区域定价</div>
              </el-col>
              <el-col :span="22">
                <div class="grid-content">
                  <div class="disflex mb10">
                    <el-checkbox
                      v-model="isRegionPrice"
                      style="
                        margin-right: 20px;
                        display: flex;
                        align-items: center;
                      "
                      >设置区域定价</el-checkbox
                    >
                    <el-select
                      filterable
                      placeholder="请选择"
                      v-model="regionPriceType"
                      placeholder="请选择调价方式"
                      :popper-append-to-body="false"
                      @change="selregionPriceHandle(regionPriceType)"
                    >
                      <el-option label="百分比调整" value="1"></el-option>
                      <el-option label="金额调整" value="2"></el-option>
                    </el-select>
                  </div>
                  <div style="width: 510px">
                    <el-card class="box-card">
                      <div class="text item">
                        <el-table :data="plaPriceData" style="width: 100%">
                          <el-table-column
                            prop="deliveryPlace"
                            label="发货地"
                            width="180"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="tpl"
                            label="调价模板"
                            width="280"
                          >
                            <template slot-scope="scope">
                              <el-select
                                filterable
                                placeholder="请选择"
                                v-model="scope.row.tpl"
                              >
                                <el-option
                                  v-for="elem in regionPriceList"
                                  :key="elem.id"
                                  :label="elem.templateName"
                                  :value="elem.id"
                                >
                                </el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-card>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card smtOnline_updateListingInfo-mt60">
          <div class="text item">
            <el-row :gutter="30" class="mb20">
              <el-col :span="2">
                <div class="grid-content" style="height: 40px"></div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <el-input v-model="grossProfitRate" placeholder="请输入内容">
                    <template slot="prepend">毛利率</template>
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <el-input v-model="discountRate" placeholder="请输入内容">
                    <template slot="prepend">优惠幅度</template>
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <el-select
                    v-model="shippingType"
                    placeholder="请选择定价方式"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="item in shippingTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="estimatedPrice"
                    >估算价格</el-button
                  >
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mb20">
              <el-col :span="2">
                <div
                  class="grid-content"
                  id="smtOnline_updateListingInfo_sku_info"
                >
                  sku信息
                </div>
              </el-col>
              <el-col :span="21">
                <el-table
                  ref="smtOnline_updateListingInfo_table"
                  :data="syncSSmtSkuDtoList"
                  border
                  style="width: 100%"
                  :cell-class-name="highLightCurCell"
                >
                  <template v-for="item in syncSSmtSkuDtoListCols">
                    <!-- 零售价 -->
                    <el-table-column
                      :key="item.prop"
                      v-if="item.prop=='price' && item.isShow"
                      :prop="item.prop"
                    >
                      <template slot="header" slot-scope="scope">
                        <div><font class="fRed">*</font>零售价（USD）</div>
                      </template>
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.price"
                          @blur="priceHandle(scope.row)"
                          controls-position="right"
                          :precision="2"
                          :step="0.01"
                          :min="0"
                          label="价格"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <!-- 零售价 -->
                    <el-table-column
                      :key="item.prop"
                      v-else-if="item.prop=='priceCny' && item.isShow"
                      :prop="item.prop"
                    >
                      <template slot="header" slot-scope="scope">
                        <div><font class="fRed">*</font>零售价（CNY）</div>
                      </template>
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.priceCny"
                          @blur="priceCnyHandle(scope.row)"
                          controls-position="right"
                          :precision="2"
                          :step="0.01"
                          :min="0"
                          label="价格"
                        ></el-input-number>
                      </template>
                    </el-table-column>
                    <!-- 商家仓库存 -->
                    <el-table-column
                      :key="item.prop"
                      v-else-if="item.prop=='ipmSkuStock' && item.isShow"
                      :prop="item.prop"
                    >
                      <template slot="header" slot-scope="scope">
                        <div class="disFCenter">
                          <div><font class="fRed">*</font>商家仓库存</div>
                          <el-input-number
                            v-model="allStock"
                            @blur="allStockBlurHandle"
                            controls-position="right"
                            :precision="0"
                            :step="1"
                            :min="0"
                            :label="item.label"
                          ></el-input-number>
                        </div>
                      </template>
                      <template slot-scope="scope">
                        <el-input-number
                          v-model="scope.row.ipmSkuStock"
                          @change="ipmSkuStockHandle"
                          controls-position="right"
                          :precision="0"
                          :step="1"
                          :min="0"
                          :label="item.label"
                        >
                        </el-input-number>
                      </template>
                    </el-table-column>
                    <!-- 商品编码 -->
                    <el-table-column
                      :key="item.prop"
                      v-else-if="item.prop=='storeSubSku' && item.isShow"
                      :prop="item.prop"
                      :label="item.label"
                    >
                      <template slot-scope="scope">
                        <div
                          class="disflex smtOnline_updateListingInfo-align-center"
                        >
                          <template v-if="scope.row.saleStatus===false">
                            <div class="fRed mr10">停</div>
                          </template>
                          <el-input
                            v-model="scope.row.storeSubSku"
                            @change="storeSubSkuHandle"
                            maxlength="50"
                            :label="item.label"
                            show-word-limit
                          ></el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 图片 -->
                    <el-table-column
                      :key="item.prop"
                      v-else-if="!!item.customizedPic && item.isShow"
                      :prop="item.prop"
                      :label="item.label"
                    >
                      <template slot-scope="scope">
                        <div
                          v-html="tableOtherPicRow(scope.row,item.id)"
                          class="disflex smtOnline_updateListingInfo-align-center"
                        ></div>
                      </template>
                    </el-table-column>
                    <!-- 其它 -->
                    <el-table-column
                      :key="item.prop"
                      v-else-if="item.isShow"
                      :prop="item.prop"
                      :label="item.label"
                    >
                      <template slot-scope="scope">
                        {{ tableOtherRow(scope.row, item.id, item) }}</template
                      >
                    </el-table-column>
                  </template>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- 保存 -->
        <div class="smtOnline_updateListingInfo-fixedBtm">
          <el-button type="primary" @click="skuInfoSubmit" size="medium"
            >保存</el-button
          >
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 文本编辑框 -->
<script type="text/html" id="smtModifyTitleDesc_text_modal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" id="smtModifyTitleDesc_text_form">
        <div class="smtModifyTitleDesc-desc-label">标题（非必填）</div>
        <div>
          <input
            type="text"
            class="layui-input"
            name="title"
            autocomplete="off"
            maxlength="218"
          />
        </div>
        <div class="smtModifyTitleDesc-desc-label">文本内容（非必填）</div>
        <textarea
          name="content"
          class="layui-textarea smtModifyTitleDesc-desc-textarea"
        ></textarea>
      </form>
    </div>
  </div>
</script>

<!-- 添加图片通过url -->
<script type="text/html" id="smtModifyTitleDesc_imgUrl_modal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form mb20" id="smtModifyTitleDesc_img_form">
        {{# layui.each(d,function(index){ }}
        <div class="layui-form-item mr10 mb20">
          <div class="layui-form-label">链接{{index+1}}</div>
          <div class="layui-input-block">
            <input
              type="text"
              class="layui-input"
              name="imgUrl{{index+1}}"
              onblur="smtModifyTitleDesc_isImgurl(this)"
            />
          </div>
        </div>
        {{# }) }}
      </form>
      <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
    </div>
  </div>
</script>

<!-- 图片超链接 -->
<script type="text/html" id="smtModifyTitleDesc_targetURL">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form mb20">
        <div class="layui-form-item">
          <input
            type="text"
            class="layui-input"
            id="smtModifyTitleDesc_targetURL_input"
            name="targetURL"
            placeholder="请输入该图片跳转URL"
            onblur="smtModifyTitleDesc_isurl(this)"
          />
        </div>
      </form>
      <div class="taCenter fRed">输入图片路径后需要点击输入框空白处</div>
    </div>
  </div>
</script>

<!-- 富文本 -->
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>

<script
  type="text/javascript"
  src="${ctx}/static/Huploadify/jquery.Huploadify.js"
></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>

<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtModifyTitleDesc.js"
></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtModifyListingInfo.js"
></script>
<!-- <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifySskuInfo.js"></script> -->
