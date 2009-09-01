iPhoneUI = {
	widgets:[
		// form widgets
		'iInput',
		'iPassword',
		'iCheckBox',
		'iRadioButton',
		'iSelect',
		
		// navigation widgets
		'iMenu',
		'iScroll', // should be loaded after build iMenu and before hide any elements by iTabs
		'iTabs',
		
		// other widgets
		'iGallery'
	],
	/**
	 * Try to initialize all loaded widgets
	 */
	initWidgets:function()
	{
		for (var i = 0, size = iPhoneUI.widgets.length; i < size; i++) {
			var widget   = iPhoneUI.widgets[i];
			var selector = widget.toLowerCase();
			
			if (typeof jQuery.fn[widget] == 'function') {
				var el = jQuery('.'+selector)[widget]();
				//console.log(selector);
			}
		}
	},
	/**
	 * Load all widgets from homepage
	 */
	loadWidgets:function()
	{
		for (var i = 0, size = iPhoneUI.widgets.length; i < size; i++) {
			$.getScript("http://iphone.hohli.com/js/ui/ui."+iPhoneUI.widgets[i]+".js");
		}
	},
	/**
	 * Bind touch events
	 */
	initTouchEvents:function()
	{
		document.addEventListener("touchstart",  iPhoneUI.touchHandler, true);
	    document.addEventListener("touchmove",   iPhoneUI.touchHandler, true);
	    document.addEventListener("touchend",    iPhoneUI.touchHandler, true);
	    document.addEventListener("touchcancel", iPhoneUI.touchHandler, true); 
	},
	/**
	 * Touch events handler
	 */
	touchHandler:function(event)
	{
	    var touches = event.changedTouches,
	        first = touches[0],
	        type = "";
    
	    switch(event.type)
	    {
	        case "touchstart": type = "mousedown"; break;
	        case "touchmove":  type = "mousemove"; break;        
	        case "touchend":   type = "mouseup";   break;
	        default: return;
	    }
	        
	    //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
	    //           screenX, screenY, clientX, clientY, ctrlKey, 
	    //           altKey, shiftKey, metaKey, button, relatedTarget);
	    
	    var simulatedEvent = document.createEvent("MouseEvent");
	    	simulatedEvent.initMouseEvent(type, true, true, window, 1, 
			                              first.screenX, first.screenY, 
			                              first.clientX, first.clientY, false, 
			                              false, false, false, 0/*left*/, null);
	                                                                            
	    first.target.dispatchEvent(simulatedEvent);
	    //event.preventDefault();
	}
}

jQuery(document).ready(function(){
	iPhoneUI.initWidgets();
	if ($.browser.safari) {
		iPhoneUI.initTouchEvents();
	}
});