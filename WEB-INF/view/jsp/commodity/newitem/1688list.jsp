<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>1688榜单</title>
<style>
  .listContainer {
    padding: 20px;
  }
  .rankingDiv {
     width: 18%;
     /* height: 300px; */
     border: 1px solid #e6e6e6;
     float: left;
     margin: 10px;
     box-sizing: border-box;
     display: flex;
     flex-direction: column;
     /* justify-content: center; */
     align-items: center;
  }
  #cateRankingContent {
    height: 650px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
  }
  #paginationRanking {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }
  .itemImg {
    width: 80%;
  }
  .rankingTitle {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    
  }
  .bg-green-rank {
    background: #67c23a;
  }
  .bg-yellow-rank {
    background: #e6a23c;
  }
  .bg-red-rank {
      background: red;
  }
  .rankSearchImage {
    font-size: 12px;
    font-weight: bold;
    padding: 3px 5px;
    color: #ffffff;
    border-radius: 2px;
    cursor: pointer;
  }
  .color-grey {
      color: grey;
    }
  .data-text {
    font-weight: bold;
    padding-left: 5px;
  }
  .emptyData {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pro-title {
    width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }
  #image-container {
    /* max-height: 600px; */
    max-height: 480px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 30px 45px 10px;
    font-size: 12px;
    color: #000000;
    overflow-y: auto;
    box-sizing: border-box;
  }
  #copyBtn {
      padding: 5px 10px;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      background-color: rgb(64, 158, 255);
      color: #ffffff;
      border-radius: 4px;
      cursor: pointer;
  }
  .searchImage {
      font-size: 16px;
      float: right;
      font-weight: bold;
      padding: 3px 10px;
      color: #ffffff;
      border-radius: 4px;
      position: absolute;
      right: 0;
  }
  .disN {
      display: none;
  }
  .info-item {
      width: 32%;
      height: 140px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      box-shadow: 1px 1px 15px 1px #e7e3e3;
      box-sizing: border-box;
  }
  .info-left {
      width: 100px;
      display: flex;
      padding-left: 10px;
      align-items: center;
      justify-content: center;
  }
  .image-content {
      width: 100%;
      height: 100px;
  }
  .info-center {
      position: relative;
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
  }
  .info-right {
      flex: 1;
      padding: 10px;
      position: relative;
      display: flex;
      flex-direction: column;
  }
  .pro-title {
      width: 130px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
  }
  .title-tips,
  .title-tips-error {
      position: absolute;
      text-align: left;
      top: 0;
      width: 200px;
      padding: 10px;
      font-size: 14px;
      background: #e6a23c;
      color: #ffffff;
      white-space: wrap;
      border-radius: 4px;
      z-index: 99999;
  }
  .title-tips {
      left: 100px;
  }
  .title-tips-error {
      left: 70px;
  }
  .color-grey {
      color: grey;
  }
  .font-bold {
      font-weight: bold;
  }
  .tag-status {
      position: absolute;
      width: 60px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      right: 0px;
      text-align: center;
      background-color: rgb(236, 245, 255);
      border: 1px solid rgb(217, 236, 255);
      color: rgb(64, 158, 255);
      border-radius: 4px;
  }
  .disN {
      display: none;
  }
  .disFlex {
      display: flex;
  }
  .stop-tag {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background-color: rgb(255, 87, 34);
      border-radius: 4px;
      color: white;
      text-align: center;
      line-height: 20px;
  }
  .oa-status {
    position: absolute;
    right: 0;
    height: 20px;
    padding: 0px 5px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    background-color: rgb(64, 158, 255);
    color: #fff;
    border-radius: 4px;
  }

