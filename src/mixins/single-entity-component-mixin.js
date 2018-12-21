export function SingleEntityComponentMixinFactory(mixinOptions) {
    let { entityName, includes, internalName } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for SingleEntityComponentMixinFactory'
        );

    let uniqueName = internalName || entityName;
    let toLowerEntityName = entityName.toLowerCase();

    return {
        props: {
            id: String, // Used to load entity
            item: Object // In memory entity
        },
        data: function() {
            return {
                ['isLoading' + uniqueName + 'Item']: false
            };
        },
        computed: {
            // Currently displayed entity
            // If exists, in-memory entity (this.item) has "priority"
            // over loaded one
            ['current' + uniqueName + 'Item']: function() {
                if (this.item) return this.item;
                else return this.storeObject;
            },
            // Entity computed from store, based on current id
            storeObject() {
                if (this.id) {
                    let query = this.$store.getters[
                        'entities/' + toLowerEntityName + '/query'
                    ]();
                    if (includes) {
                        query = query.with(includes);
                    }
                    query.whereId(this.id);
                    let toReturn = query.get();
                    return toReturn.length ? toReturn[0] : null;
                }
                return null;
            }
        },
        created: function() {
            // Initial load of entity
            if (
                !!this.id &&
                this.id !== 'create' // Create is dealt with in Form Mixin
            ) {
                this['load' + uniqueName](this.id);
            }
        },
        methods: {
            async ['load' + uniqueName](pk) {
                if (!pk) return null;

                this['isLoading' + uniqueName + 'Item'] = true;

                let configuration = {};
                if (includes) {
                    configuration.include = includes;
                }

                try {
                    let entity = await this.$store.dispatch('crud/get', {
                        entityName: toLowerEntityName,
                        pks: [pk],
                        configuration: configuration
                    });
                    this['isLoading' + uniqueName + 'Item'] = false;
                    this.id = entity.Id;
                    return entity;
                } catch (err) {
                    this['isLoading' + uniqueName + 'Item'] = false;
                    throw err;
                }
            }
        }
    };
}
