import {
    newGuid
} from '../libs/go-uuid';

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
        pkName
    } = mixinOptions;

    if (!entityName)
        throw new Error(
            'Missing entityName option for FormComponentMixinFactory'
        );

    let _toLowerEntityName = entityName.toLowerCase();
    let _uniqueName = internalName || entityName;
    let _currentEditTagName = null;

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
                    this['create' + _uniqueName]();
                    this.currentViewMode = MODES.EDIT_MODE;
                }
            }
        },
        methods: {
            cancelEdit() {
                this.currentViewMode = MODES.VIEW_MODE;
                this.undo(_currentEditTagName);
                _currentEditTagName = null;
            },
            enterEdit() {
                // Cloning main entity
                this.currentViewMode = MODES.EDIT_MODE;
                _currentEditTagName = newGuid();
                this.$store.commit('tagUndoMutation', _currentEditTagName);
            },
            async ['create' + _uniqueName]() {
                let newEntity = await modelReference.createNew();
                this['local' + _uniqueName + 'PK'] = newEntity.$id;
                this.currentViewMode = MODES.EDIT_MODE;
            },
            async ['delete' + _uniqueName]() {
                if (this.id) {
                    if (
                        window.confirm(
                            'Are you sure you want to delete this entity?'
                        )
                    ) {
                        await this.$store.dispatch('crud/delete', {
                            entityName: _toLowerEntityName,
                            pks: [this['local' + _uniqueName + 'PK']]
                        });
                    }
                }
            },
            async ['save' + _uniqueName]() {
                if (this['current' + _uniqueName + 'Item'] != null) {
                    // Persist to DB
                    await this.$store.dispatch('crud/saveAll', {
                        entityName: _toLowerEntityName
                    });

                    // Refetch
                    await this['refetch' + _uniqueName + 'WithIdCheck']();

                    this.currentViewMode = MODES.VIEW_MODE;
                }
            }
        }
    };
}