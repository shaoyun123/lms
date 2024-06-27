/**
 * smt刊登价预估
 */
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
  form.render()

  // 初始化
  aep_smtListing_init()

  function aep_smtListing_init() {
    const id = $('#smtPriceBtn').attr("data-id");
    const storeAcctId=$('#smtPriceBtn').attr("data-storeacctid")
    $('#aep_smtListing_estimatePriceTpl').data('storeacctid',storeAcctId)
    $('#aep_smtListing_estimatePriceTpl').find("input[name=prodPId]").val(id);
    const formObj = serializeObject($("#aep_smtListingPrice"))
    commonReturnPromise({
      type: "post",
      url: ctx + "/aliexpresslisting/listprice.html",
      params: formObj,
    }).then(res => {
      let tr = ""
      for (var i = 0; i < res.length; i++) {
        let bigTag = res[i].smtBigProduct ? '<span class="layui-bg-orange hp-badge ml5" title="大货">大</span>' : ""
        tr +=
          "<tr><td class='prodSSku'>" +
          res[i].sSku +
          "</td><td>" +
          "<input class='layui-input' name='cost' value='" +
          res[i].cost +
          "'></td><td>" +
          "<input class='layui-input' name='weight' value='" +
          res[i].weight +
          "'></td><td class='smtVolumeWeigh'>" +
          res[i].smtVolumeWeigh +
          "</td><td><div class='disFCenter'><div class='listingPrice'>" +
          "$" +
          res[i].listingPrice +
          "</div><div class='listingPriceCny'>" +
          "&yen;" +
          res[i].listingPriceCny +
          "</div></div></td><td><div class='disFCenter'><div class='finalPrice'>" +
          "$" +
          res[i].finalPrice +
          "</div><div class='finalPriceCny'>" +
          "&yen;" +
          res[i].finalPriceCny +
          "</div></div></td><td class='estimateProfit'>" +
          "&yen;" +
          res[i].estimateProfit +
          "</td>" +
          "<td><button class='layui-btn layui-btn-sm aep_upSkuPrice'>更新</button></td></tr>"
      }
      $("#aep_smtListingPriceTable tbody").html(tr)
    })
    aep_smtListing_getRegionCountry()
  }

  // 获取国家列表
  function aep_smtListing_getRegionCountry() {
    commonReturnPromise({
      url: ctx + "/aliexpress/publish/regionPriceCountry",
    }).then(data => {
      let str = ""
      const countryList = data.map((item, index) => ({
        code: Object.keys(item)[0],
        name: Object.values(item)[0],
        order: index + 1,
      }))
      countryList.forEach(item => {
        str += `<div class="w140">
						<input type="checkbox" name="adjustPriceCountry" lay-skin="primary" 
						lay-filter="aep_smtListing_checkCountry" 
						value="${item.code}" title="${item.name}(${item.code})"
						data-order="${item.order}" data-code="${item.code}" 
						data-name="${item.name}" />
					</div>`
      })
      $("#aep_smtListing_countryList").html(str)
      form.render()
    })
  }

  // 是否展开区域定价列表
  // function aep_smtListing_isShowRegionCountry(layero) {
  $("#aep_smtListing_country_header").click(function (obj) {
    let showCountryCardDom = $("#aep_smtListing_country_header")
    if (!showCountryCardDom.data("show")) {
      $('#aep_smtListing_estimatePriceTpl').find(".aep-smtListing-tohideIcon").show()
      $('#aep_smtListing_estimatePriceTpl').find(".aep-smtListing-toShowIcon").hide()
      $("#aep_smtListing_countryList").show()
      showCountryCardDom.data("show", true)
    } else {
      $('#aep_smtListing_estimatePriceTpl').find(".aep-smtListing-tohideIcon").hide()
      $('#aep_smtListing_estimatePriceTpl').find(".aep-smtListing-toShowIcon").show()
      $("#aep_smtListing_countryList").hide()
      showCountryCardDom.data("show", false)
    }
  })
  // }

  // 区域国家选中触发
  form.on("checkbox(aep_smtListing_checkCountry)", function (obj) {
    var { checked, dataset } = obj.elem
    let orderArr = []
    Array.from($("#aep_smtListingPriceTable").find("thead>tr>th")).forEach(item => {
      orderArr.push($(item).attr("data-order") || 0)
    })
    // 选中按顺序添加列
    if (checked) {
      let th = `<th data-field="${dataset.code}" data-order="${dataset.order}" data-code="${dataset.code}"
					data-name="${dataset.name}">
					<div class="w200">${aep_smtListing_countryThColTpl(dataset)}</div></th>>`
      let col = `<td data-field="${dataset.code}" class="taCenter" data-order="${dataset.order}">
					<div class="w200">${aep_smtListing_countryTdColTpl(dataset)}</div></td>`
      let _curIndex = orderArr.findIndex(item => Number(dataset.order) < Number(item))
      if (_curIndex == -1) {
        $("#aep_smtListingPriceTable").find("thead>tr>th").last().before(th)
        $("#aep_smtListingPriceTable").find("tbody>tr").find("[data-field=result]").before(col)
      } else {
        $("#aep_smtListingPriceTable").find("thead>tr>th").eq(_curIndex).before(th)
        $("#aep_smtListingPriceTable")
          .find(`tbody>tr :nth-child(${_curIndex + 1})`)
          .before(col)
      }
      // 取消删除
    } else {
      let _curIndex = orderArr.findIndex(item => Number(dataset.order) == Number(item))
      if (_curIndex != -1) {
        $("#aep_smtListingPriceTable").find("thead>tr>th").eq(_curIndex).remove()
        $("#aep_smtListingPriceTable")
          .find(`tbody>tr :nth-child(${_curIndex + 1})`)
          .remove()
      }
    }
    form.render()
  })

  function aep_smtListing_countryThColTpl(obj) {
    let thTpl = `<div>${obj.name}(${obj.code})</div>
			<div><form class="layui-form">
			<select name="regionPriceFixPriceByShipType" 
			lay-filter="aep_smtListing_regionPriceFixPriceByShipType">
			<option value="GENERALECONOMY">普货-经济</option>
			<option value="GENERALSIMPLE">普货-简易</option>
			<option value="GENERALSTANDARD">普货-标准</option>
			<option value="SPECIALECONOMY">特货-经济</option>
			<option value="SPECIALSIMPLE">特货-简易</option>
			<option value="SPECIALSTANDARD">特货-标准</option>
			</select>
			</form></div>
			<div class="disFCenter" style="fontSize:12px;color:#888"><div>定价</div><div>刊登价</div></div>`
    return thTpl
  }
  function aep_smtListing_countryTdColTpl(obj) {
    let tdTpl = `<div class="disFCenter"
			name="td_${obj.code}" data-code="${obj.code}" 
			data-order="${obj.order}" data-name="${obj.name}">
			<div></div>
			<div></div>
			</div>`
    return tdTpl
  }

  // 批量区域定价刊登价
  // function aep_smtListing_batchEstimateRegionPrice(storeAcctId) {
  $("#aep_smtListing_batchEstimateRegionPrice").click(function () {
    const storeAcctId=$('#aep_smtListing_estimatePriceTpl').data("storeacctid")
    let params = {}
    params.grossProfitRate = $("#aep_smtListingPrice").find("input[name=grossProfitRate]").val() //折扣率
    params.discountRate = $("#aep_smtListingPrice").find("input[name=discountRate]").val() //优惠幅度
    params.adjustType = $("#aep_smtListing_adjustType").val()
    const tbodyTrs = $("#aep_smtListingPriceTable").find("tbody tr")
    // 选中的国家
    const checkedCountryDom = $("#aep_smtListing_countryList").find("input[name=adjustPriceCountry]:checked")
    if (!checkedCountryDom.length) return layer.msg("请至少选择一个国家")
    const countryList = []
    checkedCountryDom.each(function () {
      countryList.push($(this).val())
    })
    // price为空或为0 不添加
    const skuList = []
    tbodyTrs.each(function () {
      const listingPrice = $(this).find(".finalPrice").text().replaceAll("$", "").replaceAll("¥", "")
      skuList.push({
        prodSSku: $(this).find(".prodSSku").text(),
        storeSubSku: "", //
        countryList: countryList,
        storeAcctId: Number(storeAcctId),
        listingPrice: listingPrice === "" ? null : Number(listingPrice),
      })
    })
    params.skuList = skuList
    params.type = "LISTING"
    commonReturnPromise({
      url: ctx + "/aliexpress/publish/regionPriceFixPrice",
      type: "post",
      contentType: "application/json;charset=UTF-8",
      // 通过type的值，在线/刊登
      params: JSON.stringify({ ...params }),
    }).then(res => {
      tbodyTrs.each(function () {
        var prodSSku = $(this).find(".prodSSku").text()
        let curData = res.filter(item => item.sSku == prodSSku)
        if (curData[0] && curData[0].countryList && curData[0].countryList.length) {
          curData[0].countryList.forEach(item => {
            $(this)
              .find(`td[data-field=${item.countryCode}] div[name=td_${item.countryCode}] div:first`)
              .html("$" + item.noCalculateDiscountRatePrice + "/" + "￥" + item.noCalculateDiscountRatePriceCny)
            $(this)
              .find(`td[data-field=${item.countryCode}] div[name=td_${item.countryCode}] div:last`)
              .html("$" + item.price + "/" + "￥" + item.priceCny)
          })
        }
      })
      res[0].countryList.forEach(item => {
        $("#aep_smtListingPriceTable").find(`thead th[data-code=${item.countryCode}]`).find("select[name=regionPriceFixPriceByShipType]").val(item.countryAdjustType)
      })
      form.render()
    })
  })
  // }
  // 	单个区域定价
  // function aep_smtListing_estimateRegionPrice(storeAcctId){
  form.on("select(aep_smtListing_regionPriceFixPriceByShipType)", function (data) {
    const storeAcctId=$('#aep_smtListing_estimatePriceTpl').data("storeacctid")
    let code = $(data.othis).parents("th").attr("data-code")
    let params = {}
    params.countryCode = code
    params.grossProfitRate = $("#aep_smtListingPrice").find("input[name=grossProfitRate]").val() //折扣率
    params.discountRate = $("#aep_smtListingPrice").find("input[name=discountRate]").val() //优惠幅度
    params.shipType = data.value
    const tbodyTrs = $("#aep_smtListingPriceTable").find("tbody tr") //获取表格选中行
    var skuList = []
    tbodyTrs.each(function () {
      const listingPrice = $(this).find(".finalPrice").text().replaceAll("$", "").replaceAll("¥", "")
      skuList.push({
        prodSSku: $(this).find(".prodSSku").text(),
        storeSubSku: "", //
        storeAcctId: Number(storeAcctId),
        listingPrice: listingPrice === "" ? null : Number(listingPrice),
      })
    })
    params.skuList = skuList
    commonReturnPromise({
      url: ctx + "/aliexpress/publish/regionPriceFixPriceByShipType",
      type: "post",
      params: JSON.stringify(params),
      contentType: "application/json;charset=UTF-8",
    }).then(res => {
      tbodyTrs.each(function () {
        var prodSSku = $(this).find(".prodSSku").text()
        let curData = res.filter(item => item.sSku == prodSSku && item.countryCode == code)
        if (curData[0]) {
          $(this)
            .find(`td[data-field=${code}] div[name=td_${code}] div:first`)
            .html("$" + curData[0].noCalculateDiscountRatePrice + "/" + "￥" + curData[0].noCalculateDiscountRatePriceCny)
          $(this)
            .find(`td[data-field=${code}] div[name=td_${code}] div:last`)
            .html("$" + curData[0].price + "/" + "￥" + curData[0].priceCny)
        }
      })
    })
  })
  // }

  form.on("submit(aep_smtListingPrice)", function (data) {
    layui.admin.load.show()
    $.ajax({
      type: "post",
      url: ctx + "/aliexpresslisting/listprice.html",
      data: data.field,
      dataType: "json",
      success: function (returnData) {
        layui.admin.load.hide()
        if (returnData.code == "0000") {
          $("#aep_smtListingPriceTable tbody")
            .find("tr")
            .each(function () {
              const prodSSku = $(this).find(".prodSSku").text()
              const curData = returnData.data.filter(item => item.sSku === prodSSku)
              if (curData.length) {
                // 赋值
                $(this).find("input[name=cost]").val(curData[0].cost) //成本
                $(this).find("input[name=weight]").val(curData[0].weight) //重量
                $(this)
                  .find(".listingPrice")
                  .html("$" + curData[0].listingPrice) //定价
                $(this)
                  .find(".listingPriceCny")
                  .html("￥" + curData[0].listingPriceCny) //定价 人民币
                $(this)
                  .find(".finalPrice")
                  .html("$" + curData[0].finalPrice) //刊登价
                $(this)
                  .find(".finalPriceCny")
                  .html("￥" + curData[0].finalPriceCny) //刊登价 人民币
                $(this)
                  .find(".estimateProfit")
                  .html("&yen;" + curData[0].estimateProfit) //预估利润
              }
            })
        } else {
          layer.msg(returnData.msg, { icon: 5 })
        }
      },
    })
    return false
  })
  form.on("select(aep_smtShippingType)", function (data) {
    $("#aep_smtListingPrice button[type=submit]").trigger("click")
  })
  //子SKU更新价格
  $("body").on("click", "#aep_smtListingPriceTable .aep_upSkuPrice", function () {
    var reqData = serializeObject($("#aep_smtListingPrice"))
    var trDom = $(this).parents("tr")
    reqData.cost = trDom.find("input[name=cost]").val()
    reqData.weight = trDom.find("input[name=weight]").val()
    reqData.prodSSku = trDom.find(".prodSSku").text()
    layui.admin.load.show()
    $.ajax({
      type: "post",
      url: ctx + "/aliexpresslisting/listprice.html",
      data: reqData,
      dataType: "json",
      success: function (returnData) {
        layui.admin.load.hide()
        if (returnData.code == "0000") {
          trDom.find(".listingPrice").html("$" + returnData.data[0].listingPrice)
          trDom.find(".listingPriceCny").html("￥" + returnData.data[0].listingPriceCny)
          trDom.find(".finalPrice").html("$" + returnData.data[0].finalPrice)
          trDom.find(".finalPriceCny").html("￥" + returnData.data[0].finalPriceCny)
          trDom.find(".estimateProfit").html("&yen;" + returnData.data[0].estimateProfit)
        } else {
          layer.msg(returnData.msg, { icon: 5 })
        }
      },
    })
  })
})
