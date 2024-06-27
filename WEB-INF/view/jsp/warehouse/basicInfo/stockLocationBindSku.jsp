<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>库位管理</title>
<style type="text/css">
    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    #stockLocationBindSku .layui-btn+.layui-btn {
        margin-left: 0px !important;
    }

    .stockLocationBindSku_inner_table td {
        border-left: none;
        border-right: none;
        border-top: none;
    }

    .hidden {
        display: none !important;
    }

    select {
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccd1d5;
        position: relative;
        display: block;
        margin: 0 auto;
        width: 70%;
        max-width: 325px;
        color: #564d4d;
        vertical-align: middle;
        text-align: left;
        user-select: none;
        -webkit-touch-callout: none;
    }

    option {
        height: 30px;
        line-height: 30px;
        color: #564d4d;
        border: none;



    }
    .inline-SLB-title {
        width: 90px;
    }
    #picker_itemLocationPreLayerId {
      overflow: visible;
    }
</style>
<div class="layui-fluid" id="stockLocationBindSku">
    <!--容器-->
    <div class="layui-row layui-col-space15">
        <!--行-->
        <div class="layui-col-lg12 layui-col-md12">
            <!--偏移-->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="stockLocationBindSku_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" class="warehouseId" lay-search lay-filter="stockLocaBindSku_warehouseId"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">绑定人</label>
                                <div class="layui-input-block">
                                    <select name="bindUserId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">库位</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                        <input name="stockLocation" type="text" class="layui-input"
                                            placeholder="库位名称，支持多个逗号分隔，精确查询">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <select id="stockLocation_searchtype_sel">
                                            <option value="1">精确</option>
                                            <option value="0">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">sku</label>
                                <div class="layui-input-block">
                                    <input name="prodSSkuStr" type="text" class="layui-input"
                                        placeholder="商品子SKU，支持多个逗号分隔，模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">库位状态</label>
                                <div class="layui-input-block">
                                    <select name="locationStatus" lay-search="">
                                        <option value="">全部</option>
                                        <option value="1">在用</option>
                                        <option value="0">空闲</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">楼栋</label>
                                <div class="layui-input-block">
                                    <select name="buildNo" class="buildNo" id="stockLB_buildNo" xm-select="stockLB_buildNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">楼层</label>
                                <div class="layui-input-block">
                                    <select name="floorNo" class="floorNo" id="stockLB_floorNo" xm-select="stockLB_floorNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>


                            <div class="layui-col-lg6 layui-col-md6">
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-normal"
                                        id="stockLocationBindSku_search" onclick="stockLocationBindSku_searchProd()"
                                        type="button">搜索</button>
                                    <button class="layui-btn layui-btn-sm" onclick="stockLocationBindSku_bindSku2()"
                                        type="button">绑定库位</button>

                                    <button class="layui-btn layui-btn-sm" id="stockLocationBindSku_print"
                                        onclick="stockLocationBindSku_printStockLoca()" type="button">批量打印标签</button>
                                    <permTag:perm funcCode="stockLocationBindSku_picker_permTag">
                                    <button class="layui-btn layui-btn-sm" id="stockLocationBindSku_bind_picker"
                                        onclick="stockLocationBindSku_bind_picker_fun()" type="button">绑定拣货人</button>
                                    </permTag:perm>

                                    <span style="margin-left:30px;">
                                        <input type="checkbox" name="stockLocationBindSKu_whetherPrint" title="打印SKU" lay-skin="primary" checked>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 表格模块+分页 --%>
            <div class="layui-card">
                <div class="layui-card-header toFixedContain">
                    <!-- <div class="btn-group fr">
                        <permTag:perm funcCode="stockLocationBindSku_inventory_permTag">
                        <button type="button" class="layui-btn layui-btn-sm"
                            id="stockLocationBindSku_location_import_inventory"
                            onclick="document.getElementById('stockLocationBindSku_location_import_inventory_file').click()"
                            title="导入表格只有一列,标题为库位">库位盘点导入</button>
                        <input type="file" name="location_import_inventory_excel"
                            id="stockLocationBindSku_location_import_inventory_file" hidden>
                        </permTag:perm>
                        <permTag:perm funcCode="add_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationAdd">新增</button>
                        </permTag:perm>
                        <permTag:perm funcCode="batchRemove_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationRemoveBind">批量解除绑定</button>
                        </permTag:perm>
                        <permTag:perm funcCode="exportLocal_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_exportLocaInfo">导出库位信息</button>
                        </permTag:perm>
                        <permTag:perm funcCode="exportSku_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_exportSkuInfo">导出仓库SKU</button>
                        </permTag:perm>
                        <permTag:perm funcCode="downloadLocalTemplete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationTemplate">库位模板</button>
                        </permTag:perm>
                        <permTag:perm funcCode="importLocal_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_importLocation"
                                onclick="document.getElementById('stockLocationBindSku_importLocation_file').click()">导入库位</button>
                        </permTag:perm>
                        <input type="file" name="locationExcel" id="stockLocationBindSku_importLocation_file" hidden>
                        <permTag:perm funcCode="skuTemplete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationBindSkuTemplate">库位绑定SKU模板</button>
                        </permTag:perm>
                        <permTag:perm funcCode="importSku_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_importLocationBindSku"
                                onclick="document.getElementById('stockLocationBindSku_importLocationBindSku_file').click()">导入绑定SKU</button>
                        </permTag:perm>
                        <input type="file" name="locationBindSkuExcel"
                            id="stockLocationBindSku_importLocationBindSku_file" hidden>
                        <permTag:perm funcCode="pickAreaTemplete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_pickAreaTemplate">更新拣货区域模板</button>
                        </permTag:perm>
                        <permTag:perm funcCode="importPickArea_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_importPickArea"
                                onclick="document.getElementById('stockLocationBindSku_importPickArea_file').click()">导入修改库位</button>
                        </permTag:perm>
                        <input type="file" name="pickAreaExcel" id="stockLocationBindSku_importPickArea_file" hidden>
                        <permTag:perm funcCode="batchdelete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger"
                                id="stockLocationBindSku_batchDelete">批量删除</button>
                        </permTag:perm>
                        <permTag:perm funcCode="downloadReturnAreaTemplete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_return_areaTemplate">退货区域模板</button>
                        </permTag:perm>
                        <permTag:perm funcCode="batchdelete_stockLocationReturnArea">
                            <button type="button" class="layui-btn layui-btn-sm "
                                id="stockLocationBindSku_import_return_area"
                                onclick="document.getElementById('stockLocationBindSku_import_return_area_file').click()">导入退货区域
                            </button>
                            <input type="file" name="returnAreaExcel" id="stockLocationBindSku_import_return_area_file"
                                hidden>
                        </permTag:perm>
                        <permTag:perm funcCode="downloadUpdateLocation_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                    id="stockLocationBindSku_locationChangeNumTemplate">修改库位编号模板</button>
                        </permTag:perm>
                        <permTag:perm funcCode="updateLocationNum_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                    id="stockLocationBindSku_updateLocationNum"
                                    onclick="document.getElementById('stockLocationBindSku_importLocationChangeNum_file').click()">批量修改库位编号</button>
                        </permTag:perm>
                        <input type="file" name="locationChangeNumExcel" id="stockLocationBindSku_importLocationChangeNum_file" hidden>
                    </div> -->
                <form class="layui-form" style="padding-top: 10px;">
                    <div style="float: left;">
                        <permTag:perm funcCode="batchdelete_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger"
                                id="stockLocationBindSku_batchDelete">批量删除</button>
                        </permTag:perm>
                    </div>
                    <div style="float: right">
                            
                        <permTag:perm funcCode="stockLocationBindSku_inventory_permTag">
                        <button type="button" class="layui-btn layui-btn-sm"
                            id="stockLocationBindSku_location_import_inventory"
                            onclick="document.getElementById('stockLocationBindSku_location_import_inventory_file').click()"
                            title="导入表格只有一列,标题为库位">库位盘点导入</button>
                        <input type="file" name="location_import_inventory_excel"
                            id="stockLocationBindSku_location_import_inventory_file" hidden>
                        </permTag:perm>
                        <permTag:perm funcCode="add_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationAdd">新增</button>
                        </permTag:perm>
                        <permTag:perm funcCode="batchRemove_stockLocationBindSku">
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="stockLocationBindSku_locationRemoveBind">解除绑定</button>
                        </permTag:perm>
                    
                        <div id="stockLocationBindSku_export" class="layui-inline">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm inline-SLB-title">导出</button>
                            <ul class="hidden">
                                <permTag:perm funcCode="exportLocal_stockLocationBindSku">
                                    <li id="stockLocationBindSku_exportLocaInfo">导出库位信息</li>
                                </permTag:perm>
                                <permTag:perm funcCode="exportSku_stockLocationBindSku">
                                    <li id="stockLocationBindSku_exportSkuInfo">导出仓库SKU</li>
                                </permTag:perm>
                            </ul>
                        </div>
                    
                        <div id="stockLocationBindSku_downloadReport" class="layui-inline">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm inline-SLB-title">下载模板</button>
                            <ul class="hidden">
                                <permTag:perm funcCode="downloadLocalTemplete_stockLocationBindSku">
                                    <li id="stockLocationBindSku_locationTemplate">新增库位模板</li>
                                </permTag:perm>
                                <permTag:perm funcCode="skuTemplete_stockLocationBindSku">
                                    <li id="stockLocationBindSku_locationBindSkuTemplate">库位绑定SKU</li>
                                </permTag:perm>
                                <permTag:perm funcCode="pickAreaTemplete_stockLocationBindSku">
                                    <li id="stockLocationBindSku_pickAreaTemplate">修改库位模板</li>
                                </permTag:perm>
                                <permTag:perm funcCode="downloadReturnAreaTemplete_stockLocationBindSku">
                                    <li id="stockLocationBindSku_return_areaTemplate">退货区域模板</li>
                                </permTag:perm>
                                <permTag:perm funcCode="downloadUpdateLocation_stockLocationBindSku">
                                    <li id="stockLocationBindSku_locationChangeNumTemplate">库位属性模板</li>
                                </permTag:perm>
                                <permTag:perm funcCode="downloadLocationStandard_stockLocationBindSku">
                                    <li id="stockLocationBindSku_locationStandardTemplate">库位规格模板</li>
                                </permTag:perm>
                            </ul>
                        </div>
                                
                        <input type="file" name="pickAreaExcel" id="stockLocationBindSku_importPickArea_file" hidden>
                        <input type="file" name="locationExcel" id="stockLocationBindSku_importLocation_file" hidden>
                        <input type="file" name="locationBindSkuExcel" id="stockLocationBindSku_importLocationBindSku_file" hidden>
                        <input type="file" name="returnAreaExcel" id="stockLocationBindSku_import_return_area_file" hidden>
                        <input type="file" name="locationChangeNumExcel" id="stockLocationBindSku_importLocationChangeNum_file" hidden>
                        <input type="file" name="locationStandardImportExcel" id="stockLocationBindSku_locationStandardImportExcel_file" hidden>
                        <div id="stockLocationBindSku_importStatements" class="layui-inline">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm inline-SLB-title">导入</button>
                            <ul class="hidden">
                                <permTag:perm funcCode="importLocal_stockLocationBindSku">
                                    <li id="stockLocationBindSku_importLocation" onclick="document.getElementById('stockLocationBindSku_importLocation_file').click()">导入新增库位</li>
                                </permTag:perm>
                                <permTag:perm funcCode="importSku_stockLocationBindSku">
                                    <li id="stockLocationBindSku_importLocationBindSku" onclick="document.getElementById('stockLocationBindSku_importLocationBindSku_file').click()">库位绑定SKU</li>
                                </permTag:perm>
                                <permTag:perm funcCode="importPickArea_stockLocationBindSku">
                                    <li id="stockLocationBindSku_importPickArea" onclick="document.getElementById('stockLocationBindSku_importPickArea_file').click()">导入修改库位</li>
                                </permTag:perm>
                                <permTag:perm funcCode="batchdelete_stockLocationReturnArea">
                                    <li id="stockLocationBindSku_import_return_area" onclick="document.getElementById('stockLocationBindSku_import_return_area_file').click()">导入退货区域</li>
                                </permTag:perm>
                                <permTag:perm funcCode="updateLocationNum_stockLocationBindSku">
                                    <li id="stockLocationBindSku_updateLocationNum" onclick="document.getElementById('stockLocationBindSku_importLocationChangeNum_file').click()">导入库位属性</li>
                                </permTag:perm>
                                <permTag:perm funcCode="importLocationStandard_stockLocationBindSku">
                                    <li id="stockLocationBindSku_importLocationStandard" onclick="document.getElementById('stockLocationBindSku_locationStandardImportExcel_file').click()">导入库位规格</li>
                                </permTag:perm>
                            </ul>
                        </div>
                    </div>
                </form>
               
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="stockLocationBindSku_table" lay-filter="stockLocationBindSku_table"></table>
                    <!-- <div id="stockLocationBindSku_table"></div> -->
                    <div id="stockLocationBindSku_pagination" class="customPagination"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 绑定sku弹框(指定库位) --%>
