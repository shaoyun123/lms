/**shopee在线商品的js*/
var shop_arr = new Array()
var timeUnit
var temp_timeUnit
var ImgtimeUnit;
var shopeeSkus
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'laytpl', 'formSelects','layCascader', 'upload'], function () {
  var admin = layui.admin,
    layer = layui.layer,
    $ = layui.$,
    table = layui.table,
    laydate = layui.laydate,
    element = layui.element,
    formSelects = layui.formSelects,
    layCascader = layui.layCascader,
    laytpl = layui.laytpl,
    upload = layui.upload,
    form = layui.form
  form.render('checkbox')
  form.render('select') //刷新select选择框渲染


  //初始化发货仓库
  initShopeeWarehouseSelect('shopee_online_warehouseId', { selectName: '义乌仓'});


  /**
   * 日期渲染
   */
  laydate.render({
    elem: '#shopee_online_listtime',
    range: true
  })
  laydate.render({
    elem:'#shopee_online_deadlineToFix_time',
    range:true
  })
  render_hp_orgs_users('#pl_shopee_searchForm')//渲染部门销售员店铺三级联动


  // //弹出分类框
  // $('#shopee_online_searchCate_btn').click(function () {
  //   admin.itemCat_select('shopee_online_prod_cate_layer', 'shopee_online_cateId_search_inp', 'shopee_online__search_cate_div')
  // })

  // 初始化
  shopeeOnline_init()
  let shopeeOnline_cnscCateIds = null
  function shopeeOnline_init(){
    // 多选
    formSelects.render("shopee_online_is_sale_status_sel");
    // 视频标签
    commonReturnPromise({
      url:'/lms/LazadaVideoMange/getVideoTags'
    }).then(res=>{
      const arr = res.map(item=>({...item,value:item.name}))
      formSelects.data('shopee_online_videoTags','local',{arr})
    })
    // 视频添加时间
    laydate.render({
      elem: '#shopee_online_video_addTime',
      range: true
    })
    // cnsc类目
    commonReturnPromise({
      url: "/lms/shopee/shopeeCate/cnscCategoryTree",
    }).then(res=>{
      shopeeOnline_cnscCateIds = layCascader({
        elem: "#shopee_online_cnscCateIds",
        clearable: true,
        filterable: true,
        collapseTags: true,
        options: res,
        props: {
        multiple: true,
        label: "label",
        value: "value",
        children: "children",
        checkStrictly: false,
        },
      })
    })
     // oa新类目
     commonReturnPromise({
      url: "/lms/prodCateOa/get/cate/tree",
    }).then(res=>{
      shopeeOnline_oaNewcateId = layCascader({
        elem: "#shopee_online_oaNewcateId",
        clearable: true,
        filterable: true,
        collapseTags: true,
        options: JSON.parse(res),
        props: {
        multiple: true,
        label: "title",
        value: "value",
        children: "data",
        checkStrictly: false,
        },
      })
    })
    // 店铺标签
    commonReturnPromise({
      url: '/lms/sysdict/getStoreTagByCode',
      type: 'post',
      params: {codes: 'shopee'}
    }).then(res=>{
      formSelects.data('shopee_online_storeTagList','local',{arr: res.map(item=>({...item, value:item.name}))})
    })

    // 在线listing标签
    commonReturnPromise({
      url: '/lms/sysdict/getShopeeListingTag',
    }).then(res=>{
      formSelects.data('shopee_online_listingTagList','local',{arr: res.map(item=>({...item, value:item.id}))})
    })

    // 侵权
    // 渲染侵权平台查询条件
    oneAjax.post({
      url: "/prodTpl/getTortPlatEnums",
      success: function (res) {
        tortPlatArr = res.data;
        let arr = [];
        for (let i = 0; i < tortPlatArr.length; ++i) {
          let platCode = tortPlatArr[i];
          arr.push({
            name: platCode + "侵权",
            value: platCode + "_true",
          });
          arr.push({
            name: platCode + "不侵权",
            value: platCode + "_false",
          });
        }
        formSelects.data("shopee_online_tortPlat", "local", { arr });
      },
    });

    // 违规类型
    commonReturnPromise({
      url: '/lms/shopee/onlineProductShopee/listAllViolationType'
    }).then(res=>{
      const arr = (res||[]).map(v=>({name:v,value:v}))
      formSelects.data('shopee_online_violationTypeList','local',{arr})
    })

    // 物流枚举
    commonReturnPromise({
      url: '/lms/shopee/onlineProductShopee/listAllLogistics'
    }).then(res=>{
      const arr = res.map(item=>{
        const name = item.logisticsChannelId == 0 ? item.logisticsChannelName : `${item.logisticsChannelName}(${item.logisticsChannelId})`
        return { ...item, value:item.logisticsChannelId, name}
      })
      formSelects.data('shopee_online_logisticsIdListStr','local',{arr})
    })
  
  }

    // 模板查询赋值
    commonSaveSearchTpl({
      id: "shopee_online_save",
      formId: "pl_shopee_searchForm",
      pageName: "shopee_onlineproduct",
      searchBtnId: "shopeeOnlineSearch",
      cb: (param) => shopeeOnline_formVal(param),
    });

    function shopeeOnline_formVal(param) {
      // tab赋值
      $("#shopeeOnlineProCard .layui-tab-title li").each(function () {
        if ($(this).attr('product_status_type') == param.prodStatus) {
          $(this).addClass("layui-this");
        } else {
          $(this).removeClass("layui-this");
        }
      });
      // 店铺 赋值
      commonReturnPromise({
        url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
        type: "post",
        params: {
          roleNames: `shopee专员`,
          orgId: param.orgId,
          salePersonId: param.salePersonId,
          platCode: "shopee",
        },
      }).then((res) => {
        const storeList = param.storeAcctIds ? param.storeAcctIds.split(",") : [];
        appendSelect(
          $("#pl_shopee_searchForm").find(`select[_name=storeAcctIds]`),
          res,
          "id",
          "storeAcct"
        );
        formSelects.render("shopee_online_store_sel");
        formSelects.value("shopee_online_store_sel", storeList);
        // 给表单赋值
        form.val("pl_shopee_searchForm", param);
        // 多选的 name: xm-select
        let multiSelectObj = {
          store: "shopee_online_store_sel",
          siteSel: "shopee_online_site_sel",
          videoTags: "shopee_online_videoTags",
          storeTagList: "shopee_online_storeTagList",
          listingTagList: "shopee_online_listingTagList",
          tortPlat: "shopee_online_tortPlat",
          prodIsSaleStatus: 'shopee_online_is_sale_status_sel',
          logisticsIdListStr: "shopee_online_logisticsIdListStr",
        };
        Object.keys(multiSelectObj).forEach((item) => {
          if (param[item]) {
            formSelects.value(multiSelectObj[item], param[item].split(","), true);
          } else {
            formSelects.render(multiSelectObj[item]);
          }
        });
        // 多选
        let cascaderObj = {
          cnscCateIds: shopeeOnline_cnscCateIds,
          oaNewcateId: shopeeOnline_oaNewcateId,
        };
        Object.keys(cascaderObj).forEach((item) => {
          if (param[item]) {
            cascaderObj[item].setValue(JSON.parse(param[item]));
          } else {
            cascaderObj[item].setValue([]);
          }
        });
        // 执行搜索
        // 执行搜索
        $("#shopeeOnlineProCard .layui-tab-title li.layui-this").click()
        // $("#shopee_online_search_submit").click();
      });
    }

  $('#shopee_online_search_reset').click(function () {
    $('#pl_shopee_searchForm')[0].reset()
    $('#pl_shopee_searchForm input[type=\'hidden\']').val('')
    $('#shopee_online__search_cate_div').html('')
    $('#shopee_online_depart_sel').next().find('dd[lay-value=""]').trigger('click')
    shopeeOnline_cnscCateIds.setValue()
    shopeeOnline_oaNewcateId.setValue()
  })

  // shopeeOnline_initStoreDisticnt();
  /**
   * 速卖通初始化运费模板数据
   */
  function shopeeOnline_initStoreDisticnt (storeAcctId) {
    if (storeAcctId == null || storeAcctId == '') {
      $('#shopee_online_distinct_sel').html('<option value=\'\'></option>')
      return
    }
    $('#shopee_online_distinct_sel').html('<option value=\'\'></option>')
    $.ajax({
      url: ctx + '/shopee/onlineProductShopee/getShopeePromotionByStoreAcct.html',
      dataType: 'json',
      data: { 'storeAcctId': storeAcctId },
      type: 'post',
      success: function (returnData) {
        if (returnData.code == '0000' && returnData.data != null) {
          $(returnData.data).each(function () {
            $('#shopee_online_distinct_sel').append('<option value=\'' + this.discountId + '\'>' + this.discountName + '</option>')
          })
          form.render()
        } else {
          layer.msg(returnData.msg, { icon: 0 })
        }
      },
      error: function () {
        layer.msg('服务器异常', { icon: 5 })
      },
    })
  }

  // 一键复制
  new dropButton('shopee_online_copy_list');
  $('.shopeeOnline_copyData').click(function(){
    const type = $(this).data('type')
    const typeStr = $(this).data('typestr')
    const { data } = table.checkStatus("shopee_online_data_table");
    const typeObj = {
      itemId: 0,
      globalItemId: 1,
      prodPSku: 2,
      storeAcct: 3,
      siteId: 4,
      salesperson: 5,
    }
    // 若复选框选中数据，仅复制复选框选中数据；2.无选中数据，复制查询数据里前1w个数据
    if (data.length) {
      const copyList = data.map((v) => v[type])
      const copyListStr = Array.from(new Set(copyList));
      copyTxtToClipboard(copyListStr, "textarea");
    } else {
      const searchData = shopeeOnline_getSerachData();
      if (searchData.tortPlat) {
        let platJSON = {}
        let isExistSamePlatTort = false
        var selectList = searchData.tortPlat.split(',')
        for (let i = 0;i < selectList.length; ++i) {
            let platCode = selectList[i].split('_')[0]
            if (platJSON[platCode]) {
              isExistSamePlatTort = true
            } else {
                platJSON[platCode] = 1
            }
        }
        if(isExistSamePlatTort){
          return layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
        }
    }
    if(!searchData.warehouseId && (searchData.preAvailableStockMin||searchData.preAvailableStockMax)){
      return layer.msg('预计库存筛选条件必须选择发货仓库')
    }
      searchData.copyType = typeObj[type]
      commonReturnPromiseRes({
        type: "POST",
        url: "/lms/shopee/onlineProductShopee/copyProductInfo",
        params: searchData,
      }).then((res) => {
        const {count, data} = res
        if(count){
          layer.confirm(
            `查出${typeStr} ${count}条，点击确认复制`,{icon: 3},
            function () {
              copyTxtToClipboard(data, "textarea");
            }
          );
        }else{
          layer.alert('暂无数据可复制', {icon: 2})
        }
      });
    }
  })

  /**
   * 店铺改变事件
   */
  layui.formSelects.on('shopee_online_store_sel', function (id, vals, val, isAdd, isDisabled) {
    if (val != null && val.value != null) {
      shopeeOnline_initStoreDisticnt(val.value)
    }
  })
  /**
   * 批量操作(上下架，调价等)
   */
  form.on('select(shopee_online_isEnableSel)', function (data) {
    var selected = $.trim(data.value)
    let area =''
    if (selected == null || selected == '') {
      return false
    }
    if (selected == 0) { //批量更新
      var itemData = table.checkStatus('shopee_online_data_table').data //获取选择的lisiting
      if (itemData == null || itemData.length < 1) {
        layer.msg('请选择lisiting', { icon: 0 })
        return
      }
      var itemIds = []
      for (var index in itemData) {
        var obj = itemData[index]
        itemIds.push(obj.storeAcctId + '&' + obj.itemId)
      }
      updateBacthShopeeItem(itemIds.join(','))
      return false
    }

    if (selected == 5) {
      if (shop_arr.length <= 0) {
        layer.msg('请选择需要修改的商品')
        return
      }
      for (var i = 0; i < shop_arr.length; i++) { //下线商品不修改
        if (shop_arr[i].isOffline) {
          shop_arr.splice(i, 1)
        }
      }
    }
    if (selected == 6) {
      if (shop_arr.length <= 0) {
        layer.msg('请选择需要修改的商品')
        return
      }
      for (var i = 0; i < shop_arr.length; i++) { //下线商品不修改
        if (shop_arr[i].isOffline) {
          shop_arr.splice(i, 1)
        }
      }
      // for (var i = 0; i < shop_arr.length; i++) {
      //   var storeAcctId = shop_arr[0].storeAcctId
      //   if (shop_arr[i].storeAcctId != storeAcctId) {
      //     layer.msg('请选择同一店铺的商品')
      //     return
      //   }
      // }
      var itemData = table.checkStatus('shopee_online_data_table').data //获取选择的lisiting
      var ckedsIdArr = itemData.map(function (item) {
        return item.id
      })
      localStorage.setItem('ckedsIdArr', JSON.stringify(ckedsIdArr))
    }

    if (selected == 10) {
      var itemData = table.checkStatus('shopee_online_data_table').data //获取选择的lisiting
      var ckedsIdArr = itemData.map(function (item) {
        return item.id
      })
      var prodSSkuListArrs = itemData.map(function (item) {
        return item.prodSyncSShopeeDtos.filter(function (sItem) {
          return sItem.prodSSku.length > 0
        })
      })
      var prodSSkuListArr = []
      for (let i = 0; i < prodSSkuListArrs.length; i++) {
        let items = prodSSkuListArrs[i]
        if (items.length > 0) {
          let itemArr = items.map(function (item) {
            return item.prodSSku
          })
          prodSSkuListArr.push(...itemArr)
        }
      }

      // console.log('子sku集合', prodSSkuListArrs);
      // console.log('子sku数组', prodSSkuListArr);
      // if (itemData == null || itemData.length < 1) {
      //     return layer.msg("请选择lisiting", {icon: 0});
      // }
      localStorage.setItem('ckedsIdArr', JSON.stringify(ckedsIdArr))
      localStorage.setItem('prodSSkuListArr', JSON.stringify(prodSSkuListArr))
    }

    if(selected ==15){
      if (shop_arr.length <= 0) {
        return layer.msg('请选择lisiting')
      }
    }
    if(selected ==16 || selected ==17 ){
      if (shop_arr.length <= 0) {
        return layer.msg('请选择lisiting')
      }
      const _shop_arr= []
      const storeObj = {}
      shop_arr.forEach(item=>{
        if(storeObj[item.storeAcctId]){
          storeObj[item.storeAcctId].push(item.itemId)
        }else{
          storeObj[item.storeAcctId] = [item.itemId]
        }
      })
      Object.keys(storeObj).forEach(item=>{
        _shop_arr.push({
          storeAcctId:Number(item),
          itemIds:storeObj[item]
        })
      })
      const type = selected==16 ? 'upload':'del'
      const tip = selected==16 ? '上传':'删除'
      layer.confirm('确认批量' + tip +'视频？', {
        btn: ['确认'+ tip,'取消'], //按钮
        shade: false //不显示遮罩
      }, function(index){
        batchDealvideo(_shop_arr,type)
        layer.close(index);
      });
      return false
    }
    if(selected == 18){
      area = ['1000px','775px']
      if (shop_arr.length <= 0) {
        return layer.msg('请选择lisiting')
      }
      // batchUpdateListingTag(shop_arr)
      // return false
    }
    if(selected == 21){
      area = ['80%','85%']
      if (shop_arr.length <= 0) {
        return layer.msg('请选择listing')
      }
    }
    /**
     * 跳转
     */
    var sobj = $('#shopee_online_isEnableSel').find('[value=' + selected + ']')
    var title = $(sobj).attr('data-title')
    var link = $(sobj).attr('data-link')
    var index = layer.open({
      type: 1,
      id: Date.now(),
      title: title,
      move: false,
      area: area ? area : ['80%', '70%'],
      success: function (layero) {
        layui.view(this.id).render(link).done(function () {
          //渲染完成以后执行的函数
          if (shopeeSkus) {
            $('input[name=\'sSkuList\']').val(shopeeSkus)
            setTimeout(function () {
              $('#adjustPriceSearchBtn').click()
            }, 1000)//延迟1s
          }
          // layero.find('.layui-layer-content').css({
          //     'overflow': 'hidden'
          // });
        })
      },
      end: function () {
        if (timeUnit != null) {
          clearInterval(timeUnit)//清除定时查询进度
        }
        if (temp_timeUnit != null) {
          clearInterval(temp_timeUnit)//清除定时查询进度
        }
        if(ImgtimeUnit){
          clearInterval(ImgtimeUnit)
        }
        localStorage.removeItem('ckedsIdArr')
        localStorage.removeItem('prodSSkuListArr')

      }
    })
  })

   /**
   * CNSC批量操作
   */
    form.on('select(shopee_online_isCnscEnableSel)', function (data) {
      var selected = $.trim(data.value)

      if (selected == null || selected == '') {
        return false
      }
      /**
       * 跳转
       */
      const sobj = $('#shopee_online_isCnscEnableSel').find('[value=' + selected + ']')
      const title = $(sobj).attr('data-title')
      const link = $(sobj).attr('data-link')
      const index = layer.open({
        type: 1,
        id: Date.now(),
        title: title,
        move: false,
        area: ['80%', '70%'],
        success: function (layero) {
          layui.view(this.id).render(link).done(function () {
            //渲染完成以后执行的函数
          })
        },
        end: function () {}
      })
    })
  /**
   * 产品状态选项卡改变
   */
  var so_currentProductStatusType = ['NORMAL']
  element.on('tab(shopee_online_tab_filter)', function (data) {
    var soCurrentProductStatusType = $(this).attr('product_status_type')
    $('#pl_shopee_searchForm input[name=prodStatus]').val(soCurrentProductStatusType)
    // if (soCurrentProductStatusType == "DELETED") {
    //     so_currentProductStatusType.splice(0,1,"DELETED")
    //     so_currentProductStatusType.push("ERROR_NOT_EXISTS");
    // }
    if(soCurrentProductStatusType==='BANNED'){
      $('#pl_shopee_searchForm').find('.only-show-banList').show()
    }else{
      $('#pl_shopee_searchForm').find('.only-show-banList').hide()
    }
    if(soCurrentProductStatusType === 'NORMAL'){
      $('#pl_shopee_searchForm').find('.only-show-onlineList').show()
    }else{
      $('#pl_shopee_searchForm').find('.only-show-onlineList').hide()
    }
    if(['REVIEWING','UNLIST'].includes(soCurrentProductStatusType)){
      $('#pl_shopee_searchForm').find('.not-show-reviewAndUnList').hide()
    }else{
      $('#pl_shopee_searchForm').find('.not-show-reviewAndUnList').show()
    }
    // 已删除tab支持根据下架时间
    let timeTypeStr = '<option value="1">刊登时间</option><option value="2">boost定时时间</option><option value="3">优化时间</option>'
    let timeType = $('#time_type').val()
    if(soCurrentProductStatusType === 'SHOPEE_DELETE,ERROR_NOT_EXISTS,SELLER_DELETE'){
      $('#pl_shopee_searchForm').find('.only-show-deleteList').show()
      timeTypeStr += '<option value="4">删除时间</option>'
    }else{
      $('#pl_shopee_searchForm').find('.only-show-deleteList').hide()
      if(timeType==4){
        timeType = 1
        $('#pl_shopee_searchForm').find('#shopee_online_listtime').val('')
      }
    }
    $('#time_type').html(timeTypeStr)
    $('#time_type').val(timeType)
    form.render('select')
    so_currentProductStatusType.splice(0, 1, soCurrentProductStatusType)
    $('#shopee_online_search_submit').click()
    so_currentProductStatusType = ['NORMAL']
  })
  /**
   * 搜索
   */
  $('#shopee_online_search_submit').click(function () {
    var searchData = shopeeOnline_getSerachData();
    if (searchData.tortPlat) {
      let platJSON = {}
      let isExistSamePlatTort=false
      var selectList = searchData.tortPlat.split(',')
      for (let i = 0;i < selectList.length; ++i) {
          let platCode = selectList[i].split('_')[0]
          if (platJSON[platCode]) {
            isExistSamePlatTort=true
          } else {
              platJSON[platCode] = 1
          }
      }
      if(isExistSamePlatTort){
        return layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
      }
  }
  if(!searchData.warehouseId && (searchData.preAvailableStockMin||searchData.preAvailableStockMax)){
    return layer.msg('预计库存筛选条件必须选择发货仓库')
  }
  const StatusObj={
    NORMAL: 'active',
    REVIEWING: "reviewing",
    SHOPEE_DELETE: 'banned/deleted',
    ERROR_NOT_EXISTS: 'banned/deleted',
    SELLER_DELETE: 'banned/deleted',
    BANNED: 'banned/action',
    UNLIST: 'unlisted',
  }
    let limit = 300  //每页显示的条数
    table.render({
      elem: '#shopee_online_data_table',
      method: 'post',
      url: ctx + '/shopee/onlineProductShopee/searchShopeeProductByDto.html',
      where: searchData,
      created: function (res) {
        if (res.count > -1) {
          res.count = res.count;
        } else if (res.count == -1 && !res.data) {
          res.count = 0
        } else if (res.count == -1 && Array.isArray(res.data)) {
          res.count = 30000;
        }
        if(Array.isArray(res.data) && res.data.length){
          res.data = res.data.map(item=>({
            prodStatus: searchData.prodStatus,
            ...item,
            lastlistingRemarkObj: item.listingRemarkList[item.listingRemarkList.length -1 ] || {},
            titleHref: `https://seller.shopee.cn/portal/product/list_v1/${StatusObj[item.prodStatus]}?cnsc_shop_id=${item.siteId}&page=1&searchType=id&keyword=${item.itemId}`,
            // titleHref: `https://seller.shopee.cn/portal/product/list_v1/active?cnsc_shop_id=681156487&searchType=id&keyword=24068038809`
          }))
        }
        return res;
      },
      cols: [
        [
          { checkbox: true, width: 25, style: 'vertical-align: top;' },
          {
            field: 'pImgs',
            unresize: true,
            width: 66,
            title: '图片',
            style: 'vertical-align: top;',
            templet: '#shopee_online_pImgs_tpl'
          },
          {
            field: 'itemId',
            title: '标题/产品id',
            // width: 350,
            style: 'vertical-align: top;',
            templet: '#shopee_online_title_tpl'
          },
          {
            field: 'storePSku',
            title: 'Parent SKU',
            style: 'vertical-align: top;',
            width: '6%',
            templet: '#shopee_online_storePSku_tpl'
          }, {
            title: '7/30/60/90销量', style: 'vertical-align: top;',
            width: '6%',
              templet: `
                <div>
                    <div class="alignLeft">
                     <div>直邮：{{d.sevenSales || 0}}/{{d.thirtySales || 0}}/{{d.sixtySales || 0}}/{{d.ninetySales || 0}}</div>
                     <div>平台：{{d.platSevenSales || 0}}/{{d.platThirtySales || 0}}/{{d.platSixtySales || 0}}/{{d.platNinetySales || 0}}</div>
                    </div>
                </div>
                `
          },
          {
            field: 'storeSSku', unresize: true, width: 675,
            title: '<div style=\'width:130px;float: left;\'>SKU</div> ' +
              '<div style=\'width:80px;float: left;\'>vari_id</div> ' +
              '<div style=\'width:80px;float: left;\'>规格</div> ' +
              '<div style=\'width:50px;float: left;\'>刊登价</div> ' +
              '<div style=\'width:60px;float: left;\'>现价</div> ' +
              '<div style=\'width:105px;float: left;\'>活动/卖家可用/Shopee南宁仓</div>' +
              '<div style=\'width:100px;float: left;\'>预计可用库存含在途/不含在途</div> ' +
              '<div style=\'width:60px;float: left;\'>7/30/60/90</div> ',
            style: 'vertical-align: top;', templet: '#shopee_online_storeSSku_tpl'
          },
          { field: 'listingStartTime',
            width: '6%',
            title: '时间', templet: '#shopee_online_listTime_tpl',style: 'vertical-align: top;' },
          {
            field: 'shipCost',
            title: '物流名称',
            width: '6%',
            style: 'vertical-align: top;',
            templet: d=>{
              const {logisticInfoList} = d
              if(logisticInfoList && logisticInfoList.length){
                let  strList = logisticInfoList.filter(item=>item.enabled).map(item=>item.logisticName + item.logisticId)
                let str=strList.join('<br>')
                let dom1 = ''
                if(strList[0]){
                  dom1 = `<div style="color:red">${strList[0]}</div">`
                }
                let dom2 = ''
                if(strList[1]){
                  dom2 = `<div style="color:blue">${strList[1]}</div">`
                }
                  return `<div lay-tips="${str}">${dom1}${dom2}</div>`
              }
              return ''
            }
          },
          {
            field: 'effive',
            width: '6%',
            title: '效果',
            style: 'vertical-align: top;',
            templet: '#shopee_online_effive_tpl'
          },
          {
            title: '操作',
            width: 80,
            align: 'center',
            style: 'vertical-align: top;',
            templet: '#shopee_online_operate_tpl'
          }
        ],
      ],
      done: function (res, curr, count) {
        shop_arr = []
        //懒加载
        theadHandle().fixTh('#shopeeOnlineProCard', 200)
        imageLazyloadAll()
        if (res.code == '0000') {
          if (res.msg != null) {
            var msgArray = res.msg.split('&')
            for (let index = 0; index < msgArray.length; index++) {
              if (msgArray[index] == -1) {
                msgArray[index] = '>10000'
              }
            }
            $('#shopee_online_online_num1_span').html(msgArray[0])//在线
            $('#shopee_online_online_num2_span').html(msgArray[1])//审核中
            $('#shopee_online_online_num3_span').html(msgArray[2])//下线
            $('#shopee_online_online_num4_span').html(msgArray[3])//下线
            $('#shopee_online_online_num5_span').html(msgArray[4])//已暂时下架
          }
          $('.shopee_online_promotion_tip').on('mouseenter', function () {
            var that = this
            var pstart = $(this).attr('pstart')
            if (pstart) {
              var pname = $(this).attr('pname')
              var pend = $(this).attr('pend')
              var promotionStr = '促销名称：' + pname + '<br>'
              promotionStr += '开始时间：' + Format(pstart, 'yyyy-MM-dd hh:mm:ss') + '<br>' + '结束时间：' + Format(pend, 'yyyy-MM-dd hh:mm:ss')
              layer.tips(promotionStr, that, { tips: [1, '#333'], time: 0 }) //在元素的事件回调体中，follow直接赋予this即可
            }
          }).on('mouseleave', function () {
            layer.closeAll('tips')
          })

          $('.shopee_online_bundleDeal_tip').on('mouseenter', function () {
            var that = this
            var pstart = $(this).attr('pstart')
            if (pstart) {
              var pid = $(this).attr('pid')
              var pname = $(this).attr('pname')
              var pend = $(this).attr('pend')
              var promotionStr = ''
              promotionStr += 'Bundle Deal ID：' + pid + '<br>'+'Bundle Deal：' + pname + '<br>'+'开始时间：' + Format(pstart, 'yyyy-MM-dd hh:mm:ss') + '<br>' + '结束时间：' + Format(pend, 'yyyy-MM-dd hh:mm:ss')
              layer.tips(promotionStr, that, { tips: [1, '#333'], time: 0 }) //在元素的事件回调体中，follow直接赋予this即可
            }
          }).on('mouseleave', function () {
            layer.closeAll('tips')
          })

          $('.shopee_online_boost_timing_tip').on('mouseenter', function () {
            var that = this
            var pstart = $(this).attr('pstart')
            if (pstart) {
              var promotionStr = '定时boost：' + Format(pstart, 'yyyy-MM-dd hh:mm:ss')
              layer.tips(promotionStr, that, { tips: [1, '#333'], time: 0 }) //在元素的事件回调体中，follow直接赋予this即可
            }
          }).on('mouseleave', function () {
            layer.closeAll('tips')
          })
        }
      },
      page: {
        layout: ['prev', 'page', 'next', 'skip'],
        limit: limit,
        groups: 10,
        prev: '<上一页',
        next: '下一页>',
        first: 1, //显示首页
        last: false, //显示尾页
      },
      id: 'shopee_online_data_table',

    })
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(shopee_online_data_table)', function (obj) {
      var data = obj.data, //获得当前行数据
        layEvent = obj.event //获得 lay-event 对应的值
      var itemIds = data.storeAcctId + '&' + data.itemId
      if (layEvent == 'shopee_online_updateOneItem') { //更新一条item
        updateBacthShopeeItem(itemIds)
      }
      var id = data.id
      var itemId = data.itemId
      if (layEvent == 'shopee_online_searchLog') {
        layer.open({
          type: 1,
          title: '查看日志',
          shadeClose: false,
          area: ['70%', '60%'],
          content: $('#log_table_shopee').html(),
          success: function () {
            shopeeOnline_searchLog(itemId)
          }
        })
      } else if (layEvent == 'shopee_online_modify') {
        var original = {}
        layer.open({
          title: itemId + ' 修改多属性',
          content: $('#shopee_onlineproducts_modifyspecfic').html(),
          offset: '100px',
          type: 1,
          area: ['70%', '60%'],
          btn: ['保存', '关闭'],
          success: function (layero, index) {
            initAjax('/shopee/shopeeIsEnableProduct/getItemSkuInfo.html',
              'get', { idList: id },
              function (returnData) {
                original = returnData.data[0]
                modifyShopeeSpecific(returnData.data[0])
                $(layero).find('#addNewRow').click(function () {
                  original.slist.push({
                    listingPrice: '', variSku: '', title: '', variAttr: '', stock: '', variId: ''
                  })
                  var item = ''
                  laytpl($('#shopee_onlineproducts_modifyspecfic_row').html()).render([{
                    listingPrice: '', variSku: '', title: '', variAttr: '', stock: '', variId: ''
                  }], function (html) {
                    item = html
                  })
                  $('#shopee_onlineproduct_modifyspecific').append(item)
                  shopee_initSubSkuImgExchangeLocal()
                })
              }
            )
          },
          yes: function (index, layero) {
            original.slist = getTableData($('#shopee_onlineproduct_modifyspecific'), original.slist)
            saveModifyOfSpecific(original, function (returnData) {
              if (returnData.code != '9999') {
                layer.msg(returnData.msg)
              } else {
                layer.msg('操作成功')
              }
              layer.close(index)
            })
          },
          btn2: function (index, layero) {
            layer.close(index) //如果设定了yes回调，需进行手工关闭
          },
        })

      }else if(layEvent == 'shopee_online_remark'){
        shopeeOnlineRemark(data)
      }else if(layEvent == 'shopee_online_violationInfo'){
        shopeeOnlineViolationInfo(data)
      }
    })
  })

  function shopeeOnlineRemark(obj = {}) {
    layer.open({
      type: 1,
      title: "listing备注",
      shadeClose: false,
      area: ["700px", "500px"],
      btn: ["保存", "关闭"],
      content: $("#shopee_onlineproducts_remark_tpl").html(),
      success: function (layero, index) {
        table.render({
          elem: "#shopee_onlineproducts_remark_table",
          data: obj.listingRemarkList || [],
          cols: [
            [
              //标题栏
              { field: "remark", title: "备注内容" },
              {
                field: "createTime",
                title: "时间",
                templet:
                  "<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              { field: "creator", title: "添加人", width: 120 },
            ],
          ],
        });
        if (obj.lastlistingRemarkObj.remark) {
          layero
            .find("textarea[name=remark]")
            .val(obj.lastlistingRemarkObj.remark);
        }
      },
      yes: function (index, layero) {
        const params = {
          itemId: obj.itemId,
          storeAcctId: obj.storeAcctId,
          remark: layero.find("textarea[name=remark]").val(),
        };
        commonReturnPromise({
          url: "/lms/shopee/onlineProductShopee/setListingRemark",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify(params),
        }).then((res) => {
          layer.msg(res || "操作成功");
          layer.close(index);
          $("#shopee_online_search_submit").click();
        });
      },
    });
  }

  // deboost 违规详情
  function shopeeOnlineViolationInfo(obj){
    var index = layer.open({
      type: 1,
      id: Date.now(),
      title: '查看违规详情',
      move: false,
      area: ['1000px', '500px'],
      content: $("#shopee_onlineproducts_deboostInfo_tpl").html(),
      success: function (layero, index) {
        commonReturnPromise({
          url: `/lms/shopee/onlineProductShopee/getViolationInfoByItemId/${obj.itemId}`
        }).then(res=>{
          const { prodStatus } = obj
          table.render({
            elem: "#shopee_onlineproducts_deboostInfo_table",
            data: res||[],
            cols: [
              [
                { field: "itemName", title: "商品名称",  },
                {
                  field: "deadlineToFix",
                  title: `${prodStatus==='BANNED' ? "时间期限" : "截止时间"}`,
                  templet:
                    "<div>{{Format(d.deadlineToFix,'yyyy-MM-dd hh:mm:ss')}}</div>",
                  width: 150,
                },
                { field: "violationType", title: `${prodStatus==='BANNED' ? "违规类型" : "违反类型"}`, width: 120},
                { field: "violationReason", title: `${prodStatus==='BANNED' ? "违规原因" : "违反原因"}` ,width: 150,},
                { field: "suggestion", 
                  title: `${prodStatus==='BANNED' ? "整改建议" : "建议"}`,   
                  templet: d =>{
                    let suggestedCategoryTreeStr = ''
                    if(d.suggestedCategoryTree){
                      suggestedCategoryTreeStr = d.suggestedCategoryTree
                    }
                    return  `<div>${d.suggestion}</div><div>${suggestedCategoryTreeStr}</div>`
                  },
                  width: 250,
                }
              ],
            ],
          });
        })
      },
    })
  }

  // 标签配置
  $('#shopee_onlilne_settting_tag').click(function(){
    var index = layer.open({
      type: 1,
      id: Date.now(),
      title: '自动标签配置',
      move: false,
      area: ['1000px', '800px'],
      btn: ["保存", "关闭"],
      success: function (layero) {
        // 存localstorage platcode
        window.localStorage.setItem('autoSetListingTagPlatCode','shopee')
        layui.view(this.id).render('route/iframe/layer/autoSetListingTag').done(function () {
        })
      },
      yes:function(){
        const tableData = autoSetListingTagName.saveListingTagSetting()
        if(Array.isArray(tableData)){
          commonReturnPromise({
            url: '/lms/shopee/shopeeIsEnableProduct/saveListingTagAutoSetConfig',
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(tableData)
          }).then(res=>{
            layer.msg(res,{icon:1})
            autoSetListingTagName.init()
            // layer.closeAll()
          })
        }
      },
      end: function () {}
    })
  })
  

  // 下载模板
  form.on('select(shopee_online_exportType)',function(obj){
    const { value } = obj
    switch(value){
      case "storePrice":
        window.location.href = ctx + '/static/templet/Shopee调整店铺价格-模板.xlsx'
        break;
      case "cnscPrice":
        window.location.href = ctx + '/static/templet/Shopee调整店铺CNSC价格-模板.xlsx'
        break;
      case "titleOrDesc":
        window.location.href = ctx + '/static/templet/shopee重新生成标题或描述模版.xlsx'
        break;
      case "productPrice":
        window.location.href = ctx + '/static/templet/shopee调整listing价格模版.xlsx'
          break;
      default:
        break;
    }
  })

  // 导入模板
  let shopeeOnlineImportType = ''
  form.on('select(shopee_online_importType)',function(obj){
    const { value } = obj
    shopeeOnlineImportType = value
   if(value){
    if(value == 'importNewPrice'){
      commonImportJudgePriceConfigFn();
    }else if(value == 'importProductPrice'){
      importAdjustPriceByExcel()
    } else{
      $('#shopee_onlilne_import_adjust_store_file').click()
    }
    // $('#shopee_onlilne_import_adjust_store_file').click();
   }
  })
  // $('#shopee_onlilne_import_adjust_store').click(function () {
  //   $('#shopee_onlilne_import_adjust_store_file').click()
  // })

  $('#shopee_onlilne_import_adjust_store_file').on('change', function () {
    let files = $('#shopee_onlilne_import_adjust_store_file')[0].files
    // 如果没有文件则终止
    if (files.length === 0) {
      return
    }
    // 校验文件类型
    let fileName = files[0].name
    let seat = fileName.lastIndexOf('.')
    let extension = fileName.substring(seat).toLowerCase()
    if (extension !== '.xlsx' && extension !== '.xls') {
      layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
      return
    }
    const importUrl = {
      // storePrice: ctx + '/shopee/shopeeIsEnableProduct/adjustByExcel.html',
      // cnscPrice: ctx + '/shopee/shopeeIsEnableProduct/adjustCnscByExcel',
      importNewPrice: ctx + '/shopee/shopeeIsEnableProduct/adjustByExcel.html',
      importNewCnscPrice: ctx + '/shopee/shopeeIsEnableProduct/adjustCnscByExcel',
      importNewTitle:'/lms/shopee/onlineProductShopee/regenerateAndUpdateProductTitleByExcel',
      importNewDesc: '/lms/shopee/onlineProductShopee/regenerateAndUpdateDescriptionByExcel',
      // importProductPrice: '/lms/shopee/onlineProductShopee/updateItemListingPriceAndDiscountPriceByExcel'
    }
    if(shopeeOnlineImportType == 'importNewPrice'||shopeeOnlineImportType == 'importNewCnscPrice'){
      let formData = new FormData()
      formData.append('file', files[0])
      let confirmIndex = layer.confirm('确认导入这个文件，对这些店铺的所有商品进行调价吗?', { btn: ['确认', '关闭'] },
        function () {
          layer.close(confirmIndex)
          loading.show()
          $.ajax({
            // url: ctx + '/shopee/shopeeIsEnableProduct/adjustByExcel.html',
            url: importUrl[shopeeOnlineImportType],
            type: 'POST',
            // async : false,
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            success: function (res) {
              $('#shopee_onlilne_import_adjust_store_file').val('')
              loading.hide()
              if (res.code === '0000') {
                layer.alert('<div  class="ztt-a" onclick="commonJumpToTaskcenter()">上传成功！操作结果需在任务中心查看</div>',{icon:1,title:'操作结果'});
                layer
                window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
              } else {
                layer.alert(res.msg,{title:'导入失败'})
              }
            },
            error: function () {
              loading.hide()
              $('#shopee_onlilne_import_adjust_store_file').val('')
            }
          })
        },
        function () {
          layer.closeAll()
          $('#shopee_onlilne_import_adjust_store_file').val('')
        }
      )
    }else if(shopeeOnlineImportType == 'importNewTitle' || shopeeOnlineImportType == 'importNewDesc'){
      let formData = new FormData()
      formData.append('file', files[0])
      loading.show()
      $.ajax({
        url: importUrl[shopeeOnlineImportType],
        type: 'POST',
        // async : false,
        data: formData,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: function (res) {
          $('#shopee_onlilne_import_adjust_store_file').val('')
          loading.hide()
          if (res.code === '0000') {
            if(Array.isArray(res.data) && res.data.length){
              const _dataStr = res.data.map(item=>item.storeAcct+'： '+item.operateMessage).join('<br>')
              layer.alert(_dataStr,{title:'导入失败数据'})
            }else{
              layer.msg(res.msg||'操作成功',{icon:1})
            }
            // $('#shopee_online_search_submit').click()
          } else {
            layer.alert(res.msg,{title:'导入失败'})
          }
        },
        error: function () {
          loading.hide()
          $('#shopee_onlilne_import_adjust_store_file').val('')
        }
      })
    // }else if(shopeeOnlineImportType == 'importProductPrice'){  // 任务中心
    //   let formData = new FormData()
    //   formData.append('file', files[0])
    //   loading.show()
    //   $.ajax({
    //     url: importUrl[shopeeOnlineImportType],
    //     type: 'POST',
    //     // async : false,
    //     data: formData,
    //     // 告诉jQuery不要去处理发送的数据
    //     processData: false,
    //     // 告诉jQuery不要去设置Content-Type请求头
    //     contentType: false,
    //     success: function (res) {
    //       $('#shopee_onlilne_import_adjust_store_file').val('')
    //       loading.hide()
    //       if (res.code === '0000') {
    //         layer.alert('<div  class="ztt-a" onclick="commonJumpToTaskcenter()">上传成功！操作结果需在任务中心查看</div>',{icon:1,title:'操作结果'});
    //         layer
    //         window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
    //       } else {
    //         layer.alert(res.msg,{title:'导入失败'})
    //       }
    //     },
    //     error: function () {
    //       loading.hide()
    //       $('#shopee_onlilne_import_adjust_store_file').val('')
    //     }
    //   })
    }
  })

  function importAdjustPriceByExcel(){
    var fileFormData = new FormData();
    layer.open({
      title: '导入调价商品配置',
      content: $('#shopee_onlineproducts_updateItemListingPriceAndDiscountPriceByExcel_script').html(),
      offset: '100px',
      type: 1,
      area: ['500px', '300px'],
      btn: ['确定', '取消'],
      success: function (layero, index) {
        upload.render({
          elem: '#shopeeOnlineproductsUpdateItemListingPriceAndDiscountPriceByExcel'
          , url: '' //此处配置你自己的上传接口即可
          , accept: 'file' //允许上传的文件类型
          , exts: 'xlsx',
          auto: false,
          choose: function (obj) {
              //将每次选择的文件追加到文件队列
              //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
              obj.preview(function (index, file, result) {
                  if (file) {
                    if (fileFormData.has("file")) {
                      fileFormData.delete("file");
                      fileFormData.append("file", file)
                      } else {
                        fileFormData.append("file", file)
                      }
                      $(layero).find("span[name=fileName]").text(file.name)
                  }
              });
          }
      });
      form.render()
      },
      yes: function (index, layero) {
        const adjustOriginPriceIncrease = $(layero).find('input[name=adjustOriginPriceIncrease]').prop('checked')
        if (fileFormData.has("adjustOriginPriceIncrease")) {
          fileFormData.delete("adjustOriginPriceIncrease");
          fileFormData.append("adjustOriginPriceIncrease", !adjustOriginPriceIncrease)
          } else {
            fileFormData.append("adjustOriginPriceIncrease", !adjustOriginPriceIncrease)
          }
        if ($(layero).find("span[name=fileName]").text() == '') {
          return layer.alert("请先上传文件", { icon: 7 })
        }
        loading.show()
        $.ajax({
          url: '/lms/shopee/onlineProductShopee/updateItemListingPriceAndDiscountPriceByExcel',
          type: 'POST',
          // async : false,
          data: fileFormData,
          // 告诉jQuery不要去处理发送的数据
          processData: false,
          // 告诉jQuery不要去设置Content-Type请求头
          contentType: false,
          success: function (res) {
            loading.hide()
            if (res.code === '0000') {
              layer.alert('<div  class="ztt-a" onclick="commonJumpToTaskcenter()">上传成功！操作结果需在任务中心查看</div>',{icon:1,title:'操作结果'});
              layer.close(index)
              window.parent.postMessage({ name: "shopeeoperatetaskcenter", res: "" }, "*");
            } else {
              layer.alert(res.msg,{title:'导入失败', icon:2})
            }
          },
          error: function (err) {
            console.log('err :>> ', err);
            loading.hide()
          }
        })
      },
    })
  }

  function saveModifyOfSpecific (data, func) {
    initAjax('/shopee/shopeeIsEnableProduct/updateItemSkuInfo.html', 'post', JSON.stringify(data), function (returnData) {
      if (func) {
        func(returnData)
      }
    }, '')
  }

  function getTableData (aDom) {
    var data = []
    aDom.find('tr').each(function (index, item) {
      data.push({
        listingPrice: $(item).find('input[name="listingPrice"]').val(),
        variId: $(item).find('input[name="variId"]').val(),
        variSku: $(item).find('input[name="variSku"]').val(),
        title: $(item).find('input[name="title"]').val(),
        stock: $(item).find('input[name="stock"]').val(),
        variAttr: $(item).find('input[name="variAttr"]').val(),
        prodSSku: $(item).find('.prodSSku').text()
      })
    })
    return data
  }

  function modifyShopeeSpecific (data) {
    var itemHtml = ''
    laytpl($('#shopee_onlineproducts_modifyspecfic_tpl').html()).render(data, function (html) {
      itemHtml = html
    })
    $('#shopee_onlineproducts_modifyspecfic_container').append(itemHtml)
    form.render()
    shopee_initSubSkuImgExchangeLocal()
  }

  async function shopeeOnline_searchLog (itemId) {
    // 获取操作类型
    let operTypeEnum
    await commonReturnPromise({
      url:ctx+ '/shopee/prodListingOperTypeEnum/shopee'
    }).then(data=>{
      operTypeEnum = data
    })
    table.render({
      elem: '#shopee_log_table',
      method: 'post',
      url: ctx + '/shopee/onlineProductShopee/searchShopeeOnlineLog.html',
      where: { 'itemId': itemId }
      , cols: [[ //标题栏
        {
          field: 'createTime',
          title: '时间',
          templet: '<div>{{layui.util.toDateString(d.createTime,\'yyyy-MM-dd HH:mm:ss\')}}</div>'
        }
        , { field: 'creator', title: '操作人' }
        , { field: 'prodSSku', title: '子SKU' }
        , { field: 'storeSSku', title: '店铺子SKU' }
        , { field: 'operType', title: '事件', templet: function(d){ return operTypeEnum[d.operType]} || '' }
        , { field: 'origData', title: '原值',width:'20%',
          templet: function(d){ 
            let origData = d.origData
            if(d.origData===undefined || d.origData===null){
              origData = ''
            }
            return `<div class="taLefte" style="white-space:pre-line">${origData}</div>`
          }
         }
        , { field: 'newData', title: '调整值', width: '25%',
          templet: function(d){
             let newData = d.newData
             if(d.newData===undefined || d.newData===null){
                newData = ''
             }
             return `<div class="taLefte" style="white-space:pre-line">${newData}</div>`
            }
         }
        , { field: 'operDesc', title: '结果', width: '15%' }
        // , { field: 'operation', title: '操作' }
      ]],
    })
  }

  /**
   * 批量更新
   * @param itemIds
   */
  function updateBacthShopeeItem (itemIds) {
    loading.show()
    if (itemIds == null || itemIds == '') {
      layer.msg('请选择lisiting', { icon: 0 })
      return
    }
    $.ajax({
      type: 'post',
      url: ctx + '/shopee/onlineProductShopee/updateBacthItem.html',
      data: { 'itemIds': itemIds },
      dataType: 'json',
      success: function (returnData) {
        loading.hide()
        if (returnData.code == '0000') {
          layer.msg(returnData.msg, { icon: 1 })
        } else {
          layer.open({
            title: '更新lisiting结果',
            content: returnData.msg,
            offset: '100px',
            area: '500px',
            yes: function (index, layero) {
              layer.close(index) //如果设定了yes回调，需进行手工关闭
            }
          })
        }
      }
    })
  }

 /**
   * 批量更新
   */
  function batchDealvideo(params,type='upload'){
    const objUrl = {
      del:'/lms/shopee/media/batchDeleteVideo',
      upload:'/lms/shopee/media/batchUploadVideo'
    }
    commonReturnPromise({
      url:objUrl[type],
      type:'post',
      contentType:'application/json',
      params:JSON.stringify(params)
    }).then(res=>{
      layer.msg(res||'操作成功',{icon:1})
      $('#shopee_online_search_submit').click()
    })
  }

  // 批量修改在线listing标签
  function batchUpdateListingTag(listingList){
    let popIndex = layer.open({
      type: 1,
      title: "修改在线listing标签",
      area: ["500px", "500px"],
      content: $("#shopee_onlineproducts_bacthListingtag_tpl").html(),
      btn: ["保存", "关闭"],
      success: function (layero, index) {
        commonReturnPromise({
          url: "/lms/sysdict/getShopeeListingTag",
        }).then((res) => {
          const arr = (res || []).map((item) => ({
            name: item.name,
            value: item.id,
          }));
          formSelects.data("shopee_onlineproducts_bacthListingtag_addTag", "local", {
            arr,
          });
          formSelects.data("shopee_onlineproducts_bacthListingtag_removeTag", "local", {
            arr,
          });
        });
      },
      yes: function (index, layero) {
        const addListingTagIdList =
          formSelects.value("shopee_onlineproducts_bacthListingtag_addTag", "val") ||
          [];
        const removeListingTagIdList =
          formSelects.value("shopee_onlineproducts_bacthListingtag_removeTag", "val") ||
          [];
        if (!addListingTagIdList.length && !removeListingTagIdList.length) {
          return layer.msg("请选择标签添加或移除！");
        }
        const sameTagArr = addListingTagIdList.filter((item) =>
          removeListingTagIdList.includes(item)
        );
        if (sameTagArr.length) {
          return layer.msg("同一标签无法同时添加与移除！");
        }
        commonReturnPromise({
          url: "/lms/shopee/onlineProductShopee/batchUpdateListingTag",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify({
            itemInfoList: listingList.map(item=>({itemId:item.itemId,storeAcctId:item.storeAcctId})),
            addListingTagIdList,
            removeListingTagIdList,
          }),
        }).then(() => {
          layer.msg('已成功添加/移除标签！', { icon: 1 });
          layer.close(popIndex);
          $('#shopee_online_search_submit').click()
        });
      },
    });
  }

  /**
   * 初始化shopee站点和促销信息
   */
  shopeeOnline_initShopeeSite()//初始化shopee站点下拉框
  function shopeeOnline_initShopeeSite () {
    $.ajax({
      type: 'post',
      url: ctx + '/shopee/onlineProductShopee/getShopeeOnlineEnum.html',
      dataType: 'json',
      success: function (returnData) {
        if (returnData.code == '0000') {
          var sites = []
          var siteList = returnData.data.siteList//站点
          var productLabelList = returnData.data.productLabelList//商品标签
          $(siteList).each(function () {
            var a = { name: this.name, value: this.code }
            sites.push(a)
          })
          formSelects.data('shopee_online_site_sel', 'local', { arr: sites })
          var labelStr = '<option value=\'\'>请选择</option>'
          $(productLabelList).each(function () {
            labelStr += '<option value=\'' + this.name + '\'>' + this.name + '</option>'
          })
          $('#shopee_online_productLabel_sel').html(labelStr)
          form.render()
        } else {
          layer.msg(returnData.msg)
        }
      }
    })
    if ($('#outof_stock_prod_sku_hidden').length == 1) {
      $('#shopee_online_searchtype_sel').val('prodSSku')//商品子sku
      shopeeSkus = $('#outof_stock_prod_sku_hidden').val()
      // $("#shopee_online_searchtype_input").val(skus);
      form.render()
      setTimeout(function () {
        // $("#shopee_online_search_submit").trigger('click');//搜索对应的在线商品
        $('#shopee_online_isEnableSel').next().find('dd:nth-child(4)').trigger('click')
      }, 500)//延迟2s
    }
  }

  /**
   * 获取搜索参数
   */
  function shopeeOnline_getSerachData () {
    var obj = {}
    obj.roleNames = 'shopee专员'
    var sites = formSelects.value('shopee_online_site_sel', 'val')//站点id
    if (sites != null && sites.length > 0) {
      obj.siteId = sites.join(',')
    }
    var currentStoreAccts = formSelects.value('shopee_online_store_sel', 'val')//所选店铺
    if (currentStoreAccts == null || currentStoreAccts.length == 0) {//没有选择店铺
      var acctIds = $('#shopee_online_store_sel').attr('acct_ids')
      if (acctIds != null && acctIds != '') {
        obj.storeAcctId = acctIds
      } else {
        obj.storeAcctId = 99999
      }
      obj.sellerId = $.trim($('#shopee_online_salesman_sel').val())
    } else {
      obj.storeAcctId = currentStoreAccts.join(',')//选择的店铺
    }
    obj.listSearchType = $.trim($('#shopee_online_listtype_sel').val())//刊登搜索类型
    obj.isMultiSku = $.trim($('#shopee_online_producttype_sel').val())//是否多属性
    let idType = $.trim($('#shopee_online_idType').val())
    obj[idType] = $.trim($('#shopee_online_itemId').val())//物品号
    if (obj[idType] != null) {
      obj[idType] = obj[idType].replace(/，/ig, ',')//替换中文字符
    }
    obj.daysToShipStart = $.trim($('#shopee_online_daysToShipStart').val())//备货天数
    obj.daysToShipEnd = $.trim($('#shopee_online_daysToShipEnd').val())
    obj.soldNumsStart = $.trim($('#shopee_online_soldNumsStart').val())
    obj.soldNumsEnd = $.trim($('#shopee_online_soldNumsEnd').val())
    obj.ratingStar = $.trim($('#shopee_noline_rating_star_input').val())
    obj.ratingEnd = $.trim($('#shopee_noline_rating_end_input').val())
    // 部分库存/全部库存
    obj.warehouseId =$('#pl_shopee_searchForm select[name=warehouseId]').val()
    obj.allProperties = $('#pl_shopee_searchForm').find('[name=allProperties]').val()
    obj.preAvailableStockType  = serializeObject($('#pl_shopee_searchForm')).preAvailableStockType
    obj.preAvailableStockMin = $.trim($('#shopee_online_quantityStart').val())
    obj.preAvailableStockMax  = $.trim($('#shopee_online_quantityEnd').val())
    obj.isPlatSales =  $('#pl_shopee_searchForm select[name=isPlatSales]').val()
    obj.searchSalesType = $('#pl_shopee_searchForm select[name=searchSalesType]').val()
    obj.salesMin = $('#pl_shopee_searchForm [name=salesMin]').val()
    obj.salesMax = $('#pl_shopee_searchForm [name=salesMax]').val()
    //收藏数
    obj.watchStart = $.trim($('#shopee_noline_watchStart_input').val())
    obj.watchEnd = $.trim($('#shopee_noline_watchEnd_input').val())
    //浏览量
    obj.hitCountStart = $.trim($('#shopee_noline_hitCountStart_input').val())
    obj.hitCountEnd = $.trim($('#shopee_noline_hitCountEnd_input').val())

    obj.subTitleType = $.trim($('#shopee_online_subtile_sel').val())
    obj.isPrivateListing = $.trim($('#shopee_online_private_sel').val())
    obj.isBestoffer = $.trim($('#shopee_online_bestoffer_sel').val())
    obj.listingTimeType = $.trim($('#shopee_online_listtime_sel').val())
    obj.isPromotion = $.trim($('#shopee_online_promotion_sel').val())
    obj.isOptimized = $.trim($('#shopee_online_is_optimized').val())
    obj.prodIsSaleStatus = formSelects.value('shopee_online_is_sale_status_sel', 'valStr')// 在售状态
    obj.listingType = $.trim($('#shopee_online_listing_type_sel').val())

    obj.discountId = $.trim($('#shopee_online_distinct_sel').val())//促销id
    var searchType = $.trim($('#shopee_online_searchtype_sel').val())//搜索类型
    if (searchType == 'prodPSKu') {
      obj.prodPSKu = $.trim($('#shopee_online_searchtype_input').val())
    } else if (searchType == 'prodSSku') {
      obj.prodSSku = $.trim($('#shopee_online_searchtype_input').val())
    } else if (searchType == 'storePSku') {
      obj.storePSku = $.trim($('#shopee_online_searchtype_input').val())
    } else if (searchType == 'storeSSku') {
      obj.storeSSku = $.trim($('#shopee_online_searchtype_input').val())
    }
    var titleSearchType = $.trim($('#shopee_online_title_searchtype').val())//标题检索类型
    obj.titleSearchType = titleSearchType
    var title = $.trim($('#shopee_online_title').val()) //刊登标题
    if (title != null && title != '') {
      if (titleSearchType == 0) {//标题模糊
        var array = title.split(' ')
        obj.title = ''
        for (var i = 0; i < array.length; i++) {
          if ($.trim(array[i]) != null && $.trim(array[i]) != '') {
            obj.title += '+' + $.trim(array[i])
            if (i != array.length - 1) {
              obj.title += ' '
            }
          }
        }
      } else if (titleSearchType == 1) {//标题精准
        obj.title = '%' + title + '%'
      }
    }
    obj.platCateId = $.trim($('#shopee_online_platCateId').val())//类目id
    obj.orderBy = $.trim($('#shopee_online_sortdesc_sel').val())//排序类型
    var lisitingTime = $.trim($('#shopee_online_listtime').val())//刊登时间
    if (lisitingTime != null) {
      obj.listingStartTimeFrom = lisitingTime.substring(0, 10)
      obj.listingStartTimeEnd = lisitingTime.substring(13)
    }
    // obj.prodStatus = so_currentProductStatusType.join(',');//产品状态
    obj.prodStatus = $('#shopeeOnlineProCard').find('.layui-this').attr('product_status_type')//产品状态
    // obj.pCateId = $.trim($('#shopee_online_cateId_search_inp').val())
    // oa新类目
    obj.cateOaIdList = JSON.parse($("#shopee_online_oaNewcateId").val() || "[]").join()
    // CNSC类目
    obj.cnscCateIdList = JSON.parse($("#shopee_online_cnscCateIds").val() || "[]").join()
    obj.prodAttrs = $.trim($('#shopee_online_productLabel_sel').val())
    var priceType = $.trim($('#shopee_online_price_searchtype').val())//标题检索类型
    if (priceType == 0) {
      obj.listingPriceStart = $.trim($('#shopee_noline_price_start_input').val())
      obj.listingPriceEnd = $.trim($('#shopee_noline_price_end_input').val())
    } else if (priceType == 1) {
      obj.currPriceStart = $.trim($('#shopee_noline_price_start_input').val())
      obj.currPriceEnd = $.trim($('#shopee_noline_price_end_input').val())
    }
    //boosted状态
    obj.boostedStatus = $.trim($('#shopee_online_boosted_sel').val())
    obj.boostedTimingStatus = $.trim($('#shopee_online_boosted_timing_sel').val())
    // deboost
    if(obj.prodStatus==='NORMAL'){
      obj.deboost = $.trim($('#shopee_online_deboost_sel').val())
    }
    // 违规类型，整改时间
    if(obj.prodStatus!=='REVIEWING'){
      obj.violationTypeList=formSelects.value('shopee_online_violationTypeList','valStr')
      const deadlineToFixTime= $.trim($('#shopee_online_deadlineToFix_time').val())// 整改时间
      if (deadlineToFixTime != '') {
        obj.deadlineToFixStart = deadlineToFixTime.split(' - ')[0] + ' 00:00:00'
        obj.deadlineToFixEnd = deadlineToFixTime.split(' - ')[1] + ' 23:59:59'
      }
    }
    // 已删除
    if(obj.prodStatus==='SHOPEE_DELETE,ERROR_NOT_EXISTS,SELLER_DELETE'){
      obj.prodStatusDeleteType = $.trim($('#shopee_online_prodStatusDeleteType').val())// 删除方式
    }
    obj.timeType = $.trim($('#time_type').val())
    obj.ifBundleDeal = $.trim($('#shopee_online_ifBundleDeal').val())
    //只有已被禁才有 违禁状态
    if(obj.prodStatus==='BANNED'){
      const productBannedStatus = $('#pl_shopee_searchForm').find('select[name=productBannedStatus]').val()
      obj.productBannedStatus = productBannedStatus === '' ? null : productBannedStatus
    }
    // 是否预售
    obj.isPreOrder = $('#pl_shopee_searchForm').find('select[name=isPreOrder]').val()

    // 库存
    obj.stockType = $('#pl_shopee_searchForm').find('select[name=stockType]').val()
    obj.stockStart = $('#pl_shopee_searchForm').find('input[name=stockStart]').val()
    obj.stockEnd = $('#pl_shopee_searchForm').find('input[name=stockEnd]').val()

    // 视频
    obj.usefulVideo = $('#pl_shopee_searchForm').find('select[name=usefulVideo]').val()
    obj.uploadedVideo = $('#pl_shopee_searchForm').find('select[name=uploadedVideo]').val()

    // 视频标签
    const tagStrs = formSelects.value('shopee_online_videoTags','valStr')
    if(tagStrs){
      const videoTagsType =  $('#pl_shopee_searchForm').find('select[name=videoTagsType]').val()
      obj[videoTagsType]=tagStrs
    }
    // 视频添加时间
    const videoAddTime = $.trim($('#shopee_online_video_addTime').val())
    if(videoAddTime){
      obj.videoCreateStartTime = videoAddTime.split(' - ')[0]
      obj.videoCreateEndTime = videoAddTime.split(' - ')[1]
    }
    // 店铺标签
    obj.storeTagList = formSelects.value('shopee_online_storeTagList','valStr')
    obj.listingTagInclude = $('#pl_shopee_searchForm').find('select[name=listingTagInclude]').val()
    obj.listingTagIdList = formSelects.value('shopee_online_listingTagList','valStr')
    // 物流名称
    obj.logisticsIdListStr = formSelects.value('shopee_online_logisticsIdListStr','valStr')
    // listing备注
    obj.listingRemark = $('#pl_shopee_searchForm').find('input[name=listingRemark]').val()

    // 侵权状态
    obj.tortPlat = formSelects.value('shopee_online_tortPlat','valStr')
    return obj
  }

  //监听表格复选框选择
  table.on('checkbox(shopee_online_data_table)', function (obj) {
    var checkStatus = table.checkStatus('shopee_online_data_table'), date = checkStatus.data
    if (obj.data.isOffline) {
      layer.msg('商品已下线')
    } else {
      shop_arr = date
    }
  })

  form.on('select(shopeeonlineproduct_sufixSetType)', function (obj) {
    if (obj.value == 1 || obj.value == 3) {
      $('.shopeeOnlineproduct_replacehide').addClass('disN')
    } else {
      $('.shopeeOnlineproduct_replacehide').removeClass('disN')
    }
  })

  // 导出采购入库单
  /* $("#shopee_onlilne_export_btn").click(function () {
       var confirmindex = layer.confirm('确认导出当前搜索条件下的shopee在线商品？', {btn: ['确认', '取消']}, function () {
           var itemData = table.checkStatus('shopee_online_data_table').data; //获取选择的店铺
           var itemIds = [];
           for (var index in itemData) {
               var obj = itemData[index];
               itemIds.push(obj.itemId);
           }
           var data = shopeeOnline_getSerachData();
           if (itemData != null && itemData.length > 0) {
               data.itemId = itemIds.join(",");
           }
           submitForm(data, ctx + '/shopee/onlineProductShopee/exportShopeeOnlineInfo.html', "_blank")
           layer.close(confirmindex);
       }, function () {
           layer.close(confirmindex);
       })
   });*/
  //导出shopee在线商品
  $('#shopee_onlilne_export_btn').click(function () {
    var data = shopeeOnline_getSerachData()
    if (data.tortPlat) {
      let platJSON = {}
      let isExistSamePlatTort=false
      var selectList = data.tortPlat.split(',')
      for (let i = 0;i < selectList.length; ++i) {
          let platCode = selectList[i].split('_')[0]
          if (platJSON[platCode]) {
            isExistSamePlatTort=true
          } else {
              platJSON[platCode] = 1
          }
      }
      if(isExistSamePlatTort){
        return layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
      }
  }
  if(!data.warehouseId && (data.preAvailableStockMin||data.preAvailableStockMax)){
    return layer.msg('预计库存筛选条件必须选择发货仓库')
  }
  commonReturnPromise({
    url: '/lms/shopee/onlineProductShopee/getExportPropertiesEnum'
  }).then(returnData=>{
    layer.open({
         title: '导出字段配置',
        content: $('#shopee_onlineproducts_exportSetting').html(),
        offset: '100px',
        type: 1,
        area: ['1000px', '700px'],
        btn: ['确认', '关闭'],
      success:function(layero){
        const arr = [
          {
              name:'product信息',
              key:"productExportProperties",
              checked: true,
              list: returnData.productExportProperties
            },
          {
              name:'variation信息',
              checked: true,
              key:"variationExportProperties",
              list: returnData.variationExportProperties
            },
           {
              name:'违规信息',
              checked: false,
              key:"violationInfoExportProperties",
              list: returnData.violationInfoExportProperties
            },
          ]
        laytpl($("#shopee_onlineproducts_exportSetting").html()).render(arr, function (html) {
          $(layero).find('.layui-layer-content').html(html);
          form.render()
        })
        // 模板查询赋值
        commonSaveSearchTpl({
          id: "shopee_online_exportSetting_save",
          formId: "shopee_online_exportSetting_form",
          pageName: "shopee_onlineproduct_exportSetting",
          btnText: "保存配置",
          layerTitleText: '保存自定义配置条件',
          cb: (param) => {
            // 赋值
            arr.forEach(item=>{
               // checkbox 
               let checkedList = []
              if(param['checkbox_'+item.key]){
                checkedList = param['checkbox_'+item.key].split(',')
              }
              const checkedDomList = $(layero).find(`input[name=checkbox_${item.key}]`)
              // switch 通过是否全选中当前switch下所有的复选框，判断switch是否被选中；如果是根据之前的保存数据展示，会不准确
              let switchChecked = checkedDomList.length === checkedList.length
              $(layero).find(`input[name=${item.key}]`).prop('checked',switchChecked)
              checkedDomList.each(function(){
                const isChecked = checkedList.includes($(this).val())
                $(this).prop('checked', isChecked)
              })
            })
            form.render()
          },
        });
        arr.forEach(item=>{
          form.on(`switch(exportSetting_${item.key})`,function(data){
            const checked = data.elem.checked
            $(layero).find(`input[name=checkbox_${item.key}]`).each(function(){
              $(this).prop('checked', checked)
            })
            form.render()
          })
          // 字段存在手动取消选中时，全选按钮自动改为非全选状态；非全选状态时，若手动选择下方全部复选框，自动改为全选状态；
          form.on(`checkbox(exportSetting_checkbox_${item.key})`,function(data){
            const checked = data.elem.checked
            if(!checked){
              $(layero).find(`input[name=${item.key}]`).prop('checked',false)
            }else{
              const checkedListLength = $(layero).find(`input[name=checkbox_${item.key}]:checked`).length
              if(checkedListLength == item.list.length){
                $(layero).find(`input[name=${item.key}]`).prop('checked',true)
              }
            }
            form.render()
          })
        })
      },
      yes:function(index, layero){
        // product和variation至少选中一个
       
          const productPropertySelectedCodeList=[]
          const variationPropertySelectCodeList=[]
          const violationInfoPropertySelectCodeList=[]
  
        $(layero).find(`input[name=checkbox_productExportProperties]`).each(function(){
          const checked = $(this).prop('checked')
          const value = $(this).val()
          if(checked){
            productPropertySelectedCodeList.push(value)
          }
        })
        $(layero).find(`input[name=checkbox_variationExportProperties]`).each(function(){
          const checked = $(this).prop('checked')
          const value = $(this).val()
          if(checked){
            variationPropertySelectCodeList.push(value)
          }
        })
        $(layero).find(`input[name=checkbox_violationInfoExportProperties]`).each(function(){
          const checked = $(this).prop('checked')
          const value = $(this).val()
          if(checked){
            violationInfoPropertySelectCodeList.push(value)
          }
        })
  
        if(!productPropertySelectedCodeList.length && !variationPropertySelectCodeList.length){
            return layer.msg('product信息和variation信息的导出字段,至少选中一项')
        }
        let layerIndex = layer.open({
          title: '导出提示',
          content: $('#shopee_onlineproducts_export_container_script').html(),
          offset: '100px',
          type: 1,
          area: ['400px', '200px'],
          btn: ['确认', '关闭'],
          success: function (layero, index) {
            initAjax('/shopee/onlineProductShopee/searchProcessingExportCount.html',
              'get', { platCode: 'shopee' },
              function (returnData) {
                var checkStoreAcctIds = data.storeAcctId
                var processingCount = returnData.data
                var message = '当前正在执行导出的任务数量-->[' + processingCount + '];</br>'
                if (checkStoreAcctIds) {
                  var split = checkStoreAcctIds.split(',')
                  if (split.length > 20) {
                    message += '<span style=\'color: red\'>当前您勾选的店铺个数过多,或<strong>没有选择任何店铺</strong>!</span></br>'
                  } else {
                    message += '<span>当前您导出数据勾选的店铺数量-->[' + split.length + ']</span></br>'
                  }
                } else {
                  message += '<span style=\'color: red\'>当前您导出数据没有勾选任何店铺数据信息!</span></br>'
                }
                message += '过多的数据导出将会消耗很长时间,请确认是否导出此数据?'
                $('#shopee_onlineproducts_export_container').html(message)
                $('#shopee_onlineproducts_export_container').css('padding', '15px')
              }
            )
          },
          yes: function (index, layero) {
            var itemData = table.checkStatus('shopee_online_data_table').data //获取选择的店铺
            var itemIds = []
            for (var index in itemData) {
              var obj = itemData[index]
              itemIds.push(obj.itemId)
            }
            if (itemData != null && itemData.length > 0) {
              data.itemId = itemIds.join(',')
            }
            submitForm({
              ...data,
              productPropertySelectedCodeList: productPropertySelectedCodeList.join(),
              variationPropertySelectCodeList: variationPropertySelectCodeList.join(),
              violationInfoPropertySelectCodeList: violationInfoPropertySelectCodeList.join(),
            }, ctx + '/shopee/onlineProductShopee/exportShopeeOnlineInfo.html', '_blank')
            layer.closeAll()
          },
          btn2: function (index, layero) {
            layer.close(layerIndex) //如果设定了yes回调，需进行手工关闭
          },
        })
      }
  })
  })
  })
})

