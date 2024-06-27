<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>阿里云</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form action="" class="layui-form" id="aliyunSearchForm">
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="ip" placeholder="IP" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="alias" placeholder="备注" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload"
                                            id="aliyunSearch">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="aliyunCard">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="aliyunTable" lay-filter="aliyunTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 工具条模板,写在script里面 -->
<script type="text/html" id="aliyunTableBar">
    <a class="layui-btn layui-btn-xs" lay-event="restart">重启ECS</a>
</script>

<script type="text/javascript" src="${ctx}/static/js/work/rim/aliyun.js"></script>