<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<!--抽离商品优化页面-->
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/html" id="product_optimize_add_layer">
    <div class="p20">
        <form action="" class="layui-form" id="product_optimize_add_form">
            <div class="layui-form-item">
                <label class="layui-form-label">需求平台<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <select name="" id="product_optimize_platList_update_sel" lay-search></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">优化方向<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <select name="" id="product_optimize_optimReason_update_sel" lay-filter="product_optimize_optimReason_update_sel" lay-search></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">责任人<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" placeholder="责任人" id="product_optimize_developer_update_input" disabled="disabled">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">销售处理平台<span style="color: red;">*</span></label>
                <div class="layui-input-block" id="product_optimize_platList_sellDeal_chk">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">参考链接<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <input type="text" autocomplete="off" class="layui-input" placeholder="参考链接" id="product_optimize_linkRef_update_input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">需求备注<span style="color: red;">*</span></label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" id="product_optimize_sellerNote_update_input"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="product_optimize_org_layer">
    <div class="layui-col-md3">
        <div style="display: inline-block; padding: 4px; overflow: auto;">
            <form class="layui-form" id="product_optimize_orgTreeForm">
                <div id="product_optimize_orgXTree" style="width:300px;padding: 10px 0 25px 5px;"></div>
            </form>
        </div>
    </div>
