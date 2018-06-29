import nodeQuery from './nodeQuery';


export default function connect(createElement, render, Component, query, options = {}) {
  const { scope, attribute, library } = options;
  const base = scope || document;
  const realAttribute = attribute || 'data-component';

  const nodesList = base.querySelectorAll(`[${realAttribute}="${Component.name}"]`);
  const nodesArray = Array.prototype.slice.call(nodesList);

  nodesArray.forEach((node) => {
    const props = nodeQuery(query, node);
    render(createElement(Component, props, null), node, library === 'preact' ? node : null);
  });
}
