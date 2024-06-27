<!-- 20201112 移除 旧版跟卖-->
<!-- 20201124 恢复 旧版跟卖-->
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>amazon跟卖</title>
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
</style>

<div class="layui-fluid" id="LAY-AmazonFollowSell">
<div class="layui-row layui-col-space15">
<div class="layui-col-lg12 layui-col-md12">
<div class="layui-card">
<div class="layui-card-body">
<form class="layui-form" id="AmazonFollowSellForm" lay-filter="AmazonFollowSellForm">
<div class="layui-form-item">
<div class="layui-col-md2 layui-col-lg2">
<label class="layui-form-label">部门</label>
<div class="layui-input-block">
<select name="orgTree" id="AmazonFollowSell_orgTree" lay-filter="AmazonFollowSellorgTree" class="orgs_hp_custom" lay-search></select>
</div>
</div>
<div class="layui-col-lg2 layui-col-md2">
<label class="layui-form-label">销售员</label>
<div class="layui-input-block">
<select name="userList" lay-filter="AmazonFollowSellUserList" class="users_hp_custom" data-rolelist="amazon专员" lay-search>
</select>
</div>
</div>
<div class="layui-col-lg2 layui-col-md2">
<label class="layui-form-label">店铺</label>
<div class="layui-input-block">
<select name="storeAcctId" id="AmazonFollowSell_storeAcct" required lay-verify="required" lay-filter="AmazonFollowSell_selAcct" class="store_hp_custom" class="layui-select" data-platcode="amazon" lay-search>
<option value="">全部</option>
</select>
</div>
</div>
<div class="layui-col-lg2 layui-col-md2">
<label class="layui-form-label">站点</label>
<div class="layui-input-block">
<select name="salesSite" id="AmazonFollowSell_amazonSite" required lay-verify="required" lay-search>
</select>
</div>
</div>
<div class="layui-col-lg2 layui-col-md2">
<div class="layui-form-label labelSel">
<select name="searchStrType" class="layui-select">
<option value="title">标题</option>
<option value="sellerSkuStr">店铺SKU</option>
<option value="asinStr">ASIN</option>
</select>
</div>
<div class="layui-input-block">
<input type="text" name="searchStr" class="layui-input" placeholder="多个使用逗号分隔">
</div>
</div>
<input class="disN" type="text" name="limit" value="10">
<input class="disN" type="text" name="page" value="1">
<input class="disN" type="text" name="tablename" value="draft">
<!-- 分页表格名称 -->


<div class="layui-col-lg2 layui-col-md2">
    <div class="layui-input-block">
        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="AmazonFollowSellSearch" lay-filter="AmazonFollowSellSearch">查询
        </button>
    </div>
</div>
</div>
</form>
</div>
</div>
<div class="layui-card">
    <div class="layui-card-body">
        <div class="layui-tab" lay-filter="AmazonFollowSell_tab" id="AmazonFollowSell_tab">
            <div style="height:42px;line-height:42px;">
                <ul class="layui-tab-title">
                    <li class="layui-this" data-index="draft">草稿箱(<span>0</span>)</li>
                    <li data-index="notInFollowSell">跟卖计划(<span>0</span>)</li>
                    <li data-index="inFollowSell">取消跟卖计划(<span>0</span>)</li>
                    <li data-index="wait">跟卖等待(<span>0</span>)</li>
                    <li data-index="fail">发布失败(<span>0</span>)</li>
                    <li data-index="succ">发布成功(<span>0</span>)</li>
                    <li data-index="online">在线商品(<span>0</span>)</li>
                </ul>
            </div>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_batchSell">批量跟卖</button>
                        </div>
                    </div>

                    <table lay-filter="AmazonFollowSell_table_draft" class="layui-table" id="AmazonFollowSell_table_draft"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                        </div>
                    </div>

                    <table lay-filter="AmazonFollowSell_table_notInFollowSell" class="layui-table" id="AmazonFollowSell_table_notInFollowSell"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                        </div>
                    </div>
                    <table lay-filter="AmazonFollowSell_table_inFollowSell" class="layui-table" id="AmazonFollowSell_table_inFollowSell"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                        </div>
                    </div>

                    <table lay-filter="AmazonFollowSell_table_wait" class="layui-table" id="AmazonFollowSell_table_wait"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_batchSell">批量跟卖</button>
                        </div>
                    </div>
                    <table lay-filter="AmazonFollowSell_table_fail" class="layui-table" id="AmazonFollowSell_table_fail"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_batchSell">批量跟卖</button>
                        </div>
                    </div>
                    <table lay-filter="AmazonFollowSell_table_succ" class="layui-table" id="AmazonFollowSell_table_succ"></table>
                </div>
                <div class="layui-tab-item">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_addFollowSell">添加跟卖产品</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr AmazonFollowSell_btn_batchCancleSell">批量取消跟卖</button>
                        </div>
                    </div>
                    <table lay-filter="AmazonFollowSell_table_online" class="layui-table" id="AmazonFollowSell_table_online"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="AmazonFollowSell_page"></div>
