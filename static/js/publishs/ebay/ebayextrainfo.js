layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'laydate','upload'], function() {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        table = layui.table,
        laydate = layui.laydate,
        upload = layui.upload;
        $ = layui.$
    form.render('select');



    laydate.render({
        elem: '#ee_time', //渲染时间
        range: true
    });
    //选择分类
    //选择分类弹框
    $('#ee_cateBtn').click(function() {
        admin.itemCat_select('layer-publishs-ebay-publish',
        'ee_cateId',
        'ee_cateDiv');
    })
    //清空按钮的点击事件
    $('#ee_reset').click(function() {
        $('#ee_cateId').val('');
        $('#ee_cateDiv').html('');
        formSelects.delete('ee_selectTortPlat', false);
    })
    //初始化table
    var table = layui.table;
    table.render({
        elem: '#ee_table'
        ,method: 'post'
        ,url: ctx + '/ebaylisting/assidata/list.html' //数据接口
        ,where:getEeSearchData()
        ,method: 'post'
        ,page: true //开启分页
        ,cols: [[ //表头
          {
            type: 'checkbox',
          },
          {field: 'mainImgUri', title: '缩略图', templet:"#ee_imageTpl", width:'4%'}
          ,{field: 'enTitle', title: '标题',width:'12%'}
          ,{title: '归属人',templet:"#ee_owner",width:'5%'} 
          ,{field: 'pSku', title: '父sku', width: '7%',
          templet:'<div><a href="javascript:;" id="prodDetail" style="color:blue" data-id="{{d.prodId}}">{{d.pSku}}</a><br>创建:{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}<br>审核:{{Format(d.auditTime,"yyyy-MM-dd hh:mm:ss")}}</div>'}
          ,{title: '侵权状态',templet:"#ee_platTortTpl",width:'10%'}
          ,{field: '', title: '禁售',templet:'#ee_phTpl',width:'10%'}
          , {
            field: 'devNote',
            title: '开发备注',
            templet:'<div><pre class="aep-devNote">{{d.devNote || ""}}</pre></div>',
            width:'10%'
          }
          , {
            field: 'ebaySaleRemark',
            title: '销售备注',
            templet:'<div><pre class="aep-devNote">{{d.ebaySaleRemark || ""}}</pre></div>',
            width:'8%'
          }
          ,{
            field: 'category',
            title: 'category',
            templet:'#ee_categoryTpl',
            width:'8%'
          }
          ,{field: 'specifics', title: 'specifics', width: '18%',
          templet:'<div>{{# if(d.specifics){ }}<pre>{{d.specifics}}</pre>{{# } }}</div>'}
          ,{field: 'opt', title: '操作', width: '5%',
          toolbar: '#ee_editBtnTpl',}
        ]],
        done: function(res, curr, count){
            $("#ee_countSpan").text(count);
            //懒加载
            imageLazyloadAll();
        }
    });
    
    function getEeSearchData(){
        var data = {};
        data.cateId = $("#ee_searchForm input[name=cateId]").val();
        //侵权状态
        data.isEbayTort = $("#ee_searchForm select[name=isEbayTort]").val();
        data.isComplete = $("#ee_searchForm select[name=isComplete]").val();
        data.siteId = $("#ee_searchForm select[name=siteId]").val();
        //日期
        var timeStr = $("#ee_searchForm input[name=time]").val();
        if(timeStr) {
            data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
            data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
            data.timeType = $("#ee_searchForm select[name=timeType]").val();
        }else{
            data.startTime = '';
            data.endTime = '';
            data.timeType = '';
        }
        data.cnTitle = "";
        data.enTitle = "";
        data.pSku = "";
        data.sSku = "";
        var searchType = $("#ee_searchForm select[name=searchType]").val();
        data[searchType] = $("#ee_searchForm input[name=searchValue]").val();
        //产品归属人
        var bizzOwnerIds = [];
        var bizzOwnerContents = formSelects.value("ee_selectMan");
        for(var i = 0; i < bizzOwnerContents.length; i++) {
            bizzOwnerIds.push(bizzOwnerContents[i].val);
        }
        data.bizzOwnerId = bizzOwnerIds.join(",");
        data.isSale = $("#ee_searchForm select[name=isSale]").val();
        data.isListingAble = $("#ee_searchForm select[name=isListingAble]").val();
        data.isCateComplete = $("#ee_searchForm select[name=isCateComplete]").val();
        data.isAspectsComplete = $("#ee_searchForm select[name=isAspectsComplete]").val();
        data.tplType = $("#ee_searchForm select[name=tplType]").val()

        return data;
    }
    $("#ee_searchBtn").click(function(){
         //执行重载
          table.reload('ee_table', {
            method: 'post',
            page: {
              curr: 1 //重新从第 1 页开始
            }
            ,where: getEeSearchData()
          });
//          table.reload('ee_table', {page: {curr: 1}, where: getEeSearchData()})
    });
    
    upload.render({ //允许上传的文件后缀
        elem: '#ee_exportBtn'
        ,url: ctx + '/ebaylisting/assidata/export.html'
        ,accept: 'file' //普通文件
        ,exts: 'xls|xlsx' //只允许上传excel文件
        ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layui.admin.load.show();
        }
        ,done: function(res){
            layui.admin.load.hide();
            layer.alert(res.msg, function(){
              //刷新页面
              table.reload('ee_table', { where: getEeSearchData() });
            });
        }
    });

    $("#ee_delBtn").click(function() {
        var checkStatus = table.checkStatus('ee_table');
        var ids = [];
        for (var i = 0; i < checkStatus.data.length; i++) {
            if(checkStatus.data[i].ebayAssiDataId){
                ids.push(checkStatus.data[i].ebayAssiDataId);
            }
        }
        if (ids.length > 0) {
            layer.confirm('删除选中的' + ids.length + '个商品补充信息', { icon: 3, title: '删除' }, function(index) {
                layui.admin.load.show(); 
                $.ajax({
                    type: "post",
                    url: ctx + "/ebaylisting/assidata/delete.html",
                    dataType: "json",
                    traditional: true,
                    data: {
                        ids: ids,
                    },
                    success: function(returnData) {
                        layui.admin.load.hide(); 
                        if (returnData.code != "0000") {
                            layer.msg(returnData.msg);
                            return;
                        }
                        layer.msg("删除成功");
                        table.reload('ee_table', { where: getEeSearchData() });
                    }
                });
                layer.close(index);
            });
        }
    });
    
    //监听工具条
    table.on('tool(ee_table-filter)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var category1 = data.category1;
        var category2 = data.category2;
        var siteName = data.siteName;
        var siteId = data.siteId;
        var specifics = data.specifics;
        var ebayAssiDataId = data.ebayAssiDataId;
        var prodId = data.prodId;
        if(layEvent === 'et_editAssiData') { //查看
            currentTitle = data.enTitle;
            layer.open({
                type: 1,
                title: 'ebay补充信息--' + siteName,
                content: $("#ee_editAssiDataTpl").html(),
                btn: ['保存', '取消'],
                area: ['70%', '90%'],
                success: function(layero,index){
                    $('#ee_editAssiDataForm input[name=siteId]').val(siteId);
                    //类目赋值
                    if(category1){
                        $("#ee_ebayCateId1").val(category1);
                        $("#ee_ebayCateId2").val(category2);
                        $("#ee_ebayCateText1").html(data.cateTreeName1);
                        $("#ee_ebayCateText2").html(data.cateTreeName2);
                    }
                    $('#ee_ebayCateSearch1').data('prodid',prodId).data('siteid',siteId)
                    $('#ee_ebayCateSearch2').data('prodid',prodId).data('siteid',siteId)
                    //ebay类目与specifics处理
                    $('#ee_ebayCateIdBtn1').click(function() {
                        admin.itemCat_select('ebayCateSelect1',
                        'ee_ebayCateId1',
                        'ee_ebayCateText1',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    });
                    $('#ee_ebayCateIdBtn2').click(function() {
                        admin.itemCat_select('ebayCateSelect2',
                        'ee_ebayCateId2',
                        'ee_ebayCateText2',
                        "/prodcate/getEbayCateList.html?siteId="+siteId,
                        "/prodcate/searchEbayCate.html?siteId="+siteId);
                    })
                    $("#ee_ebayCateText1").change(function(){
                        //根据cateId, siteId获取分类属性
                        //$(this).html($(this).text());
                        initSpecificAttr($("#ee_ebayCateId1").val(), siteId,specifics);
                    });
                    $("#ee_ebayCateText2").change(function(){
                        //$(this).html($(this).text());
                    });
                    //已选择分类
                    if($("#ee_ebayCateId1").val()){
                        initSpecificAttr($("#ee_ebayCateId1").val(), siteId,specifics);
                    //未选择分类
                    }else{
                        $.ajax({
                        	type:"post",
                        	url:ctx + "/ebaylisting/assidata/getexistspecifics.html",
                        	async:true,
                        	data:{prodId:prodId},
                        	dataType:"json",
                        	success:function(returnData){
                        	    if(returnData.code != '0000'){
                        	        layer.msg(returnData.msg);
                        	    }else{
                        	        $("#ee_ebayCateId1").val(returnData.data.category1);
                                    $("#ee_ebayCateId2").val(returnData.data.category2);
                                    $("#ee_ebayCateText1").html(returnData.data.cateTreeName1);
                                    $("#ee_ebayCateText2").html(returnData.data.cateTreeName2);
                        	        initSpecificAttr(returnData.data.category1, siteId,returnData.data.specifics);
                        	    }
                        	}
                        });
                    }
                    
                    form.render();
                },
                yes: function(index, layero) {
                    let stopNextOperatFlag=null  //跳出循环后，不执行后续的标志
                    //封装specific
                    var ebayAssiData = {};
                    ebayAssiData.id = ebayAssiDataId;
                    ebayAssiData.prodId = prodId;
                    ebayAssiData.siteId = siteId;
                    ebayAssiData.siteName = siteName;
                    ebayAssiData.category1 = $("#ee_ebayCateId1").val();
                    ebayAssiData.category2 = $("#ee_ebayCateId2").val();
                    //specifics
                    var specificsData = [];
                    var cateSpecificsDom = $("#ee_editAssiDataForm .ebayCateSpecifics .layui-card-body .layui-form-item");
                    let isMustArr = []
                    cateSpecificsDom.each(function(){
                        var attrName;
                        var attrValue;
                        let isMust = $(this).data('ismust')
                        if($(this).find("select").length>0){
                            attrName = $(this).find("select").attr("name");
                            attrValue = $(this).find("select").val();
                        }else if($(this).find("input[type=checkbox]").length>0){
                            attrName = $(this).find("input[type=checkbox]").attr("name");
                            var attrValueList = [];
                            $(this).find("input[type=checkbox]:checked").each(function(){
                                attrValueList.push($(this).val());
                            });
                            if($(this).find("input[type=text]").val()){
                                if($(this).find("input[type=text]").val().includes(':')){
                                    stopNextOperatFlag=1
                                    return false
                                }
                                attrValueList.push($(this).find("input[type=text]").val());
                            }
                            attrValue = attrValueList.join(",");
                        }else{
                            attrName = $(this).find("input[type=text]").attr("name")
                            attrValue = $(this).find("input[type=text]").val()
                            if(attrValue.includes(':')){
                                stopNextOperatFlag=1
                                return false
                            }
                        }                       
                        if(attrName && attrValue){
                            specificsData.push(attrName + ":" + attrValue);
                        }
                        if(isMust && !attrValue){
                            isMustArr.push({attrName})
                        }
                    });
                    if(isMustArr.length) return layer.msg(`请填写必填项:${isMustArr[0].attrName}`)
                    if(stopNextOperatFlag) return layer.msg('输入值不应包含 : ')
                    var customSpecificsDom = $("#ee_editAssiDataForm .ebayCustomSpecifics .layui-card-body .layui-form-item");
                    customSpecificsDom.each(function(){
                        var attrName = $(this).find("input[name=customAttrName]").val();
                        var attrValue = $(this).find("input[name=customAttrValue]").val();
                        if(attrName && attrValue){
                            if(attrValue.includes(':')) {
                                stopNextOperatFlag=1
                                return false
                            }
                            specificsData.push(attrName + ":" + attrValue);
                        }
                    });
                    if(stopNextOperatFlag) return layer.msg('输入值不应包含 : ')
                    ebayAssiData.specifics = specificsData.join("\n");
                    if(!ebayAssiData.category1) return layer.msg('请选择类目')
                    Promise.all([ebayAssiData.category1&&checkLegalCateAjax('#ee_ebayCateSearch1',ebayAssiData.category1)])
                    .then(()=>{
                        layui.admin.load.show()
                        $.ajax({
                            type:"post",
                            url: ctx + "/ebaylisting/assidata/save.html",
                            async:true,
                            data: {...ebayAssiData, isCateComplete: true, isAspectsComplete: true},
                            dataType:"json",
                            success:function(returnData){
                                layui.admin.load.hide()
                                if(returnData.code != "0000"){
                                    layer.msg(returnData.msg);
                                    return;
                                }else{
                                    layer.closeAll();
                                    layer.msg('保存成功',{icon:1})
                                    table.reload('ee_table', { where: getEeSearchData() }); 
                                }
                            }
                        });
                    }).catch(err=>{
                        let popIndex = layer.confirm(err+'<br>类目仍不完整，是否继续保存！',{btn:['保存','取消'],icon:7}, function () {
                            layui.admin.load.show()
                            $.ajax({
                                type:"post",
                                url: ctx + "/ebaylisting/assidata/save.html",
                                async:true,
                                data: {...ebayAssiData, isCateComplete: false},
                                dataType:"json",
                                success:function(returnData){
                                    layui.admin.load.hide()
                                    if(returnData.code != "0000"){
                                        layer.msg(returnData.msg);
                                        return;
                                    }else{
                                        layer.closeAll();
                                        layer.msg('保存成功',{icon:1})
                                        table.reload('ee_table', { where: getEeSearchData() }); 
                                    }
                                }
                            });
                        })
                    })
                }
            });
        }
        if (layEvent === 'et_ebay_prodProhibit'){
            var params = new Array();
            if (data.prodProhibitMappings.length > 0) {
               var elementArray =  data.prodProhibitMappings;
                //获取里面的siteId 和 是否为海外仓状态
                for (let i = 0, len = elementArray.length; i < len; i++) {
                    var tempParam = {};
                    tempParam.stockLocation = elementArray[i].stockLocation;
                    tempParam.salesSiteId = elementArray[i].salesSiteId;
                    params.push(tempParam);
                }
            }
            //加载禁售站点数据
            layer.open({
                type : 1,
                title : '设置模板禁售' ,
                offset: 'auto',
                content: $("#et_ebay_prodProhibitTpl").html(),
                btn: ['保存', '取消'],
                area: ['30%', '50%'],
                success: function (layero, index) {
                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: ctx + "/ebaylisting/getEbaySiteEnumValues.html",
                        contentType:  "application/json",
                        data: JSON.stringify(params),
                        success: function (response) {
                            if (response.code !== "0000") {
                                layer.msg(response.msg);
                                return;
                            }
                            $("#et_ebay_prod_prohibit_div").html(template('et_ebay_prodProhibitTplForm', response));
                            layui.form.render();
                        }
                    });
                },
                yes : function (index, layero) {
                    var isCancelDisable = true;
                    var array = new Array();
                    //获取所有的站点值
                    $("#et_ebay_prodProhibitForm").find("input").each(function (index, element) {
                        var obj = {};
                        obj.prodId = data.prodId;
                        obj.salesSiteId = $(element).val();
                        obj.platCode = "ebay";
                        var tempStr = element.title;
                        if (undefined != tempStr) {
                            tempStr = tempStr.split("--");
                            console.log(tempStr[0].trim());
                            obj.salesSite = tempStr[0].trim();
                        }
                        obj.ifFixedInable = element.checked;
                        if (element.checked){
                            isCancelDisable = false;
                        }
                       var  str = element.name ;
                        if (str == "domestic") {
                            obj.stockLocation = 1;
                        }
                        if (str == "overseas") {
                            obj.stockLocation = 2;
                        }
                        array.push(obj);
                    });
                    var req = {};
                    req.prodPId =  data.prodId;
                    req.prodSSku = data.pSku;
                    req.mappingList = array;
                    req.platCode = "ebay";
                    var msg ="禁售Ebay站点成功";
                    if (isCancelDisable){
                        msg = "取消Ebay站点禁售成功";
                    }
                    layui.admin.load.show();
                    $.ajax({
                        type: 'post',
                        url: ctx + '/prohibit/editOrAddProdProhibitMappingForList.html',
                        data: JSON.stringify(req),
                        contentType :"application/json" ,
                        dataType: 'json',
                        success: function (res) {
                            layui.admin.load.hide();
                            if (res.code == '0000') {
                                layer.msg(msg, {icon:1});
                                layer.close(index);
                                table.reload('ee_table', { where: getEeSearchData() });
                            } else {
                                layer.msg(res.msg, {icon: 5});
                            }
                        }
                    })
                }
            });
        }
    });
    
    function initSpecificAttr(ebayCateId, siteId,specifics){
        if(!ebayCateId){
            return;
        }
        layui.admin.load.show();
        $.ajax({
        	type:"post",
        	url:ctx+"/ebaylisting/assidata/listebaycatespecifics.html",
        	async:true,
        	dataType:"json",
        	data:{
        	    cateId:ebayCateId,
        	    siteId:siteId
        	},
        	success:function(returnData){
        	    layui.admin.load.hide()
        	    if(returnData.code != "0000"){
        	        layer.msg(returnData.msg);
        	        return;
        	    }
        	    var attrList = returnData.data;
        	    $("#ee_editAssiDataForm .ebayCateSpecifics .layui-card-body").empty();
        	    for(var i=0; i<attrList.length; i++){
        	        //单选可输入
        	        var inputTpl = '<div class="layui-form-item" data-ismust=":isMust">'
        	                    + '<label class="layui-form-label">:attrName</label>'
                                + '<div class="layui-input-inline dropdown-datalist">'
                                + '<input type="text" class="layui-input" name=":attrName">'
                                + '<ul>'
                                + ':optionList'
                                + '</ul>'
                                + '</div>'
                                + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                                + '</div>';
                    //单选不可输入
                    var selectTpl = '<div class="layui-form-item" data-ismust=":isMust">'
                            + '<label class="layui-form-label">:attrName</label>'
                            + '<div class="layui-input-inline">'
                            + '    <select name=":attrName">'
                            +    ':optionList'
                            + '    </select>'
                            + '</div>'
                            +'<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>';
                    //多选可输入
                    var muliSelectTpl = '<div class="layui-form-item" data-ismust=":isMust">'
                            +'<label class="layui-form-label">:attrName</label>'
                            +'<div class="layui-input-block">'
                            +'  :inputList'
                            +'  <div class="layui-input-inline" style="float: none;margin-top: 3px;">'
                            +'      <input type="text" name=":attrName" class="layui-input" placeholder="自定义属性">'
                            +'  </div>'
                            +'<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            +'</div>'
                            +'</div>';
                    //多选不可输入
                    var muliSelectOnlyTpl = '<div class="layui-form-item" data-ismust=":isMust">'
                            +'<label class="layui-form-label">:attrName</label>'
                            +'<div class="layui-input-block">'
                            +'  :inputList'
                            +'<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            +'</div>'
                            +'</div>';
        	        var attr = attrList[i];
        	        var dom = "";
        	        var isMulti = attr.itemToAspectCardinality=="MULTI";
                    var isMust = attr.isVariMustAttr==1;
                    var description = "";
                    if(isMust){
                        description += "必填";
                    }
                    if(isMulti){
                        description += "多选";
                    }
        	        if(isMulti){
        	            if(attr.aspectMode == 'FREE_TEXT'){
        	                //多选可填写
        	                dom = muliSelectTpl;
        	            }else{
        	                //多选不可填
        	                dom = muliSelectOnlyTpl;
        	            }
        	            var inputList = '';
                        attr.attrValList.split("#|").forEach(function(attrVal){
                            inputList += '<input type="checkbox" name=":attrName" value="'+attrVal+'"  lay-skin="primary" title="'+attrVal+'">';
                        });
                        dom = dom.replace(":inputList", inputList);
        	        }else{
        	            if(attr.aspectMode == 'FREE_TEXT'){
        	                //单选可填写
                            dom = inputTpl;
                            let optionList = '';
                            attr.attrValList.split("#|").forEach(function(attrVal) {
                            if(attrVal.trim() != ''){
                                optionList += '<li>' + attrVal + '</li>';
                            }
                            });
                            dom = dom.replace(":optionList", optionList);
                        }else{
                            //单选不可填写
                            dom = selectTpl;
                            let optionList = '<option value="">请选择</option>';
                            attr.attrValList.split("#|").forEach(function(attrVal){
                                optionList += '<option value="'+attrVal+'">'+attrVal+'</option>';
                            });
                            dom = dom.replace(":optionList", optionList);
                        }
        	        }
        	        dom = dom.replace(":description", description);
                    dom = dom.replace(/:attrName/g, attr.attrName);
                    dom = dom.replace(":isMust", isMust);
                    
        	        $("#ee_editAssiDataForm .ebayCateSpecifics .layui-card-body").append(dom);
        	    }
        	    
        	    //清除自定义属性
                $("#ee_editAssiDataForm .ebayCustomSpecifics .layui-card-body").empty();
                //specifics赋值
                var attr = getSpecifics(specifics);
                for(var attrName in attr){
                    var attrValue = attr[attrName];
                    var attrDom = $("#ee_editAssiDataForm .ebayCateSpecifics").find("input[name='"+attrName+"']");
                    if(attrDom.length>1){
                        //多选checkbox处理
                        var selfVals = [];
                        attrValue.split(',').forEach(function(v){
                            var dom = $("#ee_editAssiDataForm .ebayCateSpecifics")
                            .find("input[name='"+attrName+"'][value='"+v+"']");
                            if(dom.length>0){
                                dom.prop("checked", true);
                            }else{
                                selfVals.push(v);
                            }
                        });
                        //自定义属性
                        $("#ee_editAssiDataForm .ebayCateSpecifics")
                            .find("input[name='"+attrName+"'][type=text]").val(selfVals.join(","));
                    }else if(attrDom.length==1){
                         //input text处理
                        $("#ee_editAssiDataForm .ebayCateSpecifics")
                            .find("input[name='"+attrName+"'][type=text]").val(attrValue);
                    }else{
                        //select处理
                        attrDom = $("#ee_editAssiDataForm .ebayCateSpecifics").find("select[name='"+attrName+"']");
                        if(attrDom.length>0){
                            attrDom.val(attrValue);
                        }else{
                            //自定义属性
                            addCustomAttr(attrName, attrValue);
                        }
                        
                    }
                }
                form.render();
                const dropdowns = document.querySelectorAll(".dropdown-datalist");
                dropdowns.forEach((dropdown) => {
                    new Dropdown(dropdown);
                });
        	}
        });
        
    }
    function getSpecifics(specificsStr){
        var attr = {};
        if(specificsStr){
            specificsStr.split("\n").forEach(function(v){
                if (v.includes('::')) {
                    attr[v.split("::")[0]] = v.split("::")[1];
                } else {
                    attr[v.split(":")[0]] = v.split(":")[1];
                }
            });
        }
        return attr;
    }
    function addCustomAttr(attrName, attrValue){
        var tpl = '<div class="layui-form-item">'
                   +'         <label class="layui-form-label"></label>'
                   +'         <div class="layui-inline">'
                   +'             <div class="layui-input-inline">'
                   +'                 <input type="text" name="customAttrName" value=":attrName" placeholder="自定义属性名称" autocomplete="off" class="layui-input">'
                   +'             </div>'
                   +'             <div class="layui-form-mid">-</div>'
                   +'             <div class="layui-input-inline">'
                   +'                 <input type="text" name="customAttrValue" value=":attrValue" placeholder="自定义属性值" autocomplete="off" class="layui-input">'
                   +'             </div>'
                   +'             <div class="layui-input-inline">'
                   +'                <span id="ee_removeCustomAttr" style="cursor: pointer;color: #73a1bf;height: 100%;vertical-align: -webkit-baseline-middle;">移除</span>'
                   +'             </div>'
                   +'         </div>'
                   +'    </div>';
        if(attrName && attrValue){
            tpl = tpl.replace(":attrName", attrName);
            tpl = tpl.replace(":attrValue", attrValue);
        }else{
            tpl = tpl.replace(":attrName", "");
            tpl = tpl.replace(":attrValue", "");
        }
        $("#ee_editAssiDataForm .ebayCustomSpecifics .layui-card-body").append(tpl);
    }
    $("body").on("click", "#ee_addCustomAttr", function(){
        addCustomAttr();
    });
    $("body").on("click", "#ee_removeCustomAttr", function(){
        $(this).parents(".layui-form-item").remove();
    });
    var currentTitle = "";
    //查询分类
    $("body").on("click","#ee_ebayCateSearch1,#ee_ebayCateSearch2",function(){
        var sourceDom = $(this);
        layer.open({
            type: 1,
            title: '搜索ebay分类',
            content: $("#ee_ebayCateSearchTpl").html(),
            area: ['65%', '60%'],
            success: function(layero,index){
                //搜索事件
                $(layero).find("input[name=sourceBtnId]").val(sourceDom.attr("id"));
                $(layero).find("button").click(function(){
                    var title = $(layero).find("input[name='title']").val();
                    var siteId = $('#ee_editAssiDataForm input[name=siteId]').val();
                    table.render({
                        elem: '#ee_ebayCateSearchTable'
                        ,method: 'post'
                        ,url: ctx + '/ebaylisting/assidata/seatchebaycategroy.html' //数据接口
                        ,where:{
                            title:title,
                            siteId:siteId
                        }
                        ,method: 'post'
                        ,page: false
                        ,cols: [[ //表头
                          {field: 'id', title: 'ID',width:'10%'},
                          {field: 'categoryName', title: '类目',width:'80%'},
                          {field: 'percentItem', title: '操作', width: '10%',
                          templet:'<div>{{d.percentItem}}% <a data-id="{{d.id}}" class="selectCategory" href="javascript:;" style="color:blue">选择</a></div>'}
                        ]]
                        ,done: function(res){
                            $(layero).find(".selectCategory").click(function(){
                                var sourceBtnId = $(layero).find("input[name=sourceBtnId]").val();
                                const cateId = $(this).data("id")
                                commonReturnPromise({
                                    url:'/lms/ebaylisting/assidata/checkLegalCate',
                                    contentType:'application/json',
                                    type: 'POST',
                                    params:JSON.stringify({
                                        prodId: sourceDom.data('prodid'),
                                        cateId: cateId,
                                        siteId:sourceDom.data('siteid')
                                    })
                                }).then(res=>{
                                    let curBtnIndex = sourceBtnId === "ee_ebayCateSearch1" ? 1 : 2
                                    $("#ee_ebayCateId"+curBtnIndex).val(cateId);
                                    $("#ee_ebayCateText"+curBtnIndex).html($(this).parents("tr").find("td[data-field=categoryName] div").html());
                                    $("#ee_ebayCateText"+curBtnIndex).trigger('change');
                                    layer.close(index);
                                })
                            });
                        }
                    });
                });
                //如果currentTitle有值，默认搜索
                if(currentTitle && currentTitle.length>5){
                  $(layero).find("input[name='title']").val(currentTitle);
                  $(layero).find("button").trigger("click");
                }
            },
        });
    });

    function checkLegalCateAjax(sourceDom,cateId){
        var sourceDom = $(sourceDom)
        return commonReturnPromise({
            url:'/lms/ebaylisting/assidata/checkLegalCate',
            contentType:'application/json',
            type: 'POST',
            params:JSON.stringify({
                prodId: sourceDom.data('prodid'),
                cateId: cateId,
                siteId:sourceDom.data('siteid')
            })
        })
    }

    //刷新类目
    $("body").on("click","#ee_ebayCateRefresh",function(){
        //判断是否选择了id
        let ebayCateId = $("#ee_ebayCateId1").val();
        let siteId = $("#ee_searchForm select[name=siteId]").val();
        if(ebayCateId){
            layer.msg("开始同步类目specifics规则",{icon:1});
            layui.admin.load.show();
            $.ajax({
                type: "post",
                url: ctx + "/ebaylisting/assidata/syncebaycatespecifcs.html",
                data: {
                    siteId: siteId,
                    cateId: ebayCateId
                },
                dataType: "json",
                success: function(returnData) {
                    layui.admin.load.hide();
                    if (returnData.code != "0000") {
                        layer.msg(returnData.msg, { icon: 2 });
                    } else {
                        //触发事件
                        $("#ee_ebayCateText1").trigger('change');
                    }
                },
                error: function(XMLHttpRequest) {
                    layui.admin.load.hide();
                    if (XMLHttpRequest.status == 200) {
                        layer.msg("请重新登录", { icon: 7 });
                    } else {
                        layer.msg("服务器错误");
                    }
                }
            });
        }else{
            layer.msg("未选择类目",{icon:7});
        }
    });

    
    
})
function showProhibitReason(tip,self) {
    var layer = layui.layer;
    if ("undefined" == tip){
        tip = "";
    }
    var index = layer.tips(tip,self,{tips: [1, 'orange']})
    $(self).attr('data-tipId',index)
}
function removeTip(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}