<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>产品表现</title>
<style>
    #LAY-Productperformance .layTitle:hover::after {
        width: 200px;
        height: 20px;
        line-height: 20px;
    }

    #Productperformance_tabledetail #Productperformance_detail_search_form .layTitle:hover::after {
        width: 200px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .Productperformance_casin_hide_div {
        display: none;
    }
</style>
<div class="layui-fluid" id="LAY-Productperformance">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="Productperformance_search_form"
                          lay-filter="Productperformance_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">ASIN类型</label>
                                <div class="layui-input-block">
                                    <select name="searchType" lay-filter="Productperformance_asin"
                                            id="Productperformance_asin">
                                        <option value="1">ASIN</option>
                                        <option value="2">父ASIN</option>
                                    </select>

                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select
                                            name="siteIdList"
                                            id="Productperformance_site"
                                            lay-filter="Productperformance_site"
                                            xm-select="Productperformance_site"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                            xm-select-type="1">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select
                                            id="Productperformance_online_store_sel"
                                            xm-select="Productperformance_online_store_sel"
                                            class="users_hp_store_multi"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                            data-platcode="amazon"
                                            name="storeAcctIdList">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="Productperformance_timerange_input"
                                           id="Productperformance_timerange_input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel Productperformance_pasin_hide_div">
                                    <select name="searchKey">
                                        <option value="1">ASIN</option>
                                        <option value="2">父ASIN</option>
                                        <option value="3">SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block Productperformance_pasin_hide_div">
                                    <input type="text" class="layui-input" name="searchValue" placeholder="搜索内容">
                                </div>
                                <div class="layui-form-label Productperformance_casin_hide_div">ASIN</div>
                                <div class="layui-input-block Productperformance_casin_hide_div">
                                    <input type="text" class="layui-input" name="asinOrParentAsinParam"
                                           placeholder="父ASIN 或子ASIN">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="numsKey">
                                        <option value="1">销量</option>
                                        <option value="2">订单量</option>
                                        <option value="3">广告总订单量</option>
                                        <option value="4">广告直接订单量</option>
                                        <option value="5">广告间接订单量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="numsValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="numsValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="amountKey">
                                        <option value="1">销售额</option>
                                        <option value="2">广告总销售额</option>
                                        <option value="3">广告直接销售额</option>
                                        <option value="4">广告间接销售额</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="amountValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="amountValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="refundKey" lay-filter="Productperformance_refundKey">
                                        <option value="1">退款量</option>
                                        <option value="2">退款率</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="refundValueBegin" id="refundValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="refundValueEnd" id="refundValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="rankingKey">
                                        <option value="1">最新排名</option>
                                        <option value="2">评分</option>
                                        <option value="3">评论</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="rankingValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="rankingValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="advertisingShowKey">
                                        <option value="1">展示</option>
                                        <option value="2">点击</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="advertisingShowValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="advertisingShowValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="advertisingCostKey">
                                        <option value="1">花费</option>
                                        <option value="2">CPC</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="advertisingCostValueBegin" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                    <input name="advertisingCostValueEnd" class="layui-input" min="0"
                                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="ctrKey">
                                        <option value="1">CTR</option>
                                        <option value="2">ACOS</option>
                                        <option value="3">ACOAS</option>
                                        <option value="4">ASOAS</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input name="ctrValueBegin" class="layui-input" type="number" min="0" max="0"
                                           onkeyup="if(this.value && ! /^(0(\.\d+)?|1(\.0+))$/.test(this.value)){alert('只能输入大于等于0 小于1');this.value='';}">
                                    <input name="ctrValueEnd" class="layui-input" type="number" min="0" max="0"
                                           onkeyup="if(this.value && ! /^(0(\.\d+)?|1(\.0+))$/.test(this.value)){alert('只能输入大于等于0 小于1');this.value='';}">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <button id="Productperformance_searchBtn" class="layui-btn layui-btn-sm"
                                        type="button" lay-filter="">搜索
                                </button>
                            </div>
                            <p style="color: red;float: right;">* 仅支持查询最近2个月的数据</p>
                        </div>
                    </form>
                </div>
            </div>

            <div class="layui-card">
                <table class="layui-table" lay-filter="Productperformance_data_table"
                       id="Productperformance_data_table"></table>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="Productperformance_imageTp1">
    <div class="layui-form-item">
        {{# if(d.fen){ }}
        <div>总计</div>
        {{# }else{ }}
        {{# if(d.asinList){ }}
        <div class="layui-col-md2 layui-col-lg2">
            <span style="font-size: 30px;" lay-event="Productperformance_asinadd">+</span>
        </div>
        <div class="layui-col-md4 layui-col-lg4">
            {{# if(d.picUrl){ }}
            <div>
                <img width="40" height="40" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy"
                     data-onerror="layui.admin.img_noFind()" src="{{d.picUrl}}">
            </div>
            {{# } }}
        </div>
        <div class="layui-col-md4 layui-col-lg4">
            {{# if(d.searchType === 2){ }}

            <a class="asin" target="_blank" style="color:#01AAED" href="{{d.parentAsinSrc}}">{{d.parentAsin}}</a>
            {{# }else{ }}
            <a class="asin" target="_blank" style="color:#01AAED" href="{{d.asinSrc}}">{{d.asin}}</a>
            {{# }; }}
            {{# if(d.minPrice === d.maxPrice){ }}
            <div>{{d.maxPrice}}</div>
            {{# } }}
            {{# if(d.minPrice != d.maxPrice){ }}
            <div>{{d.minPrice}}-{{d.maxPrice}}</div>
            {{# } }}
        </div>
        {{# }else{ }}
        <div class="layui-col-md3 layui-col-lg3">
            {{# if(d.picUrl){ }}
            <div>
                <img width="40" height="40" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy"
                     data-onerror="layui.admin.img_noFind()" src="{{d.picUrl}}">
            </div>
            {{# } }}
        </div>
        <div class="layui-col-md9 layui-col-lg9">
            <a class="asin" target="_blank" style="color:#01AAED" href="{{d.asinSrc}}">{{d.asin}}</a>
            {{# if(d.minPrice === d.maxPrice){ }}
            <div>{{d.maxPrice}}</div>
            {{# } }}
            {{# if(d.minPrice != d.maxPrice){ }}
            <div>{{d.minPrice}}-{{d.maxPrice}}</div>
            {{# } }}
        </div>
        {{# }; }}

        {{# }; }}
    </div>
</script>
<script type="text/html" id="Productperformance_imageTp2">
    <div class="layui-form-item">
        {{# if(d.fen){ }}
        <div>总计</div>
        {{# }else{ }}
        {{# if(d.asinList){ }}
        <div class="layui-col-md2 layui-col-lg2">
            <span style="font-size: 30px;" lay-event="Productperformance_asinadd">+</span>
        </div>
        <div class="layui-col-md4 layui-col-lg4">
            {{# if(d.picUrl){ }}
            <div>
                <img width="40" height="40" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy"
                     data-onerror="layui.admin.img_noFind()" src="{{d.picUrl}}">
            </div>
            {{# } }}
        </div>
        <div class="layui-col-md4 layui-col-lg4">
            <a class="asin" target="_blank" style="color:#01AAED" href="{{d.parentAsinSrc}}">{{d.parentAsin}}</a>
            {{# if(d.minPrice === d.maxPrice){ }}
            <div>{{d.maxPrice}}</div>
            {{# } }}
            {{# if(d.minPrice != d.maxPrice){ }}
            <div>{{d.minPrice}}-{{d.maxPrice}}</div>
            {{# } }}
        </div>
        {{# }else{ }}
        <div class="layui-col-md3 layui-col-lg3">
            {{# if(d.picUrl){ }}
            <div>
                <img width="40" height="40" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy"
                     data-onerror="layui.admin.img_noFind()" src="{{d.picUrl}}">
            </div>
            {{# } }}
        </div>
        <div class="layui-col-md9 layui-col-lg9">
            <a class="asin" target="_blank" style="color:#01AAED" href="{{d.asinSrc}}">{{d.asin}}</a>
            {{# if(d.minPrice === d.maxPrice){ }}
            <div>{{d.maxPrice}}</div>
            {{# } }}
            {{# if(d.minPrice != d.maxPrice){ }}
            <div>{{d.minPrice}}-{{d.maxPrice}}</div>
            {{# } }}
        </div>
        {{# }; }}

        {{# }; }}
    </div>
</script>
<!-- 列表数据加% -->
<script type="text/html" id="Productperformance_data1">
    <span>{{d.cpc}}%</span>
</script>
<script type="text/html" id="Productperformance_data2">
    <span>{{d.ctr}}%</span>
</script>
<script type="text/html" id="Productperformance_data3">
    <span>{{d.acos}}%</span>
</script>
<script type="text/html" id="Productperformance_data4">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="Productperformance_data5">
    <span>{{d.asoas}}%</span>
</script>
<script type="text/html" id="Productperformance_data6">
    <span>{{d.advertisingTotalOrderRate}}%</span>
</script>
<!-- 子列表数据展示 -->
<script type="text/html" id="Productperformance_datas1">
    <span>{{d.cpc}}%</span>
</script>
<script type="text/html" id="Productperformance_datas2">
    <span>{{d.ctr}}%</span>
</script>
<script type="text/html" id="Productperformance_datas3">
    <span>{{d.acos}}%</span>
</script>
<script type="text/html" id="Productperformance_datas4">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="Productperformance_datas4">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="Productperformance_datas6">
    <span>{{d.advertisingTotalOrderRate}}%</span>
</script>
<!-- 详情列表展示 -->
<script type="text/html" id="Productdetails_data1">
    <span>{{d.ctr}}%</span>
</script>
<script type="text/html" id="Productdetails_data2">
    <span>{{d.cpc}}%</span>
</script>
<script type="text/html" id="Productdetails_data3">
    <span>{{d.acos}}%</span>
</script>
<script type="text/html" id="Productdetails_data4">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="Productdetails_data5">
    <span>{{d.asoas}}%</span>
</script>
<script type="text/html" id="Productdetails_data6">
    <span>{{d.advertisingTotalOrderRate}}%</span>
</script>
<script type="text/html" id="Productperformance_table1">
    {{#  if(!d.fen){ }}
    <div style="color: #01aaef;cursor: pointer;">
        <i class="layui-icon" style="font-size: 20px;" lay-event="Productperformance_detail">&#xe62c;</i>
    </div>
    {{#  } }}

</script>

<script type="text/html" id="Productperformance_table2">
    {{#  if(!d.fen){ }}
    <div style="color: #01aaef;cursor: pointer;">
        <i class="layui-icon" style="font-size: 20px;" lay-event="Productperformance_detail_table2">&#xe62c;</i>
    </div>
    {{#  } }}

</script>
<!-- 表现详情 -->
<script type="text/html" id="Productperformance_tabledetail">
    <div class="layui-form-item" style="margin-top:20px">
        <div></div>
        <div class="layui-col-md1 layui-col-lg1">
            <div style="margin-left:40px">
                <img width="50" height="50" data-original="" class="img_show_hide b1"
                     data-onerror="layui.admin.img_noFind()" id="Productperformance_tabledetail_img">
            </div>

        </div>
        <div class="layui-col-md4 layui-col-lg4">

            <div class="layui-form-item" style="margin-top:30px">
                <span id="Productperformance_tabledetail_asin_info"></span>
            </div>

        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="Productperformance_detail_search_form"
                  lay-filter="Productperformance_detail_search_form">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="Productperformance_detail_timerange_input"
                                   id="Productperformance_detail_timerange_input" readonly>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">时间周期</label>
                        <div class="layui-input-block">
                            <select name="statisticsPeriod" lay-filter="Productperformance_detail_cycle">
                                <option value="day">日</option>
                                <option value="week">周</option>
                                <option value="month">月</option>

                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md1 layui-col-lg1 layui-col-lg-offset2 layui-col-md-offset2">
                        <input type="number" class="layui-input" name="grossProfitMarginName" placeholder="请输入毛利率(%)" >
                    </div>
                    <div class="layui-col-md1 layui-col-lg1">
                        <input type="number" class="layui-input" name="couponDiscountName" placeholder="优惠券折扣(%)" >
                    </div>
                    <div class="layui-col-md1 layui-col-lg1">
                        <input type="number" class="layui-input" name="couponExchangeRateName" placeholder="优惠券兑换率(%)" >
                    </div>
                    <div class="layui-col-md1 layui-col-lg1" style="text-align: right">
                        <a class="layui-btn layui-btn-sm layui-btn-normal" id="PPFM_apply">一键应用</a>
                    </div>
                </div>
            </form>
            <table class="layui-table" lay-filter="Productperformance_datadetail_table"
                   id="Productperformance_datadetail_table"></table>

        </div>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/Productperformance.js"></script>

