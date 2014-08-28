<?php
/*
Plugin Name: Mouse events
Description: Record and save mouse events in database table 'wp_mouse_events'
Author: Abhishek Nag
Version: 1.0
Author URI: click-titanic.com
*/

add_action( 'init', 'mouse_events_plugin_init' );

function mouse_events_plugin_init() {
    
    // ONLY INIT PLUGIN IF QUERY VAR IS NOT EMPTY - FOR TESTING
    //if( ! empty( $_GET['me'] ) ){
    // ONLY INIT PLUGIN IF QUERY VAR IS NOT EMPTY - FOR TESTING
    //if( ! empty( $_POST ) ){
    
    // ONLY INIT PLUGIN IF WE ARE AT SITE PAGE OR ADMIN PAGE BY DOING AJAX REQUEST
    if( ! is_admin() || ( defined('DOING_AJAX') && DOING_AJAX ) ){
    	
    	// ADD PLUGIN'S JS FILES
    	add_action( 'wp_enqueue_scripts', 'mouse_events_enqueue_script' );
    	
    	// SET GLOBAL JAVASCRIPT VARS NEEDED FOR THIS PLUGIN
    	add_action( 'wp_head', 'mouse_events_wp_head_content', 1 );
    	
    	add_action( 'wp_ajax_mouse_events_save_to_db', 'mouse_events_save_to_db' );
    	add_action( 'wp_ajax_nopriv_mouse_events_save_to_db', 'mouse_events_save_to_db' ); 
    	
    }
    
}

function mouse_events_enqueue_script() {
    
    wp_enqueue_script( 'mouse_events_script', plugins_url( 'main.js', __FILE__ ), array( 'jquery' ), '1.0', true );

}

function mouse_events_wp_head_content() {
    
    ?>
    <script type="text/javascript">
    	var visitor_ip_address = "<?php echo $_SERVER['REMOTE_ADDR']; ?>";
    	var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
    </script>
    <?php

}

function mouse_events_save_to_db() {
    
    global $wpdb;
    
    // CHECK FOR EXISTING ROW
    $existing_row = $wpdb->get_row( 
    	$wpdb->prepare( 
    		"SELECT `id` FROM `wp_mouse_events` WHERE `ip` = %s AND `url` = %s AND `control_id` = %s",
    		$_POST['ip'],
    		$_POST['url'],
    		$_POST['control_id']
    	), 
    ARRAY_A );
    
    // ROW EXISTS - UPDATE IT
    if( ! empty( $existing_row ) ){
    	
    	$wpdb->update( 
			'wp_mouse_events', 
			array( 
				'page_loaded_on' 		=> $_POST['page_loaded_on'],
			    'screen_resolution' 	=> $_POST['screen_resolution'],
			    'ip' 					=> $_POST['ip'],
			    'url' 					=> $_POST['url'],
			    'scroll_pause_y' 		=> $_POST['scroll_pause_y'],
			    'scroll_pause_duration' => $_POST['scroll_pause_duration'],
			    'resize_time' 			=> $_POST['resize_time'],
			    'resize_dimensions' 	=> $_POST['resize_dimensions'],
			    'doubleclick_count' 	=> $_POST['doubleclick_count'],
			    'doubleclick_xy' 		=> $_POST['doubleclick_xy'],
			    'control_id' 			=> $_POST['control_id'],
			    'control_xy' 			=> $_POST['control_xy'],
			    'hover_count' 			=> $_POST['hover_count'],
			    'hover_duration' 		=> $_POST['hover_duration'],
			), 
			array( 'id' => $existing_row['id'] )
		);
		
		echo 'updated existing row! ';
    	
    }
    // ROW DOESNT EXISTS - INSERT IT
    else {
    	
    	$wpdb->insert( 
			'wp_mouse_events', 
			array( 
				'page_loaded_on' 		=> $_POST['page_loaded_on'],
			    'screen_resolution' 	=> $_POST['screen_resolution'],
			    'ip' 					=> $_POST['ip'],
			    'url' 					=> $_POST['url'],
			    'scroll_pause_y' 		=> $_POST['scroll_pause_y'],
			    'scroll_pause_duration' => $_POST['scroll_pause_duration'],
			    'resize_time' 			=> $_POST['resize_time'],
			    'resize_dimensions' 	=> $_POST['resize_dimensions'],
			    'doubleclick_count' 	=> $_POST['doubleclick_count'],
			    'doubleclick_xy' 		=> $_POST['doubleclick_xy'],
			    'control_id' 			=> $_POST['control_id'],
			    'control_xy' 			=> $_POST['control_xy'],
			    'hover_count' 			=> $_POST['hover_count'],
			    'hover_duration' 		=> $_POST['hover_duration'],
			)
		);
		
		echo 'added new row! ';
    	
    }
    
    print_r( $_POST ); die;

}

?>
