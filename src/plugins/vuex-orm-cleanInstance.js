import { Relation } from '@vuex-orm/core';

// This method will be attached to the Model object on install
// so the *this* keyword is an instance of the current entity
// on which the method is called.
export function cleanInstanceMethod() {
    // Getting all relation names for the current entity
    let relations = Object.keys(this.constructor.fields()).filter(
        f => this.constructor.fields()[f] instanceof Relation
    );

    // And deleting them
    relations.forEach(relationName => {
        delete this[relationName];
    });
}