</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card listContainer">
        <div class="layui-card-body toFixedContain" style="display: flex;">
        </div>
        <div class="layui-tab-content" style="display: flex;">
          <div style="width: 300px;max-height: 700px;overflow-y: auto;">
            <ul id="rankingCateTree" class="ztree"></ul> 
          </div>
          <div style="flex: 1">
            <div style="float:left;" class="layui-tab" lay-filter="1688list_Tab" >
              <ul class="layui-tab-title fl" id="1688list_Tab">
                  <li class="layui-this tab_1688list" data-code="越南热销榜">越南热销榜</li>
                  <li class="tab_1688list" data-code="越南趋势榜">越南趋势榜</li>
                  <li class="tab_1688list" data-code="主播热卖榜">主播热卖榜</li>
                  <li class="tab_1688list" data-code="主播热推榜">主播热推榜</li>
                  <li class="tab_1688list" data-code="主播新兴榜">主播新兴榜</li>
                  <li class="tab_1688list" data-code="综合榜">综合榜</li>
                  <li class="tab_1688list" data-code="热销榜">热销榜</li>
                  <li class="tab_1688list" data-code="好价榜">好价榜</li>
              </ul>
            </div>
            <div style="float:right;">
              <form class="layui-form" id="1688list_form" style="display: flex;">
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <input type="checkbox" name="isOntheRanking" title="当前在榜单" lay-skin="primary" lay-filter="1688list_isOntheRankingFilter">
                    </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label">排序方式</label>
                  <div class="layui-input-block">
                      <select name="sortType" lay-filter="1688list_sortTypeFilter">
                        <option value="">排序方式</option>
                        <option value="1" selected>30天销量倒序</option>
                        <option value="2">30天买家数倒序</option>
                        <!-- <option value="p.id asc">上架时间倒序</option>
                        <option value="p.id asc">上架时间正序</option> -->
                      </select>
                  </div>
              </div>
              </form>
            </div>
            <div class="layui-row layui-col-space10">
              <div class="layui-col-md12 layui-col-lg12">
                <div id="cateRankingContent"></div>
                <div id="paginationRanking"></div>
              </div>
            </div>
          </div>
          </div>
      </div>
      </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/commodity/newitem/1688list.js"></script>

