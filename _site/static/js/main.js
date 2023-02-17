//Refactor Proposal: 
//IIFE (modules that are scoped and can contain both public and private code)
//
//Structure: 
//    Main function (all eventlisteners are in here, code from modules gets executed)
//    IIFE Animation (containing code that handles animations)
//	  IIFE History (containing code that interacts with the history API)
//    depricated & unused code in comments

//Decisions that still have to be made: 
// jQuery vs $ 


/**
 * Main function
 * Runs as soon as the document is ready
 * 
 * @param {any} $ A reference to jQuery so the $ can be used
 * @return {void}
 */

jQuery(document).ready(function($){
	init();
	setTimeout(function() { $( "#splash-project" ).trigger( "click" ); }, 3500 )
});


function init() {
	initBgLoaded(jQuery);

	//cache DOM elements
	var projectsContainer = $('.cd-projects-container'),
		projectsPreviewWrapper = projectsContainer.find('.cd-projects-previews'),
		projectPreviews = projectsPreviewWrapper.children('li'),
		projects = projectsContainer.find('.cd-projects'),
		navigationTrigger = $('.cd-nav-trigger'),
		navigation = $('.cd-primary-nav'),
		//if browser doesn't support CSS transitions...
		transitionsNotSupported = ( $('.no-csstransitions').length > 0);

	var animating = false,
		//will be used to extract random numbers for projects slide up/slide down effect
		numRandoms = projects.find('li').length, 
		uniqueRandoms = [];

		//set initial history state
        history.replaceState({
            'title': jQuery('title').html(),
            'content': jQuery('#content').html()
		}, jQuery('title').html(), document.location);

	//open project
	projectsPreviewWrapper.on('click', 'a', function(event){
		event.preventDefault();
		console.log('trigger on click a event');

		//make sure you can't click the splash post 
		// if(event.currentTarget.id === 'splash-project')  {
		// 	return;
		// }

		var ajaxUrl = event.currentTarget.href;
		
		if( animating == false ) {
			animating = true;
			navigationTrigger.add(projectsContainer).addClass('project-open');
			openProject($(this).parent('li')); 
			// load

		}
		// Wrap this in function? 
		jQuery.get(ajaxUrl, function(data){
            // Get the title of the new page
            regex = /<title>(.*)<\/title>/g
            newTitle = regex.exec(data)[1]
            // Set the title to the new title
            jQuery('title').html(newTitle)

            // Display scroll arrow
            
            // Set cd-project-info to display block

            // Replace the content
            jQuery('.selected .cd-project-info').html(jQuery(data).find('#content').html())

			//HERE
			//This is basically doing the bindlink one time too much

            // Push a new state to the browser
            // history.pushState({
            //     'title': jQuery('title').html(),
            //     'content': jQuery('#content').html()
            // }, newTitle, url)

            // Re Bind to all the links on the page
			// bindLinks()
			setTimeout(function() {
				$('.project-open').animate({
					scrollTop: $(".splash-bng-item").offset().top
				}, 500);
			}, 1000);

			$('.splash-bng-item a').on('click', function(e) {
				e.preventDefault();
				navigationTrigger.add(projectsContainer).removeClass('project-open');
				closeProject();
			});
        })

        // end ajax get post thingy

        // animate arrow into viewport (css)
	});

	

	navigationTrigger.on('click', function(event){
		if (!jQuery(navigationTrigger).hasClass('single-post'))
		{
			event.preventDefault();
			
			if( animating == false ) {
				animating = true;
				if( navigationTrigger.hasClass('project-open') ) {
					//close visible project
					navigationTrigger.add(projectsContainer).removeClass('project-open');
					closeProject();
					history.pushState({
		                'title': "{{ site.mantra }} | {{ site.title }}",
		                'content': "home"
		            }, "{{ site.mantra }} | {{ site.title }}", "/" );
				} else if( navigationTrigger.hasClass('nav-visible') ) {
					//close main navigation
					navigationTrigger.removeClass('nav-visible');
					navigation.removeClass('nav-clickable nav-visible');
					if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
					else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
				} else {
					//open main navigation
					navigationTrigger.addClass('nav-visible');
					navigation.addClass('nav-visible');
					if(transitionsNotSupported) projectPreviews.addClass('slide-out');
					else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
				}
			}	

			if(transitionsNotSupported) animating = false;
		}
	});

	projectsContainer.on('click', '.scroll', function(){
		projectsContainer.animate({'scrollTop':$(window).height()}, 500); 
	});

	//check if background-images have been loaded and show project previews
	projectPreviews.children('a').bgLoaded({
	  	afterLoaded : function(){
	   		showPreview(projectPreviews.eq(0));
	  	}
	});

	function showPreview(projectPreview) {
		if(projectPreview.length > 0 ) {
			setTimeout(function(){
				projectPreview.addClass('bg-loaded');
				showPreview(projectPreview.next());
			}, 150);
		}
	}

	function openProject(projectPreview) {
		var projectIndex = projectPreview.index();
		projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');
		
		if( transitionsNotSupported ) {
			projectPreviews.addClass('slide-out').removeClass('selected');
			projects.children('li').eq(projectIndex).addClass('content-visible');
			animating = false;
		} else { 
			slideToggleProjects(projectPreviews, projectIndex, 0, true);
		}

		update_gtm();
	}

	function closeProject() {
		projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
			// remove content on close
		});

		$('.cd-project-info.visible').children().filter("video").each(function(){
		    this.pause(); // can't hurt
		    $(this).attr('src', '');
		    delete this; // @sparkey reports that this did the trick (even though it makes no sense!)
		    $(this).remove(); // this is probably what actually does the trick
		});

		$('.cd-project-info.visible').empty();
		
		//if browser doesn't support CSS transitions...
		if( transitionsNotSupported ) {
			projectPreviews.removeClass('slide-out');
			projects.find('.content-visible').removeClass('content-visible');
			animating = false;
		}

		update_gtm(); 
	}

	function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
		if(index == 0 ) createArrayRandom();
		if( projectIndex != -1 && index == 0 ) index = 1;

		var randomProjectIndex = makeUniqueRandom();
		if( randomProjectIndex == projectIndex ) randomProjectIndex = makeUniqueRandom();
		
		if( index < numRandoms - 1 ) {
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
			setTimeout( function(){
				//animate next preview project
				slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
			}, 150);
		} else if ( index == numRandoms - 1 ) {
			//this is the last project preview to be animated 
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				if( projectIndex != -1) {
					projects.children('li.selected').addClass('content-visible');
					projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
				} else if( navigation.hasClass('nav-visible') && bool ) {
					navigation.addClass('nav-clickable');
				}
				projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				animating = false;
			});
		}
	}

	//https://stackoverflow.com/questions/19351759/javascript-random-number-out-of-5-no-repeat-until-all-have-been-used
	function makeUniqueRandom() {
	    var index = Math.floor(Math.random() * uniqueRandoms.length);
	    var val = uniqueRandoms[index];
	    // now remove that value from the array
	    uniqueRandoms.splice(index, 1);
	    return val;
	}

	function createArrayRandom() {
		//reset array
		uniqueRandoms.length = 0;
		for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
	}

	bindLinks();
	scrollAnimationInit();
}


 /*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
 var initBgLoaded = (function($){
 	$.fn.bgLoaded = function(custom) {
	 	var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function(){
			var $this = $(this),
				bgImgs = $this.css('background-image').split(', ');
			$this.data('loaded-count',0);
			$.each( bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function() {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count',$this.data('loaded-count')+1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
});

$(window).on("popstate", function(e) {
	jQuery.ajax({
		url: window.location,

		//TODO: Make this work with the animations as well, pretty sure it can be done
		success: function(html) {
			var newDoc = new DOMParser().parseFromString(html, 'text/html');
			var newContent = newDoc.getElementById('content'); 
			var newProjectPreviewsContainer = newContent.getElementsByClassName('cd-projects-container')[0];
			var newProjectPreviews = newProjectPreviewsContainer.getElementsByTagName('li');
			
			document.body.innerHTML = '';
			document.body.appendChild(newContent);	

			update_gtm(); 

			init();
		}
	})	
});


function bindLinks(){
	// Bind only internal links
    jQuery("a[href^='/']").on('click', function(e){
        // Stop link from activating
		e.preventDefault()
		
		// make sure that no errors get logged when the splash post gets clicked
		if(e.currentTarget.id === 'splash-project')  {
			return;
		}

        // Get the URL to load
        url = jQuery(this).attr('href')

        // Send a Get request to the URL
        jQuery.get(url, function(data){
            // Get the title of the new page
            regex = /<title>(.*)<\/title>/g
            newTitle = regex.exec(data)[1]
            // Set the title to the new title
            jQuery('title').html(newTitle)

            // Display scroll arrow

            // Set cd-project-info to display block

            // Replace the content
			jQuery('.selected .cd-project-info').html(jQuery(data).find('#content').html())
			
			//auto click
			
			
			 // scroll to content if class is present
			// $('.splash-bng-item').animate({
			// 	scrollTop: $('#content').get(0).scrollHeight
			// }, 1500);
			
						
			
			//HERE
			//add current history before re
            history.pushState({
                'title': jQuery('title').html(),
                'content': jQuery('#content').html()
            }, newTitle, url)

            // Re Bind to all the links on the page
            // bindLinks()
        })
    })
}

function scrollAnimationInit() {
	$(function(){
		var visible = false;
			$('.cd-projects-container').scroll(function(e){ 
				if ( parseInt($('.cd-projects-container').scrollTop()) > ( $(window).height() / 2 ) ) {
					$('.selected .cd-project-info').addClass('visible');
				}
	
				if ( parseInt($('.cd-projects-container').scrollTop()) < ( $(window).height() / 2 ) ) {
					$('.selected .cd-project-info').removeClass('visible');
				}
			})
	});
}

function update_gtm(){
	ga('set', document.title, window.location.href);
	ga('send', 'pageview');
}