//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: Widgets_Client.js - Widgets base types (client-side)
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2016 Claude Petit
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//! END_REPLACE()

(function() {
	var global = this;

	var exports = {};
	
	//! BEGIN_REMOVE()
	if ((typeof process === 'object') && (typeof module === 'object')) {
	//! END_REMOVE()
		//! IF_DEF("serverSide")
			module.exports = exports;
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Widgets.Client'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE() */,
			dependencies: [
				'Doodad.Widgets', 
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";
				
				var doodad = root.Doodad,
					widgets = doodad.Widgets,
					types = doodad.Types,
					tools = doodad.Tools,
					client = doodad.Client,
					io = doodad.IO,
					clientIO = client.IO,
					ioMixIns = io.MixIns,
					extenders = doodad.Extenders,
					interfaces = doodad.Interfaces,
					exceptions = doodad.Exceptions,
					mixIns = doodad.MixIns,
					widgetsMixIns = widgets.MixIns;
				
				
				//==================================
				// Mix-ins
				//==================================
				
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
				{
					$TYPE_NAME: 'Attributes',
					
					applyAttributes: doodad.PROTECTED(function applyAttributes(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};
					
						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						var attributes = this.getAttributes(cssClassNames),
							keys = types.keys(attributes),
							keysLen = keys.length,
							elementsLen = elements.length,
							name,
							val;

						for (var i = 0; i < keysLen; i++) {
							name = keys[i];
							val = attributes[name];

							for (var j = 0; j < elementsLen; j++) {
								if (types.isNothing(val)) {
									elements[j].removeAttribute(name);
								} else {
									elements[j].setAttribute(name, val);
								};
							};
						};
					}),
				})));
				
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
												widgetsMixIns.IdentitiesBase,
				{
					$TYPE_NAME: 'Identities',
					
					applyIdentity: doodad.PROTECTED(function applyIdentity(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};
					
						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						var attributes = this.getAttributes(cssClassNames),
							elementsLen = elements.length,
							element,
							classes;

						for (var i = 0; i < elementsLen; i++) {
							element = elements[i];
						
							if (types.isNothing(attributes.id)) {
								element.removeAttribute('id');
							} else {
								element.setAttribute('id', attributes.id);
							};
							
							if (types.isNothing(attributes.name)) {
								element.removeAttribute('name');
							} else {
								element.setAttribute('name', attributes.name);
							};
							
							if (types.isNothing(attributes['class'])) {
								element.removeAttribute('class');
							} else {
								element.setAttribute('class', attributes['class']);
							};
							
						};
					}),
				})));
				
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
												widgetsMixIns.StylesBase,
				{
					$TYPE_NAME: 'Styles',
					
					applyStyles: doodad.PROTECTED(function applyStyles(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};
					
						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						var styles = this.getStyles(cssClassNames),
							keys = types.keys(styles),
							keysLen = keys.length,
							elementsLen = elements.length,
							name,
							val;

						for (var i = 0; i < keysLen; i++) {
							name = keys[i];
							val = styles[name];
							
							if (types.isNothing(val)) {
								val = null;
							} else if (types.isFunction(val.toString)) {
								val = val.toString();
							};

							for (var j = 0; j < elementsLen; j++) {
								elements[j].style[name] = val;
							};
						};
					}),
				})));

				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.RenderBase.$extend(
				{
					$TYPE_NAME: 'Render',
				
					render: doodad.OVERRIDE(doodad.MUST_OVERRIDE(doodad.CALL_FIRST(doodad.BEFORE(widgetsMixIns.RenderBase, function render(/*optional*/container) {
						root.DD_ASSERT && root.DD_ASSERT(types.isNothing(container) || types.isString(container) || client.isElement(container) || types._implements(container, io.HtmlOutputStream), "Invalid container.");

						if (!this.onPreRender()) {
							if (this.stream) {
								this.release();
								this.stream.clear();
							};
							
							if (types.isNothing(container)) {
								container = this.stream;
								root.DD_ASSERT && root.DD_ASSERT(types._implements(container, io.HtmlOutputStream), "Invalid container.");
							};
							
							if (types.isString(container)) {
								container = global.document.getElementById(container);
							};
							
							if (client.isElement(container)) {
								container = new clientIO.DomOutputStream({
									element: container,
								});
							};
							
							this._super(container);
						};
					})))),
					acquire: doodad.OVERRIDE(doodad.CALL_FIRST(function acquire(stream) {
						if (types._instanceof(this.stream, clientIO.DomOutputStream)) {
							this._super(stream);
						};
					})),
					release: doodad.OVERRIDE(doodad.CALL_FIRST(function release() {
						if (types._instanceof(this.stream, clientIO.DomOutputStream)) {
							this._super();
						};
					})),
				})));

				//==================================
				// Widget base
				//==================================
				
				widgets.REGISTER(doodad.BASE(doodad.Object.$extend(
										widgetsMixIns.Render,
				{
					$TYPE_NAME: 'Widget',
				})));
				
				widgets.REGISTER(doodad.BASE(widgets.Widget.$extend(
										widgetsMixIns.Attributes,
										widgetsMixIns.Identities,
										widgetsMixIns.Styles,
										mixIns.JsEvents,
				{
					$TYPE_NAME: 'HtmlWidget',
				})));
				
			},
		};
		
		return DD_MODULES;
	};
	
	
	//! BEGIN_REMOVE()
	if ((typeof process !== 'object') || (typeof module !== 'object')) {
	//! END_REMOVE()
		//! IF_UNDEF("serverSide")
			// <PRB> export/import are not yet supported in browsers
			global.DD_MODULES = exports.add(global.DD_MODULES);
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
}).call(
	//! BEGIN_REMOVE()
	(typeof window !== 'undefined') ? window : ((typeof global !== 'undefined') ? global : this)
	//! END_REMOVE()
	//! IF_DEF("serverSide")
	//! 	INJECT("global")
	//! ELSE()
	//! 	INJECT("window")
	//! END_IF()
);