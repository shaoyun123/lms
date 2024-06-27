layui.use(["admin", "form", "layer", "formSelects", "element", "laydate", "laypage", "table"], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    formSelects = layui.formSelects,
    element = layui.element,
    laydate = layui.laydate,
    laypage = layui.laypage,
    table = layui.table
  $ = layui.$
  form.render("select")
  ebayGenauctionName = {
    init: async function () {
      const data = JSON.parse(window.localStorage.getItem("ebay_genauction"))
      await this.getlistingDuration()
      if (data.type === "publish") {
        $("#ebay_genauction_online").hide()
        this.getGenAuctionPage(data.data)
      } else {
        $("#ebay_genauction_publish").hide()
        this.tableRender(data.data)
      }
      this.applyFixedPrice()
      this.applyBuyItNowPrice()
      this.batchGenauction()
      this.publishNow()
    },

    getlistingDuration: async function () {
      await commonReturnPromise({
        url: "/lms/ebaylisting/listListingDurations",
      })
        .then(res => {
          commonRenderSelect("ebay_genauction_listingDuration", res)
        })
        .then(() => form.render())
    },
    getGenAuctionPage: function (data) {
      commonReturnPromise({
        url: "/lms/ebaylisting/getGenAuctionPage",
        type: "post",
        params: JSON.stringify(data),
        isLoading: true,
        contentType: "application/json",
      }).then(res => {
        this.tableRender(res)
      })
    },
    tableContainer: null,
    tableRender: function (data) {
      const _this = this
      table.render({
        elem: "#ebay_genauction_table",
        data,
        id: "ebay_genauction_table",
        cols: [
          [
            { type: "checkbox", width: 30 },
            { title: "图片", width: 80, field: "mainImgUri", templet: "#ebay_genauction_imageTpl" },
            { title: "子SKU", width: 150, field: "sSku" },
            { title: "一口价", width: 200, field: "fixedPrice" },
            { title: "拍卖价", templet: "#ebay_genauction_buyItNowPrice_tpl" },
            { title: "结果", field: "result" },
          ],
        ],
        page: false,
        limit: 1000,
        done: function (res) {
          imageLazyloadAll()
          _this.tableContainer = $("#ebay_genauction_table").next().find("tbody")
          _this.buyItNowPriceBlur()
        },
      })
    },
    // 拍卖价失焦
    buyItNowPriceBlur: function () {
      const _this = this
      _this.tableContainer.find("input[name=buyItNowPrice]").blur(function () {
        const buyItNowPrice = Number($(this).val())
        if (buyItNowPrice === 0) {
          $(this).val("")
          layer.msg("价格调整不得低于0")
        }
      })
    },
    // 一口价应用
    applyFixedPrice: function () {
      const _this = this
      $("#ebay_genauction_fixedPrice").click(function () {
        const fixedPricePercent = $("#ebay_genauction_form").find("input[name=fixedPricePercent]").val()
        if (fixedPricePercent !== "") {
          // 获取选中数据
          const { data } = table.checkStatus("ebay_genauction_table")
          let isNegative = false
          if (!data.length) return layer.msg("请选择数据")
          _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
            const tr = $(this).parents("tr")
            tr.find('td[data-field="result"] div').text("")
            const fixedPrice = tr.find('td[data-field="fixedPrice"] div').text()
            const buyItNowPrice = ((Number(fixedPrice) * Number(fixedPricePercent)) / 100).toFixed(2)
            if (buyItNowPrice > 0) {
              tr.find("input[name=buyItNowPrice]").val(buyItNowPrice) //新的价格
            } else {
              isNegative = true
              tr.find("input[name=buyItNowPrice]").val("")
              // tr.find('td[data-field="result"] div').text("价格调整不得低于0")
            }
          })
          if (isNegative) layer.msg("价格调整不得低于0")
        } else {
          return layer.msg("请填写一口价的百分比")
        }
      })
    },
    // 当前拍卖价 应用
    applyBuyItNowPrice: function () {
      const _this = this
      $("#ebay_genauction_buyItNowPrice").click(function () {
        const calculatePrice = $("#ebay_genauction_form").find("input[name=calculatePrice]").val()
        if (calculatePrice !== "") {
          const calType = $("#ebay_genauction_form").find("select[name=calculateType]").val()
          // 获取选中数据
          const { data } = table.checkStatus("ebay_genauction_table")
          if (!data.length) return layer.msg("请选择数据")
          let isNegative = false
          _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
            const tr = $(this).parents("tr")
            tr.find('td[data-field="result"] div').text("")
            const inputDom = tr.find("input[name=buyItNowPrice]")
            const curPrice = inputDom.val() || 0
            let finalprice = null
            if (calType == 1) {
              finalprice = (parseFloat(curPrice) + parseFloat(calculatePrice)).toFixed(2)
            } else if (calType == 2) {
              finalprice = (parseFloat(curPrice) - parseFloat(calculatePrice)).toFixed(2)
            } else if (calType == 3) {
              finalprice = (parseFloat(curPrice) * parseFloat(calculatePrice)).toFixed(2)
            } else {
              finalprice = parseFloat(calculatePrice).toFixed(2)
            }
            if (finalprice > 0) {
              inputDom.val(finalprice) //新的价格
            } else {
              inputDom.val("")
              isNegative = true
              // tr.find('td[data-field="result"] div').text("价格调整不得低于0")
            }
          })
          if (isNegative) layer.msg("价格调整不得低于0")
        } else {
          return layer.msg("请填写调整的价格")
        }
      })
    },
    // 批量生成
    batchGenauction: function () {
      const _this = this
      $("#ebay_genauction_publish").click(function (obj) {
        let data = []
        let emptyFlag = false
        const listingDuration = $("#ebay_genauction_form").find("select[name=listingDuration]").val()
        _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
          const tr = $(this).parents("tr")
          const buyItNowPrice = tr.find("input[name=buyItNowPrice]").val()
          const storeAcctId = tr.find("input[name=storeAcctId]").val()
          const siteId = tr.find("input[name=siteId]").val()
          const prodTempVarietyId = tr.find("input[name=prodTempVarietyId]").val()
          const prodPId = tr.find("input[name=prodPId]").val()
          const isOverSeasWh = tr.find("input[name=isOverSeasWh]").val()
          if (!buyItNowPrice) emptyFlag = true
          data.push({
            storeAcctId,
            siteId,
            prodTempVarietyId,
            prodPId,
            isOverSeasWh,
            listingDuration,
            buyItNowPrice,
          })
        })
        if (!data.length) return layer.msg("请选择数据")
        if (emptyFlag) return layer.msg("请填写拍卖价")
        if (!listingDuration) return layer.msg("请选择刊登天数")
        commonReturnPromise({
          url: "/lms/ebaylisting/genauction",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify(data),
        }).then(res => {
          _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
            const tr = $(this).parents("tr")
            const prodTempVarietyId = tr.find("input[name=prodTempVarietyId]").val()
            let curResult = res[prodTempVarietyId]
            const resultDom = tr.find('td[data-field="result"] div')
            resultDom.text(curResult)
            if (curResult.includes("成功")) {
              resultDom.css("color", "green")
            } else {
              resultDom.css("color", "red")
            }
          })
        })
      })
    },
    // 立即刊登 在线商品
    publishNow: function () {
      const _this = this
      $("#ebay_genauction_online").click(function () {
        let data = []
        let emptyFlag = false
        const listingDuration = $("#ebay_genauction_form").find("select[name=listingDuration]").val()
        _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
          const tr = $(this).parents("tr")
          const buyItNowPrice = tr.find("input[name=buyItNowPrice]").val()
          if (!buyItNowPrice) emptyFlag = true
          data.push({
            prodSyncSId: tr.find("input[name=prodSyncSId]").val(),
            listingDuration,
            buyItNowPrice,
          })
        })
        if (!data.length) return layer.msg("请选择数据")
        if (emptyFlag) return layer.msg("请填写拍卖价")
        if (!listingDuration) return layer.msg("请选择刊登天数")
        commonReturnPromise({
          url: "/lms/onlineProductEbay/copyOnlineSubProductToAuction",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify(data),
        }).then(res => {
          _this.tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
            const tr = $(this).parents("tr")
            tr.find('td[data-field="result"] div').text(res)
            tr.find('td[data-field="result"] div').css("color", "green")
          })
        })
      })
    },
  }
  ebayGenauctionName.init()
})
