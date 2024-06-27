<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>配置中心</title>
<style>
    #sysconfig_search_form .layui-form-label {
        padding: 0!important;
        line-height: 31px!important;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="sysconfig_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">配置组</label>
                                <div class="layui-input-block">
                                    <select name="cGroup" id="sysconfig_pakageType" lay-search>
                                        <option value="">请选择</option>
                                        <option value="lms">lms</option>
                                        <option value="cps">cps</option>
                                        <option value="lms&cps">lms&cps</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">属性key</label>
                                <div class="layui-input-block">
                                    <input type="text" name="cKey" placeholder="精确搜索"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">属性value</label>
                                <div class="layui-input-block">
                                    <input type="text" name="cValue" placeholder="精确搜索" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="sysconfig_search_btn">查询</button>
                                <button class="layui-btn layui-btn-sm" type="reset" >清空</button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="sysconfig_refresh_btn" >刷新component配置</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="sysconfig_crad">
                <div class="layui-tab" lay-filter="sysconfig_tab">
                    <ul class="layui-tab-title">
                        <li class="layui-this" tab_type="1">数量(<span id="sysconfig_total_num"></span>)</li>
                    </ul>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="sysconfig_data_table" lay-filter="sysconfig_data_table" style="margin: 0px;"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="sysconfig_cKey_tpl">
        <div style="text-align: left;text-indent: 2em;"> {{d.cKey}}</div>
</script>
<script type="text/html" id="sysconfig_cValue_tpl">
    <div style="text-align: left;text-indent: 2em;"> {{d.cValue}}</div>
</script>
<script type="text/html" id="sysconfig_remark_tpl">
    <div style="text-align: left;text-indent: 2em;"> {{d.remark}}</div>
</script>
<script type="text/html" id="sysconfig_createTime_tpl">
    {{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}
</script>
<script type="text/html" id="sysconfig_operate">
    {{# if(d.status == true){ }}
         <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="stopUse">停用</a>
    {{# }else{ }}
        <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="openUse">启用</a>
    {{# } }}
</script>
<script type="text/javascript" src="${ctx}/static/js/configuration/other/sysconfig.js"></script>