<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>修改图片</title>
<style>
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }
    .dis_flex_start{
        display: flex;
        justify-content: flex-start;
    }
    .img_item{
        margin: 5px;
    }

    .img_item img{
        width: 60px;
        height: 60px;
        border:1px solid #ccc
    }

    .textbtn{
        color:#1E9FFF;
        cursor: pointer;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="lazada_modifypicture_form" id="lazada_modifypicture_form">
                    <div class="layui-form-item">
                        <div class="layui-col-lg3 layui-col-md3">
                            <div class="layui-form-label" style="padding:0">
                                <select name="skuType">
                                    <option value="0">商品子sku</option>
                                    <option value="1">商品父sku</option>
                                </select>
                            </div>
                            <div class="layui-input-block dis_flex">
                                <input type="text" class="layui-input" name="skuList" lay-verify="required">
                                <select name="searchType">
                                    <option value="0">模糊</option>
                                    <option value="1">精确</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-block">
                                <select id="lazada_modifypicture_org" lay-filter="lazada_modifypicture_org" class="orgs_hp_custom">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg3 layui-col-md3">
                            <label class="layui-form-label">销售员</label>
                            <div class="layui-input-block">
                                <select id="lazada_modifypicture_users" lay-filter="lazada_modifypicture_users" class="users_hp_custom" data-rolelist="lazada专员">
                                    <option value="">全部</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg2 layui-col-md2">
                            <label class="layui-form-label">店铺</label>
                            <div class="layui-input-block">
                                <select id="lazada_modifypicture_store" name="storeAcctIdList" class="store_hp_custom" data-platcode="lazada">
                                    <option value="">全部</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg1 layui-col-md1">
                            <button class="layui-btn ml20 layui-btn-sm" type="button"  lay-filter="lazada_modifypicture_Search" lay-submit>搜索</button>
                        </div>
                    </div>
                    </form>
                    <form class="layui-form" lay-filter="ebay_replace_windowMap_url_form" id="ebay_replace_windowMap_url_form">
                        <div class="layui-inline">
                            <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                            <div class="layui-input-inline" style="width: 400px;">
                                <input type="text" name="url" autocomplete="off" class="layui-input" lay-verify="required">
                            </div>
                            <button class="layui-btn ml20 layui-btn-sm" type="button" lay-filter="lazada_modifypicture_batchadd" lay-submit>添加图片</button>
                            <button type="reset" class="layui-btn layui-btn-sm" lay-filter="lazada_modifypicture_batchreset" id="lazada_modifypicture_batchreset">还原</button>
                            <span style="color:red">(每个lisiting的橱窗图不能超过8张)</span>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="ebay_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title dis_flex">
                            <li class="layui-this" >数量(<span id="lazada_modifypicture_num"></span>)</li>
                            <button type="button" class="layui-btn layui-btn-sm" id="batchmodifypicture">批量修改</button>
                        </ul>
                        <div class="layui-tab-content" >
                            <table class="layui-table" id="lazada_modifypicturetable" lay-filter="lazada_modifypicturetable"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="windowMap_modify_tpl">
    <div class="dis_flex">
        <ul class="dis_flex_start mapbox">
            {{# if(d.imgArr){}}
            {{# for(var i in d.imgArr){ }}
            <li class="img_item" data-src="{{d.imgArr[i]}}">
                <img src="{{d.imgArr[i]}}" alt="">
                <div class="textbtn" onclick="removeLazadapictue($(this))">移除</div>
            </li>
            {{# }}}
            {{# }}}
        </ul>
        <button type="button" class="layui-btn layui-btn-xs" onclick="addPicture($(this))">添加图片</button>
    </div>
</script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script>
var optionList=[]//记录操作的图片url
layui.use(['admin','form','table','layer','laydate','formSelects'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects=layui.formSelects, 
        laydate = layui.laydate;
        var tableIns = {};
        render_hp_orgs_users("#lazada_modifypicture_form");
        form.render('select');
    var idList = localStorage.getItem('itemIds');
    var tableIns = {}
    if (idList) {
        lazada_modifytablerender({ 'idList': idList });
    }
    //渲染部门销售员店铺三级联动
    form.on('submit(lazada_modifypicture_Search)',function(obj){
        var data = obj.field;
        var storeAcct = data.storeAcctIdList;
        var list = [];
        if(storeAcct!=null && storeAcct!='') {
            data.storeAcctIdList = storeAcct;
        }else{
            $("#lazada_modifypicture_store").children().each(function () {
                if ($(this).val() != "") {
                    list.push($(this).val()) ;
                }
                data.storeAcctIdList = list.join(",");
            });
        }
        data.skuType == "0" ? data.sSkuList = data.skuList : data.pSkuList = data.skuList;
        lazada_modifytablerender(data);
        return false;
    })

    function lazada_modifytablerender(data){
        tableIns = table.render({
            elem: "#lazada_modifypicturetable",
            method: "post",
            url: ctx + "/lazadaBatchOperation/prodModifyStock.html",
            where: data,
            height: 500,
            cols: [
                [
            {checkbox: true},
            {title:'店铺',field:'storeAcctName'},
            {title:'itemID',field:'itemId'},
            {title:'店铺子sku',field:'storeSubSku'},
            {title:'橱窗图',field:"lazada_windowmap",width:"55%",templet:'#windowMap_modify_tpl'},
            {title:'操作结果',field:'lazada_modifymap_option'}
                ],
            ],
            id: 'lazada_modifypicturetable',
            page: true,
            limits: [100, 500, 1000],
            created: function(res) {
                res.data = (res.data||[]).map(function(item){
                    if(item.lazadaImages){
                        item.imgArr = (item.lazadaImages||"").split(',')
                    }                   
                    return item
                })
            },
            done: function(res) {
                $('#lazada_modifypicture_num').text(res.count);
                $('.mapbox').each(function(index,item){
                    $(item).sortable({
                        revert: true,
                        containment: "parent",
                        cursor: "move",
                    });
                    $(item).find('li').disableSelection()                   
                })
            },
            limit: 100
        });
    }

    form.on('submit(lazada_modifypicture_batchadd)',function(obj){
        var timestamp=new Date().getTime();//当前时间作为操作的唯一匹配
        optionList.push(timestamp.toString());
        var urlArr = obj.field.url.split(',')
        applytoChecked('lazada_modifypicturetable',tableIns,function(tr,data,index){
            for(var i in urlArr){
            var item = '<li data-index="'+timestamp+'" class="img_item" data-src="'+urlArr[i]+'"><img src="'+urlArr[i]+'" alt=""><div class="textbtn" onclick="removeLazadapictue($(this))">移除</div></li>'
            var images = getImgArr(tr)
            if(images.length<8){
                $(tr).find('.mapbox').append(item);
            }else{
                layer.msg(data.itemId+'商品橱窗图已满8张，请删除后再新增')
            }
            }
        })
        return false
    })

    $('#lazada_modifypicture_batchreset').click(function(){
        if(optionList.length>0){
        $('td[data-field="lazada_windowmap"]').find('.mapbox').find('li').each(function(index,item){
            var dataindex = $(item).attr('data-index');
            var last = optionList[optionList.length-1]
            if(dataindex === last){
                $(item).remove()
            }
        })
        optionList.pop();
    }else{
        layer.msg('无可还原的操作')
    }
    })
    $('#batchmodifypicture').click(function(){
        var submitdata = [];
        optionList=[];
        applytoChecked('lazada_modifypicturetable',tableIns,function(tr,data,index){
            var images = getImgArr(tr).join(',')
            submitdata.push({id:data.id,itemId:data.itemId,images:images,storeAcctId:data.storeAcctId,storeSubSku:data.storeSubSku,storeSubId:data.storeSubId})
        })
        var idsArr = submitdata.map(function(item){
            return item.id
        })
        var ids = idsArr.join(',')
        initAjax('/lazadaBatchOperation/addImagesForLazada.html','post',JSON.stringify(submitdata),function(returnData){
            layer.msg('批量修改正在处理中，请等待...')
        var timer = setInterval(function(){
                getOptionResult(ids,timer,idsArr.length)
        }, 2000);
        })
    })

    //获取操作结果
    function getOptionResult(ids,timer,length){
        initAjax('/lazadaBatchOperation/queryUpdateImageResultByLazada.html','post',{ids:ids},function(returnData){
            if(returnData.data.length === length){
                 clearInterval(timer);
                applytoChecked('lazada_modifypicturetable',tableIns,function(tr,data,index){
                if(returnData.data.resultCode==="0000"){
                $(tr).find('td[data-field="lazada_modifymap_option"]').find('div').text(returnData.data[index].resultMsg?returnData.data[index].resultMsg:'修改成功').css('color','blue')
                }else{
                $(tr).find('td[data-field="lazada_modifymap_option"]').find('div').text(returnData.data[index].resultMsg?returnData.data[index].resultMsg:'修改失败').css('color','red')
                }                    
                })
            }
        },'application/x-www-form-urlencoded',true,function(){
            clearInterval(timer)
        })

    }

    function getImgArr(tr){
        var lis = $(tr).find('.mapbox li')
        var images=[]
        lis.each(function(index,item){
            images.push($(item).attr('data-src'))
        })
        return images
    }

    function initAjax(url, method, data, func, contentType, isLoad, fun1,func2, func3) { //初始化ajax请求
                        if (!isLoad) {
                            loading.show()
                        }
                        $.ajax({
                            type: method,
                            url: ctx + url,
                            dataType: 'json',
                            async: true,
                            data: data,
                            contentType: contentType || 'application/json',
                            beforeSend: function(returnData) {
                                if (func2) {
                                    func2(returnData)
                                }
                            },
                            success: function(returnData) {
                                loading.hide()
                                if (returnData.code == "0000") {
                                    func(returnData)
                                } else {
                                    layer.msg(returnData.msg, {
                                        icon: 2
                                    });
                                }
                            },
                            error: function(returnData) {
                                layui.admin.load.hide();
                                if(func1){
                                    func1(returnData)
                                }
                                if (XMLHttpRequest.status == 200) {
                                    layer.msg("请重新登录", {
                                        icon: 7
                                    });
                                } else {
                                    layer.msg("服务器错误");
                                }
                            },
                            complete: function(returnData) {
                                loading.hide()
                                if (func3) {
                                    func3(returnData)
                                }
                            }
                        })
                    }
});

function addPicture(dom){
    var index = layui.layer.open({
             type: 1,
             title: '添加lisiting图片-橱窗图不能超过8张',
             area: ['800px', '300px'],
             id: 'mainNetImgSuccess',
             content: '<div class="p20 pl20"><textarea class="layui-textarea" id="" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
             btn: ['确定', '关闭'],
             success: function (layero) {
                 layui.form.render();
             },
             yes: function (index, layero) {
                var timestamp=new Date().getTime();//当前时间作为操作的唯一匹配
                optionList.push(timestamp.toString());
                 var urls = $(layero).find('textarea').val()
                 if(urls&&urls!==""){
                     var lis=""
                     var urlArr = urls.split('\n')
                    for(var i in urlArr){
                        lis += '<li data-index="'+timestamp+'" class="img_item" data-src="'+urlArr[i]+'"><img src="'+urlArr[i]+'" alt=""><div class="textbtn" onclick="removeLazadapictue($(this))">移除</div></li>'
                     }
                     dom.siblings('.mapbox').append(lis)
                 }
                 layui.layer.close(index)
             },
             end:function(){
                 layui.layer.close(index);
             }
    })
}

function removeLazadapictue(dom){
    dom.parents('li').remove()
}

</script>
