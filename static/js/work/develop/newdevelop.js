var newdevelop_onEditDetailDto
var newdevelop_logisAttrList
var priceTableList = []
let allDataIdList = []
let newTableList = []
let currentSkuId = ''
let isDetail = false
let cateName = ''
let isUseDraft = false
// var newdevelop_fbacateList = ['正常分类', '美妆', '服装与配饰', '母婴（非服饰）', '家具（含户外家具）', '个护健康（含个护用品）', '工业和科学用品', '电子产品配件', '珠宝首饰', '汽车用品', '钟表', '食品', '消费类电子产品']
var newdevelop_fbacateList = {}
const newdevelop_showfbaByTypeList = ['13','12','17'] // 选择亚马逊精铺/精品/铺货开发类型的 FBA定价页面默认展示出来 改为必填
layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'element', 'layedit', 'formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        formSelects = layui.formSelects,
        form = layui.form
    form.render(null, 'component-form-element')

    formSelects.render('currentStatus_newdevelop')
    formSelects.render('typeStr_newdevelop')
        //日期范围
    laydate.render({
            elem: '#pd_searchTime',
            range: true
        })
        // 初始化跳转参数
    initSearchParam('#pd_searchForm')

    window.addEventListener('message', function(event){
        let { origin, title } = event.data || {}
        if (origin == 'plugin') {
            $('#pd_searchForm').find('[name=searchType]').val('1')
            $('#pd_searchForm').find('[name=searchValue]').val(title)
            form.render('select')
            setTimeout(() => {
                $('#pd_searchBtn').trigger('click')
            }, 100)
        }
    })

    newdevelopRenderProdTags('newdevelop_prodTagsSearch');
    //渲染商品标签
    function newdevelopRenderProdTags(id, defaultVal){
      commonReturnPromise({
        url: '/lms/preProdDev/queryProdTags.html'
      }).then(res => {
        //订单标签
        commonRenderSelect(id, res, { name: "name", code: "name" }).then(function () {
          formSelects.render(id);
          if(defaultVal){
            formSelects.value(id, defaultVal.split(','));
          }
        })
      });
    }

     //oa新类目点击展开
     $('#plat_choose_outside_newdevelop').click(function() {
        cateLayerOpen('oa','layer_work_newdevelop_pl','pd_searchForm_cateName', '#itemCat_input_newdevelop')
    })
    $('#prod_clearPlat_outside_newdevelop').click(function() {
        $('#plat_chooseid_inp_outside_newdevelop').val('')
        $('#pd_searchForm_cateName').text('')
    })

    //监听表格寻找货源点击事件
    $('#newdevelopCard').on('click', '.searchSupply', function(){
      let picUrl = $(this).attr('data-image');
      if(!picUrl){
        return layer.msg('无图片不可查找货源', {icon: 7});
      }
      window.open('https://www.1688.com?pordUrl=' + picUrl)
    //   commonSearchGoodsComponents(picUrl);
    });

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
                $('#itemCat_input').keypress(async function (e) {
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
                $('#LAY-iframe-itemCat-getCates').on('click', 'li', async function (value) {
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
                //  基础模板，oa新类目查询，能支持选中三级二级一级类目，去查询
                if (cateTreeName==undefined) {
                    return
                }
                if (plat === 'oa') {
                    $('#' + show).text(cateTreeName);
                    store.OATreeName = cateTreeName;
                    store.OAName = cateName;
                    store.cateOaId = cateId;
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
            $('#LAY-iframe-itemCat-getCates').html(str);
        } else {
            if (cateName === '') {
                $('#LAY-iframe-itemCat-getCates').append(str);
            } else {
                $('#LAY-iframe-itemCat-getCates').html(str);
                $('#LAY-iframe-itemCat-getCates').find('.layui-col-xs3.layui-col-md3.mr10').css('width','50%')
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

        $('.catechoose_Form h3').addClass('disN')  //关闭类目属性展示
        $('.cateAttrBoxInner').html('')
        layui.form.render('select')
    }

    let newTableCols = [
        [{ type: 'checkbox', width: '2%' }
        , { field: 'image', title: '缩略图', templet: '#pd_imageTpl', width: '6%' }
        , { field: '', title: 'SKU', width: '5%', templet: '<div>{{d.pSku||""}}</div>' }
        , { field: 'cnName', title: '中文名', templet: '#pd_titleTpl', width: '10%' }
        , { field: 'type', title: '开发类型', templet: '#pd_devTypeTpl' }
        , { field: 'devnote', title: '开发备注', templet: '#tpl_devNote' }
        , { field: 'currentStatus', title: '状态', templet: '#pd_currentStatusTpl' }
        , { field: 'purchaseNote', title: '采样备注' }
        , { field: 'firstAuditNote', title: '初审备注' }
        , { field: 'teamLeaderNote', title: '组长备注' }
        , { field: 'managerAuditRemark', title: '主管备注' }
        , { field: 'bossAuditRemark', title: '老板备注' }
        , { field: 'creator', title: '人员', minWidth: 125, templet: '#newdevelop_personTpl' }
        , { field: 'createTime', title: '时间', templet: '#pd_timeTpl', minWidth: 100 }
        , { title: '操作', toolbar: '#pd_editBar' }]
    ]

    function initPage_newdevelop(data) {
        table.render({
            elem: '#newTable',
            url: ctx + '/preProdDev/pageQuery.html',
            where: data,
            method: 'post',
            // height: 'full-0',
            page: true,
            even: true,
            limits: [100, 500, 1000], // 每页条数的选择项
            limit: 100, // 默认显示50条
            cols: newTableCols,
            done: function(res, curr, count) {
                allDataIdList = res.extra || []
                newTableList = res.data || []
                admin.load.hide()
                imageLazyload()
                    // 超时的行，标记为黄色
                setRowBackColor('.devOverTime', { 'background-color': 'rgba(253, 253, 144,0.35)' })
            }
        })

    }

    // 初始化 组织-人员选择框
    render_hp_orgs_users('#pd_searchForm')

    // 图片删除功能
    $('body').on('keyup', '.newdevelop_imageEditDiv', function(e) {
            var e = e ? e : event
            var k = e.keyCode || e.which
            if (k == 8) {
                this.innerHTML = ''
            }
        })
        // 计算fba汇总信息
    $('body').on('change', '.newdevelop_calFbaTotalCost', function() {
        newdevelop_calFbaTotalCost()
    })


    table.on('tool(pd_table_filter)', function(obj) {
            var layEvent = obj.event // 获得 lay-event 对应的值
            var data = obj.data // 获得当前行数据
            if (layEvent === 'pd_detail') {
                var index = layer.open({
                    type: 1,
                    title: '详情',
                    area: ['90%', '90%'],
                    shadeClose: false,
                    content: $('#xiangqingLayer').html(),
                    id: 'xiangqingLayerDetailId',
                    success: function(layero) {
                        layuiOpenPop = true // 禁用 回车搜索功能
                        isDetail = true
                        $('#preProdEditFrom [name=id]').val(data.id)
                        // 初始化组件
                        initDetailLayerComponent()
                        // 获取原数据
                        currentSkuId = data.id
                        getProdDetail(data.id)
                        // 获取日志记录
                        getProdLogs(data.id)
                        
                        // 是否主管
                        let option = ''
                        if (selfRoleNameList.indexOf('开发主管') >= 0) {
                            option = `<option value="3">通过且无需老板审核</option>`
                        }
                        // 弹框底边栏样式
                        var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
                            $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:0;left:30px;display:flex">   
                                        <div class="layui-inline" data-up="true">
                                                    <select type="text" class="layui-input" id="pd_auditResult" placeholder="审核结果" style="height:30px">
                                                    <option value="">请选择审核结果</option>
                                                    <option value="1">通过</option>
                                                    ` + option + `
                                                    <option value="0">失败</option>
                                                    </select>
                                                </div> 
                                                <div class="layui-inline">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="checkProd">审核</button>
                                                </div>
                                                <div class="layui-inline">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="nextDetailBtn">下一个</button>
                                                </div>
                                        <div class="layui-inline" data-up="true">
                                            <select type="text" class="layui-input" id="failReason" placeholder="失败原因" style="height:30px">
                                            <option value="">选择失败原因,必填</option>:auditFailReasons</select>
                                        </div> 
                                        <div class="layui-inline">
                                            <textarea placeholder="审核备注" id="teamLeaderNote"
                                            style="min-height:32px;height:32px;width:300px" class="layui-textarea"></textarea>
                                        </div>     
                                        <div class="layui-inline">
                                            <select type="text" class="layui-input" id="tempType" name="tempType" lay-filter="tempType" placeholder="模板类型" style="height:30px">
                                            <option value="">选择模板类型</option>:tempType</select>
                                        </div>        
                                    </div>`
                            var auditFailReasons = ''
                            for (var i = 0; i < reasonArray.length; i++) {
                                auditFailReasons += '<option value=' + reasonArray[i] + '>' + reasonArray[i] + '</option>'
                            }
                            $html = $html.replace(':auditFailReasons', auditFailReasons)
                            
                        // 获取审核模板类型
                        getCheckTempType(function() {
                            var checkTempType = ''
                            for (var i = 0; i < checkTempTypeList.length; i++) {
                                checkTempType += '<option value=' + checkTempTypeList[i].name + '>' + checkTempTypeList[i].name + '</option>'
                            }
                            $html = $html.replace(':tempType', checkTempType)
                            $target.append($html)
                            form.render()
                            
                            form.on('select(tempType)', function(data) {
                                $('#teamLeaderNote').val(data.value)
                            })
                            $('#nextDetailBtn').on('click', function(){
                                let currentIndex = allDataIdList?.findIndex((item) => item == currentSkuId)
                                let nextId = allDataIdList[currentIndex + 1]
                                if(!nextId) {
                                    layer.msg('已经是最后一条数据了')
                                    return
                                }
                                // 获取原数据
                                getProdDetail(nextId, true)  
                                // 获取日志记录
                                getProdLogs(nextId, true)
                                resetCheckInfo()
                            })
                            $('#checkProd').on('click', function(){
                                auditPreProd();
                            })
                        })

                        //ztt20230831 查找货源功能
                        layero.on('click', '.searchSupply', function(){
                          let $img = $(this).parents('.layui-col-lg6').find('.newdevelop_imageEditDiv>img');
                          if($img.length > 0){
                            let imgSrc = $img.attr('src');
                            // commonSearchGoodsComponents(imgSrc);
                            window.open('https://www.1688.com?pordUrl=' + imgSrc)
                          }else{
                            layer.msg('请先黏贴图片', {icon: 7});
                          }
                        });
                    },
                    end: function() {
                        $('#preProdEditFrom').trigger('reset')
                        $('#preProdEditFrom').find('input[name=\'id\']').val('')
                        layuiOpenPop = false // 开启 回车搜索功能
                        newdevelop_onEditDetailDto = null
                        $('#priceList_Tbody').html()
                        priceTableList = []
                    },
                    btn: ['保存', '取消'],
                    yes: function(index, layero) {
                        submit_preProd(null, true)
                        return false
                    }
                })
            } else if (layEvent === 'addPurchase') {
               addSampleInfo('newdevelop', data)
               
            } else if (layEvent === 'sampleOK') {
                let popIndex = layer.open({
                    type: 1,
                    title: '采样完成',
                    shade: 0, // 遮罩透明度
                    area: ['600px', '600px'],
                    content: $('#finishPurLayer').html(),
                    btn: ['提交', '关闭'],
                    success: function() {
                        form.render('radio', 'finishPurForm')
                    },
                    yes: function(index, layero) {
                        var Adata = {
                            id: data.id,
                            success: $('#finishPurForm').find('[name=success]:checked').val(),
                        }
                        if (Adata.success === undefined) {
                            layer.msg('请选择是否采样成功')
                            return false
                        } else {
                            Adata.success = (Adata.success === '1')
                        }
                        loading.show()
                        $.ajax({
                            type: 'post',
                            url: ctx + '/preProdDev/sampleOk.html',
                            dataType: 'json',
                            data: Adata,
                            success: function(returnData) {
                                loading.hide()
                                if (returnData.code === '0000') {
                                    layer.close(popIndex)
                                    refreshTable()
                                    layer.msg('处理提交成功')
                                } else {
                                    layer.msg(returnData.msg)
                                }
                            },
                            error: function() {
                                layer.msg('发送请求失败')
                            }
                        })
                    }
                })
            } else if (layEvent === 'requirePicture') {
                let popIndex = layer.open({
                    type: 1,
                    title: '提交图片需求',
                    shade: 0, // 遮罩透明度
                    area: ['600px', '600px'],
                    content: $('#newdevelop_requirePicture').html(),
                    btn: ['提交', '关闭'],
                    success: function() {
                        form.render('select','newdevelop_requirePictureForm')
                        let formElem = $('#newdevelop_requirePictureForm')
                        formElem.find('[name=ifAll_selfPhoto]').attr('title', data.pSku)
                        form.on('checkbox(ifAll_selfPhoto)', function(cData) {
                            var checked = cData.elem.checked
                            formElem.find('#sub_need_box input').prop('checked', checked)
                            form.render('checkbox')
                        })
                        loading.show()
                        $.ajax({
                            type: 'post',
                            url: ctx + '/preProdDev/getSInfoListByPId',
                            dataType: 'json',
                            data: { prodPId: data.prodPId },
                            success: function(res) {
                                loading.hide()
                                if (res.code === '0000') {
                                    var list = res.data
                                    var box = formElem.find('#sub_need_box')
                                    var inp
                                    for (var i = 0; i < list.length; ++i) {
                                        inp = $('<div><input type="checkbox" name="subNeedIds" lay-skin="primary" value="' + list[i].id + '" title="' + list[i].sSku + '"/></div>')
                                        box.append(inp)
                                    }
                                    form.render('checkbox')
                                    refreshTable()
                                } else {
                                    layer.msg(res.msg)
                                }
                            }
                        })
                    },
                    yes: function(index, layero) {
                        let formElem = $('#newdevelop_requirePictureForm')
                        var checkedInps = formElem.find('[name=subNeedIds]:checked')
                        var subNeedIds = []
                        for (var i = 0; i < checkedInps.length; ++i) {
                            subNeedIds.push(checkedInps[i].value)
                        }
                        if (subNeedIds.length === 0) {
                            layer.msg('请选择需要拍图的子sku')
                            return false
                        }
                        var Adata = {
                            devId: data.id,
                            pictureRequireDir: formElem.find('[name=pictureRequireDir]').val(),
                            tplType: formElem.find('[name=tplType]').val(),
                            subNeedIds: subNeedIds.join(',')
                        }

                        if (Adata.tplType == null || Adata.tplType === '') {
                            layer.msg('请选择模版类型')
                            return
                        }
                        oneAjax.post({
                            url: '/preProdDev/requirePicture',
                            data: Adata,
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            success: function(returnData) {
                                if (returnData.code === '0000') {
                                    layer.close(popIndex)
                                    refreshTable()
                                    layer.msg('处理提交成功')
                                } else {
                                    layer.msg(returnData.msg)
                                }
                            },
                            error: function() {
                                layer.msg('发送请求失败')
                            }
                        })
                    }
                })
            } else if (layEvent === 'devOK') {
                var index = layer.open({
                    type: 1,
                    title: '开发完成',
                    shade: 0, // 遮罩透明度
                    area: ['600px', '200px'],
                    content: $('#finishPurOrDevLayer').html(),
                    success: function() {
                        $('#finishPurOrDev input[name=\'ids\']').val(data.id)
                        $('#pd_type').val('dev')
                    },
                    end: function() {
                        $('#finishPurOrDev')[0].reset()
                    },
                    btn: ['提交', '关闭'],
                    yes: function(index, layero) {
                        $('#submitPurOrDev').trigger('click')
                        layer.close(index)
                        refreshTable()
                    }
                })
            } else if (layEvent === 'publish') {
                oneAjax.post({
                    url: '/preProdDev/publish',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        refreshTable()
                        if (returnData.code == '0000') {
                            layer.msg('发布成功')
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
                return false
            } else if (layEvent === 'publishToManager') {
                oneAjax.post({
                    type: 'post',
                    url: '/preProdDev/publishToManager',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        refreshTable()
                        if (returnData.code == '0000') {
                            layer.msg('提交主管重新审核成功')
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
                return false
            } else if (layEvent === 'del') {
                layer.confirm('确认删除这条数据吗？', ['确认', '取消'],
                    function() {
                    loading.show()
                        $.ajax({
                            type: 'post',
                            url: ctx + '/preProdDev/del.html',
                            dataType: 'json',
                            data: { 'id': data.id },
                            success: function(returnData) {
                                loading.hide()
                                if (returnData.code == '0000') {
                                    refreshTable()
                                    layer.msg('删除成功')
                                } else {
                                    layer.msg(returnData.msg)
                                }
                            },
                            error: function() {
                                layer.msg('发送请求失败')
                            }
                        })
                        layer.closeAll()
                    },
                    function() {
                        layer.closeAll()
                    }
                )
            } else if (layEvent === 'markSample') {
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/sampling.html',
                    dataType: 'json',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == '0000') {
                            refreshTable()
                            layer.msg(returnData.msg)
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            } else if (layEvent === 'notDevOK') {
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/noPhotoToNotDevOk.html',
                    dataType: 'json',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == '0000') {
                            refreshTable()
                            layer.msg(returnData.msg)
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            } else if (layEvent === 'noPhoto') {
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/notDevOkToNoPhoto.html',
                    dataType: 'json',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == '0000') {
                            refreshTable()
                            layer.msg(returnData.msg)
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            } else if (layEvent === 'devFail') {
                var index = layer.open({
                    type: 1,
                    title: '确定将商品标记开发失败吗?',
                    area: ['400px', '400px'],
                    btn: ['确定', '取消'],
                    shade: 0, // 遮罩透明度
                    content: $('#newdevelop_preproduct_fail_reason').html(),
                    id: 'newdevelop_preproduct_fail_reasonId',
                    success: function(layero, index) {
                        form.render()
                        initBizzTag('#preproduct_fail_reason_options', 'MSG_PREPRODUCT_DEV_FAIL_TYPE', true, true, null, null, null)
                    },
                    yes: function(index, layero) {
                        let obj = layero.find('[name=reason_options]').val()
                        if (obj) {
                            loading.show()
                            commonReturnPromise({
                                url: ctx + '/preProdDev/devFail.html',
                                type: 'post',
                                contentType: 'application/json;charset=utf-8',
                                params: JSON.stringify({ devFailType: obj, id: data.id }),
                            }).then(res => {
                                loading.hide()
                                layer.alert(res, { icon: 1 })
                                layer.close(index)
                                refreshTable()
                            }).catch(err => {
                                console.log('err :>> ', err)
                                return layer.msg(err)
                            })
                        } else {
                            return layer.msg('请选择原因')
                        }
                    }
                })

            } else if (layEvent === 'restartDev') {
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/restartDev.html',
                    dataType: 'json',
                    data: { 'id': data.id },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == '0000') {
                            refreshTable()
                            layer.msg(returnData.msg)
                        } else {
                            layer.msg(returnData.msg)
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            }
    })
        // 搜索提交
    $('#pd_searchBtn').click(function() {
        var data = serializeObject($('#pd_searchForm'))
        data[data.creatorIdType] = $('#pd_searchForm [name=devPersonCreator] option:selected').val()
        if (data.organize) {
            if (!data.devPersonCreator) {
                var creatorIdList = []
                var options = $('#pd_searchForm [name=devPersonCreator] option')
                var value
                for (var i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        creatorIdList.push(value)
                    }
                }
                data[data.creatorIdType] = creatorIdList.join(',')
            }
        }
        delete data.creatorIdType
        delete data.devPersonCreator

        if (data.selfPhotoStatus != '') {
            data.selfPhotoStatus = parseInt(data.selfPhotoStatus)
        }
        initPage_newdevelop(data)
    })

    $(body).on('click','#newdevelop_fbaProdTitle',function () {
        $('#newdevelop_fbaProdContains').toggle();
    })

    // 采样或开发完成提交
    form.on('submit(submitPurOrDev)', function(data) {
        var url = ctx + '/preProdDev/devOk.html'
        loading.show()
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: data.field,
            success: function(returnData) {
                loading.hide()
                if (returnData.code == '0000') {
                    layer.closeAll()
                        // active['reload'].call()
                    layer.msg('操作成功')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
        return false
    })

    /**
     * 多级类目渲染
     * @param selectedId 默认选择的类目id
     * @param cateIdSelector cateId元素选择器
     * @param cateNameSelector cateName元素选择器
     * @param mustLeafCate 是否必须选叶子节点   true/false
     */
    function showCateTree(selectedId, cateIdSelector, cateNameSelector, mustLeafCate) {
        console.log(selectedId)
        var cateXTree_newdevelop
        var catePop = layer.open({
            type: 1,
            title: '类目选择(此处仅单选)',
            id: 'cateLayer',
            area: ['60%', '85%'],
            content: $('#cateLayer_newdevelop').html(),
            btn: ['确定'],
            success: function() {
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/getAvailabelCate.html',
                    dataType: 'json',
                    success: function(res) {
                        loading.hide()
                        cateXTree_newdevelop = new layuiXtree({
                            elem: 'cateXTree_newdevelop', //(必填) 放置xtree的容器id，不要带#号,
                            id: 'cateXTree',
                            form: form, //(必填) layui 的 from,
                            isopen: false, //加载完毕后的展开状态
                            isCheckOnly: true,
                            isParentChangeCheck: true,
                            data: res.data, //(必填) json数组
                            color: { //三种图标颜色，独立配色，更改几个都可以
                                open: '#EE9A00', //节点图标打开的颜色
                                close: '#EEC591', //节点图标关闭的颜色
                                end: '#828282', //末级节点图标的颜色
                            },
                            click: function(data) { //节点选中状态改变事件监听，全选框有自己的监听事件
                                cateXTree_newdevelop.SetOtherCheckedFalse(data.value)
                            }
                        })
                        cateXTree_newdevelop.render()
                        if (selectedId) {
                            cateXTree_newdevelop.setCheckedByValue(selectedId) // 默认勾选一选择类目
                            cateXTree_newdevelop.OpenByLeafValue(selectedId) // 默认展开已选择分支
                        }
                    }
                })

                // 绑定搜索功能
                $('#cateSearchInp_newdevelop').keyup(function(event) {
                    if (event.keyCode == 13) {
                        var title = $('#cateSearchInp_newdevelop').val().trim()
                        if (title) {
                            cateXTree_newdevelop.searchLikeByTitle(title)
                        }
                    }
                })
                $('#searchCateBtn_newdevelop').click(function() {
                    var title = $('#cateSearchInp_newdevelop').val().trim()
                    if (title) {
                        cateXTree_newdevelop.searchLikeByTitle(title)
                    }
                })

            },
            yes: function(index, layero) {
                var cateBox
                if (mustLeafCate) {
                    cateBox = cateXTree_newdevelop.GetChecked()[0]
                    if (!cateBox) {
                        layer.msg('请选择1个叶子节点类目')
                        return
                    }
                } else {
                    cateBox = cateXTree_newdevelop.GetCheckedIncludeParent()[0]
                }
                $(cateIdSelector).val(cateBox.value)
                $(cateNameSelector).text(cateBox.getAttribute('remark'))
                layer.close(catePop)
            }
        })
    }

    // 产品转移弹出框
    $('#newdevelop_changeDevBtn').click(function() {
        var index = layer.open({
            type: 1,
            title: '产品转移',
            id: 'changeDev',
            area: ['500px', '500px'],
            btn: ['保存'],
            yes: function(index, layero) {
                var newCreator = $('#pd_newCreator').val()
                if (newCreator == '') {
                    layer.msg('请选择开发')
                    return
                }
                var checkStatus = table.checkStatus('newTable')
                var ids = []
                if (checkStatus.data.length > 0) {
                    for (var i = 0; i < checkStatus.data.length; i++) {
                        ids.push(checkStatus.data[i].id)
                    }
                } else {
                    layer.msg('请选择新品')
                    return
                }
                loading.show()
                $.ajax({
                    type: 'post',
                    url: ctx + '/preProdDev/changeCreator.html',
                    dataType: 'json',
                    data: { 'prodIds': ids.join(','), 'creatorId': newCreator },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == '0000') {
                            layer.closeAll()
                            refreshTable()
                        }
                        layer.msg(returnData.msg)
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            },
            shadeClose: false,
            content: $('#newdevelop_changeDevLayer').html(),
            success: function(layero) {
                form.render('select')
                layuiOpenPop = true
            },
            end: function() {
                $('#pd_changeDev').trigger('reset')
                layuiOpenPop = false
            }
        })
    })

    // 新品导出
    $('#newdevelop_exportBtn').click(function() {
        var data = serializeObject($('#pd_searchForm'))
        data[data.creatorIdType] = $('#pd_searchForm [name=devPersonCreator] option:selected').val()
        if (data.organize) {
            if (!data.devPersonCreator) {
                var creatorIdList = []
                var options = $('#pd_searchForm [name=devPersonCreator] option')
                var value
                for (var i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        creatorIdList.push(value)
                    }
                }
                data[data.creatorIdType] = creatorIdList.join(',')
            }
        }
        delete data.creatorIdType
        delete data.devPersonCreator

        if (data.selfPhotoStatus != '') {
            data.selfPhotoStatus = parseInt(data.selfPhotoStatus)
        }

        layer.confirm('确定导出当前查询条件下的所有数据？', {
            btn: ['确定'] //按钮
        }, function() {
            if (!data.createTimeStr || data.createTimeStr == '') {
                layer.msg('请选择导出创建起止时间')
                return
            }
            submitForm(data, ctx + '/preProdDev/exportPreProds.html')
            layer.closeAll()
        })

    })

    // 以图搜图
    $("#newdevelop_searchImgBtn").click(function() {
        handleSearchImage('showDevelopNew', '#pd_searchBtn');
    })


    // 是否有供应商图片 单选
    form.on('checkbox(newdevelop_hasSupplierImg_check)', function(data) {
        var value = data.value
            // 单选且必选
        let otherStatusCheck = $('#newdevelop_hasSupplierImgBox').find('input:checked')
        otherStatusCheck.prop('checked', false)
        data.elem.checked = true
        console.log('是否选中: ', value)
        form.render('checkbox', 'newdevelop_hasSupplierImgBox')
            // $('#FBAdeliverySearch').click()
    })

    // 新增新品页面
    $('#newdevelop_NewdevelopBtn').click(function() {
        var index = layer.open({
            type: 1,
            title: '新增新品',
            id: 'devSuccess',
            area: ['90%', '90%'],
            shadeClose: false,
            content: $('#xiangqingLayer').html(),
            id: 'xiangqingLayerId',
            success: function(layero) {
                priceTableList = []
                layuiOpenPop = true // 禁用 回车搜索功能
                isDetail = false
                let formElem = $('#preProdEditFrom')
                    //类目选择
                $('#xtreeDetailBtn').click(function() {
                    cateLayerOpenOnlyLeaf('oa','','pd_work_develop_pl','preProdEditFrom_cateName', 'plat_choose_inp','preProdEditFrom_cateId')
                    })
                    // 不允许编辑psku
                formElem.find('[name=pSku]').attr('disabled', 'disabled')
                formElem.find('[name=tplPSku]').attr('disabled', 'disabled')
                    // 隐藏页签/按钮
                $('#newdevelop_detail_layer_tab').hide()
                $('#newdevelop_saveAndReuqireDeliver').hide()
                    // 组件初始化
                initDetailLayerComponent()

                let cropImgUrl = localStorage.getItem('cropImgUrl') || ''
                if (cropImgUrl) {
                    let imgBox = $('#image_edit0')
                    imgBox.html('<img src="' + cropImgUrl + '" class="imgCss" style="width:150px;height:150px;border:1px solid #f2f2f2">')
                }

                // // 保存草稿
                // $('#xiangqingLayerId')[0].addEventListener('input', debounceInput(saveProdDetial, 1000))
                // // 草稿--商品标签
                // formSelects.on('newdevelop_prodTags', debounceInput(saveProdDetial, 1000))
                // form.on('checkbox(logisticAttr)', debounceInput(saveProdDetial, 100))
                // form.on('select(newdevelop_priceCate)', debounceInput(saveProdDetial, 100))
                // form.on('select(newdevelop_priceLogisticsAttr)', debounceInput(saveProdDetial, 100))
                // form.on('select(compSelCurrencyChose)', debounceInput(saveProdDetial, 100))
                // form.on('checkbox(compSelSimilarChose)', debounceInput(saveProdDetial, 100))

                //  // 创建 MutationObserver 实例
                // let observer = new MutationObserver(function(mutationsList) {
                //     for(var mutation of mutationsList) {
                //         if(mutation.attributeName === 'value') {
                //             var newValue = mutation.target.value;
                //             saveProdDetial()
                //         }
                //         if (mutation.type === 'childList') {
                //             var spanElem = mutation.target;
                //             var newValue = spanElem.textContent;
                //             cateName = newValue
                //             saveProdDetial()
                //         }
                //     }
                // });
                // observer.observe($('#preProdEditFrom_cateId')[0], { attributes: true });
                // observer.observe($('#preProdEditFrom_cateName')[0], { childList: true });

                let addProdDetailInfo = JSON.parse(window.localStorage.getItem('addProdDetailInfo'))
                isUseDraft = false
                if(addProdDetailInfo && addProdDetailInfo.length != 0){
                    let Confirmindex = layer.confirm('存在草稿，是否恢复草稿数据', { btn: ['使用草稿','清除草稿记录','仅关闭'] }, function() {
                        isUseDraft = true
                        initAddProdDetailInfo(addProdDetailInfo, 'save')
                        layer.close(Confirmindex)
                    }, function() {
                        window.localStorage.removeItem('addProdDetailInfo')
                    })
                }
                layero.on('click', '.searchSupply', function(){
                    let $img = $(this).parents('.layui-col-lg6').find('.newdevelop_imageEditDiv>img');
                    if($img.length > 0){
                        let imgSrc = $img.attr('src');
                        // commonSearchGoodsComponents(imgSrc);
                        window.open('https://www.1688.com?pordUrl=' + imgSrc.split("!size=")[0])
                    }else{
                        layer.msg('请先黏贴图片', {icon: 7});
                    }
                });
            },
            btn: ['保存', '保存并发布', '保存草稿'],
            yes: function(index, layero) {
                submit_preProd(0)
                $('#priceList_Tbody').html()
                priceTableList = []
                return false
            },
            btn2: function(index, layero) {
                submit_preProd(11)
                $('#priceList_Tbody').html()
                priceTableList = []
                return false
            },
            btn3: function(index, layero) {
                saveProdDetial()
                return false
            },
            end: function() {
                localStorage.removeItem('cropImgUrl')
                $('#priceList_Tbody').html()
                priceTableList = []
                layuiOpenPop = false // 启用 回车搜索功能
            }
        })
    })

    
    function debounceInput(callback, time) {
        let timer = null
        return function() {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(callback, time)
        }
    }

    // 保存草稿
    function saveProdDetial() {
        if (!isDetail) {
            let formElem = $('#preProdEditFrom')
            // 获取值
            let receiveDataObj = serializeObject(formElem),
                devNote = formElem.find('[name=devNote]').val()
            delete receiveDataObj.comPrice
            receiveDataObj.grossProfitRate = $('#grossProfitRateInput').val()
            // receiveDataObj.currentStatus = currentStatus
            receiveDataObj.devNote = devNote
            receiveDataObj.cateName = cateName
            // receiveDataObj.hasSupplierImg = hasSupplierImg === '1'
            if (!receiveDataObj.aliexpressCateForecast) {
                receiveDataObj.aliexpressCateForecast = null
            }
            // 获取FBA产品信息   
            let trList = $('#newdevelop_detail_fbaProdTbody>tr')
            let fbaProdList = []
            for (let i = 0; i < trList.length; ++i) {
                let currentTr = $(trList[i])
                let one = newdevelop_getFbaProdByTrEle(currentTr)
                let priceList = one.priceList
                fbaProdList.push(one)
            }
            receiveDataObj.fbaProdList = fbaProdList
    
    
            // 获取竞品的数据
            let comps = []
            let trs = $('#compList_editTbody').find('tr')
            for (let i = 0; i < trs.length; ++i) {
                let tdArr = $(trs[i])
                let comp = {}
                comp.id = tdArr.find('[name=id]').val() // id
                comp.platCode = tdArr.find('[name=platCode]').val() // 平台
                comp.siteCode = tdArr.find('[name=siteCode]').val() // 站点
                comp.url = tdArr.find('[name=url]').val() // 链接
                comp.salesNum = tdArr.find('[name=salesNum]').val() // 销量
                comp.price = tdArr.find('[name=price]').val() // 价格
                comp.currency = tdArr.find('[name=currency]').val() // 币种
                comp.isSimilar = tdArr.find('[name=isSimilar]').prop('checked') // 是否相似品
                comp.grossInRate = tdArr.find('[name=grossInRate]').val() // 毛利率
                comp.profit = tdArr.find('[name=profit]').val() // 利润
                comp.ratting = tdArr.find('[name=ratting]').val() // 评论数
                comp.score = tdArr.find('[name=score]').val() // 评分
                comp.cateRanking = tdArr.find('[name=cateRanking]').val() // 类目排名
                comp.launchTime = tdArr.find('[name=launchTime]').val() // 上架时间
                comp.salesMoney = tdArr.find('[name=salesMoney]').val() // 销售额
                comps.push(comp)
            }
    
            receiveDataObj.compList = comps
            // 获取图片数据
            let imgEles = $('#newdevelop_imageDiv').find('img')
            let imgArr = []
            for (let i = 0; i < imgEles.length; ++i) {
                let imgSrc = imgEles[i].src.indexOf('!') > -1 ? imgEles[i].src.split('!')[0] : imgEles[i].src;
                imgArr.push(imgSrc)
            }
            receiveDataObj.image = imgArr.join('||')
    
            // 根据 priceTableList 传入竞品价格
            priceTableList?.forEach(item => {
                receiveDataObj[item.comPriceName] = item.comPrice
            })
    
            window.localStorage.setItem('addProdDetailInfo',JSON.stringify(receiveDataObj))
            layer.msg('存草稿成功')
        }
    }

    function initAddProdDetailInfo(data, type = 'detail') {
        if(type === 'detail') {
            $('#firstAuditNote').removeClass('disN')
        }
        let formElem = $('#preProdEditFrom')
        newdevelop_onEditDetailDto = data
        $('#preProdEditFrom_cateName').text(data.cateName)
        formElem.find('[name=cateId]').val(data.cateId)
        formElem.find('[name=type]').val(data.type)
        newdevelop_showFbaProdContains(data.type)
        renderFormInput('preProdEditFrom', 'pSku', data.pSku)
        renderFormInput('preProdEditFrom', 'tplPSku', data.tplPSku)
        if (!data.pSku) {
            formElem.find('[name=pSku]').attr('disabled', 'disabled')
            formElem.find('[name=tplPSku]').attr('disabled', 'disabled')
        }
        $('#newDevUrl').val(data.newDevUrl)
        renderFormInput('preProdEditFrom', 'id', data.id)
        renderFormInput('preProdEditFrom', 'prodHotSaleId', data.prodHotSaleId)
        renderFormInput('preProdEditFrom', 'cnName', data.cnName)
        renderFormInput('preProdEditFrom', 'enName', data.enName)
        renderFormInput('preProdEditFrom', 'keyword', data.keyword)
        renderFormInput('preProdEditFrom', 'cost', data.cost)
        renderFormInput('preProdEditFrom', 'weight', data.weight)
        renderFormInput('preProdEditFrom', 'outerBoxLength', data.outerBoxLength)
        renderFormInput('preProdEditFrom', 'outerBoxWidth', data.outerBoxWidth)
        renderFormInput('preProdEditFrom', 'outerBoxHeight', data.outerBoxHeight)
        renderFormInput('preProdEditFrom', 'devNote', data.devNote)
        if (type === 'detail') {
            renderFormInput('preProdEditFrom', 'firstAuditNote', data.firstAuditNote)
        }
        renderFormInput('preProdEditFrom', 'festival', data.festival)
        // renderFormInput('preProdEditFrom', 'priceCate', data.priceCate)
        renderFormInput('preProdEditFrom', 'priceLogisticsAttr', data.priceLogisticsAttr)
        renderFormInput('preProdEditFrom', 'noAlonePackDesc', data.noAlonePackDesc)
        renderFormInput('preProdEditFrom', 'supplierImgRemark', data.supplierImgRemark)
        if (data.hasSupplierImg !== null && data.hasSupplierImg !== undefined) {
            let hasSupplierImg = data.hasSupplierImg ? '1' : '0'
            $('#newdevelop_hasSupplierImgBox').find('input[value=' + hasSupplierImg + ']').prop('checked', 'checked')
            form.render()
        }
        if (data.isAlonePack !== null && data.isAlonePack !== undefined) {
            renderFormInput('preProdEditFrom', 'isAlonePack', data.isAlonePack ? '1' : '0')
        }
        renderFormInput('preProdEditFrom', 'specialPackDesc', data.specialPackDesc)
        if (data.isSpecialPack !== null && data.isSpecialPack !== undefined) {
            renderFormInput('preProdEditFrom', 'isSpecialPack', data.isSpecialPack ? '1' : '0')
        }
        // 计算价值
        changeTotalValue(formElem.find('[name=cost]')[0])

        if (data.requireDeliver) {
            $('#newdevelop_saveAndReuqireDeliver').hide()
        }

        if (data.logisticAttr) {
            var combLogisAttrList = data.logisticAttr.split(',')
            for (var i = 0; i < combLogisAttrList.length; i++) {
                var checkAttr = $('#newdevelop_logisticAttr :checkbox[value=\'' + combLogisAttrList[i] + '\']')
                checkAttr.prop('checked', true)
            }
        }
        //图片
        let imageArr = data.image ? data.image.split('||') : []

        for (let i = 0; i < imageArr.length; ++i) {
            if (type === 'detail') {
                $('#image_edit' + i).html('<img src=' + prepIVP + imageArr[i] + ' class=\'imgCss img_show_hide\' style=\'width:150px;height:150px;border:1px solid #f2f2f2\' />')
            } else {
                $('#image_edit' + i).html('<img src=' + imageArr[i] + ' class=\'imgCss img_show_hide\' style=\'width:150px;height:150px;border:1px solid #f2f2f2\' />')
            }
        }
        //竞品数据渲染
        var compList = data.compList
        for (var i in compList) {
            var comp = compList[i]
                //undefined处理
            comp.grossInRate = comp.grossInRate || ''
            comp.profit = comp.profit || ''
            comp.isSimilar = comp.isSimilar || false
                //平台和币种处理
            var plat_sel = [],
                currency_sel = []
                /*getProdDetail里面的内容*/ 
            plat_curr_sel(plat_sel, salesPlatArray, comp.platCode) //平台
            plat_curr_sel(currency_sel, currencyArray, comp.currency) //币种

            let addTr  = '<td width="250" style="display: flex;align-items: center;"><input type="hidden" name="id" value="' + (comp.id || '') + '"><input type="text" name="url" value="' + comp.url + '"  onclick="newdevelop_routerTo(this.value)" onblur="newdevelop_queryRepeat(this)" class="layui-input canClickEl" style="display:inline-block;width:80%"><a class="layui-btn layui-btn-xs newdev_getTrInfo">信息粘贴</a></td>'
            let editTr  = '<td width="250" style="display: flex;align-items: center;"><input type="hidden" name="id" value="' + (comp.id || '') + '"><input type="text" name="url" value="' + comp.url + '"  onclick="newdevelop_routerTo(this.value)" onblur="newdevelop_queryRepeat(this)" class="layui-input canClickEl" style="display:inline-block;width:80%"><a class="layui-btn layui-btn-xs newdev_getTrInfo">信息粘贴</a><span name="repeatBox" onmouseout="removeTip(this,500)" data-ifrepeat='+ comp.ifRepeat +' data-repeatlist="'+ comp.repeatList?.join(',')+'"></span></td>'

            //html数组处理
            var tr_arr = [
                '<tr>',

                '<td width="100"><div class="layui-form"><select name="platCode" lay-filter="compSelPlatChose">' + plat_sel.join('') + '</select></div></td>',
                '<td width="100"><div class="layui-form"><select name="siteCode" lay-filter="compSelSiteChose" value="' + (comp.siteCode || '') + '">' + $('#salesSite_newdevelop_' + comp.platCode).html() + '</select></div></td>',

                type === 'detail' ? editTr : addTr,

                '<td><input name="salesNum" type="text" value="' + (comp.salesNum != null ? comp.salesNum : '') + '" class="layui-input" ztt-verify="isNumber"></td>',
                '<td><input name="salesMoney" value="' + (comp.salesMoney || '') + '" class="layui-input"></td>',

                '<td><input name="price" type="text" value="' + (comp.price || '') + '" class="layui-input" ztt-verify="isNumber"></td>',

                '<td width="80"><div class="layui-form"><select name="currency" lay-filter="compSelCurrencyChose">' + currency_sel.join('') + '</select></div></td>',

                '<td>' + '<input name="isSimilar" lay-skin="primary" lay-filter="compSelSimilarChose" type="checkbox" ' + (comp.isSimilar ? 'checked' : '') + '>' + '</td>',

                // '<td><input name="grossInRate" value="' + (comp.grossInRate || '') + '" class="layui-input"></td>',

                '<td><input name="ratting" value="' + (comp.ratting || '') + '" class="layui-input"></td>',
                '<td><input name="score" value="' + (comp.score || '') + '" class="layui-input"></td>',
                '<td><input name="cateRanking" type="number" value="' + (comp.cateRanking || '') + '" class="layui-input"></td>',
                '<td><input name="launchTime" value="' + (comp.launchTime || '') + '" class="layui-input"></td>',
                '<td>' + (comp.creator || '') + '</td>',
                '<td><button class="layui-btn layui-btn-sm layui-btn-primary competitionRemove">移除</button></td>',
                '</tr>'
            ]
            $('#compList_editTbody').append(tr_arr.join(''))
        }
        var siteCodeSelectList = $('#compList_editTbody [name=siteCode]')
        for (var i = 0; i < siteCodeSelectList.length; ++i) {
            $(siteCodeSelectList[i]).find('option[value=' + siteCodeSelectList[i].getAttribute('value') + ']').attr('selected', 'selected')
        }
        form.render('select', 'compList_editTbody')
        form.render('checkbox', 'compList_editTbody')
        form.render('checkbox', 'preProdEditFrom')

        if (type === 'detail') {
            $('#compList_editTbody').find('tr')?.each((index, item) => {
                let ifRepeat = $(item).find('[name=repeatBox]').data('ifrepeat')
                let repeatList = $(item).find('[name=repeatBox]').data('repeatlist') || ''
                if (ifRepeat && ifRepeat != 'undefined') {
                    // 重复了 右侧显示红色重字
                    $(item).find('[name=repeatBox]').html(`<span  style="color: red;margin-left: 4px;font-weight: bolder">重</span>`)
                    $(item).find('[name=repeatBox]').find('span').on('mouseover', function() {
                        newdevelop_showRepeat($(item).find('[name=repeatBox]'), repeatList?.split(',') || [])
                    })
                }
            })
        }

            //移除事件
        $('.competitionRemove').click(function() {
            var _this = this,
                complistId = $(this).parents('tr').find('input[type="hidden"]').val()
            if ($('#compList_editTbody tr').length == 1) {
                layer.msg('至少保留一条竞品数据')
                return
            }
            loading.show()
            $.ajax({
                type: 'post',
                url: ctx + '/preProdDev/delComp.html',
                dataType: 'json',
                data: { id: complistId },
                success: function(data) {
                    loading.hide()
                    if (data.code = '0000') {
                        layer.confirm('确定删除本条竞品数据', { icon: 3, title: '提示' }, function(index) {
                            $(_this).parents('tr').remove()
                            layer.close(index)
                            // if (!isDetail) {
                            //     saveProdDetial()
                            // }
                        })
                    } else {
                        layer.alert('移除失败')
                        // if (!isDetail) {
                        //     saveProdDetial()
                        // }
                    }
                }
            })
            
        })
        form.render('select')
         //计算事件
        $('#newDevCalculate').trigger('click')
        if (type == 'detail') {
            //类目选择
            $('#xtreeDetailBtn').click(function() {
                cateLayerOpenOnlyLeaf('oa','','pd_work_develop_pl','preProdEditFrom_cateName', 'plat_choose_inp','preProdEditFrom_cateId')
            })
        }
            // 渲染fba商品信息
        if (data.fbaProdList && data.fbaProdList.length > 0) {
            for (let i = 0; i < data.fbaProdList.length; ++i) {
                newdevelop_addOneFbaProd(data.fbaProdList[i], i)
            }
        }
        newdevelop_calFbaTotalCost()
        //data.prodTags
       setTimeout(()=>{
        newdevelopRenderProdTags('newdevelop_prodTags', data.prodTags || '');
       }, 200);
    }

    // 新增1个fba定价信息
    async function newdevelop_addOneFbaProd (data, index) {
        if (!data) {
            data = {}
        }
        let countryOpt = {
            'option美国': '<option></option>',
            'option德国': '<option></option>',
            'option英国': '<option></option>',
            'option日本': '<option></option>'
        }
        for(let i=0;i<4;i++){
            let countryEn = ['US', 'DE', 'GB', 'JP'],
                countryCn = ['美国', '德国', '英国', '日本'];
            await commonReturnPromise({
                url: '/lms/fbaPricing/getAllCommisionCateRule?siteId=' + countryEn[i],
                type: 'GET',
            }).then(res => {
                if(res){
                    res.forEach(item => {
                        countryOpt[`option${countryCn[i]}`] += `<option value="${item.id}" _${item.id}_>${item.ruleName}</option>`
                    })
                }
            })
        }
        let tbody = $('#newdevelop_detail_fbaProdTbody')
        let tr = '<tr>'
        tr += '<td><input type="checkbox" class="newdevelop_detail_fbaProdCheckebox" lay-skin="primary"></td>'
        tr += '<td><input data-name1="sSku" maxlength="50" value="' + (data.sSku || '') + '" class="layui-input"></td>'
        tr += '<td><input data-name1="id" value="' + (data.id || '') + '" type="hidden" ><input data-name1="style" maxlength="50" value="' + (data.style || '') + '" class="layui-input"></td>'
        tr += '<td><input data-name1="packType" maxlength="50" value="' + (data.packType || '') + '" class="layui-input"></td>'
        tr += '<td><input data-name1="cost" maxlength="9" value="' + (data.cost || '') + '" class="layui-input newdevelop_calFbaTotalCost"></td>'
        tr += '<td><input data-name1="weight" maxlength="9" value="' + (data.weight || '') + '" class="layui-input newdevelop_calFbaTotalCost"><div class="disN addWeight">抛：<span></span></div></td>'
        tr += '<td><input data-name1="deliverLength" maxlength="9" value="' + (data.deliverLength || '') + '" class="layui-input deliverLength newdevelop_calFbaTotalCost"></td>'
        tr += '<td><input data-name1="deliverWidth" maxlength="9" value="' + (data.deliverWidth || '') + '" class="layui-input deliverWidth newdevelop_calFbaTotalCost"></td>'
        tr += '<td><input data-name1="deliverHeight" maxlength="9" value="' + (data.deliverHeight || '') + '" class="layui-input deliverHeight newdevelop_calFbaTotalCost"></td>'
            // 初始化发货国家信息
        if (!data.priceList || data.priceList.length === 0) {
            let countryList = getfbaCountryList()
            data.priceList = []
            for (let i = 0; i < countryList.length; ++i) {
                data.priceList.push({ country: countryList[i] })
            }
        }
        tr += '<td colspan="9" style="padding: 0"><table data-arr="priceList">'
        data.priceList = data.priceList?.filter(item => item.country !== '加拿大')
        for (let i = 0; i < data.priceList.length; ++i) {
            countryOpt[`option${data.priceList[i].country}`] = countryOpt[`option${data.priceList[i].country}`]?.replace(`_${data.priceList[i].fbaPlatCommisionRuleId}_`,'selected')
            tr += '<tr>'
            tr += '<td width="60px"><input data-name2="country" value="' + (data.priceList[i].country || '') + '" class="layui-input" readonly style="border: 0"></td>'
            tr += '<td width="120px"><select data-name2="fbaPlatCommisionRuleId" id="newdevelop_priceCate_' + (data.priceList[i].country || '') + '" lay-filter="newdevelop_priceCate_' + (data.priceList[i].country || '') + '" lay-search>' + countryOpt[`option${data.priceList[i].country}`] + '</select></td>'
            tr += '<td><input data-name2="preListingPrice" onchange="newdevelop_clearProfitRate(this)" value="' + (data.priceList[i].preListingPrice || '') + '" class="layui-input" placeholder="' + getCurrencyByCountry(data.priceList[i].country) + '"></td>'
            tr += '<td><input data-name2="fbaCharge" readonly value="' + (data.priceList[i].fbaCharge || '') + '" class="layui-input" ></td>'
            tr += '<td><input data-name2="firstLogisticsFee" readonly value="' + (data.priceList[i].firstLogisticsFee || '') + '" class="layui-input" ></td>'
            tr += '<td><input data-name2="airTransportProfitRate" readonly value="' + (data.priceList[i].airTransportProfitRate || '') + '" class="layui-input" placeholder="例如:15"></td>'
            tr += '<td><input data-name2="airDeliveryProfitRate" readonly value="' + (data.priceList[i].airDeliveryProfitRate || '') + '" class="layui-input" placeholder="例如:15"></td>'
            tr += '<td><input data-name2="seaTransportProfitRate" readonly value="' + (data.priceList[i].seaTransportProfitRate || '') + '" class="layui-input" placeholder="例如:15"></td>'
            tr += '<td><input data-name2="deliveryAmount" value="' + (data.priceList[i].deliveryAmount != null ? data.priceList[i].deliveryAmount : '') + '" class="layui-input newdevelop_calFbaTotalCost"></td>'
            tr += '</tr>'
        }
        tr += '</table></td>'
        tr += '<td>' + (data.id ? '<div><div class="layui-btn layui-btn-sm mb5" onclick="newdevelop_saveFbaProdInfo(this)">保存</div></div>' : '') + '<div><div class="layui-btn layui-btn-sm layui-btn-danger" id="fbaRemove" onclick="newdevelop_removeFbaProdInfo(this)">移除</div></div></td>'
        tr += '</tr>'
        tbody.append(tr)
        form.render('checkbox', 'newdevelop_detail_fbaProdTbody')
        form.render('select', 'newdevelop_detail_fbaProdTbody')

        deliverLengthInput = data.deliverLength;
        deliverWidthInput = data.deliverWidth;
        deliverHeightInput = data.deliverHeight;
        if (deliverLengthInput && deliverWidthInput &&  deliverHeightInput) {
            calulateWeight($('.deliverLength')[index])
        }

        $('.deliverLength').on('input', function(e) {
            deliverLengthInput = e.delegateTarget.value;
            calulateWeight(e.target);
        })
        $(".deliverWidth").on('input', function(e) {
            deliverWidthInput = e.delegateTarget.value;
            calulateWeight(e.target);
        })
        $(".deliverHeight").on('input', function(e) {
            deliverHeightInput = e.delegateTarget.value;
            calulateWeight(e.target);
        })

        // $('#fbaRemove').on('click', function() {
            
        // })
    }

    var deliverLengthInput = '';
    var deliverWidthInput = '';
    var deliverHeightInput = '';
    // 计算抛重
    function calulateWeight(el) {
        let dom = $(el).parents('tr').find('.addWeight')
        if (!deliverLengthInput || !deliverWidthInput || !deliverHeightInput || !isMoney(deliverLengthInput) || !isMoney(deliverWidthInput) || !isMoney(deliverHeightInput)) {
            $(dom).addClass('disN');
            $(dom).find('span').html('');
            return
        }
        // 抛重 = 长 * 宽 * 高 / 4.5
        let newWeight = (deliverLengthInput * deliverWidthInput * deliverHeightInput / 4.5).toFixed(2)
        $(dom).removeClass('disN');
        $(dom).find('span').html(newWeight);
    }

    function getCurrencyByCountry(country) {
        switch (country) {
            case '美国':
                return '美元$'
            case '英国':
                return '英镑£'
            case '德国':
                return '欧元€'
            case '日本':
                return '日元￥'
        }
    }

    function newdevelop_addFbaProdByCopy() {
        let checkbox = $('.newdevelop_detail_fbaProdCheckebox:checked')
        if (checkbox.length === 0) {
            layer.msg('请选择需要复制的fba定价信息')
            return
        }
        if (checkbox.length > 1) {
            layer.msg('请选择1条需要复制的fba定价信息')
            return
        }
        let currentTr = $(checkbox[0]).parents('tr')
        let currentData = newdevelop_getFbaProdByTrEle(currentTr)
        currentData.id = null
        newdevelop_addOneFbaProd(currentData)
    }

    function getfbaCountryList() {
        let options = $('#newdevelop_fbaCountryList li')
        let countryList = []
        for (let i = 0; i < options.length; ++i) {
            countryList.push(options[i].innerHTML)
        }
        return countryList
    }

    // 详情弹窗- 组件初始化方法
    function initDetailLayerComponent() {
      newdevelopRenderProdTags('newdevelop_prodTags');
        // 计算价格
        $('#newDevCalculate').click(function() {
                getPrice('preProdEditFrom')
            })
            // 新增链接
        $('#add_competitionData_edit').click(function() {
            add_competitionTable('compList_editTbody')
        })
        // 采集信息
        $('#newDevGetInfomation').click(function() {
            newDevGetInfomation()
        })

         // 采集链接输入框的值改变时触发
        $("#newDevUrl").on("input",function(e){
            //获取input输入的值
            let url = e.delegateTarget.value
            if (url.indexOf('https://detail.1688.com/offer/') > -1) {
                // 1688链接
                $('#newDevGetInfomation').hide()
            } else {
                $('#newDevGetInfomation').show()
            }
        });

        // 采集1688信息 页面跳转
        $('#newDevGet1688Infomation').click(function() {
            let url = $("#preProdEditFrom [name=newDevUrl]").val() || ''
            // if (url.indexOf('https://detail.1688.com/offer/') < 0) {
            //     layer.msg('请先填写1688链接(协议必须为https)')
            //     return
            // }
            if (!(url.indexOf('https://detail.1688.com/offer/') >= 0 || url.indexOf('.ebay.') >= 0 || url.indexOf('.aliexpress.') >= 0 || url.indexOf('shopee.com') >= 0)) {
                layer.msg('请先填写链接(协议必须为https)')
                return
            }
            window.open(url)
        })

        // 采集1688信息 信息粘贴
        $(document).off('click',"#newDevCopy1688Infomation").on('click',"#newDevCopy1688Infomation",function(){
            navigator.clipboard.readText().then(text => {
                let collectInfo = JSON.parse(text)
                // 映射币种中文名称
                commonReturnPromise({
                    url: '/lms/sys/getRates.html',
                    type: 'post',
                    params: {
                        page: 1,
                        limit: 100
                    }
                }).then(res => {
                    res?.forEach(item => {
                        if (item.srcCyCode === collectInfo.currency) {
                            collectInfo.currency = item.srcCyName
                        }
                    })
                    if(collectInfo.collectPlat == '1688'){
                        collectInfo.currency = '人民币'
                    }
                })
                // 类目预测接口
                commonReturnPromise({
                    url: '/lms/preProdDev/queryCategoryForecast',
                    type: 'POST',
                    params: {"title": collectInfo.cnTitle||collectInfo.enTitle, "ifNewCate": "true"}
                }).then(res => {
                    let cate = res?.prodInfoCategoryForecastDtos[0] || {}
                    let categoryForecastDtos = [{
                        id: cate?.id,
                        cateTreeName: cate?.cateTreeName
                    }]
                    collectInfo.categoryForecastDtos = categoryForecastDtos
                    collectInfo.aliexpressCateForecast = res?.aliexpressCateForecast
                    copyInfo(collectInfo);
                }).catch(err => {
                    copyInfo(collectInfo);
                }) 
            }).catch(err => {
                layer.msg('粘贴失败', { icon: 2 });
            })
        })


        // 初始化fba类目、物流属性选项
        newdevelop_initSelectOfFbaCateAndLogisAttr()
        form.render('select')
        form.render('checkbox')
        // 平台选择事件
        form.on('select(compSelPlatChose)', function(data) {
            setSiteCodeOption(data.elem)
            // 平台选择后 则清空币种
            $(data.elem).closest('tr').find('[name=currency]').val('');
            if (data.value === '1688') {
                $(data.elem).closest('tr').find('[name=siteCode]').val('');
                $(data.elem).closest('tr').find('[name=currency]').val('人民币');
            }
            if (data.value === 'aliexpress') {
                $(data.elem).closest('tr').find('[name=currency]').val('美元');
            }
            form.render('select');
            // if (!isDetail) {
            //     saveProdDetial()
            // }
        })
        // 站点选择事件 映射币种
        form.on('select(compSelSiteChose)', function(data) {
            let platCode = $(data.elem).closest('tr').find('[name=platCode]').val();
            let value = data.value;
            let siteCode = $(data.elem).find('option[value=' + value + ']').text();
            siteCurrenyMapList?.forEach(item => {
                if (item.platCode === platCode && item.site === siteCode) {
                    // 设置币种
                    $(data.elem).closest('tr').find('[name=currency]').val(item.currencyName)
                }
            })
            form.render('select');
            // if (!isDetail) {
            //     saveProdDetial()
            // }
        })
        // 选择亚马逊精铺--13/精品--12/铺货--17开发类型的 FBA定价页面默认展示出来 改为必填
        form.on('select(preProdEditFrom_devtype)', function(data) {
            newdevelop_showFbaProdContains(data.value)
            // if (!isDetail) {
            //     saveProdDetial()
            // }
        })
            // 图片上传
        new UploadImage('image_edit0', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { //上传完成后的回调
            succUploadImg(this, xhr)
        })
        new UploadImage('image_edit1', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { //上传完成后的回调
            succUploadImg(this, xhr)
        })
        new UploadImage('image_edit2', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { //上传完成后的回调
            succUploadImg(this, xhr)
        })
        new UploadImage('image_edit3', ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) { //上传完成后的回调
                succUploadImg(this, xhr)
            })
            // 新增FBA产品信息
        $('#newdevelop_addOneFbaProd').click(function() {
                newdevelop_addOneFbaProd()
            })
            // 复制新增FBA产品信息
        $('#newdevelop_addOneFbaProdByCopy').click(function() {
                newdevelop_addFbaProdByCopy()
            })
            // 保存并提交发货需求
        $('#newdevelop_saveAndReuqireDeliver').click(function() {
                newdevelop_saveAndReuqireDeliver()
            })
            // 展示详情进度
        $('#showProcessFbaDevBtn').click(function() {
                let pSku = $('#preProdEditFrom').find('[name=pSku]').val().trim()
                if (!pSku) {
                    layer.msg('请先回填父sku并请求发货')
                    return
                }
                popProcessFbaSalesTableTable(pSku)
            })
            // 计算毛利率
        $('#newdevelop_calculateProfitRateForFba').click(function() {
            let Adata = {
                // priceCate: $('#newdevelop_priceCate').val(),
                priceLogisticsAttr: $('#newdevelop_priceLogisticsAttr').val(),
                listingPage: false
            }
            // if (!Adata.priceCate) {
            //     layer.msg('请选择定价类目')
            //     return false
            // }
            if (!Adata.priceLogisticsAttr) {
                layer.msg('请选择定价物流属性')
                return false
            }
            Adata.fbaProdList = getfbaProdList(true)
            if (!Adata.fbaProdList) {
                return false
            }
            let ajax = new Ajax()
            ajax.post({
                url: ctx + '/preProdDev/preCountProfit.html',
                data: JSON.stringify(Adata),
                success: function(res) {
                    if (res.code === '0000') {
                        let fbaProdList = res.data.fbaProdList
                        let trlist = $('#newdevelop_detail_fbaProdTbody>tr')
                        for (let i = 0; i < trlist.length; ++i) {
                            newdevelop_reShowTr($(trlist[i]), fbaProdList[i])
                        }
                        layer.msg('计算成功')
                    }
                }
            })
        })
    }

     // 选择亚马逊精铺--13/精品--12/铺货--17开发类型的 FBA定价页面默认展示出来 改为必填
    function newdevelop_showFbaProdContains(value) {
        if (newdevelop_showfbaByTypeList.filter(e => e == value).length) {
            $("#newdevelop_fbaProdContains").show()
        }
    }

    function newdevelop_initSelectOfFbaCateAndLogisAttr() {
        // commonRenderSelect('newdevelop_priceCate', newdevelop_fbacateList)
        if (newdevelop_logisAttrList) {
            commonRenderSelect('newdevelop_priceLogisticsAttr', newdevelop_logisAttrList)
        } else {
            let ajax = new Ajax(false)
            let Adata = { enumNameListStr: 'LogisAttrEnum' }
            ajax.post({
                url: ctx + '/enum/getLogisAttrEnum.html',
                success: function(res) {
                    if (res.code === '0000') {
                        newdevelop_logisAttrList = []
                        for (let i = 0; i < res.data.length; ++i) {
                            newdevelop_logisAttrList.push(res.data[i].name)
                        }
                        commonRenderSelect('newdevelop_priceLogisticsAttr', newdevelop_logisAttrList)
                        if (newdevelop_onEditDetailDto) {
                            // renderFormInput('preProdEditFrom', 'priceCate', newdevelop_onEditDetailDto.priceCate)
                            renderFormInput('preProdEditFrom', 'priceLogisticsAttr', newdevelop_onEditDetailDto.priceLogisticsAttr)
                        }
                        form.render('select')
                    } else {
                        layer.msg('初始化物流属性失败:' + res.msg)
                    }
                }
            })
        }
    }

    function newdevelop_saveAndReuqireDeliver() {
        let formEle = $('#preProdEditFrom')
        let Adata = {
            id: formEle.find('[name=id]').val(),
            // priceCate: $('#newdevelop_priceCate').val(),
            priceLogisticsAttr: $('#newdevelop_priceLogisticsAttr').val(),
        }
        let pSku = formEle.find('[name=pSku]').val()
        if (!pSku || !pSku.trim()) {
            layer.msg('请先回填pSku')
            return false
        }
        Adata.fbaProdList = getfbaProdList()
        if (!Adata.fbaProdList) {
            return false
        }
        let hasSku = false
        for (let i = 0; i < Adata.fbaProdList.length; ++i) {
            if (Adata.fbaProdList[i].sSku && Adata.fbaProdList[i].sSku.trim()) {
                hasSku = true
                break
            }
        }
        if (!hasSku) {
            layer.msg('至少回填1个子sku才可提交发货请求')
            return false
        }
        let confirmIndex = layer.open({
            type: 1,
            title: '保存并提交发货请求',
            id: 'newdevelop_requireDeliverConfirmLayer',
            area: ['1000px', '80%'],
            shadeClose: false,
            btn: ['提交', '关闭'],
            content: $('#newdevelop_requireDeliverConfirmPop').html(),
            success: function(layero) {
                let auditStatusDiv = $('#newdevelop_auditStatusDiv')
                auditStatusDiv.find('[data-name=teamLeaderNote]').text(newdevelop_onEditDetailDto.teamLeaderNote)
                auditStatusDiv.find('[data-name=managerAuditRemark]').text(newdevelop_onEditDetailDto.managerAuditRemark)
                auditStatusDiv.find('[data-name=bossAuditRemark]').text(newdevelop_onEditDetailDto.bossAuditRemark)
                let html = ''
                for (let i = 0; i < Adata.fbaProdList.length; ++i) {
                    html += newdevelop_genOneConfirmFbaProd(Adata.fbaProdList[i])
                }
                console.log(html)
                $('#newdevelop_requireDeliverConfirm_skuDiv').append(html)
            },
            yes: function() {
                Adata.salesRemark = $('#newdevelop_salesRemark').val()
                let ajax = new Ajax()
                ajax.post({
                    url: ctx + '/preProdDev/saveAndRequireDeliver.html',
                    data: JSON.stringify(Adata),
                    success: function(res) {
                        if (res.code === '0000') {
                            let fbaProdList = res.data.fbaProdList
                            let trlist = $('#newdevelop_detail_fbaProdTbody>tr')
                            for (let i = 0; i < trlist.length; ++i) {
                                newdevelop_reShowTr($(trlist[i]), fbaProdList[i])
                            }
                            layer.msg('提交成功')
                            layer.close(confirmIndex)
                        } else {
                            layer.msg(res.msg)
                        }
                    }
                })
            }
        })

    }

    function succUploadImg(self, xhr) {
        var img = new Image('150', '150')
        var returnData
        try {
            returnData = JSON.parse(xhr.responseText)
        } catch (err) {

        }
        if (xhr.responseText == '') {
            layer.msg('上传出错!')
        } else if (returnData != undefined && returnData.code == '9999') {
            layer.msg('上传出错!' + xhr.responseText)
        } else {
            img.src = xhr.responseText + '!size=150x150'
            img.className = 'imgCss img_show_hide'
            $('#preProdEditFrom input[name=\'image\']').val(xhr.responseText)
            $(self).empty().html(img)
        }
    }

    // 如果是产品库跳转来的，直接打开新增新品按钮，并填充数据
    $(function() {
        sessionStorage = window.sessionStorage
        var prodHotSaleId = sessionStorage.getItem('prodHotSaleId')  
        if (prodHotSaleId) {
            sessionStorage.removeItem('prodHotSaleId')
                // 弹框
            $('#newdevelop_NewdevelopBtn').trigger('click')
                // 获取并填充数据
            loading.show()
            $.ajax({
                type: 'post',
                url: ctx + '/prodhotsale/listsubplus.html',
                dataType: 'json',
                data: { groupId: prodHotSaleId },
                success: function(returnData) {
                    loading.hide()
                    console.log(returnData)
                    if (returnData.code !== '0000') {
                        layer.alert(returnData.msg)
                        return
                    }
                    let formElem = $('#preProdEditFrom')
                    let prodHotSales = returnData.data
                    let data = prodHotSales[0]
                    // 初始化数据
                    $('#preProdEditFrom_cateName').text(data.cateName)
                    formElem.find('[name=cateId]').val(data.cateId)
                    formElem.find('[name=type]').val(6)
                    formElem.find('[name=enName]').val(data.title)
                    let imgBox = $('#image_edit0')
                    imgBox.html('<img src="' + data.imgUri + '" class="imgCss" style="width:150px;height:150px;border:1px solid #f2f2f2">')

                    for (let i = 0; i < returnData.data.length; ++i) {
                        add_competitionTable('compList_editTbody',{
                            url: returnData.data[i].onlineUrl,
                            ratting: returnData.data[i].commentNumber,
                            platCode: returnData.data[i].platCode,
                            score: returnData.data[i].score,
                            totalSales: returnData.data[i].totalSales,
                            listingTime: Format(returnData.data[i].listingTime, "yyyy-MM-dd"),
                            price: returnData.data[i].price
                        })
                    }
                    form.render(null,'preProdEditFrom')
                }
            })
        }
    })

    // 重置表单并重新初始化表单
    $('#clearForm').click(function() {
        render_hp_orgs_users('#pd_searchForm')
        $('#prod_clearPlat_outside_newdevelop').click()
    })

    function resetCheckInfo() {
        $('#pd_auditResult').val('')
        $('#failReason').val('')
        $('#teamLeaderNote').val('')
        $('#tempType').val('')
        layui.form.render()
    }
        
    function auditPreProd() {
        let pass = $('#pd_auditResult').val()
        if (!pass) {
            layer.msg('请选择审核结果')
            return
        }
        let id = $('#preProdEditFrom input[name=\'id\']').val()
        let failReason = $('#failReason').val()
        let teamLeaderNote = $('#teamLeaderNote').val()
        if (pass === '1') {
            failReason = ''
        }
        let ajax = new Ajax()
        let Adata = { 'id': id, 'ifPass': pass === '1', 'failReason': failReason, 'teamLeaderNote': teamLeaderNote }
        if (pass === '3') {
            Adata.ifPass = true
            Adata.bossAuditStatus = 3
        }

        ajax.post({
            type: 'post',
            url: ctx + '/preProdDev/auditPreProd.html',
            data: JSON.stringify(Adata),
            success: function(returnData) {
                var layer = layui.layer
                if (returnData.code == '0000') {
                    layer.msg('审核成功')
                    let currentIndex = allDataIdList?.findIndex((item) => item == currentSkuId)
                    let nextId = allDataIdList[currentIndex + 1]
                    resetCheckInfo()
                    renderNewDevTable()
                    // refreshTable()
                    if(!nextId) {
                        return
                    }
                    // 获取原数据
                    getProdDetail(nextId, true)  
                    // 获取日志记录
                    getProdLogs(nextId, true)
                } else {
                    layer.msg(returnData.msg)
                    // renderNewDevTable()
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
    }

    function renderNewDevTable() {
        newTableList = newTableList.filter(item => item.id !== currentSkuId)
        table.render({
            elem: '#newTable',
            data: newTableList,
            page: true,
            even: true,
            limits: [100, 500, 1000], // 每页条数的选择项
            limit: 100, // 默认显示50条
            cols: newTableCols,
            done: function(res, curr, count) {
                newTableList = res.data || []
                admin.load.hide()
                imageLazyload()
                    // 超时的行，标记为黄色
                setRowBackColor('.devOverTime', { 'background-color': 'rgba(253, 253, 144,0.35)' })
            }
        })
    }

    // 获取并渲染商品详情
    function getProdDetail(id, ifNext=false) {
        currentSkuId = id
        if (typeof(id) == undefined) {
            return
        }
        if (ifNext && !id) {
            layer.msg('没有下一个数据')
            return 
        }
        loading.show()
        $.ajax({
            type: 'post',
            url: ctx + '/preProdDev/getPreProdDetail.html',
            data: { 'id': id },
            dataType: 'json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code != '0000') {
                    layer.msg(returnData.msg, { icon: 5 })
                } else {
                    if (ifNext) {
                        renderFormInput('preProdEditFrom', 'totalValue', '')
                        $("#newdevelop_fbaProdContains").hide()
                        $('#priceList_Tbody').html('')
                        $('#compList_editTbody').html('')
                        // fba 定价清空
                        $('#newdevelop_detail_fbaProdTbody').html('')
                        $('#newdevelop_logisticAttr :checkbox')?.each((index, item) => {
                            $(item).prop('checked', false)
                        })
                        $('#newDevUrl').html('')
                        $('#image_edit0').html('')
                        $('#image_edit1').html('')
                        $('#image_edit2').html('')
                        $('#image_edit3').html('')
                        form.val('')
                    }
                    initAddProdDetailInfo(returnData.data)
                }
            },
            error: function() {
                loading.hide()
                layer.msg('发送请求失败')
            }
        })
    }

    /**
     * 设置可选站点选项
     * @param platCodeSelect 当前平台选项 element 元素
     */
    function setSiteCodeOption(platCodeSelect) {
        let platCode = $(platCodeSelect).val()
        if (!platCode) {
            return
        }
        $(platCodeSelect).closest('tr').find('[name=siteCode]').html($('#salesSite_newdevelop_' + platCode).html())
        form.render('select', 'compList_editTbody')
    }


    // 1.提交新品的函数start
    function submit_preProd(currentStatus, ifEdit) {
        if (!validateComp('#compListTbody')) {
            layer.msg('竞品销量必须是整数')
            return
        }
        // 1-1.获取所有的表单内容
        let
            formElem = $('#preProdEditFrom'),
            devNote = formElem.find('[name=devNote]').val()

        // 获取值
        let receiveDataObj = serializeObject(formElem)
        delete receiveDataObj.comPrice
        receiveDataObj.outerBoxHeight = receiveDataObj.outerBoxHeight ? receiveDataObj.outerBoxHeight : 0
        receiveDataObj.outerBoxLength = receiveDataObj.outerBoxLength ? receiveDataObj.outerBoxLength : 0
        receiveDataObj.outerBoxWidth = receiveDataObj.outerBoxWidth ? receiveDataObj.outerBoxWidth : 0
        receiveDataObj.grossProfitRate = $('#grossProfitRateInput').val()
        receiveDataObj.currentStatus = currentStatus
        receiveDataObj.devNote = devNote
        receiveDataObj.listingPage = false
        // receiveDataObj.hasSupplierImg = hasSupplierImg === '1'
        if (!receiveDataObj.aliexpressCateForecast) {
            receiveDataObj.aliexpressCateForecast = null
        }
        if (!receiveDataObj.logisticAttr) {
            layer.msg('请选择物流属性')
            return
        }
        // 获取FBA产品信息
        receiveDataObj.fbaProdList = getfbaProdList()
        if (!receiveDataObj.fbaProdList) {
            return
        }
        if(newdevelop_showfbaByTypeList.includes(receiveDataObj.type) && !receiveDataObj.fbaProdList.length ){
            layer.msg('请在fba定价区域新增一行')
            return
        }
        if (receiveDataObj.fbaProdList && receiveDataObj.fbaProdList.length > 0 && !receiveDataObj.priceLogisticsAttr) {
            layer.msg('请填写fba定价-物流属性')
            return
        }
        // 1-2.获取竞品的数据
        let comps = getCompData()
        if (!comps) {
            return
        }
        receiveDataObj.compList = comps
            // 获取图片数据
        let imgEles = $('#newdevelop_imageDiv').find('img')
        let imgArr = []
        for (let i = 0; i < imgEles.length; ++i) {
            let imgSrc = imgEles[i].src.indexOf('!') > -1 ? imgEles[i].src.split('!')[0] : imgEles[i].src;
            imgArr.push(imgSrc)
        }
        receiveDataObj.image = imgArr.join('||')

        // 根据 priceTableList 传入竞品价格
        priceTableList?.forEach(item => {
            receiveDataObj[item.comPriceName] = item.comPrice
        })

        loading.show()
        let url
        if (ifEdit) {
            url = '/preProdDev/editPreProd.html'
            if (!formElem.find('input[name=\'pSku\']').prop('disabled')) {
                if (formElem.find('input[name=\'pSku\']').val().trim() === '') {
                    layer.msg('父SKU不能为空')
                    return
                } else {
                    receiveDataObj.pSku = formElem.find('input[name=\'pSku\']').val().trim()
                }
            }
        } else {
            url = '/preProdDev/addPreProd.html'
        }
        oneAjax.post({
            url: ctx + url,
            dataType: 'json',
            data: JSON.stringify(receiveDataObj),
            success: function(returnData) {
                loading.hide()
                if (returnData.code === '0000') {
                    layer.closeAll()
                    layuiOpenPop = false // 启用 回车搜索功能
                    refreshTable()
                    layer.msg('操作成功')
                    // 新建成功后移除草稿
                    if (isUseDraft) {
                        window.localStorage.removeItem('addProdDetailInfo')
                    }
                } else {
                    layer.msg(returnData.msg, { icon: 5 })
                }
            },
            error: function() {
                /*$("#pd_saveAndPub").removeAttr("href");
                 $("#pd_save").removeAttr("href");*/
                loading.hide()
                layer.msg('发送请求失败')
            }
        }, 'area')
    }

    // 提交数据的函数end

    // 获取fba产品数据
    function getfbaProdList(forProfit) {
        let trList = $('#newdevelop_detail_fbaProdTbody>tr')
        let fbaProdList = []
        for (let i = 0; i < trList.length; ++i) {
            let currentTr = $(trList[i])
            let one = newdevelop_getFbaProdByTrEle(currentTr)
            if (!one.style) {
                layer.msg('fba定价信息-请填写款式名称')
                return false
            }
            if (!one.cost || !isMoney(one.cost)) {
                layer.msg('fba定价信息-请填写正确的成本')
                return false
            }
            if (!one.weight || !isMoney(one.weight)) {
                layer.msg('fba定价信息-请填写正确的重量')
                return false
            }
            if (!one.deliverLength || !isMoney(one.deliverLength)) {
                layer.msg('fba定价信息-请填写正确的发货长')
                return false
            }
            if (!one.deliverWidth || !isMoney(one.deliverWidth)) {
                layer.msg('fba定价信息-请填写正确的发货宽')
                return false
            }
            if (!one.deliverHeight || !isMoney(one.deliverHeight)) {
                layer.msg('fba定价信息-请填写正确的发货高')
                return false
            }
            let priceList = one.priceList
            let priceNum = 0
            for (let i = 0; i < priceList.length; ++i) {
                if (!forProfit) {
                    if (priceList[i].preListingPrice || priceList[i].airTransportProfitRate || priceList[i].deliveryAmount) {
                        priceNum++
                    } else {
                        continue
                    }
                    if (!priceList[i].preListingPrice  || !priceList[i].deliveryAmount) {
                        layer.msg('请填写完整定价信息(预估定价、发货数量必填)')
                        return false
                    }
                    if (priceList[i].preListingPrice && !isMoney(priceList[i].preListingPrice)) {
                        layer.msg('fba定价信息-' + one.style + '-' + priceList[i].country + '-请填写正确的预估定价')
                        return false
                    }
                    if (priceList[i].deliveryAmount && !isInteger(priceList[i].deliveryAmount)) {
                        layer.msg('fba定价信息-' + one.style + '-' + priceList[i].country + '-请填写正确的发货数量')
                        return false
                    }
                } else { // 预估毛利
                    if (priceList[i].preListingPrice) {
                        priceNum++
                    }
                }
            }
            if (priceNum === 0) {
                layer.msg('请填写一条完整fba站点定价信息')
                return false
            }
            fbaProdList.push(one)
        }
        return fbaProdList
    }

    // 3. 获取竞品数据
    function getCompData() {
        let comps = []
        let ifUrlTooLong = false
        let trs = $('#compList_editTbody').find('tr')
        for (let i = 0; i < trs.length; ++i) {
            let tdArr = $(trs[i])
            let comp = {}
            comp.id = tdArr.find('[name=id]').val() // id
            comp.platCode = tdArr.find('[name=platCode]').val() // 平台
            comp.siteCode = tdArr.find('[name=siteCode]').val() // 站点
            comp.url = tdArr.find('[name=url]').val() // 链接
            comp.salesNum = tdArr.find('[name=salesNum]').val() // 销量
            comp.price = tdArr.find('[name=price]').val() // 价格
            comp.currency = tdArr.find('[name=currency]').val() // 币种
            comp.isSimilar = tdArr.find('[name=isSimilar]').prop('checked') // 是否相似品
            comp.grossInRate = tdArr.find('[name=grossInRate]').val() // 毛利率
            comp.profit = tdArr.find('[name=profit]').val() // 利润
            comp.ratting = tdArr.find('[name=ratting]').val() // 评论数
            comp.score = tdArr.find('[name=score]').val() // 评分
            comp.cateRanking = tdArr.find('[name=cateRanking]').val() // 类目排名
            comp.launchTime = tdArr.find('[name=launchTime]').val() // 上架时间
            comp.salesMoney = tdArr.find('[name=salesMoney]').val() // 销售额
            comp.ifRepeat = tdArr.find('[name=repeatBox]').html() ? true : false
            comp.repeatList = tdArr.find('[name=repeatBox]').find('span').data("repeat") || []

            if (comp.url.length > 2000) {
                ifUrlTooLong = true
            }
            if ((comp.platCode === 'ebay' || comp.platCode === 'amazon' || comp.platCode === 'shopee' || comp.platCode === 'lazada') && !comp.siteCode) {
                layer.msg('请选择站点')
                return false
            }
            comps.push(comp)
        }
        // 检查是否有竞品链接过长
        if (ifUrlTooLong) {
            layer.msg('竞品链接过长.请将连接中不必要的参数去除掉。长度不可超过2000字符')
            return false
        }
        return comps
    }

    /*静态竞品表格的添加和移除事件*/
    function add_competitionTable(id,data) {
        /*1.有关竞品的平台和币种数据以及移除按钮*/
        var removeBtn = '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm competitionRemove" >移除</button>',
            select_plat = [],
            select_currency = []
            //debugger;
            /*add_competitionTable里面的内容*/
            plat_curr_sel(select_plat, salesPlatArray) //平台
            plat_curr_sel(select_currency, currencyArray) //币种
        data = data || {}
        var tr_arr = [
            '<tr>',
            '<td  width="100"><div class="layui-form"><select name="platCode" lay-filter="compSelPlatChose" value="'+ (data.platCode || '') +'">' + select_plat.join('') + '</select></div></td>',
            '<td  width="100"><div class="layui-form"><select name="siteCode" lay-filter="compSelSiteChose"></select></div></td>',
            '<td width="250" style="display: flex;align-items: center;"><input name="url"  onclick="newdevelop_routerTo(this.value)" onblur="newdevelop_queryRepeat(this)" value="'+ (data.url || '') +'" type="text" class="layui-input canClickEl" style="display:inline-block;width:80%"><a class="layui-btn layui-btn-xs newdev_getTrInfo">信息粘贴</a><span name="repeatBox" onmouseout="removeTip(this,500)"></span></td>',
            '<td><input name="salesNum" class="layui-input" ztt-verify="isNumber" value="'+ (data.totalSales || '') +'"></td>',
            '<td><input name="salesMoney" class="layui-input" ztt-verify="isNumber"></td>',
            '<td><input name="price" class="layui-input" ztt-verify="isNumber" value="'+ (data.price || '') +'"></td>',
            '<td  width="80"><div class="layui-form"><select name="currency" lay-filter="compSelCurrencyChose">' + select_currency.join('') + '</select></div></td>',
            '<td align="center"><input name="isSimilar" type="checkbox" lay-filter="compSelSimilarChose" lay-skin="primary"></td>',
            // '<td><input name="grossInRate" class="layui-input"></td>',
            '<td><input name="ratting" class="layui-input" value="'+ (data.ratting || '') +'"></td>',
            '<td><input name="score" class="layui-input" value="'+ (data.score || '') +'"></td>',
            '<td><input name="cateRanking" type="number" class="layui-input"></td>',
            '<td><input name="launchTime" class="layui-input" value="'+ (data.listingTime || '') +'"></td>',
            '<td></td>',
            '<td><button type="button" class="layui-btn layui-btn-primary layui-btn-sm competitionRemove">移除</button></td>',
            '</tr>'
        ]
        $('#' + id).append(tr_arr.join(''))
        var platSelectList = $('#compList_editTbody [name=platCode]')
        for (var i = 0; i < platSelectList.length; ++i) {
            $(platSelectList[i]).find('option[value=' + platSelectList[i].getAttribute('value') + ']').attr('selected', 'selected')
        }
        form.render('checkbox', 'compList_editTbody')
        form.render('select', 'compList_editTbody')
            /*2.移除按钮事件*/
        $('.competitionRemove').click(function() {
            $(this).parents('tr').remove()
        })
    }
})

//layui结束
// 监听url输入框移出事件
function newdevelop_queryRepeat(self) {
    console.log(self)
    let tr = $(self).closest('tr')
    let platCode = tr.find('[name=platCode]').val()
    let url = self.value
        //let regex = /^(https:\/\/(.+.aliexpress..+)\/.*item\/.+\/[0-9]+.*)|(https:\/\/.+.1688..+\/offer\/[0-9]+.*)|((https|http):\/\/(.+.ebay..+)\/((.+item=)|(itm\/)|(itm\/.+\/))[0-9]{12,}.*)|(https:\/\/.+.wish..+\/((c|search)\/|(.+uid=))[a-z0-9]{24}.*)|(https:\/\/.+.amazon..+\/((.+)dp|dp)\/.{10}.*)$/
    let repeatBox = tr.find('[name=repeatBox]')
    repeatBox.html('')
        // if (regex.test(url)) {
    let params =  {
        platCode,
        url,
        id: isDetail ? currentSkuId : 0
    }
    request.sendAjax('/preProdDev/queryRepeatedUrl.html', JSON.stringify(params), res => {
            if (res.data.length > 0) {
                // 重复了 右侧显示红色重字
                repeatBox.html(`<span  style="color: red;margin-left: 4px;font-weight: bolder" data-repeat='${JSON.stringify(res.data)}'>重</span>`)
                repeatBox.find('span').on('mouseover', function() {
                    newdevelop_showRepeat($('[name=repeatBox]'), res.data)
                })
            } else {
                return
            }
        })
        // request.sendAjax('/preProdDev/getExistComps.html', JSON.stringify({
        //   platCode,
        //   url
        // }), res => {
        //   let repeatBox = tr.find('[name=repeatBox]')
        //   repeatBox.html('')
        //   let comps = res.data
        //   // console.log(comps)
        //   if (comps) {
        //     // 根据preproductId 查询所有商品
        //     let preproductIds = comps.map(e => e.preproductId)
        //     request.sendAjax('/preProdDev/getPskuInfosByRepeatedComps.html', JSON.stringify({
        //       preproductIds
        //     }), res => {
        //       // 重复了 右侧显示红色重字
        //       repeatBox.html('<span  style="color: red;margin-left: 4px;font-weight: bolder">重</span>')
        //       repeatBox.find('span').on('mouseover', function () {
        //         newdevelop_showRepeat($('[name=repeatBox]'),  res.data)
        //       })
        //     })
        //
        //   }
        // })
        // }

}
let checkTempTypeList = []
function getCheckTempType(func) {
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/queryMsgPreProdDevNoteTemplate',
        dataType: 'json',
        success: function(returnData) {
            if (returnData.code != '0000') {
                layer.msg(returnData.msg, { icon: 5 })
            } else {
                checkTempTypeList = returnData.data
                console.log('checkTempTypeList', checkTempTypeList)
                func && func()
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })
}
// 展示商品日志
function getProdLogs(id, ifNext=false) {
    if (typeof(id) == undefined) {
        return
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPreProdLogs.html',
        data: { 'id': id },
        // async: false,
        dataType: 'json',
        success: function(returnData) {
            loading.hide()
            if (returnData.code != '0000') {
                layer.msg(returnData.msg, { icon: 5 })
            } else {
                var prodLogs = returnData.data
                if(ifNext) {
                    $('#preprodLogTbody').html('')
                }
                for (var i in prodLogs) {
                    var tr = '<tr>'
                    tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operDesc + '</td><td>' + prodLogs[i].operator + '</td></tr>'
                    $('#preprodLogTbody').append(tr)
                }
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })
}

// 2.获取表单内容函数start
function formInput_nd(selector, name) {
    return $('#' + selector + ' [name="' + name + '"]').val().trim()
}

// 2.获取表单内容函数start
function renderFormInput(selector, name, value) {
    $('#' + selector + ' [name="' + name + '"]').val(value)
}

// 获取表单内容函数end


function validateComp(selector) {
    var result = true
    $(selector).find('tr').each(function() {
        var tdArr = $(this).children()
        var salesNum = tdArr.find('[name=salesNum]').val()
        if (!/^\d+$/.test(salesNum)) {
            result = false
        }
    })
    return result
}

//传入图片路径，返回base64
function getBase64(img,imgType){
    function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        let canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let MIME_TYPE = "";
        if(imgType == 'jpg'){
            MIME_TYPE = "image/jpeg";
        }else if(imgType == 'png'){
            MIME_TYPE = "image/png";
        }
        let dataURL = canvas.toDataURL(MIME_TYPE);
        return dataURL;
    }
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = img;
    let deferred=$.Deferred();
    if(img){
        image.onload =function (){
            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
        }
        image.onerror = function() {
            loading.hide()
        }
        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
}

// 采集信息
// function newDevGetInfomation() {
//     let urlData = $("#preProdEditFrom [name=newDevUrl]").val()
//     commonReturnPromise({
//         url: '/lms/prodSupplier/getWangDuoYunCrawlerApiInformation.html',
//         type: 'POST',
//         contentType: "application/json",
//         params: JSON.stringify({"Url": urlData, "categoryForecast": "true"})
//     }).then(res => {
//         copyInfo(res);
//     })
// }

async function copyInfo(res) {
     // 将类目预测的结果保存
     renderFormInput('preProdEditFrom', 'aliexpressCateForecast', res.aliexpressCateForecast || '')  // ②中文名称：1688=>标题，eBay,速卖通=>空

     // 类目
     renderFormInput('preProdEditFrom', 'cateId', res.categoryForecastDtos && res.categoryForecastDtos[0].id || '') // 类目id
     $("#preProdEditFrom_cateName").text(res.categoryForecastDtos && res.categoryForecastDtos[0].cateTreeName || '')
     let _type = '', type = '';
     if (res.developType == '阿里销量产品') {
         _type = 5
         type = "1688"
     } else if (res.developType == 'ebay英国海外仓') {
         _type = 7
         type = "ebay"
         res.siteEnum = res.saleSite
         renderFormInput('preProdEditFrom', 'ebayCompPrice', res.newPrice || '') // 竞品价格
         // ⑤竞品价格：取链接显示的属性的价格，转化成美元(ebay有这个需求，smt只有美元)，ebay填在ebay竞品价格，速卖通填在smt竞品价格。
     } else if (res.developType == 'SMT开发') {
         _type = 4
         type = "aliexpress"
         renderFormInput('preProdEditFrom', 'smtCompPrice', res.newPrice || '')// 竞品价格
         // ⑤竞品价格：取链接显示的属性的价格，转化成美元(ebay有这个需求，smt只有美元)，ebay填在ebay竞品价格，速卖通填在smt竞品价格。
     } else if (res.developType == 'Shopee开发') {
        _type = 14
        type = "shopee"
        res.siteEnum = res.saleSite
        renderFormInput('preProdEditFrom', 'smtCompPrice', res.newPrice || '')// 竞品价格
        // ⑤竞品价格：取链接显示的属性的价格，转化成美元(ebay有这个需求，smt只有美元)，ebay填在ebay竞品价格，速卖通填在smt竞品价格。
    }
     $("#preProdEditFrom [name=type]").val(_type || '') //  ①开发类型：eBay=>ebay英国海外仓,速卖通=>SMT开发,1688=>阿里销量产品
     layui.form.render("select")
     renderFormInput('preProdEditFrom', 'cnName', res.cnTitle || '')  // ②中文名称：1688=>标题，eBay,速卖通=>空
     renderFormInput('preProdEditFrom', 'enName', res.enTitle || '')  // ③英文名称：ebay,速卖通的标题，1688=>空
     renderFormInput('preProdEditFrom', 'keyword', res.enTitle || '') // ④关键词：ebay,速卖通的标题，不需要逗号，1688=>空  同英文名称
// ⑥图片：取listing左侧四张图
     let len = res.images.length < 4 ? res.images.length: 4;
     let promises = []

     loading.show()
     for (let i = 0; i < len; i++) {
         // 图片url转base64
        let promise = getBase64(res.images[i], 'jpg').then(function (base64) {
             $.ajax({
                 type: "POST",
                 url: ctx + "/preProdDev/getBase64Img.html",
                 data: {"AreaImgKey": base64},
                 async: false,
                 success: function (returnData) {
                    //  loading.hide()
                     let img = new Image('150', '150')
                     img.src = returnData + '!size=150x150'
                     img.className = 'imgCss img_show_hide'
                     $('#preProdEditFrom input[name=image]').val(returnData)
                     $("#image_edit" + i).empty().html(img)
                 }, error: function (err) {
                     layer.alert(err, {icon: 2})
                 }
             })
         }, function (err) {
             console.log(err);//打印异常信息
         });
         promises.push(promise)
     }
// ⑦产品类目：将英文标题(1688爬取的中文标题，先翻译成英文)，再调用速卖通推荐类目,默认推荐度最高的类目。如果通过两层映射找不到OA老类目，那就空着，业务手动选择。
// ⑧竞品数据：平台，站点，链接，销量，价格(页面展示的属性的价格)，币种
//         1)ebay站点取链接的
//         2)smt，1688没有站点
     renderCompListEditTbody(res,type)
     await Promise.allSettled(promises);
     loading.hide()
}

$(document).on("click",".newdev_getTrInfo",function(){
    let tr = $(this).parents("tr");
    navigator.clipboard.readText().then(text => {
        let collectInfo = JSON.parse(text)
        // 映射币种中文名称
        commonReturnPromise({
            url: '/lms/sys/getRates.html',
            type: 'post',
            params: {
                page: 1,
                limit: 100
            }
        }).then(res => {
            res?.forEach(item => {
                if (item.srcCyCode === collectInfo.currency) {
                    collectInfo.currency = item.srcCyName
                }
            })
            if(collectInfo.collectPlat == '1688'){
                collectInfo.currency = '人民币'
            }
            tr.find("[name=siteCode]").html($('#salesSite_newdevelop_' + collectInfo.collectPlat).html())
            tr.find("[name=platCode]").val(collectInfo.collectPlat||'')
            tr.find("[name=siteCode]").val(collectInfo.saleSite||'')
            tr.find("[name=url]").val(collectInfo.url||'')
            tr.find("[name=price]").val(collectInfo.price||'')
            tr.find("[name=currency]").val(collectInfo.currency||'')
            tr.find("[name=salesNum]").val(collectInfo.sales_count)
            tr.find("[name=ratting]").val(collectInfo.commentsNum)
            tr.find("[name=score]").val(collectInfo.starNum||'')

            layui.form.render('select', 'compList_editTbody')
            layui.form.render('checkbox', 'compList_editTbody')
        })
    }).catch(err => {
        layer.msg('粘贴失败', { icon: 2 });
    })
})

// 竞品数据表格渲染
function renderCompListEditTbody(res,type){
    console.log('type', res);
    //平台和币种处理
    var plat_sel = [],
        currency_sel = []
    /*getProdDetail里面的内容*/
    plat_curr_sel(plat_sel, salesPlatArray, type) //平台
    plat_curr_sel(currency_sel, currencyArray, res.currency) //币种
    //html数组处理
    var tr_arr = [
        '<tr>',
        '<td width="100"><div class="layui-form"><select name="platCode" lay-filter="compSelPlatChose">' + plat_sel.join('') + '</select></div></td>',
        '<td width="100"><div class="layui-form"><select name="siteCode" value="' + (res.siteEnum || '') + '">' + $('#salesSite_newdevelop_' + type).html() + '</select></div></td>',
        '<td width="250" style="display: flex;align-items: center;"><input type="text" name="url" value="' + res.url + '"  onclick="newdevelop_routerTo(this.value)" onblur="newdevelop_queryRepeat(this)" class="layui-input canClickEl" style="display:inline-block;width:80%"><a class="layui-btn layui-btn-xs newdev_getTrInfo">信息粘贴</a></td>',
        '<td><input name="salesNum" type="text" value="' + (res.sales_count) + '" class="layui-input" ztt-verify="isNumber"></td>',
        '<td><input name="salesMoney" value="" class="layui-input"></td>',
        '<td><input name="price" type="text" value="' + (res.price || '') + '" class="layui-input" ztt-verify="isNumber"></td>',
        '<td width="80"><div class="layui-form"><select name="currency">' + currency_sel.join('') + '</select></div></td>',
        '<td>' + '<input name="isSimilar" lay-skin="primary" type="checkbox"></td>',
        '<td><input name="ratting" class="layui-input" value="' + ((res.commentsNum === undefined || res.commentsNum === '') ? '' : res.commentsNum) + '"></td>',
        '<td><input name="score" value="' + (res.starNum || '') + '" class="layui-input"></td>',
        '<td><input name="cateRanking" type="number" value="" class="layui-input"></td>',
        '<td><input name="launchTime" value="" class="layui-input"></td>',
        '<td></td>',
        '<td><button class="layui-btn layui-btn-sm layui-btn-primary competitionRemove">移除</button></td>',
        '</tr>'
    ]
    $('#compList_editTbody').append(tr_arr.join(''))
    if (res.type === 1) {
        $('.newdev_getTrInfo').hide()
    }else {
        $('.newdev_getTrInfo').show()
    }
    var siteCodeSelectList = $('#compList_editTbody [name=siteCode]')
    for (var i = 0; i < siteCodeSelectList.length; ++i) {
        $(siteCodeSelectList[i]).find('option[value=' + siteCodeSelectList[i].getAttribute('value') + ']').attr('selected', 'selected')
    }
    layui.form.render('select', 'compList_editTbody')
    layui.form.render('checkbox', 'compList_editTbody')
    $('.competitionRemove').click(function() {
        $(this).parents('tr').remove()
    })
}

// 计算价格
function getPrice(selector) {
    let grossProditRate = $('#' + selector + ' input[name=\'grossProfitRate\']').val() || 0
    let logisticAttrDoms = $("#preProdEditFrom input[name=logisticAttr]");//得到所有的checkbox
    let logisAttrList = []
    for(var i=0; i < logisticAttrDoms.length; i++) {
        if(logisticAttrDoms[i].checked){ //如果checkbox被选中
        logisAttrList.push(logisticAttrDoms[i].value)
    }}
    let data = {
        'price': $('#' + selector + ' input[name=\'cost\']').val(),
        'weight': $('#' + selector + ' input[name=\'weight\']').val(),
        'grossProfitRate': grossProditRate / 100,
        logisAttrList: logisAttrList.toString(),
        outerBoxLength: $('#' + selector + ' input[name=\'outerBoxLength\']').val(),
        outerBoxWidth: $('#' + selector + ' input[name=\'outerBoxWidth\']').val(),
        outerBoxHeight: $('#' + selector + ' input[name=\'outerBoxHeight\']').val()
    }
    if (!data.price || !data.weight || !data.grossProfitRate) {
        layer.msg('请填写成本、重量和毛利率')
        return
    }
    devGetPrice(data)
}

function getRowPrice(self) {
    let dom = $(self).parents('tr')
    let logisticAttrDoms = $("#preProdEditFrom input[name=logisticAttr]");//得到所有的checkbox
    let logisAttrList = []
    for(var i=0; i < logisticAttrDoms.length; i++) {
        if(logisticAttrDoms[i].checked){ //如果checkbox被选中
        logisAttrList.push(logisticAttrDoms[i].value)
    }}
    let data = {
        weight: $(dom).find("[name=weight1]").text(),
        price: $(dom).find('[name=cost1]').text(),
        priceName: $(dom).find('[name=priceName]').text(),
        grossProfitRate: $(dom).find('[name=grossProfitRate]').val() / 100,
        logisAttrList: logisAttrList.toString(),
        outerBoxLength: $('#preProdEditFrom input[name=\'outerBoxLength\']').val(),
        outerBoxWidth: $('#preProdEditFrom input[name=\'outerBoxWidth\']').val(),
        outerBoxHeight: $('#preProdEditFrom input[name=\'outerBoxHeight\']').val()
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPrice.html',
        dataType: 'json',
        data: data,
        success: function(returnData) {
            loading.hide()
            if (returnData.code !== '0000') {
                layer.alert(returnData.msg)
            } else {
                let tableList = []
                // 如果是每行的计算操作
                // 替换该行的计算结果
                let price = returnData.data[Object.keys(returnData.data)[0]].listingDollar || ''
                let currencyPrice = returnData.data[Object.keys(returnData.data)[0]].listingPriceShow || ''
                $(dom).find('[name=salePrice]').text(price)
                $(dom).find('[name=currencyPrice]').text(currencyPrice)
                priceTableList?.forEach(item => {
                    if (item.priceName === Object.keys(returnData.data)[0]) {
                        item.price = price
                        item.currencyPrice = currencyPrice
                    }
                })
            }
        }
    })
}

function devGetPrice(data) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/getPrice.html',
        dataType: 'json',
        data: data,
        success: function(returnData) {
            loading.hide()
            if (returnData.code !== '0000') {
                layer.alert(returnData.msg)
            } else {
                let tableList = []
                priceTableList = []
                // 根据 platPriceList 获取表格数据
                Object.keys(platPriceList).forEach(item => {
                    platPriceList[item].comPrice = ''
                    let priceWeight = ''
                    if (returnData.data[item]?.priceWeight !== undefined) {
                        priceWeight = returnData.data[item]?.priceWeight
                    }
                    let obj = Object.assign(platPriceList[item], 
                        {   weight: priceWeight,
                            grossProfitRate: data.grossProfitRate * 100,
                            price: returnData.data[item]?.listingDollar || '',  // 销售价（$）
                            currencyPrice: returnData.data[item]?.listingPriceShow || '', // 当地销售价
                            cost:data.price
                        }) 
                    tableList.push(obj)
                })
                priceTableList = tableList;
                let list = tableList.slice(0, 5)

                console.log("🚀 ~ file: newdevelop.js:2734 ~ devGetPrice ~ list:", list);

                laytpl($("#priceTableContainer").html()).render(list, function(html){
                    $('#priceList_Tbody').html(html)
                    $('.expand').text('展开所有')
                });
                // 回显竞品价格
                if (newdevelop_onEditDetailDto) {
                    showComPrice(newdevelop_onEditDetailDto);
                }
            }
        }
    })
}

function expandAll() {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
    let text = $('.expand').text()
    if (text === '展开所有') {
        laytpl($("#priceTableContainer").html()).render(priceTableList, function(html){
            $('#priceList_Tbody').html(html)
            $('.expand').text('收起')
        });
    }
    if (text === '收起') {
        let list = priceTableList?.slice(0, 5)
        laytpl($("#priceTableContainer").html()).render(list, function(html){
            $('#priceList_Tbody').html(html)
            $('.expand').text('展开所有')
        });
    }
}

function showComPrice(data) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
        console.log('xianshi')
    priceTableList?.forEach(item => {
        if (Object.keys(data).includes(item.comPriceName)) {
            item.comPrice = data[item.comPriceName]
            item.diffVal = item.comPrice ? Math.round((item.price - item.comPrice) / item.comPrice * 10000) / 100.00 + '%' : ''
        }
    })
    let list = priceTableList.slice(0, 5)
    laytpl($("#priceTableContainer").html()).render(list, function(html){
        $('#priceList_Tbody').html(html)
        $('.expand').text('展开所有')
    });
}

function newDevCalculateRow(self) {
    getRowPrice(self)
}

function changeComPrice(self) {
    let price = $(self).closest('td').prev().text() || ''
    let comPrice = $(self).val() || ''
    let diffDom = $(self).closest('td').next()
    let tableIndex = $(self).closest('tr').index()
    priceTableList[tableIndex].comPrice = comPrice
    if (isNumber(comPrice)) {
        getPercentage(price, comPrice, diffDom)
    } else {
        $(diffDom).text('')
        return layer.msg('请输入数字')
    }
}

// 计算我们定价与竞品价格差异百分比
function getPercentage(ourPrice, compPrice, dom) {
    if (!compPrice) {
        return
    }
    var percent = Math.round((ourPrice - compPrice) / compPrice * 10000) / 100.00 + '%'
    $(dom).text(percent)
    let tableIndex = $(dom).closest('tr').index()
    priceTableList[tableIndex].diffVal = percent
}

var salesPlatArray = ['wish', 'ebay', 'amazon', 'aliexpress', 'shopee', 'lazada', 'joom', '1688']

/**
 * 平台和币种函数
 * arr1:定义空数组,存放数据;arr2:循环的平台数据或者币种数据;obj:存在就输入,不存在默认为空
 */
function plat_curr_sel(arr1, arr2, obj) {
    //debugger;
    if (!obj) {
        obj = ''
    }
    let str = '<option value=""></option>'
    $.each(arr2, function(i, v) {
        var v_sel = '<option value="' + v + '" >' + v + '</option>'
        if (v == obj) {
            v_sel = '<option value="' + v + '" selected>' + v + '</option>'
        }
        arr1.push(v_sel)
    })
    arr1.unshift(str)
    return arr1
}

function getPictureRequireAuditInfo() {
    let devId = $('#preProdEditFrom').find('[name=id]').val()
    let ajax = new Ajax()
    ajax.post({
        url: ctx + '/preProdDev/getPictureRequireAudit.html',
        data: JSON.stringify({ devId: devId }),
        success: function(res) {
            if (res.code === '0000') {
                if (res.data) {
                    // 先全部设置为不可编辑和点击操作按钮
                    let auditInfo = res.data
                    let formElem = $('#newdevelop_pictureRequireAuditForm')
                    formElem.find('[name=id]').val(auditInfo.id)
                    let nameElems = formElem.find('[name]:not([name=id])')
                    nameElems.addClass('disAbleInp').attr('disabled', 'disabled')
                    for (let i = 0; i < nameElems.length; ++i) {
                        nameElems[i].value = auditInfo[nameElems[i].name] || ''
                    }
                    let btns = formElem.find('.layui-btn[id]')
                    btns.addClass('layui-btn-disabled').attr('disabled', 'disabled')
                        // 如果是开发专员
                    if (selfRoleNameList.indexOf('开发专员') >= 0) {
                        $('#updatePictureRequireDirBtn').removeClass('layui-btn-disabled').removeAttr('disabled')
                        formElem.find('[name=pictureRequireDir]').removeClass('disAbleInp').removeAttr('disabled')
                        $('#updatePictureRequireDirBtn').click(function() {
                            // 修改图片需求文件夹
                            newdevelop_updatePictureRequireDir()
                        })
                    }
                    // 如果是开发组长
                    if (selfRoleNameList.indexOf('开发组长') >= 0) {
                        $('#newdevelop_leaderAuditBtn').removeClass('layui-btn-disabled').removeAttr('disabled')
                        formElem.find('[name=leaderAuditStatus]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=leaderAuditRemark]').removeClass('disAbleInp').removeAttr('disabled')
                        $('#newdevelop_leaderAuditBtn').click(function() {
                            // 组长审核
                            newdevelop_pictureRequireAudit(1)
                        })
                    }

                    // 如果是开发主管
                    if (selfRoleNameList.indexOf('开发主管') >= 0) {
                        $('#newdevelop_managerAuditBtn').removeClass('layui-btn-disabled').removeAttr('disabled')
                        formElem.find('[name=managerAuditStatus]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=managerAuditRemark]').removeClass('disAbleInp').removeAttr('disabled')
                        $('#newdevelop_managerAuditBtn').click(function() {
                            // 组长审核
                            newdevelop_pictureRequireAudit(2)
                        })
                    }

                    // 如果是美工主管
                    if (selfRoleNameList.indexOf('摄影美工主管') >= 0) {
                        $('#newdevelop_artManagerAuditBtn').removeClass('layui-btn-disabled').removeAttr('disabled')
                        formElem.find('[name=artManagerAuditStatus]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=artManagerAuditRemark]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=photographerId]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=photoDifficulty]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=artDesignerId]').removeClass('disAbleInp').removeAttr('disabled')
                        formElem.find('[name=designerDifficulty]').removeClass('disAbleInp').removeAttr('disabled')
                        $('#newdevelop_artManagerAuditBtn').click(function() {
                            // 组长审核
                            newdevelop_pictureRequireAudit(3)
                        })
                    }
                    layui.form.render('select', 'newdevelop_pictureRequireAuditForm')
                } else {
                    $('#newdevelop_pictureRequireAuditForm').hide()
                }
            }
        }
    })
}

function toGetSelfImgLog() {
    let devId = $('#preProdEditFrom').find('[name=id]').val()
    let ifLoading = $('#ifLoading').val()
    if (ifLoading === '1') {
        return
    }
    let table = layui.table
    loading.show()
        // 查询拍图日志
    table.render({
            elem: '#selfImgTab_newdevelop',
            url: ctx + '/preProdDev/selfImgLogQuery.html',
            where: { devId: parseInt(devId) },
            method: 'post',
            page: true,
            even: true,
            limits: [100, 500, 1000], // 每页条数的选择项
            limit: 100, // 默认显示50条
            cols: [
                [
                    { field: 'sSku', title: '子商品sku', width: 270 },
                    { title: '状态', templet: '#status_selfImg_nd', width: 100 },
                    { title: '需求人', templet: '#needer_selfImg_nd', width: 180 },
                    { title: '收货人', templet: '#receiver_selfImg_nd', width: 180 },
                    { title: '摄影', templet: '#photoer_selfImg_nd', width: 180 },
                    { title: '美工', templet: '#arter_selfImg_nd', width: 180 },
                    { title: '摄影难度', templet: '<div>{{d.photoDifficulty || ""}}</div>', width: 100 },
                    { title: '美工难度', templet: '<div>{{d.designerDifficulty || ""}}</div>', width: 100 },
                ]
            ],
            done: function() {
                loading.hide()
                $('#ifLoading').val('1')
            }
        })
        // 查询拍图需求审核信息
    getPictureRequireAuditInfo()
}



//反转码为表情
function untransface(words) {
    var result = ''
    if (words !== '') {
        var emojiArr = words.match(/\/:0[0-9]{2}/g)
        if (emojiArr) {
            for (var i = 0; i < emojiArr.length; i++) {
                var index = Number(emojiArr[i].substring(3, emojiArr[i].length))
                emojiArr[i] = '<img src="' + layui.cache.dir + 'images/face/' + index + '.gif"/>'
            }
            var strArr = words.split(/\/:0[0-9]{2}/g)
            for (var i = 0; i < strArr.length; i++) {
                if (i > 0) {
                    result += emojiArr[i - 1]
                }
                result += strArr[i]
            }
            return result
        } else {
            return words
        }
    }
    return words
}

function changeTotalValue(self) {
    var box = $(self).closest('.layui-form-item')
    var cost = box.find('[name=cost]').val()
    var weight = box.find('[name=weight]').val()
    cost = cost ? parseFloat(cost) : 0
    weight = weight ? parseFloat(weight) : 0
    if (cost && weight) {
        box.find('[name=totalValue]').val(accAdd(cost, accMul(weight, 0.1)))
    }
}

// function removeCurrentTr(self) {
//     let id = $(self).parents('tr').find('[data-name1=id]').val()
//     if (!id) {
//         $(self).parents('tr').remove()
//         newdevelop_calFbaTotalCost()
//         saveProdDetial()
//         return
//     }
//     let confirmIndex = layui.layer.confirm('确认移除该fba产品信息?', { btn: ['确认', '取消'] }, function() {
//         let ajax = new Ajax()
//         ajax.post({
//             url: ctx + '/preProdDev/removeFbaProdInfo.html',
//             data: JSON.stringify({ id: id }),
//             success: function(res) {
//                 if (res.code === '0000') {
//                     layui.layer.msg('移除成功')
//                     $(self).parents('tr').remove()
//                     newdevelop_calFbaTotalCost()
//                 }
//             }
//         })
//         layui.layer.close(confirmIndex)
//     })
// }

function wormFbaInfo(self) {
    // 判断如果不是amazon链接。不进行爬取
    let tr = $(self).parents('tr')
    let platCode = tr.find('[name=platCode]').val()
    let site = tr.find('[name=siteCode]').val()
    let url = tr.find('[name=url]').val()
    if (platCode !== 'amazon') {
        return
    }
    if (!site) {
        return
    }
    if (!url || !url.trim()) {
        return
    }
    let dpIndex = url.indexOf('/dp/')
    if (dpIndex < 0) {
        return
    }
    let asin = url.substring(dpIndex + 4, dpIndex + 14)
    if (!asin) {
        return
    }
    var formData = new FormData()
    formData.append('asin', asin)
    formData.append('site', site)
    let ajax = new Ajax(false)
    ajax.post({
        url: ctx + '/fbaHistoryProduct/getCompDetail.html',
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.code === '0000') {
                // 获取评分
                let score = res.data.compScore
                let cateRanking = res.data.cateRankText
                let launchTime = res.data.publishTime ? format(res.data.publishTime, 'yyyy-MM-dd') : ''
                if (cateRanking) {
                    let last = cateRanking.lastIndexOf('#')
                    let inIndex = cateRanking.indexOf('in', last)
                    let rank = cateRanking.substring(last + 1, inIndex)
                    rank = rank.replace(/,/g, '').trim()
                    tr.find('[name=cateRanking]').val(rank)
                }
                tr.find('[name=score]').val(score)
                tr.find('[name=launchTime]').val(launchTime)
            } else {
                layer.msg('爬取amazon网页信息失败:' + res.msg)
            }
        }
    })
}

function newdevelop_removeFbaProdInfo(self) {
    let id = $(self).parents('tr').find('[data-name1=id]').val()
    if (!id) {
        $(self).parents('tr').remove()
        newdevelop_calFbaTotalCost()
        // if (!isDetail) {
        //     saveProdDetial()
        // }
        return
    }
    let confirmIndex = layui.layer.confirm('确认移除该fba产品信息?', { btn: ['确认', '取消'] }, function() {
        let ajax = new Ajax()
        ajax.post({
            url: ctx + '/preProdDev/removeFbaProdInfo.html',
            data: JSON.stringify({ id: id }),
            success: function(res) {
                if (res.code === '0000') {
                    layui.layer.msg('移除成功')
                    $(self).parents('tr').remove()
                    newdevelop_calFbaTotalCost()
                }
            }
        })
        layui.layer.close(confirmIndex)
    })
}

function newdevelop_saveFbaProdInfo(self) {
    let trEle = $(self).parents('tr')
    let one = newdevelop_getFbaProdByTrEle(trEle)
    if (!one.style) {
        layer.msg('fba定价信息-请填写款式名称')
        return false
    }
    if (!one.cost || !isMoney(one.cost)) {
        layer.msg('fba定价信息-请填写正确的成本')
        return false
    }
    if (!one.weight || !isMoney(one.weight)) {
        layer.msg('fba定价信息-请填写正确的重量')
        return false
    }
    if (!one.deliverLength || !isMoney(one.deliverLength)) {
        layer.msg('fba定价信息-请填写正确的发货长')
        return false
    }
    if (!one.deliverWidth || !isMoney(one.deliverWidth)) {
        layer.msg('fba定价信息-请填写正确的发货宽')
        return false
    }
    if (!one.deliverHeight || !isMoney(one.deliverHeight)) {
        layer.msg('fba定价信息-请填写正确的发货高')
        return false
    }
    let priceList = one.priceList
    let priceNum = 0
    for (let i = 0; i < priceList.length; ++i) {
        if (priceList[i].preListingPrice || priceList[i].airTransportProfitRate || priceList[i].deliveryAmount) {
            priceNum++
        } else {
            continue
        }
        if (!priceList[i].preListingPrice || !priceList[i].deliveryAmount) {
            layer.msg('请填写完整定价信息(预估定价、发货数量必填)')
            return false
        }
        if (priceList[i].preListingPrice && !isNumber(priceList[i].preListingPrice)) {
            layer.msg('fba定价信息-' + one.style + '-' + priceList[i].country + '-请填写正确的预估定价')
            return false
        }
        if (priceList[i].airTransportProfitRate && !isNumber(priceList[i].airTransportProfitRate)) {
            layer.msg('fba定价信息-' + one.style + '-' + priceList[i].country + '-请填写正确的空运利润率')
            return false
        }
        if (priceList[i].deliveryAmount && !isInteger(priceList[i].deliveryAmount)) {
            layer.msg('fba定价信息-' + one.style + '-' + priceList[i].country + '-请填写正确的发货数量')
            return false
        }
    }
    if (priceNum === 0) {
        layer.msg('请填写一条完整fba站点定价信息')
        return false
    }
    let Adata = {
        id: newdevelop_onEditDetailDto.id,
        // priceCate: $('#newdevelop_priceCate').val(),
        priceLogisticsAttr: $('#newdevelop_priceLogisticsAttr').val(),
        fbaProdList: [one],
        listingPage: false
    }
    if (!Adata.priceLogisticsAttr) {
        layer.msg('请选择fba定价-物流属性')
        return false
    }
    let ajax = new Ajax(true)
    ajax.post({
        url: ctx + '/preProdDev/editFbaProdInfo.html',
        data: JSON.stringify(Adata),
        success: function(res) {
            if (res.code === '0000') {
                newdevelop_reShowTr(trEle, res.data.fbaProdList[0])
            }
        }
    })
}

// 复现毛利率数据
function newdevelop_reShowTr(trEle, fbaProd) {
    console.log(trEle)
    console.log(fbaProd)
    let USPrice, DEPrice, GBPrice, JPPrice
    for (let i = 0; i < fbaProd.priceList.length; ++i) {
        switch (fbaProd.priceList[i].country) {
            case '美国':
                USPrice = fbaProd.priceList[i]
                break
            case '德国':
                DEPrice = fbaProd.priceList[i]
                break
            case '英国':
                GBPrice = fbaProd.priceList[i]
                break
            case '日本':
                JPPrice = fbaProd.priceList[i]
                break
        }
    }
    let USTr = trEle.find('[data-name2=country][value=美国]').closest('tr')
    USTr.find('[data-name2=fbaPlatCommisionRuleId]').val(USPrice.fbaPlatCommisionRuleId || '')
    USTr.find('[data-name2=fbaCharge]').val(USPrice.fbaCharge || '')
    USTr.find('[data-name2=firstLogisticsFee]').val(USPrice.firstLogisticsFee || '')
    USTr.find('[data-name2=airTransportProfitRate]').val(USPrice.airTransportProfitRate || '')
    USTr.find('[data-name2=airDeliveryProfitRate]').val(USPrice.airDeliveryProfitRate || '')
    USTr.find('[data-name2=seaTransportProfitRate]').val(USPrice.seaTransportProfitRate || '')
    let GBTr = trEle.find('[data-name2=country][value=英国]').closest('tr')
    GBTr.find('[data-name2=fbaPlatCommisionRuleId]').val(GBPrice.fbaPlatCommisionRuleId || '')
    GBTr.find('[data-name2=fbaCharge]').val(GBPrice.fbaCharge || '')
    GBTr.find('[data-name2=firstLogisticsFee]').val(GBPrice.firstLogisticsFee || '')
    GBTr.find('[data-name2=airTransportProfitRate]').val(GBPrice.airTransportProfitRate || '')
    GBTr.find('[data-name2=airDeliveryProfitRate]').val(GBPrice.airDeliveryProfitRate || '')
    GBTr.find('[data-name2=seaTransportProfitRate]').val(GBPrice.seaTransportProfitRate || '')
    let DETr = trEle.find('[data-name2=country][value=德国]').closest('tr')
    DETr.find('[data-name2=fbaPlatCommisionRuleId]').val(DEPrice.fbaPlatCommisionRuleId || '')
    DETr.find('[data-name2=fbaCharge]').val(DEPrice.fbaCharge || '')
    DETr.find('[data-name2=firstLogisticsFee]').val(DEPrice.firstLogisticsFee || '')
    DETr.find('[data-name2=airTransportProfitRate]').val(DEPrice.airTransportProfitRate || '')
    DETr.find('[data-name2=airDeliveryProfitRate]').val(DEPrice.airDeliveryProfitRate || '')
    DETr.find('[data-name2=seaTransportProfitRate]').val(DEPrice.seaTransportProfitRate || '')
    let JPTr = trEle.find('[data-name2=country][value=日本]').closest('tr')
    JPTr.find('[data-name2=fbaPlatCommisionRuleId]').val(JPPrice.fbaPlatCommisionRuleId || '')
    JPTr.find('[data-name2=fbaCharge]').val(JPPrice.fbaCharge || '')
    JPTr.find('[data-name2=firstLogisticsFee]').val(JPPrice.firstLogisticsFee || '')
    JPTr.find('[data-name2=airTransportProfitRate]').val(JPPrice.airTransportProfitRate || '')
    JPTr.find('[data-name2=airDeliveryProfitRate]').val(JPPrice.airDeliveryProfitRate || '')
    JPTr.find('[data-name2=seaTransportProfitRate]').val(JPPrice.seaTransportProfitRate || '')
}

function newdevelop_getFbaProdByTrEle(trEle) {
    let fbaProd = {}
    let attrs = trEle.find('[data-name1]')
    for (let i = 0; i < attrs.length; ++i) {
        fbaProd[attrs[i].getAttribute('data-name1')] = attrs[i].value
    }
    let pricelistTr = trEle.find('[data-arr=priceList] tr')
    fbaProd.priceList = []
    for (let i = 0; i < pricelistTr.length; ++i) {
        let one = {}
        let priceAttrs = $(pricelistTr[i]).find('[data-name2]')
        for (let j = 0; j < priceAttrs.length; ++j) {
            one[priceAttrs[j].getAttribute('data-name2')] = priceAttrs[j].value.trim()
        }
        fbaProd.priceList.push(one)
    }
    return fbaProd
}

function newdevelop_routerTo(url) {
    if (!url) {
        return
    }
    window.open(url)
}

function newdevelop_calFbaTotalCost() {
    // 获取所有完整的fba信息
    let trList = $('#newdevelop_detail_fbaProdTbody>tr')
    let fbaProdList = []
    for (let i = 0; i < trList.length; ++i) {
        let currentTr = $(trList[i])
        let one = newdevelop_getFbaProdByTrEle(currentTr)
        if (!one.cost || !isMoney(one.cost)) {
            continue
        }
        if (!one.weight || !isMoney(one.weight)) {
            continue
        }
        if (!one.deliverLength || !isMoney(one.deliverLength)) {
            continue
        }
        if (!one.deliverWidth || !isMoney(one.deliverWidth)) {
            continue
        }
        if (!one.deliverHeight || !isMoney(one.deliverHeight)) {
            continue
        }
        fbaProdList.push(one)
    }

    let amtEle = $('#newdevelop_totalFbaProdDeliverAmount')
    let prodCostEle = $('#newdevelop_totalFbaProdCost')
    let freightFeeEle = $('#newdevelop_totalFbaFreightFee')
    let totalCostEle = $('#newdevelop_totalFbaCost')

    if (fbaProdList.length === 0) {
        amtEle.html('0')
        prodCostEle.html('0')
        freightFeeEle.html('0')
        totalCostEle.html('0')
    }
    let amt = 0,
        prodCost = 0,
        freightFee = 0,
        totalCost = 0
    for (let i = 0; i < fbaProdList.length; ++i) {
        let camt = 0 // 当前款式的总发货数量
        let weight = fbaProdList[i].weight // 当前款式的重量
        let vWeight = accDiv(accMul(accMul(fbaProdList[i].deliverLength, fbaProdList[i].deliverWidth), fbaProdList[i].deliverHeight), 6) // 当前款式的抛重
        if (weight < vWeight) {
            weight = vWeight
        }
        let oneFreightCost = 0 // 当前款式的运费成本
        for (let j = 0; j < fbaProdList[i].priceList.length; ++j) {
            if (!fbaProdList[i].priceList[j].deliveryAmount || !isInteger(fbaProdList[i].priceList[j].deliveryAmount)) {
                continue
            }
            camt = accAdd(camt, fbaProdList[i].priceList[j].deliveryAmount)
            oneFreightCost = accAdd(oneFreightCost,accMul(fbaProdList[i].priceList[j].deliveryAmount,fbaProdList[i].priceList[j].firstLogisticsFee))
        }
        let cprodCost = accMul(camt, fbaProdList[i].cost)
        let cTotalCost = accAdd(cprodCost, oneFreightCost)
        amt = accAdd(amt, camt)
        prodCost = accAdd(prodCost, cprodCost)
        freightFee = accAdd(freightFee, oneFreightCost)
        totalCost = accAdd(totalCost, cTotalCost)
    }
    amtEle.html(amt)
    prodCostEle.html(prodCost.toFixed(2))
    freightFeeEle.html(freightFee.toFixed(2))
    totalCostEle.html(totalCost.toFixed(2))
}

function newdevelop_genOneConfirmFbaProd(prod) {
    let deliverList = ''
    for (let i = 0; i < prod.priceList.length; ++i) {
        if (prod.priceList[i].deliveryAmount > 0) {
            deliverList += `
            <div class="layui-form-item layui-row">
                        <label class="layui-form-label secondary">` + prod.priceList[i].country + `数量:</label>
                        <div class="layui-input-block lineHeight36">
                            ` + prod.priceList[i].deliveryAmount + `
                        </div>
                    </div>
            `
        }
    }

    if (!deliverList) {
        return ''
    }
    let one = `<div class="layui-tab layui-tab-card">
    <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6">
                    <div class="layui-form-item layui-row">
                        <label class="layui-form-label secondary">子SKU:</label>
                        <div class="layui-input-block lineHeight36">
                            ` + prod.sSku + `
                        </div>
                    </div>
                    <div class="layui-form-item layui-row">
                        <label class="layui-form-label secondary">款式名称:</label>
                        <div class="layui-input-block lineHeight36">
                            ` + prod.style + `
                        </div>
                    </div>
                </div>
                <div class="layui-col-md6 layui-col-lg6">
                    ` + deliverList + `
                </div>
            </div>
            </div>
    `
    return one
}

function newdevelop_updatePictureRequireDir() {
    let formEle = $('#newdevelop_pictureRequireAuditForm')
    let Adata = {
        id: formEle.find('[name=id]').val(),
        devId: newdevelop_onEditDetailDto.id,
        pictureRequireDir: formEle.find('[name=pictureRequireDir]').val(),
    }
    let ajax = new Ajax(true)
    ajax.post({
        url: '/preProdDev/updatePictureRequireDir.html',
        data: JSON.stringify(Adata),
        success: function(res) {}
    })
}

function newdevelop_pictureRequireAudit(type) {
    let formElem = $('#newdevelop_pictureRequireAuditForm')
    let Adata = {
        id: newdevelop_onEditDetailDto.id,
        msgPreproductPictureAudit: serializeObject(formElem)
    }
    switch (type) {
        case 1:
            if (!Adata.msgPreproductPictureAudit.leaderAuditStatus) {
                layer.msg('请选择审核结果')
                return
            }
            if (Adata.msgPreproductPictureAudit.leaderAuditStatus === '2') {
                if (!Adata.msgPreproductPictureAudit.leaderAuditRemark) {
                    layer.msg('审核失败必须填写审核备注')
                    return
                }
                Adata.selfPhotoStatus = 45
            } else {
                Adata.selfPhotoStatus = 46
            }
            break
        case 2:
            if (!Adata.msgPreproductPictureAudit.managerAuditStatus) {
                layer.msg('请选择审核结果')
                return
            }
            if (Adata.msgPreproductPictureAudit.managerAuditStatus === '2') {
                if (!Adata.msgPreproductPictureAudit.managerAuditRemark) {
                    layer.msg('审核失败必须填写审核备注')
                    return
                }
                Adata.selfPhotoStatus = 47
            } else {
                Adata.selfPhotoStatus = 48
            }
            break
        case 3:
            if (!Adata.msgPreproductPictureAudit.artManagerAuditStatus) {
                layer.msg('请选择审核结果')
                return
            }
            if (Adata.msgPreproductPictureAudit.artManagerAuditStatus === '2') {
                if (!Adata.msgPreproductPictureAudit.artManagerAuditRemark) {
                    layer.msg('审核失败必须填写审核备注')
                    return
                }
                Adata.selfPhotoStatus = 49
            } else {
                Adata.msgPreproductPictureAudit.photographer = formElem.find('[name=photographerId] option:selected').text()
                Adata.msgPreproductPictureAudit.artDesigner = formElem.find('[name=artDesignerId] option:selected').text()
                Adata.selfPhotoStatus = 1
            }
            break
    }
    let ajax = new Ajax(true)
    ajax.post({
        url: '/preProdDev/pictureRequireAudit.html',
        data: JSON.stringify(Adata),
        success: function(res) {

        }
    })
}

function newdevelop_clearProfitRate(self) {
    let trElem = $(self).closest('tr')
    if (!self.value) {
        trElem.find('[data-name2=fbaCharge]').val('')
        trElem.find('[data-name2=firstLogisticsFee]').val('')
        trElem.find('[data-name2=airTransportProfitRate]').val('')
        trElem.find('[data-name2=airDeliveryProfitRate]').val('')
        trElem.find('[data-name2=seaTransportProfitRate]').val('')
    }
}

// prover层弹框
function newdevelop_showRepeat(selector, dataList) {
    console.log(123, dataList)
    const layer = layui.layer,
        table = layui.table
    const oldId = selector.attr('data-tipId')
    if (oldId) {
        layer.close(oldId)
    }

    let tableList = []
    dataList.forEach(e => {
        let pSkuObj = {
            'pSku': null
        }
        pSkuObj.pSku = e
        tableList.push(pSkuObj)
    })
    console.log(tableList)
    const tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['20%', '400px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#newdevelop_comp_prover_repeat_tip').html(), selector], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: '#newdevelop_comp_prover_repeat_tip_table',
                id: 'newdevelop_comp_prover_repeat_tip_table',
                data: tableList,
                height: 350,
                cols: [
                    [
                        { title: '父sku', width: 350, align: 'center', templet: '#repeat_sku_tpl' },
                    ],
                ],
                page: false,
            })
        }
    })
    selector.attr('data-tipId', tipsIndex)
}


function searchNewProdCate() {
    layer.open({
        type: 1,
        title: '标题搜索分类',
        content: $("#addprodpinfo_searchCateTpl").html(),
        id: 'addprodpinfo_searchCateTplId',
        area: ['65%', '60%'],
        success: function(layero,index){
            let defaultVal = $('#preProdEditFrom').find('[name=enName]').val();
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
                    searchCateSelectHandle(layero, index);
                });
            });
        }
    });
} 

function searchCateSelectHandle(layero ,index){
    layero.on('click', '.cateHandle', function(){
        let cateOaId = $(this).attr('cateoaid');
        //let cateName = $(this).attr('catename');
        let cateTreeName = comRepEnglishQuote($(this).attr('catetreename'))
        $('#preProdEditFrom_cateId').val(cateOaId);
        $('#preProdEditFrom_cateName').text(cateTreeName);
        layer.close(index);
    });
  }

 