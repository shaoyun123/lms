;
(function ($, layui, window, document, undefined) {
  layui.use(['admin', 'table', 'form', 'layer'], function () {
    var admin = layui.admin,
      table = layui.table,
      layer = layui.layer,
      form = layui.form;
    form.render();
    let productinfoName = {
      ownerUser () {
        commonReturnPromise({
          url: '/lms/dabaoProductInfo/getOwnerUserList.html'
        }).then(res => {
          commonRenderSelect('productinfo_ownerUserId', res).then(() => {
            form.render('select');
          })
        })
      },
      tablerRender (data) {
        let _this = this;
        table.render({
          elem: '#productinfo_table',
          id: 'productinfo_tableId',
          method: 'POST',
          where: data,
          url: '/lms/dabaoProductInfo/listProductInfo.html',
          cols: [
            [
              { type: 'checkbox', width: 30 },
              { field: 'image', title: "商品图片", templet: '#productinfo_img' },
              { field: "itemId", title: "商品ID" },
              { field: "ownerUserId", title: "货主" },
              { field: "itemCode", title: "SKU" },
              { field: "name", title: "商品名称" },
              { field: "dabaoSize", title: "尺寸(cm)" },
              { field: "cartonWeight", title: "重量(g)" },
              { field: "dabaoStock", title: "优选仓库存", templet:"<div>总量：<span>{{d.dabaoStock===undefined ? '' : d.dabaoStock }}</span><br/>可用：<span>{{d.dabaoAvailableStock===undefined ? '' : d.dabaoAvailableStock}}</span></div>"},
              { field: "oaStock", title: "OA库存" },
              { field: "confirmStatus", title: "回传状态", templet: "<div>{{d.confirmStatus == true? '已回传' : '未回传'}}</div>" },
              { field: "skuMappingStatus", title: "SKU映射状态", templet: "<div>{{d.skuMappingStatus == true? '已映射' : '未映射'}}</div>" },
              { field: "bizzOwner", title: "开发" },
              { title: '操作', align: 'center', toolbar: '#productinfo_bar' }
            ]
          ],
          page: true,
          limit: 300,
          limits: [300, 500, 1000],
          done: function () {
            imageLazyload();
            _this.watchBar();
          }
        });
      },
      watchBar () {
        let _this = this;
        table.on('tool(productinfo_tableFilter)', async function (obj) {
          let data = obj.data;
          if (obj.event == 'echo') { //回传商品信息
            await _this.packageFn(data.id);
          }
        });
      },
      exportHandle () {
        $('#productinfo_export').on('click', async function(){
          try {
            let selectedData = await commonTableCksSelected('productinfo_tableId');
            let ids = selectedData.map(item => item.id).join(',');
            layer.confirm('确认导出已选商品吗?', {icon: 3, title:'提示'}, function(index){
              layer.close(index);
              submitForm({ ids }, '/lms/dabaoProductInfo/exportorder.html', "_blank")
            });
          } catch (err) {
            // console.log(err);
            // layer.msg(typeof(err)== 'string'? err : err.message, { icon: 2 });
            let formData = serializeObject($('#productinfoSearchForm'));
            formData.page = 1;
            formData.limit = 100000;
            commonReturnPromise({
              url: '/lms/dabaoProductInfo/listProductInfo.html',
              type: 'post',
              params: formData
            }).then(res => {
              let ids = res.map(item => item.id);
              layer.confirm('确认导出当前搜索条件下的商品信息?', {icon: 3, title:'提示'}, function(index){
                layer.close(index);
                submitForm({ ids:ids.join(',') }, '/lms/dabaoProductInfo/exportorder.html', "_blank")
              });
            })
          }
        });
      },
      echoHandle () {
        let _this = this;
        $('#productinfo_echo').on('click', async function(){
          try {
            let selectedData = await commonTableCksSelected('productinfo_tableId');
            let idsArr = selectedData.map(item => item.id);
            await _this.packageFn(idsArr.join(','));
          } catch (err) {
            layer.msg(typeof(err)== 'string'? err : err.message, { icon: 2 });
          }
        });
      },
      delHandle () {
        let _this = this;
        $('#productinfo_del').on('click', async function(){
          let selectedData = await commonTableCksSelected('productinfo_tableId');
          let idsArr = selectedData.map(item => item.id);
          layer.confirm('确认作废该商品吗?', { icon: 3, title: '提示' }, async function (index) {
            try {
              let result = await _this.delAjax({ ids: idsArr.join(',') });
              layer.msg(result || '作废商品成功!', { icon: 1 });
              $('[lay-filter=productinfoSearch]').trigger('click');
              layer.close(index);
            } catch (err) {
              layer.msg(typeof (err) == 'string' ? err : err.message, { icon: 2 });
            }
          });
          
        });
      },
      echoAjax (ids) {
        return commonReturnPromise({
          url: '/lms/dabaoProductInfo/confrimPreserveInfo.html',
          type: 'post',
          params: ids
        });
      },
      delAjax (ids) {
        return commonReturnPromise({
          url: '/lms/dabaoProductInfo/deleteByIds.html',
          type: 'post',
          params: ids
        });
      },
      async packageFn (ids) {
        let _this = this;
        try {
          let result = await _this.echoAjax({ ids: ids });
          if (Object.prototype.toString.call(result) == '[object Object]') {
            layui.admin.batchResultAlert("回传商品信息完成:", result, function () {
              $('[lay-filter=productinfoSearch]').trigger('click');
            });
          }
        } catch (err) {
          layer.msg(typeof(err)== 'string'? err : err.message, { icon: 2 });
        }
      }
    };
    //渲染货主
    productinfoName.ownerUser();
    // 导出操作
    productinfoName.exportHandle()
    //回传商品信息操作
    productinfoName.echoHandle();
    //作废订单操作
    productinfoName.delHandle();
    //表格搜索
    form.on('submit(productinfoSearch)', function (data) {
      productinfoName.tablerRender(data.field);
      return false;
    });
  });
})(jQuery, layui, window, document);