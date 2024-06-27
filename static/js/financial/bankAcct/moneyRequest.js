/**
 * time: 2018/01/02
 */
var queryPage_moneyRequest, queryPage2_moneyRequest, active_moneyRequest

layui.use(['admin', 'form', 'table', 'layer', 'laytpl', 'laydate', 'formSelects', 'element'], function () {
  var admin = layui.admin,
    form = layui.form,
    table = layui.table,
    layer = layui.layer,
    laytpl = layui.laytpl,
    laydate = layui.laydate,
    formSelects = layui.formSelects,
    $ = layui.$
  form.render('select')
  form.render('radio')
  form.render('checkbox')
  //初始化2个日期框
  laydate.render({
    elem: '#beginDate_moneyRequest'
    , type: 'datetime'
  })
  laydate.render({
    elem: '#endDate_moneyRequest'
    , type: 'datetime'
    ,ready: function () {
      $(".layui-laydate-footer [lay-type='datetime'].laydate-btns-time").click();
      $(".laydate-main-list-0 .layui-laydate-content li ol li:last-child").click();
      $(".layui-laydate-footer [lay-type='date'].laydate-btns-time").click();
     }
  })
  formSelects.render('usageTypeList_purchaseOrder')
  // 渲染成多选
  formSelects.render('moneyRequest_select_company')
  // 重置按钮
  $('#resetBtn_moneyRequest').click(function () {
    $('form[name=searchForm_moneyRequest] [name]:not(.hiddenContent)').val('')
    formSelects.value('usageTypeList_purchaseOrder', [''])
    // 置空多选公司
    formSelects.value('moneyRequest_select_company', [''])
    form.render('select')
  })

  function moneyRequest_initBankAcctByManagerId (managerId) {
    let emptyOption = '<option value=""></option>'
    $('#addmoneyRequestForm [name=bankAcctId]').html(emptyOption)
    let options = $('#moneyRequest_bankAcctBox option[data-managerId=' + managerId + ']')
    // console.log(options)
    $('#addmoneyRequestForm [name=bankAcctId]').append(options)
  }

  queryPage_moneyRequest = function (obj) {
    var data = {
      orderBy: 'id desc',
      status: true
    }
    if (obj) {
      $.extend(data, obj)
    }
    table.render({
      elem: '#moneyRequestTab',
      method: 'post',
      url: ctx + '/msgMoneyRequest/queryPage.html',
      where: data,
      cols: [
        [
          //标题栏
          { checkbox: true, width: 30 },
          { field: 'rebackImgUrl', title: '图片', templet: '#rebackImg_moneyRquest', width: 70 },
          { field: 'company', title: '公司', width: 70 },
          {
            field: 'orgNameSus',
            title: '部门',
            templet: `<div><div title="{{d.orgFullName}}">{{d.orgName || ""}}<div></div>`,
            width: 70
          },
          { field: 'usageTypeName', title: '用途', width: 70 },
          { field: 'orderNo', title: '单号', width: 110 },
          { field: 'creator', title: '申请人', width: 80 },
          { field: 'receiveAcctName', title: '收款账户名', templet: '#msgMoneyRequest_receiveAcctName_tpl' },
          { field: 'receiveAcct', title: '收款账户号' },
          { field: 'amount', title: '金额', templet: '<div>{{d.currency}}:{{d.amount}}</div>', width: 120 },
          { field: 'requireUser', title: '请求付款人', width: 100 },
          { field: 'bankAcctName', title: '实际付款人', width: 100 },
          { field: 'remark', title: '备注', width: 120, templet: '#remark_moneyRequest' },
          { field: 'firstCheckUser', title: '初审审核', width: 100 },
          // {field: "firstCheckRemark", title: "初审备注", width: 120, templet: '#firstCheckRemark_moneyRequest'},
          { field: 'checkUser', title: '出纳审核', width: 100 },
          { field: 'checkRemark', title: '审核备注', width: 120, templet: '#checkRemark_moneyRequest' },
          { field: 'checkStatus', title: '状态', templet: '#moneyRequestStatus', width: 100 },
          {
            field: 'creatTime',
            title: '申请时间',
            width: 80,
            templet: '<div>{{Format(new Date(d.createTime), "yyyy-MM-dd hh:mm:ss")}}</div>'
          },
          // {field: "extraFileUrl", title: "附件",width: 60, templet: '#extraFileDown_moneyRequest'},
          //绑定工具条
          { title: '操作', align: 'center', toolbar: '#moneyRequest_bar' }
        ],
      ],
      id: 'moneyRequestReloadTable',
      page: true,
      limits: [100, 500, 1000],
      limit: 100
    })
  }

  // 表格数据重载
  active_moneyRequest = {
    reload: function (data) {
      //执行重载
      table.reload('moneyRequestReloadTable', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: data
      })
    }
  }


  // 标签搜索
  queryPage2_moneyRequest = function (checkStatus) {
    // 设置 checkStatus  和 payStatus 的值
    $('form[name=searchForm_moneyRequest] [name=checkStatus]').val(checkStatus)
    searchFormoneyRequest(true)
  }

  //展示已知数据
  searchFormoneyRequest()

  // 统计待审核数量
  function countmoneyRequest (data) {
    // console.log(data)
    var ajax = new Ajax()
    ajax.post({
      url: ctx + '/msgMoneyRequest/count.html',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (res) {
        // console.log(JSON.stringify(res))
        if (res.code == '0000') {
          var NumList = [0, 0, 0, 0, 0, 0, 0]
          for (var i in res.data) {
            NumList[res.data[i].check_status] = res.data[i].num
          }
          $('#firstNum_moneyRequest').text(NumList[5])
          $('#firstFailNum_moneyRequest').text(NumList[6])
          $('#waitNum_moneyRequest').text(NumList[0])
          $('#succNum_moneyRequest').text(NumList[1])
          $('#failNum_moneyRequest').text(NumList[2])
          $('#rebackNum_moneyRequest').text(NumList[3])
          $('#confirmNum__moneyRequest').text(NumList[4])

          var total = 0
          for (var j in NumList) {
            total += NumList[j]
          }
          $('#totalNum_moneyRequest').text(total)

        }
      }
    })
  }

  // 搜索按钮
  $('#searchPaypalBtn_moneyRequest').click(function () {
    searchFormoneyRequest(true)
  })

  function searchFormoneyRequest (ifReload) {
    var data = {
      orderNo: '',
      creator: '',
      requireUser: '',
      checkUser: '',
      amount: '',
      remark: '',
      checkRemark: '',
      // 现在是多选公司列表
      companyList: $('form[name=searchForm_moneyRequest] [name=companyList]').val(),
      receiveAcctId: $('form[name=searchForm_moneyRequest] [name=receiveAcct]').val(),
      // bankAcctId : $('form[name=searchForm_moneyRequest] [name=bankAcct]').val(),
      acctName: $('form[name=searchForm_moneyRequest] [name=acctName]').val(),
      payType: $('form[name=searchForm_moneyRequest] [name=payType]').val(),
      checkStatus: $('form[name=searchForm_moneyRequest] [name=checkStatus]').val(),
      beginDate: $('form[name=searchForm_moneyRequest] #beginDate_moneyRequest').val(),
      endDate: $('form[name=searchForm_moneyRequest] #endDate_moneyRequest').val(),
      usageTypeList: $('form[name=searchForm_moneyRequest] [name=usageTypeList]').val(),
      acctCheckStatus: $('form[name=searchForm_moneyRequest] [name=acctCheckStatus]').val(),
      payPlatCode: $('form[name=searchForm_moneyRequest] [name=payPlatCode]').val(),
      acctType: $('form[name=searchForm_moneyRequest] [name=acctType]').val(),
    }
    var searchType = $('form[name=searchForm_moneyRequest] [name=searchType]').val()
    if (searchType) {
      data[searchType] = $('form[name=searchForm_moneyRequest] [name=searchData]').val()
    }
    // console.log('搜索条件: ', JSON.stringify(data))
    if (ifReload) {
      active_moneyRequest.reload(data)
    } else {
      queryPage_moneyRequest(data)
    }
    checkNull(data)
    countmoneyRequest(data)
  }

  // 初始化 新建请款单弹窗
  function initPOP_add_money_request_pop (edit, flag,backtodo) {
      if (flag) {
          $('#money_request_bankCardNo').attr('notNull', '')
      }
    // 初始化必填项
    initNotNull()

    // 绑定选择事件--赋值收款账号
    form.on('select(add_money_request_receiveAcctId)', function (data) {
      var self = $('#addmoneyRequestForm [name=receiveAcctId] option:selected')
      $('#addmoneyRequestForm [name=receiveAcct]').val(self.attr('data-acct'))
      $('#addmoneyRequestForm [name=receiveAcctName]').val(self.attr('data-acctName'))
    })
    // 绑定选择事件--组织渲染
    form.on('select(moneyRequest_orgId_filter)', function (data) {
      form.render('select')
    })
    // 初始化请求付款人
    // $('#addmoneyRequestForm [name=requireUserId]').html($('form[name=searchForm_moneyRequest] #requireUserDiv').html())
      if (edit) {
          refreshRequireUser('#addmoneyRequestForm [name=requireUserId]',false,backtodo)
      }

    // 初始化用途
    $('#addmoneyRequestForm [name=usageTypeId]').html($('form[name=searchForm_moneyRequest] #usageTypeDiv').html())
    // 绑定选择事件--赋值
    form.on('select(add_money_request_usageTypeId)', function (data) {
      var self = $('#addmoneyRequestForm [name=usageTypeId] option:selected')
      $('#addmoneyRequestForm [name=usageType]').val(self.text())
    })
  }

  // 数据复现--修改-审核-回填
  function showData_add_money_request_pop (data) {
    $('#addmoneyRequestForm [name=company]').val(data.company ? data.company : '')
    $('#addmoneyRequestForm [name=payType]').val(data.payType)
    $('#addmoneyRequestForm [name=receiveAcctName]').val(data.receiveAcctName)
    $('#addmoneyRequestForm [name=receiveAcct]').val(data.receiveAcct)
    $('#addmoneyRequestForm [name=receiveAcctId]').val(data.receiveAcctId)
    $('#addmoneyRequestForm [name=currency]').val(data.currency)
    $('#addmoneyRequestForm [name=amount]').val(data.amount)
    $('#addmoneyRequestForm [name=requireUser]').val(data.requireUser)
    $('#addmoneyRequestForm [name=requireUserId]').val(data.requireUserId)
    $('#addmoneyRequestForm [name=usageType]').val(data.usageTypeName)
    $('#addmoneyRequestForm [name=usageTypeId]').val(data.usageTypeName)
    $('#addmoneyRequestForm [name=bankCardNo]').val(data.bankCardNo)
    $('#addmoneyRequestForm [name=bankAcctId]').val(data.bankAcctId)
    $('#addmoneyRequestForm [name=bankAcctName]').val(data.bankAcctName)
    $('#addmoneyRequestForm [name=remark]').val(data.remark)
    $('#addmoneyRequestForm [name=orgId]').val(data.orgId)
    // 复现审核表单数据
    var checkStatus = data.checkStatus
    //判断状态的数值展示不同的审核样子
    if (checkStatus > 4) {
      $('#checkmoneyRequestForm [name=checkStatus]').append('<option value=\'7\'>初审通过</option>')
      $('#checkmoneyRequestForm [name=checkStatus]').append('<option value=\'6\'>初审不通过</option>')
    } else {
      $('#checkmoneyRequestForm [name=checkStatus]').append('<option value=\'1\'>出纳审核通过</option>')
      $('#checkmoneyRequestForm [name=checkStatus]').append('<option value=\'2\'>出纳审核不通过</option>')
    }

    $('#checkmoneyRequestForm [name=checkRemark]').val(data.checkRemark ? data.checkRemark : '')
  }

  // 新建请款单
  $('#addmoneyRequest').click(function () {
    var index = layer.open({
      type: 1,
      title: '新建请款单',
      area: ['40%', '80%'],
      shadeClose: false,
      content: $('#add_money_request_pop').html(),
      btn: ['创建', '关闭'],
      success: function (layero, index) {
        initPOP_add_money_request_pop(true)
        //初始化组织部门
        moneyRequest_orgSelect()
        //初始化公司
        init_money_request_company_select()
        form.render('select')
      },
      yes: function () {
        // console.log("asdasd")
        var data = {
          company: $('#addmoneyRequestForm [name=company]').val().trim(),
          usageType: $('#addmoneyRequestForm [name=usageTypeId] option:selected').attr('data-usageCode').trim(),
          payType: $('#addmoneyRequestForm [name=payType]').val().trim(),
          receiveAcctName: $('#addmoneyRequestForm [name=receiveAcctName]').val().trim(),
          receiveAcct: $('#addmoneyRequestForm [name=receiveAcct]').val().trim(),
          receiveAcctId: $('#addmoneyRequestForm [name=receiveAcctId]').val().trim(),
          currency: $('#addmoneyRequestForm [name=currency]').val().trim(),
          amount: $('#addmoneyRequestForm [name=amount]').val().trim(),
          requireUser: $('#addmoneyRequestForm [name=requireUserId] option:selected').text().trim(),
          requireUserId: $('#addmoneyRequestForm [name=requireUserId]').val().trim(),
          // bankAcctId: $('#addmoneyRequestForm [name=bankAcctId]').val().trim(),
          remark: $('#addmoneyRequestForm [name=remark]').val().trim(),
          orgId: $.trim($('#addmoneyRequestForm [name=orgId] option:selected').val())
        }
        // 校验必填项
        if (!checkNotNull('#addmoneyRequestForm', layer)) {
          return
        }
        var amount = parseFloat(data.amount)
        if (amount <= 0) {
          layer.msg('请输入正数金额')
          return
        }
        var files = $('#addmoneyRequestForm  input[name=extraFile]')[0].files

        var formData = new FormData()
        if (files.length > 0) {
          formData.append('extraFile', files[0])
        }
        for (var key in data) {
          formData.append(key, data[key])
        }
        loading.show()
        window.setTimeout(function () {
          $.ajax({
            url: ctx + '/msgMoneyRequest/addOne.html',
            type: 'POST',
            async: false,
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            success: function (data) {
              loading.hide()
              if (data.code == '0000') {
                searchFormoneyRequest(true)
                layer.closeAll()
                layer.msg('操作成功')
              } else {
                layer.msg(data.msg)
              }
            }
          })
        }, 300)

      }
    })
  })

  /**
   * 默认初始化当前操作人的公司
   */
  function init_money_request_company_select () {
    $.ajax({
      type: 'post',
      url: ctx + '/msgMoneyRequest/getCurrentUserCompanyName.html',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          $('#addmoneyRequestForm [name=company] option').each(function () {
            //此处使用name的原因是因为新增的时候使用的是name;
            // var code = $(this).val();
            var name = $(this).text()
            if (returnData.data.companyName) {
              if (name == returnData.data.companyName) {
                $(this).attr('selected', 'selected')
                return
              }
            }
          })
          form.render('select', 'addmoneyRequestForm')
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
  }

  //编辑付款账户点击事件
  $('#moneyRequest_modify_bankAcct').on('click', () => {
    layer.open({
      type: 1,
      title: '编辑付款账户',
      area: ['40%', '70%'],
      shadeClose: false,
      content: $('#moneyRequest_modify_bankAcct_pop').html(),
      success: function (layero, index) {
        // 付款账户表单列表渲染
        let loadMoneyRequestTable = () => {
          table.render({
            elem: '#moneyRequest_modify_bankAcct_pop_tab',
            url: ctx + '/msgBankAcct/listByUserId.html',
            // toolbar: '#toolbarDemo',
            cols: [[ //待派单
              { title: '账号名称(点击可编辑)', field: 'acctName', edit: 'text', style: 'background-color: #F2F2F2;' },
              { title: '卡号(点击可编辑)', field: 'cardNo', edit: 'text', style: 'background-color: #F2F2F2;' },
              // { title: "发卡行", field: "bankName" },
              // { title: "发卡行编码", field: "bankCode" },
              // { title: '币种(点击可编辑)', field: 'currency', edit: 'text', style: 'background-color: #F2F2F2;' },
              {
                title: '操作',
                toolbar: '#moneyRequest_modify_bankAcct_bar',
                width: 100,
                style: 'background-color: #F2F2F2;'
              }
            ]],
            page: false,
            skin: 'line'
          })
        }
        loadMoneyRequestTable()
        // 新增付款账户点击事件
        $('#moneyRequest_add_bankAcct').on('click', () => {
          let addLayerIndex = layer.open({
            type: 1,
            title: '新增付款账户',
            area: ['30%', '30%'],
            shadeClose: false,
            content: $('#moneyRequest_add_bankAcct_pop').html(),
            btn: ['保存', '关闭'],
            success: function (layero, index) {
              // 初始化必填项
              initNotNull()
              form.val('moneyRequest_add_bankAcct_form', {
                'acctName': '',
                'cardNo': ''
              })
            },
            yes: function () {
              // 校验必填项
              if (!checkNotNull('#moneyRequest_add_bankAcct_form', layer)) {
                return
              }
              window.setTimeout(function () {
                let form = {
                  'acctName': $('#moneyRequest_add_bankAcct_form input[name=acctName]').val(),
                  'cardNo': $('#moneyRequest_add_bankAcct_form input[name=cardNo]').val()
                }
                request.sendAjax('/msgBankAcct/saveOrUpdate.html', JSON.stringify(form), res => {
                  layer.close(addLayerIndex)
                  // 重载数据
                  loadMoneyRequestTable()
                  layer.msg('操作成功')
                }, 'POST')
              }, 300)
            }
          })
        })
        table.on('tool(moneyRequest_modify_bankAcct_pop_tab)', obj => {
          var data = obj.data, //获得当前行数据
            layEvent = obj.event //获得 lay-event 对应的值
          switch (layEvent) {
            case 'update':
              if (data.acctName === '' || data.acctName === undefined) {
                layer.msg('账号名称不能为空')
                loadMoneyRequestTable()
                return
              }
              if (data.cardNo === '' || data.cardNo === undefined) {
                layer.msg('卡号不能为空')
                loadMoneyRequestTable()
                return
              }
              // 修改付款账户
              request.sendAjax('/msgBankAcct/saveOrUpdate.html', JSON.stringify(data), res => {
                // 重新加载数据
                loadMoneyRequestTable()
                layer.msg('修改成功')
              }, 'POST')
              break
            case 'delete':
              // 删除付款账户
              let index = layer.confirm('确认删除该付款账户吗？', {
                btn: ['确认', '取消']
              }, function () {
                let jsonData = {
                  id: data.id
                }
                request.sendAjax('/msgBankAcct/delete.html', JSON.stringify(jsonData), res => {
                  // 重新加载数据
                  loadMoneyRequestTable()
                  layer.msg('操作成功')
                }, 'POST')
              }, function () {
                layer.close(index)
              })
              break
          }
        })
      }
    })
  })


  //工具条的监听事件,table.on(tool(表格的lay-filter的值))
  table.on('tool(moneyRequestTab)', function (obj) {
    var data = obj.data, //获得当前行数据
      layEvent = obj.event //获得 lay-event 对应的值
    switch (layEvent) {
      case 'update':
        layer.open({
          type: 1,
          title: '修改请款单',
          area: ['40%', '80%'],
          shadeClose: false,
          content: $('#add_money_request_pop').html(),
          btn: ['保存', '关闭'],
          success: function (layero, index) {
            let backtodo = function () {
                // 复现数据
                showData_add_money_request_pop(data)
            }
            // 初始化面板
            initPOP_add_money_request_pop(true,false,backtodo)
            //初始化组织部门
            moneyRequest_orgSelect(data.orgId)
            form.render('select','addmoneyRequestForm')
          },
          yes: function () {
            var Adata = {
              id: data.id,
              company: $('#addmoneyRequestForm [name=company]').val().trim(),
              usageType: $('#addmoneyRequestForm [name=usageTypeId] option:selected').attr('data-usageCode').trim(),
              payType: $('#addmoneyRequestForm [name=payType]').val().trim(),
              receiveAcctName: $('#addmoneyRequestForm [name=receiveAcctName]').val().trim(),
              receiveAcct: $('#addmoneyRequestForm [name=receiveAcct]').val().trim(),
              receiveAcctId: $('#addmoneyRequestForm [name=receiveAcctId]').val().trim(),
              currency: $('#addmoneyRequestForm [name=currency]').val().trim(),
              amount: $('#addmoneyRequestForm [name=amount]').val().trim(),
              requireUser: $('#addmoneyRequestForm [name=requireUserId] option:selected').text().trim(),
              requireUserId: $('#addmoneyRequestForm [name=requireUserId]').val().trim(),
              // bankCardNo: $('#addmoneyRequestForm [name=bankCardNo]').val().trim(),
              // bankAcctId: $('#addmoneyRequestForm [name=bankAcctId]').val().trim(),
              // bankAcctName: $('#addmoneyRequestForm [name=bankAcctName]').val().trim(),
              remark: $('#addmoneyRequestForm [name=remark]').val().trim(),
              orgId: $.trim($('#addmoneyRequestForm [name=orgId] option:selected').val())
            }
            console.log(Adata)
            // 校验必填项
            if (!checkNotNull('#addmoneyRequestForm', layer)) {
              return
            }
            var amount = parseFloat(Adata.amount)
            if (amount <= 0) {
              layer.msg('请输入正数金额')
              return
            }
            var files = $('#addmoneyRequestForm  input[name=extraFile]')[0].files

            var formData = new FormData()
            if (files.length > 0) {
              formData.append('extraFile', files[0])
            }
            // console.log(files)
            for (var key in Adata) {
              formData.append(key, Adata[key])
            }
            loading.show()
            window.setTimeout(function () {
              $.ajax({
                url: ctx + '/msgMoneyRequest/update.html',
                type: 'POST',
                async: false,
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                success: function (data) {
                  loading.hide()
                  if (data.code == '0000') {
                    searchFormoneyRequest(true)
                    layer.closeAll()
                    layer.msg('操作成功')
                  } else {
                    layer.msg(data.msg)
                  }
                }
              })
            }, 300)
          }
        })
        break
      case 'delete':
        layer.confirm('确认删除该请款单吗？', {
          btn: ['确认', '取消']
        }, function () {
          var Adata = {
            id: data.id
          }
          var ajax = new Ajax(true)
          loading.show()
          ajax.post({
            url: ctx + '/msgMoneyRequest/delete.html',
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
              loading.hide()
              if (data.code == '0000') {
                layer.msg('操作成功')
                searchFormoneyRequest(true)
                layer.closeAll()
              }
            }
          })
        }, function () {
          layer.closeAll()
        })
        break
      case 'check':
        layer.open({
          type: 1,
          title: '审核打款单',
          area: ['40%', '80%'],
          shadeClose: false,
          content: $('#add_money_request_pop').html(),
          btn: ['保存', '关闭'],
          success: function (layero, index) {
            // 初始化面板
            initPOP_add_money_request_pop(false)
              // 复现数据
              showData_add_money_request_pop(data)
            //初始化组织部门
            moneyRequest_orgSelect_no_render(data.orgId).then(function () {
              $('#addmoneyRequestForm #orgizatId').val($('#addmoneyRequestForm [name=orgId] option:selected').text())
            })
            // 隐藏选择框  展示input
            $('#addmoneyRequestForm [readInp]').css('display', 'block')
            $('#addmoneyRequestForm #company').val($('#addmoneyRequestForm [name=company] option:selected').text())
            $('#addmoneyRequestForm #payType').val($('#addmoneyRequestForm [name=payType] option:selected').text())
            $('#addmoneyRequestForm #usageType').val($('#addmoneyRequestForm [name=usageTypeId] option:selected').text())
            $('#addmoneyRequestForm #receiveAcctName').val($('#addmoneyRequestForm [name=receiveAcctId] option:selected').text())
            $('#addmoneyRequestForm #currency').val($('#addmoneyRequestForm [name=currency] option:selected').text())
              $('#addmoneyRequestForm #requireUser').val($('#addmoneyRequestForm [name=requireUser]').val())
            $('#addmoneyRequestForm #usageType').val($('#addmoneyRequestForm [name=usageTypeId] option:selected').text())
            // 表单设置disabled
            $('#addmoneyRequestForm input,#addmoneyRequestForm select,#addmoneyRequestForm textarea').attr('disabled', 'disabled').css('background-color', 'rgba(0,0,0,0.1)')

            // 附件按钮展现及 文件框隐藏
            $('#addmoneyRequestForm [name=extraFile]').css('display', 'none')
            if (data.extraFileUrl) {
              $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').css('display', 'block')
              if (data.extraFileName) {
                $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').text(data.extraFileName)
              }
              $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').click(function () {
                downLoadExtraFile(data.extraFileName, data.extraFileUrl)
              })
            }
            // 复现数据不可编辑
            $('#addmoneyRequestForm [name]').attr('disabled', 'true')

            // 展现审核表单
            $('#checkmoneyRequestForm').removeAttr('hidden')
            form.render('select', 'checkmoneyRequestForm')
          },
          yes: function () {
            // console.log($('#checkmoneyRequestForm [name=checkStatus]'))

            // 校验必填项
            if (!checkNotNull('#checkmoneyRequestForm', layer)) {
              return
            }

            var Adata = {
              id: data.id,
              checkStatus: $('#checkmoneyRequestForm [name=checkStatus]').val().trim(),
              checkRemark: $('#checkmoneyRequestForm [name=checkRemark]').val().trim(),
            }

            var ajax = new Ajax()
            loading.show()
            ajax.post({
              url: ctx + '/msgMoneyRequest/check.html',
              data: JSON.stringify(Adata),
              contentType: 'application/json',
              success: function (data) {
                loading.hide()
                if (data.code == '0000') {
                  layer.msg('操作成功')
                  searchFormoneyRequest(true)
                  layer.closeAll()
                }
              }
            })
          }
        })
        break
      case 'rebackInp':
        layer.open({
          type: 1,
          title: '回填请款单',
          area: ['40%', '80%'],
          shadeClose: false,
          content: $('#add_money_request_pop').html(),
          btn: ['保存', '关闭'],
          success: function (layero, index) {
            // 初始化面板
            initPOP_add_money_request_pop(false,true)
              // 初始化可选实际付款账户选项
            moneyRequest_initBankAcctByManagerId(currentUserId)
            // 复现数据
              window.setTimeout(function () {
                  showData_add_money_request_pop(data)
              },1000)
            //初始化组织部门
            moneyRequest_orgSelect_no_render(data.orgId).then(function () {
              $('#addmoneyRequestForm #orgizatId').val($('#addmoneyRequestForm [name=orgId] option:selected').text())
            })
            // 隐藏选择框  展示input
            $('#addmoneyRequestForm [readInp]').css('display', 'block')
            $('#addmoneyRequestForm #company').val($('#addmoneyRequestForm [name=company] option:selected').text())
            $('#addmoneyRequestForm #payType').val($('#addmoneyRequestForm [name=payType] option:selected').text())
            $('#addmoneyRequestForm #usageType').val($('#addmoneyRequestForm [name=usageTypeId] option:selected').text())
            // $("#addmoneyRequestForm #orgizatId").val($("#addmoneyRequestForm [name=orgId] option:selected").text())
            $('#addmoneyRequestForm #receiveAcctName').val($('#addmoneyRequestForm [name=receiveAcctId] option:selected').text())
            $('#addmoneyRequestForm #currency').val($('#addmoneyRequestForm [name=currency] option:selected').text())
            $('#addmoneyRequestForm #requireUser').val($('#addmoneyRequestForm [name=requireUser]').val())
            $('#addmoneyRequestForm #usageType').val($('#addmoneyRequestForm [name=usageTypeId] option:selected').text())

            // 表单设置disabled
            $('#addmoneyRequestForm input,#addmoneyRequestForm select,#addmoneyRequestForm textarea').attr('disabled', 'disabled').css('background-color', 'rgba(0,0,0,0.1)')

            $('#addmoneyRequestForm [name=bankAcctId]').removeAttr('disabled')
            form.render('select', 'moneyRequest_bankAcctIdSel')
            // 附件按钮展现及 文件框隐藏
            $('#addmoneyRequestForm [name=extraFile]').css('display', 'none')
            if (data.extraFileUrl) {
              $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').css('display', 'block')
              if (data.extraFileName) {
                $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').text(data.extraFileName)
              }
              $('#addmoneyRequestForm #extraFileDownLoadBtn_moneyRequest').click(function () {
                downLoadExtraFile(data.extraFileName, data.extraFileUrl)
              })
            }
            // 复现数据不可编辑
            $('#addmoneyRequestForm [name]').attr('disabled', 'true')
            // 展现回填表单
            $('#rebackInpForm_moneyRequest').removeAttr('hidden')
            form.render('select', 'rebackInpForm_moneyRequest')
          },
          yes: function () {
            var files = $('#rebackInpForm_moneyRequest input[name=rebackImg]')[0].files
            var formData = new FormData()
            if (files.length > 0) {
              formData.append('rebackImg', files[0])
            } else {
              layer.msg('请上传打款截图')
              return
            }
            formData.append('id', data.id)
            let bankAcctId = $('#addmoneyRequestForm [name=bankAcctId]').val()
            if (bankAcctId == '' || bankAcctId == undefined || bankAcctId == null) {
              layer.msg('选择实际付款账户不能为空')
              return
            }
            formData.append('bankAcctId', bankAcctId)
            loading.show()
            window.setTimeout(function () {
              $.ajax({
                url: ctx + '/msgMoneyRequest/reback.html',
                type: 'POST',
                async: false,
                data: formData,
                // 告诉jQuery不要去处理发送的数据
                processData: false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType: false,
                success: function (data) {
                  loading.hide()
                  if (data.code == '0000') {
                    searchFormoneyRequest(true)
                    layer.closeAll()
                    layer.msg('操作成功')
                  } else {
                    layer.msg(data.msg)
                  }
                }
              })
            }, 300)
          }
        })
        break
      case 'confirm':
        layer.confirm('确认已收到款项吗？', {
          btn: ['确认', '取消']
        }, function () {
          var Adata = {
            id: data.id
          }
          var ajax = new Ajax(true)
          loading.show()
          ajax.post({
            url: ctx + '/msgMoneyRequest/confirmReceive.html',
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
              loading.hide()
              if (data.code == '0000') {
                layer.msg('操作成功')
                searchFormoneyRequest(true)
                layer.closeAll()
              }
            }
          })
        }, function () {
          layer.closeAll()
        })
        break
      case 'download':
        downLoadExtraFile(data.extraFileName, data.extraFileUrl)
        break
      case 'update_field':
        updateField(data.id, data.checkRemark, '修改审核备注', 'checkRemark', ctx + '/msgMoneyRequest/updateField.html', active_moneyRequest.reload)
        break
      case 'againModifyBankAcct':
        // 再次修改付款账户
        let layerIndex = layer.open({
          type: 1,
          title: '再次修改付款账户',
          area: ['30%', '40%'],
          shadeClose: false,
          content: $('#moneyRequest_againModify_bankAcct_pop').html(),
          btn: ['确认更改', '关闭'],
          success: function (layero, index) {
            // 初始化必填项
            initNotNull()
            let emptyOption = '<option value=""></option>'
            $('#moneyRequest_againModify_bankAcct_form [name=bankAcctId]').html(emptyOption)
            let options = $('#moneyRequest_againModify_bankAcctBox option')
            $('#moneyRequest_againModify_bankAcct_form [name=bankAcctId]').append(options)
            form.val('moneyRequest_againModify_bankAcct_form', {
              'bankAcctId': data.bankAcctId
            })
          },
          yes: function () {
            // 校验必填项
            if (!checkNotNull('#moneyRequest_againModify_bankAcct_form', layer)) {
              return
            }
            // console.log('之前账户信息:', data.bankAcctId, data.bankAcctName, data.bankCardNo, data.id)
            // console.log('现在的账户信息:', $('#moneyRequest_againModify_bankAcct_form [name=bankAcctId]').val())
            let currentBankAcctId = $('#moneyRequest_againModify_bankAcct_form [name=bankAcctId]').val()
            let previousBankAcctId = data.bankAcctId
            if (+currentBankAcctId === +previousBankAcctId) {
              layer.msg('账户不能是先前的账户')
              return
            }
            request.sendAjax('/msgBankAcct/get/' + currentBankAcctId + '.html', null, res => {
              let jsonData = {
                previousBankAcctId: previousBankAcctId,
                currentBankAcctId: res.data.id,
                currentBankAccountName: res.data.acctName,
                currentBankCardNo: res.data.cardNo,
                msgMoneyRequestId: data.id
              }
              console.log(jsonData)
              request.sendAjax('/msgMoneyRequest/againModify.html', JSON.stringify(jsonData), res => {
                // 重新加载数据
                searchFormoneyRequest(true)
                layer.msg('操作成功')
                layer.close(layerIndex)
              }, 'POST')
            }, 'POST')
          }
        })
        break
      case 'deleteBankAcct':
        // 删除付款账户
        let index = layer.confirm('确认删除该付款账户吗？', {
          btn: ['确认', '取消']
        }, function () {
          let jsonData = {
            id: data.id
          }
          request.sendAjax('/msgBankAcct/delete.html', JSON.stringify(jsonData), res => {
            layer.msg('操作成功')
          }, 'POST')
        }, function () {
          layer.close(index)
        })
        break
    }


  })

  function downLoadExtraFile (fileName, fileSavePath) {
    if (!fileSavePath) {
      return
    }
    if (!fileName) {
      fileName = ''
    }
    var fileSaveName = fileSavePath.substring(fileSavePath.lastIndexOf('/') + 1, fileSavePath.length)
    var data = {
      fileName: fileName,
      fileSaveName: fileSaveName
    }
    submitForm(data, ctx + '/msgMoneyRequest/downExtraFile.html')
  }

  $('#export_moneyRequest').click(function () {
    var data = {
      orderNo: '',
      creator: '',
      requireUser: '',
      checkUser: '',
      amount: '',
      remark: '',
      checkRemark: '',
      company: $('form[name=searchForm_moneyRequest] [name=company]').val(),
      usageType: $('form[name=searchForm_moneyRequest] [name=usageType]').val(),
      receiveAcctId: $('form[name=searchForm_moneyRequest] [name=receiveAcct]').val(),
      // bankAcctId : $('form[name=searchForm_moneyRequest] [name=bankAcct]').val(),
      acctName: $('form[name=searchForm_moneyRequest] [name=acctName]').val(),
      payType: $('form[name=searchForm_moneyRequest] [name=payType]').val(),
      checkStatus: $('form[name=searchForm_moneyRequest] [name=checkStatus]').val(),
      beginDate: $('form[name=searchForm_moneyRequest] #beginDate_moneyRequest').val(),
      endDate: $('form[name=searchForm_moneyRequest] #endDate_moneyRequest').val()
    }
    var searchType = $('form[name=searchForm_moneyRequest] [name=searchType]').val()
    if (searchType) {
      data[searchType] = $('form[name=searchForm_moneyRequest] [name=searchData]').val()
    }

    // if (!data.beginDate.trim()) {
    //   layer.msg('请选择一个开始日期')
    //   return
    // }
    submitForm(data, ctx + '/msgMoneyRequest/export.html')
  })
  $('#export_moneyRequestBillLianlian').click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 })
      return
    }
    let payPlatCode = 'lianlian'
    submitForm({ 'ids': ids.join(',') }, ctx + '/msgMoneyRequest/export/' + payPlatCode + '.html')
  })
  $('#export_moneyRequestBillXunhui').click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 })
      return
    }
    let payPlatCode = 'xunhui'
    submitForm({ 'ids': ids.join(',') }, ctx + '/msgMoneyRequest/export/' + payPlatCode + '.html')
  })
  $('#export_moneyRequestBillAlipay').click(function () {
    let ids = getTableSelectIds()
    if (!ids || ids.length < 1) {
      layer.msg('请选择订单', { icon: 7 })
      return
    }
    let payPlatCode = 'alipay'
    submitForm({ 'ids': ids.join(',') }, ctx + '/msgMoneyRequest/export/' + payPlatCode + '.html')
  })

  function getTableSelectIds () {
    var checkStatus = table.checkStatus('moneyRequestReloadTable')
    var data = checkStatus.data
    var ids = (data || []).map(function (item) {
      return item.id
    })
    return ids
  }

  //用户组织选择框
  function moneyRequest_orgSelect (id) {
    var orgId = id
    $.ajax({
      type: 'post',
      url: ctx + '/sys/listAllOrgTreeSel.html',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          $(returnData.data).each(function () {
            var dataId = this.pOrgIds + ',' + this.id,
              dataIds = dataId.slice(2)
            $('#addmoneyRequestForm [name=orgId]').append('<option value=\'' + dataIds + '\'>' + this.name + '</option>')
            if (orgId != null && orgId == dataIds) {
              $('#addmoneyRequestForm [name=orgId]').append('<option value=\'' + dataIds + '\' selected>' + this.name + '</option>')
            }
          })
          form.render('select', 'addmoneyRequestForm')
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
  }

  //用户组织选择框1
  function moneyRequest_orgSelect_no_render (id) {
    return new Promise(function (resolve, reject) {
      var orgId = id
      $.ajax({
        type: 'post',
        url: ctx + '/sys/listAllOrgTreeSel.html',
        dataType: 'json',
        success: function (returnData) {
          if (returnData.code == '0000') {
            $(returnData.data).each(function () {
              var dataId = this.pOrgIds + ',' + this.id,
                dataIds = dataId.slice(2)
              $('#addmoneyRequestForm [name=orgId]').append('<option value=\'' + dataIds + '\'>' + this.name + '</option>')
              if (orgId != null && orgId == dataIds) {
                $('#addmoneyRequestForm [name=orgId]').append('<option value=\'' + dataIds + '\' selected>' + this.name + '</option>')
              }
            })
            resolve('')
          } else {
            layer.msg(returnData.msg)
          }
        }
      })
    })
  }
})

