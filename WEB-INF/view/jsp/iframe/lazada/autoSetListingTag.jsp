<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
    <link rel="stylesheet" href="${ctx}/static/font_iconfont/iconfont.css" media="all" />
    <title>自动标签配置</title>
    <style>
      .el-select-dropdown {
        z-index: 99999999 !important;
      }

      .cell-highLight {
        background-color: #fdf5e6;
      }

      .fieldBox_autoSetListing {
        float: left;
        width: 20%;
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    </style>
    <div class="layui-fluid" id="LAY-autoSetTag-lazadaPage">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <div class="layui-card">
            <div class="layui-card-header disFCenter">
              <div class="fRed">
                日志结果添加标签逻辑：当最新一条日志满足条件时触发，每条日志仅触发一次标签操作。
              </div>
              <div>
                <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal" @click="handleAdd">新增</a>
              </div>
            </div>
            <div class="layui-card-body disflex" id="LAY-autoSetTag-lazadaPage-card">
              <!-- 表格的数据渲染 -->
              <el-table :data="tableData" height="650" border :cell-class-name="highLightCurCell"
                @row-click="handleRowClick">
                <el-table-column label="在线listing标签" prop="listingTagId" width="150">
                  <template slot-scope="{row}">
                    <div v-if="!row.isEditRow" class="row-cell">
                      {{ renderListingTag(row.listingTagId) }}
                    </div>
                    <template v-else>
                      <el-select v-model="row.listingTagId" placeholder="请选择标签" filterable size="small">
                        <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                      </el-select>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="标签操作" prop="type" width="150">
                  <template slot-scope="{row}">
                    <div v-if="!row.isEditRow" class="row-cell">
                      {{ renderType(row.type) }}
                    </div>
                    <el-select v-else v-model="row.type" placeholder="请选择标签操作" filterable size="small">
                      <el-option v-for="item in typeList" ::key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="标签条件" prop="listingTagCondition">
                  <template slot-scope="{row}">
                    <div v-if="!row.isEditRow" class="row-cell">
                      {{ getTagConditionDesc(row) }}
                    </div>
                    <div v-else class="disflex">
                      <el-select v-model="row.triggerConditionType" placeholder="请选择" filterable size="small"
                        @change="handleChangeTriggerConditionType(row)">
                        <el-option v-for="item in triggerConditionTypeList" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select v-model="row.conditionInclude" placeholder="请选择" filterable size="small"
                        @change="handleConditionInclude(row)">
                        <el-option label="包含" :value="true"></el-option>
                        <el-option v-if="row.triggerConditionType!==1" label="不包含" :value="false"></el-option>
                      </el-select>
                      <el-select v-if="row.triggerConditionType===0" v-model="row.conditionListingFilterCodeList"
                        :multiple-limit="row.conditionInclude ? 9999 : 1" clearable multiple filterable collapse-tags
                        size="small">
                        <el-option v-for="item in prodFilterListingTypeList" :key="item.code" :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                      <el-input v-else-if="row.triggerConditionType===1" size="small" v-model="row.conditionLogText"
                        clearable />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="适用店铺" prop="storeNum" width="100">
                  <template slot-scope="{row,$index }">
                    <el-button type="text" @click="handleOpenStore(row,$index)">{{ row.storeNum || 0 }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                  <template slot-scope="{row,$index }">
                    <div class="fRed row-cell" @click="handleRemove(row,$index)">
                      移除
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script type="text/html" id="autoSetListing_matchStorePop_lazadaPage">
  <div
    class="p10"
    style="display: flex;justify-content: space-between;flex-direction: column;"
  >
    <div class="layui-tab layui-tab-card">
      <form
        class="layui-form"
        lay-filter="matchStoreForm_autoSetListing_lazadaPage"
        id="matchStoreForm_autoSetListing_lazadaPage"
      >
        <div class="layui-form-item layui-row" style="padding: 5px 0;">
          <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">全选</label>
            <div class="layui-input-block" style="line-height: 30px!important;">
              <input
                type="checkbox"
                lay-skin="primary"
                title=""
                lay-filter="matchStoreForm_autoSetListing_checkAll"
              />
            </div>
          </div>
          <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">店铺</label>
            <div class="layui-input-block">
              <input
                type="text"
                lay-skin="primary"
                title=""
                name="storeName"
                placeholder="单个模糊，多个精确逗号分隔"
                autocomplete="off"
                class="layui-input"
              />
            </div>
          </div>
          <div class="layui-col-md4 layui-col-lg4">
            <div class="layui-input-block" style="line-height: 30px!important;">
              <button
                type="button"
                class="layui-btn ml20 layui-btn-sm keyHandle"
                lay-submit
                lay-filter="matchStoreForm_autoSetListing_submit"
              >
                搜索
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="layui-tab layui-tab-card">
      <div
        class="layui-card-header"
        style="color: #468847;background-color: #dff0d8"
      >
        已选择店铺
        <button
          type="button"
          class="layui-btn ml20 layui-btn-xs"
          name=""
          id="autoSetListingCopy_lazada"
          style="margin-left:100px;"
        >
          一键复制
        </button>
        <button
          type="button"
          class="layui-btn ml20 layui-btn-xs"
          name=""
          id="autoSetListingEmpty_lazada"
          style="margin-left:100px;"
        >
          清空
        </button>
      </div>
      <div class="layui-card-body">
        <form
          class="layui-form"
          id="matchStoreForm_autoSetListing_checked_lazada"
          lay-filter="matchStoreForm_autoSetListing_checked_lazada"
        ></form>
      </div>
    </div>
  </div>
</script>
    <script type="text/javascript">
      var autoSetListingTagName_lazada;
      layui.use([
        "admin",
        "form",
        "table",
        "laydate",
        "upload",
        "element",
        "layedit",
        "formSelects",
      ],
        function () {
          var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            formSelects = layui.formSelects,
            form = layui.form;
          form.render();

          autoSetListingTagName_lazada = new Vue({
            el: "#LAY-autoSetTag-lazadaPage",
            data() {
              return {
                tableData: [],
                tagList: [], //标签枚举
                typeList: [
                  { value: 0, label: "添加标签" },
                  { value: 1, label: "移除标签" },
                ], //标签操作枚举
                prodFilterListingTypeList: [],
                prodFilterListingTypeObj: {},
                triggerConditionTypeList: [
                  { value: 0, label: "不处理类型" },
                  { value: 1, label: "日志结果" },
                ],
                platCode: "lazada",
                urlListObj: {
                  lazada: {
                    listingTagUrl: "/lms/onlineProductLazada/getListingTags", //listing标签
                    searchListUrl:
                      "/lms/lazadaAutoSetTag/getAllConfigs", // 查询
                    prodFilterListingType:
                      "/lms/lazadaAutoSetTag/getAllListingFilterCode", //不处理类型
                    //saveListUrl:
                    //                   "/lms/lazadaAutoSetTag/saveConfigs", //保存
                    //searchStoreUrl: 
                    //                   "/lms/lazadaAutoSetTag/getStoresByConfigId", // 查询店铺,
                    searchStoreNameUrl:
                      "/lms/lazadaAutoSetTag/searchStores", // 通过名称查询店铺
                    //saveStoreUrl:
                    //                   "/lms/shopee/shopeeIsEnableProduct/saveListingTagAutoSetShop?configId=", // 保存店铺
                  },
                },
                originStoreAcctIdObj: [], //保存店铺时需要获取原来的数据
              };
            },
            mounted() {
              // 获取平台  通过平台来进行url配置
              this.platCode = window.localStorage.getItem(
                "autoSetListingTagPlatCode"
              );
              //listing标签 & 不处理类型
              Promise.all([
                commonReturnPromise({
                  url: this.urlListObj[this.platCode].listingTagUrl,
                }),
                commonReturnPromise({
                  url: this.urlListObj[this.platCode].prodFilterListingType, // 获取不处理类型
                }),
              ]).then((res) => {
                this.tagList = res[0];
                this.prodFilterListingTypeObj = res[1]
                for (let key in res[1]) {
                  this.prodFilterListingTypeList.push({
                    code: key,
                    name: res[1][key]
                  })
                }
              });
              commonReturnPromise({
                url: this.urlListObj[this.platCode].searchListUrl,
              }).then((res) => {
                res.forEach(item => item.conditionListingFilterCodeList = item.conditionListingFilterCodes?.split(","))
                this.tableData = res;
              });
              // 监听页面点击事件
              window.addEventListener("click", this.handleRemoveEdit);
            },
            beforeDestroy() {
              window.removeEventListener("click", this.handleRemoveEdit);
            },
            methods: {
              // #region 鼠标点击对应表格，支持对应行修改
              handleRowClick(row, column) {
                if (!column || ["listingTagId", "type", "listingTagCondition"].includes(column.property)) {
                  this.tableData = this.tableData.map((item) => ({
                    ...item,
                    isEditRow: row.id === item.id ? true : false,
                  }));
                }
              },
              handleRemoveEdit(e) {
                if (!(e.target.closest("tbody") || ['el-input__icon el-icon-circle-close el-input__clear', 'row-cell'].includes(e.target.className))) {
                  this.tableData = this.tableData.map((item) => ({
                    ...item,
                    isEditRow: false,
                  }));
                }
              },
              // #endregion 鼠标点击对应表格，支持对应行修改
              // #region 联动
              renderListingTag(listingTagId) {
                let str = "";
                str = this.tagList.filter((item) => item.id === listingTagId)[0]?.name;
                return str;
              },
              renderType(type) {
                let str = "";
                str = this.typeList.filter((item) => item.value === type)[0]?.label;
                return str;
              },
              getTagConditionDesc(row) {
                const triggerConditionTypeStr =
                  this.triggerConditionTypeList.filter(
                    (item) => item.value === row.triggerConditionType
                  )[0]?.label || "";
                const includeStr = row.conditionInclude ? "包含" : "不包含";
                let detailStr = "";
                if (row.triggerConditionType === 0) {
                  detailStr = (row.conditionListingFilterCodeList || [])
                    .map((item) => this.prodFilterListingTypeObj[item])
                    .join();
                } else {
                  detailStr = [null, undefined].includes(row.conditionLogText)
                    ? ""
                    : row.conditionLogText;
                }
                return triggerConditionTypeStr + " " + includeStr + " " + detailStr;
              },
              // 下触发来源 选中日志结果时，当前下拉框仅显示包含选项，且仅支持选中包含
              handleChangeTriggerConditionType(row) {
                if (
                  row.triggerConditionType === 1 &&
                  row.conditionInclude === false
                ) {
                  row.conditionInclude = true;
                }
                if (row.triggerConditionType === 0) {
                  //不处理类型
                  if (row.conditionLogText) {
                    row.conditionLogText = null;
                  }
                } else {
                  if (row.conditionListingFilterCodeList) {
                    row.conditionListingFilterCodeList = null;
                  }
                }
              },
              // 触发来源选择不处理类型时，该项为下拉框，必选项，:逻辑判断为包含时支持多选，:逻辑判断为不包含时仅支持单选
              handleConditionInclude(row) {
                if (row.triggerConditionType === 0) {
                  if (
                    !row.conditionInclude &&
                    row.conditionListingFilterCodeList.length > 1
                  ) {
                    row.conditionListingFilterCodeList = [];
                  }
                }
              },
              highLightCurCell({ row, column }) {
                //   必填项 在线listing标签 标签操作 触发来源 逻辑判断 条件值
                if (!row.listingTagId && column.property == "listingTagId") {
                  return "cell-highLight";
                }
                if (
                  [null, undefined].includes(row.type) &&
                  column.property == "type"
                ) {
                  return "cell-highLight";
                }
                if (column.property == "listingTagCondition") {
                  if ([null, undefined].includes(row.triggerConditionType))
                    return "cell-highLight";
                  if (
                    row.triggerConditionType === 0 &&
                    !(
                      row.conditionListingFilterCodeList &&
                      row.conditionListingFilterCodeList.length
                    )
                  )
                    return "cell-highLight";
                  if (row.triggerConditionType === 1 && !row.conditionLogText) {
                    return "cell-highLight";
                  }
                }
              },
              // #endregion 联动

              handleAdd() {
                // 点击校验所有行必填项是否完整，否则最末行内下拉框高亮，不新增一行
                // 必填项 在线listing标签 标签操作 触发来源 逻辑判断 条件值
                if (this.tableData.length) {
                  // 校验
                  let wrongMsg = "";
                  this.tableData.forEach((item) => {
                    // 校验
                    if (!item.listingTagId) wrongMsg = "请选择listing标签";
                    if ([null, undefined].includes(item.triggerConditionType)) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                    if (
                      item.triggerConditionType === 0 &&
                      !(
                        item.conditionListingFilterCodeList &&
                        item.conditionListingFilterCodeList.length
                      )
                    ) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                    if (item.triggerConditionType === 1 && !item.conditionLogText) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                  });
                  if (wrongMsg) {
                    return layer.msg(wrongMsg, { icon: 7 });
                  }
                  // const row = this.tableData[this.tableData.length - 1];
                  // if ([null, undefined].includes(row.triggerConditionType)) {
                  //   return layer.msg("请将最后一行填写完整", { icon: 7 });
                  // }
                  // if ([null, undefined].includes(row.type)) {
                  //   return layer.msg("请将最后一行填写完整", { icon: 7 });
                  // }
                  // if (!row.listingTagId) {
                  //   return layer.msg("请将最后一行填写完整", { icon: 7 });
                  // }
                  // if (
                  //   row.triggerConditionType === 0 &&
                  //   !(
                  //     row.conditionListingFilterCodeList &&
                  //     row.conditionListingFilterCodeList.length
                  //   )
                  // ) {
                  //   return layer.msg("请将最后一行填写完整", { icon: 7 });
                  // }
                  // if (row.triggerConditionType === 1 && !row.conditionLogText) {
                  //   return layer.msg("请将最后一行填写完整", { icon: 7 });
                  // }
                }
                // 默认为添加标签
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.tableData = this.tableData
                      .map((item) => ({ ...item, isLast: false, isEditRow: false }))
                      .concat({
                        id:
                          (this.tableData[this.tableData.length - 1] || { id: 0 })
                            .id + 1,
                        listingTagId: "",
                        isEditRow: true,
                        isNewTr: true,
                        type: 0,
                        // triggerConditionType: "",
                        conditionInclude: true,
                        conditionListingFilterCodeList: [],
                        conditionLogText: "",
                        isLast: true,
                        storeNum: 0
                      });
                  });
                });
              },
              handleRemove(row, $index) {
                //有店铺数不可以删除
                if (row.storeNum) {
                  return layer.msg("存在适用店铺的规则不可删除!", { icon: 7 });
                }
                this.tableData.splice($index, 1);
                if (this.tableData.length) {
                  this.tableData[this.tableData.length - 1].isLast = true;
                }
              },
              // #region 店铺配置
              handleOpenStore(row, $index) {
                // 需校验当前行数据是否完整
                if (this.tableData.length) {
                  // 校验
                  let wrongMsg = "";
                  this.tableData.forEach((item) => {
                    // 校验
                    if (!item.listingTagId) wrongMsg = "请选择listing标签";
                    if ([null, undefined].includes(item.triggerConditionType)) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                    if (
                      item.triggerConditionType === 0 &&
                      !(
                        item.conditionListingFilterCodeList &&
                        item.conditionListingFilterCodeList.length
                      )
                    ) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                    if (item.triggerConditionType === 1 && !item.conditionLogText) {
                      wrongMsg = "请将标签条件填写完整";
                    }
                  });
                  if (wrongMsg) {
                    return layer.msg(wrongMsg, { icon: 7 });
                  }
                }
                this.originStoreAcctIdObj = {};
                let obj = {
                  id: row.id,
                  stores: row.stores
                };
                const _this = this;
                let popIndex = layer.open({
                  shadeClose: false,
                  type: 1,
                  title: "匹配店铺(停用店铺不显示)",
                  area: ["1000px", "600px"],
                  btn: ["确认", "关闭"],
                  content: $("#autoSetListing_matchStorePop_lazadaPage").html(),
                  success: function () {
                    // 初始化店铺选择
                    _this.initCheckedStore(obj);
                    _this.matchStoreSearch(obj);
                    _this.storeCheckAll();
                    _this.storeCheck();
                    // 一键复制
                    _this.copyStoreName();
                    //   清空
                    _this.emptyCheckedStore();
                  },
                  yes: function (index, layero) {
                    var selectedBox = $("#matchStoreForm_autoSetListing_checked_lazada [name=storeAcctId]:checked");
                    var newStoreAcctIdList = [];
                    selectedBox.each(function () {
                      let _param = {
                        id: $(this).data("id"),
                        storeAcct: $(this).attr("title"),
                      };
                      newStoreAcctIdList.push(_param);
                    });
                    _this.tableData[$index].storeNum = newStoreAcctIdList.length
                    _this.tableData[$index].stores = newStoreAcctIdList
                    layer.msg("操作成功", { icon: 1 })
                    layer.close(popIndex)
                  },
                });
              },
              matchStoreSearch(obj) {
                //匹配店铺的搜索
                const _this = this;
                form.on(
                  "submit(matchStoreForm_autoSetListing_submit)",
                  function (data) {
                    obj.storeName = data.field.storeName;
                    $(
                      "#matchStoreForm_autoSetListing_lazadaPage .fieldBox_autoSetListing_checkbox"
                    ).remove();
                    _this.initCheckedStore(obj, true);
                  }
                );
              },
              // 匹配店铺弹框成功渲染
              initCheckedStore(data, isstoreSerach = false) {
                let _this = this
                const params = {
                  id: data.id,
                };
                if (isstoreSerach) {
                  params.storeAcctStr = data.storeName;
                }
                const platCodeUrlObj = this.urlListObj[this.platCode];
                if (!isstoreSerach) {
                  let res = data.stores?.map((item) => ({
                    ...item,
                    storeAcctId: item.id,
                    storeName: item.storeAcct,
                    ifMatch: true,
                  })) || [];
                  let { storeBox_checked } = _this.renderStoreSelect(res)
                  $("#matchStoreForm_autoSetListing_checked_lazada").append(storeBox_checked);
                  form.render("checkbox", "matchStoreForm_autoSetListing_checked_lazada");
                } else {
                  commonReturnPromise({
                    url: platCodeUrlObj.searchStoreNameUrl,
                    type: "POST",
                    contentType: "application/json",
                    params: JSON.stringify(params)
                  }).then((res) => {
                    if (res) {
                      res = res.map((item) => ({
                        ...item,
                        ifMatch: false,
                      }));
                      let { storeBox } = _this.renderStoreSelect(res)
                      // 手动搜索，默认不显示
                      $("#matchStoreForm_autoSetListing_lazadaPage").append(storeBox);

                      $("#matchStoreForm_autoSetListing_checked_lazada")
                        .find("input[type=checkbox]")
                        .each(function () {
                          $("#matchStoreForm_autoSetListing_lazadaPage").find(`input[type=checkbox][value=${'${$(this).val()}'}]`)
                            .attr("checked", true);
                        });
                      form.render("checkbox", "matchStoreForm_autoSetListing_lazadaPage");
                    }
                  });
                }
              },
              renderStoreSelect(res) {
                var storeBox = ``,
                  storeBox_checked = ``;
                var store;
                var result = res;
                for (var i = 0; i < result.length; ++i) {
                  store = result[i];
                  store.ifMatch
                    ? (storeBox_checked +=
                      `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox"><input lay-filter="fieldBox_autoSetListing_checkbox_filter" name="storeAcctId" type="checkbox" checked ` +
                      ` title="` +
                      store.storeName +
                      `" data-id="` +
                      store.storeAcctId +
                      `" lay-skin="primary" value="` +
                      store.storeName +
                      `" ></div>`)
                    : "";
                  storeBox +=
                    `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox"><input lay-filter="fieldBox_autoSetListing_checkbox_filter" name="storeAcctId" type="checkbox" ` +
                    (store.ifMatch ? `checked` : ``) +
                    ` title="` +
                    store.storeName +
                    `" data-id="` +
                    store.storeAcctId +
                    `"  lay-skin="primary" value="` +
                    store.storeName +
                    `" ></div>`;
                }
                let obj = {
                  storeBox, storeBox_checked
                }
                return obj
              },
              // 店铺全选
              storeCheckAll() {
                // 匹配店铺弹窗的全选/全不选
                form.on(
                  "checkbox(matchStoreForm_autoSetListing_checkAll)",
                  function (data) {
                    let elemDom = data.elem,
                      elemValue = data.value,
                      elemCheck = data.elem.checked;

                    if (elemCheck) {
                      // 全选
                      $("#matchStoreForm_autoSetListing_lazadaPage")
                        .find("input[type=checkbox]")
                        .each(function (index) {
                          if ($(this).attr("checked") === "checked" || index === 0) {
                            // index === 0是全选的那个checkbox
                            // return false;
                          } else {
                            // 需要添加的checkbox
                            // 先设置dom全部选中
                            $(this).attr("checked", true);
                            $("#matchStoreForm_autoSetListing_checked_lazada").append(
                              `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox">${'${$(this)[0].outerHTML}'}</div>`
                            );
                          }
                        });
                      form.render(
                        "checkbox",
                        "matchStoreForm_autoSetListing_checked_lazada"
                      );
                    } else {
                      // 取消全选
                      // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
                      $("#matchStoreForm_autoSetListing_lazadaPage")
                        .find("input[type=checkbox]")
                        .each(function (index, item) {
                          $(this).attr("checked", false);
                          $("#matchStoreForm_autoSetListing_checked_lazada")
                            .find(`input[type=checkbox][value=${'${item.value}'}]`)
                            .parent()
                            .remove();
                        });
                      form.render(
                        "checkbox",
                        "matchStoreForm_autoSetListing_checked_lazada"
                      );
                    }
                    // 全选&反选
                    $("#matchStoreForm_autoSetListing_lazadaPage input[name=storeAcctId]").prop(
                      "checked",
                      data.elem.checked
                    );
                    form.render("checkbox", "matchStoreForm_autoSetListing_lazadaPage");
                  }
                );
              },
              storeCheck() {
                // 监听所有的checkbox
                form.on("checkbox(fieldBox_autoSetListing_checkbox_filter)", function (data) {
                  let storeBox_checked = ``;
                  let elemDom = data.elem,
                    elemValue = data.value,
                    elemCheck = data.elem.checked;

                  if (data.elem.checked) {
                    // 选中 true
                    $(data.elem).attr("checked", true); // 将原始dom设置为选中状态，并添加到已选择店铺
                    storeBox_checked += `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox">${'${elemDom.outerHTML}'}</div>`;
                    $("#matchStoreForm_autoSetListing_checked_lazada").append(
                      storeBox_checked
                    );
                    // form.render('checkbox','matchStoreForm_autoSetListing_checked_lazada')
                    // 全选
                    if (
                      $("#matchStoreForm_autoSetListing_lazadaPage").find(
                        ".layui-form-checked"
                      ).length >=
                      $("#matchStoreForm_autoSetListing_lazadaPage").find(
                        ".fieldBox_autoSetListing"
                      ).length
                    ) {
                      $("[lay-filter=matchStoreForm_autoSetListing_checkAll]").prop(
                        "checked",
                        true
                      );
                    }
                  } else {
                    // 将所有店铺中的选中状态改为false
                    $("#matchStoreForm_autoSetListing_lazadaPage")
                      .find(`input[type=checkbox][value=${'${elemValue}'}]`)
                      .attr("checked", false);
                    // form.render('checkbox','matchStoreForm_autoSetListing_lazadaPage')
                    // 删掉已选择店铺中的店铺
                    $("#matchStoreForm_autoSetListing_checked_lazada")
                      .find(`input[type=checkbox][value=${'${elemValue}'}]`)
                      .parent()
                      .remove();
                    // form.render('checkbox','matchStoreForm_autoSetListing_checked_lazada')
                    // 取消全选
                    $("[lay-filter=matchStoreForm_autoSetListing_checkAll]").prop("checked", false);
                  }
                  form.render();
                }
                );
              }, // 一键复制
              copyStoreName() {
                $("#autoSetListingCopy_lazada").click(function () {
                  let copyArr = [];
                  $.each(
                    $(
                      "#matchStoreForm_autoSetListing_checked_lazada input[name=storeAcctId]:checked"
                    ),
                    function () {
                      copyArr.push($(this).attr("title"));
                    }
                  );
                  copyTxtToClipboard(copyArr.join());
                });
              },
              //   清空
              emptyCheckedStore() {
                $("#autoSetListingEmpty_lazada").click(function () {
                  // 无权限店铺的不能清空
                  // $("#matchStoreForm_autoSetListing_checked_lazada").empty();
                  $("#matchStoreForm_autoSetListing_checked_lazada")
                    .find("div")
                    .each(function () {
                      const disabled = $(this)
                        .find("input[name=storeAcctId]")
                        .attr("disabled");
                      if (!disabled) {
                        $(this).remove();
                      }
                    });
                  // 取消全选
                  // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
                  $("#matchStoreForm_autoSetListing_lazadaPage")
                    .find("input[type=checkbox]")
                    .each(function () {
                      $(this).attr("checked", false);
                    });
                  //
                  form.render("checkbox", "matchStoreForm_autoSetListing_checked_lazada");
                  // 全选&反选
                  $("#matchStoreForm_autoSetListing_lazadaPage input[name=storeAcctId]").prop(
                    "checked",
                    false
                  );
                  form.render("checkbox", "matchStoreForm_autoSetListing_lazadaPage");
                });
              },
              // #endregion 店铺配置

              // #region 保存
              saveListingTagSetting() {
                const _tableData = JSON.parse(JSON.stringify(this.tableData));
                //
                let wrongMsg = "";
                _tableData.forEach((item) => {
                  // 校验
                  if (!item.listingTagId) wrongMsg = "请选择listing标签";
                  delete item.isEditRow;
                  delete item.isLast;
                  delete item.filterTypes;
                  // 手动新增行
                  if (item.isNewTr) {
                    delete item.id;
                  }
                  delete item.isNewTr;
                  if ([null, undefined].includes(item.triggerConditionType)) {
                    wrongMsg = "请将标签条件填写完整";
                  }
                  if (
                    item.triggerConditionType === 0 &&
                    !(
                      item.conditionListingFilterCodeList &&
                      item.conditionListingFilterCodeList.length
                    )
                  ) {
                    wrongMsg = "请将标签条件填写完整";
                  }
                  if (item.triggerConditionType === 1 && !item.conditionLogText) {
                    wrongMsg = "请将标签条件填写完整";
                  }
                  if (item.stores && item.stores.length > 0) {
                    item.storeAcctIdList = item.stores.map(item => item.id)
                  } else {
                    wrongMsg = "请选择店铺";
                  }
                });

                if (wrongMsg) {
                  return layer.msg(wrongMsg, { icon: 7 });
                }
                return _tableData;
              },
              // #endregion 保存
            },
          });
        }
      );
    </script>
    <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
    <script src="${ctx}/static/vue/js/elementui@2.13.js"></script>