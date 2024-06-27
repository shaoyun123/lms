;
(function($, layui, window, document, undefined) {
    layui.use(['admin', 'table', 'form', 'laydate','formSelects'], function() {
        var admin = layui.admin,
            table = layui.table,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            form = layui.form;
        //表格固定头
        UnifiedFixedFn('instorereturnsCard');
        //渲染时间
        let nowdate = new Date(new Date().toLocaleDateString()).getTime()
        let timeEnd = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
        let timeStart = Format(new Date(nowdate - 7 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
        let timeVal = timeStart + ' - ' + timeEnd;
        laydate.render({
          elem: '#instorereturns_times',
          type: 'datetime',
          value: timeVal,
          inputAuto: true,
          range: true,
          showShortcuts: true
        });
        form.render()
        let transObjToArr = function(arr){
          let newArr = [];
          for(let i=0; i<arr.length; i++){
            let obj = {};
            let item = arr[i];
            let key = Object.keys(item)[0];
            obj.code = item[key];
            obj.name = key;
            newArr.push(obj);
          }
          return newArr;
        }
        //搜索
        let instorereturnsName = {
          //ztt20231222-初始化搜索条件
          init(){
            commonReturnPromise({
              url: '/lms/storageOtherLoading/init'
            }).then(res => {
              //装车人/上架人
              let loadingPerson = res['装车'];
              let shelvesPerson = res['上架'];
              let loadingArr = transObjToArr(loadingPerson);
              let shelvesArr = transObjToArr(shelvesPerson);
              //默认渲染装车人
              commonRenderSelect('instorereturns_operatorIdListStr', loadingArr, {code: 'code',name: 'name'}).then(()=>{
                formSelects.render('instorereturns_operatorIdListStr');
              })
              //监听切换-渲染不同的逻辑
              form.on('select(instorereturns_operateTypeFilter)', function(obj){
                if(obj.value == 1){
                  commonRenderSelect('instorereturns_operatorIdListStr', shelvesArr, {code: 'code',name: 'name'}).then(()=>{
                    formSelects.render('instorereturns_operatorIdListStr');
                  })
                }else{
                  commonRenderSelect('instorereturns_operatorIdListStr', loadingArr, {code: 'code',name: 'name'}).then(()=>{
                    formSelects.render('instorereturns_operatorIdListStr');
                  })
                }
              });
              //入库类型
              let loadingTypeListArr = res['入库类型'];
              let ltlArr = transObjToArr(loadingTypeListArr);
              commonRenderSelect('instorereturns_loadingTypeListStr', ltlArr, {code: 'code',name: 'name'}).then(()=>{
                formSelects.render('instorereturns_loadingTypeListStr');
              })
            });
          },
          //数据处理
          dataHandle(data){
            if(data.times){
              var timeArr =data.times.split(' - ');
              data.timeStart = timeArr[0];
              data.timeEnd = timeArr[1];
            }else{
                data.timeStart = '';
                data.timeEnd='';
            };
            delete data.times;
            return data;
          },
          //表格渲染
          tableRender(data){
            let _this= this;
            table.render({
              elem: "#instorereturns_table",
              id: "instorereturns_tableId",
              method: "POST",
              contentType: 'application/x-www-form-urlencoded',
              where: data,
              unFixedTableHead: true,
              url: "/lms/storageOtherLoading/list.html",
              cols: [
                [
                  {
                    type: 'checkbox',
                    width: 30
                  },
                  {
                    title: '图片',
                    field: 'imageUrl',
                    templet: '#instorereturns_productImage',
                    width: 70
                  },
                  {
                    title: "SKU",
                    field: "sku",
                    width: 105
                  },
                  {
                    title: '库位',
                    field: 'locationCode',
                    width: 110
                  },
                  {
                    title: "商品名称",
                    field: "prodTitle"
                  }, 
                  {
                    title: '入库类型',
                    field: 'loadingTypeStr',
                    width: 90
                  },
                  {
                    title: '上架数量<br><font color="red">总:<span id="instorereturns_scanNumber_total"></span></font><i class="layui-icon layui-icon-about ml10" lay-tips="仅统计当前页"></i>',
                    field: 'scanNumber',
                  },
                  {
                    title: '入库金额<br><font color="red">总:<span id="instorereturns_purchaseCostPrice_total"></span></font><i class="layui-icon layui-icon-about ml10" lay-tips="仅统计当前页"></i>',
                    field: 'purchaseCostPrice',
                    templet: `<div>
                      <div>单: {{d.purchaseCostPrice || ''}}</div>
                      <div>总: {{d.totalPurchaseCostPrice|| ''}} </div>
                    </div>`
                  },
                  {
                    title: '仓库',
                    field: 'warehouseName',
                  },
                  // {
                  //   title: '操作人员',
                  //   field: 'creator',
                  // },
                  {
                    title: '操作',
                    field: 'createTime',
                    templet: `<div>
                    <div>装车: {{d.creator || ''}} {{Format(d.createTime,'yyyy-MM-dd hh:mm:ss') || ''}}</div>
                    <div>上架: {{d.shelfOperator || ''}} {{Format(d.shelfTime,'yyyy-MM-dd hh:mm:ss') || ''}} </div>
                    </div>`,
                    width: 225
                  },
                  {
                    title: '备注',
                    field: 'remark',
                    edit: "text"
                  },
                ]
              ],
              created: function(res){
                let tableData = res.data || [];
                let totalNum= 0; //总数量
                let totalMoney = 0; //总金额
                for(let i=0; i<tableData.length; i++){
                  let item = tableData[i];
                  totalNum += Number(item.scanNumber || 0);
                  totalMoney +=Number(item.purchaseCostPrice || 0);
                }
                res.totalMoney = totalMoney;
                res.totalNum = totalNum;
              },
              page: true,
              limit: 300,
              limits: [300, 500, 1000],
              done: function(res){
                imageLazyload();
                _this.rowEdit();
                //赋值
                $('#instorereturns_scanNumber_total').text(res.totalNum.toFixed(2));
                $('#instorereturns_purchaseCostPrice_total').text(res.totalMoney.toFixed(2));
              }
          });
          },
          rowEdit(){
            table.on('edit(instorereturns_tableFilter)', function(obj){
              let rowData = obj.data;
              commonReturnPromise({
                url: '/lms/storageOtherLoading/updateRemark.html',
                type: 'post',
                params: {
                  id: rowData.id,
                  remark: rowData.remark
                }
              }).then(res => {
                layer.msg(res || '操作成功', {icon:1});
              })
            });
          },
          //导出功能
          exportHandle(){
            let _this = this;
            $('#instorereturns_exportBtn').on('click', function(){
              let formData2 = new FormData();
              let formData = serializeObject($('#instorereturnsForm'));
              let handleData = _this.dataHandle(formData);
              let checkStatus = table.checkStatus('instorereturns_tableId');
              let ckedData = checkStatus.data;
              if(ckedData.length > 0){
                let idList = ckedData.map(item => item.id).join(',');
                formData2.append("idList", idList);
              }
              formData2.append("skuStr", handleData.skuStr);
              formData2.append("timeStart", handleData.timeStart);
              formData2.append("timeEnd", handleData.timeEnd);
              formData2.append('timeType', handleData.timeType);
              formData2.append('loadingTypeList', handleData.loadingTypeList);
              formData2.append('operateType', handleData.operateType);
              formData2.append('operatorIdList', handleData.operatorIdList);
              transBlob({
                url: "/lms/storageOtherLoading/exportData.html",
                formData: formData2,
                }, 'post').then(function () {
                    loading.hide();
                }).catch(function (err) {
                    layer.msg(err, {icon: 2});
                });
            });
          },
          //清空功能
          resetHandle(){
            let _this = this;
            $('#instorereturns_cleanBtn').click(function(){
              $("#instorereturnsForm").find('[name=skuStr]').val('');
              $("#instorereturnsForm").find('[name=times]').val('');
              formSelects.value('instorereturns_loadingTypeListStr', [])
              formSelects.value('instorereturns_operatorIdListStr', [])
              form.render()
            });
          }
        };

        //导出
        instorereturnsName.exportHandle();
        //清空表单
        instorereturnsName.resetHandle();
        //初始化搜索条件
        instorereturnsName.init();
        //表单提交事件
        form.on("submit(instorereturns_submit)", function(data) {
          let handleData = instorereturnsName.dataHandle(data.field); //获取到表单提交对象
          instorereturnsName.tableRender(handleData);
        });

    });
  })(jQuery, layui, window, document);
