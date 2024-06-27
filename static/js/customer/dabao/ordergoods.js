;
(function ($, layui, window, document, undefined) {
  layui.use(['admin', 'table', 'form', 'layer', 'laydate', 'formSelects'], function () {
    var admin = layui.admin,
      table = layui.table,
      layer = layui.layer,
      laydate = layui.laydate,
      formSelects = layui.formSelects,
      form = layui.form;
    form.render('select');
    let ordergoodsName = {
      initRender () {
        this.listenumAjax().then(res => {
          let { ownerUserList, dabaoProcessStatus, orderProcessStatus, platAcct, platOrderStatusList } = res;
          //货主名称ownerUserIdList
          commonRenderSelect('ordergoodsSearch_ownerUserIdLists', ownerUserList || []).then(function () {
            formSelects.render('ordergoodsSearch_ownerUserIdList');
          });
          //店铺platAcct
          commonRenderSelect('ordergoodsSearch_storeAcctIds', platAcct || [], { name: 'value', code: 'name' }).then(function () {
            formSelects.render('ordergoodsSearch_storeAcctIds');
          });
          //平台状态platOrderStatusList
          commonRenderSelect('ordergoodsSearch_platOrderStatusLists', platOrderStatusList || []).then(function () {
            formSelects.render('ordergoodsSearch_platOrderStatusLists');
          });
          //优选仓状态dabaoProcessStatus
          commonRenderSelect('ordergoodsSearch_processStatusLists', dabaoProcessStatus || [], { name: 'value', code: 'name' }).then(function () {
            formSelects.render('ordergoodsSearch_processStatusLists');
          });
          //OA状态orderProcessStatus
          commonRenderSelect('ordergoodsSearch_oaStatusLists', orderProcessStatus || [], { name: 'value', code: 'name' }).then(function () {
            formSelects.render('ordergoodsSearch_oaStatusLists');
          });
        });
        //渲染时间[默认一个月]
        let ordergoods_nowDateString = new Date().getTime();
        let ordergoods_dateFiftweenSting = ordergoods_nowDateString - 30*24*60*60*1000;
        let ordergoods_dateStart = Format(ordergoods_dateFiftweenSting, 'yyyy-MM-dd');
        let ordergoods_dateEnd = Format(ordergoods_nowDateString, 'yyyy-MM-dd');
        laydate.render({
          elem: '#ordergoodsSearch_times',
          range: true,
          value: ordergoods_dateStart +' - '+ ordergoods_dateEnd
        });
      },
      listenumAjax () { //接口枚举
        return commonReturnPromise({
          url: '/lms/dabaoOrderMain/listenum.html',
          type: 'post',
        });
      },
      dataHandle (data) {
        //请求数据的处理
        if (data.times) {
          let timeArr =data.times.split(' - ');
          data.orderTimeStart = timeArr[0] + ' 00:00:00';
          data.orderTimeEnd = timeArr[1] + ' 23:59:59';
        } else {
          data.orderTimeStart = '';
          data.orderTimeEnd='';
        }
        delete data.times;
        return data;
      },
      tableRender (data) {
        let _this = this;
        //渲染表格
        table.render({
          elem: "#ordergoods_table",
          id: 'ordergoods_tableId',
          method: 'post',
          url: '/lms/dabaoOrderMain/listDabaoOrderInfo.html',
          where: data,
          cols: _this.cols(),
          page: true,
          limits: [100, 500, 1000],
          limit: 100,
        });
      },
      cols () {
        //表格列
        return [
          [
            {type: 'checkbox', width:30},
            { title: "订单号", field: 'orderNum', templet: '#ordergoods_orderNum' },
            { title: "订单金额", field: 'orderMoney', templet: '#ordergoods_orderMoney' },
            { title: "商品", field: 'orderGoods', templet: '#ordergoods_orderGoods' },
            { title: "状态", field: 'orderStatus', templet: '#ordergoods_orderStatus' },
            { title: "物流", field: 'orderLogis', templet: '#ordergoods_orderLogis' },
            { title: "时间", field: 'orderTimes', templet: '#ordergoods_orderTimes' },
            { title: "仓库处理", field: 'orderWarehouse', templet: '#ordergoods_orderWarehouse' }
          ]
        ]
      },
      export () {
        $('#ordergoods_export').on('click', function () {
          commonTableCksSelected('ordergoods_tableId').then(data => {
            let idsArr = data.map(item => item.id);
            submitForm({ orderIds: idsArr.join(',') }, '/lms/dabaoOrderMain/exportorder.html');
          }).catch(err => {
            layer.msg(err, { icon: 7 });
          })
          
        });
      }
    };
    //页面初始化就执行
    ordergoodsName.initRender();
    //导出功能
    ordergoodsName.export();
    //表单搜索
    form.on('submit(ordergoodsSearch)', function(obj){
      var formData = ordergoodsName.dataHandle(obj.field);
      console.log(formData);
      ordergoodsName.tableRender(formData);
  });
  });
})(jQuery, layui, window, document);