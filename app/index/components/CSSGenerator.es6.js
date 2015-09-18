'use strict';

import $ from 'jquery';

export default class CSSGenerator{
  constructor(){
    this.node = $('.css-output-area');
  }

  generate(config){
    let devided = config.unit === 'rem' ? (config.screenWidth / config.screenGrid) : 1;

    let unitify = function(v){
      let t = v / devided;
      return t === 0 ? t : t + config.unit;
    };

    let css = [
      '.' + config.className + ' {',
      '  background: url("' + config.data + '") center center no-repeat scroll;',
      '  background-size: ' + unitify(config.totalWidth) + ' ' + unitify(config.totalHeight) + ';',
      '}'
    ];

    for(let f of config.files){
      css.push('.' + config.className + '.' + config.prefix + f.name + config.sufix + ' {');
      css.push('  width: ' + unitify(f.width) + ';');
      css.push('  height: ' + unitify(f.height) + ';');
      css.push('  background-position: ' + unitify(0 - f.x) + ' ' + unitify(0 - f.y) + ';');
      css.push('}');
    }

    this.node.html(css.join('\n'));
  }
}
