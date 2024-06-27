;(function($,layui,window,document,undefined){
  layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','upload','laydate'],function(){
      var admin = layui.admin,
          table = layui.table,
          element = layui.element,
          layer = layui.layer,
          upload = layui.upload,
          laydate = layui.laydate,
          formSelects = layui.formSelects,
          form = layui.form;
      form.render();
      //命名空间
      let reprintfacesheetName = {
        //渲染时间
        renderTime: function(){
          laydate.render({
              elem: '#reprintfacesheet_time',
              range: true,
              type: 'datetime'
          });
        },
        //渲染包装人
        renderUser(){
          commonReturnPromise({
            url: '/lms/logisLabelReprintRecord/getPackingUserInfo'
          }).then(res => {
            commonRenderSelect('reprintfacesheet_packingUserId', res, {code: 'packingUserId', name: 'packingUserName'}).then(() => {
              form.render('select');
            });
          });
        },
        //表格渲染
        tableRender(data){
          table.render({
            elem: '#reprintfacesheet_table',
            id: 'reprintfacesheet_tableId',
            method: 'POST',
            where: data,
            url: '/lms/logisLabelReprintRecord/list',
            cols: [
              [
                {title: '订单号', field: 'orderId'},
                {title: '跟踪号', field: 'logisTrackingNo'},
                {title: '包装人', field: 'packingUserName'},
                {title: '包装时间', field: 'packingTime', templet: `<div>{{Format(d.packingTime ||"",'yyyy-MM-dd hh:mm:ss')}}</div>`},
                {title: '面单补打人', field: 'reprintUserName'},
                {title: '面单补打时间', field: 'reprintTime',templet: `<div>{{Format(d.reprintTime ||"",'yyyy-MM-dd hh:mm:ss')}}</div>`}
              ]
            ],
            page: true,
            limit:300,
            limits:[100,300,500]
          });
        },
        //导出
        export(){
          //serializeObject($('#prodPackSpecSearchForm'))
          $('#reprintfacesheetExport').on('click', function(){
            let data = serializeObject($('#reprintfacesheetForm'));
            if(!data.sheetTime){
              return layer.msg('补打日期必填',{icon:7});
            }
            data.startTime = data.sheetTime.split(' - ')[0];
            data.endTime = data.sheetTime.split(' - ')[1];
            data.page = $('#reprintfacesheetCard .layui-laypage-skip>input').val() || 1;
            data.limit= $('#reprintfacesheetCard .layui-laypage-limits>select').val() || 300;
            delete data.sheetTime;
            let dataStr = `startTime=${data.startTime}&endTime=${data.endTime}&page=${data.page}&limit=${data.limit}&packingUserId=${data.packingUserId || ''}`;
            transBlob(
              {
                url: '/lms/logisLabelReprintRecord/exportRecord',
                formData: dataStr,
                contentType: 'application/x-www-form-urlencoded',
              },
              "post"
            )
              .then(function (result) {
                layer.msg(result, { icon: 1 });
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
        },
        //补打操作
        reprintHandle(){
          let _this = this;
          $('#reprintfacesheet_printBtn').on('click', function(){
            layer.open({
              type: 1,
              title: "补打面单",
              area: ["60%", "80%"],
              btn: ["修改", "关闭"],
              content: $("#reprintfacesheet_printLayer").html(),
              id: "reprintfacesheet_printLayerId",
              success: function (layero, index) {
                layero.find('[name=reprintNo]').on('keyup', function(e){
                  if(e.keyCode == 13){
                    let val = e.target.value.trim();
                    if(!val){
                      return layer.msg('请输入订单号/跟踪号', {icon: 7});
                    }
                    let param = {
                      reprintNo: val
                    };
                    commonReturnPromise({
                      url: '/lms/logisLabelReprintRecord/reprintLabel',
                      type: 'post',
                      params: param
                    }).then(res => {
                      _this.reprintTableRender(res, layero);
                    });
                  }
                });
              }
            });
          });
        },
        //补打表格
        reprintTableRender(obj, layero){
          let $tbody=layero.find('tbody');
          let trLen = $tbody.find("tr").length;
          let serialNum = Number($tbody.find("tr:first  td:first").text()) || 1;
          let trStr = `
          <tr>
            <td>${trLen==0 ? 1 : (serialNum+1)}</td>
            <td>${obj.orderId}</td>
            <td>${obj.platOrderId}</td>
            <td>${obj.logisTrackingNo}</td>
            <td>${obj.logisticsTypeName}</td>
          </tr>
          `;
          if(trLen>0){
            $tbody.find("tr:first").before(trStr);
            if(trLen >=5){
              $tbody.find("tr:last").remove();
            }
          }else{
            $tbody.html(trStr);
          }
          //获取焦点
          layero.find('[name=reprintNo]').focus().select();
          //还要执行打印操作
          let printObj= {};
          printObj.printType = 19;
          printObj.labelUrl = obj.ftpLabelUrl;
          printObj.width = obj.width;
          printObj.height = obj.height;
          printObj.printName = '100100';
          if (printObj.height === 150) {
            printObj.printName = '100150'
          }
          logistics_label_pdf_print(printObj);
        }
      };
      //初始化操作
      reprintfacesheetName.renderTime();
      reprintfacesheetName.renderUser();
      //搜索
      form.on('submit(reprintfacesheetSearch)', function(data){
        var data = data.field; //获取到表单提交对象
        if(!data.sheetTime){
            return layer.msg('补打日期必填',{icon:7});
        }
        data.startTime = data.sheetTime.split(' - ')[0];
        data.endTime = data.sheetTime.split(' - ')[1];
        delete data.sheetTime;
        reprintfacesheetName.tableRender(data);
      });
      //导出
      reprintfacesheetName.export();
      //补打操作
      reprintfacesheetName.reprintHandle();


  })
})(jQuery, layui, window, document);