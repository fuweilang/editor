function Selection() {
	this.selectionObj = window.getSelection();
}

Selection.prototype = {
	// 创建一个selection对象
	getSelection: function() {
		var selectionObj;
		if(window.getSelection) {
			// 兼容谷歌，火狐，IE9以上浏览器
			selectionObj = window.getSelection();
		} else {
			// IE8浏览器
			selectionObj = document.selection();
		}
		return selectionObj;
	},

	/*
	 * selection的addRange方法，用来渲染效果完后使得选中的文本还被灰色覆盖
	 * 参数newNode：要替换的新DOM节点数组，一般是span
	 */
	addRangeFn: function(newNode){
		var me = this;
		var newRange = document.createRange();
		var endOffset = newNode[newNode.length-1].childNodes.length;
		newRange.setStart(newNode[0], 0);
		newRange.setEnd(newNode[newNode.length-1], endOffset);
		me.selectionObj.removeAllRanges();
		me.selectionObj.addRange(newRange);
	}
}