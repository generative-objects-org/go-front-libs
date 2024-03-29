export function SingleEntityComponentMixinFactory(mixinOptions) {
    let {
        modelReference,
        entityName,
        includes,
        internalName
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for SingleEntityComponentMixinFactory'
        );

    let uniqueName = internalName || entityName;
    let toLowerEntityName = entityName.toLowerCase();

    const includeWithQuery = includes ? includes.split(',') : null;

    return {
        props: {
            id: String, // Used to load entity
            routeName: String,
            item: Object // In memory entity
        },
        data: function () {
            return {
                ['local' + uniqueName + 'PK']: null,
                ['isLoading' + uniqueName + 'Item']: false
            };
        },
        computed: {
            // Currently displayed entity
            // If exists, in-memory entity (this.item) has "priority"
            // over loaded one
            ['current' + uniqueName + 'Item']: function () {
                if (this.item) return this.item;
                else if (this.storeObject !== null) return this.storeObject;
                else return null;
            },
            ['current' + uniqueName + 'PK']: function () {
                if (this['local' + uniqueName + 'PK'])
                    return this['local' + uniqueName + 'PK'];
                else return this.item;
            },
            // Entity computed from store, based on current id
            storeObject() {
                if (this['current' + uniqueName + 'PK']) {
                    let query = this.$store.getters[
                        'entities/' + toLowerEntityName + '/query'
                    ]();
                    if (includeWithQuery) {
                        query = query.with(includeWithQuery);
                    }
                    query.whereId(this['current' + uniqueName + 'PK']);
                    let toReturn = query.get();
                    return toReturn.length ? toReturn[0] : null;
                }
                return null;
            }
        },
        created: function () {
            // Initial load of entity
            if (
                !!this.id &&
                this.id !== 'create' // Create is dealt with in Form Mixin
            ) {
                this['local' + uniqueName + 'PK'] = this.id;
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
                    this['local' + uniqueName + 'PK'] = pk;
                    return entity;
                } catch (err) {
                    this['isLoading' + uniqueName + 'Item'] = false;
                    throw err;
                }
            },
            async ['refetch' + uniqueName]() {
                if (this['local' + uniqueName + 'PK']) {
                    await this['load' + uniqueName](
                        this['local' + uniqueName + 'PK']
                    );
                }
            },
            async ['refetch' + uniqueName + 'WithIdCheck']() {
                // If this component has been loaded through a route (presence of routeName prop)
                // and current PK is different from prop id
                if (
                    this.routeName &&
                    this['local' + uniqueName + 'PK'] &&
                    this['local' + uniqueName + 'PK'] !== this.id
                ) {
                    this.$router.push({
                        name: this.routeName,
                        params: {
                            id: this['local' + uniqueName + 'PK']
                        }
                    });
                    // Else, we simply refetch data (no need for a new entry in history)
                } else {
                    this['refetch' + uniqueName]();
                }
            }
        }
    };
}