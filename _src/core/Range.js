function Range() {

}

Range.prototype = {
	// 获取选中文本
	getSelectText: function() {
		if(window.getSelection) {
			// 兼容谷歌，火狐，IE9以上浏览器
			selectText = window.getSelection().toString();
		} else {
			// 兼容IE8
			selectText = document.selection.createRange().text;
		}
		return selectText;
	},

	// 获取选中HTML片段，包括DOM节点和文本
	getSelectHtml: function() {
		var selectedHtml, selectionObj, rangeObj;
		if(window.getSelection) {
			// 兼容谷歌，火狐，IE9以上浏览器
			selectionObj = window.getSelection();
			rangeObj = selectionObj.getRangeAt(0);
			var docFragment = rangeObj.cloneContents();
			var tempDiv = document.createElement("div");
			tempDiv.appendChild(docFragment);
			selectedHtml = tempDiv.innerHTML;
		} else if(document.selection) {
			// 兼容IE8
			selectionObj = document.selection;
			rangeObj = selectionObj.createRange();
			selectedHtml = rangeObj.htmlText;
		}
		return selectedHtml;
	},

	// 获取第0个range
	getRange: function() {
		var selectionObj, rangeObj;
		if(window.getSelection) {
			// 兼容谷歌，火狐，IE9以上浏览器
			selectionObj = window.getSelection();
			rangeObj = selectionObj.getRangeAt(0);
		} else if(document.selection) {
			// IE8浏览器
			selectionObj = document.selection;
			rangeObj = selectionObj.createRange();
		}
		return rangeObj;
	}
}
