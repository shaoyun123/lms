var smtModifyTitleDesc_simditor //富文本的返回值
var smtModifyTitleDesc_addImg_pc_number = 1  //
var smtModifyTitleDesc_data   //反显数据
    ; (function ($, layui, window, document, undefined) {
        layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
            var admin = layui.admin,
                form = layui.form,
                layer = layui.layer,
                table = layui.table,
                formSelects = layui.formSelects,
                element = layui.element,
                upload = layui.upload,
                laydate = layui.laydate,
                laypage = layui.laypage,
                laytpl = layui.laytpl
            $ = layui.$

            console.log('smt_arr :>> ', smt_arr);

        });

    })(jQuery, layui, window, document);

// 初始化
function smtModifyTitleDesc_init () {
    commonReturnPromise({
        url: ctx + '/onlineProductSmt/getSmtProductDetailByItemId',
        params: { itemId: smt_arr[0].itemId }
    }).then(data => {
        // 赋值
        smtModifyTitleDesc_data = data
        $(".smtModifyTitleDesc_title").find('input[name=shopTiele_Desc]').val(data.title)
        $(".smtModifyTitleDesc_title").find('input[name=shopTiele_Desc]').attr('data-prodpid',data.prodPIds);
        if($('.smtModifyTitleDesc_content').length>1){
            commonAddEventTitleToggle($('.smtModifyTitleDesc_content'), 'smt');
        }else{
            commonAddEventTitleToggle($('#LAY_smtOnline_updateListingInfo'), 'smt');
        }
        smtModifyTitleDesc_titleNumNoteJudge(data.title)
        // detail: 存在
        // json--新数据
        // html--旧数据
        let detail;
        try{
            // 新数据-商品详情-电脑版-为json格式
            detail = JSON.parse(data.detail)?.moduleList
            var _detail = [],str = '';
            detail && Array.isArray(detail) && detail.forEach(elem => {
                if (elem.type == 'text') {
                    elem.texts && Array.isArray(elem.texts) && elem.texts.forEach((i,index) => {
                        if (index == 0) {
                            i['className'] = 'title'
                        }
                    })
                    _detail.push({ text: elem.texts, type: 'text' })
                } else if (elem.type == 'image') {
                    elem.images && Array.isArray(elem.images) && elem.images.forEach(i => {
                        i['imgUrl'] = i.url;
                        str += `<img src="${i.url}" class="detail-desc-decorate-image" >`
                    })
                    _detail.push(elem)
                }
            });
            data.detail = `<div class="detailmodule_text">
                    <p class="detail-desc-decorate-title" style="text-overflow: ellipsis;font-family: 'OpenSans';color:'#000';word-wrap: break-word;white-space: pre-wrap;font-weight: 900;font-size: 20px;line-height: 28px;color: #000;margin-bottom: 12px;">${_detail[0].text[0]?.content}</p>
                    <p class="detail-desc-decorate-content" style="text-overflow: ellipsis;font-family: 'OpenSans';color:'#000';word-wrap: break-word;white-space: pre-wrap;font-weight: 300;font-size: 14px;line-height: 20px;color: #000;margin-bottom: 12px;">${_detail[0].text[1]?.content}</p>
                </div>\r\n
                <div class="detailmodule_image">
                    ${str}
                </div>\r\n`
            // // 新数据--商品详情-手机版
            // if (data.mobileDetail && Object.prototype.toString.call(JSON.parse(data.mobileDetail)) === '[object Object]') {
            //     var mobileDetail = JSON.parse(data.mobileDetail)?.moduleList
            //     var _mobileDetail = []
            //     mobileDetail && Array.isArray(mobileDetail) && mobileDetail.forEach(elem => {
            //         if (elem.type == 'text') {
            //             elem.texts && Array.isArray(elem.texts) && elem.texts.forEach((i,index) => {
            //                 if (index == 0) {
            //                     i['className'] = 'title'
            //                 }
            //             })
            //             _mobileDetail.push({ text: elem.texts, type: 'text' })
            //         } else if (elem.type == 'image') {
            //             elem.images && Array.isArray(elem.images) && elem.images.forEach(i => {
            //                 i['imgUrl'] = i.url
            //             })
            //             _mobileDetail.push(elem)
            //         }
            //     });
            //     _mobileDetail.forEach(item =>
            //         smtModifyTitleDesc_add_mod(item, '#smtModifyTitleDesc_modules_phone')
            //     )
            // }
        }catch(e){
            // 旧数据-商品详情-电脑版-不用做处理
            console.log(e)
            // // 旧数据--商品详情-手机版
            // if (data.mobileDetail && Object.prototype.toString.call(JSON.parse(data.mobileDetail)) === '[object Object]') {
            //     var { mobileDetail } = JSON.parse(data.mobileDetail)
            //     var _mobileDetail = []
            //     mobileDetail && Array.isArray(mobileDetail) && mobileDetail.forEach(elem => {
            //         if (elem.type == 'text') {
            //             if (elem.className == 'title') {
            //                 _mobileDetail.push({ text: [elem], type: 'text' })
            //             } else {
            //                 if (_mobileDetail.length && Array.isArray(_mobileDetail[_mobileDetail.length - 1].text) && _mobileDetail[_mobileDetail.length - 1].text[0].className == 'title') {
            //                     _mobileDetail[_mobileDetail.length - 1].text.push(elem)
            //                 } else {
            //                     _mobileDetail.push({ text: [elem], type: 'text' })
            //                 }
            //             }
            //
            //         } else if (elem.type == 'image') {
            //             _mobileDetail.push(elem)
            //         }
            //     });
            //     console.log(_mobileDetail)
            //     _mobileDetail.forEach(item =>
            //         smtModifyTitleDesc_add_mod(item, '#smtModifyTitleDesc_modules_phone')
            //     )
            // }
        }
        // 新数据--商品详情-手机版
        if (data.mobileDetail && Object.prototype.toString.call(JSON.parse(data.mobileDetail)) === '[object Object]') {
            var mobileDetail = JSON.parse(data.mobileDetail)?.moduleList
            var _mobileDetail = []
            mobileDetail && Array.isArray(mobileDetail) && mobileDetail.forEach(elem => {
                if (elem.type == 'text') {
                    elem.texts && Array.isArray(elem.texts) && elem.texts.forEach((i,index) => {
                        if(i.content){
                            if(i.class && i.class == 'title'){
                                i['className'] = 'title'
                            }
                            _mobileDetail.length >= 1?_mobileDetail[0]['text'].push(i):_mobileDetail.push({ text: [i], type: 'text' });
                        }
                    })
                } else if (elem.type == 'image') {
                    elem.images && Array.isArray(elem.images) && elem.images.forEach(i => {
                        i['imgUrl'] = i.url
                    })
                    _mobileDetail.push(elem)
                }
            });
            _mobileDetail.forEach(item =>
                smtModifyTitleDesc_add_mod(item, '#smtModifyTitleDesc_modules_phone')
            )
        }
        //设置描述
        smtModifyTitleDesc_simditor = wangEditorRender('smtModifyTitleDesc_PCdesc', data.detail)
    }).catch(err => layer.msg(err, { icon: 2 }))
}