</script>
<script type="text/javascript">
    var product_optimize_add_btn_fun;
    var product_optimize_show_org_fun;
    layui.use(['form'], function () {
        var $ = layui.$,
            layer = layui.layer,
            form = layui.form;
        var product_optimize_select_person = [];
        var product_optimize_orgXTree;//组织树
        var defaultSellDept = ['wish部', 'ebay销售一部','ebay销售二部', 'shopee合肥部', 'shopee西安部', 'joom部','速卖通一部','速卖通二部'];
        product_optimize_add_btn_fun = function (parentSku,prodPId) {
            initOrg(defaultSellDept,false); //初始化所有平台的销售人员,默认值
            $.ajax({
                url: ctx + '/msgProdOptimization/getProductFirstResponsible.html',
                data: {"parentSku": parentSku,"prodPId":prodPId},
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        var prodObj=returnData.data.msgProdOptimization;
                        if(prodObj != null){//提醒历史优化的
                            var tipHtml = "该SKU <span style='color:#007DDB'>" + parentSku + " </span>";
                            tipHtml += "已于<span style='color:#007DDB'>" + Format(prodObj.createTime, "yyyy-MM-dd hh:mm:ss") + "</span>由 ";
                            tipHtml += "<span style='color:#007DDB'>" + prodObj.seller + "</span> 提出过方向为 ";
                            tipHtml += "<span style='color:#007DDB'>" + returnData.data.optimizeReason + "</span> 的优化意见，是否要重复添加?<br/><hr/>";
                            tipHtml += "处理状态：<span style='text-indent:2em;'>" + returnData.data.optimizeStatus + "</span><br/>";
                            tipHtml += "需求人：<span style='text-indent:2em;'>" + prodObj.seller + "</span><br/>";
                            tipHtml += "需求备注：<span style='text-indent:2em;'>" + prodObj.sellerNote + "</span><br/>";
                            tipHtml += "处理人：<span style='text-indent:2em;'>" + prodObj.developer + "</span><br/>";
                            var str= prodObj.devNote !=null ? prodObj.devNote : " ";
                            tipHtml += "处理备注：<span style='text-indent:2em;'>" + str+ "</span><br/>";
                            var indexConfirm=layer.confirm(tipHtml, function (result) {
                                 if(result){
                                     layer.close(indexConfirm);
                                     showOptimizeDeailog(parentSku,returnData);
                                 }
                            });
                        }else{
                            showOptimizeDeailog(parentSku,returnData);
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
        product_optimize_show_org_fun = function () {
            var sellPlats = [];
            var sellDept = [];
            $("#product_optimize_add_form").find(".layui-form-checked").each(function () {
                var value = $(this).prev().val();//选择的平台;
                sellPlats.push(value);
                for (var x in defaultSellDept) {
                    var dept = defaultSellDept[x];
                    if(value=="aliexpress"){
                        value="速卖通部";
                    }
                    if (dept.indexOf(value) > -1) {
                        sellDept.push(dept);
                    }
                }
            });
            if (sellPlats.length == 0) {
                layer.msg("至少选择一个销售处理平台", {icon: 0});
                return false;
            }
            var index = layer.open({
                type: 1,
                title: '选择销售平台人员',
                area: ['45%', '45%'],
                btn: ['保存', '关闭'],
                content: $('#product_optimize_org_layer').html(),
                success: function (layero, index) {
                    initOrg(sellDept,true);
                },
                yes: function (index, layero) {
                    product_optimize_select_person = product_optimize_orgXTree.GetAllChecked();
                    if (product_optimize_select_person == null || product_optimize_select_person.length == 0) {
                        layer.msg("请至少选择一个销售处理", {icon: 0});
                        return false;
                    }
                    layer.close(index);
                }
            });
        };
        /**
         * 初始化组织
         */
        function initOrg(sellDept,needInit) {
            $.ajax({
                type: "post",
                url: ctx + "/msgProdOptimization/getPlatSalesOrgPerson.html", //(必填) json数组
                dataType: "json",
                data: {saleOrgs: sellDept.join(",")},
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        product_optimize_select_person = returnData.data.sellerList;
                        if(needInit){//渲染组织树
                            product_optimize_orgXTree = new layuiXtree({
                                elem: 'product_optimize_orgXTree', //(必填) 放置xtree的容器id，不要带#号,
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
                            product_optimize_orgXTree.render();
                        }
                    } else {
                        layer.msg(returnData.msg, {icon: 5});
                    }
                },
                error: function () {
                    layer.msg("发送请求失败", {icon: 5});
                }
            })
        };

        /**
         * 显示优化弹出窗
         */
        function showOptimizeDeailog(parentSku,returnData){
            var prodPId = returnData.data.id;
            var sid=returnData.data.sid;//第一个子商品id
            var bizz_owner = returnData.data.bizz_owner;
            var bizz_owner_id = returnData.data.bizz_owner_id;
            var buyer = returnData.data.buyer;
            var buyer_id = returnData.data.buyer_id;
            var platList = returnData.data.platList;//用户拥有的平台
            var optimizeList = returnData.data.optimizeList;//优化方向
            var integrator =returnData.data.integrator;//采购对应的整合人员
            var integrator_id=returnData.data.integrator_id;//采购对应的整合人员id
            var developer = '';//责任人
            var developerId = '';//责任人id
            var isProductDept=returnData.data.isProductDept;//采购员是否是产品开发部
            var index = layer.open({
                type: 1,
                title: '优化建议',
                area: ['60%', '60%'],
                btn: ['保存', '关闭'],
                content: $('#product_optimize_add_layer').html(),
                success: function (layero, index) {
                    $("#product_optimize_platList_update_sel").html("<option value=''>请选择</option>");
                    if (platList != null) {
                        var sellPlat = "";
                        $(platList).each(function (index) {
                            if (index == 0) {
                                $("#product_optimize_platList_update_sel").append("<option value='" + this + "' selected = 'selected' >" + this + "</option>");
                            } else {
                                $("#product_optimize_platList_update_sel").append("<option value='" + this + "'>" + this + "</option>");
                            }
                            sellPlat += '<input type="checkbox" lay-filter="product_optimize_platList_chk" checked value="' + this + '"  title="' + this + '">';
                        });
                        sellPlat += '<label style="color: #428bca;padding-left: 10px;cursor: pointer" onclick="product_optimize_show_org_fun();">编辑平台人员</lable>';
                        $("#product_optimize_platList_sellDeal_chk").html(sellPlat);//初始化销售处理平台
                    }
                    if (optimizeList != null) {
                        $("#product_optimize_optimReason_update_sel").html("<option value=''>请选择</option>");
                        $(optimizeList).each(function () {
                            $("#product_optimize_optimReason_update_sel").append("<option value='" + this.dKey + "'>" + this.dValue + "</option>");
                        });
                    }
                    form.render('select');
                    form.render('checkbox');
                    form.on('checkbox(product_optimize_platList_chk)', function(data){
                        var sellDept = [];
                        $("#product_optimize_add_form").find(".layui-form-checked").each(function () {
                            var value = $(this).prev().val();//选择的平台;
                            for (var x in defaultSellDept) {
                                var dept = defaultSellDept[x];
                                if(value=="aliexpress"){
                                    value="速卖通部";
                                }
                                if (dept.indexOf(value) > -1) {
                                    sellDept.push(dept);
                                }
                            }
                        });
                        initOrg(sellDept,false);
                    });
                    form.on('select(product_optimize_optimReason_update_sel)', function (data) {
                        if (data.value != null ) {
                            if (data.value == 1) {//售价无优势
                                if (buyer_id == null || buyer_id == '') {
                                    layer.msg(parentSku+"商品下第一个子sku对应的采购员为空！",{icon:0});
                                    return false;
                                }
                                developer=integrator;
                                developerId=integrator_id;
                                if(developerId==null){
                                    if(isProductDept != null && isProductDept=="1"){//采购员是产品开发部
                                        developer = bizz_owner;
                                        developerId = bizz_owner_id;
                                    }else{
                                        var tips="<span style='color:#007DDB'>"+parentSku+"</span>商品下第一个子sku对应的采购员 ";
                                        tips+="<span style='color:#007DDB'>"+buyer+"</span> 没有配置对应的整合人员，";
                                        tips+="请先至 办公>采购人员 映射配置完成后，再打开商品优化!";
                                        layer.msg(tips,{icon:0, time: 5000, btn: ['知道了']});
                                        return false;
                                    }
                                }
                            } else {//其它方向
                                developer = bizz_owner;
                                developerId = bizz_owner_id;
                            }
                        } else {
                            developer = '';
                            developerId = '';
                        }
                        $("#product_optimize_developer_update_input").val(developer);
                    });
                },
                yes: function (index, layero) {
                    var obj = new Object();
                    obj.prodPId = prodPId;//父商品id
                    obj.parentSku = parentSku;
                    obj.developerId = developerId;//责任人id
                    obj.platList = $.trim($("#product_optimize_platList_update_sel").val());//需求平台
                    obj.optimReason = $.trim($("#product_optimize_optimReason_update_sel").val());//优化方向
                    obj.developer = $.trim($("#product_optimize_developer_update_input").val());//责任人
                    obj.refLink = $.trim($("#product_optimize_linkRef_update_input").val());//参考链接
                    obj.sellerNote = $.trim($("#product_optimize_sellerNote_update_input").val());//需求备注
                    obj.wishPerson = [];
                    obj.ebayPerson = [];
                    obj.joomPerson = [];
                    obj.aliexpressPerson = [];
                    obj.amazonPerson = [];
                    obj.shopeePerson = [];
                    obj.todoPerson=[];
                    if (product_optimize_select_person == null || product_optimize_select_person.length == 0) {//没有选择销售人员
                        layer.msg("请至少选择一个销售人员", {icon: 0});
                        return false;
                    } else {
                        for (var i in product_optimize_select_person) {
                            var value =product_optimize_select_person[i].value||product_optimize_select_person[i];
                            if (value.indexOf("user") != -1) {//用户节点
                                obj.todoPerson.push(value);
                                var userId = value.split("_")[1];
                                if (value.indexOf("wish") != -1) {
                                    obj.wishPerson.push(userId);
                                } else if (value.indexOf("ebay") != -1) {
                                    obj.ebayPerson.push(userId);
                                } else if (value.indexOf("joom") != -1) {
                                    obj.joomPerson.push(userId);
                                } else if (value.indexOf("aliexpress") != -1 || value.indexOf("速卖通") != -1) {
                                    obj.aliexpressPerson.push(userId);
                                } else if (value.indexOf("amazon") != -1 || value.indexOf("亚马逊") != -1) {
                                    obj.amazonPerson.push(userId);
                                } else if (value.indexOf("shopee") != -1 || value.indexOf("虾皮") != -1) {
                                    obj.shopeePerson.push(userId);
                                }
                            }
                        }
                        ;
                        obj.wishPerson = obj.wishPerson.join(",");
                        obj.ebayPerson = obj.ebayPerson.join(",");
                        obj.joomPerson = obj.joomPerson.join(",");
                        obj.aliexpressPerson = obj.aliexpressPerson.join(",");
                        obj.amazonPerson = obj.amazonPerson.join(",");
                        obj.shopeePerson = obj.shopeePerson.join(",");
                        obj.todoPerson=obj.todoPerson.join(",");
                    }
                    var sellPlats = [];
                    $("#product_optimize_add_form").find(".layui-form-checked").each(function () {
                        sellPlats.push($(this).prev().val());
                    });
                    obj.sellPlats = sellPlats.join(",");
                    if (obj.platList == null || obj.platList == '') {
                        layer.msg("需求平台不能为空", {icon: 0});
                        return false;
                    } else if (obj.optimReason == null || obj.optimReason == '') {
                        layer.msg("优化方向不能为空", {icon: 0});
                        return false;
                    } else if (obj.developer == null || obj.developer == '') {
                        layer.msg("责任人不能为空", {icon: 0});
                        return false;
                    } else if (obj.sellPlats.length == 0) {
                        layer.msg("至少选择一个销售处理平台", {icon: 0});
                        return false;
                    } else if (obj.refLink == null || obj.refLink=="") {
                        layer.msg("参考链接不能为空", {icon: 0});
                        return false;
                    } else if (obj.sellerNote == null || obj.sellerNote == '') {
                        layer.msg("需求备注不能为空", {icon: 0});
                        return false;
                    } else {
                        $.ajax({
                            type: "post",
                            url: ctx + "/msgProdOptimization/addOneProductOptimization.html",
                            dataType: "json",
                            data: obj,
                            success: function (returnData) {
                                if (returnData.code == "0000") {
                                    layer.closeAll();
                                    layer.msg("添加商品优化成功", {icon: 1});
                                } else {
                                    layer.msg(returnData.msg, {icon: 5});
                                }
                            },
                            error: function () {
                                layer.msg("发送请求失败", {icon: 5});
                            }
                        })
                    }
                }//提交优化
            });
        }
    });
</script>