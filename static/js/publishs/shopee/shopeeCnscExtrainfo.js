layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'laydate', 'upload','layCascader'], function () {
  let admin = layui.admin, form = layui.form, layer = layui.layer, formSelects = layui.formSelects, table = layui.table,
    laydate = layui.laydate, upload = layui.upload, layCascader = layui.layCascader
  $ = layui.$
  form.render('select')
  form.render('checkbox')
  // 弹出层右侧搜索框 key
  let currentTitle = ''
  laydate.render({
    elem: '#shopeeCnscExtraInfoTime', //渲染时间
    range: true
  })

  laydate.render({
    elem: '#ee_cnsc_time', //渲染时间
    range: true
  })
    // 类目
    showCateCascader()
    let oaNewcateCascader = null
    let oaNewcateCascaderList = []
    let cnscCateCascader = null
    let cnscCateCascaderList = []
    function showCateCascader() {
      console.log('执行函数处理');
    Promise.all([
        commonReturnPromise({
            url: "/lms/prodCateOa/get/cate/tree",
        }),
        commonReturnPromise({
            url: "/lms/shopee/shopeeCate/cnscCategoryTree",
        }),
    ])
        .then(res => {
          oaNewcateCascaderList =JSON.parse(res[0])
            cnscCateCascaderList = res[1]
            oaNewcateCascader = layCascader({
                elem: "#shopeecnsc_extra_oaNewcateIds",
                clearable: true,
                filterable: true,
                collapseTags: true,
                options: JSON.parse(res[0]),
                props: {
                multiple: true,
                label: "title",
                value: "value",
                children: "data",
                checkStrictly: false,
                },
            });
            cnscCateCascader = layCascader({
                elem: "#shopeecnsc_extra_cnsccateIds",
                clearable: true,
                filterable: true,
                collapseTags: true,
                options: res[1],
                props: {
                multiple: true,
                label: "label",
                value: "value",
                children: "children",
                checkStrictly: false,
                },
            })
        })
        .catch(err => {
            layer.msg(err, { icon: 2 })
        })
    }
  // $('#shopee_cnsc_cateBtn').click(function () {
  //   admin.itemCat_select('layer-publishs-shopee-cnsc-publish', 'searchForm_shopee_cnsc_cateId', 'shopee_cnsc_cateDiv')
  // })
  //清空按钮的点击事件
  $('#shopee_cnsc_reset').click(function () {
    oaNewcateCascader.setValue()
    cnscCateCascader.setValue()
    formSelects.delete('shopee_cnsc_selectTortPlat', false)
  })


  // 获取数据列表
  function shopee_cnsc_extra_info_table_render (data) {
    table.render({
      elem: '#shopee_cnsc_table',
      url: ctx + '/shopee/shopeeCnscExtraInfo/pageQuery',
      where: data,
      method: 'post'
      //开启分页shopee_categoryTpl
      ,
      page: true
      //表头
      ,
      cols: [[{
        type: 'checkbox',
      }, { field: 'mainImgUri', title: '缩略图', templet: '#ee_imageTpl', width: '4%' }, {
        field: 'enTitle',
        title: '标题',
        width: '9%',
        templet: '#ebay_enTitle'
      }, { title: '归属人', templet: '#ee_owner', width: '4%' }, {
        field: 'psku',
        title: '父sku',
        width: '5%',
        templet: '<div><a href="javascript:;" id="prodDetail" style="color:blue" data-id="{{d.prodPId}}" data-oanewcate="true">{{d.psku}}</div>'
      }, { title: '侵权状态', templet: '#shopee_platTortTpl', width: '10%' }, {
        field: '',
        title: '禁售',
        templet: '#shopee_phTpl',
        width: '8%'
      }, {
        field: 'devNote',
        title: '开发备注',
        templet: '<div><pre class="aep-devNote">{{d.devNote || ""}}</pre></div>',
        width: '7%'
      }, {
        field: 'ebaySaleRemark',
        title: '销售备注',
        templet: '<div><pre class="aep-devNote">{{d.ebaySaleRemark || ""}}</pre></div>',
        width: '7%'
      }, {
        field: 'categoryId', title: 'categoryId', width: '7%'
      }, {
        field: 'fullCateName', title: 'category', width: '7%'
      }
        // , {
        //   field: 'specifics', title: 'specifics', width: '9%',
        //   templet: '<div>{{# if(d.specifics){ }}<pre>{{d.specifics}}</pre>{{# } }}</div>'
        // }
        , { field: 'creator', title: '创建人', templet: '#shopee_createrAndmodifier_tpl' }, {
          field: 'time',
          title: '时间',
          templet: '#shopee_createTime_tpl'
        }, { field: 'opt', title: '操作', toolbar: '#shopee_editBtnTpl', width: 80 }]],
      limits: [200, 300, 500],
      limit: 300,
      done: function (res, curr, count) {
        $('#shopee_countSpan').text(count)
        //懒加载
        imageLazyloadAll()
      }
    })
  }

  // 渲染表格商品相关数据
  function getEeSearchData () {
    let data = {}
    // data.cateId = $('#shopee_cnsc_searchForm input[name=cateId]').val()
    // OA类目
    data.cateOaIdList = JSON.parse($('#shopeecnsc_extra_oaNewcateIds').val() || '[]').join()
    // CNSC类目
    data.shopeeCnscCategoryIdList = JSON.parse($("#shopeecnsc_extra_cnsccateIds").val() || "[]").join()
    //侵权状态
    data.isShopeeTort = $('#shopee_cnsc_searchForm select[name=isShopeeTort]').val()
    data.completeStatus = $('#shopee_cnsc_searchForm select[name=completeStatus]').val()
    //日期
    let timeStr = $('#shopee_cnsc_searchForm input[name=time]').val()
    if (timeStr) {
      data.startTime = Date.parse(timeStr.split(' - ')[0] + ' 00:00:00')
      data.endTime = Date.parse(timeStr.split(' - ')[1] + ' 23:59:59')
      data.timeType = $('#shopee_cnsc_searchForm select[name=timeType]').val()
    } else {
      data.startTime = ''
      data.endTime = ''
      data.timeType = ''
    }
    //补充信息操作日期
    let infoTimeStr = $('#shopee_cnsc_searchForm input[name=infoTime]').val()
    if (infoTimeStr) {
      data.infoStartTime = Date.parse(infoTimeStr.split(' - ')[0] + ' 00:00:00')
      data.infoEndTime = Date.parse(infoTimeStr.split(' - ')[1] + ' 23:59:59')
      data.infoTimeType = $('#shopee_cnsc_searchForm select[name=infoTimeType]').val()
    } else {
      data.infoStartTime = ''
      data.infoEndTime = ''
      data.infoTimeType = ''
    }
    data.cnTitle = ''
    data.enTitle = ''
    data.pSku = ''
    data.sSku = ''
    let searchType = $('#shopee_cnsc_searchForm select[name=searchType]').val()
    data[searchType] = $('#shopee_cnsc_searchForm input[name=searchValue]').val()
    data.creatorId = ''
    data.modifierId = ''
    let operatorSearchType = $('#shopee_cnsc_searchForm select[name=operatorSearchType]').val()
    data[operatorSearchType] = $('#shopee_cnsc_searchForm select[name=operatorSearchValue]').val()
    //产品归属人
    let bizzOwnerIds = []
    let bizzOwnerContents = formSelects.value('shopee_cnsc_selectMan')
    for (let i = 0; i < bizzOwnerContents.length; i++) {
      bizzOwnerIds.push(bizzOwnerContents[i].val)
    }
    data.bizzOwnerIds = bizzOwnerIds.join(',')
    data.isSale = $('#shopee_cnsc_searchForm select[name=isSale]').val()
    data.listingAbleEnum = $('#shopee_cnsc_searchForm select[name=listingAbleEnum]').val()
    data.shopeeCnscCategoryId = $('#shopee_cnsc_searchForm input[name=shopeeCnscCategoryId]').val()
    data.shopeeCnscCategoryName = $('#shopee_cnsc_searchForm input[name=shopeeCnscCategoryName]').val()
    return data
  }

  $('#shopee_cnsc_searchBtn').click(function () {
    let shopee_extra_info_form_data = getEeSearchData()
    shopee_cnsc_extra_info_table_render(shopee_extra_info_form_data)
  })

  // 批量同步
  $('#shopee_cnsc_batchSyncBtn').click(function () {
    let {data} = table.checkStatus('shopee_cnsc_table')
    if(!data.length) return layer.msg('请选择数据',{icon:7})
    let params = {
      prodPIds :data.map(item=>item.prodPId),
      isFilterCategoryNotAdjustedListing: $('#shopeeExtraInfoCard').find('input[name=isFilterCategoryNotAdjustedListing]').prop('checked'),
      isCheckAvaliableLogistics: $('#shopeeExtraInfoCard').find('input[name=isCheckAvaliableLogistics]').prop('checked'),
    }
    // 区间两个框要么都填，要么都不填
    const minSales = $('#shopeeExtraInfoCard').find('input[name=minSales]').val()
    const maxSales = $('#shopeeExtraInfoCard').find('input[name=maxSales]').val()
    let url = '/lms/shopee/shopeeCnscExtraInfo/batchSync'
    if(minSales!=='' || maxSales!==''){
      if(minSales==='') return layer.msg('请填写店铺7日销量',{icon:7})
      if(maxSales==='') return layer.msg('请填写店铺7日销量',{icon:7})
      if(Number(minSales) > Number(maxSales)) return layer.msg('请填写正确',{icon:7})
      params.minSales = Number(minSales)
      params.maxSales = Number(maxSales)
      url = `/lms/shopee/shopeeCnscExtraInfo/batchSync`
    }
    commonReturnPromise({
      url,
      contentType: 'application/json',
      type: 'post',
      params: JSON.stringify({...params}),
    }).then(res=>{
      layer.msg(res,{icon:1})
    })
  })

  // 批量修改
  $('#shopee_cnsc_batchUpdateBtn').click(function () {
    let cateId = $('#shopee_cnsc_searchForm input[name=cateId]').val()
    let checkStatus = table.checkStatus('shopee_cnsc_table')
    let prodListingAssiDataShopeeCnscInfos = []
    for (let item of checkStatus.data) {
      let prodListingAssiDataShopeeCnscInfo = {}
      if (item.id) {
        prodListingAssiDataShopeeCnscInfo.id = item.id
      } else {
        prodListingAssiDataShopeeCnscInfo.id = null
      }
      prodListingAssiDataShopeeCnscInfo.prodPId = item.prodPId
      prodListingAssiDataShopeeCnscInfos.push(prodListingAssiDataShopeeCnscInfo)
    }
    if (prodListingAssiDataShopeeCnscInfos.length > 0) {
      layer.open({
        type: 1,
        title: 'shopeeCNSC补充信息',
        content: $('#shopee_cnsc_editAssiDataTpl').html(),
        btn: ['保存', '取消'],
        area: ['60%', '80%'],
        success: function (layero, index) {
          // shopeeCnsc类目树
          $(layero).find('#shopee_cnsc_cateIdBtn').click(function () {
            shopeeCnscExtraInfoChooseCate('shopee_cnsc_cateSelEvent', 'shopee_cnsc_cateId', 'shopee_cnsc_cateText', '/shopee/shopeeCnscExtraInfo/searchCates', '/shopee/shopeeCnscExtraInfo/searchCates')
          })
          $('#shopee_cnsc_cateText').change(function () {
            attrDomNameArray = []
            initSpecificAttr($('#shopee_cnsc_cateId').val(), null)
          })
          $(layero).find('#shopee_cnsc_cateSearch').click(function () {
            let sourceDom = $(this)
            layer.open({
              type: 1,
              title: '搜索shopeeCNSC分类',
              content: $('#shopee_cnsc_cateSearchTpl').html(),
              area: ['65%', '60%'],
              success: function (layero, index) {
                //搜索事件
                $(layero).find('input[name=sourceBtnId]').val(sourceDom.attr('id'))
                $(layero).find('input[name="title"]').focus()
                $(layero).find('button').click(function () {
                  let searchKey = $(layero).find('input[name=\'title\']').val()
                  table.render({
                    elem: '#shopee_cnsc_cateSearchTable', url: ctx + '/shopee/shopeeCnscExtraInfo/searchShopeeCateCnsc' //数据接口
                    , where: {
                      searchKey: searchKey
                    }, method: 'post', page: false, cols: [[ //表头
                      { field: 'categoryId', title: '类目ID', width: '10%' }, {
                        field: 'fullCateName',
                        title: '类目',
                        width: '80%'
                      }, { field: 'displayCategoryName' }, {
                        field: '',
                        title: '操作',
                        width: '10%',
                        templet: '<div><a data-id="{{d.categoryId}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'
                      }]], done: function (res) {
                      $('[data-field=\'displayCategoryName\']').css('display', 'none')
                      $(layero).find('.selectCategory').click(function () {
                        let $shopeeCnscCateText = $('#shopee_cnsc_cateText')
                        let sourceBtnId = $(layero).find('input[name=sourceBtnId]').val()
                        if (sourceBtnId === 'shopee_cnsc_cateSearch') {
                          $('#shopee_cnsc_cateId').val($(this).data('id'))
                          // 现在又要显示全路径
                          $shopeeCnscCateText.html($(this).parents('tr').find('td[data-field=fullCateName] div').html())
                          $shopeeCnscCateText.trigger('change')
                        }
                        layer.close(index)
                      })
                    }
                  })
                })
                //如果currentTitle有值，默认搜索
                if (currentTitle) {
                  $(layero).find('input[name="title"]').val(currentTitle)
                  $(layero).find('button').trigger('click')
                }
                $(layero).find('input[name="title"]').on('keypress', function (e) {
                  $(layero).find('button').trigger('click')
                  e.preventDefault()
                  e.stopPropagation()
                })
              },
            })
          })
          form.render()
        },
        yes: function (index, layero) {
          let $shopeeCnscEditAssiDataForm = $('#shopee_cnsc_editAssiDataForm .shopeeCateSpecifics .layui-card-body .attrs .layui-form-item')
          // 规格信息
          let specs = []
          /**
           obj = {
              attributeId,
              inputType,
              formatType,
              displayAttributeName,
              isMandatory: isMandatory === 1,
              originalAttributeName: originalAttributeName,
              classname: `[name=${attributeId}]`
            }
           */
          if (attrDomNameArray) {
            attrDomNameArray = distinctUniqueAttributeIdObjArray(attrDomNameArray)
            console.log(attrDomNameArray)
            for (let obj of attrDomNameArray) {
              let originalAttributeName = obj.originalAttributeName
              let displayAttributeName = obj.displayAttributeName
              let attributeId = obj.attributeId
              let classname = obj.classname
              let inputType = obj.inputType
              let isMandatory = obj.isMandatory
              let formatType = obj.formatType
              let value
              let tempAttributeId = '' + attributeId
              let spec
              switch (inputType) {
                // 单选输入
                case 'COMBO_BOX':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    let valueId = $shopeeCnscEditAssiDataForm.find(classname).next().find(`[value="${value}"]`).attr('data-id') || 0
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: +valueId, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                // 单选
                case'DROP_DOWN':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    let valueId = $shopeeCnscEditAssiDataForm.find(classname).find(`[value="${value}"]`).attr('data-id')
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: +valueId, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                case'TEXT_FILED':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: 0, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                // 多选
                case'MULTIPLE_SELECT_COMBO_BOX':
                const attrValues = [];
                const checkedMultipleComboList = $shopeeCnscEditAssiDataForm.find(
                  `input[name='${tempAttributeId}']:checked`
                );
                const comboAttrValue = $shopeeCnscEditAssiDataForm
                  .find(`input[name='combo-${tempAttributeId}']`)
                  .val();
                if (checkedMultipleComboList.length || comboAttrValue !== "") {
                  checkedMultipleComboList.each(function () {
                    attrValues.push({
                      valueId: +$(this).data("id"),
                      originalValueName: $(this).val(),
                    });
                  });
                  if (comboAttrValue !== "") {
                    attrValues.push({
                      valueId: 0,
                      originalValueName: comboAttrValue,
                    });
                  }
                  if (isMandatory) {
                    if (attrValues.length === 0) {
                      layer.msg(`${originalAttributeName}必填项不能为空`);
                      return;
                    }
                  }
                  spec = {
                    displayAttributeName,
                    originalAttributeName,
                    attributeId,
                    inputType,
                    isMandatory,
                    attrValues,
                  };
                  let $attributeUnit = $shopeeCnscEditAssiDataForm.find(
                    `[name="unit-${attributeId}"]`
                  );
                  spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : "";
                  if (
                    formatType === "QUANTITATIVE" &&
                    spec.attributeUnit === "" &&
                    spec.attrValues.length > 0
                  ) {
                    layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 });
                    return;
                  }
                  specs.push(spec);
                }
                  break
                case'MULTIPLE_SELECT':
                  value = formSelects.value(tempAttributeId)
                  let $select = $shopeeCnscEditAssiDataForm.find(`[xm-select=${tempAttributeId}]`)
                  if (value && value.length > 0) {
                    let attrValues = []
                    for (let v of value) {
                      let valueOption = $select.find(`[value="${v.name}"]`)
                      let valueId = valueOption.attr('data-id')
                      let attrValue = {
                        valueId: +valueId, originalValueName: v.name
                      }
                      attrValues.push(attrValue)
                    }
                    if (isMandatory) {
                      if (attrValues.length === 0) {
                        layer.msg(`${originalAttributeName}必填项不能为空`)
                        return
                      }
                    }
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                default:
                  break
              }
            }
            console.log(specs)
            // 存json
            // if (specs.length > 0) {
              // 封装specific
              specs = distinctUniqueAttributeIdObjArray(specs)
              let data = {
                prodListingAssiDataShopeeCnsc: {
                  categoryId: $('#shopee_cnsc_cateId').val(), specifics: JSON.stringify(specs)
                }, prodListingAssiDataShopeeCnscInfos
              }
              // console.log(specs)
              // console.log(data)
              request.sendAjax(`/shopee/shopeeCnscExtraInfo/batchSaveOrUpdate`, JSON.stringify(data), res => {
                layer.close(index)
                layer.msg('保存成功', { icon: 1 })
                shopee_cnsc_extra_info_table_render(getEeSearchData())
                attrDomNameArray = []
              }, 'POST')
            // } else {
            //   layer.msg('分类属性值不能为空')
            // }
          }
        }
      })
    } else {
      layer.msg('请至少选择1条数据')
      return
    }
  })

