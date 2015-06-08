/**
 * reasy-ui - The REasy UI for router, and themes built on top of the HTML5 and CSS3.
 * @version v1.0.3.rc
 * @author ET.W
 * @license MIT License (MIT)
 */
/*!
 * REasy UI Core
 *
 */

(function (win, doc) {
"use strict";

var rnative = /^[^{]+\{\s*\[native code/,
	translate;

// ReasyUI 全局变量对象
$.reasyui = {};

// 记录已加载的 REasy模块
$.reasyui.mod = 'core ';

// ReasyUI 多语言翻译对象对象
$.reasyui.b28n = {};

// 翻译函数
$.reasyui._ = function (str, replacements) {
	var ret = $.reasyui.b28n[str] || str,
		len = replacements && replacements.length,
		count = 0,
		index;

	if (len > 0) {
		while((index = ret.indexOf('%s')) !== -1) { 
			ret = ret.substring(0,index) + replacements[count] +
					ret.substring(index + 2, ret.length);
			count = ((count + 1) === len) ? count : (count+1);
		}
	}
	
	return ret;
}

// HANDLE: When $ is jQuery extend include function 
if (!$.include) {
	$.include = function(obj) {
		$.extend($.fn, obj);
	};
}

$.extend({
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	},
	
	//获取视口宽度，不包含滚动条
	viewportWidth: function() {
		var de = doc.documentElement;
		
		return (de && de.clientWidth) || doc.body.clientWidth ||
				win.innerWidth;
	},
	
	//获取视口高度，不包含滚动条
	viewportHeight: function() {
		var de = doc.documentElement;
		
		return (de && de.clientHeight) || doc.body.clientHeight ||
				win.innerHeight;
	},
	
	//获取输入框中光标位置，ctrl为你要获取的输入框
	getCursorPos: function (ctrl) {
		var Sel,
			CaretPos = 0;
		//IE Support
		if (doc.selection) {
			ctrl.focus ();
			Sel = doc.selection.createRange();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length; 
		} else if (ctrl.selectionStart || parseInt(ctrl.selectionStart, 10) === 0){
			CaretPos = ctrl.selectionStart;
		}
		return CaretPos; 
	},
	
	//设置文本框中光标位置，ctrl为你要设置的输入框，pos为位置
	setCursorPos: function (ctrl, pos){
		var range;
		
		if(ctrl.setSelectionRange){
			ctrl.focus();
			ctrl.setSelectionRange(pos,pos);
		} else if (ctrl.createTextRange) {
			range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
		
		return ctrl;
	},
	
	getUtf8Length: function (str) {
		var totalLength = 0,
			charCode,
			len = str.length,
			i;
			
		for (i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode < 0x007f) {
				totalLength++;
			} else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
				totalLength += 2;
			} else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
				totalLength += 3;
			} else {
				totalLength += 4;
			}
		}
		return totalLength;
	},
	
	/**
	 * For feature detection
	 * @param {Function} fn The function to test for native support
	 */
	isNative: function (fn) {
		return rnative.test(String(fn));
	},
	
	isHidden: function (elem) {
		if (!elem) {
			return;
		}
		
		return $.css(elem, "display") === "none" ||
			$.css(elem, "visibility") === "hidden" ||
			(elem.offsetHeight == 0 && elem.offsetWidth == 0);
	},
	
	getValue: function (elem) {
		if (typeof elem.value !== "undefined") {
			return elem.value;
		} else if ($.isFunction(elem.val)) {
			return elem.val();
		}
	}
});

/* Cookie */
$.cookie = {
	get: function (name) {
		var cookieName = encodeURIComponent(name) + "=",
			cookieStart = doc.cookie.indexOf(cookieName),
			cookieEnd = doc.cookie.indexOf(';', cookieStart),
			cookieValue =  null;
			 
		if (cookieStart > -1) {
			if (cookieEnd === -1) {
				cookieEnd = doc.cookie.length;
			}
			cookieValue = decodeURIComponent(doc.cookie.substring(cookieStart +
					cookieName.length, cookieEnd));
		}
		return cookieValue;
	},
	set: function (name, value, path, domain, expires, secure) {
		var cookieText = encodeURIComponent(name) + "=" +
				encodeURIComponent(value);
				
		if (expires instanceof Date) {
			cookieText += "; expires =" + expires.toGMTString();
		}
		if (path) {
			cookieText += "; path =" + path;
		}
		if (domain) {
			cookieText += "; domain =" + domain;
		}
		if (secure) {
			cookieText += "; secure =" + secure;
		}
		doc.cookie = cookieText;

	},
	unset:function (name, path, domain, secure) {
		this.set(name, '', path, domain, new Date(0), secure);
	}
};

}(window, document));
/*!
 * REasy UI Dialog
 *
 * Depends:
 *  reasy-ui-core.js
 */

