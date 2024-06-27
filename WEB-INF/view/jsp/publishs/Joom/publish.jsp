<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>joom刊登</title>
<style>
    #joomPublish_extImg {
        overflow: hidden
    }

    #joomPublish_extImg li {
        float: left;
        margin-right: 10px
    }

    #joomPublish_searchForm .layui-form-item {
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
    #joomPublish_table th,
    #joomPublish_table td {
    text-align: center;
    padding: 5px 0;
    white-space: normal;
    overflow: visible;
    word-wrap: break-word;
   }
    .joomPublish_table_head table,
    .joomPublish_table_body table {
        width: 100%;
        margin: 0;
        table-layout: fixed;
    }

    #joomPublish_table .joomPublish-listfail:hover{
        cursor: pointer;
    }
    #joomPublish_tabId i {
        font-style: normal;
    }
    .dis_flex {
        display: flex;
        justify-content: flex-start;
    }
</style>
<div class="layui-fluid" id="joom_publish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="joomPublish_searchForm">
                        <div class="layui-form-item layui-row">
                            <input name="listingStatus" value="-2" type="hidden">
                            <input name="shippingStatus" value="" type="hidden">

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select id="joomPublish_group_sel" name="orgId"
                                                lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select id="joomPublish_salesman_sel" name="sellerId"
                                                lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                                                data-roleList="joom专员">
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" data-platcode="joom" lay-filter="joomPublish_storeAcctId" lay-search class="store_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN">
                                <label class="layui-form-label">选择类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                            id="joomPublish_item">选择类目
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('LAY-publishs-joom-publish-div','LAY-publishs-joom-publish-hidden')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-publishs-joom-publish-hidden" name="cateId">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType">
                                        <option value="" selected>全部</option>
                                        <c:forEach items="${devTypeEnums}" var="devType">
                                            <option value="${devType.getName()}">${devType.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag">
                                        <option value="" selected>全部
                                            <c:forEach items="${prodTagMap}" var="prodTag">
                                        <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_joom" xm-select-search xm-select-search-type="dl"
                                            xm-select-skin="normal" lay-filter='selectAttr_joom'>
                                        <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                                            <option value="${logisAttrEnum.getName()}">${logisAttrEnum.getName()}</option>
                                            <option value='no_${logisAttrEnum.getName()}'>
                                                不含${logisAttrEnum.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN">
                                <label class="layui-form-label">商品归属人</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectMan_joom" name="bizzOwnerIds" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="prodIsSaleStatus" xm-select="joomPublish_prodIsSaleStatus" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="2" selected>全部在售</option>
                                        <option value="1" selected>部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_btn_hasJoomDesc joomPublish_searchDisN">
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
                                    <select name="searchType" lay-filter="joomPublish_showHideVagueFlag">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">模板子SKU</option>
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
                                    </select>
                                </div>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                    <input name="searchText" type="text" class="layui-input" placeholder="">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3 joom_skuVagueFlag_div">
                                        <select name="skuVagueFlag">
                                            <option value="false">精确</option>
                                            <option value="true">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortBanListing">
                                        <option value="CURRENT_PLAT">joom不侵权</option>
                                        <option value="ANY_PLAT">所有平台都不侵权</option>
                                        <option value="ALL">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="CREATE_TIME">创建时间</option>
                                        <option value="AUDIT_TIME">审核时间</option>
                                        <option value="PUBLISH_TIME">刊登时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input joomPublishTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="creatorIdList" lay-verify="" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN" id="joomPublish_btn_stockType">
                                <div class="layui-form-label labelSel">
                                    <select name="preStockType">
                                        <option value="1">预计可用含在途</option>
                                        <option value="2">预计可用不含在途</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input type="number" name="preStockMin" autocomplete="off" class="layui-input">
                                    <input type="number" name="preStockMax" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="joomPublish_sortType">
                                <label class="layui-form-label">排序类型</label>
                                <div class="layui-input-block dis_flex">
                                    <select name="sortType" lay-filter="joomPublish_sortType">
                                        <option value="createTimeASC"> 创建时间正序</option>
                                        <option value="createTimeDESC"> 创建时间倒序</option>
                                        <option value="auditTimeASC"> 审核时间正序</option>
                                        <option value="auditTimeDESC"> 审核时间倒序</option>
                                        <option value="salesCountSevenDayDESC"> 7天销量倒序</option>
                                        <option value="salesCountThirtyDayDESC"> 30天销量倒序</option>
                                        <option value="salesCountSMTThirtyDayDESC"> 30天SMT销量倒序</option>
                                        <option value="salesCountJoomThirtyDayDESC"> 30天Joom销量倒序</option>
                                        <option class="sortTypeHide" value="preAvailableStockSumAsc"> 预计可用库存不含在途正序</option>
                                        <option class="sortTypeHide" value="preAvailableStockSumDesc"> 预计可用库存不含在途倒序</option>
                                        <option class="sortTypeHide" value="preAvailableStockAllAsc"> 预计可用库存含在途正序</option>
                                        <option class="sortTypeHide" value="preAvailableStockAllDesc"> 预计可用库存含在途倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="joomPublish_sortTypeNew">
                                <label class="layui-form-label">排序类型</label>
                                <div class="layui-input-block dis_flex">
                                    <select name="sortTypeNew" lay-filter="joomPublish_sortTypeNew" style="width: 50%"></select>
                                    <select name="sortRule" lay-filter="joomPublish_sortRule" style="width: 50%"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 joomPublish_searchDisN" id="joomPublish_btn_needFilterStock">
                                <label class="layui-form-label">库存</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="filterZeroStock" lay-skin="primary" title="过滤零库存">
                                </div>
                            </div>
                                <div class="layui-col-lg2 layui-col-md2 joomPublish_btn_hasJoomDesc joomPublish_searchDisN">
                                    <label class="layui-form-label">joom模板描述</label>
                                    <div class="layui-input-block">
                                        <select name="hasJoomDesc">
                                            <option value=""></option>
                                            <option value="true" selected>有</option>
                                            <option value="false">无</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 joomPublish_btn_hasJoomDesc joomPublish_searchDisN">
                                    <label class="layui-form-label">生成情况</label>
                                    <div class="layui-input-block">
                                        <select name="generated">
                                        <option value="">全部</option>
                                        <option value="true">已生成</option>
                                        <option value="false" selected>未生成</option>
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div style="margin-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            onClick="joomPublish_searchProd()" id="joomPublish_search">搜索
                                    </button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset"
                                            id="joomPublish_reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="LAY-publishs-joom-publish-div" class="joomPublish_searchDisN"></div>
                </div>
            </div>
            <div class="layui-card" id="joomPublishCard">
                <div class="layui-card-body">
                        <div id="joom_btn_show_hide" style="position: absolute; right: 10px; z-index: 999">
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                   id="joomPublish_btn_modifyDesc" onclick="joomPublish_modifyDesc()">修改描述
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                        id="joomPublish_btn_genListing"
                                        onclick="joomPublish_genToListingProd()">生成店铺商品
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                                        id="joomPublish_btn_delListing"
                                        onclick="joomPublish_deletelisting()">删除店铺商品
                                </button>
                                <div class="layui-input-inline w100 layui-form disN" id="joomPublish_div_selPubStyle">
                                    <select id="joomPublish_selPubStyle" lay-filter="joomPublish_selPubStyle_filter">
                                        <option value="" disabled selected>刊登</option>
                                        <option value="1">立即刊登</option>
                                        <option value="2">定时刊登</option>
                                    </select>
                                </div>
                                <button id="joomPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                                        type="button" onclick="joomPublish__canclePublishOnTiming()">取消定时刊登
                                </button>
        
                                <button id="joomPublish_btn_pubNow" class="layui-btn layui-btn-sm disN" type="button"
                                        onclick="joomListingPublish('',false)">发布上架
                                </button>
                                <button id="joomPublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger"
                                        type="button" onclick="joomPublish_exportskumapping()">导出SKU映射
                                </button>
        
                                <button id="joomPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="joomPublish_OnTiming()">定时刊登
                                </button>
                                <button id="joomPublish_btn_setShipping" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="joomPublish__setShipping()">设置运费
                                </button>
                                <button id="joomPublish_btn_rePubNow" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="joomListingPublish('',false)">重新发布
                                </button>
                        </div>
                    <div class="layui-tab" lay-filter="joomPublish_tab" id="joomPublish_tabId">
                        <ul class="layui-tab-title">
                            <li data-value="-2" class="layui-this" id="totalNum">商品<i>(0)</i></li>
                            <li data-value="0" id="toListingNum">待刊登<i>(0)</i></li>
                            <li data-value="3" id="joom_listingNum">刊登中<i>(0)</i></li>
                            <li data-value="1" id="listingSucNum">刊登成功<i>(0)</i></li>
                            <li data-value="2" id="listingFailNum">刊登失败<i>(0)</i></li>
                            <!--<li data-value="4" id="failSetShippingNum">运费设置失败(0)</li>-->
                        </ul>
                        <div class="layui-tab-content">
                            <div id="joomPublish_table">

                            </div>
                            <div id="joomPublish_pagination" class="customPagination"></div>
                            <!--模板文件-->
                            <script type="text/html" id="joomPublish_tpl">
                                <div class="joomPublish_table_head">
                                    <table class="layui-table">
                                        <colgroup>
                                          <col width="30px"/>
                                          <col width="70px" />
                                          <col width="10%" />
                                          <col width="5%" />
                                          <%--<col width="5%"/>--%>
                                          <col width="30px"/>
                                          <col width="150px"/>
                                          <col width="60px"/>
                                          <col width="60px"/>
                                          <col width="5%"/>
                                          <col width="7%"/>
                                          <col width="7%"/>
                                          <col width="7%"/>
                                        </colgroup> 
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div class="layui-form">
                                                        <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                                                    </div>
                                                </th>
                                                <th>缩略图</th>
                                                <th>标题</th>
                                                <th>父SKU</th>
                                                <th class="shippingInfo">运费设置状态</th>
                                                <th class="shippingInfo">设置失败原因</th>
                                                <th style="width: 30px">
                                                </th>
                                                <th>模板子SKU</th>
                                                <th class="storeSubSkuInfo">店铺子SKU</th>
                                                <th>颜色</th>
                                                <th>尺寸</th>
                                                <th class="listingInfo">售价($)</th>
                                                <th class="listingInfo">运费($)</th>
                                                <th>在售</th>
                                                <th class="joomquantityInfo">预计可用库存含在途/不含在途</th>
                                                <th class="prodStock">刊登状态</th>
                                                <th class="prodStock">7/30天销量
                                                    <i id="syncIcon" class="layui-icon layui-icon-tips"
                                                        onmouseenter="showTip('主流国家：即俄罗斯、摩尔多瓦、乌克兰、德国、哈萨克斯坦、法国、波兰、瑞士、马耳他、以色列等10个国家',this)"
                                                        onmouseleave="removeTip(this)"
                                                        style="position:absolute;right: 10px;"></i>
                                                </th>
                                                <th class="prodStock">开发备注</th>
                                                <th class="prodStock">侵权状态</th>
                                                <th class="listingStock">在线数量</th>
                                                <th class="listingTime">刊登时间</th>
                                                <th class="timeClass">时间</th>
                                                <th class="listingInfo">创建人</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div class="joomPublish_table_body" style="margin-top: -6px">
                                    <table class="layui-table">
                                        <colgroup>
                                            <col width="30px"/>
                                            <col width="70px" />
                                            <col width="10%" />
                                            <col width="5%" />
                                            <col width="30px"/>
                                            <col width="150px"/>
                                            <col width="60px"/>
                                            <col width="60px"/>
                                            <col width="5%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                            <col width="7%"/>
                                        </colgroup> 
                                        <tbody>
                                        {{ each data v i}}
                                        <tr class="skus-tr tr{{v.id}}">
                                            <td>
                                                <div class="layui-form">
                                                    <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.id }}
                                                        name="id">
                                                </div>
                                            </td>
                                            <td>
                                                <img width="60" height="60" data-original="{{ v.mainImage }}!size=60x60"
                                                    class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
                                            </td>
                                            <td>
                                                {{ v.name }}<br/>
                                                <span class="layui-gray listingSuccInfo">
                                                    <a target="_blank" style="color:blue"
                                                        href="https://www.joom.com/c/{{ v.storeProdPId }}">{{ v.storeProdPId }}</a>
                                                </span>
                                            </td>
                                            <td>
                                                <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue">商品：<span class="pSku">{{
                                                    v.pSku }}</span></a>
                                                <div>店铺：{{ v.storePSku }}</div>
                                                {{if v.joomProdPExtraId}}
                                                <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">描</span>
                                                {{/if}}
                                            </td>
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
                                                    {{if v.prodListingSubSkuJooms}}
                                                    {{ each v.prodListingSubSkuJooms }}
                                                    {{if $index<5}}
                                                        <tr>
                                                    {{else}}
                                                    <tr   class="myj-hide">
                                                    {{ /if }}
                                                        <td width="30">
                                                            <div class="layui-form">
                                                                {{if $value.id != ''}}
                                                                <input type="checkbox" class="sid-cbox" lay-skin="primary"
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
                                                        <td class="listingInfo">{{ $value.shipping }}
                                                        </td>
                                                        <td>
                                                            {{if null==$value.isSale}}
                                                            {{else if $value.isSale}}
                                                            <span class="layui-green joomPublish-isSale">在售</span>
                                                            {{else}}
                                                            <span class="layui-gray joomPublish-isNotSale">停售</span>
                                                            {{/if}}
                                                        </td>
