<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>消息详情</title>


    <div class="layui-fluid" id="LAY-app-message-detail">
        <div class="layui-card layuiAdmin-msg-detail">
            <div template lay-url="${ctx}/static/json/message/detail.js">
                <div class="layui-card-header">
                    <h1>{{ d.data.title }}</h1>
                    <p>
                        <span>{{ layui.util.timeAgo(d.data.time) }}</span>
                    </p>
                </div>
                <div class="layui-card-body layui-text">
                    <div class="layadmin-text">
                        {{ d.data.content }}
                    </div>

                    <div style="padding-top: 30px;">
                        <a lay-href="message/" class="layui-btn layui-btn-primary layui-btn-sm">返回上级</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        layui.use(['admin'], function() {
            var $ = layui.$,
                admin = layui.admin,
                table = layui.table,
                element = layui.element;


        });
    </script>