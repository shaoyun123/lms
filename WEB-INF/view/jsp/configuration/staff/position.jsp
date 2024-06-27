<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>岗位</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">搜索列表</div>
                <div class="layui-card-body">
                    <blockquote class="layui-elem-quote pora">
                        <div class="layui-inline w100">
                            <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                <select name="positionItem" lay-search>
                                        <option value="">选择系统</option>
                                        <option value="1">业务系统</option>
                                        <option value="2">商户系统</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline w100">
                            <div class="layui-input-inline">
                                <input type="text" name="positionUserName" placeholder="用户姓名" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline w100">
                            <div class="layui-input-inline">
                                <input type="text" name="positionRoleName" placeholder="角色名称" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn layui-btn-sm ml20 keyHandle" type="button" lay-filter="demo1">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                            </div>
                        </div>
                        <div class="poab">
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-normal" id="usemanagerBtn">添加用户基本信息</button>
                                </div>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">表格</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="usermanagerTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- wish账号弹出框模板 -->
<div id="usemanagerLayer" class="disN p20">
    <form action="" class="layui-form layui-form-pane" lay-filter="component-form-group">
        <div class="layui-form-item">
            <label class="layui-form-label">用户名</label>
            <div class="layui-input-block">
                <input type="text" name="userName" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">用户密码</label>
            <div class="layui-input-block">
                <input type="password" name="userPwd" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">注册系统</label>
            <div class="layui-input-block">
                <select name="interest" lay-filter="aihao" lay-search>
                            <option value="0" selected>业务系统</option>
                            <option value="1">商户系统</option>
                        </select>
            </div>
        </div>
        <div class="layui-form-item" pane="">
            <label class="layui-form-label">内部商户</label>
            <div class="layui-input-block">
                <input type="checkbox" name="innerShop" lay-skin="switch" lay-filter="switchTest" lay-text="是|否">
            </div>
        </div>
        <div class="layui-form-item" pane="">
            <label class="layui-form-label">店铺状态</label>
            <div class="layui-input-block">
                <input type="checkbox" name="shopState" lay-skin="switch" lay-filter="switchTest" lay-text="开|关 ">
            </div>
        </div>
        <div class="layui-form-item" pane="">
            <label class="layui-form-label">自动关店</label>
            <div class="layui-input-block">
                <input type="checkbox" name="autocloseShop" lay-skin="switch" lay-filter="switchTest" lay-text="是|否 ">
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea placeholder="请输入内容" class="layui-textarea"></textarea>
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
    layui.use(['admin', 'form', 'table'], function() {
        var $ = layui.$,
            admin = layui.admin,
            element = layui.element,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            form = layui.form;
        form.render(null, 'component-form-element');
        form.render(null, 'component-form-group');
        //表格渲染结果
        table.render({
            elem: "#usermanagerTable",
            cols: [
                [
                    //标题栏
                    {
                        field: "id",
                        title: "登录名"
                    }, {
                        field: "username",
                        title: "用户姓名"
                    }, {
                        field: "email",
                        title: "性别"
                    }, {
                        field: "sign",
                        title: "年龄"
                    }, {
                        field: "sex",
                        title: "角色"
                    }, {
                        field: "city",
                        title: "备注"
                    }, {
                        field: "city1",
                        title: "属于系统"
                    }, {
                        field: "experience",
                        title: "操作"
                    },
                ],
            ],
        });
        //按钮的点击事件
        $("#usemanagerBtn").click(function() {
            var index = layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["1000px", "600px"],
                shade: 0, //遮罩透明度
                content: $("#usemanagerLayer"),
            });
            // layer.full(index);
        });


    });
</script>