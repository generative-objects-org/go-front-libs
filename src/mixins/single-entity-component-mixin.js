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
                ['isLoading' + uniqueName]: false
            }; // local object // store object
        },
        computed: {
            currentItem() {
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
                this['isLoading' + uniqueName] = true;
                return this.$store
                    .dispatch('crud/get', {
                        entityName: toLowerEntityName,
                        pks: [pk]
                    })
                    .then(elt => {
                        this['isLoading' + uniqueName] = false;
                        this.storeObject = elt;
                    })
                    .catch(err => {
                        this['isLoading' + uniqueName] = false;
                        throw err;
                    });
            }
        }
    };
}
