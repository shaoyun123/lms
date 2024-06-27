layui.use(["admin", "form", "layer", "table", "formSelects", "element", "laydate"], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    table = layui.table,
    formSelects = layui.formSelects,
    laydate = layui.laydate,
    $ = layui.$
  render_hp_orgs_users("#shopee_not_handle_listing_form") //渲染部门销售员店铺三级联动   ??三级联动最终传值是哪种？

  // shop_arr: shopeeOnline页面选中的数据
  var shopeeNotHandleList = {
    // 初始化
    init: async function () {
      // 渲染添加时间
      laydate.render({
        elem: "#shopee_not_handle_listing_addTime",
        range: true,
        type: 'datetime',
      })
          // 在线listing标签
      commonReturnPromise({
        url: '/lms/sysdict/getShopeeListingTag',
      }).then(res=>{
        formSelects.data('shopee_not_handle_listing_listingTagList','local',{arr: res.map(item=>({...item, value:item.id}))})
      })
      // 获取不处理listing过滤类型
      this.filterListingType = await this.getProdFilterListingTypeAiax()
      // 查询和新增俩处，需要添加这个下拉框
      let options = this.filterListingType.map(item => `<option value="${item.code}">${item.name}</option>`).join("")
      $("#shopee_not_handle_listing_form").find("[name=filterType]").append(options)
      $("#shopee_not_handle_listing_add_form").find("[name=filterType]").append(options)
      form.render()
      if (shop_arr.length) {
        // 根据后端需要的数据，对shop_arr进行处理，然后掉后端接口，然后掉table.render
        let itemIdList = shop_arr.map(item => item.itemId)
        let obj = {
          storeAcctIdList: [...new Set(shop_arr.map(item => item.storeAcctId))],
          itemIdList: itemIdList,
          filterType: "",
        }
        this.tableRender(obj)
        // 赋值物品号
        $("#shopee_not_handle_listing_form").find("input[name=itemIdList]").val(itemIdList)
      }
      this.salesTypeFilter()
      this.stockTypeFilter()
      this.filterTypeFilter()
    },
    filterListingType: [], //不处理listing过滤类型
    // 清空
    reset: function () {
      $("#shopee_not_handle_listing_reset").click(function () {
        $("#shopee_not_handle_listing_form")[0].reset()
        $("#shopee_not_handle_listing_depart").next().find('dd[lay-value=""]').trigger("click")
        $("#shopee_not_handle_listing_form").find("select[name=salesType]").parent().next().hide()
        $("#shopee_not_handle_listing_form").find("select[name=stockQueryType]").parent().next().hide()
      })
    },
    // 查询
    search: function () {
      var _this = this
      $("#shopee_not_handle_listing_search").click(function () {
        var formObj = _this.serachData()
        _this.tableRender(formObj)
      })
    },
    serachData: function () {
      var formObj = serializeObject($("#shopee_not_handle_listing_form"))
      var currentStoreAccts = formSelects.value("shopee_not_handle_listing_store", "val") //所选店铺
      if (currentStoreAccts == null || currentStoreAccts.length == 0) {
        //没有选择店铺
        var acctIds = $("#shopee_not_handle_listing_store").attr("acct_ids")
        if (acctIds != null && acctIds != "") {
          formObj.storeAcctIdList = acctIds.split(",")
        } else {
          formObj.storeAcctIdList = []
        }
      } else {
        formObj.storeAcctIdList = currentStoreAccts
      }
      if (formObj.itemIdList !== "") {
        formObj.itemIdList = formObj.itemIdList.replaceAll('，',',').split(",")
      } else {
        formObj.itemIdList = []
      }
      if (formObj.variantionIds!== "") {
        formObj.variantionIds = formObj.variantionIds.replaceAll('，',',').split(",")
      } else {
        formObj.variantionIds = []
      }
      if (formObj.prodPSkuList !== "") {
        formObj.prodPSkuList = formObj.prodPSkuList.replaceAll('，',',').split(",")
      } else {
        formObj.prodPSkuList = []
      }

      if (formObj.createTime) {
        formObj.createTimeFrom = new Date(formObj.createTime.split(" - ")[0]).getTime()
        formObj.createTimeTo = new Date(formObj.createTime.split(" - ")[1]).getTime()
      }
      formObj.listingTagIdList = formSelects.value('shopee_not_handle_listing_listingTagList','val')
      return formObj
    },
    filterTypeFilter: function () {
      form.on("select(shopee_not_handle_listing_filterType)", function (data) {
        if (!(data.value == 8 || data.value == 9)) {
          $("#shopee_not_handle_listing_add_form [name=variantionIds]").attr("readonly", true)
        } else {
          $("#shopee_not_handle_listing_add_form [name=variantionIds]").attr("readonly", false)
        }
      })
    },
    salesTypeFilter: function () {
      form.on("select(shopee_not_handle_listing_salesType)", function (data) {
        if (data.value === "") {
          $(data.elem).parent().next().hide()
        } else {
          $(data.elem).parent().next().show()
        }
      })
    },
    stockTypeFilter: function () {
      form.on("select(shopee_not_handle_listing_stockType)", function (data) {
        if (data.value === "") {
          $(data.elem).parent().next().hide()
        } else {
          $(data.elem).parent().next().show()
        }
      })
    },

    // table数据
    tableRender: function (serachParams) {
      var _this = this
      table.render({
        elem: "#shopee_not_handle_listing_table",
        method: "post",
        contentType: "application/json;charset=UTF-8",
        url: ctx + "/shopee/shopeeIsEnableProduct/searchProdFilterListingShopee",
        where: serachParams,
        cols: [
          [
            { type: "checkbox" },
            { field: "id", title: "id", templet: "<div>{{d.id}}</div>" },
            {
              field: "filterType",
              title: "过滤类型",
              minWidth: 120,
              templet: function (d) {
                let curTypeName = _this.filterListingType.filter(item => item.code == d.filterType)[0].name || ""
                return curTypeName
              },
            },
            { field: "storeAcct", title: "店铺" },
            { field: "salesperson", title: "销售员" },
            { field: "itemId", title: "item_id" },
            { field: "variantionId", title: "variantion_id", templet: `<div>
              {{# if(d.filterType==8 ||d.filterType==9){ }}
               <span>{{d.variantionId}}</span>
              {{# }else{ }}
              <span>-</span>
              {{# } }}
            </div>` },
            { field: "listingTagInfoDtoList", title: "在线listing标签",templet:d=>{
               const str = (d.listingTagInfoDtoList ||[]).map(item=>item.name).join()
               return `<div>${str}</div>`
            } },
            { field: "prodPSku", title: "商品父sku" },
            { field: "sales", title: "7/30/60/90销量", templet: "<div>{{d.sevenSales||'0'}}/{{d.thirtySales||'0'}}/{{d.sixtySales||'0'}}/{{d.ninetySales||'0'}}</div>" },
            {
              field: "profit",
              title: "利润&yen;(利润率)",
              minWidth: 130,
              templet: "<div>最高：{{d.maxProfitCNY||''}}/{{d.maxInstanceRate||''}}<br>最低：{{d.minProfitCNY||''}}/{{d.minInstanceRate||''}}</div>",
            },
            {
              field: "stock",
              title: "活动/normal/shopee合计",
              minWidth: 160,
              templet: "<div> {{d.allReservedStock  || 0}}/{{d.allNormalStock || 0}}/{{d.allShopeeStock  || 0}}</div>",
            },
            { field: "totalAvailableStock", title: "预计可用库存合计（不含在途）",minWidth: 130, templet: "<div>义乌仓：{{d.yiWuTotalAvailableStock||0}}<br>自建南宁仓：{{d.selfBuiltNanNingTotalAvailableStock ||0}}</div>"  },
            { field: "effect", title: "效果", templet: "<div>浏览量：{{d.views||0}}<br>收藏量：{{d.likes||0}}<br>销量：{{d.sales||0}}</div>" },
            {
              field: "createTime",
              title: "添加",
              minWidth: 150,
              templet: '<div>{{d.creator}}<br>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',
            },
            {
              field: "result",
              title: "操作",
              toolbar: "#shopee_not_handle_listing_toolbar",
            },
          ],
        ],
        page: true,
        id: "shopee_not_handle_listing_table",
        height: 500,
        limits: [100, 200, 500],
        limit: 100,
        done: function (res, curr, count) {
          $("#shopee_not_handle_listing_total").text(count)
          $("[data-field='id']").css("display", "none")
        },
      })
    },
    // 总数量更新
    totalUpdate: function (delTotal) {
      let lastTotal = Number($("#shopee_not_handle_listing_total").text())
      let curTotal = lastTotal - Number(delTotal)
      $("#shopee_not_handle_listing_total").text(curTotal)
    },
    // 批量删除不刷新
    batchDel: function () {
      var _this = this
      $("#shopee_not_handle_listing_batch_del").click(function () {
        // 选中的数据
        var checkStatus = table.checkStatus("shopee_not_handle_listing_table") //idTest 即为基础参数 id 对应的值

        var data = checkStatus.data //获取选中行的数据
        if (!data.length) {
          return layer.msg("请选择数据", { icon: 7 }) //icon的值可能有问题
        }
        var arrStr = data.map(item => item.id).join()
        _this.DelAjax(arrStr).then(() => {
          // 如果全选删除，需要更新
          if (checkStatus.isAll) {
            _this.tableRender(_this.serachData())
          } else {
            // 删除对应dom和对应缓存
            deleteCheckedData(
              "shopee_not_handle_listing_table",
              data.map(item => item.id),
              "td[data-field=id]"
            )
            _this.totalUpdate(data.length)
          }
        })
      })
    },
    // table模块的工具条事件
    //工具条事件
    tableToolbar: function () {
      var _this = this
      table.on("tool(shopee_not_handle_listing_table)", function (obj) {
        //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data //获得当前行数据
        var layEvent = obj.event //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        if (layEvent === "del") {
          // 单个删除不刷新
          //向服务端发送删除指令
          _this.DelAjax(data.id).then(res => {
            layer.msg(res || "删除成功", { icon: 1 })
            obj.del() //删除对应行（tr）的DOM结构，并更新缓存
            // 总数量更新
            _this.totalUpdate(1)
          })
        }
      })
    },
    // 新增刷新页面
    Add: function () {
      var _this = this
      $("#shopee_not_handle_listing_add").click(function () {
        // 获取数据
        let formObj = serializeObject($("#shopee_not_handle_listing_add_form"))
        if (formObj.itemIdList == "" && formObj.variantionIds=="") return layer.msg("请输入itemId或者variantionId", { icon: 7 })
        formObj.itemIdList = formObj.itemIdList.trim() == ''? []: formObj.itemIdList.split(',')
        formObj.variantionIdList = formObj.variantionIds.trim() == ''? []:formObj.variantionIds.split(',')
        console.log(formObj);
        //向服务端发送添加指令
        _this.AddAjax(formObj).then(res => {
          layer.msg(res || "操作成功", { icon: 1 })
          _this.tableRender(_this.serachData())
        })
      })
    },
    //   导出数据，不分页
    exportAll: function () {
      let _this = this
      $("#shopee_not_handle_listing_export").click(function () {
        transBlob(
          {
            url: ctx + "/shopee/shopeeIsEnableProduct/exportProdFilterListingShopee",
            fileName: "不处理Listing配置表.xlsx",
            contentType: "application/json;charset=UTF-8",
            formData: JSON.stringify(_this.serachData()),
          },
          "post"
        )
          .then(function (result) {
            layer.msg(result, { icon: 1 })
          })
          .catch(function (err) {
            layer.msg(err, { icon: 2 })
          })
        // submitForm(_this.serachData(), ctx + '/shopee/shopeeIsEnableProduct/exportProdFilterListingShopee')
      })
    },
    // 对输入多个用逗号隔离的数据进行处理
    blurhandleids: function () {
      $(".shopee-not-handle-listing-list-blur").blur(function () {
        let _curList = $(this).val().replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
        let curList = _curList
          .split(",")
          .filter(item => !!item && Number(item)) //去掉空字符串和非数字的
          .map(item => Number(item))
          .join() //转为int
        $(this).val(curList)
      })
    },
    // 对输入多个用逗号隔离的数据进行处理
    blurhandleList: function () {
      $(".shopee-not-handle-listing-listNotNumber-blur").blur(function () {
        let _curList = $(this).val().replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
        $(this).val(_curList)
      })
    },
    // 获取不处理listing过滤类型
    getProdFilterListingTypeAiax: function () {
      return commonReturnPromise({
        url: ctx + "/shopee/shopeeIsEnableProduct/getProdFilterListingType",
      })
    },
    // 删除ajax
    DelAjax: function (arrStr) {
      return commonReturnPromise({
        url: ctx + "/shopee/shopeeIsEnableProduct/deleteProdFilterListingShopee",
        type: "DELETE",
        params: { deleteIdList: arrStr },
      })
    },
    // 新增ajax
    AddAjax: function (obj) {
      console.log('新增ajax',obj);
      return commonReturnPromise({
        url: ctx + "/shopee/shopeeIsEnableProduct/addProdFilterListing",
        type: "PUT",
        contentType: 'application/json',
        params: JSON.stringify(obj),
      })
    },
  }
  // 进入页面初始数据
  shopeeNotHandleList.init()
  // 清空
  shopeeNotHandleList.reset()
  // 查询
  shopeeNotHandleList.search()
  shopeeNotHandleList.tableToolbar()
  // 批量删除不刷新
  shopeeNotHandleList.batchDel()
  // 导出
  shopeeNotHandleList.exportAll()
  // 新增
  shopeeNotHandleList.Add()
  // 对输入多个用逗号隔离的数据进行处理
  shopeeNotHandleList.blurhandleids()
  shopeeNotHandleList.blurhandleList()
})
