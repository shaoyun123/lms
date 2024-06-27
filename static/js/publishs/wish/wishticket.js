/*
 * @Author: ztao
 * @Date: 2021-08-09 15:00:35
 * @LastEditTime: 2023-03-01 11:19:50
 * @Description: 
 */
layui.use(['admin', 'table', 'form', 'element', 'layer', 'laytpl', 'formSelects', 'laydate', 'selectInput'], function() {
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        selectInput = layui.selectInput,
        formSelects = layui.formSelects,
        form = layui.form;
    let vm = new Vue({
        el: '#wishticket_app',
        data() {
            return {
                isActive: '',
                searchData: [], //表单搜索详情
                chatRecord: [], //根据ticketId查询到沟通纪录
                prods: [], //产品的信息
                orders: [], //订单的信息
                checkedTickets: [], //选中的ticketId
                stateVal: 1,
                state: '', //状态
                type: '', //售前还是售后
                replies: [], //聊天纪录
                dialogTableVisible: false, //日志弹框
                dialogRefundVisible: false, //退款弹框
                logsData: [], //日志弹框数据
                refundData: [
                    { value: 1, name: 'Store is unable to fulfill order, unable to ship' },
                    { value: 25, name: 'Item is damaged' },
                    { value: 32, name: 'Item was returned to sender' }
                ],
                refundSelect: 1, //选中的退款原因
                refundOrderId: '', //退款订单的id
                wishTemplateData: [], //wish模板数据
                wishTemplateSelect: '', //选中的模板值
                storeAcctId: '', //点击的订单的店铺id
                contentLength: 0 //输入的内容长度
            }
        },
        created() {
            this.getWishTemplate();
        },
        mounted() {
            //渲染部门销售员店铺三级联动
            render_hp_orgs_users("#wishticketForm");

            //固定表头
            // UnifiedFixedFn('wishticketCard');
            //渲染时间
            this.renderTime();
            //渲染复选框
            formSelects.render();
            form.render();
            this.watchTabClick();
        },
        methods: {
            //搜索功能
            wishticket_search() {
                let formData = serializeObject($('#wishticketForm'));
                //time处理
                if (formData.timeValue) {
                    var timeArr = formData.timeValue.split(" - ");
                    formData.openedAtStart = timeArr[0] + ' 00:00:00';
                    formData.openedAtEnd = timeArr[1] + ' 23:59:59';
                } else {
                    formData.openedAtStart = '';
                    formData.openedAtStart = '';
                };
                delete formData.timeValue;
                //问题类型处理
                if (!formData.subLabels) {
                    delete formData.subLabels;
                }
                // if(!window.location.host.includes('mx')){
                formData.isLms = formData.orderId;
                formData.orderId = '';
                if(formData.isLms*1 != formData.isLms){
                    return layer.alert('订单号错误，请输入数字', { icon: 2 });
                }
                if(formData.isLms == ''){
                    formData.isLms = null
                }
                // }
                formData.state = this.stateVal;
                let _this = this;
                this.searchAjax(formData).then(res => {
                    this.searchData = _this.newSearchData(res);
                    // console.log(this.searchData);
                    $('#wishticket_tabs').find('li span').html('');
                    $('#wishticket_tabs').find('li.layui-this span').html(`(${res.length})`);
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            },
            //搜索后的数据处理
            newSearchData(data) {
                let newData = data;
                let nowDateTimes = Date.now();

                let differenceTimes = 48 * 60 * 60 * 1000;
                for (let i = 0; i < newData.length; i++) {
                    let item = newData[i];
                    let currentDateTimes = new Date(item.updatedAt).getTime();
                    if ((nowDateTimes - currentDateTimes) > differenceTimes) {
                        // console.log(`差值大于48小时`);
                        item.overtime = true;
                    } else {
                        item.overtime = false;
                    }
                };
                return newData;
            },
            //输入监听
            responseHandle() {
                let contLength = this.$refs['dialogBox-response'].innerText.length;
                if (contLength > 2000) {
                    this.contentLength = 2000;
                    this.$refs['dialogBox-response'].innerText = this.$refs['dialogBox-response'].innerText.slice(0, 2000);
                } else {
                    this.contentLength = contLength;
                }
            },
            //根据ticketID获取详情
            showTicketDetail(ticketId) {
                this.isActive = ticketId;
                this.ticketIdAjax(ticketId).then(res => {
                    this.chatRecord = res.replies; //聊天纪录
                    this.prods = res.prods;
                    this.orders = res.orders;
                    this.replies = res.replies;
                    this.wishTemplateSelect = '';
                    this.storeAcctId = res.storeAcctId;
                    this.$refs['dialogBox-response'].innerText = '';
                    this.state = res.state;
                    this.type = res.type;
                    this.contentLength = 0;
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                });
            },
            //处理Markdown插件
            markedHandle(md) {
                return marked(md);
            },
            //官方支持
            officialSupHandle() {
                let ticketId = this.isActive;
                let _this = this;
                if (!ticketId) {
                    return layer.alert('请先点击一条数据', { icon: 7 });
                }
                layer.confirm('请求官方支持后将不能对该客户问题进行操作', { icon: 3, title: '提示' }, function(index) {
                    _this.updateStateAjax(ticketId, 'AWAITING_WISH').then(res => {
                        layer.close(index);
                    }).catch(err => {
                        layer.alert(err || err.message, { icon: 2 });
                    });
                });
            },
            //关闭
            closeHandle() {
                let ticketId = this.isActive;
                let _this = this;
                if (!ticketId) {
                    return layer.alert('请先点击一条数据', { icon: 7 });
                }
                layer.confirm('关闭客户问题后将不能对该客户问题进行操作', { icon: 3, title: '提示' }, function(index) {
                    _this.updateStateAjax(ticketId, 'CLOSED').then(res => {
                        layer.close(index);
                    }).catch(err => {
                        layer.alert(err || err.message, { icon: 2 });
                    });
                });
            },
            //图片点击跳转
            imgJump(productId) {
                if (!productId) {
                    return layer.alert('该产品没有ID,无法跳转', { icon: 2 });
                }
                window.open(`https://www.wish.com/c/${productId}`, '_blank');
                return false;
            },
            //更新状态
            updateStateAjax(ticketId, state) {
                return commonReturnPromise({
                    type: 'put',
                    contentType: 'application/json',
                    url: `/lms/ticket/${ticketId}`,
                    params: JSON.stringify({
                        state: state
                    })
                });
            },
            //发送信息
            sendMsgHandle() {
                let _this = this;
                let replyBoby = this.$refs['dialogBox-response'].innerText.trim();
                if (replyBoby.length == 0) {
                    return layer.alert('回复内容不能为空', { icon: 7 });
                }
                let ticketId = this.isActive;
                if (!ticketId) {
                    return layer.alert('请先选中一条数据', { icon: 7 });
                }
                this.sendMsgAjax(replyBoby, ticketId).then(res => {
                    console.log(res);
                    _this.showTicketDetail(ticketId);
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            },
            //发送信息接口
            sendMsgAjax(msg, ticketId) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: `/lms/ticket/reply/${ticketId}`,
                    params: JSON.stringify({
                        message: msg
                    })
                });
            },
            //搜索ajax
            searchAjax: function(obj) {
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/ticket/list',
                    params: JSON.stringify(obj)
                });
            },
            //根据ticketId查询详情ajax
            ticketIdAjax: function(id) {
                return commonReturnPromise({
                    url: `/lms/ticket/${id}`
                });
            },
            //渲染时间
            renderTime: function() {
                var nowdate = Date.now();
                var endTime = Format(nowdate, 'yyyy-MM-dd');
                var startTime = Format((nowdate - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
                var timeVal = startTime + ' - ' + endTime;
                laydate.render({
                    elem: "#wishticket_times",
                    type: "date",
                    range: true,
                    value: timeVal
                });
            },
            //监听layui_tab点击
            watchTabClick() {
                let _this = this;
                element.on('tab(wishticket_tabs)', function(obj) {
                    var index = obj.index;
                    var stateVal = obj.elem.find('li.layui-this').attr('data-index');
                    _this.stateVal = stateVal;
                    // if (index == 0) { //未处理
                    //     _this.stateVal = 1;
                    // } else if (index == 1) { //已回复
                    //     _this.stateVal = 2;
                    // } else if (index == 2) { //已关闭
                    //     _this.stateVal = 0;
                    // } else if (index == 3) { //全部
                    //     _this.stateVal = '';
                    // }
                    _this.replies = [];
                    _this.prods = [];
                    _this.wishTemplateSelect = '';
                    _this.storeAcctId = '';
                    _this.state = '';
                    _this.orders = [];
                    _this.type = '';
                    _this.contentLength = 0;
                    _this.wishticket_search();
                })
            },
            //全选功能
            allSelectedHandle() {
                let ticketIdArr = this.searchData.map(item => item.ticketId);
                this.checkedTickets.length == ticketIdArr.length ? this.checkedTickets = [] : this.checkedTickets = ticketIdArr;
            },
            //批量同步
            batchSyncHandle() {
                if (this.checkedTickets.length == 0) {
                    return layer.alert('请先选中数据', { icon: 2 });
                }
                this.syncByIdAjax(this.checkedTickets).then(res => {
                    layer.alert('同步成功', { icon: 1 });
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                });
            },
            //全部同步功能
            syncHandle() {
                if (this.searchData.length == 0) {
                    return layer.alert('暂无数据', { icon: 2 });
                } else {
                    let ticketIdArr = this.searchData.map(item => item.ticketId);
                    this.syncByIdAjax(ticketIdArr).then(res => {
                        layer.alert('同步成功', { icon: 1 });
                    }).catch(err => {
                        layer.alert(err.message, { icon: 2 });
                    });
                }
            },
            //根据id同步ticket
            syncByIdAjax(obj) {
                return commonReturnPromise({
                    type: 'put',
                    contentType: 'application/json',
                    url: '/lms/ticket/fetch',
                    params: JSON.stringify(obj)
                })
            },
            //日志处理
            // logsHandle(orderId) {
            //     this.logsAjax(orderId).then(res => {
            //         this.logsData = res;
            //         this.dialogTableVisible = true;
            //     }).catch(err => {
            //         layer.alert(err || err.message, { icon: 2 });
            //     })
            // },
            handleClose() {
                this.logsData = [];
                this.refundSelect = 1;
                this.refundOrderId = '';
            },
            //日志接口
            // logsAjax(orderId) {
            //     return commonReturnPromise({
            //         url: `/lms/allrootTrade/getTradeSendLogs/${orderId}`
            //     });
            // },
            wishTemplateChange(content) {
                this.wishTemplateSelect = content;
                this.$refs['dialogBox-response'].innerText = content;
            },
            //获取wish到模板数据
            getWishTemplate() {
                this.getWishTemplateAjax({
                    "platformCode": "wish",
                    "page": 1,
                    "limit": 1000
                }).then(res => {
                    if (res.length > 0) {
                        let filterData = res.filter(item => {
                            return item.templateStatus == true;
                        });
                        let newData = filterData.map(item => {
                            let obj = {};
                            obj.templateName = item.templateName;
                            obj.emailContent = item.emailContent;
                            obj.id = item.id;
                            return obj;
                        });
                        this.wishTemplateData = newData;
                    } else {
                        this.wishTemplateData = [];
                    }
                })
            },
            //获取到wish模板接口
            getWishTemplateAjax(obj) {
                return commonReturnPromise({
                    url: '/lms/emailTemplate/querySysEmailTemplateList.html',
                    type: 'post',
                    params: obj
                });
            },
            //退款接口
            refundAjax(obj) {
                return commonReturnPromise({
                    type: 'post',
                    url: '/lms/wishOrder/refund',
                    contentType: 'application/json',
                    params: JSON.stringify(obj)
                });
            },
            //退款操作
            refundHandle(orderId) {
                this.dialogRefundVisible = true;
                this.refundOrderId = orderId;
            },
            refundConfirmFn() {
                let obj = {};
                obj.id = this.refundOrderId;
                obj.storeAcctId = this.storeAcctId;
                obj.reasonCode = this.refundSelect;
                this.refundAjax(obj).then(res => {
                    layer.alert(res, { icon: 1 });
                    this.dialogRefundVisible = false;
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            },
            //全量同步接口(根据店铺)
            syncByStoreAjax(obj) {
                return commonReturnPromise({
                    url: '/lms/ticket/fetchByStoreAcctId',
                    type: 'put',
                    contentType: 'application/json',
                    params: obj ? JSON.stringify(obj) : ''
                });
            },
            //同步(根据店铺id)
            syncByStoreHandle() {
                let _this = this;
                let storeId = $('#wishticketForm [name=storeAcctIds]').val();
                if (!storeId) {
                    return layer.alert('请选择需要同步的店铺', { icon: 7 });
                }
                this.syncByStoreAjax(storeId.split(',')).then(res => {
                    layer.alert(res, { icon: 1 }, function(index) {
                        _this.wishticket_search();
                        layer.close(index);
                    });
                })

            }
        },
    })


});