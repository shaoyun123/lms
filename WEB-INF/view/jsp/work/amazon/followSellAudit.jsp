<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
    <title>跟卖审核</title>
    <style>
        .b1 {
            border: 1px solid #ccc
        }
        
        .text_l {
            text-align: left;
        }
        
        .gray {
            color: gray;
        }
        
        .skyblue {
            color: skyblue;
        }
        
        .mg_20 {
            margin: 20px
        }
        
        .lh36 {
            line-height: 36px;
        }
        
        .dis_flex {
            display: flex;
            justify-content: space-between;
        }

        .selectedLabel{
            padding:0px!important
        }

        .pd5{
            padding:5px;
        }

        .ml5{
            margin-left:5px
        }

        .fr{
            float: right;
        }
        .mg_20{
            margin:20px;
        }
        .hidden{
            display: none;
        }
        .pageSort{
            display: block;
            width: 100%;
            background:#fff;
            position: fixed;
            left: 100px;
            bottom: 0;
        }
        .font_blue{
            color:skyblue!important;
        }
    </style>

    <div class="layui-fluid" id="LAY-AmazonFollowSell">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="AmazonFollowSellForm" lay-filter="AmazonFollowSellForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select name="salesSite" lay-search id="followSell_search_salesSite"></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">开发专员</label>
                                    <div class="layui-input-block">
                                        <select xm-select="followSellAuditbizzOwnerIdInfo" name="bizzOwnerIdList" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="followSell_person_search_type">
                                            <option value="creatorIdList">创建人</option>
                                            <option value="auditorIdList">审核人</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select xm-select="followSell_person_search_select" name="followSell_person_search_select" xm-select-search id="followSell_person_search_select"
                                                xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="skuType">
                                            <option value="asinStr">子ASIN</option>
                                            <option value="parentAsinStr">父ASIN</option>
                                            <option value="title">标题</option>
                                            <option value="prodSSkuStr">商品sku</option>
                                            <option value="brandStr">品牌</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="skuValue" class="layui-input" placeholder="多个使用逗号分隔">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">审核备注</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="auditRemark" class="layui-input">
                                    </div>
                                </div>                               
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="cateType">
                                            <option value="root">第一类目排名</option>
                                            <option value="leaf">第二类目排名</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="CateRankStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="CateRankEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">品牌类型</label>
                                    <div class="layui-input-block">
                                        <select name="useType" lay-search>
                                            <option value="">全部</option>
                                            <option value="0">未注册</option>
                                            <option value="1">已注册</option>
                                            <option value="2">黑名单</option>
                                            <option value="-1">无品牌</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">购物车类型</label>
                                    <div class="layui-input-block">
                                        <select name="transType" lay-search>
                                            <option value="">全部</option>
                                            <option value="FBA">FBA</option>
                                            <option value="FBM">FBM</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">投诉次数</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="voteTotalTimesStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="voteTotalTimesEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="timeType">
                                            <option value="创建时间">创建时间</option>
                                            <option value="审核时间">审核时间</option>
                                            <option value="更新时间">更新时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="time">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">评分</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="rateLevStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="rateLevEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">评价数量</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="rateQuantityStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="rateQuantityEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">购减预</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="evalSubBuyStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="evalSubBuyEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">总体成本</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="totalCostStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="totalCostEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">商品状态</label>
                                    <div class="layui-input-block">
                                        <select name="isSale" lay-search>
                                            <option value="">全部</option>
                                            <option value="true">在售</option>
                                            <option value="false">停售</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">类目搜索</label>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm"  id="LAY-AmazonFollowSell-btn1">选择类目
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('LAY-AmazonFollowSell-div1','LAY-AmazonFollowSell-hidden1')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" name="smtCateId" id="LAY-AmazonFollowSell-hidden1">
                                </div>
                                <!-- 分页表格名称 -->
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-input-block ">
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="followSellAuditSearch" lay-filter="followSellAuditSearch">查询</button>
                                        <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空</button>
                                    </div>
                                </div>
                                <input type="hidden" name="limit" value="100">
                                <input type="hidden" name="page" value="1">
                                <input type="hidden" name="auditStatus" value="0">
                                <div class="layui-form-item" id="LAY-AmazonFollowSell-div1"></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab" lay-filter="followSellAuditTab" id="followSellAuditTab">
                            <div class="dis_flex">
                            <ul class="layui-tab-title">
                                <li class="layui-this" data-index="0">待审核(<span>0</span>)</li>
                                <li data-index="1">审核成功(<span>0</span>)</li>
                                <li data-index="2">审核失败(<span>0</span>)</li>
                            </ul>
                            <a href="http://47.91.141.44/epean_plugin.rar" target="_blank" lay-tips="亚马逊跟卖插件，下载后解压缩，打开chrome扩展程序导入使用" style="color: blue;"> 跟卖插件下载</a>
                            <div>
                                <button class="layui-btn layui-btn-normal layui-btn-sm" id="followSellbatchUpdate">批量更新</button>
                                <button class="layui-btn layui-btn-normal layui-btn-sm" id="followSellbatchAudit">批量审核</button>
                                <permTag:perm funcCode="followSellbatch_addFs_btn">
                                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="followSellbatch_addFs_btn">添加跟卖产品</button>
                                </permTag:perm>
                                <permTag:perm funcCode="followSellbatch_export_btn">
                                    <button type="button" class="layui-btn layui-btn-sm" id="followSellAudit_exportBtn">导出</button>
                                </permTag:perm>
                            </div>
                            </div>
                            <div class="layui-tab-content">
                                <div class="layui-tab-item layui-show">
                                    <table lay-filter="followSellAudit_table" class="layui-table" id="followSellAudit_table"></table>
                                    <div id="followSellAudit_Page" class="pageSort"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/html" id="followSellAuditimgtpl">
        <div>
            <img width="60" height="60" data-original="{{d.image||''}}" data-bigImg="{{d.bigImage||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        </div>
    </script>

    <script type="text/html" id="followSellAuditASINtpl">
        <div class="text_l {{d.asinValidFlag==0?'gray':d.asinValidFlag==1?'font_blue':'fBlack'}}" ><span>子:</span><span><a href="{{d.asinSrc}}" target="_black" class="{{d.asinValidFlag==0?'gray':d.asinValidFlag==1?'font_blue':'fBlack'}}">{{d.asin||""}}</a></span></div>
        <div class="text_l"><span>父:</span><span>{{d.parentAsin||""}}</span></div>
    </script>

