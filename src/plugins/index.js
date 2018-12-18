import { applyPredicateToVuexORMQuery } from './vuex-orm-applyFilter';
import { getCleanInstanceMethod } from './vuex-orm-cleanInstance';

const plugin = {
    install(components, options) {
        installApplyFilterPlugin(components, options);
        installCleanInstancePlugin(components, options);
    }
};

/**
 * This plugins adds a applyFilter method to the Vuex ORM library's Query object
 * This method can be used to apply any GOPredicate style Condition or ConditionGroup
 * to a Vuex ORM Query.
 */
function installApplyFilterPlugin(components, options) {
    components.Query.prototype.applyFilter = applyPredicateToVuexORMQuery;
}

/**
 * This plugins adds a cleanInstance method to the Vuex ORM library's Model object
 * This method can be used to delete from current instance of a Vuex ORM entity
 * any field named after a relation in the entityRelations array
 */
function installCleanInstancePlugin(components, options) {
    components.Model.prototype.cleanInstanceRelations = getCleanInstanceMethod(
        components.Relation
    );
}

export default plugin;
