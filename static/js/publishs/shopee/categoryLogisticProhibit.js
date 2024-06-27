layui.use(
  [
    "admin",
    "form",
    "layer",
    "formSelects",
    "table",
    "element",
    "laydate",
    "laypage",
    "table",
    "laytpl",
    "layCascader",
    "upload",
  ],
  function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      formSelects = layui.formSelects,
      element = layui.element,
      laydate = layui.laydate,
      laypage = layui.laypage,
      $ = layui.$,
      laytpl = layui.laytpl,
      table = layui.table,
      layCascader = layui.layCascader,
      upload = layui.upload;

    shopCategoryLogisticProhibitName = {
      init: function () {
        this.initSite();
        this.initCreator();
        this.initModifier();
        this.handlebeforeImport();
        this.search();
        this.reset();
        this.handleTab();
        this.tableToor();
        this.exportResultInfo();
        this.add();
      },
      UnitObj: {
        '任意一边长': 'cm',
        '次长边长': 'cm',
        '最短边长': 'cm',
        '长+宽+高': 'cm',
        '重量': 'KG',
        '液体量': 'ml',
      },
      initSite: function () {
        this.siteAjax()
          .then(({ siteList }) => {
            this.SiteList = siteList;
            formSelects.data("shop_categoryLogisticProhibit_site", "local", {
              arr: siteList.map((item) => ({ ...item, value: item.code })),
            });
          })
          .then(() => form.render());
      },
      initCreator: function () {
        const creator = $("#shop_categoryLogisticProhibit_creator").val();
        this.creatorAjax()
          .then((res) => {
            commonRenderSelect("shop_categoryLogisticProhibit_creator", res, {
              selected: creator,
            });
          })
          .then(() => form.render());
      },
      initModifier: function () {
        const modifer = $("#shop_categoryLogisticProhibit_modifier").val();
        this.modifersAjax()
          .then((res) => {
            commonRenderSelect("shop_categoryLogisticProhibit_modifier", res, {
              selected: modifer,
            });
          })
          .then(() => form.render());
      },
      add: function () {
        const _this = this;
        $("#shop_categoryLogisticProhibit_add").click(function () {
          _this.detailLayer({});
        });
      },
      SiteList: [],
      // 查询
      search: function () {
        let _this = this;
        $("#shop_categoryLogisticProhibit_search").click(function () {
          const formData = _this.getSearchData();
          _this.tableRender(formData);
        });
      },
      getSearchData: function () {
        const formData = serializeObject(
          $("#shop_categoryLogisticProhibit_form")
        );
        formData.siteList = formData.siteList
          .split(",")
          .filter((item) => item !== "");
        formData.logisticIdList = formData.logisticIdList
          .replaceAll("，", ",")
          .split(",")
          .filter((item) => item !== "" && Number(item))
          .map((item) => Number(item));
        formData.categoryIdList = formData.categoryIdList
          .replaceAll("，", ",")
          .split(",")
          .filter((item) => item !== "" && Number(item))
          .map((item) => Number(item));
        formData.status =
          formData.status === "" ? formData.status : Number(formData.status);
        return formData;
      },
      // 重置
      reset: function () {
        $("#shop_categoryLogisticProhibit_reset").click(function () {
          $("#shop_categoryLogisticProhibit_form")[0].reset();
        });
      },
      tableRender: function (formData) {
        const _this = this;
        table.render({
          elem: "#shop_categoryLogisticProhibit_table",
          id: "shop_categoryLogisticProhibit_tableId",
          url: ctx + "/shopee/logistic/listCategoryLogisticProhibitInfos",
          where: formData,
          method: "post",
          contentType: "application/json",
          cols: [
            [
              {
                field: "salesSite",
                title: "站点",
                templet: function (d) {
                  let salesSiteStr = "";
                  const curSalesSite = _this.SiteList.filter(
                    (item) => item.code === d.salesSite
                  );
                  if (curSalesSite.length) {
                    salesSiteStr = `${curSalesSite[0].name}(${curSalesSite[0].code})`;
                  }
                  return salesSiteStr;
                },
              },
              {
                field: "prohibitType",
                title: "校验值",
              },
              {
                field: "",
                title: "过滤值",
                templet: (d) => {
                  if (d.prohibitType == "CNSC类目") {
                    return `${d.categoryName}(${d.categoryId})`;
                  } else if (d.prohibitType == "外箱包装") {
                    const arr = (d.outerBoxPackingConditionList || []).map(
                      (item) => {
                        const unit = _this.UnitObj[item.target] || ''
                        const operator =
                          item.operator === "==" ? "=" : item.operator;
                        return item.target + operator + item.value + unit;
                      }
                    );
                    const str = arr.join("</br>or ");
                    return str;
                  }else if(d.prohibitType == '物流属性'){
                    return d.logisAttrList || ''
                  }
                  return "";
                },
              },
              {
                field: "logisticsChannelId",
                title: "物流名称",
                templet: function (d) {
                  return `${d.logisticsChannelName}(${d.logisticsChannelId})`;
                },
              },
              {
                field: "prohibitWordEn",
                title: "操作人",
                templet: function (d) {
                  let creatorStr = "";
                  let modifierStr = "";
                  if (d.creator) {
                    creatorStr = `创建：${d.creator}<br>`;
                  }
                  if (d.modifier) {
                    modifierStr = `修改：${d.modifier}`;
                  }
                  return creatorStr + modifierStr;
                },
              },
              {
                field: "prohibitWordEn",
                title: "时间",
                templet: function (d) {
                  let createTimeStr = "";
                  let modifyTimeStr = "";
                  if (d.createTime) {
                    createTimeStr = `创建：${Format(
                      d.createTime,
                      "yyyy-MM-dd hh:mm:ss"
                    )}<br>`;
                  }
                  if (d.modifyTime) {
                    modifyTimeStr = `修改：${Format(
                      d.modifyTime,
                      "yyyy-MM-dd hh:mm:ss"
                    )}`;
                  }
                  return createTimeStr + modifyTimeStr;
                },
              },
              {
                title: "状态",
                toolbar: "#shop_categoryLogisticProhibit_status",
              },
              {
                title: "操作",
                toolbar: "#shop_categoryLogisticProhibit_toolbar",
              },
            ],
          ],
          limits: [100, 200, 500],
          limit: 100,
          page: true,
          done: function (_, _, count) {
            // table总数量
            $("#shop_categoryLogisticProhibit_total").text(count);
            //工具条的监听事件,table.on(tool(表格的lay-filter的值))
            table.on(
              "tool(shop_categoryLogisticProhibit_table)",
              function (obj) {
                if (obj.event === "edit") {
                  _this.detailLayer(obj.data);
                }
              }
            );
          },
        });
      },
      // table 工具栏
      tableToor: function () {
        const _this = this;
        form.on(
          "switch(shop_categoryLogisticProhibit_status)",
          function (data) {
            const confirmCloseStr =
              "规则关闭后，物流在该站点该CNSC类目下将重新启用，已刊登商品和未刊登商品将同步获取该物流渠道。";
            const confirmOpenStr =
              "规则重启后，物流在该站点该CNSC类目下将禁用，已刊登商品和未刊登商品将同步禁用该物流渠道。";
            const status = !!data.elem.checked ? true : false;
            // 获取当前行的id
            const id = $(data.elem).data("id");
            layer.open({
              title: "提示",
              icon: 7,
              btn: data.elem.checked ? ["确认开启"] : ["确认关闭"],
              content: data.elem.checked ? confirmOpenStr : confirmCloseStr,
              yes: function () {
                // 调接口,成功后修改table.cache里的缓存
                _this.changeStatusAjax({ id, status }).then((res) => {
                  layer.msg(res, { icon: 1 });
                  table.cache.shop_categoryLogisticProhibit_tableId.some(
                    (elem, index) => {
                      elem.id == id &&
                        (table.cache.shop_categoryLogisticProhibit_tableId[
                          index
                        ].status = status);
                      return elem.id == id;
                    }
                  );
                  // 创建人
                  _this.initModifier();
                });
              },
              cancel: function () {
                $(data.elem).prop("checked", !data.elem.checked);
                form.render();
              },
            });
          }
        );
      },
      // 监听tab
      handleTab: function () {
        element.on("tab(shop_categoryLogisticProhibit_tab)", function (data) {
          $("#shop_categoryLogisticProhibit_search").click();
        });
      },
      handlebeforeImport: function () {
        $("#shop_categoryLogisticProhibit_importInputBtn").click(function (e) {
          const importType = $(
            "#shop_categoryLogisticProhibit_importType"
          ).val();

          if (importType == "") {
            layer.msg("请选择执行操作类型", { icon: 7 });
            e.preventDefault();
            e.stopPropagation();
          }
        });
      },

      exportResultInfo: function () {
        $("#shop_categoryLogisticProhibit_import_resultInfo").click(
          function () {
            const uuId = $(
              "#shop_categoryLogisticProhibit_import_resultInfo"
            ).data("id");
            submitForm(
              { uuId },
              ctx + "/shopee/logistic/downloadImportOperateFailedLog"
            );
          }
        );
      },

      detailLayer: function (detail) {
        const _this = this;
        let isAdd = JSON.stringify(detail) === "{}" ? true : false;
        const titlePrefix = isAdd ? "新增" : "修改";
        let cnscCateCascader = null;
        layer.open({
          title: `${titlePrefix}物流禁用规则<span class="shop_categoryLogisticProhibit_smallTitle">禁用规则即“黑名单”功能，满足条件时对应物流将禁用</span>`,
          type: 1,
          area: ["800px", "580px"],
          btn: ["保存", "取消"],
          id: "shop_categoryLogisticProhibit_layer",
          content: $("#shop_categoryLogisticProhibit_detail").html(),
          success: function (layero) {
            // 	编辑弹窗内仅类目/外箱包装支持修改；其余字段不支持修改
            if(!isAdd){ 
              // 赋值单位
              (detail.outerBoxPackingConditionList || []).forEach(item=>{
                item.unit = _this.UnitObj[item.target] || ''
              })
            }
            laytpl($("#shop_categoryLogisticProhibit_detail").html()).render(
              {
                outerBoxPackingConditionList: isAdd
                  ? [{ value: "" }]
                  : detail.outerBoxPackingConditionList,
                ...detail,
                SiteList: _this.SiteList,
                isAdd,
              },
              function (html) {
                $(layero).find(".layui-layer-content").html(html);
              }
            );
            const formDom = $("#shop_categoryLogisticProhibit_detail_form");
            // 站点与物流名称的联动
            _this.siteFilter();
            // 联动
            _this.hideFormItem(detail.prohibitType || "CNSC类目");
            _this.verifyLinkage();
            // cnsc类目
            _this.getCnscCateTreeAjax().then((data) => {
              cnscCateCascader = layCascader({
                elem: "#shop_categoryLogisticProhibit_detail_cnsc",
                clearable: true,
                filterable: true,
                filterMethod: _this.filterCascader,
                collapseTags: true,
                options: data,
                props: {
                  //	编辑弹窗类目修改仅支持单选
                  multiple: isAdd ? true : false,
                  label: "tag",
                  value: "value",
                  children: "children",
                  emitPath: false,
                },
              });
              if (!isAdd && detail.prohibitType === "CNSC类目") {
                cnscCateCascader.setValue(detail.categoryId);
              }
            });
            // 外箱包装的单位
            _this.outerBoxUnit();
            _this.outerBoxOperator();
            // 物流属性
            _this.getLogisAttrEnumsAjax().then(data=>{
              let _logisAttrList = []
              if(detail.logisAttrList){
                _logisAttrList = detail.logisAttrList.split(',')
              }
              const arr = (data.logisAttrEnums || []).map(v=>({
                name: v,
                value: v,
                selected: _logisAttrList.includes(v)
              }))
              formSelects.data('shop_categoryLogisticProhibit_detail_logisAttrList','local',{arr})
            })
            form.render();
            if (!isAdd) {
              formDom
                .find("select[name=salesSite]")
                .next()
                .find("input")
                .attr("readonly", "readonly");
              // 物流名称
              _this.getLogisticChanel(
                detail.salesSite,
                detail.logisticsChannelId
              );
            }
          },
          yes: function (index, layero) {
            const formDOm = $("#shop_categoryLogisticProhibit_detail_form");
            detail.salesSite = formDOm.find("select[name=salesSite]").val(); // 站点
            detail.logisticsChannelId = formDOm
              .find("select[name=logisticsChannelId]")
              .val();
            detail.prohibitType = formDOm
              .find("select[name=prohibitType]")
              .val();
            if (!detail.salesSite) return layer.msg("请选择站点", { icon: 7 });
            if (!detail.logisticsChannelId)
              return layer.msg("请选择物流名称（ID）", { icon: 7 });
            if (!detail.prohibitType)
              return layer.msg("请选择校验值", { icon: 7 });
            if (detail.prohibitType === "CNSC类目") {
              if (isAdd) {
                const cateIdList = JSON.parse(
                  $("#shop_categoryLogisticProhibit_detail_cnsc").val() || "[]"
                );
                if (!cateIdList.length)
                  return layer.msg("请选择CNSC类目（ID）", { icon: 7 });
                detail.categoryIdList = cateIdList;
              } else {
                const cateId = $(
                  "#shop_categoryLogisticProhibit_detail_cnsc"
                ).val();

                if (!cateId)
                  return layer.msg("请选择CNSC类目（ID）", { icon: 7 });
                detail.categoryId = cateId;
              }
            } else if (detail.prohibitType === "外箱包装") {
              const outerBoxPackingConditionList = [];
              let isUnComplete = false;
              formDOm.find(".box-row").each(function () {
                const rowObj = {};
                rowObj.target = $(this).find("select[name=target]").val();
                rowObj.operator = $(this).find("select[name=operator]").val();
                rowObj.value = $(this).find("input[name=value]").val();
                outerBoxPackingConditionList.push(rowObj);
                if (!rowObj.target || !rowObj.operator || !rowObj.value) {
                  isUnComplete = true;
                  $(this).css("border", "1px solid red");
                } else {
                  $(this).css("border", "none");
                }
              });

              if (isUnComplete) {
                return layer.msg("请将外箱包装数据填写完整", { icon: 7 });
              }
              // 检验重复
              const arrStrList = outerBoxPackingConditionList.map(
                (item) => item.target + item.operator + item.value
              );
              if (
                [...new Set(arrStrList)].length !==
                outerBoxPackingConditionList.length
              ) {
                return layer.msg("外箱包装数据存在重复", { icon: 7 });
              }
              detail.outerBoxPackingConditionList =
                outerBoxPackingConditionList;
            }else if(detail.prohibitType === "物流属性"){
              detail.logisAttrList = formSelects.value('shop_categoryLogisticProhibit_detail_logisAttrList', 'valStr'); 
              if(!detail.logisAttrList){
                return layer.msg("请选择物流属性", { icon: 7 });
              }
            }
            commonReturnPromise({
              url: isAdd
                ? "/lms/shopee/logistic/newLogisticProhibitInfo"
                : "/lms/shopee/logistic/updateLogisticProhibitInfo",
              type: "post",
              contentType: "application/json",
              params: JSON.stringify(detail),
            }).then((res) => {
              layer.msg(isAdd ? "新增成功" : "编辑成功", { icon: 1 });
              layer.close(index);
              if (isAdd) {
                const searchFormData = _this.getSearchData();
                const isExistVal = Object.keys(searchFormData).filter(
                  (v) => !!searchFormData[v]
                ).length;
                // 当查询条件存在值，才查询，，没有查询条件，后端会很慢，一分钟多
                if (isExistVal) {
                  $("#shop_categoryLogisticProhibit_search").click();
                }
              } else {
                $("#shop_categoryLogisticProhibit_search").click();
              }
            });
          },
        });
      },
      // 站点与物流名称联动
      siteFilter: function () {
        const _this = this;
        form.on(
          "select(shop_categoryLogisticProhibit_detail_salesSite)",
          function (obj) {
            if (obj.value) {
              _this.getLogisticChanel(obj.value);
            }
          }
        );
      },
      // 获取物流名称
      getLogisticChanel: function (params, selected = "") {
        this.getLogisticChanelAjax(params).then((res) => {
          commonRenderSelect(
            "shop_categoryLogisticProhibit_detail_logisticsChannelId",
            res,
            {
              name: "logisticsChannelNameAndLogisticsId",
              code: "logisticsChannelId",
              selected: selected,
            }
          ).then(() => {
            form.render();
          });
        });
      },
      // 校验值与cnsc类目，外箱包装的联动
      verifyLinkage: function () {
        const _this = this;
        form.on(
          "select(shop_categoryLogisticProhibit_detail_prohibitType)",
          function (obj) {
            _this.hideFormItem(obj.value);
          }
        );
      },
      hideFormItem: function (value) {
        const arr = [
          {
            class: "showOutBoxPackage",
            value: "外箱包装",
          },
          {
            class: "showCnscCate",
            value: "CNSC类目",
          },
          {
            class: "showLogisAttrList",
            value: "物流属性",
          },
        ];
        const formDom = $("#shop_categoryLogisticProhibit_detail_form");
        arr.forEach((item) => {
          if (item.value === value) {
            formDom.find(`.${item.class}`).show();
          } else {
            formDom.find(`.${item.class}`).hide();
          }
        });
      },
      outerBoxUnit: function () {
        const _this = this;
        form.on(
          "select(shop_categoryLogisticProhibit_detail_target)",
          function (obj) {
            const unitDom = $(obj.elem).parents(".box-row").find(".unit");
            const { value } = obj;
            const unit = _this.UnitObj[value] || ''
            unitDom.text(unit);
            _this.verifyOuterBox($(obj.elem));
          }
        );
      },
      outerBoxOperator: function () {
        const _this = this;
        form.on(
          "select(shop_categoryLogisticProhibit_detail_operator)",
          function (obj) {
            _this.verifyOuterBox($(obj.elem));
          }
        );
      },
      getBoxHtmlStr: function () {
        let str = `<div class="disflex box-row mb10">
        <div class="w20">or</div>
<div class="w150">
  <select name="target" lay-filter="shop_categoryLogisticProhibit_detail_target">
    <option value="">请选择</option>
    <option value="任意一边长">任意一边长</option>
    <option value="次长边长">次长边长</option>
    <option value="最短边长">最短边长</option>
    <option value="长+宽+高">长+宽+高</option>
    <option value="重量">重量</option>
    <option value="液体量">液体量</option>
  </select>
</div>
<div class="w150 ml10">
  <select name="operator" lay-filter="shop_categoryLogisticProhibit_detail_operator">
    <option value="">请选择</option>
    <option value=">">&gt;</option>
    <option value=">=">&gt;=</option>
    <option value="<">&lt;</option>
    <option value="<=">&lt;=</option>
    <option value="==">=</option>
  </select>
</div>
<div class="w150 ml10">
  <input type="text" name="value" class="layui-input" placeholder="请输入" onblur="shopcategoryLogisticProhibitHanleBlur(this)">
</div>
<div class="unit w40 ml5"></div>
<div class="w50 del-part">
   <div class="line_wrapper del" onclick="shopcategoryLogisticProhibitHanleDel(this)"><div class="add_line"></div></div>
 </div>
  <div class="w50 add-part">
   <div class="line_wrapper add" onclick="shopcategoryLogisticProhibitHanleAdd(this)">
     <div class="add_line add_x_line"></div>
     <div class="add_line add_y_line"></div>
   </div>
 </div>
</div>`;
        return str;
      },
      // 支持输入类目名，支持输入多个id
      filterCascader: function (node, keyword) {
        const keywordList = keyword.split(",").filter((v) => !!v);
        return node.path.some(function (node) {
          return keywordList.some((v) => {
            return node.label.indexOf(v) !== -1;
          });
        });
      },
      verifyOuterBox: function (sonDom) {
        const rowDom = $(sonDom).parents(".box-row");
        const target = rowDom.find("select[name=target]").val();
        const operator = rowDom.find("select[name=operator]").val();
        const value = rowDom.find("input[name=value]").val();
        if (!target || !operator || !value) {
          $(rowDom).css("border", "1px solid red");
        } else {
          $(rowDom).css("border", "none");
        }
      },

      //#region 接口 start
      // 站点接口
      siteAjax: function () {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
        });
      },
      // 创建人 接口
      creatorAjax: function () {
        return commonReturnPromise({
          url: ctx + "/shopee/logistic/listCategoryLogisticProhibitCreators",
        });
      },
      // 修改人 接口
      modifersAjax: function () {
        return commonReturnPromise({
          url: ctx + "/shopee/logistic/listCategoryLogisticProhibitModifiers",
        });
      },

      // 修改规则状态 接口
      changeStatusAjax: function (obj) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/logistic/modifyRuleStatus",
          params: obj,
        });
      },
      // cnsc类目
      getCnscCateTreeAjax: function () {
        return commonReturnPromise({
          url: "/lms/shopee/shopeeCate/cnscCategoryTree",
        });
      },
      // 物流属性
      getLogisAttrEnumsAjax: function () {
        return commonReturnPromise({
          url: "/lms/fyndiq/new/listing/manage.html",
        });
      },
      // 物流名称
      getLogisticChanelAjax: function (salesSite) {
        return commonReturnPromise({
          url: `/lms/shopee/logistic/listLogisticChanelBySalesSite/${salesSite}`,
        });
      },
      //#endregion 接口 end
    };

    shopCategoryLogisticProhibitName.init();
  }
);

