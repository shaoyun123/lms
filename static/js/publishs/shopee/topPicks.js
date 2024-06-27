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
  render_hp_orgs_users("#shop_topPicks_form")
  shopTopPicksRequiredName = {
    init: function () {
      this.handleTab()
      this.search()
      this.reset()
      this.handleRemoveItems()
      this.handleAdd()
      this.batchFilter()
      this.handleExport()
    },
    // 查询
    search: function () {
      let _this = this
      $("#shop_topPicks_search").click(function () {
        const formData = _this.getFormData()
        _this.tableRender(formData)
      })
    },
    getFormData: function () {
      const formData = serializeObject($("#shop_topPicks_form"))
      if (formData.storeAcctIds == "") {
        //没有选择店铺
        var acctIds = $("#shop_topPicks_form").find("select[_name=storeAcctIds]").attr("acct_ids")
        if (acctIds != null && acctIds != "") {
          formData.storeAcctIds = acctIds.split(",").map(Number)
        } else {
          formData.storeAcctIds = []
        }
      } else {
        formData.storeAcctIds = formData.storeAcctIds.split(",").map(Number)
      }
      formData.topPicksIds = formData.topPicksIds.length ? formData.topPicksIds.split(",").map(Number) : []
      return formData
    },
    // 重置
    reset: function () {
      $("#shop_topPicks_reset").click(function () {
        let formDom = $("#shop_topPicks_form")
        formDom[0].reset()
        formDom.find("select[name=orgId]").next().find("dl>dd:first-child").click()
      })
    },
    batchFilter: function () {
      const _this = this
      form.on("select(shop_topPicks_batchBtn_filter)", function (obj) {
        const { value } = obj
        const { data } = table.checkStatus("shop_topPicks_tableId")
        let topPicksIds = data.map(item => item.topPicksId).join(",")
        if (value == "1") {
          _this.batchOnAjax({ topPicksIds }).then(res => {
            _this.batchResult(res, true)
          })
        } else if (value == "2") {
          _this.batchOffAjax({ topPicksIds }).then(res => {
            _this.batchResult(res, false)
          })
        } else if (value == "3") {
          _this.batchDelAjax({ topPicksIds }).then(res => {
            let str = res
              .map(item => {
                let _str = `精选ID:${item.topPicksId},操作结果:${item.status ? "成功" : "失败"}${item.errMsg ? "," + item.errMsg : ""}`
                return _str
              })
              .join("<br>")
            layer.confirm(str)
            $("#shop_topPicks_search").click()
          })
        }
      })
    },
    batchResult: function (arr, status) {
      let str = arr
        .map(item => {
          let _str = `精选ID:${item.topPicksId},操作结果:${item.status ? "成功" : "失败"}${item.errMsg ? "," + item.errMsg : ""}`
          return _str
        })
        .join("<br>")
      let succArr = arr.filter(item => item.status).map(item => item.topPicksId)
      table.cache.shop_topPicks_tableId.some((item, index) => {
        if (succArr.includes(item.topPicksId)) {
          table.cache.shop_topPicks_tableId[index].active = status
          return true
        }
      })
      $("#shop_topPicks_table")
        .next()
        .find("tbody tr")
        .each(function () {
          if ($(this).find("input[name=layTableCheckbox]").prop("checked")) {
            let topPicksId = $(this).find('td[data-field="topPicksId"] div').text()
            if (succArr.includes(Number(topPicksId))) {
              $(this).find("input[name=active]").prop("checked", status)
            }
          }
        })
      form.render()
      layer.confirm(str)
    },
    tableRender: function (formData) {
      let _this = this
      table.render({
        elem: "#shop_topPicks_table",
        id: "shop_topPicks_tableId",
        url: "/lms/shopee/topPicks/listTopPicks",
        where: formData,
        method: "post",
        contentType: "application/json",
        cols: [
          [
            { type: "checkbox" },
            { field: "topPicksId", title: "精选ID" },
            { field: "topPicksName", title: "精选名称" },
            {
              field: "storeAcct",
              title: "店铺名称(shopId)",
              templet: function (d) {
                let str = d.storeAcct + "<br>(" + d.shopId + ")"
                return str
              },
            },
            { field: "active", title: "精选状态", templet: "#shop_topPicks_active" },
            {
              field: "listingNum",
              title: "listing数量",
              templet: function (d) {
                return `<div lay-event="itemIdsInfo" style="color:#1E90FF;cursor:pointer;">${d.listingNum}</div>`
              },
            },
            {
              field: "sales",
              title: "listing7/30/60/90",
              templet: function (d) {
                let str = `${d.sevenDaySales || "0"} /${d.thirtyDaySales || "0"} / ${d.sixtyDaySales || "0"}/ ${d.ninetyDaySales || "0"}`
                return str
              },
            },
            {
              field: "operator",
              title: "操作人",
              templet: function (d) {
                let str = `创建:${d.creator}<br>修改:${d.modifier || ""}`
                return str
              },
            },
            {
              field: "operateTime",
              title: "操作时间",
              templet: function (d) {
                let modifierTime = d.modifierTime ? Format(d.modifierTime, "yyyy-MM-dd hh:mm:ss") : ""
                let str = `创建:${Format(d.creatorTime, "yyyy-MM-dd hh:mm:ss")}<br>修改:${modifierTime}`
                return str
              },
            },
            { title: "操作", toolbar: "#shop_topPicks_toolbar" },
          ],
        ],
        limits: [100, 200, 500],
        limit: 100,
        page: true,
        done: function (_, _, count) {
          // table总数量
          $("#shop_topPicks_total").text(count)
          _this.tableToor()
          _this.changeStatus()
        },
      })
    },
    // table 工具栏
    tableToor: function () {
      let _this = this
      table.on("tool(shop_topPicks_table)", function (obj) {
        switch (obj.event) {
          case "itemIdsInfo":
            _this.handleSetItems(obj, obj.data)
            break
          case "edit":
            _this.handleSetPicks("edit", obj)
            break
          case "delete":
            _this.delPicks(obj)
            break
        }
      })
    },
    // 更新规则状态
    changeStatus: function () {
      const _this = this
      form.on("switch(shop_topPicks_active_filter)", function (data) {
        let topPicksId = data.value
        let storeAcctId = $(data.elem).data("storeacctid")
        let { checked } = data.elem
        _this
          .editAjax({ active: checked, topPicksId, storeAcctId })
          .then(res => {
            layer.msg("操作成功", { icon: 1 })
            let obj = {}
            table.cache.shop_topPicks_tableId.some((item, index) => {
              if (item.topPicksId == topPicksId) {
                obj = table.cache.shop_topPicks_tableId[index]
                table.cache.shop_topPicks_tableId[index].active = checked
                return true
              }
            })
            // 渲染
            let trDom = $(data.elem).parents("tr")
            trDom.find('[data-field="topPicksName"] div').text(res.topPicksName)
            let timeStr = `创建:${Format(obj.creatorTime, "yyyy-MM-dd hh:mm:ss")}<br>修改:${Format(res.modifyTime, "yyyy-MM-dd hh:mm:ss")}`
            trDom.find('[data-field="operateTime"] div').html(timeStr)
            let operatorStr = `创建:${obj.creator}<br>修改:${res.modifier}`
            trDom.find('[data-field="operator"] div').html(operatorStr)
          })
          .catch(err => {
            data.elem.checked = !checked
            layer.msg(err, { icon: 2 })
            form.render()
          })
      })
    },
    // 监听tab
    handleTab: function () {
      element.on("tab(shop_topPicks_tab)", function () {
        $("#shop_topPicks_search").click()
      })
    },
    // 一键移除listing
    handleRemoveItems: function () {
      $("#shop_topPicks_remove").click(function () {
        const ids = $("#shop_topPicks_removeItems").val()
        const idList = ids === "" ? [] : ids.split(",")
        if (!idList.length) return layer.msg("请输入listing的item_id")
        commonReturnPromise({
          url: "/lms/shopee/topPicks/removeItem",
          contentType: "application/json",
          type: "post",
          params: JSON.stringify(idList),
        }).then(res => {
          $("#shop_topPicks_search").click()
          const failList = res.filter(item => !item.status)
          if (!failList.length) {
            layer.msg("操作成功", { icon: 1 })
          } else {
            layer.open({
              title: "失败信息",
              type: 1, //不加该属性,就会出现[object Object]
              area: ["700px", "600px"],
              btn: ["关闭"],
              id: "shop_topPicks_removeItems_fail_id",
              content: $("#shop_topPicks_removeItems_fail").html(),
              success: function () {
                $('#shop_topPicks_removeItems_fail_total').text(failList.length)
                table.render({
                  elem: "#shop_topPicks_removeItems_fail_table",
                  id: "shop_topPicks_removeItems_fail_table",
                  data: failList,
                  cols: [
                    [
                      { field: "topPicksId", title: "精选ID", width: 100 },
                      // { field: "topPicksName", title: "精选名称", },
                      { field: "storeAcct", title: "店铺名称", width: 100 },
                      { field: "errMsg", title: "错误信息", templet: d => `<div class="fRed">${d.errMsg}</div>` },
                    ],
                  ],
                  page: false,
                  done: function (_, _, count) {},
                })
              },
            })
          }
        })
      })
    },
    // 新增
    handleAdd: function () {
      const _this = this
      $("#shop_topPicks_add").click(function () {
        _this.handleSetPicks()
      })
    },
    handleExport: function () {
      const _this = this
      $("#shop_topPicks_export").click(function (data) {
        loading.show()
        transBlob({
          url: "/lms/shopee/topPicks/exportExcel",
          fileName: "shopeeTopPicks.xlsx",
          contentType: "application/json;charset=UTF-8",
          formData: JSON.stringify(_this.getFormData()),
        })
          .then(function (result) {
            loading.hide()
            // layer.msg('操作成功', { icon: 1 })
          })
          .catch(function (err) {
            layer.msg(err, { icon: 2 })
          })
      })
    },
    // 新增，修改精选
    handleSetPicks: function (type = "add", trObj = {}) {
      let obj = trObj.data || {}
      const _this = this
      let popIndex = layer.open({
        title: type === "add" ? "新增精选活动" : "修改精选活动",
        type: 1, //不加该属性,就会出现[object Object]
        area: ["600px", "380px"],
        btn: ["保存", "关闭"],
        id: "shop_topPicks_setPicks_tpler",
        content: $("#shop_topPicks_setPicks_tpl").html(),
        success: function (layero) {
          laytpl($("#shop_topPicks_setPicks_tpl").html()).render({ type, active: true, topPicksName: "", ...obj }, function (html) {
            layero.find(".layui-layer-content").html(html)
          })
          if (type === "add") {
            // 获取店铺列表
            _this.getStoreListAjax().then(res => {
              commonRenderSelect("shop_topPicks_setPicks_storeAcctId", res, { name: "storeAcct", code: "id" }).then(() => form.render())
            })
          }
          form.render()
        },
        yes: function (index, layero) {
          let formData = serializeObject($("#shop_topPicks_setPicks_form"))
          if (formData.topPicksName === "") return layer.msg("请输入精选名称")
          if (formData.storeAcctId === "" && !obj.storeAcctId) return layer.msg("请选择店铺")
          formData.active = formData.active === "on" ? true : false
          if (type === "add") {
            formData.itemIdList = formData.itemIdList
              .split(",")
              .map(Number)
              .filter(item => !!item)
            _this.addAjax(formData).then(res => {
              layer.msg("新增成功", { icon: 1 })
              layer.close(index)
              $("#shop_topPicks_search").click()
            })
          } else {
            _this.editAjax({ topPicksId: obj.topPicksId, storeAcctId: obj.storeAcctId, ...formData }).then(res => {
              layer.msg("保存成功", { icon: 1 })
              table.cache.shop_topPicks_tableId.some((elem, i) => {
                if (elem.topPicksId == obj.topPicksId) {
                  table.cache.shop_topPicks_tableId[i] = { ...table.cache.shop_topPicks_tableId[i], ...res }
                  return true
                }
              })
              // 渲染
              $(trObj.tr).find('[data-field="active"] input').prop("checked", res.active)
              $(trObj.tr).find('[data-field="topPicksName"] div').text(res.topPicksName)
              let timeStr = `创建:${Format(obj.creatorTime, "yyyy-MM-dd hh:mm:ss")}<br>修改:${Format(res.modifyTime, "yyyy-MM-dd hh:mm:ss")}`
              $(trObj.tr).find('[data-field="operateTime"] div').html(timeStr)
              let operatorStr = `创建:${obj.creator}<br>修改:${res.modifier}`
              $(trObj.tr).find('[data-field="operator"] div').html(operatorStr)
              form.render()
              layer.close(index)
            })
          }
        },
      })
    },
    delPicks: function (obj) {
      const _this = this
      if (!obj.data.active) {
        let popIndex = layer.confirm("删除后，shopee后台将不再显示该精选活动，且不可恢复，确定继续删除嘛?", function () {
          const { storeAcctId, topPicksId } = obj.data
          _this.delAjax({ storeAcctId, topPicksId }).then(function (result) {
            layer.msg(result, { icon: 1 })
            // 更新数据
            obj.del()
            let total = $("#shop_topPicks_total").text()
            if (total === "1") {
              $("#shop_topPicks_search").click()
            } else {
              let curTotal = total - 1
              $("#shop_topPicks_total").text(total - 1)
              $("#shop_topPicks_table").next().find(".layui-laypage-count").text(`共 ${curTotal} 条`)
            }
            layer.close(popIndex)
          })
        })
      } else {
        layer.msg("开启状态的精选活动不支持删除", { icon: 7 })
      }
    },
    // 设置itemids
    handleSetItems: function (trObj = {}, obj = {}) {
      const _this = this
      const { storeAcctId, topPicksId } = obj
      let porIndex = layer.open({
        title: "设置商品",
        type: 1, //不加该属性,就会出现[object Object]
        area: ["80%", "600px"],
        btn: ["保存", "关闭"],
        // id: "shop_topPicks_setItems_tpler",
        content: $("#shop_topPicks_setItems_tpl").html(),
        success: async function (layero) {
          // 获取已有itemId已有信息
          let _itemData = await _this.getItemInfoAjax({ itemIdList: "", storeAcctId, topPicksId })
          let itemData = _itemData.data
          _this.itemTableRender(itemData || [])
          // // 新增item
          _this.batchAddItem(storeAcctId, topPicksId)
        },
        yes: function (index, layero) {
          let itemList = table.cache.shop_topPicks_items_tableId.filter(item => JSON.stringify(item) !== "[]").map(item => ({ itemId: item.itemId, creator: item.creator }))
          // 保存数据好需要id
          _this.updateItemListAjax({ itemList, storeAcctId, topPicksId }).then(res => {
            layer.msg("保存成功", { icon: 1 })
            // 则不用刷新页面
            // table.cache.shop_topPicks_tableId.some((elem, i) => {
            //   if (elem.topPicksId == topPicksId) {
            //     table.cache.shop_topPicks_tableId[i].listingNum = 8
            //     return true
            //   }
            // })
            // $(trObj.tr).find('[data-field="listingNum"]').find("div").find("div").text(8)
            // 如果后端没返回具体信息，刷新页面
            $("#shop_topPicks_search").click()
            layer.close(porIndex)
          })
        },
      })
    },
    itemTableRender: function (data) {
      let _this = this
      table.render({
        elem: "#shop_topPicks_items_table",
        id: "shop_topPicks_items_tableId",
        data: data,
        cols: [
          [
            { field: "name", title: "标题/产品id", templet: "#shop_topPicks_items_name" },
            {
              field: "sales",
              title: "listing7/30/60/90历史销量",
              width: 200,
              templet: function (d) {
                let str = `${d.sevenSales || "0"} /${d.thirtySales || "0"} / ${d.sixtySales || "0"}/ ${d.ninetySales || "0"}`
                return str
              },
            },
            { field: "currentPrice", title: "税前价", width: "6%" },
            { field: "inflatedPriceOfCurrentPrice", title: "税后价", width: "6%" },
            {
              field: "sortBy",
              title: "效果",
              width: "8%",
              templet: function (d) {
                return `浏览:${d.views || 0}<br>收藏:${d.likes || 0}<br>评分:${d.ratingStar || 0}`
              },
            },
            { field: "creator", title: "添加人", width: "8%" },
            {
              field: "operateTime",
              title: "操作时间",
              width: "12%",
              templet: function (d) {
                let createTime = d.createTime ? Format(d.createTime, "yyyy-MM-dd") : ""
                let str = `刊登:${Format(d.listingTime, "yyyy-MM-dd")}<br>审核:${Format(d.auditTime, "yyyy-MM-dd")}<br>添加:${createTime}`
                return str
              },
            },
            { title: "操作", toolbar: "#shop_topPicks_items_tool", width: "10%" },
          ],
        ],
        page: false,
        done: function (_, _, count) {
          _this.itemTableToor()
          imageLazyloadAll()
          $("#shop_topPicks_items_total").text(count)
        },
      })
    },
    // itemTable 工具栏
    itemTableToor: function () {
      const _this = this
      table.on("tool(shop_topPicks_items_table)", function (obj) {
        switch (obj.event) {
          case "delete":
            obj.del()
            let count = Number($("#shop_topPicks_items_total").text())
            if (count === 1) {
              _this.itemTableRender([])
            } else {
              $("#shop_topPicks_items_total").text(count - 1)
            }
            break
        }
      })
    },
    batchAddItem: function (storeAcctId, topPicksId) {
      const _this = this
      $("#shop_topPicks_setItems_add").click(function () {
        // 获取内容
        let itemIds = $("#shop_topPicks_setItems_input").val()
        if (itemIds !== "") {
          let originItems = table.cache.shop_topPicks_items_tableId.map(item => item.itemId)
          let _itemIds = itemIds
            .split(",")
            .map(Number)
            .filter(item => !originItems.includes(item))
          if (_itemIds.length) {
            _this.getItemInfoAjax({ itemIdList: _itemIds.join(), storeAcctId, topPicksId }).then(res => {
              if (res.data.length) {
                table.cache.shop_topPicks_items_tableId = table.cache.shop_topPicks_items_tableId.concat(...res.data).filter(item => JSON.stringify(item) !== "[]")
                _this.itemTableRender(table.cache.shop_topPicks_items_tableId)
              }
              layer.msg(res.msg)
            })
          }
        } else {
          layer.msg("请输入itemId", { icon: 7 })
        }
      })
    },
    //#region 接口 start
    // 获取默认值枚举接口
    addAjax: function (obj) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/addTopPicks",
        type: "post",
        contentType: "application/json",
        params: JSON.stringify(obj),
      })
    },
    editAjax: function (obj) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/updateTopPicks",
        params: obj,
        type: "post",
      })
    },
    delAjax: function (obj) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/deleteTopPicks",
        type: "post",
        params: obj,
      })
    },
    getStoreListAjax: function () {
      return commonReturnPromise({
        url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
        type: "post",
        params: {
          roleNames: "shopee专员",
          orgId: "",
          salePersonId: "",
          platCode: "shopee",
        },
      })
    },
    getItemInfoAjax: function (obj) {
      return commonReturnPromiseRes({
        url: "/lms/shopee/topPicks/listItemDetail",
        params: obj,
        type: "post",
      })
    },
    updateItemListAjax: function (obj) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/updateTopPicksItem",
        type: "post",
        contentType: "application/json",
        params: JSON.stringify(obj),
      })
    },
    batchOnAjax: function (topPicksIds) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/batchOpenTopPicks",
        type: "get",
        params: topPicksIds,
      })
    },
    batchOffAjax: function (topPicksIds) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/batchCloseTopPicks",
        type: "get",
        params: topPicksIds,
      })
    },
    batchDelAjax: function (topPicksIds) {
      return commonReturnPromise({
        url: "/lms/shopee/topPicks/batchDeleteTopPicks",
        type: "get",
        params: topPicksIds,
      })
    },
    //#endregion 接口 end
  }

  shopTopPicksRequiredName.init()
})

// 精选名称 最多24
function shopTopPicksInputLen(dom) {
  let inputLen = $(dom).val().length
  $(dom).next().text(inputLen)
}
