<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>复制模板</title>
<div class="layui-fluid" id="wishOnline_copyListing">
    <form class="layui-form" action="" lay-filter="component-form-group">
        <table class="layui-table">
            <tr>
                <th>本次生成模板父SKU</th>
                <th>店铺</th>
            </tr>
            <tr>
                <td>
                    <div>
                        <label id="wishOnline_skusInfo"></label>
                    </div>
                </td>
                <td>
                    <div class="layui-input-block">
                        <select id="wishOnline_copyStore" xm-select="copyStore_wishOnline" name="copyStoreIds" xm-select-search
                                xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                    </div>
                </td>
            </tr>
        </table>
        <div class="layui-inline">
            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" style="margin-left:20px" onclick="wishOnline_copyListing()">复制</button>
        </div>
    </form>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/copyOnlineListing.js"></script>