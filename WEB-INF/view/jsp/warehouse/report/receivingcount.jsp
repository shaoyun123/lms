<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>收货包裹统计</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="receivingcount_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">收货人</label>
                                <div class="layui-input-block">
                                    <select 
                                    name="creatorId" 
                                    id="receivingcount_creator"
                                    xm-select="receivingcount_creator"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">收货时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="startAndEndTime" id="receivingcount_createTime_input" autocomplete="off" class="layui-input" placeholder='选择日期'>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="receivingcount_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="receivingcount_crad">
                <div class="layui-tab" lay-filter="receivingcount_tab">
                    <ul class="layui-tab-title">
                        <li class="layui-this" tab_type="1">包裹统计(<span id="receivingcount_total_num"></span>)</li>
                        <div style='float:right;line-height: 40px;'>
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="receivingcount_export_btn">导出(六个月之内)</button>
                        </div>
                    </ul>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="receivingcount_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/warehouse/receivingcount.js"></script>
