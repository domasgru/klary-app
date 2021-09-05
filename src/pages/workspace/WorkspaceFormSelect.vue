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
        <div
          v-for="(item, index) in options.items"
          :key="`item${index}-${id}`"
          class="checklist__item-wrapper"
        >
          <div class="checklist__input-wrapper">
            <label
              class="checklist__item"
              :class="{
                'checklist__item--checked': isItemSelected(item),
                'checklist__item--edit-mode': isEditMode
              }"
            >

              <input
                :id="`item${index}-${id}`"
                :value="item.title"
                :type="isSingleSelect ? 'radio' : 'checkbox'"
                class="checklist__input"
                :checked="isItemSelected(item)"
                :disabled="isEditMode || isDisabled"
                @input="updateSelectValue($event, item.title)"
              >
              <div
                class="checklist__input-controller"
                :class="{
                  'checklist__input-controller--radio': isSingleSelect,
                  'checklist__input-controller--checkbox': !isSingleSelect
                }"
              >
                <div
                  v-if="isSingleSelect && isItemSelected(item)"
                  class="checklist__radio-icon"
                />
                <BaseSvg
                  v-if="!isSingleSelect"
                  class="checklist__checklist-icon"
                  name="check"
                />
              </div>
              <div
                ref="itemTitle"
                class="checklist__title"
                :class="{'editable': isEditMode, 'editable--plain': isEditMode}"
                :contenteditable="isEditMode"
                data-placeholder="Type a choice"
                @blur="$emit('update', {id, key: `options.items[${index}].title`, value: $event.target.textContent})"
              >
                {{ item.title }}
              </div>
            </label>
          </div>

          <button
            v-if="isEditMode"
            class="checklist__delete-item"
            @click="deleteItem(item)"
          >
            <BaseIcon
              class="checklist__delete-icon"
              color="grey-600"
              name="close"
            />
          </button>
        </div>
      </div>
      <div
        v-show="doesAnswerContainCustomOption"
        class="checklist__custom"
      >
        <BaseTextarea
          label="Add your own option:"
          rows="1"
          padding="12px 16px"
          :is-preview="viewMode === 'view'"
          :is-disabled="isDisabled"
          :model-value="customOptionValue"
          @input="$emit('form-input', {key: 'customOptionValue', value: $event.target.value})"
        />
      </div>
      <BaseButton
        v-show="isSingleSelect && value !== null && viewMode === 'active'"
        type="secondary"
        class="checklist__unselect"
        @click="$emit('form-input', { value: null })"
        v-text="'Unselect'"
      />
      <div
        v-if="isEditMode"
        class="add-select"
        @click="$emit('update', {id, key: `options.items`, value: [...options.items, {title: ''}]})"
      >
        <BaseIcon
          name="plus"
          color="grey-600"
          class="add-select__icon"
        />
        Add choice
      </div>
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
      type: [Array, String],
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
    isSingleSelect: ({ options }) => !!options.isSingleSelect,
    doesAnswerContainCustomOption: ({ value, isSingleSelect }) => (
      isSingleSelect ? value && value.toLowerCase() === 'other' : value.some((item) => item.toLowerCase() === 'other')
    ),
  },
  methods: {
    deleteItem(checkBoxItem) {
      const updatedItems = this.options.items.filter((item) => item !== checkBoxItem);
      this.$emit('update', { id: this.id, key: 'options.items', value: updatedItems });
    },
    updateSelectValue(event, item) {
      if (this.isSingleSelect) {
        this.$emit('form-input', { value: event.target.value });
      } else if (event.target.checked) {
        this.$emit('form-input', { value: [...this.value, item] });
      } else {
        this.$emit('form-input', { value: this.value.filter((value) => value !== item) });
      }
    },
    isItemSelected(item) {
      return this.isSingleSelect ? this.value === item.title : this.value.includes(item.title);
    },
    async focusAddedOption() {
      await this.$nextTick();
      this.$refs.itemTitle.focus();
    },
  },
};
</script>

<style scoped lang="scss">
.checklist {
  &__item-wrapper {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__item {
    position: relative;
    display: flex;
    padding: 7px 10px;
    cursor: pointer;
    background: $grey-50;
    border: 1px solid $grey-200;
    border-radius: 8px;

    &--checked {
      background: $primary-light-10;
      border: 1px solid $primary;
    }

    &--edit-mode {
      &:focus-within {
        background: $grey-100;
        border: 1px solid $grey-600;
      }
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__title {
    flex-grow: 1;
    min-height: 24px;
    line-height: 24px;
    pointer-events: auto;
  }

  &__input-wrapper {
    position: relative;
    flex-grow: 1;
    margin-right: 8px;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  &__input-controller {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    margin-right: 10px;
    background: $light;
    border: 1.5px solid $grey-300;

    &--radio {
      border-radius: 50%;
    }

    &--checkbox {
      border-radius: 6px;
    }
  }

  &__input:checked + &__input-controller--checkbox {
    background: $primary;
    border: 1.5px solid $primary;
  }

  &__input:checked + &__input-controller--radio {
    border: 1.5px solid $primary;
  }

  &__label {
    font-size: 16px;
    line-height: 24px;
  }

  &__radio-icon {
    width: 10px;
    height: 10px;
    background: $primary;
    border-radius: 50%;
  }

  &__checklist-icon {
    width: 16px;
    height: 16px;
    stroke: $light;
  }

  &__delete-item {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    pointer-events: auto;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
      background: $grey-100;
    }
  }

  &__delete-icon {
    width: 20px;
    height: 20px;
  }

  &__custom {
    margin-top: 24px;
  }

  &__unselect {
    margin-top: 24px;
  }
}

.add-select {
  display: flex;
  align-items: center;
  margin-top: 24px;
  font-size: 16px;
  color: $grey-600;
  pointer-events: auto;
  cursor: pointer;

  &__icon {
    margin-right: 8px;
  }
}
</style>
