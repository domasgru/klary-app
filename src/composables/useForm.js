import { computed, ref, toRefs } from 'vue';
import set from 'lodash.set';
import { getFeedbackRequestById, updateFeedbackRequest } from '@/firebase';
import { useStore } from 'vuex';

export const useFormPure = (formId) => {
  const isLoading = ref(true);
  const form = ref(null);
  const store = useStore();

  const getForm = async () => {
    const formFromVuex = store.state.feedback.feedbackRequests?.find((request) => request.id === formId);
    if (formFromVuex) {
      form.value = JSON.parse(JSON.stringify(formFromVuex));
      isLoading.value = false;
    }

    try {
      form.value = await getFeedbackRequestById(formId);
      if (!form.value) {
        console.error('No form found');
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateFormQuestionAnswer = ({ id, key, value }) => {
    const questionIndex = form.value.questions.findIndex((question) => question.id === id);
    set(form.value, `questions[${questionIndex}].${key || 'value'}`, value);
  };

  getForm();

  return {
    form,
    isLoading,
    getForm,
    updateFormQuestionAnswer,
  };
};
