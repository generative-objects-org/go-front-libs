import { store } from '../dev/vuex-orm';
import User from '../dev/common/models/User';
import Role from '../dev/common/models/Role';
import VuexORM from '@vuex-orm/core';
import VuexORMApplyFilterPlugin from '../../src/plugins';
import { expect, should } from 'chai';

describe('Vuex ORM cleanInstanceRelations plugin tests', function() {
    it('can initialize store', function() {
        store.should.exist;
    });

    // Installing plugin
    VuexORM.use(VuexORMApplyFilterPlugin);

    it('should have added the cleanInstanceRelations method', function() {
        VuexORM.Model.prototype.cleanInstanceRelations.should.exist;
    });

    it('should remove relation attribute when called', function() {
        let user = new User();

        expect(user.role).to.be.null;

        user.cleanInstanceRelations();

        expect(user.role).to.be.undefined;
    });

    it('should do nothing when no relation field is defined', function() {
        let role = new Role();
        // Which just run it to make sure it runs even without relation field defined
        role.cleanInstanceRelations();
    });
});
