/*
 * jQuery ToolTips for Topic Preview
 * https://github.com/VSEphpbb/topic_preview
 *
 * Copyright 2013, Matt Friedman
 * Licensed under the GPL Version 2 license.
 * http://www.opensource.org/licenses/GPL-2.0
 */

;(function ( $, window, document, undefined ) {

	$.fn.topicPreview = function( options ) {

		var settings = $.extend( {
			"dir"   : "ltr",
			"theme" : "light",
			"delay" : 1500,
			"width" : 360,
			"left"  : 35,
			"top"   : 25,
			"drift" : 15
		}, options ),
			previewTimeout = 0,
			previewContainer = $('<div id="topic_preview"></div>').addClass(settings.theme).css("width", settings.width).appendTo("body");

		// Do not allow delay times less than 300ms to prevent tooltip madness
		settings.delay = Math.max(settings.delay, 300);

		// Add rtl class for right-to-left languages to avatar images
		$(".topic_preview_avatar").toggleClass("rtl", (settings.dir === "rtl")).children("img").one("error", function() { 
			// Replace any broken/missing avatar images in topic previews
			$(this).attr("src", settings.noavatar);
		});

		return this.each(function() {
			var obj = $(this),
				hoverObject = obj.parent().find(".topictitle"),
				firstPostText = obj.attr("title"); // cache title attributes

			hoverObject.hover(function() {
				// Grab tooltip content
				var content = $("#topic_preview_" + obj.attr("id")).html();

				// Proceed only if there is content to display
				if (content === undefined || content === '') {
					return false;
				}

				// clear any existing timeouts
				if (previewTimeout !== 0) {
					clearTimeout(previewTimeout);
				}

				// remove default titles
				obj.attr("title", "");

				previewTimeout = setTimeout(function() {
					// clear the timeout var after delay and function begins to execute	
					previewTimeout = 0;

					// Fill the topic preview
					previewContainer
						.html(content)
						.find(".topic_preview_text_first")
						.append(firstPostText);

					// Window bottom edge detection, invert topic preview if needed 
					var previewTop = hoverObject.offset().top + settings.top,
						previewBottom = previewTop + previewContainer.height() + 8;
					previewContainer.toggleClass("invert", edgeDetect(previewBottom));
					previewTop = edgeDetect(previewBottom) ? hoverObject.offset().top - previewContainer.outerHeight() - 8 : previewTop;

					// Display the topic preview positioned relative to the hover object
					previewContainer
						.css({
							"top"   : previewTop + "px",
							"left"  : hoverObject.offset().left + settings.left + (settings.dir === "rtl" ? (hoverObject.width() - previewContainer.width()) : 0) + "px"
						})
						.fadeIn("fast"); // display the topic preview with a fadein
				}, settings.delay); // Use a delay before showing in topic preview

			}, function() {
				// clear any existing timeouts
				if (previewTimeout !== 0) {
					clearTimeout(previewTimeout);
				}

				// Remove topic preview
				previewContainer.stop(true, true).fadeOut("fast") // hide the topic preview with a fadeout
					.animate({"top": "-=" + settings.drift + "px"}, {duration: "fast", queue: false}, function() {
						// animation complete
					});
			});
		});
	};

	// Check if y coord extends beyond bottom edge of window (with 100px of pad)
	function edgeDetect(y) {
		return ( y >= ($(window).scrollTop() + $(window).height() - 100) );
	}

})( jQuery, window, document );
