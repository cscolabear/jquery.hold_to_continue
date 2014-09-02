// plugin st
(function($){

    // hold to(2) continue
    $.fn.h2c = function(_circle_opt) {
        var BTN = this;
        var DONE = false;
        var _inSide = true;
        
        var circle_opt = _circle_opt || {};
        circle_opt.redirect = typeof circle_opt.redirect != "undefined" ? _circle_opt.redirect : false; // 導向頁
        circle_opt.redirect_delay = typeof circle_opt.redirect_delay != "undefined" ? _circle_opt.redirect_delay : 1.5; // 停頓約1.5秒
        circle_opt.LoadSec = typeof circle_opt.LoadSec != "undefined" ? _circle_opt.LoadSec : 5; // 約5秒
        circle_opt.CircleColor = typeof circle_opt.CircleColor != "undefined" ? _circle_opt.CircleColor : '#000'; // 圓顏色
        circle_opt.FontColor = typeof circle_opt.FontColor != "undefined" ? _circle_opt.FontColor : '#000';
        if(typeof circle_opt.Circle_domId != "undefined" && circle_opt.Circle_domId != '') {
            if($('#' + circle_opt.Circle_domId).length > 0) {
                _inSide = false;
                circle_opt.Circle_domId = _circle_opt.Circle_domId;
            }
        }

        // requestAnimationFrame Shim
        (function() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();

        var timeoutId_darw = 0;
        var circle_min_size = 40;
        var circle_max_size = 0;
        var circle_size = circle_min_size;

        var init = function(){
            if(_inSide) {
                if((circle_size = BTN.width() / 3) < circle_min_size) {
                    circle_size = circle_min_size;
                }
                if(circle_max_size > 0 && circle_size > circle_max_size) {
                    circle_size = circle_max_size;
                }
                var origin_html = BTN.html();
                BTN.html('<div style="display:inline-block">' +
                    origin_html +
                    '</div>' +
                    '<canvas id="myCircle" style="float:right;" width="' + circle_size + '" height="' + circle_size + '">0</canvas>'
                    );
            } else {
                var Target_container = $('#' + circle_opt.Circle_domId);
                if((circle_size = Target_container.width()) < circle_min_size) {
                    circle_size = circle_min_size;
                }
                if(circle_max_size > 0 && circle_size > circle_max_size) {
                    circle_size = circle_max_size;
                }
                Target_container.html('<canvas id="myCircle" style="float:right;" width="' + circle_size + '" height="' + circle_size + '">0</canvas>'
                    );
            }

        }();//^ init

        // darw circle
        // var framesPerSecond = 20; // 約5秒
        var canvas = document.getElementById('myCircle');
        var context = canvas.getContext('2d');
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var radius = 50; // default ,will be auto adjust
        var endPercent = 100;
        var curPerc = 0;
        var circ = Math.PI * 2;
        var quart = Math.PI / 2;
        var font_size = 12;
        var font_pos = font_size / 3;
        if((x / 2) > 15){
            context.lineWidth = 15; // max
        } else {
            context.lineWidth = 2; // min
        }
        context.strokeStyle = circle_opt.CircleColor;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        context.shadowColor = '#000';
        context.fillStyle = circle_opt.FontColor;
        radius = x - context.lineWidth;
        font_size = parseInt(radius / 1.5);
        context.font = font_size + 'px verdana';

        // 綁定 滑鼠點擊事件
        BTN.mousedown(function() {
            if(DONE != false) return false;
            BTN.addClass('hold_on');
            animate();
        }).bind('mouseup mouseleave', function() {
            if(DONE != false) return false;
            BTN.removeClass('hold_on');
            curPerc = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            clearTimeout(timeoutId_darw);
        });

        function finish(){
            DONE = true;
            BTN.addClass('hold_on');

            if(circle_opt.redirect) {
                setTimeout(function() {
                    window.location = circle_opt.redirect;
                }, circle_opt.redirect_delay * 1000);
            }

            if(circle_opt.next) {
                circle_opt.next();
            }
        }

        function animate(current) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
            context.stroke();

            font_pos = font_size / 3;
            if(current != undefined) {

                // if even
                if((parseInt(current * 100).toString().length) % 2 == 0) {
                    font_pos = font_pos * (parseInt(current * 100).toString().length + 0.2);
                } else {
                    font_pos = font_pos * (parseInt(current * 100).toString().length);
                }
                context.fillText(parseInt(current * 100), x - font_pos, y + font_size / 3);
            }

            curPerc++;
            if(curPerc <= endPercent){
                timeoutId_darw = setTimeout(function() {
                    requestAnimationFrame(function(){
                        animate(curPerc / 100)
                    });
                // }, 1000 / framesPerSecond);
                }, circle_opt.LoadSec * 10);
            }

            if(curPerc > 100) {
                finish();
                return true;
            }
        }
    }
})(jQuery);
// plugin ed