(function ($, layui, window, document, undefined) {
  layui.use(
    [
      "admin",
      "form",
      "layer",
      "table",
      "formSelects",
      "element",
      "upload",
      "laydate",
      "laytpl",
    ],
    function () {
      var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        upload = layui.upload,
        laydate = layui.laydate,
        laypage = layui.laypage,
        laytpl = layui.laytpl;
      $ = layui.$;
      let smtSimpleProductFiledName = {
        init: function () {
          const _this = this;
          // 获取总数量
          const length = smt_arr.length || 0;
          const itemIds = smt_arr.map((item) => item.itemId).join();
          //   批量调整
          _this.batchAdjustBtn();
          commonReturnPromise({
            url: "/lms/aliexpressOnlineOperateController/getSmtProductDetailByItemIds",
            type: "post",
            params: { itemIds },
          }).then((res) => {
            const length = res.length || 0;
            $("#smtSimpleProductFiled_modal_total").text(length);
            table.render({
              elem: "#smtSimpleProductFiled_Table",
              id: "smtSimpleProductFiled_Table",
              data: res || [],
              cols: [
                [
                  { checkbox: true, width: 25 },
                  {
                    field: "storeAcct",
                    title: "店铺",
                    templet: "#smtSimpleProductFiled_Table_store-input",
                  },
                  { field: "itemId", title: "item ID" },
                  { field: "deliveryTime", title: "当前备货天数" },
                  {
                    field: "newData",
                    title: `<div class="disflex"><input class='layui-input' name='newData' id="smtSimpleProductFiled_batch_replace_val" placeholder="新备货天数" onkeypress="commonKeyPressInputNotNega(event)"
                        onblur="commonBlurInputNotNega(event)"><a
                        href="javascript:;"
                        class="layui-btn layui-btn-sm"
                        id="smtSimpleProductFiled_batch_replace_col"
                        >一键替换</a
                      ></div>`,
                    templet: `<div><input class="layui-input" name="newData"
                           value=""
                           onkeypress="commonKeyPressInputNotNega(event)"
                           onblur="commonBlurInputNotNega(event)"
                           placeholder="新备货天数"></div>`,
                  },
                  { field: "result", title: "操作结果" },
                ],
              ],
              limit:9999999,
              done: function () {
                form.render("input");
                _this.repalceBtn();
              },
            });
          });
        },
        // 获取选中数据
        tableCksSelected: function () {
          let trDomList = [];
          $("#smtSimpleProductFiled_Table")
            .next()
            .find("tbody input[name=layTableCheckbox]:checked")
            .each(function () {
              const trDom = $(this).parents("tr");
              trDomList.push(trDom);
            });
          return new Promise(function (resolve, reject) {
            if (!trDomList.length) {
              reject("请先选中一条数据");
            }
            resolve(trDomList);
          });
        },
        // 一键替换
        repalceBtn: function () {
          const _this = this;
          $("#smtSimpleProductFiled_batch_replace_col").click(function () {
            const replaceVal = $(
              "#smtSimpleProductFiled_batch_replace_val"
            ).val();
            if (replaceVal) {
              _this
                .tableCksSelected("smtSimpleProductFiled_Table")
                .then(function (trDomList) {
                  // 新的备货天数
                  trDomList.forEach((item) => {
                    $(item).find("input[name=newData]").val(replaceVal);
                  });
                })
                .catch(function (err) {
                  layer.msg(err, { icon: 7 });
                });
            } else {
              layer.msg("请填写值");
            }
          });
        },
        // 批量调整
        batchAdjustBtn: function () {
          const _this = this;
          $("#smtSimpleProductFiled_batch_adjust").click(function () {
            _this
              .tableCksSelected("smtSimpleProductFiled_Table")
              .then(function (trDomList) {
                // 获取参数
                // 将result清空
                let paramsArr = [];
                trDomList.forEach((item) => {
                  paramsArr.push({
                    id: $(item).find("input[name=id]").val(),
                    storeAcctId: $(item).find("input[name=storeAcctId]").val(),
                    itemId: $(item).find("input[name=itemId]").val(),
                    origData: $(item).find("input[name=deliveryTime]").val(),
                    newData: $(item).find("input[name=newData]").val(),
                  });
                });

                // 如果新备货天数没填写
                const isExistEmptyNewData = paramsArr.filter(
                  (item) => item.newData === ""
                );
                if (isExistEmptyNewData.length) {
                  return layer.msg("请将选中数据的新备货天数填写完整");
                }
                // 将result清空
                trDomList.forEach((item) => {
                  $(item)
                    .find('td[data-field="result"] .layui-table-cell')
                    .text("");
                });
                // 调接口
                commonReturnPromise({
                  url: "/lms/aliexpressOnlineOperateController/batchModifyDeliveryTime",
                  type: "post",
                  contentType: "application/json;charset=UTF-8",
                  params: JSON.stringify(paramsArr),
                }).then((res) => {
                  clearInterval(smtMoDeliverTimeUnit);
                  layer.msg("处理中，请稍等...");
                  smtMoDeliverTimeUnit = setInterval(() => {
                    _this.getModifyResult(res, trDomList);
                  }, 2000);
                });
                // TODO反显操作结果
              })
              .catch(function (err) {
                layer.msg(err, { icon: 7 });
              });
          });
        },
        // 查询结果
        getModifyResult: function (batchNo, checkedArr) {
          // 选中数据中没显示结果的数据
          let isExistNoResult = false;
          checkedArr.forEach((item) => {
            const result = $(item)
              .find('td[data-field="result"] .layui-table-cell')
              .text();
            if (!result) {
              isExistNoResult = true;
            }
          });
          if (!isExistNoResult) {
            clearInterval(smtMoDeliverTimeUnit);
            return;
          }
          $.ajax({
            type: "POST",
            url: ctx + "/sys/selectResult.html",
            data: { batchNo },
            async: true,
            dataType: "json",
            success: function (returnData) {
              if (returnData.code == "0000") {
                const { data } = returnData;
                checkedArr.forEach((item) => {
                  const resultDom = $(item).find(
                    'td[data-field="result"] .layui-table-cell'
                  );
                  const itemId = $(item).find("input[name=itemId]").val();
                  const curResult =
                    data["TR_ALIEXPRESS_MODIFY_DELIVERY_TIME" + itemId];
                  if (curResult) {
                    resultDom.text(curResult);
                  }
                });
              }
            },
            error: function () {
              layer.msg("服务器正忙");
              clearInterval(smtMoDeliverTimeUnit);
            },
          });
        },
      };
      smtSimpleProductFiledName.init();
    }
  );
})(jQuery, layui, window, document);
