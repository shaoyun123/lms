/**
 * time: 2018/09/18  huangpeng
 */

layui.use(['admin', 'form', 'table', 'layer', 'laytpl', 'element'], function () {
  var admin = layui.admin,
    form = layui.form,
    table = layui.table,
    layer = layui.layer,
    element = layui.element,
    laytpl = layui.laytpl,
    $ = layui.$
  form.render('select')
  form.render('radio')
  form.render('checkbox')

  function hwcPhone_queryPage (where) {
    //展示已知数据
    table.render({
      elem: '#hwcPhoneTable',
      method: 'post',
      url: ctx + '/huaWeiCloud/queryPhoneList.html',
      where: where,
      cols: [
        [
          //标题栏
          { type: 'checkbox' },
          { field: 'virtualPhone', title: '虚拟号码', width: 100 },
          { field: 'realPhone', title: '真实号码', width: 100 },
          { field: 'belonger', title: '归属人', width: 100 },
          // {field: "reamark", title: "备注",width: 200},
          { field: 'authUserList', align: 'left', title: '已授权人员', templet: '#hwcPhone_authUserListTpl' }
        ],
      ],
      id: 'hwcPhoneTable',
      page: true, //是否显示分页
      limits: [100, 500, 1000],
      limit: 100, //每页默认显示的数量
      done: function () {
      }
    })
  }

  hwcPhone_queryPage()
  // 搜索
  var active = {
    reload: function () {
      //执行重载
      table.reload('hwcPhoneTable', {
        where: {
          status: $('#hwcPhoneSearchForm [name=\'status\']').val(),
          acct: $('#hwcPhoneSearchForm [name=\'acct\']').val(),
          auditStatus: $('#hwcPhoneSearchForm [name=\'auditStatus\']').val()
        },
      })
    },
  }

  // 搜索
  $('#hwcPhoneSearch').click(function () {
    let data = serializeObject($('#hwcPhoneSearchForm'))
    hwcPhone_queryPage(data)
  })

  // 刷新所有虚拟号绑定信息
  $('#hwcPhone_refreshAllPhone').click(function () {
    let title = '不选号码默认同步所有虚拟号码。确认同步全部虚拟号码？'
    let checkStatus = table.checkStatus('hwcPhoneTable'),
      data = checkStatus.data
    let virtualPhoneList = []
    for (let i = 0; i < data.length; i++) {
      virtualPhoneList.push(data[i].virtualPhone)
    }
    if (virtualPhoneList.length > 0) {
      title = '确认同步所选号码？'
    }

    let confirmIndex = layer.confirm(title, { btn: ['确定', '取消'] }, function () {
      layer.close(confirmIndex)
      let ajax = new Ajax()
      ajax.post({
        url: '/huaWeiCloud/initPhone.html',
        data: JSON.stringify({ virtualPhoneList: virtualPhoneList }),
        timeout: 180000,
        success: function (res) {
          if (res.code === '0000') {
            layer.msg('刷新成功')
            active.reload()
          } else {
            layer.msg(res.msg)
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (textStatus == 'timeout') {
            layer.msg('后台正在同步中，请稍后进行查看')
          }
        }
      })
    })
  })

  //工具条的监听事件,table.on(tool(表格的lay-filter的值))
  table.on('tool(hwcPhoneTable)', function (obj) {
    var data = obj.data, //获得当前行数据
      //getTpl = $("#detailM").html(), //获取模板引擎的内容
      layEvent = obj.event //获得 lay-event 对应的值

    if (layEvent === 'edit') {

    }
  })
  // 批量授权
  $('#hwcPhone_batchAuthBtn').click(function () {
    let checkStatus = table.checkStatus('hwcPhoneTable'),
      data = checkStatus.data
    if (!data || !data.length) {
      layer.msg('请选择需要授权的虚拟号码')
      return false
    }
    let virtualPhoneList = []
    for (let i = 0; i < data.length; i++) {
      virtualPhoneList.push(data[i].virtualPhone)
    }

    let bindPopIndex = layer.open({
      type: 1,
      title: '批量授权',
      area: ['1000px', '80%'],
      btn: ['授权', '关闭'],
      shadeClose: false,
      content: $('#hwcPhone_authUserPop').html(),
      success: function (layero, index) {
        hwcPhone_getPhoneManagerList(initAuthUser)
      },
      yes: function () {
        let bindFormData = serializeObject($('#hwcPhone_authUserForm'))
        console.log(bindFormData)
        if (!bindFormData || !bindFormData.authUser) {
          layer.msg('请选择需要授权的人员')
          return false
        }
        let Adata = {
          virtualPhoneList: virtualPhoneList,
          userIdList: bindFormData.authUser.split(',')
        }

        let ajax = new Ajax()
        ajax.post({
          url: '/huaWeiCloud/bindPhoneForPerson.html',
          data: JSON.stringify(Adata),
          success: function (res) {
            if (res.code === '0000') {
              layer.close(bindPopIndex)
              active.reload()
            } else {
              layer.msg(res.msg)
            }
          }
        })
      }
    })
  })
  // 解除授权
  $('#hwcPhone_batchUnAuthBtn').click(function () {
    let checkStatus = table.checkStatus('hwcPhoneTable'),
      data = checkStatus.data
    if (!data || !data.length) {
      layer.msg('请选择需要解除授权的虚拟号码')
      return false
    }
    let idList = []
    for (let i = 0; i < data.length; i++) {
      idList.push(data[i].id)
    }

    let unBindPopIndex = layer.open({
      type: 1,
      title: '批量解除授权',
      area: ['1000px', '80%'],
      btn: ['解除', '关闭'],
      shadeClose: false,
      content: $('#hwcPhone_authUserPop').html(),
      success: function (layero, index) {
        hwcPhone_getPhoneManagerList(initAuthUser)
      },
      yes: function () {
        let bindFormData = serializeObject($('#hwcPhone_authUserForm'))
        console.log(bindFormData)
        if (!bindFormData || !bindFormData.authUser) {
          layer.msg('请选择需要授权的人员')
          return false
        }
        let Adata = {
          idList: idList,
          userIdList: bindFormData.authUser.split(',')
        }

        let ajax = new Ajax()
        ajax.post({
          url: '/huaWeiCloud/unBindPhoneForPerson.html',
          data: JSON.stringify(Adata),
          success: function (res) {
            if (res.code === '0000') {
              layer.close(unBindPopIndex)
              active.reload()
            } else {
              layer.msg(res.msg)
            }
          }
        })
      }
    })
  })
  var hwcPhone_phoneManagerList

  // 初始化授权人员选择
  function initAuthUser () {
    if (!hwcPhone_phoneManagerList || !hwcPhone_phoneManagerList.length) {
      return
    }
    let contains = $('#hwcPhone_bindUserContains')
    let html = ''
    for (let index in hwcPhone_phoneManagerList) {
      let user = hwcPhone_phoneManagerList[index]
      html += `<div class="layui-col-md2 layui-col-lg2"><input type="checkbox" name="authUser" lay-skin="primary" value="` + user.id + `" title="` + user.userName + `" /></div>`
    }
    contains.append(html)
    form.render('checkbox', 'hwcPhone_authUserForm')
  }

  // 获取手机号专员
  function hwcPhone_getPhoneManagerList (backFunc) {
    if (!hwcPhone_phoneManagerList) {
      let ajax = new Ajax(false)
      ajax.post({
        type: 'POST',
        url: ctx + '/sysuser/getUserByRoleList.html',
        data: JSON.stringify({ roleList: ['手机号专员'] }),
        success: function (res) {
          if (res.code === '0000') {
            hwcPhone_phoneManagerList = res.data
            backFunc()
          } else {
            layer.msg('初始化' + role + ' 失败：' + res.msg)
          }
        }
      })
    } else {
      backFunc()
    }
  }

  // 已授权人员按钮 动态效果
  $('#hwcPhoneCard').on('mouseover', '.hwcPhone_authUserBox', function (e) {
    let self = e.target
    // 获取当前宽度
    self.style.width = self.offsetWidth + 'px'
    self.style.background = '#FF5722'
    // 设置按钮宽度
    self.innerText = '删除'
  })

  $('#hwcPhoneCard').on('mouseleave', '.hwcPhone_authUserBox', function (e) {
    let self = e.target
    self.style.background = '#009688'
    self.innerText = self.getAttribute('data-name')
  })

  // 删除已授权人员
  $('#hwcPhoneCard').on('click', '.hwcPhone_authUserBox', function (e) {
    let self = e.target
    let id = $(self).closest('.alignLeft').find('.hwcPhone_authUserBox_id').val()
    let Adata = {
      idList: [id],
      userIdList: [self.getAttribute('data-id')]
    }
    hwcPhone_batchUnbindAjax(Adata)
  })

  function hwcPhone_batchUnbindAjax (data) {
    console.log(data)
    if (!data.idList || !data.idList.length) {
      layer.msg('请选择需要取消授权的号码')
      return
    }
    if (!data.userIdList || !data.userIdList.length) {
      layer.msg('请选择需要取消授权的人员')
      return
    }
    let ajax = new Ajax()
    ajax.post({
      url: '/huaWeiCloud/unBindPhoneForPerson.html',
      data: JSON.stringify(data),
      success: function (res) {
        if (res.code === '0000') {
          active.reload()
        } else {
          layer.msg(res.msg)
        }
      }
    })
  }

  // 批量绑定
  $('#hwcPhone_batchbindBtn').click(function () {
    let checkStatus = table.checkStatus('hwcPhoneTable'),
      data = checkStatus.data
    if (!data || !data.length) {
      layer.msg('请选择需要绑定的虚拟号码')
      return false
    }
    let virtualPhoneList = []
    for (let i = 0; i < data.length; i++) {
      virtualPhoneList.push(data[i].virtualPhone)
    }
    if (virtualPhoneList.length > 5) {
      layer.msg('同一手机号最多绑定5个虚拟号码')
      return
    }
    let popIndex = layer.open({
      type: 1,
      title: '批量绑定',
      area: ['400px', '200px'],
      btn: ['绑定', '关闭'],
      shadeClose: false,
      content: $('#hwcPhone_batchBindPop').html(),
      success: function (layero, index) {

      },
      yes: function () {
        let Adata = {
          virtualPhoneList: virtualPhoneList,
          realPhone: $('#hwcPhone_batchBindForm').find('[name=realPhone]').val(),
          belonger: $('#hwcPhone_batchBindForm').find('[name=belonger]').val()
        }
        if (Adata.realPhone == null || Adata.realPhone === '') {
          layer.msg('手机号码不能为空')
          return
        }
        if (Adata.belonger == null || Adata.belonger === '') {
          layer.msg('归属人不能为空')
          return
        }
        let ajax = new Ajax(true)
        ajax.post({
          url: '/huaWeiCloud/bindPhone.html',
          data: JSON.stringify(Adata),
          success: function (res) {
            active.reload()
            layer.close(popIndex)
          }
        })
      }
    })
  })

  // 批量解绑
  $('#hwcPhone_batchUnbindBtn').click(function () {
    let checkStatus = table.checkStatus('hwcPhoneTable'),
      data = checkStatus.data
    if (!data || !data.length) {
      layer.msg('请选择需要解绑的虚拟号码')
      return false
    }
    let virtualPhoneList = []
    for (let i = 0; i < data.length; i++) {
      virtualPhoneList.push(data[i].virtualPhone)
    }
    let popIndex = layer.confirm('确定解绑这些虚拟号码？', { btn: ['确定', '取消'] }, function () {
      layer.close(popIndex)
      let Adata = {
        virtualPhoneList: virtualPhoneList
      }
      let ajax = new Ajax(true)
      ajax.post({
        url: '/huaWeiCloud/unBindPhone.html',
        data: JSON.stringify(Adata),
        success: function (res) {
          active.reload()
        }
      })
    })
  })
})