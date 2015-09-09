'use strict';

import $ from 'jquery';

/**
 * 利用document元素作为总线编写的极简的事件支持，需要通过继承的方式添加事件支持
 *
 * 使用了一个全局变量**window._eventObjId**
 * */
window._eventObjId = 1;
let doc = $(document);

export default class LightEvent{
  constructor(){
    this.id = window._eventObjId++;
  }

  on(event, cb){
    doc.on(this.id + ':' + event, cb);
  }

  off(event, cb){
    doc.off(this.id + ':' + event, cb);
  }

  trigger(_event, data){
    if($.zepto){
      var event = this.id + ':' + _event;
      doc.trigger(event, data);
      return;
    }

    let eventObj = {
      type: this.id + ':' + _event,
      _args: data
    };
    doc.trigger(eventObj);
  }
}
