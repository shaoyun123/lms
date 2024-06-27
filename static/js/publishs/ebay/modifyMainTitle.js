layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     $ = layui.$

    //展示已知数据
    var tableIns=table.render({
        elem: "#modifyTitle_Table",
        cols: [[
            {type: "checkbox"},
            { field: "storeAcct", title: "店铺" , width: 200},
            { field: "itemId", title: "item_id", width: 100},
            { field: "title", title: "原标题"},
            { field: "new_title", title: "修改为",templet: '#new_Title'},
            { field: "result",title: '操作结果',  align: 'center',width: 150}
        ]],
        data:modifyTitle_arr,
        page:false,
        height: 500,
        limit:100,
        id:"modifyTitle_Table",
        done:function(res, curr, count){
          $("#tolnum_span_ebay_modifyTitle").text("共"+count+"条");
          //ztt20231025-监听input事件
          commonAddEventTitleToggle($("#modifyTitle_Table").next(), 'ebay');
        }
    });
    
    /**
	 * 表格操作
     */
	function  update_string() {
     applytoChecked('modifyTitle_Table',tableIns,function(tr){
        var a = tr.find('.mt_newTitle').val();
        a = replace_string(a,$("#old_string").val(),$("#new_string").val());
        tr.find('.mt_newTitle').val(a);
    });

    }
    /**
	 * 一键替换字符
     */
    // function replace_string(s1,s2,s3) {
    //     if(s2){
    //         s1 = s1.split(s2).join(s3);
    //     }
    //     return s1;
    // }
    /**
	 * 替换所有字符
     */
    $("#mt_replace").click(function () {
        update_string();
    });
	/*function  insert() {
		debugger
        var trObj =  $('#tortListngTable').next().find('.layui-table-body tbody').find('tr');
        for(var i=0;i<trObj.length;i++){
            var a = trObj.eq(i).find('td').eq(3).find('div').text();
            console.log(a)
            trObj.eq(i).find('td').eq(4).find('input').val(a);
        }
    }*/
    /**
	 * 批量修改
     */
    $("#modifyTitle").click(function () {
            var mt_arr = [];
            //获取表格行对象
            var trObj =  $('#modifyTitle_Table').next().find('.layui-table-body tbody').find('tr');
            for(var i=0;i<trObj.length;i++){
                var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
                if(checkStat){
                    var obj = {};
                    var a = trObj.eq(i).find('td').eq(4).find('input').val();
                    obj.title = a;
                    obj.itemId = trObj.eq(i).find('td').eq(2).find('div').text();
                    mt_arr.push(obj);
                }
            }
            if(mt_arr.length <= 0){
                layer.msg("请选择需要修改的数据");
                return;
            }
            loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/ebayIsEnableProduct/updateMainTitle.html",
            data:{'mt_arr':JSON.stringify(mt_arr)},
            async: true,
            dataType: "JSON",
            success:function (data) {
                var trObj =  $('#modifyTitle_Table').next().find('.layui-table-body tbody').find('tr');
                for(var i=0;i<trObj.length;i++){
                    var mt_itemid = trObj.eq(i).find('td').eq(2).find('div').text();
                    var msg = data.data[mt_itemid];

                    if(msg != undefined){
                        if(msg == "修改成功"){
                            trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:green'>" + data.data[mt_itemid] + "</div>");
                        }else{
                            trObj.eq(i).find('td').eq(5).find('.layui-table-cell').html("<div style='color:red;posion: relative' class='errordata'>修改失败</div>");
                            trObj.eq(i).find('td').eq(5).find('.layui-table-cell').append("<textarea class='layui-hide'>"+data.data[mt_itemid]+"</textarea>");
                        }
                    }
                }
                loading.hide()
            }
        })
    })
});
$('body').on('mouseover','.errordata',function(){
    var content = $(this).next("textarea").val()
    layer.tips(content, $(this), {
        time: 3000
    });
})