/** TEST SETUP for VuexORM **/
import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import User from './common/models/User';
import Role from './common/models/Role';

Vue.use(Vuex);

const database = new VuexORM.Database();
database.register(User, {});
database.register(Role, {});

export const store = new Vuex.Store({
    plugins: [VuexORM.install(database)]
});
