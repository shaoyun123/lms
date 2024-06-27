var BatchImport_warehouseId,BatchImport_warehouseName
layui.use(["admin", "form", "table", "layer", "laytpl",'laydate', 'element', 'upload'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        upload = layui.upload,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        $ = layui.$;

        laydate.render({
            elem: '#stockTemporaryLocation_operationTime'
            , range: true
        });
    
        //批量导入
        
    // $('#stockTemporayLocation_importProdTempLocation_file').on('change', function() {
    //     var warehouseId=$("#stockTemporaryLocation_form select[name=warehouseId]").val();
    //     if(!warehouseId){
    //         layer.msg("请选择仓库")
    //         return
    //     }
    //     var warehouseName = $("#stockTemporaryLocation_form select[name=warehouseId]").find("option:selected").text();
    //     var files = $('#stockTemporayLocation_importProdTempLocation_file')[0].files
    //     if (files.length == 0) {
    //         return
    //     }
    //     // 校验文件类型
    //     var fileName = files[0].name
    //     var seat = fileName.lastIndexOf(".");
    //     var extension = fileName.substring(seat).toLowerCase();
    //     if (extension != '.xlsx' && extension != '.xls') {
    //         layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
    //         return
    //     }
    //     var formData = new FormData();
    //     formData.append("file", files[0]);
    //     formData.append("warehourseId",warehouseId);
    //     formData.append("warehouseName",warehouseName);
    //     layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
    //         function() {
    //             loading.show()
    //             $.ajax({
    //                 url: ctx + '/tempLocation/importProdTempLocation.html',
    //                 type: 'POST',
    //                 data: formData,
    //                 dataType: 'json',
    //                 processData: false,
    //                 contentType: false,
    //                 success: function(returnData) {
    //                     loading.hide()
    //                     $('#stockTemporayLocation_importProdTempLocation_file').val('')
    //                     if (returnData.code == '0000') {
    //                         layer.msg(returnData.msg,{icon:1});
    //                         stockTemporaryLocation_form_search();
    //                     } else {
    //                         layer.msg(returnData.msg,{icon:2});
    //                     }
    //                 },
    //                 error: function() {
    //                     loading.hide()
    //                     $('#stockTemporayLocation_importProdTempLocation_file').val('')
    //                 }
    //             });
    //         },
    //         function() {
    //             $('#stockTemporayLocation_importProdTempLocation_file').val('');
    //             layer.closeAll()
    //         }
    //     )
    // });
    //#region 开启/关闭临时位置设置
    //渲染表格
    let temporaryLocationRender = function(res, layero){
      let str = '';
      for(let i=0; i<res.length;i++){
        let item = res[i];
        let trStr = `<tr>
          <td>
            ${item.warehouseName || ''}
            <input type="hidden" value="${item.id}" name="id">
            <input type="hidden" value="${item.warehouseId}" name="warehouseId">
            <input type="hidden" value="${item.warehouseName}" name="warehouseName">
            <input type="hidden" value="${item.buildingNo}" name="buildingNo">
            <input type="hidden" value="${item.floorNo}" name="floorNo">
          </td>
          <td>${item.buildingNo || ''}</td>
          <td>${item.floorNo || ''}</td>
          <td><div class="layui-form">
          ${item.status == 1 ? '<input type="checkbox" name="status" lay-skin="switch" lay-text="开启|关闭" checked lay-filter="locationStatus">' : '<input type="checkbox" name="status" lay-skin="switch" lay-text="开启|关闭" lay-filter="locationStatus">'}
          </div></td>
        </tr>`;
        str +=trStr;
      }
      //推送到body内
      layero.find('tbody').html(str);
      form.render('checkbox');
    }
    //刷新操作
    let temporaryLocationRefresh = function(layero){
      layero.find('.refresh').on('click', function(){
        commonReturnPromise({
          url: '/lms/tempLocation/warehouseBuildingFloorTempLocation/init'
        }).then(() => {
          commonReturnPromise({
            url: '/lms/tempLocation/queryWarehouseBuildingFloorTempLocation'
          }).then(res => {
            temporaryLocationRender(res, layero);
          });
        });
      });
    }
    //监听复选框点击事件
    let temporaryLocationCks = function(){
      form.on('switch(locationStatus)', function(data){
        let cked = data.elem.checked; //开关是否开启，true或者false
        let trP = $(data.elem).parents('tr');
        let id = trP.find('[name=id]').val();
        let warehourseId = trP.find('[name=warehourseId]').val();
        let warehouseName = trP.find('[name=warehourseName]').val();
        let buildingNo = trP.find('[name=buildingNo]').val();
        let floorNo = trP.find('[name=floorNo]').val();
        commonReturnPromise({
          url: '/lms/tempLocation/updateWarehouseBuildingFloorTempLocation',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify({
            id: id,
            warehouseName: warehouseName,
            warehourseId: warehourseId,
            buildingNo: buildingNo,
            floorNo: floorNo,
            status: cked ? 1: 0
          })
        }).then(res => {
          layer.msg(res, {icon:1});
        });
      }); 
    };
    //按钮点击
    $('#stockTemporayLocation_temporarylocation').on('click', function(){
      commonReturnPromise({
        url: '/lms/tempLocation/queryWarehouseBuildingFloorTempLocation'
      }).then(res => {
        layer.open({
          type: 1,
          title: '开启/关闭临时位置设置',
          btn: ['关闭'],
          area: ['60%', '60%'],
          content: $('#stockTemporayLocation_temporarylocationLayer').html(),
          id: 'stockTemporayLocation_temporarylocationLayerId',
          success: function(layero){
            temporaryLocationRender(res, layero);
            temporaryLocationRefresh(layero);
            temporaryLocationCks(layero);
          }
        });
      });
    });
    //#endregion

    function stockTemporaryLocation_form_search(){
        let dataObj = serializeObject($('#stockTemporaryLocation_form'))
        let warehouseId = $('#stockTemporaryLocation_form select[name=warehouseId]').val() || ''
        if (!!warehouseId) {
          stockTemporaryLocationShowMainTable(dataObj);
            // stockTemporaryLocationRequest().requestPage(dataObj).then(res => {
            //     stockTemporaryLocationShowMainTable(res)
            // }).catch(err => {
            //     layer.msg(err, {icon:2})
            // })
        }else {
            layer.msg('请选择仓库', {icon:2  })
        }
    }

    //数据仓库
    var stl_temporaryData = {}

    stockTemporaryLocationINIT()//页面初始化
    stockTemporaryLocationEventsTrigger()//事件触发

    //接口请求
    function stockTemporaryLocationRequest() {
        let stockTemporary = {
            //获取仓库数据
            requestStore() {
                return commonReturnPromise({
                    url: '/lms/prodWarehouse/getAuthedProdWarehouse.html',
                    type: 'post'
                })
            },
            //页面查询
            requestPage(dataObj) {
                return commonReturnPromise({
                    url: '/lms/tempLocation/listTempLocation.html',
                    type: 'post',
                    params: dataObj
                })
            },
            //新增
            requestAddDataList(dataObj) {
                return commonReturnPromise({
                    url: '/lms/tempLocation/addProdTempLocation.html',
                    type: 'post',
                    params: JSON.stringify(dataObj),
                    contentType: 'application/json'
                })
            },
            //修改
            requestChangeDataList(dataObj) {
                return commonReturnPromise({
                    url: '/lms/tempLocation/editProdTempLocation.html',
                    type: 'post',
                    params: JSON.stringify(dataObj),
                    contentType: 'application/json'
                })
            },
            //单条删除
            requestRemoveDataList(dataObj) {
                return commonReturnPromise({
                    url: '/lms/tempLocation/deleteProdTempLocation.html',
                    type: 'post',
                    params: dataObj
                })
            },
            //批量删除
            requestAllRemoveDataList(dataObj) {
                return commonReturnPromise({
                    url: '/lms/tempLocation/batchDelete.html',
                    type: 'post',
                    params: dataObj
                    // ,
                    // contentType: 'application/json'
                })
            },
            // // 导出
            requestExportData(formData){
                transBlob({
                    url: "/lms/tempLocation/exportTempLocation",
                    formData,
                  }).then(function (result) {
                    
                  }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                  });
            }
        }
        return stockTemporary
    }

    //页面初始化
    function stockTemporaryLocationINIT() {
        stockTemporaryLocationStoreINIT()  //初始化仓库
        form.render()
    }

    //事件触发
    function stockTemporaryLocationEventsTrigger() {
        //搜索按钮
        $('#stockTemporaryLocation_form_search').click(function () {
            let dataObj = serializeObject($('#stockTemporaryLocation_form'))
            let warehouseId = $('#stockTemporaryLocation_form select[name=warehouseId]').val() || ''
            if (!!warehouseId) {
                stockTemporaryLocationShowMainTable(dataObj);
                // stockTemporaryLocationRequest().requestPage(dataObj).then(res => {
                //     stockTemporaryLocationShowMainTable(res)
                // }).catch(err => {
                //     layer.msg(err, {icon:2})
                // })
            }else {
                layer.msg('请选择仓库', {icon:2  })
            }
        })
        
        //批量删除
        $('#stockTemporayLocation_bulkremoveList').click(function () {
            let removeData = table.checkStatus('stockTemporaryLocation_table1')
            removeData.data = removeData.data ? removeData.data : []
            if (!removeData.data.length) {
                return layer.msg('请选择一条数据')
            }
            let removeMultipleData = removeData.data.map(v => v.id)
            removeMultipleData = removeMultipleData.join(',')
            stockTemporaryLocationShowRemoveDataList('multiple', {ids:removeMultipleData})//删除
        })
        //新增
        $('#stockTemporayLocation_addList').click(function (params) {
            stockTemporaryLocationShowAddDataList('add')//新增
        })
        
        //stockTemporaryLocation_table1工具条事件
        table.on('tool(stockTemporaryLocation_table1)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            let data = obj.data; //获得当前行数据
            let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            let tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        
            if(layEvent === 'stockTemporayLocation_changeList'){ //修改
                stockTemporaryLocationShowAddDataList('change', data)
            } else if(layEvent === 'stockTemporayLocation_removeList'){ //删除
                stockTemporaryLocationShowRemoveDataList('single', {id:data.id})
            }
        });
        // 导出按钮-点选时导出点选的数据
        table.on('checkbox(stockTemporaryLocation_table1)', function(obj) {
            let selectedData= table.checkStatus('stockTemporaryLocation_table1').data;
            $("#exportDataBtn").off("click");
            $("#exportDataBtn").click(function(){
                let selectIds=selectedData.map(v=>v.id).join(',');
                if(selectedData.length!=0){
                    let dataObj = serializeObject($('#stockTemporaryLocation_form'));
                    let modifyTime=dataObj.operationTime.split(' - ');
                    delete dataObj.operationTime;
                    dataObj.modifyTimeBegin=modifyTime.length>1?modifyTime[0]:'';
                    dataObj.modifyTimeEnd=modifyTime.length>1?modifyTime[1]:'';
                    var formData = new FormData();
                    formData.append('ids', selectIds);
                    formData.append('warehouseId', dataObj.warehouseId);
                    formData.append('modifyTimeBegin', dataObj.modifyTimeBegin);
                    formData.append('modifyTimeEnd', dataObj.modifyTimeEnd);
                    stockTemporaryLocationRequest().requestExportData(formData);
                }else{
                    let dataObj = serializeObject($('#stockTemporaryLocation_form'));
                    let modifyTime=dataObj.operationTime.split(' - ');
                    delete dataObj.operationTime;
                    dataObj.modifyTimeBegin=modifyTime.length>1?modifyTime[0]:'';
                    dataObj.modifyTimeEnd=modifyTime.length>1?modifyTime[1]:'';
                    var formData = new FormData();
                    formData.append('warehouseId', dataObj.warehouseId);
                    formData.append('modifier', dataObj.modifier);
                    formData.append('tempLocationName', dataObj.tempLocationName);
                    formData.append('sSkuList', dataObj.sSkuList);
                    formData.append('modifyTimeBegin', dataObj.modifyTimeBegin);
                    formData.append('modifyTimeEnd', dataObj.modifyTimeEnd);
                    stockTemporaryLocationRequest().requestExportData(formData);
                }
            })
        });

        //下载模板
        $('#stockTemporayLocation_fileList').click(function () {
            window.location.href = `${ctx}/static/templet/warehouseProdTempLocation.xlsx`;
        })
        
        // 导出按钮-未点选时导出查询条件查出的数据
        $("#exportDataBtn").click(function(){
            let dataObj = serializeObject($('#stockTemporaryLocation_form'))
            let modifyTime=dataObj.operationTime.split(' - ');
            delete dataObj.operationTime;
            dataObj.modifyTimeBegin=modifyTime.length>1?modifyTime[0]:'';
            dataObj.modifyTimeEnd=modifyTime.length>1?modifyTime[1]:'';
            var formData = new FormData();
            formData.append('warehouseId', dataObj.warehouseId);
            formData.append('modifier', dataObj.modifier);
            formData.append('tempLocationName', dataObj.tempLocationName);
            formData.append('sSkuList', dataObj.sSkuList);
            formData.append('modifyTimeBegin', dataObj.modifyTimeBegin);
            formData.append('modifyTimeEnd', dataObj.modifyTimeEnd);
            stockTemporaryLocationRequest().requestExportData(formData);
        });
    }

    //初始化仓库
    function stockTemporaryLocationStoreINIT() {
        stockTemporaryLocationRequest().requestStore().then(res=>{
            selectAppendDataThenRender('#stockTemporaryLocation_form select[name=warehouseId]', res, 'id', 'warehouseName', '')//下拉框渲染
            stl_temporaryData.StoreData = res
            form.render()
        }).catch(err=>{
            layer.msg(err, {icon:2})
        })
    }

    //展示页面主表格
    function stockTemporaryLocationShowMainTable(data) {
        let modifyTime=data.operationTime.split(' - ');
        delete data.operationTime;
        data.modifyTimeBegin=modifyTime.length>1?modifyTime[0]:'';
        data.modifyTimeEnd=modifyTime.length>1?modifyTime[1]:'';
        table.render({
            elem: '#stockTemporaryLocation_table1',
            url: '/lms/tempLocation/listTempLocation.html',
            method: 'post',
            where: data,
            page: true, //开启分页
            limit: 100,
            limits: [50,100,500,1000],
            id: 'stockTemporaryLocation_table1',
            cols: [[ //表头
              {type: 'checkbox', width: '5%'},
              {title: '仓库', width:'8%', templet: function (d) {
                  let temploraryData = stl_temporaryData.StoreData.filter(v => v.id == d.warehouseId)[0] || {},
                    templorary = temploraryData.warehouseName || ''
                  return `<span>${templorary}</span>`
              }},
              {field: 'prodSSku', title: 'SKU', width:'13%'},
              {field: 'locationCode', title: '库位名称', width:'15%'},
              {field: 'tempLocationName', title: '临时位置', width:'7%'} ,
              {field: 'currentStockNum', title: '当前库存', width: '10%'},
              {field: 'tempLocationNum', title: '临时位置数量', width: '9%'},
              {field: 'modifier', title: '操作人', width: '10%'},
              {title: '操作时间', width: '12%', templet: `<div>{{Format( d.modifyTime, 'yyyy-MM-dd hh:mm:ss') }}</div>`},
              {title: '操作', width: '10%', toolbar:'#stockTemporaryLocation_templete_btn'}
            ]]
        })
    }

    //展示新增或修改的layer弹窗
    function stockTemporaryLocationShowAddDataList(status, obj) {
        layer.open({
            title: status == 'add'?'新增':'修改',
            type: 1,//不加该属性,就会出现[object Object]
            area:['45%', '35%'],
            shade:.5,
            btn:['保存','关闭'],
            content: $('#stockTemporaryLocation_DataListLayer').html(),
            success:function(layero, index){
                if (status == 'change') {
                   $(layero).find('[name=prodSSku]').val(obj.prodSSku)
                   $(layero).find('[name=prodSSku]').attr('disabled','true')
                   $(layero).find('[name=tempLocationName]').val(obj.tempLocationName)
                   $(layero).find('[name=tempLocationNum]').val(obj.tempLocationNum || '')
                }
            },
            yes:function (index, layero) {
                let dataObj = serializeObject($('#stockTemporaryLocationAddDataList_DataListLayer_form'))
               
                if ((!dataObj.prodSSku || !dataObj.prodSSku.length || dataObj.prodSSku == "请填写必填信息") && status == 'add') { 
                    stockTemporaryLocationHighLighted($(layero).find('[name=prodSSku]'))
                    return
                }
                if (!dataObj.tempLocationName || !dataObj.tempLocationName.length || dataObj.tempLocationName == "请填写必填信息") { //todo name未纠正
                    stockTemporaryLocationHighLighted($(layero).find('[name=tempLocationName]'))
                    return
                }
                dataObj.warehouseId = $('#stockTemporaryLocation_form select[name=warehouseId]').val()
                if (status == 'add') {
                    stockTemporaryLocationRequest().requestAddDataList(dataObj).then(res => {
                        $('#stockTemporaryLocation_form_search').click() // 重新加载
                        layer.msg(res)
                    }).catch(err => {
                        layer.msg(err, {icon:2})
                    })
                }else {
                    dataObj.id = obj.id
                    dataObj.prodSSku = $(layero).find('[name=prodSSku]').val() || ''
                    stockTemporaryLocationRequest().requestChangeDataList(dataObj).then(res => {
                        $('#stockTemporaryLocation_form_search').click() // 重新加载
                        layer.msg(res)
                    }).catch(err => {
                        layer.msg(err, {icon:2})
                    })
                }
                layer.close(index);
            },
            cancel:function (index, layero) {
                layer.close(index);
            },
            end:function () {
                
            }
        })
    }

    //展示删除的layer弹窗
    function stockTemporaryLocationShowRemoveDataList(status, obj) {
        layer.confirm("确认删除吗",{
            btn: ['确认', '取消']
        }, function (index) {
            // 按钮1的事件
            if (status == 'single') {
                stockTemporaryLocationRequest().requestRemoveDataList(obj).then(res => {
                    $('#stockTemporaryLocation_form_search').click() // 重新加载
                    layer.msg(res)
                    layer.close(index)
                }).catch(err => {
                    layer.msg(err, {icon:2})
                })
            }else {
                stockTemporaryLocationRequest().requestAllRemoveDataList(obj).then(res => {
                    $('#stockTemporaryLocation_form_search').click() // 重新加载
                    layer.msg(res)
                    layer.close(index)
                }).catch(err => {
                    layer.msg(err, {icon:2})
                })
            }
        }, function(index){
            // 按钮2的事件
            layer.close(index)
        });
    }

    //需要填写提示
    function stockTemporaryLocationHighLighted(Dom ,str) {
        // let tipsStr = str?str:'请填写必填信息'
        // Dom.val(tipsStr)
        Dom.addClass('tipsRed')
        //inpu恢复原状态
        Dom.focus(function () {
            // $(this).val('')
            $(this).removeClass('tipsRed')
        })
    }
    $('#stockTemporayLocation_importProdTempLocation_file').click(function () {
        upload.render({
            elem: '#stockTemporayLocation_importProdTempLocation_file', //绑定元素
            url: ctx + '/tempLocation/importProdTempLocation.html', //上传接口
            accept: 'file',
            data: {
                warehourseId: BatchImport_warehouseId,
                warehouseName: BatchImport_warehouseName
            },
            exts: 'xlsx|xls',
            done: function(res, index, upload){
                $('#stockTemporayLocation_importProdTempLocation_file').val('')
                if (res.code == '0000') {
                    layer.msg(res.msg,{icon:1});
                    stockTemporaryLocation_form_search();
                } else {
                    layer.msg(res.msg || '上传失败',{icon:2});
                }
            },
            error: function(index, upload){
                //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                $('#stockTemporayLocation_importProdTempLocation_file').val('')
                layer.msg('上传失败',{icon:2});
            }
        })
    })
    
});
function BatchImport() {
    BatchImport_warehouseId=$("#stockTemporaryLocation_form select[name=warehouseId]").val();
    if(!BatchImport_warehouseId){
        layer.msg("请选择仓库")
        return
    }
    BatchImport_warehouseName = $("#stockTemporaryLocation_form select[name=warehouseId]").find("option:selected").text();
    $('#stockTemporayLocation_importProdTempLocation_file').click()
}