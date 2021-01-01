import { ref } from 'vue';
import { useStore } from 'vuex';
import { createFeedbackRequest, getFeedbackRequest, updateFeedbackRequest } from '@/firebase';

const id = ref(null);
const isLoading = ref(false);
const message = ref('');
const link = ref(null);

export const useFeedbackRequest = () => {
  const store = useStore();
  const {
    uid, name, picture, googlePicture,
  } = store.state.user.userData;
  const setMessage = (value) => { message.value = value; };

  const loadFeedbackRequestData = async () => {
    try {
      isLoading.value = true;
      let feedbackRequest = await getFeedbackRequest(uid);
      if (!feedbackRequest) {
        feedbackRequest = await createFeedbackRequest({
          uid,
          name,
          message: '',
          picture: picture || '',
          googlePicture: googlePicture || '',
        });
      }

      id.value = feedbackRequest.id;
      link.value = `${window.origin}/give-feedback/${feedbackRequest.id}`;
      message.value = feedbackRequest.message || '';
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const updateFeedbackRequestData = () => {
    updateFeedbackRequest(id.value, {
      message: message.value,
    });
  };

  if (!id.value) {
    loadFeedbackRequestData();
  }

  return {
    id,
    isLoading,
    message,
    link,
    setMessage,
    updateFeedbackRequestData,
  };
};
