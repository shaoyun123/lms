<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>速卖通刊登管理</title>
<style>
    #LAY_aliexpress_publish td[class="colspan_td"]>table>tbody tr:first-child td {
        border-top: none;
    }
    
    #LAY_aliexpress_publish td[class="colspan_td"]>table>tbody tr:last-child td {
        border-bottom: none;
    }
    
    #LAY_aliexpress_publish td[class="colspan_td"]>table>tbody tr td {
        border-left: none;
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }

    #LAY_aliexpress_publish td[data-field="isTort"] .layui-form-checkbox[lay-skin=primary]{
      height: 15px !important;
      line-height: 15px !important;
    }

    #LAY_aliexpress_publish td[data-field="isTort"] .layui-form-checkbox[lay-skin=primary] i{
       width: 15px !important;
       height: 15px !important;
       line-height:15px !important;
    }
    
    th,
    td {
        text-align: center
    }
    
    .layui-row>div {
        margin-bottom: 10px;
    }
    
    .clearfix {
        *zoom: 1;
    }
    /*IE/6/7*/
    
    .clearfix:after {
        content: "\200B";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .small_apn{
        font-size: 12px;
        line-height: 12px;
    }
    .fr {
        float: right;
    }
    #aep_searchForm .layui-form-switch{
    	margin-top:4px!important;
    	margin-left: 10px;
	}
    .dis_flex{
        display: flex;
        justify-content: flex-start;
    }
    .tips{
        color:red;
        font-weight: 600;
        margin-left: 10px;
    }
    .aep-devNote {
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;

    }

    .aep-devNote:hover {
        -webkit-line-clamp: 1000;
    }

    #aep_smtListing_countryList{
        display: grid;
        grid-template-columns: repeat(8,12.5%);
    }
    .aep_cateDivContainer {
        overflow: hidden;
        max-height:70px;
        position: relative;
        width: fit-content;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }
    .aep_cateDivContainer .aep_cateDiv_showDetail {
        position: absolute;
        right:0;
        bottom: 0;
    }

    #aep_searchForm .labelSel{
        padding: 0 0 0 15px;
        width: 95px;
    }

