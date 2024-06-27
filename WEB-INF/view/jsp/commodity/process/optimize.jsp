<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>商品优化</title>
<style>
    .update_sellerNote{
        color: #009688;
        cursor: pointer;
    }
    table.colspantable td{
        border:0px;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" id="product_optimize__searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">责任人</label>
                                <div class="layui-input-block">
                                    <select name="product_optimize_developer" lay-search  id="product_optimize_developer"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">需求平台</label>
                                <div class="layui-input-block">
                                    <select name="platList" lay-filter="product_optimize_platList_sel" id="product_optimize_platList_sel" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">需求人</label>
                                <div class="layui-input-block">
                                    <select name="product_optimize_seller" lay-search id="product_optimize_seller"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">优化方向</label>
                                <div class="layui-input-block">
                                    <select name="optimReason" id="product_optimize_optimReason" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">父SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="product_optimize_parentSku" placeholder="请输入商品父sku,多个以,分割">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品中文</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="product_optimize_cnTitle">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">发起时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input productOptimizeTime" id="product_optimize_timeCycle">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="product_optimize_deal_platcode_sel" id="product_optimize_deal_platcode_sel" lay-search></select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="product_optimize_deal_status_sel" id="product_optimize_deal_status_sel" lay-search>
                                        <option value="">平台销售处理状态</option>
                                        <option value="3">已处理</option>
                                        <option value="2">处理中</option>
                                        <option value="1">未处理</option>
                                        <option value="0">无需处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售自己处理状态</label>
                                <div class="layui-input-block">
                                    <select name="product_optimize_deal_platcode_sel" id="product_optimize_myself_deal_status_sel" lay-search>
                                        <option value="">销售处理状态</option>
                                        <option value="0">待我处理</option>
                                        <option value="1">我已处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="product_optimize_product_status_sel" id="product_optimize_product_status_sel" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" id="product_optimize_searchBtn">查询</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="product_optimize_my_res_searchBtn" title="商品优化的责任人是我">我负责的</button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="product_optimize_my_sell_searchBtn" title="商品优化的需求是我提出来的">我提出的</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格渲染 -->
            <div class="layui-card" id="optimizeCard">
                <div class="layui-tab" lay-filter="product_optimize_tab">
                        <ul class="layui-tab-title layui-card-header">
                            <li class="layui-this" optim_status="1" >优化处理中(<span id="product_optimize_onDeal"></span>)</li>
                            <li optim_status="2">优化成功(<span id="product_optimize_dealSuccess"></span>)</li>
                            <li optim_status="3">优化失败(<span id="product_optimize_dealFail"></span>)</li>
                            <li optim_status="">全部(<span id="product_optimize_dealAll"></span>)</li>
                        </ul>
                        <div class="layui-tab-content layui-card-body">
                            <table class="layui-table" id="product_optimize_dataTable" lay-filter="product_optimize_dataTable"></table>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 商品优化历史 modal -->
<script type="text/html" id="optimizeHistoryRecordModalLayer">
    <div class="p20">
        <ul class="layui-timeline" id="optimizeHistoryRecordTimeline"></ul>
    </div>
</script>
<!--父商品图片-->
<script type="text/html" id="optimizeImgTpl">
    {{# if(d.imgUri != null){ }}
    <img  class="img_show_hide imgCss lazy imgBorder" data-original="${tplIVP}{{d.imgUri}}" data-onerror="layui.admin.img_noFind()">
    {{# }else{ }}
    <img  class="img_show_hide imgCss lazy imgBorder" data-original="${ctx}/static/img/kong.png" data-onerror="layui.admin.img_noFind()">
    {{# } }}
</script>
<!--商品-->
<script type="text/html" id="product_optimize_product_tpl">
    {{d.cnTitle || ''}}
    {{# if (d.devType) { }}
    <span class="hp-badge layui-bg-blue  fr layTitle" lay-title="{{d.devType}}">{{getAliasOfDevType(d.devType)}}</span>
    {{# } }}
    {{#  if(d.isSale == 0){ }}
    <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
    {{#  } }}
    <br/>
    <a href="javascript:void(0);"  id="prodDetail" data-id={{d.prodPId}}  title="查看模板详情" style="color: #428bca;">{{d.pSku}}</a>
</script>
<!--需求方,责任人-->
<script type="text/html" id="product_optimize_seller_tpl">
    <div style="text-align: left;padding-left: 5px;">
        需求：<span style="color: #737679 !important;"> [ {{d.platList || ''}} ]</span> {{d.seller || ''}}<br/>
        责任：{{d.developer || ''}}
    </div>
</script>
<!--链接-->
<script type="text/html" id="product_optimize_refLink_tpl">
    {{# if(d.refLink != null && d.refLink !='' ){ }}
            {{# if(d.refLink.indexOf("http")>-1 ){ }}
                  <a href="{{d.refLink}}" target="_blank" title="竞品链接" style="color: #428bca;">竞品链接</a>
            {{# }else{ }}
                   <a href="http://{{d.refLink}}" target="_blank" title="竞品链接" style="color: #428bca;">竞品链接</a>
            {{# }}}
    {{# }}}
    <br/>
    <a href="{{d.firstSupplyUrl}}" target="_blank" title="父商品下的第一个子商品的采购链接" style="color: #428bca;">
        采购链接
    </a>
</script>
<!--需求备注-->
<script type="text/html" id="product_optimize_sellerNote_tpl">
    <div style="text-align: left;text-indent: 2em;" class="product_optimize_note_tip" sellerNote="{{d.sellerNote|| ''}}">
        {{# if(d.sellerNote != null && d.sellerNote !='' ){ }}
                {{# if(d.sellerNote.length > 50){ }}
                        {{d.sellerNote.substring(0,50)}}<span>... </span>
                {{# }else{ }}
                    {{d.sellerNote}}
                {{# } }}
        {{# }else { }}
            &nbsp;
        {{# }}}
        &nbsp; &nbsp;   <i class="layui-icon update_sellerNote" title="修改需求备注" lay-event="product_optimize_update_sellerNote"></i>
    </div>

</script>
<!--开发备注-->
<script type="text/html" id="product_optimize_devNote_tpl">
    <div style="text-align: left;text-indent: 2em;"  class="product_optimize_note_tip" sellerNote="{{d.devNote|| ''}}">
        {{# if(d.devNote != null && d.devNote !='' ){ }}
                {{# if(d.devNote.length > 50){ }}
                         {{d.devNote.substring(0,50)}}<span>... </span>
                {{# }else{ }}
                         {{d.devNote}}
                {{# }}}
        {{# }else { }}
            &nbsp;
        {{# }}}
        &nbsp;&nbsp;<i class="layui-icon update_sellerNote" title="修改处理备注"  lay-event="product_optimize_update_sellerNote"></i>
    </div>

</script>
<!--平台效果展示-->
<script type="text/html" id="product_optimize_optimizeDeal_tpl">
    <table class="layui-table colspantable" style="width: 470px;margin-left: -5px" id="product_optimize_optimizeDeal_tpl_table" >
        {{#  layui.each(d.platDealList, function(index, item){ }}
                 {{#  if(index ==d.platDealList.length-1){ }}
                    <tr style="">
                 {{#  }else{ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important">
                 {{#  } }}
                 {{#  if(d.optimStatus == 2 && item.procStatus != "已处理"){ }}
                         <td style="width:70px;padding-left: 5px;cursor: pointer;" title="点击进行平台批处理" class="product_optimize_palt_batch_deal" platcode=" {{item.platCode}}" rid="{{d.id}}" pstatus="{{d.optimStatus}}" tstatus="{{item.procStatus}}">
                 {{#  }else{ }}
                    <td style="width:70px;padding-left: 5px;">

                 {{#  } }}
                    {{item.platCode}}
                </td>
                <td style="width:70px;text-align: center;" tips="{{item.nodealPerson || '' }}" class="product_optimize_nodealperson_tip">
                    {{item.procStatus}}
                    <br><span style="color: #999;"> [{{item.dealPerson}}/{{item.salePerson}}]</span>
                </td>
                <td style="width:70px;text-align: center;">
                    {{item.differentMoney || '' }}
                </td>
                <td style="width:90px;text-align: center;" title="优化前15天销量统计"> {{item.soldNumBefore}}</td>
                <td style="width:110px;text-align: center;" title="优化后每15天销量统计">{{item.soldNumAfter}}</td>
            </tr>
        {{#  }); }}
    </table>
</script>
<!--时间处理-->
<script type="text/html" id="optimizeTimeTpl">
    <div style="text-align: left;padding-left: 5px;">
        发起：{{ Format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
        一审：{{ Format(d.auditTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
        回复：{{ Format(d.devProcTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
    </div>
</script>
<!-- 工具条模板 -->
<script type="text/html" id="prodOptimizeTableBar">
    {{# if(d.optimStatus != null && d.optimStatus==1 && d.hasDelete == 1){ }}
        <a class="layui-btn layui-btn-xs" lay-event="product_optimize_revocation">撤销</a>&nbsp;<br/>
    {{# }}}
        <a class="layui-btn layui-btn-xs" lay-event="product_optimize_optimizeDeal">优化处理</a><br/>
    <a class="layui-btn layui-btn-xs" lay-event="product_optimize_historyRecord">历史记录</a>
</script>
<!-- 商品优化处理 modal -->
<script type="text/html" id="optimizeDealModalLayer">
    <div class="p20">
        <form action="" class="layui-form" id="optimizeDealForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">处理结果</label>
                <div class="layui-input-block">
                    <input type="radio" name="optimStatus" value="2" title="优化成功" checked="">
                    <input type="radio" name="optimStatus" value="1" title="优化处理中">
                    <input type="radio" name="optimStatus" value="3" title="优化失败">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">处理备注<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <textarea name="devNote" placeholder="请输入备注内容" class="layui-textarea" id="optimizeDealForm_devNote"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="optimizeDealBtn" id="optimizeDealBtn">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/optimize.js"></script>