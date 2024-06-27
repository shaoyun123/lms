<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>物流比价</title>

        <style>
            #LAY_adjustPriceProcess .layui-form-label {
                padding: 9px 5px;
            }
            
            #LAY_adjustPriceProcess .layui-form-item .layui-inline {
                margin-right: 0;
            }
            
            .fr {
                float: right;
            }
        </style>

        <div class="layui-fluid" id="LAY_LogicsRatio">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form id="logicsRatioForm" lay-filter="prod_search_form" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">国家/地区</label>
                                        <div class="layui-input-block">
                                            <select id="countries" name="countryCode" lay-search lay-verify="required">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">重量(g)</label>
                                        <div class="layui-input-block">
                                            <input type="number" name="weight" class="layui-input" lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">物流属性</label>
                                        <div class="layui-input-block">
                                            <select id="logicsProperty" name="logicsRatio_logisticsAttribute" xm-select="logicsProperty" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">平台选择</label>
                                        <div class="layui-input-block">
                                            <select id="platform" name="logicsRatio_platCode" xm-select="platform" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">邮编</label>
                                        <div class="layui-input-block">
                                            <input  name="logisticsZipCode" class="layui-input" placeholder="去掉-，只允许数字">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">城市</label>
                                        <div class="layui-input-block">
                                            <input  name="logisticsCity" class="layui-input">
                                        </div>
                                    </div>

                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">长</label>
                                        <div class="layui-input-block">
                                            <input  name="length" class="layui-input" >
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">宽</label>
                                        <div class="layui-input-block">
                                            <input  name="width" class="layui-input" >
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">高</label>
                                        <div class="layui-input-block">
                                            <input  name="height" class="layui-input" >
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">物流方式</label>
                                        <div class="layui-input-block">
                                            <select id="logicsRatio_logisticsTypeIdList" name="logisticsTypeIdList " xm-select="logicsRatio_logisticsTypeIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2" >
                                        <button class="layui-btn  layui-btn-sm layui-btn-normal keyHandle" style="margin-left: 42px" type="button" lay-submit="" lay-filter="searchLogicsRatio">查询</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="logicsRatioTable" lay-filter="logicsRatioTable"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class=" p20" id="">
        </div>

        <!-- 表格渲染模板 -->
        <script type="text/html" id="discount">
            <input type="number" max="1" min="0" class="layui-input" value="{{d.discountRate}}">
        </script>
        <!-- 表格渲染模板 -->
        <script type="text/javascript" src="${ctx}/static/js/logistics/logicsRatio.js"></script>