console.log("mt")
layui.use(["admin", "form", "layer", "table", "formSelects", "element", "laydate"], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    table = layui.table,
    formSelects = layui.formSelects,
    element = layui.element,
    laydate = layui.laydate,
    laypage = layui.laypage,
    $ = layui.$
  form.render(null, "component-form-element")
  element.render("breadcrumb", "breadcrumb")
  form.render("checkbox")

  form.on("submit(component-form-element)", function (data) {
    layer.msg(JSON.stringify(data.field))
    return false
  })

  form.render("select")
  var ckedsIdArr = JSON.parse(localStorage.getItem("ckedsIdArr"))
  if (ckedsIdArr.length > 0) {
    //展示已知数据
    table.render({
      elem: "#addOrDeletePromotionItem_Table",
      method: "post",
      url: ctx + "/shopee/shopeeIsEnableProduct/prodModifyPromoPage.html",
      where: {
        searchType: 1,
        storeAcctId: "",
        idList: ckedsIdArr.join(","),
      },
      cols: [
        [
          { type: "checkbox" },
          { field: "itemId", title: "item_id" },
          { field: "storeSku", title: "店铺SKU" },
          { field: "sSku", title: "商品SKU" },
          { field: "variId", title: "vari_id" },
          { field: "result", title: "操作结果", align: "center" },
        ],
      ],
      page: true,
      limit: 100,
      height: 500,
      id: "addOrDeletePromotionItem_Table",
      done: function (res, curr, count) {
        $("#tolnum_span_shopee_promotion").text("共" + count + "条")
      },
    })
  }

  /**
   * 获取当前选择商品可以添加的促销
   */
  var promotion_arr = []
  // if (shop_arr.every((item) => item.storeAcctId === shop_arr[0].storeAcctId)) {
  $.ajax({
    type: "post",
    url: ctx + "/shopee/shopeeDiscount/getItemLimitPromotion.html",
    data: JSON.stringify(shop_arr.map(item => item.itemId)),
    page: false,
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      promotion_arr = JSON.parse(JSON.stringify(data.data))
      for (var i = 0; i < promotion_arr.length; i++) {
        $("#stortAcctPromotion").append("<option value='" + promotion_arr[i].discountId + "'>" + promotion_arr[i].discountName + "</option>")
        form.render("select")
      }
    },
  })
  // }

  form.on("select(stortAcctPromotion)", function (data) {
    for (var i = 0; i < promotion_arr.length; i++) {
      const curr = promotion_arr[i]
      if (data.value == curr.discountId) {
        if(curr.startTime && curr.endTime){
          $("#stortAcctPromotion_time").val(Format(curr.startTime, "yyyy-MM-dd hh:mm:ss") + " - " + Format(curr.endTime, "yyyy-MM-dd hh:mm:ss"))
        }else{
          $("#stortAcctPromotion_time").val("")
        }
        $("#stortAcctPromotion_purchaseLimit").val(curr.purchaseLimit)
        if (!curr.purchaseLimit && !curr.weightMin && !curr.weightMax && !(curr.cnscCateNameList && curr.cnscCateNameList.length)) {
          $("#stortAcctPromotion_limit_info").html('<div style="line-height: 30px">无</div>')
        } else {
          let limitStr = ""
          if (curr.purchaseLimit) {
            limitStr += `<span class="mr10">数量=${curr.purchaseLimit};</span>`
          }
          if (curr.weightMax && !curr.weightMin) {
            limitStr += `<span class="mr10">重量(g): [0, ${curr.weightMax}];</span>`
          } else if (!curr.weightMax && curr.weightMin) {
            limitStr += `<span class="mr10">重量(g): [${curr.weightMin}, +&infin;];</span>`
          } else if (curr.weightMax && curr.weightMin) {
            limitStr += `<span class="mr10">重量(g): [${curr.weightMin}, ${curr.weightMax}];</span>`
          }
          if (curr.cnscCateNameList && curr.cnscCateNameList.length) {
            limitStr += "指定CNSC类目: "
            curr.cnscCateNameList.forEach(e => {
              limitStr += `<span class="mr10">${e},</span>`
            })
          }
          $("#stortAcctPromotion_limit_info").html(limitStr)
        }
      } else if (data.value === "") {
        $("#stortAcctPromotion_time").val("")
        $("#stortAcctPromotion_purchaseLimit").val("")
        $("#stortAcctPromotion_limit_info").text("")
      }
    }
  })

  /**
   * 批量添加
   */
  $("#addMainPromotionItem").click(function () {
    var pi_arr = []
    var isAddPrice = $("#isProcessDisTenDays").is(":checked")
    const checkedTrArr = table.checkStatus("addOrDeletePromotionItem_Table").data
    pi_arr = checkedTrArr.map(item => ({
      storeAcctId: item.storeAcctId,
      itemId: item.itemId,
      isAddPrice: isAddPrice,
      msgPromotionId: $("#stortAcctPromotion option:selected").val(),
      grossProfitRate: $("#stortAcctPromotion_grossProfitRate").val(),
      variId: item.variId == null || item.variId == "" ? 0 : item.variId,
    }))
    if (pi_arr.length <= 0) {
      layer.msg("请选择需要添加的商品")
      return
    }
    loading.show()
    $.ajax({
      type: "POST",
      url: ctx + "/shopee/shopeeDiscount/addMainPromotionItems.html",
      data: { pi_arr: JSON.stringify(pi_arr) },
      async: true,
      dataType: "JSON",
      success: function (data) {
        var trObj = $("#addOrDeletePromotionItem_Table").next().find(".layui-table-body tbody").find("tr")
        for (var i = 0; i < trObj.length; i++) {
          var shop_itemid = trObj.eq(i).find("td").eq(1).find("div").text()
          var shop_variId = trObj.eq(i).find("td").eq(4).find("div").text()
          if (shop_variId == "") {
            shop_variId = null
          }
          var msg = data.data[shop_itemid + "_" + shop_variId]
          if (msg != undefined) {
            if (msg == "加入促销队列成功") {
              trObj
                .eq(i)
                .find("td")
                .eq(5)
                .find(".layui-table-cell")
                .html("<div style='color:green'>" + msg + "</div>")
            } else {
              trObj.eq(i).find("td").eq(5).find(".layui-table-cell").html("<div style='color:red;posion: relative' class='errordata'>添加失败</div>")
              trObj
                .eq(i)
                .find("td")
                .eq(5)
                .find(".layui-table-cell")
                .append("<textarea class='layui-hide'>" + msg + "</textarea>")
            }
          }
        }
        loading.hide()
      },
    })
  })

  /**
   * 批量去除
   */
  $("#deleteMainPromotionItem").click(function () {
    var pi_arr = []
    const checkedTrArr = table.checkStatus("addOrDeletePromotionItem_Table").data
    pi_arr = checkedTrArr.map(item => ({
      storeAcctId: item.storeAcctId,
      itemId: item.itemId,
      variId: item.variId == null || item.variId == "" ? 0 : item.variId,
    }))
    if (pi_arr.length <= 0) {
      layer.msg("请选择需要去除的商品")
      return
    }

    loading.show()
    $.ajax({
      type: "POST",
      url: ctx + "/shopee/shopeeDiscount/deleteMainPromotionItem.html",
      data: { pi_arr: JSON.stringify(pi_arr) },
      async: true,
      dataType: "JSON",
      success: function (data) {
        var trObj = $("#addOrDeletePromotionItem_Table").next().find(".layui-table-body tbody").find("tr")
        for (var i = 0; i < trObj.length; i++) {
          var shop_itemid = trObj.eq(i).find("td").eq(1).find("div").text()
          var shop_variId = trObj.eq(i).find("td").eq(4).find("div").text()
          if (shop_variId == "") {
            shop_variId = null
          }
          var msg = data.data[shop_itemid + "_" + shop_variId]
          if (msg != undefined) {
            if (msg.indexOf("成功") > -1) {
              trObj
                .eq(i)
                .find("td")
                .eq(5)
                .find(".layui-table-cell")
                .html("<div style='color:green'>" + data.data[shop_itemid + "_" + shop_variId] + "</div>")
            } else {
              trObj.eq(i).find("td").eq(5).find(".layui-table-cell").html("<div style='color:red;posion: relative' class='errordata'>去除失败</div>")
              trObj
                .eq(i)
                .find("td")
                .eq(5)
                .find(".layui-table-cell")
                .append("<textarea class='layui-hide'>" + msg + "</textarea>")
            }
          }
        }
        loading.hide()
      },
    })
  })
})
$("body").on("mouseover", ".errordata", function () {
  var content = $(this).next("textarea").val()
  layer.tips(content, $(this), {
    time: 3000,
  })
})
