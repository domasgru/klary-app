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
          :is="question.component"
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
            <BaseIcon
              color="grey-600"
              class="form__order-icon"
              name="up"
            />
          </button>
          <button
            class="form__order-button"
            @click="moveQuestion('bottom', index)"
          >
            <BaseIcon
              color="grey-600"
              class="form__order-icon"
              name="down"
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

      <div class="form__klary b1">
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
import WorkspaceFormSelect from './WorkspaceFormSelect.vue';

export default {
  components: {
    WorkspaceFormShortAnswer,
    WorkspaceFormLongAnswer,
    WorkspaceFormOpinionScale,
    WorkspaceFormSelect,
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
  emits: ['update-form', 'update-form-question', 'submit', 'delete', 'duplicate', 'form-input', 'update-questions'],
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
      const { questions } = this.feedbackRequestData;
      let updatedQuestions = null;
      if (direction === 'bottom') {
        // Moving last question to bottom resets it to first one.
        if (index === questions.length - 1) {
          updatedQuestions = arrayMove(questions, index, 0);
        } else {
          updatedQuestions = arrayMove(questions, index, (index + 1));
        }
      } else if (direction === 'top') {
        updatedQuestions = arrayMove(questions, index, (index - 1));
      }
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
    padding: 48px 56px;
    background: $light;
    border: $stroke;
    border-radius: $border-radius;

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
    padding: 0 8px;
    margin-bottom: 16px;
  }

  &__author-initials {
    display: flex;
    align-items: center;
  }

  &__avatar {
    margin-right: 8px;
  }

  &__questions {
    width: 100%;
    margin-top: 16px;
  }

  &__title {
    padding: 8px;
  }

  &__description {
    padding: 8px;
    margin-bottom: 16px;
  }

  &__required {
    padding-left: 8px;
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

  }

  &__question-controls {
    position: absolute;
    top: 0;
    left: -48px;
  }

  &__order-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;

    &:hover {
      cursor: pointer;
      background: $grey-150;
    }
  }

  &__klary {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $grey-400;
  }

  &__logo {
    margin-top: 10px;
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

.mb-16px {
  margin-bottom: 16px;
}
</style>
