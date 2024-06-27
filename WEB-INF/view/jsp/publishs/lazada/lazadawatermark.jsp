<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>lazada水印</title>

<style>
.watermark_sizeChangeClass {
    margin-left: 450px;
    width: 150px;
    padding-bottom: 10px;
}
.watermark-div,
.watermark-font-div {
    transform-origin: left top;
}
.lazadawatermark_tips {
    margin-left: 34px;
    padding: 5px 15px;
    background: #ff8c69;
    color: #fff;
    border-radius: 10px;
}
</style>

<div class="layui-fluid">
  <div class="layui-col-space15">
    <div class="layui-card">
      <div class="layui-card-body">
          <form class="layui-form" id="lazadaWatermarkForm">
              <div class="layui-form-item layui-row">
                  <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">部门</label>
                      <div class="layui-input-block">
                          <select lay-search lay-filter="watermark_online_depart_sel" class="orgs_hp_custom" name="orgId" lay-search>
                              <option value=""></option>
                          </select>
                      </div>
                  </div>
                  <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">销售员</label>
                      <div class="layui-input-block">
                          <select lay-search lay-filter="watermark_online_salesman_sel" class="users_hp_custom"  data-rolelist="lazada专员" name="salePersonId" lay-search>
                              <option value=""></option>
                          </select>
                      </div>
                  </div>
                  <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">店铺</label>
                      <div class="layui-input-block">
                          <div data-platcode="lazada" name="storeAcctIds" xm-select="lazada_water_mark_store_sel" class="users_hp_store_multi" id="lazada_water_mark_store_sel"></div>
<%--                          <select lay-filter="watermark_search-store" class="store_hp_custom" name="storeAcctId" data-platcode="lazada" lay-search></select>--%>
                      </div>
                  </div>
                  <div class="layui-form-item">
                  <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">水印类型</label>
                      <div class="layui-input-block">
                          <select class="layui-select" name="watermarkType" xm-select="" xm-select-skin="normal">
                              <option></option>
                              <option value="0">日常图片水印</option>
                              <option value="1">文字水印</option>
                              <option value="2">其它图片水印</option>
                          </select>
                      </div>
                  </div>
                  <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">模板名称</label>
                      <div class="layui-input-block">
                          <input class="layui-input" name="watermarkTemplateName" />
                      </div>
                  </div>
                  <div class="layui-col-lg3 layui-col-md3 pl20">
                      <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="lazadaWatermark-submit" id="lazadaWatermark-submit">查询</span>
                      <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                  </div>
                  </div>
              </div>
          </form>
      </div>
    </div>
    <div class="layui-card" id="lazadaWatermarkCard">
         <div class="fixHigh">
            <div class="layui-card-header">
                <div class="fixTab">
                    <div>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="lazadaWatermark_newAdd">
                            新增
                        </span>
                        <span class="layui-btn layui-btn-sm" id="lazadaWatermark_import">
                            导入新增文字水印
                        </span>
                        <a style="margin-left:10px;" class="layui-btn layui-btn-sm layui-btn-normal" href="/lms/static/templet/lazadaWaterImport.xlsx" target="_blank">
                            文字水印表格下载
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下面放表格 -->
        <div class="layui-card-body">
            <table class="layui-table layui-hide" id="lazadaWatermark_table" lay-filter="lazadaWatermark_tableFilter"></table>
        </div>
    </div>
  </div>
</div>

<%-- 表格操作列 --%>
<script type="text/html" id="lazadaWatermark_tableIdBar">
   <a class="layui-btn layui-btn-xs" lay-event="copy">复制</a>
   <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
   <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 表格---水印类型 --%>
