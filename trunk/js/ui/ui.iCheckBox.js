/**
 * Replace checkbox form element
 *
 * @author Anton Shevchuk (http://anton.shevchuk.name)
 * @copyright (c) 2009 jQuery iPhone UI (http://iphone.hohli.com)
 * @license   Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 * 
 * @version 0.1
 */
(function($){
    $.widget('ui.iCheckBox', {
         _init: function(){
             var _self = this;
             this.visualElement = $('<div>&nbsp;</div>').addClass('iphoneui')
					 						   .addClass('icheckboxui')
                                               .bind('mouseenter.iCheckBox', function(){
                                                    $(this).addClass("active");
                                               })
                                               .bind('mouseleave.iCheckBox', function(){
                                                    $(this).removeClass("active");
                                               })
                                               .bind('click.iCheckBox', function(e){
                                				   if (typeof $.fx.step.backgroundPosition == 'function') {
                                                       if (_self.element.is(':checked')) {
                                                           $(this).css({backgroundPosition:'0% 100%'}); // need for opera
                                                           $(this).animate({backgroundPosition:'(100% 100%)'},
                                                                           300,
                                                                           function(){
                                                                               $(this).css({backgroundPosition:'100% 0%'});
                                                                           });
                                                       } else {
                                                           $(this).css({backgroundPosition:'100% 100%'}); // need for opera
                                                           $(this).animate({backgroundPosition:'(0% 100%)'},
                                                                           300,
                                                                           function(){
                                                                               $(this).css({backgroundPosition:'0% 0%'});
                                                                           });
                                                       }
                                				   } else {
                                				       $(this).toggleClass("off");
                                				   }
                                				                                   					
                                				   _self.element.click();
                                				   return false;
                                			   });
             if (!this.element.is(':checked')) {
                 this.visualElement.addClass('off');
             }
			 
			 if ($('label[for='+this.element.attr('id')+']').length > 0) {
			 	 $('label[for='+this.element.attr('id')+']').addClass('ilabelui');
			 } 
			 
			 this.element.before(this.visualElement);
			 this.element.hide();
         }
        
    });
})(jQuery);