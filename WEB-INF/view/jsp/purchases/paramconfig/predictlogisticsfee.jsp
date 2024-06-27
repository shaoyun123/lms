<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>预估运费设置</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div>
            <div class="fRed">计算公式: 预估运费 = 首费 + ceil((累计净重-首重)/ 续重) x 续费</div>
            <div class="secondary">tips：ceil为向上取整函数  </div>
        </div>
        <div class="layui-card" id="logisticsFeeConfigCard">
            <form autocomplete="off">
                <div class="layui-card-body">
                    <div style="padding-right: 20px">
                        <a type="button" class="layui-btn layui-btn-sm fr" id="predictlogisticsfee_add">新增</a>
                    </div>
                    <table class="layui-table" id="logisticsFeeConfigTable" lay-filter="logisticsFeeConfigTable"></table>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/html" id="predictlogisticsfee_toolbar">
    <permTag:perm funcCode="predictlogisticsfee_update">
        <span class="layui-btn layui-btn-xs" lay-event="update">修改</span>
    </permTag:perm>
</script>

<script type="text/html" id="predictlogisticsfee_updatePop">
    <form id="predictlogisticsfee_updateForm" class="layui-form" lay-filter="predictlogisticsfee_updateForm">
        <div class="p20">
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">适用仓库</label>
                    <div class="layui-input-block">
                        <select name="storeIdList"
                            class="predictlogisticsfee_storeId"
                            xm-select="predictlogisticsfee_storeId"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter="predictlogisticsfee_storeId"
                        >
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">匹配省份</label>
                    <div class="layui-input-block">
                        <select name="provinceList"
                            class="predictlogisticsfee_province"
                            xm-select="predictlogisticsfee_province"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter="predictlogisticsfee_province"
                        >
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">首重(kg)</label>
                    <div class="layui-input-block">
                        <input name="firstWeight" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">首费(¥)</label>
                    <div class="layui-input-block">
                        <input name="firstPrice" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">续重(kg)</label>
                    <div class="layui-input-block">
                        <input name="nextWeight" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">续费(¥)</label>
                    <div class="layui-input-block">
                        <input name="nextPrice" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea" ></textarea>
                </div>
            </div>
        </div>
    </form>
</script>

<script type="text/javascript" src="${ctx}/static/js/purchases/predictlogisticsfee.js"></script>