<script type="text/html" id="stockLocationBindSku_tpl1">
    <form action="" class="layui-form layui-form-pane" id="stockLocationBindSku_form2">

        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">仓库</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="warehouseName" readonly>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">库位</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="stockLocation" readonly>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">商品SKU</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" name="sSku">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <input type="checkbox" name="continueDo" title="连续绑定同一库位" lay-skin="primary" checked>
        </div>
    </form>
</script>

<%-- 绑定sku弹框(自选仓库和库位) --%>
<script type="text/html" id="stockLocationBindSku_tpl2">
    <form action="" class="layui-form layui-form-pane" id="stockLocationBindSku_form3">

        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">仓库</label>
                <div class="layui-input-block">
                    <select name="warehouseId" lay-search></select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">库位</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="stockLocation">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">商品SKU</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" name="sSku">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <input type="checkbox" name="continueDo" title="连续绑定同一库位" lay-skin="primary" checked>
        </div>
    </form>
</script>

<%--新增or编辑库位--%>
<script type="text/html" id="stockLocationBindSku_locationTpl">
    <form action="" class="layui-form layui-form-pane" id="stockLocationBindSku_locationForm">
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><font color='red'>*</font>所属仓库</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="warehouseName" readonly>
                    <input class="layui-input" name="warehouseId" type="hidden">
                </div>
                <%-- <div class="layui-input-inline" style="width:300px">
                     <input type="checkbox" name="used" title="停用" lay-skin="primary">
                 </div>--%>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><font color='red'>*</font>库位</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="stockLocation">
                </div>
                <label class="layui-form-label"><font color='red'>*</font>拣货顺序</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" required name="pickOrder">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <!-- <label class="layui-form-label">货架编码</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="text" class="layui-input" name="shelfCode" >
                </div> -->
                <label class="layui-form-label"><font color='red'>*</font>拣货栋号</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="buildingNo" >
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><font color='red'>*</font>拣货楼层</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="floorNo">
                </div>
                <label class="layui-form-label">邻近库位</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="nearArea">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><font color='red'>*</font>上架区域</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="shelfArea">
                </div>
                <label class="layui-form-label"><font color='red'>*</font>退货区域</label>
                <div class="layui-input-inline" style="width:300px">
                    <input type="number" class="layui-input" name="returnArea">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <input type="checkbox" name="continueDo" title="连续增加" lay-skin="primary" checked>
        </div>
    </form>
