var smt_searchMember
layui.use(['admin', 'table', 'form', 'layer', 'laytpl', 'formSelects', 'upload'], function () {
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        upload = layui.upload,
        formSelects = layui.formSelects,
        form = layui.form;

    smt_searchMember = function (name,t) {
        if (typeof (name) == undefined) {
            return;
        }
        showMembers(name);
        divCheckedStyle(t);
    }

    function showMembers(name) {
        if(name == 'treeBody1'){
            $(".treeBody1").show()
            $(".treeBody2").hide()
        }else{
            $(".treeBody1").hide()
            $(".treeBody2").show()
        }
    }

    function divCheckedStyle(v) {
        $("#smtpublictemplate_tree .layui-this").removeClass("layui-this");
        $(v).closest('li').addClass('layui-this');
    }

    render_hp_orgs_users("#smtpublictemplate_form");
    form.render();
    //定义速卖通公共模板命名空间
    var smtpublictemplateName = {
        // 常量
        AdjustPriceTypeEnum:{
            1:'百分比调价',
            2:'金额调价',
        },
        ProdQualificationEnum:[],
        // 初始化
        init: function () {
            // 创建人
            this.creatorAjax()
                .then(data => {
                    commonRenderSelect('smtpublictemplate_creatorId', data, { name: 'creator', code: 'creator_id' })
                })
                .then(() => form.render())
                .catch(err => layer.msg(err, { icon: 2 }))

            // 查询条件资质名称
            let _this = this
            formSelects.render('prodQualifyName')
            // 当前表格存在的资质名称，然后去重后的数据
            commonReturnPromise({
                url: ctx + '/smtQualificationsTemplate/getExistQualifications'
            }).then(res => {
                let prodQualify = [];
                res.forEach(item => {
                    prodQualify.push({name: item.label, value:item.qualificationKey});
                })
                formSelects.data('prodQualifyName','local',{arr:prodQualify})
            })
            // 资质名称全部数据
            commonReturnPromise({
                url: ctx + '/smtQualificationsTemplate/getAllQualifications'
            }).then(res => {
                _this.ProdQualificationEnum = res;
            })
        },
        // 搜索
        search: function () {
            var _this = this
            $('#smtpublictemplate_search_submit').click(function () {
                var param = serializeObject($('#smtpublictemplate_form'))
                Object.keys(param).forEach(item => {
                    param[item] == '' && delete param[item]
                })
                _this.tableRender({ roleNames: 'smt专员', ...param })

            })
        },
        // 搜索
        search_product: function () {
            var _this = this
            $('#smtpublictemplate_search_prod').click(function () {
                var param = serializeObject($('#smtpublictemplate_form_prod'))
                _this.tableRender_productTable({ name: param.tplName, qualificationKeys: param.key == ''?[]: param.key.split(",") })
            })
        },
        tableRender: function (data) {
            var _this = this;
            table.render({
                elem: '#smtpublictemplate_table'
                , url: '/lms/smtRegionPrice/listAll.html' //数据接口
                , where: data
                , page: true //开启分页
                , cols: [[ //表头
                    {field: 'templateName', title: '模板名称'}
                    , {field: 'adjustPriceType', templet: '#smtpublictemplate_type', title: '调价方式'}
                    , {field: 'adjustPriceStr', templet: '#smtpublictemplate_value', title: '调价值',}
                    , {
                        field: 'storeAcct', title: '适用店铺', templet: function (d) {  //保留20个字符，有需要折叠展开
                            if (d.storeAcct && d.storeAcct.length > 20) {
                                let _storeAcct = d.storeAcct
                                let _str = `<span>
                                            <span>${_storeAcct.substr(0, 20)}</span>
                                            <span class="myj-hide">${_storeAcct.substr(20, _storeAcct.length - 1)}</span>
                                            </span>
                                            <a href="javascript:" class="productListSkuShow smtpublictemplate-changeColspan">+ 展开</a>
                                            `
                                return _str
                            }
                            return d.storeAcct || ''
                        }
                    }
                    , {field: 'creator', title: '创建人'}
                    , {
                        field: 'createTime',
                        title: '创建时间',
                        templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'
                    }
                    , {title: '操作', align: 'center', toolbar: '#smtpublictemplate_tableIdBar'}
                ]]
                , id: "smtpublictemplate_tableId"
                , limits: [50, 100, 300]
                , limit: 50
                , done: function () {
                    _this.watchBar();
                    _this.changeColspan()
                }
            });
        },tableRender_productTable: function (data) {
            var _this = this;
            table.render({
                elem: '#smtpublictemplate_productTable'
                , url: '/lms/smtQualificationsTemplate/queryTemp' //数据接口
                , method: "POST"
                , contentType:"application/json"
                , where: data
                , page: true //开启分页
                , cols: [[ //表头
                    { field: 'name', title: '模板名称' }
                    ,{ field: 'label', title: '资质名称' }
                    , { field: 'storeAcct', title: '资质图片/资质文本', templet: function (d) {
                            if (d.qualificationType == 'image') {
                                return `<img width="60" height="60" data-url="${d.qualificationValue}" src="${d.qualificationValue}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>`
                            } else {
                                return d.qualificationValue || ''
                            }
                        }
                    }
                    , { field: 'createTime', title: '操作人', templet: function (d) { return `<div>创建人：${d.creator} ${d.createTime}</div><div>修改人：${d.modifier} ${d.modifyTime}</div>` }}
                    , { title: '操作', align: 'center', toolbar: '#smtpublictemplate_productTableBar' }
                ]]
                , id: "smtpublictemplate_productTable"
                , limits: [50, 100, 300]
                , limit: 50
                , done: function () {
                    _this.watchBar_prod();
                    // _this.changeColspan()
                }
            });
        },
        watchBar_prod: function (){
            var _this = this;
            table.on('tool(smtpublictemplate_productTable)', function (obj) {
                var dataObj = obj.data;
                if (obj.event == 'edit') { //编辑功能
                    let newModifyProdIndex = layer.open({
                        type: 1,
                        title: '编辑商品资质模板',
                        area: ['600px', '600px'],
                        btn: ['保存', '关闭'],
                        id: 'smtpublictemplate_productLayerId',
                        content: $('#smtpublictemplate_productLayer').html(),
                        success: function (layero, index) {
                            let str = '<option value=""></option>';
                            _this.ProdQualificationEnum.forEach(item => {
                                str += `<option value="${item.qualificationKey}">${item.label}</option>`;
                            })
                            $(layero).find("[name=prodQualifyName]").html(str)
                            form.render();

                            $(layero).find("[name=prodQualifyName]").val(dataObj.qualificationKey)
                            $(layero).find(".id").val(dataObj.id)
                            $(layero).find(".name").val(dataObj.name)

                            $(layero).find(".label").val(dataObj.label)
                            $(layero).find(".qualificationKey").val(dataObj.qualificationKey)
                            $(layero).find(".qualificationType").val(dataObj.qualificationType)
                            dataObj["tips"] = (_this.ProdQualificationEnum.filter(i=>i.qualificationKey == dataObj.qualificationKey))[0].tips
                            var formTemplate = smtpublictemplate_productLayer_formTpl.innerHTML;
                            var formDiv = document.getElementById('smtpublictemplate_productLayer_prodQualifyCon');
                            laytpl(formTemplate).render(dataObj, function (html) {
                                formDiv.innerHTML = html;
                                _this.smtUpload()
                                form.render()
                            });
                        },
                        yes: function (index, layero) {
                            let obj = {
                                "id": $(layero).find(".id").val(),
                                "name":$(layero).find(".name").val(),
                                "label": $(layero).find(".label").val(),
                                "qualificationType": $(layero).find(".qualificationType").val(),
                                "qualificationKey": $(layero).find("[name=prodQualifyName]").val(),
                                "qualificationValue": $(layero).find(".qualification-Val").val()
                            }
                            if(obj.qualificationValue == "undefined"){
                                return layer.msg("请上传或输入商品资质信息",{icon:2})
                            }
                            commonReturnPromise({
                                url: ctx + '/smtQualificationsTemplate/modifyTemp',
                                contentType: 'application/json',
                                type: 'post',
                                params: JSON.stringify(obj)
                            }).then(res => {
                                layer.msg(res || "操作成功",{icon:1})
                                layer.close(newModifyProdIndex)
                                $('#smtpublictemplate_search_prod').click()
                            })
                        }
                    });
                } else if (obj.event == 'del') {
                    layer.confirm('确认删除吗?', function (index) {
                        $.ajax({
                            type: 'DELETE',
                            dataType: 'json',
                            url: '/lms/smtQualificationsTemplate/removeTemp',
                            data: { id: dataObj.id },
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                if (res.code == '0000') {
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    obj.del()  //删除对应行（tr）的DOM结构，并更新缓存
                                    // _this.tableRender();
                                } else {
                                    layer.msg(res.msg);
                                };
                            },
                            error: function () {
                                loading.hide();
                                layer.msg('服务器出错啦!');
                            }
                        })
                    });
                }
            });
        },watchBar: function () {
            var _this = this;
            table.on('tool(smtpublictemplate_tableFilter)', function (obj) {
                var dataObj = obj.data;
                if (obj.event == 'edit') { //编辑功能
                    layer.open({
                        type: 1,
                        title: '新增区域调价',
                        area: ['800px', '600px'],
                        btn: ['保存', '关闭'],
                        id: 'smtpublictemplate_newAddLayerId',
                        content: $('#smtpublictemplate_newAddLayer').html(),
                        success: function (layero, index) {
                            _this.getCountries().then(function (result) {
                                dataObj.countries = result;
                                var formTemplate = smtpublictemplate_newAddLayer_formTpl.innerHTML;
                                var formDiv = document.getElementById('smtpublictemplate_newAddLayer_form');
                                laytpl(formTemplate).render(dataObj, function (html) {
                                    formDiv.innerHTML = html;
                                    dataObj.templateType == 2 && $("#smtpublictemplate_newAddLayer_form").find('textarea[name=storeAcct]').text(dataObj.storeAcct || '')
                                    dataObj.templateType == 1 && $('#smtpublictemplate_storeUseTpl').hide()
                                    form.render();
                                    _this.ckSelHandle(dataObj); //监听slect和checkbox操作
                                    _this.monitorPublicTpl()
                                });
                            })
                        },
                        yes: function (index, layero) {
                            _this.ajaxData(layero, index, obj);
                        }
                    });
                } else if (obj.event == 'del') {
                    layer.confirm('确认删除吗?', function (index) {
                        $.ajax({
                            type: 'get',
                            dataType: 'json',
                            url: '/lms/smtRegionPrice/delete.html',
                            data: { id: dataObj.id },
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                if (res.code == '0000') {
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    obj.del()  //删除对应行（tr）的DOM结构，并更新缓存
                                    // _this.tableRender();
                                } else {
                                    layer.msg(res.msg);
                                };
                            },
                            error: function () {
                                loading.hide();
                                layer.msg('服务器出错啦!');
                            }
                        })
                    });
                }
            });
        },
        // 折叠展开
        changeColspan: function () {
            $('.smtpublictemplate-changeColspan').click(function () {
                $(this).prev().find(".myj-hide").toggle();  //切换 <p> 元素的显示与隐藏状态
                $(this).html().indexOf("展开") > -1 ? $(this).html("- 收起") : $(this).html("+ 展开")
            })
        },
        newAdd: function () { //新增区域调价模板
            var _this = this;
            var defaultData = {
                'templateName': '',
                'adjustPriceType': 1, //调价方式,默认比例调价
                'adjustPriceStr': ''
            };
            $('#smtpublictemplate_newAdd').on('click', function () {
                layer.open({
                    type: 1,
                    title: '新增区域调价',
                    area: ['800px', '600px'],
                    btn: ['保存', '关闭'],
                    id: 'smtpublictemplate_newAddLayerId',
                    content: $('#smtpublictemplate_newAddLayer').html(),
                    success: function (layero, index) {
                        _this.getCountries().then(function (result) {
                            defaultData.countries = result;
                            var formTemplate = smtpublictemplate_newAddLayer_formTpl.innerHTML;
                            var formDiv = document.getElementById('smtpublictemplate_newAddLayer_form');
                            laytpl(formTemplate).render(defaultData, function (html) {
                                formDiv.innerHTML = html;
                                $('#smtpublictemplate_storeUseTpl').hide()
                                form.render();
                                _this.ckSelHandle(defaultData); //监听slect和checkbox操作
                                _this.monitorPublicTpl()
                            });
                        })
                    },
                    yes: function (index, layero) {
                        _this.ajaxData(layero, index);
                    }
                });
            });
        },newAddProd: function () { //新增区域调价模板
            var _this = this;
            $('#smtpublictemplate_add_prod').on('click', function () {
                let newAddProdIndex = layer.open({
                    type: 1,
                    title: '新增商品资质模板',
                    area: ['600px', '600px'],
                    btn: ['保存', '关闭'],
                    id: 'smtpublictemplate_productLayerId',
                    content: $('#smtpublictemplate_productLayer').html(),
                    success: function (layero, index) {
                        let str = '<option value=""></option>';
                        _this.ProdQualificationEnum.forEach(item => {
                            str += `<option value="${item.qualificationKey}">${item.label}</option>`;
                        })
                        $(layero).find("[name=prodQualifyName]").html(str)
                        form.render();
                    },
                    yes: function (index, layero) {
                        let obj = {
                            "name":$(layero).find(".name").val(),
                            "label": $(layero).find(".label").val(),
                            "qualificationType": $(layero).find(".qualificationType").val(),
                            "qualificationKey": $(layero).find("[name=prodQualifyName]").val(),
                            "qualificationValue": $(layero).find(".qualification-Val").val()
                        }
                        if(obj.qualificationValue == "undefined"){
                            return layer.msg("请上传或输入商品资质信息",{icon:2})
                        }
                        // _this.ajaxData(layero, index, obj);
                        commonReturnPromise({
                            url: ctx + '/smtQualificationsTemplate/addTemp',
                            contentType: 'application/json',
                            type: 'post',
                            params: JSON.stringify(obj)
                        }).then(res => {
                            layer.msg(res || "操作成功",{icon:1})
                            layer.close(newAddProdIndex)
                            $('#smtpublictemplate_search_prod').click()
                        })
                    }
                });
            });
            form.on("select(smtpublictemplate_filter_prodQualifyName)",function(data){
                let selectData = _this.ProdQualificationEnum.filter(item => data.value == item.qualificationKey)
                if(selectData.length != 0){
                    var formTemplate = smtpublictemplate_productLayer_formTpl.innerHTML;
                    var formDiv = document.getElementById('smtpublictemplate_productLayer_prodQualifyCon');
                    laytpl(formTemplate).render(selectData[0], function (html) {
                        formDiv.innerHTML = html;
                        _this.smtUpload()

                        $(data.elem).parents("#smtpublictemplate_product_tableTool").find(".label").val(selectData[0].label)
                        $(data.elem).parents("#smtpublictemplate_product_tableTool").find(".qualificationKey").val(selectData[0].qualificationKey)
                        $(data.elem).parents("#smtpublictemplate_product_tableTool").find(".qualificationType").val(selectData[0].qualificationType)
                    });
                }
            })
        }, smtUpload: function(){
            let smtpubtem_uploadListIns = upload.render({
                elem: `.qualification-upload`
                , auto: false //选择文件后不自动上传
                , accept: 'images'
                , number: 1 // 设置同时可上传的文件数量
                ,choose: function (obj) {
                    loading.show()
                    // 清空历史上传文件，解决choose只执行一次的问题！！！
                    smtpubtem_uploadListIns.config.elem.next()[0].value = '';
                    let that = this;
                    obj.preview(function (index, file, result) {
                        $.ajax({
                            type: "POST",
                            url: "/lms/preProdDev/getBase64Img.html",
                            data: { AreaImgKey: result },
                            async: false,
                            success: function (resUrl) {
                                let resStr = `<img width="60" height="60" data-url="${resUrl}" src="${resUrl}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>`
                                $(that.elem).parent().find(`.ml10`).html(resStr)
                                $(that.elem).parent().find(`.qualification-Val`).val(resUrl)
                                loading.hide()
                                layer.msg("操作成功", { icon: 1 });
                            },
                            error: function (err) {
                                loading.hide()
                                layer.msg("操作失败", { icon: 2 });
                            },
                        });
                    })
                }
            });
        }, ckSelHandle: function (defaultData) {
            //监听select的选中事件
            var type = defaultData.adjustPriceType;
            form.on('select(adjustPriceTypeFilter)', function (data) {
                if (data.elem.value == type) {
                    console.log('选项未发生变化');
                } else {
                    console.log('选项发生变化');
                    var $ckes = $('.smt_checkboxes').find('[type=checkbox]');
                    for (var i = 0; i < $ckes.length; i++) {
                        var $item = $($ckes[i]);
                        $item.removeAttr('checked');
                    };
                    form.render('checkbox');
                    $('#modifyPriceDetailTr').empty();
                    type = data.elem.value;
                }
            });
            //监听form.checkbox选中事件
            var $tr = $('#modifyPriceDetailTr');
            form.on('checkbox', function (data) {
                var dom = data.elem;
                var id = $(dom).attr('name');
                var title = $(dom).attr('title');
                if (type == 1) {
                    var $td = `<td id="modifyPriceDetail${id}">
                                                <div>${title}</div>
                                                <div><input type="number" class="layui-input" data-name="${title}" name="${id}">
                                                <span style="position:absolute;right:0;top:36px;">%</span>
                                                </div>
                                            </td>`;
                } else {
                    var $td = `<td id="modifyPriceDetail${id}">
                                                <div>${title}</div>
                                                <div><input type="number" class="layui-input" data-name="${title}" 
                                                name="${id}"></div>
                                            </td>`;
                }
                if (dom.checked) { //如果是选中状态
                    $tr.append($td);
                } else {
                    var domId = '#modifyPriceDetail' + id;
                    $(domId).remove();
                }
            });
        },
        ajaxData: function (layero, index, trObj = {}) {  //点击yes按钮以后执行的函数, trObj为空表示编辑，不为空表示新增
           let adjustPriceEmptyflag  =false  //判断调价值是否为空的
            var _this = this;
            var obj = {}; //定义一个空对象
            if (layero.find('[name=id]').length > 0) { //>0表示修改 =0表示新增
                obj.id = layero.find('[name=id]').val();
            };
            obj.adjustPriceType = layero.find('[name=adjustPriceType] option:selected').val();
            obj.templateName = layero.find('[name=templateName]').val();
            obj.templateType = layero.find('[name=templateType]:checked').val();
            obj.storeAcct = obj.templateType == 2 ? layero.find('[name=storeAcct]').val() : '';
            var tds = layero.find('#modifyPriceDetailTr td');
            var adjustPriceArr = [];
            for (var i = 0; i < tds.length; i++) {
                var $td = $(tds[i]);
                var tdObj = {};
                tdObj.name = $td.find('input').data('name');
                tdObj.code = $td.find('input').attr('name');
                tdObj.value = $td.find('input').val();
                tdObj.value==='' && (adjustPriceEmptyflag =true)
                adjustPriceArr.push(tdObj);
            }
            if(adjustPriceEmptyflag) return  layer.msg('调价不能为空!')
            obj.adjustPriceStr = JSON.stringify(adjustPriceArr);
            if (obj.templateName == '') {
                layer.msg('模板名称不能为空!');
                layero.find('[name=templateName]').addClass('layui-form-danger').focus();
                setTimeout(function () {
                    layero.find('[name=templateName]').removeClass('layui-form-danger')
                }, 1500);
                return false;
            };
            if (!obj.templateType) {
                layer.msg('模板类型不能为空!');
                layero.find('[name=templateTypeAll]').css('border', '1px solid red');
                setTimeout(function () {
                    layero.find('[name=templateTypeAll]').css('border', '')
                }, 1500);
                return false;
            };
            if (obj.templateType == '2' && obj.storeAcct == '') {
                layer.msg('使用店铺不能为空!');
                layero.find('[name=storeAcct]').addClass('layui-form-danger').focus();
                setTimeout(function () {
                    layero.find('[name=storeAcct]').removeClass('layui-form-danger')
                }, 1500);
                return false;
            };
            $.ajax({
                type: 'post',
                url: '/lms/smtRegionPrice/saveOrUpdate.html',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(obj),
                beforeSend: function () {
                    loading.show();
                },
                success: function (res) {
                    loading.hide();
                    if (res.code == "0000") {
                        layer.close(index);
                        layer.msg(res.msg);
                        // trObj不为空表示编辑，不刷新table
                        if ($.isEmptyObject(trObj)) {
                            _this.tableRender()
                        } else {
                            let adjustPriceStrList = JSON.parse(obj.adjustPriceStr)
                            trObj.update({ ...obj, adjustPriceStrList })
                            // 调价值
                            let _adjustPriceStr = _this.tableAdjustPriceStrList(adjustPriceStrList, obj.adjustPriceType)
                            trObj.tr.find('td .smtpublictemplate-value-div').html(_adjustPriceStr)
                            // 和店铺修改
                            let _storeAcctVal = _this.tableStoreAcctStr(obj.storeAcct)
                            trObj.tr.find('td[data-field="storeAcct"] div').html(_storeAcctVal)
                            // 调价方式 
                            trObj.tr.find('td[data-field="adjustPriceType"] div span').html(_this.AdjustPriceTypeEnum[obj.adjustPriceType])

                            _this.changeColspan()
                        }
                        //同步更新缓存对应的值
                    } else {
                        layer.msg(res.msg);
                    }
                },
                error: function () {
                    layer.close(index);
                    layer.msg('服务器出错啦!');
                }
            });
        },
        // table的调价值   保留三行，折叠展开
        tableAdjustPriceStrList: function (arr, type) {
            if (arr && arr.length) {
                let aTag = arr.length > 3 ?
                    '<a href="javascript:" class="productListSkuShow smtpublictemplate-changeColspan" style="float:right;">+ 展开</a>'
                    : ''
                let pStr = ''
                arr.forEach((item, index) => {
                    pStr += `<p class="${index > 2 ? 'myj-hide' : ''}"><span>${item.name}${type == 1 ? '' : (item.code)}:</span><span>${item.value}${type == 1 ? '%':''}</span></p>`
                })
                return `<div>${pStr}</div>${aTag}`
            }
            return ''
        },
        // table的适用店铺  保留20个字符，有需要折叠展开
        tableStoreAcctStr: function (storeAcct) {
            if (storeAcct && storeAcct.length > 20) {
                let _storeAcct = storeAcct
                let _str = `<span>
                            <span>${_storeAcct.substr(0, 20)}</span>
                            <span class="myj-hide">${_storeAcct.substr(20, _storeAcct.length - 1)}</span>
                            </span>
                            <a href="javascript:" class="productListSkuShow smtpublictemplate-changeColspan">+ 展开</a>
                            `
                return _str
            }
            return storeAcct || ''
        },
        getCountries: function () { //获取所有的国家信息
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/smtRegionPrice/queryCountry.html',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        if (res.code = "0000") {
                            resolve(res.data);
                        } else {
                            reject(res.msg);
                        };
                    },
                    error: function () {
                        loading.hide();
                        reject('服务器出错啦,和前端没有关系!');
                    }
                })
            });
        },
        monitorPublicTpl: function () {    // 新增和编辑弹窗的模板类型与适用店铺的联动
            var _this = this
            form.on('radio(smtpublictemplate_publicTpl)', function (data) {
                _this.renderUseStore(data.value)
            })
        },
        renderUseStore: function (data) {
            data == 2 && $('#smtpublictemplate_storeUseTpl').show()
            data == 1 && $('#smtpublictemplate_storeUseTpl').hide()
        },
        creatorAjax: function () {
            return commonReturnPromise({
                url: ctx + '/smtRegionPrice/getCreatorList.html'
            })
        }
    };

    // 默认渲染表格
    smtpublictemplateName.tableRender()
    // 初始化数据
    smtpublictemplateName.init()
    // 搜索
    smtpublictemplateName.search()
    //新增区域调价模板
    smtpublictemplateName.newAdd();
    smtpublictemplateName.tableRender_productTable()
    // 搜索
    smtpublictemplateName.search_product()
    //新增商品资质
    smtpublictemplateName.newAddProd();
});