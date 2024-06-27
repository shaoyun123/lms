layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     laypage = layui.laypage,
     $ = layui.$,
     joomTableIns={};

    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    //表格渲染结果
    //展示已知数据
    var data = new Object();
    if(joom_arr.length > 0){
        data.idList=[];
        for (var i = 0; i < joom_arr.length; i++){
            data.idList.push(joom_arr[i].id);
        }
        data.idList = data.idList.join(",");
        $('#joomEditTandD_idList').val(data.idList)
        initTableRender_etad(data.idList)
    }
   
   //点击替换按钮
   $('#joom_mt_replaceSubtitle').click(function () {
       joom_replace_string(1)
   })

   //一键应用新标题
   $('#one_click_application_title').click(function () {
       joom_replace_string(2)
   })
   //一键应用新描述
   $('#one_click_application_describe').click(function () {
       joom_replace_string(3)
   })
    //同步描述
    $('#joomOnlineETAD_aync_describe').click(function () {
        let pTable = table.checkStatus('modifyJoomTitle_Table').data;
        let prodPSku = pTable.map(item => item.prodPSku)
        commonReturnPromise({
            type: 'get',
            url: '/lms/joomlisting/getJoomProdSkuExtra?prodPSkuList=' + prodPSku.join(","),
        }).then(res=>{
            var trObj = $('#modifyJoomTitle_Table').next().find('.layui-table-body tbody').find('tr');
            if(res.notExtraSkuList.length > 0){
                layer.alert('部分同步成功，其中joom模板里没有描述的商品父SKU为：' + res.notExtraSkuList.join(","),{icon:7})
            }else{
                layer.alert('同步成功')
            }
            applytoChecked('modifyJoomTitle_Table',joomTableIns,function(tr){
                let prodPSku = tr.find('td[data-field="prodPSku"] div').text();//prodPSku
                for(var j=0;j<res.list.length;j++){
                    if (prodPSku == res.list[j]['prodPSku']) {
                        tr.find('.descript_textarea').val(res.list[j]['prodDesc'])
                    }

                }
            });
            // for(var i=0;i<trObj.length;i++){
            //     for(var j=0;j<res.list.length;j++){
            //         let prodPSku = $.trim(trObj.eq(i).find("[data-field='prodPSku'] div").text());//prodPSku
            //         if (prodPSku == res.list[j]['prodPSku']) {
            //             trObj.eq(i).find(".descript_textarea").val(res.list[j]['prodDesc'])
            //         }
            //
            //     }
            // }
        })
    })

    //点击提交修改
   var timeUnit_ETD
   clearInterval(timeUnit_ETD)
   $('#joom_search_replace').click(function () {
       let replaceResult = table.checkStatus('modifyJoomTitle_Table')
       if (replaceResult.data && replaceResult.data.length) {
           let temporayArr = []
           replaceResult.data.forEach(function (value) {
               let temporaryObj = deepCopy(value)
               temporaryObj.newTitle = $(`.id_Joomid_input[value=${value.id}]`).parents('tr').find('#new_JoomTitle_input').val()
               temporaryObj.newProdDesc = $(`.id_Joomid_input[value=${value.id}]`).parents('tr').find('#new_Joomdescribe_textarea').val()
               delete temporaryObj.prodDesc
               delete temporaryObj.title
               temporayArr.push(temporaryObj)
           })
           clearInterval(timeUnit_ETD)
           commonReturnPromise({
               type: 'post',
               url: '/lms/onlineProductJoom/updateMainTitleAndDescription',
               params: JSON.stringify(temporayArr),
               contentType: 'application/json',
           }).then(res=>{
            layer.msg('操作成功')
            timeUnit_ETD = setInterval(function () {
				cherryRequestResult(res)
			}, 5000);
           })
       }else {
           layer.msg('请选择数据！')
       }
   })

   //查询操作之后的结果
   function cherryRequestResult(res) {
    var trObj =  $('#modifyJoomTitle_Table').next().find('.layui-table-body tbody').find('tr');
    for(var i=0;i<trObj.length;i++){
        var obj = new Object();
        obj.storeProdPId = $.trim(trObj.eq(i).find("[data-field='storeProdPId']").text());//storeProdPId
        obj.storeAcctId =  $.trim(trObj.eq(i).find("[data-field='storeAcctId']").text());//店铺id
        obj.pSku =  $.trim(trObj.eq(i).find("[data-field='pSku']").text());//pSku
        var checkStat = false
        var resultMsg = trObj.eq(i).find("[data-field='result']").text();
        if (res && Object.keys(res).length) {
            checkStat = true
        }
        if((resultMsg=='' || resultMsg==null) && checkStat){
            if (($.trim(trObj.eq(i).find("[data-field='0']").find('input').prop('checked'))) == 'true') {
                selectResult(obj,trObj,i);
            }
        }
       }
   }

   function selectResult(obj,trObj,i){
    delete obj.storeProdPId
    commonReturnPromise({
        type: 'get',
        url: '/lms/onlineProductJoom/selectModifyTitleAndDescriptionResult',
        params: obj,
    }).then(returnData=> {
        if(returnData =='修改标题和描述成功'){
            trObj.eq(i).find("[data-field='result']").html("<div style='color:blue'>"+returnData+"</div>");
        }else if(!!returnData){
            trObj.eq(i).find("[data-field='result']").html("<div style='color:red'>"+returnData+"</div>");
        }
    })
    
}


   //表格初始化显示
   function initTableRender_etad(idList) {
    joomTableIns = table.render({
        elem: "#modifyJoomTitle_Table",
        method:'get',
        url:"/lms/onlineProductJoom/getUpdateMainTitilAndDescriptionPage",
        cols: [[
            {type: "checkbox"},
            { field: "id", title: "id", templet: '#editTitle_id_Joomid'},
            { field: "pSku", title: "pSku"},
            { field: "prodPSku", title: "商品父SKU"},
            { field: "storeAcct", title: "店铺" , width: 200},
            { field: "storeAcctId", title: "storeAcctId" },
            { field: "storeProdPId", title: "item_id", width: 100},
            { field: "title", title: "标题",templet: '#new_JoomTitle',width: 550},
            { field: "prodDesc", title: "描述",templet: '#new_Joomdescribe',width: 400},
            { field: "result",title: '操作结果',  align: 'center',width: 150}
        ]],
        where:{idList},
        page:true,
        id:"modifyJoomTitle_Table",
        limits:[10,20,50],
        limit:10,
        done:function(res, curr, count){
            commonAddEventTitleToggle($('#editTitleAndDescription'), 'joom')
            $("[data-field='id']").hide()
            $("[data-field='storeAcctId']").hide()
            $("[data-field='pSku']").hide()
            $("#tolnum_span_joom_editTitle").text("共"+count+"条");

        }
       })
   }

    /**
     * 根据不同状态收集不同数据
     * @param status  //status=1(全部替换)，=2(标题),=3(描述)
     */
   //替换
   function joom_replace_string(status) {
       if (status == 1) {
           let oldTitle = $('#joom_old_title').val(),
            newTtile = $('#joom_new_title').val(),
            oldDesc = $('#joom_old_describe').val(),
            newDesc = $('#joom_new_describe').val();
            if((oldTitle!=="")||(oldDesc!=="")){
                applytoChecked('modifyJoomTitle_Table',joomTableIns,function(tr){
                    let title = tr.find('.title_input').val();
                    let desc = tr.find('.descript_textarea').val();
                    title = replace_string(title,oldTitle,newTtile);
                    desc = replace_string(desc,oldDesc,newDesc);
                    tr.find('td[data-field="title"] div input').val(title);
                    tr.find('td[data-field="prodDesc"] div textarea').val(desc);
                 });
                 }else{
                     layer.msg('请输入需要修改条目的完整数据');
                 }
       }else if (status == 2) {
            let newTtileTwo = $('#joomapplicationTitle').val()
            if(newTtileTwo!=""){
            applytoChecked('modifyJoomTitle_Table',joomTableIns,function(tr){
              tr.find('td[data-field="title"] div input').val(newTtileTwo);
            });
        }else{
            layer.msg("请填写新标题")
        }
       }else if (status == 3) {
            let newDescThree = $('#joomapplicationDesc').val()
            if(newDescThree!=""){
            applytoChecked('modifyJoomTitle_Table',joomTableIns,function(tr){
              tr.find('td[data-field="prodDesc"] div textarea').val(newDescThree);
            });
        }else{
            layer.msg("请填写新描述")
        }
       }
   }
});
