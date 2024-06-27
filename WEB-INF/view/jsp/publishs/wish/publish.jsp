<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
        <title>wish刊登</title>
        <style>
            .showMultiRow {
                white-space: normal;
                word-break: break-all;
                word-wrap: break-word;
            }
            
            #wishPublish_extImg {
                overflow: hidden
            }
            
            #wishPublish_extImg li {
                float: left;
                margin-right: 10px
            }
            
            #wishPublish_searchForm .layui-form-item {
                margin-bottom: 0
            }
            
            td[class="colspan_td"]>table>tbody tr:first-child td {
                border-top: none;
            }
            
            td[class="colspan_td"]>table>tbody tr:last-child td {
                border-bottom: none;
            }
            
            td[class="colspan_td"]>table>tbody tr td {
                border-left: none;
                border-right: none;
                white-space: normal;
                word-wrap: break-word;
                word-break: break-all;
            }
            
            th,
            td {
                text-align: center
            }
            
            .dis_flex {
                display: flex;
                justify-content: space-between;
            }
            
            #wish_publish .layui-card-body {
                padding: 10px 0 10px 15px !important;
            }
            
            #wish_publish .layui-tab-content {
                padding: 10px 0 !important;
            }

            #wishPublish_table_body .wishPublish-listfail:hover {
                cursor: pointer;
            }
        </style>
        <div class="layui-fluid" id="wish_publish">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form action="" class="layui-form" id="wishPublish_searchForm">
                                <div class="layui-form-item layui-row">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select id="wishPublish_group_sel" name="orgId" lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom">
                                                    <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block">
                                            <select id="wishPublish_salesman_sel" name="sellerId" lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom" data-roleList="wish专员">
                                        </select>
                                        </div>
                                    </div>
                                    <input name="listingStatus" value="-2" type="hidden">
                                    <input name="shippingStatus" value="" type="hidden">
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select name="storeAcctId" data-platcode="wish" lay-filter="wishPublish_storeAcctId" lay-search class="store_hp_custom">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">选择类目</label>
                                        <div class="layui-input-block">
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="wishPublish_item">选择类目</button>
                                            <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-publishs-wish-publish-div','LAY-publishs-wish-publish-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                            <input type="hidden" id="LAY-publishs-wish-publish-hidden" name="cateId">
                                        </div>
                                    </div>

                                    <div class="layui-col-lg2 layui-col-md2">
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

                                    <div class="layui-col-lg2 layui-col-md2">
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

                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">物流属性</label>
                                        <div class="layui-input-block">
                                            <select xm-select="selectAttr_wish" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='selectAttr_wish'>
                                                <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                                                    <option value="${logisAttrEnum.getName()}">${logisAttrEnum.getName()}</option>
                                                    <option value='no_${logisAttrEnum.getName()}'>不含${logisAttrEnum.getName()}</option>
                                                </c:forEach>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">商品归属人</label>
                                        <div class="layui-input-block">
                                            <select xm-select="selectMan_wish" name="bizzOwnerIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                            <c:forEach items="${bizzOwners}" var="bizzOwner">
                                                <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                            </c:forEach>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">侵权状态</label>
                                        <div class="layui-input-block">
                                            <select name="tortBanListing">
                                            <%--<c:forEach items="${tortBanListings}" var="tortBanListing">--%>
                                                <%--<c:if test="${tortBanListing.getText() != '全部'}">--%>
                                                    <%--<option value="${tortBanListing.name()}">${tortBanListing.getText().replace("该平台","wish")}</option>--%>
                                                <%--</c:if>--%>
                                            <%--</c:forEach>--%>
                                                <option value="CURRENT_PLAT">wish不侵权</option>
                                                <option value="ANY_PLAT" selected>所有平台都不侵权</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">是否禁售</label>
                                        <div class="layui-input-block">
                                            <select name="isCanSale">
                                                <option value="true" selected>非禁售</option>
                                                <option value="false">禁售</option>
                                                <option value="" >全部</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">在售状态</label>
                                        <div class="layui-input-block">
                                            <select name="prodIsSaleStatus" xm-select="wishPublish_searchForm_prodIsSaleStatus" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option value="2" selected>全部在售</option>
                                                <option value="1" selected>部分在售</option>
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

                                    <div class="layui-col-lg2 layui-col-md2 disN">
                                        <label class="layui-form-label">是否促销</label>
                                        <div class="layui-input-block">
                                            <select name="isPromotion">
                                                <option value="false" selected>不促销</option>
                                                <option value="true">促销</option>
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
                                                                                                                    <input type="text" name="time" autocomplete="off" class="layui-input" id="wishPublishTime">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="layui-col-lg4 layui-col-md4">
                                                                                                                <div class="layui-form-label labelSel">
                                                                                                                    <select name="searchType" lay-filter="wishPublish_showHideVagueFlag">
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
                                                                                                                    <div id="wish_skuVagueFlag_div" class="layui-col-md3 layui-col-lg3">
                                                                                                                        <select name="skuVagueFlag">
                                            <option value="false">精确</option>
                                            <option value="true">模糊</option>
                                        </select>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                    <div class="layui-col-lg2 layui-col-md2" id="wishPublish_btn_stockType">
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
                                    <div class="layui-col-lg2 layui-col-md2" id="wishPublish_btn_needFilterStock">
                                        <label class="layui-form-label">库存</label>
                                        <div class="layui-input-block">
                                            <input type="checkbox" name="filterZeroStock" lay-skin="primary" title="过滤零库存">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" >
                                        <label class="layui-form-label">排序</label>
                                        <div class="layui-input-block">
                                            <select name="orderBy" id="wishPublish_orderBy">
                                            </select>
                                        </div>
                                    </div>
                                                                                                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                                                                                                <button class="layui-btn layui-btn-sm keyHandle" type="button" onClick="wishPublish_searchProd()" id="wishPublish_search">搜索</button>
                                                                                                                <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset" id="wishPublish_reset">清空
                                    </button>
                                                                                                            </div>
                                </div>
                            </form>
                            <div id="LAY-publishs-wish-publish-div"></div>
                        </div>
                    </div>
                    <div class="layui-card" id="wishPublishCard">
                        <div class="layui-card-body">
                            <div id="wish_btn_show_hide" style="position: absolute;right: 10px;z-index: 999;">
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="wishPublish_btn_genListing" onclick="wishPublish_genToListingProd()">生成店铺商品
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button" id="wishPublish_btn_delListing" onclick="wishPublish_deletelisting()">删除店铺商品
                                </button>
                                <div class="layui-input-inline w100 layui-form disN" id="wishPublish_div_selPubStyle">
                                    <select id="wishPublish_selPubStyle" lay-filter="wishPublish_selPubStyle_filter">
                                        <option value="" disabled selected>刊登</option>
                                        <option value="1">立即刊登</option>
                                        <option value="2">定时刊登</option>
                                    </select>
                                </div>
                                <button id="wishPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN" type="button" onclick="wishListing_canclePublishOnTiming()">取消定时刊登</button>

                                <button id="wishPublish_btn_pubNow" class="layui-btn layui-btn-sm disN" type="button" onclick="wishListingPublish('',false)">发布上架</button>
                                <button id="wishPublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger" type="button" onclick="wishPublish_exportskumapping()">导出SKU映射</button>

                                <button id="wishPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-primary disN" type="button" onclick="wishListingPublishOnTiming()">定时刊登</button>
                                <button id="wishPublish_btn_setShipping" class="layui-btn layui-btn-sm layui-btn-primary disN" type="button" onclick="wishListing_setShipping()">设置运费</button>
                                <button id="wishPublish_btn_rePubNow" class="layui-btn layui-btn-sm layui-btn-primary disN" type="button" onclick="wishListingPublish('',false)">重新发布</button>
                                <button type="button" id="wishPublish_btn_copyListing" class="layui-btn layui-btn-sm layui-btn-primary disN" onclick="wishPublish__copy_listing()">批量复制</button>
                            </div>
                            <div class="layui-tab" lay-filter="wishPublish_tab">
                                <ul class="layui-tab-title">
                                    <li data-value="-2" class="layui-this" id="totalNum">商品(0)</li>
                                    <li data-value="0" id="toListingNum">待刊登(0)</li>
                                    <li data-value="3" id="wish_listingNum">刊登中(0)</li>
                                    <li data-value="1" id="listingSucNum">刊登成功(0)</li>
                                    <li data-value="2" id="listingFailNum">刊登失败(0)</li>
                                    <li data-value="4" id="failSetShippingNum">运费设置失败(0)</li>
                                </ul>
                                <div class="layui-tab-content">
                                    <div id="wishPublish_table" lay-filter="wishPublish_table">
                                    </div>
                                    <div id="wishPublish_pagination" class="customPagination"></div>
                                    <!--模板文件-->
                                    <script type="text/html" id="wishPublish_tpl">
                                        <div class="wishPublish_table_head layui-table-header">
                                            <table class="layui-table">
                                                <colgroup>
                                                    <col width="3%" />
                                                    <col width="6%" />
                                                    <col width="20%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="2%" />
                                                    <col width="8%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="7%" />
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th width="30px">
                                                            <div class="layui-form">
                                                                <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                                                            </div>
                                                        </th>
                                                        <th>缩略图</th>
                                                        <th>标题</th>
                                                        <th>父SKU</th>
                                                        <%--<th class="storePSkuInfo">店铺父SKU</th>--%>
                                                        <th class="tortStatusInfo">侵权状态</th>
                                                        <th class="devNoteInfo">备注</th>
                                                        <th class="shippingInfo">运费设置状态</th>
                                                        <th class="shippingInfo">设置失败原因</th>
                                                        <th>
                                                            <%--<div class="layui-form">--%>
                                                                <%--<input type="checkbox" class="sid-all-cbox" lay-skin="primary">--%>
                                                                    <%--</div>--%>
                                                        </th>
                                                        <th>模板子SKU</th>
                                                        <th class="storeSubSkuInfo">店铺子SKU</th>
                                                        <th>颜色</th>
                                                        <th>尺寸</th>
                                                        <th class="listingInfo">售价($)</th>
                                                        <th>在售</th>
                                                        <th class="wishquantityInfo">预计可用库存含在途/不含在途</th>
                                                        <!--<th style="width: 60px" class="failInfo">状态</th>-->
                                                        <!--<th style="width: 200px" class="failInfo">失败原因</th>-->
                                                        <th>7/30天销量</th>
                                                        <th class="timeClass">时间</th>
                                                        <th>操作</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div class="wishPublish_table_body" style="margin-top: -2px">
                                            <table class="layui-table">
                                                <colgroup>
                                                    <col width="3%" />
                                                    <col width="6%" />
                                                    <col width="20%" />
                                                    <col width="14%" />
                                                    <col width="14%" />
                                                    <col width="2%" />
                                                    <col width="8%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="5%" />
                                                    <col width="7%" />
                                                </colgroup>
                                                <tbody id='wishPublish_table_body'>
                                                    {{ each data v i}}
                                                    <tr class="skus-tr tr{{v.id}}">
                                                        <td>
                                                            <div class="layui-form">
                                                                <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.id }} name="id">
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <img width="60" height="60"  data-original="{{GlobalDomainImgSrc(v.mainImgUri)}}" class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
                                                        </td>
                                                        <td>
                                                            {{ v.title }}<br/>
                                                            <span class="layui-gray listingSuccInfo pora copySpan">
                                             <a  target="_blank" style="color:blue" href="https://www.wish.com/c/{{ v.storeProdPId }}">{{ v.storeProdPId }}</a>
                                             <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                                        </span>
                                                        </td>
                                                        <td>
                                                            <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue;text-align: left">商品：{{ v.pSku }}</a>
                                                            <div class="storePSkuInfo">店铺：{{ v.storePSku }}</div>
                                                            {{if v.onlinePublishStatus}}
                                                            <span class="layui-bg-green">已刊登</span> <br/> {{/if}} {{if v.existListing}}
                                                            <span class="layui-bg-orange">已生成</span> {{/if}}
                                                            <br/> {{if (v.listingAble == false || v.listingAble == 'false')}}
                                                            <span class="layui-bg-gray hp-badge ml5">禁</span> {{/if}} {{ if v.selfImgStatus == '1' }}
                                                            <span class="hp-badge layui-bg-blue">自</span> {{ /if}} {{ if v.isSupplierOrigiImg == true}}
                                                            <span class="hp-badge layui-bg-blue">供</span> {{ /if}} {{ if v.devType == 'wish开发' }}
                                                            <span class="hp-badge layui-bg-blue fr">W</span> {{ /if}} {{ if v.devType == 'ebay开发' }}
                                                            <span class="hp-badge layui-bg-blue fr">Eb</span> {{ /if}} {{ if v.devType == 'SMT开发' }}
                                                            <span class="hp-badge layui-bg-blue fr">smt</span> {{ /if}} {{ if v.devType == '阿里销量产品'}}
                                                            <span class="hp-badge layui-bg-blue fr">AL</span> {{ /if}} {{ if v.devType == '供应商新品' }}
                                                            <span class="hp-badge layui-bg-blue fr">新</span> {{ /if}} {{ if v.devType == '产品库开发' }}
                                                            <span class="hp-badge layui-bg-blue fr">库</span> {{ /if}} {{ if v.devType == 'ebay英国虚拟仓' }}
                                                            <span class="hp-badge layui-bg-blue fr">英</span> {{ /if}} {{ if v.devType == 'ebay澳洲虚拟仓' }}
                                                            <span class="hp-badge layui-bg-blue fr">澳</span> {{ /if}}
                                                            <br>
                                                            <span style="text-align: left;color:#999;font-size: 5px">{{ v.prodAttrList }}</span>
                                                        </td>
                                                        <td class="tortStatusInfo">
                                                            <div style="text-align:left;" class="layui-form">
                                                                {{if v.isWishTort}}
                                                                <input type="checkbox" checked disabled title="wish" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="wish" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.wishTortReason ? v.wishTortReason : ''}}</span>
                                                                <br> {{if v.isJoomTort}}
                                                                <input type="checkbox" disabled checked title="joom" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="joom" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.joomTortReason ? v.joomTortReason : ''}}</span>
                                                                <br> {{if v.isEbayTort}}
                                                                <input type="checkbox" disabled checked title="ebay" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="ebay" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.ebayTortReason ? v.ebayTortReason : ''}}</span>
                                                                <br> {{if v.isAmazonTort}}
                                                                <input type="checkbox" disabled checked title="amazon" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="amazon" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.amazonTortReason ? v.amazonTortReason : ''}}</span>
                                                                <br> {{if v.isSmtTort}}
                                                                <input type="checkbox" disabled checked title="smt" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="smt" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.smtTortReason ? v.smtTortReason : ''}}</span>
                                                                <br> {{if v.isShopeeTort}}
                                                                <input type="checkbox" disabled checked title="shopee" lay-skin="primary"> {{else}}
                                                                <input type="checkbox" disabled title="shopee" lay-skin="primary"> {{/if}}
                                                                <span class="w_50 inline_table hv20">{{ v.shopeeTortReason ? v.shopeeTortReason : ''}}</span>
                                                            </div>
                                                        </td>
                                                        <td class="devNoteInfo">
                                                            <div class="showMultiRow">
                                                                {{if (v.devNote !=null && v.devNote !="")}}
                                                                <span style="color:red">开发备注:{{ v.devNote }}</span><br/> {{/if}} {{if (v.wishSaleRemark !=null && v.wishSaleRemark !="")}}
                                                                <span style="color:blue">wish销售备注:{{ v.wishSaleRemark }}</span> {{/if}}
                                                            </div>
                                                        </td>
                                                        <td class="shippingInfo">
                                                            {{if v.shippingStatus == 0}}
                                                            <span class="layui-yellow">待设置</span> {{else if v.shippingStatus == 1}}
                                                            <span class="layui-green">设置成功</span> {{else if v.shippingStatus == 2}}
                                                            <span class="layui-gray">设置失败</span> {{/if}}
                                                        </td>
                                                        <td class="shippingInfo">
                                                            {{ v.shippingRespMsg }}
                                                        </td>
                                                        <td colspan="8" style="padding: 10px 0" class="colspan_td">
                                                            <table style='width: 100%' class="inner_table">
                                                                <colgroup>
                                                                    <col width="10%" />
                                                                    <col width="27%" />
                                                                    <col width="16%" />
                                                                    <col width="16%" />
                                                                    <col width="16%" />
                                                                    <col width="16%" />
                                                                </colgroup>
                                                                <tbody>
                                                                    {{ each v.prodListingSubSkuWishs }} {{if $index
                                                                    <5}} <tr>
                                                                        {{else}}
                                                                        <tr class="myj-hide">
                                                                            {{ /if }}
                                                                            <td>
                                                                                <div class="layui-form">
                                                                                    {{if $value.id != ''}}
                                                                                    <input type="checkbox" class="sid-cbox" lay-skin="primary" value={{$value.id}}> {{/if}}
                                                                                </div>
                                                                            </td>
                                                                            <td>

                                                                                <span>
                                                        {{if $value.sSku}}
                                                        {{ $value.sSku }}
                                                        {{else}}
                                                        <font class="layui-gray">不存在</font>
                                                        {{/if}}
                                                    </span> {{if $value.listingStatus == 0}}
                                                                                <span class="layui-bg-orange hp-badge ml5  wishPublish-unlist">待</span> {{else if $value.listingStatus == 1}}
                                                                                <span class="layui-bg-green hp-badge ml5 wishPublish-listsucc">已</span> {{else if $value.listingStatus == 2}}
                                                                                <span class="layui-bg-gray hp-badge ml5 wishPublish-listfail">败</span>
                                                                                <span class="layui-hide wishPublish-listfailreason">{{$value.listingRespMsg}}</span> {{else if $value.listingStatus == 3}}
                                                                                <span class="layui-bg-blue hp-badge ml5 wishPublish-inlist">中</span> {{/if}}
                                                                            </td>
                                                                            <td class="storeSubSkuInfo">{{ $value.storeSSku }}</td>
                                                                            <td>{{ $value.color }}</td>
                                                                            <td>{{ $value.size }}</td>
                                                                            <td class="listingInfo">{{ $value.price }}</td>
                                                                            <td>
                                                                                {{if null==$value.isSale}} {{else if $value.isSale}}
                                                                                <span class="layui-green wishPublish-isSale">在售</span> {{else}}
                                                                                <span class="layui-gray wishPublish-isNotSale">停售</span> {{/if}}
                                                                            </td>
                                                                        <td class="wishquantityInfo">{{ ($value.preAvailableStockAll==undefined?'':$value.preAvailableStockAll) + '/' + ($value.preAvailableStock==undefined?'':$value.preAvailableStock) }}</td>
