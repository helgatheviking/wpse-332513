"use strict";

// `exports` and lodash removed

var _i18n = wp.i18n;

var _element = wp.element;

var _components = wp.components;

var _data = wp.data;

var _compose = wp.compose;

var _apiFetch = _interopRequireDefault(wp.apiFetch);

var _url = wp.url;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Internal dependencies
 */
// Copied from gutenberg/packages/editor/src/utils/terms.js

/**
 * Returns terms in a tree form.
 *
 * @param {Array} flatTerms  Array of terms in flat format.
 *
 * @return {Array} Array of terms in tree format.
 */
function buildTermsTree(flatTerms) {
  var flatTermsWithParentAndChildren = flatTerms.map(function (term) {
    return {
      children: [],
      parent: null,
      ...term
    };
  });
  var termsByParent = lodash.groupBy(flatTermsWithParentAndChildren, 'parent');

  if (termsByParent.null && termsByParent.null.length) {
    return flatTermsWithParentAndChildren;
  }

  var fillWithChildren = function fillWithChildren(terms) {
    return terms.map(function (term) {
      var children = termsByParent[term.id];
      return { ...term,
        children: children && children.length ? fillWithChildren(children) : []
      };
    });
  };

  return fillWithChildren(termsByParent['0'] || []);
}
/**
 * Module Constants
 */


var DEFAULT_QUERY = {
  per_page: -1,
  orderby: 'name',
  order: 'asc',
  _fields: 'id,name,parent'
};
var MIN_TERMS_COUNT_FOR_FILTER = 8; // Note: We're always passing just one term ID to the onUpdateTerms

