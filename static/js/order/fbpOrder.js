layui.use(["form", "table", "layer", "element", "laypage", "upload", "tableMerge", "laydate", "formSelects", "admin", "laytpl"], function () {
  var form = layui.form,
    table = layui.table,
    element = layui.element,
    laydate = layui.laydate,
    formSelects = layui.formSelects,
    laytpl = layui.laytpl,
    admin = layui.admin,
    upload = layui.upload
  laypage = layui.laypage
  layer = layui.layer
  form.render("select")
  var fbpOrder_allstore = null,
    fbpOrder_Site = null,
    fbpOrder_formdata = {},
    fbpOrder_pageEnum = null
  laydate.render({
    elem: "#fbpOrder_time",
    type: "datetime",
    inputAuto: true,
    range: true,
    showShortcuts: true,
  })

  formSelects.render("fbpOrderStatusList", { placeholder: "请先选择平台" })

  // 初始化数据
  getPageEnum()

  getStoreByPlatform("", function (returnData) {
    fbpOrder_allstore = returnData.data
  })

  $("#fbpOrderForm").on("keyup", "input", function (e) {
    if (e.keyCode == 13) {
      // 回车键
      $(this).select()
      $("#fbpOrderSearch").click()
    }
  })

  var nowdate = new Date(new Date().toLocaleDateString()).getTime()
  var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, "yyyy-MM-dd hh:mm:ss")
  var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), "yyyy-MM-dd hh:mm:ss")
  $("#fbpOrder_time").val(onemonth + " - " + endDate)

  const fbpOrderName = {
    getTablesSelectId() {
      return new Promise(function (resolve, reject) {
        let data = fbpOrder_gridOptions.api.getSelectedRows()
        if (!data.length) {
          reject("请先选中一条数据")
        }
        resolve(data)
      })
    },
  }

  //选项卡点击事件
  element.on("tab(fbpOrder_Tab)", function (data) {
    $("#fbpOrderSearch").click()
  })

  // 表单提交
  form.on("submit(fbpOrderSearch)", function (data) {
    handleQueryParams(data, () => {
      fbpOrderTableorder(data.field)
    })
  })

  // 处理查询参数
  function handleQueryParams(data, callback) {
    if (data.field.time) {
      data.field.orderTimeStart = data.field.time.split(" - ")[0]
      data.field.orderTimeEnd = data.field.time.split(" - ")[1]
    }
    if (data.field.skuType) {
      data.field[data.field.skuType] = data.field.skuvalue
    }
    if (data.field.salerAndcustomSelect == 2) {
      data.field.customServicerId = data.field.salePersonId
      delete data.field.salePersonId
    }
    //订单编号处理
    if (data.field.orderIds) {
      //替换全角逗号
      data.field.orderIds = data.field.orderIds.replace(/，/g, ",")
      //校验
      for (let orderId of data.field.orderIds.split(",")) {
        if (!isNaN(orderId) && orderId % 1 === 0) {
        } else {
          layer.msg("订单编号不正确", { icon: 0 })
          return
        }
      }
    }
    callback && callback()
  }

  // 导出
  form.on("submit(fbpOrderExport)", function (data) {
    handleQueryParams(data, () => {
      var dataCheck = fbpOrder_gridOptions.api.getSelectedRows()
      let idsArr = dataCheck?.map(item => item.id)
      let params 
      let title
      if (dataCheck.length === 0) {
        params = data.field
        title = '确定要导出查询条件的订单吗?'
      } else {
        params = {
          exportIdList: idsArr?.join(',')
        }
        title = '确定要导出勾选的订单吗?'
      }
      handleExport(title, params)
    })
  })


  // 导出明细
  form.on("submit(fbpOrderExportDetail)", function (data) {
    handleQueryParams(data, () => {
      var dataCheck = fbpOrder_gridOptions.api.getSelectedRows()
      let idsArr = dataCheck?.map(item => item.id)
      let params 
      let title
      if (dataCheck.length === 0) {
        params = Object.assign({ detail: true }, data.field)
        title = '确定要导出查询条件的订单明细吗?'
      } else {
        params = {
          exportIdList: idsArr?.join(','),
          detail: true
        }
        title = '确定要导出勾选的订单明细吗?'
      }
      handleExport(title, params)
    })
  })

  function handleExport(title, params) {
    layer.confirm(`${title}`, function(index) {
      let formData = new FormData()
      for (let i in params) {
        formData.append(i, params[i])
      }
      transBlob({
        url: "/lms/fbpplatorder/export",
        formData: formData,
        }).then(function (result) {
            loading.hide();
        }).catch(function (err) {
            layer.msg(err, {icon: 2});
        });
      layer.close(index);
    })
  }
 

  //监听平台下拉选择
  form.on("select(fbpOrder_allstatusplatCodes)", function (obj) {
    let platCode = ""
    if (obj.value) {
      platCode = obj.value === "amazonMCF" ? "amazon" : obj.value
    }
    commonOrderAddSalePerson("fbpOrder", form, platCode)
    getListplatorderstatus_fbporder(platCode, function (returnData) {
      const arr = returnData.data.map(item => ({ name: item, value: item }))
      formSelects.data("fbpOrderStatusList", "local", { arr })
    })
    getStoreByPlatform(platCode, function (returnData) {
      // debugger;
      appendSelect($("#fbpOrderForm").find('select[_name="storeAcctIds"]'), returnData.data, "id", "storeAcct")
    })
  })

  //监听工具栏操作
  table.on("tool(fbpOrder_table)", function (obj) {
    var event = event ? event : window.event
    event.stopPropagation()
    var data = obj.data
    if (obj.event === "") {
    }
  })

  // 页面数据请求----------------------------------------
  //  获取页面枚举数
  function getPageEnum() {
    initAjax("/unauditorder/listenum.html", "post", {}, function (returnData) {
      fbpOrder_pageEnum = returnData.data
      fbpOrder_pageEnum.platCode = ["shopee", "lazada", "tiktok", "amazonMCF", "shein商城", "walmart", "temu", "AE自营", "shein自营", "AE半托管"]
      appendSelect($("#fbpOrderForm").find("select[name=platCode]"), fbpOrder_pageEnum.platCode, "name", "value")
      appendSelect($("#fbpOrderForm").find("select[_name=shippingCountryCodes]"), fbpOrder_pageEnum.shippingCountrys, "name", "value")
      form.render()
      commonRenderSelect("fbpOrder_labels", fbpOrder_pageEnum.fbpOrderLabels, { name: "name", code: "code" }).then(() => {
        formSelects.render("fbpOrder_labels")
      })
      commonRenderSelect("fbpOrder_platTags", returnData.data.platTagList).then(() => {
        formSelects.render("fbpOrder_platTags")
      })
      formSelects.render("fbpOrder_shippingCountrys")
    })
  }

  //根据平台code获取店铺列表
  function getStoreByPlatform(platcode, func) {
    initAjax(
      "/sys/orderliststorebyplatcode.html",
      "get",
      { platCode: platcode },
      function (returnData) {
        if (func) {
          func(returnData)
        }
        formSelects.render("fbpOrderStoreAcct", { placeholder: "请先选择平台" })
      },
      "application/x-www-form-urlencoded"
    )
  }

  // 获取平台订单状态
  function getListplatorderstatus_fbporder(platcode, func) {
    initAjax(
      "/undispatch/listplatorderstatus.html",
      "get",
      { platCode: platcode },
      function (returnData) {
        if (func) {
          func(returnData)
        }
      },
      "application/x-www-form-urlencoded"
    )
  }

  //店铺选中
  function storeSelected(aDom, value) {
    var options = aDom.find("option")
    options.each(function (index, item) {
      var storeAcctId = item.value.split("_")[0]
      if (storeAcctId == value) {
        $(item).attr("selected", true)
      }
    })
    form.render()
  }

  // 根据商品sku获取商品信息
  function getProdInfoByprodsku(prodSSkus, func) {
    initAjax("/unauditorder/listprodinfo.html?prodSSkus=" + prodSSkus, "get", {}, function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }

  // ??
  function setModel(type) {
    const instance = fbpOrder_gridOptions.api.getFilterInstance("shippingCountryCnName")

    instance.setModel({ values: MANGLED_COLOURS })
    fbpOrder_gridOptions.api.onFilterChanged()
  }

  let fbpOrder_immutableStore = []
  const fbpOrder_gridOptions = {
    columnDefs: [
      {
        width: 60,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        headerName: "订单号",
        wrapText: true,
        autoHeight: true,
        cellRenderer: data => {
          let d = data.data
          let tagsDom = ""
          if (d.platTagList && d.platTagList.length > 0) {
            tagsDom = d.platTagList
              .map(item => {
                return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
              })
              .join("")
          }
          // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
          const operOrderTypeTag =
            d.operOrderType == 1
              ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>'
              : d.operOrderType == 2
              ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>'
              : d.operOrderType == 0 && d.operOriginId != "0"
              ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>'
              : ""
          return `<div class="alignLeft">
                      <span>${d.id || ""}</span>
                      <span onclick="layui.admin.onlyCopyTxt('${d.id}',event)" style="display: ${d.id ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      ${tagsDom}
                      ${operOrderTypeTag}	
                      <br>
                      <span>${d.platOrderId}</span>
                      <span onclick="layui.admin.onlyCopyTxt('${d.platOrderId}',event)" style="display: ${d.platOrderId ? 'inline-block':'none'}" class="copy-icon">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      <p>${d.platOrderStatus || ""}</p>
                  </div>`
        },
      },
      {
        field: "",
        wrapText: true,
        autoHeight: true,
        headerName: "店铺",
        cellRenderer: ({ data }) => {
          const str = `${data.storeAcct || ""}[${data.shopId || ""}]<br>[${data.salesPersons || ""}][${data.sellLeaderName || ""}]`
          return str
        },
      },
      {
        field: "",
        wrapText: true,
        autoHeight: true,
        headerName: "订单金额",
        cellRenderer: data => {
          let d = data.data,
            str = ""
          let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i != 0)
          let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : ""
          str += `<div class="alignLeft">
                      <div><span class='gray'>${d.currency || ""}</span><span>${d.platOrderAmt || ""}</span>${amtDom}</div>
                      <div><span class="gray">平台费</span>${fee.join(" + ")}</div>
                      <div><span class="gray">利润(￥)</span>${d.profit || "0.00"} <span class="gray">${((100 * d.profit) / d.platOrderAmt / d.exchangeRate).toFixed(
            2
          )}%</span></div>
                  </div>`
          return str
        },
      },
      {
        headerName: "成本",
        width: 130,
        wrapText: true,
        autoHeight: true,
        cellRenderer: ({ data }) => {
          const str = `<div><span class="gray">商品成本(￥)</span>${data.prodCost || ""}</div>
          <div><span class="gray">物流成本(￥)</span>${data.shippingCost !== undefined ? data.shippingCost : ""}</div>`
          return str
        },
      },
      {
        headerName: "商品",
        width: 130,
        wrapText: true,
        autoHeight: true,
        cellRenderer: data => {
          let d = data.data
          return `<div class="alignLeft">
                      <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${d.skuQuantity || ""}</span></div>
                      <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${d.prodQuantity || ""}</span></div>
                      <div><span class="gray">预估重(g)：</span><span>${d.preWeight}</span></div>
                  </div>`
        },
      },
      {
        headerName: "收件人",
        field: "shippingCountryCnName",
        wrapText: true,
        autoHeight: true,
        cellRenderer: data => {
          let d = data.data
          const _buyerNote = d.buyerNote || ""
          const _buyerNoteCopyHtml = `<a class="hidden">${_buyerNote}</a>
                  <button
                      class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                      onclick="layui.admin.copyTxt(this)"
                  >
                      复制
                  </button>`
          return `<div class="alignLeft">
                      <div id="">${d.shippingUsername || ""}</div>
                      <div>
                      [${d.shippingCountryCnName || ""}]
                      </div>
                      <div data-text="${_buyerNote}" onmouseenter="allBuyerTipsShow(this)" onmouseleave="allBuyerTipsHide(this)">
                          <span class="pora copySpan">
                              <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                              ${_buyerNote ? _buyerNoteCopyHtml : ""}
                          </span>
                      </div>
                  </div>`
        },
      },
      {
        headerName: "物流",
        width: 180,
        wrapText: true,
        autoHeight: true,
        cellRenderer: ({ data }) => {
          // // 备注
          // let recentNoteContent = ""
          // if (data.orderNote) {
          //   recentNoteContent = `<span>${data.orderLabel || ""}:${data.orderNote || ""}</span>`
          // }
          // 备注
          let recentNoteContent = "";
          if (
              data.platOrderNotes &&
              Array.isArray(data.platOrderNotes) &&
              data.platOrderNotes.length
          ) {
            let noteContentLength = data.platOrderNotes.length;
            recentNoteContent =
                `<span data-text='${JSON.stringify(data.platOrderNotes)}' onmouseenter="allBuyerTipsShowTable(this)" onmouseleave="allBuyerTipsHide(this)">${data.platOrderNotes[noteContentLength - 1].noteType || ""}:${data.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
          }
          const noteTipsHtml = `<span class="hp-badge fr fbpOrder-noteContent-tag">多</span>`
          const str = `<div><span class="gray">承运商</span>${data.buyerRequireShippingType || ""}</div>
          <div><span class="gray">跟踪号:</span> <span class="pora copySpan"><a>${
            data.logisTrackingNo || ""
          }</a><button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button></span></div>
          <div><span class="gray">备注:</span>${recentNoteContent}${(data.platOrderNotes && data.platOrderNotes.length>1) ? noteTipsHtml : ''}</div>`
          return str
        },
      },
      {
        headerName: "平台时间",
        wrapText: true,
        autoHeight: true,
        cellRenderer: data => {
          let d = data.data
          return `<div class="alignLeft">
                      <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", "yyyy-MM-dd hh:mm:ss")} (${
            d.orderDay || "0"
          })</span></div>
                  </div>`
        },
      },
    ],
    rowData: fbpOrder_immutableStore,
    getRowNodeId: function (data) {
      return data.id
    },
    // rowModelType: 'serverSide', // 服务端
    defaultColDef: {
      resizable: true, //是否可以调整列大小，就是拖动改变列大小
    },
    suppressPaginationPanel: true, // 自定义分页
    // pagination: true, // 开启分页（前端分页）
    // paginationPageSize: 1000, // 每页加载多少行
    // paginationAutoPageSize: true, // 根据网页高度自动分页（前端分页）
    rowSelection: "multiple", // 设置多行选中
    rowHeight: 100,
    suppressRowClickSelection: true,
    onGridReady: function (params) {
      fbpOrder_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) })
      //表格创建完成后执行的事件
      params.api.sizeColumnsToFit() //调整表格大小自适应
    },
    sideBar: {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
      ],
    },
    onRowClicked: function (event) {
      // console.log(event)
    },
    //单击单元格触发的事件
    onCellClicked: function (event) {
      // console.log()
      //event.data 选中的行内数据，event.event 为鼠标事件
      handleTableOptions(event)
    },
    onCellMouseDown: function (event) {
      timeStamp = event.event.timeStamp
    },
  }

  var timeStamp

  var gridDiv = document.querySelector("#fbpOrder_table")
  agGrid.LicenseManager.setLicenseKey("IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f")
  new agGrid.Grid(gridDiv, fbpOrder_gridOptions)

  //渲染表格数据
  function fbpOrderTableorder(data) {
    commonReturnPromiseRes({
      url: ctx + "/fbpplatorder/listorder.html",
      type: "POST",
      params: data,
    })
      .then(function (result) {
        fbpOrder_immutableStore = result.data
        fbpOrder_gridOptions.api.setRowData(fbpOrder_immutableStore)

        // 渲染tab中的count数，复制原来的--start
        allstatusOrderPage(data, result.count)
        $("#LAY-fbpOrder #fbpOrder_Tab").find("li").find("span").text(result.count)
        // 复制原来的--end
      })
      .catch(function (err) {
        layer.msg(err, { icon: 2 })
      })
  }

  function handleTableOptions(event) {
    let optionEvent = event.event.target.name,
      data = event.data // 获取选中行数据
    if (optionEvent == "copy") {
    } else if (event.event.timeStamp - timeStamp < 300) {
      data.showLogisAttrList = true
      data.showSale = true
      fbpOrderSimpleDetailFn(data, fbpOrder_gridOptions, fbpOrder_immutableStore)
    }
  }

  //监听表格tr的点击[查看详情]
  function fbpOrder_watchTableTr() {
    $("#fbpOrderCard .layui-table-main").on("click", "td[data-field=platOrderStatus]", function (event) {
      var $targetBtn = $(this).parents("tr").find("span[lay-event=edit]")
      $targetBtn.trigger("click")
      event.stopPropagation()
      event.preventDefault()
    })
  }

  // 渲染页面分页
  function allstatusOrderPage(data, count) {
    laypage.render({
      elem: "fbpOrderPage",
      curr: data.page,
      limit: data.limit,
      limits: [5000, 10000, 20000],
      layout: ["prev", "page", "next", "count", "limit"],
      count: count,
      jump: function (obj, first) {
        $('#fbpOrderForm input[name="limit"]').val(obj.limit) //保障下次的分页请求中带有的值正确
        $('#fbpOrderForm input[name="page"]').val(obj.curr) //保障下次的分页请求中带有的值正确
        //首次不执行
        if (!first) {
          data.page = obj.curr
          data.limit = obj.limit
          $("#fbpOrderSearch").click()
        }
      },
    })
  }

  window.getprocessStatus = function (status) {
    var processStatusArr = fbpOrder_pageEnum.processStatus
    for (var item of processStatusArr) {
      if (item.name == status) {
        return item.value
      }
    }
  }

  function getTableSelectIds() {
    let data = fbpOrder_gridOptions.api.getSelectedRows()
    var ids = (data || []).map(function (item) {
      return item.id
    })
    return ids
  }

  // 操作
  //重新匹配SKU
  $("#fbpOrder_reParseSku").click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg("请选择订单", { icon: 7 })
      return
    }
    layer.confirm("对SKU异常订单重新匹配SKU?", function (index) {
      initAjax(
        "/fbpplatorder/reparsesku.html",
        "post",
        { ids: ids.join(",") },
        function (returnData) {
          layui.admin.batchResultAlert("匹配SKU:", returnData.data, function () {
            $("#fbpOrderSearch").click()
          })
        },
        "application/x-www-form-urlencoded"
      )
    })
  })
  // 批量备注
  $("#fbpOrder_batchRemark").click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg("请选择订单", { icon: 7 })
      return
    }
    commonDirectMailRemarkBatch(ids.join("-"), fbpOrder_gridOptions,'平台仓订单')
  })
  //监听批量新增按钮点击事件
  upload.render({
    elem: '#fbpOrder_abatchUpload', //绑定元素
    url: `${ctx}/fbpplatorder/importFbpNewOrder`, //上传接口
    accept: 'file', //允许上传的文件类型
    exts: 'xlsx',
    before: function(){
      loading.show();
    },
    done: function(res) {
      loading.hide();
      if(res.failNum > 0){
        layui.admin.batchResultAlert("批量新增结果:", res, function () {
        });
      }else{
        //全部成功,只展示成功数据
        layui.admin.batchResultSuccessAlert("批量新增结果:", res, function () {
        });
        }
    },
    error: function() {
      loading.hide();
      layer.msg('服务器出现故障!');
    }
  });

  // 指定仓库类型
  $("#fbpOrder_appointWarehouseType").click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg("请选择订单", { icon: 7 })
      return
    }
  
    layer.open({
      type: 1,
      title: "重新指定仓库类型",
      btn: ["确认", "取消"],
      content: "loading",
      success: function (layero, index) {
        $(layero)
          .find(".layui-layer-content")
          .html($("#fbpOrder_appointWarehouseTypeTpl").html());
        layui.form.render("radio");
      },
      yes: function (index, layero) {
        let warehouseType = $(
          "#fbpOrder_appointWarehouseTypeForm input[name=warehouseType]:checked"
        ).val();
        initAjax(
          "/fbpplatorder/appointWarehouseType",
          "post",
          { ids: ids.join(","), warehouseType: warehouseType },
          function (returnData) {
            layui.admin.batchResultAlert(
              "重新指定仓库类型:",
              returnData.data,
              function () {
                $("#fbpOrderSearch").click();
              }
            );
            layer.close(index);
          },
          "application/x-www-form-urlencoded"
        );
      },
    });
  });
  

  // 创建MCF订单
  $("#fbpOrder_createMCFOrders").click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg("请选择订单", { icon: 7 })
      return
    }
    const orderIdStr = ids.join()
    commonReturnPromise({
      url: `/lms/shein/order/batch/creatMcfOrder?orderIdStr=${orderIdStr}`,
    }).then(res => {
      layui.admin.batchResultAlert("创建MCF订单:", res, function () {})
    })
  })

  /**
   * 订单页面详情的统一处理
   * @param {} obj
   */
  function fbpOrderSimpleDetailFn(data, gridOptions) {
    layui.use(["admin", "form", "laytpl"], function () {
      var admin = layui.admin
      var form = layui.form
      var laytpl = layui.laytpl
      var hasDetailLayer = $("#orderSimpleDetail_detailTabs")
      var orderId = data.id
      var lastIndex = null
      var lastColIndex = null
      var lastId = null
      // 申报价 页面
      const declaredValPageList = ["toDespatchOrder", "allStatusOrder"]
      const curPage = window.location.href.split("/").slice(-1)[0]
      data.declaredValTag = declaredValPageList.includes(curPage)
      data.orderDetails = data.orderDetails.sort(function (a, b) {
        return a.availableStock - b.availableStock
      })
      if (hasDetailLayer.length > 0) {
        var getTpl = $("#orderSimpleDetail_detailTab1ContainerTpl").html(),
          view = $("#orderSimpleDetail_detailTab1Container")[0]
        laytpl(getTpl).render(data, function (html) {
          view.innerHTML = html
          form.render()

          var $layerTitle = $("#orderSimpleDetail_detailTab1Container").parents(".layui-layer.layui-layer-page").find(".layui-layer-title")
          $layerTitle.text(`订单详情 - ${data.id}`)
        })
        //渲染日志
        commonReturnPromise({
          type: "post",
          url: "/lms/orderlog/listorderlog.html",
          params: {
            orderId: orderId,
          },
        })
          .then(result => {
            var getTpl2 = $("#orderSimpleDetail_detailTab2ContainerTpl").html(),
              view2 = document.getElementById("orderSimpleDetail_detailTab2Container")
            laytpl(getTpl2).render(result, function (html) {
              view2.innerHTML = html
            })
          })
          .catch(err => {
            layer.msg(err, { icon: 2 })
          })
      } else {
        layer.open({
          type: 1,
          title: "订单详情 - " + orderId,
          offset: "b",
          maxmin: true,
          shade: false,
          id: orderId,
          area: ["100%", "40%"],
          success: function (layero, index) {
            layui
              .view(data.id)
              .render("route/iframe/order/orderSimpleDetail")
              .done(function () {
                var getTpl = layero.find("#orderSimpleDetail_detailTab1ContainerTpl").html(),
                  view = layero.find("#orderSimpleDetail_detailTab1Container")[0]
                laytpl(getTpl).render(data, function (html) {
                  view.innerHTML = html
                  form.render()
                })
                //渲染日志
                commonReturnPromise({
                  type: "post",
                  url: "/lms/orderlog/listorderlog.html",
                  params: {
                    orderId: orderId,
                  },
                })
                  .then(result => {
                    var getTpl2 = layero.find("#orderSimpleDetail_detailTab2ContainerTpl").html(),
                      view2 = layero.find("#orderSimpleDetail_detailTab2Container")[0]
                    laytpl(getTpl2).render(result, function (html) {
                      view2.innerHTML = html
                    })
                  })
                  .catch(err => {
                    layer.msg(err, { icon: 2 })
                  })
                this.upDownKeyDown = function (event) {
                  if (gridOptions && (event.keyCode === 38 || event.keyCode === 40)) {
                    let curCell = gridOptions.api.getFocusedCell()
                    // 如果弹窗未关闭，鼠标点击其它地方，cell的选中效果就会没有，所以添上cell选中的效果
                    let rowIndex = lastIndex
                    let colIndex = lastColIndex
                    if (curCell) {
                      rowIndex = curCell.rowIndex
                      colIndex = curCell.column.instanceId
                    }
                    let curData = null
                    gridOptions.api.forEachLeafNode(function (node, index) {
                      if (index == rowIndex) {
                        curData = node.data
                      }
                    })
                    const firstCol = gridOptions.columnApi.getAllDisplayedColumns()[colIndex]
                    gridOptions.api.setFocusedCell(rowIndex, firstCol)
                    if (lastId != curData.id) {
                      fbpOrderSimpleDetailFn(curData, gridOptions)
                    }
                    if (curCell) {
                      lastIndex = curCell.rowIndex
                      lastColIndex = curCell.column.instanceId
                    }
                    lastId = curData.id
                  }
                }
                $(document).on("keydown", this.upDownKeyDown) //监听键盘事件，关闭层
              })
          },
          end: function () {
            $(document).off("keydown", this.upDownKeyDown) //解除键盘关闭事件
            gridOptions.api.clearFocusedCell()
          },
        })
      }
    })
  }

  // 页面数据请求----------------------------------------

  //填充下拉框
  function appendSelect(aDom, data, code, label, attachment) {
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
  }

  function initAjax(url, method, data, func, contentType, isLoad, func2, func3) {
    //初始化ajax请求
    if (!isLoad) {
      loading.show()
    }
    $.ajax({
      type: method,
      url: ctx + url,
      dataType: "json",
      async: true,
      data: data,
      contentType: contentType || "application/json",
      beforeSend: function (returnData) {
        if (func2) {
          func2(returnData)
        }
      },
      success: function (returnData) {
        loading.hide()
        if (returnData.code == "0000") {
          func(returnData)
        } else {
          layer.msg(returnData.msg, { icon: 2 })
        }
      },
      error: function (returnData) {
        loading.hide()
        if (XMLHttpRequest.status == 200) {
          layer.msg("请重新登录", { icon: 7 })
        } else {
          layer.msg("服务器错误")
        }
      },
      complete: function (returnData) {
        loading.hide()
        if (func3) {
          func3(returnData)
        }
      },
    })
  }
})

function getIndex(id, arr, value) {
  //获取某个取值属性在对象数组中的下标
  for (var i = 0; i < arr.length; i++) {
    if (value == arr[i][id]) {
      return i
    }
  }
  return -1
}

function allBuyerTipsShow(dom) {
  const contentshow = $(dom).attr("data-text")
  if (contentshow) {
    layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
      tips: [1, "#fff"],
      time: 0,
    })
  }
}
function allBuyerTipsHide() {
  layui.layer.closeAll("tips")
}

function allBuyerTipsShowTable(dom){
  const contentshow = $(dom).attr("data-text");
  let contentJson = new Function(`return ${contentshow}`)();
  let tipsStr = (contentJson || []).map(item => {
    return `<tr>
                <td>${item.creator}</td>
                <td>${item.noteType}:${item.noteContent}</td>
                <td>${Format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</td>
              </tr>`;
  }).join('');
  if (contentshow) {
    layui.layer.tips(
        `<table class="layui-table"><thead><tr><th>备注人</th><th>备注</th><th>备注时间</th></tr></thead><tbody>${tipsStr}</tbody></table>`,
        $(dom),
        {
          tips: [1, '#3595CC'],
          time: 0,
          maxWidth: '350px'
        }
    );
  }
}
