# Plugins

This folder contains the different plugins used in GO generated apps.

## Vuex ORM ApplyFilter plugins

This plugins extends the [Vuex ORM](https://vuex-orm.github.io/vuex-orm) library (an ORM for Vuex store library), adding a `.applyFilter(predicate)` methods to Query object, in order to make it understand GO-style filter predicate (see [GO Predicate Model](../libs/GOPredicateModel.md)).

### How to use it

When building a Vuex ORM query, you may replace the calls to the `.where` method by calls to the `.applyFilter` methods added by the plugin, passing a `predicate` object instead.

```javascript
// Original code
const user = store.getters['entities/users/query']().where('age', 20).get()

// applyFilter version
const user = store.getters['entities/users/query']().applyFilter({
    left: {
        value: 'age'
    },
    operator: '==',
    right: {
        value: 20
    })
    .get();
```

Note: the `applyFilter` version is clearly more verbose than the original Vuex ORM one, but its use is mostly indented to convert generated Condition & ConditionGroup into the Vuex ORM Query language. If one needs to write custom code using directly the Vuex ORM library, s/he can use the [Query builder syntax](https://vuex-orm.github.io/vuex-orm/guide/store/retrieving-data.html#query-builder) to do so.

> ⚠️ Currently, this plugin doesn't work well with nested ConditionGroup (ie groups of the form `(A && B) || (C && D)`) due to a bug in the original library. It works for simple conditions & one-level condition groups.

