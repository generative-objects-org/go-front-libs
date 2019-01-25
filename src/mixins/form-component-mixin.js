import {
    cloneDeep
} from 'lodash-es';

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
        internalName,
        includes
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for FormComponentMixinFactory'
        );

    let toLowerEntityName = entityName.toLowerCase();
    let uniqueName = internalName || entityName;
    let localObjectVariable = 'local' + uniqueName + 'Object';

    return {
        props: {
            currentMode: String
        },
        data: function () {
            return {
                [localObjectVariable]: null,
                FORM_ACTIONS: FORM_ACTIONS,
                currentViewMode: MODES.VIEW_MODE
            }; // exposing FORM_ACTIONS for binding to Mixin-defined actions
        },
        computed: {
            // This will overwrite the existing "currentItem" computed added by SingleEntityComponentMixin
            ['current' + uniqueName + 'Item']: function () {
                if (this.item) return this.item;
                if (this[localObjectVariable] !== null)
                    return this[localObjectVariable];
                else if (this.storeObject !== null)
                    return this.storeObject;
                else // Creating a dummy temporary instance, waiting for item to be set
                    return modelReference.createNew(false);
            },
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
                // Do nothing, will fall back to $store object through the "currentXXXItem"
                this[localObjectVariable] = null;
                this.currentViewMode = MODES.VIEW_MODE;
            },
            enterEdit() {
                // Cloning main entity
                this[localObjectVariable] = cloneDeep(this.storeObject);
                this.currentViewMode = MODES.EDIT_MODE;
            },
            ['create' + uniqueName]() {
                this[localObjectVariable] = modelReference.createNew();
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
                            pks: [this.id]
                        });
                    }
                }
            },
            async ['save' + uniqueName]() {
                if (this[localObjectVariable] != null) {
                    await this.$store.dispatch(
                        'entities/' + toLowerEntityName + '/insertOrUpdate', {
                            data: this[localObjectVariable]
                        }
                    );

                    // Persist to DB
                    await this.$store.dispatch('crud/saveAll', {
                        entityName: toLowerEntityName
                    });

                    // Refetch
                    let entity = await this['load' + uniqueName](
                        this[localObjectVariable].Id
                    );
                    this[localObjectVariable] = null;
                    this.Id = entity.Id;
                    this.currentViewMode = MODES.VIEW_MODE;
                }
            }
        }
    };
}