layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var form = layui.form;
    if (modifyTitle_arr.length > 0) {
        var data = modifyTitle_arr.map(function(item) {
            var { itemId, storeAcctId, storePSku } = item
            return { itemId, storeAcctId, storePSku }
        })
    }
    var app = new Vue({
        el: '#modifydescripe',
        data: {
            items: [],
            isAll: false
        },
        created() {
            this.getDescript(JSON.stringify(data))
        },
        mounted() {
            form.render()
            this.checkAll()
            this.asyncCheckAll()
        },
        computed: {},
        methods: {
            checkAll() { //全选反选
                _this = this
                form.on('checkbox(chenckall)', function(data) {
                    _this.isAll = data.elem.checked
                    if (data.elem.checked) {
                        for (var i in _this.items) {
                            if (!_this.items[i].listingStyleId) {
                                _this.items[i].ischecked = false
                                _this.isAll = false
                                data.elem.checked = false
                                layer.msg(_this.items[i].itemId + '刊登风格必选');
                                setTimeout(function() {
                                    data.othis.removeClass('layui-form-checked').addClass('layui-unselect')
                                }, 0)
                                return false;
                            }
                            _this.items[i].ischecked = true
                        }
                    } else {
                        for (var i in _this.items) {
                            _this.items[i].ischecked = false
                        }
                    }
                    setTimeout(function() {
                        form.render()
                    }, 0)
                });

            },
            asyncCheckAll() { //  同步全选反选
                var _this = this
                form.on('checkbox(itemCheckbox)', function(data) {
                    var i = $(data.elem).attr('data-index')
                    _this.items[i].ischecked = data.elem.checked
                    if (data.elem.checked) {
                        if (!_this.items[i].listingStyleId) {
                            _this.items[i].ischecked = false
                            layer.msg(_this.items[i].itemId + '刊登风格必选');
                            setTimeout(function() {
                                data.othis.removeClass('layui-form-checked').addClass('layui-unselect')
                            }, 0)
                            return false;
                        }
                        for (var j in _this.items) {
                            if (!_this.items[j].ischecked) {
                                _this.isAll = false
                                return false
                            } else {
                                _this.isAll = true
                            }
                        }
                    } else {
                        _this.isAll = false
                    }
                    setTimeout(function() {
                        form.render('checkbox')
                    }, 0)
                });
            },
            renderAllEditor(index, data, params) { //渲染所有的富文本编辑器
                _this.items[index].editor = wangEditorRender('wangeditor' + index, data, params)
            },

            initAjax(url, method, data, func, contentType) { //初始化ajax请求
                $.ajax({
                    type: method,
                    url: ctx + url,
                    dataType: 'json',
                    async: true,
                    data: data,
                    contentType: contentType || 'application/json',
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            func(returnData)
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                            layer.close(index);
                        }
                    },
                    error: function(returnData) {
                        layui.admin.load.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                })
            },
            preScan(itemindex) { //预览  
                var _this = this;
                if (_this.items[itemindex].listingStyleId) {
                    var url = ctx + "/ebaylisting/previewStyleInBatchModify.html";
                    var data = {
                        title: this.items[itemindex].title,
                        listingStyleId: this.items[itemindex].listingStyleId,
                        assiFieldInfoId: this.items[itemindex].assiFieldInfoId,
                        description: this.items[itemindex].editor.txt.html()
                    };
                    submitForm(data, url, "_blank");
                } else {
                    layer.msg('刊登风格必选')
                }
            },
            chooseStyle(itemindex) { //选择刊登风格弹框
                var _this = this;
                var index = layer.open({
                    type: 1,
                    title: '选择风格',
                    area: ['1000px', '660px'],
                    btn: ['保存', '关闭'],
                    content: $('#ebayPublish_selStyleLayer').html(),
                    success: function(layero, index) {
                        _this.initAjax('/ebaylisting/liststylecate.html', 'post', {}, function(returnData) {
                            var cates = returnData.data;
                            $('.ebayPublishStyleLeftBar').empty();
                            for (var i = 0; i < cates.length; i++) {
                                var tpl = "<div data-id=':id' class='hoverBgColor'>:cateCnName</div>";
                                tpl = tpl.replace(":id", cates[i].id);
                                tpl = tpl.replace(":cateCnName", cates[i].cateCnName);
                                $('.ebayPublishStyleLeftBar').append(tpl);
                                $('.ebayPublishStyleLeftBar').on('click', '.hoverBgColor', function() {
                                    $(this).addClass('clickBgColor')
                                    $(this).siblings().removeClass('clickBgColor')
                                })
                            }
                            //请求风格
                            $(".ebayPublishStyleLeftBar>div").click(function() {
                                var cateId = $(this).data('id');
                                layui.admin.load.show();
                                _this.initAjax('/ebaylisting/liststyle.html', 'post', { cateId },
                                    function(returnData) {
                                        layui.admin.load.hide()
                                        var styles = returnData.data;
                                        $('.ebayPublishStyleRightTem ul').empty();
                                        for (var i = 0; i < styles.length; i++) {
                                            var tpl = "<li><img src=':imgUri' data-id=':id' alt=':name'><br><span>:name</span></li>";
                                            tpl = tpl.replace(":imgUri", styles[i].imgUri);
                                            tpl = tpl.replace(":id", styles[i].id);
                                            tpl = tpl.replace(/:name/g, styles[i].name);
                                            $('.ebayPublishStyleRightTem ul').append(tpl);
                                        }
                                        //增加触发事件
                                        $('.ebayPublishStyleRightTem ul li').click(function() {
                                            $(this).siblings().find('img').removeClass('et_activeStyle');
                                            if ($(this).find('img').hasClass('et_activeStyle')) {
                                                $(this).find('img').removeClass('et_activeStyle');
                                            } else {
                                                $(this).find('img').addClass('et_activeStyle');
                                            }
                                        })
                                    }, 'application/x-www-form-urlencoded')
                            });
                        })
                    },
                    yes: function() {
                        var img = $('img.et_activeStyle')
                        if (!img[0]) {
                            layer.alert('请选择一个刊登风格')
                            return false
                        }
                        var src = img.attr('src'),
                            txt = img.attr('alt'),
                            styleId = img.attr('data-id')
                        $('#et_moduleStyle').attr('src', src)
                        _this.items[itemindex].listingStyleId = styleId
                        _this.items[itemindex].publishStyleTxt = txt
                        $('.et_moduleStyleDesc').val(txt)
                        $("#ebayPulish_listDetailForm input[name=listingStyleId]").val(styleId);
                        layer.close(index)
                    }
                })
                return false;
            },
            getDescript(data) {
                var _this = this
                this.initAjax('/onlineProductEbay/searchDescriptions.html', 'post', data, function(returnData) {
                    for (var i in returnData.data) {
                        var initdatades = {
                            id: "",
                            name: "",
                            assiFieldInfoId: "",
                            assiFieldEbayInfos: null,
                            itemId: "",
                            listingStyleId: "",
                            storeAcctId: "",
                            storeAcct: "",
                            title: "",
                            ischecked: false,
                            publishStyleTxt: "",
                            description: ""
                        }
                        returnData.data[i] = Object.assign(initdatades, returnData.data[i])
                    }
                    _this.items = returnData.data || []
                    setTimeout(function() { //微任务
                        for (var i in _this.items) {
                            let prodPId = _this.items[i].prodPId;
                            _this.renderAllEditor(i, _this.items[i].description, {
                                prodPIds: prodPId ? [prodPId] : [],
                                platCode: 'ebay'
                            })
                        }
                        form.render()
                    }, 0)
                })
            },
            gatherData() {
                var _this = this
                var data = this.items.map(function(item) {
                    item.description = item.editor.txt.html()
                    var { ischecked, assiFieldInfoId, listingStyleId, auctionType, description, itemId, prodSSku, site, storeAcct, storeAcctId, storePSku, storeSSku, title } = item
                    return { ischecked, assiFieldInfoId, listingStyleId, auctionType, description, itemId, prodSSku, site, storeAcct, storeAcctId, storePSku, storeSSku, title }
                })
                return data.filter(function(item) {
                    return item.ischecked
                })
            },
            batchSubmit() { //批量提交
                var _this = this
                var data = this.gatherData()
                if (data.length > 0) {
                    _this.initAjax('/onlineProductEbay/batchEditEbayListing.html', 'post', JSON.stringify(data), function(returnData) {
                        layer.msg(returnData.msg)
                    })
                } else {
                    layer.msg('请勾选提交的数据')
                }
                return false;
            }
        },
    })
})