/**
 * 显示商品详情
 */
function changeColspantable (obj) {
  $(obj).prev().find('.myj-hide').toggle()
  var str = $(obj).html()
  if (str.indexOf('展开') > -1) {
    $(obj).html('- 收起')
  } else {
    $(obj).html('+ 展开')
  }
}

function shopeeonlineproduct_batchSetSkuSufix (obj) {
  var type = $('#shopee_onlineproducts_modifyspecfic_container select[name=sufixSetType]').val()
  var original = $('#shopee_onlineproducts_modifyspecfic_container input[name=originalsku]').val()
  var newsku = $('#shopee_onlineproducts_modifyspecfic_container input[name=newsku]').val()
  if (original !== '') {
    if (type == 1) {
      shoppeeonlineproduct_addSufix(original)
    } else if (type == 2) {
      shoppeeonlineproduct_replaceSufix(original, newsku)
    } else {
      shoppeeonlineproduct_deleteSufix(original)
    }
  } else {
    layer.msg('请填写要修改的后缀内容')
  }
  return false
}

//添加后缀
function shoppeeonlineproduct_addSufix (newsufix) {
  $('#shopee_onlineproduct_modifyspecific tr').each(function () {
    var originalsku = $(this).find('input[name=variSku]').val()
    $(this).find('input[name=variSku]').val(originalsku + newsufix)
  })
}

