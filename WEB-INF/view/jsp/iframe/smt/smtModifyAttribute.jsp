<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>smt修改属性</title>

        <style>
            .smtModifyAttributeForm-height {
                height: calc(100vh - 130px);
                overflow-y: scroll;
            }

            .smtModifyAttribute-card-header {
                background-color: #D7D7D7;
                padding: 0 15px 0 30px;
                display: flex;
                align-items: center;
            }

            .smtModifyAttribute-card-header-checkbox {
                top: 5px;
                left: 5px;
            }

            .smtModifyAttribute-card-pb20 {
                padding-bottom: 20px
            }

            #smtModifyAttributeForm .layui-card-header .layui-icon {
                margin-top: -18px;
            }

            .smtModifyAttribute-mt7 {
                margin-top: -7px !important;
            }

            .smtModifyAttribute-listDetailTpl-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 20%);
            }

            .smtModifyAttribute-listDetailTpl-container .smtModifyAttribute-mentalProperty-checkbox {
                height: 32px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: flex;
            }

            /* 多选框  其它的 */
            .smtModifyAttribute-mentalProperty-checkbox .layui-form-checkbox {
                flex: none;
            }

            .smtModifyAttribute-checkbox-other-input {
                flex: auto;
            }
        </style>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-content">
                            <form class="layui-form" id="smtModifyAttribute_rep_Form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md12 layui-col-lg12">
                                        <div class="layui-form-label" style="padding: 4px 9px 15px;">
                                            <input type="checkbox" name="allChecked" title="全选" lay-skin="primary"
                                                class="smtModifyAttribute-allChecked"
                                                lay-filter="smtModifyAttribute-allChecked">
                                        </div>
                                        <div class="layui-input-block">
                                            <div class="layui-input-block">
                                                <div id="smtModifyAttribute_rep_sameAttr">
                                                    <div class="layui-col-md3 layui-col-lg3">
                                                        <select name="attrName" id="smtModifyAttribute_rep_attrName"
                                                            lay-filter="smtModifyAttribute_rep_attrName"></select>
                                                    </div>
                                                    <div id="smtModifyAttribute_rep_attrValue"
                                                        class="layui-col-md4 layui-col-lg4">
                                                    </div>
                                                    <div class="layui-col-md2 layui-col-lg2">
                                                        <button type="button" class="layui-btn layui-btn-sm"
                                                            id="smtModifyAttribute_rep_attrBtn">一键应用</button>
                                                    </div>
                                                </div>
                                                <div class="fr">
                                                    <button type="button" class="layui-btn layui-btn-sm"
                                                        id="smtModifyAttribute_batchModify_btn">批量修改</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card smtModifyAttributeForm-height">
                        <form class="layui-form" id="smtModifyAttributeForm">
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 批量修改的结果显示 -->

        <script type="text/html" id="smtModifyAttribute_batch_result">
            <div class="layui-card">
                <div class="layui-card-content">
                    {{# layui.each(d,function(index,item){ }}
                    <div class="{{item.result=='修改成功'?'fGreen':'fRed'}}">
                        <span>{{item.itemId}}</span>
                        <span> : </span>
                        <span>{{item.result}}</span>
                    </div>
                {{# }) }} 
                </div>
            </div>
        </script>

        <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyAttribute.js"></script>