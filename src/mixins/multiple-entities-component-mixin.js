import {
    arePredicatesEqual,
    predicateToString
} from '../libs/go-predicate-model';

export function MultipleEntitiesComponentMixinFactory(mixinOptions) {
    let { entityName, includes, internalName } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for MultipleEntitiesComponentMixin'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;

    return {
        props: {
            externalFilter: Object, // Optional filter for current collection load
            dataCollection: Array // In-memory array of element
        },
        data() {
            return { ['isLoading' + uniqueName + 'Collection']: false };
        },
        computed: {
            ['current' + uniqueName + 'Collection']: function() {
                if (this.dataCollection) return this.dataCollection;
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
            async ['load' + uniqueName + 'Collection']() {
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
                try {
                    let dataCollection = await this.$store.dispatch(
                        'crud/getCollection',
                        {
                            entityName: toLowerEntityName,
                            configuration: configuration
                        }
                    );
                    this['isLoading' + uniqueName + 'Collection'] = false;
                    return dataCollection;
                } catch (err) {
                    this['isLoading' + uniqueName + 'Collection'] = false;
                    throw err;
                }
            }
        },
        watch: {
            externalFilter(newFilter, oldFilter) {
                if (newFilter && !arePredicatesEqual(oldFilter, newFilter))
                    this['load' + uniqueName + 'Collection']();
            }
        }
    };
}
