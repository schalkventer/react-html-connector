# 🔌 React HTML Connector &middot; [![](https://travis-ci.org/schalkventer/react-html-connector.svg?branch=master)](https://travis-ci.org/schalkventer/react-html-connect) [![](https://img.shields.io/npm/dm/react-html-connector.svg)](https://www.npmjs.com/package/react-html-connector) [![](https://img.shields.io/badge/stability-experimental-orange.svg)](#package-state)

A JavaScript function that eases integration  of [React](https://reactjs.org/) (or [Preact](https://preactjs.com/)) components into existing server-side templating.

Works with:
- [Wordpress](https://wordpress.org)
- [Magento](https://www.magento.com/)
- [Jekyll](https://jekyllrb.com/)
- [Django](https://www.djangoproject.com/)

## Development

This package is still considered experimental. This means that it works as intended, however features may still change or get removed in future versions. It is currently used in-house by the team at [OpenUp](https://github.com/orgs/OpenUpSA), however feel free to try it out and provide feedback via Github issues. If it addresses a use-case that is important to you please let me know at [schalk@openup.org.za](mailto:schalk@openup.org.za).

## Usage

This package is intended to be imported into a NodeJS module resolver like [Webpack](https://webpack.js.org/). 

However it is built in accordance with the [UMD JavaScript specification](https://github.com/umdjs/umd). This means that it can also be pulled directly into the browser via a `<script>` tag from the following URL:

```
<script src="http://unpkg.com/react-html-connector"></script>
```

## Getting Started

##### 1. Make sure that you have the latest version of [NodeJS](https://nodejs.org/en/) installed:

##### 2. Install the package alongside _React_ and _React DOM_:
```
npm install --save react react-dom react-html-connector
```

##### 3. Create your server-side template:
```
// Users.php


<body>
  <div data-component="Users">
    <h1 data-title>Users List</h1>
    <ul>
      <?php foreach ($user_array as $user) { ?>
        <li data-users <?php $user[active] ? echo "data-active" : null ?>
          <span data-name><?php $user[name] ?></span>
        </li>
        >
      <?php } ?>
    </ul>
  </div>
</body>


<script src="scripts.min.js"></script>
```
##### 4. Create your React component

```
// Users.jsx


class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: true,
    }
    
    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll })
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <ul>
          {
            this.props.users.map((user) => {
              if (!this.state.showAll && !user.active) {
                return null;
              }

              return (
                <li key={user.id}>
                  <span>{user.name}</span>
                </li>
              )
            })
          }
        </ul>
        <button onClick={this.toggleShowAll}>
          {this.state.showAll ? 'Hide inactive' : 'Show inactive'}
        </button>
      </div>
    )
  }
}
```


##### 4. Connect React component to your 'data-component' attribute:

```
// scripts.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlConnector from 'react-html-connector';


// Create an instance of React HTML Connector.
const userConnector = new ReactHtmlConnector(React.createElement, ReactDOM.render);


// Define how values from template should be passed as props.
const query = {
  title: 'innerHTML',
  users: [
    {
      id: 'number',
      active: 'boolean',
      name: 'innerHTML',
    }
  ]
}


// Call `connect` to bind the 'User' component and associated properties to your template.
userConnector.connect(Users, 'Users', query)
```

##### 5. Congrats! Your component should be bound to the `data-component="Users"` attribute.
View a live Codepen example of the above at [https://codepen.io/schalkventer/pen/oyJeqg](https://codepen.io/schalkventer/pen/oyJeqg).

## API

### ReactHtmlConnector

The `react-html-connector` package exposes a JavaScript class. The constructor associated with this class returns an object with various methods that can be called to ease integration of React with server-side templating.

```
const connectorInstance = new ReactHtmlConnector(createElement, render, options)
```

##### `createElement <function>` _required_
Needs to be a React (or a React-like) `createElement` method (for example: `React.createElement`). By passing this manually you are able to pass a specific version of React or React-like library. In order to use this package with Preact you need to pass [Hyperscript](https://github.com/hyperhype/hyperscript) instead of the React `createElement` method (for example: `Preact.h`).

##### `render <function>` _required_
Needs to be a React (or React-like) `render` method (for example: `ReactDOM.render`). By passing this manually you are able to pass a specific version of React DOM or React-like library. In order to use this package with Preact you need to pass the Preact render method instead of the React DOM `render` method (for example: `Preact.render`).

##### `options <Object>` _optional | default: null_
Accepts an object of key-value pairs that set specific change the way the returned methods work. See the upcoming parameters for a list of valid `options` values.

##### `options.scope <HTMLelement> `_optional | default: window.document.body_
Restricts the returned connect and nodeQuery methods' searchable range to a specifc HTML node and its children. Useful for avoid conflicting attribute names used elsewhere in your templates.

##### `options.attribute <string> `_optional | default: 'data-component'_
Changes the name of the attribute used to bind components to your templates. Useful when `data-component` is already in use or you want to use a more specific attribute like `data-react-compoment`.

##### `options.library <'react' | 'preact'>` _optional | default: 'react'_ 
Changes how the returned connect method parses params. For example, in Preact you need to pass a fourth parameter into `preact.render` to ensure that a component replaces the targeted HTML node, and not simply appends it to the existing content.

### Methods returned from ReactHtmlConnector constructor:

```
const connectorInstance = new ReactHtmlConnector(createElement, render, options);
connectorInstance.connect(_component_, _query_);
const customQuery = connectorInstance.nodeQuery(_query_);
```

##### `connectorInstance.connect.component <React Component>` _required_
The React (or React-like) component that will be bound to a specific `data-component` attribute in your template.

##### `connectorInstance.connect.name <string>` _required_
The string value used in the `data-component` attribute of the HTML node you want to target. You can have multiple of the same `data-component` string in a template to initialise multiple instances of a component. Note that the node itself (and everything inside) will be swapped out for the React component.

##### `connectorInstance.connect.query <Object | function>` _optional | default: {}_
Object literal that instructs what (and how) values should be parsed from your template into props and passed to the component. The object passed to this parameter uses a custom schema, loosely inspired by [GraphQl](https://graphql.org/). This schema will be documented in more detail at some point (See [Issue #2](https://github.com/schalkventer/react-html-connector/issues/2).

Alternatively, a callback function can be passed to this parameter to override the default querying behaviour above. This callback automatically passes the HTML node itself as its first argument. It also passes the `nodeQuery` method (covered below) as it's second argument. The callback should return an object that will then be passed as [props](https://reactjs.org/docs/components-and-props.html) to the React component.

#### `connectorInstance.nodeQuery.query <Object | function>` _optional | default: {}_
Similar to `instance.connect.query`, however this method allows you to use the custom querying method independantly of the `instance.connect` method. Useful if you want parse values in your template independantly or before the component is rendered.



<!-- ## API



### Primary

connect(_render_, _component_, _props_, _additional options_)
- `createElement <function>`: This needs to be the React (or React-like) `createElement` method (for example: `React.createElement`). By passing this manually you can control what version of React you want to use, and enables compatibility with React-like libraries such as Preact (for example `Preact.h`). 
- `render <function>`: This needs to be a React (or React-like) `render` method (for example: `ReactDOM.render`. By passing this manually you can control what version of React you want to use, and enables compatibility with React-like libraries such as Preact (for example `Preact.h`). 
- `component <React Component>`: 
- `query <Object> | <function> (optional, default: null)`: Optional parameter that instructs the connect function on how to collect and pass values from templates into the component vai props. The value passed to `query` uses custom schema, created specifically for this package (learn more at [Passing props to components](#passing-props-to-components)). Alternatively, `query` also accepts a function for more control over props passed.
- `options <Object>: (optional, default: null)`: Optional parameter that accepts an object of key/value pairs that sets specific rules/conditions. See the next section for all valid values that can be passed inside `options`:

### Additional Options

- `scope <HTMLelement> (optional, default: window.document)`: A property that restricts the connect function's searchable range to a specifc DOM node and its children. Useful to avoid conflicting attribute names used elsewhere in the template.
- `attribute <string> (optional, default: 'data-component')`: A property that changes the name of the attribute used to bind components to your template. Useful when `data-component` is already in use elsewhere.
- `library <'react' | 'preact'> (optional, default 'react')`: Specifies what library's logic should be used to parse the connect function's params. Currently only supports React and Preact.

## Examples

Below area a couple of examples to illustrate the connect function can be used:

**Basic Examples**
- [Basic usage](#basic-usage)
- [Passing props to components](#passing-props-to-components)
- [Initialising multiple components](#initialising-multiple-components)
- [Overriding the query schema](#overriding-the-nodeQuery-function)
- [Using the nodeQuery method independantly](#)
- [Scoping method to specific DOM node](#)

**Query examples**
- [Basic query](#basic-query)
- [Find multiple instances of an attribute](#find-multiple-instances-of-attribute)
- [Nested HTML values](#nested-HTML-values)
- [Advanced Example](#advanced-Example)

### Basic Examples

#### Basic usage:

Let's say that we have following the basic file structure:
```
.
├── index.html
├── Example.jsx
└── scripts.jsx
```

The examples below work under the assumption that `index.html` is a server-side templating file. (It might just as easily be something like `contact-widget.php`). It also assumed that `scripts.jsx` will be the file that gets compiled into your public facing JavaScript file (for example `scripts.min.js`) and then imported into your template.

```
// index.html


<body>
  <div data-component="Example"></div>
</body>
```

```
// Example.jsx


import React from 'react';


export default function Example({ name = 'unknown user' }) {
  return <span>Hello {name}</span>;
}

```

```
// scripts.jsx


import Example from './Example.jsx';
import { render } from 'react-dom';
import connect from 'react-html-connect'


connect(render, <Test />);
```

The first parameter takes a render function. This will either be the `render` function from React DOM or Preact. Passing the `render` method allows you explicitly control what specific library (or version of that library) you want to use.

The second parameter takes the component itself. The name of the component will be converted into a string that is used to match the component to a specific `data-component` attribute. Note that the string is case-sensitive.

The examples above will output the following HTML: 

```
<body>
  <div data-component="Test">
    <span>Hello uknown user</span>
  </div>
</body>
```

#### Passing props to components:

In addition you can pass instructions as an object to the query parameter inside the function. These instructions indicate what values from the HTML to pass to the component.

This instruction object uses a custom schema loosely inspired by GraphQl. See the 'Query Schema' heading below for full instructions on writing a query. 

However, for this specific example you should know only that name of the key in the object indicates the name of the data attribute on the HTML node itself ('data-name' in this case). While the value indicates how the value of this attribute should be parsed. The following example will generate `<span>Hello John Smith</span>`:

```
// index.html


<body>
  <div data-component="Example" data-name="John Smith"></div>
</body>
```

```
// scripts.jsx


import Test from './Test.jsx';
import { render } from 'react-dom';
import connect from 'react-html-connect'


connect(render, <Example />, { name: 'string' });
```

#### Initialising multiple components:

When looking at the example above it becomes clear how instances of React components can be repeated to generate different outputs based on server-side values:

```
// index.html

<body>
  <div data-component="Example"></div>
  <div data-component="Example" data-name="John Smith"></div>
  <div data-component="Example" data-name="Jane Doe"></div>
  <div data-component="Example" data-name="Billy Johnson"></div>
  <div data-component="Example" data-name="Sarah Jackson"></div>
</body>
```

```
// scripts.jsx

import Example from './Example.jsx';
import { render } from 'react-dom';
import connect from 'react-html-connect'


connect(render, <Example />, { name: 'string' });
```

#### Overriding the query schema.

You can override the query parameter by manually passing a function. This allows you the flexibility to edit or customise props passed to the component. The following example will generate `<span>Hello Mr. John Smith</span>`:


```
// scripts.jsx

import Example from './Example.jsx';
import { render } from 'react-dom';
import connect from 'react-html-connect'


const title = 'Mr. '

connect(
  render, 
  <Example />, 
  (node) => {
    const rawName = node.getAttribute('data-name');
    return { name: title + rawName };
  },
);
```

#### Using the nodeQuery method independantly.

Underlying the connect function's _query_ parameter is a function called `nodeQuery` that creates the props object from the query instructions.

Note that this function can be destructed from the package and used independantly. This is very useful when combining the ease of _query_ parameter object with the flexibility of passing a function. The above example can also be written as follows:

```
// scripts.jsx

import Example from './Example.jsx';
import { render } from 'react-dom';
import { nodeQuery }, connect from 'react-html-connect'


const title = 'Mr. '

connect(
  render, 
  <Example />, 
  (node) => {
    const rawName = nodeQuery(node, { name: 'string' });
    return { name: title + rawName };
  },
);
```

The API is as folows: 
nodeQuery(_query_, _node_)
- `query <Object>`
- `scope <HTMLelement>`


#### Scoping method to specific DOM node.

By default the connect function searches the entire DOM via the `window.document` tree. 

However you can narrow the scope to a specific DOM node by passing that node as inside the options parameter. This is usually encouraged to improve performance or to mitigate conflicting attribute names:

```
// index.html

<body>
  <div id="initialise">
    <div data-component="Example"></div>
  </div>
  <div id="ignore">
    <div data-component="Example"></div>
  </div>
</body>
```

```
// index.jsx


import Example from './Example.jsx';
import { render } from 'react-dom';
import connect from 'react-html-helpers'


connect(
  render, 
  <Example />, 
  {}, 
  {
    scope: document.getElementById('initialise')
  }
);
```

### Examples involving the query schema

#### Basic query
```
// HTML


<body>
  <div data-age="30">
</body>
```

```
// index.js


import { nodeQuery } from 'react-html-connect'


console.log(nodeQuery({ age: 'number' }))
```

```
// console output


{ age: 30 }
```

You will see that key in the `query` object is used to find the `data-value` HTML node. Since all custom attributes need to have `data-` prefixed to them, you do not need to repeat `data-` in the key itself. Once the attribute is located the value inside the `query` object determines how to parse its contents. In this example we passed 'number', which means that it is converted to a number via `parseFloat()`.

Valid parse commands are as follows:
- `'string'` returns the attribute value as a string.
- `'number'` returns the attribute value as a number (can include decimals).
- `'boolean'` returns `true` or `false`, depending whether the attribute exists.
- `'json'` returns the attribute value as a JavaScript object (automatically decodes HTML entities).
- `'innerHTML'` returns the innerHTML of the node that the attribute is attached to.
- `'outerHTML'` returns the outerHTML of the node that the attribute is attached to.
- `null` return the node itself.

Lastly, you can also pass a function as a value. This function will then use the HTML node itself as its first parameter. For example the following will return `600`:

```
node => parseInt(node.getAttribute('data-value')) * 2
```

This means that in the example below the query will return the following:
```
// HTML


<body>
  <div data-age="30" data-name="John Smith" data-male data-family='{ "brother": "Billy Johnson", "sister": "Jane Doe" }'>Hello</div>
</body>
```

```
// index.js


import { nodeQuery } from 'react-html-connect'


const query = {
  age: 'number',
  name: 'string',
  male: 'boolean',
  greeting: 'innerHTML'
  family: 'json'
};


console.log(nodeQuery(query))
```

```
// console output


{
  age: 30,
  name: 'John Smith',
  male: true,
  greeting: 'Hello',
  family: { brother: 'Billy Johnson', sister: 'Jane Doe'}
}
```

Note that true to the `JSON.parse()` method, `'json'` is also able to parse an array:
```
// HTML


<body>
  <div data-family='["Billy Johnson", "Jane Doe"]'></div>
</body>
```

```
// index.js


import { nodeQuery } from 'react-html-connect'


console.log(nodeQuery({ family: 'json' }))
```

```
// console output


{ family: ['Billy Johnson', 'Jane Doe'] }
```

In addition, you will notice that the values of `family`, in both examples, are encapsulated in single quotes. This is generally not regarded as good HTML practice since HTML attributes should be encased in double quotes. However, since `JSON.parse()` only accepts double quotes, the outer quotes are swapped as single quotes to not conflict with the inner JSON double quotes. 

This is a quick way to get a JSON string into JavaScript. However, as mentioned this goes against the standard HTML convention and it also means that they might conflict with any single quotes inside the JSON values themselves. Fortunately, we are able to escape double quotes with [HTML entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity). This means that we are able to write the above as follows:
```
// HTML


<body>
  <div data-male data-family="{ &quot;brother&quot;: &quot;Billy Johnson&quot;, &quotsister&quot: &quotJane Doe&quot }'></div>
</body>
```

```
// index.js


import { nodeQuery } from 'react-html-connect'


console.log(nodeQuery({ family: 'json' }))
```

```
// console output


{ family: ['Billy Johnson', 'Jane Doe'] }
```

It's neither pretty nor readable. However we can use an online tool like [Freeformatter](https://www.freeformatter.com/html-escape.html) to encode our string into HTML entities, and also decode them for  debugging or editing. In addition most server-side templating have HTML entity escape functions that you can pass the string through. For example:

- Jekyll: `{{ '{ "brother": "Billy Johnson", "sister": "Jane Doe" }' | escape }}`
- Wordpress: `esc_html('{ "brother": "Billy Johnson", "sister": "Jane Doe" }')`

#### Props from child nodes

It's easy to see how the above `query` parameter can be used to create React component from scratch. However, going further there are cases where you might want some of the content to be rendered by the server-side templating before the JavaScript fires either for performance reasons or SEO concerns. 

It is possible to render HTML server-side and then infer values from it to be used in a React component (often used to replace or enhance the original markup). Luckily the _query_ parameter not only scans the DOM node that a component is bound to but also all of it's children:

```
// HTML


<body>
  <div >
	<h1 data-name>John Smith</h1>
    <p data-bio data-male><strong>John</strong> is a male. His sister is <em>Jane</em>. His brother is <em>Billy</em>. He is <span data-age>30</span> years old.</p>
  </div>
</body>
```

```
// index.js


import { nodeQuery } from 'react-html-connect'

const query = {
  name: 'innerHTML',
  age: node => parseInt(node.innerHTML),
  male: 'boolean',
  bio: 'outerHTML',
}


console.log(nodeQuery(query));
```

```
// console output


{ 
  name: 'John Smith',
  male: true,
  age: 30,
  bio: '<p data-bio data-male><strong>John</strong> is a male. His sister is <em>Jane</em>. His brother is <em>Billy</em>. He is <span data-age>30</span> years old.</p>'
}
```


These data attribute can be anywhere in the DOM tree since `scope` is set to `window.document` by default. This means that you need to be careful to use the same name for two different things (for example 'data-item', 'data-outer-item', data-inner-item, etc.)

### Find multiple instances of attribute

We can instruct our query to collect all instances of `data-people` into an array by placing our query object as the first (and only) value in an array. The key of the array needs to correspond to the name of data attribute ('people' in the example below):

```
// index.HTML


<body>
  <div data-people>
    <h1 data-name>John Smith</h1>
    <p data-bio data-male><strong>John</strong> is a male. His sister is <em data-relatives>Jane</em>. His brother is <em data-relatives>Billy</em>. He is <span data-age>30</span> years old.</p>
  </div>
  <div data-people>
    <h1 data-name>Jane Doe</h1>
    <p data-bio><strong>Jane</strong> is a female. Her brothers are <em data-relatives>Billy</em> and <em data-relatives>John</em>. She is <span data-age>30</span> years old.</p>
  </div>
</body>
```


```
// index.js


import { nodeQuery } from 'react-html-connect'


const query = {
  people: [
    {
      name: 'innerHTML',
      age: node => parseInt(node.innerHTML)
      bio: 'outerHTML',
      relatives: ['innerHTML'],
    }
  ]
}


console.log(nodeQuery(query));
```

```
// console output


{ 
  people: [
    {
      name: 'John Smith',
      male: true,
      age: 30,
      bio: '<p data-bio data-male><strong>John</strong> is a male. His sister is <em data-relatives>Jane</em>. His brother is <em data-relatives>Billy</em>. He is <span data-age>30</span> years old.</p>'
      relatives: ['Jane', 'Billy'],
    },
    { 
      name: 'Jane Doe',
      male: false,
      age: 24,
      bio: '<p data-bio><strong>Jane</strong> is a female. Her brother is <em data-relatives>John</em>. Her other brother is <em data-relatives>Billy</em>. She is <span data-age>24</span> years old. </p>',
      relatives: ['John', 'Billy'],
    }
  ]
```

### Advanced Example

Now that we've gone through all the above, let's end with an example highlighting all the aspects touched upon above:

```
// HTML

<body>
  <div data-component="Other">
    <ul>
      <li data-people>John Smith</li>
      <li data-people>Jane Doe</li>
      <li data-people>Billy Johnson</li>
      <li data-people>Sarah Jackson</li>
    </ul>
  </div>
  <div data-component="People">
    <h1 data-title>Club Members</h1>
    <div data-people data-id="001">
      <h2 data-name>John Smith</h2>
      <p data-bio data-male><strong>John</strong> is a male. His sister is <em data-relative>Jane</em>. His brother is <em data-relative>Billy</em>. He is <span data-age>30</span> years old. </p>
    </div>
    <div data-people data-id="002">
      <h2 data-name>Jane Doe</h2>
      <div><p data-bio><strong>Jane</strong> is a female. Her brother is <em data-relative>John</em>. Her other brother is <em data-relative>Billy</em>. She is <span data-age>24</span> years old. </p></div>
    </div>
    <div>Loading button...</div>
   </div>
</body>
```

```
// scripts.jsx

import People from './People.jsx';
import Other from './Other.jsx';
import { render } from 'react-dom';
import connect from 'react-html-connect'

const peopleQuery = {
  title: 'innerHTML',
  people: [
    {
      id: number,
      name: 'innerHTML',
      age: node => parseInt(node.innerHTML)
      bio: 'outerHTML',
      relatives: ['innerHTML'],
    }
  ]
}

const otherQuery = {
  people: ['innerHTML'],
}


connect(render, <People />, peopleQuery)
connect(render, <Other />, otherQuery)
```

```
// People.jsx

import React from 'react';


function People({ title, people }) {
  const logToConsole = () => console.log(people.map(obj => obj.name));

  const list = people.map(({name, bio, id }) => (
    <div key={id}>
      <h2>{name}</h2>
      <div dangerouslySetInnerHTML={{ __html: bio }}>
    </div>
  ));

  return (
    <div>
      <h1>{title}</h1>
      {list.length > 0 ? list : null}
    </div>
    <div>
      <button onClick={logToConsole}>Log list of people to console</button>
  );
}
```
-->