</script>

<%-- 1对n模板 --%>
<script type="text/html" id="stockLocationBindSku_tpl">
    <div class="stockLocationBindSku_table_head layui-table-header">
        <table class="layui-table">
            <colgroup>
                <col width="50px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="115px"/>
                <col width="100px"/>
                <col width="115px"/>
                <col width="100px"/>
            </colgroup>
            <thead>
            <tr>
                <th width="50px"><input type="checkbox" class="pid-all-cbox" lay-skin="primary" onclick="stockLocationBindSku_checkAll(this)"></th>
                <th width="115px">仓库</th>
                <th width="115px">区域</th>
                <th width="115px">库位名称</th>
                <th width="115px">原库位名称</th>
                <th width="115px">库位状态</th>
                <th width="115px">楼层</th>
                <th width="115px">楼栋</th>
                <th width="115px">拣货顺序</th>
                <th width="115px">邻近库位</th>
                <th width="115px">上架区域</th>
                <th width="115px">退货区域</th>
                <th width="115px">SKU</th>
                <th width="100px">绑定人</th>
                <th width="115px">操作</th>
                <th width="100px">库位操作</th>
            </tr>
            </thead>
        </table>
    </div>
    <div class="stockLocationBindSku_table_body" style="margin-top: -2px">
        <table class="layui-table">
            <colgroup>
                <col width="50px"/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col/>
                <col width="100px"/>
            </colgroup>
            <tbody id='stockLocationBindSku_table_body'>
            {{ each data v i}}
            <tr data-locationId="{{v.whStockLocationId}}">
                <td style="width: 50px;">
                    <div class="layui-form">
                        <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.locationCode }} name="whStockLocationId">
                    </div>
                </td>
                <td>
                    {{ v.warehouseName }}
                </td>
                <td>
                    {{ v.regionCode }}
                </td>
                <td>
                    {{ v.locationCode }}
                </td>
                <td class="originalLocationCode">
                    {{ v.originalLocationCode }}
                </td>
                <td>
                    {{if v.alreadyBindSku }}
                    <span>在用</span>
                    {{else}}
                    <span style="color:red">空闲</span>
                    {{ /if }}
                </td>
                <td>
                    {{ v.floorNo }}
                </td>
                <td>
                    {{ v.buildingNo }}
                </td>
                <td>
                    {{ v.pickOrder }}
                </td>
                <td>
                    {{ v.nearArea }}
                </td>
                <td>
                    {{ v.shelfArea }}
                </td>
                <td>
                    {{ v.returnArea }}
                </td>
                <td colspan="3"  style="padding: 10px 0" class="colspan_td">
                    <table style='width: 100%' class="stockLocationBindSku_inner_table">
                        <tbody>
                        {{ each v.bindSkuList }}
                        {{if $index<5}}
                        <tr>
                            {{else}}
                        <tr  class="myj-hide">
                            {{ /if }}
                            <td class="sSku">{{ $value.sSku }}</td>
                            <td>
                                {{ $value.creator }}
                            </td>
                            <td style="display: none" class="title">
                                {{ $value.title }}
                            </td>
                            <td style="display: none" class="style">
                                {{ $value.style }}
                            </td>
                            <td>
                                <permTag:perm funcCode="delBindSku_stockLocationBindSku">
                                    <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_delBind('{{$value.id}}','{{ v.warehouseName }}')">解除绑定</button><br>
                                </permTag:perm>
                            </td>
                        </tr>
                        {{ /each }}
                        </tbody>
                    </table>
                    {{  if(v.bindSkuList && v.bindSkuList.length > 5)}}
                    <a href="javascript:" onclick="changeColspantable(this);"  style="float:right;"><span>+ 展开</span>({{v.bindSkuList.length}})</a>
                    {{/if}}
                </td>
                <td style="width: 72px;">
                    <permTag:perm funcCode="bindSku_stockLocationBindSku">
                        <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_bindSku('{{v.whStockLocationId}}','{{v.locationCode}}','{{v.warehouseName}}')">绑定SKU</button><br>
                    </permTag:perm>
                    <permTag:perm funcCode="delLocation_stockLocationBindSku">
                        <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_delStockLocation('{{v.whStockLocationId}}','{{v.warehouseName}}')">删除库位</button><br>
                    </permTag:perm>
                    <permTag:perm funcCode="editLocation_stockLocationBindSku">
                        <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_locationEdit('{{v.warehouseId}}','{{v.whStockLocationId}}','{{v.warehouseName}}')">编辑</button><br>
                    </permTag:perm>
                </td>
            </tr>
            {{ /each }}
            </tbody>
        </table>
    </div>
