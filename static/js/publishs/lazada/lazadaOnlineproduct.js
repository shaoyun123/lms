var lazada_checkStatus = []
let lazadaInitListingLabelData = []
layui.use(['admin','form','table','layer','laydate','upload','formSelects','layCascader','laytpl'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects=layui.formSelects,
        upload = layui.upload,
        layCascader = layui.layCascader,
        laytpl = layui.laytpl,
        laydate = layui.laydate;
    form.render('select');
    formSelects.render('isSaleListLazadaOnline');

    let lazadaOnlineProdlazadaCates = layCascader({
        elem: "#lazadaOnlineProd_lazadaCates",
        clearable: true,
        filterable: true,
        collapseTags: true,
        placeholder: '请先选择站点',
        // options: res,
        props: {
            multiple: true,
            label: "enName",
            value: "categoryId"
        },
    })

    //#region 一键复制功能lazada_online_copy_list
    new dropButton('lazada_online_copy_list');
    $('.lazadaOnline_copyData').click(function(){
      const type = $(this).data('type');
      const typeStr = $(this).data('typestr');
      const { data } = table.checkStatus("lazada_online_data_table");
      const typeObj = {
        itemId: 0,
        prodPSku: 1,
        storeAcctName: 2,
      }
      // 若复选框选中数据，仅复制复选框选中数据；2.无选中数据，复制查询数据里前1w个数据
      if (data.length) {
        const copyList = data.map((v) => v[type])
        const copyListStr = Array.from(new Set(copyList));
        copyTxtToClipboard(copyListStr, "textarea");
      } else {
        const searchData = lazadaOnline_getSerachData();
        searchData.copyType = typeObj[type]
        commonReturnPromise({
          type: "POST",
          url: "/lms/onlineProductLazada/copyProductInfo",
          params: searchData,
        }).then((res) => {
          const copyList = res.join(',');
          layer.confirm(
            `查出${typeStr} ${res.length}条，点击确认复制`,{icon: 3},
            function () {
              copyTxtToClipboard(res, "textarea");
            }
          );
        });
      }
    })
    //#endregion

    // $("#lazada_priceAdjustmentTemp_importBtnConfirm").click(function(){
    //     layer.confirm('是否确认导入调价？', {btn:["确定", "取消"]}, function () {
    //         $("#lazada_priceAdjustmentTemp_importBtn").click()
    //         layer.closeAll()
    //    })
    // })
    upload.render({
        elem: "#lazada_priceAdjustmentTemp_importBtn", //绑定元素
        url: `${ctx}/lazadaBatchOperation/importUpdatePrice`, //上传接口
        accept: 'file',//允许上传的文件类型
        exts: 'xlsx|xls',
        before: function () {
            loading.show()
        },
        done: function(res) {
            loading.hide()
            if (res.code == '0000') {
                if(res.msg == '操作成功'){
                    layer.alert(res.msg || '上传成功',{ icon: 1 });
                }else{
                let msg = JSON.parse(res.msg),msgStr = '';
                for(let key in msg){
                    msgStr += key +'：'+ msg[key].join().split("\n").join("<br>") + "<br>";
                }
                layer.alert(msgStr || '上传成功',{ icon: 1 });
                }
            } else {
                layer.alert(res.msg || '上传失败',{ icon: 2 });
            }
        },
        error: function() {
            layer.msg('服务器出现故障!');
        }
    });

    upload.render({
        elem: "#lazada_priceAdjustmentTemp_modifyWeight_importBtn", //绑定元素
        url: `${ctx}/lazadaBatchOperation/importUpdateWeight`, //上传接口
        accept: 'file',//允许上传的文件类型
        exts: 'xlsx|xls',
        before: function () {
            loading.show()
        },
        done: function(res) {
            loading.hide()
            if (res.code == '0000') {
                if(res.msg == '操作成功'){
                    layer.alert(res.msg || '上传成功',{ icon: 1 });
                }else{
                    let msg = JSON.parse(res.msg),msgStr = '';
                    for(let key in msg){
                        msgStr += key +'：'+ msg[key].join().split("\n").join("<br>") + "<br>";
                    }
                    layer.alert(msgStr || '上传成功',{ icon: 1 });
                }
            } else {
                layer.alert(res.msg || '上传失败',{ icon: 2 });
            }
        },
        error: function() {
            layer.msg('服务器出现故障!');
        }
    });

    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#lazadaOnlineproduct_form");
    //lazada站点初始化渲染
    lazadaOnline_initLazadaSite();//初始化lazada站点下拉框
    laydate.render({
        elem: '#lazadaOnlineproduct_form input[name=listing_time]',
        range: '~'
    });
    /**
     * 初始化商品标签
     */
    lazadaOnline_initProdTags();
    function lazadaOnline_initProdTags(){
        $.ajax({
            type: "post",
            url: ctx + "/product/getProdTags.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    //商品标签
                    var productLabelList=returnData.data;
                    var labelStr="<option value=''>请选择</option>";
                    $(productLabelList).each(function () {
                        labelStr+="<option value='"+this.name+"'>"+this.name+"</option>";
                    });
                    $("#lazada_online_productLabel_sel").html(labelStr);
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }
    function lazadaOnline_initLazadaSite(){
        $.ajax({
            type: "get",
            url: "/lms/onlineProductLazada/getAllSite.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var sites=[];
                    $(returnData.data).each(function () {
                        var a = {name: this.name, value: this.code};
                        sites.push(a);
                    });
                    formSelects.data('lazada_online_site_sel', 'local', {arr: sites})
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器异常",{icon:5});
            }
        });
    };
    lazadaOnline_initListingLabel()
    // 在线listing标签
    function lazadaOnline_initListingLabel(){
        commonReturnPromise({
            type: 'GET',
            url:ctx+ '/onlineProductLazada/getListingTags'
        }).then(result => {
           $(result).each(function () {
               lazadaInitListingLabelData.push({name: this.name, value: this.name});
           });
           formSelects.data('lazada_listing_label', 'local', {arr: lazadaInitListingLabelData})
        })
    };
    // 初始化
    lazadaOnline_init()
    function lazadaOnline_init(){
        Promise.all([
            commonReturnPromise({
                url: '/lms/onlineProductLazada/getProductStatus', // 获取父商品状态枚举
            }),
            commonReturnPromise({
                url: '/lms/onlineProductLazada/getSuspendedStatus', // -获取子商品状态枚举
            }),
        ]).then(res=>{
            laytpl($("#lazada_online_tab_tpl").html()).render(res[0], function(html){
                $("#lazada_online_tab_view").html(html)
            });
            laytpl($("#lazada_online_subStatus_checkbox_tpl").html()).render(res[1], function(html){
                $("#lazada_online_subStatus_checkbox_view").html(html)
            });
            layui.form.render('checkbox')
        })
    }
    // // 平台类目查询
    // $('#lazada_online_cate_select_btn').click(function() {
    //     var siteCode= formSelects.value("lazada_online_site_sel","val");//站点id
    //     if(siteCode != null && siteCode.length > 0) {
    //         if(siteCode.length > 1){
    //             layer.msg("查询类目只能给选择一个站点");
    //             return;
    //         }
    //         admin.itemCat_select('lazada_online_category_select_event',
    //             'lazada_online_search_category_Id',
    //             'lazada_online_search_category_text',
    //             "/lazada/getLazadaCateList.html?siteId=" + siteCode,
    //             "/lazada/searchLazadaCate.html?siteId=" + siteCode
    //         );
    //         //设置当前站点的值
    //         $("#lazada_online_search_category_cate_site_id").val(siteCode);
    //     }else{
    //         layer.msg("必须选择站点");
    //     }
    // });

    // $("#lazadaOnlineProd_lazadaCates").next().click(function(){
    //     lazadaOnlineProdlazadaCates.setOptions([])
    //     var siteCode= formSelects.value("lazada_online_site_sel","val");//站点id
    //     if(siteCode != null && siteCode.length != 1) {
    //         // if(siteCode.length > 1){
    //         //     layer.msg("查询类目只能给选择一个站点");
    //         //     return;
    //         // }
    //         commonReturnPromise({
    //             url: "/lms/lazada/getLazadaCategoryTree?site=" + siteCode,
    //         }).then((res)=>{
    //             lazadaOnlineProdlazadaCates.setOptions(res)
    //         })
    //         //设置当前站点的值
    //         $("#lazada_online_search_category_cate_site_id").val(siteCode);
    //     }else{
    //         layer.msg("必须选择单个站点");
    //     }
    // })

    formSelects.on('lazada_online_site_sel', function (id,vals,val,isAdd) {
        let selectArr = vals.map(item => item.value)
        if(isAdd){
            selectArr.push(val.value)
        }else{
            selectArr = selectArr.filter(item=> item != val.value)
        }
        // console.log(selectArr)
        if(selectArr.length == 1){
            commonReturnPromise({
                url: "/lms/lazada/getLazadaCategoryTree?site=" + selectArr[0],
            }).then((res)=>{
                lazadaOnlineProdlazadaCates.setOptions(res)
            })
            //设置当前站点的值
            $("#lazada_online_search_category_cate_site_id").val(selectArr[0]);
        }else{
            lazadaOnlineProdlazadaCates.setOptions([])
            $("#lazada_online_search_category_cate_site_id").val('');
        }
    })

    // 清空
    $('#lazada_search_reset').click(function(){
        // clearCateAndOtherElementArray('lazada_online_search_category_text','lazada_online_search_category_Id', 'lazada_online_search_category_cate_site_id');
        $('#lazada_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
        lazadaOnlineProdlazadaCates.setValue(null)
    });

    //获取lazada搜索参数
    function  lazadaOnline_getSerachData() {
        //部门和销售人员是不传的(说是只要过滤店铺,不理解呀)
        var obj = new Object();
        obj.storeAcctId="";//店铺id
        obj.siteId="";//站点
        obj.prodPSku=""; //商品父sku
        obj.prodSSku="";//商品子sku
        obj.storePSku=""; //点铺父sku
        obj.storeSSku="";//点铺子sku
        obj.shopSkuList="";//点铺子sku
        obj.itemId="";//物品号
        obj.shopSku="";//子物品号
        obj.isSale = "", //在线还是下架
        obj.roleNames="lazada专员";
        obj.orgId= $("#lazada_online_depart_sel option:selected").val();
        obj.salePersonId = $("#lazada_online_salesman_sel option:selected").val();
        obj.orderBy = $.trim($("#lazada_online_sortdesc_sel").val());//排序类型
        if (obj.orderBy != null && obj.orderBy != '') {
            obj.ifSortByQuantity=true;
        }
        // obj.prodIsSaleStatus = $.trim($("#lazada_online_is_sale_status_sel").val());//排序类型
        obj.isSaleList = formSelects.value('isSaleListLazadaOnline', 'val').join(",")
        // obj.primaryCategory = $.trim($("#lazada_online_search_category_Id").val());//平台类目ID
        obj.primaryCategory = JSON.parse($('#lazadaOnlineProd_lazadaCates').val() || '[]').join(",");//平台类目ID
        obj.cateSiteId = $.trim($("#lazada_online_search_category_cate_site_id").val());//平台类目对应的站点

        var listing_time = $.trim($("#listing_time").val());//刊登时间
        obj.prodAttrs=$.trim($("#lazada_online_productLabel_sel").val());
        obj.searchSalesType  = $('#lazadaOnlineproduct_form select[name=searchSalesType]').val();
        obj.quantityType  = $('#lazadaOnlineproduct_form select[name=searchQuantityType]').val();
        obj.salesMin = $('#lazadaOnlineproduct_form [name=salesMin]').val();
        obj.salesMax = $('#lazadaOnlineproduct_form [name=salesMax]').val();
        if(listing_time){
            obj.listingStartTime = listing_time.split('~')[0];
            obj.listingEndTime = listing_time.split('~')[1];
        }
        //获取选中的店铺
        var storesStr= $('#lazada_online_store_sel').find('input').eq(0).val();//店铺id
        if(storesStr != null && storesStr.length > 0){ //选择店铺了
            obj.storeAcctId=storesStr;
            if(storesStr.length>1){
              obj.saleTip=true;
            }
        }else if(storesStr.length == 0){ //没有选中店铺
            if (obj.prodIsSaleStatus != null && obj.prodIsSaleStatus != '') {
                obj.saleTip=true;
            }
           var acctIds = $('#lazada_online_store_sel').attr('acct_ids');
            if(acctIds !=null && acctIds !='' ){
                obj.storeAcctId=acctIds;
            }else{
                obj.storeAcctId=99999;
            }
        };
        //获取选中的站点
        var sites= formSelects.value("lazada_online_site_sel","val");//站点id
        if(sites != null && sites.length > 0){
            obj.siteId=sites.join(",");
        }else if (sites.length == 0) {
            delete obj.siteId;
        };
        //获取传入的sku
        var listSearchType = $.trim($("#lazada_online_searchtype_sel").val());

        var searchVal = $.trim($('#lazada_online_searchtype_input').val());
        obj[listSearchType] = searchVal
        //获取物品号
        var goodsSel=$.trim($("#lazada_online_searchgoods_sel").val());//物品号
        var goodsVal=$.trim($("#lazada_online_searchgoods_input").val());//物品号
        if(goodsSel == 'itemId'){
            obj.itemId = goodsVal.replace(/，/ig,',');//替换中文字符;
        }else if (goodsSel == 'cItemIds'){
            obj.cItemIds = goodsVal.replace(/，/ig,',');//替换中文字符;
        }
        //获取刊登标题内容
        var titleSearchType = $.trim($("#lazada_online_title_searchtype").val());//标题检索类型
        var title = $.trim($("#lazada_online_title").val()); //刊登标题
        if (title != null && title != '') {
            if (titleSearchType == 0) {//标题模糊
                var array = title.split(" ");
                obj.title = "";
                for (var i = 0; i < array.length; i++) {
                    if ($.trim(array[i]) != null && $.trim(array[i]) != '') {
                        obj.title += "+" + $.trim(array[i]);
                        if (i != array.length - 1) {
                            obj.title += " ";
                        }
                    }
                }
            } else if (titleSearchType == 1) {//标题精准
                obj.title = "%" + title + "%";
            }
        };
        var marks = [];
        const subStatus = []
        $("#lazada_online_marks_form").find(".layui-form-checked").each(function () {
            var sval=$(this).prev().val();
            const inputName = $(this).prev().attr('name')
            if(inputName==='subStatus'){
                subStatus.push(sval)
            }else if(sval != '' && sval.indexOf("停售")==-1){
                marks.push(sval);
            }
        });
        if(marks.length!=0){
            if(marks.indexOf("统计总数") != -1){
                obj.displayAccurateCount = true
            }else{
                obj.displayAccurateCount = false
            }
            obj.listingMark=marks.filter(item => item!= "统计总数").join(",");
        }else{
            obj.displayAccurateCount = false
        }
        // 父商品状态枚举
        // obj.isSale = $.trim($('#lazada_online_isSale').val());
        obj.productStatus = $.trim($('#lazada_online_productStatus').val());
         // “已暂停”页签，有Suspended子状态二级页签
        if(obj.productStatus==='Suspended'){
            obj.subStatus = subStatus.join()
        }
        obj.listingType =  $('#lazadaOnlineproduct_form select[name=listingType]').val();
        // console.log(obj);
        obj.quantityStart = $.trim($("#lazada_online_quantityStart").val());
        obj.quantityEnd = $.trim($("#lazada_online_quantityEnd").val());

        // obj.qcStatus =  $('#lazadaOnlineproduct_form select[name=qcStatus]').val();
        obj.brandName =  $('#lazadaOnlineproduct_form select[name=brandName]').val();
        obj.specialPriceMin =  $('#lazadaOnlineproduct_form input[name=specialPriceMin]').val();
        obj.specialPriceMax =  $('#lazadaOnlineproduct_form input[name=specialPriceMax]').val();
        obj.avgRatingMin =  $('#lazadaOnlineproduct_form input[name=avgRatingMin]').val();
        obj.avgRatingMax =  $('#lazadaOnlineproduct_form input[name=avgRatingMax]').val();
        obj.avgRatingCountMin =  $('#lazadaOnlineproduct_form input[name=avgRatingCountMin]').val();
        obj.avgRatingCountMax =  $('#lazadaOnlineproduct_form input[name=avgRatingCountMax]').val();
        obj.waring =  $('#lazadaOnlineproduct_form select[name=waring]').val();
        obj.preorderEnable =  $('#lazadaOnlineproduct_form select[name=preorderEnable]').val();
        let videoStatus = $('#lazadaOnlineproduct_form select[name=videoStatus]').val(),
            isProhibit = $('#lazadaOnlineproduct_form select[name=isProhibit]').val(),
            optTimeType = $('#lazadaOnlineproduct_form select[name=optTimeType]').val(),
            videoExist =  $('#lazadaOnlineproduct_form select[name=videoExist]').val();
        videoStatus == ''?'':obj.videoStatus = videoStatus;
        isProhibit == ''?'':obj.isProhibit = isProhibit;
        videoExist == ''?'':obj.videoExist = videoExist;
        optTimeType == '' ? '' : obj.optTimeType = optTimeType;
        obj.listingRemark = $.trim($('#lazadaOnlineproduct_form input[name=listingRemark]').val());
        obj.listingTagInclude = $('#lazadaOnlineproduct_form').find('select[name=listingTagInclude]').val()
        obj.listingTags = layui.formSelects.value("lazada_listing_label","val").join(",")
        return obj;
    };

    //搜索按钮的点击事件
    $('#lazada_online_search_submit').on('click',function(){
        var searchData=lazadaOnline_getSerachData();
        table.render({
            elem: '#lazada_online_tableId',
            method: 'post',
            url: '/lms/onlineProductLazada/searchProduct.html',
            where:  searchData,
            cols: [[ //表头
                { type: "checkbox",width:25, style:"vertical-align: top;"},
                { title: "图片",unresize:true,width:80, style:"vertical-align: top;", templet: '#lazada_online_pImgs_tpl'},
                { title: "标题/产品id",minWidth:180,style:"vertical-align: top;", templet: '#lazada_online_title_tpl'},
                { title: "Parent SKU" ,minWidth:150,style:"vertical-align: top;",templet: '#lazada_online_storePSku_tpl'},
                { title: "商品评分",style:"vertical-align: top;",width: 100, templet: function(d){
                    let str = '以下是详细的问题项，请根据评分进行优化，其中分数格式为：得分/总分<br>'
                        d.ratingProductList && d.ratingProductList.forEach(item => {
                        str += item.itemTitle + '：  ' + item.itemScore + '/' + item.itemTotal + '<br>'
                    })
                    return `
                <div>
                    <div class="alignLeft">
                        <div>商品评分:${d.avgRating || 0}</div>
                        <div>评分次数:${d.avgRatingCount || 0}</div>
                        <div>内容评分:<br><span style="color: #00b7ee" lay-tips="${str}">${d.ratingScore || 0}</span>/${d.ratingTotal || 0}</div>
                    </div>
                </div>
                `}},
                { title: "预售",style:"vertical-align: top;",width: 100, templet: `
                <div>
                    <div class="alignLeft">
                        <div>状态:{{d.preorderEnable == true?'<span style="color:red;">已开启</span>':(d.preorderEnable == false?'已关闭' : '不支持')}}</div>
                        <div>天数:{{d.preorderDays || 0}}</div>
                    </div>
                </div>
                `},
                { title: "7/30/60/90/180销量",style:"vertical-align: top;",width: 110, templet: `
                <div>
                    <div class="alignLeft">
                        <div>7天:{{d.sevenSales || 0}}</div>
                        <div>30天:{{d.thirtySales || 0}}</div>
                        <div>60天:{{d.sixtySales || 0}}</div>
                        <div>90天:{{d.ninetySales || 0}}</div>
                        <div>180天:{{d.hundredOfEightySales || 0}}</div>
<!--                        <div>{{d.sevenSales || 0}}/{{d.thirtySales || 0}}/{{d.sixtySales || 0}}/{{d.ninetySales || 0}}/{{d.hundredOfEightySales || 0}}</div>-->
                        <div>更新:{{Format(d.updateTime,"yyyy-MM-dd hh:mm") || ""}}</div>
                    </div>
                </div>
                `},
                { unresize:true,width:880, title: `<div style='width:150px;float: left;'>Shopsku</div>
                        <div style='width:130px;float: left;'>SKU</div>
                        <div style='width:100px;float: left;'>属性</div>
                        <div style='width:80px;float: left;'>原价</div>
                        <div style='width:70px;float: left;'>促销价</div>
                        <div style='width:70px;float: left;'>活动库存/卖家可用/在线总数</div>
                        <div style='width:60px;float: left;'>状态</div>
<!--                        <div style='width:100px;float: left;'>可用/在途/未派</div> -->
                        <div style='width:100px;float: left;'>预计可用库存含在途/不含在途</div> 
                        <div style='width:100px;float: right;'>7/30/60/90/180销量</div>` ,
                        style:"vertical-align: top;",templet: '#lazada_online_storeSSku_tpl'
                },
                { title: '操作', width:80, align: 'center', style:"vertical-align: top;", toolbar: '#lazada_online_operate_tpl'}
            ]],
            page: {
              layout: ['prev', 'page', 'next','count','limit'],
              groups: 5,
              prev: '<上一页',
              next: '下一页>',
              first: false, //显示首页
              last: false, //显示尾页
              limit: 100,
              limits: [50,100,300,500,1000],
            },
            created(res) {
                res.data?.forEach((item, index) => {
                    if(item.productStatus == 'Suspended'){
                        // 存在双引号展示问题，所以将双引号变为单引号
                        item.rejectReasonListStr = (item.rejectReasonList || []).join('\n').replaceAll('"',"'")
                    }
                })
            },
            // page: true,
            id: "lazada_online_data_table",
            // limits: [50, 100, 200],
            // limit: 100,
            done: function(data){
                // console.log(data)
                theadHandle().fixTh({id: '#lazadaOnlineproduceCard', dv1: '.layui-tab', dv3:'#lazada_online_toolbar', dv4: '#lazada_online_subStatus_checkbox'})
                imageLazyloadAll();//懒加载
                watchTableBar(); //监听工具条的点击事件
                // 显示数量
                if (data.count>10000) {
                    $('#lazada_online_tab_view').find('.layui-this span').text('>10000');
                }else {
                    $('#lazada_online_tab_view').find('.layui-this span').text(data.count);
                }
                // if(lazadaOnline_getSerachData().isSale == 1){
                //     // if (data.count>10000) {
                //     //     $('#LazadaIsSaleTrueNum').text('>10000');
                //     // }else {
                //         $('#LazadaIsSaleTrueNum').text(data.count);
                //     // }
                //     $('#LazadaIsSaleFalseNum').text('点击显示');
                // }else {
                //     // if (data.count>10000) {
                //     //     $('#LazadaIsSaleFalseNum').text('>10000');
                //     // }else {
                //         $('#LazadaIsSaleFalseNum').text(data.count);
                //     // }
                //     // $('#LazadaIsSaleTrueNum').text('点击显示');
                // }
            }
        })
    });
    // 导出功能
    $("#lazada_export_btn").click(function () {
        var confirmindex =layer.open({
            type: 1,
            title: "导出数据",
            area: ["30%", '40%'],
            shadeClose: false,
            btn: ['导出', '取消'],
            content: $("#lazada_export_btn_layer").html(),
            success: function (index, layero) { 
                form.render();
            },
            yes: function () {
                var data = lazadaOnline_getSerachData();
                if ($('input[name="isSale"]:checked').val() == 1 || $('input[name="isSale"]:checked').val() == 0) {
                    var itemData = table.checkStatus('lazada_online_data_table').data;
                    var itemIds = [];
                    for (var i = 0; i < itemData.length; ++i) {
                        itemIds.push(itemData[i].itemId)
                    }
                    if (itemData != null && itemData.length > 0) {
                        data.itemId = itemIds.join(",");
                    }
                }
                data.isSale = $('input[name="isSale"]:checked').val();
                data.noProfit = $('input[name="lazada_online_noProfit"]').val(); // true:不含利润
                submitForm(data, ctx + '/onlineProductLazada/exportLazadaOnlineInfo.html', "_blank")
                layer.close(confirmindex);
            }
        })
    });
    //监听表格的工具栏
    var watchTableBar = function(){
        table.on('tool(lazada_online_tableFilter)',function(obj){
            var itemId = obj.data.itemId; //获取到物品的id
            var  storeAcctId = obj.data.storeAcctId; //获取到店铺的id
            var storeAcctId5itemId = storeAcctId +'&'+ itemId;
            // console.log(storeAcctId5itemId)
            if (obj.event == 'lazada_online_updateOneItem'){ //更新
               $.ajax({
                   type: 'post',
                   dataType: 'json',
                   data: {
                    storeAcctId5itemId: storeAcctId5itemId
                   },
                   url: '/lms/onlineProductLazada/syncProductItem.html',
                   beforeSend: function(){
                        loading.show();
                   },
                   success: function(res){
                       loading.hide();
                       layer.msg(res.msg,{icon:0});
                   },
                   error: function () {
                     layer.msg("服务器异常",{icon:5});
                   }
               })
            }else if (obj.event == 'lazada_online_searchLog'){ //日志
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['1100px','800px'],
                    content: $('#log_table_lazada').html(),
                    success:function () {
                        lazadaOnline_searchLog(itemId,storeAcctId);
                    }
                });
            }else if (obj.event == 'lazada_online_remark'){ //备注
                layer.open({
                    type: 1,
                    title: 'listing备注',
                    shadeClose: false,
                    area: ['600px','500px'],
                    btn: ['保存', '关闭'],
                    content: $('#remark_table_lazada').html(),
                    success: function (layero,index) {
                        lazadaOnline_remark(itemId,storeAcctId);
                        $(layero).find("[name='listingRemark']").val(obj.data.listingRemark)
                    },yes: function (index, layero){
                        let listingRemark = $(layero).find("[name='listingRemark']").val()
                        if(listingRemark.length <= 200) {
                            commonReturnPromise({
                                url:ctx+ '/onlineProductLazada/updateRemark',
                                type: 'post',
                                contentType: 'application/json',
                                params: JSON.stringify({
                                    id:obj.data.id,
                                    listingRemark:listingRemark,
                                    storeAcctId:storeAcctId,
                                    itemId:itemId,
                                })
                            }).then(data=>{
                                lazadaOnline_remark(itemId,storeAcctId);
                                layer.msg("保存成功")
                                $(layero).find("[name='listingRemark']").val('')
                            })
                        } else {
                            layer.msg("内容超出200字")
                        }
                    }
                });
            }
        })
    };

    //渲染日志表格
    async function lazadaOnline_searchLog(itemId,storeAcctId) {
        // 获取操作类型
        let operTypeEnum
        await commonReturnPromise({
            url:ctx+ '/prodListingOperTypeEnum/lazada'
        }).then(data=>{
            operTypeEnum = data
        })
        table.render({
            elem: '#lazada_log_table',
            method: 'get',
            url: '/lms/onlineProductLazada/showlog.html',
            where:{'itemId':itemId,'storeAcctId':storeAcctId}
            ,cols: [[ //标题栏
                {field: 'createTime', title: '时间' ,templet:"<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>"}
                ,{field: 'creator', title: '操作人'}
                ,{field: 'prodSSku', title: '子SKU'}
                ,{field: 'operType', title: '事件', templet: function(d){ return operTypeEnum[d.operType]} || '' }
                ,{field: 'oldData', title: '原值'}
                ,{field: 'newData', title: '调整值'}
                ,{field: 'operDesc', title: '结果'}
            ]]
        });
    }
    //渲染日志表格
    async function lazadaOnline_remark(itemId,storeAcctId) {
        table.render({
            elem: '#lazada_remark_table',
            method: 'get',
            page: false,
            height:200,
            url: '/lms/onlineProductLazada/searchRemarkLog',
            where:{'itemId':itemId,'storeAcctId':storeAcctId}
            ,cols: [[ //标题栏
                {field: 'remarkContent', title: '备注内容'}
                ,{field: 'createTime', title: '时间',width:150 ,templet:"<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>"}
                ,{field: 'creator', title: '添加人',width:90}
            ]]
            // ,done: function (res, curr, count) {
            //     $(layero).find("[name='listingRemark']").val(res.data[0].remarkContent)
            // }
        });
    }

    //批量更新
    var updateBacthlazadaItem = function(itemIds){
        loading.show();
        if(itemIds==null||itemIds==''){
            layer.msg("请选择lisiting",{icon:0});
            return;
        }
        $.ajax({
            type: "post",
            url: "/lms/onlineProductLazada/syncProductItem.html",
            data:{"storeAcctId5itemId":itemIds},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content:  returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero){
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };

    //重新上架
    var reshelflazadaItem = function(itemIds){
        loading.show();
        if(itemIds==null||itemIds==''){
            layer.msg("请选择重新上架的商品",{icon:0});
            return;
        }
        $.ajax({
            type: "post",
            url: "/lms/onlineProductLazada/reshelfProduct.html",
            data:{"storeAcctId5itemId":itemIds},
            dataType: "json",
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg,{icon:1});
                } else {
                    layer.open({
                        title: '重新上架结果',
                        content:  returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero){
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };
    // 导出
    form.on('select(lazadaOnlineproduceExportSel)', function (data) {
        if(data.value == '1'){
            window.open(`${ctx}/static/templet/lazada_import_update_price.xlsx`,'_blank');
        }else if(data.value == '2'){
            window.open(`${ctx}/static/templet/lazada_import_update_weight.xlsx`,'_blank');
        }

    })
    // 导入
    form.on('select(lazadaOnlineproduceImportSel)', function (data) {
        if(data.value == '1'){
            layer.confirm('是否确认导入调价？', {btn:["确定", "取消"]}, function () {
                $("#lazada_priceAdjustmentTemp_importBtn").click()
                layer.closeAll()
            })
        }else if(data.value == '2'){
            layer.confirm('是否确认导入修改重量？', {btn:["确定", "取消"]}, function () {
                $("#lazada_priceAdjustmentTemp_modifyWeight_importBtn").click()
                layer.closeAll()
            })
        }
    })

    //批量操作
    form.on('select(lazada_online_patch)', function (data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        var itemData = table.checkStatus('lazada_online_data_table').data; //获取选择的店铺
        lazada_checkStatus = itemData
        if (selected == 1) { //批量更新
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", {icon: 0});
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.itemId);
            }
            updateBacthlazadaItem(itemIds.join(","));
            return false;
        }else if(selected==5){//批量修改标题和描述
            if(lazada_checkStatus.length<1){
                layer.msg('请勾选要修改的数据')
                return false;
            }
        }else if(selected==7){//重新上架
            let lazadaonlineproductAttr = $(".lazadaOnlineproduct-attr-active").find(".layui-this").attr("lazadaonlineproduct-attr"); // 0在綫，1下架
            if(lazadaonlineproductAttr == 0){
                layer.msg('在线商品不允许重新上架')
                return;
            }else{
                if(lazada_checkStatus.length<1){
                    layer.msg('请勾选要重新上架的商品')
                    return;
                }
                var itemIds = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemIds.push(obj.storeAcctId + "&" + obj.itemId);
                }
                reshelflazadaItem(itemIds.join(","));
            }
            return false;
        }else if(selected==10){// 批量修改listing品牌
            if(lazada_checkStatus.length<1){
                layer.msg('请勾选要修改的数据')
                return false;
            }

            if(lazada_checkStatus.filter(item => item.storeAcctId != lazada_checkStatus[0].storeAcctId).length != 0){
                layer.msg('只能修改同一店铺的物品品牌')
                return false;
            }
        }else if(selected==13){// 导出listing
            $("input[name=lazada_online_noProfit]").val(false);
            $("#lazada_export_btn").click()
            return;
        }else if(selected==14){// 导出listing（不含利润）
            $("input[name=lazada_online_noProfit]").val(true);
            $("#lazada_export_btn").click()
            return;
        }else if(selected==15){// 预售设置
            if(lazada_checkStatus.length<1){
                layer.msg('请勾选要修改的数据')
                return false;
            }
        }else if(selected==16){// 删除listing视频
            if(lazada_checkStatus.length<1){
                layer.msg('请勾选要修改的数据')
            }else{
                deleteListingVideo(lazada_checkStatus.length)
            }
            return false;
        // }else if(selected==17){// 修改listing标签
        //     if(lazada_checkStatus.length<1){
        //         layer.msg('请勾选要修改的数据')
        //     }else{
        //         modifyListingLabel(lazada_checkStatus.length)
        //     }
        //     return false;
        }
        var itemIds = [],itemId = [],storeAcctId = [];
        for (var index in itemData) {
            var obj = itemData[index];
            itemIds.push(obj.id);
            itemId.push(obj.itemId);
            storeAcctId.push(obj.storeAcctId)
        }
        localStorage.setItem('itemIds',itemIds);
        localStorage.setItem('itemId',itemId);
        localStorage.setItem('storeAcctId',storeAcctId);
        var sobj = $("#lazada_online_patch").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            area: ['80%', '70%'],
            success: function () {
                layui.view(this.id).render(link).done(function () {
                    //渲染完成以后执行的函数
                    // if(smtSkus){ 
                    //     $("input[name='skuList']").val(smtSkus);
                    //     setTimeout(function () {
                    //         $('#smtModifyStockSearchBtn').click();
                    //     },1000);//延迟1s
                    // }
                })
            },
            end:function () {
            }
        });
    });

    // 标签配置
    $('#lazada_onlilne_settting_tag').click(function(){
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: '自动标签配置',
            move: false,
            area: ['1000px', '800px'],
            btn: ["保存", "关闭"],
            success: function (layero) {
                // 存localstorage platcode
                window.localStorage.setItem('autoSetListingTagPlatCode','lazada')
                layui.view(this.id).render('route/iframe/lazada/autoSetListingTag').done(function () {
                })
            },
            yes:function(){
                const tableData = autoSetListingTagName_lazada.saveListingTagSetting()
                if(Array.isArray(tableData)){
                    commonReturnPromise({
                        url: '/lms/lazadaAutoSetTag/saveConfigs',
                        type: 'post',
                        contentType: 'application/json',
                        params: JSON.stringify(tableData)
                    }).then(res=>{
                        layer.msg(res,{icon:1})
                        layer.closeAll()
                    })
                }
            },
            end: function () {}
        })
    })
});
// 删除listing视频
function deleteListingVideo(len){
    let confirmindex =layer.open({
        type: 1,
        title: "删除listing视频",
        area: ["400px", '200px'],
        btn: ['仅删除', '删除并维护不自动上传', '关闭'],
        content: `<div style="padding: 10px 20px">
    本次删除视频的listing共计<b> ${len} </b>个，请确认是否将listing视频全部删除？支持选择仅删除，或者删除并将SKU维护到店铺管理自动上传视频不处理SKU配置中
</div>`,
        success: function (index, layero) {
        }, yes: function () {
            deleteListingVideoApi(false,confirmindex)
        }, btn2: function () {
            deleteListingVideoApi(true,confirmindex)
            return false;
        }, end: function () {

        }
    })
}
function deleteListingVideoApi(type,layeroIndex){
    let itemData = layui.table.checkStatus('lazada_online_data_table').data; //获取选择的店铺
    let obj = []
    itemData.forEach(item => {
        obj.push({
            storeAcctId: item.storeAcctId,
            ids:[item.id],
            skus:[item.prodPSku],
            type: type // false 只删除
        })
    })
    commonReturnPromise({
        type: 'post',
        url:ctx+ '/onlineProductLazada/deleteProductVideo',
        contentType: 'application/json',
        params: JSON.stringify(obj)
    }).then(result => {
        layer.msg('正在执行删除listing视频')
        layer.close(layeroIndex)
    })
}
// 修改listing标签
function modifyListingLabel(len){
    let confirmindex =layer.open({
        type: 1,
        title: "修改在线listing标签",
        area: ["400px", '400px'],
        btn: ['确定', '取消'],
        content: $('#listing_label_lazada_tpl').html(),
        success: function (index, layero) {
            layui.formSelects.data('lazada_listing_label_add', 'local', {arr: lazadaInitListingLabelData})
            layui.formSelects.data('lazada_listing_label_remove', 'local', {arr: lazadaInitListingLabelData})
        }, yes: function (index, layero){
            let itemData = layui.table.checkStatus('lazada_online_data_table').data; //获取选择的店铺
            let insertTags= layui.formSelects.value("lazada_listing_label_add","val"),
                removeTags= layui.formSelects.value("lazada_listing_label_remove","val");//站点id

            // 判断是否有重复项
            let newA = new Set(insertTags),
            newB = new Set(removeTags);
            let intersetionSet = new Set([...newA].filter(x => newB.has(x)))

           if(insertTags.length == 0&&removeTags.length == 0){
               layer.alert('请选择标签添加或移除！')
               return false;
           }else if(intersetionSet.size != 0){
               layer.alert('同一标签无法同时添加与移除！')
               return false;
           }else{
               commonReturnPromise({
                   type: 'post',
                   url:ctx+ '/onlineProductLazada/updateProductTags',
                   contentType: 'application/json',
                   params: JSON.stringify({
                       lstingIds:itemData.map(item=>item.id),
                       insertTags:insertTags,
                       removeTags:removeTags
                   })
               }).then(result => {
                   layer.msg('操作成功')
                   layer.close(index);
               })
           }
        }
    })
}

