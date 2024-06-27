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

    if (shop_arr.length > 0) {
      const idList = shop_arr.map((item) => item.id).join(",");
      // const idList = "1000121310,1000121281";
      tableReload({ idList });
    } else {
      tableReload({ idList: {} });
    }

    function isEndWithSymbol(str, needSubstring = true) {
      let _str = str;
      if (needSubstring) {
        _str = str.substring(0, str.length - 1);
      }
      const isExist = [",", ",", ".", "?", ":", ";", "!"].some((v) =>
        _str.endsWith(v)
      );
      return isExist;
    }

    function highLightTitle(oldTile, _titleList, title) {
      const positionList = searchSubStr(
        oldTile.toLowerCase(),
        title.toLowerCase()
      );
      positionList.forEach((vIndex) => {
        for (var i = vIndex; i < vIndex + title.length; i++) {
          _titleList[i].isHighLight = true;
        }
      });
    }

    function replaceString(s1, s2, s3) {
      if (s2) {
        var finalString = [],
          index = 0;
        var positions = searchSubStr(s1.toLowerCase(), s2.toLowerCase());
        if (positions.length > 0) {
          for (var i = 0; i < positions.length; i++) {
            finalString.push(s1.slice(index, positions[i]) + s3);
            index = positions[i] + s2.length;
          }
          finalString.push(s1.slice(index, s1.length));
          return finalString.join("");
        } else {
          return s1;
        }
      } else {
        return s1;
      }
    }

    //展示已知数据
    function tableReload(data) {
      tableIns = table.render({
        elem: "#modifyShopTitle_Table",
        url: ctx + "/shopee/shopeeIsEnableProduct/searchMainTitil.html",
        method: "post",
        cols: [
          [
            { type: "checkbox" },
            { field: "storeAcct", title: "店铺名称", width: 150 },
            { field: "itemId", title: "item_id", width: 150 },
            { field: "oldTitle", title: "原标题", templet: "#old_shopTitle" },
            { field: "title", title: "标题", templet: "#new_shopTitle" },
            { field: "result", title: "操作结果", align: "center", width: 200 },
          ],
        ],
        where: data,
        limit: 100,
        height: 500,
        id: "modifyShopTitle_Table",
        created: function (res) {
          if (res.code === "0000") {
            res.data = (res.data || []).map((item) => ({
              ...item,
              isMuchWords: false,
              _titleMuchList: item.title.split(" ").map((v) => ({
                label: v,
                isHighLight: false,
                endWithSymbol: false,
              })),
              _titleList: item.title.split("").map((v) => ({
                label: v,
                isHighLight: false,
              })),
            }));
          }
        },
        done: function (res, curr, count) {
          commonAddEventTitleToggle($("#shopee_online_modifyDesc"), "shopee");
          table.render();
          $("#tolnum_span_shopee_modifyTitle").text("共" + count + "条");
        },
      });
    }

    // 一键应用
    $("#shopee_online_modifyDesc_apply_btn").click(function () {
      const oldInputTile = $("#shopee_old_string_title").val();
      const newInputTile = $("#shopee_new_string_title").val();
      var trObj = layui.table.checkStatus("modifyShopTitle_Table");
      if (trObj.data.length > 0 && tableIns) {
        var layFilterIndex = "LAY-table-" + tableIns.config.index;
        var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
        tableContainer
          .find('tbody input[name="layTableCheckbox"]:checked')
          .each(function (index, item) {
            var tr = $(this).parents("tr");
            let newTitle = "";
            const oldTile = tr.find(".oldTitle").data("title");
            let _titleList = oldTile.split("").map((v) => ({
              label: v,
              isHighLight: false,
            }));
            let _titleMuchList = oldTile.split(" ").map((v) => ({
              label: v + " ",
              isHighLight: false,
            }));
            let isMuchWords = false;
            if (!oldInputTile) {
              // 原标题列，替换词高亮
              if (newInputTile) {
                isMuchWords = true;
                _titleList.forEach((v) => {
                  v.isHighLight = true;
                  v.endWithSymbol = false;
                });
              }
              if (newInputTile.includes("_")) {
                newTitle = newInputTile.replace("_", oldTile);
              } else {
                newTitle = newInputTile;
              }
            } else {
              // 大小写模糊搜索
              const lowerProductName = oldTile.toLowerCase();
              const lowerTitle = oldInputTile.toLowerCase();
              if (lowerProductName.includes(_.trim(lowerTitle))) {
                //多个单词
                isMuchWords = true;
                // 语句替换
                if (_.trim(oldInputTile).includes(" ")) {
                  // 高亮
                  highLightTitle(oldTile, _titleList, oldInputTile);
                  newTitle = replaceString(oldTile, oldInputTile, newInputTile);
                } else {
                  // 单词替换 半模糊
                  isMuchWords = false;
                  const wordsList = oldTile.split(" ");
                  wordsList
                    .map((v) => v.toLowerCase())
                    .forEach((v, index) => {
                      if (_.startsWith(v, _.trim(lowerTitle))) {
                        if (newInputTile) {
                          let curStr = wordsList[index];
                          wordsList[index] = newInputTile;
                          // 如果是以符号结尾,将符号添加到该词后面
                          if (
                            isEndWithSymbol(curStr, false) &&
                            !isEndWithSymbol(oldInputTile, false)
                          ) {
                            wordsList[index] =
                              wordsList[index] + curStr.substr(-1);
                          }
                        } else {
                          // 如果是以符号结尾,将符号添加到前一个单词
                          if (
                            isEndWithSymbol(wordsList[index], false) &&
                            wordsList[index - 1]
                          ) {
                            let curStr = wordsList[index];
                            wordsList[index - 1] =
                              wordsList[index - 1] + curStr.substr(-1);
                          } else {
                            wordsList[index] = undefined;
                          }
                        }
                        _titleMuchList[index].isHighLight = true;
                      }
                    });
                  // 判断是否存在高亮词
                  const isExistRepWord = _titleMuchList.some(
                    (v) => v.isHighLight
                  );
                  newTitle = isExistRepWord
                    ? wordsList.filter((v) => v !== undefined).join(" ")
                    : "";
                }
              } else {
                newTitle;
              }
            }
            _titleMuchList.forEach((v) => ({
              ...v,
              endWithSymbol: isEndWithSymbol(v.label),
            }));
            tr.find("textarea[name=title]").val(newTitle);
            const getTpl = old_shopTitle.innerHTML;
            laytpl(getTpl).render(
              { isMuchWords, _titleMuchList, _titleList, title: oldTile },
              function (html) {
                tr.find("td[data-field=oldTitle] div").html(html);
              }
            );
            //  修改显示字数
            const showWordsLengthDom = tr
              .find("textarea[name=title]")
              .next()
              .find(".currentLength");
            showWordsLengthDom.text(newTitle.length);
            if (newTitle.length > 180) {
              showWordsLengthDom.css({ color: "red" });
            } else {
              showWordsLengthDom.css({ color: "unset" });
            }
          });
      } else {
        layer.msg("请选择需替换/修改商品数据");
      }
    });
    /**
     * 提交
     */
    $("#shopee_online_modifyDesc_onTime_btn").click(function () {
      var mt_arr = [];
      //获取表格行对象
      var trObj = $("#modifyShopTitle_Table")
        .next()
        .find(".layui-table-body tbody")
        .find("tr");
      const params = [];
      trObj.each(function () {
        const isChecked = $(this)
          .find("input[name=layTableCheckbox]")
          .is(":checked");
        if (isChecked) {
          const obj = {};
          const inputDom = $(this).find("textarea[name=title]");
          obj.newTitle = inputDom.val();
          obj.oldTitle = inputDom.data("oldtitle");
          obj.storeAcctId = inputDom.data("storeacctid");
          obj.itemId = inputDom.data("itemid");
          params.push(obj);
        }
      });
      if (!params.length) {
        layer.msg("请选择需要修改的数据");
        return;
      }
      let checkedData = params.filter((item) => item.newTitle == "");
      if (checkedData.length > 0) {
        layer.msg("商品标题不可修改为空！");
        return;
      }
      const isOverLength = params.some((v) => v.newTitle.length > 180);
      if (isOverLength) {
        return layer.msg("标题最大长度为180");
      }
      commonReturnPromise({
        url: "/lms/shopee/shopeeIsEnableProduct/modifyProductTitle",
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
          const inputDom = $(this).find("textarea[name=title]");
          const itemId = inputDom.data("itemid");
          const curObj = itemIdObj[itemId];
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
     * 批量重新生成标题
     */
    $("#shopee_online_modifyDesc_new_title_btn").click(function () {
      let arr = [];
      applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
        arr.push({
          itemId: tr.find("textarea[name=title]").data("itemid"),
          updateType: "标题",
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
        layer.msg("等待重新生成标题，请勿重复点击", {
          icon: 1,
        });
        applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
          tr.find("td[data-field=result] div").html(
            `<span>请于任务中心页面查看下载</span>`
          );
        });
      });
    }
  }
);