smtModifyTitleDesc_init()

// 提交修改
function smtModifyTitleDesc_sibmit () {
    var detailData = {}
    // 标题
    detailData.title = $(".smtModifyTitleDesc_title").find('input[name=shopTiele_Desc]').val()
    // 手机版
    var parentDomPhone = $('#smtModifyTitleDesc_modules_phone').find('.smtModifyTitleDesc-rowFlexClass')
    var mobileDetail = {
        mobileDetail: smtModifyTitleDesc_desc_preview_deal(parentDomPhone),
        version: "1.0",
        versionNum: 1
    }
    detailData.mobileDetail = JSON.stringify(mobileDetail)
    var pDom = $('.detail-desc-decorate-content')
    if (pDom.length) {
        pDom.each(function (index, item) {
            var newHtml = $(item).html().replace(/(\r\n|\n|\r)/gm, '<br>')
            $(item).html(newHtml)
        })
    }
    detailData.detail = smtModifyTitleDesc_simditor.txt.html() //获取富文本的值
    commonReturnPromise({
        url: ctx + '/batchOperation/updateTitleAndDetail',
        type: 'post',
        params: JSON.stringify({
            ...smtModifyTitleDesc_data,
            ...detailData
        }),
        contentType: 'application/json',
    }).then(data => {
        var _data = JSON.parse(data)

        Object.keys(_data)[0] == 'fail' ? layui.layer.msg(Object.values(_data)[0], { icon: 2 })
            : layui.layer.msg(Object.values(_data)[0], { icon: 1 })
    }).catch(err => layui.layer.msg(err, { icon: 2 }))
}

