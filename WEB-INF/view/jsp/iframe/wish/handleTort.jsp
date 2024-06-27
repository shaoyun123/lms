<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>wish侵权处理(该页面已废弃)</title>
<style>
    .pl_110{
        padding-left:110px;
    }   
     .pl_50{
        padding-left:50px;
    }
    .ml_0{
        margin-left: 0;
    }
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }
    #LAY-wish-tort .layui-form-radio{
        margin: 0;
    }
    .w_50{
        width: 50% !important;
    }
    .dis_inline{
        display: inline-block;
    }
    .border_none{
        border:none !important;
    }
    .hide{
        display: none;
    }

    .layui-textarea{
       min-height:0;
    }

    .icon_group i{
        color: #ccc;
        line-height: 20px;
        cursor:pointer;
    }
    .mt_10{
        margin-top:10px;
    }

    #LAY-wish-tort .layui-input-block{
        margin-left:85px !important;
    }
    #LAY-wish-tort .layui-form-label{
        width: auto !important;
    }
</style>
<div class="layui-fluid" id="LAY-wish-tort">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form id="tortForm" lay-filter="tortForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                            <select id="wish_handleTort_pskuSearchType">
                                                <option value="0">模糊</option>
                                                <option value="1">精确</option>
                                            </select>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                         <label class="layui-form-label">部门</label>
                                         <div class="layui-input-block">
                                             <select name="orgId" lay-filter="orgs_hp_wishModifyStore" class="orgs_hp_custom" lay-search=""><option value="">请选择</option></select>
                                         </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                         <label class="layui-form-label">销售人员</label>
                                         <div class="layui-input-block">
                                             <select name="saleName"  class="users_hp_custom" data-rolelist="wish专员" lay-filter="users_hp_wishModifyStore" lay-search="">
                                                 <option value="">请选择</option>
                                             </select>
                                         </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                         <label class="layui-form-label">店铺</label>
                                         <div class="layui-input-block" lay-filter="component-form-element">
                                             <select xm-select="selectAttr_store" class="users_hp_store_multi" name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                             </select>
                                         </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">是否下线</label>
                                        <div class="layui-input-block">
                                        <select id="wish_handleTort_isSalse">
                                            <option value="" >全部</option>
                                            <option value="1">在线</option>
                                            <option value="0">下线</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="handleTortBtn">查询</button>
                                    </div>
                                </div>                                                 
                        </form>
                        <div class="layui-card mt_10">处理规则：1.主辅图全部替换为空白图片 2.子SKU有图的全部换成空白图片 3.标题随机10~20个英文字符 4.tags随机0~10个英文字符 5.描述随机三行，每行10~20个英文字符 6.下架listing</div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex">
                         <div>
                            <div class="numCount" title="数量">数量(<span id="handleTort_span_wish"></span>)</div>
                        </div>
                        <div class="layui-form">
                            <%--<input type="checkbox"  title="已下架" lay-skin="primary" id="wish_isSales">--%>
                            <input type="checkbox"  title="同时应用黄钻产品" lay-skin="primary" id="wish_promotion" checked>
                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" id="wish_tort">批量修改</button>
                        </div>
                    </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="tort_table" lay-filter="tort_table"></table>
                            <script type="text/html" id="wish_isPromotion">
                                {{# if(d.isPromotion){ }}
                                是
                                {{# }else{ }}
                                否
                                {{# } }}
                            </script>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="wish_online_hide_table" style="display: none;"></table>

<script type="text/javascript" src="${ctx}/static/js/publishs/wish/handleTort.js"></script>
<script type="text/html" id="wishOnline_deprecated">
    <div class="layui-form"><input type="checkbox" lay-skin="primary"/></div>
</script>


