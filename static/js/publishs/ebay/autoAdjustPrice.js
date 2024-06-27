layui.use(["admin", "form", "layer", "formSelects", "table", "element", "laydate", "laypage", "table", "laytpl", "upload"], function () {
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

  render_hp_orgs_users("#ebay_autoAdjustPrice_form")

  ebayAutoAdjustPrice = {
    init: function () {
      // 店铺
      this.storeAcctAjax().then(res => {
        commonRenderSelect("ebay_autoAdjustPrice_storeAcctId", res, {
          name: "storeAcct",
          code: "id",
        }).then(() => form.render())
      })
      //创建人
      this.creatorAjax().then(res => {
        commonRenderSelect("ebay_autoAdjustPrice_creator", res, {
          name: "creator",
          code: "creatorId",
        }).then(() => form.render())
      })
      // 备注站点
      this.siteAjax().then(res => {
        const arr = res.ebaySiteList.map(item => ({
          value: item.siteName,
          name: item.siteName,
        }))
        this.siteList = arr
        formSelects.data("ebay_autoAdjustPrice_site", "local", { arr })
      })
      this.search()
      this.reset()
      this.handleTab()
      this.addRule()
    },
    siteList: [],
    // 查询
    search: function () {
      let _this = this
      $("#ebay_autoAdjustPrice_search").click(function () {
        let formData = serializeObject($("#ebay_autoAdjustPrice_form"))
        formData.storeAcctIdList = formData.storeAcctIdList
          .split(",")
          .filter(item => item)
          .map(item => Number(item))
        formData.remarkSiteNameList = formData.remarkSiteNameList.split(",").filter(item => item)
        _this.tableRender(formData)
      })
    },
    // 重置
    reset: function () {
      $("#ebay_autoAdjustPrice_reset").click(function () {
        $("#ebay_autoAdjustPrice_form")[0].reset()
      })
    },
    tableRender: function (formData) {
      const _this = this
      table.render({
        elem: "#ebay_autoAdjustPrice_table",
        id: "ebay_autoAdjustPrice_tableId",
        url: ctx + "/ebayAutoModifyPriceRule/searchRules",
        where: formData,
        contentType: "application/json;charset=UTF-8",
        method: "post",
        cols: [
          [
            { field: "status", title: "状态", templet: "#ebay_autoAdjustPrice_status" },
            { field: "ruleName", title: "规则名称" },
            {
              field: "floatType",
              title: "调价策略",
              templet: function (d) {
                const type = d.floatPositive === true ? "每次调增" : "每次调减"
                const percentUnit = d.floatType === 2 ? "%" : ""
                return type + d.floatNum + percentUnit
              },
            },
            { field: "storeNums", title: "应用店铺数量", templet: "#ebay_autoAdjustPrice_storeCount" },
            {
              field: "remarkTargetsName",
              title: "调价对象一",
              templet: function (d) {
                let notSoldDays = d.notSoldDays === undefined ? "" : d.notSoldDays
                let soldNumsMin = d.soldNumsMin === undefined ? "" : d.soldNumsMin
                let soldNumsMax = d.soldNumsMax === undefined ? "" : d.soldNumsMax
                let currentSevenDaysSalesMin = d.currentSevenDaysSalesMin === undefined ? "" : d.currentSevenDaysSalesMin
                let currentSevenDaysSalesMax = d.currentSevenDaysSalesMax === undefined ? "" : d.currentSevenDaysSalesMax
                let priceMin = d.priceMin === undefined ? "" : d.priceMin
                let priceMax = d.priceMax === undefined ? "" : d.priceMax
                let stockMin = d.stockMin === undefined ? "" : d.stockMin
                let stockMax = d.stockMax === undefined ? "" : d.stockMax
                const tipStr =
                  "多少天内未售出：" +
                  notSoldDays +
                  "<br>" +
                  "刊登时间：" +
                  Format(d.listingTimeMin, "yyyy-MM-dd") +
                  "~" +
                  Format(d.listingTimeMax, "yyyy-MM-dd") +
                  "<br>" +
                  "listing总销量：" +
                  soldNumsMin +
                  "~" +
                  soldNumsMax +
                  "<br>" +
                  "近7日销量：" +
                  currentSevenDaysSalesMin +
                  "~" +
                  currentSevenDaysSalesMax +
                  "<br>" +
                  "价格：" +
                  priceMin +
                  "~" +
                  priceMax +
                  "<br>" +
                  "在线库存：" +
                  stockMin +
                  "~" +
                  stockMax
                let remarkTargetsName = ""
                if (d.remarkTargetsName.length > 12) {
                  remarkTargetsName += d.remarkTargetsName.slice(0, 12) + "..."
                } else {
                  remarkTargetsName = d.remarkTargetsName
                }
                return `<div lay-tips="${tipStr}">${remarkTargetsName}</div>`
              },
            },
            {
              field: "itemIdStr",
              title: "调价对象二",
              templet: function (d) {
                const itemIdArr = d.itemIdStr ? d.itemIdStr.split(",") : []
                if (itemIdArr.length) {
                  return `<div lay-tips="${d.itemIdStr}">${itemIdArr.length}</div>`
                } else {
                  return `<div>${itemIdArr.length}</div>`
                }
              },
            },
            {
              field: "weekDay",
              title: "执行日期(周)",
              templet: function (d) {
                let weekDay = d.weekDay
                  .split(",")
                  .map(item => {
                    let _item = item - 1
                    return _item == "0" ? 7 : _item
                  })
                  .join(",")
                return `每周${weekDay},每天 ${d.excecuteTime}点`
              },
            },
            {
              field: "startDay",
              title: "周期起止时间",
              width: 200,
              templet: function (d) {
                const str = Format(d.startDay, "yyyy-MM-dd") + " ~ " + Format(d.endDay, "yyyy-MM-dd")
                return str
              },
            },
            {
              field: "remarkSiteName",
              title: "备注站点",
              templet: function (d) {
                if (d.remarkSiteName.length > 15) {
                  return `<div  lay-tips="${d.remarkSiteName}">${d.remarkSiteName.slice(0, 15)}...</div>`
                } else {
                  return `<div>${d.remarkSiteName}</div>`
                }
              },
            },
            {
              field: "remarkWarehouseId",
              title: "备注仓库类型",
              templet: function (d) {
                const obj = {
                  0: "国内仓",
                  1: "虚拟仓",
                  2: "海外仓",
                }
                return obj[d.remarkWarehouseId] || ""
              },
            },
            {
              field: "remark",
              title: "备注说明",
              templet: function (d) {
                if (d.remark.length > 15) {
                  return `<div  lay-tips="${d.remark}">${d.remark.slice(0, 15)}...</div>`
                } else {
                  return `<div>${d.remark}</div>`
                }
              },
            },
            { field: "creator", title: "创建人" },
            { field: "modifier", title: "修改人" },
            { title: "操作", align: "center", toolbar: "#ebay_autoAdjustPrice_toolbar", width: 180 },
          ],
        ],
        limits: [100, 200, 500],
        limit: 100,
        page: true,
        done: function (_, _, count) {
          // table总数量
          $("#ebay_autoAdjustPrice_total").text(count)
          _this.tableToor()
          _this.statusCheckbox()
        },
      })
    },
    // table 工具栏
    tableToor: function () {
      let _this = this
      table.on("tool(ebay_autoAdjustPrice_table)", function (obj) {
        const { data, event, tr } = obj
        switch (event) {
          case "store":
            _this.setStore(data, event, tr)
            break
          case "viewHistory":
            _this.viewHistory(data, event, tr)
            break
          case "edit":
            _this.editRule(data, event, tr)
            break
          case "delete":
            _this.delRule([data.id], tr)
            break
          default:
            break
        }
      })
    },
    statusCheckbox: function () {
      // 更新规则状态
      let _this = this
      form.on("switch(ebay_autoAdjustPrice_status_checkbox)", function (data) {
        let id = data.value,
          status = data.elem.checked == true ? 1 : 0
        let checked = data.elem.checked
        let popIndex = layer.open({
          title: "提示",
          icon: 7,
          btn: ["确认", "取消"],
          content: "确定要修改此规则状态吗？",
          yes: function () {
            _this
              .updateRuleStatusAjax({ id: id, status: status })
              .then(function (result) {
                layer.msg(result, { icon: 1 })
                //  $("#ebay_autoAdjustPrice_search").click()
                layer.close(popIndex)
              })
              .catch(err => {
                layer.msg(err, { icon: 2 })
                //  $("#ebay_autoAdjustPrice_search").click()
              })
          },
          btn2: function () {
            data.elem.checked = !checked
            form.render()
          },
          cancel: function () {
            data.elem.checked = !checked
            form.render()
          },
        })
      })
    },
    // 监听tab
    handleTab: function () {
      element.on("tab(ebay_autoAdjustPrice_tab)", function (data) {
        $("#ebay_autoAdjustPrice_search").click()
      })
    },

    addRule: function () {
      const _this = this
      $("#ebay_autoAdjustPrice_add").click(function () {
        _this.editRule({}, "add")
      })
    },

    // 弹窗
    editRule: function (data = {}, type, tr) {
      const _this = this
      const typeName = {
        add: "添加规则",
        viewHistory: "查看规则",
        edit: "编辑规则",
      }
      layer.open({
        title: typeName[type],
        type: 1,
        area: ["1000px", "70%"],
        btn: type === "viewHistory" ? "" : ["保存", "关闭"],
        content: "加载中...",
        success: function (layero) {
          _this.remarkTargetsNameAjax().then(res => {
            laytpl($("#ebay_autoAdjustPrice_addrules").html()).render(data, function (html) {
              $(layero).find(".layui-layer-content").html(html)
            })
            commonRenderSelect("ebay_autoAdjustPrice_addrules_remarkTargetsName", res, { name: "name", code: "name", selected: data.remarkTargetsName })
            // 刊登时间
            //日期选择器
            laydate.render({
              elem: "#ebay_autoAdjustPrice_addrules_listingtime",
              value: data.listingTimeMin ? Format(data.listingTimeMin, "yyyy-MM-dd") + " - " + Format(data.listingTimeMax, "yyyy-MM-dd") : "",
              range: true,
            })
            // 每次执行时间
            const hourArr = Object.keys(Array.apply(null, { length: 24 })).map((_, index) => ({ name: index + "点", code: index }))
            commonRenderSelect("ebay_autoAdjustPrice_addrules_executTime", hourArr, { name: "name", code: "code", selected: data.excecuteTime })
            // 周期起止时间
            laydate.render({
              elem: "#ebay_autoAdjustPrice_addrules_timeLimit",
              type: "date",
              value: data.startDay ? Format(data.startDay, "yyyy-MM-dd") + " - " + Format(data.endDay, "yyyy-MM-dd") : "",
              range: true,
              done: function (value, date, endDate) {
                const start = new Date(value.split(" - ")[0]).getTime()
                const end = new Date(value.split(" - ")[1]).getTime()
                if (end - start >= 60 * 60 * 24 * 1000 * 27) {
                  return layer.msg("时间范围28天,请重新选择", { icon: 7 })
                }
              },
            })
            // textarea
            $("#ebay_autoAdjustPrice_addrules_form").find("textarea[name=itemIdStr]").val(data.itemIdStr)
            $("#ebay_autoAdjustPrice_addrules_form").find("textarea[name=remark]").val(data.remark)

            // 站点
            const _remarkSiteName = data.remarkSiteName || ""
            formSelects.data("ebay_autoAdjustPrice_addrules_site", "local", {
              arr: _this.siteList.map(item => ({ ...item, selected: _remarkSiteName.split(",").includes(item.name) ? "selected" : "" })),
            })
            _this.showPercentUnit(layero)
            if (data.floatType == "1") {
              layero.find(".percentUnit").hide()
            }
            form.render()
          })
        },
        yes: function (index, layero) {
          // 校验必填项
          const formDom = $("#ebay_autoAdjustPrice_addrules_form")
          let formData = serializeObject(formDom)
          // 规则名称
          if (formData.ruleName === "") return layer.msg("请填写规则名称")
          if (!formDom.find("input[name=floatType]:checked").val()) return layer.msg("请选择调价方式")
          if (formData.floatNum === "") return layer.msg("请填写调价幅度")
          if (formData.grossProfitRateMax === "") return layer.msg("请填写毛利率上限")
          if (formData.grossProfitRateMin === "") return layer.msg("请填写毛利率下限")
          if (formData.remarkTargetsName === "") return layer.msg("请选择调价对象名称")
          if (!formDom.find("input[name=weekDay]:checked").length) return layer.msg("请填写每周执行日期")
          if (formData.excecuteTime === "") return layer.msg("请填写每次执行时间")
          if (formData.day === "") return layer.msg("请填写周期起止时间")

          // 刊登时间
          if (formData.listingTime) {
            formData.listingTimeMin = new Date(formData.listingTime.split(" - ")[0] + " 00:00:00").getTime()
            formData.listingTimeMax = new Date(formData.listingTime.split(" - ")[1] + " 23:59:59").getTime()
          }else{
            formData.listingTimeMin = ''
            formData.listingTimeMax = ''
          }
          delete formData.listingTime
          // 周期起止时间
          formData.startDay = new Date(formData.day.split(" - ")[0] + " 00:00:00").getTime()
          formData.endDay = new Date(formData.day.split(" - ")[1] + " 23:59:59").getTime()
          if (formData.endDay - formData.startDay >= 60 * 60 * 24 * 1000 * 27) {
            return layer.msg("时间范围28天,请重新选择")
          }
          delete formData.day
          formData.floatPositive = formData.floatPositive === "true" ? true : false
          if (type === "add") {
            _this.createRuleAjax(formData).then(res => {
              layer.msg(res, { icon: 1 })
              $("#ebay_autoAdjustPrice_search").click()
              layer.close(index)
            })
          } else {
            let params = { ...data, ...formData }
            _this.updateRuleAjax(params).then(res => {
              layer.msg(res, { icon: 1 })
              $("#ebay_autoAdjustPrice_search").click()
              layer.close(index)
            })
          }
        },
      })
    },

    delRule: function (ids, tr) {
      let popIndex = layer.confirm("确定要删除此条规则吗？", function () {
        commonReturnPromise({
          url: ctx + "/ebayAutoModifyPriceRule/deleteRulesByIdList",
          params: JSON.stringify(ids),
          type: "post",
          contentType: "application/json;charset=UTF-8",
        })
          .then(function (result) {
            layer.msg(result, { icon: 1 })
            $("#ebay_autoAdjustPrice_search").click()
            layer.close(popIndex)
          })
          .catch(err => layer.msg(err, { icon: 2 }))
      })
    },

    viewHistory: function (data, event, tr) {
      let _this = this
      this.viewHistoryAjax(data.id).then(res => {
        layer.open({
          title: "查看修改记录",
          type: 1,
          area: ["1000px", "50%"],
          offset: "100px",
          content: $("#ebay_autoAdjustPrice_historyTpl").html(),
          success: function (layero) {
            table.render({
              elem: "#ebay_autoAdjustPrice_history_table",
              id: "ebay_autoAdjustPrice_history_tableId",
              data: res.map((item, index) => ({ ...item, _index: index })),
              cols: [
                [
                  { field: "_index", title: "序号" },
                  { field: "ruleName", title: "规则名称", templet: "#ebay_autoAdjustPrice_history" },
                  {
                    field: "modifyTime",
                    title: "修改时间",
                    templet: function (d) {
                      return Format(d.modifyTime, "yyyy-MM-dd")
                    },
                  },
                  { field: "modifier", title: "修改人" },
                ],
              ],
              limits: [100, 200, 500],
              limit: 10000,
              page: false,
              done: function () {
                table.on("tool(ebay_autoAdjustPrice_history_table)", function (obj) {
                  const { data, event, tr } = obj
                  switch (event) {
                    case "viewHistory":
                      _this.editRule(JSON.parse(data.newData), event, tr)
                      break
                    default:
                      break
                  }
                })
              },
            })
          },
        })
      })
    },

    setStore: function (data, type, tr) {
      let _this = this
      this.storeRuleAjax(data.id).then(res => {
        layer.open({
          title: "设置店铺",
          type: 1,
          area: ["1000px", "50%"],
          offset: "100px",
          content: $("#ebay_autoAdjustPrice_storeTpl").html(),
          success: function (layero) {
            $(layero).find(".layui-layer-content").find(".rulename").text(data.ruleName)
            _this.storeRender(res, data.id)
            _this.addStore(data.id)
            _this.delStoreBtn(data.id)
          },
        })
      })
    },
    storeRender: function (res, id) {
      let _this = this
      table.render({
        elem: "#ebay_autoAdjustPrice_store_table",
        id: "ebay_autoAdjustPrice_store_tableId",
        data: res.map((item, index) => ({ ...item, _index: index })),
        cols: [
          [
            { type: "checkbox" },
            { field: "storeAcct", title: "店铺名" },
            { field: "creator", title: "创建人" },
            { field: "modifier", title: "修改人" },
            { title: "操作", align: "center", toolbar: "#ebay_autoAdjustPrice_store_toolbar", width: 180 },
          ],
        ],
        limits: [100, 200, 500],
        limit: 10000,
        page: false,
        done: function () {
          table.on("tool(ebay_autoAdjustPrice_store_table)", function (obj) {
            const { data, event, tr } = obj
            switch (event) {
              case "delete":
                _this.delStore([data.id], id)
                break
              default:
                break
            }
          })
        },
      })
    },
    addStore: function (id) {
      let _this = this
      $("#ebay_autoAdjustPrice_store_add").click(function () {
        layer.open({
          title: "添加店铺",
          type: 1,
          area: "800px",
          btn: ["保存", "取消"],
          content: $("#ebay_autoAdjustPrice_add_storeTpl").html(),
          success: function (layero) {},
          yes: function (index, layero) {
            const storeAcctStr = $(layero).find(".layui-layer-content").find("input[name=storeAcctStr]").val()
            if (storeAcctStr === "") {
              return layer.msg("请输入店铺名")
            } else {
              _this.addStoreAjax({ storeAcctStr, id }).then(res => {
                layer.msg(res, { icon: 1 })
                _this.storeRuleAjax(id).then(result => {
                  _this.storeRender(result, id)
                })
                $("#ebay_autoAdjustPrice_search").click()
                layer.close(index)
              })
            }
          },
        })
      })
    },
    delStoreBtn: function (id) {
      let _this = this
      $("#ebay_autoAdjustPrice_store_del").click(function () {
        const { data } = table.checkStatus("ebay_autoAdjustPrice_store_tableId")
        if (!data.length) return layer.msg("请选择", { icon: 7 })
        const idArr = data.map(item => item.id)
        _this.delStore(idArr, id)
      })
    },
    delStore: function (idArr, id) {
      let _this = this
      let popIndex = layer.confirm("确定要删除店铺吗？", function () {
        commonReturnPromise({
          url: ctx + "/ebayAutoModifyPriceRule/batchRemoveRuleStore",
          params: JSON.stringify(idArr),
          type: "post",
          contentType: "application/json;charset=UTF-8",
        })
          .then(function (result) {
            layer.msg(result, { icon: 1 })
            _this.storeRuleAjax(id).then(res => {
              _this.storeRender(res, id)
            })
            $("#ebay_autoAdjustPrice_search").click()
            layer.close(popIndex)
          })
          .catch(err => layer.msg(err, { icon: 2 }))
      })
    },

    showPercentUnit: function (layero) {
      form.on("radio(ebay_autoAdjustPrice_type)", function (obj) {
        if (obj.value === "2") {
          layero.find(".percentUnit").show()
        } else {
          layero.find(".percentUnit").hide()
        }
      })
    },

    //#region 接口 start
    // 获取默认值枚举接口
    storeAcctAjax: function () {
      return commonReturnPromise({
        url: ctx + "/sys/liststorebyplatcode.html?platCode=ebay",
        type: "post",
      })
    },
    siteAjax: function () {
      return commonReturnPromise({
        url: ctx + "/onlineProductEbay/getAllEbaySiteAndPromotionName.html",
      })
    },
    creatorAjax: function () {
      return commonReturnPromise({
        url: ctx + "/ebayAutoModifyPriceRule/listAllRuleCreator",
      })
    },

    remarkTargetsNameAjax: function () {
      return commonReturnPromise({
        url: ctx + "/sysdict/getBizDictByCode?headCode=ebay_adjust_price",
      })
    },
    createRuleAjax: function (params) {
      return commonReturnPromise({
        url: ctx + "/ebayAutoModifyPriceRule/createRule",
        params: JSON.stringify(params),
        type: "post",
        contentType: "application/json;charset=UTF-8",
      })
    },
    updateRuleAjax: function (params) {
      return commonReturnPromise({
        url: ctx + "/ebayAutoModifyPriceRule/updateRule",
        params: JSON.stringify(params),
        type: "post",
        contentType: "application/json;charset=UTF-8",
      })
    },
    updateRuleStatusAjax: function ({ id, status }) {
      return commonReturnPromise({
        url: ctx + "/ebayAutoModifyPriceRule/updateRuleStatus",
        params: JSON.stringify({ id, status }),
        type: "post",
        contentType: "application/json;charset=UTF-8",
      })
    },
    viewHistoryAjax: function (ruleId) {
      return commonReturnPromise({
        url: ctx + `/ebayAutoModifyPriceRule/listEditLogByRuleId?ruleId=${ruleId}`,
      })
    },
    storeRuleAjax: function (ruleId) {
      return commonReturnPromise({
        url: ctx + `/ebayAutoModifyPriceRule/listRuleStoreByRuleId?ruleId=${ruleId}`,
      })
    },
    addStoreAjax: function (params) {
      return commonReturnPromise({
        url: ctx + "/ebayAutoModifyPriceRule/addRuleStore",
        params: JSON.stringify(params),
        type: "post",
        contentType: "application/json;charset=UTF-8",
      })
    },
    //#endregion 接口 end
  }

  ebayAutoAdjustPrice.init()
})
