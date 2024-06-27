layui.use(
  [
    "admin",
    "form",
    "layer",
    "formSelects",
    "table",
    "element",
    "laydate",
    "laypage",
    "table",
    "laytpl",
    "upload",
  ],
  function () {
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
    render_hp_orgs_users("#shop_shopCate_form")

    shopShopCategoryName = {
      needFlashTag: false, //如果在编辑弹窗调接口后，弹窗关闭后，需要刷新table
      // 初始化
      init: function () {
        this.initSite()
      },
      initSite: function () {
        this.siteAjax()
          .then(({ siteList }) => {
            commonRenderSelect("shop_shopCate_site_sel", siteList, {
              name: "name",
              code: "code",
            })
          })
          .then(() => form.render())
      },
      // 同步店铺类目
      syncShopCate: function () {
        const _this = this
        $("#shop_shopCate_syncShopCate").click(function () {
          const storeAcctIdList = formSelects.value('shop_shopCate_form_store','val') || []
          if (!storeAcctIdList.length) return layer.msg("请选择店铺", { icon: 7 })
          layer.msg("同步店铺类目开始")
          _this.syncShopCateAjax(storeAcctIdList).then((res) => {
            layer.msg(res, { icon: 1 })
            $("#shop_shopCate_search").click()
          })
        })
      },
      // 查询
      search: function () {
        let _this = this
        $("#shop_shopCate_search").click(function () {
          let formData = serializeObject($("#shop_shopCate_form"))
          if (formData.storeAcctIds == "") {
            //没有选择店铺
            var acctIds = $("#shop_shopCate_form_store").attr("acct_ids");
            if (acctIds != null && acctIds != "") {
              formData.storeAcctIds = acctIds
            } else {
              formData.storeAcctIds = 99999
            }
          }
          !formData.salesSite && delete formData.salesSite
          _this.tableRender(formData)
        })
      },
      tableRender: function (formData) {
        table.render({
          elem: "#shop_shopCate_table",
          id: "shop_shopCate_tableId",
          url: ctx + "/shopee/shopCateGory/getShopCategory",
          where: formData,
          method: "post",
          cols: [
            [
              { checkbox: true, width: 25 },
              { field: "storeAcct", title: "店铺" },
              { field: "salesperson", title: "销售专员" },
              { field: "shopCategoryName", title: "店铺类目" },
              { field: "creator", title: "创建人" },
              { field: "itemCount", title: "商品数量" },
              { field: "totalSalesThirty", title: "类目30天销量" },
              {
                field: "shopCategoryStatus",
                title: "状态",
                templet:
                  '<div>{{d.shopCategoryStatus == 1 ? "启用" : d.shopCategoryStatus ==0 ? "停用":""}}</div>',
              },
              { field: "sortWeight", title: "类目排序" },
              { title: "操作", toolbar: "#shop_shopCate_toolbar" },
            ],
          ],
          limits: [100, 200, 500],
          limit: 100,
          page: true,
          done: function (_, _, count) {
            // table总数量
            $("#shop_shopCate_total").text(count)
          },
        })
      },
      // table 工具栏
      tableToor: function () {
        let _this = this
        table.on("tool(shop_shopCate_table)", function (obj) {
          switch (obj.event) {
            case "edit":
              //   打开编辑弹窗
              _this.editModal(obj)
              break
            case "del":
              //   打开删除弹窗再次确认
              layer.confirm(
                "确定要删除吗？",
                {
                  btn: ["确认删除", "取消"], //按钮
                },
                function () {
                  _this.singleDelAjax(obj.data.id).then(() => {
                    layer.msg("删除成功", { icon: 1 })
                    $("#shop_shopCate_search").click()
                  })
                }
              )
              break
          }
        })
      },
      // 监听tab
      handleTab: function () {
        element.on("tab(shop_shopCate_tab)", function (data) {
          $("#shop_shopCate_search").click()
        })
      },
      // 编辑弹窗
      editModal: function (obj) {
        let _this = this
        let curIndex = layer.open({
          type: 1,
          btn: ["关闭"],
          title: "编辑",
          area: ["893px", "600px"],
          id: Date.now(),
          content: "",
          success: function (layero) {
            obj.data = { ...obj.data }
            laytpl($("#shop_shopCate_editModal").html()).render(
              obj.data,
              function (html) {
                layero.find(".layui-layer-content").html(html)
              }
            )
            //
            _this.InitCategoryItems(obj.data.id)
            //
            form.render()
            //
            _this.handleEditCategory()
            _this.handleAddItemId()
            _this.handleDelItemId()
          },
          end: function () {
            _this.needFlashTag && $("#shop_shopCate_search").click()
            _this.needFlashTag = false
          },
        })
      },
      //   初始itemIdList
      InitCategoryItems: function (id) {
        this.getCategoryItemsAjax(id).then((res) => {
          const itemIdList = res.map((item) => item.itemId).join()
          $("#shop_shopCate_edit_itemIdList").val(itemIdList)
        })
      },
      // 修改类目
      handleEditCategory: function () {
        let _this = this
        $("#shop_shopCate_edit_change").click(function () {
          let formData = serializeObject($("#shop_shopCate_editForm"))
          formData.id = Number(formData.id)
          if (!formData.shopCategoryName)
            return layer.msg("请输入类目名", { icon: 7 })
          if (!formData.sortWeight) return layer.msg("请输入排序", { icon: 7 })
          formData.sortWeight = Number(formData.sortWeight)
          _this
            .updateCategoryAjax(formData)
            .then(() => {
              layer.msg("编辑成功", { icon: 1 })
            })
            .then(() => {
              _this.needFlashTag = true
            })
        })
      },
      // 添加itemId
      handleAddItemId: function () {
        let _this = this
        $("#shop_shopCate_edit_addBtn").click(function () {
          let curVal = $("#shop_shopCate_edit_add").val()
          _this.updateItemIdList(curVal, _this.addItemIdAjax)
        })
      },
      // 移除itemId
      handleDelItemId: function () {
        let _this = this
        $("#shop_shopCate_edit_delBtn").click(function () {
          let curVal = $("#shop_shopCate_edit_del").val()
          _this.updateItemIdList(curVal, _this.delItemIdAjax)
        })
      },
      updateItemIdList: function (curVal, cb) {
        if (!curVal) {
          return layer.msg("请填写数据")
        }
        let id = $("#shop_shopCate_editForm").find("input[name=id]").val()
        let params = {
          id,
          itemList: curVal.split(",").map((item) => ({ itemId: Number(item) })),
        }
        cb(params).then((res) => {
          this.needFlashTag = true
          this.InitCategoryItems(id)
        })
      },
      // 批量开启
      handleBatchOn: function () {
        let _this = this
        $("#shop_shopCate_batch_on").click(function () {
          _this.handleBatch(_this.batchOnAjax)
        })
      },
      // 批量关闭
      handleBatchOff: function () {
        let _this = this
        $("#shop_shopCate_batch_off").click(function () {
          _this.handleBatch(_this.batchOffAjax)
        })
      },
      // 批量操作
      handleBatch: function (cb) {
        const { data } = table.checkStatus("shop_shopCate_tableId")
        if (!data.length) return layer.msg("请选择数据", { icon: 7 })
        const idList = data.map((item) => item.id)
        cb(idList)
          .then(() => {
            layer.msg("操作成功", { icon: 1 })
          })
          .then(() => {
            $("#shop_shopCate_search").click()
          })
      },
      // 导出
      handleExport: function () {
        const _this = this
        $("#shop_shopCate_export").click(function () {
          const { data } = table.checkStatus("shop_shopCate_tableId")
          if (!data.length) return layer.msg("请选择数据", { icon: 7 })
          const idList = data.map((item) => item.id)
          submitForm(
            { idList },
            ctx + "/shopee/shopCateGory/exportShopeeCategory"
          )
        })
      },
      // 下载模板
      handleDownloadTpl: function () {
        $("#shop_shopCate_download_tpl").click(function () {
          window.open(
            ctx + "/static/templet/shopee_shop_category_add_template.xlsx",
            "_blank"
          )
        })
      },
      // 导入新建
      handleImport: function () {
        upload.render({
          elem: "#shop_shopCate_import", //绑定元素
          url: ctx + "/shopee/shopCateGory/addBatchShopCategory", //上传接口
          accept: "file",
          field: "file",
          before: function () {
            loading.show()
          },
          done: function (res) {
            loading.hide()
            if (res.code === "0000") {
              layer.msg("操作成功", { icon: 1 })
            } else {
              layer.alert(res.msg, { icon: 2 })
            }
            //上传完毕回调
            $("#shop_shopCate_search").click()
          },
          error: function (index, upload, err={}) {
            loading.hide()
            layer.alert(err.responseJSON.message, { icon: 2 });
            //请求异常回调
          },
        })
      },
      // 接口
      siteAjax: function () {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
        })
      },
      syncShopCateAjax: function (storeAcctIdList) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/synchronousShopeeCategory",
          params: JSON.stringify(storeAcctIdList),
          contentType: "application/json",
        })
      },
      getCategoryItemsAjax: function (id) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/getShopCategoryItems",
          type: "delete",
          params: JSON.stringify(id),
          contentType: "application/json",
        })
      },
      singleDelAjax: function (id) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/deleteShopCategory",
          type: "delete",
          params: JSON.stringify(id),
          contentType: "application/json",
        })
      },
      batchOnAjax: function (arr) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/updateBatchOpen",
          params: JSON.stringify(arr),
          contentType: "application/json",
        })
      },
      batchOffAjax: function (arr) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/updateBatchDisable",
          params: JSON.stringify(arr),
          contentType: "application/json",
        })
      },
      updateCategoryAjax: function (obj) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/updateShopCategory",
          params: JSON.stringify(obj),
          contentType: "application/json",
        })
      },
      addItemIdAjax: function (obj) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/shopCateGory/addItemIds",
          params: JSON.stringify(obj),
          contentType: "application/json",
        }).then((res) => {
          if (res && res.length > 0) {
            layer.alert(JSON.stringify(res))
          } else {
            layer.msg("添加成功")
          }
        })
      },
      delItemIdAjax: function (obj) {
        return commonReturnPromise({
          type: "DELETE",
          url: ctx + "/shopee/shopCateGory/deleteItemIds",
          params: JSON.stringify(obj),
          contentType: "application/json",
        }).then((res) => {
          layer.msg("操作成功")
        })
      },
    }
    // 初始化
    shopShopCategoryName.init()
    // 店铺类目同化
    shopShopCategoryName.syncShopCate()
    // 查询
    shopShopCategoryName.search()
    // table的触发事件
    shopShopCategoryName.tableToor()
    // 批量开启
    shopShopCategoryName.handleBatchOn()
    // 批量关闭
    shopShopCategoryName.handleBatchOff()
    // 导出
    shopShopCategoryName.handleExport()
    // 下载模板
    shopShopCategoryName.handleDownloadTpl()
    // 导入新建
    shopShopCategoryName.handleImport()
    // 监听tab
    shopShopCategoryName.handleTab()
  }
)

function shopeeShopCategory_itemIdBlur(id, event) {
  let _id = id.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
  let ids = _id.split(",").filter((item) => !!item && Number(item)) //去掉空字符串和非数字的
  let uniqueIds = [...new Set(ids)].map((item) => Number(item)).join() //转为int
  event.target.value = uniqueIds
}

function shopeeShopCategory_testNum(num, event) {
  if (num && (!Number(num) || !/(^[1-9]\d*$)/.test(num))) {
    layer.msg("请输入正整数")
    event.target.value = ""
  }
}
