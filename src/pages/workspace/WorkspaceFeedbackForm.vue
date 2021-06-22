<template>
  <div
    class="form"
    @paste="$options.pasteAsPlainText"
  >
    <div
      v-if="showFormInitials"
      class="form__initials"
    >
      <div
        v-if="isEditMode || (!isEditMode && feedbackRequestData.showAuthor)"
        class="form__initial form__author"
      >
        <button
          v-if="isEditMode"
          class="form__author-toggle btn2s"
          :class="{
            'mb-16px': feedbackRequestData.showAuthor
          }"
          @click="$emit('update-form', { path: 'showAuthor', value: !feedbackRequestData.showAuthor })"
        >
          {{ feedbackRequestData.showAuthor ? 'Hide my name' : 'Show my name' }}
        </button>
        <div
          v-if="feedbackRequestData.showAuthor"
          class="form__author-initials"
        >
          <div class="form__avatars">
            <img
              class="form__avatar"
              :src="require('@/assets/images/klary-avatar.png')"
              alt="Klary avatar"
            >
            <img
              class="form__avatar"
              :src="require('@/assets/images/dominykas-avatar.png')"
              alt="Dominykas avatar"
            >
            <img
              class="form__avatar"
              :src="require('@/assets/images/justinas-avatar.png')"
              alt="Justinas avatar"
            >
          </div>
          <div
            class="form__author-title b1s"
            v-text="'Klary team'"
          />
        </div>
      </div>

      <div
        v-if="showFormTitle"
        class="form__initial form__title h4"
        :contenteditable="isEditMode"
        :class="{'editable': isEditMode}"
        data-placeholder="Type a form title"
        @blur="$emit('update-form', { path: 'formTitle', value: $event.target.textContent })"
      >
        {{ feedbackRequestData.formTitle }}
      </div>

      <div
        v-if="showFormDescription"
        class="form__initial form__description b1"
        :contenteditable="isEditMode"
        :class="{'editable': isEditMode}"
        data-placeholder="Type a form description"
        @blur="$emit('update-form', {path: 'formDescription', value: $event.target.innerHTML})"
        v-html="feedbackRequestData.formDescription"
      />
      <div
        v-if="!isEditMode && hasRequiredQuestions"
        class="form__initial form__required b2"
      >
        * Required
      </div>
    </div>

    <div class="form__questions">
      <div
        v-for="(question, index) in feedbackRequestData.questions"
        :key="question.id"
        class="form__question-wrapper"
      >
        <component
          :is="`WorkspaceForm${$options.capitalize(question.type)}`"
          :id="question.id"
          :options="question.options"
          :view-mode="viewMode"
          :is-disabled="viewMode === 'view'"
          :error="(errors && errors[question.id]) || null"
          class="form__question"
          :value="question.value"
          :custom-option-value="question.customOptionValue"
          @update="$emit('update-form-question', $event)"
          @duplicate="$emit('duplicate', question.id)"
          @delete="$emit('delete', question.id)"
          @form-input="$emit('form-input', {...$event, id: question.id})"
        />
        <div
          v-if="isEditMode"
          class="form__question-controls"
        >
          <button
            class="form__order-button"
            @click="moveQuestion('top', index)"
          >
            <BaseSvg
              class="form__order-top-icon"
              name="arrow-down"
            />
          </button>
          <button
            class="form__order-button"
            @click="moveQuestion('bottom', index)"
          >
            <BaseSvg
              class="form__order-down-icon"
              name="arrow-down"
            />
          </button>
        </div>
      </div>
    </div>

    <template v-if="viewMode === 'active'">
      <BaseButton
        size="lg"
        class="submit-button"
        @click="$emit('submit')"
        v-text="'Submit'"
      />

      <div class="form__kuri b1">
        Made with
        <BaseLogo
          type="full"
          color="grey"
          size="lg"
          class="form__logo"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { capitalize } from '@/utils/stringUtils';
import { pasteAsPlainText } from '@/utils/pasteAsPlainText';
import arrayMove from 'array-move';
import WorkspaceFormShortAnswer from './WorkspaceFormShortAnswer.vue';
import WorkspaceFormLongAnswer from './WorkspaceFormLongAnswer.vue';
import WorkspaceFormOpinionScale from './WorkspaceFormOpinionScale.vue';
import WorkspaceFormChecklist from './WorkspaceFormChecklist.vue';

export default {
  components: {
    WorkspaceFormShortAnswer,
    WorkspaceFormLongAnswer,
    WorkspaceFormOpinionScale,
    WorkspaceFormChecklist,
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
    errors: {
      type: Object,
      default: null,
    },
  },
  emits: ['update-form', 'update-form-question', 'save', 'submit', 'delete', 'duplicate', 'form-input', 'update-questions'],
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
      return this.feedbackRequestData.showAuthor || this.showFormTitle || this.showFormDescription;
    },
    hasRequiredQuestions() {
      return this.feedbackRequestData.questions.some(({ options }) => options.isRequired);
    },
  },
  methods: {
    moveQuestion(direction, index) {
      const updatedQuestions = direction === 'bottom'
        ? arrayMove(this.feedbackRequestData.questions, index, (index + 1))
        : arrayMove(this.feedbackRequestData.questions, index, (index - 1));
      this.$emit('update-questions', { value: updatedQuestions });
    },
  },
  capitalize,
  pasteAsPlainText,
};
</script>

<style lang="scss" scoped>
.form {
  $this: &;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__initials {
    width: 100%;
    padding: 48px 64px;
    background: $light;
    border: $stroke;
    border-radius: $border-radius;
    opacity: 0.2;
    transform: translateY(48px);
    animation: resetTransform 0.3s ease forwards;

    @media screen and (max-width: 836px) {
      padding: 32px;
    }
  }

  &__author-toggle {
    padding: 4px 8px;
    background: $light;
    border: 1px solid $grey-200;
    border-radius: 4px;

    &:hover {
      cursor: pointer;
    }
  }

  &__author {
    margin-bottom: 24px;
  }

  &__author-initials {
    display: inline-flex;
    align-items: center;
  }

  &__author-initials:hover {
    & #{$this}__avatar {
      transform: translateX(0) !important;
    }

    & #{$this}__author-title {
      transform: translateX(0) !important;
    }
  }

  &__avatars {
    display: flex;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    margin-right: 4px;
    transition: transform 0.4s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:last-child {
      margin-right: 8px;
    }

    &:nth-of-type(1) {
      z-index: 3;
    }

    &:nth-of-type(2) {
      z-index: 2;
      transform: translateX(-20px);
    }

    &:nth-of-type(3) {
      z-index: 1;
      transform: translateX(-40px);
    }
  }

  &__author-title {
    transition: transform 0.4s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: translateX(-40px);
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

  &__question-wrapper {
    position: relative;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  &__question {
    opacity: 0.2;
    transform: translateY(56px);
    animation: resetTransform 0.3s ease forwards;
  }

  &__question-controls {
    position: absolute;
    top: 0;
    left: -50px;
  }

  &__order-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;

    &:hover {
      background: $grey-200;
    }
  }

  &__order-top-icon {
    width: 20px;
    height: 8px;
    transform: rotate(180deg);
  }

  &__order-down-icon {
    width: 20px;
    height: 8px;
  }

  &__kuri {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $grey-400;
  }

  &__logo {
    margin-top: 10px;
  }
}

@keyframes resetTransform {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-button {
  width: 208px;
  margin-top: 48px;
  margin-bottom: 88px;

  @media screen and (max-width: 838px) {
    margin-bottom: 64px;
  }
}
</style>
