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