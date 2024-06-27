<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>自拍图(新)</title>
<style>
    .warn{
        background:rgb(253, 253, 144) !important;
    }
    .red{
        color:red !important;
    }

    #LAY-selfphotograph .layui-table-tool{
        display: none;
    }

    /* #LAY-selfphotograph .layui-card-body{
        padding: 0 15px !important;
    } */
    td[data-index="sskus"] .layui-form-checkbox{
        width: 180px!important;
    }
    #selfphotograph_btn_set .layui-btn+.layui-btn{
        margin-left: 0 !important;
    }
    #self_photo_query {
        display: flex;
        flex-direction: column;
    }
    .title-part {
        display: flex;
        justify-content: space-between;
        /* margin-top: 10px; */
        margin: 10px 20px 0;
        color: #333;
        font-size: 16px;
        padding: 5px 0; 
        background-color: #f4f0f0;
    }
    .common_image_container_grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 16.6%);
    }
    .choose-part {
        position: relative;
    }
    .selfImgIcon {
        color: red;
        width: 10px;
        display: block;
        font-size: 12px;
        margin-left: 2px;
    }
    .comb-btn {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-left: 40px;
        background-color: rgb(217, 0, 27);
        color: #fff;
        font-size: 14px;
        border-radius: 2px;
    }
    .sku-text {
        margin: 0 30px;
        font-size: 14px;
    }
    .txtflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<div class="layui-fluid" id="LAY-selfphotograph">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="sphoto_searchForm" class="layui-form" action="" lay-filter="sphoto_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="timeType" lay-search>
                                        <option value="createTime">需求时间</option>
                                        <option value="consigneeTime">配货时间</option>
                                        <option value="receiveTime">收货时间</option>
                                        <option value="photographTime">摄影时间</option>
                                        <option value="artDesignTime">美工时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="time" type="text" class="layui-input" placeholder="选择时间">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select lay-filter="selftphoto_switchPerson" lay-search>
                                        <option value="creatorId">需求人</option>
