layui.use(
  [
    "admin",
    "form",
    "layer",
    "table",
    "formSelects",
    "laytpl",
    "element",
    "laydate",
  ],
  function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      table = layui.table,
      formSelects = layui.formSelects,
      element = layui.element,
      laydate = layui.laydate,
      laypage = layui.laypage,
      laytpl = layui.laytpl,
      $ = layui.$,
      tableIns = {};
    form.render("checkbox");
    form.render("radio");
    form.render("select");
    layui.use(
      [
        "admin",
        "form",
        "layer",
        "table",
        "formSelects",
        "laytpl",
        "element",
        "laydate",
      ],
      function () {
        var admin = layui.admin,
          form = layui.form,
          layer = layui.layer,
          table = layui.table,
          formSelects = layui.formSelects,
          element = layui.element,
          laydate = layui.laydate,
          laypage = layui.laypage,
          laytpl = layui.laytpl,
          $ = layui.$,
          tableIns = {};
        form.render("checkbox");
        form.render("radio");
        form.render("select");
        let shopDescItemIdObj = [];
        let descWangEditor;
        if (shop_arr.length > 0) {
          const idList = shop_arr.map((item) => item.id).join(",");
          // const idList = "1000121310,1000121281";
          tableReload({ idList });
        } else {
          tableReload({ idList: {} });
        }

        //展示已知数据
        function tableReload(data) {
          tableIns = table.render({
            elem: "#modifyShopDesc_Table",
            url: ctx + "/shopee/shopeeIsEnableProduct/searchMainTitil.html",
            method: "post",
            cols: [
              [
                { type: "checkbox", width: 40 },
                { field: "storeAcct", title: "店铺名称", width: 100 },
                {
                  field: "itemId",
                  title: "item_id",
                  width: 100,
                  templet: "#shopee_online_modifyDesc_tr",
                },
                {
                  field: "result",
                  title: "操作结果",
                  align: "center",
                },
              ],
            ],
            where: data,
            limit: 100,
            height: 500,
            id: "modifyShopDesc_Table",
            done: function (res, curr, count) {
              if (res.code == "0000" && (res.data || []).length) {
                res.data.forEach((v) => {
                  shopDescItemIdObj[v.itemId] = {
                    ...v,
                    newDesc: v.prodDesc,
                    oldDesc: v.prodDesc,
                  };
                });
              }
              descWangEditor = renderEditor(
                "shopee_online_modifyDesc_editor",
                "",
              );

              $("#tolnum_span_shopee_modifyTitle").text("共" + count + "条");
              //   点击行时，给富文本赋值当前行对应的描述
              const tableBodyDom = $("#modifyShopDesc_Table")
                .next()
                .find(".layui-table-body");
              tableBodyDom.on("click", "tr", function () {
                // 上次点击行
                const lastClickDom = tableBodyDom.find(".curClick");
                if (lastClickDom.length) {
                  const lastItemId = lastClickDom.find(".info").data("itemid");
                  shopDescItemIdObj[lastItemId].newDesc =
                    descWangEditor.txt.html();
                  lastClickDom.removeClass("curClick");
                }
                // 当前行
                $(this).addClass("curClick");
                const curItemId = $(this).find(".info").data("itemid");
                const { newDesc } = shopDescItemIdObj[curItemId];
                descWangEditor.txt.html(newDesc);
                $("#shopee_online_modifyDesc_editor").data("itemid", curItemId);
              });
            },
          });
        }

        function getTplImgDialog(editor) {
          const curItemId = $("#shopee_online_modifyDesc_editor").data(
            "itemid"
          );
          if(curItemId){
            const prodPId = shopDescItemIdObj[curItemId].prodPId
            const params = { prodPIds: [prodPId], platCode: 'shopee'}
            showTplImgDialog(params, editor)
          }
        }

        function setNewHtml(newHtml){
          const curItemId = $("#shopee_online_modifyDesc_editor").data(
            "itemid"
            );
          if(curItemId){
            shopDescItemIdObj[curItemId].newDesc = newHtml;
          }
        }

        function renderEditor(id, text) {
          var E = window.wangEditor;
          // 获取必要的变量
          const { $, BtnMenu } = E;
          class tplMenu extends BtnMenu {
            constructor(editor) {
              const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="模板图片">
                    <span>模板图片</span>
                </div>`
              );
              super($elem, editor);
            }
            // 模板图片菜单点击事件
            clickHandler() {
              getTplImgDialog(editor)
            }
            tryChangeActive() {
              // 激活菜单
              this.active();
            }
          }
          class uploadMenu extends BtnMenu {
            constructor(editor) {
              const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="上传图片">
                    <span>上传图片</span>
                </div>
                `
              );
              super($elem, editor);
            }
            // 上传图片菜单点击事件
            clickHandler() {
              editorUploadImgs(editor);
            }
            tryChangeActive() {
              // 激活菜单
              this.active();
            }
          }
          class netMenu extends BtnMenu {
            constructor(editor) {
              const $elem = E.$(
                `<div class="w-e-menu" style="width: 60px" data-title="网络图片">
                    <span>网络图片</span>
                </div>`
              );
              super($elem, editor);
            }
            // 网络图片菜单点击事件
            clickHandler() {
              showEditorNetImgs(editor);
            }
            tryChangeActive() {
              // 激活菜单
              this.active();
            }
          }
          // 菜单 key ，各个菜单不能重复
          const tplMenuKey = "tplMenuKey";
          const uploadMenuKey = "uploadMenuKey";
          const netMenuKey = "netMenuKey";
          // 注册菜单
          E.registerMenu(tplMenuKey, tplMenu);
          E.registerMenu(uploadMenuKey, uploadMenu);
          E.registerMenu(netMenuKey, netMenu);

          var editor = new E('#' + id)
          editor.config.menus = []

          editor.config.onblur = function (newHtml) {
            setNewHtml(newHtml)
          };
          editor.config.onchange = function (newHtml) {
            setNewHtml(newHtml)
          };

          editor.create();
          if (text) {
            editor.txt.html(text);
          }
          return editor;
        }

        // 一键应用
        $("#shopee_online_modifyDesc_apply_btn").click(function () {
          const oldInputDesc = $("#shopee_old_string_desc").val();
          const newInputDesc = $("#shopee_new_string_desc").val();
          const trObj = layui.table.checkStatus("modifyShopDesc_Table");
          const checkedItemIdList = [];
          if (trObj.data.length > 0 && tableIns) {
            var layFilterIndex = "LAY-table-" + tableIns.config.index;
            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
            tableContainer
              .find('tbody input[name="layTableCheckbox"]:checked')
              .each(function () {
                const tr = $(this).parents("tr");
                const curItemId = tr.find(".info").data("itemid");
                checkedItemIdList.push(curItemId);
                const { newDesc } = shopDescItemIdObj[curItemId];
                let _newDesc = newDesc;
                if (oldInputDesc && newDesc.includes(oldInputDesc)) {
                  if (!newInputDesc) {
                    _newDesc = _newDesc
                      .split(" ")
                      .filter((e) => e !== oldInputDesc)
                      .join(" ");
                  }
                  //   替换
                  shopDescItemIdObj[curItemId].newDesc = _newDesc.replaceAll(
                    oldInputDesc,
                    newInputDesc
                  );
                }
              });
            //   改变当前行对应的富文本
            const curClickItemId = $("#modifyShopDesc_Table")
              .next()
              .find("tBody .curClick")
              .find(".info")
              .data("itemid");
            if (checkedItemIdList.includes(curClickItemId)) {
              descWangEditor.txt.html(
                shopDescItemIdObj[curClickItemId].newDesc
              );
            }
            layer.msg("一键应用成功");
          } else {
            layer.msg("请选择需替换/修改商品数据");
          }
        });
        /**
         * 提交
         */
        $("#shopee_online_modifyDesc_modify_btn").click(function () {
          const params = [];
          //获取表格行对象
          var trObj = $("#modifyShopDesc_Table")
            .next()
            .find(".layui-table-body tbody")
            .find("tr");
          trObj.each(function () {
            const isChecked = $(this)
              .find("input[name=layTableCheckbox]")
              .is(":checked");
            if (isChecked) {
              const obj = {};
              const curItemId = $(this).find(".info").data("itemid");
              const curObj = shopDescItemIdObj[curItemId];
              if (shopDescItemIdObj[curItemId]) {
                obj.newDescription = curObj.newDesc;
                obj.oldDescription = curObj.oldDesc;
                obj.storeAcctId = curObj.storeAcctId;
                obj.itemId = curObj.itemId;
                params.push(obj);
              }
            }
          });
          if (!params.length) {
            layer.msg("请选择需要修改的数据");
            return;
          }
          let checkedData = params.filter((item) => item.newDescription == "");
          if (checkedData.length > 0) {
            layer.msg("商品描述不可修改为空！");
            return;
          }
          commonReturnPromise({
            url: "/lms/shopee/shopeeIsEnableProduct/modifyProductDescription",
            contentType: "application/json",
            type: "post",
            params: JSON.stringify(params),
          }).then((res) => {
            const itemIdObj = {};
            layer.msg("操作成功", { icon: 1 });
            (res || []).forEach((v) => {
              itemIdObj[v.itemId] = v;
            });
            trObj.each(function () {
              const curItemId = $(this).find(".info").data("itemid");
              const curObj = itemIdObj[curItemId];
              if (curObj) {
                const resultDom = $(this).find("td[data-field=result] div");
                const strHtml = `<div class="${
                  curObj.success ? "fGreen" : "fRed"
                }">${curObj.success ? "修改成功" : curObj.errMsg}</div>`;
                resultDom.html(strHtml);
              }
            });
          });
        });
        /**
         * 批量重新生成描述
         */
        $("#shopee_online_modifyDesc_new_desc_btn").click(function () {
          let arr = [];
          applytoChecked("modifyShopDesc_Table", tableIns, function (tr) {
            arr.push({
              itemId: tr.find(".info").data("itemid"),
              updateType: "描述",
            });
          });
          if (arr.length) {
            regenerateNewTitleOrDesc(arr);
          }
        });
        function regenerateNewTitleOrDesc(arr) {
          commonReturnPromise({
            url: "/lms/shopee/onlineProductShopee/regenerateAndUpdateProductTitleOrDescription",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(arr),
          }).then(() => {
            layer.msg("等待重新生成描述，请勿重复点击", {
              icon: 1,
            });
            applytoChecked("modifyShopDesc_Table", tableIns, function (tr) {
              tr.find("td[data-field=result] div").html(
                `<span>请于任务中心页面查看下载</span>`
              );
            });
          });
        }
      }
    );
  }
);
