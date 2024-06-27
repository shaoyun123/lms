;(function($,window,document,undefined){
  //定义SearchGroup的构造函数
  var SearchGroup = function(ele, input) {
    this.$element = ele;
    this.$name = input;
  }
  //定义SearchGroup的方法
  SearchGroup.prototype = {
    init: function(){
      this.createSpan();
      this.createInput();
      this.createTextarea();
      this.$element.css({
        display: 'flex',
        position: 'absolute',
        zIndex: 20200101
      });
    },
    createSpan: function() {
        var _this = this;
        var $div = $('<div>');
        var $spanTop = $(`<span class="layui-hide" data-img="down"><img src="${ctx}/static/img/top.jpg"></span>`);
        var $spanDown = $(`<span class="layui-show" data-img="top"><img src="${ctx}/static/img/down.jpg"></span>`);
        var cssObj = {
          cursor: 'pointer',
          border: '1px solid #e8e8e8',
          borderRight: 'none',
          width: '30px',
          height: '32px',
          lineHeight: '32px',
          boxSizing: 'border-box'
        };
        function showOrHide(){
            var imgVal = $(this).data('img');
            var $input = _this.$element.find('input');
            var $textarea =_this.$element.find('textarea');
            if(imgVal == 'top'){
              $input.removeClass('layui-show').addClass('layui-hide');
              $textarea.removeClass('layui-hide').addClass('layui-show');
              var $inputVal = $input.val();
              var $inputValArr = [];
              if($inputVal.length){
                $inputValArr = $inputVal.split(',').filter(function(s){
                  return  s && s.trim();
                });
              }else{
                $inputValArr = [];
              }
              $textarea.val($inputValArr.join('\n'));
            }else if(imgVal == 'down'){
              $input.removeClass('layui-hide').addClass('layui-show');
              $textarea.removeClass('layui-show').addClass('layui-hide');
              var $textareaVal = $textarea.val();
              var $textareaArr = [];
              if($textareaVal.length){
                $textareaArr = $textareaVal.split('\n').filter(function(s){
                  return  s && s.trim();
                });
              }else{
                $textareaArr = [];
              }
              $input.val('');
              $input.val($textareaArr.join(','));
            }
            if($(this).hasClass('layui-show')){
              $(this).removeClass('layui-show').addClass('layui-hide');
              $(this).siblings().removeClass('layui-hide').addClass('layui-show');
            }else{
              $(this).removeClass('layui-hide').addClass('layui-show');
              $(this).siblings().addClass('layui-hide').removeClass('layui-show');
            }
        }
        $spanTop.on('click', showOrHide);
        $spanDown.on('click',showOrHide);
        $div.css(cssObj);
        $div.append($spanTop);
        $div.append($spanDown);
        this.$element.append($div);
    },
    createInput: function(){
      var name = this.$name;
      var $input = $(`<input type="text" class="layui-show layui-input" name="${name}" placeholder="多个sku间用逗号隔开">`);
      $input.css({
        borderLeft: 'none'
      });
      this.$element.append($input);
    },
    createTextarea: function(){
      var $textarea = $(`<textarea class="layui-hide layui-textarea"></textarea>`);
      this.$element.append($textarea);
    }
  }
  //在插件中使用SearchGroup对象
  $.fn.searchGroup = function(options) {
    var defaultOpts = {
      input: ''
    };
    var opts = $.extend({}, defaultOpts, options);
    //创建SearchGroup的实体
    var searchGroup = new SearchGroup(this, opts.input);
    //调用其方法
    return searchGroup.init();
  }
})(jQuery,window,document);