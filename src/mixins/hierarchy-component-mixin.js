export function HierarchyComponentMixinFactory(mixinOptions) {
    let {
        entityName,
        internalName
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for HierarchyComponentMixinFactory'
        );

    let uniqueName = internalName || entityName;

    return {
        data() {
            return {
                [uniqueName + 'Id']: null,
                [uniqueName + 'Type']: null
            }
        },
        methods: {
            ['set' + uniqueName + 'Id']: function (type, id) {
                this[uniqueName + 'Id'] = id;
                this[uniqueName + 'Type'] = type;
            }
        },
        computed: {
            ['current' + uniqueName + 'Type']: function () {
                if (this['current' + uniqueName + 'Item']) {
                    return this['current' + uniqueName + 'Item'].$_objectType;
                }
                return this[uniqueName + 'Type'];
            },
            IsViewMode() {
                return this[uniqueName + 'Id'] !== 'create'
            }
        },
    }
}