layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var form = layui.form;
    if (lazada_checkStatus.length > 0) {
        var data = lazada_checkStatus.map(function(item) {
            var {id, itemId, storeAcctId, sub } = item;
            return id
        })
    }

    var app = new Vue({
        el: '#lazada-modifydescripe',
        data: {
            items: [],
            isAll: false,
            lazadaModify_old_string:'',
            lazadaModify_new_string:'',
            // wholetitle:''
            titleHotWord:''
        },
        created() {
            this.getlazadaDescript(JSON.stringify(data))
        },
        mounted() {
            form.render()
            this.checkAll()
            this.asyncCheckAll()
            commonAddEventTitleToggle($('.lazadaModifyTitleAndDesc'), 'lazada')
        },
        computed: {},
        methods: {
            checkAll() { //全选反选
                _this = this
                form.on('checkbox(chenckall)', function(data) {
                    _this.isAll = data.elem.checked
                    if (data.elem.checked) {
                        for (var i in _this.items) {
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
                loading.show()
                $.ajax({
                    type: method,
                    url: ctx + url,
                    dataType: 'json',
                    async: true,
                    data: data,
                    contentType: contentType || 'application/json',
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code !== "9999") {
                            func(returnData)
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                            layer.close();
                        }
                    },
                    error: function(returnData) {
                        loading.hide()
                        layui.admin.load.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                })
            },
            getlazadaDescript(data) {
                var _this = this
                this.initAjax('/onlineProductLazada/searchDescription.html', 'post', data, function(returnData) {
                    if(returnData.msg){
                    layer.msg(returnData.msg, { icon: 2 ,time:5000,area:['auto','auto']});
                    }
                    _this.items = returnData.data || []
                    setTimeout(function() { 
                        for (var i in _this.items) {
                            let prodPId = _this.items[i].prodPId;
                            _this.renderAllEditor(i, _this.items[i].description, {
                                prodPIds: [prodPId],
                                platCode: 'lazada'
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
                    var { id,prodPId,ischecked,storeSubSkuList,description, itemId, storeAcctId, title } = item
                    return { id,prodPId,ischecked,storeSubSkuList,description, itemId, storeAcctId, title}
                })
                return data.filter(function(item) {
                    return item.ischecked
                })
            },
            batchSubmit() { //批量提交
                var _this = this
                var data = this.gatherData()
                if (data.length > 0) {
                    _this.initAjax('/onlineProductLazada/modifyProduct.html', 'post', JSON.stringify(data), function(returnData) {
                        layer.msg(returnData.msg)
                    })
                } else {
                    layer.msg('请勾选提交的数据')
                }
                return false;
            },
            /**
             * 表格操作
             */
            // lazadaModify_update_string() {
            //     var oldTitleStr=this.lazadaModify_old_string;//旧的字符串
            //     var newTitleStr=this.lazadaModify_new_string;//新的字符串
            //     if (oldTitleStr == '') {
            //         layer.msg("请输入需要修改的数据");
            //         return;
            //     }
            //     if (newTitleStr == '') {
            //         layer.msg("请输入修改后的数据");
            //         return;
            //     }
            //     if (this.gatherData().length == 0) {
            //         layer.msg("请选择要修改的数据");
            //         return;
            //     }
            //             this.gatherData().forEach((item1,index1) =>{
            //                 this.items.forEach((item2,index2) => {
            //                     if(item1.itemId == item2.itemId){
            //                         let title = item2.title
            //                         title = replace_string(title,oldTitleStr,newTitleStr);
            //                         this.$set(this.items[index2], 'title', title);
            //                         this.$set(this.gatherData()[index1], 'title', title);
            //                     }
            //                 })
            //             })
            // },
            // 热搜词
            resetTitle() {
                let that = this
                let titleHotWord = this.titleHotWord
                if (this.gatherData().length == 0) {
                    layer.msg("请选择要修改的数据");
                    return;
                }
                console.log(this.gatherData())
                console.log(this.items)
                let newData = []
                this.gatherData().forEach(item => {
                    newData.push({
                        id: item.id,
                        prodPId: item.prodPId,
                        storeAcctId: item.storeAcctId,
                        titleHotWord: titleHotWord,
                    })
                })
                commonReturnPromise({
                    isLoading: false,
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    url: `${ctx}/onlineProductLazada/genNewTitle`,
                    params: JSON.stringify(newData)
                }).then(res => {
                    // 根据id
                    that.gatherData().forEach((item1,index1) =>{
                        that.items.forEach((item2,index2) => {
                            if(item1.itemId == item2.itemId && res[item1.id]){
                                let _productName = res[item1.id];
                                that.$set(that.items[index2], 'title', _productName);
                                that.$set(that.gatherData()[index1], 'title', _productName);
                            }
                        })
                    })
                    layer.msg("修改成功")
                })
            },
            /**
             * 一键应用标题
             */
            modifyWholeTitle(){
                var oldTitleStr=this.lazadaModify_old_string;//旧的字符串
                var newTitleStr=this.lazadaModify_new_string;//新的字符串

                if (newTitleStr == '') {
                    layer.msg("请输入修改后的数据");
                    return;
                }
                if (this.gatherData().length == 0) {
                    layer.msg("请选择要修改的数据");
                    return;
                }
                this.gatherData().forEach((item1,index1) =>{
                    this.items.forEach((item2,index2) => {
                        if(item1.itemId == item2.itemId){
                            let _productName = item2.title;
                            if (!oldTitleStr) {
                                if (newTitleStr.includes('_')) {
                                    _productName = newTitleStr.replace(
                                        '_',
                                        _productName
                                    );
                                } else {
                                    _productName = newTitleStr;
                                }
                            } else {
                                if (_productName.includes(oldTitleStr)) {
                                    if (!newTitleStr) {
                                        newTitleStr = '';
                                        _productName = _productName
                                            .split(' ')
                                            .filter((e) => e !== oldTitleStr)
                                            .join(' ');
                                    }
                                    _productName = _productName.replaceAll(
                                        oldTitleStr,
                                        newTitleStr
                                    );
                                }
                            }
                            this.$set(this.items[index2], 'title', _productName);
                            this.$set(this.gatherData()[index1], 'title', _productName);
                        }
                    })
                })
            }
        },
    })
})