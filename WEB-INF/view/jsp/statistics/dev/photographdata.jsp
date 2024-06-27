<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<title>自拍图统计</title>
<style>
    .hide{
        display: none;
    }
    .statisticsPerson{
        cursor: pointer;
    }
</style>
<div class="layui-col-md12 layui-col-lg12" >
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="pgh_searchForm" class="layui-form" action="" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">到货时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="goodsArrive">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 hide reciveTimeinput">
                                <label class="layui-form-label">需求时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="goodsRecive">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 org-user-div">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="pgh_orgFilter" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 org-user-div">
                                <label class="layui-form-label">人员</label>
                                <div class="layui-input-block">
                                    <select name="userId"  class="users_hp_custom" data-rolelist="摄影专员" lay-filter="pgh_sellerFilter" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-primary layui-btn-sm" id="pgh_searchData" type="button">查询</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        <div class="layui-tab">
            <ul id="pgh_statisticsType" class="layui-tab-title m_10" style="display:inline-block;">
              <li class="layui-this" data-index="0">摄影统计<span class="num" title="摄影未完成数"></span></li>
              <li data-index="1">美工统计<span class="num" title="美工未完成数"></span></li>
              <li data-index="2">拍图统计</li>
              <li data-index="3">摄影评分统计</li>
              <li data-index="4">美工评分统计</li>
              <li data-index="5">精修统计<span class="num" title="美工未完成数"></span></li>
              <li data-index="6">仓库看板</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item  layui-show">
                      <table class="layui-table" id="photograph" lay-filter="photograph">
                      </table>
               </div>
                <div class="layui-tab-item">
                    <table class="layui-table" id="artifical" lay-filter="artifical">
                    </table>
                </div>
                <div class="layui-tab-item">
                      <table class="layui-table" id="picture" lay-filter="picture">
                      </table>
                </div>
                <div class="layui-tab-item">
                    <table class="layui-table" id="photoEvaluate" lay-filter="photoEvaluate">
                    </table>
                </div>
                <div class="layui-tab-item">
                    <table class="layui-table" id="artDesignEvaluate" lay-filter="artDesignEvaluate">
                    </table>
                </div>
                <div class="layui-tab-item">
                    <table class="layui-table" id="refineEvaluate" lay-filter="refineEvaluate">
                    </table>
                </div>
                <div class="layui-tab-item">
                  <div class="layui-row layui-col-space10">
                    <div class="layui-col-md8 layui-col-lg8">
                      <div>产能看板(订单维度)</div>
                      <table class="layui-table" id="photographdata_capacityTable"></table>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                      <div>异常统计(订单维度)</div>
                      <table class="layui-table" id="photographdata_abnormalTable">
                        <thead>
                          <tr>
                            <th width="70">类型</th>
                            <th width="100"></th>
                            <th width="100">异常数量 <i id="syncIcon" class="layui-icon layui-icon-down" onclick="handleDownload()"
                              style="background-color: yellow; width: 20px;height: 20px;border: 1px solid #ccc; border-radius: 50%;color: #666; font-size: 12px;"></i></th>
                            <th>说明</th>
                          </tr>
                        </thead>
                        <tbody id="photographdata_abnormalTable_tbody">

                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-tab layui-tab-brief">
                <ul class="layui-tab-title" id="pgh_statisticsPeriod">
                    <li class="layui-this statisticsChart" timeType="month" chartName="月统计">月数据</li>
                    <li class="statisticsChart" timeType="week" chartName="周统计">周数据</li>
                    <li class="statisticsChart" timeType="day" chartName="日统计">日数据</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show" id="pgd_chartDiv">

                    </div>
                </div>
            </div>
        </div>

    </div>
    </div>
</div>

<!-- 表格渲染模板 -->
<script  type="text/html" id="ondFinishPercent">
    {{(parseFloat(d.ondFinishPercent)*100).toFixed(2)+'%'}}
</script>

<script  type="text/html" id="twdFinishPercent">
    {{(parseFloat(d.twdFinishPercent)*100).toFixed(2)+'%'}}
</script>

<script  type="text/html" id="thdFinishPercent">
    {{(parseFloat(d.thdFinishPercent)*100).toFixed(2)+'%'}}
</script>

<script  type="text/html" id="fodfinishPercent">
    {{(parseFloat(d.fodfinishPercent)*100).toFixed(2)+'%'}}
</script>

<script  type="text/html" id="fidfinishPercent">
    {{(parseFloat(d.fidfinishPercent)*100).toFixed(2)+'%'}}
</script>

<!-- 表格渲染模板 -->
<script type="text/javascript" src="${ctx}/static/js/statistics/dev/photographdata.js"></script>
<script src="${ctx}/static/highcharts/highcharts.js"></script>

