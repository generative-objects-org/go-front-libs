/*****************************************
 **** GO Predicate Model Specification ****
 *****************************************
 *  Predicates can be either Condition or ConditionGroup
 *
 *  Condition is a "leaf" in the predicate tree. It is composed of:
 *  ->  2 operands
 *  ->  1 operator
 *  ->  1 order (number), to be able to sort it with regard to its parent ConditionGroup
 *  ->  1 negate (boolean), which, when true, negates the condition
 *
 *  ConditionGroup is a container which represent also the root of the predicates.
 *  A ConditionGroup has 1 boolean operator (AND / OR), an array of "child predicates" and an order number
 *
 */

const OPERATOR_TYPE_BINARY = 'OPERATOR_TYPE_BINARY';
const OPERATOR_TYPE_STRING = 'OPERATOR_TYPE_STRING';

const validGroupOperators = ['&&', '||'];

const operatorToTypeClassification = {
    '==': OPERATOR_TYPE_BINARY,
    '!=': OPERATOR_TYPE_BINARY,
    '<=': OPERATOR_TYPE_BINARY,
    '<': OPERATOR_TYPE_BINARY,
    '>=': OPERATOR_TYPE_BINARY,
    '>': OPERATOR_TYPE_BINARY,
    StartsWith: OPERATOR_TYPE_STRING,
    EndsWith: OPERATOR_TYPE_STRING,
    Contains: OPERATOR_TYPE_STRING
};

// Converts the given predicate to a GO-compatible string
export function predicateToString(pred) {
    if (isConditionGroup(pred)) {
        let len = pred.conditions.length;

        if (len === 0) return '';

        if (validGroupOperators.indexOf(pred.operator) === -1)
            throw new Error(`Operator ${pred.operator} is not valid for group`);

        let result = '(';
        let op = pred.operator;
        pred.conditions.sort(conditionListSort).forEach((cond, idx) => {
            let condToString = predicateToString(cond);
            if (condToString !== '') {
                result += condToString;
                if (idx < len - 1) {
                    result += ` ${op} `;
                }
            }
        });
        result += ')';
        return result;
    } else if (isCondition(pred)) {
        if (!operatorToTypeClassification.hasOwnProperty(pred.operator))
            throw new Error(`Operator ${pred.operator} is not valid`);

        let result = '';
        let left = pred.left.needsQuote
            ? `"${pred.left.value}"`
            : pred.left.value;
        let right = pred.right.needsQuote
            ? `"${pred.right.value}"`
            : pred.right.value;
        if (
            operatorToTypeClassification[pred.operator] === OPERATOR_TYPE_BINARY
        ) {
            result = `${left} ${pred.operator} ${right}`;
        } else {
            result = `${left}.${pred.operator}(${right})`;
        }

        if (pred.negate) return `!(${result})`;
        else return result;
    } else {
        throw new Error('Predicate is neither a Condition or ConditionGroup');
    }
}

/****** HELPER ******/

export function isConditionGroup(pred) {
    return (
        pred.hasOwnProperty('conditions') && pred.conditions instanceof Array
    );
}

export function isCondition(pred) {
    return pred.hasOwnProperty('left') && pred.hasOwnProperty('right');
}

/// To compare 2 predicates, we actually compare their string representation
/// as it is the one which interests us in most cases.
export function arePredicatesEqual(predA, predB) {
    if (
        (isCondition(predA) && isCondition(predB)) ||
        (isConditionGroup(predA) && isConditionGroup(predB))
    )
        return predicateToString(predA) === predicateToString(predB);
    return false;
}

function conditionListSort(a, b) {
    return a.order > b.order ? 1 : a.order < b.order ? -1 : 0;
}