</div>
</div>
</div>

<script type="text/html" id="AmazonFollowSell_imageTpl">
    <div>
        <img width="60" height="60" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="AmazonFollowSell_productInfo_tpl">
    <div class="text_l"><span class="gray"> 标题:{{ d.title || '' }}({{ d.oldNewStatus || '' }})</span></div>
    <div class="text_l"><span class="gray"> ASIN:</span><a class="skyblue" target="_blank" href="{{d.asinSrc}}">{{d.asin||''}}</a></div>
</script>


<script type="text/html" id="AmazonFollowSell_Time_tpl">
    <div class="text_l"><span>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</span></div>
    <div class="text_l"><span>更新:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</span></div>
</script>

<!--草稿箱 操作 -->
<script type="text/html" id="AmazonFollowSell_draft_op">
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="AmazonFollowSell_event_startFollowSell">开始跟卖</button>
    <button class="layui-btn layui-btn-xs" lay-event="AmazonFollowSell_event_editDraft">编辑</button>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="AmazonFollowSell_event_delete">删除</button>
</script>

<!--在线商品 操作 -->
<script type="text/html" id="AmazonFollowSell_online_op">
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="AmazonFollowSell_event_cancleFollowSell">取消跟卖</button>
</script>

<script type="text/html" id="AmazonFollowSell_editFollowSell_tpl">
    <div id="editFollowSell_tpl_id">

    </div>
</script>

<script type="text/html" id="editFollowSell_tpl_id_tpl">
    <div class="layui-card mg_20">
        <div class="layui-row dis_flex">
            <div class="layui-col-lg8 layui-col-md8">
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block lh36">
                        {{storeAcct||''}}
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block lh36">
                        {{salesSite||''}}
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">ASIN</label>
                    <div class="layui-input-block lh36">
                        {{asin||''}}
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">品牌</label>
                    <div class="layui-input-block lh36">
                        {{brand||''}}
                    </div>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">标题</label>
                    <div class="layui-input-block lh36">
                        {{title||''}}
                    </div>
                </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
                <img width="180" height="180" src="{{image}}" class="b1">
            </div>
        </div>
    </div>
    <div class="layui-card mg_20">
        <form class="layui-form" id="editAmazonFollowSellForm" lay-filter="editAmazonFollowSellForm">
            <input type="number" class="disN" name="id" value="{{id}}">
            <input type="text" class="disN" name="detailType" value="">
            <div class="layui-form-item">
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">SKU</label>
                    <div class="layui-input-block">
                        <input name="sellerSku" required lay-verify="required" class="layui-input" type="text" value="{{sellerSku}}">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">售价({{currency}})</label>
                    <div class="layui-input-block">
                        <input name="price" required lay-verify="required" class="layui-input" type="text" value="{{price ||'' }}">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">数量</label>
                    <div class="layui-input-block">
                        <input name="stock" required lay-verify="required" class="layui-input" type="number" oninput="this.value = this.value.replace(/[^0-9]/g, '');" value="{{stock ||'' }}">
                    </div>
                </div>
            </div>
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">运输方式</label>
                <div class="layui-input-block">
                    <input type="radio" name="transType" value="FBM" title="FBM" checked>
                </div>
            </div>
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">物品状况</label>
                <div class="layui-input-block">
                    <input name="oldNewStatus" class="layui-input" type="text" value="{{oldNewStatus || 'New'}}">
                </div>
            </div>
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">物品状况描述</label>
                <div class="layui-input-block">
                    <input name="oldNewDesc" class="layui-input" type="text" value="{{oldNewDesc || 'New'}}">
                </div>
            </div>

            <button type="button" class="disN" lay-submit="" id="AmazonFollowSellDetail_edit" lay-filter="AmazonFollowSellDetail_edit">修改详情
            </button>
        </form>
    </div>
