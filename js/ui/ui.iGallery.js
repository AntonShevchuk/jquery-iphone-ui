/**
 * Create image/content gallery
 *
 * @author Anton Shevchuk (http://anton.shevchuk.name)
 * @copyright (c) 2009 jQuery iPhone UI (http://iphone.hohli.com)
 * @license   Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 * 
 * @version 0.3
 */
(function($){
    $.widget('ui.iGallery', {
        _init: function() {
            var _self = this;
            var $this = this.element;
            
			$this.addClass('iphoneui')
			     .addClass('igalleryui');
			
			// FIXME: need refactoring - wrapInner - it's bad
            $this.wrapInner('<div class="frame"></div>');
            if ($('#icursorw').length == 0)
                $('body').append('<div id="icursorw"></div>');
            
            this.frame = $this.find('.frame');
            this.cursor = $('#icursorw');
            this.elementMargin = $this.position().left;
            
            // 20px - it's margin between slides
            var length = 0;
            var space  = this.space = 20;
            var width  = this.width = $this.width();
            
            // filter
            this.frame.children('br,hr').remove();
            
            // each image pack to div 
            this.frame.children().each(function(){
                length++;
                $(this).wrap('<div class="slide"></div>');
                $(this).css({width:width});
            });
            
            this.oldX = 0;
            this.newX = 0;
            this.move = false;
            this.click = false;
            
            this.maxMargin = 0;
            this.minMargin = - ((width+space)*(length - 1)+space*2);
            this.marginLeft = -space;
            
            // set container width
            this.frame.css({
                width:      (width+space)*length+space,
                marginLeft: this.marginLeft
            });
            
			// simple mouse gestures
            this.frame.mousedown(function(event) {
    		    _self.frame.stop(true, true);
    		    _self.oldX = event.pageX;
                _self.move = true;
                
                // check it's click or d'n'd
                _self.click = true;
                setTimeout(function(){
                    _self.click = false;
                }, 200);
                
    		    event.stopPropagation();
    		    event.preventDefault();
            });
            
			// click on image
            this.element.click(function(event) {
                if (_self.click) {
                    
        		    var x = event.pageX - (width + _self.elementMargin);
        		    console.log(event.pageX, event.clientX, document.body.scrollLeft);
        		    if (0 < x && x < (width/2)) {
                        _self._prev();
        		    } else {
                        _self._next();
        		    }
                    
        		    event.stopPropagation();
        		    event.preventDefault();
                }
            });
            
            // mousewheel
            if (typeof $.fn.mousewheel == 'function') {
			    // scroll by mousewheel
			    this.element.mousewheel(function (event, direction) {
			         if ( direction < 0 ) {
			             _self._next();
			         } else {
			             _self._prev();
			         }
        		     event.stopPropagation();
        		     event.preventDefault();
			    });
			}
            
			// custom cursor
            this.element.mouseover(function(event) {
                _self.cursor.show();
                return true;
            });
            this.element.mousemove(function(event) {
                _self.cursor.css({
                    top:event.pageY,
                    left:event.pageX,
                });
                return true;
            });
            this.element.mouseout(function(event) {
                _self.cursor.hide();
                return true;
            });
			
            // document events
            $(document).mouseup(function(event){
                if (_self.move) {
                    _self.move = false;
                    var el = Math.round(_self.marginLeft/(width+space));
                    _self.marginLeft = el * (width+space) - space;
                    _self._scroll();
                }
                return true;
            });
            $(document).mousemove(function(event){
                if (_self.move && _self.oldX != 0) {
                    _self.newX = event.pageX;
                    
                    var diff = _self.marginLeft + (_self.newX - _self.oldX);                    
                    if (diff >= _self.minMargin && diff <= _self.maxMargin) {
                        _self.marginLeft = _self.marginLeft + (_self.newX - _self.oldX);
                        _self._scroll();
                    }
                    _self.oldX = _self.newX;
                }
                if ($.browser.msie) {
                    document.Show.MouseX.value = event.pageX;
                    document.Show.MouseY.value = event.pageY;
                }
                return true;
            });
        },
        _scroll: function() {
            this.frame.stop(true,true);
            this.frame.animate({'marginLeft':this.marginLeft});
        },
        _next: function() {
            if (this.minMargin < this.marginLeft - (this.width+this.space)) {
                var el = Math.round(this.marginLeft/(this.width+this.space));
                this.marginLeft = (el-1) * (this.width+this.space) - this.space;
                this._scroll();
            } else {
                this.frame.animate({'marginLeft':this.marginLeft-20})
                          .animate({'marginLeft':this.marginLeft});
            }
        },
        _prev: function() {
            if (this.maxMargin > this.marginLeft + (this.width+this.space)) {
                var el = Math.round(this.marginLeft/(this.width+this.space));
                this.marginLeft = (el+1) * (this.width+this.space) - this.space;
                this._scroll();
            } else {
                this.frame.animate({'marginLeft':this.marginLeft+20})
                          .animate({'marginLeft':this.marginLeft});
            }
        }
        
    });    
})(jQuery);