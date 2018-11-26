import { predicateToString } from '../libs/go-predicate-model';

export function MultipleEntitiesComponentMixinFactory(mixinOptions) {
    let { entityName, includes, internalName } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for MultipleEntitiesComponentMixin'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;

    return {
        props: { externalFilter: Object },
        data() {
            return { ['isLoading' + uniqueName + 'Collection']: false };
        },
        computed: {
            ['current' + uniqueName + 'Collection']: function() {
                if (this.externalFilter === null) {
                    return [];
                }
                let query = this.$store.getters[
                    'entities/' + toLowerEntityName + '/query'
                ]();
                if (this.externalFilter) {
                    query = query.applyFilter(this.externalFilter);
                }
                if (includes) {
                    query = query.with(includes);
                }
                return query.get();
            }
        },
        mounted() {
            this['load' + uniqueName + 'Collection']();
        },
        methods: {
            ['load' + uniqueName + 'Collection']: function() {
                if (this.externalFilter === null) {
                    return;
                }

                this['isLoading' + uniqueName + 'Collection'] = true;

                let configuration = {};
                if (includes) {
                    configuration.include = includes;
                }
                if (this.externalFilter) {
                    configuration.filter = predicateToString(
                        this.externalFilter
                    );
                }

                return this.$store
                    .dispatch('crud/getCollection', {
                        entityName: toLowerEntityName,
                        configuration: configuration
                    })
                    .then(dataCollection => {
                        this['isLoading' + uniqueName + 'Collection'] = false;
                    })
                    .catch(err => {
                        this['isLoading' + uniqueName + 'Collection'] = false;
                        console.warn(err);
                    });
            }
        },
        watch: {
            externalFilter(newFilter, oldFilter) {
                if (newFilter) this['load' + uniqueName + 'Collection']();
            }
        }
    };
}
