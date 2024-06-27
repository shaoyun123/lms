<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>smt商品上架</title>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-header disFCenter">
                            <div>数量(共<span id="smtOnlineaeproductTable_total">0</span>条)</div>
                            <div><a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-danger" type="button"
                                    id="smtOnlineaeproduct_batchEdit">批量上架</a></div>
                        </div>
                        <div class="layui-card-body">
                            <table class="layui-table" id="smtOnlineaeproductTable"
                                lay-filter="smtOnlineaeproductTableFilter"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtOnlineaeproduct.js"></script>