<script type="text/html" id="followSellAuditBrandInfotpl">
    <div class="text_l"><span></span><span>{{d.brand||""}}</span></div>
    {{# if(d.useType ==0){ }}
    <div class="text_l"><span>未注册</span></div>
    {{# } }}
    {{# if(d.useType ==1){ }}
    <div class="text_l"><span>已注册</span></div>
    {{# } }}
    {{# if(d.useType ==2){ }}
    <div class="text_l"><span>黑名单</span></div>
    {{# } }}
    {{# if(d.useType ==3){ }}
    <div class="text_l"><span>未检测</span></div>
    {{# } }}
</script>
    
    <script type="text/html" id="followSellAuditTooltpl">
        {{# if(d.auditStatus!=1){ }}
        <button class="layui-btn layui-btn-xs layui-btn-normal"  lay-event="modifyProduct">修改</button>
        {{# } }}
        <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event="AuditProduct">审核</button>
        <button type="button" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="AuditProductLog" style="margin-left: 0px;">日志</button>
    </script>

    <script type="text/html" id="followSellAuditRanktpl">
        <div class="text_l"><span>1:</span><span>{{d.rootCateRank||""}}</span></div>
        <div class="text_l"><span>2:</span><span>{{d.leafCateRank||""}}</span></div>
    </script>

    <script type="text/html" id="followSellAuditEvaluationtpl">
        <div class="text_l"><span>评分:</span><span>{{d.rateLev||""}}</span></div>
        <div class="text_l"><span>数量:</span><span>{{d.rateQuantity||""}}</span></div>
    </script>
    
    <script type="text/html" id="followSellAuditprodSSkutpl">
        <div data-id="{{d.prodPId}}">
            <span class="pora copySpan">
                <a href="javascript:;" class="font_blue">{{d.prodSSku}}</a>
                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</button>
                    {{#  if(d.isSale == 0){ }}
                        <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                    {{#  } }}
            </span>
        </div>
    </script>

    <script type="text/html" id="followSellAuditPricetpl">
        <div class="text_l"><span>购物车价:</span><span>{{d.onlineCartPrice||""}}</span></div>
        <div class="text_l"><span>预估定价:</span><span>{{d.previewPrice||""}}</span></div>
    </script>

    <script type="text/html" id="followSellAuditPersontpl">
        <div class="text_l"><span>创建人:</span><span>{{d.creator||""}}</span></div>
        <div class="text_l"><span>归属人:</span><span>{{d.bizzOwner||""}}</span></div>
        <div class="text_l"><span>审核人:</span><span>{{d.auditor||""}}</span></div>
    </script>

    <script type="text/html" id="followSellAuditTimetpl">
        <div class="text_l"><span>创建时间:</span><span>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div class="text_l"><span>更新时间:</span><span>{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </script>

    <script type="text/html" id="followSellAudit_auditProduct">
        <form class="layui-form mg_20" lay-filter="followSellAuditauditForm" id="followSellAuditauditForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">审核结果</label>
                <div class="layui-input-block">
                    <input type="radio" name="auditStatus" value="0" title="未审核">
                    <input type="radio" name="auditStatus" value="1" title="成功">
                    <input type="radio" name="auditStatus" value="2" title="失败">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">审核备注</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="auditRemark">
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellAuditauditSubmit" id="followSellAuditauditSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="followSellAudit_modifyProduct">
        <form class="layui-form mg_20" lay-filter="followSellAuditeditForm" id="followSellAuditeditForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">商品sku</label>
                <div class="layui-input-block">
                    <input type="text" name="prodSSku" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">多个一跟卖数量</label>
                <div class="layui-input-block">
                    <input type="number" name="packNum" class="layui-input">
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="followSellAuditeditSubmit" id="followSellAuditeditSubmit"></button>
        </form>
    </script>

<!-- 添加跟卖池start-->
<script type="text/html" id="followSell_bacthAddFsLayer">
    <div style="padding-top: 20px;">
        <form class="layui-form" id="followSell_bacthAddForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color: red;">*</span>站点:</label>
                <div class="layui-input-block">
                    <div class="layui-form-label selectedLabel ml5">
                        <select name="salesSite" lay-search id="followSell_bacthAddFs_salesSite"></select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span style="color: red;">*</span>ASIN:</label>
                <div class="layui-input-block">
                    <input type="text" name="asinList" class="layui-input" style="width: 90%;display: inline;" placeholder="多个ASIN之间用逗号隔开,最多支持300个asin">
                    <button class="layui-btn layui-btn-normal layui-btn-sm" type="button" id="followSell_asinList_search_btn">搜索</button>
                </div>
            </div>
            <div class="layui-form-item" style="padding-left: 10px;">
                <button class="layui-btn layui-btn-normal layui-btn-sm" type="button"  id="followSell_addFsPool_btn">批量加入</button>
            </div>
            <div class="layui-form-item">
                <table class="layui-table" id="followSell_addFsPool_table" lay-filter="followSell_addFsPool_table"></table>
            </div>
        </form>
    </div>
</script>
<!--添加至跟卖池end-->
<script type="text/html" id="followSell_addFsPool_prodSSku_tpl">
    <input type="text" name="prodSSku" class="layui-input" id="followSell_sku_{{d.asin}}" value="{{d.prodSSku||''}}" >
</script>
<script type="text/html" id="followSell_addFsPool_packNum_tpl">
    <input type="number" name="buyNumber" class="layui-input" id="followSell_packNum_{{d.asin}}" min="1">
</script>
<script type="text/html" id="followSell_addFsPool_operate_tpl">
    <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event="addToPool" title="添加至跟卖池">加入</button>
</script>

    <script type="text/html" id="followSellAuditLogPop">
        <table lay-filter="followSellAuditLogTable" class="layui-table" id="followSellAuditLogTable"></table>
    </script>

    <script src="${ctx}/static/js/work/amazon/followSellAudit.js"></script>