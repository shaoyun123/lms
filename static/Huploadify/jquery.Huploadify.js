/*
Huploadify
version : 2.1.1
author : 吕大豹
publish date : 2014/01/27
site : http://www.cnblogs.com/lvdabao
*/
/**
 * 压缩图片
 * @param file 需要压缩的图片文件
 * @param quality 压缩率 数值区间0-1；   数值越小。压缩程度越高
 * @param callBack  压缩后执行的回调方法
 * @returns {boolean}
 */
function compressImg(file, quality, callBack){
    // //判断类型是不是图片
    if(!/image\/\w+/.test(file.type)){
        alert("请确保文件为图像类型");
        return false;
    }
    lrz(file, {
        quality: quality,
    }).then(function (rst) {
        let blob = dataUrl2Blob(rst.base64, null)
        blob.name = file.name
        blob.lastModifiedDate = file.lastModifiedDate
        blob.index = file.index
        blob.id = file.id
        blob.type = file.type
        blob.webkitRelativePath = file.webkitRelativePath
        callBack(blob)
    });
}

/**
 * 将dataUrl转为blob
 * @param dataUrl
 * @param type  转化的blob 文件类型
 * @returns {*}
 */
function dataUrl2Blob(dataUrl, type) {
    var data = dataUrl.split(',')[1];
    var mimePattern = /^data:(.*?)(;base64)?,/;
    var mime = dataUrl.match(mimePattern)[1];
    var binStr = atob(data);
    let len = binStr.length
    var arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], {type: type || mime});
}

//将blob转换成file
function blobToFile(theBlob, fileName){
    theBlob.lastModifiedDate =new Date();
    theBlob.name = fileName;
    return theBlob;
}

//将base64转换成file
function dataURLtoBlob(dataurl, name) {//base64转file
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name, {
        type: mime,
    })
}

// 根据图片地址获取图片的宽和高
const calculateImageSize = function(url) {
        return new Promise(function(resolve, reject) {
            const image = document.createElement("img");
            image.addEventListener("load", function(e) {
                resolve({
                    width: e.target.width,
                    height: e.target.height,
                });
            });

            image.addEventListener("error", function() {
                reject();
            });

            // 将图片的url地址添加到图片地址中
            image.src = url;
        });
    }