// 删除
  $('#shopee_cnsc_delBtn').click(function () {
    let checkStatus = table.checkStatus('shopee_cnsc_table')
    let ids = []
    for (let i = 0; i < checkStatus.data.length; i++) {
      if (checkStatus.data[i].id) {
        ids.push(checkStatus.data[i].id)
      }
    }
    if (ids.length > 0) {
      layer.confirm('删除选中的' + ids.length + '个商品补充信息', { icon: 3, title: '删除' }, function (index) {
        request.sendAjax(`/shopee/shopeeCnscExtraInfo/batchRemove/${ids}`, null, res => {
          layer.close(index)
          layer.msg('删除成功', { icon: 1 })
          shopee_cnsc_extra_info_table_render(getEeSearchData())
        }, 'POST')
      })
    } else {
      layer.msg('请选择已经绑定的列', { icon: 3 })
    }
  })


// 查询类目
  function shopeeCnscExtraInfoChooseCate (id, inputId, divId, cateUrl, cateSearchUrl, func) {
    admin.itemCat_select(id, inputId, divId, cateUrl, cateSearchUrl, function (callback, conf) {
      if (func) {
        func(callback, conf)
      } else {
        $('#' + divId).text(conf.replace(/\([^\)]*\)/g, ''))
      }
    })
  }

