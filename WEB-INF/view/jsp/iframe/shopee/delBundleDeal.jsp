<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>shopee移除Bundle Deal</title>
        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-header">
                            <div>共<span id="shop_delBundleDeal_total">0</span>条</div>
                        </div>
                        <div class="layui-card-body">
                            <form action="" class="layui-form">
                                <div class="layui-form-item">
                                    <div class="layui-col-lg10 layui-col-md10">
                                        <label class="layui-form-label">物品号</label>
                                        <div class="layui-input-block">
                                            <!-- 长度限制10w -->
                                            <input type="text" class="layui-input" name="itemIds" maxlength="100000"
                                                id="shop_delBundleDeal_itemIds" placeholder="支持多个物品号，英文逗号分隔">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <a href="javascript:void(0);"
                                            class="layui-btn  layui-btn-danger layui-btn-sm ml20"
                                            id="shop_delBundleDeal_batch_del">批量移除</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="${ctx}/static/js/publishs/shopee/delBundleDeal.js"></script>