(function(doc) {
  "use strict";
  /* Dialog */
  $.dialog = (function() {
    var defaults = {
      show: true,
      showNoprompt: false,
      model: 'dialog',
      title: '来自网页的消息',
      content: ''
    };

    function createDialogHtml(options) {
      var model = options.model,
        ret,
        nopromptClass;

      if (model === 'dialog') {
        nopromptClass = options.showNoprompt ? "dialog-nocheck" :
          "dialog-nocheck none";

        ret = '<h2 class="dialog-title">' +
          '<span id="dialog-title">' + options.title + '</span>' +
          '<button type="button" class="close btn" id="dialog-close">&times;</button>' +
          '</h2>' +
          '<div class="dialog-content">' + options.content + '</div>' +
          '<div class="' + nopromptClass + '">' +
          '<label class="checkbox" for="nocheck">' +
          '<input type="checkbox" id="dialog-noprompt" />不再提示' +
          '</label>' +
          '</div>' +
          '<div class="dialog-btn-group">' +
          '<button type="button" class="btn" id="dialog-apply">确定</button>' +
          '<button type="button" class="btn" id="dialog-cancel">取消</button>' +
          '</div>';
      } else if (model === 'message') {
        ret = '<h2 class="dialog-title">' +
          '<span id="dialog-title">' + options.title + '</span>' +
          '</h2>' +
          '<div class="dialog-content dialog-content-massage">' + options.content + '</div>';
      }

      return ret;
    }

    function Dialog(options) {
        this.element = null;
        this.id = 'r-dialog';
        this.overlay = null;
        this.noprompt = 'false';

        if ($.type(options) === 'object') {
            this.options = $.extend(defaults, options);
        } else {
            this.options = $.extend(defaults, {
                content: options
            });
        }
    }

    Dialog.prototype = {
      init: function() {
        var $overlay = $('#overlay'),
          overlayElem = $overlay[0],
          $dialog = $('#r-dialog'),
          dialogElem = $dialog[0],
          bodyElem = $('body')[0],
          thisDialog = this,
          dialogLeft,
          modelHtml;

        modelHtml = createDialogHtml(this.options);

        if (!overlayElem) {
          overlayElem = doc.createElement('div');
          overlayElem.id = 'overlay';
          overlayElem.className = 'overlay';
          bodyElem.appendChild(overlayElem);
        }
        if (!dialogElem) {
          dialogElem = doc.createElement('div');
          dialogElem.id = 'r-dialog';
          dialogElem.className = 'dialog';
          bodyElem.appendChild(dialogElem);

          $dialog = $('#r-dialog');
          dialogElem = $dialog[0];
          $dialog.html(modelHtml);
        }

        // 计算居中需设计左边距为多少
        dialogLeft = ($.viewportWidth() - dialogElem.offsetWidth) /
          (2 * $.viewportWidth()) * 100;
        dialogLeft = dialogLeft > 0 ? dialogLeft : 0;

        $dialog.css('left', dialogLeft + '%');
        this.element = dialogElem;
        this.overlay = overlayElem;

        $dialog.on('click', function(e) {
          var curElem = e.target || e.srcElement,
            curId = curElem.id,
            funName = curId.split('-')[1];

          if ($('#dialog-noprompt')[0] && $('#dialog-noprompt')[0].checked) {
            thisDialog.noprompt = 'true';
          } else {
            thisDialog.noprompt = 'flase';
          }
          if (funName && thisDialog[funName]) {
            thisDialog[funName]();
          }
        });

        if (this.options.show) {
          this.open();
        }
      },

      close: function() {
        $(this.element).hide();
        $(this.overlay).hide();
      },

      open: function() {
        var nopromptElem = $('#dialog-noprompt')[0];

        $(this.element).show();
        $(this.overlay).show();
        if (nopromptElem) {
          nopromptElem.checked = false;
        }

      },

      apply: function() {
        if ($.type(this.options.apply) === 'function') {
          this.options.apply.apply(this, arguments);
        }
        this.close();
      },

      cancel: function() {
        if ($.type(this.options.cancel) === 'function') {
          this.options.cancel.apply(this, arguments);
        }
        this.close();
      }
    };

    return function(options) {
      var dialog = new Dialog(options);

      dialog.init();
      return dialog;
    };
  }());
})(document);

