function JudgeState() {
	this.$btnBold = $("#btnBold");
	this.$btnItalic = $("#btnItalic");
	this.$btnUnderline = $("#btnUnderline");

	this.$btnFontsize = $("#btnFontsizeSelect");
	this.$fontsizeOption = this.$btnFontsize.find("option");
	this.$myEditor = $("#myEditor");

	this.$btnFontcolorIcon = $("#btnFontcolorIcon");
	this.$btnBgcolorIcon = $("#btnBgcolorIcon");
}


JudgeState.prototype = {
	init: function() {
		var me = this;
		var selection = window.getSelection();

		me.$myEditor.on("click", function() {
			var range;
			var startNode;
			if(selection.rangeCount > 0) {
				range = selection.getRangeAt(0);
			}

			if(range != undefined && range != null) {
				if(range.startContainer.parentNode.tagName != "DIV") {
					startNode = $(range.startContainer).parents("span");
				}
			}

			// 判断加粗自动识别
			me.JudgeBold();

			// 判断斜体自动识别
			me.JudgeItalic();

			// 判断下划线自动识别状态
			me.JudgeUnderline(range);

			// 自动识别字体大小，并改变字体大小下拉选择框的值
			me.JudgeFontSize(startNode);

			// 字体颜色按钮自动识别并添加背景色
			me.JudgeForeColor(startNode);

			// 文本背景色按钮自动识别并添加背景色
			me.JudgeBgColor(startNode);
		})
	},

	/*
	 * 判断加粗自动识别
	 * 兼容IE9,chrome,firefox
	 */
	JudgeBold: function() {
		var me = this;
		var getBoldState = document.queryCommandState("bold");
		if(getBoldState == true) {
			me.$btnBold.addClass("edi-btn-sel");
		} else {
			me.$btnBold.removeClass("edi-btn-sel");
		}
	},

	/*
	 * 判断斜体自动识别
	 * 兼容IE9,chrome,firefox
	 */
	JudgeItalic: function() {
		var me = this;
		var getIState = document.queryCommandState("italic");
		if(getIState == true) {
			me.$btnItalic.addClass("edi-btn-sel");
		} else {
			me.$btnItalic.removeClass("edi-btn-sel");
		}
	},

	/*
	 * 判断下划线自动识别
	 * [param] range：当前range
	 * 兼容IE9,chrome,firefox
	 */
	JudgeUnderline: function(range) {
		var me = this;
		var getUnderlineState = document.queryCommandState("underline");
		if(browser == "chrome") {
			if(range.startContainer.parentNode.tagName == "U") {
				me.$btnUnderline.addClass("edi-btn-sel");
			} else {
				me.$btnUnderline.removeClass("edi-btn-sel");
			}
		} else {
			if(getUnderlineState == true) {
				me.$btnUnderline.addClass("edi-btn-sel");
			} else {
				me.$btnUnderline.removeClass("edi-btn-sel");
			}
		}
	},

	/*
	 * 自动识别字体大小，并改变字体大小下拉选择框的值
	 * [param] startNode是父级span的所有集合
	 * 兼容IE9,chrome,firefox
	 */
	JudgeFontSize: function(startNode) {
		var me = this;
		var showedFontSize = null;
		var fontSize;
		if(startNode != null && startNode.length > 0) {
			startNode.each(function(index, dom){
				fontSize = dom.style.fontSize;
				if(!showedFontSize) {
					showedFontSize = fontSize;
				}
			});
			if(showedFontSize == "" || showedFontSize == null) {
				me.$fontsizeOption.prop('selected', false).eq(1).prop('selected', true);
			} else {
				me.$fontsizeOption.each(function(index, dom){
					dom.selected = dom.value === showedFontSize;
				})
			}
		} else {
			me.$fontsizeOption.prop('selected', false).eq(1).prop('selected', true);
		}
	},

	/*
	 * 字体颜色按钮自动识别并添加背景色
	 * [param] startNode是父级span的所有集合
	 * 兼容IE9,chrome,firefox
	 */
	JudgeForeColor: function(startNode) {
		var me = this;
		if(browser == "ie") {
			var color;
			var showColor = null;
			if(startNode != null && startNode.length > 0) {
				startNode.each(function(index, dom) {
					color = dom.style.color;
					if(!showColor) {
						showColor = color;
					}
				})
				if(!showColor) {
					me.$btnFontcolorIcon.attr("value", "#000000");
					me.$btnFontcolorIcon.css({
						"background": "#000000"
					})
				} else {
					me.$btnFontcolorIcon.attr("value", showColor);
					me.$btnFontcolorIcon.css({
						"background": showColor
					})
				} 
			} else {
				me.$btnFontcolorIcon.attr("value", "#000000");
				me.$btnFontcolorIcon.css({
					"background": "#000000"
				})
			}
		} else {
			// chrome和火狐编译出来的字体颜色是style="color: rgb(255,0,0)"
			var foreColorValue = document.queryCommandValue("forecolor");
			me.$btnFontcolorIcon.attr("value", foreColorValue);
			me.$btnFontcolorIcon.css({
				"background": foreColorValue
			})
		}
	},

	/*
	 * 文本背景色按钮自动识别并添加背景色
	 * [param] startNode是span父级的所有集合
	 * 兼容IE9,chrome,firefox
	 */
	JudgeBgColor: function(startNode) {
		var me = this;
		if(browser == "firefox" || browser == "ie") {
			var bgcolor;
			var showBgcolor = null;
			if(startNode != null && startNode.length > 0) {
				startNode.each(function(index, dom) {
					bgcolor = dom.style.backgroundColor;
					if(!showBgcolor) {
						showBgcolor = bgcolor;
					}
				})
				if(!showBgcolor) {
					me.$btnBgcolorIcon.attr("value", "#ffffff");
					me.$btnBgcolorIcon.css({
						"background": "#ffffff"
					})
				} else {
					me.$btnBgcolorIcon.attr("value", showBgcolor);
					me.$btnBgcolorIcon.css({
						"background": showBgcolor
					})
				}
			} else {
				me.$btnBgcolorIcon.attr("value", "#ffffff");
				me.$btnBgcolorIcon.css({
					"background": "#ffffff"
				})
			}
		} else {
			// chrome编译出来的文本背景颜色是style="color: rgb(255,0,0)"
			var bgColorValue = document.queryCommandValue("backcolor");
			me.$btnBgcolorIcon.attr("value", bgColorValue);
			me.$btnBgcolorIcon.css({
				"background": bgColorValue
			})
		}
	}
}

var JudgeStateObj = new JudgeState();
JudgeStateObj.init();