# Mixin documentation

Mixins (https://vuejs.org/v2/guide/mixins.html) are packages applied to VueJS components, adding a set data / computed / methods... to an existing components to enable a specific behavior or feature.

Here are the Mixins used in GO generated apps.

## Single-Entity Component Mixin

This mixin is added to any container-typed component which has a single entity scope (e.g. a Form). It adds all the behavior to fetch / load the current item (defined by its PK) and exposes it to the component it's applied to.

## Multiple-Entity Component Mixin

This mixin is added to any container-typed component which has a collection scope (e.g. Grid, List, Lookup...). It adds the behavior to fetch / load a collection, filter it and exposes the collection to the component it's applied to.

## Form Component Mixin

This mixin adds the necessary methods and variables for a component to behave like a 2-mode Form (i.e. with View & Edit mode)
