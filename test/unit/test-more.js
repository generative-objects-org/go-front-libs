// import { store } from '../dev/vuex-orm';
// import 'chai/register-should';

// store.dispatch('entities/users2/create', {
//     data: [
//         { id: 1, name: 'John', age: 20, active: true },
//         { id: 2, name: 'Jane', age: 20, active: true },
//         { id: 3, name: 'Johnny', age: 24, active: true }
//     ]
// });

// it('can retrieve records that matches the where query with 2 complex nested query builders', () => {
//     const store = createStore([{ model: User }]);

//     store.dispatch('entities/users/create', {
//         data: [
//             { id: 1, name: 'John', age: 24, active: false },
//             { id: 2, name: 'Jane', age: 20, active: true },
//             { id: 3, name: 'Johnny', age: 24, active: true }
//         ]
//     });

//     const expected = [
//         { $id: 1, id: 1, name: 'John', age: 24, active: false },
//         { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
//     ];

//     const users = store.getters['entities/users/query']()
//         .where((_user, query) => {
//             query.where('age', 20).where('active', true);
//         })
//         .orWhere((_user, query) => {
//             query.where('age', 24).where('active', false);
//         })
//         .get();

//     expect(users).toEqual(expected);
// });
