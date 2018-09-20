export const MODES = {
    VIEW_MODE: 'VIEW_MODE',
    EDIT_MODE: 'EDIT_MODE'
};

export const FORM_ACTIONS = {
    CANCEL: 'cancelEdit',
    CREATE_NEW: 'createNew',
    DELETE: 'delete',
    ENTER_EDIT: 'enterEdit',
    SAVE: 'save'
};

export function FormComponentMixinFactory(mixinOptions) {
    let { modelReference, entityName, internalName } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for FormComponentMixinFactory'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;
    let localObjectVariable = 'local' + uniqueName + 'Object';

    return {
        data: function() {
            return {
                [localObjectVariable]: null,
                initialViewMode: MODES.VIEW_MODE,
                FORM_ACTIONS: FORM_ACTIONS
            }; // exposing FORM_ACTIONS for binding to Mixin-defined actions
        },
        computed: {
            // This will overwrite the existing "currentItem" computed added by SingleEntityComponentMixin
            ['current' + uniqueName + 'Item']: function() {
                if (this[localObjectVariable] !== null)
                    return this[localObjectVariable];
                else return this.storeObject;
            }
        },
        created: function() {
            if (!!this.id) {
                if (this.id === 'create') {
                    this['create' + uniqueName]();
                    this.initialViewMode = MODES.EDIT_MODE;
                }
            }
        },
        methods: {
            cancelEdit() {
                // Do nothing, will fall back to $store object through the "currentXXXItem"
                this[localObjectVariable] = null;
            },
            enterEdit() {
                this[localObjectVariable] = Object.assign(
                    {},
                    this['current' + uniqueName + 'Item'],
                    {
                        IsDirty: true
                    }
                );
            },
            ['create' + uniqueName]() {
                this[localObjectVariable] = modelReference.createNew();
            },
            ['delete' + uniqueName]() {
                // Do something to prompt for Delete
            },
            ['save' + uniqueName]() {
                if (this[localObjectVariable] != null) {
                    if (this[localObjectVariable].IsNew) {
                        this.$store.dispatch(
                            'entities/' + toLowerEntityName + '/insert',
                            {
                                data: this[localObjectVariable]
                            }
                        );
                    } else {
                        this.$store.dispatch(
                            'entities/' + toLowerEntityName + '/update',
                            this[localObjectVariable]
                        );
                    }
                    this.$store
                        .dispatch('crud/saveAll', {
                            entityName: toLowerEntityName
                        })
                        .then(() => {
                            this['load' + uniqueName](
                                this[localObjectVariable].Id
                            ).then((this[localObjectVariable] = null));
                        });
                }
            }
        }
    };
}
