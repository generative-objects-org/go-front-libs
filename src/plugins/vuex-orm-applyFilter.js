import { isConditionGroup, isCondition } from '../libs/go-predicate-model';

const operatorToComparisonMethod = {
    '==': (a, b) => {
        return a == b;
    },
    '!=': (a, b) => {
        return a != b;
    },
    '<=': (a, b) => {
        return a <= b;
    },
    '<': (a, b) => {
        return a < b;
    },
    '>': (a, b) => {
        return a > b;
    },
    '>=': (a, b) => {
        return a >= b;
    },
    StartsWith: (a, b) => {
        return a.indexOf && a.indexOf(b) === 0;
    },
    EndsWith: (a, b) => {
        return a.indexOf && a.indexOf(b) === a.length - b.length;
    },
    Contains: (a, b) => {
        return a.indexOf && a.indexOf(b) > -1;
    }
};

function applyPredicateToVuexORMQuery(pred, parentBooleanOperator = null) {
    let query = this;
    let booleanOperator = pred.operator;

    if (isConditionGroup(pred)) {
        let len = pred.conditions.length;

        if (len === 0) return query;

        pred.conditions.sort((a, b) => {
            return a.order > b.order ? 1 : a.order < b.order ? -1 : 0;
        });

        if (booleanOperator === '||') {
            pred.conditions.forEach(cond => {
                query.orWhere((_record, q) => {
                    applyPredicateToVuexORMQuery.call(
                        q,
                        cond,
                        pred.operator,
                        false
                    );
                });
            });
        } else if (booleanOperator === '&&') {
            query.where((_record, q) => {
                pred.conditions.forEach(cond => {
                    applyPredicateToVuexORMQuery.call(
                        q,
                        cond,
                        pred.operator,
                        false
                    );
                });
            });
        } else
            throw new Error(
                `Operator ${booleanOperator} is not valid for group`
            );
        return query;
    } else if (isCondition(pred)) {
        return applyFilterToSimpleCondition(this, pred, parentBooleanOperator);
    } else
        throw new Error('Predicate is neither a Condition or ConditionGroup');
}

function applyFilterToSimpleCondition(
    query,
    condition,
    booleanOperator = '&&'
) {
    if (!operatorToComparisonMethod.hasOwnProperty(condition.operator)) {
        throw new Error(`Operator ${condition.operator} is not valid`);
    }
    if (booleanOperator === '||') {
        query.orWhere(condition.left.value, value =>
            operatorToComparisonMethod[condition.operator](
                value,
                condition.right.value
            )
        );
        // We default to AND in case it is not defined
    } else {
        query.where(condition.left.value, value =>
            operatorToComparisonMethod[condition.operator](
                value,
                condition.right.value
            )
        );
    }
    return query;
}

// export function searchEntitiesToIncludeFromPredicate(currentPredicate) {
//     let toReturn = [];
//     if (isConditionGroup(currentPredicate)) {
//         currentPredicate.conditions.forEach(cond => {
//             toReturn.concat(searchEntitiesToInclude(cond));
//         });
//     } else if (isCondition(currentPredicate)) {
//         let i = currentPredicate.left.value.lastIndexOf('.');
//         if (i > -1) {
//             return [currentPredicate.left.value.substring(0, i)];
//         }
//         return [];
//     }
// }

/**
 * This plugins adds a applyFilter method to the Vuex ORM library's Query object
 * This method can be used to apply any GOPredicate style Condition or ConditionGroup
 * to a Vuex ORM Query.
 */

const plugin = {
    install(components, options) {
        components.Query.prototype.applyFilter = applyPredicateToVuexORMQuery;
    }
};

export default plugin;
