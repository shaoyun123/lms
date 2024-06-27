<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <style>
        .fr {
            float: right;
            margin-left: 0;
        }
        
        .skyblue {
            color: skyblue;
        }
        
        .green {
            color: green;
        }
        
        .red {
            color: red;
        }
        
        .gray {
            color: #cccccc
        }
        
        .text_l {
            text-align: left;
        }
        
        .pointer {
            cursor: pointer;
        }
        
        .hide {
            display: none;
        }
    </style>
    <title>销量统计</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-form">
                            <form class="layui-form" lay-filter="amazonsellCount_form" id="amazonsellCount_form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">订单类型</label>
                                        <div class="layui-input-block">
                                            <select name="orderType">
                                            <option value="">全部</option>
                                            <option value="FBA">FBA</option>
                                            <option value="FBM">FBM</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <label class="layui-form-label">时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" readonly id="amazonsellcount_time" lay-verify="required" name="time">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId"lay-filter="amazonsellcount_orgFilter" class="orgs_hp_custom">
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block">
                                            <select name="salePersonId" class="users_hp_custom" data-rolelist="amazon专员" lay-filter="amazonsellcount_sellerFilter" lay-search="">
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 fr">
                                        <button type=button class="layui-btn layui-btn-sm layui-btn-normal fr" id="amazonsellcount_submit" lay-submit lay-filter="amazonsellcount_submit">查询</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <table class="layui-table" lay-filter="amazonsellcount_table" id="amazonsellcount_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 表格渲染模板 -->
    <script type="text/html" id="amazonsellcountArgustpl">
       <div>
           <div>销售额</div>
           <div><span>订单数</span> | <span>种类数</span> | <span>商品数</span> | <span>客单价</span></div>
       </div>
    </script>

    <script type="text/html" id="amazonsellcountUS_tpl">
        <div>
            <div>$<span>{{d.US?.saleAmt && Number(d.US?.saleAmt).toFixed(2)||0}}</span></div>
            <div><span>{{d.US?.orderNum||0}}</span> | <span>{{d.US?.skuNum||0}}</span> | <span>{{d.US?.prodNum||0}}</span> | <span>{{d.US?.unitOrderPrice||0}}</span></div>
        </div>
    </script>

    <script type="text/html" id="amazonsellcountCA_tpl">
        <div>
            <div>$<span>{{d.CA?.saleAmt && Number(d.CA?.saleAmt).toFixed(2)||0}}</span></div>
            <div><span>{{d.CA?.orderNum||0}}</span> | <span>{{d.CA?.skuNum||0}}</span> | <span>{{d.CA?.prodNum||0}}</span> | <span>{{d.CA?.unitOrderPrice||0}}</span></div>
        </div>
    </script>

    <script type="text/html" id="amazonsellcountGB_tpl">
        <div>
            <div>$<span>{{d.GB?.saleAmt && Number(d.GB?.saleAmt).toFixed(2)||0}}</span></div>
            <div><span>{{d.GB?.orderNum||0}}</span> | <span>{{d.GB?.skuNum||0}}</span> | <span>{{d.GB?.prodNum||0}}</span> | <span>{{d.GB?.unitOrderPrice||0}}</span></div>
        </div>
    </script>

    <script type="text/html" id="amazonsellcountDE_tpl">
        <div>
            <div>$<span>{{d.DE?.saleAmt && Number(d.DE?.saleAmt).toFixed(2)||0}}</span></div>
            <div><span>{{d.DE?.orderNum||0}}</span> | <span>{{d.DE?.skuNum||0}}</span> | <span>{{d.DE?.prodNum||0}}</span> | <span>{{d.DE?.unitOrderPrice||0}}</span></div>
        </div>
    </script>

    <script type="text/html" id="amazonsellcountJP_tpl">
        <div>
            <div>$<span>{{d.JP?.saleAmt && Number(d.JP?.saleAmt).toFixed(2)||0}}</span></div>
            <div><span>{{d.JP?.orderNum||0}}</span> | <span>{{d.JP?.skuNum||0}}</span> | <span>{{d.JP?.prodNum||0}}</span> | <span>{{d.JP?.unitOrderPrice||0}}</span></div>
        </div>
    </script>

    <script type="text/javascript" src="${ctx}/static/js/statistics/amazon/sellCount.js"></script>