<template>
  <WorkspaceFormLayout
    v-if="!isLoading && form"
  >
    <template #header>
      <div class="navigation">
        <div
          v-if="userData"
          class="navigation__user b2s"
        >
          <BaseAvatar
            class="navigation__user-avatar"
            size="sm"
            :name="userData.name"
            :picture="userData.picture"
          />
          {{ userData.name }}
        </div>
      </div>
    </template>
    <template #form>
      <!-- Feedback form -->
      <WorkspaceFeedbackForm
        :feedback-request-data="form"
        :errors="formErrors"
        view-mode="active"
        @form-input="updateFormQuestionAnswer($event), removeFormError($event)"
        @submit="submitMessage"
      />
    </template>
  </WorkspaceFormLayout>
  <div
    v-if="!isLoading && !form"
    class="error"
  >
    <BaseLogo
      class="error__logo"
    />
    <BaseSvg
      class="error__emoji"
      name="eyes-emoji"
    />
    <div class="error__title h4">
      Oops, this feedback request link was not found
    </div>
    <div class="error__description b1">
      Make sure you use the correct link.
    </div>
  </div>
  <BaseModal
    :show-modal="showSignupModal"
    max-width="592px"
    @close="showSignupModal = false"
  >
    <template #content>
      <div class="signup-modal">
        <Signup
          completion-text="Send feedback"
          @success="submitAfterLogin"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import set from 'lodash.set';
import { getFeedbackRequestById, createFeedback, getTime } from '@/firebase';
import { CREATE_ACTION } from '@/constants';
import { ACTIVE_STATE, ACTIVE_STATUS } from '@/constants/feedback';
import Signup from '@/pages/Signup.vue';
import WorkspaceFormLayout from '@/pages/workspace/WorkspaceFormLayout.vue';
import WorkspaceFeedbackForm from '@/pages/workspace/WorkspaceFeedbackForm.vue';
import { useFormPure } from '@/composables/useForm';

export default {
  components: {
    WorkspaceFormLayout,
    WorkspaceFeedbackForm,
    Signup,
  },
  setup() {
    const router = useRouter();

    const store = useStore();
    const userData = computed(() => store.state.user.userData);

    const formErrors = ref({});
    const removeFormError = ({ id }) => {
      if (!formErrors.value[id]) {
        return;
      }

      delete formErrors.value[id];
    };

    // For saving newly created feedback ID
    const sentFeedbackId = ref(null);

    const showSignupModal = ref(false);

    // INIT feedback request data
    const { requestId } = router.currentRoute.value.params;
    const { form, isLoading, updateFormQuestionAnswer } = useFormPure(requestId);

    const submitMessage = async () => {
      // Check if required questions have answers
      const unansweredRequiredQuestions = form.value.questions.filter((question) => question.options.isRequired && !question.value);
      if (unansweredRequiredQuestions?.length) {
        formErrors.value = unansweredRequiredQuestions.reduce((errorsObject, value) => {
          errorsObject[value.id] = 'This question is required';
          return errorsObject;
        }, {});
        return;
      }

      if (!userData.value) {
        showSignupModal.value = true;
        return;
      }

      const timeNow = getTime();
      const sentFeedback = await createFeedback({
        authorId: userData.value.uid,
        receiverId: form.value.uid,
        participants: {
          [userData.value.uid]: {
            feedbackState: ACTIVE_STATE,
            flags: [],
            name: userData.value.name,
            picture: userData.value.picture || '',
            lastAction: {
              createdAt: timeNow,
              type: CREATE_ACTION,
            },
            seenAt: timeNow,
          },
          [form.value.uid]: {
            feedbackState: ACTIVE_STATE,
            flags: [],
            name: form.value.name,
            picture: form.value.picture || '',
            lastAction: {
              createdAt: null,
              type: '',
            },
            seenAt: null,
          },
        },
        title: form.value.title,
        form: JSON.parse(JSON.stringify(form.value)),
        status: ACTIVE_STATUS,
        feedbackRequestId: requestId,
      });
      sentFeedbackId.value = sentFeedback.id;
      window.umami.trackEvent(userData.value.email, 'send-feedback');
      openFeedback();
    };

    const submitAfterLogin = async () => {
      try {
        await submitMessage();
        showSignupModal.value = false;
        openFeedback();
      } catch (e) {
        console.error(e);
      }
    };

    const openFeedback = () => {
      router.push({ path: `/sent/${sentFeedbackId.value}`, query: { showFeedbackSentMessage: true } });
    };

    return {
      submitAfterLogin,
      showSignupModal,
      submitMessage,
      openFeedback,
      isLoading,
      form,
      formErrors,
      removeFormError,
      userData,
      updateFormQuestionAnswer,
    };
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 32px;

  &__user {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__user-avatar {
    margin-right: 8px;
  }
}

.signup-modal {
  padding: 56px 8px;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  background: $grey-100;

  &__logo {
    position: absolute;
    top: 20px;
    right: 0;
    left: 0;
    margin: auto;
  }

  &__emoji {
    width: 72px;
    height: 72px;
    margin-bottom: 24px;
  }

  &__title {
    max-width: 480px;
    margin-bottom: 16px;
  }
}
</style>
