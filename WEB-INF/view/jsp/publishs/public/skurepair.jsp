<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <style type="text/css">
        .publish_skurepair_skuposition1 {
            position: absolute;
            top: 1px;
            right: 15%;
            width: 14%;
            cursor: pointer;
        }
        
        .publish_skurepair_skuposition2 {
            position: absolute;
            top: 1px;
            right: 0;
            width: 14%;
            cursor: pointer;
        }
    </style>
    <title>SKU映射修复</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" lay-filter="publish_skurepair_searchForm" id="publish_skurepair_searchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">平台</label>
                                    <div class="layui-input-block">
                                        <select lay-filter="publish_skurepair_platList_sel" id="publish_skurepair_platList_sel">
                                        <option value="wish">wish</option>
                                        <option value="ebay">ebay</option>
                                        <option value="shopee">shopee</option>
                                        <option value="joom">joom</option>
                                        <option value="aliexpress">aliexpress</option>
                                        <option value="amazon">amazon</option>
                                        <option value="lazada">lazada</option>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select lay-filter="publish_skurepair_storeAcct_sel" id="publish_skurepair_storeAcct_sel" xm-select="publish_skurepair_storeAcct_sel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <div class="layui-form-label" style="padding: 0 15px">
                                        <select lay-search id="publish_skurepair_skutype_sel">
                                        <option value="1">店铺父SKU</option>
                                        <option value="2">店铺子SKU</option>
                                    </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" placeholder="店铺SKU,支持sku%后半部分模糊查询，最多10个" class="layui-input" id="publish_skurepair_storeSku_text">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="layui-form-label" style="padding: 0 15px;    float: none;display: inline-block;">
                                        <select id="publish_skurepair_isSale_sel">
                                        <option value="1">上架的</option>
                                        <option value="">上下架状态</option>
                                        <option value="0">下架的</option>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3 pl20">
                                    <button class="layui-btn layui-btn-sm keyHandle" id="publish_skurepair_searchBtn" type="button" title="如果无店铺sku搜索条件，将检索前面1000条未映射信息！">搜索</button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                    <button class="layui-btn layui-btn-sm" type="button" id="publish_skurepair_reportBtn" title="导出查询数据">导出未映射</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- 表格渲染 -->
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab" lay-filter="publish_skurepair_tab">
                            <ul class="layui-tab-title">
                                <li class="layui-this">数量(<span id="publish_skurepair_table_data_num"></span>)</li>
                            </ul>
                            <div class="layui-tab-content" id="publish_skurepair_data_table_content">
                                <table class="layui-table" id="publish_skurepair_data_table" lay-filter="publish_skurepair_data_table"></table>
                            </div>
                        </div>
                        <div style="position: absolute;top: 10px;right: 30px;">
                            <div class="layui-input-inline" style="padding-right: 100px;">
                                <span style="color:red; margin-right: 100px;">如果无店铺sku搜索条件，将检索前面1000条未映射信息！导出时只导出未映射信息！</span>
                                <button class="layui-btn layui-btn-sm" type="button" id="publish_skurepair_batchsave_btn">批量保存</button>
                                <%--     <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="publish_skurepair_add_storePSku_btn" title="新增店铺父SKU映射">新增店铺父SKU映射</button>
                            <button class="layui-btn layui-btn-sm layui-btn-warm" type="button" id="publish_skurepair_add_storeSubSku_btn" title="新增店铺子SKU映射">新增店铺子SKU映射</button>
                       --%>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--新增映射-->
    <script type="text/html" id="publish_skurepair_add_layer">
        <div class="p20">
            <form action="" class="layui-form" id="skuMapping_add_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">店铺<span style="color: red;">*</span></label>
                    <div class="layui-input-block">
                        <select name="" id="publish_skurepair_add_platList_sel" lay-search></select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">店铺SKU<span style="color: red;">*</span></label>
                    <div class="layui-input-block">
                        <input type="text" autocomplete="off" class="layui-input" placeholder="店铺SKU" id="publish_skurepair_add_store_sku">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">商品SKU<span style="color: red;">*</span></label>
                    <div class="layui-input-block">
                        <input type="text" autocomplete="off" class="layui-input" placeholder="基础商品SKU" id="publish_skurepair_add_prod_sku">
                    </div>
                </div>
            </form>
        </div>
    </script>
    <script type="text/html" id="publish_skurepair_prod_sku_tpl">
        <input type="text" id="publish_skurepair_prod_sku_{{d.id}}" class="layui-input publish_skurepair_prod_sku_td_input" old_id="{{d.id}}" value="{{d.prod_sku || ''}}">
    </script>
    <script type="text/html" id="publish_skurepair_table_operate_tpl">
        <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
    </script>
    <script type="text/javascript" src="${ctx}/static/js/publishs/public/skurepair.js"></script>