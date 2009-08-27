/**
 * Replace select form element
 *
 * @author Anton Shevchuk (http://anton.shevchuk.name)
 * @copyright (c) 2009 jQuery iPhone UI (http://iphone.hohli.com)
 * @license  Dual licensed under the MIT and GPL licenses (http://docs.jquery.com/License)
 * 
 * @version 0.1
 */
(function($){
    $.widget('ui.iSelect', {
        _init: function(){
            var _self = this;
            
            this.width     = this.element.width() + 
                             parseInt(this.element.css("borderLeftWidth")) + 
                             parseInt(this.element.css("borderRightWidth"));
        	 
            this.iselect   = this.element.wrap('<div class="iselectui"></div>').parent();
            this.iselect.append('<div class="ioverflow"><div class="ioverflow-left"></div><div class="ioverflow-right"></div></div>');
            this.iselect.append('<div class="ioptions"><ul></ul></div>');
            // 34 - it's left+right side size
            this.iselect.css({width:this.width});
            
            this.select   = this.iselect.find('select');            
            this.selectUl = this.iselect.find('ul');
            
            this.overflow  = this.iselect.find('.ioverflow');
            this.overflow.css({width:this.width - 34});
            
            this.offset = this.selectUl.offset();
            // 68 - it's margin for set selct of first element
            this.marginTop = 68;
            this.selectEl  = 1;
            this.maxEl  = 0;

            this.oldY = 0;
            this.newY = 0;
            this.move = false;
//            this.TO = null;
            
    	    this.select.find('option').each(function(i){
    	        var title = $(this).html()||$(this).val();
    	        _self.selectUl.append('<li>'+title+'</li>');
    	        
    	        if ($(this).attr("selected")) {
    	            _self.selectEl = i+1;
    	        }
    	        _self.maxEl++;
    	    });
            
    	    // 44 - it's one element hight
            this.maxMargin = 68;
            this.minMargin = 68 + 44 - this.selectUl.height();
            
            
            this._select(this.selectEl);
    	
        	this.iselect.mousewheel(function(event, direction){
        	    // TODO: use direction as increment argument
        	    if ( direction < 0 ){
        	        if (_self.marginTop > _self.minMargin) {
        	            _self.selectEl ++;
        	            _self._select(_self.selectEl);
        	        }
    		    } else {		        
        	        if (_self.marginTop < _self.maxMargin) {
        	            _self.selectEl --;
        	            _self._select(_self.selectEl);
        	        }
    		    }
    		    event.stopPropagation();
    		    event.preventDefault();
        	});
        	
        	this.overflow.mousedown(function(event) {
    		    _self.selectUl.stop();
    		    _self.oldY = event.pageY;
                _self.move = true;
                
    		    event.stopPropagation();
    		    event.preventDefault();
            });
            
            $(document).mouseup(function(event){
                if (_self.move) {
                    _self.move = false;
                    _self.selectEl = Math.round(-(_self.marginTop - 68)/44) + 1;
                    _self._select(_self.selectEl);
                }
            });
            
            $(document).mousemove(function(event){
                if (_self.move && _self.oldY != 0) {
                    _self.newY = event.pageY;
                    
                    var diff = _self.marginTop + (_self.newY - _self.oldY);
                    if (diff >= _self.minMargin && diff <= _self.maxMargin) {
                        _self.marginTop =  _self.marginTop + (_self.newY - _self.oldY);
                        _self._scroll(_self.marginTop);
                    }
                    
                    _self.oldY = _self.newY;
                }
            });
            
            
        },
        _scroll: function(margin) {
            this.selectUl.stop(true,true);
            this.selectUl.animate({'marginTop':margin});
        },
        _select: function(index) {
            this.selectUl.stop(true,true);
            this.marginTop = 68 - (44 * (index-1));
            this.select.find("option:selected").removeAttr("selected");
            this.select.find("option:nth-child("+index+")").attr("selected", "selected");
            this.selectUl.animate({'marginTop':this.marginTop});
        }
    });    
})(jQuery);