</script>
<script id="stockLocationBindSku_Location_operations" type="text/html">
     <div style="width: 72px;margin: 0 auto;">
        <permTag:perm funcCode="bindSku_stockLocationBindSku">
            <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_bindSku('{{d.whStockLocationId}}','{{d.locationCode}}','{{d.warehouseName}}')">绑定SKU</button><br>
        </permTag:perm>
        <permTag:perm funcCode="delLocation_stockLocationBindSku">
            <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_delStockLocation('{{d.whStockLocationId}}','{{d.warehouseName}}')">删除库位</button><br>
        </permTag:perm>
        <permTag:perm funcCode="editLocation_stockLocationBindSku">
            <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_locationEdit('{{d.warehouseId}}','{{d.whStockLocationId}}','{{d.warehouseName}}')">编辑</button><br>
        </permTag:perm>
    </div>
</script>
<script id="stockLocationBindSku_Mixed_operation" type="text/html">
    <div style="padding: 10px 0" class="colspan_td">
        <div class="layui-col-lg12 layui-col-md12" style="border-bottom: 1px solie #ccc;">
            <table style='width: 100%' class="stockLocationBindSku_inner_table">
                <tbody>
                {{#  layui.each(d.bindSkuList, function(index, item){ }}
                {{#  if(index < 5){ }}
                    <tr>
                {{#  } else { }}
                    <tr  class="myj-hide">
                {{#  } }} 
                    <td class="sSku">{{ item.sSku }}</td>
                    <td>
                        {{ item.creator }}
                    </td>
                    <td style="display: none" class="title">
                        {{ item.title }}
                    </td>
                    <td style="display: none" class="style">
                        {{ item.style }}
                    </td>
                    <td>
                        <permTag:perm funcCode="delBindSku_stockLocationBindSku">
                            <button  type="button" class="layui-btn layui-btn-xs mb3" onclick="stockLocationBindSku_delBind('{{item.id}}','{{ d.warehouseName }}')">解除绑定</button><br>
                        </permTag:perm>
                    </td>
                </tr>
                {{#  }); }}
                </tbody>
            </table>
            {{#  if(d.bindSkuList && d.bindSkuList.length > 5){ }}
            <a href="javascript:" onclick="changeColspantable(this);"  style="float:right;"><span>+ 展开</span>({{d.bindSkuList.length}})</a>
            {{#  } }} 
           
        </div>
    </div>
</script>
<%-- 第一版 不知道怎么获取table表格的元素所以放弃  start--%>
<script id="stockLocationBindSku_bind_picker_script" type="text/html">
    <div class="layui-form-item">
        <div class="layui-inline">
            <label class="layui-form-label">仓库</label>
            <div class="layui-input-inline" style="width:300px">
                <input type="text" class="layui-input" required name="warehouseName" readonly>
            </div>
        </div>
        <table class="layui-table" id="stockLocationBindSku_bind_picker_table"
               lay-filter="stockLocationBindSku_bind_picker_table" style="margin-top: 0px;"></table>
    </div>
</script>

<script id="stockLocationBindSku_picker_select_list_script" type="text/html">
    <%--    <select name="devTypeList" xm-select="devTypeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">--%>
    <%--        <option v-for="(devType,devTypeindex) in devTypeData" :value="devType.name">{{devType.name}}</option>--%>
    <%--    </select>--%>
    <select name="">
        <option value="">请选择</option>
        {{ # if (d.userList) { }}
        {{# for (let i = 0; i < d.userList.length; ++i) {}}
        <option value="{{d.userList[i].id}}"> {{d.userList[i].userName || '' }}</option>
        {{# } }}
        {{ # } }}
    </select>
</script>
<%-- 第一版 不知道怎么获取table表格的元素所以放弃  end--%>


<%-- 当前使用 --%>
<script type="text/html" id="stockLocationBindSku_bind_picker_table_detail_tpl">

    {{# if(d){  }}
    {{#  layui.each(d, function(index, item){ }}
    <tr data-index="{{ index }}">
        <%-- 仓库 --%>
        <td data-field="warehouseName">{{item.warehouseName||''}}</td>
        <%-- 库位前缀 --%>
        <td data-field="locationPre">
            {{item.locationPre||""}}
        </td>
        <%-- 拣货人 --%>
            <td data-field="pickerId">
                <input type="hidden" value="{{item.pickerId || ''}}">
                <span class="picker">{{item.picker || ''}}</span>
                <span class="layui-btn layui-btn-xs setPicker">设置</span>
            </td>

        <%-- 备注 --%>
        <td data-field="remark"><input type="text" class="layui-input" value='{{item.remark || ""}}'></td>
    </tr>
    {{#  }) }}
    {{# } }}

</script>

<!-- 选项弹框 -->
<script type="text/html" id="picker_itemLocationPreLayer">
  <div class="layui-form" style="padding:20px;">
    <select name="picker" xm-select="picker_itemLocationPre" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" id="slbs_picker_itemLocationPre">
    
    </select>
  </div>
</script>


<script type="text/html" id="stockLocationBindSku_bind_picker_new_script" >
    <div style="padding: 20px;" class="layui-form">
      <div class="layui-form-item">
          <div class="layui-inline">
              <span class="layui-btn layui-btn-sm" id="ationBindSku_bind_import" style="margin-left:20px">导入</span>
              <input type="file" name="sInfoExcel" id="ationBindSku_bind_import_input" class="hidden">
              <input type="text" hidden id="stockLocationBindSku_bind_picker_store_id">
          </div>
          <div class="layui-inline">
              <button type="button" class="layui-btn layui-btn-sm" id="action_BindSku_bind_export_tpl" >下载导出模板</button>
          </div>
          <div class="layui-inline">
            <label class="layui-form-label">库位前缀</label>
            <div class="layui-input-block">
                <select id="slbs_locationPres" name="locationPres"  xm-select="xm_locationPres" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                </select>
            </div>
          </div>
          <div class="layui-inline">
            <label class="layui-form-label">拣货人</label>
            <div class="layui-input-block">
                <select id="slbs_pickerId" name="pickerId" lay-search></select>
            </div>
          </div>
          <div class="layui-inline">
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="slbs_bindPickerBtn">查询</span>
          </div>
      </div>
      <table class="layui-table">
        <thead>
        <tr>
            <th>仓库</th>
            <th>库位前缀</th>
            <th>拣货人</th>
            <th>备注</th>
        </tr>
        </thead>
        <tbody id="stockLocationBindSku_bind_picker_new_detail_tbody">
        </tbody>
      </table>
    </div>
</script>

<script src="${ctx}/static/util/jqueryTempUtil.js"></script>
<script src="${ctx}/static/js/warehouse/stockLocationBindSku.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>