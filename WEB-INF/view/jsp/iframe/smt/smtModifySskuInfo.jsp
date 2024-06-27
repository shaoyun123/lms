<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>修改子SKU信息</title>
        <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css">
        <link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all">
        <style>
            .smtModifySskuInfo-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                grid-row-gap: 10px;
            }

            .smtModifySskuInfo-uploader-file {
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
            }

            .smtModifySskuInfo-disfcenter {
                display: flex;
                justify-content: center;
            }

            .smtModifySskuInfo-align-center {
                align-items: center;
            }

            .smtModifySskuInfo-bgYel {
                background: yellow;
            }

            .smtModifySskuInfo-fixedBtm {
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
                z-index: 9;
            }

            .smtModifySskuInfo-mt60 {
                margin-bottom: 60px;
            }

            .smtModifySskuInfo .cell-highLight {
                background-color: #fdf5e6;
            }

            .smtModifySskuInfo-message {
                z-index: 20000000 !important;
            }
            .el-select-dropdown {
                z-index: 99999999 !important;
            }
            .smtModifySskuInfo_sale {
    width: 400px;
    display: flex;
    position: absolute;
    right: 110px;
    top: 0;
  }
        </style>
        <div id="LAY-smtModifySskuInfo" v-cloak class="smtModifySskuInfo">
            <el-card class="box-card">
                <div vclass="text item">
                    <el-row v-for="item in initData" :key="item.id" :gutter="20" class="mb20">
                        <el-col :span="4">
                            <div class="grid-content taCenter">
                                <font v-if="item.isMandatory" class="fRed">*</font>{{item.attrName}}
                            </div>
                        </el-col>
                        <el-col :span="20">
                            <div class="grid-content">
                                <!-- 下拉框+ 图片的 -->
                                <template v-if="item.customizedName && item.customizedPic">
                                    <div v-for="(elem,index) in item.chooseList" :key="elem.id" class="disflex mb10">
                                        <div style="width:24px">
                                            <el-checkbox v-if="elem.propertyValueId" :checked="elem.checked"
                                                v-model="elem.checked" @change="checkOptionHandle($event,item,elem)">
                                                <div style="height: 25px;"></div>
                                            </el-checkbox>
                                        </div>
                                        <el-select filterable placeholder="请选择" v-model="elem.propertyValueId"
                                            @visible-change="selPicHandle($event,elem,index,item)"
                                            :popper-append-to-body="false">
                                            <el-option v-for="opItem in item.platCateAttrValueVOList" :key="opItem.id"
                                                :label="opItem.attrValue" :value="opItem.id" :disabled="opItem.checked">
                                            </el-option>
                                        </el-select>
                                        <div class="ml20 w200">
                                            <el-input v-model="elem.propertyValueDefinitionName" clearable
                                                @change="inputAttrNameHandle($event,elem,item)"
                                                placeholder="请输入内容,不支持中文字符">
                                            </el-input>
                                        </div>
                                        <div v-if="!!elem.skuImage" class="disFCenter ml10">
                                            <div>
                                                <img class="img_show_hide lazy w40" :original="elem.skuImage"
                                                    v-model="elem.skuImage" :src="elem.skuImage" style="display: block;"
                                                    :onerror="layui.admin.img_noFind()">
                                            </div>
                                            <a href="javascript:void(0);" class="ztt-a ml10"
                                                @click="delImg(elem)">删除图片</a>
                                        </div>
                                        <!-- <div v-else class="disFCenter"> -->
                                        <div v-else class="disFCenter pora w90 ovhi ml10">
                                            <div class="disFCenter pora w90 ovhi ml10"><a href="javascript:void(0);"
                                                    class="ztt-a">上传图片</a>
                                                <input type="file" accept="image/*" name="uploader-input"
                                                    class="smtModifySskuInfo-uploader-file"
                                                    @change="uploadImg($event,elem)">
                                            </div>
                                            <!-- <el-input v-model="elem.skuImage" @change="uploadImgByInput($event,elem)"></el-input> -->
                                        </div>
                                    </div>
                                    <!-- 新增关联销售功能 目前仅只支持单个销售属性 -->
                                    <div
                                        v-if="syncSSmtSkuDtoListShowCols.length===5 && item.chooseList.length>1"
                                        class="smtModifySskuInfo_sale"
                                    >
                                    <div class="w_100">
                                        <el-input
                                            v-model="newSkuStr"
                                            placeholder="请输入模板父/子SKU，支持多个英文逗号分隔"
                                        />
                                    </div>
                                    <el-button type="primary" @click="handleAddSku(item)">关联销售</el-button>
                                </div>
                                </template>
                                <!-- 输入框 -->
                                <template v-else-if="item.customizedName && !item.customizedPic">
                                    <div class="smtModifySskuInfo-grid">
                                        <div v-for="elem in item.platCateAttrValueVOList" :key="elem.id"
                                            class="disflex mr30">
                                            <div style="width:24px">
                                                <el-checkbox :checked="elem.checked" v-model="elem.checked"
                                                    @change="inputChkHandle($event,item,elem)">
                                                    <div style="height: 25px;"></div>
                                                </el-checkbox>
                                            </div>
                                            <el-input v-model="elem.propertyValueDefinitionName"
                                                @change="inputAttrNameHandle($event,elem,item)"
                                                placeholder="请输入内容,不支持中文字符" clearable></el-input>
                                        </div>
                                    </div>
                                </template>
                                <!-- 没有图片没有自定义 -->
                                <template v-else-if="!item.customizedName && !item.customizedPic">
                                    <div class="smtModifySskuInfo-grid">
                                        <el-checkbox v-for="elem in item.platCateAttrValueVOList"
                                            :label="elem.attrValue" :key="elem.id" :checked="elem.checked"
                                            v-model="elem.checked" @change="placeCheckHandle($event,item,elem)">
                                            {{elem.attrValue}}
                                        </el-checkbox>
                                    </div>
                                </template>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="mb20">
                        <el-col :span="4">
                            <div class="grid-content taCenter">区域定价</div>
                        </el-col>
                        <el-col :span="20">
                            <div class="grid-content">
                                <div class="disflex mb10">
                                    <el-checkbox v-model="isRegionPrice"
                                        style="margin-right:20px;display:flex;align-items:center">设置区域定价</el-checkbox>
                                    <el-select filterable placeholder="请选择" v-model="regionPriceType"
                                        placeholder="请选择调价方式" :popper-append-to-body="false"
                                        @change="selregionPriceHandle(regionPriceType)">
                                        <el-option label="百分比调整" value="1"></el-option>
                                        <el-option label="金额调整" value="2"></el-option>
                                    </el-select>
                                </div>
                                <div style="width: 510px;">
                                    <el-card class="box-card">
                                        <div class="text item">
                                            <el-table :data="plaPriceData" style="width: 100%">
                                                <el-table-column prop="deliveryPlace" label="发货地" width="180">
                                                </el-table-column>
                                                <el-table-column prop="tpl" label="调价模板" width="280">
                                                    <template slot-scope="scope">
                                                        <el-select filterable placeholder="请选择" v-model="scope.row.tpl">
                                                            <el-option v-for="elem in regionPriceList" :key="elem.id"
                                                                :label="elem.templateName" :value="elem.id">
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
            <el-card class="box-card smtModifySskuInfo-mt60">
                <div class="text item">
                    <el-row :gutter="30" class="mb20">
                        <el-col :span="2">
                            <div class="grid-content" style="height: 40px;"></div>
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
                                <el-select v-model="shippingType" placeholder="请选择定价方式" :popper-append-to-body="false">
                                    <el-option v-for="item in shippingTypeList" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button type="primary" @click="estimatedPrice">估算价格</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="mb20">
                        <el-col :span="2">
                            <div class="grid-content" style="height: 40px;"></div>
                        </el-col>
                        <el-col :span="21">
                            <el-table ref="smtModifySskuInfo_table" :data="syncSSmtSkuDtoList" border
                                style="width: 100%" :cell-class-name="highLightCurCell">
                                <template v-for="item in syncSSmtSkuDtoListCols">
                                    <!-- 零售价 -->
                                    <el-table-column :key="item.prop" v-if="item.prop=='price' && item.isShow"
                                        :prop="item.prop">
                                        <template slot="header" slot-scope="scope">
                                            <div>
                                                <font class="fRed">*</font>零售价（USD）
                                            </div>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.price" @blur="priceHandle(scope.row)"
                                                controls-position="right" :precision="2" :step="0.01" :min="0"
                                                label="价格"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <!-- 零售价 -->
                                    <el-table-column :key="item.prop" v-else-if="item.prop=='priceCny' && item.isShow"
                                        :prop="item.prop">
                                        <template slot="header" slot-scope="scope">
                                            <div>
                                                <font class="fRed">*</font>零售价（CNY）
                                            </div>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.priceCny" @blur="priceCnyHandle(scope.row)"
                                                controls-position="right" :precision="2" :step="0.01" :min="0"
                                                label="价格"></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <!-- 商家仓库存 -->
                                    <el-table-column :key="item.prop"
                                        v-else-if="item.prop=='ipmSkuStock' && item.isShow" :prop="item.prop">
                                        <template slot="header" slot-scope="scope">
                                            <div class="disFCenter">
                                                <div>
                                                    <font class="fRed">*</font>商家仓库存
                                                </div>
                                                <el-input-number v-model="allStock" @blur="allStockBlurHandle"
                                                    controls-position="right" :precision="0" :step="1" :min="0"
                                                    :label="item.label"></el-input-number>
                                            </div>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-input-number v-model="scope.row.ipmSkuStock" @change="ipmSkuStockHandle"
                                                controls-position="right" :precision="0" :step="1" :min="0"
                                                :label="item.label">
                                            </el-input-number>
                                        </template>
                                    </el-table-column>
                                    <!-- 商品编码 -->
                                    <el-table-column :key="item.prop"
                                        v-else-if="item.prop=='storeSubSku' && item.isShow" :prop="item.prop"
                                        :label="item.label">
                                        <template slot-scope="scope">
                                            <div class="disflex smtModifySskuInfo-align-center">
                                                <template v-if="scope.row.saleStatus===false">
                                                    <div class="fRed mr10">停</div>
                                                </template>
                                                <el-input v-model="scope.row.storeSubSku" @change="storeSubSkuHandle"
                                                    maxlength="50" :label="item.label" show-word-limit></el-input>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 图片 -->
                                    <el-table-column :key="item.prop" v-else-if="!!item.customizedPic && item.isShow"
                                        :prop="item.prop" :label="item.label">
                                        <template slot-scope="scope">
                                            <div v-html="tableOtherPicRow(scope.row,item.id)"
                                                class="disflex smtModifySskuInfo-align-center">
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <!-- 其它 -->
                                    <el-table-column :key="item.prop" v-else-if="item.isShow" :prop="item.prop"
                                        :label="item.label">
                                        <template slot-scope="scope"> {{tableOtherRow(scope.row, item.id,item)}}</template>
                                    </el-table-column>
                                </template>
                            </el-table>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <div class="smtModifySskuInfo-fixedBtm">
                <el-button type='primary' @click="skuInfoSubmit" size="medium">提交</el-button>
            </div>
        </div>
        <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
        <script src="${ctx}/static/vue/js/elementui@2.13.js"></script>
        <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifySskuInfo.js"></script>