/*
 * @Author: ztao
 * @Date: 2024-01-03 10:11:45
 * @LastEditTime: 2024-01-24 15:36:35
 * @Description: 日志分析js
 */
;
(function($, layui, window, document, undefined) {
    layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl','laydate'], function() {
      let admin = layui.admin,
          table = layui.table,
          element = layui.element,
          layer = layui.layer,
          laytpl = layui.laytpl,
          laydate = layui.laydate,
          form = layui.form;

    let loganalyzeName = {
      //初始化时间
      initTime(){
        laydate.render({
          elem: "#loganalyze_times",
          range: true,
        });
      },
      //处理搜索条件
      dataHandle(data){
        if (data.times) {
          var timeArr = data.times.split(' - ');
          data.timeStart = timeArr[0];
          data.timeEnd = timeArr[1];
        } else {
            data.timeEnd = '';
            data.timeStart = '';
        }
        delete data.times;
        return data;
      },
      //监听tab
      tabHandle(){
        element.on('tab(loganalyze_tabs)', function(data){
          if(data.index == 0) { //未处理
            $('#loganalyze_searchForm [name=dealStatus]').val(false);
          }else if(data.index == 1){ //已处理
            $('#loganalyze_searchForm [name=dealStatus]').val(true);
          }
          $('[lay-filter="loganalyzeSearch_submit"]').trigger('click');
      });
      },
      //渲染表格
      tableRender(data){
        let _this = this;
        table.render({
          elem: "#loganalyze_table",
          method: "post",
          url: "/lms/logAnalyze/queryLogAnalyzeInfo",
          contentType: 'application/json',
          where: data,
          page: true,
          limits: [100, 300, 500],
          limit: 100,
          id: "loganalyze_tableId",
          request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
          },
          cols: [
            [
              {type: 'checkbox', width: 60},
              { title: "执行机器", field: "executeMachine", width: 180 },
              { title: "错误信息", field: "errorCodeMsg", templet: '#loganalyze_errorCodeMsg' },
              { title: "出现次数", field: "occurTimes", width: 70 ,sort: true},
              { title: "修改人",field: "modifier", width: 130},
              { title: "时间", field: "times", templet: "#loganalyze_tableTime", width: 130},
            ],
          ],
          done: function(res){
            if(JSON.parse(data.dealStatus)){
              $('#loganalyze_count1').html('');
              $('#loganalyze_count2').html(`(${res.count})`);
            }else{
              $('#loganalyze_count1').html(`(${res.count})`);
              $('#loganalyze_count2').html('');
            }
            _this.watchBar();
          }
        });
      },
      watchBar(){
        table.on('tool(loganalyze_tableFilter)', function(obj) {
          let data = obj.data;
          if (obj.event == 'errMsg') { //备注弹框
            let str = `<textarea disabled style="width: 100%;height: 100%;padding-left: 10px">${data.allStackInfo}</textarea>`
            layer.open({
              type: 1,
              title: '详细报错信息',
              area: ['85%', '85%'],
              btn: ['关闭'],
              content: str
            });
          }
      });
      },
      //设为白名单
      setWhiteFn(){
        $('#loganalyze_setWhiteBtn').on('click', function(){
          commonTableCksSelected('loganalyze_tableId').then(data => {
            let idList =data.map(item=> item.id);
            layer.open({
              type:1,
              title: '设为白名单',
              area: ['70%', '50%'],
              content: $('#loganalyze_setWhiteLayer').html(),
              id: 'loganalyze_setWhiteLayerId',
              btn: ['保存','关闭'],
              success: function(){
                //渲染时间
                laydate.render({ 
                  elem: '#loganalyze_expireTime'
                  ,type: 'datetime'
                  ,value: new Date(4102415999000)
                });
              },
              yes: function(index,layero){
                let expireTime = layero.find('[name=expireTime]').val();
                let remark = layero.find('[name=remark]').val();
                if(remark &&remark.length>255){
                  return layer.msg('备注最长255', {icon:7});
                }
                commonReturnPromise({
                  url: '/lms/logAnalyze/batchMarkWhite',
                  type: 'post',
                  contentType: 'application/json',
                  params: JSON.stringify({
                    idList: idList,
                    remark: remark,
                    expireTime: expireTime
                  })
                }).then(res => {
                  layer.msg(res || '操作成功', {icon: 1});
                  layer.close(index);
                  $('[lay-filter="loganalyzeSearch_submit"]').trigger('click');
                });
              }
            });
          }).catch(err=> {
            layer.msg(err, {icon:7});
          });
          
        });
      },
      //查询白名单
      searchWhiteFn(){
        $('#loganalyze_searchWhiteBtn').on('click', function(){
          layer.open({
            type: 1,
            title: '白名单列表',
            area: ['70%', '70%'],
            btn: ['关闭'],
            content: $('#loganalyze_searchWhiteLayer').html(),
            id: 'loganalyze_searchWhiteLayerId',
            success: function(){
              table.render({
                elem: "#loganalyze_searchWhiteTable",
                method: "post",
                url: "/lms/logAnalyze/queryWhiteList",
                contentType: 'application/json',
                where: {},
                page: true,
                limits: [100, 300, 500],
                limit: 100,
                id: "loganalyze_searchWhiteTableId",
                request: {
                  pageName: 'pageNum' //页码的参数名称，默认：page
                  ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                cols: [
                  [
                    { title: "错误信息", field: "errorCodeMsg",width: '40%'},
                    { title: "修改人",field: "modifier", width: '10%'},
                    { title: "备注",field: "remark", width: '30%'},
                    { title: "时间", field: "times", width: '20%',templet: `
                      <div>
                        <div class="alignLeft"><span style="color:#999">创建: </span>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>
                        <div class="alignLeft"><span style="color:#999">修改: </span>{{ Format( d.modifyTime, "yyyy-MM-dd hh:mm:ss")}}</div>
                        <div class="alignLeft"><span style="color:#999">过期: </span>{{ Format( d.expireTime, "yyyy-MM-dd hh:mm:ss")}}</div>
                      </div>
                    `},
                  ],
                ],
              });
            }
          });
        });
      },
      //批量处理
      batchFn(){
        $('#loganalyze_batchBtn').on('click', function(){
          commonTableCksSelected('loganalyze_tableId').then(data => {
            let idList =data.map(item=> item.id);
            commonReturnPromise({
              url: '/lms/logAnalyze/batchDeal',
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify({
                idList: idList
              })
            }).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              $('[lay-filter="loganalyzeSearch_submit"]').trigger('click');
            });
          }).catch(err=> {
            layer.msg(err, {icon:7});
          });
        });
      }
    };
    loganalyzeName.initTime();
    loganalyzeName.tabHandle();
    loganalyzeName.setWhiteFn();
    loganalyzeName.searchWhiteFn();
    loganalyzeName.batchFn();
    //表单搜索事件
    form.on('submit(loganalyzeSearch_submit)', function(obj) {
      let data = obj.field; //获取到表单提交对象
      let dataObj = loganalyzeName.dataHandle(data);
      loganalyzeName.tableRender(dataObj);
    });
  });
})(jQuery, layui, window, document);
