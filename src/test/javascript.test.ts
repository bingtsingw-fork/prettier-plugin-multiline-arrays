import {describe} from '@augment-vir/test';
import {capitalizeFirst} from '../augments/string.js';
import {nextLinePatternComment, nextWrapThresholdComment} from '../options.js';
import {MultilineArrayTest, runTests} from './run-tests.mock.js';

const javascriptTests: MultilineArrayTest[] = [
    {
        it: 'comment at end of argument list with multiline array parser',
        code: `
            export function hasProperty(
                inputObject,
                inputKey,
                // this comment shouldn't get moved
            ) {
                return inputKey in inputObject;
            }
        `,
    },
    {
        it: 'basic wrap threshold comment',
        code: `
            // ${nextWrapThresholdComment} 3
            const thingieArray = ['hello'];
        `,
    },
    {
        it: 'works with greater than or less than inside of an array in javascript',
        code: `
            const thingie = [
                otherThingie < 5 ? 'owl' : 'goat',
            ];
        `,
    },
    {
        it: 'invalid wrap threshold triggers error',
        code: `
            const thingieArray = ['hello'];
        `,
        options: {
            multilineArraysWrapThreshold: 'fifty two' as any,
        },
        failureMessage:
            'Invalid multilineArraysWrapThreshold value. Expected an integer, but received "fifty two".',
    },
    {
        it: 'wrap threshold through options',
        code: `
            const thingieArray = ['hello'];
        `,
        options: {
            multilineArraysWrapThreshold: 3,
        },
    },
    {
        it: 'line count through options',
        code: `
            const thingieArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        `,
        expect: `
            const thingieArray = [
                'a',
                'b', 'c',
                'd', 'e', 'f',
                'g',
                'h',
            ];
        `,
        options: {
            multilineArraysLinePattern: '1 2 3',
        },
    },
    {
        it: 'line count overrides threshold',
        code: `
            const thingieArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        `,
        expect: `
            const thingieArray = [
                'a',
                'b', 'c',
                'd', 'e', 'f',
                'g',
                'h',
            ];
        `,
        options: {
            multilineArraysLinePattern: '1 2 3',
            multilineArraysWrapThreshold: 20,
        },
    },
    {
        it: 'pointless wrap threshold comment',
        code: `
            // ${nextWrapThresholdComment} 0
            const thingieArray = [
                'hello',
            ];
        `,
    },
    {
        // this was causing an error on the closing "}" at one point
        it: 'interpolated string example',
        code: `
            if (children.length) {
                // ${nextWrapThresholdComment} 1
                return [\`\${input.type}:\`];
            }
        `,
    },
    {
        it: 'array elements with dots',
        code: `
            parentDoc[childIndex] = [
                doc.builders.hardlineWithoutBreakParent,
                doc.builders.breakParent,
            ];
        `,
    },
    {
        it: 'single line comment with just one line count',
        code: `
            // ${nextLinePatternComment} 2
            const originalArray = [
                0,
                1,
                2,
                3,
                4,
            ];
        `,
        expect: `
            // ${nextLinePatternComment} 2
            const originalArray = [
                0, 1,
                2, 3,
                4,
            ];
        `,
    },
    {
        it: 'single line comment with just one line wrapped',
        code: `
            describe(filterMap.name, () => {
                // ${nextLinePatternComment} 2
                const originalArray = [
                    0,
                    1,
                    2,
                    3,
                    4,
                ];
            });
        `,
        expect: `
            describe(filterMap.name, () => {
                // ${nextLinePatternComment} 2
                const originalArray = [
                    0, 1,
                    2, 3,
                    4,
                ];
            });
        `,
    },
    {
        // caused a max call stack exceeded error once
        it: 'single object element with multiline template',
        code: `
        
        
        
        
            const stuff = [
            
            
                {
                    innerStuff: \`
                        const myVar = {a: 'where', b: 'everywhere'};
                    \`,
                },
            ];
        `,
        expect: `
            const stuff = [
                {
                    innerStuff: \`
                        const myVar = {a: 'where', b: 'everywhere'};
                    \`,
                },
            ];
        `,
    },
    {
        it: 'long function definition with multiline array parser',
        code: `
            export async function selectFiles(
                inputProperties = [
                    OpenDialogProperty.multiSelections,
                    OpenDialogProperty.openFile,
                    OpenDialogProperty.openDirectory,
                ],
            ) {}
        `,
    },
    {
        it: 'comment after end of block with multiline array parser',
        code: `
            if (thing) {
            }
            // otherwise we are editing currently existing songs
            else {
            }
        `,
    },
    {
        it: 'should still sort imports with multiline parser',
        code: `
            import {notUsed} from 'blah';
            const thingie = [
                'a',
                'b',
            ];
        `,
        expect: `
            const thingie = [
                'a',
                'b',
            ];
        `,
    },
    {
        it: 'deep array call should include trailing comma still',
        code: `
            expect(createArrayValidator(typeofValidators.boolean)([3, 4])).toBe(false);
        `,
        expect: `
            expect(
                createArrayValidator(typeofValidators.boolean)([
                    3,
                    4,
                ]),
            ).toBe(false);
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'not arrays but callbacks with multiline array parser',
        code: `
            expose({
                versions,
                apiRequest: async (details) => {
                    async function waitForResponse() {
                        return new Promise((resolve) => {
                            ipcRenderer.once(
                                getApiResponseEventName(details.type, requestId),
                                (event, data) => {
                                    resolve(data);
                                },
                            );
                        });
                    }
                },
            });
        `,
    },
    {
        it: 'function parameters',
        code: `
            doTheThing('a', 'b', 'c');
        `,
    },
    {
        it: 'config object',
        code: `
            const config = {
                directories: {
                    output: 'dist',
                    buildResources: 'build-resources',
                },
                files: [
                    'packages/**/dist/**',
                ],
                extraMetadata: {
                    version: viteVersion,
                },
            };
        `,
    },
    {
        it: 'nested single-line objects on multiple lines',
        code: `
            const nested = [
                {success: true, filePath: ''},
                {success: false, error: 'hello there', filePath: ''},
                {success: false, error: '', filePath: ''},
            ];
        `,
    },
    {
        it: 'nested single-line objects all on one line',
        code: `
            const nested = [{success: true, filePath: ''}, {success: false, error: 'hello there', filePath: ''}, {success: false, error: '', filePath: ''}];
        `,
        expect: `
            const nested = [
                {success: true, filePath: ''},
                {success: false, error: 'hello there', filePath: ''},
                {success: false, error: '', filePath: ''},
            ];
        `,
    },
    {
        it: 'nested multi-line objects',
        code: `
            const nested = [{
                success: true, filePath: ''}, {
                    success: false, error: 'hello there', filePath: ''}, {
                        success: false, error: '', filePath: ''}];
        `,
        expect: `
            const nested = [
                {
                    success: true,
                    filePath: '',
                },
                {
                    success: false,
                    error: 'hello there',
                    filePath: '',
                },
                {
                    success: false,
                    error: '',
                    filePath: '',
                },
            ];
        `,
    },
    {
        it: 'multiple arrays and even one with a trigger comment',
        code: `
            const varNoLine = ['a', 'b'];
            const varOneNewLine = [
                'a', 'b',
            ];
            const nestedArray = [
                'q', 'r',
                ['s', 't'],
            ];
            // ${capitalizeFirst(nextLinePatternComment)} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd',
                'e',
            ];

        `,
        expect: `
            const varNoLine = [
                'a',
                'b',
            ];
            const varOneNewLine = [
                'a',
                'b',
            ];
            const nestedArray = [
                'q',
                'r',
                [
                    's',
                    't',
                ],
            ];
            // ${capitalizeFirst(nextLinePatternComment)} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'no threshold set with multiple arrays, one having a trigger comment',
        code: `
            const varNoLine = ['a', 'b'];
            const varOneNewLine = [
                'a', 'b',
            ];
            const nestedArray = [
                'q', 'r',
                ['s', 't'],
            ];
            // ${capitalizeFirst(nextLinePatternComment)} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd',
                'e',
            ];

        `,
        expect: `
            const varNoLine = ['a', 'b'];
            const varOneNewLine = [
                'a',
                'b',
            ];
            const nestedArray = [
                'q',
                'r',
                ['s', 't'],
            ];
            // ${capitalizeFirst(nextLinePatternComment)} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e',
            ];
        `,
    },
    {
        it: 'array with single line trigger comment',
        code: `
        // ${nextLinePatternComment} 2 1 3
        const setNumberPerLine = [
            'a', 'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
        ];`,
        expect: `
            // ${nextLinePatternComment} 2 1 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e', 'f',
                'g', 'h',
                'i',
                'j', 'k',
            ];
        `,
    },
    {
        it: 'array with line trigger comment using commas',
        code: `
        // ${nextLinePatternComment} 2, 1, 3
        const setNumberPerLine = [
            'a', 'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
        ];`,
        expect: `
            // ${nextLinePatternComment} 2, 1, 3
            const setNumberPerLine = [
                'a', 'b',
                'c',
                'd', 'e', 'f',
                'g', 'h',
                'i',
                'j', 'k',
            ];
        `,
    },
    {
        it: 'JS array with just a comment',
        code: `
            const myObject = {
                data: [
                    // comment
                ],
            };
      `,
    },
    {
        it: 'basic array with a comment',
        code: `
            const data = [
                'one',
                // comment
                'two',
            ];
        `,
    },
    {
        it: 'basic array with a leading comment',
        code: `
            const data = [
                // comment
                'one',
                'two',
            ];
        `,
    },
    {
        it: 'nested array',
        code: `
            const nestedArray = [
                'q', 'r',
                ['s', 't'],
            ];`,
        expect: `
            const nestedArray = [
                'q',
                'r',
                [
                    's',
                    't',
                ],
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'empty array',
        code: `
            const myVar1 = [];
        `,
    },
    {
        it: 'single element array on one line',
        code: `let anotherThing = ['1 1'];`,
        expect: `
            let anotherThing = [
                '1 1',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 0,
        },
    },
    {
        it: 'single element array on multiple lines',
        code: `
            let anotherThing = ['1 1'
            ];`,
        expect: `
            let anotherThing = [
                '1 1',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 0,
        },
    },
    {
        it: 'multiple different styled arrays all together',
        code: `
            const myVar2 = [];
            let anotherThing = ['1 1'];
            let anotherThing2 = ['1 1'
            ];
            const also = [
                '2, 1',
                '2, 2',
            ];`,
        expect: `
            const myVar2 = [];
            let anotherThing = [
                '1 1',
            ];
            let anotherThing2 = [
                '1 1',
            ];
            const also = [
                '2, 1',
                '2, 2',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 0,
        },
    },
    {
        it: 'single element string array with type definition',
        code: `const myVar = ['hello'];`,
        expect: `
            const myVar = [
                'hello',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 0,
        },
    },
    {
        it: 'double element string array with type definition',
        code: `const myVar = ['hello', 'there'];`,
        expect: `
            const myVar = [
                'hello',
                'there',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'non-array string assignment',
        code: `
            const myVar=
            'hello';`,
        expect: `
            const myVar = 'hello';
        `,
    },
    {
        it: 'non-array single line object assignment',
        code: `
            const myVar = {a: 'here', b: 'there'};
        `,
    },
    {
        it: 'non-array multi-line object assignment',
        code: `
            const myVar = {
                a: 'here',
                b: 'there',
            };
        `,
    },
    // the following test caught that path.getValue() can return undefined.
    {
        it: 'array with an earlier function definition',
        code: `
            function doStuff() {}

            const what = ['a', 'b'];



        `,
        expect: `
            function doStuff() {}

            const what = [
                'a',
                'b',
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'array with function definition inside of it',
        code: `
            const what = ['a', function doStuff() {}];
        `,
        expect: `
            const what = [
                'a',
                function doStuff() {},
            ];
        `,
        options: {
            multilineArraysWrapThreshold: 1,
        },
    },
    {
        it: 'original parser with single line object assignment',
        code: `
            const myVar = {a: 'where', b: 'everywhere'};
        `,
    },
    {
        it: 'original parser with multi-line object assignment',
        code: `
            const myVar = {
                a: 'where',
                b: 'everywhere',
            };
        `,
    },
];

describe('javascript multiline array formatting', () => {
    runTests('.js', javascriptTests, 'babel');
});
