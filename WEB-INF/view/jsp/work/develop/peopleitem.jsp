<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>人员类目</title>
<div class="layui-fluid"> 
    <div class="layui-row">
        <div class="layui-col-lg4 layui-col-md4">
                <div style="margin-left:20px">
                    <button class="layui-btn layui-btn-sm" id="addPeopleItem">添加类目</button>
                    <button class="layui-btn layui-btn-sm" id="removePeopleItem">删除类目</button>

                </div>
                <ul id="mgmtCateTree" class="ztree" style="width:400px;"></ul>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
            <button class="layui-btn layui-btn-sm" id="bindDeveloper_peopleitem">绑定人员</button>
            <div style="text-align: center">从属人员</div>
            <div style="background-color: white;margin-top: 10px" id="developerBox_peopleitem">

            </div>
        </div>
        <div class="layui-col-lg5 layui-col-md5" >
            <div id="mgmtCateContent">
                <input name="id" type="hidden">
                <input name="pid" type="hidden">
                <input name="prodCateIds" type="hidden">
                <div class="layui-card  mc">
                    <div class="layui-card-header">
                        管理类目
                        <button class="layui-btn layui-btn-sm" type="button" id="editPeopleItem" style="position:absolute;top:5px;right:5px">修改类目</button>
                    </div>
                    <div class="layui-card-body">
                        <div class="layui-form-item">
                            <label class="">类目名称:<span class="mgmt-cate-name"></span></label>
                        </div>
                        <div class="layui-form-item">
                            <label class="">分组名称:<span class="mgmt-cate-pname"></span></label>
                        </div>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-header">
                        商品类目
                        <button class="layui-btn layui-btn-sm" type="button" id="editProdCate" style="position:absolute;top:5px;right:5px">绑定商品类目</button>
                    </div>
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table smt-cate-table" class="">
                            <colgroup>
                                <col>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>贤心</td>
                            </tr>
                            <tr>
                                <td>法师</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 弹出框信息 -->
<!-- 人员类目弹框 -->
<div id="editProdCateLayer" class="disN p20">
    <div>
        <ul id="prodCateTree" class="ztree"></ul>
    </div>
</div>
<!-- 增加类目,编辑类目 -->
<div id="editMgmtCateLayer" class="disN p20">
    <div class="layui-form-item">
        <label class="layui-form-label">类目名称</label>
        <div class="layui-input-block">
            <input name="id" type="hidden">
            <input name="name" type="text" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item layui-form">
        <label class="layui-form-label">上级分组</label>
        <div class="layui-input-block" style="width:375px;position:relative;overflow:visible">
            <select name="pid">
                <option value="5">laytpl</option>
                <option value="6">upload</option>
                <option value="7">laydate</option>
            </select>
            <button class="layui-btn layui-btn-sm" id="addItems" style="position:absolute;top:0px;right:-74px;">添加</button>
        </div>
    </div>
</div>

<script type="text/html" id="developerBindPop_peopleitem">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_developerBindPop_peopleitem"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="developerBindForm_peopleitem" id="developerBindForm_peopleitem">
                        <input type="hidden" name="mgmtCateId">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">可选开发人员</legend>
                        </fieldset>

                        <c:forEach items="${bizzOwners_peopleitem}" var="bizzOwner">
                            <div class="fieldBox_peopleitem"><input type="checkbox" title="${bizzOwner.userName}" name="developerId" lay-skin="primary" value="${bizzOwner.id}"></div>
                        </c:forEach>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<style>
    .fieldBox_peopleitem{
        float: left;
        width: 13.75%;
        height: 25px;
    }
    .nameBox_peopleitem{
        float: left;
        width: 15%;
        height: 25px;
    }
</style>

<script src="${ctx}/static/js/work/develop/peopleitem.js"></script>