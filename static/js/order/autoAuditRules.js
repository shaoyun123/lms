layui.use(['table', 'form', 'layer', 'laytpl'], function () {
  var table = layui.table,
    layer = layui.layer,
    laytpl = layui.laytpl,
    form = layui.form;
  form.render('select');

  var autoAuditRules = {
    initData: {
      pageEnum: {
        currencys: [],
        platCodes: [],
        storeTree: [],
        warehouseTypes: []
      },
      typeMap: {
        'platCodes': '平台',
        'storeShippingTypes': '店铺运输方式',
        'storeAcctIds': '店铺',
        'logisTypeNames': '物流方式',
        'orderProfit': '利润',
        'orderProfitRate': '利润率',
        'orderAmt': '订单金额',
        'countryCode': '国家/地区',
        'configTime': '配置时间'
      },
      //  枚举值参考：1607 【自动审核规则】新增平台订单状态的设置条件，http://zentao.epean.cn/zentao/task-view-1607.html
      platCodeStatus: {
        shopee: 'ready_to_ship',
        aliexpress: 'wait_seller_send_goods',
        lazada: 'pending',
        wish: 'APPROVED',
        amazon: 'Unshipped',
        ebay: 'completed',
        joom: 'APPROVED',
        fyndiq: 'CREATED',
        mercado: 'paid',
        walmart: 'Created',
        coupang: 'INSTRUCT',
        shein商城: 'To Be Shipped',
        miravia: 'waitShipping'
      },
      noHandleCondition: null
    },
    init: function () {
      var _this = this
      getHandleIgnoreEnum(function (returnData) {
        _this.initData.pageEnum = returnData.data
      })
      _this.render()
      _this.listenOntool()
    },
    render: function () {
      const _this = this
      table.render({
        elem: '#autoAuditRules_table',
        method: 'get',
        url: ctx + '/order/rule/audit/list.html',
        where: {},
        unFixedTableHead: true,
        cols: [
          [
            { title: '平台', field: 'platCode', },
            // {title:'符合平台状态',field:'platCodeStatus', templet: function(d){
            //     return _this.initData.platCodeStatus[d.platCode] || ''
            // }},
            { title: '符合平台状态', field: 'platOrderStatus' },
            { title: '备注', field: 'remark' },
            { title: '是否启用自动审核', field: 'autoAudit', templet: '#autoAuditRules_auditStatustpl' },
            { title: '操作', align: 'center', toolbar: '#autoAuditRules_Tool' }
          ]
        ],
        page: false,
        id: "autoAuditRules_table",
        limit: Number.MAX_VALUE,
        done: function (res) {
        }
      });
    },
    listenOntool: function () {
      var _this = this
      table.on('tool(autoAuditRules_table)', function (obj) {
        var data = obj.data;
        var event = obj.event
        if (event == 'autoAudit_off' || event == 'autoAudit_on') {
          autoAuditModifyStatus({ id: data.id, autoAudit: !data.autoAudit }, function (returnData) {
            const tips = data.autoAudit ? '停用成功' : '启用成功'
            layer.msg(returnData.msg || tips)
            _this.render()
          })
        } else if (obj.event == 'manageIgnoreCondition') {
          _this.manageIgnoreOption(data)
        }
      })
    },
    manageIgnoreOption: function (data) {
      var _this = this
      layer.open({
        type: 1,
        title: '不处理条件',
        area: ['60%', '60%'],
        btn: ['关闭'],
        content: $('#autoAuditRules_mangeIgnorePop').html(),
        id: 'autoAuditRules_mangeIgnorePopId',
        success: function (layero, index) {
          layero.find('[name=autoAuditRules_mangeIgnorePopName]').val(data.id);
          $(layero).find('button').click(function () {
            _this.handleIgnoreEdit(data.id, {}, function (data) {
              _this.initData.noHandleCondition.push(data)
              _this.handleIgnoreTable(_this.initData.noHandleCondition)
            })
          })
          commonReturnPromise({
            url: ctx + `/order/rule/audit/nohandlecondition/list.html?id=${data.id}`
          }).then(res => {
            _this.initData.noHandleCondition = res.map(item => ({ ruleId: data.id, ...item }));
            _this.handleIgnoreTable(_this.initData.noHandleCondition)
          })
        },
        yes: function (index, layero) {
          layer.close(index)
        }
      });
    },
    handleIgnoreTable: function (data) {
      var _this = this
      var trtpl = mangeIgnoreConditionTable_bodytpl.innerHTML
      var tbodyContainer = $('#mangeIgnoreConditionTable_body')
      laytpl(trtpl).render(data, function (html) {
        tbodyContainer.html(html);
        table.init('mangeIgnoreConditionTable');
        _this.listenOnIgnoreTabletool()
        _this.displayHover()
      });
    },
    listenOnIgnoreTabletool: function () {
      var _this = this
      table.on('tool(mangeIgnoreConditionTable)', function (obj) {
        var index = $(obj.tr).attr('data-index');
        var event = obj.event
        var rowdata = _this.initData.noHandleCondition[index]
        if (event == 'handleIgnore_modify') {
          _this.handleIgnoreEdit(rowdata.ruleId, rowdata, function (data) {
            var trtpl = mangeIgnoreConditionTable_bodytpl.innerHTML
            var tbodyContainer = $('#mangeIgnoreConditionTable_body')
            laytpl(trtpl).render([data], function (html) {
              tbodyContainer.find('tr[data-index="' + index + '"]').replaceWith(html)
              table.init('mangeIgnoreConditionTable');
              _this.listenOnIgnoreTabletool()
            });
            _this.initData.noHandleCondition[index] = data
          })
        } else if (obj.event == 'handleIgnore_delete') {
          rowdata.ruleId = $('[name=autoAuditRules_mangeIgnorePopName]').val();
          layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            delHandleIgnoreConditions({ id: rowdata.ruleId, conditionId: rowdata.id }, function (returnData) {
              layer.msg(returnData.msg || '删除成功')
              obj.del()
              layer.close(index)
            })
          });
        }
      })
    },
    handleIgnoreEdit: function (id, data, func) {
      var _this = this
      var isEdit = data ? true : false
      var title = isEdit ? '新增不处理条件' : '修改不处理条件'
      layer.open({
        type: 1,
        title: title,
        area: ['60%', '60%'],
        btn: ['保存', '关闭'],
        content: $('#new_mangeIgnorePop').html(),
        id: 'new_mangeIgnorePopId',
        success: function (layero, index) {
          form.render()
          var optiontpl = autoAuditRules_options_tpl.innerHTML
          var warehouseTypescontainer = $(layero).find('select')
          laytpl(optiontpl).render(autoAuditRules.initData.pageEnum.warehouseTypes, function (html) {
            warehouseTypescontainer.html(html);
            form.render()
          });
          _this.listenOnCheckBox()
          _this.listenOnLi()
          if (isEdit) {
            $(layero).find('input[name="id"]').val(data.id)
            $(layero).find('select').val(data.warehouseType)
            var $ul = $('#autoRules_conditions')
            for (var i in data) {
              $('.autoRules_conditionType').find('input[name="' + i + '"]').attr('checked', true)
              var type = _this.initData.typeMap[i]
              if (type) {
                if (i == 'storeAcctIds' && data.storeAcctNames) {//店铺
                  var displayContent = `${data.storeAcctNames.join(';')}`
                } else if(i == 'countryCode' && data.countryCodeNames){
                  var displayContent = `${data.countryCodeNames.join(';')}`
                }else if (i == 'configTime') {
                  var displayContent = `${data[i]}`
                } else if (data[i].length) {
                  var displayContent = `${data[i] && data[i].join(';') || ''}`
                } else {
                  var displayContent = `${data[i].minAmt || data[i].minRate || 0} ~ ${data[i].maxAmt || data[i].maxRate || 0}`
                  if (i == "orderAmt") {
                    displayContent += `(${data[i].currency})`
                  } else if (i == "orderProfit") {
                    displayContent += `(RMB)`
                  }
                }
                var str = `<li data-type="${i}">
                                <a href="javascript:;" class="autoAuditRules_a">指定${type}:</a>
                                <span style="word-break: break-all;">${displayContent}</span>
                              </li>`
                $ul.append(str)
              }
              $ul.find('li[data-type="' + i + '"]').data('value', data[i])
              $ul.find('li[data-type="' + i + '"]').data('id', data.id)
              $ul.find('li[data-type="storeAcctIds"]').data('name', data.storeAcctNames)
              $ul.find('li[data-type="countryCode"]').data('name', data.countryCodeNames)
            }
            form.render()
          }
        },
        yes: function (index, layero) {
          var $lis = $(layero).find('#autoRules_conditions').find('li')
          var noHandleCondition = {}
          $lis.each(function (index, item) {
            var type = $(item).data('type')
            var value = $(item).data('value')
            noHandleCondition[type] = value
            if (type == "storeAcctIds") {
              var name = $(item).data('name')
              noHandleCondition.storeAcctNames = name
            }
            if(type == 'countryCode'){
              var name = $(item).data('name')
              noHandleCondition.countryCodeNames = name
            }
          })
          noHandleCondition.warehouseType = $(layero).find('select').val();
          noHandleCondition.id = $(layero).find('input[name="id"]').val();
          updateIgnoreCondition({ id: id, noHandleCondition: JSON.stringify(noHandleCondition) }, function (returnData) {
            layer.msg(returnData.msg || '操作成功')
            layer.close(index)
            if (func) {
              noHandleCondition.id = returnData.data
              func(noHandleCondition)
            }
          })
        }
      });
    },
    optionsTypeMap: {
      //指定平台
      'platCodes': function (platCodes) {
        layer.open({
          type: 1,
          title: '平台',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_platformPop').html(),
          id: 'autoAuditRules_platformPopId',
          success: function (layero, index) {
            var tpl = autoAuditRules_platformContainertpl.innerHTML;
            var tplContainer = $(layero).find('#autoAuditRules_platformContainer');
            laytpl(tpl).render(autoAuditRules.initData.pageEnum.platCodes, function (html) {
              tplContainer.html(html);
            });
            tplContainer.find('input[type=checkbox]').each(function (index, item) {
              if ((platCodes || []).indexOf(item.value) > -1) {
                $(item).attr('checked', true)
              }
            })
            form.render('checkbox');
          },
          yes: function (index, layero) {
            var checkboxes = $('#autoAuditRules_platformContainer').find('input[type=checkbox]');
            var ckesArr = [];
            for (var i = 0; i < checkboxes.length; i++) {
              var item = checkboxes[i];
              if ($(item).is(':checked')) {
                ckesArr.push($(item).val());
              }
            };
            $('#autoRules_conditions li[data-type="platCodes"]').data('value', ckesArr)
            $('#autoRules_conditions li[data-type="platCodes"]').find('span').text(ckesArr.join(';'))
            layer.close(index);
          }
        })
      },
      //指定店铺
      'storeAcctIds': function () {
        var autoAuditRulesXTree;
        layer.open({
          type: 1,
          title: '店铺',
          area: ['580px', '650px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_storePop').html(),
          id: 'autoAuditRules_storePopId',
          success: function (layero, index) {
            // autoAuditRulesXTree = new layuiXtree({
            //   elem: 'autoAuditRulesXTree'   //(必填) 放置xtree的容器id，不要带#号
            //   , form: form     //(必填) layui 的 from
            //   , data: autoAuditRules.initData.pageEnum.storeTree     //(必填) json数组（数据格式在下面）
            //   , isopen: false //加载完毕后的展开状态，默认值：true,
            //   , isParentChangeCheck: false
            //   , ckall: true //启用全选功能
            //   , color: { //三种图标颜色，独立配色，更改几个都可以
            //     open: "#EE9A00", //节点图标打开的颜色
            //     close: "#EEC591", //节点图标关闭的颜色
            //     end: "#828282", //末级节点图标的颜色
            //   }
            // });
            let storeAcctIdList = []
            var $input = $('#autoRules_conditions li[data-type="storeAcctIds"]');
            if ($input.data('value') && $input.data('value').length>0) {
                //   选中的数据
                storeAcctIdList = $input.data('value');
            }
            function dealDataKey(b) {
              let arr = []
              if (Array.isArray(b)) {
                  b.forEach((item) => {
                      let curChecked = storeAcctIdList.filter(
                          (elem) => elem == item.value
                      )
                      arr.push({
                          name: item.title,
                          value: item.value,
                          selected: curChecked.length ? true : item.checked,
                          children: item.data.length ? dealDataKey(item.data) : [],
                      })
                  })
                  return arr
              }
            }
            let _result = dealDataKey(autoAuditRules.initData.pageEnum.storeTree)
            autoAuditRulesXTree = xmSelect.render({
                el: "#autoAuditRulesXTree",
                toolbar: {
                    show: true,
                },
                height: "350px",
                delay: 1000,
                paging: true,
                pageSize: 1000,
                filterable: true,
                filterMethod: function (val, item, index, prop) {
                    let _val = val.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
                    //   输入多个数据
                    if (_val.includes(",")) {
                        let _valArr = _val.split(",")
                        let isSameVal = _valArr.some(
                            (elem) => elem == item.value || item.name == elem
                        )
                        return isSameVal
                    } else if (_val == item.value) {
                        //把value相同的搜索出来
                        return true
                    } else if (item.name.indexOf(_val) != -1) {
                        //名称中包含的搜索出来
                        return true
                    }
                    return false //不知道的就不管了
                },
                data: _result,
                filterDone:function(val, list) {
                }
            });
          },
          yes: function (index, layero) {
            // var checkboxes = autoAuditRulesXTree.GetChecked()
            // var values = checkboxes.map(function (item) {
            //   return item.value
            // })
            // var titles = checkboxes.map(function (item) {
            //   return item.title
            // })
            var selectArr = autoAuditRulesXTree.getValue()
            var values = selectArr.map((item) => item.value)
            var titles = selectArr.map((item) => item.name)
            $('#autoRules_conditions li[data-type="storeAcctIds"]').data('value', values)
            $('#autoRules_conditions li[data-type="storeAcctIds"]').data('name', titles)
            $('#autoRules_conditions li[data-type="storeAcctIds"]').find('span').text(titles.join(';'))
            layer.close(index);
          }
        })
      },
      'storeShippingTypes': function (storeShippingTypes) {
        layer.open({
          type: 1,
          title: '店铺运输方式',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_transportPop').html(),
          id: 'autoAuditRules_transportPopId',
          success: function (layero, index) {
            var $tbody = $('#autoAuditRulesTable_tbody');
            var $input = $(layero).find('input')
            storeShippingTypes = storeShippingTypes ? storeShippingTypes : []
            storeShippingTypes.forEach(function (item, index) {
              var str = `<tr data-value="${item}">
                                        <td>${item}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                            </tr>`;
              $tbody.append(str);
            })
            $('#autoAuditRulesTable_tbody_add').on('click', function () {
              var val = $input.val();
              if (!val) {
                layer.msg('不能新增空值');
                return;
              } else {
                var str = `<tr data-value="${val}">
                                        <td>${val}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                                    </tr>`;
                $tbody.append(str);
                $input.val('');
              }
            });
          },
          yes: function (index, layero) {
            var $trs = $('#autoAuditRulesTable_tbody').find('tr');
            var tranports = []
            $trs.each(function (index, item) {
              tranports.push($(item).data('value'))
            })
            $('#autoRules_conditions li[data-type="storeShippingTypes"]').data('value', tranports)
            $('#autoRules_conditions li[data-type="storeShippingTypes"]').find('span').text(tranports.join(';'))
            layer.close(index);
          }
        })
      },
      'logisTypeNames': function (logisTypeNames) {
        layer.open({
          type: 1,
          title: '物流方式',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_logicsPop').html(),
          id: 'autoAuditRules_logicsPopId',
          success: function (layero, index) {
            var $tbody = $('#autoAuditRules_logicsTable_tbody');
            var $input = $(layero).find('input')
            logisTypeNames = logisTypeNames ? logisTypeNames : []
            logisTypeNames.forEach(function (item, index) {
              var str = `<tr data-value="${item}">
                                        <td>${item}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                            </tr>`;
              $tbody.append(str);
            })
            $('#autoAuditRules_logicsTable_tbody_add').on('click', function () {
              var val = $input.val();
              if (!val) {
                layer.msg('不能新增空值');
                return;
              } else {
                var str = `<tr data-value="${val}">
                                        <td>${val}</td>
                                        <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="$(this).parents('tr').remove()">删除</span></td>
                                    </tr>`;
                $tbody.append(str);
                $input.val('');
              }
            });
          },
          yes: function (index, layero) {
            var $trs = $('#autoAuditRules_logicsTable_tbody').find('tr');
            var tranports = []
            $trs.each(function (index, item) {
              tranports.push($(item).data('value'))
            })
            $('#autoRules_conditions li[data-type="logisTypeNames"]').data('value', tranports)
            $('#autoRules_conditions li[data-type="logisTypeNames"]').find('span').text(tranports.join(';'))
            layer.close(index);
          }
        })
      },
      'orderProfit': function (orderProfit) {
        layer.open({
          type: 1,
          title: '利润',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_orderprofitPop').html(),
          id: 'autoAuditRules_orderprofitPopId',
          success: function (layero, index) {
            if (orderProfit) {
              $(layero).find('input[name="minAmt"]').val(orderProfit.minAmt);
              $(layero).find('input[name="maxAmt"]').val(orderProfit.maxAmt);
            }
          },
          yes: function (index, layero) {
            var minAmt = $(layero).find('input[name="minAmt"]').val();
            var maxAmt = $(layero).find('input[name="maxAmt"]').val();
            if (Number(minAmt) > Number(maxAmt)) {
              layer.msg("最小利润不能大于最大利润")
              return;
            }
            $('#autoRules_conditions li[data-type="orderProfit"]').data('value', { minAmt, maxAmt })
            $('#autoRules_conditions li[data-type="orderProfit"]').find('span').text(minAmt + ' ~ ' + maxAmt + '(RMB)')
            layer.close(index)
          }
        })
      },
      'orderProfitRate': function (orderProfitRate) {
        layer.open({
          type: 1,
          title: '利润率',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_orderprofitRatePop').html(),
          id: 'autoAuditRules_orderprofitRatePopId',
          success: function (layero, index) {
            if (orderProfitRate) {
              $(layero).find('input[name="minRate"]').val(orderProfitRate.minRate);
              $(layero).find('input[name="maxRate"]').val(orderProfitRate.maxRate);
            }
          },
          yes: function (index, layero) {
            var minRate = $(layero).find('input[name="minRate"]').val();
            var maxRate = $(layero).find('input[name="maxRate"]').val();
            if (minRate > maxRate) {
              layer.msg("最小利润率不能大于最大利润率")
              return;
            }
            $('#autoRules_conditions li[data-type="orderProfitRate"]').data('value', { minRate, maxRate })
            $('#autoRules_conditions li[data-type="orderProfitRate"]').find('span').text(minRate + ' ~ ' + maxRate)
            layer.close(index)
          }
        })
      },
      'orderAmt': function (orderAmt) {
        layer.open({
          type: 1,
          title: '订单金额',
          area: ['500px', '500px'],
          btn: ['保存', '关闭'],
          content: $('#autoAuditRules_orderAmt').html(),
          id: 'autoAuditRules_orderAmtId',
          success: function (layero, index) {
            var tpl = autoAuditRules_options_tpl.innerHTML;
            var tplContainer = $(layero).find('select');
            laytpl(tpl).render(autoAuditRules.initData.pageEnum.currencys, function (html) {
              tplContainer.html(html);
              if (orderAmt) tplContainer.val(orderAmt.currency)
              form.render('select')
            });
            if (orderAmt) {
              $(layero).find('input[name="minAmt"]').val(orderAmt.minAmt);
              $(layero).find('input[name="maxAmt"]').val(orderAmt.maxAmt);
            }
          },
          yes: function (index, layero) {
            var minAmt = $(layero).find('input[name="minAmt"]').val();
            var maxAmt = $(layero).find('input[name="maxAmt"]').val();
            var currency = $(layero).find('select').val();
            if (Number(minAmt) > Number(maxAmt)) {
              layer.msg("最小订单金额不能大于最大订单金额")
              return;
            }
            $('#autoRules_conditions li[data-type="orderAmt"]').data('value', { minAmt, maxAmt, currency })
            $('#autoRules_conditions li[data-type="orderAmt"]').find('span').text(minAmt + ' ~ ' + maxAmt + '(' + currency + ')')
            layer.close(index)
          }
        })
      },
      'countryCode': function (countryCode) {
        commonReturnPromise({
          url: '/lms/rule/init',
        }).then(res => {
          let countries = res.countries;
          layer.open({
            type: 1,
            title: '选择国家或区域',
            area: ['1100px', '700px'],
            btn: ['保存', '关闭'],
            content: $('#autoAuditRules_countryLayer').html(),
            id: 'autoAuditRules_countryLayerId',
            success: function (layero, index) {
              var tpl = autoAuditRules_country_containerTpl.innerHTML;
              var tplContainer = document.getElementById('autoAuditRules_country_container');
              laytpl(tpl).render(countries, function (html) {
                tplContainer.innerHTML = html;
                form.render('checkbox');
                autoAuditRules.watchAllCksCountry();
                autoAuditRules.watchSingleCksCountry();
                autoAuditRules.countrySearch(countries);
                autoAuditRules.watchSelectedCountry();
              });
              var $selted = layero.find('.country_countainer_selected_content');
              var $body = layero.find('.country_countainer_content');
              // console.log(countryCode);
              if (countryCode) {
                var datas = countryCode;
                for (var i = 0; i < datas.length; i++) {
                  var item = datas[i];
                  $body.find(`input[name="${item}&auto"]`).attr('checked', true);
                  var title = $body.find(`input[name="${item}&auto"]`).attr('title');
                  var str = `<input type="checkbox" title="${title}" name="${item}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
                  $selted.append(str);
                };
                form.render('checkbox');
              };
            },
            yes: function (index, layero) {
              var ckes = layero.find('.country_countainer_selected_content').find('input[type=checkbox]');
              if (!ckes.length) {
                layer.msg('保存前请先选择国家或区域');
                return;
              };
              var codeArr = [];
              var countrysArr = [];
              for (var i = 0; i < ckes.length; i++) {
                var item = ckes[i];
                var name = $(item).attr('name');
                var title = $(item).attr('title');
                codeArr.push(name);
                countrysArr.push(title);
              };
              var displayContent = `${countrysArr.join(';')}`;
              $('#autoRules_conditions li[data-type="countryCode"]').data('value', codeArr);
              $('#autoRules_conditions li[data-type="countryCode"]').data('name', countrysArr);
              $('#autoRules_conditions li[data-type="countryCode"]').find('span').text(displayContent);
              layer.close(index);
            },
            btn2: function(index){
              layer.close(index);
              return false;
            }
          });
        });
      },
      'configTime': function (time) {
        layer.open({
          type: 1,
          title: '设置时间',
          area: ['40%', '40%'],
          btn: ['保存', '关闭'],
          content: `<div style="padding:20px;"><input class="layui-input" type="number" name="time" value="${time || ''}" oninput="javascript:if(value<0) value=0;" /></div>`,
          id: 'aar_configTimeId',
          yes: function (index, layero) {
            let inputTime = layero.find('[name=time]').val().trim();
            $('#autoRules_conditions li[data-type="configTime"]').data('value', inputTime)
            $('#autoRules_conditions li[data-type="configTime"]').find('span').text(inputTime)
            layer.close(index);
          }
        })
      }
    },
    listenOnCheckBox: function () {
      var $ul = $('#autoRules_conditions')
      form.on('checkbox(autoAuditRuleschooseType)', function (obj) {
        if (obj.elem.checked) {
          var str = `<li data-type="${obj.value}">
                <a href="javascript:;" class="autoAuditRules_a">指定${obj.elem.title}:</a>
                <span style="word-break: break-all;"></span>
              </li>`
          $ul.append(str)
        } else {
          $ul.find('li[data-type="' + obj.value + '"]').remove()
        }
      })
    },
    listenOnLi: function () {
      var _this = this
      $('body').on('click', '#autoRules_conditions li', function () {
        var type = $(this).data('type')
        var value = $(this).data('value')
        var options = _this.optionsTypeMap[type]
        if (options) {
          options(value)
        } else {
          layer.msg("暂时没有相应操作")
        }
      })
    },
    displayHover: function () {
      $('body').on('mouseover', '.suspension', function () {
        var note = $(this).attr('data-note')
        var color = $(this).attr('data-color') || '6EB714'
        note = note.split(';').join('<br/>')
        if (note !== "")
          layer.tips(note, this, {
            tips: [1, '#' + color],
            time: 5000
          });
        $('.layui-layer-tips').css({ 'width': '500px', 'word-break': 'break-all' })
      })
    },
    //国家/区域选择
    watchAllCksCountry: function () { // watch country is  all select
      var allLetters = ['aeCountries', 'fjCountries', 'koCountries', 'ptCountries', 'uzCountries'];
      var $selectCondition = $('.country_countainer_selected_content');
      for (var i = 0; i < allLetters.length; i++) {
        var item = allLetters[i];
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
        var cked = obj.elem.checked;
        var title = obj.elem.title;
        var name = obj.elem.name.split('&')[0];
        var $selectCondition = $('.country_countainer_selected_content');
        if (cked) {
          var $input = `<input type="checkbox" title="${title}" name="${name}" lay-skin="primary" lay-filter="selectedCondition" checked>`;
          // 列表对应的国家也选上
          $(`input[name='${obj.elem.name}']`).attr("checked", true)
          $selectCondition.append($input);
        } else {
          var $removeTarget = $selectCondition.find(`input[name=${name}]`);
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
      $('#autoAuditRules_country_container').on('keydown', '[name=country_search]', function (e) {
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
              console.log(transVal);
              if (cnArr.indexOf(transVal) > -1 || enArr.indexOf(transVal) > -1) {
                var k = cnArr.indexOf(transVal) > -1 ? cnArr.indexOf(transVal) : enArr.indexOf(transVal)
                var combinationStr = cnArr[k] + "(" + enArr[k] + ")"
                // 避免选中的国家 出现相同的国家  判断当前输入的数据是否与选中的国家有相同的数据，相同的话，则需要选上
                let curCheckedCountry = checkedList.filter((item) => item == enArr[k])
                var str = `<input type="checkbox" title="${combinationStr}" name="${enArr[k]
                  }&auto" lay-skin="primary" ${curCheckedCountry.length ? "checked=checked" : ""
                  }lay-filter="conditionCountriesFilter">`
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
      $("#autoAuditRules_country_checkSelect_btn").click(function () {
        var countryList = $("#autoAuditRules_country_container")
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
          console.log(transVal)
          if (cnArr.indexOf(transVal) > -1 || enArr.indexOf(transVal) > -1) {
            var k =
              cnArr.indexOf(transVal) > -1
                ? cnArr.indexOf(transVal)
                : enArr.indexOf(transVal)
            let name = enArr[k] + "&auto"
            let title = cnArr[k]
            $(`input[name='${name}']`).attr("checked", true)
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
  }

  autoAuditRules.init()
  window.getWarehouseTypeName = function (str) {
    const warehouseTypes = autoAuditRules.initData.pageEnum && autoAuditRules.initData.pageEnum.warehouseTypes || [];
    let warehouseTypesName = ""
    for (var item of warehouseTypes) {
      if (item.code == str) {
        warehouseTypesName = item.name
      }
    }
    return warehouseTypesName
  }
  // 页面数据请求
  // 停用/启用规则
  function autoAuditModifyStatus (data, func) {
    initAjax('/order/rule/audit/update.html', 'POST', data, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  // 获取页面枚举
  function getHandleIgnoreEnum (func) {
    initAjax('/order/rule/audit/init.html', 'GET', {}, function (returnData) {
      if (func) {
        func(returnData)
      }
    })
  }

  // 删除不处理条件
  function delHandleIgnoreConditions (data, func) {
    initAjax('/order/rule/audit/nohandlecondition/delete.html', 'post', data, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  //更新不处理条件
  function updateIgnoreCondition (data, func) {
    initAjax('/order/rule/audit/nohandlecondition/update.html', 'post', data, function (returnData) {
      if (func) {
        func(returnData)
      }
    }, 'application/x-www-form-urlencoded')
  }

  // ajax请求
  function initAjax (url, method, data, func, contentType) { //初始化ajax请求
    $.ajax({
      type: method,
      url: ctx + url,
      dataType: 'json',
      async: true,
      data: data,
      contentType: contentType || 'application/json',
      success: function (returnData) {
        loading.hide()
        if (returnData.code == "0000") {
          func(returnData)
        } else {
          layer.msg(returnData.msg, { icon: 2 });
        }
      },
      error: function (returnData) {
        layui.admin.load.hide();
        if (XMLHttpRequest.status == 200) {
          layer.msg("请重新登录", { icon: 7 });
        } else {
          layer.msg("服务器错误");
        }
      },
      complete: function (returnData) {
        loading.hide()
      }
    })
  }
})

