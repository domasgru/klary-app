<template>
  <WorkspaceFormLayout v-if="form">
    <WorkspaceFormHeader
      :title="form.title"
      view-mode="active"
    />
    <template #form>
      <WorkspaceFeedbackForm
        :feedback-request-data="form"
        view-mode="active"
        @form-input="updateFormQuestionAnswer($event)"
      />
    </template>
  </WorkspaceFormLayout>
</template>

<script>
import { useRouter } from 'vue-router';
import { useFormPure } from '@/composables/useForm';
import WorkspaceFormHeader from './WorkspaceFormHeader.vue';
import WorkspaceFormLayout from './WorkspaceFormLayout.vue';
import WorkspaceFeedbackForm from './WorkspaceFeedbackForm.vue';

export default {
  components: {
    WorkspaceFormHeader,
    WorkspaceFormLayout,
    WorkspaceFeedbackForm,
  },
  setup() {
    const router = useRouter();
    const { form, updateFormQuestionAnswer } = useFormPure(router.currentRoute.value.params.id);

    return {
      form,
      updateFormQuestionAnswer,
    };
  },
};
</script>
