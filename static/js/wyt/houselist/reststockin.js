var pagedata = {};
layui.use(["form", "table", "laydate", "layer", 'tableMerge', 'formSelects', 'element'], function () {
  var form = layui.form,
    table = layui.table,
    layer = layui.layer,
    element = layui.element,
    formSelects = layui.formSelects,
    laydate = layui.laydate;
  var reststockin_processStatus = 0; //当前流程状态

  form.render();
  fillSelect(); //初始化页面下拉框填充

  $('input[name="timeRange"]').val(
    getLatestMonth().createTimeStart + " - " + getLatestMonth().createTimeEnd
  );
  // 时间渲染
  laydate.render({
    elem: "#overseas_restintimerange",
    range: true,
  });
  //表单查询
  $("#overseas_restinorder_search_btn").click(function () {
    reststockin_table_render_fun();
  });
  // 表格渲染
  function reststockin_table_render_fun() {
    layui.table.render({
      elem: "#overseas_reststockin_data_table",
      method: "post",
      url: `${ctx}/overseasPurOtherStorage/search.html`,
      id: "overseas_reststockin_data_table",
      page: true, //开启分页
      where: restgetSearchData(),
      cols: [
        [
          //表头
          {
            type: "checkbox",
            width: 30,
            field: "checkboxcol",
          },
          {
            field: "storageTypeName",
            title: "入库类别",
            width: "6%",
          },
          {
            field: "username",
            title: "入库单号",
            templet: "#tpl_restinorderNo",
          },
          {
            field: "overseasStorageName",
            title: "仓库",
            width: "4%",
          },
          {
            field: "city",
            title: "人员",
            templet: '#restin_tpl_creator',
            width: "6%",
          },
          {
            field: "totalStorageNum",
            title: "入库总数量",
            width: "6%",
          },
          {
            field: "totalStorageSkuNum",
            title: "入库SKU个数",
            width: "6%",
          },
          {
            field: "totalStorageMoney",
            title: "入库总金额",
            width: "6%",
          },
          {
            field: "classify",
            title: "时间",
            templet: '#restin_tpl_createTime',
            width: "10%",
          },
          {
            field: "problemRemark",
            title: "备注",
          },
          {
            title: "操作",
            toolbar: "#restin_tpl_option",
            width: "4%",
          },
        ],
      ],
      limits: [100, 500, 1000],
      limit: 100,
      created: function (res) {
        if (res.code == "0000") {
          //   res.data = disassembledata(res.data);
        }
      },
      done: function (res) { //包含表格单元格合并以及工具栏事件(审核，修改，作废);
        var msg = res.msg.split("&");
        $("#overseas_reststockin_data_count_span0").html(msg[0]); //未审核
        $("#overseas_reststockin_data_count_span1").html(msg[1]); //已审核
        $("#overseas_reststockin_data_count_span3").html(msg[2]); //已作废
        // 给1688单号上添加单击 跳转页面事件
        setEventByselector('#overseas_reststockin_data_table', '.clcikRoutTo', 'click', routerTo)
        //懒加载
        imageLazyloadAll();
        layui.tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
      },
    });
  }
  // 页面下拉框数据类型获取
  function fillSelect() {
    $.ajax({
      url: `${ctx}/overseasPurOtherStorage/overseasWarehouseList.html`,//仓库列表
      type: 'get',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == "0000") {
          let str = "<option value=''>全部</option>";
          for (let i of returnData.data) {
            str += `<option value='${i.overseasStorageId}'>${i.overseasStorageName}</option>`;
          }
          $("#overseas_restinwarehouseList").html(str);
          pagedata.warehouseList = returnData.data;
          form.render();
        }
      }
    });
    $.ajax({
      url: `${ctx}/overseasPurOtherStorage/creatorList.html`,//经办人
      type: 'get',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == "0000") {
          let str = "<option value=''>全部</option>";
          for (let i of returnData.data) {
            str += `<option value='${i.directorId}'>${i.director}</option>`;
          }
          $("#overseas_restindirectorList").html(str);
          pagedata.directorList = returnData.data;
          form.render();
        }
      }
    });
    $.ajax({
      url: `${ctx}/overseasPurOtherStorage/overseaStorageTypeList.html`,//入库类别
      type: 'get',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == "0000") {
          let str = "<option value=''>全部</option>";
          for (let i of returnData.data) {
            str += `<option value='${i.overseaStorageType}'>${i.overseaStorageTypeName}</option>`;
          }
          $("#overseas_restinstorageTypeList").html(str);
          pagedata.storageTypeList = returnData.data;
          form.render();
        }
      }
    });
    reststockin_table_render_fun();
  };

  // 填充下拉框
  function appendoption(pre, domName, obj) {
    var $li = '<option value="">请选择</option>';
    if (pre.indexOf("layer") != -1 && domName.indexOf("warehouseList") != -1) {
      $li = '';
      for (var i in obj) {
        if (obj[i]) {
          $li += '<option value=' + obj[i].overseasStorageId + '>' + obj[i].overseasStorageName + '</option>';
        }
      }
    } else if (domName.indexOf("storageTypeList") != -1) {
      for (var i in obj) {
        if (obj[i]) {
          $li += '<option value=' + obj[i].overseaStorageType + '>' + obj[i].overseaStorageTypeName + '</option>';
        }
      }
    } else if (domName.indexOf("directorList") != -1) {
      for (var i in obj) {
        if (obj[i]) {
          $li += '<option value=' + obj[i].directorId + '>' + obj[i].director + '</option>';
        }
      }
    }
    $("#" + pre + "_overseas_" + domName).append($li);
  }

  /**流程状态选项卡变更函数**/
  element.on('tab(overseas_reststockin_data_count_tab)', function (data) {
    reststockin_processStatus = $(this).attr("data-index");
    reststockin_table_render_fun();
  });

   /**
     * 新增或则修改入库单的参数校验
     * @param formdata
     * @param itemdata
     * @returns {boolean}
     */
    function addOrUpdateValidateParam(formdata, itemdata) {
      if (formdata.overseaStorageType == null || formdata.overseaStorageType == '') {
          layer.msg("请选择入库类别", { icon: 0 });
          return false;
      }
      if (formdata.overseasStorageId == null || formdata.overseasStorageId == '') {
          layer.msg("请选择仓库", { icon: 0 });
          return false;
      }
      if (formdata.directorId == null || formdata.directorId == '') {
          layer.msg("请选择经办人", { icon: 0 });
          return false;
      }
      if (itemdata == null || itemdata.length < 1) {
          layer.msg("请添加入库商品", { icon: 0 });
          return false;
      }
      formdata.director = pagedata.directorList[getIndex('directorId', pagedata.directorList, formdata.directorId)].director;
      formdata.products = JSON.stringify(itemdata);
      return true;
  };

  table.on('tool(overseas_reststockin_data_table)', function (obj) {
    var data = obj.data;
    var layEvent = obj.event;
    var otherStorageNumbers = []
    if (layEvent === 'edit') { //编辑
      var currrentProcess = data.processStatus;
      currentPId = data.id;
      var itemdata = []; //商品信息表格数据
      var otherStorageNumber = data.overseasOtherStorageNumber;
      var currentEditStoreId;
      var index = layer.open({
        type: 1,
        title: "修改其他入库单",
        area: ["80%", '70%'],
        shadeClose: false,
        btn: ['审核', '保存', '关闭'],
        content: $("#reststockin_addEdit_layer").html(),
        success: function (layero, index) {
          if ($("#overseas_restinorder_batchcheckBtn").length == 1) {
            layero.find(".layui-layer-btn0").css({ 'float': 'left' });
          } else {
            layero.find(".layui-layer-btn0").css({ 'display': 'none' });
          }
          if (currrentProcess != 0) {
            layero.find(".layui-layer-btn0").css({ 'display': 'none' });
            layero.find(".layui-layer-btn1").css({ 'display': 'none' });
          }
          form.render('select');
          var itemtableIns = {};
          // 填充表单下拉框
          for (var i in pagedata) {
            appendoption('layer', i, pagedata[i]);
          }
          // 渲染单号
          $('#reststockin_otherStorageNumber_add').val(otherStorageNumber);
          form.render();
          formSelects.render();
          $.ajax({
            url: `${ctx}/overseasPurOtherStorage/getOverseasPurOtherDetail.html`,
            dataType: 'json',
            data: { overseasOtherStorageNumber: otherStorageNumber },
            type: 'post',
            success: function (returnData) {
              if (returnData.code == "0000") {
                for (var i in returnData.data) {
                  $('#oversaes_reststockin_addEdit_from input[name="' + i + '"]').val(returnData.data[i]);
                  if (i == 'createTime') {
                    $('#new_rebackorder input[name="' + i + '"]').val(Format(returnData.data[i], 'yyyy-MM-dd hh:mm:ss'));
                  } else if (i == 'problemRemark') {
                    $('#reststockin_problemRemark').val(returnData.data[i]);
                  }
                }
                itemdata = returnData.data.products;
                // 构造商品信息表格渲染数据
                for (var i in returnData.data.products) {
                  itemdata[i].totalmoney = returnData.data.products[i].storageMoney;
                  itemdata[i].overseasOtherStorageNumber = otherStorageNumber;
                }
                // 下拉选中
                selected('oversaes_reststockin_addEdit_from', 'overseaStorageType', returnData.data.overseasStorageType);
                selected('oversaes_reststockin_addEdit_from', 'overseasStorageId', returnData.data.overseasStorageId);
                currentEditStoreId = returnData.data.overseasStorageId
                selected('oversaes_reststockin_addEdit_from', 'directorId', returnData.data.directorId);
                $("#layer_overseas_warehouseList").attr("disabled", "disabled");
                form.render('select');
                // 渲染入库商品信息表格
                itemtableIns = table.render({
                  elem: "#overseas_reststockin_addItem_table",
                  method: "post",
                  data: itemdata,
                  id: 'overseas_reststockin_addItem_table',
                  cols: [
                    [
                      { title: "图片", field: 'image', templet: '#overseas_reststockin_sku_image_tpl' },
                      { title: "注册SKU", field: 'registerSku' },
                      { title: "商品名称", field: 'title' },
                      { title: "含税单价(￥)", field: 'buyerPrice', templet: '#overseas_layer_restin_buyer_price' },
                      { title: "入库数量", field: 'storageNum', templet: '#overseas_layer_restinstorageNum' },
                      { title: "入库金额", field: 'totalmoney' },
                      { title: "操作", toolbar: '#overseas_reststockin_sku_operate_tpl' },
                    ]
                  ],
                  limit: 100,
                  done: function (res) {
                    imageLazyload();
                    table.on('tool(overseas_reststockin_addItem_table)', function (obj) {
                      var data = obj.data;
                      var layEvent = obj.event;
                      var tr = obj.tr;
                      //  删除商品
                      if (layEvent === 'del') {
                        layer.confirm('确定删除这条商品吗', function (index) {
                          obj.del();
                          var dataindex = getIndex('registerSku', itemdata, data.registerSku);
                          if (dataindex > -1) {
                            itemdata.splice(dataindex, 1);
                          }
                          layer.close(index);
                        });
                      }
                    });
                    $('input[name="storageNum"]').blur(function () {
                      var storageNum = parseInt($(this).val());
                      $(this).val(storageNum);
                      var registerSku = $(this).parents('td').siblings('td[data-field="registerSku"]').find('div').text();
                      var indexsku = getIndex('registerSku', itemdata, registerSku);
                      if (indexsku > -1) {
                        if (storageNum < 0) {
                          layer.msg('退回数量不可调整为小于0', { icon: 0 });
                          $(this).val(0);
                          $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                          return false;
                        }
                        var money = itemdata[indexsku].buyerPrice;
                        itemdata[indexsku].storageNum = storageNum;
                        itemdata[indexsku].status = 1;
                        var totalmoney = Number(itemdata[indexsku].storageNum || 0) * parseFloat(money);
                        itemdata[indexsku].totalmoney = totalmoney;
                        $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                      }
                    });
                    //含税单价可编辑
                    $('input[name="buyerPrice"]').blur(function () {
                      var buyerPrice = $(this).val();
                      var registerSku = $(this).parents('td').siblings('td[data-field="registerSku"]').find('div').text();
                      var indexsku = getIndex('registerSku', itemdata, registerSku);
                      if (indexsku > -1) {
                        //含税单价不做 小于0的条件判断2020/10/16
                        /* if (buyerPrice < 0) {
                             layer.msg('含税单价不可调整为小于0', { icon: 0 });
                             $(this).val(0);
                             $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                             return false;
                         }*/
                        //入库数量
                        var storageNum = itemdata[indexsku].storageNum;
                        itemdata[indexsku].buyerPrice = buyerPrice;
                        itemdata[indexsku].status = 1;
                        var totalmoney = Number(storageNum || 0) * parseFloat(buyerPrice);
                        itemdata[indexsku].totalmoney = totalmoney;
                        $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                      }
                    });
                  }
                });
              } else {
                layer.msg(returnData.msg, { icon: 2 });
              }
            }
          });
          $('#reststockin_addItem_btn').hide();
          //TODO:暂时关闭;需要再打开
          /*$('#reststockin_addItem_btn').click(function () {
            var formdata = serializeObject($('#oversaes_reststockin_addEdit_from'));
            var overseasStorageId = formdata.overseasStorageId;
            layer.open({
              type: 1,
              title: "添加商品",
              area: ["80%", '70%'],
              shadeClose: false,
              btn: ['保存', '关闭'],
              content: $("#reststockin_additem_layer").html(),
              success: function (index, layero) {
                $('#reststockin_searchItem_btn').click(function () {
                  var sku = $('#reststockin_additem_sku_input').val();
                  if (sku != "") {
                    if (overseasStorageId && overseasStorageId != "") {
                      getItemlist(sku, overseasStorageId);
                    } else {
                      layer.msg('请选择仓库再查询', { icon: 0 });
                    }
                    return false;
                  } else {
                    layer.msg('请输入商品sku再查询', { icon: 0 });
                  }
                  return false;
                });
              },
              yes: function (index, layero) {
                var checkStatus = table.checkStatus('reststockin_additem_data_table');
                itemdata = itemdata.concat(checkStatus.data);
                itemdata = unique('registerSku', itemdata);
                for (var i = 0; i < itemdata.length; i++) {
                  itemdata[i].storageNum = 0;
                  var totalmoney = Number(itemdata[i].storageNum || 0) * parseFloat(itemdata[i].buyerPrice);
                  itemdata[i].totalmoney = totalmoney.toFixed(2);
                }
                itemtableIns.reload({
                  data: unique('registerSku', itemdata)
                })
                layer.close(index);
              }
            });
          });*/

          // 日志详情切换选项卡
          element.on('tab(reststockin_detail_tab_filter)', function (data) {
            var isLog = $(this).attr("isLog");
            if (isLog == 1) {
              table.render({
                elem: "#restockin_logTab",
                id: "restockin_logTab",
                method: 'post',
                url: ctx + "/overseasPurOtherStorage/searchOverseasLogByPId.html",
                where: { pId: currentPId },
                cols: [
                  [
                    { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { field: "creator", title: "操作人", width: 100 },
                    { field: "operTypeStr", title: "操作类型", width: 150 },
                    { field: "operDesc", title: "操作详情" },
                  ]
                ],
                page: false
              });
            }
          });
        },
        yes: function (index, layero) { //审核
          if (currrentProcess != 0) { //如果不是未审核状态的不予编辑
            layer.close(index);
            return false;
          }
          var otherStorageNumbers = []; //多个其它入库单号
          otherStorageNumbers.push(otherStorageNumber);
          checkrestinkorder(otherStorageNumbers); //审核
        },
        btn2: function (index) { //修改
          if (currrentProcess != 0) {
            layer.close(index);
            return false;
          }
          var data = getrestinkData(itemdata, 'oversaes_reststockin_addEdit_from');
          data.overseasStorageId = currentEditStoreId;
          if (data.overseaStorageType != "" && data.overseasOtherStorageNumber != "" && data.directorId != "" &&  data.overseasStorageId != "") {
            if (itemdata.length > 0) {
              for (var i = 0; i < itemdata.length; i++) {
                if (!itemdata[i].storageNum || itemdata[i].storageNum == 0) {
                  layer.msg("请填写入库数量", { icon: 0 });
                  return false;
                }
              }
              updatestockin(data);
              return false;
            } else {
              layer.msg("请先添加要入库的商品", { icon: 0 });
            }
          } else {
            layer.msg("原入库单号，入库类型，入库经办人,入库仓库不能为空", { icon: 0 });
          }
          return false;
        },
        btn3: function () { //关闭
          reststockin_table_render_fun(); //重新搜索
        }
      });
    } else if (layEvent === 'abodon') { //作废
      layer.confirm('确定作废这条入库单?', function (index) {
        otherStorageNumbers.push(data.overseasOtherStorageNumber);
        abondonrestinorder(otherStorageNumbers);
      })
    } else {
      layer.confirm('确定将这条已审核入库单取消审核?', function (index) {
        otherStorageNumbers.push(otherSdata.overseasOtherStorageNumber);
        transfertoabandon(otherStorageNumbers);
      })
    }
  });
  // 导入文件
  $("#overseas_reststockin_import_button").click(function () {
    var storeId = $("#overseas_restinwarehouseList").val();
    if (storeId == null || storeId == "") {
      layer.msg("请在查询条件中选择一个仓库", { icon: 0 });
      return false;
    }
    var inType = $("#overseas_restinstorageTypeList").val();

    if (inType == null || inType == "") {
      layer.msg("请在查询条件中选择入库类别", { icon: 0 });
      return false;
    }
    document.getElementById("overseas_reststockin_storageInList_file").click();
  });

  // 导出数据
  $("#overseas_reststockin_exportOtherStorageBtn").click(function () {
    var outerIndex = layer.open({
      title: "导出其它入库单",
      type: 1, //不加该属性,就会出现[object Object]
      area: ["1000px", "600px"],
      btn: ["确定", "关闭"],
      content: $("#reststockin_exportOtherStorageOrderPop").html(),
    });
  });

  //  批量审核
  $('#overseas_restinorder_batchcheckBtn').click(function () {
    var checkStatus = table.checkStatus('overseas_reststockin_data_table');
    var objData = checkStatus.data;
    if (objData == null || objData.length < 1) {
      layer.msg('请勾选要审核的入库单', { icon: 0 });
      return false;
    }
    var otherStorageNumbers = [];
    for (var i = 0; i < objData.length; i++) {
      if (objData[i].processStatus == 0) { //待审核
        otherStorageNumbers.push(objData[i].overseasOtherStorageNumber);
      } else {
        otherStorageNumbers.push(objData[i].overseasOtherStorageNumber);
      }
    }
    if (otherStorageNumbers == null || otherStorageNumbers.length < 1) {
      layer.msg('请勾选待审核的入库单', { icon: 0 });
      return false;
    }
    layer.confirm('确定开始批量审核这' + checkStatus.data.length + '条其他入库单?', function (index) {
      checkrestinkorder(otherStorageNumbers);
      layer.close(index);
    });
  });

  // 批量审核接口
  function checkrestinkorder(otherStorageNumbers) {
    loading.show();
    $.ajax({
      url: `${ctx}/overseasPurOtherStorage/batchAuditOverseasPurOtherStorage.html`,
      dataType: 'json',
      data: { "overseasOtherStorageNumbers": otherStorageNumbers.join() },
      success: function (returnData) {
        loading.hide();
        if (returnData.code === "0000") {
          layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        } else {
          layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        }
      },
      error: function (returnData) {
        layer.msg(returnData.msg, { icon: 2 });
      }
    })
  };
  // 作废入库单;
  function abondonrestinorder(overseasOtherStorageNumbers) {
    loading.show();
    $.ajax({
      url: `${ctx}/overseasPurOtherStorage/invalidateOverseasPurOtherStorage.html`,
      dataType: 'json',
      // 暂时不支持批量作废 所以直接取第一个
      data: {"overseasOtherStorageNumber": overseasOtherStorageNumbers[0]},
      success: function (returnData) {
        loading.hide();
        if (returnData.code === "0000") {
          layer.closeAll();
          layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        } else {
          layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        }
      },
      error: function (returnData) {
        layer.msg(returnData.msg, {icon: 2});
      }
    })
  };

  //提交新建入库单
  function newreststockin(data) {
    loading.show();
    $.ajax({
        url: `${ctx}/overseasPurOtherStorage/createOverseasPurOtherStorage.html`,
        type: 'POST',
        dataType: 'json',
        data: data,
      success: function (returnData) {
        loading.hide();
        if (returnData.code === "0000") {
          layer.closeAll();
          layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        } else {
          layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
            layer.close(index);
          });
        }
      },
        complete: function(XMLHttpRequest, textStatus) {
            loading.hide();
        },
    });
};

  //查询入库单列表表单参数构造
  function restgetSearchData() {
    var data = serializeObject($("#reststockin_search_form"));
    data.processStatus = reststockin_processStatus;
    var warehouseList = [];
    $("#overseas_restinwarehouseList")
      .children()
      .each(function () {
        var overseasStorageId = $(this).val();
        if (overseasStorageId != null && overseasStorageId != "") {
          warehouseList.push(overseasStorageId);
        }
      });
    data.warehouseList = warehouseList.join(","); //授权仓库集合
    if (data.timeRange != "") {
      if (data.timeType == "0") {
        data.createTimeStart = data.timeRange.split(" - ")[0] + " 00:00:00";
        data.createTimeEnd = data.timeRange.split(" - ")[1] + " 23:59:59";
      } else {
        data.auditTimeStart = data.timeRange.split(" - ")[0] + " 00:00:00";
        data.auditTimeEnd = data.timeRange.split(" - ")[1] + " 23:59:59";
      }
    }
    return data;
  }

  // 新增其他入库单
  $("#overseas_restinorder_otherlistAdd_btn").click(function () {
    var itemdata = [];
    var index = layer.open({
      type: 1,
      title: "新建其它入库单",
      btn: ["提交", "关闭"],
      area: ["80%", "70%"],
      content: $("#reststockin_addEdit_layer").html(),
      success: function () {
        form.render();
        itemtableIns = table.render({
          elem: "#overseas_reststockin_addItem_table",
          data: itemdata,
          id: "overseas_reststockin_addItem_table",
          cols: [
            [
              {
                title: "图片",
                field: "image",
                templet: "#overseas_reststockin_sku_image_tpl",
              },
              { title: "注册SKU", field: "registerSku" },
              { title: "商品名称", field: "title" },
              {
                title: "含税单价(￥)",
                field: "buyerPrice",
                templet: "#overseas_layer_restin_buyer_price",
              },
              {
                title: "入库数量",
                field: "storageNum",
                templet: "#overseas_layer_restinstorageNum",
              },
              { title: "入库金额", field: "totalmoney" },
              { title: "操作", toolbar: "#overseas_reststockin_sku_operate_tpl" },
            ],
          ],
          limit: 100,
          done: function (res) {
            //查询当前登录人
            $.ajax({
              type: 'GET',
              url: ctx + '/overseasPurOtherStorage/getCurrentUser.html',
              success: function (rsp) {
                var $rsp = JSON.parse(rsp);
                if($rsp.code == '0000'){
                  var currentUserId = $rsp.data.id;
                  selected('oversaes_reststockin_addEdit_from', 'directorId', currentUserId);
                  form.render('select');
                } else {
                  layer.msg("获取当前登录人失败;" + $rsp.msg)
                }
              },
              error: function (rsp) {
                var $rsp = JSON.parse(rsp);
                layer.msg("获取当前登录人失败;" + $rsp.msg)
              }
            });
            imageLazyload();
            table.on('tool(overseas_reststockin_addItem_table)', function (obj) {
              var data = obj.data;
              var layEvent = obj.event;
              var tr = obj.tr;
              if (layEvent === 'del') {
                  layer.confirm('确定删除这条商品吗', function(index) {
                      obj.del();
                      var dataindex = getIndex('registerSku', itemdata, data.registerSku);
                      if (dataindex > -1) {
                          itemdata.splice(dataindex, 1);
                      }
                      layer.close(index);
                  });
              }
            });
            $('input[name="storageNum"]').blur(function() {
                var storageNum = parseInt($(this).val());
                $(this).val(storageNum);
                var registerSku = $(this).parents('td').siblings('td[data-field="registerSku"]').find('div').text();
                var indexsku = getIndex('registerSku', itemdata, registerSku);
                if (indexsku > -1) {
                    if (storageNum < 0) {
                        layer.msg('退回数量不可调整为小于0', { icon: 0 });
                        $(this).val(0);
                        $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                        return false;
                    }
                    var money = itemdata[indexsku].buyerPrice;
                    itemdata[indexsku].storageNum = storageNum;
                    itemdata[indexsku].status = 1;
                    var totalmoney = Number(itemdata[indexsku].storageNum || 0) * parseFloat(money);
                    itemdata[indexsku].totalmoney = totalmoney;
                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                }
            });
            // 含税单价可编辑
            $('input[name="buyerPrice"]').blur(function() {
                var buyerPrice = $(this).val();
                var registerSku = $(this).parents('td').siblings('td[data-field="registerSku"]').find('div').text();
                var indexsku = getIndex('registerSku', itemdata, registerSku);
                if (indexsku > -1) {
                    //含税单价不做 小于0的条件判断2020/10/16
                   /* if (buyerPrice < 0) {
                        layer.msg('含税单价不可调整为小于0', { icon: 0 });
                        $(this).val(0);
                        $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(0.00);
                        return false;
                    }*/
                    //入库数量
                    var storageNum = itemdata[indexsku].storageNum;
                    itemdata[indexsku].buyerPrice = buyerPrice;
                    itemdata[indexsku].status = 1;
                    var totalmoney = Number(storageNum || 0) * parseFloat(buyerPrice);
                    itemdata[indexsku].totalmoney = totalmoney;
                    $(this).parents('td').siblings('td[data-field="totalmoney"]').find('div').text(totalmoney.toFixed(2));
                }
            });
          }

        });

        // 日志详情切换选项卡
        element.on('tab(reststockin_detail_tab_filter)', function (data) {
          var isLog = $(this).attr("isLog");
          if (isLog == 1) {
            table.render({
              elem: "#restockin_logTab",
              id: "restockin_logTab",
              method: 'post',
              url: ctx + "/overseasPurOtherStorage/searchOverseasLogByPId.html",
              where: { pId: currentPId },
              cols: [
                [
                  { title: "时间", width: 150, templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>' },
                  { field: "creator", title: "操作人", width: 100 },
                  { field: "operTypeStr", title: "操作类型", width: 150 },
                  { field: "operDesc", title: "操作详情" },
                ]
              ],
              page: false
            });
          }
        });

        // 添加商品
        $("#reststockin_addItem_btn").click(function () {
          var formdata = serializeObject($('#oversaes_reststockin_addEdit_from'));
          var overseasStorageId = formdata.overseasStorageId;
          layer.open({
            type: 1,
            title: "添加商品",
            area: ["80%", "70%"],
            shadeClose: false,
            btn: ["保存", "关闭"],
            content: $("#reststockin_additem_layer").html(),
            success: function (index, layero) {
              $('#reststockin_searchItem_btn').click(function () {
                var registerSku = $('#reststockin_additem_sku_input').val();
                if (registerSku == null || registerSku == '') {
                  layer.msg('请输入商品sku再查询', { icon: 0 });
                  return false;
                }
                if (overseasStorageId == null || overseasStorageId == "") {
                  layer.msg('请选择仓库再查询', { icon: 0 });
                  return false;
                }
                getItemlist(registerSku, overseasStorageId);
                return false;
              });
              $('#reststockin_additem_sku_input').on('keyup', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.keyCode == 13) {
                  var registerSku = $('#reststockin_additem_sku_input').val();
                  if (registerSku == null || registerSku == '') {
                    layer.msg('请输入商品sku再查询', { icon: 0 });
                    return false;
                  }
                  if (overseasStorageId == null || overseasStorageId == "") {
                    layer.msg('请选择仓库再查询', { icon: 0 });
                    return false;
                  }
                  getItemlist(registerSku, overseasStorageId);
                  return false;
                }
              })
            },
            yes: function (index, layero) {
              var checkStatus = table.checkStatus('reststockin_additem_data_table');
              itemdata = itemdata.concat(checkStatus.data);
              itemdata = unique('registerSku', itemdata);
              for (var i = 0; i < itemdata.length; i++) {
                itemdata[i].storageNum = 0;
                var totalmoney = Number(itemdata[i].storageNum || 0) * parseFloat(itemdata[i].buyerPrice);
                itemdata[i].totalmoney = totalmoney.toFixed(2);
              }
              itemtableIns.reload({
                data: unique('registerSku', itemdata)
              })
              layer.close(index);
            },
          });
        });
        // 填充表单下拉框
        for (var i in pagedata) {
          appendoption('layer', i, pagedata[i]);
        }
        form.render();

      },
      yes: function (index, layero) {
        var formdata = serializeObject($('#oversaes_reststockin_addEdit_from'));
        if (addOrUpdateValidateParam(formdata, itemdata)) { //参数校验
          newreststockin(formdata);
        }
      },
    });
  });
