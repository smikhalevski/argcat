import { parseArgs } from './index';

describe('parseArgs', () => {
  test('parses empty args', () => {
    expect(parseArgs([])).toEqual({ '': [], });
  });

  test('parses an arg', () => {
    expect(parseArgs(['--foo'])).toEqual({ '': [], foo: [] });
  });

  test('parses a flag', () => {
    expect(parseArgs(['--foo'], { flags: ['foo'] })).toEqual({ '': [], foo: true });
  });

  test('parses a flag shortcut', () => {
    expect(parseArgs(['-a'], { flags: ['a'], keepShorthands: true })).toEqual({ '': [], a: true });
  });

  test('parses a mixed shortcuts', () => {
    expect(parseArgs(['-ab', 'aaa'], { flags: ['a'], keepShorthands: true })).toEqual({ '': [], a: true, b: ['aaa'] });
    expect(parseArgs(['-ba', 'aaa'], { flags: ['a'], keepShorthands: true })).toEqual({ '': ['aaa'], a: true, b: [], });
  });

  test('parses minus as a value', () => {
    expect(parseArgs(['--foo', '-'])).toEqual({ '': [], foo: ['-'] });
  });

  test('parses a shorthand', () => {
    expect(parseArgs(['-f'], { shorthands: { f: 'foo' } })).toEqual({ '': [], foo: [] });
  });

  test('does not parse a shorthand', () => {
    expect(parseArgs(['-f'])).toEqual({ '': [], });
  });

  test('keeps a shorthand', () => {
    expect(parseArgs(['-f'], { keepShorthands: true })).toEqual({ '': [], f: [] });
  });

  test('parses a multiple merged shorthands', () => {
    expect(parseArgs(['-abc'], { shorthands: { a: 'aaa', b: 'bbb' } })).toEqual({ '': [], aaa: [], bbb: [] });
  });

  test('parses a multiple separate shorthands', () => {
    expect(parseArgs(['-a -b'], { shorthands: { a: 'aaa', b: 'bbb' } })).toEqual({ '': [], aaa: [], bbb: [] });
  });

  test('parses an arg value', () => {
    expect(parseArgs(['--foo', 'bar'])).toEqual({ '': [], foo: ['bar'] });
  });

  test('parses a repeated args', () => {
    expect(parseArgs(['--foo', 'bar', '--foo', 'baz'])).toEqual({ '': [], foo: ['bar', 'baz'] });
  });

  test('parses a shorthand with a value', () => {
    expect(parseArgs(['-f', 'bar'], { shorthands: { f: 'foo' } })).toEqual({ '': [], foo: ['bar'] });
  });

  test('keeps a shorthand with a value', () => {
    expect(parseArgs(['-f', 'bar'], { keepShorthands: true })).toEqual({ '': [], f: ['bar'] });
  });

  test('parses a shorthand with multiple values', () => {
    expect(parseArgs(['-f', 'bar', '-f', 'baz'], { shorthands: { f: 'foo' } })).toEqual({
      '': [],
      foo: ['bar', 'baz']
    });
  });

  test('parses multiple shorthands with a value', () => {
    expect(parseArgs(['-ab', 'bar'], { shorthands: { a: 'aaa', b: 'bbb' } })).toEqual({
      '': [],
      aaa: [],
      bbb: ['bar']
    });
  });

  test('unknown shortcuts do not receive a value', () => {
    expect(parseArgs(['-ab', 'bar'], { shorthands: { a: 'aaa' } })).toEqual({ '': [], aaa: [] });
  });

  test('puts value without an option under ""', () => {
    expect(parseArgs(['bar'])).toEqual({ '': ['bar'] });
    expect(parseArgs(['bar', 'baz'])).toEqual({ '': ['bar', 'baz'] });
  });

  test('does not parse after --', () => {
    expect(parseArgs(['--', '--foo', 'bar'])).toEqual({ '': [], '--': ['--foo', 'bar'] });
  });
});
