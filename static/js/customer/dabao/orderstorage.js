;
(function ($, layui, window, document, undefined) {
  layui.use(['admin', 'table', 'form', 'layer', 'laydate'], function () {
    var admin = layui.admin,
      table = layui.table,
      layer = layui.layer,
      laydate = layui.laydate,
      form = layui.form;
    form.render();
    let orderstorageName = {
      times () {
        let nowdate = Date.now();
        let endTime = Format(nowdate, 'yyyy-MM-dd');
        let startTime = Format((nowdate - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        let timeVal = startTime + ' - ' + endTime;
        laydate.render({
          elem: '#orderstorage_times'
          , range: true
          ,value: timeVal
        });
      },
      ownerUser () {
        commonReturnPromise({
          url: '/lms/dabaoProductInfo/getOwnerUserList.html'
        }).then(res => {
          commonRenderSelect('orderstorage_ownerUserId', res).then(() => {
            form.render('select');
          })
        })
      },
      dataHandle (data) {
        if (data.putawayStatus!= '') {
          data.putawayStatus = Number(data.putawayStatus);
        }
        if (data.confirmStatus != '') {
          data.confirmStatus = Number(data.confirmStatus);
        }
        if (data.times) {
          var timeArr = data.times.split(' - ');
          data.beginTime = timeArr[0] + 'T00:00:00';;
          data.endTime = timeArr[1] + 'T23:59:59';
        } else {
          data.startTime = '';
          data.endTime = '';
        }
        data.skuList = data.skuList.trim().length>0 ? data.skuList.split(','): [];
        delete data.times;
        return data;
      },
      tableRender (data) {
        let _this = this;
        table.render({
          elem: '#orderstorage_table',
          id: 'orderstorage_tableId',
          method: 'POST',
          where: data,
          contentType: 'application/json',
          url: '/lms/dabaoOrderStorage/list',
          cols: [
            [
              { type: 'checkbox', width: 30 },
              { field: 'orderCode', title: "计划单号", templet: '#orderstorage_orderCode' },
              { field: "ownerUserId", title: "货主" },
              { field: "bizType", title: "业务类型", templet: '#orderstorage_bizType' },
              { field: "confirmStatus", title: "回传状态", templet: "<div>{{d.confirmStatus == true? '已回传' : '未回传'}}</div>" },
              { field: "putawayStatus", title: "上架状态", templet: "<div>{{d.putawayStatus == true? '已上架' : '未上架'}}</div>" },
              { field: "createTime", title: "创建时间", templet: `<div><span>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</span></div>` },
              { field: "supplierCode", title: "供应商编码" },
              { field: "totalOrderItemCount", title: "种类" },
              { field: "shipmentCount", title: "发货数量" },
              { title: '操作', align: 'center', toolbar: '#orderstorage_bar' }
            ]
          ],
          page: true,
          limit: 300,
          limits: [300, 500, 1000],
          done: function () {
            _this.watchBar();
          }
        });
      },
      watchBar () {
        let _this = this;
        table.on('tool(orderstorage_tableFilter)', async function (obj) {
          let data = obj.data;
          if (obj.event == 'push') { //上架
            let obj = {
              type: 1,
              orderCodeList: [data.orderCode]
            };
            await _this.pushAndEchoFn(obj, '确认上架该商品吗?', '上架成功');
          } else if (obj.event == 'echo') {//回传
            let obj = {
              type: 2,
              orderCodeList: [data.orderCode]
            };
            await _this.pushAndEchoFn(obj, '确认回传该商品吗?', '回传成功');
          } else if (obj.event == 'detail') { //详情
            _this.detailLayer(data.orderCode);
          }
        });
      },
      async pushAndEchoFn (obj, tip, msg) {
        let _this = this;
        layer.confirm(tip, { icon: 3, title: '提示' }, async function (index) {
          try {
            let result = await _this.pushAndEchoAjax(obj);
            if (Object.prototype.toString.call(result) == '[object Object]') {
              layui.admin.batchResultAlert("回传商品信息完成:", result, function () {
                $('[lay-filter=orderstorageSearch]').trigger('click');
              });
            }
          } catch (err) {
            layer.msg(typeof (err) == 'string' ? err : err.message, { icon: 2 });
          }
        });
      },
      pushHandle () {
        let _this = this;
        $('#orderstorage_push').on('click', async function () {
          try {
            let selectedData = await commonTableCksSelected('orderstorage_tableId');
            let idsArr = selectedData.map(item => item.orderCode);
            await _this.pushAndEchoFn({ type: 1, orderCodeList: idsArr }, '确认上架该商品吗?', '上架成功');
          } catch (err) {
            layer.msg(typeof (err) == 'string' ? err : err.message, { icon: 2 });
          }
        });
      },
      echoHandle () {
        let _this = this;
        $('#orderstorage_echo').on('click', async function () {
          try {
            let selectedData = await commonTableCksSelected('orderstorage_tableId');
            let idsArr = selectedData.map(item => item.orderCode);
            await _this.pushAndEchoFn({ type: 2, orderCodeList: idsArr }, '确认回传该商品吗?', '回传成功');
          } catch (err) {
            layer.msg(typeof (err) == 'string' ? err : err.message, { icon: 2 });
          }
        });
      },
      detailLayer (orderCode) {
        let _this = this;
        _this.detailAjax(orderCode).then(res => {
          if (res && res.length > 0) {
            layer.open({
              type: 1,
              title: '商品详情',
              area: ['40%', '40%'],
              content: $('#orderstorage_detailLayer').html(),
              id: 'orderstorage_detailLayerId',
              success: function () {
                _this.detailRender(res);
              }
            })
          } else {
            layer.msg('暂无详情信息', { icon: 7 });
          }
        });
      },
      detailRender (data) {
        let str = '';
        for (let i = 0; i < data.length; i++){
          let item = data[i];
          str += `
            <tr>
                <td><img width="60" height="60" src="${item.image || ''}" onerror="layui.admin.img_noFind()"></td>
                <td>${item.itemId}</td>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.itemQuantity}</td>
            </tr>
          `;
        }
        $('#orderstorage_detail_tbody').empty().html(str);
      },
      pushAndEchoAjax (obj) {
        return commonReturnPromise({
          url: '/lms/dabaoOrderStorage/update',
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify(obj)
        });
      },
      detailAjax (orderCode) {
        return commonReturnPromise({
          url: `/lms/dabaoOrderStorage/get/product/list/${orderCode}`,
        });
      }
    };
    //渲染货主
    orderstorageName.ownerUser();
    //渲染时间
    orderstorageName.times();
    //渲染上架
    orderstorageName.pushHandle();
    //渲染回传
    orderstorageName.echoHandle();
    //表格搜索
    form.on('submit(orderstorageSearch)', function (data) {
      let submitData = orderstorageName.dataHandle(data.field);
      orderstorageName.tableRender(submitData);
      return false;
    });
  });
})(jQuery, layui, window, document);