//提交修改其它入库单
  function updatestockin(data) {
    loading.show();
    $.ajax({
      url: ctx + '/overseasPurOtherStorage/updateOverseasPurOtherDetail.html',
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(returnData) {
        loading.hide();
        if (returnData.code === "0000") {
          layer.closeAll();
          layer.confirm(returnData.msg, {icon: 1, title: '结果信息'}, function (index) {
            layer.close(index);
            reststockin_table_render_fun();
          });
        } else {
          layer.confirm(returnData.msg, {icon: 2, title: '结果信息'}, function (index) {
            layer.close(index);
          });
        }
      },
      error: function(returnData) {
        layer.msg(returnData.msg, { icon: 2 });
      }
    })
  };
});


function routerTo() {
  var span = $(this)
  var id = span.find('a').text()
  if (!id) {
    return
  }
  span.attr('data-ifExcuteClick', 1)
  // 设定时器
  var index = window.setTimeout(function () {
    var ifExcuteClick = span.attr('data-ifExcuteClick')
    if (ifExcuteClick == '1') {
      var routerUrl = span.attr('data-routUrl')
      window.open(routerUrl.replace('{data}', id))
    }
    span.removeAttr('data-ifExcuteClick')
  }, 300)
}

// 数组去重
function unique(id, arr) {
  var idarr = [];
  var finalarr = [];
  for (var i = 0; i < arr.length; i++) {
      var index = idarr.indexOf(arr[i][id]);
      if (index == -1) {
          finalarr.push(arr[i]);
          idarr.push(arr[i][id]);
      }
  }
  return finalarr;
}
//获取数组中键为id，值为value的对象位置下标
function getIndex(id, arr, value) {
  for (var i = 0; i < arr.length; i++) {
      if (value == arr[i][id]) {
          return i;
      }
  }
  return -1;
}
//最近一个月时间
function getLatestMonth() {
  var data = {};
  data.createTimeEnd = Format(new Date(), "yyyy-MM-dd");
  data.createTimeStart = Format(
    new Date().setMonth(new Date().getMonth() - 1),
    "yyyy-MM-dd"
  );
  data.processStatus = "0";
  return data;
}

