// var temp_timeUnit;
layui.use(["admin", "form", "layer", "table", "formSelects", "element", "laydate"], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    table = layui.table,
    formSelects = layui.formSelects,
    $ = layui.$
  render_hp_orgs_users("#tem_is_enable_form") //渲染部门销售员店铺三级联动

  if (temp_timeUnit != null) {
    clearInterval(temp_timeUnit)
  }
  /**
   * 初始化shopee站点和促销信息
   */
  shopeeOnline_initShopeeSite() //初始化shopee站点下拉框
  function shopeeOnline_initShopeeSite() {
    $.ajax({
      type: "post",
      url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
      dataType: "json",
      success: function (returnData) {
        if (returnData.code == "0000") {
          var sites = []
          var siteList = returnData.data.siteList //站点
          $(siteList).each(function () {
            var a = { name: this.name, value: this.code }
            sites.push(a)
          })
          formSelects.data("tem_shopee_online_site_sel", "local", { arr: sites })
          form.render()
        } else {
          layer.msg(returnData.msg)
        }
      },
    })
  }
  form.render(null, "component-form-element")
  form.render(null, "component-form-group")
  form.render("select")
  //表格渲染结果
  //展示已知数据
  shopee_tem_is_enable_initTable()
  function shopee_tem_is_enable_initTable() {
    var data = new Object()
    if (shop_arr.length > 0) {
      data.idList = []
      for (var i = 0; i < shop_arr.length; i++) {
        data.idList.push(shop_arr[i].id)
        data.useStoreAcctId = false
      }
      data.idList = data.idList
    }
    if (shop_arr.length > 0) {
      tableReloda(data)
    }
  }
  function tableReloda(data) {
    if (temp_timeUnit != null) {
      clearInterval(temp_timeUnit)
    }
    table.render({
      elem: "#temp_is_enable_Table",
      method: "post",
      url: ctx + "/shopee/shopeeIsEnableProduct/upperAndLower.html",
      contentType: "application/json;charset=UTF-8",
      cols: [
        [
          { type: "checkbox" },
          { field: "id", title: "id", width: "10%" },
          { field: "storeAcctId", title: "店铺id", width: "10%" },
          { field: "pStoreSku", title: "店铺父SKU", width: "15%" },
          { field: "itemId", title: "item_id", width: "15%" },
          { field: "storeAcct", title: "店铺", width: "18%" },
          { field: "pSku", title: "商品父SKU", width: "17%" },
          { field: "salesSite", title: "站点", width: "15%" },
          { field: "prodStatus", title: "状态", width: "15%" },
          { field: "result", title: "操作结果", width: "15%", align: "center" },
        ],
      ],
      where: data,
      page: false,
      id: "temp_is_enable_Table",
      height: 500,
      limits: [10, 20, 50],
      limit: 10,
      done: function (res, curr, count) {
        $("[data-field='id']").css("display", "none")
        $("[data-field='storeAcctId']").css("display", "none")
        $("[data-field='prodStatus']").css("display", "none")
        $("#isENable_table_num").text("共" + count + "条")
      },
    })
  }
  var active = {
    reload: function () {
      var data = new Object()
      data.storeAcctIdList = []
      data.sSkuList = []
      data.siteIdList = []
      var skuStr = $.trim($("#tem_is_enable_form input[name='pSkuList']").val())
      if (skuStr != "" && skuStr != null) {
        data.sSkuList = skuStr.split(",")
      }
      var acctIdList = formSelects.value("selectAttr_store")
      if (acctIdList != null && acctIdList.length > 0) {
        //选择店铺了
        for (var i = 0; i < acctIdList.length; i++) {
          var logisAttr = acctIdList[i].value
          data.storeAcctIdList.push($.trim(logisAttr))
        }
      } else {
        var acctIds = $("#tem_is_enable_store").attr("acct_ids")
        if (acctIds != null && acctIds != "") {
          data.storeAcctIdList = acctIds.split(",")
        }
      }
      data.searchType = $("#tem_is_enable_form select[name='searchType']").val() //搜索类型
      var sites = formSelects.value("tem_shopee_online_site_sel")
      for (var i = 0; i < sites.length; i++) {
        var site = sites[i].value
        data.siteIdList.push($.trim(site))
      }
      data.useStoreAcctId = true
      tableReloda(data)
    },
  }
  $("#temp_is_enable_SearchBtn").click(function () {
    var type = $(this).data("type")
    active[type] ? active[type].call(this) : ""
  })
  $("#temp_is_enable_ResetBtn").click(function () {
    $("#temp_is_enable_SearchForm input[name='pSkuList']").val("")
    formSelects.value("selectAttr", [])
    formSelects.value("tem_shopee_online_site_sel", [])
  })

  $("#batchIEnableProd").click(function () {
    if (temp_timeUnit != null) {
      clearInterval(temp_timeUnit)
    }
    var arrStat = []
    var arr = []
    //获取表格行对象
    var trObj = $("#temp_is_enable_Table").next().find(".layui-table-body tbody").find("tr")

    for (var i = 0; i < trObj.length; i++) {
      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
      var obj = new Object()
      obj.id = $.trim(trObj.eq(i).find("td").eq(1).find("div").text()) //同步数据id
      //只修改被选中的商品信息
      if (checkStat) {
        arrStat[i] = obj
      }
    }
    if (arrStat == null || arrStat.length == 0) {
      layer.msg("请选择需要操作数据！")
      return
    }
    var arr = new Array()
    for (var i = 0; i < trObj.length; i++) {
      var obj = new Object()
      // obj.id = $.trim(trObj.eq(i).find("td").eq(1).find("div").text()) //同步数据id
      obj.storeAcctId = $.trim(trObj.eq(i).find("td").eq(2).find("div").text()) //店铺id
      obj.prodStoreSku = $.trim(trObj.eq(i).find("td").eq(3).find("div").text()) //店铺sku
      obj.itemId = $.trim(trObj.eq(i).find("td[data-field=itemId]").find("div").text()) //平台商品itemId
      obj.storeAcct = $.trim(trObj.eq(i).find("td").eq(5).find("div").text()) //店铺名称
      obj.prodPSku = $.trim(trObj.eq(i).find("td").eq(6).find("div").text()) //商品sku
      // obj.siteId = $.trim(trObj.eq(i).find("td").eq(7).find("div").text()) //站点
      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
      if (checkStat) {
        trObj.eq(i).find('td[data-field="result"]').find(".layui-table-cell").find("div").text("")
        arr.push(obj)
      }
    }
    if (!arr.length) return
    commonReturnPromise({
      url: ctx + "/shopee/shopeeIsEnableProduct/batchTempEnable.html",
      type: "post",
      contentType: "application/json",
      params: JSON.stringify({ itemInfoList: arr, type: "1" }),
    }).then(res => {
      layer.msg("请稍后查看操作结果")
      temp_timeUnit = setInterval(function () {
        selectResult(res)
      }, 5000)
    })
  })

  $("#batchNEnableProd").click(function () {
    if (temp_timeUnit != null) {
      clearInterval(temp_timeUnit)
    }
    var arrStat = []
    var arr = []
    //获取表格行对象
    var trObj = $("#temp_is_enable_Table").next().find(".layui-table-body tbody").find("tr")

    for (var i = 0; i < trObj.length; i++) {
      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
      var obj = new Object()
      obj.id = $.trim(trObj.eq(i).find("td").eq(1).find("div").text()) //同步数据id
      //只修改被选中的商品信息
      if (checkStat) {
        arrStat[i] = obj
      }
    }
    if (arrStat == null || arrStat.length == 0) {
      layer.msg("请选择需要操作数据！")
      return
    }
    var arr = new Array()
    for (var i = 0; i < trObj.length; i++) {
      var obj = new Object()
      // obj.id = $.trim(trObj.eq(i).find("td").eq(1).find("div").text()) //同步数据id
      obj.storeAcctId = $.trim(trObj.eq(i).find("td").eq(2).find("div").text()) //店铺id
      obj.prodStoreSku = $.trim(trObj.eq(i).find("td").eq(3).find("div").text()) //店铺sku
      obj.itemId = $.trim(trObj.eq(i).find("td[data-field=itemId]").find("div").text()) //平台商品itemId
      obj.storeAcct = $.trim(trObj.eq(i).find("td").eq(5).find("div").text()) //店铺名称
      obj.prodPSku = $.trim(trObj.eq(i).find("td").eq(6).find("div").text()) //商品sku
      // obj.siteId = $.trim(trObj.eq(i).find("td").eq(7).find("div").text()) //站点
      var Unlist = $.trim(trObj.eq(i).find("td").eq(8).find("div").text()) //站点
      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
      if (checkStat) {
        trObj.eq(i).find('td[data-field="result"]').find(".layui-table-cell").find("div").text("")
        if (Unlist === "UNLIST") {
          trObj.eq(i).find("td").eq(9).find(".layui-table-cell").html("<div style='color:green'>已是下架状态</div>")
        } else {
          arr.push(obj)
        }
      }
    }
    if (!arr.length) return
    commonReturnPromise({
      url: ctx + "/shopee/shopeeIsEnableProduct/batchTempEnable.html",
      type: "post",
      contentType: "application/json",
      params: JSON.stringify({ itemInfoList: arr, type: "0" }),
    }).then(res => {
      layer.msg("请稍后查看操作结果")
      temp_timeUnit = setInterval(function () {
        selectResult(res)
      }, 5000)
    })
  })
  function selectResult(batchNo) {
    commonReturnPromise({
      type: "POST",
      url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
      params: { batchNo },
    }).then(res => {
      var trObj = $("#temp_is_enable_Table").next().find(".layui-table-body tbody").find("tr")
      let emptyResult = false
      for (var i = 0; i < trObj.length; i++) {
        var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
        if (checkStat) {
          var itemId = $.trim(trObj.eq(i).find("td[data-field=itemId]").find("div").text()) //平台商品Id
          var resultMsg = trObj.eq(i).find('td[data-field="result"]').find(".layui-table-cell").find("div").text()
          var logMsg = res["TR_SHOPEE_TEM_IS_ENABLE:" + itemId]
          if (resultMsg == "" || resultMsg == null) {
            if (logMsg == "操作成功") {
              trObj
                .eq(i)
                .find('td[data-field="result"]')
                .find(".layui-table-cell")
                .html("<div style='color:blue'>" + logMsg + "</div>")
            } else if (logMsg != "" && logMsg != null && logMsg != "undefined") {
              trObj
                .eq(i)
                .find('td[data-field="result"]')
                .find(".layui-table-cell")
                .html("<div style='color:red'>" + logMsg + "</div>")
            } else {
              emptyResult = true
            }
          }
        }
      }
      if (!emptyResult) {
        clearInterval(temp_timeUnit)
      }
    })
  }
})
