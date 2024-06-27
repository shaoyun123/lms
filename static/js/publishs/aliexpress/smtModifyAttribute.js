
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
        //smt_arr 选中的数据
        var smtModifyAttributeName = {
            smtModifyAttr: [],
            searchProdCateAndAttr: function () {
                this.searchProdCateAndAttrAjax()
                    .then(data => {
                        var _data = data.map(item => item.attr)
                        this.smtModifyAttr = data
                        this.lookCommonAttrs(_data)
                        this.cardListRender(data)
                    })
                    .catch(err => layer.msg(err, { icon: 2 }))
            },
            cardListRender: function (arr) {
                let html=''
                arr.forEach((item, index) => {
                    html += `<div class="layui-card smtModifyAttribute-card">
                        <div class="layui-card-header smtModifyAttribute-card-header">
                            <input class="smtModifyAttribute-card-header-checkbox smtModifyAttribute-one-checked" 
                                type="checkbox" name="" 
                                title="${item.storeAcct} -- ${item.itemId}" lay-skin="primary"
                            />
                            <div class="h100 w_100 smtModifyAttribute-tohideIcon" onclick="smtModifyAttribute_hide(this)"><i class="layui-icon smtModifyAttribute-mt7">&#xe619;</i></div>
                            <div class="h100 w_100 hidden smtModifyAttribute-toShowIcon" onclick="smtModifyAttribute_show(this)"><i class="layui-icon smtModifyAttribute-mt7">&#xe61a;</i></div>
                        </div>
                        <div class="layui-card-content hidden smtModifyAttribute-card-pb20 smtModifyAttribute-check-content" id="smtModifyAttribute-card-${index}" 
                            data-storeAcctid="${item.storeAcctId}" data-itemid="${item.itemId}" data-storeAcct="${item.storeAcct}"
                        >
                            <div class="layui-form-item">
                                <label class="layui-form-label">分类属性:</label>
                                <div class="layui-input-block">
                                    <div class="smtModifyAttribute-cagprop"></div>
                                    <!-- 更多選填屬性 -->
                                    <div class="layui-form-item smtModifyAttribute-cagprop-more-label">
                                        <label class="layui-form-label" style="color: #51bf7e;"
                                            onclick="smtModifyAttribute_showMoreProperty(this)">更多选填属性</label>
                                    </div>
                                    <div class="smtModifyAttribute-cagprop-more"></div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">自定义属性:</label>
                                <div class="layui-input-block smtModifyAttribute-listDetailTpl">
                                    <div class="disflex">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            onclick="smtModifyAttribute_addProper(this)">添加自定义属性</button>
                                        <button class="layui-btn layui-btn-sm  layui-btn-danger ml10"
                                            type="button" onclick="smtModifyAttribute_delProper(this)">删除全部</button>
                                        <div class="ml10 ">(仅支持数字和英文，不支持其它字符)</div>
                                    </div>
                                    <div class="smtModifyAttribute-listDetailTpl-addproper"></div>
                                </div>
                            </div>
                        </div>
                    </div>`
                })
                $('#smtModifyAttributeForm').html(html)
                arr.forEach((item,index)=>{
                    this.oneStoreRender(item, index)
                })
                form.render()
            },
            //#region 类目属性渲染start
            oneStoreRender: function (obj, index) {
                // 其它项 做整合 
                var otherValList = obj.properties.filter(item => item.attrValueId == -1)
                var otherIdList = obj.properties.filter(item => item.attrValue === undefined)
                let exactPropties = obj.properties.filter(item => (item.attrValueId != -1) && (item.attrValue !== undefined))
                otherValList.forEach(item => {
                    for (var i = 0; i < otherIdList.length; i++) {
                        if ((item.attrNameId == otherIdList[i].attrNameId) && !otherIdList[i].attrValue) {
                            exactPropties.push({
                                attrName: item.attrName,
                                attrNameId: item.attrNameId,
                                attrValue: item.attrValue,
                                attrValueId: otherIdList[i].attrValueId,
                                isOther: true
                            })
                            break
                        }
                    }
                })
                if (obj.brand) {
                    this.renderCategory(obj.brand, exactPropties, index)
                }
                if (obj.attr) {
                    this.renderCategory(obj.attr, exactPropties, index)
                }
                // 自定义属性
                var customProperty = exactPropties.filter(item => item && item.attrNameId == -1)
                var customPropertyDoms = ''
                if (Array.isArray(customProperty) && customProperty.length) {
                    customProperty.forEach(item => {
                        customPropertyDoms += `<div class="layui-row m-top10 detailItem">
                            <div class="layui-col-md2"><input class="layui-input" type="text" name="property" value='${item.attrName || ""}'></div>
                            <div class="layui-col-md3 ml10"><input class="layui-input" type="text" name="propertyVal" value='${item.attrValue || ""}'></div>
                            <div class="layui-col-md3 ml10"><button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" onclick="smtModifyAttribute_delProperOwn(this)">删除</button></div>
                        </div>`
                    })
                }
                // 添加自定义数据
                $(`#smtModifyAttribute-card-${index}`).find('.smtModifyAttribute-listDetailTpl-addproper').append(customPropertyDoms)
            },
            //对类目数据处理，必填，不必填，
            renderCategory: function (data, checkedData, index) {
                var cardDom = $(`#smtModifyAttribute-card-${index}`)
                if (Array.isArray(data) && data.length > 0) {
                    var _data = data.map(item => {
                        var _item = checkedData.filter(checkItem => checkItem.attrNameId && checkItem.attrNameId == item.attributeId)
                        return { ...item, checkedValue: _item }
                    })  //把选中的值塞到对应的
                    var requiredDoms = "";
                    var notRequiredDoms = "";
                    var requiredData = _data.filter(item => item.required)
                    var notReqiuredData = _data.filter(item => !item.required)
                    for (let i = 0; i < requiredData.length; i++) {
                        requiredDoms += this.oneAttrRender(requiredData[i])
                    }
                    for (let i = 0; i < notReqiuredData.length; i++) {
                        notRequiredDoms += this.oneAttrRender(notReqiuredData[i])
                    }
                    cardDom.find(".smtModifyAttribute-cagprop").append(requiredDoms)  //类目  必填
                    if (!notReqiuredData.length && !_data.filter(chooseItem => chooseItem.attributeId == '2').length) {
                        cardDom.find(".smtModifyAttribute-cagprop-more-label").remove()
                    }
                    cardDom.find(".smtModifyAttribute-cagprop-more").append(notRequiredDoms)//类目 可以折叠的属性 不必填
                }
            },
            // 类目属性渲染 
            oneAttrRender: function (obj) {
                var propertyDom = ""
                var isrequired = obj.required ? `<font color="red">*</font>` : ""
                switch (obj.attributeShowTypeValue) {
                    case 'brand':
                        var optionItems = this.changeOptionToString(obj.categoryAttributeValuesSmts, obj.checkedValue)
                        var isBrandBtn = `<div class="layui-col-md3">
                                            <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" 
                                                data-categoryId="${obj.categoryId}"
                                                type="button" onClick="smtModifyAttribute_sync_brand(this,${obj.required})"
                                            >同步</button>
                                        </div>`
                        propertyDom = `<div class="layui-form-item">
                                            <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6">
                                                <select name="${_name}" attrName="${obj.attributeNameEn}" 
                                                        attrNameId="${obj.attributeId}" id="" required="${obj.required}"
                                                >${optionItems}</select>
                                                </div>
                                                ${isBrandBtn}
                                        </div>
                                        </div>`
                        return propertyDom
                    case 'list_box':
                        var optionItems = this.changeOptionToString(obj.categoryAttributeValuesSmts, obj.checkedValue)
                        // 当选项中有其它选项时,且选中的时候，后面添加input
                        let hasOtherOption = obj.checkedValue.length && obj.checkedValue[0].attrValue
                        let otherInput = obj.checkedValue.length && obj.checkedValue[0].isOther
                            ? `<div class="layui-col-md2  smtModifyAttribute-sel-other-input">
                                    <input class="layui-input" name="${obj.required}${obj.attributeId}" 
                                        value="${obj.checkedValue[0].attrValue}" 
                                        placeholder="当选择其它选项时，需要填此项"
                                    />
                                </div>` : ''
                        var _isBrandBtn = obj.attributeNameZn == '品牌' ?
                            `<div class="layui-col-md3">
                                <button class="layui-btn layui-btn-sm" data-categoryId="${obj.categoryId}" 
                                    style="margin-left: 20px;" type="button" 
                                    onClick="smtModifyAttribute_sync_brand(this,${obj.required})"
                                >同步</button>
                            </div>`: ''
                        propertyDom = `<div class="layui-form-item">
                                            <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6 smtModifyAttribute-select-block">
                                                <select name="${obj.required}${obj.attributeId}" attrName="${obj.attributeNameEn}" 
                                                    attrNameId="${obj.attributeId}" required="${obj.required}"
                                                    lay-filter="smtModifyAttribute_selOtheb_input"
                                                >${optionItems}</select>
                                                </div>
                                                ${otherInput}
                                                ${_isBrandBtn}
                                            </div>
                                       </div>`
                        return propertyDom
                    case 'input':
                        var dataListItems = this.changeOptionDatalist(obj) || ''
                        propertyDom = `<div class="layui-form-item">
                                            <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6">
                                                <input class="layui-input" name='${obj.required}${obj.attributeId}' list='${obj.required}${obj.attributeId}' attrNameId='${obj.attributeId}' required='${obj.required}' attrName='${obj.attributeNameEn}'  value='${obj.checkedValue[0] ? obj.checkedValue[0].attrValue : ""}'>
                                                ${dataListItems}
                                                </div>
                                            </div>
                                        <div>`
                        return propertyDom
                    case 'check_box':
                        var checkboxItems = this.changeCheckboxToString(obj, obj.checkedValue)
                        propertyDom = `<div class="layui-form-item">
                                            <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
                                            <div class="layui-input-block">
                                            <div class="smtModifyAttribute-listDetailTpl-container" >${checkboxItems}</div>
                                        </div>
                                        </div>`
                        return propertyDom
                    default:
                        break;
                }
            },
            //下拉框单选 datalist
            changeOptionDatalist: function (obj) {
                if (obj.categoryAttributeValuesSmts && Array.isArray(obj.categoryAttributeValuesSmts) && obj.categoryAttributeValuesSmts.length) {
                    var arr = '<option value="">请选择</option>'
                    for (let i = 0; i < obj.categoryAttributeValuesSmts.length; i++) {
                        arr += `<option value='${obj.categoryAttributeValuesSmts[i].valueNameZn}(${obj.categoryAttributeValuesSmts[i].valueNameEn})'></option>`
                    }
                    return `<datalist id="${obj.required}${obj.attributeId}">${arr}</datalist>`
                }
            },
            // 下拉框
            changeOptionToString: function (obj, checkedData) {
                var arr = '<option value="">请选择</option>'
                if (Array.isArray(obj) && obj.length) {
                    for (let i = 0; i < obj.length; i++) {
                        arr += `<option value='${obj[i].categoryAttributeValueId}' attrValue='${obj[i].valueNameEn}'
                                        enName='${obj[i].valueNameEn}'
                                        ${checkedData.filter(item => item.attrValueId == obj[i].categoryAttributeValueId || !item.attrName).length ? 'selected' : ''}
                                    >
                                        ${obj[i].valueNameZn}(${obj[i].valueNameEn})
                                    </option>`
                    }
                }
                return arr
            },

            //checkbox 单个渲染 obj:要渲染的数据 checkData：选中的数据  
            changeCheckboxToString: function (obj, checkedData = []) {
                var arr = ''
                var { categoryAttributeValuesSmts } = obj
                if (Array.isArray(categoryAttributeValuesSmts) && categoryAttributeValuesSmts.length) {
                    for (let i = 0; i < categoryAttributeValuesSmts.length; i++) {
                        let checkedItem = this.dealCheckboxChecked(checkedData, categoryAttributeValuesSmts[i])
                        let otherInput = checkedItem.length && checkedItem[0].isOther ?
                            `<input class="layui-input smtModifyAttribute-checkbox-other-input mr10" name="${obj.required}${obj.attributeId}" 
                                value='${checkedItem[0].attrValue}'
                                placeholder="当选择其它选项时，需要填此项"
                            />` : ''
                        arr += `<div class="smtModifyAttribute-mentalProperty-checkbox disFCenter">
                                    <input type="checkbox" title='${categoryAttributeValuesSmts[i].valueNameZn}(${categoryAttributeValuesSmts[i].valueNameEn})'
                                    data-name='${categoryAttributeValuesSmts[i].valueNameZn}' name='${obj.required}${obj.attributeId}' lay-skin="primary" 
                                    ${checkedItem.length ? 'checked' : ''} 
                                    lay-filter="smtModifyAttribute_checkOtheb_input"
                                    value='${categoryAttributeValuesSmts[i].categoryAttributeValueId}' attrName='${obj.attributeNameEn}'
                                    attrNameId='${obj.attributeId}' attrValue='${categoryAttributeValuesSmts[i].valueNameEn}'
                                    enName='${categoryAttributeValuesSmts[i].valueNameEn}'
                                    >
                                    ${otherInput}
                                </div>`
                    }
                }
                return arr
            },
            //checkbox 处理是否选中
            dealCheckboxChecked: function (arr, obj) {
                var _checkedData = []
                if (Array.isArray(arr) && arr.length) {
                    _checkedData = arr.filter(item => item.attrValueId == obj.categoryAttributeValueId)
                }
                return _checkedData
            },
            //#endregion 类目属性end
            // 全选和非全选
            checkedStore: function () {
                form.on('checkbox(smtModifyAttribute-allChecked)', function (obj) {
                    var childCboxDom = $('.smtModifyAttribute-one-checked');
                    if (obj.elem.checked) {
                        childCboxDom.each(function (index, item) {
                            $(item).prop('checked', true);
                        })
                    } else {
                        childCboxDom.each(function (index, item) {
                            $(item).prop('checked', false);
                        })
                    }
                    form.render('checkbox');
                });

                $('#smtModifyAttributeForm').on('click', $('.smtModifyAttribute-one-checked').next(), function () {
                    var childCboxDom = $('.smtModifyAttribute-one-checked');
                    var childChdboxLength = 0
                    childCboxDom.each(function (index, item) {
                        if (!!$(item).prop('checked')) {
                            childChdboxLength++
                        }
                    })
                    $('.smtModifyAttribute-allChecked').prop('checked', childCboxDom.length == childChdboxLength)
                    form.render('checkbox');
                });
            },
            //#region 共有类目属性 一键应用 start
            // 查找出共有的类目属性
            lookCommonAttrs: function (arr) {
                // 排除attr中的品牌类目
                commonAttrs = smt_arr.filter(item => item.categoryId == smt_arr[0].categoryId).length == smt_arr.length
                    ? arr[0].filter(item => item.attributeId != 2)
                    : []
                this.commonAttrsRender(commonAttrs)
                // 一键应用
                this.repOneCommAttr()
            },
            // 渲染共有属性
            commonAttrsRender: function (arr) {
                if (!arr.length) return $('#smtModifyAttribute_rep_sameAttr').empty()
                var labelArr = arr.map(item => ({
                    attributeId: item.attributeId,
                    attributeNameEn: item.attributeNameEn,
                    attributeNameZn: item.attributeNameZn,
                    attributeShowTypeValue: item.attributeShowTypeValue,
                    required: item.required,
                    attributeShowTypeValue: item.attributeShowTypeValue,
                    isOtherInput: (item.attributeShowTypeValue == 'check_box' || item.attributeShowTypeValue == 'list_box') && Array.isArray(item.categoryAttributeValuesSmts) && item.categoryAttributeValuesSmts.filter(item =>
                        item.valueNameEn == 'Other').length
                        ? true : false
                }))
                var optionStr = ''
                labelArr.forEach(item => {
                    optionStr += `<option value="${item.required}${item.attributeId}replace" data-type="${item.attributeShowTypeValue}" data-other="${item.isOtherInput}">${item.attributeNameZn}(${item.attributeNameEn})</options>`
                })
                $('#smtModifyAttribute_rep_attrName').html(optionStr)
                this.commonOneAttrsRender(arr[0])
                form.render('select')
                this.monitorCommonAttr(arr)
            },
            // 监听 选中某一共有属性
            monitorCommonAttr: function (arr) {
                var _this = this
                form.on('select(smtModifyAttribute_rep_attrName)', function (obj) {
                    var curObj = arr.filter(item => `${item.required}${item.attributeId}replace` == obj.value)[0]
                    _this.commonOneAttrsRender(curObj)
                    // 切换选项时，如果有后面的input框，就删除
                    var parentDom = $('#smtModifyAttribute_rep_attrValue')
                    var inputDom = parentDom.find('.smtModifyAttribute-selRep-other-input')
                    inputDom.length && inputDom.remove()
                })
            },
            // 头部的修改属性的多选触发
            monitorCommFormselect: function (xmSelectId, inputDomName) {
                formSelects.on(xmSelectId, function (id, vals, val, isAdd, isDisabled) {
                    let hasOther = false
                    let inputDom = $('#smtModifyAttribute_rep_attrValue').find('.smtModifyAttribute-selRep-other-input')
                    vals.forEach(item => {
                        item.valueNameEn == 'Other' && (hasOther = true)
                    })
                    // 如果选择了其它，就添加input框
                    if (hasOther && !inputDom.length) {
                        let _inputDom = `<div class="layui-col-md4 smtModifyAttribute-selRep-other-input"><input class="layui-input mr10" name="other${inputDomName}" 
                        placeholder="当选择其它选项时，需要填此项"/></div>`
                        $('#smtModifyAttribute_rep_attrValue').append(_inputDom)
                        // 没有就删除
                    } else if (!hasOther && inputDom.length) {
                        inputDom.remove()
                    }

                }, true)
            },
            // 当选中某一共有属性，其属性值
            commonOneAttrsRender: function (obj) {
                var propertyDom = ""
                let _name = `${obj.required}${obj.attributeId}`
                switch (obj.attributeShowTypeValue) {
                    case 'list_box':
                        var optionItems = this.changeOptionToString(obj.categoryAttributeValuesSmts, [])
                        propertyDom = `<div class="layui-col-md8 layui-col-lg8">
                                            <select name='${_name}' attrName='${obj.attributeNameEn}'
                                                attrNameId='${obj.attributeId}'
                                                lay-filter="smtModifyAttribute_rep_selOther"
                                            >${optionItems}</select>
                                        </div>`
                        $('#smtModifyAttribute_rep_attrValue').html(propertyDom)
                        form.render('select')
                        break;
                    case 'input':
                        var dataListItems = this.changeOptionDatalist(obj) || ''
                        propertyDom = `<input class="layui-input" name='${_name}' 
                                                list='${_name}' attrValueId='${obj.attributeId}' 
                                                attrName='${obj.attributeNamEn}'  
                                            >
                                            ${dataListItems}`
                        $('#smtModifyAttribute_rep_attrValue').html(propertyDom)
                        form.render('input')
                        break;
                    case 'check_box':
                        propertyDom = `<div class="layui-col-md8 layui-col-lg8">
                                            <select id="smtModifyAttribute_checkbox_${_name}"
                                                xm-select="smtModifyAttribute_checkbox_${_name}" xm-select-search
                                                xm-select-search-type="dl" name="${_name}"
                                                xm-select-skin="normal"
                                            >
                                            </select>
                                        </div>`
                        $('#smtModifyAttribute_rep_attrValue').html(propertyDom)
                        var _categoryAttributeValuesSmts = obj.categoryAttributeValuesSmts.map(item => ({
                            name: `${item.valueNameZn}(${item.valueNameEn})`,
                            value: item.categoryAttributeValueId,
                            ...item,
                        }))
                        formSelects.data(`smtModifyAttribute_checkbox_${_name}`, 'local', { arr: _categoryAttributeValuesSmts })
                        this.monitorCommFormselect(`smtModifyAttribute_checkbox_${_name}`, _name)
                        break;
                    default:
                        break;
                }
            },

            // 一键应用
            repOneCommAttr: function () {
                $('#smtModifyAttribute_rep_attrBtn').click(function () {
                    // 选中card
                    var cardDom = $("#smtModifyAttributeForm").find('.smtModifyAttribute-card')
                        .filter((_, item) => !!$(item).find('.smtModifyAttribute-one-checked').prop('checked'))
                    if (!cardDom.length) return layer.msg('请选择要应用的商品', { icon: 0 })
                    var attrName = $("#smtModifyAttribute_rep_Form").find('select[name=attrName]').val().replace('replace', '')
                    var type = $("#smtModifyAttribute_rep_Form").find('select[name=attrName] option:selected').attr('data-type')
                    var isIncluOther = $("#smtModifyAttribute_rep_Form").find('.smtModifyAttribute-selRep-other-input')
                    var attrvalue = ''
                    var attrRepDom = ''
                    if (type == 'list_box') {
                        attrvalue = $("#smtModifyAttribute_rep_Form").find(`select[name=${attrName}]`).val()
                        attrRepDom = cardDom.find(`select[name=${attrName}]`)
                        attrRepDom.val(attrvalue)
                        // 是否有其它选项时
                        if (isIncluOther.length) {
                            var otherValue = $("#smtModifyAttribute_rep_Form").find(`input[name=other${attrName}]`).val()
                            var otherRepDom = cardDom.find(`input[name=${attrName}]`)
                            otherRepDom.length ? otherRepDom.val(otherValue)
                                : attrRepDom.parents('.smtModifyAttribute-select-block').
                                    after(`<div class="layui-col-md2 smtModifyAttribute-sel-other-input">
                                    <input class="layui-input mr10" name="${attrName}" value="${otherValue}" placeholder = "当选择其它选项时，需要填此项" />
                                    </div >`)
                        } else {
                            cardDom.find(`input[name=${attrName}]`).length && cardDom.find(`input[name=${attrName}]`)
                                .parents('.smtModifyAttribute-sel-other-input').remove()
                        }
                        form.render('select')
                    } else if (type == 'input') {
                        attrvalue = $("#smtModifyAttribute_rep_Form").find(`input[name=${attrName}]`).val()
                        attrRepDom = cardDom.find(`input[name=${attrName}]`)
                        attrRepDom.val(attrvalue)
                    } else if (type == 'check_box') {
                        attrvalue = formSelects.value(`smtModifyAttribute_checkbox_${attrName}`, 'val')
                        attrRepDom = cardDom.find(`input[name=${attrName}]`)
                        attrRepDom.prop('checked', false)
                        let otherInputDom = ''
                        Array.from(attrRepDom).forEach(item => {
                            attrvalue.forEach(elem => {
                                if ($(item).val() == elem) {
                                    $(item).attr('attrvalue') == 'Other' && (otherInputDom = $(item))
                                    return $(item).prop('checked', true)
                                }
                            })
                        })
                        // 是否有其它选项时
                        var otherRepDom = cardDom
                            .find(`input[name=${attrName}]`).filter((_, item) => {
                                return !$(item).attr('attrNameid')
                            })
                        if (isIncluOther.length) {
                            var otherValue = $("#smtModifyAttribute_rep_Form").find(`input[name=other${attrName}]`).val()
                            console.log('otherRepDom :>> ', otherRepDom);
                            otherRepDom.length ? otherRepDom.val(otherValue)
                                : otherInputDom.parents('.smtModifyAttribute-mentalProperty-checkbox ')
                                    .append(`<input class="layui-input smtModifyAttribute-checkbox-other-input mr10" name="${attrName}" 
                                    placeholder="当选择其它选项时，需要填此项"/>`)
                        } else {
                            otherRepDom.length && otherRepDom.remove()
                        }
                        form.render('checkbox')
                    }
                    layer.msg('修改成功', { icon: 1 })
                })
            },
            //#endregion 共有类目属性一键应用end

            // #region 批量修改start
            batchModify: function () {
                var _this = this
                $('#smtModifyAttribute_batchModify_btn').click(function () {
                    var cardDom = $("#smtModifyAttributeForm").find('.smtModifyAttribute-card')
                        .filter((_, item) => !!$(item).find('.smtModifyAttribute-one-checked').prop('checked'))
                    if (!cardDom.length) return layer.msg('请选择要修改的商品', { icon: 0 })
                    // 保存的数据，，
                    var data = []
                    // 勾选card的storeAcctid和itemId
                    var cardItem = []
                    Array.from(cardDom.find('.smtModifyAttribute-check-content')).forEach(item => {
                        cardItem.push({
                            itemId: $(item).attr('data-itemid'),
                            storeAcctId: $(item).attr('data-storeAcctid'),
                            dom: $(item),
                        })
                    })
                    // 选出勾选的数据
                    var _smtModifyAttr = []
                    _this.smtModifyAttr.forEach(item => {
                        var _cardItem = cardItem.filter(elem =>
                            item.storeAcctId == elem.storeAcctId && item.itemId == elem.itemId
                        )
                        _cardItem.length ? _smtModifyAttr.push({
                            ..._cardItem[0],
                            brand: item.brand,
                            attr: item.attr,
                        }) : ''
                    })

                    for (var i = 0; i < _smtModifyAttr.length; i++) {
                        // 分类属性
                        let aeopAeProductProperty = _this.batchModifySaveData(_smtModifyAttr[i].dom, _smtModifyAttr[i].attr)
                        if (Object.prototype.toString.call(aeopAeProductProperty) === '[object Array]') {
                            data.push({
                                productId: Number(_smtModifyAttr[i].itemId),
                                storeAcctId: Number(_smtModifyAttr[i].storeAcctId),
                                aeopAeProductProperty,
                            })
                        } else {
                            return layer.msg(aeopAeProductProperty)
                        }
                    }
                    console.log('data :>> ', data);
                    // 调接口
                    _this.batchModifyAjax(data)
                        .then(data => {
                            // 处理结果显示出来
                            _this.showBatchResult(data)
                        })
                        .catch(err => layer.msg(err, { icon: 2 }))

                })
            },
            // 保存数据
            batchModifySaveData: function (dom, attr) {
                var data = []
                var storeAcct = $(dom).attr('data-storeAcct')
                var itemId = $(dom).attr('data-itemId')
                //品牌(因为品牌是必填的，必有得，所以没传brand)
                if (!dom.find('select[name=true2] option:selected').attr("attrValue")) return `${storeAcct}--${itemId}  请选择品牌`
                data.push({
                    attrName: dom.find('select[name=true2] ').attr("attrName") || 'Brand Name',
                    attrNameId: dom.find('select[name=true2] ').attr("attrNameId") || '2',
                    attrValueId: dom.find('select[name=true2] option:selected').val() || '',
                    attrValue: dom.find('select[name=true2] option:selected').attr("attrValue") || '',
                })
                //分类属性
                if (Array.isArray(attr)) {
                    for (var i = 0; i < attr.length; i++) {
                        let domName = `${attr[i].required}${attr[i].attributeId}`
                        //下拉框
                        if (attr[i].attributeShowTypeValue == 'list_box') {
                            var _choosedOption = dom.find('select[name=' + domName + '] option:selected')
                            var _choosedSelected = dom.find('select[name=' + domName + ']')
                            if (!_choosedOption.val() && attr[i].required) return `${storeAcct}--${itemId}  需必选${_choosedSelected.attr("attrName")}`
                            if (!!_choosedOption.val() && _choosedOption.attr('enName') == 'Other') {
                                if (dom.find('input[name=' + domName + ']').val() == '') {
                                    dom.find('input[name=' + domName + ']').addClass('layui-form-danger').focus();
                                    setTimeout(function () {
                                        dom.find('input[name=' + domName + ']').removeClass('layui-form-danger')
                                    }, 1500);
                                    return `${storeAcct}--${itemId}  其它需要填值`
                                }
                                data.push({
                                    attrName: _choosedSelected.attr("attrName"),
                                    attrNameId: _choosedSelected.attr("attrNameId"),
                                    attrValueId: -1,
                                    attrValue: dom.find('input[name=' + domName + ']').val(),
                                }, {
                                    attrName: _choosedSelected.attr("attrName"),
                                    attrNameId: _choosedSelected.attr("attrNameId"),
                                    attrValueId: _choosedOption.val() || '',
                                })
                            } else if (!!_choosedOption.val() && _choosedOption.attr('enName') != 'Other') {
                                // 为空不传值
                                _choosedOption.attr("attrValue") != '' ?
                                    data.push({
                                        attrName: _choosedSelected.attr("attrName"),
                                        attrNameId: _choosedSelected.attr("attrNameId"),
                                        attrValueId: _choosedOption.val() || '',
                                        attrValue: _choosedOption.attr("attrValue") || '',
                                    }) : ''
                            }
                        }
                        //checkbox
                        if (attr[i].attributeShowTypeValue == 'check_box') {
                            var _choosedCheckbox = dom.find('input[name=' + domName + ']:checked')
                            var _choosedCheckboxLabel = dom.find('input[name=' + domName + ']').attr("attrName")
                            if (!_choosedCheckbox.val() && attr[i].required) return `${storeAcct}--${itemId}  需必选${_choosedCheckboxLabel}`
                            let otherPick = Array.from(_choosedCheckbox).filter(item => $(item).attr('enName') == 'Other')
                            if (otherPick.length && $(otherPick[0]).nextAll(`input[name=${domName}]`).val() == '') {
                                $(otherPick[0]).nextAll(`input[name=${domName}]`).addClass('layui-form-danger').focus();
                                setTimeout(function () {
                                    $(otherPick[0]).nextAll(`input[name=${domName}]`).removeClass('layui-form-danger')
                                }, 1500);
                                return `${storeAcct}--${itemId}  其它需要填值`
                            }
                            Array.from(_choosedCheckbox).forEach(item => {
                                if (!!$(item).val() && $(item).attr('enName') == 'Other') {
                                    data.push({
                                        attrName: $(item).attr("attrName"),
                                        attrNameId: $(item).attr("attrNameId"),
                                        attrValueId: $(item).val() || '',
                                        attrValue: $(item).nextAll(`input[name=${domName}]`).val(),
                                    })
                                } else if (!!$(item).val() && $(item).attr('enName') != 'Other') {
                                    $(item).attr("attrValue") != '' ?
                                        data.push({
                                            attrName: $(item).attr("attrName"),
                                            attrNameId: $(item).attr("attrNameId"),
                                            attrValueId: $(item).val() || '',
                                            attrValue: $(item).attr("attrValue") || '',
                                        }) : ''
                                }
                            })
                        }
                        //input
                        if (attr[i].attributeShowTypeValue == 'input') {
                            var _inputDom = dom.find(' input[name=' + domName + ']')
                            if (!_inputDom.val() && attr[i].required) return `${storeAcct}--${itemId}  需必选${_inputDom.attr("attrName")}`
                            !!_inputDom.val() ? data.push({
                                attrName: _inputDom.attr("attrName"),
                                attrNameId: _inputDom.attr("attrNameId"),
                                attrValue: _inputDom.val() || '',
                            }) : ''
                        }
                    }
                }
                // 自定义属性
                //自定义属性值
                var _customProperty = dom.find(".smtModifyAttribute-listDetailTpl-addproper").find('.detailItem').map((_, item) => ({
                    attrName: $(item).find('input[name=property]').val(),
                    attrValue: $(item).find('input[name=propertyVal]').val()
                }))
                //去重 自定义属性值的属性名不能一致
                var _customPropertyList = Array.from(_customProperty)
                var newCustomPropertyList = _customPropertyList.reduce((pre, cur) => {
                    if (pre.filter(item => item.attrName == cur.attrName).length == 0) {
                        return pre.concat(cur)
                    } else {
                        return pre
                    }
                }, [])
                if (newCustomPropertyList.length != _customPropertyList.length) return '不支持多个自定义属性名相同'
                Array.from(_customProperty).forEach(item => { (item.attrName || item.attrValue) ? data.push(item) : '' })

                return data
            },

            // 批量处理后弹窗结果显示
            showBatchResult: function (data) {
                layer.open({
                    title: `批量修改结果`,
                    id: "smtModifyAttribute_batch_resultId",
                    area: '600px',
                    content: '',
                    success: function (layero) {
                        var _data = data.map(item => ({
                            itemId: Object.keys(item),
                            result: Object.values(item),
                        }))
                        laytpl($("#smtModifyAttribute_batch_result").html()).render(_data, function (html) {
                            $(layero).find('.layui-layer-content').html(html);
                        })
                    }
                })
            },
            //#endregion 批量修改end

            //#region 接口start
            searchProdCateAndAttrAjax: function () {
                var cateAttrList = smt_arr.map(item => ({
                    id: item.id,
                    itemId: item.itemId,
                    categoryId: item.categoryId,
                    storeAcctId: item.storeAcctId
                }))
                return commonReturnPromise({
                    url: ctx + '/batchOperation/searchProdCateAndAttr',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify({ cateAttrList: cateAttrList })
                })
            },

            batchModifyAjax: function (prodCateAndAttrDtos) {
                return commonReturnPromise({
                    url: ctx + '/batchOperation/batchUpdateProdCateAndAttr',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify({ prodCateAndAttrDtos: prodCateAndAttrDtos })
                })
            }

            //#endregion 接口end
        }

        smtModifyAttributeName.searchProdCateAndAttr()
        // 共有属性  下拉框触发事件 如果选中other，就显示input框
        form.on('select(smtModifyAttribute_rep_selOther)', function (data) {
            let hasOther = false
            Array.from($(data.elem).find("option")).forEach((item, index) => {
                if ($(item).attr('attrValue') == 'Other') {
                    hasOther = true
                }
            })
            // 下拉选项含有other
            if (hasOther) {
                // 选中other添加
                if ($(data.elem).find("option:selected").attr('attrValue') == 'Other') {
                    var inputDomName = $(data.elem).attr('name')
                    var parentDom = $('#smtModifyAttribute_rep_attrValue')
                    var inputDom = `<div class="layui-col-md4 smtModifyAttribute-selRep-other-input"><input class="layui-input mr10" name="other${inputDomName}" 
                    placeholder="当选择其它选项时，需要填此项"/></div>`
                    parentDom.append(inputDom)
                } else {  //选中其它的就删除
                    var parentDom = $('#smtModifyAttribute_rep_attrValue')
                    var inputDom = parentDom.find('.smtModifyAttribute-selRep-other-input')
                    inputDom.remove()
                }
            }
        })
        // checkbox触发事件 如果选中other，就显示input框
        form.on('checkbox(smtModifyAttribute_checkOtheb_input)', function (data) {
            if ($(data.elem).attr('attrValue') == "Other") {
                if (data.elem.checked) {
                    var inputDomName = $(data.elem).attr('name')
                    var parentDom = $(data.elem).parents('.smtModifyAttribute-mentalProperty-checkbox')
                    var inputDom = `<input class="layui-input smtModifyAttribute-checkbox-other-input mr10" name="${inputDomName}" 
                    placeholder="当选择其它选项时，需要填此项"/>`
                    parentDom.append(inputDom)

                } else {
                    var parentDom = $(data.elem).parents('.smtModifyAttribute-mentalProperty-checkbox')
                    var inputDom = parentDom.find('.smtModifyAttribute-checkbox-other-input')
                    inputDom.length && inputDom.remove()
                }
            }
        })
        // 下拉框触发事件 如果选中other，就显示input框
        form.on('select(smtModifyAttribute_selOtheb_input)', function (data) {
            let hasOther = false
            Array.from($(data.elem).find("option")).forEach((item, index) => {
                if ($(item).attr('attrValue') == 'Other') {
                    hasOther = true
                }
            })
            // 下拉选项含有other
            if (hasOther) {
                // 选中other添加
                if ($(data.elem).find("option:selected").attr('attrValue') == 'Other') {
                    var inputDomName = $(data.elem).attr('name')
                    var parentDom = $(data.elem).parents('.smtModifyAttribute-select-block')
                    var inputDom = `<div class="layui-col-md2 smtModifyAttribute-sel-other-input"><input class="layui-input mr10" name="${inputDomName}" 
                    placeholder="当选择其它选项时，需要填此项"/></div>`
                    parentDom.after(inputDom)
                } else {  //选中其它的就删除
                    var parentDom = $(data.elem).parents('.smtModifyAttribute-select-block')
                    var inputDom = parentDom.next('.smtModifyAttribute-sel-other-input')
                    inputDom.remove()
                }
            }
        });
        smtModifyAttributeName.checkedStore()
        smtModifyAttributeName.batchModify()

    });
})(jQuery, layui, window, document);

