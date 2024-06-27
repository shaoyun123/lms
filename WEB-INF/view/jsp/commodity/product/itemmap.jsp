<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>类目映射</title>
<style>
 #LAY-commodity-catalog-itemmap .layui-btn{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
 }
 #LAY-commodity-catalog-itemmap .layui-form-radio>i {
    margin-right: 2px;
    font-size: 16px;
 }
 #LAY-commodity-catalog-itemmap .layui-form-item {
    margin-bottom: 2px;
    clear: both;
}
 #shopeeSpecialLayerId {
    overflow: visible;
 }
</style>
<div class="layui-fluid" id="LAY-commodity-catalog-itemmap">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="mappingSearchForm" class="layui-form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <div class="layui-form" lay-filter="component-form-element">
                                        <input type="radio" name="platCate" value="smtItemMap" title="SMT类目"  checked lay-filter="im_radio">
                                        <input type="radio" name="platCate" value="fyndiqItemMap" title="fyndiq类目" lay-filter="im_radio">
                                        <%--<input type="radio" name="platCate" value="amazonItemMap" title="Amazon类目">--%>
                                       <!-- <input type="radio" name="platCate" value="shopeeItemMap" title="Shopee类目" lay-filter="im_radio"> -->
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item" id="itemMapSelectSort">
                                <label class="layui-form-label">选择分类</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-primary" type="button">选择分类</button>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('choosedCateShow','itemmap_choosed_cate_id_input')" style="cursor:pointer" title="删除产品类目"></i>
                                    <span id="choosedCateShow"></span>
                                    <input type="hidden" name="checkedCateId" class="layui-input" id="itemmap_choosed_cate_id_input">
                                </div>
                            </div>
                            <div class="layui-form-item disN" id="itemMapSearchType">
                                <div class="layui-inline">
                                    <label class="layui-form-label" style="width: 90px;">fyndiq分类id</label>
                                    <div class="layui-input-inline" style="width:320px">
                                        <input type="number" name="fyndiqCateId" class="layui-input" placeholder="请输入fyndiq分类id查询">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item disN"  id="itemMapShopeeType">
                                <div class="layui-inline">
                                    <label class="layui-form-label">shopee站点</label>
                                    <div class="layui-input-inline" style="width:70px">
                                        <select name="shopeeSearchSite" lay-search>
                                            <option value="CNSC">CNSC</option>
                                            <option value="TH">泰国</option>
                                            <option value="TW">台湾</option>
                                            <option value="ID">印尼</option>
                                            <option value="SG">新加坡</option>
                                            <option value="PH">菲律宾</option>
                                            <option value="MY">马来西亚</option>
                                            <option value="VN">越南</option>
                                            <option value="BR">巴西</option>
                                            <option value="MX">墨西哥</option><!-- todo 其实可以来自枚举 -->
                                            <option value="CL">智利</option>
                                            <option value="CO">哥伦比亚</option>
                                            <option value="PL">波兰</option>
                                            <option value="ES">西班牙</option>
                                            <option value="FR">法国</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <label class="layui-form-label" style="width: 90px;">Shopee分类id</label>
                                    <div class="layui-input-inline" style="width:320px">
                                        <input name="shopeeSearchId" class="layui-input" placeholder="请输入shopee分类id查询,支持逗号分隔查询">
                                    </div>
                                </div>
                            
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">&nbsp;</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="cateMappingSearchBtn">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary" id="cateMappingResetBtn">清空</button>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="itemmapCard">
                <div class="layui-card-header disN" id="itemmapCard_header">
                   <span class="layui-btn layui-btn-sm" id="setShopeeSpecialBtn">设置shopee特货</span>
                   <span class="layui-btn layui-btn-sm" id="cancelShopeeSpecialBtn">取消shopee特货</span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="cateMappingTable" lay-filter="cateMappingTable"></table>
                </div>
            </div>
        </div>
    </div>
    <div class="disN p20" id="chooseSMTCateLayer"></div>
    <div class="disN p20" id="chooseAmazonCateLayer"></div>