// 用来存放分类属性信息 用来获取得到的值
  let attrDomNameArray = []
//监听工具条  table.on('tool(shopee_cnsc_table-filter)', function (obj) {
  table.on('tool(shopee_cnsc_table-filter)', function (obj) {
    // 获得当前行数据
    let data = obj.data
    console.log(data, '列数据')
    // 获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
    let layEvent = obj.event
    // 获得当前行 tr 的DOM对象
    let tr = obj.tr
    let cnsc_categoryId = data.categoryId
    let fullCateName = data.fullCateName
    let specifics = data.specifics
    let id = data.id
    let prodPId = data.prodPId
    //修改||添加
    if (layEvent === 'et_editAssiData_cnsc') {
      currentTitle = data.keyword
      layer.open({
        type: 1,
        title: 'shopeeCNSC补充信息',
        content: $('#shopee_cnsc_editAssiDataTpl').html(),
        btn: ['保存', '取消'],
        area: ['70%', '90%'],
        success: function (layero, index) {
          //类目赋值
          if (cnsc_categoryId) {
            $('#shopee_cnsc_cateId').val(cnsc_categoryId)
            $('#shopee_cnsc_cateText').html(fullCateName)
          }
          // shopeeCnsc类目与specifics处理
          $(layero).find('#shopee_cnsc_cateIdBtn').click(function () {
            shopeeCnscExtraInfoChooseCate('shopee_cnsc_cateSelEvent', 'shopee_cnsc_cateId', 'shopee_cnsc_cateText', '/shopee/shopeeCnscExtraInfo/searchCates', '/shopee/shopeeCnscExtraInfo/searchCates')
          })
          // 右侧搜索按钮
          $(layero).find('#shopee_cnsc_cateSearch').click(function () {
            let sourceDom = $(this)
            layer.open({
              type: 1,
              title: '搜索shopeeCNSC分类',
              content: $('#shopee_cnsc_cateSearchTpl').html(),
              area: ['65%', '60%'],
              success: function (layero, index) {
                //搜索事件
                $(layero).find('input[name=sourceBtnId]').val(sourceDom.attr('id'))
                $(layero).find('input[name="title"]').focus()
                $(layero).find('button').click(function () {
                  let searchKey = $(layero).find('input[name=\'title\']').val()
                  table.render({
                    elem: '#shopee_cnsc_cateSearchTable', url: ctx + '/shopee/shopeeCnscExtraInfo/searchShopeeCateCnsc' //数据接口
                    , where: {
                      searchKey: searchKey
                    }, method: 'post', page: false, cols: [[ //表头
                      { field: 'categoryId', title: '类目ID', width: '10%' }, {
                        field: 'fullCateName',
                        title: '类目',
                        width: '80%'
                      }, { field: 'displayCategoryName' }, {
                        field: '',
                        title: '操作',
                        width: '10%',
                        templet: '<div><a data-id="{{d.categoryId}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'
                      }]], done: function (res) {
                      $('[data-field=\'displayCategoryName\']').css('display', 'none')
                      $(layero).find('.selectCategory').click(function () {
                        let $shopeeCnscCateText = $('#shopee_cnsc_cateText')
                        let sourceBtnId = $(layero).find('input[name=sourceBtnId]').val()
                        if (sourceBtnId === 'shopee_cnsc_cateSearch') {
                          $('#shopee_cnsc_cateId').val($(this).data('id'))
                          // 现在又要显示全路径
                          $shopeeCnscCateText.html($(this).parents('tr').find('td[data-field=fullCateName] div').html())
                          $shopeeCnscCateText.trigger('change')
                        }
                        layer.close(index)
                      })
                    }
                  })
                })
                //如果currentTitle有值，默认搜索
                if (currentTitle) {
                  $(layero).find('input[name="title"]').val(currentTitle)
                  $(layero).find('button').trigger('click')
                }
                $(layero).find('input[name="title"]').on('keypress', function (e) {
                  $(layero).find('button').trigger('click')
                  e.preventDefault()
                  e.stopPropagation()
                })
              },
            })
          })
          $('#shopee_cnsc_cateText').change(function () {
            attrDomNameArray = []
            initSpecificAttr($('#shopee_cnsc_cateId').val(), null)
          })
          // 已选择分类
          if ($('#shopee_cnsc_cateId').val()) {
            attrDomNameArray = []
            initSpecificAttr($('#shopee_cnsc_cateId').val(), specifics)
          }
          // 未选择分类
          else {
            // $.ajax({
            //   type: 'post',
            //   url: ctx + '/shopee/shopeeCnscExtraInfo/getExistSpecifics',
            //   async: true,
            //   data: { prodPId: prodPId },
            //   dataType: 'json',
            //   success: function (returnData) {
            //     if (returnData.code != '0000') {
            //       layer.msg(returnData.msg)
            //     } else {
            //       if (returnData.data != null) {
            //         $('#shopee_cnsc_cateId').val(returnData.data.categoryId)
            //         // 现在又要显示全路径
            //         $('#shopee_cnsc_cateText').html(returnData.data.fullCateName)
            //         initSpecificAttr(returnData.data.categoryId, null)
            //       }
            //     }
            //   }
            // })
          }

          form.render()
        },
        yes: function (index, layero) {
          let $shopeeCnscEditAssiDataForm = $('#shopee_cnsc_editAssiDataForm .shopeeCateSpecifics .layui-card-body .attrs .layui-form-item')
          // 规格信息
          let specs = []
          if (attrDomNameArray) {
            attrDomNameArray = distinctUniqueAttributeIdObjArray(attrDomNameArray)
            // console.log(attrDomNameArray)
            for (let obj of attrDomNameArray) {
              let originalAttributeName = obj.originalAttributeName
              let displayAttributeName = obj.displayAttributeName
              let attributeId = obj.attributeId
              let classname = obj.classname
              let inputType = obj.inputType
              let isMandatory = obj.isMandatory
              let formatType = obj.formatType
              let value
              let tempAttributeId = '' + attributeId
              let spec
              switch (inputType) {
                // 单选输入
                case 'COMBO_BOX':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    let valueId = $shopeeCnscEditAssiDataForm.find(classname).next().find(`[value="${value}"]`).attr('data-id') || 0
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: +valueId, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                // 单选
                case 'DROP_DOWN':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    let valueId = $shopeeCnscEditAssiDataForm.find(classname).find(`[value="${value}"]`).attr('data-id')
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: +valueId, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                case 'TEXT_FILED':
                  value = $shopeeCnscEditAssiDataForm.find(classname).val()
                  if (isMandatory) {
                    if (value === '' || value === undefined) {
                      layer.msg(`${originalAttributeName}必填项不能为空`)
                      return
                    }
                  }
                  if (value !== '' && value !== undefined) {
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues: [{
                        valueId: 0, originalValueName: value
                      }]
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                // 多选
                case 'MULTIPLE_SELECT_COMBO_BOX':
                  const attrValues = [];
                  const checkedMultipleComboList = $shopeeCnscEditAssiDataForm.find(
                    `input[name='${tempAttributeId}']:checked`
                  );
                  const comboAttrValue = $shopeeCnscEditAssiDataForm
                    .find(`input[name='combo-${tempAttributeId}']`)
                    .val();
                  if (checkedMultipleComboList.length || comboAttrValue !== "") {
                    checkedMultipleComboList.each(function () {
                      attrValues.push({
                        valueId: +$(this).data("id"),
                        originalValueName: $(this).val(),
                      });
                    });
                    if (comboAttrValue !== "") {
                      attrValues.push({
                        valueId: 0,
                        originalValueName: comboAttrValue,
                      });
                    }
                    if (isMandatory) {
                      if (attrValues.length === 0) {
                        layer.msg(`${originalAttributeName}必填项不能为空`);
                        return;
                      }
                    }
                    spec = {
                      displayAttributeName,
                      originalAttributeName,
                      attributeId,
                      inputType,
                      isMandatory,
                      attrValues,
                    };
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(
                      `[name="unit-${attributeId}"]`
                    );
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : "";
                    if (
                      formatType === "QUANTITATIVE" &&
                      spec.attributeUnit === "" &&
                      spec.attrValues.length > 0
                    ) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 });
                      return;
                    }
                    specs.push(spec);
                  }
                  break
                case 'MULTIPLE_SELECT':
                  value = formSelects.value(tempAttributeId)
                  let $select = $shopeeCnscEditAssiDataForm.find(`[xm-select="${tempAttributeId}"]`)
                  if (value && value.length > 0) {
                    let attrValues = []
                    for (let v of value) {
                      let valueOption = $select.find(`[value="${v.name}"]`)
                      let valueId = valueOption.attr('data-id')
                      let attrValue = {
                        valueId: +valueId, originalValueName: v.name
                      }
                      attrValues.push(attrValue)
                    }
                    if (isMandatory) {
                      if (attrValues.length === 0) {
                        layer.msg(`${originalAttributeName}必填项不能为空`)
                        return
                      }
                    }
                    spec = {
                      displayAttributeName, originalAttributeName, attributeId, inputType, isMandatory, attrValues
                    }
                    let $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${attributeId}"]`)
                    spec.attributeUnit = $attributeUnit ? $attributeUnit.val() : ''
                    if (formatType === 'QUANTITATIVE' && spec.attributeUnit === '' && spec.attrValues.length > 0) {
                      layer.msg(`${displayAttributeName}请选择单位`, { icon: 2 })
                      return
                    }
                    specs.push(spec)
                  }
                  break
                default:
                  break
              }
            }
            console.log(specs)
            // 存json
            // if (specs.length > 0) {
              // 封装specific
              specs = distinctUniqueAttributeIdObjArray(specs)
              let data = {
                id, prodPId, categoryId: $('#shopee_cnsc_cateId').val(), specifics: JSON.stringify(specs)
              }
              // console.log(specs)
              // console.log(data)
              request.sendAjax(`/shopee/shopeeCnscExtraInfo/saveOrUpdate`, JSON.stringify(data), res => {
                layer.close(index)
                layer.msg('保存成功', { icon: 1 })
                shopee_cnsc_extra_info_table_render(getEeSearchData())
                attrDomNameArray = []
              }, 'POST')
            // } else {
            //   layer.msg('分类属性值不能为空')
            // }

          }
        }
      })
    }
  })

