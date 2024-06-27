; (function ($, layui, window, document, undefined) {
  layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
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

    //渲染部门销售员店铺三级联动
    form.render('select');
    form.render('radio');
    formSelects.render('ebay_listing_userList');


    laydate.render({
      elem: '#eaby_task_time',
      type: 'datetime',
      inputAuto: true,
      range: true,
      showShortcuts: true,
    });

    laydate.render({
      elem: '#eaby_excute_time',
      type: 'datetime',
      inputAuto: true,
      range: true,
      showShortcuts: true,
    });

    // 监听任务类型的变化
    form.on('select(executeType)', function(obj) {
      if (obj.value === '0') {
        // 手动执行
        $('#ebay_excute_time_content').removeClass('disN')
        $('#ebay_week_time_content').addClass('disN')
      }
      if (obj.value === '1') {
        // 自动执行
        $('#ebay_week_time_content').removeClass('disN')
        $('#ebay_excute_time_content').addClass('disN')
      }
    })


    $("#ebaylisitng_searchBtn").on("click", function() {
      // 获取任务类型
      let taskType = $('select[name=executeType]').val()
      if (taskType == '') {
        return layer.msg('请选择任务类型！')
      }
      ebaylisting_tableRender()
    });

    function ebaylisting_tableRender () {
      layui.admin.load.show();
      var data = serializeObject($('#eaby_listing_form')); // 获取form表单数据
      // console.log('data', data)
      data.ruleName = $('#ruleName').val() || ''
      data.creatorStr = $('#creatorStr').val() || ''
      data.executeDayList = data.executeDayList === '' ? [] : data.executeDayList.split(',')

      if (data.executeType === '1') {
        // 自动执行
        data.excuteTime = ''
      } else {
        // 手动执行
        data.executeDayList = []
      }
      if (data.time) {
        data.ruleStartTime = Date.parse(data.time.split(" - ")[0]);
        data.ruleEndTime = Date.parse(data.time.split(" - ")[1]);
      }

      if (data.excuteTime) {
        data.excecuteStartTime = Date.parse(data.excuteTime.split(" - ")[0]);
        data.excecuteEndTime = Date.parse(data.excuteTime.split(" - ")[1]);
      }
      
      // 规则表
      var tableIns = table.render({
          elem: "#ebaylisting_table",
          method: 'post',
          url: ctx + "/ebay/autoEndListingRule/searchRule",
          contentType: 'application/json;charset=UTF-8',
          where: data,
          cols: [
            [
              { field: "status", title: `<i id="syncIcon" class="layui-icon layui-icon-tips disN"
              onmouseenter="showTip('只有任务处于起始时间和截止时间内才可以操作开关，任务过期或手动执行的任务开关置灰',this)"
              onmouseleave="removeTip(this)"
              style="position:absolute;left: 35px;"></i>状态`, templet: '#ebaylisting_status', width: 150 },
              { field: "ruleName", title: "任务名称" },
              { field: "creator", title: "创建人", width: 150 },
              {
                field: "executeType",
                title: '任务类型',
                templet: '#ebaylisting_executeType'
              },
              { title: '周期起止时间', templet: '#ebaylisting_time' },
              { title: '执行时间', templet: '#ebaylisting_excute_time' },
              { title: '操作', align: 'center', toolbar: '#ebaylisting_optionbtn' }
            ],
          ],
          id: "ebayrules_table_addrules",
          page: true,
          limits: [20, 100, 500],
          limit: 20,
          done: function() {
            $('#syncIcon').show()
          }
      });
    }

    // 新建任务
    $("#ebaylisting_create").on("click", function() {
      layer.open({
        title: `新建任务`,
        type: 1,
        area: ['40%', '750px'],
        btn: ['确定', '取消'],
        content: $('#ebaylisting_create_layer').html(),
        success: function (layero, index) {
            let table = layui.table;
            let el = layero.find('.layui-layer-title')
            el.css({
                'font-weight': 'bold',
                'text-align': 'center'
            })

            initEditTask();
        },
        yes: function(layero, index) {
          let time = $('#eaby_range_time').val()
          let publishTime = $('#eaby_publish_time').val()
          let listingDays = $('#eaby_publish_days').val()
          let executeWeekDay = []
          $('input[name=executeDay]:checked').each(function(i) {
            executeWeekDay[i] = $(this).val()
          })

          let ruleName = $('#taskName').val() || ''
          if (!ruleName) {
            return layer.msg('任务名称必填！')
          }
          let userList = formSelects.value('ebay_listing_userList', 'valStr') || ''
          let store = formSelects.value('ebay_listing_store_sel', 'valStr') || ''
          let site = formSelects.value('ebay_listing_site', 'valStr') || ''
          let listingMethod = $('#ebay_listing_lisitingMethod_sel').val() || ''

          if (!userList && !store && !site && !listingMethod) {
            return layer.msg('筛选方式至少请选择一种！')
          }

          let status = formSelects.value('ebay_listing_productStatus') || [];
          if (status?.length === 0) {
            return layer.msg('请选择商品状态！')
          }

          let salesNum = $('#ebay_listing_soldnumtype_sel').val()
          if (!salesNum) {
            return layer.msg('请选择销量！')
          }

          let taskType = $('input[name=executeType]:checked').val()
          if (!taskType) {
            return layer.msg('请选择任务类型！')
          }

          if ($('input[name=executeType]:checked').val() == '1') {
            let timerange = $('#eaby_range_time').val()
            if (!timerange) {
              return layer.msg('请选择周期起止时间！')
            }
            let timeExe = $('#eaby_excute_create_time').val()
            if (!timeExe) {
              return layer.msg('请选择执行时间！')
            }
            if (executeWeekDay?.length === 0) {
              return layer.msg('请选择循环规则！')
            }
            let listingNumber = $('#eaby_listing_num').val()
            if (!listingNumber) {
              return layer.msg('请填写每天下架数量限制！')
            }
          }
          let ruleStartTime = time ? time.split(' - ')[0] : ''
          let ruleEndTime = time ? time.split(' - ')[1] : ''
          let listingTimeMin = publishTime ? publishTime.split(' - ')[0] : ''
          let listingTimeMax = publishTime ? publishTime.split(' - ')[1] : ''
          let data = {
            ruleName: $('#taskName').val(),
            ruleStartTime: new Date(ruleStartTime).getTime(),
            ruleEndTime: new Date(ruleEndTime).getTime(),
            executeWeekDayStr: executeWeekDay?.join(',') || '',
            executeTime: $('#eaby_excute_create_time').val(),
            salespersonIdStr: formSelects.value('ebay_listing_userList', 'valStr') || '',
            storeAcctIdStr: formSelects.value('ebay_listing_store_sel', 'valStr') || '',
            siteIdStr: formSelects.value('ebay_listing_site', 'valStr') || '',
            listingMethod: $('#ebay_listing_lisitingMethod_sel').val() || '',
            saleStatusList: status?.map(item => item.val) || [],
            listingTimeMin: new Date(listingTimeMin).getTime(),
            listingTimeMax: new Date(listingTimeMax).getTime(),
            listingDays,
            notSoldDays: $('#ebay_listing_soldnumtype_sel').val() || '',
            isMultiSku: $('#ebay_listing_producttype_sel').val() || '',
            tortBanListing: $('#tortBanListing').val() || '',
            prohibitSalesSiteIdStr: formSelects.value('ebayListing_prohibitSalesSiteId', 'valStr') || '',
            executeType: $('input[name=executeType]:checked').val(),
            status: true,
            endNumLimit: $('#eaby_listing_num').val(),
            createTime: '',
            creator: '',
            creatorId: ''
          }

          if ($('input[name=executeType]:checked').val() == '0') {
            // 手动执行任务
            // 获取下架数量
            commonReturnPromise({
              type: 'post',
              url: ctx + `/ebay/autoEndListingRule/checkRuleHitNum`,
              contentType: 'application/json',
              params: JSON.stringify(data)
            }).then((res) => {
              layer.open({
                type: 1,
                title: '信息',
                btn:['确认', '取消'],
                area: ['500px', '200px'],
                anim: 2,
                shadeClose: true, //开启遮罩关闭
                content: `<div style="padding: 20px">${res}</div>`,
                yes: function(index) {
                  handleSave(data)
                  layer.close(index);
                }
              });
            }).catch(err => {
              console.log(err);
              layer.msg(err);
            })

          } else {
            // 定时任务直接保存
            handleSave(data)
          }
        }
      })
    })

    function handleExecute() {
      commonReturnPromise({
        type: 'post',
        url: ctx + `/ebay/autoEndListingRule/executeRule`,
        contentType: 'application/json',
        params: JSON.stringify(data)
      }).then((res) => {
          layer.msg('执行成功', { icon: 1 })
      }).catch(err => {
        console.log(err);
        layer.msg(err);
      })
    }

    function handleSave(data) {
      commonReturnPromise({
        type: 'post',
        url: ctx + `/ebay/autoEndListingRule/saveOrEdit`,
        contentType: 'application/json',
        params: JSON.stringify(data)
      }).then((res) => {
          layer.closeAll()
          layer.msg('保存成功', { icon: 1 })
          ebaylisting_tableRender()
      }).catch(err => {
        console.log(err);
        layer.msg(err);
      })
    }

    var tortPlat = [
      { name: "wish侵权", value: "isWishTort_1" },
      { name: "wish不侵权", value: "isWishTort_0" },
      { name: "ebay侵权", value: "isEbayTort_1" },
      { name: "ebay不侵权", value: "isEbayTort_0" },  
      { name: "smt侵权", value: "isSmtTort_1" },
      { name: "smt不侵权", value: "isSmtTort_0" },
      { name: "joom侵权", value: "isJoomTort_1" },
      { name: "joom不侵权", value: "isJoomTort_0" },
      { name: "amazon侵权", value: "isAmazonTort_1" },
      { name: "amazon不侵权", value: "isAmazonTort_0" },
      { name: "shopee侵权", value: "isShopeeTort_1" },
      { name: "shopee不侵权", value: "isShopeeTort_0" },
      { name: "lazada侵权", value: "isLazadaTort_1" },
      { name: "lazada不侵权", value: "isLazadaTort_0" }
    ]

    table.on('tool(ebaylisting_table)', function(obj) {
      var data = obj.data, //获得当前行数据
      layEvent = obj.event; //获得 lay-event 对应的值

      if (layEvent == "ebaylisting_edit") { // 编辑
        editListing(data, 'edit')
      }
      if (layEvent == "ebaylisting_view") { // 查看
        viewListing(data)
      }
      if (layEvent == "ebaylisting_log") { // 执行日志
        operateLog(data)
      }
    })
    // 获取表单内容函数start
    function renderFormInput(selector, name, value) {
      $('#' + selector + ' [name="' + name + '"]').val(value)
    }
    // 编辑任务
    function editListing(rowData, type='edit') {
      layer.open({
        title: `编辑任务`,
        type: 1,
        area: ['40%', '750px'],
        btn: ['确定', '取消'],
        content: $('#ebaylisting_create_layer').html(),
        success: function (layero, index) {
            let table = layui.table;
            let el = layero.find('.layui-layer-title')
            el.css({
                'font-weight': 'bold',
                'text-align': 'center'
            })
            
            initEditTask();
            // formSelects.render('ebay_listing_store_sel');
            showData(rowData);

        },
        yes: function(layero, index) {
          let time = $('#eaby_range_time').val()
          let publishTime = $('#eaby_publish_time').val()
          let listingDays = $('#eaby_publish_days').val()
          let executeWeekDay = []
          $('input[name=executeDay]:checked').each(function(i) {
            executeWeekDay[i] = $(this).val()
          })

          let ruleName = $('#taskName').val() || ''
          if (!ruleName) {
            return layer.msg('任务名称必填！')
          }
          let userList = formSelects.value('ebay_listing_userList', 'valStr') || ''
          let store = formSelects.value('ebay_listing_store_sel', 'valStr') || ''
          let site = formSelects.value('ebay_listing_site', 'valStr') || ''
          let listingMethod = $('#ebay_listing_lisitingMethod_sel').val() || ''

          if (!userList && !store && !site && !listingMethod) {
            return layer.msg('筛选方式至少请选择一种！')
          }
          let status = formSelects.value('ebay_listing_productStatus') || [];
          if (status?.length === 0) {
            return layer.msg('请选择商品状态！')
          }

          let salesNum = $('#ebay_listing_soldnumtype_sel').val()
          if (!salesNum) {
            return layer.msg('请选择销量！')
          }

          let taskType = $('input[name=executeType]:checked').val()
          if (!taskType) {
            return layer.msg('请选择任务类型！')
          }

          if ($('input[name=executeType]:checked').val() == '1') {
            let timerange = $('#eaby_range_time').val()
            if (!timerange) {
              return layer.msg('请选择周期起止时间！')
            }
            let timeExe = $('#eaby_excute_create_time').val()
            if (!timeExe) {
              return layer.msg('请选择执行时间！')
            }
            if (executeWeekDay?.length === 0) {
              return layer.msg('请选择循环规则！')
            }
            let listingNumber = $('#eaby_listing_num').val()
            
            if (!listingNumber) {
              return layer.msg('请填写每天下架数量限制！')
            }
          }
          let ruleStartTime = time ? time.split(' - ')[0] : ''
          let ruleEndTime = time ? time.split(' - ')[1] : ''
          let listingTimeMin = publishTime ? publishTime.split(' - ')[0] : ''
          let listingTimeMax = publishTime ? publishTime.split(' - ')[1] : ''

          let data = {
            id: rowData.id,
            ruleName: $('#taskName').val(),
            ruleStartTime: new Date(ruleStartTime).getTime(),
            ruleEndTime: new Date(ruleEndTime).getTime(),
            executeWeekDayStr: executeWeekDay?.join(',') || '',
            executeTime: $('#eaby_excute_create_time').val(),
            salespersonIdStr: formSelects.value('ebay_listing_userList', 'valStr') || '',
            storeAcctIdStr: formSelects.value('ebay_listing_store_sel', 'valStr') || '',
            siteIdStr: formSelects.value('ebay_listing_site', 'valStr') || '',
            listingMethod: $('#ebay_listing_lisitingMethod_sel').val() || '',
            saleStatusList: status?.map(item => item.val) || [],
            listingTimeMin: new Date(listingTimeMin).getTime(),
            listingTimeMax: new Date(listingTimeMax).getTime(),
            listingDays,
            notSoldDays: $('#ebay_listing_soldnumtype_sel').val() || '',
            isMultiSku: $('#ebay_listing_producttype_sel').val() || '',
            tortBanListing: $('#tortBanListing').val() || '',
            prohibitSalesSiteIdStr: formSelects.value('ebayListing_prohibitSalesSiteId', 'valStr') || '',
            executeType: $('input[name=executeType]:checked').val(),
            status: rowData.status,
            endNumLimit: $('#eaby_listing_num').val(),
            createTime: rowData.createTime || '',
            creator: rowData.creator || '',
            creatorId: rowData.creatorId || ''
          }

          if ($('input[name=executeType]:checked').val() == '0') {
            // 手动执行任务
            // 获取下架数量
            commonReturnPromise({
              type: 'post',
              url: ctx + `/ebay/autoEndListingRule/checkRuleHitNum`,
              contentType: 'application/json',
              params: JSON.stringify(data)
            }).then((res) => {
              layer.open({
                type: 1,
                title: '信息',
                btn:['确认', '取消'],
                area: ['500px', '200px'],
                anim: 2,
                shadeClose: true, //开启遮罩关闭
                content: `<div style="padding: 20px">${res}</div>`,
                yes: function(index) {
                  handleSave(data)
                  layer.close(index);
                }
              });
            }).catch(err => {
              console.log(err);
              layer.msg(err);
            })

          } else {
            // 定时任务直接保存
            handleSave(data)
          }
        }
      })
    }

    // 查看任务
    function viewListing(rowData, type='edit') {
      layer.open({
        title: '查看任务',
        type: 1,
        area: ['40%', '750px'],
        content: $('#ebaylisting_view_layer').html(),
        success: function (layero, index) {
            let table = layui.table;
            let el = layero.find('.layui-layer-title')
            el.css({
                'font-weight': 'bold',
                'text-align': 'center'
            })
            
            initEditTask();

            if (rowData.ruleStartTime) {
              rowData.rulesTime = `${rowData.ruleStartTime} - ${rowData.ruleEndTime}`
            }
            if (rowData.listingTimeMin) {
              rowData.listingTime = Format(rowData.listingTimeMin, 'yyyy-MM-dd hh:mm:ss') + ' - ' + Format(rowData.listingTimeMax, 'yyyy-MM-dd hh:mm:ss')
            }

            // showData(rowData)
            laytpl($("#ebaylisting_view_content_layer").html()).render(rowData, function(html){
              $('#eaby_listing_create_form').html(html)
              if (rowData.executeType == '1') {
                // 定时任务
                $('#rangeTime').removeClass('disN')
                $('#dayRules').removeClass('disN')
                $('#excuteTime').removeClass('disN')
                $('#listingNum').removeClass('disN')
              }
              if (rowData.executeType == '0') {
                // 手动执行
                $('#rangeTime').addClass('disN')
                $('#dayRules').addClass('disN')
                $('#excuteTime').addClass('disN')
                $('#listingNum').addClass('disN')
              }
              // 回显循环规则
              rowData?.executeWeekDayList?.forEach((item, index) => {
                $(`input[name=executeDay][value=${item}]`).attr('checked', true)
              })
              $(`input[name=executeType][value=${rowData.executeType}]`).attr('checked', true)
          });
            
        },
        yes: function(layero, index) {
        }
      })
    }

    function showData(rowData) {
      // 数据回显
      $('#taskName').val(rowData.ruleName || '')
      $('#eaby_listing_num').val(rowData.endNumLimit || '')
      renderFormInput('eaby_listing_create_form', 'listingMethod', rowData.listingMethod)
      renderFormInput('eaby_listing_create_form', 'isSale', rowData.isSale)
      renderFormInput('eaby_listing_create_form', 'notSoldDays', rowData.notSoldDays)
      renderFormInput('eaby_listing_create_form', 'isMultiSku', String(rowData.isMultiSku))
      renderFormInput('eaby_listing_create_form', 'tortBanListing', rowData.tortBanListing)
      renderFormInput('eaby_listing_create_form', 'listingDays', rowData.listingDays)

      setTimeout(() => {
        rowData.saleStatusList = rowData.saleStatusList.map(item => item.toString())
        layui.formSelects.value('ebay_listing_store_sel', rowData.storeAcctIdStr?.split(','))
        layui.formSelects.value('ebay_listing_userList', rowData.salespersonIdStr?.split(',')); 
        layui.formSelects.value('ebay_listing_site', rowData.siteIdStr?.split(',')); 
        layui.formSelects.value('ebayListing_prohibitSalesSiteId', rowData.prohibitSalesSiteIdStr?.split(',')); 
        layui.formSelects.value('ebay_listing_productStatus', rowData.saleStatusList || []);  
      }, 500)

      $(`input[name=executeType][value=${rowData.executeType}]`).attr('checked', true)

      if (rowData.executeType == '1') {
        // 定时任务
        $('#rangeTime').removeClass('disN')
        $('#dayRules').removeClass('disN')
        $('#excuteTime').removeClass('disN')
        $('#listingNum').removeClass('disN')
      }
      if (rowData.executeType == '0') {
        // 手动执行
        $('#rangeTime').addClass('disN')
        $('#dayRules').addClass('disN')
        $('#excuteTime').addClass('disN')
        $('#listingNum').addClass('disN')
      }

      // 回显循环规则
      rowData?.executeWeekDayList?.forEach((item, index) => {
        $(`input[name=executeDay][value=${item}]`).attr('checked', true)
      })

      let rulesTime = ''
      let publish = ''
      if (rowData.ruleStartTime) {
        rulesTime = `${rowData.ruleStartTime} - ${rowData.ruleEndTime}`
      }
      if (rowData.listingTimeMin) {
        publish = Format(rowData.listingTimeMin, 'yyyy-MM-dd hh:mm:ss') + ' - ' + Format(rowData.listingTimeMax, 'yyyy-MM-dd hh:mm:ss')
      }
     
      laydate.render({
        elem: '#eaby_publish_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
        value: publish || ''
      });
      laydate.render({
        elem: '#eaby_range_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
        value: rulesTime || ''
      });

      laydate.render({
        elem: '#eaby_excute_create_time',
        type: 'time',
        value: rowData.executeTime || ''
      });
      // form.render()
      // formSelects.render()
      formSelects.render('select')
      // 根据销售员重新请求店铺
      setTimeout(() => {
        getStore(rowData);   
      }, 100)

      layui.formSelects.on('ebay_listing_userList', function(obj) {
        getStore(rowData);
      })
      form.render();
    }

    function getStore(rowData) {
      commonReturnPromise({
        url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
        type: 'post',
        params: {
            roleNames: 'ebay专员',
            orgId: '',
            salePersonId: rowData.salespersonIdStr || '',
            platCode: 'ebay',
        }
      }).then(res => {
        let arr = []
        for (var i = 0; i < res?.length; i++) {
          var a = { name: res[i].storeAcct, value: res[i].id }
          arr.push(a)
        }
        //渲染下拉框
        formSelects.data('ebay_listing_store_sel', 'local', {
          arr: arr || []
        });
      }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))  
    }

    function  operateLog (rowData) {
      layer.open({
        title: '执行日志',
        type: 1,
        area: ['60%', '750px'],
        btn: ['关闭'],
        content: $('#ebaylisting_log_layer').html(),
        success: function (layero, index) {
          // 执行日志
          let data = {
            ruleId: rowData.id
          }
          ruleExportd = rowData.id
          var tableIns = table.render({
            elem: "#ebaylisting_log_table",
            method: 'get',
            url: ctx + "/ebay/autoEndListingRule/searchRuleLog",
            // contentType: 'application/json;charset=UTF-8',
            where: data,
            cols: [
                [
                  { field: "creator", title: "创建人", width: 100 },
                  { field: "ruleName", title: "任务名称", width: 150 },
                  { field: "ruleDetail", title: "下架条件", templet: '#listing_content' },
                  { field: "createTime", title: '执行时间', width: 150, templet: '#ebaylisting_log_time' },
                  { field: "successCount", title: '下架成功数量', width: 100 },
                  { field: "failCount", title: '下架失败数量', width: 100 },
                  { title: '操作', align: 'center', toolbar: '#ebaylisting_log_optionbtn', width: 100 }
                ],
            ],
            page: true,
            limits: [100, 200, 500],
            limit: 100
          });
        }
      })
    }

    table.on('tool(ebaylisting_log_table)', function(obj) {
      var params = obj.data, //获得当前行数据
      layEvent = obj.event; //获得 lay-event 对应的值

      if (layEvent == "ebaylisting_export") { // 导出
        let data = {
          batchNo: params.batchNo
        }
        submitForm(data, `${ctx}/ebay/autoEndListingRule/exportLogByBatchNo`)
      }
    })

    // 打开任务弹窗初始化
    function initEditTask () {
      formSelects.render();
      //渲染部门销售员店铺三级联动
      render_hp_orgs_users("#eaby_listing_create_form"); 

      form.render('select'); 
      form.render()
      laydate.render({
        elem: '#eaby_publish_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
      });
      laydate.render({
        elem: '#eaby_range_time',
        type: 'datetime',
        inputAuto: true,
        range: true,
        showShortcuts: true,
      });
      laydate.render({
        elem: '#eaby_excute_create_time',
        type: 'time',
      });
      // 初始化 禁售平台
      commonReturnPromise({
        url: `/lms/enum/getSiteEnum.html?platCode=ebay`,
        type: "post",
        contentType: "application/json;charset=UTF-8",
        }).then(res => {
          formSelects.data("ebayListing_prohibitSalesSiteId", "local", {
              arr: res.map(item => ({ ...item, value: item.code })),
          })
      })
      ebaylisting_initEbaySite();
    }

    form.on('radio(type_chk)', function (obj) {
      if (obj.value == '1') {
        // 定时任务
        $('#rangeTime').removeClass('disN')
        $('#dayRules').removeClass('disN')
        $('#excuteTime').removeClass('disN')
        $('#listingNum').removeClass('disN')
      }
      if (obj.value == '0') {
        // 手动执行
        $('#rangeTime').addClass('disN')
        $('#dayRules').addClass('disN')
        $('#excuteTime').addClass('disN')
        $('#listingNum').addClass('disN')
      }
    })

   

    form.on('switch(status)', function(obj) {
      let id = obj.elem.attributes['idValue'].nodeValue
      let checked = obj.elem.checked
      let data = {
        id,
        status: checked
      }
      commonReturnPromise({
        type: 'post',
        url: ctx + `/ebay/autoEndListingRule/enableOrDisableRule`,
        contentType: 'application/json',
        params: JSON.stringify(data)
      }).then(() => {
          layer.msg('操作成功', { icon: 1 })
      }).catch(err => {
        console.log(err);
        layer.msg('操作失败', { icon: 1 })
      })
    })


    /**
     * 初始化ebay站点
     */
    function ebaylisting_initEbaySite() {
      var Sites = [];
      $.ajax({
          type: "post",
          url: ctx + "/onlineProductEbay/getAllEbaySiteAndLogisAttr",
          dataType: "json",
          success: function(returnData) {
              if (returnData.code == "0000") {
                  var str = "<option value=''></option>";
                  $(returnData.data.ebaySiteList).each(function() {
                      Sites.push({ name: this.siteName, value: this.siteId })
                  });
                  formSelects.data('ebay_listing_site', 'local', { arr: Sites })
                  form.render();
              } else {
                  layer.msg(returnData.msg);
              }
          }
      })
    };

  });

})(jQuery, layui, window, document);

var ruleExportd = ''
function exportAll() {
  console.log('全部导出', ruleExportd)
  let data = {
    ruleId: ruleExportd
  }
  submitForm(data, `${ctx}/ebay/autoEndListingRule/exportLogByBatchNo`)
}

function showDetail(dom) {
  let contentshow = $(dom).attr('data-text');
  contentshow = contentshow.replace('<\/div>', '')
  layui.layer.tips(`<div style="color:#000;">${contentshow}</div>`, $(dom), {
    tips: [1, '#fff'],
    area: ['30%', 'auto'],
    time: 0,
});
}

function hideDetail() {
  layui.layer.closeAll("tips");
}