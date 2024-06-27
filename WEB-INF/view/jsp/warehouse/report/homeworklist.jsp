<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>作业一览表</title>
<style>
    #homeworklist_search_form .layui-form-label {
        padding: 0!important;
        line-height: 31px!important;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="homeworklist_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">作业人员</label>
                                <div class="layui-input-block">
                                    <select id="homeworklist_person_sel" xm-select="homeworklist_person_sel" name="creatorIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">工作时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="timerange" id="homeworklist_workTime_input" autocomplete="off" class="layui-input" placeholder='选择日期'>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="homeworklist_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="homeworklist_crad">
                <div class="layui-tab" lay-filter="homeworklist_tab">
                    <ul class="layui-tab-title">
                        <li class="layui-this" tab_type="1">数量(<span id="homeworklist_total_num"></span>)</li>
                        <div style='float:right;line-height: 40px;'>
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="homeworklist_export_btn">导出(六个月之内)</button>
                        </div>
                    </ul>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="homeworklist_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/warehouse/homeworklist.js"></script>