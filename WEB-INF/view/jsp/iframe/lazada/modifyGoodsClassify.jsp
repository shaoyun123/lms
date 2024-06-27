<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>lazada修改商品分类</title>
        <style>
            #lazadamodifyGoodsClassify_form .layui-form-item {
                margin-bottom: 0
            }

            #lazadamodifyGoodsClassify_form .layui-table {
                width: auto !important;
            }

            .dis_flex {
                display: flex;
                justify-content: space-between;
            }
        </style>
        <div class="layui-fluid" id="lazada-sort-modify">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form id="lazadamodifyGoodsClassify_form" class="layui-form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="pSkuList" autocomplete="off" class="layui-input"
                                                placeholder="默认模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                        <select id="lazada_modifyGoodsClassify_skuSearchType">
                                            <option value="0">模糊</option>
                                            <option value="1">精确</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select xm-select="selectAttr_store" name="storeList" xm-select-search
                                                class="store_hp_custom" xm-select-search-type="dl"
                                                xm-select-skin="normal">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"
                                            data-type="reload" id="lazada_modifyGoodsClassify_searchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                            id="lazada_modifyGoodsClassify_resetBtn">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-header">
                            数量(<span id="tolnum_span_lazadaModifyGoodsClassify_Id"></span>)
                            <span style="float: right"><button type="button"
                                    id="lazada_modifyGoodsClassify_batchEnableProd"
                                    class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button></span>
                        </div>
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="lazadamodifyGoodsClassify_modifyIdTable"
                            lay-filter="lazadamodifyGoodsClassify_modifyIdTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="${ctx}/static/js/publishs/lazada/modifyGoodsClassify.js"></script>