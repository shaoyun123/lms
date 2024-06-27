/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laydate"], function () {
  var admin = layui.admin,
      form = layui.form,
      table = layui.table,
      layer = layui.layer,
      element = layui.element,
      laydate = layui.laydate,
      $ = layui.$;
  form.render('select');
  form.render('radio');
  form.render('checkbox');

  laydate.render({
      elem: '#queryTime_purchaseReport',
      type: 'month'
  })
  // 初始化设置日期为当前1个月内时间
  var date = new Date()
  var timeStr = format(date, 'yyyy-MM')
  $('#queryTime_purchaseReport').val(timeStr)
    //远程搜索功能
    var dim = new DimSearch('#name_purchaseReport', 'name', {
      url: '/prodSupplier/searchSupplier.html',
      query: 'name',
      label: 'supplier',
      type: 'post',
      isIncludeData:false,
      name: '.dimResultDiv_purchaseReport'
  });
  dim.init();

  $('#search_purchaseReport').click(function () {
      var data = getSerachData_purchaseReport()
      search_purchaseReport(data)
  });

  function getSerachData_purchaseReport(){
    const data = serializeObject($('#buyerProcessCountSearchForm'))
    return {month:data.month,name:data.name}
  }

    //滚动body,header跟随滚动
    $('.layui-table-body').on('scroll', function(e) {
        console.log('ffff')
        var leftPx = $(e.target).scrollLeft(); //获取表格body，滚动条距离左边的长度
        var left = 'translateX(-' + leftPx + 'px)';
        $('.layui-table-header .layui-table').css('transform', left); //设置表格header的内容反向(-)移动
    }); 
  // 初始化部门 采购员选项
  render_hp_orgs_users("#buyerProcessCountSearchForm")

  function judgeExist(value) {
     if (value === undefined || value === '') {
        return ''
     } else {
        return value
     }
  }
  //表格渲染结果
  //展示已知数据
  function search_purchaseReport(data) {

      table.render({
          elem: "#buyerPurchaseReport",
          id: 'buyerPurchaseReport',
          method: "post",
          url: ctx + "/prodSupplierScore/queryProdSupplierScore",
          where: data,
          contentType: 'application/json',
          request: {
            pageName: 'pageNum', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
          },
          cols: [
              [
                  //标题栏
                  {field: "", title: "供应商", width: 180,
                    templet: function (d) {
                    return `<div style="text-align: left">名称：${d.supplierName|| ""}<br>
                              编码：${d.supplierCode|| ""}<br>
                              类别：${d.cateCnName || ""}</div>`
                    }},
                  {field: "", title: "人员", width: 100,
                    templet: function (d) {
                    return `<div style="text-align: left">采购员：${d.buyer|| ""}<br>
                              开发：${d.bizz|| ""}<br>
                              整合：${d.integrator || ""}</div>`
                    }},
                  {field: "", title: "体量", width: 150,
                    templet: function (d) {
                    return `<div style="text-align: left">在售sku数量：${judgeExist(d.onSaleSkuNum) }<br>
                              停售sku数量：${judgeExist(d.offSaleSkuNum) }<br>
                              采购金额：${judgeExist(d.actPayMoney)}<br>
                              入库金额：${judgeExist(d.inMoney)}<br>
                              采购数量：${judgeExist(d.totalAmount)}<br>
                              采购sku个数：${judgeExist(d.totalSku)}<br>
                              采购订单数：${judgeExist(d.billNumber)}<br>
                            </div>`
                    }},
                    {field: "", title: "时效", width: 200,
                      templet: function (d) {
                      return `<div style="text-align: left">平均发货时效(h)：${d.avgSellerSendTime || '' }<br>
                              最长发货时效(h)：${d.avgSellerSendTime || '' }<br>
                              最短发货时效(h)：${d.minSellerSendTime || ''}<br>
                              最长-最短发货时间：${d.maxSubtractMin || ''}<br>
                              最长发货时效订单：${d.maxTimediffBillnumber || ''}<br>
                              最短发货时效订单：${d.minTimediffBillnumber || ''}<br>
                            </div>`
                    }},
                    {field: "", title: "物流", width: 200,
                      templet: function (d) {
                      return `<div style="text-align: left">快递公司名称：${d.logisticname || '' }<br>
                              是否是江浙沪供应商：${d.ifJzh || '' }<br>
                            </div>`
                    }},
                    {field: "", title: "运费", width: 200,
                      templet: function (d) {
                      return `<div style="text-align: left">建议总运费：${judgeExist(d.allPredictLogisticFee) }<br>
                              实际支付总运费：${judgeExist(d.actLogisticFee) }<br>
                              均单运费：${judgeExist(d.avglogisticFee)}<br>
                              最高笔运费：${judgeExist(d.maxFee)}<br>
                              最低笔运费：${judgeExist(d.minFee)}<br>
                              最低运费采购订单：${d.minFeeBillnumber || ''}<br>
                              最高运费采购订单：${d.maxFeeBillnumber || ''}<br>
                              总采购重量：${d.allWeight || ''}<br>
                              均单采购重量：${d.avgWeight || ''}<br>
                              平均每kg支付的运费：${judgeExist(d.avgKgPrice)}<br>
                            </div>`
                    }},
                    {field: "", title: "异常运费", width: 200,
                      templet: function (d) {
                      return `<div style="text-align: left">异常运费订单：${d.abnormalBillnumber || '' }<br>
                              异常运费订单数量：${judgeExist(d.abnormalFeeCount)}<br>
                              异常运费金额：${judgeExist(d.abnormalFee)}<br>
                              异常运费订单比例：${judgeExist(d.abnormalRate)}<br>
                            </div>`
                    }},
                    {field: "", title: "异常订单", width: 160,
                      templet: function (d) {
                      return `<div style="text-align: left">异常订单数：${judgeExist(d.errorBillNumber)}<br>
                              异常率：${judgeExist(d.errorRate) }<br>
                              迟发率：${judgeExist(d.lateRate)}<br>
                            </div>`
                    }},
                    {field: "", title: "供应商配合情况", width: 180,
                      templet: function (d) {
                      return `<div style="text-align: left">包装率：${judgeExist(d.packRate)}<br>
                              是否物理分割：${d.ifDivision || '' }<br>
                              是否提供标识：${d.provideIdentification || ''}<br>
                              是否账期：${d.ifPayDate || ''}<br>
                            </div>`
                    }},
                    {field: "", title: "供应商总体评分", width: 200,
                      templet: function (d) {
                      return `<div style="text-align: left">异常率得分(0.2)：${judgeExist(d.errorScore) }<br>
                              迟发率得分(0.2)：${judgeExist(d.lateScore) }<br>
                              包装得分(0.2)：${judgeExist(d.packScore)}<br>
                              sku种类得分(0.1)：${judgeExist(d.skuScore)}<br>
                              入库金额得分(0.1)：${judgeExist(d.incomeScore)}<br>
                              物流费用得分(0.1)：${judgeExist(d.expressPriceScore)}<br>
                              账期得分(0.05)：${judgeExist(d.billScore)}<br>
                              服务评分(0.05)：${judgeExist(d.score)}<br>
                              供应商评分：${judgeExist(d.totalScore)}<br>
                              供应商评级：${d.totalRating || ''}<br>
                            </div>`
                    }},
              ],
          ],
          done: function(res, curr, count){
              $("#buyerPurchaseReport_colLen").text(res.count);
              // 表头固定
              theadHandle().fixTh({ id:'#buyerPurchaseReportCard',h: 50 })
          },
          page: true, //是否显示分页
          limits: [100, 500, 1000],
          limit: 100, //每页默认显示的数量
      });

  }

  $('#search_purchaseExport').on('click', function(){
    var data = getSerachData_purchaseReport()
    exportExcelAjax(data)

  });

   /*Excel导出*/
  function exportExcelAjax(data){
    loading.show();
    axios({
        method: 'post',
        url: '/lms/prodSupplierScore/exportProdSupplierScore',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'blob'
    }).then((res) => { // 处理返回的文件流
        // layer.close(index);
        loading.hide();
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        const link = document.createElement('a') // 创建a标签
        link.href = url
        link.download = '供应商信息表-'+format(Date.now(),"yyyy-MM-dd")+'.xlsx' // 重命名文件
        link.click()
        URL.revokeObjectURL(url);
    }).catch(err => {
        loading.hide();
        console.log(err);
    })

  }


  
});

