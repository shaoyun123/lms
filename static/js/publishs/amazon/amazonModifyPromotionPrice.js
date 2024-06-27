/**
 * 调价
 */
 var amasontableIns = {};
 var promotionPriceTimeUnit;
 layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
     var admin = layui.admin,
         form = layui.form,
         layer = layui.layer,
         table = layui.table,
         formSelects = layui.formSelects,
         element = layui.element,
         laydate = layui.laydate,
         laypage = layui.laypage,
         $ = layui.$;
    //  render_hp_orgs_users("#amazon_theShelves_searchForm"); //渲染部门销售员店铺三级联动
     form.render(null, 'component-form-element');
     form.render(null, 'component-form-group');
     formSelects = layui.formSelects
     form.render('select');
     form.render('checkbox');
     form.render('radio');

     laydate.render({
      elem: '#promotion_time',
      type: 'date',
      inputAuto: true,
      range: true
    });
 
     //表格渲染结果
     //展示已知数据
     var data = new Object();
     let idList = '',pidList = '',idListArr = [],pidListArr = [];
     
     if (stopAmazonArr.length > 0) {
         data.idList = [];
         data.pidList = [];
         data.grossProfitRate = '';
         data.storeAcctIdList = stopAmazonArr.map(item => item.storeAcctId);
         for (var i = 0; i < stopAmazonArr.length; i++) {
             if(stopAmazonArr[i].id != null && stopAmazonArr[i].id!=''){
                 data.idList.push(stopAmazonArr[i].id);
             }else{
                 data.pidList.push(stopAmazonArr[i].pId)
             }
             idListArr.push(stopAmazonArr[i].id)
             pidListArr.push(stopAmazonArr[i].pId)
         }
         idList = idListArr.join(",");
         pidList = pidListArr.join(",");
     }
     if (stopAmazonArr.length > 0) {
         tableReload(data);
     }
     if (timeUnit != null) {
         clearInterval(timeUnit); //清除定时查询进度
     }
 
     // let amazonCurr_idList = [],amazonCurr_pIdList = [];
     let amazon_searchTableData = []
     function tableReload(data) {
         amasontableIns = table.render({
             elem: "#amazonModifyPromotionPrice",
             method: 'post',
             url: ctx + "/amazonBatchOperationController/searchModifyPromotionPrice",
             cols: [
                 [
                     { type: "checkbox" },
                     { field: "id", title: "id" },
                     { field: "storeAcctId", title: "店铺id" },
                     { field: "storeAcct", title: "店铺", width: 200 },
                     { field: "prodSSku", title: "商品子SKU", width: 200 },
                     { field: "storeSSku", title: "店铺子SKU", width: 200 },
                     { field: "asin", title: "asin", width: 200 },
                     { field: "siteId", title: "站点", width: 60 },
                     { field: "listingPrice", title: "当前刊登价" },
                     { field: "promotionPrice", title: "促销价",templet:'#promotionPriceTpl', width: 80  },
                     { field: "diffirencePrice", title: "差价"},
                     { field: "result", title: '操作结果' }
                 ]
             ],
             page: false,
             where: data,
             contentType: 'application/json',
             id: "amazonModifyPromotionPrice",
             limit: 10000,
             done: function(res, curr, count) {
                 $("[data-field='id']").css('display', 'none');
                 $("[data-field='storeAcctId']").css('display', 'none');
                 $("#tolnum_span_amazon_price").text("共" + count + "条");
                 amazon_searchTableData = res.data
         
                // 收手动修改促销价
                $('input[id="priceInput"]').blur(function() {
                  console.log('change')
                  var newPrice = parseFloat($(this).val());
                  var id = $(this).parent().parent().parent().find('td[data-field="id"] div').text()
                  if (newPrice < 0) {
                    layer.msg('新的促销价不可调整为小于0');
                    $(this).val(0);
                    return false;
                  }
                  var originPrice = $(this).parents('td').siblings('td[data-field="listingPrice"]').find('div').text();
                  var diffPriceVal = (parseFloat(newPrice)-parseFloat(originPrice)).toFixed(2);
                  $(this).parents('td').siblings('td[data-field="diffirencePrice"]').find('div').text(diffPriceVal);

                  amazon_searchTableData.forEach(item => {
                   if (item.id == id) {
                     item.promotionPrice = newPrice
                     item.diffirencePrice = diffPriceVal
                   }
                  })
                })
             }
         });
     }
 
     //校验价格输入不能低于0
     $('input[name="newPriceInput"]').change(function() {
         if (parseFloat($(this).val()) < 0) {
             $(this).val("");
         }
     });
 
     function amazonModifyTableReload(data,searchBool) {
         if(data == "srting"){
            data = []
         }
         amasontableIns = table.render({
             elem: "#amazonModifyPromotionPrice",
             cols: [
                 [
                     { type: "checkbox" },
                     { field: "id", title: "id" },
                     { field: "storeAcctId", title: "店铺id" },
                     { field: "storeAcct", title: "店铺", width: 200 },
                     { field: "prodSSku", title: "商品子SKU", width: 200 },
                     { field: "storeSSku", title: "店铺子SKU", width: 200 },
                     { field: "asin", title: "asin", width: 200 },
                     { field: "siteId", title: "站点", width: 60 },
                     { field: "listingPrice", title: "当前刊登价" },
                     { field: "promotionPrice", title: "促销价",templet:'#promotionPriceTpl', width: 80 },
                     { field: "diffirencePrice", title: "差价"},
                     { field: "result", title: '操作结果' }
                 ]
             ],
             page: false,
             limit:10000,
             data:data,
             id: "amazonModifyPromotionPrice",
             done: function(res, curr, count) {
                 $("[data-field='id']").css('display', 'none');
                 $("[data-field='storeAcctId']").css('display', 'none');
                 $("#tolnum_span_amazon_price").text("共" + count + "条");
                 if(searchBool == true){
                     amazon_searchTableData = res.data
                    }
                    // 收手动修改促销价
                 $('input[id="priceInput"]').blur(function() {
                   console.log('change')
                   var newPrice = parseFloat($(this).val());
                   var id = $(this).parent().parent().parent().find('td[data-field="id"] div').text()
                   if (newPrice < 0) {
                     layer.msg('新的促销价不可调整为小于0');
                     $(this).val(0);
                     return false;
                   }
                   var originPrice = $(this).parents('td').siblings('td[data-field="listingPrice"]').find('div').text();
                   var diffPriceVal = (parseFloat(newPrice)-parseFloat(originPrice)).toFixed(2);
                   $(this).parents('td').siblings('td[data-field="diffirencePrice"]').find('div').text(diffPriceVal);

                   amazon_searchTableData.forEach(item => {
                   if (item.id == id) {
                     item.promotionPrice = newPrice
                     item.diffirencePrice = diffPriceVal
                   }
                   })
                 })
             }
         });
     }

     /**
      * 一键写入价格值 一键应用
      */
     $("#newPriceBtn").click(function() {
         var checkStatus = table.checkStatus('amazonModifyPromotionPrice');
         var grossProfitRate = $.trim($("#applyForm input[name='grossProfitRate']").val());
         var newPrice = $.trim($("#applyForm input[name='newPriceInput']").val());
 
         if(grossProfitRate != '' && newPrice != ''){
             return layer.msg('当前价格和毛利润不能同时有值，请确认！');
         }
         if(grossProfitRate == '' && newPrice == ''){
            return layer.msg('请输入调整的价格！');
        }
         if (checkStatus.data.length > 0 && amasontableIns) {
             var layFilterIndex = 'LAY-table-' + amasontableIns.config.index;
             var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
             //获取表格行对象
             // 运算符1+2-3*4=
             let calTypeArr = ["0","+","-","*","="]
             var calType = $("#applyForm select[name='calculateType']").val()
            
              if( newPrice !==''){  // 当前价格，前端计算   
                tableContainer.find('input[name="layTableCheckbox"]:checked').each(function(){
                   var tr= $(this).parents('tr');
                   var id = tr.find('td[data-field="id"] div').text();
                   var promotionPrice = tr.find('td[data-field="promotionPrice"] div input').val(); // 促销价
                   var promotionInput = tr.find('td[data-field="promotionPrice"] div input');
                   var listingPrice = tr.find('td[data-field="listingPrice"] div').text(); // 刊登价
                   var diffPrice = tr.find('td[data-field="diffirencePrice"] div');
                   calculatePrice(calType, newPrice, listingPrice, promotionInput, diffPrice, listingPrice);

                   amazon_searchTableData.forEach(item => {
                    if (item.id == id) {
                      item.promotionPrice = promotionInput.val()
                      item.diffirencePrice = diffPrice.text()
                    }
                   })
                  });
              }

              if (grossProfitRate !== '') { 
                let idsList = [];
                let pidsList= [];
                if (checkStatus.data.length > 0) {
                   for (var i = 0; i < checkStatus.data.length; i++) {
                       if(checkStatus.data[i].id){
                         idsList.push(checkStatus.data[i].id);
                       }else{
                         pidsList.push(checkStatus.data[i].pId)
                       }
                   }
               }
               let obj = {
                   "grossProfitRate": grossProfitRate,
                   "idList": idsList,
                   "pIdList": pidsList,
                   "storeAcctIdList": layui.table.checkStatus("amazonModifyPromotionPrice").data.map(item => item.storeAcctId)
               }
 
               commonReturnPromiseRes({
                   url: ctx + `/amazonBatchOperationController/searchModifyPromotionPrice`,
                   type: 'post',
                   contentType: 'application/json',
                   params: JSON.stringify(obj)
               }).then(res=>{
                   if(res.code == "0000"){
                    amazon_searchTableData.forEach(item => {
                      res.data.forEach(cItem => {
                        if (cItem.id === item.id) {
                          item.promotionPrice = cItem.promotionPrice
                          item.diffirencePrice = cItem.diffirencePrice
                        }
                      })
                    })
                    amazonModifyTableReload(amazon_searchTableData, true)
                   }
               }).catch(res=>{
                  //  amazonModifyTableReload([],true)
               })
             }     
         } else {
             layer.msg('请选择需要调价的商品')
         }
     });
     //选自对应计算类型计算修改后的价格
     function calculatePrice(calType, newprice, listingPrice, promotionInput, diffPrice, listingPrice) {
       switch (calType) {
         case "1":
           var finalprice = (parseFloat(listingPrice) + parseFloat(newprice)).toFixed(2);
                promotionInput.val(finalprice); //新的价格
                diffPrice.text((parseFloat(finalprice) - parseFloat(listingPrice)).toFixed(2))
                 break;
             case "2":
                 var finalprice = (parseFloat(listingPrice) - parseFloat(newprice)).toFixed(2);
                 if (finalprice > 0) {
                  promotionInput.val(finalprice); //新的价格
                  diffPrice.text((parseFloat(finalprice) - parseFloat(listingPrice)).toFixed(2))
                 } else {
                    layer.msg('价格调整不得低于0');
                 }
                 break;
             case "3":
                 var finalprice = (parseFloat(listingPrice) * parseFloat(newprice)).toFixed(2);
                 promotionInput.val(finalprice); //新的价格
                 diffPrice.text((parseFloat(finalprice) - parseFloat(listingPrice)).toFixed(2))
                 break;
             default:
                 promotionInput.val(newprice);
                 diffPrice.text((parseFloat(newprice) - parseFloat(listingPrice)).toFixed(2))
         }
     }
 
     // 筛选
     $("#amazonFilter").click(function(){
         let minDifPrice = $.trim($("#applyForm input[name='minDifPrice']").val());
         let maxDifPrice = $.trim($("#applyForm input[name='maxDifPrice']").val());
         if (minDifPrice==''&&maxDifPrice=='') {
          return layer.msg('请输入差价范围')
         }
         let tableData = amazon_searchTableData.filter((item,index)=>{
             if(minDifPrice!=''&&maxDifPrice!=''){
                 return minDifPrice < item.diffirencePrice&&item.diffirencePrice < maxDifPrice
             }else if(minDifPrice!=''){
                 return minDifPrice < item.diffirencePrice
             }else if(maxDifPrice!=''){
                 return item.diffirencePrice < maxDifPrice
             }
         })
         amazonModifyTableReload(tableData,false)
     })
 
     // 还原
     $("#amazonRevert").click(function(){
         amazonModifyTableReload(amazon_searchTableData,false)
     })
 
     //批量调价
     $('#batchUpadatePrice').click(function() {
        // 校验促销起止时间
        let promotionTime = $("#promotion_time").val()
        if (!promotionTime) {
          return layer.msg("促销起止时间不能为空！")
        }
         //获取表格行对象
         var prodObj = [];
         applytoChecked('amazonModifyPromotionPrice', amasontableIns, function(tr, data, i) {
             var price = tr.find('td[data-field="promotionPrice"] div input').val();
             var diffirencePrice = tr.find('td[data-field="diffirencePrice"] div').text();
             var time = $('#promotion_time').val()
             var startTime = time.split(' - ')[0]
             var endTime = time.split(' - ')[1]
              data.diffirencePrice = diffirencePrice;
              data.promotionPrice = price;
              data.promotionPriceStartTime = new Date(startTime).getTime();;
              data.promotionPriceEndTime = new Date(endTime).getTime();
              prodObj.push(data);
         });

         if (prodObj.length > 0) {
             $.ajax({
                 beforeSend: function() {
                     loading.show();
                 },
                 type: "POST",
                 url: ctx + "/amazonBatchOperationController/modifyPromotionPrice",
                 data: JSON.stringify(prodObj),
                 async: true,
                 contentType:'application/json',
                 dataType: "json",
                 success: function(returnData) {
                     if (returnData.code = "0000") {
                       layer.msg(returnData.msg);
                       loading.hide();
                        getResult(returnData.data);
                        promotionPriceTimeUnit = setInterval(function() {
                          getResult(returnData.data);
                        }, 10000);                        
                     } else {
                        loading.hide()
                        layer.msg(returnData.msg);
                     }
                 },
                 error: function() {
                     loading.hide()
                     layer.msg("服务器正忙");
                 }
             });
         }
     });
 
     function getResult(batchNo) {
        let count = 0
        applytoChecked('amazonModifyPromotionPrice', amasontableIns, function(tr, data, i) {
          var result = tr.find('td[data-field="result"] div').children().text();
          if (!result || result === '处理中') {
            count ++
          } else {
            count = 0
          }
      });
      if(count == 0){
          clearInterval(promotionPriceTimeUnit);
          return;
        }
         $.ajax({
             type: "GET",
             url: ctx + "/amazonBatchOperationController/searchModifyPromotionPriceResultLog",
             data: { 'batchNo': batchNo },
             async: false,
             dataType: "json",
             success: function(returnData) {
                 if (returnData.code == "0000") {
                  applytoChecked('amazonModifyPromotionPrice', amasontableIns, function(tr, data, index) {
                    let storeAcctId = tr.find('td[data-field="storeAcctId"] div').text();
                    let storeSSku = tr.find('td[data-field="storeSSku"] div').text();
                    let siteId = tr.find('td[data-field="siteId"] div').text();
                    let msg = returnData.data[storeAcctId + siteId + storeSSku]
                    tr.find('td[data-field="result"] div').html("<div style='color:blue'>" + msg + "</div>")
                  });
                 } else {
                    layer.msg(returnData.msg);
                 }
             },
             error: function() {
                layer.msg("服务器正忙");
                clearInterval(promotionPriceTimeUnit);
             }
         });
     }
 });