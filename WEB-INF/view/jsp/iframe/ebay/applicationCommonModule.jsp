<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>应用公共模块</title>
<style>
    #adjustPriceSearchForm .layui-form-item{
        margin-bottom:0
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
    <div>
        <ul class="layui-tab-title">
        <li class="layui-this" >站点(<span id="ebay_applicationCommonMode_site"></span>)</li>
        </ul>
    </div>
    <table class="layui-table" lay-filter="parse-table-demo">
        <thead>
        <tr>
            <th lay-data="{field:'username', width:200}" style="text-align:left">类型</th>
            <th lay-data="{field:'joinTime', width:150}" style="text-align:left">模板&内容</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>物流</td>
            <td>
                <div class="layui-form">
                    <select id="acm_logistics">
                        <option value="">请选择</option>
                    </select>
                </div>
            </td>
        </tr>
        <tr>
            <td>备货时间</td>
            <td>
                <input type="text" id="acm_date" name="title" lay-verify="title" autocomplete="off" placeholder="请输入天数" class="layui-input">
            </td>
        </tr>
        <tr>
            <td>商品所在地</td>
            <td>
                <div class="layui-form">
                    <select id="acm_goodsLocal">
                        <option value="">请选择</option>
                    </select>
                </div>
            </td>
        </tr>
        <tr>
            <td>屏蔽目的地</td>
            <td>
                <div class="layui-form">
                    <select id="acm_notCity">
                        <option value="">请选择</option>
                    </select>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
            <div class="layui-card-header">表格(<span id="tolnum_span_ebay_acm_Table"></span>)</div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="acm_Table" lay-filter="acm_Table"></table>
                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form-item">
                        <div style="float:right;margin-top:5px;">
                            <button type="button" id="acm_button" class="layui-btn layui-btn-danger layui-btn-sm">批量修改</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/applicationCommonModule.js"></script>
