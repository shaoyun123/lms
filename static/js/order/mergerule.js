/*
 * @Author: ztao
 * @Date: 2021-07-01 19:28:40
 * @LastEditTime: 2024-01-24 15:57:06
 * @Description: 
 */

layui.use(['admin','form','table','layer','laydate', 'laytpl', 'form'],function(){
    var admin = layui.admin,
        table = layui.table,
        form = layui.form,
        layer = layui.layer;

        mergerule_table_render();
        
        function mergerule_table_render(){
            table.render({
                elem: '#mergerule_table',
                method: 'get',
                url: '/lms/order/rule/merge/list.html',
                where: {},
                page: false,
                id: "mergerule_tableId",
                // limits: [50, 100, 200],
                limit: 100,
                unFixedTableHead: true, // 不固定表头
                height: window.innerHeight - 360,
                cols: [
                    [
                      {title: '平台', field: 'platCode', width: 100},
                      {title: '订单状态', field: 'orderStatus', templet: '#mergerule_orderStatus'},
                      {title: '备注', field: 'remark'},
                      // {title: '是否启用自动合单', width: 140, templet:'#mergerule_automerge'},
                      {title: '自动合单',templet:'#mergerule_automerge', width: 80}
                    ]
                ],
                done: function(res, curr, count){
                    // res.data.map((item,index) => {
                    //     if(item.platCode == "joom"){
                    //         $("#mergerule_table").next().find(`tr[data-index=${index}]`).remove()
                    //     }
                    // })

                   mergerule_tableBar_handle();
                }
            });
        }

        function mergerule_tableBar_handle(){
            //监听开关开启关闭
            form.on('switch(mergerule_automerge_switchFilter)', function(data){
              let cked = data.elem.checked;
              let id = $(this).parents('tr').find('.automerge').attr('data-id');
              mergerule_tableBar_isable(id, cked);
            }); 
            //监听checkbox点击事件
            form.on('checkbox(mergerule_orderStatusCkFilter)',function(){
                let $tr = $(this).parents('tr');
                let unAuditStatus = $tr.find('[name=unAuditStatus]').is(':checked') ? 110: 0;
                let unDispatchStatus = $tr.find('[name=unDispatchStatus]').is(':checked') ? 115: 0;
                let id=$tr.find('.orderStatus').attr('data-id');
                commonReturnPromise({
                  url: `/lms/order/rule/merge/updateMergeStatus.html?id=${id}&unAuditStatus=${unAuditStatus}&unDispatchStatus=${unDispatchStatus}`,
                  type: 'post'
                }).then(res => {
                  layer.msg(res || '操作成功',{icon:1});
                })
            });
        }

        function mergerule_tableBar_isable(id, autoMerge){
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
                    url: '/lms/order/rule/merge/update.html',
                    data: {
                        id: id,
                        autoMerge: autoMerge
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg('操作成功');
                            layer.close(index);
                            mergerule_table_render();
                        }else{
                            layer.msg(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                    }
                })
            },function(){
              let newAutoMerge = !autoMerge;
              $('#mergerule_table').next().find(`.layui-form[data-id=${id}] [name=automerge]`).prop('checked', newAutoMerge);
              form.render('checkbox');
            });
        }
})