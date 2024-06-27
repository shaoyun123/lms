<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>抽号页面</title>
            <style>
                html {
                    font-size: 14px;
                }
                
                body {
                    font-family: 微软雅黑;
                    margin: 0 auto;
                    padding: 0px;
                    height: 100%;
                    line-height: 22px;
                    width: 100%;
                    font-size: 14px;
                    background: pink !important;
                    color: #4c4c4c;
                }
                
                ul,
                ul li,
                ol li,
                tr td,
                dl,
                dd {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                }
                
                p {
                    margin: 0;
                    padding: 0
                }
                
                .turntable {
                    position: absolute;
                    top: 2%;
                    width: 32.08%;
                    left: 33.96%;
                }
                
                .turntable .img {
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                    box-shadow: 0px 0px 30px 20px rgba(0, 0, 0, 0.1)
                }
                
                .jz {
                    position: absolute;
                    top: 37.5%;
                    left: 33%;
                    width: 34%;
                    margin: 0 auto;
                    text-align: center;
                }
                
                .jz img {
                    width: 100%;
                    vertical-align: top;
                    padding-left: 9%;
                }
                
                .jz span div {
                    display: inline-block;
                    width: 100%;
                    line-height: 1.5rem;
                    color: #f01501;
                    font-size: 1.4rem;
                    font-weight: bold;
                    font-family: 微软雅黑
                }
                
                .clear {
                    clear: both;
                    height: 0px;
                    line-height: 0px;
                    font-size: 0px;
                }
                
                .btn {
                    position: absolute;
                    top: 50%;
                    width: 11.45%;
                    left: 44.275%;
                }
                
                .start,
                .stop {
                    background:url(${ctx}/static/img/lottery_img/1_07.png) center top no-repeat;
                    display: block;
                    width: 2.2rem;
                    height: 0.55rem;
                    background-size: 100%;
                    text-align: center;
                    cursor: pointer;
                    line-height: 0.52rem;
                    font-size: 0.3rem;
                    color: #fff;
                    margin-top: 5%;
                    -webkit-transition: all .3s;
                    -moz-transition: all .3s;
                    transition: all .3s;
                }
                
                .btn_none {
                    background:url(${ctx}/static/img/lottery_img/1_07a.png) center top no-repeat;
                    background-size: 100%;
                }
                
                .confirmbox {
                    width: 35%;
                    position: absolute;
                    right: 32.5%;
                    bottom: 2.5%;
                }
                
                .confirmbox .bg_img img {
                    width: 100%;
                    position: relative;
                }
                
                .confirmbox .box {
                    position: absolute;
                    top: 27%;
                    left: 0px;
                    width: 100%;
                    text-align: center;
                    color: #2a0901;
                }
                
                .confirmbox .box .title {
                    color: #2a0901;
                    font-size: 0.25rem;
                    text-align: center;
                    line-height: 0.27rem;
                    font-weight: bold;
                    margin-bottom: 1.5%;
                }
                
                .confirmbox .conbox {
                    width: 100%;
                    text-align: center;
                }
                
                .confirmbox .conbox p {
                    display: inline-block;
                    background:url(${ctx}/static/img/lottery_img/1_06.png) center right no-repeat;
                    background-size: 0.1rem;
                    line-height: 0.37rem;
                    padding-right: 3.5%;
                    margin-right: 3.5%;
                    font-size: 0.35rem;
                    font-family: Arial, Helvetica, sans-serif;
                }
                
                .confirmbox .conbox .span {
                    margin-right: 0px;
                    padding-right: 0px;
                    background: none;
                }
                
                .confirmbox .lucknum span {
                    display: inline-block;
                    background:url(${ctx}/static/img/lottery_img/1_06.png) center right no-repeat;
                    background-size: 0.1rem;
                    line-height: 0.37rem;
                    padding-right: 3.5%;
                    margin-right: 3.5%;
                    font-size: 0.35rem;
                    font-family: Arial;
                }
                
                .confirmbox .lucknum .span {
                    margin-right: 0px;
                    padding-right: 0px;
                    background: none;
                }
                
                a {
                    color: #4c4c4c;
                    text-decoration: none;
                    cursor: pointer;
                    -webkit-transition: all .3s;
                    -moz-transition: all .3s;
                    transition: all .3s;
                }
                /*a:hover{ text-decoration:underline;}*/
                
                img {
                    vertical-align: middle;
                }
                
                .zjmd {
                    position: absolute;
                    bottom: 2.5%;
                    height: 5rem;
                    width: 17%;
                    left: 1%;
                    background: #fff;
                    border: 3px solid #ff9c5b;
                    border-radius: 10px;
                }
                
                .zjmd .title {
                    font-size: 0.25rem;
                    text-align: center;
                    line-height: 0.36rem;
                    padding-top: 5%;
                    font-weight: bold;
                }
                
                .zjmd .div1 {
                    margin-top: 5%;
                    padding-left: 5%;
                    position: relative;
                }
                
                .zjmd .div1 .p1a {
                    margin-bottom: 0.7rem;
                    font-size: 0.18rem;
                    line-height: 0.3rem;
                    font-weight: bold;
                }
                
                .zjmd #content p {
                    background: #e00000;
                    width: 0.3rem;
                    height: 0.3rem;
                    color: #fff;
                    text-align: center;
                    line-height: 0.3rem;
                    border-radius: 100%;
                    font-weight: bold;
                    position: absolute;
                    top: 0px;
                    left: 5%;
                    font-size: 0.18rem;
                }
                
                .start_font {
                    font-size: 0.6rem !important
                }
                
                .running_font {
                    font-size: 0.5rem !important
                }
                
                @-webkit-keyframes rotate {
                    from {
                        -webkit-transform: rotate(0deg)
                    }
                    to {
                        -webkit-transform: rotate(360deg)
                    }
                }
                
                @-moz-keyframes rotate {
                    from {
                        -moz-transform: rotate(0deg)
                    }
                    to {
                        -moz-transform: rotate(360deg)
                    }
                }
                
                @-ms-keyframes rotate {
                    from {
                        -ms-transform: rotate(0deg)
                    }
                    to {
                        -ms-transform: rotate(360deg)
                    }
                }
                
                @-o-keyframes rotate {
                    from {
                        -o-transform: rotate(0deg)
                    }
                    to {
                        -o-transform: rotate(360deg)
                    }
                }
            </style>
            <script src="${ctx}/static/util/adaptive-version2.js?v=${ver}"></script>
            <script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
        </head>

        <body>
            <div id="app">
                <div class="turntable">
                    <img src="${ctx}/static/img/lottery_img/1_03.png" class="img" v-bind:style="">
                    <div class="jz">
                        <span class="name">
                            <div v-if="start" class="running_font">{{statusDis}}</div>
                            <div v-else  class="start_font">开始</div>
                        </span>
                    </div>
                </div>
                <div class="btn">
                    <div class="start" id="btntxt" v-on:click="begin">{{statusName}}</div>
                </div>
                <!-- <div class="confirmbox">
                    <div class="bg_img"><img src="${ctx}/static/img/lottery_img/1_04.png"></div>
                    <div class="box">
                        <div class="title">抽中号码公布</div>
                        <div class="lucknum">
                            <span v-for="number in numbers">{{ number }}</span>
                            <div class="clear"></div>
                        </div>
                        <div class="conbox"></div>
                    </div>
                </div> -->
                <div class="audiobox">
                    <audio v-bind:src="audioplay" id="playsong">亲 您的浏览器不支持html5的audio标签</audio>
                </div>
            </div>
        </body>
        <script>
            var app = new Vue({
                el: '#app',
                data: {
                    numbers: [],
                    statusName: "开始",
                    statusDis: 'running',
                    status: 0,
                    start: 0,
                    timer: null,
                    numberArray: [1, 2, 3, 4, 5],
                    audiourl: ['${ctx}/static/audio/1.mp3',
                        '${ctx}/static/audio/2.mp3',
                        '${ctx}/static/audio/3.mp3',
                        '${ctx}/static/audio/4.mp3',
                        '${ctx}/static/audio/5.mp3'
                    ],
                    audioplay: ""
                },
                mounted() {
                    this.keyupSubmit();
                    this.touchSubmit();
                },
                computed: {},
                methods: {
                    begin: function(event) {
                        clearInterval(this.timer);
                        var $this = this;
                        $this.status = !$this.status;
                        $this.statusName = $this.status ? '停止' : '开始';
                        if ($this.numberArray.length == 5) {
                            this.start = 1;
                        }
                        if ($this.numberArray.length > 0) {
                            if ($this.status) {
                                if (!$this.timer) {
                                    $this.timer = setInterval(function() {
                                        $this.circle();
                                        $this.statusDis = 'running'
                                        $this.bonus = $this.numberArray[Math.floor(Math.random() * ($this.numberArray.length))];
                                    }, 50);
                                }
                            } else {
                                $this.pause();
                                $this.statusDis = $this.bonus
                                $this.timer = null;
                                $this.numbers.push($this.bonus);
                                $this.audioplay = $this.audiourl[$this.bonus - 1];
                                var video = document.getElementById('playsong');
                                setTimeout(function() {
                                    video.play();
                                }, 0);
                                $this.numberArray.splice($this.numberArray.indexOf($this.bonus), 1);
                            }
                        } else {
                            $this.statusDis = 'pause'
                            $this.statusName = '重新开始';
                            $this.numberArray = [1, 2, 3, 4, 5];
                            $this.numbers = [];
                            $this.start = 0;
                            $this.status = 0;
                        }
                    },
                    circle: function() {
                        $(".turntable .img").css("animation", "1s linear 0s normal none infinite rotate");
                        $(".turntable .img").css("animation-play-state", "running");
                    },
                    pause: function() {
                        $(".turntable .img").css({
                            "animation": "",
                            "animation-play-state": "pause"
                        });
                    },
                    keyupSubmit: function() {
                        var $this = this;
                        document.onkeyup = function(e) {
                            var _key = window.event.keyCode;
                            if (_key === 13 || _key === 32) {
                                // $this.begin();
                                $this.debounce($this.begin(), 500);
                            }
                        }
                    },
                    touchSubmit: function() {
                        var $this = this;
                        document.getElementById('btntxt').touchstart = function() {
                            // $this.begin();
                        }
                    },
                    debounce: function(method, delay) {
                        let timer = null;
                        return function() {
                            let self = this,
                                args = arguments;
                            timer && clearTimeout(timer);
                            timer = setTimeout(function() {
                                method.apply(self, args);
                            }, delay);
                        }
                    }
                },

            })
        </script>

        </html>