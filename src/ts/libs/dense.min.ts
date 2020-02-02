/**
 * Dense - Device pixel ratio aware images
 *
 * @link    http://dense.rah.pw
 * @license MIT
 */

/*
 * Copyright (C) 2013 Jukka Svahn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable */

import $ from "jquery";(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],factory)}else{factory(window.jQuery||window.Zepto)}}(function(){'use strict';var pathStack=[],methods={},regexHasProtocol=/^([a-z]:)?\/\//i,regexSuffix=/\.\w+$/,devicePixelRatio;methods.init=function(options){options=$.extend({dimensions:'preserve',glue:'_',ping:null,skipExtensions:['svg']},options);this.each(function(){var $this=$(this);if(!$this.is('img')||$this.hasClass('dense-image')){return}$this.addClass('dense-image dense-loading');var image=methods.getImageAttribute.call(this),originalImage=$this.attr('src'),ping=false,updateImage;if(!image){if(!originalImage||devicePixelRatio===1||$.inArray(originalImage.split('.').pop().split(/[\?\#]/).shift(),options.skipExtensions)!==-1){$this.removeClass('dense-image dense-loading');return}image=originalImage.replace(regexSuffix,function(extension){return options.glue+devicePixelRatio+'x'+extension});ping=options.ping!==false&&$.inArray(image,pathStack)===-1&&(options.ping===true||!regexHasProtocol.test(image)||image.indexOf('//'+document.domain)===0||image.indexOf(document.location.protocol+'//'+document.domain)===0)}updateImage=function(){var readyImage=function(){$this.removeClass('dense-loading').addClass('dense-ready').trigger('denseRetinaReady.dense')};$this.attr('src',image);if(options.dimensions==='update'){$this.dense('updateDimensions').one('denseDimensionChanged',readyImage)}else{if(options.dimensions==='remove'){$this.removeAttr('width height')}readyImage()}};if(ping){$.ajax({type:'HEAD',url:image}).done(function(data,textStatus,jqXHR){var type=jqXHR.getResponseHeader('Content-type');if(!type||type.indexOf('image/')===0){pathStack.push(image);updateImage()}})}else{updateImage()}});return this};methods.updateDimensions=function(){return this.each(function(){var img,$this=$(this),src=$this.attr('src');if(src){img=new Image();img.src=src;$(img).on('load.dense',function(){$this.attr({height:img.height,width:img.width}).trigger('denseDimensionChanged.dense')})}})};methods.devicePixelRatio=function(){var pixelRatio=1;if($.type(window.devicePixelRatio)!=='undefined'){pixelRatio=window.devicePixelRatio}else if($.type(window.matchMedia)!=='undefined'){$.each([1.3,2,3,4,5,6],function(key,ratio){var mediaQuery=['(-webkit-min-device-pixel-ratio: '+ratio+')','(min-resolution: '+Math.floor(ratio*96)+'dpi)','(min-resolution: '+ratio+'dppx)'].join(',');if(!window.matchMedia(mediaQuery).matches){return false}pixelRatio=ratio})}return Math.ceil(pixelRatio)};methods.getImageAttribute=function(){var $this=$(this).eq(0),image=false,url;for(var i=1;i<=devicePixelRatio;i+=1){url=$this.attr('data-'+i+'x');if(url){image=url}}return image};devicePixelRatio=methods.devicePixelRatio();$.fn.dense=function(method,options){if($.type(method)!=='string'||$.type(methods[method])!=='function'){options=method;method='init'}return methods[method].call(this,options)};$(function(){$('body.dense-retina img').dense()});}));
