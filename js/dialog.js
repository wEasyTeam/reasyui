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
