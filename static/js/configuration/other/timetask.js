/*
 * @Author: ztao
 * @Date: 2021-09-01 09:45:20
 * @LastEditTime: 2024-02-18 14:39:23
 * @Description: 定时报表
 */
(function($, layui, window, document, undefined) {
    layui.use(['table', 'form', 'layer', 'laytpl', 'formSelects', 'laypage'], function() {
        var table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            formSelects = layui.formSelects,
            laypage = layui.laypage,
            form = layui.form;
        form.render();
        // 初始化分类
        initSelectIcon(form,'STATISTIC_REPORT_TYPE','#timetaskForm [name=configType]')

        var tasktime_emailXTree;
        var timetaskName = {
            //触发表格搜索
            triggerSearch: function() {
                $('#timetaskForm').find('[lay-filter=timetask_filter]').trigger('click');
            },
            //渲染表格
            tableRender: function(data) {
                var _this = this;
                table.render({
                    elem: "#timetask_table",
                    id: "timetask_tableId",
                    method: "GET",
                    contentType: 'application/x-www-form-urlencoded',
                    where: data,
                    url: "/lms/statisticReport/pageQuery",
                    cols: _this.colsHandle(),
                    page: true,
                    limit: 300,
                    limits: [300, 500, 1000],
                    done: function() {
                        _this.watchBar();
                    },
                });
            },
            //表格列
            colsHandle: function() {
                var cols = [
                    [
                      {
                        type: 'checkbox',
                        width: 30
                      },
                      {
                        title: "状态",
                        field: "status",
                        templet: '#timetask_status',
                        width: 65
                    }, {
                        title: "报表名称",
                        field: "name",
                        width: '15%'
                    }, {
                        title: '报表字段',
                        templet: '#timetask_reportFieldsStr',
                        field: 'reportFieldsStr',
                    }, {
                        title: "定时发送日期",
                        field: "sendDays",
                        templet: '#timetask_sendDays',
                        width: 135
                    }, {
                        title: "定时发送时间",
                        field: "sendTime",
                        width: 170,
                        templet: d => {
                            let exportTimeArr = d.exportTimeStr && d.exportTimeStr.split(',') || [];
                            let str = `<div class="exportTimeStr-container" lay-tips='${exportTimeArr.join(',')}'>`;
                            for(let i=0; i<exportTimeArr.length; i++){
                              let item = exportTimeArr[i];
                              str += `<span class="timeItem">
                              <span class="time">${item}</span>
                            </span>`;
                             if(i > 4){
                               str += '<span class="timeItem">...</span>';
                               break;
                             }
                            }
                            return str+'</div>';
                        },
                    }, {
                        title: "收件人",
                        field: "recipientIds",
                        templet: '#timetask_recipientIds',
                        width: '15%'
                    }, {
                        title: '备注',
                        field: 'remark',
                        templet: d => {
                            let strHtml = ''
                            if(d.remark!==null && d.remark!==undefined){
                                return `<div class="timetask_overflow_four" lay-tips="${d.remark}">${d.remark}</div>`
                            }
                            return strHtml
                        }
                    }, {
                        title: '分类',
                        field: 'configType'
                    }, {
                        title: '创建信息',
                        templet: "#publish_time",
                        width: 200
                    },
                     {
                        title: '操作',
                        field: 'handle',
                        templet: "#timetask_toolbar",
                        width: 100
                    }]
                ];
                return cols;
            },
            watchBar: function() {
                let _this = this;
                table.on("tool(timetask_tableFilter)", function(obj) {
                    let layEvent = obj.event; //获得 lay-event 对应的值
                    let data = obj.data;
                    switch (layEvent) {
                        case 'config' :
                            _this.configAjax(data.id).then(function(res) {
                                _this.configLayer(res, 'edit');
                            }).catch(function(err) {
                                layer.alert(err, { icon: 2 });
                            });
                            break;
                        case 'checkAccessToken':
                            _this.authUserLayer(data);
                            break;
                        case 'immediate' :
                            _this.immediateAjax(data.id).then(() => {
                                layer.msg('执行成功', { icon: 1 });
                                refreshTable()
                            }).catch(err => {
                                layer.alert(err, { icon: 2 });
                            });
                            break;
                        case 'edit' :
                            _this.editAjax(data.id).then(res => {
                                //执行操作
                                let newData = _this.serviceParams(res);
                                commonReturnPromise({
                                  url: '/lms/statisticReport/getSeparateDataSendEnum'
                                }).then(separateRes => {
                                  newData.separateDataSendArr = separateRes;
                                  _this.serviceLayer(newData);
                                });
                            }).catch(err => {
                                layer.alert(err, { icon: 2 });
                            });
                            break;
                        case 'dynamicSearch' :
                            window.open(ctx + '/static/html/dynamicSearch.html?id='+data.id + '&name=' + encodeURI(data.name), '_blank');
                            // _this.editAjax(data.id).then(res => {
                            //     //执行操作
                            //     let newData = _this.serviceParams(res);
                            //     _this.dynamicSearchLayer(newData);
                            // }).catch(err => {
                            //     layer.alert(err, { icon: 2 });
                            // });
                            // break;
                    }

                });
            },
            //授权表格渲染
            authUserLayerTbody(data){
                let trStr = '';
                for(let i=0; i<data.length; i++){
                  let item = data[i];
                  let tr = `<tr>
                  <td>${item.userName}</td>
                  <td>${item.name}</td>
                  <td><span class="layui-btn layui-btn-xs cancelBtn" data-id="${item.userId}">取消授权</span></td>
                </tr>`;
                  trStr += tr;
                }
                return trStr;
            },
            authRoleLayerTbody(data){
              let trStr = '';
              for(let i=0; i<data.length; i++){
                let item = data[i];
                let tr = `<tr>
                <td>${item.name}</td>
                <td><span class="layui-btn layui-btn-xs cancelRoleBtn" data-id="${item.id}">取消授权</span></td>
              </tr>`;
                trStr += tr;
              }
              return trStr;
          },
            //授权弹框处理
            authUserLayer(data){
              let id = data.id;
              let _this = this;
              Promise.all([commonTasktimeAndDict_listAllUserAjax(), commonTasktimeAndDict_queryByResourceValAjax(id, 'TIMING_REPORT'),commonTasktimeAndDict_listAllRoleAjax(),commonTasktimeAndDict_queryRoleByResourceValAjax(id, 'TIMING_REPORT')]).then(res => {
                let userList = res[0] || [];
                let tableList = res[1] || [];
                let roleList = res[2] || [];
                let roleTableList = res[3] || [];
                let obj = {
                  userList: userList,
                  tableList: tableList,
                  roleList: roleList,
                  roleTableList: roleTableList
                };
                layer.open({
                  type: 1,
                  title: '授权用户',
                  area: ['50%', '80%'],
                  content: $('#tasktime_authUserLayer').html(),
                  id: 'tasktime_authUserLayerId',
                  success: function(layero,index){
                    let getTpl = tasktime_authUserLayerContainerTpl.innerHTML,
                    view = document.getElementById('tasktime_authUserLayerContainer');
                    laytpl(getTpl).render(obj, function(html) {
                        view.innerHTML = html;
                        formSelects.render('storeAndPlatCodeAuthLayer_xmTimetask');
                        formSelects.render('storeAndPlatCodeAuthRoleLayer_xmTimetask');
                        //功能操作
                        layero.on('click', '.addAuthBtn', function(){
                          let val = formSelects.value('storeAndPlatCodeAuthLayer_xmTimetask');
                          if(val.length == 0){
                            return layer.msg('请先选择需要新增的数据', {icon:7});
                          }
                          let idsArr = val.map(item => item.val);
                          commonTasktimeAndDict_AddPermissionAjax(id, idsArr.join(','),'TIMING_REPORT').then(addRes => {
                            layer.msg(addRes || '操作成功', {icon: 1});
                            formSelects.value('storeAndPlatCodeAuthLayer_xmTimetask', []);
                            //重新渲染表格[重新请求结果]
                            commonTasktimeAndDict_queryByResourceValAjax(id,'TIMING_REPORT').then(queryRes => {
                              let tbodyHtml = _this.authUserLayerTbody(queryRes);
                              layero.find('tbody.authUser').empty().html(tbodyHtml);
                            });
                          });
                        });
                        //授权角色
                        layero.on('click', '.addAuthRoleBtn', function(){
                          let val = formSelects.value('storeAndPlatCodeAuthRoleLayer_xmTimetask');
                          if(val.length == 0){
                            return layer.msg('请先选择需要授权的角色', {icon:7});
                          }
                          let idsArr = val.map(item => item.val);
                          commonTasktimeAndDict_AddPermissionAjax(id, idsArr.join(','),'TIMING_REPORT', 2).then(addRes => {
                            layer.msg(addRes || '操作成功', {icon: 1});
                            formSelects.value('storeAndPlatCodeAuthRoleLayer_xmTimetask', []);
                            //重新渲染表格[重新请求结果]
                            commonTasktimeAndDict_queryRoleByResourceValAjax(id,'TIMING_REPORT').then(queryRes => {
                              let tbodyHtml = _this.authRoleLayerTbody(queryRes);
                              layero.find('tbody.authRole').empty().html(tbodyHtml);
                            });
                          });
                        });
                        //取消授权[角色]
                        layero.on('click', '.cancelRoleBtn', function(){
                          let itemId = $(this).attr('data-id');
                          let that = this;
                          layer.confirm('确定取消授权吗?', {icon: 3, title:'提示'}, function(index){
                            commonTasktimeAndDict_cancelPermissionAjax(id, itemId,'TIMING_REPORT', 2).then(cancelRes => {
                              layer.close(index);
                              layer.msg(cancelRes || '操作成功', {icon: 1});
                              //重新渲染表格[删除当前行]
                              $(that).parents('tr').remove();
                            })
                          });

                        });
                        //取消授权[用户]
                        layero.on('click', '.cancelBtn', function(){
                          let itemId = $(this).attr('data-id');
                          let that = this;
                          layer.confirm('确定取消授权吗?', {icon: 3, title:'提示'}, function(index){
                            commonTasktimeAndDict_cancelPermissionAjax(id, itemId,'TIMING_REPORT').then(cancelRes => {
                              layer.close(index);
                              layer.msg(cancelRes || '操作成功', {icon: 1});
                              //重新渲染表格[删除当前行]
                              $(that).parents('tr').remove();
                            })
                          });

                        });
                    });
                  }
                });
              });
            },
            //动态查询弹窗
            dynamicSearchLayer: function (data) {
                let _this = this;
                let popIndex = layer.open({
                    type: 1,
                    title: '动态查询-' + data.name,
                    area: ['100%', '100%'],
                    btn: ['关闭'],
                    content: $('#timetask_dynamicSearchLayer').html(),
                    id: 'timetask_dynamicSearchPop',
                    success: function (layero) {
                        // 初始页面
                        let getTpl = timetask_dynamicSearchLayerContent.innerHTML,
                            view = document.getElementById('timetask_dynamicSearchLayerContains');
                        laytpl(getTpl).render(data, function(html) {
                            view.innerHTML = html;
                            form.render();
                            formSelects.render();
                            $('#timetask_dynamicSearchBtn').click(function () {
                                _this.dynamicSearch(data)
                            })

                            $('#timetask_dynamicExportBtn').click(function () {
                                _this.dynamicExport(data)
                            })
                        });
                    },
                    yes: function () {
                        layer.close(popIndex)
                    }
                })
            },
            // 初始化列数据
            initCol: function (reportInfo) {
                let colNameList = reportInfo.reportFieldsStr.split(',')
                let col =[]
                for (let i = 0; i < colNameList.length; ++i) {
                    col.push({
                        title: colNameList[i],
                        field: 'field' + i,
                        templet: function (d){
                            return "<div>"+ (d[colNameList[i]] || '') +"</div>"
                        }
                    })
                }
                return col
            },
            // 获取动态查询的  查询参数
            getDynamicSearchParam: function () {
                let _this = this;
                let paramList = []
                let paramDivList = $('#timetask_dynamicSearchForm').find('.dynamicSearchParam')
                for (let i = 0; i < paramDivList.length; ++i) {
                    let filedList = $(paramDivList[i]).find('[data-name]')
                    let oneParam = {}
                    for (let j = 0; j < filedList.length; ++j) {
                        let fieldDom = filedList[j]
                        oneParam[fieldDom.getAttribute('data-name')] = fieldDom.value
                    }
                    paramList.push(oneParam)
                }
                return paramList
            },
            dynamicSearch: function (reportInfo,luPage) {
                if (!luPage) {
                    luPage = {
                        page: 1,
                        limit: 1000
                    }
                }
                let _this = this;
                // 获取查询参数
                let searchParam = _this.getDynamicSearchParam()
                let Adata = {
                    configId: reportInfo.id,
                    paramListJson: JSON.stringify(searchParam),
                    page: luPage.page,
                    limit: luPage.limit
                }
                _this.timetask_renderForDynamicSearch(Adata,reportInfo)
            },
            timetask_renderForDynamicSearch: function (Adata,reportInfo) {
                let _this = this;
                // 先查询，然后渲染
                oneAjax.post({
                    data: Adata,
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/statisticReport/dynamicSearch',
                    timeout: 600000,
                    success: function (res) {
                        if (res.code === '0000') {
                            let data = res.data
                            // 组装列
                            let realCol = _this.generateRealCol(res.extra)
                            reportInfo.col = realCol
                            //  获取屏幕高度
                            var bodyheight = $(window).height();
                            table.render({
                                elem: "#timetask_dynamicSearchTable",
                                id: "timetask_dynamicSearchTableId",
                                data: data,
                                cols: [realCol],
                                page: false,
                                limit: Adata.limit,
                                height: 0.75 * bodyheight,
                                done: function() {
                                    laypage.render({
                                        elem: 'timetask_pagination',
                                        count: 9999999,
                                        curr: Adata.page,
                                        limit: Adata.limit,
                                        limits: [300, 500, 1000],
                                        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                                        jump: function(obj, first) {
                                            //obj包含了当前分页的所有参数，比如：
                                            Adata.page = obj.curr;
                                            Adata.limit = obj.limit;
                                            //首次不执行
                                            if (!first) {
                                                _this.timetask_renderForDynamicSearch(Adata)
                                            }
                                        }
                                    });
                                },
                            });
                        }
                    }
                })

            },
            generateRealCol: function (colNameList) {
                let col =[]
                col.push({ type: 'checkbox', width: 30 })
                let tableWidth = $('#timetask_dynamicSearchTable').css('width').split('px')[0]
                let width = (100-31*100/tableWidth)/colNameList.length + '%'
                for (let i = 0; i < colNameList.length; ++i) {
                    col.push({
                        title: colNameList[i],
                        field: 'field' + i,
                        width,
                        templet: function (d){
                            return "<div>"+ (d[colNameList[i]] || '') +"</div>"
                        }
                    })
                }
                return col
            },
            dynamicExport: function (reportInfo) {
                let _this = this;
                // 获取选中的数据
                var checkStatus = table.checkStatus('timetask_dynamicSearchTable'),
                    selectedDtoList = checkStatus.data
                // 如果有选中数据，仅导出选中数据。 通过js导出
                if (selectedDtoList.length > 0) {
                    let exportCol = reportInfo.col.slice(1)
                    // 将field全改为title
                    for (let i = 0; i < exportCol.length; ++i) {
                        exportCol[i].field = exportCol[i].title
                    }
                    let confirmindex = layer.confirm("确认导出这"+ selectedDtoList.length +"条信息吗?", { btn: ['确认', '取消'] }, function() {
                        tableToExcel(selectedDtoList,exportCol, reportInfo.name + '.xls')
                        layer.close(confirmindex)
                    })
                    return
                }

                // 如果未选中数据，根据查询条件进行导出
                let searchParam = _this.getDynamicSearchParam()
                let Adata = {
                    configId: reportInfo.id,
                    paramListJson: JSON.stringify(searchParam)
                }
                let data = {}
                data.searchParam = JSON.stringify(Adata)
                let tip = '确认导出当前搜索条件下信息?'
                let confirmindex = layer.confirm(tip, { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/statisticReport/dynamicExport', '_blank')
                    layer.close(confirmindex)
                })
            },
            //新增技术配置
            addBtnHandle: function() {
                var _this = this;
                $('#timetask_newAddBtn').on('click', function() {
                    var addData = {
                        name: '',
                        executeSql: '',
                        remark: '',
                        statisticReportSearchParams: []
                    };
                    _this.configLayer(addData, 'add');
                });
            },
            //删除配置
            deleteBtnHandle: function(){
              var _this = this;
              $('#timetask_deleteBtn').on('click', function() {
                commonTableCksSelected('timetask_tableId').then(data => {
                  let ids = (data || []).map(item => item.id);
                  layer.confirm('是否确认删除选中的报表?', {icon: 7}, function(index){
                    commonReturnPromise({
                      url: '/lms/statisticReport/fackDeleteStaticReport',
                      type:'post',
                      contentType: 'application/json',
                      params: JSON.stringify({
                        ids: ids
                      })
                    }).then(res => {
                      layer.close(index);
                      layer.msg(res || '操作成功', {icon:1});
                      refreshTable();
                    })
                  });
                }).catch(err => {
                  layer.msg(err, {icon:5});
                })
              });
            },
            //技术配置弹框
            configLayer: function(data, setType) {
                var _this = this;
                layer.open({
                    type: 1,
                    title: '技术配置<font color="red">[修改SQL以后必须点击检测按钮更新参数配置]</font>',
                    area: ['60%', '90%'],
                    btn: ['保存', '关闭'],
                    content: $('#timetask_addOrEditLayer').html(),
                    id: 'timetask_addOrEditLayerId',
                    success: function(layero) {
                        var getTpl = timetask_addOrEditLayer_contentTpl.innerHTML,
                            view = document.getElementById('timetask_addOrEditLayer_content');
                        laytpl(getTpl).render(data, function(html) {
                            view.innerHTML = html;
                            form.render('select');
                            form.render('radio');
                            _this.checkBtnHandle(layero);
                        });
                    },
                    yes: function(index, layero) {
                        //获取到表单数据
                        var submitData = layero.find('#timetask_addOrEditLayer_form').serializeObject();
                        if (!submitData.dataSource.trim()) {
                            return layer.msg('数据源不能为空', { icon: 2 });
                        }
                        if (!submitData.executeSql.trim()) {
                            return layer.msg('sql不能为空', { icon: 2 });
                        }
                        if (!submitData.name.trim()) {
                            return layer.msg('报表名称不能为空', { icon: 2 });
                        }
                        //获取表格数据
                        var trs = layero.find('#timetask_addOrEditLayer_tbody>tr');
                        var statisticReportSearchParams = [];
                        for (let i = 0; i < trs.length; i++) {
                            let tr = trs[i];
                            let obj = {};
                            obj.param = $(tr).find('td:first-child').text() || '';
                            obj.alias = $(tr).find('input').val() || '';
                            obj.type = $(tr).find('select').val() || '';
                            statisticReportSearchParams.push(obj);
                        };
                        var hasEmptyAlias = _this.checkHasAlias(statisticReportSearchParams);
                        if (hasEmptyAlias) {
                            return layer.alert('别名不能为空', { icon: 2 });
                        }
                        //提交的数据
                        submitData.statisticReportSearchParams = statisticReportSearchParams;
                        //校验别名是否为空
                        //调用接口
                        if (setType == 'edit') { //编辑功能
                            _this.saveConfigAjax(submitData).then(res => {
                                layer.msg('保存成功', { icon: 1 });
                                layer.close(index);
                                refreshTable()
                            }).catch(err => {
                                layer.alert(err, { icon: 2 });
                            });
                        } else if (setType == 'add') { //新增功能
                            _this.addConfigAjax(submitData).then(res => {
                                layer.msg('保存成功', { icon: 1 });
                                layer.close(index);
                                refreshTable()
                            }).catch(err => {
                                layer.alert(err, { icon: 2 });
                            });
                        }
                    }
                });
            },
            //技术配置弹框-检测按钮操作
            checkBtnHandle: function(layero) {
                var _this = this;
                layero.find('.checkBtn').on('click', function() {
                    let sql = layero.find('textarea[name=executeSql]').val().trim();
                    if (sql.length == 0) {
                        return layer.alert('请先输入sql', { icon: 7 });
                    };
                    let dataSource = layero.find('input[name=dataSource]:checked').val().trim();
                    _this.checkSqlAjax(sql,dataSource).then(res => {
                        _this.changeTbody(layero, res);
                    }).catch(err => {
                        layer.alert(err, { icon: 2 });
                    });
                });
            },
            // 技术配置弹框- 变更表格
            changeTbody: function(layero, data) {
                let $tbody = layero.find('#timetask_addOrEditLayer_tbody');
                let trParams = [];
                let trs = $tbody.find('tr');
                for (let i = 0; i < trs.length; i++) {
                    let tr = trs[i];
                    let param = $(tr).find('td:first-child').text();
                    trParams.push(param);
                };
                let str = '';
                let judgeArr = []; //判断有无值,有的话是append,没有的话是html
                for (let i = 0; i < trParams.length; i++) {
                    let param = trParams[i];
                    if (!data.includes(param)) {
                        // 删除
                        $("tr[name='" + param + "']").remove();
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    let param = data[i];
                    let tr;
                    if (!trParams.includes(param)) {
                        tr = `
                          <tr name="${param || ''}">
                            <td>${param}</td>
                            <td>
                              <input type="text" autocomplete="false" class="layui-input">
                            </td>
                            <td>
                              <div class="layui-form">
                                <select>
                                  <option value="0">string</option>
                                  <option value="1">int</option>
                                  <option value="2">decimal</option>
                                  <option value="3">date</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        `;
                    } else {
                        judgeArr.push(param);
                        tr = '';
                    }
                    str += tr;
                };
                if (judgeArr.length > 0) {
                    $tbody.append(str);
                } else {
                    $tbody.html(str);
                }
                form.render();
            },
            //技术配置--检测表格别名是否填写
            checkHasAlias: function(data) {
                if (data.length == 0) {
                    return false;
                };
                let emptyArr = [];
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (!item.alias.trim()) {
                        emptyArr.push(1);
                    }
                };
                if (emptyArr.length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            //业务配置弹框
            serviceLayer: function(data) {
                var _this = this;
                layer.open({
                    type: 1,
                    title: '业务配置',
                    area: ['800px', '90%'],
                    btn: ['保存', '关闭'],
                    content: $('#timetask_serviceAddOrEditLayer').html(),
                    id: 'timetask_serviceAddOrEditLayerId',
                    success: function(layero) {
                        var getTpl = timetask_serviceAddOrEditLayer_contentTpl.innerHTML,
                            view = document.getElementById('timetask_serviceAddOrEditLayer_content');
                        laytpl(getTpl).render(data, function(html) {
                            view.innerHTML = html;
                            let formElem = $('#timetask_serviceAddOrEditLayer_form')
                            // 初始化可选分类
                            formElem.find('[name=configType]').html($('#timetaskForm').find('[name=configType]').html())
                            form.render();
                            formSelects.render();
                            formElem.find('[name=configType]').val(data.configType)
                            formSelects.value('timetask_exportDays', data.exportDays.split(','));
                            formSelects.value('timetask_exportWeeks', data.exportWeeks.split(','));
                            if (data.ifSendVoidFile) {
                                formElem.find('[name=ifSendVoidFile]').attr('checked','checked')
                            }
                            _this.watchExportType(layero); //监听发送方式变更
                            _this.editEmailBtn(layero);
                            _this.watchCks(layero); //全选和单选
                            let $input = $('#timetask_receivers_input');
                            $input.tagsinput({ itemValue: 'value', itemText: 'text' });
                            $input.tagsinput('removeAll');
                            let userList = data.userList || [];
                            for (let i = 0; i < userList.length; i++) {
                                let item = userList[i];
                                let obj = { value: item.id, text: `${item.userName}(${item.email})` };
                                $input.tagsinput('add', obj);
                            }
                            form.render();
                            //监听按钮点击
                            layero.find('.addTimeBtn').on('click', function(){
                              //获取到时间然后组合起来
                              let exportHour = layero.find('[name=exportHour]').val();
                              let exportMinute = layero.find('[name=exportMinute]').val();
                              let timeHour = exportHour >= 10 ? exportHour : '0'+exportHour;
                              let timeMinute = exportMinute >= 10 ? exportMinute : '0'+exportMinute;
                              //把内容加到dom里面,需要可删除
                              let timesDom = layero.find('.exportTimeStr');
                              let timeDom = $(`<span class="timeItem"><span class="time">${timeHour}:${timeMinute}</span><span class="close">X</span></span>`);
                              timesDom.append(timeDom);
                            });
                            //监听移除时间事件
                            layero.on('click', '.close', function(){
                              $(this).parents('span.timeItem').remove();
                            });
                            //监听radio选择事件
                            form.on('radio(timetaskSendTypeFilter)', function(obj){
                              let val = obj.value;
                              if(['钉钉单人','邮件'].includes(val)){
                                layero.find('.singleAndEmail').removeClass('disN');
                                layero.find('.groupChatId').addClass('disN');
                              }else{
                                layero.find('.singleAndEmail').addClass('disN');
                                layero.find('.groupChatId').removeClass('disN');
                              }
                            });
                        });
                    },
                    yes: function(index, layero) {
                        let submitData = _this.serviceSubmitData(layero);
                        let isString = Object.prototype.toString.call(submitData) == "[object String]";
                        let emailSpans = layero.find('.bootstrap-tagsinput>span.badge.badge-info>a');
                        let emptyUserArr = [];
                        let reg =/(?<=\()[^)]*(?=\))/g;
                        for(let i=0; i< emailSpans.length; i++){
                          let txt = $(emailSpans[i]).text();
                          let regEmail = txt.match(reg)[0];
                          if(!regEmail){
                            emptyUserArr.push(txt.split('\(')[0]);
                          }
                        }
                        if (isString) {
                            return layer.alert(submitData, { icon: 2 });
                        } else {
                          if(['钉钉单人','邮件'].includes(submitData.sendType)){
                            submitData.dingGroupId='';
                            if(emptyUserArr.length > 0){
                              layer.msg(`用户${emptyUserArr.join(',')},无邮箱,请重新选择`, { icon: 7 });
                            }else{
                              _this.saveServiceAjax(submitData).then(() => {
                                layer.msg('修改成功', { icon: 1 });
                                layer.close(index);
                                refreshTable();
                              }).catch(err => {
                                console.log(err);
                                  layer.alert(err, { icon: 2 });
                              });
                            }
                          }else{
                            submitData.separateDataSend='';
                            submitData.recipientIds='';
                            _this.saveServiceAjax(submitData).then(() => {
                              layer.msg('修改成功', { icon: 1 });
                              layer.close(index);
                              refreshTable();
                            }).catch(err => {
                              console.log(err);
                                layer.alert(err, { icon: 2 });
                            });
                          }
                        }

                    }
                });
            },
            //业务配置弹框-编辑邮箱按钮
            editEmailBtn: function(layero) {
                var _this = this;
                layero.find('#timetask_receivers_btn').on('click', function() {
                    var ids = layero.find('[name=recipientIds]').val();
                    layer.open({
                        type: 1,
                        title: '编辑定时报表邮箱人员',
                        area: ['45%', '60%'],
                        btn: ['保存', '关闭'],
                        content: $('#tasktime_serviceEmailLayer').html(),
                        id: 'tasktime_serviceEmailLayerId',
                        success: function() {
                            _this.treeRender(ids);
                            $("#timetask_userNames_btn").unbind('click');
                            $("#timetask_userNames_btn").click(function(){
                                let userNames = $('#timetask_userNames_input').val();
                                var userIds = [];
                                let checkedInput=$("#tasktime_serviceEmailXTree input[data-xend=1]:checked");
                                checkedInput.each((i,item_input)=>{
                                    let value =$(item_input).val();
                                    if (value.indexOf("user") != -1) { //用户节点
                                        var user = value.split("&");
                                        var userId = user[1];
                                        userIds.push(userId);
                                    }
                                })
                                userIds=userIds.join(',')
                                _this.treeRender(userIds,userNames);
                                return false;
                            });
                        },
                        yes: function(index) {
                            try {
                                var $input = $('#timetask_receivers_input');
                                var eamilPerson = tasktime_emailXTree.GetAllChecked();
                                $input.tagsinput('removeAll');
                                var userIds = [];
                                if (eamilPerson != null && eamilPerson.length > 0) {
                                    for (var i = 0; i < eamilPerson.length; i++) {
                                        var value = eamilPerson[i].value;
                                        if (value.indexOf("user") != -1) { //用户节点
                                            var user = value.split("&");
                                            var userId = user[1];
                                            var userEmail = user.length > 2 ? user[3] : "";
                                            var item = { "value": userId, "text": `${user[2]}(${userEmail})` };
                                            $input.tagsinput('add', item);
                                            userIds.push(userId);
                                        }
                                    }
                                };
                                if (userIds.length > 0) {
                                    _this.treeRender(userIds.join(","));
                                } else {
                                    _this.treeRender('');
                                }
                                layer.close(index);
                            } catch (err) {
                                console.error(err);
                           }
                        }
                    });
                });
            },
            // 获取角色名称的树数据
            getUserListByFuzzyRoleName: function(roleName){
                return new Promise(function(resolve, reject){
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: '/lms/sysdict/getUserListByFuzzyRoleName',
                        data:{
                            roleName:roleName
                        },
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            resolve(res);
                        },
                        error: function(){
                            loading.hide();
                            reject('服务器出错');
                        }
                    });
                })
            },
            //业务配置-监听定时发送方式变化
            watchExportType: function(layero) {
                form.on('select(timetaskLayer_exportType)', function(obj) {
                    let val = obj.value;
                    if (val == 1) { //按星期
                        layero.find('.tasktimeLayer_dates').addClass('disN');
                        layero.find('.tasktimeLayer_weeks').removeClass('disN');
                    } else { //按日期
                        layero.find('.tasktimeLayer_dates').removeClass('disN');
                        layero.find('.tasktimeLayer_weeks').addClass('disN');
                    }
                });
            },
            //业务配置--监听全选ck点击
            watchCks: function(layero) {
                //全选功能
                form.on('checkbox(tasktime_allCkedFilter)', function(obj) {
                    let isChecked = obj.elem.checked;
                    var inpts = layero.find('.timetask_serviceCks').find('input[type=checkbox]');
                    if (isChecked) {
                        for (let i = 0; i < inpts.length; i++) {
                            let item = inpts[i];
                            $(item).prop('checked', true);
                        };
                        form.render('checkbox');
                    } else {
                        for (let i = 0; i < inpts.length; i++) {
                            let item = inpts[i];
                            $(item).prop('checked', false);
                        };
                        form.render('checkbox');
                    }
                });
            },
            //业务配置的一些固定数据
            serviceParams: function(data) {
                var obj = {};
                //循环日期
                var daysArr = [];
                for (let i = 1; i < 29; i++) {
                    daysArr.push(i);
                };
                obj.daysArr = daysArr;
                //循环小时
                var hoursArr = [];
                for (let i = 0; i < 24; i++) {
                    let newI = i < 10 ? `0${i}(时)` : `${i}(时)`;
                    hoursArr.push({
                        key: i,
                        val: newI
                    });
                };
                obj.hoursArr = hoursArr;
                //循环分钟
                var minutesArr = [];
                for (let i = 0; i < 60; i++) {
                    let newI = i < 10 ? `0${i}(分)` : `${i}(分)`;
                    minutesArr.push({
                        key: i,
                        val: newI
                    });
                };
                obj.minutesArr = minutesArr;
                //处理全部字段
                var reportFieldsArr = data.reportFieldsStr.split(',');
                //处理选中导出子弹
                var exportFieldsArr = data.exportFieldsStr.split(',');
                obj.reportFieldsArr = reportFieldsArr;
                obj.exportFieldsArr = exportFieldsArr;
                var newData = Object.assign({}, data, obj);
                return newData;
            },
            //业务配置提交数据
            serviceSubmitData: function(layero) {
                //表单数据
                var formData = layero.find('#timetask_serviceAddOrEditLayer_form').serializeObject();
                delete formData.allCked;
                if (formData.exportType == 1) {
                    formData.exportDays = '';
                } else {
                    formData.exportWeeks = '';
                }
                //条件参数
                var paramDoms = layero.find('.tasktime_param');
                var paramsArr = [];
                for (let i = 0; i < paramDoms.length; i++) {
                    let obj = {};
                    let item = paramDoms[i];
                    obj.id = $(item).find('input[type=hidden]').val();
                    obj.paramRelation = $(item).find('select').val();
                    obj.paramValue = $(item).find('.timetask_serviceInput').val();
                    paramsArr.push(obj);
                };
                //收件人
                var recipientIds = layero.find('#timetask_serviceAddOrEditLayer_form [name=recipientIds]').val();
                // 是否发送空邮件
                formData.ifSendVoidFile = $('#timetask_serviceAddOrEditLayer_form').find('[name=ifSendVoidFile]').prop('checked');
                //时间参数
                let timeItems = layero.find('.exportTimeStr>.timeItem');
                let exportTimeArr = [];
                for(let i=0; i<timeItems.length; i++){
                  let timeSpanTxt = $(timeItems[i]).find('.time').text();
                  exportTimeArr.push(timeSpanTxt);
                }
                //参数整合
                var submitData = Object.assign({}, formData
                    // , { exportFieldsStr: cksArr.join(',') }
                    , { recipientIds: recipientIds }
                    , { statisticReportSearchParams: paramsArr }
                    , {exportTimeStr: exportTimeArr.join(',')});
                //条件判断
                let isCheckSuccess = this.serviceSubmitDataCheck(submitData);
                if (isCheckSuccess != true) {
                    return isCheckSuccess;
                } else {
                    //返回数据
                    return submitData;
                }

            },
            //业务配置提交数据校验
            serviceSubmitDataCheck: function(data) {
                if (!data.name.trim()) {
                    return '报表名称不能为空';
                }
                // if (!data.exportFieldsStr.trim()) {
                //     return '导出字段不能为空';
                // }
                if(data.status === 'true'){
                    if (data.sendType !="钉钉群聊" && !data.recipientIds.trim()) {
                        return '收件人邮箱不能为空';
                    }
                    if (data.exportType != 1 && !data.exportDays.trim()) {
                        return '定时发送日期不能为空';
                    }
                    if (data.exportType == 1 && !data.exportWeeks.trim()) {
                        return '定时发送星期不能为空';
                    }
                }
                if(data.exportTimeStr == ''){
                  return '请新增定时时间';
                }
                return true;
            },
            //根据id获取到技术配置ajax
            configAjax: function(id) {
                return commonReturnPromise({
                    url: `/lms/statisticReport/getTechnicalConfigDetails/${id}`
                });
            },
            //检测sql安全ajax
            checkSqlAjax: function(executeSql,dataSource) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/statisticReport/riskDetection',
                    params: JSON.stringify({
                        executeSql: executeSql,
                        dataSource: dataSource
                    })
                });
            },
            //保存技术配置ajax
            saveConfigAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/statisticReport/updateTechnicalConfig',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                })
            },
            //新增技术配置
            addConfigAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/statisticReport/addTechnicalConfig',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                })
            },
            //根据id获取到业务配置ajax
            editAjax: function(id) {
                return commonReturnPromise({
                    url: `/lms/statisticReport/getConfigDetails/${id}`
                });
            },
            //保存业务配置id
            saveServiceAjax: function(obj) {
                return commonReturnPromise({
                    url: '/lms/statisticReport/businessChange',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                });
            },
            //立即执行ajax
            immediateAjax: function(id) {
                return commonReturnPromise({
                    type: 'post',
                    url: `/lms/statisticReport/immediateExecution/${id}`
                });
            },
            //树状图渲染
            treeRender: function(userIds,userNames) {
                let _this=this;
                this.treeAjax(userIds,userNames).then(res => {
                    tasktime_emailXTree = new layuiXtree({
                        elem: 'tasktime_serviceEmailXTree', //(必填) 放置xtree的容器id，不要带#号,
                        form: form, //(必填) layui 的 from,
                        isopen: false, //加载完毕后的展开状态
                        ckall: false, //启用全选功能，默认值：false
                        data: res, //(必填) json数组
                        color: { //三种图标颜色，独立配色，更改几个都可以
                            open: "#EE9A00", //节点图标打开的颜色
                            close: "#EEC591", //节点图标关闭的颜色
                            end: "#828282", //末级节点图标的颜色
                        },
                    });
                    tasktime_emailXTree.render();
                    $('#timetask_roleName_input').unbind('keypress');
                    $('#timetask_roleName_input').on('keypress', function(event) {
                        
                        if (event.which === 13) {
                          // 回车键被按下
                          let roleName=$('#timetask_roleName_input').val();
                          if(!roleName){
                            layer.msg('请输入角色名称',{icon:2})
                            return false;
                          }
                          _this.getUserListByFuzzyRoleName(roleName).then(function (result) {
                              var checkedNodes = tasktime_emailXTree.GetChecked();
                              let storeAcctIdList = [];
                              if (checkedNodes&&checkedNodes.length!=0) {
                                 for (var i = 0; i < checkedNodes.length; i++) {
                                    var node = checkedNodes[i];
                                    storeAcctIdList.push(node.value); // 提取节点的值并添加到数组中
                                  }
                              }
                              
                              let _result = dealDataKey(result.data);
                              //   对接口返回的数据进行处理,使其符合xmselect的data的格式
                              function dealDataKey(b) {
                                let arr = []
                                if (Array.isArray(b)) {
                                    b.forEach((item) => {
                                        // let curChecked = storeAcctIdList.filter(
                                        //     (elem) => elem.includes(item.userName)
                                        // )
                                        arr.push({
                                            name: item.userName,
                                            value: item.id,
                                            // selected: curChecked.length ? true : item.checked,
                                            selected: item.checked,
                                            children: item.sysRoles?.length ? dealDataKey(item.sysRoles) : [],
                                        })
                                    })
                                    return arr
                                }
                            }
                              layer.open({
                                  type: 1,
                                  title: "角色名称",
                                  area: ["580px", "660px"],
                                  btn: ["保存", "关闭"],
                                  content: $("#timetaskRoleNameTpl").html(),
                                  id: "timetaskRoleName_tplId",
                                  success: function (layero, index) {
                                      logisticsRuleXmselect = xmSelect.render({
                                          el: "#timetaskRoleNameXTree",
                                          toolbar: {
                                              show: true,
                                          },
                                          height: "350px",
                                          delay: 1000,
                                          paging: true,
                                          pageSize: 1000,
                                          filterable: true,
                                          filterMethod: function (val, item, index, prop) {
                                              let _val = val.replace(/，/g, ",").replace(/\s+/g, "") //中文逗号转为英文逗号，空格全部删掉
                                              //   输入多个数据
                                              if (_val.includes(",")) {
                                                  let _valArr = _val.split(",")
                                                  let isSameVal = _valArr.some(
                                                      (elem) => elem == item.value || item.name == elem
                                                  )
                                                  return isSameVal
                                              } else if (_val == item.value) {
                                                  //把value相同的搜索出来
                                                  return true
                                              } else if (item.name.indexOf(_val) != -1) {
                                                  //名称中包含的搜索出来
                                                  return true
                                              }
                                              return false //不知道的就不管了
                                          },
                                          data: _result,
                                          filterDone:function(val, list) {
                                          }
                                      })
                                  },
                                  yes: function (index, layero) {
                                    let userNames = $("#timetaskRoleNameXTree .label-content").attr('title');
                                    var userIds = [];
                                    let checkedInput=$("#tasktime_serviceEmailXTree input[data-xend=1]:checked");
                                    checkedInput.each((i,item_input)=>{
                                        let value =$(item_input).val();
                                        if (value.indexOf("user") != -1) { //用户节点
                                            var user = value.split("&");
                                            var userId = user[1];
                                            userIds.push(userId);
                                        };
                                    });
                                    userIds=userIds.join(',');
                                    _this.treeRender(userIds,userNames);
                                    layer.close(index);
                                  },
                              })
                          })
                        return false
                        }
                    });
                
                }).catch(err => {
                    // console.log(err);
                    let errMsg = typeof (err) == 'object' ? '选择邮箱出错' : err;
                    layer.msg(errMsg, { icon: 2 });
                });
            },
            //树插件接口
            treeAjax: function(userIds,userNames) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/sysdict/reloadEmailOrgTree.html',
                    params: {
                        userIds: userIds,
                        userNames:userNames
                    }
                });
            }
        };
        //新增功能
        timetaskName.addBtnHandle();
        //删除功能
        timetaskName.deleteBtnHandle();
        //表单提交事件
        form.on("submit(timetask_filter)", function(data) {
            var data = data.field; //获取到表单提交对象
            timetaskName.tableRender(data);
        });

    });
})(jQuery, layui, window, document);
