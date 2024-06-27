<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>缺货</title>
<style>
    .dis_flex{
        display:flex;
        justify-content: space-between;
    }
    div.gray-c {
        color: #737679 !important;
        position: relative;
    }
    a.newsupplyName{
        color: #428bca;
    }
    #outofstockCard .fixedPosition .toFixedContain{
        padding-left: 10px;
    }

</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="outofstock_searchForm" lay-filter="outofstock_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购部门</label>
                                <div class="layui-input-block">
                                    <select name="buyerOrganize" id="outofstock_mapping_buyer_organize_sel" lay-filter="orgs_hp_buyer_newdevelop" class="orgs_buyer_custom" data-id="newDevelop_buyer" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购专员</label>
                                <div class="layui-input-block">
                                      <select name="buyerId"
                                        id="outofstock_mapping_buyer_sel"
                                        lay-filter="users_hp_buyer_newdevelop"
                                        xm-select="users_hp_buyer_newdevelop" xm-select-search-type="dl" xm-select-skin="normal"
                                        xm-select-search class="users_buyer_custom"
                                        data-id="newDevelop_buyer" data-roleList="采购专员">
                                      </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发部门</label>
                                <div class="layui-input-block">
                                    <select name="developerOrganize" id="outofstock_mapping_developer_organize_sel" lay-filter="orgs_hp_devPerson_newdevelop" class="orgs_hp_custom" data-id="newDevelop_devPerson" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <%--<select name="outofstock_mapping_developer_sel" lay-search  id="outofstock_mapping_developer_sel"></select>--%>
                                    <select name="developerId" id="outofstock_mapping_developer_sel" lay-filter="users_hp_devPerson_newdevelop" lay-search="" class="users_hp_custom" data-id="newDevelop_devPerson" data-roleList="开发专员">
                                    </select>
                                    <!-- <select name="outofstock_mapping_developer_sel" class="users_hp_custom"
                                        id="outofstock_mapping_developer_sel"
                                        xm-select="users_hp_devPerson_newdevelop"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                        lay-filter='users_hp_devPerson_newdevelop'
                                        data-id="users_hp_devPerson_newdevelop" data-roleList="开发专员">
                                    </select> -->
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">整合专员</label>
                                <div class="layui-input-block">
                                    <select name="outofstock_mapping_integrator_sel" lay-search  id="outofstock_mapping_integrator_sel"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="outofstock_isSale_sel" id="outofstock_isSale_sel" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="outofTimeType" id="outofstock_outofTimeType_sel" lay-search>
                                        <option value="1">缺货时间</option>
                                        <option value="2">创建时间</option>
                                        <option value="3">采购找不到</option>
                                        <option value="4">整合找不到</option>
                                        <option value="5">开发找不到</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="outofTime" id="outofstock_outofTime_text" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">预计到货天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="text" autocomplete="off" name="expectedArrivalDayStart" id="outofstock_expectedArrivalDayStart_text" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="text" autocomplete="off" name="expectedArrivalDayEnd" id="outofstock_expectedArrivalDayEnd_text" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">找供应商</label>
                                <div class="layui-input-block">
                                    <select name="findSupplyType" xm-select="outofstock_findSupplyType_sel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='outofstock_findSupplyType_sel'>
                                        <option value="">全部</option>
                                        <option value="0">无</option>
                                        <option value="1">采购找不到</option>
                                        <option value="2">整合找不到</option>
                                        <option value="3">开发找不到</option>
                                        <option value="4">找到</option>
                                    </select>
                                </div>
                            </div>


                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select id="outofstock_skutype_sel" lay-search>
                                        <option value="1">子SKU模糊</option>
                                        <option value="2">父SKU模糊</option>
                                        <option value="3">子SKU精确</option>
                                        <option value="4">父SKU精确</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="prodSSkus" id="outofstock_skus_text" class="layui-input" placeholder="支持多个,模糊最多支持100个">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购备注</label>
                                <div class="layui-input-block">
                                    <input name="buyerRemark" type="text" autocomplete="off" id="outofstock_buyerRemark_text" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">原供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="outstock_supplierId">
                                    <div>
                                        <input type="text" autocomplete="off" name="supplierName" id="outofstock_newSupplyName_text" class="layui-input" sourType="outof_stock" placeholder="支持候选搜索">
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">实际到货时间</label>
                                <div class="layui-input-block">
                                        <input type="text" name="actualArrivalTime"  id="outofstock_actualArrivalTime_text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">预计到货时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="expectedArrivalTime" id="outofstock_expectedArrivalTime_text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="expectedArrivalTimeType" id="outofstock_expectedArrivalTimeType_sel" lay-search>
                                    <option value="">有无预计到货时间</option>
                                    <option value="0">无</option>
                                    <option value="1">有</option>
                                </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="outofstock_sourceType_sel" id="outofstock_sourceType_sel" lay-search>
                                    <option value="">缺货来源</option>
                                    <option value="1">缺货订单</option>
                                    <option value="2">手工录入</option>
                                </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="isArrival" id="outofstock_isArrival_sel" lay-search>
                                    <option value="">是否到货</option>
                                    <option value="1">是</option>
                                    <option value="0" selected>否</option>
                                </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="storeId" id="outofstock_storeId" lay-search>
                                </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                    <select name="orderBy" id="outofstock_sortdesc_sel" lay-search>
                                        <option value="">排序方式</option>
                                        <option value="p.id desc">创建时间倒序</option>
                                        <option value="p.id asc">创建时间正序</option>
                                        <option value="p.actual_arrival_time desc">到货时间倒序</option>
                                        <option value="p.actual_arrival_time asc">到货时间正序</option>
                                        <option value="缺货数量倒序">缺货数量倒序</option>
                                        <option value="缺货数量正序">缺货数量正序</option>
                                        <option value="在途库存正序">在途库存正序</option>
                                        <option value="在途库存倒序">在途库存倒序</option>
                                    </select>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">缺货数量</label>
                                <div class="layui-input-block">
                                    <input type="text" name="lackNum" autocomplete="off" id="outofstock_lackNum_text" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">库存</label>
                                <div class="layui-input-block">
                                    <input type="text" name="yiwuOnWayStock" autocomplete="off" id="outofstock_yiwuOnWayStock_text" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" id="outof_stock_search_submit">搜索</button>
                                <button type="reset" id="outofstock_reset_btn" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                <div id="outofstock_save" class="inline_block pora"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="outofstockCard">
                <div class="layui-card-header dis_flex" >
                    <div class="layui-tab" lay-filter="wish_online_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" is_sale="1" title="">数量(<span id="outof_stock_num_span"></span>)</li>
                        </ul>
                    </div>
                    <div class="layui-tab">
                        <button class="layui-btn layui-btn-sm layui-btn-normal" id="outofstock_importSmtOufofOrderData_btn" type="button">导出smt缺货订单</button>
                        <div style="display: inline-block;">
                            <form class="layui-form">
                                <select id="outof_stock_bacth_deal_sel"  lay-filter="outof_stock_bacth_deal_sel" lay-search>
                                    <option value="">批量处理</option>
                                    <option value="1">采购处理</option>
                                    <option value="2">标记到货</option>
                                    <option value="3">找供应商</option>
                                    <option value="4">wish上下架</option>
                                    <option value="5">ebay标零补货</option>
                                    <option value="6">smt标零补货</option>
                                    <option value="7">shopee标零补货</option>
                                    <option value="8">joom上下架</option>
                                </select>
                            </form>
                        </div>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" id="outofstock_importData_btn" type="button">导出</button>
                        <permTag:perm funcCode="outof_stock_import">
                            <button class="layui-btn layui-btn-sm layui-btn-normal" id="outofstock_inputShortageSku_btn" type="button">录入缺货sku</button>
                        </permTag:perm>
                    </div>
                </div>
                <div class="layui-card-body">
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <table class="layui-table" id="outof_stock_data_table" lay-filter="outof_stock_data_table" style="margin: 0px;"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="outof_stock_mainImage_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">  
        <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
            {{#  if(typeof(d.mainImage) !="undefined"){ }}
            <img width="60" height="60" data-original="${tplIVP}{{d.mainImage }}" class="img_show_hide lazy" data-onerror="layui.admin.img_noFind()"/>
            {{#  } else { }}
            <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy" data-onerror="layui.admin.img_noFind()" />
            {{# } }}
            <div><span class="layui-btn layui-btn-xs searchSupply" data-image="${tplIVP}{{ d.mainImage }}">查找货源</span></div>
        </div>
    </div>
</script>
<script type="text/html" id="outof_stock_prodSSku_tpl">
    <div class="secondary">「{{d.storeName}}」</div>

    <div class="gray-c">
        {{d.prodSSku}}
    </div>
    <div>
        {{#  if( d.isSale == 0  ){ }}
        <span class="hp-badge layui-bg-red layTitle" lay-title="停售">停</span>
        {{#  } }}
        {{#  if(d.sourceType == 2 ){ }}
        <span class="hp-badge layui-bg-blue layTitle" lay-title="人工录入">录</span>
        {{#  } }}
    </div>
</script>
<script type="text/html" id="outof_stock_buyer_tpl">
    <div style="text-align: left;">
        采购：{{d.buyer || ''}}<br>
        整合：{{d.integrator || '' }}<br>
        开发：{{d.developer || '' }}
    </div>
</script>
<script type="text/html" id="outof_stock_prodTitle_tpl">
    <div style="text-align: left;">
        {{d.prodTitle || ''}}<br>
        开发:{{ Format(d.devDate, "yyyy-MM-dd")}}
    </div>
</script>
<script type="text/html" id="outof_stock_sales_tpl">
    <div style="text-align: left;">
        5天：{{d.salesNum5 !== undefined ? d.salesNum5 : ''  }}<br>
        7天：{{d.salesNum7 !== undefined ? d.salesNum7 : ''  }}<br>
        15天：{{d.salesNum15 !== undefined ? d.salesNum15 : ''  }}<br>
        30天：{{d.salesNum30 !== undefined ? d.salesNum30 : ''  }}
    </div>
</script>
<script type="text/html" id="outof_stock_days_tpl">
    <div style="text-align: left;">
        采购到货天数：{{d.purchaseDlvrDays !== undefined ? d.purchaseDlvrDays : ''  }}<br>
        库存预警周期：{{d.stockWarnCycle !== undefined ? d.stockWarnCycle : ''  }}<br>
    </div>
</script>
<script type="text/html" id="outof_stock_outofTime_tpl">
    <div style="text-align: left">创建：{{Format(d.createTime, "yyyy-MM-dd")}}</div>
    {{#if(d.expectedArrivalDay != null && d.expectedArrivalDay<=3 && d.isArrival==0 && d.intervalArrivalDay >0 ){ }}
    <div style="text-align: left;background: #d6ad1a">
     {{# }else if(d.intervalArrivalDay<=0 && d.isArrival==0){ }}
        <div style="text-align: left;background: #F74C31">
        {{# }else{ }}
            <div style="text-align: left;">
       {{#  } }}
       缺货：{{Format(d.outofTime, "yyyy-MM-dd")}}<br>
       预计：{{Format(d.expectedArrivalTime, "yyyy-MM-dd")}}
        {{#if(d.expectedArrivalDay != null){ }}
            <span class="hp-badge layui-bg-blue fr layTitle" lay-title="预计到货天数">{{d.expectedArrivalDay}}</span>
        {{#  } }}
        <br>
       实际：{{Format(d.actualArrivalTime, "yyyy-MM-dd")}}
        {{#if(d.actualArrivalDay != null){ }}
        <span class="hp-badge layui-bg-blue fr layTitle" lay-title="实际到货天数">{{d.actualArrivalDay }}</span>
        {{#  } }}
    </div>
</script>
<script type="text/html" id="outof_stock_number_tpl">
    <div style="text-align: left;font-size: 12px;line-height: 18px;">
        wish：{{d.wishOrderNum || '0' }}/{{d.wishBuyNum || '0' }}  <br/>
        ebay：{{d.ebayOrderNum || '0' }}/{{d.ebayBuyNum || '0' }}  <br/>
        smt：{{d.smtOrderNum || '0' }}/{{d.smtBuyNum || '0' }}  <br/>
        shopee：{{d.shopeeOrderNum || '0' }}/{{d.shopeeBuyNum || '0' }}  <br/>
        其它：{{d.otherOrderNum || '0' }}/{{d.otherBuyNum || '0'}}
    </div>
</script>
<script type="text/html" id="outof_stock_buyerRemark_tpl">
    <div style="font-size: 12px;line-height: 18px;">
        {{d.buyerRemark || ''}}
    </div>
</script>
<script type="text/html" id="outof_stock_findSupplyType_tpl">
    {{# if(d.findSupplyType==1){ }}
        <span style="color: red">采购找不到</span>
    {{# } }}
    {{# if(d.findSupplyType==2){ }}
        <span style="color: red">整合找不到</span>
    {{# } }}
    {{# if(d.findSupplyType==3){ }}
         <span style="color: red">开发找不到</span>
    {{# } }}
    {{# if(d.findSupplyType==4){ }}
         <span style="color: green">找到</span>
    {{# } }}
</script>
<!--旧的供应商名称-->
<script type="text/html" id="outof_stock_oldSupplyName_tpl">
    <a class="newsupplyName" target="_blank" href="{{d.oldSupplyUrl}}">{{d.oldSupplyName || '' }}</a>
</script>
<!--新供应商名称-->
<script type="text/html" id="outof_stock_newSupplyName_tpl">
   <a class="newsupplyName" target="_blank" href="{{d.newSupplyUrl}}">{{d.newSupplyName || '' }}</a>
</script>
<script type="text/html" id="outof_stock_operate_tpl">
    {{# if(d.isArrival==0){ }}
        <a class="layui-btn  layui-btn-xs " lay-event="outof_stock_buyer_deal">采购处理</a><br/>
        {{# if( d.sourceType==2){ }}
        <a class="layui-btn  layui-btn-xs" lay-event="outof_stock_mark_arrival">标记到货</a><br/>
        {{# } }}
        <a class="layui-btn  layui-btn-xs" lay-event="outof_stock_find_supply">找供应商</a><br/>
    {{# } }}
    <a class="layui-btn  layui-btn-xs" lay-event="outof_stock_showlog">日志显示</a>
</script>
<!-- 录入缺货SKU弹框 -->
<script type='text/html' id="outofstock_inputShortageSkuLayer">
    <div class="p20">
        <form class="layui-form" id="outofstock_inputShortageSkuForm" lay-filter="outofstock_inputShortageSkuForm">
            <div class="layui-form-item">
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">仓库</label>
                    <div class="layui-input-block">
                        <select name="storeId" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">子SKU</label>
                    <div class="layui-input-block">
                        <textarea placeholder="请输入内容" class="layui-textarea" id="outof_stock_skus_textarea" name="prodSSkus" style="height:200px"></textarea>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 找供应商弹框 -->
<script type='text/html' id="outof_stock_findSuppliersLayer">
    <form  id="outof_stock_findSuppliers_form" class="layui-form" lay-filter="outof_stock_findSuppliers_form_filter">
        <div>
            <div class="layui-form-item">
                <label class="layui-form-label"  style="width: 120px;">找到供应商</label>
                <div class="layui-input-block">
                    <input type="radio" name="findType" value="1" title="找到" checked="" lay-filter="outof_stock_find_supply_radio">
                    <input type="radio" name="findType" value="2" title="找不到" lay-filter="outof_stock_find_supply_radio">
                </div>
            </div>
            <permTag:perm funcCode="outof_stock_findSuppliers_markNotSale_btn">
                <div class="layui-form-item">
                    <label class="layui-form-label"  style="width: 120px;">是否停售</label>
                    <div class="layui-input-block">
                        <a class="layui-btn layui-btn-normal layui-btn-sm" id="outof_stock_findSuppliers_markNotSale_btn">停售商品</a>
                    </div>
                </div>
            </permTag:perm>
            <div id="outof_stock_findSuppliers_div" style="padding-top: 10px;">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width: 120px;">新供应商名称1</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply1Name" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">链接1</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply1Url" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注1</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply1Remark" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width: 120px;">新供应商名称2</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply2Name" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">链接2</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply2Url" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注2</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply2Remark" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width: 120px;">新供应商名称3</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply3Name" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">链接3</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply3Url" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注3</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply3Remark" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item"><div class="layui-inline">
                <label class="layui-form-label" style="width: 120px;">新供应商名称4</label>
                <div class="layui-input-inline">
                    <input type="text" name="supply4Name" autocomplete="off" class="layui-input">
                </div>
            </div>
                <div class="layui-inline">
                    <label class="layui-form-label">链接4</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply4Url" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注4</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply4Remark" autocomplete="off" class="layui-input">
                    </div>
                </div> </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label" style="width: 120px;">新供应商名称5</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply5Name"  autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">链接5</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply5Url"  autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">备注5</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supply5Remark" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
            </div>
            </div>
            <button lay-submit lay-filter="outof_stock_supply_form"  id ="outof_stock_supply_submit_btn" style="display: none">提交</button>
        </div>
    </form>
</script>
<!-- 采购处理弹框 -->
<script type='text/html' id="outof_stock_purchasehandleLayer">
    <form action="outof_stock_purchasehandForm" class="layui-form" style="padding: 20px 20px 0 0">
        <div class="layui-form-item">
            <div class="layui-col-lg5 layui-col-md5">
                <label class="layui-form-label" >预计到货时间</label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" id="outof_stock_exceptedArrivalTime_input">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">采购备注</label>
            <div class="layui-input-block">
                <textarea placeholder="请输入备注" class="layui-textarea"  style="height:200px" id="outof_stock_buyerRemark_input"></textarea>
            </div>
        </div>
    </form>
</script>
<!-- 标记到货弹框 -->
<script type='text/html' id="outof_stock_actualhandleLayer">
    <form action="" class="layui-form" style="padding: 20px 20px 0 0">
        <div class="layui-form-item">
            <div class="layui-col-lg5 layui-col-md5">
                <label class="layui-form-label">实际到货时间</label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" id="outof_stock_actualArrivalTime_input">
                </div>
            </div>
        </div>
    </form>
</script>
<!-- 查看日志弹框 -->
<script type="text/html" id="outof_stock_showlog_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="outof_stock_showlog_table" lay-filter="outof_stock_showlog_table"></table>
        </div>
    </div>
</script>
<!-- 查看日志弹框 -->
<script type="text/html" id="outof_stock_showlog_timeTpl">
    {{Format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/outofstock.js"></script>