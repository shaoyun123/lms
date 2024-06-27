<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>库位日志</title>

<div class="layui-fluid" id="stockLocaBindSkuLog"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form" id="stockLocaBindSkuLog_form">
                    <div class="layui-form-item">
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">仓库</label>
                            <div class="layui-input-block">
                                <select name="warehouseId" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">操作人</label>
                            <div class="layui-input-block">
                                <select name="bindUserId" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">库位</label>
                            <div class="layui-input-block inputAndSelect">
                                <div class="layui-col-md9 layui-col-lg9">
                                    <input  name="stockLocation" type="text" class="layui-input" placeholder="库位名称，支持多个逗号分隔，精确查询">
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <select id="stockLocaBindSku_searchtype_sel">
                                        <option value="1">精确</option>
                                        <option value="0">模糊</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">sku</label>
                            <div class="layui-input-block">
                                <input name="prodSSkuStr" type="text" class="layui-input" placeholder="商品子SKU，支持多个逗号分隔，模糊查询">
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">操作时间</label>
                            <div class="layui-input-block">
                                <input type="text" name="time" autocomplete="off" class="layui-input"
                                       id="stockLocaBindSkuLog_operTime">
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3 pl20">
                        <span class="layui-btn layui-btn-sm" id="stockLocaBindSkuLog_search">搜索</span>
                        </div>
                    </div>
                </form>
                    
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header"  style="display:flex;justify-content:flex-end;">
                    <div class="btn-group">
                        <span class="layui-btn layui-btn-sm" id="stockLocationBindSkuLog_exportLogInfo">导出日志信息</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="stockLocaBindSkuLog_table1" lay-filter="stockLocaBindSkuLog_table1"></table>
                </div>
            </div>
        </div>
    </div>
</div>



<script src="${ctx}/static/js/warehouse/stockLocaBindSkuLog.js"></script>