//#region 替换start
// 替换标题
$("#smtModifyTitleDesc_repTitle").click(function () {
    loading.show()
    var originStr = $('#smtModifyTitleDesc_origin').val()
    var curStr = $("#smtModifyTitleDesc_current").val()
    smtModifyTitleDesc_repTitle(originStr, curStr)
    loading.hide()
})
// 替换标题和文字
$("#smtModifyTitleDesc_repTitleDesc").click(function () {
    loading.show()
    var originStr = $('#smtModifyTitleDesc_origin').val()
    var curStr = $("#smtModifyTitleDesc_current").val()
    // 替换标题
    smtModifyTitleDesc_repTitle(originStr, curStr)
    // 替换手机版详情  文本替换
    var textDom = $('#smtModifyTitleDesc_modules_phone').find('.smtModifyTitleDesc-rowFlexClass')
        .filter((_, item) => $(item).attr('data-type') == 'text')

    Array.from(textDom).forEach(item => {
        var titleDom = $(item).find('.titleDom').find('span').last()
        if (!!titleDom.text()) titleDom.text(titleDom.text().replaceAll(originStr, curStr))
        var contentDom = $(item).find('.contentDom')
        if (!!contentDom.text()) contentDom.text(contentDom.text().replaceAll(originStr, curStr))
    })
    // 富文本替换
    const reg = /(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g;
    var productDescription = smtModifyTitleDesc_simditor.txt.html(); //获取富文本的值
    var _productDescription = productDescription.replace(reg, s => s.replaceAll(originStr, curStr))
    smtModifyTitleDesc_simditor.txt.html(_productDescription)
    // 找到那些数据
    loading.hide()
})

// 标题替换
function smtModifyTitleDesc_repTitle (originStr, curStr) {
    var inputDom = $(".smtModifyTitleDesc_title").find('input[name=shopTiele_Desc]')
    var newStr = inputDom.val().replaceAll(originStr, curStr)
    inputDom.val(newStr)
    smtModifyTitleDesc_titleNumNoteJudge(newStr)
}
//标题字数提示 最多128
function smtModifyTitleDesc_titleNumNote (dom) {
    smtModifyTitleDesc_titleNumNoteJudge($(dom).val())
}
//判断标题字数
function smtModifyTitleDesc_titleNumNoteJudge (data) {
    var restNum = 128 - data.length
    if (restNum < 0) {
        $('#smtModifyTitleDesc_title_numLimit').html(`超出字数：${-restNum}`)
        $('#smtModifyTitleDesc_title_numLimit').css('color', 'red')
    } else {
        $('#smtModifyTitleDesc_title_numLimit').html(`剩余字数：${restNum}`)
        $('#smtModifyTitleDesc_title_numLimit').css('color', '#666')
    }
}

//#endregion 替换end

// 生成pc描述
function smtModifyTitleDesc_wirelessToPc () {
    loading.show()
    var parentDomPhone = $('#smtModifyTitleDesc_modules_phone').find('.smtModifyTitleDesc-rowFlexClass')
    var moduleList = smtModifyTitleDesc_desc_preview_deal(parentDomPhone)
    var pcSimditor = ''
    for (var i = 0; i < moduleList.length; i++) {
        if (moduleList[i].type == 'text') {
            let _content = ''
            if (moduleList[i].className == 'title') {
                _content = moduleList[i].content != '' ? `<p class="detail-desc-decorate-title" style="text-overflow: ellipsis; font-family: 'OpenSans';color:'#000';word-wrap: break-word;white-space: pre-wrap;font-weight: 600;font-size: 20px;line-height: 20px;color: #000;margin-bottom: 12px;"> ${moduleList[i].content}</p>` : ''
                pcSimditor += `<div class="detailmodule_text">${_content}<div>`
            } else if (!moduleList[i].className) {
                var contentText = moduleList[i].content.replace(/(\r\n|\n|\r)/gm, '<br>')
                _content = moduleList[i].content != '' ? `<p class="detail-desc-decorate-content" style="text-overflow: ellipsis;font-family: 'OpenSans';color:'#000';word-wrap: break-word;white-space: pre-wrap;font-weight: 300;font-size: 14px;line-height: 20px;color: #000;margin-bottom: 12px;">${contentText}</p>` : ''
                pcSimditor += `<div class="detailmodule_text">${_content}<div>`
            }
        } else if (moduleList[i].type == 'image') {
            if (moduleList[i].images.length) {
                let imgList = ''
                moduleList[i].images.forEach(item => {
                    !!item.imgUrl ? imgList += `<img  src="${item.imgUrl}" class="detail-desc-decorate-image">` : ''
                })
                pcSimditor += `<div class="detailmodule_image">${imgList}<div>`
            }
        }
    }
    smtModifyTitleDesc_simditor.txt.html(pcSimditor)
    loading.hide()
    layui.layer.msg('生成pc描述成功', { icon: 1 })
}

// #region 模块 start
function smtModifyTitleDesc_add_mod (obj, dom) {
    switch (obj.type) {
        case 'text':
            let title = ''
            let body = ''
            obj.text && Array.isArray(obj.text) && obj.text.forEach((item, index) => {
                if (item.className == 'title') { title = item.content }
                if (item.className != 'title') {
                    index != obj.text.length - 1 ? body += item.content + '\n' || '' : body += item.content || ''
                }
            })
            let textMod = `<div class="smtModifyTitleDesc-rowFlexClass"
                  draggable="true" data-type="text">
                 <div class="smtModifyTitleDesc-rowFlexLeft">
                     <div>文本</div>
                     <div><i class="layui-icon red" style="font-size: 24px"
                             onclick="smtModifyTitleDesc_delModule(this)"></i></div>
                 </div>
                 <div style="width: 70%">
                     <div>
                         <div class="smtModifyTitleDesc-textFlexCloumn">
                             <div class="smtModifyTitleDesc-mult-ellipsis-1 titleDom">
                                 <span>标题：</span>
                                 <span>${title}</span>
                             </div>
                             <div class="smtModifyTitleDesc-rowFlexClass_line_content">
                                 <div class="smtModifyTitleDesc-textClass"
                                     style="width: 50px; flex: none">内容：</div>
                                 <div class="smtModifyTitleDesc-textClass contentDom">${body}</div>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="smtModifyTitleDesc-rowFlexRight">
                     <div onclick="smtModifyTitleDesc_editText(this)">编辑文本</div>
                 </div>
             </div>`
            $(dom).append(textMod)
            break;
        case 'image':
            smtModifyTitleDesc_addImg_pc_number = smtModifyTitleDesc_addImg_pc_number + 1
            let picMod = `<div class="smtModifyTitleDesc-rowFlexClass"
                 draggable="true" data-type="image">
                <div class="smtModifyTitleDesc-rowFlexLeft">
                    <div>图片(<span class="fGrey smtModifyTitleDesc-rowFlexClass-imgLength">${obj.images.length || ''}</span>)</div>
                    <div><i class="layui-icon red" style="font-size: 24px"
                            onclick="smtModifyTitleDesc_delModule(this)"></i></div>
                </div>
                <div style="width: 70%">
                    <ul class="smtModifyTitleDesc-rowflexline uploadImgUL ui-sortable">
                    ${obj.images.map(item => `
                                <li draggable="true"
                                    style="height: 110px;border:1px solid #ccc;"
                                    class="ui-sortable-handle"
                                    data-imgsrc="${item.imgUrl}"
                                    data-targetURL="${item.targetUrl || ''}"
                                    data-width="${item.width || ''}"
                                    data-height="${item.height || ''}"
                                >
                                    <div class="ImgDivOut">
                                        <div class="ImgDivIn">
                                            <img src="${item.imgUrl}" style="height:85px;width: auto"
                                                alt=""
                                                class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                onclick="smtModifyTitleDesc_targetUrl_jump(this)"
                                                title="双击即可复制路径" />
                                        </div>
                                        <div class="imgDivDown disflex"
                                            style="justify-content: space-around;">
                                            <a class="fl ${!!item.targetUrl ? 'fGreen' : ''}" onclick="smtModifyTitleDesc_targetUrl(this);"
                                                href="javascript:void(0);">
                                                <i class="layui-icon" style="font-size:14px">&#xe64c;</i>
                                            </a>
                                            <a onclick="smtModifyTitleDesc_delImg(this);"
                                                href="javascript:void(0);">移除</a>
                                        </div>
                                    </div>
                                </li>`).join('')
                }
                    </ul>
                </div>
                <div class="smtModifyTitleDesc-rowFlexRight">               
                    <div id="smtModifyTitleDesc_addImg_pc_${smtModifyTitleDesc_addImg_pc_number}" class="mb10">本地添加</div>
                    <div onclick="smtModifyTitleDesc_addImg_url(this)" class="mb10">URL添加</div>
                    <div onclick="smtModifyTitleDesc_addTplImg(this)">模板图片</div>
                </div>
            </div>`
            $(dom).append(picMod)
            smtModifyTitleDesc_addImg_upload(`smtModifyTitleDesc_addImg_pc_${smtModifyTitleDesc_addImg_pc_number}`)
            break;
    }
}

// 添加文本模块
function smtModifyTitleDesc_addText () {
    smtModifyTitleDesc_add_mod({ type: 'text' }, '#smtModifyTitleDesc_modules_phone')
}
// 添加图片模块
function smtModifyTitleDesc_addImg () {
    smtModifyTitleDesc_add_mod({ type: 'image', images: [] }, '#smtModifyTitleDesc_modules_phone')
}
// 删除模块
function smtModifyTitleDesc_delModule (dom) {
    let parentDom = $(dom).parents('.smtModifyTitleDesc-rowFlexClass')
    parentDom.remove()

}
// #endregion 模块结束

// #region 模块的文本编辑和上传图片 start
// 编辑文本框
function smtModifyTitleDesc_editText (dom) {
    let parentDom = $(dom).parents('.smtModifyTitleDesc-rowFlexClass')
    // 标题文字
    let titleDom = parentDom.find('.titleDom').find('span').last()
    // 内容
    let contentDom = parentDom.find('.contentDom')
    var layer = layui.layer
    layer.open({
        title: '文本编辑框',
        type: 1,
        id: Date.now(),
        content: $('#smtModifyTitleDesc_text_modal').html(),
        area: ['65%', ''],
        btn: ['保存', '关闭'],
        success: function () {
            let formInput = $('#smtModifyTitleDesc_text_form').find('input[name=title]')
            let formTextarea = $('#smtModifyTitleDesc_text_form').find('textarea[name=content]')
            formInput.val(titleDom.html())
            formTextarea.val(`${contentDom.html()}`)
        },
        yes: function (index, layero) {
            let formInput = $('#smtModifyTitleDesc_text_form').find('input[name=title]')
            let formTextarea = $('#smtModifyTitleDesc_text_form').find('textarea[name=content]')
            titleDom.html(formInput.val())
            contentDom.html(formTextarea.val())
            layer.close(index)
        },
    })
}
// 从url添加图片
function smtModifyTitleDesc_addImg_url (dom) {
    let parentDom = $(dom).parents('.smtModifyTitleDesc-rowFlexClass')
    let imgArr = $(parentDom).find('ul').find('li')
    var layer = layui.layer
    if (imgArr.length == 10) return layer.msg('请删除后添加', { icon: 5 })
    var laytpl = layui.laytpl
    layer.open({
        title: '从url添加图片',
        type: 1,
        id: Date.now(),
        offset: '20%',
        area: '65%',
        btn: ['保存', '关闭'],
        success: function (layero) {
            let arr = new Array(10).slice(imgArr.length)
            laytpl($("#smtModifyTitleDesc_imgUrl_modal").html()).render(arr, function (html) {
                $(layero).find('.layui-layer-content').html(html)
            })
        },
        yes: function (index, layero) {
            let imgObj = serializeObject($("#smtModifyTitleDesc_img_form"))
            let imgAddArr = Object.values(imgObj).filter(item => !!item)
            if (imgAddArr.length) {
                imgAddArr.forEach(item => {
                    smtModifyTitleDesc_is_img_url(item, true) && smtModifyTitleDesc_addImg_detail(parentDom, item)
                })
            }
            layer.close(index)
        },
    })
}
// 模板图片
function smtModifyTitleDesc_addTplImg(dom){
    const limit = 10
    let parentDom = $(dom).parents('.smtModifyTitleDesc-rowFlexClass')
    const existImgs = $(parentDom).find('ul').find('li').length
    let param = {
        prodPIds: smtModifyTitleDesc_data.prodPIds.split(',')
    }
    if(Array.isArray(smt_arr[0].prodSyncSmtDtos)){
        let allProdPSkus = smt_arr[0].prodSyncSmtDtos.map(item=>item.prodPSku)
        param = {
            prodPSkus: [...new Set(allProdPSkus)]
        }
    }
    const params = {
        param,
        limit,
        existImgs,
        parentDom,
        cb: function (tplUrlList) {
          if (Array.isArray(tplUrlList) && tplUrlList.length) {
            tplUrlList.forEach(item=>{
                smtModifyTitleDesc_addImg_detail(parentDom, item)
            })
          }
        },
      }
      comPickImageTpl(params,'aliexpress')
}
function smtModifyTitleDesc_chooseTplImg(layero, res){
    $('.smtModifyTitleDesc-chooseTplImg').click(function(e){
        const checkboxDOm = $(e.target).parent().find('input[name=tplUrl]')
        if(checkboxDOm.prop('checked')){
            checkboxDOm.prop('checked',false)
        }else{
            checkboxDOm.prop('checked',true)
        }
        smtModifyTitleDesc_tplImg_render(layero, res)
    })
}

function smtModifyTitleDesc_tplImg_render(layero, res){
    layui.form.render()
    let checkboxClass = ''
    if(res.isSupplierOrigiImg){
        checkboxClass = '.layui-card-header .layui-form-checked[lay-skin=primary] i'
    }else{
        checkboxClass = '.layui-card-header .layui-form-checkbox[lay-skin=primary] i'
    }
    $(layero).find(checkboxClass).css({
        'top':'18px',
        'left':'10px'
    })
     $(layero).find('.layui-form-checkbox span').css({
        'fontSize':'12px',
        'padding':'0 2px'
    })
}
// 从计算机选择
function smtModifyTitleDesc_addImg_upload (id) {
    layui.use(['upload', 'layer'], function () {
        var upload = layui.upload
        var layer = layui.layer
        let dom = '#' + id
        var parentDom = $(`${dom}`).parents('.smtModifyTitleDesc-rowFlexClass')
        upload.render({
            elem: dom, //绑定元素
            url: ctx + "/smtPublishModelProduct/uploadPic.html", //上传接口
            accept: "images",
            multiple: true,
            before: function () {
                loading.show()
            },
            done: function (res) {
                //上传完毕回调
                loading.hide()
                if (parentDom.find('ul').find('li').length >= 10) {
                    return layer.msg('请删除后添加', { icon: 5 })
                } else {
                    if (!res.msg.includes('http')) return layer.msg(res.msg, { icon: 5 })
                    smtModifyTitleDesc_addImg_detail(parentDom, res.msg)
                }
            },
            error: function () {
                //请求异常回调
                loading.hide()
            }
        });
    });
}
// 添加图片具体
function smtModifyTitleDesc_addImg_detail (parentDom, src) {
    let itemDom = `
                    <li draggable="true"
                        style="height: 110px;border:1px solid #ccc;"
                        data-imgsrc="${src}"
                        data-targetURL=""
                        data-width=""
                        data-height=""
                        class="ui-sortable-handle">
                        <div class="ImgDivOut">
                            <div class="ImgDivIn">
                                <img src="${src}" style="height:85px;width: auto"
                                    alt=""
                                    class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                    onclick="smtModifyTitleDesc_targetUrl_jump(this)"
                                    title="双击即可复制路径" />
                            </div>
                            <div class="imgDivDown disflex"
                                style="justify-content: space-around;">
                                <a class="fl" onclick="smtModifyTitleDesc_targetUrl(this);"
                                    href="javascript:void(0);"><i class="layui-icon" style="font-size:14px">&#xe64c;</i></a>
                                <a onclick="smtModifyTitleDesc_delImg(this);"
                                    href="javascript:void(0);">移除</a>
                            </div>
                        </div>
                    </li>`
    $(parentDom).find('ul').append(itemDom)
    var imgLength = $(parentDom).find('li').length
    $(parentDom).find('.smtModifyTitleDesc-rowFlexClass-imgLength').text(imgLength)

}
// 删除图片
function smtModifyTitleDesc_delImg (data) {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function (index) {
        var parentDom = $(data).parents('.smtModifyTitleDesc-rowFlexClass')
        $(data).closest('li').remove();
        var imgLength = $(parentDom).find('ul').find('li').length
        $(parentDom).find('.smtModifyTitleDesc-rowFlexClass-imgLength').text(imgLength)
        layer.close(index);
    });
}

