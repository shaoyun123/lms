var modifyStockTimeUnit
layui.use(
  [
    "admin",
    "form",
    "layer",
    "table",
    "formSelects",
    "element",
    "laydate",
    "laytpl",
  ],
  function () {
    var admin = layui.admin,
      form = layui.form, 
      layer = layui.layer,
      table = layui.table,
      formSelects = layui.formSelects,
      element = layui.element,
      laydate = layui.laydate,
      laypage = layui.laypage,
      laytpl = layui.laytpl,
      $ = layui.$

    shopOnlineModifyCnscPriceName = {
      init: function () {
        const globalItemIdList = shop_arr.map((item) => ({
          globalItemId: item.globalItemId,
        }))
        if (globalItemIdList.length) {
          this.initListAjax(globalItemIdList).then((res) => {
            this.tableRender(res)
          })
        } else {
          this.tableRender([])
        }
        this.handleSearch()
        this.handlereset()
        this.batchMOdifyPrice()
        this.modifyPriceByGrossRate()
        this.modifyPriceByOperator()
        form.render()
      },
      handleSearch: function () {
        const _this = this
        $("#shop_online_modifyCnscPrice_search").click(function () {
          const formDom = $("#shop_online_modifyCnscPrice_form")
          const type = formDom.find("select[name=type]").val()
          const list = formDom
            .find("input[name=list]")
            .val()
            .replaceAll("，", ",")
            .split(",")
            .filter((item) => !!item)
          if (!list.length) return layer.msg("请输入有效数据", { icon: 7 })
          // 产品ID  GlobalItemId 需要是number
          if (type === "itemId" || type === "globalItemId") {
            if (list.some((item) => !isNumber(item)))
              return layer.msg("请输入数字类型数据", { icon: 7 })
          }
          const param = list.map((item) => ({ [type]: item }))
          _this.searchjax(param).then((res) => _this.tableRender(res))
        })
      },
      handlereset: function () {
        $("#shop_online_modifyCnscPrice_reset").click(function () {
        })
      },
      tableRender: function (data) {
        table.render({
          elem: "#shop_online_modifyCnscPrice_table",
          data,
          cols: [
            [
              { type: "checkbox" },
              { field: "globalModelId", title: "globalModelId" },
              { field: "prodSId", title: "prodSId" },
              { field: "storeAcctId", title: "storeAcctId" },
              { field: "globalItemId", title: "全球商品ItemId" },
              { field: "globalModelSku", title: "全球商品ModelSKU",width: 200 },
              { field: "itemId", title: "店铺商品ItemId" },
              { field: "prodSSku", title: "商品子SKU" },
              { field: "storeAcct", title: "店铺名称" },
              { field: "originalPrice", title: "当前价格(&yen;)" },
              {
                field: "newPrice",
                title: "新价格(&yen;)",
                templet: "#shop_online_modifyCnscPrice_newPrice",
              },
              { field: "result", title: "操作结果", align: "center" },
            ],
          ],
          page: false,
          limit: 100000,
          id: "shop_online_modifyCnscPrice_tableId",
          height: 500,
          done: function (res, curr, count) {
            $("[data-field='globalModelId']").css("display", "none")
            $("[data-field='prodSId']").css("display", "none")
            $("[data-field='storeAcctId']").css("display", "none")
            $("#shop_online_modifyCnscPrice_total").text("共" + count + "条")
          },
        })
      },
      fetchCheckedTrDoms: function () {
        const checkedTrDoms = $("#shop_online_modifyCnscPrice_table")
          .next()
          .find('tbody tr td input[name="layTableCheckbox"]:checked')
          .parents("tr")
        return checkedTrDoms
      },
      // 毛利率一键应用
      modifyPriceByGrossRate: function () {
        const _this = this
        $("#shop_online_modifyCnscPrice_grossRate").click(function () {
          const formDom = $("#shop_online_modifyCnscPrice_form")
          const grossRate = formDom.find("input[name=newGrossRate]").val()
          if (grossRate == "")
            return layer.msg("请填写需要应用的毛利率", { icon: 7 })
          const checkedTrDoms = _this.fetchCheckedTrDoms()
          if (!checkedTrDoms.length) return layer.msg("请选择数据", { icon: 7 })
          // 调接口
          const param = []
          checkedTrDoms.each(function () {
            param.push({
              prodSId: $(this).find("[data-field=prodSId]").text(),
              globalItemId: $(this).find("[data-field=globalItemId]").text(),
              globalModelId: $(this).find("[data-field=globalModelId]").text(),
              storeAcctId: $(this).find("[data-field=storeAcctId]").text(),
              grossRate,
            })
          })
          _this.getPriceByGrossAjax(param).then((res) => {
            checkedTrDoms.each(function () {
              const globalModelId = $(this)
                .find("[data-field=globalModelId]")
                .text()
              const globalItemId = $(this)
                  .find("[data-field=globalItemId]")
                  .text()
              let curData = res.find(
                (item) => item.globalModelId == globalModelId && item.globalItemId ==globalItemId
              )
              $(this)
                .find("[data-field=newPrice] input[name=newPrice]")
                .val(curData.newPrice)
            })
          })
        })
      },
      // 当前促销价一键应用
      modifyPriceByOperator: function () {
        const _this = this
        $("#shop_online_modifyCnscPrice_operator").click(function () {
          const formDom = $("#shop_online_modifyCnscPrice_form")
          const inputVal = formDom.find("input[name=newPriceInput]").val()
          if (inputVal == "") return layer.msg("请输入调整的价格", { icon: 7 })
          const calType = formDom.find("select[name=calType]").val()
          const checkedTrDoms = _this.fetchCheckedTrDoms()
          if (!checkedTrDoms.length) return layer.msg("请选择数据", { icon: 7 })
          checkedTrDoms.each(function () {
            const curInputDom = $(this).find(
              "[data-field=newPrice] input[name=newPrice]"
            )
            const originalPrice = $(this)
              .find("[data-field=originalPrice]")
              .text()
            _this.calculatePrice(calType, originalPrice, inputVal, curInputDom)
          })
        })
      },
      //选自对应计算类型计算修改后的价格
      calculatePrice: function (calType, originprice, newprice, input) {
        switch (calType) {
          case "1":
            var finalprice = (
              parseFloat(originprice) + parseFloat(newprice)
            ).toFixed(2)
            input.val(finalprice) //新的价格
            break
          case "2":
            var finalprice = (
              parseFloat(originprice) - parseFloat(newprice)
            ).toFixed(2)
            if (finalprice > 0) {
              input.val(finalprice) //新的价格
            } else {
              input.val("")
              layer.msg("价格调整不得低于0")
            }
            break
          case "3":
            var finalprice = (
              parseFloat(originprice) * parseFloat(newprice)
            ).toFixed(2)
            input.val(finalprice) //新的价格
            break
          default:
            input.val(newprice)
        }
      },
      batchMOdifyPrice: function () {
        $("#shop_online_modifyCnscPrice_batchModify").click(function () {
          const checkedTrDoms = $("#shop_online_modifyCnscPrice_table")
            .next()
            .find('tbody tr td input[name="layTableCheckbox"]:checked')
            .parents("tr")
          if (!checkedTrDoms.length) return layer.msg("请选择数据", { icon: 7 })
          const param = []
          checkedTrDoms.each(function () {
            const globalModelId = $(this)
              .find("[data-field=globalModelId] div")
              .text()
            const globalItemId = $(this)
              .find("[data-field=globalItemId] div")
              .text()
            const newPrice = $(this)
              .find("[data-field=newPrice] input[name=newPrice]")
              .val()
            param.push({ globalModelId, globalItemId, newPrice })
          })
          commonReturnPromise({
            url:
              ctx + "/shopee/onlineGlobalProduct/updateGlobalItemModelsPrice",
            type: "post",
            params: JSON.stringify(param),
            contentType: "application/json;charset=UTF-8",
          }).then((res) => {
            checkedTrDoms.each(function () {
              const globalModelId = $(this)
                .find("[data-field=globalModelId] div")
                .text()
              res.some((item) => {
                if (item.globalModelId == globalModelId) {
                  $(this)
                    .find("[data-field=result] div")
                    .text(item.operationResult)
                  $(this)
                    .find("[data-field=result] div")
                    .addClass(item.operationCode === 1 ? "fGreen" : "fRed")
                }
                return item.globalModelId == globalModelId
              })
            })
          })
        })
      },
      searchjax: function (obj) {
        return commonReturnPromise({
          url:
            ctx +
            "/shopee/onlineGlobalProduct/listGlobalItemModelsByGlobalItemIds",
          type: "post",
          params: JSON.stringify(obj),
          contentType: "application/json;charset=UTF-8",
        })
      },
      initListAjax: function (globalItemIdList) {
        return commonReturnPromise({
          url:
            ctx +
            "/shopee/onlineGlobalProduct/listGlobalItemModelsByGlobalItemIds",
          type: "post",
          params: JSON.stringify(globalItemIdList),
          contentType: "application/json;charset=UTF-8",
        })
      },
      getPriceByGrossAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/shopee/onlineGlobalProduct/calculateGlobalModelsPrice",
          type: "post",
          params: JSON.stringify(obj),
          contentType: "application/json;charset=UTF-8",
        })
      },
    }
    //初始化
    shopOnlineModifyCnscPriceName.init()
  }
)