</style>
<div class="layui-fluid" id="LAY_aliexpress_publish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="aep_searchForm" action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="aep_orgFilter" class="orgs_hp_custom" id="smt_publish_organization" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="smt专员" lay-filter="aep_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="aliexpress" lay-filter="aep_storeFilter" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerId" lay-search>
                                    <option value="">开发专员角色</option>
                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="cnTitle">中文标题</option>
                                        <option value="enTitle">英文标题</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-md10 layui-col-lg10">
                                        <input name="searchValue" class="layui-input" autocomplete="off" placeholder="父子sku支持多个查询,以','隔开">
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <input type="checkbox" name="isExactQuery" lay-skin="switch" lay-text="精确|模糊">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType" lay-search>
                                    <option value="">选择开发类型</option>
                                    <option value="1">wish开发</option>
                                    <option value="2">供应商新品</option>
                                    <option value="3">ebay开发</option>
                                    <option value="4">smt开发</option>
                                    <option value="5">阿里销售产品</option>
                                    <option value="6">采集爆款开发</option>
                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="isSales" xm-select="aep_isSales">
                                        <option value="">全部</option>
                                        <option value="2" >全部在售</option>
                                        <option value="1" >部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="isSmtTort">
                                        <option value="">全部</option>
                                        <option value="true">SMT侵权</option>
                                        <option selected value="false">SMT不侵权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售状态</label>
                                <div class="layui-input-block">
                                    <select name="isProhibit">
                                        <option value="">全部</option>
                                        <option value="true">禁售</option>
                                        <option selected value="false">非禁售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType">
                                        <option value="selfPortraitTime">自拍图时间</option>
                                        <option value="auditTime" selected>审核时间</option>
                                        <option value="smtPublishAbleTime">可刊登时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-md10 layui-col-lg10">
                                        <input type="text" name="searchTime" placeholder="选择时间" autocomplete="off" class="layui-input" id="aep_searchTime">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">图片状态</label>
                                <div class="layui-input-block">
                                    <select name="imgStatus"  xm-select="aep_imgStatusList">
                                        <option value="">全部</option>
                                        <option value="1" >有图</option>
                                        <option value="2" >部分</option>
                                        <option value="3">无图</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">自拍图</label>
                                <div class="layui-input-block">
                                    <select name="selfImgStatusList"  xm-select="aep_selfImgStatusList">
                                        <option value="1" >有图</option>
                                        <option value="2" >部分</option>
                                        <option value="0">无图</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登状态</label>
                                <div class="layui-input-block">
                                    <select name="isListing" lay-search>
                                        <option value="">全部</option>
                                        <option value="true">已刊登</option>
                                        <option value="false">未刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登覆盖</label>
                                <div class="layui-input-block">
                                    <select name="isUpStandard" lay-search>
                                    <option value="">全部</option>
                                    <option value="true">达标</option>
                                    <option value="false">不达标</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select  name="logisticsType">
                                        <option value="1">物流属性与</option>
                                        <option value="2">物流属性或</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select id="aep_logisticsSelect" xm-select="aep_logisticsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="prodAttrList" lay-search>
                                    </select>
                                </div>
                            </div>
                            <%-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类目</label>
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-primary layui-btn-sm" id="aep_selectCateBtn">
                                    选择类目</span>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('aep_cateDiv','aep_cateId')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="aep_cateId" name="cateIds">
                                    <input type="hidden" id="aep_cateId" name="cateId">
                                </div>
                            </div> --%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="minWeight" placeholder="g" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="maxWeight" placeholder="g" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类目</label>
                                <div class="layui-input-block">
                                    <input id="aep_productCates" />
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" title="10%毛利率刊登预估价">定价</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="minSalePrice" placeholder="$" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="maxSalePrice" placeholder="$" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否美工评分</label>
                                <div class="layui-input-block">
                                    <select name="isAdScore">
                                        <option value="">全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否含大货</label>
                                <div class="layui-input-block">
                                    <select name="smtBigProduct">
                                        <option value="">请选择</option>
                                        <option value="true">包含</option>
                                        <option value="false">不包含</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="order" lay-search>
                                    <option value="ppi.audit_time desc">审核时间倒序</option>
                                    <option value="ppi.audit_time asc">审核时间正序</option>
                                    <option value="self_img_time desc">自拍图时间倒序</option>
                                    <option value="self_img_time asc">自拍图时间正序</option>
                                    <option value="sale_num desc">公司销量倒序</option>
                                    <option value="sale_num asc">公司销量正序</option>
                                    <option value="sale_num_aliexpress desc">SMT销量倒序</option>
                                    <option value="sale_num_aliexpress asc">SMT销量正序</option>
