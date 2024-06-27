layui.use(
  ["admin", "form", "layer", "table", "formSelects", "element", "laydate"],
  function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      table = layui.table,
      formSelects = layui.formSelects,
      element = layui.element,
      laydate = layui.laydate,
      laypage = layui.laypage,
      $ = layui.$,
      tableIns = {};
    form.render("checkbox");
    form.render("radio");
    form.render("select");
    var data = {};
    if (shop_arr.length > 0) {
      data.idList = [];
      for (var i = 0; i < shop_arr.length; i++) {
        data.idList.push(shop_arr[i].id);
      }
      data.idList = data.idList.join(",");
    }
    if (shop_arr.length > 0) {
      //执行重载
      tableReload(data);
    }

    //渲染时间组件
    laydate.render({
      elem: "#shop_modifyTitle_timing",
      type: "datetime",
      format: "yyyy-MM-dd HH:mm:ss",
      min: layui.admin.Format(new Date().getTime(), "yyyy-MM-dd hh:mm:ss"),
      // value: layui.admin.Format(new Date().getTime(), "yyyy-MM-dd hh:mm:ss"),
    });

    //展示已知数据
    function tableReload(data) {
      tableIns = table.render({
        elem: "#modifyShopTitle_Table",
        url: ctx + "/shopee/shopeeIsEnableProduct/searchMainTitil.html",
        method: "post",
        cols: [
          [
            { type: "checkbox" },
            { field: "storeAcct", title: "店铺", width: 200 },
            { field: "itemId", title: "item_id", width: 100 },
            //{ field: "title", title: "原标题"},
            { field: "title", title: "标题", templet: "#new_shopTitle" },
            { field: "prodDesc", title: "描述", templet: "#new_describe" },
            { field: "result", title: "操作结果", align: "center", width: 150 },
          ],
        ],
        where: data,
        limit: 100,
        height: 500,
        id: "modifyShopTitle_Table",
        done: function (res, curr, count) {
          commonAddEventTitleToggle($('#shopee_online_modifyDesc'),'shopee')
          table.render();
          $("#tolnum_span_shopee_modifyTitle").text("共" + count + "条");
        },
      });
    }
    /**
     * 替换所有字符
     */
    $("#shopee_mt_replaceSubtitle").click(function () {
      shopee_update_string();
    });

    // 一键应用
    $("#shopee_online_modifyDesc_apply_btn").click(function () {
      let originTitle = $("#shopee_old_string_title").val();
      let newTitle = $("#shopee_new_string_title").val();
      let originDesc = $("#shopee_old_string_desc").val();
      let newDesc = $("#shopee_new_string_desc").val();
      var trObj = layui.table.checkStatus("modifyShopTitle_Table");
      if (trObj.data.length > 0 && tableIns) {
        var layFilterIndex = "LAY-table-" + tableIns.config.index;
        var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
        tableContainer
          .find('tbody input[name="layTableCheckbox"]:checked')
          .each(function (index, item) {
            var tr = $(this).parents("tr");
            // 原替换与修改合并，若原标题/描述后输入框内容存在，则替换，若原标题/描述后输入框内容为空，则修改；
            // 若替换/修改输入框内输入下划线，则将第一个下划线视为原标题或原描述，在其前后整体拼接词；存在多个下划线时，除第一个下划线，其余均按照普通符号添加至标题/描述
            // 标题
            let title = tr.find("textarea[name=title]").val();
            if(originTitle || newTitle){
              if (originTitle) {
                if(!newTitle){ // 有原替换值，无新替换值
                  title = title.split(' ').filter(item=>item.toLowerCase()!==originTitle.toLowerCase()).join(' ') // 去除替换值为单词的情况
                }
                title = replace_string(title, originTitle, newTitle);
                // title = title.replace(new RegExp(originTitle + "\\s*", "g"), newTitle);
              } else {
                if (newTitle.includes("_")) {
                  title = replace_string(newTitle.replace("_", title));
                }else{
                  title = replace_string(newTitle);
                }
              }
              tr.find("textarea[name=title]").val(title);
              //  修改显示字数
              const showWordsLengthDom = tr.find("textarea[name=title]").next().find('.currentLength')
              showWordsLengthDom.text(title.length)
              if(title.length>180){
                showWordsLengthDom.css({'color': 'red'})
              }else{
                showWordsLengthDom.css({'color': 'unset'})   
              }
            }
            // 描述
            let desc = tr.find("textarea[name=prodDesc]").val();
            if(originDesc || newDesc){
              if (originDesc) {
                if(!newDesc){ // 有原替换值，无新替换值
                  desc = desc.split(' ').filter(item=>item.toLowerCase()!==originDesc.toLowerCase()).join(' ') // 去除替换值为单词的情况
                }
                desc = replace_string(desc, originDesc, newDesc);
                // title = desc.replace(new RegExp(originDesc + "\\s*", "g"), newDesc);
              } else {
                if (newDesc.includes("_")) {
                  desc = replace_string(newDesc.replace("_", desc))
                }else{
                  desc = replace_string(newDesc);
                }
              }
              tr.find("textarea[name=prodDesc]").val(desc);
            }
          });
      } else {
        layer.msg("请选择需替换/修改商品数据");
      }
    });

    /**
     * 一键应用标题
     */
    $("#modifyWholeTitle").click(function () {
      var title = $("#wholetitle").val();
      if (title != "") {
        applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
          tr.find('td[data-field="title"] div input').val(title);
        });
      } else {
        layer.msg("请填写新标题");
      }
    });
    /**
     * 一键应用描述
     */
    $("#modifyWholeDesc").click(function () {
      var desc = $("#wholedesc").val();
      if (desc != "") {
        applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
          tr.find('td[data-field="prodDesc"] div textarea').val(desc);
        });
      } else {
        layer.msg("请填写新描述");
      }
    });
    /**
     * 表格操作
     */
    function shopee_update_string() {
      //var trObj =  $('#modifyShopTitle_Table').next().find('.layui-table-body tbody').find('tr');//获去表格的列对象
      var oldTitleStr = $("#shopee_old_string").val(); //旧的字符串
      var newTitleStr = $("#shopee_new_string").val(); //新的字符串
      var oldDescStr = $("#shopee_old_m").val(); //旧的描述字符串
      var newDescStr = $("#shopee_new_m").val(); //新的描述字符串
      if (oldTitleStr !== "" || oldDescStr !== "") {
        applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
          var title = tr.find(".title_input").val();
          var desc = tr.find(".descript_textarea").val();
          title = replace_string(title, oldTitleStr, newTitleStr);
          desc = replace_string(desc, oldDescStr, newDescStr);
          tr.find('td[data-field="title"] div input').val(title);
          tr.find('td[data-field="prodDesc"] div textarea').val(desc);
        });
      } else {
        layer.msg("请输入需要修改条目的完整数据！");
      }
    }

    /**
     * 批量定时替换
     */
    $("#shopee_online_modifyDesc_onTime_btn").click(function () {
      var timingDate = $("#shop_modifyTitle_timing").val();
      // 选中商品及时间，时间需晚于当前时刻
      if (timingDate == null || timingDate == "") {
        layer.msg("请输入定时调整的时间");
        return;
      } else if (new Date(timingDate).getTime() < new Date().getTime()) {
        layer.msg("请输入定时调整需大于当前时刻");
        return;
      }
      var mt_arr = [];
      //获取表格行对象
      var trObj = $("#modifyShopTitle_Table")
        .next()
        .find(".layui-table-body tbody")
        .find("tr");
      for (var i = 0; i < trObj.length; i++) {
        var checkStat = trObj
          .eq(i)
          .find("td")
          .eq(0)
          .find("div")
          .find("input")
          .is(":checked");
        if (checkStat) {
          var obj = {};
          obj.title = trObj.eq(i).find("td").eq(3).find("textarea").val();
          obj.prodDesc = trObj.eq(i).find("td").eq(4).find("textarea").val();
          obj.itemId = trObj.eq(i).find("td").eq(2).find("div").text();
          obj.timingDate = timingDate;

          if (obj.title != "" || obj.prodDesc != "") {
            mt_arr.push(obj);
          }
        }
      }
      if (mt_arr.length <= 0) {
        layer.msg("请选择需要修改的数据");
        return;
      }
      let checkedData = mt_arr.filter(item => item.title == '' || item.prodDesc == '')
      if (checkedData > 0) {
        layer.msg("商品标题或描述不可修改为空！");
        return;
      }
    const isOverLength = mt_arr.some(v=>v.title.length > 180)
    if(isOverLength) {
      return layer.msg("标题最大长度为180");
    }
      loading.show();
      $.ajax({
        type: "POST",
        url: ctx + "/shopee/shopeeIsEnableProduct/updateMainShopeeTitle.html",
        data: { mt_arr: JSON.stringify(mt_arr) },
        async: true,
        dataType: "JSON",
        success: function (data) {
          if(data.code === '0000'){
            layer.msg('操作成功',{icon:1})
          }
          var trObj = $("#modifyShopTitle_Table")
            .next()
            .find(".layui-table-body tbody")
            .find("tr");
          for (var i = 0; i < trObj.length; i++) {
            var shop_itemid = trObj.eq(i).find("td").eq(2).find("div").text();
            var msg = data.data[shop_itemid];
            if (msg != undefined) {
              trObj
                  .eq(i)
                  .find("td")
                  .eq(5)
                  .find(".layui-table-cell")
                  .html(
                      "<div>" + msg + "</div>"
                  );
            }
            // if (msg != undefined) {
            //   if (msg == "提交定时修改成功") {
            //     trObj
            //       .eq(i)
            //       .find("td")
            //       .eq(5)
            //       .find(".layui-table-cell")
            //       .html(
            //         "<div style='color:green'>" +
            //           data.data[shop_itemid] +
            //           "</div>"
            //       );
            //   } else {
            //     trObj
            //       .eq(i)
            //       .find("td")
            //       .eq(5)
            //       .find(".layui-table-cell")
            //       .html(
            //         "<div style='color:red;posion: relative' class='errordata'>修改失败</div>"
            //       );
            //     trObj
            //       .eq(i)
            //       .find("td")
            //       .eq(5)
            //       .find(".layui-table-cell")
            //       .append(
            //         "<textarea class='layui-hide'>" +
            //           data.data[shop_itemid] +
            //           "</textarea>"
            //       );
            //   }
            // }
          }
          loading.hide();
        },
      });
    });
    /**
     * 批量重新生成标题
     */
    $("#shopee_online_modifyDesc_new_title_btn").click(function () {
      let arr = [];
      applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
        arr.push({
          itemId: tr.find("td[data-field=itemId] div").text(),
          updateType: "标题",
        });
      });
      if (arr.length) {
        regenerateNewTitleOrDesc(arr);
      }
    });
    /**
     * 批量重新生成描述
     */
    $("#shopee_online_modifyDesc_new_desc_btn").click(function () {
      let arr = [];
      applytoChecked("modifyShopTitle_Table", tableIns, function (tr) {
        arr.push({
          itemId: tr.find("td[data-field=itemId] div").text(),
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
        layer.msg("等待重新生成标题中/等待重新生成描述中，请勿重复点击", {
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
$("body").on("mouseover", ".errordata", function () {
  var content = $(this).next("textarea").val();
  layer.tips(content, $(this), {
    time: 3000,
  });
});
// function shopeeOnlineModifyDescJump() {
//   window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
// }
