<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>添加/取消促销1.0</title>
            <style>
                .dis_flex_space {
                    display: flex;
                    justify-content: space-between;
                }
                
                .ml {
                    margin-left: 10px
                }
                
                .red {
                    color: red;
                }
                
                .blue {
                    color: blue
                }
            </style>
            <div class="layui-fluid" id="LAY-addebaypromotion">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="ebayaddpromotionForm" lay-filter="ebayaddpromotionForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <label class="layui-form-label">促销活动</label>
                                            <div class="layui-input-block">
                                                <select name="promotionAct" id="promotionAct" lay-filter="promotionAct"></select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div class="dis_flex_space">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="batchAddPromotion">批量添加</button>
                                        <div class="layui-form ml">
                                            <input type="checkbox" name="isOnly" checked title="已参加促销2.0的Listing不添加到促销1.0中" lay-skin="primary">
                                        </div>
                                    </div>
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="batchRemovePromotion">批量移除</button>
                                </div>
                                <table class="layui-table" id="ebayaddpromotionTable" lay-filter="ebayaddpromotionTable"></table>
                                <div id="pageSort"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script src="/lms/static/js/publishs/ebay/addandRemovePromotion.js"></script>