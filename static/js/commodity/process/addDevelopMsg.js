var msg_delImg;
var add_develop_msg_personClick;
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        $ = layui.$;
    // uploadImg();
    initDevelopDict();
    function initDevelopDict() {
        $.ajax({
            type:'post',
            url:ctx + "/msgDevelopmentNotice/getDevelopDict.html",
            data:{},
            dataType:"json",
            success:function(returnData){
                if (returnData.code == "0000") {
                    var arr = [];
                    returnData.data.forEach(function (val) {
                        var obj = {};
                        obj.name=val.name;
                        obj.value = val.id;
                        arr.push(obj);
                    })
                    msgType = arr;
                    //渲染下拉框
                    formSelects.data('msg_develop_typetpl', 'local', {
                        arr: arr
                    });
                } else {
                    layer.msg(returnData.msg, {icon: 5});
                }
            }
        })
    }
    var develop_msg_select_person = [];
    var develop_msg_orgXTree;//组织树
    msg_develop_all_data = {};
    //点击获取sku所在平台以及  需要通知人
    add_develop_msg_personClick = function(){
        var dom = document.querySelector('#add_develop_msg_personbtn');
        var classaa = dom.getAttribute('class').split(/\s+/);
        //如果置灰了就不能添加
        for(var i in classaa){
            if(classaa[i] =='layui-btn-disabled'){
                return false;
            }
        }
        var prodSku = $("#development_msg_sku").val();
        var developTypselect = formSelects.value("msg_develop_typetpl");
        var developTypes = [];
        if(developTypselect.length == 0){
            layer.msg("请选择通知类型")
            return false;
        }
        for(var i in developTypselect){
            developTypes.push(developTypselect[i].value)
        }
        var msg_type = developTypes.join(',')
        // msg_develop_all_data = {};
        loading.show();
        $.ajax({
            type:"post",
            url:ctx + "/msgDevelopmentNotice/getSkuPlatCode.html",
            dataType:"json",
            data:{"prodSku":prodSku,dataOrgList:dataOrgList,msg_type:msg_type},
            success:function(returnData){
                loading.hide();
                console.log(returnData)
                if(returnData.code=='0000'){
                    var index = layer.open({
                        type: 1,
                        title: '选择销售平台人员',
                        area: ['45%', '45%'],
                        btn: ['保存', '关闭'],
                        content: $('#develop_msg_org_layer').html(),
                        success: function (layero, index) {
                            develop_msg_orgXTree = new layuiXtree({
                                elem: 'develop_msg_orgXTree', //(必填) 放置xtree的容器id，不要带#号,
                                form: form, //(必填) layui 的 from,
                                isopen: false, //加载完毕后的展开状态
                                ckall: true,   //启用全选功能，默认值：false
                                data: returnData.data.orgList, //(必填) json数组
                                color: { //三种图标颜色，独立配色，更改几个都可以
                                    open: "#EE9A00", //节点图标打开的颜色
                                    close: "#EEC591", //节点图标关闭的颜色
                                    end: "#828282", //末级节点图标的颜色
                                },
                                click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件

                                }
                            });
                            develop_msg_orgXTree.render();
                            if(dataOrgList){
                                var person = dataOrgList.split(',');
                                var flag = true;
                                for(var i in person){
                                    console.log(person[i])
                                    if(flag){
                                        flag = false;
                                        develop_msg_orgXTree.SetOtherCheckedFalse(person[i]);
                                    }
                                    develop_msg_orgXTree.setCheckedByValue(person[i]) // 默认勾选一选择类目
                                    develop_msg_orgXTree.OpenByLeafValue(person[i])
                                    if(person[i].indexOf('joom')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('joom专员')
                                    }
                                    if(person[i].indexOf('ebay')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('ebay专员')
                                    }
                                    if(person[i].indexOf('shopee')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('shopee专员')
                                    }
                                    if(person[i].indexOf('wish')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('wish专员')
                                    }
                                    if(person[i].indexOf('amazon')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('amazon专员')
                                    }
                                    if(person[i].indexOf('lazada')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('lazada专员')
                                    }
                                    if(person[i].indexOf('fyndiq')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('fyndiq专员')
                                    }
                                    if(person[i].indexOf('smt')>-1 || person[i].indexOf('aliexpress')>-1){
                                        develop_msg_orgXTree.setCheckedByValue('smt专员')
                                    }
                                }
                            }
                            $("#un_listing_text").text(returnData.data.unlisting_platCode);
                        },
                        yes: function (index1, layero) {
                            var choosePerson =[];
                            var obj = new Object();
                            obj.allNeedProcessPerson = [];
                            obj.todoPerson = [];
                            develop_msg_select_person = develop_msg_orgXTree.GetAllChecked();
                            console.log(develop_msg_select_person)
                            if (develop_msg_select_person == null || develop_msg_select_person.length == 0) {//没有选择销售人员
                                layer.msg("请至少选择一个销售人员", {icon: 0});
                                return false;
                            } else {
                                for (var i in develop_msg_select_person) {
                                    var title =develop_msg_select_person[i].title;
                                    var value =develop_msg_select_person[i].value||develop_msg_select_person[i];
                                    if (value.indexOf("user") != -1) {//用户节点
                                        if(choosePerson.indexOf(title) == -1){
                                            choosePerson.push(title);
                                        }
                                        obj.todoPerson.push(value);
                                        var userId = value.split("_")[1];
                                        if(obj.allNeedProcessPerson.indexOf(userId)== -1){
                                            obj.allNeedProcessPerson.push(userId);
                                        }
                                    }
                                };
                                console.log("todoPerson:"+obj.todoPerson.join(','))
                                console.log("allNeedProcessPerson:"+obj.allNeedProcessPerson.join(','))

                                $("#develop_person").val(choosePerson.join(","));
                                obj.allNeedProcessPerson =obj.allNeedProcessPerson.join(',');
                                obj.todoPerson = obj.todoPerson.join(',');
                                obj.prodPSku = returnData.data.prodPSku;
                                obj.sSkuList = returnData.data.sSkuList.join(',');
                                obj.develop_person = choosePerson.join(",");
                                msg_develop_all_data = obj;
                            }
                            layer.close(index);
                        }
                    });
                }else{
                    layer.msg(returnData.msg)
                }
                loading.hide();
            }
        })

    }

});
$('#delete_msg_pasteImg').click(function () {
    $("#developNotice_addForm input[name='image']").val("");
    $('#add_msg_image').html('')
})
function msg_delImg(obj) {
    $(obj).closest('li').remove()
}

function uploadInit(){
    $("#msg_add_img").Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: false,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: ' 上传图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/uploadPic.html",
        onSelect: function (files) {
            var $ul = $('#msg_develop_imgDiv_ul');
            var $lis = $ul.find('li');
            if($lis.length >=4){
                layer.msg('图片最多为3张!');
                console.log('选择完成')
                return false;
            }
            return true;
        },
        onUploadSuccess: function (file, data, response) {
            var url = data.msg;
            console.log(url)
            if(data.code === '9999'){
                layer.msg(data.msg);
                return;
            }
            var $ul = $('#msg_develop_imgDiv_ul');
            var str = '<li style="padding: 5px 0;" class="window_map_imgLi">'+
                '<div class="window_map_imgDiv">'+
                '<img src="'+url+'" class="window_map_imgCss">'+
                '</div>'+
                '<div class="imgDivDown h20 "><a onclick="msg_delImg(this);" href="javascript:void(0);">移除</a></div>'+
                '</li>';
            $ul.append(str);
        }
    });
}
$(document).ready(function(){
        uploadInit();
    }
)