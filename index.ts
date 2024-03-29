const CHAR_CODE_MINUS = 45;

export interface ParseArgsOptions {
  /**
   * The list of option keys (can be shorthand or longhand) for which values aren't collected.
   */
  flags?: string[];

  /**
   * The map from a single character shorthand to a multi-character longhand option key.
   */
  shorthands?: { [shorthand: string]: string };

  /**
   * If `true` then shorthands that aren't listed among {@link shorthands} are added to the result. Otherwise, unknown
   * shorthands are ignored.
   *
   * @default false
   */
  keepShorthands?: boolean;
}

export interface ParsedArgs {
  /**
   * Map from an option key to the list of associated values.
   */
  [key: string]: string[] | true | undefined;

  /**
   * The list of args that weren't associated with any option.
   */
  '': string[];

  /**
   * The list of args after `'--'` arg, or `undefined` if there were no `'--'` arg.
   */
  '--'?: string[];
}

/**
 * Parses process arguments and returns a map from an option key to its value.
 *
 * @param args Arguments retrieved by `process.argv.slice(2)`.
 * @param options Parsing options.
 */
export function parseArgs(args: string[], options: ParseArgsOptions = {}): ParsedArgs {
  const { flags, shorthands, keepShorthands } = options;

  const result: ParsedArgs = { '': [] };

  let key: string | null = '';

  for (let i = 0; i < args.length; ++i) {
    const arg = args[i];
    const argLength = arg.length;

    // -*
    if (argLength >= 2 && arg.charCodeAt(0) === CHAR_CODE_MINUS) {
      // --*
      if (arg.charCodeAt(1) === CHAR_CODE_MINUS) {
        // '--'
        if (argLength === 2) {
          result['--'] = args.slice(i + 1);
          break;
        }

        // '--foo'
        if (arg.charCodeAt(2) !== CHAR_CODE_MINUS) {
          key = arg.substring(2);

          if (flags && flags.includes(key)) {
            result[key] = true;
            key = '';
          } else {
            result[key] ||= [];
          }
          continue;
        }
      } else {
        // -abc is the same as -a -b -c

        for (let j = 1; j < argLength; j++) {
          const shorthand = arg.charAt(j);

          const longhand = shorthands ? shorthands[shorthand] : undefined;

          if (!longhand && !keepShorthands) {
            // Unknown shorthand
            key = null;
            continue;
          }

          key = longhand || shorthand;

          if (flags && (flags.includes(shorthand) || (longhand && flags.includes(longhand)))) {
            result[key] = true;
            key = '';
          } else {
            result[key] ||= [];
          }
        }
        continue;
      }
    }

    if (key === null) {
      continue;
    }

    ((result[key] ||= []) as string[]).push(arg);

    key = '';
  }

  return result;
}
