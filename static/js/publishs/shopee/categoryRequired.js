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
      upload = layui.upload

    render_hp_orgs_users("#shop_categoryRequired_form")

    shopCategoryRequiredName = {
      init: function () {
        this.search()
        this.reset()
        this.handleTab()
        this.tableToor()
      },
      // 查询
      search: function () {
        let _this = this
        $("#shop_categoryRequired_search").click(function () {
          const formData = serializeObject($("#shop_categoryRequired_form"))
          _this.tableRender(formData)
        })
      },
      // 重置
      reset: function () {
        $("#shop_categoryRequired_reset").click(function () {
          $("#shop_categoryRequired_form")[0].reset()
        })
      },
      tableRender: function (formData) {
        table.render({
          elem: "#shop_categoryRequired_table",
          id: "shop_categoryRequired_tableId",
          url: ctx + "/shopee/prodCateAttr/getProdCateAttr",
          where: formData,
          method: "get",
          cols: [
            [
              { field: "attributeId", title: "attribute_id" },
              { field: "displayAttributeName", title: "属性名" },
              { field: "defaultValue", title: "默认值" },
              { field: "defaultValueId", title: "默认值id" },
              { title: "操作", toolbar: "#shop_categoryRequired_toolbar" },
            ],
          ],
          limits: [100, 200, 500],
          limit: 100,
          page: true,
          done: function (_, _, count) {
            // table总数量
            $("#shop_categoryRequired_total").text(count)
          },
        })
      },
      // table 工具栏
      tableToor: function () {
        let _this = this
        table.on("tool(shop_categoryRequired_table)", function (obj) {
          switch (obj.event) {
            case "edit":
              //   打开编辑弹窗
              _this.editModal(obj.data)
              break
          }
        })
      },
      // 监听tab
      handleTab: function () {
        element.on("tab(shop_categoryRequired_tab)", function (data) {
          $("#shop_categoryRequired_search").click()
        })
      },

      // 编辑
      editModal: function (obj = {}) {
        let _this = this
        const attributeUnit = JSON.parse(obj.attributeUnit)
        layer.open({
          type: 1,
          title: "修改类目",
          area: ["600px", "300px"],
          id: Date.now(),
          btn: ["保存", "关闭"],
          content: $("#shop_categoryRequired_editModal").html(),
          success: function (layero) {
            const $shopeeEditCateForm = layero.find(".attrs")
            const attributeValueList = JSON.parse(obj.attributeValueList)
            let attValueHtml = ""
            let label = ""
            let optionStr = ""
            if (attributeUnit.length) {
              commonRenderSelect("shop_categoryRequired_unit", attributeUnit).then(() => {
                $("#shop_categoryRequired_unit").val(obj.defaultValueUnit || "");
                form.render();
              });
            } else {
              layero.find(".attrsUnit").hide();
            }
            switch (obj.inputType) {
              case "COMBO_BOX":
              case "MULTIPLE_SELECT_COMBO_BOX":
                label = `<label class="layui-form-label w170"><font class="fRed">*</font>${obj.displayAttributeName}</label>`
                for (let item of attributeValueList) {
                  optionStr += `<option data-id="${item.valueId}" value="${
                    item.displayValueName
                  }" ${item.valueId == obj.defaultValueId ? "selected" : ""}>${
                    item.displayValueName
                  }</option>`
                }
                attValueHtml = `<div class="layui-input-block ml200"><div><input type="text" class="layui-input" name="${obj.attributeId}" list="${obj.attributeId}" value="${obj.defaultValue===undefined ? '': obj.defaultValue}" style="position: absolute;z-index: 2;width: 80%;"></div><select name="${obj.attributeId}" readonly lay-filter="defaultAttrValuesel">${optionStr}</select></div>`
                break
              case "DROP_DOWN":
              case "MULTIPLE_SELECT":
                label = `<label class="layui-form-label w170"><font class="fRed">*</font>${obj.displayAttributeName}</label>`
                for (let item of attributeValueList) {
                  optionStr += `<option data-id="${item.valueId}" value="${
                    item.originalValueName
                  }" ${item.valueId == obj.defaultValueId ? "selected" : ""}>${
                    item.displayValueName
                  }</option>`
                }
                attValueHtml = `<div class="layui-input-block ml200"><select name="${obj.attributeId}">${optionStr}</select></div>`
                break
              case "TEXT_FILED":
                label = `<label class="layui-form-label w170"><font class="fRed">*</font>${obj.displayAttributeName}</label>`
                attValueHtml += '<div class="layui-form-item">'
                let inputHtml = ""
                switch (obj.inputValidationType) {
                  case "INT_TYPE":
                    inputHtml = `<input  name="${obj.attributeId}"
                      value="${obj.defaultValue===undefined ? '': obj.defaultValue }" type="number" class="layui-input" lay-verify="Integer"/>`
                    break
                  case "FLOAT_TYPE":
                    inputHtml = `<input  name="${obj.attributeId}"
                      value="${obj.defaultValue===undefined ? '': obj.defaultValue}" type="number" class="layui-input" />`
                    break
                  default:
                    inputHtml = `<input  name="${obj.attributeId}"
                      value="${obj.defaultValue===undefined ? '': obj.defaultValue}" type="text" class="layui-input" />`
                    break
                }
                attValueHtml = `<div class="layui-input-block ml200">${inputHtml}</div>`
                break
              default:
                break
            }
            $shopeeEditCateForm.html(label + attValueHtml)
            form.render()
            if (
              obj.inputType == "COMBO_BOX" ||
              obj.inputType === "MULTIPLE_SELECT_COMBO_BOX"
            ) {
              form.on("select(defaultAttrValuesel)", function (data) {
                layero.find(`input[name=${obj.attributeId}]`).val(data.value)
              })
            }
          },
          yes: function (index, layero) {
            let defaultValue = ""
            let defaultValueId = ""
            switch (obj.inputType) {
              case "COMBO_BOX":
              case "MULTIPLE_SELECT_COMBO_BOX":
                defaultValue = layero
                  .find(`input[name=${obj.attributeId}]`)
                  .val()
                if (defaultValue === "") return layer.msg("请输入")
                const selectedDom = layero
                  .find(`select[name=${obj.attributeId}]`)
                  .find("option:selected")
                if (defaultValue == selectedDom.val()) {
                  defaultValueId = Number(selectedDom.data("id"))
                }
                if (defaultValueId === "") {
                  defaultValueId = 0
                }
                break
              case "DROP_DOWN":
              case "MULTIPLE_SELECT":
                defaultValue = layero
                  .find(`select[name=${obj.attributeId}]`)
                  .find("option:selected")
                  .val()
                if (defaultValue === "") return layer.msg("请选择")
                defaultValueId = Number(
                  layero
                    .find(`select[name=${obj.attributeId}]`)
                    .find("option:selected")
                    .data("id")
                )
                break
              case "TEXT_FILED":
                defaultValue = layero
                  .find(`input[name=${obj.attributeId}]`)
                  .val()
                if (defaultValue === "") return layer.msg("请输入")
                defaultValueId = 0
                break
              default:
                break
            }
            const defaultValueUnit = $('#shop_categoryRequired_unit').val()
            const params = { ...obj, defaultValue, defaultValueId, defaultValueUnit: attributeUnit.length ? defaultValueUnit : null }
            _this.editAjax(params).then((res) => {
              layer.msg(res, { icon: 1 })
              layer.close(index)
              $("#shop_categoryRequired_search").click()
            })
          },
        })
      },

      //#region 接口 start
      // 获取默认值枚举接口
      defaultValueAjax: function () {
        return commonReturnPromise({
          url: ctx + "/shopee/prodCateAttr/getDefaultValue",
        })
      },
      // 编辑 添加接口
      editAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/shopee/prodCateAttr/updateOrAddProdCateAttr",
          contentType: "application/json",
          params: JSON.stringify(obj),
          type: "post",
        })
      },
      //#endregion 接口 end
    }

    shopCategoryRequiredName.init()
  }
)