/*!
 * REasy UI Inputs
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function(win, doc) {"use strict";
var Inputs = {
	addCapTip: function(newField, pasElem) {
		var $newField = $(newField);
		
		function hasCapital(value, pos) {
			var pattern = /[A-Z]/g,
				myPos = pos || value.length;
				
			return pattern.test(value.charAt(myPos - 1));
		}
		
		//add capital tip 
		$newField.on("keyup", function (e) {
			var msgId = this.id + "-caps",
				myKeyCode  =  e.keyCode || e.which,
				$message,
				massageElm,
				repeat,
				pos;
			
			// HANDLE: Not input letter
			if (myKeyCode < 65 || myKeyCode > 90) {
				return true;
			}
			
			if (!this.capDetected) {
				massageElm = doc.createElement('span');
				massageElm.className = "help-inline text-info";
				massageElm.id = msgId;
				massageElm.innerHTML = '你输的是大写字母！';
				if (pasElem) {
					this.parentNode.insertBefore(massageElm, pasElem.nextSibling);
				} else {
					this.parentNode.insertBefore(massageElm, newField.nextSibling);
				}
				
				this.capDetected = true;
			}
			$message = $('#' + msgId);
			
			pos = $.getCursorPos(this);
			
			if (hasCapital(this.value, pos)) {
				$message.show();
				repeat = "$('#" + msgId + "').hide()";
				win.setTimeout(repeat, 1000);
			} else {
				$message.hide();
			}
		});
	},
	
	supChangeType: 'no',
	
	// 检测是否支持input元素 ‘type’ 属性的修改，IE下修改会报错
	isSupChangeType: function (passwordElem) {
		try {
			passwordElem.setAttribute("type", "text");
			if (passwordElem.type === 'text') {
				passwordElem.setAttribute("type", "password");
				return true;
			}
		} catch (d) {
			return false;
		}

	},
	
	// For IE not suppost change input type
	createTextInput: function (elem) {
		var $elem = $(elem),
			newField = doc.createElement('input'),
			$newField;
		
		newField.setAttribute("type", "text");
		newField.setAttribute("maxLength", elem.getAttribute("maxLength"));
		newField.setAttribute("size", elem.getAttribute("size"));
		newField.setAttribute("id", elem.id + "_");
		newField.className = elem.className;
		newField.setAttribute("placeholder", elem.getAttribute("placeholder") || "");
		if (elem.getAttribute('data-options')) {
			newField.setAttribute("data-options", elem.getAttribute('data-options'));
		}
		
		if (elem.getAttribute('required')) {
			newField.setAttribute("required", elem.getAttribute('required'));
		}
		elem.parentNode.insertBefore(newField, elem);
		$newField = $(newField);
		
		$elem.on("focus", function () {
			var thisVal = elem.value;
			
			if (thisVal !== "") {
				newField.value = thisVal;
			}
			$(this).hide();
			$newField.show()[0].focus();
			$.setCursorPos(newField, thisVal.length);
		});
		
		$newField.on("blur", function () {
			var $this = $(this);
			
			if (this.value !== "") {
				elem.value = this.value;
				
				
				if (!$this.hasClass("validatebox-invalid")) {
					$(this).hide();
					$elem.show();
				}
				
			} else {
				elem.value = "";
			}
		})
		.on("keyup", function () {
			if (newField.value !== "") {
				elem.value = newField.value;
			} else {
				elem.value = "";
			}
		});
		
		if (elem.value !== "") {
			$newField.hide();
			newField.value = elem.value;
		} else {
			$elem.hide();
			$newField.show();
		}
		
		return newField;
	},
	
	toTextType: function (elem) {
		var $elem = $(elem),
			newField;
		
		// HANDLE: 只有在第一次进来检测是否可直接修改 ‘type’属性
		if (Inputs.supChangeType === 'no') {
			Inputs.supChangeType = Inputs.isSupChangeType(elem);
		}
		
		// HANDLE: 可直接修改 ‘type’属性
		if (Inputs.supChangeType) {
			newField = elem;
			$elem.on("focus", function () {
				this.type = 'text';
			})
			.on("blur", function () {
				this.type = 'password';
			});
			
			if (elem.value === "") {
				elem.type = 'text';
			}
			
		// HANDLE: 不支持‘type’属性修改，创建一个隐藏的文本框来实现
		} else {
			newField = Inputs.createTextInput(elem);
		}
		
		elem.textChanged = true;	
		return newField;
	},
	
	addPlaceholder: function (elem, placeholderText) {
		var text = elem.getAttribute('placeholder'),
			$text = $(elem),
			placehodereElem;
		
		if (text !== placeholderText) {
			elem.setAttribute("placeholder", placeholderText);
		}
		function isPlaceholderVal(elem) {
			return (elem.value === elem.getAttribute("placeholder"));
		}
		function supportPlaceholder() {
			var i = doc.createElement('input');
			return 'placeholder' in i;
		}
		
		function createPlaceholderElem(elem) {
			var ret = doc.createElement('span');
			
			ret.className = "placeholder-content";
			ret.innerHTML = '<span class="placeholder-text" style="width:' + 
					(elem.offsetWidth || 200) + 'px;line-height:' + 
					(elem.offsetHeight || 28)+ 'px">' +
					(placeholderText || "") + '</span>';
			
			elem.parentNode.insertBefore(ret, elem);
			
			$(ret).on('click', function () {
				elem.focus();
			});
			
			return ret;
		}
		
		function showPlaceholder(node) {
			if (node.value === "") {
				if (node.placeholdered !== 'ok') {
					placehodereElem = createPlaceholderElem(elem);
					node.placeholdered = "ok";
				}
				$(placehodereElem).show();
			} else {
				$(placehodereElem).hide();
			}
		}
		
		// HANDLE: Not support placehoder 
		if (!supportPlaceholder()) {
			$text.on("click", function () {
				showPlaceholder(this);
			}).on("keyup", function () {
				showPlaceholder(this);
			}).on("focus", function () {
				showPlaceholder(this);
			});
			
			showPlaceholder(elem);
		
		// HANDLE: Support placehoder, But not change placeholder text color
		} else {
			$text.on("blur", function () {
				if (isPlaceholderVal(this)) {
					this.value = "";
				}
				if (this.value === "") {
					$(this).addClass("placeholder-text");
				}
			})
			.on("keyup", function () {
				if (this.value !== "") {
					$(this).removeClass("placeholder-text");
				}
			});
			
			if (elem.value === "") {
				$text.addClass("placeholder-text");
			}
		}
	}, 
	
	initInput: function (elem, placeholderText, capTip) {
		var $text,
			textElem;
		
		if (elem !== null) {
			textElem = elem;
		} else {
			return 0;
		}	
		
		//HANDLE: Input password, If add capital detect 
		if (elem.type === "password" && !elem.textChanged) {
			textElem = Inputs.toTextType(elem, capTip);
			
			if (capTip) {
				Inputs.addCapTip(textElem, elem);
			}
		
		//HANDLE: Input text, If add capital detect 
		} else if (elem.type === "text" && capTip) {
			Inputs.addCapTip(textElem);
		}
		$text = $(textElem);
		
		if (placeholderText) {
			Inputs.addPlaceholder(textElem, placeholderText);
		} else if (elem.getAttribute("placeholder")) {
			placeholderText = elem.getAttribute("placeholder");
			Inputs.addPlaceholder(textElem, placeholderText);
		}
		return textElem;
	},
	
	initPassword: function (elem, placeholderText, capTip, hide) {
		var inputVal = elem.value,
			$elem = $(elem);
		
		if (inputVal === "") {
			Inputs.initInput(elem, placeholderText, capTip);
		} else {
			if (hide) {
				$elem.on("keyup", function () {
					if (this.value === "") {
						Inputs.initInput(elem, placeholderText, capTip);
					}
				});
			} else {
				Inputs.initInput(elem, placeholderText, capTip);
			}
		}
	}
};

$.include({
	addPlaceholder: function (text) {
		return this.each(function () {
			Inputs.addPlaceholder(this, text);
		});
	},
	
	initPassword: function (text, capTip, hide) {
		return this.each(function () {
			Inputs.initPassword(this, text, capTip, hide);
		});
	},
	
	initInput: function (text, capTip) {
		return this.each(function () {
			Inputs.initInput(this, text, capTip);
		});
	},
	
	addCapTip: function (newField, pasElem) {
		return this.each(function () {
			Inputs.addCapTip(newField, pasElem);
		});
	},
	
	toTextType: function () {
		return this.each(function () {
			Inputs.toTextType(this);
		});
	}
});
})(window, document);
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
/*!
 * REasy UI Select
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function(document) {"use strict";
var Inputselect = {
	initSelected : false,
	count : 0,
	defaults : {
		"toggleEable":true,
		"editable":true,
		"size" : "",
		"seeAsTrans":false,
		"options" : [{"nothingthere":"nothingthere"}]
	},
	create : function(elem, obj) {
		var liContent = '',
			inputAble = '',
			toggleAble = '',
			inputClass,
			inputBoxStr,
			dropBtnStr,
			ulStr,
			inputSelStr,
			aVal,
			liVal,
			id,
			i,
			len,
			options,
			root,
			inputBox,
			firstOpt;
		obj = $.extend(Inputselect.defaults, obj);
		if(obj.size == 'small') {
			inputClass = 'span1';
		} else if (obj.size === 'large') {
			inputClass = 'span3';
		} else {
			inputClass = 'span2';
		}
		len = obj.options.length;
		
		for(i = 0; i < len; i++) {
			if((Inputselect.count === i) && obj.options[i]){
				if(len > 1) {
					if(Inputselect.count < len - 1) {
						Inputselect.count++;
					} else {
						Inputselect.count = 0;
					}
				}
				options = obj.options[i];
				for(id in options) {
					if (options.hasOwnProperty(id)) {
						if(options[id] ==='.divider' && id === '.divider') {
							liContent += '<li class="divider"></li>';
						} else {
							if(!firstOpt) {
								firstOpt = id;
							}
							liContent += '<li data-val="'+ id +'"><a>' + (options[id]|| id) + '</a></li>';
						}
					}
				}
				break;
			}
		}
		/*初始值转换成数组对象，第一个值为显示给用户的，第二个值为传给后台的*/
		if(!obj.initVal && obj.initVal !== "") {//未定义初始值（不是设为空）
			obj.initVal = firstOpt;
		}
		if(typeof obj.initVal === 'string') {
			obj.initVal = [obj.initVal,obj.initVal];
		}
		/*end of initVal handling*/
		if(obj.editable == 0) {//为了兼容0和false，请勿改成 '==='
			inputAble = "disabled";
		} else {
			inputAble = "";
		}
		if(obj.toggleEable == 0) {
			toggleAble = "disabled";
		} else {
			toggleAble = "";
		}
		inputBoxStr = '<input class="input-box ' + inputClass + '" type="text" ' + inputAble +' value="' + obj.initVal[0] + '">' + 
						'<input type="hidden" value="' + obj.initVal[1] + '">';
		dropBtnStr = '<div class="btn-group"><button type="button"' + toggleAble + ' class=" toggle btn btn-small"><span class="caret"></span></button></div>';
		ulStr = '<div class="input-select"><ul class="dropdown-menu">' + liContent + '</ul></div>';
		
		inputSelStr = inputBoxStr + dropBtnStr + ulStr;
		elem.innerHTML = inputSelStr;
		$(elem).addClass('input-append');
		
		var root = elem.getElementsByTagName('ul')[0],
			inputBox = elem.getElementsByTagName('input')[0],
			inputBoxHide = elem.getElementsByTagName('input')[1];
		
		$(root).on('mouseover', function(e) {
			var target=e.target || e.srcElement;
			
			if(target.tagName.toLowerCase() !== "a") {
				return;
			}
			liVal = target.parentElement.getAttribute('data-val');//隐藏的值
			aVal = target.innerText || target.textContent;//用户看到的值
			
		}).on('click', function(e) {
			var target=e.target||e.srcElement;
				
			if(target.tagName.toLowerCase() !== "a") {
				return;
			}
			//手动设定必须要传".hand-set":"***"
			if(liVal.trim() == ".hand-set" ) {
				inputBox.select();
				return;
			}
			if(obj.seeAsTrans == false){
				inputBox.value = liVal;
				inputBoxHide.value = liVal;
			} else {
				inputBox.value = aVal;
				inputBoxHide.value = liVal;
			}
			inputBox.focus();
		});
		
		$(inputBox).on('click', function() {
			inputBox.select();
			
		}).on('blur', function() {
			
		}).on('keyup', function() {
			inputBoxHide.value = inputBox.value;
		});
		
		if (!Inputselect.initSelected) {
			Inputselect.initSelected = true;
			$(document).on('click', function(e) {
				var target = e.target || e.srcElement,
					hasToggle,
					ulList,
					targetDis;
				
				if( $(target.parentNode).hasClass('toggle') ) {
					target = target.parentNode;
				}
				hasToggle = $(target).hasClass('toggle');
				if(hasToggle) {
					ulList =target.parentNode.parentNode.getElementsByTagName('ul')[0];
					targetDis = ulList.style.display;
				}
				$('.toggle').each(function() {
					this.parentNode.parentNode.getElementsByTagName('ul')[0].style.display = 'none';
				});
				
				if(hasToggle) {
					ulList.style.display = (targetDis === 'none' ||
							targetDis.trim() === '') ? 'block' : 'none';
				}
			});
		}
		
		return elem;
	},
	
	setValue: function (elem, val) {
		var inputBox = elem.getElementsByTagName('input')[0],
		    inputBoxHide = elem.getElementsByTagName('input')[1];
		if(typeof val === 'string') {
			inputBox.value = val;
			inputBoxHide.value = val;
		} else if(typeof val === 'object'){
			inputBoxHide.value = val[0];
			inputBox.value = val[1];
		}
		return elem;
	},
	
	getValue: function (elem) {
		var inputBoxHide = elem.getElementsByTagName('input')[1];
		return inputBoxHide.value;
	},
	
	append: function (elem, options) {
		var ulList = elem.getElementsByTagName('ul')[0],
			ulHtml = ulList.innerHTML,
			id,
			liContent = '';
		
		for(id in options) {
			if (options.hasOwnProperty(id)) {
			if(options[id] === '.divider') {
				liContent += '<li class="divider"></li>';
			}else {
				liContent += '<li data-val="'+ id +'"><a>' +
						(options[id] || id) + '</a></li>';
				}
			}
		}
		ulHtml += liContent;
		ulList.innerHTML = ulHtml;
	},
	
	remove: function (elem, idx) {
		var opts = elem.getElementsByTagName('li'),
			rmOpt;
		
		if(idx < opts.length) {
			rmOpt = opts[idx];
			rmOpt.parentNode.removeChild(rmOpt);
		} else {
			return "out of range!";
		}
	}
};

