/**
 * Menu manager
 *
 * @author Anton Shevchuk (http://anton.shevchuk.name)
 * @copyright (c) 2009 jQuery iPhone UI (http://iphone.hohli.com)
 * @license  Dual licensed under the MIT and GPL licenses (http://docs.jquery.com/License)
 * 
 * @version 0.1
 */
(function($){
    $.widget('ui.iMenuManager', {
		options:{
			link   : 'a[href!=#]', // selector for bind goTo event
			content: 'body',  // what content load from target URL - default is body
			title  : 'title', // where widget can found title - default is title
			back   : 'body',  // back link container 
			width  : 'auto',  // width of element
			height : 'auto'   // height of element
		},
		/**
		 * Constructor of widget
		 */
        _init: function() {
            var _self = this;
			var $this = this.element;
				$this.addClass('iphoneui');
			
			// change default options
			this.options.width  = this.element.width();
			this.options.height = this.element.height();
			
            var current = new this._screen(this);
                current.init('');
                current.setScreen($this);
                
            this._screens[this._index] = current;

			// all links in widget
	    	this.element.find(this.options.link).live('click',function(){
	    	    var url = $(this).attr("href");
	    	    _self._goTo(url);
	    	    return false;
	    	});
			
			// init checker
			setInterval(function(){_self._check()}, 200);
        },
		_screens:[],
		_index:0,
		
		/**
		 * Return current screen entity
		 * 
		 * @return this.screen
		 */
        _current:function()
		{
            return this._screens[this._index];
        },
		
		/**
		 * Return previous screen entity
		 * 
		 * @return this.screen
		 */
        _previous:function()
		{
            if (this._index != 0) {
                return this._screens[this._index-1];
            } else {
                return null;
            }
        },
		
		/**
		 * Create new screen entity and load it
		 * 
		 * @param {String} url
		 */
        _goTo:function(url)
		{
            this._index++;
			
			this._screens[this._index] =  new this._screen(this);
			this._screens[this._index].load(url);
        },
		
		/**
		 * Remove current screen and show previous
		 */
        _goBack:function()
		{
			if (this._index <= 0) return;
			
            var _self = this;
            var  prev = this._previous();
			var  curr = this._current();

			// decrement before unload
			this._index--;

            document.location.hash = prev.getUrl();
			document.title 		   = prev.getTitle();
			 
            var prev_screen = prev.getScreen();
            var curr_screen = curr.getScreen();

            curr_screen.animate({left:"+="+this.options.width}, function(){
                curr_screen.remove();
                delete _self._screens[_self.currentIndex+1];
            });
            prev_screen.animate({left:"+="+this.options.width});
        },
		/**
		 * Interval callback function
		 * need for history navigation
		 */
		_check:function()
		{
			// otherwise, check for location.hash
			var hash = document.location.hash;
				hash = hash.length?hash.substr(1):'';
				
			if (   hash && this._current()
				&& hash != this._current().getUrl()
				&& this._screens[this._index].getScreen().find('a[href$='+hash+']').length) {
				this._goTo(hash);
				return;
			}
			
			if (this._index > 0
				&& this._current()
				&& hash != this._current().getUrl()) {
				this._goBack();
				return;
			}
		},
		/**
		 * Screen entity
		 */
		_screen:function(manager)
		{
			var _self = this;
            this.url   = null;
            this.title = null;
            
            this.setUrl = function(url) {
                this.url = url;
                document.location.hash = url;
                return this;
            };
            this.getUrl = function() {
                return this.url;
            };
            this.setTitle = function(title) {
            	if (title) {
	                title = title.replace(/<.*>/g, "");
	                title = title.replace(/\s+/g, " ");
					
					document.title = title;
					
	            	this.title = title;
            	}
            	return this;
            };
            this.getTitle = function() {
                return this.title;
            };
            this.setScreen = function(el) {
                this.screen = el;
            };
            this.getScreen = function() {
                return this.screen;
            };
            
			/**
			 * Load external page by AJAX query
			 * 
			 * @param {String} url
			 */
            this.load = function(url) {
               this.setUrl(url);
        	   $.ajax({
        	       url:_self.url,
        	       dataType: "html",
        	       success: function(html){
                        _self.screen = $(html).find(manager.options.content);
						_self.setTitle(_self.screen.find(manager.options.title).html());
                        _self.screen.css({
                               left:manager.options.width,
							   width:manager.options.width,
							   height:manager.options.height
                            });
							
                        if (manager._previous()) {
							_self.screen.find(manager.options.back).append(
								$('<a href="#' + manager._previous().getUrl() + '" class="iphoneui back">' + manager._previous().getTitle() + '<em></em></a>').click(function(){
									manager._goBack();
									return false;
								})
							);
							
							manager._previous().getScreen().animate({
								left: "-="+manager.options.width
							});
						}
                        manager.element.parent().append(_self.screen);

                        _self.screen.animate({left:"-="+manager.options.width});
                        
                        // reinit all widgets
                        iPhoneUI.initWidgets();
                   }
        	   });
            }
            
            this.init = function(url) {
            	this.setUrl(url);
                this.setTitle($(manager.options.title).html());
            }
			
			return this;
        }
    });
})(jQuery);