<%--                                                        <td class="prodStock">{{ ($value.stockNum ? $value.stockNum:0)-($value.reservationNum ? $value.reservationNum:0)}}/{{ $value.orderNotInNum ? $value.orderNotInNum:0 }}/{{ $value.lackUnPaiNum ? $value.lackUnPaiNum:0 }}</td>--%>
                                                        <td class="joomquantityInfo">{{ ($value.preAvailableStockAll==undefined?'':$value.preAvailableStockAll) + '/' + ($value.preAvailableStock==undefined?'':$value.preAvailableStock) }}</td>
                                                        <td class="listingStock">{{ $value.stock }}</td>
                                                        <td class="listingTime">{{$value.listingTime| dateFormat 'yyyy-MM-dd hh:mm'}}</td>
                                                    </tr>
                                                    {{ /each }}
                                                    {{ /if }}
                                                    </tbody>
                                                </table>
                                                {{  if(v.prodListingSubSkuJooms && v.prodListingSubSkuJooms.length > 5)}}
                                                <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuJooms.length}})</a>
                                            {{/if}}
                                            </td>
                                            <td class="prodStock">
                                                <span  style="color:#999;">刊登数:</span>
                                                <a href="javascrpt:;" style="color:blue"  onclick="producttpl_getListingStatus('{{ v.prodPId }}', 'joom')">{{ v.storeNum||0}}</a>
                                            </td>
                                            <td class="prodStock">
                                                <span  style="color:#999;">主流国家:</span> {{ v.mainstreamCountrySalesSevenDays || 0}} / {{ v.mainstreamCountrySalesThirtyDays || 0 }}<br>
                                                <span  style="color:#999;">Joom:</span> {{ v.joomSalesNumSevenDays || 0}} / {{ v.joomSalesNumThirtyDays || 0 }}<br>
                                                <span  style="color:#999;">SMT:</span> {{ v.smtSalesNumSevenDays || 0}} / {{ v.smtSalesNumThirtyDays || 0 }}<br>
                                                <span  style="color:#999;">公司:</span> {{ v.totalSalesNumSevenDays || 0}} / {{ v.totalSalesNumThirtyDays || 0 }}<br>
                                                <span  style="color:#999;">竞品:</span> <a href="javascrpt:;" style="color:blue" onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}',function(){openJoomComp({{v.prodPId}})})">{{ v.compSalesNum || 0}}</a>
                                            </td>
                                            <td class="prodStock">
                                                <span>{{v.devNote}}</span>
                                            </td>
                                            <td class="prodStock">
                                                <div class="alignLeft layui-form" style="padding-left: 10px;">
                                                    {{ if (v.wishTort) }}
                                                        <input type="checkbox" disabled checked title="wish" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled title="wish" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.wishTortReason ? v.wishTortReason : ''}}</span><br>
                                                    {{ if (v.joomTort) }}
                                                        <input type="checkbox" disabled checked title="joom" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="joom" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.joomTortReason ? v.joomTortReason : ''}}</span><br>
                                                    {{ if (v.ebayTort) }}
                                                        <input type="checkbox" disabled checked title="ebay" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="ebay" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.ebayTortReason ? v.ebayTortReason : ''}}</span><br>
                                                    {{ if (v.amazonTort) }}
                                                        <input type="checkbox" disabled checked title="amazon" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="amazon" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.amazonTortReason ? v.amazonTortReason : ''}}</span><br>
                                                    {{ if (v.smtTort) }}
                                                        <input type="checkbox" disabled checked title="smt" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="smt" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.smtTortReason ? v.smtTortReason : ''}}</span><br>
                                                    {{ if (v.shopeeTort) }}
                                                        <input type="checkbox" disabled checked title="shopee" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="shopee" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.shopeeTortReason ? v.shopeeTortReason : ''}}</span><br>
                                                    {{ if (v.lazadaTort) }}
                                                        <input type="checkbox" disabled checked title="lazada" lay-skin="primary"><br>
                                                    {{ else }}
                                                        <input type="checkbox" disabled  title="lazada" lay-skin="primary">
                                                    {{/if}}
                                                        <span class="w_50 inline_table hv20 small_apn">{{ v.lazadaTortReason ? v.lazadaTortReason : ''}}</span><br>
                                                </div>
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
                                            <td class="listingInfo">
                                                {{v.creator}}
                                            </td>
                                            <td>
                                                <div class="detailInfoBtn">
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="joomPublish__layer_joom('{{v.id}}')">详情
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
                                                        onclick="joomListingPublish('{{v.id}}',false)">发布上架
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

