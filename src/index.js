import nodeQuery from './modules/nodeQuery';
import connect from './modules/connect';


export default class ReactHtmlConnect {
  constructor(createElement, render, options) {
    this.createElement = createElement;
    this.render = render;
    this.options = options;
  }

  connect(component, query) {
    return connect(this.createElement, this.render, component, query, this.options);
  }

  nodeQuery(query) {
    return nodeQuery(query, this.options.scope);
  }
}
