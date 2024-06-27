<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>退货列表</title>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="instorereturnsForm">
            <div class="layui-form-item">
              <div class="layui-col-lg4 layui-col-md4">
                <div class="layui-form-label labelSel">
                  <select name="timeType">
                      <option value="0">装车时间</option>
                      <option value="1">上架时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" autocomplete="off" name="times" id="instorereturns_times" readonly>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">SKU</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" autocomplete="off" name="skuStr" placeholder="多个使用逗号分割">
                </div>
              </div>          
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">入库类型</label>
                <div class="layui-input-block">
                    <select 
                      name="loadingTypeList" 
                      id="instorereturns_loadingTypeListStr"
                      xm-select="instorereturns_loadingTypeListStr" 
                      xm-select-search 
                      xm-select-search-type="dl" 
                      xm-select-skin="normal">
                        
                    </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label labelSel">
                  <select name="operateType" lay-filter="instorereturns_operateTypeFilter">
                      <option value="0">装车人</option>
                      <option value="1">上架人</option>
                  </select>
                </div>
                <div class="layui-input-block">
                    <select 
                      name="operatorIdList" 
                      id="instorereturns_operatorIdListStr"
                      xm-select="instorereturns_operatorIdListStr" 
                      xm-select-search 
                      xm-select-search-type="dl" 
                      xm-select-skin="normal">  
                    </select>
                </div>
              </div>
              
              <div class="layui-col-lg2 layui-col-md2" style="padding-left:5px">
                  <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit lay-filter="instorereturns_submit">
                    查询
                  </span>
                  <span class="layui-btn layui-btn-sm layui-btn-primary" id="instorereturns_cleanBtn">
                    清空
                  </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="instorereturnsCard">
        <div class="fixHigh">
            <div class="layui-card-header">
               <div class="fixTab">
                  <div></div>
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="instorereturns_exportBtn">
                      导出
                  </span>
                </div>
            </div>
        </div>
       <!-- 下面放表格 -->
        <div class="layui-card-body">
           <table class="layui-table" id="instorereturns_table" lay-filter="instorereturns_tableFilter"></table>
        </div>
      </div>
    </div>
  </div>
</div>

<%-- 表格-图片 --%>
<script type="text/html" id="instorereturns_productImage">
    {{#  if(d.imageUrl){ }}
    <img width="60" height="60" data-original="{{ d.imageUrl }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>
<%-- 表格-类型 --%>
<script type="text/html" id="instorereturns_loadingType">
{{#  if(d.loadingType == 1){ }}
    包装多货
{{#  } else if(d.loadingType == 3) { }}
    摄影还库
{{# } }}
</script>

<script src="${ctx}/static/js/warehouse/instorereturns.js"></script>