$.fn.toSelect = function (obj) {
	Inputselect.count = 0;
	return this.each(function() {
		Inputselect.create(this, obj);
		
		this.val = function(val) {
			if ($.type(val) !== 'undefined' ) {
						if (typeof val !== 'string' || typeof val !== 'object') {
						return false;
					}
					Inputselect.setValue(this, val);
				} else {
					return Inputselect.getValue(this);
			}
			
			return this;
		};
		
		this.appendLi = function(options) {
			if ($.type(options) === 'object') {
				Inputselect.append(this, options);
			}
			
			return this;
		};
		
		this.removeLi = function(idx) {
			idx = parseInt(idx, 10);
			if ($.type(idx) === 'number') {
				Inputselect.remove(this, idx);
			}
			return this;
		};
	});
};
})(document);
/*!
 * REasy UI Textboxs
 *
 * Depends:
 *	reasy-ui-core.js
 */

(function () {"use strict";
var Textboxs = {
	// type类型现在支持的有：“ip”，“ip-mini”，“mac”
	create: function (elem, type, defVal) {
		
		if (elem.toTextboxsed) {
			return elem;
		}
	
		var $elem = $(elem),
			len = 4,
			maxlength = 3,
			divide = '.',
			replaceRE = /[^0-9]/g,
			textboxs = [],
			htmlArr = [],
			classStr,
			i;
		
		defVal = defVal || '';
		type = type || 'ip';
		classStr = type === 'ip-mini' ? 'text input-mic-mini' : 'text input-mini-medium';
		elem.textboxsType = type;
		elem.defVal = defVal;
		
		if (type === 'mac') {
			len = 6;
			maxlength = 2;
			divide = ':';
			replaceRE = /[^0-9a-fA-F]/g;
			classStr = 'text input-mic-mini';
		}
		
		if ($.trim(elem.innerHTML) === '') {
			for (i = 0; i < len; i++) {
				if (i !== 0) {
					htmlArr[i] = '<input type="text" class="' + classStr + '"' + 
						' maxlength="' + maxlength + '">';
				} else {
					htmlArr[i] = '<input type="text" class="' + classStr + ' first"' + 
						' maxlength="' + maxlength + '">';
				}
				
			}
			elem.innerHTML = htmlArr.join(divide);
		}
		
		textboxs =  elem.getElementsByTagName('input');
		len = textboxs.length;
		
		for (i = 0; i < len; i++) {
			textboxs[i].index = i;
		}
		
		$(textboxs).on('focus', function () {
			var val = Textboxs.getValue(this.parentNode);
		
			if (val === '') {
				Textboxs.setValue(elem, defVal, true);
				
			// 如果是按回退而聚集的，光标定位到最后
			} else if (this.back === "back") {
				$.setCursorPos(this, this.value.length);
				this.back = "";
			}
			
		}).on('blur', function () {
			if (this.value > 255) {
				this.value = '255';
			}
			
		});
		
		$elem.on('keydown', function (e) {
			var elem = e.target || e.srcElement;
				
			elem.pos1 = +$.getCursorPos(elem);
			this.curIndex = elem.index;
			if (elem.value.length <= 0) {
				elem.emptyInput = true;
			} else {
				elem.emptyInput = false;
			}
		
		}).on('keyup', function (e){
			var elem = e.target || e.srcElement,
				myKeyCode  =  e.keyCode || e.which,
				skipNext = false,
				skipPrev = false,
				pos = +$.getCursorPos(elem),
				val = elem.value,
				replacedVal = val.replace(replaceRE, ''),
				ipReplacedVal = parseInt(replacedVal, 10).toString(),
				isIp = type.indexOf('ip') !== -1;
				
			// HACK: 由于把事件添加在input元素的父元素上，IE下按“Tab”键而跳转，
			// “keydown” 与 “keyup” 事件会在不同 “input”元素中触发。
			if (this.curIndex !== elem.index) {
				return false;
			}

			//处理与向前向后相关的特殊按键
			switch (myKeyCode) {
				case $.keyCode.LEFT:		//如果是左键
					skipPrev = (pos - elem.pos1) === 0;
					if (skipPrev && pos === 0 && elem.index  > 0) {
						textboxs[elem.index - 1].focus();
					}
					return true;
				
				case $.keyCode.RIGHT:		//如果是右键
					if (pos === val.length && elem.index  < (len -1)) {
						textboxs[elem.index + 1].focus();
						$.setCursorPos(textboxs[elem.index + 1], 0);
					}
					return true;
				
				case $.keyCode.BACKSPACE:	//如果是回退键
					if (elem.emptyInput && elem.value === "" && elem.index  > 0) {
						textboxs[elem.index - 1].focus();
						textboxs[elem.index - 1].back = "back";
					}
					return true;
				
				//没有 default
			}
			
			//如果有禁止输入的字符，去掉禁用字符
			if (val !== replacedVal) {
				elem.value = replacedVal;
			}
			
			//修正ip地址中类似‘012’为‘12’
			if (isIp && !isNaN(ipReplacedVal) &&
					ipReplacedVal !== val) {
					
				elem.value = ipReplacedVal;
			}
			
			//如果value不为空或不是最后一个文本框
			if(elem.index !== (len - 1) && elem.value.length > 0) {
				
				//达到最大长度，且光标在最后
				if (elem.value.length === maxlength && pos === maxlength) {
					skipNext = true;
					
				//如果是IP地址，如果输入小键盘“.”或英文字符‘.’则跳转到下一个输入框
				} else if (isIp && (myKeyCode === $.keyCode.NUMPAD_DECIMAL ||
						myKeyCode === $.keyCode.PERIOD)) {
					
					skipNext = true;
				}
			}
			
			//跳转到下一个文本框,并全选
			if (skipNext) {
				textboxs[elem.index + 1].focus();
				textboxs[elem.index + 1].select();
			}
		});
		
		elem.toTextboxsed = true;
		return elem;
	},
	
	setValue: function (elem, val, setDefault) {
		var textboxs =  elem.getElementsByTagName('input'),
			len = textboxs.length,
			textboxsValues,
			i;
		
		if (val !== '' && $.type(val) !== 'undefined') {
			textboxsValues = val.split('.');
			
			if (elem.textboxsType === 'mac') {
				textboxsValues = val.split(':');
			}
		} else {
			textboxsValues = ['', '',  '', '', '', ''];
		}

		for (i = 0; i < len; i++) {
			textboxs[i].value = textboxsValues[i];
		}
		
		// TODO: IE下聚焦隐藏的元素会报错
		try {
			if (elem.defVal && setDefault) {
				textboxs[i - 1].focus();
				$.setCursorPos(textboxs[i - 1], textboxs[i - 1].value.length);
			}
		} catch(e) {}
		
		return elem;
	},
	
	getValues: function (elem) {
		var valArr = [],
			textboxs,
			len,
			i;
		
		textboxs = elem.getElementsByTagName('input');
		len = textboxs.length;
		for (i = 0; i < len; i++) {
			valArr[i] = textboxs[i].value;
		}
		
		return valArr;
	},
		
	getValue: function (elem) {
		var	valArr = Textboxs.getValues(elem),
			divide = '.',
			emptyReg = /^[.:]{0,}$/,
			ret;
			
		if (elem.textboxsType === 'mac') {
			divide = ':';
		}
		ret = valArr.join(divide).toUpperCase();
		
		return emptyReg.test(ret) ? '' : ret;
	},
	
	disable: function (elem, disabled) {
		var textboxs =  $('input.text', elem),
			len = textboxs.length,
			i;
			
		for (i = 0; i < len; i++) {
			textboxs[i].disabled = disabled;
		}
		
		return elem;
	}
};

$.fn.toTextboxs = function (type, delVal) {
	return this.each(function() {
		Textboxs.create(this, type, delVal);
		$(this).addClass('textboxs');
		
		this.val = function (val) {
			if ($.type(val) !== 'undefined' ) {
				if (typeof val !== 'string') {
					return false;
				}
				Textboxs.setValue(this, val);
			} else {
				return Textboxs.getValue(this);
			}
			
		};
		
		this.disable = function (disabled) {
			Textboxs.disable(this, disabled);
		};
		this.toFocus = function () {
			this.getElementsByTagName('input')[0].focus();
		};
	});
};

})();

