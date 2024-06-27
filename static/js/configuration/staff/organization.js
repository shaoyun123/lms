/**
 * time: 2018/01/02
 */

layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate','formSelects', 'jquery', 'upload', 'laypage'], function () {
  var layer = layui.layer,
    table = layui.table,
    form = layui.form,
    laytpl = layui.laytpl,
    $ = layui.$,
    admin = layui.admin,
    upload = layui.upload,
    laypage = layui.laypage,
    formSelects = layui.formSelects
    laydate = layui.laydate

  var checkedOrgId = 0
  var isOrgChecked = false
  var tarXTree1, resourceXTree1, tarAcctXTree1, acctXTree1
  // 表格渲染
  table.render({
    elem: '#userTable',
    method: 'post',
    url: ctx + '/sys/userPage.html',
    where:{status: true},
    cols: [
      [
        //标题栏
        {field: 'loginName', title: '登录名'},
        {field: 'userName', title: '真实姓名'},
        {field: 'orgName', title: '所属部门'},
        {field: 'companyName', title: '所属公司'},
        {title: '角色', toolbar: '#userRoleBar', width: 90},
        {title: '主管', toolbar: '#userLeaderBar'},
        {title: '状态', toolbar: '#userStatusBar'},
        {field: 'birthday', title: '生日'},
        {title: '性别', toolbar: '#userGenderBar'},
        {field: 'mobile', title: '手机'},
        {field: 'email', title: '邮箱'},
        {title: '创建时间', templet: '<div>{{format(d.createTime,"yyyy-MM-dd")}}</div>'},
        {field: 'remark', title: '备注'},
        {title: '操作', toolbar: '#userOperBar', width: 200}
      ]
    ],
    id: 'sysUserTable',
    page: true,
    limits: [20, 50, 100],
    limit: 100,
    done: function (res) {
      //这是导入代码,替换接口就可以了
      if (res.code == '0000') {
        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i]
          upload.render({
            elem: '#organization_import' + item.id //绑定元素
            , url: `${ctx}/sys/uploadCharging?userId=` + item.id//上传接口
            // where: {"userId":item.id}
            , accept: 'file' //允许上传的文件类型
            , exts: 'xlsx'
            , done: function (res) {
              if (res.code == '0000') {
                layer.msg(res.msg, { icon: 1 })
              } else {
                layer.alert(res.msg, { icon: 5 })
              }
            }
            , error: function () {
              layer.msg('服务器出现故障!')
            }
          })
        }
      }
    }

  })

  var organization = {
    importCost: function () { //上传功能
      //导入计费功能
      upload.render({
        elem: '#multipleDownStoreImportBtn' //绑定元素
        , url: `${ctx}/sys/uploadCharging?userId=` + 99999
        , accept: 'file' //允许上传的文件类型
        , exts: 'xlsx'
        , done: function (res) {
          if (res.code == '0000') {
            layer.msg(res.msg, { icon: 1 })
          } else {
            layer.alert(res.msg, { icon: 5 })
          }
        }
        , error: function () {
          layer.msg('服务器出现故障!')
        }
      })
    },
  }

  organization.importCost()

  form.render('select')

  var active = {
    //搜索
    reload: function () {
      table.reload('sysUserTable', {
        page: {
          curr: 1
        },
        where: {
          orgId: checkedOrgId,
          loginName: $.trim($('#userSearchForm input[name=\'loginName\']').val()),
          companyName: $.trim($('#userSearchForm #userCompanyNameSel').val()),
          roleName: $.trim($('#userSearchForm input[name=\'roleName\']').val()),
          status: $.trim($('#userSearchForm #userStatusSel').val()),
        }
      })
    }
  }

  $('#userSearchBtn').on('click', function () {
    var type = $(this).data('type')
    active[type] ? active[type].call(this) : ''
  })

  var orgXTree = new layuiXtree({
    elem: 'orgXTree', //(必填) 放置xtree的容器id，不要带#号,
    form: form, //(必填) layui 的 from,
    isopen: false, //加载完毕后的展开状态
    isCheckOnly: true,
    data: ctx + '/sys/listAllOrgTree.html', //(必填) json数组
    color: { //三种图标颜色，独立配色，更改几个都可以
      open: '#EE9A00', //节点图标打开的颜色
      close: '#EEC591', //节点图标关闭的颜色
      end: '#828282', //末级节点图标的颜色
    },
    click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件
      isOrgChecked = data.elem.checked
      if (isOrgChecked) {
        checkedOrgId = data.value
      } else {
        checkedOrgId = 0
      }
      orgXTree.SetOtherCheckedFalse(data.value)
      active['reload'].call()
      //如果是内置部门，禁用修改删除按钮，否则启用
      var title = data.elem.title
      if (title.indexOf('[内置]') != -1) {
        $('#editSysOrgBtn').addClass('layui-btn-disabled')
        $('#delSysOrgBtn').addClass('layui-btn-disabled')
        $('#editSysOrgBtn').prop('disabled', true)
        $('#delSysOrgBtn').prop('disabled', true)
      } else {
        $('#editSysOrgBtn').removeClass('layui-btn-disabled')
        $('#delSysOrgBtn').removeClass('layui-btn-disabled')
        $('#editSysOrgBtn').prop('disabled', false)
        $('#delSysOrgBtn').prop('disabled', false)
      }
    }
  })

  //添加组织弹出框
  $('#addSysOrgBtn').click(function () {
    var index = layer.open({
      type: 1,
      title: '添加组织',
      // shade: 0, //遮罩透明度
      shadeClose: false,
      area: ['800px', '600px'],
      content: $('#orgManageLayer').html(),
      success: function () {
        $('#addOrgForm #addpOrgSel').val(checkedOrgId)
        form.render('select')
      },
      end: function () {
        //关闭时清空表格内容
        $('#addOrgForm').trigger('reset')
      },
      btn: ['确定', '取消'],
      yes: lms_debounce(function (index, layero) {
        $('#addOrgForm #submitAddOrg')[1].click() //这里的bug有点懵逼,虽然解决了,但是问题仍然存在啊
      }, 1000)
    })

  })

  //添加组织
  form.on('submit(addOrg)', function (data) {
    $.ajax({
      type: 'post',
      url: ctx + '/sys/addOrganization.html',
      dataType: 'json',
      data: data.field,
      success: function (returnData) {
        if (returnData.code == '0000') {
          layer.closeAll()
          checkedOrgId = 0
          isOrgChecked = false
          orgXTree.render()
          layer.msg('添加组织成功')
          listAllOrgTreeSel()
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        layer.msg('发送请求失败')
      }
    })
    return false
  })

  //修改组织弹出框
  $('#editSysOrgBtn').click(function () {
    if (!isOrgChecked) {
      layer.alert('请先选择一个组织')
      return
    }

    $('#editOrgForm input[name=\'id\']').val(checkedOrgId)
    var index = layer.open({
      type: 1,
      title: '修改组织',
      // shade: 0, //遮罩透明度
      shadeClose: false,
      area: ['800px', '600px'],
      content: $('#editOrgManageLayer').html(),
      end: function () {
        // $("#editOrgForm")[0].reset();
        $('#editOrgForm').trigger('reset')
      },
      btn: ['确定', '取消'],
      yes: lms_debounce(function (index, layero) {
        $('#editOrgForm #submitEditOrg')[1].click()
      }, 1000)
    })
    $('#editOrgForm #editpOrgSel').val(checkedOrgId)

    $.ajax({
      type: 'post',
      url: ctx + '/sys/getOrgById.html',
      data: {
        'id': checkedOrgId
      },
      dataType: 'json',
      async: false,
      success: function (returnData) {
        if (returnData.code == '0000') {
          var obj = returnData.data
          $('#editOrgForm input[name=\'name\']').val(obj.name)
          $('#editOrgForm input[name=\'code\']').val(obj.code)
          $('#editOrgForm #editpOrgSel').val(obj.pOrgId)
          $('#editOrgForm input[name=\'sort\']').val(obj.sort)
          $('#editOrgForm textarea[name=\'remark\']').val(obj.remark)
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
    form.render('select')
  })

  //修改组织
  form.on('submit(editOrgBtn)', function (data) {
    $.ajax({
      type: 'post',
      url: ctx + '/sys/editOrganization.html',
      dataType: 'json',
      data: data.field,
      success: function (returnData) {
        if (returnData.code == '0000') {
          layer.closeAll()
          checkedOrgId = 0
          isOrgChecked = false
          orgXTree.render()
          layer.msg('修改组织成功')
          listAllOrgTreeSel()
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        layer.msg('发送请求失败')
      }
    })
    return false
  })

  //删除组织
  $('#delSysOrgBtn').click(function () {
    if (!isOrgChecked) {
      layer.alert('请先选择一个组织')
      return
    }
    deleteOrg(checkedOrgId)
  })

  //删除组织
  function deleteOrg (orgId) {
    layer.confirm('删除后不可恢复，是否确认删除？', function (result) {
      if (result) {
        $.ajax({
          type: 'post',
          url: ctx + '/sys/delOrganization.html',
          data: {
            'orgId': orgId
          },
          dataType: 'json',
          success: function (returnData) {
            if (returnData.code == '0000') {
              checkedOrgId = 0
              isOrgChecked = false
              orgXTree.render()
              layer.msg('删除成功')
              listAllOrgTreeSel()
            } else {
              layer.msg(returnData.msg)
            }
          },
          error: function () {
            layer.msg('发送请求失败')
          }
        })
      }
    })
  }

  //自定义验证规则
  form.verify({
    uniqueOrg: function (value, item) {
      var id = $(item).closest('form').find('input[name=\'id\']').val()
      var pOrgId = $(item).closest('form').find('select option:selected').val()
      var isUnique = true
      $.ajax({
        type: 'post',
        url: ctx + '/sys/checkOrgNameUnique.html',
        data: {
          'orgName': value,
          'id': id,
          'pOrgId': pOrgId
        },
        dataType: 'json',
        async: false,
        success: function (returnData) {
          if (returnData.code != '0000') {
            //此处return不起作用
            isUnique = false
          }
        }
      })
      if (!isUnique) {
        return '组织名称已存在'
      }
    },
    uniqueLoginName: function (value, item) {
      var id = $(item).closest('form').find('input[name=\'id\']').val()
      var isUnique = true
      $.ajax({
        type: 'post',
        url: ctx + '/sys/checkLoginNameUnique.html',
        data: {
          'loginName': value,
          'id': id
        },
        dataType: 'json',
        async: false,
        success: function (returnData) {
          if (returnData.code != '0000') {
            //此处return不起作用
            isUnique = false
          }
        }
      })
      if (!isUnique) {
        return '登录名已存在'
      }
    },
    leaderOnly: function (value, item) {
      var id = $(item).closest('form').find('input[name=\'id\']').val()
      var orgId = $(item).closest('form').find('select option:selected').val()
      var isLeader = item.checked
      var isUnique = true
      if (isLeader) {
        $.ajax({
          type: 'post',
          url: ctx + '/sys/checkOrgLeader.html',
          data: {
            'id': id,
            'orgId': orgId,
            'isLeader': isLeader
          },
          dataType: 'json',
          async: false,
          success: function (returnData) {
            if (returnData.code != '0000') {
              //此处return不起作用
              isUnique = false
            }
          }
        })
        if (!isUnique) {
          return '部门主管已存在，只能有一位'
        }
      }
    }
  })

  $(function () {
    //加载所有组织的下拉框
    listAllOrgTreeSel()
    //加载角色下拉框
    listAllRole()
    //加载所有公司名称
    listAllCompanyName()

  })

  function listAllOrgTreeSel () {
    $('#addOrgForm #addpOrgSel').prop('length', 2)
    $('#editOrgForm #editpOrgSel').prop('length', 2)
    $('#addUserForm #addOrgSel').prop('length', 1)
    $('#editUserForm #editOrgSel').prop('length', 1)
    $.ajax({
      type: 'post',
      url: ctx + '/sys/listAllOrgTreeSel.html',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          $(returnData.data).each(function () {
            $('#addOrgForm #addpOrgSel').append('<option value=\'' + this.id + '\'>' + this.name + '</option>')
            $('#editOrgForm #editpOrgSel').append('<option value=\'' + this.id + '\'>' + this.name + '</option>')
            $('#addUserForm #addOrgSel').append('<option value=\'' + this.id + '\'>' + this.name + '</option>')
            $('#editUserForm #editOrgSel').append('<option value=\'' + this.id + '\'>' + this.name + '</option>')
          })
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
  }

  function listAllRole () {
    $('#addRoleDiv').empty()
    $('#editRoleDiv').empty()
    $.ajax({
      type: 'post',
      url: ctx + '/sys/listAllRoles.html',
      async: false,
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          $(returnData.data).each(function () {
            $('#addRoleDiv').append('<input type=\'checkbox\' name=\'roleIds[]\' value=\'' + this.id + '\' lay-skin=\'primary\' title=\'' + this.name + '\'>')
            $('#editRoleDiv').append('<input type=\'checkbox\' name=\'roleIds[]\' value=\'' + this.id + '\' lay-skin=\'primary\' title=\'' + this.name + '\'>')
          })
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
  }
  //查看系统功能
  $('#allResource').click(function () {
    layer.open({
      type: 1,
      title: '查看系统功能',
      // shade: 0, //遮罩透明度
      shadeClose: false,
      area: ['580px', '650px'],
      content: $('#resourceTreeLayer').html(),
      success: function (layero) {
        var tarXTree = $('#resourceForm #resourceXTree').eq(1)
        tarXTree.attr('id', 'resourceXTree1')
        tarXTree1 = tarXTree.attr('id')
        console.log(tarXTree1)
        resourceXTree1 = new layuiXtree({
          elem: tarXTree1, //(必填) 放置xtree的容器id，不要带#号,
          form: form, //(必填) layui 的 form
          isopen: true, //加载完毕后的展开状态，默认值：true,
          // data: ctx+"/sys/listAllResource.html", //(必填) json数组
          data: [],
          color: { //三种图标颜色，独立配色，更改几个都可以
            open: '#EE9A00', //节点图标打开的颜色
            close: '#EEC591', //节点图标关闭的颜色
            end: '#828282', //末级节点图标的颜色
          },
          click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件
          }
        })
        resourceXTree1.renderByData(ctx + '/sys/listAllResourceByRoleOrUser.html?userId=-1')
      }
    })
  })

  //////////////////////用户////////////////////////////

  //增加用户按钮弹出框
  $('#addSysUserBtn').click(function () {
    if (!isOrgChecked) {
      layer.alert('请先选择一个组织')
      return
    }
    listAllRole()
    var index = layer.open({
      type: 1,
      title: '添加用户',
      content: $('#addUserLayer').html(),
      // shade: 0, //遮罩透明度
      shadeClose: false,
      area: ['80%', '100%'],
      success: function (layero, index) {
        var addBirthday = layero.find('form #addBirthday')
        laydate.render({
          elem: addBirthday[0]
        })
      },
      end: function () {
        //关闭时清空表格内容
        // $("#addUserForm")[0].reset();
        $('#addUserForm').trigger('reset')
      },
      btn: ['确定', '取消'],
      yes: lms_debounce(function (index, layero) {
        $('#addUserForm #submitAddUser')[1].click()
      },1000)
    })
    $('#addUserForm #addOrgSel').val(checkedOrgId)
    form.render()
  })

  //添加用户
  form.on('submit(addUser)', function (data) {
    data.field.loginName = data.field.loginName.trim();
    data.field.userName = data.field.userName.trim();
    loading.show()
    $.ajax({
      type: 'post',
      url: ctx + '/sys/addUser.html',
      dataType: 'json',
      data: data.field,
      success: function (returnData) {
        if (returnData.code == '0000') {
          //layer.closeAll();
          $('#addUserForm input[name=loginName]').val('')
          $('#addUserForm input[name=userName]').val('')
          active['reload'].call()
          layer.msg('添加用户成功')
          loading.hide()
        } else {
          loading.hide()
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        loading.hide()
        layer.msg('发送请求失败')
      }
    })
    return false
  })

  /**
   * 多级类目渲染
   * @param selectedId 默认选择的类目id
   * @param cateIdSelector cateId元素选择器
   * @param cateNameSelector cateName元素选择器
   * @param mustLeafCate 是否必须选叶子节点   true/false
   * @param columData 列数据
   */
  function showCateTree (selectedId, cateIdSelector, cateNameSelector, mustLeafCate, columnData) {
    console.log(selectedId)
    let organization_cateXTree
    let catePop = layer.open({
      type: 1,
      title: '类目选择(此处仅单选)',
      id: 'cateLayer',
      area: ['60%', '85%'],
      content: $('#organization_cateLayer').html(),
      btn: ['确定'],
      success: function () {
        loading.show()
        let xTreeData = []
        let checkedCateIds = []
        // 先回显选中的类目
        request.sendAjax('/sysuser/getAuthedCate/' + columnData.id, null, res => {
            checkedCateIds = res.data
            request.sendAjax('/product/getCateForSupplier.html', null, res => {
                xTreeData = res.data
                // console.log('xTreeData: ', xTreeData)
                console.log('checkedCateIds: ', checkedCateIds)
                if (checkedCateIds.length > 0) {
                    checkedCateIds.forEach(i => {
                            xTreeData.forEach(t => {
                                if (t.data.length > 0) {
                                    t.data.forEach(c => {
                                            if (+c.value === +i) {
                                                c.checked = true
                                            }
                                        }
                                    )
                                }
                            })
                        }
                    )
                }
                loading.hide()
                organization_cateXTree = new layuiXtree({
                    elem: 'organization_cateXTree', //(必填) 放置xtree的容器id，不要带#号,
                    id: 'cateXTree',
                    form: form, //(必填) layui 的 from,
                    isopen: false, //加载完毕后的展开状态
                    isCheckOnly: false,
                    isParentChangeCheck: true,
                    data: xTreeData, //(必填) json数组
                    color: { //三种图标颜色，独立配色，更改几个都可以
                        open: '#EE9A00', //节点图标打开的颜色
                        close: '#EEC591', //节点图标关闭的颜色
                        end: '#828282', //末级节点图标的颜色
                    },
                    click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件
                        // organization_cateXTree.SetOtherCheckedFalse(data.value)
                    }
                })
                organization_cateXTree.render()
                if (selectedId) {
                    organization_cateXTree.setCheckedByValue(selectedId) // 默认勾选一选择类目
                    organization_cateXTree.OpenByLeafValue(selectedId) // 默认展开已选择分支
                }
            })
        })

        // 绑定搜索功能
        $('#organization_cateSearchInp').keyup(function (event) {
          if (event.keyCode == 13) {
            var title = $('#organization_cateSearchInp').val().trim()
            if (title) {
              organization_cateXTree.searchLikeByTitle(title)
            }
          }
        })
        $('#organization_searchCateBtn').click(function () {
          var title = $('#organization_cateSearchInp').val().trim()
          if (title) {
            organization_cateXTree.searchLikeByTitle(title)
          }
        })
      },
      yes: lms_debounce(function (index, layero) {
        let prodCateIds = []
        let cateBox = organization_cateXTree.GetChecked()
        cateBox.forEach(e => {
          prodCateIds.push(e.value)
        })
        if (prodCateIds.length === 0) {
          layer.msg('你还未授予二级类目!', { icon: 3 })
          return
        }
        console.log(prodCateIds)
        let authCateData = {
          userId: columnData.id,
          cateIds: prodCateIds
        }
        // console.log(authCateData)
        request.sendAjax('/sysuser/authCate', JSON.stringify(authCateData), res => {
          layer.msg('操作成功', { icon: 1 })
          layer.close(catePop)
        })
      },1000)
    })
  }

//工具条的监sd听事件,table.on(tool(表格的lay-filter的值))
  table.on('tool(userTable)', function (obj) {
    var data = obj.data, //获得当前行数据
      layEvent = obj.event //获得 lay-event 对应的值
    switch (layEvent) {
      //编辑弹框
      case 'editUser':
        listAllRole()
        var id = data.id
        $('#editUserForm input[name=\'id\']').val(id)
        var index = layer.open({
          type: 1,
          title: '编辑用户',
          // shade: 0, //遮罩透明度
          shadeClose: false,
          area: ['80%', '100%'],
          content: $('#editUserLayer').html(),
          success: function (layero, index) {
            var editBirthday = layero.find('form #editBirthday')
            laydate.render({
              elem: editBirthday[0]
            })
          },
          end: function () {
            // $("#editUserForm")[0].reset();
            $('#editUserForm').trigger('reset')
          },
          btn: ['确定', '取消'],
          yes: lms_debounce(function (index, layero) {
            $('#editUserForm #submitEditUser')[1].click()
          },1000)
        })

        $.ajax({
          type: 'post',
          url: ctx + '/sys/getUserDtoById.html',
          data: {
            'id': id
          },
          dataType: 'json',
          async: false,
          success: function (returnData) {
            if (returnData.code == '0000') {
              var obj = returnData.data
              $('#editUserForm input[name=\'loginName\']').eq(1).val(obj.loginName)
              $('#editUserForm #editOrgSel').eq(1).val(obj.orgId)
              $('#editUserForm #editCompanyNameSel').eq(1).val(obj.companyName)
              $('#editUserForm #editGenderSel').eq(1).val(obj.gender + '')
              $('#editUserForm input[name=\'userName\']').eq(1).val(obj.userName)
              $('#editUserForm input[name=\'birthdayStr\']').eq(1).val(obj.birthday)
              $('#editUserForm input[name=\'email\']').eq(1).val(obj.email)
              $('#editUserForm input[name=\'mobile\']').eq(1).val(obj.mobile)
              $('#editUserForm input[name=\'address\']').eq(1).val(obj.address)
              if (obj.isLeader) {
                $('#editUserForm #editUserCheckBox').eq(1).prop('checked', true)
              } else {
                $('#editUserForm #editUserCheckBox').eq(1).prop('checked', false)
              }
              var roles = obj.sysRoles
              if (roles.length > 0) {
                for (var i in roles) {
                  $('#editUserForm #editRoleDiv').eq(1).find('input[type=\'checkbox\']').each(function () {
                    if ($(this).val() == roles[i].id) {
                      $(this).prop('checked', true)
                    }
                  })
                }
              }
              $('#editUserForm textarea[name=\'remark\']').eq(1).val(obj.remark)
            } else {
              layer.msg(returnData.msg)
            }
          }
        })
        form.render()
        break
      //停用
      case 'disableStoreAcct':
        deleteUser(data.id)
        break
      //启用
      case 'enableStoreAcct':
        openUser(data.id)
        break
      case 'authResource':
        layer.open({
          type: 1,
          title: '授予资源',
          // shade: 0, //遮罩透明度
          shadeClose: false,
          area: ['580px', '650px'],
          content: $('#resourceTreeLayer').html(),
          success: function (layero) {
            var tarXTree = $('#resourceForm #resourceXTree').eq(1)
            tarXTree.attr('id', 'resourceXTree1')
            tarXTree1 = tarXTree.attr('id')
            resourceXTree1 = new layuiXtree({
              elem: tarXTree1, //(必填) 放置xtree的容器id，不要带#号,
              form: form, //(必填) layui 的 form
              isopen: true, //加载完毕后的展开状态，默认值：true,
              //data: ctx+"/sys/listAllResource.html", //(必填) json数组
              data: [],
              color: { //三种图标颜色，独立配色，更改几个都可以
                open: '#EE9A00', //节点图标打开的颜色
                close: '#EEC591', //节点图标关闭的颜色
                end: '#828282', //末级节点图标的颜色
              },
              click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件
              }
            })
            resourceXTree1.renderByData(ctx + '/sys/listAllResourceByRoleOrUser.html?userId=' + data.id)
          },
          btn: ['确认', '取消'],
          yes: lms_debounce(function () {
            //授予资源
            var id = $('#resourceForm').eq(1).find(' input[name=\'id\']').val()
            var resourcArr = new Array()
            var checkedArr = resourceXTree1.GetAllChecked()
            for (var i in checkedArr) {
              resourcArr.push(checkedArr[i].value)
            }

            $.ajax({
              type: 'post',
              url: ctx + '/sys/authResourceForUser.html',
              async: false,
              data: {
                'userId': id,
                'resourceIds': resourcArr.join(',')
              },
              dataType: 'json',
              success: function (returnData) {
                if (returnData.code == '0000') {
                  layer.closeAll()
                  layer.msg('授予资源成功')
                } else {
                  layer.msg(returnData.msg)
                }
              },
              error: function () {
                layer.msg('发送请求失败')
              }
            })
          }, 1000)
        })
        $('#resourceForm').eq(1).find(' input[name=\'id\']').val(data.id)
        break
      case 'authStoreAcct':
        storeAuthOpen(data)
        break
      case 'authWarehouseForUser':
        authWarehouseForUserOpen(data)
        break
      // 授予类目
      case 'organizationAuthCate':
        showCateTree(null, '#organization_cateIds', '#organization_cateName', true, data)
        break;
      //授予报表
      case 'authTimetask':
        commonReturnPromise({
          url: '/lms/statisticReport/pageQuery?page=1&limit=10000'
        }).then(allData => {
          org_authTimetaskHandle(data, allData);
        });
        // console.log('授予报表', data);
        break;
      //授予字典
      case 'authLabelDict':
        org_authLabelDictHandle(data);
        break;
    }
  });
  //授权字典操作
  function org_authLabelDictHandle(data){
    let id = data.id;
    commonTasktimeAndDict_showSelectedItemAjax(id, 'BIZ_DICT_HEAD').then(ckedRes => {
      //选中的数据ckedRes
      let ckedIdsList = ckedRes.map(item=> Number(item.resourceVal));
      console.log('ckedIdsList', ckedIdsList);
      layer.open({
        type: 1,
        title: '授予字典--'+ data.loginName,
        btn: ['授权', '关闭'],
        area: ['60%', '80%'],
        content: $('#org_authLabelDictLayer').html(),
        id: 'org_authLabelDictLayerId',
        success: function(){
          table.render({
            elem: '#org_authLabelDictLayer_table'
            ,id: 'org_authLabelDictLayer_tableId'
            ,height: 500
            ,url: '/lms/sysdict/getAllBizDictHead.html' //数据接口
            ,page: false //开启分页
            ,limit: 10000
            ,created(res){
              if(ckedIdsList.length == 0){
                return res;
              }else{
                for(let i=0; i<res.data.length; i++){
                  let item = res.data[i];
                  if(ckedIdsList.includes(item.id)){
                    item.LAY_CHECKED = true;
                  }
                }
                return res;
              }
            }
            ,cols: [[ //表头
              {type: 'checkbox', width: 40}
              // ,{field: 'id', title: 'ID'}
              ,{field: 'name', title: '字典头'}
              ,{field: 'headCode', title: '头代码'}
            ]]
          });
        },
        yes: function(index){
          let ckedData = table.checkStatus('org_authLabelDictLayer_tableId');
          let idsList = ckedData.data.map(item => item.id);
  
          commonTasktimeAndDict_singleAddPermissionAjax(id, idsList.join(','), 'BIZ_DICT_HEAD').then(res => {
            layer.msg(res || '操作成功', {icon: 1});
            layer.close(index);
          });
        }
      });
    });
   
  }
  //授予报表操作
  function org_authTimetaskHandle(data, allData){
    let id = data.id;
    commonTasktimeAndDict_showSelectedItemAjax(id, 'TIMING_REPORT').then(ckedRes => {
      //选中的数据ckedRes
      let ckedIdsList = ckedRes.map(item=> Number(item.resourceVal));
      layer.open({
        type: 1,
        title: '授予报表--'+ data.loginName,
        btn: ['授权', '关闭'],
        area: ['60%', '80%'],
        content: $('#org_authTimetaskLayer').html(),
        id: 'org_authTimetaskLayerId',
        success: function(layero){
          form.render('select');
          let tableRender = function(data){
            table.render({
              elem: '#org_authTimetaskLayer_table'
              ,id: 'org_authTimetaskLayer_tableId'
              ,height: 500
              ,url: '/lms/statisticReport/pageQuery' //数据接口
              , where: data
              ,page: false //开启分页
              ,limit: 10000
              ,created(res){
                let currentData = (res.data || []).map(item => {
                  return {...item, bgColor: true}
                });
                let currentIds = currentData.map(item => item.id);
                let filterData = allData.filter(item => !currentIds.includes(item.id));
                let newData = currentData.concat(filterData);
                res.data = newData;
                if(ckedIdsList.length == 0){
                  return res;
                }else{
                  for(let i=0; i<res.data.length; i++){
                    let item = res.data[i];
                    if(ckedIdsList.includes(item.id)){
                      item.LAY_CHECKED = true;
                    }
                  }
                  return res;
                }
              }
              ,cols: [[ //表头
                {type: 'checkbox', width: 40}
                ,{ title: "状态",field: "status", templet: '#org_timetask_status',}
                ,{field: 'name', title: '报表名称'}
                ,{title: "定时发送日期",field: "sendDays",templet: '#org_timetask_sendDays'}
                ,{title: "定时发送时间",field: "sendTime",
                  templet: d => {
                      let exportMinute = ""
                      if (d.exportHour !== null && d.exportHour !== undefined) {
                          exportHour = d.exportHour
                          if (d.exportHour < 10) {
                              exportHour = `0${d.exportHour}`
                          }
                      }
                      if (d.exportMinute !== null && d.exportMinute !== undefined) {
                          exportMinute = d.exportMinute
                          if (d.exportMinute < 10) {
                              exportMinute = `0${d.exportMinute}`
                          }
                      }
                      return `${exportHour}:${exportMinute}`
                  }
                }
                ,{title: "收件人",field: "recipientIds",templet: '#org_timetask_recipientIds'}
                ,{title: '备注',
                field: 'remark',
                templet: d => {
                    let strHtml = ''
                    if(d.remark!==null && d.remark!==undefined){
                        return `<div class="timetask_overflow_four" lay-tips="${d.remark}">${d.remark}</div>`
                    }
                    return strHtml
                }}
                ,{field: 'configType', title: '分类'}
              ]]
              ,done(res){
                //循环添加背景色
                let tableData = res.data || [];
                if(!data.name && !data.status){
                }else{
                  for(let i=0; i<tableData.length; i++){
                    //给表格行添加背景色
                    if(tableData[i]['bgColor']){
                      layero.find('tbody').find(`tr[data-index=${i}]`).css({
                        backgroundColor: '#ffc387'
                      });
                    }
                  }
                }

              }
            });
          }
          tableRender({});
          //查询功能
          layero.find('#org_authTimetaskLayer_searchBtn').on('click', function(){
            let name= layero.find('input[name=name]').val().trim();
            let status = layero.find('select[name=status]').val();
            //不做表格的重新渲染,直接处理表格数据??
            tableRender({name, status});
          });
        },
        yes: function(index){
          let ckedData = table.checkStatus('org_authTimetaskLayer_tableId');
          let idsList = ckedData.data.map(item => item.id);
  
          commonTasktimeAndDict_singleAddPermissionAjax(id, idsList.join(','), 'TIMING_REPORT').then(res => {
            layer.msg(res || '操作成功', {icon: 1});
            layer.close(index);
          });
        }
      });
    });
  }

// 授予店铺--搜索
  $(document).on('click', '#organizationSearchBtn_unAuthorized', function () {
    renderacctTreeLayerTable(1, 1, limitAllData)
  })

// 授予店铺--搜索
  $(document).on('click', '#organizationSearchBtn_authorized', function () {
    renderacctTreeLayerTable(2, -1, -1)
  })

// // 授予店铺 -- 渲染页面分页
//   function allstatusOrderPage (number) {
//     let boolean
//     number == 1 ? boolean = false : boolean = true
//     let searchCondition = $('#organization_searchCondition' + number).val()
//     searchCondition = searchCondition.replace(/，/g, ',')//兼容中文逗号
//     $.ajax({
//       type: 'post',
//       url: ctx + '/sys/v2/listPlatAccByRoleOrUser.html',
//       data: {
//         'auth': boolean,
//         'userId': $('#organization_input_userid').val(),
//         'searchCondition': searchCondition,
//         'limit': 100,
//       },
//       success: function (data) {
//         let returnData = data
//         if (returnData.code === '0000') {
//           localStorage.setItem('organizationTableCount' + number, returnData.count)
//           laypage.render({
//             elem: 'acctTreeLayerTablepage' + number,
//             limit: 100,
//             limits: [100, 200, 500],
//             first: false
//             , last: false,
//             layout: ['prev', 'page', 'next', 'count', 'limit'],
//             count: localStorage.getItem('organizationTableCount' + number),
//             groups: 3,
//             jump: function (obj, first) {
//               //首次不执行
//               if (!first) {
//                 number == 1 ? renderacctTreeLayerTable(number, obj.curr, obj.limit) : renderacctTreeLayerTable(number, -1, -1)
//               }
//             }
//           })
//         }
//       }
//     })
//   }

// 1.increaseStoreAcct新增授权的数据，2.decreaseStoreAcct移除授权的数据
  let increaseStoreAcct = [], decreaseStoreAcct = [],currentPageAllData = 1,limitAllData = 100;

// 授予店铺 -- 获取已授予true和未授予false店铺信息
  function renderacctTreeLayerTable (number, page, limit) {
    let boolean
    number == 1 ? boolean = false : boolean = true
    let searchCondition = $('#organization_searchCondition' + number).val()
    searchCondition = searchCondition.replace(/，/g, ',')//兼容中文逗号
    const platCodes = formSelects.value(`organization_searchCondition${number}_platcode`,'valStr')
    $.ajax({
      type: 'post',
      url: ctx + '/sys/v2/listPlatAccByRoleOrUser.html',
      data: {
        'auth': boolean,
        'userId': $('#organization_input_userid').val(),
        'searchCondition': searchCondition,
        'limit': limit,
        'page': page,
        platCodes
      },
      success: function (data) {
        let returnData = data
        if (returnData.code === '0000') {
          returnData.data
          // 未授权店铺表新增 移除添加授权数据，删掉移除授权数据
          // 已授权新增 移除授权数据，删掉添加授权数据
          // number == 1?rendertable1(returnData):rendertable2(returnData);
          let increaseStoreAcctids = increaseStoreAcct.map(item => item.id)
          let decreaseStoreAcctids = decreaseStoreAcct.map(item => item.id)
          if (number === 1) {  // 刷新表格时，前端把未授权/已授权的数据过滤/新增
            returnData.data = returnData.data.filter(items => !increaseStoreAcctids.includes(items.id))
            returnData.data = returnData.data.concat(decreaseStoreAcct)
            rendertable1(returnData,limit)
            laypage.render({
                elem: 'acctTreeLayerTablepage' + number,
                limit: limit,
                limits: [100, 200, 500],
                first: false
                , last: false,
                layout: ['prev', 'page', 'next', 'count', 'limit'],
                curr:currentPageAllData,
                count: data.count,
                groups: 3,
                jump: function (obj, first) {
                    currentPageAllData = obj.curr;
                    limitAllData = obj.limit;

                    //首次不执行
                    if (!first) {
                        renderacctTreeLayerTable(number, obj.curr, obj.limit)
                    }
                }
            })
          } else {
            returnData.data = returnData.data.filter(items => !decreaseStoreAcctids.includes(items.id))
            returnData.data = returnData.data.concat(increaseStoreAcct)
            rendertable2(returnData)
          }
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        layer.msg('发送请求失败')
      }
    })
  }


  function rendertable1 (res,limit) {
    table.render({
      elem: '#acctTreeLayerTable1',
      size: 'sm',
      cols: [
        [
          //标题栏
          { type: 'checkbox' },
          {
            field: 'platCode',
            title: '平台'
          },
          {
            field: 'storeAcct',
            title: '店铺名'
          },
          {
            title: '操作',
            toolbar: '#acctTreeLayerTableBtn1',
          }
        ]
      ],
      data: res.data,
      id: 'acctTreeLayerTable1',
      page: false,
      limit: limit
    })
  }

  function rendertable2 (res) {
    table.render({
      elem: '#acctTreeLayerTable2',
      size: 'sm',
      cols: [
        [
          //标题栏
          { type: 'checkbox' },
          {
            field: 'platCode',
            title: '平台'
          },
          {
            field: 'storeAcct',
            title: '店铺名'
          },
          {
            title: '操作',
            toolbar: '#acctTreeLayerTableBtn2',
          }
        ]
      ],
      data: res.data,
      id: 'acctTreeLayerTable2',
      // page:false,
      limit: 10000
    })
  }

// 监听复选框已选择的数据
  function watchCheckd () {
    let checkStatus1 = table.checkStatus('acctTreeLayerTable1') //获取选择的店铺
    let checkStatus2 = table.checkStatus('acctTreeLayerTable2') //获取选择的店铺
    $('#organization_layerform1 span[name="checkData"]').text(checkStatus1.data.length)
    $('#organization_layerform2 span[name="checkData"]').text(checkStatus2.data.length)
  }


// table1监听复选框事件
  table.on('checkbox(acctTreeLayerTable2)', function (obj) {
    let checkStatus2 = table.checkStatus('acctTreeLayerTable2') //获取选择的店铺
    $('#organization_layerform2 span[name="checkData"]').text(checkStatus2.data.length)
  })

// table1监听复选框事件
  table.on('checkbox(acctTreeLayerTable1)', function (obj) {
    let checkStatus1 = table.checkStatus('acctTreeLayerTable1') //获取选择的店铺
    $('#organization_layerform1 span[name="checkData"]').text(checkStatus1.data.length)
  })


// 监听表格添加授权操作,新增授权的数据增加，移除授权的数据减少
  table.on('tool(acctTreeLayerTable1)', function (obj) {
    var data = obj.data, //获得当前行数据
      layEvent = obj.event //获得 lay-event 对应的值
    if (layEvent === 'create') {
      organcreateData([data])
      decreaseStoreAcct = decreaseStoreAcct.filter(items => data.id != items.id)
      increaseStoreAcct = increaseStoreAcct.concat([data])
    }
  })

// 监听表格移除授权操作
  table.on('tool(acctTreeLayerTable2)', function (obj) {
    var data = obj.data, //获得当前行数据
      layEvent = obj.event //获得 lay-event 对应的值
    if (layEvent === 'delete') {
      organdeleteData([data])
      increaseStoreAcct = increaseStoreAcct.filter(items => data.id != items.id)
      decreaseStoreAcct = decreaseStoreAcct.concat([data])
    }
  })

// 重新渲染数据表格
  function organcreateData (ceratedata) {
    let data1 = layui.table.cache['acctTreeLayerTable1'], // table1当前页的数据
      data2 = layui.table.cache['acctTreeLayerTable2'] // table2当前页的数据
    let checkStatus1Id = ceratedata.map(item => item.id) // 需要添加授权的id
    if (data1) {
      data1 = data1.filter(item => !checkStatus1Id.includes(item.id)) // data1移除数据
    }
    data2 = ceratedata.concat(data2) // data2添加数据
    table.reload('acctTreeLayerTable1', {
      data: data1,
    })
    table.reload('acctTreeLayerTable2', {
      data: data2,
    })
    watchCheckd()
  }

//  重新渲染数据表格
  function organdeleteData (deletedata) {
    let data1 = layui.table.cache['acctTreeLayerTable1'],// table1当前页的数据
      data2 = layui.table.cache['acctTreeLayerTable2']// table2当前页的数据
    let checkStatus2Id = deletedata.map(item => item.id)// 需要移除授权的id
    if (data2) {
      data2 = data2.filter(item => !checkStatus2Id.includes(item.id))// data2移除数据
    }
    data1 = deletedata.concat(data1)// data1添加数据
    table.reload('acctTreeLayerTable1', {
      data: data1
    })
    table.reload('acctTreeLayerTable2', {
      data: data2
    })
    watchCheckd()
  }

// 添加授权的方法
  function addauthorization () {
    let checkStatus1 = table.checkStatus('acctTreeLayerTable1') //获取选择的店铺
    if (checkStatus1.data.length == 0) {
      layer.alert('请选择需要添加授权的店铺')
      return false
    }
    let checkStatus1Id = checkStatus1.data.map(item => item.id)// 需要移除授权的id
    organcreateData(checkStatus1.data)

    decreaseStoreAcct = decreaseStoreAcct.filter(items => !checkStatus1Id.includes(items.id))
    let checkStatus1data = checkStatus1.data
    increaseStoreAcct = increaseStoreAcct.concat(checkStatus1data)
  }

// 删除授权的方法
  function deleteauthorization () {
    let checkStatus2 = table.checkStatus('acctTreeLayerTable2') //获取选择的店铺
    if (checkStatus2.data.length == 0) {
      layer.alert('请选择需要移除授权的店铺')
      return false
    }
    let checkStatus2Id = checkStatus2.data.map(item => item.id)// 需要移除授权的id
    organdeleteData(checkStatus2.data)
    increaseStoreAcct = increaseStoreAcct.filter(items => !checkStatus2Id.includes(items.id))
    let checkStatus2data = checkStatus2.data
    decreaseStoreAcct = decreaseStoreAcct.concat(checkStatus2data)
  }

// 批量添加授权
  $(document).on('click', '#organization_add_authorization', function () {
    addauthorization()
  })

// 批量移除授权
  $(document).on('click', '#organization_delete_authorization', function () {
    deleteauthorization()
  })

// 导出
  $(document).on('click', '#organizationExportBtn_unAuthorized', function () {
    transBlob({
      fileName: '未授权店铺.xls',
      url: ctx + '/sysuser/download/excel/acctAuth/0/' + $('#organization_input_userid').val(),
      // formData: formData
    }, 'get').then(function (result) {
      layer.alert(result, { icon: 1 })
    }).catch(function (err) {
      layer.alert(err, { icon: 2 })
    })
  })


// 导出
  $(document).on('click', '#organizationExportBtn_authorized', function () {
    transBlob({
      fileName: '已授权店铺.xls',
      url: ctx + '/sysuser/download/excel/acctAuth/1/' + $('#organization_input_userid').val(),
      // formData: formData
    }, 'get').then(function (result) {
      layer.alert(result, { icon: 1 })
    }).catch(function (err) {
      layer.alert(err, { icon: 2 })
    })
  })


// 打开授予店铺弹窗
  function storeAuthOpen (data) {
    layer.open({
      type: 1,
      title: '授予店铺',
      // shade: 0, //遮罩透明度
      id:new Date().getTime(),
      shadeClose: false,
      area: ['1000px', '650px'],
      content: $('#acctTreeLayer').html(),
      btn: ['确认', '取消', '前往paypal绑定'],
      success: function (layero) {
        // 置空
        increaseStoreAcct = [], decreaseStoreAcct = []
        let userId = data.id

        $('#organization_input_userid').val(userId)
        formSelects.render('organization_searchCondition1_platcode')
        formSelects.render('organization_searchCondition2_platcode')
        // 表格
        // allstatusOrderPage(1)
        // // 分页
        renderacctTreeLayerTable(1, 1, limitAllData)
        renderacctTreeLayerTable(2, -1, -1)
        //展示平台列表
        // $.ajax({
        //   type: 'post',
        //   url: ctx + '/sysuser/getAuthPlatListByUserOrRole.html',
        //   data: {
        //     'userId': data.id
        //   },
        //   dataType: 'json',
        //   async: false,
        //   success: function (returnData) {
        //     if (returnData.code == '0000') {

        //       var result = returnData.data
        //       for (var i = 0; i < result.length; i++) {
        //         if (result[i].checkedFlag) {
        //           $('#userPlatAuthAddForm').append(`<input lay-filter="authPlat" name="authPlat" type="checkbox" value="` + result[i].name + `" title="` + result[i].name + `" checked lay-skin="primary">`)

        //         } else {
        //           $('#userPlatAuthAddForm').append(`<input lay-filter="authPlat" name="authPlat" type="checkbox" value="` + result[i].name + `" title="` + result[i].name + `"  lay-skin="primary">`)
        //         }
        //       }
        //       form.render()
        //     } else {
        //       layer.msg(returnData.msg)
        //     }
        //   },
        //   error: function () {
        //     layer.msg('发送请求失败')
        //   }
        // })
        // 获取平台
        commonReturnPromise({
          url: '/lms/unauditorder/listenum.html'
        }).then(res=>{
          const arr = res.platCodes.map(v=>({value:v,name:v}))
          formSelects.data('organization_searchCondition1_platcode','local',{arr})
          formSelects.data('organization_searchCondition2_platcode','local',{arr})
        })
      },
      btn2:function(){
        currentPageAllData = 1;
        limitAllData = 100;
      },
      btn3: function () {
        layer.closeAll();
        paypalAuthOpen(data)
      },
      yes: lms_debounce(function () {
        // 新增授权和移除授权的数据
        let increaseStoreAcctIds = increaseStoreAcct.map(item => item.id)
        let decreaseStoreAcctIds = decreaseStoreAcct.map(item => item.id)

        //获取全选的平台
        // var array = $('#userPlatAuthAddForm input[name=authPlat]')
        // var autoAuthArray = new Array()
        // for (var i = 0; i < array.length; i++) {
        //   if ($(array[i]).prop('checked')) {
        //     autoAuthArray.push($(array[i]).val())
        //   }
        // }

        let obj = {
          'userId': data.id,
          'increaseStoreAcctIds': increaseStoreAcctIds,
          'decreaseStoreAcctIds': decreaseStoreAcctIds,
          // 'platCodes': autoAuthArray
        }
        commonReturnPromise({
            url: ctx + '/sysuser/v2/AcctAuth.html',
            type: 'put',
            params: JSON.stringify(obj),
            dataType: 'json',
            contentType: 'application/json'
        }).then(function (result) {
          layer.closeAll();
          currentPageAllData = 1;
          limitAllData = 100;
          layer.msg('授予店铺成功')
        }).catch(function (err) {
          layer.msg(err, { icon: 2 })
        })
      },1000),
    })
  }

// 打开paypal账号授权弹窗
  function paypalAuthOpen (data) {
    layer.open({
      type: 1,
      title: '授予paypal账号',
      // shade: 0, //遮罩透明度
      shadeClose: false,
      area: ['550px', '650px'],
      content: $('#paypalTreeLayer').html(),
      btn: ['确认', '取消', '授予销售店铺'],
      success: function (layero) {
        $('#authUserId').val(data.id)
        copyPaypalFrom(layero)
        var tarXTree = $('#paypalForm #paypalXTree').eq(1)
        tarXTree.attr('id', 'paypalXTree1')
        tarXTree.css('width', '500px')
        tarAcctXTree1 = tarXTree.attr('id')
        acctXTree1 = new layuiXtree({
          elem: tarAcctXTree1, //(必填) 放置xtree的容器id，不要带#号,
          form: form, //(必填) layui 的 from,
          isopen: true, //加载完毕后的展开状态，默认值：true,
          isParentChangeCheck: false,
          //data: ctx+"/sys/listAllPlatAccTree.html", //(必填) json数组
          data: [],
          ckall: true, //启用全选功能，默认值：false
          ckallback: function (data) { //全选框状态改变后执行的回调函数
          },
          color: { //三种图标颜色，独立配色，更改几个都可以
            open: '#EE9A00', //节点图标打开的颜色
            close: '#EEC591', //节点图标关闭的颜色
            end: '#828282', //末级节点图标的颜色
          },
          click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件
          }
        })
        acctXTree1.renderByData(ctx + '/sys/listAllPaypalAcctByRoleOrUser.html?userId=' + data.id)
      },
      btn3: function () {
        // 前往销售店铺授权
        layer.closeAll()
        storeAuthOpen(data)
      },
      yes: function () {
        //授予账号
        var paypalArr = new Array()
        var checkedArr = acctXTree1.GetChecked()
        for (var i in checkedArr) {
          paypalArr.push(checkedArr[i].value)
        }

        console.log(paypalArr)
        // //获取全选的平台
        // var array = acctXTree1.GetCheckedNullValue();
        // var autoAuthArray = new Array();
        // for (var i in array) {
        //     autoAuthArray.push(array[i].title);
        // };
        // var autoAuthPlat = autoAuthArray.join(",");

        $.ajax({
          type: 'post',
          url: ctx + '/sys/authPaypalForUser.html',
          async: false,
          data: {
            'id': data.id,
            'paypalIds': paypalArr.join(',')
          },
          dataType: 'json',
          success: function (returnData) {
            if (returnData.code == '0000') {
              layer.closeAll()
              layer.msg('授予paypal成功')
            } else {
              layer.msg(returnData.msg)
            }
          },
          error: function () {
            layer.msg('发送请求失败')
          }
        })
      },
    })
  }

//授权仓库给用户
  function authWarehouseForUserOpen (data) {
    var userId = data.id
    //加载仓库列表
    $.ajax({
      type: 'post',
      url: ctx + '/prodWarehouse/getWarehouseByAuth',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          laytpl($('#org_authWarehouseTpl').html()).render(returnData.data, function (html) {
            layer.open({
              title: '授予仓库',
              content: html,
              btn: ['确认', '取消'],
              success: function (layero, index) {
                layui.form.render('checkbox')
              },
              yes: lms_debounce(function (index, layero) {
                var prodWarehouseIds = []
                $('#org_authWarehouseForm input[name=prodWarehouse]:checked').each(function () {
                  prodWarehouseIds.push($(this).val())
                })
                layui.admin.load.show()
                $.ajax({
                  type: 'post',
                  url: ctx + '/sys/authWarehouseForUser.html',
                  dataType: 'json',
                  data: {
                    userId: userId,
                    prodWarehouseIds: prodWarehouseIds.join(',')
                  },
                  success: function (returnData) {
                    layui.admin.load.hide()
                    if (returnData.code == '0000') {
                      layer.msg('仓库授权成功', {
                        icon: 1
                      })
                      layer.close(index)
                    } else {
                      layer.msg(returnData.msg, {
                        icon: 2
                      })
                    }
                  },
                  error: function () {
                    layer.msg('服务器异常，请联系管理员')
                  }
                })
              }, 1000)
            })
          })
          //加载用户授权仓库
          $.ajax({
            type: 'post',
            url: ctx + '/sys/listAuthWarehouseByUser.html',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              userId: userId
            }),
            success: function (returnData) {
              layui.admin.load.hide()
              if (returnData.code == '0000') {
                if (returnData.data && returnData.data.length > 0) {
                  returnData.data.forEach(function (prodWarehouseId) {
                    $('#org_authWarehouseForm input[value=' + prodWarehouseId + ']').prop('checked', true)
                  })
                  //判断是否全选
                  var allChecked = $('#org_authWarehouseForm input[name=prodWarehouse]').not('input:checked').length == 0
                  $('#org_authWarehouseForm input[name=checkAll]').prop('checked', allChecked)
                  form.render('checkbox')
                }
              } else {
                layer.msg(returnData.msg)
              }
            },
            error: function () {
              layui.admin.load.hide()
              layer.msg('服务器异常，请联系管理员')
            }
          })
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        layer.msg('服务器异常，请联系管理员')
      }
    })
  }

//仓库与全部仓库全选
  form.on('checkbox(org_checkProdhouseAll)', function (data) {
    $(data.elem).parent('div').find('input[name=prodWarehouse]').prop('checked', data.elem.checked)
    form.render()
  })
  form.on('checkbox(org_checkProdhouseOne)', function (data) {
    var allChecked = $(data.elem).parent('div').find('input[name=prodWarehouse]').not('input:checked').length == 0
    $(data.elem).parent('div').find('input[name=checkAll]').prop('checked', allChecked)
    form.render()
  })
  form.verify({
      pass: function(value, item){ //value：表单的值、item：表单的DOM对象
          if(value != '' && !new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\\(\\)])+$)([^(0-9a-zA-Z)]|[\\(\\)]|[a-zA-Z]|[0-9]){6,12}$").test(value)){
              return '密码必须6到12位字母数字组合';
          }
      }
  });

//修改
  form.on('submit(editUserBtn)', function (data) {
    data.field.loginName = data.field.loginName.trim();
    data.field.userName = data.field.userName.trim();
    $.ajax({
      type: 'post',
      url: ctx + '/sys/editUser.html',
      dataType: 'json',
      data: data.field,
      beforeSend: function(){
        loading.show();
      },
      success: function (returnData) {
        loading.hide();
        if (returnData.code == '0000') {
          layer.closeAll()
          active['reload'].call()
          layer.msg('修改用户成功')
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        loading.hide();
        layer.msg('发送请求失败')
      }
    })
    return false
  })

//停用用户
  function deleteUser (id) {
    layer.confirm('是否确认停用该用户？', function (result) {
      if (result) {
        $.ajax({
          type: 'post',
          url: ctx + '/sys/delOrOpenUser.html',
          data: {
            'id': id,
            'status': false
          },
          dataType: 'json',
          success: function (returnData) {
            if (returnData.code == '0000') {
              active['reload'].call()
              layer.msg('停用成功')
            } else {
              layer.msg(returnData.msg)
            }
          },
          error: function () {
            layer.msg('发送请求失败')
          }
        })
      }
    })
  }

//启用用户
  function openUser (id) {
    $.ajax({
      type: 'post',
      url: ctx + '/sys/delOrOpenUser.html',
      data: {
        'id': id,
        'status': true
      },
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          active['reload'].call()
          layer.msg('启用成功')
        } else {
          layer.msg(returnData.msg)
        }
      },
      error: function () {
        layer.msg('发送请求失败')
      }
    })
  }

  function listAllCompanyName () {
    $.ajax({
      type: 'post',
      url: ctx + '/sys/companyNameList.html',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          $(returnData.data).each(function () {
            $('#userSearchForm #userCompanyNameSel').append('<option value=\'' + this.name + '\'>' + this.name + '</option>')
            $('#addUserForm #addCompanyNameSel').append('<option value=\'' + this.name + '\'>' + this.name + '</option>')
            $('#editUserForm #editCompanyNameSel').append('<option value=\'' + this.name + '\'>' + this.name + '</option>')
          })
          form.render()
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
  }

//复制店铺权限
  function copyAcctFrom (containsObj) {
    var $html = `<div class="layui-form-item layui-form copyAcctForUserForm" style="position:absolute;bottom:2px;left:30px;width: 230px;">
                                        <div id="copyAcctForUserForm_prodTpl">
                                              
                                            <div class="layui-inline"  style="float: left; width: 150px;">
                                                  <input type="text" class="layui-input" placeholder="用户名称" style="height:30px" name="copyAcctForUserForm_userName">
                                            </div> 
                                            <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="copyAcctForUserClick(this)">应用</button>
                                            </div>
                                        </div>
                                                        
                                        </div>`
    var $target = containsObj.find('.layui-layer-btn.layui-layer-btn-')
    $target.append($html)
  }

//复制Paypal权限
  function copyPaypalFrom (containsObj) {
    var $html = `<div class="layui-form-item layui-form copyAcctForUserForm" style="position:absolute;bottom:2px;left:30px;width: 230px;">
                                        <div id="copyAcctForUserForm_prodTpl">
                                              
                                            <div class="layui-inline"  style="float: left; width: 35%">
                                                  <input type="text" class="layui-input" placeholder="用户名称" style="height:30px" name="copyAcctForUserForm_userName">
                                            </div> 
                                            <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="copyPaypalForUserClick(this)">应用</button>
                                            </div>
                                        </div>
                                                        
                                        </div>`
    var $target = containsObj.find('.layui-layer-btn.layui-layer-btn-')
    $target.append($html)
  }


})

function copyAcctForUserClick (obj) {
  var autitForm = $(obj).closest('.copyAcctForUserForm')
  var data = {
    authUserId: $('#authUserId').val(),
    userName: autitForm.find('[name=copyAcctForUserForm_userName]').val()
  }
  console.log('data', data)
  $.ajax({
    type: 'get',
    url: ctx + '/sys/copyAcctForUser.html',
    dataType: 'json',
    data: data,
    success: function (returnData) {
      loading.hide()
      if (returnData.code == '0000') {
        layer.closeAll()
        layer.msg('授予店铺成功')
      } else {
        layer.msg(returnData.msg)
      }
    },
    error: function () {
      loading.hide()
      layer.msg('发送请求失败')
    }
  })
}

function copyPaypalForUserClick (obj) {
  var autitForm = $(obj).closest('.copyAcctForUserForm')
  var data = {
    authUserId: $('#authUserId').val(),
    userName: autitForm.find('[name=copyAcctForUserForm_userName]').val()
  }
  console.log('data', data)
  $.ajax({
    type: 'get',
    url: ctx + '/sys/copyPaypalForUser.html',
    dataType: 'json',
    data: data,
    success: function (returnData) {
      loading.hide()
      if (returnData.code == '0000') {
        layer.closeAll()
        layer.msg('授予Paypal成功')
      } else {
        layer.msg(returnData.msg)
      }
    },
    error: function () {
      loading.hide()
      layer.msg('发送请求失败')
    }
  })
}

var organizationReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/

function org_pwdRandomRange (min, max) {
  var returnStr = '',
    range = (max ? Math.round(Math.random() * (max - min)) + min : min),
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (arr.length - 1))
    returnStr += arr[index]
  }
  if (!organizationReg.test(returnStr)) {
    org_pwdRandomRange(min, max)
  } else {
    // console.log('return的结果是', returnStr)
    return returnStr
  }
}

function org_randomNumber (min, max) {
  var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  var range = (max ? Math.round(Math.random() * (max - min)) + min : min),
    returnStr = ''
  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (numArr.length - 1))
    returnStr += numArr[index]
  }
  return returnStr
}

function set_org_pwdNumRandom (obj) {
  var $prev = $(obj).parent().find('input')
  var $pwd = org_randomNumber(4, 4)
  var capitalArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var lowerArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  var capitalStr = capitalArr[(Math.round(Math.random() * 25))]
  var lowerStr = lowerArr[(Math.round(Math.random() * 25))]
  var $pwdStr = capitalStr + lowerStr + $pwd
  $prev.val($pwdStr)
}

function set_org_pwdRandom (obj) {
  var $prev = $(obj).parent().find('input')
  var $pwd = org_pwdRandomRange(6, 12)
  while (!$pwd) {
    $pwd = org_pwdRandomRange(6, 12)
  }
//    console.log('密码是', $pwd)
  $prev.val($pwd)
}