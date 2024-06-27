<%--
  Created by IntelliJ IDEA.
  User: EPEAN
  Date: 2022-08-09
  Time: 14:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<style>
    /*select选中框被select2覆盖的问题*/
    #addEditSKU_form dl.layui-anim.layui-anim-upbit {
        z-index: 999000000;
    }

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
        padding-right: 20px;
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
        right: 5px;
    }

    #LAY-iframe-itemCat ul li:hover {
        background-color: #f4f6f7;
        color: #438eb9;
    }

    #LAY-iframe-itemCat ul li.cat_active:hover {
        background-color: #6fb3e0;
        color: #fff;
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
        box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }

    #LAY-iframe-itemCat input:focus,
    #LAY-iframe-itemCat input:hover {
        border-color: #57a3f3;
    }



    .mapbox {
        padding: 20px;
    }

    .disabled {
        display: none !important;
    }

    .visibility_hidden {
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
    }

    #temabso {
        position: absolute;
        top: 0;
        right: -250px;
        width: 400px;
    }

    #platCateChoose {
        padding: 17px 15px;
    }

    .catechoose_Form {
        margin: 15px 0 0;
    }

    .catechoose_Form h3 {
        margin: -15px 25px 15px;
    }

    .cateAttrValueBox {
        position: relative;
        margin: 2px 0 4px;
    }

    .platCateChoose {
        margin: 5px 20px;
    }

    .cateAttrValueBox .layui-form-label {
        position: absolute;
        top: 0;
        left: -15px;
        width: 100px;
    }
    .cat_common {
        padding: 3px;
        margin: 3px auto;
        border: 1px solid #f8f8f8;
        box-sizing: border-box;
        font-weight: 700;
        background-color: #f8faff;
        color: #7c9eb2;
        cursor: pointer;
    }

    .cat_active {
        background-color: #6fb3e0;
        color: #fff;
    }
    #productDiffMethod .xm-select-parent {
        z-index: 202311;
    }
