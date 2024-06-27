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
        elem: '#shopeeExtraInfoTime', //渲染时间
        range: true
    });

    laydate.render({
        elem: '#ee_time', //渲染时间
        range: true
    });
    //选择分类
    //选择分类弹框
    $('#shopee_cateBtn').click(function() {
        admin.itemCat_select('layer-publishs-shopee-publish',
        'shopee_cateId',
        'shopee_cateDiv');
    })
    //清空按钮的点击事件
    $('#shopee_reset').click(function() {
        $('#shopee_cateId').val('');
        $('#shopee_cateDiv').html('');
        formSelects.delete('shopee_selectTortPlat', false);
    })
    //初始化table
    var table = layui.table;
    function shopeextrainfo_tableRender(data){
        table.render({
            elem: '#shopee_table'
            , url: ctx + '/shopee/shopeeExtraInfo/list.html'
            , where: data
            , method: 'post' 
            , page: true //开启分页shopee_categoryTpl
            , cols: [[ //表头
                {
                    type: 'checkbox',
                },
                {field: 'mainImgUri', title: '缩略图', templet: "#ee_imageTpl", width: '4%'}
                , {field: 'enTitle', title: '标题', width: '9%', templet: "#ebay_enTitle"}
                , {title: '归属人', templet: "#ee_owner", width: '4%'}
                , {
                    field: 'pSku', title: '父sku', width: '5%',
                    templet: '<div><a href="javascript:;" id="prodDetail" style="color:blue" data-id="{{d.prodId}}">{{d.pSku}}</div>'
                }
                , {title: '侵权状态', templet: "#shopee_platTortTpl", width: '10%'}
                , {field: '', title: '禁售', templet: '#shopee_phTpl', width: '8%'}
                , {
                    field: 'devNote',
                    title: '开发备注',
                    templet: '<div><pre class="aep-devNote">{{d.devNote || ""}}</pre></div>',
                    width: '7%'
                }
                , {
                    field: 'ebaySaleRemark',
                    title: '销售备注',
                    templet: '<div><pre class="aep-devNote">{{d.ebaySaleRemark || ""}}</pre></div>',
                    width: '7%'
                }
                , {
                    field: 'categoryId',
                    title: 'categoryId',
                    width: '7%'
                }
                , {
                    field: 'fullCateNameTrans',
                    title: 'category',
                    width: '7%'
                }
                , {
                    field: 'specifics', title: 'specifics', width: '9%',
                    templet: '<div>{{# if(d.specifics){ }}<pre>{{d.specifics}}</pre>{{# } }}</div>'
                }
                , {field: 'creator', title: '创建人', templet: '#shopee_createrAndmodifier_tpl'}
                , {field: 'time', title: '时间', templet: '#shopee_createTime_tpl'}
                , {field: 'opt', title: '操作', toolbar: '#shopee_editBtnTpl', width: 80}
            ]],
            limits: [200, 300, 500],
            limit: 300,
            done: function (res, curr, count) {
                $("#shopee_countSpan").text(count);
                //懒加载
                imageLazyloadAll();
            }
        });
    }

    function getEeSearchData(){
        var data = {};
        data.cateId = $("#shopee_searchForm input[name=cateId]").val();
        //侵权状态
        data.isShopeeTort = $("#shopee_searchForm select[name=isShopeeTort]").val();
        data.completeStatus = $("#shopee_searchForm select[name=completeStatus]").val();
        data.salesSite = $("#shopee_searchForm select[name=salesSite]").val();
        //日期
        var timeStr = $("#shopee_searchForm input[name=time]").val();
        if(timeStr) {
            data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
            data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
            data.timeType = $("#shopee_searchForm select[name=timeType]").val();
        }else{
            data.startTime = '';
            data.endTime = '';
            data.timeType = '';
        }
        //补充信息操作日期
        var infoTimeStr = $("#shopee_searchForm input[name=infoTime]").val();
        if(infoTimeStr) {
            data.infoStartTime = Date.parse(infoTimeStr.split(" - ")[0] + " 00:00:00");
            data.infoEndTime = Date.parse(infoTimeStr.split(" - ")[1] + " 23:59:59");
            data.infoTimeType = $("#shopee_searchForm select[name=infoTimeType]").val();
        }else{
            data.infoStartTime = '';
            data.infoEndTime = '';
            data.infoTimeType = '';
        }
        data.cnTitle = "";
        data.enTitle = "";
        data.pSku = "";
        data.sSku = "";
        var searchType = $("#shopee_searchForm select[name=searchType]").val();
        data[searchType] = $("#shopee_searchForm input[name=searchValue]").val();
        data.creatorId = "";
        data.modifierId = "";
        var operatorSearchType = $("#shopee_searchForm select[name=operatorSearchType]").val();
        data[operatorSearchType] = $("#shopee_searchForm select[name=operatorSearchValue]").val();
        //产品归属人
        var bizzOwnerIds = [];
        var bizzOwnerContents = formSelects.value("shopee_selectMan");
        for(var i = 0; i < bizzOwnerContents.length; i++) {
            bizzOwnerIds.push(bizzOwnerContents[i].val);
        }
        data.bizzOwnerIds = bizzOwnerIds.join(",");
        data.isSale = $("#shopee_searchForm select[name=isSale]").val();
        data.isListingAble = $("#shopee_searchForm select[name=isListingAble]").val();
        data.shopeeCategoryId = $("#shopee_searchForm input[name=shopeeCategoryId]").val();
        data.shopeeCategoryName = $("#shopee_searchForm input[name=shopeeCategoryName]").val();
        return data;
    }
    $("#shopee_searchBtn").click(function(){
        var shopeeextrain_formdata = getEeSearchData();
        shopeextrainfo_tableRender(shopeeextrain_formdata)
         //执行重载
        //   table.reload('shopee_table', {
        //     method: 'post',
        //     page: {
        //       curr: 1 //重新从第 1 页开始
        //     }
        //     ,where: getEeSearchData()
        //   });
//          table.reload('shopee_table', {page: {curr: 1}, where: getEeSearchData()})
    });

    $("#shopee_batchUpdateBtn").click(function() {
        var cateId = $("#shopee_searchForm input[name=cateId]").val();
        var salesSite = $("#shopee_searchForm select[name=salesSite]").val();
        var checkStatus = table.checkStatus('shopee_table');
        var ids = [];
        var shopeeAssiDatas = [];
        for (var i = 0; i < checkStatus.data.length; i++) {
            var shopeeAssiData = {};
            if(checkStatus.data[i].id) {
                shopeeAssiData.id = checkStatus.data[i].id;
            }else{
                shopeeAssiData.id = null;
            }
            shopeeAssiData.prodId = checkStatus.data[i].prodId;
            shopeeAssiData.salesSite = salesSite;
            shopeeAssiData.categoryId = $("#shopee_cateId1").val();
            shopeeAssiDatas.push(shopeeAssiData);
            if(checkStatus.data[i].id){
                ids.push(checkStatus.data[i].id);
            }
        }
        if (shopeeAssiDatas.length > 0) {
            layer.open({
                type: 1,
                title: 'shopee补充信息--' + salesSite,
                content: $("#shopee_editAssiDataTpl").html(),
                btn: ['保存', '取消'],
                area: ['60%', '80%'],
                success: function(layero,index){
                    $('#shopee_editAssiDataForm input[name=salesSite]').val(salesSite);
                    //shopee类目树
                    $(layero).find('#shopee_cateIdBtn1').click(function() {
                        if(salesSite) {
                            // admin.itemCat_select('shopee_cateSelEvent',
                            //     'shopee_cateId1',
                            //     'shopee_cateText1',
                            //     "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                            //     "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite
                            // );
                            shopeeExtrainInfoChooseCate('shopee_cateSelEvent',
                                'shopee_cateId1',
                                'shopee_cateText1',
                                "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                                "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite)
                        }else{
                            layer.msg("必须选择站点");
                        }
                    });
                    $("#shopee_cateText1").change(function(){
                        //根据cateId, salesSite获取分类属性
                        //$(this).html($(this).text());
                        initSpecificAttr($("#shopee_cateId1").val(), salesSite,null);
                    });
                    $(layero).find('#shopee_cateSearch1').click(function(){
                        var sourceDom = $(this);
                        layer.open({
                            type: 1,
                            title: '搜索shopee分类',
                            content: $("#shopee_cateSearchTpl").html(),
                            area: ['65%', '60%'],
                            id: 'shopee_cateSearch1_id',
                            success: function(layero,index){
                                //搜索事件
                                $(layero).find("input[name=sourceBtnId]").val(sourceDom.attr("id"));
                                $(layero).find("button").click(function(){
                                    var searchKey = $(layero).find("input[name='title']").val();
                                    var salesSite = $('#shopee_editAssiDataForm input[name=salesSite]').val();
                                    table.render({
                                        elem: '#shopee_cateSearchTable'
                                        ,method: 'post'
                                        ,url: ctx + '/shopee/shopeeExtraInfo/searchShopeeCate.html' //数据接口
                                        ,where:{
                                            searchKey:searchKey,
                                            salesSite:salesSite
                                        }
                                        ,method: 'post'
                                        ,page: false
                                        ,cols: [[ //表头
                                          {field: 'categoryId', title: '类目ID',width:'10%'},
                                          {field: 'fullCateNameTrans', title: '类目',width:'80%'},
                                          {field: 'categoryNameTrans', title: '类目',width:'80%'},
                                          {field: '', title: '操作', width: '10%',
                                          templet:'<div><a data-id="{{d.categoryId}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'}
                                        ]]
                                        ,done: function(res){
                                            $("[data-field='categoryNameTrans']").css('display','none');
                                            $(layero).find(".selectCategory").click(function(){
                                                var sourceBtnId = $(layero).find("input[name=sourceBtnId]").val();
                                                if(sourceBtnId == "shopee_cateSearch1"){
                                                    $("#shopee_cateId1").val($(this).data("id"));
                                                    // 现在又要显示全路径
                                                    $("#shopee_cateText1").html($(this).parents("tr").find("td[data-field=fullCateNameTrans] div").html());
                                                    // $("#shopee_cateText1").html($(this).data("id") +"  "+$(this).parents("tr").find("td[data-field=categoryNameTrans] div").html());
                                                    $("#shopee_cateText1").trigger('change');
                                                }
                                                layer.close(index);
                                            });
                                        }
                                    });
                                });
                                //如果currentTitle有值，默认搜索
                                if(currentTitle /*&& currentTitle.length>5*/){
                                  $(layero).find("input[name='title']").val(currentTitle);
                                  $(layero).find("button").trigger("click");
                                }
                            }
                        });
                    });
                    form.render();
                },
                yes: function(index, layero) {
                    for (var i = 0; i < shopeeAssiDatas.length; i++) {
                        //specifics
                        var specificsData = [];
                        var cateSpecificsDom = $("#shopee_editAssiDataForm .shopeeCateSpecifics .layui-card-body .layui-form-item");
                        cateSpecificsDom.each(function () {
                            var attrName;
                            var attrValue;
                            if ($(this).find("select").length > 0) {
                                attrName = $(this).find("select").attr("name");
                                attrValue = $(this).find("select").val();
                            } else if ($(this).find("input[type=checkbox]").length > 0) {
                                attrName = $(this).find("input[type=checkbox]").attr("name");
                                var attrValueList = [];
                                $(this).find("input[type=checkbox]:checked").each(function () {
                                    attrValueList.push($(this).val());
                                });
                                if ($(this).find("input[type=text]").val()) {
                                    attrValueList.push($(this).find("input[type=text]").val());
                                }
                                attrValue = attrValueList.join(",");
                            } else {
                                attrName = $(this).find("input[type=text]").attr("name")
                                attrValue = $(this).find("input[type=text]").val()
                            }
                            if (attrName && attrValue) {
                                specificsData.push(attrName + ":" + attrValue);
                            }
                        });
                        // shopeeAssiData.specifics = specificsData.join("\n");
                        shopeeAssiDatas[i].specifics = specificsData.join("\n");
                        shopeeAssiDatas[i].categoryId = $("#shopee_cateId1").val();
                    }
                    layui.admin.load.show()
                    $.ajax({
                        type:"post",
                        url: ctx + "/shopee/shopeeExtraInfo/batchSave.html",
                        async:true,
                        traditional: true,
                        data:{
                            shopeeAssiDatas:JSON.stringify(shopeeAssiDatas),
                        },
                        dataType:"json",
                        success:function(returnData){
                            layui.admin.load.hide()
                            if(returnData.code != "0000"){
                                layer.msg(returnData.msg);
                                return;
                            }else{
                                layer.close(index);
                                // table.reload('shopee_table', { where: getEeSearchData() });
                                shopeextrainfo_tableRender(getEeSearchData())
                            }
                        }
                    });
                }
            });
        }else{
            layer.msg("请至少选择1条数据");
            return;
        }
    });
    
    $("#shopee_delBtn").click(function() {
        var checkStatus = table.checkStatus('shopee_table');
        var ids = [];
        for (var i = 0; i < checkStatus.data.length; i++) {
            if(checkStatus.data[i].id){
                ids.push(checkStatus.data[i].id);
            }
        }
        if (ids.length > 0) {
            layer.confirm('删除选中的' + ids.length + '个商品补充信息', { icon: 3, title: '删除' }, function(index) {
                layui.admin.load.show(); 
                $.ajax({
                    type: "post",
                    url: ctx + "/shopee/shopeeExtraInfo/delete.html",
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
                        // table.reload('shopee_table', { where: getEeSearchData() });
                        shopeextrainfo_tableRender(getEeSearchData());
                    }
                });
                layer.close(index);
            });
        }
    });

    function shopeeExtrainInfoChooseCate(id, inputId, divId, cateUrl, cateSearchUrl, func) { //查询类目
        admin.itemCat_select(id, inputId, divId, cateUrl, cateSearchUrl,
            function (callback, conf) {
                if (func) {
                    func(callback, conf)
                } else {
                    $('#'+divId).text(conf.replace(/\([^\)]*\)/g,""))
                }
            })
    }
    
    //监听工具条
    table.on('tool(shopee_table-filter)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var category1 = data.categoryId;
        // var categoryNameTrans = data.categoryNameTrans;
        let fullCateNameTrans = data.fullCateNameTrans;
        var siteName = data.siteName;
        var salesSite = data.salesSite;
        var specifics = data.specifics;
        var id = data.id;
        var prodId = data.prodId;
        if(layEvent === 'et_editAssiData') { //修改||添加
            currentTitle = data.keyword;
            layer.open({
                type: 1,
                title: 'shopee补充信息--' + siteName,
                content: $("#shopee_editAssiDataTpl").html(),
                btn: ['保存', '取消'],
                area: ['70%', '90%'],
                success: function(layero,index){
                    $('#shopee_editAssiDataForm input[name=salesSite]').val(salesSite);
                    //类目赋值
                    if(category1){
                        $("#shopee_cateId1").val(category1);
                        // $("#shopee_cateText1").html(category1+"  "+categoryNameTrans);
                        // 现在又要显示全路径
                        $("#shopee_cateText1").html(fullCateNameTrans);
                    }
                    //shopee类目与specifics处理
                    $(layero).find('#shopee_cateIdBtn1').click(function() {
                        if(salesSite) {
                            shopeeExtrainInfoChooseCate('shopee_cateSelEvent',
                                'shopee_cateId1',
                                'shopee_cateText1',
                                "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                                "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite)
                            // admin.itemCat_select('shopee_cateSelEvent',
                            //     'shopee_cateId1',
                            //     'shopee_cateText1',
                            //     "/shopee/shopeeCate/getShopeeCateList.html?siteId=" + salesSite,
                            //     "/shopee/shopeeCate/searchShopeeCate.html?siteId=" + salesSite
                            // );
                        }else{
                            layer.msg("必须选择站点");
                        }
                    });
                    $(layero).find('#shopee_cateSearch1').click(function(){
                        var sourceDom = $(this);
                        layer.open({
                            type: 1,
                            title: '搜索shopee分类',
                            content: $("#shopee_cateSearchTpl").html(),
                            area: ['65%', '60%'],
                            success: function(layero,index){
                                //搜索事件
                                $(layero).find("input[name=sourceBtnId]").val(sourceDom.attr("id"));
                                $(layero).find("input[name='title']").focus();
                                $(layero).find("button").click(function(){
                                    var searchKey = $(layero).find("input[name='title']").val();
                                    var salesSite = $('#shopee_editAssiDataForm input[name=salesSite]').val();
                                    table.render({
                                        elem: '#shopee_cateSearchTable'
                                        ,method: 'post'
                                        ,url: ctx + '/shopee/shopeeExtraInfo/searchShopeeCate.html' //数据接口
                                        ,where:{
                                            searchKey:searchKey,
                                            salesSite:salesSite
                                        }
                                        ,method: 'post'
                                        ,page: false
                                        ,cols: [[ //表头
                                          {field: 'categoryId', title: '类目ID',width:'10%'},
                                          {field: 'fullCateNameTrans', title: '类目',width:'80%'},
                                          {field: 'categoryNameTrans'},
                                          {field: '', title: '操作', width: '10%',
                                          templet:'<div><a data-id="{{d.categoryId}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'}
                                        ]]
                                        ,done: function(res){
                                            $("[data-field='categoryNameTrans']").css('display','none');
                                            $(layero).find(".selectCategory").click(function(){
                                                var sourceBtnId = $(layero).find("input[name=sourceBtnId]").val();
                                                if(sourceBtnId == "shopee_cateSearch1"){
                                                    $("#shopee_cateId1").val($(this).data("id"));
                                                    // 现在又要显示全路径
                                                    $("#shopee_cateText1").html($(this).parents("tr").find("td[data-field=fullCateNameTrans] div").html());
                                                    // $("#shopee_cateText1").html($(this).data("id") +"  "+$(this).parents("tr").find("td[data-field=categoryNameTrans] div").html());
                                                    $("#shopee_cateText1").trigger('change');
                                                }
                                                layer.close(index);
                                            });
                                        }
                                    });
                                });
                                //如果currentTitle有值，默认搜索
                                if(currentTitle){
                                  $(layero).find("input[name='title']").val(currentTitle);
                                  $(layero).find("button").trigger("click");
                                }
                                $(layero).find("input[name='title']").on('keypress', function(e){
                                    $(layero).find("button").trigger('click');
                                    e.preventDefault();
                                    e.stopPropagation();
                                })
                            },
                        });
                    });
                    $("#shopee_cateText1").change(function(){
                        //根据cateId, salesSite获取分类属性
                        //$(this).html($(this).text());
                        initSpecificAttr($("#shopee_cateId1").val(), salesSite,specifics);
                    });
                    //已选择分类
                    if($("#shopee_cateId1").val()){
                        initSpecificAttr($("#shopee_cateId1").val(), salesSite,specifics);
                    //未选择分类
                    }else{
                        $.ajax({
                        	type:"post",
                        	url:ctx + "/shopee/shopeeExtraInfo/getExistSpecifics.html",
                        	async:true,
                        	data:{prodId:prodId,salesSite:salesSite},
                        	dataType:"json",
                        	success:function(returnData){
                        	    if(returnData.code != '0000'){
                        	        layer.msg(returnData.msg);
                        	    }else{
                        	        if(returnData.data !=null){
                                        $("#shopee_cateId1").val(returnData.data.categoryId);
                                        // 现在又要显示全路径
                                        $("#shopee_cateText1").html(returnData.data.fullCateNameTrans);
                                        initSpecificAttr(returnData.data.categoryId, salesSite,null);
                                    }
                        	    }
                        	}
                        });
                    }
                    
                    form.render();
                },
                yes: function(index, layero) {
                    //封装specific
                    var shopeeAssiData = {};
                    shopeeAssiData.id = id;
                    shopeeAssiData.prodId = prodId;
                    shopeeAssiData.salesSite = salesSite;
                    // shopeeAssiData.siteName = siteName;
                    shopeeAssiData.categoryId = $("#shopee_cateId1").val();
                    //specifics
                    var specificsData = [];
                    var cateSpecificsDom = $("#shopee_editAssiDataForm .shopeeCateSpecifics .layui-card-body .layui-form-item");
                    cateSpecificsDom.each(function(){
                        var attrName;
                        var attrValue;
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
                                attrValueList.push($(this).find("input[type=text]").val());
                            }
                            attrValue = attrValueList.join(",");
                        }else{
                            attrName = $(this).find("input[type=text]").attr("name")
                            attrValue = $(this).find("input[type=text]").val()
                        }
                        if(attrName && attrValue){
                            specificsData.push(attrName + ":" + attrValue);
                        }
                    });
                    shopeeAssiData.specifics = specificsData.join("\n");
                    layui.admin.load.show()
                    $.ajax({
                    	type:"post",
                    	url: ctx + "/shopee/shopeeExtraInfo/save.html",
                    	async:true,
                    	data:shopeeAssiData,
                    	dataType:"json",
                    	success:function(returnData){
                    	    layui.admin.load.hide()
                    	    if(returnData.code != "0000"){
                                layer.msg(returnData.msg);
                                return;
                            }else{
                                layer.close(index);
                                // table.reload('shopee_table', { where: getEeSearchData() });
                                shopeextrainfo_tableRender(getEeSearchData())
                            }
                    	}
                    });
                }
            });
        }
    });
    
    function initSpecificAttr(cateId, salesSite,specifics){
        if(!cateId){
            return;
        }
        layui.admin.load.show();
        $.ajax({
        	type:"post",
        	url:ctx+"/shopee/shopeeExtraInfo/listShopeeCateSpecifics.html",
        	async:true,
        	dataType:"json",
        	data:{
        	    cateId:cateId,
                salesSite:salesSite
        	},
        	success:function(returnData){
        	    layui.admin.load.hide()
        	    if(returnData.code != "0000"){
        	        layer.msg(returnData.msg);
        	        return;
        	    }
        	    var attrList = returnData.data;
        	    $("#shopee_editAssiDataForm .shopeeCateSpecifics .layui-card-body").empty();
        	    let TransObj = {};
                if (attrList&&attrList.length > 0) {
                    for (var i = 0; i < attrList.length; i++) {
                        //DROP_DOWN => select
                        var selectTpl = '<div class="layui-form-item">'
                            + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                            + '<div class="layui-input-inline">'
                            + '    <select name=":attrName" lay-verify=":isMandatory">'
                            + ':optionList'
                            + '    </select>'
                            + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>'
                            + '</div>';
                        // //COMBO_BOX
                        // var comboBoxTpl = '<div class="layui-form-item">'
                        //     + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                        //     + '<div class="layui-input-block">'
                        //     + '    <select name=":attrName" lay-verify=":isMandatory" lay-search>'
                        //     + ':inputList'
                        //     + '    </select>'
                        //     + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                        //     + '</div>'
                        //     + '</div>';
                    //COMBO_BOX => 自定义下拉框
        	        var comboBoxTpl = '<div class="layui-form-item">'
                    + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                    + '<div class="layui-input-inline">'
                    + '<input type="text" class="layui-input" name=":attrName" list=":attrNameList">'
                    + '<datalist id=":attrNameList">'
                    +    ':inputList'
                    + '</datalist>'
                    + '</div>'
                    +'<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                    + '</div>';

                        //TEXT_FILED
                        var inputTpl = '<div class="layui-form-item">'
                            + '<label class="layui-form-label">:needTips:attrNameTrans</label>'
                            + '<div class="layui-input-block">'
                            + '  <input name=":attrName" type=":attrType" value=":attrValue" class="canChangeInput layui-input" lay-verify=":isMandatory:isInteger">'
                            + '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>'
                            + '</div>'
                            + '</div>';

                        var description = "";
                        var dom = ""; //展示元素
                        var isMandatory = attrList[i].isMandatory,
                            attributeName = attrList[i].attributeName,
                            attributeNameTrans = attrList[i].attributeNameTrans,
                            attributeType = attrList[i].attributeType,
                            attributeId = attrList[i].attributeId,
                            inputType = attrList[i].inputType,
                            options = attrList[i].options,
                            optionsTrans = attrList[i].optionsTrans,
                            attributeValue = attrList[i].attributeValue;
                        var opTransMap = new Map();
                        if (options && optionsTrans) {//构建一个翻译map
                            var optionArry = options.split("#,#");
                            var optionTransArry = optionsTrans.split("#,#");
                            for (var ix = 0; ix < optionArry.length; ix++) {
                                opTransMap.set(optionArry[ix], optionTransArry[ix]);
                            }
                        }

                        if (inputType == 'COMBO_BOX') {
                            dom = comboBoxTpl;
                            var inputList = '<option value="">请选择</option>';
                            options.split("#,#").forEach(function (attrVal) {

                                var attrValTrans = opTransMap.get(attrVal);
                                if (attrValTrans) {
                                    attrValTrans += '(' + attrVal + ')';
                                } else {
                                    attrValTrans = attrVal;
                                }
                                if (attrVal == attributeValue) {
                                    inputList += '<option selected value="' + attrVal + '">' + attrValTrans + '</option>';
                                } else {
                                    inputList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                }
                            });
                            dom = dom.replace(":inputList", inputList);
                        } else if (inputType == 'DROP_DOWN') {
                            dom = selectTpl;
                            var optionList = '<option value="">请选择</option>';
                            options.split("#,#").forEach(function (attrVal) {
                                var attrValTrans = opTransMap.get(attrVal);
                                //拼接label  attrValTrans
                                if (attrValTrans) {
                                    attrValTrans += '(' + attrVal + ')';
                                } else {
                                    attrValTrans = attrVal;
                                }
                                if (attrVal == attributeValue) {
                                    optionList += '<option selected value="' + attrVal + '">' + attrValTrans + '</option>';
                                } else {
                                    optionList += '<option  value="' + attrVal + '">' + attrValTrans + '</option>';
                                }
                            });


                            dom = dom.replace(/:optionList/g, optionList);
                        } else if (inputType == 'TEXT_FILED') {
                            dom = inputTpl;
                            if (attributeType == 'INT_TYPE' || attributeType == 'FLOAT_TYPE') {
                                dom = dom.replace(/:attrType/g, 'number');
                                if (attributeType == 'INT_TYPE') {
                                    dom = dom.replace(/:isInteger/g, 'integer|');//要求整数
                                }
                            } else {
                                dom = dom.replace(/:attrType/g, 'text');
                            }
                            dom = dom.replace(/:isInteger/g, '');//不要求整数
                            if (attributeValue) {
                                dom = dom.replace(/:attrValue/g, attributeValue);
                            } else {
                                dom = dom.replace(/:attrValue/g, '');
                            }
                        }
                        if (isMandatory) {
                            dom = dom.replace(/:isMandatory/g, 'required|');
                            dom = dom.replace(/:isCheckOne/g, 'mustCheckOne|');//要求必选checkbox
                            // dom = dom.replace(/:description/g, '必填'+inputType+"#"+attributeType);
                            dom = dom.replace(/:needTips/g, '<p style="color:red; float: right;" >*</p>');
                        } else {
                            dom = dom.replace(/:isMandatory/g, '');
                            dom = dom.replace(/:isCheckOne/g, '');//不必选checkbox
                            // dom = dom.replace(/:description/g, ''+inputType+'#'+attributeType);
                            dom = dom.replace(/:needTips/g, '');
                        }
                        if (attributeNameTrans) {
                            dom = dom.replace(/:attrNameTrans/g, attributeNameTrans + '(' + attributeName + ')');
                            TransObj[attributeNameTrans] = attributeName;
                        } else {
                            dom = dom.replace(/:attrNameTrans/g, attributeName);
                        }
                        dom = dom.replace(/:attrName/g, attributeName);
                        dom = dom.replace(/:description/g, '');
                        //赋值
                        $("#shopee_editAssiDataForm .shopeeCateSpecifics .layui-card-body").append(dom);
                    }
                }
                //specifics赋值
                var attr = getSpecifics(specifics);
                for(var attrName in attr){
                    var attrValue = attr[attrName];
                    var attrDom = $("#shopee_editAssiDataForm .shopeeCateSpecifics").find("input[name='"+attrName+"']");
                    if(attrDom.length>1){
                        //多选checkbox处理
                        var selfVals = [];
                        attrValue.split(',').forEach(function(v){
                            var dom = $("#shopee_editAssiDataForm .shopeeCateSpecifics")
                                .find("input[name='"+attrName+"'][value='"+v+"']");
                            if(dom.length>0){
                                dom.prop("checked", true);
                            }else{
                                selfVals.push(v);
                            }
                        });
                    }else if(attrDom.length==1){
                        //input text处理
                        $("#shopee_editAssiDataForm .shopeeCateSpecifics")
                            .find("input[name='"+attrName+"'][type=text]").val(attrValue);
                    }else{
                        //select处理
                        attrDom = $("#shopee_editAssiDataForm .shopeeCateSpecifics").find("input[name='"+TransObj[attrName]+"']");
                        let attrDoms = $("#shopee_editAssiDataForm .shopeeCateSpecifics").find("select[name='"+attrName+"']");
                        if(attrDom.length>0){
                            attrDom.val(attrValue);
                        }if(attrDoms.length>0){
                            $(attrDoms).find(`option:contains(${attrValue})`).prop('selected', true);
                        }
                    }
                }
                form.render();
        	}
        });
        
    }
    function getSpecifics(specificsStr){
        var attr = {};
        if(specificsStr){
            specificsStr.split("\n").forEach(function(v){
                attr[v.split(":")[0]] = v.split(":")[1];
            });
        }
        return attr;
    }
    var currentTitle = "";
    //查询分类

})
function showProhibitReason(tip,self) {
    var layer = layui.layer
    var index = layer.tips(tip,self,{tips: [1, 'orange']})
    $(self).attr('data-tipId',index)
}
function removeTip(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}