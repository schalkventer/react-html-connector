import nodeQuery from './modules/nodeQuery';
import connect from './modules/connect';


export default class ReactHtmlConnect {
  constructor(createElement, render, options) {
    this.createElement = createElement;
    this.render = render;
    this.options = options;
  }

  connect(Component, query) {
    return connect(this.createElement, this.render, Component, query, this.options);
  }

  nodeQuery(query, node) {
    return nodeQuery(query, node);
  }
}
