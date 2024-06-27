<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<style>
    .fr{
        float: right;
        margin-left:0;
    }
    .skyblue{
        color: skyblue;
    }
    .green{
        color:green;
    }
    .red{
        color:red;
    }
</style>
<title>FBA店铺统计</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form">
                        <form class="layui-form" lay-filter="FBAstorestatics_form" id="FBAstorestatics_form">
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="orgId" lay-filter="FBAstorecount_orgFilter"
                                                class="orgs_hp_custom" lay-search="">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select name="salePersonId" class="users_hp_custom" data-rolelist="amazon专员"
                                                lay-filter="FBAstorecount_sellerFilter" lay-search="">
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeAcctIds" class="store_hp_custom" data-platcode="amazon"
                                                lay-filter="FBAstorecount_store" lay-search="">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select name="saleSite" id="FBAstorecount_amazonSite" lay-search="">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">统计</label>
                                    <div class="layui-input-block">
                                        <input type="radio" name="showType" value="1" title="销量">
                                        <input type="radio" name="showType" value="2" title="订单量">
                                        <input type="radio" name="showType" value="3" title="销售额" checked>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">币种</label>
                                    <div class="layui-input-block">
                                        <select name="currencyType">
                                            <option value="2">人民币</option>
                                            <option value="1">美元</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">统计时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" readonly id="FBAstorecount_counttime" lay-verify="required" name="time">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1 fr">
                                    <button type=button class="layui-btn layui-btn-sm layui-btn-normal fr" id="FBAstorecount_submit" lay-submit lay-filter="FBAstorecount_submit">查询</button>
                                </div>
                                <input type="hidden" name="isSortByTotal" value="1">
                                <input type="hidden" name="sortDate" value="0">
                                <input type="hidden" name="sortType" value="0">
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card" id="FBAstorestatics_card">
                    <div class="layui-card-body">
                        <table class="layui-table" lay-filter="FBAstorestatics_table"id="FBAstorestatics_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            <!-- 表格渲染模板 -->
            <script type="text/html" id="FBAsellcountimg_tpl">
                {{# if(d.image){ }}
                <div>
                    <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
                {{# } }}
            </script>
            <script type="text/html" id="FBAStoreCount_tpl">
                {{# for(var i in d.asin){ }}
                <div><a class="skyblue" target="_blank" href="{{d.asin[i].asinUrl}}">{{d.asin[i].asin||''}}</a></div>
                {{# } }}
            </script>

            <script type="text/html" id="FBAStore_countTpl">
                {{# for(var i in d.parentAsin){ }}
                <div>{{d.parentAsin[i]}}</div>
                {{# } }}
            </script>

            <script type="text/html" id="FBAsellcountseller_tpl">
                {{# for(var i in d.sellerSku ){ }}
                <div>{{d.sellerSku [i]}}</div>
                {{# } }}
            </script>

            <script type="text/html" id="FBAsellcountdiff_tpl">
                {{# if(d.saleRankDiff>=0){ }}
                <div class="green">{{d.saleRankDiff||""}}</div>
                {{# }else{ }}
                <div class="red">{{d.saleRankDiff||""}}</div>
                {{# }}}
            </script>

<script type="text/javascript" src="${ctx}/static/js/statistics/amazon/FBAstorecount.js"></script>