<%--                                                                        <td>{{ (($value.stockNum || 0) - ($value.reservationNum || 0))  + '/' + ($value.orderNotInNum || 0) + '/' + ($value.lackUnPaiNum || 0) }}</td>--%>
                                                                            <!--<td style="width: 60px" class="failInfo">-->
                                                                            <!--{{if $value.listingStatus == -1}}-->
                                                                            <!--<span class="layui-yellow">待生成</span>-->
                                                                            <!--{{else if $value.listingStatus == 0}}-->
                                                                            <!--<span class="layui-orange">待刊登</span>-->
                                                                            <!--{{else if $value.listingStatus == 1}}-->
                                                                            <!--<span class="layui-green">刊登成功</span>-->
                                                                            <!--{{else if $value.listingStatus==2 }}-->
                                                                            <!--<span class="layui-gray">刊登失败</span>-->
                                                                            <!--<button class="layui-btn layui-btn-xs" onclick="wishPublish_deletelisting('{{$value.id}}')">删除</button>-->
                                                                            <!--{{else if $value.listingStatus==3 }}-->
                                                                            <!--<span class="layui-skyblue">刊登中</span>-->
                                                                            <!--{{/if}}-->
                                                                            <!--</td>-->
                                                                            <!--<td style="width: 200px" class="failInfo">{{ $value.listingRespMsg }}</td>-->
                                                                        </tr>
                                                                        {{ /each }}
                                                                </tbody>
                                                            </table>
                                                            {{ if(v.prodListingSubSkuWishs && v.prodListingSubSkuWishs.length > 5)}}
                                                            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuWishs.length}})</a> {{/if}}
                                                        </td>
                                                        <td>
                                                            <div>Wish:{{v.wishSevenDaysSalesNum}}/{{v.wishThirtyDaysSalesNum}}</div>
                                                            <div>全平台:{{v.platSevenDaysSalesNum}}/{{v.platThirtyDaysSalesNum}}</div>
                                                            <div>SMT:{{v.smtSevenDaysSalesNum}}/{{v.smtThirtyDaysSalesNum}}</div>
                                                        </td>
                                                        <td class="timeClass">
                                                            <div class="auditTime">
                                                                {{if v.auditTime}}
                                                                <span class="layui-green">审核于:{{v.auditTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span> {{/if}}
                                                            </div>
                                                            <div class="listingTime">
                                                                {{if v.listingTime}}
                                                                <span class="layui-green">刊登于:{{v.listingTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span> {{/if}}
                                                            </div>
                                                            <div class="listTiming">
                                                                {{if v.listTiming}}
                                                                <span class="layui-green">定时:{{v.listTiming| dateFormat 'yyyy-MM-dd hh:mm'}}</span> {{else}}
                                                                <span class="layui-green">刊登中</span> {{/if}}
                                                            </div>
                                                        </td>
                                                        <td style="width: 100px">
                                                            <div class="detailInfoBtn"><button type="button" class="layui-btn layui-btn-xs mb3" onclick="wishPublish__layer_wish('{{v.id}}')">详情</button><br></div>
                                                            <button type="button" class="layui-btn layui-btn-xs mb3" onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接</button><br>
                                                            <button type="button" class="layui-btn layui-btn-xs mb3" onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态</button><br>
                                                            <div class="publishBtn"><button type="button" class="layui-btn layui-btn-warm  layui-btn-xs mb3" onclick="wishListingPublish('{{v.id}}',false)">发布上架</button><br></div>
                                                            <button type="button" class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn" dataid="{{v.prodPId}}">开发思路</button><br>
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
        <script type="text/html" id="wishPulish_listDetailTpl">
            <div class="layui-fluid">
                <div class="layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form action="" class="layui-form" id="wishPublish_editDetailForm">
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">店铺父SKU:</label>
                                    <div class="layui-input-block">
                                        <input name="storePSku" readonly value="{{d.prodListingWish.storePSku}}" type="text" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">刊登标题:
                                <button id="wishPublish_upcase" type="button" class="layui-btn layui-btn-xs" onclick="wishpublish_upCaseTitle()">
                                    首字母大写
                                </button>
                            </label>
                                    <div class="layui-input-block">
                                        <input name="title" value="{{d.prodListingWish.title}}" type="text" class="layui-input ifFocusInput" data-prodpid="{{d.prodListingWish.prodPId}}">
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">产品描述:</label>
                                    <div class="layui-input-block">
                                        <textarea name="prodDesc" type="text" class="layui-textarea" style="height: 250px">{{d.prodListingWish.prodDesc}}</textarea>
                                    </div>
                                </div>
                            </div>
                            <div calss="layui-card">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">Wish Tags:<br>
                                <span class="layui-badge layui-bg-blue">数量:<i class="tagsinputNum">0</i></span><br>
                            </label>
                                    <div class="layui-input-block">
                                        <div class="tagsinput-primary form-group">
                                            <input type="text" name="tag" value="{{d.prodListingWish.tag}}" data-role="tagsinput" />
                                        </div>
                                        <%--<input name="tag"  value="{{d.prodListingWish.tag}}" type="text" class="layui-input">--%>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-card">
                                <div class="layui-card-header">图片</div>

                                <div class="layui-card-body">
                                    <div id="img_content" class="layui-form" lay-filter="wishPublish_imgContent">
                                        <table>
                                            <tbody>
                                                <td style="vertical-align:top;">
                                                    <div id="wishPublish_mainImg">
                                                        <div class="ImgDivOut">
                                                            <div class="ImgDivIn" style="height:300px;width: 280px">
                                                                <input type="hidden" name="mainImg" value="{{d.mainImage}}">
                                                                <img style="height:260px;width: 260px" src="{{GlobalDomainImgSrc(d.mainImage)}}"  onerror="layui.admin.img_noFind()">
                                                                <input type="checkbox" name="cleanImgCheck" lay-skin="primary" title="清晰" lay-filter="wishPublish_cleanImgCheck_filter">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <button type="button" class="layui-btn layui-btn-sm" onclick="wishPublish_addExtPic()">网络图片</button>
                                                        <div class="wishPublish_mainImg_edit_local" style="float:right;"></div>
                                                    </div>
                                                    <div class="pull-left" id="img_num">
                                                        <div class="p0">
                                                            <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                                                <span class="layui-bg-red">说明！</span>
                                                                <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                                                <span class="fColor2 mLeft10">「辅图和子sku最多共选用<span id="maxImgNum" class="fRed">20</span>张，已经选用了<span id="curImgNum">{{d.extImages.length}}</span>张辅图,<span id="sSkuImgNum"></span>张子sku图」</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="">
                                                        <ul id="wishPublish_extImg">
                                                            {{# layui.each(d.extImages, function(index, prodImage){ }}
                                                            <li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                                                <div class="ImgDivOut">
                                                                    <div class="ImgDivIn" style="width:150px;height:150px;">
                                                                        <input type="hidden" name="extImg" value="{{prodImage}}">
                                                                        <img width="150" height="150" src="{{GlobalDomainImgSrc(prodImage)}}"  onerror="layui.admin.img_noFind()">
                                                                    </div>
                                                                    <div class="imgDivDown" style="width:150px">
                                                                        <a onclick="setMainImg(this);" href="javascript:void(0);" style="float:left;
      color: #73a1bf;">设为主图</a>
                                                                        <a onclick="delImg(this);" href="javascript:void(0);" style="float:right;
      color: #73a1bf;">移除</a>
                                                                    </div>
                                                                    <div class="imgDivCheck" style="width:150px">
                                                                        <input type="checkbox" name="cleanImgCheck" lay-skin="primary" title="清晰" lay-filter="wishPublish_cleanImgCheck_filter">
                                                                    </div>
                                                                </div>addWishSubListing

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
                                    <button type="button" class="addWishSubListing layui-btn layui-btn-sm layui-btn-normal fr disN" onclick="addWishSubListing()">
                                添加一行
                                </button>
                                    <button type="button" class="addWishSubListing layui-btn layui-btn-sm layui-btn-warm fr disN" onclick="wishListingPublish_updatePrice()">
                                更新价格
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
                                                <th>
                                                    <div class="dis_flex">
                                                        <input type="number" id="wishpublish_MSRP_input" class="layui-input">
                                                        <button type="button" id="wishpublish_MSRP_btn" class="layui-btn layui-btn-sm layui-btn-normal ml">修改MSRP</button>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div class="dis_flex">
                                                        <input type="number" id="wishpublish_price_input" class="layui-input">
                                                        <button type="button" id="wishpublish_price_btn" class="layui-btn layui-btn-sm layui-btn-normal ml">修改刊登价格</button>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div class="dis_flex">
                                                        <input type="number" id="wishpublish_number_input" class="layui-input">
                                                        <button type="button" id="wishpublish_number_btn" class="layui-btn layui-btn-sm layui-btn-normal ml">修改刊登数量</button>
                                                    </div>
                                                </th>
                                                <th>状态</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody id="wishPublish_SubSkuInfo">
                                            {{# layui.each(d.subSkuWishDtos, function(index, subSkuWishDto){ }}
                                            <tr>
                                                <td hidden>{{subSkuWishDto.id}}</td>
                                                <td width="5">
                                                    {{# if(subSkuWishDto.subImgUri){ }}
                                                    <img width="60" height="60" src="{{GlobalDomainImgSrc(subSkuWishDto.subImgUri)}}">
                                                    <a class="img_ssku_uri disN">{{subSkuWishDto.subImgUri}}</a> {{# }else{ }}
                                                    <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
                                                    <a class="img_ssku_uri disN"></a>
                                                    {{# } }}
                                                    <div class="wishPublish_subImgUri_edit_local"></div>
                                                    <div class="layui-btn layui-btn-xs wishPublish_subImgUri_edit_net" onclick="wishPublish_subImgUri_exchangeNet(this)" style="margin:5px;">网络图片</div><br/>
                                                    <div class="layui-btn layui-btn-xs layui-btn-primary wishPublish_subImgUri_edit_net" onclick="wishPublish_subImgUri_del(this)">删除图片</div>
                                                </td>
                                                <td>{{subSkuWishDto.storeSSku}}</td>
                                                <td><input type='text' class="layui-input" value='{{subSkuWishDto.size || ""}}' onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')"></td>
                                                <td><input type='text' class="layui-input" value='{{subSkuWishDto.color || ""}}' onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')"></td>
                                                <td><input type='number' class="layui-input" name="wishpublish_td_msrp" value='{{subSkuWishDto.msrp}}'></td>
                                                <td><input type='number' class="layui-input" name="wishpublish_td_price" value='{{subSkuWishDto.price}}'></td>
                                                <td><input type='number' class="layui-input" name="wishpublish_td_number" value='{{subSkuWishDto.stock}}'></td>
                                                <td>{{# if(subSkuWishDto.listingStatus==1){ }} 成功 {{# }else if(subSkuWishDto.listingStatus==2){ }} 失败 {{# }else if(subSkuWishDto.listingStatus==3){ }} 刊登中 {{# }else if(subSkuWishDto.listingStatus==0){ }} 待刊登
                                                    {{# } }}
                                                </td>
                                                <td>
                                                    {{# if(subSkuWishDto.prodSId){ }}
                                                    <a type="button" class="layui-btn layui-btn-xs" onclick="tpl_listReferPrice(   '{{subSkuWishDto.prodSId}}')">估价</a> {{# } }} {{# if(subSkuWishDto.listingStatus==1 || subSkuWishDto.listingStatus==3){
                                                    }}
                                                    <a type="button" class="layui-btn layui-btn-xs layui-btn-disabled">移除</a> {{# }else{ }}
                                                    <a type="button" class="layui-btn layui-btn-xs" onclick="removeWishSubListing(this)">移除</a> {{# } }}
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

        <script src="${ctx}/static/js/publishs/wish/publish.js"></script>
        <script src="${ctx}/static/jquery-ui.min.js"></script>
        <!--定时刊登-->
        <script type="text/html" id="wishPulish_listTimingTpl">
            <div class="p20">
                <form class="layui-form" action="" lay-filter="component-form-group">
                    <div class="layui-form-item">
                        <label class="layui-form-label">定时刊登开始时间:</label>
                        <div class="layui-input-block">
                            <input class="layui-input" id="wishPulish_listTiming" name="listTiming">
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

        <script type="text/html" id="wishPulish_copyListingTpl">
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
                                    <label id="wishPublish_skusInfo"></label>
                                </div>
                            </td>
                            <td>
                                <div class="layui-input-block">
                                    <select xm-select="copyStore_wishPublish" name="copyStoreIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
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

        <script src="${ctx}/static/tagsinput/tagsinput.js"></script>

        <script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
        <%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
            <script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
            <script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>
            <script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>