// 图片跳转Url
function smtModifyTitleDesc_targetUrl (dom) {
    let parentDom = $(dom).parents('li')
    let targetURL = parentDom.attr('data-targetURL')
    var layer = layui.layer
    layer.open({
        title: '图片跳转URL',
        type: 1,
        id: Date.now(),
        content: $('#smtModifyTitleDesc_targetURL').html(),
        area: ['500px', ''],
        btn: ['保存', '关闭'],
        success: function () {
            $('#smtModifyTitleDesc_targetURL_input').val(targetURL)
        },
        yes: function (index, layero) {
            let _domVal = $('#smtModifyTitleDesc_targetURL_input').val()
            let _targetURL = smtModifyTitleDesc_is_img_url(_domVal, false) ? _domVal : ''
            parentDom.attr('data-targetURL', _targetURL)
            if (_targetURL == '') {
                $(dom).css('color', '#333')
            } else {
                $(dom).css('color', 'green')
            }
            layer.close(index)
        },
    })
}

// 图片跳转url
function smtModifyTitleDesc_targetUrl_jump (dom) {
    var parentDom = $(dom).parents('li')
    var targetURL = parentDom.attr('data-targetURL')
    !!targetURL && window.open(targetURL)
}
// 验证地址是否有效
function smtModifyTitleDesc_isurl (dom) {
    $(dom).val() && !smtModifyTitleDesc_is_img_url($(dom).val(), false) && $(dom).val('您使用的链接不可用')
}
// 验证图片地址是否有效
function smtModifyTitleDesc_isImgurl (dom) {
    $(dom).val() && !smtModifyTitleDesc_is_img_url($(dom).val(), true) && $(dom).val('您使用的链接不可用')
}
function smtModifyTitleDesc_is_img_url (url, isImg = false) {
    var strRegex = /^\b(((https|https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
    if (isImg) {
        var isImgType = /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(url)
        return strRegex.test(url) && isImgType ? true : false
    } else {
        return strRegex.test(url) ? true : false
    }
}

// #endregion 模块的文本编辑和上传图片 start

// #region 预览 start
function smtModifyTitleDesc_preview () {
    var moduleDatas = {}
    var moduleList
    var parentDomPhone = $('#smtModifyTitleDesc_modules_phone').find('.smtModifyTitleDesc-rowFlexClass')
    moduleList = smtModifyTitleDesc_desc_preview_deal(parentDomPhone)
    var _moduleList = moduleList.map(item => {
        if (item.type == 'text') {
            var _item = item.className == 'title' ? [{
                class: "title",
                content: item.content,
            }] : [{
                class: "body",
                content: item.content,
            }]
            return { type: 'text', texts: _item }
        } else if (item.type == 'image') {
            var _item = item.images.map(elem => ({ ...elem, url: elem.imgUrl }))
            return { ...item, images: _item }
        }
    })
    moduleDatas = {
        moduleList: _moduleList,
        version: "1.0"
    }
    //保存到缓存中 ,deviceType,1表示是手机端，2表示是pc端，宽度不一样 
    window.localStorage['priviewSmtData'] = JSON.stringify({ deviceType: 1, moduleDatas });
    // 打开新页面
    window.open(`${ctx}/static/smtPublishPreview.html`)
}

// 预览缓存添加数据  刊登产品详情描述保存数据
function smtModifyTitleDesc_desc_preview_deal (parentDom) {
    let moduleList = []
    Array.from(parentDom).forEach(item => {
        let type = $(item).attr('data-type')
        let images = []
        switch (type) {
            case 'text':
                var titleHtml = $(item).find('.titleDom').find('span').last().html()
                var contentHtml = $(item).find('.contentDom').html()
                var titleText = {
                    className: "title",
                    content: titleHtml,
                    type: 'text',
                }
                if (titleHtml != '' || contentHtml != '') {
                    moduleList.push(titleText)
                    contentHtml == '' ? '' : moduleList.push({ type, content: contentHtml, })
                }
                break;
            case 'image':
                images = Array.from($(item).find('ul').find('li')).map(elem => {
                    if (!!$(elem).attr('data-targetURL')) {
                        return {
                            imgUrl: $(elem).attr('data-imgsrc'),
                            targetUrl: $(elem).attr('data-targetURL'),
                            height: 0,
                            width: 0,
                        }
                    } else {
                        return {
                            imgUrl: $(elem).attr('data-imgsrc'),
                            height: 0,
                            width: 0,
                        }
                    }

                })
                images.length ? moduleList.push({ type, images, col: 1 }) : ""
                break;
            default:
                break;
        }
    })
    return moduleList
}

// #endregion 预览 end
