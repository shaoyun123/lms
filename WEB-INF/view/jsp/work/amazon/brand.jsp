<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <title>品牌</title>
    <style>
        .mg_20{
            margin:20px
        }
        .hidden{
            display: none;
        }
        .dis_flex{
            display: flex;
            justify-content: space-between;
        }
        .pageSort{
            display: block;
            width: 100%;
            background:#fff;
            position: fixed;
            left: 100px;
            bottom: 0;
        }
        .selectedLabel{
            padding:0px!important
        }
        .gray {
            color: gray;
        }

        .skyblue {
            color: skyblue;
        }
    </style>

    <div class="layui-fluid" id="LAY-AmazonBrand">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="AmazonBrandForm" lay-filter="AmazonBrandForm">
                            <div class="layui-form-item">

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">品牌名</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="brand" placeholder="单个模糊查询">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">创建人</label>
                                    <div class="layui-input-block dimSearchContent">
                                        <input type="hidden" name="creatorId">
                                        <div>
                                            <input name="" id="AmazonBrandForm_creatorId" type="text" class="layui-input" placeholder="渐进搜索">
                                        </div>
                                        <div class="AmazonBrandForm_dimResultDiv"></div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label selectedLabel ml5">
                                        <select name="timeType" >
                                            <option value="创建时间">创建时间</option>
                                            <option value="更新时间">更新时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" name="time" id="amazonBrandForm_time_input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">投诉次数</label>
                                    <div class="layui-input-block dis_flex">
                                        <input type="number" name="voteTotalTimesStart" class="layui-input">
                                        <span class="pd5"> ~ </span>
                                        <input type="number" name="voteTotalTimesEnd" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">排序</label>
                                    <div class="layui-input-block">
                                        <select name="sortStr">
                                            <option value="afb.id desc">创建时间降序</option>
                                            <option value="afb.id asc">创建时间升序</option>
                                            <option value="afbc.vote_total_times desc">投诉次数降序</option>
                                            <option value="afbc.vote_total_times asc">投诉次数升序</option>
                                            <option value="afb.modify_time desc"> 更新时间降序</option>
                                            <option value="afb.modify_time asc"> 更新时间升序</option>
                                        </select>
                                    </div>
                                </div>
                                <input type="hidden" name="limit" value="100">
                                <input type="hidden" name="page" value="1">
                                <input type="hidden" name="useType" value="0">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-input-block">
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="AmazonBrandSearch" lay-filter="AmazonBrandSearch">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="layui-tab" lay-filter="AmazonBrandTab" id="AmazonBrandTab">
                            <div class="dis_flex">
                            <ul class="layui-tab-title">
                                <li class="layui-this" data-index="0">未注册(<span>0</span>)</li>
                                <li data-index="1">已注册(<span>0</span>)</li>
                                <li data-index="3">检测中(<span>0</span>)</li>
                                <li data-index="2">黑名单(<span>0</span>)</li>
                                <li data-index="4">白名单(<span>0</span>)</li>
                            </ul>
                            <div>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" id="AmazonBrandUpdate">批量修改</button>
                                <button class="layui-btn layui-btn-sm layui-btn-normal" id="AmazonBrandNew">新增</button>
                            </div>
                            </div>
                            <div class="layui-tab-content">
                                <div class="layui-tab-item layui-show">
                                    <table lay-filter="AmazonBrand_table" class="layui-table" id="AmazonBrand_table"></table>
                                    <div id="amazonBrandPage" class="pageSort"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <script type="text/html" id="AmazonBrand_tool">
        <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="amazonbrand_modify">修改</button>
        <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="amazonbrand_del">删除</button>
    </script>

    <script type="text/html" id="AmazonBrand_modify">
        <form class="layui-form mg_20" lay-filter="amazonBrandeditForm" id="amazonBrandeditForm">
            <div class="layui-form-item">
                <label class="layui-form-label">类型</label>
                <div class="layui-input-block">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="0" title="未注册">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="1" title="已注册">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="2" title="黑名单" >
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="4" title="白名单" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">品牌名</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="brand" lay-verify="required">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea type="text" class="layui-textarea" name="remark" lay-verify="required"></textarea>
                </div>
            </div>
            <input type="hidden" name="id">
            <button type="button" class="hidden" lay-submit lay-filter="amazonBrandeditSubmit" id="amazonBrandeditSubmit"></button>
        </form>
    </script>

    <script type="text/html" id="AmazonBrand_update">
        <form class="layui-form mg_20" lay-filter="amazonBrandeditForm" id="amazonBrandUpdateForm">
            <div class="layui-form-item">
                <label class="layui-form-label">类型</label>
                <div class="layui-input-block">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="0" title="未注册">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="1" title="已注册">
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="2" title="黑名单" >
                    <input type="radio" name="useType" lay-verify="otherReq" lay-filter="useType" value="4" title="白名单" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea type="text" class="layui-textarea updateRemark" name="remark" lay-verify="required"></textarea>
                </div>
            </div>
            <button type="button" class="hidden" lay-submit lay-filter="amazonBrandUpdateSubmit" id="amazonBrandUpdateSubmit"></button>
        </form>
    </script>

<script type="text/html" id="AmazonBrand_brandTpl">
    <div class="text_l"><span></span><span><a href="{{d.brandSearchSrc}}" class="skyblue" target="_black">{{d.brand||""}}</a>[<a href="{{d.brandRegistCheckSrc}}" class="gray" target="_black">检查</a></span>]</div>

</script>

    <script src="${ctx}/static/js/work/amazon/amazonBrand.js"></script>