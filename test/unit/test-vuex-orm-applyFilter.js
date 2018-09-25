import { store } from '../dev/vuex-orm';
import VuexORM from '@vuex-orm/core';
import VuexORMApplyFilterPlugin from '../../src/plugins/vuex-orm-applyFilter';
import 'chai/register-should';

describe('Vuex ORM applyFilter plugin tests', function() {
    it('can initialize store', function() {
        store.should.exist;
    });

    // Installing plugin
    VuexORM.use(VuexORMApplyFilterPlugin);

    it('should have added the applyFilter method', function() {
        VuexORM.Query.prototype.applyFilter.should.exist;
    });

    initData();

    // Testing all simple filter operator
    // results for these tests will always be the first User 'John Walker'
    const allSimpleTest = [
        {
            left: { value: 'name' },
            operator: '==',
            right: { value: 'John Walker' }
        },
        {
            left: { value: 'roleId' },
            operator: '!=',
            right: { value: 2 }
        },
        { left: { value: 'roleId' }, operator: '<', right: { value: 2 } },
        { left: { value: 'roleId' }, operator: '<=', right: { value: 1 } },
        { left: { value: 'name' }, operator: '>=', right: { value: 'John' } },
        { left: { value: 'name' }, operator: '>', right: { value: 'John' } },
        {
            left: { value: 'name' },
            operator: 'StartsWith',
            right: { value: 'John' }
        },
        {
            left: { value: 'name' },
            operator: 'EndsWith',
            right: { value: 'Walker' }
        },
        {
            left: { value: 'phone' },
            operator: 'Contains',
            right: { value: '281' }
        }
    ];

    allSimpleTest.forEach(filt => {
        it('should apply simple filter for ' + filt.operator, function() {
            const results = store.getters['entities/users/query']()
                .applyFilter(filt)
                .get();

            results.should.have.length(1);
            results[0].id.should.equal(1);
        });
    });

    it('should apply group AND filter', function() {
        const results = store.getters['entities/users/query']()
            .applyFilter({
                operator: '&&',
                conditions: [
                    {
                        left: { value: 'email' },
                        operator: 'StartsWith',
                        right: { value: 'peach' },
                        order: 1
                    },
                    {
                        left: { value: 'phone' },
                        operator: '==',
                        right: { value: '(555) 555-4567' },
                        order: 2
                    }
                ]
            })
            .get();
        results.should.have.length(1);
        results[0].id.should.equal(3);
    });

    it('should apply group OR filter', function() {
        const results = store.getters['entities/users/query']()
            .applyFilter({
                operator: '||',
                conditions: [
                    {
                        left: { value: 'email' },
                        operator: 'StartsWith',
                        right: { value: 'peach' },
                        order: 1
                    },
                    {
                        left: { value: 'phone' },
                        operator: '==',
                        right: { value: '(555) 281-4567' },
                        order: 2
                    }
                ]
            })
            .get();
        results.should.have.length(2);
        results
            .map(elt => {
                return elt.id;
            })
            .should.eql([1, 3]);
    });

    it('should fail to apply when not condition', function() {
        (function() {
            let results = store.getters['entities/users/query']()
                .applyFilter({})
                .get();
        }.should.throw('Predicate is neither a Condition or ConditionGroup'));
    });

    it('should fail with invalid condition operator', function() {
        (function() {
            let results = store.getters['entities/users/query']()
                .applyFilter({
                    left: { value: 'A' },
                    operator: 'xx',
                    right: 1
                })
                .get();
        }.should.throw('Operator xx is not valid'));
    });

    it('should fail with invalid group operator', function() {
        (function() {
            let results = store.getters['entities/users/query']()
                .applyFilter({
                    operator: 'xx',
                    conditions: [
                        {
                            left: { value: 'email' },
                            operator: 'StartsWith',
                            right: { value: 'peach' },
                            order: 1
                        },
                        {
                            left: { value: 'phone' },
                            operator: '==',
                            right: { value: '(555) 281-4567' },
                            order: 2
                        }
                    ]
                })
                .get();
        }.should.throw('Operator xx is not valid for group'));
    });

    it('should apply 2 nested group filters, separated with OR', function() {
        const results = store.getters['entities/users/query']()
            .applyFilter({
                operator: '||',
                conditions: [
                    {
                        operator: '&&',
                        conditions: [
                            {
                                left: { value: 'id' },
                                operator: '==',
                                right: { value: 1 },
                                order: 1
                            },
                            {
                                left: { value: 'phone' },
                                operator: '==',
                                right: { value: '(555) 281-4567' },
                                order: 2
                            }
                        ],
                        order: 1
                    },
                    {
                        operator: '&&',
                        conditions: [
                            {
                                left: { value: 'email' },
                                operator: 'StartsWith',
                                right: { value: 'peach' },
                                order: 1
                            },
                            {
                                left: { value: 'id' },
                                operator: '==',
                                right: { value: 3 },
                                order: 2
                            }
                        ],
                        order: 2
                    }
                ]
            })
            .get();
        results.should.have.length(2);
        results
            .map(elt => {
                return elt.id;
            })
            .should.eql([1, 3]);
    });

    it('should apply 2 nested group filters, separated with AND', function() {
        const results = store.getters['entities/users/query']()
            .applyFilter({
                operator: '&&',
                conditions: [
                    {
                        operator: '||',
                        conditions: [
                            {
                                left: { value: 'id' },
                                operator: '==',
                                right: { value: 1 },
                                order: 1
                            },
                            {
                                left: { value: 'phone' },
                                operator: '==',
                                right: { value: '(555) 281-4567' },
                                order: 2
                            }
                        ],
                        order: 1
                    },
                    {
                        operator: '||',
                        conditions: [
                            {
                                left: { value: 'email' },
                                operator: 'StartsWith',
                                right: { value: 'peach' },
                                order: 1
                            },
                            {
                                left: { value: 'id' },
                                operator: '==',
                                right: { value: 3 },
                                order: 2
                            }
                        ],
                        order: 2
                    }
                ]
            })
            .get();
        results.should.have.length(2);
        results
            .map(elt => {
                return elt.id;
            })
            .should.eql([1, 3]);
    });
});

function initData() {
    store.dispatch('entities/users/create', {
        data: [
            {
                id: 1,
                name: 'John Walker',
                email: 'john@gmail.com',
                phone: '(555) 281-4567',
                roleId: 1
            },
            {
                id: 2,
                name: 'Bobby Banana',
                email: 'walker.banana@gmail.com',
                phone: '(555) 555-4567',
                roleId: 2
            },
            {
                id: 3,
                name: 'Ann Peach',
                email: 'peach@gmail.com',
                phone: '(555) 555-4567',
                roleId: 2
            }
        ]
    });

    store.dispatch('entities/roles/create', {
        data: [
            {
                id: 1,
                name: 'Admin'
            },
            {
                id: 2,
                name: 'Customer'
            }
        ]
    });
}
