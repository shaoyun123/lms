;
(function ($, layui, window, document, undefined) {
  layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'laydate'], function () {
    let admin = layui.admin,
      table = layui.table,
      element = layui.element,
      layer = layui.layer,
      laytpl = layui.laytpl,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form;
    form.render();

    let dimensionName = {
      init () {
        // 初始化 组织-人员选择框
        render_hp_orgs_users('#dimensionSearchForm');
        //渲染时间[默认一个月]
        let dimension_nowDateString = new Date().getTime();
        let dimension_dateFiftweenSting = dimension_nowDateString - 365/2*24*60*60*1000;
        let dimension_dateStart = Format(dimension_dateFiftweenSting, 'yyyy-MM-dd');
        let dimension_dateEnd = Format(dimension_nowDateString, 'yyyy-MM-dd');
        laydate.render({
          elem: '#dimension_times',
          range: true,
          todayBtn: true,
          value: dimension_dateStart +' - '+ dimension_dateEnd
        });
        this.initAjax().then(res => {
          let { measureTypeMaps } = res;
          //渲染需求类型
          commonRenderSelect('dimension_measureType', measureTypeMaps, { name: 'value', code: 'name' }).then(() => {
            form.render('select');
          });
        }).catch(err => {
          layer.msg(err, { icon: 2 });
        });
      },
      initAjax () {
        return commonReturnPromise({
          url: '/lms/dimensionMeasure/listenum.html'
        });
      },
      tabHandle () {
        let $measureStatus = $('#dimensionSearchForm [name=measureStatus]');
        element.on('tab(dimension_tabs)', function (data) {
          let index = data.index;
          if (index == 3) {
            $measureStatus.val('');
            $('.measurableShowOrHide').addClass('disN');
          } else {
            $measureStatus.val(index);
            if (index == 0) {;
              $('.measurableShowOrHide').removeClass('disN');
            } else {
              $('.measurableShowOrHide').addClass('disN');
            }
          }
          //触发搜索事件
          $('[lay-filter=dimension_submit]').trigger('click');
        });
      },
      dataHandle (data) {
        if (data.times) {
          let timeArr = data.times.split(' - ');
          data.timeStart = timeArr[0] + ' 00:00:00';
          data.timeEnd = timeArr[1] + ' 23:59:59';
        }else {
          data.timeStart = '';
          data.timeEnd = '';
        }
        if (data.measurable == 'on') {
          data.measurable = 1;
        }
        if (data.organize) {//部门选择
          let $opts = $('#dimensionSearchForm').find('select[name=bizzOwnerIdListStr]>option');
          let arr = [];
          for (let i = 0; i < $opts.length; i++){
            let $opt = $($opts[i]);
            if ($opt.text() != '') {
              arr.push($opt.attr('value'));
            }
          }
          data.bizzOwnerIdListStr = arr.join(',');
        }
        delete data.organize;
        delete data.times;
        return data;
      },
      tableRender (data) {
        let _this = this;
        table.render({
          elem: '#dimension_table',
          url: '/lms/dimensionMeasure/queryPage.html',
          method: 'post',
          page: true,
          where: data,
          id: "dimension_tableId",
          limits: [50, 100, 300, 500],
          limit: 100,
          cols: [
            [
              {type:'checkbox', width: 30},
              { title: '图片', field: 'productImage', templet: '#dimension_productImage' },
              { title: 'SKU', field: 'sSku', templet: '#dimension_sSku' },
              { title: '中文名称', field: 'title'},
              { title: '需求类型', field: 'measureType', templet: '#dimension_measureTypeTable' },
              { title: '义乌仓信息', field: 'locationName', templet: '#dimension_locationName' },
              { title: '商品信息', field: 'prodInfo', templet: '#dimension_prodInfo' },
              { title: '测量信息', field: 'measureInfo', templet: '#dimension_measureInfo' },
              { title: '同步状态', field: 'syncStatus', templet: '#dimension_syncStatus' },
              {title: '绝对差值', field: 'absDiff', templet: '#dimension_absDiff'},
              // { title: '仓库图片', field: '', templet: '' },
              { title: '备注', field: 'remark' , templet: '#dimension_remark'},
              { title: '人员', field: 'persons', templet: '#dimension_persons' },
              { title: '时间', field: 'times', templet: '#dimension_timesTable', width: 138},
              { title: '操作', width: 150, align: 'center', toolbar: '#dimensionBar' }
            ]
          ],
          done: function () {
            imageLazyload();
            _this.watchBar();
            //渲染切换数量
            _this.renderNum(data);
          }
        });
      },
      watchBar () {
        table.on('tool(dimension_tableFilter)', function (obj) {
          let data = obj.data;
          if (obj.event == "retest") { //复测
            commonReturnPromise({
              url: '/lms/dimensionMeasure/repetitiveMeasure.html',
              params: {
                id: data.id
              }
            }).then(res => {
              layer.msg(res, { icon: 1 });
              $('[lay-filter=dimension_submit]').trigger('click');
            }).catch(err => {
              layer.msg(err, { icon: 7 });
            });
          } else if (obj.event == "nomeasure") { //无法测量
            layer.prompt({
              formType: 2,
              title: '请输入无法测量原因(必填)',
            }, function(value, index){
              commonReturnPromise({
                url: '/lms/dimensionMeasure/unableMeasure.html',
                params: {
                  ids: data.id,
                  unmeasureReason: value
                }
              }).then(res => {
                layer.close(index);
                layui.admin.batchResultObjAlert("无法测量完成:", res, function () {
                  $('[lay-filter=dimension_submit]').trigger('click');
                });
              }).catch(err => {
                layer.msg(err, { icon: 7 });
              });
            });
          }
        });
      },
      renderNum (_data) {
        let data = JSON.parse(JSON.stringify(_data))
        delete data.measureStatus;
        let $tabs = $('#dimension_tabs');
        commonReturnPromise({
          url: '/lms/dimensionMeasure/countStatusForTab.html',
          type: 'post',
          params: data
        }).then(res => {
          let { if_measure_un, if_measure_all, if_measure_false, if_measure_true } = res;
          let $spans = $tabs.find('.layui-tab-title li>span');
          for (let i = 0; i < $spans.length; i++){
            let span = $spans[i];
            let index = $(span).attr('data-index');
            if (index == 0) {
              $(span).text(`(${if_measure_false})`);
            } else if (index == 1) {
              $(span).text(`(${if_measure_true})`);
            } else if (index == 2) {
              $(span).text(`(${if_measure_un})`);
            } else if(index==3){
              $(span).text(`(${if_measure_all})`);
            }
          }
        });
      },
      batchDel () {
        $('#dimension_batchDel').on('click', function () {
          commonTableCksSelected('dimension_tableId').then(res => {
            let idsArr = res.map(item => item.id) || [];
            layer.confirm('确定删除选中的数据吗?', { icon: 7 }, function () {
              commonReturnPromise({
                url: '/lms/dimensionMeasure/deleteMeasureData.html',
                type: 'post',
                params: {
                  ids: idsArr.join(',')
                }
              }).then(result => {
                layui.admin.batchResultObjAlert("批量删除完成:", result, function () {
                  $('[lay-filter=dimension_submit]').trigger('click');
                });
              });
            });
          }).catch(err => {
            layer.msg(err, { icon: 7 });
          });
        });
      },
      export () {
        let _this = this;
        $('#dimension_export').on('click', function () {
          commonTableCksSelected('dimension_tableId').then(tableRes => {
            let idsArr = tableRes.map(item => item.id) || [];
            layer.confirm('确定导出勾选的数据吗?', { icon: 7 }, function (index) {
              submitForm({ ids: idsArr.join(',') }, '/lms/dimensionMeasure/exportorder.html', '_blank');
              layer.close(index);
            });
          }).catch(() => {
            let data = serializeObject($('#dimensionSearchForm'));
            let submitData = _this.dataHandle(data);
            commonReturnPromise({
              type: 'post',
              url: '/lms/dimensionMeasure/queryPage.html',
              params: { ...submitData, page: 1, limit: 100000}
            }).then(res => {
              let idsArr = (res || []).map(item => item.id) || [];
              if (idsArr.length == 0) {
                layer.msg('没有需要导出的数据', { icon: 1 });
              } else {
                layer.confirm('确定导出全部的数据吗?', { icon: 7 }, function (index) {
                  submitForm({ ids: idsArr.join(',') }, '/lms/dimensionMeasure/exportorder.html', '_blank');
                  layer.close(index);
                });
              }
            }).catch(err => {
              layer.msg('获取全部数据出错', { icon: 2 });
            });
          });
        });
      },
      add () {
        let _this = this;
        $('#dimension_add').on('click', function () {
          layer.open({
            type: 1,
            title: '新增测量需求',
            content: $('#dimension_addLayer').html(),
            id: 'dimension_addLayerId',
            btn: ['保存', '关闭'],
            area: ['60%','60%'],
            success: function (layero, index) {
              _this.initAjax().then(res => {
                let { measureTypeMaps } = res;
                //渲染需求类型
                commonRenderSelect('dimension_measureTypeLayer', measureTypeMaps, { name: 'value', code: 'name' }).then(() => {
                  form.render('select');
                });
              }).catch(err => {
                layer.msg(err, { icon: 2 });
              });
            },
            yes: function (index, layero) {
              let formData = serializeObject(layero.find('form'));
              if (!formData.measureType || !formData.skusStr) {
                return layer.msg('需求类型/子SKU必填', { icon: 7 });
              }
              let skusArr = formData.skusStr.split('\r\n');
              formData.skusStr = skusArr.join(',');
              _this.addAjax(formData).then(res => {
                layer.msg(res || '新增成功', { icon: 1 });
                layer.close(index);
                $('[lay-filter=dimension_submit]').trigger('click');
              }).catch(layerErr => {
                layer.msg(layerErr, { icon: 2 });
              });
            }
          });
        });
      },
      addAjax (obj) {
        return commonReturnPromise({
          url: '/lms/dimensionMeasure/insertMeasureData.html',
          type: 'post',
          params: obj
        });
      },
      //#region 测量相关
      measure () {
        let _this = this;
        $('#dimension_measureLayerBtn').on('click', function () {
          layer.open({
            type: 1,
            title: '尺寸测量',
            btn: ['关闭'],
            area: ['100%', '700px'],
            content: $('#dimensionDetail_layer').html(),
            id: 'dimensionDetail_layerId',
            success: function (layero, index) {
              //渲染仓库
              _this.getWarehouseAjax().then(res => {
                commonRenderSelect('dimension_warehouseLayer', res, { name: 'warehouseName', code: 'id' }).then(() => {
                  form.render('select');
                });
              });
              // 表单搜索事件
              form.on('submit(dimensionLayer_submit)', function (obj) {
                let data = obj.field; //获取到表单提交对象
                _this.getBatchTable(data, layero);
              });
              //监听input输入
              layero.on('input', '[ztt-verify=priority]', function(e){
                var val= e.target.value.trim();
                if(!val || val == 0){
                    if(!$(e.target).hasClass('layui-form-danger')){
                        $(e.target).addClass('layui-form-danger').focus();
                        layer.msg('必填项不能为空或0', {
                            offset: ['70px'],
                            icon: 2
                        });
                    }
                }else{
                    $(e.target).removeClass('layui-form-danger').focus();
                }
            });
            },
            end: function () {
              localStorage.removeItem('dimension_measureCopy');
              $('[lay-filter=dimension_submit]').trigger('click');
            }
          });
        });
      },
      //渲染表格
      getBatchTable (data,layero) {
        var _this = this;
        table.render({
          elem: '#dimensionLayer_table',
          method: 'post',
          url: '/lms/dimensionMeasure/queryDataByBatchNo.html',
          where: data,
          page: false,
          height: 430,
          limits: [50, 100, 300],
          limit: 50,
          id: "dimensionLayer_tableId",
          cols: [
            [
              { title: '图片', field: 'image', templet: '#dimensionLayer_img', width: 70 },
              { title: 'SKU', field: 'sSku'},
              { title: '库位', templet: '#dimensionLayer_location_batch' },
              { title: '可用库存', field: 'whStockWarning', templet: '#dimensionLayer_whStockWarning', width: 90 },
              { title: '楼栋', templet: '#dimensionLayer_buildingNo', width: 45 },
              { title: '楼层', templet: '#dimensionLayer_floor', width: 45 },
              { title: '款式', templet: '#dimensionLayer_style_batch' },
              { title: '需求类型', field: 'measureType', templet: '#dimension_measureLayerTypeTable' },
              { title: '无法测量原因(点击编辑)', field: 'unmeasure_reason', edit: 'text', width: 100 },
              { title: '<font color="red">*</font>重量(g)', templet: '#dimensionLayer_weight', width: 100 },
              { title: '<font color="red">*</font>包裹长(cm)', templet: '#dimensionLayer_length', width: 100 },
              { title: '<font color="red">*</font>包裹宽(cm)', templet: '#dimensionLayer_width', width: 100 },
              { title: '<font color="red">*</font>包裹高(cm)', templet: '#dimensionLayer_height', width: 100 },
              { title: '备注(点击编辑)', field: 'remark', edit: 'text', width: 100 },
              { title: '操作', toolbar: '#dimensionLayer_toolBar', width: 120 }
            ]
          ],
          done: function (res) {
            form.render('select');
            if (res.data && res.data.length) {
              _this.watchLayeroBar(layero , data.whId || '');
              imageLazyload();
              _this.blurSubmitHandle();
              var count = res.count;
              $('#dimension_layerTableCount').html(count);
              _this.cursorHandle('dimensionLayer_table');
            }
          }
        });
      },
      //监听工具栏事件
      watchLayeroBar: function(layero, whId){
        let _this = this;
         table.on('tool(dimensionLayer_tableFilter)', function (obj) {
           let data = obj.data;
           if (obj.event == 'copy') {
             _this.copyFn($(this));
           } else if (obj.event == 'paste') {
             _this.pasteFn($(this));
           } else if (obj.event == 'submit') {
             let $tr = $(this).parents('tr');
             let obj = {};
             obj.id = data.id;
             obj.prodSId = data.prodSId;
             obj.sSku = data.sSku;
             obj.measureType = data.measureType;
             obj.suttleWeight = data.prodSInfo && data.prodSInfo.suttleWeight || 0; //净重
             obj.packWeight = data.prodSInfo && data.prodSInfo.packWeight || 0; //包裹重量
             obj.prodThrowWeight = data.throwWeight || 0; //抛重
             obj.prodWeight = Number(($tr.find('[name=weight]').val().trim()));//产品重量
             obj.wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
             obj.wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
             obj.wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
             obj.remark = $tr.find('td[data-field=remark]>div').text(); //备注
             obj.unmeasureReason = $tr.find('td[data-field=unmeasureReason]>div').text(); //无法测量原因
             if (!obj.unmeasureReason) {
               if (data.measureType == 1 || data.measureType == 3) {
                if (_this.judgeIsEmpty(obj.prodWeight)) {
                  $tr.find('[name=weight]').addClass('layui-form-danger').focus();
                  return layer.msg('产品重量不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $tr.find('[name=weight]').removeClass('layui-form-danger');
                }
               }

               if (data.measureType == 2 || data.measureType == 3) {
                  if (_this.judgeIsEmpty(obj.wrapLength)) {
                    $tr.find('[name=length]').addClass('layui-form-danger').focus();
                    return layer.msg('包裹长不能为空或0', {
                      offset: ['70px'],
                      icon: 2
                    });
                  } else {
                    $tr.find('[name=length]').removeClass('layui-form-danger');
                  }

                  if (_this.judgeIsEmpty(obj.wrapWidth)) {
                    $tr.find('[name=width]').addClass('layui-form-danger').focus();
                    return layer.msg('包裹宽不能为空或0', {
                      offset: ['70px'],
                      icon: 2
                    });
                  } else {
                    $tr.find('[name=width]').removeClass('layui-form-danger');
                  }
                  if (_this.judgeIsEmpty(obj.wrapHeight)) {
                    $tr.find('[name=height]').addClass('layui-form-danger').focus();
                    return layer.msg('包裹高不能为空或0', {
                      offset: ['70px'],
                      icon: 2
                    });
                  } else {
                    $tr.find('[name=height]').removeClass('layui-form-danger');
                  }

                 if ((obj.wrapLength < obj.wrapWidth) || (obj.wrapLength < obj.wrapHeight) || (obj.wrapWidth < obj.wrapHeight)) {
                  return layer.msg('包裹长宽高需满足长>=宽>=高!', { icon: 2 });
                  }
                //包裹长>=宽>=高
               }
               //包裹长大大于15
              //  if (obj.wrapLength < 15) {
              //    $tr.find('[name=length]').addClass('layui-form-danger').focus();
              //    return layer.msg('包裹长不能小于15cm!', { icon: 2 });
              //  } else {
              //    $tr.find('[name=length]').removeClass('layui-form-danger');
              //  }
              //  if (obj.wrapWidth < 10) {
              //    $tr.find('[name=width]').addClass('layui-form-danger').focus();
              //    return layer.msg('包裹宽不能小于10cm!', { icon: 2 });
              //  } else {
              //    $tr.find('[name=width]').removeClass('layui-form-danger');
              //  }
             }

            //  判断测量值是否超过理论值
            // const {isOver, overContentStr} = _this.judgeIsOVer($tr,data,obj.sSku)
            _this.judgeIsOVer($tr,data,obj.sSku).then(res => {
              const {isOver, overContentStr} = res;
              if(isOver && !obj.unmeasureReason){
                layer.confirm(overContentStr, {icon: 3, title:'测量确认'}, function(index){
                  //确认保存
                  _this.submitMeasure(obj)
                },function(){
                  _this.cancelSubmitMeasurefoucus($tr, overContentStr)
                });
              }else{
                _this.submitMeasure(obj)
              }
            });
           }else if(obj.event == 'lack'){
            //缺货待检
            commonReturnPromise({
              url: '/lms/dimensionMeasure/outOfStockToBeTested',
              params: {
                storeId: whId,
                sku: data.sSku
              }
            }).then(res => {
              layer.msg(res || '操作成功', {icon:1});
            })
          }
        });
      },
      submitMeasure: function(obj){
        this.submitMeasureAjax(JSON.stringify(obj)).then(function (result) {
          layer.msg('提交成功', { icon: 1 });
        }).catch(function (err) {
          layer.msg(err);
        })
      },
      submitMeasureAjax: function(obj){
        return commonReturnPromise({
            type: 'post',
            contentType: 'application/json',
            url: '/lms/dimensionMeasure/saveMeasureData.html',
            params: obj
        })
      },
      copyFn ($this) {
        let $tr = $this.parents('tr');
        let obj = {};
        let _this = this;
        obj.prodWeight = Number($tr.find('input[name=weight]').val().trim());//产品重量
        obj.wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
        obj.wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
        obj.wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
        if(_this.judgeIsEmpty(obj.prodWeight) || _this.judgeIsEmpty(obj.wrapHeight)|| _this.judgeIsEmpty(obj.wrapLength) || _this.judgeIsEmpty(obj.wrapWidth)){
            return layer.msg('复制的必填项产品重量/包裹长/包过高/包裹宽不能为空',{
                offset: ['70px'],
                icon: 2
            });
        }
        localStorage.setItem('dimension_measureCopy', JSON.stringify(obj));
        layer.msg('复制成功', {
            offset: ['70px'],
            icon: 1
        });
      },
      pasteFn($this){
        let $tr = $this.parents('tr');
        let obj = JSON.parse(localStorage.getItem('dimension_measureCopy'));
        $tr.find('input[name=weight]').val(obj.prodWeight);
        $tr.find('input[name=height]').val(obj.wrapHeight);
        $tr.find('input[name=length]').val(obj.wrapLength);
        $tr.find('input[name=width]').val(obj.wrapWidth);
        layer.msg('粘贴成功!',{
            offset: ['70px'],
            icon: 1
        });
      },
      //失去焦点提交代码
      blurSubmitHandle: function(){
          let $table = $('#dimensionLayer_table').next().find('.layui-table-body.layui-table-main>table');
          let anchorPoint = '';
          let _this = this;
          $table.on('focus', 'tr input', function(){
            let $tr = $(this).parents('tr');
            if(_this.judgeIsEmpty(anchorPoint)){
                anchorPoint = $tr;
                console.log('完成赋值');
            }else{
                if(anchorPoint[0] == $tr[0]){

                }else{
                    $(anchorPoint[0]).find('[lay-event=submit]').trigger('click');
                    anchorPoint = $tr;
                }
            }
          });
          // $table.on('blur', 'input.dimensionLayer_weightInput', function(){
          //     var $td = $(this).parents('td');
          //     var $suttleWeight = $td.find('[name=suttleWeight]').val();
          //     var $packWeight = $td.find('[name=packWeight]').val();
          //     var $total = Number($suttleWeight) + Number($packWeight);
          //     var $val = Number($(this).val()) || 0;
          //     var isOver = ($val - $total)/$total >0.5 ? true : false;
          //     if(isOver){
          //       layer.msg('输入商品重量超过原重量50%,请注意!', {
          //         icon: 0
          //       });
          //     }
          // })
      },
      judgeIsEmpty(value) { //非空判断
        return (
            value === undefined ||
            value === null ||
            value === 0 ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
        );
      },
      //获取仓库
      getWarehouseAjax: function(){
        return commonReturnPromise({
            url: '/lms/skuLocationTransfer/getAuthedProdWarehouseList.html'
        })
      },
      //#endregion

      //#region 直接测量
      directMeasure () {
        let _this = this;
        $('#dimension_directMeasureLayerBtn').on('click', function () {
          layer.open({
            type: 1,
            title: '直接测量',
            btn: ['关闭'],
            area: ['100%', '700px'],
            content: $('#dimensionDirectDetail_layer').html(),
            id: 'dimensionDirectDetail_layerId',
            success: function (layero, index) {
              layero.find('#dimensionDirect_searchLayerForm_sku').focus();
              //绑定回车事件
              layero.find('#dimensionDirect_searchLayerForm_sku').on('keypress', function (e) {
                if (e.keyCode == 13) {
                  let val = e.target.value;
                  if (!val) {
                    return layer.msg('请输入SKU', { icon: 7 });
                  }
                  _this.getDirectBatchTable({ sku: val }, layero);
                  return false;
                }
              });
              //监听input输入
              layero.on('input', '[ztt-verify=priority]', function(e){
                var val= e.target.value.trim();
                if(!val || val == 0){
                    if(!$(e.target).hasClass('layui-form-danger')){
                        $(e.target).addClass('layui-form-danger').focus();
                        layer.msg('必填项不能为空或0', {
                            offset: ['70px'],
                            icon: 2
                        });
                    }
                }else{
                    $(e.target).removeClass('layui-form-danger').focus();
                }
            });
            },
            end: function () {
              $('[lay-filter=dimension_submit]').trigger('click');
            }
          });
        });
      },
      getDirectBatchTable (data,layero) {
        var _this = this;
        table.render({
          elem: '#dimensionDirectLayer_table',
          method: 'post',
          url: '/lms/dimensionMeasure/selectMeasureDataBySku.html',
          where: data,
          page: false,
          height: 430,
          limits: [50, 100, 300],
          limit: 50,
          id: "dimensionDirectLayer_tableId",
          cols: [
            [
              { title: '图片', field: 'image', templet: '#dimensionDirectLayer_img', width: 70 },
              { title: 'SKU', field: 'sSku'},
              { title: '库位', templet: '#dimensionDirectLayer_location_batch' },
              { title: '可用库存', field: 'whStockWarning', templet: '#dimensionDirectLayer_whStockWarning', width: 90 },
              { title: '楼栋', templet: '#dimensionDirectLayer_buildingNo', width: 45 },
              { title: '楼层', templet: '#dimensionDirectLayer_floor', width: 45 },
              { title: '款式', templet: '#dimensionDirectLayer_style_batch' },
              { title: '需求类型', field: 'measureType', templet: '#dimension_measureLayerTypeTable' },
              { title: '无法测量原因(点击编辑)', field: 'unmeasure_reason', edit: 'text', width: 100 },
              { title: '<font color="red">*</font>重量(g)', templet: '#dimensionDirectLayer_weight', width: 100 },
              { title: '<font color="red">*</font>包裹长(cm)', templet: '#dimensionDirectLayer_length', width: 100 },
              { title: '<font color="red">*</font>包裹宽(cm)', templet: '#dimensionDirectLayer_width', width: 100 },
              { title: '<font color="red">*</font>包裹高(cm)', templet: '#dimensionDirectLayer_height', width: 100 },
              { title: '备注(点击编辑)', field: 'remark', edit: 'text', width: 100 },
              { title: '操作', toolbar: '#dimensionDirectLayer_toolBar', width: 60 }
            ]
          ],
          done: function (res) {
            form.render('select');
            if (res.data && res.data.length) {
              _this.watchDirectLayeroBar(layero);
              imageLazyload();
              _this.blurDirectSubmitHandle();
              let count = res.count;
              $('#dimensionDirect_layerTableCount').html(count);
              _this.cursorHandle('dimensionDirectLayer_table');
            }
          }
        });
      },
      //光标的处理
      cursorHandle (id) {
        /**
         * 有点麻烦,异步同步插入问题
         * 实现逻辑:
         * 1. 搜索完成以后首条数据可测选项获取光标
         * 2. 回车光标跳到下一个可测项
         * 3. 最后一项测量完成以后,回车提交操作
         *   3.1 如果下一条数据,回车提交完成后跳到下一行,重复1-2
         *   3.2 没有下一条数据,回车提交完成后跳到输入框,全选sku
         */
        let $table = $('#'+id).next().find('.layui-table-body.layui-table-main>table');
        let trs = $table.find('tr');
        if (trs.length > 0) {
          let tr0 = trs[0]; //第一条数据
          let ableInput = $(tr0).find('input[type=number]:not(:disabled)');
          let firstInput = ableInput[0];
          $(firstInput).focus().select();
          if (trs.length == 1 && ableInput.length == 1) {
            //只有一条数据且只有一个需要填写的内容,此时回车是触发提交事件并且焦点回到搜索框全选SKU
            //绑定回车事件
            $(firstInput).on('keypress',async function (e) {
              if (e.keyCode == 13) {
                let val = e.target.value;
                try {
                  if (!val || val==0) {
                    $(firstInput).addClass('layui-form-danger').focus();
                    return layer.msg('产品重量不能为空或0', {
                      offset: ['70px'],
                      icon: 2
                    });
                  } else {
                    $(firstInput).removeClass('layui-form-danger');
                    //触发提交事件
                    await $(tr0).find('[lay-event=submit]').trigger('click');
                    //焦点转换
                    $('#dimensionDirect_searchLayerForm_sku').focus().select();
                  }
                } catch (err) {
                  layer.msg(err);
                }
                return false;
              }
            });
          } else if (trs.length == 1 && ableInput.length > 1) {
            //只有一条数据且有多个需要填写的内容,此时回车是触发tab事件,同时最后一个选项触发提交事件
            $(tr0).on('keypress', 'input[type=number]:not(:disabled)', function (e) {
              if (e.keyCode == 13) {
                let val = e.target.value;
                let $nextTdHasInput = $(this).parents('td').next('td').find('input[type=number]:not(:disabled)');
                if (!val || val == 0) {
                  $(this).addClass('layui-form-danger').focus();
                  return layer.msg('测量项目不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $(firstInput).removeClass('layui-form-danger');
                  if ($nextTdHasInput.length > 0) {
                    $nextTdHasInput.focus();
                  } else {
                    //触发提交事件
                    $(tr0).find('[lay-event=submit]').trigger('click');
                    //焦点转换
                    $('#dimensionDirect_searchLayerForm_sku').focus().select();
                  }
                }
              }
            });
          } else if (trs.length > 1) {
            let lastTrIndex = trs.length - 1;
            for (let i = 0; i < trs.length; i++){
              let trItem = trs[i];
              let nextTrItem = trs[i + 1];
              //操作,换行,临界点是最后一行
              if (i < lastTrIndex) {
                $(trItem).on('keypress', 'input[type=number]:not(:disabled)', function (e) {
                  if (e.keyCode == 13) {
                    let val = e.target.value;
                    let $nextTdHasInput = $(this).parents('td').next('td').find('input[type=number]:not(:disabled)');
                    if (!val || val == 0) {
                      $(this).addClass('layui-form-danger').focus();
                      return layer.msg('测量项目不能为空或0', {
                        offset: ['70px'],
                        icon: 2
                      });
                    } else {
                      $(this).removeClass('layui-form-danger');
                      if ($nextTdHasInput.length > 0) {
                        $nextTdHasInput.focus().select();
                      } else {
                        //焦点转换---下一行获取焦点
                        $($(nextTrItem).find('input[type=number]:not(:disabled)')[0]).focus().select();
                      }
                    }
                  }
                });
              } else if (i == lastTrIndex) {
                console.log('i == lastTrIndex', i == lastTrIndex);
                $(trItem).on('keypress', 'input[type=number]:not(:disabled)', function (e) {
                  if (e.keyCode == 13) {
                    let val = e.target.value;
                    let $nextTdHasInput = $(this).parents('td').next('td').find('input[type=number]:not(:disabled)');
                    if (!val || val == 0) {
                      $(this).addClass('layui-form-danger').focus();
                      return layer.msg('测量项目不能为空或0', {
                        offset: ['70px'],
                        icon: 2
                      });
                    } else {
                      $(this).removeClass('layui-form-danger');
                      if ($nextTdHasInput.length > 0) {
                        $nextTdHasInput.focus();
                      } else {
                        //触发提交事件
                        $(trItem).find('[lay-event=submit]').trigger('click');
                        //焦点转换
                        $('#dimensionDirect_searchLayerForm_sku').focus().select();
                      }
                    }
                  }
                });
              }
            }
          }
        }

      },
      watchDirectLayeroBar: function(layero){
        let _this = this;
         table.on('tool(dimensionDirectLayer_tableFilter)', function (obj) {
           let data = obj.data;
           if (obj.event == 'copy') {
             _this.copyFn($(this));
           } else if (obj.event == 'paste') {
             _this.pasteFn($(this));
           } else if (obj.event == 'submit') {
             let $tr = $(this).parents('tr');
             let obj = {};
             obj.id = data.id;
             obj.prodSId = data.prodSId;
             obj.sSku = data.sSku;
             obj.measureType = data.measureType;
             obj.suttleWeight = data.prodSInfo && data.prodSInfo.suttleWeight || 0; //净重
             obj.packWeight = data.prodSInfo && data.prodSInfo.packWeight || 0; //包裹重量
             obj.prodThrowWeight = data.throwWeight || 0; //抛重
             obj.prodWeight = Number(($tr.find('[name=weight]').val().trim()));//产品重量
             obj.wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
             obj.wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
             obj.wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
             obj.remark = $tr.find('td[data-field=remark]>div').text(); //备注
             obj.unmeasureReason = $tr.find('td[data-field=unmeasureReason]>div').text(); //无法测量原因
             if (!obj.unmeasureReason) {
              if (data.measureType == 1 || data.measureType == 3) {
                if (_this.judgeIsEmpty(obj.prodWeight)) {
                  $tr.find('[name=weight]').addClass('layui-form-danger').focus();
                  return layer.msg('产品重量不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $tr.find('[name=weight]').removeClass('layui-form-danger');
                }
              }

              if (data.measureType == 2 || data.measureType == 3) {
                if (_this.judgeIsEmpty(obj.wrapLength)) {
                  $tr.find('[name=length]').addClass('layui-form-danger').focus();
                  return layer.msg('包裹长不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $tr.find('[name=length]').removeClass('layui-form-danger');
                }

                if (_this.judgeIsEmpty(obj.wrapWidth)) {
                  $tr.find('[name=width]').addClass('layui-form-danger').focus();
                  return layer.msg('包裹宽不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $tr.find('[name=width]').removeClass('layui-form-danger');
                }
                if (_this.judgeIsEmpty(obj.wrapHeight)) {
                  $tr.find('[name=height]').addClass('layui-form-danger').focus();
                  return layer.msg('包裹高不能为空或0', {
                    offset: ['70px'],
                    icon: 2
                  });
                } else {
                  $tr.find('[name=height]').removeClass('layui-form-danger');
                }
                if ((obj.wrapLength < obj.wrapWidth) || (obj.wrapLength < obj.wrapHeight) || (obj.wrapWidth < obj.wrapHeight)) {
                  return layer.msg('包裹长宽高需满足长>=宽>=高!', { icon: 2 });
                }
                //包裹长>=宽>=高
              }
             }

            //  判断测量值是否超过理论值
            // const {isOver, overContentStr} = _this.judgeIsOVer($tr,data,obj.sSku)
            _this.judgeIsOVer($tr,data,obj.sSku).then(res => {
              const {isOver, overContentStr} = res;
              if(isOver && !obj.unmeasureReason){
                layer.confirm(overContentStr, {icon: 3, title:'测量确认'}, function(index){
                  //确认保存
                  _this.submitMeasure(obj)
                },function(){
                  _this.cancelSubmitMeasurefoucus($tr,overContentStr)
                });
              }else{
                _this.submitMeasure(obj)
              }
            });
            
           }
        });
      },

      //  判断测量值是否超过理论值  公式（|测量值 - 原值| / min（测量值,原值）> 0.5）
      judgeIsOVer:async function($tr,data,sSku){
        return new Promise(resolve => {
          commonReturnPromise({
            url: '/lms/sysdict/getBizDictByCode',
            params: {
              headCode: 'SYNC_DM_WEIGHT_LIMIT'
            }
          }).then(res => {
            let weightCriticalPoint = 0;
            let volumeCriticalPoint = 0;
            (res || []).forEach(item =>{
              if(item.name == '重量'){
                weightCriticalPoint = item.code || 0;
              }
              if(item.name == '体积'){
                volumeCriticalPoint = item.code || 0;
              }
            });
            // console.log(weightCriticalPoint, volumeCriticalPoint);
            let isOver = false
            let overContentStr = ''
            const suttleWeight = data.prodSInfo && data.prodSInfo.suttleWeight || 0; //净重
            const packWeight = data.prodSInfo && data.prodSInfo.packWeight || 0; //包裹重量
            const prodThrowWeight = data.throwWeight || 0; //抛重
            const prodWeight = Number(($tr.find('[name=weight]').val().trim()));//产品重量
            const wrapHeight = Number($tr.find('input[name=height]').val().trim()); //包裹高
            const wrapLength = Number($tr.find('input[name=length]').val().trim()); //包裹长
            const wrapWidth = Number($tr.find('input[name=width]').val().trim()); //包裹宽
            // 尺寸
            if (data.measureType == 1 || data.measureType == 3) {
              const minWeight = Math.min(suttleWeight,prodWeight);
              if(Math.abs(prodWeight - suttleWeight)/minWeight > weightCriticalPoint){
                isOver = true
                overContentStr += `<div>${sSku}原重量<span class="dimension_blue-plus">${suttleWeight}</span>,新重量<span class="dimension_red-plus">${prodWeight}</span>,差值过大,至少测<font size="4" color="red">两次</font>才能保存,请确认是否保存</div>`
              }
            }
            // 重量
            if (data.measureType == 2 || data.measureType == 3) {
              //包裹长
              const originLength =  Number($tr.find('input[name=outerBoxLength]').val().trim())
              // const minLength = Math.min(originLength,wrapLength) 
              // if(Math.abs(wrapLength - originLength)/minLength >0.5){
              //   isOver = true
              //   overContentStr += `<div>${sSku}原包裹长<span class="dimension_blue-plus">${originLength}</span>,新包裹长<span class="dimension_red-plus">${wrapLength}</span>,请确认是否保存</div>`
              // }
              //包裹宽
              const originWidth =  Number($tr.find('input[name=outerBoxWidth]').val().trim())
              // const minWidth = Math.min(originWidth,wrapWidth) 
              // if(Math.abs(wrapWidth - originWidth)/minWidth >0.5){
              //   isOver = true
              //   overContentStr += `<div>${sSku}原包裹宽<span class="dimension_blue-plus">${originWidth}</span>,新包裹宽<span class="dimension_red-plus">${wrapWidth}</span>,请确认是否保存</div>`
              // }
              //包裹高
              const originHeight =  Number($tr.find('input[name=outerBoxHeight]').val().trim())
              // const minHeight = Math.min(originHeight,wrapHeight) 
              let originVolume = Number(originLength * originHeight * originWidth);
              let wrapVolume = Number(wrapLength * wrapWidth * wrapHeight);
              let minVolume = Math.min(originVolume, wrapVolume);
              if(Math.abs(wrapVolume - originVolume)/minVolume > volumeCriticalPoint){
                isOver = true
                overContentStr += `<div>${sSku}原包裹体积<span class="dimension_blue-plus">${originVolume}</span>,新包裹体积<span class="dimension_red-plus">${wrapVolume}</span>,差值过大,至少测<font size="4" color="red">两次</font>才能保存,请确认是否保存</div>`
              }
            }
            resolve({
              isOver,overContentStr
            });
          });
        });
      },
      // 取消测量确认弹窗后聚焦输入框
      cancelSubmitMeasurefoucus: function($tr,overContentStr){
        if(overContentStr.includes('重量')){
          $tr.find('[name=weight]').focus().select()
        }else if(overContentStr.includes('长')){
          $tr.find('[name=length]').focus().select()
        }else if(overContentStr.includes('宽')){
          $tr.find('[name=width]').focus().select()
        }else if(overContentStr.includes('高')){
          $tr.find('[name=height]').focus().select()
        }
      },

      blurDirectSubmitHandle: function(){
        let $table = $('#dimensionDirectLayer_table').next().find('.layui-table-body.layui-table-main>table');
        let anchorPoint = '';
        let _this = this;
        $table.on('focus', 'tr input', function(){
          let $tr = $(this).parents('tr');
          if(_this.judgeIsEmpty(anchorPoint)){
              anchorPoint = $tr;
              console.log('完成赋值');
          }else{
              if(anchorPoint[0] == $tr[0]){

              }else{
                  $(anchorPoint[0]).find('[lay-event=submit]').trigger('click');
                  anchorPoint = $tr;
              }
          }
        });
        // $table.on('blur', 'input.dimensionLayer_weightInput', function(){
        //     var $td = $(this).parents('td');
        //     var $suttleWeight = $td.find('[name=suttleWeight]').val();
        //     var $packWeight = $td.find('[name=packWeight]').val();
        //     var $total = Number($suttleWeight) + Number($packWeight);
        //     var $val = Number($(this).val()) || 0;
        //     var isOver = ($val - $total)/$total >0.5 ? true : false;
        //     if(isOver){
        //       layer.msg('输入商品重量超过原重量50%,请注意!', {
        //         icon: 0
        //       });
        //     }
        // })
      },
      //#endregion

      //#region 同步相关代码封装
      syncPackage (obj) {
        let { id, measureType, str } = obj;
        let _this = this;
        $('#'+id).on('click', function () {
          commonTableCksSelected('dimension_tableId').then(res => {
            let idsArr = res.map(item => item.id) || [];
            _this.measureDataAjax(idsArr.join(','), measureType).then(res => {
              layui.admin.batchResultObjAlert(`${str}:`, res, function () {
                $('[lay-filter=dimension_submit]').trigger('click');
              });
            });
          }).catch(err => {
            layer.msg(err, { icon: 7 });
          });
        });
      },
      syncHandle() {
        let _this = this;
        _this.syncPackage({
          id: 'dimension_syncSize',
          measureType: 2,
          str: '同步尺寸完成'
        });
        _this.syncPackage({
          id: 'dimension_syncWeight',
          measureType: 1,
          str: '同步重量完成'
        });
        _this.syncPackage({
          id: 'dimension_syncSizeAndWeight',
          measureType: 3,
          str: '同步尺寸和重量完成'
        });
      },
      measureDataAjax (ids, ayncType) {
        return commonReturnPromise({
          url: '/lms/dimensionMeasure/syncMeasureData.html',
          type: 'post',
          params: {
            ids: ids,
            ayncType: ayncType
          }
        });
      },
      //#endregion
      unbindHandle () {
        $('#dimension_unbindBatch').on('click', function () {
          commonTableCksSelected('dimension_tableId').then(res => {
            let idsArr = res.map(item => item.id) || [];
            layer.confirm('确定解绑选中的数据吗?', { icon: 7 }, function () {
              commonReturnPromise({
                url: '/lms/dimensionMeasure/unbindMeasureData.html',
                type: 'post',
                params: {
                  ids: idsArr.join(',')
                }
              }).then(result => {
                layer.msg(result || '解绑批次成功', { icon: 1 });
                $('[lay-filter=dimension_submit]').trigger('click');
              });
            });
          }).catch(err => {
            layer.msg(err, { icon: 7 });
          });
        });
      }
    };
    //初始化渲染---部门渲染需优化
    dimensionName.init();
    //tab切换事件
    dimensionName.tabHandle();
    //批量删除
    dimensionName.batchDel();
    //解绑批次
    dimensionName.unbindHandle();
    //导出
    dimensionName.export();
    //新增
    dimensionName.add();
    //测量
    dimensionName.measure();
    // 直接测量
    dimensionName.directMeasure();
    // 同步统一处理:尺寸,重量,尺寸和重量
    dimensionName.syncHandle();
    //固定表头
    UnifiedFixedFn('dimensionCard');
    //表单搜索
    form.on('submit(dimension_submit)', function (obj) {
      let submitData = dimensionName.dataHandle(obj.field);
      dimensionName.tableRender(submitData);
    })
  });
})(jQuery, layui, window, document);