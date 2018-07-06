import nodeQuery from './nodeQuery';


export default function connect(createElement, render, component, name, query = {}, options = {}) {
  const { scope, attribute, library, provider, store } = options;
  const base = scope || document;
  const realAttribute = attribute || 'data-component';

  const nodesList = base.querySelectorAll(`[${realAttribute}="${name}"]`);
  const nodesArray = Array.prototype.slice.call(nodesList);
  return nodesArray.map((node) => {
    const innerHtml = node.innerHTML;
    const props = nodeQuery(query, node);

    const reduxWrap = () => createElement(
      provider,
      { store },
      createElement(component, props),
    );

    const modifiedComp = provider && store ? reduxWrap : component;

    render(
      createElement(modifiedComp, props, null),
      library === 'preact' ? node.parent : node,
      library === 'preact' ? node : null,
    );

    return innerHtml;
  });
}
