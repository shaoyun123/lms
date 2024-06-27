<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>点货进度汇总</title>
<style>
    .layui-table-col-special {
        display: none;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" id="orderStatistics_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">制单时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="createTime" id="orderStatistics_createTime_input" autocomplete="off" class="layui-input" placeholder='选择日期'>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="deptId" lay-filter="orderStatistics_org" id="orderStatistics_orgId"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">制单/点货人</label>
                                <div class="layui-input-block">
                                    <select name="creatorId" id="orderStatistics_creator_sel" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <!-- <select name="storeId" id="orderStatistics_storeId"></select> -->
                                    <select name="storeIdList"
                                      id="orderStatistics_storeId"
                                      xm-select="orderStatistics_storeId" 
                                      xm-select-search 
                                      xm-select-search-type="dl" 
                                      xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="orderStatistics_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="orderStatistics_tab">
                <div class="layui-tab" lay-filter="orderStatistics_tab">
                    <div class="layui-card-header dis_flex">
                        <ul class="layui-tab-title" style="margin: 0px;display: inline-grid;" >
                            <li class="layui-this" tab_type="1" >数量(<span id="orderStatistics_count_num"></span>)</li>
                        </ul>
                        <div style="float: right;">
                            <label class="layui-form-label" style="line-height: 28px;">制单权重</label>
                            <input type="number" class="layui-input" style="display: inline-block;width: 20%;" id="orderStatistics_zhidan_wieght" placeholder="制单权重" value="0.1">
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="orderStatistics_export_btn">导出(六个月之内)</button>
                        </div>
                    </div>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="orderStatistics_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/warehouse/order_statistics.js"></script>