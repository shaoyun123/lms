<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>shopee修改图片</title>
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
    @-webkit-keyframes shineRed {
        from { -webkit-box-shadow: 0 0 5px #bbb; }
        50% { -webkit-box-shadow: 5px 10px 10px #B22222; }
        to { -webkit-box-shadow: 0 0 5px #bbb; }
    }
    .shine_red{
        -webkit-animation-name: shineRed;
        -webkit-animation-duration: 2s;
        -webkit-animation-iteration-count: infinite;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="shopee_replace_img_form" id="shopee_replace_img_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="shopeeModImg_is_pAnds_sku" lay-filter="shopeeModImg_is_pAnds_sku">
                                    <option value="0" selected >商品子SKU</option>
                                    <option value="1">商品父SKU</option>
                                    <option value="2">item ID</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="layui-input-inline">
                                    <input type="text" id="shopee_replace_windowMap_storePSku_input" name="skuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                    <select id="shopee_replaceWindowMap_pskuSearchType">
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select  id="shopee_online_depart_sel" lay-search lay-filter="shopee_online_depart_sel"  class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select  name="saleName"  lay-search class="users_hp_custom" data-rolelist="shopee专员" >
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select  lay-search xm-select="selectAttr_store" class="store_hp_custom" data-platcode="shopee">
                                            <option value=""></option>
                                        </select>
                                    </div>
                            </div>

                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"  id="shopee_replace_windowMap_search_btn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                            <button type="button" id="shopee_replace_windowMap_bacthUpdate_btn" class="layui-btn layui-btn-normal layui-btn-sm fr">批量修改</button>
                        </div>
                    </form>
                    <div class="taRight">
                        <button type="button" id="shopee_replace_first_pic_btn" class="layui-btn layui-btn-sm">批量首图加水印</button>
                        <button type="button" id="shopee_replace_generate_first_pic_btn" class="layui-btn layui-btn-sm">重新生成首图</button>
                        <button type="button" id="shopee_replace_generate_window_pic_btn" class="layui-btn layui-btn-sm">重新生成橱窗图</button>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="shopee_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="shopee_replace_windowMap_num_span"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 10px;left: 200px;" width="600px;">
                            <form class="layui-form" lay-filter="shopee_replace_windowMap_url_form" id="shopee_replace_windowMap_url_form">
                                <div class="layui-inline">
                                    <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                                    <div class="layui-input-inline" style="width: 400px;">
                                        <input type="text" id="shopee_replace_windowMap_image_input" autocomplete="off" class="layui-input">
                                    </div>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"  id="shopee_replace_windowMap_image_add_btn">新增图片</button>
                                    <button class="layui-btn ml20 layui-btn-sm" type="button"  id="shopee_reback">还原</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    <span style="color:red">(每个lisiting的图片不能超过9张)</span>
                                </div>
                            </form>
                        </div>
                        <div class="layui-tab-content" id="shopee_replace_windowMap_tab_content">
                            <table class="layui-table" id="shopee_replace_img_table" lay-filter="shopee_replace_img_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/html" id="shopee_replace_firste_tpl">
    <span id="window_first_picture_{{d.itemId}}" class="window_map_imgDiv_ul ui-sortable uploadImgUL"> </span>
</script>

<script type="text/html" id="shopee_replace_itemId_tpl">
    <div class="itemid">{{d.itemId}}</div>
    {{#   layui.each(d.ptagList,function(_,item){ }}
    <span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">{{item.name}}</span>
    {{# });}}
</script>

<!--图片显示模板-->
<script type="text/html" id="shopee_replace_imgs_tpl">
    <ul id="window_map_imgDiv_ul_{{d.itemId}}" class="window_map_imgDiv_ul ui-sortable uploadImgUL">
    {{#   layui.each(d.imgs.split('||,'),function(i,item){ }}
            {{#  if(item != null && item != ''){ }}
                    <li style="padding: 5px 0;" class="window_map_imgLi" draggable="true">
                        <div class="window_map_imgDiv">
                            <img class="window_map_imgCss img_show_hide lazy" src="{{item}}" data-original="{{item}}" style="display: block;" data-onerror="layui.admin.img_noFind()">
                        </div>
                        <div class="imgDivDown h20 "><a onclick="shopee_replace_windowMap_delImg(this);" href="javascript:void(0);">移除</a></div>
                    </li>
             {{#  } }}
    {{# });}}
           <div style="float:right;">
            <div>
                <div id="{{d.itemId}}"></div><!--图片上传按钮-->
            </div>
               <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="shopee_replace_windowMap_addItemImage('{{d.itemId}}')">网络图片</button><br/>
               <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="show_templet_picture('{{d.prodPId}}','{{d.itemId}}')">模板图片</button><br/>
               <button class="layui-btn layui-btn-sm" type="button" onclick="shopee_first_addItemImage('{{d.itemId}}','{{d.storeAcctId}}')" >首图加水印</button>
           </div>
        <div style="clear:both;"></div>
     </ul>
</script>
<script type="text/html" id="shopee_replace_img_operate_tpl">
      <span id="window_map_operate_tips_{{d.itemId}}"></span>
</script>


<script type="text/html" id="shopeePulish_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="shopeePulish_info_water">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="watermarkImage" lay-filter="shopeePublish_search-watermarkImage" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="watermarkFont" lay-filter="shopeePublish_search-watermarkFont" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <!-- <div class="p20">
            <div style="margin-left:30px">
                <span style="color: #0000EE">不选择水印则添加店铺默认水印</span>
            </div>
        </div> -->
    </form>
</script>

<!-- 批量添加水印 -->
<script  type="text/html" id="shopee_replace_imgs_batch_add_water">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="shopee_replace_imgs_batch_add_water_table" lay-filter="shopee_replace_imgs_batch_add_water_table"></table>

        </div>
    </div>
</script>
<script type="text/html" id="shopee_replace_imgs_batch_add_water_storeAcct_tpl">
    <div>{{d.storeAcct}}</div>
    <input type="text" value="{{d.storeAcctId}}" name="storeAcctId" class="hidden">
</script>
<script type="text/html" id="shopee_replace_imgs_batch_add_water_image_tpl">
    <select name="waterImage" lay-search lay-filter="shopee_replace_imgs_batch_add_water_image" >
        <option value="">请选择</option>
        {{#   layui.each(d.picList||[],function(i,item){ }}
        <option value="{{item.id}}">{{item.watermarkTemplateName}}</option>
        {{#    })  }}
    </select>
</script>
<script type="text/html" id="shopee_replace_imgs_batch_add_water_font_tpl">
    <select name="waterFont" lay-search lay-filter="shopee_replace_imgs_batch_add_water_font">
        <option value="">请选择</option>
        {{#   layui.each(d.wordList||[],function(i,item){ }}
        <option value="{{item.id}}">{{item.watermarkTemplateName}}</option>
        {{#    })  }}
    </select>
</script>

<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/replaceItemImg.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/util/ImgCompareUtil.js?v=${ver}"></script>
