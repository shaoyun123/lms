var autoSetListingTagName;
layui.use(
  [
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

    autoSetListingTagName = new Vue({
      el: "#LAY-autoSetTag-page",
      data() {
        return {
          tableData: [],
          tagList: [], //标签枚举
          typeList: [
            { value: 0, label: "添加标签" },
            { value: 1, label: "移除标签" },
          ], //标签操作枚举
          processingTypeList: [],
          prodFilterListingTypeList: {},
          prodFilterListingTypeObj: {},
          triggerConditionTypeList: [],
          autoAdjustPriceLogEnum: [], // variation自动调价失败日志枚举
          developDictList: [], // 开发通知类型
          platCode: "shopee",
          urlListObj: {
            shopee: {
              listingTagUrl: "/lms/sysdict/getShopeeListingTag", //listing标签
              listingTagAutoSetConfigEnumsUrl:
                "/lms/shopee/shopeeIsEnableProduct/listingTagAutoSetConfigEnums", // 自动标签相关类型枚举
              searchListUrl:
                "/lms/shopee/shopeeIsEnableProduct/listAllListingTagAutoSetConfig", // 查询
              prodFilterListingType:
                "/lms/shopee/shopeeIsEnableProduct/getProdFilterListingType", //不处理类型
              saveListUrl:
                "/lms/shopee/shopeeIsEnableProduct/saveListingTagAutoSetConfig", //保存
              searchStoreUrl:
                "/lms/shopee/shopeeIsEnableProduct/listListingTagAutoSetShopByConfigId", // 查询店铺,
              saveStoreUrl:
                "/lms/shopee/shopeeIsEnableProduct/saveListingTagAutoSetShop?configId=", // 保存店铺
              handlerOnlineProductsAutoSetTag:
                "/lms/shopee/shopeeIsEnableProduct/handlerOnlineProductsAutoSetTag", // 自动标签配置处理在线listing
              getDevelopDictUrl:
                "/lms/msgDevelopmentNotice/getDevelopDict.html", // 开发通知类型
            },
          },
          allChecked: false, //全选
          delRowList: [], //删除的数据，不是新增的
        };
      },
      mounted() {
        this.init();
      },
      beforeDestroy() {
        window.removeEventListener("click", this.handleRemoveEdit);
      },
      methods: {
        init() {
          // 获取平台  通过平台来进行url配置
          this.platCode = window.localStorage.getItem(
            "autoSetListingTagPlatCode"
          );
          Promise.all([
            commonReturnPromise({
              url: this.urlListObj[this.platCode].listingTagUrl,
            }),
            commonReturnPromise({
              url: this.urlListObj[this.platCode].prodFilterListingType, // 获取不处理类型
            }),
            commonReturnPromise({
              url: this.urlListObj[this.platCode]
                .listingTagAutoSetConfigEnumsUrl, // 自动标签相关类型枚举
            }),
            commonReturnPromise({
              url: this.urlListObj[this.platCode].getDevelopDictUrl,
            }),
          ]).then((res) => {
            this.tagList = res[0];
            this.prodFilterListingTypeList = res[1];
            res[1].forEach((v) => {
              this.prodFilterListingTypeObj[v.code] = v;
            });
            this.triggerConditionTypeList = res[2].TriggerConditionType.map(
              (v) => ({ ...v, show: true })
            );
            this.autoAdjustPriceLogEnum = res[2].AutoAdjustPriceLogEnum.map(
              (v) => ({ ...v, desc: `(${v.resultType})${v.resultDescription}` })
            );
            this.processingTypeList = res[2].ProcessingType;
            this.developDictList = res[3];
          });
          commonReturnPromise({
            url: this.urlListObj[this.platCode].searchListUrl,
          }).then((res) => {
            this.tableData = res.map((item) => ({ ...item, checked: false }));
          });

          // 监听页面点击事件
          window.addEventListener("click", this.handleRemoveEdit);
        },
        // #region 鼠标点击对应表格，支持对应行修改
        handleRowClick(row, column) {
          if (
            !column ||
            [
              "listingTagId",
              "processingType",
              "type",
              "listingTagCondition",
            ].includes(column.property)
          ) {
            this.tableData = this.tableData.map((item) => ({
              ...item,
              isEditRow: row.id === item.id ? true : false,
            }));
          }
        },
        handleRemoveEdit(e) {
          if (
            !(
              e.target.closest("tbody") ||
              [
                "el-input__icon el-icon-circle-close el-input__clear",
                "row-cell",
              ].includes(e.target.className)
            )
          ) {
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
          if (listingTagId) {
            str =
              this.tagList.filter((item) => item.id === listingTagId)[0]
                ?.name || "标签已删除！";
          }
          return str;
        },
        renderProcessingType(processingType) {
          let str = "";
          str = this.processingTypeList.filter(
            (item) => item.code === processingType
          )[0]?.desc;
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
              (item) => item.code === row.triggerConditionType
            )[0]?.desc || "";
          const includeStr = row.conditionInclude ? "包含" : "不包含";
          let detailStr = "";
          if (row.triggerConditionType === 0) {
            detailStr = (row.conditionListingFilterCodeList || [])
              .map((item) => this.prodFilterListingTypeObj[item]?.name)
              .join();
          } else if (row.triggerConditionType === 1) {
            detailStr = [null, undefined].includes(row.conditionLogText)
              ? ""
              : row.conditionLogText;
          } else if (row.triggerConditionType === 2) {
            detailStr = this.autoAdjustPriceLogEnum
              .filter((v) =>
                (row.autoAdjustPriceLogCodeList || []).includes(v.code)
              )
              .map((v) => v.desc)
              .join();
          } else if (row.triggerConditionType === 3) {
            detailStr = this.developDictList
              .filter((v) =>
                (row.developmentNoticeTypeList || []).includes(v.id)
              )
              .map((v) => v.name)
              .join();
          }
          return triggerConditionTypeStr + " " + includeStr + " " + detailStr;
        },
        // 当配置对象选择variation&product时，该选项仅支持选择日志结果、variation自动调价失败日志、开发通知；；
        handleChangeProcessingType(row) {
          if (row.processingType === 1 && row.triggerConditionType === 0) {
            row.triggerConditionType = null;
            row.conditionInclude = true;
            row.conditionListingFilterCodeList = null;
            row.conditionLogText = null;
            row.autoAdjustPriceLogCodeList = null;
            row.developmentNoticeTypeList = null;
            this.triggerConditionTypeList.forEach((v) => {
              if (v.code == 0) {
                v.show = false;
              }
            });
          } else {
            //product
            this.triggerConditionTypeList.forEach((v) => {
              if (v.code == 0) {
                v.show = true;
              }
            });
          }
        },
        // 开发通知仅在添加标签展示
        handleChangeType(row) {
          if (row.type === 0) {
            this.triggerConditionTypeList.forEach((v) => {
              if (v.code == 3) {
                v.show = true;
              }
            });
          } else if (row.type === 1) {
            // 移除标签
            this.triggerConditionTypeList.forEach((v) => {
              if (v.code == 3) {
                v.show = false;
              }
            });
            if (row.triggerConditionType === 3) {
              row.triggerConditionType = null;
              row.developmentNoticeTypeList = null;
            }
          }
        },
        // 下触发来源 选中日志结果、variation自动调价失败日志、开发通知时，当前下拉框仅显示包含选项，且仅支持选中包含
        handleChangeTriggerConditionType(row) {
          if (
            [1, 2, 3].includes(row.triggerConditionType) &&
            row.conditionInclude === false
          ) {
            row.conditionInclude = true;
          }

          if (row.triggerConditionType === 0) {
            //不处理类型
            if (row.conditionLogText) {
              row.conditionLogText = null;
            }
            if (row.autoAdjustPriceLogCodeList) {
              row.autoAdjustPriceLogCodeList = null;
            }
            if (row.developmentNoticeTypeList) {
              row.developmentNoticeTypeList = null;
            }
          } else if (row.triggerConditionType === 1) {
            if (row.conditionListingFilterCodeList) {
              row.conditionListingFilterCodeList = null;
            }
            if (row.autoAdjustPriceLogCodeList) {
              row.autoAdjustPriceLogCodeList = null;
            }
            if (row.developmentNoticeTypeList) {
              row.developmentNoticeTypeList = null;
            }
          } else if (row.triggerConditionType === 2) {
            if (row.conditionLogText) {
              row.conditionLogText = null;
            }
            if (row.conditionListingFilterCodeList) {
              row.conditionListingFilterCodeList = null;
            }
            if (row.developmentNoticeTypeList) {
              row.developmentNoticeTypeList = null;
            }
          } else if (row.triggerConditionType === 3) {
            if (row.conditionLogText) {
              row.conditionLogText = null;
            }
            if (row.conditionListingFilterCodeList) {
              row.conditionListingFilterCodeList = null;
            }
            if (row.autoAdjustPriceLogCodeList) {
              row.autoAdjustPriceLogCodeList = null;
            }
          }
          // 标签条件中下拉框1仅选则不处理类型时当前复选框可选中；标签条件中下拉框1为空与日志结果时复选框置灰，不可选中
          row.checked = false;
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
            if (
              row.triggerConditionType === 2 &&
              !(
                row.autoAdjustPriceLogCodeList &&
                row.autoAdjustPriceLogCodeList.length
              )
            )
              if (
                row.triggerConditionType === 3 &&
                !(
                  row.developmentNoticeTypeList &&
                  row.developmentNoticeTypeList.length
                )
              )
                return "cell-highLight";
          }
        },
        // #endregion 联动

        handleAdd() {
          // 点击校验所有行必填项是否完整，否则最末行内下拉框高亮，不新增一行
          //   必填项 在线listing标签 标签操作 触发来源 逻辑判断 条件值
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
              if (
                item.triggerConditionType === 2 &&
                !(
                  item.autoAdjustPriceLogCodeList &&
                  item.autoAdjustPriceLogCodeList.length
                )
              ) {
                wrongMsg = "请将标签条件填写完整";
              }
              if (
                item.triggerConditionType === 3 &&
                !(
                  item.developmentNoticeTypeList &&
                  item.developmentNoticeTypeList.length
                )
              ) {
                wrongMsg = "请将标签条件填写完整";
              }
            });
            if (wrongMsg) {
              return layer.msg(wrongMsg, { icon: 7 });
            }
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
                  processingType: 0,
                  // triggerConditionType: "",
                  conditionInclude: true,
                  conditionListingFilterCodeList: [],
                  conditionLogText: "",
                  autoAdjustPriceLogCodeList: [],
                  developmentNoticeTypeList: [],
                  isLast: true,
                  shopCount: 0,
                  shopChanged: false,
                  configShopList: [],
                });
            });
          });
        },
        handleRemove(row, $index) {
          //有店铺数不可以删除
          if (row.shopCount) {
            return layer.msg("存在适用店铺的规则不可删除!", { icon: 7 });
          }
          this.tableData.splice($index, 1);
          this.delRowList.push({ id: row.id, needDelete: true });
          if (this.tableData.length) {
            this.tableData[this.tableData.length - 1].isLast = true;
          }
        },
        // #region checkbox 只能选不处理的类型 处理在线listing
        handleAllChecked(newVal) {
          this.tableData.forEach((item) => {
            if (item.triggerConditionType === 0 && !item.isNewTr) {
              item.checked = newVal;
            }
          });
        },
        handleOneChecked(newVal) {
          // 全选，全不选
          const allLength = this.tableData.filter(
            (item) => item.triggerConditionType === 0 && !item.isNewTr
          ).length;
          const curStatusLength = this.tableData.filter(
            (item) =>
              item.triggerConditionType === 0 &&
              !item.isNewTr &&
              item.checked === newVal
          ).length;
          if (allLength === curStatusLength) {
            this.allChecked = newVal;
          } else {
            this.allChecked = false;
          }
        },
        // 处理在线listing
        handleDealListing() {
          // 获取选中数据
          const checkedList = JSON.parse(JSON.stringify(this.tableData)).filter(
            (item) => item.checked
          );
          if (!checkedList.length) {
            return layer.msg("请选择标签配置项处理在线listing", { icon: 7 });
          }
          // 校验完整性
          let wrongMsg = "";
          checkedList.forEach((item) => {
            // 校验
            if (!item.listingTagId) wrongMsg = "请选择listing标签";
            delete item.checked;
            delete item.isEditRow;
            delete item.isLast;
            delete item.filterTypes;
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
          });
          if (wrongMsg) {
            return layer.msg(wrongMsg, { icon: 7 });
          }
          // 掉接口
          const idList = checkedList.map((v) => v.id);
          const platCodeUrlObj = this.urlListObj[this.platCode];
          commonReturnPromiseRes({
            url: platCodeUrlObj.handlerOnlineProductsAutoSetTag,
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(idList),
          }).then((res) => {
            if (res.code === "0000") {
              layer.alert(
                `<div  class="ztt-a" onclick="commonJumpToTaskcenter()">${res.msg}</div>`,
                { icon: 1, title: "操作结果" }
              );
              window.parent.postMessage(
                { name: "shopeeoperatetaskcenter", res: "" },
                "*"
              );
            } else {
              layer.msg(res.msg, { icon: 2 });
            }
          });
        },
        // #endregion 处理在线listing
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
              if (
                item.triggerConditionType === 2 &&
                !(
                  item.autoAdjustPriceLogCodeList &&
                  item.autoAdjustPriceLogCodeList.length
                )
              ) {
                wrongMsg = "请将标签条件填写完整";
              }
              if (
                item.triggerConditionType === 3 &&
                !(
                  item.developmentNoticeTypeList &&
                  item.developmentNoticeTypeList.length
                )
              ) {
                wrongMsg = "请将标签条件填写完整";
              }
            });
            if (wrongMsg) {
              return layer.msg(wrongMsg, { icon: 7 });
            }
          }
          let obj = {
            id: row.id,
            storeAcctList: (
              row.configShopList.map((v) => v.storeAcct) || []
            ).join(),
          };
          const _this = this;
          let popIndex = layer.open({
            shadeClose: false,
            type: 1,
            title: "匹配店铺(停用店铺不显示)",
            area: ["1000px", "600px"],
            btn: ["确认", "关闭"],
            content: $("#autoSetListing_matchStorePop").html(),
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
              var selectedBox = $(
                "#matchStoreForm_autoSetListing_checked [name=storeAcctId]:checked"
              );
              var newStoreList = [];
              selectedBox.each(function () {
                let _param = {
                  storeAcct: $(this).attr("title"),
                  storeAcctId: $(this).data("id"),
                };
                newStoreList.push(_param);
              });
              _this.tableData[$index].configShopList = newStoreList;
              _this.tableData[$index].shopCount = newStoreList.length;
              // 店铺是否有修改, 店铺配置页面点保存即视为有修改, 仅为true时处理店铺变化
              _this.tableData[$index].shopChanged = true;
              layer.close(index);
            },
          });
        },
        matchStoreSearch(obj) {
          //匹配店铺的搜索
          const _this = this;
          form.on(
            "submit(matchStoreForm_autoSetListing_submit)",
            function (data) {
              obj.storeAcctList = data.field.storeAcct;
              $(
                "#matchStoreForm_autoSetListing .fieldBox_autoSetListing_checkbox"
              ).remove();
              _this.initCheckedStore(obj, true);
            }
          );
        },
        // 匹配店铺弹框成功渲染
        initCheckedStore(data, isstoreSerach = false) {
          const params = {
            configId: data.id,
            storeAcctList: data.storeAcctList,
          };
          const platCodeUrlObj = this.urlListObj[this.platCode];
          commonReturnPromise({
            url: platCodeUrlObj.searchStoreUrl,
            type: "post",
            params,
            // contentType: "application/json",
            // params: JSON.stringify(params),
          }).then((res) => {
            if (res) {
              if (!isstoreSerach) {
                if (!params.storeAcctList) {
                  res = [];
                }
                res = res.map((item) => ({
                  ...item,
                  ifMatch: true,
                }));
              } else {
                res = res
                  .filter((item) => item.hasAuthority)
                  .map((item) => ({
                    ...item,
                    ifMatch: false,
                  }));
              }
              var storeBox = ``,
                storeBox_checked = ``;
              var store;
              var result = res;
              for (var i = 0; i < result.length; ++i) {
                store = result[i];
                store.ifMatch
                  ? (storeBox_checked +=
                      `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox"><input lay-filter="fieldBox_autoSetListing_checkbox_filter" name="storeAcctId" type="checkbox" checked ` +
                      (store.hasAuthority ? `` : `disabled`) +
                      ` title="` +
                      store.storeAcct +
                      `" data-id="` +
                      store.storeAcctId +
                      `" lay-skin="primary" value="` +
                      store.storeAcct +
                      `" ></div>`)
                  : "";
                storeBox +=
                  `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox"><input lay-filter="fieldBox_autoSetListing_checkbox_filter" name="storeAcctId" type="checkbox" ` +
                  (store.ifMatch ? `checked` : ``) +
                  (store.hasAuthority ? `` : `disabled`) +
                  ` title="` +
                  store.storeAcct +
                  `" data-id="` +
                  store.storeAcctId +
                  `"  lay-skin="primary" value="` +
                  store.storeAcct +
                  `" ></div>`;
              }
              if (isstoreSerach) {
                // 手动搜索，默认不显示
                $("#matchStoreForm_autoSetListing").append(storeBox);

                $("#matchStoreForm_autoSetListing_checked")
                  .find("input[type=checkbox]")
                  .each(function () {
                    $("#matchStoreForm_autoSetListing")
                      .find(`input[type=checkbox][value='${$(this).val()}']`)
                      .attr("checked", true);
                  });
                form.render("checkbox", "matchStoreForm_autoSetListing");
              } else {
                $("#matchStoreForm_autoSetListing_checked").append(
                  storeBox_checked
                );
                form.render(
                  "checkbox",
                  "matchStoreForm_autoSetListing_checked"
                );
              }
            }
          });
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
                $("#matchStoreForm_autoSetListing")
                  .find("input[type=checkbox]")
                  .each(function (index) {
                    if ($(this).attr("checked") === "checked" || index === 0) {
                      // index === 0是全选的那个checkbox
                      // return false;
                    } else {
                      // 需要添加的checkbox
                      // 先设置dom全部选中
                      $(this).attr("checked", true);
                      $("#matchStoreForm_autoSetListing_checked").append(
                        `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox">${
                          $(this)[0].outerHTML
                        }</div>`
                      );
                    }
                  });
                form.render(
                  "checkbox",
                  "matchStoreForm_autoSetListing_checked"
                );
              } else {
                // 取消全选
                // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
                $("#matchStoreForm_autoSetListing")
                  .find("input[type=checkbox]")
                  .each(function (index, item) {
                    $(this).attr("checked", false);
                    $("#matchStoreForm_autoSetListing_checked")
                      .find(`input[type=checkbox][value='${item.value}']`)
                      .parent()
                      .remove();
                  });
                form.render(
                  "checkbox",
                  "matchStoreForm_autoSetListing_checked"
                );
              }
              // 全选&反选
              $("#matchStoreForm_autoSetListing input[name=storeAcctId]").prop(
                "checked",
                data.elem.checked
              );
              form.render("checkbox", "matchStoreForm_autoSetListing");
            }
          );
        },
        storeCheck() {
          // 监听所有的checkbox
          form.on(
            "checkbox(fieldBox_autoSetListing_checkbox_filter)",
            function (data) {
              let storeBox_checked = ``;
              let elemDom = data.elem,
                elemValue = data.value,
                elemCheck = data.elem.checked;

              if (data.elem.checked) {
                // 选中 true
                $(data.elem).attr("checked", true); // 将原始dom设置为选中状态，并添加到已选择店铺
                storeBox_checked += `<div class="fieldBox_autoSetListing fieldBox_autoSetListing_checkbox">${elemDom.outerHTML}</div>`;
                $("#matchStoreForm_autoSetListing_checked").append(
                  storeBox_checked
                );
                // form.render('checkbox','matchStoreForm_autoSetListing_checked')
                // 全选
                if (
                  $("#matchStoreForm_autoSetListing").find(
                    ".layui-form-checked"
                  ).length >=
                  $("#matchStoreForm_autoSetListing").find(
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
                $("#matchStoreForm_autoSetListing")
                  .find(`input[type=checkbox][value='${elemValue}']`)
                  .attr("checked", false);
                // form.render('checkbox','matchStoreForm_autoSetListing')
                // 删掉已选择店铺中的店铺
                $("#matchStoreForm_autoSetListing_checked")
                  .find(`input[type=checkbox][value='${elemValue}']`)
                  .parent()
                  .remove();
                // form.render('checkbox','matchStoreForm_autoSetListing_checked')
                // 取消全选
                $("[lay-filter=matchStoreForm_autoSetListing_checkAll]").prop(
                  "checked",
                  false
                );
              }
              form.render();
            }
          );
        }, // 一键复制
        copyStoreName() {
          $("#autoSetListingCopy").click(function () {
            let copyArr = [];
            $.each(
              $(
                "#matchStoreForm_autoSetListing_checked input[name=storeAcctId]:checked"
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
          $("#autoSetListingEmpty").click(function () {
            // 无权限店铺的不能清空
            // $("#matchStoreForm_autoSetListing_checked").empty();
            $("#matchStoreForm_autoSetListing_checked")
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
            $("#matchStoreForm_autoSetListing")
              .find("input[type=checkbox]")
              .each(function () {
                $(this).attr("checked", false);
              });
            //
            form.render("checkbox", "matchStoreForm_autoSetListing_checked");
            // 全选&反选
            $("#matchStoreForm_autoSetListing input[name=storeAcctId]").prop(
              "checked",
              false
            );
            form.render("checkbox", "matchStoreForm_autoSetListing");
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
            delete item.checked;
            delete item.isEditRow;
            delete item.isLast;
            delete item.filterTypes;
            delete item.autoAdjustPriceLogEnumList;
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
            if (
              item.triggerConditionType === 2 &&
              !(
                item.autoAdjustPriceLogCodeList &&
                item.autoAdjustPriceLogCodeList.length
              )
            ) {
              wrongMsg = "请将标签条件填写完整";
            }
            if (
              item.triggerConditionType === 3 &&
              !(
                item.developmentNoticeTypeList &&
                item.developmentNoticeTypeList.length
              )
            ) {
              wrongMsg = "请将标签条件填写完整";
            }
          });
          if (wrongMsg) {
            return layer.msg(wrongMsg, { icon: 7 });
          }

          return _tableData.concat(this.delRowList);
        },
        // #endregion 保存
      },
    });
  }
);
