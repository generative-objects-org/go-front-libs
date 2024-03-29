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

    // Internal data to track CREATE mode
    let _hasCreatedNew = false;
    let _idBeforeCreate = null;

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
            },
            computedViewMode() {
                return this.currentMode || this.currentViewMode;
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
        // Making sure we don't leave unsaved changes if we're editing 
        // the "root" entity (i.e. if this.item == null) 
        beforeDestroy: function () {
            if (!this.IsViewMode && !this.item) {
                this.cancelEdit();
            }
        },
        methods: {
            cancelEdit() {
                // Undoing all changes from last tag
                this.undo(_currentEditTagName);
                _currentEditTagName = null;

                // If there was a previous item, switch back to it
                if (_hasCreatedNew) {
                    _hasCreatedNew = false;
                    this['local' + _uniqueName + 'PK'] = _idBeforeCreate;
                    _idBeforeCreate = null;
                }

                // Switching mode
                this.currentViewMode = MODES.VIEW_MODE;
                this.$emit("form:cancel-edit");
            },
            enterEdit() {
                // Tagging current state before anything
                _currentEditTagName = newGuid();
                this.$store.commit('tagUndoMutation', _currentEditTagName);

                // Switching mode
                this.currentViewMode = MODES.EDIT_MODE;
                this.$emit("form:enter-edit");
            },
            async ['create' + _uniqueName]() {
                // Tagging current state before anything
                _currentEditTagName = newGuid();
                this.$store.commit('tagUndoMutation', _currentEditTagName);

                // Keeping track of current Id
                _hasCreatedNew = true;
                _idBeforeCreate = this['local' + _uniqueName + 'PK'];

                // Creating new entity
                let newEntity = await modelReference.createNew();
                this['local' + _uniqueName + 'PK'] = newEntity.$id;

                // Switching mode
                this.currentViewMode = MODES.EDIT_MODE;
                this.$emit("form:item-created", newEntity);
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
                        this.$emit("form:item-deleted", this.id);
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

                    // Clearing temp data
                    _hasCreatedNew = false;
                    _idBeforeCreate = null;

                    // Switching mode
                    this.currentViewMode = MODES.VIEW_MODE;
                    this.$emit("form:item-saved", this['current' + _uniqueName + 'Item']);
                }
            }
        }
    };
}