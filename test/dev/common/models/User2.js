import { Model } from '@vuex-orm/core';

export default class User2 extends Model {
    static entity = 'users2';

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            age: this.attr(null),
            active: this.attr(false)
        };
    }

    isActive() {
        return this.active;
    }
}
