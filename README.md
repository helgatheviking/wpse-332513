## About

A sample WordPress plugin which extends the [`HierarchicalTermSelector` component](https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/post-taxonomies/hierarchical-term-selector.js) used in the (Gutenberg) Block Editor.

See https://wordpress.stackexchange.com/q/333143 for details.

## About the files in `js/src`

[`component-babel.js`](js/src/component-babel.js) is a transpiled version of [`component-react.js`](js/src/component-react.js), and it was transpiled via [Babel](https://babeljs.io/repl).

And then I made the following changes:

1. I removed `var _lodash = require("lodash");` and changed all the `_lodash` to `lodash` which is a global variable *on the Edit post screen in WordPress*.

2. I changed all `require("@wordpress/NAME");` to `wp.NAME;` where `NAME` could be `i18n`, `element`, etc. Note: If the `NAME` contains a dash/hypen (`-`) such as `api-fetch`, then you should **make it camel-case**, like so:

``` javascript
// Before:
var _apiFetch = _interopRequireDefault(require("@wordpress/api-fetch"));

// After:
var _apiFetch = _interopRequireDefault(wp.apiFetch); // no `require` here
```

3. I changed `React.createElement` to `_element.createElement`, where`_element` (which was defined via the online Babel compiler<strike>, and it</strike>) is a reference to `wp.element`.

4. I removed the `exports` and renamed `_default` to `Module`.

You can compare these files to see what I changed:

* `component-react.js` vs [`_ref/hierarchical-term-selector.js`](js/src/_ref/hierarchical-term-selector.js)

* `component-babel.js` vs [`_ref/component-babel.js`](js/src/_ref/component-babel.js)

## Notes

1. I hope in the future, WordPress would add a filter to the [`PostTaxonomies` component](https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/post-taxonomies/index.js) which allows us access both the `HierarchicalTermSelector` and [`FlatTermSelector`](https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/post-taxonomies/flat-term-selector.js) components, and return the "proper" component.. Or perhaps, a way for us to access the components from the `wp` object? :)

    That way, we could do something like:
    
    ``` javascript
    var taxes = ['category', 'post_tag', 'etc_tax'];
    
    function MyPostTaxesUI( OriginalComponent ) {
    	return function( props ) {
    		// props.slug is the taxonomy (slug)
    		if ( taxes.indexOf( props.slug ) >= 0 ) {
    			return wp.element.createElement(
    				// If only wp.components.HierarchicalTermSelector exists..
    				class extends wp.components.HierarchicalTermSelector {
    					constructor() {
    						super( ...arguments );
    					},
    					renderTerms( renderedTerms ) {
    						// your code here
    					}
    				}
    				props
    			);
    		} else {
    			return wp.element.createElement(
    				OriginalComponent,
    				props
    			);
    		}
    	}
    };
    
    wp.hooks.addFilter(
    	'editor.PostTaxonomyType',
    	'my-custom-plugin',
    	MyPostTaxesUI
    );
    ```
