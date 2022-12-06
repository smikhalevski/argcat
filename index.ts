const CHAR_CODE_MINUS = 45;

export interface ParseArgsOptions {
  /**
   * The list of option names (can be shorthand or longhand) for which values aren't collected.
   */
  flags?: string[];

  /**
   * The map from a single character shorthand to a multi-character longhand option name.
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

/**
 * Parses process arguments and returns a map from an option name to its value.
 *
 * @param args Arguments retrieved by `process.argv.slice(2)`.
 * @param options Parsing options.
 */
export function parseArgs(args: string[], options: ParseArgsOptions = {}): { [key: string]: string[] | true } {
  const { flags, shorthands, keepShorthands } = options;

  const result: { [key: string]: string[] | true } = {};

  let key: string | undefined = '';

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

        // '--key'
        if (arg.charCodeAt(2) !== CHAR_CODE_MINUS) {
          key = arg.substring(2);

          if (flags?.includes(key)) {
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
          key = arg.charAt(j);

          const longhand = shorthands?.[key];

          if (!longhand && !keepShorthands) {
            // Unknown shorthand
            key = undefined;
            continue;
          }

          key = longhand || key;

          if (flags?.includes(key)) {
            result[key] = true;
            key = '';
          } else {
            result[key] ||= [];
          }
        }
        continue;
      }
    }

    if (key === undefined) {
      continue;
    }

    ((result[key] ||= []) as string[]).push(arg);

    key = '';
  }

  return result;
}
