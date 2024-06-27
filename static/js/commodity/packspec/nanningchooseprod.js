layui.use(['admin','table','form','element','layer','laytpl', 'laypage','laydate', 'formSelects'],function(){
  let admin = layui.admin,
      table = layui.table,
      element = layui.element,
      layer = layui.layer,
      laytpl = layui.laytpl,
      laydate = layui.laydate,
      laypage = layui.laypage,
      formSelects = layui.formSelects,
      form = layui.form;
  form.render('select');
  let nanningchooseprodName = {
    renderSearchItem(){
      let _this = this;
      //渲染时间
      laydate.render({
        elem: '#nanningchooseprod_time',
        type: 'datetime',
        range: true
      });
      // 初始化 组织-人员选择框
      render_hp_orgs_users('#nanningchooseprodForm')
      //渲染创建人
      _this.createUserListAjax().then(res => {
        commonRenderSelect('nanningchooseprod_creatorIdList', res, {code: 'id', name: 'userName'}).then(()=>{
          formSelects.render('nanningchooseprod_creatorIdList');
        });
      });
      //渲染销售专员
      _this.shopeeSalerListAjax().then(salerRes=> {
        commonRenderSelect('nanningchooseprod_personTypeList', salerRes, {code: 'id', name: 'userName'}).then(()=>{
          formSelects.render('nanningchooseprod_personTypeList');
        });
      });
      //监听切换
      form.on('select(nanningchooseprod_personTypeList)', function(obj){
        if(obj.value ==1){
          //渲染销售专员
          _this.shopeeSalerListAjax().then(salerRes=> {
            commonRenderSelect('nanningchooseprod_personTypeList', salerRes, {code: 'id', name: 'userName'}).then(()=>{
              formSelects.render('nanningchooseprod_personTypeList');
            });
          });
        }else{
          //渲染销售主管
          _this.shopeeManagerListAjax().then(managerRes=> {
              commonRenderSelect('nanningchooseprod_personTypeList', managerRes, {code: 'id', name: 'userName'}).then(()=>{
                formSelects.render('nanningchooseprod_personTypeList');
              });
          });
        }
      });
    },
    handleData(data){ //处理表单数据
      if(data.time){
        let time = data.time.split(' - ');
        data.createTimeStart = time[0];
        data.createTimeEnd = time[1];
      }else{
        data.createTimeStart = '';
        data.createTimeEnd = '';
      }
      delete data.time;
      if(data.timeType ==1){//创建时间
        //啥都不做
      }else if(data.timeType ==2){ //组长审核时间
        //删除创建时间,使用组长审核时间
        data.leaderTimeStart = data.createTimeStart;
        data.leaderTimeEnd = data.createTimeEnd;
        delete data.createTimeStart;
        delete data.createTimeEnd;
      }else if(data.timeType ==3){ //主管审核时间
        //删除创建时间,使用主管审核时间
        data.managerTimeStart = data.createTimeStart;
        data.managerTimeEnd = data.createTimeEnd;
        delete data.createTimeStart;
        delete data.createTimeEnd;
      }
      data.prodPSkuList = data.prodPSkuList.trim() == '' ? [] : data.prodPSkuList.split(',');
      data.creatorIdList = data.creatorIdList.trim() == '' ? [] : data.creatorIdList.split(',');
      // data.devWayList = data.devWayList.trim() == '' ? []: data.devWayList.split(','); //选品方向
      data.devWay = data.devWay.trim();

      if(data.personType == 1){
        data.salerIdList = data.personTypeList == '' ? []: data.personTypeList.split(',')
      }else{
        data.managerIdList = data.personTypeList == '' ? []: data.personTypeList.split(',');
      }
      delete data.personType;
      delete data.personTypeList;

      // 获取开发专员id
      let formElem = $('#nanningchooseprodForm')
      data.bizzOwnerIdList = getParentIdList(formElem.find('[name=organize]'),formElem.find('[name=bizzOwnerIdList]'))

      //处理备注
      // let remark = data.remark.trim() == '' ? []: data.remark.split(',');
      let remark = data.remark.trim() 
      if(data.remarkType==1){ //开发备注
        data.devNote = remark;
      }else if(data.remarkType==2){//组长备注
        data.leaderNote = remark;
      }else if(data.remarkType==3){//主管备注
        data.managerNote = remark;
      }
      delete data.remark;
      delete data.remarkType;
      return data;
    },
    tableRender(data){ //渲染表格
      let _this = this;
      table.render({
        elem: '#nanningchooseprod_table',
        id: 'nanningchooseprod_tableId',
        url: '/lms/devChooseProd/queryDevChooseProdDto',
        method: 'post',
        contentType: 'application/json',
        unFixedTableHead: true, 
        height: 'full-260',
        where: data,
        page: true,
        limit: 50,
        limits: [50, 100, 200,300],
        cols: [[
          { type: 'checkbox', width: 30 },
          {field: 'image', title: '竞品图片', templet: '#nanningchooseprod_imageTpl', width: 80},
          {field: 'compInfo', title: '竞品信息', templet: '#nanningchooseprod_compInfoTpl'},
          {field: 'ourInfo', title: '我们的品', templet: '#nanningchooseprod_ourInfoTpl'},
          {field: 'ourPrice', title: '我们定价', templet: '#nanningchooseprod_ourPriceTpl'},
          {field: 'person', title: '人员', templet: '#nanningchooseprod_personTpl'},
          {field: 'devthink', title: '选品思路', templet: '#nanningchooseprod_devthinkTpl'},
          {field: 'leaderAudit', title: '组长审核结果', templet: '#nanningchooseprod_leaderAuditTpl'},
          {field: 'managerAudit', title: '主管审核结果', templet: '#nanningchooseprod_managerAuditTpl'},
          { title: '操作', toolbar: '#nanningchooseprod__editBar', width: 80}
        ]],
        done: function() {
          _this.watchBar();
        }
      });
    },
    watchBar(){
      let _this = this;
      table.on("tool(nanningchooseprod_table_filter)", function(obj) {
        let layEvent = obj.event; //获得 lay-event 对应的值
        let data = obj.data;
        switch (layEvent) {
            case 'edit' :
                _this.EditHandle(data);
                break;
            case 'leader': //组长审核
                _this.handleLeaderAudit(data);
                break;
            case 'manager' : //主管审核
                _this.handleManagerAudit(data);
                break;
            case 'rePublish' : //重新发布
                _this.handleRePublishAudit(data);
                break;
        }
      });
    },
    //组长审核接口
    leaderAuditAjax(obj){
      return commonReturnPromise({
        url: '/lms/devChooseProd/leaderAudit',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(obj)
      })
    },
    //主管审核接口
    managerAuditAjax(obj){
      return commonReturnPromise({
        url: '/lms/devChooseProd/managerAudit',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(obj)
      })
    },
    //创建人接口
    createUserListAjax(){
      return commonReturnPromise({
        url: '/lms/devChooseProd/queryLastMonthCreator'
      })
    },
    //开发人员接口
    devListAjax(){
      return commonReturnPromise({
        url: '/lms/devChooseProd/queryDevUserList'
      })
    },
    //虾皮专员接口
    shopeeSalerListAjax(){
      return commonReturnPromise({
        url: '/lms/devChooseProd/queryShopeeSalerUserList'
      })
    },
    //虾皮主管接口
    shopeeManagerListAjax(){
      return commonReturnPromise({
        url: '/lms/devChooseProd/queryShopeeManagerUserList'
      })
    },
    // 重新发布接口
    rePublishAjax(obj){
      return commonReturnPromise({
        url: '/lms/devChooseProd/rePublish',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(obj)
      })
    },
    //新增/编辑接口
    addOrEditAjax(obj){
      return commonReturnPromise({
        url: '/lms/devChooseProd/saveDevChooseProd',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(obj)
      })
    },
    //定价接口
    setPriceAjax(obj){
      return commonReturnPromise({
        url: '/lms/devChooseProd//getShopeeListingPrice',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(obj)
      })
    },
    //组长审核
    handleLeaderAudit(data){
      let _this = this;
      layer.open({
        type: 1,
        title: '组长审核',
        area: ['600px', '400px'],
        btn: ['保存', '关闭'],
        id: 'nanningchooseprodLeaderAuditId',
        content: $('#nanningchooseprodLeaderAudit').html(),
        success: function(layero){
          //初始化
          layero.find('[name=leaderNote]').val(data.leaderNote);
          //回显radio
          layero.find(`input[type=radio][name=leaderAuditResult][value="${data.leaderAuditResult}"]`).prop('checked', true);
          form.render('radio');
        },
        yes: function(index, layero){
          //获取到输入的值
          let leaderNote = layero.find('[name=leaderNote]').val().trim();
          let leaderAuditResult = layero.find('[name=leaderAuditResult]:checked').val();
          if(!leaderNote){
            layer.msg('请输入组长备注',{icon:7});
            return;
          }
          _this.leaderAuditAjax({
            id: data.id,
            leaderNote: leaderNote,
            leaderAuditResult: leaderAuditResult
          }).then(res => {
            layer.msg(res ||'操作成功', {icon: 1});
            layer.closeAll();
            //刷新表格
            $('[lay-filter=nanningchooseprodform_submit]').trigger('click');
          })
        }
      });
    },
    //主管审核
    handleManagerAudit(data){
      let _this = this;
      let index = layer.open({
        type: 1,
        title: '主管审核',
        area: ['600px', '600px'],
        btn: ['保存', '关闭'],
        id: 'nanningchooseprodManagerAuditId',
        content: $('#nanningchooseprodManagerAudit').html(),
        success: function(layero){
          //回显radio
          layero.find(`input[type=radio][name=managerAuditResult][value="${data.managerAuditResult}"]`).prop('checked', true);
          form.render('radio');
          //渲染销售专员
          _this.shopeeSalerListAjax().then(salerRes=> {
              commonRenderSelect('nanningchooseprodManagerAudit_devChooseProdSalerList', salerRes, {code: 'id', name: 'userName'}).then(()=>{
                formSelects.render('nanningchooseprodManagerAudit_devChooseProdSalerList');
                formSelects.value('nanningchooseprodManagerAudit_devChooseProdSalerList',data.salerIdString && data.salerIdString.length>0 ? data.salerIdString.split(','): []);
              })
          });
          //渲染销售主管
          _this.shopeeManagerListAjax().then(managerRes=> {
              commonRenderSelect('nanningchooseprodManagerAudit_devChooseProdManagerList', managerRes, {code: 'id', name: 'userName'}).then(()=>{
                formSelects.render('nanningchooseprodManagerAudit_devChooseProdManagerList');
                formSelects.value('nanningchooseprodManagerAudit_devChooseProdManagerList',data.managerIdString && data.managerIdString.length>0 ? data.managerIdString.split(','): []);
              })
          });
          //渲染主管备注
          layero.find('[name=managerNote]').val(data.managerNote || '');
        },
        yes: function(index,layero){
          let managerAuditResult = layero.find('[name=managerAuditResult]:checked').val();
          let managerNote = layero.find('[name=managerNote]').val().trim();
          //获取到分配销售专员和分配销售主管的值
          let devChooseProdSalerList = formSelects.value('nanningchooseprodManagerAudit_devChooseProdSalerList', 'all');
          let devChooseProdManagerList =  formSelects.value('nanningchooseprodManagerAudit_devChooseProdManagerList','all');
          console.log(devChooseProdSalerList, devChooseProdManagerList);
          if(managerAuditResult == '审核成功' && (devChooseProdSalerList.length == 0 || devChooseProdManagerList.length ==0)){
            return layer.msg('审核成功时,专员和主管必选',{icon:7});
          }
          if(managerNote.length==0){
            return layer.msg('请输入主管备注', {icon:7});
          }
          let newSalerList =[], newManagerList=[];
          if(devChooseProdSalerList.length>0){
            newSalerList = devChooseProdSalerList.map(item => {
              return {
                name: item.name,
                userId: item.value
              }
            })
          };
          if(devChooseProdManagerList.length>0){
            newManagerList = devChooseProdManagerList.map(item => {
              return {
                name: item.name,
                userId: item.value
              }
            })
          };
          //执行保存功能
          _this.managerAuditAjax({
            id: data.id,
            managerAuditResult: managerAuditResult,
            managerNote: managerNote,
            devChooseProdManagerList: newManagerList,
            devChooseProdSalerList: newSalerList
          }).then(res => {
            layer.msg(res ||'操作成功', {icon: 1});
            layer.closeAll();
            //刷新表格
            $('[lay-filter=nanningchooseprodform_submit]').trigger('click');
          });
        }
      });
    },
    handleRePublishAudit(data){
      let _this = this;
      let cIndex = layer.confirm('确认重新发布吗？', function(index) {
        //执行保存功能
        _this.rePublishAjax({
          id: data.id
        }).then(res => {
          layer.msg(res || '操作成功', {icon: 1});
          layer.close(cIndex);
          //刷新表格
          $('[lay-filter=nanningchooseprodform_submit]').trigger('click');
        });
      })
    },
    //批量编辑采购状态
    purchaseStatusHandle(){
      $('#nanningchooseprod_purchaseStatusBtn').on('click', function(){
        //获取到表格选中
        let checkStatus = table.checkStatus('nanningchooseprod_tableId');
        if(checkStatus.data.length === 0){
          layer.msg('请选择数据', {icon: 7});
          return;
        }
        //获取选中项的id
        let ids = checkStatus.data.map(item => item.id);
        //弹框
        let index = layer.open({
          type: 1,
          title: '采购状态',
          area: ['600px', '400px'],
          btn: ['保存', '关闭'],
          id: 'nanningchooseprodPurchaseStatusId',
          content: $('#nanningchooseprodPurchaseStatus').html(),
          success: function(layero){
            //渲染采购状态,默认已采购
            form.render('radio');
          },
          yes: function(index, layero){
            //获取到当前选中的采购状态
            let purchaseStatus = layero.find('[name=purchaseStatus]:checked').val();
            //调用接口
            commonReturnPromise({
              url: '/lms/devChooseProd/batchEditPurchaseStatus',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                idList: ids,
                purchaseStatus: purchaseStatus
              })
            }).then(res => {
              layer.msg(res ||'操作成功', {icon: 1});
              layer.close(index);
              //刷新表格
              $('[lay-filter=nanningchooseprodform_submit]').trigger('click');
            });
          }
        });
      });
    },
    //新增/编辑选品信息
    handleAddOrEdit(data, type){
      let _this = this;
      let index = layer.open({
        type: 1,
        title: type==1 ?'新增选品信息': '编辑选品信息',
        area: ['80%', '80%'],
        btn: ['组长审核','主管审核','保存', '关闭'],
        id: 'nanningchooseprodAddAndEditLayerId',
        content: $('#nanningchooseprodAddAndEditLayer').html(),
        success: function(layero){
          //需要先请求接口获取开发专员
          _this.devListAjax().then(devRes => {
            data.bizzOwnerList = devRes;
            let getTpl = nanningchooseprodAddAndEditLayerFormTpl.innerHTML,
            view = document.getElementById('nanningchooseprodAddAndEditLayerForm');
            laytpl(getTpl).render(data, function(html){
              view.innerHTML = html;
              form.render('select');
              form.render('radio');
              //监听radio切换事件
              form.on('radio(nanningchooseprodAddAndEditLayerFormRadio)', function(data){
                let currentVal = data.value;
                if(currentVal == '泰国'){
                  //把layero下所有类目为auto-currency的内容替换成THB
                  layero.find('.auto-currency').text('THB');
                }else{
                  //把layero下所有类目为auto-currency的内容替换成VND
                  layero.find('.auto-currency').text('VND');
                }
              });
              //粘贴图片事件
              new UploadImage('nanningchooseprod_layer_img_container', ctx + '/devChooseProd/uploadPic.html').upload(function (xhr) { // 上传完成后的回调
                succUploadImg(this, xhr, 'nanningchooseprod_layer_img');
                $('#nanningchooseprod_layer_img_container').attr('src',xhr.responseText);
              })
              //监听windows事件
              window.addEventListener('message', function(event){
                if (event.data?.name === 'imageHtmlPaste') {
                  baseDataURL = $('#nanningchooseprod_layer_img_container img').attr('src');
                  // console.log('baseDataURL',baseDataURL);
                  $('#nanningchooseprod_layer_img_container').html('');
                  $('#nanningchooseprod_layer_img_container').attr('src', baseDataURL);
                  $('#nanningchooseprod_layer_img').attr('src', baseDataURL);
                }
              }, false);
              //如果没有id,就是新增,此时需要判断登录人是否是开发专员,如果是,默认选中
              if(!data.id){
                //获取到登录人名称
                let loginName = localStorage.getItem('lmsAppUserName');
                //遍历data.bizzOwnerList,判断登录人loginName是否存在
                data.bizzOwnerList.forEach((owner) => {
                  if (owner.loginName == loginName) {
                    //设置选中项
                    layero.find('[name=bizzOwnerId]').val(owner.id);
                    form.render('select');
                  }
                });
                         
              }
              //链接跳转功能
              layero.on('click', '.auto-jump', function(){
                //获取当前点击元素的前一个input的输入框的值
                let url =$(this).parents('.layui-input-block').find('.link').val().trim();
                if(!url){
                  return layer.msg('请输入需要跳转的链接', {icon:7});
                }
                // 在新标签页中打开URL
                window.open(url, '_blank').focus();
              });
              //粘贴信息功能[从剪切板获取信息]
              layero.on('click', '.paste-info', function(){
                navigator.clipboard.readText().then(text => {
                  let collectInfo = JSON.parse(text);
                  let siteList = ['TH', 'VN'];
                  //限制站点必须存在,且只能是越南或者泰国
                  // if(!collectInfo.saleSite || !siteList.includes(collectInfo.saleSite.toUpperCase())){
                  //   return layer.msg('粘贴的站点有误', {icon: 1});
                  // }
                  //不允许站点数据互通,比如泰国站点数据粘贴到越南站点
                  let currentCurrency = $('.auto-currency').eq(0).text();
                  if(currentCurrency != collectInfo.currency.toUpperCase()){
                    return layer.msg('粘贴币种和当前币种不匹配', {icon:7});
                  }
                  //允许粘贴
                  layero.find('[name=compPrice]').val(collectInfo.price);
                  layero.find('[name=comp30sales]').val(collectInfo.sales_count);
                  layero.find('#nanningchooseprod_layer_img').attr('src', collectInfo.images[0] || '');
                });
              });
              //对齐底部按钮
              layero.parents().find('.layui-layer-btn.layui-layer-btn- .layui-layer-btn0').css('float', 'left');
              layero.parents().find('.layui-layer-btn.layui-layer-btn- .layui-layer-btn1').css('float', 'left');
              layero.parents().find('.layui-layer-btn.layui-layer-btn- .layui-layer-btn2').css({
                'border-color': '#1E9FFF',
                'background-color': '#1E9FFF',
                'color': '#fff'
              });
              //根据权限判断是否需要加载组长审核和主管审核
              if($('#nanningchooseprod_fluid').find('[lay-event=leader]').length ==0 || type==1){
                //不具有组长权限
                layero.parents().find('.layui-layer-btn0').css('display','none');
              }
              if($('#nanningchooseprod_fluid').find('[lay-event=manager]').length ==0 || type==1){
                //不具有主管权限
                layero.parents().find('.layui-layer-btn1').css('display','none');
              }
              //定价功能
              layero.on('click', '.set-price', function(){
                //获取到参数
                let site = layero.find('[name=site]:checked').val();
                let purchasePrice = layero.find('[name=purchasePrice]').val().trim();
                let grossWeight = layero.find('[name=grossWeight]').val().trim();
                let grossRate = layero.find('[name=grossRate]').val().trim();
                if(purchasePrice==='' || grossRate==='' || grossWeight===''){
                  return layer.msg('采购成本,毛利率,毛重必填!', {icon:7});
                }
                let obj = {
                  site,
                  purchasePrice,
                  grossRate,
                  grossWeight
                }
                _this.setPriceAjax(obj).then(res => {
                  console.log(res);
                  layero.find('[name=salePrice]').val(res.rmbprice || '');
                  layero.find('[name=grossProfit]').val(res.rmbgrossProfit || '');
                })
              });
            });
          })
        },
        yes: function(){
          _this.handleLeaderAudit(data);
          // console.log('我是组长审核');
        },
        btn2: function(){
          _this.handleManagerAudit(data);
          // console.log('我是主管审核');
          return false;
        },
        btn3: function(index,layero){
          _this.detailHandle(index,layero);
          return false;
        }
      });
    },
    detailHandle(index,layero){
      let _this = this;
      //获取到所有包含required的类名
      const requiredFields = layero.find('.required');
      for (let i=0; i<requiredFields.length; i++) {
        let field =requiredFields[i];
        if (!field.value.trim()) { // 使用 trim() 来忽略仅包含空格的情况
          layer.msg('所有必填项都需要填写!',{icon:7});
          return false;
        }
      }
      // console.log('验证通过');
      //获取到表单对象的值
      let formData = serializeObject($("#nanningchooseprodAddAndEditLayerForm"));
      formData.currency = formData.site == '泰国' ? 'THB': 'VND';//币种
      //获取图片链接并校验
      let imgUrl = layero.find('#nanningchooseprod_layer_img').attr('src');
      if(!imgUrl){
        return layer.msg('请上传图片',{icon:7});
      }
      formData.compImgUrl = imgUrl; //竞品图片url
      formData.bizzOwner = layero.find('[name=bizzOwnerId] option:selected').text();
      _this.addOrEditAjax(formData).then(res => {
        layer.msg(res ||'操作成功', {icon: 1});
        layer.close(index);
        //刷新表格
        $('[lay-filter=nanningchooseprodform_submit]').trigger('click');
      });
    },
    //编辑功能,即详情
    EditHandle(data){
      nanningchooseprodName.handleAddOrEdit(data,2);
    },
    //导出功能
    exportHandle(){
      let _this = this;
      $('#nanningchooseprod_exportBtn').on('click', function(){
        let checkStatus = table.checkStatus('nanningchooseprod_tableId');
        //获取选中项的id
        let ids = checkStatus.data.map(item => item.id);
        //获取搜索条件
        let searchData = serializeObject($("#nanningchooseprodForm"));
        let newData = _this.handleData(searchData);
        transBlob({
          url: ctx + `/devChooseProd/exportDevChooseProd`,
          formData: JSON.stringify({
            idList: ids,
            ...newData
          }),
          contentType: 'application/json'
        }, 'post').then(function (result) {
          console.log(result || '导出成功', { icon: 1 })
        }).catch(function (err) {
          layer.alert(err , { icon: 2 })
        });
      });
      
    }
  }

  //采购状态
  nanningchooseprodName.purchaseStatusHandle();
  //渲染搜索条件
  nanningchooseprodName.renderSearchItem();
  //到处
  nanningchooseprodName.exportHandle();
  //新增选品信息
  $('#nanningchooseprod_addBtn').on('click', function(){
    nanningchooseprodName.handleAddOrEdit({site: '泰国'},1);
  });


  //监听表单搜索事件
  form.on('submit(nanningchooseprodform_submit)', function(data){
    let fieldData = data.field; //获取到表单提交对象
    let newData = nanningchooseprodName.handleData(fieldData);
    //渲染表格
    nanningchooseprodName.tableRender(newData);
});
});