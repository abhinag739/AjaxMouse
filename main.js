// JQUERY DELAYED RESIZE PLUGIN
jQuery.fn.resize_delayed = function ( func, duration ){
    this.resize(function() { clearTimeout( window.____resize_delayed ); window.____resize_delayed = setTimeout( func, duration); });
};

// JQUERY DELAYED SCROLL PLUGIN
jQuery.fn.scroll_delayed = function ( func, duration ){
    this.scroll(function() { clearTimeout( window.____scroll_delayed ); window.____scroll_delayed = setTimeout( func, duration); });
};

// RETURN CURRENT TIME
function current_time(){
	var time = new Date();
	return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
}

// RETURN CURRENT TIMESTAMP
function current_timestamp(){
	var time = new Date();
	return Math.round( time.getTime() / 1000 );
}

// RETURN CURRENT TIMESTAMP
function send_ajax_request( sending_object ){
	
	if( typeof sending_object == "undefined" )
		var sending_object = {};
	
	//console.log( 'ajax sending data...' );
	
	jQuery.post( ajaxurl, jQuery.extend( {
	
		action  				: 'mouse_events_save_to_db',
		page_loaded_on  		: mouse_events.controls.page.page_loaded_on,
		screen_resolution  		: mouse_events.controls.page.screen_resolution,
		ip 						: mouse_events.controls.page.ip,
		url 					: mouse_events.controls.page.url,
		scroll_pause_y 			: mouse_events.controls.page.scroll_pause_y.join(','),
		scroll_pause_duration 	: mouse_events.controls.page.scroll_pause_duration.join(','),
		resize_time 			: mouse_events.controls.page.resize_time.join(','),
		resize_dimensions 		: mouse_events.controls.page.resize_dimensions.join(','),
		doubleclick_count 		: mouse_events.controls.page.doubleclick_count,
		doubleclick_xy 			: mouse_events.controls.page.doubleclick_xy.join(','),
		control_id 				: 'page',
		control_xy 				: '0x0',
		hover_count 			: 0,
		hover_duration  		: 0
	
	}, sending_object ), function( data ) {
	
		//console.log( 'ajax returned data:' );
		//console.log( data );
	
	});
	
}

// CREATE TODAY'S DATE OBJECT
var today_date_object = new Date();
var page_init_date = today_date_object.getFullYear() + '-' + today_date_object.getMonth() + '-' + today_date_object.getDate();
var page_init_time = current_time();

// MOUSE EVENTS INIT OBJECT
var mouse_events = {
	controls : {
		page : {
			page_loaded_on  		: page_init_date + ' ' + page_init_time,
			screen_resolution  		: jQuery(window).width() + 'x' + jQuery(window).height(),
			ip 						: visitor_ip_address,
			url 					: window.location.href,
			scroll_pause_y 			: [],
			scroll_pause_duration 	: [],
			resize_time 			: [],
			resize_dimensions 		: [],
			doubleclick_count 		: 0,
			doubleclick_xy 			: []
		},
		specific : []
	},
	latest_recorded_scroll_event : {},
	latest_recorded_hover_event : {},
	triggers : [
		'.p img.wp-image-82',
		'#box',
		'#name_of_hotel',
		'.entry-content p',
		'#wrapper1',
		'.caroufredsel_wrapper',
		'.wp-image-748',
		'.main-header',
		'.menus-container',
		'.nimble-portfolio-title',
		'.nimble-portfolio-template-rect-1 .nimble-portfolio ul li',
		'.nimble-portfolio-template-rect-1 .nimble-portfolio-item',
		'.nimble-portfolio-template-rect-1 .nimble-portfolio-title',
		'.album-info-block .info-container',
		'.album-info-block .bottom-bar',
		'.block-inside',
		'#secondary',
		'aside#search-2',
		'ul#yiw-featured-post li',
		'ul#yiw-featured-post li a',
		'#post-628',
		'#post-598',
		'#ft-newsletterform',
		'#ft-newsletterform input',
		'#ft-newsletterform input[type="submit"]',
		'#ft-newsletterform',
		'#cntctfrm_contact_form',
		'#cntctfrm_contact_message',
		'#wp-table-reloaded-id-4-no-1'
	]
};

