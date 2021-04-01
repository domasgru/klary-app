<template>
  <div class="form">
    <div class="form__content">
      <div class="form__title-wrapper h6">
        <div
          v-if="showFormTitle"
          class="form__text editable"
          :contenteditable="isEditMode"
          data-placeholder="Type a question"
          :class="{'display-inline-block': !isEditMode}"
          @input="$emit('update', {id, key: 'options.title', value: $event.target.textContent})"
          @blur="$emit('save')"
        >
          {{ options.title }}
        </div>
        <span
          v-if="!isEditMode && options.isRequired"
          class="form__star-required"
        >
          *
        </span>
      </div>
      <div
        v-if="showFormDescription"
        class="form__text b1 editable"
        :contenteditable="isEditMode"
        data-placeholder="Type a description (optional)"
        @input="$emit('update', {id, key: 'options.description', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.description }}
      </div>

      <div :class="{'pointer-events-none': isEditMode}">
        <slot />
      </div>
    </div>
    <div
      v-if="isEditMode"
      class="form__settings"
    >
      <BaseSwitch
        class="form__required"
        label="Required"
        :value="options.isRequired"
        @change="$emit('update', {id, key: 'options.isRequired', value: $event.target.checked}), $emit('save')"
      />
      <BaseSvg
        class="form__settings-icon"
        name="duplicate"
        @click="$emit('duplicate')"
      />
      <BaseSvg
        class="form__settings-icon"
        name="trash"
        @click="$emit('delete')"
      />
      <BaseSvg
        class="form__settings-icon"
        name="more-horizontal"
        @click="showMoreOptions = true"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    viewMode: {
      type: String,
      required: true,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete'],
  data() {
    return {
      showMoreOptions: false,
    };
  },
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
    },
    showFormTitle() {
      return this.options.title || this.isEditMode;
    },
    showFormDescription() {
      return this.options.description || this.isEditMode;
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  border-radius: $border-radius;
  border: $stroke;
  color: $dark;
  background: $light;

  &__content {
    padding: 48px 64px;
  }

  &__text {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 24px;
    }
  }

  &__star-required {
    color: $error;
  }

  &__settings {
    display: flex;
    padding: 12px 64px;
    border-top: $stroke;
    background: $grey-50;
  }

  &__required {
    margin-right: auto;
  }

  &__settings-icon {
    width: 32px;
    height: 32px;
    stroke: $grey-600;
    padding: 6px;
    transition: all 0.2s ease;
    border-radius: 8px;

    &:hover {
      background: $grey-150;
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}

.display-inline-block {
  display: inline-block;
}
</style>
