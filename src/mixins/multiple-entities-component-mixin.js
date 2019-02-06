import {
    arePredicatesEqual,
    predicateToString
} from '../libs/go-predicate-model';

export function MultipleEntitiesComponentMixinFactory(mixinOptions) {
    let {
        entityName,
        includes,
        internalName,
        pageSize,
        paginationEnabled,
        initialOrderBy,
        isInitialOrderDesc
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for MultipleEntitiesComponentMixin'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;
    let fixedPageSize = pageSize || 15;
    let isPaginationEnabled =
        paginationEnabled !== undefined ? paginationEnabled : false;

    let initialSortColumn = initialOrderBy ? initialOrderBy : null;
    let isInitialSortDesc = isInitialOrderDesc ? isInitialOrderDesc : false;

    return {
        props: {
            externalFilter: Object, // Optional filter for current collection load
            dataCollection: Array // In-memory array of element
        },

        data() {
            return {
                // Currently loading
                ['isLoading' + uniqueName + 'Collection']: false,

                // Pagination
                ['is' + uniqueName + 'PaginationEnabled']: isPaginationEnabled,
                ['total' + uniqueName + 'Count']: 0,
                ['current' + uniqueName + 'PageNumber']: 1,

                // Sort
                ['current' + uniqueName + 'SortColumn']: initialSortColumn,
                ['is' + uniqueName + 'SortDescending']: isInitialSortDesc
            };
        },

        computed: {
            // Computed used to display the collection
            // built through a Vuex ORM Query if no local
            // dataCollection is provided
            ['current' + uniqueName + 'Collection']() {
                if (this.dataCollection) return this.dataCollection;
                if (this.externalFilter === null) {
                    return [];
                }

                // Starting build of the query
                let query = this.$store.getters[
                    'entities/' + toLowerEntityName + '/query'
                ]();

                // Applying additionnal filter
                if (this.externalFilter) {
                    query = query.applyFilter(this.externalFilter);
                }

                // Adding includes if needed
                if (includes) {
                    query = query.with(includes);
                }

                // Handling pagination
                if (this['is' + uniqueName + 'PaginationEnabled']) {
                    let pageSize = this[uniqueName + 'CollectionPagination']
                        .pageSize;
                    let offset =
                        (this[uniqueName + 'CollectionPagination']
                            .currentPageNumber -
                            1) *
                        pageSize;
                    query.limit(pageSize);
                    if (offset > 0) query.offset(offset);
                }

                // Handling sort
                if (this['current' + uniqueName + 'SortColumn'] !== null) {
                    query.orderBy(
                        this['current' + uniqueName + 'SortColumn'],
                        this['is' + uniqueName + 'SortDescending']
                            ? 'desc'
                            : 'asc'
                    );
                }

                return query.get();
            },

            /**
             * Building the pagination object describing current pagination status
             *
             * {
             *  isPaginationEnabled,
             *  pageSize,
             *  currentTotal,
             *  totalPage,
             *  currentPageNumber
             * }
             *
             */
            [uniqueName + 'CollectionPagination']() {
                let result = {
                    isPaginationEnabled: this[
                        'is' + uniqueName + 'PaginationEnabled'
                    ]
                };
                if (this['is' + uniqueName + 'PaginationEnabled']) {
                    let total = this['total' + uniqueName + 'Count'];
                    result.pageSize = fixedPageSize;
                    result.currentTotal = total;
                    result.totalPage =
                        total > fixedPageSize
                            ? Math.ceil(total / fixedPageSize)
                            : 1;
                    result.currentPageNumber = this[
                        'current' + uniqueName + 'PageNumber'
                    ];
                }
                return result;
            },

            /**
             * Building the current sort object
             *
             * {
             *  sortColumn,
             *  isDescending
             * }
             *
             */
            [uniqueName + 'CollectionSort']() {
                return {
                    sortColumn: this['current' + uniqueName + 'SortColumn'],
                    isDescending: ['is' + uniqueName + 'SortDescending']
                };
            }
        },

        mounted() {
            if (!this.dataCollection)
                this['countAndLoad' + uniqueName + 'Collection']();
        },

        methods: {
            async ['countAndLoad' + uniqueName + 'Collection']() {
                await this['count' + uniqueName + 'Collection']();
                await this['load' + uniqueName + 'Collection']();
            },
            async ['count' + uniqueName + 'Collection']() {
                if (
                    this.externalFilter === null ||
                    !this['is' + uniqueName + 'PaginationEnabled']
                ) {
                    return 0;
                }

                this['isLoading' + uniqueName + 'Collection'] = true;

                let configuration = {};
                if (this.externalFilter) {
                    configuration.filter = GOPredicate.predicateToString(
                        this.externalFilter
                    );
                }

                let count = await this.$store.dispatch('crud/count', {
                    entityName: toLowerEntityName,
                    configuration: configuration
                });
                this['total' + uniqueName + 'Count'] = count;
                return count;
            },
            async ['load' + uniqueName + 'Collection']() {
                if (this.externalFilter === null) {
                    return [];
                }

                this['isLoading' + uniqueName + 'Collection'] = true;

                // Building query config
                let configuration = {};

                // Data to include
                if (includes) {
                    configuration.include = includes;
                }

                // Converting and adding filter if needed
                if (this.externalFilter) {
                    configuration.filter = predicateToString(
                        this.externalFilter
                    );
                }

                // Adding pagination
                if (this['is' + uniqueName + 'PaginationEnabled']) {
                    configuration.pageSize = this[
                        uniqueName + 'CollectionPagination'
                    ].pageSize;
                    configuration.pageNumber = this[
                        uniqueName + 'CollectionPagination'
                    ].currentPageNumber;
                }

                // Adding sort options
                if (this['current' + uniqueName + 'SortColumn'] !== null) {
                    configuration.sortColumn = this[
                        'current' + uniqueName + 'SortColumn'
                    ];
                    configuration.sortOrder = [
                        'is' + uniqueName + 'SortDescending'
                    ]
                        ? 'desc'
                        : 'asc';
                }

                // Getting data
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
            },

            // Event subscription methods
            ['current' + uniqueName + 'PageChanged'](value) {
                this['current' + uniqueName + 'PageNumber'] = value;
            },
            ['current' + uniqueName + 'SortChanged']({
                isDescending,
                sortColumn
            }) {
                this['is' + uniqueName + 'SortDescending'] = isDescending;
                this['current' + uniqueName + 'SortColumn'] = sortColumn;
            }
        },
        watch: {
            externalFilter(newFilter, oldFilter) {
                if (newFilter && !arePredicatesEqual(oldFilter, newFilter))
                    this['countAndLoad' + uniqueName + 'Collection']();
            },
            ['current' + uniqueName + 'PageNumber'](
                newPageNumber,
                oldPageNumber
            ) {
                if (newPageNumber !== oldPageNumber)
                    this['countAndLoad' + uniqueName + 'Collection']();
            },
            [uniqueName + 'CollectionSort'](newSortObject, oldSortObject) {
                if (
                    newSortObject.sortColumn !== oldSortObject.sortColumn ||
                    newSortObject.isDescending !== oldSortObject.isDescending
                ) {
                    this['countAndLoad' + uniqueName + 'Collection']();
                }
            }
        }
    };
}
