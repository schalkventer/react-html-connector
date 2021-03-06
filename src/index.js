import nodeQuery from './modules/nodeQuery';
import connect from './modules/connect';


export default class ReactHtmlConnect {
  constructor(createElement, render, options) {
    this.createElement = createElement;
    this.render = render;
    this.options = options;
    this.originalHtml = [];

    this.connect = this.connect.bind(this);
    this.nodeQuery = this.nodeQuery.bind(this);
  }

  connect(component, name, query) {
    this.originalState = connect(
      this.createElement,
      this.render,
      component,
      name,
      query,
      this.options,
    );

    return null;
  }

  nodeQuery(query) {
    return nodeQuery(query, this.options.scope);
  }
}
