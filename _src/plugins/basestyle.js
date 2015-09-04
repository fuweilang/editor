function Basestyle() {
	this.$btnBold = $("#btnBold");
	this.$btnItalic = $("#btnItalic");
	this.$btnUnderline = $("#btnUnderline");
	this.$justifyleft = $("#justifyleft");
	this.$justifycenter = $("#justifycenter");
	this.$justifyright = $("#justifyright");
	this.$myEditor = $("#myEditor");

	this.selection = window.getSelection();
}


Basestyle.prototype = {
	init: function() {
		var me = this;

		// 点击文字加粗按钮
		me.$btnBold.on("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			me.mousedownFn("bold");
		})

		// 点击斜体按钮
		me.$btnItalic.on("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			me.mousedownFn("italic");
		})

		// 点击下划线按钮
		me.$btnUnderline.on("mousedown", function(e){
			e.preventDefault();
			e.stopPropagation();
			me.mousedownFn("underline");
		})

		// 点击文本居左按钮
		me.$justifyleft.on("click", function() {
			me.$myEditor.css({
				"text-align": "left"
			})
		})

		// 点击文本居中按钮
		me.$justifycenter.on("mousedown", function() {
			me.$myEditor.css({
				"text-align": "center"
			})
		})

		// 点击文本居右按钮
		me.$justifyright.on("mousedown", function() {
			me.$myEditor.css({
				"text-align": "right"
			})
		})
	},

	mousedownFn: function(cmdName) {
		var me = this;
		cmdName = cmdName.toLowerCase();
		document.execCommand(cmdName, false, null);

		var range;
		var startNode;
		if(me.selection.rangeCount > 0) {
			range = me.selection.getRangeAt(0);
		} else {
			return;
		}

		if(range != undefined && range != null) {

			// 在IE下bold和italic的操作
			if(browser == "ie") {
				if(cmdName == "bold" || cmdName == "italic") {
					me.ieSetboldAndItalic(cmdName);
				}
			}

			// 判断加粗自动识别
			JudgeStateObj.JudgeBold();

			// 判断斜体自动识别
			JudgeStateObj.JudgeItalic();

			// 判断下划线自动识别状态
			JudgeStateObj.JudgeUnderline(range);
		}
	},

	/*
	 * IE加粗生成的是strong，斜体生成的是em
	 * IE下将strong转化为b，em转化为i
	 * cmdName：execCommand第一个参数
	 */
	ieSetboldAndItalic: function(cmdName) {
		var me = this;
		var oldtag, newtag;
		if(cmdName == "bold") {
			oldtag = "strong";
			newtag = "b";
		} else if(cmdName == "italic") {
			oldtag = "em";
			newtag = "i";
		}

		var getState = document.queryCommandState(cmdName);
		var oldNodelist = me.$myEditor.find(oldtag);
		var newNode = [];
		oldNodelist.each(function(index, dom){
			if(dom.innerText.length == 0) {
				$(dom).remove();
			} else {
				newNode[index] = document.createElement(newtag);
				newNode[index].innerHTML = dom.innerHTML;
				dom.parentNode.replaceChild(newNode[index], dom);
			}
		})
		// 渲染完后，让被选中的文本盖上一层灰色，让它变为被选中状态
		if(getState == true) {
			// 执行正常字体变为加粗或斜体
			selectionObj.addRangeFn(newNode);
		} else {
			// 执行加粗或斜体变为正常字体
			var newRange = me.selection.getRangeAt(0);
			newRange.setStartAfter(newNode[0]);
			me.selection.removeAllRanges();
			me.selection.addRange(newRange);
		}
	}
}

var selectionObj = new Selection();
var JudgeStateObj = new JudgeState();
var basestyleObj = new Basestyle();
basestyleObj.init();



