<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <style>
        .fr {
            float: right;
            margin-left: 0;
        }
        
        .skyblue {
            color: skyblue;
        }
        
        .green {
            color: green;
        }
        
        .red {
            color: red;
        }
        
        .gray {
            color: #cccccc
        }
        
        .text_l {
            text-align: left;
        }
        
        .pointer {
            cursor: pointer;
        }
        
        .hide {
            display: none;
        }
    </style>
    <title>FBA销量统计</title>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-form">
                            <form class="layui-form" lay-filter="FBAsellstatics_form" id="FBAsellstatics_form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="FBAsellcount_orgFilter" class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">销售员</label>
                                        <div class="layui-input-block">
                                            <select name="salePersonId" class="users_hp_custom" data-rolelist="amazon专员" lay-filter="FBAsellcount_sellerFilter" lay-search="">
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select name="storeAcctIds" class="store_hp_custom" data-platcode="amazon" lay-filter="FBAsellcount_store" lay-search="">
                                            <option value="">全部</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">站点</label>
                                        <div class="layui-input-block">
                                            <select name="saleSite" id="FBAsellcount_amazonSite" lay-search="">
                                            <option value="">全部</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">统计</label>
                                        <div class="layui-input-block">
                                            <input type="radio" name="showType" value="1" title="销量">
                                            <input type="radio" name="showType" value="2" title="订单量">
                                            <input type="radio" name="showType" value="3" title="销售额" checked>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="layui-form-label" style="padding:0">
                                            <select name="uniqueType">
                                    <option value="1">ASIN</option>
                                    <option value="2">ParentASIN</option>
                                    <option value="3">MSKU</option>
                                </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="searchStr">
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">币种</label>
                                        <div class="layui-input-block">
                                            <select name="currencyType">
                                            <option value="2">人民币</option>
                                            <option value="1">美元</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">统计时间</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" readonly id="FBAsellcount_counttime" lay-verify="required" name="time">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1 fr">
                                        <button type=button class="layui-btn layui-btn-sm layui-btn-normal fr" id="FBAsellcount_submit" lay-submit lay-filter="FBAsellcount_submit">查询</button>
                                    </div>
                                    <input type="hidden" name="isSortByTotal" value="1">
                                    <input type="hidden" name="sortDate" value="0">
                                    <input type="hidden" name="sortType" value="0">
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card" id="FBAsellstatics_card">
                        <div class="layui-card-body">
                            <table class="layui-table" lay-filter="FBAsellstatics_table" id="FBAsellstatics_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 表格渲染模板 -->
    <script type="text/html" id="FBAsellcountimg_tpl">
        {{# if(d.image){ }}
        <div>
            <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        </div>
        {{# } }}
    </script>
    <script type="text/html" id="FBAsellcountsalSiteandsalesman_tpl">
        {{# if(d.saleSite){ }}
        <div class="text_l"><span class="gray">站点：</span>{{d.saleSite||""}}</div>
        <div class="text_l"><span class="gray">销售员：</span>{{d.userName||""}}</div>
        {{# } }}
    </script>

    <script type="text/html" id="FBAsellcountasin_tpl">
        {{# for(var i in d.asin){ }}
        <div><a class="skyblue" target="_blank" href="{{d.asin[i].asinUrl}}">{{d.asin[i].asin||''}}</a></div>
        {{# } }} {{# for(var i in d.asin){ }} {{# if(i>1){ }}
        <div class="hide showsku"><a class="skyblue" target="_blank" href="{{d.asin[i].asinUrl}}">{{d.asin[i].asin||''}}</a></div>
        {{# }else{ }} {{# } }} {{# } }} {{# if((d.asin||[]).length>2){ }}
        <div class="skyblue FBAsellcountexpand pointer" data-open="close">展开</div>
        {{# } }}
    </script>

    <script type="text/html" id="FBAsellcountparent_tpl">
        {{# for(var i in d.parentAsin){ }} {{# if(i>1){ }}
        <div class="hide showsku">{{d.parentAsin[i]||""}}</div>
        {{# }else{ }}
        <div>{{d.parentAsin[i]||""}}</div>
        {{# } }} {{# } }} {{# if((d.parentAsin||[]).length>2){ }}
        <div class="skyblue FBAsellcountexpand pointer" data-open="close">展开</div>
        {{# } }}
    </script>

    <script type="text/html" id="FBAsellcountseller_tpl">
        {{# for(var i in d.sellerSku){ }} {{# if(i>1){ }}
        <div class="hide showsku">{{d.sellerSku[i]||""}}</div>
        {{# }else{ }}
        <div>{{d.sellerSku[i]||""}}</div>
        {{# } }} {{# } }} {{# if((d.sellerSku||[]).length>2){ }}
        <div class="skyblue FBAsellcountexpand pointer" data-open="close">展开</div>
        {{# } }}
    </script>

    <script type="text/html" id="FBAsellcountdiff_tpl">
        <div class="text_l"><span class="gray">最新排名：</span>{{d.saleRank||""}}</div>
        <div class="text_l"><span class="gray">销售浮动：</span> {{# if(d.saleRankDiff>=0){ }}
            <span class="green">{{d.saleRankDiff||""}}</span> {{# }else{ }}
            <span class="red">{{d.saleRankDiff||""}}</span> {{# }}}
        </div>
    </script>

    <script type="text/javascript" src="${ctx}/static/js/statistics/amazon/FBAsellcount.js"></script>s