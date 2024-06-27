var rankingCateTreeData;
var chooseCateId;
layui.use(['element','form', 'table', 'laydate', 'laypage', 'upload', 'formSelects', 'tree','laytpl'], function() {
  var $ = layui.$,
      admin = layui.admin,
      upload = layui.upload,
      element = layui.element,
      laydate = layui.laydate,
      table = layui.table,
      laypage = layui.laypage,
      formSelects = layui.formSelects,
      tree = layui.tree,
      form = layui.form,
      laytpl = layui.laytpl;


    form.render(null, '1688list_form');
    form.render('checkbox')
    form.render('select')

    var rankCnName = "越南热销榜"
    // 切换tab
    element.on('tab(1688list_Tab)', function(data) {
        rankCnName = $(this).attr('data-code');
        getListByCateId(rankCnName)
    });

    // 勾选当前在榜单
    form.on('checkbox(1688list_isOntheRankingFilter)', function(data) {
        getListByCateId(rankCnName)
    });
    
    // 排序
    form.on('select(1688list_sortTypeFilter)', function(data) {
        getListByCateId(rankCnName)
    });

    
    rankCateZtree()
    // 获取类目树并且渲染
    function rankCateZtree () {
        return new Promise(function (resolve) {
            commonReturnPromise({
                url: ctx + "/prod1688Ranking/queryAll"
            }).then(data => {
                var setting = {
                    check: {
                        enable: false,
                        chkDisabledInherit: true,
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                        },
                    },
                    callback: {
                        onClick: function(event, treeId, treeNode) {
                            rankingPage.page = 1;
                            chooseCateId = treeNode.id;
                            getListByCateId(rankCnName);
                        }
                    }
                }
                // 添加全部类目项
                data.unshift({
                    id: null,
                    pid: null,
                    name: '全部'
                })
                setting.check.chkboxType = { Y: "s", N: "s" };
                if (rankingCateTreeData == undefined) {
                    rankingCateTreeData = data;
                    var t = $("#rankingCateTree");
                    t = $.fn.zTree.init(t, setting, rankingCateTreeData);
                    rankingCateTree = $.fn.zTree.getZTreeObj("rankingCateTree");
                } else {
                    rankingCateTree.destroy();
                    var t = $("#rankingCateTree");
                    t = $.fn.zTree.init(t, setting, rankingCateTreeData);
                    rankingCateTree = $.fn.zTree.getZTreeObj("rankingCateTree");
                }
                resolve('tree');
            }).catch(err => layui.layer.msg(err || err.msg, { icon: 2 }))
        })
    }

    var rankingPage = {
        page: 1,
        limit: 25,
        count: 0
    }
    laytpl($('#cateRankingDataLayer').html()).render([], function(html) {
        $('#cateRankingContent').html(html)
    })

    // 根据类目查询数据
    function getListByCateId(rankCnName="越南热销榜") {
        let isOntheRanking = $('#1688list_form').find('[name=isOntheRanking]').is(':checked')
        let orderType = $('#1688list_form').find('[name=sortType]').val()
        cancelRequests()
        loading.show();
        $.ajax({
            type: "post",
            url: ctx + '/prod1688Ranking/queryLocalRanking',
            data: JSON.stringify({
                categoryId: chooseCateId,
                rankCnName,
                orderType, 
                ifOnRanking: isOntheRanking, 
                page: rankingPage.page,  
                limit: rankingPage.limit
            }),
            contentType:'application/json',
            success: function(res) {
                loading.hide();
                laypage.render({
                    elem: 'paginationRanking',
                    count: res.count,
                    curr: rankingPage.page,
                    limit: rankingPage.limit,
                    theme: '#1E9FFF',
                    layout: ['count', 'prev', 'page', 'next', 'refresh', 'skip'],
                    jump: function(obj, first) {
                        rankingPage.page = obj.curr;
                        rankingPage.limit = obj.limit;
                        //首次不执行
                        if (!first) {
                            getListByCateId()
                        }
                    }
                }); 
                laytpl($('#cateRankingDataLayer').html()).render(res.data, function(html) {
                    $('#cateRankingContent').html(html)
                })


                $('#cateRankingContent').find('.rankingDiv')?.each((index, item) => {
                    let appendTargetDom = $(item).find('.searchImgStatus')
                    $(appendTargetDom).append(`<span class="rankSearchImage bg-yellow-rank">以图搜图中...</span>`)
                    // 鼠标click到 疑似开发 显示以图搜图结果弹窗
                    $(appendTargetDom).find('.rankSearchImage').on('click', function(e) {
                      e.stopPropagation();
                      e.preventDefault();
                      handleShowImgsDialog(e)
                    })
                    let imagePath = $(item).find('img').prop('src') || ''
                    convertImageUrlToBase64(imagePath, function(base64) {
                      if (!imagePath) return
                      queryLikeImages(base64, $(item))
                    })
                })
            }, 
            error: function(data) {
            }
            
        });
    }

    let requestPool = []
    function queryLikeImages(base64, imageWrapDom) {
        return new Promise((resolve, reject) => {
            var xhr = $.ajax({
                type: "post",
                url: ctx + '/prodImageAliyun/queryImageByBase64',
                data: JSON.stringify({
                    base64: base64?.split(',')[1]
                }),
                contentType:'application/json',
                success: function(res) {
                  if (res.code == "0000") {
                    res.data = res.data?.filter(item => item.score >= 0.7)
                    let statusDom = $(imageWrapDom).find('.rankSearchImage')
                    if ( res.data?.length > 0) {
                        $(imageWrapDom).attr('imageData', JSON.stringify(res.data))
                        $(statusDom).text('疑似开发')
                        $(statusDom).removeClass('bg-yellow-rank')
                        $(statusDom).removeClass('bg-red-rank')
                        $(statusDom).addClass('bg-green-rank')
                    } else {
                        $(statusDom).text('未开发')
                        $(statusDom).removeClass('bg-yellow-rank')
                        $(statusDom).removeClass('bg-green-rank')
                        $(statusDom).addClass('bg-red-rank')
                    }
                  }
                }
            })
            requestPool.push(xhr)
        })
    }
    
    function cancelRequests() {
        // 中断所有未完成的请求
        for (var i = 0; i < requestPool.length; i++) {
            requestPool[i].abort();
        }
        // 清空请求对象数组
        requestPool = [];
    }

    // 将图片 URL 转换为 Base64
    function convertImageUrlToBase64(imageUrl, callback) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var dataURL
            if(imageUrl.includes(".png")){
                dataURL = canvas.toDataURL('image/png'); // 可根据需要更改图片格式
            }else{
                dataURL = canvas.toDataURL('image/jpeg'); // 可根据需要更改图片格式
            }
            callback(dataURL);
        };
        img.src = imageUrl;
    }

    //查找货源
    $('#cateRankingContent').on('click', '.searchSupply', function(){
        let picUrl = $(this).attr('data-image');
        if(!picUrl){
            return layer.msg('无图片不可查找货源', {icon: 7});
        }
        window.open('https://www.1688.com?pordUrl=' + picUrl)
    });

    // 疑似开发
    // 展示以图搜图弹窗
    let searchImageList = []
    function handleShowImgsDialog(e) {
        if ($(e.target).text() === '疑似开发') {
            let itemData = $(e.target).parents('.rankingDiv').attr('imageData')
            let layerIndex = layer.open({
                type: 1,
                title: "以图搜图",
                btn: ["关闭"],
                area: ["1300px", "700px"],
                id: Date.now(),
                content: $('#searchImagesLayer').html(),
                success: function () {
                itemData = JSON.parse(itemData) || {}
                searchImageList = itemData
                searchImageList.forEach(item => {
                    if (item.isSale == '0') {
                        item.saleStatus = 0
                    }
                    if (item.isSale && item.isSale !== '0') {
                        item.saleStatus = 1
                    }
                })
                let divElement = $('#image-container')
                let startIndex = 0; // 当前展示数据的起始索引
                let endIndex = 9; // 当前展示数据的结束索引
        
                getTortType()
                laytpl($('#imageItemLayer').html()).render(itemData.slice(startIndex, endIndex), function(html){
                    $('#image-container').html(html)
                    if (itemData.length < 9) {
                        $('#image-container').append('<div style="width: 32%"></div>')
                    }
                })
        
                divElement[0].addEventListener('scroll', function() {
                    // 检查滚动条是否到达底部
                    if (divElement[0].scrollTop + divElement[0].clientHeight >= divElement[0].scrollHeight) {
                        // 滚动条到达底部的逻辑
                        // 更新索引
                        startIndex += 9;
                        endIndex += 9;
                        laytpl($('#imageItemLayer').html()).render(itemData.slice(startIndex, endIndex), function(html){
                            $('#image-container').append(html)
                        })
                        // 判断是否已展示完全部数据
                        if (endIndex >= itemData.length) {
                            // 数据已全部展示完毕，移除滚动事件监听器
                            console.log('展示完毕')
                            divElement[0].removeEventListener('scroll', arguments.callee);
                            $('#image-container').append('<div style="width: 32%"></div>')
                        }
                    }
                })
        
                $('#copyBtn')[0].addEventListener('click', function() {
                    let skuList = []
                    searchImageList?.forEach(item => {
                        if (item.original == 1 || item.original == 3) {
                            item.psku && skuList.push(item.psku)
                        }
                        if (item.original == 2 || item.original == 4) {
                            item.ssku && skuList.push(item.ssku)
                        }
                    })
                    // sku 去重
                    skuList = Array.from(new Set(skuList))
                    $('#hideCopy').attr('value', skuList.join(',')).show()
                    $('#hideCopy').select()
                    document.execCommand('copy')
                    $('#hideCopy').hide()
                    layer.msg('复制成功')
                })
                },
                yes: function () {
                    layer.close(layerIndex)
                }
        
            })
        }
    }

    // 商品列表详情
    $('body').on('click', '#prodListDetail', function(event) {
        let id = $(this).attr('data-id')
        let pSku = $(this).attr('data-ssku')
        let isCombination = $(this).attr('data-combination')
        if (isCombination == 'false') {
        openProdListDetail({id, pSku});
        } else {
        openProdComDetail({id});
        }
    })

    // 获取侵权原因
    let tortTypeList = []
    function getTortType() {
        $.ajax({
            type: "post",
            url: ctx + '/tort/prodTortTypeList.html',
            contentType:'application/json',
            success: function(res) {
                if (res.code == "0000") {
                    tortTypeList = res.data || []
                }
            }
        })
    }

});


function openDetail(prodPId,original,pSku) {
    if (original == 1) {
      // 新品开发点击商品名称打开开发详情
      newdevdetail_openDevDetail(prodPId,pSku, true)
    }
  }