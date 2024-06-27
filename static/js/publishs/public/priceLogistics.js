;
(function ($, layui, window, document, undefined) {
  var countryArr = [];
  //字号处理
  var fontSizeArr = [{key: 10,size: 10},{key: 12,size: 12},{key: 14,size: 14},{key: 18,size: 18},{key: 20,size: 20},{key: 24,size: 24},{key: 26,size: 26}];
  layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'upload', 'laydate'], function () {
    var admin = layui.admin,
      table = layui.table,
      element = layui.element,
      layer = layui.layer,
      laytpl = layui.laytpl,
      upload = layui.upload,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form;
    form.render();
    let priceLogisticsName = {
      //触发搜索事件
      trigClick: function(){
        $('[lay-filter=priceLogistics_submit]').trigger('click');
      },
      tree: function(){ //事件委托-物流树的渲染和点击事件
        var _this = this;
        function companyRender(){
          var getTpl = priceLogistics_provider.innerHTML;
          var getUl = document.getElementById('priceLogistics_tree');
          $.ajax({ //物流商渲染
            type: 'get',
            url: '/lms/company/specialType?specialType=定价',
            dataType: 'json',
            success: function(res){
                laytpl(getTpl).render(res, function(html){
                    getUl.innerHTML = html;
                });
            }
          });
        }
        companyRender();
        //物流商单击事件
        $('#priceLogistics_tree').on('click', 'li', function(){
            $(this).siblings('li').removeClass('layui-this');
            $(this).addClass('layui-this');
            var id = $(this).find('a').data('logistics');
            var $id = $('#priceLogistics_form').find("input[name=logisticsCompanyId]");
            $id.val(id);
            if($id.val() == id){
               _this.trigClick();
            }
        });
        //物流商设置事件
        $('#priceLogistics_tree').on('click', 'span.set', function(e){
            e.preventDefault();
            e.stopPropagation();
            var id = $(this).data('provider'); //物流商id
            let logisticsProvidersName = $(this).parents('li').find('a').text(); //物流商名称
            $.ajax({
                type: 'get',
                url: '/lms/company/config/'+id,
                dataType: 'json',
                beforeSend: function(){
                     loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        if(res.data.length != 0){
                            var companyData;
                            var index = layer.open({
                                type: 1,
                                title: '物流公司配置',
                                area: ['800px', '600px'],
                                btn:['保存','关闭'],
                                id: 'priceLogistics_logisticsCompanyLayerId', // 保证唯一性
                                content: $('#priceLogistics_logisticsCompanyLayer').html(),
                                success: function(layero, index){
                                    var formTemplate = priceLogistics_logisticsCompanyLayerFormTpl.innerHTML;
                                    var formDiv= document.getElementById('priceLogistics_logisticsCompanyLayerForm');
                                    laytpl(formTemplate).render(res, function(html){
                                        formDiv.innerHTML = html;
                                        form.render('select');
                                    });
                                    if (logisticsProvidersName == 'WISH邮') {
                                        console.log(layero.find('label'));
                                        var clientId;
                                        layero.find('label').each(function () {
                                            let currentProject = $(this).text()
                                            if(currentProject == '客户端ID'){
                                                clientId = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val();
                                            }else if (currentProject == '访问令牌' || currentProject == '刷新令牌') {
                                                $(this).parents('.layui-form-item.companyData').hide()
                                            }else if (currentProject == 'access_token有效日' || currentProject == 'refresh_token有效日') {
                                                let initTime = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(),
                                                  resultTime = Format(initTime, 'yyyy-MM-dd hh:mm:ss')
                                                $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(resultTime)
                                            }else if(currentProject == '授权链接'){
                                                let url = $(this).parents('.layui-form-item.companyData').find('input[data-name]').val();
                                                url = url + clientId + "&state=all&scope=user.order.write%20user.order.read%20user.order.read%20user.label.read%20user.tracking.read&force_login=false";
                                                $(this).parents('.layui-form-item.companyData').find('input[data-name]').val(url)
                                            }
                                        })
                                    }
                                },
                                yes: function(index, layero){
                                    $('[lay-filter=priceLogistics_logisticsCompanyLayerForm_submit]').trigger('click');
                                    var companyArr = [];
                                    var items = layero.find('form .layui-form-item.companyData');
                                    for(var i=0; i<items.length; i++){
                                        var item =items[i];
                                        var obj = {};
                                        obj.id = $(item).find('input[type=hidden]').val();
                                        obj.fieldDesc = $(item).find('label').text();
                                        obj.fieldName = $(item).find('.layui-input').data('name');
                                        obj.fieldValue = $(item).find('.layui-input').val();
                                        obj.logisticsCompanyId = id;
                                        if (obj.fieldDesc == "refresh_token有效日" || obj.fieldDesc == "access_token有效日") {
                                            let initTime = obj.fieldValue.replace(/-/g, '/')
                                            initTime = new Date(initTime)
                                            let resultTime = String(Date.parse(initTime))
                                            obj.fieldValue = resultTime.substr(0, resultTime.length - 3)
                                        }
                                        companyArr.push(obj);
                                    };
                                    //判断不能为空
                                    for(var j=0; j<companyArr.length; j++){
                                        var item= companyArr[j];
                                        for(var key in item){
                                            if(item[key]==''){
                                                return false;
                                            }
                                        }
                                    };
                                    //配置请求
                                    $.ajax({
                                        type: 'post',
                                        url: '/lms/company/config/update/'+id,
                                        dataType: 'json',
                                        contentType: 'application/json;charset=UTF-8',
                                        data: JSON.stringify(companyArr),
                                        beforeSend: function(){
                                           loading.show();
                                        },
                                        success: function(res){
                                            loading.hide();
                                            if(res.code == '0000'){
                                                layer.close(index);
                                                layer.msg('编辑成功');
                                            }else{
                                                layer.msg(res.msg);
                                            }
                                        },
                                        error: function(){
                                            loading.hide();
                                            layer.msg('服务器有错误,和页面无关联哦!');
                                        }
                                    });
                                }
                            });
                        }else{
                            layer.msg('无可配置项');
                        }
                    }else{
                        layer.msg('请求错误');
                    }
                }
            });               
        });
        //物流商排序点击事件
        $('#priceLogistics_tree').on('click', 'span.seq',function(e){
            e.preventDefault();
            e.stopPropagation();
            var seq = $(this).data('seq'); //物流公司排序
            var id = $(this).data('provider'); //物流商id
            var index = layer.open({
                type: 1,
                title:'排序',
                id: 'priceLogistics_logisticsCompany_seqId',
                area: ['300px', '200px'],
                btn: ['保存', '关闭'],
                content: $('#priceLogistics_logisticsCompany_seq').html(),
                success: function(layero,index){
                    layero.find('[name=seq]').val(seq);
                },
                yes: function(index, layero){
                    var newSeq = layero.find('[name=seq]').val();
                    if(!newSeq){
                        layer.msg('排序不能为空');
                        return;
                    }
                    //排序请求
                    $.ajax({
                        type: 'get',
                        url: '/lms/company/resort/'+id+'/'+seq+'/'+ newSeq,
                        dataType: 'json',
                        contentType: 'application/json;charset=UTF-8',
                        success: function(res){
                          if(res.code == '0000'){
                              layer.msg('排序成功');
                              layer.close(index);
                              companyRender();
                          }else{
                              layer.msg(res.msg);
                          }
                        }
                     })
                }
            })
        });

      },
      //导入计费功能
      importCost: function(){
        upload.render({
            elem: '#priceLogistics_importCost' //绑定元素
            ,url: `${ctx}/type/uploadCharging` //上传接口
            ,accept: 'file' //允许上传的文件类型
            ,exts: 'xlsx'
            ,done: function(res){
                if(res.code=="0000"){
                    layer.confirm(res.msg, {icon: 1, title:'提示'}, function(index){
                        layer.close(index);
                    });
                }else{
                    layer.confirm(res.msg, {icon: 2, title:'提示'}, function(index){
                        layer.close(index);
                    });
                }
            }
            ,error: function(){
                layer.msg('服务器出现故障!');
            }
        });
      },
      //新增功能
      add: function(){ //新增物流方式
        var _this= this;
        $('#priceLogistics_newAdd').on('click', function () {
          layer.open({
            type: 1,
            title: '新增定价物流',
            btn: ['保存', '关闭'],
            area: ['60%', '80%'],
            content: $('#priceLogistics_newAddLayer').html(),
            id: 'priceLogistics_newAddLayerId',
            success: function (layero, index) {
              Promise.all([commonReturnPromise({
                url: '/lms/company/specialType?specialType=定价',
              }),commonReturnPromise({
                url: '/lms/sys/getLogisRates?limit=500'
              })]).then(companyArr => {
                var $id = $('#priceLogistics_form').find("input[name=logisticsCompanyId]").val();
                var addData = {
                  name: '',
                  throwingWeightStatus: true,
                  throwingWeightType: 1,
                  throwingWeightParam: '',
                  logisticsCompanyId: $id,
                  logisticsCompanyArr: companyArr[0],
                  currencyLists: companyArr[1]
                };
                var formTemplate = priceLogistics_newAddLayerFormDivTemplate.innerHTML;
                var formDiv = document.getElementById('priceLogistics_newAddLayerFormDiv');
                laytpl(formTemplate).render(addData, function (html) {
                  formDiv.innerHTML = html;
                  form.render('select');
                  form.on('select(priceLogistics_throwingWeightStatus_filter)', function (data) {
                    var val = data.value;
                    if (val == 'true') {
                      layero.find('.priceLogisticsStatus_show').removeClass('disN');
                    } else {
                      layero.find('.priceLogisticsStatus_show').addClass('disN');
                    }
                  })
                });
              });
            },
            yes: function (index, layero) {
              var formData = serializeObject($('#priceLogistics_newAddLayerForm'));
              formData.params = [];
              formData.status = true;
              formData.ifSaleLogisticsTypeDefault = false;
              formData.labelSize = "100*100";
              formData.shopElfTypeName = "";
              formData.agent = "";
              formData.autoApplyTrackNum = "true";
              formData.discountRate = 1;
              if (formData.throwingWeightStatus == 'true') {
                if (!formData.throwingWeightType) {
                  layer.msg("请选择抛重计算方式", { icon: 7 });
                  return false;
                }
                if (!formData.throwingWeightParam) {
                  layer.msg("请设置抛重参数", { icon: 7 });
                  return false;
                }
                if (!formData.weightProportion) {
                  layer.msg("请设置抛实/重比例", { icon: 7 });
                  return false;
                }
                if (!formData.materialCoefficient) {
                  layer.msg("请输入材积系数", { icon: 7 });
                  return false;
                }
              } else {
                formData.throwingWeightType = '';
                formData.throwingWeightParam = '';
                formData.weightProportion = '';
                formData.materialCoefficient = '';
              }
              commonReturnPromise({
                type: 'post',
                url: '/lms/type/add',
                params: JSON.stringify(formData),
                contentType: 'application/json;charset=UTF-8',
              }).then(saveRes => {
                layer.close(index);
                _this.trigClick();
                layer.msg(saveRes, { icon: 1 });
              });
            }
          })
        });
      },
      //表格搜索
      tableRender: function (data) {
        var _this = this;
        table.render({
            elem: '#priceLogistics_table',
            method: 'post',
            url: '/lms/type/list/specialType',
            where:  data,
            cols: [
                [ //表头
                    {type: 'checkbox',width: 30}
                    ,{title: '物流方式',field: 'name'}
                    ,{title: '计算抛重方式',templet: '#priceLogistics_tableCalcWay'}
                    ,{title: '计算抛重参数', field: 'throwingWeightParam'}
                    ,{title: '抛/实重比例≥', field: 'weightProportion'}
                    ,{title: '状态',templet: '#priceLogistics_tableStatus'}
                    ,{title: '操作', align:'center', toolbar: '#priceLogistics_tableIdBar', width: 100}
                ]
            ],
            page: true,
            id: "priceLogistics_tableId",
            limits: [50, 100, 300],
            limit: 50,
            done: function(res){                  
                //工具条监听事件
                _this.watchBar();
                //监听switch变化
                for(var i=0;i<res.data.length;i++){
                    delete res.data[i].createTime;
                    delete res.data[i].updateTime;
                    _this.watchSwitch(res.data[i]);
                    // _this.watchButton(res.data[i]);
                };   
            }
        });
      },
      //监听开关开启/关闭
      watchSwitch: function (info) { // 监听开关的变化
        var _this = this;
        var id = info.id;
        var filterStatus = 'priceLogistics_tableStatus'+id;
        var filterAuto = 'priceLogistics_tableAuto'+id;
        var modifyFn = function (dt) {
          commonReturnPromise({
            type: 'post',
            url: '/lms/type/update/' + id,
            params: JSON.stringify(dt),
            contentType: 'application/json;charset=UTF-8',
          }).then(res => {
            _this.trigClick();
            layer.msg(res, {icon:1});
          })
        };
        form.on(`switch(${filterStatus})`, function(data){
            info.status = data.elem.checked; //开关是否开启，true或者false
            // console.log(info);
            modifyFn(info);
        }); 
        form.on(`switch(${filterAuto})`, function(data){
            info.autoApplyTrackNum = data.elem.checked; //开关是否开启，true或者false
            // console.log(info);
            modifyFn(info);
        }); 
      },
      //工具条监听事件
      watchBar: function () {
        var _this = this;
        table.on('tool(priceLogistics_tableFilter)', function (obj) {
          var data = obj.data;
          var logisTypeName = data.name; //物流方式名称
          if (obj.event == 'edit') { //编辑弹框
            _this.tableEditLayer(data);
          } else if (obj.event == 'billing') { //区域计费详情
            _this.tableBillingLayer(data);
          }
        });
      },
      //#region 编辑弹框
      tableEditLayer: function (data) {
        var _this = this;
        layer.open({
          type: 1,
          title: '编辑物流方式',
          area: ['60%', '80%'],
          btn: ['保存', '关闭'],
          content: $('#priceLogistics_newAddLayer').html(),
          id: 'priceLogistics_newAddLayerId',
          success: function (layero, index) {
            Promise.all([commonReturnPromise({
              url: '/lms/company/specialType?specialType=定价',
            }),commonReturnPromise({
              url: '/lms/sys/getLogisRates?limit=500'
            })]).then(companyArr => {
              data.logisticsCompanyArr = companyArr[0];
              data.currencyLists = companyArr[1];
              var formTemplate = priceLogistics_newAddLayerFormDivTemplate.innerHTML;
              var formDiv = document.getElementById('priceLogistics_newAddLayerFormDiv');
              laytpl(formTemplate).render(data, function (html) {
                formDiv.innerHTML = html;
                form.render('select');
                form.on('select(priceLogistics_throwingWeightStatus_filter)', function (data) {
                  var val = data.value;
                  if (val == 'true') {
                    layero.find('.priceLogisticsStatus_show').removeClass('disN');
                  } else {
                    layero.find('.priceLogisticsStatus_show').addClass('disN');
                  }
                })
              });
            });
          },
          yes: function (index, layero) {
            var formData = serializeObject($('#priceLogistics_newAddLayerForm'));
            formData.params = [];
            formData.status = true;
            formData.ifSaleLogisticsTypeDefault = false;
            formData.labelSize = "100*100";
            formData.shopElfTypeName = "";
            formData.agent = "";
            formData.autoApplyTrackNum = "true";
            formData.discountRate = 1;
            if (formData.throwingWeightStatus == 'true') {
              if (!formData.throwingWeightType) {
                layer.msg("请选择抛重计算方式", { icon: 7 });
                return false;
              }
              if (!formData.throwingWeightParam) {
                layer.msg("请设置抛重参数", { icon: 7 });
                return false;
              }
              if (!formData.weightProportion) {
                layer.msg("请设置抛实/重比例", { icon: 7 });
                return false;
              }
              if (!formData.materialCoefficient) {
                layer.msg("请输入材积系数", { icon: 7 });
                return false;
              }
            } else {
              formData.throwingWeightType = '';
              formData.throwingWeightParam = '';
              formData.weightProportion = '';
              formData.materialCoefficient = '';
            }
            var id = data.id;
            formData.id = id;
            commonReturnPromise({
              type: 'post',
              url: '/lms/type/update/' + id,
              params: JSON.stringify(formData),
              contentType: 'application/json;charset=UTF-8',
            }).then(res => {
              layer.close(index);
              _this.trigClick();
              layer.msg(res, {icon: 1});
            });
          }
        });
      },
      //获取到所有的属性请求
      getAllAttr: function () { //获取到所有的属性
        return commonReturnPromise({
          url: '/lms/type/init'
        });
      },
      //获取货代公司
      getGoodsAgent: function (pre,dom,selected) {
        commonReturnPromise({
          url: '/lms/type/listByHeadCodeByAgent.html',
          type: 'post'
        }).then(res => {
          var options = '<option value="">请选择</option>'
          for(var i in res){
              if(selected&&res[i].code==selected){
                  options +='<option value="'+res[i].code+'" selected>'+res[i].name+'</option>'
              }else{
                  options +='<option value="'+res[i].code+'">'+res[i].name+'</option>'
              }
          }
          $(pre + ' #' + dom).append(options);
          form.render('select');
          form.render('checkbox');
        })
      },
      //#endregion

      //#region 区域计费弹框
      tableBillingLayer: function (data) {
        var _this = this;
        var logisTypeId = data.id; //物流方式的id
        layer.open({
          type: 1,
          title: '区域计费信息',
          area: ['1100px', '800px'],
          btn: ['保存', '关闭'],
          content: $('#priceLogistics_regionalPrice').html(),
          success: function (layero, index) {
            upload.render({
              elem: '#priceLogistics_areaZipCodeRelationTempImport' //绑定元素
              , url: `${ctx}/areaZipCodeRelation/uploadAreaZipCodeRelation.html` //上传接口
              , accept: 'file' //允许上传的文件类型
              , exts: 'xls'
              , done: function (res) {
                if (res.code == "0000") {
                  layer.msg(res.msg, { icon: 1 });
                } else {
                  layer.msg(res.msg, { icon: 5 });
                }
              }
              , error: function () {
                layer.msg('服务器出现故障!');
              }
            });
            // 弹框表格渲染(默认渲染)
            _this.regionalPriceTableRender({ countryAbbr: '',currency: data.currency }, logisTypeId);
            $('#priceLogistics_regionalPriceTableSearch').on('click', function () {
              var val = $('#priceLogistics_regionalPriceInput').val();
              _this.regionalPriceTableRender({ countryAbbr: val,currency: data.currency }, logisTypeId);
            });
            $('#priceLogistics_regionalPriceTableEmpty').on('click', function () {
              $('#priceLogistics_regionalPriceInput').val('');
            });
            //添加功能
            _this.addDHLClick(logisTypeId, data.currency);
            //导出计费
            _this.exportHandle(layero,logisTypeId);
          }
        });
      },
      // 新增区域计费
      addDHLClick: function(id, currency){
        var _this = this;
        var regionalPriceAddData;
        $('#priceLogistics_addNewDHLPrice').on('click',function(){
          layer.open({
            type: 1,
            title: '新增区域计费',
            btn: ['保存', '关闭'],
            area: ['800px', '600px'],
            content: $('#priceLogistics_regionalPriceEdit').html(),
            success: function (layero, index) {
              _this.addDHLData(id, currency);
              form.on('submit(priceLogistics_regionalPriceEditForm_submit)', function (data) {
                var data = data.field; //获取到表单提交对象
                regionalPriceAddData = data;
                return false;
              })
            },
            yes: function (index, layero) {
              $('[lay-filter=priceLogistics_regionalPriceEditForm_submit]').trigger('click');
              var areaCountry = regionalPriceAddData.city;
              delete regionalPriceAddData.city;
              regionalPriceAddData.areaCountry = areaCountry;
              regionalPriceAddData.logisTypeId = id;
              commonReturnPromise({
                type: 'post',
                url: '/lms/type/area/charging/save',
                contentType: 'application/json;charset=UTF-8',
                params: JSON.stringify(regionalPriceAddData),
              }).then(res => {
                layer.close(index);
                layer.msg(res, {icon:1});
                _this.regionalPriceTableRender({countryAbbr: '', currency: currency}, id);
              });
            }
          });
        });
      },
      addDHLData: function(id,currency){ //添加计费信息
        var addData = {
            addedWeight: '',
            addedCost: '',
            area: '',
            firstCost: '',
            firstWeight: '',
            areaNumber: '',
            operationCost: '',
            noDiscountCharges: '',
            areaCountry: '',
            areaDiscount: '',
            // materialCoefficient: '',
            maxWeight: '',
            currency: currency
        };
        addData.countryArr = countryArr;
        addData.logisTypeId = id;
        var formTemplate = priceLogistics_regionalPriceEditFormTpl.innerHTML;
        var formDiv= document.getElementById('priceLogistics_regionalPriceEditForm');
        laytpl(formTemplate).render(addData, function(html){
            formDiv.innerHTML = html;
            form.render('select');
            formSelects.render();
        });
     },
      //导出计费
      exportHandle: function(layero,logisTypeId){
        layero.find('#priceLogistics_exportCostInfo').on('click', function(){
            submitForm({"typeId": logisTypeId}, '/lms/type/export/charging.html');
        });
      },
      //区域计费表格渲染
      regionalPriceTableRender: function(data,id){
        var _this = this;
        let currency = data.currency || '';
        table.render({
            elem: '#priceLogistics_regionalPriceTable',
            method: 'post',
            url: '/lms/type/area/charging?logiticsTypeId='+id,
            where: data,
            cols: [
                [ //表头
                     {type: 'checkbox'}
                    ,{title: '国家',field: 'chName'}
                    ,{title: '首重(g)',field: 'firstWeight'}
                    ,{title: `首费(${currency})`, field: 'firstCost'}
                    ,{title: '续重(g)',field: 'addedWeight'}
                    ,{title: `续费(${currency})`, field: 'addedCost'}
                    ,{title: '操作费(不参与折扣)', field: 'operationCost'}
                    ,{title: '上限重量(g)', field: 'maxWeight'}
                    // ,{title: '材积系数', field: 'materialCoefficient'}
                    ,{title: '区域', field: 'area'}
                    ,{title: '操作', align:'center', toolbar: '#priceLogistics_regionalPriceTableBar'}
               ]
            ],
            page: true,
            id: "priceLogistics_regionalPriceTable_tableId",
            limits: [50, 100, 300],
            limit: 50,
            done: function(){
                //工具条监听事件
                _this.regionalPriceWatchBar(id);
                //批量删除
                _this.batchDel(id);
                _this.areaZipMapping(id);
                _this.areaCityMapping(id);

            }
        });
      },
      //区域计费表格监听
      regionalPriceWatchBar: function(id){
        var _this= this;
        var regionalPriceData;
        table.on('tool(priceLogistics_regionalPriceTableFilter)', function (obj) {
          var data = obj.data;
          if (obj.event == 'edit') {
            var index = layer.open({
              type: 1,
              title: '设置区域计费',
              btn: ['保存', '关闭'],
              area: ['800px', '600px'],
              content: $('#priceLogistics_regionalPriceEdit').html(),
              id: 'priceLogistics_regionalPriceEditId',
              success: function (layero, index) {
                data.countryArr = countryArr;
                var formTemplate = priceLogistics_regionalPriceEditFormTpl.innerHTML;
                var formDiv = document.getElementById('priceLogistics_regionalPriceEditForm');
                laytpl(formTemplate).render(data, function (html) {
                  formDiv.innerHTML = html;
                  form.render('select');
                  // formSelects.render();
                });
                form.on('submit(priceLogistics_regionalPriceEditForm_submit)', function (data) {
                  var data = data.field; //获取到表单提交对象
                  regionalPriceData = data;
                  return false;
                });
              },
              yes: function (index, layero) {
                $('[lay-filter=priceLogistics_regionalPriceEditForm_submit]').trigger('click');
                var areaCountry = regionalPriceData.city;
                delete regionalPriceData.city;
                regionalPriceData.areaCountry = areaCountry;
                regionalPriceData.logisTypeId = data.logisTypeId;
                commonReturnPromise({
                  type: 'post',
                  url: '/lms/type/area/charging/save',
                  contentType: 'application/json;charset=UTF-8',
                  params: JSON.stringify(regionalPriceData),
                }).then(res => {
                  layer.close(index);
                  layer.msg(res, {icon:1});
                  _this.regionalPriceTableRender({ countryAbbr: '',currency: data.currency }, regionalPriceData.logisTypeId);
                });
              }
            });
          } else if (obj.event == 'del') {
            layer.confirm('确定删除？', function (index) {
              commonReturnPromise({
                url: '/lms/type/area/charging/delete/?ids=' + data.id,
              }).then(res => {
                layer.msg(res, {icon: 1});
                _this.regionalPriceTableRender({ countryAbbr: '' }, id);
              });    
            });  
          }
        });
      },
      country: function(){ //国家数据处理
        $.ajax({
            type: 'get',
            url: '/lms/type/area/charging/country',
            dataType: 'json',
            success: function(res){
                if(res.code == '0000'){
                    var data = res.data;
                    var arr = [];
                    for(var item in data){
                        var sgItem = data[item];
                        for(var i=0; i<sgItem.length; i++){
                            var obj = {
                               name: sgItem[i].name,
                               value: sgItem[i].abbr
                            };
                            arr.push(obj)
                        }
                    };
                    countryArr =arr;
                }else{
                    layer.msg('获取国家列表失败');
                }
            }
        })
      },
      //批量删除
      batchDel: function(id){
        var _this= this;
        $('#priceLogistics_batchDHLPrice').on('click', function(){
            var checkStatus = table.checkStatus('priceLogistics_regionalPriceTable_tableId'),
            selData = checkStatus.data;
            var idsArr = [];
            let currency = selData[0]['currency'] || '';
            for(var i=0; i<selData.length; i++){
                idsArr.push(selData[i].id);
            }
            if(!idsArr.length){
                layer.msg('请先选中要删除的数据!');
                return false;
            }
            var ids = idsArr.join();
          layer.confirm('确定删除？', function (index) {
            commonReturnPromise({
              url: '/lms/type/area/charging/delete/?ids=' + ids,
            }).then(res => {
              layer.msg(res, {icon:1});
              _this.regionalPriceTableRender({ countryAbbr: '', currency: currency }, id);
            });

          });
        })
      },
      //区域邮编映射
      areaZipMapping: function(){
        var _this = this;
        $('#priceLogistics_areaDHLPriceCodeMapping').on('click',function(){
            var checkedArr= table.checkStatus('priceLogistics_regionalPriceTable_tableId').data;
            if(checkedArr.length == 0){
                layer.msg('必须先选中一条数据');
                return;
            }else if(checkedArr.length > 1){
                layer.msg('只允许单选');
                return;
            }else if(checkedArr.length == 1){
                if(!checkedArr[0].area){
                    layer.msg('区域不能为空');
                    return;
            };
              commonReturnPromise({
                url: '/lms/areaZipCodeRelation/query.html',
                params: {
                  areaChargingId: checkedArr[0]['id']
                }
              }).then(res => {
                layer.open({
                  type: 1,
                  title: '区域邮编映射',
                  btn: ['保存', '关闭'],
                  area: ['500px', '400px'],
                  content: $('#priceLogistics_areaDHLPriceCodeMappingLayer').html(),
                  id: 'priceLogistics_areaDHLPriceCodeMappingLayerId',
                  success: function (layero, index) {
                    var data = res.data;
                    var $tbody = $("#priceLogistics_CodeMappingTable_tbody");
                    if (data.length) {
                      for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if (item.zipCodeBegin == null || item.zipCodeBegin == '' ||
                          item.zipCodeEnd == null || item.zipCodeEnd == '') {
                          continue;
                        }
                        var str = `<tr>
                                  <td>${item.zipCodeBegin}</td>
                                  <td>${item.zipCodeEnd}</td>
                                  <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="commonDelTr(this)">删除</span></td>
                                  </tr>`;
                        $tbody.append(str);
                      };
                    }
                    $('#priceLogistics_CodeMappingTable_tbody_add').on('click', function () {
                      var grt = layero.find('[name=zipCodeGreatThanAndEqual]').val();
                      var lt = layero.find('[name=zipCodeLessThan]').val();
                      if (grt == null || grt == '' || lt == null || lt == '') {
                        layer.msg("邮编起始值和结束值都需要填写！")
                        return;
                      }
                      var str = `<tr>
                                  <td>${grt}</td>
                                  <td>${lt}</td>
                                  <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="commonDelTr(this)">删除</span></td>
                                  </tr>`;
                      $tbody.append(str);
                      layero.find('[name=zipCodeGreatThanAndEqual]').val('');
                      layero.find('[name=zipCodeLessThan]').val('');
                    });
                  },
                  yes: function (index, layero) {
                    var putObj = {};
                    var data = checkedArr[0];
                    putObj.area = data.area;
                    putObj.countryCode = data.areaCountry;
                    putObj.typeId = data.logisTypeId;
                    var $trs = $('#priceLogistics_CodeMappingTable_tbody').find('tr');
                    var tdsArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                      var tr = $trs[i];
                      var obj = {};
                      obj.zipCodeBegin = $(tr).find('td:first-child').text();
                      obj.zipCodeEnd = $(tr).find('td:nth-child(2)').text();
                      tdsArr.push(obj);
                    }
                    putObj.list = tdsArr;
                    commonReturnPromise({
                      url: '/lms/areaZipCodeRelation/save.html',
                      type: 'post',
                      contentType: 'application/json;charset=UTF-8',
                      params: JSON.stringify(putObj),
                    }).then(res => {
                      layer.close(index);
                      layer.msg(res, { icon: 1 });
                    });
                  }
                });
              });
            }    
        });
      },
      //区域城市映射
      areaCityMapping: function(){
        var _this = this;
        $('#priceLogistics_areaCityCodeMapping').on('click',function(){
            var checkedArr= table.checkStatus('priceLogistics_regionalPriceTable_tableId').data;
            if(checkedArr.length == 0){
                layer.msg('必须先选中一条数据');
                return;
            }else if(checkedArr.length > 1){
                layer.msg('只允许单选');
                return;
            }else if(checkedArr.length == 1){
                if(!checkedArr[0].area){
                    layer.msg('区域不能为空');
                    return;
              };
              commonReturnPromise({
                url: '/lms/areaZipCodeRelation/query.html',
                params: {
                  areaChargingId: checkedArr[0]['id']
                },
              }).then(res => {
                layer.open({
                  type: 1,
                  title: '城市区域映射',
                  btn: ['保存', '关闭'],
                  area: ['600px', '500px'],
                  content: $('#priceLogistics_areaCityCodeMappingLayer').html(),
                  id: 'priceLogistics_areaDHLPriceCodeMappingLayerId',
                  success: function (layero, index) {
                    var data = res.data;
                    var $tbody = $("#priceLogistics_areaCityCodeMappingTable_tbody");
                    if (data.length) {
                      for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if ((item.logisticsProvince == null || item.logisticsProvince == '') &&
                          (item.logisticsCity == null || item.logisticsCity == '')) {
                          continue;
                        }
                        var str = `<tr>
                                    <td>${item.logisticsProvince}</td>
                                    <td>${item.logisticsCity}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="commonDelTr(this)">删除</span></td>
                                    </tr>`;
                        $tbody.append(str);
                      };
                    }
                    $('#priceLogistics_areaCityCodeMappingTable_tbody_add').on('click', function () {
                      var province = layero.find('[name=logisticsProvince]').val();
                      var city = layero.find('[name=logisticsCity]').val();
                      if ((province == null || province == '') && (city == null || city == '')) {
                        layer.msg("至少填写一项！")
                        return;
                      }
                      var str = `<tr>
                                    <td>${province}</td>
                                    <td>${city}</td>
                                    <td><span class="layui-btn layui-btn-xs layui-btn-primary" onclick="commonDelTr(this)">删除</span></td>
                                    </tr>`;
                      $tbody.append(str);
                      layero.find('[name=logisticsProvince]').val('');
                      layero.find('[name=logisticsCity]').val('');
                    })
                  },
                  yes: function (index, layero) {
                    var putObj = {};
                    var data = checkedArr[0];
                    putObj.area = data.area;
                    putObj.countryCode = data.areaCountry;
                    putObj.typeId = data.logisTypeId;
                    var $trs = $('#priceLogistics_areaCityCodeMappingTable_tbody').find('tr');
                    var tdsArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                      var tr = $trs[i];
                      var obj = {};
                      obj.logisticsProvince = $(tr).find('td:first-child').text();
                      obj.logisticsCity = $(tr).find('td:nth-child(2)').text();
                      tdsArr.push(obj);
                    }
                    putObj.list = tdsArr;
                    commonReturnPromise({
                      type: 'post',
                      url: '/lms/areaZipCodeRelation/save.html',
                      contentType: 'application/json;charset=UTF-8',
                      params: JSON.stringify(putObj),
                    }).then(res => {
                      layer.close(index);
                      layer.msg(res, { icon: 1 });
                    });

                  }
                });
              });
            }
        });
      },
      //#endregion

    };
    //导入计费
    priceLogisticsName.importCost();
    //新增
    priceLogisticsName.add();
    //物流商展示
    priceLogisticsName.tree();
    priceLogisticsName.country();
    //物流方式搜索的表单提交事件
    form.on('submit(priceLogistics_submit)', function(data){
      var data = data.field; //获取到表单提交对象
      data.specialType = '定价';
      priceLogisticsName.tableRender(data);
      return false;
    });
  });
})(jQuery, layui, window, document);