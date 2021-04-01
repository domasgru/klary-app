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
      />
    </template>
  </WorkspaceFormLayout>
</template>

<script>
import { useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm';
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
    const { form, getForm } = useForm(router.currentRoute.value.params.id);

    getForm();

    return {
      form,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
