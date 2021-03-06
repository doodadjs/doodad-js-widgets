//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
	// doodad-js - Object-oriented programming framework
	// File: Widgets_Client.js - Widgets base types (client-side)
	// Project home: https://github.com/doodadjs/
	// Author: Claude Petit, Quebec city
	// Contact: doodadjs [at] gmail.com
	// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
	// License: Apache V2
	//
	//	Copyright 2015-2018 Claude Petit
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

//! IF_SET("mjs")
//! ELSE()
	"use strict";
//! END_IF()

exports.add = function add(modules) {
	modules = (modules || {});
	modules['Doodad.Widgets.Client'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		dependencies: [
			'Doodad.Widgets',
		],

		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				widgets = doodad.Widgets,
				types = doodad.Types,
				tools = doodad.Tools,
				client = doodad.Client,
				io = doodad.IO,
				clientIO = client.IO,
				ioMixIns = io.MixIns,
				//extenders = doodad.Extenders,
				//interfaces = doodad.Interfaces,
				//exceptions = doodad.Exceptions,
				mixIns = doodad.MixIns,
				widgetsMixIns = widgets.MixIns;


			//==================================
			// Mix-ins
			//==================================

			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
				{
					$TYPE_NAME: 'Attributes',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('AttributesMixIn')), true) */,

					applyAttributes: doodad.PROTECTED(function applyAttributes(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};

						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						const attributes = this.getAttributes(cssClassNames),
							keys = types.keys(attributes),
							keysLen = keys.length,
							elementsLen = elements.length;

						for (let i = 0; i < keysLen; i++) {
							const name = keys[i];
							const val = attributes[name];

							for (let j = 0; j < elementsLen; j++) {
								if (types.has(elements, j)) {
									if (types.isNothing(val)) {
										elements[j].removeAttribute(name);
									} else {
										elements[j].setAttribute(name, val);
									};
								};
							};
						};
					}),
				})));

			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
				widgetsMixIns.IdentitiesBase,
				{
					$TYPE_NAME: 'Identities',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('IdentitiesMixIn')), true) */,

					applyIdentity: doodad.PROTECTED(function applyIdentity(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};

						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						const attributes = this.getAttributes(cssClassNames),
							elementsLen = elements.length;

						for (let i = 0; i < elementsLen; i++) {
							if (types.has(elements, i)) {
								const element = elements[i];

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
						};
					}),
				})));

			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
				widgetsMixIns.StylesBase,
				{
					$TYPE_NAME: 'Styles',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('StylesMixIn')), true) */,

					applyStyles: doodad.PROTECTED(function applyStyles(/*optional*/cssClassNames, elements) {
						if (client.isElement(elements)) {
							elements = [elements];
						};

						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArrayLike(elements), "Invalid elements array.");
							root.DD_ASSERT(tools.every(elements, client.isElement), "Invalid elements array.");
						};

						const styles = this.getStyles(cssClassNames),
							keys = types.keys(styles),
							keysLen = keys.length,
							elementsLen = elements.length;

						for (let i = 0; i < keysLen; i++) {
							const name = keys[i];

							let val = styles[name];
							if (types.isNothing(val)) {
								val = null;
							} else if (types.isFunction(val.toString)) {
								val = val.toString();
							};

							for (let j = 0; j < elementsLen; j++) {
								if (types.has(elements, j)) {
									elements[j].style[name] = val;
								};
							};
						};
					}),
				})));

			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.RenderBase.$extend(
				{
					$TYPE_NAME: 'Render',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('RenderMixIn')), true) */,

					acquire: doodad.OVERRIDE(doodad.CALL_FIRST(function acquire() {
						if (types._instanceof(this, clientIO.DomOutputStream)) {
							this._super();
						} else {
							this.overrideSuper();
						};
					})),
					release: doodad.OVERRIDE(doodad.CALL_FIRST(function release() {
						if (types._instanceof(this, clientIO.DomOutputStream)) {
							this._super();
						} else {
							this.overrideSuper();
						};
					})),
				})));

			widgetsMixIns.REGISTER(doodad.MIX_IN(doodad.Class.$extend(
				widgetsMixIns.Render,
				{
					$TYPE_NAME: 'Widget',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('WidgetMixIn')), true) */,
				})));

			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Widget.$extend(
				widgetsMixIns.Attributes,
				widgetsMixIns.Identities,
				widgetsMixIns.Styles,
				mixIns.JsEvents,
				{
					$TYPE_NAME: 'HtmlWidget',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('HtmlWidgetMixIn')), true) */,
				})));


			//==================================
			// Widget base
			//==================================

			widgets.REGISTER(doodad.BASE(io.TextOutputStream.$extend(
				ioMixIns.TextTransformableOut,
				widgetsMixIns.Widget,
				{
					$TYPE_NAME: 'Widget',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('WidgetBase')), true) */,
				})));

			widgets.REGISTER(doodad.BASE(clientIO.DomOutputStream.$extend(
				widgetsMixIns.HtmlWidget,
				{
					$TYPE_NAME: 'HtmlWidget',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('HtmlWidgetBase')), true) */,
				})));

		},
	};
	return modules;
};

//! END_MODULE()
