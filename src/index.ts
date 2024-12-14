import {getObjectTypedKeys, mapObjectValues} from '@augment-vir/common';
import {
    BooleanSupportOption,
    IntSupportOption,
    Parser,
    Plugin,
    Printer,
    RequiredOptions,
    StringSupportOption,
    SupportOption,
} from 'prettier';
import {parsers as tsParsers} from 'prettier/plugins/typescript';
import {parsers as babelParsers} from 'prettier/plugins/babel';
import {MultilineArrayOptions, defaultMultilineArrayOptions, optionHelp} from './options.js';
import {wrapParser} from './preprocessing.js';
import {multilineArrayPrinter} from './printer/multiline-array-printer.js';

// exports in case others want to utilize these
export * from './options.js';
export {pluginMarker} from './plugin-marker.js';

export const parsers: Record<string, Parser> = mapObjectValues(
    {
        typescript: tsParsers.typescript,
        babel: babelParsers.babel,
        'babel-ts': babelParsers['babel-ts'],
        json: babelParsers.json,
        json5: babelParsers.json5,
    },
    (languageName, parserEntry) => {
        return wrapParser(parserEntry, languageName);
    },
);

const printers: Record<string, Printer> = {
    estree: multilineArrayPrinter,
    'estree-json': multilineArrayPrinter,
};

export const options: Record<keyof MultilineArrayOptions, SupportOption> = getObjectTypedKeys(
    defaultMultilineArrayOptions,
).reduce(
    (accum, key) => {
        const defaultValue = defaultMultilineArrayOptions[key];
        const supportOption: StringSupportOption | IntSupportOption | BooleanSupportOption = {
            name: key,
            type: (typeof defaultValue === 'number' ? 'int' : typeof defaultValue) as
                | 'string'
                | 'boolean'
                | 'int',
            category: 'multilineArray',
            default: defaultValue as any,
            description: optionHelp[key],
        };
        accum[key] = supportOption;
        return accum;
    },
    {} as Record<keyof MultilineArrayOptions, SupportOption>,
);

export const defaultOptions: Partial<RequiredOptions> & Required<MultilineArrayOptions> =
    defaultMultilineArrayOptions;

/** Not actually exported: this is just for type checking purposes. */
const plugin: Plugin = {
    options,
    printers,
    defaultOptions,
    parsers,
};
