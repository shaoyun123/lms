/**
 * @author zhangtt
 * @time M7-7 14:30
 */
;(function(){
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
        var setpriceName= {
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#setprice_table',
                    method: 'post',
                    url: '/lms/winitPricing/getPricingInfo.html',
                    where:  data,
                    page: true,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "setprice_tableId",
                    cols: [
                        [
                            {title: '头程物流', field: 'headWayLogistics'},
                            {title: '尾程物流', field: 'tailWayLogistics'},
                            {title: '计费重(g)', field: 'chargeWeight', width: 66},
                            {title: '头程运费(￥)', field: 'headWayShipping',templet: '#setprice_headWayShipping', width: 86},
                            {title: '尾程运费(￥)', field: 'tailWayShipping', templet: '#setprice_tailWayShipping', width: 86},
                            {title: '仓库费用和', field: 'warehouseFee', templet: '#setprice_warehouseFee', width: 110},
                            {title: 'VAT(含关税)', field: 'vatAndTariff', templet: '#setprice_vatAndTariff', width: 110},
                            {title: '预估定价', field: 'estimatePrice', templet: '#setprice_estimatePrice', width: 110},
                            {title: '预估毛利(￥)', field: 'estimateGrossPrice', templet: '#setprice_estimateGrossPrice', width: 86},
                            {title: `<div class="setprice_header">设置定价<input type="number" class="layui-input" id="setprice_batch"/><span class="layui-btn layui-btn-sm" id="setprice_application">应用</span></div>`, field: 'price', templet: '#setprice_price', width: 184},
                            {title: '操作', toolbar: '#setprice_toolBar',width: 80},
                            {title: '预估毛利率', field: 'estimate',width: 120}
                        ]
                    ],
                    done: function(){
                        _this.watchBar();
                        _this.batchSetPrice();
                    }
                });
            },
            watchBar: function(){
                var _this = this;
                table.on('tool(setprice_tableFilter)',function(obj){
                    var data = obj.data;
                    if(obj.event == 'computed'){ //计算毛利率
                        var $td = $(this).parents('td');
                        var $input = $td.prev().find('input[name=setprice]');
                        var $val = $input.val();
                        var $div = $td.next().find('div');
                        if(!$val){
                            return layer.msg('请先输入定价!',{icon:7});
                        }
                        var ajaxObj = {
                            currency: data.currency,
                            headWayShipping: data.headWayShipping,
                            platRate: data.platRate,
                            prodCost: data.prodCost,
                            tailWayShipping: data.tailWayShipping,
                            vatAndTariff: data.vatAndTariff,
                            warehouseFee: data.warehouseFee,
                            pricing: $val
                        };
                        _this.computeAjax(ajaxObj).then(function(result){
                            $div.html(`<strong><font size="4">${result.toFixed(2)}</font></strong>`);
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }
                });
            },
            //批量设置定价
            batchSetPrice:function(){
                $('#setprice_application').on('click', function(){
                    var $thInput = $(this).prev();
                    var $val = $thInput.val();
                    var $tbody = $(this).parents('.layui-table-header').next();
                    var $tdList = $tbody.find('td[data-field=price]');
                    for(var i=0; i< $tdList.length; i++){
                        var tdItem = $tdList[i];
                        var $tdInput = $(tdItem).find('input[name=setprice]');
                        $tdInput.val($val);
                    }
                })
            },
            //ajax请求
            //获取仓库和属性的枚举
            getAllAjax: function(){
                return commonReturnPromise({
                    url: '/lms/winitPricing/queryParams.html'
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
            }
        }
        //默认渲染仓库,物流属性
        setpriceName.getAllAjax().then(function(result){
            var warehouseArr = result.winitWarehouses; //万邑通仓库
            var logisAttrList = result.logisAttrList;//物流属性
            commonRenderSelect('setprice_warehouse',warehouseArr, {
                name:'name',
                code: 'id'
            });
            commonRenderSelect('setprice_logisticAttr',logisAttrList, {
                name:'name',
                code: 'name'
            });
            form.render('select');
        });
        //表单搜索事件
        form.on('submit(setprice_submit)', function(data){
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
            setpriceName.tableRender(data);
        });
        //悬浮展示仓库费用
        //悬浮显示表格
        $('body').on('mouseover', '.setprice_warehouseFeeDetail', function(){
            var _this = this;
            var data = JSON.parse($(_this).next().val());
            var $div = `
                <div>
                    <div>入库处理费${data.currency}:${data.inboundFee}</div>
                    <div>出库处理费${data.currency}:${data.outboundFee}</div>
                    <div>应急附加费${data.currency}:${data.emergencyExtraFee}</div>
                </div>
            `
            layer.tips($div,_this,{tips: [1,'#fd757f'],time:10000,area:['250px']});
        });
        $('body').on('mouseleave', '.setprice_warehouseFeeDetail', function(){
            layer.close(layer.tips());
        })
    });
})();