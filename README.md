<p align="center">
    <a href="#readme">
        <img src="./logo.png" alt="argcat" width="450"/>
    </a>
</p>

The simplest CLI arguments parser.

```sh
npm install --save-prod argcat
```

# Usage

```ts
import { parseArgs } from 'argcat';

const options = parseArgs(process.argv.slice(2));
```

Arguments prefixed with a `'--'` are treated as options:

```ts
parseArgs(['--foo']);
// ⮕  { foo: [] }
```

Options can have values:

```ts
parseArgs(['--foo', 'bar']);
// ⮕  { foo: ['bar'] }

parseArgs(['--foo', '--qux', 'bar']);
// ⮕  { foo: [], qux: ['bar'] }
```

If an option is repeated multiple times then all values are captured in an array:

```ts
parseArgs(['--foo', 'bar', '--foo', 'qux']);
// ⮕  { foo: ['bar', 'qux'] }
```

Arguments that aren't prefixed are stored under `''` key:

```ts
parseArgs(['foo', 'bar']);
// ⮕  { '': ['foo', 'bar'] }
```

There's a special option `'--'`, after which all arguments are stored under `'--'` key:

```ts
parseArgs(['--', '--foo', 'bar']);
// ⮕  { '--': ['--foo', 'bar'] }
```

Mark an option as a flag to prevent value capturing:

```ts
parseArgs(['--foo', 'bar']);
// ⮕  { '--foo': 'bar' }

parseArgs(['--foo', 'bar'], { flags: ['foo'] });
// ⮕  { '--foo': true, '': ['bar'] }
```

Flag options have `true` value instead of an array.


# Shorthands

By default, shorthand options are ignored:

```ts
parseArgs(['-x']);
// ⮕  {}
```

To preserve shorthands, use `keepShorthands` option:

```ts
parseArgs(['-x'], { keepShorthands: true });
// ⮕  { x: [] }
```

Multiple shorthands can be combined:

```ts
parseArgs(['-abc'], { keepShorthands: true });
// ⮕  { a: [], b: [], c: [] }
```

Use `shorthand` mapping to expand shorthands: 

```ts
parseArgs(['-x'], { shorthands: { x: 'foo' } });
// ⮕  { foo: [] }
```

# Type coercion

Combine argcat with [Doubter](https://github.com/smikhalevski/doubter#readme) to validate parsed arguments and to coerce
their types.

```ts
import { parseArgs } from 'argcat';
import * as d from 'doubter';

const argsShape = d.object({
  foo: d.number()
});

const options = argsShape.parse(
  // 😉 Use process.argv.slice(2) instead of an array here 
  parseArgs(['--age', '42']),
  { coerce: true }
);
// ⮕  { age: 42 }
```

<hr>

<p align="center">
    Cat by <a href="https://www.instagram.com/lauragravesart/">Laura Graves</a>
</p>
