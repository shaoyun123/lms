<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>站内信</title>
            <style>
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                .mt {
                    margin-top: 10px;
                }
                
                .ml {
                    margin-left: 10px;
                }
                
                .m20 {
                    margin: 20px;
                }
                
                .hidden {
                    display: none;
                }
                
                .dis_flex {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .dis_flex_between {
                    display: flex;
                    justify-content: space-between;
                }
                
                .dis_flex_column {
                    display: flex;
                    flex-direction: column
                }
                
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .lh_42 {
                    line-height: 42px;
                }
                
                .w_100 {
                    width: 100px;
                }
                
                .hide {
                    display: none;
                }
                
                #LAY-amazonMail .layui-nav-tree {
                    width: 120px!important;
                }
                
                #LAY-amazonMail .layui-nav {
                    background-color: #fff!important;
                    color: #4c4c4c!important;
                }
                
                #LAY-amazonMail .layui-nav .layui-nav-item a {
                    color: #4c4c4c!important;
                }
                
                #LAY-amazonMail .layui-nav .layui-nav-item a:hover {
                    color: #1E9FFF!important;
                    background-color: rgba(0, 0, 0, .1)!important
                }
                
                #LAY-amazonMail .layui-nav-tree .layui-nav-child a {
                    color: #4c4c4c!important;
                }
                
                #LAY-amazonMail .layui-nav-tree .layui-nav-child a:hover {
                    color: #1E9FFF!important;
                    background-color: rgba(0, 0, 0, .1)!important
                }
                
                #LAY-amazonMail .layui-nav-itemed>.layui-nav-child {
                    background-color: #fff!important;
                }
                
                #LAY-amazonMail .layui-nav .layui-nav-mored,
                #LAY-amazonMail .layui-nav-itemed>a .layui-nav-more {
                    margin-top: -9px;
                    border-style: dashed dashed solid;
                    border-color: transparent transparent #4c4c4c!important;
                }
                
                #LAY-amazonMail .layui-nav .layui-nav-more {
                    content: '';
                    width: 0;
                    height: 0;
                    border-style: solid dashed dashed;
                    border-color: #fff transparent transparent;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all .2s;
                    -webkit-transition: all .2s;
                    position: absolute;
                    top: 50%;
                    right: 3px;
                    margin-top: -3px;
                    border-width: 6px;
                    border-top-color: #4c4c4c!important;
                }
                
                .folder {
                    border-top: 1px solid #ccc;
                }
                
                #LAY-amazonMail .layui-nav-tree .layui-nav-child dd.layui-this,
                #LAY-amazonMail .layui-nav-tree .layui-nav-child dd.layui-this a,
                #LAY-amazonMail .layui-nav-tree .layui-this,
                #LAY-amazonMail .layui-nav-tree .layui-this>a,
                #LAY-amazonMail.layui-nav-tree .layui-this>a:hover {
                    background-color: rgba(0, 0, 0, .1)!important;
                    color: #1E9FFF!important;
                }
                
                #LAY-amazonMail .layui-nav-tree .layui-nav-bar {
                    background-color: #1E9FFF!important;
                }
                
                .spot {
                    content: '';
                    height: 10px;
                    width: 10px;
                    border-radius: 10px;
                    background: #ccc;
                    display: inline-block;
                    margin: 5px;
                    vertical-align: middle;
                }
                
                .unread {
                    background-color: #1E9FFF!important;
                }
                
                .warntag {
                    background: #fc505a;
                    padding: 2px 5px;
                    color: #fff;
                    display: inline;
                    border-radius: 10px;
                }
                
                .subject_dis {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-left: 5px;
                }
                
                .name_dis {
                    line-height: 35px;
                    font-weight: 700;
                }
                
                .bd_gray {
                    border-bottom: 1px solid #ccc;
                    padding: 5px 0;
                }
                
                .mailList {
                    max-height: calc(100vh - 220px);
                }
                
                .mailList form {
                    max-height: calc(100vh - 220px);
                    height: calc(100vh - 220px);
                    overflow-y: scroll;
                }
                
                .main {
                    max-height: calc(100vh - 220px);
                    height: calc(100vh - 220px);
                    overflow-y: scroll;
                }
                
                .pointer {
                    cursor: pointer;
                }
                
                .vert_bottom {
                    vertical-align: bottom;
                }
                
                .maincontent {
                    height: calc(100vh - 220px);
                    overflow: hidden;
                }
                /* .mailcontent {
                    padding-bottom: 180px;
                } */
                
                .mb {
                    margin-bottom: 10px!important;
                }
                
                .mlr {
                    margin: 0px 10px;
                }
                
                .uploadatachment {
                    color: #1E9FFF;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                }
                
                #amazonmail {
                    height: 100%
                }
                
                .mailmailfooter .el-upload-list__item:first-child {
                    margin-top: 10px!important
                }
                
                .mailmailfooter .el-upload-list {
                    display: flex!important;
                }
                
                .mailmailfooter {
                    position: fixed;
                    bottom: 0;
                    right: 50px;
                    background: #fff;
                    width: 60%;
                    padding: 10px 20px;
                }
                
                .mailheader {
                    border-bottom: 1px solid #ccc;
                }
                
                .onemessage {
                    margin: 5px
                }
                
                .messagebox {
                    display: inline-block;
                    padding: 10px;
                    border-radius: 5px;
                    background: rgb(250, 250, 250);
                    white-space: pre-wrap;
                }
                
                .dis_end {
                    display: flex;
                    justify-content: flex-end;
                }
                
                .text_r {
                    text-align: right;
                }
                
                .mailbox {
                    padding-bottom: 240px;
                }
                
                .clicked {
                    background: rgb(242, 242, 242)
                }
                
                .main .tips {
                    color: rgb(241, 65, 74);
                    background: rgb(252, 240, 240);
                    border: 1px solid rgb(241, 65, 74)
                }
                
                a {
                    color: #333!important;
                    text-decoration: none!important;
                }
            </style>
            <link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css">
            <div class="layui-fluid" id="LAY-amazonMail">
                <template class="layui-row layui-col-space15" id="amazonmail">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="amazonMailForm" lay-filter="amazonMailForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select id="orgTree" lay-filter="amazonorgTree" class="orgs_hp_custom" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">销售员</label>
                                            <div class="layui-input-block">
                                                <select id="userList" name="salePersonId" lay-filter="amazonuserList" class="users_hp_custom" data-rolelist="amazon专员" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select id="amazonmail_storeAcct" name="storeAcctId" lay-filter="amazonmail_storeAcct" lay-search class="store_hp_custom" data-platcode="amazon">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">邮箱</label>
                                            <div class="layui-input-block">
                                                <select id="amazonmail__email" name="email" lay-filter="amazonmail__email" lay-verify="required" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block fr">
                                                <permTag:perm funcCode="batch_update_amazon_mail_sync">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-filter="amazonAsynEmail" lay-submit>同步邮件</button>
                                                 </permTag:perm>
                                            </div>
                                        </div>
                                    </div>
                                        <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">主题</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="emailSubject" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">发件人</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="fromName" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">发件箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="fromEmail" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">订单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderId" class="layui-input">
                                            </div>
                                        </div>
                                        <input type="hidden" name="emailType" value="0">
                                        <input type="hidden" name="folderName" value="">
                                        <input type="hidden" name="isSend" value="0">
                                        <input type="hidden" name="ourFlag" value="2">
                                        <input type="hidden" name="page" value="1">
                                        <input type="hidden" name="limit" value="10">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-input-block fr">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="amazonMailSearch" lay-filter="amazonMailSearch" lay-submit>查询</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab dis_flex_column" lay-filter="mailTypeTab">
                                    <div class="dis_flex_between">
                                        <ul class="layui-tab-title">
                                            <li class="layui-this" data-index="0">买家邮件({{num[0]}})</li>
                                            <li data-index="1">Q&A问答({{num[1]}})</li>
                                            <li data-index="2">亚马逊邮件({{num[2]}})</li>
                                            <li data-index="3">其他邮件({{num[3]}})</li>
                                            <li data-index="4">亚马逊通知({{num[4]}})</li>
                                        </ul>
                                        <div class="btn-group">
                                            <permTag:perm funcCode="batch_update_amazon_mail_has_read">
                                                <button type="button" v-if="(activeTab===2)||(activeTab===3)||(activeTab===4)" class="layui-btn layui-btn-normal layui-btn-sm" @click="batchMarkOption('2')">标记已读</button>
                                            </permTag:perm>
                                            <!-- <button type="button" v-if="(activeTab===0)" class="layui-btn layui-btn-normal layui-btn-sm" @click="batchMarkOption('1')">无需回复</button> -->
                                            <permTag:perm funcCode="batch_upat">
                                            <button type="button" v-if="(activeTab===0)||(activeTab===1)" class="layui-btn layui-btn-normal layui-btn-sm" @click="batchMarkOption('0')">已在平台回复</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content maincontent">
                                        <div class="layui-tab-item layui-show clearfix">
                                            <div class="layui-col-lg1 layui-col-md1">
                                                <ul class="layui-nav layui-nav-tree" lay-filter="isRecive">
                                                    <li class="layui-nav-item">
                                                        <a href="javascript:;" data-index="isReceved">已接收</a>
                                                        <dl class="layui-nav-child">
                                                            <dd><a href="javascript:;" data-index="all">全部</a></dd>
                                                            <dd><a href="javascript:;" data-index="isRead">未读</a></dd>
                                                        </dl>
                                                    </li>
                                                    <li class="layui-nav-item">
                                                        <a href="javascript:;" data-index="isSend" class="bd_gray">已发送</a>
                                                    </li>
                                                    <li class="layui-nav-item">
                                                            <a href="javascript:;" data-index="isReceved">文件夹</a>
                                                            <dl class="layui-nav-child">
                                                                <dd><a href="javascript:;"  data-index="Junk">Junk</a></dd>
                                                                <dd><a href="javascript:;" data-index="Inbox">Inbox</a></dd>
                                                            </dl>
                                                    </li>
                                                </ul>
                                                <ul class="layui-nav layui-nav-tree" lay-filter="isReciveHide" style="display: none">
                                                    <li class="layui-nav-item">
                                                        <a href="javascript:;" data-index="isReceved">阅读状态</a>
                                                        <dl class="layui-nav-child">
                                                            <dd><a href="javascript:;" data-index="all">全部</a></dd>
                                                            <dd><a href="javascript:;" data-index="isRead">已读</a></dd>
                                                            <dd><a href="javascript:;" data-index="noRead">未读</a></dd>
                                                        </dl>
                                                    </li>
                                                    <li class="layui-nav-item">
                                                        <a href="javascript:;" data-index="isReceved">文件夹</a>
                                                        <dl class="layui-nav-child">
                                                            <dd><a href="javascript:;"  data-index="asin异常">ASIN异常</a></dd>
                                                        </dl>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="layui-col-lg3 layui-col-md3">
                                                <div class="mailList">
                                                        <form class="layui-form" type="1" id="maillist">
                                                                <div class="bd_gray">
                                                                    <input type="checkbox" name="checkall" :checked="isAll" title="全部" lay-skin="primary" lay-filter="checkall" >                                                
                                                                </div>
                                                                <div v-for="(item ,index) in amazonmailList" :class="item.id===clickId?'bd_gray pointer clicked':'bd_gray pointer'" @click="checkEamil(item.id,item.emailType)" :key="index">
                                                                    <div class="name_dis"><div :class="item.ourFlag===0?'spot unread':'spot'"></div>{{item.fromName}}</div>
                                                                    <div class="dis_flex">
                                                                        <input type="checkbox" :checked="item.ischecked" lay-skin="primary" lay-filter="itemCheckbox" :data-index="index">
                                                                        <div class="subject_dis">{{item.emailSubject}}</div>
                                                                    </div>
                                                                    <div class="warntag" v-if="item.emailType===0">{{item.timediff}}</div>
                                                                </div>
                                                                <div class="more_loading" v-if="touchend">无更多</li>
                                                        </form>
                                                        </div>
                                                </div>
                                            </div>
                                            <div class="layui-col-lg8 layui-col-md8">
                                                <div class="main" v-if="curremailcontent">
                                                    <div class="mailheader dis_flex_between">
                                                        <div>
                                                            <div><span class="name_dis">{{currmessage.fromName}}</span><span>{{currmessage.fromEmail}}</span></div>
                                                            <div>{{currmessage.emailSubject}}</div>
                                                        </div>
                                                        <div class="vert_bottom">
                                                            {{currmessage.sendDate}}                       
                                                        </div>
                                                    </div>
                                                    <div class="tips" v-if="(curremailcontent[0].emailType===2)||(curremailcontent[0].emailType===3)">为防止账号关联，邮件中的图片和链接已禁用，请勿点开此邮件中的链接或按钮</div>
                                                    <div class="tips" v-if="curremailcontent[0].emailType===1">为防止账号关联，QA邮件中的回复链接已被禁用，请到亚马逊后台回复QA消息</div>
                                                    <div class="mailcontent" v-if="curremailcontent[0].emailType!==0">
                                                        <div class="mailbox" v-html="curremailcontent[0].content">{{curremailcontent[0].content}}</div>
                                                        <div>
                                                            <ul class="el-upload-list el-upload-list--text dis_flex">
                                                                <li tabindex="0" class="el-upload-list__item is-success"  v-for="(item ,index) in curremailcontent[0].attachmentList">
                                                                    <a class="el-upload-list__item-name" @click="downloadAttachment(item.attachment)"><i class="el-icon-document"></i>{{item.attachmentName}}</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <div class="mailbox clearfix">
                                                            <div v-for="(item ,index) in curremailcontent" :class="item.leftOrRight?'onemessage':'onemessage dis_end'">
                                                                <div>
                                                                <div :class="item.leftOrRight?'':'text_r'">{{item.sendDate}}</div>
                                                                <div v-html="item.content" class="messagebox">{{item.content}}</div>  
                                                                <div>
                                                                        <ul class="el-upload-list el-upload-list--text dis_flex">
                                                                            <li tabindex="0" class="el-upload-list__item is-success"  v-for="(inneritem ,index) in item.attachmentList">
                                                                                <a class="el-upload-list__item-name" @click="downloadAttachment(inneritem.attachment)"><i class="el-icon-document"></i>{{inneritem.attachmentName}}</a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="mailmailfooter" v-if="curremailcontent[0].emailType!==1&&curremailcontent[0].emailType!==4">
                                                        <form class="layui-form">
                                                                <div class="layui-form-item">
                                                                        <div class="layui-col-md3 layui-col-lg3 mlr mb">
                                                                                <select lay-filter="templateType" placeholder="请选择模板类型" lay-search>
                                                                                        <option value="">请选择模板类型</option>
                                                                                    <option v-for="(item ,index) in mailTypeEnum" :value="item.name">{{item.name}}</option>
                                                                                </select>
                                                                        </div>
                                                                        <div class="layui-col-md3 layui-col-lg3 mlr mb">
                                                                                <select lay-filter="templateName" placeholder="请选择模板名称"  lay-search>
                                                                                        <option value="">请选择模板名称</option>
                                                                                        <option v-for="(item ,index) in mailEnum" :value="item.id">{{item.name}}</option>
                                                                                </select>
                                                                        </div>
                                                                        <div class="layui-col-lg12 layui-col-md12 mb">
                                                                            <input type="text" v-model="replyMailContent" class="layui-input" v-if="showtext" @click="showtext=!showtext">
                                                                            <textarea v-model="replyMailContent" class="layui-textarea" v-if="!showtext" lay-verify="required"></textarea>
                                                                        </div> 
                                                                        <div class="layui-col-lg12 layui-col-md12 dis_flex_between">
                                                                             <div>
                                                                                    <el-upload
                                                                                    class="upload-demo"
                                                                                    :action="uploadaction"
                                                                                    multiple
                                                                                    :limit="3"
                                                                                    :on-success="uploadsuccess"
                                                                                    :on-remove="removeFile"
                                                                                    :file-list="fileObjList"
                                                                                    :before-upload="beforeUpload"
                                                                                    >
                                                                                    <el-button size="small" type="text">上传附件</el-button>
                                                                                    <div slot="tip" class="el-upload__tip">(最大10M)您可上传文本文件，PDF，Word,及jpg/gif/png图片</div>
                                                                                  </el-upload>
                                                                             </div>
                                                                             <div>
                                                                                    <button type="button" v-if="!showtext" class="layui-btn layui-btn-primary layui-btn-sm" @click="showtext=!showtext">收起</button>
                                                                        <permTag:perm funcCode="batch_update_amazon_mail_send">
                                                                                    <button type="button" :disabled="replyMailContent===''" class="layui-btn layui-btn-normal layui-btn-sm" @click="replyMailOption" lay-submit>发送</button>
                                                                        </permTag:perm>
                                                                             </div>
                                                                        </div>                                                                       
                                                                    </div>                                                            
                                                        </from>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
            <script src="${ctx}/static/vue/js/element-ui@2.6.2.js"></script>
            <script type="text/javascript" src="${ctx}/static/js/customer/amazon/amazonmail.js"></script>