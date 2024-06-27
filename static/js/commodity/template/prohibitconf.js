/**
 * time: 2018/01/02
 */

 (function () {
    var html = '';
    let isNewCate = false
    layui.use(["admin", "form", "table", "layer", "laytpl", "formSelects", "layCascader"], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            layCascader = layui.layCascader,
            formSelects = layui.formSelects,
            $ = layui.$;
        form.render('select');
        form.render('radio');
        form.render('checkbox');
        prohibitconf_initProdTags();
        formSelects.render('prohibitconf_salesSiteId');
        form.on('select(prohibitconf_searchForm_platCode)', function (data) {
            var platCode = data.value
            let options = $('#salesSite_addConfForm_' + platCode).find('option')
            let arr = []
            for (let i = 0; i <options.length; ++i) {
                if (options[i].innerText) {
                    arr.push({value: options[i].value, name: options[i].innerText})
                }
            }
            console.log(arr)
            formSelects.data('prohibitconf_salesSiteId','local',{arr: arr})
        });

        form.on("select(hasKeyWord)", function (data) {
            $("#keyWordStr").val(data.value);
        });

        form.on("select(hasDescWord)", function (data) {
            $("#descWordStr").val(data.value);
        });
        getLogisAttrList()

        //监听iframe传参
        window.addEventListener('message', function(event){
            let { inableConfIds } = event.data || {}
            if (inableConfIds !== undefined && inableConfIds !== '') {
                $('#prohibitConfIdList').val(inableConfIds)
                $('#prohibitconfSearchBtn').click()
            }
        });

        let movestock_creatorCascader = layCascader({
            elem: "#prohibitconf_cate",
            clearable: true,
            filterable: true,
            collapseTags: true,
            placeholder: '请选择',
            props: {
                multiple: true,
                label: "title",
                value: "value",
                children: 'data'
            }
        });

        let newmovestock_creatorCascader = layCascader({
            elem: "#prohibitconf_newcate",
            clearable: true,
            filterable: true,
            collapseTags: true,
            placeholder: '请选择',
            props: {
                multiple: true,
                label: "title",
                value: "value",
                children: 'data'
            }
        });

        getNewCateList()

        function getCateList() {
            commonReturnPromise({
                url: ctx + "/prodcate/listCategoryTree",
            }).then(res => {
                movestock_creatorCascader.setOptions(res);
            })
        }
        function getNewCateList() {
            commonReturnPromise({
                url: ctx + "/prodCateOa/get/cate/tree",
            }).then(res => {
                newmovestock_creatorCascader.setOptions(JSON.parse(res));
            })
        }

        form.on('select(cateType)', function(data) {
            if (data.value === '2') {
                $('#newCateDiv').show()
                $('#oldCateDiv').hide()
                getNewCateList()
            } else {
                getCateList()
                $('#newCateDiv').hide()
                $('#oldCateDiv').show()
            }
        })

        //表格渲染结果
        //展示已知数据
        function queryPage(data) {
            table.render({
                elem: "#prohibitconfTable",
                method: "post",
                url: ctx + "/prohibit/getconfList.html",
                where: data,
                cols: [
                    [
                        //标题栏
                        { type: "checkbox" },
                        { field: "id", title: "ID", width: 90 },
                        { field: "platCode", title: "平台", width: 90 },
                        { field: "salesSite", title: "站点", width: 90 },
                        { title: "仓库", width: 90, templet: '#stockLocation_prohibitconf' },
                        { field: "tplTypeNameList", title: "模板类型", width: 120 },
                        { field: "keywords", title: "关键词禁售词",templet: '#prohibitconf_keywords' },
                        { field: "descWords", title: "描述禁售词",templet: '#prohibitconf_descWords' },
                        { field: "cateList", title: "类目<br/><span style='color:red'>新老类目是或的关系</span>",templet: '#prohibitconf_cateList' },
                        { field: "productLabelList", title: "商品标签" },
                        { field: "logisAttrList", title: "物流属性" },
                        { title: "检查状态", templet: '#checkStatus_prohibitconf', width: 90 },
                        { title: "更新信息", templet: '#prohibitconf_modifyInfo', width: 140 },
                        { title: "创建信息", templet: '#prohibitconf_createInfo', width: 140 },
                        //绑定工具条
                        { title: '操作', align: 'center', toolbar: '#prohibitconfBar', width: 120 }
                    ],
                ],
                id: 'prohibitconfTable',
                page: true,
                limits: [100, 500, 1000],
                limit: 100,
                done: function (res, curr, count) {
                    $('#Count_prohibitconf').text(count)
                    prohibitconfExpandAndHide('cateList');
                    prohibitconfExpandAndHide('keywords');
                    prohibitconfExpandAndHide('descWords');

                    sessionStorage.removeItem('inableConfIds')
                }
            });
        }

        function prohibitconfExpandAndHide(field){
          let tds = $(`#prohibitconf_content td[data-field=${field}]`);
          for(var i=0; i<tds.length; i++){
              var $item = $(tds[i]);
              var tdh = $item.find('.detailProhibitconfDiv').height();
              if(tdh > 96) {
                  var expandStr = `<div class="logisticsProhibitconf_expand"><b style="cursor:pointer;color:#428bca;"  class="ProhibitconfsDetail_expand_single">+展开</b></div>`;
                  if (!$item.find('.ProhibitconfsDetail_expand_single').length) {
                      $item.append(expandStr);
                  }
              }
          };
        }

        //监听点击事件
        //td内点击展开收缩
        $('#prohibitconf_content').on('click', '.ProhibitconfsDetail_expand_single', function(){
          let $this = $(this);
          let txt = $this.html();
          let $tar = $(this).parents('td').find('.detailProhibitconfDefault');
          if(txt == '+展开'){
              $tar.removeClass('detailProhibitconfHidden').addClass('detailProhibitconfShow');
              $this.html('-收缩');
          }else{
              $tar.addClass('detailProhibitconfHidden').removeClass('detailProhibitconfShow');
              $this.html('+展开');
          }
        });

        queryPage({status: true})

        // 搜索
        var active = {
            reload: function (tableName) {
                switch (tableName){
                    case 'prohibitconfTable' :
                        let data = serializeObject($('#prohibitconfSearchForm'))
                        delete data.hasKeyWord
                        delete data.hasDescWord
                        if (data.cateType === '1') {
                            data.oldCateIdListStr = data.oldCateIdListStr && (JSON.parse(data.oldCateIdListStr).join(',') || '')
                            data.oaCateIdListStr = ''
                        }
                        if (data.cateType === '2') {
                            data.oaCateIdListStr = data.oaCateIdListStr && (JSON.parse(data.oaCateIdListStr).join(',') || '')
                            data.oldCateIdListStr = ''
                        }
                        checkNull(data)
                        //执行重载
                        table.reload('prohibitconfTable', {
                            page: { curr: 1 },
                            where: data
                        });
                        break
                }
            }
        };

        // 获取物流属性
        function getLogisAttrList () {
            var layer = layui.layer,
            laytpl = layui.laytpl;
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/enum/getLogisAttrEnum.html',
                success: function (res) {
                if (res.code === '0000') {
                    const arr = (res.data || []).map((item) => ({
                        name: item.name,
                        value: item.name,
                    }));
                    //渲染下拉框
                    formSelects.data("logisticsAttrListStr", "local", {
                        arr,
                    });
                } else {
                    layer.msg('初始化物流属性失败:' + res.msg)
                }
                }
            })
        }
        $('#prohibitconfResetBtn').click(function() {
            movestock_creatorCascader.setValue('');
            newmovestock_creatorCascader.setValue('');
        })
        $('#prohibitconfSearchBtn').click(function () {
            let data = serializeObject($('#prohibitconfSearchForm'))
            delete data.hasKeyWord
            delete data.hasDescWord
            if (data.cateType === '1') {
                data.oldCateIdListStr = data.oldCateIdListStr && (JSON.parse(data.oldCateIdListStr).join(',') || '')
                data.oaCateIdListStr = ''
            }
            if (data.cateType === '2') {
                data.oaCateIdListStr = data.oaCateIdListStr && (JSON.parse(data.oaCateIdListStr).join(',') || '')
                data.oldCateIdListStr = ''
            }

            checkNull(data)
            queryPage(data)
        });
        $('#disableBatch_prohibitconf').click(function () {
            var checkStatus = table.checkStatus('prohibitconfTable'),
                data = checkStatus.data
            if (data.length === 0) {
                layer.msg('请选择需要停用的设置')
                return
            }
            let idList = []
            for (let i = 0 ; i < data.length; ++i) {
                idList.push(data[i].id)
            }
            batchChangeStatus(idList,false)
        })
        $('#enableBatch_prohibitconf').click(function () {
            var checkStatus = table.checkStatus('prohibitconfTable'),
                data = checkStatus.data
            if (data.length === 0) {
                layer.msg('请选择需要停用的设置')
                return
            }
            let idList = []
            for (let i = 0 ; i < data.length; ++i) {
                idList.push(data[i].id)
            }
            batchChangeStatus(idList,true)
        })
        // 批量停用/启用动作
        function batchChangeStatus(idList,status) {
            let str = status ? '启用': '停用';
            let disableProhibit_confirmIndex = layer.confirm(`确认${str}该禁售设置吗`,{btn: ['确认','确认并立即检查','取消']},function () {
                let Adata = {
                    idList: idList,
                    status: status,
                    checkNow: false
                }
                layer.close(disableProhibit_confirmIndex)
                ajaxToChangeStatus(Adata)
            },function () {
                let Adata = {
                    idList: idList,
                    status: status,
                    checkNow: true
                }
                layer.close(disableProhibit_confirmIndex)
                ajaxToChangeStatus(Adata)
            })
        }
        function ajaxToChangeStatus(Adata) {
            oneAjax.post({
                url: '/prohibit/changeStatusProhibitList.html',
                data: JSON.stringify(Adata),
                success: function (res) {
                    if (res.code === '0000') {
                        active.reload('prohibitconfTable')
                    }
                }
            })
        }
        function toPutOACate(json){
            let cateid = json.id,leafCate = json.cateTreeName.split(">>")[json.cateTreeName.split(">>").length - 1];
            var oldCateIdList = $('#addprohibitconfForm_prohibitconf [name=cateOAIdList]').val()
            var oldCateList = $('#addprohibitconfForm_prohibitconf [name=cateOAList]').val()
            if (oldCateList.indexOf(leafCate) < 0) {
                $('#addprohibitconfForm_prohibitconf [name=cateOAIdList]').val(oldCateIdList + cateid + ",")
                $('#addprohibitconfForm_prohibitconf [name=cateOAList]').val(oldCateList + leafCate + ",")
                var cateBox = getOneCateBox_oa(cateid, leafCate)
                $('#selectedOACateShowDiv').append(cateBox)
            }
        }

        function getOneCateBox_oa(cateId, cateName) {
            var cateBox = $('<div class="layui-btn layui-btn-normal layui-btn-sm" data-cateId="' + cateId + '" data-cateName="' + cateName + '" onmouseover="onmouseOverForBox(this)" onmouseout="onmouseOutForBox(this)" onclick="delOneCateBox_oa(this)">' + cateName + '</div>')
            return cateBox
        }

        function getOneCateBox(cateId, cateName) {
            var cateBox = $('<div class="layui-btn layui-btn-normal layui-btn-sm" data-cateId="' + cateId + '" data-cateName="' + cateName + '" onmouseover="onmouseOverForBox(this)" onmouseout="onmouseOutForBox(this)" onclick="delOneCateBox(this)">' + cateName + '</div>')
            return cateBox
        }

        function toPutCate(json) {
            console.log(json)
            var li = json.li
            var cateid = json.cateid
            var leafCate = li[li.length - 1].innerText
            if (leafCate.indexOf(">>") > 0) {
                leafCate = leafCate.substring(leafCate.lastIndexOf(">>") + 2)
            }
            var oldCateIdList = $('#addprohibitconfForm_prohibitconf [name=cateIdList]').val()
            var oldCateList = $('#addprohibitconfForm_prohibitconf [name=cateList]').val()
            if (oldCateList.indexOf(leafCate) < 0) {
                $('#addprohibitconfForm_prohibitconf [name=cateIdList]').val(oldCateIdList + cateid + ",")
                $('#addprohibitconfForm_prohibitconf [name=cateList]').val(oldCateList + leafCate + ",")
                var cateBox = getOneCateBox(cateid, leafCate)
                $('#selectedCateShowDiv').append(cateBox)
            }
        }

        function initSalesSite(platCode) {
            $('#addprohibitconfForm_prohibitconf [name=salesSiteId]').html($('#salesSite_addConfForm_' + platCode).html())
            form.render('select')
        }
        // 商品标签
        function prohibitconf_initProdTags() {
            $.ajax({
                type: "post",
                url: ctx + "/product/getProdTags.html",
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        //商品标签
                        for (var i = 0; i < returnData.data.length; i++) {
                            var item = returnData.data[i];
                            html += `<input type="checkbox" title ="${item.name}" lay-skin="primary" value="${item.name}" name="productLabelList">`;
                        }
                        return html;
                    } else {
                        layer.msg(returnData.msg);
                    }
                }
            });
        }

        //复制新增
        $("#addByCopyBtn_prohibitconf").click(function () {
            var checkStatus = table.checkStatus('prohibitconfTable'),
                data = checkStatus.data
            if (data.length === 0) {
                layer.msg('请选择需要复制的设置')
                return
            }
            // 判断是否同一平台
            let platCode = ''
            for (let i = 0; i < data.length; ++i) {
                if (!platCode || platCode === data[i].platCode) {
                    platCode = data[i].platCode
                } else {
                    layer.msg('请选择同一平台的设置进行复制')
                    return
                }
            }
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "复制新增",
                area: ["1100px", "600px"],
                btn: ['新建', '关闭'],
                content: $("#prohibitconf_addByCopyfLayer").html(),
                success: function () {
                    // 站点选择
                    $('#prohibitconf_addByCopyForm').find('[name=salesSiteId]').html($('#salesSite_addConfForm_' + platCode).html())
                    formSelects.render('prohibitconf_addByCopy_salesSiteId');
                },
                yes: function () {
                    let Adata = {}
                    let idList = []
                    for (let i = 0; i < data.length; ++i) {
                        idList.push(data[i].id)
                    }
                    Adata.idList = idList
                    let siteList = formSelects.value("prohibitconf_addByCopy_salesSiteId");
                    let confList = []
                    for (let i = 0; i < siteList.length; ++i) {
                        confList.push({
                            salesSiteId: siteList[i].value,
                            salesSite: siteList[i].name,
                        })
                    }
                    Adata.siteList = confList
                    $.ajax({
                        type: "POST",
                        url: ctx + "/prohibit/addByCopy.html",
                        data: JSON.stringify(Adata),
                        async: false,
                        contentType: 'application/json',
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code === '0000') {
                                layer.msg('复制新增成功')
                                layer.closeAll()
                                active.reload('prohibitconfTable')
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        }
                    });
                }
            });
        });
        // 新增设置 点击事件
        $("#addProhibitBtn_prohibitconf").click(function () {
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "新增禁售设置",
                area: ["1100px", "750px"],
                btn: ['新建','新建并检查', '关闭'],
                content: $("#addprohibitconfLayer").html(),
                success: function () {
                    initNotNull('#addprohibitconfForm_prohibitconf')
                    form.render('select')
                    form.render('checkbox')
                    // 适用模板类型
                    formSelects.render('prohibitconf_tplTypeList');
                    // 站点选择-改成平台选择-20231102
                    form.on('select(plateCode_addConfForm)', function (data) {
                        var platCode = data.value
                        initSalesSite(platCode)
                    });
                    // 类目选择
                    $("#cateBtn_addConfForm").click(function () {
                        layui.admin.itemCat_select('productlistLayer', 'pskuCateId', 'pskuCateName', null, null, toPutCate)
                    });
                    // OA新类目选择
                    $("#cateOaBtn_addConfForm").click(function () {
                        cateLayerOpen('oa','layer_work_develop_Prohibitconf','tplOACateInfo_show', '#itemCat_input',null,null,{ needCb: true, cb: toPutOACate })
                    });
                    //渲染tagsinput
                    $('#addprohibitconfForm_prohibitconf input[name="keywords"]').tagsinput();
                    $('#addprohibitconfForm_prohibitconf input[name="descWords"]').tagsinput();
                    // 渲染商品标签
                    $('#prohibitproductLabelList').append(html);

                    $('.isCreateHidden').hide()
                    form.render('checkbox');
                },
                yes: function () {
                    if (!checkNotNull('#addprohibitconfForm_prohibitconf')) {
                        return
                    }
                    ajaxToAdd(false)
                },
                btn2: function () {
                    if (!checkNotNull('#addprohibitconfForm_prohibitconf')) {
                        return
                    }
                    ajaxToAdd(true)
                }
            });
        });

        // 展示设置禁售信息日志
        function getProhibitLog(id, selector) {
            if (typeof(id) == undefined) {
                return
            }
            $.ajax({
                type: 'post',
                url: ctx + '/prohibit/getconfListLog',
                data: JSON.stringify({ 'id': id }) ,
                // async: false,
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                success: function(returnData) {
                    if (returnData.code != '0000') {
                        layer.msg(returnData.msg, { icon: 5 })
                    } else {
                        var prodhibitLogs = returnData.data

                        for (var i in prodhibitLogs) {
                            var tr = '<tr>'
                            prodhibitLogs[i].operDesc = prodhibitLogs[i].operDesc.replace(/\n/g, '<br/>')
                            tr += '<td width="150">' + layui.admin.Format(prodhibitLogs[i].createTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodhibitLogs[i].creator + '</td><td>' + prodhibitLogs[i].operDesc + '</td>'
                            tr += '</tr>'
                            $(selector).append(tr)
                        }
                    }
                },
                error: function() {
                    layer.msg('发送请求失败')
                }
            })
        }

        /**
         * 新增禁售映射。
         * checkNow  是否立即检查
         */
        function ajaxToAdd(checkNow) {
            let dataForm = $('#addprohibitconfForm_prohibitconf')
            let Adata = {
                platCode: dataForm.find('[name=platCode]').val(),
                salesSiteId: dataForm.find('[name=salesSiteId]').val(),
                stockLocation: dataForm.find('[name=stockLocation]').val(),
                salesSite: dataForm.find('[name=salesSiteId] option:selected').text(),
                cateIdList: dataForm.find('[name=cateIdList]').val(),
                cateList: dataForm.find('[name=cateList]').val(),
                cateIdListNew: dataForm.find('[name=cateOAIdList]').val(),
                cateNewList: dataForm.find('[name=cateOAList]').val(),
                keywords: dataForm.find('[name=keywords]').val(),
                descWords: dataForm.find('[name=descWords]').val(),
                tplTypeList: formSelects.value('prohibitconf_tplTypeList', 'valStr'),
                tplTypeNameList: formSelects.value('prohibitconf_tplTypeList', 'nameStr'),
                checkingStatus: checkNow ? 1 : 0
            }
            // 组装类目
            let prohibitConfCateList = []
            let cateIdList = []
            let cateNameList = []
            let cateBoxList = $('#selectedCateShowDiv').find('.layui-btn')
            if (cateBoxList && cateBoxList.length > 0) {
                for (let i = 0; i < cateBoxList.length; ++i) {
                    let oneCateBox = cateBoxList[i]
                    prohibitConfCateList.push({
                        prodCateId: oneCateBox.getAttribute('data-cateid'),
                        prodCateName: oneCateBox.getAttribute('data-catename')
                    })
                    cateIdList.push(oneCateBox.getAttribute('data-cateid'))
                    cateNameList.push(oneCateBox.getAttribute('data-catename'))
                }
                Adata.prohibitConfCateList = prohibitConfCateList
                Adata.cateIdList = cateIdList.join(",")
                Adata.cateList = cateNameList.join(",")
            }
            let prohibitConfCateListOA = []
            let cateIdListOA = []
            let cateNameListOA = []
            let cateBoxListOA = $('#selectedOACateShowDiv').find('.layui-btn')
            if (cateBoxListOA && cateBoxListOA.length > 0) {
                for (let i = 0; i < cateBoxListOA.length; ++i) {
                    let oneCateBox = cateBoxListOA[i]
                    prohibitConfCateListOA.push({
                        prodCateId: oneCateBox.getAttribute('data-cateid'),
                        prodCateName: oneCateBox.getAttribute('data-catename')
                    })
                    cateIdListOA.push(oneCateBox.getAttribute('data-cateid'))
                    cateNameListOA.push(oneCateBox.getAttribute('data-catename'))
                }
                Adata.prohibitConfCateNewList = prohibitConfCateListOA
                Adata.cateIdListNew = cateIdListOA.join(",")
                Adata.cateNewList = cateNameListOA.join(",")
            }
            // 如果是 ebay、amazon、shopee、lazada 平台则必须设置站点
            // if (Adata.platCode === 'ebay' || Adata.platCode === 'amazon' || Adata.platCode === 'shopee' || Adata.platCode === 'lazada') {
            //     if (!Adata.salesSite) {
            //         layer.msg('有站点可选的平台必须选择好站点')
            //         return
            //     }
            // }
            //ztt20231102 平台判断站点,平台存在,看一下平台是否有关联站点
            if(Adata.platCode){
              if($('#addprohibitconfForm_prohibitconf [name=salesSiteId]').find('option').length>1 && !Adata.salesSite){
                return layer.msg('有站点可选的平台必须选择站点', {icon: 7});
              }
            }
            let logisAttrArr = [];
            dataForm.find("[name='logisAttrList']:checked").each(function () {
                logisAttrArr.push(this.value);
            })
            Adata.logisAttrList = logisAttrArr.join(",");
            let productLabelarr = [];
            dataForm.find("[name='productLabelList']:checked").each(function () {
                productLabelarr.push(this.value);
            });
            Adata.productLabelList = productLabelarr.join(",");
            $.ajax({
                type: "POST",
                url: ctx + "/prohibit/addProhibit.html",
                data: JSON.stringify(Adata),
                async: false,
                contentType: 'application/json',
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code === '0000') {
                        layer.msg('新建成功')
                        layer.closeAll()
                        active.reload('prohibitconfTable')
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                }
            });
        }

        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(prohibitconfTable)', function (obj) {
            let data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent === 'edit') {
                let popIndex = layer.open({
                    shadeClose: false,
                    type: 1,
                    title: "禁售设置信息",
                    area: ["1100px", "600px"],
                    btn: ['保存','保存并检查', '关闭'],
                    content: $("#addprohibitconfLayer").html(),
                    success: function (layero, index) {
                        //新增提示
                        layero.find('.layui-layer-btn.layui-layer-btn-').append('<div class="prohibitconfLayer-tips">系统晚上会定时检查待检查的规则</div>');
                        // 类目选择
                        $("#cateBtn_addConfForm").click(function () {
                            layui.admin.itemCat_select('productlistLayer', 'pskuCateId', 'pskuCateName', null, null, toPutCate)
                        });
                        // OA新类目选择
                        $("#cateOaBtn_addConfForm").click(function () {
                            cateLayerOpen('oa','layer_work_develop_Prohibitconf','tplOACateInfo_show', '#itemCat_input',null,null,{ needCb: true, cb: toPutOACate })
                        });
                        formSelects.render('prohibitconf_tplTypeList');
                        if (data.tplTypeList) {
                            let tplTypeList = data.tplTypeList.split(',')
                            formSelects.value('prohibitconf_tplTypeList', tplTypeList)
                        }

                        // 设置禁售 操作日志
                        getProhibitLog(data.id, '#prohibitconf_subLogTbody')

                        $('#addprohibitconfForm_prohibitconf #platCodeInp_addConfForm').val(data.platCode)
                        $('#addprohibitconfForm_prohibitconf #platCodeInp_addConfForm').removeClass('disN')
                        $('#addprohibitconfForm_prohibitconf #salesSiteInp_addConfForm').val(data.salesSite)
                        $('#addprohibitconfForm_prohibitconf #salesSiteInp_addConfForm').removeClass('disN')
                        var stockLocation = ''
                        switch (data.stockLocation) {
                            case 0: stockLocation = '全部'; break;
                            case 1: stockLocation = '国内仓'; break;
                            case 2: stockLocation = '海外仓'; break;
                        }
                        $('#addprohibitconfForm_prohibitconf #stockLocationInp_addConfForm').val(stockLocation)
                        $('#addprohibitconfForm_prohibitconf #stockLocationInp_addConfForm').removeClass('disN')

                        $('#addprohibitconfForm_prohibitconf [name=keywords]').val(data.keywords)
                        $('#addprohibitconfForm_prohibitconf [name=descWords]').val(data.descWords)
                        $('#addprohibitconfForm_prohibitconf [name=cateIdList]').val(data.cateIdList)
                        $('#addprohibitconfForm_prohibitconf [name=cateList]').val(data.cateList)
                        $('#addprohibitconfForm_prohibitconf [name=cateOAIdList]').val(data.cateIdListNew)
                        $('#addprohibitconfForm_prohibitconf [name=cateOAList]').val(data.cateNewList)

                        if (data.prohibitConfCateList) {
                            let cateList = data.prohibitConfCateList
                            if (cateList && cateList.length > 0) {
                                let cateBox
                                for (let i = 0; i < cateList.length; ++i) {
                                    cateBox = getOneCateBox(cateList[i].prodCateId, cateList[i].prodCateName)
                                    $('#selectedCateShowDiv').append(cateBox)
                                }
                            }

                        }
                        if (data.prohibitConfCateNewList) {
                            let cateList = data.prohibitConfCateNewList
                            if (cateList && cateList.length > 0) {
                                let cateBox
                                for (let i = 0; i < cateList.length; ++i) {
                                    cateBox = getOneCateBox_oa(cateList[i].prodCateId, cateList[i].prodCateName)
                                    $('#selectedOACateShowDiv').append(cateBox)
                                }
                            }

                        }

                        if (data.logisAttrList) {
                            var logisCheck = $('#addprohibitconfForm_prohibitconf [name=logisAttrList]')
                            for (var i = 0; i < logisCheck.length; ++i) {
                                if (data.logisAttrList.indexOf(logisCheck[i].value) >= 0) {
                                    logisCheck[i].checked = true
                                }
                            }
                        }
                        // 渲染商品标签
                        $('#prohibitproductLabelList').append(html);
                        form.render('checkbox');
                        if (data.productLabelList) {
                            var productCheck = $('#addprohibitconfForm_prohibitconf [name=productLabelList]')
                            for (var i = 0; i < productCheck.length; ++i) {
                                if (data.productLabelList.indexOf(productCheck[i].value) >= 0) {
                                    productCheck[i].checked = true
                                }
                            }
                        }

                        //渲染tagsinput
                        $('#addprohibitconfForm_prohibitconf input[name="keywords"]').tagsinput();
                        $('#addprohibitconfForm_prohibitconf input[name="descWords"]').tagsinput();

                        // form.render('select');
                        form.render('checkbox');

                        $('#prohibitconf_keywords_search').on('click', function() {
                            let $input = $('#prohibitconf_keywords_input');
                            let val = $input.val().trim();
                            let txtContainerArr = $('#addprohibitconfForm_prohibitconf input[name="keywords"]').tagsinput('items') || [];
                            if(!val){
                                return layer.msg('请先输入需要查询的关键词禁售词',{icon:7});
                            }
                            let matchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            layer.msg(`共查询到${matchArr.length}条匹配的关键词禁售词`,{icon:1});
                        })

                        $('#prohibitconf_keywords_delete').on('click', function() {
                            let $input = $('#prohibitconf_keywords_input');
                            let val = $input.val().trim();
                            let txtContainerArr = $('#addprohibitconfForm_prohibitconf input[name="keywords"]').tagsinput('items') || [];
                            if(!val){
                                return layer.msg('请先输入需要删除的关键词禁售词',{icon:7});
                            }
                            let matchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            let notMatchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return !valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            $('#prohibitconf_keywords_tags').tagsinput();
                            matchArr?.forEach((item, index) => {
                                $("#prohibitconf_keywords_tags").tagsinput('remove', item);
                            });
                            $('#prohibitconf_keywords_input').closest('.layui-form-item').find('.tagsinputNum').text(notMatchArr.length)
                            layer.msg(`共删除${matchArr.length}条匹配的关键词禁售词`,{icon:1});
                        })


                        $('#prohibitconf_descwords_search').on('click', function() {
                            let $input = $('#prohibitconf_descwords_input');
                            let val = $input.val().trim();
                            let txtContainerArr = $('#addprohibitconfForm_prohibitconf input[name="descWords"]').tagsinput('items') || [];
                            if(!val){
                                return layer.msg('请先输入需要查询的描述禁售词',{icon:7});
                            }
                            let matchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            layer.msg(`共查询到${matchArr.length}条匹配的描述禁售词`,{icon:1});
                        })

                        $('#prohibitconf_descwords_delete').on('click', function() {
                            let $input = $('#prohibitconf_descwords_input');
                            let val = $input.val().trim();
                            let txtContainerArr = $('#addprohibitconfForm_prohibitconf input[name="descWords"]').tagsinput('items') || [];
                            if(!val){
                                return layer.msg('请先输入需要删除的描述禁售词',{icon:7});
                            }
                            let matchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            let notMatchArr = txtContainerArr.filter(function(item){
                                var valArr = val.split(',');
                                valArr = valArr.map(item => item.toLocaleLowerCase());
                                return !valArr.includes(item.trim().toLocaleLowerCase());
                            });
                            $('#prohibitconf_descords_tags').tagsinput();
                            matchArr?.forEach((item, index) => {
                                $("#prohibitconf_descords_tags").tagsinput('remove', item);
                            });
                            $('#prohibitconf_descwords_input').closest('.layui-form-item').find('.tagsinputNum').text(notMatchArr.length)
                            layer.msg(`共删除${matchArr.length}条匹配的描述禁售词`,{icon:1});
                        })
                    },
                    yes: function () {
                        ajaxToEdit(data,false)
                    },
                    btn2: function () {
                        ajaxToEdit(data,true)
                    }
                });
            } else if (layEvent === 'disableProhibitConf') {
                batchChangeStatus([data.id],false);
            } else if (layEvent === 'enableProhibitConf') {
                let opts = $(`#salesSite_addConfForm_${data.platCode}`).find('option').length;
                if(opts>1 && !data.salesSite){
                  return layer.msg(`平台${data.platCode}未选择对应站点,不允许启用`, {icon:7});
                }else{
                  batchChangeStatus([data.id], true);
                }
            } else if (layEvent === 'queryLinkedPsku') {
                var popIndex = layer.open({
                    shadeClose: false,
                    type: 1,
                    title: "被禁售PSKU",
                    area: ["1200px", "800px"],
                    btn: ['关闭'],
                    content: $("#linkedPskuPop").html(),
                    success: function (layero, index) {
                        var Adata = { id: data.id, page: 1, limit: 1000 }
                        $.ajax({
                            type: "POST",
                            url: ctx + "/prohibit/queryLinkedPsku.html",
                            data: { id: data.id, page: 1, limit: 1000 },
                            async: false,
                            dataType: "json",
                            success: function (res) {
                                if (res.code === '0000') {
                                    $('#count_linkedPsku').text(res.count)
                                    // 封装数据。每行一百sku
                                    var tbData = []
                                    if (res.data && res.data.length > 0) {
                                        var splitData = chunk(res.data, 100)
                                        for (var i = 0; i < splitData.length; ++i) {
                                            tbData.push({ pSkuStr: splitData[i].join(',') })
                                        }
                                    }
                                    table.render({
                                        elem: "#linkedPskuTable",
                                        data: tbData,
                                        cols: [
                                            [
                                                //标题栏
                                                { type: "numbers", width: 50 },
                                                { title: "被禁售sku(每行100)", templet: '#linkedPskuTemp', width: 1050 },
                                                { title: '操作', align: 'center', toolbar: '#bar_linkedPskuTable', width: 50 }
                                            ],
                                        ],
                                        id: 'linkedPskuTable',
                                        page: false,
                                        limit: tbData.length
                                    })
                                    $('#copyAllLinkedPsku').click(function () {
                                        copyTxtToClipboard(res.data.join(','))
                                    })

                                }
                            }
                        })
                    }
                })
            } else if (layEvent === 'editFixedUnListablePsku') {
                console.log('data', data)
                var popIndex = layer.open({
                    shadeClose: false,
                    type: 1,
                    title: "固定禁售父SKU",
                    area: ["1200px", "90%"],
                    btn: ['关闭'],
                    content: $("#prohibitconf_fixedUnlistAbleEditLayer").html(),
                    success: function (layero, index) {
                        let paramForm = $('#prohibitconf_fixedUnlistAbleEditForm')
                        let inps = paramForm.find('[name]:hidden')
                        for (let i = 0; i < inps.length; ++i) {
                            inps[i].value = data[inps[i].getAttribute('name')]
                        }
                        let warehouseMap = {
                            0: '全部',
                            1: '国内仓',
                            2: '虚拟仓'
                        }
                        laytpl($("#prohibitconf_platInfo").html()).render(
                            { platCode: data.platCode || '',
                            salesSite: data.salesSite || '',
                            warehouse: warehouseMap[data.stockLocation] || ''
                            }, function(html){
                            $('#prohibitconf_platInfoSlot').html(html)
                        });
                        console.log(inps)
                        // 渲染表格
                        prohibitconf_renderFixedUnlistAbleTable()
                        // 组件初始化
                        init_prohibitconf_fixedUnlistAbleEditLayer(data)
                    }
                })
            }
        });
        
        function ajaxToEdit(data, checkNow) {
            let form = $('#addprohibitconfForm_prohibitconf')
            var Adata = {
                id: data.id,
                cateIdList: form.find('[name=cateIdList]').val(),
                cateList: form.find('[name=cateList]').val(),
                cateIdListNew: form.find('[name=cateOAIdList]').val(),
                cateNewList: form.find('[name=cateOAList]').val(),
                keywords: form.find('[name=keywords]').val(),
                descWords: form.find('[name=descWords]').val(),
                tplTypeList: formSelects.value('prohibitconf_tplTypeList', 'valStr'),
                tplTypeNameList: formSelects.value('prohibitconf_tplTypeList', 'nameStr'),
                checkingStatus: checkNow ? 1 : 0
            }
            // 组装类目
            let prohibitConfCateList = []
            let cateIdList = []
            let cateNameList = []
            let cateBoxList = $('#selectedCateShowDiv').find('.layui-btn')
            if (cateBoxList && cateBoxList.length > 0) {
                for (let i = 0; i < cateBoxList.length; ++i) {
                    let oneCateBox = cateBoxList[i]
                    prohibitConfCateList.push({
                        prodCateId: oneCateBox.getAttribute('data-cateid'),
                        prodCateName: oneCateBox.getAttribute('data-catename')
                    })
                    cateIdList.push(oneCateBox.getAttribute('data-cateid'))
                    cateNameList.push(oneCateBox.getAttribute('data-catename'))
                }
                Adata.prohibitConfCateList = prohibitConfCateList
                Adata.cateIdList = cateIdList.join(",")
                Adata.cateList = cateNameList.join(",")
            }
            let prohibitConfCateListOA = []
            let cateIdListOA = []
            let cateNameListOA = []
            let cateBoxListOA = $('#selectedOACateShowDiv').find('.layui-btn')
            if (cateBoxListOA && cateBoxListOA.length > 0) {
                for (let i = 0; i < cateBoxListOA.length; ++i) {
                    let oneCateBox = cateBoxListOA[i]
                    prohibitConfCateListOA.push({
                        prodCateId: oneCateBox.getAttribute('data-cateid'),
                        prodCateName: oneCateBox.getAttribute('data-catename')
                    })
                    cateIdListOA.push(oneCateBox.getAttribute('data-cateid'))
                    cateNameListOA.push(oneCateBox.getAttribute('data-catename'))
                }
                Adata.prohibitConfCateNewList = prohibitConfCateListOA
                Adata.cateIdListNew = cateIdListOA.join(",")
                Adata.cateNewList = cateNameListOA.join(",")
            }
            var logisAttrArr = [];
            $("#addprohibitconfForm_prohibitconf").find("[name='logisAttrList']:checked").each(function () {
                logisAttrArr.push(this.value);
            });
            var logisAttrList = logisAttrArr.join(",");
            Adata.logisAttrList = logisAttrList;
            var productLabelarr = [];
            $("#addprohibitconfForm_prohibitconf").find("[name='productLabelList']:checked").each(function () {
                productLabelarr.push(this.value);
            });
            var productLabelList = productLabelarr.join(",");
            Adata.productLabelList = productLabelList;
            $.ajax({
                type: "POST",
                url: ctx + "/prohibit/editProhibit.html",
                data: JSON.stringify(Adata),
                async: false,
                contentType: 'application/json',
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == '0000') {
                        layer.msg('保存成功')
                        layer.closeAll()
                        active.reload('prohibitconfTable')
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                }
            });
        }

        // 初始化固定禁售编辑弹窗组件
        function init_prohibitconf_fixedUnlistAbleEditLayer(conf) {
            $('#prohibitconf_fixedUnlistAbleAddBtn').click(function () {
                let Adata = serializeObject($('#prohibitconf_fixedUnlistAbleEditForm'))
                let ajax = new Ajax()
                ajax.post({
                    url: '/prohibit/AddFixedUnListAblePsku.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            $('#prohibitconf_fixedUnlistAbleEditForm [name]:visible').val('')
                            layer.alert('成功添加 ' + res.data.succNum + '个；' + (res.data.unexist ? ('以下父Sku不存在:' + res.data.unexist ) : ''))
                            prohibitconf_renderFixedUnlistAbleTable()
                        }
                    }
                })
            })

            $('#prohibitconf_fixedUnlistAbleBatchDelBtn').click(function () {
                var checkStatus = table.checkStatus('prohibitconf_fixedUnlistAbleTable'),
                    data = checkStatus.data;
                if (!data || data.length == 0) {
                    layer.msg('请选择要删除的父sku')
                    return
                }
                let idList = []
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let Adata = {
                    idList: idList
                }
                let ajax = new Ajax()
                ajax.post({
                    url: '/prohibit/removeFixedUnListAblePsku.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('操作成功')
                            prohibitconf_renderFixedUnlistAbleTable()
                        }
                    }
                })
            })

            // 导出
            $('#prohibitconf_exportfixedUnlistBtn').click(function () {
                let data = getSearchParam_QueryFixedUnList()
                var tip = '确认导出当前搜索条件下的固定禁售PSku？'
                var Confirmindex = layer.confirm(tip, { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/prohibit/exportFixedUnListAble.html', '_blank')
                    layer.close(Confirmindex)
                })
            })
        }
        function getSearchParam_QueryFixedUnList() {
            let data = serializeObject($('#prohibitconf_fixedUnlistAbleEditForm'));
            let searchFormElem = $('#prohibitconf_fixedUnlistAbleSearchForm')
            let accurateSelected = searchFormElem.find('input[name=accurate]').val();
            let vagueSelected = searchFormElem.find('input[name=vague]').val();
            data.fixedInableMsg = vagueSelected;
            data.prodPSkuList = accurateSelected.replace(/，/g,',')
            delete data.salesSite
            return data
        }
        // 渲染固定禁售sku
        function prohibitconf_renderFixedUnlistAbleTable () {
            $('#prohibitconf_fixedUnlistAbleSearchBtn').on('click', function () {
                let data = getSearchParam_QueryFixedUnList()
                table.render({
                    elem: "#prohibitconf_fixedUnlistAbleTable",
                    method: "post",
                    url: ctx + "/prohibit/queryFixedUnListAble",
                    where: data,
                    cols: [
                        [
                            //标题栏
                            { type: "checkbox" },
                            { field: "prodPSku", title: "父sku", width: 200 },
                            { field: "creator", title: "添加人", width: 100 },
                            { field: "createTime", title: "添加时间", width: 200 },
                            { field: "fixedInableMsg", title: "备注" }
                        ],
                    ],
                    id: 'prohibitconf_fixedUnlistAbleTable',
                    page: true,
                    limits: [100, 500, 1000],
                    limit: 100,
                    done: function (res, curr, count) {
                    }
                });
            });
        }

        table.on('tool(linkedPskuTable)', function (obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent === 'copy') {
                copyTxtToClipboard(data.pSkuStr)
            }
        })
    });
})();

