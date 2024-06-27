<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>fyndiq在线商品</title>

<style>
#fyndiq_newpublish .layui-form-select dl {
    max-height:600px;
}
.flex{
    display: flex;
}
.ml-8{
    margin-left: 8px;
}
</style>

<div class="layui-fluid" id="fyndiq_newpublish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" 
                        id="fyndiqOnlineproduct_searchForm" 
                        lay-filter="fyndiqOnlineproduct_searchForm"
                    >
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="orgId" 
                                        class="orgs_hp_custom"
                                        lay-filter="orgs_hp_fyndiqonline_pb"
                                        lay-search
                                    >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select
                                        name="sellerId" 
                                        lay-search 
                                        class="users_hp_custom" 
                                        lay-filter="users_hp_fyndiqonline_pb"
                                        data-roleList="fyndiq专员"
                                    >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="storeAcctIdList" 
                                        data-platcode="fyndiq"  
                                        xm-select="fyndiq_online_store_sel"
                                        id="fyndiq_online_store_selId" 
                                        class="users_hp_store_multi" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label">物品号</div>
                                <div class="layui-input-block">
                                    <input type="text" autocomplete="off" placeholder="物品号或商品ID" class="layui-input" name="articleIdOrProductIdStr">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label">标题</div>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="text" autocomplete="off" class="layui-input" name="title">
                                    <select name="titleSearchType">
                                        <option value="1">分词全模糊</option>
                                        <option value="0">常规模糊</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel" style="width: 150px;">
                                    <select name="skuSearchType">
                                        <option value="1">店铺子SKU</option>
                                        <option value="0">店铺子SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left: 180px;">
                                    <input type="text" class="layui-input" autocomplete="off" name="storeSkuStr">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label">在线数量</div>
                                <div class="layui-input-block" style="display:flex;">
                                    <select name="quantityType">
                                        <option value="0">小于等于</option>
                                        <%-- <option value="2">等于</option> --%>
                                        <option value="1" selected>大于等于</option>
                                    </select>
                                    <input type="number" autocomplete="off" class="layui-input" name="quantity" min="0" value="0">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="fyndiq_online_searchCate_btn">选择分类</button>
                                    <input type="hidden" name="pCateIdList" id="fyndiq_online_cateId_search_inp">
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('fyndiq_online__search_cate_div','fyndiq_online_cateId_search_inp')" style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">180天销量</label>
                                <div class="layui-input-block">
                                     <div class="layui-col-md6 layui-col-lg6">
                                         <input type="number" name="oneHundredAndEightySalesNumStart" autocomplete="off" placeholder=">=" class="layui-input inputBorRadLeft">
                                     </div>
                                     <div class="layui-col-md6 layui-col-lg6">
                                         <input type="number" name="oneHundredAndEightySalesNumEnd" autocomplete="off" placeholder="<" class="layui-input inputRad">
                                     </div>
                                 </div>
                             </div>
                            <%-- <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label">销量</div>
                                <div class="layui-input-block" style="display:flex;">
                                    <select>
                                        <option value="1">小于</option>
                                        <option value="2">等于</option>
                                        <option value="3">大于</option>
                                    </select>
                                    <input type="number" autocomplete="off" class="layui-input">
                                </div>
                            </div> --%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label">刊登时间</div>
                                <div class="layui-input-block">
                                    <input type="text" name="times" autocomplete="off" class="layui-input" id="fyndiq_onlineproduct_times">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select id="fyndiq_online_is_sale_status_sel" name="saleStatusList" xm-select="fyndiq_online_is_sale_status_sel" lay-filter="fyndiq_online_is_sale_status_sel">
                                        <option value="2">在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在线状态</label>
                                <div class="layui-input-block">
                                    <select name="fyndiq_status">
                                        <option value="">请选择</option>
                                        <option value="seEnable_1">瑞典在线</option>
                                        <option value="seEnable_0">瑞典下架</option>
                                        <option value="fiEnable_1">芬兰在线</option>
                                        <option value="fiEnable_0">芬兰下架</option>
                                        <option value="noEnable_1">挪威在线</option>
                                        <option value="noEnable_0">挪威下架</option>
                                        <option value="dkEnable_1">丹麦在线</option>
                                        <option value="dkEnable_0">丹麦下架</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">Fyndiq状态</label>
                                <div class="layui-input-block">
                                    <select name="fyndiqStatusList">
                                        <option value="">全部</option>
                                        <option value="new">new</option>
                                        <option value="blocked">blocked</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="sortType">
                                        <option value="1">刊登时间升序</option>
                                        <option value="2">刊登时间降序</option>
                                        <option value="3">7日销量升序</option>
                                        <option value="4">7日销量降序</option>
                                        <option value="5">180日销量升序</option>
                                        <option value="6">180日销量降序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="productStatus" value="for sale" id="fyndiq_onlineproduct_productStatus">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div style="margin-left:20px">
                                    <span class="layui-btn layui-btn-sm" lay-submit 
                                    lay-filter="fyndiq_onlineproduct_submit">查询</span>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                                </div>
                            </div>
                            <div class="layui-col-md10 layui-col-lg10" id="fyndiq_online__search_cate_div" style="line-height: 36px;"></div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="fyndiq_onlineproductCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="fyndiq_onlineproduct_tabs" id="fyndiq_onlineproduct_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">在线<span></span></li>
                                    <li>已下架<span></span></li>
                                    <li>已删除<span></span></li>
                                </ul>
                            </div>
                            <!-- 下面的div放按钮,结构不要变化 -->
                            <div class="layui-form">
                                <select name="fyndiq_batchHandle" lay-filter="fyndiq_batchHandleFilter">
                                    <option value="">批量操作</option>
                                    <permTag:perm funcCode="batch_update_fyndiq">
                                        <option value="update">批量更新</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="batch_remove_fyndiq">
                                        <option value="delete">批量删除</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="batch_update_stock_fyndiq">
                                        <option value="stock">调整库存</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="batch_update_price_fyndiq">
                                        <option value="price">调整价格</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_descript_info_fyndiq">
                                        <option value="descript" data-link="route/iframe/fyndiq/fyndiqModifyInventory" data-title="批量修改标题和描述">批量修改标题和描述</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="shelves_in_bulk_fyndiq">
                                        <option value="shelvesInBulk" data-title="批量上架">批量上架</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="bulk_off_shelves_fyndiq">
                                        <option value="bulkOffShelves" data-title="批量下架">批量下架</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="bulk_in_off_shelves_fyndiq">
                                    <option value="bulkInOffShelves" data-title="批量上下架">批量上下架</option>
                                    </permTag:perm>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table"  id="fyndiq_onlineproduct_table" lay-filter="fyndiq_onlineproduct_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-图片 --%>
