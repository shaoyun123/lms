var shopeetableIns = {}
var shopeeAdjustTimeUnit
let shopeeAdjustPPAddonGrid = null
let shopeeAdjustAddonTimeUnit = null
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
  form.render("checkbox")
  form.render(null, "component-form-element")
  form.render(null, "component-form-group")
  form.render("select")
  render_hp_orgs_users("#adjustPriceSearchForm") //渲染部门销售员店铺三级联动
  //表格渲染结果
  //展示已知数据
  var data = new Object()
  let tableDataLen = 0
  if (shop_arr.length > 0) {
    data.idList = []
    for (var i = 0; i < shop_arr.length; i++) {
      data.idList.push(shop_arr[i].id)
    }
    data.idList = data.idList.join(",")
  }
  if (shop_arr.length > 0) {
    tableReload(data)
  }

  form.on("select(shopeeOnline_adjustPP_salesPerson)", function (data) {
    commonReturnPromise({
      url: ctx + "/sys/listStoreForRenderHpStoreCommonComponent.html",
      method: "post",
      params: {
        roleNames: "shopee专员",
        orgId: "",
        salePersonId: data.value,
        platCode: "shopee",
      },
    })
      .then(data => {
        let _data = data.map(item => ({ ...item, name: item.storeAcct, value: item.id }))
        formSelects.data("selectAttr_store", "local", { arr: _data })
        $("#shopeeOnline_adjustPP_store").attr("acct_ids", data.map(item => item.id).join())
      })
      .catch(err => layer.msg(err || err.msg, { icon: 2 }))
  })

  function tableReload(data) {
    shopeetableIns = table.render({
      elem: "#adjustPriceTable",
      method: "post",
      url: ctx + "/shopee/shopeeIsEnableProduct/prodAdjustPage",
      cols: [
        [
          { type: "checkbox", width: 30 },
          { field: "id", title: "id"},
          { field: "storeAcctId", title: "店铺id"},
          { field: "storeAcct", title: "店铺", width: "8%" },
          { field: "itemId", title: "item_id", width: "8%" },
          { field: "storeSku", title: "店铺SKU", width: "8%" },
          { field: "variId", title: "vari_id", width: "9%" },
          { field: "sSku", title: "商品SKU", width: "9%" },
          { field: "newListingPriceWithoutFloat", title: "原价定价", width: "5%"},
          { field: "listingPrice", title: "当前原价", width: "5%",templet:d=>{
            let  radioStr = shopee_adjust_price_getRadioStr(d.listingPriceRadio,d.newCurrPriceWithoutFloat)
            return `<div>${d.listingPrice}${radioStr}</div>`
            }
          },
          { field: "newlistPrice", title: "新原价", templet: "#newListingPriceTpl", width: "7%" },
          { field: "newCurrPriceWithoutFloat", title: "销售价定价", width: "6%" },
          { field: "currPrice", title: "当前销售价", width: "6%",templet:d=>{
            let radioStr = shopee_adjust_price_getRadioStr(d.currPriceRadio,d.newListingPriceWithoutFloat)
            return `<div>${d.currPrice}${radioStr}</div>`
          } },
          { field: "newPrice", title: "新的销售价", templet: "#newPriceTpl", width: "7%" },
          { field: "isPromotion", title: "是否促销", templet: "#isPromotionTpl", width: "6%" },
          { field: "promotionMsg", title: "促销状态", width: "5%" },
          { field: "result", title: "操作结果", width: "8%", align: "center" },
          { field: "isMultiSku", title: "是否多属性" },
          { field: "info", title: "相关值",templet:'#shopee_adjustPrice_info' },
        ],
      ],
      where: data,
      page: true,
      height: 500,
      id: "adjustPriceTable",
      limits: [3000, 5000, 10000],
      limit: 3000,
      created(res) {
        if (res.code === '0000') {
          let list = res.data
          for (let i = 0; i < list.length; ++i) {
            if(!!list[i].newListingPriceWithoutFloat){
              list[i].listingPriceRadio = ((list[i].listingPrice - list[i].newListingPriceWithoutFloat)/list[i].newListingPriceWithoutFloat * 100).toFixed(2)
              list[i].newListingPriceRadio = ((list[i].newListingPrice - list[i].newListingPriceWithoutFloat)/list[i].newListingPriceWithoutFloat * 100).toFixed(2)
            }
            if(!!list[i].newCurrPriceWithoutFloat){
              list[i].currPriceRadio = ((list[i].currPrice - list[i].newCurrPriceWithoutFloat)/list[i].newCurrPriceWithoutFloat * 100).toFixed(2)
              list[i].newCurrPriceRadio = ((list[i].newCurrPrice - list[i].newCurrPriceWithoutFloat)/list[i].newCurrPriceWithoutFloat * 100).toFixed(2)
            }
          }
        }
      },
      done: function (res, curr, count) {
        $("#shopee_online_adjustPP_card").find(".layui-table-body").css("overflow", "auto")
        $("[data-field='id']").css("display", "none")
        $("[data-field='storeAcctId']").css("display", "none")
        // $("[data-field='variId']").css('display', 'none');
        $("[data-field='isMultiSku']").css("display", "none")
        $("[data-field='info']").css("display", "none")
        $("#tolnum_span_shopee").text("共" + count + "条")
        tableDataLen = count
        $("#adjustPriceTable").next().find(".layui-table-body").css("height", "450px")
      },
    })
  }

  var active = {
    reload: function () {
      var data = new Object()
      data.storeAcctIdList = []
      data.sSkuList = []
      var logisAttrContents = formSelects.value("selectAttr_store", "val")
      var salePerson = $("#shopeeOnline_adjustPP_salesPerson").val()
      var skuStr = $.trim($("#adjustPriceSearchForm input[name='sSkuList']").val())
      var itemIdList = $("#shopeeOnline_adjustPP_itemId").val()
      if (skuStr != "" && skuStr != null) {
        data.sSkuList = $.trim(skuStr.split(","))
      }
      if ((logisAttrContents == null || logisAttrContents.length == 0) && salePerson != "") {
        //没有选择店铺 但是选择了销售人员
        var acctIds = $("#shopeeOnline_adjustPP_store").attr("acct_ids")
        if (acctIds != null && acctIds != "") {
          data.storeAcctIdList = acctIds
        }
      } else if (logisAttrContents != "" && logisAttrContents != null) {
        data.storeAcctIdList = logisAttrContents.join(",") //选择的店铺
      }
      if (itemIdList != "" && itemIdList != null) {
        data.itemIdList = itemIdList //itemId
      }
      let variIdList = $("#shopeeOnline_adjustPP_variId").val()
      if (variIdList != "" && variIdList != null) {
        data.variIdList = variIdList //variId
      }
      data.searchType = $("#shopee_adjustPrice_skuSearchType").val() //搜索类型

      //执行重载
      /* table.reload('adjustPriceTable', {
                where: data,
            });*/
      tableReload(data)
    },
  }
  $("#adjustPriceSearchBtn").click(function () {
    var type = $(this).data("type")
    active[type] ? active[type].call(this) : ""
  })
  $("#adjustPriceResetBtn").click(function () {
    $("#adjustPriceSearchForm input[name='sSku']").val("")
    formSelects.value("selectAttr", [])
  })
  //批量修改调价消息
  $("#batchUpadatePrice").click(function () {
    var arrStat = []
    var arr = []
    //获取表格行对象
    var trObj = $("#adjustPriceTable").next().find(".layui-table-body tbody").find("tr")
    var queryType = $("#isProcessDis").is(":checked")
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
      layer.msg("请选择需要调价的数据！")
      return
    }
    var arr = new Array()
    for (var i = 0; i < trObj.length; i++) {
      var obj = new Object()
      obj.id = $.trim(trObj.eq(i).find("td").eq(1).find("div").text()) //同步数据id
      obj.storeAcctId = $.trim(trObj.eq(i).find("td").eq(2).find("div").text()) //店铺id
      obj.prodStoreSku = $.trim(trObj.eq(i).find("td").eq(5).find("div").text()) //店铺sku
      obj.itemId = $.trim(trObj.eq(i).find("td").eq(4).find("div").text()) //平台商品Id
      obj.storeAcct = $.trim(trObj.eq(i).find("td").eq(3).find("div").text()) //店铺名称
      obj.variId = $.trim(trObj.eq(i).find("td").eq(6).find("div").text()) //variId
      obj.prodSSku = $.trim(trObj.eq(i).find("td").eq(7).find("div").text()) //商品sku
      obj.listingPrice = $.trim(trObj.eq(i).find("td input[name=listingPrice]").val()) //刊登原价
      obj.newListingPrice = $.trim(trObj.eq(i).find("td").eq(10).find("input").val()) //刊登原价
      obj.currPrice = $.trim(trObj.eq(i).find("td input[name=currPrice]").val()) //旧的折扣刊登价
      obj.newPrice = $.trim(trObj.eq(i).find("td").eq(13).find("input").val()) //新的折扣价格
      obj.isMultiSku = $.trim(trObj.eq(i).find("td").eq(17).find("div").text()) //刊登原价

      var ispromotion = $.trim(trObj.eq(i).find("td").eq(14).find("div").text())
      var msgPromotion = $.trim(trObj.eq(i).find("td").eq(15).find("div").text())

      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")

      obj.isModify = "0" //是否修改价格，不修改价格添加促销的时候需要把原来的促销价格以及原价添加上
      if (checkStat) {
        if (obj.newPrice == "0" || obj.newPrice == "0.0") {
          trObj.eq(i).find("td").eq(16).find(".layui-table-cell").html("<div style='color:red'>请重新输入价格</div>")
          arr.push(obj)
        } else if (obj.newPrice == "" || obj.newPrice == "0.00" || obj.newPrice == "0") {
          layer.msg("新刊登价不能为空")
          return false
        } else if (msgPromotion == "促销未同步" && ispromotion == "是") {
          trObj.eq(i).find("td").eq(16).find(".layui-table-cell").html("<div style='color:red'>请先同步listing促销</div>")
        } else if (Number(obj.newListingPrice) > Number(obj.listingPrice)) {
          if (queryType) {
            trObj.eq(i).find("td").eq(16).find(".layui-table-cell").html("<div style='color:red'>不处理原价加价</div>")
          } else {
            obj.isModify = "1"
          }
          arr.push(obj)
        } else {
          obj.isModify = "1"
          arr.push(obj)
        }
      }
      // else{
      // 	if(!(msgPromotion=='促销未同步' && ispromotion=='是')){
      // 			obj.isModify = '0';
      // 			arr.push(obj)
      // 	}
      // }
    }
    //以当前时间戳作为批次号
    var timestamp = new Date().getTime()
    $.ajax({
      beforeSend: function () {
        loading.show()
      },
      type: "POST",
      url: ctx + "/shopee/shopeeIsEnableProduct/batchAdjustPrice.html",
      data: JSON.stringify({ shopeeAdjustVariationPriceDTOList: arr, handleOriginalPriceMarkup: !queryType, batchNo: timestamp }),
      async: true,
      dataType: "json",
      contentType: "application/json;charset=UTF-8",
      success: function (returnData) {
        if (returnData.code == "0000") {
          loading.hide()
          layer.msg(returnData.msg)
          if (returnData.data.shopeeAdjustVariationPriceDTOList && returnData.data.shopeeAdjustVariationPriceDTOList.length) {
            addonModal(returnData.data.shopeeAdjustVariationPriceDTOList, queryType)
          } else {
            shopeeAdjustTimeUnit = setInterval(function () {
              sel(timestamp)
            }, 20000)
          }
        } else {
          loading.hide()
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        loading.hide()
        layer.msg("服务器正忙")
      },
    })
  })

  function sel(batchNo) {
    var trObj = $("#adjustPriceTable").next().find(".layui-table-body tbody").find("tr")
    var count = 0
    for (var i = 0; i < trObj.length; i++) {
      var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
      var resultMsg = trObj.eq(i).find("td").eq(14).find(".layui-table-cell").find("div").text()
      if ((resultMsg == "" || resultMsg == null) && checkStat) {
        count++
      }
    }
    if (count == 0) {
      clearInterval(shopeeAdjustTimeUnit)
      return
    }

    $.ajax({
      type: "POST",
      url: ctx + "/shopee/shopeeIsEnableProduct/selectResult.html",
      data: { batchNo: batchNo },
      async: true,
      dataType: "json",
      success: function (returnData) {
        if (returnData.code == "0000") {
          var data = returnData.data

          for (var i = 0; i < trObj.length; i++) {
            var itemId = $.trim(trObj.eq(i).find("td").eq(4).find("div").text()) //平台商品Id
            var variId = $.trim(trObj.eq(i).find("td").eq(6).find("div").text()) //variId
            var checkStat = trObj.eq(i).find("td").eq(0).find("div").find("input").is(":checked")
            var resultMsg = trObj.eq(i).find("td").eq(14).find(".layui-table-cell").find("div").text()

            var logMsg = data["TR_SHOPEE_ADJUSTPRICE_LOG" + itemId + variId]
            if ((resultMsg == "" || resultMsg == null) && checkStat) {
              if (logMsg == "调价成功") {
                trObj
                  .eq(i)
                  .find("td")
                  .eq(14)
                  .find(".layui-table-cell")
                  .html("<div style='color:blue'>" + logMsg + "</div>")
              } else if (logMsg != "" && logMsg != null && logMsg != "undefined") {
                trObj
                  .eq(i)
                  .find("td")
                  .eq(14)
                  .find(".layui-table-cell")
                  .html("<div style='color:red'>" + logMsg + "</div>")
              }
            }
          }
        }
      },
      error: function () {
        layer.msg("服务器正忙")
        clearInterval(shopeeAdjustTimeUnit)
      },
    })
  }

  //校验价格输入不能低于0

  $('input[name="newPriceInput"]').change(function () {
    if (parseFloat($(this).val()) < 0) {
      $(this).val("")
    }
  })
  /**
   * 一键写入价格值
   */
  $("#newPriceBtn").click(function () {
    var checkStatus = table.checkStatus("adjustPriceTable")
    if (checkStatus.data.length > 0 && shopeetableIns) {
      var layFilterIndex = "LAY-table-" + shopeetableIns.config.index
      var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
      var newPrice = $("#adjustPriceSearchForm input[name='newPriceInput']").val()
      //获取表格行对象
      var calType = $("#adjustPriceSearchForm select[name='calculateType']").val()
      var originPriceType = $("#adjustPriceSearchForm select[name='originPriceType']").val()
      if (newPrice !== "") {
        tableContainer.find('tbody input[name="layTableCheckbox"]:checked').each(function () {
          var tr = $(this).parents("tr")
          let originprice = '' // 
          let input  = ''  // input dom
          let fixedPrice = '' //定价
          if(originPriceType==0){
            originprice = tr.find('input[name=currPrice]').val()
            input = tr.find('td[data-field="newPrice"] div input')
            fixedPrice = tr.find('input[name=newListingPriceWithoutFloat]').val()
          }else if(originPriceType==1){
            originprice = tr.find('input[name=listingPrice]').val()
            input = tr.find('td[data-field="newlistPrice"] div input')
            fixedPrice = tr.find('input[name=newCurrPriceWithoutFloat]').val()
          }else if(originPriceType==2){
            originprice = tr.find('input[name=newCurrPriceWithoutFloat]').val()
            input = tr.find('td[data-field="newPrice"] div input')
            fixedPrice = tr.find('input[name=newCurrPriceWithoutFloat]').val()
          }else if(originPriceType==3){
            originprice = tr.find('input[name=newListingPriceWithoutFloat]').val()
            input = tr.find('td[data-field="newlistPrice"] div input')
            fixedPrice = tr.find('input[name=newListingPriceWithoutFloat]').val()
          }
          calculatePrice(calType, originprice, newPrice, input)
          // 计算比例
          if(input.val()===''){
            input.next().remove()
          }else{
            curRadio =( (input.val()-fixedPrice)/fixedPrice *100).toFixed(2)
            htmlStr = shopee_adjust_price_getRadioStr(curRadio,fixedPrice)
            input.next().remove()
            input.after(htmlStr)
          }
        })
      } else {
        layer.msg("请输入调整的价格")
      }
    } else {
      layer.msg("请选择需要调价的商品")
    }
  })
  //选自对应计算类型计算修改后的价格
  function calculatePrice(calType, originprice, newprice, input) {
    switch (calType) {
      case "1":
        var finalprice = (parseFloat(originprice) + parseFloat(newprice)).toFixed(2)
        input.val(finalprice) //新的价格
        break
      case "2":
        var finalprice = (parseFloat(originprice) - parseFloat(newprice)).toFixed(2)
        if (finalprice > 0) {
          input.val(finalprice) //新的价格
        } else {
          input.val("")
          layer.msg("价格调整不得低于0")
        }
        break
      case "3":
        var finalprice = (parseFloat(originprice) * parseFloat(newprice)).toFixed(2)
        input.val(finalprice) //新的价格
        break
      default:
        input.val(newprice)
    }
  }

  //加价/降价筛选功能 差价搜索
  $("#shop_adjustPricefilterPrice").click(function () {
    let formDom = $("#shop_adjustPrice_filtForm")
    let curCondition = {
      operatorType: formDom.find("select[name=operator]").val(),
      diffPrice: parseFloat(formDom.find("input[name=diffPrice]").val()),
    }
    if (!curCondition.operatorType) return showOrigin()
    var layFilterIndex = "LAY-table-" + shopeetableIns.config.index
    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
    tableContainer.find("tbody tr").each(function () {
      let newPrice = $(this).find('td[data-field="newPrice"] input').val()
      let originprice = $(this).find('td[data-field="currPrice"] div').text()
      let diffPrice = parseFloat(newPrice) - parseFloat(originprice)
      filterPrice($(this), diffPrice, curCondition)
    })
    changeTotal(tableContainer)
  })

  function filterPrice(tr, diffPrice, curCondition) {
    switch (curCondition.operatorType) {
      case "1":
        if ((diffPrice - curCondition.diffPrice).toFixed(2) > 0) {
          tr.css("display", "block")
        } else {
          uncheckedTrs(tr)
        }
        break
      case "2":
        if ((diffPrice - curCondition.diffPrice).toFixed(2) < 0) {
          tr.css("display", "block")
        } else {
          uncheckedTrs(tr)
        }
        break
      case "3":
        if (diffPrice.toFixed(2) == curCondition.diffPrice.toFixed(2)) {
          tr.css("display", "block")
        } else {
          uncheckedTrs(tr)
        }
        break
    }
  }

  // 将未显示的选中数据设置为未选中
  function uncheckedTrs(tr) {
    tr.find('input[name="layTableCheckbox"]').prop("checked", false)
    tr.css("display", "none")
    table.cache.adjustPriceTable[tr.data("index")].LAY_CHECKED = false
  }

  // 差价筛选 是否全选
  function isAllChecked() {
    var layFilterIndex = "LAY-table-" + shopeetableIns.config.index
    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
    let curTotalTr = tableDataLen - tableContainer.find('tbody tr[style="display: none;"]').length
    let checkedTr = tableContainer.find('tbody input[name="layTableCheckbox"]:checked').length
    tableContainer.find('thead input[name="layTableCheckbox"]').prop("checked", curTotalTr == checkedTr)
  }

  // 去除 筛选  差价清空
  $("#shop_adjustPriceOrigin").click(function () {
    let formDom = $("#shop_adjustPrice_filtForm")
    formDom[0].reset()
    showOrigin()
  })

  function showOrigin() {
    var layFilterIndex = "LAY-table-" + shopeetableIns.config.index
    var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]')
    tableContainer.find("tbody tr").each(function () {
      $(this).css("display", "block")
    })
    changeTotal(tableContainer)
  }
  // 改变总数量
  function changeTotal(tableContainer) {
    let hideNum = tableContainer.find('tbody tr[style="display: none;"]').length
    $("#tolnum_span_shopee").text(tableDataLen - hideNum)
    isAllChecked()
    form.render()
  }

  // 加购商品列表
  function addonModal(rowData, queryType) {
    rowData = rowData.map(item => ({ ...item, addOnPrice: item.newPrice, discount: '0.00' }))
    layer.closeAll()
    const index = layer.open({
      type: 1,
      id: Date.now(),
      title: "<div>加购折扣活动的加购商品列表<span class='ml10' style='font-size:12px'>请核对内容，确定后一下商品将从原加购活动中删除后重新添加！</span></div>",
      move: false,
      content: $("#shopee_adjustPP_addonModal").html(),
      area: ["1300px", "600px"],
      btn: ["确认", "关闭"],
      success: function (layero) {
        shopeeAdjustPPAddonGrid = {
          columnDefs: [
            {
              width: 80,
              headerCheckboxSelection: true,
              headerCheckboxSelectionFilteredOnly: true,
              checkboxSelection: true,
            },
            {
              headerName: "店铺",
              field: "storeAcct",
              wrapText: true,
              autoHeight: true,
              editable: false,
            },
            {
              headerName: "item_id",
              wrapText: true,
              autoHeight: true,
              field: "itemId",
              editable: false,
            },
            {
              wrapText: true,
              autoHeight: true,
              headerName: "店铺SKU",
              field: "prodStoreSku",
              editable: false,
            },
            {
              headerName: "商品SKU",
              wrapText: true,
              autoHeight: true,
              field: "prodSSku",
              editable: false,
            },
            {
              headerName: "vari_id",
              field: "variId",
              wrapText: true,
              autoHeight: true,
              editable: false,
            },
            {
              headerName: "现价(新的销售价)",
              field: "newPrice",
              wrapText: true,
              autoHeight: true,
              editable: false,
              cellRenderer: ({ data }) => {
                return `${data.newPrice} ${data.currency}`
              },
            },
            {
              headerName: "毛利率",
              field: "grossRate",
              wrapText: true,
              autoHeight: true,
              cellRenderer: ({ data }) => {
                return `<input type="number" name="grossRate" class="layui-input" value="${data.grossRate}" data-id="${data.id}" onblur="shopee_adjustPP_addon_update('grossRate',this)"/>`
              },
            },
            {
              headerName: "加购价格",
              field: "addOnPrice",
              wrapText: true,
              autoHeight: true,
              cellRenderer: ({ data }) => {
                return `<input type="number" name="addOnPrice" class="layui-input" value="${data.addOnPrice}"  data-id="${data.id}" onblur="shopee_adjustPP_addon_update('addOnPrice',this)"/>`
              },
            },
            {
              headerName: "加购折扣",
              field: "discount",
              wrapText: true,
              autoHeight: true,
              cellRenderer: ({ data }) => {
                return `<div class="disflex"><input type="number" name="discount" class="layui-input" value="${data.discount}"  data-id="${data.id}" onblur="shopee_adjustPP_addon_update('discount',this)"/><span>%</span></div>`
              },
            },
            {
              headerName: "限购数量",
              field: "addOnSubItemLimit",
              wrapText: true,
              autoHeight: true,
              cellRenderer: ({ data }) => {
                return `<input  type="number" name="addOnSubItemLimit" class="layui-input" value="${data.addOnSubItemLimit}" min="1" max="10000" onkeypress="commonKeyPressInputNotNega(event)" data-id="${data.id}" onblur="shopee_adjustPP_addon_update('addOnSubItemLimit',this)"/>`
              },
            },
            {
              headerName: "添加回原加购活动时间",
              field: "listingPriceAdded",
              cellRenderer: ({ data }) => {
                return data.listingPriceAdded ? "7天后" : "即刻"
              },
            },
          ],
          rowData,
          rowHeight: 40, //设置行高为40px,默认情况下是25px
          getRowNodeId: function (data) {
            return data.id
          },
          defaultColDef: {
            filter: true, //所有列开启筛选
            // editable: true, //单元格编辑
            sortAble: true,
            resizable: true, //是否可以调整列大小，就是拖动改变列大小
          },
          suppressPaginationPanel: false, // 自定义分页
          rowSelection: "multiple", // 设置多行选中
          suppressRowClickSelection: true,
          onGridReady: function (param) {
            //表格创建完成后执行的事件
            shopeeAdjustPPAddonGrid.api.sizeColumnsToFit() //调整表格大小自适应
          },
        }
        var gridDiv = document.querySelector("#shopee_adjustPP_addon_table")
        agGrid.LicenseManager.setLicenseKey("IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f")
        new agGrid.Grid(gridDiv, shopeeAdjustPPAddonGrid)
        // 取消修改原价和促销价
        $("#shopee_adjustPP_addon_cancel").click(function () {
          //选中数据操作成功的ID数组集合
          const selectedData = shopeeAdjustPPAddonGrid.api.getSelectedRows()
          if (!selectedData.length) return layer.msg("请选择数据")
          shopeeAdjustPPAddonGrid.api.updateRowData({ remove: selectedData })
        })
      },
      yes: function () {
        const params = []
        shopeeAdjustPPAddonGrid.api.forEachNodeAfterFilter(function (node) {
          params.push(node.data)
        })
        // 校验必填项
        if (params.some(item => item.addOnPrice === "")) {
          return layer.msg("请填写加购价格")
        }
        if (params.some(item => item.addOnSubItemLimit === "")) {
          return layer.msg("请填写限购数量")
        }
        if (!params.length) return
        console.log("params :>> ", params)
        //以当前时间戳作为批次号
        var timestamp = new Date().getTime()
        if (shopeeAdjustAddonTimeUnit) {
          clearInterval(shopeeAdjustAddonTimeUnit)
        }
        commonReturnPromise({
          url: "/lms/shopee/shopeeIsEnableProduct/batchAdjustPriceWithAddOnDeal",
          type: "post",
          contentType: "application/json;charset=UTF-8",
          params: JSON.stringify({ shopeeAdjustVariationPriceDTOList: params, handleOriginalPriceMarkup: !queryType, batchNo: timestamp }),
        }).then(res => {
          layer.msg(res, { icon: 1 })
          // shopeeAdjustAddonTimeUnit = setInterval(function () {
          //   shopee_adjustPP_searchAddonResult(timestamp)
          // }, 20000)
        })
      },
      end: function () {
        clearInterval(shopeeAdjustAddonTimeUnit)
      },
    })
  }
})

