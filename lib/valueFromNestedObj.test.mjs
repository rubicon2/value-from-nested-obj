import valueFromNestedObj from './valueFromNestedObj.mjs';
import { describe, it, expect } from 'vitest';

describe.only('valueFromNestedObj', () => {
  it.each([
    {
      path: 'my.nested.key',
      pathSeparator: '.',
      obj: {
        my: {
          nested: {
            key: 'my nested value',
          },
        },
      },
      expectedOutput: 'my nested value',
    },
    {
      path: 'a.different.nested.key',
      pathSeparator: '.',
      obj: {
        a: {
          different: {
            nested: {
              key: 'another nested value',
            },
          },
        },
      },
      expectedOutput: 'another nested value',
    },
  ])(
    'can retrieve a value from a deeply nested object in the format $obj',
    ({ path, pathSeparator, obj, expectedOutput }) => {
      const output = valueFromNestedObj(path, pathSeparator, obj);
      expect(output).toStrictEqual(expectedOutput);
    },
  );

  describe('path parameter', () => {
    it.each([
      {
        path: () => {},
        parameterType: 'function',
      },
      {
        path: {},
        parameterType: 'object',
      },
      {
        path: [],
        parameterType: 'object',
      },
      {
        path: 97,
        parameterType: 'number',
      },
    ])(
      'gives a useful error message if the path parameter is not a string, but type $parameterType',
      ({ path, parameterType }) => {
        expect(() => valueFromNestedObj(path, '.', {})).toThrowError(
          'path parameter is not a string, but a ' + parameterType,
        );
      },
    );
  });

  describe('pathSeparator parameter', () => {
    it.each([
      {
        pathSeparator: () => {},
        parameterType: 'function',
      },
      {
        pathSeparator: {},
        parameterType: 'object',
      },
      {
        pathSeparator: [],
        parameterType: 'object',
      },
      {
        pathSeparator: 97,
        parameterType: 'number',
      },
    ])(
      'gives a useful error message if the pathSeparator parameter is not a string, but type $parameterType',
      ({ pathSeparator, parameterType }) => {
        expect(() =>
          valueFromNestedObj('some.path', pathSeparator, {}),
        ).toThrowError(
          'pathSeparator parameter is not a string, but a ' + parameterType,
        );
      },
    );

    it.each([
      {
        path: 'my.nested.key',
        pathSeparator: '.',
        obj: {
          my: {
            nested: {
              key: 'my nested value',
            },
          },
        },
        expectedOutput: 'my nested value',
      },
      {
        path: 'my/nested/key',
        pathSeparator: '/',
        obj: {
          my: {
            nested: {
              key: 'my nested value',
            },
          },
        },
        expectedOutput: 'my nested value',
      },
    ])(
      'works with a pathSeparator of $pathSeparator when provided as the second parameter',
      ({ path, pathSeparator, obj, expectedOutput }) => {
        const output = valueFromNestedObj(path, pathSeparator, obj);
        expect(output).toStrictEqual(expectedOutput);
      },
    );
  });

  describe('obj parameter', () => {
    it.each([
      {
        obj: () => {},
        parameterType: 'function',
      },
      {
        obj: 'my incorrect parameter',
        parameterType: 'string',
      },
      {
        obj: [],
        parameterType: 'array',
      },
      {
        obj: 97,
        parameterType: 'number',
      },
    ])(
      'gives a useful error message if the obj parameter is not an object (and not an array), but type $parameterType',
      ({ obj, parameterType }) => {
        expect(() => valueFromNestedObj('some.path', '', obj)).toThrowError(
          'obj parameter is not an object, but a ' + parameterType,
        );
      },
    );
  });

  it.each([
    {
      type: 'string',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: 'my nested value',
          },
        },
      },
      expectedOutput: 'my nested value',
    },
    {
      type: 'number',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: 97,
          },
        },
      },
      expectedOutput: 97,
    },
    {
      type: 'object',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: {
              myObjField1: 'something',
              myObjField2: 'or other',
            },
          },
        },
      },
      expectedOutput: {
        myObjField1: 'something',
        myObjField2: 'or other',
      },
    },
    {
      type: 'array',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: ['Daria', 'Jane'],
          },
        },
      },
      expectedOutput: ['Daria', 'Jane'],
    },
    {
      type: 'null',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: null,
          },
        },
      },
      expectedOutput: null,
    },
    {
      type: 'undefined',
      path: 'my.nested.key',
      obj: {
        my: {
          nested: {
            key: undefined,
          },
        },
      },
      expectedOutput: undefined,
    },
  ])(
    'works with a nested value of type $type',
    ({ path, obj, expectedOutput }) => {
      const output = valueFromNestedObj(path, '.', obj);
      expect(output).toStrictEqual(expectedOutput);
    },
  );

  it('returns undefined if a path cannot be followed to completion', () => {
    const obj = {
      my: {
        nested: {
          key: 'my nested value',
        },
      },
    };

    const value = valueFromNestedObj('my.incorrect.path', '.', obj);
    expect(value).toBeUndefined();
  });
});
