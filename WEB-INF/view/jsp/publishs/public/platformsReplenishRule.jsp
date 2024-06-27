<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>缺货标零补货</title>
        <div class="layui-fluid" v-cloak>
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <table class="layui-table" id="platforms_replenish_rule_table"
                                lay-filter="platforms_replenish_rule_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <script type="text/html" id="platforms_replenish_rule_table_toolbar">
            <button class="layui-btn layui-btn-sm" lay-event="edit">编辑</button>
        </script>

        <!-- 编辑弹窗 -->
        <script type="text/html" id="platforms_replenish_rule_edit_modal">
            <div class="layui-fluid">
                <div class="layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" id="platforms_replenish_rule_edit_form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">预计到货天数:</label>
                                <div class="layui-input-block w_50">
                                    <input type="text" class="layui-input" name="expectArrivalTime" 
                                        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
                                        onblur="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                    >
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">在线数量≤多少时补货:</label>
                                <div class="layui-input-block w_50">
                                    <input type="text" class="layui-input" name="replenishCondition" 
                                        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
                                        onblur="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                    >
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">补货数量:</label>
                                <div class="layui-input-block w_50">
                                    <input type="text" class="layui-input" name="replenishCounts" 
                                        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')" 
                                        onblur="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                    >
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">备注:</label>
                                <div class="layui-input-block w_50">
                                    <textarea class="layui-textarea" name="remark"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </script>

        <script src="${ctx}/static/js/publishs/public/platformsReplenishRule.js"></script>