<%--侵权信息修改弹窗--%>
<script type="text/html" id="tortInfoEditPop_joomPublish">
<div style="text-align: center">
    <table id="tortInfoTable_joomPublish" lay-filter="tortInfoTable_joomPublish">
    </table>
</div>
</script>

<%--修改joom模板描述--%>
<script type="text/html" id="modifyDesc_joomPublish">
    <div class="layui-form-item">
        <div class="layui-inline">
            <label class="layui-form-label">描述</label>
            <div class="layui-input-inline">
                <textarea name="" cols="30" rows="4" id="joomPublish_old_describe" class="layui-textarea"></textarea>
            </div>
        </div>
        <div class="layui-inline">
            <label class="layui-form-label">替换为</label>
            <div class="layui-input-inline">
                <textarea name="" cols="30" rows="4" id="joomPublish_new_describe" class="layui-textarea"></textarea>
            </div>
        </div>
        <div class="layui-inline">
            <button id="joomPublishReplace" class="layui-btn layui-btn-normal layui-btn-sm">替换</button>
        </div>
        <div class="layui-inline">
            <button id="joomPublishSubmit" class="layui-btn layui-btn-normal layui-btn-sm">提交</button>
        </div>
    </div>
    <table class="layui-table" id="joomPublish_modifyDesc_Table" lay-filter="joomPublish_modifyDesc_Table"></table>
