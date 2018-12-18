# Plugins

This folder contains the different plugins used in GO generated apps.

## Vuex ORM ApplyFilter plugin

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

## Vuex ORM CleanInstanceRelations plugin

This plugin adds a `Model` method on all [Vuex ORM](https://vuex-orm.github.io/vuex-orm) entities named `cleanInstanceRelations`. This method can be called on any instance and will delete (using JS [delete](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete)) the instance fields which are of type _Relation_.

It is used before sending data to the server, as the data is sent through a dataset where each entity is in its own dataset.
