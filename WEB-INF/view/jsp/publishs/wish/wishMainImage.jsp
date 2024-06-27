<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>wish主图</title>
<style>
    #toEditWishMainImage_ul li {
        float: left;
        margin-right: 10px
    }
    #wishMainImage_table_body .mainImg_inner_table td {
        text-align: center;
        border: none;
        border-bottom: 1px solid #ccc;
    }
    #wishMainImage_table_body .mainImg_inner_table tr:last-child td {
        border: none;
    }
</style>
<div class="layui-fluid" id="wish_mainImage">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="wishMainImage_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="wishMainImage_item">选择类目</button>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-wish-mian-image-div','LAY-wish-mian-image-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-wish-mian-image-hidden" name="cateId">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectMan_wishMainImage" name="bizzOwnerIds" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">审核组</label>
                                <div class="layui-input-block">
                                    <select name="auditTeam">
                                        <option value="" selected>请选择</option>
                                        <option value="审核1组">审核1组</option>
                                        <option value="审核2组">审核2组</option>
                                        <option value="审核3组">审核3组</option>
                                        <option value="审核4组">审核4组</option>
                                        <option value="审核5组">审核5组</option>
                                        <option value="审核6组">审核6组</option>
                                        <option value="审核7组">审核7组</option>
                                        <option value="审核8组">审核8组</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value=""  selected>全部</option>
                                        <option value="true">在售</option>
                                        <option value="false">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">wish侵权</label>
                                <div class="layui-input-block">
                                    <select name="isWishTort">
                                        <option value="" selected>全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">wish主图</label>
                                <div class="layui-input-block">
                                    <select name="wishImgStatus">
                                        <option value="" selected>全部</option>
                                        <option value="1">待修改</option>
                                        <option value="2">已完成</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchText" type="text" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="0">需求时间</option>
                                        <option value="1">完成时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="wishMainImageOrderTime">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderTimeType">
                                        <option value="0">需求时间升序</option>
                                        <option value="1">需求时间降序</option>
                                        <option value="2">完成时间升序</option>
                                        <option value="3">完成时间降序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" onClick="wishMainImage_searchProd()" id="wishMainImage_search">搜索</button>
                                <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset" id="wishMainImage_reset">清空
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="LAY-wish-mian-image-div"></div>
                </div>
            </div>
            <div class="layui-card" id="wishMainImageCard">
                <div class="layui-card-body">
                    <div id="wishMainImage_table"></div>
                    <div id="wishMainImage_pagination"  class="customPagination"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="wishMainImage_tpl">
    <div class="wishMainImage_table_head layui-table-header">
        <table class="layui-table">
            <thead>
            <tr>
                <th width="30px" hidden> </th>
                <th>图片</th>
                <th>商品名</th>
                <th>父SKU</th>
                <th>开发专员</th>
                <th>子SKU</th>
                <th>在售</th>
                <th>wish侵权</th>
                <th>备注</th>
                <th>wish主图</th>
                <th>时间</th>
                <th>操作</th>
            </tr>
            </thead>
        </table>
    </div>
    <div class="wishMainImage_table_body" style="margin-top: -2px">
        <table class="layui-table">
            <tbody id='wishMainImage_table_body'>
            {{ each data v i}}
            <tr>
                <td hidden width="30px">
                    <div class="layui-form">
                        <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.id }} name="id">
                    </div>
                </td>
                <td>
                    <img width="60" height="60" src="{{ v.pImg }}"  data-onerror="layui.admin.img_noFind()" class="lazy b1">
                </td>
                <td>
                    {{ v.enTitle }}<br/>
                </td>
                <td>
                    <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue;text-align: left">{{ v.pSku }}</a>
                </td>
                <td>
                    {{ v.bizzOwner }}<br/>
                </td>
                <td colspan="2"  style="padding: 10px 0" class="colspan_td">
                    <table style='width: 100%' class="mainImg_inner_table">
                        <tbody>
                        {{ each v.varients }}
                        {{if $index<5}}
                        <tr>
                        {{else}}
                        <tr  class="myj-hide">
                        {{ /if }}
                            <td>{{ $value.sSku }}</td>
                            <td>
                                {{if null==$value.isSale}}
                                {{else if $value.isSale}}
                                <span class="layui-green wishMainImage-isSale">在售</span>
                                {{else}}
                                <span class="layui-gray wishMainImage-isNotSale">停售</span>
                                {{/if}}
                            </td>
                        </tr>
                        {{ /each }}
                        </tbody>
                    </table>
                    {{  if(v.varients && v.varients.length > 5)}}
                    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.varients.length}})</a>
                    {{/if}}
                </td>
                <td>
                    <div style="text-align:left;" class="layui-form">
                        {{if v.isWishTort}}
                        <input type="checkbox" checked disabled title="wish" lay-skin="primary">
                        {{else}}
                        <input type="checkbox" disabled  title="wish" lay-skin="primary">
                        {{/if}}
                    </div>
                </td>
                <td>
                    {{if (v.wishImgNeedRemark !=null && v.wishImgNeedRemark !="")}}
                        <span  style="color:green">wish主图备注:{{ v.wishImgNeedRemark ? v.wishImgNeedRemark : ''}}</span><br/>
                    {{/if}}
                    {{if (v.wishTortReason !=null && v.wishTortReason !="")}}
                        <span  style="color:red">wish侵权备注:{{ v.wishTortReason ? v.wishTortReason : ''}}</span><br/>
                    {{/if}}
                    {{if (v.wishSaleRemark !=null && v.wishSaleRemark !="")}}
                        <span style="color:blue">wish销售备注:{{ v.wishSaleRemark }}</span>
                    {{/if}}
                </td>
                <td>
                    {{if v.wishImgStatus == 1}}
                        <span style="color:red">待修改</span>
                    {{else if v.wishImgStatus == 2}}
                        <span>已完成</span>
                    {{/if}}
                </td>
                <td width="150px">
                    <div>
                        {{if v.firstWishImgNeedTime}}
                        <span class="layui-green">需求:{{v.firstWishImgNeedTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                        {{/if}}
                    </div>
                    <div>
                        {{if v.wishImgFinishTime}}
                        <span class="layui-green">完成:{{v.wishImgFinishTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                        {{/if}}
                    </div>
                </td>
                <td>
                    <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="wishMainImage_openDetail('{{v.id}}')">主图详情</button><br>
                    <button  type="button" class="layui-btn layui-btn-xs  layui-btn-danger mb3" onclick="wishMainImage_delNedd('{{v.id}}')">删除需求</button><br>
                    <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="wishMainIamge_searchLog('{{v.id}}')">操作日志</button><br>
                </td>
            </tr>
            {{ /each }}
            </tbody>
        </table>
    </div>
</script>

<!-- wish添加基本信息模态框内容 -->
<script type="text/html" id="wishMainIage_Layer">
    <div class="p20">
        <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="wishMainImage_addNedd('{{v.id}}')">新增图片</button><br/>

        <div>
            <ul id="toEditWishMainImage_ul">
            </ul>
        </div>
        <div style="height:600px;" id="justforHelpButNo">
            <div id="xiuxiuEditor">

            </div>
        </div>
    </div>
</script>
<!--在线listing操作备注-->
<script type="text/html" id="wishProductImage_log_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="wishProductImage_log_table" lay-filter="wishProductImage_log_table"></table>
        </div>
    </div>
</script>

<script>
    //多选渲染函数
    function select_multi(name, arr) {
        var formSelects = layui.formSelects
        formSelects.render({
            name: name, //xm-select的值
            type: 2, //select样式为checkbox
            data: {
                arr: arr,
                name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
                val: 'value'
            }
        })
    }
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var selectMan_wishMainImage = [];
        $.ajax({
            type: "POST",
            url: ctx + "/sys/prodOwnerList.html",
            async: false,
            dataType: "json",
            success: function (returnData) {
                var data=returnData.data;
                for(var i=0;i<data.length;i++){
                    var a = {name: data[i].loginName, value:data[i].id}
                    selectMan_wishMainImage.push(a);
                }
                console.log(selectMan_wishMainImage);
                //属性多选
                //select_multi('selectAttr_store',platAccts)
                formSelects.data('selectMan_wishMainImage','local',{arr:selectMan_wishMainImage})
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    })
</script>

<script src="${ctx}/static/js/publishs/wish/wishMainImage.js"></script>
<script src="${ctx}/static/util/jqueryTempUtil.js"></script>
<script src="https://open.web.meitu.com/sources/xiuxiu.js"></script>