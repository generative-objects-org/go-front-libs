export function SingleEntityComponentMixinFactory(mixinOptions) {
    let { entityName, internalName } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for SingleEntityComponentMixinFactory'
        );

    let uniqueName = internalName || entityName;
    let localObjectVariable = 'local' + uniqueName + 'Object';
    let toLowerEntityName = entityName.toLowerCase();

    return {
        props: ['id'],
        data: function() {
            return {
                [localObjectVariable]: null,
                storeObject: null,
                ['isLoading' + uniqueName + 'Item']: false
            }; // local object // store object
        },
        computed: {
            ['current' + uniqueName + 'Item']: function() {
                if (this[localObjectVariable] !== null)
                    return this[localObjectVariable];
                else return this.storeObject;
            }
        },
        created: function() {
            if (!!this.id) {
                this['load' + uniqueName](this.id);
            }
        },
        methods: {
            ['load' + uniqueName]: function(pk) {
                this['isLoading' + uniqueName + 'Item'] = true;
                return this.$store
                    .dispatch('crud/get', {
                        entityName: toLowerEntityName,
                        pks: [pk]
                    })
                    .then(elt => {
                        this['isLoading' + uniqueName + 'Item'] = false;
                        this.storeObject = elt;
                    })
                    .catch(err => {
                        this['isLoading' + uniqueName + 'Item'] = false;
                        throw err;
                    });
            }
        }
    };
}
