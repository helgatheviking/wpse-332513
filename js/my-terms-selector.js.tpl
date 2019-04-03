// Based on the example here: https://github.com/WordPress/gutenberg/tree/master/packages/editor/src/components/post-taxonomies#custom-taxonomy-selector
( function(){
// Copy the content of src/component-babel.js and paste it here, replacing all
// these 3 lines; and save the file as my-terms-selector.js. Because we do not
// want to expose the variables in src/component-babel.js as global variables.

	// It's up to you on how to make this dynamic..
	var taxes = ['category', 'post_tag', 'etc_tax'];

	function MyPostTaxesUI( OriginalComponent ) {
		return function( props ) {
			// props.slug is the taxonomy (slug)
			if ( taxes.indexOf( props.slug ) >= 0 ) {
				return _element.createElement(
					Module, // yes, don't use "HierarchicalTermSelector" here.
					props
				);
			} else {
				return _element.createElement(
					OriginalComponent,
					props
				);
			}
		}
	};

	wp.hooks.addFilter(
		'editor.PostTaxonomyType',
		'my-custom-plugin', // you should change this.
		MyPostTaxesUI
	);
} )(); // end closure
