/**
 * Created by huangpeng on 2018-09-21.
 * 首页 小工具js
 */
let _layerX
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate", "element", 'formSelects','upload'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    $('#index1_queryStoreSkuPopBtn').click(function() {
        var index = layer.open({
            type: 1,
            title: "查询店铺sku",
            area: ["80%", "70%"],
            shadeClose: false,
            content: $("#index1_store_sku_pop").html(),
            btn: ['关闭'],
            success: function(layero, index) {
                form.render('select');
                form.render('radio');
                form.render('checkbox');
                var skuType = $('#queryStoreSkuSearchForm_index1 [name=skuType]').val()
                $('.index1_search_store_sku').searchGroup({
                    input: 'sku'
                });
                form.on('radio(skuType_index1)', function(data) {
                    skuType = data.value
                });

                // 绑定查询事件
                $('#queryStoreSkuSearchForm_index1 #searchStoreSkuBtn_index').click(function() {
                    var Adata = {
                        skuType: skuType,
                        sku: $('#queryStoreSkuSearchForm_index1 [name=sku]').val(),
                        platCode: $('#queryStoreSkuSearchForm_index1 [name=platCode]').val(),
                        ifOnlySelf: $('#queryStoreSkuSearchForm_index1 [name=ifOnlySelf]').prop('checked') ? '1' : '0',
                        ifOnlySysGen: $('#queryStoreSkuSearchForm_index1 [name=ifOnlySysGen]').prop('checked') ? '1' : '0'
                    }
                    checkNull(Adata)
                    var ajax = new Ajax()
                    ajax.post({
                        url: ctx + "/prodSSkuMapping/queryStoreSku.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(res) {
                            if (res.code == '0000') {
                                if (Adata.platCode == 'ebay' && Adata.ifOnlySysGen == '1') {
                                    var storeSkuList = res.data
                                    var toshowList = []
                                    var patt = /EB[\s\S]+/
                                    for (var i in storeSkuList) {
                                        if (patt.test(storeSkuList[i])) {
                                            toshowList.push(storeSkuList[i])
                                        }
                                    }
                                    var skuStr = toshowList.join(',')
                                    $('#queryStoreSkuSearchForm_index1 [name=storeSku]').val(skuStr)
                                } else {
                                    var skuStr = res.data.join(',')
                                    $('#queryStoreSkuSearchForm_index1 [name=storeSku]').val(skuStr)
                                }
                            }
                        }
                    })

                })
            }
        })

    });
    $('#index1_createUCP_EAN').click(function() {
        var index = layer.open({
            type: 1,
            title: "UCP&EAN生成器",
            area: ["60%", "70%"],
            shadeClose: false,
            content: $("#index1_UCP_EANcreator").html(),
            btn: ['关闭'],
            success: function(layero, index) {
                var codeType = $('select[name="codeType"]').val();
                var siteType = "";
                form.render('select');
                form.on('select(codeType)', function(data) {
                    codeType = data.value;
                    $('#codetextarea').val('');
                });
                $('#createCode').click(function() {
                    if (codeType) {
                        if (codeType == "0") {
                            var finnalupc = "";
                            for (var i = 0; i < 100; i++) {
                                var qi = '608',
                                    pro = makeRandomNum(3),
                                    p = makeRandomNum(5);
                                var strCodelong = qi.toString() + pro.toString() + p.toString();
                                var upc = getUPCCode(strCodelong) + "\n";
                                finnalupc += upc;
                            }
                            $('#codetextarea').val(finnalupc);
                        } else if (codeType == "1") {
                            var finnalupc = "";
                            for (var i = 0; i < 100; i++) {
                                var qi = parseInt(Math.random() * 2 + 6),
                                    pro = makeRandomNum(5),
                                    p = makeRandomNum(5);
                                var strCodelong = qi.toString() + pro.toString() + p.toString();
                                var upc = getUPCCode(strCodelong) + "\n";
                                finnalupc += upc;
                            }
                            $('#codetextarea').val(finnalupc);
                        } else {
                            var finnalean = ""
                            for (var i = 0; i < 100; i++) {
                                var qi = '69' + parseInt(Math.random() * 6 + 0),
                                    pro = makeRandomNum(4),
                                    p = makeRandomNum(5);
                                var strCodelong = qi.toString() + pro.toString() + p.toString();
                                var ean = getEANCode(strCodelong) + "\n";
                                finnalean += ean;
                            }
                            $('#codetextarea').val(finnalean);
                        }
                    }
                    return false;
                });
            }
        })

    });
    form.verify({
        //value：表单的值、item：表单的DOM对象
        mustCheckOne: function(value, item) { //同层级的checkbox必须选一个
            var iii = $(item);
            if (iii.parent().find("input[type=checkbox]:checked").size() > 0) {
                return;
            }
            return '必填项不能为空';
        },
        integer: function(value, item) { //input内容必须是整数
            if (/^\d+$/.test(value)) {
                return;
            }
            return '必须填入整数';
        }
    });

    //生成随机数
    function makeRandomNum(count) {
        var a = '';
        for (var i = 0; i < count; i++) {
            a += parseInt(Math.random() * (9 - 0 + 1) + 0);
        }
        return a;
    }

    function getUPCCode(strCode) //71000155555+x
    {
        var oddValue = 0; //将所有奇数位置（第1、3、5、7、9和11位）上的数字相加。
        var evenValue = 0; //将所有偶数位置（第2、4、6、8和10位）上的数字相加。

        for (var i = 0; i < strCode.length; i++) {
            if (i % 2 == 0) oddValue += parseInt(strCode[i]);
            else evenValue += parseInt(strCode[i]);
        }
        //然后，将oddValue数乘以3。
        oddValue = oddValue * 3;
        var tempValue = oddValue + evenValue;
        var checkValue = 0;
        //10的倍数
        while (tempValue++ % 10 != 0) {
            checkValue++;

        }
        return strCode + checkValue.toString();
    }

    function getEANCode(strCode) //71000155555+x
    {
        var oddValue = 0; //将所有奇数位置（第1、3、5、7、9和11位）上的数字相加。
        var evenValue = 0; //将所有偶数位置（第2、4、6、8、10和12位）上的数字相加。

        for (var i = 0; i < strCode.length; i++) {
            if (i % 2 == 0) oddValue += parseInt(strCode[i]);
            else evenValue += parseInt(strCode[i]);
        }
        //然后，将oddValue数乘以3。
        evenValue = evenValue * 3;
        var tempValue = oddValue + evenValue;
        var checkValue = 0;
        //10的倍数
        while (tempValue++ % 10 != 0) {
            checkValue++;

        }
        return strCode + checkValue.toString();
    }

    //店铺销售人员查询
    $('#index1_customerServiceSearch').on('click', function(){
        layer.open({
            type: 1,
            title: '店铺销售人员查询',
            btn: ['关闭'],
            area: ['1100px', '700px'],
            content: $('#index1_customerServiceSearchTpl').html(),
            success: function(layero,index){
                layui.form.render('select')
                // initAjax('/acctPerson/queryAllStoreAcct.html', 'post', {}, function(returnData) {
                //     var data = returnData.data;
                //     var option = '<option value="">全部</option>'
                //     for (var i in data) {
                //         option += '<option value="' + data[i].storeId + '">' + data[i].storeAcct + '</option>'
                //     }
                //     $('#customerService_storeAcct').append(option);
                //     formSelects.render();
                // });
                initAjax('/acctPerson/queryAllSalesPerson.html', 'post', {}, function(returnData) {
                    var data = returnData.data;
                    var option = '<option value="">全部</option>'
                    for (var i in data) {
                        option += '<option value="' + data[i].salesPersonId + '">' + data[i].salesPerson + '</option>'
                    }
                    $('#customerService_salesPerson').append(option);
                    formSelects.render();
                });
                initAjax('/acctPerson/queryAllCustomServicer.html', 'post', {}, function(returnData) {
                    var data = returnData.data;
                    var option = '<option value="">全部</option>'
                    for (var i in data) {
                        option += '<option value="' + data[i].customServicerId + '">' + data[i].customServicer + '</option>'
                    }
                    $('#customerService_customServicer').append(option);
                    formSelects.render();
                });
                // 列表查询（无参）
                searchStoreAcctSalesPerson();
                $('#searchStoreAcctSalePersonId').on('click', function(){
                    var sub = new Object();
                    sub.storeIds = $("#storeAcctSalesPersonIdForm [name='storeAcct']").val();
                    sub.salesPersonIds = $("#storeAcctSalesPersonIdForm [name='salesPerson']").val();
                    sub.customServicerIds = $("#storeAcctSalesPersonIdForm [name='customServicer']").val();
                    sub.puYuanAlias = $("#storeAcctSalesPersonIdForm [name='puYuanAlias']").val();
                    sub.storeStatus = $("#storeAcctSalesPersonIdForm [name='storeStatus']").val();
                    // 店铺销售人员-列表查询（有参）
                    searchStoreAcctSalesPerson(sub);
                });
            }
        })
    });
    //初始化ajax请求
    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, {
                        icon: 2
                    });
                }
            },
            error: function() {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {
                        icon: 7
                    });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }
    // 查询店铺销售人员信息
    function searchStoreAcctSalesPerson(data) {
        table.render({
            elem: '#storeAcctSalePersonId',
            method: 'post',
            url: ctx + '/acctPerson/queryAcctPersonList.html',
            where: data,
            cols: [
                [ // 店铺销售人员列表
                    {
                        title: "店铺名称",
                        field: "storeAcct",
                    }, {
                    title: "普源别名",
                    field: "allrootAliasName"
                }, {
                    title: "销售员(编号)",
                    field: "salesPerson",
                    templet: `<div><div>
                        {{d.salesPerson}}
                      {{# if(d.salesPersonId != -1){ }}
                        ({{d.salesPersonId}})
                      {{# } }}
                    </div></div>`
                }, {
                    title: "客服人员(编号)",
                    field: "customServicer",
                    templet: `<div><div>
                        {{d.customServicer}}
                      {{#  if(d.customServicerId != -1){ }}                  
                        ({{d.customServicerId}})
                      {{# } }}
                    </div></div>`
                }, {
                    title: "店铺状态",
                    field: "storeStatus",
                    templet: `<div>
                      {{#  if(d.storeStatus){ }}
                      <div>启用中</div>
                      {{# }else{ }}
                      <div>已停用</div>
                      {{# } }}
                    <div>`
                }
                ]
            ],
            page: true,
            limit: 20,
            id: 'storeAcctSalePersonId',
            done: function(data) {}
        });
    }

    // 获取当前时间20220721132314
    function getNowTime() {
        const yy = new Date().getFullYear()
        const MM = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
        const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
        const HH = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
        const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
        return ""+yy+MM+dd+HH+mm+ss
    }


    // 打开以图搜图弹框
    $('#index1_searchImage').on('click', function() {
        handleSearchImage()
    })

    //打开查找货源弹框
    $('#index1_findSource').on('click', function(){
        handleFindSource();
    });

    //信息采集插件使用说明
    $('#instructionsUsing_informationCollectionPlugin').on('click', function(){
        layer.open({
            type: 1,
            id: Date.now(),
            title: '信息采集插件使用说明',
            area: ['40%', '80%'],
            move: false,
            success: function(layero, index) {
                layui.view(this.id).render('route/iframe/pluginInstructionsUsing').done(function () {
                });
            }
        });
    });

    // 保存速卖通cookie
    $("#index1_saveSmtCookie").click(function(){
        layer.open({
            type: 1,
            title: '保存速卖通cookie',
            btn: ['保存', '关闭'],
            area: ['500px', '300px'],
            content: $('#index1_saveSmtCookie_layer').html(),
            success: function (layero, index) {
            },
            yes: function (index, layero) {
                var $cookie = layero.find('textarea[name=getSmtCookie]').val();
                commonReturnPromise({
                    type: "post",
                    url: ctx + "/wangduoyun/updateAliExpressCookie",
                    contentType:"application/json",
                    params: JSON.stringify({'cookie':$cookie}),
                }).then(res => {
                    layer.close(index)
                    layer.msg(res,{icon:1})
                })
            }
        })
    });

    //订单查询
    $('#index1_orderSearch').on('click', function(){
      layer.open({
        type: 1,
        title: '订单查询',
        btn: ['关闭'],
        area: ['90%', '90%'],
        content: $('#index1_orderSearch_layer').html(),
        id: 'index1_orderSearch_layerId',
        success: function (layero, index) {
          let $btn = layero.find('.search');
          $btn.on('click', function(){
            let idStr = layero.find('[name=idStr]').val(); //店铺编号
            let platOrderIdStr = layero.find('[name=platOrderIdStr]').val(); //订单编号
            let logisTrackingNoStr = layero.find('[name=logisTrackingNoStr]').val(); //跟踪号
            table.render({
              elem: "#index1_orderSearch_layerTable",
              method:'post',
              contentType: 'application/json',
              where: {
                idStr: idStr,
                platOrderIdStr: platOrderIdStr,
                logisTrackingNoStr: logisTrackingNoStr
              },
              url: '/lms/platorder/queryOrderInfo',
              cols: [[
                  { field: "orderType", title: "类别" },
                  { field: "id", title: "订单编号", templet: `
                  <div>
                    <div name="orderauditDespathOrderallStatusOrder" data-id="{{d.id}}" style="color:#409eff;cursor:pointer;">
                    {{d.id}}
                    </div>
                  </div>
                  ` },
                  { field: "platOrderId", title: "店铺单号" },
                  { field: "platCode", title: "平台" },
                  { field: "storeAcctName", title: "店铺" },
                  { field: "logisTrackingNo", title: "跟踪号" }
              ]],
              page:true,
              id:"index1_orderSearch_layerTableId",
              limits:[100,200],
              limit:100,
              done: function(){
                layero.find('[name=orderauditDespathOrderallStatusOrder]').on('click', function(){
                  let id = $(this).attr('data-id');
                  window.parent.postMessage({ id: id, name: 'orderauditDespathOrderallStatusOrder'},'*');
                });
              }
            });
          });
        },
    })
    });
});
// 删除图片
function removeCurrentLi(self) {
    $(self).closest('li').remove()
}

