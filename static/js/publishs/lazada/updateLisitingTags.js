var lazadaUpdateListingTagsName;

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
    lazadaUpdateListingTagsName = new Vue({
      el: "#LAY-lazadaUpdateListingTags",
      data() {
        return {
          tableData: [],
          allCheckedProduct: true,
          listingTagInfoList: [], // 标签枚举
          storeFilterList: [],
          itemIdFilterList: [],
          afterFilterDataLength: 0,
          spanArr: []
        };
      },
      mounted() {
        this.init();
      },
      methods: {
        init() {
          const tableData = [];
          // 全部item_id列默认选中&全部vari_id列默认不选中
          lazada_checkStatus.forEach((v) => {
            v.sub = v.sub || [];
            v.sub.forEach((item, index) => {
              tableData.push({
                id: v.id,
                variId: item.variId || "",
                itemId: v.itemId,
                productListingTagInfoList: v.listingTags?.split(",") || [],
                storeAcct: v.storeAcctName,
                storeAcctId: v.storeAcctId,
                checkedProduct: true,
                subLength:
                    index === 0 ? v.sub.length : 0,
              });
            });
          });
          this.tableData = tableData;
          this.$nextTick(() => {
            commonReturnPromise({
              url: "/lms/onlineProductLazada/getListingTags",
            }).then((res) => {
              this.listingTagInfoList = res.map((v) => ({
                ...v,
                value: v.name,
              }));
              formSelects.data("lazadaUpdateListingTags_tags", "local", {
                arr: this.listingTagInfoList,
              });
            });
          });
        },
        // #region checkbox联动
        // 全选/全不选 Product; （取消）选中product，默认（取消）选中全部variation
        handleCheckedProduct(row) {
          this.updateAllCheckbox();
        },
        handleAllCheckedProduct(value) {
          this.allCheckedVariation = value;
          this.tableData.forEach((v) => {
            v.checkedProduct = value;
          });
        },
        updateAllCheckbox() {
          //   item_id 表头checkbox
          const isCheckAllProdcut = this.tableData.every(
            (v) => v.checkedProduct
          );
          this.allCheckedProduct = isCheckAllProdcut;
        },

        //  #region 标签的移除添加
        handleRemoveProductTag(row, tag) {
          // 移除product标签，variation对应的标签也需要移除
          // row.productListingTagInfoList = row.productListingTagInfoList.filter(
          //   (v) => v !== tag
          // );
          this.tableData.forEach((v) => {
            if (row.itemId === v.itemId) {
              v.productListingTagInfoList = v.productListingTagInfoList.filter(
                  (v) => v !== tag
              );
            }
          });
        },
        // 批量添加
        handleBatchAdd() {
          // 获取选中的标签
          const tagList = formSelects.value(
            "lazadaUpdateListingTags_tags",
            "all"
          ).map((v) => v.name);
          const tips = this.validateData(tagList);
          if (tips) return layer.msg(tips);
          //   添加进去再去重
          this.tableData.forEach((v) => {
            if (v.checkedProduct) {
              const _productListingTagInfoList =
                v.productListingTagInfoList.concat(tagList);
              v.productListingTagInfoList = _.uniqBy(
                _productListingTagInfoList
              );
            }
          });
        },

        handleBatchRemove() {
          // 获取选中的标签
          const tagList = formSelects
            .value("lazadaUpdateListingTags_tags", "all")
            .map((v) => v.name);
          const tips = this.validateData(tagList);
          if (tips) return layer.msg(tips);
          // 若选中了variation，就不对product进行操作；对prodcut操作，只针对没有选中variation
          this.tableData.forEach((v) => {
            if (v.checkedProduct) {
              const onlyCheckedProduct = this.tableData
                .filter((item) => item.itemId == v.itemId);
              if (onlyCheckedProduct) {
                v.productListingTagInfoList =
                  v.productListingTagInfoList.filter(
                    (item) => !tagList.includes(item)
                  );
              }
            }
          });
        },
        handleRemoveAll() {
          this.tableData.forEach((v) => {
            if (v.checkedProduct) {
              const onlyCheckedProduct = this.tableData
                .filter((item) => item.itemId == v.itemId)
              if (onlyCheckedProduct) {
                v.productListingTagInfoList = [];
              }
            }
          });
        },
        handleAddTag(type, row) {
          const _this = this;
          let popIndex = layer.open({
            type: 1,
            title: "添加在线listing标签",
            area: ["400px", "400px"],
            content: $("#lazadaUpdateListingTags_add_tpl").html(),
            id: 'lazadaUpdateListingTags_add_tplId',
            btn: ["保存", "关闭"],
            success: function (layero, index) {
              formSelects.data("lazadaUpdateListingTagsaddTag", "local", {
                arr: _this.listingTagInfoList,
              });
            },
            yes: function (index, layero) {
              const addListingTagIdList =
                formSelects.value("lazadaUpdateListingTagsaddTag", "all") || [];
              // row[type] = _.uniqBy(row[type].concat(addListingTagIdList.map(item => item.name)));
              _this.tableData.forEach((v) => {
                if (v.itemId === row.itemId) {
                  v.productListingTagInfoList = _.uniqBy(
                      v.productListingTagInfoList.concat(addListingTagIdList.map(item => item.name)),
                  );
                }
              });
              layer.close(popIndex);
            },
          });
        },

        validateData(tagList) {
          let tips = "";
          if (!tagList.length) tips = "请选择标签";
          //   获取选中数据
          //   item_id 表头checkbox
          const hasCheckedProdcut = this.tableData.some(
            (v) => v.checkedProduct
          );
          if (!hasCheckedProdcut) {
            tips = "请选择数据";
          }
          return tips;
        },
        //  #endregion 标签的移除添加

        // 保存
        handleSave() {
          // 整合数据
          const itemIdObj = {};
          this.tableData.forEach((v) => {
              itemIdObj[v.itemId] = {
                itemId: v.itemId,
                id: v.id,
                storeAcctId: v.storeAcctId,
                tagList: v.productListingTagInfoList
              }
          });
          const params = [];
          _.forEach(itemIdObj, function (v) {
            params.push(v);
          });
          commonReturnPromise({
            url: "/lms/onlineProductLazada/batchModifyListingTag",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(params),
          }).then((res) => {
            layer.closeAll();
            layer.msg(res, { icon: 1 });
            $("#lazada_online_search_submit").click();
          });
        },
        handleClose() {
          layer.closeAll();
        },
        // 判断当前行是否满足
        judgeShowRow(row, filterConditionObj) {
          const isShow = _.every(filterConditionObj, (v, k) => {
            if (["storeAcct", "itemId", "variId"].includes(k)) {
              return row[k] && v.includes(row[k]);
            } else {
              const nameArr = (row[k] || []).map((item) => item.name);
              return nameArr.some((item) => v.includes(item));
            }
          });
          return isShow;
        },
        // 跨行
        objectSpanMethod({ columnIndex, row, column, rowIndex }) {
          if ([0, 1, 2].includes(columnIndex)) {
            return {
              // [0,0] 表示这一行不显示， [2,1]表示行的合并数
              rowspan: row.subLength,
              colspan: 1,
            };
          }
        }
      },
    });
  }
);
