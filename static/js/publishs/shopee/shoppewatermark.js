// #region
layui.use(['admin', 'table', 'form', 'layer', 'formSelects', 'laytpl', 'upload'], function () {
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        upload = layui.upload,
        form = layui.form;
    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#shoppeWatermarkForm");
    //字体和字体大小数组集合
    var fontFamilyArr = [{ value: '微软雅黑', name: '微软雅黑' }, { value: '宋体', name: '宋体' }, { value: 'Arial Black', name: 'Arial Black' }, { value: 'Gabriola', name: 'Gabriola' }, { value: 'Impact', name: 'Impact' }, { value: 'MV Boli', name: 'MV Boli' }, { value: 'Segoe Script', name: 'Segoe Script' }, { value: '楷体', name: '楷体' }, { name: '华文琥珀', value: '华文琥珀' }];
    var fontSizeArr = [{ value: 12, name: 12 }, { value: 14, name: 14 }, { value: 18, name: 18 }, { value: 24, name: 24 }, { value: 30, name: 30 }, { value: 36, name: 36 }, { value: 48, name: 48 }, { value: 60, name: 60 }];

    //多选店铺集合
    var shoppeWatermark_storeListArr;
    //水印的命名空间
    var shoppeWatermarkName = {
        trigClick: function () {
            $('[lay-filter=shoppeWatermark-submit]').click();
        },
        getStore: function () { //获取店铺,多选
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/shopee/shoppeWatermark/listAcctByUserAndPlat.html',
                data: { platCode: 'shopee' },
                success: function (res) {
                    if (res.code == '0000') {
                        var data = res.data;
                        var arr = [];
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var obj = {
                                'name': item.storeAcct,
                                'value': item.id
                            };
                            arr.push(obj);
                        };
                        shoppeWatermark_storeListArr = arr;
                    }
                }
            })
        },
        newAdd: function () { //新增水印
            var _this = this;
            $('#shoppeWatermark_newAdd').on('click', function () {
                var watermarkData = '';
                var index = layer.open({
                    type: 1,
                    title: '新增水印',
                    area: ['100%', '100%'],
                    btn: ['保存', '关闭'],
                    id: 'shoppeWatermark_newAddLayerId',
                    content: $('#shoppeWatermark_newAddLayer').html(),
                    success: function (layero, index) {
                        form.render('select');
                        form.render('radio');
                        form.render('checkbox');
                        _this.toggleType(layero);
                        _this.watermark(layero);
                        _this.watchSizeChange();
                        _this.layoutHandle(layero);
                        var str = '<option value=""></option>';
                        for (var i = 0; i < shoppeWatermark_storeListArr.length; i++) {
                            var item = shoppeWatermark_storeListArr[i];
                            str += `<option value="${item.value}">${item.name}</option>`;
                        };
                        $('[name=salesPlatAcctIds]').append(str);
                        formSelects.render();
                        formSelects.btns('shoppeWatermark_storeSelect', ['remove']);
                        form.on('submit(shoppeWatermarkAdd_submit)', function (data) {
                            var data = data.field; //获取到表单提交对象
                            data.platCode = "shopee";
                            watermarkData = data;
                            return false;
                        });
                    },
                    yes: function (index, layero) {
                        /**
                         * 获取到文字水印的坐标/透明度/尺寸(文字水印的字体大小)
                         */
                        var $watermarkFontDiv = $('#shoppeWatermarkFontDiv');
                        $('[lay-filter=shoppeWatermarkAdd_submit]').trigger('click');
                        if (watermarkData.watermarkType == 1) { //表示文字水印
                            //获取坐标
                            var coordinateX, coordinateY;
                            var coorX = $watermarkFontDiv[0].style.left.split('p')[0];
                            var coorY = $watermarkFontDiv[0].style.top.split('p')[0];
                            if (coorX.charAt(coorX.length - 1) > 5) {
                                coordinateX = Math.ceil(coorX / 10);
                            } else {
                                coordinateX = Math.floor(coorX / 10);
                            };
                            if (coorY.charAt(coorY.length - 1) > 5) {
                                coordinateY = Math.ceil(coorY / 10);
                            } else {
                                coordinateY = Math.floor(coorY / 10);
                            };
                            // console.log(coordinateX, coordinateY);
                            watermarkData.watermarkCoordinate = `{"width": ${coordinateX}, "height": ${coordinateY}}`;
                            //获取透明度和尺寸
                            watermarkData.watermarkTransparency = (100 - $('#shoppeWatermarkTypeFont_opacityAmount').text().split('%')[0]);
                            watermarkData.watermarkSize = watermarkData.watermarkFontSize;
                            watermarkData.watermarkFontContent = $('#shoppeWatermarkFontDiv').find('span').html();
                            //判断是否平铺,获取平铺信息
                            let isCked = layero.find('[name=isLayout]').is(':checked');
                            if (isCked) {
                                watermarkData.layout = 1;
                                watermarkData.spaceY = Number($('#shoppeWatermarkTypeFont_verticalSpacingAmount').text());
                                watermarkData.spaceX = Number($('#shoppeWatermarkTypeFont_levelSpacingAmount').text());
                            } else {
                                watermarkData.layout = 0;
                                watermarkData.spaceY = 50;
                                watermarkData.spaceX = 50;
                            }
                            //图片相关的都设为空
                            watermarkData.watermarkUrl = '';
                        } else if (watermarkData.watermarkType == 0) { //表示图片水印
                            //透明度
                            watermarkData.watermarkTransparency = (100 - $('#shoppeWatermarkTypeImg_opacityAmount').text().split('%')[0]);
                            //文字相关的都设为空
                            watermarkData.watermarkFontBackgroundColor = '';
                            watermarkData.watermarkFontColor = '';
                            watermarkData.watermarkFontContent = '';
                            watermarkData.watermarkFontSize = '';
                            watermarkData.watermarkFontType = '';
                            watermarkData.layout = 0;
                            watermarkData.spaceY = 50;
                            watermarkData.spaceX = 50;
                        }
                        watermarkData.watermarkType = Number(watermarkData.watermarkType);
                        watermarkData.borderSize = $('[lay-filter=shoppeWatermark_sizeChange]').val();
                        watermarkData.degree = $('[name=degree]').val();
                        $.ajax({
                            type: 'post',
                            url: '/lms/shopee/shoppeWatermark/saveWatermark.html',
                            data: JSON.stringify(watermarkData),
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                if (res.code == '0000') {
                                    layer.msg(res.msg);
                                    layer.close(index);
                                    _this.trigClick();
                                } else {
                                    layer.msg(res.msg);
                                };
                            },
                            error: function () {
                                loading.hide();
                                layer.msg('服务器出错啦!');
                            }
                        });
                    },
                    end: function () {
                        $(window).off('mouseup');
                    }
                })
            });
        },
        layoutHandle: function (layero) {//平铺操作
            let _this = this;
            form.on('checkbox(watermarkTypeText_isLayoutFilter)', function (data) {
                let isCked = data.elem.checked;
                if (isCked) {//执行平铺操作
                    _this.layoutCanvasShow(layero, {
                        verticalSpacing: 100,
                        levelSpacing: 100
                    });
                    layero.find('.watermarkTypeTextTile').removeClass('disN'); //打开间距配置
                } else {//移除平铺canvas
                    _this.layoutCanvasRemove(layero);
                    layero.find('.watermarkTypeTextTile').addClass('disN');//关闭间距配置
                }
                $('#shopee_slider_range_min_levelSpacing').slider({ 'value': 100 });
                $('#shoppeWatermarkTypeFont_levelSpacingAmount').html('100');
                $('#shopee_slider_range_min_verticalSpacing').slider({ 'value': 100 });
                $('#shoppeWatermarkTypeFont_verticalSpacingAmount').html('100');
            });
        },
        layoutCanvasShow: function (layero, obj) {//生成水印平铺效果图
            // console.log('动态配置', obj);
            /**
             * obj应该含有的字段:
             * 水平间距:levelSpacing
             * 竖直间距:verticalSpacing
             */
            //判断是否有文字
            let hasText = layero.find('[name=watermarkFontContent]').val().trim();
            if (hasText) {
                let elem = document.querySelector('#shoppeWatermarkFontDiv');
                html2canvas(elem, {
                    // windowWidth: elem.scrollWidth,
                    // windowHeight: elem.scrollHeight,
                    width: elem.clientWidth + obj.levelSpacing,
                    height: elem.clientHeight + obj.verticalSpacing,
                    // x: 0,
                    // y: 0,
                }).then((canvas) => {
                    layero.find('#shoppeWatermarkFontDiv').hide();
                    let id = 'tt1.23452384164.123412415';
                    let $id = document.getElementById(id);
                    let $albumListBody = document.querySelector('#shopee_albumListBody');
                    if ($id !== null) {
                        $albumListBody.removeChild($id);
                    }
                    let div = document.createElement('div');
                    div.id = id;
                    div.style.zIndex = '100000';
                    div.style.width = document.querySelector('#shopee_albumListBody').clientWidth + 'px';
                    div.style.height = document.querySelector('#shopee_albumListBody').clientHeight + 'px';
                    let cansImg = 'url(' + canvas.toDataURL('image/png') + ') left top repeat';
                    div.style.background = cansImg;
                    $albumListBody.appendChild(div);
                });
            }
        },
        layoutCanvasRemove: function (layero) {//移除平铺水印
            let id = 'tt1.23452384164.123412415';
            let $id = document.getElementById(id);
            if ($id!== null) {
                document.querySelector('#shopee_albumListBody').removeChild($id);
            }
            layero.find('#shoppeWatermarkFontDiv').show();
        },
        toggleType: function (layero) { //监听radio的点击事件 然后决定显示什么内容
            //基础节点
            let _this = this;
            var $watermarkDiv = $('#shoppeWatermarkImageDiv'),
                $watermarkFontDiv = $('#shoppeWatermarkFontDiv');
            form.on('radio(shoppeWatermarkTypeRadio)', function (data) {
                if (data.value == 1) { //文字水印
                    /**文字水印设置显示,图片水印设置隐藏 */
                    layero.find('#shoppeWatermarkFontDiv').removeClass('disN');
                    layero.find('.watermarkTypeImg').addClass('disN');
                    layero.find('.watermarkTypeText').removeClass('disN');
                    layero.find('#shoppeWatermarkImageDiv').addClass('disN');
                    /**
                     * 切换后的图片水印设置初始化:
                     * 1.图片链接清空: src(#shoppeWatermark_uploadImg/.watermark-div-img)
                     * 2.图片input清空: name="watermarkCoordinate"/name="watermarkSize"/name="watermarkTransparency"/ name="watermarkUrl"
                     * 3.图片透明度和尺寸进度条恢复默认
                     * */
                    layero.find('#shoppeWatermark_uploadImg').removeAttr('src');
                    layero.find('.watermark-div-img').removeAttr('src');
                    //data值初始化
                    layero.find('[name=watermarkCoordinate]').val('{"width":0, "height":0}');//坐标
                    layero.find('[name=watermarkSize]').val(''); //尺寸
                    layero.find('[name=watermarkTransparency]').val('0');//透明度
                    layero.find('[name=watermarkUrl]').val('');
                    layero.find('[name=degree]').val(0); //旋转角度
                    // $('#shoppeWatermarkTypeImg_opacityAmount').html($sliderRangeMin2.slider('0') + '%'); //透明度
                    // $('#shoppeWatermarkTypeImg_sizeAmount').html($sliderRangeMin1.slider('100') + '%'); //尺寸
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
                } else {
                    /**文字水印设置隐藏,图片水印设置显示 */
                    layero.find('#shoppeWatermarkFontDiv').addClass('disN');
                    layero.find('.watermarkTypeImg').removeClass('disN');
                    layero.find('.watermarkTypeText').addClass('disN');
                    layero.find('#shoppeWatermarkImageDiv').removeClass('disN');
                    /**切换后的文字水印设置初始化*/
                    // $('#shopee_slider-range-min2').slider({ 'value': 0 });
                    // $('#shoppeWatermarkTypeImg_opacityAmount').html('0%'); //图片透明度
                    // $('#shopee_slider-range-min1').slider({ 'value': 100 });
                    // $('#shoppeWatermarkTypeImg_sizeAmount').html('100%'); //大小初始化
                    // $('#shopee_slider_range_min3').slider({ 'value': 0 });
                    // $('#shoppeWatermarkTypeFont_opacityAmount').html('0%'); //文字透明度
                    // $('#shopee_slider_range_min4').slider({ 'value': 0 });
                    // $('#shoppeWatermarkTypeImg_rotateAmount').html(0);
                    // $('#shopee_slider-range-min5').slider({ 'value': 0 }); //文字旋转
                    // $('#shoppeWatermarkTypeFont_rotateAmount').html(0);
                    //data值初始化
                    layero.find('[name=watermarkCoordinate]').val('{"width":0, "height":0}');//坐标
                    layero.find('[name=watermarkSize]').val('100'); //尺寸
                    layero.find('[name=watermarkTransparency]').val('0');//透明度
                    layero.find('[name=watermarkUrl]').val('');
                    layero.find('[name=degree]').val(0); //旋转角度
                    layero.find('[name=watermarkFontContent]').val('');
                    layero.find('[name=watermarkFontType]').val('微软雅黑');
                    layero.find('[name=watermarkFontSize]').val('14');
                    layero.find('[name=watermarkFontColor]').val('#000000');
                    layero.find('[name=watermarkFontBackgroundColor]').val('#ffffff');
                    layero.find('[name=isLayout]').prop('checked', false);
                    form.render('checkbox');
                    $watermarkFontDiv.find('span').html('');
                    $watermarkFontDiv.find('span').css({
                        'display': 'block',
                        'padding': '10px',
                        'white-space': 'nowrap',
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
                //滚动条初始化
                $('#shopee_slider-range-min2').slider({ 'value': 0 });
                $('#shoppeWatermarkTypeImg_opacityAmount').html('0%');
                $('#shopee_slider-range-min1').slider({ 'value': 100 });
                $('#shoppeWatermarkTypeImg_sizeAmount').html('100%');
                $('#shopee_slider_range_min3').slider({ 'value': 0 }); //文字透明度
                $('#shoppeWatermarkTypeFont_opacityAmount').html('0%');
                $('#shopee_slider_range_min4').slider({ 'value': 0 });
                $('#shoppeWatermarkTypeImg_rotateAmount').html(0);
                $('#shopee_slider-range-min5').slider({ 'value': 0 }); //文字旋转
                $('#shoppeWatermarkTypeFont_rotateAmount').html(0);
                layero.find('.watermarkTypeTextTile').addClass('disN');
                _this.layoutCanvasRemove(layero);
            });
        },
        watermark: function (layero) { //功能集合函数
            var _this = this;
            //基础节点
            var $watermarkDiv = $('#shoppeWatermarkImageDiv'),
                $watermarkFontDiv = $('#shoppeWatermarkFontDiv'),
                $sliderRangeMin1 = $('#shopee_slider-range-min1'),  //图片大小
                $sliderRangeMin2 = $('#shopee_slider-range-min2'), //透明度
                $sliderRangeMin3 = $('#shopee_slider_range_min3'),//文字透明度
                $sliderRangeMin4 = $('#shopee_slider_range_min4'),//图片旋转角度
                $sliderRangeMin5 = $('#shopee_slider-range-min5'),//文字旋转角度
                $sliderRangeMinTileLevel = $('#shopee_slider_range_min_levelSpacing'),//文字旋转角度
                $sliderRangeMinTileVertical = $('#shopee_slider_range_min_verticalSpacing'),//文字旋转角度
                Width = $watermarkDiv.width(),
                Height = $watermarkDiv.height();
            //普通图片上传
            var uploadInst = upload.render({
                elem: '#shoppeWatermark_upload'
                , url: ctx + "/shopee/shoppeWatermark/uploadPhoto.html?platCode=shopee"
                , done: function (res) {
                    if (res.code == '0000') {//上传成功
                        //重置图片和百分比
                        sliderScroll($sliderRangeMin1, 'shoppeWatermarkTypeImg_sizeAmount', 100, 20, 200);
                        sliderScroll($sliderRangeMin2, 'shoppeWatermarkTypeImg_opacityAmount', 0, 0, 100);
                        sliderScroll($sliderRangeMin4, 'shoppeWatermarkTypeImg_rotateAmount', 0, -180, 180);
                        $watermarkDiv.find('img').attr('src', '');
                        var $IMG = new Image();
                        $IMG.src = res.data;
                        $IMG.onload = function () {
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
                            $('#shoppeWatermark_uploadImg').attr('src', res.data); //图片链接（base64）
                            $('[name=watermarkUrl]').val(res.data);
                            $('[name=watermarkSize]').val(100);
                            $('[name=watermarkTransparency]').val(100);
                            $('[name=degree]').val(0);
                        };
                    } else {//如果上传失败
                        layer.msg(res.msg);
                        return false;
                    }
                }
            });
            //按钮滚动
            var sliderScroll = function (btn, id, value, min, max) {
                let idWhiteList = ['shoppeWatermarkTypeImg_rotateAmount', 'shoppeWatermarkTypeFont_levelSpacingAmount', 'shoppeWatermarkTypeFont_verticalSpacingAmount'];
                btn.slider({
                    range: 'min',
                    value: value, //默认值
                    min: min, //最小值
                    max: max, //最大值
                    slide: function (event, ui) {
                        if (idWhiteList.includes(id)) {
                            $('#' + id).html(ui.value);
                        } else {
                            $('#' + id).html(ui.value + '%');
                        }
                        if (id == 'shoppeWatermarkTypeImg_sizeAmount') {
                            var Widths = Width - ((100 - ui.value) * 0.01 * Width),
                                Heights = Height - ((100 - ui.value) * 0.01 * Height);
                            $watermarkDiv.css({
                                'width': Widths + 'px',
                                'height': Heights + 'px'
                            });
                            $('[name=watermarkSize]').val(ui.value);//图片水印大小
                        } else if (id == 'shoppeWatermarkTypeImg_opacityAmount') {
                            var opacity = ui.value / 100;
                            $watermarkDiv.css({
                                'opacity': 1 - opacity
                            });
                            $('[name=watermarkTransparency]').val(ui.value);//透明度大小
                        } else if (id== 'shoppeWatermarkTypeImg_rotateAmount'){
                            $watermarkDiv.css({
                                'transform': `rotate(${ui.value}deg)`
                            });
                            $('[name=degree]').val(ui.value);
                        } else if (id == 'shoppeWatermarkTypeFont_levelSpacingAmount') {
                            _this.layoutCanvasRemove(layero);
                            let obj = {
                                levelSpacing: ui.value,
                                verticalSpacing: Number($('#shoppeWatermarkTypeFont_verticalSpacingAmount').text())
                            };
                            //调整水平距离
                            _this.layoutCanvasShow(layero, obj);
                        } else if (id == 'shoppeWatermarkTypeFont_verticalSpacingAmount') {
                            //调整垂直距离
                            _this.layoutCanvasRemove(layero);
                            let obj = {
                                levelSpacing: Number($('#shoppeWatermarkTypeFont_levelSpacingAmount').text()),
                                verticalSpacing: ui.value
                            };
                            console.log('垂直距离', ui.value);
                            _this.layoutCanvasShow(layero, obj);
                        }
                    }
                });
                if (idWhiteList.includes(id)) {
                    $('#' + id).html(btn.slider('value'));
                } else {
                    $('#' + id).html(btn.slider('value') + '%');
                }

            };
            //这个是图片的尺寸调整
            sliderScroll($sliderRangeMin1, 'shoppeWatermarkTypeImg_sizeAmount', 100, 20, 200);
            //这个是透明度的调整
            sliderScroll($sliderRangeMin2, 'shoppeWatermarkTypeImg_opacityAmount', 0, 0, 100);
            //这个是图片/文字的旋转角度
            sliderScroll($sliderRangeMin4, 'shoppeWatermarkTypeImg_rotateAmount', 0, -180, 180);
            //平铺水平间距
            sliderScroll($sliderRangeMinTileLevel, 'shoppeWatermarkTypeFont_levelSpacingAmount', 100, 50, 800);
            //平铺垂直间距
            sliderScroll($sliderRangeMinTileVertical, 'shoppeWatermarkTypeFont_verticalSpacingAmount', 100, 50, 800);

            //拖拽功能
            var drag = function ($watermarkDivs, $albumListBody) {
                var watermarkType = $.trim($('[name=watermarkType]').val()); //获取水印类型
                //禁止选择网页中的文字
                document.onselectstart = function () {
                    return false;
                };
                //mouseDown
                mouseDown = function (e) {
                    e = e || window.event;
                    var boxW = $watermarkDivs.width(),
                        boxH = $watermarkDivs.height(),
                        divW = $albumListBody.width(),
                        divH = $albumListBody.height(),
                        offsetLeft = e.offsetX, //e.offsetX是相对于父元素box的距离
                        offsetTop = e.offsetY,
                        Left = '',
                        Top = '';
                    document.onmousemove = function (evt) {
                        evt = evt || window.event;
                        Left = evt.clientX - offsetLeft - $albumListBody.offset().left;
                        Top = evt.clientY - offsetTop - $albumListBody.offset().top + $(window).scrollTop();
                        $watermarkDivs.css('left', Left + 'px');
                        $watermarkDivs.css('top', Top + 'px');
                        $watermarkDivs.css('right', 'auto');
                        $watermarkDivs.css('bottom', 'auto');
                        if (Top < 0) $watermarkDivs.css('top', '0px');
                        if (Left < 0) $watermarkDivs.css('left', '0px');
                        if (boxW + Left > divW) $watermarkDivs.css('left', divW - boxW - 2 + 'px');
                        if (boxH + Top > divH) $watermarkDivs.css('top', divH - boxH - 2 + 'px');
                        evt.preventDefault() ? evt.preventDefault() : evt.returnValue = false;
                    };
                };
                $watermarkDivs.on('mousedown', mouseDown);
                document.onmouseup = function () {
                    document.onmousemove = null;
                    $watermarkDivs.off("mousedown");
                };
                return mouseDown;
            };
            //水印图片拖拽
            (function () {
                var mouseDownImg;
                $("#shoppeWatermarkImageDiv > .watermark-div-fix").off("mousedown").on("mousedown", function () {
                    $(window).off("mousedown");
                    $watermarkDiv.on("mousedown", mouseDownImg);
                });
                $(window).mousemove(function () {
                    $(window).off("mousedown").on('mousedown', function () {
                        $watermarkDiv.on("mousedown", mouseDownImg);
                    });
                });
                $(window).off('mouseup').on('mouseup', function (e) {
                    document.onmousemove = null;
                    var coordinateX, coordinateY;
                    var coorX = $watermarkDiv[0].style.left.split('p')[0];
                    var coorY = $watermarkDiv[0].style.top.split('p')[0];
                    if (coorX.charAt(coorX.length - 1) > 5) {
                        coordinateX = Math.ceil(coorX / 10);
                    } else {
                        coordinateX = Math.floor(coorX / 10);
                    };
                    if (coorY.charAt(coorY.length - 1) > 5) {
                        coordinateY = Math.ceil(coorY / 10);
                    } else {
                        coordinateY = Math.floor(coorY / 10);
                    };
                    // console.log(coordinateX, coordinateY);
                    $('[name=watermarkCoordinate]').val(JSON.stringify({ "width": coordinateX, "height": coordinateY }));
                });
                mouseDownImg = drag($watermarkDiv, $('#shopee_albumListBody'));
            })();
            //水印文字拖拽
            (function () {
                var mouseDownFont;
                $("#shoppeWatermarkFontDiv span").off("mousedown").on("mousedown", function () {
                    $(window).off("mousedown");
                    $watermarkFontDiv.on("mousedown", mouseDownFont);
                });
                mouseDownFont = drag($watermarkFontDiv, $('#shopee_albumListBody'));
            })();
            //文字颜色 背景和透明度的处理
            (function (layero) {
                //水印文字输入的文字内容
                $('[name=watermarkFontContent]').bind('input porpertychange', function (e) {
                    var $val = $(this).val();
                    var handleVal = $val.replace(/\r?\n/g, '<br>');
                    $watermarkFontDiv.find('span').html(handleVal);
                });
                //文字的颜色(监听input的onchange事件)
                $('[name=watermarkFontColor]').on('change', function () {
                    var fontColor = $(this).val();
                    $watermarkFontDiv.find('span').css({
                        'color': fontColor
                    });
                });
                //文字所在元素的背景色(监听input的onchange事件)
                $('[name=watermarkFontBackgroundColor]').on('change', function () {
                    var bgColor = $(this).val();
                    $watermarkFontDiv.css({
                        'backgroundColor': bgColor
                    });
                });
                //监听选择的字体大小
                // form.on('select(shoppeWatermarkFontSizeF)', function (data) {
                //     var fontSize = data.value;
                //     $watermarkFontDiv.find('span').css({
                //         'fontSize': fontSize + 'px'
                //     });
                // });
                //监听输入的字体大小
                layero.on('input', '[name=watermarkFontSize]', _.debounce(function (event) {
                    let val = event.target.value;
                    if (val < 14) {
                        event.target.value = 14;
                    }
                    if (val > 200) {
                        event.target.value = 200;
                    }
                    $watermarkFontDiv.find('span').css({
                        'fontSize': event.target.value + 'px'
                    });
                },500));
                //监听字体类型
                form.on('select(shoppeWatermarkFontTypeF)', function (data) {
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
                    slide: function (event, ui) {
                        $('#shoppeWatermarkTypeFont_opacityAmount').html(ui.value + '%');
                        var opacity = ui.value / 100;
                        $watermarkFontDiv.css({
                            'opacity': 1 - opacity
                        });
                    }
                });
                $('#shoppeWatermarkTypeFont_opacityAmount').html($sliderRangeMin3.slider('value') + '%');
                /*监听文字背景透明度end*/
                //这是文字旋转度
                $sliderRangeMin5.slider({
                    range: 'min',
                    value: 0, //默认值
                    min: -180, //最小值
                    max: 180, //最大值
                    slide: function (event, ui) {
                        $('#shoppeWatermarkTypeFont_rotateAmount').html(ui.value);
                        $watermarkFontDiv.css({
                            'transform': `rotate(${ui.value}deg)`
                        });
                        $('[name=degree]').val(ui.value);
                    }
                });
            })(layero);
        },
        tableRender: function (data) { //表单渲染
            var _this = this;
            table.render({
                elem: '#shoppeWatermark_table',
                method: 'post',
                url: '/lms/shopee/shoppeWatermark/searchWatermark.html',
                where: data,
                contentType: 'application/json;charset=UTF-8',
                cols: [
                    [ //表头
                        { title: '账号', field: 'storeAcct',templet:d=>{
                            const haveAccessStr = (d.storeAuthorityDtos || []).filter(v=>v.haveAccess).map(v=>v.storeName).join()
                            const haveNoAccessStr = (d.storeAuthorityDtos || []).filter(v=>!v.haveAccess).map(v=>v.storeName).join()
                            return `<div>${haveAccessStr}</div><div class="fGrey">${haveNoAccessStr}</div>`
                        } }
                        , { title: '模板名称', field: 'watermarkTemplateName' }
                        , { title: '水印类型', templet: '#shoppeWatermark_tableType' }
                        // ,{title: '水印类型', field: 'watermarkType'}
                        , { title: '水印', templet: '#shoppeWatermark_tableShow' }
                        , { title: '是否平铺', templet: '<div><span>{{d.layout==0 ? "否": "是"}}</span></div>' }
                        // ,{title: '服务代码', templet: '#logisticsMode_tableCode'}
                        , { title: '操作', align: 'center', toolbar: '#shoppeWatermark_tableIdBar' }
                    ]
                ],
                page: true,
                id: "shoppeWatermark_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function (res) {
                    //工具条监听事件
                    _this.watchBar();
                }
            });
        },
        watchBar: function () {
            var _this = this;
            table.on('tool(shoppeWatermark_tableFilter)', function (obj) {
                var data = obj.data;
                // console.log(data);
                if (obj.event == 'edit') { //编辑回显功能
                    data.fontFamilyArr = fontFamilyArr;
                    data.fontSizeArr = fontSizeArr;
                    // 店铺下拉框
                    const hasNoAccessList = (data.storeAuthorityDtos||[]).filter(v=>!v.haveAccess).map(v=>({
                        disabled: true,
                        name: v.storeName,
                        value: v.storeAcctId
                    }))
                    
                    data.shoppeWatermark_storeListArr = shoppeWatermark_storeListArr.concat(hasNoAccessList);
                    /**处理坐标和透明度还有高度,然后挂载到data对象上 */
                    var left = JSON.parse(data.watermarkCoordinate).width * 10 + 'px';  //左边距
                    var top = JSON.parse(data.watermarkCoordinate).height * 10 + 'px';  //右边距
                    var opct = data.watermarkTransparency / 100; //透明度
                    data.left = left;
                    data.top = top;
                    data.opacity = opct;
                    _this.edit(data);
                } else if (obj.event == 'del') {
                    layer.confirm('确定删除？', function (index) {
                        $.ajax({
                            type: 'get',
                            url: '/lms/shopee/shoppeWatermark/deleteWatermark.html',
                            data: { id: data.id },
                            dataType: 'json',
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                layer.close(index);
                                if (res.code == '0000') {
                                    layer.msg(res.msg);
                                    _this.trigClick();
                                } else {
                                    layer.msg(res.msg);
                                }
                            },
                            error: function () {
                                loading.hide();
                                layer.msg('服务器出问题啦');
                            }
                        });

                    });
                }
            });
        },
        edit: function (data) { //水印模板编辑功能
            var _this = this;
            var editWatermarkData = '';
            var index = layer.open({
                type: 1,
                title: '编辑水印模板',
                area: ['100%', '100%'],
                btn: ['保存', '关闭'],
                id: 'shoppeWatermark_newAddLayerId',
                content: $('#shoppeWatermark_editLayer').html(),
                success: function (layero, index) {
                    var formTemplate = shoppeWatermark_contentTpl.innerHTML;
                    var formDiv = document.getElementById('shoppeWatermark_content');
                    laytpl(formTemplate).render(data, function (html) {
                        formDiv.innerHTML = html;
                        form.render('radio');
                        form.render('select');
                        form.render('checkbox');
                        //多选回显start
                        var initArr = [];
                        var salesPlatAcctIdArr = data.salesPlatAcctId ? data.salesPlatAcctId.split(',') : [];
                        // console.log(salesPlatAcctIdArr);
                        for (let i = 0; i < data.shoppeWatermark_storeListArr.length; i++) {
                            let item = data.shoppeWatermark_storeListArr[i];
                            if (salesPlatAcctIdArr.includes(String(item.value))) {
                                initArr.push(item.value);
                            }
                        };
                        // console.log('默认值', initArr);
                        formSelects.render();
                        formSelects.value('shoppeWatermark_storeSelect', initArr);
                        formSelects.btns('shoppeWatermark_storeSelect', ['remove']);
                        //多选回显end
                        if (data.watermarkFontContent) {
                            layero.find('[name=watermarkFontContent]').val(data.watermarkFontContent.replace(/<br>/g, "\r\n"));
                        }
                        _this.toggleType(layero);
                        _this.watermarkEdit(data, layero);
                        _this.watchSizeChange();
                        _this.layoutHandle(layero);
                        if (data.layout == 1) {
                            _this.layoutCanvasShow(layero, {
                                levelSpacing: data.spaceX,
                                verticalSpacing: data.spaceY
                            });
                        }
                    });
                    form.on('submit(shoppeWatermarkAdd_submit)', function (data) {
                        var data = data.field; //获取到表单提交对象
                        editWatermarkData = data;
                        return false;
                    });
                },
                yes: function (index, layero) {
                    /**
                     * 获取到文字水印的坐标/透明度/尺寸(文字水印的字体大小)
                     */
                    var $watermarkFontDiv = $('#shoppeWatermarkFontDiv');
                    $('[lay-filter=shoppeWatermarkAdd_submit]').trigger('click');
                    if (editWatermarkData.watermarkType == 1) { //表示文字水印
                        //获取坐标
                        var coordinateX, coordinateY;
                        var coorX = $watermarkFontDiv[0].style.left.split('p')[0];
                        var coorY = $watermarkFontDiv[0].style.top.split('p')[0];
                        if (coorX.charAt(coorX.length - 1) > 5) {
                            coordinateX = Math.ceil(coorX / 10);
                        } else {
                            coordinateX = Math.floor(coorX / 10);
                        };
                        if (coorY.charAt(coorY.length - 1) > 5) {
                            coordinateY = Math.ceil(coorY / 10);
                        } else {
                            coordinateY = Math.floor(coorY / 10);
                        };
                        //   console.log(coordinateX, coordinateY);
                        editWatermarkData.watermarkCoordinate = `{"width": ${coordinateX}, "height": ${coordinateY}}`;
                        //获取透明度和尺寸
                        editWatermarkData.watermarkTransparency = (100 - $('#shoppeWatermarkTypeFont_opacityAmount').text().split('%')[0]);
                        editWatermarkData.watermarkSize = editWatermarkData.watermarkFontSize;
                        //判断是否平铺,获取平铺信息
                        let isCked = layero.find('[name=isLayout]').is(':checked');
                        if (isCked) {
                            editWatermarkData.layout = 1;
                            editWatermarkData.spaceY = Number($('#shoppeWatermarkTypeFont_verticalSpacingAmount').text());
                            editWatermarkData.spaceX = Number($('#shoppeWatermarkTypeFont_levelSpacingAmount').text());
                        } else {
                            editWatermarkData.layout = 0;
                            editWatermarkData.spaceY = 50;
                            editWatermarkData.spaceX = 50;
                        }
                        //图片相关的都设为空
                        editWatermarkData.watermarkUrl = '';
                        editWatermarkData.watermarkFontContent = $('#shoppeWatermarkFontDiv').find('span').html();
                    } else if (editWatermarkData.watermarkType == 0) { //表示图片水印
                        //透明度
                        editWatermarkData.watermarkTransparency = (100 - $('#shoppeWatermarkTypeImg_opacityAmount').text().split('%')[0]);
                        //文字相关的都设为空
                        editWatermarkData.watermarkFontBackgroundColor = '';
                        editWatermarkData.watermarkFontColor = '';
                        editWatermarkData.watermarkFontContent = '';
                        editWatermarkData.watermarkFontSize = '';
                        editWatermarkData.watermarkFontType = '';
                        editWatermarkData.layout = 0;
                        editWatermarkData.spaceY = 50;
                        editWatermarkData.spaceX = 50;
                    }
                    editWatermarkData.watermarkType = Number(editWatermarkData.watermarkType);
                    editWatermarkData.id = data.id;
                    editWatermarkData.platCode = "shopee";
                    editWatermarkData.borderSize = $('[lay-filter=shoppeWatermark_sizeChange]').val();
                    editWatermarkData.degree = $('[name=degree]').val();
                    //   console.log(editWatermarkData);
                    $.ajax({
                        type: 'post',
                        url: '/lms/shopee/shoppeWatermark/editWatermark.html',
                        data: JSON.stringify(editWatermarkData),
                        dataType: 'json',
                        contentType: 'application/json;charset=UTF-8',
                        beforeSend: function () {
                            loading.show();
                        },
                        success: function (res) {
                            loading.hide();
                            if (res.code == '0000') {
                                layer.msg(res.msg);
                                layer.close(index);
                                _this.trigClick();
                            } else {
                                layer.msg(res.msg);
                            };
                        },
                        error: function () {
                            loading.hide();
                            layer.msg('服务器出错啦!');
                        }
                    });
                },
                end: function () {
                    $(window).off('mouseup');
                }
            })
        },
        watermarkEdit: function (data, layero) {
            var _this = this;
            //基础节点
            var $watermarkDiv = $('#shoppeWatermarkImageDiv'),
                $watermarkFontDiv = $('#shoppeWatermarkFontDiv'),
                $sliderRangeMin1 = $('#shopee_slider-range-min1'),  //图片大小
                $sliderRangeMin2 = $('#shopee_slider-range-min2'), //透明度
                $sliderRangeMin3 = $('#shopee_slider_range_min3'),//文字透明度
                $sliderRangeMin4 = $('#shopee_slider_range_min4'),//图片旋转角度
                $sliderRangeMin5 = $('#shopee_slider-range-min5'),//文字旋转角度
                $sliderRangeMinTileLevel = $('#shopee_slider_range_min_levelSpacing'),//水平间隔
                $sliderRangeMinTileVertical = $('#shopee_slider_range_min_verticalSpacing'),//垂直间隔
                Width = $watermarkDiv.width(),
                Height = $watermarkDiv.height();
            //普通图片上传
            var uploadInst = upload.render({
                elem: '#shoppeWatermark_upload'
                , url: ctx + "/shopee/shoppeWatermark/uploadPhoto.html?platCode=shopee"
                , done: function (res) {
                    if (res.code == '0000') {//上传成功
                        //重置图片和百分比
                        sliderScroll($sliderRangeMin1, 'shoppeWatermarkTypeImg_sizeAmount', 100, 20, 200);
                        sliderScroll($sliderRangeMin2, 'shoppeWatermarkTypeImg_opacityAmount', 0, 0, 100);
                        sliderScroll($sliderRangeMin4, 'shoppeWatermarkTypeImg_rotateAmount', 0, -180, 180);
                        $watermarkDiv.find('img').attr('src', '');
                        var $IMG = new Image();
                        $IMG.src = res.data;
                        $IMG.onload = function () {
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
                            $('#shoppeWatermark_uploadImg').attr('src', res.data); //图片链接（base64）
                            $('[name=watermarkUrl]').val(res.data);
                            $('[name=watermarkSize]').val(100);
                            $('[name=watermarkTransparency]').val(100);
                            $('[name=degree]').val(0);
                        };
                    } else {//如果上传失败
                        layer.msg(res.msg);
                        return false;
                    }
                }
            });
            //按钮滚动
            var sliderScroll = function (btn, id, value, min, max) {
                let idWhiteList = ['shoppeWatermarkTypeImg_rotateAmount', 'shoppeWatermarkTypeFont_levelSpacingAmount', 'shoppeWatermarkTypeFont_verticalSpacingAmount'];
                btn.slider({
                    range: 'min',
                    value: value, //默认值
                    min: min, //最小值
                    max: max, //最大值
                    slide: function (event, ui) {
                        if (idWhiteList.includes(id)) {
                            $('#' + id).html(ui.value);
                        } else {
                            $('#' + id).html(ui.value + '%');
                        }
                        if (id == 'shoppeWatermarkTypeImg_sizeAmount') {
                            var Widths = Width - ((100 - ui.value) * 0.01 * Width),
                                Heights = Height - ((100 - ui.value) * 0.01 * Height);
                            $watermarkDiv.css({
                                'width': Widths + 'px',
                                'height': Heights + 'px'
                            });
                            $('[name=watermarkSize]').val(ui.value);//图片水印大小
                        } else if (id == 'shoppeWatermarkTypeImg_opacityAmount') {
                            var opacity = ui.value / 100;
                            $watermarkDiv.css({
                                'opacity': 1 - opacity
                            });
                            $('[name=watermarkTransparency]').val(ui.value);//透明度大小
                        } else if (id== 'shoppeWatermarkTypeImg_rotateAmount'){
                            $watermarkDiv.css({
                                'transform': `rotate(${ui.value}deg)`
                            });
                            $('[name=degree]').val(ui.value);
                        }else if (id == 'shoppeWatermarkTypeFont_levelSpacingAmount') {
                            _this.layoutCanvasRemove(layero);
                            let obj = {
                                levelSpacing: ui.value,
                                verticalSpacing: Number($('#shoppeWatermarkTypeFont_verticalSpacingAmount').text())
                            };
                            //调整水平距离
                            _this.layoutCanvasShow(layero, obj);
                        } else if (id == 'shoppeWatermarkTypeFont_verticalSpacingAmount') {
                            //调整垂直距离
                            _this.layoutCanvasRemove(layero);
                            let obj = {
                                levelSpacing: Number($('#shoppeWatermarkTypeFont_levelSpacingAmount').text()),
                                verticalSpacing: ui.value
                            };
                            console.log('垂直距离', ui.value);
                            _this.layoutCanvasShow(layero, obj);
                        }
                    }
                });
                if (idWhiteList.includes(id)) {
                    $('#' + id).html(btn.slider('value'));
                } else {
                    $('#' + id).html(btn.slider('value') + '%');
                }

            };
            //这个是图片的尺寸调整
            sliderScroll($sliderRangeMin1, 'shoppeWatermarkTypeImg_sizeAmount', data.watermarkSize, 20, 200);
            //这个是透明度的调整
            sliderScroll($sliderRangeMin2, 'shoppeWatermarkTypeImg_opacityAmount', (100 - data.watermarkTransparency), 0, 100);
            //这个是图片的旋转角度
            sliderScroll($sliderRangeMin4, 'shoppeWatermarkTypeImg_rotateAmount', data.degree, -180, 180);
            //平铺水平间距
            sliderScroll($sliderRangeMinTileLevel, 'shoppeWatermarkTypeFont_levelSpacingAmount', data.spaceX || 100, 50, 800);
            //平铺垂直间距
            sliderScroll($sliderRangeMinTileVertical, 'shoppeWatermarkTypeFont_verticalSpacingAmount', data.spaceY || 100, 50, 800);
            //拖拽功能
            var drag = function ($watermarkDivs, $albumListBody) {
                var watermarkType = $.trim($('[name=watermarkType]').val()); //获取水印类型
                //禁止选择网页中的文字
                document.onselectstart = function () {
                    return false;
                };
                //mouseDown
                mouseDown = function (e) {
                    e = e || window.event;
                    var boxW = $watermarkDivs.width(),
                        boxH = $watermarkDivs.height(),
                        divW = $albumListBody.width(),
                        divH = $albumListBody.height(),
                        offsetLeft = e.offsetX, //e.offsetX是相对于父元素box的距离
                        offsetTop = e.offsetY,
                        Left = '',
                        Top = '';
                    document.onmousemove = function (evt) {
                        evt = evt || window.event;
                        Left = evt.clientX - offsetLeft - $albumListBody.offset().left;
                        Top = evt.clientY - offsetTop - $albumListBody.offset().top + $(window).scrollTop();
                        $watermarkDivs.css('left', Left + 'px');
                        $watermarkDivs.css('top', Top + 'px');
                        $watermarkDivs.css('right', 'auto');
                        $watermarkDivs.css('bottom', 'auto');
                        if (Top < 0) $watermarkDivs.css('top', '0px');
                        if (Left < 0) $watermarkDivs.css('left', '0px');
                        if (boxW + Left > divW) $watermarkDivs.css('left', divW - boxW - 2 + 'px');
                        if (boxH + Top > divH) $watermarkDivs.css('top', divH - boxH - 2 + 'px');
                        evt.preventDefault() ? evt.preventDefault() : evt.returnValue = false;
                    };
                };
                $watermarkDivs.on('mousedown', mouseDown);
                document.onmouseup = function () {
                    document.onmousemove = null;
                    $watermarkDivs.off("mousedown");
                };
                return mouseDown;
            };
            //水印图片拖拽
            (function () {
                var mouseDownImg;
                $("#shoppeWatermarkImageDiv > .watermark-div-fix").off("mousedown").on("mousedown", function () {
                    $(window).off("mousedown");
                    $watermarkDiv.on("mousedown", mouseDownImg);
                });
                $(window).mousemove(function () {
                    $(window).off("mousedown").on('mousedown', function () {
                        $watermarkDiv.on("mousedown", mouseDownImg);
                    });
                });
                $(window).off('mouseup').on('mouseup', function (e) {
                    document.onmousemove = null;
                    var coordinateX, coordinateY;
                    var coorX = $watermarkDiv[0].style.left.split('p')[0];
                    var coorY = $watermarkDiv[0].style.top.split('p')[0];
                    if (coorX.charAt(coorX.length - 1) > 5) {
                        coordinateX = Math.ceil(coorX / 10);
                    } else {
                        coordinateX = Math.floor(coorX / 10);
                    };
                    if (coorY.charAt(coorY.length - 1) > 5) {
                        coordinateY = Math.ceil(coorY / 10);
                    } else {
                        coordinateY = Math.floor(coorY / 10);
                    };
                    // console.log(coordinateX, coordinateY);
                    $('[name=watermarkCoordinate]').val(JSON.stringify({ "width": coordinateX, "height": coordinateY }));
                });
                mouseDownImg = drag($watermarkDiv, $('#shopee_albumListBody'));
            })();
            //水印文字拖拽
            (function () {
                var mouseDownFont;
                $("#shoppeWatermarkFontDiv span").off("mousedown").on("mousedown", function () {
                    $(window).off("mousedown");
                    $watermarkFontDiv.on("mousedown", mouseDownFont);
                });
                mouseDownFont = drag($watermarkFontDiv, $('#shopee_albumListBody'));
            })();
            //文字颜色 背景和透明度的处理
            (function (layero) {
                //水印文字输入的文字内容
                $('[name=watermarkFontContent]').bind('input porpertychange', function () {
                    var $val = $(this).val();
                    var handleVal = $val.replace(/\r?\n/g, '<br>');
                    $watermarkFontDiv.find('span').html(handleVal);
                });
                //文字的颜色(监听input的onchange事件)
                $('[name=watermarkFontColor]').on('change', function () {
                    var fontColor = $(this).val();
                    $watermarkFontDiv.find('span').css({
                        'color': fontColor
                    });
                });
                //文字所在元素的背景色(监听input的onchange事件)
                $('[name=watermarkFontBackgroundColor]').on('change', function () {
                    var bgColor = $(this).val();
                    $watermarkFontDiv.css({
                        'backgroundColor': bgColor
                    });
                });
                //监听输入的字体大小
                layero.on('input', '[name=watermarkFontSize]', _.debounce(function (event) {
                    let val = event.target.value;
                    if (val < 14) {
                        event.target.value = 14;
                    }
                    if (val > 200) {
                        event.target.value = 200;
                    }
                    $watermarkFontDiv.find('span').css({
                        'fontSize': event.target.value + 'px'
                    });
                },500));
                //监听选择的字体大小
                // form.on('select(shoppeWatermarkFontSizeF)', function (data) {
                //     var fontSize = data.value;
                //     $watermarkFontDiv.find('span').css({
                //         'fontSize': fontSize + 'px'
                //     });
                // });
                //监听字体类型
                form.on('select(shoppeWatermarkFontTypeF)', function (data) {
                    var fontFamily = data.value;
                    $watermarkFontDiv.find('span').css({
                        'fontFamily': fontFamily
                    });
                });
                /*监听文字背景透明度start*/
                $sliderRangeMin3.slider({
                    range: 'min',
                    value: (100 - data.watermarkTransparency), //默认值
                    min: 0, //最小值
                    max: 100, //最大值
                    slide: function (event, ui) {
                        $('#shoppeWatermarkTypeFont_opacityAmount').html(ui.value + '%');
                        var opacity = ui.value / 100;
                        $watermarkFontDiv.css({
                            'opacity': 1 - opacity
                        });
                    }
                });
                $('#shoppeWatermarkTypeFont_opacityAmount').html($sliderRangeMin3.slider('value') + '%');
                /*监听文字背景透明度end*/
                //这是文字旋转度
                $sliderRangeMin5.slider({
                    range: 'min',
                    value: data.degree, //默认值
                    min: -180, //最小值
                    max: 180, //最大值
                    slide: function (event, ui) {
                        $('#shoppeWatermarkTypeFont_rotateAmount').html(ui.value);
                        $watermarkFontDiv.css({
                            'transform': `rotate(${ui.value}deg)`
                        });
                        $('[name=degree]').val(ui.value);
                    }
                });
            })(layero);
        },
        watchSizeChange: function () {
            form.on('select(shoppeWatermark_sizeChange)', function (obj) {
                var val = obj.elem.value;
                if (val == 1000) {
                    $('#shopee_watermark_rightBody').addClass('watermark-right-1000').removeClass('watermark-right-800');
                } else {
                    $('#shopee_watermark_rightBody').removeClass('watermark-right-1000').addClass('watermark-right-800');
                }
            })
        }
    };
    //监听表单提交事件
    form.on('submit(shoppeWatermark-submit)', function (data) {
        var data = data.field; //获取到表单提交对象
        data.roleNames = ['shopee专员'];
        data.platCode = "shopee";
        // 店铺
        if(data.storeAcctIdList){
            data.storeAcctIdList = data.storeAcctIdList.split(',')
        }else{
            data.storeAcctIdList = [] 
        }
        // delete data.storeAcctId
        shoppeWatermarkName.tableRender(data);
        return false;
    });

    //新增水印弹框
    shoppeWatermarkName.newAdd();
    //获取店铺
    shoppeWatermarkName.getStore();
    //页面初始化
    shoppeWatermarkName.trigClick();
});
//#endregion