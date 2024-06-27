<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>修改标题和描述</title>
        <style>
            .dis_flex {
                display: flex;
                justify-content: space-between
            }
            
            .layui-form-select dl {
                z-index: 99999
            }
            
            .card-header {
                background: #ccc;
                line-height: 42px;
                margin: 10px 0;
                padding: 0 10px;
            }
            
            .itemcard {
                margin: 10px 0;
            }
            
            .card-header .layui-form-checkbox span {
                color: #4a4a4a;
                font-weight: bold;
                font-size: 20px
            }
            
            .ebayPublishStyleLeftBar {
                float: left;
                border: 1px solid #e8e8e8;
                border-left: none;
                border-top: none;
                box-sizing: border-box;
                width: 150px;
            }
            
            .ebayPublishStyleLeftBar>div {
                width: 100%;
                text-align: center;
                padding: 9px 0;
                cursor: pointer;
            }
            
            .ebayPublishStyleRightTem {
                /* background: #ffff00; */
                overflow: hidden;
            }
            
            .ebayPublishStyleRightTem>ul>li {
                width: 16%;
                text-align: center;
                cursor: pointer;
                float: left;
                margin: 10px;
                vertical-align: bottom;
            }
            
            .ebayPublishStyleRightTem>ul>li>img {
                width: 122px;
                height: 113px;
            }
            
            .et_activeStyle {
                opacity: 0.5;
            }
            
            .layui-table td {
                word-break: break-all !important;
            }

            
            .xm-select-parent .xm-form-select dl {
                position: static !important;
            }
        </style>
        <div class="layui-fluid">
            <template class="layui-row layui-col-space15" id="lazada-modifydescripe">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form lazadaModifyTitleAndDesc">
                                <div class="dis_flex">
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-inline">
                                        <input type="checkbox" :checked="isAll" name="chenckall" title="全部" lay-skin="primary" lay-filter="chenckall">
                                    </div>
<%--                                    <div class="layui-inline">--%>
<%--                                            <label class="layui-form-label">标题</label>--%>
<%--                                        <div class="layui-input-inline">--%>
<%--                                            <input type="text" name="lazadaModify_old_string" id="lazadaModify_old_string" autocomplete="off" class="layui-input" v-model="lazadaModify_old_string">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
<%--                                    <div class="layui-inline">--%>
<%--                                        <label class="layui-form-label">替换为</label>--%>
<%--                                        <div class="layui-input-inline">--%>
<%--                                            <input type="text" name="lazadaModify_new_string" id="lazadaModify_new_string" autocomplete="off" class="layui-input" v-model="lazadaModify_new_string">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
<%--                                    <div class="layui-inline">--%>
<%--                                        <a type="button" id="shopee_mt_replaceSubtitle" class="layui-btn layui-btn-normal layui-btn-sm" @click="lazadaModify_update_string">替换</a>--%>
<%--                                    </div>--%>
                                    <div class="layui-inline">
                                        <label class="layui-form-label">原标题：</label>
                                        <div class="layui-input-inline">
                                            <textarea v-model="lazadaModify_old_string" autocomplete="off" class="layui-textarea" placeholder="请输入需替换词，为空将全量调整标题"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-inline">
                                        <label class="layui-form-label">修改为：</label>
                                        <div class="layui-input-inline">
                                            <textarea v-model="lazadaModify_new_string" autocomplete="off" class="layui-textarea" placeholder="请输入，可用下划线代替原标题在其前后新增，例：_ apple"></textarea>
                                        </div>
                                    </div>
                                    <div class="layui-inline">
                                        <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" lay-submit
                                        type="button" @click="modifyWholeTitle">一键应用</button>
                                    </div>
                                    <div class="layui-inline">
                                        <label class="layui-form-label">热搜词：</label>
                                        <div class="layui-input-inline">
                                            <input type="text" v-model="titleHotWord" autocomplete="off" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-inline">
                                        <a @click="resetTitle" lay-tips="按照刊登生成标题规则，将热搜词放置在品牌词之后，重新生成标题" class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0">重新生成标题 </a>
                                    </div>
                                </div>
                                <div class="layui-form-item" style="padding-left:42px;">
<%--                                    <div class="layui-inline">--%>
<%--                                        <label class="layui-form-label" style="width: 120px;">标题一键修改为</label>--%>
<%--                                        <div class="layui-input-inline">--%>
<%--                                            <input type="text" class="layui-input" id="wholetitle" v-model="wholetitle">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
<%--                                    <div class="layui-inline">--%>
<%--                                        <a class="layui-btn layui-btn-normal layui-btn-sm" id="modifyWholeTitle" @click="modifyWholeTitle">一键应用</a>--%>
<%--                                    </div>--%>

                                    <div class="layui-inline">
                                        <a type="button" class="layui-btn layui-btn-normal layui-btn-sm" @click="batchSubmit">批量提交</a>
                                    </div>
                                </div>

                                <div v-for="(item ,index) in items" class="itemcard" :key="index">
                                    <div class="card-header">
                                        <input type="checkbox" :checked="item.ischecked" :data-index="index" :title="item.storeAcct+'----'+item.itemId" lay-skin="primary" lay-filter="itemCheckbox" :data-index="index" name="peritemCheckBox">
                                    </div>
                                    <div class="card-body">
                                        <div class="clearfix layui-row">
                                            <div class="layui-col-md12 layui-col-lg12 itemcard">
                                                <input style="width:95%;display: inline;" @oninput="getCount(item.title.length)" type="text" class="layui-input ifFocusInput" :data-prodpid="item.prodPId" v-model="item.title">
                                                <!-- <span :style="{color:(item.title.length>255?'red':'')}">{{item.title.length}}</span> / 255 -->
                                            </div>
                                            <div class="layui-row editor-container">
                                                <div :id="'wangeditor'+index"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
        <script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
        <script type="text/javascript" src="${ctx}/static/js/publishs/lazada/modifyTittleAndDescription.js"></script>