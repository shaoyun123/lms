<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <title>Amazon投诉</title>
    <style>
        .mg_20{
            margin:20px
        }
        .hidden{
            display: none;
        }
        .b1 {
            border: 1px solid #ccc
        }
        
        .text_l {
            text-align: left;
        }
        
        .gray {
            color: gray;
        }
        
        .skyblue {
            color: skyblue;
        }
        
        .mg_20 {
            margin: 20px
        }
        
        .lh36 {
            line-height: 36px;
        }
        
        .dis_flex {
            display: flex;
            justify-content: space-between;
        }

        .selectedLabel{
            padding:0px!important
        }

        .pd5{
            padding:5px;
        }

        .ml5{
            margin-left:5px
        }

        .fr{
            float: right;
        }
        .pageSort{
            display: block;
            width: 100%;
            background:#fff;
            position: fixed;
            left: 100px;
            bottom: 0;
        }
    </style>

    <div class="layui-fluid" id="LAY-AmazonComplaint">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="AmazonComplaintForm" lay-filter="AmazonComplaintForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select lay-filter="AmazonComplaint_orgTree" class="orgs_hp_custom" lay-search></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                    <select name="creatorId" lay-filter="AmazonComplaint_userList" class="users_hp_custom"
                                            data-rolelist="amazon专员"  lay-search>
                                    </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="storeAcctId" lay-filter="AmazonComplaint_selAcct" class="store_hp_custom"
                                        data-platcode="amazon" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label ">站点</label>
                                    <div class="layui-input-block">
                                        <select name="salesSite" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="strType">
                                            <option value="brandStr">品牌</option>
                                            <option value="asinStr">ASIN</option>
                                            <option value="prodSSkuStr">商品sku</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="strValue" class="layui-input" placeholder="多个使用逗号分隔">
                                    </div>
                                </div>
                                <input type="hidden" name="limit" value="100">
                                <input type="hidden" name="page" value="1">
                                <!-- 分页表格名称 -->
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-input-block fr">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="AmazonComplaintSearch" lay-filter="AmazonComplaintSearch">查询
                                    </button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab">
                            <div class="fr"><button class="layui-btn layui-btn-sm layui-btn-normal" id="AmazonComplaintNew">新增</button></div>
                            <div class="layui-tab-content">
                                <div class="layui-tab-item layui-show">
                                    <table lay-filter="AmazonComplaint_table" class="layui-table" id="AmazonComplaint_table"></table>
                                    <div id="AmazonComplaintPage" class="pageSort"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script type="text/html" id="AmazonComplaint_tool">
        <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="amazoncomplaint_modify">修改</button>
        <br/>
        <button type="button" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="amazoncomplaint_remove">移除</button>
        <br/>
        <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="amazoncomplaint_offshelf">下架该品牌Listing</button>
    </script>

    <script type="text/html" id="AmazonComplaint_time">
        <div class="text_l"><span class="gray">创建:</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}} </span></div>
        <div class="text_l"><span class="gray">修改:</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </script>

    <script type="text/html" id="AmazonComplaint_modify">
        <form class="layui-form mg_20" lay-filter="amazonComplainteditForm" id="amazonComplainteditForm">
            <div class="layui-form-item">
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                    <select name="storeAcctId"></select>
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                    <select name="salesSite"></select>
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">品牌</label>
                    <div class="layui-input-block">
                    <input type="text" class="layui-input" name="brand">
                    </div>
                </div>
                <div class="layui-col-lg6 layui-col-md6">
                    <label class="layui-form-label">子ASIN</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="asin">
                    </div>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                    </div>
                </div>
            </div>
            <input type="hidden" name="id">
            <button type="button" class="hidden" lay-submit lay-filter="amazonComplainteditSubmit" id="amazonComplainteditSubmit"></button>
        </form>
    </script>

    <script src="${ctx}/static/js/work/amazon/amazonComplaint.js"></script>