<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>fyndiq刊登(新)</title>
<style>
    #fyndiqNewPublish_extImg {
        overflow: hidden
    }

    #fyndiqNewPublish_extImg li {
        float: left;
        margin-right: 10px
    }

    #fyndiqNewPublish_searchForm .layui-form-item {
        margin-bottom: 0
    }

    td[class="colspan_td"] > table > tbody tr:first-child td {
        border-top: none;
    }

    td[class="colspan_td"] > table > tbody tr:last-child td {
        border-bottom: none;
    }

    td[class="colspan_td"] > table > tbody tr td {
        border-left: none;
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }
    #fyndiqNewPublish_table th,
    #fyndiqNewPublish_table td {
        text-align: center;
        padding: 5px 0;
        white-space: normal;
        overflow: visible;
        word-wrap: break-word;
   }
    .fyndiqNewPublish_table_head table,
    .fyndiqNewPublish_table_body table {
        width: 100%;
        margin: 0;
        table-layout: fixed;
    }

    .fyndiq_price {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .fyndiq_price span {
        flex: 0 1 45%;
    }
</style>
<div class="layui-fluid" id="fyndiq_newpublish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="fyndiqNewPublish_searchForm">
                        <div class="layui-form-item layui-row">
                            <input name="listingStatus" value="-2" type="hidden">
                            <input name="shippingStatus" value="" type="hidden">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="newFyndiqPublishBtn">
                                        选择类目
                                    </span>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('newFyndiqPublishDiv','newFyndiqPublishHidden')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" name="cateId" id="newFyndiqPublishHidden">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="fyndiqNewPublish_group_sel" name="orgId"
                                            lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="fyndiqNewPublish_salesman_sel" name="sellerId"
                                            lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                                            data-roleList="fyndiq专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" data-platcode="fyndiq" lay-filter="fyndiqNewPublish_storeAcctId" lay-search class="store_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType" id="newpublish_devType" lay-search>
                                        
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag" id="newpublish_prodTagMap" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select 
                                        xm-select="selectAttr_newFyndiq" 
                                        xm-select-search 
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal" 
                                        lay-filter='selectAttr_newFyndiq'
                                        id="newpublish_logisAttrEnum"
                                    >
                                    
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品归属人</label>
                                <div class="layui-input-block">
                                    <select 
                                        xm-select="selectMan_newFyndiq" 
                                        name="bizzOwnerIds" 
                                        xm-select-search
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                        id="newpublish_bizzOwnerIds"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="saleStatusList"  xm-select="fyndiq_is_sale_status_sel" lay-filter="fyndiq_is_sale_status_sel">
                                        <option value="2" selected>在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登情况</label>
                                <div class="layui-input-block">
                                    <select name="isPublish">
                                        <option value="">全部</option>
                                        <option value="false" selected>未刊登</option>
                                        <option value="true">已刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="CREATE_TIME">创建时间</option>
                                        <option value="AUDIT_TIME">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="fyndiqNewPublishTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 sortTypeCon">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="sortType">
                                        <option value="">全部</option>
                                        <option value="1" selected>全平台30天销量倒序</option>
                                        <option value="2">全平台7天销量倒序</option>
                                        <option value="3">SMT30天销量倒序</option>
                                        <option value="4">SMT7天销量倒序</option>
                                        <option value="5">审核时间倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="fyndiqNewPublish_showHideVagueFlag">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">子SKU</option>
                                        <%-- <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option> --%>
                                    </select>
                                </div>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                    <input name="searchText" type="text" class="layui-input" placeholder="">
                                    </div>
                                    <div id="newFyndiq_skuVagueFlag_div" class="layui-col-md3 layui-col-lg3">
                                        <select name="skuVagueFlag">
                                            <option value="false">精确</option>
                                            <option value="true">模糊</option>
                                        </select>
                                    </div>
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
                            <div class="layui-col-lg4 layui-col-md4">
                                <div style="margin-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            onclick="fyndiqNewPublish_searchProd()" id="fyndiqNewPublish_search">搜索
                                    </button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset"
                                            id="fyndiqNewPublish_reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="newFyndiqPublishDiv"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="fyndiqNewPublishCard">
                <div class="layui-card-body">
                        <div id="newFyndiq_btn_show_hide" style="position: absolute; right: 10px; z-index: 99">
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                        id="fyndiqNewPublish_btn_genListing"
                                        onclick="fyndiqNewPublish_genToListingProd()">生成店铺商品
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                                        id="fyndiqNewPublish_btn_delListing"
                                        onclick="fyndiqNewPublish_deletelisting()">删除店铺商品
                                </button>
                                <div class="layui-input-inline w100 layui-form disN" id="fyndiqNewPublish_div_selPubStyle">
                                    <select id="fyndiqNewPublish_selPubStyle" lay-filter="fyndiqNewPublish_selPubStyle_filter">
                                        <option value="" disabled selected>刊登</option>
                                        <option value="1">立即刊登</option>
                                        <option value="2">定时刊登</option>
                                    </select>
                                </div>
                                <button id="fyndiqNewPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                                        type="button" onclick="fyndiqNewPublish__canclePublishOnTiming()">取消定时刊登
                                </button>
        
                                <button id="fyndiqNewPublish_btn_pubNow" class="layui-btn layui-btn-sm disN" type="button"
                                        onclick="newFyndiqListingPublish('',false)">发布上架
                                </button>
                                <button id="fyndiqNewPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="fyndiqNewPublish_OnTiming()">定时刊登
                                </button>
                                <button id="fyndiqNewPublish_btn_setShipping" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="fyndiqNewPublish__setShipping()">设置运费
                                </button>
                                <button id="fyndiqNewPublish_btn_rePubNow" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="newFyndiqListingPublish('',false)">重新发布
                                </button>
                        </div>
                    <div class="layui-tab" lay-filter="fyndiqNewPublish_tab">
                        <ul class="layui-tab-title">
                            <li data-value="-2" class="layui-this" id="newFyndiq_totalNum">商品</li>
                            <li data-value="0" id="newFyndiq_toListingNum">待刊登</li>
                            <li data-value="3" id="newFyndiq_listingNum">刊登中</li>
                            <li data-value="1" id="newFyndiq_listingSucNum">刊登成功</li>
                            <li data-value="2" id="newFyndiq_listingFailNum">刊登失败</li>
                        </ul>
                        <div class="layui-tab-content">
                            <div id="fyndiqNewPublish_table">

                            </div>
                            <div id="fyndiqNewPublish_pagination" class="customPagination"></div>
                            <!--模板文件-->
                            <script type="text/html" id="fyndiqNewPublish_tpl">
                                <div class="fyndiqNewPublish_table_head">
                                    <table class="layui-table">
                                        <colgroup>
                                            <col width="12px"/>
                                            <col width="40px" />
                                            <col width="16%" />
                                            <col width="7%" />
                                            <col width="7%" />
                                            <%--<col width="5%"/>--%>
                                            <col width="10px"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                        </colgroup> 
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div class="layui-form" lay-filter="pid-all-cbox">
                                                        <input type="checkbox" class="pid-all-cbox" lay-skin="primary" name="pid-all-cbox">
                                                    </div>
                                                </th>
                                                <th>缩略图</th>
                                                <th>标题</th>
                                                <th>父SKU</th>
                                                <th class="saleNum">销量7/30</th>
                                                <%--<th class="storeSkuInfo">店铺父SKU</th>--%>
                                                <th class="shippingInfo">运费设置状态</th>
                                                <th class="shippingInfo">设置失败原因</th>
                                                <th style="width: 30px"></th>
                                                <th>模板子SKU</th>
                                                <th class="storeSubSkuInfo">店铺子SKU</th>
                                                <th>颜色</th>
                                                <th>尺寸</th>
                                                <th class="listingInfo">售价(sek)</th>
                                                <th class="listingInfo">售价(eur)</th>
                                                <th>在售</th>
                                                <th class="prodStock">可用/在途/未派</th>
                                                <th class="listingStock">在线数量</th>
                                                <th class="timeClass">时间</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div class="fyndiqNewPublish_table_body" style="margin-top: -6px">
                                    <table class="layui-table">
                                        <colgroup>
                                            <col width="12px"/>
                                            <col width="40px" />
                                            <col width="16%" />
                                            <col width="7%" />
                                            <col width="7%" />
                                            <%--<col width="5%"/>--%>
                                            <col width="10px"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                        </colgroup> 
                                        <tbody>
                                        {{ each data v i}}
                                        <tr class="skus-tr">
                                            <td>
                                                <div class="layui-form" lay-filter="pid-cbox">
                                                    <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.id }}
                                                        name="id">
                                                </div>
                                            </td>
                                            <td>
                                                <img width="60" height="60" data-original="{{ v.mainImage }}"
                                                    class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
                                            </td>
                                            <td>
                                                {{ v.title }}<br/>
                                                <span class="layui-gray listingSuccInfo">
                                                    <a target="_blank" style="color:blue"
                                                        href="https://www.shopify.com/c/{{ v.storeProdPId }}">{{ v.storeProdPId }}</a>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue">商品：{{
                                                    v.pSku }}</a>
                                                <br>
                                                <span class="layui-bg-orange">刊登站点:</span>
                                                <span class="layui-bg-red">{{ v.markets }}</span>
                                            <div class="storeSkuInfo">
                                                店铺：{{ v.storePSku }}
                                            </div>
                                            </td>
                                            <td class="saleNum">
                                                SMT:{{ v.saleNumSmtSeven || 0 }} / {{ v.saleNumSmtThirty || 0 }} <br />
                                                公司:{{ v.countDaysSeven || 0 }} / {{ v.countDaysThirty || 0 }}
                                            </td>
                                            <%--<td class="storeSkuInfo">--%>
                                                <%--{{ v.storePSku }}--%>
                                            <%--</td>--%>
                                            <td class="shippingInfo">
                                                {{if v.shippingStatus == 0}}
                                                <span class="layui-yellow">待设置</span>
                                                {{else if v.shippingStatus == 1}}
                                                <span class="layui-green">设置成功</span>
                                                {{else if v.shippingStatus == 2}}
                                                <span class="layui-gray">设置失败</span>
                                                {{/if}}
                                            </td>
                                            <td class="shippingInfo">
                                                {{ v.shippingRespMsg }}
                                            </td>
                                            <td colspan="8" style="padding: 10px 0" class="colspan_td">
                                                <table style='width: 100%'>
                                                    <tbody>
                                                    {{ each v.prodListingSubSkuFyndiqNewDtoList }}
                                                   
                                                        {{if $index<5 }}
                                                            <tr>
                                                        {{else}}
                                                        <tr   class="myj-hide">
                                                        {{ /if }}
                                                        <td width="30">
                                                            <div class="layui-form" lay-filter="sid-cbox">
                                                                {{if $value.id != ''}}
                                                                <input type="checkbox" class="sid-cbox" lay-skin="primary" name="sid-cbox"
                                                                value={{$value.id}}>
                                                                {{/if}}
                                                            </div>
                                                        </td>
                                                        <td width='140'>

                                                            <span>
                                                                {{if $value.sSku}}
                                                                {{ $value.sSku }}
                                                                {{else}}
                                                                <font class="layui-gray">不存在</font>
                                                                {{/if}}
                                                            </span>
                                                            {{if $value.listingStatus == 0}}
                                                            <span class="layui-bg-orange hp-badge ml5  joomPublish-unlist">待</span>
                                                            {{else if $value.listingStatus == 1}}
                                                            <span class="layui-bg-green hp-badge ml5 joomPublish-listsucc">已</span>
                                                            {{else if $value.listingStatus == 2}}
                                                            <span class="layui-bg-gray hp-badge ml5 joomPublish-listfail">败</span>
                                                            <span class="layui-hide joomPublish-listfailreason">{{$value.listingRespMsg}}</span>
                                                            {{else if $value.listingStatus == 3}}
                                                            <span class="layui-bg-blue hp-badge ml5 joomPublish-inlist">中</span>
                                                            {{/if}}
                                                        </td>
                                                        <td class="storeSubSkuInfo" width='120'>{{ $value.storeSSku
                                                            }}
                                                        </td>
                                                        <td>{{ $value.color }}</td>
                                                        <td>{{ $value.size }}</td>
                                                        <td class="listingInfo">{{ $value.price }}</td>
                                                        <td class="listingInfo">{{ $value.fiPrice }}
                                                        </td>
                                                        <td>
                                                            {{if null==$value.sale}}
                                                            {{else if $value.sale}}
                                                            <span class="layui-green fyndiqPublish-isSale">在售</span>
                                                            {{else}}
                                                            <span class="layui-gray fyndiqPublish-isNotSale">停售</span>
                                                            {{/if}}
                                                        </td>
                                                        <td class="prodStock">{{ ($value.stockNum ? $value.stockNum:0)-($value.reservationNum ? $value.reservationNum:0)}}/{{ $value.orderNotInNum ? $value.orderNotInNum:0 }}/{{ $value.lackUnPaiNum ? $value.lackUnPaiNum:0 }}</td>
                                                        <td class="listingStock">{{ $value.stock }}</td>
                                                    </tr>
                                                    {{ /each }}
                                                    </tbody>
                                                </table>
                                                {{  if(v.prodListingSubSkuFyndiqNewDtoList.length > 5) }}
                                                
                                                 <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuFyndiqNewDtoList.length}})</a>
                                               {{/if}}
                                            </td>
                                            <td class="timeClass" style="width: 150px">
                                                <div class="auditTime">
                                                    {{if v.auditTime}}
                                                    <span class="layui-green">审核于:{{v.auditTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{/if}}
                                                </div>
                                                <div class="listingTime">
                                                    {{if v.listingTime}}
                                                    <span class="layui-green">刊登于:{{v.listingTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{/if}}
                                                </div>
                                                <div class="listTiming">
                                                    {{if v.listTiming}}
                                                    <span class="layui-green">定时:{{v.listTiming| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{else}}
                                                    <span class="layui-green">刊登中</span>
                                                    {{/if}}
                                                </div>
                                            </td>
                                            <td>
                                                <div class="detailInfoBtn">
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="fyndiqNewPublish__layer_newFyndiq('{{v.id}}')">详情
                                                </button>
                                                <br>
                                                </div>
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接
                                                </button>
                                                <br>
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态
                                                </button>
                                                <br>
                                                <div class="publishBtn">
                                                <button type="button"
                                                        class="layui-btn layui-btn-warm  layui-btn-xs mb3"
                                                        onclick="newFyndiqListingPublish('{{v.id}}',false)">发布上架
                                                </button>
                                                <br>
                                                </div>
                                                <button  type="button" class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn" dataid="{{v.prodPId}}">开发思路</button><br>
                                            </td>
                                        </tr>
                                        {{ /each }}
                                        </tbody>
                                    </table>
                                </div>
                            </script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--待发布详情弹框-->
<script type="text/html" id="newFyndiqPulish_listDetailTpl">
    <div class="layui-fluid" id="newFyndiqPublish_editContent">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="fyndiqNewPublish_editDetailForm">
                    <input name="joomListingId" type="text" value="{{d.prodListingFyndiqNew.id}}" hidden>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">店铺父SKU:</label>
                            <div class="layui-input-block">
                                <input name="storePSku" readonly value="{{d.prodListingFyndiqNew.storePSku}}" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">刊登标题:
                                <button id="joomPublish_upcase" type="button" class="layui-btn layui-btn-xs"
                                        onclick="joomPublish_upCaseTitle()">
                                    首字母大写
                                </button>
                            </label>
                            <div class="layui-input-block">
                                <input name="title" value="{{d.prodListingFyndiqNew.title}}" data-prodpid="{{d.prodListingFyndiqNew.prodPId}}" type="text" class="layui-input ifFocusInput">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">产品描述:</label>
                            <div class="layui-input-block">
                                <textarea name="prodDesc" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingFyndiqNew.description}}</textarea>
                            </div>
                        </div>
                    </div>
                    <%-- <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">fyndiq Tags:<br>
                                <span class="layui-badge layui-bg-blue">数量:<i id="prodWishTagsNum">0</i></span><br>
                            </label>
                            <div class="layui-input-block">
                                <div class="tagsinput-primary form-group">
                                    <input type="text" name="tag" value="{{d.prodListingFyndiqNew.tag}}"
                                           data-role="tagsinput" />
                                </div>
                                <%--<input name="tag"  value="{{d.prodListingFyndiqNew.tag}}" type="text" class="layui-input">--%>
                            </div>
                        </div>
                    </div>

                    <div class="layui-card">
                        <div class="layui-card-header">图片</div>

                        <div class="layui-card-body">
                            <div id="img_content">
                                <table>
                                    <tbody>
                                    <td style="vertical-align:top;">
                                        <div id="fyndiqNewPublish_mainImg">
                                            <div class="ImgDivIn" style="height:300px;width: 280px">
                                                <input type="hidden" name="mainImg" value="{{d.mainImage}}">
                                                <img style="height:260px;width: 260px" src="{{d.mainImage}}"
                                                     onerror="layui.admin.img_noFind()">
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <button type="button" class="layui-btn layui-btn-sm" onclick="fyndiqNewPublish_addExtPic()">
                                                网络图片
                                            </button>
                                            <button type="button" class="layui-btn layui-btn-sm" onclick="fyndiqNewPublish_addtempPic()">
                                                模板图片
                                            </button>
                                        </div>
                                        <div class="pull-left" id="img_num">
                                            <div class="p0">
                                                <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                                    <span class="layui-bg-red">说明！</span>
                                                    <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                                    <span class="fColor2 mLeft10">「辅图和子sku最多共选用<span id="maxImgNum"
                                                                                                     class="fRed">20</span>张，已经选用了<span
                                                            id="curImgNum">{{d.extImages.length}}</span>张辅图,<span
                                                            id="sSkuImgNum"></span>张子sku图」</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="">
                                            <ul id="fyndiqNewPublish_extImg">
                                                {{# layui.each(d.extImages, function(index, prodImage){ }}
                                                <li draggable="true"
                                                    style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                                    <div class="ImgDivOut">
                                                        <div class="ImgDivIn" style="width:150px;height:150px;">
                                                            <input type="hidden" name="extImg" value="{{prodImage}}">
                                                            <img width="150" height="150" src="{{prodImage}}"
                                                                 onerror="layui.admin.img_noFind()">
                                                        </div>
                                                        <div class="imgDivDown" style="width:150px">
                                                            <a onclick="fyndiqNewPublish_setMainImg(this);" href="javascript:void(0);"
                                                               style="float:left;
      color: #73a1bf;">设为主图</a>
                                                            <a onclick="fyndiqNewPublish_delImg(this);" href="javascript:void(0);"
                                                               style="float:right;
      color: #73a1bf;">移除</a>
                                                        </div>
                                                    </div>

                                                </li>
                                                {{# }); }}
                                            </ul>
                                        </div>
                                    </td>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-header">
                            <span>SKU信息</span>
                            <button type="button"
                                    class="addShopifySubListing layui-btn layui-btn-sm layui-btn-normal fr disN"
                                    onclick="addShopifySubListing()">
                                添加一行
                            </button>
                        </div>
                        <div class="layui-card-body">
                            <table class="layui-table" id="listingInfo_sub_tab">
                                <thead>
                                <tr>
                                    <th hidden>id</th>
                                    <th>图片</th>
                                    <th>店铺SKU</th>
                                    <th>尺寸</th>
                                    <th>颜色</th>
                                    <%--<th>MSRP(sek)</th>--%>
                                    <th>刊登价格(sek)</th>
                                    <%--<th>刊登运费(sek)</th>--%>
                                    <th>刊登数量</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody id="fyndiqNewPublish_SubSkuInfo">
                                {{# layui.each(d.subSkuFyndiqNewList, function(index, subSkuShopifyDto){ }}
                                <tr data-prodtempid="{{subSkuShopifyDto.prodTempId}}">
                                    <td hidden>{{subSkuShopifyDto.id}}</td>
                                    <td>
                                        {{# if(subSkuShopifyDto.subImgUri){ }}
                                        <img width="60" height="60" src="{{subSkuShopifyDto.subImgUri}}">
                                        <a class="img_ssku_uri disN">{{subSkuShopifyDto.subImgUri}}</a>
                                        {{# }else{ }}
                                        <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
                                        <a class="img_ssku_uri disN"></a>
                                        {{# } }}
                                    </td>
                                    <td>{{subSkuShopifyDto.storeSSku}}
                                        <input type="hidden" value="{{subSkuShopifyDto.storeSSku}}">
                                    </td>
                                    <td><input type='text' class="layui-input" value='{{subSkuShopifyDto.size || ""}}'
                                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                                    </td>
                                    <td><input type='text' class="layui-input" value='{{subSkuShopifyDto.color || ""}}'
                                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                                    </td>
                                    <%--<td><input type='number' class="layui-input" value='{{subSkuShopifyDto.originalPrice}}'></td>--%>
                                    <td>
                                        <div class="fyndiq_price" style="width: 400px;">
                                            <span>瑞典(sek)</span>
                                            <span>芬兰(eur)</span>
                                            <span><input type='number' class="layui-input" value='{{subSkuShopifyDto.price}}'></span>
                                            <span><input type='number' class="layui-input" value='{{subSkuShopifyDto.fiPrice }}'></span>
                                            <input type="hidden" value="{{subSkuShopifyDto.fiOriginalPrice||''}}">
                                            <input type="hidden" value="{{subSkuShopifyDto.fiShipping||''}}">
                                            <span>挪威(nok)</span>
                                            <span>丹麦(dkk)</span>
                                            <span><input type='number' class="layui-input" value='{{subSkuShopifyDto.noPrice}}'></span>
                                            <span><input type='number' class="layui-input" value='{{subSkuShopifyDto.dkPrice }}'></span>
                                            <input type="hidden" value="{{subSkuShopifyDto.noShipping||''}}">
                                            <input type="hidden" value="{{subSkuShopifyDto.noOriginalPrice||''}}">
                                            <input type="hidden" value="{{subSkuShopifyDto.dkShipping||''}}">
                                            <input type="hidden" value="{{subSkuShopifyDto.dkOriginalPrice||''}}">
                                        </div>
                                    </td>
                                    <%--<td><input type='number' class="layui-input"--%>
                                               <%--value='{{subSkuShopifyDto.shipping}}'></td>--%>
                                    <td><input type='number' class="layui-input" value='{{subSkuShopifyDto.stock}}'></td>
                                    <td>{{# if(subSkuShopifyDto.listingStatus==1){ }}
                                        成功
                                        {{# }else if(subSkuShopifyDto.listingStatus==2){ }}
                                        失败
                                        {{# }else if(subSkuShopifyDto.listingStatus==3){ }}
                                        刊登中
                                        {{# }else if(subSkuShopifyDto.listingStatus==0){ }}
                                        待刊登
                                        {{# } }}
                                    </td>
                                    <td>
                                        {{# if(subSkuShopifyDto.listingStatus==1 || subSkuShopifyDto.listingStatus==3){ }}
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
                                                onclick="removeShopifySubListing(this)">移除
                                        </button>
                                        {{# }else{ }}
                                        <button type="button" class="layui-btn layui-btn-sm"
                                                onclick="removeShopifySubListing(this)">移除
                                        </button>
                                        {{# } }}
                                    </td>
                                </tr>
                                {{# }); }}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>
<!--立即刊登-->
<script type="text/html" id="newFyndiqPulish_TimingTpl">
    <div class="p20">
        <form class="layui-form" id="fyndiqNewPublish_TimingTplForm">
            <div style="padding: 0 0 20px 20px;">选择需要刊登的站点，不选代表刊登所有站点</div>
            <div class="layui-form-item" style="padding: 0 0 20px 20px;">
                <input type="checkbox" name="markets" title="瑞典" value="SE" lay-skin="primary">
                <input type="checkbox" name="markets" title="芬兰" value="FI" lay-skin="primary">
                <input type="checkbox" name="markets" title="挪威" value="NO" lay-skin="primary">
                <input type="checkbox" name="markets" title="丹麦" value="DK" lay-skin="primary">
            </div>
        </form>
    </div>
</script>

<!--定时刊登-->
<script type="text/html" id="newFyndiqPulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" id="fyndiqNewPublish_listTimingTplForm">
            <div style="padding: 0 0 20px 20px;">选择需要刊登的站点，不选代表刊登所有站点</div>
            <div class="layui-form-item">
                <label class="layui-form-label">定时刊登开始时间:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="newFyndiqPulish_listTiming" name="listTiming">
                </div>
            </div>
            <div class="layui-form-item" style="padding: 0 0 20px 20px;">
                <input type="checkbox" name="markets" title="瑞典" value="SE" lay-skin="primary">
                <input type="checkbox" name="markets" title="芬兰" value="FI" lay-skin="primary">
                <input type="checkbox" name="markets" title="挪威" value="NO" lay-skin="primary">
                <input type="checkbox" name="markets" title="丹麦" value="DK" lay-skin="primary">
            </div>
        </form>
    </div>
</script>
<script src="${ctx}/static/tagsinput/tagsinput.js"></script>

<!-- 增删子sku-->
<script type="text/html" id="joomPulish_listSubTrTpl">
    {{#  layui.each(d, function(index, subSkuShopifyDto){ }}
    <tr>
        <td hidden>{{subSkuShopifyDto.id}}</td>
        <td>
            {{# if(subSkuShopifyDto.subImgUri){ }}
            <img width="60" height="60" src="{{subSkuShopifyDto.subImgUri}}">
            <a class="img_ssku_uri disN">{{subSkuShopifyDto.subImgUri}}</a>
            {{# }else{ }}
            <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
            <a class="img_ssku_uri disN"></a>
            {{# } }}
        </td>
        <td>{{subSkuShopifyDto.storeSSku}}</td>
        <td><input type='text' name="size" class="layui-input" value='{{subSkuShopifyDto.size || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='text' name="color" class="layui-input" value='{{subSkuShopifyDto.color || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='number' class="layui-input" value='{{subSkuShopifyDto.msrp}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuShopifyDto.price}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuShopifyDto.shipping}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuShopifyDto.stock}}'></td>
        <td>{{# if(subSkuShopifyDto.listingStatus==1){ }}
            成功
            {{# }else if(subSkuShopifyDto.listingStatus==2){ }}
            失败
            {{# }else if(subSkuShopifyDto.listingStatus==3){ }}
            刊登中
            {{# }else if(subSkuShopifyDto.listingStatus==0){ }}
            待刊登
            {{# } }}
        </td>
        <td>
            {{# if(subSkuShopifyDto.listingStatus==1 || subSkuShopifyDto.listingStatus==3){ }}
            <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
                    onclick="removeShopifySubListing(this)">移除
            </button>
            {{# }else{ }}
            <button type="button" class="layui-btn layui-btn-sm" onclick="removeShopifySubListing(this)">移除</button>
            {{# } }}
        </td>
    </tr>
    {{#  }); }}
</script>

<script>
    var joomSensArray1 =  new Array();
    <c:forEach items="${joomSensProp}" var="sensProp">
    var obj = {};
    obj.name = '${sensProp.name}';
    obj.value = '${sensProp.code}';
    joomSensArray1.push(obj);
    </c:forEach>
</script>

<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>


<script src="${ctx}/static/js/publishs/fyndiq/newpublish.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js?v=${ver}"></script>