</script>

<!-- 添加跟卖产品 页面-->
<script type="text/html" id="AmazonFollowSell_layer_addFollowSell">
    <div class="layui-card">
        <form class="layui-form mg_50" id="addAmazonFollowSellForm" lay-filter="addAmazonFollowSellForm">
            <div class="layui-form-item">
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <select name="storeAcctId" id="addAmazonFollowSell_storeAcct" required lay-verify="required" lay-filter="addAmazonFollowSell_storeAcct" class="store_hp_custom" data-platcode="amazon" lay-search>
                            <option value="">全部</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                        <select name="salesSite" id="addAmazonFollowSell_amazonSite" required lay-verify="required" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">ASIN</label>
                    <div class="layui-input-block">
                        <input type="text" name="asinStr" class="layui-input" placeholder="多个使用逗号分隔">
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="addAmazonFollowSell_asinSearch" lay-filter="addAmazonFollowSell_asinSearch">查询
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div class="layui-card">
        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="addAmazonFollowSell_btn_addListToDraft">添加至草稿箱
        </button>
    </div>
    <div class="layui-card">
        <table lay-filter="AmazonFollowSell_table_asinTable" class="layui-table" id="AmazonFollowSell_table_asinTable"></table>
    </div>
</script>

<!-- 开始跟卖 页面-->
<script type="text/html" id="AmazonFollowSell_layer_startFollowSell">
    <form class="layui-form mg_50" id="startSellAmazonFollowSellForm" lay-filter="startSellAmazonFollowSellForm">
        <label class="layui-form-label">选择模式:</label>
        <input type="radio" name="sellType" value="立即跟卖" title="立即跟卖" checked>
        <input type="radio" name="sellType" value="定时计划跟卖" title="加入“定时计划”">
        <select class="layui-select" name="planId" id="startSellAmazonFollowSellForm_planId">

        </select>
    </form>
</script>

<!--添加跟卖产品 操作 -->
<script type="text/html" id="addAmazonFollowSell_op">
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="addToDraft">添加到草稿箱</button>
</script>

<script type="text/html" id="addAmazonFollowSell_productInfo_tpl">
    <div class="text_l"><span class="gray"> 标题:</span><a class="skyblue" target="_blank" href="{{d.asinSrc}}">{{ d.title || '' }}({{ d.oldNewStatus || '' }})</a></div>
    <div class="text_l"><span class="gray"> ASIN:{{d.asin||''}}</span></div>
</script>

<script type="text/html" id="addAmazonFollowSell_detailInfo_tpl">
    <div class="text_l"><span class="gray"> Brand:{{d.brand||''}}</span></div>
    <div class="text_l"><span class="gray"> Manufacturer:{{d.manufacturer||''}}</span></div>
    <div class="text_l"><span class="gray"> MPN:{{d.mpn||''}}</span></div>
    <div class="text_l"><span class="gray"> Model:{{d.model||''}}</span></div>
</script>

<script src="/lms/static/js/publishs/amazon/followSell.js"></script>