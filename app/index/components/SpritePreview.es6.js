'use strict';

import LightEvent from '../util/light-event';
import $ from 'jquery';

export default class SpritePreview extends LightEvent {
  constructor(){
    super();
    this.$canvas = $('#J_output');
    this.canvas = this.$canvas[0];
    this.pngLink = $('.download-png');
    this.jpgLink = $('.download-jpg');
    this.hardReset = $('.hard-reset');

    this.bind();
  }

  isClickingImage(x, y){
    if(!this.lastConfig) return false;

    let files = this.lastConfig.files;

    for(let i = 0, len = files.length; i < len; ++i){
      let f = files[i];

      if(x > f.x
        & y > f.y
        & x < f.x + f.width
        & y < f.y + f.height){

        return {
          idx: i,
          file: f
        };
      }
    }

    return false;
  }

  bind(){
    let canvas = this.$canvas;
    let lastActiveIdx, lastActiveImage, lastTS;
    let innerX, innerY;

    let realXY = function(x, y, config){
      return {
        x : x / canvas.width() * config.totalWidth,
        y : y / canvas.height() * config.totalHeight
      };
    };
    
    canvas.on('mousedown', (e)=>{
      if(!this.lastConfig)return;

      let {x, y} = realXY(e.offsetX, e.offsetY, this.lastConfig);
      let clickInfo = this.isClickingImage(x, y);

      if(clickInfo){
        if(e.originalEvent.timeStamp - lastTS < 300 && lastActiveIdx === clickInfo.idx){
          this.trigger('delete:file', lastActiveIdx);
          return;
        }

        lastActiveIdx = clickInfo.idx;
        lastActiveImage = clickInfo.file;
        lastTS = e.originalEvent.timeStamp;
        innerX = x - lastActiveImage.x;
        innerY = y - lastActiveImage.y;
      }
    });

    canvas.on('mousemove', (e)=>{
      if(!this.lastConfig) return;

      if(e.buttons > 0 && e.button === 0 && lastActiveImage){
        let {x, y} = realXY(e.offsetX, e.offsetY, this.lastConfig);
        lastActiveImage.x = Math.max(x - innerX, 0);
        lastActiveImage.y = Math.max(y - innerY, 0);
        this.paint(this.lastConfig);
      }
    });

    canvas.on('mouseup', ()=>{
      lastActiveImage = null;
    });

    this.hardReset.on('click', ()=>{
      if(!this.lastConfig) return;

      for(let f of this.lastConfig.files){
        delete f.x;
      }

      this.paint(this.lastConfig);
    });
  }

  getTotalDemision(config){
    let files = config.files;
    let width = 0, height = 0;
    let gap = parseInt(config.gap, 10);

    for(let f of files){
      if(f.x === undefined){
        if(config.direction === 'horizontal'){
          f.x = width + (width > 0 ? gap : 0);
          f.y = 0;
        } else {
          f.x = 0;
          f.y = height + (height > 0 ? gap : 0);
        }
      }

      width = Math.max(width, f.x + f.width);
      height = Math.max(height, f.y + f.height);
    }

    return {
      width,
      height
    };
  }

  paint(config){
    let transparent = config.transparent;

    config.transparent = false;
    this._paint(config);
    config.transparent = transparent;

    if(transparent) this._paint(config);
  }

  /*eslint no-param-reassign:0*/
  _paint(config){
    let canvas = this.canvas,
      ctx = canvas.getContext('2d'),
      dim = this.getTotalDemision(config);

    config.totalWidth = canvas.width = dim.width;
    config.totalHeight = canvas.height = dim.height;

    this.lastConfig = config;

    if(!config.transparent){
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }else{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for(let f of config.files){
      ctx.drawImage(f.image, f.x, f.y);
    }

    let imgData = canvas.toDataURL('image/png');

    config.data = imgData;
    this.pngLink.attr('href', imgData);

    if(config.transparent){
      this.trigger('paint:ready', config);
    } else {
      this.jpgLink.attr('href', canvas.toDataURL('image/jpeg'));
    }
  }
}