/*!
 * REasy UI Tip
 *
 * Depends:
 *	reasy-ui-core.js
 */
 
$.tipId = 0;
$.include({
	addTip: function (str) {
		var $this = this;
		
		function createTipElem(id, str, elem) {
			var tipElem = document.createElement('div'),
				tipId = "reasy-tip-" + id,
				span;

			tipElem.id = tipId;
			elem.tipId = tipId;
			tipElem.className = 'validatebox-tip';
			tipElem.innerHTML = '<span class="validatebox-tip-content">'+
					str + '</span>'+
					'<span class="validatebox-tip-pointer"></span>';
			
			return tipElem;
		}
		
		return this.each(function () {
			var tipElem,
				$tipElem ,
				tipContent,
				tipPointer,
				marginTop;
			
			tipElem = createTipElem($.tipId++, str, this);
			$tipElem = $(tipElem);
            $('body').append(tipElem);
            tipContent = $tipElem.find(".validatebox-tip-content")[0];
            tipPointer = $tipElem.find(".validatebox-tip-pointer")[0];
            marginTop = (tipContent.offsetHeight - tipPointer.offsetHeight) / 2;
            $tipElem.css("visibility", "visible");
            $tipElem.css({
                'top': $(this).offset().top + 'px',
                'left': ($(this).offset().left + this.offsetWidth) +'px'
            });
		});
	},
	
	showTip: function () {
		return this.each(function() {
			$("#" + this.tipId).css("visibility", "visible");
		});
	},
	
	hideTip: function () {
		return this.each(function() {
			$("#" + this.tipId).css("visibility", "hidden");
		});
	},
	
	removeTip: function (valid) {
		return this.each(function() {
			var $tipElem = $("#" + this.tipId);
			
			if (!$tipElem[0]) {
				return;
			}

			$tipElem.remove();
			this.tipId = '';
		});
	}
});
/*!
$.extend($.reasyui.b28n, {
  "Must be number": "请输入数字",
  "Input range is: %s - %s": "输入范围：%s - %s",
  "this field is required": "本项不能为空",
  "String length range is: %s - %s bit": "长度范围：%s - %s 位",
  "Please input a validity IP address": "请输入正确的 IP 地址",
  "Please input a validity subnet mask": "请输入正确的子网掩码",
  "Please input a validity MAC address": "请输入正确的 MAC 地址",
  "Mac can not be 00:00:00:00:00:00": "Mac 地址不能全为0",
  "Must be ASCII.": "请输入非中文字符",
  "Can't input: '%s'": "不能输入: ‘%s’",
  "Must be numbers, letters or an underscore": "请输入数字，字母或下划线",
  "The second character must be even number.": "MAC 地址的第二个字符必须为偶数",
  "IP address can't be multicast, broadcast or loopback address.": "IP 地址不能为组播,广播或环回地址",
  "IP address first input don't be 127, becuse it is loopback address.": "以127开始的地址为保留的环回地址，请指定一个1到223之间的值。",
  "First input %s greater than 223.": "以%s开始的地址无效，请指定一个1到223之间的值。",
  "First input %s less than 223.": "以 %s 开始的地址无效，请指定一个223到255之间的值。"
});