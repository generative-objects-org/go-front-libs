import * as uuid from './libs/go-uuid';
import * as apiAdapter from './libs/go-api-adapter';
import * as predicateModel from './libs/go-predicate-model';

import ormPlugin from './plugins/vuex-orm-applyFilter';

import * as formMixin from './mixins/form-component-mixin';
import * as multipleEntitiesMixin from './mixins/multiple-entities-component-mixin';
import * as singleEntityMixin from './mixins/single-entity-component-mixin';

// Libraries
export const GOUuuid = uuid;
export const GOAPIAdapter = apiAdapter;
export const GOPredicate = predicateModel;

// Mixins
export const FormComponentMixin = formMixin;
export const MultipleEntitiesComponentMixin = multipleEntitiesMixin;
export const SingleEntityComponentMixin = singleEntityMixin;

// Plugins
export const VuexORMPlugin = ormPlugin;