function shopee_adjustPP_searchAddonResult(batchNo) {
  let addonData = []
  shopeeAdjustPPAddonGrid.api.forEachNodeAfterFilter(function (node) {
    addonData.push(node.data)
  })
  if (addonData.every(item => !!item.result)) {
    clearInterval(shopeeAdjustAddonTimeUnit)
    return
  }
  commonReturnPromise({
    url: "/lms/shopee/shopeeIsEnableProduct/selectResult.html",
    type: "post",
    params: { batchNo },
  })
    .then(res => {
      let rowData = JSON.parse(JSON.stringify(shopeeAdjustPPAddonGrid.rowData))
      addonData.forEach(item => {
        const logMsg = res["TR_SHOPEE_ADJUSTPRICE_LOG" + item.itemId + item.variId]
        item.result = logMsg
        const curIndex = shopeeAdjustPPAddonGrid.rowData.findIndex(e => e.id == item.id)
        shopeeAdjustPPAddonGrid.rowData[curIndex] = item
      })
      shopeeAdjustPPAddonGrid.api.updateRowData({ update: addonData })
    })
    .catch(() => {
      clearInterval(shopeeAdjustAddonTimeUnit)
    })
}

async function shopee_adjustPP_addon_update(type, dom) {
  const id = $(dom).data("id")
  const curr = shopeeAdjustPPAddonGrid.rowData.filter(e => e.id == id)[0]
  const curIndex = shopeeAdjustPPAddonGrid.rowData.findIndex(e => e.id == id)
  let newRow = {
    ...curr,
    [type]: $(dom).val(),
  }
  if (type === "grossRate") {
    // 调接口
    const res = await commonReturnPromise({
      url: `/lms/shopee/shopeeIsEnableProduct/v2/calDiscountPriceByGrossProfitRate`,
      type: "post",
      contentType: "application/json;charset=UTF-8",
      params: JSON.stringify({ list: [{ variId: curr.variId }], grossProfitRate: newRow.grossRate }),
    })
    newRow = {
      ...newRow,
      discount: (((newRow.newPrice - res[0].newCurrPrice) / newRow.newPrice) * 100).toFixed(2),
      addOnPrice: res[0].newCurrPrice,
    }
  } else if (type === "discount") {
    newRow = {
      ...newRow,
      addOnPrice: (1 - newRow.discount / 100) * newRow.newPrice,
    }
  } else if ((type = "addOnPrice")) {
    newRow = {
      ...newRow,
      discount: (((newRow.newPrice - newRow.addOnPrice) / newRow.newPrice) * 100).toFixed(2) || "",
    }
    if ($(dom).val() === "") {
      $(dom).parents(".ag-cell").addClass("imgSelected")
    } else {
      $(dom).parents(".ag-cell").removeClass("imgSelected")
    }
  } else if (type === "addOnSubItemLimit") {
    if ($(dom).val() === "") {
      $(dom).parents(".ag-cell").addClass("imgSelected")
    } else {
      $(dom).parents(".ag-cell").removeClass("imgSelected")
    }
  }
  shopeeAdjustPPAddonGrid.rowData[curIndex] = newRow
  shopeeAdjustPPAddonGrid.api.updateRowData({ update: [newRow] })
}