function shop_categoryLogisticProhibit_import(_, e) {
  const importType = $("#shop_categoryLogisticProhibit_importType").val();

  var formData = new FormData();
  //获取该input的所有元素、属性
  var f = document.getElementById(
    "shop_categoryLogisticProhibit_importInputBtn"
  );
  formData.append("file", f.files[0]);
  const exportUrlObj = {
    del: ctx + "/shopee/logistic/importShutdownShopeeCategoryLogisticProhibit",
    add: ctx + "/shopee/logistic/importAddNewShopeeCategoryLogisticProhibit",
    replace:
      ctx + "/shopee/logistic/importReplaceShopeeCategoryLogisticProhibit",
  };
  const resultDom = $("#shop_categoryLogisticProhibit_import_result");
  const exportResultInfoDom = $(
    "#shop_categoryLogisticProhibit_import_resultInfo"
  );
  $.ajax({
    url: exportUrlObj[importType],
    data: formData,
    type: "POST",
    async: true,
    cache: false,
    contentType: false,
    processData: false,
    dataType: "json",
    beforeSend: function () {
      loading.show();
    },
    success: function (data) {
      loading.hide();
      if (data.code == "0000") {
        layer.msg(data.msg, { icon: 1 });
        resultDom.text(!data.data ? data.msg : "文件数据出现错误");
        if (!data.data) {
          resultDom.css("color", "green");
          exportResultInfoDom.hide();
          exportResultInfoDom.data("id", "");
        } else {
          resultDom.css("color", "red");
          exportResultInfoDom.show();
          exportResultInfoDom.data("id", data.data);
        }
        // 创建人 修改人 刷新
        Promise.all([
          commonReturnPromise({
            url: ctx + "/shopee/logistic/listCategoryLogisticProhibitCreators",
          }),
          commonReturnPromise({
            url: ctx + "/shopee/logistic/listCategoryLogisticProhibitModifiers",
          }),
        ])
          .then((res) => {
            const creator = $("#shop_categoryLogisticProhibit_creator").val();
            const modifer = $("#shop_categoryLogisticProhibit_modifier").val();
            commonRenderSelect(
              "shop_categoryLogisticProhibit_creator",
              res[0],
              {
                selected: creator,
              }
            );
            commonRenderSelect(
              "shop_categoryLogisticProhibit_modifier",
              res[1],
              {
                selected: modifer,
              }
            );
          })
          .then(() => {
            layui.form.render();
            $("#shop_categoryLogisticProhibit_search").click();
          });
      } else {
        layer.msg(data.msg, { icon: 2 });
        resultDom.text(data.msg);
        resultDom.css("color", "red");
        exportResultInfoDom.hide();
        exportResultInfoDom.data("id", "");
      }
    },
    error: function (error) {
      layui.layer.msg(`${error.statusText}`, { icon: 2 });
      resultDom.text(error.statusText);
      resultDom.css("color", "red");
      exportResultInfoDom.hide();
      exportResultInfoDom.data("id", "");
    },
  });
  //传递完成以后清空input的value
  e.target.value = "";
  e.preventDefault();
  e.stopPropagation();
  // }
}

