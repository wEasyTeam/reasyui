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