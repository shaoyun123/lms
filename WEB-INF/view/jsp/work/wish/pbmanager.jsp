<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>  
<title>PB管理</title>

<div class="layui-fluid" id="LAY-wish-pbmanager">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="pb_searchForm" class="layui-form" action="" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发人员</label>
                                <div class="layui-input-block">
                                    <select name="sellerId"  class="users_hp_custom" data-rolelist="wish专员" lay-filter="users_hp_wishPersion_pb" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" data-platcode="wish" class="store_hp_custom" lay-search="" >
                                        <option value="">选择店铺</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">活动状态</label>
                                <div class="layui-input-block">
                                    <select name="activityStatus" lay-search="">
                                        <option value="">选择状态</option>
                                        <c:forEach items="${activityStatusList}" var="activityStatus">
                                            <option value="${activityStatus.getCode()}">${activityStatus.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input name="listingTime" type="text" class="layui-input" id="pb_listTime">
                                </div>
                            </div>   
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">比例</label>
                                <div class="layui-input-block">
                                    <input name="minProportion" type="text" class="layui-input" style="width:40%;float:left;margin-right:5%">
                                    <span style="width:10%;">--</span>
                                    <input name="maxProportion" type="text" class="layui-input" style="width:40%;float:right;margin-left:5%">
                                </div>
                            </div> 
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">搜索类型</label>
                                <div class="layui-input-block">
                                    <select name="searchType" lay-search="">
                                        <option value="listingStoreSubId">产品ID</option>
                                        <option value="promotionId">活动ID</option>
                                        <option value="pSkus">商品SKU</option>
                                        <option value="title">产品名称</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">搜索内容</label>
                                <div class="layui-input-block">
                                    <input type="text" name="searchValue" placeholder="请输入搜索内容" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="pbmanagerProdAttrList" lay-search="" id="pbmanager_tag">
                                        <option value=""></option>
                                        <c:forEach items="${prodTags}" var="tag">
                                            <option value="${tag.name}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="pbmanagerLogisAttrRelation">
                                        <option value="and">物流属性(与)</option>
                                        <option value="or">物流属性(或)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="pbmanagerLogisAttr" xm-select="pbmanager_logisAttr_sel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='pbmanager_logisAttr_sel'>
                                        <option value=""></option>
                                        <c:forEach items="${logisAttrList}" var="logisAttr">
                                            <option value="${logisAttr.name}"
                                                    alias="${logisAttr.alias}">${logisAttr.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div hidden id="pbmanager_logisAttrList">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <option value="${logisAttr.name}"
                                                alias="${logisAttr.alias}">${logisAttr.name}</option>
                                    </c:forEach>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderBy" lay-search="">
                                        <option value="">选择排序方式</option>
                                        <option value="listing_time asc">按时间∧</option>
                                        <option selected value="listing_time desc">按时间∨</option>
                                        <option value="cost asc">按费用∧</option>
                                        <option value="cost desc">按费用(∨)</option>
                                        <option value="order_num asc">按订单∧</option>
                                        <option value="order_num desc">按订单∨</option>
                                        <option value="order_total_amt asc">按金额∧</option>
                                        <option value="order_total_amt desc">按金额∨</option>
                                        <option value="proportion asc">按比例∧</option>
                                        <option value="proportion desc">按比例∨</option>
                                    </select>
                                </div>
                            </div> 
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" id="pb_searchBtn">搜索</button>
                                <button id="pb_searchReset" type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div> 
                                
                        </div>
                    </form>    
                </div>
            </div>
            <div class="layui-card" id="pbmanagerCard">
                <div class="layui-card-header">
                        <!-- <button class="layui-btn layui-btn-sm layui-btn-normal" id="pb_noCollectListing">未采集listing</button> -->
                        <!--<button class="layui-btn layui-btn-sm layui-btn-normal" id="pb_completeActive">完成活动</button>-->
                        <!-- <button class="layui-btn layui-btn-sm layui-btn-normal" id="pb_editProdPbListingWish">新增产品</button> -->
                        <button id="pb_export" type="button" class="layui-btn layui-btn-danger layui-btn-sm">导出</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="pbmanagerTable" lay-filter="table-filter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- table工具条 -->
<script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs mb10" lay-event="pbManagerAlter">商品详情</a>
    <br />
    <a class="layui-btn layui-btn-primary layui-btn-xs mb10" lay-event="pbManagerDetail">活动详情</a>
    <!-- <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="pbManagerAdd">新增活动</a> -->
</script>
<script type="text/html" id="barDemo1">
    <!--<a class="layui-btn layui-btn-xs" lay-event="pbManagerAlterKeyword">修改关键词</a>-->
    <!-- <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="pbManagerAlterAction">修改活动</a> -->
</script>
<!-- PB管理弹出框 -->
<!-- 未采集listing -->
<script type="text/html" id="pb_unCollectListingLayer">
    <div class="p20"><textarea  placeholder="没有未采集的listing" class="layui-textarea"></textarea></div>
</script>
<!-- 完成活动 -->
<script type="text/html" id="pb_completeActiveLayer">
        <div class="p20"><textarea rows="20" placeholder="请输入" class="layui-textarea"></textarea></div>
</script>
<!-- 新增产品 -->
<script type="text/html" id="pb_editProdPbListingWishLayer">
    <div class="p20">
        <form id="pb_editProdPbListingWishForm" action="" class="layui-form" lay-filter="edit-prod-listing-wish-filter">
            <input name="id" type="hidden">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="red">*</span>店铺</label>
                <div class="layui-input-block">
                    <select name="storeAcctId" lay-search="" lay-filter="edit-store-acct-id" lay-verify="required">
                        <option value=""></option>
                        <c:forEach items="${sysSalesPlatAccts}" var="sysSalesPlatAcct">  
                          <option value="${sysSalesPlatAcct.id}" data-seller="${sysSalesPlatAcct.salesperson}" data-sellerid="${sysSalesPlatAcct.salespersonId}">${sysSalesPlatAcct.storeAcct}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>销售</label>
                    <div class="layui-input-block">
                        <select name="sellerId" lay-search="" lay-verify="required">
                            <option value=""></option>
                            <c:forEach items="${wishUsers}" var="wishUser">  
                              <option value="${wishUser.id}">${wishUser.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>产品ID</label>
                    <div class="layui-input-block">
                        <input name="listingStoreSubId" type="text" class="layui-input" lay-verify="stringnum" placeholder="listing的商品ID">
                    </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>产品名称</label>
                    <div class="layui-input-block">
                        <input name="title" type="text" lay-verify="required" class="layui-input" placeholder="产品名称">
                    </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>商品父SKU</label>
                    <div class="layui-input-block">
                        <input name="pSkus" type="text" lay-verify="required" class="layui-input" placeholder="多个用逗号隔开">
                    </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>竞品链接</label>
                    <div class="layui-input-block">
                        <input name="competitorUrl" type="text" lay-verify="required" class="layui-input">
                    </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">卖家标价</label>
                    <div class="layui-input-inline">
                        <input name="cmpeSellingPrice" autocomplete="off" class="layui-input" placeholder="竞品卖家标价">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">累计销量</label>
                    <div class="layui-input-inline">
                        <input name="cmpeCumuSales" autocomplete="off" class="layui-input" placeholder="竞品累计销量">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">累计收藏量</label>
                    <div class="layui-input-inline">
                        <input name="cmpeCollNums" autocomplete="off" class="layui-input" placeholder="竞品累计收藏量">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">刊登时间</label>
                    <div class="layui-input-inline">
                        <input id="pb_cmpeListTime" name="cmpeListingTime" autocomplete="off" class="layui-input" placeholder="竞品刊登时间">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>销售技巧</label>
                    <div class="layui-input-block">
                        <input name="skill" type="text" lay-verify="required" class="layui-input">
                    </div>
            </div>
            <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                            <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                    </div>
            </div>
            <div class="layui-form-item" style="display: none;">
              <div class="layui-input-block">
                <button class="layui-btn submit-btn" lay-submit="" lay-filter="demo1">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
              </div>
            </div>
        </form>
    </div>
</script>
<!-- 详情 -->
<script type="text/html" id="pbManagerDetail">
   <div class="p20">
     <table class="layui-table" id="pbManagerDetailTable" lay-filter='demo1'></table>
     <div id="pb_listingContent">这里应该显示的是渲染过来的数据,不可改</div>
   </div>
</script>
<!-- 新增/修改活动 -->
<script id="pb_managerAdd" type="text/html">
    <div class="p20">
        <form class="layui-form" action="">
			<input name="id" type="hidden">
			<input name="pbListingId" type="hidden">
            <!--<div class="layui-form-item">
              <label class="layui-form-label"><span class='red'>*</span>活动ID</label>
              <div class="layui-input-block">
                <input name="promotionId" type="text" class="layui-input">
              </div>
            </div>-->
            <div class="layui-form-item">
                <label class="layui-form-label"><span class='red'>*</span>活动时间</label>
                <div class="layui-input-block">
                  <input name="promotionTime" type="text" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class='red'>*</span>竞价($)</label>
                <div class="layui-input-block">
                  <input name="bid" type="text" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class='red'>*</span>预算($)</label>
                <div class="layui-input-block">
                  <input name="budget" type="text" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class='red'>*</span>完成后更新</label>
                <div class="layui-input-block">
                  <input type="checkbox" checked name="isAutoRenew" lay-skin="switch" lay-text="是|否">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class='red'>*</span>关键词</label>
                <div class="layui-input-block">
                  <textarea name="tag" placeholder="请输入关键词，逗号隔开" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><span class="red">*</span>同步到WISH</label>
                    <div class="layui-input-inline">
                      <input type="checkbox" checked name="isSyncWish" lay-filter="pb_isSyncWishFilter" lay-skin="switch" lay-text="是|否">
                    </div>
                </div>
                <div class="layui-inline layui-hide">
                    <label class="layui-form-label"><span class="red">*</span>WISH活动ID</label>
                    <div class="layui-input-inline">
                        <input name="promotionId" lay-verify="stringnum" autocomplete="off" class="layui-input" placeholder="">
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 修改关键字 -->
<script id="pbManagerAlterKeyword" type="text/html">
    <div class="p20">
        <textarea placeholder="请输入内容" class="layui-textarea"></textarea>
    </div>
</script>
<script type="text/html" id="pb_activityStatusTpl">
	<c:forEach items="${activityStatusList}" var="activityStatus">  
		    {{#  if(d.activityStatus ==${activityStatus.getCode()}){ }}
                {{#  if(d.activityStatus == 1){ }}
                  <span class="layui-green">
                {{#  } else { }}
                  <span class="layui-gray">
                {{#  } }}  
			    ${activityStatus.getValue()}
                </span>
		    {{#  } }}
    </c:forEach>
</script>
<script type="text/html" id="pb_promotionTimeTpl">
	{{#
		var startTime =format( d.startTime, "yyyy-MM-dd");
		var expectedEndTime =format( d.expectedEndTime, "yyyy-MM-dd");
		return startTime + " - " + expectedEndTime;
	}}
</script>
<script type="text/html" id="pb_imageTpl">
	{{#  if(typeof(d.image) !="undefined"){ }}
			<img width="60" height="60" data-original="{{ d.image }}"  data-onerror='layui.admin.img_noFind()' class="img_show_hide  lazy b1">
  {{#  } }}
</script>
<script type="text/html" id="pb_listingStoreSubIdTpl">
	<a href="https://www.wish.com/c/{{ d.listingStoreSubId }}" target="_blank">{{ d.listingStoreSubId }}</a>
    <span style="color:#999;">刊登时间:</span>{{#  if(typeof(d.listingTime) !="undefined"){ }}{{ format(d.listingTime, "yyyy-MM-dd") }}{{#  } }}<br>
    <a href="{{ d.competitorUrl }}" target="_blank">竞品信息：</a>
    <span style="color:#999;">卖家标价:</span>{{#  if(typeof(d.cmpeSellingPrice) !="undefined"){ }}{{ d.cmpeSellingPrice }}{{#  } }}
    <span style="color:#999;">累计销售量:</span>{{#  if(typeof(d.cmpeCumuSales) !="undefined"){ }}{{ d.cmpeCumuSales }}{{#  } }}<br>
    <span style="color:#999;">累计收藏量:</span>{{#  if(typeof(d.cmpeCollNums) !="undefined"){ }}{{ d.cmpeCollNums }}{{#  } }}
    <span style="color:#999;">竞品刊登时间:</span>{{#  if(typeof(d.cmpeListingTime) !="undefined"){ }}{{ format(d.cmpeListingTime, "yyyy-MM-dd") }}{{#  } }}<br>
</script>
<script type="text/html" id="pb_proportionTpl">
	{{#  if(typeof(d.proportion) !="undefined"){ }}
			    {{ d.proportion }}%
  {{#  } }}
</script>
<script type="text/html" id="pb_listingContentTpl">
	<div><span  style="color:#999;">1000PV转化订单:</span>{{ d.orderNum }}</div>
	<div><span  style="color:#999;">1000PV销售额:</span>{{ d.orderTotalAmt }}</div>
	<div><span  style="color:#999;">竞品:</span><a href="{{ d.competitorUrl }}" target="_blank">{{ d.competitorUrl }}</a></div>
	<div><span  style="color:#999;">技巧:</span>{{ d.skill }}</div>
	<div><span  style="color:#999;">备注:</span>{{ d.remark }}</div>
</script>
<script src="${ctx}/static/js/work/wish/pbmanager.js"></script>