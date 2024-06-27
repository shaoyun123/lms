<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>物流退货</title>
            <style>
                .goodsBox{
                    width: 250px;
                    border: 1px solid #cccccc;
                    padding: 5px;
                    margin: 10px;
                    font-weight: 600;
                    font-size: 15px;
                }
                .dis_flex{
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }

                .goodsBox img{
                    width: 150px;
                    height: 150px;
                }
                .goodsBox button{
                    float: right;
                    /* margin: 10px; */
                }

                #rejectedGoodsTagForm span {
                    position: relative;
                }
                .rejectedGoods-tagSearchTop {
                    top: 5px;
                    margin-left: 5px;
                }
                .rejectGoodsTag-minW{
                    width: 110px;
                }

            </style>
            <div class="layui-fluid" id="LAY-rejectedGoodsTag">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-row layui-col-space15">
                                    <div class="layui-col-lg12 layui-col-md12">
                                        <form class="layui-form" id="rejectedGoodsTagForm" lay-filter="rejectedGoodsTagForm">
                                            <div class="layui-form-item">
                                              <div class="layui-col-md1 layui-col-lg1 rejectedGoods-tagSearchTop">
                                                <select name="warehouseType" id="rejectedGoods_warehouseType" lay-filter="rejectedGoods_warehouseTypeFilter">
                                                </select>     
                                              </div>
                                                <div class="layui-col-md2 layui-col-lg2 rejectedGoods-tagSearchTop">
                                                    <input type="text" name="queryId" id="queryId" class="layui-input" placeholder="订单号/跟踪号/LP号" lay-verify="required">
                                                </div>
                                                <div class="layui-col-md1 layui-col-lg1 rejectedGoods-tagSearchTop">
                                                    <select name="tagType" id="rejectedGoods_returnType">
                                                    </select>                                                
                                                  </div>
                                                <div class="layui-col-md1 layui-col-lg1 rejectedGoods-tagSearchTop">
                                                    <select name="storeId" id="rejectedGoods_warehouses"></select>
                                                </div>
                                                
                                                <div class="layui-col-md4 layui-col-lg4" style="display: flex;justify-content: space-around;">
                                                    <span style="font-size: 16px;top: 5px;margin-left: 10px">
                                                        总数量：<span id="rejectGoodsTotalCount" style="font-size: 34px;top: 5px;"></span>
                                                        总货值：<span id="rejectGoodsTagMainOrderGoodsCosts" style="font-size: 34px;top: 5px;"></span>
                                                    </span>
                                                    <span id="rejectGoodsTagorderStatusId" style="font-size: 34px;top: 10px;margin: 0 10px"></span>
                                                    <span id="rejectGoodsTagShowReturnStringId" style="font-size: 34px;top: 10px;"></span>
                                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" style="margin-top: 5px" onclick="printAllTag()">全部打印</button>
                                                </div>
                                                <div class="layui-col-md2 layui-col-lg2 layui-form">
                                                  <input type="checkbox" name="judgeDirectAutoPrint" title="自动打印标签" lay-skin="primary" disabled>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div id="productListContainer" class="dis_flex"></div>
                                <table class="layui-table layui-hide" id="productListContainerTable" lay-filter="productListContainerTable_Filter"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script type="text/html" id="rejectedGoodsDetailtpl">
                <div>
                {{# if(d){  }}
                {{#  layui.each(d, function(index, item){ }}
                <div class="goodsBox clearfix" data-id={{item.id}}>
                    <div style="width: 100%; height: 30px;line-height: 30px">
                        {{item.sSku}}
                    </div>
                    <div>
                      <span>数量：{{item.prodNum}}</span>
                      <span style="padding-left: 20px;">货值:{{item.costPrice}}￥</span>
                    </div>
                    <div><span>名称：</span>{{item.title}}</div>
                    <div style="display:flex;">
                      <img data-original="{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
                      <div style="width: 80px;margin-left: 5px;margin-top: 80px;">
                        <input type="text" class="layui-input printTagNumInput" style="margin-bottom:5px;" placeholder="打印次数" value="1">
                        <span class="layui-btn layui-btn-normal layui-btn-sm" onclick="printTag(this)">打印</span>
                      </div>
                    </div>
                </div>
                {{#  }) }}
                {{# } }}
            </div>
            </script>

            <script type="text/html" id="rejectedGoodsBarcodeDetailtpl">
              <div>
              {{# if(d){  }}
              {{#  layui.each(d, function(index, item){ }}
              <div class="goodsBox clearfix" data-id={{item.id}}>
                  <div style="width: 100%; height: 30px;line-height: 30px">
                      {{item.prodSSku || ''}}
                  </div>
                  <div>
                    <span>货值:{{item.purchaseCostPrice || ''}}￥</span>
                  </div>
                  <div><span>名称：</span>{{item.title || ''}}</div>
                  <div style="display:flex;">
                    <img data-original="{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
                    <div style="width: 80px;margin-left: 5px;margin-top: 80px;">
                      <input type="text" class="layui-input printTagNumInput" style="margin-bottom:5px;" placeholder="打印次数" value="1">
                      <span class="layui-btn layui-btn-normal layui-btn-sm" onclick="printTagBarcode(this)">打印</span>
                      <input type="hidden" value='{{JSON.stringify(item)}}'>
                    </div>
                  </div>
              </div>
              {{#  }) }}
              {{# } }}
            </div>
            </script>

            <script type="text/html" id="rejectedGoodsMultiQueryIdDetail">
              <div style="padding:20px;" class="layui-form">
                <table class="layui-table">
                  <thead>
                    <tr>
                      <th width="50"></th>
                      <th>订单号</th>
                      <th>SKU清单</th>
                      <th width="150">面单打印时间</th>
                    </tr>
                  </thead>
                  <tbody id="rejectedGoodsMultiQueryIdDetailTbody"></tbody>
                </table>
              </div>
            </script>
            <script type="text/html" id="rejectedGoodsMultiQueryIdDetailTbodyTpl">
              {{#  layui.each(d, function(index, item){ }}
                <tr>
                  <td>
                    <div>
                      <input type="radio" name="queryIdRadio" value="{{item.id}}">
                    </div>
                  </td>
                  <td>{{item.id || ''}}</td>
                  <td>{{item.skuOverview|| ''}}</td>
                  <td>{{item.lastPrintLabelTime|| ''}}</td>
                </tr>
              {{# }) }}
            </script>

            <script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<!-- 表格渲染模板 -->
<script>
    layui.use(['form', 'layer', 'laytpl','laydate', 'table'], function() {
    var form = layui.form,
    laytpl = layui.laytpl,
    laydate = layui.laydate,
    table = layui.table,
    layer = layui.layer;
    var goodsDatas = [];

    //监听仓库选择
    form.on('select(rejectedGoods_warehouseTypeFilter)',function(obj){
      if(obj.value === '0'){ //直邮仓
        $('#rejectedGoodsTagForm [name=judgeDirectAutoPrint]').prop('checked',true).prop('disabled',false);
      }else{
        $('#rejectedGoodsTagForm [name=judgeDirectAutoPrint]').prop('checked',false).prop('disabled',true);
      }
      form.render('checkbox');
    });

    form.render()
    getReturnType();
    getWarehouseType();

    var rejectedGoodsTagName = {
        /**
         * radio第一次点击选中两次点击取消 
         * @param {string} layFilter lay-filter对应的值
         * @param {Array} valArr radio对应的value值
         */
        doubleCheckedCancel: function (layFilter, valArr) {
            form.on('radio(' + layFilter + ')', function (data) {
                if ($(data.elem).data('doubleChecked') == true) {
                    $(data.elem).prop('checked', false)
                    $(data.elem).data('doubleChecked', false)
                } else {
                    $(data.elem).prop('checked', true)
                    $(data.elem).data('doubleChecked', true)
                    _valArr = valArr.filter(item => item != data.value)
                    let parentDom = $(data.elem).parent('div')
                    _valArr.forEach(item => {
                        parentDom.find('input[value= ' + item + ']').data('doubleChecked', false)
                    })
                }
                form.render('radio');
            })
        },
        renderWarehouse: function(){
            commonReturnPromise({
                url: '/lms/prodWarehouse/getAllProdWarehouse.html'
            }).then(res => {
                let targetObj = res.filter(item =>item.warehouseName == '义乌仓')[0] || [];
                console.log(targetObj);
                commonRenderSelect('rejectedGoods_warehouses', res,{str: '<option value="">退货仓库</option>',name:'warehouseName', code: 'id',selected: targetObj.id}).then(()=> {
                    form.render('select');
                })
            })
        }
    }
    rejectedGoodsTagName.renderWarehouse();
    // 重复标记tagType 
    rejectedGoodsTagName.doubleCheckedCancel('rejectedGoods_tagType',[0,1])

    let needConfirmModify = false;
    // 获取物流退货数据
    function getDisplayData (queryIdParam = '') {
        let storeId = $('#rejectedGoodsTagForm select[name=storeId]').val();
        let queryId = $('#rejectedGoodsTagForm input[name=queryId]').val();
        let tagType = $('#rejectedGoodsTagForm select[name=tagType]').val();
        let judgeDirectAutoPrint = $('#rejectedGoodsTagForm [name=judgeDirectAutoPrint]').is(':checked');
        let warehouseType = $('#rejectedGoodsTagForm select[name=warehouseType]').val(); //0表示直邮仓
        let warehouseTypeName = $('#rejectedGoodsTagForm select[name=warehouseType]>option:selected').text();
        if (storeId ==='') {
            return layer.msg('请选择退货仓库');
        }
        if (tagType === '') {
            return layer.msg('请选择退货类型');
        }
        if(warehouseType === ''){
          return layer.msg('请选择仓库类型');
        }
        let QueryKey = warehouseTypeName.indexOf('平台仓')> -1 ? 'barcode': 'queryId'
        
        let params = {
            storeId,
            tagType,
            [QueryKey]: queryIdParam || queryId,
            confirmModify: true,
            judgeDirectAutoPrint: judgeDirectAutoPrint,
            warehouseType
        }
        if (!needConfirmModify) {
            delete params.confirmModify
        }
        if(QueryKey !='barcode'){ //直邮仓
          commonReturnPromise({
            url: ctx + '/returnorder/label/queryDirect',
            params: {
              queryId: queryIdParam || queryId
            }
          }).then(res => {
            if(res.length == 0){
              return layer.msg('根据参数未查询到订单信息', {icon: 1});
            }else if(res.length ==1){
              let newParams = {...params, queryId: res[0]['id']};
              getrejectedData(newParams, function(returnData){
                returnData.data ? displayGoods(returnData.data, returnData.extra?.autoPrintInfo) : displayGoods([]); // 渲染数据详情
                !returnData.data && $('#productListContainer').empty()             
                showExtra(returnData.extra);
              });
            }else if(res.length >1){ //需要弹框
              layer.open({
                type: 1,
                title: `${queryId}对应如下多个订单`,
                content: $('#rejectedGoodsMultiQueryIdDetail').html(),
                id: 'rejectedGoodsMultiQueryIdDetailId',
                btn: ['确定', '关闭'],
                area: ['60%', '60%'],
                success: function(layero){
                  let getTpl = rejectedGoodsMultiQueryIdDetailTbodyTpl.innerHTML;
                  let getTbody = document.getElementById('rejectedGoodsMultiQueryIdDetailTbody');
                  laytpl(getTpl).render(res, function(html){ //渲染到表格
                    getTbody.innerHTML = html;
                    form.render('radio');
                  });
                },
                yes: function(index, layero){
                  let radioValue = layero.find('[name=queryIdRadio]:checked').val();
                  let newParams = {...params, queryId: radioValue};
                  getrejectedData(newParams, function(returnData){
                    layer.close(index);
                    console.log('执行渲染逻辑');
                    returnData.data ? displayGoods(returnData.data, returnData.extra?.autoPrintInfo) : displayGoods([]); // 渲染数据详情
                    !returnData.data && $('#productListContainer').empty()             
                    showExtra(returnData.extra);
                  });
                }
              });
            }
          });
        }else{ //平台仓
          initAjax('/returnorder/label/queryV2','get',{ ...params, thenGoodsCosts:1 },function(returnData){
            let data = returnData.data;
            goodsDatas = returnData.data;
            //不渲染数量等信息
            showExtra([]);
            //渲染数据
            displayGoodsBarcode(data, returnData.extra?.autoPrintInfo);
          });
        }

        $("#queryId").focus();
        $("#queryId").select();
    } 

    function getrejectedData(queryParams,func){ //二次确认的时候是使用id重新请求,而不是使用queryId请求
        initAjax('/returnorder/label/queryV2','get',{ ...queryParams, thenGoodsCosts:1 },function(returnData){ 
            goodsDatas = returnData.data;
            if(returnData.msg){
                layer.confirm(returnData.msg, {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    if (returnData.extra && returnData.extra.needConfirmModify) {
                        needConfirmModify = true;
                    }
                    getDisplayData(queryParams.queryId || '');
                    layer.closeAll('dialog');
                });
            }
            if(func){
                func(returnData)
            }
        })
    }
    //获取仓库类型
    function getWarehouseType() {
      initAjax('/enum/list/WAREHOUSE_TYPE','get',{},function(returnData){
          let res = returnData.data;
          commonRenderSelect('rejectedGoods_warehouseType', res,{str: '<option value="">选择仓库类型(必填)</option>',name:'name', code: 'code'}).then(()=> {
              form.render('select');
          })
      })
    }

    // 获取退货类型
    function getReturnType() {
        initAjax('/sysdict/getBizDictByCode?headCode=WAREHOUSE_RETURN_TYPE&cache=true','get',{},function(returnData){
            let res = returnData.data;
            commonRenderSelect('rejectedGoods_returnType', res,{str: '<option value="">选择退货类型(必填)</option>',name:'name', code: 'name'}).then(()=> {
                form.render('select');
            })
        })
    }

    function displayGoods(data, autoPrintInfo = null){
        var tpl = rejectedGoodsDetailtpl.innerHTML;
        var productListContainer = $('#productListContainer')
        productListContainer.empty();
        for(var item of data){
            laytpl(tpl).render([item], function(html){
            productListContainer.append(html)
            productListContainer.find('div[data-id="'+item.id+'"]').find('span.layui-btn').data('item',item)
            imageLazyload();
          });
        }
        if(autoPrintInfo && autoPrintInfo.length>0){
          console.log('执行打印请求');
          //printAllTag();
          let printParams = [];
          for(let k=0; k<autoPrintInfo.length; k++){
            let item = autoPrintInfo[k];
            if(typeof(item) == 'string'){
              return layer.msg(item, {icon:7});
            }else{
              let obj = {};
              obj.printType = 19;
              obj.labelUrl = item.labelUrl;
              obj.width = item.width;
              obj.height = item.height;
              obj.printName = item.printName;
              printParams.push(obj);
            }
          }
          commonExecutePrintJobs(printParams);
        }
        $('#productListContainerTable').next('.layui-table-view').remove();
    }
    function displayGoodsBarcode(data, autoPrintInfo = null){
      let tpl = rejectedGoodsBarcodeDetailtpl.innerHTML;
      let productListContainer = $('#productListContainer')
      productListContainer.empty();
      for(var item of data){
          laytpl(tpl).render([item], function(html){
          productListContainer.append(html)
          productListContainer.find('div[data-id="'+item.id+'"]').find('span.layui-btn').data('item',item)
          imageLazyload();
        });
      }
      if(autoPrintInfo && autoPrintInfo.length>0){
        console.log('执行打印请求');
        //printAllTag();
        let printParams = [];
        for(let k=0; k<autoPrintInfo.length; k++){
          let item = autoPrintInfo[k];
          if(typeof(item) == 'string'){
            return layer.msg(item, {icon:7});
          }else{
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = item.labelUrl;
            obj.width = item.width;
            obj.height = item.height;
            obj.printName = item.printName;
            printParams.push(obj);
          }
        }
        commonExecutePrintJobs(printParams);
      }
      $('#productListContainerTable').next('.layui-table-view').remove();
  }

    /**
        * 处理扩展字段信息
        * @param data
        */
    function showExtra(data){
        if (data) {
            var mainOrderGoodsCosts = data.mainOrderGoodsCosts ? data.mainOrderGoodsCosts : "";
            var showReturnString = data.showReturnString ? data.showReturnString : "";
            var orderStatus = data.orderStatus ? data.orderStatus : "";
            var totalCount = data.totalCount ? data.totalCount : "";
            $("#rejectGoodsTagShowReturnStringId").text(showReturnString );
            $("#rejectGoodsTagorderStatusId").text(orderStatus );
            $("#rejectGoodsTagMainOrderGoodsCosts").text(mainOrderGoodsCosts + " ￥");
            $("#rejectGoodsTotalCount").text(totalCount);
            let audio = document.createElement("audio");
            if (showReturnString.trim() != '') {
                //播报   退
                $(audio).attr("src" , "http://img2.epean.com.cn/lms/app_audio/ff80808178da8bde0178e8ff12d60f22.mp3");
            }else {
                // 播报 不退 暂时这样子
                $(audio).attr("src" , "http://img2.epean.com.cn/lms/app_audio/ff80808178da8bde0178e902dbbc0f3d.mp3");
            }
            //查询记录 当搜索条件为查询记录时，显示其查询记录存不存在
            if(data.existenceState != undefined){
                $('#rejectGoodsTagExistenceStateId').find('span').text(data.existenceState)
                $('#rejectGoodsTagExistenceStateId').show()
                $("#rejectGoodsTagMainOrderGoodsCosts").text('')
            }else{
                $('#rejectGoodsTagExistenceStateId').hide()
            }
            //查询纪录不播报
            audio.play();
        }
    }

    window.printTag = function(aDom){
        let item = $(aDom).data('item')
        let printCount = $(aDom).parent('div').find('input.printTagNumInput').val();
        let pattern = /^[1-9]\d*$/;
        if(pattern.test(printCount)){
          //for(let i=0; i<printCount; i++){
          // printRejectedData([item]);
          //}
          let warehouseId = $('#rejectedGoodsTagForm select[name=storeId]').val();
          let printParamsList = [];
          let obj = {};
          obj.printNum = printCount;
          obj.storageNum = item.prodNum || 1;
          obj.warehouseId = warehouseId;
          obj.prodSId = item.id;
          printParamsList.push(obj);
          let printResData = commonGetPrintDataByLoopRequest(printParamsList);
          Promise.all(printResData).then(res => {
            let printParams = [];
            for(let k=0; k<res.length; k++){
              let item = res[k];
              if(typeof(item) == 'string'){
                return layer.msg(item, {icon:7});
              }else{
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = item.labelUrl;
                obj.width = item.width;
                obj.height = item.height;
                obj.printName = item.printName;
                //obj.addFlag = true; //退货不需要补打标
                //logistics_label_pdf_print(obj);
                printParams.push(obj);
              }
            }
            commonExecutePrintJobs(printParams);
          });
        }else{
          return layer.msg('打印次数必须输入正整数', {icon: 7});
        }

    }
    window.printTagBarcode= function(aDom){
        let item = $(aDom).parent('div').find('input[type=hidden]').val() || '{}';
        let itemObj = JSON.parse(item);
        console.log(itemObj);
        let printCount = $(aDom).parent('div').find('input.printTagNumInput').val();
        let pattern = /^[1-9]\d*$/;
        if(pattern.test(printCount)){
          for(let i=0; i<printCount; i++){
            printBarcodeRejectedData([itemObj]);
          }
        }else{
          return layer.msg('打印次数必须输入正整数', {icon: 7});
        }
    }

    window.printAllTag = function() {
        if (goodsDatas.length > 0) {
          //let warehouseTypeName = $('#rejectedGoodsTagForm select[name=warehouseType]>option:selected').text();
         // if(warehouseTypeName.indexOf('平台仓')> -1 ){
          //  printBarcodeRejectedData(goodsDatas);
          //}else{
          //  printRejectedData(goodsDatas)
         // }
         //console.log(goodsDatas);
          let printParamsList = [];
          for(let i=0; i<goodsDatas.length;i++){
            let item = goodsDatas[i];
            let obj = {};
            obj.printNum = item.printNumber || 1;
            obj.storageNum = item.printNumber || 1;
            obj.warehouseId = $('#rejectedGoodsTagForm select[name=storeId]').val();
            obj.prodSId = item.id;
            printParamsList.push(obj);
          }
          let printResData = commonGetPrintDataByLoopRequest(printParamsList);
          Promise.all(printResData).then(res => {
            let printParams = [];
            for(let k=0; k<res.length; k++){
              let item = res[k];
              if(typeof(item) == 'string'){
                return layer.msg(item, {icon:7});
              }else{
                let obj = {};
                obj.printType = 19;
                obj.labelUrl = item.labelUrl;
                obj.width = item.width;
                obj.height = item.height;
                obj.printName = item.printName;
                //obj.addFlag = true; //退货不需要补打标
                //logistics_label_pdf_print(obj);
                printParams.push(obj);
              }
            }
            commonExecutePrintJobs(printParams);
          });
        } else {
            layer.msg('请查询商品')
        }
    }

    function printBarcodeRejectedData(data){
      var printData = [];
      for(var i=0; i<data.length; i++){
          var item = data[i];
          var obj = {};
          obj.printNum = 1;
          obj.unit = item.unit; //单位
          obj.prodSSku = item.prodSSku; //子SKU
          obj.stockLocation = item.locationCode;
          obj.printerName = "6515"; //调用的打印机名称
          obj.title = item.title;
          obj.storageNumber="";
          if (obj.title.indexOf("备注") == -1) {
              if (obj.packDesc != null && obj.packDesc != '') {
                  obj.title = obj.title + "(" + obj.packDesc + ")";
              }
          }
          obj.printType = 2; //打印入库单标签
          printData.push(obj)
      };
      epeanPrint_plugin_fun(2,printData,function(){
          layer.msg('打印完成',{icon:1})
      });
    }

    function printRejectedData(data){
        var printData = [];
        for(var i=0; i<data.length; i++){
            var item = data[i];
            var obj = {};
            obj.printNum = 1;
            obj.unit = item.unit; //单位
            obj.prodSSku = item.sSku; //子SKU
            obj.stockLocation = item.locationCode;
            obj.inPackType = item.inPackType; //入库包装类型
            obj.packDesc = item.packDesc; //入库包装类型
            obj.printerName = "6515"; //调用的打印机名称
            obj.title = item.title;
            obj.storageNumber="";
            if (obj.title.indexOf("备注") == -1) {
                if (obj.packDesc != null && obj.packDesc != '') {
                    obj.title = obj.title + "(" + obj.packDesc + ")";
                }
            }
            obj.printType = 2; //打印入库单标签
            printData.push(obj)
        };
        epeanPrint_plugin_fun(2,printData,function(){
            layer.msg('打印完成',{icon:1})
        });
    }

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
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
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

    //日期范围
    laydate.render({
        elem: '#rejectedGoodsTag_timerange_input'
        ,range: true
        ,trigger: 'click'
    });

    // 进入页面获取焦点
    $('#queryId').focus();

    // 扫描单号触发回车事件
    $('#queryId').keydown(function(e) {
        if (e.keyCode == 13) {
            needConfirmModify = false;
            getDisplayData();
            return false;
        }
    });

})
</script>