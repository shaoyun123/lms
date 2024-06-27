<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>

<head>
    <title>下架Listing</title>
    <style>
        .redStar:before{
            content: "*";
            color: red;
            font-size: 20px;
            position: relative;
            top: 7px;
            right: 10px;
        }
    </style>
</head>

<body>
<div class="layui-fluid" id="LAY-lazadaDeleteListing">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="lazadaDeleteListingForm" class="layui-form">
                        <h2 class="mb10">筛选方式</h2>
                        <div>提示：以下四种方式至少选择一种</div>
                        <div id="lazadaLSL">
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select name="salePersonIdList" id="lazadaLSL_userList"
                                                class="users_hp_custom" lay-filter="lazadaLSL_userList"
                                                data-rolelist="lazada专员" xm-select="lazadaLSL_userList" xm-select-search
                                                xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <div name="storeAcctIdList" data-platcode="lazada" xm-select="lazadaLSL_storeAcct" lay-filter="lazadaLSL_storeAcct" class="users_hp_store_multi" id="lazadaLSL_storeAcct"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select id="lazadaLSL_site" lay-filter="lazadaLSL_site"
                                                name="saleSiteList"
                                                xm-select="lazadaLSL_site" class="salesSite_hp_custom_multi" xm-select-search
                                                xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">商品标签</label>
                                    <div class="layui-input-block">
                                        <select id="lazadaLSL_prodTag" lay-filter="lazadaLSL_prodTag"
                                                name="prodAttrs"
                                                xm-select="lazadaLSL_prodTag" class="salesSite_hp_custom_multi" xm-select-search
                                                xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 class="mb10">筛选条件</h2>
                        <div>提示：若选择了条件”在线数量是否为0“，店铺必选，且仅支持最大选择100个店铺</div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label redStar">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="isSaleList" xm-select="lazadaLSL_isSaleList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option ></option>
                                        <option value="2">全部在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label redStar">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly
                                           id="lsl_Time"
                                           name="lsl_Time" placeholder="请选择">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label redStar">销量</label>
                                <div class="layui-input-block">
                                    <select name="saleCountType">
                                        <option value="">请选择</option>
                                        <option value="1">30天=0</option>
                                        <option value="2">60天=0</option>
                                        <option value="3">90天=0</option>
                                        <option value="4">180天=0</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortBanListing">
                                        <option value="">请选择</option>
                                        <option value="ANY_PLAT">任一平台侵权</option>
                                        <option value="CURRENT_PLAT">lazada侵权</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">禁售站点</label>
                                <div class="layui-input-block">
                                    <select id="lazadaLSL_saleSite" lay-filter="lazadaLSL_saleSite"
                                            name="prohibitSaleSiteList"
                                            xm-select="lazadaLSL_saleSite" class="salesSite_hp_custom_multi" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">在线数量是否为0</label>
                                <div class="layui-input-block">
                                    <select name="preAvailableStockIsZero">
                                        <option value="">全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">评分次数</label>
                                <div class="layui-input-block">
                                    <select name="hasReview">
                                        <option value=""></option>
                                        <option value="2">有评分次数</option>
                                        <option value="1">无评分次数</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <a class="layui-btn layui-btn-normal flo"
                               id="lSL_log"
                               style="float: right;">执行日志</a>
                        <permTag:perm funcCode="lazada_lower_listing_immediately">
                            <a class="layui-btn layui-btn-normal flo"
                               id="lSL_ImmediatelyBtn"
                               style="float: right;margin-right: 10px;">立即执行</a>
                        </permTag:perm>
                        </div>
                        <div style="clear: both;"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<script type="text/javascript">
    layui.use(['form', 'layer', 'laydate', 'formSelects'], function () {
        var form = layui.form,
            layer = layui.layer,
            formSelects = layui.formSelects,
            laydate = layui.laydate,
            $ = layui.$;

        formSelects.render('lazadaLSL_userList');
        formSelects.render("lazadaLSL_isSaleList")
        // 站点
        commonReturnPromise({
            url: `/lms/onlineProductLazada/getAllSite.html`,
            type: 'GET'
        }).then(res=>{
            commonRenderSelect("lazadaLSL_site", res, {
                name: 'name',
                code: 'code'
            }).then(() => formSelects.render("lazadaLSL_site"))
            commonRenderSelect("lazadaLSL_saleSite", res, {
                name: 'name',
                code: 'code'
            }).then(() => formSelects.render("lazadaLSL_saleSite"))
        })
        // 商品标签
        commonReturnPromise({
            url: `/lms/product/getProdTags.html`,
            type: 'POST'
        }).then(res=>{
            commonRenderSelect("lazadaLSL_prodTag", res, {
                name: 'name',
                code: 'name'
            }).then(() => formSelects.render("lazadaLSL_prodTag"))
        })
        render_hp_orgs_users("#lazadaLSL"); //渲染部门销售员店铺三级联动

        laydate.render({
            elem: '#lsl_Time',
            range: true
        });

        // 立即执行
        $("#lSL_ImmediatelyBtn").click(function(){
            let data = serializeObject($("#lazadaDeleteListingForm")),obj={};
            if(data.select != ''||data.select != undefined){
                data.storeAcctIdList = data.select
            }
            let isSaleList = formSelects.value('lazadaLSL_isSaleList', 'val');
            if(data.lsl_Time == ''||isSaleList.length == 0||data.saleCountType==''){
                return layer.msg("必填项不能为空")
            }
            if(data.prodAttrs == ''&&data.saleSiteList==''&&data.salePersonIdList==''&&data.storeAcctIdList==''){
                return layer.msg("必填项不能为空")
            }
            obj["prodAttrs"] = (data.prodAttrs == ''?[]:data.prodAttrs.split(","));
            obj["saleSiteList"] = data.saleSiteList == ''?[]:data.saleSiteList.split(",");
            obj["salePersonIdList"] = data.salePersonIdList == ''?[]:data.salePersonIdList.split(",");
            obj["storeAcctIdList"] = data.storeAcctIdList == ''?[]:data.storeAcctIdList.split(",");
            obj["listingTimeGreatThen"] = data.lsl_Time.split(" - ")[0] + ' 00:00:00';
            obj["listingTimeLessThen"] = data.lsl_Time.split(" - ")[1] + ' 23:59:59';
            obj["isSaleList"] = isSaleList;
            obj["saleCountType"] = data.saleCountType;
            obj["tortBanListing"] = data.tortBanListing;
            obj["preAvailableStockIsZero"] = data.preAvailableStockIsZero;
            obj["hasReview"] = data.hasReview;
            obj["salesSites"] = (data.prohibitSaleSiteList == ''? [] : data.prohibitSaleSiteList.split(","));
            getBatchEnableProductCount(obj).then(res=>{
                if(res.code == '0000'){
                    let dataCount = res.data;
                        layer.confirm('本次执行下架的listing数量为'+ dataCount +'，请确认是否全部进行下架，或者设置固定下架数量',
                         {
                             btn:["确定", "设置下架数量", "取消"]
                         }, function () {
                             batchEnableProduct(obj).then(result=>{
                                 layer.alert(result.data,{icon:1})
                             }).catch(err=>{
                                 layer.alert(err||"请求接口失败",{icon:2})
                             })
                        },function(){
                            let str = `<div style="padding:10px">
                                        提示：
                                        <p>1.符合下架条件的listing数量为${"${dataCount}"}</p>
                                        <p>2.点击确认后，会按照listing刊登时间倒序下架符合数量的listing</p>
                                        <p>3. 0＜设置的数量 ≤ ${"${dataCount}"}，仅支持填写正整数</p>
                                        <div style="display: flex;margin-top:10px;">
                                            <span>设置下架数量：</span>
                                            <input type="text" class="layui-input" name="lowerCount" style="width:300px;">
                                        </div>
                                        </div>`
                            layer.open({
                                type: 1,
                                title: '设置固定下架数量',
                                area: ['500px', '300px'],
                                btn: ['确认', '取消'],
                                id: new Date().getTime(),
                                content: str, //iframe的url
                                success: function(layero, index){
                                    $(layero).find("[name=lowerCount]").blur(function(){
                                        let lowerCount = $(layero).find("[name=lowerCount]").val() * 1,isChecked = false;
                                        if(lowerCount == ''){
                                            layer.open({
                                                type: 1,
                                                title: '提示',
                                                id: new Date().getTime(),
                                                content: '<div style="padding:20px;font-size: 20px">请输入需要下架的listing数量</div>',
                                            })
                                            isChecked = true;
                                        }
                                        if(!isChecked && (lowerCount <= 0 || lowerCount > dataCount*1 || lowerCount.toString().includes("."))){
                                            layer.open({
                                                type: 1,
                                                title: '提示',
                                                id: new Date().getTime(),
                                                content: '<div style="padding:20px;font-size: 20px">输入数量不合法</div>',
                                            })
                                            if(lowerCount > dataCount*1){
                                                $(layero).find("[name=lowerCount]").val(dataCount)
                                            }
                                        }
                                    })
                                },yes: function(index, layero) {
                                    let lowerCount = $(layero).find("[name=lowerCount]").val() * 1,isChecked = false;
                                    if(lowerCount == ''){
                                        layer.open({
                                            type: 1,
                                            title: '提示',
                                            id: new Date().getTime(),
                                            content: '<div style="padding:20px;font-size: 20px">请输入需要下架的listing数量</div>',
                                        })
                                        isChecked = true;
                                    }
                                    if(!isChecked && (lowerCount <= 0 || lowerCount > dataCount*1 || lowerCount.toString().includes("."))){
                                        layer.open({
                                            type: 1,
                                            title: '提示',
                                            id: new Date().getTime(),
                                            content: '<div style="padding:20px;font-size: 20px">输入数量不合法</div>',
                                        })
                                        if(lowerCount > dataCount*1){
                                            $(layero).find("[name=lowerCount]").val(dataCount)
                                        }
                                        isChecked = true;
                                    }
                                    obj.updateCount = lowerCount
                                    if(!isChecked){
                                        batchEnableProduct(obj).then(result=>{
                                            layer.closeAll()
                                            layer.alert(result.data,{icon:1})
                                        }).catch(err=>{
                                            layer.closeAll()
                                            layer.alert(err||"请求接口失败",{icon:2})
                                        })
                                    }
                                }
                            });
                        return false
                    })
                }else{
                    layer.alert(res.msg|| "请求接口失败",{icon:2})
                }
            }).catch(err=>{
                layer.alert(err,{icon:2})
            })
        })

        // 执行日志
        $("#lSL_log").click(function(){
            getBatchEnableProductLog().then(res=>{
                let str = '<div style="margin:10px;">';
                res.forEach(item => {
                    str += item + '</br>'
                })
                str += '</div>'
                layer.open({
                    title: '执行日志',
                    type: 1,
                    area: ['500px', '50%'],
                    btn: ['关闭'],
                    id: new Date().getTime(),
                    content: str
                })
            })
        })

        // 批量下架获取本次下架数量
        function getBatchEnableProductCount(obj) {
            return commonReturnPromiseRes({
                url: ctx + '/lazadaBatchOperation/getBatchEnableProductCount',
                contentType: 'application/json',
                type: 'post',
                params: JSON.stringify(obj)
            })
        }

        // 批量下架提交
        function batchEnableProduct(data) {
            return commonReturnPromiseRes({
                url: ctx + '/lazadaBatchOperation/batchEnableProduct',
                contentType: 'application/json',
                type: 'post',
                params: JSON.stringify(data)
            })
        }

        // 批量下架查询日志
        function getBatchEnableProductLog() {
            return commonReturnPromise({
                type: 'get',
                url: ctx + '/lazadaBatchOperation/getBatchEnableProductLog'
            })
        }
    })
</script>