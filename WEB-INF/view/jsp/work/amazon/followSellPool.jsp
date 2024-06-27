<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>跟卖池</title>
<style>
    .b1 {
        border: 1px solid #ccc
    }

    .text_l {
        text-align: left;
    }

    .gray {
        color: gray;
    }

    .skyblue {
        color: skyblue;
    }

    .mg_20 {
        margin: 20px
    }

    .lh36 {
        line-height: 36px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .selectedLabel{
        padding:0px!important
    }

    .pd5{
        padding:5px;
    }

    .ml5{
        margin-left:5px
    }

    .fr{
        float: right;
    }
    .mg_20{
        margin:20px;
    }

    .hidden{
        display: none;
    }

    .t_head{
        width:25%;
        border-right:1px solid #e6e6e6;
        text-align: center;
    }

    .font_blue{
        color:skyblue!important;
    }
    .font_red{
        color:red!important;
    }

    .pointer{
        cursor: pointer;
    }
    .pageSort{
        display: block;
        width: 100%;
        background:#fff;
        position: fixed;
        left: 100px;
        bottom: 0;
    }
    .mt_5{
        margin-left: 0!important;
        margin-top:5px!important;
    }

    .w_80 {
        width: 80%!important;
    }
</style>

<div class="layui-fluid" id="LAY-AmazonFollowSellPool">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body" style="z-index:99999;">
                        <form class="layui-form" id="AmazonFollowSellPoolForm" lay-filter="AmazonFollowSellPoolForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select lay-filter="followSellPool_orgTree" class="orgs_hp_custom" lay-search></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                    <select lay-filter="followSellPool_userList" class="users_hp_custom" data-rolelist="amazon专员"  lay-search>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeAcctId" lay-filter="followSellPool_selAcct" class="store_hp_custom"
                                        data-platcode="amazon" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select name="salesSite" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="skuType">
                                            <option value="asinStr">子ASIN</option>
                                            <option value="parentAsinStr">父ASIN</option>
                                            <option value="title">标题</option>
                                            <option value="prodSSkuStr">商品sku</option>
                                            <option value="brandStr">品牌</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="skuValue" class="layui-input" placeholder="多个使用逗号分隔">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="timeType">
                                            <option value="创建时间">创建时间</option>
                                            <option value="审核时间">审核时间</option>
                                            <option value="更新时间">更新时间</option>
                                            <option value="分配时间">分配时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="time">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">品牌类型</label>
                                    <div class="layui-input-block">
                                        <select name="useType" lay-search>
                                            <option value="">全部</option>
                                            <option value="0">未注册</option>
                                            <option value="1">已注册</option>
                                            <option value="2">黑名单</option>
                                            <option value="-1">无品牌</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">购物车类型</label>
                                    <div class="layui-input-block">
                                        <select name="transType" lay-search>
                                            <option value="">全部</option>
                                            <option value="FBA">FBA</option>
                                            <option value="FBM">FBM</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">投诉次数</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="voteTotalTimesStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="voteTotalTimesEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="cateType">
                                            <option value="root">第一类目排名</option>
                                            <option value="leaf">第二类目排名</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="CateRankStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="CateRankEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="fsSellFailType">
                                            <option value="lastFsDesc" >跟卖失败原因</option>
                                            <option value="zeroFsDesc">0库存跟卖失败原因</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block dis_flex">
                                        <input type="text" name="fsSellFailVal" class="layui-input">
                                    </div>
                                </div>
                                <!-- <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">创建人</label>
                                    <div class="layui-input-block">
                                        <select name="creatorId" lay-search>
                                        </select>
                                    </div>
                                </div> -->
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="followSellPoll_person_search_type">
                                            <option value="creatorIdList">创建人</option>
                                            <option value="auditorIdList">审核人</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select xm-select="followSellPoll_person_search_select" name="followSellPoll_person_search_select" xm-select-search id="followSellPoll_person_search_select"
                                                xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <input type="hidden" name="limit" value="100">
                                <input type="hidden" name="page" value="1">
                                <input type="hidden" name="tableIndex" value="0">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">跟卖天数</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="inFollDaysStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="inFollDaysEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">计划名称</label>
                                    <div class="layui-input-block">
                                        <select name="planId"></select>
                                    </div>
                                </div>
                                <%--2020/09/17 新加购减预搜索条件--%>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">购减预</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="evalSubBuyStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="evalSubBuyEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">总成本</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="totalCostStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="totalCostEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">购物车价格</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="onlineCartPriceStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="onlineCartPriceEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">商品状态</label>
                                    <div class="layui-input-block">
                                        <select name="isSale" lay-search>
                                            <option value="">全部</option>
                                            <option value="true">在售</option>
                                            <option value="false">停售</option>
                                        </select>
                                    </div>
                                </div>
                                <!-- 分页表格名称 -->
                                <div class="layui-col-lg2 layui-col-md2" style="float: right;">
                                    <div class="layui-input-block fr">
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="AmazonFollowSellPoolSearch" lay-filter="AmazonFollowSellPoolSearch">查询
                                        </button>
                                        <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card" id="followSellPoolCard_head">
                    <div class="fixHigh" style="z-index:9999;">
                        <div class="layui-card-header">
                            <div class="fixTab">
                                <!-- 页签点击结构 -->
                                <div class="layui-tab" lay-filter="followSellPoolTab" id="followSellPoolTab">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" data-index="0">未分配店铺(<span>0</span>)</li>
                                        <li data-index="1">需要0库存跟卖(<span>0</span>)</li>
                                        <li data-index="2">准备跟卖(<span>0</span>)</li>
                                        <li data-index="3">正在跟卖(<span>0</span>)</li>
                                        <li data-index="4">执行中(<span>0</span>)</li>
                                        <li data-index="5">跟卖失败(<span>0</span>)</li>
                                        <li data-index="">全部(<span>0</span>)</li>
                                    </ul>
                                </div>
                                <!-- 下面的div放按钮,结构不要变化 -->
                                <div>
                                    <permTag:perm funcCode="followSellPool_export">
                                        <button type="button" class="layui-btn layui-btn-sm" id="followSellPool_exportBtn">导出</button>
                                    </permTag:perm>
                                    <permTag:perm funcCode="followSellPool_paramSet">
                                        <button class="layui-btn layui-btn-normal layui-btn-sm" id="setGlobalProfit">参数设置</button>
                                    </permTag:perm>
                                    <div id="followSellPoolbatchopt" class="layui-inline">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">批量操作</button>
                                        <ul class="hidden">
                                            <li data-event="matchStore">分配店铺</li>
                                            <li data-event="cancelMatchStore">取消分配店铺</li>
                                            <li data-event="FollowSell" class="disN">跟卖</li>
                                            <li data-event="cancelFollowSell" class="disN">取消跟卖</li>
                                            <li data-event="updateASIN">更新</li>
                                            <li data-event="setProfit">设置产品毛利</li>
                                            <li data-event="0stockfollow" class="disN">0库存跟卖</li>
                                            <li data-event="setPlan" class="disN">设置计划</li>
                                            <li data-event="cancelPlan" class="disN">取消计划</li>
                                            <li data-event="batchAudit" class="disN">批量审核</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-card-body" id="followSellPoolCard">
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <table class="layui-table" lay-filter="followSellPoolTable" id="followSellPoolTable"></table>
                                <div id="followSellPoolPage" class="pageSort"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/html" id="followSellPool_table_detailhd">
        <div class='dis_flex'>
        <div class='t_head' style="width:10%;">
            <input type="checkbox" class="layui-input"  lay-filter="allSChecked"  lay-skin="primary">
        </div>
        <div class='t_head' style="width:10%;">子ASIN</div>
        <div class='t_head' style="width:15%;">商品子sku</div>
        <div class='t_head' style="width:10%;">商品参数</div>
        <div class='t_head' style="width:10%;">操作结果</div>
        <div class='t_head' style="width:12%;">价格</div>
        <div class='t_head' style="width:10%;">毛利率</div>
        <div class='t_head' style="width:15%;">人员</div>
        <div class='t_head' style="width:8%;border-right:none">子操作</div>
        </div>
     </script>

    <script type="text/html" id="followSellPoolimgtpl">
        <div>
            <img width="60" height="60" data-original="{{d.parentImage||''}}" data-bigImg="{{d.bigParentImage||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">

        </div>
    </script>

    <script type="text/html" id="followSellPoolparentAsintpl">
        <div>
            <div>{{d.parentAsin||""}}</div>
            <div>[{{d.storeAcct||""}}][{{d.salesSite}}]</div>
            <div>跟卖天数:[{{d.inFsDays||"0"}}]</div>
        </div>
    </script>

    <script type="text/html" id="followSellPoolBrandtpl">
        <div class="text_l"> <div>{{d.brand||""}}<span  class="followSellPoll_voteTotalTimes" voteTotalTimes="{{d.voteTotalTimes||'0'}}">({{d.voteTotalTimes||"0"}})</span></div></div>
        {{# if(d.useType ==0){ }}
        <div class="text_l"><span>未注册</span></div>
        {{# } }}
        {{# if(d.useType ==1){ }}
        <div class="text_l"><span>已注册</span></div>
        {{# } }}
        {{# if(d.useType ==2){ }}
        <div class="text_l"><span>黑名单</span></div>
        {{# } }}
        {{# if(d.useType ==3){ }}
        <div class="text_l"><span>未检测</span></div>
        {{# } }}
    </script>

    <script type="text/html" id="followSellPoolRanktpl">
        <div class="text_l">
            <div><span class="gray">1:</span><span>{{d.rootCateRank||""}}</span></div>
            <div><span class="gray">2:</span><span>{{d.leafCateRank||""}}</span></div>
        </div>
    </script>

    <script type="text/html" id="followSellPoolDetail">
        {{# if(d.subList&&d.subList.length>0){ }}
             <table class="layui-table followSellPoolDetailtable" style="width:100%;text-align: center;color: #000;">
                 {{# layui.each(d.subList, function(index, item){ }}
                 {{# if(index < 100){ }}
                 <tr>
                     <td style="width:10%;" data-field="scheckRow">
                        <div class="layui-form"><input type="checkbox" class="layui-input" lay-skin="primary" value="{{item.id}}"></div>
                    </td>
                     <td style="width:10%;">
                        <div>
                            <div>
                            <span class="pora copySpan">
                                <a class="font_blue" href="{{item.asinSrc}}" target="_blank">{{item.asin||""}}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                            </span>
                            <span>({{item.zeroFsResult?'已':'未'}})</span>
                            </div>
                            <div>{{item.transType||""}}</div>
                        </div>
                    </td>
                     <td style="width:15%;" data-field="prodSSku">
                        <div data-id="{{item.prodPId}}" class="font_blue pointer">
                            <span class="pora copySpan">
                                <a class="font_blue">{{item.prodSSku||""}}</a>
                                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this,event)">复制</button>
                                      {{#  if(item.isSale == 0){ }}
                                        <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                                 {{#  } }}
                            </span>
                            <a class="font_red">*{{item.packNum}}</a>
                        </div>
                    </td>
                     <td style="width:10%;">
                        <div class="text_l">
                            <div><span>成本(￥):</span><span>{{item.totalCost||""}}</span></div>
                            <div><span>重量(g):</span><span>{{item.totalWeight||""}}</span></div>
                        </div>
                     </td>
                     <td style="width:10%;">
                         <div class="text_l">
                             {{# if(item.lastFsResult == -1){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}">跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 0){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color:#FF5722;">跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 1){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color: #009688;">跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 2){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color: #FFB800;">跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                         <div class="text_l">
                             {{# if(item.lastCancleResult == -1){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}">取消跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 0){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color:#FF5722 ;">取消跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 1){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color: #009688;">取消跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 2){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color: #FFB800;">取消跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                         <div class="text_l">
                             {{# if(item.zeroFsResult == -1){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}">0库存跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 0){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}" style="color: #FF5722;">0库存跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 1){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}" style="color: #009688;">0库存跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 2){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}" style="color: #FFB800;">0库存跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                     </td>
                     <td style="width:12%;">
                        <div class="text_l">
                            <div title="购物车价格"><span>box:</span><span>{{item.onlineCartPrice||""}}</span></div>
                            <div title="上次跟卖的价格"><span>价格:</span><span>{{item.listPrice||""}}</span></div>
                            <div title="根据当前毛利率算出来的预估刊登价"><span>刊登:</span><span>{{item.previewPrice||""}}</span></div>
                        </div>
                    </td>
                    <td style="width:10%;">
                        <div>
                            {{item.prodMinGross||""}}/{{item.prodStandardGross||""}}/{{item.prodMaxGross||""}}
                        </div>
                    </td>
                    <td style="width:10%;">
                        <div>
                            <div class="text_l"><span>创建:</span><span>{{item.creator}}</span></div>
                            <div class="text_l"><span>归属:</span><span>{{item.bizzOwner}}</span></div>
                           </div>
                    </td>
                    <td style="width:8%;" data-field="sTool">
                        <div>
                            <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" data-event="set" data-id="{{item.id}}" data-cartPrice="{{item.onlineCartPrice}}" data-currency="{{item.currency}}">设置</button>
                            <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" data-event="complaint" data-id="{{item.id}}" data-storeAcctId="{{d.storeAcctId}}" data-salesSite="{{item.salesSite}}" data-brand="{{item.brand}}" data-asin="{{item.asin}}">投诉</button>
                            <button type="button" data-field="sTool" data-site="{{item.salesSite}}" data-event="log" data-asin="{{item.asin}}" class="layui-btn layui-btn-xs layui-btn-primary mt_5">日志</button>
                        </div>
                    </td>
                 </tr>
                 {{# }else{ }}
                 <tr class="hidden expandrow">
                    <td style="width:10%;" data-field="scheckRow">
                        <div class="layui-form"><input type="checkbox" class="layui-input" lay-skin="primary" value="{{item.id}}"></div>
                    </td>
                     <td style="width:10%;">
                        <div><span>{{item.asin||""}}</span><span>({{item.zeroFsResult?'已':'未'}})</span></div>
                    </td>
                     <td style="width:15%;">
                        <div>
                            {{item.prodSSku||""}}
                            {{#  if(item.isSale == 0){ }}
                            <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                            {{#  } }}
                        </div>
                    </td>
                     <td style="width:10%;">
                        <div class="text_l">
                            <div><span>成本(￥):</span><span>{{item.totalCost||""}}</span></div>
                            <div><span>重量(g):</span><span>{{item.totalWeight||""}}</span></div>
                        </div>
                    </td>
                     <td style="width:10%;">
                         <div class="text_l">
                             {{# if(item.lastFsResult == -1){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}">跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 0){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color:#FF5722 ;">跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 1){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color: #009688;">跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.lastFsResult == 2){ }}
                             <span  lay-tips="{{item.lastFsDesc||''}}" style="color: #FFB800;">跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                         <div class="text_l">
                             {{# if(item.lastCancleResult == -1){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" >取消跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 0){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color:#FF5722 ;">取消跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 1){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color: #009688;">取消跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.lastCancleResult == 2){ }}
                             <span  lay-tips="{{item.lastCancleDesc||''}}" style="color: #FFB800;">取消跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                         <div class="text_l">
                             {{# if(item.zeroFsResult == -1){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}">0库存跟卖:(初始化)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 0){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}" style="color:#FF5722 ;">0库存跟卖:(失败)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 1){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}" style="color: #009688;">0库存跟卖:(成功)</span>
                             {{# } }}
                             {{# if(item.zeroFsResult == 2){ }}
                             <span  lay-tips="{{item.zeroFsDesc||''}}"  style="color: #FFB800;">0库存跟卖:(进行中)</span>
                             {{# } }}
                         </div>
                     </td>
                     <td style="width:12%;">
                        <div class="text_l">
                            <div><span>box:</span><span>{{item.onlineCartPrice||""}}</span></div>
                            <div><span>刊登:</span><span>{{item.previewPrice||""}}]</span></div>
                        </div>
                    </td>
                    <td style="width:10%;">
                        <div>
                            {{item.prodMinGross||""}}/{{item.prodStandardGross||""}}/{{item.prodMaxGross||""}}
                        </div>
                    </td>
                    <td style="width:10%;">
                        <div>
                            <div class="text_l"><span>创建:</span><span>{{item.creator}}</span></div>
                            <div class="text_l"><span>归属:</span><span>{{item.bizzOwner}}</span></div>
                           </div>
                    </td>
                    <td style="width:8%;">
                        <!-- <div>
                            <button type="button" class="layui-btn layui-btn-xs layui-btn-normal">设置</button> -->
                            <div>
                            <button type="button" data-field="sTool" data-site="{{item.salesSite}}" data-asin="{{item.asin}}" class="layui-btn layui-btn-xs layui-btn-primary">日志</button>
                           </div>
                        </div>
                    </td>
                </tr>
                 {{# } }}
                 {{# }) }}
             </table>
             {{# if(d.subList.length > 5){ }}
             <!-- <div class="expandAlltransferOrder" data-flag="close">展开</div> -->
             {{# } }}
        {{# } }}
     </script>

    <script type="text/html" id="followSellPooltoolTpl">
        <div>
            <!-- <button type="button" class="layui-btn layui-btn-xs layui-btn-normal">分配</button> -->
            <button type="button" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="followSellPoolparentLog">日志</button>
        </div>
    </script>

    <script type="text/html" id="followSellPoolMatchStorePop">
        <form class="layui-form mg_20" lay-filter="followSellPoolMatchStoreForm" id="followSellPoolMatchStoreForm">
            <div class="layui-form-item">
                <label class="layui-form-label">分配店铺</label>
                <div class="layui-input-block">
                    <select name="storeAcctId" lay-search></select>
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellPoolMatchStoreSubmit" id="followSellPoolMatchStoreSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="followSellPoolsetPlanPop">
        <form class="layui-form mg_20" lay-filter="followSellPoolsetPlanForm" id="followSellPoolsetPlanForm">
            <div class="layui-form-item">
                <label class="layui-form-label">设置计划</label>
                <div class="layui-input-block">
                    <select name="planId"></select>
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellPoolsetPlanSubmit" id="followSellPoolsetPlanSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="followSellPoolsetProfitPop">
        <form class="layui-form mg_20" lay-filter="followSellPoolsetProfitForm" id="followSellPoolsetProfitForm">
            <div class="layui-form-item">
                <label class="layui-form-label">定价毛利率</label>
                <div class="layui-input-block">
                    <input type="number" class="layui-input" name="subProdStandardGross">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">大小价毛利率</label>
                <div class="layui-input-block dis_flex">
                    <input type="number" class="layui-input" name="subProdMinGross">
                    <span> - </span>
                    <input type="number" class="layui-input" name="subProdMaxGross">
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellPoolsetProfitSubmit" id="followSellPoolsetProfitSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="followSellPoolevaluatPop">
        <form class="layui-form mg_20" lay-filter="followSellPoolevaluatForm" id="followSellPoolevaluatForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">购物车价</label>
                <div class="layui-input-block dis_flex">
                    <span id="cartPrice"></span>
                    <button type="button" lay-submit lay-filter="followSellPoolevaluat" id="followSellPoolevaluat" class="layui-btn layui-btn-xs layui-btn-normal">预估毛利率</button>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">预估定价</label>
                <div class="layui-input-block dis_flex">
                    <input type="number" class="layui-input w_80" name="price" lay-verify="required">
                    <span id="standardGross"></span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">最大定价</label>
                <div class="layui-input-block dis_flex">
                    <input type="number" class="layui-input w_80" name="maxPrice" lay-verify="required">
                    <span id="maxGross"></span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">最小定价</label>
                <div class="layui-input-block dis_flex">
                    <input type="number" class="layui-input w_80" name="minPrice" lay-verify="required">
                    <span id="minGross"></span>
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellPoolevaluatSubmit" id="followSellPoolevaluatSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="followSellPoolLogPop">
        <table lay-filter="followSellPoolLogTable" class="layui-table"
               id="followSellPoolLogTable"></table>
    </script>

    <script type="text/html" id="followpooladdComplaint_modify">
        <form class="layui-form mg_20" lay-filter="followpooladdComplaintForm" id="followpooladdComplaintForm">
            <div class="layui-form-item">
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                    <select name="storeAcctId" lay-search></select>
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                    <select name="salesSite"></select>
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">品牌</label>
                    <div class="layui-input-block">
                    <input type="text" class="layui-input" name="brand">
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">子ASIN</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="asin">
                    </div>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                    </div>
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followpooladdComplaintSubmit" id="followpooladdComplaintSubmit"></button>
        </form>
    </script>
    <script type="text/html" id="followSellPoll_auditProduct">
        <form class="layui-form mg_20" lay-filter="followSellPoll_auditForm" id="followSellPoll_auditForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">审核结果</label>
                <div class="layui-input-block">
                    <input type="radio" name="auditStatus" value="0" title="未审核">
                    <input type="radio" name="auditStatus" value="1" title="成功">
                    <input type="radio" name="auditStatus" value="2" title="失败">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">审核备注</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="auditRemark">
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellPoll_auditSubmit" id="followSellPoll_auditSubmit"></button>
        </form>
    </script>
    <script src="${ctx}/static/js/work/amazon/followSellPool.js"></script>