<%--                                    <option value="store_sale_num desc">店铺销量倒序</option>--%>
<%--                                    <option value="store_sale_num asc">店铺销量正序</option>--%>
                                    <option value="comp_sales_num desc">竞品销量倒序</option>
                                    <option value="comp_sales_num asc">竞品销量正序</option>
                                    <option value="aeFullManagedThirtySalesNum desc">AE全托管30天销量倒序</option>
                                    <option value="aeFullManagedThirtySalesNum asc">AE全托管30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="salesType">
                                        <option value="1">SMT销量</option>
                                        <option value="2">公司销量</option>
                                        <option value="3">AE全托管销量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block disflex">
                                    <input type="number" class="layui-input" name="salesMin" onkeypress="commonKeyPressInputNotNega(event)">
                                    <input type="number" class="layui-input" name="salesMax" onkeypress="commonKeyPressInputNotNega(event)">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">可用视频</label>
                                <div class="layui-input-block">
                                    <select name="isAvailableVideo" lay-search >
                                        <option value="">请选择</option>
                                        <option value="1">有</option>
                                        <option value="0">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel" style="display:flex;width:160px;">
                                    <select name="preAvailableStockType">
                                        <option value="1">预计可用库存含在途</option>
                                        <option value="2">预计可用库存不含在途</option>
                                    </select>
                                    <select name="preAvailableAllSku">
                                        <option value="false">部分属性</option>
                                        <option value="true">全部属性</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left: 180px;">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input name="preAvailableStockMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input name="preAvailableStockMax" autocomplete="off" class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-input-block clearfix">
                                    <button id="aep_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="smt_button_reset">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <%-- <div class="aep_cateDivContainer">
                        <div id="aep_cateDiv"></div>
                    </div> --%>
                    <%-- <span class="aep_cateDiv_showDetail">
                        <b style="cursor:pointer;color:#428bca;">查看更多</b>
                    </span> --%>
                </div>
            </div>
            <div class="layui-card" id="aliexpressPublishCard">
                <div class="layui-card-header dis_flex" style="justify-content: space-between;">
                  <div>
                      <span class="numCount">数量(<span id="aep_num"></span>)</span>
                      <span class="smtstatictips tips"></span>
                  </div>
                  <span><button id="aep_exportBtn" class="layui-btn layui-btn-danger layui-btn-sm" type="button">导出刊登统计</button></span>
                </div>
                <div class="layui-tab-content checkbox-group" style="padding:10px;">
                        <div class="layui-form">
                            <form id="aep_searchTagForm">
                                <input type="checkbox" value="" lay-skin="primary" title="全部" lay-filter="">
                            </form>
                        </div>
                </div>
                <div class="layui-card-body">
                    <div>
                        <table class="layui-table" id="aep_table" lay-filter="aep_table"></table>
                    </div>
                    <div id="aep_pagination" class="customPagination"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--模板-->
