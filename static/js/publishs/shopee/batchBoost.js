layui.use(
  [
    "admin",
    "form",
    "layer",
    "laydate",
    "formSelects",
    "element",
    "table",
    "laypage",
  ],
  function () {
    var admin = layui.admin,
      form = layui.form,
      table = layui.table,
      layer = layui.layer,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      $ = layui.$
    form.render()

    const shopeeBatchBoostName = {
      // 初始化
      init: async function () {
        // 同步操作
        try {
          await this.fetchSite()
          formSelects.data("shopeeBacthBoostSiteAndStore", "local", {
            arr: this.siteOriginList,
          })
          this.initListingTime()
          await this.getStoreList()
        } catch (error) {
          throw new Error(error)
        }
      },
      // 店铺值
      storeAcctOriginList: [],
      // 站点值
      siteOriginList: [],
      // 站点
      fetchSite: async function () {
        const { siteList } = await this.siteAjax()
        this.siteOriginList = siteList.map((item) => ({
          ...item,
          value: item.code,
        }))
      },
      // 店铺值获取
      getStoreList: async function () {
        const res = await this.storeAcctAjax()
        this.storeAcctOriginList = res.map((item) => ({
          ...item,
          name: item.storeAcct,
          value: item.id,
        }))
      },
      // 时间
      initListingTime: function () {
        laydate.render({
          elem: "#shopeeBacthBoost-listing-time",
          type: "datetime",
          range: true,
        })
      },
      // 触发站点和店铺的选择
      renderSiteStore: function () {
        const _this = this
        form.on("select(shopeeBacthBoost-form-siteStore)", function (data) {
          const { value } = data
          formSelects.data("shopeeBacthBoostSiteAndStore", "local", {
            arr: value == 1 ? _this.siteOriginList : _this.storeAcctOriginList,
          })
        })
      },
      // 获取筛选条件值
      getScreenValue: function () {
        const formObj = serializeObject($("#shopeeBacthBoost-form"))
        if (formObj.storeAcctIdList == "") return "请选择站点或者店铺"
        const curSiteArr = formObj.storeAcctIdList.split(",")
        if (formObj.storeType == 1) {
          formObj.salesSite = curSiteArr
          delete formObj.storeAcctIdList
        } else {
          formObj.storeAcctIdList = curSiteArr.map((item) => Number(item))
        }
        formObj.listingTimeStart =
          formObj.listingTime === ""
            ? ""
            : new Date(formObj.listingTime.split(" - ")[0]).getTime()
        formObj.listingTimeEnd =
          formObj.listingTime === ""
            ? ""
            : new Date(formObj.listingTime.split(" - ")[1]).getTime()
        // 部分转为number
        formObj.boostAmount != "" &&
          (formObj.boostAmount = Number(formObj.boostAmount))
        formObj.salesSearchType = Number(formObj.salesSearchType)
        formObj.orderBy = Number(formObj.orderBy)
        delete formObj.listingTime
        delete formObj.storeType
        return formObj
      },
      // 替换boost
      repBoost: function () {
        const _this = this
        $("#shopeeBacthBoost-rep-boost").click(function () {
          const params = _this.getScreenValue()
          if (typeof params == "string") return layer.msg(params)
          _this.repBoostAjax(params).then((res) => {
            if (res.includes("成功")) {
              layer.msg(res, { icon: 1 })
            }
          })
        })
      },
      // 定时boost
      ontimeBoost: function () {
        const _this = this
        $("#shopeeBacthBoost-ontime-boost").click(function () {
          const params = _this.getScreenValue()
          if (typeof params == "string") return layer.msg(params)
          _this.ontimeBoostAjax(params).then((res) => {
            if (res.includes("成功")) {
              layer.msg(res, { icon: 1 })
            }
          })
        })
      },
      repBoostAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/shopee/shopeeIsEnableProduct/batchResetBoostItems",
          type: "post",
          params: JSON.stringify(obj),
          contentType: "application/json",
        })
      },
      ontimeBoostAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/shopee/shopeeIsEnableProduct/batchSetBoostItems",
          type: "post",
          params: JSON.stringify(obj),
          contentType: "application/json",
        })
      },
      siteAjax: function () {
        return commonReturnPromise({
          url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
          type: "post",
        })
      },
      storeAcctAjax: function () {
        return commonReturnPromise({
          url: ctx + "/sys/listStoreForRenderHpStoreCommonComponent.html",
          type: "post",
          params: {
            roleNames: "shopee专员",
            platCode: "shopee",
            orgId: "",
            salePersonId: "",
          },
        })
      },
    }
    shopeeBatchBoostName.init()
    // 触发站点和店铺的选择
    shopeeBatchBoostName.renderSiteStore()
    // 替换boost
    shopeeBatchBoostName.repBoost()
    // 定时boost
    shopeeBatchBoostName.ontimeBoost()
  }
)
