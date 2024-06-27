<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>仓库拍图</title>
<style>
  #warehousepictureCard .tal {
    text-align: left;
  }
  .img-wrap {
    position: relative;
    width: 15%;
    padding-top: 15%;
    margin: 5px 0;
  }
  .img-box {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    /* border: 1px dashed #ccc; */
  }
  .img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .pic-container-flex {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 20px 10px;
    justify-content: space-between;
  }
</style>


<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="warehousepictureSearchForm">
            <div class="layui-form-item">
                <div class="layui-col-md2 layui-col-lg2">
                  <div class="layui-form-label labelSel">
                      <select name="timeSearchType">
                          <option value="1">需求时间</option>
                          <option value="2">测量时间</option>
                      </select>
                  </div>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" autocomplete="off" name="times" id="warehousepicture_times" readonly>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSel">
                        <select name="personSearchType" lay-filter="personSearchType">
                            <option value="1">需求人</option>
                            <option value="2">测量人</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="personName" list="personName">
                        <datalist id="personName">
                        </datalist>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSel">
                        <select name="skuSearchType">
                            <option value="1">父SKU(模糊)</option>
                            <option value="2">子SKU(模糊)</option>
                            <option value="3">父SKU(精确)</option>
                            <option value="4">子SKU(精确)</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="skuSearchValue" placeholder="精确查询支持多个,英文逗号分割">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">需求类型</label>
                    <div class="layui-input-block">
                        <select name="requireType"
                          id="warehousepicture_measureType"
                          xm-select="warehousepicture_measureType"
                          xm-select-search
                          xm-select-skin="normal"
                          xm-select-search-type="dl"
                        >
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">模版名称</label>
                  <div class="layui-input-block">
                      <select name="printTemplateId" lay-search id="warehousepicture_tplId">
                        <option value=""></option>
                      </select>
                  </div>
              </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">排序</label>
                    <div class="layui-input-block">
                        <select name="orderType">
                            <option value="1">需求时间正序</option>
                            <option value="2">需求时间倒序</option>
                        </select>
                    </div>
                </div>
                <input type="hidden" value="0" name="processStatus">
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">仓库</label>
                  <div class="layui-input-block">
                      <select name="warehouseId" class="warehouseId" lay-search lay-filter="warehousepicture_warehouseId"></select>
                  </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">楼栋</label>
                  <div class="layui-input-block">
                      <select name="buildNo" class="buildNo" id="warehousepicture_buildNo" xm-select="warehousepicture_buildNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                      </select>
                  </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">楼层</label>
                    <div class="layui-input-block">
                        <select name="floorNo" class="floorNo" id="warehousepicture_floorNo" xm-select="warehousepicture_floorNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                  <label class="layui-form-label">拍图人</label>
                  <div class="layui-input-block">
                      <select name="photographer" id="warehousepicture_photographer" lay-search></select>
                  </div>
              </div>
                <div class="layui-col-md12 layui-col-lg12">
                   <span class="layui-btn layui-btn-sm layui-btn-normal fr" lay-submit lay-filter="warehousepicture_submit">
                      查询
                    </span>
                </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="warehousepictureCard">
          <div class="layui-card-header toFixedContain">
              <!-- 页签点击结构 -->
              <div class="layui-tab" lay-filter="warehousepicture_tabs"
                   id="warehousepicture_tabs">
                  <ul class="layui-tab-title fl">
                      <li class="layui-this">待拍图<span data-index="0"></span></li>
                      <li>已拍图<span data-index="1"></span></li>
                      <li>取消<span data-index="2"></span></li>
                      <li>已拍作废<span data-index="3"></span></li>
                      <li>全部<span data-index="4"></span></li>
                  </ul>
                  <div class="fr">
                      <span class="layui-btn layui-btn-sm layui-btn-normal warehousepicture_deleteAndReset" style="display: none;" data-status="0">
                          恢复
                        </span>
                        <span class="warehousepic_btn layui-btn layui-btn-sm layui-btn-danger warehousepicture_deleteAndReset" data-status="2">
                          取消
                        </span>
                        <span class="warehousepic_btn layui-btn layui-btn-sm layui-btn-danger" id="warehousepicture_invalidRequireBtn" style="display: none;">
                          作废重拍
                        </span>
                        <span class="warehousepic_btn layui-btn layui-btn-sm layui-btn-normal" id="warehousepicture_add">
                            新增
                          </span>
                      <span class="warehousepic_btn layui-btn layui-btn-sm" id="warehousepicture_batchDown">
                          下载图片
                        </span>
                        <span class="layui-btn layui-btn-sm" id="warehousepicture_export">
                          导出
                        </span>
                  </div>
              </div>
          </div>
        <!-- 下面放表格 -->
        <div class="layui-card-body">
            <table class="layui-table" id="warehousepicture_table"  lay-filter="warehousepicture_tableFilter"></table>
        </div>
      </div>
    </div>
  </div>