function shopeeOnline_adjustPP_handleItemIds(itemIds, event) {
  let itemIdList = itemIds.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
  let itemIdLen = itemIdList.split(",").length

  if (itemIdLen > 1000) {
    itemIdList = itemIdList.split(",").slice(0, 1000).join(",")
    event.target.value = itemIdList
    return layer.alert("itemId数量不能超过1000个", { icon: 2 })
  } else {
    event.target.value = itemIdList
  }
}

function shopeeOnline_adjustPP_handleVariIds(variIds, event) {
  let variIdList = variIds.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
  let variIdLen = variIdList.split(",").length

  if (variIdLen > 3000) {
    variIdList = variIdList.split(",").slice(0, 3000).join(",")
    event.target.value = variIdList
    return layer.alert("vari_id数量不能超过3000个", { icon: 2 })
  } else {
    event.target.value = variIdList
  }
}

// 计算比例
function shopee_adjust_price_newcurrprice_radio(dom) {
  const trDom = $(dom).parents("tr");
  const curVal = $(dom).val();
  $(dom).next().remove();
  const fixedPrice = trDom
    .find("input[name=newCurrPriceWithoutFloat]")
    .val();
  if (curVal !== "") {
    const curRadio = (((curVal - fixedPrice) / fixedPrice) * 100).toFixed(2);
    const htmlStr = shopee_adjust_price_getRadioStr(curRadio,fixedPrice);
    $(dom).next().remove();
    $(dom).after(htmlStr);
  }
}

function shopee_adjust_price_newlistingprice_radio(dom) {
  const trDom = $(dom).parents("tr");
  const curVal = $(dom).val();
  $(dom).next().remove();
  const fixedPrice = trDom.find("input[name=newListingPriceWithoutFloat]").val();
  if (curVal !== "") {
    const curRadio = (((curVal - fixedPrice) / fixedPrice) * 100).toFixed(2);
    const htmlStr = shopee_adjust_price_getRadioStr(curRadio,fixedPrice);
    $(dom).after(htmlStr);
  }
}
function shopee_adjust_price_getRadioStr(radio,fixedPrice) {
  let htmlStr = "";
  if (!Number(fixedPrice)) {
    htmlStr = ''
  }else if (radio == 0) {
    htmlStr = `<div class="fGreen">-</div>`;
  } else if (radio > 0) {
    htmlStr = `<div class="fGreen"><i class="el-icon-top">${Math.abs(radio)}%</div>`;
  } else {
    htmlStr = `<div class="fRed"><i class="el-icon-bottom">${Math.abs(radio)}%</div>`;
  }
  return htmlStr;
}
