<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>smt替换橱窗图</title>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    li.window_map_imgLi{
        float: left;
    }
    img.window_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    img.templet_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 33px;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space16">
        <div class="layui-col-lg13 layui-col-md13">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="smt_replace_windowMap_form" id="smt_replace_windowMap_form">
                        <div class="layui-form-item">
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select id="smtModImg_is_pAnds_sku">
                                        <option value="0">商品子SKU</option>
                                        <option value="1">商品父SKU</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <input type="text" id="smt_replace_windowMap_storePSku_input" name="skuList" class="layui-input" placeholder="默认模糊查询">
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="smt_replaceWindowMap_pskuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1" selected>精确</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel" name ="orgId" lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="saleName" id="smt_online_salesman_sel" lay-search lay-filter="smt_online_salesman_sel"  class="users_hp_custom" data-rolelist="smt专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="smt_online_store_sel" xm-select="selectAttr_store"  xm-select-search lay-filter="smt_online_store_sel"   class="store_hp_custom" data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                                </div>
                                <div class="layui-col-lg3  layui-col-md3">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="smt_replace_windowMap_search_btn">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="smt_replace_windowMap_btn">清空</button>
                                    <button type="button" id="smt_replace_windowMap_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button>
                                    <button type="button" id="smt_replace_first_pic_btn" class="layui-btn layui-btn-normal layui-btn-sm">批量首图加水印</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="smt_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="smt_replace_windowMap_num_span"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 10px;left: 300px;" width="600px;">
                            <form class="layui-form" lay-filter="smt_replace_windowMap_url_form" id="smt_replace_windowMap_url_form">
                                <button type="button" id="batch_modify_main_picture_smt" class="layui-btn ml20 layui-btn-sm">批量修改主图并添加水印</button>
                                <div class="layui-inline">
                                    <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                                    <div class="layui-input-inline" style="width: 400px;">
                                        <input type="text" id="smt_replace_windowMap_image_input" autocomplete="off" class="layui-input">
                                    </div>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"  id="smt_replace_windowMap_image_add_btn">添加图片</button>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"  id="smt_reback">还原</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    <span style="color:red">(每个lisiting的橱窗图不能超过6张)</span>
                                </div>
                            </form>
                        </div>
                        <div class="layui-tab-content" id="smt_replace_windowMap_tab_content">
                            <table class="layui-table" id="smt_replace_windowMap_data_table" lay-filter="smt_replace_windowMap_data_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--图片显示模板-->
<script type="text/html" id="smt_replace_windowMap_pImgs_tpl">
    <ul id="window_map_imgDiv_ul_{{d.itemId}}" class="window_map_imgDiv_ul">
    {{#   layui.each(d.imageURLs.split(';'),function(i,item){ }}
            {{#  if(item != null && item != ''){ }}
                    <li style="padding: 5px 0;" class="window_map_imgLi">
                        <div class="window_map_imgDiv">
                            <img src="{{item}}" class="window_map_imgCss">
                        </div>
                        <div class="imgDivDown h20 "><a onclick="smt_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                    </li>
             {{#  } }}
    {{# });}}
        <div style="float:right;">
            <div>
                <div id="{{d.itemId}}"></div><!--图片上传按钮-->
            </div>
            <button class="layui-btn ml20 layui-btn-sm"  style="margin:3px 0;" type="button" onclick="smt_replace_windowMap_addItemImage('{{d.itemId}}')">添加图片</button><br/>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="smt_show_templet_picture('{{d.prodPIds}}','{{d.itemId}}')">模板图片</button><br/>
            <button class="layui-btn layui-btn-sm" type="button" onclick="smt_first_addItemImage('{{d.itemId}}','{{d.storeAcctId}}')" >首图加水印</button>
        </div>
        <div style="clear:both;"></div>
    </ul>
</script>
<script type="text/html" id="smtPulish_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="smtPulish_info_water">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="watermarkImage" lay-filter="smtPublish_search-watermarkImage" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="watermarkFont"  lay-filter="smtPublish_search-watermarkFont" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="smt_replace_firste_tpl">
    <span id="window_first_picture_{{d.itemId}}" class="window_map_imgDiv_ul"> </span>
</script>
<script type="text/html" id="smt_replace_windowMap_operate_tpl">
      <span id="window_map_operate_tips_{{d.itemId}}"></span>
</script>


<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtReplaceWindowMap.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
