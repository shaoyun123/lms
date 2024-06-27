;
(function($, layui, window, document, undefined) {
    layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'upload', 'laydate'], function() {
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            upload = layui.upload,
            laypage= layui.laypage,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            form = layui.form;
        form.render();
        //打印
        new dropButton('tobedelivered_express_delivery');
        new dropButton('tobedelivered_printOperate');
        new dropButton('tobedelivered_platOperate');

         // 模板查询赋值
      commonSaveSearchTpl({
        id: "tobedelivered_save",
        formId: "tobedeliveredForm",
        pageName: "auditDespathOrder_tobedelivered",
        searchBtnId: "tobedeliveredSearch",
        cb: param => tobedelivered_formVal(param),
      })
        // 前端更新行，更新后不刷新表格
        function updateTableRow_toBedelivered(ids,errIdsArr){
            zttCommonUpdataDataHandle({
                selectedIds: ids,
                errIds: errIdsArr
            }).then(newObj => {
                // 修改成功的数据
                let { successIds } = newObj;
                if(successIds.length != 0){
                    // 选中的数据
                    let checkStatus = toBedelivered_gridOptions.api.getSelectedRows();
                    let newCheckStatus = deepCopy(checkStatus)
                    commonReturnPromiseRes({
                        url: ctx + '/unshippedorder/listorder.html',
                        type: 'POST',
                        params:{orderIds:successIds.join(",")}
                    }).then(function(result){
                        // 匹配选中的数据
                        for(let i=0,iLen=result.data.length;i<iLen;i++){
                            for(let j=0,jLen=newCheckStatus.length;j<iLen;j++){
                                if(newCheckStatus[j].id == result.data[i].id){
                                    newCheckStatus[j] = deepCopy(result.data[i])
                                    break;
                                }
                            }
                        }
                        toBedelivered_gridOptions.api.updateRowData({ update: newCheckStatus });
                    })
                }
            });
        }

        function tobedelivered_formVal(param) {
            let $formDom = $("#tobedeliveredForm")
            let timeStamp = 0 // 调接口的需要加400
            //  销售 客服
            if (param.salerAndcustomSelect) {
            $formDom.find("select[name=salerAndcustomSelect]").val(param.salerAndcustomSelect)
            }
            // 平台
            if (param.platCode) {
            $formDom.find("select[name=platCode]").next().find(`dd[lay-value="${param.platCode}"]`).trigger("click")
            timeStamp += 400
            form.render()
            }
            // 店铺 赋值
            setTimeout(() => {
                commonReturnPromise({
                    url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
                    type: "post",
                    params: {
                    roleNames: `${param.platCode}专员`,
                    orgId: param.orgs,
                    salePersonId: param.salePersonId,
                    platCode: param.platCode,
                    type: param.salerAndcustomSelect == 1 ? "salesperson" : "customservicer",
                    },
                }).then(res => {
                    const storeList = param.storeAcctIds ? param.storeAcctIds.split(",") : []
                    const arr = res.map(item => ({
                    name: item.storeAcct,
                    value: item.id,
                    selected: storeList.filter(elem => elem == item.id).length,
                    }))
                    formSelects.data("tobedelivered_storeAcct", "local", { arr })
                    const acctIds = res.map(item=>item.id).join(',')
                    $('#tobedeliveredForm').find(`select[_name=storeAcctIds]`).attr('acct_ids',acctIds)
                    // 给表单赋值
                    form.val("tobedeliveredForm", param)
                    // 更多查询条件是否有值
                    tobedeliveredName.hasValue()
                    // 多选的 name: xm-select
                    let multiSelectObj = {
                        salePersonId: "tobedelivered_salePersonsSelect",
                        prodLogisAttrs: "tobedelivered_logisAttrs",
                        platOrderStatusList: "tbd_platOrderStatusList",
                        shippingCountryCodes: "tobedelivered_shippingCountrys",
                        platTags: "tobedelivered_platTags",
                        logisTypeIds: "xm_tobedelivered_logisTypeIds",
                        orderLabels: "tobedelivered_orderLabels",
                    }
                    Object.keys(multiSelectObj).forEach(item => {
                        if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                        } else {
                        formSelects.render(multiSelectObj[item])
                        }
                    })
                    // 执行搜索
                    $('#tobedeliveredSearch').click()
                })
            }, timeStamp)

            if (param.companyType) {
            $formDom.find("select[name=companyType]").next().find(`dd[lay-value="${param.companyType}"]`).trigger("click")
            }
            if (param.company) {
            $formDom.find("select[name=company]").next().find(`dd[lay-value="${param.company}"]`).trigger("click")
            }
        }



        formSelects.render('tbd_platOrderStatusList', { placeholder: '请先选择平台' });
        formSelects.render('tobedelivered_store', { placeholder: '请先选择平台' });
        //渲染平台标记
        tobedelivered_renderPlatCodeMark();
        function tobedelivered_renderPlatCodeMark () {
            commonReturnPromise({
                url: '/lms/unauditorder/listenum.html'
            }).then(res => {
                let { platTagList } = res;
                commonRenderSelect('tobedelivered_platTags', platTagList).then(() => {
                    formSelects.render('tobedelivered_platTags');
                });
            });
        }
        // document.onkeydown = function (e) {
        //     e = e ? e : event;
        //     if(e.keyCode == 13 || e.which ==13){ // 回车键
        //         $('[lay-filter="tobedeliveredSearch"]').trigger('click');
        //     }
        // }
        $('#tobedeliveredForm').on('keyup', 'input', function (e) {
            if (e.keyCode == 13) { // 回车键
                $(this).select();
                $('[lay-filter="tobedeliveredSearch"]').trigger('click');
            }
        });

              //导出功能
      componentForOrderDownload('tobedelivered_exportTemplate', function(){
        let data = toBedelivered_gridOptions.api.getSelectedRows();
        let idsArr = data.map(function (item) {
          return item.id;
        });
        return idsArr;
      });

        var tobedeliveredName = {
            //通用的打印处理
            commonPrintHandle (status) {
                let params = {
                    printType: 23
                };
                if (status) {
                    params.printArray = "['85017F001E040064','8A01000000000001']";
                } else {
                    params.printArray = "['85417F001E040024','8A01000000000001']";
                }
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: "post",
                        url: 'http://localhost:9898',
                        // url: 'http://192.168.0.123:9898',
                        dataType: "json",
                        data: params,
                        success: function () {
                            loading.show();
                        },
                        error: function (jqXHR) {
                            loading.hide();
                            var responseText = jqXHR.responseText;
                            if (responseText == null || responseText.indexOf("打印成功") == -1) {
                                reject("打印错误，请检查打印插件是否正常运行或者重新启动插件", {icon: 2});
                            }
                            resolve('打印成功');
                        }
                    });
                });
            },
            //页面操作事件end
            getTableSelectIds() {
                return new Promise(function (resolve, reject) {
                    let data = toBedelivered_gridOptions.api.getSelectedRows();
                    if (!data.length) {
                        reject('请先选中一条数据');
                    };
                    resolve(data)
                });
            },
            //燕文截单功能
            yanwenCutOrderFn () {
                var _this = this;
                $('#tobedelivered_yanwenCutOrder').on('click', function () {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        var idsArr = res.map(function(item) {
                            return item.id;
                        });
                        layer.prompt({
                            formType: 2,
                            value: '',
                            title: '燕文截单备注',
                            area: ['500px', '300px'] //自定义文本域宽高
                          }, function(value, index, elem){
                            commonReturnPromise({
                                url: '/lms/platorder/cancelYanwen.html',
                                type: 'post',
                                params: {
                                    ids: idsArr.join(','),
                                    remark: value
                                }
                            }).then(res => {
                                layui.admin.batchResultAlert("燕文截单完成:", res, function() {
                                });
                                layer.close(index);
                            })
                          });
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                })
            },
            //平台操作功能
            platOperateFeatures: function () {
                 let _this = this
                //wish退款
                $('#tobedelivered_wishRefund').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        originOrderWishRefund(res,'batch',function(){
                            $('[lay-filter=tobedeliveredSearch]').trigger('click');
                        })
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                })
                //ebay取消
                $('#tobedelivered_cancelOrderEbay').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        var idsArr = res.map(function(item) {
                            return item.id;
                        });
                        layer.open({
                            type: 1,
                            title: '取消ebay订单',
                            content: $('#tobedelivered_cancelEbayTpl').html(),
                            area: ['40%', '30%'],
                            id: 'tobedelivered_cancelEbayTplId',
                            btn: ['确定', '关闭'],
                            success: function(layero, index) {
                                form.render();
                            },
                            yes: function(index, layero) {
                                var cancelReason = layero.find('[name=cancelReason]:checked').val();
                                layer.close(index);
                                commonReturnPromise({
                                    url: '/lms/unauditorder/cancelorder/ebay.html',
                                    type: 'post',
                                    params: {
                                        ids: idsArr.join(),
                                        cancelReason: cancelReason
                                    }
                                }).then(function(result) {
                                    layui.admin.batchResultAlert("ebay取消订单完成:", result, function (errIdsArr) {
                                        zttCommonRemoveDataHandle({
                                            selectedIds: idsArr,
                                            gridOptions: toBedelivered_gridOptions,
                                            tableData: immutableStore,
                                            errIds: errIdsArr
                                        }).then(newObj => {
                                            let { newData, successIds } = newObj;
                                            // immutableStore = newData;
                                            let oldNum = $('#tobedelivered-tabs ul li.layui-this>span').text();
                                            let newNum = oldNum - successIds.length;
                                            $('#tobedelivered-tabs ul li.layui-this>span').text(newNum);
                                            $('#toBedeliveredPage .layui-laypage-count').text(`共 ${newNum} 条`);
                                        });
                                    });
                                }).catch(function(resErr) {
                                    layer.msg(resErr.message, { icon: 2 });
                                });
                            }
                        });

                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
                //更新订单状态
                $('#tobedelivered_syncOrderStatus').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        var idsArr = res.map(function(item) {
                            return item.id;
                        });
                        commonReturnPromise({
                            url: '/lms/unauditorder/syncplatstatus.html',
                            type: 'post',
                            params: {
                                ids: idsArr.join()
                            }
                        }).then(function(result) {
                            layui.admin.batchResultAlert("更新订单状态完成:", result, function(errIdsArr) {
                                updateTableRow_toBedelivered(idsArr,errIdsArr)
                            });
                        }).catch(function(resErr) {
                            layer.msg(resErr.message, { icon: 2 });
                        });
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
                //标记平台发货
                $('#tobedelivered_markDelivery').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        var idsArr = res.map(function(item) {
                            return item.id;
                        });
                        zttCommonProgressBar({ type: 10, ids: idsArr.join() }, function (progressData) {
                            layui.admin.batchResultAlert("标记平台发货:",progressData,function(errIdsArr){
                                updateTableRow_toBedelivered(idsArr,errIdsArr)
                            });
                        });
                        // commonReturnPromise({
                        //     url: '/lms/unauditorder/markplatshipping.html',
                        //     type: 'post',
                        //     params: {
                        //         ids: idsArr.join()
                        //     }
                        // }).then(function(result) {
                        //     layui.admin.batchResultAlert("标记平台发货完成:", result, function() {
                        //     });
                        // })
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
                //批量备注
                $('#tobedelivered_batchRemark').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        var idsArr = res.map(function(item) {
                            return item.id;
                        });
                        let ids = idsArr.join('-');
                        commonDirectMailRemarkBatch(ids,toBedelivered_gridOptions);
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
                // amazon 邮件
                $("#tobedelivered_amazonEmail").on("click", function () {
                    orderAmazonEmail(toBedelivered_gridOptions)
                })
                // ebay 邮件
                $("#tobedelivered_eBayEmail").on("click", function () {
                    orderEbayEmail(toBedelivered_gridOptions)
                })
            },
            //导出功能
            exportDetails: function () {
                 let _this = this
                //导出明细
                $('#tobedeliveredDetail_export').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        let ids = res.map(v => v.id)
                        // layer.confirm('导出选择的订单明细？', function(result) {
                        //     if (result) {
                                let param = {};
                                param.orderIds = ids.join(",");
                                submitForm(param, ctx + '/platorder/exportorderdetail.html', "_blank");
                                layer.closeAll();
                        //     }
                        // });

                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
                //导出
                $('#tobedelivered_export').on('click', function() {
                    _this.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                        // console.log(res);
                        let ids = res.map(v => v.id)
                        // console.log(ids);
                        // layer.confirm('导出选择的订单？', function(result) {
                        //     if (result) {
                                let param = {};
                                param.orderIds = ids.join(",");
                                submitForm(param, ctx + '/platorder/exportorder.html', "_blank");
                                layer.closeAll();
                        //     }
                        // });

                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    });
                });
            },
            //补打交接单接口
            makeupOrder (inputInfo) {
                return commonReturnPromise({
                    url: `/lms/unshippedorder/getbatchInfoByInput.html?inputInfo=${inputInfo}`,
                })
            },
            makeupOrderHandle () {
                let _this = this;
                $('#tobedelivered_makeupOrderBtn').on('click', function () {
                    let val = $('#tobedelivered_makeupOrderInput').val();
                    if (!val) {
                        return layer.msg('请先输入补打扫描跟踪号/订单号/交接单号', { icon: 7 });
                    } else {
                        _this.makeupOrder(val).then(res => {
                            let { batchNo, orderNum, totalWeight } = res;
                            window.open(ctx + '/static/html/handoverForm.html?batchNo=' + batchNo + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                        })
                    }
                });
            },
            //#region 拣货完成 start
            pickCompleteHandle: function() {
                var _this = this;
                $('#tobedelivered-pickCompleteBtn').on('click', function () {
                    _this.getTableSelectIds('tobedelivered_tableId')
                        .then(res => {
                            var idsArr = res.map(item => item.id);
                            commonOrderConfirmLayer(idsArr.length, function (index) {
                                _this.pickCompleteAjax(idsArr)
                                    .then(result => {
                                        layer.close(index)
                                        admin.batchResultAlert("已发货完成:", result, function (errIdsArr) {
                                            zttCommonRemoveDataHandle({
                                                selectedIds: idsArr,
                                                gridOptions: toBedelivered_gridOptions,
                                                tableData: immutableStore,
                                                errIds: errIdsArr
                                            }).then(newObj => {
                                                let { newData, successIds } = newObj;
                                                // immutableStore = newData;
                                                let oldNum = $('#tobedelivered-tabs ul li.layui-this>span').text();
                                                let newNum = oldNum - successIds.length;
                                                $('#tobedelivered-tabs ul li.layui-this>span').text(newNum);
                                                $('#toBedeliveredPage .layui-laypage-count').text(`共 ${newNum} 条`);
                                            });
                                            // let temArr = getOrderId(result.successResults, '转已发货', result.successNum) || []
                                            // changeCount('#tobedelivered-tabs', result.successNum, 2)
                                            // temArr.forEach(value => {
                                            //     deleteCheckedData('tobedelivered_tableId', [value], `td[data-content="${value}"]`, 'tobedelivered_table')
                                            // })
                                            // $('[lay-filter="tobedeliveredSearch"]').trigger('click');
                                        });
                                    })
                                    .catch(err => layer.msg(err, { icon: 2 }));
                            })
                        })
                        .catch(err => layer.msg(err, { icon: 2 }));
                })
            },
            pickCompleteAjax: function(idsArr) {
                return commonReturnPromise({
                    url: '/lms/platorder/toshipped.html',
                    type: 'post',
                    params: {
                        ids: idsArr.join()
                    }
                })
            },
            //错误的信息警告
            errorVoiceWarning: function () {
                $('#tobedelivered_audioplay')[0].play();
            },
            //正确的信息响应
            successVoiceWarning: function () {
                $('#tobedelivered_audioplaySuccess')[0].play();
            },
            //#endregion 拣货完成end
            //#region 驳回订单 start
            rejectHandle: function() {
                var _this = this
                $('#tobedelivered-rejectBtn').on('click', function () {
                    _this.getTableSelectIds('tobedelivered_tableId')
                        .then(res => {
                            var idsArr = res.map(item => item.id);
                            commonOrderConfirmLayer(idsArr.length, function (index) {
                                _this.rejectAjax(idsArr)
                                    .then(result => {
                                        layer.close(index)
                                        admin.batchResultAlert("驳回订单完成:", result, function (errIdsArr) {
                                            zttCommonRemoveDataHandle({
                                                selectedIds: idsArr,
                                                gridOptions: toBedelivered_gridOptions,
                                                tableData: immutableStore,
                                                errIds: errIdsArr
                                            }).then(newObj => {
                                                let { newData, successIds } = newObj;
                                                // immutableStore = newData;
                                                let oldNum = $('#tobedelivered-tabs ul li.layui-this>span').text();
                                                let newNum = oldNum - successIds.length;
                                                $('#tobedelivered-tabs ul li.layui-this>span').text(newNum);
                                                $('#toBedeliveredPage .layui-laypage-count').text(`共 ${newNum} 条`);
                                            });
                                            // let temArr = getOrderId(result.successResults, '驳回订单', result.successNum) || []
                                            // changeCount('#tobedelivered-tabs', result.successNum, 2)
                                            // temArr.forEach(value => {
                                            //     deleteCheckedData('tobedelivered_tableId', [value], `td[data-content="${value}"]`, 'tobedelivered_table')
                                            // })
                                            // $('[lay-filter="tobedeliveredSearch"]').trigger('click');
                                        });
                                    })
                                    .catch(err => layer.msg(err, { icon: 2 }));
                            })
                        })
                        .catch(err => layer.msg(err, { icon: 2 }));
                })
            },
            rejectAjax: function(idsArr) {
                return commonReturnPromise({
                    url: '/lms/abnormalorder/toaudit.html',
                    type: 'post',
                    params: {
                        ids: idsArr.join()
                    }
                })
            },
            //#endregion 驳回订单 end
            //#region 扫描核单start
            scanHandle: function() {
                var _this = this;
                $('#tobedelivered-scanBtn').on('click', function () {
                    //先请求接口获取物流
                    commonReturnPromise({
                        url: '/lms/unshippedorder/scanCheckTempLogisCompany.html'
                    }).then(data => {
                        //拼接字符串
                        let domStr = '<div style="text-align:center;margin-top:20px;"><div class="layui-form" lay-filter="scanLayer_prevFilter">';
                        for (let [key, value] of Object.entries(data)) {
                            domStr += `<input type="checkbox" name="scanLayer_prev_cks" title="${value}" value="${key}"  lay-skin="primary">`;
                        }
                        domStr += '</div></div>';
                        let targetLen = Object.keys(data).length;
                        if (targetLen == 0) {
                            _this.scanLayerDetailHandle('');
                        } else if (targetLen == 1) {
                            _this.scanLayerDetailHandle(Object.keys(data)[0]);
                        } else {
                            //前置弹框
                            layer.open({
                                type: 1,
                                title: '选择展示已扫描订单',
                                area: ['50%', '30%'],
                                content: domStr,
                                id: 'scanLayer_prevFilterId',
                                btn: ['确定', '取消'],
                                success: function () {
                                    form.render(null, 'scanLayer_prevFilter');
                                },
                                yes: function (confirmIndex, confirmLayero) {
                                    let idsArr = [];
                                    let cksDom = confirmLayero.find('[name=scanLayer_prev_cks]');
                                    for (let i = 0; i < cksDom.length; i++){
                                        let dom = cksDom[i];
                                        if ($(dom).is(':checked')) {
                                            let id = $(dom).val();
                                            idsArr.push(id);
                                        }
                                    }
                                    if (idsArr.length == 0) {
                                        return layer.msg('请选择物流公司', { icon: 2 });
                                    }
                                    layer.close(confirmIndex);
                                    _this.scanLayerDetailHandle(idsArr.join(','));
                                },
                                end: function () {
                                    _this.scanLayerDetailHandle('');
                                }
                            });
                        }
                        
                    });
                });
            },
            //扫描核单弹框
            scanLayerDetailHandle (ids) {
                var _this = this;
                layer.open({
                    type: 1,
                    title: '扫描核单',
                    area: ['100%', '80%'],
                    content: $('#tobedelivered-scanLayer').html(),
                    id: 'tobedelivered-scanLayerId',
                    move: false,
                    success: function (layero, index) {
                        //初始化渲染
                        _this.scanTableInit(layero, ids);
                        _this.referKeycode(layero);
                        _this.orderKeycode(layero);
                        _this.joinCompleteHandle(layero);
                        _this.scanPrintHandle(); //打印交接单
                        _this.makeupOrderHandle();
                        form.render();
                    },
                    end: function() {
                        sessionStorage.removeItem('SCANBATCHNO');
                    },
                    cancel: function() {
                        commonReturnPromise({
                            url: '/lms/unshippedorder/scanCheckTemp.html',
                            params: {
                                logisCompanyIds: ids
                            }
                        }).then(res => {
                            if (res && res.length > 0) {
                                layer.confirm('您在扫描核单中有未完成组包的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                    layer.closeAll();
                                    }, function() {
                                    });
                            } else {
                                layer.closeAll();
                            }
                        })
                        return false
                    }
                });
            },
            //扫描数据缓存
            scanTableInit: function (layero, ids) {
                var $tbody = layero.find('#tobedelivered-scanTbody');
                var _this = this;
                if (ids.length == 0) {
                    _this.dataRender();
                } else {
                    commonReturnPromise({
                        url: `/lms/unshippedorder/scanCheckTemp.html?logisCompanyIds=${ids}`,
                    }).then(res => {
                        if (res && res.length > 0) {
                            layero.find('input[name="order"]').focus();
                            let trStr = '';
                            let logisTypeNameArr = [];
                            for (let i = 0; i < res.length; i++) {
                                let data = res[i];
                                let trs = `
                                    <tr>
                                        <td class="tableOrderId">${data.id || ''}</td>
                                        <td class="logisTypeName">${data.logisTypeName || ''}
                                            <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                            <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                            <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                        </td>
                                        <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                        <td>${data.storeAcct || ''}</td>
                                        <td class="realWeight">${(data.realWeight / 1000).toFixed(4) || ''}</td>
                                        <td>${data.shippingCost !== undefined ? data.shippingCost : ""}</td>
                                        <td>${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                        <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                                    </tr>
                                `;
                                trStr += trs;
                                logisTypeNameArr.push(res[i].logisTypeId)
                            }
                            $tbody.html(trStr);
                            _this.computedTotalWeight($tbody, 'tobedeliveredScan_totalWeight');
                            _this.countOrderNum($tbody, 'tobedelivered_orderNum');
                            _this.dataRender(res[0].logisCompanyId, logisTypeNameArr);
                        }
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    });
                }
                
            },
            dataRender: function(selectedCompany, selectedLogins) {
                let temCompany = selectedCompany ? selectedCompany : ''
                let temLogins = selectedLogins ? selectedLogins : []
                this.allCompanyAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-companySelect', result['companys'] || [], { name: 'cnName', code: 'id' }).then(function() {
                        if (temCompany) {
                            $('#tobedelivered-companySelect').val(temCompany).attr('disabled', true)
                        }
                        form.render()
                    });
                });
                this.allLogisTypeAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-waySelect', result || [], { name: 'name', code: 'id' }).then(function() {
                        formSelects.render('tobedelivered-waySelect');
                        if (temLogins.length && temLogins) {
                            formSelects.value('tobedelivered-waySelect', temLogins);
                        }
                    });
                });

            },
            //回车事件-参考单号或跟踪号
            referKeycode: function(layero) {
                var _this = this;
                var $referInput = layero.find('input[name=referOrder]');
                var $orderInput = layero.find('input[name=order]');
                $referInput.on('keyup', function(e) {
                    if (e.keyCode == 13) { //回车事件
                        _this.referKeyBlur(layero, 'referOrder', e).then(() => {
                            var val = e.target.value;
                            _this.scanSearchAjax1(val).then(function (result) {
                                $('#tobedelivered-companySelect').removeAttr('disabled')
                                $('#tobedelivered-companySelect').val(result.logisCompanyId);
                                form.render();
                                formSelects.value('tobedelivered-waySelect', [result.logisTypeId]);
                                //订单编号获取焦点
                                $orderInput.focus();
                            }).catch(function (err) {
                                _this.errorVoiceWarning();
                                $referInput.select();
                                _this.packageEnterClose(err, function () {
                                    $('#tobedelivered-scanLayerId input[name=referOrder]').blur()
                                })
                                // _this.errHandle('扫描单号查询出错,请重试', err);
                            });
                        }).catch(checkErr => {
                            return layer.msg(checkErr, { icon: 7 });
                        });
                        return false;
                    }
                });
            },
            //失焦事件-参考单号或跟踪号[左侧]
            referKeyBlur: function (layero, name, e) {
                return new Promise(function (resolve, reject) {
                    var _this = this;
                    var $referInput = layero.find(`input[name=${name}]`);
                    var $trackNumFilter = layero.find('[name=trackNumFilter]');
                    var $checkTrackLength = layero.find('[name=checkTrackLength]');
                    var $trackNumFilterFront = layero.find('input[name=trackNumFilterFront]');
                    var $trackNumFilterAfter = layero.find('input[name=trackNumFilterAfter]');
                    var $checkTrackLengthNum = layero.find('input[name=checkTrackLengthNum]');
                    var $filterBracket = layero.find('input[name=filterBrackets]');//过滤中括号
                    //#region 跟踪号过滤
                    var val = e.target.value;
                    var isTrackNumFilter = $trackNumFilter.is(':checked');
                    var frontVal = $trackNumFilterFront.val().trim();
                    var afterVal = $trackNumFilterAfter.val().trim();
                    if (isTrackNumFilter) {
                        if ((!frontVal && !afterVal)) {
                            $referInput.select();
                            // return layer.msg('请输入过滤条件', { icon: 7 });
                            reject('请输入跟踪号过滤条件');
                        }
                        if (frontVal && !isNaN(frontVal)) {
                            e.target.value = val.slice(frontVal,);
                            // resolve();
                        } else if(frontVal && isNaN(frontVal)){
                            // return layer.msg('请输入数字', { icon: 7 });
                            reject('不允许输入非数字');
                        }
                        if (afterVal && !isNaN(afterVal)) {
                            var newVal = e.target.value;
                            e.target.value = newVal.slice(0, newVal.length - afterVal);
                            // resolve();
                        } else if((afterVal && isNaN(afterVal))){
                            // return layer.msg('请输入数字', { icon: 7 });
                            $trackNumFilterAfter.select();
                            reject('不允许输入非数字');
                        }
                    }
                    //#endregion
                    //#region 跟踪长度校验
                    var isCheckTrackLength = $checkTrackLength.is(':checked');
                    var checkTrackLengthNumVal = $checkTrackLengthNum.val().trim();
                    if (isCheckTrackLength && !checkTrackLengthNumVal) {
                        reject('请输入长度校验的位数');
                    } else if (isCheckTrackLength && checkTrackLengthNumVal) {
                        if (isNaN(checkTrackLengthNumVal)) {
                            reject('不允许输入非数字');
                        } else {
                            var checkInputVal = e.target.value;
                            if (checkInputVal.length != checkTrackLengthNumVal) {
                                reject(`当前长度为${checkInputVal.length},期望长度为${checkTrackLengthNumVal}`);
                            }
                        }
                    }
                    resolve();
                  //#endregion
                    
                  //#region 过滤中括号
                    var isFilterBracketh = $filterBracket.is(':checked');
                    if (isFilterBracketh) {
                        e.target.value = val.replace(/\[|]/g,'')
                    }
                //#endregion
                });
            },
            //回车事件-订单编号或跟踪号[右侧]
            orderKeycode: function(layero) {
                var _this = this;
                var $orderInput = layero.find('input[name=order]');
                var $company = layero.find('input[name=company]'); //订单快递公司
                var $logisWay = layero.find('input[name=logisWay]'); //订单物流方式
                var $checkWay = layero.find('[name=checkWay]');
                var $checkCompany = layero.find('[name=checkCompany]');
                var $tbody = layero.find('#tobedelivered-scanTbody');
                //回车增加tbody内容
                $orderInput.on('keyup', function(e) {
                    if (e.keyCode == 13) { //回车事件
                        var val = e.target.value;
                        var isCheckWay = $checkWay.is(':checked');
                        var isCheckCompany = $checkCompany.is(':checked');
                        var checkesArr = formSelects.value('tobedelivered-waySelect');
                        var names = checkesArr.map(function(item) {
                            return item.name;
                        });
                        //判断表格是否有该条数据
                        // if (_this.isExistOrder($tbody, val)) {
                        //     $orderInput.focus().select();
                        //     var speechSynthesisUtterance = new SpeechSynthesisUtterance(`重复`);
                        //     speechSynthesisUtterance.rate = 3;
                        //     speechSynthesis.speak(speechSynthesisUtterance);
                        //     return layer.msg('该订单编号已存在', { icon: 7 });
                        // }

                        _this.referKeyBlur(layero, 'order', e).then(() => {
                            var val = e.target.value;
                            _this.scanSearchAjax(val).then(function(result) {
                                $company.val(result.logisCompanyName);
                                if (isCheckCompany && result.logisCompanyName != $('#tobedelivered-companySelect option:selected').text()) {
                                    commonReturnPromise({
                                        url: '/lms/unshippedorder/deleteById.html?orderId=' + result.orderId
                                    })
                                    return layer.msg('【非同一物流】订单号：' + result.orderId + '；物流公司：' + result.logisCompanyName + '；物流方式：' + result.logisTypeName, { icon: 2 });
                                }
                                $logisWay.val(result.logisTypeName);
                                if (isCheckWay && !names.includes(result.logisTypeName)) {
                                    commonReturnPromise({
                                        url: '/lms/unshippedorder/deleteById.html?orderId=' + result.orderId
                                    })
                                    return layer.msg('【非同一物流】订单号：' + result.orderId + '；物流公司：' + result.logisCompanyName + '；物流方式：' + result.logisTypeName, { icon: 2 });
                                }
                                //添加到表格
                                _this.successVoiceWarning();
                                _this.scanTbodyHandle($tbody, result);
                                //计算合计重量
                                _this.computedTotalWeight($tbody, 'tobedeliveredScan_totalWeight');
                                //统计订单数量
                                _this.countOrderNum($tbody, 'tobedelivered_orderNum');
                                //订单编号或跟踪号相关选项,并且input输入框获取焦点
                                $company.val('');
                                $logisWay.val('');
                                $orderInput.val('').focus();
                                //对的执行这个逻辑
                                _this.commonPrintHandle(true).then(() => {
                                    // console.log('打印正确逻辑,右走')
                                });
                            }).catch(function (err) {
                                _this.commonPrintHandle(false).then((res) => {
                                    // console.log('打印正确逻辑,左走')
                                });;
                                $orderInput.focus().select();
                                _this.errorVoiceWarning();
                                _this.packageEnterClose(err, function () {
                                    $('#tobedelivered-scanLayerId input[name=order]').blur()
                                },$('#tobedelivered-scanLayerId input[name=order]'))
                                // _this.errHandle('扫描单号查询出错,请重试', err);
                            });
                        }).catch(checkErr => {
                            return layer.msg(checkErr, { icon: 7 });
                        });
                        return false;
                    }
                });
                //监听tbody-移除按钮事件
                _this.watchDelete($tbody, 'tobedeliveredScan_totalWeight', 'tobedelivered_orderNum');
            },
            //判断表格是否有相同的订单号
            isExistOrder: function ($tbody, val) {
                var $trs = $tbody.find('tr');
                var orderId = val.toString();
                var orderIdArr = [];
                for (var i = 0; i < $trs.length; i++) {
                    var tr = $trs[i];
                    var tableOrderId = $(tr).find('.tableOrderId').text();
                    orderIdArr.push(tableOrderId);
                }
                return orderIdArr.includes(orderId);
            },
            //tbody追加元素
            scanTbodyHandle: function($tbody, data) {
                var trs = `
                    <tr>
                        <td class="tableOrderId">${data.orderId || ''}</td>
                        <td class="logisTypeName">${data.logisTypeName || ''}
                            <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                            <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                            <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                        </td>
                        <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                        <td>${data.storeAcct || ''}</td>
                        <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                        <td>${data.shippingCost!==undefined ? data.shippingCost : "" }</td>
                        <td>${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                        <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                    </tr>
                `;
                $tbody.find('tr').length > 0 ? $tbody.find('tr').eq(0).before(trs): $tbody.append(trs);
            },
            //计算合计重量
            computedTotalWeight: function($tbody, totalWeightId) {
                var $trs = $tbody.find('tr');
                var totalWeight = 0;
                for (var i = 0; i < $trs.length; i++) {
                    var tr = $trs[i];
                    var trWeight = Number($(tr).find('.realWeight').text());
                    totalWeight += trWeight;
                }
                // $(`#${id}`).text(`${totalWeight/1000}kg`);
                $(`#${totalWeightId}`).text(`${(totalWeight).toFixed(4)}kg`);
            },
            //统计订单数量
            countOrderNum: function($tbody, orderNumId, type='') {
                var $trs = $tbody.find('tr');
                if(type == 'span'){
                  $(`#${orderNumId}`).text($trs.length);
                }else{
                  $(`#${orderNumId}`).val($trs.length);
                }
            },
            //监听tbody删除事件
            watchDelete: function ($tbody, totalWeightId, orderNumId, type='') {
                var _this = this;
                $tbody.on('click', '.scanTbodyRemoveBtn', function () {
                    var orderId = $(this).parents('tr').find('td.tableOrderId').text();
                    $(this).parents('tr').remove();
                    _this.computedTotalWeight($tbody, totalWeightId);
                    _this.countOrderNum($tbody, orderNumId, type);
                    commonReturnPromise({
                        url: '/lms/unshippedorder/deleteById.html?orderId=' + orderId
                    }).then(res => {

                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                })
            },
            //交接完成
            joinCompleteHandle: function(layero) {
                var _this = this;
                $('#tobedelivered-joinBtn').on('click', function() {
                    var $trs = layero.find('#tobedelivered-scanTbody').find('tr');
                    var totalWeight = ($('#tobedeliveredScan_totalWeight').text().split('kg')[0]*1000).toFixed(2); //总重量
                    var orderNum = $('#tobedelivered_orderNum').val(); //订单数量
                    var dataArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var orderId = $(item).find('td:first-child').text();
                        var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                        var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                        var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                        var logisTypeName = $(item).find('.logisTypeName').text();
                        var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                        var scanTime = new Date($(item).find('td:nth-last-child(2)').text()).getTime();
                        var obj = {
                            orderId: orderId,
                            logisCompanyId: logisCompanyId,
                            logisCompanyName: logisCompanyName,
                            logisTypeId: logisTypeId,
                            logisTypeName: logisTypeName,
                            logisTrackingNo: logisTrackingNo,
                            scanTime: scanTime,
                            totalWeight: totalWeight,
                            orderNum: orderNum
                        };
                        dataArr.push(obj);
                    }
                    _this.submitAjax(dataArr).then(function(result) {
                        sessionStorage.setItem('SCANBATCHNO', JSON.stringify(result));
                        _this.commonCloseLayer(`批次号: ${result}`);
                    }).catch(function(err) {
                        _this.errHandle('提交交接单接口调用失败', err);
                    })
                });
            },
            tobedeliveredClearData: function (type='') {
                //虾皮组包
                sessionStorage.removeItem('SHOPEESCANBATCHNO');
                $("#tobedelivered-shopeeScanTbody").html("");
                $("#tobedeliveredScan_totalWeightShopee").text("0")
                //优选仓组包
                sessionStorage.removeItem('OPTIMIZATIONSHEETBATCHNO')
                $("#tobedelivered-optimizationScanTbody").html("")
                $("#tobedeliveredScan_totalWeightOptimization").text("0")
                //smt交接
                sessionStorage.removeItem('SMTBIGBATCHNO')
                $("#tobedelivered-bigPackageTbody").html("")
                $("#tobedeliveredSmtBig_totalWeight").text("0")
                //扫描核单
                sessionStorage.removeItem('SCANBATCHNO')
                $("#tobedelivered-scanTbody").html("")
                $("#tobedeliveredScan_totalWeight").text("0")
                //lazada交接
                sessionStorage.removeItem('LAZADASHEETBATCHNO')
                $("#tobedelivered-lazadaSheetTbody").html("")
                $("#tobedeliveredLazadaSheet_totalWeight").text("0")
                //AE
                if(type == 'AE揽收'){
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-COLLET')
                  $("#tobedelivered-aefullyhostedScanTbody-collect").html("")
                  $("#tobedelivered_orderNumAefullyhosted_collet").text("0")
                  $("#tobedeliveredScan_totalWeightAefullyhosted_collet").text("0")
                  
                }else if(type== 'AE自寄'){
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-SELFSEND')
                  $("#tobedelivered-aefullyhostedScanTbody-selfSend").html("")
                  $("#tobedelivered_orderNumAefullyhosted_selfSend").text("0")
                  $("#tobedeliveredScan_totalWeightAefullyhosted_selfSend").text("0")
                }
            },
            //扫描核单打印功能
            scanPrintHandle: function() {
                let _this = this;
                $('#tobedeliveredScan_printBtn').on('click', function() {
                    var scanBatchNo = JSON.parse(sessionStorage.getItem('SCANBATCHNO'));
                    if (!scanBatchNo) {
                        return layer.msg('请先交接订单!', { icon: 7 });
                    }
                    var orderNum = $('#tobedelivered_orderNum').val();
                    var totalWeight = $('#tobedeliveredScan_totalWeight').text();
                    window.open(ctx + '/static/html/handoverForm.html?batchNo=' + scanBatchNo + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                    // console.log('打印标签纸');
                    _this.tobedeliveredClearData()
                });
            },
            //扫描单查询
            scanSearchAjax: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/cache/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        sign: false
                    }
                })
            },
            scanSearchAjax1: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        sign: false
                    }
                })
            },
            //提交扫描交接单
            submitAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/scanhandover.html',
                    params: JSON.stringify(obj)
                })
            },
            //#endregion 扫描核单end


            //#region shopee交接单start
            shopeeHandoverSheetHandle: function() {
                var _this = this;
                $('#tobedelivered-shopeeHandoverSheet').on('click', function() {
                    layer.open({
                        type: 1,
                        title: 'shopee快递交接单',
                        area: ['100%', '80%'],
                        content: $('#tobedelivered-shopeeHandoverSheetLayer').html(),
                        id: 'tobedelivered-shopeeHandoverSheetId',
                        move: false,
                        success: function (layero, index) {
                            //初始化渲染
                            _this.shopeeScanTableInit(layero);
                            _this.shopeeReferKeycode(layero);
                            _this.shopeeOrderKeycode(layero);
                            _this.shopeeJoinCompleteHandle(layero);
                            _this.shopeeScanPrintHandle(); //打印交接单
                            _this.shopeeForecastNumber(layero)
                            form.render();
                            _this.initRenderForecastNumberList();
                        },
                        end: function() {
                            sessionStorage.removeItem('SHOPEESCANBATCHNO');
                        },
                        cancel: function() {
                            commonReturnPromise({
                                url: '/lms/unshippedorder/scanCheckTemp.html',
                                params: {
                                    platCode: 'shopee'
                                }
                            }).then(res => {
                                if (res && res.length > 0) {
                                    layer.confirm('您在Shopee交接中有未完成组包的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                        layer.closeAll();
                                        }, function() {
                                        });
                                    
                                } else {
                                    layer.closeAll();
                                }
                            })
                            return false
                        }
                    });
                });
            },
            //shopee快递交接单-扫描数据缓存
            shopeeScanTableInit: function (layero) {
                var $tbody = layero.find('#tobedelivered-shopeeScanTbody');
                var _this = this;
                commonReturnPromise({
                    url: '/lms/unshippedorder/scanCheckTemp.html',
                    params: {
                        platCode: 'shopee'
                    }
                }).then(res => {
                    if (res && res.length > 0) {
                        layero.find('input[name="order"]').focus()
                        let trStr = '';
                        let logisTypeNameArr = []
                        for (let i = 0; i < res.length; i++){
                            let data = res[i];
                            let trs = `
                                <tr>
                                    <td class="tableOrderId">${data.id || ''}</td>
                                    <td class="logisTypeName">${data.logisTypeName || ''}
                                        <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                        <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                        <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                    </td>
                                    <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                    <td>${data.storeAcct || ''}</td>
                                    <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                    <td class="more">
                                        ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                        <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                                    </td>
                                    <td class="status">未绑定</td>
                                    <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                    <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger shopeeHandoverSheetIdRemoveBtn">移除</span></td>
                                </tr>
                            `;
                            trStr += trs;
                            logisTypeNameArr.push(res[i].logisTypeId)
                        }
                        $tbody.html(trStr);
                        _this.computedTotalWeight($tbody,'tobedeliveredScan_totalWeightShopee');
                        _this.countOrderNum($tbody, 'tobedelivered_orderNumShopee');
                        _this.dataRender(res[0].logisCompanyId, logisTypeNameArr);
                    }
                    _this.shopeeDataRender();
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                })
            },
            shopeeDataRender: function(selectedCompany, selectedLogins) {
                let temCompany = selectedCompany ? selectedCompany : ''
                let temLogins = selectedLogins ? selectedLogins : []
                this.allCompanyAjax().then(function (result) {
                    commonRenderSelect('tobedelivered-companySelectShopee', result['companys'], { name: 'cnName', code: 'id' }).then(function() {
                        if (temCompany) {
                            $('#tobedelivered-companySelectShopee').val(temCompany).attr('disabled', true)
                        }
                        form.render()
                    });
                });
                this.allLogisTypeAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-waySelectShopee', result, { name: 'name', code: 'id' }).then(function() {
                        formSelects.render('tobedelivered-waySelectShopee');
                        if (temLogins.length && temLogins) {
                            formSelects.value('tobedelivered-waySelectShopee', temLogins);
                        }
                    });
                });
            },
            //shopee快递交接单-回车事件-参考单号或跟踪号
            shopeeReferKeycode: function(layero) {
                var _this = this;
                var $referInput = layero.find('input[name=referOrderShopee]');
                var $orderInput = layero.find('input[name=orderShopee]');
                $referInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        _this.shopeeScanSearchAjax1(val).then(function(result) {
                            $('#tobedelivered-companySelectShopee').removeAttr('disabled')
                            $('#tobedelivered-companySelectShopee').val(result.logisCompanyId);
                            form.render();
                            formSelects.value('tobedelivered-waySelectShopee', [result.logisTypeId]);
                            //订单编号获取焦点
                            $orderInput.focus();
                        }).catch(function (err) {
                            _this.errorVoiceWarning();
                            $referInput.select();
                            _this.packageEnterClose(err, function () {
                                $referInput.blur();
                            }, $referInput);
                            // _this.errHandle('扫描单号查询出错,请重试', err);
                        });
                        return false;
                    }
                });
            },
            //shopee快递交接单-回车事件-订单编号或跟踪号
            shopeeOrderKeycode: function(layero) {
                var _this = this;
                var $orderInput = layero.find('input[name=orderShopee]');
                var $company = layero.find('input[name=companyShopee]'); //订单快递公司
                var $logisWay = layero.find('input[name=logisWayShopee]'); //订单物流方式
                var $checkWay = layero.find('[name=checkWayShopee]');
                var $checkCompany = layero.find('[name=checkCompanyShopee]');
                var $tbody = layero.find('#tobedelivered-shopeeScanTbody');
                //回车增加tbody内容
                $orderInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        var isCheckWay = $checkWay.is(':checked');
                        var isCheckCompany = $checkCompany.is(':checked');
                        var checkesArr = formSelects.value('tobedelivered-waySelectShopee');
                        var names = checkesArr.map(function(item) {
                            return item.name;
                        });
                        var tobedeliveredForecastNumber = layero.find('[name=tobedelivered-forecast-number]').val();
                        //判断表格是否有该条数据
                        // if (_this.shopeeIsExistOrder($tbody, val)) {
                        //     $orderInput.focus().select();
                        //     var speechSynthesisUtterance = new SpeechSynthesisUtterance(`重复`);
                        //     speechSynthesisUtterance.rate = 3;
                        //     speechSynthesis.speak(speechSynthesisUtterance);
                        //     return layer.msg('该订单编号已存在', { icon: 7 });
                        // }
                        _this.shopeeScanSearchAjax(val,tobedeliveredForecastNumber).then(function(result) {
                            $company.val(result.logisCompanyName);
                            $logisWay.val(result.logisTypeName);
                            //添加到表格
                            _this.successVoiceWarning();
                            _this.shopeeScanTbodyHandle($tbody, result);
                            //计算合计重量
                            _this.shopeeComputedTotalWeight($tbody, 'tobedeliveredScan_totalWeightShopee');
                            //统计订单数量
                            _this.shopeeCountOrderNum($tbody, 'tobedelivered_orderNumShopee');
                            //订单编号或跟踪号相关选项,并且input输入框获取焦点
                            $company.val('');
                            $logisWay.val('');
                            $orderInput.val('').focus();
                            //对的执行这个逻辑
                            _this.commonPrintHandle(true).then(() => {
                                // console.log('打印正确逻辑,右走')
                            });
                        }).catch(function (err) {
                            //错的执行这个逻辑
                            _this.commonPrintHandle(false).then(() => {});
                            $orderInput.focus().select();
                            _this.errorVoiceWarning();
                            _this.packageEnterClose(err, function () {
                                $('#tobedelivered-shopeeHandoverSheetId input[name=orderShopee]').blur()
                            },$('#tobedelivered-shopeeHandoverSheetId input[name=orderShopee]'))
                            // _this.errHandle('扫描单号查询出错,请重试', err);
                        });
                        return false;
                    }
                });
                //监听tbody-移除按钮事件
                _this.shopeeWatchDelete($tbody, 'tobedeliveredScan_totalWeightShopee', 'tobedelivered_orderNumShopee');
            },
            //shopee快递交接单-判断表格是否有相同的订单号
            shopeeIsExistOrder: function ($tbody, val) {
                var $trs = $tbody.find('tr');
                var orderId = val.toString();
                var orderIdArr = [];
                for (var i = 0; i < $trs.length; i++) {
                    var tr = $trs[i];
                    var tableOrderId = $(tr).find('.tableOrderId').text();
                    orderIdArr.push(tableOrderId);
                }
                return orderIdArr.includes(orderId);
            },
            //shopee快递交接单-tbody追加元素
            shopeeScanTbodyHandle: function($tbody, data) {
                var trs = `
                    <tr>
                        <td class="tableOrderId">${data.orderId || ''}</td>
                        <td class="logisTypeName">${data.logisTypeName || ''}
                            <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                            <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                            <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                        </td>
                        <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                        <td>${data.storeAcct || ''}</td>
                        <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                        <td class="more">
                            ${data.shippingCost!==undefined ? data.shippingCost : "" }
                            <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                        </td>
                        <td class="status">未绑定</td>
                        <td class="time">${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                        <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger shopeeHandoverSheetIdRemoveBtn">移除</span></td>
                    </tr>
                `;
                $tbody.prepend(trs);
            },
            //shopee快递交接单-计算合计重量
            shopeeComputedTotalWeight: function($tbody, totalWeightId) {
                var $trs = $tbody.find('tr');
                var totalWeight = 0;
                for (var i = 0; i < $trs.length; i++) {
                    var tr = $trs[i];
                    var trWeight = Number($(tr).find('.realWeight').text());
                    totalWeight += trWeight;
                }
                // $(`#${id}`).text(`${totalWeight/1000}kg`);
                $(`#${totalWeightId}`).text(`${(totalWeight).toFixed(4)}kg`);
            },
            //shopee快递交接单-统计订单数量
            shopeeCountOrderNum: function($tbody, orderNumId) {
                var $trs = $tbody.find('tr');
                $(`#${orderNumId}`).val($trs.length);
            },
            //shopee快递交接单-监听tbody删除事件
            shopeeWatchDelete: function ($tbody, totalWeightId, orderNumId) {
                var _this = this;
                $tbody.on('click', '.shopeeHandoverSheetIdRemoveBtn', function () {
                    var orderId = $(this).parents('tr').find('td.tableOrderId').text();
                    $(this).parents('tr').remove();
                    _this.computedTotalWeight($tbody, totalWeightId);
                    _this.countOrderNum($tbody, orderNumId);
                    commonReturnPromise({
                        url: '/lms/unshippedorder/deleteById.html?orderId=' + orderId
                    }).then(res => {

                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                })
            },
            //shopee快递交接单-交接完成
            shopeeJoinCompleteHandle: function(layero) {
                var _this = this;
                $('#tobedelivered-joinBtnShopee').on('click', function() {
                    var $trs = layero.find('#tobedelivered-shopeeScanTbody').find('tr');
                    var totalWeight = ($('#tobedeliveredScan_totalWeightShopee').text().split('kg')[0]*1000).toFixed(2); //总重量
                    var orderNum = $('#tobedelivered_orderNumShopee').val(); //订单数量
                    var batchNo = $('#tobedelivered-forecast-number').val(); //预报号
                    if (!batchNo) {
                        return layer.msg('预报号不能为空!', { icon: 7 });
                    }
                    var dataArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var orderId = $(item).find('td:first-child').text();
                        var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                        var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                        var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                        var logisTypeName = $(item).find('.logisTypeName').text().trim();
                        var logisTrackingNo = $(item).find('.logisTrackingNo').text().trim();
                        var scanTime = new Date($(item).find('.time').text()).getTime();
                        var sellerId = $(item).find('.more [name=sellerId]').val();
                        var obj = {
                            orderId: orderId,
                            logisCompanyId: logisCompanyId,
                            logisCompanyName: logisCompanyName,
                            logisTypeId: logisTypeId,
                            logisTypeName: logisTypeName,
                            logisTrackingNo: logisTrackingNo,
                            sellerId: sellerId,
                            scanTime: scanTime,
                            totalWeight: totalWeight,
                            orderNum: orderNum,
                            batchNo: batchNo,
                            platCode: 'shopee'
                        };
                        dataArr.push(obj);
                    }
                    _this.submitShopeeAjax(dataArr).then(function (result) {
                        //这里的逻辑完全变更,表格就是表格,打印就是打印,互不干扰
                        //1. 先获取预报号,这个是要展示出来的
                        _this.commonCloseLayer(`批次号: ${batchNo}`);
                        sessionStorage.setItem('SHOPEESCANBATCHNO', JSON.stringify(batchNo));
                        //2. 更新表格对应内容[做表格匹配,修改状态]
                        _this.shopeeJoinCompleteUpdateTable(layero, result);
                    }).catch(function(err) {
                        _this.errHandle('提交交接单接口调用失败', err);
                    })
                });
            },
            //shopee快递交接单-交接完成更新表格
            shopeeJoinCompleteUpdateTable: function (layero, orderIdArr) {
                // console.log(orderIdArr);
                let $trs = layero.find('#tobedelivered-shopeeScanTbody').find('tr');
                for (let i = 0; i < $trs.length; i++){
                    let item = $trs[i];
                    let orderId = $(item).find('td:first-child').text();
                    // console.log('orderId', +orderId,orderIdArr.includes(orderId));
                    if (orderIdArr.includes(+orderId)) {
                        $(item).find('.status').text('已绑定');
                    }
                }
            },
            //虾皮交接完成接口
            submitShopeeAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/shopee/scanhandover.html',
                    params: JSON.stringify(obj)
                })
            },
            //shopee快递交接单-扫描核单打印功能
            shopeeScanPrintHandle: function() {
                let _this = this;
                $('#tobedeliveredScan_printBtnShopee').on('click', function() {
                    var scanBatchNo = JSON.parse(sessionStorage.getItem('SHOPEESCANBATCHNO'));
                    if (!scanBatchNo) {
                        return layer.msg('请先交接订单!', { icon: 7 });
                    }
                    var orderNum = $('#tobedelivered_orderNumShopee').val();
                    var totalWeight = $('#tobedeliveredScan_totalWeightShopee').text();
                    window.open(ctx + '/static/html/handoverForm.html?batchNo=' + scanBatchNo + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                    // console.log('打印标签纸');
                    _this.tobedeliveredClearData();
                });
            },
            // shopee快递交接单-预报号功能
            shopeeForecastNumber: function (layero) {
                let _this = this
              $('#tobedelivered_get_forecast_number').on('click', function () {
                  _this.shopeeGetForecastNumber().then(res => {
                    layer.msg('获取预报号成功', { icon: 1 });
                    commonRenderSelect('tobedelivered-forecast-number', res).then(function() {
                        form.render()
                    });
                  })
              })
            },
            //shopee快递交接单-扫描单查询
            shopeeScanSearchAjax: function(order,batchNo) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/cache/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'shopee',
                        sign: false,
                        batchNo: batchNo,
                    }
                })
            },
            //shopee快递交接单-扫描单查询无缓存
            shopeeScanSearchAjax1: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'shopee',
                        sign: false
                    }
                })
            },
            //shopee快递交接单-提交扫描交接单
            shopeeSubmitAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/shopee/scanhandover.html',
                    params: JSON.stringify(obj)
                })
            },
            //初始化渲染预报号列表
            initRenderForecastNumberList: function () {
                this.shopeeGetForecastNumberList().then(res => {
                    commonRenderSelect('tobedelivered-forecast-number', res).then(function () {
                        form.render()
                    });
                });
            },
            //shopee快递交接单-获取预报号列表
            shopeeGetForecastNumberList: function () {
                return commonReturnPromise({
                  contentType: 'application/x-www-form-urlencoded',
                  url: '/lms/unshippedorder/shopee/trackingNumberList.html',
                })
              },
            //shopee快递交接单-获取预报号
            shopeeGetForecastNumber: function () {
              return commonReturnPromise({
                contentType: 'application/x-www-form-urlencoded',
                url: '/lms/unshippedorder/shopee/trackingNumber.html',
              })
            },
            //#endregion shopee快递交接单end

            //#region 速卖通大包裹start
            bigPackageHandle: function() {
                var _this = this;
                $('#tobedelivered-smtBigPackageBtn').on('click', function() {
                    layer.open({
                        type: 1,
                        title: '速卖通大包裹',
                        area: ['90%', '80%'],
                        content: $('#tobedelivered-smtBigPackageLayer').html(),
                        id: 'tobedelivered-smtBigPackageLayerId',
                        move: false,
                        success: function(layero, index) {
                            _this.smtSheetTableInit(layero);
                            _this.dataBigRender();
                            _this.referKeycodeBig(layero);
                            _this.orderKeycodeBig(layero);
                            _this.joinCompleteHandleBig(layero);
                            _this.smtSheetSearchStatusHandle(layero);
                            _this.smtSheetCancelHandle(layero);
                            _this.smtBigPrintHandle();
                            _this.renderAddress();
                            _this.makeupOrderHandle();
                            form.render();
                        },
                        end: function() {
                            sessionStorage.removeItem('SMTBIGBATCHNO');
                        },
                        cancel: function() {
                            commonReturnPromise({
                                url: '/lms/unshippedorder/scanCheckTemp.html',
                                params: {
                                    platCode: 'aliexpress',
                                    sign: false
                                }
                            }).then(res => {
                                if (res && res.length > 0) {
                                    layer.confirm('您在速卖通交接中有未完成组包的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                        layer.closeAll();
                                        }, function() {
                                        });
                                    
                                } else {
                                    layer.closeAll();
                                }
                            })
                            return false
                        }
                    });
                });
            },
            //渲染揽收地址,退回地址
            lazadaSheetRenderAddress: function() {
                this.getAddressAjax().then(function(result) {
                    var collectArr = []; //揽收地址数组
                    var returnArr = []; //退回地址数组
                    var defaultId = '';
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        if (item.isDefault) {
                            defaultId = item.id;
                        }
                        var collectObj = {};
                        var returnObj = {};
                        collectObj.collect = item.collectCountry + item.collectProvince + item.collectCounty + item.collectStreet;
                        collectObj.id = item.id;
                        collectObj.isDefault = item.isDefault;
                        collectArr.push(collectObj);
                        returnObj.return = item.returnCountry + item.returnProvince + item.returnCounty + item.returnStreet;
                        returnObj.id = item.id;
                        returnObj.isDefault = item.isDefault;
                        returnArr.push(returnObj);
                    }
                    //渲染
                    commonRenderSelect('tobedelivered_lazadaSheet_collect', collectArr, { name: 'collect', code: 'id', selected: defaultId }).then(function() {
                        form.render('select');
                    });
                    commonRenderSelect('tobedelivered_lazadaSheet_return', returnArr, {
                        name: 'return',
                        code: 'id',
                        selected: defaultId
                    }).then(function() {
                        form.render('select');
                    });
                }).catch(function(err) {
                    layer.msg(err.message, { icon: 2 });
                })
            },
            // smt交接单:扫描数据缓存
            smtSheetTableInit:function(layero){
                var $tbody = layero.find('#tobedelivered-bigPackageTbody');
                var _this = this;
                commonReturnPromise({
                    url: '/lms/unshippedorder/scanCheckTemp.html',
                    params: {
                        platCode: 'aliexpress',
                        sign: false
                    }
                }).then(res => {
                    if (res && res.length > 0) {
                        let trStr = '';
                        for (let i = 0; i < res.length; i++){
                            let data = res[i];
                            let trs = `
                                <tr>
                                    <td class="tableOrderId">${data.id || ''}</td>
                                    <td class="logisTypeName">${data.logisTypeName || ''}
                                        <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                        <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                        <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                    </td>
                                    <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                    <td class="logisAgentTrackingNo">${data.logisAgentTrackingNo || ''}</td>
                                    <td class="storeAcct">${data.storeAcct || ''}</td>
                                    <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                    <td class="more">
                                        ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                        <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                    </td>
                                    <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                    <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                                </tr>
                            `;
                            trStr += trs;
                        }
                        $tbody.html(trStr);
                        _this.computedTotalWeight($tbody,'tobedeliveredSmtBig_totalWeight');
                        _this.countOrderNum($tbody, 'tobedeliveredSmt_orderNum');
                    }
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                })
            },
            //smt大包裹:渲染揽收地址,退回地址
            renderAddress: function() {
                this.getAddressAjax().then(function(result) {
                    var collectArr = []; //揽收地址数组
                    var returnArr = []; //退回地址数组
                    var defaultId = '';
                    for (var i = 0; i < result.length; i++) {
                        var item = result[i];
                        if (item.isDefault) {
                            defaultId = item.id;
                        }
                        var collectObj = {};
                        var returnObj = {};
                        collectObj.collect = item.collectCountry + item.collectProvince + item.collectCounty + item.collectStreet;
                        collectObj.id = item.id;
                        collectObj.isDefault = item.isDefault;
                        collectArr.push(collectObj);
                        returnObj.return = item.returnCountry + item.returnProvince + item.returnCounty + item.returnStreet;
                        returnObj.id = item.id;
                        returnObj.isDefault = item.isDefault;
                        returnArr.push(returnObj);
                    }
                    //渲染
                    commonRenderSelect('tobedelivered_smtBig_collect', collectArr, { name: 'collect', code: 'id', selected: defaultId }).then(function() {
                        form.render('select');
                    });
                    commonRenderSelect('tobedelivered_smtBig_return', returnArr, {
                        name: 'return',
                        code: 'id',
                        selected: defaultId
                    }).then(function() {
                        form.render('select');
                    });
                }).catch(function(err) {
                    layer.msg(err.message, { icon: 2 });
                })
            },
            //回车事件-参考单号或跟踪号
            referKeycodeBig: function(layero) {
                var _this = this;
                var $referInput = layero.find('input[name=referOrder]');
                var $orderInput = layero.find('input[name=order]');
                $referInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        _this.scanSearchBigAjax(val).then(function(result) {
                            $('#tobedelivered-companySelectBig').val(result.logisCompanyId);
                            form.render();
                            formSelects.value('tobedelivered-waySelectBig', [result.logisTypeId]);
                            //订单编号获取焦点
                            $orderInput.focus();
                        }).catch(function (err) {
                            _this.errorVoiceWarning();
                            $referInput.select();
                            _this.packageEnterClose(err, function () {
                                $referInput.blur();
                            }, $referInput);
                        });
                    }
                });
            },
            //回车事件-订单编号或跟踪号
            orderKeycodeBig: function(layero) {
                var _this = this;
                var $orderInput = layero.find('input[name=order]');
                var $company = layero.find('input[name=company]'); //订单快递公司
                var $logisWay = layero.find('input[name=logisWay]'); //订单物流方式
                var $tbody = layero.find('#tobedelivered-bigPackageTbody');
                $orderInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        _this.scanSearchCacheBigAjax(val).then(function(result) {
                            $company.val(result.logisCompanyName);
                            $logisWay.val(result.logisTypeName);
                            _this.scanTbodyHandleBig($tbody, result);
                            //计算合计重量
                            _this.computedTotalWeight($tbody, 'tobedeliveredSmtBig_totalWeight');
                            //统计订单数量
                            _this.countOrderNum($tbody, 'tobedeliveredSmt_orderNum')
                            //订单编号或跟踪号相关选项,并且input输入框获取焦点
                            $company.val('');
                            $logisWay.val('');
                            $orderInput.val('').focus();
                            _this.successVoiceWarning();
                            //对的执行这个逻辑
                            _this.commonPrintHandle(true).then(() => {
                                // console.log('打印正确逻辑,右走')
                            });
                        }).catch(function (err) {
                            //错的执行这个逻辑
                            _this.commonPrintHandle(false).then(() => {});
                            _this.errorVoiceWarning();
                            _this.packageEnterClose(err, function () {
                                $orderInput.blur()
                            },$orderInput)
                        });
                    }
                });

                //监听tbody-移除按钮事件
                _this.watchDelete($tbody, 'tobedeliveredSmtBig_totalWeight', 'tobedeliveredSmt_orderNum');
            },
            scanTbodyHandleBig: function($tbody, data) {
                const trs = `
                    <tr>
                        <td class="tableOrderId">${data.orderId}</td>
                        <td class="logisTypeName">${data.logisTypeName}
                            <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                            <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                            <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                        </td>
                        <td class="logisTrackingNo">${data.logisTrackingNo}</td>
                        <td class="logisAgentTrackingNo">${data.logisAgentTrackingNo}</td>
                        <td class="storeAcct">${data.storeAcct}</td>
                        <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                        <td class="more">
                            ${data.shippingCost!==undefined ? data.shippingCost : "" }
                            <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                        </td>
                        <td class="time">${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss')}</td>
                        <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                    </tr>
                `;
                $tbody.prepend(trs);
            },
            joinCompleteHandleBig: function(layero) {
                var _this = this;
                $('#tobedelivered-joinBigBtn').on('click', function() {
                    var $trs = layero.find('#tobedelivered-bigPackageTbody').find('tr');
                    var collectId = $('#tobedelivered_smtBig_collect').val(); //揽收地址
                    var returnId = $('#tobedelivered_smtBig_return').val(); //退回地址
                    var totalWeight = ($('#tobedeliveredSmtBig_totalWeight').text().split('kg')[0]*1000).toFixed(0); //总重量
                    var orderNum = $('#tobedeliveredSmt_orderNum').val(); //订单数量
                    var dataArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var orderId = $(item).find('td:first-child').text();
                        var logisTypeName = $(item).find('.logisTypeName').text();
                        var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                        var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                        var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                        var scanTime = new Date($(item).find('td.time').text()).getTime();
                        var storeAcct = $(item).find('.storeAcct').text();
                        var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                        var logisAgentTrackingNo = $(item).find('.logisAgentTrackingNo').text();
                        var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                        var obj = {
                            orderId: orderId,
                            logisCompanyId: logisCompanyId,
                            logisTypeName: logisTypeName,
                            logisCompanyName: logisCompanyName,
                            logisTypeId: logisTypeId,
                            logisTrackingNo:logisTrackingNo,
                            logisAgentTrackingNo:logisAgentTrackingNo,
                            scanTime: scanTime,
                            collectId: collectId,
                            returnId: returnId,
                            totalWeight: totalWeight,
                            storeAcct: storeAcct,
                            storeAcctId: storeAcctId,
                            orderNum: orderNum,
                            platCode: 'aliexpress'
                        };
                        dataArr.push(obj);
                    }
                    _this.submitBigAjax(dataArr).then(function(result) {
                        // layer.msg(result || '提交交接单成功',{icon:1});
                        _this.commonCloseLayer(`批次号: ${result}`);
                        sessionStorage.setItem('SMTBIGBATCHNO', JSON.stringify(result));
                    }).catch(function(err) {
                        // _this.errHandle('提交交接单接口调用失败', err);
                        _this.packageEnterClose(err, function () {
                            layero.find('input[name=order]').blur()
                        },layero.find('input[name=order]'))
                    })
                });
            },
            //smt交接单:查询状态操作
            smtSheetSearchStatusHandle: function (layero) {
                var _this = this;
                $('#tobedeliveredSmt-searchStatusBtn').on('click', function () {
                    var val = layero.find('[name=smtSheetSearchStatusAndCancelVal]').val().trim();
                    if (val == '') {
                        return layer.msg('请输入内容', { icon: 7 });
                    };
                    _this.smtSheetSearchStatusAjax(val).then(res => {
                        layer.msg(res, { icon: 1 });
                    })
                });
            },
            //smt交接单:取消提交操作
            smtSheetCancelHandle: function (layero) {
                var _this = this;
                $('#tobedeliveredSmt-cancelSubmitBtn').on('click', function () {
                    var val = layero.find('[name=smtSheetSearchStatusAndCancelVal]').val().trim();
                    if (val == '') {
                        return layer.msg('请输入内容', { icon: 7 });
                    };
                    _this.smtSheetCancelAjax(val).then(res => {
                        layer.msg(res, { icon: 1 });
                    })
                });
            },
            //smt大包裹核单打印功能
            smtBigPrintHandle: function() {
                let _this = this;
                $('#tobedeliveredSmtBig_printBtn').on('click', function() {
                    var smtbigBatchNo = JSON.parse(sessionStorage.getItem('SMTBIGBATCHNO'));
                    if (!smtbigBatchNo) {
                        return layer.msg('请先交接订单!', { icon: 7 });
                    }
                    var orderNum = $('#tobedeliveredSmt_orderNum').val();
                    var totalWeight = $('#tobedeliveredSmtBig_totalWeight').text();
                    window.open(ctx + '/static/html/handoverForm.html?batchNo=' + smtbigBatchNo  + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                    // console.log('打印标签纸');
                    _this.tobedeliveredClearData()
                });
            },
            dataBigRender: function() {
                this.allCompanyAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-companySelectBig', result['companys'], { name: 'cnName', code: 'id' }).then(function() {
                        form.render('select');
                    });
                });
                this.allLogisTypeAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-waySelectBig', result, { name: 'name', code: 'id' }).then(function() {
                        formSelects.render('tobedelivered-waySelect');
                    });
                });
            },
            //回车关闭弹框[通用]
            commonCloseLayer: function(str, oldIndex) {
                layer.open({
                    title: '提示',
                    content: str,
                    btn: ['确认'],
                    success: function(layero, index) {
                        this.enterEsc = function(event) {
                            if (event.keyCode === 13) {
                                layer.close(index);
                                if(oldIndex && oldIndex >=0){
                                  layer.close(oldIndex);
                                }
                                return false; //阻止系统默认回车事件
                            }
                        };
                        $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                    },
                    end: function() {
                        if(oldIndex && oldIndex >=0){
                          layer.close(oldIndex);
                        }
                        $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                    }
                });
            },
            scanSearchBigAjax: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'aliexpress',
                        sign: false
                    }
                })
            },
            //扫描单查询
            scanSearchCacheBigAjax: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/cache/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'aliexpress',
                        sign: false
                    }
                })
            },
            //提交扫描交接单
            submitBigAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/smt/scanhandover.html',
                    params: JSON.stringify(obj)
                })
            },
            //获取揽收地址,退回地址
            getAddressAjax: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/address/queryByAddressName.html',
                    params: {
                        page: 1,
                        limit: 1000,
                        addressName: '',
                        addressType: ''
                    }
                });
            },
            //smt交接单: 查询状态接口
            smtSheetSearchStatusAjax: function (handoverContentCode) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/smt/smtBigBagStatusQuery.html',
                    params: {
                        handoverContentCode: handoverContentCode
                    }
                })
            },
            //lazada交接单: 取消提交接口
            smtSheetCancelAjax: function (handoverContentCode) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/lazada/lazadaBigBagCancel.html',
                    params: {
                        handoverContentCode: handoverContentCode
                    }
                })
            },
            //#endregion 速卖通大包裹end


            //#region lazada交接单start
            lazadaHandoverSheetHandle: function () {
                var _this = this;
                $('#tobedelivered-lazadaHandoverSheet').on('click', function() {
                    layer.open({
                        type: 1,
                        title: 'lazada快递交接单',
                        area: ['90%', '80%'],
                        content: $('#tobedelivered-lazadaHandoverSheetLayer').html(),
                        id: 'tobedelivered-lazadaHandoverSheetId',
                        move: false,
                        success: function (layero, index) {
                            _this.lazadaSheetTableInit(layero);
                            _this.lazadaSheetRender();
                            _this.lazadaSheetRenderAddress();
                            _this.lazadaSheetPrintHandle();
                            _this.lazadaSheetReferKeycode(layero);
                            _this.lazadaSheetOrderKeycode(layero);
                            _this.lazadaSheetJoinCompleteHandle(layero);
                            _this.lazadaSheetSearchStatusHandle(layero);
                            _this.lazadaSheetCancelHandle(layero);
                            _this.makeupOrderHandle();
                            form.render();
                        },
                        end: function() {
                            sessionStorage.removeItem('LAZADASHEETBATCHNO');
                        },
                        cancel: function() {
                            commonReturnPromise({
                                url: '/lms/unshippedorder/scanCheckTemp.html',
                                params: {
                                    platCode: 'lazada'
                                }
                            }).then(res => {
                                if (res && res.length > 0) {
                                    layer.confirm('您在lazada快递交接单中有未完成组包的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                        layer.closeAll();
                                        }, function() {
                                        });
                                } else {
                                    layer.closeAll();
                                }
                            })
                            return false
                        }
                    });
                });
            },
            //lazada交接单:扫描数据缓存
            lazadaSheetTableInit: function (layero) {
                var $tbody = layero.find('#tobedelivered-lazadaSheetTbody');
                var _this = this;
                commonReturnPromise({
                    url: '/lms/unshippedorder/scanCheckTemp.html',
                    params: {
                        platCode: 'lazada'
                    }
                }).then(res => {
                    if (res && res.length > 0) {
                        let trStr = '';
                        for (let i = 0; i < res.length; i++){
                            let data = res[i];
                            let trs = `
                                <tr>
                                    <td class="tableOrderId">${data.id || ''}</td>
                                    <td class="logisTypeName">${data.logisTypeName || ''}
                                        <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                        <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                        <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                    </td>
                                    <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                    <td class="storeAcct">${data.storeAcct || ''}</td>
                                    <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                    <td class="more">
                                        ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                        <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                                        <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                                        <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                                        <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                        <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                                    </td>
                                    <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                    <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                                </tr>
                            `;
                            trStr += trs;
                        }
                        $tbody.html(trStr);
                        _this.computedTotalWeight($tbody,'tobedeliveredLazadaSheet_totalWeight');
                        _this.countOrderNum($tbody, 'tobedeliveredLazada_orderNum');
                    }
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                })
            },
            //lazada交接单回车事件-订单编号或跟踪号
            lazadaSheetOrderKeycode: function(layero) {
                var _this = this;
                var $orderInput = layero.find('input[name=orderLazadaSheet]');
                var $company = layero.find('input[name=companyLazadaSheet]'); //订单快递公司
                var $logisWay = layero.find('input[name=logisWayLazadaSheet]'); //订单物流方式
                var $tbody = layero.find('#tobedelivered-lazadaSheetTbody');
                $orderInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        if ($tbody.find('tr').length >= 1000) {
                            _this.errorVoiceWarning();
                            _this.packageEnterClose('Lazada 组包订单数量不能超过1000单', function () {
                                $orderInput.blur()
                            },$orderInput)
                            return;
                        }
                        _this.lazadaSheetScanSearchAjax1(val).then(function(result) {
                            $company.val(result.logisCompanyName);
                            $logisWay.val(result.logisTypeName);
                            _this.lazadaSheetScanTbodyHandle($tbody, result);
                            //计算合计重量
                            _this.computedTotalWeight($tbody, 'tobedeliveredLazadaSheet_totalWeight');
                            //统计订单数量
                            _this.countOrderNum($tbody, 'tobedeliveredLazada_orderNum');
                            //订单编号或跟踪号相关选项,并且input输入框获取焦点
                            $company.val('');
                            $logisWay.val('');
                            $orderInput.val('').focus();
                            _this.successVoiceWarning();
                            //对的执行这个逻辑
                            _this.commonPrintHandle(true).then(() => {
                                // console.log('打印正确逻辑,右走')
                            });
                        }).catch(function (err) {
                            //错的执行这个逻辑
                            _this.commonPrintHandle(false).then(() => {});
                            _this.errorVoiceWarning();
                            // _this.errHandle('扫描单号查询出错,请重试', err);
                            _this.packageEnterClose(err, function () {
                                $orderInput.blur()
                            },$orderInput)
                        });
                    }
                });
                //监听tbody-移除按钮事件
                _this.watchDelete($tbody, 'tobedeliveredLazadaSheet_totalWeight', 'tobedeliveredLazada_orderNum');
            },
            //lazada交接单-渲染表格
            lazadaSheetScanTbodyHandle: function($tbody, data) {
                var trs = `
                    <tr>
                        <td class="tableOrderId">${data.orderId}</td>
                        <td class="logisTypeName">${data.logisTypeName}
                            <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                            <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                            <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                        </td>
                        <td class="logisTrackingNo">${data.logisTrackingNo}</td>
                        <td class="storeAcct">${data.storeAcct}</td>
                        <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                        <td class="more">
                            ${data.shippingCost!==undefined ? data.shippingCost : "" }
                            <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                            <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                            <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                            <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                            <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                        </td>
                        <td class="time">${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss')}</td>
                        <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                    </tr>
                `;
                $tbody.prepend(trs);
            },
            //lazada交接单回车事件-参考单号或跟踪号
            lazadaSheetReferKeycode: function(layero) {
                var _this = this;
                var $referInput = layero.find('input[name=referOrderLazadaSheet]');
                var $orderInput = layero.find('input[name=orderLazadaSheet]');
                $referInput.on('keyup', function(e) {
                    var val = e.target.value;
                    if (e.keyCode == 13) { //回车事件
                        _this.lazadaSheetScanSearchAjax(val).then(function(result) {
                            $('#tobedelivered-companySelectLazada').val(result.logisCompanyId);
                            form.render();
                            formSelects.value('tobedelivered-waySelectLazada', [result.logisTypeId]);
                            //订单编号获取焦点
                            $orderInput.focus();
                        }).catch(function (err) {
                            _this.errorVoiceWarning();
                            $referInput.select();
                            _this.packageEnterClose(err, function () {
                                $referInput.blur()
                            }, $referInput);
                        });
                    }
                });
            },
            //lazada交接单扫描单查询
            lazadaSheetScanSearchAjax: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'lazada',
                        sign: false
                    }
                })
            },
            //lazada交接单扫描单查询
            lazadaSheetScanSearchAjax1: function(order) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/cache/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: 'lazada',
                        sign: false
                    }
                })
            },
            //lazada交接单渲染数据
            lazadaSheetRender: function() {
                this.allCompanyAjax().then(function (result) {
                    commonRenderSelect('tobedelivered-companySelectLazada', result['companys'], { name: 'cnName', code: 'id' }).then(function() {
                        form.render('select');
                    });
                });
                this.allLogisTypeAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-waySelectLazada', result, { name: 'name', code: 'id' }).then(function() {
                        formSelects.render('tobedelivered-waySelectLazada');
                    });
                });
                //渲染寄送方式
                this.lazadaDeliveredWayAjax().then(function (result) {
                    var arr = [];
                    for (item in result) {
                        var obj = {};
                        obj.name = result[item];
                        obj.id = item;
                        arr.push(obj);
                    }
                    commonRenderSelect('tobedelivered_deliveredWay', arr, { name: 'name', code: 'id',selected: 'cainiao_pickup' }).then(function() {
                        form.render('select');
                    });
                });
            },
            //lazada交接单打印功能
            lazadaSheetPrintHandle: function() {
                let _this = this;
                $('#tobedeliveredLazadaSheet_printBtn').on('click', function() {
                    var scanBatchNo = JSON.parse(sessionStorage.getItem('LAZADASHEETBATCHNO'));
                    if (!scanBatchNo) {
                        return layer.msg('请先交接订单!', { icon: 7 });
                    }
                    var orderNum = $('#tobedeliveredLazada_orderNum').val();
                    var totalWeight = $('#tobedeliveredLazadaSheet_totalWeight').text();
                    window.open(ctx + '/static/html/handoverForm.html?batchNo=' + scanBatchNo + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                    // console.log('打印标签纸');
                    _this.tobedeliveredClearData()
                });
            },
            lazadaSheetJoinCompleteHandle: function(layero) {
                var _this = this;
                $('#tobedelivered-submitOrder').on('click', function() {
                    var $trs = layero.find('#tobedelivered-lazadaSheetTbody').find('tr');
                    var collectId = $('#tobedelivered_lazadaSheet_collect').val(); //揽收地址
                    var returnId = $('#tobedelivered_lazadaSheet_return').val(); //退回地址
                    var totalWeight = ($('#tobedeliveredLazadaSheet_totalWeight').text().split('kg')[0]*1000).toFixed(0); //总重量
                    var orderNum = $('#tobedeliveredLazada_orderNum').val(); //订单数量
                    var type = $('#tobedelivered_deliveredWay').val(); //寄送方式
                    var dataArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var orderId = $(item).find('td:first-child').text();
                        var logisTypeName = $(item).find('.logisTypeName').text();
                        var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                        var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                        var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                        var scanTime = new Date($(item).find('td.time').text()).getTime();
                        var storeAcct = $(item).find('.storeAcct').text();
                        var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                        var salesSite = $(item).find('.more [name=salesSite]').val();
                        var accessToken = $(item).find('.more [name=accessToken]').val();
                        var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                        var shortCode = $(item).find('.more [name=shortCode]').val();
                        var sellerId = $(item).find('.more [name=sellerId]').val();
                        var obj = {
                            orderId: orderId,
                            logisCompanyId: logisCompanyId,
                            logisTypeName: logisTypeName,
                            logisCompanyName: logisCompanyName,
                            logisTypeId: logisTypeId,
                            scanTime: scanTime,
                            collectId: collectId,
                            returnId: returnId,
                            totalWeight: totalWeight,
                            type: type,
                            storeAcct: storeAcct,
                            logisTrackingNo: logisTrackingNo,
                            salesSite: salesSite,
                            shortCode: shortCode,
                            accessToken: accessToken,
                            storeAcctId: storeAcctId,
                            sellerId: sellerId,
                            orderNum: orderNum,
                            platCode: 'lazada'
                        };
                        dataArr.push(obj);
                    }
                    _this.lazadaSheetSubmitAjax(dataArr).then(function(result) {
                        _this.commonCloseLayer(`批次号: ${result}`);
                        sessionStorage.setItem('LAZADASHEETBATCHNO', JSON.stringify(result));
                    }).catch(function(err) {
                        _this.errHandle('提交交接单接口调用失败', err);
                    })
                });
            },
            //lazada交接单:提交发布交接单
            lazadaSheetSubmitAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/lazada/scanhandover.html',
                    params: JSON.stringify(obj)
                })
            },
            //lazada交接单:寄送方式
            lazadaDeliveredWayAjax: function() {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/lazada/getLazadaSendType.html',
                });
            },
            //lazada交接单: 查询状态接口
            lazadaSheetSearchStatusAjax: function (handoverContentCode) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/lazada/lazadaBigBagStatusQuery.html',
                    params: {
                        handoverContentCode: handoverContentCode
                    }
                })
            },
            //lazada交接单: 取消提交接口
            lazadaSheetCancelAjax: function (handoverContentCode) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/lazada/lazadaBigBagCancel.html',
                    params: {
                        handoverContentCode: handoverContentCode
                    }
                })
            },
            //lazada交接单:查询状态操作
            lazadaSheetSearchStatusHandle: function (layero) {
                var _this = this;
                $('#tobedelivered-searchStatusBtn').on('click', function () {
                    var val = layero.find('[name=lazadaSheetSearchStatusAndCancelVal]').val().trim();
                    if (val == '') {
                        return layer.msg('请输入内容', { icon: 7 });
                    };
                    _this.lazadaSheetSearchStatusAjax(val).then(res => {
                        layer.msg(res, { icon: 1 });
                    })
                });
            },
            //lazada交接单:取消提交操作
            lazadaSheetCancelHandle: function (layero) {
                var _this = this;
                $('#tobedelivered-cancelSubmitBtn').on('click', function () {
                    var val = layero.find('[name=lazadaSheetSearchStatusAndCancelVal]').val().trim();
                    if (val == '') {
                        return layer.msg('请输入内容', { icon: 7 });
                    };
                    _this.lazadaSheetCancelAjax(val).then(res => {
                        layer.msg(res, { icon: 1 });
                    })
                });
            },
            //#endregion lazada交接单end

            //#region 优选仓组包start---ztt20220711
            optimizationSheetHandle: function () {
                let _this = this;
                $('#tobedelivered-optimizationSheet').on('click', function() {
                    layer.open({
                        type: 1,
                        title: '优选仓组包',
                        area: ['90%', '80%'],
                        content: $('#tobedelivered-optimizationSheetLayer').html(),
                        id: 'tobedelivered-optimizationSheetId',
                        move: false,
                        success: function (layero, index) {
                            _this.optimizationSheetTableInit(layero); //缓存数据
                            _this.optimizationSheetRender(); //渲染物流公司相关
                            _this.optimizationSheetReferKeycode(layero);
                            _this.optimizationOrderKeycode(layero);
                            _this.optimizationSheetJoinCompleteHandle(layero);
                            _this.optimizationScanPrintHandle();
                            _this.makeupOrderHandle();
                            form.render();
                        },
                        end: function() {
                            sessionStorage.removeItem('OPTIMIZATIONSHEETBATCHNO');
                        },
                        cancel: function() {
                            commonReturnPromise({
                                url: '/lms/unshippedorder/scanCheckTemp.html',
                                params: {
                                    platCode: 'aliexpress',
                                    sign: true
                                }
                            }).then(res => {
                                if (res && res.length > 0) {
                                    layer.confirm('您在优选仓组包中有未完成组包的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                        layer.closeAll();
                                        }, function() {
                                        });                                   
                                } else {
                                    layer.closeAll();
                                }
                            })
                            return false
                        }
                    });
                });
            },
            //优选仓组包缓存数据
            optimizationSheetTableInit (layero) {
                var $tbody = layero.find('#tobedelivered-optimizationScanTbody');
                var _this = this;
                commonReturnPromise({
                    url: '/lms/unshippedorder/scanCheckTemp.html',
                    params: {
                        platCode: 'aliexpress',
                        sign: true
                    }
                }).then(res => {
                    if (res && res.length > 0) {
                        let trStr = '';
                        for (let i = 0; i < res.length; i++){
                            let data = res[i];
                            let trs = `
                                <tr>
                                    <td class="tableOrderId">${data.id || ''}</td>
                                    <td class="logisTypeName">${data.logisTypeName || ''}
                                        <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                        <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                        <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                    </td>
                                    <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                    <td class="logisAgentTrackingNo">${data.logisAgentTrackingNo || ''}</td>
                                    <td class="storeAcct">${data.storeAcct || ''}</td>
                                    <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                    <td class="more">
                                        ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                        <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                                        <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                                        <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                                        <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                        <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                                    </td>
                                    <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                    <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                                </tr>
                            `;
                            trStr += trs;
                        }
                        $tbody.html(trStr);
                        _this.computedTotalWeight($tbody,'tobedeliveredScan_totalWeightOptimization');
                        _this.countOrderNum($tbody, 'tobedelivered_orderNumOptimization');
                    }
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                })
            },
            //渲染初始化数据
            optimizationSheetRender() {
                this.allCompanyAjax().then(function (result) {
                    commonRenderSelect('tobedelivered-companySelectOptimization', result['companys'], { name: 'cnName', code: 'id' }).then(function() {
                        form.render('select');
                    });
                });
                this.allLogisTypeAjax().then(function(result) {
                    commonRenderSelect('tobedelivered-waySelectOptimization', result, { name: 'name', code: 'id' }).then(function() {
                        formSelects.render('tobedelivered-waySelectOptimization');
                    });
                });
            },
            //优选仓组包-渲染表格
            optimizationSheetTbodyHandle: function($tbody, data, type='') {
                var trs;
                if(type == 'AE'){
                  trs = `
                    <tr>
                    <td class="tableOrderId">${data.orderId || ''}</td>
                    <td class="logisTypeName disN">${data.logisTypeName || ''}
                        <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                        <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                        <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                    </td>
                    <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                    <td class="logisAgentTrackingNo disN">${data.logisAgentTrackingNo || ''}</td>
                    <td class="storeAcct">${data.storeAcct || ''}</td>
                    <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                    <td class="more disN">
                        ${data.shippingCost!==undefined ? data.shippingCost : "" }
                        <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                        <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                        <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                        <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                        <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                    </td>
                    <td class="time">${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                    <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                </tr>
                `;
                }else{
                  trs =`
                      <tr>
                      <td class="tableOrderId">${data.orderId || ''}</td>
                      <td class="logisTypeName">${data.logisTypeName || ''}
                          <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                          <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                          <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                      </td>
                      <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                      <td class="logisAgentTrackingNo">${data.logisAgentTrackingNo || ''}</td>
                      <td class="storeAcct">${data.storeAcct || ''}</td>
                      <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                      <td class="more">
                          ${data.shippingCost!==undefined ? data.shippingCost : "" }
                          <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                          <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                          <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                          <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                          <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                      </td>
                      <td class="time">${Format(Date.now(), 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                      <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                  </tr>
                  `;
                }
                $tbody.prepend(trs);
            },
            //优选仓回车事件-订单编号或跟踪号
            optimizationOrderKeycode(layero) {
                var _this = this;
                var $orderInput = layero.find('input[name=orderOptimization]');
                var $company = layero.find('input[name=companyOptimization]'); //订单快递公司
                var $logisWay = layero.find('input[name=logisWayOptimization]'); //订单物流方式
                var $tbody = layero.find('#tobedelivered-optimizationScanTbody');
                $orderInput.on('keyup', function(e) {
                    if (e.keyCode == 13) { //回车事件
                        _this.referKeyBlur(layero, 'orderOptimization', e).then(() => {
                            let val = e.target.value;
                            //判断表格是否有该条数据
                            if (_this.shopeeIsExistOrder($tbody, val)) {
                                $orderInput.focus().select();
                                var speechSynthesisUtterance = new SpeechSynthesisUtterance(`重复`);
                                speechSynthesisUtterance.rate = 3;
                                speechSynthesis.speak(speechSynthesisUtterance);
                                return layer.msg('该订单编号已存在', { icon: 7 });
                            }
                            _this.optimizationSheetScanSearchAjax1(val).then(function(result) {
                                $company.val(result.logisCompanyName);
                                $logisWay.val(result.logisTypeName);
                                _this.optimizationSheetTbodyHandle($tbody, result);
                                //计算合计重量
                                _this.computedTotalWeight($tbody, 'tobedeliveredScan_totalWeightOptimization');
                                //统计订单数量
                                _this.countOrderNum($tbody, 'tobedelivered_orderNumOptimization');
                                //订单编号或跟踪号相关选项,并且input输入框获取焦点
                                $company.val('');
                                $logisWay.val('');
                                $orderInput.val('').focus();
                                _this.successVoiceWarning();
                                //对的执行这个逻辑
                                _this.commonPrintHandle(true).then(() => {
                                    // console.log('打印正确逻辑,右走')
                                });
                            }).catch(function (err) {
                                //错的执行这个逻辑
                                _this.commonPrintHandle(false).then(() => {});
                                _this.errorVoiceWarning();
                                _this.packageEnterClose(err, function () {
                                    $orderInput.blur()
                                }, $orderInput);
                            });
                        }).catch(err => {
                            layer.msg(err, { icon: 2 });
                        });
                    }
                });
                //监听tbody-移除按钮事件
                _this.watchDelete($tbody, 'tobedeliveredScan_totalWeightOptimization', 'tobedelivered_orderNumOptimization');
            },
            //优选仓回车事件-参考单号或跟踪号
            optimizationSheetReferKeycode(layero) {
                let _this = this;
                let $referInput = layero.find('input[name=referOrderOptimization]');
                let $orderInput = layero.find('input[name=orderOptimization]');
                $referInput.on('keyup', function(e) {
                    if (e.keyCode == 13) { //回车事件
                        _this.referKeyBlur(layero, 'referOrderOptimization', e).then(() => {
                            let val = e.target.value;
                            _this.optimizationSheetScanSearchAjax(val).then(function(result) {
                                $('#tobedelivered-companySelectOptimization').val(result.logisCompanyId);
                                form.render();
                                formSelects.value('tobedelivered-waySelectOptimization', [result.logisTypeId]);
                                //订单编号获取焦点
                                $orderInput.focus();
                            }).catch(function (err) {
                                _this.errorVoiceWarning();
                                $referInput.select();
                                _this.packageEnterClose(err, function () {
                                    $referInput.blur()
                                }, $referInput);
                            });
                        }).catch(err => {
                            layer.msg(err, { icon: 2 });
                        })
                    }
                });
            },
            //优选仓组包---提交发布交接单
            optimizationSheetJoinCompleteHandle(layero) {
                var _this = this;
                $('#tobedelivered-joinBtnOptimization').on('click', function() {
                    var $trs = layero.find('#tobedelivered-optimizationScanTbody').find('tr');
                    var totalWeight = ($('#tobedeliveredScan_totalWeightOptimization').text().split('kg')[0]*1000).toFixed(2); //总重量
                    var orderNum = $('#tobedelivered_orderNumOptimization').val(); //订单数量
                    var dataArr = [];
                    for (var i = 0; i < $trs.length; i++) {
                        var item = $trs[i];
                        var orderId = $(item).find('td:first-child').text();
                        var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                        var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                        var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                        var logisTypeName = $(item).find('.logisTypeName').text().trim();
                        var logisTrackingNo = $(item).find('.logisTrackingNo').text().trim();
                        var logisAgentTrackingNo = $(item).find('.logisAgentTrackingNo').text().trim();
                        var scanTime = new Date($(item).find('td:nth-last-child(2)').text()).getTime();
                        var sellerId = $(item).find('.more [name=sellerId]').val();
                        var obj = {
                            orderId: orderId,
                            logisCompanyId: logisCompanyId,
                            logisCompanyName: logisCompanyName,
                            logisTypeId: logisTypeId,
                            logisTypeName: logisTypeName,
                            logisTrackingNo: logisTrackingNo,
                            logisAgentTrackingNo:logisAgentTrackingNo,
                            sellerId: sellerId,
                            scanTime: scanTime,
                            totalWeight: totalWeight,
                            orderNum: orderNum,
                            platCode: 'aliexpress'
                        };
                        dataArr.push(obj);
                    }
                    _this.optimizationSheetSubmitAjax(dataArr).then(function(result) {
                        sessionStorage.setItem('OPTIMIZATIONSHEETBATCHNO', JSON.stringify(result));
                        _this.commonCloseLayer(`批次号: ${result}`);
                    }).catch(function(err) {
                        _this.errHandle('提交交接单接口调用失败', err);
                    })
                });
            },
            //优选仓组包---打印交接单
            optimizationScanPrintHandle() {
                let _this = this;
                $('#tobedeliveredScan_printBtnOptimization').on('click', function() {
                    var scanBatchNo = JSON.parse(sessionStorage.getItem('OPTIMIZATIONSHEETBATCHNO'));
                    if (!scanBatchNo) {
                        return layer.msg('请先交接订单!', { icon: 7 });
                    }
                    var orderNum = $('#tobedelivered_orderNumOptimization').val();
                    var totalWeight = $('#tobedeliveredScan_totalWeightOptimization').text();
                    window.open(ctx + '/static/html/handoverForm.html?batchNo=' + scanBatchNo + '&orderNum=' + orderNum + '&totalWeight=' + totalWeight + '&bagNo=');
                    // console.log('打印标签纸');
                    _this.tobedeliveredClearData()
                });
            },
            //优选仓扫描单查询---参考单号或跟踪号接口
            optimizationSheetScanSearchAjax(order, platCode='aliexpress', sign=true, sendType=0) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: platCode,
                        sign: sign,
                        sendType: sendType
                    }
                })
            },
            //优选仓扫描单查询---订单编号或跟踪号接口
            optimizationSheetScanSearchAjax1(order, platCode='aliexpress', sign=true, sendType=0) {
                return commonReturnPromise({
                    url: '/lms/unshippedorder/cache/scanqueryorder.html',
                    params: {
                        queryStr: order,
                        platCode: platCode,
                        sign: sign,
                        sendType: sendType
                    }
                })
            },
            //优选仓提交发布交接单事件
            optimizationSheetSubmitAjax(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unshippedorder/youxuan/scanhandover.html',
                    params: JSON.stringify(obj)
                });
            },
            //#endregion 优选仓组包end---ztt20220711

            //#region AE全托管start---ztt20230719
            aefullyhostedHandle: function () {
              let _this = this;
              $('#tobedelivered-aefullyhosted').on('click', function() {
                commonReturnPromise({
                  url: '/lms/unshippedorder/scanCheckTempStoreAcct.html',
                  type: 'post',
                  params: {platCode: 'AE全托管'}
                }).then(data => {
                  let domStr = '<div style="text-align:center;margin-top:20px;"><div class="layui-form" lay-filter="scanLayer_prevAefullyhostedFilter">';
                  let dataArr = [];
                  let targetKeys =Object.keys(data);
                  let targetLen = targetKeys.length;
                  if(targetLen>0){
                    for(let i=0; i<targetKeys.length; i++){
                      let item = targetKeys[i];
                      let obj = {
                        storeAcct: data[item],
                        storeAcctId: item
                      }
                      dataArr.push(obj);
                    }
                  }
                  for (let i=0; i<dataArr.length; i++) {
                    let item = dataArr[i];
                      domStr += `<input type="radio" name="scanLayer_prevAefullyhosted_cks" title="${item.storeAcct}" value="${item.storeAcctId}">`;
                  }
                  domStr += '</div></div>';

                  if (targetLen == 0) {
                    _this.scanLayerDetailAefullyhostedHandle('');
                  } else if (targetLen == 1) {
                      _this.scanLayerDetailAefullyhostedHandle(Object.keys(data)[0]);
                  } else {
                      //前置弹框
                      layer.open({
                          type: 1,
                          title: '选择展示已扫描订单',
                          area: ['50%', '30%'],
                          content: domStr,
                          id: 'scanLayer_prevFilterAefullyhostedId',
                          btn: ['确定', '取消'],
                          success: function () {
                              form.render(null, 'scanLayer_prevAefullyhostedFilter');
                          },
                          yes: function (confirmIndex, confirmLayero) {
                              let id = confirmLayero.find('[name=scanLayer_prevAefullyhosted_cks]:checked').val();
                              let idsArr = id? [id]: [];
                              if (idsArr.length == 0) {
                                  return layer.msg('请选择店铺', { icon: 2 });
                              }
                              layer.close(confirmIndex);
                              _this.scanLayerDetailAefullyhostedHandle(idsArr.join(','));
                          },
                          end: function () {
                              _this.scanLayerDetailAefullyhostedHandle('');
                          }
                      });
                  }
                });
                  
              });
            },
            scanLayerDetailAefullyhostedHandle(ids){
              let _this = this;
              layer.open({
                type: 1,
                title: 'AE全托管',
                area: ['90%', '80%'],
                content: $('#tobedelivered-aefullyhostedLayer').html(),
                id: 'tobedelivered-aefullyhostedLayerId',
                move: false,
                success: function (layero, index) {
                    if(ids != ''){
                      _this.aefullyhostedTableInit(layero, ids); //缓存数据
                    }
                    _this.aefullyhostedRender(); //渲染初始化
                    _this.aefullyhostedReferKeycode(layero);
                    _this.aefullyhostedOrderKeycode(layero);
                    _this.aefullyhostedJoinCompleteHandle(layero);
                    _this.aefullyhostedPrintHandle(layero);
                    _this.aefullyhostedMakeupOrderHandle(layero);
                    form.render();
                },
                end:function(){
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-COLLET');
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-SELFSEND');
                },
                cancel: function() {
                  let $trCollets = $('#tobedelivered-aefullyhostedScanTbody-collect').find('tr');
                  let $trSelfSends = $('#tobedelivered-aefullyhostedScanTbody-selfSend').find('tr');
                  if(ids != '' || $trCollets.length !=0 || $trSelfSends.length !=0) {
                    commonReturnPromise({
                      url: '/lms/unshippedorder/scanCheckTempForAE.html',
                      params: {
                          platCode: 'AE全托管',
                          storeAcctId: $('#tobedelivered-storeSelectAefullyhosted').val() || ids
                      }
                    }).then(res => {
                        if (res && res.length > 0) {
                            layer.confirm('您在AE全托管中有未完成的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                layer.closeAll();
                                }, function() {
                                });                                   
                        } else {
                            layer.closeAll();
                        }
                        return false
                    })
                  }
                }
              });
            },
            //AE全托管缓存数据
            aefullyhostedTableInit (layero, ids) {
              var $tbodyCollet = layero.find('#tobedelivered-aefullyhostedScanTbody-collect');
              var $tbodySelfSend =layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend');
              var _this = this;
              commonReturnPromise({
                  url: '/lms/unshippedorder/scanCheckTempForAE.html',
                  params: {
                      platCode: 'AE全托管',
                      storeAcctId: ids
                  }
              }).then(res => {
                  if (res) {
                      let trColletStr = '';
                      let trSelfSendStr = '';
                      let selfSendArr = res.selfDeliveryList;
                      let colletArr = res.unSelfDeliveryList;
                      for (let i = 0; i < selfSendArr.length; i++){
                          let data = selfSendArr[i];
                          let trs = `
                              <tr>
                                  <td class="tableOrderId">${data.id || ''}</td>
                                  <td class="logisTypeName disN">${data.logisTypeName || ''}
                                      <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                      <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                      <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                  </td>
                                  <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                  <td class="logisAgentTrackingNo disN">${data.logisAgentTrackingNo || ''}</td>
                                  <td class="storeAcct">${data.storeAcct || ''}</td>
                                  <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                  <td class="more disN">
                                      ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                      <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                                      <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                                      <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                                      <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                      <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                                  </td>
                                  <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                  <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                              </tr>
                          `;
                          trSelfSendStr +=trs
                      }
                      for (let i = 0; i < colletArr.length; i++){
                        let data = colletArr[i];
                        let trs = `
                            <tr>
                                <td class="tableOrderId">${data.id || ''}</td>
                                <td class="logisTypeName disN">${data.logisTypeName || ''}
                                    <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                    <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                    <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                                </td>
                                <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                                <td class="logisAgentTrackingNo disN">${data.logisAgentTrackingNo || ''}</td>
                                <td class="storeAcct">${data.storeAcct || ''}</td>
                                <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                                <td class="more disN">
                                    ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                    <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                                    <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                                    <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                                    <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                    <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                                </td>
                                <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                                <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                            </tr>
                        `;
                        trColletStr +=trs
                      }
                      if([undefined, '', null].includes(ids)){
                        $tbodyCollet.html('');
                        $tbodySelfSend.html('');
                      }else{
                        $tbodyCollet.html(trColletStr);
                        $tbodySelfSend.html(trSelfSendStr);
                        //计算合计重量
                        _this.computedTotalWeight($tbodySelfSend,'tobedeliveredScan_totalWeightAefullyhosted_selfSend');
                        //统计订单数量
                        _this.countOrderNum($tbodySelfSend, 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                        //监听tbody-移除按钮事件
                        _this.watchDelete($tbodySelfSend, 'tobedeliveredScan_totalWeightAefullyhosted_selfSend', 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                        _this.computedTotalWeight($tbodyCollet,'tobedeliveredScan_totalWeightAefullyhosted_collet');
                        //统计订单数量
                        _this.countOrderNum($tbodyCollet, 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                        //监听tbody-移除按钮事件
                        _this.watchDelete($tbodyCollet, 'tobedeliveredScan_totalWeightAefullyhosted_collet', 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                      }
                  }
              }).catch(err => {
                  layer.msg(err, { icon: 2 });
              })
            },
            //渲染初始化数据
            aefullyhostedRender() {
              this.allStore('AE全托管').then(res => {
                commonRenderSelect('tobedelivered-storeSelectAefullyhosted', res, {
                  code: 'id',
                  name: 'storeAcct'
                }).then(()=> {
                  form.render('select');
                })
              });
            },
            //AE全托管回车事件-参考单号或跟踪号[左侧]
            aefullyhostedReferKeycode(layero) {
              let _this = this;
              let $referInput = layero.find('input[name=referOrderAefullyhosted]');
              let $orderInput = layero.find('input[name=orderAefullyhosted]');
              $referInput.on('keyup', function(e) {
                  if (e.keyCode == 13) { //回车事件
                      _this.referKeyBlur(layero, 'referOrderAefullyhosted', e).then(() => {
                          let val = e.target.value;
                          _this.optimizationSheetScanSearchAjax(val, 'AE全托管', false).then(function(result) {
                              $('#tobedelivered-storeSelectAefullyhosted').val(result.storeAcctId);
                              //赋值给收货仓库
                              layero.find('[name=referReceiveWarehouse]').val(result.receiveWarehouse || '');
                              form.render();
                              //订单编号获取焦点
                              $orderInput.focus();
                          }).catch(function (err) {
                              _this.errorVoiceWarning();
                              $referInput.select();
                              _this.packageEnterClose(err, function () {
                                  $referInput.blur()
                              }, $referInput);
                          });
                      }).catch(err => {
                          layer.msg(err, { icon: 2 });
                      })
                  }
              });
            },
            //AE全托管回车事件-订单编号或跟踪号[右侧]
            aefullyhostedOrderKeycode(layero) {
              var _this = this;
              var $orderInput = layero.find('input[name=orderAefullyhosted]');//订单编号
              var $company = layero.find('input[name=storeAefullyhosted]'); //订单店铺
              var $tbodyCollet = layero.find('#tobedelivered-aefullyhostedScanTbody-collect');
              var $tbodySelfSend = layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend');
              $orderInput.on('keyup', function(e) {
                  if (e.keyCode == 13) { //回车事件
                      _this.referKeyBlur(layero, 'orderOptimization', e).then(() => {
                          let val = e.target.value;
                          //判断表格是否有该条数据
                          if (_this.shopeeIsExistOrder($tbodyCollet, val) || _this.shopeeIsExistOrder($tbodySelfSend, val)) {
                              $orderInput.focus().select();
                              var speechSynthesisUtterance = new SpeechSynthesisUtterance(`重复`);
                              speechSynthesisUtterance.rate = 3;
                              speechSynthesis.speak(speechSynthesisUtterance);
                              return layer.msg('该订单编号已存在', { icon: 7 });
                          }
                          _this.optimizationSheetScanSearchAjax1(val, 'AE全托管', false).then(function(result) {
                              let selfSendNum = $('#tobedelivered_orderNumAefullyhosted_selfSend').text();//自寄数量
                              let colletNum = $('#tobedelivered_orderNumAefullyhosted_collet').text();//自寄数量
                              //赋值给收货仓库
                              layero.find('[name=receiveWarehouse]').val(result.receiveWarehouse || '');
                              $company.val(result.storeAcct);
                              if (result.storeAcct != $('#tobedelivered-storeSelectAefullyhosted option:selected').text() || (result.receiveWarehouse || '') != layero.find('[name=referReceiveWarehouse]').val()) {
                                commonReturnPromise({
                                  url: '/lms/unshippedorder/deleteById.html?orderId=' + result.orderId
                                });
                                return layer.msg('【非同一店铺】订单号：' + result.storeAcct, { icon: 2 });
                              }
                              if(result.selfDelivery){//是自寄订单
                                if(selfSendNum >=99){
                                  return layer.msg('自寄时,最多允许扫描99个订单',{icon: 7});
                                }
                                _this.optimizationSheetTbodyHandle($tbodySelfSend, result, 'AE');
                                //计算合计重量
                                _this.computedTotalWeight($tbodySelfSend,'tobedeliveredScan_totalWeightAefullyhosted_selfSend');
                                //统计订单数量
                                _this.countOrderNum($tbodySelfSend, 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                              }else{//是揽收订单
                                if(colletNum >=200){
                                  return layer.msg('非自寄时,最多允许扫描200个订单',{icon: 7});
                                }
                                _this.optimizationSheetTbodyHandle($tbodyCollet, result, 'AE');
                                //计算合计重量
                                _this.computedTotalWeight($tbodyCollet,'tobedeliveredScan_totalWeightAefullyhosted_collet');
                                //统计订单数量
                                _this.countOrderNum($tbodyCollet, 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                              }
                              //订单编号或跟踪号相关选项,并且input输入框获取焦点
                              $company.val('');
                              layero.find('[name=receiveWarehouse]').val('');
                              $orderInput.val('').focus();
                              _this.successVoiceWarning();
                              //对的执行这个逻辑[打印逻辑]
                              _this.commonPrintHandle(true).then(() => {
                                  // console.log('打印正确逻辑,右走')
                              });
                          }).catch(function (err) {
                              //错的执行这个逻辑
                              _this.commonPrintHandle(false).then(() => {});
                              _this.errorVoiceWarning();
                              _this.packageEnterClose(err, function () {
                                  $orderInput.blur()
                              }, $orderInput);
                          });
                      }).catch(err => {
                          layer.msg(err, { icon: 2 });
                      });
                  }
              });
              //监听tbody-移除按钮事件
              _this.watchDelete($tbodySelfSend, 'tobedeliveredScan_totalWeightAefullyhosted_selfSend', 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
              //监听tbody-移除按钮事件
              _this.watchDelete($tbodyCollet, 'tobedeliveredScan_totalWeightAefullyhosted_collet', 'tobedelivered_orderNumAefullyhosted_collet', 'span');
            },
            //AE全托管---创建揽收单
            aefullyhostedJoinCompleteHandle(layero) {
              let _this = this;
              //创建揽收单
              $('#tobedelivered-joinBtnAefullyhosted-collet').on('click', function() {
                 let $trs = layero.find('#tobedelivered-aefullyhostedScanTbody-collect').find('tr');
                 let totalWeight = ($('#tobedeliveredScan_totalWeightAefullyhosted_collet').text().split('kg')[0]*1000).toFixed(2); //总重量
                  let orderNum = $('#tobedelivered_orderNumAefullyhosted_collet').val(); //订单数量
                  let dataArr = [];
                  for (var i = 0; i < $trs.length; i++) {
                    var item = $trs[i];
                    var orderId = $(item).find('td:first-child').text();
                    var logisTypeName = $(item).find('.logisTypeName').text();
                    var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                    var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                    var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                    var scanTime = new Date($(item).find('td.time').text()).getTime();
                    var storeAcct = $(item).find('.storeAcct').text();
                    var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                    var salesSite = $(item).find('.more [name=salesSite]').val();
                    var accessToken = $(item).find('.more [name=accessToken]').val();
                    var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                    var shortCode = $(item).find('.more [name=shortCode]').val();
                    var sellerId = $(item).find('.more [name=sellerId]').val();
                    var obj = {
                        orderId: orderId,
                        logisCompanyId: logisCompanyId,
                        logisTypeName: logisTypeName,
                        logisCompanyName: logisCompanyName,
                        logisTypeId: logisTypeId,
                        scanTime: scanTime,
                        totalWeight: totalWeight,
                        storeAcct: storeAcct,
                        logisTrackingNo: logisTrackingNo,
                        salesSite: salesSite,
                        shortCode: shortCode,
                        accessToken: accessToken,
                        storeAcctId: storeAcctId,
                        sellerId: sellerId,
                        orderNum: orderNum,
                        platCode: 'AE全托管'
                    };
                    dataArr.push(obj);
                  }
                  _this.aefullyhostedSubmitAjax(dataArr).then(function(result) {
                    sessionStorage.setItem('AEFULLYHOSTEDBATCHNO-COLLET', JSON.stringify(result));
                    _this.commonCloseLayer(`批次号: ${result}`);
                  }).catch(function(err) {
                      _this.errHandle('创建揽收单接口调用失败', err);
                  });
              });
              //创建自寄单
              $('#tobedelivered-joinBtnAefullyhosted-selfSend').on('click', function(){
                let $trs = layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend').find('tr');
                 let totalWeight = ($('#tobedeliveredScan_totalWeightAefullyhosted_selfSend').text().split('kg')[0]*1000).toFixed(2); //总重量
                  let orderNum = $('#tobedelivered_orderNumAefullyhosted_selfSend').val(); //订单数量
                  let dataArr = [];
                  for (var i = 0; i < $trs.length; i++) {
                    var item = $trs[i];
                    var orderId = $(item).find('td:first-child').text();
                    var logisTypeName = $(item).find('.logisTypeName').text();
                    var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                    var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                    var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                    var scanTime = new Date($(item).find('td.time').text()).getTime();
                    var storeAcct = $(item).find('.storeAcct').text();
                    var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                    var salesSite = $(item).find('.more [name=salesSite]').val();
                    var accessToken = $(item).find('.more [name=accessToken]').val();
                    var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                    var shortCode = $(item).find('.more [name=shortCode]').val();
                    var sellerId = $(item).find('.more [name=sellerId]').val();
                    var obj = {
                        orderId: orderId,
                        logisCompanyId: logisCompanyId,
                        logisTypeName: logisTypeName,
                        logisCompanyName: logisCompanyName,
                        logisTypeId: logisTypeId,
                        scanTime: scanTime,
                        totalWeight: totalWeight,
                        storeAcct: storeAcct,
                        logisTrackingNo: logisTrackingNo,
                        salesSite: salesSite,
                        shortCode: shortCode,
                        accessToken: accessToken,
                        storeAcctId: storeAcctId,
                        sellerId: sellerId,
                        orderNum: orderNum,
                        platCode: 'AE全托管'
                    };
                    dataArr.push(obj);
                  }
                layer.open({
                  type: 1,
                  title: '自行发货',
                  content: $('#tobedelivered_selfSendLayer').html(),
                  id: 'tobedelivered_selfSendLayerId',
                  area: ['600px', '600px'],
                  btn: ['保存', '关闭'],
                  success: function(layero, index){
                    form.render('radio');
                    //监听radio点击事件
                    form.on('radio(delivery_type_radio)', function(data){
                      let val = data.value;
                      if(val == 1){
                        layero.find('.express').removeClass('disN');
                        layero.find('.truck').addClass('disN');
                        layero.find('[name=appointment_license_plate]').val('');
                        layero.find('[name=appointment_phone_number]').val('');
                      }else if(val==2){
                        layero.find('.express').addClass('disN');
                        layero.find('.truck').removeClass('disN');
                        layero.find('[name=logistics_service_provider]').val('');
                        layero.find('[name=appointment_express_no]').val('');
                      }
                    }); 
                  },
                  yes: function(index,layero){
                    //获取到name对应的元素值
                    //物流方式
                    let delivery_type = layero.find('[name=delivery_type]:checked').val();
                    //物流商
                    let logistics_service_provider = layero.find('[name=logistics_service_provider]').val().trim();
                    //快递单号
                    let appointment_express_no = layero.find('[name=appointment_express_no]').val().trim();
                    //车牌号
                    let appointment_license_plate = layero.find('[name=appointment_license_plate]').val().trim();
                    //联系电话
                    let appointment_phone_number = layero.find('[name=appointment_phone_number]').val().trim();
                    //数据拦截
                    if(delivery_type == 1){
                      if(!logistics_service_provider || !appointment_express_no){
                        return layer.msg('物流服务商和快递单号不能为空',{icon:7});
                      }
                    }else{
                      if(!appointment_license_plate){
                        return layer.msg('车牌号不能为空',{icon:7});
                      }
                    }
                    //数据响应
                    let obj = {
                      handoverDtoList: dataArr,
                      selfDeliveryRequest: {
                        delivery_type: delivery_type,
                        logistics_service_provider: logistics_service_provider,
                        appointment_express_no: appointment_express_no,
                        appointment_license_plate:appointment_license_plate,
                        appointment_phone_number:appointment_phone_number
                      }
                    };
                    //调用接口
                    commonReturnPromise({
                      url: '/lms/unshippedorder/smtJIT/smtSelfDeliveryScanHandover',
                      type: 'post',
                      contentType: 'application/json',
                      params: JSON.stringify(obj)
                    }).then(res => {
                      sessionStorage.setItem('AEFULLYHOSTEDBATCHNO-SELFSEND', JSON.stringify(res));
                      _this.commonCloseLayer(`批次号: ${res}`, index);
                    }).catch(function(err) {
                      _this.errHandle('创建揽收单接口调用失败', err);
                    });
                  }
                });
              });
            },
            //创建揽收单事件
            aefullyhostedSubmitAjax(obj) {
              return commonReturnPromise({
                  type: 'post',
                  contentType: 'application/json',
                  url: '/lms/unshippedorder/smtJIT/scanhandover.html',
                  params: JSON.stringify(obj)
              });
            },
            //AE全托管---补打交接单
            aefullyhostedMakeupOrderHandle(layero){
              let _this = this;
              $('#tobedelivered_makeupOrderAefullyhostedBtn').on('click', function () {
                  let val = $('#tobedelivered_makeupOrderInputAefullyhosted').val();
                  if (!val) {
                      return layer.msg('请先输入补打交接单号', { icon: 7 });
                  } else {
                    _this.aefullyhostedPrintAjax(val).then(res => {
                      packagePrint(res);
                    });
                  }
              });
            },
            //AE全托管---打印揽收单
            aefullyhostedPrintHandle() {
                let _this = this;
                //打印揽收单
                $('#tobedeliveredScan_printBtnAefullyhosted_collet').on('click', function() {
                    let scanBatchNo = JSON.parse(sessionStorage.getItem('AEFULLYHOSTEDBATCHNO-COLLET'));
                    if (!scanBatchNo) {
                        return layer.msg('请先创建揽收单!', { icon: 7 });
                    }
                    _this.aefullyhostedPrintAjax(scanBatchNo).then(res => {
                      packagePrint(res);
                    });
                    _this.tobedeliveredClearData('AE揽收')
                });
                //打印自寄单
                $('#tobedeliveredScan_printBtnAefullyhosted_selfSend').on('click', function(){
                    let scanBatchNo = JSON.parse(sessionStorage.getItem('AEFULLYHOSTEDBATCHNO-SELFSEND'));
                    if (!scanBatchNo) {
                        return layer.msg('请先创建自寄单!', { icon: 7 });
                    }
                    _this.aefullyhostedPrintAjax(scanBatchNo).then(res => {
                      packagePrint(res);
                    });
                    _this.tobedeliveredClearData('AE自寄')
                });
            },
            //AE全托管-打印/补打揽收单接口
            aefullyhostedPrintAjax(inputInfo){
              return commonReturnPromise({
                url: '/lms/unshippedorder/getPickupLabel.html',
                type: 'post',
                params: {
                  inputInfo: inputInfo
                }
              });
            },
            //#endregion

            //#region AE半托管start---ztt20231110
            aehalfhostedHandle(){
              let _this = this;
              $('#tobedelivered-aehalfhosted').on('click', function() {
                commonReturnPromise({
                  url: '/lms/unshippedorder/scanCheckTempStoreAcct.html',
                  type: 'post',
                  params: {platCode: 'AE半托管'}
                }).then(data => {
                  let domStr = '<div style="text-align:center;margin-top:20px;"><div class="layui-form" lay-filter="scanLayer_prevAefullyhostedFilter">';
                  let dataArr = [];
                  let targetKeys =Object.keys(data);
                  let targetLen = targetKeys.length;
                  if(targetLen>0){
                    for(let i=0; i<targetKeys.length; i++){
                      let item = targetKeys[i];
                      let obj = {
                        storeAcct: data[item],
                        storeAcctId: item
                      }
                      dataArr.push(obj);
                    }
                  }
                  for (let i=0; i<dataArr.length; i++) {
                    let item = dataArr[i];
                      domStr += `<input type="radio" name="scanLayer_prevAefullyhosted_cks" title="${item.storeAcct}" value="${item.storeAcctId}">`;
                  }
                  domStr += '</div></div>';

                  if (targetLen == 0) {
                    _this.scanLayerDetailAehalfhostedHandle('');
                  } else if (targetLen == 1) {
                      _this.scanLayerDetailAehalfhostedHandle(Object.keys(data)[0]);
                  } else {
                      //前置弹框
                      layer.open({
                          type: 1,
                          title: '选择展示已扫描订单',
                          area: ['50%', '30%'],
                          content: domStr,
                          id: 'scanLayer_prevFilterAefullyhostedId',
                          btn: ['确定', '取消'],
                          success: function () {
                              form.render(null, 'scanLayer_prevAefullyhostedFilter');
                          },
                          yes: function (confirmIndex, confirmLayero) {
                              let id = confirmLayero.find('[name=scanLayer_prevAefullyhosted_cks]:checked').val();
                              let idsArr = id? [id]: [];
                              if (idsArr.length == 0) {
                                  return layer.msg('请选择店铺', { icon: 2 });
                              }
                              layer.close(confirmIndex);
                              _this.scanLayerDetailAehalfhostedHandle(idsArr.join(','));
                          },
                          end: function () {
                              _this.scanLayerDetailAehalfhostedHandle('');
                          }
                      });
                  }
                });
                  
              });
            },
            scanLayerDetailAehalfhostedHandle(ids){
              let _this = this;
              layer.open({
                type: 1,
                title: 'AE半托管',
                area: ['90%', '80%'],
                content: $('#tobedelivered-aefullyhostedLayer').html(),
                id: 'tobedelivered-aehalfhostedLayerId',
                move: false,
                success: function (layero, index) {
                    if(ids != ''){
                      _this.aehalfhostedTableInit(layero, ids); //缓存数据
                    }
                    _this.aehalfhostedRender(); //渲染初始化
                    _this.aehalfhostedReferKeycode(layero);//左
                    _this.aehalfhostedOrderKeycode(layero);//右
                    _this.aehalfhostedJoinCompleteHandle(layero);//创建揽收单
                    _this.aehalfhostedPrintHandle(layero);//打印揽收单
                    _this.aehalfhostedMakeupOrderHandle(layero);//补打揽收单
                    form.render();
                },
                end:function(){
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-COLLET');
                  sessionStorage.removeItem('AEFULLYHOSTEDBATCHNO-SELFSEND');
                },
                cancel: function() {
                  let $trCollets = $('#tobedelivered-aefullyhostedScanTbody-collect').find('tr');
                  let $trSelfSends = $('#tobedelivered-aefullyhostedScanTbody-selfSend').find('tr');
                  if(ids != '' || $trCollets.length !=0 || $trSelfSends.length !=0) {
                    commonReturnPromise({
                      url: '/lms/unshippedorder/scanCheckTempForAE.html',
                      params: {
                          platCode: 'AE半托管',
                          storeAcctId: $('#tobedelivered-storeSelectAefullyhosted').val() || ids
                      }
                    }).then(res => {
                        if (res && res.length > 0) {
                            layer.confirm('您在AE全托管中有未完成的订单，请确认是否继续关闭！',{btn: ['是','否']} ,function() {
                                layer.closeAll();
                                }, function() {
                                });                                   
                        } else {
                            layer.closeAll();
                        }
                        return false
                    })
                  }
                }
              });
            },
            //AE半托管缓存数据
            aehalfhostedTableInit (layero, ids) {
              var $tbodyCollet = layero.find('#tobedelivered-aefullyhostedScanTbody-collect');
              var $tbodySelfSend =layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend');
              var _this = this;
              commonReturnPromise({
                url: '/lms/unshippedorder/scanCheckTempForAE.html',
                params: {
                    platCode: 'AE半托管',
                    storeAcctId: ids
                }
              }).then(res => {
                if (res) {
                  let trColletStr = '';
                  let trSelfSendStr = '';
                  let selfSendArr = res.selfDeliveryList;
                  let colletArr = res.unSelfDeliveryList;

                  for (let i = 0; i < selfSendArr.length; i++){
                      let data = selfSendArr[i];
                      let trs = `
                          <tr>
                              <td class="tableOrderId">${data.id || ''}</td>
                              <td class="logisTypeName disN">${data.logisTypeName || ''}
                                  <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                                  <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                                  <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                              </td>
                              <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                              <td class="logisAgentTrackingNo disN">${data.logisAgentTrackingNo || ''}</td>
                              <td class="storeAcct">${data.storeAcct || ''}</td>
                              <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                              <td class="more disN">
                                  ${data.shippingCost!==undefined ? data.shippingCost : "" }
                                  <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                                  <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                                  <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                                  <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                                  <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                              </td>
                              <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                              <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                          </tr>
                      `;
                      trSelfSendStr +=trs
                  }

                  for (let i = 0; i < colletArr.length; i++){
                    let data = colletArr[i];
                    let trs = `
                      <tr>
                          <td class="tableOrderId">${data.id || ''}</td>
                          <td class="logisTypeName disN">${data.logisTypeName || ''}
                              <input type="hidden" name="logisCompanyId" value="${data.logisCompanyId || ''}">
                              <input type="hidden" name="logisCompanyName" value="${data.logisCompanyName || ''}">
                              <input type="hidden" name="logisTypeId" value="${data.logisTypeId || ''}">
                          </td>
                          <td class="logisTrackingNo">${data.logisTrackingNo || ''}</td>
                          <td class="logisAgentTrackingNo disN">${data.logisAgentTrackingNo || ''}</td>
                          <td class="storeAcct">${data.storeAcct || ''}</td>
                          <td class="realWeight">${(data.realWeight/1000).toFixed(4) || ''}</td>
                          <td class="more disN">
                              ${data.shippingCost!==undefined ? data.shippingCost : "" }
                              <input type="hidden" name="salesSite" value="${data.salesSite || ''}">
                              <input type="hidden" name="shortCode" value="${data.shortCode || ''}">
                              <input type="hidden" name="accessToken" value="${data.accessToken || ''}">
                              <input type="hidden" name="storeAcctId" value="${data.storeAcctId || ''}">
                              <input type="hidden" name="sellerId" value="${data.sellerId || ''}">
                          </td>
                          <td class="time">${Format(data.scanTime, 'yyyy-MM-dd hh:mm:ss') || ''}</td>
                          <td style="text-align: center"><span style="width: 80%;" class="layui-btn layui-btn-sm layui-btn-danger scanTbodyRemoveBtn">移除</span></td>
                      </tr>
                    `;
                    trColletStr +=trs
                  }

                  if([undefined, '', null].includes(ids)){
                    $tbodyCollet.html('');
                    $tbodySelfSend.html('');
                  }else{
                    $tbodyCollet.html(trColletStr);
                    $tbodySelfSend.html(trSelfSendStr);
                    //计算合计重量
                    _this.computedTotalWeight($tbodySelfSend,'tobedeliveredScan_totalWeightAefullyhosted_selfSend');
                    //统计订单数量
                    _this.countOrderNum($tbodySelfSend, 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                    //监听tbody-移除按钮事件
                    _this.watchDelete($tbodySelfSend, 'tobedeliveredScan_totalWeightAefullyhosted_selfSend', 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                    _this.computedTotalWeight($tbodyCollet,'tobedeliveredScan_totalWeightAefullyhosted_collet');
                    //统计订单数量
                    _this.countOrderNum($tbodyCollet, 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                    //监听tbody-移除按钮事件
                    _this.watchDelete($tbodyCollet, 'tobedeliveredScan_totalWeightAefullyhosted_collet', 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                  }
                }
              }).catch(err => {
                  layer.msg(err, { icon: 2 });
              })
            },
            //渲染初始化数据
            aehalfhostedRender() {
              this.allStore('AE半托管').then(res => {
                commonRenderSelect('tobedelivered-storeSelectAefullyhosted', res, {
                  code: 'id',
                  name: 'storeAcct'
                }).then(()=> {
                  form.render('select');
                })
              });
            },
            //AE半托管回车事件-参考单号或跟踪号[左侧]
            aehalfhostedReferKeycode(layero) {
              let _this = this;
              let $referInput = layero.find('input[name=referOrderAefullyhosted]');
              let $orderInput = layero.find('input[name=orderAefullyhosted]');
              $referInput.on('keyup', function(e) {
                  if (e.keyCode == 13) { //回车事件
                      _this.referKeyBlur(layero, 'referOrderAefullyhosted', e).then(() => {
                          let val = e.target.value;
                          _this.optimizationSheetScanSearchAjax(val, 'AE半托管', false).then(function(result) {
                              $('#tobedelivered-storeSelectAefullyhosted').val(result.storeAcctId);
                              //赋值给收货仓库
                              layero.find('[name=referReceiveWarehouse]').val(result.receiveWarehouse || '');
                              form.render();
                              //订单编号获取焦点
                              $orderInput.focus();
                          }).catch(function (err) {
                              _this.errorVoiceWarning();
                              $referInput.select();
                              _this.packageEnterClose(err, function () {
                                  $referInput.blur()
                              }, $referInput);
                          });
                      }).catch(err => {
                          layer.msg(err, { icon: 2 });
                      })
                  }
              });
            },
            //AE半托管回车事件-订单编号或跟踪号[右侧]
            aehalfhostedOrderKeycode(layero) {
              var _this = this;
              var $orderInput = layero.find('input[name=orderAefullyhosted]');//订单编号
              var $company = layero.find('input[name=storeAefullyhosted]'); //订单店铺
              var $tbodyCollet = layero.find('#tobedelivered-aefullyhostedScanTbody-collect');
              var $tbodySelfSend = layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend');
              $orderInput.on('keyup', function(e) {
                  if (e.keyCode == 13) { //回车事件
                      _this.referKeyBlur(layero, 'orderOptimization', e).then(() => {
                          let val = e.target.value;
                          //判断表格是否有该条数据
                          if (_this.shopeeIsExistOrder($tbodyCollet, val) || _this.shopeeIsExistOrder($tbodySelfSend, val)) {
                              $orderInput.focus().select();
                              var speechSynthesisUtterance = new SpeechSynthesisUtterance(`重复`);
                              speechSynthesisUtterance.rate = 3;
                              speechSynthesis.speak(speechSynthesisUtterance);
                              return layer.msg('该订单编号已存在', { icon: 7 });
                          }
                          _this.optimizationSheetScanSearchAjax1(val, 'AE半托管', false).then(function(result) {
                            let selfSendNum = $('#tobedelivered_orderNumAefullyhosted_selfSend').text();//自寄数量
                            let colletNum = $('#tobedelivered_orderNumAefullyhosted_collet').text();//自寄数量
                            //赋值给收货仓库
                            layero.find('[name=receiveWarehouse]').val(result.receiveWarehouse || '');
                            $company.val(result.storeAcct);
                            if (result.storeAcct != $('#tobedelivered-storeSelectAefullyhosted option:selected').text() || (result.receiveWarehouse || '') != layero.find('[name=referReceiveWarehouse]').val()) {
                              commonReturnPromise({
                                url: '/lms/unshippedorder/deleteById.html?orderId=' + result.orderId
                              });
                              return layer.msg('【非同一店铺】订单号：' + result.storeAcct, { icon: 2 });
                            }
                            if(result.selfDelivery){//是自寄订单
                              if(selfSendNum >=99){
                                return layer.msg('自寄时,最多允许扫描99个订单',{icon: 7});
                              }
                              _this.optimizationSheetTbodyHandle($tbodySelfSend, result, 'AE');
                              //计算合计重量
                              _this.computedTotalWeight($tbodySelfSend,'tobedeliveredScan_totalWeightAefullyhosted_selfSend');
                              //统计订单数量
                              _this.countOrderNum($tbodySelfSend, 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
                            }else{//是揽收订单
                              if(colletNum >=200){
                                return layer.msg('非自寄时,最多允许扫描200个订单',{icon: 7});
                              }
                              _this.optimizationSheetTbodyHandle($tbodyCollet, result, 'AE');
                              //计算合计重量
                              _this.computedTotalWeight($tbodyCollet,'tobedeliveredScan_totalWeightAefullyhosted_collet');
                              //统计订单数量
                              _this.countOrderNum($tbodyCollet, 'tobedelivered_orderNumAefullyhosted_collet', 'span');
                            }
                            //订单编号或跟踪号相关选项,并且input输入框获取焦点
                            $company.val('');
                            layero.find('[name=receiveWarehouse]').val('');
                            $orderInput.val('').focus();
                            _this.successVoiceWarning();
                            //对的执行这个逻辑[打印逻辑]
                            _this.commonPrintHandle(true).then(() => {
                                // console.log('打印正确逻辑,右走')
                            });
                          }).catch(function (err) {
                              //错的执行这个逻辑
                              _this.commonPrintHandle(false).then(() => {});
                              _this.errorVoiceWarning();
                              _this.packageEnterClose(err, function () {
                                  $orderInput.blur()
                              }, $orderInput);
                          });
                      }).catch(err => {
                          layer.msg(err, { icon: 2 });
                      });
                  }
              });
              //监听tbody-移除按钮事件
              _this.watchDelete($tbodySelfSend, 'tobedeliveredScan_totalWeightAefullyhosted_selfSend', 'tobedelivered_orderNumAefullyhosted_selfSend', 'span');
              _this.watchDelete($tbodyCollet, 'tobedeliveredScan_totalWeightAefullyhosted_collet', 'tobedelivered_orderNumAefullyhosted_collet', 'span');
            },
            //AE半托管---创建揽收单
            aehalfhostedJoinCompleteHandle(layero) {
              let _this = this;
              //创建揽收单
              $('#tobedelivered-joinBtnAefullyhosted-collet').on('click', function() {
                let $trs = layero.find('#tobedelivered-aefullyhostedScanTbody-collect').find('tr');
                let totalWeight = ($('#tobedeliveredScan_totalWeightAefullyhosted_collet').text().split('kg')[0]*1000).toFixed(2); //总重量
                 let orderNum = $('#tobedelivered_orderNumAefullyhosted_collet').val(); //订单数量
                 let dataArr = [];
                 for (var i = 0; i < $trs.length; i++) {
                   var item = $trs[i];
                   var orderId = $(item).find('td:first-child').text();
                   var logisTypeName = $(item).find('.logisTypeName').text();
                   var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                   var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                   var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                   var scanTime = new Date($(item).find('td.time').text()).getTime();
                   var storeAcct = $(item).find('.storeAcct').text();
                   var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                   var salesSite = $(item).find('.more [name=salesSite]').val();
                   var accessToken = $(item).find('.more [name=accessToken]').val();
                   var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                   var shortCode = $(item).find('.more [name=shortCode]').val();
                   var sellerId = $(item).find('.more [name=sellerId]').val();
                   var obj = {
                       orderId: orderId,
                       logisCompanyId: logisCompanyId,
                       logisTypeName: logisTypeName,
                       logisCompanyName: logisCompanyName,
                       logisTypeId: logisTypeId,
                       scanTime: scanTime,
                       totalWeight: totalWeight,
                       storeAcct: storeAcct,
                       logisTrackingNo: logisTrackingNo,
                       salesSite: salesSite,
                       shortCode: shortCode,
                       accessToken: accessToken,
                       storeAcctId: storeAcctId,
                       sellerId: sellerId,
                       orderNum: orderNum,
                       platCode: 'AE半托管'
                   };
                   dataArr.push(obj);
                 }
                 _this.aefullyhostedSubmitAjax(dataArr).then(function(result) {
                   sessionStorage.setItem('AEFULLYHOSTEDBATCHNO-COLLET', JSON.stringify(result));
                   _this.commonCloseLayer(`批次号: ${result}`);
                 }).catch(function(err) {
                     _this.errHandle('创建揽收单接口调用失败', err);
                 });
             });
             //创建自寄单
             $('#tobedelivered-joinBtnAefullyhosted-selfSend').on('click', function(){
               let $trs = layero.find('#tobedelivered-aefullyhostedScanTbody-selfSend').find('tr');
                let totalWeight = ($('#tobedeliveredScan_totalWeightAefullyhosted_selfSend').text().split('kg')[0]*1000).toFixed(2); //总重量
                 let orderNum = $('#tobedelivered_orderNumAefullyhosted_selfSend').val(); //订单数量
                 let dataArr = [];
                 for (var i = 0; i < $trs.length; i++) {
                   var item = $trs[i];
                   var orderId = $(item).find('td:first-child').text();
                   var logisTypeName = $(item).find('.logisTypeName').text();
                   var logisCompanyId = $(item).find('.logisTypeName [name=logisCompanyId]').val();
                   var logisCompanyName = $(item).find('.logisTypeName [name=logisCompanyName]').val();
                   var logisTypeId = $(item).find('.logisTypeName [name=logisTypeId]').val();
                   var scanTime = new Date($(item).find('td.time').text()).getTime();
                   var storeAcct = $(item).find('.storeAcct').text();
                   var logisTrackingNo = $(item).find('.logisTrackingNo').text();
                   var salesSite = $(item).find('.more [name=salesSite]').val();
                   var accessToken = $(item).find('.more [name=accessToken]').val();
                   var storeAcctId = $(item).find('.more [name=storeAcctId]').val();
                   var shortCode = $(item).find('.more [name=shortCode]').val();
                   var sellerId = $(item).find('.more [name=sellerId]').val();
                   var obj = {
                       orderId: orderId,
                       logisCompanyId: logisCompanyId,
                       logisTypeName: logisTypeName,
                       logisCompanyName: logisCompanyName,
                       logisTypeId: logisTypeId,
                       scanTime: scanTime,
                       totalWeight: totalWeight,
                       storeAcct: storeAcct,
                       logisTrackingNo: logisTrackingNo,
                       salesSite: salesSite,
                       shortCode: shortCode,
                       accessToken: accessToken,
                       storeAcctId: storeAcctId,
                       sellerId: sellerId,
                       orderNum: orderNum,
                       platCode: 'AE半托管'
                   };
                   dataArr.push(obj);
                 }
               layer.open({
                 type: 1,
                 title: '自行发货',
                 content: $('#tobedelivered_selfSendLayer').html(),
                 id: 'tobedelivered_selfSendLayerId',
                 area: ['600px', '600px'],
                 btn: ['保存', '关闭'],
                 success: function(layero, index){
                   form.render('radio');
                   //监听radio点击事件
                   form.on('radio(delivery_type_radio)', function(data){
                     let val = data.value;
                     if(val == 1){
                       layero.find('.express').removeClass('disN');
                       layero.find('.truck').addClass('disN');
                       layero.find('[name=appointment_license_plate]').val('');
                       layero.find('[name=appointment_phone_number]').val('');
                     }else if(val==2){
                       layero.find('.express').addClass('disN');
                       layero.find('.truck').removeClass('disN');
                       layero.find('[name=logistics_service_provider]').val('');
                       layero.find('[name=appointment_express_no]').val('');
                     }
                   }); 
                 },
                 yes: function(index,layero){
                   //获取到name对应的元素值
                   //物流方式
                   let delivery_type = layero.find('[name=delivery_type]:checked').val();
                   //物流商
                   let logistics_service_provider = layero.find('[name=logistics_service_provider]').val().trim();
                   //快递单号
                   let appointment_express_no = layero.find('[name=appointment_express_no]').val().trim();
                   //车牌号
                   let appointment_license_plate = layero.find('[name=appointment_license_plate]').val().trim();
                   //联系电话
                   let appointment_phone_number = layero.find('[name=appointment_phone_number]').val().trim();
                   //数据拦截
                   if(delivery_type == 1){
                     if(!logistics_service_provider || !appointment_express_no){
                       return layer.msg('物流服务商和快递单号不能为空',{icon:7});
                     }
                   }else{
                     if(!appointment_license_plate){
                       return layer.msg('车牌号不能为空',{icon:7});
                     }
                   }
                   //数据响应
                   let obj = {
                     handoverDtoList: dataArr,
                     selfDeliveryRequest: {
                       delivery_type: delivery_type,
                       logistics_service_provider: logistics_service_provider,
                       appointment_express_no: appointment_express_no,
                       appointment_license_plate:appointment_license_plate,
                       appointment_phone_number:appointment_phone_number
                     }
                   };
                   //调用接口
                   commonReturnPromise({
                     url: '/lms/unshippedorder/smtJIT/smtSelfDeliveryScanHandover',
                     type: 'post',
                     contentType: 'application/json',
                     params: JSON.stringify(obj)
                   }).then(res => {
                     sessionStorage.setItem('AEFULLYHOSTEDBATCHNO-SELFSEND', JSON.stringify(res));
                     _this.commonCloseLayer(`批次号: ${res}`, index);
                   }).catch(function(err) {
                     _this.errHandle('创建揽收单接口调用失败', err);
                   });
                 }
               });
             });
            },
            //AE半托管---打印揽收单
            aehalfhostedPrintHandle(layero) {
              let _this = this;
              //打印揽收单
              $('#tobedeliveredScan_printBtnAefullyhosted_collet').on('click', function() {
                let scanBatchNo = JSON.parse(sessionStorage.getItem('AEFULLYHOSTEDBATCHNO-COLLET'));
                if (!scanBatchNo) {
                    return layer.msg('请先创建揽收单!', { icon: 7 });
                }
                _this.aefullyhostedPrintAjax(scanBatchNo).then(res => {
                  packagePrint(res);
                });
                _this.tobedeliveredClearData('AE揽收')
              });
              //打印自寄单
              $('#tobedeliveredScan_printBtnAefullyhosted_selfSend').on('click', function(){
                  let scanBatchNo = JSON.parse(sessionStorage.getItem('AEFULLYHOSTEDBATCHNO-SELFSEND'));
                  if (!scanBatchNo) {
                      return layer.msg('请先创建自寄单!', { icon: 7 });
                  }
                  _this.aefullyhostedPrintAjax(scanBatchNo).then(res => {
                    packagePrint(res);
                  });
                  _this.tobedeliveredClearData('AE自寄')
              });
            },
            //AE半托管---补打交接单
            aehalfhostedMakeupOrderHandle(layero){
              let _this = this;
              $('#tobedelivered_makeupOrderAefullyhostedBtn').on('click', function () {
                let val = $('#tobedelivered_makeupOrderInputAefullyhosted').val();
                if (!val) {
                    return layer.msg('请先输入补打交接单号', { icon: 7 });
                } else {
                  _this.aefullyhostedPrintAjax(val).then(res => {
                    packagePrint(res);
                  });
                }
              });
            },


            //#endregion



            //统一错误处理
            errHandle: function(str, err) {
                var errHandle = typeof(err) == 'object' ? str : err;
                this.packageEnterClose(errHandle,function () {})
                // layer.msg(errHandle, { icon: 2 });

            },
            //物流公司接口
            allCompanyAjax: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unauditorder/listcompanyandagent.html'
                });
            },
            //物流方式接口
            allLogisTypeAjax: function() {
                return commonReturnPromise({
                    url: '/lms/unauditorder/listlogistype.html?specialType=直发物流'
                });
            },
             //统一回车关闭弹框
             packageEnterClose: function(str, fn, onfocus) {
                layer.open({
                    title: '提示',
                    content: `<span style="font-size: 30px;">${str}</span>`,
                    btn: ['<span style="font-size: 25px">确认</span>'],
                    area: ['60%','40%'],
                    success: function(layero, index) {
                        layero.find('.layui-layer-title').css('font-size', '24px')
                        layero.find('.layui-layer-btn0').css('height', '30px')
                        layero.find('.layui-layer-btn0').css('line-height', '30px')
                        this.enterEsc = function(event) {
                            if (event.keyCode === 13) {
                                fn();
                                layer.close(index);
                                return false; //阻止系统默认回车事件
                            }
                        };
                        $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
                    },
                    end: function() {
                        $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                        if (onfocus) {
                            onfocus.select()
                        }
                    }
                });
            },
            //#region 搜索+渲染表格start
            //时间渲染默认30天
            time: function() {
                var nowdate = new Date(new Date().toLocaleDateString()).getTime()
                var endTime = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
                var startTime = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
                var timeVal = startTime + ' - ' + endTime;
                laydate.render({
                    elem: '#tobedelivered_time',
                    type: 'datetime',
                    // value: timeVal,
                    inputAuto: true,
                    range: true,
                    showShortcuts: true,
                });
            },
            //渲染搜索条件
            renderSearchItem: function() {
                var _this = this;
                var tobedeliveredSession = sessionStorage.getItem('TOBEDELIVERED_ITEMS');
                if (!tobedeliveredSession) {
                    _this.commonSession().then(function(obj) {
                        _this.renderHandle(obj);
                        sessionStorage.setItem('TOBEDELIVERED_ITEMS', JSON.stringify(obj));
                    }).catch(function(err) {
                        layer.msg('请求接口出错', { icon: 7 });
                    })
                } else {
                    var obj = new Function(`return ${tobedeliveredSession}`)();
                    _this.renderHandle(obj);
                }
            },
            //缓存请求结构公共逻辑
            commonSession: function() {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    Promise.all([_this.allLists(), _this.allPurchasingAgent(), _this.allPreprodDev(), _this.allCompany()])
                        .then(function(result) {
                            var obj = result[0]; //平台/物流属性/收件国家/发货仓库/订单标签
                            obj.purchasingAgent = result[1]; //采购人员
                            obj.preprodDev = result[2]; //开发人员
                            obj.companys = result[3]['companys']; //物流公司
                            obj.agents = result[3]['agents']; //货代公司
                            resolve(obj);
                        }).catch(function(err) {
                            reject(err);
                        });
                })
            },
            //渲染操作
            renderHandle: function(obj) {
                //平台
                commonRenderSelect('tobedelivered_platCode', obj.platCodes).then(function() {
                    form.render('select');
                });
                //订单标签
                commonRenderSelect('tobedelivered_orderLabels', obj.orderLabels, { name: 'name', code: 'code' }).then(function() {
                    formSelects.render('tobedelivered_orderLabels');
                });
                //物流属性tobedelivered_logisAttrs
                commonRenderSelect('tobedelivered_logisAttrs', obj.logisAttrs).then(function() {
                    formSelects.render('tobedelivered_logisAttrs');
                });
                //收件国家tobedelivered_shippingCountrys
                const shippingCountryCodeList = obj.shippingCountrys.map(item => ({
                    ...item,
                    name: item.value + "(" + item.name + ")",
                    shippingCountryCode: item.name,
                    shippingCountryName: item.enFullValue,
                    shippingCountryCnName: item.value,
                  }))
                commonRenderSelect('tobedelivered_shippingCountrys',
                    shippingCountryCodeList,
                    { name: "name", code: "shippingCountryCode" }).then(function() {
                    formSelects.render('tobedelivered_shippingCountrys');
                });
                //物流公司tobedelivered_company
                commonRenderSelect('tobedelivered_company', obj.companys, { name: 'cnName', code: 'id' }).then(function() {
                    form.render('select');
                });
                //发货仓库tobedelivered_warehouseId
                commonRenderSelect('tobedelivered_warehouseId', obj.prodWarehouses, { name: 'value', code: 'name' }).then(function() {
                    form.render('select');
                });
                //开发专员tobedelivered_preprodDevId
                commonRenderSelect('tobedelivered_preprodDevId', obj.preprodDev, { name: 'userName', code: 'id' }).then(function() {
                    form.render('select');
                });
                //采购专员tobedelivered_purchasingAgentId
                commonRenderSelect('tobedelivered_purchasingAgentId', obj.purchasingAgent, { name: 'userName', code: 'id' }).then(function() {
                    form.render('select');
                });
            },
            //获取所有采购人员post
            allPurchasingAgent: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/sys/buyerList.html'
                });
            },
            //获取所有开发人员post
            allPreprodDev: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/sys/prodOwnerList.html'
                });
            },
            //获取平台/物流属性/收件国家/发货仓库/订单标签post
            allLists: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unauditorder/listenum.html'
                });
            },
            //获取物流/货代公司post
            allCompany: function() {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/unauditorder/listcompanyandagent.html'
                });
            },
            //获取所有的物流方式post
            allLogisType: function(obj) {
                return commonReturnPromise({
                    url: '/lms/unauditorder/listlogistype.html',
                    params: {...obj,specialType: "直发物流"}
                });
            },
            //获取店铺(获取24万行json,前端渲染不动啊)
            allStore: function(platCode) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: `/lms/sys/orderliststorebyplatcode.html?platCode=${platCode}`
                });
            },
            //获取平台订单状态
            listplatorderstatus: function(platCode) {
                return commonReturnPromise({
                    type: 'get',
                    url: `/lms/undispatch/listplatorderstatus.html?platCode=${platCode}`
                });
            },
            //平台和店铺,物流公司和物流方式联动
            watchHandle: function() {
                var tobedeliveredSession = sessionStorage.getItem('TOBEDELIVERED_ITEMS');
                var _this = this;
                var $form = $('#tobedeliveredForm');
                //监听平台和店铺联动
                commonInitRenderRoleType('tobedelivered');
                form.on('select(tobedelivered_platCode)', function(data) {
                    var val = data.value; //选中的值
                    // commonOrderAddSalePerson('tobedelivered', form, val);
                    commonOrderAddOrg('tobedelivered', form, val);
                    _this.listplatorderstatus(val).then(function(result) {
                        _this.platOrderStatuscommonPS(result);
                    });
                    // _this.allStore(val).then(function(result) {
                    //     _this.commonPS(result);
                    // });
                });
                //监听物流公司和货代公司切换
                form.on('select(companyType)', function(data) {
                    var val = data.value;
                    if (!tobedeliveredSession) {
                        _this.allCompany().then(function(result) {
                            _this.commonLW(val, result);
                        });
                    } else {
                        var obj = new Function(`return ${tobedeliveredSession}`)();
                        _this.commonLW(val, obj);
                    }
                });
                //监听物流/货代公司和物流方式联动
                form.on('select(tobedelivered_company)', function(data) {
                    var val = data.value;
                    var isCompany = $form.find('[name=companyType]').val();
                    var obj = {};
                    if (isCompany == 'companys') {
                        obj.logisticsCompanyId = val;
                    } else {
                        obj.agent = val;
                    }
                    _this.allLogisType(obj).then(function(result) {
                        commonRenderSelect('tobedelivered_logisTypeIds', result, { name: 'name', code: 'id' }).then(function() {
                            formSelects.render('xm_tobedelivered_logisTypeIds');
                        });
                    })
                });
            },
            //平台和店铺公共逻辑
            commonPS: function(data) {
                commonRenderSelect('tobedelivered_store', data, { name: 'storeAcct', code: 'id' }).then(function() {
                    formSelects.render('tobedelivered_store');
                });
            },
            platOrderStatuscommonPS: function(data) {
                let arr = []
                data && data.forEach(item => arr.push({"platOrderStatus":item}))
                commonRenderSelect('tbd_platOrderStatusList', arr, { name: 'platOrderStatus', code: 'platOrderStatus'}).then(function() {
                    formSelects.render('tbd_platOrderStatusList');
                });
            },
            //物流方式相关的公共逻辑
            commonLW: function(val, result) {
                if (val == 'companys') {
                    commonRenderSelect('tobedelivered_company', result.companys, { name: 'cnName', code: 'id' }).then(function() {
                        form.render('select');
                    });
                } else {
                    commonRenderSelect('tobedelivered_company', result.agents, { name: 'cnName', code: 'id' }).then(function() {
                        form.render('select');
                    });
                }
            },
            //更多查询条件处理
            moreHandle: function () {
                let _this = this;
                $('#showMoreSearchCondition_tobedelivered').click(function() {
                    var self = this
                    if ($(self).hasClass('showExternal')) {
                        $(self).closest('.layui-form').find('.externalContainAuditorder').hide()
                        $('#hide_icon_tobedelivered').show()
                        $('#show_icon_tobedelivered').hide()
                        $(self).removeClass('showExternal')
                        //被隐藏了,执行判断逻辑
                        _this.hasValue();
                    } else {
                        $(self).closest('.layui-form').find('.externalContainAuditorder').show()
                        $('#hide_icon_tobedelivered').hide()
                        $('#show_icon_tobedelivered').show()
                        $(self).addClass('showExternal')
                    }
                });
            },
            hasValue: function () {
                let inputs = $('#tobedeliveredForm .externalPopAuditorder').find('input');
                let count = 0;
                let showDom = $('#showMoreSearchCondition_tobedelivered .hasValue');
                for (let i = 0; i < inputs.length; i++){
                    let item = inputs[i];
                    let val = $(item).val();
                    if ( val&& val != '请选择') {
                        count++;
                    }
                }
                if (count > 0) {
                    showDom.html('<font color="red">(有值)</font>');
                } else {
                    showDom.html('');
                }
            },
            //触发搜索按钮
            trigger: function() {
                $('[lay-filter=tobedeliveredSearch]').trigger('click');
            },
            //数据处理
            dataHandle: function (data) {
                // if (data.platTags) {
                //     data.platTags = JSON.stringify(data.platTags.split(','));
                // }
                if (data.salerAndcustomSelect == 2) {
                    data.customServicerId = data.salePersonId;
                    delete data.salePersonId;
                }
                if (data.times) {
                    var timesArr = data.times.split(' - ');
                    data.orderTimeStart = timesArr[0];
                    data.orderTimeEnd = timesArr[1];
                } else {
                    data.orderTimeStart = '';
                    data.orderTimeEnd = '';
                }
                data[data.skuType] = data.skuvalue
                delete data.skuType
                delete data.skuvalue
                //处理companyType和company
                if (data['companyType'] == 'companys') {
                    data.logisticsCompanyId = data['company'] || '';
                } else {
                    data.agentCompany = data['company'] || '';
                }
                if (data.newBatchNo == 1) { // 拣货批次
                    data.pickBatchNo = data.valBatchNo
                }else if(data.newBatchNo == 2){ // 组包批次
                    data.handoverBatchNo = data.valBatchNo
                }
                // 1. 选择了部门，没有选店铺
                //     1.1 部门下有店铺，传全部店铺
                //     1.2 部门下没有店铺，传0
                // 2. 选择了部门，选择了店铺，传选择的店铺
                if(data.orgs != ''&&data.storeAcctIds == ''){
                    data.storeAcctIds = $('#tobedelivered_store').attr('acct_ids') || 0;
                }
                delete data['companyType'];
                delete data['company'];
                return data;
            },
            //渲染表格
            tableRender: function(data) {
                var _this = this;
                commonReturnPromiseRes({
                    url: ctx + '/unshippedorder/listorder.html',
                    type: 'POST',
                    params:data
                }).then(function(result){
                    // 商品种类||数量
                    if(result.count != 0) {
                        let skuQuantity = 0, prodQuantity = 0;
                        result.data.forEach(item => {
                            skuQuantity = skuQuantity + item.skuQuantity * 1
                            prodQuantity = prodQuantity + item.prodQuantity * 1
                        })
                        $("#tobedelivered_tableId").find("[col-id=3] .ag-header-cell-text").text(`商品 种类${skuQuantity} || 数量${prodQuantity}`)
                        _this.toBedeliveredPage(data, result.count)
                        immutableStore = result.data
                        toBedelivered_gridOptions.api.setRowData(immutableStore)
                        $('#tobedelivered-tabs').find('li>span').html('');
                        $('#tobedelivered-tabs').find('li.layui-this>span').html(`${result.count}`);
                    }else{
                        $("#tobedelivered_tableId").find("[col-id=3] .ag-header-cell-text").text(`商品 种类0 || 数量0`)
                        _this.toBedeliveredPage(data, 0)
                        immutableStore = []
                        toBedelivered_gridOptions.api.setRowData(immutableStore)
                        $('#tobedelivered-tabs').find('li>span').html('');
                        $('#tobedelivered-tabs').find('li.layui-this>span').html(`0`);
                    }
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            },
            // 渲染页面分页
            toBedeliveredPage(data, count) {
                laypage.render({
                    elem: 'toBedeliveredPage',
                    curr: data.page,
                    limit: data.limit,
                    limits:[5000, 10000, 20000],
                    layout: ['prev', 'page', 'next', 'count', 'limit'],
                    count: count,
                    jump: function(obj, first) {
                        $('#tobedeliveredForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                        $('#tobedeliveredForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                        //首次不执行
                        if (!first) {
                            data.page = obj.curr;
                            data.limit = obj.limit;
                            console.log('执行切换分页')
                            $('#tobedeliveredSearch').click()
                        }
                    }
                });
            },

            tableCol: function() {
                var cols = [
                    [
                        { checkbox: true, width: 30 },
                        { title: "订单号", field: "id", templet: "#tobedelivered_id_tpl" },
                        { title: "订单金额", field: "platOrderAmts", templet: "#tobedelivered_platOrderAmt_tpl" },
                        { title: "商品", field: "prodQuantitys", templet: "#tobedelivered_prodQuantity_tpl" },
                        { title: "收件人", field: "shippingUsernames", templet: "#tobedelivered_shippingUsername_tpl" },
                        { title: "物流", field: "logisTypeNames", templet: '#tobedelivered_logisTypeName_tpl' },
                        { title: "时间", field: "times", templet: "#tobedelivered_time_tpl" },
                        { title: "批次号", field: "batchNo" },
                        { title: "状态", field: "platOrderStatus", templet: "#tobedelivered_platOrderStatus_tpl" },
                        { title: "操作", toolbar: '#tobedelivered_detailTool', width: 70 }
                    ]
                ];
                return cols;
            },
            tableWatchbar: function() { //监听表格详情点击事件
                var _this = this;
                table.on('tool(tobedelivered_tableFilter)', function(obj) {
                    if (obj.event == 'detail') {
                        commonOrderDetailFn(obj.data);
                    } else if (obj.event == 'remark') {
                        commonDirectMailRemark(obj.data);
                    }
                });
            },
            //监听表格tr的点击[查看详情]
            watchTableTr: function () {
                $('#tobedeliveredCard .layui-table-main').on('click', 'td[data-field=platOrderStatus]', function (event) {
                    var $targetBtn = $(this).parents('tr').find('span[lay-event=detail]');
                    $targetBtn.trigger('click');
                    event.stopPropagation();
                    event.preventDefault();
                });
            },
            //获取站点接口
            getAllSiteAjax: function(platCode) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/enum/getSiteEnum.html',
                    params: {
                        platCode: platCode
                    }
                })
            },
            //详情日志接口
            getLogsAjax: function(orderId) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/orderlog/listorderlog.html',
                    params: {
                        orderId: orderId
                    }
                })
            },
            //#endregion 搜索+渲染表格end
        };
        //燕文截单
        tobedeliveredName.yanwenCutOrderFn();
        //平台操作
        tobedeliveredName.platOperateFeatures()
        //导出功能
        tobedeliveredName.exportDetails()
        // 拣货完成
        tobedeliveredName.pickCompleteHandle()
        // 驳回订单
        tobedeliveredName.rejectHandle()
        //扫描核单
        tobedeliveredName.scanHandle();
        //速卖通大包裹
        tobedeliveredName.bigPackageHandle();
        //Shopee快递交接单
        tobedeliveredName.shopeeHandoverSheetHandle();
        //lazada快递交接单
        tobedeliveredName.lazadaHandoverSheetHandle();
        //优选仓组包
        tobedeliveredName.optimizationSheetHandle();
        //AE全托管
        tobedeliveredName.aefullyhostedHandle();
        //AE半托管
        tobedeliveredName.aehalfhostedHandle();
        //时间
        tobedeliveredName.time();
        //渲染搜索条件
        tobedeliveredName.renderSearchItem();
        //平台和店铺,物流公司和物流方式联动
        tobedeliveredName.watchHandle();
        //更多查询条件
        tobedeliveredName.moreHandle();
        // 物流条件初始化
        tobedeliveredName.allLogisType({}).then(function(result) {
            commonRenderSelect('tobedelivered_logisTypeIds', result, { name: 'name', code: 'id' }).then(function() {
                formSelects.render('xm_tobedelivered_logisTypeIds');
            });
        })
        //表单搜索
        form.on('submit(tobedeliveredSearch)', function(data) {
            var data = data.field; //获取到表单提交对象
            var obj = tobedeliveredName.dataHandle(data);
            tobedeliveredName.tableRender(obj);
        });
        //点击全部触发搜索功能
        $('#tobedelivered-tabs').on('click', function () {
            $('[lay-filter=tobedeliveredSearch]').trigger('click');
        });
        //固定表头tobedeliveredCard
        UnifiedFixedFn('tobedeliveredCard');
        //打印功能
        //打印物流面单
        $('#tobedelivered_logisLi').on('click', function() {
            tobedeliveredName.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                var orderIdsArr = res.map(function(item) {
                    return item.id;
                });
                $.ajax({
                    type: "POST",
                    url: ctx + "/logistics/batch/print.html",
                    data: { orderIdStr: orderIdsArr.join() },
                    success:function (returnData){
                        var paramsMapList = returnData.successResults;
                        if (paramsMapList && paramsMapList.length > 0) {
                            // joom 平台的数据打印宽度需要是150，
                            if (orderIdsArr.filter(item => item.platCode == 'joom').length) {
                                var _result = returnData.successResults
                            } else {
                                var _result = returnData.successResults.map(item => {
                                    let _item = res.find(elem => elem.id == item.orderId)
                                    if (_item.platCode == 'joom') {
                                        item.width = 100
                                        item.height = 150
                                    }
                                    return item
                                })
                            }
                            for (var j = 0; j < _result.length; j++) {
                                packagePrint(returnData.successResults[j]);
                            }
                        }
                        if(returnData.failResults && returnData.failResults.length > 0){
                            let str = '';
                            returnData.failResults.forEach(item => {
                                str += item + "<br>"
                            })
                            layer.alert(str,{icon:2})
                        }
                    },error:function(err){
                        console.log(err)
                    }
                })
                // batchSheetSizeAjax(orderIdsArr.join()).then(function(result) {
                //     // joom 平台的数据打印宽度需要是150，
                //     if (orderIdsArr.filter(item => item.platCode == 'joom').length) {
                //         var _result = result
                //     } else {
                //         var _result = result.map(item => {
                //             let _item = res.find(elem => elem.id == item.orderId)
                //             if (_item.platCode == 'joom') {
                //                 item.width = 100
                //                 item.height = 150
                //             }
                //             return item
                //         })
                //     }
                //     for (var j = 0; j < _result.length; j++) {
                //         packagePrint(result[j]);
                //     }
                // }).catch(function(resErr) {
                //     layer.msg(resErr || resErr.message, { icon: 2 });
                // });
            }).catch(function(err) {
                layer.msg(err, { icon: 2 });
            });
        });
        //打印配货单
        $('#tobedelivered_setLi').on('click', function() {
            tobedeliveredName.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                var orderIdsArr = res.map(function(item) {
                    return item.id;
                });
                // let isNo = orderIdsArr.some((v)=>v == undefined)
                // if (isNo) {
                //     return layer.msg('没有批次号,没法打印啊', { icon: 2 });
                // }
                if (orderIdsArr.length == 0) {
                    return layer.msg('没有批次号,没法打印啊', { icon: 2 });
                }
                for (var i = 0; i < orderIdsArr.length; i++) {
                    printSortAjax(null,orderIdsArr[i]).then(function(objectData) {
                        //然后组装参数去调用打印接口
                        epeanPrint_plugin_fun(20, objectData);
                    })
                }

            }).catch(function(err) {
                layer.msg(err, { icon: 2 });
            });
        });
        //打印物流面单（含SKU）
        $('#tobedelivered_setlogisLi').on('click', function () {
            tobedeliveredName.getTableSelectIds('tobedelivered_tableId').then(function(res) {
                var orderIdsArr = res.map(function(item) {
                    return item.id;
                });
                const orderIdStr = orderIdsArr.join()
                commonReturnPromise({
                    url: `/lms/logistics/v1/batch/print/skuInfoAndLogistics`,
                    type: 'post',
                    params: {
                      orderIdStr: orderIdStr
                    }
                }).then(async returnData => {
                    function orderDataPrint(inntObj, sku) {
                    let obj = {}
                    obj.printType = 19
                    obj.labelUrl = inntObj.ftpLabelUrl
                    obj.width = inntObj.width
                    obj.height = inntObj.height
                    obj.printName = "100100"
                    if (obj.height === 150) {
                        obj.printName = "100150"
                    }
                    return obj
                    }

                    var resultSheet = returnData.successResults
                    let resultDataArr = [],
                    countIndex = 0
                    if (resultSheet && resultSheet.length > 0) {
                    for (var j = 0; j < resultSheet.length; j++) {
                        let resultDataObjOne = orderDataPrint(resultSheet[j])
                        resultDataArr.push(resultDataObjOne)
                    }
                    }
                    if (returnData.failResults && returnData.failResults.length > 0) {
                    let str = ""
                    returnData.failResults.forEach(item => {
                        str += item.orderId + ": " + item.ftpLabelUrl + "<br>"
                    })
                    layer.alert(str, { icon: 2 })
                    }
                    let timeset
                    timeset = window.setInterval(function () {
                    if (countIndex >= resultDataArr.length) {
                        window.clearInterval(timeset)
                    } else {
                        logistics_label_pdf_print(resultDataArr[countIndex])
                    }
                    countIndex++
                    }, 500)
                })
            }).catch(function(err) {
                layer.msg(err || err.message, { icon: 2 });
            });

        })
        // //批量获取PDF和尺寸
        // function batchSheetSizeAjax (orderIdStr) {
        //     return commonReturnPromise({
        //         url: '/lms/logistics/batch/print.html',
        //         params: {
        //             orderIdStr: orderIdStr
        //         }
        //     })
        // }
        //打印带有SKU的物流面单
        function batchOrderSkuLogis (orderIdStr) {
            return commonReturnPromise({
                url: '/lms/logistics/batch/print/skuLabel.html',
                params: {
                    orderIdStr: orderIdStr
                }
            })
        }
        //统一打印功能
        function packagePrint (data, sku) {
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = data.ftpLabelUrl;
                obj.width = data.width;
                obj.height = data.height;
                obj.printName = '100100';
                if (obj.height === 150) {
                    obj.printName = '100150'
                }
                logistics_label_pdf_print(obj);
        }
        //[多批次配货]打印请求
        function printSortAjax (batchNo, orderId) {
            let requestStr = {}
            if (orderId) {
                requestStr.orderId = orderId
            }else {
                requestStr.batchNo = batchNo
            }
            return commonReturnPromise({
                url: '/lms/pickpackorder/getpickbatchsku.html',
                params: requestStr
            })
        }

        $("button[name=orderConfig]").click(function(){
            let orderColumnState = toBedelivered_gridOptions.columnApi.getColumnState()
            window.localStorage.setItem("orderColumnState",JSON.stringify(orderColumnState))
            layer.msg("保存设置成功")
        })

        var immutableStore = [];
        var toBedelivered_gridOptions = {
            columnDefs: [{
                width: 60,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
            },
                {
                    headerName: '订单号',
                    field: '',
                    width: 180,
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data;
                        let tagsDom = '';
                    if (d.platTagList && d.platTagList.length>0) {
                        tagsDom = `
                                ${d.platTagList.map(item => {
                                    return `<span class="hp-badge" style="background:${item.color};width:auto; color:#fff;margin: 0 5px;padding:0 5px!important;">${item.tagName}</span>`
                                }).join('')}`;
                        };
                        // 重寄订单
                        let orderLabel = d.operOrderType == 3 ? '<span style="color:red">重寄</span>':''
                        // operOrderType 拆单合单：订单操作类型：0原始订单，1拆除订单，2合并订单
                        const operOrderTypeTag = d.operOrderType ==1 ? '<span class="hp-badge layui-bg-orange" title="拆出订单">拆</span>' : d.operOrderType ==2 ? '<span class="hp-badge layui-bg-orange" title="合并订单">合</span>' : d.operOrderType ==0 && d.operOriginId!="0" ? '<span class="hp-badge layui-bg-orange" title="拆单订单">拆</span>' : ''
                        // 店铺客服
                        const customServicerHtml = d.customServicer ? `[${d.customServicer}]` : ''
                        return `<div class="alignLeft">
                        <span class="pora copySpan">
                            <a>${d.id || ""}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <span>[${d.platCode}]</span>
                        ${orderLabel}
                        ${tagsDom}
                        ${operOrderTypeTag}	
                        <p id="toAudit_table_storeAcct">${d.storeAcct || ""}[${d.shopId || ""}]</p>
                        <p>[${d.salesPersons || ""}][${d.sellLeaderName || ""}]${customServicerHtml}</p>
                        <span class="pora copySpan">
                            <a id="toAudit_table_platOrderId">${d.platOrderId}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                        </span>
                        <p>${d.platOrderStatus || ""}</p>
                    </div>`
                    }
                },
                {
                    field: '',
                    // width: 300,
                    wrapText: true,
                    autoHeight: true,
                    headerName: '订单金额',
                    cellRenderer: (data) => {
                        let d = data.data, str = '';
                        let jsonData = JSON.stringify(d).replace("'", "");
                        jsonData = jsonData.replace(/</g, '&lt;')
                        jsonData = jsonData.replace(/>/g, '&gt;')
                        //利润计算逻辑
                        let profitCalculation = `<span data-text='${jsonData}' onmouseenter="tobedeliveredOrderProfitTipsShow(this)" onmouseleave="tobedeliveredOrderProfitTipsHide(this)">${d.profit || '0.00'}</span>`;
                        let fee = [d.platFee || 0, d.otherFee || 0].filter(i => i !=0);
                        if(d.logisApplyStatus==4&&d.logisApplyFailMsg){
                            str += `<div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">${d.logisApplyFailMsg||''}</div><div class="waitOrderErrorTipsClose">x</div></div>`
                        }
                        let amtDom = d.platShippingAmt ? `<span>(${d.platShippingAmt})</span>` : "";
                        str +=
                            `<div class="alignLeft">
                        <div><span class='gray'>${d.currency || ""}</span><span id="toAudit_table_platOrderAmt">${d.platOrderAmt || ""}</span>${amtDom}</div>
                        <div><span class="gray">平台费</span>${fee.join(' + ')}</div>
                        <div><span class="gray">商品成本(￥)</span>${d.prodCost} / ${d.costPrice}</div>
                        <div><span class="gray">物流成本(￥)</span>${d.shippingCost!==undefined ? d.shippingCost : "" }<button class="layui-btn layui-btn-xs" name="logisCost" style="cursor:pointer;">详</button></div>
                        <div><span class="gray">利润(￥)</span>${profitCalculation} <span class="gray">${(100 * d.profit / d.platOrderAmt / d.exchangeRate).toFixed(2)}%</span></div>
                    </div>`
                        return str
                    }
                },
                {
                    headerName: '商品',
                    width:180,
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        return `<div class="alignLeft">
                        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">${d.skuQuantity||""}</span></div>
                        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">${d.prodQuantity||""}</span></div>
                        <div><span class="gray">预估重(g)：</span><span>${d.preWeight}</span></div>
                        <div><span class="gray">称重(g)：</span><span>${d.realWeight}</span></div>
                        <div><span class="gray">计费重(g)：</span><span>${d.priceWeight}</span></div>
                    </div>`
                    }
                },
                {
                    headerName: '收件人',
                    field:"shippingCountryCnName",
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        const _buyerNote = d.buyerNote || ""
                        const _buyerNoteCopyHtml =`<a class="hidden">${_buyerNote}</a>`
                        return `<div class="alignLeft">
                        <div id="toAudit_table_shippingUsername">${d.shippingUsername||""}</div>
                        <div>[${d.shippingCountryCnName||""}]</div>
                        <div data-text="${_buyerNote}" onmouseenter="tobedeliveredBuyerTipsShow(this)" onmouseleave="tobedeliveredBuyerTipsHide(this)">
                            <span class="pora copySpan">
                                <span class="gray">留言：</span>${_buyerNote.slice(0, 46)}
                                ${_buyerNote?_buyerNoteCopyHtml:''}
                            </span>
                        </div>
                    </div>`
                    }
                },
                {
                    headerName: '物流',
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        let closeTimeHmtl = `<div><span class="gray">关单：</span>${Format(d.closeTime || "", 'yyyy-MM-dd hh:mm:ss')}<span class="${d.closeTimeDay < 4 ? 'plus-red-text':''}">(≤${d.closeTimeDay || '0'})</span></div>`
                        return `<div class="alignLeft">
                        <div><span class="gray">买家：</span><span id="toAudit_table_buyerRequireShippingType">${d.buyerRequireShippingType||""}</span></div>
                        <div><span class="gray">发货：</span><span id="logisTypeName_toAuditOrder">${d.logisTypeName||""}</span></div>
                        <div>
                            <span class="gray">跟踪号：</span>
                            <span class="pora copySpan">
                                <a>${d.logisTrackingNo||""}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this, event)">复制</button>
                            </span>
                            <image onclick="okk(${d.id})" src="${ctx}/static/img/print.png" width="20" lay-tips="打印预览"></image>
                        </div>
                        <div><span class="gray">状态：</span>${d.logisticsStatus||""}</div>
                        ${d.closeTime ? closeTimeHmtl : ''}
                    </div>`
                    }
                },
                {
                    headerName: '平台时间',
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        return `<div class="alignLeft">
                        <div><span class="gray">订单：</span><span id="toAudit_table_orderTimeCn">${Format(d.orderTimeCn || "", 'yyyy-MM-dd hh:mm:ss')}</span><span class="${d.orderDay>4?'plus-red-text':''}">(${d.orderDay || '0'})</span></div>
                        <div><span class="gray">申请：</span><span>${Format(d.logisApplyTime ||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">标记：</span><span>${Format(d.markShippingTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div><span class="gray">截止：</span><span>${Format(d.shipByDate||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                    </div>`
                    }
                },
                {
                    headerName: '订单处理',
                    // field:'platOrderStatus',
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        // let html = ''
                        // html += `<div class="alignLeft">
                        //     <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        //     <div><span class="gray">批次：</span>${d.orderLabel||""}</div>
                        //     <div><span class="gray">备注：</span>`
                        // // platOrderNotes 备注
                        // if(d.platOrderNotes && d.platOrderNotes.length > 1){
                        //     html += `<span lay-tips="12345678">多</span></div>
                        // </div>`
                        // }else{
                        //     html += `[${d.platOrderNotes[0].noteType||""}]${d.platOrderNotes[0].noteContent||""}</div>
                        // </div>`
                        // }


                        // 备注
                        let recentNoteContent = "";
                        if (
                          d.platOrderNotes &&
                          Array.isArray(d.platOrderNotes) &&
                          d.platOrderNotes.length
                        ) {
                          let noteContentLength = d.platOrderNotes.length;
                          recentNoteContent =
                            `<span data-text='${JSON.stringify(d.platOrderNotes)}' onmouseenter="tobedeliveredBuyerTipsShowTable(this)" onmouseleave="tobedeliveredBuyerTipsHide(this)">${d.platOrderNotes[noteContentLength - 1].noteType || ""}:${d.platOrderNotes[noteContentLength - 1].noteContent || ""}</span>`;
                        }
                        const noteTipsHtml = `<span class="hp-badge fr toBedelivered-noteContent-tag">多</span>`
                        let html = `<div class="alignLeft">
                        <div><span class="gray">仓库：</span>${d.warehouseName||""}</div>
                        <div><span class="gray">批次：</span>${d.batchNo||""}</div>
                        <div><span class="gray">组包：</span>${d.handoverBatchNo||""}</div>
                        <div><span class="gray">备注：</span>${recentNoteContent}${(d.platOrderNotes && d.platOrderNotes.length>1) ? noteTipsHtml : ''}</div>
                    </div>`
                        return html
                    }
                },
                {
                    headerName: '仓库处理',
                    width:172,
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data
                        return `<div class="alignLeft">
                        <div><span class="gray">批次：</span>${d.batchInfo||""}</div>
                        <div><span class="gray">配货：</span>${d.pickInfo||""}</div>
                        <div><span class="gray">投篮：</span>${d.checkInfo||""}</div>
                        <div><span class="gray">包装：</span>${d.packingInfo||""}</div>
                        <div><span class="gray">分拣：</span>${d.scanerInfo||""}</div>
                    </div>`
                    }
                },
                {
                    field: '操作',
                    width:100,
                    wrapText: true,
                    autoHeight: true,
                    cellRenderer: (data) => {
                        let d = data.data,
                            wishBtnDom = '', //wish取消
                            aeSkuTagDom= ''; //AE全托管SKU标签
                        if(d.platCode == "wish"){
                            wishBtnDom = $("#tobedelivered_btnPermTag_wish").html(); //wish取消
                        }
                        if(d.platCode == "AE全托管" || d.platCode == "AE半托管"){
                          aeSkuTagDom = $('#tobedelivered_aeSkuTagDom').html();
                        }
                        return `
				<button name="remark" class="layui-btn layui-btn-xs">备注</button><br>${wishBtnDom}${aeSkuTagDom}
                <!--<button name="edit" class="layui-btn layui-btn-xs disN">修改订单</button>-->`
                    }
                }
            ],
            rowData:immutableStore,
            getRowNodeId: function (data) {
                return data.id;
            },
            // rowModelType: 'serverSide', // 服务端
            defaultColDef: {
                resizable: true, //是否可以调整列大小，就是拖动改变列大小
            },
            suppressPaginationPanel: true, // 自定义分页
            rowSelection: 'multiple', // 设置多行选中
            suppressRowClickSelection: true,
            onGridReady: function (params) {
                toBedelivered_gridOptions.columnApi.applyColumnState({ state: JSON.parse(window.localStorage.getItem("orderColumnState")) });
                //表格创建完成后执行的事件
                params.api.sizeColumnsToFit(); //调整表格大小自适应
            },
            sideBar: {
                toolPanels: [{
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel'
                }],
            },
            onRowClicked: function (event) {
                // console.log(event)
            },
            //单击单元格触发的事件
            onCellClicked: function (event) {
                // console.log()
                //event.data 选中的行内数据，event.event 为鼠标事件
                handleTableOptions(event)
            },
            onCellMouseDown: function (event){
                timeStamp = event.event.timeStamp
            }
            // onRowDoubleClicked: function (event) {
            // console.log(event.data)
            //event.data 选中的行内数据，event.event 为鼠标事件
            //     let data = event.data;// 获取选中行数据
            //     commonOrderDetailFn(data)
            // },
        };

        var timeStamp;

        $(document).off("click",".waitOrderErrorTipsClose").on("click",".waitOrderErrorTipsClose",function(){
            $(this).parents('.waitOrderErrorTips').remove()
        })

        var gridDiv = document.querySelector('#tobedelivered_tableId');
        agGrid.LicenseManager.setLicenseKey(
            "IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");
        new agGrid.Grid(gridDiv, toBedelivered_gridOptions);

        function handleTableOptions(event){
            let optionEvent = event.event.target.name,
                data = event.data;// 获取选中行数据

            if (optionEvent == 'remark') {
                commonDirectMailRemark(data);
            }else if (optionEvent == "tobedelivered_wishBtn") {
                // wish退款
                originOrderWishRefund([data],'',function(){
                    $('[lay-filter=tobedeliveredSearch]').trigger('click');
                })
            }else if(optionEvent == 'tobedelivered_aeSkuTagBtn'){
              let orderIdStr = data.id;
              commonReturnPromise({
                url: '/lms/order/package/print/one.html',
                params: {
                  orderIdStr: orderIdStr,
                  onlyGoodsLable: true,
                  platCode: 'AE全托管'
                }
              }).then(res => {
                let data = res[0] || '';
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = data.ftpLabelUrl;
                obj.width = data.width;
                obj.height = data.height;
                obj.printName = obj.width.toString() + obj.height.toString();
                logistics_label_pdf_print(obj);
              });
            }else if(optionEvent === 'logisCost'){
              //物流成本
              commonLogisCostLayerHandle(data.id);
            }else if(event.event.timeStamp - timeStamp < 300) {
                commonOrderDetailFn(data, toBedelivered_gridOptions);
            }
        }

        tobedeliveredBuyerTipsShow = function(dom){
            const contentshow = $(dom).attr('data-text');
            if(contentshow){
                layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
                    tips: [1, '#fff'],
                    time: 0,
                });
            }
        }

        tobedeliveredBuyerTipsShowTable = function(dom){
          const contentshow = $(dom).attr("data-text");
          let contentJson = new Function(`return ${contentshow}`)();
          let tipsStr = (contentJson || []).map(item => {
            return `<tr>
                      <td>${item.creator}</td>
                      <td>${item.noteType}:${item.noteContent}</td>
                      <td>${Format(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</td>
                    </tr>`;
          }).join('');
          if (contentshow) {
            layui.layer.tips(
              `<table class="layui-table"><thead><tr><th>备注人</th><th>备注</th><th>备注时间</th></tr></thead><tbody>${tipsStr}</tbody></table>`,
              $(dom),
              {
                tips: [1, '#3595CC'],
                time: 0,
                maxWidth: '350px'
              }
            );
          }
        }

        tobedeliveredBuyerTipsHide = function(){
            layui.layer.closeAll("tips");
        }
        tobedeliveredOrderProfitTipsShow = function(dom){
            const datatext = $(dom).attr("data-text");
            let data = JSON.parse(datatext);
            let profit = (data.platOrderAmt - data.platFee - data.otherFee) * data.exchangeRate - data.prodCost - (data.outerPackCost || 0) - data.shippingCost;
            let contentshow = "利润 = (订单金额 - 平台佣金 - 税费) * 汇率 - 商品成本 - 外包装成本 - 运费<br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (" + data.platOrderAmt + " - " + data.platFee + " - " + data.otherFee + ") * " + data.exchangeRate
                + " - " + data.prodCost + " - " + (data.outerPackCost || 0) + " - " + data.shippingCost + "<br/>"
                + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= " + profit.toFixed(4);
            if(contentshow){
                layui.layer.tips(`<span style="color:#008B8B">${contentshow}</span>`, $(dom), {
                    tips: [1, '#fff'],
                    area: ['420px', 'auto'],
                    time: 0,
                });
            }
        }
        tobedeliveredOrderProfitTipsHide = function(){
            layui.layer.closeAll("tips");
        }
    });
})(jQuery, layui, window, document);