// 初始化属性列表
  function initSpecificAttr (cateId, specifics) {
    if (!cateId) {
      return
    }
    request.sendAjax(`/shopee/shopeeCnscExtraInfo/listShopeeCateCnscSpecifics/${cateId}`, null, res => {
      layui.admin.load.hide()
      let attrLst = res.data.sort(sortBy('isMandatory', false))
      let $shopeeCnscEditAssiDataForm = $('#shopee_cnsc_editAssiDataForm .shopeeCateSpecifics .layui-card-body .attrs')
      $shopeeCnscEditAssiDataForm.empty()
      let attValueHtml = ''
      for (let attr of attrLst) {
        // 展示元素
        let isMandatory = attr.isMandatory, // 属性名
          originalAttributeName = attr.originalAttributeName, // 展示属名
          displayAttributeName = attr.displayAttributeName, // Json字符串
          attributeValueList_json = attr.attributeValueList, // 输入类型
          inputType = attr.inputType, // 值类型
          inputValidationType = attr.inputValidationType, // 属性符号
          attributeUnitListJson = attr.attributeUnit, formatType = attr.formatType, // 属性id
          attributeId = attr.attributeId
        let isMust = isMandatory === 1
        let attributeValues = []
        if (attributeValueList_json !== '') {
          attributeValues = JSON.parse(attributeValueList_json)
        }
        let obj = {
          attributeId,
          inputType,
          formatType,
          displayAttributeName,
          isMandatory: isMandatory === 1,
          originalAttributeName: originalAttributeName,
          classname: `[name=${attributeId}]`
        }
        attrDomNameArray.push(obj)
        let attributeUnitList = []
        console.log(attributeUnitListJson)
        if (formatType === 'QUANTITATIVE') {
          attributeUnitList = JSON.parse(attributeUnitListJson)
          // console.log(attributeUnitList)
        }
        // 根据不同类型进行动态渲染
        switch (inputType) {
          case 'COMBO_BOX':
            attValueHtml += '<div class="layui-form-item">'
            if (isMust) {
              attValueHtml += '<label class="layui-form-label attr-w-400"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            } else {
              attValueHtml += '<label class="layui-form-label attr-w-400">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            }
            attValueHtml += '<div class="layui-input-inline">' + '<input type="text" class="layui-input" name="' + attributeId + '" list="attrValueList' + attributeId + '">' + '<datalist id="attrValueList' + attributeId + '">'
            for (let item of attributeValues) {
              attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '">' + item.displayValueName + '</option>'
            }
            attValueHtml += '</datalist></div>'
            if (formatType === 'QUANTITATIVE') {
              attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
              for (let unit of attributeUnitList) {
                attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
              }
              attValueHtml += '</select></div>'
            }
            attValueHtml += '</div>'
            break
          case 'DROP_DOWN':
            attValueHtml += '<div class="layui-form-item">'
            if (isMust) {
              attValueHtml += '<label class="layui-form-label attr-w-400"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            } else {
              attValueHtml += '<label class="layui-form-label attr-w-400">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            }
            attValueHtml += '<div class="layui-input-inline">' + '<select name="' + attributeId + '"><option value="">请选择</option>'
            for (let item of attributeValues) {
              attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '">' + item.displayValueName + '</option>'
            }
            attValueHtml += '</select></div>'
            if (formatType === 'QUANTITATIVE') {
              attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
              for (let unit of attributeUnitList) {
                attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
              }
              attValueHtml += '</select></div>'
            }
            attValueHtml += '</div>'
            break
          case 'TEXT_FILED':
            attValueHtml += '<div class="layui-form-item">'
            if (isMust) {
              attValueHtml += '<label class="layui-form-label attr-w-400"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            } else {
              attValueHtml += '<label class="layui-form-label attr-w-400">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            }
            attValueHtml += '<div class="layui-input-inline">'
            switch (inputValidationType) {
              case 'INT_TYPE':
                attValueHtml += '<input  name="' + attributeId + '" value="" type="number" class="layui-input canChangeInput" lay-verify="Integer"/>'
                break
              case 'FLOAT_TYPE':
                attValueHtml += '<input  name="' + attributeId + '" value="" type="number" class="layui-input canChangeInput" />'
                break
              default:
                attValueHtml += '<input  name="' + attributeId + '" value="" type="text" class="layui-input canChangeInput" />'
                break
            }
            attValueHtml += '</div>'
            if (formatType === 'QUANTITATIVE') {
              attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
              for (let unit of attributeUnitList) {
                attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
              }
              attValueHtml += '</select></div>'
            }
            attValueHtml += '</div>'
            break
          case 'MULTIPLE_SELECT_COMBO_BOX':
            attValueHtml += '<div class="layui-form-item" class="disflex">'
            if (isMust) {
              attValueHtml += '<label class="layui-form-label attr-w-400"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            } else {
              attValueHtml += '<label class="layui-form-label attr-w-400">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            }
            attValueHtml += '<div class="layui-input-inline">'
            for (let item of attributeValues) {
              attValueHtml += `<input type="checkbox" name="${attributeId}" value="${item.originalValueName}" data-id="${item.valueId}" title="${item.displayValueName}" lay-skin="primary"> `
            }
            attValueHtml += '<div class="layui-input-inline mt05 mb10" style="float: none">'
            +`<input type="text" name="combo-${attributeId}" class="layui-input canChangeInput" placeholder="自定义属性">`
            +'</div>'
            if (formatType === 'QUANTITATIVE') {
              attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
              for (let unit of attributeUnitList) {
                attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
              }
              attValueHtml += '</select></div>'
            }
            attValueHtml += '</div>'
            break
          case 'MULTIPLE_SELECT':
            attValueHtml += '<div class="layui-form-item">'
            if (isMust) {
              attValueHtml += '<label class="layui-form-label attr-w-400"><font class="fRed">*</font>' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            } else {
              attValueHtml += '<label class="layui-form-label attr-w-400">' + displayAttributeName + '(' + originalAttributeName + ')' + '</label>'
            }
            attValueHtml += '<div class="layui-input-inline">' + ' <select  name="' + attributeId + '" xm-select="' + attributeId + '" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"><option value="">请选择</option>'
            for (let item of attributeValues) {
              attValueHtml += '<option data-id="' + item.valueId + '" value="' + item.originalValueName + '" >' + item.displayValueName + '</option>'
            }
            attValueHtml += '</select></div>'
            if (formatType === 'QUANTITATIVE') {
              attValueHtml += '<div class="layui-input-inline" style="width: 100px"><select name="unit-' + attributeId + '"><option value="">单位</option>'
              for (let unit of attributeUnitList) {
                attValueHtml += '<option  value="' + unit + '">' + unit + '</option>'
              }
              attValueHtml += '</select></div>'
            }
            attValueHtml += '</div>'
            break
          default:
            break
        }
      }
      $shopeeCnscEditAssiDataForm.html(attValueHtml)
      formSelects.render()
      if (specifics) {
        let $shopeeCnscEditAssiDataForm = $('#shopee_cnsc_editAssiDataForm .shopeeCateSpecifics .layui-card-body .attrs .layui-form-item')
        // 有规格值 代表是添加过的
        let hasAddSpecificList = JSON.parse(specifics)
        // console.log(hasAddSpecificList)
        for (let attr of attrLst) {
          let tmp_originalAttributeName = attr.originalAttributeName
          let tempAttributeId = '' + attr.attributeId
          for (let item of hasAddSpecificList) {
            if (item.originalAttributeName === tmp_originalAttributeName) {
              let tmp_inputType = attr.inputType
              let value_list = item.attrValues
              let $attributeUnit
              switch (tmp_inputType) {
                // 单选输入
                case 'DROP_DOWN':
                case 'COMBO_BOX':
                case 'TEXT_FILED':
                  $shopeeCnscEditAssiDataForm.find(`[name=${tempAttributeId}]`).val(value_list[0].originalValueName)
                  $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${tempAttributeId}"]`)
                  if ($attributeUnit) {
                    $attributeUnit.val(item.attributeUnit)
                  }
                  break
                // 多选
                case 'MULTIPLE_SELECT_COMBO_BOX':
                  value_list.forEach(function (item) {
                    $shopeeCnscEditAssiDataForm
                      .find(
                        `input[name='${tempAttributeId}']:checkbox[value="${item.originalValueName}"]`
                      )
                      .attr("checked", "true");
                    item.valueId === 0 &&
                      $shopeeCnscEditAssiDataForm
                        .find(`input[name='combo-${tempAttributeId}']`)
                        .val(item.originalValueName);
                  });
                  if ($attributeUnit) {
                    $attributeUnit.val(item.attributeUnit);
                  }
                  break
                case 'MULTIPLE_SELECT':
                  let m_valueOptions = []
                  value_list.forEach(item => {
                    m_valueOptions.push(item.originalValueName)
                  })
                  formSelects.value(`${tempAttributeId}`, m_valueOptions)
                  $attributeUnit = $shopeeCnscEditAssiDataForm.find(`[name="unit-${tempAttributeId}"]`)
                  if ($attributeUnit) {
                    $attributeUnit.val(item.attributeUnit)
                  }
                  break
                default:
                  break
              }
            }
          }
        }
      }
      // 规格赋值
      form.render()
    }, 'GET')
  }

})

function showProhibitReason (tip, self) {
  let layer = layui.layer
  let index = layer.tips(tip, self, { tips: [1, 'orange'] })
  $(self).attr('data-tipId', index)
}

function removeTip (self) {
  let index = $(self).attr('data-tipId')
  if (index) {
    layui.layer.close(index)
  }
}


function distinctUniqueAttributeIdObjArray (objArray) {
  if (objArray.length > 0) {
    let map = new Map()
    for (let item of objArray) {
      if (!map.has(item.attributeId)) {
        map.set(item.attributeId, item)
      }
    }
    return [...map.values()]
  }
  return []
}

function sortBy (attr, rev) {
  if (rev === undefined) {
    rev = 1
  } else {
    rev = (rev) ? 1 : -1
  }

  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}