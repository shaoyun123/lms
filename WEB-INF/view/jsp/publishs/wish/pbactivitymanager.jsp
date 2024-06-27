<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>PB活动管理</title>

        <style>
            .wishpb_activity_container {
                display: grid;
                grid-template-columns: repeat(auto-fill, 100px);
            }

            .wishpb_activity_container .wishpb_activity_container_checkbox {
                height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 17px;
            }

            .ant-tag {
                box-sizing: border-box;
                margin: 0 8px 0 0;
                color: #000000d9;
                font-size: 14px;
                font-variant: tabular-nums;
                line-height: 1.5715;
                list-style: none;
                font-feature-settings: "tnum";
                display: inline-block;
                height: auto;
                padding: 0 7px;
                line-height: 20px;
                white-space: nowrap;
                background: #fafafa;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                opacity: 1;
                transition: all .3s
            }

            .wishpb_activity_grid_container {
                display: flex;
                flex-wrap: wrap;
            }

            .wishpb_activ_keyword {
                line-height: 30px;
            }
        </style>

        <div class="layui-fluid" id="wish-pbactivity">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12 layui-col-lg12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form id="wishpb_activity_searchForm" lay-filter="wishpb_activity_searchForm"
                                class="layui-form" action="">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="orgs_hp_wishpb_activity"
                                                class="orgs_hp_custom">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                            <select name="sellerId" class="users_hp_custom" data-rolelist="wish专员"
                                                lay-filter="users_hp_wishpb_activity" lay-search="">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select name="storeAcctIdList" data-platcode="wish"
                                                id="wishpbActiv__store_sel" xm-select="wishpbActiv__store_sel"
                                                xm-select-serach-type="dl" xm-select-serach xm-select-skin="normal"
                                                class="users_hp_store_multi" lay-search="">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">刊登时间</label>
                                        <div class="layui-input-block">
                                            <input name="listingTime" type="text" class="layui-input"
                                                id="wishpbActiv_listTime">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">活动开始时间</label>
                                        <div class="layui-input-block">
                                            <input name="activityStartTime" type="text" class="layui-input"
                                                id="wishpbActiv_activityStartTime">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">活动结束时间</label>
                                        <div class="layui-input-block">
                                            <input name="activityEndTime" type="text" class="layui-input"
                                                id="wishpbActiv_activityEndTime">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">花费成交比</label>
                                        <div class="layui-input-block">
                                            <input name="minProportion" type="number" class="layui-input"
                                                style="width:40%;float:left;margin-right:5%">
                                            <span style="width:10%;">--</span>
                                            <input name="maxProportion" type="number" class="layui-input"
                                                style="width:40%;float:right;margin-left:5%">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">搜索类型</label>
                                        <div class="layui-input-block">
                                            <select name="searchType" lay-search="">
                                                <option value="promotionName">活动名称</option>
                                                <option value="promotionId">活动ID</option>
                                                <option value="cnTitle">产品名称</option>
                                                <option value="listingStoreSubId">产品ID</option>
                                                <option value="prodPSku">商品SKU</option>
                                                <option value="storePSku">店铺SKU</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">搜索内容</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="searchValue" placeholder="请输入搜索内容"
                                                class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">商品标签</label>
                                        <div class="layui-input-block">
                                            <select name="prodAttrList" lay-search=""
                                                id="wishpbactivity_goodstag"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label" style="padding: 0 15px">
                                            <select name="logisAttrRelation">
                                                <option value="">请选择</option>
                                                <option value="and">物流属性(与)</option>
                                                <option value="or">物流属性(或)</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <select name="logisAttr" xm-select="pbactivity_logisAttr_sel"
                                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                                lay-filter='wishpbactivity_logisAttr_sel' id="wishpbactivity_logisAttr">
                                            </select>
                                        </div>
                                        <div hidden id="pbactivity_logisAttrList">
                                            <c:forEach items="${logisAttrList}" var="logisAttr">
                                                <option value="${logisAttr.name}" alias="${logisAttr.alias}">
                                                    ${logisAttr.name}</option>
                                            </c:forEach>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">IntenseBoost</label>
                                        <div class="layui-input-block">
                                            <select name="intenseBoost" lay-search="">
                                                <option value="">全部</option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">活动状态</label>
                                        <div class="layui-input-block">
                                            <input type="radio" value="" lay-skin="primary" name="state" title="全部"
                                                checked>
                                            <input type="radio" value="NEW" lay-skin="primary" name="state" title="新创建">
                                            <input type="radio" value="PENDING" lay-skin="primary" name="state"
                                                title="预设中">
                                            <input type="radio" value="STARTED" lay-skin="primary" name="state"
                                                title="进行中">
                                            <input type="radio" value="ENDED" lay-skin="primary" name="state"
                                                title="已停止">
                                            <input type="radio" value="ENDED" lay-skin="primary" name="state"
                                                title="已结束">
                                            <input type="radio" value="CANCELLED" lay-skin="primary" name="state"
                                                title="已取消">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">排序</label>
                                        <div class="layui-input-block">
                                            <select name="orderByType" lay-search="">
                                                <option value="1">活动开始时间升序</option>
                                                <option value="2">活动开始时间降序</option>
                                                <option value="3">活动结束时间升序</option>
                                                <option value="4">活动结束时间降序</option>
                                                <option value="5">刊登时间升序</option>
                                                <option value="6">刊登时间降序</option>
                                                <option value="7">费用升序</option>
                                                <option value="8">费用降序</option>
                                                <option value="9">预算升序</option>
                                                <option value="10"> 预算降序</option>
                                                <option value="11"> 成交额升序</option>
                                                <option value="12"> 成交额降序</option>
                                                <option value="13"> 订单量升序</option>
                                                <option value="14"> 订单量降序</option>
                                                <option value="15"> 花费成交比升序</option>
                                                <option value="16"> 花费成交比降序</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">活动来源</label>
                                        <div class="layui-input-block">
                                            <select name="automatedCampaign" id="">
                                                <option value="">请选择</option>
                                                <option value="false">销售创建</option>
                                                <option value="true">Wish推荐</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2 pl20">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            id="wishpb_activity_submit" lay-filter="wishpb_activity_search"
                                            lay-submit>搜索</button>
                                        <button id="wishpb_activity_reset" type="reset"
                                            class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-card-header disflex" style="justify-content: space-between;">
                            <div class="disflex" style="align-items: center;">
                                <button type="button" class="layui-btn layui-btn-danger layui-btn-sm"
                                    onclick="wishpbActivExport()">导出</button>
                                <form id="isEnableForm" class="layui-form">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4 ml10" style="margin-top: 6px;">
                                            <select name="wishpb_activity_batchSet" id="wishpb_activity_batchSet"
                                                lay-filter="wishpb_activity_batchSet">
                                                <!-- <option value="" data-title="">批量设置</option>
                                                <option value="0" data-title="设置预算">设置预算</option>
                                                <option value="1" data-title="停止">停止</option>
                                                <option value="2" data-title="设置为连续活动">设置为连续活动</option>
                                                <option value="3" data-title="设置为单次活动">设置为单次活动</option>
                                                <option value="4" data-title="设置结束时间">设置结束时间</option>
                                                <option value="5" data-title="添加备注">添加备注</option> -->
                                            </select>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4 ml10" style="margin-top: 6px;">
                                            <select name="wishpb_activity_sync" lay-filter="wishpb_activity_sync">
                                                <option value="" data-title="同步活动">同步活动</option>
                                                <option value="0" data-title="同步选中">同步选中</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div style="align-items: center;">
                                <button class="layui-btn layui-btn-danger layui-btn-sm" type="button"
                                    onclick="wishpbActivEdit()"><span
                                        style="margin-right: 5px;font-size: 14px;">+</span>创建活动</button>
                            </div>
                        </div>
                        <div class="layui-card-body">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="wishpbActivTable" lay-filter="wishpb_activ_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 图片 -->
        <script type="text/html" id="wishpbActiv_Table_imageTpl">
            {{#  if(typeof(d.image) !="undefined"){ }}
                    <img width="60" height="60" data-original="{{ d.image }}"  data-onerror='layui.admin.img_noFind()' class="img_show_hide  lazy b1">
          {{#  } }}
        </script>

        <!-- 活动名称，活动ID -->
        <script type="text/html" id="wishpbActiv_Table_activityTpl">
            <div>
                <div>{{d.promotionName}}</div>
                <div>{{d.promotionId}}</div>
                <div><i class="layui-icon" style="color: #009688;cursor: pointer;" lay-event="table">&#xe62d;</i></div>
            </div>
        </script>

        <!-- 状态类型 -->
        <script type="text/html" id="wishpbAcitiv_statusTpl">
            <div>
                <div>{{d.state || ''}}</div>
                {{# if(d.isAutoRenew!='undefined'){ }}
                    <div>{{d.isAutoRenew?'连续活动':'单次活动'}}</div>
                    {{# } }}
            </div>
        </script>

        <!-- 时间 -->
        <script type="text/html" id="wishpbAcitiv_timeTpl">
            <div>
                {{# if(d.listingTime){ }}
                    <div>刊登：{{Format(d.listingTime,'yyyy-MM-dd')}}</div>
                    {{# } }}
                    {{# if(d.startTime){ }}
                    <div>开始：{{Format(d.startTime,'yyyy-MM-dd')}}</div>
                    {{# } }}
                    {{# if(d.expectedEndTime){ }}
                    <div>结束：{{Format(d.expectedEndTime,'yyyy-MM-dd')}}</div>
                    {{# } }}
            </div>
        </script>

        <!-- 操作 -->
        <script type="text/html" id="wishpbAcitiv_barDemo">
            <div class="layui-btn-container">
                {{#if(d.automatedCampaign){ }}
                    {{# if(d.state=='PENDING'){ }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="start">开启</button></div>
                {{# } }}
                {{# if(d.state=='NEW' ||d.state=='PENDING'){ }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="wishstop">取消</button></div>
                {{# } }}
                {{#  }else{ }}
                    {{#if(d.state=='PENDING'||d.state=='STARTED'||d.state=='NEW'){  }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="edit">编辑</button></div>
                {{# } }}
                {{# if(d.state=='ENDED'||d.state=='STARTED'||d.state=='CANCELLED'||d.state=='NEW'||d.state=='PENDING'){ }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="copy">复制</button></div>
                {{# } }}          
                {{# if(d.state=='STARTED'){ }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="stop">停止</button></div>
                {{# } }}
                {{# if(d.state=='NEW'||d.state=='PENDING'){ }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="stop">取消</button></div>
                {{# } }}
                {{# if(d.state=='ENDED'||d.state=='CANCELLED'){ }}
                    <div><button class="layui-btn layui-btn-xs" type="button" lay-event="justView">查看</button></div>
                {{#} }}
                {{# } }}
                <div><button class="layui-btn layui-btn-xs" type="button" lay-event="viewLog">查看日志</button></div>
            </div>
        </script>

        <!-- 追加预算 -->
        <script type="text/html" id="wishpbAcitiv_addBudget">
           <form action="" class="layui-form" id="wishpbAcitiv_addBudgetform">
            <div style="padding:20px" class="layui-form-item">
                <div class="disflex">
                    <div class="w120">每次增加金额</div>
                    <input class="layui-input" name="scheduledAddBudgetAmount" /> 
                </div>
                <div class="disflex mt10">
                    <div class="w120">时间预设</div>
                    <div class="wishpb_activity_container ml15" style="flex: auto;">
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="0" title="周一"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="1" title="周二"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="2" title="周三"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="3" title="周四"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="4" title="周五"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="5" title="周六"></div>
                        <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="6" title="周日"></div>
                    </div>
                </div>
            </div>
           </form>
        </script>

        <!-- 活动设置弹窗 -->
        <script type="text/html" id="wishpbAcitiv_createActivModal">
            <div class="layui-fluid">
                <div class="layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form action="" id="wishpbAcitiv_createform" class="layui-form">
                            <!-- 活动设置 -->
                            <div calss="layui-card">                
                                <div class="layui-card-header">
                                    <span>活动设置</span>
                                </div>      
                                <div class="layui-card-body">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><font style="color:red">*</font>店铺账号</label>
                                        <div class="layui-input-block w300">
                                            <select name="storeAcctId" id="wishpbAcitiv_createActiv_store" lay-filter="wishpbAcitiv_createActiv_store" lay-search="" {{(d.obj.state=='NEW'||d.obj.state=='PENDING' || d.obj.state=='STARTED')&& d.type==3?'disabled':''}}></select>
                                        </div>
                                    </div>
                                    <!-- <div class="layui-form-item">
                                        <label class="layui-form-label"><font style="color:red">*</font>活动名称</label>
                                        <div class="layui-input-block">
                                            <input name='promotionName' class="layui-input w300" value="{{d.promotionName || ''}}" {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED')?'readonly':''}}/>
                                            <input name='promotionId' class="hidden" value="{{d.promotionId || ''}}"/>
                                        </div>
                                    </div> -->
                                    {{# if(d.type==3){ }}
                                        <input name='promotionId' class="hidden" value="{{d.promotionId || ''}}"/>
                                    {{# } }}
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><font style="color:red">*</font>活动时间</label>
                                        <div class="layui-input-block">
                                            <div class="disflex">
                                                <input name='activTimeStart' class="layui-input w300" id="wishpbAcitiv_setActivTimeS" {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED')?'readonly':''}}/>
                                                <input name='activTimeEnd' class="layui-input w300" id="wishpbAcitiv_setActivTimeE" {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED')?'readonly':''}}/>
                                            </div>
                                            <div class="mt05 fGrey">活动可在{{Format(Date.now()+172800000-54000000,'yyyy-MM-dd')}}和{{Format(Date.now()+86400000*29-54000000,'yyyy-MM-dd')}}之间的任意日期开始，并可运行至多4周。时间为太平洋标准时间</div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">连续活动</label>
                                        <div class="layui-input-block">
                                            <input name='isAutoRenew' type="checkbox" lay-skin="switch" {{d.isAutoRenew ? 'checked':''}}/>
                                            <div class="mt05 fGrey">开启后该活动将重复运行直至其被取消，可在活动运行期间查看活动报告。</div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">IntenseBoost</label>
                                        <div class="layui-input-block">
                                            <input name='intenseBoost' type="checkbox" lay-skin="switch"  {{d.intenseBoost ? 'checked':''}} {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED')?'disabled':''}}/>
                                            <div class="mt05 fGrey">开启IntenseBoost 可最大限度地提高产品曝光度，从而更快地吸引更多用户。通过使用此新功能，商户可以花费相对较高的成本让产品在更短的时间内获得更多曝光量，这对新上传的产品非常有利。</div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label"><font style="color:red">*</font>推广总预算</label>
                                        <div class="layui-input-block disflex" style="align-items: center;">
                                            <input name='budget' type="number" class="layui-input w300" value="{{d.budget || ''}}" {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED')?'readonly':''}}/>
                                            <div class="mr10 ml10 ">可花费的最大额度：<span class="most_amount_code">{{d.amount||''}}</span><span class="most_currency_code"> {{d.currency_code || '' }}</span></div>
                                            <i class="layui-icon" onclick="wishpbActivRefreshMaxCost()">&#xe9aa;</i>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">定期追加预算</label>
                                        <div class="layui-input-block">
                                            <input name='ontimeBudget' type="checkbox" lay-skin="switch" lay-filter="wishpbAcitiv_showBudgetInfo" {{d.scheduledAddBudgetAmount?'checked':''}}/>
                                            <div id="wishpbAcitiv_addBudgetInfo" class="{{d.scheduledAddBudgetAmount?'':'hidden'}}">
                                                <div class="mt05 fGrey">在选定的日期内每周自动添加指定的预算金额。</div>
                                                <div class="disflex mt05" >
                                                    <div class="w90 taRight">时间预设</div>
                                                    <div class="wishpb_activity_container ml15" style="flex: auto;">
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="0" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('0')?'checked':''}} title="周一"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="1" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('1')?'checked':''}} title="周二"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="2" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('2')?'checked':''}} title="周三"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="3" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('3')?'checked':''}} title="周四"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="4" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('4')?'checked':''}} title="周五"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="5" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('5')?'checked':''}} title="周六"></div>
                                                            <div class="wishpb_activity_container_checkbox"><input type="checkbox" lay-skin="primary" name="scheduledAddBudgetDays" value="6" {{d.scheduledAddBudgetDays&&d.scheduledAddBudgetDays.includes('6')?'checked':''}} title="周日"></div>
                                                    </div>
                                                </div>
                                                <div class="disflex mt05">
                                                    <div class="w90 taRight">每次增加金额</div>
                                                    <input type="number" class="layui-input w200 ml15" name="scheduledAddBudgetAmount" value="{{d.scheduledAddBudgetAmount}}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                            <!-- 促销产品 -->
                            <div calss="layui-card">                
                                <div class="layui-card-header">
                                    <span>促销产品</span>
                                </div>      
                                <div class="layui-card-body">
                                    <div class="layui-form-item">
                                        <div class="layui-input-block">
                                            <div class="disflex">
                                                <input type="text" class="layui-input w300" placeholder="产品ID" name="storeProdPId">
                                                <button class="layui-btn layui-btn-sm layui-btn-danger {{d.type==3 &&(d.obj.state=='PENDING' || d.obj.state=='STARTED') ?'layui-btn-disabled':''}}" type="button" onclick="wishpbActivhandleAddProd(this)">添加产品</button>
                                            </div>
                                            <table class="layui-table" id="wishpb_activ_prodcut_table" style="width:1500px">
                                                <thead>
                                                <tr>
                                                    <th>图片</th>
                                                    <th>活动名称</th>
                                                    <th>产品/产品ID</th>
                                                    <th>收藏</th>
                                                    <th>售出量</th>
                                                    <th>备选关键词</th>
                                                    <th>操作</th>
                                                </tr>
                                                </thead>
                                                <tbody></tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </script>
        <!-- 促销产品 行 -->
        <script id="wishpb_activ_prodcut_table_tr" type="text/html">
            {{# if(d.length){ }}
                {{# layui.each(d,function(index,item){ }}
                        <tr>
                            <td style="width: 70px !important;">
                                {{#  if(typeof(item.image) !="undefined"){ }}
                                    <img width="60" height="60" data-original="{{item.image}}" src="{{item.image}}" data-onerror='layui.admin.img_noFind()' class="img_show_hide  lazy b1">
                                {{#  } }}
                            </td>
                            <td class="taCenter w300">
                                <input name='promotionName' data-promotionId="{{item.promotionId || ''}}" class="layui-input w300" value="{{item.promotionName || ''}}" {{item.disable ? 'readonly':''}}/>
                            </td>
                            <td class="taCenter" name="storeProdPId" data-storeProdPId="{{item.listingStoreSubId||item.storeProdPId}}">
                                <div>{{item.title || ''}}</div>
                                <div>{{item.listingStoreSubId || item.storeProdPId || ''}}</div>
                            </td>
                            <td class="taCenter w40">{{item.wishes==undefined ?'': item.wishes}}</td>
                            <td class="taCenter w40">{{item.sales==undefined ?'': item.sales}}</td>
                            <td class="taCenter w300">
                                <div class="wishpb_activity_grid_container">
                                    {{# if(item.keyword){ }}
                                    {{# layui.each(item.keyword.split(','),function(keywordIndex,keywordItem){ }}
                                    <div name="keyword" class="wishpb_activ_keyword" data-keyword="{{keywordItem}}"><span class="ant-tag">{{keywordItem||''}}
                                        {{# if(!item.disable&&item.keyword){ }}
                                        <i class="layui-icon" style="color: #009688;cursor: pointer;" onclick="wishpbActivDelKeyword(this)">&#x1006;</i>
                                        {{# } }}
                                    </span>
                                        <span class="wishpb_activ_keyword_hot hidden">{{item.keywordHotnessMap?item.keywordHotnessMap[keywordItem]:''}}</span>
                                    </div>
                                {{#  }) }}
                                {{# } }}
                                {{# if(!item.disable){ }}
                                    <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" onclick="wishpbActivAddKeyword(this)"></i>
                                    <input type="text" class="hidden layui-input" onkeydown="wishpbActivAddKeywordEnter(event,this)">
                                    {{# } }}
                                </div>
                            </td>
                            <td class="taCenter w100"><button type="button" class="layui-btn layui-btn-sm {{item.disable?'layui-btn-disabled':''}}" onclick="wishpbActivRemoveTr(this)">移除</button></td>
                        </tr>
                {{# }) }}
            {{# } }}
        </script>

        <!-- 每日表现 -->
        <script id="wishpbAcitiv_layerEcharts" type="text/html">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div style="padding:20px;height:90%;">
            <div style="display:flex;width:50%;" class="layui-form">
                <input name="" class="layui-input" id="wishpbAcitiv_layerEcharts_id" readonly
                    lay-filter="wishpbAcitiv_echartSelectFilter" />
                <input type="text" class="layui-input" readonly style="margin-left:30px;"
                    id="wishpbAcitiv_layerEcharts_times">
            </div>
            <div id="wishpbAcitiv_echartsContainer" style="width: 100%;height:100%;"></div>
        </div>
        </script>

        <!-- 批量设置 -->
        <script id="wishpb_activ_batchSet_option" type="text/html">
            <option value="" data-title="">批量设置</option>
            {{# if(d.state!='CANCELLED'&&d.state!='ENDED'){ }}
            <option value="0" data-title="设置预算">设置预算</option>
            {{# } }}
                {{# if(d.state=='NEW'||d.state=='PENDING'){ }}
                    <option value="1" data-title="取消">取消</option>
                    {{# }else if(d.state=='STARTED'|| !d.state ){ }}
                    <option value="1" data-title="停止">停止</option>
                    {{# } }}
                {{# if(d.state!='CANCELLED'&&d.state!='ENDED'){ }}
                    <option value="2" data-title="设置为连续活动">设置为连续活动</option>
                    <option value="3" data-title="设置为单次活动">设置为单次活动</option>
                    {{# } }}
                <option value="4" data-title="设置结束时间">设置结束时间</option>
                <option value="5" data-title="添加备注">添加备注</option>
        </script>

        <!--操作日志弹窗 -->
        <script id="wishpb_activ_operation_log" type="text/html">
                <ul class="layui-timeline pl20">
                    {{# if(d.length){ }}
                    <fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
                        <legend>活动ID：{{d[0].promotionId}}</legend>
                      </fieldset>
                        {{# layui.each(d,function(index,item){ }}
                                <li class="layui-timeline-item">
                                {{# if(item.operResult==1){ }}
                                        <i class="layui-icon layui-timeline-axis" style="pointer-events: none;">&#xe63f;</i>
                                {{# }else{ }}
                                        <i class="layui-icon layui-timeline-axis" style="color:#ff4d4f">&#xe63f;</i>
                                {{# } }}
                                    <div class="layui-timeline-content layui-text">
                                        <h3 class="layui-timeline-title">
                                            <span>{{Format(item.createTime,'yyyy-MM-dd hh:mm')}}</span>
                                            <span class="ml10">{{item.creator}}</span>
                                        </h3>
                                        <div><span>操作类型：</span><span>{{item.operType}}</span></div>
                                        {{# if(item.origData!=undefined && item.origData!=''){ }}
                                            <div>
                                                <span class="mr10">原始值：{{item.origData}}</span>
                                            </div>
                                        {{#  } }}
                                            {{#  if(item.newData!=undefined && item.newData!=''){ }}
                                           <div> <span class="mr10">新值：{{item.newData}}</span>
                                        
                                        
                                        </div>
                                        {{# } }}
                                    {{# if(item.operDesc){ }}
                                            <div><span>操作结果描述：</span><span>{{item.operDesc}}</span></div>
                                    {{# } }}
                                    </div>
                                </li>
                        {{# }) }}
                        <li class="layui-timeline-item">
                            <i class="layui-icon layui-timeline-axis" style="pointer-events: none;">&#xe63f;</i>
                            <div class="layui-timeline-content layui-text">
                              <div class="layui-timeline-title">———— 到底啦 ————</div>
                            </div>
                        </li>
                    {{# }else{ }}
                    <div style="padding: 20px;">暂无数据</div>
                    {{# } }}
                </ul>                  
        </script>

        <!-- 根据批次获取任务执行状况 -->
        <script id="wishpb_activ_task_progress" type="text/html">
            <div style="padding: 20px;font-size: 14px;">
                <div class="layui-progress layui-progress-big " lay-filter="wishpb_activ_task_percent" lay-showPercent="true">
                    <div class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div>
                </div>
                <div class="mt10" style="line-height: 24px;">执行情况：<span class="blue">{{d. content}}</span></div>
                {{# if(!!d.errMsg){ }}
                        <div class="mt10" style="line-height: 24px;">错误描述：</div>
                        <div class="mt10 fRed" style="line-height: 24px;" >{{d.errMsg}}</div>
                {{# }else{ }} 
                        <div class="mt10" style="line-height: 24px; color: green;">执行成功</div>
                {{# } }} 
            </div>
        </script>


        <script src="${ctx}/static/js/publishs/wish/pbactivitymanager.js"></script>