</script>
<script type="text/html" id="modifyDesc_joomPublish_textarea">
    <textarea class="layui-textarea descript_textarea descript_textarea_{{d.prodPSku}}" style="min-height:100px;" cols="20">{{ d.prodDesc || '' }}</textarea>
</script>

<!--待发布详情弹框-->
<script type="text/html" id="joomPulish_listDetailTpl">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="joomPublish_editDetailForm">
                    <input name="joomListingId" type="text" value="{{d.prodListingJoom.id}}" hidden>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">店铺父SKU:</label>
                            <div class="layui-input-block">
                                <input name="storePSku" readonly value="{{d.prodListingJoom.storePSku}}" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">刊登标题:
                                <!-- <button id="joomPublish_upcase" type="button" class="layui-btn layui-btn-xs"
                                        onclick="joomPublish_upCaseTitle()">
                                    首字母大写
                                </button> -->
                            </label>
                            <div class="layui-input-block">
                                <input name="title" value="{{d.prodListingJoom.name}}" type="text" class="layui-input ifFocusInput" data-prodpid="{{d.prodListingJoom.prodPId}}">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">产品描述:</label>
                            <div class="layui-input-block">
                                <textarea name="prodDesc" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingJoom.description}}</textarea>
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">Joom Tags:<br>
                                <span class="layui-badge layui-bg-blue">数量:<i id="prodJoomTagsNum">0</i></span><br>
                            </label>
                            <div class="layui-input-block">
                                <div class="tagsinput-primary form-group">
                                    <input type="text" name="tag" value="{{d.prodListingJoom.tag}}"
                                           data-role="tagsinput"/>
                                </div>
                                <%--<input name="tag"  value="{{d.prodListingJoom.tag}}" type="text" class="layui-input">--%>
                            </div>
                        </div>
                    </div>

                    <div class="layui-card">
                        <label class="layui-form-label w90">Joom敏感货</label>
                        <div class="layui-input-inline">
                            <select name="joomSensProd" id="wishPublish_detail_joomSens"
                                    xm-select="wishPublish_select_joomSens" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                <c:forEach items="${joomSensProp}" var="joomDangerous">
                                    <option value="${joomDangerous.getCode()}">${joomDangerous.getName()}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="layui-input-inline">
                            <input type="text" name="dangerousKindName" value="" disabled class="layui-input"><!--展示值-->
                            <input type="text" name="dangerousKindValue" value="" hidden><!--实际传值-->
                        </div>
                    </div>

                    <div class="layui-card">
                        <div class="layui-card-header">图片</div>

                        <div class="layui-card-body">
                            <div id="img_content">
                                <table>
                                    <tbody>
                                    <td style="vertical-align:top;">
                                        <div id="joomPublish_mainImg">
                                            <div class="ImgDivIn" style="height:300px;width: 280px">
                                                <input type="hidden" name="mainImg" value="{{d.mainImage}}">
                                                <img style="height:260px;width: 260px" src="{{d.mainImage}}"
                                                     onerror="layui.admin.img_noFind()">
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <button type="button" class="layui-btn layui-btn-sm" onclick="joomPublish_addExtPic()">
                                                网络图片
                                            </button>
                                            <span class="layui-btn layui-btn-sm" id="lazadaTplImg" onclick="joom_publish_addImgByTpl({{d.prodListingJoom.prodPId}})">模板图片</span>
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
                                            <ul id="joomPublish_extImg">
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
                                                            <a onclick="joomPublish_setMainImg(this);" href="javascript:void(0);"
                                                               style="float:left;
      color: #73a1bf;">设为主图</a>
                                                            <a onclick="joomPublish_delImg(this);" href="javascript:void(0);"
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
                                    class="addJoomSubListing layui-btn layui-btn-sm layui-btn-normal fr disN"
                                    onclick="addJoomSubListing()">
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
                                    <th>尺寸：长*宽*高(cm)</th>
                                    <th>尺寸</th>
                                    <th>颜色</th>
                                    <th>MSRP($)</th>
                                    <th>刊登价格($)</th>
                                    <th>刊登运费($)</th>
                                    <th>刊登数量</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody id="joomPublish_SubSkuInfo">
                                {{# layui.each(d.subSkuJoomDtos, function(index, subSkuJoomDto){ }}
                                <tr>
                                    <td hidden>{{subSkuJoomDto.id}}</td>
                                    <td>
                                        {{# if(subSkuJoomDto.subImgUri){ }}
                                        <img width="60" height="60" src="{{subSkuJoomDto.subImgUri}}">
                                        <a class="img_ssku_uri disN">{{subSkuJoomDto.subImgUri}}</a>
                                        {{# }else{ }}
                                        <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
                                        <a class="img_ssku_uri disN"></a>
                                        {{# } }}
                                    </td>
                                    <td>{{subSkuJoomDto.storeSSku}}</td>
                                    <td>
                                        <div class="disflex">
                                            <input type='text' class="layui-input w50" name="length" placeholder="长" value='{{[null,undefined].includes(subSkuJoomDto.length)?'':subSkuJoomDto.length}}' onblur="commonBlurInputNotNega(event)"/>
                                            <input type='text' class="layui-input w50" name="width" placeholder="宽" value='{{[null,undefined].includes(subSkuJoomDto.width)?'':subSkuJoomDto.width}}' onblur="commonBlurInputNotNega(event)"/>
                                            <input type='text' class="layui-input w50" name="height" placeholder="高" value='{{[null,undefined].includes(subSkuJoomDto.height)?'':subSkuJoomDto.height}}' onblur="commonBlurInputNotNega(event)"/>
                                        </div>
                                    </td>
                                    <td><input type='text' class="layui-input" value='{{subSkuJoomDto.size || ""}}'
                                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                                    </td>
                                    <td><input type='text' class="layui-input" value='{{subSkuJoomDto.color || ""}}'
                                               onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
                                    </td>
                                    <td><input type='number' class="layui-input" value='{{subSkuJoomDto.msrp}}'></td>
                                    <td><input type='number' class="layui-input" value='{{subSkuJoomDto.price}}' onblur="changCheck(value)"></td>
                                    <td><input type='number' class="layui-input"
                                               value='{{subSkuJoomDto.shipping}}'></td>
                                    <td><input type='number' class="layui-input" value='{{subSkuJoomDto.stock}}'></td>
                                    <td>{{# if(subSkuJoomDto.listingStatus==1){ }}
                                        成功
                                        {{# }else if(subSkuJoomDto.listingStatus==2){ }}
                                        失败
                                        {{# }else if(subSkuJoomDto.listingStatus==3){ }}
                                        刊登中
                                        {{# }else if(subSkuJoomDto.listingStatus==0){ }}
                                        待刊登
                                        {{# } }}
                                    </td>
                                    <td>
                                        {{# if(subSkuJoomDto.listingStatus==1 || subSkuJoomDto.listingStatus==3){ }}
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
                                                onclick="removeJoomSubListing(this)">移除
                                        </button>
                                        {{# }else{ }}
                                        <button type="button" class="layui-btn layui-btn-sm"
                                                onclick="removeJoomSubListing(this)">移除
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


<!--定时刊登-->
<script type="text/html" id="joomPulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label">定时刊登开始时间:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="joomPulish_listTiming" name="listTiming">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">listing刊登间隔(分):</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="listInterval">
                </div>
            </div>
        </form>
    </div>
</script>
<script src="${ctx}/static/tagsinput/tagsinput.js"></script>

<!-- 增删子sku-->
<script type="text/html" id="joomPulish_listSubTrTpl">
    {{#  layui.each(d, function(index, subSkuJoomDto){ }}
    <tr>
        <td hidden>{{subSkuJoomDto.id}}</td>
        <td>
            {{# if(subSkuJoomDto.subImgUri){ }}
            <img width="60" height="60" src="{{subSkuJoomDto.subImgUri}}">
            <a class="img_ssku_uri disN">{{subSkuJoomDto.subImgUri}}</a>
            {{# }else{ }}
            <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
            <a class="img_ssku_uri disN"></a>
            {{# } }}
        </td>
        <td>{{subSkuJoomDto.storeSSku}}</td>
        <td><input type='text' name="size" class="layui-input" value='{{subSkuJoomDto.size || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='text' name="color" class="layui-input" value='{{subSkuJoomDto.color || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='number' class="layui-input" value='{{subSkuJoomDto.msrp}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuJoomDto.price}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuJoomDto.shipping}}'></td>
        <td><input type='number' class="layui-input" value='{{subSkuJoomDto.stock}}'></td>
        <td>{{# if(subSkuJoomDto.listingStatus==1){ }}
            成功
            {{# }else if(subSkuJoomDto.listingStatus==2){ }}
            失败
            {{# }else if(subSkuJoomDto.listingStatus==3){ }}
            刊登中
            {{# }else if(subSkuJoomDto.listingStatus==0){ }}
            待刊登
            {{# } }}
        </td>
        <td>
            {{# if(subSkuJoomDto.listingStatus==1 || subSkuJoomDto.listingStatus==3){ }}
            <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
                    onclick="removeJoomSubListing(this)">移除
            </button>
            {{# }else{ }}
            <button type="button" class="layui-btn layui-btn-sm" onclick="removeJoomSubListing(this)">移除</button>
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


<script src="${ctx}/static/js/publishs/joom/publish.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>

