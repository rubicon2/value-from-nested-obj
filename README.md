# value-from-nested-obj

Use a file path with a user-specified separator to grab a value from a nested object.

## Install

```sh
npm install value-from-nested-obj
```

## Usage

```js
import valueFromNestedObj from 'value-from-nested-obj';

const objToTraverse = {
  my: {
    nested: {
      path: 'my nested value'
    }
  }
}

// First param is the nested path, the second is the path separator, and the third is the js object
const value = valueFromNestedObj('my.nested.path', '.', objToTraverse);
```
