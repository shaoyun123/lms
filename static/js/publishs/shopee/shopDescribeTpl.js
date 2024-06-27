layui.use(["admin", "form", "layer", "formSelects", "table", "element", "laydate", "laytpl", "laypage", 'upload'], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    formSelects = layui.formSelects,
    element = layui.element,
    laydate = layui.laydate,
    laytpl = layui.laytpl,
    table = layui.table,
    laypage = layui.laypage,
    $ = layui.$,
    upload = layui.upload

  render_hp_orgs_users("#shop_shopDescribeTpl_form")

  shopDescribeTplName = {
    // 初始化
    init: function () {
      this.initSite()
      this.initPersonType()
      this.handlePersonType()
      this.initTime()
      this.search()
      this.handleTab()
      this.exportTplFile()
      this.upLoadFile()
      this.batchEdit()
      this.reset()
    },
    SiteArr: [],
    initSite: function () {
      this.siteAjax()
        .then(({ siteList }) => {
          this.SiteArr = siteList
          commonRenderSelect("shop_shopDescribeTpl_site_sel", siteList, {
            name: "name",
            code: "code",
          })
        })
        .then(() => form.render())
    },
    // 清空
    reset: function () {
      //清空
      $("#shop_shopDescribeTpl_reset").click(function () {
        $("#shop_shopDescribeTpl_form")[0].reset()
        render_hp_orgs_users("#shop_shopDescribeTpl_form")
      })
    },
    // 创建人，修改人
    initPersonType: function () {
      const curPersonType = $("#shop_shopDescribeTpl_form").find("select[name=personType]").val()
      const curPersonName = $("#shop_shopDescribeTpl_personName").val()
      commonReturnPromise({
        url: "/lms/shopee/shopdescrModel/getAllCreatorAndModifier",
      }).then(res => {
        const curList = curPersonType === "creators" ? "creatorList" : "modifierList"
        formSelects.data("shop_shopDescribeTpl_personName", "local", {
          arr: res[curList].map(item => ({
            value: item,
            name: item,
            select: curPersonName === item ? "selected" : "",
          })),
        })
      })
    },
    initTime: function () {
      laydate.render({
        elem: "#shop_shopDescribeTpl_time", //指定元素
        range: true,
        format: "yyyy-MM-dd HH:mm:ss",
      })
    },
    handlePersonType: function () {
      const _this = this
      form.on("select(shop_shopDescribeTpl_personType)", function () {
        _this.initPersonType()
      })
    },

    // 查询
    search: function () {
      let _this = this
      $("#shop_shopDescribeTpl_search").click(function () {
        let formData = serializeObject($("#shop_shopDescribeTpl_form"))
        var currentStoreAccts = formSelects.value("shop_shopDescribeTpl_form_store", "val"); //所选店铺
        if (currentStoreAccts == null || currentStoreAccts.length == 0) {
          //没有选择店铺
          var acctIds = $("#shop_shopDescribeTpl_form_store").attr("acct_ids");
          if (formData.org || formData.saleman) {
            formData.storeAcctIds = acctIds.length ? acctIds.split(',') : [99999];
          } else {
            formData.storeAcctIds = [];
          }
        } else {
          formData.storeAcctIds = currentStoreAccts; //选择的店铺
        }
        if(formData.personName){
          formData[formData.personType] = formData.personName.split(',')
        }
        const time = $("#shop_shopDescribeTpl_form").find("input[name=time]").val()
        if (formData.time) {
          const timeArr = formData.time.split(" - ")
          if (formData.timeType === "creatTime") {
            formData.createStartTime = new Date(timeArr[0]).getTime()
            formData.createEndTime = new Date(timeArr[1]).getTime()
          } else {
            formData.modifyStartTime = new Date(timeArr[0]).getTime()
            formData.modifyEndTime = new Date(timeArr[1]).getTime()
          }
        }
        delete formData.org
        delete formData.saleman
        _this.tableRender(formData)
      })
    },
    tableRender: function (formData) {
      const _this = this
      table.render({
        elem: "#shop_shopDescribeTpl_table",
        id: "shop_shopDescribeTpl_tableId",
        url: ctx + "/shopee/shopdescrModel/queryModels",
        where: formData,
        contentType: "application/json;charset=UTF-8",
        method: "post",
        cols: [
          [
            { checkbox: true, width: 25 },
            { field: "storeAcct", title: "店铺" },
            { field: "salesperson", title: "销售专员" },
            {
              field: "salesSite",
              title: "站点",
              templet: function (d) {
                let salesSite = ""
                if (d.salesSite) {
                  const curSalesSiteArr = _this.SiteArr.filter(item => item.code == d.salesSite)
                  curSalesSiteArr.length && (salesSite = curSalesSiteArr[0].name)
                }
                return `<div>${salesSite}</div>`
              },
            },
            { field: "descrHeader", title: "描述头" },
            { field: "descrTail", title: "描述尾" },
            { field: "create", title: "创建人", templet: "<div>{{d.creator || ''}}<br>{{d.createTime || ''}}</div>" },
            { field: "modify", title: "修改人", templet: "<div>{{d.modifier || ''}}<br>{{d.modifyTime || ''}}</div>" },
            { title: "操作", toolbar: "#shop_shopDescribeTpl_toolbar" },
          ],
        ],
        limits: [300, 400, 500],
        limit: 300,
        page: true,
        done: function (_, _, count) {
          // table总数量
          $("#shop_shopDescribeTpl_total").text(count)
          _this.tableToor()
        },
      })
    },
    // table 工具栏
    tableToor: function () {
      const _this = this
      table.on("tool(shop_shopDescribeTpl_table)", function (obj) {
        switch (obj.event) {
          case "edit":
            //   打开编辑弹窗
            _this.editModal(obj, "single")
            break
        }
      })
    },
    // 监听tab
    handleTab: function () {
      element.on("tab(shop_shopDescribeTpl_tab)", function (data) {
        $("#shop_shopDescribeTpl_search").click()
      })
    },
    exportTplFile:function(){
      $("#shop_shopDescribeTpl_batch_export").click(function () {
        transBlob(
          {
            url: "/lms/shopee/shopdescrModel/downTemplate",
            fileName: "修改店铺描述模板.xlsx",
          },
          "get"
        )
          .then(function () {
            layer.msg("下载开始", { icon: 1 });
          })
          .catch(function (err) {
            layer.msg(err, { icon: 2 });
          });
      });
    },
    upLoadFile:function(){
      upload.render({
        elem: "#shop_shopDescribeTpl_batch_import", //绑定元素
        url: "/lms/shopee/shopdescrModel/newOrUpdateByExcel", //上传接口
        contentType: "multipart/form-data",
        accept: 'file',
        done: function (res) {
          //上传完毕回调
          if(res.code=='0000'){
            layer.msg(res.msg, { icon: 1 });
            if(Array.isArray(res.data) && res.data.length){
              layer.open({
                title: "失败数据",
                id: "shop_shopDescribeTpl_export_resultId",
                area: ["600px", "600px"],
                content: $("#shop_shopDescribeTpl_export_result").html(),
                success: function (layero) {
                  table.render({
                    elem: "#shop_shopDescribeTpl_export_result_Table",
                    id: "shop_shopDescribeTpl_export_result_Table_id",
                    data: res.data,
                    limit: 999,
                    cols: [
                      [
                        { field: "storeAcct", title: "店铺名称" },
                        { field: "reason", title: "失败原因"},
                      ],
                    ],
                  });
                },
              });
            }
          }else{
            layer.msg(res.msg, { icon: 2 });
          }
        },
        error: function (err) {
          //请求异常回调
          layer.msg(err, { icon: 2 });
        },
      });
    },
    // 批量编辑
    batchEdit: function () {
      const _this = this
      $("#shop_shopDescribeTpl_batch_edit").click(function () {
        const { data } = table.checkStatus("shop_shopDescribeTpl_tableId")
        if (!data.length) return layer.msg("请选择数据", { icon: 7 })
        _this.editModal(data, "multy")
      })
    },
    // 编辑弹窗，type值可以为multy,single,
    editModal: function (obj, type) {
      const _this = this
      let curIndex = layer.open({
        type: 1,
        title: "编辑",
        btn: ["保存", "取消"],
        area: ["700px", "560px"],
        id: Date.now(),
        content: "",
        success: function (layero) {
          laytpl($("#shop_shopDescribeTpl_editModal").html()).render({}, function (html) {
            layero.find(".layui-layer-content").html(html)
          })
          if (type === "single") {
            //赋值
            $("#shop_shopDescribeTpl_edit_form").find("textarea[name=descrHeader]").val(obj.data.descrHeader)
            $("#shop_shopDescribeTpl_edit_form").find("textarea[name=descrTail]").val(obj.data.descrTail)
          }
        },
        yes: function (index, layero) {
          //do something
          const { descrHeader, descrTail } = serializeObject($("#shop_shopDescribeTpl_edit_form"))
          let paramsArr = []
          if (type === "single") {
            paramsArr = [].concat({
              id: obj.data.id,
              storeAcctId: obj.data.storeAcctId,
            })
          } else if (type === "multy") {
            paramsArr = obj.map(item => ({
              id: item.id,
              storeAcctId: item.storeAcctId,
            }))
          }
          paramsArr = paramsArr.map(item => ({
            ...item,
            descrHeader: descrHeader,
            descrTail: descrTail,
          }))
          _this.batchEditAjax(paramsArr).then(res => {
            layer.msg(res, { icon: 1 })
            // 批量更新
            const modifier = $("#lmsUsername").text()
            const modifyTime = Format(new Date().getTime(), "yyyy-MM-dd hh:mm:ss")
            if (type === "multy") {
              $("#shop_shopDescribeTpl_search").click()
            } else if (type === "single") {
              // 单个更新
              obj.update({
                descrTail: descrTail,
                descrHeader: descrHeader,
                modifier,
                modifyTime,
              })
              obj.tr.find('td[data-field="descrHeader"] div').text(descrHeader)
              obj.tr.find('td[data-field="descrTail"] div').text(descrTail)
              obj.tr.find('td[data-field="modify"] div').html(modifier + "<br>" + modifyTime)
            }
            layer.close(index) //如果设定了yes回调，需进行手工关闭
            _this.initPersonType()
          })
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
    // 编辑
    batchEditAjax: function (arr) {
      return commonReturnPromise({
        type: "post",
        params: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        url: ctx + "/shopee/shopdescrModel/editModels",
      })
    },
  }
  shopDescribeTplName.init()
})