<script type="text/html" id="fyndiq_onlineproduct_img">
    {{#  if(typeof(d.mainImage) !="undefined"){ }}
    <img width="60" height="60" data-original="{{ d.mainImage }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else if(d.variants){ }}
    <span>{{d.variants}}</span>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 表格-标题/产品ID --%>
<script type="text/html" id="fyndiq_onlineproduct_title">
    <div class="alignLeft">
        {{#  if(d.variants){ }}
            <div>
                <strong>物品号：</strong>
                <span>{{d.productId || ''}}</span>
            </div>
        {{#  } else { }}
            <div>
                <strong>标题:</strong>
                <span>{{d.title || ''}}</span>
            </div>
            <div>
                <strong>商品ID:</strong>
                <a>{{d.articleId || ''}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.articleId}}')" style="display: {{d.articleId ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            </div>
            
            <div class="flex">
                <div>
                    <strong>店铺:</strong>
                    <span>{{d.storeAcctName || ''}}</span>
                </div>
                <div class="ml-8">
                    <strong>销售:</strong>
                    <span>{{d.salesperson || ''}}</span>
                </div>
            </div>
        {{# } }}
    </div>
</script>
<style>
    span.myj-type-box {
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #a0a3a6;
        border-radius: 4px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #a0a3a6;
    }
</style>
<%-- 表格-sku --%>
<script type="text/html" id="fyndiq_onlineproduct_sku">
    <div class="alignLeft">
        {{#  if(d.variants){ }}
            <div>
                <strong>店铺父SKU：</strong>
                <a>{{d.parentSku || ''}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.parentSku}}')" style="display: {{d.parentSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            </div>
        {{#  } else { }}
            <div>
                <strong>店铺SKU:</strong>
                <a>{{d.storeSku || ''}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.storeSku}}')"  style="display: {{d.storeSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            </div>
            <div>
                <div style="float: right;">
                    {{#  if(d.isSale == 0){ }}
                        <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                    {{# } }}
                    {{#  if(d.productStatus == 'paused'){ }}
                        <span class="popoverHover myj-type-box fr layTitle" lay-title="已下架">下</span>
                    {{# } }}
                </div>
            </div>
        {{# } }}
        <span class="layui-bg-orange">站点:</span>
        <span class="layui-bg-red">{{d.markets || ''}}</span>
    </div>
</script>

<%-- 表格-属性 --%>
<script type="text/html" id="fyndiq_onlineproduct_attr">
    <div class="alignLeft">
        {{#  if(!d.variants){ }}
            <div>
                <strong>size:</strong>
                <span>{{d.size || ''}}</span>
            </div>
            <div>
                <strong>color:</strong>
                <span>{{d.color || ''}}</span>
            </div>
            <div>
                <strong>style:</strong>
                <span>{{d.style || ''}}</span>
            </div>
        {{# } }}
    </div>
</script>

<%-- 表格-可用/在途/未派 --%>
<script type="text/html" id="fyndiq_onlineproduc_detail">
    <div>
        {{#  if(d.stockNum == undefined){ }}
        {{# }else{ }}
            {{d.stockNum-d.reservationNum}}/{{d.orderNotInNum}}/{{d.lackUnPaiNum}}
        {{# } }}
    </div>
</script>

<%-- 表格-操作 --%>
<script type="text/html" id="fyndiq_onlineproduct_toolBar">
    {{#  if(!d.variants){ }}
        <div>
            <span class="layui-btn-xs layui-btn layui-btn-normal" lay-event="update">更新</span><br>
            <span class="layui-btn-xs layui-btn layui-btn-primary" lay-event="logs">日志</span>
        </div>
    {{# } }}
</script>

<%-- 弹框-日志表格 --%>
<script type="text/html" id="fyndiq_onlineproduct_logs">
    <div stlye="padding:20px">
        <table class="layui-table"  id="fyndiq_onlineproduct_logs_table"></table>
    </div>
</script>

<!-- 日志表格  操作类型 -->
<script type="text/html" id="fyndiq_onlineproduct_logs_table_operType">
<div>
    {{# if(d.operType == 1){ }}
        <span>改价</span>
    {{# }else if(d.operType == 2){ }}
        <span>改库存</span>
    {{# }else if(d.operType == 3){ }}
        <span>标零</span>
    {{# }else if(d.operType == 4){ }}
        <span>补货</span>
    {{# }else if(d.operType == 5){ }}
        <span>调整主图地址</span>
    {{# }else if(d.operType == 6){ }}
        <span>修改标题或者描述</span>
    {{# }else if(d.operType == 14){ }}
    <span>调整商品销售状态</span>
    {{# } }}
</div>
</script>

<%-- 弹框-调整库存 --%>
<script type="text/html" id="fyndiq_onlineproduct_stock">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="fyndiqOnlineproduct_searchLayerForm">
                <div class="layui-form-item">
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select 
                                name="orgId" 
                                class="orgs_hp_custom"
                                lay-filter="orgs_hp_fyndiqonline_pbLayer"
                                lay-search
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">销售员</label>
                        <div class="layui-input-block">
                            <select
                                name="sellerId" 
                                lay-search 
                                class="users_hp_custom" 
                                lay-filter="users_hp_fyndiqonline_pbLayer"
                                data-roleList="fyndiq专员"
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <select 
                                name="storeAcctIdStr" 
                                data-platcode="fyndiq"  
                                xm-select="fyndiq_online_store_selLayer"
                                id="fyndiq_online_store_selIdLayer" 
                                class="users_hp_store_multi" 
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <div class="layui-form-label">店铺SKU</div>
                        <div class="layui-input-block" style="display:flex;">
                            <input type="text" autocomplete="off" class="layui-input" name="skuStr">
                            <select name="skuSearchType">
                                <option value="2">精确</option>
                                <option value="1">模糊</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <div  class="layui-input-block">
                            <span class="layui-btn layui-btn-sm" lay-submit lay-filter="fyndiq_onlineproduct_layerSubmit">
                                查询
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-form" style="display:flex;justify-content: flex-end;margin-right: 20px; margin-bottom:20px;">
        <div style="display:flex;">
            <input type="radio" name="stock" value="now" title="按现有库存量增加">
            <input type="number" class="layui-input" name="nowVal" style="width:100px;">
        </div>
        <div style="display:flex;">
            <input type="radio" name="stock" value="edit" title="直接修改库存">
            <input type="number" class="layui-input" name="editVal"  style="width:100px;">
        </div>
        <span class="layui-btn layui-btn-sm" style="margin-left:20px;" id="fyndiq_onlineproduct_stock_btn">应用</span>
    </div>
    <div class="layui-card">
        <div class="layui-card-header" style="display:flex;justify-content:space-between;">
            <div>数量(<span id="fyndiq_onlineproduct_stock_count">0</span>)</div>
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="fyndiq_onlineproduct_stock_batch">批量操作</span>
        </div>
        <div class="layui-card-body">
            <table class="layui-table"  id="fyndiq_onlineproduct_layerTable" lay-filter="fyndiq_onlineproduct_layerTableFilter"></table>
        </div>
    </div>
</script>

<%-- 弹框-调整价格 --%>
<script type="text/html" id="fyndiq_onlineproduct_price">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="fyndiqOnlineproduct_searchPriceLayerForm">
                <div class="layui-form-item">
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select 
                                name="orgId" 
                                class="orgs_hp_custom"
                                lay-filter="orgs_hp_fyndiqonline_pbPriceLayer"
                                lay-search
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">销售员</label>
                        <div class="layui-input-block">
                            <select
                                name="sellerId" 
                                lay-search 
                                class="users_hp_custom" 
                                lay-filter="users_hp_fyndiqonline_pbPriceLayer"
                                data-roleList="fyndiq专员"
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                            <select 
                                name="storeAcctIdStr" 
                                data-platcode="fyndiq"  
                                xm-select="fyndiq_online_store_selPriceLayer"
                                id="fyndiq_online_store_selIdPriceLayer" 
                                class="users_hp_store_multi" 
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                            >
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <div class="layui-form-label">店铺SKU</div>
                        <div class="layui-input-block" style="display:flex;">
                            <input type="text" autocomplete="off" class="layui-input" name="skuStr">
                            <select name="skuSearchType">
                                <option value="2">精确</option>
                                <option value="1">模糊</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <div  class="layui-input-block">
                            <span class="layui-btn layui-btn-sm" lay-submit lay-filter="fyndiq_onlineproduct_layerPriceSubmit">
                                查询
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header" style="display:flex;justify-content:space-between;">
            <div>数量(<span id="fyndiq_onlineproduct_price_count">0</span>)</div>
            <div style="display:flex;">
                <div class="layui-form" style="display:flex;">
                    <div style="width: 200px;">
                        <div class="layui-form-label">站点</div>
                        <div class="layui-input-block">
                            <select name="fyndiqLayerSite"
                                    xm-select="fyndiqLayerSite"
                                    id="fyndiqLayerSite"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <select name="priceType">
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                    </select>
                    <input type="number" autocomplete="off" class="layui-input" name="priceNumber" style="width: 200px;">
                </div>
                <span class="layui-btn layui-btn-sm" style="margin-left:20px;" id="fyndiq_onlineproduct_price_btn">应用</span>
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="fyndiq_onlineproduct_price_batch">批量操作</span>
            </div>
        </div>
        <form class="layui-form" id="fyndiq_onlineproduct_layerPrice_marketsForm" style="display: flex;justify-content: end;">
            <p style="color: #1E9FFF;padding:0 10px">注：只调整选中的站点，不选代表调整所有站点</p>
            <input type="checkbox" name="markets" title="瑞典" value="SE" lay-skin="primary">
            <input type="checkbox" name="markets" title="芬兰" value="FI" lay-skin="primary">
            <input type="checkbox" name="markets" title="挪威" value="NO" lay-skin="primary">
            <input type="checkbox" name="markets" title="丹麦" value="DK" lay-skin="primary">
        </form>
        <div class="layui-card-body">
            <table class="layui-table"  id="fyndiq_onlineproduct_layerPriceTable" lay-filter="fyndiq_onlineproduct_layerPriceTableFilter"></table>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/publishs/fyndiq/onlineproduct.js"></script>
<script type="text/html" id="onlineFyndiq_TimingTpl">
    <div class="p20">
        <form class="layui-form" id="onlineFyndiq_TimingTplForm">
            <div class="tips" style="padding: 0 0 20px 20px;"></div>
            <div class="layui-form-item" style="padding: 0 0 20px 20px;">
                <input type="checkbox" name="markets" title="瑞典" value="SE" lay-skin="primary">
                <input type="checkbox" name="markets" title="芬兰" value="FI" lay-skin="primary">
                <input type="checkbox" name="markets" title="挪威" value="NO" lay-skin="primary">
                <input type="checkbox" name="markets" title="丹麦" value="DK" lay-skin="primary">
            </div>
        </form>
    </div>
</script>
