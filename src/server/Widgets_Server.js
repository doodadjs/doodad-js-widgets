//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Widgets_Server.js - Widgets base types (server-side)
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

exports.add = function add(DD_MODULES) {
	DD_MODULES = (DD_MODULES || {});
	DD_MODULES['Doodad.Widgets.Server'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		namespaces: ['MixIns'],
		dependencies: [
			'Doodad.Widgets',
		],
			
		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				//types = doodad.Types,
				io = doodad.IO,
				ioMixIns = io.MixIns,
				widgets = doodad.Widgets,
				widgetsMixIns = widgets.MixIns;
				
				
			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.AttributesBase.$extend(
			{
				$TYPE_NAME: 'Attributes',
				$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('AttributesMixIn')), true) */,
			})));
					
			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
									widgetsMixIns.IdentitiesBase,
			{
				$TYPE_NAME: 'Identities',
				$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('IdentitiesMixIn')), true) */,
			})));
					
			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.Attributes.$extend(
									widgetsMixIns.StylesBase,
			{
				$TYPE_NAME: 'Styles',
				$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('StylesMixIn')), true) */,
			})));
					
			widgetsMixIns.REGISTER(doodad.MIX_IN(widgetsMixIns.RenderBase.$extend(
			{
				$TYPE_NAME: 'Render',
				$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('RenderMixIn')), true) */,
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
				
			widgets.REGISTER(doodad.BASE(io.HtmlOutputStream.$extend(
									widgetsMixIns.HtmlWidget,
			{
				$TYPE_NAME: 'HtmlWidget',
				$TYPE_UUID: '' /*! INJECT('+' + TO_SOURCE(UUID('HtmlWidgetBase')), true) */,
			})));
				
		},
	};
	return DD_MODULES;
};

//! END_MODULE()