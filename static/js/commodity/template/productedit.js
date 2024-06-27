$('#filePicker').Huploadify({
    auto: true,
    fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
    multi: true,
    fileSizeLimit: 2048,	//默认单位是KB
    buttonText: '本地图片',
    breakPoints: false,
    saveInfoLocal: false,
    showUploadedPercent: true,
    showUploadedSize: true,
    removeTimeout: 500,
    uploader: ctx + "/prodTpl/uploadPic.html",
    onSelect: function (files) {

       return true
    },
    onUploadStart: function (file) {
    },
    onUploadSuccess: function (file, data, response) {
    }
});