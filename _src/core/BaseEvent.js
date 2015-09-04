function BaseEvent() {
	this.userAgent = window.navigator.userAgent.toLowerCase();
}

BaseEvent.prototype = {
	getBrowser: function() {
		var me = this;
		var browser;
		var chromeReg = /chrome/g;
		var firefoxReg = /firefox/g;
		var ieReg = /windows nt/g;
		if(chromeReg.test(me.userAgent)) {
			browser = "chrome";
		} else if (firefoxReg.test(me.userAgent)) {
			browser = "firefox";
		} else if (ieReg.test(me.userAgent)) {
			browser = "ie";
		}
		return browser;
	}
}

var baseEventObj = new BaseEvent();
var browser = baseEventObj.getBrowser();