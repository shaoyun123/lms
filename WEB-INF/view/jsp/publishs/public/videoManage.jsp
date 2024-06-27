<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>视频管理</title>
<style>
    #lazadaVideoManage .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    #lazadaVideoManage_searchForm .layui-form-label {
        width: 110px;
    }

    #lazadaVideoManage_searchForm .layui-input-block {
        margin-left: 140px;
    }

    .lazadaVM_container {
        display: flex;
        flex-wrap: wrap;
    }

    .lazadaVM_container li {
        list-style: none;
        flex: 0 1 19%;
        height: 230px;
        display: flex;
        align-items: center;
    }

    .disN {
        display: none;
    }

    #lazadaVideoTag {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }

    #lazadaVideoTag div {
        width: 250px;
        margin-top: 2px;
    }

    #lazadaVideoTag span {
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    li.window_map_imgLi{
        float: left;
    }
    img.templet_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 33px;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
    /*OA新类目样式*/
    #LAY-iframe-itemCat .layui-col-md3,
    #LAY-iframe-itemCat .layui-col-xs3 {
        width: 24%;
        height: 305px;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 2px 10px;
        border: 1px solid #ccc;
    }

    #LAY-iframe-itemCat ul li {
        position: relative;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px
    }

    #LAY-iframe-itemCat .layui-col-xs12 ul li {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #LAY-iframe-itemCat .layui-col-xs3 ul li i {
        position: absolute;
        top: 4px;
        right: 5px
    }

    #LAY-iframe-itemCat ul li:hover {
        background-color: #F4F6F7;
        color: #438EB9
    }

    #LAY-iframe-itemCat ul li.cat_active:hover {
        background-color: #6FB3E0;
        color: #fff
    }

    #LAY-iframe-itemCat input {
        display: inline-block;
        width: 200px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
    }

    #LAY-iframe-itemCat input:focus {
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
    }

    #LAY-iframe-itemCat input:focus,
    #LAY-iframe-itemCat input:hover {
        border-color: #57a3f3;
    }

    .cat_common {
        padding: 3px;
        margin: 3px auto;
        border: 1px solid #f8f8f8;
        box-sizing: border-box;
        font-weight: 700;
        background-color: #f8faff;
        color: #7C9EB2;
        cursor: pointer;
    }

    .cat_active {
        background-color: #6FB3E0;
        color: #fff
    }
    .lazadaVM_uploadBtn_con li{
        display: block;
    }
</style>
<div class="layui-fluid" id="lazadaVideoManage">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaVideoManage_searchForm">
                        <div class="layui-form-item">
                            <permTag:perm funcCode="lazadaVM_search">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select name="" lay-search
                                                lay-filter="lazadaVideoManage_createor" id="lazadaVideoManage_createor" class="users_hp_custom"
                                                data-rolelist="lazada专员" data-platcode="lazada">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeId" lay-search class="users_hp_store_multi" data-platcode="lazada">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3 lazadaVM_isStatus">
                                    <label class="layui-form-label">视频上传店铺状态</label>
                                    <div class="layui-input-block">
                                        <select name="isStatus">
                                            <option value="all">全部</option>
                                            <option value="2">已上传成功</option>
                                            <option value="1">未上传成功</option>
                                        </select>
                                    </div>
                                </div>
                            </permTag:perm>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">视频名称</label>
                                <div class="layui-input-block">
                                    <input name="sku" class="layui-input" placeholder="商品父SKU,多个逗号分隔">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">视频标签</label>
                                <div class="layui-input-block">
                                    <select name="tagList" id="lazadaVMTagList" xm-select="lazadaVMTagList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <input placeholder="创建人" type="text" class="layui-input" name="createor" value="" list="lazadaVMCreater">
                                    <datalist id="lazadaVMCreater">
                                        <option value="">请选择</option>
                                    </datalist>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input id="lazadaVMTime" name="time" class="layui-input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">OA新类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="plat_choose_outside1">选择分类
                                    </button>
                                    <i id="prod_clearPlat_outside1" class="layui-icon layui-icon-delete"
                                       style="cursor: pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品名称</label>
                                <div class="layui-input-block">
                                    <input name="title" class="layui-input" placeholder="模糊搜索">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 disN videoManageError">
                                <label class="layui-form-label">失败原因</label>
                                <div class="layui-input-block">
                                    <select name="remark" id="remarkList" xm-select="remarkList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="VALUE_MUST_LARGER_THAN_STANDARDVALUE">视频尺寸不符合</option>
                                        <option value="timed out">上传超时</option>
                                        <option value="上传视频封面图片异常">上传视频封面图片异常</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2" style="margin: 0 20px;">
                                <a type="button" class="layui-btn layui-btn-sm" id="lazadaVideoManage_searchBtn">搜索</a>
                                <button class="layui-btn layui-btn-sm" type="reset" id="lazadaVideoManage_resetBtn" >清空</button>
                            </div>
                            <div class="layui-col-lg10 layui-col-md10">
                                <div id="tplOACateInfo_show1"></div>
                                <input type="hidden" name="cateOaId" value="" id="plat_chooseid_inp_outside1"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" id="lazadaVideoManage_tab" lay-filter="lazadaVideoManage_tab">
                        <div style="color: red;position:absolute;transform: translate(-50%);left: 50%;">tips：带 * 号的SKU请到基础模板中上传后同步到视频库</div>
                        <ul class="layui-tab-title dis_flex">
                            <div>
                                <li data-index="0" class="layui-this">视频(<span>0</span>)</li>
                                <permTag:perm funcCode="lazadaVM_search">
                                    <li data-index="1">上传中(<span>0</span>)</li>
                                    <li data-index="2">上传成功(<span>0</span>)</li>
                                    <li data-index="3">上传失败(<span>0</span>)</li>
                                </permTag:perm>
                            </div>
                            <div style="display: flex;">
                                <div class="lazadaVM_uploadBtn_con" style="display: flex;">
                                    <div id="lazadaVM_batch_operation" class="layui-inline"  >
                                        <button type="button" class="layui-btn layui-btn-sm" style="margin-left: 20px;margin-right: 10px;">批量操作</button>
                                        <ul class="hidden">
                                            <li id="lazadaVM_batchAdd">批量添加标签</li>
                                            <li id="lazadaVM_batchDownload_videoUrl">批量下载</li>
                                        </ul>
                                    </div>
                                    <button type="button" class="layui-btn layui-btn-sm" id="lazadaVM_importUrl">导入视频URL
                                    </button>
                                    <button type="button" class="layui-btn layui-btn-sm" id="lazadaVM_import">新增视频导入
                                    </button>
                                    <permTag:perm funcCode="lazadaVM_upload">
                                        <form class="layui-form" style="width: 200px;margin: 0 20px;">
                                                <%--<select xm-select="lazadaVideoManage_store_sel" id="lazadaVideoManage_store_sel"--%>
                                                <%--xm-select-search xm-select-search-type="dl"--%>
                                                <%--xm-select-skin="normal"></select>--%>
                                            <div data-platcode="lazada" xm-select="lazadaVideoManage_store_sel" class="users_hp_store_multi" id="lazadaVideoManage_store_sel"></div>
                                        </form>
                                        <a type="button" class="layui-btn layui-btn-sm" id="lazadaVM_upload">上传</a>
                                    </permTag:perm>
                                </div>
                                <permTag:perm funcCode="lazadaVM_cancel_upload">
                                    <a type="button" class="layui-btn layui-btn-sm disN" id="lazadaVM_cancel_upload">取消上传</a>
                                </permTag:perm>
                                <permTag:perm funcCode="lazadaVM_Media_center">
                                    <a type="button" class="layui-btn layui-btn-sm disN" id="lazadaVM_Media_center">移除Media center</a>
                                </permTag:perm>
                                <permTag:perm funcCode="lazadaVM_batch_delete">
                                    <a type="button" class="layui-btn layui-btn-sm disN" id="lazadaVM_batch_delete">批量删除</a>
                                </permTag:perm>
                                <permTag:perm funcCode="lazadaVM_upload_again">
                                    <a type="button" class="layui-btn layui-btn-sm disN" id="lazadaVM_uploads">重新上传</a>
                                </permTag:perm>
                            </div>
                        </ul>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <form class="layui-form">
                                    <input title="全选" type="checkbox" lay-filter="checkboxAll" name="" lay-skin="primary" value="all">
                                </form>
                                <form class="layui-form lazadaVM_container" id="lazadaVM_container_0">
                                </form>
                            </div>
                            <div class="layui-tab-item">
                                <form class="layui-form lazadaVM_container" id="lazadaVM_container_1">
                                </form>
                            </div>
                            <div class="layui-tab-item">
                                <form class="layui-form lazadaVM_container" id="lazadaVM_container_2">
                                </form>
                            </div>
                            <div class="layui-tab-item">
                                <form class="layui-form">
                                    <input title="全选" type="checkbox" lay-filter="checkboxAll" name="" lay-skin="primary" value="all">
                                </form>
                                <form class="layui-form lazadaVM_container" id="lazadaVM_container_3">
                                </form>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" class="activeId">
                    <div style="position: fixed;bottom: 0;width: 100%;background-color: #fff;right: 0;text-align: center;">
                        <div id="lazadaVM_page" class="pageSort"></div>
                    </div>
                </div>
            </div>
            <a id="lazadaVideoManage_import" style="display: none;"></a>
        </div>
    </div>
