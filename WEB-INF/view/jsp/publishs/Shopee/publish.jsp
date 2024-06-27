<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<title>shopee刊登</title>
<style>
  #shopeePublish_extImg {
    overflow: hidden
  }
  #shopeePublish_extImg li {
    float: left;
    margin-right: 10px
  }
  .dis_flex {
      display: flex;
      justify-content: flex-start;
  }
  #shopeePublish_searchForm .layui-form-item {
    margin-bottom: 0
  }
  td[class="colspan_td"]>table>tbody tr:first-child td {
    border-top:none;
  }
  td[class="colspan_td"]>table>tbody tr:last-child td {
    border-bottom: none;
  }
  td[class="colspan_td"]>table>tbody tr td{
    border-left:none;
    border-right: none;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
  }
  #shopeePublish_table th,
  #shopeePublish_table td {
    text-align: center;
    padding: 5px 0;
    white-space: normal;
    overflow: visible;
    word-wrap: break-word;
  }
  .shopeePublish_table_head table,
  .shopeePublish_table_body table {
    width: 100%;
    margin: 0;
    table-layout: fixed;
  }
  #shopeePublish_pagination {
    position: fixed;
    z-index: 999999;
    bottom: 0;
    background: #fff;
    /* box-shadow: 10px 10px 5px #888; */
    width: 100%;
  }
