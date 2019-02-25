export const MODES = {
    VIEW_MODE: 'VIEW_MODE',
    EDIT_MODE: 'EDIT_MODE'
};

export const FORM_ACTIONS = {
    CANCEL_EDIT: 'cancelEdit',
    CREATE_ITEM: 'createNew',
    DELETE_ITEM: 'delete',
    ENTER_EDIT: 'enterEdit',
    SAVE_ITEM: 'save'
};

export function FormComponentMixinFactory(mixinOptions) {
    let {
        modelReference,
        entityName,
        internalName
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for FormComponentMixinFactory'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;

    return {
        props: {
            currentMode: String
        },
        data: function () {
            return {
                FORM_ACTIONS: FORM_ACTIONS,
                currentViewMode: MODES.VIEW_MODE
            }; // exposing FORM_ACTIONS for binding to Mixin-defined actions
        },
        computed: {
            IsViewMode() {
                return this.currentMode ?
                    this.currentMode === MODES.VIEW_MODE :
                    this.currentViewMode == MODES.VIEW_MODE;
            }
        },
        created: function () {
            if (!!this.id) {
                if (this.id === 'create') {
                    this['create' + uniqueName]();
                    this.currentViewMode = MODES.EDIT_MODE;
                }
            }
        },
        methods: {
            cancelEdit() {
                this.currentViewMode = MODES.VIEW_MODE;
            },
            enterEdit() {
                // Cloning main entity
                this.currentViewMode = MODES.EDIT_MODE;
            },
            async ['create' + uniqueName]() {
                let newEntity = await modelReference.createNew();
                this['local' + uniqueName + 'PK'] = newEntity.$id;
                this.currentViewMode = MODES.EDIT_MODE;
            },
            async ['delete' + uniqueName]() {
                if (this.id) {
                    if (
                        window.confirm(
                            'Are you sure you want to delete this entity?'
                        )
                    ) {
                        await this.$store.dispatch('crud/delete', {
                            entityName: toLowerEntityName,
                            pks: [this['local' + uniqueName + 'PK']]
                        });
                    }
                }
            },
            async ['save' + uniqueName]() {
                if (this['current' + uniqueName + 'Item'] != null) {
                    // Persist to DB
                    await this.$store.dispatch('crud/saveAll', {
                        entityName: toLowerEntityName
                    });

                    // Refetch
                    await this['refetch' + uniqueName]();

                    this.currentViewMode = MODES.VIEW_MODE;
                }
            }
        }
    };
}