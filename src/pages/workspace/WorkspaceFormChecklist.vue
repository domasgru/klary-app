<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <div class="checklist">
      <label
        v-for="(item, index) in options.items"
        :key="`item${index}-${id}`"
        class="checklist__item"
        :class="{'checklist__item--checked': value.includes(item.title)}"
      >
        <div class="checklist__input-wrapper">
          <input
            :id="`item${index}-${id}`"
            :value="item.title"
            type="checkbox"
            class="checklist__input"
            :checked="value.includes(item.title)"
            :disabled="isEditMode"
            @input="t($event, item.title)"
          >
          <div class="checklist__input-controller">
            <BaseSvg
              class="checklist__check-icon"
              name="checkbox-check"
            />
          </div>
        </div>
        <div
          class="checklist__title"
          :contenteditable="isEditMode"
          @blur="$emit('update', {id, key: `options.items[${index}].title`, value: $event.target.textContent})"
        >
          {{ item.title }}
        </div>

      </label>
    </div>
  </WorksapceFormQuestionBase>
</template>

<script>
import WorksapceFormQuestionBase from './WorkspaceFormQuestionBase.vue';

export default {
  components: {
    WorksapceFormQuestionBase,
  },
  props: {
    viewMode: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      default: null,
    },
    options: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete', 'form-input'],
  computed: {
    isEditMode: ({ viewMode }) => viewMode === 'edit',
    placeholder: ({ isEditMode }) => (isEditMode ? 'Short answer' : 'Your answer'),
  },
  methods: {
    t(e, item) {
      console.log(this.value);
      if (e.target.checked) {
        this.$emit('form-input', [...this.value, item]);
      } else {
        this.$emit('form-input', this.value.filter((value) => value !== item));
      }
      console.log(e.target.checked);
    },
  },
};
</script>

<style lang="scss">
.checklist {
  &__item {
    display: block;
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background: $grey-50;
    border: 1px solid $grey-200;
    border-radius: 8px;

    &--checked {
      background: $primary-light-10;
      border: 1px solid $primary;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__title {
    pointer-events: auto;
  }

  &__input-wrapper {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &__input {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &__input-controller {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: $light;
    border: 1.5px solid $grey-300;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  &__input:checked + &__input-controller {
    background: $primary;
    border: 1.5px solid $primary;
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
  }

  &__check-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
