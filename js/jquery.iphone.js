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
	 * Load all widgets
	 */
	loadWidgets:function()
	{
		
	}
}

jQuery(document).ready(function(){
	iPhoneUI.initWidgets();
});