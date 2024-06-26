// @flow
import { type Editor, type Block } from 'slate';
import type Options from '../options';

/**
 * Return the current list item, from current selection or from a node.
 */
function getCurrentItem(opts: Options, editor: Editor, block?: Block): ?Block {
    const { value } = editor;
    const { document } = value;

    if (!block) {
        if (!value.selection.start.key) {
            return null;
        }
        block = value.startBlock;
    }

    const parent = document.getParent(block.key);
    return parent && parent.type === opts.typeItem ? parent : null;
}

export default getCurrentItem;
