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