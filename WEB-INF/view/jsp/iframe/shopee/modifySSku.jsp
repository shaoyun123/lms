<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>修改店铺子sku</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="shopee_replace_img_form" id="shopee_modify_ssku_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">商品子sku</label>
                                <div class="layui-input-block disflex">
                                    <input type="text" class="layui-input brnone" placeholder="默认模糊查询" name="sSkuList">
                                    <select name="searchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select  id="shopee_online_depart_sel" lay-search lay-filter="shopee_online_depart_sel"  class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select lay-search lay-filter="shopee_online_salesman_sel" class="users_hp_custom" data-rolelist="shopee专员">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select  lay-search id="selectAttr_store"  xm-select="selectAttr_store" class="store_hp_custom" data-platcode="shopee" name="storeAcctIdList">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1 pl20">
                                <a class="layui-btn layui-btn-sm" lay-submit lay-filter="modifySSku_submit">搜索</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格内容 --%>
            <div class="layui-card">
              <div class="layui-card-header" style="display:flex;justify-content:space-between;align-items:center;">
                 <div>数量共(<span id="modifySSku_table_num">0</span>)条</div>
                 <div><a class="layui-btn layui-btn-sm layui-btn-normal" id="batchModifySSku">批量修改</a></div>
              </div>
              <div class="layui-card-body">
                <table class="layui-table" id="modifySSku_table"></table>
              </div>
            </div>
        </div>
    </div>
</div>

<%-- 店铺子sku弹框 --%>
<script type="text/html" id="modify_storeSSku">
   <div id="store{{d.id}}" class="store{{d.itemId}}">
      <input type="text" class="layui-input" value="{{d.storeSku}}">                                                                                                 
   </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/modifySSku.js"></script>