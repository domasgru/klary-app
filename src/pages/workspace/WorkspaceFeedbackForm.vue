<template>
  <div
    v-if="showFormInitials"
    class="form__initials"
  >
    <div class="form__author">
      <button
        v-if="isEditMode"
        class="form__author-toggle btn2s"
        @click="$emit('update-form', {path: 'showAuthor', value: !feedbackRequestData.showAuthor})"
      >
        {{ feedbackRequestData.showAuthor ? 'Hide my name' : 'Show my name' }}
      </button>
      <div
        v-if="feedbackRequestData.showAuthor"
        class="form__author-initials"
      >
        <BaseAvatar
          class="form__avatar"
          :picture="feedbackRequestData.picture"
          :name="feedbackRequestData.name"
        />
        <div
          class="b1s"
          v-text="feedbackRequestData.name"
        />
      </div>
    </div>

    <div
      v-if="showFormTitle"
      class="form__initial form__title h4 editable"
      :contenteditable="isEditMode"
      data-placeholder="Type a form title"
      @input="$emit('update-form', {path: 'formTitle', value: $event.target.textContent})"
      @blur="$emit('save')"
    >
      {{ feedbackRequestData.formTitle }}
    </div>

    <div
      v-if="showFormDescription"
      class="form__initial form__description b1 editable"
      :contenteditable="isEditMode"
      data-placeholder="Type a form description (optional)"
      @input="$emit('update-form', {path: 'formDescription', value: $event.target.textContent})"
      @blur="$emit('save')"
    >
      {{ feedbackRequestData.formDescription }}
    </div>
    <div
      v-if="!isEditMode"
      class="form__initia form__required b2"
    >
      * Required
    </div>
  </div>

  <div class="form__questions">
    <component
      :is="`WorkspaceForm${$options.capitalize(question.type)}`"
      v-for="question in feedbackRequestData.questions"
      :id="question.id"
      :key="question.id"
      :options="question.options"
      :view-mode="viewMode"
      class="form__question"
      @update="$emit('update-form-question', $event)"
      @save="$emit('save', $event)"
      @duplicate="$emit('duplicate', question.id)"
      @delete="$emit('delete', question.id)"
    />
  </div>

  <BaseButton
    v-if="viewMode === 'active'"
    size="lg"
    class="submit-button"
    @click="$emit('submit')"
    v-text="'Submit'"
  />
</template>

<script>
import { capitalize } from '@/utils/stringUtils';
import WorkspaceFormShortAnswer from './WorkspaceFormShortAnswer.vue';
import WorkspaceFormLongAnswer from './WorkspaceFormLongAnswer.vue';
import WorkspaceFormOpinionScale from './WorkspaceFormOpinionScale.vue';

export default {
  components: {
    WorkspaceFormShortAnswer,
    WorkspaceFormLongAnswer,
    WorkspaceFormOpinionScale,
  },
  props: {
    viewMode: {
      type: String,
      default: 'edit',
    },
    feedbackRequestData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update-form', 'update-form-question', 'save', 'submit', 'delete', 'duplicate'],
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
    },
    showFormTitle() {
      return this.feedbackRequestData.formTitle || this.isEditMode;
    },
    showFormDescription() {
      return this.feedbackRequestData.formDescription || this.isEditMode;
    },
    showFormInitials() {
      return this.showFormTitle || this.showFormDescription;
    },
  },
  capitalize,
};
</script>

<style lang="scss" scoped>
.form {
  &__initials {
    width: 100%;
    padding: 48px 64px;
    background: $light;
    border-radius: $border-radius;
    border: $stroke;
  }

  &__author-toggle {
    background: $light;
    border: 1px solid $grey-200;
    border-radius: 4px;
    padding: 4px 8px;
    margin-bottom: 16px;

    &:hover {
      cursor: pointer;
    }
  }

  &__author-initials {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  &__avatar {
    margin-right: 8px;
  }

  &__questions {
    width: 100%;
    margin-top: 16px;
  }

  &__title {
    margin-bottom: 16px;
  }

  &__description {
    margin-bottom: 16px;
  }

  &__required {
    color: $error;
  }

  &__initial:last-child {
    margin-bottom: 0;
  }

  &__question {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

.submit-button {
  width: 208px;
  margin-top: 48px;
}
</style>