</style>
<script type="text/html" id="addprodpinfo_addEditSKU">
    <div class="p20">
        <form lay-filter="addEditSKU_form" class="layui-form" id="addEditSKU_form">
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4" notNull>
                    <label class="layui-form-label">商品父SKU</label>
                    <div class="layui-input-block">
                        <input type="text" name="pSku" class="layui-input">
                        <input type="hidden" name="id" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4" notNull>
                    <label class="layui-form-label">开发专员</label>
                    <div class="layui-input-block">
                        <select name="bizzOwnerId" id="bizzOwner" lay-search>
                            <option value=""></option>
                            <c:forEach items="${bizzOwners}" var="developer">
                                <option value="${developer.id}" ${defaultDeveloper.id == developer.id ? 'selected' : ''}>${developer.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4" notNull>
                    <label class="layui-form-label">责任人</label>
                    <div class="layui-input-block">
                        <select name="responsorId" id="responsor" lay-search>
                            <option value=""></option>
                            <c:forEach items="${responsorList}" var="developer">
                                <option value="${developer.id}" ${defaultDevelopersLeader.id == developer.id ? 'selected' : ''}>${developer.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item" >
                <div class="layui-col-md4 layui-col-lg4" notNull>
                    <label class="layui-form-label">独立包装</label>
                    <div class="layui-input-block" >
                        <select name="isAlonePack" lay-search>
                            <option ></option>
                            <option value="true">是</option>
                            <option value="false">否</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md8 layui-col-lg8">
                    <label class="layui-form-label">独立包装备注</label>
                    <div class="layui-input-block" >
                        <input class="layui-input" name="noAlonePackDesc">
                    </div>
                </div>
            </div>
            <div class="layui-form-item" >
                <div class="layui-col-md4 layui-col-lg4" notNull>
                    <label class="layui-form-label">特殊包装</label>
                    <div class="layui-input-block" >
                        <select name="isSpecialPack" lay-search>
                            <option ></option>
                            <option value="true">是</option>
                            <option value="false">否</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md8 layui-col-lg8">
                    <label class="layui-form-label">特殊包装备注</label>
                    <div class="layui-input-block" >
                        <input class="layui-input" name="specialPackDesc">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品标签</label>
                <div class="layui-input-block">
                    <select name="prodAttrList" lay-ignore multiple="multiple" lay-filter="pSkuTags" id="pSkuTags">
                        <c:forEach items="${prodTags}" var="tag">
                            <option value="${tag.name}">${tag.name}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
           <div class="layui-col-md12 layui-col-lg12">
               <label class="layui-form-label">英文标题</label>
               <div class="layui-input-block" >
                   <input class="layui-input" name="enTitle">
                </div>
            </div>
            <input type="hidden" name="aliexpressCateForecast">
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <div class="layui-col-md4 layui-col-lg4 catechoose_Form">
                        <label class="layui-form-label">新类目</label>
                        <div class="layui-input-block">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                    id="plat_choose">选择分类
                            </button>
                            <input type="hidden" name="plat_choose_inp" value="" id="plat_choose_inp"/>
                            <input type="hidden" name="plat_chooseid_inp" value="" id="plat_chooseid_inp"/>
                            <i id="prod_clearPlat" class="layui-icon layui-icon-delete" style="cursor: pointer"
                               title="删除产品类目"></i>
                            <span class="layui-btn layui-btn-sm layui-btn-primary" id="addprodpinfo_searchCate">
                                <i class="layui-icon layui-icon-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" id="platCateChoose">
                </div>
                <div class="layui-col-md12 layui-col-lg12 catechoose_Form">
                <h3 class="disN">类目属性</h3>
                </div>
                <div class="layui-form-item">
                <div class="layui-col-md7 layui-col-lg7">
                <div id="cateAttrBox">
                <div class="cateAttrValueBox disN">
                <label class="layui-form-label">
                <span id="mandatory" style="color: red;"></span>
                <span id="cateAttrValue"></span>
                <input type="hidden" name="cateAttrValueId" id="cateAttrValueId">
                </label>
                <div class="layui-input-block">
                <select name="cate" lay-search="" id="cateSEL"></select>
                </div>
                </div>
                <div class="cateAttrBoxInner"></div>
                </div>
                </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-col-md8 layui-col-lg8" notNull id="productDiffMethod">
                    <label class="layui-form-label" style="width: 85px">产品区分方式</label>
                    <div class="layui-input-block" id="productDiffMethodList">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">区分方式备注</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="productDiffMethodNote" lay-skin="primary"
                        onmouseenter="$(this).val() ? showTip($(this).val(),this) : () => {}"
                        onmouseleave="removeTip(this)">
                    </div>
                </div>
                <div class="layui-col-md8 layui-col-lg8" notNull>
                    <label class="layui-form-label" style="width: 85px">按父SKU同步尺寸和重量</label>
                    <div class="layui-input-block">
                        <input type="radio" name="ifSycSizeWeight" value="true" title="是">
                        <input type="radio" name="ifSycSizeWeight" value="false" title="否">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label"><font color="red">*</font>要求质检</label>
                    <div class="layui-input-block">
                        <input name="ifNeedQualityCheck" type="checkbox" lay-skin="primary">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">质检要求</label>
                <div class="layui-input-block">
                    <%--<textarea placeholder="请输入内容" name="qualityCheckRqmt" class="layui-textarea"></textarea>--%>
                    <div id="qualityCheckRqmt_productlist">

                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="layer_work_develop_pl1">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="addprodpinfo_itemCat_input"/>
                <div id="addprodpinfoLAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="addprodpinfo_diffMethodLayer">
    {{# layui.each(d.diffMethodList, function(index, item) { }}
      <input type="checkbox" lay-skin="primary" name="productDiffMethod" title="{{item.name}}" value="{{item.name}}">
    {{#}) }}
</script>


<!-- 搜索分类 -->
<script type="text/html" id="addprodpinfo_searchCateTpl">
    <div class="p10">
        <form class="layui-form">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                    <label class="layui-form-label">英文标题</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required lay-verify="required" placeholder="仅支持英文" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <span class="layui-btn layui-btn-sm" id="addprodpinfo_searchCate_btn">搜索</span>
                </div>
            </div>
        </form>
        <table id="addprodpinfo_searchCateTable" class="layui-table">
            <thead>
                <tr>
                    <th>ID</td>
                    <th>类目</td>
                    <th>选择率</th>
                    <th>操作</td>
                </tr>
            </thead>
            <tbody id="addprodpinfo_searchCateTbody">

            </tbody>
        </table>
    </div>
</script>
<script>
    function popToAddOrUpdProdPInfo(originData,reback) {
        console.log(reback)
        let title = '新增商品父SKU'
        let pSku = ''
        if (originData) {
            title = '修改商品父SKU'
            pSku = originData.pSku
        }

        let updateParentSkuLayerIndex = layer.open({
            title: title,
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1008px', '85%'],
            id: 'updateParentSkuLayerIndexId',
            shadeClose: false,
            btn: ['保存', '关闭'],
            content: $('#addprodpinfo_addEditSKU').html(),
            success: function(layero) {
                let dataForm = $('#addEditSKU_form')
                initNotNull('#addEditSKU_form')

                //select2渲染
                $('#pSkuTags').select2()

                // 初始化类目按钮事件
                initCateBtn()

                if (pSku) {
                    // 禁止修改父sku
                    dataForm.find('[name=pSku]').attr('readonly','readonly')
                    dataForm.find('[name=pSku]').addClass('disAbleInp')
                    addprodpinfo_searchOrigindata(pSku)
                } else {
                    wangEditor_productlist = wangEditorRender('qualityCheckRqmt_productlist')
                }
                // 获取产品区分方式数据
                getDiffMethodList()

                layui.form.render('checkbox','addEditSKU_form')
                layui.form.render('select','addEditSKU_form')
            },
            yes: function(index, layero) {
                let ifSycSizeWeight = $('#addEditSKU_form').find('[name=ifSycSizeWeight]:checked').val()
                if (!checkNotNull('#addEditSKU_form')) {
                    return
                }
                if (ifSycSizeWeight === undefined) {
                    layer.msg('请选择按父SKU同步尺寸和重量')
                    return
                }
                addprodpinfo_ajaxToAddOrUpdateProdPInfo(updateParentSkuLayerIndex,reback)
                return false
            }
        })
    }

    function getDiffMethodList() {
        var layer = layui.layer,
        laytpl = layui.laytpl;
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/product/queryAllProductDiffMethod',
            success: function (res) {
                if (res.code === '0000') {
                    let productDiffMethod = res.data?.map(item => {
                        return {
                            name: item
                        }
                    })
                    let data = {
                        diffMethodList: productDiffMethod
                    }
                    laytpl($("#addprodpinfo_diffMethodLayer").html()).render(data, function(html){
                        console.log('html', html)
                        $('#productDiffMethodList').html(html)
                    });
                    layui.form.render()
                } else {
                    layer.msg('初始化产品区分方式失败:' + res.msg)
                }
            }
        })
    }

    function addprodpinfo_searchOrigindata(pSku) {
        oneAjax.post({
            url: ctx + '/product/getPProd.html',
            data: { 'pSku': pSku },
            success: function(returnData) {
                console.log(returnData)
                if (returnData.code === '0000') {
                    let obj = returnData.data
                    let dataForm = $('#addEditSKU_form')
                    dataForm.find('[name=id]').val(obj.id)
                    dataForm.find('[name=pSku]').val(obj.pSku)
                    dataForm.find('[name=bizzOwnerId]').val(obj.bizzOwnerId)
                    dataForm.find('[name=responsorId]').val(obj.responsorId)
                    dataForm.find('[name=isAlonePack]').val(obj.isAlonePack + '')
                    dataForm.find('[name=isSpecialPack]').val(obj.isSpecialPack + '')
                    dataForm.find('[name=enTitle]').val(obj.enTitle)
                    dataForm.find('[name=noAlonePackDesc]').val(obj.noAlonePackDesc)

                    dataForm.find('[name=specialPackDesc]').val(obj.specialPackDesc)
                    dataForm.find('[name=productDiffMethodNote]').val(obj.productDiffMethodNote)
                    console.log('gdfasdsa', obj)
                    dataForm.find('[name=ifSycSizeWeight][value=' + obj.ifSycSizeWeight + ']').attr("checked", true)

                    obj.prodAttrList = obj.prodAttrList || ''
                    if (obj.prodAttrList !== '') {
                        let strs = obj.prodAttrList.split(',')
                        $('#pSkuTags').val(strs).trigger('change')
                    }
                    dataForm.find('[name=ifNeedQualityCheck]').prop('checked', obj.ifNeedQualityCheck)
                    wangEditor_productlist = wangEditorRender('qualityCheckRqmt_productlist', obj.qualityCheckRqmt)
                    let productDiffMethod = obj.productDiffMethod?.split(',') || []
                    for (var i = 0; i < productDiffMethod?.length; i++) {
                        var checkAttr = $('#productDiffMethodList input[value=\'' + productDiffMethod[i] + '\']')

                        console.log("🚀 ~ file: addprodpinfo.jsp:494 ~ addprodpinfo_searchOrigindata ~ checkAttr:", checkAttr);

                        checkAttr.prop('checked', true)
                    }

                    layui.form.render('select','addEditSKU_form')
                    layui.form.render('checkbox','addEditSKU_form')
                    layui.form.render('radio','addEditSKU_form')


                    // 复现新OA类目
                    if (obj.prodPInfoCateOaDTO && Object.keys(obj.prodPInfoCateOaDTO).length) {
                        let oaChangeValue = obj.prodPInfoCateOaDTO
                        $('#plat_choose_inp').val(oaChangeValue.cateName)
                        $('#plat_chooseid_inp').val(oaChangeValue.cateOaId)
                        $('#platCateChoose').text('OA新类目：' + oaChangeValue.cateTreeName)
                        renderOAcate(oaChangeValue.cateOaId, obj.prodPInfoCateOaDTO.prodPInfoCateOaAttrList)
                    } 
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
    }

    function addprodpinfo_ajaxToAddOrUpdateProdPInfo(popIndex,reback) {
        let dataForm = $('#addEditSKU_form')
        if (dataForm.find('[name=isAlonePack]').val() === 'false' && !(dataForm.find('[name=noAlonePackDesc]').val().trim())) {
            layer.msg('非独立包装必须填写备注信息')
            return
        }
        if (dataForm.find('[name=isSpecialPack]').val() === 'true' && !(dataForm.find('[name=specialPackDesc]').val().trim())) {
            layer.msg('特殊包装必须填写备注信息')
            return
        }
        let data = serializeObject(dataForm)
        data.ifNeedQualityCheck = dataForm.find('[name=ifNeedQualityCheck]').prop('checked')
        data.qualityCheckRqmt = wangEditor_productlist.txt.html()
        data.bizzOwner = dataForm.find('[name=bizzOwnerId] option:selected').text()
        data.responsor = dataForm.find('[name=responsorId] option:selected').text()
        data.aliexpressCateForecast = dataForm.find('[name=aliexpressCateForecast]').val()
        data.prodPInfoCateOaDTO = getOACateMap(data) //OA类目映射
        if (!data.prodPInfoCateOaDTO) {
            layer.msg('请选择OA新类目')
            return
        }
        if (!data.responsorId) { // 如果未选择责任人，则清空
            data.responsorId = 0
            data.responsor = ''
        }
        data.prodAttrList = procMultiSelect('pSkuTags', ',')
        data.ifSycSizeWeight = dataForm.find('[name=ifSycSizeWeight]:checked').val()
        if (!validatePSKU(data.pSku)) {
            layer.msg('父sku仅能包含大写字母、数字和"-"划线')
            return
        }
        loading.show()
        oneAjax.post({
            url: ctx + '/product/addOrUpdatePProd.html',
            data: data,
            success: function(returnData) {
                loading.hide()
                if (returnData.code === '0000') {
                    layer.close(popIndex)
                    if (reback && typeof reback === 'function') {
                        reback(data.pSku)
                    }

                    if (!returnData.data) {
                        layer.msg('操作成功')
                        return
                    }
                    let processData = {
                        processId: returnData.data.processId,
                        total: returnData.data.total,
                        redisKeyCode: returnData.data.redisKeyCode
                    }

                    function succReback() {
                        layer.close(updateParentSkuLayerIndex)
                        layer.msg('同步完毕')

                    }

                    if (processData.processId) {
                        processBegin(ctx + '/product/queryProcess.html', JSON.stringify(processData), '正在向普源同步此次修改', 1000, succReback)
                    }
                    layer.msg('保存成功')
                    $(formSelector + ' [data-id=prodPSku]').val(data.pSku)
                    $(formSelector + ' [data-id=getPskuDetail]').click()
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
    }

    // 初始化新OA类目按钮事件
    function initCateBtn(){
        //!新增类目属性基础
        $('#plat_choose').click(function(){
            cateLayerOpenOnlyLeaf('oa','','layer_work_develop_pl1','platCateChoose', 'plat_choose_inp','plat_chooseid_inp')
        })
        //!清空按钮
        $('#prod_clearPlat').click(function(){
            $('#platCateChoose').text('')
            $('.cateAttrBoxInner').html('')
            $('.catechoose_Form h3').addClass('disN')  //关闭类目属性展示
            $('#plat_choose_inp').val('')
            $('#plat_chooseid_inp').val('')
        })
        //ztt-20220901-搜索
        $('#addprodpinfo_searchCate').on('click', function(){
            layer.open({
                type: 1,
                title: '标题搜索分类',
                content: $("#addprodpinfo_searchCateTpl").html(),
                id: 'addprodpinfo_searchCateTplId',
                area: ['65%', '60%'],
                success: function(layero,index){
                    let defaultVal = $('#addEditSKU_form').find('[name=enTitle]').val();
                    layero.find('[name=title]').val(defaultVal);
                    $('#addprodpinfo_searchCate_btn').on('click', function(){
                        let title = layero.find('[name=title]').val();
                        if(!title){
                            return layer.msg('请先输入标题',{icon:1});
                        }
                        commonReturnPromise({
                            url: '/lms/product/AliexpressCategoryForecast.html',
                            type: 'post',
                            contentType: 'application/json',
                            params: JSON.stringify({
                                subject: title
                            })
                        }).then(res => {
                            // console.log(res); //渲染表格相关
                            //循环数据渲染到表格里面,然后给选择绑定事件
                            let str = '';
                            let forecastCate = []
                            for(let i=0; i<res.length; i++){
                                let item = res[i];
                                // console.log(item);
                                str += '<tr><td>' +item.id + '</td><td>'+item.cateTreeName+'</td><td>'+ item.score + '%</td>\
                                        <td>'+ '<span class="layui-btn layui-btn-normal layui-btn-sm cateHandle" cateoaId="'
                                            +item.id +'" cateName="'+item.cateName+'" cateTreeName="'+ item.cateTreeName+'">选择</span></td></tr>';
                                forecastCate.push(item.categoryId)
                            };
                            $('#addprodpinfo_searchCateTbody').empty().append(str);
                            $('#addEditSKU_form [name=aliexpressCateForecast]').val(forecastCate.join(';'))
                            addprodpinfo_searchCateSelectHandle(layero,index);
                        });
                    });
                }
            });
        });
        //ztt-20220901-选择后执行的操作
        function addprodpinfo_searchCateSelectHandle(layero,index){
            layero.on('click', '.cateHandle', function(){
                let cateOaId = $(this).attr('cateoaid');
                let cateName = $(this).attr('catename');
                let cateTreeName = comRepEnglishQuote($(this).attr('catetreename'))
                $('#plat_chooseid_inp').val(cateOaId);
                $('#plat_choose_inp').val(cateName);
                $('#platCateChoose').text('OA新类目：' +cateTreeName);
                layer.close(index);
            });
        }
    }
    let store={}
    //*平台类目弹出框
    function cateLayerOpenOnlyLeaf(plat, inputId, divId, show, cateNameIdDom, cateIdDom) {
        layer.open({
            title: '选择分类',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['100%', '70%'],
            btn: ['保存', '关闭'],
            content: $('#' + divId).html(),
            success: async function (layero) {
                layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn0').attr('id', 'btnYes');
                await prodTpl_listShow(plat, '', '');
                $('#addprodpinfo_itemCat_input').on('keyup', async function (e) {
                    if (e.keyCode === 13) {
                        let val = $(this).val().trim()
                        if (val == '' || val.length<=0) {
                            layer.alert('搜索内容不能为空', {
                                icon: 2,
                            });
                            $(this).val('')
                            from.render()
                            return;
                        }
                        layui.admin.load.show();
                        e.stopPropagation();
                        let value = $(this).val().trim();
                        // 如果输入的值 是一个数字 则传pcateid
                        if (/^\d+$/.test(value)) {
                            await prodTpl_listShow(plat, value, '', 1);
                        } else {
                            await prodTpl_listShow(plat, '', value);
                        }
                        layui.admin.load.hide();
                    }
                });
                //*点击事件委托
                $('#addprodpinfoLAY-iframe-itemCat-getCates').on('click', 'li', async function (value) {
                    $(this).siblings().removeClass('cat_active');
                    $(this).addClass('cat_active');
                    $(this).parents('.layui-col-xs3.layui-col-md3.mr10').nextAll('.layui-col-xs3.layui-col-md3.mr10').remove();
                    if (typeof $(this).prop('id') == undefined || $(this).attr('isLeaf') == 'true') {
                        $('#btnYes').click(); //?点击到叶子节点
                        return;
                    } else {
                        let id = $(this).attr('id');
                        await prodTpl_listShow(plat, id, '');
                        return;
                    }
                });
            },
            yes: async function (index, layero) {
                let li = layero.find('ul li.cat_active'),
                    lilast = li[li.length - 1],
                    cateTreeName = $(lilast).attr('cateTreeName'),
                    cateId = $(lilast).attr('id'),
                    cateName = $(lilast).attr('cateName'),
                    isleaf=$(lilast).attr('isleaf');
                // if (cateTreeName==undefined||isleaf=='false') {
                //     return
                // }
                //  基础模板，oa新类目查询，能支持选中三级二级一级类目，去查询
                if (cateTreeName==undefined) {
                    return
                }
                if (plat === 'oa') {
                    $('#' + show).text('OA新类目：' + cateTreeName);
                    store.OATreeName = cateTreeName;
                    store.OAName = cateName;
                    store.cateOaId = cateId;
                    console.log(store)
                    if (show == 'tplOACateInfo_show') {

                    }else {
                        renderOAcate(store.cateOaId)
                    }
                    $('#'+cateNameIdDom).val(cateName)
                    $('#'+cateIdDom).val(cateId)
                } else {
                    store.platTreeName = cateTreeName;
                    store.platName = cateName;
                    store.platCateId = cateId;
                    $('#' + show).text(plat + '平台类目：' + cateTreeName);
                }
                layer.close(index);
            },
            end: function (params) {
                //   console.log(store);
            },
        });
    }
    //*类目请求及渲染
    async function prodTpl_listShow(plat, pcateId, cateName, status) {
        let { data: res } = await requestAxios_tpl.categoryQuery(plat, pcateId, cateName);
        console.log(111)
        if (res.code !== '0000') {
            return layer.msg(res.msg);
        }
        if (res.data.length <= 0) {
            return layer.msg('请输入正确的类目名或pcateId');
        }
        let listr = '',
            str = `<div class="layui-col-xs3 layui-col-md3 mr10"><ul>:listr</ul></div>`;
        res.data.forEach((value, index) => {
            let isleaf = value.isLeafCate === 1 ? 'true' : 'false';
            let isleafdisplay = value.isLeafCate === 1 ? 'none' : 'block';
            let result = cateName === '' ? value.cateName : value.cateTreeName;
            let cateTreeName = comRepEnglishQuote(value.cateTreeName)
            listr += '<li class="cat_common" isLeaf="' + isleaf + '" id="' + value.id + '" cateTreeName="' + cateTreeName + '" pcateId="' + value.pcateId + '" cateName="' + value.cateName + '">' + result + '<i class="layui-icon layui-icon-right" style="display:' + isleafdisplay + '"></i></li>';
        });
        str = str.replace(':listr', listr);
        if (status) {
            $('#addprodpinfoLAY-iframe-itemCat-getCates').html(str);
        } else {
            if (cateName === '') {
                $('#addprodpinfoLAY-iframe-itemCat-getCates').append(str);
            } else {
                $('#addprodpinfoLAY-iframe-itemCat-getCates').html(str);
                $('#addprodpinfoLAY-iframe-itemCat-getCates').find('.layui-col-xs3.layui-col-md3.mr10').css('width','50%')
            }
        }
    }

    let requestAxios_tpl = {
        //*查询平台类目
        categoryQuery(category, id, cateName) {
            return axios({
                method: 'post',
                url: '/lms/prodCateOaMapping/searchCates',
                data: {
                    platCode: category,
                    pcateId: id,
                    cateTreeName: cateName,
                },
            });
        },
        //*根据类目ID列举出所有关联的属性集合以及对应属性的属性值集合
        queryOAAttr(cateId){
            return axios({
                method:'get',
                url:`/lms/prodCateOa/listAttrsAndValues/` + cateId
            })
        }
    }

    //* 渲染
    async function renderOAcate(cateOaId, changeData) {
        let {data:res}=await requestAxios_tpl.queryOAAttr(cateOaId)
        console.log(res)
        if (res.code!=='0000') {
            return layer.msg(res.msg)
        }
        let cateOA = res.data ? res.data : false
        if (!cateOA) {
            return layer.msg('获取类目失败，请重新获取其他节点')
        }
        <%--if (cateOA.prodCateOaAttrListValuesVOList&&cateOA.prodCateOaAttrListValuesVOList.length) {--%>
            <%--//拿到OA属性值遍历做渲染--%>
            <%--$('.cateAttrBoxInner').html('')--%>
            <%--// console.log('OA属性名和属性值',cateOA.prodCateOaAttrListValuesVOList);--%>
            <%--let cateOAAttrValueList = [],--%>
                <%--isMandaroy_Y = cateOA.prodCateOaAttrListValuesVOList.filter((v) => v.isMandatory == 1),--%>
                <%--isMandaroy_N = cateOA.prodCateOaAttrListValuesVOList.filter((v) => v.isMandatory == 0);--%>
            <%--cateOAAttrValueList = [...isMandaroy_Y, ...isMandaroy_N]--%>
            <%--cateOAAttrValueList.forEach(function(oacateValue,oacateindex){--%>
                <%--$('.catechoose_Form h3').removeClass('disN')  //打开类目属性展示--%>
                <%--let _cateAttrValueBox = $('.cateAttrValueBox.disN').clone(true)//克隆节点--%>
                <%--// 需求改变-不+红色*--%>
                <%--if (oacateValue.isMandatory) {--%>
                    <%--$(_cateAttrValueBox).find('#mandatory').text('* ')//是否必填添加*--%>
                <%--}--%>
                <%--$(_cateAttrValueBox).find('#cateAttrValue').text(oacateValue.attrName)//渲染OA属性名--%>
                <%--$(_cateAttrValueBox).find('#cateAttrValueId').val(oacateValue.id)//渲染OA属性名ID--%>
                <%--// console.log(oacateValue.prodCateOaAttrValueList);--%>
                <%--let str=''--%>
                <%--let initOpt=`<option value=""></option>`//初始option  --遍历OA属性值并渲染--%>
                <%--if (!oacateValue.prodCateOaAttrValueList) {--%>
                    <%--layer.msg(`${oacateValue.attrName}下无属性值`)--%>
                <%--}else {--%>
                    <%--oacateValue.prodCateOaAttrValueList.forEach((optv,opti)=>{--%>
                        <%--let cateSEL_option=`<option value="`+ optv.attrValue + `" data-cateOaAttrId="`+ optv.cateOaAttrId + `" data-id="`+ optv.id + `">` + optv.attrValue + `</option>`--%>
                        <%--str+=cateSEL_option--%>
                    <%--})--%>
                <%--}--%>
                <%--str=initOpt+str--%>
                <%--if (changeData && changeData.length) {--%>
                    <%--// console.log(oacateValue.attrName);--%>
                    <%--// console.log(changeData);--%>
                    <%--let changeOAAttr = changeData.filter((v)=>v.cateOaAttr==oacateValue.attrName)[0]--%>
                    <%--if (changeOAAttr && Object.keys(changeOAAttr).length) {--%>
                        <%--str = str.replace(`value="`+ changeOAAttr.cateOaAttrValue + `"`,`value="`+ changeOAAttr.cateOaAttrValue+ `" selected=selected`)--%>
                    <%--}--%>
                <%--}--%>
                <%--$(_cateAttrValueBox).find('#cateSEL').html(str)--%>
                <%--$(_cateAttrValueBox).removeClass('disN')--%>
                <%--$('.cateAttrBoxInner').append(_cateAttrValueBox)--%>
                <%--// console.log(_cateAttrValueBox);--%>
            <%--})--%>
        <%--}else{--%>
            <%--$('.catechoose_Form h3').addClass('disN')  //关闭类目属性展示--%>
            <%--$('.cateAttrBoxInner').html('')--%>
        <%--}--%>

        $('.catechoose_Form h3').addClass('disN')  //关闭类目属性展示
        $('.cateAttrBoxInner').html('')
        layui.form.render('select')
    }

    let OACate__requesetStatus = []
    function getOACateMap(receiveDataObj) {
        let tempoary={};
        OACate__requesetStatus = []
        tempoary.cateOaId = $('#plat_chooseid_inp').val() //oa类目ID
        tempoary.cateName = $('#plat_choose_inp').val() //oa类目名称
        // tempoary.complete = true //完整true 不完整false
        if (tempoary.cateName === '') {
            tempoary={};
            return
        }
        // tempoary.prodPInfoCateOaAttrList = {}
        // console.log(receiveDataObj);
        let platCateChoose = $('#platCateChoose').text()
        platCateChoose = platCateChoose.split('：')[1]
        tempoary.cateTreeName = platCateChoose //OA类目树
        console.log(platCateChoose);
        let _cateAttrBoxInner = Array.from($('.cateAttrBoxInner').find('.cateAttrValueBox')) //OA属性值有值
        let temporayArr = []
        if (_cateAttrBoxInner&&_cateAttrBoxInner.length) {
            //OA属性值每一项
            _cateAttrBoxInner.forEach((v)=>{
                let tempoaryObj={}
                tempoaryObj.prodPId = receiveDataObj.id // 商品ID
                tempoaryObj.cateOaAttrId = $(v).find('#cateAttrValueId').val()
                tempoaryObj.cateOaAttr = $(v).find('#cateAttrValue').text()
                tempoaryObj.cateOaAttrValue = $(v).find('#cateSEL').val()
                // console.log($(v).find('#mandatory').text().includes('*')); //是否必填
                if (tempoaryObj.cateOaAttrValue === '') {
                    if ($(v).find('#mandatory').text().includes('*')) {
                        OACate__requesetStatus.push(false)
                    }else {
                        // tempoary.complete = false
                    }
                }else {
                    OACate__requesetStatus.push(true)
                }
                temporayArr.push(tempoaryObj)
            })
            tempoary.prodPInfoCateOaAttrList = temporayArr
        }
        return tempoary
    }

</script>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>