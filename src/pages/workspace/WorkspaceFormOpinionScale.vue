<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <div
      class="opinion-scale"
      :class="{'pointer-events-none': isDisabled}"
    >
      <div
        v-for="index in (options.scaleSize + 1)"
        :key="`option${index - 1}`"
        class="opinion-scale__option"
      >
        <input
          :id="`option${index - 1}-${id}`"
          type="radio"
          :name="`opinion-scale-${id}`"
          :value="index - 1"
          :checked="parseInt(value, 10) === index - 1"
          @input="$emit('form-input', {value: $event.target.value})"
        >
        <label
          :for="`option${index - 1}-${id}`"
          class="btn1s"
        >
          {{ index - 1 }}
        </label>
      </div>
    </div>
    <div
      v-if="showScaleLabels"
      class="opinion-scale-labels caption"
    >
      <div
        v-if="options.scaleLabels.low"
        class="opinion-scale-labels__label"
        :contenteditable="isEditMode"
        :class="{'editable': isEditMode}"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.low', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.low }}
      </div>
      <div
        v-if="options.scaleLabels.medium"
        class="opinion-scale-labels__label"
        :contenteditable="isEditMode"
        :class="{'editable': isEditMode}"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.medium', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.medium }}
      </div>
      <div
        v-if="options.scaleLabels.high"
        class="opinion-scale-labels__label"
        :contenteditable="isEditMode"
        :class="{'editable': isEditMode}"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.high', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.high }}
      </div>
    </div>
    <div
      v-if="error"
      class="opinion-scale-error caption"
    >
      {{ error }}
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
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: null,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete', 'form-input'],
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
    },
    showScaleLabels() {
      const { low, medium, high } = this.options.scaleLabels;
      return low || medium || high;
    },
  },
};
</script>

<style lang="scss" scoped>
.opinion-scale {
  display: flex;

  &__option {
    flex: 1;

    &:not(:last-child) {
      margin-right: 8px;
    }

    & input {
      position: absolute;
      opacity: 0;
    }

    & label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      border: 1px solid $grey-200;
      border-radius: 10px;
      //transition: all 0.2s ease;

      &:hover {
        cursor: pointer;
        background: $grey-100;
        border: 1px solid $grey-400;
      }
    }

    & input:checked + label {
      color: $light;
      background: $primary;
      border: 1px solid $primary;
    }
  }
}

.opinion-scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;

  &__label {
    flex: 1;

    &:not(:first-child):not(:last-child) {
      text-align: center;
    }

    &:last-child {
      text-align: right;
    }
  }
}

.opinion-scale-error {
  margin-top: 24px;
  color: $error;
}
</style>