// 拖拽
var drag = function (obj) {
    $(obj.target).on("mousedown", start);

    function start(event) {
        if (event.button == 0) { //判断是否点击鼠标左键
            /*
         * clientX和clientY代表鼠标当前的横纵坐标
         * offset()该方法返回的对象包含两个整型属性：top 和 left，以像素计。此方法只对可见元素有效。
         * bind()绑定事件，同样unbind解绑定，此效果的实现最后必须要解绑定，否则鼠标松开后拖拽效果依然存在
         * getX获取当前鼠标横坐标和对象离屏幕左侧距离之差（也就是left）值，
         * getY和getX同样道理，这两个差值就是鼠标相对于对象的定位，因为拖拽后鼠标和拖拽对象的相对位置是不变的
         */
            // console.log(event.clientX)
            let targetLeft = $(obj.target).offset().left;
            gapX = event.clientX - targetLeft;
            gapIndex = $(obj.target).parents("li").index();
            //movemove事件必须绑定到$(document)上，鼠标移动是在整个屏幕上的
            $(document).bind("mousemove", move);
            //此处的$(document)可以改为obj
            $(document).bind("mouseup", stop);
        }
        return false; //阻止默认事件或冒泡
    }

    function move(event) {
        let left = event.clientX - _layerX - 400 * (gapIndex % 3)- 10 * (gapIndex % 3 + 3);

        if(left>=32&&left<=400){
            $(obj.target).css({
                "left": left -32 + "px",
            });
            $(obj.target).prev(".resize").css({"width":left-16 + "px"})
        }
        return false; //阻止默认事件或冒泡
    }

    function stop() {
        //解绑定，这一步很必要，前面有解释
        $(document).unbind("mousemove", move);
        $(document).unbind("mouseup", stop);

    }
}