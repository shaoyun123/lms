;(function(){
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
        var table = layui.table,
            layer = layui.layer,
            form = layui.form,
            laytpl = layui.laytpl
        let logisticsTaxID = {
            tableAddDataList: function () {
                let _this = this
                $('#logisticsTaxID_add').click(function () {
                    _this.tableLayerRevise(null, 0);
                })
            },
            tableRender: function(){
                var _this = this;
                table.render({
                    elem: '#logisticsTaxID_Table',
                    method: 'get',
                    url: '/lms/platTax/getAllPlatIossMapping',
                    page: true,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "logisticsTaxID_TableId",
                    cols: [
                        [
                            {title: 'id', field: 'id', width: '15%'},
                            {title: '平台', field: 'platCode', width: '15%'},
                            {title: '英国税号', field: 'englandIoss', width: '15%'},
                            {title: '欧盟EROI税号', field: 'euEroi', width: '15%'},
                            {title: '欧盟IOSS税号', field: 'euIoss', width: '15%'},
                            { title: '巴西税号', field: 'brazilIoss', width: '10%' },
                            {title: '挪威税号', field: 'norwayIoss', width: '10%'},
                            {title: '马来西亚税号', field: 'myIoss', width: '10%'},
                            {title: '操作', toolbar: '#logisticsTaxID_Table_operate', width: '10%'},
                        ]
                    ],
                    done: function (res) {
                        $('[data-field="id"]').hide()
                        _this.tableWatchbar()
                    }
                });
            },
            tableWatchbar: function () {
                var _this = this;
                table.on('tool(logisticsTaxID_Table)', function(obj) {
                    if (obj.event == 'revise') {
                        // console.log(obj);
                        _this.tableLayerRevise(obj.data, 1);
                    }else if (obj.event == 'remove') {
                        // _this.tableLayerRemove(obj.data)
                    }
                });
            },
            tableLayerRevise: function (data, status) {
                let _this = this
                layer.open({
                    type: 1,
                    title: status==0?'新增':'修改',
                    area: ['45%', '60%'],
                    btn:['保存','关闭'],
                    content: $('#logisticsTaxID_Table_revise').html(),
                    id: 'logisticsTaxID_Table_reviseId',
                    move: false,
                    success: function (layero, index) {
                        _this.requestListenum().then(res => {
                            let html = ''
                            res.platCodes.forEach(item => {
                                html += `<option value="${item}">${item}</option>`
                            })
                            layero.find('[name="platCode"]').html(html)
                        //初始化渲染
                        if (status == 1) {
                            _this.tableLayerReviseInitRender(layero, data)
                        }
                        form.render();
                        })
                    },
                    yes:function (index, layero) {
                        _this.tableLayerReviseSubmit(index, status==0?'新增':'修改')
                        layero.find('#logisticsTaxID_Table_reviseForm_submit').click()
                    },
                })
            },
            tableLayerRemove: function (data) {
                layer.confirm('确定删除吗？', function () {
                    
                })
            },
            tableLayerReviseInitRender: function (layero, data) {
                layero.find('[name="id"]').val(data.id)
                layero.find('[name="platCode"]').val(data.platCode)
                layero.find('[name="englandIoss"]').val(data.englandIoss)
                layero.find('[name="euEroi"]').val(data.euEroi)
                layero.find('[name="euIoss"]').val(data.euIoss)
                layero.find('[name="brazilIoss"]').val(data.brazilIoss)
                layero.find('[name="norwayIoss"]').val(data.norwayIoss)
                layero.find('[name="myIoss"]').val(data.myIoss)
            },
            tableLayerReviseSubmit: function (index, status) {
                let _this = this
                form.on('submit(logisticsTaxID_Table_reviseForm_submit)', function(data){
                    // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                    // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                    // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                    if (status == '修改') {
                        _this.requestReviseSubmit(data.field).then(res => {
                            layer.msg(res || '操作成功', { icon: 1 })
                            layer.close(index)
                            _this.tableRender()
                        })
                    }else if (status == '新增') {
                        _this.requestAddSubmit(data.field).then(res => {
                            layer.msg(res || '操作成功', { icon: 1 })
                            layer.close(index)
                            _this.tableRender()
                        })
                    }
                    
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                  });
            },
            requestReviseSubmit: function (dataObj) {
                return commonReturnPromise({
                    url: '/lms/platTax/updatePlatIossMapping',
                    type: 'put',
                    params: JSON.stringify(dataObj),
                    contentType: 'application/json',
                })
            },
            requestAddSubmit: function (dataObj) {
                return commonReturnPromise({
                    url: '/lms/platTax/insertPlatIossMapping',
                    type: 'post',
                    params: JSON.stringify(dataObj),
                    contentType: 'application/json',
                })
            },
            requestListenum: function (dataObj) {
                return commonReturnPromise({
                    url: '/lms/unauditorder/listenum.html',
                    type: 'post'
                })
            }
        };

        logisticsTaxID.tableRender();
        logisticsTaxID.tableAddDataList()
    });
})();