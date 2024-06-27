layui.use(["admin", "table", "form", "element", "layer", "laytpl", "formSelects", "upload", "laydate"], function () {
  var admin = layui.admin,
    table = layui.table,
    element = layui.element,
    layer = layui.layer,
    laytpl = layui.laytpl,
    upload = layui.upload,
    laypage = layui.laypage,
    laydate = layui.laydate,
    formSelects = layui.formSelects,
    form = layui.form

  orderResendName = {
    init: async function () {
      const _this = this
      _this.PageEnum = await commonReturnPromise({
        url: "/lms/unauditorder/listenum.html",
        type: "post",
      })
      let data = JSON.parse(window.localStorage.getItem("orderCheckData"))
      var id = data ? data.id : ""
      $("#orderResend")
        .find(".layui-tab")
        .find("ul")
        .find("li")
        .each(function (index, item) {
          $(item).data("orderId", id)
        })
      // 订单金额的值是0，不能修改
      data.platOrderAmt = 0
      data.orderTimeCn = Format(data.orderTimeCn, "yyyy-MM-dd hh:mm:ss")
      _this.appendSelect($("#order_resend_editForm").find('select[name="warehouseId"]'), _this.PageEnum.prodWarehouses, "name", "value")
      form.val("order_resend_editForm", data)
      _this.getAllSiteAjax(data.platCode).then(res => {
        const platCodeNameArr = res.filter(item => item.code === data.siteId)
        if (platCodeNameArr.length) {
          $('#order_resend_editForm input[name="siteName"]').val(platCodeNameArr[0].name)
        }
      })
      _this.TableData = data.orderDetails
      _this.tableRender(_this.TableData)
      form.render()
      _this.addProducts()
      _this.orderResend()
    },
    PageEnum: null,
    TableData: null,
    // 添加商品
    addProducts: function () {
      const _this = this
      $("#order_resend_addProducts").click(async function () {
        var orginaldata = _this.getEditTableData(_this.TableData)
        var prodSku = $(this).siblings("input").val()
        if (prodSku !== "") {
          const returnData = await _this.getProductListAjax(prodSku)
          _this.addProductsModel(returnData, function (callback) {
            callback = callback.map(item => ({ ...item, imageUrl: item.image }))
            _this.TableData = orginaldata.concat(callback)
            _this.tableRender(_this.TableData)
          })
        } else {
          layer.msg("添加商品sku不能为空")
        }
      })
    },
    addProductsModel: function (data = {}, func) {
      const _this = this
      layer.open({
        type: 1,
        title: "添加商品",
        btn: ["添加商品", "关闭"],
        area: ["70%", "60%"],
        content: $("#pop_order_resend_addProducts").html(),
        success: function (layero, index) {
          table.render({
            elem: "#order_resend_addProducts_table",
            data: data,
            cols: [
              [
                { checkbox: true, width: 30 },
                { title: "图片", field: "imageUrl", templet: "#order_resend_add_product_img" },
                { title: "商品sku", field: "sSku" },
                { title: "父sku", field: "", templet: "#order_resend_add_product_psku" },
                { title: "商品名称", field: "title" },
                { title: "款式", field: "style" },
              ],
            ],
            page: true,
            id: "order_resend_addProducts_table",
            done: function (res, count) {
              imageLazyload()
              $("#pop_order_resend_addProducts_num").text(res.count)
            },
          })
        },
        yes: async function (index, layero) {
          const { data } = table.checkStatus("order_resend_addProducts_table")
          let prodskus = ""
          prodskusArr = data.map(item => item.sSku)
          if (prodskusArr.length > 0) {
            prodskus = prodskusArr.join(",")
            try {
              const returnData = await _this.getProdInfoByprodskuAjax(prodskus)
              let _data = returnData.map(item => ({ ...item, storeSSku: item.prodSSku }))
              if (func) {
                func(_data)
              }
              layer.close(index)
            } catch (err) {
              console.log("err :>> ", err)
            }
          } else {
            layer.msg("请选择数据")
          }
        },
      })
    },
    orderResend: function () {
      const _this = this
      $("#orderResend").on("click", ".refresh_icon", async function () {
        var prodskus = $(this).siblings("input").val()
        var index = $(this).parents("tr").attr("data-index")
        if (prodskus !== "") {
          const returnData = await _this.getProdInfoByprodskuAjax(prodskus)
          var data = _this.TableData[index]
          var newdata = returnData[0]
          _this.TableData[index] = Object.assign(data, newdata)
          _this.tableRender(_this.TableData)
        } else {
          layer.msg("请填写sku")
        }
      })
    },
    tableRender: function (data) {
      const _this = this
      table.render({
        elem: "#order_resend_product_table",
        id: "order_resend_product_table",
        data: data,
        cols: [
          [
            { title: "图片", field: "imageUrl", templet: "#order_resend_detail_img_tpl" },
            { title: "Listing_ID", field: "itemId", templet: "#order_resend_edit_ListingID" },
            { title: "店铺SKU", field: "storeSSku", templet: "<div><div name='storeSSku'>{{d.storeSSku||''}}</div>" },
            { title: "商品SKU", field: "prodSSku", templet: "#order_resend_edit_Prodsku" }, //
            { title: "库位", field: "stockLocation" },
            { title: "商品名称", field: "prodTitle" },
            { title: "入库要求", field: "packDesc" },
            { title: "款式", field: "style" },
            { title: "可用库存", field: "availableStock" },
            { title: "商品成本（￥）", field: "prodUnitCost" },
            { title: "累计净重（g）", field: "prodUnitWeight" },
            { title: "报关信息", field: "style" },
            { title: "订单状态", field: "platOrderDetailStatus" },
            { title: "商品数量", field: "prodQuantity", templet: "#order_resend_edit_prodQuantity" },
            { title: "销售金额", field: "platOrderDetailAmt", templet: "#order_resend_edit_platOrderDetailAmt",width:100 },
            { title: "操作", toolbar: "#order_resend_edit_option", width: 80 },
          ],
        ],
        page: false,
        limit: 300,
        done: function (res) {
          imageLazyload()
          table.on("tool(order_resend_product_table)", function (obj) {
            if ((obj.event = "edit_prod_delete")) {
              const index = _this.getIndex("id", data, obj.data.id)
              data.splice(index, 1)
              obj.del()
            }
          })
        },
      })
    },
    getIndex: function (id, arr, value) {
      //获取某个取值属性在对象数组中的下标
      for (var i = 0; i < arr.length; i++) {
        if (value == arr[i][id]) {
          return i
        }
      }
      return -1
    },
    appendSelect: function (aDom, data, code, label, attachment) {
      aDom.empty()
      var option = '<option value="">请选择</option>'
      for (var i in data) {
        if (typeof data[i] !== "string") {
          attachment ? (data[i].code = data[i][code] + "_" + data[i][attachment]) : (data[i].code = data[i][code].toString() || data[i].code)
          data[i].label = data[i][label] || data[i].label
        }
        option += '<option value="' + (typeof data[i].code != "undefined" ? data[i].code : data[i]) + '">' + (data[i].label || data[i]) + "</option>"
      }
      if (Array.isArray(data)) {
        let acctIds = data.map(item => (item.code !== undefined ? item.code : item))
        aDom.attr("acct_ids", acctIds.join(","))
      }
      aDom.append(option)
    },
    //获取编辑表格数据
    getEditTableData: function (data) {
      var tableContainer = $("#order_resend_product_table").next()
      tableContainer.find("tr").each(function (index, item) {
        if (index > 0) {
          data[index - 1].itemId = $(item).find('td[data-field="itemId"] input').val()
          data[index - 1].storeSSku = $(item).find('td[data-field="storeSSku"] div[name=storeSSku]').text()
          data[index - 1].prodSSku = $(item).find('td[data-field="prodSSku"] input').val()
          data[index - 1].platUnitPrice = $(item).find('td[data-field="platUnitPrice"] input').val()
          data[index - 1].platQuantity = $(item).find('td[data-field="platQuantity"] input').val()
          data[index - 1].prodQuantity = $(item).find('td[data-field="prodQuantity"] input').val()
          data[index - 1].platOrderDetailAmt = $(item).find('td[data-field="platOrderDetailAmt"] input').val()
          data[index - 1].status = true
        }
      })
      return data
    },
    //获取站点接口
    getAllSiteAjax: function (platCode) {
      return commonReturnPromise({
        type: "post",
        url: "/lms/enum/getSiteEnum.html",
        params: {
          platCode: platCode,
        },
      })
    },
    // 获取商品列表
    getProductListAjax: function (sSku) {
      return commonReturnPromise({
        type: "post",
        url: "/lms/product/getProds.html",
        params: { searchType: "sSku", searchValue: sSku, page: 1, limit: 300, isCombination: false, isSale: true },
      })
    },
    // 根据商品sku获取商品信息
    getProdInfoByprodskuAjax: function (prodSSkus) {
      return commonReturnPromise({
        url: "/lms/unauditorder/listprodinfo.html?prodSSkus=" + prodSSkus,
      })
    },
  }
  orderResendName.init()
})