var HierarchicalTermSelector =
/*#__PURE__*/
function (_Component) {
  _inherits(HierarchicalTermSelector, _Component);

  function HierarchicalTermSelector() {
    var _this;

    _classCallCheck(this, HierarchicalTermSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HierarchicalTermSelector).apply(this, arguments));
    _this.findTerm = _this.findTerm.bind(_assertThisInitialized(_this));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.onChangeFormName = _this.onChangeFormName.bind(_assertThisInitialized(_this));
    _this.onChangeFormParent = _this.onChangeFormParent.bind(_assertThisInitialized(_this));
    _this.onAddTerm = _this.onAddTerm.bind(_assertThisInitialized(_this));
    _this.onToggleForm = _this.onToggleForm.bind(_assertThisInitialized(_this));
    _this.setFilterValue = _this.setFilterValue.bind(_assertThisInitialized(_this));
    _this.sortBySelected = _this.sortBySelected.bind(_assertThisInitialized(_this));
    _this.state = {
      loading: true,
      availableTermsTree: [],
      availableTerms: [],
      adding: false,
      formName: '',
      formParent: '',
      showForm: false,
      filterValue: '',
      filteredTermsTree: []
    };
    return _this;
  }

  _createClass(HierarchicalTermSelector, [{
    key: "onChange",
    value: function onChange(event) {
      var _this$props = this.props,
          onUpdateTerms = _this$props.onUpdateTerms,
          _this$props$terms = _this$props.terms,
          terms = _this$props$terms === void 0 ? [] : _this$props$terms,
          taxonomy = _this$props.taxonomy;
      var termId = parseInt(event.target.value, 10);
      onUpdateTerms([termId], taxonomy.rest_base);
    }
  }, {
    key: "onChangeFormName",
    value: function onChangeFormName(event) {
      var newValue = event.target.value.trim() === '' ? '' : event.target.value;
      this.setState({
        formName: newValue
      });
    }
  }, {
    key: "onChangeFormParent",
    value: function onChangeFormParent(newParent) {
      this.setState({
        formParent: newParent
      });
    }
  }, {
    key: "onToggleForm",
    value: function onToggleForm() {
      this.setState(function (state) {
        return {
          showForm: !state.showForm
        };
      });
    }
  }, {
    key: "findTerm",
    value: function findTerm(terms, parent, name) {
      return (0, lodash.find)(terms, function (term) {
        return (!term.parent && !parent || parseInt(term.parent) === parseInt(parent)) && term.name.toLowerCase() === name.toLowerCase();
      });
    }
  }, {
    key: "onAddTerm",
    value: function onAddTerm(event) {
      var _this2 = this;

      event.preventDefault();
      var _this$props2 = this.props,
          onUpdateTerms = _this$props2.onUpdateTerms,
          taxonomy = _this$props2.taxonomy,
          terms = _this$props2.terms,
          slug = _this$props2.slug;
      var _this$state = this.state,
          formName = _this$state.formName,
          formParent = _this$state.formParent,
          adding = _this$state.adding,
          availableTerms = _this$state.availableTerms;

      if (formName === '' || adding) {
        return;
      } // check if the term we are adding already exists


      var existingTerm = this.findTerm(availableTerms, formParent, formName);

      if (existingTerm) {
        // if the term we are adding exists but is not selected select it
        if (!(0, lodash.some)(terms, function (term) {
          return term === existingTerm.id;
        })) {
          onUpdateTerms([existingTerm.id], taxonomy.rest_base);
        }

        this.setState({
          formName: '',
          formParent: ''
        });
        return;
      }

      this.setState({
        adding: true
      });
      this.addRequest = (0, _apiFetch.default)({
        path: "/wp/v2/".concat(taxonomy.rest_base),
        method: 'POST',
        data: {
          name: formName,
          parent: formParent ? formParent : undefined
        }
      }); // Tries to create a term or fetch it if it already exists

      var findOrCreatePromise = this.addRequest.catch(function (error) {
        var errorCode = error.code;

        if (errorCode === 'term_exists') {
          // search the new category created since last fetch
          _this2.addRequest = (0, _apiFetch.default)({
            path: (0, _url.addQueryArgs)("/wp/v2/".concat(taxonomy.rest_base), { ...DEFAULT_QUERY,
              parent: formParent || 0,
              search: formName
            })
          });
          return _this2.addRequest.then(function (searchResult) {
            return _this2.findTerm(searchResult, formParent, formName);
          });
        }

        return Promise.reject(error);
      });
      findOrCreatePromise.then(function (term) {
        var hasTerm = !!(0, lodash.find)(_this2.state.availableTerms, function (availableTerm) {
          return availableTerm.id === term.id;
        });
        var newAvailableTerms = hasTerm ? _this2.state.availableTerms : [term].concat(_toConsumableArray(_this2.state.availableTerms));
        var termAddedMessage = (0, _i18n.sprintf)((0, _i18n._x)('%s added', 'term'), (0, lodash.get)(_this2.props.taxonomy, ['labels', 'singular_name'], slug === 'category' ? (0, _i18n.__)('Category') : (0, _i18n.__)('Term')));

        _this2.props.speak(termAddedMessage, 'assertive');

        _this2.addRequest = null;

        _this2.setState({
          adding: false,
          formName: '',
          formParent: '',
          availableTerms: newAvailableTerms,
          availableTermsTree: _this2.sortBySelected(buildTermsTree(newAvailableTerms))
        });

        onUpdateTerms([term.id], taxonomy.rest_base);
      }, function (xhr) {
        if (xhr.statusText === 'abort') {
          return;
        }

        _this2.addRequest = null;

        _this2.setState({
          adding: false
        });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTerms();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, lodash.invoke)(this.fetchRequest, ['abort']);
      (0, lodash.invoke)(this.addRequest, ['abort']);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.taxonomy !== prevProps.taxonomy) {
        this.fetchTerms();
      }
    }
  }, {
    key: "fetchTerms",
    value: function fetchTerms() {
      var _this3 = this;

      var taxonomy = this.props.taxonomy;

      if (!taxonomy) {
        return;
      }

      this.fetchRequest = (0, _apiFetch.default)({
        path: (0, _url.addQueryArgs)("/wp/v2/".concat(taxonomy.rest_base), DEFAULT_QUERY)
      });
      this.fetchRequest.then(function (terms) {
        // resolve
        var availableTermsTree = _this3.sortBySelected(buildTermsTree(terms));

        _this3.fetchRequest = null;

        _this3.setState({
          loading: false,
          availableTermsTree: availableTermsTree,
          availableTerms: terms
        });
      }, function (xhr) {
        // reject
        if (xhr.statusText === 'abort') {
          return;
        }

        _this3.fetchRequest = null;

        _this3.setState({
          loading: false
        });
      });
    }
  }, {
    key: "sortBySelected",
    value: function sortBySelected(termsTree) {
      var terms = this.props.terms;

      var treeHasSelection = function treeHasSelection(termTree) {
        if (terms.indexOf(termTree.id) !== -1) {
          return true;
        }

        if (undefined === termTree.children) {
          return false;
        }

        var anyChildIsSelected = termTree.children.map(treeHasSelection).filter(function (child) {
          return child;
        }).length > 0;

        if (anyChildIsSelected) {
          return true;
        }

        return false;
      };

      var termOrChildIsSelected = function termOrChildIsSelected(termA, termB) {
        var termASelected = treeHasSelection(termA);
        var termBSelected = treeHasSelection(termB);

        if (termASelected === termBSelected) {
          return 0;
        }

        if (termASelected && !termBSelected) {
          return -1;
        }

        if (!termASelected && termBSelected) {
          return 1;
        }

        return 0;
      };

      termsTree.sort(termOrChildIsSelected);
      return termsTree;
    }
  }, {
    key: "setFilterValue",
    value: function setFilterValue(event) {
      var availableTermsTree = this.state.availableTermsTree;
      var filterValue = event.target.value;
      var filteredTermsTree = availableTermsTree.map(this.getFilterMatcher(filterValue)).filter(function (term) {
        return term;
      });

      var getResultCount = function getResultCount(terms) {
        var count = 0;

        for (var i = 0; i < terms.length; i++) {
          count++;

          if (undefined !== terms[i].children) {
            count += getResultCount(terms[i].children);
          }
        }

        return count;
      };

      this.setState({
        filterValue: filterValue,
        filteredTermsTree: filteredTermsTree
      });
      var resultCount = getResultCount(filteredTermsTree);
      var resultsFoundMessage = (0, _i18n.sprintf)((0, _i18n._n)('%d result found.', '%d results found.', resultCount), resultCount);
      this.props.debouncedSpeak(resultsFoundMessage, 'assertive');
    }
  }, {
    key: "getFilterMatcher",
    value: function getFilterMatcher(filterValue) {
      var matchTermsForFilter = function matchTermsForFilter(originalTerm) {
        if ('' === filterValue) {
          return originalTerm;
        } // Shallow clone, because we'll be filtering the term's children and
        // don't want to modify the original term.


        var term = { ...originalTerm
        }; // Map and filter the children, recursive so we deal with grandchildren
        // and any deeper levels.

        if (term.children.length > 0) {
          term.children = term.children.map(matchTermsForFilter).filter(function (child) {
            return child;
          });
        } // If the term's name contains the filterValue, or it has children
        // (i.e. some child matched at some point in the tree) then return it.


        if (-1 !== term.name.toLowerCase().indexOf(filterValue) || term.children.length > 0) {
          return term;
        } // Otherwise, return false. After mapping, the list of terms will need
        // to have false values filtered out.


        return false;
      };

      return matchTermsForFilter;
    }
  }, {
    key: "renderTerms",
    value: function renderTerms(renderedTerms) {
      var _this4 = this;

      var _this$props3 = this.props,
          _this$props3$terms = _this$props3.terms,
          terms = _this$props3$terms === void 0 ? [] : _this$props3$terms,
          taxonomy = _this$props3.taxonomy;
      var klass = taxonomy.hierarchical ? 'hierarchical' : 'non-hierarchical';
      return renderedTerms.map(function (term) {
        var id = "editor-post-taxonomies-".concat(klass, "-term-").concat(term.id);
        return _element.createElement("div", {
          key: term.id,
          className: "editor-post-taxonomies__hierarchical-terms-choice"
        }, _element.createElement("input", {
          id: id,
          className: "editor-post-taxonomies__hierarchical-terms-input",
          type: "radio",
          checked: terms.indexOf(term.id) !== -1,
          value: term.id,
          onChange: _this4.onChange,
          name: 'radio_tax_input-' + _this4.props.slug
        }), _element.createElement("label", {
          htmlFor: id
        }, (0, lodash.unescape)(term.name)), !!term.children.length && _element.createElement("div", {
          className: "editor-post-taxonomies__hierarchical-terms-subchoices"
        }, _this4.renderTerms(term.children)));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          slug = _this$props4.slug,
          taxonomy = _this$props4.taxonomy,
          instanceId = _this$props4.instanceId,
          hasCreateAction = _this$props4.hasCreateAction,
          hasAssignAction = _this$props4.hasAssignAction;
      var klass = taxonomy.hierarchical ? 'hierarchical' : 'non-hierarchical';

      if (!hasAssignAction) {
        return null;
      }

      var _this$state2 = this.state,
          availableTermsTree = _this$state2.availableTermsTree,
          availableTerms = _this$state2.availableTerms,
          filteredTermsTree = _this$state2.filteredTermsTree,
          formName = _this$state2.formName,
          formParent = _this$state2.formParent,
          loading = _this$state2.loading,
          showForm = _this$state2.showForm,
          filterValue = _this$state2.filterValue;

      var labelWithFallback = function labelWithFallback(labelProperty, fallbackIsCategory, fallbackIsNotCategory) {
        return (0, lodash.get)(taxonomy, ['labels', labelProperty], slug === 'category' ? fallbackIsCategory : fallbackIsNotCategory);
      };

      var newTermButtonLabel = labelWithFallback('add_new_item', (0, _i18n.__)('Add new category'), (0, _i18n.__)('Add new term'));
      var newTermLabel = labelWithFallback('new_item_name', (0, _i18n.__)('Add new category'), (0, _i18n.__)('Add new term'));
      var parentSelectLabel = labelWithFallback('parent_item', (0, _i18n.__)('Parent Category'), (0, _i18n.__)('Parent Term'));
      var noParentOption = "\u2014 ".concat(parentSelectLabel, " \u2014");
      var newTermSubmitLabel = newTermButtonLabel;
      var inputId = "editor-post-taxonomies__".concat(klass, "-terms-input-").concat(instanceId);
      var filterInputId = "editor-post-taxonomies__".concat(klass, "-terms-filter-").concat(instanceId);
      var filterLabel = (0, lodash.get)(this.props.taxonomy, ['labels', 'search_items'], (0, _i18n.__)('Search Terms'));
      var groupLabel = (0, lodash.get)(this.props.taxonomy, ['name'], (0, _i18n.__)('Terms'));
      var showFilter = availableTerms.length >= MIN_TERMS_COUNT_FOR_FILTER;
      return [showFilter && _element.createElement("label", {
        key: "filter-label",
        htmlFor: filterInputId
      }, filterLabel), showFilter && _element.createElement("input", {
        type: "search",
        id: filterInputId,
        value: filterValue,
        onChange: this.setFilterValue,
        className: "editor-post-taxonomies__hierarchical-terms-filter",
        key: "term-filter-input"
      }), _element.createElement("div", {
        className: "editor-post-taxonomies__hierarchical-terms-list",
        key: "term-list",
        tabIndex: "0",
        role: "group",
        "aria-label": groupLabel
      }, this.renderTerms('' !== filterValue ? filteredTermsTree : availableTermsTree)), !loading && hasCreateAction && _element.createElement(_components.Button, {
        key: "term-add-button",
        onClick: this.onToggleForm,
        className: "editor-post-taxonomies__hierarchical-terms-add",
        "aria-expanded": showForm,
        isLink: true
      }, newTermButtonLabel), showForm && _element.createElement("form", {
        onSubmit: this.onAddTerm,
        key: klass + "-terms-form"
      }, _element.createElement("label", {
        htmlFor: inputId,
        className: "editor-post-taxonomies__hierarchical-terms-label"
      }, newTermLabel), _element.createElement("input", {
        type: "text",
        id: inputId,
        className: "editor-post-taxonomies__hierarchical-terms-input",
        value: formName,
        onChange: this.onChangeFormName,
        required: true
      }), taxonomy.hierarchical && !!availableTerms.length && _element.createElement(_components.TreeSelect, {
        label: parentSelectLabel,
        noOptionLabel: noParentOption,
        onChange: this.onChangeFormParent,
        selectedId: formParent,
        tree: availableTermsTree
      }), _element.createElement(_components.Button, {
        isDefault: true,
        type: "submit",
        className: "editor-post-taxonomies__hierarchical-terms-submit"
      }, newTermSubmitLabel))];
      /* eslint-enable jsx-a11y/no-onchange */
    }
  }]);

  return HierarchicalTermSelector;
}(_element.Component);

var Module = (0, _compose.compose)([(0, _data.withSelect)(function (select, _ref) {
  var slug = _ref.slug;

  var _select = select('core/editor'),
      getCurrentPost = _select.getCurrentPost;

  var _select2 = select('core'),
      getTaxonomy = _select2.getTaxonomy;

  var taxonomy = getTaxonomy(slug);
  return {
    hasCreateAction: taxonomy ? (0, lodash.get)(getCurrentPost(), ['_links', 'wp:action-create-' + taxonomy.rest_base], false) : false,
    hasAssignAction: taxonomy ? (0, lodash.get)(getCurrentPost(), ['_links', 'wp:action-assign-' + taxonomy.rest_base], false) : false,
    terms: taxonomy ? select('core/editor').getEditedPostAttribute(taxonomy.rest_base) : [],
    taxonomy: taxonomy
  };
}), (0, _data.withDispatch)(function (dispatch) {
  return {
    onUpdateTerms: function onUpdateTerms(terms, restBase) {
      dispatch('core/editor').editPost(_defineProperty({}, restBase, terms));
    }
  };
}), _components.withSpokenMessages, _compose.withInstanceId])(HierarchicalTermSelector);