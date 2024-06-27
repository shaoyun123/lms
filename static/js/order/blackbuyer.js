(function ($, layui, window, document, undefined){
  layui.use(['admin','form','table','layer','laydate', 'laytpl', 'laydate', 'formSelects', 'upload'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.date,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        upload = layui.upload,
        laydate = layui.laydate;
    form.render('select');
    UnifiedFixedFn('blackbuyer_card');
    //命名空间
    let blackbuyerName = {
      renderTime(){
        laydate.render({
          elem: "#blackbuyer_times",
          type: 'datetime',
          range: true,
        });
      },
      dataHandle(data){
        if (data.times) {
          let timesArr = data.times.split(" - ");
          data.startTime = timesArr[0];
          data.endTime = timesArr[1];
        } else {
          data.startTime = "";
          data.endTime = "";
        }
        delete data.times;
        return data;
      },
      renderCreator(){
        commonReturnPromise({
          url: '/lms/platBuyerBlacklist/listCreater'
        }).then(res => {
          commonRenderSelect("blackbuyer_creatorIdList", res, {
            name: "creator",
            code: "creatorId",
          }).then(() => {
            formSelects.render("blackbuyer_creatorIdList");
          });
        });
      },
      tableHandle(data){
        let _this = this;
        table.render({
            elem: '#blackbuyer_table',
            method: 'get',
            url: '/lms/platBuyerBlacklist/list',
            where: data,
            page: true,
            id: "blackbuyer_tableId",
            limits: [100, 200, 300],
            limit: 100,
            cols: [
              [
                {title: '买家ID', field: 'buyerId'},
                {title: '买家名称', field: 'buyer'},
                {
                  field: "remark",
                  title: "加入原因(可编辑)",
                  edit: "text",
                  style: 'background-color: #7FFFD4;height:50px;overflow:hidden;'
                },
                {
                  title: '操作', 
                  field: 'modifier',
                  width:250, 
                  templet: `
                  <div>
                    <div>创建人: {{d.creator || ''}}-{{Format(d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
                  </div>
                  `
                },
                {title: '操作',toolbar: '#blackbuyer_tableIdBar', width: 80}
              ]
            ],
            done: function(){
              _this.watchBar();
            }
        });
      },
      watchBar(){
        //监听编辑
        table.on('edit(blackbuyer_tableFilter)', function(obj){
          //  获取单元格编辑之前td的选择器
          let oldValue = $(this).prev('div').text();
          let value = obj.value; //得到修改后的值
          let data = obj.data //得到所在行所有键值
          if(oldValue !=value){
            commonReturnPromise({
              url: '/lms/platBuyerBlacklist/updateBlackBuyer',
              type: 'post',
              contentType: 'application/x-www-form-urlencoded',
              params: {
                id: data.id,
                remark: value
              }
            }).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              $('[lay-filter=blackbuyer_submit]').trigger('click');
            });
          }
        });
        //监听操作
        table.on('tool(blackbuyer_tableFilter)', function(obj) {
          let data = obj.data; //获得当前行数据
          let layEvent = obj.event; //获得 lay-event 对应的值
          if(layEvent == 'delete'){
            layer.confirm('确认删除黑名单?', {icon: 3, title:'提示'}, function(index){
              commonReturnPromise({
                url: `/lms/platBuyerBlacklist/deleteById?id=${data.id}`,
                type: 'post'
              }).then(res => {
                layer.msg(res || '操作成功', {icon: 1});
                layer.close(index);
                $('[lay-filter=blackbuyer_submit]').trigger('click');
              });
            });
          }
        });
      },
      downloadTemplate(){
        $('#blackbuyer_downloadBtn').click(function () {
          window.location.href = ctx + '/static/templet/黑名单买家导入模版.xlsx';
        });
      },
      upload(){
        upload.render({
          elem: '#blackbuyer_addTableBtn', //绑定元素
          url: `/lms/platBuyerBlacklist/importBlackBuyer`, //上传接口
          accept: 'file',//允许上传的文件类型
          exts: 'xlsx|xls',
          done: function(res) {
              if (res.code == '0000') {
                  layer.msg(res.msg || '上传成功',{ icon: 1 });
                  $('[lay-filter=blackbuyer_submit]').trigger('click');
              } else {
                  return layer.msg(res.msg || '上传失败',{ icon: 2 });
              }
          },
          error: function() {
              layer.msg('服务器出现故障!');
          }
      });
      },
      add(){
        $('#blackbuyer_addLayerBtn').on('click', function(){
          layer.open({
            type: 1,
            title: '新增黑名单',
            area: ['50%', '50%'],
            btn: ['新增', '关闭'],
            content: $('#blackbuyer_addLayer').html(),
            id: 'blackbuyer_addLayerId',
            yes: function(index, layero){
              let layerFormData = serializeObject(layero.find('form'));
              if(!layerFormData.buyerId.trim()){
                return layer.msg('买家ID必填', {icon: 7});
              }
              commonReturnPromise({
                url: '/lms/platBuyerBlacklist/insertBlackBuyer',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                params: layerFormData
              }).then(res => {
                layer.msg(res || '操作成功', {icon: 1});
                layer.close(index);
                $('[lay-filter=blackbuyer_submit]').trigger('click');
              });
            }
          });
        });
      }
    };
    //渲染时间
    blackbuyerName.renderTime();
    //初始化创建人
    blackbuyerName.renderCreator();
    //监听表单请求
    form.on('submit(blackbuyer_submit)', function(obj){
      let data = blackbuyerName.dataHandle(obj.field);
     blackbuyerName.tableHandle(data);
    });
    //下载
    blackbuyerName.downloadTemplate();
    //表格新增(上传)
    blackbuyerName.upload();
    //新增
    blackbuyerName.add();
  });

})(jQuery, layui, window, document);