<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>以图搜图</title>
<style>
  .fullImg {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 10px 0px 40px;
      border: 1px dashed #ccc;
  }
  #cropImg {
      width: 150px;
      height: 150px;
      object-fit: contain;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
  }
  #developNew {
    position: absolute;
    left: 170px;
    top: 120px;
  } 
  #cropImg[src=''],
  #cropImg:not([src]) {
    width: 0;
    height: 0;
  }
  #cropImg:not([src]){
      opacity: 0;
  }
  .chooseBtn {
      position: absolute;
      bottom: 0;
      right: 0;
      /* width: 80px; */
      height: 20px;
      padding: 0 5px;
      font-size: 12px;
      line-height: 20px;
      background: rgb(241,158,75);
      color: #fff;
      cursor: pointer;
  }
  #croppingImg {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
  }
 
  .image-info {
      width: 100%;
      height: 400px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 30px;
      padding: 10px 45px;
      font-size: 12px;
      color: #000000;
      overflow-y: auto;
      box-sizing: border-box;
  }
  @media screen and (max-width: 1450px) {
    .image-info {
      height: 315px
    }
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
  .info-center {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
  }
  .pro-title,
  .pro-cate {
    width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .info-right {
      flex: 1;
      padding: 10px;
      position: relative;
      display: flex;
      flex-direction: column;
  }
  .image-content {
      width: 100%;
      height: 100px;
  }
  .info-item:last-child:nth-child(3n + 2) {
      margin-right: calc((100% - 32%) / 2);
  }
  .tag-status {
      position: absolute;
      width: 60px;
      height: 20px;
      /* padding: 0 9px; */
      font-size: 12px;
      line-height: 20px;
      right: 0px;
      text-align: center;
      background-color: rgb(236, 245, 255);
      border: 1px solid rgb(217, 236, 255);
      color: rgb(64, 158, 255);
      border-radius: 4px;
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
  .oa-status-danger {
    position: absolute;
    right: 0;
    height: 20px;
    padding: 0px 5px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    background-color: #ff784e;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
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
  .copySpan {
    line-height: 20px;
  }
  .color-grey {
    color: grey;
  }
  img[src=''],
  img:not([src]) {
    opacity: 0.4;
  }
  #edit-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

<div id="searchImageContainer" lay-filter="searchImageContainer"></div>


<script type="text/html" id="index1_searchImage_layer">
  <div id="searchIamgeForm" class="mt10">
      <form class="layui-form" onsubmit="return false;">
          <div class="layui-form-item">
              <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label">一级类目</label>
                  <div class="layui-input-block">
                      <select name="oaCate" lay-search></select>
                  </div>
              </div>
              <div class="layui-col-md4 layui-col-lg4" style="margin-left: 100px">
                  <label class="layui-form-label">图片链接</label>
                  <div class="layui-input-block">
                      <input name="imageUrl" class="layui-input" id="inputImageEl"></input>
                  </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3 ml10">
                  <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="searchImage(true, 'imageItemLayer')">搜图</button>
                  <button id="localUploadBtn" class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="uploadImage()">本地上传</button>
                  <button id="localUploadBtn" class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="handleCopy()">一键复制sku</button>
                  <!-- <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="handleSearchOrigin()">原图库搜索</button> -->

                  <input class="disN" type="file" accept="image/*" id="imgReader" onchange="loadingImg(event)"> 
                  <input class="disN" type="text" id="hideCopy"> 
              </div>
          </div>

         
          <div class="layui-form-item" style="margin-top: 20px">
              <div class="layui-col-md4 layui-col-lg4">
                  <label class="layui-form-label">产品来源</label>
                  <div class="layui-input-block">
                      <input type="checkbox" value="1" lay-skin="primary" name="original" lay-filter="search_img_chk" title="新品开发">
                      <input type="checkbox" value="2" lay-skin="primary" name="original" lay-filter="search_img_chk" title="商品列表">
                      <input type="checkbox" value="3" lay-skin="primary" name="original" lay-filter="search_img_chk" title="基础模板">
                      <input type="checkbox" value="4" lay-skin="primary" name="original" lay-filter="search_img_chk" title="侵权库">
                  </div>
                  <label class="layui-form-label">产品状态</label>
                  <div class="layui-input-block">
                      <input type="checkbox" value="1" other="2" lay-skin="primary" name="sale" lay-filter="search_img_chk" title="在售">
                      <input type="checkbox" value="0" lay-skin="primary" name="sale" lay-filter="search_img_chk" title="停售">
                  </div>
                  <label class="layui-form-label" style="margin-top:20px">商品链接</label>
                  <div class="layui-input-block" style="margin-top:20px;display: flex;">
                      <input type="text" class="layui-input" lay-skin="primary" name="prodUrl" lay-filter="search_img_prod_url">
                      <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" style="margin-left: 10px" onclick="checkRepeat(this, 'searchIamgeForm')">查重</button>
                  </div>
                  <div style="display: flex;">
                    <div class="disN repeatDev" style="margin-left: 45px;width: 80px">重复开发：</div>
                    <div class="disN repeatDev" style="flex: 1;">
                      <span class="pora copySpan">
                        <a class="repeatSku"></a>
                        <button style="left: 40px" class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                      </span>
                    </div>
                  </div>
              </div>

              <div class="layui-col-md6 layui-col-lg6" style="margin-left: 100px">
                <div style="display: flex;align-items: flex-end;">
                  <div class="fullImg">
                    <div in='innerImage' id="edit-img" style='width:150px;height:150px;' contenteditable="true">
                    
                    </div>
                    <img id="cropImg">
                    <div class="chooseBtn" onclick="croppingImage($(this))">
                        <img style="margin-right:2px" src="${ctx}/static/img/choose.png" />
                        框选主体
                    </div>
                  </img>
                  <button class="layui-btn layui-btn-sm layui-btn-normal disN" id="developNew" type="button" onclick="handleDevelopNew()">开发新品</button>
                </div>
              </div>
          </div>
      </form>

      <div id="imageInfoView">
        <div style="width: 100%;" class="image-info" id="imageInfo">
        </div>
      </div>
  </div>
</script>


<script type="text/html" id="index1_cropImage_layer">
  <div style="width: 100%;height: 400px;margin-top: 30px;text-align: center;">
      <img id="croppingImg" />
  </div>
</script>

<script type="text/html" id="imageItemLayer">
  {{# layui.each(d.data || [], function(index, item){ }}
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
            onmouseleave="removeTip(this)">{{ item.leafCategoryName }}</div>
            <div><span class="color-grey">开发:</span> {{ item.developName }} </div>
          {{# } }}
          {{# if(item.original == 2 || item.original == 3){ }}
            <div><span class="color-grey">责任:</span> {{ item.responseName }} </div>
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
<script src="${ctx}/static/UploadImage.js"></script>


<script type="text/javascript">
  function openDetail(prodPId,original,pSku) {
    if (original == 1) {
      // 新品开发点击商品名称打开开发详情
      newdevdetail_openDevDetail(prodPId,pSku, true)
    }
  }
  // 商品列表详情
  $('body').on('click', '#prodListDetail', function(event) {
    let id = $(this).attr('data-id')
    let pSku = $(this).attr('data-ssku')
    let isCombination = $(this).attr('data-combination')
    if (isCombination == 'false') {
      openProdListDetail({id, pSku});
    } else {
      openProdComDetail({id});
    }
  })
</script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/newdevDetail.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/combinationProdDetail.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/prodListDetail.jsp" %>



