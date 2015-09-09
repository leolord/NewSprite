'use strict';

import LightEvent from '../util/light-event';
import Promise from 'bluebird';

export default class ImageFile extends LightEvent{
  constructor(file){
    super();

    this.order = this.width = this.height;
    this.image = null;

    this.file = file;
    this.trimName();
    this.load();
  }

  trimName(){
    let fileName = this.file.name;
    let extPos = fileName.lastIndexOf('.');

    if(extPos !== -1){
      this.name = fileName.slice(0, extPos);
      return;
    }

    this.name = fileName;
  }

  getDemision(){
    return new Promise((resolve, reject)=>{
      let img = new Image();
      img.src = window.URL.createObjectURL(this.file);

      img.onload = ()=>{
        this.height = img.naturalHeight ;
        this.width  = img.naturalWidth;
        this.image  = img;
        window.URL.revokeObjectURL(img.src);

        resolve();
      };

      img.onerror = reject;
    });
  }

  load(){
    this.getDemision()
    .then(()=>{
      this.trigger('ready');
    })['catch']((err)=>{
      console.error('Can not load file ', err);
    });
  }
}
