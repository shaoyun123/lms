<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>修改描述</title>
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
            
            #ebayPulish_listDetailForm .imageLeft {
                width: 260px;
                height: 260px;
                margin-right: 20px;
                float: left;
                margin-top: 5px;
                border: 1px solid #ccc;
            }
            
            #ebayPulish_listDetailForm .imageRight {
                width: 150px;
                display: inline-block;
                border: 1px solid #ccc;
                margin: 0 5px 5px 0;
            }
            
            #ebayPulish_listDetailForm .imageRight span {
                cursor: pointer;
                color: #73a1bf;
            }
            
            #ebayPulish_listDetailForm .imageRight .removeEbayImg {
                float: right;
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
            
            #LAY-publishs-ebay-publish .layui-tab-content {
                padding: 10px 0 !important;
            }
            
            .xm-select-parent .xm-form-select dl {
                position: static !important;
            }
            
            #LAY-publishs-ebay-publish .layui-table-box,
            .layui-table-view,
            #LAY-publishs-ebay-publish .layui-border-box .layui-table-view {
                overflow: auto !important;
            }
            
            #layui-layer9 table tr {
                height: 300px;
            }
        </style>
        <div class="layui-fluid">
            <template class="layui-row layui-col-space15" id="modifydescripe">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form">
                                <div class="dis_flex">
                                    <input type="checkbox" :checked="isAll" name="chenckall" title="全部" lay-skin="primary" lay-filter="chenckall">
                                    <button type="button" class="layui-btn layui-btn-normal" @click="batchSubmit">批量提交</button>
                                </div>
                                <div v-for="(item ,index) in items" class="itemcard">
                                    <div class="card-header">
                                        <input type="checkbox" :checked="item.ischecked" :data-index="index" :title="item.storeAcct+'----'+item.itemId" lay-skin="primary" lay-filter="itemCheckbox" :data-index="index" name="peritemCheckBox">
                                    </div>
                                    <div class="card-body">
                                        <div class="clearfix layui-row">
                                            <div class="layui-col-md3 layui-col-lg3">
                                                <label class="layui-form-label">销售模板</label>
                                                <div class="layui-input-block">
                                                    <select class="sellsModalSel" v-model="item.assiFieldInfoId" :value="item.assiFieldInfoId" :name="'sellsModal_'+index" lay-search :lay-filter="'sellsModal_'+index">
                                                            <option value="">不选择模板</option>
                                                            <option v-for="(option,index) in item.assiFieldEbayInfos" value="option.id" :selected="option.id===item.assiFieldInfoId">{{option.name}}</option>
                                                        </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md3 layui-col-lg3">
                                                <label class="layui-form-label">刊登风格</label>
                                                <div class="layui-input-block">
                                                    <input v-model="item.publishStyleTxt" type="text" class="layui-input" readonly>
                                                </div>
                                            </div>
                                            <div class="layui-col-md2 layui-col-lg2">
                                                <button class="layui-btn layui-btn-normal layui-btn-sm" @click="chooseStyle(index)" onclick="return false">选择风格</button>
                                            </div>
                                            <div class="layui-col-md2 layui-col-lg2">
                                                <button class="layui-btn layui-btn-normal layui-btn-sm" @click="preScan(index)" onclick="return false">预览</button>
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

        <!-- 选择风格弹框 -->
        <script type='text/html' id="ebayPublish_selStyleLayer">
            <div>
                <div class="ebayPublishStyleLeftBar">
                </div>
                <div class="ebayPublishStyleRightTem">
                    <ul>
                    </ul>
                </div>
            </div>
        </script>
        <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
        <script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
        <script type="text/javascript" src="${ctx}/static/js/publishs/ebay/modifydiscription.js"></script>