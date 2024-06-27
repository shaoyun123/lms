layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;
    
    var casetypeFun = {
        tableRender: function(){
            var _this = this;
            table.render({
                elem: '#casetype_table',
                method: 'post',
                url: '/lms/winitCaseType/queryPage.html',
                page: false,
                limits: [50, 100, 300],
                limit: 50,
                id: "casetype_tableId",
                cols: [
                    [
                        {title: '箱子规格名称', field:'name'},
                        {title: '长(cm)', field:'length'},
                        {title: '宽(cm)', field: 'width'},
                        {title: '高(cm)', field: 'height'},
                        {title: '成本(￥)', field: 'cost'},
                        {title: '重量(g)', field: 'weight'},
                        {title: '备注', field: 'remark'},
                        {title: '操作',toolbar: '#casetype_toolBar'}
                    ]
                ],
                done: function(){
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(casetype_tableFilter)',function(obj){
                console.log(111)
                var data = obj.data;
                if(obj.event == 'edit'){ //修改
                    data.title="修改";
                    _this.addOrEditLayer(data);
                }else if(obj.event == 'delete'){ //启用功能
                    layer.confirm('确定删除该箱子规格吗？', function(){
                        let ajax = new Ajax(true)
                        ajax.post({
                            url: ctx + '/winitCaseType/deleteCaseType.html',
                            data: JSON.stringify(data),
                            success: function (res) {
                                if (res.code === '0000') {
                                    table.reload('casetype_tableId')
                                }
                            }
                        })
                    });
                }
            });
        },
        addBtnHandle: function(){
            var _this = this;
            $('#casetype_addCaseTypeBtn').on('click', function(){
                _this.addOrEditLayer({});
            })
        },
        // 新增/编辑弹框
        addOrEditLayer: function(obj){
            var _this = this;
            let title = ''
            if (!obj.id) {
                title = '新增'
            } else {
                title = '修改'
            }
            layer.open({
                type: 1,
                title: title,
                area:['800px', '600px'],
                btn: ['确认','关闭'],
                id: 'casetype_editOrAddLayerId',
                content: $('#casetype_editOrAddCaseTypeTpl').html(),
                success: function(layero, index){
                    initNotNull('#casetype_editOrAddCaseTypeForm')
                    let form = $('#casetype_editOrAddCaseTypeForm')
                    if (obj.id) {
                        let inps = form.find('[name]')
                        for (let i = 0; i < inps.length; ++i) {
                            inps[i].value = obj[inps[i].getAttribute('name')]
                        }
                    }
                },
                yes: function(index, layero){
                    console.log(111)
                    if (!checkNotNull('#casetype_editOrAddCaseTypeForm')) {
                        return false
                    }
                    let Adata = serializeObject($('#casetype_editOrAddCaseTypeForm'))
                    if (!Adata.length || !Adata.width || !Adata.height) {
                        layer.msg('长宽高必须大于0')
                        return false
                    }
                    // 检查数据
                    if (!isMoney(Adata.length) || !isMoney(Adata.width) || !isMoney(Adata.height) || !isMoney(Adata.weight) || !isMoney(Adata.cost)) {
                        layer.msg('请填入正确的长、宽、高、成本、重量')
                        return false
                    }
                    Adata.id = obj.id
                    _this.addOrUpdateCaseType(Adata)
                }
            })
        },
        addOrUpdateCaseType: function(data){
            let ajax = new Ajax(true)
            ajax.post({
                url: ctx + '/winitCaseType/addOrUpdateCaseType.html',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.code === '0000') {
                        layer.closeAll()
                        table.reload('casetype_tableId')
                    }
                }
            })
        }
    };
    //新增按钮
    casetypeFun.addBtnHandle();
    //进来就查询店铺
    casetypeFun.tableRender();
})
