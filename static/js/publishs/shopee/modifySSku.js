layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
        form.render();
    render_hp_orgs_users("#shopee_modify_ssku_form");//渲染部门销售员店铺三级联动
    var ckedsIdArr = JSON.parse(localStorage.getItem('ckedsIdArr'));
    var modifySSkuName = {
        //提交表单
        submit: function(){
            var _this = this;
            form.on('submit(modifySSku_submit)', function(data){
                var data = data.field; //获取到表单提交对象
                // data.idList = ckedsIdArr.join(',');
                if(!data.sSkuList){
                    return layer.msg('子sku必填!');
                };
                var currentStoreAccts = formSelects.value("selectAttr_store", "val");//所选店铺
                if (currentStoreAccts == null || currentStoreAccts.length == 0) {//没有选择店铺
                    var acctIds = $("#selectAttr_store").attr("acct_ids");
                    if (acctIds != null && acctIds != '') {
                        data.storeAcctIdList = acctIds;
                    } else {
                        data.storeAcctIdList = 99999;
                    }
                } else {
                    data.storeAcctIdList = currentStoreAccts.join(",");//选择的店铺
                }
                _this.tableRender(data);
            })
            return this;
        },
        //表格搜索事件
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#modifySSku_table',
                method: 'post',
                url: '/lms/shopee/shopeeIsEnableProduct/prodModifyStock.html',
                where:  data,
                page: true,
                id: "modifySSku_tableId",
                limits: [50, 100, 300],
                limit: 50,
                height: 500,
                cols: [
                    [
                        {type: 'checkbox', width: 50},
                        {title: '店铺', field: 'storeAcct'},
                        {title: 'item_id', field: 'itemId'},
                        {title: 'variation_id', field: 'variId'},
                        {title: '商品子SKU', field: 'sSku'},
                        {title: '店铺子SKU<div style="display:flex;"><input type="text" class="layui-input" id="modifySSku_batchInput">变<input type="text" class="layui-input" id="modifySSku_batchInput1"><span class="layui-btn layui-btn-sm"><i class="layui-icon layui-icon-ok"></i></span></div>', field: 'storeSku', templet: '#modify_storeSSku',width:250},
                        {title: '操作结果', field: 'handleResult'}
                    ]
                ],
                done: function(res){
                   $('#modifySSku_table_num').text(res.count);
                   _this.batchHandle();
                   _this.batchInputHandle();
                }
            });
        },
        //批量修改
        batchHandle: function(){
          var _this = this;
          $('#batchModifySSku').on('click', function(){
              var ckes = table.checkStatus('modifySSku_tableId');
              var data = ckes.data;
              if(!data.length){
                  return layer.msg('请选择需要修改的店铺');
              }
              var variationIdsArr = [];
              for(var i=0; i< data.length; i++){
                  var item = data[i];
                  var id = '#store'+item.id;
                  if(!variationIdsArr.includes(item.id)){
                    variationIdsArr.push(item.id);
                  };
                  item.storeSku = $(id).find('input').val();
                //   if(item.isMultiSku == 0){
                //       item.title = item.parentTitle;
                //   }
              };
              var maxLength = variationIdsArr.length;
              _this.handleStoreSku(data).then(function(result){
                  if(result == '修改成功'){
                    layer.msg('修改已开始,请稍后!!', {icon: 6});
                    var interval = setInterval(function(){
                        _this.searchResult(variationIdsArr).then(function(result){
                            // console.log(result);
                            if(result.length>0){
                               for(let i=0; i<result.length; i++){
                                    let item = result[i];
                                    let tarId = '#store'+item.id;
                                    let $handleResult = $(tarId).parents('tr').find('td[data-field=handleResult]>div');
                                    if(item.resultCode == '0000'){
                                        $handleResult.html('<font color="blue">修改成功</font>');
                                    }else if(item.resultCode == '9999'){
                                        $handleResult.html('<font color="red">'+item.resultMsg+'</font>');
                                    }else{
                                        $handleResult.html('<font>执行中</font>');
                                    }
                               };
                            }
                            if(result.length >= maxLength){
                                loading.hide();
                                layer.msg('批量修改完成');
                               clearInterval(interval);
                            };
                        });
                    }, 3000);
                };
              }).catch(function(reason){
                  layer.msg(reason);
              });
          })
        },
        //修改店铺sku
        handleStoreSku: function(data){
           return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType:'application/json',
                    url: '/lms/shopee/shopeeIsEnableProduct/updateShopeeStoreSkuList.html',
                    data: JSON.stringify(data),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve('修改成功');
                        }else{
                            reject(res.msg);
                            loading.hide();
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器错误');
                    }
                })
           });
        },
        //查询请求结果
        searchResult: function(variationIdsArr){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/shopee/shopeeIsEnableProduct/queryUpdateStoreSkuLogForShopee.html',
                    data: {
                        idList: variationIdsArr.join(',')
                    },
                    success: function(res){
                        if(res.code == '0000'){
                            let data = res.data || [];
                            resolve(data);
                        }else{
                            reject(res.msg);
                            loading.hide();
                        }
                    },
                    error: function(){
                        loading.hide();
                        resolve('服务器错误');
                    }
                });
            })
        },
        //一键应用
        batchInputHandle: function(){
            var $input = $('#modifySSku_batchInput'); //要被替换的值
            var $input1 = $('#modifySSku_batchInput1');//替换成的值
            var $btn = $input1.next();
            $btn.on('click', function(){
                var $val = $input.val();
                var $val1 = $input1.val();
                var $tds = $('td[data-field="storeSku"]');
                if(!$val.length && $val1.length>0){
                    for(let i=0; i< $tds.length; i++){
                        let item = $tds[i];
                        $(item).find('input').val($val1);
                    }
                }else if($val.length>0 && $val1.length>0){
                    for(let i=0; i< $tds.length; i++){
                        let item = $tds[i];
                        var tdVal = $(item).find('input').val();
                        var replaceTdVal = tdVal.replace($val, $val1);
                        $(item).find('input').val(replaceTdVal);
                    }
                }else if(!$val1.length){
                    return layer.msg('第二个输入框的值必填',{icon:7});
                }
            })
        }

    };

    modifySSkuName.submit();
    var prodSSkuListArr = JSON.parse(localStorage.getItem('prodSSkuListArr'));
    if(ckedsIdArr.length > 0) {
        table.render({
            elem: '#modifySSku_table',
            method: 'post',
            url: '/lms/shopee/shopeeIsEnableProduct/prodModifyStock.html',
            where:  {
               searchType: 1,
               sSkuList: prodSSkuListArr.join(','),
               storeAcctId:'',
               idList: ckedsIdArr.join(',')
            },
            page: true,
            id: "modifySSku_tableId",
            limits: [50, 100, 300],
            limit: 50,
            height: 500,
            cols: [
                [
                    {type: 'checkbox', width: 50},
                    {title: '店铺', field: 'storeAcct'},
                    {title: 'item_id', field: 'itemId'},
                    {title: 'variation_id', field: 'variId'},
                    {title: '商品子SKU', field: 'sSku'},
                    {title: '店铺子SKU<div style="display:flex;"><input type="text" class="layui-input" id="modifySSku_batchInput">变<input type="text" class="layui-input" id="modifySSku_batchInput1"><span class="layui-btn layui-btn-sm"><i class="layui-icon layui-icon-ok"></i></span></div>', field: 'storeSku', templet: '#modify_storeSSku'},
                    {title: '操作结果', field: 'handleResult',width:250}
                ]
            ],
            done: function(res){
               $('#modifySSku_table_num').text(res.count);
               modifySSkuName.batchInputHandle();
               modifySSkuName.batchHandle();
            }
        });
    }
})