# GO Predicate Model

This library exposes the GOPredicate Model to your app and several methods to manipulate this model.

## Model

Predicates can be either Condition or ConditionGroup. There are plain JS object (we don't use JS Object constructor for)

### Conditions

Condition is a "leaf" in the predicate tree. A condition is an object representation of a boolean expression such as `left == right`
It is composed of:

-   2 operands: `left` and `right`, each have a mandatory `value` property and an optional `needsQuote` boolean one,
-   1 `operator` property, amongst the following:
    -   _Binary operators_: `'=='`, `'!='`, `'<='`, `'<'`, `'>='`, `'>'`
    -   _String operators_: `'StartsWith'`, `'EndsWith'`, `'Contains'`. Those will check that the right value is in the left string.
-   1 optional `order` number property, to be able to sort it with regard to its parent ConditionGroup (if exists)
-   1 optional `negate` boolean property, which, when true, negates the condition

Example:

```javascript
{
    left: {
        value: 'CustomerId'
    },
    operator: '==',
    right: {
        value: '2460f7c5-a601-4d17-9a6a-bd82170dfd6d',
        needsQuote: true
    },
    order: 1
}
```

### ConditionGroups

ConditionGroup is a container for a list of conditions, separated by the same boolean operator.
If represented as a string, a ConditionGroup holding 3 conditions A, B & C, and using the `&&` operator, would be equivalent to `(A && B && C)`.

A ConditionGroup is composed of:

-   1 `operator` property, which can be either `&&` or `||`,
-   an array `conditions`,
-   an optional `order` number property, which defines its order with regard to its parent ConditionGroup.

Example:

```javascript
{
    operator: '||',
    order: 1,
    conditions: [
        {
            left: {
                value: 'CustomerId'
            },
            operator: '==',
            right: {
                value: 'fded8d14-8d91-435c-8653-d0aa02de03a9',
                needsQuote: true
            },
            order: 1
        },
        {
            left: {
                value: 'Amount'
            },
            operator: '>=',
            right: {
                value: 10
            },
            order: 1
        }
    ]
}
```

## Exposed methods

The library exposes the following methods:

### isCondition

`isCondition(predicate)` checks if the provided `predicate` argument is a valid Condition (as defined above), based on the properties present

### isConditionGroup

`isConditionGroup(predicate)` checks if the provided `predicate` argument is a valid ConditionGroup (as defined above), based on the properties present

### predicateToString

`predicateToString(predicate)` returns a string representation of the given `predicate` argument, compatible with GO API `filter` parameter.
This method flattens the provided predicate tree, adding parenthesis if needed and quotes when the operands make use of the `needsQuote` boolean.

Examples:

The following Condition object

```javascript
{
    left: { value: 'Name' },
    operator: 'StartsWith',
    right: {
        value: 'Bla',
        needsQuote: true
    },
    order: 1
}
```

will be output as the following string: `Name.StartsWith("Bla")` and the following group:

```javascript
{
    operator: '||',
    conditions: [{
    left: {
            value: 'Title'
        },
        operator: '>=',
        right: {
            value: 'AA',
            needsQuote: true
        },
        order: 2
    },
    {
        left: {
            value: 'Amount'
        },
        operator: '>',
        right: {
            value: '78'
        },
        order: 1
    }]
}
```

will produce the following string: `(Amount > 78 || Title >="AA")`
