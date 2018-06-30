import nodeQuery from './nodeQuery';


export default function connect(createElement, render, component, query, options = {}) {
  const { scope, attribute, library } = options;
  const base = scope || document;
  const realAttribute = attribute || 'data-component';

  const nodesList = base.querySelectorAll(`[${realAttribute}="${component.name}"]`);
  const nodesArray = Array.prototype.slice.call(nodesList);

  nodesArray.forEach((node) => {
    const props = nodeQuery(query, node);
    render(
      createElement(component, props, null),
      library === 'preact' ? node.parent : node,
      library === 'preact' ? node : null,
    );
  });
}