<script type="text/html" id="cateRankingDataLayer">
  {{# if(d.length > 0) { }}
    {{# layui.each(d, function(index, item){ }}
      <div class="rankingDiv">
        <div class="itemImg">
          <a href="https://detail.1688.com/offer/{{item.itemId}}.html" target="_blank">
            <img style="width: 100%" src="{{item.imgUrl}}" data-onerror="layui.admin.img_noFind()">
          </a>
        </div>
        <div style="padding: 5px">
          <div class="rankingTitle">{{item.title || ''}}</div>
          <div>{{item.namePath || ''}}</div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <span><span class="color-grey">评分：</span><span class="data-text">{{item.goodsScore || ''}}</span></span>
            <span class="layui-btn layui-btn-xs layui-btn-normal searchSupply" data-image="{{ item.imgUrl }}">查找货源</span>
          </div>
          <div><span class="color-grey">30天买家数: </span><span class="data-text">{{item.buyerNum || ''}}</span></div>
          <div><span class="color-grey">30天销量:</span> <span class="data-text">{{item.soldOut || ''}}</span></div>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <span>
              <span class="color-grey">更新: </span>
              <span style="padding-left: 5px">{{ Format(item.modifyTime, 'yyyy-MM-dd') }}</span>
            </span>
            <span class="searchImgStatus">
            </span>
          </div>
        </div>
      </div>
    {{# }) }}
  {{#} else { }}
    <div class="emptyData">暂无数据</div>
  {{# } }}
</script>

<script type="text/html" id="searchImagesLayer">
    <div style="display:flex;justify-content:flex-end;padding-right: 30px;padding-top: 10px">
      <div id="copyBtn">一键复制sku</div>
      <input class="disN" type="text" id="hideCopy"> 
    </div>
    <div id="image-container">
    </div>
</script>

<script type="text/html" id="imageItemLayer">
  {{# layui.each(d || [], function(index, item){ }}
    <div class="info-item">
      <div class="info-left">
          <img class="image-content img_show_hide" src="{{item.name}}" />
      </div>
      <div class="info-center">
        <div style="font-weight: bold" class="pro-title"
          onmouseover="showTip(`{{item.title || ''}}`, this)"
          onmouseleave="removeTip(this)" onclick="openDetail({{item.bizzId}}, {{item.original}})">
          {{# if((item.original == 1)){ }}
            <a style="cursor: pointer;color:cornflowerblue">{{ item.title || '' }}</a>
          {{# } else { }}
            <span>{{ item.title || '' }}</span>
          {{#} }}
        </div>

          <!-- 新品开发 1 商品列表 2 基础模板 3 侵权库 4  -->
          {{# if((item.original == 1 || item.original == 3) && item.psku){ }}
            <div style="display: flex">
              <span class="pora copySpan">
                {{# if(item.original == 1) { }}
                  <a name="psku">{{ item.psku || ''}}</a>
                {{# } }}
                {{# if(item.original == 3) { }}
                <a name="psku" id="prodDetail" style="cursor: pointer;color:cornflowerblue" data-id="{{item.bizzId}}">{{ item.psku || ''}}</a>
                {{# } }}
                <button style="left: 40px" class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
              </span>
              {{# if(item.isSale == 0){ }}
                <div class="stop-tag">停</div>
              {{# } }}
            </div>
          {{# } }}

          <!-- {{# if((item.original == 1 || item.original == 3)){ }}
          {{# } }} -->

          {{# if(item.original == 2 || item.original == 4){ }}
            <span class="pora copySpan">
              {{# if(item.original == 2) { }}
                <a name="psku" id="prodListDetail" style="cursor: pointer;color:cornflowerblue" data-id="{{ item.bizzId }}"
                data-ssku="{{ item.ssku }}" data-combination="{{ item.isCombination }}">{{ item.ssku || ''}}</a>
              {{# } }}
              {{# if(item.original == 4) { }}
                <a name="psku">{{ item.ssku || ''}}</a>
              {{# } }}
              <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
            </span>
            {{# if(item.original == 2 && item.isSale == 0){ }}
              <div class="stop-tag">停</div>
            {{# } }}
          {{# } }}

          {{# if(item.original !== 4){ }}
            <div class="pro-cate" onmouseover="showTip(`{{item.leafCategoryName || ''}}`, this)"
            onmouseleave="removeTip(this)">{{ item.leafCategoryName || '' }}</div>
            <div><span class="color-grey">开发:</span> {{ item.developName || '' }} </div>
          {{# } }}
          {{# if(item.original == 2 || item.original == 3){ }}
            <div><span class="color-grey">责任:</span> {{ item.responseName || '' }} </div>
          {{# } }}
          {{# if(item.original == 1 || item.original == 2 || item.original == 3){ }}
            <div><span class="color-grey">创建:</span> {{ Format(item.createTime, "yyyy-MM-dd hh:mm") }}</div>
          {{# } }}

          {{# if(item.original == 4){ }}
            <div><span class="color-grey">侵权原因:</span> {{ getReason(item.tortReason) }}</div>
            <div><span class="color-grey">侵权站点:</span> {{ getSite(item.tortSite) }}</div>
          {{# } }}
      </div>
      <div class="info-right">
          <div style="width: 100%;height: 24px;position: relative;">
              <div class="tag-status">
                {{# if(item.original == 1){ }}
                  新品开发
                {{# } }}
                {{# if(item.original == 2){ }}
                  商品列表
                {{# } }}
                {{# if(item.original == 3){ }}
                  基础模板
                {{# } }}
                {{# if(item.original == 4){ }}
                  侵权库
                {{# } }}
                
              </div>
          </div>
          <div style="width: 100%;height: 24px;position: relative;" class="info-right-lastbtn">
            {{# if(item.original == 1){ }}
              {{# if(item.oaStatus == '开发失败'){ }}
                  <div class="oa-status" onmouseout="removeTip(this)" onmouseenter="showTip(`初审备注:{{item.firstAuditNote || ''}}` + '<br>' + `组长审核备注:{{item.teamLeaderNote || ''}}`, this)">{{ item.oaStatus }}</div>
              {{# } else { }}
                  <div class="oa-status">{{ item.oaStatus }}</div>
              {{# } }}
            {{# } }}
          </div>
          
          <div style="flex: 1;display: flex;flex-direction: column;justify-content: space-around;">
            {{# if(item.original == 1 || item.original == 2 || item.original == 3){ }}
              {{# if(item.original == 2){ }}
                <div><span class="color-grey">成本(￥)</span>: {{ item.cost == undefined ? '' : item.cost }}</div>
                <div><span class="color-grey">毛重(g)</span>: {{ item.weight == undefined ? '' : item.weight }}</div>
              {{# } }}
              {{# if(item.original == 1 || item.original == 3){ }}
                {{# if(item.minCost !== item.maxCost){ }}
                  <div><span class="color-grey">成本(￥)</span>: {{ item.minCost == undefined ? '' : item.minCost }} - {{ item.maxCost == undefined ? '' : item.maxCost }}</div>
                {{# } }}
                {{# if(item.minCost == item.maxCost){ }}
                  <div><span class="color-grey">成本(￥)</span>:{{ item.minCost == undefined ? '' : item.minCost }}</div>
                {{# } }}

                {{# if(item.minWeight !== item.maxWeight){ }}
                <div><span class="color-grey">毛重(g)</span>: {{ item.minWeight == undefined ? '' : item.minWeight }} - {{ item.maxWeight == undefined ? '' : item.maxWeight }}</div>
                {{# } }}
                {{# if(item.minWeight == item.maxWeight){ }}
                  <div><span class="color-grey">毛重(g)</span>:{{ item.minWeight == undefined ? '' : item.minWeight }}</div>
                {{# } }}
                
              {{# } }}
              <div><span class="color-grey">30天销量:</span> {{ item.sales30th == undefined ? '' : item.sales30th }}</div>
            {{# } }}
          </div>
        </div>
    </div>
  {{# }) }}
  {{# if (d.searchImageList?.length == 0){ }}
    <div style="width: 100%; text-align: center; margin-top: 200px">暂无数据</div>
  {{# } }}
</script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script src="${ctx}/static/UploadImage.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/newdevDetail.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/prodListDetail.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/combinationProdDetail.jsp" %>