var tableData;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     element = layui.element,
     laydate = layui.laydate,
     $ = layui.$;
     form.render(null, 'component-form-element');
     element.render('breadcrumb', 'breadcrumb');
     form.render('select')
    table.render({
        elem: "#voice_speech_table",
        method:'post',
        url: ctx + "/voiceSpeech/getvoicePage.html",
        cols: [[
            {type: "checkbox"},
            { field: "id", title: "id" },
            { field: "businessModule", title: "业务模块",templet:'#busiMudBar',width:"20%"},
            { field: "voiceName", title: "文件名",width:"20%"},
            { field: "voiceNewName", title: "文件名"},
            { field: "voiceDesc", title: "备注" ,width:"25%"},
            { title: '操作', align: 'center', toolbar: '#voice_processBar' ,width:"30%"}
        ]],
        where:voice_getSerachData(),
        page:false,
        id:"voice_speech_table",
        limits:[10,20,50],
        limit:10,
        done:function(res, curr, count){
            tableData = res;
            $("[data-field='id']").css('display', 'none');
            $("[data-field='voiceNewName']").css('display', 'none');
            $("#tolnum_span_num").text("共"+count+"条");
        }
    });


    /**
     * 获取搜索参数
     */
    function  voice_getSerachData() {
        var obj = {};
        var voiceName = $.trim($("#file_name").val());
        var voiceDesc =$.trim($("#file_remark").val());
        obj.voiceName = voiceName
        obj.voiceDesc = voiceDesc
        return obj;
};
    $("#add_voice").click(function(){
        var formData1 = new FormData();
        //添加活动登记按钮
        var index = layer.open({
            title: '新增语音播报模块',
            type: 1,
            btn: ['上传', '关闭'],
            content: $('#addVoiceSpeechtpl').html(),
            area: ['650px', '450px'],
            success: function () {
                $("#voice_file").change(function () {
                    var fileName = this.files[0].name;
                    var seat = fileName.lastIndexOf(".");
                    var extension = fileName.substring(seat).toLowerCase();
                    if (extension != '.mp3' && extension != '.mpeg' && extension != '.midi' && extension != '.wma') {
                        layer.msg('请传入后缀为.mp3,.mpeg,midi,wma 音频文件')
                        return
                    }else{
                        formData1.append("fileName",fileName);
                        formData1.append("file",this.files[0]);
                        console.log("jinlaile")
                        var objUrl = getObjectURL(this.files[0]);
                        $("#audio").attr("src", objUrl);
                        // $("#audio")[0].play();
                        $("#audio").show();
                        getTime();
                    }
                });
                form.render('select')
            },
            yes: function () {
                var voiceDesc =  $("#voice_desc").val();
                var fileNameIn =  $("#file_name_in").val();
                var businessModulen =  $("#business_module_input").val();
                if(voiceDesc==null || voiceDesc==''){
                    layer.msg("请填写备注！")
                    return
                }else{
                    formData1.append("fileNameIn",fileNameIn)
                    formData1.append("voiceDesc",voiceDesc);
                    formData1.append("businessModulen",businessModulen);
                    var index = layer.confirm('确认新增这个音频吗', { btn: ['确认', '取消'] },
                        function() {
                            loading.show()
                            $.ajax({
                                url: ctx + '/voiceSpeech/uploadVoice.html',
                                type: 'POST',
                                // async : false,
                                data: formData1,
                                // 告诉jQuery不要去处理发送的数据
                                processData: false,
                                // 告诉jQuery不要去设置Content-Type请求头
                                contentType: false,
                                success: function(data) {
                                    loading.hide()
                                    $(self).val('')
                                    console.log(data)
                                    if (data.code == '0000') {
                                        layer.msg("上传成功");
                                    } else {
                                        layer.msg(data.msg)
                                    }
                                    table.reload('voice_speech_table', {
                                        where: voice_getSerachData()
                                    });

                                },
                                error: function() {
                                    loading.hide()
                                    $(self).val('')
                                }
                            });
                            layer.closeAll()
                        },
                        function() {
                            layer.close(index)
                        }
                    )
                }
            }
        })
    })
    $("#voiceSearchBtn").click(function () {
        console.log(this)
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    var active = {
        reload: function () {
            //执行重载
            table.reload('voice_speech_table', {
                where: voice_getSerachData()
            });
        },
    };

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(voice_speech_table)', function (obj) {
        var formData2 = new FormData();
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '修改语音播报模块',
                area: ['600px', '400px'],
                btn: ['保存','取消'],
                shadeClose: false,
                content: $('#addVoiceSpeechtpl').html(),
                success: function () {
                    $("#voice_desc").val(data.voiceDesc);
                    $("#file_name_in").val(data.voiceName);

                    console.log("businessModulen"+data.businessModulen)
                    $("#business_module_input option[value='1']").prop("selected","selected");

                    // $("#business_module_input").val(data.businessModulen);

                    $("#voice_file").change(function () {
                        var fileName = this.files[0].name;
                        var seat = fileName.lastIndexOf(".");
                        var extension = fileName.substring(seat).toLowerCase();
                        if (extension != '.mp3' && extension != '.mpeg' && extension != '.midi' && extension != '.wma') {
                            layer.msg('请传入后缀为.mp3,.mpeg,midi,wma 音频文件')
                            return
                        }else{
                            formData2.append("fileName",fileName);
                            formData2.append("file",this.files[0]);
                            console.log("jinlaile")
                            var objUrl = getObjectURL(this.files[0]);
                            $("#audio").attr("src", objUrl);
                            // $("#audio")[0].play();
                            $("#audio").show();
                            getTime();
                        }
                    });
                    form.render('select')

                },
                yes: function (index, layero) {
                    var voiceDesc =  $("#voice_desc").val();
                    var businessModulen =  $("#business_module_input").val();
                    var fileNameIn =  $("#file_name_in").val();
                    if(voiceDesc==null || voiceDesc==''){
                        layer.msg("请填写备注！")
                        return
                    }else{
                        formData2.append("fileNameIn",fileNameIn)
                        formData2.append("id",id);
                        formData2.append("businessModulen",businessModulen);
                        formData2.append("voiceDesc",voiceDesc);
                        layer.confirm('确认修改这个音频吗', { btn: ['确认', '取消'] },
                            function() {
                                loading.show()
                                $.ajax({
                                    url: ctx + '/voiceSpeech/uploadVoice.html',
                                    type: 'POST',
                                    // async : false,
                                    data: formData2,
                                    // 告诉jQuery不要去处理发送的数据
                                    processData: false,
                                    // 告诉jQuery不要去设置Content-Type请求头
                                    contentType: false,
                                    success: function(data) {
                                        loading.hide()
                                        $(self).val('')
                                        if (data.code == '0000') {
                                            layer.msg("上传成功");
                                        } else {
                                            layer.alert(data.msg)
                                        }
                                        table.reload('voice_speech_table', {
                                            where: voice_getSerachData()
                                        });
                                        layer.closeAll()
                                    },
                                    error: function() {
                                        loading.hide()
                                        $(self).val('')
                                    }
                                });
                            },
                            function() {
                                layer.closeAll()
                            }
                        )
                    }
                }
            })
        } else if (layEvent === 'play') {
            console.log(data.id)
            var url =data.voiceNewName;
            $("#audiolist_"+data.id).attr("src", url);
            $("#audiolist_"+data.id)[0].play();
            $("#audiolist_"+data.id).show();
        }
    });

    <!--获取mp3文件的时间 兼容浏览器-->
    function getTime() {
        setTimeout(function () {
            var duration = $("#audio")[0].duration;
            if(isNaN(duration)){
                getTime();
            }
            else{
                console.info("该音频的总时间为："+$("#audio")[0].duration+"秒")
            }
        }, 10);
    }
    <!--把文件转换成可读URL-->
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
});