//删除后缀
function shoppeeonlineproduct_deleteSufix (original) {
  $('#shopee_onlineproduct_modifyspecific tr').each(function () {
    var originalsku = $(this).find('input[name=variSku]').val()
    if (shoppeeonlineproduct_endWith(originalsku, original)) {
      $(this).find('input[name=variSku]').val(originalsku.slice(0, originalsku.length - original.length))
    }
  })
}

//替换后缀
function shoppeeonlineproduct_replaceSufix (originalsufix, newsufix) {
  $('#shopee_onlineproduct_modifyspecific tr').each(function () {
    var original = $(this).find('input[name=variSku]').val()
    if (shoppeeonlineproduct_endWith(original, originalsufix)) {
      var originbody = original.slice(0, original.length - originalsufix.length)
      $(this).find('input[name=variSku]').val(originbody + newsufix)
    }
  })
}

function shoppeeonlineproduct_endWith (s, sufix) {
  if (sufix == null || sufix == '' || s.length == 0 || sufix.length > s.length)
    return false
  if (s.substring(s.length - sufix.length) == sufix)
    return true
  else
    return false
}

function shopeeOnlineProduct_batchOperator (aDom, name) {
  var newValue = aDom.siblings('input').val()
  if (newValue) {
    $('#shopee_onlineproduct_modifyspecific').find('input[name="' + name + '"]').val(newValue)
  } else {
    layer.msg('请填写需要输入的值')
  }
}

