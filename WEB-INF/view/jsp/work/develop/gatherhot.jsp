<!--采集爆款-->
<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>产品库</title>
<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    #gh_hot_tab_id .layui-tab-title li{
        padding: 0 9px;
    }
    #LAY-work-develop-gatherhot .layui-form-item .layui-input-inline {
        float: left;
        width: 150px;
        margin-right: 10px;
    }

    .fieldBox{
        float: left;
        width: 20%;
        height: 25px;
        margin-top: 10px;
    }
    .fieldBox span{
        font-size: 18px;
    }

    #LAY-work-develop-gatherhot td .layui-table-cell {
        white-space: normal;
        overflow: visible;
        word-wrap: break-word;
        font-size: 13px;
        height: inherit;
    }

    #LAY-work-develop-gatherhot td[data-field="title"] .layui-table-cell {
        text-align: left;
    }

    #LAY-work-develop-gatherhot td[data-field="listing_data"] .layui-table-cell {
        text-align: left;
    }

    /* #LAY-work-develop-gatherhot td:nth-child(4) .layui-table-cell {
        white-space: nowrap;
    } */

    #gh_detail_layer td .layui-table-cell {
        line-height: 26px;
    }

    #LAY-work-develop-gatherhot .layui-form-item {
        margin-bottom: 0
    }
    .layuiCardHeader {
        background:#fff;
        position:relative;
        display:flex;
        justify-content:space-between;
    }
    .gatherhot_header_button_smallScreen .time-form {
        width: 80px !important;
    }
