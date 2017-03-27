//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Widgets.js - Widgets base types
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2017 Claude Petit
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

module.exports = {
	add: function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Widgets'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
			namespaces: ['MixIns'],
			
			create: function create(root, /*optional*/_options, _shared) {
				"use strict";
				
				const doodad = root.Doodad,
					widgets = doodad.Widgets,
					types = doodad.Types,
					tools = doodad.Tools,
					io = doodad.IO,
					ioMixIns = doodad.IO.MixIns,
					extenders = doodad.Extenders,
					interfaces = doodad.Interfaces,
					exceptions = doodad.Exceptions,
					mixIns = doodad.MixIns,
					widgetsMixIns = widgets.MixIns;
				
				
				//==================================
				// Mix-ins
				//==================================
				
				widgetsMixIns.REGISTER(doodad.BASE(doodad.MIX_IN(doodad.Class.$extend(
				{
					$TYPE_NAME: 'AttributesBase',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('AttributesBaseMixIn')), true) */,
					
					__attributes: doodad.PROTECTED(doodad.READ_ONLY(doodad.ATTRIBUTE({
						main: null,
					}, extenders.ExtendObject, {maxDepth: 1, isPreserved: true, cloneOnInit: true}))),

					validateCssClassNames: doodad.PROTECTED(function validateCssClassNames(/*optional*/cssClassNames) {
						if (types.isNothing(cssClassNames)) {
							cssClassNames = ['main'];
						} else if (types.isString(cssClassNames)) {
							cssClassNames = cssClassNames.split(' ');
						};
						
						if (root.DD_ASSERT) {
							root.DD_ASSERT(types.isArray(cssClassNames), "Invalid css class names.");
							root.DD_ASSERT(tools.every(cssClassNames, function(name) {
								return types.has(this.__attributes, name)
							}, this), "Invalid css class names.");
						};
						
						return cssClassNames;
					}),
					
					getAttributes: doodad.PUBLIC(function getAttributes(/*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						const cssClassNamesLen = cssClassNames.length;

						let attributes;

						if (cssClassNamesLen === 1) {
							const cssClassName = cssClassNames[0];
							attributes = this.__attributes[cssClassName];
							if (!attributes) {
								this.__attributes[cssClassName] = attributes = {};
							};
						} else {
							attributes = {};
							const classes = [];
							for (let i = 0; i < cssClassNamesLen; i++) {
								if (types.has(cssClassNames, i)) {
									const cssClassName = cssClassNames[i];
									const attrs = this.__attributes[cssClassName];
									if (attrs) {
										if (attrs['class']) {
											types.append(classes, attrs['class'].split(' '));
										};
										attributes = types.extend(attributes, attrs);
									};
								};
							};
							if (classes.length) {
								attributes['class'] = types.unique(classes).join(' ');
							};
						};
						
						return attributes;
					}),
					setAttributes: doodad.PUBLIC(function setAttributes(attributes, /*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						root.DD_ASSERT && root.DD_ASSERT(types.isJsObject(attributes), "Invalid attributes object.");
						
						const cssClassNamesLen = cssClassNames.length;

						if (attributes.class) {
							const classes = types.unique(attributes['class'].split(' '));
							for (let i = classes.length - 1; i >= 0; i--) {
								const name = classes[i];
								if (name) {
									classes[i] = name.toLowerCase();
								} else {
									classes.splice(i, 1);
								};
							};
							attributes.class = classes.join(' ');
						};
						for (let i = 0; i < cssClassNamesLen; i++) {
							if (types.has(cssClassNames, i)) {
								const cssClassName = cssClassNames[i];
								this.__attributes[cssClassName] = attributes;
							};
						};
					}),
					renderAttributes: doodad.PROTECTED(function renderAttributes(/*optional*/cssClassNames) {
						const attributes = this.getAttributes(cssClassNames);
					
						let result = '';

						const keys = types.keys(attributes),
							keysLen = keys.length;
							
						for (let i = 0; i < keysLen; i++) {
							const name = keys[i],
								val = attributes[name];
								
							if (!types.isNothing(val)) {
								result += ' ' + tools.escapeHtml(name) + '="' + tools.escapeHtml(val) + '"';
							};
						};
						
						return result;
					}),
					linkAttributes: doodad.PUBLIC(doodad.CALL_FIRST(function linkAttributes(source, /*optional*/sourceCssClassName, /*optional*/cssClassName) {
						root.DD_ASSERT && root.DD_ASSERT((source !== this) && types._implements(source, widgetsMixIns.Attributes), "Invalid source object.");
						
						sourceCssClassName = source.validateCssClassNames(sourceCssClassName)[0];

						if (types.isNothing(cssClassName)) {
							cssClassName = sourceCssClassName;
						};
						
						this.__attributes[cssClassName] = source.__attributes[sourceCssClassName];
						
						this._super(source, sourceCssClassName, cssClassName);
					})),
					clearAttributes: doodad.PUBLIC(doodad.CALL_FIRST(function clearAttributes(/*optional*/cssClassName) {
						if (types.isNothing(cssClassName)) {
							this.restorePreserved('__attributes');
						} else {
							cssClassName = this.validateCssClassNames(cssClassName)[0];
							const preserved = this.getPreserved('__attributes');
							if (types.has(preserved, cssClassName)) {
								this.__attributes[cssClassName] = preserved[cssClassName];
							} else {
								delete this.__attributes[cssClassName];
							};
						};
						
						this._super(cssClassName);
					})),
				}))));
				
				widgetsMixIns.REGISTER(doodad.BASE(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
				{
					$TYPE_NAME: 'IdentitiesBase',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('IdentitiesBaseMixIn')), true) */,
					
					__identities: doodad.PROTECTED(doodad.READ_ONLY(doodad.ATTRIBUTE({
						main: null,
					}, extenders.ExtendObject, {maxDepth: 1, isPreserved: true, cloneOnInit: true}))),

					getIdentity: doodad.PUBLIC(function getIdentity(/*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						let identity;

						const cssClassNamesLen = cssClassNames.length;
						
						if (cssClassNamesLen === 1) {
							const cssClassName = cssClassNames[0];
							identity = this.__identities[cssClassName];
							if (!identity) {
								this.__identities[cssClassName] = identity = {
									id: null,
									name: null,
									class: null,
								};
							};
						} else {
							identity = {
								id: null,
								name: null,
								class: null,
							};
							
							const classes = [];
							
							for (let i = 0; i < cssClassNamesLen; i++) {
								if (types.has(cssClassNames, i)) {
									const cssClassName = cssClassNames[i];
									const attrs = this.__identities[cssClassName];
									if (attrs) {
										if (!types.isNothing(attrs.id)) {
											identity.id = attrs.id;
										};
										if (!types.isNothing(attrs.name)) {
											identity.name = attrs.name;
										};
										if (types.isStringAndNotEmpty(attrs.class)) {
											types.append(classes, attrs.class.split(' '));
										};
									};
								};
							};
							
							if (classes.length) {
								identity.class = types.unique(classes).join(' ');
							};
						};

						return identity;
					}),

					setIdentity: doodad.PUBLIC(function setIdentity(identity, /*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						root.DD_ASSERT && root.DD_ASSERT(types.isJsObject(identity), "Invalid identity object.");
						
						const cssClassNamesLen = cssClassNames.length;
						
						identity = {
							id: identity.id || null,
							name: identity.name || null,
							class: identity.class || null,
						};

						if (identity.class) {
							const classes = types.unique(identity.class.split(' '));
							for (let i = classes.length - 1; i >= 0; i--) {
								const name = classes[i];
								if (name) {
									classes[i] = name.toLowerCase();
								} else {
									classes.splice(i, 1);
								};
							};
							identity.class = classes.join(' ');
						};

						for (let i = 0; i < cssClassNamesLen; i++) {
							if (types.has(cssClassNames, i)) {
								const cssClassName = cssClassNames[i];
								this.__identities[cssClassName] = identity;
							};
						};
					}),
					
					getAttributes: doodad.OVERRIDE(function getAttributes(/*optional*/cssClassNames) {
						const attributes = this._super(cssClassNames),
							identity = this.getIdentity(cssClassNames);

						if (identity.id) {
							attributes.id = identity.id;
						};
						
						if (identity.name) {
							attributes.name = identity.name;
						};
						
						if (identity.class) {
							if (attributes.class) { 
								// Merge classes from attributes and identity
								let classes = attributes.class.split(' ');
								types.append(classes, identity.class.split(' '));
								classes = types.unique(classes);
								attributes.class = classes.join(' ');
							} else {
								attributes.class = identity.class;
							};
						};
						
						return attributes;
					}),
					linkAttributes: doodad.OVERRIDE(function linkAttributes(source, /*optional*/sourceCssClassName, /*optional*/cssClassName) {
						if (types._implements(source, widgetsMixIns.Identities), "Invalid source object.") {
							var	identities = source.__identities,
								identity = identities[sourceCssClassName];
							if (!identity) {
								identities[sourceCssClassName] = identity = {
									id: null,
									name: null,
									'class': null,
								};
							};
							this.__identities[cssClassName] = identity;
						};
						
						this._super(source, sourceCssClassName, cssClassName);
					}),
					clearAttributes: doodad.OVERRIDE(function clearAttributes(/*optional*/cssClassName) {
						if (types.isNothing(cssClassName)) {
							this.restorePreserved('__identities');
						} else {
							const preserved = this.getPreserved('__identities');
							if (types.has(preserved, cssClassName)) {
								this.__identities[cssClassName] = preserved[cssClassName];
							} else {
								delete this.__identities[cssClassName];
							};
						};

						this._super(cssClassName);
					}),
				}))));
				
				const __styleRegEx__ = /([a-z0-9]+)([A-Z])?/g;

				widgetsMixIns.REGISTER(doodad.BASE(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
				{
					$TYPE_NAME: 'StylesBase',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('StylesBaseMixIn')), true) */,
					
					__styles: doodad.PROTECTED(doodad.READ_ONLY(doodad.ATTRIBUTE({
						main: null,
					}, extenders.ExtendObject, {maxDepth: 1, isPreserved: true, cloneOnInit: true}))),

					getStyles: doodad.PUBLIC(function getStyles(/*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						let styles;

						const cssClassNamesLen = cssClassNames.length;
						
						if (cssClassNamesLen === 1) {
							const cssClassName = cssClassNames[0];
							styles = this.__styles[cssClassName];
							if (!styles) {
								this.__styles[cssClassName] = styles = {};
							};
						} else {
							styles = {};
							for (let i = 0; i < cssClassNamesLen; i++) {
								if (types.has(cssClassNames, i)) {
									const cssClassName = cssClassNames[i];
									const attrs = this.__styles[cssClassName];
									if (attrs) {
										styles = types.extend(styles, attrs);
									};
								};
							};
						};
						
						return styles;
					}),
					setStyles: doodad.PUBLIC(function setStyles(styles, /*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);
						
						root.DD_ASSERT && root.DD_ASSERT(types.isJsObject(styles), "Invalid styles object.");

						const cssClassNamesLen = cssClassNames.length;
						
						for (let i = 0; i < cssClassNamesLen; i++) {
							if (types.has(cssClassNames, i)) {
								const cssClassName = cssClassNames[i];
								this.__styles[cssClassName] = styles;
							};
						};
					}),
					
					getAttributes: doodad.OVERRIDE(function getAttributes(/*optional*/cssClassNames) {
						cssClassNames = this.validateCssClassNames(cssClassNames);

						const attributes = this._super(cssClassNames),
							styles = this.getStyles(cssClassNames),
							keys = types.keys(styles),
							keysLen = keys.length;

						let result = '';
							
						for (let i = 0; i < keysLen; i++) {
							const name = keys[i];
							let val = styles[name];
								
							if (!types.isNothing(val)) {
								__styleRegEx__.lastIndex = 0;
								
								let newName = '',
									sep = __styleRegEx__.exec(name);
									
								while (sep) {
									newName += sep[1];
									if (sep[2]) {
										newName += '-' + sep[2].toLowerCase();
									};
									sep = __styleRegEx__.exec(name);
								};
								
								if (newName.length) {
									if (types.isFunction(val.toString)) {
										val = val.toString();
									};
									result += newName + ':' + val + ';';
								};
							};
						};
						
						if (result.length) {
							attributes.style = result;
						} else {
							delete attributes.style;
						};

						return attributes;
					}),
					linkAttributes: doodad.OVERRIDE(function linkAttributes(source, /*optional*/sourceCssClassName, /*optional*/cssClassName) {
						if (types._implements(source, widgetsMixIns.Styles), "Invalid source object.") {
							var	styles = source.__styles,
								style = styles[sourceCssClassName];
							if (!style) {
								styles[sourceCssClassName] = style = {};
							};
							this.__styles[cssClassName] = style;
						};
						
						this._super(source, sourceCssClassName, cssClassName);
					}),
					clearAttributes: doodad.OVERRIDE(function clearAttributes(/*optional*/cssClassName) {
						if (types.isNothing(cssClassName)) {
							this.restorePreserved('__styles');
						} else {
							const preserved = this.getPreserved('__styles');
							if (types.has(preserved, cssClassName)) {
								this.__styles[cssClassName] = preserved[cssClassName];
							} else {
								delete this.__styles[cssClassName];
							};
						};
						
						this._super(cssClassName);
					}),
				}))));

				widgetsMixIns.REGISTER(doodad.BASE(doodad.MIX_IN(doodad.Class.$extend(
											mixIns.Events,
				{
					$TYPE_NAME: 'RenderBase',
					$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('RenderBaseMixIn')), true) */,
				
					onPreRender: doodad.EVENT(true), // function onPreRender(ev)
					onRender: doodad.EVENT(false), // function onRender(ev)
					onPostRender: doodad.EVENT(false), // function onPostRender(ev)
					
					stream: doodad.PUBLIC(doodad.READ_ONLY(null)),
					__rendered: doodad.PROTECTED(false),
					
					setStream: doodad.PUBLIC(function setStream(stream) {
						root.DD_ASSERT && root.DD_ASSERT(types._implements(stream, ioMixIns.TextOutput), "Invalid stream.");

						if (this.__rendered) {
							this.__rendered = false;
							this.release();
							this.stream.clear();
						};
						
						_shared.setAttribute(this, 'stream', stream);
					}),
					
					render: doodad.PUBLIC(doodad.ASYNC(doodad.MUST_OVERRIDE(doodad.CALL_FIRST(function render() {
						root.DD_ASSERT && root.DD_ASSERT(types._implements(this.stream, ioMixIns.TextOutput), "Invalid stream.");

						if (this.__rendered) {
							this.__rendered = false;
							this.release();
							this.stream.clear();
						};

						if (!this.onPreRender()) {
							return this._super()
								.then(function renderPromise() {
									this.__rendered = true;
									
									this.onRender(new doodad.Event());
									
									if (this.stream._implements(ioMixIns.BufferedStreamBase)) {
										this.stream.flush();
									};
									
									this.acquire();
									
									this.onPostRender();
								}, null, this);
						};
					})))),
					
					acquire: doodad.PROTECTED(doodad.METHOD()), // function acquire()
					
					release: doodad.PROTECTED(doodad.METHOD()), // function release()
				}))));

			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()