</div>

<%-- 表格-图片 --%>
<script type="text/html" id="warehousepicture_productImage">
    {{#  if(d.image){ }}
    <img width="60" height="60" data-original="{{ d.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 表格---需求类型 --%>
<script type="text/html" id="warehousepicture_requireTypeTable">
    <div>
        {{# if(d.requireType==1){ }}
        <span>AE自营</span>
        {{# }else if(d.requireType==2){ }}
        <span>TEMU</span>
        {{# }else if(d.requireType==3){ }}
        <span>直邮</span>
        {{# }else if(d.requireType==4){ }}
        <span>AE欧盟资质</span>
        {{# }else if(d.requireType==5){ }}
        <span>SHEIN</span>
        {{# } }}
    </div>
</script>
<%-- 表格-sku --%>
<script type="text/html" id="warehousepicture_sku">
    <div class="tal">
        <div>
          父：
          <span class="pora copySpan">{{d.pSku || ""}}</span>
          <span onclick="layui.admin.onlyCopyTxt('{{d.pSku}}')" style="display: {{d.pSku ? 'inline-block':'none'}}" class="copy-icon">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
          </span>
        </div>
        <div>子：{{d.sSku || ''}}</div>
        {{# if(d.processStatus === 1 || d.processStatus === null) { }}
          <div>
            <span class="layui-btn layui-btn-xs" id="warehousepicture_tplpicdiff" lay-event="comparePic">
              模版图对比
            </span>
          </div>
        {{# } }}
    </div>
</script>
<!--  -->
<script type="text/html" id="warehousepicture_requireType">
  <div>需求: {{d.requireType}}</div>
  <div>模板: {{d.printTemplateName}}</div>
</script>
<%-- 表格-义乌仓信息 --%>
<script type="text/html" id="warehousepicture_locationName">
    <div class="tal">
        <div>库位: {{d.yiWuLocationCode || ''}}</div>
        <div class="{{!d.yiWuStock ? 'warehousepicture_tableStockBg': ''}}">可用: {{d.yiWuStock || 0}}</div>
    </div>
</script>

<%-- 表格-中转仓信息 --%>
<script type="text/html" id="warehousepicture_selfLocationCode">
    <div class="tal">
        <div>库位: {{d.selfLocationCode || ''}}</div>
        <div class="{{!d.selfStock ? 'warehousepicture_tableStockBg': ''}}">可用: {{d.selfStock || 0}}</div>
    </div>
</script>

<%--SHEIN佛山仓--%>
<script type="text/html" id="warehousepicture_sheinCode">
    <div class="tal">
        <div>库位: {{d.sheinLocationCode || ''}}</div>
        <div class="{{!d.sheinStock ? 'warehousepicture_tableStockBg': ''}}">可用: {{d.sheinStock || 0}}</div>
    </div>
</script>

<%-- 表格-仓库拍图 --%>
<script type="text/html" id="warehousepicture_whphotos">
    <div style="display:flex;flex-wrap: wrap;">
      {{# layui.each(d.whPhotoRequireFileDtos,function(index,elem){ }}
        <div style="margin:5px;position:relative;">
          {{#  if(elem.fileName){ }}
            {{# if(zttTestImg(elem.fileName)){ }}
            <img width="60" height="60" src="{{ elem.fileName + '!size=60x60' }}" class="img_show_hide b1"
            onerror="layui.admin.img_noFind()" />
            {{#  } else { }}
            <video width="60" height="60" controls>
              <source src="{{ elem.fileName }}">
              您的浏览器不支持 HTML5 video 标签。
            </video>
            {{# } }}
            <div style="position: absolute;top: 0px;left: 0px;color: #FFF;font-size: 10px;">{{elem.typeName}}</div>
          {{# } }}
        </div>
    {{# }) }}  
    </div> 
</script>
<%-- 表格-人员 --%>
<script type="text/html" id="warehousepicture_operation">
    <div class="tal">
      <div>需求: {{d.creator|| ''}} {{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>
      <div>拍图: {{d.photographer || ''}} {{Format(d.photoTime,"yyyy-MM-dd hh:mm:ss")}} </div>
    </div>
</script>
<%-- 表格-时间 --%>
<script type="text/html" id="warehousepicture_timesTable">
    <div class="tal">
      <div>需求: {{d.creator|| ''}} {{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>
        <div>拍图: {{d.photographer || ''}} {{Format(d.photoTime,"yyyy-MM-dd hh:mm:ss")}} </div>
        <div>创建: {{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>
        <div>拍图: {{Format(d.photoTime,"yyyy-MM-dd hh:mm:ss")}}</div>
    </div>
</script>


<%-- 弹框-新增拍图需求 --%>
<script type="text/html" id="warehousepicture_addPictureLayer">
    <form class="layui-form p20" id="warehousepicture_addPictureLayerForm">
      <div class="layui-form-item">
        <label class="layui-form-label">需求类型</label>
        <div class="layui-input-block">
            <select name="requireType" lay-search  id="warehousepicture_measureTypeLayer" lay-filter="warehousepicture_measureTypeLayer">
            </select>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">模板名称</label>
        <div class="layui-input-block">
            <select name="printTemplateId" lay-search id="warehousepicture_printTemplateIdLayer">
            </select>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">子SKU</label>
        <div class="layui-input-block">
          <textarea name="skuStr" placeholder="每行一个" class="layui-textarea"></textarea>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">备注</label>
        <div class="layui-input-block">
          <textarea name="remark" class="layui-textarea"></textarea>
        </div>
      </div>
    </form>
</script>


<%-- 弹框-模板图对比 --%>
<script type="text/html" id="warehousepicture_tplPicCompare">
  <div>
    <table class="layui-table" id="warehousepicture_sprodtable" style="margin-bottom: 20px"></table>
    <div id="picContainer">

    </div>

    
  </div>
</script>
<script type="text/html" id="sprodtable_size">
  <div>{{d.winitLength}} * {{d.winitWidth}} * {{d.winitHeight}}</div>
</script>
<script type="text/html" id="comparePic_Pic">
  {{# layui.each(['shootPicList', 'subImages', 'mainImages', 'assistImgs'], function(index, item){ }}
    <fieldset class="layui-elem-field layui-field-title site-demo-button">
      <legend style="font-size:14px">
        {{# if(item === 'shootPicList'){  }}
          拍照图片
        {{# } }}
        {{# if(item === 'subImages'){  }}
         子属性图
          {{# if(d.isSubNeedExpand) {}}
            <span class="layui-btn layui-btn-xs" onclick="expandImgList(this)">展开</span>
          {{# } }}
        {{# } }}
        {{# if(item === 'mainImages'){  }}
         模板主图
         {{# if(d.isMainNeedExpand) {}}
            <span class="layui-btn layui-btn-xs" onclick="expandImgList(this)">展开</span>
          {{# } }}
        {{# } }}
        {{# if(item === 'assistImgs'){  }}
         模板附图
         {{# if(d.isAssistNeedExpand) {}}
            <span class="layui-btn layui-btn-xs" onclick="expandImgList(this)">展开</span>
          {{# } }}
        {{# } }}
      </legend>
    </fieldset>
    <div class="pic-container-flex">
      {{# layui.each(d[item].slice(0, 6), function(cIndex, cItem){}}
        <div class="img-wrap">
          <div class="img-box">
            {{#  if(cItem.fileName){ }}
              <img src="{{ cItem.fileName }}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
            {{# } else { }}
              <img data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
            {{# } }}
          </div>
        </div>
      {{# }) }}
      {{# layui.each(d[item]?.slice(6), function(cIndex, cItem){}}
        <div class="img-wrap img-wrap-hide disN">
          <div class="img-box">
            <img src="{{ cItem.fileName }}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
          </div>
        </div>
      {{# }) }}
      <div style="width: 15%;height:0"></div>
      <div style="width: 15%;height:0"></div>
      <div style="width: 15%;height:0"></div>
      <div style="width: 15%;height:0"></div>
      <div style="width: 15%;height:0"></div>
    </div>
  {{# }) }}
</script>


<script src="${ctx}/static/js/warehouse/warehousepicture.js"></script>
<script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
<script src="${ctx}/static/layui/saveFile.js"></script>