function refreshReceiveAcct (refreshSelector) {
  var ajax = new Ajax()
  ajax.post({
    url: ctx + '/msgMoneyRequest/queryReceiveAcct.html',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (res) {
      if (res.code == '0000') {
        layer.msg('更新成功')
        var list = res.data

        var str = '<option value=""></option>'
        for (var i = 0; i < list.length; ++i) {
          str += '<option value="' + list[i].id + '"data-acct="' + list[i].acct + '" data-acctName="' + list[i].acctName + '">' + list[i].simpleName + '</option>'
        }
        $('form[name=searchForm_moneyRequest] [name=receiveAcct]').html(str)
        $(refreshSelector).html(str)
        layui.form.render('select')
      }
    }
  })
}

function refreshRequireUser (refreshSelector,ifMsg,backtodo) {
    oneAjax.post({
        url: ctx + '/msgMoneyRequest/queryrequireUser.html',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (res) {
            if (res.code === '0000') {
                if (ifMsg) {
                    layer.msg('更新成功')
                }
                let list = res.data
                let managerIdJson = {}
                let str = '<option value=""></option>'
                for (var i = 0; i < list.length; ++i) {
                  let one = list[i]
                  if (managerIdJson[one.managerId]) {
                    continue
                  }
                    managerIdJson[one.managerId] = 1
                    str += '<option value="' + one.managerId + '">' + one.manager + '</option>'
                }
                $('form[name=searchForm_moneyRequest] #requireUserDiv').html(str)
                $(refreshSelector).html(str)
                if (backtodo) {
                    backtodo()
                }
                layui.form.render('select')
            }
        }
    })
}
