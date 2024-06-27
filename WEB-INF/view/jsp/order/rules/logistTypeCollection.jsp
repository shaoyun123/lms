<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>物流方式集</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="logistTypeCollectionSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">集合名称</label>
                                <div class="layui-input-block">
                                    <input name="collectionName" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">状态</label>
                              <div class="layui-input-block">
                                  <select name="status">
                                    <option value="1">启用</option>
                                    <option value="0">停用</option>
                                    <option value="">全部</option>
                                  </select>
                              </div>
                          </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="searchBtn_logistTypeCollection">搜索</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="logistTypeCollectionmanageCard">
                <div class="layui-card-header">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span>
                            <span class="numCount">总数(<span id="logistTypeCollection_colLen"></span>)</span>
                        </span>
                        <span>
                        <permTag:perm funcCode="add_logistTypeCollection">
                            <button type="button" class="layui-btn layui-btn-sm" id="addBtn_logistTypeCollectionBtn">新增</button>
                        </permTag:perm>
                        </span>
                    </div>
                </div>
                <div class="layui-card-body logistTypeCollectionTableBox">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="logistTypeCollectionTable" lay-filter="logistTypeCollectionTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%--新增集合--%>
<script type="text/html" id="logistTypeCollectionAddLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="logistTypeCollectionAddForm" lay-filter="logistTypeCollectionAddForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">集合名称</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input name="collectionName" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">排序</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input name="sort" class="layui-input" type="number">
                    </div>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-tab layui-tab-card" id="logistTypeBox_logisTypeCollectionAddForm"></div>
        </form>
    </div>
</script>

<script type="text/html" id="logistTypeLiBox_logistTypeCollection">
    {{# if (d.detailList){ }}
    {{# for(var i = 0; i < d.detailList.length; ++i){ }}
    {{d.detailList[i].logistTypeName + ','}}
    {{# } }}
    {{# } }}
</script>

<script type="text/html" id="Bar_logistTypeCollection">
    <permTag:perm funcCode="edit_logistTypeCollection">
        <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    </permTag:perm>
    {{# if(d.status == 1){ }}
      <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="status">停用</a>
    {{# }else{ }}
      <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="status">启用</a>
    {{# } }}
</script>

<script type="text/javascript" src="${ctx}/static/js/order/logistTypeCollection.js"></script>
<style>
    .fieldBox_logistTypeCollection{
        float: left;
        width: 20%;
        height: 25px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>