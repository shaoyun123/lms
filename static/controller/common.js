/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2

 */
var toFixedTabHead,prohibitShowBigImgfun
layui.define(function(exports) {
    var $ = layui.$,
        layer = layui.layer,
        laytpl = layui.laytpl,
        setter = layui.setter,
        view = layui.view,
        admin = layui.admin;
    $(document).ajaxSend(function( event, jqxhr, settings ) {
        var username = localStorage.getItem('lmsAppUserName');
        if (settings.url != null && settings.url.indexOf("lms") > -1) {
            var sdata = settings.data;
            if (sdata != null) {
                if (typeof sdata == 'string' && sdata.indexOf("lmsAppUserName") < 0) {
                    if (sdata.indexOf("{") == 0 || sdata.indexOf("[") == 0) {
                        // sdata = sdata.substring(0, sdata.lastIndexOf('}')) + ",\"lmsAppUserName\":\"" + username + "\"}";
                        //ztt修改于2020/4/30
                        var jsonData = JSON.parse(settings.data);
                        // jsonData.lmsAppUserName = username.indexOf('%') === 0 ? decodeURI(username) : username;
                        jsonData.lmsAppUserName = username;
                        sdata = JSON.stringify(jsonData);
                    } else if (sdata.indexOf("&") > 0) {
                        sdata += "&lmsAppUserName=" + username;
                    }
                    settings.data = sdata;
                }
            }
        }
    });
    //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
    /*时间格式化start*/
    admin.Format = function(datetime, fmt) {
        if (datetime) {
            datetime = datetime.toString();
            if (parseInt(datetime) == datetime) {
                if (datetime.length == 10) {
                    datetime = parseInt(datetime) * 1000;
                } else if (datetime.length == 13) {
                    datetime = parseInt(datetime);
                }
            }
            datetime = new Date(datetime);
            var o = {
                "M+": datetime.getMonth() + 1, //月份
                "d+": datetime.getDate(), //日
                "h+": datetime.getHours(), //小时
                "m+": datetime.getMinutes(), //分
                "s+": datetime.getSeconds(), //秒
                "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
                "S": datetime.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        } else {
            return "";
        }
    };
    /*end*/

    /*表单转对象start*/
    admin.serializeObject = function(form) {
            var o = {};
            $.each(form.serializeArray(), function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
        /*end*/

    /*公共商品分类选择start*/
    admin.itemCat_select = function(id, inputId, divId, cateUrl, cateSearchUrl, yesTodo,otherParams={}) {
            admin.popup({
                id: id,
                title: '选择分类',
                area: ['100%', '70%'],
                btn: ['保存', '关闭'],
                success: function(layero) {
                    layuiOpenPop = true
                    if (cateUrl) {
                        $("body").attr("cateUrl", cateUrl);
                    } else {
                        $("body").removeAttr("cateUrl");
                    }
                    if (cateSearchUrl) {
                        $("body").attr("cateSearchUrl", cateSearchUrl);
                    } else {
                        $("body").removeAttr("cateSearchUrl");
                    }
                    let { isNeedPrediction, prodId, salesSite } = otherParams
                    if (isNeedPrediction) {
                        $("body").attr("isNeedPrediction", isNeedPrediction);
                        $("body").attr("prodId", prodId);
                        $("body").attr("salesSite", salesSite);
                        $("body").attr("inputId", inputId);
                        $("body").attr("divId", divId);
                    } else {
                        $("body").removeAttr("isNeedPrediction");
                        $("body").removeAttr("prodId");
                        $("body").removeAttr("salesSite");
                        $("body").removeAttr("inputId");
                        $("body").removeAttr("divId");
                    }
                    layui.view(this.id).render('route/iframe/itemCat').done(function() {
                        var btnYes = layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn0')
                        var btnCancel = layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn1')
                        btnYes.attr('id', 'btnYes')
                        btnCancel.attr('id', 'btnCancel')
                    })

                },
                yes: function(index, layero) {
                    var li = layero.find('ul li.cat_active'),
                    lilast = li[li.length - 1],
                    cateid = $(lilast).attr('cateid'),
                    prodCateId = $(lilast).attr('prodcateid');
                    
                    let isleaf = $(lilast).attr('isleaf')
                    // amazon_online_creatListing_cateItem-hidden2 建模刊登
                    // amazon_template_creatListing_cateItem-hidden2 新模板创建
                    if (isleaf == 'false' && (inputId === 'amazon_online_creatListing_cateItem-hidden2' || inputId === 'amazon_template_creatListing_cateItem-hidden2') ) {
                      layer.msg('选择amazon子类目要选到子节点')
                      return
                    }
                    $('#' + inputId).val(cateid);

                    if (inputId === 'amazon_online_creatListing_cateItem-hidden2' || inputId === 'amazon_template_creatListing_cateItem-hidden2') {
                        $('#' + inputId).attr('data-id', prodCateId);
                    }
                    
                    $('#' + inputId).trigger("change");
                    //渲染到页面
                    var txts = [];
                    for (var i = 0; i < li.length; i++) {
                        var $li = $(li[i]);
                        var txt = $li.text();
                        txts.push(txt);
                    }
                    var cont = txts.join('  >>  ');
                    $('#' + divId).text(cont);
                    $('#' + divId).trigger("change");
                    // console.log(cont);
                    if (yesTodo) {
                        yesTodo({ li: li, cateid: cateid }, cont) //添加了一个cont参数
                    }
                    layer.close(index)
                },
                end: function () {
                    // layuiOpenPop = false
                }
            })
        }
        /*end*/
    admin.itemNewCate_select = function(id, inputId, divId, cateUrl, cateSearchUrl, yesTodo,otherParams={}) {
          admin.popup({
              id: id,
              title: '选择OA新类目',
              area: ['100%', '70%'],
              btn: ['保存', '关闭'],
              success: function(layero) {
                  layuiOpenPop = true
                  if (cateUrl) {
                      $("body").attr("cateUrl", cateUrl);
                  } else {
                      $("body").removeAttr("cateUrl");
                  }
                  if (cateSearchUrl) {
                      $("body").attr("cateSearchUrl", cateSearchUrl);
                  } else {
                      $("body").removeAttr("cateSearchUrl");
                  }
                  layui.view(this.id).render('route/iframe/itemNewCate').done(function() {
                      var btnYes = layero.find('.layui-layer-btn.layui-layer-btn->.layui-layer-btn0')
                      btnYes.attr('id', 'btnNewYes')
                  })

              },
              yes: function(index, layero) {
                  
                  var li = layero.find('ul li.cate-active'),
                  lilast = li[li.length - 1],
                  cateid = $(lilast).attr('cateid'),
                  prodCateId = $(lilast).attr('prodcateid');
                  
                  let isleaf = $(lilast).attr('isleaf')
                  // amazon_online_creatListing_cateItem-hidden2 建模刊登
                  // amazon_template_creatListing_cateItem-hidden2 新模板创建
                  if (isleaf == 'false' && (inputId === 'amazon_online_creatListing_cateItem-hidden2' || inputId === 'amazon_template_creatListing_cateItem-hidden2') ) {
                    layer.msg('选择amazon子类目要选到子节点')
                    return
                  }
                  $('#' + inputId).val(cateid);

                  if (inputId === 'amazon_online_creatListing_cateItem-hidden2' || inputId === 'amazon_template_creatListing_cateItem-hidden2') {
                      $('#' + inputId).attr('data-id', prodCateId);
                  }
                  
                  $('#' + inputId).trigger("change");
                  //渲染到页面
                  var txts = [];
                  for (var i = 0; i < li.length; i++) {
                      var $li = $(li[i]);
                      var txt = $li.text();
                      txts.push(txt);
                  }
                  var cont = txts.join('  >>  ');
                  $('#' + divId).text(cont);
                  $('#' + divId).trigger("change");
                  // console.log(cont);
                  if (yesTodo) {
                      yesTodo({ li: li, cateid: cateid }, cont) //添加了一个cont参数
                  }
                  layer.close(index)
              },
              end: function () {
                  // layuiOpenPop = false
              }
          })
      }

    /*复制功能*/
    admin.copyTxt = function(obj, event) {
            if (event) {
                event.stopPropagation()
                event.preventDefault()
            }
            var txt = $(obj).prev('a').text();
            var oInput = document.createElement('input'); //创建一个input元素
            oInput.value = txt;
            $(obj).parent('span').append(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.style.display = 'none';
            // layer.msg('复制成功');
            return false;
        }
        /*end*/

    /*复制功能*/
    admin.onlyCopyTxt = function(value, event) {
        if (event) {
            event.stopPropagation()
            event.preventDefault()
        }
        var oInput = document.createElement('input'); //创建一个input元素
        oInput.value = value;
        document.body.append(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.style.display = 'none';
        layer.msg('复制成功');
        return false;
    }

    /*复制功能*/
    admin.copyTxtFunc = function(obj,inputTxt, prevTag,parentTag,event) {
        if (event) {
            event.stopPropagation()
        }
        var txt = inputTxt;
        if(!inputTxt){
             txt = $(obj).parent(parentTag).find(prevTag).text();
        }
        var oInput = document.createElement('input'); //创建一个input元素
        oInput.value = txt;
        $(obj).parent(parentTag).append(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.style.display = 'none';
        layer.msg('复制成功');
        return false;
    }
    /*end*/

    /*鼠标悬停显示大图的js方法 start*/
    prohibitShowBigImg = false
    $('body').on('mouseenter', '.img_show_hide', function(event) {
        if (prohibitShowBigImg) {
            return
        }
        // 无src 则不继续下面的操作
        if (!$(this).attr('src')) {
            return
        }
            //1.获取到鼠标悬停元素相对于视窗的位置集合
            var rect = this.getBoundingClientRect(),
                left = rect.left,
                top = rect.top;
            right = rect.right;
            bottom = rect.bottom;
            // 获取原图的高度和宽度
            var originWidth = this.clientWidth
            var originHeight = this.clientHeight

            // 获取图片长宽
            var originWidth = this.offsetWidth
            var originHeight = this.offsetHeight
                //获取浏览器窗口的高度
            var innerH = window.innerHeight,
                innerW = window.innerWidth;
            //设置大图属性
            var bigWidth = 500,
                bigHeight = 500,
                bigLeft = left + originWidth + 10,
                bigTop = top - (bigHeight - originHeight) / 2
            var countH = bigTop + bigHeight
            var countW = innerW - bigLeft
            if (countH > innerH) {
                var difVal = countH - innerH
                bigTop = innerH - 500 - difVal / 2
                    // console.log(bigTop)
            }
            if (countW < 500) {
                bigLeft = bigLeft - bigWidth - (originWidth + 20)
                    // console.log(bigTop)
            }
            //创建一个代码碎片createDocumentFragment
            // var oFrag = document.createDocumentFragment('div')
                //创建一张图片
            var imgs = document.createElement('img')
                //设置显示的图片以及id
            var src = $(this).attr('src').replace(/small/g, 'original')
            var bigsrc = $(this).attr("data-bigImg")
            if (src) {
                if (src.indexOf('!size') > -1) {
                    src = src.substring(0,src.indexOf('!size'))
                    src += '!size=400x400'
                }

            }
            if(bigsrc){
                src = bigsrc
            }
            $(imgs).attr('src', src)
            $(imgs).attr('class', 'showBigImg')
            //设置显示的图片的样式
            // console.log($(this).hasClass('originalImgSize'))
            // if($(this).hasClass('originalImgSize')){
            //     $(imgs).css({
            //         backgroundColor: 'white',
            //         border: '2px solid #888888',
            //         boxShadow: '10px 10px 5px #888888',
            //         zIndex: 20181025,
            //         position: 'fixed',
            //         left: bigLeft + 'px',
            //         top: bigTop + 'px',
            //     })
            // }else{
                $(imgs).css({
                    backgroundColor: 'white',
                    width: bigWidth + 'px',
                    // height: bigHeight + 'px',
                    height: 'auto',
                    border: '2px solid #888888',
                    boxShadow: '10px 10px 5px #888888',
                    zIndex: 20181025,
                    position: 'fixed',
                    left: bigLeft + 'px',
                    top: bigTop + 'px',
                })
            // }
            // oFrag.appendChild(imgs)
            document.body.appendChild(imgs)
            $(imgs).click(function() {
                $('.showBigImg').remove()
            });
            $(document).bind('mousemove', function(e) {
                if (e.pageX < left || e.pageX > right || e.pageY > bottom || e.pageY < top) {
                    $('.showBigImg').remove();
                    $(document).unbind('mousemove');
                }
            });

        })
        .on('mouseleave', '.img_show_hide', function() {
            $('.showBigImg').remove();
            $(document).unbind('mousemove');
        })
        /* end*/

    /* 鼠标悬停 信息提示 start*/
    $('body').on('mouseenter', '.tip_show_hide', function() {
            //1.获取到鼠标悬停元素相对于视窗的位置集合
            var rect = this.getBoundingClientRect(),
                left = rect.left,
                top = rect.top - 30
                //创建一个代码碎片createDocumentFragment
            var oFrag = document.createDocumentFragment('div')
                //创建一张图片
            var span = document.createElement('span')
                //设置显示的图片以及id
            var tip = $(this).attr('data-tip')
            $(span).text(tip)
            $(span).attr('id', 'showTipSpan')
                //设置显示的图片的样式
            $(span).css({
                borderRadius: '5px',
                backgroundColor: 'white',
                zIndex: 201809061103,
                position: 'fixed',
                left: left + 'px',
                top: top + 'px',
            })
            oFrag.appendChild(span)
            document.body.appendChild(oFrag)
        }).on('mouseleave', '.img_show_hide', function() {
            $('#showTipSpan').remove()
        })
        /* end*/

    /* 固定表头*/
    toFixedTabHead = function(self) {
            if ($(self).find('.toFixedContain') && $(self).find('.toFixedContain').length > 0) {
                var contentTop = self.getBoundingClientRect().top // 当前弹窗内容上边框的top 坐标
                var firstChildTop = $(self).children()[0].getBoundingClientRect().top // 当前弹窗第一个子元素的上边框的top坐标
                var tabHeadTop = $(self).find('.toFixedContain')[0].getBoundingClientRect().top // 需要固定的内容元素的原始scrolltop
                var originDistance = tabHeadTop - firstChildTop // 需要固定的内容元素的原始 距离顶部的距离
                var scrollTop = self.scrollTop // 当前滚动距离
                if (scrollTop > originDistance) {
                    // console.log($(self).find('.fixedPosition').length)
                    if ($(self).find('.fixedPosition').length == 0) {
                        // 先复制所有固定元素
                        var cloneContains = $(self).find('.toFixedContain')
                        var oldCheckBoxList = $(self).find('.toFixedContain  input[type=checkbox]:not([lay-filter=layTableAllChoose])') // 原始checkbox
                        var clones = []
                        var cloneContain
                        var contentWidth = 0
                        var contentHeight = 0
                        for (var i = 0; i < cloneContains.length; ++i) {
                            if (contentWidth < cloneContains[i].offsetWidth) {
                                contentWidth = cloneContains[i].offsetWidth
                            }
                            contentHeight += cloneContains[i].offsetHeight
                            cloneContain = $(cloneContains[i]).clone(true)
                            clones.push(cloneContain)
                        }
                        // 加入固定面板
                        var fixedDiv = $('<div class="fixedPosition layui-form layui-table" lay-filter="fixedPositionForm"></div>')
                        $(self).find('.toFixedContain').eq(0).append(fixedDiv)
                            // 将固定元素加入固定面板
                        for (var i = 0; i < clones.length; ++i) {
                            $(self).find('.fixedPosition').append($(clones[i]))
                        }
                        $(self).find('.fixedPosition').css('top', (contentTop + 5) + 'px')
                        $(self).find('.fixedPosition').css('height', contentHeight + 'px')
                        $(self).find('.fixedPosition').css('width', contentWidth + 'px')
                        var fixedContains = $(self).find('.fixedPosition .toFixedContain')
                        for (var i = 0; i < fixedContains.length; ++i) {
                            fixedContains[i].style.width = cloneContains[i].offsetWidth + 'px'
                            fixedContains[i].style.height = cloneContains[i].offsetHeight + 'px'
                        }
                        $(self).find('.fixedPosition').find('.layui-table th').css('padding', '5px 0')
                            // 全选checkbox
                        $(self).find('.fixedPosition [lay-filter=layTableAllChoose]').next('.layui-form-checkbox').remove()
                        $(self).find('.fixedPosition [lay-filter=layTableAllChoose]').parent().attr('lay-filter', 'layTableAllChooseForm_fixedposition')
                        $(self).find('.fixedPosition [lay-filter=layTableAllChoose]').parent().addClass('layui-form')
                        layui.form.render('checkbox', 'layTableAllChooseForm_fixedposition')
                        $(self).find('.fixedPosition .layui-icon').css('right', '0')
                            // 绑定全选事件
                        $(self).find('.fixedPosition [name=layTableCheckbox]').attr('lay-filter', 'layTableAllChoose_fixedPosition')
                        layui.form.on('checkbox(layTableAllChoose_fixedPosition)', function(obj) {
                            $(self).find('[lay-filter=layTableAllChoose]').next('.layui-form-checkbox').click()
                        })

                        // checkBox 点击事件
                        var newCheckBoxList = $(self).find('.fixedPosition input[type=checkbox]:not([lay-filter=layTableAllChoose_fixedPosition])')
                        if (newCheckBoxList) {
                            for (var i = 0; i < newCheckBoxList.length; ++i) {
                                $(newCheckBoxList[i]).attr('data-checkedId', i)
                                $(oldCheckBoxList[i]).attr('o-data-checkedId', i)
                                $(newCheckBoxList[i]).next('.layui-form-checkbox').click(function() {
                                    var checkedId = $(this).attr('data-checkedId')
                                    var oldcheckedBox = $(self).find('.toFixedContain .layui-form-checkbox[o-data-checkedId=' + checkedId + ']:not([data-checkedId])')
                                    oldcheckedBox.next('.layui-form-checkbox').trigger('click')
                                    if ($(this).hasClass('layui-form-checked')) {
                                        $(this).removeClass('layui-form-checked')
                                    } else {
                                        $(this).addClass('layui-form-checked')
                                    }
                                })
                            }
                        }
                    }
                } else {
                    $(self).find('.fixedPosition').remove()
                }
            }
        }
        /* 固定表头end*/
        /*简单select排序按字母+数字start*/
        /**
         *
         * @param prop
         * @param sortBy  排序方式  1 正序   -1倒序   默认正序
         * @returns {Function}
         */
    admin.compare = function(prop, sortBy) {
            if (!sortBy) {
                sortBy = 1
            }
            return function(obj1, obj2) {
                var val1 = obj1[prop]
                var val2 = obj2[prop]
                if (val1 < val2) {
                    return -sortBy;
                } else if (val1 > val2) {
                    return sortBy;
                } else {
                    return 0;
                }
            }
        }
        /*简单select排序按字母+数字end*/

    /*解决图片碎裂的问题start*/
    admin.img_noFind = function() {
            var img = event.srcElement;
            img.src = ctx + "/static/img/kong.png";
            img.onerror = null;
        }
        /*解决图片碎裂的问题end*/

    /**
     * loading加载的统一规范start
     */
    function Loading() {}
    $.extend(Loading.prototype, {
        index: '',
        show: function() {
            this.index = layer.load(1, {
                shade: [0.3, '#ccc']
            });
        },
        hide: function() {
            layer.close(this.index)
        }
    })
    admin.load = new Loading()
        /**loading加载的统一规范end */


    /*公共详情模板start*/
    admin.publicDetail = function(fn1, fn2) {
        admin.popup({
            id: Date.now(),
            title: '商品详情',
            area: ['1155px', '80%'],
            btn: ['关闭'],
            success: function(layero) {
                layui.view(this.id).render('route/iframe/productDetail').done(fn1);
                if (fn2) {
                    fn2(layero);
                }

            }
        })
    }
    /*公共详情模板end*/

    //批量操作结果弹窗
    /**
     *
     * @param msgPrefix
     * @param batchResult 与后端BatchResult数据结构相同
     * @param callback
     */
    admin.batchResultAlert = function(msgPrefix,batchResult, callback, show=true, showStore=false, isReverse = false) {
        let msg = msgPrefix+"提交"+batchResult.totalNum+"条，成功"+batchResult.successNum+"条，失败"+batchResult.failNum+"条";
        let options = {};
        //处理alert图标
        if(batchResult.failNum == 0){
            options.icon = 1;
        }else{
            options.icon = 7;
        }
        if(batchResult.failNum>20){
            options.area = ['900px','100%'];
        }else{
            options.area = ['900px'];
            options.maxHeight =900
        }
        //展示失败信息
        let trackReg = /(?<=(\[))\d+(?=(\]))/g;
        let failResults = batchResult.failResults;
        let orderIdArr = [];
        for(let i=0; i<failResults.length; i++){
            if(failResults[i] && failResults[i].length>100){
                failResults[i] = `<span data-text='${failResults[i]}' onmouseenter="commonTipsShow(this)" onmouseleave="commonTipsHide(this)">${failResults[i].substr(0,100)}......</span>`;
            }
            //判断无订单号的情况
            let regOrderId =(failResults[i] || '').match(trackReg);
            let orderId = regOrderId == null ? 'null' : regOrderId[0];
            orderIdArr.push(orderId);
        }
        //获取成功信息数组
        let successArr =isReverse? batchResult.successResults.map(item => {
          return item.match(trackReg)== null ? 'null' : item.match(trackReg)[0];
        }): [];
        layer.open({
            title: `提示`,
            content: `<span>${msg}</span>
                      <div ${ failResults.length == 0 ? 'class="disN"' : '' }>
                        <span class="pora copySpan copySpanOverflow" style=" ${ !show ? 'display:none!important;' : '' }">
                            ${!showStore ? '失败订单号':'失败店铺单号'}:<a>${orderIdArr.join(',')}</a>
                            <span class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</span>
                        </span>
                        <br/>
                        <span>具体失败原因如下:</span><br/>
                        ${failResults.join('<br/>')}
                      </div>
                    `,
            btn: ['确认'],
            icon: options.icon,
            area: options.area,
            success: function(layero, index) {
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        !isReverse ?callback(orderIdArr): callback(successArr);
                        layer.close(index);
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function (index) {
                !isReverse ? callback(orderIdArr): callback(successArr);
                layer.close(index);
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                if (onfocus) {
                    onfocus.select()
                }
            }
        });
        // layer.alert(msg + '<br/>' + failResults.join('<br/>'), options, function (index) {
        //     layer.close(index);
        //     callback();
        // });

    }

    admin.batchResultObjAlert = function(msgPrefix,batchResult, callback) {
        let msg = msgPrefix+"提交"+batchResult.totalNum+"条，成功"+batchResult.successNum+"条，失败"+batchResult.failNum+"条";
        let options = {};
        //处理alert图标
        if(batchResult.failNum == 0){
            options.icon = 1;
        }else{
            options.icon = 7;
        }
        if(batchResult.failNum>20){
            options.area = ['900px','100%'];
        }else{
            options.area = ['900px'];
            options.maxHeight =900
        }
        //展示失败信息
        let failResults = batchResult.failResults;
        let failMsgs = [];
        for (let i = 0; i < failResults.length; i++){
            let item = failResults[i];
            if (batchResult.finished != 'undefined') {
                failMsgs.push(`<span>${item}</span>`)
            } else {
                if(item['logisErrorMsg'] && item['logisErrorMsg'].length>100){
                    failMsgs.push(`<span data-text='${item['logisErrorMsg']}' onmouseenter="commonTipsShow(this)" onmouseleave="commonTipsHide(this)">${item['logisErrorMsg'].substr(0,100)}......</span>`);
                } else {
                    failMsgs.push(`<span>${item['logisErrorMsg']}</span>`);
                }
            }
        }
        layer.open({
            title: `提示`,
            content: `<span>${msg}</span>
                      <br/>
                      ${failMsgs.join('<br/>')}
                    `,
            btn: ['确认'],
            icon: options.icon,
            area: options.area,
            success: function(layero, index) {
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        callback();
                        layer.close(index);
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function (index) {
                callback();
                layer.close(index);
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                if (onfocus) {
                    onfocus.select()
                }
            }
        });
        // layer.alert(msg + '<br/>' + failResults.join('<br/>'), options, function (index) {
        //     layer.close(index);
        //     callback();
        // });

    }

    admin.batchResultSuccessAlert = function(msgPrefix,batchResult, callback, show=true) {
      let msg = `${msgPrefix}上传${batchResult.totalNum}条数据,共新增${batchResult.successNum}笔订单,订单号:`;
      let options = {};
      //处理alert图标
      if(batchResult.failNum == 0){
          options.icon = 1;
      }else{
          options.icon = 7;
      }
      if(batchResult.successNum>20){
          options.area = ['900px','100%'];
      }else{
        options.area = ['900px'];
        options.maxHeight =900
      }
      //展示失败信息
      let successResults = batchResult.successResults;
      for (let i = 0; i < successResults.length; i++){
          if(successResults[i] && successResults[i].length>100){
            successResults[i] = `<span data-text='${successResults[i]}' onmouseenter="commonTipsShow(this)" onmouseleave="commonTipsHide(this)">${successResults[i].substr(0,100)}......</span>`;
          }
      }
      layer.open({
        title: `提示`,
        content: `<span>${msg}</span>
                  <div ${ successResults.length == 0 ? 'class="disN"' : '' }>
                    <span class="pora copySpan copySpanOverflow" style=" ${ !show ? 'display:none!important;' : '' }">
                        成功订单号:<a>${successResults.join(',')}</a>
                        <span class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</span>
                    </span>
                  </div>
                `,
        btn: ['确认'],
        icon: options.icon,
        area: options.area,
        success: function(layero, index) {
            this.enterEsc = function(event) {
                if (event.keyCode === 13) {
                    callback();
                    layer.close(index);
                    return false; //阻止系统默认回车事件
                }
            };
            $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
        },
        yes: function (index) {
            callback();
            layer.close(index);
        },
        end: function() {
            $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
            if (onfocus) {
                onfocus.select()
            }
        }
      });

    }

    // 后端返回提示信息successResults[0] 修改称重
    admin.batchResultServeAlert = function(msgPrefix,batchResult, callback) {
        let msg = msgPrefix + batchResult.successResults[0]
        let options = {};
        //处理alert图标
        if(batchResult.failNum == 0){
            options.icon = 1;
        }else{
            options.icon = 7;
        }
        if(batchResult.failNum>20){
            options.area = ['900px','100%'];
        }else{
            options.area = ['900px'];
            options.maxHeight =900
        }
        //展示失败信息
        let trackReg = /(?<=(\[))\w+(?=(\]))/g;
        let failResults = batchResult.failResults;
        let orderIdArr = [];
        for(let i=0; i<failResults.length; i++){
            if(failResults[i] && failResults[i].length>100){
                failResults[i] = `<span data-text='${failResults[i]}' onmouseenter="commonTipsShow(this)" onmouseleave="commonTipsHide(this)">${failResults[i].substr(0,100)}......</span>`;
            }
            //判断无订单号的情况
            let regOrderId = failResults[i].match(trackReg);
            let orderId = regOrderId == null ? 'null' : regOrderId[0];
            orderIdArr.push(orderId);
        }
        layer.open({
            title: `提示`,
            content: `<span>${msg}</span>
                      <div ${ failResults.length == 0 ? 'class="disN"' : '' }>
                        <span class="pora copySpan copySpanOverflow">
                            失败订单号/跟踪号:<a>${orderIdArr.join(',')}</a>
                            <span class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)">复制</span>
                        </span>
                        <br/>
                        <span>具体失败原因如下:</span><br/>
                        ${failResults.join('<br/>')}
                      </div>
                    `,
            btn: ['确认'],
            icon: options.icon,
            area: options.area,
            success: function(layero, index) {
                this.enterEsc = function(event) {
                    if (event.keyCode === 13) {
                        callback(orderIdArr);
                        layer.close(index);
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            yes: function (index) {
                callback(orderIdArr);
                layer.close(index);
            },
            end: function() {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
                if (onfocus) {
                    onfocus.select()
                }
            }
        });
        // layer.alert(msg + '<br/>' + failResults.join('<br/>'), options, function (index) {
        //     layer.close(index);
        //     callback();
        // });

    }







    //退出
    admin.events.logout = function() {
        //执行退出接口
        admin.req({
            url: "/logout",
            type: "get",
            data: {},
            done: function(res) {
                //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行

                //清空本地记录的 token
                layui.data(setter.tableName, {
                    key: setter.request.tokenName,
                    remove: true,
                });

                //跳转到登入页
                //location.hash = "/route/user/login";
            },
        });
    };

    //拦截器
    var interceptor = (function() {
        //你在每次登入页面成功后，会在 localStorage 的本地表中写入一个字段。如： access_token （名称可以在 config.js 自定义）
        //拦截器判断没有 access_token 时，则会跳转到登入页
        //尽管可以通过伪造一个假的 access_token 绕过视图层的拦截，但在请求接口时，会自动带上 access_token，服务端需再次做一层校验

        var local = layui.data(setter.tableName);

        if (!local[setter.request.tokenName]) {
            //这里为了方便线上用户演示，我们就不开启强制跳转了
            // location.hash = '/route/user/login'; //跳转到登入页
        }
    })();

    //对外暴露的接口
    exports("common", {});
});