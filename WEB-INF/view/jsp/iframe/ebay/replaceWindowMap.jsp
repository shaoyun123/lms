<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>ebay替换橱窗图</title>
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
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="ebay_replace_windowMap_form" id="ebay_replace_windowMap_form">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">商品父SKU</label>
                                <div class="layui-input-inline">
                                    <input type="text" id="ebay_replace_windowMap_storePSku_input" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <select id="ebay_replaceWindowMap_pskuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"  id="ebay_replace_windowMap_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                            <div style="float:right;margin-top:5px;">
                                <button type="button" id="ebay_replace_windowMap_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm">批量修改</button>
                                <button type="button" id="ebay_replace_first_pic_btn" class="layui-btn layui-btn-normal layui-btn-sm">批量首图加水印</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="ebay_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="ebay_replace_windowMap_num_span"></span>)</li>
                        </ul>

                        <div style="position: absolute;top: 10px;left: 300px;" width="600px;">
                            <form class="layui-form" lay-filter="ebay_replace_windowMap_url_form" id="ebay_replace_windowMap_url_form">
                                <button type="button" id="batch_modify_main_picture" class="layui-btn ml20 layui-btn-sm">批量修改主图并添加水印</button>

                                <div class="layui-inline">

                                    <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                                    <div class="layui-input-inline" style="width: 400px;">
                                        <input type="text" id="ebay_replace_windowMap_image_input" autocomplete="off" class="layui-input">
                                    </div>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"  id="ebay_replace_windowMap_image_add_btn">添加图片</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    <span style="color:red">(每个lisiting的橱窗图不能超过12张)</span>
                                </div>
                            </form>
                        </div>
                        <div class="layui-tab-content" id="ebay_replace_windowMap_tab_content">
                            <table class="layui-table" id="ebay_replace_windowMap_data_table" lay-filter="ebay_replace_windowMap_data_table"></table>
                        </div>
                    </div>
                </div>
            </div>s
        </div>
    </div>
</div>
<script type="text/html" id="ebay_replace_firste_tpl">
    <span id="window_first_picture_{{d.itemId}}" class="window_map_imgDiv_ul"> </span>
</script>
<!--图片显示模板-->
<script type="text/html" id="ebay_replace_windowMap_pImgs_tpl">
    <ul id="window_map_imgDiv_ul_{{d.itemId}}" class="window_map_imgDiv_ul">
    {{#   layui.each(d.pimgs.split(','),function(i,item){ }}
            {{#  if(item != null && item != ''){ }}
                    <li style="padding: 5px 0;" class="window_map_imgLi">
                        <div class="window_map_imgDiv">
                            <img src="{{item}}" class="window_map_imgCss">
                        </div>
                        <div class="imgDivDown h20 "><a onclick="ebay_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                    </li>
             {{#  } }}
    {{# });}}
        <div style="float:right;">
            <div>
                <div id="{{d.itemId}}"></div><!--图片上传按钮-->
            </div>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="ebay_replace_windowMap_addItemImage('{{d.itemId}}')">网络图片</button><br/>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="ebay_show_templet_picture('{{d.prodPId}}','{{d.itemId}}')">模板图片</button><br/>
            <button class="layui-btn layui-btn-sm" type="button" onclick="ebay_first_addItemImage('{{d.itemId}}','{{d.storeAcctId}}')" >首图加水印</button>
        </div>
        <div style="clear:both;"></div>
    </ul>
</script>
<script type="text/html" id="ebayPic_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="ebayPulish_info_water">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="watermarkImage" lay-filter="ebayPublish_search-watermarkImage" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="watermarkFont"  lay-filter="ebayPublish_search-watermarkFont" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="ebay_replace_windowMap_operate_tpl">
      <span id="window_map_operate_tips_{{d.itemId}}"></span>
</script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/replaceWindowMap.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
