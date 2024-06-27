<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>包装统计</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" id="statisticmatchForm" lay-filter="component-form-grup" autocomplete="off" onsubmit="return false">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">统计时间</label>
                                <div class="layui-input-block">
                                    <input name="timeStr" id="statisticmatch_timeStr" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="statisticmatch_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                <button type="reset" id="statisticmatch_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                <button id="statisticmatch_exportBtn"  class="layui-btn layui-btn-sm">导出</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="statisticmatch_table"  lay-filter="statisticmatch_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="statisticmatch_personEveryDayPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="statisticmatch_personEveryDayTable"></table>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/wyt/statistics/statisticmatch.js"></script>
