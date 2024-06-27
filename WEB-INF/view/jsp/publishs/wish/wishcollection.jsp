<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>wish采集刊登</title>

<style>
.wishcollection-pskuBtn {
    color: #5000ff;
    cursor:pointer;
}
#wishcollection-skuDetailLayerContainer {
    padding: 20px 40px 0 0;
}
.wishcollection_w100 {
    width: 100px;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-card">
          <div class="layui-card-body">
            <form class="layui-form" id="wishcollectionSearchForm">
              <div class="layui-form-item">
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                        <select  id="wishcollection_depart_sel" lay-search lay-filter="wishcollection_depart_sel"  class="orgs_hp_custom">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">销售人员</label>
                    <div class="layui-input-block">
                        <select  id="wishcollection_salesman_sel" lay-search lay-filter="wishcollection_salesman_sel"  class="users_hp_custom" data-rolelist="wish专员" name="salesPersonId">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <select id="wishcollection_store_sel" lay-search lay-filter="wishcollection_store_sel"   class="store_hp_custom" data-platcode="wish" name="storeAcctId">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">排序</label>
                    <div class="layui-input-block">
                        <select lay-search name="orderType">
                            <option value=""></option>
                            <option value="1">采集时间正序</option>
                            <option value="2">采集时间倒序</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-label labelSel">
                        <select name="skuType">
                            <option selected value="pSku">父SKU</option>
                            <option value="sku">子SKU</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <input type="text" name="skuvalue" class="layui-input" placeholder="支持多个">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-item">
                        <label class="layui-form-label">开始时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="collectionStartTime" id="wishcollection_collectionStartTime" readonly>
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-item">
                        <label class="layui-form-label">结束时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="collectionEndTime" id="wishcollection_collectionEndTime" readonly>
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-item">
                        <label class="layui-form-label">采集人</label>
                        <div class="layui-input-block">
                            <select lay-search name="creatorId" id="wishcollection_creatorId">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <div class="layui-form-item">
                        <label class="layui-form-label">生成状态</label>
                        <div class="layui-input-block">
                            <select lay-search name="generatedType">
                                <option value=""></option>
                                <option value="0">未生成</option>
                                <option value="1">已生成</option>
                            </select>
                        </div>
                    </div>
                </div>
                <input type="hidden" name="listingStatus" value="-2">
                <div class="layui-col-lg3 layui-col-md3  layui-col-md-offset6 layui-col-lg-offset6">
                    <div class="layui-form-item">
                       <div class="layui-input-block">
                         <span class="layui-btn layui-btn-sm" lay-submit lay-filter="wishcollection_filter">查询</span>
                       </div>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="layui-card" id="wishcollectionCard">
            <div class="fixHigh">
                <div class="layui-card-header">
                    <div class="fixTab">
                        <!-- 页签点击结构 -->
                        <div class="layui-tab" lay-filter="wishcollection-tabs"        
                        id="wishcollection-tabs">
                            <ul class="layui-tab-title">
                                <li class="layui-this" data-status="-2">采集商品<span></span></li>
                                <li  data-status="3">刊登中<span></span></li>
                                <li  data-status="1">刊登成功<span></span></li>
                                <li  data-status="2">刊登失败<span></span></li>
                            </ul>
                        </div>
                        <div>
                            <permTag:perm funcCode="wishcollection-batchDelete">    
                            <span class="layui-btn layui-btn-sm layui-btn-danger" id="wishcollection-batchDelete">
                                批量删除
                            </span>
                            </permTag:perm>
                            <permTag:perm funcCode="wishcollection-generateProduct"> 
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="wishcollection-generateProduct">
                                生成店铺商品
                            </span>
                            </permTag:perm>
                             <permTag:perm funcCode="wishcollection-import"> 
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="wishcollection-import">
                                导入采集
                            </span>
                            </permTag:perm>
                             <permTag:perm funcCode="wishcollection-delProduct"> 
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="wishcollection-delProduct">
                                删除商品
                            </span>
                            </permTag:perm>
                             <permTag:perm funcCode="wishcollection-immediatelyPublish"> 
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="wishcollection-immediatelyPublish">
                                立即刊登
                            </span>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
            </div>
           <!-- 下面放表格 -->
            <div class="layui-card-body">
                <table class="layui-table" id="wishcollection-table" 
                lay-filter="wishcollection-tableFilter"></table>
            </div>
        </div>
      </div>
    </div>
</div>

<%-- 表格---图片 --%>
<script type="text/html" id="wishcollection-mainImageUrl">
    <img width="60" height="60"  data-original="{{d.mainImageUrl}}" class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
</script>

<%-- 表格--父sku点击 --%>
<script type="text/html" id="wishcollection-psku">
    <span data-id="{{d.id}}" data-storeAcctId = "{{d.storeAcctId}}" class="wishcollection-pskuBtn">{{d.psku}}</span>
</script>

<%-- 表格--子SKU详情 --%>
<script type="text/html" id="wishcollection-skuDetail">
    <table class="layui-table colspantable" style="width: 420px;margin-left: -5px;">
        {{# layui.each(d.slist, function(index, item){ }} 
        {{# if(index<1){ }} 
            {{# if(index==d.slist.length-1){ }} 
                <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{# }else{ }}
                <tr>
            {{# } }} 
        {{# }else{ }} 
            {{# if(index == d.slist.length-1){ }}
                <tr style="display: none;" class="myj-hide">
            {{# }else{ }}
                <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{# } }} 
        {{# } }}
                    <td style="width:120px;text-align: left;color: #000;font-size: 12px;">
                        <div title="对应的基础子商品sku"> {{item.sku || ''}} </div>
                    </td>
                    <td class="layui-table-cell" style="width:60px;text-align: left;font-size: 12px;"> 
                        <div>{{item.color || ''}}</div>
                    </td>
                    <td class="layui-table-cell" style="width:60px;text-align: left;font-size: 12px;"> 
                        <div>{{item.size || ''}}</div>
                    </td>
                    <td class="layui-table-cell" style="width:80px;text-align: left;font-size: 12px;"> 
                        <div>{{item.shipping || ''}}</div>
                    </td>
                    <td class="layui-table-cell" style="width:80px;text-align: left;font-size: 12px;"> 
                        <div>{{item.price || ''}}</div>
                    </td>
                </tr>
                {{# }); }}
    </table>
    {{# if(d.slist.length > 1){ }}
    <a href="javascript:" onclick="wishcollection_changeColspantable(this, {{d.slist.length}});" class="productListSkuShow" style="float:right;">+ 展开({{ d.slist.length }})</a> {{# } }}
</script>

<%-- 弹框--sku点击根据id获取详情 --%>
<script type="text/html" id="wishcollection-skuDetailLayer">
    <div id="wishcollection-skuDetailLayerContainer"></div>
</script>
<script type="text/html" id="wishcollection-skuDetailLayerTpl">
 <%-- 信息展示 --%>
  <div class="layui-row">
  <form class="layui-form">
    <div class="layui-form-item">
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label">商品父SKU</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.psku || ''}}" readonly>
            </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label">店铺父SKU</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.storePSku || ''}}" readonly>
            </div>
        </div>
        <div class="layui-col-lg3 layui-col-md3">
            <label class="layui-form-label">创建人</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.creator || ''}}" readonly>
            </div>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">英文标题</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" value="{{d.productName || ''}}" readonly>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">
        <span>tags</span><br>
        <span class="layui-badge layui-bg-blue">数量:<i class="tagsinputNum">0</i></span>
        </label>
        <div class="layui-input-block">
           <div class="tagsinput-primary form-group">
                <input type="text" name="tag" value="{{d.tags}}" data-role="tagsinput" />
            </div>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">商品描述</label>
        <div class="layui-input-block">
            <textarea placeholder="请输入" class="layui-textarea" readonly style="height:300px;">{{d.description || ''}}</textarea>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">主图</label>
        <div class="layui-input-block">
            <img src="{{d.mainImageUrl}}" width="200" height="200" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">辅图</label>
        <div class="layui-input-block">
        {{# if(d.extraImageUrl){ }}
           {{#  layui.each(d.extraImageUrl.split('|'), function(index, item){ }}
            <img src="{{item}}" width="150" height="150" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
           {{# }); }}
        {{# }else{ }}
        <span>暂无辅图</span>
        {{# } }}
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">产品变种</label>
        <div class="layui-input-block">
            <table class="layui-table">
                <thead>
                    <tr>
                        <th  colspan="1" rowspan="2">SKU</th>
                        <th  colspan="1" rowspan="2">店铺子SKU</th>
                        <th colspan="2">尺寸</th>
                        <th colspan="1" rowspan="2">颜色</th>
                        <th colspan="1" rowspan="2">重量(g)</th>
                        <th colspan="2">售价(¥)</th>
                    </tr>
                    <tr>
                        <th>参考值</th>
                        <th>自定义</th>
                        <th>参考值</th>
                        <th>自定义</th>
                    </tr>
                </thead>
                <tbody id="wishcollection-skuDetailLayer_tbody">
                {{#  layui.each(d.slist, function(index, item){ }}
                <tr data-id="{{item.id}}">
                    <td>{{item.sku || ''}}</td>
                    <td>{{item.storeSSku || ''}}</td>
                    <td>{{item.size || ''}}</td>
                    <td class="wishcollection_w100"><input type="text" class="layui-input wishcollection_w100" name="oaSize" value="{{item.oaSize || ''}}"></td>
                    <td>{{item.color || ''}}</td>
                    <td>{{item.quantity || ''}}</td>
                    <td>{{item.localizedPrice || ''}}</td>
                    <td class="wishcollection_w100"><input type="text" class="layui-input wishcollection_w100" name="oaPrice"  value="{{item.oaPrice || ''}}"></td>
                </tr>
                {{#　})　}}
                </tbody>
            </table>
        </div>
    </div>
  </form>
  </div>
  <%-- 表格变种信息 --%>
</script>



<script src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script src="${ctx}/static/js/publishs/wish/wishcollection.js"></script>