<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>添加至FBA</title>
            <style>
                .dis_flex_space {
                    display: flex;
                    justify-content: space-between;
                }
                
                .ml {
                    margin-left: 10px
                }
                
                .red {
                    color: red;
                }
                
                .blue {
                    color: blue
                }
            </style>
            <div class="layui-fluid" id="LAY-addebaypromotion">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div class="numCount">数量</div>
                                    <div class="dis_flex_space">
                                        <input type="text" class="layui-input">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addtoFBAApply">一键应用</button>
                                    </div>
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="batchAddtoFBA">批量加入</button>
                                </div>
                                <table class="layui-table" id="addtoFBATable" lay-filter="addtoFBATable"></table>
                                <div id="pageSort"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 表格渲染模板 -->
            <script type="text/html" id="addtoFBA_imageTpl">
                <div>
                    <img width="60" height="60" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="addtoFBA_planNumber">
                <input type="text" class="layui-input" name="planNumber" value="0" />
            </script>
            <!-- 表格渲染模板 -->

            <script src="/lms/static/js/publishs/amazon/addtoFBA.js"></script>