// 品牌同步
function smtModifyAttribute_sync_brand(dom, isrequired) {
    var storeAcctId = $(dom).parents('.smtModifyAttribute-check-content').attr('data-storeAcctId')
    var smtCategoryId = $(dom).attr('data-categoryid')
    commonReturnPromise({
        url: ctx + '/aliexpress/template/manualSyncCategoryBrand.html',
        params: { storeAcctId, smtCategoryId: smtCategoryId },
    }).then((data) => {
        if (data.length == 0) {
            layui.layer.msg('该类目下无品牌选项')
        } else {
            var optionDoms = smtModifyAttribute_changeOptionToString(data, [])
            $(dom).parents('.smtModifyAttribute-cagprop').find("select[name=" + isrequired + "2]").html(optionDoms)
            layui.form.render()
        }
    }).catch((err) => layui.layer.msg(err || err.message))
}

// 下拉框
function smtModifyAttribute_changeOptionToString(obj, checkedData) {
    var arr = '<option value="">请选择</option>'
    if (Array.isArray(obj) && obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (obj.valueNameEn == 'Other') {
                arr += `<option value='${obj[i].categoryAttributeValueId}' attrValue='${obj[i].valueNameEn}'
                enName='${obj[i].valueNameEn}'
                ${checkedData.filter(item => item.attrValueId == obj[i].categoryAttributeValueId || !item.attr).length ? 'selected' : ''} 
            >
                ${obj[i].valueNameZn}(${obj[i].valueNameEn})
            </option>`
            } else {
                arr += `<option value='${obj[i].categoryAttributeValueId}' attrValue='${obj[i].valueNameEn}'
                            enName='${obj[i].valueNameEn}'
                            ${checkedData.filter(item => item.attrValueId == obj[i].categoryAttributeValueId || !item.attr).length ? 'selected' : ''}
                        >
                            ${obj[i].valueNameZn}(${obj[i].valueNameEn})
                        </option>`
            }
        }
    }
    return arr
}
//#region 显示和隐藏start
// 点击面板的
// 隐藏
function smtModifyAttribute_hide(dom) {
    $(dom).addClass('hidden')
    var parent = $(dom).parents('.smtModifyAttribute-card')
    parent.find('.smtModifyAttribute-toShowIcon').removeClass('hidden')
    parent.find('.layui-card-content').removeClass('hidden')
}
//show content
function smtModifyAttribute_show(dom) {
    $(dom).addClass('hidden')
    var parent = $(dom).parents('.smtModifyAttribute-card')
    parent.find('.smtModifyAttribute-tohideIcon').removeClass('hidden')
    parent.find('.layui-card-content').addClass('hidden')
}

