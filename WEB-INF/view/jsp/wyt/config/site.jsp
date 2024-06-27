<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>销售专员配置</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="site_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select lay-search lay-filter="site_depart_select" class="orgs_hp_custom" name="orgIdStr">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售</label>
                                <div class="layui-input-block">
                                    <select lay-search lay-filter="site_salesman_select" class="users_hp_custom" data-rolelist="ebay专员,wish专员,amazon专员" name="salerIdStr">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售渠道</label>
                                <div class="layui-input-block">
                                    <select name="channelStrList" 
                                        id="site_channelSelect" 
                                        lay-filter="site_channelSelectFilter"
                                        xm-select="site_channelSelect"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="site_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div style="display:flex;justify-content:flex-end;align-items:center;height: 100%;">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="site_addConfigBtn">新增</span>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="site_table"  lay-filter="site_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 新增/修改 弹框 --%>
<script type="text/html" id="site_addAndEditLayer">
    <div class="layui-form p20" id="site_addAndEditLayerForm">
        <div class="layui-form-item">
            <label class="layui-form-label">部门</label>
            <div class="layui-input-block">
                <select lay-search 
                   lay-filter="site_depart_selectLayer" 
                   class="orgs_hp_custom" 
                   name="orgId"
                >
                    <option value="">请选择</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">销售专员</label>
            <div class="layui-input-block">
                <select lay-search 
                    lay-filter="site_salesman_selectLayer" 
                    class="users_hp_custom" 
                    data-rolelist="ebay专员,wish专员,amazon专员" 
                    name="salerId"
                >
                    <option value="">请选择</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">匹配渠道</label>
            <div class="layui-input-block">
                <select name="channelStrListLayer" 
                    id="site_channelSelectLayer" 
                    lay-filter="site_channelSelectLayerFilter"
                    xm-select="site_channelSelectLayer"
                    xm-select-search 
                    xm-select-search-type="dl" 
                    xm-select-skin="normal"
                >
                    <option value="">请选择</option>
                </select>
            </div>
        </div>
    </div>
</script>

<%-- 操作 --%>
<script type="text/html" id="site_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span>
    </div>
</script>



<script src="${ctx}/static/js/wyt/config/site.js"></script>