<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>下架/删除 商品</title>
<style>
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid" id="">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="lazadaOnlineOffshelves_form" lay-filter="" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="skuType">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="skuList" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                            </div>
                                <!-- <div class="layui-col-lg1 layui-col-md1">
                                </div> -->
                                <!-- <div class="layui-col-md1 layui-col-lg1" style="margin-left: 10px">
                                    <select name="searchType">
                                        <option value="1">精确</option>
                                    </select>
                                </div> -->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_offseelves_depart_sel" lay-search
                                            lay-filter="lazada_online_offseelves_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazada_online_offshelves_salesman_sel" lay-search
                                            lay-filter="lazada_online_offshelves_salesman_sel" class="users_hp_custom"
                                            data-rolelist="lazada专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <%-- <select id="lazadaOffshelvesstoreAcctIdList"
                                            xm-select="lazadaOffshelvesstoreAcctIdList"
                                            name="storeAcctIdList" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter="lazadaOffshelvesstoreAcctIdList"
                                            class="users_hp_store_multi">
                                    </select> --%>
                                    <div data-platcode="lazada" xm-select="lazadaOffshelvesstoreAcctIdList" class="users_hp_store_multi" id="lazadaOffshelvesstoreAcctIdList"></div>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2" style="text-align:left">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" lay-submit
                                        id="lazadaoffshelfSearch" lay-filter="lazadaoffshelfSearch">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="dis_flex layui-card-body">
                    <div class="numCount">数量(<span id="lazadaoffshelfNum"></span>)</div>
                    <div class=" mg_10">
                        <button type="button" id="lazadabatchoffshelf" class="layui-btn layui-btn-danger layui-btn-sm">
                            批量下架
                        </button>
                        <button type="button" id="lazadabatchdelete" class="layui-btn layui-btn-danger layui-btn-sm">
                            批量删除
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="lazadaoffshelftable" lay-filter="lazadaoffshelftable"></table>
                    <script type="text/html" id="productStatusTpl">
                        {{# if(d.productStatus != null){ }}
                        {{# if(d.productStatus == 'active'){ }}
                        <span style="color:blue">上架中</span>
                        {{# }else if(d.productStatus == 'inactive'){ }}
                        <span style="color:red">已下架</span>
                        {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="productisSaleTpl">
                        {{# if(d.isSale == false){ }}
                        停售
                        {{# }else if(d.isSale == true){ }}
                        在售
                        {{#  } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    //多选渲染函数
    function select_multi(name, arr) {
        var formSelects = layui.formSelects
        formSelects.render({
            name: name, //xm-select的值
            type: 2, //select样式为checkbox
            data: {
                arr: arr,
                name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
                val: 'value'
            }
        })
    }
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/offshelves.js"></script>