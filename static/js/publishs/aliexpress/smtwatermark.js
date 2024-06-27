// #region
layui.use(['admin','table','form','layer','formSelects','laytpl', 'upload'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        upload = layui.upload,
        form = layui.form;
    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#smtWatermarkForm");
    //字体和字体大小数组集合
    var fontFamilyArr = [{value: '微软雅黑', name: '微软雅黑'}, {value: '宋体', name: '宋体'},{value: 'Arial Black', name: 'Arial Black'},{value: 'Gabriola', name: 'Gabriola'},{value:'Impact', name: 'Impact'},{value:'MV Boli', name:'MV Boli'},{value:'Segoe Script', name:'Segoe Script'},{value:'楷体', name:'楷体'},{name:'华文琥珀', value:'华文琥珀'}];
    var fontSizeArr =  [{value: 12, name: 12}, {value: 14, name: 14},{value: 18, name: 18},{value: 24, name: 24},{value: 30, name: 30},{value: 36, name: 36},{value: 48, name: 48},{value: 60, name: 60}];

    //多选店铺集合
    var watermark_storeListArr;
    //水印的命名空间
    var watermarkName = {
        trigClick: function(){
           $('[lay-filter=smt_watermark_submit]').click();
        },
        getStore: function(){ //获取店铺,多选
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/watermark/listAcctByUserAndPlat.html',
                data: {platCode : 'aliexpress'},
                success: function(res){
                    if(res.code == '0000'){
                        var data = res.data;
                        var arr = [];
                        for(var i=0; i<data.length; i++){
                            var item = data[i];
                            var obj = {
                              'name': item.storeAcct,
                              'value': item.id
                            };
                            arr.push(obj);
                        };
                        watermark_storeListArr = arr;
                    }
                }
            })
        },
        newAdd: function(){ //新增水印
            var _this = this;
           $('#smt_watermark_newAdd').on('click', function(){
               var watermarkData='';
               var index= layer.open({
                    type: 1,
                    title: '新增水印',
                    area: ['100%', '100%'],
                    btn: ['保存', '关闭'],
                    id: 'watermark_newAddLayerId',
                    content: $('#smt_watermark_newAddLayer').html(),
                    success: function(layero, index){
                        form.render('select');
                        form.render('radio');
                        _this.toggleType();
                        _this.watermark();
                        _this.watchSizeChange();
                        var str = '<option value=""></option>';
                        for(var i=0; i<watermark_storeListArr.length; i++){
                            var item = watermark_storeListArr[i];
                            str+=`<option value="${item.value}">${item.name}</option>`;
                        };
                        $('[name=salesPlatAcctIds]').append(str);
                        formSelects.render();
                        form.on('submit(smt_watermarkAdd_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            data.platCode = "aliexpress";
                            watermarkData = data;
                            return false;
                        });
                    },
                    yes: function(index, layero){
                      /**
                       * 获取到文字水印的坐标/透明度/尺寸(文字水印的字体大小)
                       */
                        var $watermarkFontDiv = $('#smt_watermarkFontDiv');
                            $('[lay-filter=smt_watermarkAdd_submit]').trigger('click');
                            if(watermarkData.watermarkType ==1){ //表示文字水印
                                //获取坐标
                                var coordinateX, coordinateY;
                                var coorX = $watermarkFontDiv[0].style.left.split('p')[0];
                                var coorY = $watermarkFontDiv[0].style.top.split('p')[0];
                                if(coorX.charAt(coorX.length-1) > 5){
                                    coordinateX = Math.ceil(coorX/10);
                                }else{
                                    coordinateX = Math.floor(coorX/10);
                                };
                                if(coorY.charAt(coorY.length-1) > 5){
                                    coordinateY = Math.ceil(coorY/10);
                                }else{
                                    coordinateY = Math.floor(coorY/10);
                                };
                                console.log(coordinateX, coordinateY);
                                watermarkData.watermarkCoordinate = `{"width": ${coordinateX}, "height": ${coordinateY}}`;
                                //获取透明度和尺寸
                                watermarkData.watermarkTransparency = (100 -$('#smt_watermarkTypeFont_opacityAmount').text().split('%')[0]);
                                watermarkData.watermarkSize = watermarkData.watermarkFontSize;
                                watermarkData.watermarkFontContent = $('#smt_watermarkFontDiv').find('span').html();
                                //图片相关的都设为空
                                watermarkData.watermarkUrl = '';
                            }else if(watermarkData.watermarkType ==0){ //表示图片水印
                                //透明度
                                watermarkData.watermarkTransparency = (100 -$('#smt_watermarkTypeImg_opacityAmount').text().split('%')[0]);
                                //文字相关的都设为空
                                watermarkData.watermarkFontBackgroundColor='';
                                watermarkData.watermarkFontColor='';
                                watermarkData.watermarkFontContent= '';
                                watermarkData.watermarkFontSize= '';
                                watermarkData.watermarkFontType= '';
                            }
                            watermarkData.watermarkType = Number(watermarkData.watermarkType);
                            watermarkData.borderSize = $('[lay-filter=smt_watermark_sizeChange]').val();
                            watermarkData.degree = $('[name=degree]').val();
                            $.ajax({
                                type: 'post',
                                url: '/lms/watermark/saveWatermark.html',
                                data: JSON.stringify(watermarkData),
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg);
                                        layer.close(index);
                                        _this.trigClick();
                                    }else{
                                        layer.msg(res.msg);
                                    };
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器出错啦!');
                                }
                            });
                    },
                    end: function(){
                        $(window).off('mouseup');
                    }
               })
           });
        },
        toggleType: function(){ //监听radio的点击事件 然后决定显示什么内容
                //基础节点
                var $watermarkDiv = $('#smt_watermarkImageDiv'),
                    $watermarkFontDiv = $('#smt_watermarkFontDiv');
                form.on('radio(watermarkTypeRadio)', function(data){
                    if(data.value== 1){ //文字水印
                        /**文字水印设置显示,图片水印设置隐藏 */
                        $('#smt_watermarkFontDiv').removeClass('disN');
                        $('.smt_watermarkTypeImg').addClass('disN');
                        $('.smt_watermarkTypeText').removeClass('disN');
                        $('#smt_watermarkImageDiv').addClass('disN');
                        /**
                         * 切换后的图片水印设置初始化:
                         * 1.图片链接清空: src(#watermark_uploadImg/.watermark-div-img)
                         * 2.图片input清空: name="watermarkCoordinate"/name="watermarkSize"/name="watermarkTransparency"/ name="watermarkUrl"
                         * 3.图片透明度和尺寸进度条恢复默认
                         * */
                        $('#smt_watermark_uploadImg').removeAttr('src');
                        $('.smt_watermark-div-img').removeAttr('src');
                        //data值初始化
                        $('[name=watermarkCoordinate]').val('{"width":0, "height":0}');//坐标
                        $('[name=watermarkSize]').val(''); //尺寸
                        $('[name=watermarkTransparency]').val('0');//透明度
                        $('[name=watermarkUrl]').val('');
                        $('[name=degree]').val(0); //旋转角度
                        //滚动条初始化
                        $('#smt_slider-range-min2').slider({'value': 0});
                        $('#smt_watermarkTypeImg_opacityAmount').html('0%');
                        $('#smt_slider-range-min1').slider({'value': 100});
                        $('#smt_watermarkTypeImg_sizeAmount').html('100%');
                        $('#smt_slider-range-min3').slider({'value': 0}); //文字透明度
                        $('#smt_watermarkTypeFont_opacityAmount').html('0%')
                        $('#smt_slider-range-min4').slider({'value': 0});
                        $('#smt_watermarkTypeImg_rotateAmount').html(0);
                        $('#smt_slider-range-min5').slider({'value': 0}); //文字旋转
                        $('#smt_watermarkTypeFont_rotateAmount').html(0);
                        // $('#watermarkTypeImg_opacityAmount').html($sliderRangeMin2.slider('0') + '%'); //透明度
                        // $('#watermarkTypeImg_sizeAmount').html($sliderRangeMin1.slider('100') + '%'); //尺寸
                        $watermarkDiv.css({
                            'display': 'none',
                            'position': 'absolute',
                            'border': '1px dashed gainsboro',
                            'cursor': 'all-scroll',
                            'top': 0,
                            'left': 0,
                            'opacity': 1,
                            'width': '20px',
                            'height': '20px',
                            'transform': 'rotate(0deg)'
                        });
                    }else{
                        /**文字水印设置隐藏,图片水印设置显示 */
                        $('#smt_watermarkFontDiv').addClass('disN');
                        $('.smt_watermarkTypeImg').removeClass('disN');
                        $('.smt_watermarkTypeText').addClass('disN');
                        $('#smt_watermarkImageDiv').removeClass('disN');
                        /**切换后的文字水印设置初始化*/
                        $('#smt_slider-range-min2').slider({'value': 0});
                        $('#smt_watermarkTypeImg_opacityAmount').html('0%');
                        $('#smt_slider-range-min1').slider({'value': 100});
                        $('#smt_watermarkTypeImg_sizeAmount').html('100%');
                        $('#smt_slider-range-min3').slider({'value': 0});
                        $('#smt_watermarkTypeFont_opacityAmount').html('0%')
                        $('#smt_slider-range-min4').slider({'value': 0});
                        $('#smt_watermarkTypeImg_rotateAmount').html(0);
                        $('#smt_slider-range-min5').slider({'value': 0}); //文字旋转
                        $('#smt_watermarkTypeFont_rotateAmount').html(0);
                        //data值初始化
                        $('[name=watermarkCoordinate]').val('{"width":0, "height":0}');//坐标
                        $('[name=watermarkSize]').val('100'); //尺寸
                        $('[name=watermarkTransparency]').val('0');//透明度
                        $('[name=watermarkUrl]').val('');
                        $('[name=degree]').val(0); //旋转角度
                        $('[name=watermarkFontContent]').val('');
                        $('[name=watermarkFontType]').val('微软雅黑');
                        $('[name=watermarkFontSize]').val('14');
                        $('[name=watermarkFontColor]').val('#000000');
                        $('[name=watermarkFontBackgroundColor]').val('#ffffff');
                        $('#smt_watermarkTypeFont_opacityAmount').html('0%');//透明度
                        $watermarkFontDiv.find('span').html('');
                        $watermarkFontDiv.find('span').css({
                            'display': 'block',
                            'padding': '10px',
                            'white-space':'nowrap',
                            'width': '100%',
                            'height': '100%',
                            'fontFamily': '微软雅黑',
                            'color': '#000',
                            'fontSize': '14px'
                        });
                        $watermarkFontDiv.css({
                            'min-width': '20px',
                            'min-height': '20px',
                            'border': '1px dashed #ccc',
                            'cursor': 'all-scroll',
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'backgroundColor': '#fff',
                            'transform': 'rotate(0deg)',
                            'opacity': 1
                        });
                        form.render('select');
                    }
                });
        },
        watermark: function(){ //功能集合函数
            var _this = this;
            //基础节点
            var $watermarkDiv = $('#smt_watermarkImageDiv'),
            $watermarkFontDiv = $('#smt_watermarkFontDiv'),
            $sliderRangeMin1 = $('#smt_slider-range-min1'),  //图片大小
            $sliderRangeMin2 = $('#smt_slider-range-min2'), //透明度
            $sliderRangeMin3 = $('#smt_slider-range-min3'),//文字透明度
            $sliderRangeMin4 = $('#smt_slider-range-min4'),//图片旋转角度
            $sliderRangeMin5 = $('#smt_slider-range-min5'),//文字旋转角度
            Width = $watermarkDiv.width(),
            Height = $watermarkDiv.height();
            //普通图片上传
            var uploadInst = upload.render({
                elem: '#smt_watermark_upload'
                ,url: ctx + "/watermark/uploadPhoto.html?platCode=aliexpress"
                ,done: function(res){
                    if(res.code == '0000'){//上传成功
                        //重置图片和百分比
                        sliderScroll($sliderRangeMin1, 'smt_watermarkTypeImg_sizeAmount', 100, 20, 200);
                        sliderScroll($sliderRangeMin2, 'smt_watermarkTypeImg_opacityAmount', 0, 0, 100);
                        sliderScroll($sliderRangeMin4, 'smt_watermarkTypeImg_rotateAmount', 0, -180, 180);
                        $watermarkDiv.find('img').attr('src', '');
                        var $IMG = new Image();
                        $IMG.src = res.data;
                        $IMG.onload = function() { 
                            Width = $IMG.width;
                            Height = $IMG.height;
                            $watermarkDiv.css({
                                'width': Width + 'px', 
                                'height': Height + 'px', 
                                'display': 'inline-block',
                                'transform': 'rotate(0deg)',
                                'top': 0,
                                'left': 0,
                                'opacity': 1
                            });
                            $watermarkDiv.find('img').attr('src', res.data);
                            $('#smt_watermark_uploadImg').attr('src', res.data); //图片链接（base64）
                            $('[name=watermarkUrl]').val(res.data);
                            $('[name=watermarkSize]').val(100);
                            $('[name=watermarkTransparency]').val(100);
                            $('[name=degree]').val(0);
                        };
                    }else{//如果上传失败
                        layer.msg(res.msg);
                        return false;
                    } 
                }
            });              
            //按钮滚动
            var sliderScroll = function(btn, id, value, min, max){
                btn.slider({
                    range: 'min',
                    value: value, //默认值
                    min: min, //最小值
                    max: max, //最大值
                    slide: function(event, ui) {
                        if(id == 'smt_watermarkTypeImg_rotateAmount'){
                            $('#'+id).html(ui.value);
                        }else{
                            $('#'+id).html(ui.value + '%');
                        }
                        if(id == 'smt_watermarkTypeImg_sizeAmount'){
                            var Widths = Width - ((100 - ui.value) * 0.01 * Width),
                            Heights = Height - ((100 - ui.value) * 0.01 * Height);
                            $watermarkDiv.css({
                                'width' : Widths + 'px',
                                'height' : Heights + 'px'
                            });
                            $('[name=watermarkSize]').val(ui.value);//图片水印大小
                        }else if(id=='smt_watermarkTypeImg_opacityAmount'){
                            var opacity = ui.value/100;
                            $watermarkDiv.css({
                                'opacity': 1-opacity
                            });
                            $('[name=watermarkTransparency]').val(ui.value);//透明度大小
                        }else{
                            $watermarkDiv.css({
                                'transform': `rotate(${ui.value}deg)`
                            });
                            $('[name=degree]').val(ui.value);
                        }
                    }
                });
                if(id== 'smt_watermarkTypeImg_rotateAmount'){
                    $('#'+id).html(btn.slider('value'));
                }else{
                    $('#'+id).html(btn.slider('value') + '%');
                }
            };
            //这个是图片的尺寸调整
            sliderScroll($sliderRangeMin1, 'smt_watermarkTypeImg_sizeAmount', 100, 20, 200);
            //这个是透明度的调整
            sliderScroll($sliderRangeMin2, 'smt_watermarkTypeImg_opacityAmount', 0, 0, 100);
            //这个是图片/文字的旋转角度
            sliderScroll($sliderRangeMin4, 'watermarkTypeImg_rotateAmount', 0,-180, 180);
            //拖拽功能
            var drag = function($watermarkDivs,$albumListBody){
                var watermarkType = $.trim($('[name=watermarkType]').val()); //获取水印类型
                //禁止选择网页中的文字
                document.onselectstart =function(){
                    return false;
                };
                //mouseDown
                mouseDown = function(e) {
                    e = e || window.event;
                    var boxW = $watermarkDivs.width(),
                        boxH = $watermarkDivs.height(),
                        divW = $albumListBody.width(),
                        divH = $albumListBody.height(),
                        offsetLeft = e.offsetX, //e.offsetX是相对于父元素box的距离
                        offsetTop = e.offsetY,
                        Left = '',
                        Top = '';
                    document.onmousemove=function(evt){
                        evt = evt || window.event;
                        Left = evt.clientX - offsetLeft - $albumListBody.offset().left;
                        Top = evt.clientY - offsetTop - $albumListBody.offset().top + $(window).scrollTop();
                        $watermarkDivs.css('left',Left + 'px');
                        $watermarkDivs.css('top',Top + 'px');
                        $watermarkDivs.css('right', 'auto');
                        $watermarkDivs.css('bottom', 'auto');
                        if(Top < 0) $watermarkDivs.css('top', '0px');
                        if(Left < 0) $watermarkDivs.css('left', '0px');
                        if(boxW + Left > divW) $watermarkDivs.css('left',divW - boxW - 2 + 'px');
                        if(boxH + Top > divH) $watermarkDivs.css('top',divH - boxH - 2 + 'px');
                        evt.preventDefault() ? evt.preventDefault() : evt.returnValue = false;
                    };
                };
                $watermarkDivs.on('mousedown', mouseDown);
                document.onmouseup = function() {
                    document.onmousemove = null;
                    $watermarkDivs.off("mousedown");
                };
                return mouseDown;
            };
            //水印图片拖拽
            (function(){
                var mouseDownImg;
                $("#smt_watermarkImageDiv > .smt_watermark-div-fix").off("mousedown").on("mousedown", function() {
                    $(window).off("mousedown");
                    $watermarkDiv.on("mousedown", mouseDownImg);
                });
                $(window).mousemove(function() {
                    $(window).off("mousedown").on('mousedown', function() {
                        $watermarkDiv.on("mousedown", mouseDownImg);
                    });
                });
                $(window).off('mouseup').on('mouseup',function(e) {
                    document.onmousemove = null;
                    var coordinateX, coordinateY;
                    var coorX = $watermarkDiv[0].style.left.split('p')[0];
                    var coorY = $watermarkDiv[0].style.top.split('p')[0];
                    if(coorX.charAt(coorX.length-1) > 5){
                        coordinateX = Math.ceil(coorX/10);
                    }else{
                        coordinateX = Math.floor(coorX/10);
                    };
                    if(coorY.charAt(coorY.length-1) > 5){
                        coordinateY = Math.ceil(coorY/10);
                    }else{
                        coordinateY = Math.floor(coorY/10);
                    };
                    // console.log(coordinateX, coordinateY);
                    $('[name=watermarkCoordinate]').val(JSON.stringify({"width": coordinateX,"height": coordinateY}));
                });
                mouseDownImg = drag($watermarkDiv, $('#smt_albumListBody'));
            })();
            //水印文字拖拽
            (function(){
                var mouseDownFont;
                $("#smt_watermarkFontDiv span").off("mousedown").on("mousedown", function() {
                    $(window).off("mousedown");
                    $watermarkFontDiv.on("mousedown", mouseDownFont);
                });
                mouseDownFont = drag($watermarkFontDiv, $('#smt_albumListBody'));
            })();
            //文字颜色 背景和透明度的处理
            (function(){
                //水印文字输入的文字内容
                $('[name=watermarkFontContent]').bind('input porpertychange', function(){
                    var $val = $(this).val();
                    var handleVal = $val.replace(/\r?\n/g, '<br>');
                    $watermarkFontDiv.find('span').html(handleVal);
                });
                //文字的颜色(监听input的onchange事件)
                $('[name=watermarkFontColor]').on('change', function(){
                    var fontColor = $(this).val();
                    $watermarkFontDiv.find('span').css({
                        'color': fontColor
                    });
                });
                //文字所在元素的背景色(监听input的onchange事件)
                $('[name=watermarkFontBackgroundColor]').on('change', function(){
                    var bgColor = $(this).val();
                    $watermarkFontDiv.css({
                        'backgroundColor': bgColor
                    });
                });
                //监听选择的字体大小
                form.on('select(smt_watermarkFontSizeF)', function(data){
                    var fontSize = data.value;
                    $watermarkFontDiv.find('span').css({
                        'fontSize': fontSize + 'px'
                    });
                });
                //监听字体类型
                form.on('select(smt_watermarkFontTypeF)', function(data){
                    var fontFamily = data.value;
                    $watermarkFontDiv.find('span').css({
                        'fontFamily': fontFamily
                    });
                });
                /*监听文字背景透明度start*/
                $sliderRangeMin3.slider({
                    range: 'min',
                    value: 0, //默认值
                    min: 0, //最小值
                    max: 100, //最大值
                    slide: function(event, ui) {
                        $('#smt_watermarkTypeFont_opacityAmount').html(ui.value + '%');
                        var opacity = ui.value/100;
                        $watermarkFontDiv.css({
                            'opacity': 1-opacity
                        });
                    }
                });
                $('#smt_watermarkTypeFont_opacityAmount').html($sliderRangeMin3.slider('value') + '%');
                /*监听文字背景透明度end*/
                 //这是文字旋转度
                 $sliderRangeMin5.slider({
                    range: 'min',
                    value: 0, //默认值
                    min: -180, //最小值
                    max: 180, //最大值
                    slide: function(event, ui) {
                        $('#smt_watermarkTypeFont_rotateAmount').html(ui.value);
                        $watermarkFontDiv.css({
                            'transform': `rotate(${ui.value}deg)`
                        });
                        $('[name=degree]').val(ui.value);
                    }
                });
            })();
        },
        tableRender: function(data){ //表单渲染
            var _this = this;
            table.render({
                elem: '#smt_watermark_table',
                method: 'post',
                url: '/lms/watermark/searchWatermark.html',
                where:  data,
                // contentType: 'application/json;charset=UTF-8',
                cols: [
                    [ //表头
                        {title: '账号',field: 'storeAcct'}
                        ,{title: '模板名称',field: 'watermarkTemplateName'}
                        ,{title: '水印类型', templet: '#smt_watermark_tableType'}
                        // ,{title: '水印类型', field: 'watermarkType'}
                        ,{title: '水印', templet: '#smt_watermark_tableShow'}
                        // ,{title: '服务代码', templet: '#logisticsMode_tableCode'}
                        ,{title: '操作', align:'center', toolbar: '#smt_watermark_tableIdBar'}
                   ]
                ],
                page: true,
                id: "smt_watermark_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(res){                  
                    //工具条监听事件
                    _this.watchBar();   
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(smt_watermark_tableFilter)',function(obj){
                var data = obj.data;
                // console.log(data);
                if (obj.event == 'edit'){ //编辑回显功能
                    data.fontFamilyArr = fontFamilyArr;
                    data.fontSizeArr =fontSizeArr;
                    data.watermark_storeListArr = watermark_storeListArr;
                    /**处理坐标和透明度还有高度,然后挂载到data对象上 */
                    var left = JSON.parse(data.watermarkCoordinate).width *10 + 'px';  //左边距
                    var top = JSON.parse(data.watermarkCoordinate).height *10 + 'px';  //右边距
                    var opct = data.watermarkTransparency/100; //透明度
                    data.left = left;
                    data.top = top;
                    data.opacity = opct;
                    _this.edit(data);
                }else if(obj.event == 'del'){
                    layer.confirm('确定删除？', function(index){
                        $.ajax({
                            type: 'get',
                            url: '/lms/watermark/deleteWatermark.html',
                            data: {id: data.id},
                            dataType: 'json',
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                layer.close(index);
                                if(res.code=='0000'){
                                    layer.msg(res.msg);
                                    _this.trigClick();
                                }else{
                                    layer.msg(res.msg);
                                }
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器出问题啦');
                            }
                        });
                        
                    });
                }
            });
        },
        edit: function(data){ //水印模板编辑功能
            var _this = this;
            var editWatermarkData = '';
            var index = layer.open({
                type: 1,
                title: '编辑水印模板',
                area: ['100%', '100%'],
                btn: ['保存', '关闭'],
                id: 'smt_watermark_newAddLayerId',
                content: $('#smt_watermark_editLayer').html(),
                success: function(layero, index){
                        var formTemplate = smt_watermark_contentTpl.innerHTML;
                        var formDiv= document.getElementById('smt_watermark_content');
                        laytpl(formTemplate).render(data, function(html){
                            formDiv.innerHTML = html;
                            form.render('radio');
                            form.render('select');
                            if(data.watermarkFontContent){
                                layero.find('[name=watermarkFontContent]').val(data.watermarkFontContent.replace(/<br>/g, "\r\n"));
                            }
                            _this.watchSizeChange();
                            _this.toggleType();
                            _this.watermarkEdit(data);
                            form.on('submit(smt_watermarkAdd_submit)', function(data){
                                var data = data.field; //获取到表单提交对象
                                data.platCode = "aliexpress";
                                editWatermarkData = data;
                                return false;
                            });
                    });
                },
                yes: function(index, layero){
                    /**
                     * 获取到文字水印的坐标/透明度/尺寸(文字水印的字体大小)
                     */
                        var $watermarkFontDiv = $('#smt_watermarkFontDiv');
                        $('[lay-filter=smt_watermarkAdd_submit]').trigger('click');
                          if(editWatermarkData.watermarkType ==1){ //表示文字水印
                              //获取坐标
                              var coordinateX, coordinateY;
                              var coorX = $watermarkFontDiv[0].style.left.split('p')[0];
                              var coorY = $watermarkFontDiv[0].style.top.split('p')[0];
                              if(coorX.charAt(coorX.length-1) > 5){
                                  coordinateX = Math.ceil(coorX/10);
                              }else{
                                  coordinateX = Math.floor(coorX/10);
                              };
                              if(coorY.charAt(coorY.length-1) > 5){
                                  coordinateY = Math.ceil(coorY/10);
                              }else{
                                  coordinateY = Math.floor(coorY/10);
                              };
                            //   console.log(coordinateX, coordinateY);
                              editWatermarkData.watermarkCoordinate = `{"width": ${coordinateX}, "height": ${coordinateY}}`;
                              //获取透明度和尺寸
                              editWatermarkData.watermarkTransparency = (100 -$('#smt_watermarkTypeFont_opacityAmount').text().split('%')[0]);
                              editWatermarkData.watermarkSize = editWatermarkData.watermarkFontSize;
                              editWatermarkData.watermarkFontContent = $('#smt_watermarkFontDiv').find('span').html();
                              //图片相关的都设为空
                              editWatermarkData.watermarkUrl = '';
                          }else if(editWatermarkData.watermarkType ==0){ //表示图片水印
                              //透明度
                              editWatermarkData.watermarkTransparency = (100 -$('#smt_watermarkTypeImg_opacityAmount').text().split('%')[0]);
                              //文字相关的都设为空
                              editWatermarkData.watermarkFontBackgroundColor='';
                              editWatermarkData.watermarkFontColor='';
                              editWatermarkData.watermarkFontContent= '';
                              editWatermarkData.watermarkFontSize= '';
                              editWatermarkData.watermarkFontType= '';
                          }
                          editWatermarkData.watermarkType = Number(editWatermarkData.watermarkType);
                          editWatermarkData.id = data.id;
                          editWatermarkData.platCode = "aliexpress";
                          editWatermarkData.borderSize = $('[lay-filter=smt_watermark_sizeChange]').val();
                          editWatermarkData.degree = $('[name=degree]').val();
                        //   console.log(editWatermarkData);
                            $.ajax({
                              type: 'post',
                              url: '/lms/watermark/editWatermark.html',
                              data: JSON.stringify(editWatermarkData),
                              dataType: 'json',
                              contentType: 'application/json;charset=UTF-8',
                              beforeSend: function(){
                                  loading.show();
                              },
                              success: function(res){
                                  loading.hide();
                                  if(res.code == '0000'){
                                      layer.msg(res.msg);
                                      layer.close(index);
                                      _this.trigClick();
                                  }else{
                                      layer.msg(res.msg);
                                  };
                              },
                              error: function(){
                                  loading.hide();
                                  layer.msg('服务器出错啦!');
                              }
                            }); 
                },
                end: function(){
                    $(window).off('mouseup');
                }
            })
        },
        watermarkEdit: function(data){
            var _this = this;
            //基础节点
            var $watermarkDiv = $('#smt_watermarkImageDiv'),
            $watermarkFontDiv = $('#smt_watermarkFontDiv'),
            $sliderRangeMin1 = $('#smt_slider-range-min1'),  //图片大小
            $sliderRangeMin2 = $('#smt_slider-range-min2'), //透明度
            $sliderRangeMin3 = $('#smt_slider-range-min3'),//文字透明度
            $sliderRangeMin4 = $('#smt_slider-range-min4'),//图片旋转角度
            $sliderRangeMin5 = $('#smt_slider-range-min5'),//文字旋转角度
            Width = $watermarkDiv.width(),
            Height = $watermarkDiv.height();
            //普通图片上传
            var uploadInst = upload.render({
                elem: '#smt_watermark_upload'
                ,url: ctx + "/watermark/uploadPhoto.html?platCode=aliexpress"
                ,done: function(res){
                    if(res.code == '0000'){//上传成功
                        //重置图片和百分比
                        sliderScroll($sliderRangeMin1, 'smt_watermarkTypeImg_sizeAmount', 100, 20, 200);
                        sliderScroll($sliderRangeMin2, 'smt_watermarkTypeImg_opacityAmount', 0, 0, 100);
                        sliderScroll($sliderRangeMin4, 'watermarkTypeImg_rotateAmount', 0, -180, 180);
                        $watermarkDiv.find('img').attr('src', '');
                        var $IMG = new Image();
                        $IMG.src = res.data;
                        $IMG.onload = function() { 
                            Width = $IMG.width;
                            Height = $IMG.height;
                            $watermarkDiv.css({
                                'width': Width + 'px', 
                                'height': Height + 'px', 
                                'display': 'inline-block',
                                'transform': 'rotate(0deg)',
                                'top': 0,
                                'left': 0,
                                'opacity': 1
                            });
                            $watermarkDiv.find('img').attr('src', res.data);
                            $('#smt_watermark_uploadImg').attr('src', res.data); //图片链接（base64）
                            $('[name=watermarkUrl]').val(res.data);
                            $('[name=watermarkSize]').val(100);
                            $('[name=watermarkTransparency]').val(100);
                            $('[name=degree]').val(0);
                        };
                    }else{//如果上传失败
                        layer.msg(res.msg);
                        return false;
                    } 
                }
            });              
            //按钮滚动
            var sliderScroll = function(btn, id, value, min, max){
                btn.slider({
                    range: 'min',
                    value: value, //默认值
                    min: min, //最小值
                    max: max, //最大值
                    slide: function(event, ui) {
                        if(id == 'smt_watermarkTypeImg_rotateAmount'){
                            $('#'+id).html(ui.value);
                        }else{
                            $('#'+id).html(ui.value + '%');
                        }
                        if(id == 'smt_watermarkTypeImg_sizeAmount'){
                            var Widths = Width - ((100 - ui.value) * 0.01 * Width),
                            Heights = Height - ((100 - ui.value) * 0.01 * Height);
                            $watermarkDiv.css({
                                'width' : Widths + 'px',
                                'height' : Heights + 'px'
                            });
                            $('[name=watermarkSize]').val(ui.value);//图片水印大小
                        }else if(id=='smt_watermarkTypeImg_opacityAmount'){
                            var opacity = ui.value/100;
                            $watermarkDiv.css({
                                'opacity': 1-opacity
                            });
                            $('[name=watermarkTransparency]').val(ui.value);//透明度大小
                        }else{
                            $watermarkDiv.css({
                                'transform': `rotate(${ui.value}deg)`
                            });
                            $('[name=degree]').val(ui.value);
                        }
                    }
                });
                if(id== 'smt_watermarkTypeImg_rotateAmount'){
                    $('#'+id).html(btn.slider('value'));
                }else{
                    $('#'+id).html(btn.slider('value') + '%');
                }
            };
            //这个是图片的尺寸调整
            sliderScroll($sliderRangeMin1, 'smt_watermarkTypeImg_sizeAmount', data.watermarkSize, 20, 200);
            //这个是透明度的调整
            sliderScroll($sliderRangeMin2, 'smt_watermarkTypeImg_opacityAmount', (100-data.watermarkTransparency), 0, 100);
            //这个是图片的旋转角度
            sliderScroll($sliderRangeMin4, 'smt_watermarkTypeImg_rotateAmount', data.degree,-180, 180);
            //拖拽功能
            var drag = function($watermarkDivs,$albumListBody){
                var watermarkType = $.trim($('[name=watermarkType]').val()); //获取水印类型
                //禁止选择网页中的文字
                document.onselectstart =function(){
                    return false;
                };
                //mouseDown
                mouseDown = function(e) {
                    e = e || window.event;
                    var boxW = $watermarkDivs.width(),
                        boxH = $watermarkDivs.height(),
                        divW = $albumListBody.width(),
                        divH = $albumListBody.height(),
                        offsetLeft = e.offsetX, //e.offsetX是相对于父元素box的距离
                        offsetTop = e.offsetY,
                        Left = '',
                        Top = '';
                    document.onmousemove=function(evt){
                        evt = evt || window.event;
                        Left = evt.clientX - offsetLeft - $albumListBody.offset().left;
                        Top = evt.clientY - offsetTop - $albumListBody.offset().top + $(window).scrollTop();
                        $watermarkDivs.css('left',Left + 'px');
                        $watermarkDivs.css('top',Top + 'px');
                        $watermarkDivs.css('right', 'auto');
                        $watermarkDivs.css('bottom', 'auto');
                        if(Top < 0) $watermarkDivs.css('top', '0px');
                        if(Left < 0) $watermarkDivs.css('left', '0px');
                        if(boxW + Left > divW) $watermarkDivs.css('left',divW - boxW - 2 + 'px');
                        if(boxH + Top > divH) $watermarkDivs.css('top',divH - boxH - 2 + 'px');
                        evt.preventDefault() ? evt.preventDefault() : evt.returnValue = false;
                    };
                };
                $watermarkDivs.on('mousedown', mouseDown);
                document.onmouseup = function() {
                    document.onmousemove = null;
                    $watermarkDivs.off("mousedown");
                };
                return mouseDown;
            };
            //水印图片拖拽
            (function(){
                var mouseDownImg;
                $("#smt_watermarkImageDiv > .smt_watermark-div-fix").off("mousedown").on("mousedown", function() {
                    $(window).off("mousedown");
                    $watermarkDiv.on("mousedown", mouseDownImg);
                });
                $(window).mousemove(function() {
                    $(window).off("mousedown").on('mousedown', function() {
                        $watermarkDiv.on("mousedown", mouseDownImg);
                    });
                });
                $(window).off('mouseup').on('mouseup',function(e) {
                    document.onmousemove = null;
                    var coordinateX, coordinateY;
                    var coorX = $watermarkDiv[0].style.left.split('p')[0];
                    var coorY = $watermarkDiv[0].style.top.split('p')[0];
                    if(coorX.charAt(coorX.length-1) > 5){
                        coordinateX = Math.ceil(coorX/10);
                    }else{
                        coordinateX = Math.floor(coorX/10);
                    };
                    if(coorY.charAt(coorY.length-1) > 5){
                        coordinateY = Math.ceil(coorY/10);
                    }else{
                        coordinateY = Math.floor(coorY/10);
                    };
                    // console.log(coordinateX, coordinateY);
                    $('[name=watermarkCoordinate]').val(JSON.stringify({"width": coordinateX, "height": coordinateY}));
                });
                mouseDownImg = drag($watermarkDiv, $('#smt_albumListBody'));
            })();
            //水印文字拖拽
            (function(){
                var mouseDownFont;
                $("#smt_watermarkFontDiv span").off("mousedown").on("mousedown", function() {
                    $(window).off("mousedown");
                    $watermarkFontDiv.on("mousedown", mouseDownFont);
                });
                mouseDownFont = drag($watermarkFontDiv, $('#smt_albumListBody'));
            })();
            //文字颜色 背景和透明度的处理
            (function(){
                //水印文字输入的文字内容
                $('[name=watermarkFontContent]').bind('input porpertychange', function(){
                    var $val = $(this).val();
                    var handleVal = $val.replace(/\r?\n/g, '<br>');
                    $watermarkFontDiv.find('span').html(handleVal);
                });
                //文字的颜色(监听input的onchange事件)
                $('[name=watermarkFontColor]').on('change', function(){
                    var fontColor = $(this).val();
                    $watermarkFontDiv.find('span').css({
                        'color': fontColor
                    });
                });
                //文字所在元素的背景色(监听input的onchange事件)
                $('[name=watermarkFontBackgroundColor]').on('change', function(){
                    var bgColor = $(this).val();
                    $watermarkFontDiv.css({
                        'backgroundColor': bgColor
                    });
                });
                //监听选择的字体大小
                form.on('select(smt_watermarkFontSizeF)', function(data){
                    var fontSize = data.value;
                    $watermarkFontDiv.find('span').css({
                        'fontSize': fontSize + 'px'
                    });
                });
                //监听字体类型
                form.on('select(smt_watermarkFontTypeF)', function(data){
                    var fontFamily = data.value;
                    $watermarkFontDiv.find('span').css({
                        'fontFamily': fontFamily
                    });
                });
                /*监听文字背景透明度start*/
                $sliderRangeMin3.slider({
                    range: 'min',
                    value: (100-data.watermarkTransparency), //默认值
                    min: 0, //最小值
                    max: 100, //最大值
                    slide: function(event, ui) {
                        $('#smt_watermarkTypeFont_opacityAmount').html(ui.value + '%');
                        var opacity = ui.value/100;
                        $watermarkFontDiv.css({
                            'opacity': 1-opacity
                        });
                    }
                });
                $('#smt_watermarkTypeFont_opacityAmount').html($sliderRangeMin3.slider('value') + '%');
                /*监听文字背景透明度end*/
                //这是文字旋转度
                $sliderRangeMin5.slider({
                    range: 'min',
                    value: data.degree, //默认值
                    min: -180, //最小值
                    max: 180, //最大值
                    slide: function(event, ui) {
                        $('#smt_watermarkTypeFont_rotateAmount').html(ui.value);
                        $watermarkFontDiv.css({
                            'transform': `rotate(${ui.value}deg)`
                        });
                        $('[name=degree]').val(ui.value);
                    }
                });
            })();
        },
        //800*800  ---  1000*1000 change
        watchSizeChange: function(){
            form.on('select(smt_watermark_sizeChange)', function(obj){
                var val = obj.elem.value;
                if(val == 1000){
                    $('#smt_watermark_rightBody').addClass('watermark-right-1000').removeClass('watermark-right-800');
                }else{
                    $('#smt_watermark_rightBody').removeClass('watermark-right-1000').addClass('watermark-right-800');
                }
            })
        }
    };
    //监听表单提交事件
    form.on('submit(smt_watermark_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        data.roleNames= "smt专员";
        data.platCode = "aliexpress";
        watermarkName.tableRender(data);
        return false;
    });

    //新增水印弹框
    watermarkName.newAdd();
    //获取店铺
    watermarkName.getStore();
    //页面初始化
    watermarkName.trigClick();
});
//#endregion