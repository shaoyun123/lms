<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>侵权库</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="prodTortSearchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">商品类目</label>
                                    <div class="layui-input-block">
                                        <select name="cateId" lay-search id="prodTortSearchCateIdSel">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">侵权类型</label>
                                    <div class="layui-input-block">
                                        <select name="tortType" lay-search id="prodTortSearchTortTypeSel">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">侵权平台</label>
                                    <div class="layui-input-block">
                                        <select name="tortSites" id="prodTortSearchTortSiteSel" lay-search>
                                                <option value="">全部</option>
                                                <option value="1">全平台</option>
                                                <option value="11">wish</option>
                                                <option value="12">ebay</option>
                                                <option value="14">joom</option>
                                                <option value="13">aliexpress</option>
                                                <option value="15">amazon</option>
                                                <option value="16">shopee</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">搜索类型</label>
                                    <div class="layui-input-block">
                                        <select name="serchType" id="prodTortSearchTypeSel" lay-search>
                                                <option value="1">中文名</option>
                                                <option value="2">英文名</option>
                                                <option value="3">品牌</option>
                                                <option value="4">SKU</option>
                                                <option value="5">投诉人</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">搜索内容</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="prodTortSearchVal" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" data-type="reload" id="prodTortSearchBtn">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                            <input name="status" type="hidden" id="prodTortStatus" value="1">
                        </form>

                    </div>
                </div>
                <div class="layui-card" id="torhouseCard">
                    <div class="layui-card-header pora">
                        <ul class="layui-tab-title fl" style="border-bottom: none;">
                            <li class="layui-this" onclick="queryPage_prodbrand(1)">需检测(<span id="needCheckNum_prodbrand">0</span>)</li>
                            <li onclick="queryPage_prodbrand(0)">已停用(<span id="hadDelNum_prodbrand">0</span>)</li>
                        </ul>
                      <%--  <span class="numCount">数量(<span class="red" id="prodTortNumSp"></span>)</span>--%>
                        <button class="layui-btn layui-btn-sm mt10" style="float: right" id="addProdTortBtn">新增</button>
                    </div>
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="prodTortTable" lay-filter="prodTortTable" style="width:100%"></table>
                        <script type="text/html" id="prodTortImageBar">
                            {{# if(d.image != undefined && d.image !=''){ }} {{# if(d.image.indexOf("http")==-1){ }}
                            <img class="layui-upload-img img_show_hide lazy b1" width='60' height='60' data-original='${imgTortUriPrefix}{{ d.image}}' data-onerror="layui.admin.img_noFind()"> {{# } else{ }}
                            <img class="layui-upload-img img_show_hide lazy b1" width='60' height='60' data-original='{{ d.image}}' data-onerror="layui.admin.img_noFind()"> {{# } }} {{# } }}
                        </script>
                        <script type="text/html" id="prodTortBrandLogoBar">
                            {{# if(d.brandLogo != undefined && d.brandLogo !=''){ }} {{# if(d.brandLogo.indexOf("http")==-1){ }}
                            <img class="layui-upload-img img_show_hide lazy b1" width='60' height='60' data-original='${imgTortUriPrefix}{{ d.brandLogo }}' data-onerror="layui.admin.img_noFind()"> {{# } else{ }}
                            <img class="layui-upload-img img_show_hide lazy b1" width='60' height='60' data-original='{{ d.brandLogo }}' data-onerror="layui.admin.img_noFind()"> {{# } }} {{# } }}
                        </script>
                        <script type="text/html" id="prodTortOfficialUrlBar">
                            {{# if(d.brandUrl != undefined && d.brandUrl !=''){ }} {{# if(d.brandUrl.indexOf("http")>-1){ }}
                            <a href='{{d.brandUrl}}' target="_blank" style="color: #428bca">链接</a> {{# } else { }}
                            <a href='http:\\{{d.brandUrl}}' target="_blank" style="color: #428bca">链接</a> {{# } }} {{# } }}
                        </script>
                        <script type="text/html" id="prodTortSitesBar">
                            {{# if(d.tortSites == 1){ }}
                            <span>全站点</span> {{# } else if(d.tortSites == 11){ }}
                            <span>wish</span> {{# } else if(d.tortSites == 12){ }}
                            <span>ebay</span> {{# } else if(d.tortSites == 14){ }}
                            <span>joom</span> {{# } else if(d.tortSites == 13){ }}
                            <span>aliexpress</span> {{# } else if(d.tortSites == 15){ }}
                            <span>amazon</span> {{# } else if(d.tortSites == 16){ }}
                            <span>shopee</span> {{# } }}
                        </script>

                        <script type="text/html" id="prodTortOperBar">
                            {{# if(d.status) { }}
                            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">停用</a>
                            {{# } else if (!d.status) { }}
                            <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="reback">启用</a>
                            {{# } }}
                            <a class="layui-btn layui-btn-xs" lay-event="showLog">日志</a>
                        </script>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 添加侵权 -->
    <script type="text/html" id="addProdTortLayer">
        <div class="p20">
            <form class="layui-form" lay-filter="addProdTortForm" id="addProdTortForm">
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>商品类目</label>
                    <div class="layui-input-block">
                        <select name="cateId" lay-search lay-verify="required" id="addProdTortCateIdSel">
                                <option value=""></option>
                            </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>中文名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="cnName" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>英文名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="enName" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="red">*</span>侵权类型</label>
                        <div class="layui-input-inline w100">
                            <select name="tortType" lay-verify="required" id="addProdTortTortTypeSel" lay-search>
                                            <option value=""></option>
                                        </select>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="red">*</span>侵权平台</label>
                        <div class="layui-input-inline w100">
                            <select name="tortSites" lay-verify="required" id="addProdTortTortSitesSel" lay-search>
                                            <option value=""></option>
                                            <option value="1">全平台</option>
                                            <option value="11">wish</option>
                                            <option value="12">ebay</option>
                                            <option value="14">joom</option>
                                            <option value="13">aliexpress</option>
                                            <option value="15">amazon</option>
                                            <option value="16">shopee</option>
                                        </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span style="color:red;">*</span>SKU</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="sku" lay-verify="required">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">侵权品牌</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="tortBrand" placeholder="录入品牌或侵权商标名称.不要录入：N/A，中文字段，公司名称，品牌投诉人等非商标字段.">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">投诉人</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="complainant" placeholder="录入公司名称或品牌投诉人.(例如：Inc.结尾的公司名称,一些TV产品的投诉人:Ontel Products.)">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">official URL</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="brandUrl">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">产品图片<span style="color: red;">*</span></label>
                    <input type="hidden" name="image" class="layui-input">
                    <div class="layui-input-block">
                        <div class="layui-upload-drag" id="addImageDragUpload">
                            <i class="layui-icon"></i>
                            <p>点击上传，或将文件拖拽到此处</p>
                        </div>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="addTortImagePicShow" style="width:90px;height:90px;display:inline-block">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">品牌LOGO</label>
                    <input type="hidden" name="brandLogo" class="layui-input">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn" id="addTortBrandLogPic">从计算机选择图片</button>
                        <button type="button" class="layui-btn" id="addOutBrandUrl">从url选择图片</button>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="addTortBrandLogPicShow" style="width:90px;height:90px;display:inline-block">
                            <p id="addTortBrandLogPicPTag"></p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">说明</label>
                    <div class="layui-input-block">
                        <textarea name="note" class="layui-textarea"></textarea>
                    </div>
                </div>

                <div class="layui-form-item" style="display: none;">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit lay-filter="submitAddProdTort" id="submitAddProdTortBtn">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                    </div>
                </div>
            </form>
        </div>
    </script>


    <!-- url图片 -->
    <script type="text/html" id="addProdTortBrandUrlPicLayer">
        <div class="p20">
            <input type="text" id="addProdTortBrandUrlPicLayerInput" class="layui-input" placeholder="仅能输入一个链接">
        </div>
    </script>

    <!-- 编辑侵权 -->
    <script type="text/html" id="editProdTortLayer">
        <div class="p20">
            <form action="" class="layui-form" lay-filter="addProdTortForm" id="editProdTortForm">
                <input type="hidden" name="id" lay-verify="required" class="layui-input">
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>商品类目</label>
                    <div class="layui-input-block">
                        <select name="cateId" lay-search lay-verify="required" id="editProdTortCateIdSel">
                    <option value=""></option>
                </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>中文名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="cnName" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="red">*</span>英文名称</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="enName" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="red">*</span>侵权类型</label>
                        <div class="layui-input-inline w100">
                            <select name="tortType" lay-verify="required" id="editProdTortTortTypeSel" lay-search>
                        <option value=""></option>
                    </select>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label"><span class="red">*</span>侵权平台</label>
                        <div class="layui-input-inline w100">
                            <select name="tortSites" lay-verify="required" id="editProdTortTortSitesSel" lay-search>
                        <option value=""></option>
                        <option value="1">全平台</option>
                        <option value="11">wish</option>
                        <option value="12">ebay</option>
                        <option value="14">joom</option>
                        <option value="13">aliexpress</option>
                        <option value="15">amazon</option>
                        <option value="16">shopee</option>
                    </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span style="color:red;">*</span>SKU</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="sku" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">侵权品牌</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="tortBrand" placeholder="录入品牌或侵权商标名称.不要录入：N/A，中文字段，公司名称，品牌投诉人等非商标字段.">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">投诉人</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="complainant" placeholder="录入公司名称或品牌投诉人.(例如：Inc.结尾的公司名称,一些TV产品的投诉人:Ontel Products.)">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">official URL</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="brandUrl">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">产品图片<span style="color:red;">*</span></label>
                    <input type="hidden" name="image" class="layui-input">
                    <div class="layui-input-block">
                        <div class="layui-upload-drag" id="editImageDragUpload">
                            <i class="layui-icon"></i>
                            <p>点击上传，或将文件拖拽到此处</p>
                        </div>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="editTortImagePicShow" style="width:90px;height:90px;display:inline-block">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">品牌LOGO</label>
                    <input type="hidden" name="brandLogo" class="layui-input">
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn" id="editTortBrandLogPic">从计算机选择图片</button>
                        <button type="button" class="layui-btn" id="editOutBrandUrl">从url选择图片</button>
                        <div class="layui-upload-list">
                            <img class="layui-upload-img" id="editTortBrandLogPicShow" style="width:90px;height:90px;display:inline-block">
                            <p id="editTortBrandLogPicPTag"></p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">说明</label>
                    <div class="layui-input-block">
                        <textarea name="note" class="layui-textarea"></textarea>
                    </div>
                </div>

                <div class="layui-form-item" style="display: none;">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit lay-filter="submitEditProdTort" id="submitEditProdTortBtn">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                    </div>
                </div>
            </form>
        </div>
    </script>

    <!-- url图片 -->
    <script type="text/html" id="editProdTortBrandUrlPicLayer">
        <div class="p20">
            <input type="text" id="editProdTortBrandUrlPicLayerInput" class="layui-input" placeholder="仅能输入一个链接">
        </div>
    </script>
    <script type="text/html" id="tb_logListLayer">
        <div style="padding:20px 50px 0 20px">
            <table class="layui-table" id="tortProd_logTable" lay-filter="tortProd_logTable">

            </table>
        </div>
    </script>

    <script type="text/javascript" src="${ctx}/static/js/commodity/prodtort/prodtort.js"></script>
