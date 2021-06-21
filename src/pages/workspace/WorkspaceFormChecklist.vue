<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <div class="checklist">
      <div class="checklsit__items">
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
              :disabled="isEditMode || isDisabled"
              @input="updateChecklistValue($event, item.title)"
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
          <BaseButton
            v-if="isEditMode"
            class="checklist__delete-button"
            @click="deleteItem(item)"
            v-text="'Delete'"
          />
        </label>
      </div>
      <div
        v-show="doesAnswerContainCustomOption"
        class="checklist__custom"
      >
        <BaseInput
          label="Add your own option:"
          :model-value="customOptionValue"
          size="lg"
          :is-disabled="isDisabled"
          @input="$emit('form-input', {key: 'customOptionValue', value: $event.target.value})"
        />
      </div>
      <BaseButton
        v-if="isEditMode"
        class="add-checkbox"
        @click="$emit('update', {id, key: `options.items`, value: [...options.items, {title: 'Your title'}]})"
        v-text="'Add checkbox'"
      />
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
    customOptionValue: {
      type: String,
      default: '',
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
    doesAnswerContainCustomOption: ({ value }) => value.some((item) => item.toLowerCase() === 'other'),
  },
  methods: {
    updateChecklistValue(e, item) {
      if (e.target.checked) {
        this.$emit('form-input', { value: [...this.value, item] });
      } else {
        this.$emit('form-input', { value: this.value.filter((value) => value !== item) });
      }
    },
    deleteItem(checkBoxItem) {
      const updatedItems = this.options.items.filter((item) => item !== checkBoxItem);
      this.$emit('update', { id: this.id, key: 'options.items', value: updatedItems });
    },
  },
};
</script>

<style lang="scss">
.checklist {
  &__item {
    position: relative;
    display: flex;
    padding: 7px;
    cursor: pointer;
    user-select: none;
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
    flex-grow: 1;
    pointer-events: auto;
  }

  &__input-wrapper {
    position: relative;
    padding: 2px;
    margin-right: 10px;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  &__input-controller {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
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

  &__delete-button {
    position: absolute;
    right: 0;
    pointer-events: auto;
  }

  &__custom {
    margin-top: 24px;
  }
}

.add-checkbox {
  pointer-events: auto;
}
</style>
