/*
 * @Author: ztao
 * @Date: 2023-03-02 10:39:47
 * @LastEditTime: 2024-02-28 11:09:27
 * @Description:
 */

layui.use(
  ["admin", "form", "table", "layer", "laytpl", "formSelects"],
  function () {
    var admin = layui.admin,
      table = layui.table,
      form = layui.form,
      laytpl = layui.laytpl,
      formSelects = layui.formSelects,
      layer = layui.layer;

    let batchPolicyName = {
      //渲染表格
      tableRender: function () {
        var _this = this;
        table.render({
          elem: "#batchpolicy_table",
          method: "post",
          url: "/lms/orderRulePickBatch/query.html",
          page: false,
          limit: 10000,
          height: 'full-300',
          id: "batchpolicy_tableId",
          unFixedTableHead: true, // 不固定表头
          cols: [
            [
              { title: "波次名", field: "waveName" },
              { title: "策略名", field: "ruleName" },
              { title: "优先级", field: "priority" },
              {
                title: "订单类型",
                field: "orderType",
                templet: "#batchpolicy_orderType",
              },
              { title: "平台", field: "platCode" },
              { title: "物流方式集", field: "logisCollectionName" },
              { title: "剩余天数≤", field: "remainingDays" },
              { title: "订单处理时间", field: "orderProcessDay", templet : "#batchpolicy_orderProcessDay"},
              {title: "标记发货状态", field: "markShippingStatus", templet: `
                <div>
                <span>{{d.markShippingStatus == 1 ? '已标记' : (d.markShippingStatus == '' ? '':'未标记')}}</span>
                </div>
              `},
              {
                title: "订单国家/区域", field: "countryCode",templet: `
                <div>
                  <span>{{d.countryExclude ? '排除' : '包含'}}</span>
                  <span>{{d.countryCode || ''}}</span>
                </div>
                `
              },
              {
                title: "容量上下限",
                field: "capacity",
                templet: "#batchpolicy_capacity",
              },
              { title: "分组顺序", field: "groupingSequence" },
              {title: "按配货规则指定分拣人", field: "assignPickUser", width:83,templet: `
                <div>
                <span>{{d.assignPickUser == true ? '是' : '否'}}</span>
                </div>
              `},
              {title: "相同SKU订单合并生成批次", field: "mergeSameSku", width:92, templet: `
                <div>
                <span>{{d.mergeSameSku == true ? '是' : '否'}}</span>
                </div>
              `},
              {
                title: "状态",
                field: "status",
                templet: "#batchpolicy_status",
              },
              { title: "操作", toolbar: "#batchpolicy_tableIdBar" },
            ],
          ],
          done: function () {
            _this.watchBar();
          },
        });
      },
      watchBar: function () {
        let _this = this;
        table.on("tool(batchpolicy_tableFilter)", function (obj) {
          var data = obj.data;
          if (obj.event == "edit") {
            _this.layerHandle(2, data);
          } else if (obj.event == "delete") {
            _this.deleteApi(data.id).then((res) => {
              layer.msg(res || "删除成功", { icon: 1 });
              _this.tableRender();
            });
          } else if (obj.event == "setStatu") {
            let confirmStatus = !data.status;
            _this.saveapi({ ...data, status: confirmStatus }).then((res) => {
              layer.msg(res || "操作成功", { icon: 1 });
              _this.tableRender();
            });
          }
        });
      },
      //新增保存接口
      saveapi(obj) {
        return commonReturnPromise({
          url: "/lms/orderRulePickBatch/saveOrUpdateRule.html",
          type: "put",
          params: JSON.stringify(obj),
          contentType: "application/json",
        });
      },
      //枚举接口
      enumApi() {
        return commonReturnPromise({
          url: "/lms/orderRulePickBatch/listEnum.html",
        });
      },
      //删除接口
      deleteApi(id) {
        return commonReturnPromise({
          url: "/lms/orderRulePickBatch/deleteById.html",
          params: {
            ruleId: id,
          },
        });
      },
      //新增弹框
      addLayer() {
        let _this = this;
        $("#batchpolicy_addBtn").on("click", function () {
          let obj = {
            ruleName: "",
            priority: "",
            orderType: 1,
            platCode: "",
            remainingDays: "",
            orderProcessDayMin: "",
            orderProcessDayMax: "",
            logisCollectionId: "",
            capacityMin: "",
            capacityMax: "",
            groupingSequence: "",
          };
          _this.layerHandle(1, obj);
        });
      },
      //新增编辑弹框type:1新增,2编辑
      layerHandle(type, data) {
        let _this = this;
        _this.enumApi().then((res) => {
          let { logisCollectionMaps, platCodes,waveNames } = res;
          data.logisMaps = logisCollectionMaps;
          data.platCodes = platCodes;
          data.waveNames = waveNames;
          layer.open({
            title: type == 1 ? "新建批次策略" : "编辑批次策略",
            type: 1,
            btn: ["保存", "取消"],
            area: ["80%", "80%"],
            content: $("#batchpolicy_Layer").html(),
            id: "batchpolicy_LayerId",
            success: function (layero, index) {
              var tpl = batchpolicy_LayerFormTpl.innerHTML; //模板
              var tplContainer = document.getElementById(
                "batchpolicy_LayerForm"
              ); //容器
              laytpl(tpl).render(data, function (html) {
                tplContainer.innerHTML = html;
                form.render("select");
                form.render('checkbox');
                //监听订单类型下拉,动态切换生成批次选中
                form.on('select(batchpolicy_orderTypeFilter)', function(obj){
                  if(obj.value==1){
                    layero.find('[name=mergeSameSku]').prop('checked',false).prop('disabled',true);
                  }else{
                    layero.find('[name=mergeSameSku]').prop('disabled',false);
                  }
                  form.render('checkbox');
                });
                formSelects.render("batchpolicy_platCode");
                formSelects.render("batchpolicy_logisCollectionId");
                //国家/地区
                _this.countryClick(layero);
                //分组顺序设置
                _this.sortLayer(layero);
                if (type == 2) {
                  //编辑功能,需要赋值
                  formSelects.value(
                    "batchpolicy_logisCollectionId",
                    data.logisCollectionId.split(",")
                  );
                  formSelects.value(
                    "batchpolicy_platCode",
                    data.platCode.split(",")
                  );
                  layero.find('[name=countryExclude]').val(data.countryExclude);
                }
              });
            },
            yes: function (index, layero) {
              let data = serializeObject($("#batchpolicy_LayerForm"));
              if (
                !data.ruleName ||
                !data.priority ||
                !data.orderType ||
                !data.capacityMin ||
                !data.capacityMax
              ) {
                return layer.msg("*必填项不能为空", { icon: 7 });
              }
              if ((!data.orderProcessDayMin && data.orderProcessDayMax) || (!data.orderProcessDayMax && data.orderProcessDayMin)) {
                return layer.msg("订单处理时间起始都要填或都不填，不允许只填一个", { icon: 7 });
              }
              data.mergeSameSku = data.mergeSameSku == 'on' ? true: false;
              data.assignPickUser = data.assignPickUser == 'on' ? true: false;
              _this.saveapi(data).then((res) => {
                layer.msg(res || "新增成功", { icon: 1 });
                layer.close(index);
                _this.tableRender();
              });
            },
          });
        });
      },
      //分组顺序弹框[参数是父组件layero]
      sortLayer(pLayero) {
        $("#batchpolicy_groupBtn").on("click", function () {
          layer.open({
            type: 1,
            title: "分组顺序设置",
            area: ["600px", "400px"],
            content: $("#batchpolicy_groupLayer").html(),
            id: "batchpolicy_groupLayerId",
            btn: ["保存", "关闭"],
            success: function (layero) {
              let btn = layero.find("span.add");
              let input = layero.find("input.layui-input");
              let tbody = layero.find("tbody");
              let groupingSequenceInput = pLayero.find(
                "[name=groupingSequence]"
              );
              let defaultArr = groupingSequenceInput
                .val()
                .split(";")
                .filter((item) => item != "");
              if (defaultArr.length > 0) {
                for (let i = 0; i < defaultArr.length; i++) {
                  let item = defaultArr[i];
                  let trStr = `<tr>
                      <td>${i + 1}</td>
                      <td class="floor">${item}</td>
                      <td><span class="layui-btn-xs layui-btn layui-btn-danger">删除</span></td>
                    </tr>`;
                  tbody.append(trStr);
                }
              }
              btn.on("click", function () {
                let val = input.val();
                if (!val) {
                  return layer.msg("请输入添加的值", { icon: 7 });
                }
                let trLen = tbody.find("tr").length;
                let trStr = `<tr>
                    <td>${trLen + 1}</td>
                    <td class="floor">${val}</td>
                    <td><span class="layui-btn-xs layui-btn layui-btn-danger">删除</span></td>
                  </tr>`;
                tbody.append(trStr);
                input.val("");
              });
              tbody.on("click", "tr span.layui-btn", function () {
                $(this).closest("tr").remove();
                let trs = tbody.find("tr");
                if (trs.length > 0) {
                  tbody.html('');
                  for (let i = 0; i < trs.length; i++) {
                    let item = trs[i];
                    let val = $(item).find('.floor').text();
                    let trStr = `<tr>
                        <td>${i + 1}</td>
                        <td class="floor">${val}</td>
                        <td><span class="layui-btn-xs layui-btn layui-btn-danger">删除</span></td>
                      </tr>`;
                    tbody.append(trStr);
                  }
                }
              });
              tbody.on("dblclick", "tr td.floor", function () {
                let val = $(this).text();
                let $that = $(this);
                let $input = $(`<input class="layui-input" value="${val}">`);
                $that.html($input);
                $input.on("keydown", function (e) {
                  if (e.keyCode == 13) {
                    if (!e.target.value) {
                      return layer.msg("请输入", { icon: 7 });
                    } else {
                      let value = e.target.value;
                      $that.html(value);
                    }
                    return false;
                  }
                });
              });
            },
            yes: function (index, layero) {
              let trs = layero.find("tbody>tr");
              let floorArr = [];
              for (let i = 0; i < trs.length; i++) {
                let item = trs[i];
                let val = $(item).find("td.floor").text();
                floorArr.push(val);
              }
              let floorArrStr = floorArr.join(";");
              let groupingSequenceInput = pLayero.find(
                "[name=groupingSequence]"
              );
              let groupingSequenceDom = pLayero.find(".groupingSequence");
              groupingSequenceInput.val(floorArrStr);
              groupingSequenceDom.text(floorArrStr);
              layer.close(index);
            },
          });
        });
      },
      //国家/区域点击事件
      countryClick(layero){
        let that = this;
        //如果是编辑,那么要初始化值
        layero.find('div[data-type="countryCode"]').on('click', function(){
          let countryCode = $('#batchpolicy_LayerId').find('[name=countryCode]').val();
          let ckedEx= $('#batchpolicy_LayerId').find('[name=countryExclude]').val();
          that.countryLayer(countryCode=='' ? []: countryCode.split(','), ckedEx);
        });
      },
      //国家或区域弹框
      countryLayer(countryCode, ckedEx){
        let that = this;
        commonReturnPromise({
          url: '/lms/rule/init',
        }).then(res => {
          let countries = res.countries;
          layer.open({
            type: 1,
            title: '选择国家或区域',
            area: ['1100px', '700px'],
            btn: ['保存', '关闭'],
            content: $('#batchpolicy_countryLayer').html(),
            id: 'batchpolicy_countryLayerId',
            success: function (layero, index) {
              let tpl = batchpolicy_country_containerTpl.innerHTML;
              let tplContainer = document.getElementById('batchpolicy_country_container');
              laytpl(tpl).render(countries, function (html) {
                tplContainer.innerHTML = html;
                form.render('checkbox');
                that.watchAllCksCountry();
                that.watchSingleCksCountry();
                that.countrySearch(countries);
                that.watchSelectedCountry();
              });
              let $selted = layero.find('.country_countainer_selected_content');
              let $body = layero.find('.country_countainer_content');
              if (countryCode) {
                let datas = countryCode;
                for (let i = 0; i < datas.length; i++) {
                  let item = datas[i];
                  $body.find(`input[name="${item}&auto"]`).attr('checked', true);
                  let title = $body.find(`input[name="${item}&auto"]`).attr('title');
                  let str = `<input type="checkbox" title="${title}" name="${item}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
                  $selted.append(str);
                };
                form.render('checkbox');
              };
              if(ckedEx == 'true'){
                layero.find('.country_countainer_selected_title').find('[name=excludeCountry]').prop('checked', true);
                form.render('checkbox');
              }
            },
            yes: function (index, layero) {
              //保存的时候执行事件
              let ckes = layero.find('.country_countainer_selected_content').find('input[type=checkbox]');
              let ckedEx= layero.find('.country_countainer_selected_title').find('[name=excludeCountry]').is(':checked');
              // if (!ckes.length) {
              //   layer.msg('保存前请先选择国家或区域');
              //   return;
              // };
              let codeArr = [];
              let countrysArr = [];
              for (let i = 0; i < ckes.length; i++) {
                let item = ckes[i];
                let name = $(item).attr('name');
                let title = $(item).attr('title');
                codeArr.push(name);
                countrysArr.push(title);
              };
              if(ckedEx){
                $('#batchpolicy_LayerId').find('.batchpolicy_a').text('排除以下国家/地区:')
                $('#batchpolicy_LayerId').find('[name=countryExclude]').val('true');
              }else{
                $('#batchpolicy_LayerId').find('.batchpolicy_a').text('包含以下国家/地区:')
                $('#batchpolicy_LayerId').find('[name=countryExclude]').val('false');
              }
              let displayContent = `${countrysArr.join(',')}`;
              $('#batchpolicy_LayerId').find('span.batchpolicy_span').html(displayContent);
              $('#batchpolicy_LayerId').find('input[name="countryCode"]').val(codeArr.join(','));
              layer.close(index);
            },
            btn2: function(index){
              layer.close(index);
              return false;
            }
          });
        });
      },
      //国家/区域选择全选
      watchAllCksCountry: function () { // watch country is  all select
        let allLetters = ['aeCountries', 'fjCountries', 'koCountries', 'ptCountries', 'uzCountries'];
        for (let i = 0; i < allLetters.length; i++) {
          let item = allLetters[i];
          form.on(`checkbox(${item})`, function (obj) {
            var cked = obj.elem.checked;
            var $tar = $(obj.elem).parents('.layui-tab-item.layui-show').find('.layui-form')[1];
            var ckes = $($tar).find('input[type=checkbox]');
            if (cked) {
              for (var i = 0; i < ckes.length; i++) {
                var item = ckes[i];
                if (!$(item).is(':checked')) {
                  $(item).next().trigger('click');
                }
              }
            } else {
              for (var i = 0; i < ckes.length; i++) {
                var item = ckes[i];
                if ($(item).is(':checked')) {
                  $(item).next().trigger('click');
                }
              }
            }
          });
        };
      },
      watchSingleCksCountry: function () { // watch country is single select
        form.on('checkbox(conditionCountriesFilter)', function (obj) {
          let cked = obj.elem.checked;
          let title = obj.elem.title;
          let name = obj.elem.name.split('&')[0];
          let $selectCondition = $('.country_countainer_selected_content');
          if (cked) {
            let $input = `<input type="checkbox" title="${title}" name="${name}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
            // 列表对应的国家也选上
            $(`input[name='${obj.elem.name}']`).prop("checked", true)
            $selectCondition.append($input);
          } else {
            let $removeTarget = $selectCondition.find(`input[name=${name}]`);
            $removeTarget.next().remove();
            $removeTarget.remove();
          }
          form.render('checkbox');
        });
      },
      countrySearch: function (countries) { // get all and compare, if true render new checkbox
        var cnArr = [];
        var enArr = [];
        for (var obj in countries) {
          var item = countries[obj];
          for (var i = 0; i < item.length; i++) {
            cnArr.push(item[i]['name']);
            enArr.push(item[i]['abbr']);
          }
        };
        $('#batchpolicy_country_container').on('keydown', '[name=country_search]', function (e) {
          var targetForm = $('.allCountrySearchContainer').find('.layui-form');
          var $selectCondition = $(".country_countainer_selected_content")
          // 已选中的值
          let checkedList = []
          $selectCondition.find("input").each(function () {
            let curName = $(this).attr("name").split("&auto")[0]
            checkedList.push(curName)
          })
          if (e.keyCode == 13) {
            if (e.target.value) {
              $('.allCountryContainer').addClass('disN');
              $('.allCountrySearchContainer').removeClass('disN');
              targetForm.html('');
              var valArr = e.target.value.replace(/，/g, ",").replace(/\s+/g, "").split(',');
              for (var j = 0; j < valArr.length; j++) {
                var transVal = valArr[j].toUpperCase();
                if (cnArr.indexOf(transVal) > -1 || enArr.indexOf(transVal) > -1) {
                  var k = cnArr.indexOf(transVal) > -1 ? cnArr.indexOf(transVal) : enArr.indexOf(transVal)
                  var combinationStr = cnArr[k] + "(" + enArr[k] + ")"
                  // 避免选中的国家 出现相同的国家  判断当前输入的数据是否与选中的国家有相同的数据，相同的话，则需要选上
                  let curCheckedCountry = checkedList.filter((item) => item == enArr[k])
                  var str = `<input type="checkbox" title="${combinationStr}" name="${enArr[k]
                    }&auto" lay-skin="primary" ${curCheckedCountry.length ? "checked" : ""
                    } lay-filter="conditionCountriesFilter">`
                  targetForm.append(str);
                } else {
                  targetForm.append('');
                }
              };
              form.render('checkbox');
            } else {
              $('.allCountryContainer').removeClass('disN');
              $('.allCountrySearchContainer').addClass('disN');
              targetForm.html('');
            }
          }
        })
        // 根据输入框的值，全选下面的值
        $("#batchpolicy_country_checkSelect_btn").click(function () {
          var countryList = $("#batchpolicy_country_container")
            .find("input[name=country_search]")
            .val().replace(/，/g, ",").replace(/\s+/g, "")
            .split(",")
          var $selectCondition = $(".country_countainer_selected_content")
          // 已选中的值
          let checkedList = []
          $selectCondition.find("input").each(function () {
            let curName = $(this).attr("name").split("&auto")[0]
            checkedList.push(curName)
          })
          for (var j = 0; j < countryList.length; j++) {
            var transVal = countryList[j].toUpperCase()
            if (cnArr.indexOf(transVal) > -1 || enArr.indexOf(transVal) > -1) {
              var k =
                cnArr.indexOf(transVal) > -1
                  ? cnArr.indexOf(transVal)
                  : enArr.indexOf(transVal)
              let name = enArr[k] + "&auto"
              let title = cnArr[k]
              $(`input[name='${name}']`).prop("checked", true)
              // 避免选中的国家 出现相同的国家  判断当前输入的数据是否与选中的国家有相同的数据，如果相同的话，则不需要加到选中国家的列表中
              let curCheckedCountry = checkedList.filter(
                (item) => item == enArr[k]
              )
              if (!curCheckedCountry.length) {
                var $input = `<input type="checkbox" title="${title}" name="${enArr[k]}" lay-skin="primary" lay-filter="selectedCondition" checked>`
                $selectCondition.append($input)
              }
            }
          }
          form.render("checkbox")
        })
      },
      watchSelectedCountry: function () { // watch selected country click
        form.on('checkbox(selectedCondition)', function (obj) {
          var elem = obj.elem;
          var name = elem.name + '&auto';
          var cked = elem.checked;
          if (!cked) {
            $(elem).next().remove();
            $(elem).remove();
            $(`[name="${name}"]`).removeAttr('checked');
            form.render('checkbox');
          };
        });
      },
    };

    batchPolicyName.tableRender();

    batchPolicyName.addLayer();
  }
);

function numberCheck(value, name) {
  if (value > 9999.99) {
    $(`input[name='${name}']`).val(9999.99);
    return layer.msg('输入的数字不能大于9999.99');
  }
  if (value < 0) {
    $(`input[name='${name}']`).val(0);
    return layer.msg('输入的数字不能小于0');
  }
  if (parseFloat(value).toFixed(2) != parseFloat(value)) {
    $(`input[name='${name}']`).val(parseFloat(value).toFixed(2));
    return layer.msg('输入的数字小数点后不能大于2位');
  }
}