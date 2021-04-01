import { computed, ref, toRefs } from 'vue';
import set from 'lodash.set';
import { getFeedbackRequestById, updateFeedbackRequest } from '@/firebase';

const forms = ref({});

export const useForm = (formId) => {
  const id = formId;
  const isLoading = ref(false);

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
  };

  const saveForm = () => updateFeedbackRequest(id, {
      ...forms.value[id],
  });

  return {
    form: computed(() => forms.value[id]),
    isLoading,
    getForm,
    updateForm,
    saveForm,
  };
};
