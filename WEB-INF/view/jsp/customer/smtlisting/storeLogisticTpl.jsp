<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
        <title>店铺匹配物流模板</title>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form action="" class="layui-form" id="smtStoreLOG_search_form">
                                <div class="layui-form-item layui-row">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="orgs_hp_smtPersion_pb"
                                                class="orgs_hp_custom" lay-search>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block">
                                            <select name="salePersonId" lay-filter="users_hp_smtPersion_pb" lay-search
                                                class="users_hp_custom" data-roleList="smt专员">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select id="smtStoreLOG_storeAcct_sel" xm-select-search
                                                xm-select="smtStoreLOG_storeAcct_sel" 
                                                lay-filter="smtStoreLOG_storeAcct_sel" class="store_hp_custom"
                                                xm-select-skin="normal"
                                                name="storeAcctId"
                                                data-platcode="aliexpress">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="smtPublish_searchTpl_special_linkage"></div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-input-block">
                                            <span id="smtStoreLOG_search_submit" lay-submit
                                                class="layui-btn layui-btn-sm"
                                                lay-filter="smtStoreLOG_search_submitFilter">搜索</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="layui-input-block">
                                <button class="layui-btn layui-btn-sm" type="button"
                                    onclick="smtStoreLOG_noDataStore()">查询无数据店铺</button>
                            </div>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div class="layui-tab">
                                <div class="fixTab">
                                    <ul class="layui-tab-title">
                                        <li data-value="-2" class="layui-this" id="smtStoreLOG_listNum">
                                            总数(<span>0</span>)</li>
                                    </ul>
                                    <div>
                                        <permTag:perm funcCode="smtstorelog_add">
                                            <button class="layui-btn layui-btn-sm" type="button"
                                                onclick="smtStoreLOG_add()">添加</button>
                                        </permTag:perm>
                                    </div>
                                </div>
                                <div class="layui-tab-content">
                                    <!-- 速卖通模板 -->
                                    <table id="smtStoreLOG_tpl_table" lay-filter="smtStoreLOG_tpl_table"
                                        class="layui-table"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 无数据店铺 -->
        <script type="text/html" id="smtStoreLOG_noData_table_tpl">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table id="smtStoreLOG_noData_table" lay-filter="smtStoreLOG_noData_table" class="layui-table"></table>
                    <div></div>
                </div>
            </div>
        </script>

        <!-- 重量区间 -->
        <script type="text/html" id="smtStoreLOG_table_weight">
           {{# if((d.maxWeight != 'undefined' && d.maxWeight != '') || (d.minWeight != 'undefined' &&d.minWeight != '')){  }} 
                <div>
                    <span>{{d.minWeight}}g</span>
                    <span> ~ </span>
                    <span>{{d.maxWeight}}g</span>
            </div>
           {{#  } }} 
        </script>

        <!-- 操作项 -->
        <script type="text/html" id="smtStoreLOG_toolbar">
            <button class="layui-btn layui-btn-sm" type="button" lay-event='update'>编辑</button>
            <button class="layui-btn layui-btn-sm" type="button" lay-event='delete'>删除</button>
        </script>

        <!-- 添加、编辑选项 -->
        <script type="text/html" id="smtStoreLOG_opera_modal">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="smtStoreLOG_opera_form" class="layui-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                            <div class="layui-input-block">
                                <select name="storeAcct" id="smtStoreLOG_opera_storeAcct" lay-search {{d.type==2 && 'disabled'}} lay-filter="smtStoreLOG_opera_storeAcct">
                                   {{# if(d.type==2){ }} 
                                        <option value="{{d.storeAcctId}}" selected>{{d.storeAcct}}</option>
                                   {{# } }} 
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><font class="fRed">*</font>定价公式</label>
                            <div class="layui-input-block">
                                <select name="shippingType">
                                    <option value="USD5_LESS_GENERAL" {{d.shippingType=='USD5_LESS_GENERAL' && 'selected'}}><5USD 普货</option>
                                    <option value="SPECIAL" {{d.shippingType=='SPECIAL' && 'selected'}}>特货</option>
                                    <option value="USD5_GREATER_GENERAL" {{d.shippingType=='USD5_GREATER_GENERAL' && 'selected'}}>≥5USD 普货</option>
                                    <option value="GENERAL_OLD" {{d.shippingType=='GENERAL_OLD' && 'selected'}}>普货（旧版）</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><font class="fRed">*</font>重量区间(g)</label>
                            <div class="layui-input-block disflex">
                                <input type="number" name="minWeight" min="0"  class="layui-input" value="{{d.minWeight!=undefined? d.minWeight : ''}}" placeholder="单位：g">
                                <input type="number" name="maxWeight" min="0" class="layui-input" value="{{d.maxWeight!=undefined? d.maxWeight : ''}}"  placeholder="单位：g">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><font class="fRed">*</font>运费模板</label>
                            <div class="layui-input-block disflex">
                                <select name="freightTemplate" id="smtStoreLOG_opera_freightTpl"></select>
                                <button class="layui-btn layui-btn-sm ml10" type="button" onclick="smtStoreLOG_syncFreightTpl()">同步</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </script>



        <script src="${ctx}/static/js/customer/smtlisting/storeLogisticTpl.js"></script>