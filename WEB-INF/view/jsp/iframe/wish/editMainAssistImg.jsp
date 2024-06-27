<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>wish修改主辅图</title>
<style>
    li.window_map_imgLi{
        float: left;
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
    .wish_edit_mainAssistImg_ul {
       flex: 6;
       margin-left: 15px;
    }
    .wish_edit_mainAssistImg_ul li{
        float: left;
        width: 110px;
        box-sizing: border-box;
        padding: 3px;
    }
    .wish_edit_mainAssistImg_ul li img {
        border: 1px solid #ccc;
        width: 100px;
        height: 100px;
    }
    .wish_edit_mainAssistImg_ul li .handle-img  span{
        cursor: pointer;
    }
    .wish_edit_mainAssistImg_ul li .handle-img  span:nth-child(2) {
         margin-left: 10px
    }
    .wish_edit_mainAssistImg_ul li .handle-img  span:hover {
        color: cornflowerblue
    }
    .wish_edit_mainAssistImg_ul li .handle-img  span.setMainImg {
        float: left;
    }
    .wish_edit_mainAssistImg_ul li .handle-img  span.removeImg {
        float: right;
    }
    .wish_edit_mainImg {
        width: 150px;
        height: 150px;
        box-sizing: border-box;
        flex: 2
    }
    .wish_edit_mainImg img {
        border: 1px solid #ccc;
        max-width: 150px;
        width: 100%;
        height: 100%;
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
</style>
<div class="layui-fluid" id="wishEditMAImg">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="wish_edit_mainAssistImg_searchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">商品父SKU</label>
                                    <div class="layui-input-block inputAndSelect">
                                       <div class="layui-col-lg9 layui-col-md9">
                                            <input name="prodPSkus" type="text" class="layui-input">
                                       </div>
                                       <div class="layui-col-lg3 layui-col-md3">
                                            <select name="skuVagueFlag">
                                                <option value="true">模糊</option>
                                                <option value="false">精确</option>
                                            </select>
                                       </div>
                                    </div>
                                </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select id="wishPublish_group_sel" name="orgId" lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" >
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select name="sellerId"
                                                lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                                                data-roleList="wish专员">
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeAcctId" data-platcode="wish"  lay-search class="store_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 pl20">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"data-type="reload"  id="wish_edit_mainAssistImg_searchBtn">查询</button>
                                </div>
                            </div>
                        </form>
                    </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="wish_edit_mainAssistImg_num"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 10px;left: 215px;" width="600px;">
                                <form class="layui-form" lay-filter="">
                                    <div class="layui-inline">
                                        <div class="layui-input-inline" style="width: 400px;">
                                            <input type="text" id="wishEditMAImg_imgText" autocomplete="off" class="layui-input">
                                        </div>
                                        <button type="button" class="layui-btn layui-btn-sm" onclick="wishEditMAImg_replaceMainImg()">替换主图</button>
                                        <button type="button" class="layui-btn layui-btn-sm" onclick="wishEditMAImg_addAssistImg()">添加辅图</button>
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled wish_edit_mainAssistImg_revert" onclick="wishEditMAImg_revert(this)">还原主图</button>
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled wish_edit_assistImg_revert"
                                        onclick="wishEditAssistImg_revert(this)">还原辅图</button>
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" style="margin-left:145px" onclick="wishEditMAImg_batchEdit()">批量修改</button>
                                    </div>
                                </form>
                        </div>
                        
                        <div class="layui-tab-content">
                            <table class="layui-table" id="wish_edit_mainAssistImg_table" lay-filter="wish_edit_mainAssistImg_table">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="mainAssistImageJs">
    <div style="display: flex" class="wishEditMAImg_imgs_div">
        <div class="wish_edit_mainImg">
            <img src='{{d.mainImage}}'>
        </div>
        <ul class="wish_edit_mainAssistImg_ul">
            {{# var extImages=d.extraImages;
               if(extImages){
                    var extImglist=extImages.split("|");
                    for(var i in extImglist){
             }}
            <li>
                <img src='{{extImglist[i]}}'>
                <div class="ovhi handle-img">
                    <span class="setMain-img" onclick="wishEditMAImg_setAsMainImg(this)">设为主图</span>
                    <span class="remove-img" onclick="wishEditMAImg_delImg(this)">移除</span>
                </div>
            </li>
            {{# } }}
            {{# } }}
        </ul>
        <div style="flex: 1">
            <button class="layui-btn layui-btn-sm" onclick="wishEditMAImg_addImg(this)">添加图片</button>
            <button class="layui-btn layui-btn-sm" type="button" style="margin:3px 0;" onclick="wish_show_templet_picture('{{d.prodPId}}','{{d.storeProdPId}}',this)">模板图片</button><br/>
        </div>
    </div>
</script>

<script type="text/html" id="trueFalseTpl">
    {{# if(d.isPromotion){ }}
    <span>是</span>
    {{# }else{ }}
        <span>否</span>
    {{# } }}
</script>

<script type="text/html" id="wishEditMAImg_optStatusJs">
    <span id="wishEditMAImg_optStatus_{{d.id}}"></span>
</script>

<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/editMainAssistImg.js"></script>
    