</div>
<script type="text/html" id="smtCateNameTpl">
    {{# if(d.smtCateName != undefined && d.smtCateName !=''){ }}
    <span>{{ d.smtCateName }}</span>
    {{# } }}
    {{# if(d.smtLeaf){ }}
    <span class="layui-badge layui-bg-blue">叶</span>
    {{# } }}
</script>
<script type="text/html" id="shopeemyTpl">
    <span>  <input type="number" class="layui-input" style="height:28px"  value={{ d.myCateId || '' }}> </span>
    {{# if(d.mySpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeethTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.thCateId || '' }}> </span>
    {{# if(d.thSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeeidTpl">
    <span>  <input type="number" class="layui-input" style="height:28px"  value={{ d.idCateId || '' }}> </span>
    {{# if(d.idSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeesgTpl">
    <span>  <input type="number" class="layui-input" style="height:28px"  value={{ d.sgCateId || '' }}> </span>
    {{# if(d.sgSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeetwTpl">
    <span>  <input type="number" class="layui-input" style="height:28px"  value={{ d.twCateId || '' }}> </span>
    {{# if(d.twSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeephTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.phCateId || '' }}> </span>
    {{# if(d.phSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeevnTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.vnCateId || '' }}> </span>
    {{# if(d.vnSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeebrTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.brCateId || '' }}> </span>
    {{# if(d.brSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeemxTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.mxCateId || '' }}> </span>
    {{# if(d.mxSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeecoTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.coCateId || '' }}> </span>
    {{# if(d.coSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeeclTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.clCateId || '' }}> </span>
    {{# if(d.clSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeeplTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.plCateId || '' }}> </span>
    {{# if(d.plSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeeesTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.esCateId || '' }}> </span>
    {{# if(d.esSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeecnscTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.cnscCateId || '' }}> </span>
    {{# if(d.frSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="shopeefrTpl">
    <span> <input type="number" class="layui-input" style="height:28px"  value={{ d.frCateId || '' }}> </span>
    {{# if(d.frSpecFlag){ }}
    <span class="layui-badge">特</span>
    {{# } }}
</script>
<script type="text/html" id="im_allRootCateTpl">
    <input type="number" class="layui-input" style="height:28px"  value={{ d.allrootCateId || '' }}>
</script>
<script type="text/html" id="fyndiqCateIdTpl">
    <input type="number" class="layui-input" style="height:28px"  value={{ d.fyndiqCateId || '' }}>
</script>
<script type="text/html" id="im_Bar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">保存</a>
    <permTag:perm funcCode="updateFyndiq_itemmap_fyndiq">
        <a class="layui-btn layui-btn-xs" lay-event="updateFyndiq" id="updateFyndiq_itemmap">更新fyndiq类目</a>
    </permTag:perm>
    <%-- <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">一键应用</a>--%>
</script>

<%-- 设置/取消shopee特货 --%>
<script type="text/html" id="shopeeSpecialLayer">
    <div class="layui-form" style="padding:20px;">
        <div class="layui-form-item">
            <div class="layui-form-label">shopee站点</div>
            <div class="layui-input-block">
                <select name="shopeeSite" lay-search>
                    <option value="TH">泰国</option>
                    <option value="TW">台湾</option>
                    <option value="ID">印尼</option>
                    <option value="SG">新加坡</option>
                    <option value="PH">菲律宾</option>
                    <option value="MY">马来西亚</option>
                    <option value="VN">越南</option>
                    <option value="BR">巴西</option>
                    <option value="MX">墨西哥</option><!-- 其实可以来自枚举 -->
                    <option value="CL">智利</option>
                    <option value="CO">哥伦比亚</option>
                    <option value="CO">波兰</option>
                    <option value="ES">西班牙</option>
                    <option value="FR">法国</option>
                </select>
            </div>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/commodity/catalog/itemmap.js"></script>
