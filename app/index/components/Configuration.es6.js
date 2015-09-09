'use strict';

import LightEvent from '../util/light-event';
import $ from 'jquery';
import ImageFile from './ImageFile';

export default class Configuration extends LightEvent {
  constructor(){
    super();

    this.imageFiles = [];

    this.initRef();
    this.bind();
  }

  initRef(){
    let controls = this.controls = {};

    controls.px          = $('#J_unit_px');
    controls.rem         = $('#J_unit_rem');
    controls.screenWidth = $('#J_screen_width');
    controls.screenGrid  = $('#J_screen_grid');
    controls.gap         = $('#J_gap');
    controls.horizontal  = $('#J_horizontal');
    controls.vertical    = $('#J_vertical');
    controls.className   = $('#J_class');
    controls.prefix      = $('#J_prefix');
    controls.sufix       = $('#J_suffix');
    controls.files       = $('#J_files');
    controls.transparent = $('#J_transparent');
    controls.background  = $('#J_background');
  }

  bindUnitRadios(){
    let remBlock = $('.configuration-screen');
    let pxCB     = this.controls.px[0];

    $('input[name="unit"]').on('change', ()=>{
      if(pxCB.checked){
        remBlock.hide();
      }else{
        remBlock.show();
      }
    });
  }

  getConfiguration(){
    let controls = this.controls;

    return {
      unit        : controls.px[0].checked ? 'px' : 'rem',
      screenWidth : controls.screenWidth.val(),
      screenGrid  : controls.screenGrid.val(),
      gap         : controls.gap.val(),
      direction   : controls.horizontal[0].checked ? 'horizontal' : 'vertical',
      className   : controls.className.val(),
      prefix      : controls.prefix.val(),
      sufix       : controls.sufix.val(),
      transparent : controls.transparent[0].checked,
      background  : controls.background.val(),
      files       : this.imageFiles
    };
  }

  bindChange(){
    $('.configuration input[type!="file"]').on('change', ()=>{
      this.trigger('change');
    });
  }

  deleteFile(idx){
    let files = this.imageFiles;
    this.imageFiles = files.slice(0, idx).concat(files.slice(idx + 1));
    this.trigger('change');
  }

  addImageFiles(files){
    let self = this;

    let addToImageFiles = function(img){
      return function(){
        self.imageFiles.push(img);
        self.trigger('change');
      };
    };

    for (let i = 0; i < files.length; ++i) {
      let img = files[i];
      if(!img.type.match('^image/')) continue;

      let tmp = new ImageFile(img);
      tmp.on('ready', addToImageFiles(tmp));
    }
  }

  bindImageSelected(){
    let fileInput = this.controls.files;
    let rawFileInput = fileInput[0];

    fileInput.on('change', ()=>{
      this.addImageFiles(rawFileInput.files);
    });
  }

  bindDropFile(){
    let body = $('body');

    body.on('dragover dropover', function(e){
      body.addClass('drop-over');
      e.stopPropagation();
      e.preventDefault();
    });

    body.on('dragleave', function(){
      body.removeClass('drop-over');
    });

    body.on('drop', (e)=>{
      e.stopPropagation();
      e.preventDefault();
      let files = e.originalEvent.dataTransfer.files;
      this.addImageFiles(files);
      body.removeClass('drop-over');
    });
  }

  bind(){
    this.bindUnitRadios();
    this.bindChange();
    this.bindImageSelected();
    this.bindDropFile();
  }
}
