/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "formSelects"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        $ = layui.$;

    //查询列表
    function predictlogisticsfee_search() {
        table.render({
            elem: "#logisticsFeeConfigTable",
            id: 'logisticsFeeConfigTable',
            method: "post",
            url: ctx + "/purLogisticsFeeConfig/list",
            cols: [
                [
                    //标题栏
                    {title: "适用仓库",field: 'storeNameListStr', width: 300},
                    {title: "发货省份",field: 'provinceListStr', width: 350},
                    {title: "首重(kg)",field: 'firstWeight'},
                    {title: "首费(¥)",field: 'firstPrice'},
                    {title: "续重(kg)",field: 'nextWeight'},
                    {title: "续费(¥)",field: 'nextPrice'},
                    {title: "修改人",field: 'modifier'},
                    {title: "修改时间",field: 'modifyTime',templet: '<div>{{Format(d.modifyTime,`yyyy-MM-dd hh:mm`)}}</div>'},
                    {title: "备注",field: 'remark'},
                    { title: '操作', align: 'center', toolbar: '#predictlogisticsfee_toolbar' }
                ],
            ],
            page: false //是否显示分页
        });
    }
    predictlogisticsfee_search()

    function predictlogisticsfee_getOptionList(data) {
        oneAjax.post({
            url: ctx + '/purLogisticsFeeConfig/getInitConfig',
            success: function (res) {
                if (res.code === '0000') {
                    let provinceList = res.data?.provinceList || []
                    let storeList = res.data?.storeList || []
                    appendSelect($('#predictlogisticsfee_updateForm').find('select[name="storeIdList"]'), storeList, 'id', 'warehouseName')
                    appendSelect($('#predictlogisticsfee_updateForm').find('select[name="provinceList"]'), provinceList, 'name', 'name')
                    
                    layui.formSelects.render('predictlogisticsfee_storeId')
                    layui.formSelects.render('predictlogisticsfee_province')
                    if (data) {
                        let storeNameList = data.storeNameListStr?.split(',') || []
                        // 根据 storeNameListStr 获取 store id
                        let storeIds = storeList?.map(item => {
                            if (storeNameList?.includes(item.warehouseName)) {
                                return item.id
                            }
                        })
                        layui.formSelects.value('predictlogisticsfee_storeId', storeIds || []);
                        layui.formSelects.value('predictlogisticsfee_province', data.provinceListStr?.split(',') || []);
                    }
                    layui.form.render('select')
                }
            }
        })
    }

    $('#predictlogisticsfee_add').on('click', function() {
        editDialog('create') 
    })

    // 表格按钮监听
    table.on('tool(logisticsFeeConfigTable)', function(obj) {
        let layEvent = obj.event; //获得 lay-event 对应的值
        let data = obj.data; //获得当前行数据
        let tr = $(obj.tr)
        switch (layEvent) {
            case 'update':
                editDialog('update', data)
                break
        }
    })

    function editDialog(type, data) {
        let popIndex = layer.open({
            type: 1,
            title: '修改物流参数',
            area: ['600px', '500px'],
            btn: ['保存', '关闭'],
            content: $('#predictlogisticsfee_updatePop').html(),
            id:'autoAuditRules_storePopId',
            success: function(layero, index){
                // 初始化必填项
                initNotNull('#predictlogisticsfee_updateForm')
                let form = $('#predictlogisticsfee_updateForm')
                // 复现数据
                if (data) {
                    reappearance(data,form)
                }
                predictlogisticsfee_getOptionList(data)
            },
            yes: function () {
                // 检查必填项
                if (!checkNotNull('#predictlogisticsfee_updateForm')) {
                    return false
                }
                // 发送ajax修改
                let Adata = serializeObject($('#predictlogisticsfee_updateForm'))
                if (type === 'update') {
                    Adata.id = data.id
                }
                predictlogisticsfee_ajaxToUpdate(type,Adata,popIndex)
            }
        })
    }

    // 修改预估物流参数
    function predictlogisticsfee_ajaxToUpdate(type,data,popIndex) {
        data.provinceList = data.provinceList ? data.provinceList?.split(',') : []
        data.storeIdList = data.storeIdList ? data.storeIdList?.split(',') : []
        oneAjax.post({
            url: ctx + '/purLogisticsFeeConfig/addOrUpdate',
            data: data,
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg(`${type === 'create' ? '新增' : '修改'}成功`)
                    layer.close(popIndex)
                    predictlogisticsfee_search()
                }
            }
        })
    }
});