function onmouseOverForBox(self) {
    $(self).css('width', self.offsetWidth + 'px')
    $(self).text('删除')
}
function onmouseOutForBox(self) {
    $(self).text($(self).attr('data-cateName'))
}

function delOneCateBox(self) {
    var cateId = $(self).attr('data-cateId')
    var cateName = $(self).attr('data-cateName')
    var oldCateIdArr = $('#addprohibitconfForm_prohibitconf [name=cateIdList]').val().split(',')
    var oldCateArr = $('#addprohibitconfForm_prohibitconf [name=cateList]').val().split(',')

    for (var i = 0; i < oldCateIdArr.length; ++i) {
        if (cateId == oldCateIdArr[i]) {
            oldCateIdArr.splice(i, 1)
        }
    }
    for (var i = 0; i < oldCateArr.length; ++i) {
        if (cateName == oldCateArr[i]) {
            oldCateArr.splice(i, 1)
        }
    }
    $('#addprohibitconfForm_prohibitconf [name=cateIdList]').val(oldCateIdArr.join(','))
    $('#addprohibitconfForm_prohibitconf [name=cateList]').val(oldCateArr.join(','))
    $(self).remove()
}

function delOneCateBox_oa(self) {
    var cateId = $(self).attr('data-cateId')
    var cateName = $(self).attr('data-cateName')
    var oldCateIdArr = $('#addprohibitconfForm_prohibitconf [name=cateOAIdList]').val().split(',')
    var oldCateArr = $('#addprohibitconfForm_prohibitconf [name=cateOAList]').val().split(',')

    for (var i = 0; i < oldCateIdArr.length; ++i) {
        if (cateId == oldCateIdArr[i]) {
            oldCateIdArr.splice(i, 1)
        }
    }
    for (var i = 0; i < oldCateArr.length; ++i) {
        if (cateName == oldCateArr[i]) {
            oldCateArr.splice(i, 1)
        }
    }
    $('#addprohibitconfForm_prohibitconf [name=cateOAIdList]').val(oldCateIdArr.join(','))
    $('#addprohibitconfForm_prohibitconf [name=cateOAList]').val(oldCateArr.join(','))
    $(self).remove()
}