<template>
  <WorkspaceFormLayout v-if="form">
    <WorkspaceFormHeader
      :title="form.title"
      view-mode="edit"
    />
    <template #form>
      <WorkspaceFeedbackForm
        :feedback-request-data="form"
        @update-form="updateForm"
        @update-form-question="updateQuestion"
        @update-questions="updateQuestionsList"
        @duplicate="duplicateQuestion"
        @delete="deleteQuestion"
      />
      <WorkspaceFormAddQuestion @add-form-question="addQuestion" />
    </template>
  </WorkspaceFormLayout>
</template>

<script>
import { computed } from 'vue';
import { nanoid } from 'nanoid';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import set from 'lodash.set';
import { updateFeedbackRequest } from '@/firebase';
import { useForm } from '@/composables/useForm';
import WorkspaceFeedbackForm from './WorkspaceFeedbackForm.vue';
import WorkspaceFormAddQuestion from './WorkspaceFormAddQuestion.vue';
import WorkspaceFormLayout from './WorkspaceFormLayout.vue';
import WorkspaceFormHeader from './WorkspaceFormHeader.vue';

export default {
  components: {
    WorkspaceFeedbackForm,
    WorkspaceFormAddQuestion,
    WorkspaceFormHeader,
    WorkspaceFormLayout,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const form = computed(
      () => store.state.feedback.feedbackRequests.find((request) => request.id === router.currentRoute.value.params.id),
    );

    const updateForm = ({ path, value }) => {
      const formCopy = JSON.parse(JSON.stringify(form.value));
      set(formCopy, path, value);
      updateFeedbackRequest(router.currentRoute.value.params.id, {
        ...formCopy,
      });
    };

    return {
      form,
      updateForm,
    };
  },
  data() {
    return {
      feedbackRequestDataFirebaseRef: null,
      feedbackRequestData: null,
    };
  },
  methods: {
    addQuestion(questionData) {
      let questions = null;
      if (!this.form.questions) {
        questions = [];
      } else {
        questions = this.form.questions.slice();
      }

      this.updateForm({
        path: 'questions',
        value: [...questions, { ...JSON.parse(JSON.stringify(questionData)), id: nanoid(10) }],
      });
    },
    duplicateQuestion(id) {
      const arrayWithDuplicatedQuestion = this.form.questions.flatMap(
        (item) => (item.id === id ? [item, { ...JSON.parse(JSON.stringify(item)), id: nanoid(10) }] : [item]),
      );
      this.updateForm({
        path: 'questions',
        value: arrayWithDuplicatedQuestion,
      });
    },
    deleteQuestion(id) {
      const arrayWithDeletedQuestion = this.form.questions.filter((question) => question.id !== id);
      this.updateForm({
        path: 'questions',
        value: arrayWithDeletedQuestion,
      });
    },
    updateQuestionsList({ value }) {
      this.updateForm({
        path: 'questions',
        value,
      });
    },
    updateQuestion({ id, key, value }) {
      const questionIndex = this.form.questions.findIndex((question) => question.id === id);
      this.updateForm({
        path: `questions[${questionIndex}].${key}`,
        value,
      });
    },
  },
};
</script>