</div>
<script type="text/html" id="lazadaVM_importUrl_layer">
    <form style="margin: 10px 10px 0 0">
        <div class="layui-form-item">
            <label class="layui-form-label"><span style="color: red;">*</span>视频URL</label>
            <div class="layui-input-block">
                <input class="layui-input" name="url" placeholder="请输入.mp4格式">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span style="color: red;">*</span>视频名称</label>
            <div class="layui-input-block">
                <input class="layui-input" name="name" placeholder="请输入商品父SKU">
            </div>
        </div>
    </form>
</script>
<script src="${ctx}/static/util/downloadImage.js?v=${ver}"></script>
<script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
<script type="text/html" id="layer_work_develop_pl1">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input1" />
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>
<script>
    layui.use(["admin", "form", "layer", "upload", "laydate", "element", "laypage","formSelects"], function () {
        var admin = layui.admin,
            form = layui.form,
            layer = layui.layer,
            formSelects = layui.formSelects,
            upload = layui.upload,
            laydate = layui.laydate,
            element = layui.element,
            laypage = layui.laypage,
            $ = layui.$;

        let lazadaVideoManage_page = 1, // 当前页
            lazadaVideoManage_limit = 50, // 每页显示的数量
            lazadaVideoManage_count = 0,  // 查询出来的所有数据总数
            lazadaVideoManage_data = [];  // 查询出来的表格数据
        let lazadaVideoManage_tag = []; // 视频标签

        // 监听页签的切换
        element.on('tab(lazadaVideoManage_tab)', function(data){
            if(data.index == 0){ // 视频
                $(".lazadaVM_isStatus").show()  // 视频上传店铺状态
                $(".lazadaVM_uploadBtn_con").show() // 新增视频导入
                $("#lazadaVM_cancel_upload").hide() // 取消上传按钮
                $("#lazadaVM_Media_center").hide() // 移除media center按钮
                $("#lazadaVM_batch_delete").hide() // 批量删除按钮
                $("#lazadaVM_uploads").hide() // 重新上传按钮
                $(".videoManageError").hide(); // 失败原因
            }else if(data.index == 1){ // 上传中
                $(".lazadaVM_isStatus").hide()
                $(".lazadaVM_uploadBtn_con").hide()
                $("#lazadaVM_cancel_upload").show()
                $("#lazadaVM_Media_center").hide()
                $("#lazadaVM_batch_delete").hide()
                $("#lazadaVM_uploads").hide()
                $(".videoManageError").hide(); // 失败原因
            }else if(data.index == 2){ // 上传成功
                $(".lazadaVM_isStatus").hide()
                $(".lazadaVM_uploadBtn_con").hide()
                $("#lazadaVM_cancel_upload").hide()
                $("#lazadaVM_Media_center").show()
                $("#lazadaVM_batch_delete").hide()
                $("#lazadaVM_uploads").hide()
                $(".videoManageError").hide(); // 失败原因
            }else if(data.index == 3){ // 上传失败
                $(".lazadaVM_isStatus").hide()
                $(".lazadaVM_uploadBtn_con").hide()
                $("#lazadaVM_cancel_upload").hide()
                $("#lazadaVM_Media_center").hide()
                $("#lazadaVM_batch_delete").show()
                $("#lazadaVM_uploads").show()
                $(".videoManageError").show(); // 失败原因
            }

            if(lazadaVM_formData() == 0||(lazadaVM_formData().storeId == ''&& data.index != 0)){
                $(".lazadaVM_container").html("")
                return layer.msg("请选择店铺")
            }

            ajax_selectvideosByDto(lazadaVM_formData())
        });

        //oa新类目点击展开
        $('#plat_choose_outside1').click(function() {
            cateLayerOpen('oa','layer_work_develop_pl1','tplOACateInfo_show1', '#itemCat_input1')
        })
        $('#prod_clearPlat_outside1').click(function() {
            $('#plat_chooseid_inp_outside1').val('')
            $('#tplOACateInfo_show1').text('')
        })

        // 分页
        function toPage_lazadaVideoManage() {
            laypage.render({
                elem: 'lazadaVM_page',
                curr: lazadaVideoManage_page,
                limit: lazadaVideoManage_limit,
                limits: [50, 20, 10],
                layout: ['prev', 'page', 'next', 'count', 'limit'],
                count: lazadaVideoManage_count //数据总数，从服务端得到
                , jump: function (obj, first) {
                    lazadaVideoManage_limit = obj.limit;
                    lazadaVideoManage_page = obj.curr;
                    //首次不执行
                    if (!first) {
                        lazadaVideoManage_limit = obj.limit;
                        lazadaVideoManage_page = obj.curr;
                        $("input[lay-filter=checkboxAll]").prop('checked', false);
                        $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").removeClass("layui-form-checked")
                        $("#lazadaVideoManage_searchBtn").click()
                    }
                }
            });
        }

        //渲染部门销售员店铺三级联动
        render_hp_orgs_users("#lazadaVideoManage_searchForm");
        // 获取站点
        commonReturnPromise({
            url: `/lms/sys/listStoreForRenderHpStoreCommonComponent.html`,
            type: 'POST',
            params: {roleNames: "lazada专员", platCode: 'lazada'}
        }).then(function (result) {
            result.forEach(item => {
                item.value = item.id + "_" + item.salesSite + "_" + item.storeAcct;
                item.name = item.storeAcct;
            })
            displayMultiSelect($("#lazadaVideoManage_store_sel"), result)
        })

        // 创建人
        commonReturnPromise({
            url: `/lms/LazadaVideoMange/getAllUser`,
            type: 'GET'
        }).then(res=>{
            let str = ''
            res.forEach(item =>{
                str += "<option value="+item+"></option>"
            })
            $("#lazadaVMCreater").html(str)
        })

        // 创建时间
        laydate.render({
            elem: '#lazadaVMTime',
            range: true
        });

        // 视频标签
        commonReturnPromise({
            url: `/lms/LazadaVideoMange/getVideoTags`,
            type: 'GET'
        }).then(res=>{
            lazadaVideoManage_tag = res;
            let arr = []
            res.forEach(item =>{
                arr.push({name:item.name,value:item.name})
            })
            formSelects.data('lazadaVMTagList', 'local', { arr: arr })
        })

        let itemStr = `<li>
                           <div style="margin: 10px;">
                               <input type="checkbox" lay-filter="checkboxChild" name="lazadaVM_checkbox" lay-skin="primary" value=":idVideo">
                           </div>
                           <div>
                               <div>
                                   <span>:sku</span>
                                   <span style="color:#999;font-size:12px;">:creator</span>
                                   <i lay-tips="下载视频" name="downloadVideo" data-sku=":sku" data-video=":location" class="layui-icon layui-icon-download-circle" style="font-size:20px;"></i>
                                   <span class="layui-bg-green hp-badge ml5 lazadaVM-listsuccess" style="float:right;">已</span>
                                   <span class="layui-bg-gray hp-badge ml5 lazadaVM-listfail" style="float:right;">败</span>
                                   <span class="layui-hide lazadaVM-listfailreason">:remark</span>
                               </div>
                               <div class="lazadaVM_video" data-video=":location" style="position:absolute;background-color:rgba(0,0,0,0.1);width:150px;height:170px;cursor:pointer;">
                               <i class="layui-icon layui-icon-play" style="font-size:40px;position:relative;left:55px;top:70px;color:#000;"></i>
                               </div>
                               <img src=":src" width="150" height="150" style="margin: 10px 0;">
                               <div class="lazadaVM-btn">
                                    <input type="hidden" value=":ids">
                                   <permTag:perm funcCode="lazadaVideoManage_delete">
                                   <a type="button" class="layui-btn layui-btn-xs layui-btn-danger" name="delete">删除</a>
                                   </permTag:perm>
                                    <permTag:perm funcCode="lazadaVideoManage_edit">
                                   <a type="button" class="layui-btn layui-btn-xs layui-btn-normal" name="edit" data-prodPId=":prodPId">修改封面</a>
                                    </permTag:perm>
                                    <permTag:perm funcCode="lazadaVideoManage_tagList">
                                   <a type="button" class="layui-btn layui-btn-xs layui-btn-normal lazadaVM_tagList" name="tagList" data-tag=":tagList">视频标签</a>
                                   </permTag:perm>
                               </div>
                           </div>
                       </li>`

        // 清空
        $("#lazadaVideoManage_resetBtn").click(function () {
            $('#lazadaVideoManage_createor').next().find('dd[lay-value=""]').trigger('click');
        })

        // 搜索
        $("#lazadaVideoManage_searchBtn").click(function () {
            let tab_index = $('#lazadaVideoManage_tab').find('.layui-this').data("index")

            if(lazadaVM_formData() == 0||(lazadaVM_formData().storeId == ''&& tab_index != 0)){
                return layer.msg("请选择店铺")
            }else{
                ajax_selectvideosByDto(lazadaVM_formData())
            }
        })

        function ajax_selectvideosByDto(data){
            // 页面渲染
            // commonReturnPromiseRes({
            //     type: 'GET',
            //     url: '/lms/LazadaVideoMange/selectvideosByDto',
            //     params: data
            // }).then(res => {
            // 谷歌低版本不兼容？直接catch，试试用ajax
            loading.show();
                $.ajax({
                    url: ctx + '/LazadaVideoMange/selectvideosByDto', //此处配置你自己的上传接口即可
                    type: 'GET',
                    data: data,
                    success: function (res) {          //成功回调
                        loading.hide();
                if (res.code == "0000") {
                    lazadaVideoManage_count = res.count;
                    lazadaVideoManage_data = res.data;
                    $('#lazadaVideoManage_tab').find('.layui-this span').text(lazadaVideoManage_count)
                    let html = "", str = '';
                    let tab_index = $('#lazadaVideoManage_tab').find('.layui-this').data("index")

                    res.data.forEach(item => {
                        str = itemStr.replaceAll(":sku", item.sku);
                        str = str.replaceAll(":creator", item.creator);
                        str = str.replaceAll(":src", item.picture);
                        str = str.replaceAll(":ids", item.id);
                        str = str.replaceAll(":prodPId", item.pid);
                        // str = str.replaceAll(":prodPId", 51842);
                        str = str.replaceAll(":idVideo", tab_index == 0?item.id:item.idVideo);
                        str = str.replaceAll(":remark", item.remark);
                        str = str.replaceAll(":location", item.location);
                        str = str.replaceAll(":tagList", item.tagList);
                        html += str;
                    })
                    $(".lazadaVM_container").html(html)

                    $("input[lay-filter=checkboxAll]").prop('checked', false);
                    $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").removeClass("layui-form-checked")
                    form.render("checkbox")
                    if(tab_index == 0){
                        $(".lazadaVM-listsuccess").hide()
                        $(".lazadaVM-listfail").hide()
                        $(".lazadaVM_tagList").show() // 视频标签按钮
                    }else if(tab_index == 1){
                        $(".lazadaVM-listsuccess").hide()
                        $(".lazadaVM-listfail").hide()
                        $(".lazadaVM-btn").hide()
                        $(".lazadaVM_tagList").hide() // 视频标签按钮
                    }else if(tab_index == 2){
                        $(".lazadaVM-listfail").hide()
                        $(".lazadaVM-btn").hide()
                        $(".lazadaVM_tagList").hide() // 视频标签按钮
                    }else if(tab_index == 3){
                        $(".lazadaVM-listsuccess").hide()
                        $(".lazadaVM_tagList").hide() // 视频标签按钮
                    }
                    toPage_lazadaVideoManage()
                }else {
                    layer.msg(res.msg)
                }
                },error:function(err){
                        loading.hide();
                        layer.msg('发送请求失败')
                    }
                })
            // }).catch(err => {
            //     layer.alert(err.msg, {icon: 2})
            // })
        }

        function lazadaVM_formData(){
            let formData = serializeObject($("#lazadaVideoManage_searchForm"))
            formData.cateId = formData.cateOaId

            // 选择销售员必选店铺，视频上传店铺状态为已上传|未上传必选店铺
            if((formData.isStatus == 1||formData.isStatus == 2)&&formData.storeId == ""){
                return 0
            }

            // 视频上传店铺状态为 全部--传type=1,isStatus置空
            // 视频上传店铺状态为 已上传--传isStatus=2
            // 视频上传店铺状态为 未上传--传isStatus=""
            // 视频上传状态 默认 2 （1 为上传中 3上传失败）
            // 后端说怎么传就怎么传的
            if(formData.isStatus == "all" ||formData.isStatus == undefined){
                formData.isStatus = ''
                formData.type = 1
            }else if(formData.isStatus == "1"){
                formData.isStatus = ''
            }

            formData.page = lazadaVideoManage_page
            formData.limit = lazadaVideoManage_limit

            let tab_index = $('#lazadaVideoManage_tab').find('.layui-this').data("index")
            if(tab_index == 1){
                formData.isStatus = 1
                formData.type = ""
                formData.remark = ''
            }else if(tab_index == 2){
                formData.isStatus = 2
                formData.type = ""
                formData.remark = ''
            }else if(tab_index == 3){
                formData.isStatus = 3
                formData.type = ""
            }else{
                formData.remark = ''
            }

            if(formData.time){
                formData["startTime"] = Date.parse(formData.time.split(" - ")[0] + " 00:00:00");
                formData["endTime"] = Date.parse(formData.time.split(" - ")[1] + " 23:59:59");
                delete formData.time
            }

            return formData;
        }

        // 播放视频
        $(document).off("click", ".lazadaVM_video").on("click", ".lazadaVM_video", function () {
            let that=this;
            let video = $(this).data("video");
            layer.open({
                type: 2, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
                shade:0.1, //遮罩层透明度
                area:['850px','500px'], //弹出层宽高
                title:'视频',//弹出层标题
                id:new Date().getTime(),
                content: video
            });
        })

        //删除
        $(document).on("click", ".lazadaVM_container [name=delete]", function () {
            let tab_index = $('#lazadaVideoManage_tab').find('.layui-this').data("index"),url = '';
            let that=this;
            // 获取--视频页签id--其他页签idVideo
            let id = $(this).parents("li").find("[name=lazadaVM_checkbox]").val();
            if(tab_index != 0){
                url = `${ctx}/LazadaVideoUpload/delete?ids=` + id // 批量删除接口
            }else{
                url = `${ctx}/LazadaVideoMange/delete?ids=` + id
            }
            layer.confirm('确定删除？', function (index) {
                commonReturnPromise({
                    type: 'DELETE',
                    contentType: 'application/json;charset=UTF-8',
                    url: url,
                }).then(res => {
                    lazadaVM_alert(res)
                    $(that).parents("li").remove()
                    let count = $('#lazadaVideoManage_tab').find('.layui-this span').text()
                    $('#lazadaVideoManage_tab').find('.layui-this span').text(count - 1)
                })
            })
        })

        // 取消上传
        $(document).on("click", "#lazadaVM_cancel_upload", function () {
            let arr = [],skusArr=[],storeAcctId='';
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                return layer.msg("请选择数据")
            }
            // 选中的视频id拆成数组
            let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(",")
            // 根据选中的视频id，匹配数据
            lazadaVideoManage_data.forEach(item =>{
                if(lazadaVM_checkbox.indexOf(item.idVideo.toString()) > -1){
                    skusArr.push(item.sku);
                    storeAcctId = item.storeAcctId;
                }
            })
            layer.confirm('确定要取消上传？', function (index) {
                commonReturnPromise({
                    type: 'DELETE',
                    url: `${ctx}/LazadaVideoUpload/cancelUploadVideos`,
                    params:{skus:skusArr.join(","),storeAcctId:storeAcctId}
                }).then(res => {
                    lazadaVM_alert(res)
                    $(".layui-form-checked").parents("li").remove()
                    let count = $('#lazadaVideoManage_tab').find('.layui-this span').text()
                    $('#lazadaVideoManage_tab').find('.layui-this span').text(count - skusArr.length)
                })
            })
        })

        // 移除mediacenter
        $(document).on("click", "#lazadaVM_Media_center", function () {
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index"))),dtos=[];
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == "") {
                return layer.msg("请选择需要删除的数据")
            }

            // 选中的视频id拆成数组
            let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(",")
            // 根据选中的视频id，匹配数据
            lazadaVideoManage_data.forEach(item =>{
                if(lazadaVM_checkbox.indexOf(item.idVideo.toString()) > -1){
                    dtos.push({
                        id:item.idVideo,
                        videoId:item.videoId,
                        storeAcctId:item.storeAcctId
                    })
                }
            })

            layer.confirm('确定移除Media center？', function (index) {
                commonReturnPromise({
                    type: 'DELETE',
                    contentType: 'application/json;charset=UTF-8',
                    url: `${ctx}/LazadaVideoUpload/deleteVideos`,
                    params:JSON.stringify({
                        "storeAcctId":dtos[0].storeAcctId,
                        "dtos":dtos
                    })
                }).then(res => {
                    lazadaVM_alert(res)
                    $("#lazadaVideoManage_searchBtn").click()
                })
            })
        })

        // 重新上传
        $("#lazadaVM_uploads").click(function () {
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                return layer.msg("请选择需要重新上传的数据")
            }
            // 选中的视频id拆成数组
            let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(","),dtos= [];
            // 根据选中的视频id，匹配数据
            lazadaVideoManage_data.forEach(item =>{
                if(lazadaVM_checkbox.indexOf(item.idVideo.toString()) > -1){
                    dtos.push({
                        "id":item.idVideo,
                        "storeAcctId":item.storeAcctId
                    })
                }
            })

            layer.confirm('确定重新上传？', function (index) {
                commonReturnPromise({
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    url: `${ctx}/LazadaVideoUpload/reuploadVideosfail`,
                    params:JSON.stringify({"dtos":dtos})
                }).then(res => {
                    lazadaVM_alert(res)
                    $("#lazadaVideoManage_searchBtn").click()
                })
            })
        })

        // 批量删除
        $(document).on("click", "#lazadaVM_batch_delete", function () {
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                return layer.msg("请选择需要删除的数据")
            }

            layer.confirm('确定删除？', function (index) {
                commonReturnPromise({
                    type: 'DELETE',
                    contentType: 'application/json;charset=UTF-8',
                    url: `${ctx}/LazadaVideoUpload/delete?ids=` + formData.lazadaVM_checkbox,
                }).then(res => {
                    lazadaVM_alert(res)
                    $("#lazadaVideoManage_searchBtn").click()
                })
            })
        })
        // 模板图片
        function lazadaVideoManage_tempImg(prodPId,id){
            var index = layer.open({
                type: 1,
                title: '选择模板图片添加',
                area: ['1200px', '500px'],
                id: 'templetImgSuccess',
                content: '<form id="lazada_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
                    '                <ul class="" id="main_picture">' +
                    '               </ul></div><br>'+
                    '              <div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">辅图:</label>' +
                    '                    <ul class="" id = "ass_picture">' +
                    '              </ul></div></form>' +
                    '',
                btn: ['确定', '关闭'],
                success: function (layero) {
                    $.ajax({
                            beforeSend: function(){
                                loading.show();
                            },
                            type: "POST",
                            url: ctx + "/publish/getprodImg.html",
                            data: {prodPId:prodPId},
                            dataType: "json",
                            success: function (returnData) {
                                loading.hide(returnData.data);
                                if (returnData.code == "0000") {
                                    var mainObj = $("#main_picture");
                                    var assObj = $("#ass_picture");
                                    var mainHtml = '';
                                    var assHtml = '';
                                    if(returnData.data!=null && returnData.data.length != 0){
                                        var imgarr = returnData.data
                                        for(var i in imgarr){
                                            if(imgarr[i].isMain == true){
                                                mainHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                    '                        <div class="window_map_imgDiv">' +
                                                    '                            <input type="checkbox" name="check_picture" value="'+imgarr[i].name+'"/><img src="'+imgarr[i].name+'" onclick="lazada_checked_picture(this)"  class="templet_map_imgCss">' +
                                                    '                        </div>' +
                                                    '                    </li>';
                                            }
                                            if(imgarr[i].isAssist == true){
                                                assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                    '                        <div class="window_map_imgDiv">' +
                                                    '                            <input value="'+imgarr[i].name+'" name="check_picture" type="checkbox"/><img src="'+imgarr[i].name+'" onclick="lazada_checked_picture(this)"   class="templet_map_imgCss">' +
                                                    '                        </div>' +
                                                    '                    </li>';
                                            }

                                        }
                                        mainObj.append(mainHtml);
                                        assObj.append(assHtml);
                                    }
                                    form.render('checkbox')
                                } else {
                                    layer.close(index);
                                    layer.msg(returnData.msg);
                                }
                            },
                            error: function () {
                                loading.hide();
                                layer.msg("服务器正忙");
                            }
                        }
                    )
                    form.render('checkbox');
                }, yes: function (index, layero) {
                    var templetPic = [];
                    $("#lazada_picture_form input[type=checkbox]:checked").each(function() {
                        templetPic.push($(this).val());
                    });
                    if(templetPic.length > 1){
                        layer.msg('只能选择一张图片',{icon:7})
                    }else if(templetPic.length < 1){
                        layer.msg('请选择一张图片后再提交',{icon:7})
                    }else{
                        commonReturnPromiseRes({
                            type: 'POST',
                            contentType: 'application/json;charset=UTF-8',
                            url: `${ctx}/LazadaVideoMange/updateImgForLocal?id=` + id + `&newUrl=` + templetPic[0] + `&type=0`,
                        }).then(res => {
                            if (res.code == "0000") {
                                layer.closeAll()
                                $(".li-active").find("img").attr("src", templetPic[0])
                                layer.alert(res.msg, {icon: 1})
                            }
                        }).catch(err => {
                            layer.alert(err.msg, {icon: 2})
                        })
                    }
                }, end:function(index){
                    layer.close(index);
                },
            });
        }

        // 修改封面
        $(document).on("click", ".lazadaVM_container [name=edit]", function () {
            let id = $(this).parent("div").children("input").val();
            let prodPId = $(this).data('prodpid');
            $(".activeId").val(id)
            $(".li-active").removeClass("li-active")
            $(this).parents("li").addClass("li-active")

            layer.confirm('请选择上传图片的方式', {
                title: "导入封面",
                btn: ['模板图片', '本地图片', '网络图片'] //按钮
                ,btn3:function(){
                    // 网络图片
                    layer.prompt({
                        title: '封面网络图片',
                        formType: 2,
                        content: `<textarea class="layui-textarea" placeholder="请填写封面图片URL，仅支持单个地址" name="txt_remark" style="width:400px;height:60px;"></textarea>`,
                        yes: function (index, layero) {
                            let url = $("[name=txt_remark]").val().trim();
                            if (url == '') {
                                return layer.msg("请输入网络地址")
                            }
                            commonReturnPromiseRes({
                                type: 'POST',
                                contentType: 'application/json;charset=UTF-8',
                                url: `${ctx}/LazadaVideoMange/updateImgForLocal?id=` + id + `&newUrl=` + url + `&type=0`,
                            }).then(res => {
                                if (res.code == "0000") {
                                    layer.closeAll()
                                    $(".li-active").find("img").attr("src", res.data)
                                    layer.alert(res.msg, {icon: 1})
                                }
                            }).catch(err => {
                                layer.alert(err.msg, {icon: 2})
                            })
                        }
                    })
                }
            }, function () {
                // 模板图片
                lazadaVideoManage_tempImg(prodPId,id);
            }, function () {
                // 本地图片
                $("#lazadaVideoManage_import").click()
            })
        })

        // 视频标签
        $(document).off("click", ".lazadaVM_container [name=tagList]").on("click", ".lazadaVM_container [name=tagList]", function () {
            let curTag = $(this).data("tag"),tagListArr = [],id = $(this).parent("div").children("input").val();
            if(curTag){
                tagListArr = curTag.toString().split(",")
            }
            let str = `<form class="layui-form" id="lazadaVideoTag">`
            lazadaVideoManage_tag.forEach(item =>{
                if(tagListArr.indexOf(item.name) != -1){
                    str += '<div><input type="checkbox" lay-filter="checkboxChild" checked name="lazadaTagCheckbox" value="'+ item.name +'" title="'+ item.name +'" lay-skin="primary"></div>'
                }else{
                    str += '<div><input type="checkbox" lay-filter="checkboxChild" name="lazadaTagCheckbox" value="'+ item.name +'" title="'+ item.name +'" lay-skin="primary"></div>'
                }
            })
            str += `</form>`
            let index_1 = layer.open({
                title: '视频标签',
                type: 1,
                area:['50%','50%'], //弹出层宽高
                btn:["保存","取消"],
                content: str,
                id:new Date().getTime(),
                success: function (index, layero) {
                    form.render()
                }, yes: function (index, layero) {
                    let tag = serializeObject($("#lazadaVideoTag"));
                    if (tag.lazadaTagCheckbox == undefined) {
                        // layer.alert("请选择视频标签", {icon: 7})
                        // return;
                        tag.lazadaTagCheckbox = ''
                    }
                    // }else{
                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json',
                        url: `${ctx}/LazadaVideoMange/updateTags`,
                        params:JSON.stringify({
                            "type":true,
                            "ids":[id],
                            "tagList":tag.lazadaTagCheckbox
                        })
                    }).then(res => {
                        $("#lazadaVideoManage_searchBtn").click()
                        layer.close(index_1)
                        layer.msg(res,{icon:1})
                    })
                    // }
                }, end: function () {
                    layer.closeAll();
                }
            })
        })

        $(document).off("click", ".lazadaVM_container [name=downloadVideo]").on("click", ".lazadaVM_container [name=downloadVideo]", function () {
            const sku = $(this).data("sku")
            const video = $(this).data("video")
            layer.msg('开始下载', {icon: 1})
            lazadaVM_downloadVideo(sku, video)
        })

        upload.render({
            elem: '#lazadaVideoManage_import' //绑定元素
            , url: ctx + '/LazadaVideoMange/updateImgForLocal?type=1' //上传接口
            , accept: 'images' //允许上传的文件类型
            , before: function (obj) {
                this.data = {'id': $(".activeId").val()};
            }
            , done: function (res) {
                if (res.code == "0000") {
                    $(".li-active").find("img").attr("src", res.data)
                    layer.msg(res.msg, {icon: 1});
                } else {
                    layer.msg(res.msg, {icon: 5});
                }
            }
            , error: function () {
                layer.msg('服务器出现故障!');
            }
        })
        // 导入视频URL
        $("#lazadaVM_importUrl").click(function () {
            var index = layer.open({
                type: 1,
                title: '导入视频URL',
                area: ['25%', '35%'],
                btn: ['保存', '关闭'],
                content: $('#lazadaVM_importUrl_layer').html(),
                success: function (layero, index) {},
                yes: function (index, layero) {
                    let url = $(layero).find("input[name=url]").val(),
                        name = $(layero).find("input[name=name]").val();
                    if(url==''||name==''){
                        return layer.alert('必填项不能为空',{icon:2})
                    }
                    if(!url.toLowerCase().includes('.mp4')){
                        return layer.alert('url必须是.mp4格式',{icon:2})
                    }
                    if(!name.toLowerCase().includes('.mp4')){
                        name = name + '.mp4'
                    }
                    initLazadaUrlVedio(url,name)
                }
            })
        })

        // 批量添加标签
        $("#lazadaVM_batchAdd").click(function (e) {
            e.stopPropagation()
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                return layer.msg("请至少选择一条数据")
            }

            let str = `<div style="margin: 2px 10px;color:red;">提示说明：批量给选中的视频添加标签，即是将以下选中的标签添加到选中的视频中，不等于覆盖原有标签</div><form class="layui-form" id="lazadaVideoTag">`
            lazadaVideoManage_tag.forEach(item =>{
                str += '<div><input type="checkbox" lay-filter="checkboxChild" name="lazadaTagCheckbox" value="'+ item.name +'" title="'+ item.name +'" lay-skin="primary"></div>'
            })
            str += `</form>`
            let index_1 = layer.open({
                title: '视频标签',
                type: 1,
                area:['50%','50%'], //弹出层宽高
                btn:["保存","取消"],
                content: str,
                id:new Date().getTime(),
                success: function (index, layero) {
                    form.render("checkbox")
                }, yes: function (index, layero) {
                    // 选中的视频id拆成数组
                    let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(",")
                    // 视频标签
                    let tag = serializeObject($("#lazadaVideoTag"));
                    if (tag.lazadaTagCheckbox == undefined) {
                        tag.lazadaTagCheckbox = ''
                    }
                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json',
                        url: `${ctx}/LazadaVideoMange/updateTags`,
                        params:JSON.stringify({
                            "type":false,
                            "ids":lazadaVM_checkbox,
                            "tagList":tag.lazadaTagCheckbox
                        })
                    }).then(res => {
                        $("#lazadaVideoManage_searchBtn").click()
                        layer.close(index_1)
                        layer.msg(res,{icon:1})
                    })
                }, end: function () {
                    layer.closeAll();
                }
            })


        })

        // 全选&取消全选
        form.on('checkbox(checkboxAll)', function(data){
            if(data.elem.checked){
                $("#lazadaVM_container_0").find("input[lay-filter=checkboxChild]").prop('checked', true);
                $("#lazadaVM_container_0").find(".layui-form-checkbox").addClass("layui-form-checked")
                $("#lazadaVM_container_3").find("input[lay-filter=checkboxChild]").prop('checked', true);
                $("#lazadaVM_container_3").find(".layui-form-checkbox").addClass("layui-form-checked")
            }else{
                $("#lazadaVM_container_0").find("input[lay-filter=checkboxChild]").prop('checked', false);
                $("#lazadaVM_container_0").find(".layui-form-checkbox").removeClass("layui-form-checked")
                $("#lazadaVM_container_3").find("input[lay-filter=checkboxChild]").prop('checked', false);
                $("#lazadaVM_container_3").find(".layui-form-checkbox").removeClass("layui-form-checked")
            }
            form.render("checkbox");
        });

        // 全选&取消全选
        form.on('checkbox(checkboxChild)', function(data){
            if(!data.elem.checked){
                $("input[lay-filter=checkboxAll]").prop('checked', false);
                $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").removeClass("layui-form-checked")
            }else{
                if($("#lazadaVM_container_0").find(".layui-form-checked").length == $("#lazadaVM_container_0").find("li").length){
                    $("input[lay-filter=checkboxAll]").prop('checked', true);
                    $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").addClass("layui-form-checked")
                }else{
                    $("input[lay-filter=checkboxAll]").prop('checked', false);
                    $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").removeClass("layui-form-checked")
                }
                if($("#lazadaVM_container_3").find(".layui-form-checked").length == $("#lazadaVM_container_3").find("li").length){
                    $("input[lay-filter=checkboxAll]").prop('checked', true);
                    $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").addClass("layui-form-checked")
                }else{
                    $("input[lay-filter=checkboxAll]").prop('checked', false);
                    $("[lay-filter=checkboxAll]").find(".layui-form-checkbox").removeClass("layui-form-checked")
                }
            }
            form.render("checkbox");
        });


        // 上传
        $("#lazadaVM_upload").click(function () {
            // 获取选中的视频id
            let formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
            if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                return layer.msg("请选择需要上传的视频")
            }
            // 店铺，多选
            // let storeAcct = formSelects.value("lazadaVideoManage_store_sel","val")
            var storeAcct= $('#lazadaVideoManage_store_sel').find('input').eq(0).val().split(",");//店铺id
            let storeAccts = [],dtos = [];
            if(storeAcct == "" || storeAcct.length == 0){
                return layer.msg("请选择店铺")
            }
            // 店铺id由id+site组成
            storeAcct.forEach(item => {
                storeAccts.push({
                    "id":item.split("_")[0],
                    "salesSite":item.split("_")[1],
                    "storeAcct":item.split("_")[2],
                })
            })
            // 选中的视频id拆成数组
            let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(",")
            // 根据选中的视频id，匹配数据
            lazadaVideoManage_data.forEach(item =>{
                if(lazadaVM_checkbox.indexOf(item.id.toString()) > -1){
                    item.localVideoId = item.id;
                    item.creator = encodeURI($('#lmsUsername').text())
                    dtos.push(item)
                }
            })

            commonReturnPromise({
                type: 'POST',
                contentType: 'application/json',
                url: `${ctx}/LazadaVideoUpload/uploadVideos`,
                params:JSON.stringify({
                    "storeAccts":storeAccts,
                    "dtos":dtos
                })
            }).then(res => {
                lazadaVM_alert(res)
                $("#lazadaVideoManage_searchBtn").click()
            })
        })

        layui.form.render()
        let UPLOAD_FILES;

        function clearFile() {
            for (let x in UPLOAD_FILES) {
                delete UPLOAD_FILES[x];
            }
        }

        // 视频本地上传
        initLazadaUploadVedio(upload,'#lazadaVM_import',ctx + '/LazadaVideoMange/saveVideos')


        // let lazada_uploadListIns = upload.render({
        //     elem: '#lazadaVM_import'
        //     // , url: ctx + '/LazadaVideoMange/saveVideos' //此处配置你自己的上传接口即可
        //     , accept: 'video' //视频
        //     , exts: 'mp4' //只允许上传mp4文件
        //     , size: 1024*20//最大允许上传的单个文件大小,单位KB
        //     , number: 20 // 设置同时可上传的文件数量
        //     , auto: false
        //     , multiple: true
        //     ,choose: function(obj) {
        //         // 清空历史上传文件，解决choose只执行一次的问题！！！
        //         lazada_uploadListIns.config.elem.next()[0].value = '';
        //         var that = this,fileArr = [];
        //         // var files = obj.pushFile(); //将每次选择的文件追加到文件队列
        //
        //         UPLOAD_FILES = obj.pushFile();
        //         clearFile(); //将所有文件先删除再说
        //         UPLOAD_FILES = obj.pushFile();
        //
        //         let formData = new FormData();
        //         for(let key in UPLOAD_FILES){
        //             formData.append("file",UPLOAD_FILES[key])
        //         }
        //
        //         $.ajax({
        //             url: ctx + '/LazadaVideoMange/saveVideos', //此处配置你自己的上传接口即可
        //             type: 'POST',
        //             data: formData,                  // 上传formdata封装的数据
        //             cache: false,                      // 不缓存
        //             processData: false,               // jQuery不要去处理发送的数据
        //             contentType: false,               // jQuery不要去设置Content-Type请求头
        //             success: function (res) {          //成功回调
        //                 clearFile();
        //                 if(res.code == "0000"){
        //                     let str = '', str1 = "", str2 = "";
        //                     res.data["已经存在"].forEach(item => {
        //                         str1 += item + "<br>"
        //                     })
        //                     res.data["sku不存在"].forEach(item => {
        //                         str2 += item + "<br>"
        //                     })
        //                     str += res.msg;
        //                     str += '<br>已经存在:' + str1;
        //                     str += '<br>sku不存在:' + str2
        //                     layer.alert(str);
        //                     $("#lazadaVideoManage_searchBtn").click()
        //                 }else{
        //                     layer.alert(res.msg,{icon:2});
        //                 }
        //             },error:function(){
        //                 clearFile();
        //             }
        //         })
        //     }
        // });

        $(document).on('mouseenter','.lazadaVM-listfail', function () {
            var contentshow = $(this).next(".lazadaVM-listfailreason").text();
            layer.tips(contentshow, $(this), {
                tips: [2, 'red'],
                area: ['40%', 'auto'],
                time: 0,
            });
        }).on('mouseleave','.lazadaVM-listfail', function () {
            layer.closeAll("tips");
        });
        $(document).on('click','.lazadaVM-listfail', function () {
            var contentshow = $(this).next(".lazadaVM-listfailreason").text();
            copyTxtToClipboard(contentshow)
        })

        function lazadaVM_alert(res){
            let str = ''
            if(typeof(res) == "string"){
                str = res
            }else{
                res && res.forEach(item=>{
                    str += item + '<br>'
                })
            }
            layer.alert(str)
        }

        // 批量操作 
        new dropButton('lazadaVM_batch_operation');
        $('#lazadaVM_batchDownload_videoUrl').click(function(e){
            e.stopPropagation()
            // 获取选中的视频id
            const formData = serializeObject($("#lazadaVM_container_" + $('#lazadaVideoManage_tab').find('.layui-this').data("index")))
                if(formData.lazadaVM_checkbox == undefined || formData.lazadaVM_checkbox == ""){
                    return layer.msg("请至少选择一条数据")
            }
            // 选中的视频id拆成数组
            let lazadaVM_checkbox = formData.lazadaVM_checkbox.split(",")
            const tab_index = $('#lazadaVideoManage_tab').find('.layui-this').data("index")
            const field = tab_index== 0 ? 'id': 'idVideo'
        
            // 根据选中的视频id，下载视频
            layer.msg('开始下载', {icon: 1})
            lazadaVideoManage_data.forEach(item =>{
                if(lazadaVM_checkbox.indexOf(item[field].toString()) > -1){
                    lazadaVM_downloadVideo(item.sku, item.location)
                }
            })

        })

        // 下载视频
        function lazadaVM_downloadVideo(fileName, filePath){
            // 使用获取到的blob对象创建的url
            fetch(filePath).then(res => res.blob()).then(blob => {
                const a = document.createElement('a')
                document.body.appendChild(a)
                a.style.display = 'none'
                // 使用获取到的blob对象创建的url
                const url = window.URL.createObjectURL(blob)
                a.href = url
                // 指定下载的文件名
                a.download = fileName
                a.click()
                document.body.removeChild(a)
                // 移除blob对象的url
                window.URL.revokeObjectURL(url)
            })
        }
    })

</script>