<script type="text/html" id="lazadaWatermark_tableType">
   <div>
    {{# if(d.watermarkType==0){ }}
       <span>日常图片水印</span>
    {{# }else if(d.watermarkType==1){  }}
        <span>文字 水印</span>
    {{# }else if(d.watermarkType==2){  }}
       <span>其它图片水印</span>
    {{# } }}
   </div>
</script>
<%-- 表格---水印显示方式 --%>
<script type="text/html" id="lazadaWatermark_tableShow">
   <div>
        {{# if(d.watermarkType==0||d.watermarkType==2){ }}
        <span>
            <a href="{{d.watermarkUrl}}" target="_blank" style="color: #1e9fff;">
                <img src="{{d.watermarkUrl}}" alt="水印图" width="60" height="60">
            </a>
        </span>
        {{# }else if(d.watermarkType==1){  }}
            <span>{{d.watermarkFontContent}}</span>
        {{# } }}
   </div>
</script>


<%-- 新增水印弹框 --%>
<script type="text/html" id="lazadaWatermark_newAddLayer">
    <div class="watermark">
        <%-- 尺寸切换 --%>
        <div class="layui-form watermark_sizeChangeClass">
            <select lay-filter="lazadaWatermark_sizeChange">
                <option value="1000">1000*1000</option>
                <option value="800">800*800</option>
            </select>
        </div>
        <div class="watermark-left">
           <form class="layui-form">
<%--                <div class="layui-form-item lazadawatermark_tips">tips:不选择店铺,默认适用于所有店铺</div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span style="color: red;margin: 5px;">*</span>适用店铺</label>
                    <div class="layui-input-block" style="z-index:9999;">
                        <div id="lazadaWatermark_storeSelectAdd"></div>
                    </div>
                </div>
<%--               <div class="layui-input-block">--%>
<%--                   <span style="font-size:13px;color:red;">店铺不选则表示:该水印模板适用lazada所有店铺</span>--%>
<%--               </div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label">模板名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="watermarkTemplateName">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">水印类型</label>
                    <div class="layui-input-block">
                        <input type="radio" name="watermarkType" value="0" title="日常图片水印" checked lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="1" title="文字水印" lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="2" title="其它图片水印" lay-filter="lazadaWatermarkTypeRadio">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <span style="font-size:10px;color:red;">注意:切换类型水印会被清除!</span>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">水印图片</label>
                    <div class="layui-input-block">
						<button type="button" class="layui-btn layui-btn-xs" id="lazadaWatermark_upload">上传图片</button>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="lazadaWatermark_uploadImg" width="100" height="100" style="border: 1px solid #eee;">
                            <p id="lazada_watermark_uploadText"></p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_opacityAmount">0%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min2">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">大小</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_sizeAmount">100%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min1">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">旋转角度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_rotateAmount">0</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min4">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">水印文字</label>
                    <div class="layui-input-block">
                        <textarea placeholder="水印文字仅支持填写英文" class="layui-textarea" name="watermarkFontContent" maxlength="100"></textarea>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体类型</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontType" lay-filter="lazadaWatermarkFontTypeF">
                            <option value="微软雅黑">微软雅黑</option>
                            <option value="宋体">宋体</option>
                            <option value="Arial Black">Arial Black</option>
                            <option value="Gabriola">Gabriola</option>
                            <option value="MV Boli">MV Boli</option>
                            <option value="Impact">Impact</option>
                            <option value="Segoe Script">Segoe Script</option>
                            <option value="楷体">楷体</option>
                            <option value="华文琥珀">华文琥珀</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体大小</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontSize" lay-filter="lazadaWatermarkFontSizeF">
                            <option value="60">60</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                            <option value="24">24</option>
                            <option value="30">30</option>
                            <option value="36">36</option>
                            <option value="48">48</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" name="watermarkFontColor" type="color">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">背景颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" type="color" name="watermarkFontBackgroundColor" value="#ffffff">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_opacityAmount">0%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min3">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">文字旋转</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_rotateAmount">0</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min5">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <%-- 图片水印位置start --%>
                <input type="hidden" name="watermarkCoordinate" value='{"width":0, "height":0}'>
                <%-- 图片水印 位置end --%>
                <%-- 水印图片的尺寸start --%>
                <input type="hidden" name="watermarkSize" value='100'>
                <%-- 水印图片的尺寸end --%>
                <%-- 水印图片的透明度start --%>
                <input type="hidden" name="watermarkTransparency" value="0">
                <%-- 水印图片的透明度end --%>
                <%-- 水印图片路径start --%>
                <input type="hidden" name="watermarkUrl" value="">
                <%-- 水印图片路径end --%>
                <%-- 水印图片旋转角度start --%>
                <input type="hidden" name="degree" value="0">
                <%-- 水印图片旋转角度end --%>
                 <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="lazadaWatermarkAdd_submit">查询</span>
           </form>
        </div>
        <div class="watermark-right watermark-right-1000" id="lazada_watermark_rightBody">
            <div class="product-info-module watermark-right-modal f-left relative" id="lazada_albumListBody">
                <%-- 图片水印 --%>
                <div class="watermark-div" id="lazadaWatermarkImageDiv">
                    <div class="watermark-div-fix"></div>
                    <img class="watermark-div-img" src="">
                </div>
                <%-- 文字水印 --%>
                <div class="watermark-font-div disN" id="lazadaWatermarkFontDiv">
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- 编辑水印弹框 --%>
<script type="text/html" id="lazadaWatermark_editLayer">
    <div class="watermark" id="lazadaWatermark_content">
    </div>
</script>

<%-- 编辑水印模板 --%>
<script type="text/html" id="lazadaWatermark_contentTpl">
    <%-- 尺寸切换 --%>
    <div class="layui-form watermark_sizeChangeClass">
        <select lay-filter="lazadaWatermark_sizeChange">
        {{# if(d.borderSize == 1000){  }}
            <option value="1000" selected>1000*1000</option>
            <option value="800">800*800</option>
        {{# }else{ }}
            <option value="1000">1000*1000</option>
            <option value="800"  selected>800*800</option>
        {{# } }}
        </select>
    </div>
   <div class="watermark-left">
           <form class="layui-form">
<%--                <div class="layui-form-item lazadawatermark_tips">tips:不选择店铺,默认适用于所有店铺</div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label">适用店铺</label>
                    <div class="layui-input-block" style="z-index:9999;">
                        <%-- <select name="salesPlatAcctIds"> --%>
                        <%-- <select name="salesPlatAcctIds" xm-select="lazadaWatermark_storeSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="watermark_store">
                            {{# if(d.lazadaWatermark_storeListArr){ }}
                                {{#  layui.each(d.lazadaWatermark_storeListArr, function(index, item){ }}
                                    <option value="{{item.value}}">{{ item.name }}</option>
                                {{# }) }}

                            {{# } }}
                        </select> --%>
                        <div id="lazadaWatermark_storeSelectEdit"></div>
                    </div>
                </div>
<%--               <div class="layui-input-block">--%>
<%--                   <span style="font-size:13px;color:red;">店铺不选则表示:该水印模板适用lazada所有店铺</span>--%>
<%--               </div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label">模板名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="watermarkTemplateName" value="{{d.watermarkTemplateName}}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">水印类型</label>
                    <div class="layui-input-block">
                        {{# if(d.watermarkType == 0){ }}
                        <input type="radio" name="watermarkType" value="0" title="日常图片水印" lay-filter="lazadaWatermarkTypeRadio" checked>
                        <input type="radio" name="watermarkType" value="1" title="文字水印" lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="2" title="其它图片水印" lay-filter="lazadaWatermarkTypeRadio">
                        {{#}else if(d.watermarkType == 1){ }}
                        <input type="radio" name="watermarkType" value="0" title="日常图片水印" lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="1" title="文字水印" lay-filter="lazadaWatermarkTypeRadio" checked>
                        <input type="radio" name="watermarkType" value="2" title="其它图片水印" lay-filter="lazadaWatermarkTypeRadio">
                        {{# }else if(d.watermarkType == 2){ }}
                         <input type="radio" name="watermarkType" value="0" title="日常图片水印" lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="1" title="文字水印" lay-filter="lazadaWatermarkTypeRadio">
                        <input type="radio" name="watermarkType" value="2" title="其它图片水印" lay-filter="lazadaWatermarkTypeRadio" checked>
                        {{# } }}

                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <span style="font-size:10px;color:red;">注意:切换类型水印会被清除!</span>
                    </div>
                </div>
                {{# if(d.watermarkType == 0 || d.watermarkType == 2){ }}
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">水印图片</label>
                    <div class="layui-input-block">
						<button type="button" class="layui-btn layui-btn-xs" id="lazadaWatermark_upload">上传图片</button>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="lazadaWatermark_uploadImg" width="100" height="100" style="border: 1px solid #eee;" src="{{d.watermarkUrl}}">
                            <p id="lazada_watermark_uploadText"></p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_opacityAmount">{{d.watermarkTransparency}}%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min2">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">大小</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_sizeAmount">{{d.watermarkSize}}%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min1">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg">
                    <label class="layui-form-label">旋转角度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_rotateAmount">{{d.degree}}</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min4">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">水印文字</label>
                    <div class="layui-input-block">
                        <textarea placeholder="水印文字仅支持填写英文" class="layui-textarea" name="watermarkFontContent" maxlength="100">
                        {{d.watermarkFontContent}}
                        </textarea>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体类型</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontType" lay-filter="lazadaWatermarkFontTypeF">
                            <option value="微软雅黑">微软雅黑</option>
                            <option value="宋体">宋体</option>
                            <option value="Arial Black">Arial Black</option>
                            <option value="Gabriola">Gabriola</option>
                            <option value="MV Boli">MV Boli</option>
                            <option value="Impact">Impact</option>
                            <option value="Segoe Script">Segoe Script</option>
                            <option value="楷体">楷体</option>
                            <option value="华文琥珀">华文琥珀</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体大小</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontSize" lay-filter="lazadaWatermarkFontSizeF">
                            <option value="60">60</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                            <option value="20">20</option>
                            <option value="24">24</option>
                            <option value="30">30</option>
                            <option value="36">36</option>
                            <option value="48">48</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">字体颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" name="watermarkFontColor" type="color"
                        value="{{d.watermarkFontColor}}">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">背景颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" type="color" name="watermarkFontBackgroundColor"
                        value="{{d.watermarkFontBackgroundColor}}">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_opacityAmount">0%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min3">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText disN">
                    <label class="layui-form-label">文字旋转</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_rotateAmount">0</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min5">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                {{# }else{ }}
                 <div class="layui-form-item watermarkTypeImg disN">
                    <label class="layui-form-label">水印图片</label>
                    <div class="layui-input-block">
						<button type="button" class="layui-btn layui-btn-xs" id="lazadaWatermark_upload">上传图片</button>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="lazadaWatermark_uploadImg" width="100" height="100" style="border: 1px solid #eee;" src="{{d.watermarkUrl}}">
                            <p id="lazada_watermark_uploadText"></p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg disN">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_opacityAmount">{{d.watermarkTransparency}}%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min2">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg disN">
                    <label class="layui-form-label">大小</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_sizeAmount">{{d.watermarkSize}}%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min1">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeImg disN">
                    <label class="layui-form-label">旋转角度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeImg_rotateAmount">{{d.degree}}</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min4">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">水印文字</label>
                    <div class="layui-input-block">
                        <textarea placeholder="水印文字仅支持填写英文" class="layui-textarea" name="watermarkFontContent" maxlength="100">
                        </textarea>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">字体类型</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontType" lay-filter="lazadaWatermarkFontTypeF">
                            {{# if(d.fontFamilyArr){ }}
                                {{#  layui.each(d.fontFamilyArr, function(index, item){ }}
                                    {{# if(d.watermarkFontType == item.value ){ }}
                                        <option value="{{item.value}}" selected="selected">{{ item.name }}</option>
                                    {{# }else{ }}
                                        <option value="{{item.value}}">{{ item.name }}</option>
                                    {{# } }}
                                {{# }) }}

                            {{# } }}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">字体大小</label>
                    <div class="layui-input-block">
                        <select name="watermarkFontSize" lay-filter="lazadaWatermarkFontSizeF">
                            {{# if(d.fontSizeArr){ }}
                                {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                                    {{# if(d.watermarkSize == item.value ){ }}
                                        <option value="{{item.value}}" selected="selected">{{ item.name }}</option>
                                    {{# }else{ }}
                                        <option value="{{item.value}}">{{ item.name }}</option>
                                    {{# } }}
                                {{# }) }}

                            {{# } }}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">字体颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" name="watermarkFontColor" type="color"
                        value="{{d.watermarkFontColor}}">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">背景颜色</label>
                    <div class="layui-input-block">
                        <input class="layui-input formInputColor" type="color" name="watermarkFontBackgroundColor"
                        value="{{d.watermarkFontBackgroundColor}}">
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">透明度</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_opacityAmount">0%</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider_range_min3">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item watermarkTypeText">
                    <label class="layui-form-label">文字旋转</label>
                    <div class="layui-input-block">
                        <div class="pull-right gray-c" id="lazadaWatermarkTypeFont_rotateAmount">{{d.degree}}</div>
						<div class="w250 v-top m-top10 m-bottom20 ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" id="lazada_slider-range-min5">
                            <div class="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min"></div>
                            <span class="ui-slider-handle ui-state-default ui-corner-all" tabindex="0" style="left: 44.4444%;"></span>
                        </div>
                    </div>
                </div>
                {{# } }}

                <%-- 图片水印位置start --%>
                <input type="hidden" name="watermarkCoordinate" value='{{d.watermarkCoordinate}}'>  
                <%-- 图片水印 位置end --%>
                <%-- 水印图片的尺寸start --%>
                <input type="hidden" name="watermarkSize" value='{{d.watermarkSize}}'>  
                <%-- 水印图片的尺寸end --%>
                <%-- 水印图片的透明度start --%>
                <input type="hidden" name="watermarkTransparency" value="{{d.watermarkTransparency}}">
                <%-- 水印图片的透明度end --%>
                <%-- 水印图片路径start --%>
                <input type="hidden" name="watermarkUrl" value="{{d.watermarkUrl}}">
                <%-- 水印图片路径end --%>
                <%-- 水印图片旋转角度start --%>
                <input type="hidden" name="degree" value="{{d.degree}}">
                <%-- 水印图片旋转角度end --%>
                 <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="lazadaWatermarkAdd_submit">查询</span>
           </form>
        </div>
        {{# if(d.borderSize == 1000){  }}
        <div class="watermark-right watermark-right-1000" id="lazada_watermark_rightBody">
        {{# }else{ }}
        <div class="watermark-right watermark-right-800" id="lazada_watermark_rightBody">
        {{# } }}
            <div class="product-info-module watermark-right-modal f-left relative" id="lazada_albumListBody">
                {{# if(d.watermarkType == 0 || d.watermarkType == 2){ }}
                <%-- 图片水印 --%>
                <div class="watermark-div" id="lazadaWatermarkImageDiv" style="position:absolute;border: 1px dashed gainsboro;cursor: all-scroll;left:{{d.left}}; top: {{d.top}};opacity: {{d.opacity}};transform: rotate({{d.degree}}deg)">
                    <div class="watermark-div-fix"></div>
                    <img class="watermark-div-img" src="{{d.watermarkUrl}}">
                </div>
                <%-- 文字水印 --%>
                <div class="watermark-font-div disN" id="lazadaWatermarkFontDiv">
                    <span></span>
                </div>
                {{# }else{ }}
                <%-- 图片水印 --%>
                <div class="watermark-div disN" id="lazadaWatermarkImageDiv">
                    <div class="watermark-div-fix"></div>
                    <img class="watermark-div-img" src="{{d.watermarkUrl}}">
                </div>
                <%-- 文字水印 --%>
                <div class="watermark-font-div" id="lazadaWatermarkFontDiv" style="position:absolute;border: 1px dashed #ccc;cursor:all-scroll;left:{{d.left}}; top: {{d.top}};right: auto;bottom: auto;opacity: {{d.opacity}};background-color: {{d.watermarkFontBackgroundColor}};;transform: rotate({{d.degree}}deg)">
                    <span style="font-family:{{d.watermarkFontType}};font-size: {{d.watermarkSize}}px;color:{{d.watermarkFontColor}}">{{d.watermarkFontContent}}</span>
                </div>
                {{# } }}
            </div>
        </div>
</script>



<script src="${ctx}/static/watermarkAPI/frame.js"></script>
<script src="${ctx}/static/watermarkAPI/watermarkAPI.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/js/publishs/lazada/lazadawatermark.js"></script>
