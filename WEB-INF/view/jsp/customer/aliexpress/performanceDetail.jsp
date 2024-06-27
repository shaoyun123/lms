<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>订单详情</title>
<!-- 更简化 -->
<style>
    
</style>

<div class="layui-tab" lay-filter="performance_detailTabs" id="performance_detailTabs">
    <ul class="layui-tab-title">
        <li class="layui-this">详情<span></span></li>
        <li>日志<span></span></li>
    </ul>
    <div class="layui-tab-content">
        <div class="layui-tab-item layui-show" id="performance_detailTab1Container"></div>
        <div class="layui-tab-item" id="performance_detailTab2Container"></div>
    </div>
</div>


<%-- 弹框-详情-详情tab --%>
<script type="text/html" id="performance_detailTab1ContainerTpl">
    <%-- 表格 --%>
    <div>
        <table class="layui-table">
            <thead>
                <tr>
                    <th width="80">OA图片</th>
                    <th width="120">平台图片</th>
                    <th width="120">item_id</th>
                    <th width="110">商品SKU
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.prodSSkuOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc prodSSku"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc prodSSku"></i></span>
                    </th>
                    <th width="40">可用库存
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.availableStockOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc availableStock"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc availableStock"></i></span>
                    </th>
                    <th width="35">商品数量</th>
                    <th width="40">商品总量
                      <span class="layui-table-sort layui-inline" lay-sort="{{d.allCountOrderBy}}"><i class="layui-edge layui-table-sort-asc" data-orderBy="asc allCount"></i><i class="layui-edge layui-table-sort-desc" data-orderBy="desc allCount"></i></span>
                    </th>
                    <th width="35">平台数量</th>
                    <th width="175">商品价格</th>
                </tr>
            </thead>
            <tbody>
                {{# if(d.orderDetails.length>0){ }}
                 {{#  layui.each(d.orderDetails, function(index, item){ }}
                     <tr>
                      <td>
                         <img class="b1 img_show_hide" width="60" height="60"  src="{{item.imageUrl}}" onerror="layui.admin.img_noFind()">
                      </td>
                      <td style="padding: 9px 5px;">
                       <img class="b1 img_show_hide" width="60" height="60"  src="{{item.platImageUrl ||''}}" onerror="layui.admin.img_noFind()">
                      
                      </td>
                      <td>
                        {{item.itemId || ''}}
                        {{# if(item.itemId){ }}
                            <span onclick="layui.admin.onlyCopyTxt('{{item.itemId}}')" class="copy-icon">
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                        {{# } }}
                      </td>
                      <!-- 商品SKU -->
                      <td style="padding: 9px 5px;">
                       <div>{{item.prodSSku || ''}}
                         <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="cursor:pointer">
                           <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                         </span>
                       </div>
                      </td>
                      <%-- 可用库存--%>
                      <td>
                          {{# if(item.outStockFlag){ }}
                          <div style="font-weight:700;font-size:24px;color:#f00;">{{item.availableStock}}</div>
                          {{# }else{ }}
                          <span>{{item.availableStock}}</span>
                          {{# } }}
                      </td>
                      <%-- 商品数量--%>
                      <td>
                          <!-- {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                          <div style="font-weight:700;font-size:24px;color:#f00;">{{item.prodQuantity || ''}}</div>
                          {{# }else{ }}
                          <span>{{item.prodQuantity || ''}}</span>
                          {{# } }} -->
                          {{# if(item.outStockFlag){ }}
                          <div style="font-weight:700;font-size:24px;color:#f00;">{{item.prodQuantity || ''}}</div>
                          {{# }else{ }}
                          <span>{{item.prodQuantity || ''}}</span>
                          {{# } }}
                      </td>
                      <%-- 商品总量--%>
                      <td>
                          <!-- {{# if(item.allCount > item.availableStock && item.holdStock <= 0){ }}
                          <div style="font-weight:700;font-size:24px;color:#f00;">{{item.allCount || ''}}</div>
                          {{# }else{ }}
                          <span>{{item.allCount || ''}}</span>
                          {{# } }} -->
                          {{# if(item.outStockFlag){ }}
                          <div style="font-weight:700;font-size:24px;color:#f00;">{{item.allCount || ''}}</div>
                          {{# }else{ }}
                          <span>{{item.allCount || ''}}</span>
                          {{# } }}
                      </td>
                      <!-- 平台数量 -->
                      <td>{{item.platQuantity || ''}}</td>
                      <!-- 商品价格 -->
                      <td>
                       <div style="text-align:left;">
                         <div>销售金额:{{item.platOrderDetailAmt || ''}}</div>
                         <div title="平均库存成本|商品成本">
                           成本(¥):{{item.prodUnitCost || ''}}|{{item.detailCostPrice || ''}}
                         </div>
                         <div title="库存成本|商品成本占比">
                           成本占比:{{# if(!item.prodCost || !item.prodUnitCost){ }}
                           <span></span>
                           {{# }else{ }}
                           <span>{{(item.prodUnitCost*item.prodQuantity*100/item.prodCost).toFixed(0)+'%' }}</span>
                           {{# } }}
                           <span>|</span>
                           {{# if(!item.costPrice || !item.detailCostPrice){ }}
                           <span></span>
                           {{# }else{ }}
                           <span>{{(item.detailCostPrice*item.prodQuantity*100/item.costPrice).toFixed(0)+'%'}}</span>
                           {{# } }}
                         </div>
                         <div>净重(g):{{item.prodUnitWeight || ''}}</div>
                       </div>
                      </td>
                     </tr>
                 {{#  }); }}
                {{# }else{ }}
                <tr><td colspan="15">暂无数据</td></tr>
                {{# } }}
             </tbody>
        </table>
    </div>
</script>
<%-- 弹框--详情-日志tab --%>
<script type="text/html" id="performance_detailTab2ContainerTpl">
      <div>
          <table class="layui-table">
              <thead>
                  <tr>
                      <th style="width: 25%;text-align: center;">时间</th>
                      <th style="width: 10%;text-align: center;">操作人</th>
                      <th style="width: 65%;">日志</th>
                  </tr>
              </thead>
              <tbody>
                 {{# if(d.length>0){ }}
                  {{#  layui.each(d, function(index, item){ }}
                      <tr>
                        <td style="width: 25%;text-align: center;">{{ Format(item.operTime,"yyyy-MM-dd hh:mm:ss") }}</td>
                       <td style="width: 10%;text-align: center;">{{item.operator}}</td>
                       <td style="width: 65%;white-space: break-spaces;word-break: break-word;">{{item.operDesc}}</td>
                      </tr>
                  {{#  }) }}
                 {{# }else{ }}
                 <tr><td colspan="4">暂无数据</td></tr>
                 {{# } }}
              </tbody>
          </table>
          <!-- <div class="returnToTop"><div class="layui-icon layui-icon-up"></div></div> -->
      </div>
</script>
