<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>产品抽查记录</title>
<div class="layui-fluid" id="storageCheckRecord"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="storageCheckRecord_form">
                        <input type="text"  name="haveDel" value="false"  autocomplete="off" class="layui-input disN">

                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">录入时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="storageCheckRecord_createTime">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="pSkus" selected>父SKU</option>
                                        <option value="sSkus">子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input  name="skuInfo" type="text" class="layui-input" placeholder="支持多个逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">出错类型</label>
                                <div class="layui-input-block">
                                        <select xm-select="storageCheckRecord_errType" name="errType" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">反馈者部门</label>
                                <div class="layui-input-block">
                                    <select name="reporterDepart">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-m3">
                                <label class="layui-form-label">问题描述</label>
                                <div class="layui-input-block">
                                    <input name="errDesc" type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg6 layui-col-m6 pl20">
                                <button class="layui-btn layui-btn-sm layui-btn-normal" id="storageCheckRecord_search"  type="button">搜索</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格模块 --%>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="storageCheckRecord_tab">
                        <ul class="layui-tab-title">
                            <li class="layui-this">未处理</li>
                            <li>已处理</li>
                        </ul>
                        <div style="position:absolute;left:210px;top:15px;">
                                                    <button class="layui-btn layui-btn-sm" id="storageCheckRecord_downTmp"  type="button">模板下载</button>
                            <button class="layui-btn layui-btn-sm" id="storageCheckRecord_import"  type="button">Excel导入</button>
<permTag:perm funcCode="storageCheckRecord_batchHandle">
                            <button class="layui-btn layui-btn-sm" id="storageCheckRecord_batchHandle"  type="button">批量处理</button>
</permTag:perm>
                        </div>
                        <div style="position:absolute;right: 5px;top:15px;">
    <button class="layui-btn layui-btn-sm" id="storageCheckRecord_add"  type="button">新增</button>
                            <button class="layui-btn layui-btn-sm" id="storageCheckRecord_export"  type="button">导出</button>
                        </div>
                    </div>
                    <table class="layui-table" id="storageCheckRecord_table1" lay-filter="storageCheckRecord_table1"></table>
                    <div id="test1"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 工具栏 --%>
<script type="text/html" id="storageCheckRecord_bar">
    <button class="layui-btn layui-btn-xs" lay-event="storageCheckRecord_tr_edit">修改</button>
</script>

<%-- 新增弹框 --%>
<script type="text/html" id="storageCheckRecord_add_tpl">
    <div class="p20">
        <form class="layui-form" id="storageCheckRecord_add_form">
            <div class="layui-form-item layui-row">
                <div class="layui-col-lg4 layui-col-m4">
                    <label class="layui-form-label">入库单号</label>
                    <div class="layui-input-block">
                        <input name="storageNumber" type="text" class="layui-input">
                        <i class="layui-icon layui-icon-refresh" id="storageCheckRecord_refreshInfo" style="cursor:pointer;position:absolute;top:8px;right:5px" title="刷新"></i>
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-m4">
                    <label class="layui-form-label"><font color="red">*</font>反馈人</label>
                    <div class="layui-input-block">
                        <input name="reporter" type="text" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">反馈者部门</label>
                    <div class="layui-input-block">
                        <select name="reporterDepart" class="layui-form-select">
                        </select>
                    </div>
                </div>
            </div>
            <div id="storageCheckRecord_add_table" class="pl20"></div>
        </form>
    </div>
</script>

<%-- 新增用到的模板文件 --%>
<script type="text/html" id="storageCheckRecord_add_table_tpl">
    <div class="layui-table-header">
        <table class="layui-table">
            <thead>
                <tr>
                    <th width="30px">
                        <div class="layui-form">
                            <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                        </div>
                    </th>
                    <th hidden>入库单号</th>
                    <th hidden>仓库名</th>
                    <th>图片</th>
                    <th>子SKU</th>
                    <th>点货专员</th>
                    <th>上架专员</th>
                    <th>出错类型</th>
                    <th>问题描述</th>
                    <th>实际数量</th>
                    <th></font>盘点数量</th>
                    <th>异常数量</th>
                </tr>
            </thead>
            <tbody id='storageCheckRecord_add_table_body'>
            {{ each data v i}}
            <tr>
                <td>
                    <div class="layui-form">
                       <input type="checkbox" class="pid-cbox" lay-skin="primary" name="id">
                    </div>
                </td>
                <td hidden>{{ v.storageNumber}}</td>
                <td hidden>{{ v.whName }}</td>
                <td>
                    <img width="60" height="60" src="${tplIVP}{{ v.image }}"  data-onerror="layui.admin.img_noFind()" class="lazy b1">
                </td>
                <td>{{ v.sSku }}</td>
                <td>{{ v.checker }}</td>
                <td>
                    <input type="text" class="layui-input" lay-skin="primary" value="" name="puter">
                </td>
                <td style="vertical-align:top;height:400px;">
                    <div class="layui-form">
                        <select name="errType"></select>
                    </div>
                </td>
                <td>
                    <textarea class="layui-textarea" lay-skin="primary" name="errDesc"></textarea>
                </td>
                <td>{{ v.actualNum}}</td>
                <td>
                    <input type="number" class="layui-input" lay-skin="primary" value="" name="checkNum">
                </td>
                <td>
                    <input type="number" class="layui-input" lay-skin="primary" value="" name="errorNum">
                </td>
            </tr>
            {{ /each }}
            </tbody>
        </table>
    </div>
</script>

<%-- 批量处理框 --%>
<script type="text/html" id="storageCheckRecord__handleStatus_tpl">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="storageCheckRecord_handleStatus_form">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">处理状态</label>
                    <div class="layui-input-block" style="width:300px" id="storageCheckRecord_handleStatus_radio">
                        <!--<input type="checkbox" name="handleStatus" lay-skin="switch" lay-text="确认处理|未处理" checked>-->
                        <input type="radio" name="handleStatus" value="true" title="确认处理">
                        <input type="radio" name="handleStatus" value="false" title="未处理" checked>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/storagecheckrecord.js"></script>