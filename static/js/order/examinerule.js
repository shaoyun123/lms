
layui.use(['admin','form','table','layer','laydate', 'laytpl'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer;

        examinerule_table_render();
        
        function examinerule_table_render(){
            table.render({
                elem: '#examinerule_table',
                method: 'get',
                url: '/lms/order/rule/audit/list.html',
                where: {},
                page: false,
                id: "examinerule_tableId",
                // limits: [50, 100, 200],
                // limit: 50,
                cols: [
                    [
                      {title: '平台', field: 'platCode', width: 100},
                      {title: '备注', field: 'remark'},
                      {title: '是否启用自动审核', width: 140, templet:'#examinerule_automerge'},
                      {title: '操作',toolbar: '#examinerule_tableIdBar', width: 80}
                    ]
                ],
                done: function(){
                   examinerule_tableBar_handle();
                }
            });
        }

        function examinerule_tableBar_handle(){
            table.on('tool(examinerule_tableFilter)',function(obj){
                var data = obj.data;
                var id= data.id;
                if(obj.event== 'enable'){ //启用[禁用状态,点击传入true]
                    // console.log('启用')
                    examinerule_tableBar_isable(id, true);
                }else if(obj.event == 'disable'){
                    // console.log('禁用')
                    examinerule_tableBar_isable(id, false);
                }
            });
        }

        function examinerule_tableBar_isable(id, autoMerge){
            var defaultTip = '';
            if(autoMerge == true){
                defaultTip = '确定启用吗';
            }else{
                defaultTip = '确定停用吗';
            }
            layer.confirm(defaultTip, {icon: 3, title:'提示'}, function(index){
                $.ajax({
                    type: 'post',
                    dataType:'json',
                    url: '/lms/order/rule/audit/update.html',
                    data: {
                        id: id,
                        autoAudit: autoMerge
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg('操作成功');
                            layer.close(index);
                            examinerule_table_render();
                        }else{
                            layer.msg(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            });
        }
})