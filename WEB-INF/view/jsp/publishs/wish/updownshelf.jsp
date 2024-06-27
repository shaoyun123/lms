<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>上下架</title>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-inline w100">
              <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                <select name="wishItem">
                  <option value="0">全部</option>
                  <option value="1">启用中</option>
                  <option value="2">已停用</option>
                </select>
              </div>
            </div>
            <div class="layui-inline w100">
              <div class="layui-input-inline">
                <input type="text" name="wishPlatform" placeholder="平台账号" class="layui-input">
              </div>
            </div>
            <div class="layui-inline w100">
              <div class="layui-input-inline">
                <input type="text" name="storeName" placeholder="店铺名称" class="layui-input">
              </div>
            </div>
            <div class="layui-inline">
              <div class="layui-input-inline">
                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" lay-filter="demo1">搜索</button>
                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
              </div>
            </div>
            <div class="poab">
              <div class="layui-inline">
                <div class="layui-input-inline w100 layui-form" lay-filter="component-form-element">
                  <select name="" id="">
                    <option value="0">批量操作</option>
                    <option value="1">开启定时</option>
                    <option value="2">关闭定时</option>
                  </select>
                  
                </div>
                 <div class="layui-inline w120">
		              <div class="layui-input-inline layui-form">
		               <select name="forwardIsEnable" id="forwardIsEnable"  lay-filter="forwardIsEnable-element">
		               		<option value="">批量上下架</option>
		                    <option value="0">批量上下架子SKU</option>
		                    <option value="1">批量上下架父SKU</option>
                 		</select>
		              </div>
           		 </div>
                <div class="layui-input-inline">
                  <button class="layui-btn layui-btn-normal layui-btn-sm" id="wishUpdownshelf_addWishInfo">添加wish账号基本信息</button>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-header">表格</div>
        <div class="layui-card-body">
          <!-- 表格的数据渲染 -->
          <table class="layui-table" id="wishTable"></table>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- wish账号弹出框模板 -->
<div id="wishUpdownshelf_addWishInfoLayer" class="disN p20">
  <form action="" class="layui-form layui-form-pane" lay-filter="component-form-group">
    <div class="layui-form-item">
      <label class="layui-form-label">平台账号</label>
      <div class="layui-input-block">
        <input type="text" name="wishAccount" required lay-verify="required" placeholder="请输入平台账号" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">店铺名称</label>
      <div class="layui-input-block">
        <input type="text" name="shopName" required lay-verify="required" placeholder="请输入店铺名称" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">价格调整</label>
      <div class="layui-input-block">
        <input type="radio" name="priceTrim" value="+" title="增加(+)" checked="">
        <input type="radio" name="priceTrim" value="-" title="减少(-)">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">价格调整值</label>
      <div class="layui-input-block">
        <input type="number" required lay-verify="required" min="0" class="layui-input" name="priceVal" step="0.1" value="0">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">代理ip</label>
      <div class="layui-input-block">
        <input type="text" name="serverIP" required lay-verify="required" placeholder="请输入代理服务器ip" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">代理端口</label>
      <div class="layui-input-block">
        <input type="text" name="serverPort" required lay-verify="required" placeholder="请输入代理服务器端口号" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">代理实例ID</label>
      <div class="layui-input-block">
        <input type="text" name="examID" required lay-verify="required" placeholder="请输入ID" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">服务器账号</label>
      <div class="layui-input-block">
        <input type="text" name="serverAccount" required lay-verify="required" placeholder="请输入服务器账号" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">服务器密码</label>
      <div class="layui-input-block">
        <input type="text" name="serverPwd" required lay-verify="required" placeholder="请输入服务器密码" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">代理用户名</label>
      <div class="layui-input-block">
        <input type="text" name="agentName" required lay-verify="required" placeholder="请输入代理用户名" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">代理密码</label>
      <div class="layui-input-block">
        <input type="text" name="agentPwd" required lay-verify="required" placeholder="请输入代理密码" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">图片域名</label>
      <div class="layui-input-block">
        <input type="text" name="imageUrl" required lay-verify="required" placeholder="请输入图片地址" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item layui-form-text">
      <label class="layui-form-label">备注</label>
      <div class="layui-input-block">
        <textarea placeholder="请输入备注内容" class="layui-textarea"></textarea>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block taRight">
        <button class="layui-btn" lay-submit="" lay-filter="demo1">提交</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>
</div>
<script>
  layui.use(['admin', 'form', 'table','layer'], function () {
    var $ = layui.$,
      admin = layui.admin,
      element = layui.element,
      layer = layui.layer,
      laydate = layui.laydate,
      table = layui.table,
      form = layui.form;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render(null, 'forwardIsEnable-element');
    form.render('select')
    //表格渲染结果
    //展示已知数据
    table.render({
      elem: "#wishTable",
      cols: [
        [
          //标题栏
          {
            type: "checkbox"
          }, {
            field: "id",
            title: "平台code"
          }, {
            field: "username",
            title: "平台账号"
          }, {
            field: "email",
            title: "店铺名称"
          }, {
            field: "sign",
            title: "代理服务器ip"
          }, {
            field: "sex",
            title: "图片域名"
          }, {
            field: "city",
            title: "定时刊登"
          }, {
            field: "experience",
            title: "操作"
          },
        ],
      ],
    });
    //按钮的点击事件
    $("#wishUpdownshelf_addWishInfo").click(function () {
      var index = layer.open({
        type: 1,
        title: "设置平台账号信息",
        area: ["1000px", "600px"],
        shade: 0, //遮罩透明度
        content: $("#wishUpdownshelf_addWishInfoLayer"),
      });
      // layer.full(index);
    });
    form.on('select(forwardIsEnable-element)', function (data) {
			  // url: "/lms/wishIsEnableProduct/manage.html"
			  if(data.value!='' && data.value!=null){
				 // location.hash = '#/route/publishs/wish/isEnableProduct';   
				  
				  //layui.view(this.id).render('route/publishs/wish/isEnableProduct').done(function(){
	                   // var btnYes = layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn0')
	                   // btnYes.attr('id','btnYes')
	                //})
				  /* layer.open({
				      type: 2,
				      title: '很多时候，我们想最大化看，比如像这个页面。',
				      shadeClose: true,
				      shade: false,
				      maxmin: true, //开启最大化最小化按钮
				      area: ['893px', '600px'],
				      content: '#/route/publishs/wish/updownshelf'
				    });
 */
			  }
	    });
  });
</script>
