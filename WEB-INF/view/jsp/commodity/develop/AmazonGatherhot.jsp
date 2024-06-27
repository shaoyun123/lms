<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/5/19
  Time: 9:43
  To change this template use File | Settings | File Templates.
--%>
<!--采集爆款-->
<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>Amazon产品库</title>
<%--<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">--%>
<%--<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">--%>
<style>
    #AG_hot_tab_id .layui-tab-title li {
        padding: 0 9px;
    }

    .fieldBox {
        float: left;
        width: 20%;
        height: 25px;
        margin-top: 10px;
    }

    .fieldBox span {
        font-size: 18px;
    }

    #gh_detail_layer td .layui-table-cell {
        line-height: 26px;
    }

    .layuiCardHeader {
        background: #fff;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid" id="LAY-work-develop-amazongatherhot">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="amazongatherhot_searchForm" class="layui-form" lay-filter="amazongatherhot-form-group">
                        <input name="amazonlistingStatus" value="1" type="hidden">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="developmentId" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="site" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">月销量</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="monthlySalesMinStr" type="number" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input class="layui-input" name="monthlySalesMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">月销售额</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="monthlySalesCountMoneyMinStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="monthlySalesCountMoneyMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">价格</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="priceMinStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="priceMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">评分值</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="scoreMinStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="scoreMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">评分数</label>
                                <div class="layui-input-block dis_flex">
                                    <input class="layui-input" name="evaluationScoreMinStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    <input class="layui-input" name="evaluationScoreMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">配送方式</label>
                                <div class="layui-input-block">
                                    <select name="deliveryMode" lay-search>
                                        <option value="">全部</option>
                                        <option value="FBA">FBA</option>
                                        <option value="FBM">FBM</option>
                                        <option value="AMZ">AMZ</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" style="width: 70px;">热销标识</label>
                                <div class="layui-input-block" style="margin-left: 100px;">
                                    <input type="checkbox" name="checkbox" title="BR" lay-skin="primary" value="bestSellerSign">
                                    <input type="checkbox" name="checkbox" title="AC" lay-skin="primary" value="amazonChoiceSign">
                                    <input type="checkbox" name="checkbox" title="NR" lay-skin="primary" value="newReleaseSign">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel" style="width: 130px;">
                                    <select name="launchandupdate" lay-search>
                                        <option value="launchTime">产品上架时间 </option>
                                        <option value="updateTime">产品更新时间 </option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left: 160px;">
                                    <input class="layui-input" name="launchandupdatetime" id="test" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel" style="width: 110px;">
                                    <select name="RemarkName" lay-search>
                                        <option value="prejudgeRemark">预判备注</option>
                                        <option value="firstTrialRemark">初审备注</option>
                                        <option value="developmentRemark">开发备注</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left: 140px;">
                                    <input class="layui-input" name="RemarkData">
                                </div>
                            </div>
                        </div>
                            <div class="layui-form-item">

                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">变体数</label>
                                    <div class="layui-input-block dis_flex">
                                        <input class="layui-input" name="variantsNumbersMinStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                        <input class="layui-input" name="variantsNumbersMaxStr" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label labelSel">
                                        <select name="categoryName" lay-search>
                                            <option value="category">类目</option>
                                            <option value="title">标题</option>
                                            <option value="parentAsin">父ASIN</option>
                                            <option value="brand">品牌</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input class="layui-input" name="categoryData">
                                    </div>
                                </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="sortType" lay-search>
                                        <option value="1">产品更新时间倒序</option>
                                        <option value="2">月销量倒序</option>
                                        <option value="3">月销售额倒序</option>
                                        <option value="4">评分倒序</option>
                                        <option value="5">评分数倒序</option>
                                        <option value="6">价格倒序</option>
                                        <option value="7">类目正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <a class="layui-btn layui-btn-sm" id="agh_searchBtn">查询</a>
                                <button class="layui-btn layui-btn-sm" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="gatherhotCard">
                <div style="height:40px;line-height:40px;">
                    <div class="layui-card-header layuiCardHeader" id="layui-card-gatherhot">
                        <div class="layui-tab" lay-filter="agh_hot_tab" id="AG_hot_tab_id">
                            <ul class="layui-tab-title">
                                <li id="amazongatherhotTab1" data-value="1" class="layui-this">初始化（点击显示）</li>
                                <li id="amazongatherhotTab9" data-value="9">预判待定（点击显示）</li>
                                <li id="amazongatherhotTab2" data-value="2">预判可做（点击显示）</li>
                                <li id="amazongatherhotTab3" data-value="3">预判不做（点击显示）</li>
                                <li id="amazongatherhotTab4" data-value="4">初审通过（点击显示）</li>
                                <li id="amazongatherhotTab5" data-value="5">初审失败（点击显示）</li>
                                <li id="amazongatherhotTab6" data-value="6">开发中（点击显示）</li>
                                <li id="amazongatherhotTab7" data-value="7">开发成功（点击显示）</li>
                                <li id="amazongatherhotTab8" data-value="8">开发失败（点击显示）</li>
                                <li id="amazongatherhotTab0" data-value="0">全部（点击显示）</li>
                            </ul>
                        </div>
                        <div>
                            <button class="layui-btn layui-btn-sm" id="prejudgment_template_btn" style="display: none;">批量预判
                            </button>
                            <button class="layui-btn layui-btn-sm" id="import_template_btn">导入
                            </button>
                            <button class="layui-btn layui-btn-sm" id="development_template_btn" style="display: none;">批量分配开发
                            </button>
                        </div>
                    </div>
                </div>
                <div id="gh_prodCate" data-id="" style="font-size:10px ;display: none"></div>
                <div class="layui-card-body">
                    <table class="layui-table" id="agh_hotTable" lay-filter="agh_table-filter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 审核弹框 + 完成弹框 -->
<script type='text/html' id="gh_examineLayer">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="gh_form">
            <div class="layui-form-item">
                <label class="layui-form-label">侵权状态</label>
                <div class="layui-input-block">
                    <select name="tortStatus" lay-filter="aihao" lay-search>
                        <option value=""></option>
                        <%--<c:forEach items="${tortStatusEnums}" var="tortStatusEnum">--%>
                            <%--<option value="${tortStatusEnum.getCode()}">${tortStatusEnum.getValue()}</option>--%>
                        <%--</c:forEach>--%>
                        <option value="CURRENT_PLAT">amazon不侵权</option>
                        <option value="ANY_PLAT">所有平台都不侵权</option>
                        <option value="ALL">全部</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">开发状态</label>
                <div class="layui-input-block">
                    <select name="devStatus" lay-filter="aihao" lay-search>
                        <option value=""></option>
                        <c:forEach items="${devStatusEnums}" var="devStatusEnum">
                            <option value="${devStatusEnum.getCode()}">${devStatusEnum.getValue()}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">侵权品牌</label>
                <div class="layui-input-block">
                    <input type="text" name="tortBrand" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品父SKU</label>
                <div class="layui-input-block">
                    <input type="text" name="pSku" placeholder="只能填入一个商品父SKU且商品父SKU不可包含逗号" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="font-size:10px">不可开发原因</label>
                <div class="layui-input-block">
                    <select name="devFailReason" lay-filter="aihao" lay-search>
                        <option value=""></option>
                        <c:forEach items="${reasonMap}" var="item">
                            <option value="${item.value.name} ">${item.value.name} </option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="font-size:10px">审核备注</label>
                <div class="layui-input-block">
                    <textarea name="devNote" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="font-size:10px">开发备注</label>
                <div class="layui-input-block">
                    <textarea name="devRemark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<%--table--操作列--%>
<script type="text/html" id="agh_optionTpl">
    {{# if(d.operatingDtoList) { }}
    <div id="agh_optionTpl_con" style="text-align: left;">
        {{# layui.each(d.operatingDtoList, function(index, item){     }}
            <input type="radio" name="operatingDtoListname{{d.id}}" radioFlag="0" value="{{item.value}}" title="{{item.name}}" lay-filter="operatingDtoList{{d.id}}">
        {{# });  }}
        <div class="dis_flex" style="padding: 7px 0;">
            {{# if(d.processStatus == 1) { }}
        <input type="radio" name="operatingDtoListname{{d.id}}" radioFlag="1" value="3"  title="" lay-filter="operatingDtoList{{d.id}}">
            {{# } }}
            {{# if(d.processStatus == 2||d.processStatus == 3||d.processStatus == 5) { }}
            <input type="radio" name="operatingDtoListname{{d.id}}" radioFlag="1" value="5"  title="" lay-filter="operatingDtoList{{d.id}}">
            {{# } }}
        <input name="operatingDtoList_input" aghOptionTplId="{{d.id}}" aghOptionTplAsin="{{d.asin}}"  style="border: none;border-bottom: 1px solid #bbb;width: 60px;position: absolute;margin-top: 2px;margin-left: 30px;" value="">
        </div>
    </div>
    {{# } }}
</script>

<%--table--图片列--%>
<script type="text/html" id="agh_imageTpl">
    {{# if(d.pageASign) { }}
    <div style="text-align: left;">
    <a type="button" class="layui-btn layui-btn-xs layui-btn-danger"
       style="height:18px;line-height:18px;">A+</a>
    </div>
    {{# } }}
    {{# if(d.mainImage) { }}
    <div>
        <img width="60" height="60" data-original="{{ d.mainImage }}" data-bigImg="{{ amazonImgConversion(d.mainImage,500) }}" class="img_show_hide lazy b1"
             data-onerror="layui.admin.img_noFind()">
    </div>
    {{#  } }}
    {{# if(d.bestSellerSign) { }}
    <a type="button" class="layui-btn layui-btn-xs layui-btn-warm"
       style="height:18px;line-height:18px;right:5px;bottom:0;">BS</a>
    {{# } }}
    {{# if(d.amazonChoiceSign) { }}
    <a type="button" class="layui-btn layui-btn-xs"
       style="height:18px;line-height:18px;right:5px;bottom:0;background-color:#393D49;">AC</a>
    {{# } }}
    {{# if(d.newReleaseSign) { }}
    <a type="button" class="layui-btn layui-btn-xs layui-btn-danger"
       style="height:18px;line-height:18px;right:5px;bottom:0">NR</a>
    {{# } }}
</script>

<%--table--产品信息列--%>
<script type="text/html" id="agh_titleTpl">
<div style="text-align: left">
    <span class="pora copySpan " style="word-break: break-all; white-space: normal;color:#999;">
          标题：<a href="javascript:;">{{ d.title }}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                  onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span class="pora copySpan">
       <span style="color:#999;">父ASIN：</span><a href="javascript:;">{{ d.parentAsin }}</a>
       <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span class="pora copySpan">
       <span style="color:#999;">子ASIN：</span><a target="_blank" href="{{ d.asinUrl }}" style="color: #1E9FFF;">{{ d.asin }}</a>
       <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span class="pora copySpan">
       <span style="color:#999;">品牌：</span><a href="javascript:;">{{ d.brand }}</a>
       <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
</div>
</script>

<%--table--站点类目排名--%>
<script type="text/html" id="agh_developerTpl">
    {{# if(d.site) { }}
    <span style="color:#999;">站点:</span>{{d.site}}<br>
    {{# } }}
    {{# if(d.category) { }}
    <span style="color:#999;">类目:</span>{{d.category}}<br>
    {{# } }}
    {{# if(d.bsrRanking) { }}
    <span style="color:#999;">BSR排名:</span>{{d.bsrRanking}}<br>
    {{# } }}
</script>

<%--table--价格销量--%>
<script type="text/html" id="agh_listing_Tpl">
    {{# if(d.price) { }}
    <span style="color:#999;">价格({{d.currency}}):</span>{{d.price}}<br>
    {{# } }}
    {{# if(d.fbaFreight) { }}
    <span style="color:#999;">FBA运费:</span>{{d.fbaFreight}}<br>
    {{# } }}
    {{# if(d.variantsNumbers) { }}
    <span style="color:#999;">变体数:</span>{{d.variantsNumbers}}<br>
    {{# } }}
    {{# if(d.monthlySales) { }}
    <span style="color:#999;">月销量:</span>{{d.monthlySales}}<br>
    {{# } }}
    {{# if(d.monthlySalesCountMoney) { }}
    <span style="color:#999;">月销售额:</span>{{d.monthlySalesCountMoney}}<br>
    {{# } }}
</script>

<%--table--评分购物车--%>
<script type="text/html" id="agather_hot_title_tpl">
    {{# if(d.score) { }}
    <span style="color:#999;">评分值:</span>{{d.score}}<br>
    {{# } }}
    {{# if(d.evaluationScore) { }}
    <span style="color:#999;">评分数:</span>{{d.evaluationScore}}<br>
    {{# } }}
    {{# if(d.site) { }}
    <span style="color:#999;">购物车:</span>{{d.buyBoxSellerNationality}} - {{d.deliveryMode}}<br>
    {{# } }}
</script>

<%--table--产品时间--%>
<script type="text/html" id="agh_timeTpl">
    <span style="color:#999;">添加:</span>{{ Format( d.createTime, "yyyy-MM-dd")}}<br>
    <span style="color:#999;">上架:</span>{{ Format( d.launchTime, "yyyy-MM-dd")}}<br>
    <span style="color:#999;">更新:</span>{{ Format( d.lastUpdateTime, "yyyy-MM-dd")}}<br>
</script>

<%--table--人员--%>
<script type="text/html" id="agather_hot_productInfo_tpl">
    {{# if(d.prejudgePerson) { }}
    <span style="color:#999;">预判:</span>{{d.prejudgePerson}}<br>
    {{# } }}
    {{# if(d.firstTrialPerson) { }}
    <span style="color:#999;">初审:</span>{{d.firstTrialPerson}}<br>
    {{# } }}
    {{# if(d.assignmentPerson) { }}
    <span style="color:#999;">分配:</span>{{d.assignmentPerson}}<br>
    {{# } }}
    {{# if(d.developmentPerson) { }}
    <span style="color:#999;">开发:</span>{{d.developmentPerson}}<br>
    {{# } }}
</script>

<%--table--备注--%>
<script type="text/html" id="agh_sales_Tpl">
    {{# if(d.prejudgeRemark) { }}
    <span style="color:#999;">预判:</span>{{d.prejudgeRemark}}<br>
    {{# } }}
    {{# if(d.firstTrialRemark) { }}
    <span style="color:#999;">初审:</span>{{d.firstTrialRemark}}<br>
    {{# } }}
    {{# if(d.developmentRemark) { }}
    <span style="color:#999;">开发:</span>{{d.developmentRemark}}<br>
    {{# } }}
</script>

<%--table--其他操作--%>
<script type="text/html" id="AG_editBar">
    {{# if( d.processStatus == 2 ){ }}
        <a type="button" class="layui-btn layui-btn-xs" lay-event="resetStatusY">重新预判</a><br>
    {{# } }}
    {{# if( d.processStatus == 4 ){ }}
    <a type="button" class="layui-btn layui-btn-xs" lay-event="resetStatusC">重新初审</a><br>
    {{# } }}
    {{# if( d.processStatus == 4 ||d.processStatus == 6 ){ }}
    <a type="button" class="layui-btn layui-btn-xs" lay-event="editBarDevBtn">分配开发</a><br>
    {{# } }}
    {{# if(d.processStatus == 6){ }}
    <a type="button" class="layui-btn layui-btn-xs" lay-event="editBarErrorBtn">开发失败</a><br>
    {{# } }}
    <a type="button" class="layui-btn layui-btn-xs" lay-event="editBarLogBtn">操作日志</a>
</script>

<%--操作日志--%>
<script type="text/html" id="agh_detailLayer_2">
    <!-- 日志详情 -->
    <div id="amazongatherhot_operationLog_new"></div>
</script>

<!-- 弹出模态框 -->
<!-- listing历史 -->
<script type="text/html" id="agh_operlogTpl">
    <table class="layui-table">
        <thead>
        <tr>
            <th>Asin</th>
            <th>创建时间</th>
            <th>创建人</th>
            <th>原始状态</th>
            <th>新状态</th>
            <th>操作结果</th>
            <th>操作人</th>
        </tr>
        </thead>
        <tbody>
        {{# layui.each(d, function(index, item){ }}
        <tr>
            <td>{{ item.asin || '' }}</td>
            <td>{{ layui.admin.Format( item.createTime, "yyyy-MM-dd hh:mm:ss")}}</td>
            <td>{{ item.createName || '' }}</td>
            <td>{{ item.oldProcessStatus || '' }}</td>
            <td>{{ item.newProcessStatus || '' }}</td>
            <td>{{ item.operResult || '' }}</td>
            <td>{{ item.operPerson || '' }}</td>
        </tr>
        {{# }); }}
        {{# if(d.length === 0){ }}
        无日志
        {{# } }}

        </tbody>
    </table>
</script>
<!--分配开发-->
<script id="allotdeveloperLayer" type="text/html">
        <form class="layui-form" style="margin: 25px;" id="allotdeveloperLayersel">
            <select lay-search="" name="development" lay-search>
                <option value=""></option>
            </select>
        </form>
</script>
<!--批量预判-->
<script id="prejudgeOperatingListid" type="text/html">
    <form class="layui-form" style="margin: 25px;" id="prejudgeOperatingListform">
    </form>
</script>
<script src="${ctx}/static/js/work/develop/AmazonGatherhot.js"></script>
