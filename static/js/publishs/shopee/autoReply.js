;(function ($, layui, window, document, undefined) {
  layui.use(["admin", "form", "layer", "table", "formSelects", "element", "upload", "laydate", "laytpl"], function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      table = layui.table,
      formSelects = layui.formSelects,
      element = layui.element,
      upload = layui.upload,
      laydate = layui.laydate,
      laypage = layui.laypage,
      laytpl = layui.laytpl
    $ = layui.$

    let shopAutoReply = new Vue({
      el: "#shop_autoReply_page",
      data() {
        return {
          siteList: [],
          storeAcctList: [],
          creatorList: [],
          replyTypeList: [],
          delayOrderList: [],
          changeProdOrderList: [],
          oaOrderStatusList: [],
          // 平台订单物流状态
          platLogisticsStatusList: [],
          // 平台订单状态
          platOrderStatusList: [],
          // 买家次数
          buyerRejectNumberList: [0, 1, 2, 3, 4, 5, 9999].map(item => ({ value: item, name: item === 9999 ? "5次以上" : item + "次" })),
          originStoreAcctIdList: "",
          tabIndex: "1",
        }
      },
      async mounted() {
        await this.initBasicData()
        this.initStoreAcct()
        this.initSite()
        await this.initcreator()
        form.render()
      },
      methods: {
        // 搜索
        handleSearch() {
          let formData = serializeObject($("#shop_autoReply_SearchForm"))
          formData.siteList = this.stringTransArr(formData.siteList)
          formData.storeAcctIdList = this.stringTransArr(formData.storeAcctIdList)
          formData.autoReplyType = $("#shop_autoReply_tabs").find("ul .layui-this").data("value")
          this.tableRender(formData)
        },
        stringTransArr(str) {
          if (str) {
            return str.split(",")
          }
          return []
        },
        clear() {
          $("#shop_autoReply_SearchForm").find("select[name=creatorId]").val("")
          $("#shop_autoReply_SearchForm").find("select[name=status]").val("")
          form.render()
        },
        tableRender(formData) {
          const _this = this
          table.render({
            elem: "#shop_autoReply_table",
            id: "shop_autoReply_table_id",
            method: "post",
            url: "/chat/shopee/autoReplyRule/listAutoReplyRule",
            limit: 999,
            where: formData,
            created: function (res) {
              if (res.code === "0000" && Array.isArray(res.data)) {
                res.data = res.data.map(item => {
                  let autoReplyTypeObj = _this.replyTypeList.filter(elem => elem.code === item.autoReplyType)[0] || {}
                  let siteObj = _this.siteList.filter(elem => item.salesSite === elem.code)[0] || {}
                  return { ...item, autoReplyTypeStr: autoReplyTypeObj.type || "", siteStr: siteObj.name || "" }
                })
              }
            },
            cols: _this.chooseCols(),
            page: true, //开启分页
            contentType: "application/json",
            limits: [100, 200, 500],
            limit: 100,
            done: function (res, curr, count) {
              $("#shop_autoReply_tabs").find("li.layui-this>span").html(count)
            },
          })
        },
        chooseCols: function () {
          let startCol = [
            { type: "checkbox" },
            {
              field: "status",
              title: "状态",
              templet: "#shop_autoReply_status",
            },
            {
              field: "autoReplyTypeStr",
              title: "自动回复类型",
            },
            {
              field: "siteStr",
              title: "站点",
            },
          ]
          if (![5, 6].includes(this.tabIndex)) {
            startCol.push({
              field: "storeCount",
              title: "应用店铺数",
              templet: d => `<div lay-event="storeNumInfo" style="color:#1E90FF;cursor:pointer;">${d.storeCount}</div>`,
            })
          }

          let endCol = [
            {
              field: "verbalTrick",
              title: "话术",
              templet: "#shop_autoReply_replyMsg_tpl",
            },
            [1, 2, 3, 4].includes(this.tabIndex)
              ? {
                  field: "creator",
                  title: "创建人",
                }
              : {
                  field: "creator",
                  title: "操作人",
                  templet: d => `创建:${d.creator}<br>修改:<span class="modifier">${d.modifier || ""}</span>`,
                },
            {
              title: "操作",
              toolbar: "#shop_autoReply_toolbar",
            },
          ]
          if (this.tabIndex !== 5) {
            endCol.splice(1, 0, {
              field: "sendVoucher",
              title: "店铺优惠券发送",
              templet: "#shop_autoReply_sendVoucher_status",
            })
          }
          let colObj = {
            1: [
              {
                field: "deadlineDays",
                title: "截止天数",
              },
              {
                field: "orderStatus",
                title: "仓库订单状态",
                templet: d => d.orderStatusList.map(item => item.orderStatus).join(),
              },
            ],
            2: [
              {
                field: "delayDays",
                title: "延迟天数",
              },
              {
                field: "orderStatus",
                title: "仓库订单状态",
                templet: d => d.orderStatusList.map(item => item.orderStatus).join(),
              },
            ],
            3: [
              {
                field: "emptyComment",
                title: "评论内容是否为空",
                templet: d => (d.emptyComment ? "是" : "否"),
              },
              {
                field: "ratingStar",
                title: "评论星星数",
              },
            ],
            4: [
              {
                field: "voucherRemainingQuantity",
                title: "优惠券剩余数",
              },
            ],
            5: [],
            6: [
              {
                field: "orderCnAmountGte",
                title: "订单金额&ge;",
                templet: "<div>{{d.orderCnAmountGte}} &yen;</div>",
              },
            ],
            7: [
              {
                field: "orderProcessStatusEnumList",
                title: "OA订单状态",
                templet: d => d.orderProcessStatusEnumList.map(item => item.name).join(),
              },
            ],
            // 8: [{ field: "logisticsStatus", title: "平台订单物流状态" }],
            9: [
              { field: "platOrderStatus", title: "平台订单状态" },
              {
                field: "buyerRejectNumber",
                title: "买家拒绝次数",
                templet: d => {
                  let buyerRejectNumberStr = ""
                  if (d.buyerRejectNumber !== "") {
                    buyerRejectNumberStr = d.buyerRejectNumber
                      .split(",")
                      .map(item => (item == 9999 ? "5次以上" : item))
                      .join()
                  }
                  return buyerRejectNumberStr
                },
              },
            ],
            10: [
              { field: "logisticsStatus", title: "平台订单物流状态", templet: d => d.logisticsStatus +'</br>' + "包含" + d.logisticsDescription },
              {
                field: "buyerRejectNumber",
                title: "买家拒绝次数",
                templet: d => {
                  let buyerRejectNumberStr = ""
                  if (d.buyerRejectNumber !== "") {
                    buyerRejectNumberStr = d.buyerRejectNumber
                      .split(",")
                      .map(item => (item == 9999 ? "5次以上" : item))
                      .join()
                  }
                  return buyerRejectNumberStr
                },
              },
            ],
            11:[
              { field: "logisticsStatus", title: "平台订单物流状态", templet: d => d.logisticsStatus +'</br>' + "包含" + d.logisticsDescription },
            ],
            12:[
              { field: "platOrderStatus", title: "平台订单状态" },
              { 
                field: "sendIntervalValue", 
                title: "发送次数及间隔", 
                templet: d=>`${d.sameOrderSendNum}次<br>每次间隔时长：${d.sendIntervalValue}${d.sendIntervalValueType}` },
            ]
          }

          return [startCol.concat(colObj[this.tabIndex] || []).concat(endCol)]
        },
        showInfo(dom) {
          let parentDom = $(dom).parent()
          let isNeedHide = parentDom.hasClass("moreLineText")
          if (!isNeedHide) {
            parentDom.css("-webkit-line-clamp", "999")
            parentDom.addClass("moreLineText")
          } else {
            parentDom.removeClass("moreLineText")
            parentDom.css("-webkit-line-clamp", "4")
          }
        },
        //
        handleBatchDel() {
          const { data } = table.checkStatus("shop_autoReply_table_id")
          const _this = this
          if (data.length) {
            let popIndex = layer.confirm("确定批量删除嘛?", function () {
              let idList = data.map(item => Number(item.id))
              _this.delAjax(idList).then(function (result) {
                layer.msg(result, { icon: 1 })
                _this.initcreator(() => commonTableBatchDel("shop_autoReply_table_id", "shop_autoReply_table", "id", "shop_autoReplyCard", data, _this.handleSearch))
                layer.close(popIndex)
              })
            })
          } else {
            return layer.msg("请选择", { icon: 7 })
          }
        },
        // 批量关闭
        handleBatchOff() {
          const _this = this
          const { data } = table.checkStatus("shop_autoReply_table_id")
          if (data.length) {
            let popIndex = layer.confirm("确定批量关闭嘛?", function () {
              let idList = data.map(item => Number(item.id))
              let ids = idList.join()
              _this.fetchChangeStatus(ids, false).then(function (result) {
                layer.msg(result, { icon: 1 })
                // table.cache.shop_autoReply_table_id.forEach((item, index) => {
                //   if (idList.includes(item.id)) {
                //     table.cache.shop_autoReply_table_id[index].status = false
                //   }
                // })
                // _this.changeStatus(false)
                // form.render()
                _this.handleSearch()
                layer.close(popIndex)
              })
            })
          } else {
            return layer.msg("请选择", { icon: 7 })
          }
        },
        // 批量开启
        handleBatchOn() {
          const { data } = table.checkStatus("shop_autoReply_table_id")
          const _this = this
          if (data.length) {
            let popIndex = layer.confirm("确定批量开启嘛?", function () {
              let idList = data.map(item => Number(item.id))
              let ids = idList.join()
              _this.fetchChangeStatus(ids, true).then(function (result) {
                layer.msg(result, { icon: 1 })
                // table.cache.shop_autoReply_table_id.forEach((item, index) => {
                //   if (idList.includes(item.id)) {
                //     table.cache.shop_autoReply_table_id[index].status = true
                //   }
                // })
                // _this.changeStatus(true)
                // form.render()
                _this.handleSearch()
                layer.close(popIndex)
              })
            })
          } else {
            return layer.msg("请选择", { icon: 7 })
          }
        },
        changeStatus(status) {
          let trDoms = $("#shop_autoReply_table").next().find("tbody tr")
          trDoms.each(function () {
            let checked = $(this).find("input[name=layTableCheckbox]").prop("checked")
            if (checked) {
              $(this).find("input[name=status]").prop("checked", status)
            }
          })
        },

        handleAdd() {
          this.update()
        },
        handleSetRule() {
          let obj = {}
          let porIndex = layer.open({
            title: "自动回复规则配置",
            type: 1, //不加该属性,就会出现[object Object]
            area: ["800px", "600px"],
            btn: ["保存", "关闭"],
            id: "shop_autoReply_replyRule_tpler",
            content: $("#shop_autoReply_replyRule").html(),
            success: function (layero) {
              let dateArr = new Array(28).fill("").map((_, index) => ({ value: index + 1, name: index + 1 }))
              let hourArr = new Array(24).fill("").map((_, index) => ({ value: index, name: ("00" + index).slice(-2) + "时" }))
              let minutesArr = new Array(60).fill("").map((_, index) => ({ value: index, name: ("00" + index).slice(-2) + "分" }))
              laytpl($("#shop_autoReply_replyRule_tpler").html()).render({ ...obj, dateArr, hourArr, minutesArr }, function (html) {
                layero.find(".layui-layer-content").html(html)
              })
              formSelects.render("")
              $("#shop_autoReply_tree").on("click", "li", function () {
                let formDom = $("#shop_autoReply_replyRuleForm")
                $(this).siblings("li").removeClass("layui-this")
                $(this).addClass("layui-this")
                let replytype = $(this).data("replytype")
                if (replytype) {
                  $("#shop_autoReply_replyRuleForm").show()
                  commonReturnPromise({
                    type: "post",
                    url: `/chat/shopee/autoReplyExecuteRule/one/${replytype}`,
                  }).then(res => {
                    if (typeof res === "string") {
                      res = {}
                    } else {
                      obj = res
                    }
                    formDom.find("select[name=replyDateType]").val(res.replyDateType || "")
                    if (res.replyDateType == 1) {
                      formDom.find(".showWeek").show()
                      formDom.find(".showDate").hide()
                      formSelects.value("shop_autoReply_replyWeekday", res.replyDate ? res.replyDate.split(",") : [])
                      formSelects.value("shop_autoReply_replyMonthday", [])
                    } else {
                      formDom.find(".showWeek").hide()
                      formDom.find(".showDate").show()
                      formSelects.value("shop_autoReply_replyMonthday", res.replyDate ? res.replyDate.split(",") : [])
                      formSelects.value("shop_autoReply_replyWeekday", [])
                    }
                    formDom.find("select[name=replyHour]").val(res.replyStartTime ? res.replyStartTime.split(",")[0] : "")
                    formDom.find("select[name=replyMinute]").val(res.replyStartTime ? res.replyStartTime.split(",")[1] : "")
                    formDom.find("input[name=replyTimeSpace]").val(res.replyTimeSpace)
                    form.render()
                  })
                } else {
                  $("#shop_autoReply_replyRuleForm").hide()
                }
              })
              form.render()
            },
            yes: function () {
              let autoReplyType = $("#shop_autoReply_tree").find(".layui-this").data("replytype")
              if (autoReplyType) {
                let formData = serializeObject($("#shop_autoReply_replyRuleForm"))
                formData.autoReplyType = Number(autoReplyType)
                formData.replyDateType = Number(formData.replyDateType)
                if (!formData.replyDateType) return layer.msg("请选择回复日期")
                if (formData.replyTimeSpace !== "") {
                  formData.replyTimeSpace = Number(formData.replyTimeSpace)
                }
                formData.replyDate = formData.replyDateType === 1 ? formData.replyWeekday : formData.replyMonthday
                if (!formData.replyDate) return layer.msg(formData.replyDateType === 1 ? "请选择回复具体星期" : "请选择回复具体日期")
                if (formData.replyHour === undefined) return layer.msg("请选择回复开始时间")
                if (formData.replyMinute === undefined) return layer.msg("请选择回复开始时间")
                if (!Number.isInteger(formData.replyTimeSpace)) return layer.msg("回复时间间隔为正整数")
                if (formData.replyTimeSpace > 10) return layer.msg("回复时间间隔为1-10秒")
                formData.replyStartTime = formData.replyHour + "," + formData.replyMinute
                commonReturnPromise({
                  url: "/chat/shopee/autoReplyExecuteRule/saveRule",
                  type: "post",
                  params: JSON.stringify({ ...obj, ...formData }),
                  contentType: "application/json",
                }).then(() => {
                  layer.msg("保存成功", { icon: 1 })
                  layer.close(porIndex)
                })
              } else {
                return layer.msg("请选择回复类型")
              }
            },
          })
        },
        update(obj = { data: {} }) {
          const _this = this
          const { data } = obj
          let isAdd = JSON.stringify(data) === "{}" ? true : false
          let porIndex = layer.open({
            title: isAdd ? "新增" : "修改",
            type: 1, //不加该属性,就会出现[object Object]
            area: ["800px", "580px"],
            btn: isAdd ? ["保存", "清空"] : ["保存", "关闭"],
            id: "shop_autoReply_setRule_tpler",
            content: $("#shop_autoReply_setRule").html(),
            success: function (layero) {
              let formDom = $("#shop_autoReply_setRuleForm")
              if (!isAdd) {
                formDom.find("select[name=autoReplyType]").attr("disabled", true)
                if (data.autoReplyType != 5) {
                  formDom.find("select[name=salesSite]").attr("disabled", true)
                }
                if(data.autoReplyType == '12'){
                  $("#shop_autoReply_setRuleForm").find(".verbalTrick_title").text('COD订单话术')
                }else{
                  $("#shop_autoReply_setRuleForm").find(".verbalTrick_title").text('话术')
                }
              }
              // 回复类型
              commonRenderSelect("shop_autoReply_setRuleForm_autoReplyType", _this.replyTypeList, { name: "type", code: "code", selected: data.autoReplyType })
              // 站点
              commonRenderSelect("shop_autoReply_setRule_site", _this.siteList, { name: "name", code: "code", selected: data.salesSite })
              // 话术
              formDom.find("textarea[name=verbalTrick]").val(data.verbalTrick)
              // 延长发货 仓库订单状态
              formSelects.data("shop_autoReply_warehouseStatus1", "local", { arr: _this.delayOrderList })
              // 换货 仓库订单状态
              formSelects.data("shop_autoReply_warehouseStatus2", "local", { arr: _this.changeProdOrderList })
              // 取消订单确认
              let arr3 = _this.oaOrderStatusList.map(item => ({ ...item, selected: (data.orderProcessStatusList || []).includes(item.name) }))
              formSelects.data("shop_autoReply_orderProcessStatusList", "local", { arr: arr3 })
              // 平台订单物流状态
              formSelects.data("shop_autoReply_logisticsStatusList", "local", { arr: _this.platLogisticsStatusList })
              // 平台订单状态
              formSelects.data("shop_autoReply_platOrderStatusList", "local", { arr: _this.platOrderStatusList })
              // 买家次数
              formSelects.data("shop_autoReply_buyerRejectNumber", "local", { arr: _this.buyerRejectNumberList })

              formSelects.data("shop_autoReply_voucherType", "local", {
                arr: [
                  { name: "折扣金额", value: 1, selected: (data.voucherType || []).includes(1) },
                  { name: "折扣百分比", value: 2, selected: (data.voucherType || []).includes(2) },
                  { name: "金币返还", value: 3, selected: (data.voucherType || []).includes(3) },
                ],
              })
              if (data.autoReplyType == "2") {
                //换货
                // 选中订单状态数据
                const orderStatusList = (data.orderStatusList || []).map(item => Number(item.code))
                formDom.find("input[name=delayDays]").val(data.delayDays)
                formSelects.value("shop_autoReply_warehouseStatus2", orderStatusList)
              } else if (data.autoReplyType == "3") {
                // 差评
                formDom.find("select[name=emptyComment]").val(data.emptyComment.toString())
                formDom.find("select[name=ratingStar]").val(data.ratingStar)
              } else if (data.autoReplyType == "4") {
                // 店铺优惠券
              } else if (data.autoReplyType == "5") {
                // 乐言自动回复
              } else if (data.autoReplyType == "6") {
                // 发货确认
                formDom.find("input[name=orderCnAmountGte]").val(data.orderCnAmountGte)
              } else if (data.autoReplyType == "7") {
                formSelects.value("shop_autoReply_orderProcessStatusList", data.orderProcessStatusList)
                // 取消订单确认
              } else if (data.autoReplyType == "8") {
                // 要好评
                // formSelects.value("shop_autoReply_logisticsStatusList", data.logisticsStatus.split(","))
              } else if (data.autoReplyType == "9") {
                // COD发货确认
                formSelects.value("shop_autoReply_platOrderStatusList", data.platOrderStatus.split(","))
                formSelects.value("shop_autoReply_buyerRejectNumber", data.buyerRejectNumber.split(","))
              } else if (data.autoReplyType == "10") {
                // COD签收提醒
                formSelects.value("shop_autoReply_logisticsStatusList", data.logisticsStatus.split(","))
                formSelects.value("shop_autoReply_buyerRejectNumber", data.buyerRejectNumber.split(","))
                formDom.find("input[name=logisticsDescription]").val(data.logisticsDescription)
              } else if (data.autoReplyType == "11") {
                // 关税类型
                formSelects.value("shop_autoReply_logisticsStatusList", data.logisticsStatus.split(","))
                formDom.find("input[name=logisticsDescription]").val(data.logisticsDescription)
              }else if(data.autoReplyType == "12"){
                formDom.find("textarea[name=notCodVerbalTrick]").val(data.notCodVerbalTrick)
                formDom.find("input[name=orderTimeCnGreaterThanOrEqualValue]").val(data.orderTimeCnGreaterThanOrEqualValue)
                formDom.find("input[name=orderTimeCnLessThanValue]").val(data.orderTimeCnLessThanValue)
                formDom.find("select[name=orderTimeCnValueType]").val(data.orderTimeCnValueType)
                formDom.find("input[name=sameOrderSendNum]").val(data.sameOrderSendNum)
                formDom.find("input[name=sendIntervalValue]").val(data.sendIntervalValue)
                formDom.find("select[name=sendIntervalValueType]").val(data.sendIntervalValueType)
              } else {
                //延长发货
                // 选中订单状态数据
                const orderStatusList = (data.orderStatusList || []).map(item => Number(item.code))
                formDom.find("input[name=deadlineDays]").val(data.deadlineDays)
                formSelects.value("shop_autoReply_warehouseStatus1", orderStatusList)
              }

              _this.showOptions(data.autoReplyType || 1)

              // 优惠券选项
              if (!isAdd) {
                if (data.autoReplyType == "5") {
                  formDom.find(".showVoucherBasic").hide()
                } else {
                  formDom.find(`input[name=sendVoucher][value=${data.sendVoucher}]`).attr("checked", true)
                  if (data.sendVoucher) {
                    formDom.find(".showVoucherOption").show()
                    data.voucherStartEndLeftDay !== undefined && formDom.find(`input[name=voucherStartEndLeftDay]`).val(data.voucherStartEndLeftDay)
                    data.voucherStartEndRightDay !== undefined && formDom.find(`input[name=voucherStartEndRightDay]`).val(data.voucherStartEndRightDay)
                    data.voucherEndLeftDay !== undefined && formDom.find(`input[name=voucherEndLeftDay]`).val(data.voucherEndLeftDay)
                    data.voucherEndRightDay !== undefined && formDom.find(`input[name=voucherEndRightDay]`).val(data.voucherEndRightDay)
                    data.voucherRemainingQuantityLeft !== undefined && formDom.find(`input[name=voucherRemainingQuantityLeft]`).val(data.voucherRemainingQuantityLeft)
                    data.voucherRemainingQuantityRight !== undefined && formDom.find(`input[name=voucherRemainingQuantityRight]`).val(data.voucherRemainingQuantityRight)
                    data.voucherType !== undefined && formDom.find(`select[name=voucherType]`).val(data.voucherType)
                    data.voucherShowType !== undefined && formDom.find(`select[name=voucherShowType]`).val(data.voucherShowType)
                  } else {
                    formDom.find(".showVoucherOption").hide()
                  }
                }
              }
              form.render()
            },
            yes: function (index, layero) {
              let formData = serializeObject($("#shop_autoReply_setRuleForm"))
              formData.autoReplyType = Number($("#shop_autoReply_setRuleForm").find("select[name=autoReplyType]").val())
              formData.salesSite = $("#shop_autoReply_setRule_site").val()
              formData.orderStatusList = []
              formData.orderProcessStatusList = []
              if (!formData.autoReplyType) return layer.msg("请选择回复类型")
              if (!formData.salesSite) return layer.msg("请选择站点")
              if (!formData.verbalTrick) return layer.msg("请输入话术")
              // 回复话术字段均新增长度限制600
              if(formData.verbalTrick.length>600) return layer.msg('话术最多输入600')
              if (formData.autoReplyType === 2) {
                //换货
                if (formData.delayDays === "") return layer.msg("请输入延迟天数")
                formData.delayDays = Number(formData.delayDays)
                if (formData.delayDays === 0) return layer.msg("延迟天数需为正整数")
                if (!Number.isInteger(formData.delayDays)) return layer.msg("延迟天数需为正整数")
                formData.orderStatusList = formSelects.value("shop_autoReply_warehouseStatus2", "val").map(Number)
                formData.orderStatusListStr = formData.orderStatusList.join()
                if (!formData.orderStatusList.length) return layer.msg("请选择仓库订单状态")
              } else if (formData.autoReplyType === 3) {
                // 差评
                formData.emptyComment = formData.emptyComment == "true" ? true : false
                formData.ratingStar = Number(formData.ratingStar)
              } else if (formData.autoReplyType === 4) {
                //优惠券
                if (formData.voucherRemainingQuantity === "") return layer.msg("请输入优惠券剩余数量")
                formData.voucherRemainingQuantity = Number(formData.voucherRemainingQuantity)
                if (formData.voucherRemainingQuantity === 0) return layer.msg("优惠券剩余数量需为正整数")
              } else if (formData.autoReplyType === 5) {
                //乐言自动回复
              } else if (formData.autoReplyType === 6) {
                // 发货确认
                if (!formData.orderCnAmountGte) return layer.msg("请输入订单金额≥")
                if (Number(formData.orderCnAmountGte) === 0) return layer.msg("订单金额需要大于0")
                formData.orderCnAmountGte = Number(formData.orderCnAmountGte)
              } else if (formData.autoReplyType === 7) {
                // 取消订单确认
                formData.orderProcessStatusList = formSelects.value("shop_autoReply_orderProcessStatusList", "val").map(Number)
                if (!formData.orderProcessStatusList.length) return layer.msg("请选择OA订单状态")
              } else if (formData.autoReplyType === 8) {
                // 要好评
                delete formData.logisticsStatus
                // if (!formData.logisticsStatus) return layer.msg("请选择平台订单物流状态")
              } else if (formData.autoReplyType === 9) {
                // COD发货确认
                if (!formData.platOrderStatus) return layer.msg("请选择平台订单状态")
                if (!formData.buyerRejectNumber) return layer.msg("请选择买家拒绝次数")
              } else if (formData.autoReplyType === 10) {
                // COD签收提醒
                if (!formData.logisticsStatus) return layer.msg("请选择平台订单物流状态")
                if (!formData.logisticsDescription) return layer.msg("请输入订单物流描述")
                if (!formData.buyerRejectNumber) return layer.msg("请选择买家拒绝次数")
              } else if (formData.autoReplyType === 11) {
                // 关税类型
                if (!formData.logisticsStatus) return layer.msg("请选择平台订单物流状态")
                if (!formData.logisticsDescription) return layer.msg("请输入订单物流描述")
              } else if(formData.autoReplyType === 12){
                if(!formData.orderTimeCnGreaterThanOrEqualValue && Number(formData.orderTimeCnGreaterThanOrEqualValue) && Number(formData.orderTimeCnGreaterThanOrEqualValue)!==0) return layer.msg('请输入距订单时间的左侧值')
                if(!formData.orderTimeCnLessThanValue && Number(formData.orderTimeCnLessThanValue) && Number(formData.orderTimeCnLessThanValue)!==0) return layer.msg('请输入距订单时间的右侧值')
                if(!formData.notCodVerbalTrick) return layer.msg('请输入非COD话术')
                // 回复话术字段均新增长度限制600
              if(formData.notCodVerbalTrick.length>600) return layer.msg('话术最多输入600')
                if(!Number(formData.sameOrderSendNum)) return layer.msg('请输入同一订单发送次数')
                if(!Number(formData.sendIntervalValue)) return layer.msg('请输入多次发送间隔时间')
                formData.platOrderStatus = $("#shop_autoReply_setRuleForm").find("select[name=platOrderStatus]").val()
              } else {
                // 延长发货
                if (formData.deadlineDays === "") return layer.msg("请输入截止天数")
                formData.deadlineDays = Number(formData.deadlineDays)
                if (formData.deadlineDays === 0) return layer.msg("截止天数需为正整数")
                if (!Number.isInteger(formData.deadlineDays)) return layer.msg("截止天数需为正整数")
                formData.orderStatusList = formSelects.value("shop_autoReply_warehouseStatus1", "val").map(Number)
                formData.orderStatusListStr = formData.orderStatusList.join()
                if (!formData.orderStatusList.length) return layer.msg("请选择仓库订单状态")
              }
              //优惠券相关的
              if (formData.autoReplyType !== 5) {
                if (formData.sendVoucher === undefined) return layer.msg("请选择是否发送店铺优惠券")
                formData.sendVoucher = formData.sendVoucher === "true" ? true : false
                formData.voucherStartEndLeftDay === "" && (voucherStartEndLeftDay = null)
                formData.voucherStartEndRightDay === "" && (formData.voucherStartEndRightDay = null)
                formData.voucherEndLeftDay === "" && (formData.voucherEndLeftDay = null)
                formData.voucherEndRightDay === "" && (formData.voucherEndRightDay = null)
                formData.voucherRemainingQuantityLeft === "" && (formData.voucherRemainingQuantityLeft = null)
                formData.voucherRemainingQuantityRight === "" && (formData.voucherRemainingQuantityRight = null)
                formData.voucherType === "" && (formData.voucherType = null)
                formData.voucherShowType === "" && (formData.voucherShowType = null)
                if (!formData.sendVoucher) {
                  formData.voucherStartEndLeftDay = null
                  formData.voucherStartEndRightDay = null
                  formData.voucherEndLeftDay = null
                  formData.voucherEndRightDay = null
                  formData.voucherRemainingQuantityLeft = null
                  formData.voucherRemainingQuantityRight = null
                  formData.voucherType = null
                  formData.voucherShowType = null
                }
              }
              // 调接口
              if (isAdd) {
                formData.orderStatusList = formData.orderStatusList.join()
                formData.orderProcessStatusList = formData.orderProcessStatusList.join()

                _this.fetchAddRule(formData).then(res => {
                  layer.close(porIndex)
                  layer.msg("添加成功", { icon: 1 })
                  _this.initcreator()
                  _this.handleSearch()
                })
              } else {
                _this.fetchUpdateRule({ ...data, ...formData }).then(res => {
                  layer.close(porIndex)
                  layer.msg(res, { icon: 1 })
                  _this.handleSearch()
                  // formData.siteStr = (_this.siteList.filter(item => item.code === formData.salesSite)[0] || {}).name
                  // formData.modifier = $("#lmsUsername").text()
                  // data.autoReplyType && _this.changeCacheData({ ...formData }, data.id)
                  // if (data.autoReplyType === 1) {
                  //   formData.orderStatus = _this.delayOrderList.filter(item => formData.orderStatusList.includes(item.value)).map(item => item.name)
                  // } else if (data.autoReplyType === 2) {
                  //   formData.orderStatus = _this.delayOrderList.filter(item => formData.orderStatusList.includes(item.value)).map(item => item.name)
                  // } else if (data.autoReplyType == 3) {
                  //   formData.emptyComment = formData.emptyComment == true ? "是" : "否"
                  // } else if (data.autoReplyType == 7) {
                  //   formData.orderProcessStatusEnumList = formSelects.value("shop_autoReply_orderProcessStatusList", "nameStr")
                  // }
                  // _this.changeRender(obj.tr, { ...formData, id: data.id })
                })
              }
            },
            btn2: function () {
              if (isAdd) {
                let formDom = $("#shop_autoReply_setRuleForm")
                formDom[0].reset()
                // 延长发货 仓库订单状态
                formSelects.value("shop_autoReply_warehouseStatus1", [])
                // 换货 仓库订单状态
                formSelects.value("shop_autoReply_warehouseStatus2", [])
                // OA订单状态
                formSelects.value("shop_autoReply_orderProcessStatusList", [])
                // 平台订单物流状态
                formSelects.value("shop_autoReply_logisticsStatusList", [])
                // 平台订单状态
                formSelects.value("shop_autoReply_platOrderStatusList", [])
                // 清空radio选项
                formDom.find("input").filter(":radio").removeAttr("checked")
                form.render()
                return false
              } else {
                layer.close(porIndex)
              }
            },
          })
        },

        // 联动
        showOptions(autoReplyType) {
          let formDom = $("#shop_autoReply_setRuleForm")
          const showObj = {
            showInDelay: [1], // 延长发货
            showInChange: [2], // 换货
            showInComment: [3], // 差评
            showInvoucher: [4], // 店铺优惠券
            // :[5], // 乐言自动回复
            showInDeliverGoods: [6], // 发货确认
            showInCancelOrder: [7], // 取消订单确认
            showInGoodComment: [8], // 要好评
            showInCODSend: [9], // COD发货确认
            showInCODReceive: [10, 11], // COD签收提醒
            // showInGoodCommentAndCODReceive: [8, 10],
            showInCOD: [9, 10],
            showInPayReminder: [12] // 催付款
          }
          for (let key in showObj) {
            let dom = formDom.find(`.${key}`)
            if (showObj[key].includes(Number(autoReplyType))) {
              dom.show()
            } else {
              dom.hide()
            }
          }

          // 优惠券设置 除乐言自动回复没有，其它都有
          if (autoReplyType == "5") {
            formDom.find(".showVoucherBasic").hide()
            formDom.find(".showVoucherOption").hide()
          } else {
            formDom.find(".showVoucherBasic").show()
            if (serializeObject(formDom).sendVoucher == "true") {
              formDom.find(".showVoucherOption").show()
            }
          }
        },

        chooseStore(obj = {}) {
          const _this = this
          let popIndex = layer.open({
            shadeClose: false,
            type: 1,
            title: "匹配店铺(停用店铺不显示)",
            area: ["1200px", "600px"],
            btn: ["确认", "关闭"],
            content: $("#shop_autoReply_matchStorePop").html(),
            success: function () {
              // 初始化店铺选择
              _this.initStoreFormula(obj)
              _this.matchStoreSearch(obj)
              _this.storeCheckAll()
              _this.storeCheck()
              $("#matchStoreForm_shop_autoReply").find(".showInsearch").css("opacity", 0)
              // 一键复制
              $("#shop_autoReplyCopy").click(function () {
                let copyArr = []
                $.each($("#matchStoreForm_shop_autoReply_checked input[name=storeAcctId]:checked"), function () {
                  copyArr.push($(this).attr("title"))
                })
                copyTxtToClipboard(copyArr.join())
              })
              $("#shop_autoReplyClear").click(function () {
                $.each($("#matchStoreForm_shop_autoReply_checked input[name=storeAcctId]:checked"), function () {
                  $(this).parent().remove()
                  let val = $(this).val()
                  $("#matchStoreForm_shop_autoReply").find(`input[type=checkbox][value="${val}"]`).prop("checked", false)
                })
                $("#matchStoreForm_shop_autoReply").find("input[name=checkAll]").prop("checked", false)
                form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
                form.render("checkbox", "matchStoreForm_shop_autoReply")
              })
            },
            yes: function () {
              var selectedBox = $("#matchStoreForm_shop_autoReply_checked [name=storeAcctId]:checked")
              var storeAcctIdStrRef = []
              selectedBox.each(function () {
                storeAcctIdStrRef.push($(this).data("id"))
              })
              const params = { ruleId: obj.data.id, originStoreAcctIdList: _this.originStoreAcctIdList, newStoreAcctIdList: storeAcctIdStrRef.join() }
              commonReturnPromise({
                url: "/chat/shopee/autoReplyRule/updateShopRef",
                type: "POST",
                params,
              }).then(function (result) {
                layer.msg("修改成功", { icon: 1 })
                layer.close(popIndex)
                // if (Array.isArray(result)) {
                //   const storeCount = result.filter(item => item.ifMatch).length
                //   _this.changeCacheData({ storeCount }, obj.data.id)
                //   _this.changeRender(obj.tr, { storeCount })
                // } else {
                  _this.handleSearch()
                // }
              })
            },
          })
        },
        changeCacheData(obj, id) {
          table.cache.shop_autoReply_table_id.some((item, index) => {
            if (item.id == id) {
              table.cache.shop_autoReply_table_id[index] = { ...table.cache.shop_autoReply_table_id[index], ...obj }
              return true
            }
          })
        },
        changeRender(trDom, obj) {
          if (obj.storeCount !== undefined) {
            trDom.find('td[data-field="storeCount"] div div').text(obj.storeCount)
          }
          let changeDom = [
            "siteStr",
            "deadlineDays",
            "orderStatus",
            "verbalTrick",
            "notCodVerbalTrick",
            "delayDays",
            "modifier",
            "emptyComment",
            "orderCnAmountGte",
            "orderProcessStatusEnumList",
            "sendVoucher",
            "logisticsStatus",
            "platOrderStatus",
            "buyerRejectNumber",
          ]
          changeDom.forEach(item => {
            if (obj[item] !== undefined) {
              if (obj[item] !== undefined) {
                if (item === "verbalTrick") {
                  let strHtml = `<div class="disflex">
                    <div class="logisticsNoInfo hideFourLine" data-id="${obj.id}">
                      <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
                      ${obj.verbalTrick}
                    </div>
                  </div>`
                  if(obj.autoReplyType == 12){
                    strHtml =`<div class="disflex">
                    <div class="logisticsNoInfo hideFourLine" data-id="${ obj.id }">
                      <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
                      COD：${obj.verbalTrick}
                    </div>
                   </div>
                   <div class="disflex">
                     <div class="logisticsNoInfo hideFourLine" data-id="${ obj.id}">
                      <span class="infoDetailBtn" onclick="shop_autoReply_showInfo(this)"></span>
                      非COD：${obj.notCodVerbalTrick}
                    </div>
                   </div>`
                  }
                  trDom.find(`td[data-field="${item}"] div`).html(strHtml)
                } else if (item === "modifier") {
                  trDom.find(`td[data-field="creator"] .modifier`).text(obj[item])
                } else if (item === "orderCnAmountGte") {
                  trDom.find(`td[data-field="${item}"] div`).html(obj[item] + " " + "&yen;")
                } else if (item === "sendVoucher") {
                  trDom.find(`input[name=sendVoucher]`).prop("checked", obj[item] === true ? true : false)
                } else if (item === "buyerRejectNumber") {
                  let str = obj[item]
                    .split(",")
                    .map(item => (item == 9999 ? "5次以上" : item))
                    .join()
                  trDom.find(`td[data-field="${item}"] div`).text(str)
                } else if (item === "logisticsStatus" && obj.autoReplyType == 10) {
                  let str = obj[item] +'</br>' + "包含" + obj.logisticsDescription
                  trDom.find(`td[data-field="${item}"] div`).html(str)
                } else {
                  trDom.find(`td[data-field="${item}"] div`).text(obj[item])
                }
              }
            }
          })
          form.render()
        },
        matchStoreSearch(obj) {
          //匹配店铺的搜索
          const _this = this
          form.on("submit(matchStoreForm_shop_autoReply_submit)", function (data) {
            obj.storeAcct = data.field.storeAcct
            $("#matchStoreForm_shop_autoReply .fieldBox_shop_autoReply_checkbox").remove()
            _this.initStoreFormula(obj, true)
            $("#matchStoreForm_shop_autoReply").find(".showInsearch").css("opacity", 1)
          })
        },

        // 匹配店铺弹框成功渲染
        initStoreFormula(data, isstoreSerach = false) {
          commonReturnPromise({
            url: `/chat/shopee/autoReplyRule/listStoreAcctByRuleId?ruleId=${data.data.id}&salesSite=${data.data.salesSite}&storeAcct=${data.storeAcct || ""}`,
          }).then(res => {
            if (res) {
              var storeBox = ``,
                storeBox_checked = ``
              var store
              for (var i = 0; i < res.length; ++i) {
                store = res[i]
                store.ifMatch && !isstoreSerach
                  ? (storeBox_checked +=
                      `<div class="fieldBox_shop_autoReply fieldBox_shop_autoReply_checkbox"><input lay-filter="fieldBox_shop_autoReply_checkbox_filter" name="storeAcctId" type="checkbox" checked title="` +
                      store.storeName +
                      `" data-id="` +
                      store.storeAcctId +
                      `" lay-skin="primary" value="` +
                      store.storeName +
                      `" ></div>`)
                  : ""
                storeBox +=
                  `<div class="fieldBox_shop_autoReply fieldBox_shop_autoReply_checkbox"><input lay-filter="fieldBox_shop_autoReply_checkbox_filter" name="storeAcctId" type="checkbox" title="` +
                  store.storeName +
                  `" data-id="` +
                  store.storeAcctId +
                  `"  lay-skin="primary" value="` +
                  store.storeName +
                  `" ></div>`
              }
              if (isstoreSerach) {
                // 手动搜索，默认不显示
                $("#matchStoreForm_shop_autoReply").append(storeBox)
                $("#matchStoreForm_shop_autoReply_checked")
                  .find("input[type=checkbox]")
                  .each(function () {
                    $("#matchStoreForm_shop_autoReply")
                      .find(`input[type=checkbox][value="${$(this).val()}"]`)
                      .prop("checked", true)
                  })
                form.render("checkbox", "matchStoreForm_shop_autoReply")
              } else {
                this.originStoreAcctIdList = res
                  .filter(item => item.ifMatch)
                  .map(item => item.storeAcctId)
                  .join(",")
                $("#matchStoreForm_shop_autoReply_checked").append(storeBox_checked)
                form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
              }
            }
          })
        },
        // 店铺全选
        storeCheckAll() {
          // 匹配店铺弹窗的全选/全不选
          form.on("checkbox(matchStoreForm_shop_autoReply_checkAll)", function (data) {
            let elemDom = data.elem,
              elemValue = data.value,
              elemCheck = data.elem.checked

            if (elemCheck) {
              // 全选
              $("#matchStoreForm_shop_autoReply")
                .find("input[type=checkbox]")
                .each(function (index) {
                  if ($(this).prop("checked") === true || index === 0) {
                    // index === 0是全选的那个checkbox
                    // return false;
                  } else {
                    // 需要添加的checkbox
                    // 先设置dom全部选中
                    $(this).prop("checked", true)
                    $("#matchStoreForm_shop_autoReply_checked").append(`<div class="fieldBox_shop_autoReply fieldBox_shop_autoReply_checkbox">${$(this)[0].outerHTML}</div>`)
                    $("#matchStoreForm_shop_autoReply_checked")
                      .find(`input[type=checkbox][value="${$(this).val()}"]`)
                      .prop("checked", true)
                  }
                })
              form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
            } else {
              // 取消全选
              // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
              $("#matchStoreForm_shop_autoReply")
                .find("input[type=checkbox]")
                .each(function (index, item) {
                  $(this).prop("checked", false)
                  $("#matchStoreForm_shop_autoReply_checked").find(`input[type=checkbox][value="${item.value}"]`).parent().remove()
                })
              form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
            }
            // 全选&反选
            $("#matchStoreForm_shop_autoReply input[name=storeAcctId]").prop("checked", data.elem.checked)
            form.render("checkbox", "matchStoreForm_shop_autoReply")
          })
        },

        storeCheck() {
          // 监听所有的checkbox
          form.on("checkbox(fieldBox_shop_autoReply_checkbox_filter)", function (data) {
            let storeBox_checked = ``
            let elemDom = data.elem,
              elemValue = data.value
            if (data.elem.checked) {
              // 选中 true
              $(data.elem).prop("checked", true) // 将原始dom设置为选中状态，并添加到已选择店铺
              storeBox_checked += `<div class="fieldBox_shop_autoReply fieldBox_shop_autoReply_checkbox">${elemDom.outerHTML}</div>`
              $("#matchStoreForm_shop_autoReply_checked").append(storeBox_checked)
              $("#matchStoreForm_shop_autoReply_checked").find(`input[type=checkbox][value="${elemValue}"]`).prop("checked", true)
              form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
            } else {
              // 将所有店铺中的选中状态改为false
              $("#matchStoreForm_shop_autoReply").find(`input[type=checkbox][value="${elemValue}"]`).prop("checked", false)
              form.render("checkbox", "matchStoreForm_shop_autoReply")
              // 删掉已选择店铺中的店铺
              $("#matchStoreForm_shop_autoReply_checked").find(`input[type=checkbox][value="${elemValue}"]`).parent().remove()
              form.render("checkbox", "matchStoreForm_shop_autoReply_checked")
            }
          })
        },

        //
        async initSite() {
          const res = await commonReturnPromise({
            url: "/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
            type: "post",
          })
          this.siteList = res.siteList || []
          formSelects.data("shop_autoReply_site", "local", { arr: this.siteList.map(item => ({ ...item, value: item.code })) })
        },
        async initStoreAcct() {
          const res = await this.fetchStoreAcct()
          this.storeAcctList = res
          formSelects.data("shop_autoReply_storeAcct", "local", { arr: this.storeAcctList.map(item => ({ ...item, name: item.storeAcct, value: item.id })) })
        },
        async initcreator(cb) {
          this.creatorList = await commonReturnPromise({
            url: "/chat/shopee/autoReplyRule/listAllCreator",
          })
          setTimeout(() => {
            if (cb) {
              cb()
            }
            form.render()
          }, 0)
        },
        async initBasicData() {
          const allData = await Promise.all([
            commonReturnPromise({
              url: "/chat/shopee/autoReplyRule/listDelayShipOrderStatus",
            }),
            commonReturnPromise({
              url: "/chat/shopee/autoReplyRule/listChangeProductOrderStatus",
            }),
            commonReturnPromise({
              url: "/lms/unauditorder/listenum.html",
            }),
            commonReturnPromise({
              url: "/chat/shopee/autoReplyRule/listAutoReplyType",
            }),
            commonReturnPromise({
              url: "/chat/shopee/autoReplyRule/listPlatLogisticsStatus",
            }),
            commonReturnPromise({
              url: "/chat/shopee/autoReplyRule/listPlatOrderStatus",
            }),
          ])
          // 延迟订单状态
          this.delayOrderList = allData[0].map(item => ({ name: item.orderStatus, value: item.code }))
          // 换货状态
          this.changeProdOrderList = allData[1].map(item => ({ name: item.orderStatus, value: item.code }))
          // OA订单状态
          this.oaOrderStatusList = allData[2].orderProcessStatus.map(item => ({ name: item.value, value: item.name })) || []
          // 类型
          this.replyTypeList = allData[3].filter(item => item.code !== 4)
          // 平台订单物流状态
          this.platLogisticsStatusList = allData[4].map(item => ({ name: item, value: item }))
          // 平台订单状态
          this.platOrderStatusList = allData[5].map(item => ({ name: item, value: item }))
        },
        fetchStoreAcct() {
          return commonReturnPromise({
            url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
            type: "post",
            params: {
              roleNames: "shopee专员",
              platCode: "shopee",
            },
          })
        },
        fetchAddRule(params) {
          return commonReturnPromise({
            url: "/chat/shopee/autoReplyRule/addNewRule",
            type: "post",
            params,
          })
        },
        fetchUpdateRule(params) {
          return commonReturnPromise({
            url: "/chat/shopee/autoReplyRule/updateAutoReplyRule",
            contentType: "application/json",
            type: "post",
            params: JSON.stringify(params),
          })
        },
        fetchChangeStatus(ruleIdList, status) {
          return commonReturnPromise({
            url: "/chat/shopee/autoReplyRule/updateRuleStatus",
            type: "post",
            params: { ruleIdList, status },
          })
        },
        delAjax: function (idList) {
          return commonReturnPromise({
            url: "/chat/shopee/autoReplyRule/deleteAutoReplyRuleByIds",
            contentType: "application/json",
            type: "delete",
            params: JSON.stringify(idList),
          })
        },
      },
      computed: {},
    })
    // 监听tab
    element.on("tab(shop_autoReply_tabs)", function (data) {
      shopAutoReply.tabIndex = $(this).data("value")
      shopAutoReply.handleSearch()

      // 发货确认 没有导入和下载模板
      // if (shopAutoReply.tabIndex == 6) {
      //   $("#shop_autoReply_import").hide()
      //   $("#shop_autoReply_download-select").hide()
      // } else {
      //   $("#shop_autoReply_import").show()
      //   $("#shop_autoReply_download-select").hide()
      // }
    })
    form.on("select(shop_autoReply_batchOperation)", function (obj) {
      const { value } = obj
      switch (value) {
        case "1": //批量删除
          shopAutoReply.handleBatchDel()
          break
        case "2": //批量开启
          shopAutoReply.handleBatchOn()
          break
        case "3": //批量关闭
          shopAutoReply.handleBatchOff()
          break
      }
    })
    //
    upload.render({
      elem: "#shop_autoReply_import", //绑定元素
      field: "multipartFile",
      accept: "file",
      headers: { contentType: "multipart/form-data" },
      url: "/chat/shopee/autoReplyRule/batchAddRulesByImportExcel", //上传接口
      before: function () {
        loading.show()
      },
      done: function (res) {
        loading.hide()
        layer.msg(res.msg, { icon: res.code === "0000" ? 1 : 2 })
        if (res.data && res.data.downloadId) {
          const { ruleType, errCount, downloadId } = res.data
          typeObj = {
            1: "延长发货",
            2: "换货",
            3: "差评",
            4: "店铺优惠券",
            5: "乐言自动回复",
          }
          let str = `导入模板类型:${
            typeObj[ruleType] || ""
          }<br>失败数量:${errCount}<span class="ztt-a ml10" onclick="shopAutoReply_DownloadFail('${ruleType}','${downloadId}')">失败原因</span>`
          layer.alert(str)
        }
        //上传完毕回调
        shopAutoReply.handleSearch()
      },
      error: function (err) {
        loading.hide()
        //请求异常回调
      },
    })
    form.on("select(shop_autoReply_downLoadTpl)", function (obj) {
      const { value } = obj
      const urlObj = {
        1: {
          fileName: "延迟发货导入模板.xlsx",
          url: "/static/templet/ShopeeChatAutoReplyDelayShipTemplate.xlsx",
        },
        2: {
          fileName: "换货导入模板.xlsx",
          url: "/static/templet/ShopeeChatAutoReplyChangeProductTemplate.xlsx",
        },
        3: {
          fileName: "差评导入模板.xlsx",
          url: "/static/templet/ShopeeChatAutoReplyNegativeCommentTemplate.xlsx",
        },
        4: {
          fileName: "优惠券类型导入模板.xlsx",
          url: "/static/templet/ShopeeChatAutoReplyVoucherCommentTemplate.xlsx",
        },
        5: {
          fileName: "乐言自动回复导入模板.xlsx",
          url: "/static/templet/ShopeeChatAutoReplyLeyanTemplate.xlsx",
        },
      }
      window.location.href = ctx + urlObj[value].url
      // loading.show()
      // transBlob({
      //   url: urlObj[value].url,
      //   fileName: urlObj[value].fileName,
      // })
      //   .then(function (result) {
      //     loading.hide()
      //     // layer.msg(result, { icon: 1 })
      //   })
      //   .catch(function (err) {
      //     loading.hide()
      //     layer.msg(err, { icon: 2 })
      //   })
    })
    // 监听table
    table.on("tool(shop_autoReply_table)", function (obj) {
      switch (obj.event) {
        case "update":
          shopAutoReply.update(obj)
          break
        case "delete":
          let popIndex = layer.confirm("确定删除该数据嘛?", function () {
            shopAutoReply.delAjax([obj.data.id]).then(function (result) {
              layer.msg(result, { icon: 1 })
              // 更新数据
              obj.del()
              let delData = [].concat(obj.data)
              // 改变数量
              shopAutoReply.initcreator(() => commonChangeTotal("shop_autoReplyCard", delData, shopAutoReply.handleSearch))
              layer.close(popIndex)
            })
          })
          break
        case "storeNumInfo":
          shopAutoReply.chooseStore(obj)
          break
        default:
          break
      }
    })
    form.on("switch(shop_autoReply_status_filter)", function (data) {
      let id = data.value
      let { checked } = data.elem
      shopAutoReply
        .fetchChangeStatus(id, checked)
        .then(res => {
          layer.msg("操作成功", { icon: 1 })
          shopAutoReply.handleSearch()
          // table.cache.shop_autoReply_table_id.some((item, index) => {
          //   if (item.id == id) {
          //     table.cache.shop_autoReply_table_id[index].status = checked
          //     return true
          //   }
          // })
          // form.render()
        })
        .catch(err => {
          data.elem.checked = !checked
          layer.msg(err, { icon: 2 })
          form.render()
        })
    })
    form.on("select(shop_autoReply_autoReplyType)", function (obj) {
      shopAutoReply.showOptions(obj.value)
      if(obj.value == '12'){
        $("#shop_autoReply_setRuleForm").find(".verbalTrick_title").text('COD订单话术')
      }else{
        $("#shop_autoReply_setRuleForm").find(".verbalTrick_title").text('话术')
      }
    })
    form.on("select(shop_autoReply_chooseDate)", function (obj) {
      if (obj.value === "1") {
        $("#shop_autoReply_replyRuleForm").find(".showDate").hide()
        $("#shop_autoReply_replyRuleForm").find(".showWeek").show()
      } else {
        $("#shop_autoReply_replyRuleForm").find(".showWeek").hide()
        $("#shop_autoReply_replyRuleForm").find(".showDate").show()
      }
    })
    form.on("switch(shop_autoReply_sendVoucher_status_filter)", function (data) {
      let id = data.value
      let { checked } = data.elem
      let curObj = table.cache.shop_autoReply_table_id.filter(item => item.id == id)[0]
      orderStatusList = Array.isArray(curObj.orderStatusList) ? curObj.orderStatusList.map(item => item.code || item) : []
      shopAutoReply
        .fetchUpdateRule({ ...curObj, sendVoucher: checked, orderStatusList })
        .then(res => {
          layer.msg("操作成功", { icon: 1 })
          shopAutoReply.handleSearch()
          // table.cache.shop_autoReply_table_id.some((item, index) => {
          //   if (item.id == id) {
          //     table.cache.shop_autoReply_table_id[index].sendVoucher = checked
          //     return true
          //   }
          // })
          // form.render()
        })
        .catch(err => {
          data.elem.checked = !checked
          layer.msg(err, { icon: 2 })
          form.render()
        })
    })
    form.on("radio(shop_autoReply_voucher)", function (obj) {
      const { value } = obj
      if (value == "true") {
        $(".showVoucherOption").show()
      } else {
        $(".showVoucherOption").hide()
      }
    })
  })
})(jQuery, layui, window, document)
function shop_autoReply_showInfo(dom) {
  let parentDom = $(dom).parent()
  let isNeedHide = parentDom.hasClass("moreLineText")
  if (!isNeedHide) {
    parentDom.css("-webkit-line-clamp", "999")
    parentDom.addClass("moreLineText")
  } else {
    parentDom.removeClass("moreLineText")
    parentDom.css("-webkit-line-clamp", "4")
  }
}

function shopAutoReply_DownloadFail(ruleType, downloadId) {
  loading.show()
  transBlob(
    {
      url: `/chat/shopee/autoReplyRule/downloadBatchAddRulesErrLogs/${downloadId}/${ruleType}`,
      fileName: "导入创建错误报表.xlsx",
    },
    "get"
  )
    .then(function (result) {
      loading.hide()
      layer.msg("操作成功", { icon: 1 })
    })
    .catch(function (err) {
      loading.hide()
      layer.msg(err, { icon: 2 })
    })
}
