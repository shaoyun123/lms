<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>wish修改标题/TAGS/描述</title>
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

    .dis_flex_around{
        display:flex;
        justify-content: space-around;
    }

    .dis_flex_start{
        display:flex;
        justify-content: flex-start;
    }

    .dis_flex_end{
        display:flex;
        justify-content: flex-end;
    }

    #LAY-wish-decriptInfo .layui-form-radio{
        margin: 0;
    }
    .w_50{
        width: 50% !important;
    }
    .W_60{
        width: 60% !important;
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
       min-height:200px;
    }

    .icon_group i{
        color: #ccc;
        line-height: 20px;
        cursor:pointer;
    }

    .pl_10{
        padding-left: 10px;
    }

    #LAY-wish-decriptInfo .layui-card-body form{
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e6e6 !important;
    }
</style>
<div class="layui-fluid" id="LAY-wish-decriptInfo">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form id="decriptInfoForm" lay-filter="decriptInfoForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                            <select id="wish_modifyTitle_pskuSearchType">
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
                                     <div class="layui-col-md3 layui-col-lg3">
                                         <label class="layui-form-label">店铺</label>
                                         <div class="layui-input-block" lay-filter="component-form-element">
                                             <select class="users_hp_store_multi" xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                             </select>
                                         </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                                        <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="decriptInfoBtn">查询</button>  
                                    </div>
                                </div>                          
                                <div id="wishModDescriptionInfoCustomsContent"></div>
                        
                        </form>
                        <form id="applyForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md4 layui-col-lg4 dis_flex_start pl_50">
                                        <div>
                                            <label>标题</label>
                                            <input type="text" name="origin_title"  class="layui-input W_60 dis_inline">
                                        </div>
                                        <div>
                                                <label>替换为</label>
                                                <input type="text" name="new_title"  class="layui-input W_60 dis_inline">
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3 dis_flex_around">
                                            <div>
                                                <label>TAGS</label>
                                                <input type="text" name="origin_tags" class="layui-input W_60 dis_inline">
                                            </div>
                                            <div>
                                                    <label>替换为</label>
                                                    <input type="text" name="new_tags"  class="layui-input W_60 dis_inline">
                                            </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4 dis_flex_end">
                                                <div>
                                                    <label>描述</label>
                                                    <input type="text" name="origin_descrip"  class="layui-input W_60 dis_inline">
                                                </div>
                                                <div>
                                                        <label>替换为</label>
                                                        <input type="text" name="new_descrip"  class="layui-input W_60 dis_inline">
                                                </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" lay-submit type="button" id="wishModTitle_applyBtn" lay-filter="wishModTitle_applyBtn">应用</button>
                                    </div>
                                </div>
                        </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex pl_10">
                         <div>
                            <div class="numCount" title="数量">数量(<span id="modifyTitle_span_wish"></span>)</div>
                        </div>
                        <div>
                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" id="wish_modifySubtitle">批量修改</button>
                        </div>
                    </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="modifyTitle_table" lay-filter="modifyTitle_table"></table>
                            <script type="text/html" id="wish_isPromotion">
                                {{# if(d.id!==-1){ }}
                                {{# if(d.isPromotion){ }}
                                是
                                {{# }else{ }}
                                否
                                {{# } }}
                                {{# } }}
                            </script>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="wish_online_hide_table" style="display: none;"></table>
<script>
        function editTitle(obj){
            console.log(obj);
            obj.addClass('hide').siblings('textarea').removeClass('hide');
        }

        // function editicon(obj){
        //     console.log(obj);
        //     console.log(obj.parents('.icon_group').siblings('span').addClass('hide').siblings('textarea').removeClass('hide'));
        //     obj.parents('.icongroup').siblings('textarea').removeClass('hide');
        // }

        function submitedit(obj){
            alert('触发blur')
            var value = obj.val();
            obj.addClass('hide').siblings('div').text(value).removeClass('hide');
        }


</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/modifyDescriptInfo.js"></script>
<script type="text/html" id="wishOnline_batch_titleTags">
    <div class="layui-form"><input type="checkbox" lay-skin="primary" /></div>
</script>

<script type="text/html" id="title_tpl">
   {{# if (d.id  == -1) { }}
     <div class="icon_group"><i class="layui-icon" title="还原">&#xe669;</i><i class="layui-icon" title="删除">&#xe640;</i>  </div>
   {{# } else { }}
    <div onclick="editTitle($(this));" class="tags_js col_js">{{d.tags}}</div>
    <textarea value="{{d.tags}}" class="layui-textarea hide all_textarea" name="tags_js" autofocus="autofocus" >{{d.tags}}</textarea>
    {{# } }}
</script>
<script type="text/html" id="new_title">
    {{# if (d.id  == -1) { }}
     <div class="icon_group"></i><i class="layui-icon" title="还原">&#xe669;</i><i class="layui-icon" title="删除">&#xe640;</i>  </div>
   {{# } else { }}
   <div onclick="editTitle($(this));" class="title_js col_js">{{d.title || ''}}</div>
    <textarea class="layui-textarea hide ifFocusInput" data-prodpid="{{d.prodPId}}" style="height:28px" value="{{d.title || ''}}" name="title_js">{{d.title || ''}}</textarea>
    {{# } }}
</script>
<script type="text/html" id="new_proDec">
    {{# if (d.id  == -1) { }}
    <div class="icon_group"><i class="layui-icon restore" title="还原">&#xe669;</i><i class="layui-icon delete" title="删除">&#xe640;</i>  </div>
    {{# } else { }}
    <div onclick="editTitle($(this));" class="description_js col_js">{{d.prodDesc || ''}}</div>
    <textarea class="layui-textarea hide" style="height:28px" value="{{d.prodDesc || ''}}" name="description_js">{{d.prodDesc || ''}}</textarea>
    {{# } }}
</script>
