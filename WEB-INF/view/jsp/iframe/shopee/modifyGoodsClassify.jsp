<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>shopee修改商品分类</title>
<style> 
  #modifyGoodsClassifyForm .layui-form-item{
       margin-bottom:0
  }

  #modifyGoodsClassifyForm .layui-table{
      width: auto !important;
  }
  .dis_flex{
      display: flex;
      justify-content: space-between;
  }
</style>
<div class="layui-fluid" id="shopee-sort-modify">
    <div class="layui-row layui-col-space15">
        <div class="layui-tab">
            <ul class="layui-tab-title">
              <li class="layui-this">重新匹配</li>
              <li>导入修改</li>
            </ul>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form id="modifyGoodsClassifyForm" class="layui-form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                        <select id="shopee_modifyStock_skuSearchType">
                                            <option value="0">模糊</option>
                                            <option value="1">精确</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                                    </div>
                                    <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                        <%--<div class="dis_flex">--%>
                                        <%--<input type="text" class="layui-input" id="newIdInput" name="newIdInput" style="height:28px;width: 70%;">--%>
                                        <%--<button type="button" id="newIdBtn" class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>--%>
                                       <%--</div>--%>
                                   <%--</div>--%>
                                </div>                          
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-header">数量(<span id="tolnum_span_shopee_Id"></span>)
                            <span style="float: right"><button type="button" id="batchEnableProd" class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button></span>
                        </div>
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="modifyIdTable" lay-filter="modifyIdTable"></table>
                            <%--<script type="text/html" id="newPlatCateId">--%>
                                <%--<input type="text" class="layui-input new_PlatCateId">--%>
                            <%--</script>--%>
                    </div>
                </div>
              </div>
              <div class="layui-tab-item">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div>
                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="shopee_modify_clssify_export">下载模板</button>
                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="shopee_modify_clssify_uplaod">上传文件</button>
                                <i class="layui-icon ml20 layui-icon-help blue" lay-tips="导入修改数据无需选中在线商品。仅支持 xlsx格式。支持使用shopee平台爬取获得的英文类目树"></i>   
                                <i class="layui-icon ml60 layui-icon-refresh-3" id="shopee_modify_clssify_refreshResult" lay-tips="点击刷新操作日志"></i>   
                            </div>
                            <div>
                                <table class="layui-table" id="shopee_modify_clssify_log_table" lay-filter="shopee_modify_clssify_log_table"></table> 
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
    </div>
</div>
<!-- 操作日志弹窗 文件名称 -->
<script type="text/html" id="shopee_modify_clssify_filePath">
    {{# if(d.operateResultFileUri){ }}
        <div style="padding: 10px;">
            <a href="{{d.operateResultFileUri}}" target="_blank"  class="ztt-a">{{Format(d.createTime,'yyyy-MM-dd')}}修改类目失败数据文件.xlsx</a>
        </div>
    {{# } }}
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/modifyGoodsClassify.js"></script>
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
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var platAccts = [];
        $.ajax({
            type: "POST",
            url: ctx + "/shopee/shopeeIsEnableProduct/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (returnData) {
                for(var i=0;i<returnData.length;i++){
                    var a = {name: returnData[i].storeAcct, value:returnData[i].id}
                    platAccts.push(a);
                }
                //属性多选
                // select_multi('selectAttr_store',platAccts)
                formSelects.data('selectAttr_store','local',{arr:platAccts})
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    })
</script>