//AMD标准外的函数
/**
 * 显示商品详情
 */
function changeColspantable(obj) {
    $(obj).prev().find(".myj-hide").toggle();
    var str=$(obj).html();
    if(str.indexOf("展开")>-1){
        $(obj).html("- 收起")
    }else{
        $(obj).html("+ 展开")
    }
}

//设置在线/已下架点击传递isSale
function setLazadaProductStatus(id){
    // $('#lazada_online_isSale').val(id);
    $('#lazada_online_productStatus').val(id)
    $('#lazada_online_search_submit').trigger('click');
    $('#lazada_online_patch').next().find('input').val('');
    //获取到渲染后要隐藏的元素
    var optionStr1 = `<permTag:perm funcCode="modify_stock_lazada"><option value="0" data-link="route/iframe/lazada/adjuststock" data-title="批量调整库存">批量调整库存</option></permTag:perm>
    <permTag:perm funcCode="off_shelves_lazada">
        <option value="2" data-link="route/iframe/lazada/offshelves" data-title="商品下架/删除">商品下架/删除</option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_promoprice_lazada">
        <option value="3" data-link="route/iframe/lazada/adjustpromotion" data-title="仅调整促销价">仅调整促销价</option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_price_lazada">
        <option value="4" data-link="route/iframe/lazada/adjustpriceAndpromotion"
                data-title="调整原价和促销价">调整原价和促销价</option>
    </permTag:perm>
    <option value="1" data-link="" data-title="">批量更新</option> 
    <permTag:perm funcCode="lazada_modify_title">
        <option value="12" data-link="route/iframe/lazada/lazadaModifyTitle" data-title="仅修改标题">仅修改标题
        </option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_description_lazada">
        <option value="5" data-link="route/iframe/lazada/modifyTittle" data-title="修改标题和描述">修改标题和描述</option>
    </permTag:perm>
    <permTag:perm funcCode="modify_picture_lazada">
        <option value="6" data-link="route/iframe/lazada/modifyPicture" data-title="修改子SKU图">修改子SKU图
        </option>
    </permTag:perm>
    <permTag:perm funcCode="modify_classify_lazada">
        <option value="8" data-link="route/iframe/lazada/modifyGoodsClassify" data-title="修改商品分类">修改商品分类
        </option>
    </permTag:perm>
    <option value="9" data-link="route/iframe/lazada/modifyListingPicture" data-title="修改listing图">修改listing图</option>
    <permTag:perm funcCode="modify_listing_make_lazada">
        <option value="10" data-link="route/iframe/lazada/modifyListingMake" data-title="批量修改listing品牌">批量修改listing品牌
                            </option>
    </permTag:perm>
 <permTag:perm funcCode="not_handle_listing_lazada">
 <option value="11" data-link="route/iframe/lazada/lazadaNotHandleListing" data-title="不处理listing">不处理listing
                            </option>
    </permTag:perm><option value="13" data-title="导出listing">导出listing
                            </option>
                            <option value="14" data-title="导出listing（不含利润）">导出listing（不含利润）
                            </option><option value="15" data-title="预售设置" data-link="route/iframe/lazada/lazadaPreSales">预售设置</option>
<permTag:perm funcCode="delete_listing_video_lazada">
                                <option value="16" data-title="删除listing视频">删除listing视频</option>
                            </permTag:perm>
                            <permTag:perm funcCode="modify_listing_label_lazada">
                                <option value="17" data-link="route/iframe/lazada/updateLisitingTags" data-title="修改listing标签">修改listing标签</option>
                            </permTag:perm>
                            <option value="18" data-link="route/iframe/lazada/lazadaModifySsku" data-title="一键新增子SKU">一键新增子SKU</option>
`;
    var optionStr2 = `<permTag:perm funcCode="modify_stock_lazada"><option value="0" data-link="route/iframe/lazada/adjuststock" data-title="批量调整库存">批量调整库存</option></permTag:perm>
    <permTag:perm funcCode="off_shelves_lazada">
        <option value="2" data-link="route/iframe/lazada/offshelves" data-title="商品下架/删除">商品下架/删除</option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_promoprice_lazada">
        <option value="3" data-link="route/iframe/lazada/adjustpromotion" data-title="仅调整促销价">仅调整促销价</option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_price_lazada">
        <option value="4" data-link="route/iframe/lazada/adjustpriceAndpromotion"
                data-title="调整原价和促销价">调整原价和促销价</option>
    </permTag:perm>
    <option value="1" data-link="" data-title="">批量更新</option>  
    <permTag:perm funcCode="lazada_modify_title">
        <option value="12" data-link="route/iframe/lazada/lazadaModifyTitle" data-title="仅修改标题">仅修改标题
        </option>
    </permTag:perm>
    <permTag:perm funcCode="adjust_description_lazada">
        <option value="5" data-link="route/iframe/lazada/modifyTittle" data-title="修改标题和描述">修改标题和描述</option>
    </permTag:perm>
    <permTag:perm funcCode="modify_picture_lazada">
        <option value="6" data-link="route/iframe/lazada/modifyPicture" data-title="修改子SKU图">修改子SKU图
        </option>
    </permTag:perm>
    <option value="7" data-title="重新上架">重新上架
    </option>
    <permTag:perm funcCode="modify_classify_lazada">
        <option value="8" data-link="route/iframe/lazada/modifyGoodsClassify" data-title="修改商品分类">修改商品分类
        </option>
    </permTag:perm>
    <option value="9" data-link="route/iframe/lazada/modifyListingPicture" data-title="修改listing图">修改listing图</option>
    <permTag:perm funcCode="modify_listing_make_lazada">
        <option value="10" data-link="route/iframe/lazada/modifyListingMake" data-title="批量修改listing品牌">批量修改listing品牌
                            </option>
    </permTag:perm>
    <permTag:perm funcCode="not_handle_listing_lazada">
 <option value="11" data-link="route/iframe/lazada/lazadaNotHandleListing" data-title="不处理listing">不处理listing
                            </option>
    </permTag:perm><option value="13" data-title="导出listing">导出listing
                            </option>
                            <option value="14" data-title="导出listing（不含利润）">导出listing（不含利润）
                            </option><option value="15" data-title="预售设置" data-link="route/iframe/lazada/lazadaPreSales">预售设置</option>
                            <permTag:perm funcCode="modify_listing_label_lazada">
                                <option value="17" data-link="route/iframe/lazada/updateLisitingTags" data-title="修改listing标签">修改listing标签</option>
                            </permTag:perm>
                            <option value="18" data-link="route/iframe/lazada/lazadaModifySsku" data-title="一键新增子SKU">一键新增子SKU</option>
`;
    var $select = $('#lazada_online_patch');
    // 增加的页签和在线页签一样
    // if (id== 1) {
    //     $select.html(optionStr1);
    // } else if (id == 0) {
    //     $select.html(optionStr2);
    // }
    if(id==='InActive'){
        $select.html(optionStr2);
    }else{
        $select.html(optionStr1);
    }
    
    layui.form.render('select');
    // “已暂停”页签，展示Suspended子状态二级页签
    if(id==='Suspended'){
        $('#lazada_online_subStatus_checkbox_view').show()
    }else{
        $('#lazada_online_subStatus_checkbox_view').hide()
    }
}
