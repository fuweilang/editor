function Font() {
	this.$myEditor = $("#myEditor");
	this.$btnFontsize = $("#btnFontsizeSelect");

	// 文字颜色按钮标签
	this.$btnFontcolorIcon = $("#btnFontcolorIcon");
	this.$fontcolorDownArrow = $("#fontcolorDownArrow");
	this.$fontColorpicker = $("#fontColorpicker");
	this.colorBtn = this.$fontColorpicker.find("span");

	// 背景色颜色按钮标签
	this.$btnBgcolorIcon = $("#btnBgcolorIcon");
	this.$bgcolorDownArrow = $("#bgcolorDownArrow");
	this.$bgColorpicker = $("#bgColorpicker");
	this.bgColorBtn = this.$bgColorpicker.find("span");

	this.doc = $(document);
	this.selection = window.getSelection();
}

Font.prototype = {
	init: function() {
		var me = this;

		/*
		 * 文字大小下拉框点击事件
		 */
		me.$btnFontsize.on("change", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var fontsize = $(this).val();
			me.setFontSizeFn("FontSize", false, fontsize);
		})

		/*
		 * 设置文字颜色的所有事件
		 */
		// 给字体颜色选择器中的按钮添加背景色
		$.each(me.colorBtn, function(i) {
			var color = $(me.colorBtn[i]).attr("value");
			$(me.colorBtn[i]).css({
				"background": color
			})
		})
		// 点击字体颜色按钮，给选中字体加颜色
		me.$btnFontcolorIcon.on("mousedown", function(e) {
			e.preventDefault();
			var color = $(this).attr("value");
			me.setForeColorFn("forecolor", false, color);
		})
		// 点击字体颜色按钮右边的下拉图标，显示颜色选择器
		me.$fontcolorDownArrow.on("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			me.$fontColorpicker.css({
				"display": "block"
			})
		})
		// 点击颜色选择器里的各个颜色图片，给选中的文字加字体颜色
		me.colorBtn.on("mousedown", function(e){
			e.preventDefault();
			var color = $(this).attr("value");
			me.setForeColorFn("forecolor", false, color);
			me.$btnFontcolorIcon.attr("value", color);
			me.$btnFontcolorIcon.css({
				"background": color
			})
			me.$fontColorpicker.css({
				"display": "none"
			})
		})

		/*
		 * 设置文字背景色的所有事件
		 */
		// 给背景色选择按钮添加背景色
		$.each(me.bgColorBtn, function(i) {
			var color = $(me.bgColorBtn[i]).attr("value");
			$(me.bgColorBtn[i]).css({
				"background": color
			})
		})
		// 点击背景色小按钮，给选中的文字添加背景色
		me.$btnBgcolorIcon.on("mousedown", function(e) {
			e.preventDefault();
			var color = $(this).attr("value");
			me.changeBgColorFn("BackColor", false, color);
		})
		// 点击背景颜色按钮右边的下拉图标，显示颜色选择器
		me.$bgcolorDownArrow.on("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			me.$bgColorpicker.css({
				"display": "block"
			})
		})
		// 点击颜色选择器里的小图片，给指定的文字添加背景色
		me.bgColorBtn.on("mousedown", function(e){
			e.preventDefault();
			var color = $(this).attr("value");
			me.changeBgColorFn("BackColor", false, color);
			me.$btnBgcolorIcon.attr("value", color)
			me.$btnBgcolorIcon.css({
				"background": color
			})
			me.$bgColorpicker.css({
				"display": "none"
			})
		})

		/*
		 * 点击document，颜色选择器隐藏
		 */
		me.doc.on("mousedown", function() {
			me.$fontColorpicker.css({
				"display": "none"
			})
			me.$bgColorpicker.css({
				"display": "none"
			})
		})
	},

	/*
	 * 设置文字大小
	 * execcommand实现添加font并设置size和属性，此方法将font标签装换为span，并改设为style的font-size
	 * cmdName, bool, value对应execCommand的三个参数
	 * 兼容chrome, firefox, IE9以上浏览器
	 */
	setFontSizeFn: function(cmdName, bool, value) {
		var me = this;

		// 执行execCommand命令，但得到的标签是font，属性是size
		if(browser == "ie") {
			document.execCommand(cmdName, bool, "1");
		} else {
			document.execCommand(cmdName, bool, value);
		}

		// 查找myEditor里面的font，将font替换成span，并加上属性style里的font-size
		var fontlist = me.$myEditor.find("font");
		var spanNode = [];
		if(fontlist.length > 0) {
			fontlist.each(function(i, dom) {
				var innerSpanlist = $(dom).find("span");
				if(innerSpanlist.length > 0) {
					innerSpanlist.each(function(index, innerDom) {
						innerDom.style.fontSize = "";
						var getStyle = innerDom.getAttribute("style");
						if(getStyle != null && getStyle.toString() == "") {
							innerDom.removeAttribute("style");
						}
					})
				}

				// 创建一个span替代font
				spanNode[i] = document.createElement("span");
				spanNode[i].innerHTML = dom.innerHTML;
				spanNode[i].style.fontSize = value;
				dom.parentNode.replaceChild(spanNode[i], dom);
			})

			// 每次操作完，把焦点又放在被选中的文本区域
			selectionObj.addRangeFn(spanNode);
		} else {
			return;
		}

		// 操作完设置文字大小后，遍历myEditor里所有的span，把空span和没有属性的span删除
		me.deleteEmptySpan();
	},

	/*
	 * 设置文字颜色
	 * execcommand实现添加font并设置color属性，此方法将font标签装换为span，并改设为style的color
	 * cmdName, bool, value对应execcommand的三个参数
	 */
	setForeColorFn: function(cmdName, bool, value) {
		var me = this;

		// 执行execCommand命令，但得到的标签是font，属性是color
		document.execCommand(cmdName, bool, value);

		// 查找myEditor里面的font，将font替换成span，并加上属性style里的color
		var fontlist = me.$myEditor.find("font");
		var spanNode = [];
		if(fontlist.length > 0) {
			fontlist.each(function(i, dom) {
				spanNode[i] = document.createElement("span");
				spanNode[i].innerHTML = dom.innerHTML;
				spanNode[i].style.color = value;
				dom.parentNode.replaceChild(spanNode[i], dom);
			})
			// 每次操作完，把焦点又放在被选中的文本区域
			selectionObj.addRangeFn(spanNode);
		} else {
			return;
		}

		// 操作完设置文字颜色后，遍历myEditor里所有的span，把空span和没有属性的span删除
		me.deleteEmptySpan();
	},

	/*
	 * 设置背景色
	 * execcommand实现添加span并设置属性background-color:rgb(255, 0, 0); 
	 * cmdName, bool, value对应execcommand的三个参数
	 * 注：execcomand在IE下改变文本背景色，添加的标签是font，IE下属性编译出来是background-color: rgb(255, 0, 255)
	 */
	changeBgColorFn: function(cmdName, bool, value) {
		var me = this;

		// 执行execCommand命令，得到的标签是span，属性style="background: rgb(255, 0, 0);"
		document.execCommand(cmdName, bool, value);

		if(browser == "ie") {
			// 查找myEditor里所有的font，将其转换为span
			var fontlist = me.$myEditor.find("font");
			var spanNode = [];
			if(fontlist.length > 0) {
				fontlist.each(function(i, dom) {
					spanNode[i] = document.createElement("span");
					spanNode[i].innerHTML = dom.innerHTML;
					var getAttr = $(fontlist[i]).attr("style");
					$(spanNode[i]).attr("style", getAttr);
					dom.parentNode.replaceChild(spanNode[i], dom);
				})
				// 每次操作完，把焦点又放在被选中的文本区域
				selectionObj.addRangeFn(spanNode);
			} else {
				return;
			}
		}

		// 操作完设置文字背景颜色后，遍历myEditor里所有的span，把空span和没有属性的span删除
		me.deleteEmptySpan();
	},

	/*
	 * 每次操作完设置文字大小，修改文字颜色，修改背景颜色，遍历myEditor里所有的span，把空span和没有属性的span删除
	 */
	deleteEmptySpan: function() {
		var me = this;
		var spanlist = me.$myEditor.find("span");
		if(spanlist.length > 0) {
			spanlist.each(function(index, dom) {
				if(dom.innerText == "") {
					dom.parentNode.removeChild(dom);
				}
			})
			for (var i = spanlist.length - 1; i >= 0; i--) {
				var reg = /^<span>.*<\/span>/g;
				if(reg.test(spanlist[i].outerHTML)) {
					var newRange = document.createRange();
					var getText = spanlist[i].innerHTML;
					var documentFragment = newRange.createContextualFragment(getText);
					newRange.selectNode(spanlist[i]);
					newRange.deleteContents();
					newRange.insertNode(documentFragment);
				}
			};
		} else {
			return;
		}
	},
}

var selectionObj = new Selection();
var fontObj = new Font();
fontObj.init();


