/**
 * @author zhangtt
 * @time M7-7 14:30
 */
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            upload = layui.upload,
            form = layui.form;
        form.render();
        var setpriceCopyName= {
            tableRender:function(data){
                var _this = this;
                this.tableAjax(data)
                    .then(function(result){
                        var getTpl = setpriceCopy_tablesTpl.innerHTML,
                        view = document.getElementById('setpriceCopy_tables');
                        laytpl(getTpl).render(result, function(html){
                            view.innerHTML = html;
                            _this.headComputed();
                            _this.tailComputed();
                        });
                    })
                    .catch(function(err){
                        layer.msg(err,{icon:2});
                    });
            },
            //计算头程毛利率
            headComputed: function(){
                var _this = this;
                $('#setpriceCopy_body').on('click', '.setpriceCopy_computed', function(){
                    var $tr = $(this).parents('tr');
                    var $td = $(this).parents('td');
                    var $input = $td.prev().find('input[name=setpriceCopy]');
                    var $val = $input.val();
                    var $div = $td.next().find('div');
                    if(!$val){
                        return layer.msg('请先输入定价!',{icon:7});
                    }
                    var ajaxObj = {
                        currency: $tr.find('[name=currency]').val(),
                        headWayShipping: $tr.find('[name=headWayShipping]').val(),
                        platRate: $tr.find('[name=platRate]').val(),
                        prodCost: $tr.find('[name=prodCost]').val(),
                        tailWayShipping: $tr.find('[name=tailWayShipping]').val(),
                        vatAndTariff: $tr.find('[name=vatAndTariff]').val(),
                        warehouseFee: $tr.find('[name=warehouseFee]').val(),
                        pricing: $val
                    };
                    _this.computeAjax(ajaxObj).then(function(result){
                        $div.html(`<strong><font size="4">${result.toFixed(2)}</font></strong>`);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                });
            },
            //计算尾程毛利率
            tailComputed: function(){
                var _this = this;
                $('#setpriceCopy_body').on('click', '.setpriceCopy_tailComputed', function(){
                    var $tr = $(this).parents('tr');
                    var $td = $(this).parents('td');
                    var $input = $td.prev().find('input[name=setpriceTailCopy]');
                    var $val = $input.val();
                    var $div = $td.next().find('div');
                    if(!$val){
                        return layer.msg('请先输入定价!',{icon:7});
                    }
                    var ajaxObj = {
                        currency: $tr.find('[name=currency]').val(),
                        platRate: $tr.find('[name=platRate]').val(),
                        avgCost: $tr.find('[name=avgCost]').val(),
                        tailWayShipping: $tr.find('[name=tailWayShipping]').val(),
                        warehouseFee: $tr.find('[name=warehouseFee]').val(),
                        pricing: $val
                    };
                    _this.computeTailAjax(ajaxObj).then(function(result){
                        $div.html(`<strong><font size="4">${result.toFixed(2)}</font></strong>`);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                });
            },
            //批量设置定价
            batchSetPrice:function(){
                $('#setpriceCopy_application').on('click', function(){
                    var $thInput = $(this).prev();
                    var $val = $thInput.val();
                    var $tbody = $(this).parents('.layui-table-header').next();
                    var $tdList = $tbody.find('td[data-field=price]');
                    for(var i=0; i< $tdList.length; i++){
                        var tdItem = $tdList[i];
                        var $tdInput = $(tdItem).find('input[name=setpriceCopy]');
                        $tdInput.val($val);
                    }
                })
            },
            //ajax请求
            //获取表格数据
            tableAjax: function(data){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/winitPricing/getPricingInfo.html',
                    params: data
                });
            },
            //计算毛利率请求
            computeAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/winitPricing/calculateEstimateGrossRate.html',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                });
            },
            //计算尾程毛利率
            computeTailAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/winitPricing/calculateTailEstimateGrossRate.html',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                });
            }
        }
        //表单搜索事件
        form.on('submit(setpriceCopy_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            if(!data.warehouseId){
                return layer.msg('仓库必选!',{icon:5});
            }
            if(!data.logisAttr){
                return layer.msg('物流属性必选!',{icon:5});
            }
            if(!data.prodCost){
                return layer.msg('商品成本必填!',{icon:5});
            }
            if(!data.prodWeight){
                return layer.msg('商品重量必填!',{icon:5});
            }
            if(!data.wrapLength){
                return layer.msg('包裹长必填!',{icon:5});
            }
            if(!data.wrapWidth){
                return layer.msg('包裹宽必填!',{icon:5});
            }
            if(!data.wrapHeight){
                return layer.msg('包裹高必填!',{icon:5});
            }
            if(!data.platRate){
                return layer.msg('平台抽成必填!',{icon:5});
            }
            if(!data.grossProfitRate){
                return layer.msg('毛利率必填!',{icon:5});
            }
            setpriceCopyName.tableRender(data);
        });
        //悬浮展示仓库费用
        //悬浮显示表格
        $('body').on('mouseover', '.setpriceCopy_warehouseFeeDetail', function(){
            var _this = this;
            var data = JSON.parse($(_this).next().val());
            if(data.inboundFee){
                var $div = `
                <div>
                    <div>入库处理费${data.currency}:${data.inboundFee}</div>
                    <div>出库处理费${data.currency}:${data.outboundFee}</div>
                    <div>应急附加费${data.currency}:${data.emergencyExtraFee}</div>
                </div>
                `;
            }else{
                var $div = `
                <div>
                    <div>出库处理费${data.currency}:${data.outboundFee}</div>
                    <div>应急附加费${data.currency}:${data.emergencyExtraFee}</div>
                </div>
                `;
            }
            layer.tips($div,_this,{tips: [1,'#fd757f'],time:10000,area:['250px']});
        });
        $('body').on('mouseleave', '.setpriceCopy_warehouseFeeDetail', function(){
            layer.close(layer.tips());
        });
    });