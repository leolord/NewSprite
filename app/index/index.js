/**
 * @module index
 * @author 吴建涛(fortomorrow@163.com)
 * @date Tue Sep 08 2015 16:02:48 GMT+0800 (CST)
 * */
'use strict';

var $ = require('jquery');
var Configuration = require('./components/Configuration');
var SpritePreview = require('./components/SpritePreview');
var CSSGenerator  = require('./components/CSSGenerator');

$(function(){
  var cfg = new Configuration();
  var preview = new SpritePreview();
  var css = new CSSGenerator();

  cfg.on('change', function(){
    preview.paint(cfg.getConfiguration());
  });

  preview.on('paint:ready', function(e){
    css.generate(e._args);
  });

  preview.on('delete:file', function(e){
    cfg.deleteFile(e._args);
  });
});
