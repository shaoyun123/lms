layui.use(
  [
    "admin",
    "layer",
    "table",
    "form",
    "laytpl",
    "element",
    "laydate",
    "formSelects",
  ],
  function () {
    var admin = layui.admin,
      layer = layui.layer,
      $ = layui.$,
      table = layui.table,
      element = layui.element,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form;

    const smtUpdateMsrEuIdName = {
      init: function () {
        const storeAcctId = [
          ...new Set(smt_arr.map((item) => item.storeAcctId)),
        ];
        this.storeAcctId = storeAcctId;
        const itemIds = smt_arr.map((item) => item.itemId).join();
        this.initMsrEuIdList(storeAcctId);
        this.tableData(storeAcctId.join(), itemIds);
        this.handleSync();
        this.handleApply();
      },
      storeAcctId: null,
      initMsrEuIdList: function (storeAcctId) {
        commonReturnPromise({
          url:
            ctx + "/aliexpress/category/listEuResponsiblePersonsByStoreAcctIds",
          params: JSON.stringify(storeAcctId),
          type: "post",
          contentType: "application/json",
        }).then((res) => {
          commonRenderSelect("smtUpdateMsrEuId_msrEuId", res, {
            name: "msrEuName",
            code: "msrEuId",
          }).then(() => form.render("select"));
        });
      },
      tableData: function (storeAcctId, itemIds) {
        commonReturnPromise({
          url: `/lms/onlineProductSmt/getItemInfoByItemIds?storeAcctId=${storeAcctId}&itemIds=${itemIds}`,
          type: "post",
          contentType: "application/json",
        }).then((res) => {
          table.render({
            elem: "#smtUpdateMsrEuId_table",
            data: res,
            limit: 9999999,
            cols: [
              [
                { checkbox: true, width: 30 },
                {
                  field: "id",
                  title: "id",
                },
                {
                  field: "storeAcctId",
                  title: "店铺id",
                },
                {
                  field: "storeAcct",
                  title: "店铺",
                },
                {
                  field: "itemId",
                  title: "itemId",
                },
                {
                  field: "prodPSku",
                  title: "商品父SKU",
                },
                {
                  field: "storePSku",
                  title: "店铺父SKU",
                },
                {
                  field: "msrEuName",
                  title: "欧盟责任人",
                },
                {
                  title: "操作结果",
                  templet: "#smtUpdateMsrEuId_table_result_info",
                },
              ],
            ],
            done: function (res, curr, count) {
              $("#smtUpdateMsrEuId_total").text(count);
            },
            id: "smtUpdateMsrEuId_table",
          });
        });
      },
      handleSync: function () {
        const that = this;
        $("#smtUpdateMsrEuId_sync").click(function () {
          const categoryIds = smt_arr.map((item) => item.categoryId).join();
          const storeAcctId = smt_arr[0].storeAcctId;
          commonReturnPromise({
            url:
              ctx +
              `/aliexpress/category/syncEuResponsiblesByStoreAcctIdAndCategoryIds?storeAcctId=${storeAcctId}&categoryIds=${categoryIds}`,
            type: "post",
          })
            .then(() => {
              that.initMsrEuIdList([storeAcctId]);
            })
            .catch((err) => layui.layer.msg(err || err.message, { icon: 2 }));
        });
      },
      handleApply: function () {
        const that = this;
        $("#smtUpdateMsrEuId_update").click(function () {
          const { data } = table.checkStatus("smtUpdateMsrEuId_table");
          const msrEuId = $("#smtUpdateMsrEuId_msrEuId").val();
          const msrEuIdName = $(
            "#smtUpdateMsrEuId_msrEuId option:checked"
          ).text();
          if (!data.length) {
            return layer.msg("请选择数据");
          }
          if (!msrEuId) {
            return layer.msg("请选择欧盟责任人");
          }
          const params = {
            storeAcctId: data[0].storeAcctId,
            msrEuId,
            itemIds: data.map((item) => item.itemId),
          };
          commonReturnPromise({
            url: `/lms/onlineProductSmt/batchModifyMsrEuId`,
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(params),
          }).then((res) => {
            const tableDom = $("#smtUpdateMsrEuId_table").next();
            res.forEach((v) => {
              const trDom = tableDom
                .find(`input[name=itemId_${v.itemId}]`)
                .parents("tr");
              trDom.find(".result").text(v.msg);
              if (!v.msg.includes("失败")) {
                trDom.find('td[data-field="msrEuName"] div').text(msrEuIdName);
              }
            });
            layer.msg("操作成功", { icon: 1 });
          });
        });
      },
    };
    smtUpdateMsrEuIdName.init();
  }
);
