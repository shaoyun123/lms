<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>文件下载</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="filedownSearchForm">
                        <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">文件状态</label>
                            <div class="layui-input-block">
                                <select name="fileStatus">
                                    <option value="">全部</option>
                                    <option value="1">准备中</option>
                                    <option value="2">就绪</option>
                                    <option value="3">已销毁</option>
                                    <option value="4">生成失败</option>
                                </select>
                            </div>
                        </div>

                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="filedownSearch">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                    <div style="position:absolute;top:10px;right:20px">
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <permTag:perm funcCode="add1688">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="add1688Btn">添加账号
                                    </button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="filedownmanageCard">
                <div class="layui-card-header">
                    <span class="numCount">总数(<span id="filedownAccount_colLen"></span>)</span>
                    <span class="fr">
                            <%--<button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="delFileForListBtn">删除</button>--%>
                    </span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="filedownTable" lay-filter="filedownTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

        <script type="text/html" id="filedownAccessTokenTpl">
            {{# if(d.refreshToken != null){ }}
            {{ Format(d.refreshTokenExpiryTime,"yyyy-M-d h:m:s")}}
            <!--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="refreshToken" style="position:absolute;top:0;right:5px" >刷新Token</a>-->
            {{# } }}
        </script>

        <script type="text/html" id="filedownStatusTpl">
            {{# if(d.fileStatus == 1){ }}<font color="orange">准备中</font>{{# }}}
            {{# if(d.fileStatus == 2){ }}<font color="#7cfc00">就绪</font>{{# }}}
            {{# if(d.fileStatus == 3){ }}<font color="#808080">已销毁</font>{{# }}}
            {{# if(d.fileStatus == 4){ }}<font color="#808080">生成失败</font>{{# }}}
        </script>
        <!--处理wish店铺同步时间-->
        <script type="text/html" id="filedownLastSyncTime">
            {{ Format(d.lastSyncTime, "yyyy-MM-dd hh:mm:ss")}}
        </script>
        <
        <!-- 工具条模板,写在script里面 -->
        <script type="text/html" id="filedownTableBar">
            {{# if(d.fileStatus == 2){ }}
                <a class="layui-btn layui-btn-xs" lay-event="down">下载</a>
            {{# }}}
                <%--<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>--%>
            {{# if(d.fileStatus == 1){ }}
                <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="cancle">取消</a>
            {{# }}}
        </script>

<script type="text/javascript" src="${ctx}/static/js/statistics/down/filedown.js"></script>
