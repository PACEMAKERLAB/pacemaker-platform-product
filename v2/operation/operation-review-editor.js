/**
 * PACEMAKER Platform Product v2
 * Operation Review Editor
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;
    var ACTION = Object.freeze({
        ADD: "add",
        UPDATE: "update",
        REMOVE: "remove"
    });

    function getCollection(operation, definition) {
        if (definition.path === "budget.approved") {
            return operation.budget.approved;
        }

        return operation[definition.path];
    }

    function findIndex(collection, idField, itemId) {
        return collection.findIndex(function (item) {
            return item[idField] === itemId;
        });
    }

    function apply(operation, edit) {
        var definition = namespace.ReviewPolicy.editableCollection[edit.section];
        var updated;
        var collection;
        var index;

        if (operation.status !== namespace.Schema.status.IN_REVIEW) {
            throw new Error("Operation edits are allowed only during review");
        }

        if (!definition) {
            throw new Error("Unknown review section: " + edit.section);
        }

        if (Object.values(ACTION).indexOf(edit.action) === -1) {
            throw new Error("Unknown review edit action: " + edit.action);
        }

        updated = namespace.Model.clone(operation);
        collection = getCollection(updated, definition);
        index = findIndex(collection, definition.idField, edit.itemId);

        if (edit.action === ACTION.ADD) {
            if (!edit.item || !edit.item[definition.idField]) {
                throw new Error("Added item requires " + definition.idField);
            }

            if (findIndex(collection, definition.idField, edit.item[definition.idField]) !== -1) {
                throw new Error("Duplicate item id: " + edit.item[definition.idField]);
            }

            collection.push(namespace.Model.clone(edit.item));
        }

        if (edit.action === ACTION.UPDATE) {
            if (index === -1) {
                throw new Error("Item not found: " + edit.itemId);
            }

            collection[index] = Object.assign({}, collection[index], namespace.Model.clone(edit.changes || {}));
            collection[index][definition.idField] = edit.itemId;
        }

        if (edit.action === ACTION.REMOVE) {
            if (index === -1) {
                throw new Error("Item not found: " + edit.itemId);
            }

            collection.splice(index, 1);
        }

        updated.review.sectionConfirmations[edit.section] = false;
        updated.updatedAt = edit.editedAt;
        updated.updatedBy = edit.editedBy;

        return updated;
    }

    namespace.ReviewEditor = Object.freeze({
        action: ACTION,
        apply: apply
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
