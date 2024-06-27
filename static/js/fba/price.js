;(function($,layui,window,document,undefined){
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            upload = layui.upload,
            formSelects = layui.formSelects,
            form = layui.form;
        form.render();
        var priceName = {
            //渲染表单数据
            renderDom: function(){
                var _this = this;
                var FBAListObjStr = sessionStorage.getItem('FBALIST_OBJ');
                if(!FBAListObjStr){
                    this.renderAjax().then(function(result){
                        //缓存数据
                        sessionStorage.setItem('FBALIST_OBJ', JSON.stringify(result));
                        var countryList = result.countryList || []; //国家
                        _this.strSplice(result);
                        //监听select
                        _this.watchCountry(countryList);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    })
                }else{
                    var FBAListObj = (new Function(`return  ${FBAListObjStr}`))();
                    _this.strSplice(FBAListObj);
                    //监听select
                    _this.watchCountry(FBAListObj.countryList || []);
                }
            },
            //长宽高重量等变化
            inputChg: function(){
                var $form = $('#fbaPriceForm');
                //长度单位英寸和厘米 1厘米=0.3937008英寸
                var lengthUnit = 0.3937008;
                var weightUnit = 0.0022046;
                $form.find('[name=lengthOfcm]').on('input', function(){
                    var $lVal = $.trim($(this).val());
                    var $lhVal = ($lVal*lengthUnit).toFixed(3);
                    $form.find('[name=length]').val($lhVal);
                    $(this).next('span').html(`${$lhVal}英寸`);
                });
                $form.find('[name=widthOfcm]').on('input', function(){
                    var $wVal = $.trim($(this).val());
                    var $whVal = ($wVal*lengthUnit).toFixed(3);
                    $form.find('[name=width]').val($whVal);
                    $(this).next('span').html(`${$whVal}英寸`);
                });
                $form.find('[name=heightOfcm]').on('input', function(){
                    var $hVal = $.trim($(this).val());
                    var $hhVal = ($hVal*lengthUnit).toFixed(3);
                    $form.find('[name=height]').val($hhVal);
                    $(this).next('span').html(`${$hhVal}英寸`);
                });
                //重量单位克和英镑转换 1克=0.0022046磅
                $form.find('[name=prodWeightOfg]').on('input', function(){
                    var $pVal = $.trim($(this).val());
                    var $phVal = ($pVal*weightUnit).toFixed(3);
                    $form.find('[name=prodWeight]').val($phVal);
                    $(this).next('span').html(`${$phVal}磅`);
                })
            },
            //表单数据ajax
            getAllCommisionCateRuleAjax: function(){
                return commonReturnPromise({
                    url: '/lms/fbaPricing/queryParams.html'
                })
            },
            //监听select变化
            watchCountry: function(countryList){
                var $form = $('#fbaPriceForm');
                form.on('select(fbaPrice_countryCode)', function(obj){
                    var code = obj.value;
                    (function(){ //切换币种汇率
                        var codeArr = countryList.filter(function(item){
                            return item.code == code;
                         });
                         var currency = codeArr[0].currency; //币种
                         var currencyRate = codeArr[0].currencyRate; //汇率
                         $form.find('[name=currency]').val(`${currency}`);
                         $form.find('[name=currencyShow]').val(`${currency}/${currencyRate}`);
                    })();
                    // (function(){//根据国家变化
                    //     var FBAListObjStr = sessionStorage.getItem('FBALIST_OBJ');
                    //     var FBAListObj = new Function(`return  ${FBAListObjStr}`)();
                    //     var cateNameObj = FBAListObj.cateNameList[0] || {}; //类目
                    //     //渲染类目
                    //     commonRenderSelect('fbaPrice_cate', cateNameObj[code] || {},{
                    //         name: 'cateName',
                    //         code: 'cateName'
                    //     }).then(function(){
                    //         form.render('select');
                    //     })
                    // })();
                    (function(){
                        commonReturnPromise({
                            url: '/lms/fbaPricing/getAllCommisionCateRule?siteId=' + code,
                            type: 'GET',
                        }).then(res => {
                            if(res){
                                commonRenderSelect(`fbaPrice_cate`, res, {
                                    name: 'ruleName',
                                    code: 'id'
                                }).then(() => {
                                    form.render('select')
                                })
                            }
                        })
                    })();
                    (function(){ //根据国家切换售价的符号
                        var $currencySymbol = $('#switchCurrencySymbol');
                        var currencyEnum = {
                            'DE': '€',
                            'GB': '£',
                            'US':'$'
                        };
                        $currencySymbol.text(currencyEnum[code]);
                    })();
                })
            },
            //渲染表单select
            strSplice: function(result){
                var fbaMonthList = result.fbaMonthList || []; //月份
                var countryList = result.countryList || []; //国家
                var logisAttrList = result.logisAttrList || []; //物流属性
                //渲染国家
                commonRenderSelect('fbaPrice_countryCode', countryList, {
                    name: 'name',
                    code: 'code'
                })
                //渲染月份
                commonRenderSelect('fbaPrice_month', fbaMonthList, {
                    name: 'name',
                    code: 'name'
                });
                //渲染物流属性
                commonRenderSelect('fbaPrice_logisAttr', logisAttrList, {
                    name: 'name',
                    code: 'name'
                });
                form.render('select');
            },
            //tips
            showTips: function(){
                $('.fabPrice_monthWarehouseCharge').on('mouseenter',function(){
                    var tipsStr = $(this).data('tips');
                    layer.tips(tipsStr, $(this), {
                        tips: [1, '#0FA6D8'], //还可配置颜色
                        time: 0
                    });
                });
                $('.fabPrice_monthWarehouseCharge').on('mouseleave',function(){
                    layer.closeAll();
                });
            },
            //渲染表格
            tableRender: function(data){
                var _this = this;
                this.tableAjax(data).then(function(result){
                    var getTpl = fbaPriceTableContainerTpl.innerHTML,
                    view = document.getElementById('fbaPriceTableContainer');
                    laytpl(getTpl).render(result, function(html){
                        view.innerHTML = html;
                        //tips
                        _this.showTips();
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            },
            //表格ajax
            tableAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/fbaPricing/getPricingInfo.html',
                    params: obj
                })
            },
            //表单数据ajax
            renderAjax: function(){
                return commonReturnPromise({
                    url: '/lms/fbaPricing/queryParams.html'
                })
            }
        };
        //初始化渲染
        priceName.renderDom();
        //变化联动
        priceName.inputChg();
        //表单请求
        form.on('submit(fbaPrice_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            let newobj = JSON.parse(JSON.stringify(data));
            delete newobj.fbaPlatCommisionRuleId
            var valArr = Object.values(newobj);
            var emptyArr = valArr.filter(function(item){
                return !item
            });
            if(emptyArr.length){
                return layer.msg('除佣金分类名称以外，其余所有必填!',{icon:2});
            }
            if(data.countryCode == 'US'){
                if(Number(data.lengthOfcm)<1 || Number(data.widthOfcm)<1 || Number(data.heightOfcm)<1){
                    return layer.msg('长宽高需都大于1!',{icon:2});
                }
            }
            if(Number(data.lengthOfcm) < Number(data.widthOfcm) || Number(data.lengthOfcm) < Number(data.heightOfcm) || Number(data.widthOfcm) < Number(data.heightOfcm)){
                return layer.msg('长宽高需满足条件:长>=宽>=高!',{icon:2});
            }
            priceName.tableRender(data);
        });
    });//layui结束
})($,layui,window,document);