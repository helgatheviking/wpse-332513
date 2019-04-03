<?php
/**
 * Plugin Name: WPSE 332513
 * Plugin URI: https://wordpress.stackexchange.com/q/332513/137402
 * Description: A sample plugin which extends <code><a href="https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/post-taxonomies/hierarchical-term-selector.js" target="_blank">HierarchicalTermSelector</a></code>.
 * Version: 20190402.2
 * Author: Sally CJ
 * Author URI: https://wordpress.stackexchange.com/users/137402
 * Text Domain: wpse-332513
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'enqueue_block_assets', function(){
	// Check if we're on an admin screen/page and we've got a valid screen.
	if ( ! is_admin() || ( ! $screen = get_current_screen() ) ) {
		return;
	}

	$post_types = ['post', 'etc_cpt'];
	if ( in_array( $screen->id, $post_types ) ) {
		$url = plugin_dir_url( __FILE__ ) . 'js/my-terms-selector.js';
		wp_enqueue_script( 'my-terms-selector', $url, [], '20190402', true );
	}
} );