//图片操作
function shopee_subSkuImg_exchangeNet (obj) {
  var divDom = $(obj).parent('div')
  //prompt层
  layer.prompt({ title: '填写网络图片url' }, function (text, index) {
    if (text) {
      layer.close(index)
      divDom.find('input[name=variAttr]').val(text)
      divDom.find('img').attr('src', text)
      divDom.find('input[name=variAttr]').trigger('change')
    } else {
      layer.msg('图片url不能为空')
    }
  })
}

function shopee_initSubSkuImgExchangeLocal () {
  $('.shopee_subSkuImg_edit_local').each(function () {//初始化本地按钮
    shopee_subSkuImgExchangeLocal($(this))
  })
}

//初始化本地上传图片
function shopee_subSkuImgExchangeLocal (obj) {
  var divDom = $(obj).parent('div')
  //上传本地图片
  $(obj).Huploadify({
    auto: true,
    fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
    multi: true,
    fileSizeLimit: 2048,    //默认单位是KB
    buttonText: '本地图片',
    breakPoints: false,
    saveInfoLocal: false,
    showUploadedPercent: true,
    showUploadedSize: true,
    removeTimeout: 500,
    uploader: ctx + '/publish/uploadPic.html',
    onSelect: function (files) {
      return true
    },
    onUploadStart: function (file) {
    },
    onUploadSuccess: function (file, data, response) {
      data = $.parseJSON(data)

      if (data != null && data.code == '0000') {
        divDom.find('input[name=variAttr]').val(data.msg)
        divDom.find('img').attr('src', data.msg)
        divDom.find('input[name=variAttr]').trigger('change')
      } else {
        layer.msg(data.msg)//这里面的内容不知道写啥,同OA系统
      }
    }
  })

}

//初始化ajax请求
function initAjax (url, method, data, func, contentType, showLoading) {
  //默认loading
  if (!showLoading) {
    loading.show()
  }
  $.ajax({
    type: method,
    url: ctx + url,
    dataType: 'json',
    async: true,
    data: data,
    contentType: contentType || 'application/json',
    success: function (returnData) {
      loading.hide()
      if (returnData.code == '0000') {
        func(returnData)
      } else if (returnData.code == '0001') {
        layer.alert(returnData.msg, { icon: 2 })
      } else {
        layer.msg(returnData.msg, { icon: 2 })
      }
    },
    error: function (returnData) {
      layui.admin.load.hide()
      if (XMLHttpRequest.status == 200) {
        layer.msg('请重新登录', { icon: 7 })
      } else {
        layer.msg('服务器错误')
      }
    },
    complete: function (returnData) {
      loading.hide()
    }
  })
}

function removeRow (aDom, data) {
  var tr = $(this).parents('tr')
  var variId = tr.find('input[name="variId"]').val()
  for (var i = 0; i < data.length; i++) {
    if (data[i].variId == variId) {
      data.splice(i, 1)
    }
  }
  tr.remove()
}
