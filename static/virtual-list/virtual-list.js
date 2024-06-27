// 混入方法
function _mixin(target) {
    if (!target) {
        throw new Error("未传入需要mixin的目标对象。");
    }
    Array.prototype.shift.call(arguments);
    Array.prototype.forEach.call(arguments, (obj) => {
        Object.keys(obj).forEach((key) => {
            target[key] = obj[key];
        });
    });
    return target;
}
// 节流方法
function _throttle(callback, delay) {
    var timeId = null;
    return function() {
        var _this = this;
        var args = arguments;
        if (timeId) clearTimeout(timeId);
        timeId = setTimeout(function() {
            callback.apply(_this, args);
        }, delay);
    };
}
// 按帧节流
function _throttleByFrame(callback) {
    var timeId = null;
    return function() {
        var _this = this;
        var args = arguments;
        if (timeId) {
            window.cancelAnimationFrame(timeId);
        }
        timeId = requestAnimationFrame(function() {
            callback.apply(_this, args);
        });
    };
}
// 二分搜索
function _binarySearch(list, value) {
    var left = 0;
    var right = list.length - 1;
    var tempIndex = null;
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        var midValue = list[mid].bottom;
        if (midValue === value) {
            return mid + 1;
        } else if (midValue > value) {
            if (tempIndex === null || tempIndex > mid) {
                tempIndex = mid;
            }
            right--;
        } else if (midValue < value) {
            left = mid + 1;
        }
    }
    return tempIndex;
}
// 抛出错误的函数
function _throwErr(str) {
    throw new Error(str + " , 请重新检查输入");
}
// 严格类型检查
function _checkType(typeStr, data) {
    return Object.prototype.toString.call(data) === typeStr;
}
// 柯里化函数
function _curry(callback, paraNum) {
    if (!paraNum) paraNum = callback.length;
    var __curry = function(cb, num) {
        // 柯里逻辑函数
        var args = Array.prototype.slice.call(arguments);
        args.shift(); // 第一个参数出队
        args.shift(); // 第二个参数出队
        return function() {
            // 返回闭包函数
            var _args = Array.prototype.slice.call(arguments);
            var totalArgs = [];
            totalArgs.push.apply(totalArgs, args);
            totalArgs.push.apply(totalArgs, _args);
            if (totalArgs.length >= num) {
                return cb.apply(this, totalArgs);
            } else {
                totalArgs.unshift(cb, num);
                return __curry.apply(this, totalArgs);
            }
        };
    };
    return __curry(callback, paraNum);
}
// 柯里化后的函数
var _curryCheckType = _curry(_checkType);
var _stringCheck = _curryCheckType("[object String]"); // 检查字符串
var _arrayCheck = _curryCheckType("[object Array]"); // 检查数组
var _functionCheck = _curryCheckType("[object Function]"); // 检查函数
var _objectCheck = _curryCheckType("[object Object]"); // 检查对象
var _numberCheck = _curryCheckType("[object Number]"); // 检查数字
// 构造函数
function VirtualList(el, listData, creatItemCallback, options) {
    if (typeof el === "string") {
        el = document.querySelector(el);
    }else{
        console.log("VirtualList.el is error")
        return false
    }
    // if(el[0]) //这里可以判断dom[0]是否存在，如果存在肯定是jquery对象
    // {
    //     el = el[0]; //把jquery对象转成dom对象
    // }
    this.el = el; // 容器元素
    this.listData = listData; // 列表数据
    this.creatItemCallback = creatItemCallback; // 生成列表DOM元素的回调函数
    this.__defaultOptions = {
        // 默认参数配置
        listHeight: 50, // 单个item确定高度
        dynamicHeight: false, // 采用item动态高度
        estimateListHeight: 50, // 单个item预估高度
        bufferScale: 0.5, // 缓冲秤
        throttleTime: 100, // 节流时间
        useFrameOptimize: false // 帧优化or固定优化
    };
    if (!options) options = {};
    this.inputCheck(options); // 输入安全检查
    this.options = _mixin(Object.create(null), this.__defaultOptions, options); // 执行配置对象混入
    this.initPositionsInfo(); // 动态高度模式下初始化位置信息
    this.initBase(); // 初始化基本参数
    this.initContainer(); // 初始化容器
    this.bindEvents(); // 监听滚动条
    this.render(0); // 起始渲染
    this.handleChecked(); // 全选反选
    this.resize(); // 监听浏览器缩放，确定可视区域高度
}
// 全选，反选，单选
VirtualList.prototype.handleChecked = function(option) {
    let _this = this
    this.el.onclick = function(ev) {
        var ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        // 全选，反选
        if (!!target.attributes.name && target.attributes.name.value === 'pCheckbox') {
            // 修改所有数据
            _this.listData.forEach(item => item.checked = target.checked)
            let childNodes
            for(child in _this.el.childNodes){
                // 获取_this.el下面的table节点
                if(_this.el.childNodes[child].tagName == 'TABLE'){
                    childNodes = _this.el.childNodes[child]
                }
            }
            // _this.el节点下面的input[type=checkbox]的状态，跟当前状态同步
            childNodes.querySelectorAll("input[type=checkbox]").forEach(function(item) {
                item.checked = target.checked
            })
        }
        // 单个选择
        if (!!target.attributes.name && target.attributes.name.value === 'cCheckbox') {
            let childNodes,trData
            for(child in target.parentNode.parentNode.childNodes){
                try{
                    target.parentNode.parentNode.childNodes[child].querySelector("span[name=trData]") != null
                    trData = JSON.parse(target.parentNode.parentNode.childNodes[child].querySelector("span[name=trData]").innerText)
                }catch(err){
                    // console.log(err)
                }
                // console.log(target.parentNode.parentNode.childNodes[child] != '#text')
                // if(target.parentNode.parentNode.childNodes[child].nodeType != 3){ // 把空白的文本移除掉
                //     // console.log(target.parentNode.parentNode.childNodes[child].querySelector("span[name=trData]"))
                //     // VM202432:166 Uncaught TypeError: target.parentNode.parentNode.childNodes[child].querySelector is not a function
                //     if(target.parentNode.parentNode.childNodes[child].querySelector("span[name=trData]") != null)
                //         trData = JSON.parse(target.parentNode.parentNode.childNodes[child].querySelector("span[name=trData]").innerText)
                // }
            }
            _this.listData[trData.index].checked = target.checked
            // 没选中的数据
            let uncheckedData = _this.listData.filter(item => !item.checked)
            // 没选中的数据===0，说明全部选中，全选选中
            if(uncheckedData.length === 0){
                _this.el.querySelector('input[name=pCheckbox]').checked = true
            }else{
                // 只要有一条没选中的数据，全选取消
                _this.el.querySelector('input[name=pCheckbox]').checked = false
            }
        }
    }
};
// 类型输入检查
VirtualList.prototype.inputCheck = function(option) {
    if (!(this.el instanceof HTMLElement)) {
        _throwErr("没有输入或者选择器捕捉到的DOM元素");
    }
    if (!_arrayCheck(this.listData)) {
        _throwErr("输入的列表数据必须为一个数组类型");
    }
    if (!_functionCheck(this.creatItemCallback)) {
        _throwErr("输入的元素构造器仅支持为函数类型");
    }
    if (!_objectCheck(option)) {
        console.warn("没有显式的指定配置参数，将使用默认配置。");
    }
    this.optionCheck(option);
};
// 输入配置参数检查
VirtualList.prototype.optionCheck = function(option) {
    if (!option.dynamicHeight) { // 不是动态高度
        if (!option.listHeight) { // 没有设置单个item的确定高度
            console.warn("未显示指定元素的固定高度，将采用高度默认参数。");
        }
    } else {
        if (option.estimateListHeight && !_numberCheck(option.estimateListHeight)) { // 单个item的预估高度
            _throwErr("配置的预估高度应该是一个number类型，");
        } else {
            if (option.estimateListHeight < 25) {
                console.warn(
                    "动态预估高度的参数小于25px，可能会渲染多余的DOM元素造成性能瓶颈。"
                );
            }
        }
    }
};
// 判断是否处于动态加载模式，若是初始化加载位置信息数据
VirtualList.prototype.initPositionsInfo = function() {
    if (this.options.dynamicHeight === true) { // 动态高度
        var index = 0; // 元素索引
        this.listPositionsInfo = [];
        var estimateListHeight = this.options.estimateListHeight; // 单个item的预估高度
        // 硬加载
        while (index < this.listData.length) { // 初始化位置信息参数
            this.listPositionsInfo.push({
                index,
                height: estimateListHeight,
                top: index * estimateListHeight,
                bottom: (index + 1) * estimateListHeight,
            });
            index++;
        }
    }
};
// 初始化基本参数
VirtualList.prototype.initBase = function() {
    var listHeight = this.options.listHeight; // item的确定高度
    var listData = this.listData;
    // 计算列表总高度
    this.totalHeight = this.options.dynamicHeight ?
        this.listPositionsInfo[this.listPositionsInfo.length - 1].bottom // 动态高度模式下使用位置信息数组来作为总长
        :
        listHeight * listData.length; // 静态高度下采用配置高度
    this.containerClientHeight = this.el.clientHeight; // 可视区域的高度
    var divideNum =
        this.options.dynamicHeight === true ?
            parseInt(this.options.estimateListHeight, 10) :
            parseInt(this.options.listHeight, 10);
    // 计算可视区域的渲染数量-->不含缓冲区
    this.clientListAmounts = Math.ceil(
        parseInt(this.containerClientHeight, 10) / divideNum
    );
};
// 初始化容器元素
VirtualList.prototype.initContainer = function() {
    this.el.style.overflow = "auto";
    this.el.style.position = "relative";
    // 设置遮罩元素
    var maskContainer = document.createElement("div");
    maskContainer.style.position = "absolute";
    maskContainer.style.height = this.totalHeight + "px";
    maskContainer.style.zIndex = -1;
    maskContainer.style.top = "0";
    maskContainer.style.right = "0";
    maskContainer.style.left = "0";
    // this.el.appendChild(maskContainer);
    this.__maskContainer = maskContainer;

    // 设置偏移容器
    this.el.childNodes[1].removeChild(this.el.childNodes[1].childNodes[2]);
    var offsetContainer = document.createElement("tbody");
    offsetContainer.style.position = "absolute";
    offsetContainer.style.top = "35px";
    offsetContainer.style.bottom = "65px";
    offsetContainer.style.right = "0";
    offsetContainer.style.left = "0";
    offsetContainer.style.color = "#000000";
    this.el.childNodes[1].appendChild(offsetContainer);
    this.__offsetContainer = offsetContainer; // 设置引用
};
// 绑定时间监听方法
VirtualList.prototype.bindEvents = function() {
    var startY = 0;
    var _this = this;
    // 闭包的方式访问位置
    var updateOffset = function(e) {
        e.preventDefault();
        startY = e.target.scrollTop;
        _this.render(startY);
    };
    // 判断使用帧优化还是固定优化
    var throttle_updateOffset = _this.options.useFrameOptimize ?
        _throttleByFrame(updateOffset) :
        _throttle(updateOffset, _this.options.throttleTime);
    this.el.addEventListener("scroll", throttle_updateOffset);
};
// 找到首项数据索引
VirtualList.prototype.findFirstIndex = function(offset) {
    if (this.options.dynamicHeight == true) {
        // return this.listPositionsInfo.findIndex(function(info) {// 线性搜索
        //   return info.bottom > offset;
        // });
        return _binarySearch(this.listPositionsInfo, offset); // 二分搜索
    } else {
        var listHeight = this.options.listHeight;
        return Math.floor(offset / listHeight);
    }
};
// 找到末项数据索引
VirtualList.prototype.findLastIndex = function(startIndex) {
    return startIndex + this.clientListAmounts;
};
// 计算上半区域缓存开始坐标
VirtualList.prototype.calAboveBuffer = function(startIndex, renderCount) {
    var bufferScale = this.options.bufferScale;
    if (typeof bufferScale === "number") {
        var index = startIndex - Math.ceil(renderCount * bufferScale);
    } else if (Object.prototype.toString.call(bufferScale) === "[object Array]") {
        var index = startIndex - Math.ceil(renderCount * bufferScale[0]);
    } else {
        console.warn("请检查输入的缓冲区数据类型是否正确。");
        return;
    }
    return index < 0 ? 0 : index;
};
// 计算下半区域缓存结束坐标
VirtualList.prototype.calBelowBuffer = function(endIndex, renderCount) {
    var bufferScale = this.options.bufferScale;
    if (typeof bufferScale === "number") {
        var index = endIndex + Math.ceil(renderCount * bufferScale);
    } else if (Object.prototype.toString.call(bufferScale) === "[object Array]") {
        var index = endIndex + Math.ceil(renderCount * bufferScale[1]);
    } else {
        console.warn("请检查输入的缓冲区数据类型是否正确。");
        return;
    }
    return index > this.listData.length ? this.listData.length : index;
};
// 渲染列表方法
VirtualList.prototype.render = function(offset) {
    var startIndex = this.findFirstIndex(offset);
    var endIndex = Math.min(this.findLastIndex(startIndex), this.listData.length);
    if (this.options.bufferScale) {
        // 如果存在缓冲区
        startIndex = this.calAboveBuffer(startIndex, this.clientListAmounts);
        endIndex = this.calBelowBuffer(endIndex, this.clientListAmounts);
    }
    this.renderList = this.listData.slice(startIndex, endIndex);
    var _this = this;
    var htmlStr = this.renderList.map(__renderCallback).join("");
    this.__offsetContainer.innerHTML = htmlStr;
    // 渲染回调函数--->普通模式
    function __renderCallback(data) {
        var item = _this.creatItemCallback(data);
        if (!_this.options.dynamicHeight)
            item.style.height = _this.options.listHeight + "px";
        return item.outerHTML;
    }
    // 若为动态高度模式，更新位置信息
    if (this.options.dynamicHeight === true) {
        this.updatelistPositionInfo(this.__offsetContainer.children, startIndex);
        this.updateTotalHeight();
    }
    this.setContainerTranslate(startIndex); // 设置内容容器偏移量
};
// 设置内容容器偏移量
VirtualList.prototype.setContainerTranslate = function(startIndex) {
    var offset =
        this.options.dynamicHeight === true // 根据是否处于动态高度模式来返回偏移结果
            ?
            this.listPositionsInfo[startIndex].top :
            startIndex * this.options.listHeight;
    this.__offsetContainer.style.webkitTransform =
        "translate3d(0, " + offset + "px,0)";
    this.__offsetContainer.style.height =
        this.totalHeight - offset + "px";
};
// 更新列表位置信息
VirtualList.prototype.updatelistPositionInfo = function(children, startIndex) {
    var index = startIndex;
    var _this = this;
    if (children.length > 0) {
        Array.prototype.forEach.call(children, function(childNode) {
            var rect = childNode.getBoundingClientRect();
            var height = rect.height;
            var previousHeight = _this.listPositionsInfo[index].height;
            var dValue = previousHeight - height; // 计算出差值
            if (dValue) {
                _this.listPositionsInfo[index].bottom =
                    _this.listPositionsInfo[index].bottom - dValue;
                _this.listPositionsInfo[index].height = height;
                // ---> 硬加载
                for (var i = index + 1; i < _this.listPositionsInfo.length; i++) {
                    _this.listPositionsInfo[i].top =
                        _this.listPositionsInfo[i - 1].bottom;
                    _this.listPositionsInfo[i].bottom =
                        _this.listPositionsInfo[i].bottom - dValue;
                }
            }
            index++;
        });
    }
};
// 更新列表总高度
VirtualList.prototype.updateTotalHeight = function() {
    this.__maskContainer.style.height =
        this.listPositionsInfo[this.listPositionsInfo.length - 1].bottom + "px";
};

//
VirtualList.prototype.resize = function() {
    window.addEventListener('resize', () => { //监听浏览器窗口大小改变
        this.el.style.height = $(window).height()-this.el.offsetTop - 50 + 'px'
        let right = this.el.children[0].children[0].style.right.split("px")[0]
        this.el.children[0].children[0].style.right = right * 1 + this.el.children[0].children[0].getBoundingClientRect().right - this.el.children[0].children[1].getBoundingClientRect().right + 'px'
    });
};



