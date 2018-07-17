import * as uuid from './libs/go-uuid';
import * as dsBuilder from './libs/go-dataset-builder';
import * as predicateModel from './libs/go-predicate-model';

import ormPlugin from './plugins/vuex-orm-applyFilter';

export const GOUuuid = uuid;
export const GODatasetBuilder = dsBuilder;
export const GOPredicate = predicateModel;
export const VuexORMPlugin = ormPlugin;
