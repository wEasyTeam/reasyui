/*!
 * REasy UI Massage
 *
 * Depends:
 *	reasy-ui-core.js
 */
 
(function (doc) { "use strict";
    $.ajaxMassage = (function () {
        function AjaxMsg() {
            this.$elem = null;
        }
        
        AjaxMsg.prototype = {
            constructor: AjaxMsg,
            
            init: function (msg) {
                var msgElem = document.getElementById('ajax-massage');
                
                if (msgElem) {
                    msgElem.style.display = "block";
                } else {
                    msgElem = document.createElement("div");
                    msgElem.id = 'ajax-massage';
                    $("body").append(msgElem);
                }
                
                msgElem.className += ' massage-ajax';
                msgElem.innerHTML = msg;
                this.$elem = $(msgElem);
            },
            
            show: function () {
                this.$elem.show();
            },
            
            hide: function () {
                this.$elem.hide();
            },
            
            remove: function () {
                this.$elem.remove();
            },
            
            text: function (msg) {
                this.$elem.html(msg);
            }
        };
        
        return function (msg) {
            var ajaxMsg = new AjaxMsg();
            ajaxMsg.init(msg);
            
            return ajaxMsg;
        };
    })();
})(document);