//根据商品SKU查询商品渲染商品表格
function getItemlist(registerSku, overseasStorageId) {
  itemtable = layui.table.render({
    elem: "#reststockin_additem_data_table",
    url: `${ctx}/overseasPurOtherStorage/getRegisterSkuInfo.html`,
    where: { registerSkus: registerSku, overseasStorageId: overseasStorageId },
    method: "post",
    id: 'reststockin_additem_data_table',
    cols: [
      [
        { type: 'checkbox' },
        { title: "图片", field: 'image', templet: '#overseas_reststockin_sku_image_tpl' },
        { title: "注册SKU", field: 'registerSku' },
        { title: "商品名称", field: 'title' },
        { title: "含税单价($)", field: 'buyerPrice' },
      ]
    ],
    done: function (res) {
      imageLazyload();
    }
  });
};

//下拉框赋值选中
function selected(pre, select, value) { //select的name值
  var $options = $('#' + pre + ' select[name="' + select + '"]').find('option');
  $options.each(function(index, item) {
    if ($(item).val() == value) {
      $(this).attr('selected', true);
    }
  });
  layui.form.render();
}

// 获取请求提交数据
function getrestinkData(itemdata, form) {
  var data = serializeObject($('#' + form));
  data.products = JSON.stringify(itemdata);
  data.director = pagedata.directorList[getIndex('directorId', pagedata.directorList, data.directorId)].director;
  return data;
};