</style>
<div class="layui-fluid" id="LAY-work-develop-gatherhot">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="gh_searchForm" class="layui-form" action="" lay-filter="component-form-group">
                        <input name="listingStatus" value="1" type="hidden">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发组别</label>
                                <div class="layui-input-block">
                                    <select name="prodMgmtCateId" lay-filter="aihao" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${mgmtCates}" var="mgmtCate">
                                            <option value="${mgmtCate.id}">${mgmtCate.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">分配开发</label>
                                <div class="layui-input-block">
                                    <select name="developerId" lay-filter="aihao" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${developers}" var="developer">
                                            <option value="${developer.id}">${developer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerId" lay-filter="aihao" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${developers}" var="developer">
                                            <option value="${developer.id}">${developer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="aihao" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${platCodes}" var="platCode">
                                            <option value="${platCode}">${platCode}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <%--                                        <div class="layui-col-lg2 layui-col-md2">--%>
                            <%--                                            <label class="layui-form-label">产品类型</label>--%>
                            <%--                                            <div class="layui-input-block">--%>
                            <%--                                                <select name="prodType" lay-filter="aihao" lay-search="">--%>
                            <%--                                                    <option value="">全部</option>--%>
                            <%--                                                    <c:forEach items="${prodTypeEnums}" var="prodTypeEnum">--%>
                            <%--                                                        <option value="${prodTypeEnum.getCode()}">${prodTypeEnum.getValue()}</option>--%>
                            <%--                                                    </c:forEach>--%>
                            <%--                                                </select>--%>
                            <%--                                            </div>--%>
                            <%--                                        </div>--%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="sellStatus" lay-filter="aihao" lay-search="">
                                        <option value="">全部</option>
                                        <c:forEach items="${sellStatusEnums}" var="sellStatusEnum">
                                            <option value="${sellStatusEnum.getCode()}">${sellStatusEnum.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">新类目搜索</label>
                                <button type="button" class="layui-btn layui-btn-primary layui-btn-sm"
                                        id="LAY-work-develop-gatherhot-btn1">选择类目
                                </button>
                                <i class="layui-icon layui-icon-delete"
                                    onclick="clearCate('LAY-work-develop-gatherhot-div1','LAY-work-develop-gatherhot-hidden1')"
                                    style="cursor:pointer" title="删除产品类目"></i>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <%--                                                    <p>搜索内容</p>--%>
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="aihao" lay-search="">
                                        <c:forEach items="${searchTypeEnums}" var="searchTypeEnum">
                                            <option value="${searchTypeEnum.getCode()}">${searchTypeEnum.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                <input name="searchValue" type="text" name="title" placeholder="请输入搜索内容"
                                        class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType" lay-filter="aihao" lay-search="">
                                        <c:forEach items="${timeTypeEnums}" var="timeTypeEnum">
                                            <option value="${timeTypeEnum.getCode()}">${timeTypeEnum.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div class="layui-input-inline time-form" style="width: 128px;">
                                    <input name="startTime" type="text" class="layui-input test-item" placeholder="开始时间">
                                </div>
                                <div class="layui-form-mid">-</div>
                                <div class="layui-input-inline time-form" style="width: 128px;">
                                    <input name="endTime" type="text" class="layui-input test-item" placeholder="结束时间">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <div>
                                    <select name="orderBy" lay-filter="aihao" lay-search="">
                                        <option value="">选择排序方式</option>
                                        <c:forEach items="${sortFieldEnums}" var="sortFieldEnum">
                                            <option value="${sortFieldEnum.getCode()}">${sortFieldEnum.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
    <%--                                        <div class="layui-col-lg2 layui-col-md2">--%>
    <%--                                            <label class="layui-form-label">ebay类目</label>--%>
    <%--                                            <button type="button" class="layui-btn layui-btn-primary layui-btn-sm"--%>
    <%--                                                    id="LAY-work-develop-gatherhot-btn1_ebay">选择类目--%>
    <%--                                            </button>--%>
    <%--                                            <i class="layui-icon layui-icon-delete"--%>
    <%--                                               onclick="clearCate('LAY-work-develop-gatherhot-div1_ebay','LAY-work-develop-gatherhot-hidden1_ebay')"--%>
    <%--                                               style="cursor:pointer" title="删除产品类目"></i>--%>
    <%--                                            <input type="hidden" name="ebayUkCateId" id="LAY-work-develop-gatherhot-hidden1_ebay">--%>
    <%--                                        </div>--%>
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="hasRepeatProd" lay-search>
                                    <option value="">疑似重复</option>
                                    <option value="true">有</option>
                                    <option value="false">无</option>
                                </select>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1" title="刚爬取下来的数据，由于图片是外网的地址，访问比较慢。导致进行以图搜图时速度慢。所以是通过后台任务，将图片下载到香港图片服务器。然后再进行标题翻译到英文、类目推荐、以图搜图等操作。 该查询条件表示，数据有无进行完上述步骤。">
                                <select name="dataComplete" lay-search>
                                    <option value="">预处理状态</option>
                                    <option value="1">成功</option>
                                    <option value="2">进行中</option>
                                    <option value="3">失败</option>
                                    <option value="0">未处理</option>
                                </select>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="padding-left:3px;">
                                    <button id="gh_searchBtn" class="layui-btn layui-btn-sm keyHandle"
                                            type="button" lay-filter="">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">
                                        清空
                                    </button>
                            </div>
                        </div>
                        <div class="layui-form-item" id="LAY-work-develop-gatherhot-div1_ebay"></div>
                        <div class="layui-form-item" id="LAY-work-develop-gatherhot-div1"></div>
                        <input type="hidden" name="cateId"
                                        id="LAY-work-develop-gatherhot-hidden1">
                    </form>
                </div>
            </div>
            <div class="layui-card" id="gatherhotCard">
                <div style="height:40px;line-height:40px;">
                    <div class="layui-card-header layuiCardHeader" id="layui-card-gatherhot">
                        <div class="layui-tab" lay-filter="gh_hot_tab" id="gh_hot_tab_id">
                            <ul class="layui-tab-title">
                                <li id="gatherhotTab1" data-value="1" class="layui-this">待确认（点击显示）</li>
                                <li id="gatherhotTab2" data-value="2">未开发（点击显示）</li>
                                <li id="gatherhotTab3" data-value="3">开发中（点击显示）</li>
                                <li id="gatherhotTab4" data-value="4">开发失败（点击显示）</li>
                                <li id="gatherhotTab5" data-value="5">开发不全（点击显示）</li>
                                <li id="gatherhotTab6" data-value="6">开发成功（点击显示）</li>
                                <li id="gatherhotTab9" data-value="9">不可开发（点击显示）</li>
                                <li id="gatherhotTab" data-value="">全部（点击显示）</li>
                            </ul>                        
                        </div>
                        <div id="LAY-work-develop-gatherhot-tools">
                            <input type="hidden" value="" id="LAY-work-develop-gatherhot-hidden">
                            <button class="layui-btn layui-btn-sm " id="gh_completeData" title="刚爬取下来的数据，由于图片是外网的地址，访问比较慢。导致进行以图搜图时速度慢。所以是通过后台任务，将图片下载到香港图片服务器。然后再进行标题翻译到英文、类目推荐、以图搜图等操作。 一般数据爬取下来会自动加入预处理任务。不排除存在预处理失败的数据，该按钮作为补充，对预处理失败的数据，重新加入预处理任务">预处理</button>
                            <button class="layui-btn layui-btn-sm layui-btn-danger " id="gh_delete">批量删除</button>
                            <permTag:perm funcCode="gh_allotBatch">
                            <button class="layui-btn layui-btn-sm layui-btn-warm " id="gh_allotBatch">批量分配</button>
                            </permTag:perm>
                            <button class="layui-btn layui-btn-sm " id="gh_prodCateBtn">修改新类目</button>
                            <button class="layui-btn layui-btn-sm" id="gh_mergeBtn">合并List</button>
                            <!-- <button class="layui-btn layui-btn-sm" id="gh_matchCateBtn">匹配类目</button> -->
                            <button class="layui-btn layui-btn-sm" id="gh_batchExamine">批量审核</button>
                            <permTag:perm funcCode="gh_data_export_funccode">
                            <button class="layui-btn layui-btn-sm" id="export_template_gatherhot_pop_btn">导出模板</button>
                            </permTag:perm>
                            <!-- <permTag:perm funcCode="gh_dataCollect">
                                <button class="layui-btn layui-btn-sm layui-btn-danger"
                                        id="gh_dataCollect">数据采集</button>
                            </permTag:perm> -->
                        </div>
                    </div>
                </div>
                <div id="gh_prodCate" data-id="" style="font-size:10px ;display: none"></div>
                <div class="layui-card-body">
                    <table class="layui-table" id="gh_hotTable" lay-filter="gh_table-filter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
    <!-- 审核弹框 + 完成弹框 -->
    <script type='text/html' id="gh_examineLayer">
        <div style="padding:20px 50px 0 20px">
            <form class="layui-form" id="gh_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">侵权状态</label>
                    <div class="layui-input-block">
                        <select name="tortStatus" lay-filter="aihao">
                            <option value=""></option>
                            <c:forEach items="${tortStatusEnums}" var="tortStatusEnum">
                                <option value="${tortStatusEnum.getCode()}">${tortStatusEnum.getValue()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">开发状态</label>
                    <div class="layui-input-block">
                        <select name="devStatus" lay-filter="aihao">
                            <option value=""></option>
                            <c:forEach items="${devStatusEnums}" var="devStatusEnum">
                                <option value="${devStatusEnum.getCode()}">${devStatusEnum.getValue()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">侵权品牌</label>
                    <div class="layui-input-block">
                        <input type="text" name="tortBrand" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">商品父SKU</label>
                    <div class="layui-input-block">
                        <input type="text" name="psku" placeholder="只能填入一个商品父SKU且商品父SKU不可包含逗号" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label">使用疑似重复SKU</label>
                  <div class="layui-input-block">
                    <input type="checkbox" name="sameAsRepeatSku" lay-skin="switch" lay-text="开启|关闭" lay-filter="gatherhot_sameAsRepeatSkuFilter">
                  </div>
              </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="font-size:10px">不可开发原因</label>
                    <div class="layui-input-block">
                        <select name="devFailReason" lay-filter="aihao">
                            <option value=""></option>
                            <c:forEach items="${reasonMap}" var="item">
                                <option value="${item.value.name} ">${item.value.name} </option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="font-size:10px">审核备注</label>
                    <div class="layui-input-block">
                        <textarea name="devNote" class="layui-textarea"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label" style="font-size:10px">开发备注</label>
                    <div class="layui-input-block">
                        <textarea name="devRemark" class="layui-textarea"></textarea>
                    </div>
                </div>
            </form>
        </div>
    </script>

<script type="text/html" id="gather_hot_title_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{# if(d.psku){ }}
        <span class="pora copySpan">
            <a href="javascript:;" style="cursor:pointer;color:#428bca;" id="prodDetail" data-id="{{d.prodPid}}">{{d.psku}}({{d.salePskuCount}})</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" style="top: -18px;left: 20px;" onclick="layui.admin.copyTxtFunc(this,'{{d.psku}}','a','span')">复制</button>
        </span>
        {{# } }}
        {{# if (d.devType) { }}
        <span class="hp-badge layui-bg-blue  fr layTitle" lay-title="{{d.devType}}">{{getAliasOfDevType(d.devType)}}</span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="gather_hot_dev_note_tpl">
    {{# if(d.devNote){ }}
    <div class="layui-table colspantable gather_hot_dev_note_table" style="padding:6px;position: relative;width: 100%;text-align: left;font-size: 12px;width:100%;border:none;word-break: break-word;">
        {{# if(d.devNote.length>66){ }}
        <div  class="dev_note_header">
            <div>
                {{ d.devNote.substr(0,66) }}
            </div>
        </div>
        <div style=" border:none;display: none;" class="myj-hide">
            <div>
                {{ d.devNote }}
            </div>
        </div>
        {{# }else{ }}
        <div style="border:none">
            <div>
                {{ d.devNote }}
            </div>
        </div>
        {{# } }}
    </div>
    {{# if(d.devNote.length>66){ }}
    <a href="javascript:" onclick="changeGatherhotDevNoteColspantable(this);" class="dev_note_show " style="padding:5px;float:right;cursor:pointer;color:#428bca;">+ 展开</a>
    {{# } }}
    {{# } }}
</script>



<script type="text/html" id="gather_hot_dev_remark_tpl">
    {{# if(d.devRemark){ }}
    <div class="layui-table colspantable gather_hot_dev_remark_table" style="padding:6px; position: relative;width: 100%;text-align: left;font-size: 12px;width:100%;border:none;word-break: break-word;">
        {{# if(d.devRemark.length>66){ }}
        <div  class="dev_remark_header">
            <span>
                {{ d.devRemark.substr(0,66) }}
            </span>
        </div>
        <div style="display: none;" class="dev-remark-hide">
            <span>
                {{ d.devRemark }}
            </span>
        </div>
        {{# }else{ }}
        <div>
            <span>
                {{ d.devRemark }}
            </span>
        </div>
        {{# } }}
    </div>
    {{# if(d.devRemark.length>66){ }}
    <a href="javascript:" onclick="changeColspantableHot(this,'dev_remark_header','dev-remark-hide');" class="dev_remark_show " style="float:right;cursor:pointer;color:#428bca;">+ 展开</a>
    {{# } }}
    {{# } }}
</script>


<script type="text/html" id="gh_editBar">
    <div style="align-content: center" class="gather_hot_tools_id">
        <div><a type="button" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="gh_detail"
           style="background-color: #FFA500">
            同款(<span style="color: #000000;font-weight: bold">{{ d.subNum+1 }}</span>)
        </a>
        <br></div>
<%--        {{# if(d.devStatus == 1){ }}--%>
        <div class="hebing"><a type="button" class="layui-btn layui-btn-xs" lay-event="gh_mergeListing">合并List</a><br>
        </div>
<%--        {{# } }}--%>
        <div><a type="button" class="layui-btn layui-btn-xs" lay-event="gh_examine">产品审核</a>
        <br></div>

        <div><a type="button" class="layui-btn layui-btn-xs" lay-event="gh_complete">完成开发</a>
        <br></div>
        {{# if(d.devStatus == 1 || d.devStatus == 5 || d.devStatus == 6){ }}
        {{# } else { }}
        <div class="xinpin"><a type="button" class="layui-btn layui-btn-xs" lay-event="gh_newProd">新增新品</a><br></div>
        {{# } }}
        {{# if( d.devStatus == 5 || d.devStatus == 6){ }}
        <div class="kandeng"><a type="button" class="layui-btn layui-btn-xs" onclick="producttpl_getListingStatus('{{d.prodPid}}')" >刊登状态</a><br></div>
        {{# } }}
        {{# if( d.devStatus == 5 || d.devStatus == 6){ }}
        <div class="youhua"><a type="button" class="layui-btn layui-btn-xs " lay-event="optimize">商品优化</a><br></div>
        {{# } }}
        <div class="add_msg_btn_class">
            <permTag:perm funcCode="add_msg_btn">
                <a class="layui-btn layui-btn-xs layui-btn-xs mb3" onclick="producttpl_develop_msg('{{ d.psku }}','{{d.id }}')" dataid="{{ d.id }}">
                    开发通知
                </a>
                <br>
            </permTag:perm>
        </div>
        <div><a type="button" class="layui-btn layui-btn-xs" lay-event="gh_operLog">操作日志</a></div>

    </div>
</script>
<!-- 缩略图 -->
<script type="text/html" id="gh_imageTpl">
    <div>
      <span class="layui-btn layui-btn-xs searchImgByImg" data-image="{{d.imgUri || ''}}" data-id="{{d.id || ''}}">
        以图搜图
      </span>
    </div>
    <div style="position: relative;">
      {{#  if(d.prodType == '1'){ }}
      <a type="button" class="layui-btn layui-btn-xs layui-btn-normal"
        style="height:18px;line-height:18px;position:absolute;right:5px;bottom:0;">新</a>
      {{#  } else { }}
      <a type="button" class="layui-btn layui-btn-xs layui-btn-danger"
        style="height:18px;line-height:18px;position:absolute;right:5px;bottom:0;">热</a>
      {{#  } }}

      {{#  if(typeof(d.imgUri) !="undefined"){ }}
      <div>
          <img width="60" height="60" data-original="{{ d.imgUri }}" class="img_show_hide b1 lazy"
              data-onerror="layui.admin.img_noFind()">
      </div>
      {{#  } }}
    </div>
    <div><span class="layui-btn layui-btn-xs searchSupply" data-image="{{d.imgUri || ''}}">查找货源</span></div>
</script>

<!-- 疑似重复SKU-ztt20230727 -->
<script type="text/html" id="gh_repeatPSku">
<div>
  <div>
    <img width="60" height="60" data-original="{{ d.repeatImage }}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
  </div>
  <div style="position:relative;">
    <span class="copySpan">
      <a>{{d.repeatPSku || ''}}</a>
      <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
  </div>
</div>
</script>

<script type="text/html" id="gh_imageTpl1">
    {{#  if(typeof(d.imgUri) !="undefined"){ }}
    <div class="gh_imageTpl1_detailImg">
        <img width="60" height="60" src="{{ d.imgUri }}">
    </div>
    {{#  } }}
</script>
<script type="text/html" id="gh_titleTpl">
    <span class="pora copySpan " style="word-break: break-all; white-space: normal">
          <a href="{{ d.onlineUrl }}" target="_blank">{{ d.title }}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                  onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span class="pora copySpan">
       <span style="color:#999;">产品ID:</span><a href="javascript:;">{{ d.platProdId }}</a>
       <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button> 
    </span>
    <br/>
    <span style="color:#999;" class="gatherhotCateShow" cateFullName="{{d.cateFullName}}">分类:</span>
    {{#  if(d.cateId!=undefined){ }}
    {{ d.cateName }}
    {{#  } }}
    {{# if(d.dataComplete == 0) {}}
    <span class="hp-badge layui-bg-orange pointHand fr" title="刚爬取的草稿数据，未经过预处理" lay-event="audit_log">未</span>
    {{# } }}
    {{# if(d.dataComplete == 2) {}}
    <span class="hp-badge layui-bg-orange pointHand fr" title="预处理中" lay-event="audit_log">中</span>
    {{# } }}
    {{# if(d.dataComplete == 3) {}}
    <span class="hp-badge layui-bg-red pointHand fr" title="预处理失败" lay-event="audit_log" onmouseover="showTip(`{{d.failMsg}}`,this)" onmouseout="removeTip(this)">败</span>
    {{# } }}
    <br/>
    <span style="color:#999;" class="gatherhotCateShow" cateFullName="{{d.ebayCateName}}">平台类目:</span>
    {{ d.platCateName || ''}}
    <br/>
    <span><input type="checkbox" name="isFixedCate" value="{{d.id}}" lay-skin="switch" lay-text="固|否"
                 lay-filter="isFixedCateFilter" {{ d.isFixedCate ? 'checked' : '' }}></span>
</script>
<script type="text/html" id="gh_subTitleTpl">
    <span class="pora copySpan">
          <a href="{{ d.onlineUrl }}" target="_blank">{{ d.title }}</a>
          <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                  onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span class="pora copySpan">
       <span style="color:#999;">产品ID:</span><a href="javascript:;">{{ d.platProdId }}</a>
       <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
    </span>
    <br/>
    <span style="color:#999;">分类:</span>
    {{#  if(d.cateId!=undefined){ }}
    {{ d.cateName }}
    {{#  } }}
</script>
<script type="text/html" id="gh_developerTpl">
    <span>
		{{ d.developer || ''}}
		{{#  if(d.developerId==undefined){ }}
		  <i class="layui-icon" style="color: #009688; cursor: pointer;" lay-event="gh_allotdeveloper"></i>
		{{#  } else { }}
		  <c:if test="${allotAgain}">
              <i class="layui-icon" style="color: #009688;cursor: pointer;" lay-event="gh_allotdeveloper"></i>
          </c:if>
		{{#  } }}           
	</span>
</script>
<script type="text/html" id="gh_devStatusTpl">
    <c:forEach items="${devStatusEnums}" var="devStatusEnum">
        {{# if(d.devStatus ==${devStatusEnum.getCode()}){ }}
        ${devStatusEnum.getValue()}
        {{# } }}
    </c:forEach>
</script>
<script type="text/html" id="gh_timeTpl">
    <span style="color:#999;">上架:</span>{{ Format( d.listingTime, "yyyy-MM-dd")}}<br>
    <span style="color:#999;">采集:</span>{{ Format( d.collTime, "yyyy-MM-dd")}}<br>
    {{# if(d.devStatus == '' || d.devStatus == 5 || d.devStatus == 6){ }}
    {{# if(d.auditTime !== undefined && d.auditTime !== null && d.auditTime!== ''){ }}
        <span style="color:#999;">模板审核:</span>{{ Format( d.auditTime, "yyyy-MM-dd")}}<br>
    {{# } }}
    {{# } }}

</script>

<script type="text/html" id="gh_listing_Tpl">
    {{# if(d.price) { }}
        <span style="color:#999;">总价($):</span>{{d.price}}<br>
    {{# } }}
    {{# if(d.sumTotalSales) { }}
    <span style="color:#999;">总销量:</span>{{d.sumTotalSales}}<br>
    {{# } }}
    {{# if(d.sumWeeklySales) { }}
    <span style="color:#999;">周销量/7:</span>{{Math.round(d.sumWeeklySales/7)}}<br>
    {{# } }}
    {{# if(d.growth) { }}
    <span style="color:#999;">增幅:</span>{{d.growth}}%<br>
    {{# } }}
    {{# if(d.score) { }}
    <span style="color:#999;">商品评分:</span>{{d.score}}<br>
    {{# } }}
</script>


<script type="text/html" id="saleCountPop_producttpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="saleCountPop_productTable" lay-filter="saleCountPop_productTable"></table>
        </div>
    </div>
</script>

<script type="text/html" id="prohibitDetailPop_producttpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="prohibitDetailPop_productTable" lay-filter="saleCountPop_productTable"></table>
        </div>
    </div>
</script>

<script type="text/html" id="gh_sales_Tpl">
    <div class="canClickEl mb10" onmouseenter="showSaleCountTabHot(this)" onmouseleave="removeTipHot(this)"><span style="color: grey;">7日:</span>{{ d.sevenSales}}<p style="display: none"> {{d.prodSaleCountList}}</p></div>
    <div class="canClickEl mb10" onmouseenter="showSaleCountTabHot(this)" onmouseleave="removeTipHot(this)"><span style="color: grey;">15日:</span>{{ d.fifteenSales}}<p style="display: none">{{d.prodSaleCountList}}</p></div>
    <div class="canClickEl mb10" onmouseenter="showSaleCountTabHot(this)" onmouseleave="removeTipHot(this)"><span style="color: grey;">30日:</span>{{ d.thirtySales}}<p style="display: none">{{d.prodSaleCountList}}</p></div>
</script>

<!-- 弹出模态框 -->
<!-- listing历史 -->
<script type="text/html" id="gh_operlogTpl">
    <div style="margin: 25px;">
        <ul class="layui-timeline">
            {{# layui.each(d, function(index, item){ }}
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis"></i>
                <div class="layui-timeline-content layui-text">
                    <h3 class="layui-timeline-title">{{ item.operStatus || '' }}
                        <span style="color: #999;font-size: 15px; font-family: serif;">[{{ item.operator }}</span>
                        <span style="color: #999;font-size: 14px; font-family: serif;">{{ layui.admin.Format( item.operTime, "yyyy-MM-dd hh:mm:ss")}}</span>
                        <span style="color: #999;font-size: 15px; font-family: serif;">]</span>
                    </h3>
                    <p> {{ item.operDesc}} </p>
                </div>
            </li>
            {{# }); }}
            {{# if(d.length === 0){ }}
            无日志
            {{# } }}
        </ul>
    </div>
</script>
<!--分配开发-->
<script id="allotdeveloperLayer" type="text/html">
    <div style="margin: 25px;">
        <form class="layui-form" id="allotdeveloperForm" lay-filter="allotdeveloperForm">
            <select lay-search>
                <option value=""></option>
                <c:forEach items="${developers}" var="developer">
                    <option value="${developer.id}">${developer.userName}</option>
                </c:forEach>
            </select>
        </form>
    </div>
</script>
<!--爆款商品详情，展示子Listing-->
<script type="text/html" id="gh_detailLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card" lay-filter="gatherhot_tab_card">
            <ul class="layui-tab-title">
                <li class="layui-this">合并详情</li>
                <li>操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <!-- 自身+子sku商品展示 -->
                    <table class="layui-table" id="gh_detailTable" lay-filter='gh_detail_table_filter'></table>
                </div>
                <div class="layui-tab-item">
                    <!-- 日志详情 -->
                    <div id="gatherhot_operationLog"></div>
                </div>
            </div>
        </div>

    </div>
</script>
<script type="text/html" id="gh_detailLayer_2">
    <div class="p20">
        <div class="layui-tab layui-tab-card" lay-filter="gatherhot_tab_card">
            <ul class="layui-tab-title">
                <li class="layui-this">操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <!-- 日志详情 -->
                    <div id="gatherhot_operationLog_new"></div>
                </div>
            </div>
        </div>

    </div>
</script>
<script type="text/html" id="gh_detailEditBar">
    {{#  if(d.groupId == 0 ){ }}
    <a type="button" disabled="disabled" class="layui-btn layui-btn-xs layui-btn-primary layui-disabled">移除</a>
    {{#  } else { }}
    <a type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="gh_detailRemove">移除</a>
    {{#  } }}
</script>

<!--匹配结果弹框，确认后保存-->
<script type="text/html" id="gh_matchCateLayer">
    <div class="p20">
        <table class="layui-table" id="gh_matchCateTable" lay-filter='gh_match_cate_table_filter'>
            <th>
                <div class="layui-form">
                    <input type="checkbox" id="th_cb" lay-skin="primary">
                </div>
            </th>
            <th>缩略图</th>
            <th>产品ID</th>
            <th>标题</th>
            <th>固定分类
                <div class="layui-form"><input type="checkbox" lay-skin="switch" id="sw_cb"></div>
            </th>
            <th>匹配结果</th>
        </table>
    </div>
</script>
<!-- 匹配结果弹框的表格模板 -->
<script type="text/html" id="gh_matchCateTable_tpl">
    <tbody>
    {{ each data }}
    <tr>
        <td>
            <div class="layui-form">
                <input type="checkbox" lay-skin="primary">
            </div>
        </td>
        <td><img src={{ $value.imgUri }} width='60' height='60'></td>
        <td>{{ $value.id }}</td>
        <td>{{ $value.title }}</td>
        <td>
            <div class="layui-form">
                <input type="checkbox" name="isFixedCate" value="{{$value.id}}" lay-skin="switch" {{ $value.isFixedCate
                       ? 'checked' : '' }}>
            </div>
        </td>
        <td>{{ $value.cateName }}
            <div class="disN td_cateId">{{ $value.cateId }}</div>
        </td>
    </tr>
    {{ /each }}
    </tbody>
</script>
<%--数据采集弹框--%>
<script type="text/html" id="gh_dataCollectLayer">
    <div class="layui-row">
        <div class="layui-col-xs6" style="padding: 20px">
            <form class="layui-form" id="gh_dataCollectEbayForm">
                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
                    <legend>eBay(votobo)</legend>
                </fieldset>
                <div class="layui-form-item " >
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                        <select name="siteIds" xm-select="gh_ebaySiteids" lay-verify="required">
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">上架时间</label>
                    <div class="layui-input-block">
                        <input type="text" name="timeStartStr" lay-verify="required" autocomplete="off"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">近7天销量</label>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="number" name="days7totalSoldMin" placeholder=">=7" lay-verify="required"
                                   min="7" autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-form-mid">~</div>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="number" name="days7totalSoldMax" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">发货地</label>
                    <div class="layui-form-mid layui-word-aux" style="line-height: 14px;">中国(包含大陆,港,澳,台)</div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">采集间隔(天)</label>
                    <div class="layui-input-block">
                        <input type="number" name="intervalDays" placeholder=">=1"  min="1" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div style="float: right">
                    <permTag:perm funcCode="gh_data_ebayCollectExecute">
                        <button class="layui-btn layui-btn-sm"  id="gh_ebayCollectExecute" lay-submit
                                lay-filter="gh_ebayCollectExecute" >保存并采集
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_data_gh_ebayCollectParam">
                        <button class="layui-btn layui-btn-sm" id="gh_ebayCollectParam" lay-submit
                                lay-filter="gh_ebayCollectParam"  >保存参数
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_data_ebayCollectSubmit">
                        <button class="layui-btn layui-btn-sm" id="gh_ebayCollectSubmit" lay-submit
                                lay-filter="gh_ebayCollectSubmit"  >开始采集
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_ebayStop">
                        <button class="layui-btn layui-btn-sm" id="gh_ebayStop" lay-submit
                                lay-filter="gh_ebayStop" >取消任务
                        </button>
                    </permTag:perm>
                </div>
                <div class="layui-col-xs11" style="margin: 40px">
                    <h2 class="collectStatus" style="float: left">未采集</h2>
                    <div class="layui-form-mid layui-word-aux lastStatus" style="line-height: 16px;"></div>
                    <div class="layui-form-mid layui-word-aux job" style="line-height: 16px;"></div>
                </div>
            </form>
        </div>
        <div class="layui-col-xs6" style="padding: 20px">
            <form class="layui-form" id="gh_dataCollectSmtForm">
                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
                    <legend>速卖通(牛魔王)</legend>
                </fieldset>
                <div class="layui-form-item">
                    <label class="layui-form-label">目录点</label>
                    <div class="layui-input-block">
                        <select name="productType" xm-select="gh_nmwProductType" lay-verify="required">
                            <option value="isHot" selected>产品热销榜</option>
                            <option value="isNew">新品热销榜</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <latimebel class="layui-form-label">上架时间</latimebel>
                    <div class="layui-input-block">
                        <input type="text" name="time" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">

                        <label class="layui-form-label" lay-tips="近7日日均销量">日均销量</label>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="number" name="avgBought7Min" lay-tips="近7日日均销量应>=3" placeholder=">=3" lay-verify="required" min="3"
                                   autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-form-mid">~</div>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="number" name="avgBought7Max" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">采集间隔(天)</label>
                    <div class="layui-input-block">
                        <input type="number" name="intervalDays" placeholder=">=1"  min="1" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"></label>
                    <div class="layui-form-mid layui-word-aux" style="line-height: 14px;"></div>
                </div>
                <div  style="float: right">
                    <permTag:perm funcCode="gh_data_smtCollectExecute">
                        <button class="layui-btn layui-btn-sm"  id="gh_smtCollectExecute" lay-submit
                                lay-filter="gh_smtCollectExecute" >保存并采集
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_data_gh_smtCollectParam">
                        <button class="layui-btn layui-btn-sm"  id="gh_smtCollectParam" lay-submit
                                lay-filter="gh_smtCollectParam" >保存参数
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_data_smtCollectSubmit">
                        <button class="layui-btn layui-btn-sm" id="gh_smtCollectSubmit" lay-submit
                                lay-filter="gh_smtCollectSubmit" >开始采集
                        </button>
                    </permTag:perm>
                    <permTag:perm funcCode="gh_smtStop">
                        <button class="layui-btn layui-btn-sm" id="gh_smtStop" lay-submit
                                lay-filter="gh_smtStop" >取消任务
                        </button>
                    </permTag:perm>
                </div>
                <div class="layui-col-xs11 ebayCollect" style="margin: 40px">
                    <h2 class="collectStatus" style="float: left">未采集</h2>
                    <%--<button class="layui-btn layui-btn-sm" lay-submit id="gh_smtCollectParam"--%>
                            <%--lay-filter="gh_smtCollectParam" style="float: right">保存参数--%>
                    <%--</button>--%>
                    <%--<button class="layui-btn layui-btn-sm" lay-submit id="gh_smtCollectExecute"--%>
                            <%--lay-filter="gh_smtCollectExecute" style="float: right">保存并采集--%>
                    <%--</button>--%>
                    <%--<button class="layui-btn layui-btn-sm" lay-submit id="gh_smtCollectSubmit"--%>
                            <%--lay-filter="gh_smtCollectSubmit" style="float: right">开始采集--%>
                    <%--</button>--%>
                    <div class="layui-form-mid layui-word-aux lastStatus" style="line-height: 16px;"></div>
                    <div class="layui-form-mid layui-word-aux job" style="line-height: 16px;"></div>
                </div>
            </form>
        </div>
    </div>
</script>

<script type="text/html" id="gatherhot_listingStatus">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <input type="hidden" id="gatherhot_listing_status_prodPId"/>
            <ul class="layui-tab-title isCreateHidden">
                <li class="layui-this" onclick="producttpl_AjaxToGetListingStatus('ebay')">ebay<span id="gatherhot_listing_num_span_ebay"></span></li>
                <li onclick="gatherhotGetListingSatus('wish')">wish<span id="gatherhot_listing_num_span_wish"></span></li>
                <li onclick="gatherhotGetListingSatus('shopee')">shopee<span id="gatherhot_listing_num_span_shopee"></span></li>
                <li onclick="gatherhotGetListingSatus('aliexpress')">smt<span id="gatherhot_listing_num_span_aliexpress"></span></li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20 pora layui-form" lay-filter="treeContent_producttpl">
                    <div class="treeContent">
                        <div class="platTreeplatTree" id="gatherhot_Tree_ebay">
                            <input hidden id="ifHadAjax_ebay"/>
                        </div>
                        <div class="platTree" id="producttpl_Tree_wish">
                            <input hidden id="ifHadAjax_wish">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_aliexpress">
                            <input hidden id="ifHadAjax_aliexpress">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_joom">
                            <input hidden id="gather_ifHadAjax_joom">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_shopee">
                            <input hidden id="ifHadAjax_shopee">
                            <div class="group_content">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="gatherhot_optimize_add_layer">
    <div class="p20">
        <form action="" class="layui-form" id="gatherhot_optimize_add_form">
            <div class="layui-form-item">
                <label class="layui-form-label">需求平台<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <select name="" id="gatherhot_optimize_platList_update_sel"></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">优化方向<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <select name="" id="gatherhot_optimize_optimReason_update_sel" lay-filter="gatherhot_optimize_optimReason_update_sel"></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">责任人<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" placeholder="责任人" id="gatherhot_optimize_developer_update_input" disabled="disabled">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售处理平台<span style="color: red;">*</span></label>
                <div class="layui-input-block" id="gatherhot_optimize_platList_sellDeal_chk">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">参考链接<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" placeholder="参考链接" id="gatherhot_optimize_linkRef_update_input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">需求备注<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" id="gatherhot_optimize_sellerNote_update_input"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="gatherhot_optimize_org_layer">
    <div class="layui-col-md3">
        <div style="display: inline-block; padding: 4px; overflow: auto;">
            <form class="layui-form" id="gatherhot_optimize_orgTreeForm">
                <div id="gatherhot_optimize_orgXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>
</script>

<script>
    var joomSensArray = new Array();
    <c:forEach items="${joomSensProp}" var="sensProp">
    var obj = {};
    obj['name'] = '${sensProp.name}';
    obj['value'] = '${sensProp.name}';
    obj['extend'] = '${sensProp.extend1}';
    joomSensArray.push(obj);
    </c:forEach>
</script>

<script type="text/html" id="gather_hot_productInfo_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{# if(d.purchaseCostPrice !== undefined && d.purchaseCostPrice !== null && d.purchaseCostPrice!== ''){ }}
            <span>采购成本:{{d.purchaseCostPrice}}</span></br>
        {{# } }}
        {{# if(d.supplier !== undefined && d.supplier !== null && d.supplier!== ''){ }}
            {{# if(d.purchaseUrl !== undefined && d.purchaseUrl !== null && d.purchaseUrl!== ''){ }}
                 <span>供应商:<a style="color:#01AAED;" href="{{ d.purchaseUrl }}" target="_blank">{{d.supplier}}</a></span>
            {{# }else{ }}
                <span>供应商:{{d.supplier}}</span>
            {{# } }}
            <br/>
        {{# } }}
        {{# if(d.bizzOwner !== undefined && d.bizzOwner !== null && d.bizzOwner!== ''){ }}
            <span>开发专员:{{d.bizzOwner}}</span>
        {{# } }}
    </div>
</script>
<script type="text/html" id="export_template_gatherhot_pop_id">
    <div class="p20">
        <form class="layui-form">
            <div><input type="checkbox" title="全选" lay-filter="export_template_gatherhot_pop_selectall" style="font-size: 22px"></div>
        </form>
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="export_template_gatherhot_pop_form_action"
                          id="export_template_gatherhot_pop_form_id">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:24px">采集的信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="标题" title="标题"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="产品ID" title="产品ID"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="类目" title="类目"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="总价($)" title="总价($)"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="总销量" title="总销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="周销量" title="周销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="评分" title="评分"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="平台" title="平台"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="上架时间" title="上架时间"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="采集时间" title="采集时间"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:24px">我们的信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="开发组别" title="开发组别"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="业绩归属人" title="开发专员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="父SKU" title="父SKU"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="在售商品数" title="在售商品数"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="商品状态" title="商品状态"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="采购成本" title="采购成本"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="刊登价格" title="刊登价格"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="供应商" title="供应商"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="7天销量" title="7天销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="15天销量" title="15天销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="30天销量" title="30天销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="审核备注" title="审核备注"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="开发备注" title="开发备注"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="模板审核时间" title="模板审核时间"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="gatherField" value="开发状态" title="开发状态"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/js/work/develop/hot/ProductOptimize.js"></script>
<script type="text/javascript" src="${ctx}/static/js/work/develop/hot/ProductListingDetail.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<script src="${ctx}/static/js/work/develop/gatherhot.js"></script>
<script src="${ctx}/static/template.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>
<script type="text/javascript" src="${ctx}/static/util/md5.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productedit.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/util/regUtils.js"></script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productoptimize.jsp"%>
    <script type="text/javascript" src="${ctx}/static/js/commodity/process/msgdevelopButton.js"></script>
    <script type="text/javascript">
        var msgBtn = ['关闭'];
        var msgBtn1 = ['关闭'];
        <permTag:perm funcCode="process_msg_btn">
        msgBtn = ['处理','关闭'];
        <permTag:perm funcCode="add_msg_btn">
        msgBtn = ['保存','处理','关闭'];
        </permTag:perm>
        </permTag:perm>
        <permTag:perm funcCode="add_msg_btn">
        msgBtn = ['保存','关闭'];
        msgBtn1 = ['保存','保存并发布','关闭'];
        <permTag:perm funcCode="process_msg_btn">
        msgBtn = ['保存','处理','关闭'];
        </permTag:perm>
        </permTag:perm>
    </script>

    <script>
    
      function removeTipHot(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}

function showSaleCountTabHot(self) {
    const counts = self.getElementsByTagName('p')[0].innerText;
    var saleCountList = [];
    if (counts.indexOf('undefined') === -1){
        saleCountList = JSON.parse(counts);
    }
    var layer = layui.layer,
        table = layui.table;
    var oldId = self.getAttribute('data-tipId');
    if (oldId) {
        layer.close(oldId)
    }

    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['750px', '250px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#saleCountPop_producttpl').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#saleCountPop_productTable",
                id: "saleCountPop_productTable",
                data: saleCountList,
                cols: [
                    [
                        { field: "countDays", title: "统计天数", width: 70 },
                        { field: "saleNum", title: "全平台", templet: '<div>{{d.saleNum || 0}}</div>' },
                        { field: "saleNumEbay", title: "ebay", templet: '<div>{{d.saleNumEbay || 0}}</div>' },
                        { field: "saleNumWish", title: "wish", templet: '<div>{{d.saleNumWish || 0}}</div>' },
                        { field: "saleNumAliexpress", title: "aliexpress", templet: '<div>{{d.saleNumAliexpress || 0}}</div>' },
                        { field: "saleNumShopee", title: "shopee", templet: '<div>{{d.saleNumShopee || 0}}</div>' },
                        { field: "saleNumAmazon", title: "amazon", templet: '<div>{{d.saleNumAmazon || 0}}</div>' },
                        { field: "saleNumJoom", title: "joom", templet: '<div>{{d.saleNumJoom || 0}}</div>' },
                        { field: "saleNumOther", title: "其他", templet: '<div>{{d.saleNumOther || 0}}</div>' },
                        { title: "统计时间", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>', width: 100 },
                    ],
                ],
                page: false,
            });
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
}
//开发备注的复制函数
function prodtpl_copyTxt(obj, event) {
    if (event) {
        event.stopPropagation()
    }
    var txt = $(obj).prev('div').text();
    var oInput = document.createElement('input'); //创建一个input元素
    oInput.value = txt;
    $(obj).parents('.prodtpl_developremark').append(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.style.display = 'none';
    layer.msg('复制成功');
    return false;
}
    </script>