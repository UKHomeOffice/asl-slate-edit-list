// @flow
import { Block, type Editor } from 'slate';
import type Options from '../options';

/**
 * Increase the depth of the current item by putting it in a sub-list
 * of previous item.
 * For first items in a list, does nothing.
 */
function increaseItemDepth(opts: Options, editor: Editor): Editor {
    const previousItem = editor.getPreviousItem();
    const currentItem = editor.getCurrentItem();

    if (!previousItem) {
        return editor;
    }

    if (!currentItem) {
        return editor;
    }

    // Move the item in the sublist of previous item
    return moveAsSubItem(opts, editor, currentItem, previousItem.key);
}

/**
 * Move the given item to the sublist at the end of destination item,
 * creating a sublist if needed.
 */
function moveAsSubItem(
    opts: Options,
    editor: Editor,
    // The list item to add
    item: Block,
    // The key of the destination node
    destKey: string
): Editor {
    const destination = editor.value.document.getDescendant(destKey);
    const lastIndex = destination.nodes.size;
    const lastChild = destination.nodes.last();

    // The potential existing last child list
    const existingList = editor.isList(lastChild) ? lastChild : null;

    if (existingList) {
        return editor.moveNodeByKey(
            item.key,
            existingList.key,
            existingList.nodes.size // as last item
        );
    }
    const currentList = editor.getListForItem(destination);
    if (!currentList) {
        throw new Error('Destination is not in a list');
    }

    const newSublist = Block.create({
        object: 'block',
        type: currentList.type,
        data: currentList.data
    });

    return editor.withoutNormalizing(() => {
        editor.insertNodeByKey(destKey, lastIndex, newSublist);
        editor.moveNodeByKey(item.key, newSublist.key, 0);
    });
}

export default increaseItemDepth;
