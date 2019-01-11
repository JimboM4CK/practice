<template>
    <div :class="['ui', 'modal', modalClass]">
        <div :class="['header', headerClass]">
            <slot name="header">
                This is the default tile!
            </slot>
        </div>
        <div :class="['content', contentClass]">
            <slot name="content">
                Default content
            </slot>
        </div>
        <div :class="['actions', actionsClass]">
            <slot name="actions">
                <div class="ui button">Close</div>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: ['modalClass', 'actionsClass', 'headerClass', 'contentClass'],
}
</script>
