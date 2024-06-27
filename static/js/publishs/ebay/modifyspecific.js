layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
    var form = layui.form,
        admin = layui.admin;
    if (modifyTitle_arr && modifyTitle_arr.length > 0) {
        var idList = modifyTitle_arr.map(function(item) {
            return item.id
        }).join(',')
    }
    var app = new Vue({
        el: '#modifyspecific',
        data: {
            items: [],
            currentCateId: '',
            currentSiteId: '',
            currentIndex: '',
            submitData: null,
            isAll: false,
            brand: 'Unbranded'
        },
        watch: {
            currentCateId: function(currentCateId) {
                this.getSpecific(currentCateId, this.currentSiteId, this.currentIndex)
            }
        },
        beforecreated() {},
        created() {
            this.getItemList(idList)
        },
        mounted() {
            form.render()
            this.checkAll()
            this.asyncCheckAll()
        },
        computed: {

        },
        methods: {
            checkAll() { //全选反选
                var _this = this
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
                        form.render('checkbox')
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
            chooseEbayCate1(index, siteId) { //第一级分类
                var _this = this;
                _this.currentIndex = index
                admin.itemCat_select('ebayCateSelect1',
                    '',
                    '',
                    "/prodcate/getEbayCateList.html?siteId=" + siteId,
                    "/prodcate/searchEbayCate.html?siteId=" + siteId,
                    function(cateid, cont) {
                        _this.items[index].primaryCateId = cateid.cateid;
                        _this.items[index].cont1 = cont
                        _this.currentCateId = cateid.cateid
                        _this.currentSiteId = siteId
                    });
            },
            chooseEbayCate2(index, siteId) {
                var _this = this;
                _this.currentIndex = index
                admin.itemCat_select('ebayCateSelect2',
                    '',
                    '',
                    "/prodcate/getEbayCateList.html?siteId=" + siteId,
                    "/prodcate/searchEbayCate.html?siteId=" + siteId,
                    function(cateid, cont) {
                        _this.items[index].secondCateid = cateid.cateid;
                        _this.items[index].cont2 = cont
                    });
            },
            searchCate(itemindex, type) {
                var _this = this
                layer.open({
                    type: 1,
                    title: '搜索ebay分类',
                    content: $("#ee_ebayCateSearchTpl").html(),
                    area: ['65%', '60%'],
                    success: function(layero, index) {
                        //搜索事件
                        $(layero).find("button").click(function() {
                            var title = $(layero).find("input[name='title']").val();
                            layui.table.render({
                                elem: '#ee_ebayCateSearchTable',
                                method: 'post',
                                url: ctx + '/ebaylisting/assidata/seatchebaycategroy.html' //数据接口
                                    ,
                                where: {
                                    title: title,
                                    siteId: _this.items[itemindex].siteId
                                },
                                method: 'post',
                                height: 500,
                                page: false,
                                cols: [
                                    [ //表头
                                        { field: 'id', title: 'ID', width: '10%' },
                                        { field: 'categoryName', title: '类目', width: '80%' },
                                        {
                                            field: 'percentItem',
                                            title: '操作',
                                            width: '10%',
                                            templet: '<div>{{d.percentItem}}% <a data-id="{{d.id}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'
                                        }
                                    ]
                                ],
                                done: function(res) {
                                    $(layero).find(".selectCategory").click(function() {
                                        if (type === "1") {
                                            _this.items[itemindex].cont1 = $(this).parents("tr").find("td[data-field=categoryName] div").html()
                                            _this.items[itemindex].primaryCateId = $(this).data("id")
                                            _this.items[itemindex].currentCateId = $(this).data("id")
                                            layer.close(index);
                                        } else if (type === "2") {
                                            _this.items[itemindex].cont2 = $(this).parents("tr").find("td[data-field=categoryName] div").html()
                                            _this.items[itemindex].secondCateid = $(this).data("id")
                                            layer.close(index);
                                        }
                                    });
                                }
                            });
                        });
                    },
                });
            },
            getItemList(data) {
                var _this = this
                this.initAjax('/ebayIsEnableProduct/specificsQuery.html', 'post', { idList: data }, function(returnData) {

                    for (var i in returnData.data) {
                        var initdata = {
                            id: "",
                            itemId: "",
                            primaryCateId: "",
                            prodPSku: "",
                            siteId: 0,
                            specific: null,
                            storeAcct: "",
                            storeAcctId: "",
                            storePSku: "",
                            ischecked: false,
                            cont1: "",
                            cont2: "",
                            specificsData: [],
                            customizeSpecific: [],
                            secondCateId: '',
                            result: ''
                        }
                        returnData.data[i] = Object.assign(initdata, returnData.data[i])
                        returnData.data[i].cont1 = returnData.data[i].primaryCateId
                        returnData.data[i].cont2 = returnData.data[i].secondCateId
                        returnData.data[i].specific = JSON.parse(JSON.stringify(returnData.data[i].specifics || {}))
                        _this.getSpecific(returnData.data[i].primaryCateId, returnData.data[i].siteId, i)
                    }
                    _this.items = returnData.data
                    setTimeout(function() {
                        _this.asyncCheckAll()
                        form.render()
                    }, 0)
                })
            },
            getSpecific(cateId, siteId, index) {
                var _this = this
                this.initAjax('/ebayIsEnableProduct/specificsRule.html', 'post', { cateId: cateId, siteId: siteId }, function(returnData) {
                    _this.items[index].specificsData = returnData.data
                    setTimeout(function() {
                        form.render()
                    }, 0)
                })
            },
            initAjax(url, method, data, func, timer) { //初始化ajax请求
                $.ajax({
                    type: method,
                    url: ctx + url,
                    dataType: 'json',
                    async: true,
                    data: data,
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            func(returnData)
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                        }
                    },
                    error: function(returnData) {
                        if (timer) {
                            clearInterval(timer)
                        }
                        layui.admin.load.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                })
            },
            addCustomSpecific(index) { //添加自定义属性
                this.items[index].customizeSpecific.push({ name: '', valuedata: '' })
            },
            deleteCustomSpecific(index, customindex) { //移除自定义属性
                this.items[index].customizeSpecific.splice(customindex, 1)
            },
            gatherData() { //收集批量提交的数据
                var _this = this
                var newitems = this.items.map(function(item, index) {
                    var arr = [], //最终返回简直对应格式数组['brand:lily,veromoda']
                        arr2 = [], //可输入自定义属性数组设为二级
                        arr1 = [] //specific属性字段数组
                    var formdata = _this.serializeObject($('#ee_editAssiDataForm' + index))
                    for (var i in formdata) { //遍历表单数据对象
                        var name = i.split('_') //表单内属于specific的元素命名规则为name_index(例如brand_0),追加的自定义属性name命名为name_costom_index
                        if (name.length === 3) { //带有自定属性的表单元素name值格式以brand_custom_0命名，切割后数组长度为3
                            if (formdata[i] != "") {
                                var obj = {}
                                obj.name = name[0]
                                obj.value = formdata[i]
                                arr2.push(obj)
                            }
                        } else if (name.length === 2) { //切割后长度为2的为specific需要收集的数据
                            if (formdata[i] != "") {
                                if ((typeof formdata[i]) !== "object") {
                                    var obj = {}
                                    obj.name = name[0]
                                    obj.value = formdata[i]
                                    arr1.push(obj)
                                } else {
                                    var obj = {}
                                    obj.name = name[0]
                                    obj.value = formdata[i].join(',')
                                    arr1.push(obj)
                                }
                            }
                        }
                    }
                    //构造specific参数字符串
                    for (var i in arr1) { //遍历匹配自定义属性
                        let flag = false;
                        for (var j in arr2) {
                            if (arr2[j].name === arr1[i].name) {
                                flag = true;
                                arr.push(arr1[i].name + ':' + arr1[i].value + ',' + arr2[j].value)
                            }
                        }!flag && arr.push(arr1[i].name + ':' + arr1[i].value);
                    }
                    for (var i in item.customizeSpecific) {
                        if (item.customizeSpecific[i].name != "" && item.customizeSpecific.valuedata != "") {
                            arr.push(item.customizeSpecific[i].name + ":" + item.customizeSpecific[i].valuedata)
                        } else {
                            layer.msg(item.storeAcct + "店铺自定义属性值未填写完整,将无法添加成功");
                        }
                    }
                    item.specifics = arr.join(';')
                    var { id, itemId, prodPSku, storeAcctId, storeAcct, siteId, storePSku, primaryCateId, secondCateid, specifics, ischecked } = item
                    var newitem = { id, itemId, storeAcctId, storeAcct, siteId, prodPSku, storePSku, primaryCateId, secondCateid, specifics, ischecked }
                    return newitem
                })
                var checkData = newitems.filter(function(item) {
                    return item.ischecked
                })
                return checkData
            },
            getModifyResult(itemId, prodStoreSku, index, timer) {
                var _this = this
                var prodObj = { itemId: itemId, prodStoreSku: prodStoreSku, type: 'modifySpecifics' }
                this.initAjax('/ebayIsEnableProduct/selectResult.html', 'post', { prodObj: JSON.stringify(prodObj) }, function(returnData) {
                    if (returnData.code === "0000") {
                        _this.submitData[index].result = returnData.msg
                        _this.submitData[index].color = _this.submitData[index].result === '处理成功' ? 'green' : 'red'
                    }
                }, timer)
            },
            batchModify() { //批量提交
                var _this = this
                var data = this.gatherData();
                for (var i in data) {
                    data[i].result = ""
                    data[i].color = ""
                }
                _this.submitData = data
                if (data.length > 0) {
                    this.initAjax('/ebayIsEnableProduct/processSpecifics.html', 'post', { data: JSON.stringify(data) }, function(returnData) {
                        if (returnData.code === '0000') {
                            layer.msg(returnData.msg)
                            for (var i in _this.submitData) {
                                var timer = setTimeout(function() {
                                    _this.getModifyResult(_this.submitData[i].itemId, _this.submitData[i].storePSku, i, timer)
                                }, 5000)
                            }
                        }
                    })
                } else {
                    layer.msg("请勾选需要提交的数据")
                }
                return false;
            },
            serializeObject(form) { //表单序列化
                var o = {};
                $.each(form.serializeArray(), function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            },
            getIndex(id, arr, value) {
                for (var i = 0; i < arr.length; i++) {
                    if (value == arr[i][id]) {
                        return i;
                    }
                }
                return -1;
            },
            applyBrand() {
                var _this = this
                if (this.brand != "") {
                    for (var i in _this.items) {
                        if (_this.items[i].ischecked) {
                            _this.items[i].specific.Brand = this.brand
                            $('input[name="Brand_' + i + '"]').val(this.brand)
                        }
                    }
                    setTimeout(function() {
                        form.render()
                    }, 0)
                } else {
                    layer.msg("请输入brand")
                }
            },
            ischecked(arr, name, value) {
                return arr[name] && arr[name].split(',').indexOf(value) > -1
            },
            getArrayfromStr(str, char) {
                if (str) {
                    return str.split(char)
                } else {
                    return []
                }
            }
        },
    })
})