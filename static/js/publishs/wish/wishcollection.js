/*
 * @Author: ztao
 * @Date: 2021-10-18 16:28:24
 * @LastEditTime: 2021-10-21 19:52:43
 * @Description: wish采集
 */
;
(function($, layui, window, document, undefined) {
    layui.use(['admin', 'table', 'form', 'layer', 'formSelects', 'laytpl', 'element', 'laydate', 'upload'], function() {
        var admin = layui.admin,
            table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            formSelects = layui.formSelects,
            laydate = layui.laydate,
            element = layui.element,
            upload = layui.upload,
            form = layui.form;
        render_hp_orgs_users("#wishcollectionSearchForm"); //渲染部门销售员店铺三级联动
        //命名空间
        let wishcollectionName = {
            //采集人接口
            collectorAjax: function() {
                return commonReturnPromise({
                    url: '/lms/wishCollectionListingController/creatorList'
                });
            },
            //渲染采集人
            renderCollector: function() {
                this.collectorAjax().then(res => {
                    commonRenderSelect('wishcollection_creatorId', res, { name: 'creator', code: 'creatorId' }).then(function() {
                        form.render('select');
                    });
                })
            },
            //渲染时间
            renderTime: function() {
                laydate.render({
                    elem: "#wishcollection_collectionStartTime",
                    type: "date",
                });
                laydate.render({
                    elem: "#wishcollection_collectionEndTime",
                    type: "date",
                });
            },
            //搜索的数据处理
            dataHandle: function(data) {
                if (data.skuType == 'sku') {
                    data.sku = data.skuvalue;
                } else {
                    data.pSku = data.skuvalue;
                }
                // if (data.storeAcctId == '') {
                //     let $opts = $('#wishcollection_store_sel>option');
                //     let idArr = [];
                //     for (let i = 0; i < $opts.length; i++) {
                //         let val = $($opts[i]).attr('value');
                //         if (val != '') {
                //             idArr.push(val);
                //         }
                //     };
                //     data.storeAcctId = idArr.join(',');
                // }
                delete data.skuType;
                delete data.skuvalue;
                return data;
            },
            //渲染表格
            tableRender: function(data) {
                let _this = this;
                table.render({
                    elem: "#wishcollection-table",
                    id: "wishcollection-tableId",
                    method: "POST",
                    contentType: 'application/json',
                    where: data,
                    url: "/lms/wishCollectionListingController/list",
                    cols: _this.colsHandle(),
                    page: true,
                    limit: 300,
                    limits: [300, 500, 1000],
                    done: function(res) {
                        imageLazyload();
                        //tab的数量展示
                        let count = res.data ? res.data.length : 0;
                        $('#wishcollection-tabs').find('li>span').html('');
                        $('#wishcollection-tabs').find('li.layui-this>span').html(`(${count})`);
                    }
                });
            },
            colsHandle: function() {
                let cols = [
                    [{
                        type: 'checkbox',
                        width: 60
                    }, {
                        title: "缩略图",
                        field: "mainImageUrl",
                        templet: "#wishcollection-mainImageUrl",
                        width: 70
                    }, {
                        title: "标题",
                        field: "productName",
                        width: '30%'
                    }, {
                        title: "父SKU",
                        field: "psku",
                        width: '7%',
                        templet: '#wishcollection-psku'
                    }, {
                        field: 'detail',
                        width: 420,
                        title: `<div style='width:120px;float: left;'>子SKU</div>
                            <div style='width:60px;float: left;'>颜色</div>
                            <div style='width:60px;float: left;'>尺寸</div>
                            <div style='width:80px;float: left;'>售价(¥)</div>
                            <div style='width:80px;float: left;'>运费(¥)</div>`,
                        style: "vertical-align: top;",
                        templet: '#wishcollection-skuDetail'
                    }, {
                        title: '采集人',
                        field: 'creator',
                    }, {
                        title: '采集时间',
                        field: 'createTime',
                        templet: '<div>{{Format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'
                    }]
                ];
                return cols;
            },
            //页签操作
            tabHandle: function() {
                let _this = this;
                element.on('tab(wishcollection-tabs)', function() {
                    let status = $(this).attr('data-status');
                    _this.btnHandle(status);
                    $('#wishcollectionSearchForm').find('[name=listingStatus]').val(status);
                    $('[lay-filter=wishcollection_filter]').trigger('click');
                });
            },
            //接口--生成店铺商品
            generateProductAjax: function(obj) {
                return commonReturnPromise({
                    url: '/lms/wishCollectionListingController/addStoreProds',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify(obj)
                });
            },
            //生成店铺按钮事件
            genereteHandle: function() {
                let _this = this;
                $('#wishcollection-generateProduct').on('click', function() {
                    commonTableCksSelected('wishcollection-tableId').then(res => {
                        let storeAcctId = res[0]['storeAcctId'] || '';
                        let sIdLists = res.map(function(item) {
                            return item.slist;
                        });
                        let sIdList = sIdLists.flat().map(function(item) {
                            return item.id;
                        });
                        _this.generateProductAjax({
                            storeAcctId: storeAcctId,
                            sIdList: sIdList
                        }).then(function() {
                            layer.msg('生成店铺商品成功', { icon: 1 });
                            $('[lay-filter=wishcollection_filter]').trigger('click');
                        }).catch(proErr => {
                            layer.msg(proErr, { icon: 2 });
                        });
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                });
            },
            //接口--批量删除商品
            batchDeleteAjax: function (idArr) {
                return commonReturnPromise({
                    url: '/lms/wishCollectionListingController/deleteByIdList',
                    type: 'delete',
                    contentType: 'application/json',
                    params: JSON.stringify(idArr)
                });
            },
            //批量删除事件
            batchDeleteHandle: function () {
                let _this = this;
                $('#wishcollection-batchDelete').on('click', function() {
                    commonTableCksSelected('wishcollection-tableId').then(res => {
                        let idLists = res.map(function(item) {
                            return item.id;
                        });
                        layer.confirm('确定删除指定的商品吗?', {icon: 3, title:'提示'}, function(index){
                            _this.batchDeleteAjax(idLists).then(function() {
                                layer.msg('删除店铺商品成功', { icon: 1 });
                                layer.close(index);
                                $('[lay-filter=wishcollection_filter]').trigger('click');
                            }).catch(proErr => {
                                layer.msg(proErr, { icon: 2 });
                            });
                          });
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                });
            },
            //导入采集
            importHandle: function() {
                upload.render({
                    elem: '#wishcollection-import', //绑定元素
                    accept: 'file',
                    exts: 'xls',
                    url: ctx + '/wishCollectionListingController/import', //上传接口
                    field: 'multipartFile',
                    before: function() {
                        loading.show();
                    },
                    done: function(res) {
                        loading.hide();
                        if (res.code == '9999') {
                            layer.msg(res.msg || '导入失败', { icon: 2 });
                        } else {
                            layer.msg(res.msg || '导入成功', { icon: 1 });
                            $('[lay-filter=wishcollection_filter]').trigger('click');
                        }
                    },
                    error: function(err) {
                        loading.hide();
                        layer.msg("服务器正忙");
                    }
                });
            },
            //接口---删除商品
            delProductAjax: function(obj) {
                return commonReturnPromise({
                    url: '/lms/wishCollectionListingController/deleteByIdList',
                    contentType: 'application/json',
                    type: 'delete',
                    params: JSON.stringify(obj)
                });
            },
            //删除按钮事件
            delHandle: function() {
                let _this = this;
                $('#wishcollection-delProduct').on('click', function() {
                    commonTableCksSelected('wishcollection-tableId').then(res => {
                        let sIdList = res.map(function(item) {
                            return item.id;
                        });
                        _this.delProductAjax(sIdList).then(function() {
                            layer.msg('删除店铺商品成功', { icon: 1 });
                            $('[lay-filter=wishcollection_filter]').trigger('click');
                        }).catch(proErr => {
                            layer.msg(proErr, { icon: 2 });
                        });
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                });
            },
            //接口---详情
            detailAjax: function(storeAcctId, id) {
                return commonReturnPromise({
                    url: `/lms/wishCollectionListingController/${storeAcctId}/${id}`
                });
            },
            //详情操作
            detailHandle: function() {
                let _this = this;
                $('#wishcollectionCard').on('click', '.wishcollection-pskuBtn', function() {
                    let id = $(this).attr('data-id');
                    let storeAcctId = $(this).attr('data-storeAcctId');
                    _this.detailAjax(storeAcctId, id).then(res => {
                        _this.layerHandle(res);
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                })
            },
            layerHandle: function(data) {
                layer.open({
                    type: 1,
                    title: '详情',
                    content: $('#wishcollection-skuDetailLayer').html(),
                    area: ['80%', '80%'],
                    btn: ['保存', '关闭'],
                    success: function(layero) {
                        var getTpl = $('#wishcollection-skuDetailLayerTpl').html(),
                            view = document.getElementById('wishcollection-skuDetailLayerContainer');
                        laytpl(getTpl).render(data, function(html) {
                            view.innerHTML = html;
                            $('#wishcollection-skuDetailLayerContainer #prodWishTagsNum').text($('input[name="tag"]').val().split(',').length);
                            $('#wishcollection-skuDetailLayerContainer input[data-role="tagsinput"]').tagsinput();
                        });
                    },
                    yes: function (index, layero) {
                        var trs = layero.find('#wishcollection-skuDetailLayer_tbody tr');
                        var trArr = [];
                        for (var i = 0; i < trs.length; i++){
                            var tr = trs[i];
                            var id = $(tr).attr('data-id');
                            var oaSize = $(tr).find('input[name=oaSize]').val();
                            var oaPrice = $(tr).find('input[name=oaPrice]').val();
                            trArr.push({
                                id,
                                oaSize,
                                oaPrice
                            });
                        }
                        commonReturnPromise({
                            url: '/lms/wishCollectionListingController/editPageSave',
                            type: 'post',
                            contentType: 'application/json',
                            params: JSON.stringify(trArr)
                        }).then(res => {
                            layer.msg(res || '保存成功', { icon: 1 });
                            layer.close(index);
                            $('[lay-filter=wishcollection_filter]').trigger('click');
                        }).catch(err => {
                            layer.msg(err, { icon: 2 });
                        })
                    }
                });
            },
            //接口---立即刊登
            immediatelyAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/wishlisting/publishListing.html',
                    params: obj
                });
            },
            //立即刊登操作
            immediatelyHandle: function() {
                let _this = this;
                $('#wishcollection-immediatelyPublish').on('click', function() {
                    commonTableCksSelected('wishcollection-tableId').then(res => {
                        let sIdList = res.map(function(item) {
                            return item.listingId;
                        });
                        for (let i = 0; i < res.length; i++) {
                            let item = res[i];
                            if (!item.existListing) {
                                return layer.alert(`${item.psku}产品不能刊登，请先生成店铺商品`, { icon: 7 });
                            }
                        }
                        _this.immediatelyAjax({
                            ids: sIdList.join(','),
                            singleReListingSub: false,
                            listingStatus: 0
                        }).then(function() {
                            layer.msg('立即刊登商品成功', { icon: 1 });
                            $('[lay-filter=wishcollection_filter]').trigger('click');
                        }).catch(proErr => {
                            layer.msg(proErr, { icon: 2 });
                        });
                    }).catch(err => {
                        layer.msg(err, { icon: 2 });
                    })
                });
            },
            //操作按钮的隐藏和展示
            btnHandle: function(status) {
                //采集商品-2,生成店铺商品和导入采集
                if (status == -2) {
                    $('#wishcollection-generateProduct').removeClass('disN');
                    $('#wishcollection-import').removeClass('disN');
                    $('#wishcollection-delProduct').addClass('disN');
                    $('#wishcollection-immediatelyPublish').removeClass('disN');
                    $('#wishcollection-batchDelete').removeClass('disN');
                }
                //
                //刊登成功1,刊登中3什么都不执行
                if (status == 1 || status == 3) {
                    $('#wishcollection-generateProduct').addClass('disN');
                    $('#wishcollection-import').addClass('disN');
                    $('#wishcollection-delProduct').addClass('disN');
                    $('#wishcollection-immediatelyPublish').addClass('disN');
                    $('#wishcollection-batchDelete').addClass('disN');
                }
                //刊登失败2,执行删除
                if (status == 2) {
                    $('#wishcollection-generateProduct').addClass('disN');
                    $('#wishcollection-import').addClass('disN');
                    $('#wishcollection-delProduct').removeClass('disN');
                    $('#wishcollection-immediatelyPublish').addClass('disN');
                    $('#wishcollection-batchDelete').addClass('disN');
                }
            },
        };
        //操作按钮的隐藏和展示
        wishcollectionName.btnHandle();
        //立即刊登事件
        wishcollectionName.immediatelyHandle();
        //点击查看详情
        wishcollectionName.detailHandle();
        //导入采集
        wishcollectionName.importHandle();
        //生成店铺商品点击事件
        wishcollectionName.genereteHandle();
        //删除店铺商品点击事件
        wishcollectionName.delHandle();
        //渲染采集人
        wishcollectionName.renderCollector();
        //渲染时间
        wishcollectionName.renderTime();
        //tab操作
        wishcollectionName.tabHandle();
        //批量删除
        wishcollectionName.batchDeleteHandle();
        //表单提交事件
        form.on("submit(wishcollection_filter)", function(data) {
            var data = data.field; //获取到表单提交对象
            var obj = wishcollectionName.dataHandle(data);
            if (obj.storeAcctId == '') {
                return layer.msg('请选择店铺', { icon: 7 });
            }
            wishcollectionName.tableRender(obj);
        });
        //表头固定
        // UnifiedFixedFn('wishcollectionCard');
    });
})($, layui, window, document);

function wishcollection_changeColspantable(obj,length) {
    $(obj).prev().find(".myj-hide").toggle();
    var str = $(obj).html();
    if (str.indexOf("展开") > -1) {
        $(obj).html(`- 收起${length}`);
    } else {
        $(obj).html(`+ 展开${length}`);
    }
}