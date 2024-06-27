<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>库位规格</title>

<div class="layui-fluid" id="warehouse"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <%-- 表格模块 --%>
            <div class="layui-card">
                <div class="layui-card-header" style="text-align:right;">
                  <span class="layui-btn layui-btn-sm" id="locationstandard_add">新增</span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="locationstandard_table" lay-filter="locationstandard_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-操作 --%>
<script type="text/html" id="locationstandard_table_bar">
  <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</span>
  <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</span>
</script>

<%-- 新增/编辑弹框 --%>
<script type="text/html" id="locationstandardEditAndAddLayer">
  <form class="layui-form" style="padding:20px 20px 0 0;">
    <div class="layui-form-item">
      <label class="layui-form-label">规格名称<font color="red">*</font></label>
      <div class="layui-input-block">
          <input type="text" class="layui-input" name="specName" lay-verify="required">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">长(cm)<font color="red">*</font></label>
      <div class="layui-input-block">
          <input type="text" class="layui-input" name="length" lay-verify="required">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">宽(cm)<font color="red">*</font></label>
      <div class="layui-input-block">
          <input type="text" class="layui-input" name="width" lay-verify="required">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">高(cm)<font color="red">*</font></label>
      <div class="layui-input-block">
          <input type="text" class="layui-input" name="height" lay-verify="required">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">体积使用率<font color="red">*</font></label>
      <div class="layui-input-block">
          <input type="number" class="layui-input" name="volumeAvailability" lay-verify="required" placeholder="示例,0.8不要写成80%">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">备注</label>
      <div class="layui-input-block">
          <input type="text" class="layui-input" name="remark">
      </div>
    </div>
    <div class="layui-form-item disN">
      <div class="layui-input-block">
        <span class="layui-btn" lay-submit lay-filter="locationstandardEditAndAddForm">提交</span>
      </div>
    </div>
  </form>
</script>

<script>
//具体的执行代码,代码量很少,就不分文件了
layui.use(['table', 'layer', 'form'], function() {
  let table = layui.table,
      form = layui.form,
      layer = layui.layer;
  //新增
  $('#locationstandard_add').on('click', function(){
    layer.open({
      type: 1,
      title: '新增库位规格',
      area: ['30%', '70%'],
      btn: ['保存', '关闭'],
      content: $('#locationstandardEditAndAddLayer').html(),
      id: 'locationstandardEditAndAddLayerId',
      success: function(layero,index){
        form.on('submit(locationstandardEditAndAddForm)', function(obj){
          let submitData = obj.field;
          commonReturnPromise({
              url: '/lms/wh/spec/save',
              contentType: 'application/json',
              type: 'post',
              params: JSON.stringify(submitData)
          }).then(res => {
              layer.msg('新增库位规格成功', { icon: 1 });
              locationstandard_renderTable();
              layer.close(index);
          });
        });
      },
      yes: function (index, layero) {
          layero.find('[lay-filter="locationstandardEditAndAddForm"]').trigger('click');
      }
    });
  });
  //渲染表格
  locationstandard_renderTable();
  function locationstandard_renderTable(){
      table.render({
            elem: '#locationstandard_table',
            method: 'POST',
            contentType: 'application/json',
            url: '/lms/wh/spec/list',
            cols: [
                [
                    { title: "库位规格", field: "specName"},
                    { title: "长(cm)", field: "length"},
                    { title: "宽(cm)", field: "width"},
                    { title: "高(cm)", field: "height"},
                    { title: "体积可使用率", field: "volumeAvailability"},
                    { title: "备注", field: "remark"},
                    {title: '操作', toolbar: "#locationstandard_table_bar", width: 100}
                ]
            ],
            page: false,
            limit: 3000
        });
  }
  //监听表格工具栏操作
  table.on("tool(locationstandard_table)", function(obj){
    let evt = obj.event;
    let data = obj.data;
    let id = data.id;
    if(evt == 'del'){ //删除操作
      commonReturnPromise({
        url: `/lms/wh/spec/delete/`+id,
      }).then(res => {
        layer.msg('删除成功',{icon:1});
        locationstandard_renderTable();
      })
    }else if(evt == 'edit'){ //编辑操作
      layer.open({
        type: 1,
        title: '编辑库位规格',
        area: ['30%', '70%'],
        btn: ['保存', '关闭'],
        content: $('#locationstandardEditAndAddLayer').html(),
        id: 'locationstandardEditAndAddLayerId',
        success: function(layero,index){
          //赋值
          layero.find('[name=specName]').val(data['specName']);
          layero.find('[name=length]').val(data['length']);
          layero.find('[name=width]').val(data['width']);
          layero.find('[name=height]').val(data['height']);
          layero.find('[name=volumeAvailability]').val(data['volumeAvailability']);
          layero.find('[name=remark]').val(data['remark'] || '');
          //提交表格
          form.on('submit(locationstandardEditAndAddForm)', function(obj){
            let submitData = obj.field;
            submitData.id = data.id;
            commonReturnPromise({
                url: '/lms/wh/spec/save',
                contentType: 'application/json',
                type: 'post',
                params: JSON.stringify(submitData)
            }).then(res => {
                layer.msg('修改库位规格成功', { icon: 1 });
                locationstandard_renderTable();
                layer.close(index);
            });
          });
        },
        yes: function (index, layero) {
            layero.find('[lay-filter="locationstandardEditAndAddForm"]').trigger('click');
        }
      });
    }
  });
});
</script>