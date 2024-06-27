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
    let allCount = '';
    let tableData = [];
    let templateTypeList = []   // 模板类型
    //初始化仓库
    commonReturnPromise({
      type: "POST",
      url:`/lms/prodWarehouse/getAuthedProdWarehouse.html`,
      contentType: 'application/json',
      dataType: 'json',
    }).then(returnData=>{
      $("#warehousepictureSearchForm select[name=warehouseId]").html("");
      $("#warehousepictureSearchForm select[name=warehouseId]").append('<option value="">请选择</option>');
      let defaultWarehouseId;
      $(returnData).each(function () {
          if(this.warehouseName == '义乌仓'){
              defaultWarehouseId = this.id;
              $("#warehousepictureSearchForm select[name=warehouseId]").append("<option value='" + this.id + "' selected >" + this.warehouseName + "</option>");
          }else {
              $("#warehousepictureSearchForm select[name=warehouseId]").append("<option value='" + this.id + "'>" + this.warehouseName + "</option>");
          }
      });
      render_order_build_floor("#warehousepictureSearchForm",defaultWarehouseId)
      form.render('select');
    })
    // 初始化拍图人
    commonReturnPromise({
      type: "GET",
      url:`/lms/whPhoto/listAllPhotographer`
    }).then(returnData=>{
      $("#warehousepictureSearchForm select[name=photographer]").html("<option value=''>请选择</option>");
      returnData.forEach(function (userName) {
          $("#warehousepictureSearchForm select[name=photographer]").append("<option value='" + userName + "'>" + userName + "</option>");
      });
      form.render('select');
    })
    let warehousepictureName = {
      //初始化功能
      init () {
        //渲染时间[默认一个月]
        let warehousepicture_nowDateString = new Date().getTime();
        let warehousepicture_dateFiftweenSting = warehousepicture_nowDateString - 30*24*60*60*1000;
        let warehousepicture_dateStart = Format(warehousepicture_dateFiftweenSting, 'yyyy-MM-dd');
        let warehousepicture_dateEnd = Format(warehousepicture_nowDateString, 'yyyy-MM-dd');
        laydate.render({
          elem: '#warehousepicture_times',
          range: true,
          value: warehousepicture_dateStart +' - '+ warehousepicture_dateEnd
        });
        //渲染需求类型
        this.typeEnumAjax().then(data => {
          //渲染select
          commonRenderSelect('warehousepicture_measureType', data||[], ).then(() => {
            formSelects.render('warehousepicture_measureType');
          });
        });
        // 模板类型
        commonReturnPromise({
          url:`/lms/enum/print/templateType`
        }).then(res=>{
          templateTypeList = res
        })
        // 需求人
        this.queryLastThreeMonthName('/lms/whPhoto/queryLastThreeMonthCreatorName');
        // 需求类型联动模板名称
        this.getTplListByMeasureType()
      },
      // 模板名称
      renderSearchTplId(code,domId){
        if(code){
          commonReturnPromise({
            url:`/lms/printTemplate/list?templateType=${code}&status=1&limit=999&page=1`
          }).then(res=>{
            //渲染select
            commonRenderSelect(domId, res || [], { name: 'templateName', code: 'id' }).then(() => {
              form.render('select');
            });
          })
        }else{
          commonRenderSelect(domId, []).then(() => {
            form.render('select');
          }); 
        }
      },
       // 需求类型联动模板名称
       getTplListByMeasureType(){
          const that = this
        formSelects.on(
          "warehousepicture_measureType",
          function (id, vals, val, isAdd, isDisabled) {
            var idsArr = vals.map(function (item) {
              return item.value;
            });
            const curList = templateTypeList.filter(v=>idsArr.includes(v.cnName))
            let code = ''
            if(curList.length){
              code = curList.map(v=>v.code).join(',')
            }
            that.renderSearchTplId(code,'warehousepicture_tplId')
          },
          true
        );
       },
      // 需求人&测量人
      queryLastThreeMonthName(url){
        this.queryLastThreeMonthCreatorName(url).then(data=>{
          let str = ''
          data.forEach(item => {
            str += `<option value="${item}">${item}</option>`
          })
          $("#personName").html(str);
        })
      },
      //请求前数据处理
      dataHandle (data) {
        if (data.times) {
          let timeArr = data.times.split(' - ');
          data.timeStart = timeArr[0];
          data.timeEnd = timeArr[1];
        }else {
          data.timeStart = '';
          data.timeEnd = '';
        }
        if (data.processStatus == 4) {
          data.processStatus = null;
        }
        delete data.times;
        return data;
      },
      tabHandle () {
        let $measureStatus = $('#warehousepictureSearchForm [name=processStatus]');
        element.on('tab(warehousepicture_tabs)', function (data) {
          let index = data.index;
          if(index == 2){
            $('#warehousepicture_tabs [data-status=0]').show();
            $("#warehousepicture_tabs .warehousepic_btn").hide();
          }else{
            $('#warehousepicture_tabs [data-status=0]').hide();
            $("#warehousepicture_tabs .warehousepic_btn").show();
          }
          if(index == 1){
            $("#warehousepicture_invalidRequireBtn").show();
          }else{
            $("#warehousepicture_invalidRequireBtn").hide();
          }
          $measureStatus.val(index);
          //触发搜索事件
          $('[lay-filter=warehousepicture_submit]').trigger('click');
        });
      },

      // 模板图对比
      comparePicHandle () {
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(warehousepicture_tableFilter)', function (obj) {
          let data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
          if (layEvent === 'comparePic') {
            let ajax = new Ajax()
            ajax.post({
              url: ctx + "/whPhoto/compareModelImage",
              data: JSON.stringify(data.prodSId),
              contentType: 'application/json',
              dataType: 'json',
              success: function(res) {
                if (res.code === '0000') {
                  // 展示模板图对比弹窗
                  layer.open({
                    type: 1,
                    title: '模板图对比',
                    btn: ['关闭'],
                    area: ['1100px', '700px'],
                    content: $('#warehousepicture_tplPicCompare').html(),
                    success: function(layero,index){
                      table.render({
                        elem: '#warehousepicture_sprodtable',
                        cols: [
                            [
                              {field: 'sSku', title: 'SKU'},
                              {field: 'purchaseChannel', title: '简称'},
                              {field: 'suttleWeight', title: '重量(g)', width: 120},
                              {title: '尺寸(cm)', templet: '#sprodtable_size'},
                              {field: 'unit', title: '单位', width: 100},
                              {field: 'style', title: '款式'},
                              {field: 'material', title: '材质'}
                            ]
                        ],
                        data: [res.data?.prodSInfo],
                        page: false,
                        limit:500,
                        id: 'warehousepicture_sprodtable',
                        done: function() {
                            imageLazyload();
                            let extraUrl = res.extra || ''
                            let { subImages, mainImages, assistImgs } = res.data
                            subImages?.forEach(item => {
                              item.fileName = item.name ? extraUrl + item.name : ''
                            })
                            mainImages?.forEach(item => {
                              item.fileName = item.name ? extraUrl + item.name : ''
                            })
                            assistImgs?.forEach(item => {
                              item.fileName = item.name ? extraUrl + item.name : ''
                            })
                            let picData = {
                              shootPicList: data.whPhotoRequireFileDtos || [],
                              subImages: subImages|| [],
                              isSubNeedExpand: subImages?.length > 6 ? true : false,
                              mainImages: mainImages|| [],
                              isMainNeedExpand: mainImages?.length > 6 ? true : false,
                              assistImgs: assistImgs|| [],
                              isAssistNeedExpand: assistImgs?.length > 6 ? true : false,
                            }
                            laytpl($("#comparePic_Pic").html()).render(picData, function(html){
                              $('#picContainer').html(html)
                            });
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      },

      //表格渲染
      tableRender (data) {
        let cols = [
          {type:'checkbox', width: 30},
          { title: '图片', field: 'productImage', templet: '#warehousepicture_productImage', width: 90 },
          { title: 'SKU', field: 'sSku', templet: '#warehousepicture_sku',width:170 },
          { title: '中文名称', field: 'title'},
          { title: '需求类型', field: 'requireType',templet: '#warehousepicture_requireType',  width: 90 },
          { title: '义乌仓信息', field: 'locationName', templet: '#warehousepicture_locationName' },
          { title: '中转仓信息', field: 'selfLocationCode', templet: '#warehousepicture_selfLocationCode' },
          { title: 'SHEIN佛山仓信息', field: 'selfLocationCode', templet: '#warehousepicture_sheinCode' },
          { title: '需求备注', field: 'remark' },
          { title: '拍图备注', field: 'whRemark' },
          { title: '仓库拍图', field: 'whphotos', templet: '#warehousepicture_whphotos', width: 300 },
          { title: '操作', field: 'operation', templet: '#warehousepicture_operation', width: 220},
        ]
        let _this = this;
        table.render({
          elem: '#warehousepicture_table',
          url: '/lms/whPhoto/queryWhPhotoRequireByCondition',
          method: 'post',
          contentType: 'application/json',
          page: true,
          where: data,
          id: "warehousepicture_tableId",
          request: {
            pageName: 'pageNo' //页码的参数名称，默认：page
            ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
          },
          limits: [100, 300, 500],
          limit: 100,
          cols: [
            cols
          ],
          done: function (res, curr, count) {
            imageLazyload();
            allCount = count;
            tableData = res.data || [];
            //渲染切换数量
            _this.renderNum(count);
          }
        });
      },
      //渲染数量
      renderNum (count) {
        $('#warehousepicture_tabs').find('li>span').html('');
        $('#warehousepicture_tabs').find('li.layui-this>span').html(`(${count})`);
      },
      //取消功能
      delHandle () {
        let _this = this;
        $('.warehousepicture_deleteAndReset').on('click', function () {
          let processStatus = $(this).data('status');
          commonTableCksSelected('warehousepicture_tableId').then(function (result) {
            var idsArr = result.map(function (item) {
              return item.id;
            });
            layer.confirm(`是否${processStatus==0?'恢复':'取消'}选中的${idsArr.length}条数据?`, { icon: 3, title: '提示' }, function (index) {
              _this.updateStatus({ idList: idsArr,processStatus:processStatus }).then(res => {
                layer.close(index);
                layer.alert(`操作成功,成功${res.successNum}条,失败${res.failNum}条,失败原因如下：${res.failResults.join(";")}`, { icon: 1 });
                $('[lay-filter=warehousepicture_submit]').click();
              });
            });
          }).catch(function (err) {
            layer.msg(err, { icon: 2 });
          });
        });
      },
      //批量下载功能
      downHandle () {
        $('#warehousepicture_batchDown').on('click', function () {
          commonTableCksSelected('warehousepicture_tableId').then(function (result) {
            layer.confirm(`是否下载选中的${result.length}条数据?`, { icon: 3, title: '提示' },async function (index) {

              loading.show();
              // 根据 result 获取所有要下载的资源url
              let downloadRes = []
              let pSkuList = []
              result.forEach(item => {
                let index = pSkuList.indexOf(item.pSku)
                if (index > -1) {
                  // 相同的父sku 合并url
                  if(item.whPhotoRequireFileDtos){
                    downloadRes[index].urls = downloadRes[index].urls.concat(item.whPhotoRequireFileDtos)
                  }
                } else {
                  pSkuList.push(item.pSku)
                  let obj = {
                    pSku: item.pSku,
                    urls: []
                  }
                  item.whPhotoRequireFileDtos && item.whPhotoRequireFileDtos.forEach((cItem,urlIndex) => {
                    let urlObj = {
                      fileName: cItem.fileName,
                      fileType: cItem.typeName,
                      urlIndex,
                    }
                    obj.urls.push(urlObj)
                  })
                  downloadRes.push(obj)
                }
              })

              let zip = new JSZip(); 
              for (let i = 0; i < downloadRes.length; i ++) {
                let folder = zip.folder(downloadRes[i].pSku);
                for (let item of downloadRes[i].urls) {
                  let fileNameSuffix = item.fileName.split("/").reverse()[0].split('.')[1]
                  let {data} = await axios({
                    method: "get",
                    url: item.fileName,
                    responseType: "blob",
                  });
                  // 下载的图片也以父SKU命名，如果有多张图片的，从第二张还是加”(2)”后缀
                  let fileName= item.urlIndex>0 ? `${downloadRes[i].pSku}(${item.urlIndex+1})` : downloadRes[i].pSku
                  folder.file(fileName+'.'+fileNameSuffix, data);
                }
              }
              // 批量下载加个导出清单，包括字段：父SKU、子SKU、需求类型、模版类型、需求备注
              const idList = result.map(v=>v.id)
              const { data: excelData } = await axios({
                url: "/lms/whPhoto/exportWhPhotoRequire",
                method: "post",
                headers: { "Content-Type": "application/json" },
                responseType: "blob",
                data: { idList },
              });
              const excelBlobData = new Blob([excelData], {
                type: "application/vnd.ms-excel",
              });
              // 将Excel数据添加到ZIP文件
              zip.file("导出清单.xlsx", excelBlobData, { binary: true });
              // 将Excel数据添加到ZIP文件
              zip.generateAsync({type: "blob"}).then(function (content) {
                // 创建一个下载链接
                var url = URL.createObjectURL(content);
                // 创建一个<a>标签并设置下载链接
                var link = document.createElement("a");
                link.href = url;
                link.download = "image.zip";
                // 模拟点击下载链接
                link.click();

                // 释放URL对象
                URL.revokeObjectURL(url);
                // saveAs(content, "image.zip");
                loading.hide();
                layer.msg("导出成功", { icon: 1 });
              })
            });
          }).catch(function (err) {
            loading.hide();
            layer.msg(err, { icon: 2 });
          });
        });
      },
      exportHandle (){
        $('#warehousepicture_export').on('click', function () {
          const nowTime = Format(new Date().getTime(), "yyyy年MM月dd日hh时mm分ss秒")
          let checkStatus = layui.table.checkStatus('warehousepicture_tableId');
          let checked_data=checkStatus.data;
          let content_msg='';
          let form_data;
          // 获取表单数据
          let obj_field=serializeObject($('#warehousepictureSearchForm'));
          if(checked_data.length==0){
            content_msg='确认导出当前搜索条件下的全部数据?';
            let submitData = warehousepictureName.dataHandle(obj_field);
            if(!$("#warehousepicture_photographer").val()){
              delete submitData['photographer'];
            };
            form_data=submitData;
          }else{
            let params={}
            content_msg='确认导出当前勾选的数据?';
            params.idList=checked_data.map(v=>v.id);
            form_data=params;
          };
          layer.open({
            title: '导出',
            content: content_msg,
            btn:['确定','取消'],
            success: function(layero, index){
            },
            yes: function(index, layero){
              transBlob({
                url: '/lms/whPhoto/exportWhPhotoRequireBatch ',
                formData: JSON.stringify(form_data),
                fileName: `仓库拍图 ${nowTime}.xlsx`,
                contentType: 'application/json'
              }).then(function (result) {

              }).catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
              layer.close(index);
            }
          });   
        })
        transBlob
      },
      

      //新增功能
      addHandle () {
        let _this = this;
        $('#warehousepicture_add').on('click', function () {
          layer.open({
            type: 1,
            title: '新增拍图需求',
            area: ['70%', '70%'],
            btn: ['保存', '关闭'],
            content: $('#warehousepicture_addPictureLayer').html(),
            id: 'warehousepicture_addPictureLayerId',
            success: function () {
              _this.getTplListByMeasureTypeInAddModal()
              //渲染需求类型
              _this.typeEnumAjax().then(data => {
                //渲染select
                commonRenderSelect('warehousepicture_measureTypeLayer', data || []).then(() => {
                  form.render('select');
                });
              });
            },
            yes: function (index, layero) {
              let formData = serializeObject($('#warehousepicture_addPictureLayerForm'));
              if (!formData.requireType || !formData.skuStr) {
                return layer.msg('请选择需求类型并填写SKU', { icon: 7 });
              }
              // 如果存在模板名称时，必填
              const optionList = $('#warehousepicture_addPictureLayerForm').find('select[name=printTemplateId] option')
              if(!formData.printTemplateId && optionList.length>1){
                return layer.msg('请选择模板类型', { icon: 7 });
              }
              formData.skuStr = formData.skuStr.replace('\r\n', ',');
              formData.ifIgnoreRepeatPhotoRequire = false;
              _this.saveAjax(formData).then(res => {
                layer.msg(res || '操作成功', { icon: 1 });
                layer.close(index);
                $('[lay-filter=warehousepicture_submit]').trigger('click');
              }).catch(err => {
                if (err.indexOf('存在重复拍图') > -1) {
                  let errMsg = err.replace('操作失败:', '').split(' ;')[0];
                  layer.confirm(`${errMsg},是否继续?`, {icon: 3, title:'提示'}, function(index){
                    formData.ifIgnoreRepeatPhotoRequire = true;
                    _this.saveAjax(formData).then(res => {
                      layer.msg(res || '操作成功', { icon: 1 });
                      layer.closeAll();
                      $('[lay-filter=warehousepicture_submit]').trigger('click');
                    })
                  }, function(index){
                    layer.closeAll();
                  });  
                } else {
                  layer.msg(err, { icon: 2 });
                }
              });
            }
          });
        });
      },
      // 新增弹窗 需求类型联动模板名称 
      getTplListByMeasureTypeInAddModal(){
        const that = this
        form.on('select(warehousepicture_measureTypeLayer)',function(data){
          const { value } = data
          const curObj = templateTypeList.find(v=>v.cnName === value)
          let code = ''
          if(curObj){
            code = curObj.code
          }
          that.renderSearchTplId(code, 'warehousepicture_printTemplateIdLayer')
        })
      },
      // 作废
      invalidRequireBtn(){
        $('#warehousepicture_invalidRequireBtn').click(function(){
          commonTableCksSelected('warehousepicture_tableId').then(function (result) {
            var idList = result.map(v=>v.id)
            commonReturnPromise({
              url: "/lms/whPhoto/invalidRequire",
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({idList})
            }).then(res=>{
              layer.msg(res|| '操作成功',{icon:1})
              $('[lay-filter=warehousepicture_submit]').click();
            })
          }).catch(function (err) {
            layer.msg(err, { icon: 2 });
          });
        })
      },
      //查询需求人||测量人
      queryLastThreeMonthCreatorName (url) {
        return commonReturnPromise({
          url: url
        });
      },
      //需求类型接口
      typeEnumAjax () {
        return commonReturnPromise({
          url: '/lms/whPhoto//getRequireTypeEnum',
        });
      },
      //删除接口
      delAjax (obj) {
        return commonReturnPromise({
          url: '/lms/whPhoto/deletePhotoRequire',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify(obj)
        });
      },
      //取消接口
      updateStatus (obj) {
        return commonReturnPromise({
          url: '/lms/whPhoto/updateStatus',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify(obj)
        });
      },
      //新增保存接口
      saveAjax (obj) {
        return commonReturnPromise({
          url: '/lms/whPhoto/batchSavePhotoRequire',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify(obj)
        });
      }
    };
    //固定表头
    // UnifiedFixedFn('warehousepictureCard');
    //初始化
    warehousepictureName.init();
    //tab切换事件
    warehousepictureName.tabHandle();
    //取消or恢复功能
    warehousepictureName.delHandle();
    //批量下载
    warehousepictureName.downHandle();
    // 导出
    warehousepictureName.exportHandle()
    //新增功能
    warehousepictureName.addHandle();
    // 作废功能
    warehousepictureName.invalidRequireBtn()
    //表单搜索
    form.on('submit(warehousepicture_submit)', function (obj) {
      let submitData = warehousepictureName.dataHandle(obj.field);
      if(!$("#warehousepicture_photographer").val()){
        delete submitData['photographer'];
      }
      warehousepictureName.tableRender(submitData);
    })
    warehousepictureName.comparePicHandle()
    // 需求人&测量人
    form.on('select(personSearchType)', function(data) {
      if(data.value == 1){
        // 需求人
        warehousepictureName.queryLastThreeMonthName('/lms/whPhoto/queryLastThreeMonthCreatorName');
      }else if(data.value == 2){
        // 测量人
        warehousepictureName.queryLastThreeMonthName('/lms/whPhoto/queryLastThreeMonthPhotographerName');
      }
    });
  });
})(jQuery, layui, window, document);

function expandImgList(self) {
  let imgDivs = $(self).closest('.layui-field-title').next('.pic-container-flex').find('.img-wrap-hide')
  let text = $(self).text()
  text = text === '展开' ? '收起' : '展开'
  $(self).text(text)
  $(imgDivs).each(function(index, item){
    $(item).toggleClass('disN');
  })
}
