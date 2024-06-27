<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>店铺父sku映射维护</title>
<style>
    #sku_p_mapping_first_div td .layui-table-cell{
    	height: inherit;
        overflow:visible;
        white-space:normal;
        word-wrap: break-word
    }
    #sku_p_mapping_first_div .layui-form-item{
        margin-bottom: 0;
    }
</style>
<div class="layui-fluid" id="sku_p_mapping_first_div">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
		<!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺父sku</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="请输入店铺父sku" id="sku_p_mapping_storePSku">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="padding-left:20px">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" lay-filter="formDemo" id="sku_p_mapping_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
<!-- 账单校验 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-row">
                        <div class="layui-col-lg6 layui-col-md6">
                            <div style="float:left;margin:10px 10px 0 0">
                                <label>店铺父sku映射</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                               <button type="button" class="layui-btn layui-btn-sm" id="skuMapping__storePSkuImport">
  									<i class="layui-icon">&#xe67c;</i>浏览
								</button>
                                <button class="layui-btn layui-btn-sm" id="skuMapping__storePSkuImportBtn">导入</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<!-- 表格渲染 -->
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <table class="layui-table" id="sku_p_mapping_data_table" lay-filter="sku_p_mapping_data_table" lay-even lay-skin="line" lay-size="lg"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 删除映射start-->
<script type="text/html" id="sku_p_mapping_table_operate"  >
    <a class="layui-btn layui-btn-xs" lay-event="delete">删除</a>
</script>
 <!--删除映射end-->
<script type="text/javascript" src="${ctx}/static/js/configuration/skupmapping/skuPMapping.js"></script>