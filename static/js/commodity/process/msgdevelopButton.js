var producttpl_develop_msg;
var openAddMsg;
var msg_develop_all_data={};
var dataOrgList;

layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     $ = layui.$;
     form.render(null, 'component-form-element');
     element.render('breadcrumb', 'breadcrumb');
     form.render('select')

    //添加
    openAddMsg =  function (Obj,isAdd,type,queryType){
        msg_develop_all_data = {};
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: "添加/修改开发通知",
            btn: queryType=='1' && Obj.prodPSku && type=='2'?msgBtn:msgBtn1,
            area: ['70%', '70%'],
            success: function () {
                layui.view(this.id).render("route/iframe/msg/addDevelopMsg").done(function () {
                    if(Obj.prodSSku){
                        console.log("jinlai  queryType:"+queryType)
                        $("#development_msg_sku").val(Obj.prodSSku);
                        //待处理页签不可编辑
                        if(queryType == '1'){
                            console.log("进来了")
                            $("#development_msg_sku").attr("readOnly",true);
                        }
                    }
                    if(type=='1'){
                        $("#development_msg_sku").val(Obj.prodPSku);
                    }
                    if(Obj.demandType){
                        var arr1 = [];
                        arr1 = Obj.demandType.split(',');
                        console.log('arr1是', arr1)
                        setTimeout(function(){
                            layui.formSelects.value('msg_develop_typetpl', arr1);      //赋值 北京,上海
                        }, 200)
                        //待处理页签不可编辑
                        if(queryType == '1'){
                            layui.formSelects.disabled('msg_develop_typetpl')
                        }
                    }
                    if(Obj.demandDesc){
                        $("#develop_msg_remark").val(Obj.demandDesc);
                    }
                    if(Obj.allNeedProcessPerson){
                        $("#develop_person").val(Obj.allNeedProcessPerson);
                        if(queryType == '1') {
                            $("#add_develop_msg_personbtn").addClass('layui-btn-disabled');
                        }
                    }
                    if(Obj.imageUrl){
                        var ar = Obj.imageUrl.split(',');
                        var html = '';
                        for(var i in ar) {
                            var src = ar[i];
                            html += '<img src=' + src + " class='originalImgSize' name='imgUrl' style='width:200px;height:200px;border:1px solid #f2f2f2' />";
                        }
                        $('#add_msg_image').html(html)
                    }


                    new UploadImage("add_msg_image", ctx + '/preProdDev/getBase64Img.html').upload(function (xhr) { //上传完成后的回调
                        // console.log(xhr);
                        var img = new Image('200', '200');
                        var returnData;
                        try {
                            returnData = xhr.responseText
                        } catch (err) {

                        }
                        if (xhr.responseText == '') {
                            layer.msg("上传出错!");
                        } else if (returnData != undefined && returnData.code == '9999') {
                            layer.msg("上传出错!" + xhr.responseText);
                        } else {
                            img.src = xhr.responseText;
                            // img.classList.add("b1");
                            // img.classList.add('img_show_hide')
                            // img.classList.add('originalImgSize')
                            img.name='imgUrl'
                            // console.log(img)
                            $("#product_optimize_add_form input[name='image']").val(xhr.responseText);
                            console.log(img.src)
                            var imagearr = [];
                            var path = document.getElementById('add_msg_image').childNodes;
                            for(var i in path){
                                if(path[i].name=='imgUrl'){
                                    imagearr.push(path[i].src)
                                }
                            }
                            if(imagearr.length >= 5){
                                layer.msg("图片不可以超过五张")
                            }else{
                                this.appendChild(img);
                            }
                        }
                    });
                    //图片的处理
                    $('#add_msg_image').on('click','img', function(){
                        var index = $(this).index();
                        ImagePreview.init({id:$("#add_msg_image img"), index: index});
                    })
                })
            },
            yes: function () {
                /**
                 * 代码冗余量大  等着上线  暂时不想修改 后面有时间再改
                 */
                if(isAdd){//如果是新增
                    if(msgBtn1[0]=='关闭'){
                        layer.close(index)
                        return false;
                    }
                    var imageArray = [];
                    var developTypes = [];
                    var developTypselect = formSelects.value("msg_develop_typetpl");
                    if(developTypselect.length == 0){
                        layer.msg("请选择通知类型")
                        return false;
                    }
                    for(var i in developTypselect){
                        developTypes.push(developTypselect[i].value)
                    }

                    var path = document.getElementById('add_msg_image').childNodes;
                    for(var i in path){
                        if(path[i].name=='imgUrl'){
                            imageArray.push(path[i].src.replace('!size=60x60',''))
                        }
                    }
                    var prodPSku = $("#development_msg_sku").val();
                    if(!prodPSku){
                        layer.msg("请输入sku")
                        return false;
                    }
                    var develop_person = $("#develop_person").val();
                    if(!develop_person){
                        layer.msg("请选择处理人")
                        return false;
                    }
                    if(!msg_develop_all_data.prodPSku){
                        msg_develop_all_data.prodPSku=prodPSku;
                    }
                    msg_develop_all_data.imgList = imageArray.join(',');
                    msg_develop_all_data.developTypes = developTypes.join(',');

                    msg_develop_all_data.develop_person = develop_person;
                    var remark = $("#develop_msg_remark").val();
                    if(!remark){
                        layer.msg("请输入通知备注")
                        return false;
                    }
                    msg_develop_all_data.develop_msg_remark = remark;
                    msg_develop_all_data.saveType = '1';
                    if(queryType=='1' && Obj.prodPSku){
                        msg_develop_all_data.saveType = '1';//保存类型1：保存为待发布状态，2：保存为待处理状态
                    }

                    if(Obj.id){
                        msg_develop_all_data.id = Obj.id;
                    }
                    loading.show();
                    $.ajax({
                        type:"POST",
                        url:ctx + '/msgDevelopmentNotice/saveDevelopMsg.html',
                        data:msg_develop_all_data,
                        dataType:"json",
                        success:function(returnData){
                            loading.hide();
                            if(returnData.code == '0000'){
                                layer.close(index)
                                layer.msg('操作成功')
                            }else{
                                layer.msg(returnData.msg)
                            }
                            if(type=='2'){
                                msgDevelopmentNotice_reload();
                            }
                        },
                        error:function () {
                            layer.msg("服务器正忙")
                        }
                    })
                }else{
                    if(queryType == '0'){//未发布状态
                        if(msgBtn[0] == '关闭'){
                            layer.close(index)
                            return false;
                        }
                        var imageArray = [];
                        var developTypes = [];
                        var developTypselect = formSelects.value("msg_develop_typetpl");
                        if(developTypselect.length == 0){
                            layer.msg("请选择通知类型")
                            return false;
                        }
                        for(var i in developTypselect){
                            developTypes.push(developTypselect[i].value)
                        }

                        var path = document.getElementById('add_msg_image').childNodes;
                        for(var i in path){
                            if(path[i].name=='imgUrl'){
                                imageArray.push(path[i].src.replace('!size=60x60',''))
                            }
                        }
                        var prodPSku = $("#development_msg_sku").val();
                        if(!prodPSku){
                            layer.msg("请输入sku")
                            return false;
                        }
                        var develop_person = $("#develop_person").val();
                        if(!develop_person){
                            layer.msg("请选择处理人")
                            return false;
                        }
                        if(!msg_develop_all_data.prodPSku){
                            msg_develop_all_data.prodPSku=prodPSku;
                        }
                        msg_develop_all_data.imgList = imageArray.join(',');
                        msg_develop_all_data.developTypes = developTypes.join(',');

                        msg_develop_all_data.develop_person = develop_person;
                        var remark = $("#develop_msg_remark").val();
                        if(!remark){
                            layer.msg("请输入通知备注")
                            return false;
                        }
                        msg_develop_all_data.develop_msg_remark = remark;
                        msg_develop_all_data.saveType = '1';
                        if(queryType=='1' && Obj.prodPSku){
                            msg_develop_all_data.saveType = '2';//保存类型1：保存为待发布状态，2：保存为待处理状态
                        }

                        if(Obj.id){
                            msg_develop_all_data.id = Obj.id;
                        }
                        loading.show();
                        $.ajax({
                            type:"POST",
                            url:ctx + '/msgDevelopmentNotice/saveDevelopMsg.html',
                            data:msg_develop_all_data,
                            dataType:"json",
                            success:function(returnData){
                                loading.hide();
                                if(returnData.code == '0000'){
                                    layer.close(index)
                                    layer.msg('操作成功')
                                }else{
                                    layer.msg(returnData.msg)
                                }
                                if(type=='2'){
                                    msgDevelopmentNotice_reload();
                                }
                            },
                            error:function () {
                                layer.msg("服务器正忙")
                            }
                        })
                    }else{//已发布状态
                        if(msgBtn[0] == '保存'){
                            var imageArray = [];
                            var developTypes = [];
                            var developTypselect = formSelects.value("msg_develop_typetpl");
                            if(developTypselect.length == 0){
                                layer.msg("请选择通知类型")
                                return false;
                            }
                            for(var i in developTypselect){
                                developTypes.push(developTypselect[i].value)
                            }

                            var path = document.getElementById('add_msg_image').childNodes;
                            for(var i in path){
                                if(path[i].name=='imgUrl'){
                                    imageArray.push(path[i].src.replace('!size=60x60',''))
                                }
                            }
                            var prodPSku = $("#development_msg_sku").val();
                            if(!prodPSku){
                                layer.msg("请输入sku")
                                return false;
                            }
                            var develop_person = $("#develop_person").val();
                            if(!develop_person){
                                layer.msg("请选择处理人")
                                return false;
                            }
                            if(!msg_develop_all_data.prodPSku){
                                msg_develop_all_data.prodPSku=prodPSku;
                            }
                            msg_develop_all_data.imgList = imageArray.join(',');
                            msg_develop_all_data.developTypes = developTypes.join(',');

                            msg_develop_all_data.develop_person = develop_person;
                            var remark = $("#develop_msg_remark").val();
                            if(!remark){
                                layer.msg("请输入通知备注")
                                return false;
                            }
                            msg_develop_all_data.develop_msg_remark = remark;
                            msg_develop_all_data.saveType = '1';
                            if(queryType=='1' && Obj.prodPSku){
                                msg_develop_all_data.saveType = '2';//保存类型1：保存为待发布状态，2：保存为待处理状态
                            }

                            if(Obj.id){
                                msg_develop_all_data.id = Obj.id;
                            }
                            loading.show();
                            $.ajax({
                                type:"POST",
                                url:ctx + '/msgDevelopmentNotice/saveDevelopMsg.html',
                                data:msg_develop_all_data,
                                dataType:"json",
                                success:function(returnData){
                                    loading.hide();
                                    if(returnData.code == '0000'){
                                        layer.close(index)
                                        layer.msg('操作成功')
                                    }else{
                                        layer.msg(returnData.msg)
                                    }
                                    if(type=='2'){
                                        msgDevelopmentNotice_reload();
                                    }
                                },
                                error:function () {
                                    layer.msg("服务器正忙")
                                }
                            })
                        }else if(msgBtn[0] =='处理'){
                            var obj = {};
                            obj.id = Obj.id;
                            loading.show()
                            $.ajax({
                                type: "POST",
                                url: ctx + "/msgDevelopmentNotice/processMsg.html",
                                data: obj,
                                dataType: "json",
                                success: function (returnData) {
                                    loading.hide()
                                    msgDevelopmentNotice_reload()
                                    if (returnData.code == "0000") {
                                        $("#msgSearchBtn").trigger('click');
                                        layer.msg("处理成功");
                                        layer.close(index)
                                    } else {
                                        layer.msg(returnData.msg);
                                    }
                                },
                                error: function () {
                                    layer.msg("服务器正忙");
                                }
                            });
                            return false;
                        }else{
                            layer.close(index)
                        }
                    }
                }
            },
            btn2: function(index, layero){
                if(isAdd){
                    //按钮【按钮二】的回调
                    var imageArray = [];
                    var developTypes = [];
                    var developTypselect = formSelects.value("msg_develop_typetpl");
                    if(developTypselect.length == 0){
                        layer.msg("请选择通知类型")
                        return false;
                    }
                    for(var i in developTypselect){
                        developTypes.push(developTypselect[i].value)
                    }
                    var path = document.getElementById('add_msg_image').childNodes;
                    for(var i in path){
                        if(path[i].name=='imgUrl'){
                            imageArray.push(path[i].src.replace('!size=60x60',''))
                        }
                    }
                    var prodPSku = $("#development_msg_sku").val();
                    if(!prodPSku){
                        layer.msg("请输入sku")
                        return false;
                    }
                    console.log(msg_develop_all_data)
                    var develop_person = $("#develop_person").val();
                    if(!develop_person){
                        layer.msg("请选择处理人")
                        return false;
                    }

                    if(!msg_develop_all_data.prodPSku){
                        msg_develop_all_data.prodPSku=prodPSku;
                    }
                    msg_develop_all_data.imgList = imageArray.join(',');
                    msg_develop_all_data.developTypes = developTypes.join(',');

                    msg_develop_all_data.develop_person = develop_person;
                    var remark = $("#develop_msg_remark").val();
                    if(!remark){
                        layer.msg("请输入通知备注")
                        return false;
                    }
                    msg_develop_all_data.saveType = '2';//保存类型1：保存为待发布状态，2：保存为待处理状态
                    msg_develop_all_data.develop_msg_remark = remark;
                    if(Obj.id){
                        msg_develop_all_data.id = Obj.id;
                    }
                    loading.show();
                    $.ajax({
                        type:"POST",
                        url:ctx + '/msgDevelopmentNotice/saveDevelopMsg.html',
                        data:msg_develop_all_data,
                        dataType:"json",
                        success:function(returnData){
                            loading.hide();
                            if(returnData.code == '0000'){
                                layer.close(index)
                                layer.msg('操作成功')
                            }else{
                                layer.msg(returnData.msg)
                            }
                            if(type=='2'){
                                msgDevelopmentNotice_reload();
                            }
                        },
                        error:function () {
                            layer.msg("服务器正忙")
                        }
                    })
                    return false;
                }else{
                    if(queryType =='0'){
                        //按钮【按钮二】的回调
                        var imageArray = [];
                        var developTypes = [];
                        var developTypselect = formSelects.value("msg_develop_typetpl");
                        if(developTypselect.length == 0){
                            layer.msg("请选择通知类型")
                            return false;
                        }
                        for(var i in developTypselect){
                            developTypes.push(developTypselect[i].value)
                        }
                        var path = document.getElementById('add_msg_image').childNodes;
                        for(var i in path){
                            if(path[i].name=='imgUrl'){
                                imageArray.push(path[i].src.replace('!size=60x60',''))
                            }
                        }
                        var prodPSku = $("#development_msg_sku").val();
                        if(!prodPSku){
                            layer.msg("请输入sku")
                            return false;
                        }
                        console.log(msg_develop_all_data)
                        var develop_person = $("#develop_person").val();
                        if(!develop_person){
                            layer.msg("请选择处理人")
                            return false;
                        }


                        if(!msg_develop_all_data.prodPSku){
                            msg_develop_all_data.prodPSku=prodPSku;
                        }
                        msg_develop_all_data.imgList = imageArray.join(',');
                        msg_develop_all_data.developTypes = developTypes.join(',');

                        msg_develop_all_data.develop_person = develop_person;
                        var remark = $("#develop_msg_remark").val();
                        if(!remark){
                            layer.msg("请输入通知备注")
                            return false;
                        }
                        msg_develop_all_data.saveType = '2';//保存类型1：保存为待发布状态，2：保存为待处理状态
                        msg_develop_all_data.develop_msg_remark = remark;
                        if(Obj.id){
                            msg_develop_all_data.id = Obj.id;
                        }
                        loading.show();
                        $.ajax({
                            type:"POST",
                            url:ctx + '/msgDevelopmentNotice/saveDevelopMsg.html',
                            data:msg_develop_all_data,
                            dataType:"json",
                            success:function(returnData){
                                loading.hide();
                                if(returnData.code == '0000'){
                                    layer.close(index)
                                    layer.msg('操作成功')
                                }else{
                                    layer.msg(returnData.msg)
                                }
                                if(type=='2'){
                                    msgDevelopmentNotice_reload();
                                }
                            },
                            error:function () {
                                layer.msg("服务器正忙")
                            }
                        })
                        return false;
                    }else{
                        if(msgBtn[1]){
                            if(msgBtn[1]=='处理'){
                                var obj = {};
                                obj.id = Obj.id;
                                loading.show()
                                $.ajax({
                                    type: "POST",
                                    url: ctx + "/msgDevelopmentNotice/processMsg.html",
                                    data: obj,
                                    dataType: "json",
                                    success: function (returnData) {
                                        loading.hide()
                                        msgDevelopmentNotice_reload()
                                        if (returnData.code == "0000") {
                                            $("#msgSearchBtn").trigger('click');
                                            layer.msg("处理成功");
                                            layer.close(index)
                                        } else {
                                            layer.msg(returnData.msg);
                                        }
                                    },
                                    error: function () {
                                        layer.msg("服务器正忙");
                                    }
                                });
                                return false;
                            }else{
                                layer.close(index)
                            }
                        }else{//不存在按钮2  直接关闭
                            layer.close(index);
                        }
                    }
                }
            },
            end: function () {
                loading.hide();
            }
        })
    }

    /**
     *m模板页面 按钮提示
     * @param parentSku
     * @param prodPId
     */
    producttpl_develop_msg = function (parentSku,prodPId) {
        $.ajax({
            url: ctx + '/msgDevelopmentNotice/getLastDevelopMsg.html',
            data: {"parentSku": parentSku,"prodPId":prodPId},
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var prodObj=returnData.data;
                    if(prodObj != null){//提醒历史通知
                        var tipHtml = "该SKU <span style='color:#007DDB'>" + parentSku + " </span>";
                        tipHtml += "已于<span style='color:#007DDB'>" + Format(prodObj.createTime, "yyyy-MM-dd hh:mm:ss") + "</span>由 ";
                        tipHtml += "<span style='color:#007DDB'>" + prodObj.creator + "</span> 发出过 ";
                        tipHtml += "<span style='color:#007DDB'>" + prodObj.demandType + "</span> 的通知，是否要重复添加?<br/><hr/>";
                        tipHtml += "需求备注：<span style='text-indent:2em;'>" + prodObj.demandDesc + "</span><br/>";
                        var indexConfirm=layer.confirm(tipHtml,function (result) {
                            if(result){
                                layer.close(indexConfirm);
                                var Obj = {};
                                Obj.prodPSku = parentSku;
                                console.log(parentSku)
                                dataOrgList = null;
                                openAddMsg(Obj,true,'1','1');
                            }
                        });
                    }else{
                        var Obj = {};
                        Obj.prodPSku = parentSku;
                        console.log(parentSku)

                        dataOrgList = null;
                        openAddMsg(Obj,true,'1','1');
                    }
                } else {
                    layer.msg(returnData.msg, {icon: 0});
                }
            },
            error: function () {
                layer.msg("服务器正忙", {icon: 5});
            }
        });
    };
});
