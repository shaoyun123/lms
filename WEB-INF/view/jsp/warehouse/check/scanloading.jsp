<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>扫描装车</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body"></div>
                <div class="layui-card" id="scanloading_tab">
                    <div class="layui-tab" lay-filter="scanloading_tab">
                        <ul class="layui-tab-title" style="margin: 0px;">
                            <li class="layui-this" tab_type="1" >扫描装车</li>
                            <li  tab_type="2" >扫描记录</li>
                        </ul>
                        <div class="layui-tab-content" >
                            <div class="layui-tab-item layui-show">
                                <form action="" class="layui-form" id="scanloading_search_form">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">入库单</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="storageNumber" id="scanloading_storageNumber" autocomplete="off" class="layui-input" placeholder='请扫描入库单'>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">扫描入库单</label>
                                            <div class="layui-input-block" id="scanloading_storageNumber_text" style="line-height: 36px;"></div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">库位</label>
                                            <div class="layui-input-block" id="scanloading_stockLocation_input" style="line-height: 36px;"></div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">区域</label>
                                            <div class="layui-input-block" id="scanloading_region_input" style="line-height: 36px;"></div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">已扫描数</label>
                                            <div class="layui-input-block" id="scanloading_scanNum_input" style="line-height: 36px;"></div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3 pl20">
                                            <label class="layui-form-label"></label>
                                            <div class="layui-input-block" >
                                                <button class="layui-btn layui-btn-sm" type="button" id="scanloading_submit_btn">提交</button>
                                                <button class="layui-btn layui-btn-sm" type="button" id="scanloading_endScan_btn">终止扫描</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="layui-tab-item">
                                <div class="layui-card-header">展示最近30条扫描记录</div>
                                <table class="layui-table" id="scanloading_data_table" style="margin: 0px;"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/warehouse/scanloading.js"></script>

