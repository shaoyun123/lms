<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>秒杀统计</title>
<style type="text/css">
</style>
<div class="layui-fluid" id="LAY-amazonseckill">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="amazonseckill_search_form" lay-filter="amazonseckill_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId" id="amazonseckill_online_depart_sel" lay-search
                                        lay-filter="amazonseckill_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" id="amazonseckill_online_salesman_sel" lay-search
                                        lay-filter="amazonseckill_online_salesman_sel" class="users_hp_custom"
                                        data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="amazonseckill_online_store_sel"
                                        lay-filter="amazonseckill_online_store_sel"
                                        xm-select="amazonseckill_online_store_sel" class="users_hp_store_multi"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                        data-platcode="amazon" name="storeAcctIdList"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteIdList" id="amazonseckillsiteIdList"
                                    lay-filter="amazonseckillsiteIdList" xm-select="amazonseckillsiteIdList"
                                    xm-select-search-type="dl" xm-select-skin="normal"
                                    xm-select-type="1">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入账日期</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="amazonseckill_postedDateStr" name="postedDateStr">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" style="margin-left: 50px;" class="layui-btn" type="submit"
                                    lay-submit="" lay-filter="search_btn" id="amazonseckill_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazonseckill_reset">清空</button>
                            
                                </div>

                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div>
                    <!-- <div class="layui-card-header">
                        <div style="display:flex;justify-content:flex-start;align-items:center;height: 100%;">
                            <button type="button" class="layui-btn layui-btn-sm" id="amazonseckill_out">
                                导出</button>
                        </div>
                    </div> -->
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="amazonseckill_table" lay-filter="amazonseckill_table"></table>
                </div>
            </div>


        </div>
    </div>

</div>
<script type="text/html" id="anazonseckill_t1">
    <div lay-event= "anazonseckill_site" style = "color: #009688">{{d.siteName}}<div>
</script>
<script type="text/html" id="anazonseckill_t2">
    <div lay-event= "anazonseckill_deal" style = "color: #009688">
        {{# if(d.asin == undefined && d.storeSSku == undefined && d.storeName != "总计"){ }}
        <span>设置</span>
        {{#  } }}

    {{#  if(d.asin  || d.asin != undefined){ }}
        <span>{{d.asin}}</span>
    {{#  } }}

    {{#  if(d.storeSSku  || d.storeSSku != undefined){ }}
        <span>/{{d.storeSSku}}</span>
    {{#  } }}

    <div>
</script>
<script type="text/html" id="anazonseckill_t3">
    <div>{{format(d.postedDatePdt ,"yyyy-MM-dd")}}<div>
</script>
<script type="text/html" id="anazonseckill_t4">
    {{#  if(d.modiferTime  || d.modiferTime  != ''){ }}
        <div>{{format(d.modiferTime,"yyyy-MM-dd")}}<div>
    {{#  } }}
</script>
<!-- 修改站点 -->
<script type="text/html" id="anazonseckill_newsite">
    <div style="padding:20px 0px 0px 0px">
        <form class="layui-form" id="amazonseckill_newsitefrom" lay-filter="amazonseckill_newsitefrom">
            <div class="layui-form-item">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                    <select name="siteCode" lay-search layfilter = "amazonseckill_newsite" id="amazonseckill_newsite">
                        <option value=""></option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="anazonseckill_commodity">
    <div style="padding:20px 0px 0px 0px">
        <form class="layui-form" id="amazonseckill_newcommodity" lay-filter="amazonseckill_newcommodity">
            <div class="layui-form-item">
                <label class="layui-form-label">ASIN</label>
                <div class="layui-input-block">
                    <input  type="text" name="asin" class="layui-input" id="anazonseckill_commodity_asin">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">店铺SKU</label>
                <div class="layui-input-block">
                    <input  type="text" name="storeSSku" class="layui-input" id="anazonseckill_commodity_storeSSku">
                </div>
            </div>
        </form>
    </div>
</script>

<script src="${ctx}/static/js/work/amazon/amazonseckill.js"></script>