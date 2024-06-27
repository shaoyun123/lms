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

    // shop_arr: shopeeOnline页面选中的数据
    createSbsItemsName = {
      init: function () {
        const data = {
          storeAcctIds: shop_arr.map(item => item.storeAcctId),
          itemIds: shop_arr.map(item => item.itemId),
        }
        commonReturnPromise({
          url: "/lms/shopee/sbsItem/listShopeeSbsItemInfo",
          params: JSON.stringify(data),
          contentType: "application/json",
          type: "post",
        }).then(res => {
          this.tableRender(res)
        })
      },
      tableRender: function (data) {
        table.render({
          elem: "#shop_create_sbsItems_table",
          data,
          cols: [
            [
              //标题栏
              { checkbox: true, width: 30 },
              {
                field: "storeAcct",
                title: "店铺",
                templet: `<div>
              {{d.storeAcct}}
              <input name="storeAcctId" value="{{d.storeAcctId}}" hidden/>
              <input name="itemId" value="{{d.itemId}}" hidden/>
              <input name="globalItemId" value="{{d.globalItemId}}" hidden/>
              <input name="variSku" value="{{d.variSku}}" hidden/>
              <input name="variId" value="{{d.variId||''}}" hidden/>
              <input name="storeAcct" value="{{d.storeAcct}}" hidden/>
              <input name="prodSId" value="{{d.prodSId}}" hidden/>
              <input name="isSellMultiple" value="{{d.isSellMultiple}}" hidden/>
              <input name="isSale" value="{{d.isSale}}" hidden/>
              </div>`,
              },
              { field: "ids", title: "item_id/vari_id", templet: "<div>{{d.itemId}}<br>{{d.variId||''}}</div>" },
              {
                field: "variSku",
                title: "店铺子SKU",
                templet: d => {
                  let stopTag = ""
                  let manyTag = ""
                  d.isSale === false && (stopTag = `<span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>`)
                  d.isSellMultiple && (manyTag = `<span class="hp-badge layui-bg-red fr layTitle" lay-title="多">多</span>`)
                  return d.variSku + stopTag + manyTag
                },
              },
              {
                field: "prodSSku",
                title: "商品子SKU",
                templet: d => {
                  // 多个一卖商品可以编辑
                  if (d.isSellMultiple) {
                    return `<div><input name="prodSSku" value=""  class="layui-input"/></div>`
                  }
                  return `<div>${d.prodSSku}<input name="prodSSku" value="${d.prodSSku}" hidden/></div>`
                },
              },
              { field: "globalItemId", title: "global_item_id" },
              {
                field: "globalModelId",
                title: "global_model_id",
                templet: '<div><input name="globalModelId" value="{{d.globalModelId || ``}}" class="layui-input" onkeypress="commonKeyPressInputPositiveInt(event)"/></div>',
              },
              {
                field: "printCode",
                title: "打印条码",
                width: 200,
                templet: '<div><input name="printCode" value="{{d.printCode}}" class="layui-input" /></div>',
              },
              { field: "price", title: "刊登价/现价", templet: "<span>{{d.listingPrice}}/{{d.currPrice}} {{d.currency}}</span>" },
              {
                field: "sales",
                title: "variation销量",
                templet:
                  "<div><div class='text-height'>7天:{{d.sevenSales}}</div><div class='text-height'>30天:{{d.thirtySales}}</div><div class='text-height'>60天:{{d.sixtySales}}</div><div class='text-height'>90天:{{d.ninetySales}}</div></div>",
              },
              { field: "result", title: "操作结果", width: 100 },
            ],
          ],
          limit: 99999,
          done: function (res, count) {
            form.render()
            $("#shop_create_sbsItems_total").text(res.count)
            // global_model_id
            $("#shop_create_sbsItems_table")
              .next()
              .find('tbody tr input[name="globalModelId"]')
              .blur(function () {
                let globalModelId = $(this).val()
                let curTrDom = $(this).parents("tr")
                let globalItemId = curTrDom.find('td[data-field="globalItemId"] div').text()
                curTrDom.find("input[name=printCode]").val(globalItemId + "_" + globalModelId)
              })
          },
        })
      },

      createItems: function () {
        const _this = this
        $("#shop_create_sbsItems_create").click(function () {
          // 验证 1.需选择数据,2.global_model_id是否为空或为0,
          // 店铺id和variId确定唯一性
          const checkDom = $("#shop_create_sbsItems_table").next().find('tbody tr input[name="layTableCheckbox"]:checked')
          if (!checkDom.length) return layer.msg("请选择数据", { icon: 7 })
          const arr = []
          let alertMsg = ""
          checkDom.each(function () {
            const curTr = $(this).parents("tr")
            const globalModelId = curTr.find("input[name=globalModelId]").val()
            const printCode = curTr.find("input[name=printCode]").val()
            const prodSSku = curTr.find("input[name=prodSSku]").val()
            if (!Number(globalModelId)) alertMsg = "global_model_id的值只能为数字，请重新填写"
            if (Number(globalModelId) === 0) alertMsg = "global_model_id的值不能为0，请重新填写"
            if (!globalModelId) alertMsg = "global_model_id不能为空，请填写"
            if (printCode === "") alertMsg = "打印条码不能为空，请填写"
            if (printCode === "0") alertMsg = "打印条码不能为0，请填写"
            if (prodSSku === "") alertMsg = "商品子SKU不能为空，请重新填写"
            if (prodSSku === "0") alertMsg = "商品子SKU不能为0，请重新填写"
            const obj = {
              globalModelId,
              prodSSku,
              printCode,
              storeAcctId: curTr.find("input[name=storeAcctId]").val(),
              itemId: curTr.find("input[name=itemId]").val(),
              globalItemId: curTr.find("input[name=globalItemId]").val(),
              variSku: curTr.find("input[name=variSku]").val(),
              variId: curTr.find("input[name=variId]").val() || null,
              prodSId: curTr.find("input[name=prodSId]").val(),
              isSellMultiple: curTr.find("input[name=isSellMultiple]").val(),
              storeAcct: curTr.find("input[name=storeAcct]").val(),
              isSale: curTr.find("input[name=isSale]").val(),
            }
            arr.push(obj)
            // }
          })
          if (alertMsg) return layer.msg(alertMsg, { icon: 7 })
          if (arr.length) {
            _this.createItemAjax(arr).then(res => {
              layer.msg("操作成功", { icon: 1 })
              checkDom.each(function () {
                const curTr = $(this).parents("tr")
               let storeAcctId = curTr.find("input[name=storeAcctId]").val()
                let  variId = curTr.find("input[name=variId]").val()
                let  itemId=curTr.find("input[name=itemId]").val()
                let uniqueValue = variId || itemId
                let uniqueKey = variId ? 'variId' : 'itemId'


                const curObj = res.find(item => item.storeAcctId == storeAcctId && item[uniqueKey] == uniqueValue)
                if (curObj) {
                  curTr.find("td[data-field=result] div").text(curObj.message)
                  curTr.find("td[data-field=result] div").css("color", curObj.success ? "green" : "red")
                }
              })
            })
          }
        })
      },
      createItemAjax: function (arr) {
        return commonReturnPromise({
          url: "/lms/shopee/sbsItem/createShopeeSbsItems",
          params: JSON.stringify(arr),
          contentType: "application/json",
          type: "post",
        })
      },
    }
    // 初始化
    createSbsItemsName.init()
    // 监听批量上架按钮
    createSbsItemsName.createItems()
  })
})(jQuery, layui, window, document)
