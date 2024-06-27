<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
        <title>账号表现</title>
        <style>
            .tac {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .accRed {
                color: #FF5722;
                font-size: 14px
            }
            
            .p1020 {
                padding: 10px 20px 20px 10px;
            }
            
            .timeAplay {
                font-size: 10px
            }
            
            .mb60 {
                margin-bottom: 60px;
            }
            
            .thYellow {
                background-color: #f2f2f2;
                font-weight: 700 !important;
                text-align: center;
            }
            
            .tdYellow {
                background-color: #fff9e1
            }
        </style>
        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <!-- 搜索条件 -->
                    <div class="layui-card">
                        <div class="layui-card-header">
                            <a class="layui-btn layui-btn-sm" id="ap_sync">立即同步</a>
                        </div>
                        <div class="layui-card-body">
                            <table id="ap_table" class="layui-table" lay-filter="ap_table">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 时间格式化 -->
        <script>
            function timestampToTime(timestamp) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y + M + D + h + m + s;
            }
        </script>
        <!-- 表格渲染自定义模板 -->
        <script type="text/html" id="totalSoldValue">
            {{# if(typeof(d.totalSoldValue) != "undefined"){ }}
            <span>{{d.totalSoldValue}}{{d.totalSoldValueCurrency}}</span> {{# }else{ }} 无数据 {{# } }}
        </script>
        <script type="text/html" id="amountLimitRemainingValue">
            {{# if(typeof(d.amountLimitRemaining) != "undefined"){ }}
            <span>{{d.amountLimitRemaining}}{{d.amountLimitRemainingCurrency}}</span> {{# }else{ }} 无数据 {{# } }}
        </script>


        <script type="text/html" id="longTermStatus">
            {{# if (d.longTermStatus == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.longTermStatus == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.longTermStatus == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.longTermStatus == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="nonShippingStatus">
            {{# if (d.nonShippingStatus == 1) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.nonShippingStatus == 2) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.nonShippingStatus == 3){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.nonShippingStatus == 4){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="shippingStatus1">
            {{# if (d.shippingStatus1 == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.shippingStatus1 == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.shippingStatus1 == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.shippingStatus1 == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="shippingStatus2">
            {{# if (d.shippingStatus2 == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.shippingStatus2 == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.shippingStatus2 == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.shippingStatus2 == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="epacketStatus">
            {{# if (d.epacketStatus == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.epacketStatus == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.epacketStatus == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.epacketStatus == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="edsStatus">
            {{# if (d.edsStatus == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.edsStatus == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.edsStatus == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.edsStatus == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="warehouseStatus">
            {{# if (d.warehouseStatus == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.warehouseStatus == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.warehouseStatus == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.warehouseStatus == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="pgcStatus">
            {{# if (d.pgcStatus == 0) { }}
            <img src="${ctx}/static/img/tick.png" width='30' height='30'>正常 {{# }else if (d.pgcStatus == 1) { }}
            <img src="${ctx}/static/img/over.png" width='30' height='30'>超标 {{# }else if (d.pgcStatus == 2){ }}
            <img src="${ctx}/static/img/tips.png" width='30' height='30'>警告 {{# }else if (d.pgcStatus == 3){ }}
            <img src="${ctx}/static/img/warn.png" width='30' height='30'>限制 {{# }else { }} 无数据 {{# } }}
        </script>

        <script type="text/html" id="accountData">
            <button class="ap_detail layui-btn layui-btn-sm" style="margin-bottom:10px;">详情</button>
            <button data-acctid="{{d.storeAcctId}}" class="ap_update layui-btn layui-btn-sm" style="margin-bottom:10px;margin-left:0">更新</button>
            <textarea hidden name="accountData">{{d.accountData}}</textarea>
        </script>

        <script type="text/html" id="ebaySellingFail">
            {{# if (d.ebaySellingFail) { }} 账号销量：{{d.ebaySellingFail}} {{# }else { }} 账号销量：{{timestampToTime(d.ebaySellingTime)}} {{# } }}
            <br> {{# if(d.accountDataFail){ }} 账号表现：{{d.accountDataFail}} {{# }else { }} 账号表现：{{timestampToTime(d.accountDataTime)}} {{# } }}
        </script>
        <!-- 表格渲染自定义模板 -->
        <!-- 详情弹框 -->
        <script type="text/html" id="ap_detailTpl">
            <div class="p1020">
                {{if longTermDefects}}
                <div class="tac">
                    <h3><strong>综合表现</strong></h3>
                </div>
                <div class="timeAplay">您
                    <span class="accTime">{{longTermDefects.dft_lst_eval_beg_dt}}-{{longTermDefects.dft_lst_eval_end_dt}}</span> 期间的不良交易表现为 {{if longTermDefects.status_lst_eval == 0}}
                    <span><b>正常</b></span> {{else if longTermDefects.longTermStatus == 1}}
                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.longTermStatus == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.longTermStatus == 3}}
                    <span class="accRed"><b>限制</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                </div>
                <div>
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th class="thYellow">当前评价(下次评估时间<span>{{longTermDefects.next_review_dt}}</span>)</th>
                                <th class="thYellow">标准值</th>
                                <th class="thYellow">当前值</th>
                                <th class="thYellow">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>小于等于10美金12月不良交易率</td>
                                <td>{{(longTermDefects.dft_rt_lt10_12m_th*100).toFixed(2)}}%</td>
                                <td>{{(longTermDefects.dft_rt_lt10_12m_lst_eval*100).toFixed(2)}}%</td>
                                <td>
                                    {{if longTermDefects.status_lst_eval == 0}}
                                    <span><b>正常</b></span> {{else if longTermDefects.status_lst_eval == 1}}
                                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.status_lst_eval == 2}}
                                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.status_lst_eval == 3}}
                                    <span class="accRed"><b>限制</b></span> {{else if longTermDefects.status_lst_eval == 4}}
                                    <span><b>不考核</b></span> {{else}}
                                    <span class="accRed"><b>无数据</b></span> {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td>大于10美金12月不良交易率</td>
                                <td>{{(longTermDefects.dft_rt_gt10_12m_th*100).toFixed(2)}}%</td>
                                <td>{{(longTermDefects.dft_rt_gt10_12m_lst_eval*100).toFixed(2)}}%</td>
                                <td>
                                    {{if longTermDefects.status_gt10_lst_eval == 0}}
                                    <span><b>正常</b></span> {{else if longTermDefects.status_gt10_lst_eval == 1}}
                                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.status_gt10_lst_eval == 2}}
                                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.status_gt10_lst_eval == 3}}
                                    <span class="accRed"><b>限制</b></span> {{else if longTermDefects.status_gt10_lst_eval == 4}}
                                    <span><b>不考核</b></span> {{else}}
                                    <span class="accRed"><b>无数据</b></span> {{/if}}
                                </td>
                            </tr>
                            <tr>
                                <td>综合12月不良交易率</td>
                                <td>{{(longTermDefects.adj_dft_rt_12m_th*100).toFixed(2)}}%</td>
                                <td>{{(longTermDefects.adj_dft_rt_12m_lst_eval*100).toFixed(2)}}%</td>
                                <td>
                                    {{if longTermDefects.status_adj_lst_eval == 0}}
                                    <span><b>正常</b></span> {{else if longTermDefects.status_adj_lst_eval == 1}}
                                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.status_adj_lst_eval == 2}}
                                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.status_adj_lst_eval == 3}}
                                    <span class="accRed"><b>限制</b></span> {{else if longTermDefects.status_adj_lst_eval == 4}}
                                    <span><b>不考核</b></span> {{else}}
                                    <span class="accRed"><b>无数据</b></span> {{/if}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="timeAplay">您
                    <span class="accTime">{{longTermDefects.dft_lst_eval_beg_dt}}-{{longTermDefects.dft_lst_eval_end_dt}}</span> 期间的纠纷表现为 {{if longTermDefects.snad_status_lst_eval == 0}}
                    <span><b>正常</b></span> {{else if longTermDefects.snad_status_lst_eval == 1}}
                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.snad_status_lst_eval == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.snad_status_lst_eval == 3}}
                    <span class="accRed"><b>限制</b></span> {{else if longTermDefects.snad_status_lst_eval == 4}}
                    <span><b>不考核</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                </div>
                <div class="mb60">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th class="thYellow">超出标准值比例</th>
                                <th class="thYellow">预期评价状态</th>
                                <th class="thYellow">纠纷按买家国家细分</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{(longTermDefects.delta_snad_rt_12m_lst_eval*100).toFixed(2)}}%</td>
                                <td>
                                    {{if longTermDefects.snad_status_wk_eval == 0}}
                                    <span><b>正常</b></span> {{else if longTermDefects.snad_status_wk_eval == 1}}
                                    <span class="accRed"><b>超标</b></span> {{else if longTermDefects.snad_status_wk_eval == 2}}
                                    <span class="accRed"><b>警告</b></span> {{else if longTermDefects.snad_status_wk_eval == 3}}
                                    <span class="accRed"><b>限制</b></span> {{else if longTermDefects.snad_status_wk_eval == 4}}
                                    <span><b>不考核</b></span> {{else}}
                                    <span class="accRed"><b>无数据</b></span> {{/if}}
                                </td>
                                <td>
                                    <table>
                                        <tr>
                                            <td class="thYellow">北美</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_na*100).toFixed(2)}}%</td>
                                            <td class="thYellow">英国</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_uk*100).toFixed(2)}}%</td>
                                            <td class="thYellow">德国</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_de*100).toFixed(2)}}%</td>
                                            <td class="thYellow">意法西</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_frites*100).toFixed(2)}}%</td>
                                        </tr>
                                        <tr>
                                            <td class="thYellow">澳大利亚</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_au*100).toFixed(2)}}%</td>
                                            <td class="thYellow">新兴市场</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_gbh*100).toFixed(2)}}%</td>
                                            <td class="thYellow">其他</td>
                                            <td>{{(longTermDefects.adj_snad_rt_12m_other*100).toFixed(2)}}%</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {{/if}} {{if tciDefect}}
                <div class="tac">
                    <h3><strong>非货运表现</strong></h3>
                </div>
                <div class="timeAplay">您
                    <span class="accTime">{{tciDefect.reviewStartDt}}-{{tciDefect.reviewEndDt}}</span>期间的非货运表现为 {{if tciDefect.result == 1}}
                    <span><b>正常</b></span> {{else if tciDefect.result == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if tciDefect.result == 3}}
                    <span class="accRed"><b>超标</b></span> {{else if tciDefect.result == 4}}
                    <span class="accRed"><b>限制</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                </div>
                <div>
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th class="thYellow">超出标准值比例</th>
                                <th class="thYellow">北美非货运问题交易率</th>
                                <th class="thYellow">英国非货运问题交易率</th>
                                <th class="thYellow">德国非货运问题交易率</th>
                                <th class="thYellow">澳大利亚非货运问题交易率</th>
                                <th class="thYellow">其他非货运问题交易率</th>
                                <th class="thYellow">下次评估时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{tciDefect.nsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.naNsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.ukNsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.deNsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.auNsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.glNsDefectAdjRt8wk}}</td>
                                <td>{{tciDefect.nextEvalDate}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {{/if}} {{if shippingDefect}}
                <div class="tac">
                    <h3><strong>货运表现(1~8周)</strong></h3>
                </div>
                <div class="timeAplay">您
                    <span class="accTime">{{shippingDefect.reviewStartDate}}-{{shippingDefect.reviewEndDate}}</span>期间的货运表现(1~8周)为 {{if shippingDefect.result == 0}}
                    <span><b>正常</b></span> {{else if shippingDefect.result == 1}}
                    <span class="accRed"><b>超标</b></span> {{else if shippingDefect.result == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if shippingDefect.result == 3}}
                    <span class="accRed"><b>限制</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                </div>
                <div class="mb60">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th class="thYellow">超出标准值比例</th>
                                <th class="thYellow">北美非货运问题交易率</th>
                                <th class="thYellow">英国非货运问题交易率</th>
                                <th class="thYellow">德国非货运问题交易率</th>
                                <th class="thYellow">澳大利亚非货运问题交易率</th>
                                <th class="thYellow">其他非货运问题交易率</th>
                                <th class="thYellow">下次评估时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{(shippingDefect.glbShtmDeRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect.naShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect.ukShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect.deShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect.auShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect.othShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{shippingDefect.nextEvalDate}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {{/if}} {{if shippingDefect5T12Wk}}
                <div class="tac">
                    <h3><strong>货运表现(5~12周)</strong></h3>
                </div>
                <div class="timeAplay">您
                    <span class="accTime">{{shippingDefect5T12Wk.reviewStartDate}}-{{shippingDefect5T12Wk.reviewEndDate}}</span>期间的货运表现(5~12周)为 {{if shippingDefect5T12Wk.result == 0}}
                    <span><b>正常</b></span> {{else if shippingDefect5T12Wk.result == 1}}
                    <span class="accRed"><b>超标</b></span> {{else if shippingDefect5T12Wk.result == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if shippingDefect5T12Wk.result == 3}}
                    <span class="accRed"><b>限制</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                </div>
                <div class="mb60">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th class="thYellow">超出标准值比例</th>
                                <th class="thYellow">北美非货运问题交易率</th>
                                <th class="thYellow">英国非货运问题交易率</th>
                                <th class="thYellow">德国非货运问题交易率</th>
                                <th class="thYellow">澳大利亚非货运问题交易率</th>
                                <th class="thYellow">其他非货运问题交易率</th>
                                <th class="thYellow">下次评估时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{(shippingDefect5T12Wk.glbShtmDeRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect5T12Wk.naShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect5T12Wk.ukShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect5T12Wk.deShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect5T12Wk.auShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{(shippingDefect5T12Wk.othShtmRatePre*100).toFixed(2)}}%</td>
                                <td>{{shippingDefect5T12Wk.nextEvalDate}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {{/if}} {{if epacket}}
                <div class="tac">
                    <h3><strong>物流标准--epacket</strong></h3>
                </div>
                <div class="timeAplay">您
                    <span class="accTime">{{epacket.reviewStartDate}}-{{epacket.reviewEndDate}}</span>期间的物流标准--epacket为 {{if epacket.ePacketStatus == 0}}
                    <span><b>正常</b></span> {{else if epacket.ePacketStatus == 1}}
                    <span class="accRed"><b>超标</b></span> {{else if epacket.ePacketStatus == 2}}
                    <span class="accRed"><b>警告</b></span> {{else if epacket.ePacketStatus == 3}}
                    <span class="accRed"><b>限制</b></span> {{else}}
                    <span class="accRed"><b>无数据</b></span> {{/if}}
                    <div class="mb60">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th class="thYellow">标准值</th>
                                    <th class="thYellow">评估总交易数</th>
                                    <th class="thYellow">跨境发货交易数</th>
                                    <th class="thYellow">跨境发货交易中使用ePacket+比例</th>
                                    <th class="thYellow">海外仓发货交易数</th>
                                    <th class="thYellow">海外仓发货交易中使用带有效最终物流比例</th>
                                    <th class="thYellow">使用全程跟踪物流比例</th>
                                    <th class="thYellow">下次评估时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{epacket.standardValue}}</td>
                                    <td>{{epacket.evaluatedTnxCnt}}</td>
                                    <td>{{epacket.cbtTnxCnt}}</td>
                                    <td>{{epacket.cbtAdoption}}</td>
                                    <td>{{epacket.whTnxCnt}}</td>
                                    <td>{{epacket.whAdoption}}</td>
                                    <td>{{epacket.adoption}}</td>
                                    <td>{{epacket.nextEvaluationDate}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {{/if}} {{if eds}}
                    <div class="tac">
                        <h3><strong>物流标准--eds</strong></h3>
                    </div>
                    <div class="timeAplay">您<span class="accTime">{{eds.reviewStartDate}}-{{eds.reviewEndDate}}</span>期间的物流标准--eds为 {{if eds.edsStatus == 0}}
                        <span><b>正常</b></span> {{else if eds.edsStatus == 1}}
                        <span class="accRed"><b>超标</b></span> {{else if eds.edsStatus == 2}}
                        <span class="accRed"><b>警告</b></span> {{else if eds.edsStatus == 3}}
                        <span class="accRed"><b>限制</b></span> {{else}}
                        <span class="accRed"><b>无数据</b></span> {{/if}}
                    </div>
                    <div class="mb60">
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th class="thYellow">标准值</th>
                                    <th class="thYellow">评估总交易数</th>
                                    <th class="thYellow">买家选择使用标准型物流交易数</th>
                                    <th class="thYellow">标准型物流交易使用全程追踪物流比例</th>
                                    <th class="thYellow">买家选择使用经济型物流交易数</th>
                                    <th class="thYellow">经济型物流交易中使用至少含揽收信息或全程跟踪物流比例</th>
                                    <th class="thYellow">下次评估时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{eds.standardValue}}</td>
                                    <td>{{eds.addTransCnt}}</td>
                                    <td>{{eds.addBuyerStdTransCnt}}</td>
                                    <td>{{eds.edsStdComplyRate}}</td>
                                    <td>{{eds.addBuyerEconTransCnt}}</td>
                                    <td>{{eds.edsEconComplyRate}}</td>
                                    <td>{{eds.nextReviewDate}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {{/if}} {{if warehouse}}
                    <div class="tac">
                        <h3><strong>海外仓标准</strong></h3>
                    </div>
                    <div class="timeAplay">您<span class="accTime">{{warehouse.review_start_date}}-{{warehouse.review_end_date}}</span>期间的海外仓标准为 {{if warehouse.warehouse_status == 0}}
                        <span><b>正常</b></span> {{else if warehouse.warehouse_status == 1}}
                        <span class="accRed"><b>超标</b></span> {{else if warehouse.warehouse_status == 2}}
                        <span class="accRed"><b>警告</b></span> {{else if warehouse.warehouse_status == 3}}
                        <span class="accRed"><b>限制</b></span> {{else}}
                        <span class="accRed"><b>无数据</b></span> {{/if}}
                    </div>
                    <div>
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th class="thYellow">当前评价(下次评估时间 {{warehouse.next_evaluation_date}})</th>
                                    <th colspan="2" class="thYellow">非当地发货比例</th>
                                </tr>
                                <tr>
                                    <th class="thYellow">海外仓</th>
                                    <th class="thYellow">标准值</th>
                                    <th class="thYellow">当前值</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>美国</td>
                                    <td>{{(warehouse.us_ship_defect_sd*100).toFixed(2)}}%</td>
                                    <td>{{(warehouse.us_wh_shipping_defect_rate*100).toFixed(2)}}%</td>
                                </tr>
                                <tr>
                                    <td>英国</td>
                                    <td>{{(warehouse.uk_ship_defect_sd*100).toFixed(2)}}%</td>
                                    <td>{{(warehouse.uk_wh_shipping_defect_rate*100).toFixed(2)}}%</td>
                                </tr>
                                <tr>
                                    <td>德国</td>
                                    <td>{{(warehouse.de_ship_defect_sd*100).toFixed(2)}}%</td>
                                    <td>{{(warehouse.de_wh_shipping_defect_rate*100).toFixed(2)}}%</td>
                                </tr>
                                <tr>
                                    <td>澳大利亚</td>
                                    <td>{{(warehouse.au_ship_defect_sd*100).toFixed(2)}}%</td>
                                    <td>{{(warehouse.au_wh_shipping_defect_rate*100).toFixed(2)}}%</td>
                                </tr>
                                <tr>
                                    <td>其他</td>
                                    <td>{{(warehouse.other_ship_defect_sd*100).toFixed(2)}}%</td>
                                    <td>{{(warehouse.other_wh_shipping_defect_rate*100).toFixed(2)}}%</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    {{/if}}
                </div>
        </script>
        <script type="text/javascript" src="${ctx}/static/js/publishs/ebay/accplay.js"></script>