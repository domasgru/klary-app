<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <div class="opinion-scale">
      <div
        v-for="index in (options.scaleSize + 1)"
        :key="`option${index - 1}`"
        class="opinion-scale__option"
      >
        <input
          :id="`option${index - 1}`"
          type="radio"
          name="opinion-scale"
          :value="`option${index - 1}`"
        >
        <label
          :for="`option${index - 1}`"
          class="btn1s"
        >
          {{ index - 1 }}
        </label>
      </div>
    </div>
    <div
      class="opinion-scale-labels caption"
    >
      <div
        class="opinion-scale-labels__label editable"
        contenteditable="true"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.low', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.low }}
      </div>
      <div
        class="opinion-scale-labels__label editable"
        contenteditable="true"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.medium', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.medium }}
      </div>
      <div
        class="opinion-scale-labels__label editable"
        contenteditable="true"
        data-placeholder="Type a label"
        @input="$emit('update', {id, key: 'options.scaleLabels.high', value: $event.target.textContent})"
        @blur="$emit('save')"
      >
        {{ options.scaleLabels.high }}
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
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete'],
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
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
      opacity: 0;
      position: absolute;
    }

    & label {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      background: $primary;
      border: 1px solid $primary;
      color: $light;
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
</style>
