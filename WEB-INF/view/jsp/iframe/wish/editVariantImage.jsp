<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>wish修改子sku图</title>
<style>
    .wish_edit_variantMainImg_ul {
        flex: 5;
        margin-left: 15px;
    }
    .wish_edit_variantMainImg_ul li{
        float: left;
        width: 110px;
        box-sizing: border-box;
        padding: 3px;
    }
    .wish_edit_variantMainImg_ul li img {
        border: 1px solid #ccc;
        width: 100%;
    }
    .wish_edit_variantMainImg_ul li .handle-img  span{
        cursor: pointer;
    }
    .wish_edit_variantMainImg_ul li .handle-img  span:hover {
        color: cornflowerblue
    }
    .wish_edit_variantMainImg_ul li .handle-img  span.setMainImg {
        float: left;
    }
    .wish_edit_variantMainImg_ul li .handle-img  span.removeImg {
        float: right;
    }
    .wish_edit_var_mainImg {
        width: 150px;
        height: 150px;
        box-sizing: border-box;
        flex: 1.5
    }
    .wish_edit_var_mainImg img {
        border: 1px solid #ccc;
        max-width: 150px;
        width: 100%;
        height: 100%;
    }
</style>
<div class="layui-fluid" id="wishEditVarMainImg">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="wish_edit_variantMainImg_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">商品子SKU</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-lg9 layui-col-md9">
                                        <input name="prodSSkus" type="text" class="layui-input">
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
                                    <select id="wishVarMainImg_group_sel" name="orgId" lay-filter="orgs_hp_wishPersion_pb" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="wishVarMainImg_salesman_sel" name="sellerId"
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
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"data-type="reload"  id="wish_edit_variantMainImg_searchBtn">查询</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab">
                        <ul class="layui-tab-title">
                            <li class="layui-this" >数量(<span id="wish_edit_variantMainImg_num"></span>)</li>
                        </ul>
                        <div style="position: absolute;top: 10px;left: 215px;" width="600px;">
                            <form class="layui-form" lay-filter="">
                                <div class="layui-inline">
                                    <div class="layui-input-inline" style="width: 400px;">
                                        <input type="text" id="wishEditVarMainImg_imgText" autocomplete="off" class="layui-input">
                                    </div>
                                    <button type="button" class="layui-btn layui-btn-sm" onclick="wishEditVarMainImg_replaceVariantImg()">替换属性图</button>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled wishEditVarMainImg_revert" onclick="wishEditVarMainImg_revert(this)">还原</button>
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" style="margin-left:222px" onclick="wishEditVarMainImg_batchEdit()">批量修改</button>
                                </div>
                            </form>
                        </div>

                        <div class="layui-tab-content">
                            <table class="layui-table" id="wishVarImgEdit_table" lay-filter="wishVarImgEdit_table">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="variantMainImageJs">
    <div style="display: flex" class="wishEditVarMainImg_imgs_div">
        <div class="wish_edit_var_mainImg">
            {{# if(d.subMainImage){ }}
                <img src='{{d.subMainImage}}'>
            {{# }else{ }}
            <img src="">
            {{# } }}
        </div>
        <button class="layui-btn layui-btn-sm" onclick="wishEditVarMainImg_replaceImg(this)">替换图片</button>
    </div>
</script>
<script type="text/html" id="wishVarImgEdit_optStatusJs">
    <span id="wishVarImgEdit_optStatus_{{d.id}}"></span>
</script>

<script type="text/html" id="wishEditVariantImgIsTpl">
    {{# if(d.isPromotion){ }}
    <span>是</span>
    {{# }else{ }}
    <span>否</span>
    {{# } }}
</script>


<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/editVariantImage.js"></script>
    