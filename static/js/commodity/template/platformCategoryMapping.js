layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate', 'element', 'upload', 'formSelects'], function () {
  var layer = layui.layer,
    admin = layui.admin,
    table = layui.table,
    table1 = layui.table,
    form = layui.form,
    element = layui.element,
    laytpl = layui.laytpl,
    formSelects = layui.formSelects,
    $ = layui.$,
    laydate = layui.laydate;
  // formSelects.render('logisAttr_productlist');
  // formSelects.render('devType_productlist');
  // element.render('collapse');
  // search_productlist('');
  form.render('checkbox');

  // 多选分隔符
  const SeparatorObj = {
    ozon: ';'
  }

  let optionDefault = `<option value=""></option>;`;
  //?发送请求
  let requestAxios = {
    //*查询平台类目
    categoryQuery(category, id, cateName) {
      return axios({
        method: 'post',
        url: '/lms/prodCateOaMapping/searchCates',
        data: {
          platCode: category,
          pcateId: id,
          // cateName: cateName,
          cateTreeName: cateName,
        },
      });
    },
    //*分页查询类目映射
    pageCateQuery(platCode, platCateId, cateOaId, complete, page, limit, ifMapping) {
      return axios({
        url: ctx + '/prodCateOaMapping/pageQuery',
        params: {
          platCode,
          platCateId,
          cateOaId,
          complete,
          page,
          limit,
          ifMapping,
        },
      });
    },
    //*根据oa类目Id查询属性名和属性值
    oaCateAttr(cateId) {
      return axios({
        url: ctx + `/prodCateOa/get/cate/${cateId}/all/info`,
      });
    },
    //*根据platCode和platCateId查询所有属性和属性值
    platAttrValue(platCode, platCateId) {
      return axios({
        url: ctx + '/prodCateOaMapping/getAllCateAttrAndValue',
        method: 'post',
        data: {
          platCode,
          platCateId,
        },
      });
    },
    //*新增|修改类目映射(映射处理)
    addCateMap(addmap) {
      return axios({
        url: ctx + '/prodCateOaMapping/addOrUpdateMapping',
        method: 'post',
        data: addmap,
      });
    },
    //*根据Oa类目ID查询所有映射内容
    queryMap(cateOaId, platCode) {
      return axios({
        url: ctx + `/prodCateOaMapping/get/mapping/cate/${cateOaId}/plat/${platCode}`,
      });
    },
    //*根据平台code以及OA属性ID进行推送属性值填充最多的选项返回
    recommendedValue(cateOaAttrId, platCode, platCateAttrInputTypeEnum) {
      return axios({
        url: ctx + `/prodCateOaMapping/getRecommendedPlatCateAttrValues`,
        method: 'post',
        data:{
          cateOaAttrId,
          platCode,
          platCateAttrInputTypeEnum
        }
      })
    }
  };
  //?数据仓库
  let store = {
    plat: '',
    OAName: '',
    OATreeName: '',
    platTreeName: '',
    platName: '',
  };
  // console.log($('select [name=plat]'));
  //渲染修改人和排序方式-ztt20230607
  commonReturnPromise({
    url: '/lms/prodCateOaMapping/getInitParam?platCode=shopee',
  }).then(res => {
    //修改人modifier
    commonRenderSelect('pfcm_modifier', res.modifier || [], {
      name: 'modifier', code: 'modifierId'
    }).then(()=> {
      formSelects.render('xm_pfcm_modifier');
    })
    //排序方式orderby-默认增序
    commonRenderSelect('pfcm_orderBy', res.orderBy || [], {
      name: 'name', code: 'value', str: '',
    });
    form.render('select');
  });
  //修改虾皮在线listing-ztt20230607
  $('#pfcm_editShopeeListing').on('click', function(){
    let checkStatus = layui.table.checkStatus('pcm_sProdTableId');
    if(checkStatus.data.length == 0){
      return layer.msg('请先选择需要修改的数据', {icon: 7});
    }
    let oaNewCateIdList = checkStatus.data.map(item => item.id);
    let $parent = $('#pcm_productlistCard');
    let minSales = $parent.find('[name=minSales]').val();
    let maxSales = $parent.find('[name=maxSales]').val();
    let isFilterCategoryNotAdjustedListing = $parent.find('[name=isFilterCategoryNotAdjustedListing]').is(':checked');
    let isCheckAvaliableLogistics =  $parent.find('[name=isCheckAvaliableLogistics]').is(':checked');
    let obj = {
      minSales: minSales,
      maxSales: maxSales,
      isFilterCategoryNotAdjustedListing: isFilterCategoryNotAdjustedListing,
      isCheckAvaliableLogistics,
      oaNewCateIdList: oaNewCateIdList
    };
    commonReturnPromise({
      url: '/lms/shopee/shopeeCateMapping/batchUpdateItemCateByOaNewCateId',
      type: 'post',
      contentType: 'application/json',
      params: JSON.stringify(obj)
    }).then(res => {
      layer.msg(res || '修改成功', {icon: 1});
    })
  });
  //* 更换平台触发
  form.on('select(platchoose)', function (data) {
    // console.log(data);
    // console.log($('#pcm_sProdTable'));
    $('#pcm_sProdTable').html('');
    $('.layui-form.layui-border-box.layui-table-view').html('')
    // table.reload('pcm_sProdTable')
    //#region 如果是虾皮平台,那么触发对应选项显示-ztt20230607改
    if(data.value == 'shopee'){
      $('.showForShopee').removeClass('disN');
    }else{
      $('.showForShopee').addClass('disN');
      $('#pfcm_orderBy').val('');
      $('#pfcm_modifier').val('');
      $('#pcm_productlistCard .layui-card-header').find('input').val('');
      $('#pcm_productlistCard .layui-card-header').find('[name=isFilterCategoryNotAdjustedListing]').prop('checked', false);
      $('#pcm_productlistCard .layui-card-header').find('[name=isCheckAvaliableLogistics]').prop('checked', false);
      form.render('select');
      form.render('checkbox');
      formSelects.render('xm_pfcm_modifier');
    }
    //#endregion
  });

  //?点击事件
  //*平台点击事件
  $('#pcm_plat_searchCate_btn').click(async function () {
    let plat = $('#pcm_searchBtnForm select[name=plat]').val();
    if (plat.length <= 3) {
      return layer.msg('请选择平台！');
    }
    store.plat = plat;
    cateLayerOpen(plat, 'layer_work_develop_pl', 'platCategory', '#itemCat_input');
  });
  //*OA类目点击事件
  $('#pcm_searchCate_btn').click(async function () {
    let plat = $('#pcm_searchBtnForm select[name=plat]').val();
    if(plat == 'shopee'){
      window.localStorage.setItem('platformCategoryPlat', 'shopee');
    }else{
      window.localStorage.setItem('platformCategoryPlat', '');
    }
    cateLayerOpen('oa', 'layer_work_develop_pl', 'OAnewCategory', '#itemCat_input');
  });
  //*OA清空按钮
  $('#pcm_searchReset').click(function () {
    store = {};
    $('#pcm_searchBtnForm')[0].reset();
    $("#pcm_searchBtnForm input[type='hidden']").val('');
    $('#platCategory').html('');
    $('#OAnewCategory').html('');
    $('#pcm_searchBtnForm .showForShopee').addClass('disN');
  });
  //*平台清除按钮
  $('#clearPlat').click(function () {
    $('#platCateId').val('')
    // console.log(store);
    $('#platCategory').html('');
  });
  //*OA新类目清除按钮
  $('#clearOAnew').click(function () {
    $('#cateOaId').val('')
    store.plat = ''
    $('#OAnewCategory').html('');
  });
  //*搜索点击按钮
  $('#pcm_searchBtn').click(async function () {
    // search_productlist('');
    let modifierArr = layui.formSelects.value('xm_pfcm_modifier');
    let platCode = $('#pcm_searchBtnForm select[name=plat]').val(),
      ifMapping = $('#pcm_searchBtnForm select[name=cate]').val(),
      complete = $('#pcm_searchBtnForm select[name=cateAttr]').val(),
      modifierIdList = modifierArr.map(item => item.val),
      orderBy = $('#pcm_searchBtnForm select[name=orderBy]').val();
    if (platCode.length <= 3) {
      return layer.msg('请选择平台！');
    } else {
      let platCateId = $('#platCateId').val() || '',
        cateOaId = $('#cateOaId').val() || '',
        // arr = [],
        requestobj = {};
        requestobj.platCode = platCode;
      requestobj.platCateId = platCateId;
      requestobj.cateOaId = cateOaId;
      requestobj.complete = complete;
      requestobj.ifMapping = ifMapping;
      requestobj.modifierIdList = modifierIdList.join(',');
      requestobj.orderBy = orderBy;
      store.plat = platCode
      await search_productlist(requestobj);
    }
  });

  //?请求及渲染


  //?弹出框
  //* 映射处理弹出框
  let addflag = true;
  function mappingLayer(cateId, pcateId, datavalue) {
    layer.open({
      title: '映射处理',
      type: 1, //不加该属性,就会出现[object Object]
      area: ['80%', '70%'],
      btn: ['保存', '关闭'],
      content: $('#mapProcessing').html(),
      success: async function (layero) {
        $('#plat_choose').click(async function () {
          let plat = $('#pcm_searchBtnForm select[name=plat]').val();
          await cateLayerOpen(plat, 'layer_work_develop_pl', 'platAttr', '#itemCat_input', renderMapping, store.cateOaAttr);
        });

        addflag = true; //节流
        let plat = $('#pcm_searchBtnForm select[name=plat]').val();
        let originMapping, cateOaAttr;
        if (datavalue) {
          //? 查询是否有映射
          await requestAxios
            .queryMap(cateId, plat)
            .then((res) => {
              if (res.data.code === '0000') {
                originMapping = res.data;
                return;
              } else {
                store.originMapping = {};
                // layer.msg(res.data.msg);
                return;
              }
            })
            .catch((err) => {
              store.originMapping = {};
              layer.closeAll()
              return layer.msg('请重新选择平台');
            });
        }

        //? 查询点击的OA是否有属性值和属性名
        await requestAxios
          .oaCateAttr(cateId)
          .then((res) => {
            if (res.data.code === '0000') {
              cateOaAttr = res.data;
              return;
            } else {
              layer.msg(res.data.msg);
              return;
            }
          })
          .catch((err) => {
            return layer.msg(err.response.data.msg);
          });
        originMapping = originMapping == undefined ? false: originMapping;
        originMapping = originMapping.data;
        // cateOaAttr = originMapping==undefined?false: cateOaAttr;
        cateOaAttr = cateOaAttr.data;
        // console.log('OA属性值', cateOaAttr);
        // console.log('映射处理', originMapping);
        // let platAttrlist;
        if (originMapping) {
          store.originMapping = JSON.parse(JSON.stringify(originMapping));
          let showData = {
            platCode: plat,
            platCateId: originMapping.platCateId,
          }
          commonReturnPromise({
            url: ctx + '/prodCateOaMapping/getAllCateAttrAndValue',
            type: 'post',
            params: JSON.stringify(showData),
            contentType: 'application/json',
          }).then((platAttrlist)=>{
            let platUnitList = platAttrlist.platUnitList || [] // 平台属性单位

            localStorage.setItem('storePlatAttrlist', JSON.stringify(platAttrlist))
            if (cateOaAttr && cateOaAttr.length) {
              // console.log('有映射有OA');
              renderMapping(cateOaAttr, platAttrlist, originMapping);
              store.cateOaAttr = JSON.parse(JSON.stringify(cateOaAttr));
            } else {
              // console.log('有映射无OA');
              renderMapping(false, platAttrlist, originMapping);
              store.cateOaAttr = false;
            }
          })
        } else {
          store.originMapping = false;
          if (cateOaAttr && cateOaAttr.length) {
            // console.log('无映射有OA');
            store.cateOaAttr = JSON.parse(JSON.stringify(cateOaAttr));
            // renderMapping(cateOaAttr, plat, originMapping);
          } else {
            // console.log('无映射无OA');
            store.cateOaAttr = false;
            // renderMapping(cateOaAttr, plat, originMapping);
          }
        }
      },
      yes: async function (index) {
        // store.originMapping.data = store.originMapping.data ?? false;
        let reTemporay;
        let request = store.originMapping;
        let cateOaAttr = store.cateOaAttr;
        // let requestStatus = true;
        let OAstatus = true;
        let nullVlaue = false;
        let addData;
        if (store.addmap) {
          addData = JSON.parse(JSON.stringify(store.addmap));
        }
        let mandatory = true;
        addData.platCateId = $('#plat_chooseid_inp').val();
        addData.platCateName = $('#plat_choose_inp').val();
        addData.platCateIds = $('#plat_cateIds_inp').val();
        let platAttr = $('#platAttr').text();
        let arr = platAttr.split('：');
        addData.platCateTreeName = arr[1];
        addData.platCode = $('#pcm_searchBtnForm select[name=plat]').val();
        addData.prodCateOaAttrMappingHandleDTOList = [];
        let platAttrMapOne = Array.from($('#batchplatAttrMapbox .platAttrMapOne'));
        let DTOList = [];
        if (request) {
          addData.id = request.id;
        }
          platAttrMapOne.forEach((v, i) => {
            let temporayObj = {};
            temporayObj.platCateAttrId = $(v).find('#platCateAttrId').val();
            temporayObj.platCateAttr = $(v).find('#platCateAttrName_id').text();
            let valueId;
            if (request) {
              valueId = request.prodCateOaAttrMappingHandleDTOList.filter((v) => v.platCateAttr === temporayObj.platCateAttr)[0];
              if (valueId) {
                temporayObj.id = valueId.id;
              }
            }
            // 通过下拉框的父级是否隐藏判断是不是多选
            let isSingleSelect = $(v).find('#defaultPlatAttrValuesel').parents().css('display') !== 'none'
            //判断是否用直接映射平台属性值
            if ($(v).find('.platAttrMapFour').attr('class').includes('disabled')) {
              //判断是否有平台属性值
              if ($(v).find('.inp').html()) {
                let directMappingValue = $(v).find('.inp input').val();
                let directMappingUnit = $(v).find('.iptmapUnit input').val() || '';
                if (directMappingValue.trim().length <= 0) {
                  if ($(v).find('#platCateAttrName').text().includes('*')) {
                    mandatory = false;
                    return;
                  } else {
                    nullVlaue = true;
                  }
                }
                temporayObj.directMappingValue = directMappingValue;
                temporayObj.directMappingUnit = directMappingUnit;
              } else {
                let directMappingValue = ''
                if(isSingleSelect){
                  directMappingValue = $(v).find('#defaultPlatAttrValuesel').val(); //!可能会有bug
                }else{
                  const multiSelectsValue = formSelects.value('defaultPlatAttrValueselMulti'+i,'name')
                  directMappingValue = multiSelectsValue.join(SeparatorObj[store.plat]||',')
                }
                let directMappingUnit = $(v).find('#defaultPlatUnitsel').val() || '';
                if (directMappingValue && directMappingValue.length <= 0) {
                  if ($(v).find('#platCateAttrName').text().includes('*')) {
                    mandatory = false;
                    return;
                  } else {
                    nullVlaue = true;
                  }
                }
                temporayObj.directMappingValue = directMappingValue;
                temporayObj.directMappingUnit = directMappingUnit;
              }
              DTOList.push(temporayObj);
              return;
            }
            //判断是否有OA属性值
            if (cateOaAttr && cateOaAttr.length) {
              //有OA batchPlatAttrValue mandatory
              //将每条里面的select或input转为数组
              let batchPlatAttrValue = Array.from($(v).find('tbody #batchPlatAttrValue'));
              //拿到OA属性名ID
              // console.log($(v).find('#cateAttrName option:selected').attr('valueid'));
              temporayObj.cateOaAttrId = $(v).find('#cateAttrName option:selected').attr('valueid');
              let arrTemporay = [];
              batchPlatAttrValue.forEach((value, i) => {
                let oaAttrValueTemporay = {};
                oaAttrValueTemporay.cateOaAttrValue = $(value).parents('tr').find('#OAAttrValue').text();
                oaAttrValueTemporay.cateOaAttrValueId = $(value).parents('tr').find('#OAattrinp').val();

                let OAinnerId;
                if (valueId) {
                  if (valueId.prodCateOaAttrValueMappingList) {
                    OAinnerId = valueId.prodCateOaAttrValueMappingList.filter((v) => v.cateOaAttrValue === oaAttrValueTemporay.cateOaAttrValue)[0];
                    if (OAinnerId) {
                      oaAttrValueTemporay.id = OAinnerId.id;
                    }
                  }
                }
                oaAttrValueTemporay.platAttrUnit = $(value).parents('td').next().find('#batchPlatUnit').val() || $(value).parents('td').next().find('#batchPlatUnitinp').val();
                if(isSingleSelect){ // 单选
                  oaAttrValueTemporay.platAttrValue = $(value).val();
                  oaAttrValueTemporay.platAttrValueId = $(value).find('option:selected').attr('valueid') || '';
                  if ($(value).prev().html() && $(value).prev().html().length) {
                    oaAttrValueTemporay.platAttrValue = $(value).prev().children('input').val()
                    let temporayOPT = Array.from($(value).children('option'))
                    // console.log(temporayOPT.sone((v)=>$(v).attr('value') == oaAttrValueTemporay.platAttrValue));
                    if (temporayOPT.some((v)=>$(v).attr('value') == oaAttrValueTemporay.platAttrValue)) {
                      // console.log('一直');
                    }else {
                      oaAttrValueTemporay.platAttrValueId = ''
                    }
                  }
                }else{ // 多选
                  const multiSelectsId = $(value).parents('tr').find('.batchMapPlat').find('.multiSelectClass').prop('id')
                  oaAttrValueTemporay.platAttrValue = formSelects.value(multiSelectsId,'name').join(SeparatorObj[store.plat]||',')
                  oaAttrValueTemporay.platAttrValueId = ''
                  // oaAttrValueTemporay.platAttrValueId = formSelects.value(multiSelectsId,'val').filter().join(SeparatorObj[store.plat]||',')
                }
                //判断是否填写必填项
                if (!oaAttrValueTemporay.platAttrValue.trim() || !oaAttrValueTemporay.platAttrValue.trim().length) {
                 if (!$(v).find('.platAttrMapFour').attr('class').includes('disabled')) {
                   if ($(v).find('#platCateAttrName').text().includes('*')) {
                         mandatory = false;
                         return;
                       } else {
                         nullVlaue = true;
                       }
                 }
               }
                arrTemporay.push(oaAttrValueTemporay);
              });
              // delete temporayObj.directMappingValue
              temporayObj.directMappingValue = ''
              temporayObj.directMappingUnit = ''
              temporayObj.prodCateOaAttrValueMappingList = arrTemporay;
            } else {
              //无OA
              // 选择映射OA属性名后，platAttrMapFour 列表没有数据
              let textPlatCate = $(v).find('#platCateAttrName_id').text(),
                storePlatAttrlist = JSON.parse(localStorage.getItem('storePlatAttrlist'))
                platAttrlist = storePlatAttrlist.filter((v, i) => v.attrName === textPlatCate)[0];
              // console.log(platAttrlist);
              if (platAttrlist.platCateAttrValueVOList && platAttrlist.platCateAttrValueVOList.length > 1) {
                temporayObj.directMappingValue = $(v).find('#defaultPlatAttrValuesel').val();
                temporayObj.directMappingUnit = $(v).find('#defaultPlatUnitsel').val() || '';
              } else {
                temporayObj.directMappingValue = $(v).find('#defaultPlatAttrValueinp').val();
                temporayObj.directMappingUnit = $(v).find('#defaultPlatUnit').val() || '';
              }
            }
            DTOList.push(temporayObj);
          });
          // DTOList = DTOList.filter((v) => {
          //   return v.directMappingValue !== null;
          // });
          // DTOList = DTOList.filter((v) => {
          //   return v.directMappingValue !== '';
          // });
          // DTOList = DTOList.filter((v) => {
          //   if (v.prodCateOaAttrValueMappingList == undefined) {
          //     return v.prodCateOaAttrValueMappingList != 'aabbcc';
          //   } else {
          //     return v.prodCateOaAttrValueMappingList.length > 0;
          //   }
          // });
          DTOList = DTOList.filter(v => {
            return v.cateOaAttrId || v.directMappingUnit || v.directMappingValue
          })
          addData.prodCateOaAttrMappingHandleDTOList = DTOList;
          reTemporay = addData;
        if (addflag) {
          // if (mandatory) {
            // console.log(reTemporay);
            addflag = false;
            requestAxios
              .addCateMap(reTemporay)
              .then(({ data: res }) => {
                if (res.code === '0000') {
                  layer.close(index);
                  // $('#platCateId').val('')
                  $('#pcm_searchBtn').click();
                  return layer.msg('操作成功');
                } else {
                  addflag = true;
                  return layer.msg(res.msg);
                }
              })
              .catch((err) => {
                addflag = true;
                return layer.msg(err.response.data.msg);
              });
          // } else {
          //   return layer.msg('请检查平台属性名对应映射是否完整');
          // }
        }
       },
      end: function () {
        // store.status = null;
        // $('#platCateId').val('')
        localStorage.removeItem('storePlatAttrlist')
        store.addmap = {};
        store.cateOaAttr = [];
      },
    });
  }

  //* 映射处理渲染
  function renderMapping(cateOaAttr, platAttrlist, originMapping) {
    $('#batchplatAttrMapbox').html(''); //清空克隆节点的盒子，重新装填
    // originMapping 代表列表中是否有 映射平台类目
    if (originMapping) {
      //有映射
      // console.log(originMapping);
      $('#platAttr').html(`平台类目：${originMapping.platCateTreeName}`);
      $('#plat_choose_inp').val(originMapping.platCateName);
      $('#plat_chooseid_inp').val(originMapping.platCateId);
      $('#plat_cateIds_inp').val(originMapping.platCateIds);
      let isMandatory = platAttrlist.filter((v) => v.isMandatory === true); //将必选平台属性值提取出来放到最前面
      let noisMandatory = platAttrlist.filter((v) => v.isMandatory === false);
      platAttrlist = [...isMandatory, ...noisMandatory];
      // console.log(platAttrlist);
      platAttrlist.forEach((platValue, plataIndex) => {
        let _cloneHTML = $('.clone .platAttrMapOne.visibility_hidden').clone(true);
        // console.log(originMapping);
        let platAttrF = originMapping.prodCateOaAttrMappingHandleDTOList.filter((mapvalue) => mapvalue.platCateAttrId == platValue.id)[0]; //拿平台属性和映射属性过滤
        if (store.plat === 'lazada' || store.plat === 'mercado') {
           platAttrF = originMapping.prodCateOaAttrMappingHandleDTOList.filter((mapvalue) => mapvalue.platCateAttr == platValue.attrName)[0]; //拿平台属性和映射属性过滤
        }
        platAttrF = platAttrF == undefined?false:platAttrF; //判断是否有对应的映射值
        $(_cloneHTML).find('.platAttrMapFive').removeClass('disabled'); //打开映射OA属性名
        $(_cloneHTML).find('.platAttrMapThree').removeClass('disabled'); //打开直接默认平台属性值
        
        if (cateOaAttr) {
          //有OA
          let optionHTML = '';
          cateOaAttr.forEach((v, i) => {
            let OAAttrHTML = `<option value="${v.attrName}" valueid="${v.id}">${v.attrName}</option>`;
            optionHTML += OAAttrHTML;
          });
          if (platAttrF) {
            if (platAttrF.prodCateOaAttrValueMappingList && platAttrF.prodCateOaAttrValueMappingList.length) {
              optionHTML = optionHTML.replace(`valueid="${platAttrF.cateOaAttrId}"`, `valueid="${platAttrF.cateOaAttrId}" selected="selected"`);
              $(_cloneHTML).find('.platAttrMapFour').removeClass('disabled'); //打开table
              let cateOaAttrF = cateOaAttr.filter((v) => v.id === platAttrF.cateOaAttrId)[0];
              platValue.platCateAttrValueVOList = platValue.platCateAttrValueVOList==undefined? [] : platValue.platCateAttrValueVOList
              // console.log(cateOaAttrF,platValue, platValue.platCateAttrValueVOList);
              if (cateOaAttrF) {
                changeTable(cateOaAttrF.prodCateOaAttrValueList, platValue, $(_cloneHTML).find('#tablebox'), 0, platAttrF.prodCateOaAttrValueMappingList);
              }
            }
          }
          optionHTML = optionDefault + optionHTML;
          $(_cloneHTML).find('#cateAttrName').html(optionHTML);
          if (!cateOaAttr[0].prodCateOaAttrValueList || !cateOaAttr[0].prodCateOaAttrValueList.length) {
            layer.msg('此OA类目属性下无属性值');
            $('#cateAttrName').val('');
            _cloneHTML.find('.platAttrMapFour').addClass('disabled'); //关闭table
            form.render();
            return;
          }
        } else {
          //无OA
         
          //打开OA——color
          let optionTem = Array.from($(_cloneHTML).find('#defaultPlatAttrValuesel option'));
          optionTem.forEach((v) => {
            $(v).attr('disabled', false);
          });
        }
        $(_cloneHTML).find('#pmc_Input_type').text(`录入类型：${platValue.platCateAttrInputTypeVO.zhDisplayName}`);
        // console.log(platValue.platCateAttrInputTypeEnum.includes('CUSTOM'));

        if (!platValue.platUnitList) {
          $(_cloneHTML).find('#platUnit').addClass('disN')
        }
        if(platValue.isCollection){
          // 多选
          $(_cloneHTML).find('#defaultPlatAttrValuesel').parent().hide()
          $(_cloneHTML).find('.defaultPlatAttrValueselMultiParent').show()
          let xmSelectId = 'defaultPlatAttrValueselMulti'+ plataIndex
          let multySelectStr = `<select xm-select-search class="multiSelectClass" id="${xmSelectId}" xm-select="${xmSelectId}" xm-select-search-type="dl" xm-select-create=""></select>`
          $(_cloneHTML).find('.defaultPlatAttrValueselMultiParent').html(multySelectStr)
          const arr = []
          // 选中的存在platCateAttrValueVOList不存在的枚举值，需要整合下数据
          if(platAttrF && platAttrF.directMappingValue){
            platAttrF.directMappingValue.split(SeparatorObj[store.plat]||',').forEach(v=>{
              arr.push({name:v,value:v,selected:'selected'})
            })
          }
          if(platValue.platCateAttrValueVOList){
            platValue.platCateAttrValueVOList.forEach(v=>{
              if(!arr.filter(item=>item.name==v.attrValue).length){
                arr.push({name:v.attrValue,value:v.attrValue})
              }
            })
          }
          setTimeout(()=>{
            formSelects.data(xmSelectId,'local',{ arr })
            // 存在prodCateOaAttrValueMappingList（即下面的table存在的话），当前的多选需要置为disabled
            if(platAttrF && platAttrF.prodCateOaAttrValueMappingList && platAttrF.prodCateOaAttrValueMappingList.length){
              formSelects.disabled(xmSelectId)
            }
            // 改变层级
            $('.xm-select-parent').off('click', `.xm-select-title`).on('click', `.xm-select-title`, (e) => {
              $('#batchplatAttrMapbox').parents('.platAttrMapOne').css('z-index', '0');
              $(e.target).parents('.platAttrMapOne').css('z-index', '1');
            })
          })
          // 单位
          let temporayStr2 = defaultPlatUnit_pcmRen(1, platValue.platUnitList, _cloneHTML)
          $(_cloneHTML).find('#defaultPlatUnitsel').html(temporayStr2);
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'TEXT') {
          //文本
          let temporayStr = defaultPlatAttrValue_pcmRen(1, platValue.platCateAttrValueVOList, _cloneHTML)
          let temporayStr2 = defaultPlatUnit_pcmRen(1, platValue.platUnitList, _cloneHTML)

          let iptmap = `<input type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          let iptmapUnit = `<input type="text" name="defaultPlatUnit" id="defaultPlatUnit" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;

          if (platAttrF && platAttrF.directMappingValue !== '') {
            temporayStr = temporayStr.replace(`value="${platAttrF.directMappingValue}"`, `value="${platAttrF.directMappingValue}" selected=selected`)
            iptmap = `<input type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required" value="${platAttrF.directMappingValue}"  placeholder="请选择" autocomplete="off">`;
          }
          if (platAttrF && platAttrF.directMappingUnit !== '') {
            temporayStr2 = temporayStr2.replace(`value="${platAttrF.directMappingUnit}"`, `value="${platAttrF.directMappingUnit}" selected=selected`)
            iptmapUnit = `<input type="text" name="defaultPlatUnit" id="defaultPlatUnit" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required" value="${platAttrF.directMappingUnit}"  placeholder="请选择" autocomplete="off">`;
          }
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(temporayStr);
          $(_cloneHTML).find('#defaultPlatUnitsel').html(temporayStr2);
          $(_cloneHTML).find('.inp').html(iptmap);
          $(_cloneHTML).find('.iptmapUnit').html(iptmapUnit);
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'IMAGE') {
          //图片
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(0, platValue.platUnitList, _cloneHTML));
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'TIME') {
          //时间
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html('')
          $(_cloneHTML).find('#defaultPlatUnitsel').html('')
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'NUMBER') {
          //数字
          let iptmap = `<input type="number" value="${platAttrF.directMappingValue}" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          let iptmapUnit = `<input type="number" value="${platAttrF.directMappingUnit}" name="defaultPlatUnit" id="defaultPlatUnit" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          $(_cloneHTML).find('.inp').html(iptmap);
          $(_cloneHTML).find('.iptmapUnit').html(iptmapUnit);
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(0, platValue.platUnitList, _cloneHTML));
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'SELECTION') {
          //选择
          let temporayStr = defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML)
          let temporayStr2 = defaultPlatUnit_pcmRen(1, platValue.platUnitList, _cloneHTML)
          if (platAttrF && platAttrF.directMappingValue !== '') {
            temporayStr = temporayStr.replace(`value="${platAttrF.directMappingValue}"`, `value="${platAttrF.directMappingValue}" selected=selected`)
          }
          if (platAttrF && platAttrF.directMappingUnit !== '') {
            temporayStr2 = temporayStr2.replace(`value="${platAttrF.directMappingUnit}"`, `value="${platAttrF.directMappingUnit}" selected=selected`)
          }
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(temporayStr);
          $(_cloneHTML).find('#defaultPlatUnitsel').html(temporayStr2);
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'SECTION') {
          //区间
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html('')
          $(_cloneHTML).find('#defaultPlatUnitsel').html('')
        }

        if (platValue.isMandatory) {
          $(_cloneHTML).find('#platCateAttrName').html(`<span style="color:red">*  </span><span id="platCateAttrName_id">${platValue.attrName}</span>`);
        } else {
          $(_cloneHTML).find('#platCateAttrName').html(`<span id="platCateAttrName_id">${platValue.attrName}</span>`);
        }
        $(_cloneHTML).find('#platCateAttrId').val(platValue.id);
        $('#batchplatAttrMapbox').append(_cloneHTML);
        if (!$(_cloneHTML).find('.platAttrMapFour').attr('class').includes('disabled')) {
          // if ($(_cloneHTML).find('.inp').html()) {
          $(_cloneHTML).find('#defaultPlatAttrValueinp').attr('disabled', 'true');
          $(_cloneHTML).find('#defaultPlatUnit').attr('disabled', 'true');
          // }
          let defaultPlatAttrValueselOpt = Array.from($(_cloneHTML).find('#defaultPlatAttrValuesel option'));
          let defaultPlatUnitselOpt = Array.from($(_cloneHTML).find('#defaultPlatUnitsel option'));
          defaultPlatAttrValueselOpt.forEach((v) => {
            $(v).attr('disabled', 'true');
          });
          defaultPlatUnitselOpt.forEach((v) => {
            $(v).attr('disabled', 'true');
          });
          // changeTable(platAttrF, platValue.platCateAttrValueVOList, $(_cloneHTML).find('#tablebox'), 1);
        }
      });
    } else {
      // console.log('无映射');
      //无映射
      let isMandatory = platAttrlist.filter((v) => v.isMandatory === true); //将必选平台属性值提取出来放到最前面
      let noisMandatory = platAttrlist.filter((v) => v.isMandatory === false);
      platAttrlist = [...isMandatory, ...noisMandatory];
      platAttrlist.forEach((platValue, plataIndex) => {
        let _cloneHTML = $('.clone .platAttrMapOne.visibility_hidden').clone(true);
        $(_cloneHTML).find('.platAttrMapFive').removeClass('disabled'); //打开映射OA属性名
        $(_cloneHTML).find('.platAttrMapThree').removeClass('disabled'); //打开直接默认平台属性值
        // cateOaAttr 代表 info 接口返回的属性
        if (cateOaAttr) {
          //有OA
          let optionHTML = '';
          cateOaAttr.forEach((v, i) => {
            let OAAttrHTML = `<option value="${v.attrName}" valueid="${v.id}">${v.attrName}</option>`;
            optionHTML += OAAttrHTML;
          });
          optionHTML = optionDefault + optionHTML;
          $(_cloneHTML).find('#cateAttrName').html(optionHTML);
          if (!cateOaAttr[0].prodCateOaAttrValueList || !cateOaAttr[0].prodCateOaAttrValueList.length) {
            layer.msg('此OA类目属性下无属性值');
            $('#cateAttrName').val('');
            form.render();
            return;
          }
        }else {
          //无OA
          let optionTem = Array.from($(_cloneHTML).find('#defaultPlatAttrValuesel option'));
          optionTem.forEach((v) => {
            $(v).attr('disabled', false);
          });
        }
        $(_cloneHTML).find('#pmc_Input_type').text(`录入类型：${platValue.platCateAttrInputTypeVO.zhDisplayName}`);

        if (!platValue.platUnitList) {
          $(_cloneHTML).find('#platUnit').addClass('disN')
        }
        // console.log(platValue.platCateAttrInputTypeEnum.includes('CUSTOM'));
        if(platValue.isCollection){
          // 多选
          $(_cloneHTML).find('#defaultPlatAttrValuesel').parent().hide()
          $(_cloneHTML).find('.defaultPlatAttrValueselMultiParent').show()
          let xmSelectId = 'defaultPlatAttrValueselMulti'+plataIndex
          let multySelectStr = `<select xm-select-search class="multiSelectClass" id="${xmSelectId}" xm-select="${xmSelectId}" xm-select-search-type="dl" xm-select-create=""></select>'`
          $(_cloneHTML).find('.defaultPlatAttrValueselMultiParent').html(multySelectStr)
          const arr = []
          if(platValue.platCateAttrValueVOList){
            platValue.platCateAttrValueVOList.forEach(v=>{
              arr.push({name:v.attrValue,value:v.attrValue})
            })
          }
          setTimeout(()=>{
            formSelects.data(xmSelectId,'local',{ arr })
            // 改变层级
            $('.xm-select-parent').off('click', `.xm-select-title`).on('click', `.xm-select-title`, (e) => {
              $('#batchplatAttrMapbox').parents('.platAttrMapOne').css('z-index', '0');
              $(e.target).parents('.platAttrMapOne').css('z-index', '1');
            })
          })
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'TEXT') {
          //文本
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(1, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(1, platValue.platUnitList, _cloneHTML));
          let iptmap = `<input type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          let iptmapUnit = `<input type="text" name="defaultPlatUnit" id="defaultPlatUnit" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          if(platValue.attrName == 'Brand'){
            iptmap = `<input value="Generic" type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Model'){
            iptmap = `<input value="父sku" type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Part number'){
            iptmap = `<input value="as description" type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Gender'){
            iptmap = `<input value="Unisex" type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Manufacturer'){
            iptmap = `<input value="Other" type="text" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }
          $(_cloneHTML).find('.inp').html(iptmap);
          $(_cloneHTML).find('.iptmapUnit').html(iptmapUnit);
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'IMAGE') {
          //图片
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(0, platValue.platUnitList, _cloneHTML));
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'TIME') {
          //时间
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html('')
          $(_cloneHTML).find('#defaultPlatUnitsel').html('')
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'NUMBER') {
          //数字
          let iptmap = `<input type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          let iptmapUnit = `<input type="text" name="defaultPlatUnit" id="defaultPlatUnit" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          if(platValue.attrName == 'Brand'){
            iptmap = `<input value="Generic" type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Model'){
            iptmap = `<input value="父sku" type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Part number'){
            iptmap = `<input value="as description" type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Gender'){
            iptmap = `<input value="Unisex" type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }else if(platValue.attrName == 'Manufacturer'){
            iptmap = `<input value="Other" type="number" name="defaultPlatAttrValue" id="defaultPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="请选择" autocomplete="off">`;
          }
          $(_cloneHTML).find('.inp').html(iptmap);
          $(_cloneHTML).find('.iptmapUnit').html(iptmapUnit);
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(0, platValue.platUnitList, _cloneHTML));
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'SELECTION') {
          //选择
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html(defaultPlatAttrValue_pcmRen(0, platValue.platCateAttrValueVOList, _cloneHTML));
          $(_cloneHTML).find('#defaultPlatUnitsel').html(defaultPlatUnit_pcmRen(0, platValue.platUnitList, _cloneHTML));
        }else if (platValue.platCateAttrInputTypeVO.enumName == 'SECTION') {
          //区间
          $(_cloneHTML).find('#defaultPlatAttrValuesel').html('')
          $(_cloneHTML).find('#defaultPlatUnitsel').html('')
        }
        if (platValue.isMandatory) {
          $(_cloneHTML).find('#platCateAttrName').html(`<span style="color:red">*  </span><span id="platCateAttrName_id">${platValue.attrName}</span>`);
        } else {
          $(_cloneHTML).find('#platCateAttrName').html(`<span id="platCateAttrName_id">${platValue.attrName}</span>`);
        }
        $(_cloneHTML).find('#platCateAttrId').val(platValue.id);
        $('#batchplatAttrMapbox').append(_cloneHTML);
      });
    }
    $('#batchplatAttrMapbox').find('.platAttrMapOne.visibility_hidden').removeClass('visibility_hidden');
    $('.platAttrMapbox h3').removeClass('disabled');
    form.render();
    if (cateOaAttr && cateOaAttr.length) {
      form.on('select(cateAttrName)', async function (data) {
        //data.elem:虚拟dom
        //data.othis:操作的真实dom
        //data.value:选到的option值
        //得到本条的平台属性名
        let platAttrTemporay = $(data.elem).parents('.attrValueBox').find('#platCateAttrName_id').text()
        let platTemporay = platAttrlist.filter((v, i) => v.attrName === platAttrTemporay)[0]
        if (data.value.length <= 0) {
          let optionTem = Array.from($(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValuesel option'));
          let optionTemUnit = Array.from($(data.elem).parents('.attrValueBox').find('#defaultPlatUnitsel option'));
          $(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValueinp').attr('disabled', false);
          $(data.elem).parents('.attrValueBox').find('#defaultPlatUnit').attr('disabled', false);
          optionTem.forEach((v) => {
            $(v).attr('disabled', false);
          });
          optionTemUnit.forEach((v) => {
            $(v).attr('disabled', false);
          });
          $(data.elem).parents('.platAttrMapOne').find('.platAttrMapFour').addClass('disabled'); //禁用table
          //  多选 清除disabled
          if(platTemporay.isCollection){
            const multiSelectsId = $(data.elem).parents('.attrValueBox').find('.defaultPlatAttrValueselMultiParent .multiSelectClass').prop('id')
            formSelects.undisabled(multiSelectsId)
           }
          form.render();
          return;
        }
        $(data.elem).parents('.platAttrMapOne').find('.platAttrMapFour').removeClass('disabled'); //打开table
          //过滤得到符合本条的OA属性名
          cateOAchoose = cateOaAttr.filter((v, i) => v.attrName === data.value)[0];
          if(platTemporay.isCollection){
           const multiSelectsId = $(data.elem).parents('.attrValueBox').find('.defaultPlatAttrValueselMultiParent .multiSelectClass').prop('id')
          //  多选置空并disabled
           formSelects.render(multiSelectsId)
           formSelects.disabled(multiSelectsId)
          }

        if (!cateOAchoose.prodCateOaAttrValueList || !cateOAchoose.prodCateOaAttrValueList.length) {
          layer.msg('此OA类目属性下无属性值');
          $(data.elem).val($($(data.elem).find('option')[0]).text());
          form.render();
          return;
        }
        if (originMapping) {
          //过滤得到符合本条的平台属性值
          let platAttrF = originMapping.prodCateOaAttrMappingHandleDTOList.filter((v, i) => v.platCateAttr === platAttrTemporay)[0];
          //判断是否是新增还是修改
          if (platAttrF) {
            if (platAttrF.cateOaAttrId !== $(data.elem).find('option:selected').attr('valueid')) {
              loading.show()
              let optionTemporay = Array.from($(data.elem).children('option'))
              optionTemporay = optionTemporay.filter((v)=>$(v).attr('value') == data.value)[0]
              optionTemporay = $(optionTemporay).attr('valueId')
              getDetailValues(optionTemporay, platTemporay, cateOAchoose, data)
            }else {
              // console.log(platAttrF);
              let numJudgeMap = platAttrF.cateOaAttrId === cateOAchoose.id ? 0 : 1;
              let mapTem = numJudgeMap ? null : platAttrF.prodCateOaAttrValueMappingList;
              $(data.othis).parents('.platAttrMapOne').find('#tablebox').html('');
              // console.log(platTemporay.platCateAttrValueVOList);
              // console.log(platTemporay);
              changeTable(cateOAchoose.prodCateOaAttrValueList, platTemporay, $(data.othis).parents('.platAttrMapOne').find('#tablebox'), numJudgeMap, mapTem);
              table.reload('changePlatTable');
            }
          } else {
            loading.show()
            let optionTemporay = Array.from($(data.elem).children('option'))
            optionTemporay = optionTemporay.filter((v)=>$(v).attr('value') == data.value)[0]
            optionTemporay = $(optionTemporay).attr('valueId')
            getDetailValues(optionTemporay, platTemporay, cateOAchoose, data)
          }
        } else {
          loading.show()
          
            let optionTemporay = Array.from($(data.elem).children('option'))
            optionTemporay = optionTemporay.filter((v)=>$(v).attr('value') == data.value)[0]
            optionTemporay = $(optionTemporay).attr('valueId')
            getDetailValues(optionTemporay, platTemporay, cateOAchoose, data)
        }
        let optionTem = Array.from($(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValuesel option'));
        let optionTemUnit = Array.from($(data.elem).parents('.attrValueBox').find('#defaultPlatUnitsel option'));
        $(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValueinp').attr('disabled', 'true');
        $(data.elem).parents('.attrValueBox').find('#defaultPlatUnit').attr('disabled', 'true');
        optionTem.forEach((v) => {
          $(v).attr('disabled', 'true');
        });
        optionTemUnit.forEach((v) => {
          $(v).attr('disabled', 'true');
        });
        $(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValueinp').val('');
        $(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValuesel').val('');

        $(data.elem).parents('.attrValueBox').find('#defaultPlatUnit').val('');
        $(data.elem).parents('.attrValueBox').find('#defaultPlatUnitsel').val('');
        //获取到直接映射inp里面的值
        // if ($(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValueinp').val()) {
        //   console.log('禁用inp');
        //   $(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValueinp').attr('disabled', 'true');
        // }
        //获取到直接映射sel里面的值
        // console.log($(data.elem).parents('.attrValueBox').find('#defaultPlatAttrValuesel').val());
        // $(data.elem).parents('.platAttrMapOne').find('.platAttrMapFour').addClass('disabled'); //打开table
        form.render();
      });
    }

    let defaultPlatAttrValuesel = Array.from($('#batchplatAttrMapbox #defaultPlatAttrValuesel'));
    //! 给直接默认平台属性值下拉框加事件不生效
    defaultPlatAttrValuesel.forEach(function (v) {
      // console.log($(v));
      $(v).change(function () {
        // console.log(this);
      });
    });
    // console.log();

    // else {

    //* 处理dl的层级被其他mapone压住的情况

    $('.platAttrMapOne').click(function () {
      $('.platAttrMapOne').css('z-index', '0');
      $(this).css('z-index', '1');
    });
    $('.layui-select-title').click(function () {
      $('#batchplatAttrMapbox .layui-select-title').parents('.platAttrMapOne').css('z-index', '0');
      $(this).parents('.platAttrMapOne').css('z-index', '1');
    });
    form.on('select(defaultPlatAttrValuesel)', function (data) {
      if ($(data.elem).prev().html().length) {
        $(data.elem).prev().children('input').val(data.value);
      }
    });
    form.on('select(defaultPlatUnitsel)', function (data) {
      if ($(data.elem).prev().html().length) {
        $(data.elem).prev().children('input').val(data.value);
      }
    });
    // }
  }
  function getDetailValues(optionTemporay, platTemporay, cateOAchoose, data) {
    let showParams = {
      cateOaAttrId: optionTemporay,
      platCode: $('#pcm_searchBtnForm select[name=plat]').val(),
      platCateAttrInputTypeEnum: platTemporay.platCateAttrInputTypeVO.enumName
    }
    commonReturnPromise({
      url: ctx + `/prodCateOaMapping/getRecommendedPlatCateAttrValues`,
      type: 'post',
      params: JSON.stringify(showParams),
      contentType: 'application/json',
    }).then((recomeValue)=>{
      changeTable(cateOAchoose.prodCateOaAttrValueList, platTemporay, $(data.elem).parents('.platAttrMapOne').find('#tablebox'), 1);
      //* 根据平台code以及OA属性ID进行推送属性值填充最多的选项返回
      let trTemporay = Array.from($(data.elem).parents('.platAttrMapOne').find('tbody tr'))
      trTemporay.forEach(function (trValue, trIndex) {
        let OAAttrValue = $(trValue).find('#OAAttrValue').text(), //得到本条OA属性值
          batchPlatAttrValueinpDiv = $(trValue).find('.batchMapPlat .batchPlatAttrValueinpDiv').html()||'', //得到是否有inp的框用来下方判断
          batchPlatAttrValue = $(trValue).find('.batchMapPlat #batchPlatAttrValue').html()||'', //得到平台下拉框的内容
          batchPlatUnit = $(trValue).find('.batchMapPlat #batchPlatUnit').html()||'', //得到平台下拉框的内容
          OAAttrValueF,
          batchPlatAttrValueRe,
          batchPlatUnitRe,
          TEXTmandoray = platTemporay.platCateAttrInputTypeVO.enumName == 'TEXT'
        if (recomeValue && recomeValue.length) {
          OAAttrValueF = recomeValue.filter((v)=>v.cateOaAttrValue == OAAttrValue)[0]
          if (OAAttrValueF && Object.keys(OAAttrValueF).length) {
            if(platTemporay.isCollection){  // 多选
              // 多选的id
              const multiSelectsId = 'batchMapPlatTable' + platTemporay.id + trIndex
              // 整合数据 去除与默认值一样的数据
              let multiSelectsArr = platTemporay.platCateAttrValueVOList.filter(v=>v.attrValue != OAAttrValueF.platAttrValue)
              multiSelectsArr = multiSelectsArr.map(v=>({
                name: v.attrValue,
                value: v.attrValue,
              }))
              multiSelectsArr.unshift({name: OAAttrValueF.platAttrValue,value:OAAttrValueF.platAttrValue,selected:'selected'})
              formSelects.data(multiSelectsId,'local',{arr:multiSelectsArr})
            }else{
              batchPlatAttrValueRe = batchPlatAttrValue.replace(`value="${OAAttrValueF.platAttrValue}"`, `value="${OAAttrValueF.platAttrValue}" selected=selected`)
              if (batchPlatAttrValueRe != batchPlatAttrValue) {
                $(trValue).find('.batchMapPlat #batchPlatAttrValueinp').val(OAAttrValueF.platAttrValue)
              }
            }
            batchPlatUnitRe = batchPlatAttrValue.replace(`value="${OAAttrValueF.platAttrUnit}"`, `value="${OAAttrValueF.platAttrUnit}" selected=selected`)
            if (batchPlatUnitRe != batchPlatUnit) {
              $(trValue).find('.batchMapPlat #batchPlatUnitinp').val(OAAttrValueF.platAttrUnit)
            }
            if (TEXTmandoray) {
              if(!optionTemporay.isCollection){
                $(trValue).find('.batchMapPlat #batchPlatAttrValueinp').val(OAAttrValueF.platAttrValue)
              }
              $(trValue).find('.batchMapPlat #batchPlatUnitinp').val(OAAttrValueF.platAttrUnit)
            }
          }
          $(trValue).find('.batchMapPlat #batchPlatAttrValue').html(batchPlatAttrValueRe)
          $(trValue).find('.batchMapPlat #batchPlatUnit').html(batchPlatUnitRe)
        }
      })
      form.render()
      loading.hide()
    })
  }

  //* 根据平台code以及OA属性ID进行推送属性值填充最多的选项返回
  async function recomendOAAttrOption_pcm(optionDom, selectValue, enumName) {
    let optionTemporay = Array.from(optionDom)
    optionTemporay = optionTemporay.filter((v)=>$(v).attr('value') == selectValue)[0]
    optionTemporay = $(optionTemporay).attr('valueId')
    let {data:res} = await requestAxios.recommendedValue(optionTemporay, $('#pcm_searchBtnForm select[name=plat]').val(), enumName)
    // console.log(res);
    if (res.code != '0000') {
      return layer.msg(res.msg)
    }
    return res
  }

  //?表格渲染

  //* 表格渲染
  function search_productlist(data) {
    let cols = [
      [
        { field: 'cateName', title: 'OA类目', width: '20%' },
        { field: 'cateTreeName', title: 'OA类目树', width: '40%' },
        { field: 'platCateTreeName', title: '映射平台类目', width: '25%' },
        { title: '操作', width: '15%', toolbar: '#editOperBar' },
      ],
    ];
    if(data.platCode == 'shopee'){
      cols = [
        [
          {type: 'checkbox', width: '5%'},
          { field: 'cateName', title: 'OA类目', width: '15%',templet: '#platformCategoryMapping_cateNameTpl' },
          { field: 'id', title: 'OA新类目ID', width: '10%' },
          { field: 'cateTreeName', title: 'OA类目树', width: '20%' },
          { field: 'platCateId', title: '映射类目ID', width: '10%' },
          { field: 'platCateTreeName', title: '映射平台类目', width: '15%' },
          { field: 'modifierAndTime', title: '修改人&修改时间', width: '20%', templet:`
          <div>
            <p>{{d.modifier || ''}}</p>
            <p>{{Format(d.modifyTime|| '', "yyyy-MM-dd hh:mm:ss")}}</p>
          </div>
          ` },
          { title: '操作', width: '5%', toolbar: '#editOperBar' },
        ],
      ];
    }
    table.render({
      elem: '#pcm_sProdTable',
      url: ctx + '/prodCateOaMapping/pageQuery',
      method: 'get',
      where: data,
      cols: cols,
      id: 'pcm_sProdTableId',
      page: true,
      limits: [200],
      limit: 200,
      done: function (res, curr, count) {
        $('#sSkuNum').html(count);
        //懒加载
        // imageLazyload();
      },
    });
  }

  //* 表格工具条渲染
  table.on('tool(pcm_sProdTable)', function (obj) {
    var layEvent = obj.event; //获得 lay-event 对应的值
    var data = obj.data; //获得当前行数据
    if (layEvent === 'edit') {
      mappingLayer(data.id, data.pcateId, data.platCateTreeName);
      store.addmap = {};
      store.addmap.cateOaId = data.id;
      store.addmap.oaCateName = data.cateName;
      form.render();
      const platCode = $('#pcm_searchBtnForm select[name=plat]').val()
      if(platCode === 'temu'){
        $('.temuRemark').show()
      }else{
        $('.temuRemark').hide()
      }
    }
  });

  //* 直接默认平台属性值  是否有特殊OA 渲染的数组
  function defaultPlatAttrValue_pcmRen(specialOA, RenderArr) {
    let optionHTMLOne = ''
    if (RenderArr && RenderArr.length) {
      let optionHTML = `:optionlocation<option value=""></option><option value="OA_color">OA_color</option><option value="OA_size">OA_size</option><option value="OA_style">OA_style</option>`
      RenderArr.forEach((v, i) => {
        let platOption = ''
        if (v.attrValue) {
          platOption = `<option value="${v.attrValue}"  valueid="${v.id}">${v.attrValue}</option>`;
        }
        optionHTMLOne += platOption;
      });
      if (specialOA) {
        optionHTMLOne = optionDefault + optionHTML.replace(':optionlocation', optionHTMLOne)
      }else {
        optionHTMLOne = optionDefault + optionHTMLOne
        // optionHTML = optionDefault + optionHTML
      }
    }else {
      if (specialOA) {
        optionHTMLOne = `<option value=""></option><option value="OA_color">OA_color</option><option value="OA_size">OA_size</option><option value="OA_style">OA_style</option>`
      }else {
        optionHTMLOne = ''
      }
    }
    return optionHTMLOne
  }

  //* 直接默认平台单位  
  function defaultPlatUnit_pcmRen(specialOA, RenderArr) {
    let optionHTMLOne = ''
    if (RenderArr && RenderArr.length) {
      let optionHTML = `:optionlocation<option value=""></option>`
      RenderArr.forEach((v, i) => {
        let platOption = ''
        if (v) {
          platOption = `<option value="${v}"  valueid="${v}">${v}</option>`;
        }
        optionHTMLOne += platOption;
      });
      if (specialOA) {
        optionHTMLOne = optionDefault + optionHTML.replace(':optionlocation', optionHTMLOne)
      }else {
        optionHTMLOne = optionDefault + optionHTMLOne
        // optionHTML = optionDefault + optionHTML
      }
    }
    return optionHTMLOne
  }

  //* 渲染值  平台属性值  表格盒子  是否映射
  function changeTable(oaValue, platAttrlist, tablebox, judgeMap, mapvalue) {
    let iptmap = '',
     unitinput = '  ',
     temporayStr = '',
     playAttrHTML = '',
     playUnitHTML = '',
     titleHTML = '';
     const multiSelectArr = []
     let tableXMSelectId = ''
     if(platAttrlist.isCollection){
      tableXMSelectId ='batchMapPlatTable' + platAttrlist.id
        if(platAttrlist.platCateAttrValueVOList){
          platAttrlist.platCateAttrValueVOList.forEach(v=>{
            multiSelectArr.push({name:v.attrValue,value:v.attrValue})
          })
        }
     }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'TEXT') {
      //文本
      temporayStr = defaultPlatAttrValue_pcmRen(0, platAttrlist.platCateAttrValueVOList)
      temporayStr2 = defaultPlatUnit_pcmRen(0, platAttrlist.platUnitList)
      iptmap = `<input type="text" name="batchPlatAttrValueinp" id="batchPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="批量映射平台属性值" autocomplete="off">`;
      unitinput = `<input type="text" name="batchPlatUnitinp" id="batchPlatUnitinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="批量映射平台属性值单位" autocomplete="off">`;
    }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'IMAGE') {
      //图片
      temporayStr = defaultPlatAttrValue_pcmRen(0, platAttrValue.platCateAttrValueVOList)
    }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'TIME') {
      //时间
      temporayStr = ''
    }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'NUMBER') {
      //数字
      iptmap = `<input type="number" name="batchPlatAttrValueinp" id="batchPlatAttrValueinp" class="layui-input" style="position:absolute;z-index:2;width:80%;" lay-verify="required"  placeholder="批量映射平台属性值" autocomplete="off">`;
      temporayStr = defaultPlatAttrValue_pcmRen(0, platAttrlist.platCateAttrValueVOList)
    }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'SELECTION') {
      //选择
      temporayStr = defaultPlatAttrValue_pcmRen(0, platAttrlist.platCateAttrValueVOList)
    }else if (platAttrlist.platCateAttrInputTypeVO.enumName == 'SECTION') {
      //区间
      temporayStr = ''
    }

    let optionDefault = `<option value="">批量映射平台属性值</option>`;
    let optionUnitDefault = `<option value="">批量映射平台属性值单位</option>`;
    if(platAttrlist.isCollection){ // 多选
      playAttrHTML = `<div class="batchMapPlat">
      <div class="batchPlatAttrValueinpDiv">${iptmap}</div>
      <select xm-select-search class="multiSelectClass" id="${tableXMSelectId}" xm-select="${tableXMSelectId}" xm-select-search-type="dl"></select>
    </div>`;
    }else{
      playAttrHTML = `<div class="batchMapPlat">
        <div class="batchPlatAttrValueinpDiv">${iptmap}</div>
        <select name="batchPlatAttrValue" id="batchPlatAttrValue" lay-search="" lay-filter="batchPlatAttrValue" readonly>
          ${optionDefault+temporayStr}
        </select>
      </div>`;
    }
    const platAttrlistStr =platAttrlist.isCollection ? JSON.stringify(platAttrlist) :''
    if (platAttrlist.platUnitList?.length > 0) {
      playUnitHTML = `
        <div class="batchMapPlat">
          <div class="batchPlatAttrValueinpDiv">${unitinput}</div>
          <select name="batchPlatUnit" id="batchPlatUnit" lay-search="" lay-filter="batchPlatUnit" readonly>
            ${optionUnitDefault+temporayStr2}
          </select>
        </div>`;
      titleHTML = `<div style="display: flex"><span>OA属性值</span>
        <div id="temabso">${playAttrHTML}
          <button onclick='batchMapbtn(this,${platAttrlistStr})' type="button" class="layui-btn layui-btn-primary layui-border-blue layui-btn-xs batchAttrButton">批量映射</button>
          ${playUnitHTML}
          <button onclick="batchMapUnitbtn(this)" type="button" class="layui-btn layui-btn-primary layui-border-blue layui-btn-xs batchAttrButton">批量映射</button>
        </div></div>`
      
    } else {
      titleHTML = `<div style="display: flex"><span>OA属性值</span>
        <div id="temabso">${playAttrHTML}
        <button onclick='batchMapbtn(this,${platAttrlistStr})' type="button" class="layui-btn layui-btn-primary layui-border-blue layui-btn-xs batchAttrButton">批量映射</button>
        </div></div>`
    }
    let cols = [[
      { type: 'checkbox' },
      {
        title: titleHTML,
        width: 600,
        templet: (tableTem) => {
          return `<input type="hidden" name="cateId" value="${tableTem.id}" id="OAattrinp" /><span id="OAAttrValue">${tableTem.attrValue}</span><span>(${tableTem.enAttrValue})</span>`;
        },
      },
      {
        title: '映射平台属性值',
        width: 200,
        templet: function (tableTem) {
          let temporay;
          playAttrHTML = playAttrHTML.replace('批量映射平台属性值', '映射平台属性值')
          if (mapvalue && mapvalue.length) {
           let mapTem = mapvalue.filter((v) => v.cateOaAttrValue === tableTem.attrValue)[0];
           if (mapTem && Object.keys(mapTem).length) {
            temporay = playAttrHTML.replace('name="batchPlatAttrValueinp" id="batchPlatAttrValueinp"',`name="batchPlatAttrValueinp" id="batchPlatAttrValueinp" value="${mapTem.platAttrValue}"`)
              if (mapTem.platAttrValue && mapTem.platAttrValue.length) {
                temporay = temporay.replace(`value="${mapTem.platAttrValue}"`, `value="${mapTem.platAttrValue}" selected=selected`)
              }else {
                temporay = playAttrHTML
              }
           }
          }else{
            temporay = playAttrHTML
          }
          if (!temporay) {
            temporay = playAttrHTML
          }
          if(platAttrlist.isCollection){
            const newIndex = tableTem.LAY_INDEX - 1
            temporay = `<div class="batchMapPlat">
            <select xm-select-search class="multiSelectClass" id="${tableXMSelectId+newIndex}" xm-select="${tableXMSelectId+newIndex}" xm-select-search-type="dl" xm-select-create=""></select>
            <div id="batchPlatAttrValue" class="disN"></div>
                </div>`
          }
          return `<div id="mapPlatAttr_table">${temporay}</div>`
        },
      },
      
    ]]

    if (platAttrlist.platUnitList?.length > 0) {
      let col2 = [{
        title: '映射平台属性值单位',
        width: 200,
        templet: function (tableTem) {
          let temporay;
          playAttrHTML = playAttrHTML.replace('批量映射平台属性值单位', '映射平台属性值单位')
          
          if (mapvalue && mapvalue.length) {
           let mapTem = mapvalue.filter((v) => v.cateOaAttrValue === tableTem.attrValue)[0];
           if (mapTem && Object.keys(mapTem).length) {
            temporay = playUnitHTML.replace('name="batchPlatUnitinp" id="batchPlatUnitinp"',`name="batchPlatUnitinp" id="batchPlatUnitinp"" value="${mapTem.platAttrUnit}"`)
              if (mapTem.platAttrUnit && mapTem.platAttrUnit.length) {
                temporay = temporay.replace(`value="${mapTem.platAttrUnit}"`, `value="${mapTem.platAttrUnit}" selected=selected`)
              }else {
                temporay = playUnitHTML
              }
           }
          }else{
            temporay = playUnitHTML
          }
          if (!temporay) {
            temporay = playUnitHTML
          }
          return `<div id="mapPlatAttr_table">${temporay}</div>`
        },
      }]

      cols = [[...cols[0], ...col2]]
    }
    table1.render({
      elem: tablebox,
      widthoutWidthLimit: true,
      cols: cols,
      id: 'changePlatTable',
      data: oaValue,
      // page: true,
      // limits: [10, 50, 200, 500],
      limit: oaValue.length,
      done: function (res, curr, count) {
        setTimeout(() => {
          if(platAttrlist.isCollection){
            formSelects.data(tableXMSelectId,'local',{arr:multiSelectArr})
            res.data.forEach(v=>{
              let _multiSelectArr = JSON.parse(JSON.stringify(multiSelectArr))
              if(mapvalue && mapvalue.length) {
                // 已选的数据，可能存在自己创建的数据
                let mapTem = mapvalue.filter((item) => item.cateOaAttrValue === v.attrValue)[0]
                if(mapTem && mapTem.platAttrValue){
                  const mapTemList = mapTem.platAttrValue.split(SeparatorObj[store.plat]||',')
                  _multiSelectArr = _multiSelectArr.filter(item=>!mapTemList.includes(item.name))
                  // 添加选中数据
                  mapTemList.forEach(item=>{
                    _multiSelectArr.unshift({name:item,value:item,selected:'selected'})
                  })
                }
                formSelects.data(tableXMSelectId +  v.LAY_TABLE_INDEX,'local',{arr:_multiSelectArr})
              }
            })
          }
        }, );
        form.on('select(batchPlatAttrValue)', function (data) {
          if ($(data.elem).prev().html().length) {
            $(data.elem).prev().children('input').val(data.value);
          }
        });
        form.on('select(batchPlatUnit)', function (data) {
          if ($(data.elem).prev().html().length) {
            $(data.elem).prev().children('input').val(data.value);
          }
        });
        form.render()
      },
    });
  }
  form.render();
});
//* 批量映射按钮
function batchMapbtn(thisa,platAttrlist) {
  if(platAttrlist){ // 多选赋值
    const headerMultiSelectId = $(thisa).parents('.platAttrMapFour').find('.batchMapPlat .multiSelectClass').prop('id')
    const { formSelects } = layui
    const headerValueList  = formSelects.value(headerMultiSelectId,'val')
    const trList = $(thisa).parents('.platAttrMapFour').find('.batchMapPlat .multiSelectClass')
    trList.each(function(index,dom){
      const trMultiSelectId = $(dom).prop('id')
      formSelects.value(trMultiSelectId, headerValueList)
    })
  }else{
    for (let index = 1; index < $(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatAttrValue').length; index++) {
      let inp = $(thisa).parents('.platAttrMapFour').find('.batchPlatAttrValueinpDiv').html()
      if (inp && inp.length) {
        $($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatAttrValueinp')[index]).val($(thisa).parents('.platAttrMapFour').find('#batchPlatAttrValueinp').val())
      }
      $($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatAttrValue')[index]).val($($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatAttrValue')).val());
    }

  }
  layui.form.render();
}

// 批量映射单位
function batchMapUnitbtn(thisa) {
  for (let index = 1; index < $(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatUnit').length; index++) {
    let inp = $(thisa).parents('.platAttrMapFour').find('.batchPlatAttrValueinpDiv').html()
    if (inp && inp.length) {
      $($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatUnitinp')[index]).val($(thisa).parents('.platAttrMapFour').find('#batchPlatUnitinp').val())
    }
    $($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatUnit')[index]).val($($(thisa).parents('.platAttrMapFour').find('.batchMapPlat #batchPlatUnit')).val());
    
  }
  layui.form.render();
}
