<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style>
    /*eBay属性列 css*/
    .specificsField input{
        display: inline-block;
        width: 80%;
    }
    .specificsField i{
        color: red;
        cursor:pointer;
        display: none;
    }
    .specificsField:hover i{
        color: red;
        cursor:pointer;
        display: inline;
    }
    .specificsFieldPicture input{
        border-color: green;
    }
</style>
<!--<title>修改多属性信息</title>-->
<div style="padding: 10px" id="eo_modifySkuDiv">
    
</div>

<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/modifySku.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<!--弹框模板-->
<script type="text/html" id="eo_modifySkuTpl">
    <form class="layui-form">
        <div class="layui-row" style="margin: 0 15px;">
          <div class="layui-inline" style="float: left;">
            <input lay-filter="eo_selectAllFilter" title="全选" type="checkbox" lay-skin="primary">
          </div>
          <div class="layui-inline" style="float: right;">
            <button id="eo_modifySkuSaveBtn" type="button" class="layui-btn layui-btn-sm layui-btn-normal">提交修改</button> 
          </div>
        </div>
        <div class="layui-collapse">
            <!--item-->
        </div>
    </form>
</script>
<!--单个商品修改模板 artTemplate-->
<script type="text/html" id="eo_modifySkuItemTpl">
    <div class="layui-colla-item" id="eo_modifyItemDiv_{{ d.id }}">
        <h2 class="layui-colla-title">
            <input type="checkbox" name="itemId" value="{{ d.itemId }}" title="{{ d.storeAcct }} -- {{ d.itemId }}" lay-skin="primary">
            <input name="siteId" type="hidden" value="{{d.siteId}}">
            <input name="storeAcctId" type="hidden" value="{{d.storeAcctId}}">
            <span id="result_tips_{{d.itemId}}"></span>
        </h2>
        <div class="layui-colla-content layui-show">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-lg3">
                    <button type="button" class="addSkuBtn layui-btn layui-btn-sm layui-btn-normal">新增SKU</button> 
                    <button type="button" class="addSpecificsBtn layui-btn layui-btn-sm layui-btn-normal">新增属性</button>

                    <button type="button" class="useProdSSkuBtn layui-btn layui-btn-sm layui-btn-normal">使用商品sku</button>
                </div>
                <div class="layui-inline layui-col-lg4">
                    <div class="layui-col-md5 layui-col-lg5">
                        <label class="layui-form-label">当前数量:</label>
                        <div class="layui-input-block">
                            <select name="operator">
                                <option>=</option>
                                <option>+</option>
                                <option>-</option>
                                <option>*</option>
                                <option>/</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6 layui-col-lg3"> <input type="number" name="deviation" class="layui-input" autocomplete="off"> </div>
                    <div class="layui-col-md3 layui-col-lg3"> <button type="button" class="batchChangeStockBtn layui-btn layui-btn-sm layui-btn-normal">应用</button> </div>
                </div>
                <div class="layui-inline layui-col-lg4">
                    <div class="layui-col-md5 layui-col-lg5">
                        <label class="layui-form-label">当前价格:</label>
                        <div class="layui-input-block">
                            <select name="operator">
                                <option>=</option>
                                <option>+</option>
                                <option>-</option>
                                <option>*</option>
                                <option>/</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6 layui-col-lg3"> <input type="number" name="deviation" class="layui-input" autocomplete="off"> </div>
                    <div class="layui-col-md3 layui-col-lg3"> <button type="button" class="batchChangePriceBtn layui-btn layui-btn-sm layui-btn-normal">应用</button> </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">图片关联属性</label>
                <div class="layui-input-block pictureFieldDiv">
                    <input type="radio" class="pictureField" value="color" title="color" lay-filter="pictureField">
                    <input type="radio" class="pictureField" value="size" title="size" lay-filter="pictureField">
                    <input type="radio" class="pictureField" value="style" title="style" lay-filter="pictureField">
                </div>
            </div>
            <!--表格-->
            <div class="layui-form-item">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>图片</th>
                            <th class="stock">数量</th>
                            <th class="price">价格</th>
                            <th>SKU</th>
                            <th>删除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#  layui.each(d.list, function(index, subItem){ }}
                        <tr>
                            <input name="ean" type="hidden" value="{{subItem.ean || ''}}">
                            <input name="upc" type="hidden" value="{{subItem.upc || ''}}">
                            <td>
                                <div style="width: 60px;">
                                    <input type="hidden" name="imgUri" value="{{subItem.pictureUrl || ''}}">
                                    <img class="img_show_hide" width="60" height="60" src="{{subItem.pictureUrl || ''}}" onerror="layui.admin.img_noFind()">
                                    <br>
                                    <div class="eo_subSkuImg_edit_local">本地图片</div>
                                    <div class="layui-btn layui-btn-primary layui-btn-sm"
                                         onclick="eo_subSkuImg_exchangeNet(this)">网络图片</div>
                                </div>
                            </td>
                            <td class="stock">
                                <input type="number" name="stock" value="{{subItem.stock}}" class="layui-input">
                            </td>
                            <td class="price">
                                <input type="number" name="price" value="{{subItem.price || ''}}" class="layui-input">
                            </td>
                            <td class="storeSubSku">
                                <input type="text" name="storeSubSku" value="{{subItem.storeSubSku || ''}}" class="layui-input">
                            </td>
                            <td>
                                {{# if(subItem.soldNums != 0){ }}
                                    <input name="status" type="hidden" value="{{subItem.id || ''}}" lay-skin="primary" disabled>
                                {{# }else{ }}
                                 <input name="status" type="checkbox" value="{{subItem.id || ''}}" lay-skin="primary">
                                {{# } }}
                            </td>
                            <td class="prodSSku" style="display: none">
                                <input type="text" name="prodSSku" value="{{subItem.prodSSku || ''}}" class="layui-input">
                            </td>
                        </tr>
                        {{#  }); }}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</script>
<!--specifics td模板-->
<script type="text/html" id="eo_specificsThTpl">
     <th width="100" class="specificsField :specificsFieldPicture">
        <input name="specifics" value=":key" class="layui-input">
        <i class="layui-icon delSpecificsBtn">&#xe640;</i>
    </th>
 </script>