<%--                                        <option value="performanceOwner">开发专员</option>--%>
                                        <option value="performanceOwner">开发专员</option>
                                        <option value="photographerId">摄影专员</option>
                                        <option value="artDesignerId">美工专员</option>
                                        <option value="receiverId">收货人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="selftphoto_switchPerson_render">
                                        <select lay-filter="selftphoto_switchPerson_render" id="selftphoto_switchPerson_render" lay-search>
                                        </select>
                                    </div>
                                    <div class="photographerId disN">
                                        <%--    摄影专员--%>
                                        <select name="photographerId" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${photographerList}" var="photographer">
                                                <option value="${photographer.id}">${photographer.userName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                    <div class="artDesignerId disN">
                                        <%--美工专员--%>
                                        <select name="artDesignerId" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${artDesignerList}" var="artDesigner">
                                            <option value="${artDesigner.id}">${artDesigner.userName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">拍图状态</label>
                                <div class="layui-input-block">
                                    <select name="isComplete" lay-search="">
                                        <option value="">全部</option>
                                        <option value="0">未到货</option>
                                        <option value="1">摄影未完成</option>
                                        <option value="2">美工未完成</option>
                                        <option value="3">拍图完成</option>
                                        <option value="4">已取消</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">转寄状态</label>
                                <div class="layui-input-block">
                                    <select name="sendReturnStatus" lay-search="">
                                        <option value="">全部</option>
<%--                                        <option value="10">转上海</option>--%>
<%--                                        <option value="20">还义乌</option>--%>
                                        <option value="0">未转</option>
                                        <option value="10">寄出</option>
                                        <option value="20">退回</option>
                                    </select>
                                </div>
                            </div>
                            <%--竞品排序--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="compSalesSortType" lay-search="">
                                        <option value="">无序</option>
                                        <option value="1">竞品销量降序</option>
                                        <option value="0">竞品销量升序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="allTimeout" lay-search>
                                        <option value="entireTimeout">整体超时</option>
                                        <option value="photographTimeout">摄影超时</option>
                                        <option value="artTimeout">美工超时</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="allTimeoutVal" lay-search="">
                                        <option value="">全部</option>
                                        <option value="true">超时</option>
                                        <option value="false">未超时</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">模版类型</label>
                                <div class="layui-input-block">
                                    <select name="tplType" lay-search>
                                        <option value=""></option>
                                        <option value="0">直邮</option>
                                        <option value="1">亚马逊精品</option>
                                        <option value="2">亚马逊精铺</option>
                                        <option value="3">亚马逊铺货</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="searchType"  lay-search>
                                        <option value="p_0">父SKU模糊</option>
                                        <option value="s_0">子SKU模糊</option>
                                        <option value="p_1">父SKU精确</option>
                                        <option value="s_1">子SKU精确</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchText"  maxlength="2000" id="selftphotograph_searchText">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">拍图类型</label>
                                <div class="layui-input-block">
                                    <select name="photoType" lay-search="">
                                        <option value="">全部</option>
                                        <option value="1">新拍</option>
                                        <option value="2">补拍</option>
                                        <option value="3">重拍</option>
                                    </select>
                                </div>
                            </div>
                            <%--类目--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="selef_photo_pl_searchCate_btn">选择分类
                                    </button>
                                    <input type="hidden" name="cateId" value="" id="selef_photo_cateId_search_inp">
                                    <i class="layui-icon layui-icon-delete"
                                        onclick="clearCate('selef_photo_pl_search_cate','selef_photo_cateId_search_inp')"
                                        style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <%--    是否精修--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">精修</label>
                                <div class="layui-input-block">
                                    <select name="refinementProduct" lay-search="">
                                        <option value="">全部</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label">批次号</div>
                                <div class="layui-input-block">
                                    <select name="batchNo" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <div class="layui-form-label">销售状态</div>
                              <div class="layui-input-block">
                                <select name="isSale">
                                  <option value="">全部</option>
                                  <option value="1">在售</option>
                                  <option value="0">停售</option>
                                </select>
                              </div>
                          </div>
                            <div class="layui-col-md-offset8 layui-col-md2 layui-col-lg2" style="padding-left: 20px;text-align:right;">
                                <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="sphoto_searchBtn" lay-filter="sphoto_searchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="selef_photo_pl_search_cate"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="selfieCard">
                <div class="layui-card-header" style="display:flex;justify-content:space-between;">
<%--                    <div>--%>
<%--                        <span class="numCount">商品数量(<span id="sphoto_count"  class="red">0</span>)</span>--%>
<%--                    </div>--%>
                    <div class="layui-tab selfphotograph_tab" lay-filter="selfphotograph_tab">
                        <ul class="layui-tab-title">
                            <li data-value="110" class="layui-this">待审核(<span>0</span>)</li>
                            <li data-value="115">待派单(<span>0</span>)</li>
                            <li data-value="120">待配货(<span>0</span>)</li>
                            <li data-value="135">仓库缺货(<span>0</span>)</li>
                            <li data-value="130">待交接(<span>0</span>)</li>
                            <li data-value="140">未还库(<span>0</span>)</li>
                            <li data-value="141">拍图拦截(<span>0</span>)</li>
                            <li data-value="145">已还库(<span>0</span>)</li>
                            <li data-value="150">已报损(<span>0</span>)</li>
                            <li data-value="500">已取消(<span>0</span>)</li>
                            <li data-value="">全部(<span>0</span>)</li>
                        </ul>
                    </div>
                    <div id="selfphotograph_btn_set">
                        <permTag:perm funcCode="selfphotograph_addrequirementphotos">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="sphoto_rePictureMark">新增拍图需求</span>
                        </permTag:perm>
                      <permTag:perm funcCode="spg_sendReturnStatusBtnPermTag">
                        <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="spg_sendReturnStatusBtn">转寄</span>
                      </permTag:perm>
                      <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="giveTask_camera">分配摄影</span>
                      <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="giveTask_artists">分配美工</span>
                        <permTag:perm funcCode="sphoto_add_refine_sku_permTag">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="sphoto_add_refine_sku">需要精修</span>
                        </permTag:perm>
                        <permTag:perm funcCode="sphoto_cancel_refine_sku_permTag">
                            <span class="layui-btn layui-btn-sm layui-btn-danger"
                                  id="sphoto_cancel_refine_sku">取消精修</span>
                        </permTag:perm>
                        <permTag:perm funcCode="selfphotograph_deliveryofgoods">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="sphoto_goodsArrival">收货</span>
                        </permTag:perm>
                        <permTag:lacksPerm funcCode="selfphotograph_giveTask">
                            <span class="layui-btn layui-btn-sm layui-btn-normal layui-btn-disabled disN" disabled>分配任务</span>
                        </permTag:lacksPerm>
                        <permTag:perm funcCode="selfphotograph_phFinishBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="sphoto_cameraComplete">摄影完成</span>
                        </permTag:perm>
                        <permTag:lacksPerm funcCode="selfphotograph_phFinishBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal layui-btn-disabled disN" disabled>摄影完成</span>
                        </permTag:lacksPerm>
                        <permTag:perm funcCode="selfphotograph_adFinishBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="sphoto_artComplete">美工完成</span>
                        </permTag:perm>
                        <permTag:lacksPerm funcCode="selfphotograph_adFinishBtn">
                            <span class="layui-btn layui-btn-sm layui-btn-normal layui-btn-disabled disN" disabled>美工完成</span>
                        </permTag:lacksPerm>
                        <permTag:perm funcCode="query_image_self_photo">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="query_image_self_photo">拍图</span>
                        </permTag:perm>
                        <permTag:perm funcCode="selfphotograph_opt_toexamine">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="selfphotograph_opt1">审核</span>
                        </permTag:perm>
                        <permTag:perm funcCode="selfphotograph_opt_dispatchtowarehouse">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="selfphotograph_opt2">派至仓库</span>
                        </permTag:perm>
                        <permTag:perm funcCode="selfphotograph_opt_generatebatch">
                            <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="selfphotograph_opt3">生成批次</span>
                        </permTag:perm>
                        <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="selfphotograph_opt4">转待派单</span>
                        <permTag:perm funcCode="selfphotograph_opt_refundtopendingreview">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="selfphotograph_opt5">驳回到待审核</span>
                        </permTag:perm>
                        <permTag:perm funcCode="export_params_self_photo">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="export_params_self_photo">导出</span>
                        </permTag:perm>
                    </div>
<%--                    <div id="selfphotograph_batchOperate" style="position:relative;margin-right:5px;">--%>
<%--                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm abc">批量操作</button>--%>
<%--                        <ul style="margin-top:20px;">--%>
<%--                            <permTag:perm funcCode="selfphotograph_opt_toexamine"><li id="selfphotograph_opt1" class="disN">审核</li></permTag:perm>--%>
<%--                            <permTag:perm funcCode="selfphotograph_opt_dispatchtowarehouse"><li id="selfphotograph_opt2" class="disN">派至仓库</li></permTag:perm>--%>
<%--                            <permTag:perm funcCode="selfphotograph_opt_generatebatch"><li id="selfphotograph_opt3" class="disN">生成批次</li></permTag:perm>--%>
<%--                            <li id="selfphotograph_opt4" class="disN">转待派单</li>--%>
<%--                        </ul>--%>
<%--                    </div>--%>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="selfphotographTable" lay-filter="selfphotographTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 弹出框信息 -->
<!-- 摄影完成 -->
<script type="text/html" id="sphoto_cameraCompleteLayer">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                    <textarea name="sSku" placeholder="可以用扫码枪,可以用手打,每行一个" class="layui-textarea" rows="10"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 美工完成 -->
<script  type="text/html" id="sphoto_artCompleteLayer">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                          <textarea name="artsSku" placeholder="可以用扫码枪,可以用手打,每行一个;提交的时候先判断摄影有么有完成,如果没有完成,默认无法美工提交;"
                                    class="layui-textarea" rows="10"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="person_selfphotograph">
<div style="text-align: left;width:100px;">
  <div class="txtflow"><span class="secondary">需求:</span>{{d.creator || ''}}</div>
  <div class="txtflow"><span class="secondary">开发:</span>{{d.bizzOwner || ''}}</div>
  <div class="txtflow"><span class="secondary">收货:</span>{{d.receiver || ''}}</div>
  <div class="txtflow"><span class="secondary">摄影:</span>{{d.photographer || ''}}</div>
  <div class="txtflow"><span class="secondary">美工:</span>{{d.artDesigner || ''}}</div>
</div>
</script>
<!-- 新增拍图需求 -->
<script type="text/html" id="sphsoto_rePictureMarkLayer">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="fRed">*</span>模版类型：</label>
                <div class="layui-input-block">
                    <select name="tplType" lay-search>
                        <option value=""></option>
                        <option value="0">直邮</option>
                        <option value="1">亚马逊精品</option>
                        <option value="2">亚马逊精铺</option>
                        <option value="3">亚马逊铺货</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    <select name="skuType" lay-search>
                        <option value="1">父SKU</option>
                        <option value="2">子SKU</option>
                    </select>
                </label>
                <div class="layui-input-block">
                                <textarea name="skuStr" class="layui-textarea"
                                          placeholder="可以用条码枪扫，可以手打，每行一个。
提交时先判断有无SKU，若有SKU才OK，没有提示异常。
sku全部正确无误后保存。" style="width:70%;display: inline-block;vertical-align: top;"></textarea>
                    <span class="layui-btn layui-btn-sm layui-btn-normal" style="float:right" id="sphsoto_searchSku" >查询</span>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <table class="layui-table" id="sphsoto_skuTable" lay-filter="sphsoto_skuTable">
                        <thead>
                        <tr>
                            <th style="25%">父SKU</th>
                            <th>子SKU</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 分配摄影 -->
<script type="text/html" id="giveTask_camera_div">
    <div class="p20">
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="fRed">*</span>摄影专员:</label>
                <div class="layui-input-block">
                    <select name="tplType" id="camera_select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 分配摄影 -->
<script type="text/html" id="giveTask_artists_div">
    <div class="p20">
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="fRed">*</span>美工专员:</label>
                <div class="layui-input-block">
                    <select name="tplType" id="artists_select" lay-search>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 摄影收货 -->
<script type="text/html" id="sphoto_goodsArrivalLayer">
    <div class="p20">
        <form class="layui-form sphoto_goodsArrivalForm" onsubmit="return false;">
<%--            <div class="layui-form-item">--%>
<%--                <label class="layui-form-label">子SKU</label>--%>
<%--                <div class="layui-input-block">--%>
<%--                    <textarea name="sSku" placeholder="可以用扫码枪,可以用手打,每行一个" class="layui-textarea" rows="13"></textarea>--%>
<%--                </div>--%>
<%--            </div>--%>
            <div class="layui-form-item">
                <label class="layui-form-label"></label>
                <div class="layui-input-block">
                    <input type="radio" name="sendReturnStatus" value="20" title="义乌能拍">
                    <input type="radio" name="sendReturnStatus" value="10" title="转寄">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                    <input name="sSku" class="layui-input sphoto_goodsArrivalLayerSku" placeholder="回车搜索" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">数量</label>
                <div class="layui-input-block">
                    <input name="skuNumber" class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">收货结果</label>
                <div class="layui-input-block receiveRes">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">父sku数</label>
                <div class="layui-input-block receiveRes1">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品数</label>
                <div class="layui-input-block receiveRes2">
                </div>
            </div>
        </form>
    </div>
</script>

<!-- ztt20230913转寄状态 -->
<script type="text/html" id="spg_sendReturnStatusLayer">
  <div class="p20">
      <form class="layui-form" action="" lay-filter="component-form-group">
          <div class="layui-form-item">
              <label class="layui-form-label">子SKU</label>
              <div class="layui-input-block">
                  <textarea name="sSku" placeholder="可以用扫码枪,可以用手打,每行一个" class="layui-textarea" rows="13"></textarea>
              </div>
          </div>
      </form>
  </div>
</script>


<script type="text/html" id="sphsoto_pSkuOperateBtnLayer">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label">父SKU：</label>
                <div class="layui-input-block">
                            <textarea name="pSku" class="layui-textarea"
                                      placeholder="可以用条码枪扫，可以手打，每行一个。
提交时先判断有无父SKU，若有父SKU才OK，没有提示异常。
sku全部正确无误后保存。" style="width:70%;display: inline-block;vertical-align: top;"></textarea>
                    <span class="layui-btn layui-btn-sm layui-btn-normal" style="float:right" id="sphsoto_searchSku" >查询</span>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <table class="layui-table" id="sphsoto_skuTable" lay-filter="sphsoto_skuTable">
                        <thead>
                        <tr>
                            <th>父SKU</th>
                            <th>子SKU</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    </div>
</script>
<!--模板元素-->
<script type="text/html" id="imagetpl_selfphotograph">
    {{#  if(typeof(d.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.image }}" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{# } }}
</script>
<!--类目-->
<script type="text/html" id="cateName_selfphotograph">
    <div style="height:135px;overflow:hidden;" lay-tips="{{d.cateName}}">
    {{d.cateName}}
    </div>
</script>
<!-- 子SKU -->
<script type="text/html" id="selfpg_sSku">
  <div>
    <div>{{d.sSku}}</div>
    {{# if(d.fileUrl){ }}
    <!-- <div><span class="layui-btn layui-btn-xs layui-btn-normal" onclick="window.open(`http://view.officeapps.live.com/op/view.aspx?src={{d.fileUrl}}`, '_blank')">拍图要求预览</span></div> -->
    <div><span class="layui-btn layui-btn-xs layui-btn-normal" onclick="commonPreviewExcel('{{d.fileUrl}}')">拍图要求预览</span></div>
    {{# }else{ }}
    <div>
      <span class="layui-btn layui-btn-xs" onclick="selfphotograph_uploadReqExcel(this, '{{d.sSku}}')">添加拍图要求</span>
      <input type="file" class="disN">
    </div>
    {{# } }}
    <div>{{d.isSale == 0 ? '<font color="red">停售</font>' : ''}}</div>
  </div>
</script>
<script type="text/html" id="pSkuTpl_selfphotograph">
    {{d.pSku}}<i title="打开竞品链接" onclick="compUrl_producttpl('{{d.pSku}}','',function(){openComp('{{d.pSku}}')})" class="layui-icon" style="color: #009688;cursor: pointer;"></i>
    <div>
        {{# if(d.prodSelfImgStatus == 1) { }}
        <span class="hp-badge layui-bg-green" title="有自拍图">自</span>
        {{# } }}
        {{# if(d.isSupplierOrigiImg) { }}
        <span class="hp-badge layui-bg-blue" title="有供应商图">供</span>
        {{# } }}
        {{# if (d.mackStatus == 1) { }}
            {{# if (d.selfImgStatus == 1 || d.selfImgStatus == 2) { }}
            <span class="hp-badge layui-bg-red" title="精修商品">精</span>
            {{# } }}
        {{# } }}
    </div>
</script>
<script type="text/html" id="sphotoStatusTpl">
    {{# if(d.selfStatus!==""){ }}
    {{formatStatus(d.selfStatus)}}
    {{# }}}
</script>
<script type="text/html" id="toolbarTpl">
<%--    <div><button class='layui-btn layui-btn-xs ayui-btn layui-btn-danger' lay-event="delete">删除拍图</button></div>--%>
<%--    <div><button class="layui-btn layui-btn-xs layui-btn-normal" onclick="evaluate_selfImg('{{d.pSku}}', 1)">摄影评分</button></div>--%>
<%--    <div><button class="layui-btn layui-btn-xs" onclick="evaluate_selfImg('{{d.pSku}}', 2)">美工评分</button></div>--%>
    <permTag:perm funcCode="selfphotograph_cancel">
    <div><button class='layui-btn layui-btn-xs ayui-btn layui-btn-danger' lay-event="cancel">取消拍图</button></div>
    </permTag:perm>
    {{# if(d.fileUrl){ }}
    <div><span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="deleteRequired">删除拍图要求</span></div>
    {{# } }}
    <div><button class='layui-btn layui-btn-xs' lay-event="logs">日志</button></div>
</script>

<!-- 表格---转寄 -->
<script type="text/html" id="sf_sendReturnStatus">
  <div style="text-align: left;width:220px">
    <div class="txtflow">寄出:{{d.sendPeople ||''}}{{format( d.sendTime, "yyyy-MM-dd hh:mm:ss")}}</div>
    <div class="txtflow">退回:{{d.returnPeople ||''}}{{format( d.returnTime, "yyyy-MM-dd hh:mm:ss")}}</div>
  </div>
</script>


<script type="text/html" id="sf_timeTpl">
    <div style="text-align: left;width:170px;">
        <h5 class="txtflow" style="line-height: 20px;"><span  style="color:#999;">新建:</span>{{ format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</h5>
        <h5 class="txtflow" style="line-height: 20px;"><span  style="color:#999;">配货:</span>{{ format( d.consigneeTime, "yyyy-MM-dd hh:mm:ss")}}</h5>
        <h5 class="txtflow" style="line-height: 20px;"><span  style="color:#999;">收货:</span>{{ format( d.receiveTime, "yyyy-MM-dd hh:mm:ss")}}</h5>
        <h5 class="txtflow" style="line-height: 20px;"><span  style="color:#999;">摄影:</span>{{ format( d.photographTime, "yyyy-MM-dd hh:mm:ss")}}</h5>
        <h5 class="txtflow" style="line-height: 20px;"><span  style="color:#999;">美工:</span>{{ format( d.artDesignTime, "yyyy-MM-dd hh:mm:ss")}}</h5>
    </div>
</script>

<%--分配任务--%>
<script type="text/html" id="sphoto_giveTaskLayer">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="sphoto_giveTaskForm" id="sphoto_giveTaskForm">
            <div class="layui-form-item" id="photographerBox_sphoto_giveTaskLayer">
                <label class="layui-form-label">摄影专员</label>
                <div class="layui-input-block">
                    <select name="photographerId" lay-search>
                        <option></option>
                        <c:forEach items="${photographerList}" var="photographer">
                            <c:if test="${photographer.status}">
                            <option value="${photographer.id}">${photographer.userName}</option>
                            </c:if>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">美工专员</label>
                <div class="layui-input-block">
                    <select name="artDesignerId" lay-search>
                        <option></option>
                        <c:forEach items="${artDesignerList}" var="artDesigner">
                            <c:if test="${artDesigner.status}">
                            <option value="${artDesigner.id}">${artDesigner.userName}</option>
                            </c:if>
                        </c:forEach>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="sphoto_selfTypeTpl">
    <div style="text-align: left">
        成本:{{d.purchaseCostPrice||''}}<br/>
        竞品销量:{{d.compSalesNum||''}}<br/>
        SKU可用:{{d.currentStock}}<br/>
        在途数量:{{d.onwayStock}}<br/>
    </div>
</script>
<script type="text/html" id="tplType_selfphotograph">
    <div style="text-align: left">
        {{# if (d.tplType == 1){ }}
            模板:亚马逊精品
        {{# } }}
        {{# if (d.tplType == 2){ }}
            模板:亚马逊精铺
        {{# } }}
        {{# if (d.tplType == 3){ }}
            模板:亚马逊铺货
        {{# } }}
        {{# if(d.tplType == 0){ }}
            模板:直邮
        {{# } }}
        <br/>
        {{# if(d.selfType!==""){ }}
            {{formatTypes(d.selfType)}}
        {{# }}}
    </div>
</script>

<script src="${ctx}/static/js/commodity/process/selfphotograph.js"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>

<script type="text/html" id="export_params_self_photo_list">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="select_All_export_params_self_photo_list"></div>
    </form>
    <div class="layui-tab layui-tab-card">
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <form class="layui-form" action="" lay-filter="component-form-group" id="export_params_select_self_photo_list_form">
                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                        <legend style="font-size:14px">基本信息</legend>
                    </fieldset>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" title="子SKU" disabled lay-skin="primary" checked></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="父SKU" title="父SKU" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="需求人" title="需求人" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="竞品销量" title="竞品销量" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="业绩归属人" title="开发专员" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="上月smt销量排名" title="上月smt销量排名" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="成本" title="成本" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="类目" title="类目" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="拍图类型" title="拍图类型" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="需求备注" title="需求备注" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="摄影" title="摄影" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="美工" title="美工" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="状态" title="状态" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="新建时间" title="新建时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="收货时间" title="收货时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="摄影时间" title="摄影时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="美工时间" title="美工时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="图片url" title="图片url" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="模版类型" title="模版类型" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="是否组合品" title="是否组合品" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="义乌仓库位" title="义乌仓库位" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="义乌仓预计可用库存不含在途" title="义乌仓预计可用库存不含在途" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="义乌仓预计可用库存含在途" title="义乌仓预计可用库存含在途" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="转寄状态" title="转寄状态" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="转寄时间" title="转寄时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="还回时间" title="还回时间" lay-skin="primary"></div>
                    <div class="fieldBox_standard"><input type="checkbox" name="self_photo_baseField" value="收货人" title="收货人" lay-skin="primary"></div>
                    <div class="clearLeft"></div>
                </form>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="self_photo_graph_logs">
    <div style="padding:20px;"><table id="self_photo_graph_logs_table"></table></div>
</script>
<script type="text/html" id="query_image_self_photo_list">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="query_imageForm" id="query_imageForm" onsubmit="return false;">
            <div class="layui-col-md4 layui-col-lg4">
                <div class="layui-form-item">
                    <div class="layui-input-block" style="margin-left: 20px">
                        <input class="layui-input" id="skuInput" placeholder="扫描SKU查询" />
                    </div>
                </div>
            </div>
            <div class="layui-col-md1 layui-col-md-offset1">
                <a class="layui-btn layui-btn-normal layui-btn-sm photographyCompleted">摄影完成</a>
            </div>
            <div class="layui-col-md1 layui-col-lg1">
                <a class="layui-btn layui-btn-normal layui-btn-sm printSku">打印SKU标签</a>
            </div>
            <div class="layui-col-md2 layui-col-md-offset3">
<%--            <permTag:perm funcCode="selfphotograph_markCaptureInterception">--%>
                <a class="layui-btn layui-btn-sm layui-btn-danger markCaptureInterception">标记拍图拦截</a>
<%--            </permTag:perm>--%>
            <permTag:perm funcCode="selfphotograph_reportLosses">
                <a class="layui-btn layui-btn-sm layui-btn-danger reportLosses">报损</a>
            </permTag:perm>
            </div>
            <div class="layui-form-item">
            <div class="layui-col-md8 layui-col-lg8" id="skuInfo">

            </div>
            </div>
        </form>
    </div>
    <div id="image-content"></div>
</script>
    <%-- 权限问题---提交快捷拍图 --%>
<script type="text/html" id="selfphotograph_submitQuickShot">
    <div style="display:inline-block;float:left">
        <permTag:perm funcCode="selfphotograph_btnPermTag_submitQuickShot">
            <div style="display:flex;margin-top:5px;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal submitQuickShot">提交快捷拍图</span>
                    <span style='margin-top: 5px;color: #e6a23c;'>说明：使用快捷拍图创建的任务，直接把商品给摄影拍照，无需仓库配货流程</span>
            </div>
        </permTag:perm>
    </div>
</script>

<script type="text/html" id="image_list_container">
    <div class="layui-form">
        <div class="title-part">主图</div>
        <div style="margin: 15px;" class="common_image_container_grid">
          {{# layui.each(d.prodPInfoDto?.mainImages,function(index,item){ }}
          <div>
<%--            <div style="margin-top: 5px">--%>
<%--              <div><input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" disabled {{item.isMust ? 'checked' : '' }} /></div>--%>
<%--            </div>--%>
            <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
              <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg img_show_hide" />
<%--              {{# if(item.isSelfImg){ }}--%>
<%--                <div class="choose-part">--%>
<%--                  <div class="selfImgIcon">自拍图</div>--%>
<%--                  <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />--%>
<%--                </div>--%>
<%--              {{# }else{ }}--%>
<%--              <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />--%>
<%--              {{# } }}--%>
            </div>
          </div>
          {{# }) }}
        </div>
    </div>
    <div>
    <div class="title-part">辅图</div>
        <div style="margin: 15px 20px 10px;" class="common_image_container_grid layui-form">
          {{# layui.each(d.prodPInfoDto?.assistImgs,function(index,item){ }}
          <div style="margin-top: 15px;">
<%--            <div style="margin-top: 5px"><input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" {{item.isMust ? 'checked' : '' }} /></div>--%>
            <div class="mt05 {{item.isSelfImg? 'disflex' : ''}}">
              <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="common_image_container-chooseTplImg img_show_hide" />
<%--              {{# if(item.isSelfImg){ }}--%>
<%--              <div class="choose-part">--%>
<%--                <div class="selfImgIcon">自拍图</div>--%>
<%--                <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />--%>
<%--              </div>--%>
<%--              {{# }else{ }}--%>
<%--              <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}" shortName="{{item.name}}" />--%>
<%--              {{# } }}--%>
            </div>
          </div>
          {{# }) }}
        </div>
    </div>
    <div style="margin: 15px 20px">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>模板类型</th>
                    <th>拍图类型</th>
                    <th>精修</th>
                    <th>拍图要求</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{d.selfImgProdInfoDto?.tplTypeStr}}</td>
                    <td>{{d.selfImgProdInfoDto?.selfTypeStr}}</td>
                    <td>{{d.prodPInfoDto.mack_refine_status?'是':'否'}}</td> <%--0->否;1->是--%>
                    <td>
                        {{# if(d.selfImgProdInfoDto?.fileUrl){ }}
                            <span class="layui-btn layui-btn-xs layui-btn-normal" onclick="commonPreviewExcel('{{d.selfImgProdInfoDto?.fileUrl}}')">预览</span>
                        {{# } }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div style="margin: 15px 20px">
        <table class="layui-table" id="query_image_sub_tab">
            <thead>
                <tr>
                    <th width="200">平台</th>
                    <th>链接</th>
                </tr>
            </thead>
            <tbody>
                {{# layui.each(d.compList || [], function(index, item){ }}
                    <tr>
                        <td>{{item.platCode}}</td>
                        <td><a href="{{item.url}}" class="ztt-a" target="_blank">{{item.url}}</a></td>
                    </tr>
                {{# }) }}
            </tbody>
        </table>
    </div>
</script>

<script type="text/html" id="combination_info">
    <input type="hidden" value="{{d.prodSInfo?.id}}" class="prodSId">
    <input type="hidden" value="{{d.selfImgProdInfoDto?.id}}" class="selfImgProdInfoDto">
    <div class="disflex" style="align-items: center">
        {{# if(d.prodSInfo?.selfPhotoStatus == 4 || d.prodSInfo?.selfPhotoStatus == 3){ }}
            <div style="color:red;font-size:20px;margin-left:20px;">已拍</div>
            <div>摄影人员：{{d.selfImgProdInfoDto?.msgSelfPhotographer||''}}  摄影时间：{{format( d.selfImgProdInfoDto?.msgSelfPhotographTime, "yyyy-MM-dd hh:mm")}}</div>
        {{# } }}
        {{# if(d.prodSInfo?.isCombination){ }}
            <div class="comb-btn">组合品</div>
        {{# } }}
        {{# if(d.otherNeedPhotoSkuOfSamePsku){ }}
        <div class="sku-text">有其他子sku 【{{d.otherNeedPhotoSkuOfSamePsku || ''}} 】也需要拍照</div>
        {{# } }}
    </div>
</script>