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

    render_hp_orgs_users("#shop_descProhabitWord_form")

    shopShopCategoryName = {
      init: function () {
        this.initSite()
        this.batchDel()
        this.handleAdd()
        this.search()
        this.reset()
        this.handleTab()
        this.tableToor()
      },
      initSite: function () {
        this.siteAjax()
          .then(({ siteList }) => {
            this.siteList = siteList
            commonRenderSelect("shop_descProhabitWord_site_sel", siteList, {
              name: "name",
              code: "code",
            })
          })
          .then(() => form.render())
      },
      siteList: [],
      // 查询
      search: function () {
        let _this = this
        $("#shop_descProhabitWord_search").click(function () {
          const formData = serializeObject($("#shop_descProhabitWord_form"))
          _this.tableRender(formData)
        })
      },
      // 重置
      reset:function(){
        $('#shop_descProhabitWord_reset').click(function(){
          $("#shop_descProhabitWord_form")[0].reset()
        })
      },
      tableRender: function (formData) {
        const _this = this
        table.render({
          elem: "#shop_descProhabitWord_table",
          id: "shop_descProhabitWord_tableId",
          url: ctx + "/shopee/prohibit/query",
          where: formData,
          method: "post",
          cols: [
            [
              { checkbox: true, width: 25 },
              {
                field: "salesSite",
                title: "站点",
                templet: function (d) {
                  let salesSiteStr = ""
                  const curSalesSite = _this.siteList.filter(
                    (item) => item.code === d.salesSite
                  )
                  if (curSalesSite.length) {
                    salesSiteStr = `${curSalesSite[0].name}(${curSalesSite[0].code})`
                  }
                  return salesSiteStr
                },
              },
              { field: "prohibitWord", title: "过滤词中文" },
              { field: "prohibitWordEn", title: "过滤词英文" },
              { title: "操作", toolbar: "#shop_descProhabitWord_toolbar" },
            ],
          ],
          limits: [100, 200, 500],
          limit: 100,
          page: true,
          done: function (_, _, count) {
            // table总数量
            $("#shop_descProhabitWord_total").text(count)
          },
        })
      },
      // table 工具栏
      tableToor: function () {
        let _this = this
        table.on("tool(shop_descProhabitWord_table)", function (obj) {
          switch (obj.event) {
            case "edit":
              //   打开编辑弹窗
              _this.editModal(obj.data, "edit")
              break
            case "del":
              const idsArr = [].concat(obj.data.id)
              _this.handleDel(idsArr)
              break
          }
        })
      },
      // 监听tab
      handleTab: function () {
        element.on("tab(shop_descProhabitWord_tab)", function (data) {
          $("#shop_descProhabitWord_search").click()
        })
      },

      // 编辑 新增
      // type:edit,add;
      editModal: function (obj = {}, type = "add") {
        let _this = this
        layer.open({
          type: 1,
          btn: ["保存", "关闭"],
          title: type === "edit" ? "编辑" : "新增",
          area: ["500px", "500px"],
          id: Date.now(),
          content: $("#shop_descProhabitWord_editModal").html(),
          success: function (layero) {
            const formDom = $("#shop_descProhabitWord_edit_form")
            if (type === "edit") {
              formDom.find("input[name=prohibitWord]").val(obj.prohibitWord)
              formDom.find("input[name=prohibitWordEn]").val(obj.prohibitWordEn)
            }
            commonRenderSelect(
              "shop_descProhabitWord_editModal_site_sel",
              _this.siteList,
              {
                name: "name",
                code: "code",
                selected: obj.salesSite,
              }
            ).then(() => {
              form.render()
            })
          },
          yes: function (index, layero) {
            const formObj = serializeObject(
              $("#shop_descProhabitWord_edit_form")
            )
            if (formObj.salesSite === "") return layer.msg("请选择站点")
            if (formObj.prohibitWord === "")
              return layer.msg("请输入过滤词中文")
            if (formObj.prohibitWordEn === "")
              return layer.msg("请输入过滤词英文")
            const params = { ...obj, ...formObj }
            _this.editAddAjax(params, type).then(() => {
              layer.close(index)
              $("#shop_descProhabitWord_search").click()
            })
          },
        })
      },

      // 批量删除
      batchDel: function () {
        const _this = this
        $("#shop_descProhabitWord_batch_del").click(function () {
          const { data } = table.checkStatus("shop_descProhabitWord_tableId")
          console.log('data :>> ', data);
          if (data.length) {
            _this.handleDel(data.map((item) => item.id))
          } else {
            layer.msg("请先选中一条数据", { icon: 7 })
          }
        })
      },
      handleDel: function (idsArr) {
        const _this = this
        //   打开删除弹窗再次确认
        layer.confirm(
          "确定要删除吗？",
          {
            btn: ["确认删除", "取消"], //按钮
            title: "提示",
            icon: 7,
          },
          function () {
            _this.delAjax(idsArr).then(() => {
              layer.msg("删除成功", { icon: 1 })
              $("#shop_descProhabitWord_search").click()
            })
          }
        )
      },
      // 添加
      handleAdd: function () {
        const _this = this
        $("#shop_descProhabitWord_add").click(function () {
          _this.editModal({}, "add")
        })
      },

      //#region 接口 start
      // 站点接口
      siteAjax: function () {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
        })
      },
      // 删除接口
      delAjax: function (idsArr) {
        return commonReturnPromise({
          type: "post",
          url: ctx + "/shopee/prohibit/deleteShopeeListingDescriptionProhibit",
          contentType: "application/json",
          params: JSON.stringify(idsArr),
        })
      },
      // 编辑 添加接口
      editAddAjax: function (obj, type) {
        const url = {
          edit: ctx + "/shopee/prohibit/updateShopeeListingDescriptionProhibit",
          add: ctx + "/shopee/prohibit/addShopeeListingDescriptionProhibit",
          contentType: "application/json",
        }
        return commonReturnPromise({
          type: "post",
          url: url[type],
          contentType: "application/json",
          params: JSON.stringify(obj),
        })
      },
      //#endregion 接口 end
    }

    shopShopCategoryName.init()
  }
)