</style>
<div class="layui-fluid" id="shopee_publish">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shopeePublish_searchForm">
            <div class="layui-form-item layui-row">
              <input name="listingStatus" value="-2" type="hidden">
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select id="shopeePublish_group_sel" name="orgId"
                          lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" lay-search>
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select id="shopeePublish_salesman_sel" name="sellerId"
                          lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                          data-roleList="shopee专员">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select name="storeAcctId"  data-platcode="shopee" lay-search class="store_hp_custom">
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">选择类目</label>
                <div class="layui-input-block">
                  <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="shopeePublish_item">选择类目</button>
                  <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-publishs-shopee-publish-div','LAY-publishs-shopee-publish-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                  <input type="hidden" id="LAY-publishs-shopee-publish-hidden" name="cateId">
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">开发类型</label>
                <div class="layui-input-block">
                  <select name="devType" lay-search>
                    <option value="" selected>全部</option>
                    <c:forEach items="${devTypeEnums}" var="devType">
                      <option value="${devType.getName()}">${devType.getName()}</option>
                    </c:forEach>
                  </select>
                </div>
              </div>

              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品标签</label>
                <div class="layui-input-block">
                  <select name="tag" lay-search>
                    <option value="" selected>全部
                    <option>
                      <c:forEach items="${prodTagMap}" var="prodTag">
                    <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                    </c:forEach>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select xm-select="selectAttr_shopee" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2 disN">
                  <label class="layui-form-label">普货特货</label>
                  <div class="layui-input-block">
                      <select name="specFlag">
                        <option value="false">普货</option>
                        <option value="true">特货</option>
                      </select>
                  </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">商品归属人</label>
                <div class="layui-input-block">
                  <select xm-select="selectMan_shopee" name="bizzOwnerIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">侵权状态</label>
                <div class="layui-input-block">
                  <select name="tortBanListing">
                    <%-- <c:forEach items="${tortBanListings}" var="tortBanListing">
                      <option value="${tortBanListing.name()}">${tortBanListing.getText()}</option>
                    </c:forEach> --%>
                    <option value="CURRENT_PLAT">shopee不侵权</option>
                    <option value="ANY_PLAT">所有平台都不侵权</option>
                    <option value="ALL">全部</option>  
                  </select>
                </div>
              </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">在售状态</label>
                    <div class="layui-input-block">
                        <select name="saleBoolType">
                            <option value="">全部</option>
                            <option value="0">完全停售</option>
                            <option value="1" selected>完全在售</option>
                            <option value="2">部分在售</option>
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

                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">生成情况</label>
                    <div class="layui-input-block">
                        <select name="existListing">
                            <option value="">全部</option>
                            <option value="false" selected>未生成</option>
                            <option value="true">已生成</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">是否禁售</label>
                    <div class="layui-input-block">
                        <select name="canSaleBool">
                            <option value="true" selected>非禁售</option>
                            <option value="false">禁售</option>
                            <option value="" >全部</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">库存</label>
                    <div class="layui-input-block">
                        <input type="checkbox" name="filterZeroStock" lay-skin="primary" title="过滤零库存">
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label  labelSel">
                  <select name="timeType">
                      <option value="CREATE_TIME">创建时间</option>
                      <option value="AUDIT_TIME">审核时间</option>
                      <option value="PUBLISH_TIME">刊登时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" name="time" autocomplete="off" class="layui-input"
                         id="shopeePublishTime">
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-label  labelSel">
                      <select name="searchType" lay-filter="shopeePublish_showHideVagueFlag">
                          <option value="pSkus">父SKU</option>
                          <option value="sSkus">模板子SKU</option>
                          <option value="cnTitle">商品中文</option>
                          <option value="enTitle">商品英文</option>
                      </select>
                  </div>
                <div class="layui-input-block">
                    <div class="layui-col-md8 layui-col-lg8">
                        <input name="searchText" type="text" class="layui-input" placeholder="">
                    </div>
                    <div id="shopee_skuVagueFlag_div" class="layui-col-md4 layui-col-lg4">
                        <select name="skuVagueFlag">
                              <option value="false">精确</option>
                              <option value="true">模糊</option>
                          </select>
                      </div>
                  </div>
              </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">本人设置</label>
                    <div class="layui-input-block">
                        <select id="shopee_publish_mack_listing_select_unqiue_id">
                            <option value="">请选择</option>
                            <option value="1" selected>可刊登</option>
                            <option value="0">不刊登</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                        <select name="salesSite" lay-search>
                            <option value="">请选择</option>
                            <c:forEach items="${siteIds}" var="siteId">
                                <option value="${siteId.getCode()}">${siteId.getName()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4 failInfo hidden">
                    <label class="layui-form-label">错误查询</label>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <select name="listingRespCode">
                                <option value="">请选择</option>
                                <option value="分层失败">分层失败</option>
                                <option value="不可刊登">不可刊登</option>
                                <option value="刊登信息问题">刊登信息问题</option>
                                <option value="刊登超时">刊登超时</option>
                            </select>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input name="listingRespMsg" placeholder="错误信息" class="layui-input" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-form-label labelSel">
                        <select name="searchSalesType" id="searchSalesType">
                            <option value="1">7日销量</option>
                            <option value="2">15日销量</option>
                            <option value="3">30日销量</option>
                        </select>
                    </div>
                    <div class="layui-input-block dis_flex">
                        <input type="text" name="salesMin" autocomplete="off" class="layui-input" id="salesMin">
                        <input type="text" name="salesMax" autocomplete="off" class="layui-input" id="salesMax">
                    </div>
                </div>
              <div class="layui-col-lg1 layui-col-md1">
                <div style="margin-left:20px">
                  <button class="layui-btn layui-btn-sm keyHandle" type="button" onClick="shopee_publish_searchBtn()" id="shopeePublish_search">搜索</button>
                  <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset" id="shopeePublish_reset">清空
                  </button>
                </div>
              </div>
                <div class="layui-col-lg2 layui-col-md2" style="float: right;">
                    <div class="layui-input-block">
                        <select name="salesSort" id="salesSort">
                            <option value="1">7日销量倒序排列</option>
                            <option value="2">15日销量倒序排列</option>
                            <option value="3">30日销量倒序排列</option>
                        </select>
                    </div>
                </div>
            </div>
          </form>
          <div id="LAY-publishs-shopee-publish-div"></div>
        </div>
      </div>
      <div class="layui-card" id="shopeePublishCard">

        <div class="layui-card-body">
            <div id="shopee_btn_show_hide" style="position: absolute; right: 10px; z-index: 999">
                <a class="layui-btn layui-btn-normal layui-btn-sm" id="shopeePublish_batchHandleBtn">批量设置想|不想刊登</a>
                <button id="shopeePublish_btn_delListing" class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                        onclick="deletelisting_shopeePublish()">删除店铺商品
                </button>
                <button id="shopeePublish_btn_exportListing" class="layui-btn layui-btn-sm disN" type="button" onclick="exportListing_shopeePublish()">导出店铺商品</button>
                <%--<button id="shopeePublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger" type="button" onclick="exportskumapping_shopeePublish()">导出SKU映射</button>--%>
                <button id="shopeePublish_btn_genListing2" class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                        onclick="genToListingProd_shopeePublish2()">生成店铺商品2.0(API)</button>
                <div class="layui-input-inline w100 layui-form disN" id="shopeePublish_div_selPubStyle">
                  <select id="shopeePublish_selPubStyle" lay-filter="shopeePublish_selPubStyle_filter">
                    <option value="" disabled selected>刊登</option>
                    <option value="1">立即刊登</option>
                    <option value="2">定时刊登</option>
                  </select>
                </div>
                <button id="shopeePublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                          type="button" onclick="shopeePublish__canclePublishOnTiming()">取消定时刊登
                </button>
                <button id="shopeePublish_btn_pubNow" class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                        onclick="shopeeListingPublish()">立即刊登
                </button>
                <button id="shopeePublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                          onclick="shopeePublish_OnTiming()">定时刊登
                </button>
                <button  type="button" id="shopeePublish_btn_copyListing" class="layui-btn layui-btn-sm layui-btn-primary disN"
                         onclick="shopeePublish__copy_listing()">批量复制</button>
                <button id="shopeePublish_btn_rePublish" class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                        onclick="shopeePublish_rePublish()">重新刊登
                </button>
            </div>
          <div class="layui-tab" lay-filter="shopeePublish_tab">
            <div style="height:42px;line-height:42px;">
              <ul class="layui-tab-title">
                  <li data-value="-2" class="layui-this" id="shopeePublish_totalNum">商品(0)</li>
                <li data-value="0" id="shopeePublish_toListingNum">待刊登(0)</li>
                <li data-value="3" id="shopeePublish_listingNum">刊登中(0)</li>
                <li data-value="1" id="shopeePublish_listingSucNum">刊登成功(0)</li>
                <li data-value="2" id="shopeePublish_listingFailNum">刊登失败(0)</li>
                <li data-value="4" id="shopeePublish_notInSale">已下架</li>
              </ul>
            </div>
            <div class="layui-tab-content">
              <div id="shopeePublish_table">

              </div>
              <div id="shopeePublish_pagination"></div>
              <!--模板文件-->
              <script type="text/html" id="shopeePublish_tpl">
                <div class="shopeePublish_table_head">
                    <table class="layui-table">
                        <colgroup class="shopeeTheadCol">
                          <col width="3%"/>
                          <col width="70px" />
                            <col width="10%" />
                          <col width="5%" />
                          <col width="5%" />
                          <col width="5%"/>
                          <col width="8%"/>
                          <col width="60px"/>
                          <col width="60px"/>
                          <col width="60px"/>
                          <col width="5%"/>
                          <col width="7%"/>
                        </colgroup>
                      <thead>
                      <tr>
                        <th>
                          <div class="layui-form">
                            <input type="checkbox" lay-skin="primary" id="shopeePublish_AllChecked">
                          </div>
                        </th>
                        <th>缩略图</th>
                        <th>标题/店铺</th>
                          <th>销量</th>
                        <th>父SKU</th>
                        <th class="cateInfo">类目id</th>
                        <th class="storeSkuInfo">店铺父SKU</th>
                        <th>模板子SKU</th>
                        <th class="storeSubSkuInfo">店铺子SKU</th>
                        <th>颜色</th>
                        <th>尺寸</th>
                        <th>在售</th>
                        <th>可用/在途/未派</th>
                        <th class="failInfo">状态</th>
                        <th class="failInfo">失败原因</th>
                        <th class="timeClass">时间</th>
                        <th class="creator">创建人</th>
                        <th>操作</th>
                      </tr>
                      </thead>
                    </table>
                  </div>
                  <div class="shopeePublish_table_body" style="margin-top: -2px">
                      <table class="layui-table">
                          <colgroup class="shopeeTbodyCol">
                            <col width="3%"/>
                            <col width="70px" />
                              <col width="10%" />
                            <col width="5%" />
                            <col width="5%" />
                            <col width="5%"/>
                            <col width="8%"/>
                            <col width="60px"/>
                            <col width="60px"/>
                            <col width="60px"/>
                            <col width="5%"/>
                            <col width="7%"/>
                          </colgroup>
                          <tbody>
                          {{ each data v i}}
                          <tr>
                            <td>
                              <div class="layui-form">
                                <input type="checkbox" lay-skin="primary" value={{ v.id }} name="id">
                              </div>
                            </td>
                            <td>
                              <%-- {{ if judgeEffective(v.pImg) }}
                              <img width="60" height="60" data-original="{{ v.pImg }}" class="img_show_hide lazy b1"  data-onerror="layui.admin.img_noFind()">
                              {{ else }}
                                <span>暂无图片</span>
                              {{/if}} --%>
                              <img width="60" height="60" data-original="{{GlobalDomainImgSrc(v.pImg)}}"  class="img_show_hide lazy b1"  data-onerror="isEffectiveUrl()">
                            </td>
                            <td>
                              {{ v.name }}
                              <br>
                              <strong>店铺:</strong><span>{{v.storeAcct || ''}}</span>
                            </td>

                              <td>
                                  7日：{{v.saleNumShopeeSeven }}
                                  <br>
                                  15日：{{v.saleNumShopeeFifteen }}
                                  <br>
                                  30日：{{v.saleNumShopeeThirty }}
                                  <br>
                              </td>
                            <td>
                              <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue">{{ v.pSku }}</a>
                                {{if v.prodProhibitMappingList}}
                                    <div class="pointHand showTipElem" onmouseover="shopeePublish_showProhibitList(this,{{v.remark}})" onmouseout="removeTip(this)">禁售说明</div>
                                {{/if}}
                                {{if v.onlinePublishStatus||v.existListing}}
                                {{if v.onlinePublishStatus}}
                                <span class="layui-bg-green">已刊登</span>
                                {{/if}}
                                {{if v.existListing}}
                                <span class="layui-bg-orange">已生成</span>
                                {{/if}}
                                <br/>
                                {{/if}}
                                {{if v.mackListingType}}
                                {{if v.mackListingType == 0}}
                                <br> <span class="layui-bg-orange">不想刊登</span>
                                {{/if}}
                                {{/if}}
                            </td>
                            <td class="cateInfo">
                                  <span>{{ v.categoryId }}</span>
                            </td>
                            <td class="storeSkuInfo">
                                {{ v.storePSku }}<br/>
                                {{if v.listingStatus == 0}}
                                <span class="layui-bg-orange hp-badge ml5 shopeePublish_status  shopeePublish-unlist">待</span>
                                <span class="layui-hide shopeePublish-unlistreason">{{v.listingRespMsg}}</span>
                                {{else if v.listingStatus == 1}}
                                <span class="layui-bg-green hp-badge ml5 shopeePublish_status shopeePublish-listsucc">已</span>
                                {{else if v.listingStatus == 2}}
                                <span class="layui-bg-gray hp-badge ml5 shopeePublish_status shopeePublish-listfail">败</span>
                                {{else if v.listingStatus == 3}}
                                <span class="layui-bg-blue hp-badge ml5 shopeePublish_status shopeePublish-inlist">中</span>
                                    {{if v.storeAcct}}
                                    <br/><span style="color:#FFC0CB;">{{v.storeAcct}}</span>
                                    {{/if }}
                                {{else if v.listingStatus == 4}}
                                <span class="layui-bg-blue hp-badge ml5 shopeePublish_status shopeePublish-inlist">下</span>
                                {{/if}}
                            </td>
                            <td colspan="8"  style="padding: 10px 0" class="colspan_td">
                              <table style='width: 100%'>
                                <tbody>
                                {{ each v.prodListingSubSkuShopees }}
                                {{if $index<5}}
                                    <tr>
                                {{else}}
                                <tr   class="myj-hide">
                                {{ /if }}
                                  <td width="160">
                                      <span>
                                          {{if $value.sSku}}
                                              {{ $value.sSku }}
                                          {{else}}
                                              <font class="layui-gray">不存在</font>
                                          {{/if}}
                                      </span>
                                      {{if $value.listingStatus == 0}}
                                      <span class="layui-bg-orange hp-badge ml5 shopeePublish-unlist">待</span>
                                      <span class="layui-hide shopeePublish-unlistreason">{{v.listingRespMsg}}</span>
                                      {{else if $value.listingStatus == 1}}
                                      <span class="layui-bg-green hp-badge ml5">已</span>
                                      {{else if $value.listingStatus == 2}}
                                      <span class="layui-bg-gray hp-badge ml5">败</span>
                                      {{else if $value.listingStatus == 3}}
                                      <span class="layui-bg-blue hp-badge ml5">中</span>
                                      {{else if $value.listingStatus == 4}}
                                      <span class="layui-bg-blue hp-badge ml5">下</span>
                                      {{/if}}
                                  </td>
                                  <td class="storeSubSkuInfo">{{ $value.storeSSku }}</td>
                                  <td>{{ $value.color }}</td>
                                  <td>{{ $value.size }}</td>
                                  <td>
                                      {{if null==$value.sale}}
                                      {{else if $value.sale}}
                                    <span class="layui-green">在售</span>
                                    {{else}}
                                    <span class="layui-gray">停售</span>
                                    {{/if}}
                                  </td>
                                  <td>{{ (($value.stockNum || 0) - ($value.reservationNum || 0))  + '/' + ($value.orderNotInNum || 0) + '/' + ($value.lackUnPaiNum || 0) }}</td>
                                  <td class="failInfo">
                                    {{if $value.listingStatus == -1}}
                                    <span class="layui-yellow">待生成</span>
                                    {{else if $value.listingStatus == 0}}
                                    <span class="layui-orange">待刊登</span>
                                    {{else if $value.listingStatus == 1}}
                                    <span class="layui-green">刊登成功</span>
                                    {{else if $value.listingStatus==2 }}
                                    <span class="layui-gray">刊登失败</span>
                                    {{else if $value.listingStatus==3 }}
                                    <span class="layui-skyblue">刊登中</span>
                                      {{else if $value.listingStatus==4 }}
                                      <span class="layui-skyblue">已下架</span>
                                    {{/if}}
                                  </td>
                                </tr>
                                {{ /each }}
                                </tbody>
                              </table>
                              {{  if(v.prodListingSubSkuShopees && v.prodListingSubSkuShopees.length > 5)}}
                              <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuShopees.length}})</a>
                              {{/if}}
                            </td>
                            <td class="failInfo">
                                {{ if v.listingRespMsg  }}
                                <span>{{v.listingRespMsg }}</span>
                                {{else}}
                                {{ each v.prodListingSubSkuShopees }}
                                {{ if $index==1}}
                                <span>{{ $value.listingRespMsg }}</span>
                                {{/if}}
                                {{ /each }}
                                {{/if}}
                            </td>
                            <td class="timeClass">
                                  <div class="auditTime">
                                      {{if v.auditTime}}
                                      <span class="layui-green">审核于:{{v.auditTime| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{/if}}
                                  </div>
                                  <div class="listingTime">
                                      {{if v.listingTime}}
                                      <span class="layui-green">刊登于:{{v.listingTime| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{/if}}
                                  </div>
                                  <div class="listTiming">
                                      {{if v.listTiming}}
                                      <span class="layui-green">定时:{{v.listTiming| Format 'yyyy-MM-dd hh:mm'}}</span>
                                      {{else}}
                                      <span class="layui-green">刊登中</span>
                                      {{/if}}
                                  </div>
                            </td>
                            <td class="creator">
                              {{v.creator}}
                            </td>
                            <td>
                              <div class="detailInfoBtn"><button  type="button" class="layui-btn layui-btn-xs mb3" onclick="getlistingDetail_shopeePublish('{{v.id}}')">详情</button><br></div>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接</button><br>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态</button><br>
                              <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="producttpl_getTraslation('{{v.prodPId }}','cht')" dataid="{{v.prodPId }}">刊登翻译</button><br>
                              <div class="shopeePublish_publishBtn"><button  type="button" class="layui-btn layui-btn-xs mb3  layui-btn-warm" onclick="shopeeListingPublish('{{v.id}}')">发布上架</button><br></div>
                              <button  type="button" class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn" dataid="{{v.prodPId}}">开发思路</button><br>
                              <%--设置想刊登/不想刊登--%>
                                {{if v.mackListingType == 0}}
                                <button type="button" class="layui-btn layui-btn-xs mb3 "
                                        onclick="shopeeProductMackListingType('{{v.pSku}}','{{v.prodPId}}' ,'{{v.mackListingType}}')">取消不想刊登
                                </button><br>
                                {{/if}}
                                {{if !v.mackListingType || v.mackListingType == ''}}
                                <button type="button" class="layui-btn layui-btn-xs mb3 "
                                        onclick="shopeeProductMackListingType('{{v.pSku}}','{{v.prodPId}}' ,'{{v.mackListingType}}')">设置不想刊登
                                </button><br>
                                {{/if}}
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
<script type="text/html" id="shopeePulish_listDetailTpl">
  <div class="layui-fluid">
    <div class="layui-row">
      <div class="layui-col-lg12 layui-col-md12">
        <form action="" class="layui-form" id="shopeePublish_editDetailForm">
            <input hidden name="listingId" value="{{d.prodListingShopee.id}}">
            <input hidden name="storeAcctId" value="{{d.prodListingShopee.storeAcctId}}">
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">店铺父SKU:</label>
              <div class="layui-input-block">
                <input name="storePSku" data-sku="{{d.prodPInfo.pSku||''}}" value="{{d.prodListingShopee.storePSku}}" type="text" class="layui-input">
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
              <label class="layui-form-label">刊登标题:</label>
              <div class="layui-input-block">
                <input name="name"  value="{{d.prodListingShopee.name||''}}" type="text" class="layui-input">
              </div>
            </div>
          </div>
          <div calss="layui-card">
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">产品描述:</label>
                <div class="layui-input-block">
                    <textarea name="description" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingShopee.description}}</textarea>
                   <%-- <div id="shopeePublish_wangEditor">
                        {{# if( d.prodListingShopee.description.indexOf('div')==1 ){ }}
                            {{d.prodListingShopee.description}}
                        {{# }else{ }}
                            <div>{{d.prodListingShopee.description}}</div>
                        {{# } }}

                    </div>--%>
                </div>
            </div>
          </div>
          <div calss="layui-card">
              <label class="layui-form-label">类目选择:</label>
              <div class="layui-input-block">
                  <button id="shopeePublish_cateIdBtn" type="button"
                          class="layui-btn layui-btn-normal layui-btn-sm">选择shopee分类
                  </button>
                  <button id="shopeePublish_cateRecomm" class="layui-btn layui-btn-primary layui-btn-sm"
                          type="button">
                      <i class="layui-icon layui-icon-search"></i>
                  </button>
                  <h4 id="shopeePublish_cateText" style="display: inline;"></h4>
              </div>
              <input id="shopeePublish_cateId" name="categoryId" value="{{d.prodListingShopee.categoryId}}" type="hidden">
            </div>
          <!--<div calss="layui-card">-->
                <!--<label class="layui-form-label">类目属性:</label>-->
                <!--<div class="layui-input-block">-->
                    <!--<input name="atributes"  value="{{d.prodListingShopee.attributes}}" type="text" class="layui-input" disabled>-->
                <!--</div>-->
          <!--</div>-->
          <div calss="layui-card">
              <label class="layui-form-label">类目属性:</label>
                  <div id="shopeePublish_detail_atributes" style="border:3px solid #000">
              </div>
          </div>



          <div class="layui-card">
            <div class="layui-card-header">图片</div>

            <div class="layui-card-body">
              <div id="img_content">
                <table>
                  <tbody>
                  <td style="vertical-align:top;">
                    <div id="shopeePublish_mainImg">
                      <div class="ImgDivIn" style="height:300px;width: 280px">
                        <input type="hidden" name="mainImg" value="{{d.mainImage}}">
                        <img style="height:260px;width: 260px" src="{{GlobalDomainImgSrc(d.mainImage)}}" >
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="waterFirstPic_shopeePublish()">首图水印</button>
                      <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="addExtPic_shopeePublish()">网络图片</button>
                      <div style="float:left" class="shopeePublish_extPic_edit_local"></div>
                    </div>
                    <div class="pull-left" id="img_num">
                      <div class="p0">
                        <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                          <span class="layui-bg-red">说明！</span>
                          <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                          <span class="fColor2 mLeft10">「辅图最多选用<span id="maxImgNum" class="fRed">8</span>张，已经选用了<span id="shopeePublish_curImgNum" class="fGreen">{{d.extImages.length}}</span>张辅图」</span>
                        </div>
                      </div>
                    </div>
                    <div id="">
                      <ul id="shopeePublish_extImg">
                        {{#  layui.each(d.extImages, function(index, prodImage){ }}
                        <li draggable="false" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                          <div class="ImgDivOut">
                            <div class="ImgDivIn" style="width:150px;height:150px;">
                              <input type="hidden" name="extImg" value="{{prodImage}}">
                              <img width="150" height="150" src="{{GlobalDomainImgSrc(prodImage)}}" >
                            </div>
                            <div class="imgDivDown" style="width:150px">
                              <a onclick="setMainImg_shopeePublish(this);" href="javascript:void(0);" style="float:left;
      color: #73a1bf;">设为主图</a>
                              <a onclick="delImg_shopeePublish(this);" href="javascript:void(0);" style="float:right;
      color: #73a1bf;">移除</a>
                            </div>
                          </div>

                        </li>
                        {{#  }); }}
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
              </div>
              <div class="layui-card-body" style="display:flex">

                  <button onclick="shopeePublish_UpdateSku()" type="button" class="layui-btn layui-btn-sm">
                      使用商品SKU
                  </button>
                  <label class="layui-form-label">sku后缀批量</label>
                  <div style="width:80px">
                      <select name="sufixSetType" id="shopeePublish_sufixSetType"
                              lay-filter="shopeePublish_sufixSetType">
                          <option value="1">添加</option>
                          <option value="2">替换</option>
                          <option value="3">删除</option>
                      </select>
                  </div>
                  <input style="width:120px" type="text" class="layui-input" name="originalsku">
                  <div class="shopeePublish_replacehide disN">
                      <label class="layui-form-label">替换为</label>
                      <input type="text" class="layui-input" name="newsku" style="width:120px">
                  </div>
                  <button type="button" class="layui-btn layui-btn-sm layui-btn-normal"
                          onclick="shopeePublish_batchSetSkuSufix(this)">批量设置后缀
                  </button>
                      <button type="button" style="width:120px"
                              class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-normal disN"
                              onclick="addShopeeSubListing()">
                          添加一行
                      </button>
                      <button type="button"
                              class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-warm disN"
                              onclick="shopeeListingPublish_updatePrice()">
                          更新价格
                      </button>
                      <input style="width:120px" type="text" class="layui-input addShopeeSubListing"
                             placeholder="批量修改尺寸_颜色">
                      <button type="button"
                              class="addShopeeSubListing layui-btn layui-btn-sm layui-btn-normal disN"
                              onclick="shopeePublishFailColorSize(this)">
                          应用
                      </button>
              </div>
          </div>
            <div class="layui-card-body">
              <table class="layui-table">
                <thead>
                <tr>
                  <th hidden>id</th>
                  <th>图片</th>
                  <th>店铺SKU</th>
                  <th>尺寸_颜色</th>
                  <th>样式</th>
                  <th>刊登价格</th>
                  <th>刊登数量</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody id="shopeePublish_SubSkuInfo">
                {{#  layui.each(d.subSkuShopeeDtos, function(index, subSkuShopeeDto){ }}
                <tr>
                  <td hidden>{{subSkuShopeeDto.id}}</td>
                  <td>
                      <img width="60" height="60" data-original="{{GlobalDomainImgSrc(subSkuShopeeDto.subImgUrl)}}"  src="{{GlobalDomainImgSrc(subSkuShopeeDto.subImgUrl)}}"  class="shopeePublish_subImgUrl img_show_hide lazy b1">
                  </td>
                  <td class="shopeeStoreSSku"><input name="storeSSku" type="text" data-ssku="{{subSkuShopeeDto.sSku||''}}" class="layui-input" value="{{subSkuShopeeDto.storeSSku}}"></td>
                  <td><input type='text' class="layui-input shopeePublish_subColorSize" value='{{subSkuShopeeDto.name}}'></td>
                  <td><input type='text' class="layui-input shopeePublish_subStyle" value="{{subSkuShopeeDto.nameStyle || ''}}"></td>
                  <td>
                      <input type='number' class="layui-input" value='{{subSkuShopeeDto.price}}'>
                  </td>
                  <td><input type='number' class="layui-input" value='{{subSkuShopeeDto.stock}}'></td>
                    <td>
                       {{# if(subSkuShopeeDto.prodTempId){ }}
                        <button type="button" class="layui-btn layui-btn-sm" onclick="tpl_listReferPrice('{{subSkuShopeeDto.prodTempId}}')" >估价</button>
                        {{#  } }}
                        {{# if(subSkuShopeeDto.listingStatus==1 || subSkuShopeeDto.listingStatus==3||d.subSkuShopeeDtos.length==1){ }}
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled" >移除</button>
                        {{# }else{ }}
                        <button type="button" class="layui-btn layui-btn-sm" onclick="removeShopeeSubListing(this)">移除</button>
                        <button type="button" class="layui-btn layui-btn-sm" onclick="shopeePublish_editVarPic(this)">修改图片</button>
                        <span class="layui-btn layui-btn-sm" onclick="shopeePublish_deleteVarPic(this)">移除图片</button>
                        {{# } }}
                    </td>
                </tr>
                {{#  }); }}
                </tbody>
              </table>
                  </div>
        </form>
      </div>
    </div>
</div>
</script>

<script>
    // //多选渲染函数
    // function select_multi(name, arr) {
    //     var formSelects = layui.formSelects
    //     formSelects.render({
    //         name: name, //xm-select的值
    //         type: 2, //select样式为checkbox
    //         data: {
    //             arr: arr,
    //             name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
    //             val: 'value'
    //         }
    //     })
    // }

    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        //属性多选
        formSelects.data('selectAttr_shopee','local',
            {arr:[
                    <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                    {name: '${logisAttrEnum.getName()}',value: '${logisAttrEnum.getName()}'},
                    {name: '不含 ${logisAttrEnum.getName()}',value: 'no_${logisAttrEnum.getName()}'},
                    </c:forEach>
                ]}
        )
        //商品归属人多选
        formSelects.data('selectMan_shopee','local',
            {arr:[
                    <c:forEach items="${bizzOwners}" var="bizzOwner">
                    {name: '${bizzOwner.userName}', value: '${bizzOwner.id}'},
                    </c:forEach>
                ]}
        )
    })
</script>

<!--定时刊登-->
<script type="text/html" id="shopeePulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_listTimingForm">
            <div class="layui-form-item">
                <label class="layui-form-label">定时刊登开始时间:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="shopeePulish_listTiming" name="listTiming" autocomplete="off" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">listing刊登间隔(分):</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="listInterval" autocomplete="off">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">刊登时间段:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="shopeePulish_canPublish_listTiming" name="canPublishListTiming" autocomplete="off" readonly>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">自动分配促销:</label>
                <input type="checkbox" lay-filter="shopeePulish_autoProm_filter"  name="autoProm" lay-skin="switch" lay-text="开启|关闭">
            </div>
            <div class="layui-form-item shopeePulish_show_promotionIdList disN">
                <label class="layui-form-label">促销活动</label>
                <div class="layui-input-block">
                    <select name="promotionIdList" xm-select="stortAcctPromotionList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                    </select>
                </div>
            </div>

            <div class="layui-form-item shopeePulish_show_promotionId">
                    <label class="layui-form-label">促销活动</label>
                    <div class="layui-input-block">
                        <select lay-search  name="stortAcctPromotion">
                            <option value="">不促销</option>
                        </select>
                    </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">自动分配捆绑销售:</label>
              <input type="checkbox" lay-filter="shopeePulish_autoBundleDeal_filter"  name="autoBundleDeal" lay-skin="switch" lay-text="开启|关闭">
            </div>
            <div class="layui-form-item shopeePulish_show_bundleDealIdList disN">
              <label class="layui-form-label">捆绑销售</label>
              <div class="layui-input-block">
                  <select name="bundleDealIdList" xm-select="stortAcctBundleDealList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                  </select>
              </div>
            </div>
            <div class="layui-form-item shopeePulish_show_bundleDealId">
              <label class="layui-form-label">捆绑销售</label>
              <div class="layui-input-block">
                  <select lay-search  name="stortAcctBundleDeal">
                      <option value="">不促销</option>
                  </select>
              </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="shopeePulish_publishNowTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_publishNowForm">
            <div class="layui-form-item">
                    <label class="layui-form-label">促销活动</label>
                    <div class="layui-input-block">
                        <select lay-search  name="stortAcctPromotion">
                            <option value="">不促销</option>
                        </select>
                    </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">捆绑销售</label>
              <div class="layui-input-block">
                  <select lay-search  name="stortAcctBundleDeal">
                      <option value="">不捆绑销售</option>
                  </select>
              </div>
            </div>
        </form>
    </div>
</script>



<!-- 复制listing-->
<script type="text/html" id="shopeePulish_copyListingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <table class="layui-table">
                <tr>
                    <td>本次生成模板父SKU</td>
                    <td>店铺</td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <label id="shopeePublish_skusInfo"></label>
                        </div>
                    </td>
                    <td>
                        <div class="layui-input-block">
                            <select xm-select="copyStore_shopeePublish" name="copyStoreIds" xm-select-search
                                    xm-select-search-type="dl" xm-select-skin="normal">
                                {{# layui.each(d, function(index, storeInfo){ }}
                                <option value="{{storeInfo.id}}">{{storeInfo.storeAcct}}</option>
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</script>

<!--刊登前水印选择-->
<script type="text/html" id="shopeePulish_selWaterTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_selWaterForm">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="waterImageId" lay-search="" >
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="waterFontId" lay-search="" >
                </select>
            </div>
        </div>
    </form>
</script>


<!--商品--生成店铺商品2.0（api）弹框-->
<script type="text/html" id="shopeePulish_selWaterTp2">
    <form class="layui-form" id="shopeePulish_selWaterForm2" style="padding:20px;">
        <p style="padding: 10px;">注意：所选的数据在生成数据时</p>
        <p style="padding: 10px;"> 1.自动过滤具体店铺：未生成，未刊登</p>
        <textarea class="layui-textarea" name="shopName" placeholder="多个店铺，逗号分隔"></textarea>
    </form>
</script>


<script type="text/html" id="shopeePublish_cateSearchTpl">
    <div class="p10">
        <form id="shopeePublish_cateSearchForm" class="layui-form">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                    <label class="layui-form-label">关键字</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required="" <%--lay-verify="required"--%> placeholder="请输入标题"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="shopeePublish_cateSearchBtn">搜索</button>
                </div>
            </div>
        </form>
        <table id="shopeePublish_cateSearchTable"></table>
    </div>
</script>

<!--刊登商品设置选择-->
<script type="text/html" id="shopee_publish_Product_Mack_Listing_Type">
    <form class="layui-form" action="" lay-filter="component-form-group"
          id="shopee_publish_Product_Mack_Listing_Type_Form">
        <div style="text-align:center;padding:30px 0;">
<%--            <label class="layui-form-label" id="shopee_publish_product_mack_listing_show_txt"></label>--%>
            <span id="shopee_publish_product_mack_listing_show_txt"></span>
            <input id="shopee_pulish_p_sku_lising_type_text" type="hidden" name="pSku" class="layui-input" readonly>
            <input id="shopee_pulish_p_id_hidden_lising_type_text" type="hidden" name="prodId" class="layui-input" >
        </div>
    </form>
</script>

<script type="text/html" id="shopee_publish_prohibit_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopee_publish_prohibit_Table" lay-filter="shopee_publish_prohibit_Table"></table>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/publish.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script src="${ctx}/static/tagsinput/tagsinput.js"></script>

<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>