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

  orderAnalysisLogisRuleName = {
    init: function () {
      let data = JSON.parse(window.localStorage.getItem("analysisLogisRule"))
      const _this = this
      const getTpl = order_logisRule_match_analysisLayerTpl.innerHTML
      const view = document.getElementById("order_logisRule_match_analysisLayerContainer")
      laytpl(getTpl).render(data, function (html) {
        view.innerHTML = html
        _this.handleTab(data)
        //导出功能
        _this.handleExport(data["resultMap"])
        //排序
        _this.handleSort(data["resultMap"])
      })
    },
    handleTab: function (data) {
      const _this = this
      //监听切换,重新渲染表格
      element.on("tab(order_logisRule_match_analysis_tabs)", function (obj) {
        let attr = obj.elem.context.dataset.attr
        _this.tableRender(data["resultMap"][attr] || [])
      })
    },
    tableRender: function (data) {
      let str = ""
      //筛选最低运费
      let minimumPrice
      if (data[0] && data[0]["logisticsPrice"] != null) {
        minimumPrice = Math.min.apply(
          Math,
          data.map(item => item["logisticsPrice"] || 0)
        )
      }
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let shallowYellowTag = item["logisticsPrice"] != null && minimumPrice == item["logisticsPrice"]
        str += `
        <tr class="${shallowYellowTag ? "shallow-yellow" : ""}">
        <td>${i + 1}</td>
        <td>${item.priority}</td>
        <td>${item.logisticsTypeName}</td>
        <td>${item.ruleName}</td>
        <td>${item.remark}</td>
        <td>${item.desc}</td>
    </tr>
    `
      }
      $("#order_logisRule_match_analysis_tbody").empty().html(str)
    },
    handleExport: function (resultMap) {
      $("#order_logisRule_match_analysis_exportBtn").on("click", function () {
        //找出选中的标签
        let tag = $("#order_logisRule_match_analysis_tabs>ul>li.layui-this").data("attr")
        let data = resultMap[tag] || []
        if (data.length == 0) {
          return layer.msg("没有需要导出的数据", { icon: 7 })
        } else {
          loading.show()
          transBlob({
            url: ctx + "/platorder/exportMatchInfo.html",
            formData: JSON.stringify(data),
            fileName: tag + ".xlsx",
            contentType: "application/json",
          })
            .then(function (result) {
              loading.hide()
              layer.alert("导出成功", { icon: 1 })
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 })
            })
        }
      })
    },
    handleSort: function () {
      const _this = this
      $("#order_logisRule_match_analysisLayerContainer").on("click", ".priority_sort .layui-icon", function () {
        let isUp = $(this).hasClass("match-analysis-up")
        let tag = $("#order_logisRule_match_analysis_tabs>ul>li.layui-this").data("attr")
        let data = resultMap[tag] || []
        let newData = []
        if (isUp) {
          //从小到大排序-升序
          newData = data.sort((a, b) => {
            return a.priority - b.priority
          })
        } else {
          //从大到小排序-降序
          newData = data.sort((a, b) => {
            return b.priority - a.priority
          })
        }
        _this.tableRender(newData)
      })
    },
  }
  orderAnalysisLogisRuleName.init()
})
