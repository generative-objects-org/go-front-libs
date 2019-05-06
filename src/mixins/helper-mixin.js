export function BubbleMethodMixin() {
    return {
        methods: {
            bubbleMethod(busName, payload) {
                this.$emit(busName, payload);
            }
        }
    }
}