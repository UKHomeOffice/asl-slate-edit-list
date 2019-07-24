/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import expect from 'expect';
import fs from 'fs';
import path from 'path';
import { Editor, Value } from 'slate';

import EditList from '../lib';

describe('slate-edit-list', () => {
    const tests = fs.readdirSync(__dirname);

    tests.forEach((test, index) => {
        if (test[0] === '.' || path.extname(test).length > 0) return;
        it(test, () => {
            const dir = path.resolve(__dirname, test);
            const plugin = EditList();

            const input = require(path.resolve(dir, 'input.js')).default;

            const editor = new Editor({
                plugins: [plugin],
                value: Value.fromJS({
                    document: input.document,
                    selection: input.selection
                })
            });

            const expectedPath = path.resolve(dir, 'expected.js');
            let expected = require(expectedPath).default;

            expected = JSON.stringify(
                Value.fromJS({
                    document: expected.document,
                    selection: expected.selected
                }).toJSON()
            );

            const runChange = require(path.resolve(dir, 'change.js')).default;

            const newChange = runChange(plugin, editor);

            if (expected) {
                const actual = JSON.stringify(newChange.value.toJSON());
                // console.log(actual)

                expect(actual).toEqual(expected);
            }
        });
    });
});