jQuery(function($){
	
	/*console.log( mouse_events );*/
	
	// ON PAGE DELAYED SCROLL...
	$( window ).scroll_delayed( function (){
		
		var current_array_count = mouse_events.controls.page.scroll_pause_y.length;
		
		// RECORD NEW SCROLL POSITION
		mouse_events.controls.page.scroll_pause_y[ current_array_count ] = $(window).scrollTop();
		
		mouse_events.latest_recorded_scroll_event = {
			// AFTER 20 SECONDS WITHOUT SCROLLING, REMOVE SCROLL POSITION
			remove_timer : setTimeout( function (){
				mouse_events.controls.page.scroll_pause_y.splice( current_array_count, 1 );
				mouse_events.controls.page.scroll_pause_duration.splice( current_array_count, 1 );
				/*console.log( mouse_events.controls.page.scroll_pause_y );*/
				/*console.log( mouse_events.controls.page.scroll_pause_duration );*/
			}, 30000 ),
			// RECORD STARTING TIME
			starting_timestamp : current_timestamp()
		};
		
		/*console.log( '>>> scroll_delayed' );*/
		/*console.log( mouse_events.controls.page.scroll_pause_y );*/
		/*console.log( mouse_events.controls.page.scroll_pause_duration );*/
		/*console.log( '<<< scroll_delayed' );*/
	}, 10000 );
	
	// ON PAGE SCROLL...
	$( window ).scroll( function (){
		
		// IS REMOVE TIMER ACTIVE?
		if( typeof mouse_events.latest_recorded_scroll_event.remove_timer == "number" ){
			
			// PREVENT LATEST RECORDED SCROLL POSITION FROM BEING REMOVED BECAUSE WE JUST SCROLLED PAGE AGAIN
			clearTimeout( mouse_events.latest_recorded_scroll_event.remove_timer );
			mouse_events.latest_recorded_scroll_event.remove_timer = null;
			
			// CALCULATE TOTAL SCROLL PAUSE DURATION
			var time_diff = current_timestamp() - mouse_events.latest_recorded_scroll_event.starting_timestamp;
			
			// SAVE SCROLL PAUSE DURATION IF IT IS BELLOW MAX ALLOWED TIME
			if( time_diff <= 20 ){
				
				mouse_events.controls.page.scroll_pause_duration[ mouse_events.controls.page.scroll_pause_duration.length ] = time_diff + 'sec';
				
				// SEND AJAX REQUEST ( SAVE DATA INTO DATABASE )
				send_ajax_request();
				
			}
			
			/*console.log( '>>> scroll' );*/
			/*console.log( mouse_events.controls.page.scroll_pause_y );*/
			/*console.log( mouse_events.controls.page.scroll_pause_duration );*/
			/*console.log( '<<< scroll' );*/
			
		}
		
	});
	
	// ON SCREEN DELAYED RESIZE...
	$( window ).resize_delayed( function (){
		
		var current_array_count = mouse_events.controls.page.resize_time.length;
		
		// RECORD NEW DIMENSIONS AND RESIZE TIME
		mouse_events.controls.page.resize_time[ current_array_count ] = current_time();
		mouse_events.controls.page.resize_dimensions[ current_array_count ] = $(window).width() + 'x' + $(window).height();
		
		// SEND AJAX REQUEST ( SAVE DATA INTO DATABASE )
		send_ajax_request();
		/*console.log( mouse_events.controls.page );*/
		
	}, 500 );
	
	// ON DOUBLE CLICK...
	$( document ).dblclick( function( event ){
		
		// RECORD DOUBLE CLICK MOUSE POSITION AND INCREASE COUNT NUMBER
		mouse_events.controls.page.doubleclick_xy[ mouse_events.controls.page.doubleclick_count ] = event.pageX + 'x' + event.pageY;
		mouse_events.controls.page.doubleclick_count++;
		
		// SEND AJAX REQUEST ( SAVE DATA INTO DATABASE )
		send_ajax_request();
		/*console.log( mouse_events.controls.page );*/
		
	});
	
	// HOVER ON TRIGGER ELEMENTS...
	var counter = 0;
	$.each( mouse_events.triggers, function( index, value ) {
		
		// DOES ELEMENT EXISTS ON PAGE?
		if( $( value ).length > 0 ) {
			
			// SET DEFAULTS
			mouse_events.controls.specific[ counter ] = {
				hover_count : 0,
				hover_duration : []
			};
			
			// SAVE DEFAULTS TO ELEMENT'S DATA OBJECT
			$( value ).data({
				selector : value,
				index : counter,
				hover_count : 0
			}).hover(function() {
				// SAVE CURRENT TIMESTAMP ON MOUSEOVER
				$(this).data('timestamp_start', current_timestamp() );
				
				console.log( 'mouseenter on : ' + value );
				
			}, function() {
				
				console.log( 'mouseleave on : ' + value );
				
				// CALCULATE NUM OF SECONDS ELEMENT HAS HOVER STATUS
				var seconds_hovered = current_timestamp() - $(this).data('timestamp_start');
				
				// ARE WE IN DESIRED RANGE?
				if( seconds_hovered >= 3 && seconds_hovered <= 30 ) {
					
					var hover_duration_array_count = mouse_events.controls.specific[ $(this).data('index') ][ 'hover_duration' ].length;
					
					// SAVE HOVER STATUS
					mouse_events.controls.specific[ $(this).data('index') ][ 'hover_count' ]++;
					mouse_events.controls.specific[ $(this).data('index') ][ 'hover_duration' ][ hover_duration_array_count ] = seconds_hovered+'sec';
					
					// SEND AJAX REQUEST ( SAVE DATA INTO DATABASE )
					send_ajax_request({
						control_id 		: $(this).data('selector'),
						control_xy 		: $(this).offset().left + 'x' + $(this).offset().top,
						hover_count 	: mouse_events.controls.specific[ $(this).data('index') ][ 'hover_count' ],
						hover_duration  : mouse_events.controls.specific[ $(this).data('index') ][ 'hover_duration' ].join(',')
					});
				
				}
				
			});
			
			counter++;
			
		}
		
	});

	// >>> MOUSE EVENTS VIEW PAGE
	
		$('#me-select-url').change(function(event) {
			
			if( $(this).val() != '' ){
				$(this).children('option.default').remove();
				$(this).closest('form').submit();
			}
			
		});
	
		$('#me-select-resolution').change(function(event) {
			
			if( $(this).val() != '' )
				$(this).children('option.default').remove();
			
			$('#select-event-container').show().find('input:selected').removeProp('selected');
			
			if( $('#iframe-container').is(':empty') )
				$('#iframe-container').html('<iframe src="'+$('#iframe-container').data('url')+'" frameborder="0"></iframe>');
			
			$('#iframe-container iframe').css({
				width:  ( $(this).children('option:selected').data('width') + 100 ) + 'px',
				height: ( $(this).children('option:selected').data('height') + 100 ) + 'px',
				overflow: 'auto'
			});

		});
		
		var clicks_changed = 0;
	
		$('input[name="me-events"]').change(function(event) {
			
			var $selected_option = $('#me-select-resolution option:selected');
			
			var points = [];
			
			clicks_changed++;
			
			console.log( 'clicks_changed:' + clicks_changed );
			
			console.log( 'initial points:' );
			console.log( points );
			
			// >>> HEATMAP
			
				if( typeof window.heatmapInstance == "undefined" ){
					window.heatmapInstance = h337.create({
						container: document.querySelector('#iframe-container')
					});
				}
					
				if( $(this).attr('id') == 'me-event-hover' && typeof $selected_option.data('hover') == "object" ){
					
					var offset = 0;
					
					$.each( $selected_option.data('hover'), function(data_hover_objects_indexes, data_hover_object ) {
						
						$.each(data_hover_object.duration, function(duration_index, data_hover_duration) {
							
							points.push({
								x: data_hover_object['control_xy'][0] + 10 + offset,
								y: data_hover_object['control_xy'][1] + 10 + offset,
								value: Math.floor( 100 / ( Math.max.apply( Math, data_hover_object.duration ) / data_hover_duration ) ),
								radius: 100
							});
							
							offset += 50;
						 
						});
						
					});
					
				}
			
				if( $(this).attr('id') == 'me-event-double-click' && typeof $selected_option.data('doubleclick') == "object" ){
					
					$.each($selected_option.data('doubleclick'), function(data_doubleclick_objects_indexes, data_doubleclick_object) {
						
						$.each(data_doubleclick_object.doubleclick_xy, function(duration_index, data_doubleclick_xy) {
							
							points.push({
								x: data_doubleclick_xy[0],
								y: data_doubleclick_xy[1],
								value: 80,
								radius: 50
							});
						 
						});
						
					});
					
				}
			
				if( $(this).attr('id') == 'me-event-scroll-pause' && typeof $selected_option.data('scroll_pause') == "object" ){
					
					$.each($selected_option.data('scroll_pause'), function(data_scroll_pause_objects_indexes, data_scroll_pause_object) {
						
						$.each(data_scroll_pause_object.scroll_pause_y, function(duration_index, data_scroll_pause_y) {
							
							points.push({
								x: 100,
								y: data_scroll_pause_y,
								value: Math.floor( 100 / ( Math.max.apply( Math, data_scroll_pause_object['scroll_pause_duration'] ) / data_scroll_pause_object['scroll_pause_duration'][duration_index] ) ),
								radius: 50
							});
						 
						});
						
					});
					
				}
				
				console.log( 'points' );
				console.log( points );
				
				window.heatmapInstance.setData({ 
					min: 20, 
					max: 100,
					data: points
				}).repaint();
			
			// <<< HEATMAP

		});
	
		$('#me-form').attr('action', window.location.href);
		
		$('#me-options').submit(function(event) {
			event.preventDefault();
			return false;
		});
			
	// <<< MOUSE EVENTS VIEW PAGE
	
});