// 选填属性是否展示
function smtModifyAttribute_showMoreProperty(dom) {
    var _dom = $(dom).parents('.smtModifyAttribute-cagprop-more-label').next('.smtModifyAttribute-cagprop-more')
    _dom.css('display') == 'none' ? _dom.show() : _dom.hide()
}
//#endregion 显示和隐藏end

//#region 自定义属性相关事件触发start
// 添加自定义属性
function smtModifyAttribute_addProper(dom) {
    var propertyOwnDom = `<div class="layui-row m-top10 detailItem">
                                <div class="layui-col-md2"><input class="layui-input" type="text" name="property"></div>
                                <div class="layui-col-md3 ml10"><input class="layui-input" type="text" name="propertyVal"></div>
                                <div class="layui-col-md3 ml10">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" onclick="smtModifyAttribute_delProperOwn(this)">删除</button>
                                </div>
                            </div>`

    $(dom).parents('.smtModifyAttribute-listDetailTpl').find('.smtModifyAttribute-listDetailTpl-addproper').append(propertyOwnDom)
}
//自定义属性：删除全部
function smtModifyAttribute_delProper(dom) {
    var rowDoms = $(dom).parents('.smtModifyAttribute-listDetailTpl').find('.smtModifyAttribute-listDetailTpl-addproper').find('.layui-row')
    rowDoms.length && rowDoms.remove('')

}

//自定义属性：删除单个
function smtModifyAttribute_delProperOwn(dom) {
    $(dom).closest(".layui-row").remove()
}
//#endregion 自定义属性相关事件触发end
