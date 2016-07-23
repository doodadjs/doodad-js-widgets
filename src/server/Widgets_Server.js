//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: Widgets_Server.js - Widgets base types (server-side)
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
		DD_MODULES['Doodad.Widgets.Server'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE() */,
			namespaces: ['MixIns'],
			dependencies: [
				'Doodad.Widgets',
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";
				
				var doodad = root.Doodad,
					widgets = doodad.Widgets,
					widgetsMixIns = widgets.MixIns;
				
				
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
				{
					$TYPE_NAME: 'Attributes',
				})));
					
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
										widgetsMixIns.IdentitiesBase,
				{
					$TYPE_NAME: 'Identities',
				})));
					
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
										widgetsMixIns.StylesBase,
				{
					$TYPE_NAME: 'Styles',
				})));
					
				widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.RenderBase.$extend(
				{
					$TYPE_NAME: 'Render',
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