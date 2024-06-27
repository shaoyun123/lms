<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>降价通知</title>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="loweringNotice_form" lay-filter="loweringNotice_form" method="post">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购专员</label>
                                <div class="layui-input-block">
                                    <select id="loweringNotice_buyerId" name="loweringNotice_buyerId" lay-search
                                        xm-select="loweringNotice_buyerId" xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">整合专员</label>
                                <div class="layui-input-block">
                                    <select id="loweringNotice_integratorId" name="loweringNotice_integratorId" lay-search
                                        xm-select="loweringNotice_integratorId" xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select id="loweringNotice_developerId" name="loweringNotice_developerId" lay-search
                                        xm-select="loweringNotice_developerId" xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="loweringNotice_isSale">
                                        <option value="2">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="loweringNotice_skuType">
                                        <option value="1">子SKU模糊</option>
                                        <option value="2">子SKU精确</option>
                                        <option value="3">父SKU模糊</option>
                                        <option value="4">父SKU精确</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="loweringNotice_sku">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="loweringNotice_createTime"
                                           id="loweringNotice_createTime" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">处理备注</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="loweringNotice_dealRemark">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">处理状态</label>
                                <div class="layui-input-block">
                                    <select name="loweringNotice_dealStatus">
                                        <option value="0">全部</option>
                                        <option value="1" selected>未处理</option>
                                        <option value="2">已处理</option>
                                        <option value="3">无需处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderType" lay-search>
                                        <option value="1">30天销量倒序</option>
                                        <option value="2">创建时间倒序</option>
                                        <option value="3">创建时间正序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="loweringNotice_dealType" value="1">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm keyHandle" lay-submit id="loweringNotice_submit" lay-filter="loweringNotice_submit">查询</span>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" id="loweringNotice_reset" type="reset">清空</button>
                                    <div id="loweringNotice_save" class="inline_block pora"></div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header toFixedContain">
                    <div style="float:left;">
                        <ul class="layui-tab-title fl">
                            <li class="layui-this numCount_loweringNotice" data-code="1">降价通知(<span></span>)</li>
                            <li class="numCount_loweringNotice" data-code="2">匹配失效(<span></span>)</li>
                            <li class="numCount_loweringNotice" data-code="3">采购价格变更(<span></span>)</li>
                        </ul>
                        <permTag:perm funcCode="batchHandle_loweringNotice">
                            <button class="layui-btn layui-btn-sm ml20" type="button" id="loweringNotice_batchHandle">批量处理
                        </permTag:perm>
                        </button>
                        <permTag:perm funcCode="syncAllProdFromAli_loweringNotice">
                            <button class="layui-btn layui-btn-sm" type="button" id="syncAllProdFromAli_loweringNotice">
                                全量同步1688商品信息
                            </button>
                        </permTag:perm>
                        <permTag:perm funcCode="export_loweringNotice">
                            <button class="layui-btn layui-btn-sm" id="loweringNotice_exportBtn" type="button">导出</button>
                        </permTag:perm>
                    </div>
                </div>

                <div class="layui-card-body">
                    <table class="layui-table" id="loweringNotice_table"
                           lay-filter="loweringNotice_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- template模板 --%>
<script type="text/html" id="loweringNotice_table_img">
{{#  if(d.simage){ }}
<img width="60" height="60" class="b1 img_show_hide" src="${tplIVP}{{d.simage}}">
{{# } }}
</script>
<script type="text/html" id="loweringNotice_table_sSku">
{{d.sSku || ''}}
{{#  if(!d.isSale){ }}
<span class="layui-badge layui-bg-blue" title="该sku已经停售">停</span>
{{# } }}
</script>
<%-- 工具栏 --%>
<script type="text/html" id="loweringNotice_tableIdBar">
    <permTag:perm funcCode="operation_loweringNotice">
        <a class="layui-btn layui-btn-xs" lay-event="loweringNotice_deal">处理</a>
    </permTag:perm>
</script>

<%-- 降价处理弹框 --%>
<script type="text/html" id="loweringNotice_tableIdDeal">
<form class="layui-form p20" id="loweringNotice_tableIdDeal_form" method="post">
    <input type="hidden" name="id">
    <div class="layui-form-item">
        <input type="hidden" name="type" value="2">
        <label class="layui-form-label">处理结果</label>
        <div class="layui-input-block">
            <input type="radio" name="dealStatus" value="1" title="未处理">
            <input type="radio" name="dealStatus" value="2" title="已处理">
            <input type="radio" name="dealStatus" value="3" title="无需处理">
        </div>
    </div>
    <div class="layui-form-item layui-form-text">
        <label class="layui-form-label">备注</label>
        <div class="layui-input-block">
            <textarea class="layui-textarea" name="dealRemark"></textarea>
        </div>
    </div>
    <div class="layui-form-item disN">
        <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit lay-filter="loweringNotice_tableIdDeal_submit">查询</span>
    </div>
</form>
</script>

<script type="text/html" id="dealType_loweringNotice">
<div>
    {{# if (d.dealType == 1) {}}
    降价通知
    {{# } }}
    {{# if (d.dealType == 2) {}}
    1688信息失效
    {{# } }}
</div>
</script>
<%-- 引入js文件 --%>
<script type="text/javascript" src="${ctx}/static/js/purchases/loweringNotice.js"></script>