<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>覆盖率统计</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="coverageStatistics_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="coverageStatisticsBtn">
                                        选择类目
                                    </span>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('coverageStatisticsDiv','coverageStatisticsHidden')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" name="cateId" id="coverageStatisticsHidden">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" 
                                        lay-filter="orgs_hp_devPerson_newdevelop" 
                                        class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzerIds"
                                        lay-filter="users_hp_devPerson_newdevelop" 
                                        lay-search="" 
                                        class="users_hp_custom" 
                                        data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="coverageStatisticsTimes" name="publishTimeStr" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">查看方式</label>
                                <div class="layui-input-block">
                                    <input type="radio" name="way" value="bizzOwner" title="开发专员" checked>
                                    <input type="radio" name="way" value="cate" title="类目">
                                </div>
                            </div>
                            <input type="hidden" name="platCode" id="coverageStatistics_platCode" value="ebay">
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                 <span class="layui-btn layui-btn-sm" lay-submit lay-filter="coverageStatistics_submit">
                                    搜索
                                 </span>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <div id="coverageStatisticsDiv"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="coverageStatisticsCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="coverageStatistics-tabs" id="coverageStatistics-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">Ebay</li>
                                    <li>Smt</li>
                                    <li>Wish</li>
                                    <li>Amazon</li>
                                    <li>Shopee</li>
                                    <li>Lazada</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="coverageStatistics_table"  lay-filter="coverageStatistics_tableFilter">
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-美国直邮 --%>
<script type="text/html" id="coverageStatistics_usDirect">
    <div class="alignLeft">
        <span>{{(Number(d.usDirectPostPubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.usDirectPostPubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-美国虚拟仓 --%>
<script type="text/html" id="coverageStatistics_usVirtual">
    <div class="alignLeft">
        <span>{{(Number(d.usVirtualWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.usVirtualWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-美国真实仓 --%>
<script type="text/html" id="coverageStatistics_usReal">
    <div class="alignLeft">
        <span>{{(Number(d.usRealWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.usRealWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-英国直邮 --%>
<script type="text/html" id="coverageStatistics_ukDirect">
    <div class="alignLeft">
        <span>{{(Number(d.ukDirectPostPubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.ukDirectPostPubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-英国虚拟仓 --%>
<script type="text/html" id="coverageStatistics_ukVirtual">
    <div class="alignLeft">
        <span>{{(Number(d.ukVirtualWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.ukVirtualWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-英国真实仓 --%>
<script type="text/html" id="coverageStatistics_ukReal">
    <div class="alignLeft">
        <span>{{(Number(d.ukRealWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.ukRealWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-德国直邮 --%>
<script type="text/html" id="coverageStatistics_geDirect">
    <div class="alignLeft">
        <span>{{(Number(d.geDirectPostPubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.geDirectPostPubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-德国虚拟仓 --%>
<script type="text/html" id="coverageStatistics_geVirtual">
    <div class="alignLeft">
        <span>{{(Number(d.geVirtualWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.geVirtualWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-德国真实仓 --%>
<script type="text/html" id="coverageStatistics_geReal">
    <div class="alignLeft">
        <span>{{(Number(d.geRealWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.geRealWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-澳洲直邮 --%>
<script type="text/html" id="coverageStatistics_auDirect">
    <div class="alignLeft">
        <span>{{(Number(d.auDirectPostPubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.auDirectPostPubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-澳洲虚拟仓 --%>
<script type="text/html" id="coverageStatistics_auVirtual">
    <div class="alignLeft">
        <span>{{(Number(d.auVirtualWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.auVirtualWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>
<%-- 表格-澳洲真实仓 --%>
<script type="text/html" id="coverageStatistics_auReal">
    <div class="alignLeft">
        <span>{{(Number(d.auRealWarehousePubNUm/d.ebayCanPubNum)*100).toFixed(1)}}%</span>
        <span>({{d.auRealWarehousePubNUm}}/{{d.ebayCanPubNum}})</span>
    </div>
</script>

<script src="${ctx}/static/js/statistics/export/coverageStatistics.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js?v=${ver}"></script>