;(function ($) {
  $.fn.Huploadify = function (opts) {
    // var itemTemp = '<div id="${fileID}" class="uploadify-queue-item"><div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div><span class="up_filename">${fileName}</span><span class="uploadbtn">上传</span><span class="delfilebtn">删除</span></div>';
    var itemTemp = '<div id="${fileID}" class="uploadify-queue-item"><div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div><span class="up_filename">${fileName}</span><span class="uploadbtn">上传</span></div>';
    var defaults = {
        fileTypeExts: '*.*', // 允许上传的文件类型，格式'*.jpg;*.doc'
        uploader: '', // 文件提交的地址
        auto: false, // 是否开启自动上传
        method: 'post', // 发送请求的方式，get或post
        multi: false, // 是否允许选择多个文件
        formData: {}, // 发送给服务端的参数，格式：{key1:value1,key2:value2}
        fileObjName: 'file', // 在后端接受文件的参数名称，如PHP中的$_FILES['file']
        fileSizeLimit: 2048, // 允许上传的文件大小，单位KB
        showUploadedPercent: true, // 是否实时显示上传的百分比，如20%
        showUploadedSize: false, // 是否实时显示已上传的文件大小，如1M/2M
        buttonText: '选择文件', // 上传按钮上的文字
        removeTimeout: 1000, // 上传完成后进度条的消失时间
        itemTemplate: itemTemp, // 上传队列显示的模板
        breakPoints: false, // 是否开启断点续传
        fileSplitSize: 1024 * 1024, // 断点续传的文件块大小，单位Byte，默认1M
        getUploadedSize: null, // 类型：function，自定义获取已上传文件的大小函数，用于开启断点续传模式，可传入一个参数file，即当前上传的文件对象，需返回number类型
        saveUploadedSize: null, // 类型：function，自定义保存已上传文件的大小函数，用于开启断点续传模式，可传入两个参数：file：当前上传的文件对象，value：已上传文件的大小，单位Byte
        saveInfoLocal: false, // 用于开启断点续传模式，是否使用localStorage存储已上传文件大小
        onUploadStart: null, // 上传开始时的动作
        onUploadSuccess: null, // 上传成功的动作
        onUploadComplete: null, // 上传完成的动作
        onUploadError: null, // 上传失败的动作
        onInit: null, // 初始化时的动作
        onCancel: null, // 删除掉某个文件后的回调函数，可传入参数file
        onSelect: null, // 选择文件后执行的动作，可传入参数files，文件列表
        testMethod: null,
        queueSizeLimit: 1, // 最多同时上传多少个文件	(add by dujy 2014.12.17)
        wxUploader: false, // 真正执行上传前先执行此url动作(为了支持客户端可以使用万象图片添加)	(add by nick 2015.08.11)
        wxBucket: '', // 万象图片的bucket名称	(add by nick 2015.08.11)
        showProcessDiv: true, // 是否显示上传处理过程的DIV	(add by nick 2016.03.02)
        quality: 0.8,
        validWidthAndHeight: false
    }
    var fileCount = 0; // 队列中已经有的文件个数	(add by dujy 2014.12.15)
    var option = $.extend(defaults, opts)
    var uploadingNum = 0; // 正在上传中的文件有几个    (add by dujy 2014.12.16)
    var uploadingFileArr = []; // 正在上传中的文件数组	(add by dujy 2014.12.17)

    // 将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
    var formatFileSize = function (size, byKB) {
      if (size > 1024 * 1024 && !byKB) {
        size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB'
      }else {
        size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB'
      }
      return size
    }
    // 根据文件序号获取文件
    var getFile = function (index, files) {
      for (var i = 0;i < files.length;i++) {
        if (files[i].index == index) {
          return files[i]
        }
      }
      return false
    }

    // 将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
    var getFileTypes = function (str) {
      var result = []
      var arr1 = str.split(';')
      for (var i = 0,len = arr1.length;i < len;i++) {
        result.push(arr1[i].split('.').pop())
      }
      return result
    }

    var mimetypeMap = {
      zip: ['application/x-zip-compressed'],
      jpg: ['image/jpeg'],
      png: ['image/png'],
      gif: ['image/gif'],
      doc: ['application/msword'],
      xls: ['application/vnd.ms-excel'],
      docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      ppt: ['application/vnd.ms-powerpoint '],
      pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      mp3: ['audio/mp3'],
      mp4: ['video/mp4'],
      pdf: ['application/pdf']
    }

    // 根据后缀名获得文件的mime类型
    var getMimetype = function (name) {
      return mimetypeMap[name]
    }

    // 根据配置的字符串，获得上传组件accept的值
    var getAcceptString = function (str) {
      var types = getFileTypes(str)
      var result = []
      for (var i = 0,len = types.length;i < len;i++) {
        var mime = getMimetype(types[i])
        if (mime) {
          result.push(mime)
        }
      }
      return result.join(',')
    }

    // 发送文件块函数
    var sendBlob = function (url, xhr, file, formdata) {
      var b = true
      if (option.wxUploader && option.wxBucket) {
        $.ajax({
          type: 'POST',
          url: url,
          data: {
            'bucket': option.wxBucket,
            'fileName': file.name
          },
          dataType: 'json',
          async: false,
          success: function (data) {
            if (data != null) {
              if (data.code == 0) {
                var sign = data.sign
                url = data.url + '?sign=' + encodeURIComponent(sign)
                if (formdata) {
                  // url += "&MagicContext=" + encodeURIComponent(JSON.stringify(formdata))
                  var dataStr = JSON.stringify(formdata)
                  formdata = {
                    MagicContext: dataStr
                  }
                }
              }else {
                // $('#loading').modal('hide')
                // $.fn.message({type:"error", msg:data.msg, existTime:1000*60})
                b = false
                option.onUploadSuccess('', '{"code":-1, "message":"' + data.msg + '"}')
              }
            }
          }
        })
      }

      if (b) {
        xhr.open(option.method, url, true)
        // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        var fd = new FormData()
        fd.append(option.fileObjName, file,file.name)
          console.log(fd)
        if (formdata) {
          for (key in formdata) {
            fd.append(key, formdata[key])
          }
        }
        xhr.send(fd)
      }
    }

    var fileObj = null

    this.each(function () {
      var _this = $(this)
      _this.empty()
      // 先添加上file按钮和上传列表
      var instanceNumber = $('.uploadify').length + 1
      var inputStr = '<input id="select_btn_' + instanceNumber + '" class="selectbtn" style="display:none;" type="file" name="fileselect[]"'
      inputStr += option.multi ? ' multiple' : ''
      inputStr += ' accept="'
      inputStr += getAcceptString(option.fileTypeExts)
      inputStr += '"/>'
      inputStr += '<a id="file_upload_' + instanceNumber + '-button" href="javascript:void(0)" class="uploadify-button' + ' ' + option.buttonClass + '">'
      inputStr += option.buttonText
      inputStr += '</a>'

      var uploadFileListStr = option.showProcessDiv ? '<div id="file_upload_' + instanceNumber + '-queue" class="uploadify-queue"></div>' : ''
      _this.append(inputStr + uploadFileListStr)

      // 创建文件对象
      fileObj = {
        uploadAllowed: true,
        fileInput: _this.find('.selectbtn'), // html file控件
        uploadFileList: _this.find('.uploadify-queue'),
        container: _this, // 上传控件的外层div引用
        // url: option.uploader,						//ajax地址 注掉为了方便实例后动态改变上传地址 （edit by fuyi 2016.8.17）
        fileFilter: [], // 过滤后的文件数组
        uploadOver: false, // 一次上传是否真正结束，用于断点续传的情况
        filter: function (files) { // 选择文件组的过滤方法
          var arr = []
          var typeArray = getFileTypes(option.fileTypeExts)
          if (typeArray.length > 0) {
            for (var i = 0,len = files.length;i < len;i++) {
              var thisFile = files[i]
              if (parseInt(formatFileSize(thisFile.size, true)) > option.fileSizeLimit) {
                alert('文件' + thisFile.name + '大小超出限制！文件最大不能超过' + option.fileSizeLimit + 'KB！')
                continue
              }
              if ($.inArray(thisFile.name.split('.').pop().toLowerCase(), typeArray) >= 0 || $.inArray('*', typeArray) >= 0) {
                arr.push(thisFile)
              }else {
                alert('文件' + thisFile.name + '类型不允许！')
              }
            }
          }
          return arr
        },
        validSize: function (file,reback) {
            // let correctWidth = option.validWidthAndHeight.width
            // let correctHeight = option.validWidthAndHeight.height
            let maxWidthAndHeight = option.validWidthAndHeight.maxWidthAndHeight
            let minWidthAndHeight = option.validWidthAndHeight.minWidthAndHeight
            const imageReader = new FileReader();
            // 将图片的内存url地址添加到FileReader中
            imageReader.readAsDataURL(file);
            // 当图片完全加载到FileReader对象中后,触发下面的事件
            imageReader.addEventListener("loadend", function(e) {
                // 获取上传到本机内存中的图片的url地址
                const imageSrc = e.target.result;
                // 调用计算图片大小的方法
                calculateImageSize(imageSrc).then(function({width, height}) {
                    if (width < minWidthAndHeight || width > maxWidthAndHeight || height < minWidthAndHeight || height > maxWidthAndHeight) {
                      layui.layer.msg(file.name + '尺寸不在500-2000之间,不允许上传')
                        _this.find('#fileupload_' + instanceNumber + '_' + file.index).fadeOut()
                        return false
                    }else if(width >= minWidthAndHeight || width <= maxWidthAndHeight || height >= minWidthAndHeight || height <= maxWidthAndHeight){
                        // 调整1000*1000
                        getBase64And1000(imageSrc)
                            .then(function(base64){
                                let blob = dataUrl2Blob(base64, null)
                                blob.name = file.name
                                blob.lastModifiedDate = file.lastModifiedDate
                                blob.index = file.index
                                blob.id = file.id
                                blob.type = file.type
                                blob.webkitRelativePath = file.webkitRelativePath
                                reback(blob)
                            },function(err){
                                console.log(err);//打印异常信息
                            });
                    }
                    // reback()
                });
            })
        },
        // 压缩后再上传
        compressAndUpload: function (file) {
          let self = this
            // 是否需要校验图片大小
            if (option.validWidthAndHeight) {
              let reback = function (newFile) {
                  compressImg(newFile, option.quality, self.funUploadFile)
              }
              this.validSize(file,reback)
            } else {
                console.log('压缩后再上传 quality=' + option.quality)
                compressImg(file, option.quality, self.funUploadFile)
            }
        },
        // 文件选择后
        funSelect: function (files) {
          for (var i = 0,len = files.length;i < len;i++) {
            var file = files[i]
            // 处理模板中使用的变量
            var $html = $(option.itemTemplate.replace(/\${fileID}/g, 'fileupload_' + instanceNumber + '_' + file.index).replace(/\${fileName}/g, file.name).replace(/\${fileSize}/g, formatFileSize(file.size)).replace(/\${instanceID}/g, _this.attr('id')))
            // 如果是自动上传，去掉上传按钮
            if (option.auto) {
              $html.find('.uploadbtn').remove()
            }

            // alert("atatat:" + option.testMethod())

            var r = option.onSelect && option.onSelect(files)
            if (!r) {
              return
            }

            // 如果开启断点续传，先初始化原来上传的文件大小
            var initWidth = 0,initFileSize = '0KB',initUppercent = '0%'
            if (option.breakPoints) {
              var uploadedSize = this.funGetUploadedSize(file)
              // 先设置进度条为原来已上传的文件大小
              initWidth = (uploadedSize / file.size * 100) + '%'
              initFileSize = formatFileSize(uploadedSize)
              initUppercent = (uploadedSize / file.size * 100).toFixed(2) + '%'

              $html.find('.uploadify-progress-bar').css('width', initWidth)
            }

            this.uploadFileList.append($html)

            // 判断是否显示已上传文件大小
            if (option.showUploadedSize) {
              var num = '<span class="progressnum"><span class="uploadedsize">' + initFileSize + '</span>/<span class="totalsize">${fileSize}</span></span>'.replace(/\${fileSize}/g, formatFileSize(file.size))
              $html.find('.uploadify-progress').after(num)
            }

            // 判断是否显示上传百分比	
            if (option.showUploadedPercent) {
              var percentText = '<span class="up_percent">' + initUppercent + '</span>'
              $html.find('.uploadify-progress').after(percentText)
            }

            // option.onSelect&&option.onSelect(files)

            // 判断是否是自动上传
            if (option.auto) {
                // 如果需要压缩
                if (option.quality !== 1) {
                    this.compressAndUpload(file)
                } else {
                    this.funUploadFile(file)
                }
            }else {
              // 如果配置非自动上传，绑定上传事件
              $html.find('.uploadbtn').on('click', (function (file) {
                return function () {
                    if (option.quality !== 1) {
                        fileObj.compressAndUpload(file)
                    } else {
                        fileObj.funUploadFile(file)
                    }}
              })(file))
            }
            // 为删除文件按钮绑定删除文件事件
            $html.find('.delfilebtn').on('click', (function (file) {
              return function () {fileObj.funDeleteFile(file.index);}
            })(file))
          }
        },
        onProgress: function (file, loaded, total) {
          var eleProgress = $('#fileupload_' + instanceNumber + '_' + file.index + ' .uploadify-progress')
          var thisLoaded = loaded
          // 根据上一次触发progress时上传的大小，得到本次的增量
          var lastLoaded = eleProgress.attr('lastLoaded') || 0
          loaded -= parseInt(lastLoaded)

          var progressBar = eleProgress.children('.uploadify-progress-bar')
          var oldWidth = option.breakPoints ? parseFloat(progressBar.get(0).style.width || 0) : 0
          var percent = (loaded / total * 100 + oldWidth).toFixed(2)

          // 由于显示的百分比是load的大小，并不是整个上传处理时的进度，所以先在此做个随机，使效果更逼真一些。(add bu dujy 2014.12.14)
          if (oldWidth == 0 && percent > 90) {
            percent = 30 + Math.random() * 60
          }

          var percentText = percent > 100 ? '99.99%' : percent + '%'; // 校正四舍五入的计算误差
          if (option.showUploadedSize) {
            eleProgress.nextAll('.progressnum .uploadedsize').text(formatFileSize(loaded))
            eleProgress.nextAll('.progressnum .totalsize').text(formatFileSize(total))
          }
          if (option.showUploadedPercent) {
            eleProgress.nextAll('.up_percent').text(percentText)
          }
          progressBar.css('width', percentText)

          // 记录本次触发progress时已上传的大小，用来计算下次需增加的数量
          if (thisLoaded < option.fileSplitSize) {
            eleProgress.attr('lastLoaded', thisLoaded)
          }else {
            eleProgress.removeAttr('lastLoaded')
          }
        }, // 文件上传进度

        /* 开发参数和内置方法分界线 */

        // 获取当前进度条的宽度，返回字符串如90%
        funGetProgressWidth: function (index) {
          var eleProgressBar = _this.find('#fileupload_' + instanceNumber + '_' + index + ' .uploadify-progress-bar')
          return eleProgressBar.get(0).style.width || ''
        },

        // 获取已上传的文件片大小，当开启断点续传模式
        funGetUploadedSize: function (file) {
          if (option.getUploadedSize) {
            return option.getUploadedSize(file)
          }else {
            if (option.saveInfoLocal) {
              return parseInt(localStorage.getItem(file.name)) || 0
            }
          }
        },

        funSaveUploadedSize: function (file, value) {
          if (option.saveUploadedSize) {
            option.saveUploadedSize(file, value)
          }else {
            if (option.saveInfoLocal) {
              localStorage.setItem(file.name, value)
            }
          }
        },

        // 获取选择文件，file控件
        funGetFiles: function (e) {
          // 获取文件列表对象
          var files = e.target.files
          // 继续添加文件
          files = this.filter(files)
          for (var i = 0,len = files.length;i < len;i++) {
            this.fileFilter.push(files[i])
          }
          this.funDealFiles(files)
          return this
        },

        // 选中文件的处理与回调
        funDealFiles: function (files) {
          // var fileCount = $.find('.uploadify-queue .uploadify-queue-item').length;//队列中已经有的文件个数
          for (var i = 0,len = files.length;i < len;i++) {
            files[i].index = ++fileCount
            files[i].id = 'fileupload_' + instanceNumber + '_' + files[i].index
          }
          // 执行选择回调
          this.funSelect(files)

          return this
        },

        // 删除对应的文件
        funDeleteFile: function (index) {
          for (var i = 0,len = this.fileFilter.length; i < len; i++) {
            var file = this.fileFilter[i]
            if (file.index == index) {
              if (option.breakPoints) {
                this.uploadAllowed = false
              }
              this.fileFilter.splice(i, 1)
              _this.find('#fileupload_' + instanceNumber + '_' + index).fadeOut()
              fileObj.fileInput.val('')
              option.onCancel && option.onCancel(file)
              break
            }
          }
          return this
        },

        // 文件上传
        funUploadFile: function (file) {
            console.log(file)
          var xhr = false
          var originalFile = file; // 保存原始为切割的文件
          var thisfile = $('#fileupload_' + instanceNumber + '_' + file.index)
          var regulateView = function () {
            if (fileObj.uploadOver) {
              thisfile.find('.uploadify-progress-bar').css('width', '100%')
              option.showUploadedSize && thisfile.find('.uploadedsize').text(thisfile.find('.totalsize').text())
              option.showUploadedPercent && thisfile.find('.up_percent').text('100%')
            }
          }; // 校正进度条和上传比例的误差

          try {
            xhr = new XMLHttpRequest(); // 尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
          } catch(e) {
            xhr = ActiveXobject('Msxml12.XMLHTTP'); // 使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
          }

          if (option.breakPoints) {
            var fileName = file.name,fileId = file.id,fileIndex = file.index, fileSize = file.size; // 先保存原来的文件名称
            var uploadedSize = parseInt(this.funGetUploadedSize(originalFile))
            // 对文件进行切割，并保留原来的信息			  	
            file = originalFile.slice(uploadedSize, uploadedSize + option.fileSplitSize)
            file.name = fileName;file.id = fileId;file.index = fileIndex
          }
          if (xhr.upload && uploadedSize !== false) {
            // 上传中
            /*xhr.upload.addEventListener("progress", function(e) {
						  fileObj.onProgress(file, e.loaded, originalFile.size)
            }, false);*/

            // 文件上传成功或是失败
            xhr.onreadystatechange = function (e) {
              // 由于跨域的问题，上面的动态监控上传文件大小不能用，在这里根据readyState状态不同随机大小模拟一下上传的进度
              if (xhr.readyState == 1) {
                var r = 10 + Math.random() * 10
                var loaded = originalFile.size * r / 100
                fileObj.onProgress(file, loaded, originalFile.size)
              }else if (xhr.readyState == 2) {
                var r = 30 + Math.random() * 20
                var loaded = originalFile.size * r / 100
                fileObj.onProgress(file, loaded, originalFile.size)
              }else if (xhr.readyState == 3) {
                var r = 60 + Math.random() * 30
                var loaded = originalFile.size * r / 100
                fileObj.onProgress(file, loaded, originalFile.size)
              }else if (xhr.readyState == 4) {
                fileObj.uploadOver = true
                if (xhr.status == 200) {
                  var returnData = xhr.responseText ? (typeof xhr.responseText === 'string' ? JSON.parse(xhr.responseText):xhr.responseText) : {}
                  // 将文件块数据更新到本地记录
                  if (option.breakPoints) {
                    // 更新已上传文件大小，保存到本地
                    uploadedSize += option.fileSplitSize
                    fileObj.funSaveUploadedSize(originalFile, uploadedSize)
                    // 继续上传其他片段
                    if (uploadedSize < fileSize) {
                      fileObj.uploadOver = false
                      if (fileObj.uploadAllowed) {
                        file = originalFile.slice(uploadedSize, uploadedSize + option.fileSplitSize)
                        file.name = fileName;file.id = fileId;file.index = fileIndex;file.size = fileSize
                        // sendBlob(url,xhr,file,option.formData); 改为动态取上传url (edit by fuyi 2016.8.17)
                        sendBlob(option.uploader, xhr, file, option.formData)
                      }
                    }else {
                      regulateView()
                    }
                  }else {
                    regulateView()
                  }

                  if (fileObj.uploadOver) {
                    option.onUploadSuccess && option.onUploadSuccess(originalFile, xhr.responseText)
                    // 在指定的间隔时间后删掉进度条
                    setTimeout(function () {
                      _this.find('#fileupload_' + instanceNumber + '_' + originalFile.index).fadeOut()
                    }, option.removeTimeout)
                  }
                } else {
                  fileObj.uploadOver && option.onUploadError && option.onUploadError(originalFile, xhr.responseText)
                }

                if (fileObj.uploadOver) {
                  option.onUploadComplete && option.onUploadComplete(originalFile, xhr.responseText)
                  // 清除文件选择框中的已有值
                  fileObj.fileInput.val('')
                }

                fileObj.refreshUploadFile(); // 上传完成一个，再来下一个 		add bu dujy 2014.12.16
              }
            }
            option.onUploadStart && option.onUploadStart(file)
            // 开始上传
            option.formData.fileName = originalFile.name
            option.formData.type = option.type
            option.formData.lastModifiedDate = originalFile.lastModifiedDate.getTime()
            fileObj.uploadAllowed = true; // 重置允许上传为true
            // sendBlob(this.url,xhr,file,option.formData); 改为动态取上传url (edit by fuyi 2016.8.17)
            sendBlob(option.uploader, xhr, file, option.formData)
          }
        },
        // 刷新上传（如果限制了一次最多上传几个时，此方法有用）  add bu dujy 2014.12.16
        refreshUploadFile: function () {
          // 如果全部上传完成，则清空计数变量
          if (uploadingFileArr.length == uploadingNum) {
            uploadingFileArr = []
            uploadingNum = 0
            return
          }

          // 开始上传指定的数量
          fileObj.funUploadFile(uploadingFileArr[uploadingNum])
          uploadingNum++
        },
        init: function () {
          // 文件选择控件选择
          if (this.fileInput.length > 0) {
            this.fileInput.change(function (e) {
              fileObj.funGetFiles(e)
            })
          }

          // 点击上传按钮时触发file的click事件
          _this.find('.uploadify-button').on('click', function () {
            _this.find('.selectbtn').trigger('click')
          })

          option.onInit && option.onInit()
        }
      }
      // 初始化文件对象
      fileObj.init()
    })

    var returnObj = {
      stop: function () {
        fileObj.uploadOver = false
        fileObj.uploadAllowed = false
      },
      upload: function (fileIndex) {
        if (fileIndex === '*') {
          for (var i = 0,len = fileObj.fileFilter.length;i < len;i++) {
            // fileObj.funUploadFile(fileObj.fileFilter[i])
            // console.log(i + ":" + fileObj.fileFilter[i])
            uploadingFileArr.push(fileObj.fileFilter[i]); // 放到要上传的队列中
          }

          // 开始上传指定的数量
          for (var j = 0; j < option.queueSizeLimit && j < uploadingFileArr.length; j++) {
            fileObj.funUploadFile(uploadingFileArr[j])
            uploadingNum++
          }
        }else {
          var file = getFile(fileIndex, fileObj.fileFilter)
          file && fileObj.funUploadFile(file)
        }
      },
      uploadLast: function () {
        var len = fileObj.fileFilter.length
        var file = getFile(len, fileObj.fileFilter)
        file && fileObj.funUploadFile(file)
      },
      cancel: function (fileIndex) {
        if (fileIndex === '*') {
          fileCount = 0
          for (var i = 0,len = fileObj.fileFilter.length;i < len;i++) {
            fileObj.funDeleteFile(++i)
          }
        }else {
          fileObj.funDeleteFile(fileIndex)
        }
      },
      disable: function (instanceID) {
        var parent = instanceID ? $('file_upload_' + instanceID + '-button') : $('body')
        parent.find('.uploadify-button').css('background-color', '#888').off('click')
      },
      ennable: function (instanceID) {
        // 点击上传按钮时触发file的click事件
        var parent = instanceID ? $('file_upload_' + instanceID + '-button') : $('body')
        parent.find('.uploadify-button').css('background-color', '#707070').on('click', function () {
          parent.find('.selectbtn').trigger('click')
        })
      },
      destroy: function () {
        fileObj.container.html('')
      },
      settings: function (name, value) {
        if (arguments.length == 1) {
          return option[name]
        }else {
          if (name == 'formData') {
            option.formData = $.extend(option.formData, value)
          }else {
            option[name] = value
          }
        }
      },
      Huploadify: function () {
        var method = arguments[0]
        if (method in this) {
          Array.prototype.splice.call(arguments, 0, 1)
          this[method].apply(this[method], arguments)
        }
      }
    }

    return returnObj
  }
})(jQuery)
