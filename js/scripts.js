
/* Simple Slide (Plugin) */

$(function() {
		
			var ID = {
				slideshow : 'zona-slides',
				slide : 'slide',
				counter : 'contador',
				navigation : 'navigation',
				next : 'next',
				previous : 'previous',
				current : 'current'
			};
			
			var labels = {
				next : '&rarr;',
				previous : '&larr;',
				separator : ' - '
			};
			
			var $slideshow = $('#'+ID.slideshow);
			var $slides = $slideshow.children().addClass(ID.slide);
			var $currentSlide;
			var $firstSlide = $slides.first();
			var $lastSlide = $slides.last();
			
			
			
			var $counter = $('#'+ID.counter);
			var $next = $('.'+ID.next);
			var $previous = $('#'+ID.previous);
			
							   

			/*** FUNCTIONS ***/
			
			var updateCounter = function() {
				// updates the counter
				$counter.text(thisSlidePointer + labels.separator + lastSlidePointer);
			}
			
			var hideCurrentSlide = function() {
				// hide the current slide
				$currentSlide.fadeOut().removeClass(ID.current);


			}
			
			var nextSlide = function() {
				// hide current slide
				hideCurrentSlide();
				
				// get the next slide
				var nextSlide = $currentSlide.next();
				
				// not the last slide => go to the next one and increment the counter
				if ( thisSlidePointer != lastSlidePointer ) {
					nextSlide.fadeIn().addClass(ID.current);
					$currentSlide = nextSlide;
					thisSlidePointer++;
				}
				else {
					// is the last slide => go back to the first slide and reset the counter.
					$firstSlide.fadeIn().addClass(ID.current);
					$currentSlide = $firstSlide;
					thisSlidePointer = 1;
				}
				
				// update counter
				updateCounter();
			}
			
			var previousSlide = function() {
				// hide current slide
				hideCurrentSlide();
				
				// get the previous slide
				var previousSlide = $currentSlide.prev();
				
				// If not the first slide, go to the previous one and decrement the counter
				if ( thisSlidePointer != 1 ) {
					previousSlide.fadeIn().addClass(ID.current);
					$currentSlide = previousSlide;
					thisSlidePointer--;
				}
				else {
					// This must be the first slide, so go back to the last slide and set the counter.
					$lastSlide.fadeIn().addClass(ID.current);
					$currentSlide = $lastSlide;
					thisSlidePointer = lastSlidePointer;
				}
				
				// update counter				
				updateCounter();	
			}
			
			/*** INIT SLIDESHOW ***/
			
			// Initially hide all slides
			$slides.hide();
			
			// The first slide is number first!
			var thisSlidePointer = 1;
			
			// The last slide position is the total number of slides
			var lastSlidePointer = $slides.length;
			
			// The first slide is always the first slide! So let's make visible and set the counter
			$currentSlide = $firstSlide.show().addClass(ID.current);
			updateCounter();
			
			
			/*** EVENTS ***/
			
			// "next" arrow clicked => next slide
			$next.click(nextSlide);
			
			// "previous" arrow clicked => previous slide
			$previous.click(previousSlide);
			
			// Add keyboard shortcuts for changing slides
			$(document).keydown(function(e){
				if (e.which == 39) { 
					// right key pressed => next slide
					nextSlide();
					return false;
				}
				else if (e.which == 37) {
						// left key pressed => previous slide
						previousSlide();
						return false;
					}
			});
							   
		});	

/* Llamados Animate.css */

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});