// 外箱包装删除
function shopcategoryLogisticProhibitHanleDel(dom) {
  const formDom = $("#shop_categoryLogisticProhibit_detail_form");
  const rowDom = $(dom).parents(".box-row");
  rowDom.remove();
  // 仅剩一行时不可删除
  const rowDomList = formDom.find(".box-row");
  if (rowDomList.length === 1) {
    rowDomList.eq(0).find(".del-part").hide();
  }
  // 最后一行展示新增图标
  rowDomList.last().find(".add-part").show();
}
// 外箱包装添加
function shopcategoryLogisticProhibitHanleAdd(dom) {
  const formDom = $("#shop_categoryLogisticProhibit_detail_form");
  const boxDom = $(dom).parents(".layui-input-block");
  let htmlStr = shopCategoryLogisticProhibitName.getBoxHtmlStr();
  boxDom.append(htmlStr);
  // 每行删除图标都展示
  const rowDomList = formDom.find(".box-row");
  rowDomList.eq(0).find(".del-part").show();
  // 倒数第二行隐藏新增图标
  rowDomList.eq(-2).find(".add-part").hide();
  layui.form.render();
}

function shopcategoryLogisticProhibitHanleBlur(dom) {
  commonFormatNonnegativeBlur(dom, true);
  const rowDom = $(dom).parents(".box-row");
  const target = rowDom.find("select[name=target]").val();
  const operator = rowDom.find("select[name=operator]").val();
  const value = rowDom.find("input[name=value]").val();
  if (!target || !operator || !value) {
    $(rowDom).css("border", "1px solid red");
  } else {
    $(rowDom).css("border", "none");
  }
}
