<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>其他退货上架统计</title>
<style type="text/css">
</style>
<div class="layui-fluid" id="LAY-returnstaistics">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="returnstaistics_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">操作时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="returnstaisticst_timerange_input"
                                        id="returnstaistics_timerange_input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">装车类型</label>
                                <div class="layui-input-block">
                                    <select name="loadType">
                                        <option value="">请选择</option>
                                        <option value="1">其他装车</option>
                                        <option value="2">退货装车</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" id="operateType" value="0">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button type="button" class="layui-btn layui-btn-sm"
                                    id="returnstaisticstSearch">查询</button>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            <!-- tab切换 -->
            <div class="layui-card">
                <div class="layui-tab" id="returnstaistics_data_count_tab" lay-filter="returnstaistics_data_count_tab">
                    <ul class="layui-tab-title fl">
                        <li class="layui-this" onclick="setoperateType(0)">装车统计</li>
                        <li onclick="setoperateType(1)">上架统计</li>
                        <!-- <li onclick="setoperateType(2)">扫描统计</li> -->
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item  layui-show">
                            <table class="layui-table" id="return_statistics_statistics" lay-filter="return_statistics_statistics">
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/warehouse/returnstaistics.js"></script>