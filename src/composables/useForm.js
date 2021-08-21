import { computed, ref, toRefs } from 'vue';
import set from 'lodash.set';
import { getFeedbackRequestById, updateFeedbackRequest } from '@/firebase';

const forms = ref({});

export const useForm = (formId) => {
  const id = formId;
  const isLoading = ref(false);

  const saveForm = () => updateFeedbackRequest(id, {
    ...forms.value[id],
  });

  const getForm = async () => {
    if (forms.value[id]) {
      return;
    }

    isLoading.value = true;
    const form = await getFeedbackRequestById(id);
    isLoading.value = false;

    if (!form) {
      console.error('Failed to load a form');
      return;
    }
    console.log(form);
    forms.value[id] = form;
  };

  const updateForm = ({ path, value }) => {
    const form = forms.value[id];
    if (!form) {
      console.error('First get form, before updating it');
      return;
    }

    set(forms.value, `${id}.${path}`, value);
    saveForm();
  };

  return {
    form: computed(() => forms.value[id]),
    isLoading,
    getForm,
    updateForm,
    saveForm,
  };
};

export const useFormPure = (formId) => {
  const isLoading = ref(true);
  const form = ref(null);

  const getForm = async () => {
    if (forms.value[formId]) {
      form.value = JSON.parse(JSON.stringify(forms.value[formId]));
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
