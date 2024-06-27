<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>采集爆款推广</title>
<style>
      .layui-form-item .layui-input-inline {
            float: left;
            width: 150px;
            margin-right: 10px;
       }
       .layui-form-radio{
           padding-right: 0
       }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card  mc">
                <div class="layui-card-header">搜索列表</div>
                <div class="layui-card-body">
                    <blockquote class="layui-elem-quote pora layui-quote-nm">
                        <form class="layui-form" action="" lay-filter="component-form-group">
                            <div class="layui-form-item">
                              <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <p>开发专员</p>
                                  <select name="interest" lay-filter="aihao" lay-search="">
                                      <option value="">选择归属人</option>
                                      <option value="0">人员1</option>
                                      <option value="1">人员2</option>
                                      <option value="2">人员3</option>
                                    </select>
                                </div>
                              </div>
                              <div class="layui-inline">
                                <div class="layui-input-inline w100">
                                  <p>wish推广</p>
                                    <select name="interest" lay-filter="aihao" lay-search="">
                                      <option value=""></option>
                                      <option value="0">全部</option>
                                      <option value="1">有产品ID</option>
                                      <option value="2">无产品ID</option>
                                    </select>
                                </div>
                                <div class="layui-inline">
                                        <div class="layui-input-inline">
                                                <p>搜索类型</p>
                                            <select name="interest" lay-filter="aihao" lay-search="">
                                                <option value="1">标题</option>
                                                <option value="2">归属SKU</option>
                                            </select>
                                        </div>
                                    </div>
                                        <div class="layui-inline">
                                                <div class="layui-input-inline">
                                                    <p>搜索内容</p>
                                                    <input type="text" name="title" placeholder="请输入搜索内容" class="layui-input">
                                                </div>
                                        </div>
                                        <div class="layui-inline">
                                            <div class="layui-input-inline">
                                                   <p>&nbsp;</p>
                                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" lay-filter="demo1">搜索</button>
                                                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                                            </div>
                                        </div>
                            </div>
                          </form>
                    </blockquote>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>表格</span>
                    <span  style="position:absolute;top:0;right:10px">
                        <button class="layui-btn">预留</button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="ghpTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    layui.use(['admin', 'form', 'table','laydate'], function() {
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
        //展示已知数据
        table.render({
            elem: "#ghpTable",
            cols: [
                [
                    //标题栏
                    {
                        type: "checkbox"
                    }, {
                        field: "id",
                        title: "缩略图"
                    }, {
                        field: "username",
                        title: "总价($)"
                    }, {
                        field: "email",
                        title: "总销售"
                    }, {
                        field: "sign",
                        title: "周销量"
                    }, {
                        field: "sex",
                        title: "商品评分"
                    }, {
                        field: "city",
                        title: "归属SKU"
                    }, {
                        field: "experience",
                        title: "推广产品ID"
                    },{
                        field: "experience1",
                        title: "费用"
                    },{
                        field: "experience2",
                        title: "流量"
                    },{
                        field: "experience3",
                        title: "订单金额"
                    },{
                        field: "experience4",
                        title: "比例"
                    },{
                        field: "experience5",
                        title: "备注"
                    },{
                        field: "experience6",
                        title: "操作"
                    }
                ],
            ],
        });
    });
</script>