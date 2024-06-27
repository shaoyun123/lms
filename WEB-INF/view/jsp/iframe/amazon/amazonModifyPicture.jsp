<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2022/7/4
  Time: 14:09
  To change this template use File | Settings | File Templates.
--%>
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
        flex-wrap: wrap;
        width: 450px;
    }
    .img_item{
        margin: 5px;
    }

    .img_item img{
        width: 60px;
        height: 60px;
        border:1px solid #ccc
    }

    .imgBox_prodTpl {
        width: 80px;
    }

    .textbtn{
        color:#1E9FFF;
        cursor: pointer;
    }

    li.window_map_imgLi{
        float: left;
    }
    img.window_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    img.templet_map_imgCss {
        width:auto;
        height:auto;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 33px;
        right: 0;
        position: absolute;
    }
    div.window_map_imgDiv{
        width:120px;
        height:80px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        position:relative;
        border: 1px solid #ccc;
    }
    @-webkit-keyframes shineRed {
        from { -webkit-box-shadow: 0 0 5px #bbb; }
        50% { -webkit-box-shadow: 5px 10px 10px #B22222; }
        to { -webkit-box-shadow: 0 0 5px #bbb; }
    }
    .shine_red{
        -webkit-animation-name: shineRed;
        -webkit-animation-duration: 2s;
        -webkit-animation-iteration-count: infinite;
    }
    /*.ui-sortable li {
        list-style: none;
        display: inline-block;
    }*/
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="amazon_modifypicture_form" id="amazon_modifypicture_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-form-label" style="padding:0">
                                    <select name="skuType">
                                        <option value="prodPSku">商品父SKU</option>
                                        <option value="prodSSku">商品子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" class="layui-input" name="skuValue" lay-verify="required">
                                    <select name="searchType">
                                        <option value="exact">精确</option>
                                        <option value="like">模糊</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="amazon_modifypicture_org" lay-filter="amazon_modifypicture_org" class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="amazon_modifypicture_users" lay-filter="amazon_modifypicture_users" class="users_hp_custom" data-rolelist="amazon专员">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="amazon_modifypicture_store" name="storeAcctId" class="store_hp_custom" data-platcode="amazon">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <button class="layui-btn ml20 layui-btn-sm" type="button"  lay-filter="amazon_modifypicture_Search" lay-submit>搜索</button>
                                <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                    <form class="layui-form" lay-filter="ebay_replace_windowMap_url_form" id="ebay_replace_windowMap_url_form">
                        <div class="layui-inline">
                            <label class="layui-form-label">图片URL<span style="color: red;">*</span></label>
                            <div class="layui-input-inline" style="width: 400px;">
                                <input type="text" name="url" autocomplete="off" class="layui-input" lay-verify="required">
                            </div>
                            <button class="layui-btn ml20 layui-btn-sm" type="button" lay-filter="amazon_modifypicture_batchadd" lay-submit>添加图片</button>
                            <button type="reset" class="layui-btn layui-btn-sm" lay-filter="amazon_modifypicture_batchreset" id="amazon_modifypicture_batchreset">还原</button>
                            <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空</button>
                            <span style="color:red">(每个子SKU的图片不能超过8张,修改后图片数量不得少于原有图片数量)</span>
                        </div>
                    </form>
                </div>
            </div>
            <div class="amazonMP_uploadPic"></div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="ebay_replace_windowMap_tab_filter">
                        <ul class="layui-tab-title dis_flex">
                            <li class="layui-this" >数量(<span id="amazon_modifypicture_num"></span>)</li>
                            <button type="button" class="layui-btn layui-btn-sm" id="batchmodifypicture">批量修改</button>
                        </ul>
                        <div class="layui-tab-content" >
                            <table class="layui-table" id="amazon_modifypicturetable" lay-filter="amazon_modifypicturetable"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="windowMap_modify_tpl">
    <div class="layui-clear pl20 imgContains dis_flex">
            <ul class="uploadImgUL ui-sortable dis_flex_start mapbox" style="width: 100%;">
                {{# if(d.mainImage){}}
                <li draggable="true" class="imgBox_prodTpl ui-sortable-handle" data-src="{{d.mainImage}}">
                    <div class="ImgDivOut">
                        <div class="ImgDivIn img_item">
                            <img src="{{d.mainImage}}" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>
                        </div>
                        <div class="imgDivDown h20">
                            <div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div>
                        </div>
                    </div>
                </li>
                {{# }}}
                {{# if(d.image){}}
                {{# d.image.split("|").forEach(function(item){ }}
                <li draggable="true" class="imgBox_prodTpl ui-sortable-handle" data-src="{{item}}">
                    <div class="ImgDivOut">
                        <div class="ImgDivIn img_item">
                            <img src="{{item}}" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>
                        </div>
                        <div class="imgDivDown h20">
                            <div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div>
                        </div>
                    </div>
                </li>
                {{# })}}
                {{# }}}
            </ul>
        <div style="width: 100px;">
            <button type="button" class="layui-btn layui-btn-sm ml5 mt05 addLocalPicture">本地图片</button>
            <button type="button" class="layui-btn layui-btn-sm mt05" onclick="addPicture($(this))">网络图片</button>

            <button type="button" class="layui-btn layui-btn-sm mt05" onclick="showamazon_templet_picture('{{d.prodPId}}','{{d.itemId}}',$(this))">模板图片</button>
        <%--<button type="button" class="layui-btn layui-btn-sm mt05" onclick="addModePicture($(this),{{d.prodPId}})">模板图片</button>--%>
        </div>
    </div>
</script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script>
    var optionList=[]//记录操作的图片url
    var showamazon_templet_picture;//公共函数
    layui.use(['admin','form','table','layer',"upload"],function(){
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            upload = layui.upload;
        var tableIns = {};
        render_hp_orgs_users("#amazon_modifypicture_form");
        form.render('select');
        var tableIns = {}

        var data = new Object();
        if(stopAmazonArr.length > 0){
            data.idList=[];
            data.pidList = [];
            for (var i = 0; i < stopAmazonArr.length; i++) {
                if(stopAmazonArr[i].id != null && stopAmazonArr[i].id!=''){
                    data.idList.push(stopAmazonArr[i].id);
                }else{
                    data.pidList.push(stopAmazonArr[i].pId)
                }
            }
        }

        if(stopAmazonArr.length > 0){
            amazon_modifytablerender(data);
        }

        //渲染部门销售员店铺三级联动
        form.on('submit(amazon_modifypicture_Search)',function(obj){
            var data = obj.field;
            amazon_modifytablerender(data);
            return false;
        })

        function amazon_modifytablerender(data){
            tableIns = table.render({
                elem: "#amazon_modifypicturetable",
                method: "post",
                contentType:"application/json",
                url: ctx + "/onlineProductAmazon/batchUpdateItemImageQuery",
                where: data,
                height: 500,
                cols: [
                    [
                        {checkbox: true},
                        {title:'店铺',field:'storeAcct'},
                        {title:'站点',field:'siteId'},
                        {title:'商品子SKU',field:'prodSSku'},
                        {title:'店铺子SKU',field:'storeSSku'},
                        {title:'ASIN',field:'asin'},
                        {title:'橱窗图(默认第一张是头图)',field:"amazon_windowmap",width:"45%",templet:'#windowMap_modify_tpl'},
                        {title:'操作结果',field:'amazon_modifymap_option'}
                    ],
                ],
                id: 'amazon_modifypicturetable',
                page: true,
                limits: [100, 500, 1000],
                created: function(res) {
                    res.data = (res.data||[]).map(function(item){
                        if(item.amazonImages){
                            item.imgArr = (item.amazonImages||"").split(',')
                        }
                        return item
                    })
                },
                done: function(res) {
                    $('#amazon_modifypicture_num').text(res.count);
                    // $('.mapbox').each(function(index,item){
                    //     $(item).sortable({
                    //         revert: true,
                    //         containment: "parent",
                    //         cursor: "move",
                    //     });
                    //     $(item).find('li').disableSelection()
                    // })
                },
                limit: 100
            });
        }
        // 提交查询
        form.on('submit(amazon_modifypicture_batchadd)',function(obj){
            var timestamp=new Date().getTime();//当前时间作为操作的唯一匹配
            optionList.push(timestamp.toString());
            var urlArr = obj.field.url.split(',')
            applytoChecked('amazon_modifypicturetable',tableIns,function(tr,data,index){
                for(var i in urlArr){
                    // var item = '<li data-index="'+timestamp+'" class="img_item" data-src="'+urlArr[i]+'"><img src="'+urlArr[i]+'" alt=""><div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div></li>'
                    var item = amazonMP_imgStr.replaceAll(":src",urlArr[i]).replace(":curIndex",timestamp)
                    var images = getImgArr(tr)
                    if(images.length<8){
                        $(tr).find('.mapbox').append(item);
                    }else{
                        layer.msg(data.storeAcct+'商品橱窗图已满8张，请删除后再新增')
                    }
                }
            })
            return false
        })
        // 还原
        $('#amazon_modifypicture_batchreset').click(function(){
            if(optionList.length>0){
                $('td[data-field="amazon_windowmap"]').find('.mapbox').find('li').each(function(index,item){
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
        // 批量操作
        $('#batchmodifypicture').click(function(){
            var submitdata = [],flag = '';
            applytoChecked('amazon_modifypicturetable',tableIns,function(tr,data,index){
                getImgArr(tr).length == 0?data.mainImage = "":data.mainImage = getImgArr(tr)[0]
                let imageLen = data.image.split("|").length;
                data.image = getImgArr(tr).slice(1).join('|');

                if(imageLen > 8){
                    flag = "每个子SKU的图片不能超过8张"
                }
                if(imageLen > getImgArr(tr).length -1){
                    flag = "修改后图片数量不得少于原有图片数量"
                }
                submitdata.push(data)
            })

            if(flag != ''){
                return layer.alert(flag,{icon:2})
            }
            let ids = submitdata.map(item=>item.id)
            if(ids.length == 0){
                return false;
            }
            initAjax('/amazonBatchOperationController/batchUpdateImage','post',JSON.stringify(submitdata),function(returnData){
            },'','',function(){
                layer.msg('批量修改正在处理中，请等待...')
                var timer = setInterval(function(){
                    getOptionResult(ids,timer,ids.length)
                }, 2000);
            })
        })

        //获取操作结果
        function getOptionResult(idArr,timer,length){
            commonReturnPromiseRes({
                isLoading: false,
                type: 'POST',
                contentType: 'application/json;charset=UTF-8',
                url: `${ctx}/amazonBatchOperationController/getAllProcessResult?operType=BATCH_MODIFY_IMAGE`,
                params:JSON.stringify(idArr)
            }).then(returnData => {
                if(returnData.code == "0000"){
                    clearInterval(timer);
                    applytoChecked('amazon_modifypicturetable',tableIns,function(tr,data,index){
                        if(JSON.stringify(returnData.data) != "{}" && returnData.data[data.id].indexOf("成功") != -1){
                            $(tr).find('td[data-field="amazon_modifymap_option"]').find('div').text('修改成功').css('color','blue')
                        }else{
                            $(tr).find('td[data-field="amazon_modifymap_option"]').find('div').text('修改失败').css('color','red')
                        }
                    })
                }
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

        function initAjax(url, method, data, func, contentType, isLoad, func1,func2, func3) { //初始化ajax请求
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
                        // layer.msg("服务器错误");
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
        let _this = ''
        $(document).off("click",".addLocalPicture").on("click",".addLocalPicture",function(){
            $(".amazonMP_uploadPic").click()
            _this = $(this)
        })

        upload.render({
            elem: '.amazonMP_uploadPic'
            ,url: ctx + "/publish/uploadPic.html" //此处配置你自己的上传接口即可
            ,multiple: false
            ,done: function(res){
                //上传完毕
                if(res.code == "0000"){
                    if(_this.parent().siblings('.mapbox').find("li").length<8){
                        var timestamp=new Date().getTime();//当前时间作为操作的唯一匹配
                        optionList.push(timestamp.toString());
                        let lis = amazonMP_imgStr.replaceAll(":src",res.msg).replace(":curIndex",timestamp)
                        // let lis = '<li data-index="'+timestamp+'" class="img_item" data-src="'+res.msg+'"><img src="'+res.msg+'" alt=""><div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div></li>'
                        _this.parent().siblings('.mapbox').append(lis)
                    }else{
                        layer.msg('商品橱窗图已满8张，请删除后再新增')
                    }
                }else{
                    layer.alert(res.msg,{icon:2})
                }
            }
        });

        /**
         * 打开模板图片
         */
        showamazon_templet_picture = function (prodPId,itemId,dom){
            var ulId = `window_map_imgDiv_ul_${itemId}`;
            var $ul = $('#'+ulId); //图片容器ul
            var trImgs = $ul.find('img'); //当前行所有的图片
            var trImgArr = Array.prototype.slice.call(trImgs); //转化成数组
            var index = layer.open({
                type: 1,
                title: '选择模板图片添加-橱窗图不能超过9张',
                area: ['1200px', '500px'],
                id: 'templetImgSuccess',
                content: '<form id="shopee_picture_form" class="layui-form"><div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">主图:</label>' +
                '                <ul class="" id="main_picture">' +
                '               </ul></div><br>'+
                '              <div style="width:1200px;height:80px;float:left;dispaly:block;"><label class="layui-form-label">辅图:</label>' +
                '                    <ul class="" id = "ass_picture">' +
                '              </ul></div></form>' +
                '',
                btn: ['确定', '关闭'],
                success: function (layero) {
                    $.ajax({
                            beforeSend: function(){
                                loading.show();
                            },
                            type: 'GET',
                            url: `${ctx}/onlineProductAmazon/ListProductImageByProdSSku?prodPId=` + prodPId,
                            success: function (returnData) {
                                loading.hide(returnData.data);
                                if (returnData.code == "0000") {
                                    // console.log(returnData)
                                    var mainObj = $("#main_picture");
                                    var assObj = $("#ass_picture");
                                    var mainHtml = '';
                                    var assHtml = '';
                                    if(returnData.data!=null && returnData.data.length != 0){
                                        var imgarr = returnData.data
                                        returnData.data.mainImages.forEach(item =>{
                                            mainHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                '                        <div class="window_map_imgDiv">' +
                                                '                            <input type="checkbox" name="check_picture" value="'+item.name+'"/><img src="'+item.name+'" onclick="checked_picture(this)" class="templet_map_imgCss img_show_hide lazy">' +
                                                '                        </div>' +
                                                '                    </li>';
                                        })
                                        returnData.data.assistImgs.forEach(item =>{
                                            assHtml +='<li style="padding: 5px 0;" class="window_map_imgLi">' +
                                                '                        <div class="window_map_imgDiv">' +
                                                '                            <input value="'+item.name+'" name="check_picture" type="checkbox"/><img src="'+item.name+'" onclick="checked_picture(this)"  class="templet_map_imgCss img_show_hide lazy">' +
                                                '                        </div>' +
                                                '                    </li>';
                                        })

                                        mainObj.append(mainHtml);
                                        assObj.append(assHtml);
                                        var layerImgs = layero.find('img');
                                        var layerImgArr = Array.prototype.slice.call(layerImgs); //转化成数组
                                        var allImgArr = trImgArr.concat(layerImgArr);
                                    }
                                    form.render('checkbox');
                                    //获取到当前页的所有图片,以及该点击行所在的所有图片
                                } else {
                                    layer.close(index);
                                    layer.msg(returnData.msg);
                                }
                            },
                            error: function () {
                                loading.hide();
                                layer.msg("服务器正忙");
                            }
                        }
                    )
                    form.render('checkbox');
                },
                yes: function (index, layero) {
                    var ulObj=$('#window_map_imgDiv_ul_'+itemId);
                    var oripictLen = ulObj.find("li").length;
                    var timestamp=new Date().getTime(),lis = '',nameArr = [];//当前时间作为操作的唯一匹配
                    optionList.push(timestamp.toString());
                    $("#shopee_picture_form input[type=checkbox]:checked").each(function() {
                        var name = $(this).val();
                        if(name){
                            nameArr.push(name)
                            let str = amazonMP_imgStr.replaceAll(":src",name).replace(":curIndex",timestamp)
                            lis += str
                        }
                    });
                    if(dom.parent().siblings('.mapbox').find("li").length + nameArr.length <= 8){
                        dom.parent().siblings('.mapbox').append(lis)
                    }else{
                        layer.msg('商品橱窗图已满8张，请删除后再新增')
                    }
                    layer.close(index);
                },
                end:function(){
                    layer.close(index);
                },
            });
        }
    });
    let amazonMP_imgStr = `<li draggable="true" class="imgBox_prodTpl ui-sortable-handle" data-index=":curIndex"  data-src=":src">
                    <div class="ImgDivOut">
                        <div class="ImgDivIn img_item">
                            <img src=":src" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>
                        </div>
                        <div class="imgDivDown h20">
                            <div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div>
                        </div>
                    </div>
                </li>`;

    // 网络图片
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
                        let str = amazonMP_imgStr.replaceAll(":src",urlArr[i]).replace(":curIndex",timestamp)
                        lis += str
                        // lis += '<li data-index="'+timestamp+'" class="img_item" data-src="'+urlArr[i]+'"><img src="'+urlArr[i]+'" alt=""><div class="textbtn" onclick="removeAmazonpictue($(this))">移除</div></li>'
                    }
                    if(dom.parent().siblings('.mapbox').find("li").length + urlArr.length <= 8){
                        dom.parent().siblings('.mapbox').append(lis)
                    }else{
                        layer.msg('商品橱窗图已满8张，请删除后再新增')
                    }
                }
                layui.layer.close(index)
            },
            end:function(){
                layui.layer.close(index);
            }
        })
    }

    <%--// 模板图片--%>
    <%--function addModePicture(dom,prodPId){--%>
        <%--commonReturnPromise({--%>
            <%--type: 'GET',--%>
            <%--url: `${ctx}/onlineProductAmazon/ListProductImageByProdSSku?prodPId=` + prodPId,--%>
        <%--}).then(res => {--%>
            <%--var timestamp=new Date().getTime();//当前时间作为操作的唯一匹配--%>
            <%--optionList.push(timestamp.toString());--%>
            <%--var lis=""--%>
            <%--if(res.mainImages){--%>
                <%--res.mainImages.forEach(item =>{--%>
                    <%--let str = amazonMP_imgStr.replaceAll(":src",item.name).replace(":curIndex",timestamp)--%>
                    <%--lis += str;--%>
                <%--})--%>
            <%--}--%>
            <%--if(res.assistImgs){--%>
                <%--res.assistImgs.forEach(item =>{--%>
                    <%--let str = amazonMP_imgStr.replaceAll(":src",item.name).replace(":curIndex",timestamp)--%>
                    <%--lis += str;--%>
                <%--})--%>
            <%--}--%>
            <%--dom.parent().siblings('.mapbox').append(lis)--%>
        <%--})--%>
    <%--}--%>

    function removeAmazonpictue(dom){
        dom.parents('li').remove()
    }

</script>