<script type="text/html" id="aep_storeNumTpl">
    <span  style="color:#999;">刊登数:</span>
    <a href="javascrpt:;" style="color:blue" onclick="producttpl_getListingStatus('{{d.id}}','aliexpress')">{{ d.storeNum}}</a>
    <i title="打开速卖通商品" class="layui-icon" style="color: #009688;cursor: pointer;" lay-event="aep_openItem">&#xe615;</i>
    <br>
    <span  style="color:#999;">店铺:</span>
    {{#  if(d.listingStatus ==1){ }}
    <span style="color: green;">已刊登</span>
    {{#  } else if(d.listingStatus == 2 ) { }}
    <span style="color: lightseagreen;">部分刊登</span>
    {{#  }else{ }}
    <span style="color: red;">未刊登</span>
    {{#  } }}
    <br>
    <span  style="color:#999;">覆盖:</span>
    {{#  if(d.isUpstandard){ }}
    <span style="color: green;">已达标</span>
    {{#  }else{ }}
    <span style="color: red;">未达标</span>
    {{#  } }}
    <br>
    <span  style="color:#999;">时效:</span>
    {{#  if(typeof(d.listingTimeUpstandard)=='undefined'){ }}
    <span style="color: #999;">无数据</span>
    {{#  } else if(d.listingTimeUpstandard) { }}
    <span style="color: green;">准时</span>
    {{#  }else{ }}
    <span style="color: red;">超时</span>
    {{#  } }}
</script>
<!--模板-->
<script type="text/html" id="aep_salesNumTpl">
    <span  style="color:#999;">店铺:</span> {{ d.storeSalesNum}}<br>
    <span  style="color:#999;">SMT:</span> {{ d.smtSalesNum}}<br>
    <span  style="color:#999;">公司:</span> {{ d.totalSalesNum}}<br>
    <span  style="color:#999;">竞品:</span> <a href="javascrpt:;" style="color:blue" onclick="compUrl_producttpl('{{d.pSku}}','{{d.id}}',function(){openSmtComp({{d.id}})})">{{ d.compSalesNum}}</a><br>
    <span style="color:#999;">AE全托管:</span> {{ d.aeFullManagedThirtySalesNum||0}}<br>
</script>
<script type="text/html" id="aep_tortTpl">
	<div style="text-align:left; line-height:13px" class="layui-form">
        {{#  if(d.isListingAble == false){ }}
        <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" checked lay-filter="aep_prohibit" value="{{d.id}}">
        {{#  }else{ }}
        <input type="checkbox" name="isProhibit" lay-skin="primary" title="禁售" lay-filter="aep_prohibit" value="{{d.id}}">
        {{#  } }}
        <br><br>
        {{#  if(d.isWishTort){ }}
        <input type="checkbox" checked disabled title="wish" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="wish" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.wishTortReason ? d.wishTortReason : ''}}</span><br>
        
        {{#  if(d.isJoomTort){ }}
        <input type="checkbox" checked disabled title="joom" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="joom" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.joomTortReason ? d.joomTortReason : ''}}</span><br>
        
        {{#  if(d.isEbayTort){ }}
        <input type="checkbox" checked disabled title="ebay" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="ebay" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span><br>
        
        {{#  if(d.isAmazonTort){ }}
        <input type="checkbox" checked disabled title="amazon" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="amazon" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span><br>
        
        {{#  if(d.isSmtTort){ }}
        <input type="checkbox" checked disabled title="smt" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="smt" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.smtTortReason ? d.smtTortReason : ''}}</span><br>
        
        {{#  if(d.isShopeeTort){ }}
        <input type="checkbox" checked disabled title="shopee" lay-skin="primary">
        {{#  }else{ }}
          <input type="checkbox" disabled  title="shopee" lay-skin="primary">
        {{#  } }}
        <span class="w_50 inline_table hv20 small_apn">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span><br>
        
    </div>
</script>
<script type="text/html" id="aep_isProhibitTpl">
	//FIXME
</script>
<script type="text/html" id="aep_timeTpl">
    <span  style="color:#999;float: left;">&nbsp;&nbsp;审&nbsp;&nbsp;&nbsp;核:</span> {{ Format(d.auditTime, "yyyy-MM-dd")}}<br>
    <span  style="color:#999;float: left;">&nbsp;&nbsp;自拍图:</span> {{ Format(d.selfPortraitTime, "yyyy-MM-dd")}}<br>
    <span  style="color:#999;float: left;">最后上架:</span>   {{#  if(d.gmtCreate){ }} {{ Format(d.gmtCreate, "yyyy-MM-dd")}}<br>  {{# } }}

</script>
<script type="text/html" id="aep_operationTpl">
    <div><a class="layui-btn  layui-btn-xs" id="prodDetail_smtListing" data-id="{{d.id}}" prodpsku="{{d.pSku}}" data-storeacctid="{{d.storeAcctId}}">商品详情</a></div>
    <div><a class="layui-btn  layui-btn-xs" onclick="product_optimize_add_btn_fun('{{d.pSku}}','{{d.id}}')" title="">产品优化</a></div>
    <div><a class="layui-btn  layui-btn-xs" onclick="compUrl_producttpl('{{d.pSku}}','{{d.id}}')">竞品链接</a></div>
    <div><a class="layui-btn  layui-btn-xs" lay-event="aep_saleNote" title="">销售备注</a></div>
    <div><a class="layui-btn  layui-btn-xs" lay-event="aep_editTag" title="">维护标签</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-xs devIdeaWayBtn" dataid="{{d.id}}">开发思路</a></div>
    <div><a class="layui-btn layui-btn-xs aep-adScore"  data-adScore="{{d.adScore || ''}}" onclick="evaluate_selfImg('{{d.pSku}}', 2)">美工评分</a></div>

</script>
<script type="text/html" id="aep_cnTitleTpl">
    
    {{#  if(d.devType=='1'){ }}
        <span style="color: grey">[wish开发]</span><br>
    {{#  } else if(d.devType=='2') { }}
        <span style="color: grey">[供应商新品]</span><br>
    {{#  } else if(d.devType=='3') { }}
        <span style="color: grey">[ebay开发]</span><br>
    {{#  } else if(d.devType=='4') { }}
        <span style="color: grey">[smt开发]</span><br>
    {{#  } else if(d.devType=='5') { }}
        <span style="color: grey">[阿里销售产品]</span><br>
    {{#  } else if(d.devType=='6') { }}
        <span style="color: grey">[采集爆款开发]</span><br>
    {{#  }else{ }}
    {{#  } }}
    
    <span>{{d.cnTitle}}
    	{{#  if(d.isSupplierOrigiImg){ }}
	    <span class="layui-bg-blue hp-badge ml5" title="供应商原图">供</span>
	    {{#  } }}
	    {{#  if(d.selfImgStatus == 1){ }}
	    <span class="layui-bg-red hp-badge ml5" title="有自拍图">自</span>
	    {{#  } }}
        {{#  if(d.mackRefineStatus == true){ }}
            {{#  if(d.selfImgStatus== 1 || d.selfImgStatus == 2){   }}
                <span class="layui-bg-green hp-badge ml5" title="精修商品">精</span>
            {{#  } }}
	    {{#  } }}
    </span>
    <span class="fr">
    	{{#  if(d.prodAliexpressTags){ }}
		    {{#  if(d.prodAliexpressTags.indexOf('价格有优势') >-1 ){ }}
		        <span class="hp-badge"  title="价格有优势">
		        	<i class="layui-icon" style="font-size: 20px; color: green;">&#xe6af;</i>  
		        </span>
		    {{#  } }}
		    {{#  if(d.prodAliexpressTags.indexOf('价格无优势') >-1){ }}
		        <span class="hp-badge"  title="价格无优势">
		        	<i class="layui-icon" style="font-size: 20px; color: red;">&#xe69c;</i>  
		        </span>
		    {{#  } }}
		    {{#  if(d.prodAliexpressTags.indexOf('暂无同款') >-1){ }}
		    <span class="hp-badge layui-bg-blue" title="暂无同款">无</span>
		    {{#  } }}
	    {{#  } }}
    </span>
    <br>
    <span>
        <span style="color:#999;">开发:</span>{{d.bizzOwner || ""}}
        <br>
        <span style="color:#999;">销售:</span>{{d.salePersons || ""}}
    </span>
    <br>
    <span>
        <span style="color:#999;">美工评分:</span>
        {{#  if(d.adScore >= 5){ }}
            <span style="color:green;">满意</span>
        {{#  } else if(d.adScore >= 1) { }}
            <span style="color:orange;">需要改善</span>
        {{#  }else{ }}
            <span>未评</span>
        {{#  } }}
    </span>
</script>
<!-- <script type="text/html" id="aep_smtListingPriceTpl">
    <div style="padding:20px 20px 0 20px">
        <div class="layui-tab-item layui-show">
            <form id="aep_smtListingPrice" class="layui-form"  autocomplete="false" >
            	<input type="hidden" name="prodPId" value="1">
                <div class="layui-row">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">成本(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="cost" value="" placeholder="商品成本">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">商品毛重(g)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="weight" value="" placeholder="商品重量">
                        </div>
                    </div>
                </div>
                <div class="layui-row">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">毛利率(%)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="grossProfitRate" value="" placeholder="如20%,请直接填写20">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">优惠幅度(%)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="discountRate" value="30">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">定价方式</label>
                        <div class="layui-input-block">
                            <select name="shippingType" lay-filter="aep_smtShippingType">
                                <option value="">子SKU默认定价</option>
                                <option value="USD5_LESS_GENERAL"><5USD 普货</option>
                                <option value="SPECIAL">特货</option>
                                <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                                <option value="GENERAL_OLD">普货（旧版）</option>
                                <option value="USD5_USD8_GENERAL">5-8美金普货</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="layui-col-md2 layui-col-lg2 ">
                        <label class="layui-form-label"></label>
                        <div class="layui-input-block">
                            <button type="submit" lay-submit lay-filter="aep_smtListingPrice" class="layui-btn layui-btn-sm" >更新</button>
                        </div>
                    </div>
                </div>
            </form>
            <div class="layui-card">
                <div class="layui-card-header disflex" style="background-color: #D7D7D7"
                    id="aep_smtListing_country_header" data-show="true">
                    <div>区域定价</div>
                    <div class="h100 aep-smtListing-tohideIcon"><i class="layui-icon">&#xe61a;</i></div>
                    <div class="h100 hidden aep-smtListing-toShowIcon"><i class="layui-icon">&#xe619;</i>
                    </div>
                </div>
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="aep_smtListing_countryList">
                    </form>
                </div>
            </div>
            <form action="" class="layui-form dis_flex">
                <select name="adjustType" id="aep_smtListing_adjustType">
                    <option value="ECONOMYECONOMY">常见1:俄西经济</option>
                    <option value="ECONOMYSIMPLE">常见2:俄经济西简易</option>
                    <option value="SIMPLESIMPLE">常见3:俄西简易</option>
                    <option value="STANDARDSIMPLE">常见4:俄标准西简易</option>
                    <option value="STANDARDSTANDARD">常见5:全标准</option>
                </select>
                <button type="button" class="layui-btn layui-btn-sm"
                    id="aep_smtListing_batchEstimateRegionPrice">估算区域定价和刊登价</button>
            </form>
            <div>
                <table class="layui-table" id="aep_smtListingPriceTable">
                    <thead>
                    <tr>
                        <th>模板子SKU</th>
                        <th style="min-width:50px">成本</th>
                        <th style="min-width:50px">商品毛重(g)</th>
                        <th>商品抛重(g)</th>
                        <th>定价</th>
                        <th>刊登价</th>
                        <th>预估利润(&yen;)</th>
                        <th data-order="9999">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
            
        </div>
    </div>
</script> -->

<script id="aep_editTagTpl" type="text/html">
	<div style="padding: 20px;">
		<form id="aep_editTagForm" class="layui-form">
	        <input type="checkbox" name="prodAliexpressTag" value="价格有优势" lay-skin="primary" title="价格有优势">
	    </form>
	</div>
</script>

<%--子模板templet--%>
<script type="text/html" id="aep_producttpl">
    <table id="aep_intable_tpl" style="text-align:center;width: 100%">
        <tbody>
            {{# for(var i =0; i < d.prodTempVarietyDtos.length; ++i) { var $value = d.prodTempVarietyDtos[i] }}
                {{# if (i<7) { }}
                <tr>
                    {{# } else {}}
                <tr  class="myj-hide">
                    {{# } }}
                    <td width='40%' style="text-align: left;padding-left: 10px;">{{ $value.sSku }}
                    {{# if($value.smtBigProduct){  }}
                        <span class="layui-bg-orange hp-badge ml5" title="大货">大</span>
                    {{# }  }}
                    </td>
                    <td width='10%'>{{ $value.weight }}</td>
                    <td width='10%'><span class="canClickEl" onclick="tpl_listReferPrice({{ $value.id}})">{{ $value.cost }}</span></td>
                    <td width='30%'>
                        {{ $value.preAvailableStockAll || 0 }}/{{ $value.preAvailableStock || 0}}
    <%--                        {{ (($value.stockNum || 0) - ($value.reservationNum || 0))  + '/' + ($value.orderNotInNum || 0) + '/' + ($value.lackUnPaiNum || 0) }}--%>
                    </td>
                    <td width='10%'>
                        {{# if ($value.isSale){}}
                        <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled" lay-skin="primary">
                            <i class="layui-icon layui-icon-ok"></i>
                        </div>
                        {{# } else{ }}
                        <div class="layui-unselect layui-form-checkbox layui-checkbox-disbaled layui-disabled"
                             lay-skin="primary">
                            <i class="layui-icon layui-icon-ok"></i>
                        </div>
                        {{# } }}
                    </td>
                </tr>
                {{# } }}
            </tbody>
        </table>
        {{#  if(d.prodTempVarietyDtos.length > 7) { }}
        <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{d.prodTempVarietyDtos.length}})</a>
        {{# } }}
</script>

<script type="text/html" id="cateLayer_smtPublish">
    <div class="layui-form">
        <%-- <div style="margin: 10px">
            <span style="width: 60%;float: left;margin-right: 20px">
                <input class="layui-input" id="cateSearchInp_smtPublish" placeholder="类目搜索">
            </span>
            <span class="layui-btn layui-btn-sm" id="searchCateBtn_smtPublish">搜索</span>
        </div> --%>
        <div id="cateXTree_smtPublish"></div>
    </div>
</script>


<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/publish.js"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productoptimize.jsp"%>