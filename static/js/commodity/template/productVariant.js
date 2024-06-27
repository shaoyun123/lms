
//颜色命名空间
var variantColorSpace = {
    el: { //常用的值
        colorArr: [{ name: "白色", rgb: "#ffffff", colorId: "white", fontColor: '#000' },
            { name: "黑色", rgb: "#000000", colorId: "black", fontColor: '#fff' },
            { name: "红色", rgb: "#FF2600", colorId: "red", fontColor: '#fff' },
            { name: "蓝色", rgb: "#0433FF", colorId: "blue", fontColor: '#fff' },
            { name: "绿色", rgb: "#009051", colorId: "green", fontColor: '#fff' },
            { name: "灰色", rgb: "#797979", colorId: "grey", fontColor: '#fff' },
            { name: "棕色", rgb: "#941100", colorId: "brown", fontColor: '#fff' },
            { name: "黄褐", rgb: "#929000", colorId: "tan", fontColor: '#fff' },
            { name: "米黄", rgb: "#FFFFCC", colorId: "beige", fontColor: '#000' },
            { name: "粉红", rgb: "#FF2F92", colorId: "pink", fontColor: '#fff' },
            { name: "橙色", rgb: "#FF9300", colorId: "orange", fontColor: '#fff' },
            { name: "黄色", rgb: "#FFFB00", colorId: "yellow", fontColor: '#000' },
            { name: "乳白", rgb: "#EBEBEB", colorId: "ivory", fontColor: '#000' },
            { name: "藏青", rgb: "#000080", colorId: "navy blue", fontColor: '#fff' },
            { name: "紫色", rgb: "#531B93", colorId: "purple", fontColor: '#fff' },
            { name: "金色", rgb: "#FFD479", colorId: "gold", fontColor: '#fff' },
            { name: "多彩", rgb: "url(" + ctx + "/static/img/multicolor.jpg) repeat-y", colorId: "multicolor", fontColor: '#fff' }
        ]
    },
    colorRender: function() {
        var $color = this.el.colorArr,
            $ul = $('#addVariantContainer .variantColorSel ul'); //ul元素
        $.each($color, function(i, v) {
            var li = ['<li>',
                '<label>',
                '<input type="checkbox" value=' + v.colorId + '>',
                '<span style="background:' + v.rgb + ';color:' + v.fontColor + '">' + v.name + '</span></label>',
                '</li>'
            ].join('');
            $ul.append($(li));
        })
    },
    colorAdd: function() {
        var inp = $('#addVariantContainer .variantColor .variantColorInput .variantColorVal'), //input元素
            btn = $('#addVariantContainer .variantColor .variantColorInput .variantColorBtn'), //btn元素
            err = $('#addVariantContainer .variantColor .variantColorInput .colorErrorMsg'), //错误div
            $ul = $('#addVariantContainer .variantColorSel ul'); //ul元素

        function Colors() {}; //构造函数
        $.extend(Colors.prototype, {
            init: function() { //初始化
                this.handle();
            },
            handle: function() { //点击处理
                btn.on('click', $.proxy(this.add, this));
            },
            add: function() { //添加颜色事件
               var type = this.judge(),
                   _this = this;
               if(type == 1){
                   this.error(type);
               }else if (type == -1){
                   this.error(type);
               }else if(type == 2){
                    var val = inp.val().toLowerCase(),
                    li = ['<li><label>',
                        '<input type="checkbox" value ="' + val + '" checked>',
                        '<span>' + val + '</span>',
                        '</label></li>'
                    ].join('');
                    $ul.append($(li));
                    inp.val('');
               }else {
                    inp.val('');
               }
               if(type == -1 || type == 1){
                   inp.on('input propertychange',function(){
                       if(inp.val()==''){
                           _this.error(0);
                       }
                   })
               }

            },
            judge: function() {
                var repeat = 2;
                var color = $.trim(inp.val().toLowerCase()), //input的值转小写
                    ckbox = $('input[value="' + color + '"]'); //目标checkbox元素
                var arr = [],
                    $li = $ul.find('li');
                $.each($li, function(i, v) {
                    var colors = $(v).find('input').val();
                    arr.push(colors);
                });

                if ($.inArray(color, arr) != -1) { //判断是不是已有颜色
                    var isChecked = ckbox.is(':checked');
                    if (isChecked) {
                        repeat = 1;//颜色重复
                    } else {
                        ckbox.trigger('click');
                        this.error(0);
                    }
                } else {
                    var colorArr = color.split('&')
                    var dataColor
                    for (var i = 0; i < colorArr.length; ++i) {
                        dataColor = colorArr[i]
                        if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) { //判断是不是在wish扩展色里面
                            return -1
                        }
                    }
                }
                return repeat;
            },
            error: function(type) {
                var error = $('.colorErrorMsg');
               if (type == 1){
                   error.html('<font color="red">颜色重复</font>');
               }
               else if (type == -1){
                   error.html('<font color="red">颜色无效</font>');
               } 
               else if (type == 0 ){
                  error.html('');
               }
            }
        });

        var colors = new Colors();
        return colors;
    }
};
//尺寸的命名空间
var variantSizeSpace = {
    el: {//常用的值
       headArr: [{key:'Man',name:'男装'},{key:'Women',name:'女装'},{key:'Child',name:'儿童'},{key:'ChildShoes',name:'婴/童鞋'},
                 {key:'AdditionalApparelSizes',name:'额外服装尺寸'},{key:'Numbers',name:'数字'},{key:'Bras',name:'胸罩'},{key:'ManShoes',name:'男鞋'},
                 {key:'WomenShoes',name:'女鞋'},{key:'Shoes',name:'鞋子'},{key:'Macbooks',name:'苹果电脑'},{key:'Smartphones',name:'智能手机'},
                 {key:'Gaming',name:'游戏机'},{key:'Headphones',name:'耳机'},{key:'Bedding',name:'床上用品'},{key:'Memory',name:'存储设备'},
                 {key:'Area',name:'面积或体积'},{key:'Length',name:'长度'},{key:'Volume',name:'容量'},{key:'Wattage',name:'瓦数'},
                 {key:'Voltage',name:'电压'},{key:'Weight',name:'重量'},{key:'Shapes',name:'形状'},{key:'ElectricPlugs',name:'电插头'},
                 {key:'MenSuitTuxedos',name:'男士西装礼服'},{key:'Custom',name:'自定义'},{key:'Others',name:'其他'}]
    },
    size: function(){//尺寸渲染
      var $ul = $('.variantSize .variantSizeBodyHeader>ul');
        this.sizeHeader();
        this.liRender($ul);
    },
    sizeHeader: function(){//头部添加li
        var arr = this.el.headArr,
        $ul = $('.variantSize .variantSizeBodyHeader>ul');
        $.each(arr,function(i,v){
            var li = '<li data-key="'+v.key+'"><a href="javascript:;">'+v.name+'</a></li>'
            $ul.append($(li));
        });    
    },
    liRender: function(ul){ //头部渲染
        var $li = ul.find('li'),
            _this = this;
        $li.on('click',function(){
            var key = $(this).data('key');
            $(this).siblings().css('backgroundColor','#fff');
            $(this).siblings().find('a').css('color','#428bca');
            $(this).css('backgroundColor','#0087e0');
            $(this).find('a').css('color','#fff');
            _this.bodyRender(key);
        })
    },
    bodyRender: function(key){//内容渲染
        var tpl = variantSizeData[key]["head"],
            _this = this;
        for (var i = 0; i < variantSizeData[key]["data"].length; i++) {
			variantSizeData[key]["data"][i]["code_size"] = escape(variantSizeData[key]["data"][i]["size"]);
			tpl += variantSizeData[key]["tpl"].format(variantSizeData[key]["data"][i]);
        }
        tpl += variantSizeData[key]["foot"];
        $(".variantSizeBodyBody").html(tpl);
        var obj = _this.verifyVal();
        _this.btnClick('Area',obj.validateA);
        _this.keyHandle('Area',obj.validateA);
        _this.btnClick('Length',obj.validateL);
        _this.keyHandle('Length',obj.validateL);
        _this.btnClick('Volume',obj.validateV);
        _this.keyHandle('Volume',obj.validateV);
        _this.btnClick('Wattage',obj.validateWa);
        _this.keyHandle('Wattage',obj.validateWa);
        _this.btnClick('Voltage',obj.validateVo);
        _this.keyHandle('Voltage',obj.validateVo);
        _this.btnClick('Weight',obj.validateW);
        _this.keyHandle('Weight',obj.validateW);
        _this.btnClick('Custom',obj.validateC);
        _this.keyHandle('Custom',obj.validateC);
        _this.btnClick('Numbers',obj.validateN);
        _this.keyHandle('Numbers',obj.validateN);
    },
    judgeArr: function(el){ //值判断
        var variant = el.parent().parent().prev(),
            labels = variant.find('label'),
            newArr = [];
        for(var i=0;i<labels.length;i++){
            var zhi = labels.eq(i).find('input').val();
            newArr.push(zhi);
        }
        return newArr;
    },
    btnClick: function(key,fn){//点击事件
       var btn = $('.new'+key+'Size'),
       variant = btn.parent().parent().prev(),
          _this = this;
        btn.click(function(){
            var val = $.trim($('#new'+key+'Size').val()),
                newArr = _this.judgeArr(btn);
            if(fn(val)){
                if($.inArray(val,newArr) == -1){
                    var str = '<div class="layui-col-xs4 p06"><label>'+
                    '<input type="checkbox" name="'+key+'" value="'+val+'" checked>'+val+
                  '</label></div>';
                    variant.append(str);
                    $('#new'+key+'Size').val('');
                    $(this).attr('disabled',true);
                    $(this).addClass('layui-btn-disabled');
                }else {
                    $(this).attr('disabled',true);
                    $(this).addClass('layui-btn-disabled');
                }
                
                 
            }

        })
    },
    keyHandle: function(key,fn){//键盘下压事件
        var btn = $('#new'+key+'Size'),
           _this = this;
        btn.keyup(function(e){
            var val = $.trim($(this).val());
            if(fn(val)){
                var newArr = _this.judgeArr(btn);
                if($.inArray(val,newArr) == -1){
                    $(this).next().removeAttr('disabled');
                    $(this).next().removeClass('layui-btn-disabled');
                    if(e.keyCode == 13) {
                     $(this).next().trigger('click');
                    }   
                }  
            }else {
                $(this).next().attr('disabled',true);
                $(this).next().addClass('layui-btn-disabled');
                return false;
            }
        })
    },
    verifyVal: function(){ //正则
        var validateVolume = function(str){//容量
            var volume_format=/^(\d+(\.\d+)?)\s*(ml|l|oz\.?|m\^3|cm\^3|gallon|quart|cup|qt\.?|pt\.?|litre|liter|pint|fl\.?\s?oz\.?)s?$/gi;
            if(str.match(volume_format))return true;
            return false;
        },
        validateLength = function(str){//长度
            var length_format_1=/^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            var length_format_2=/^(\d+(\.\d+)?)\s*(ft.?|feet|\')\s*(\d+(\.\d+)?)\s*(in\.?|inche(es)?|\")$/gi;
            if(str.match(length_format_1)||str.match(length_format_2))return true;
            return false;
        },
        validateWattage = function(str){ //瓦数
            var wattage_format=/^(\d+(\.\d+)?)\s*w$/gi;
            if(str.match(wattage_format))return true;
            return false;
        },
        validateArea = function(str) { //面积或体积
            var area_format_1=/^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            var area_format_2=/^(\d+(\.\d+)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)\s*(\*|x|X|by)\s*(\d+(\.\d*)?)\s*(mm|cm|m|in\.?|inch(es)?|\"|\'|ft\.?|feet)$/gi;
            if(str.match(area_format_1)||str.match(area_format_2))return true;
            return false;
        },
        validateVoltage = function(str) { //电压
            var voltage_format=/^(\d+(\.\d+)?)\s*v$/gi;
            if(str.match(voltage_format))return true;
            return false;
        },
        validateWeight = function(str) { //重量
            var weight_format=/^(\d+(\.\d+)?)\s*(mg|g|kg|oz\.?|ounce|gram|pound|lb)s?$/gi;
            if(str.match(weight_format))return true;
            return false;
        },
        validateCustom = function(str) { //自定义
            var custom_format=/^[a-zA-Z0-9][\ ]*([a-zA-Z0-9.\-&\'\"\(\)\[\]\/][\ ]*)*$/gi;
            if(str.match(custom_format)&&str.length<=50)return true;
            return false;
        },
        validateNumber = function(str) {
           var str1 = Number(str),
            regNum = /^[1-9]\d*\.*\d*|0\.\d*[1-9]\d*$/gi;
            if(regNum.test(str1)) return true;
            return false;
        };
       var validateObj = {
            validateA:  validateArea,          //面积或体积
            validateC:  validateCustom,       //自定义
            validateL:  validateLength,      //长度
            validateN:  validateNumber,      //数字
            validateV:  validateVolume,     //容量
            validateVo: validateVoltage,  //电压
            validateW:  validateWeight,  //重量
            validateWa: validateWattage //瓦数
        };
        return validateObj;
    }
};
