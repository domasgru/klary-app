<template>
  <WorkspaceFormLayout
    v-if="!isLoading && request"
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
      <!-- Success message -->
      <div
        v-if="showSuccessMessage"
        class="success-message"
      >
        <div class="success-message__illustration success-message__illustration--sent">
          <img
            class="success-message__icon"
            :src="require('@/assets/illustrations/sent.png')"
          >
        </div>
        <div class="success-message__title success-message__title--success h5">
          Your feedback has been sent
        </div>
        <div class="success-message__message--success b1">
          You can view your given feedback and discuss about it through the Kuri platform.
        </div>
        <div class="success-message__button-wrapper">
          <BaseButton
            fluid
            size="lg"
            @click="openFeedback"
            v-text="'View feedback'"
          />
        </div>
      </div>
      <!-- Feedback form -->
      <WorkspaceFeedbackForm
        v-else
        :feedback-request-data="request"
        :errors="formErrors"
        view-mode="active"
        @form-input="updateQuestionAnswer($event), removeFormError($event)"
        @submit="submitMessage"
      />
    </template>
  </WorkspaceFormLayout>
  <div
    v-if="!isLoading && !request"
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
import { getFeedbackRequestById, createFeedback, getTimeNow } from '@/firebase';
import { CREATE_ACTION } from '@/constants';
import { ACTIVE_STATE, ACTIVE_STATUS } from '@/constants/feedback';
import Signup from '@/pages/Signup.vue';
import WorkspaceFormLayout from '@/pages/workspace/WorkspaceFormLayout.vue';
import WorkspaceFeedbackForm from '@/pages/workspace/WorkspaceFeedbackForm.vue';

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
    const showSuccessMessage = ref(false);

    // INIT feedback request data
    const isLoading = ref(false);
    const { requestId } = router.currentRoute.value.params;
    const request = ref(null);

    const loadRequestData = async () => {
      try {
        isLoading.value = true;
        request.value = await getFeedbackRequestById(requestId);
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };
    loadRequestData();

    const submitMessage = async () => {
      // Check if required questions have answers
      const unansweredRequiredQuestions = request.value.questions.filter((question) => question.options.isRequired && !question.value);
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

      const timeNow = getTimeNow();
      const sentFeedback = await createFeedback({
        authorId: userData.value.uid,
        receiverId: request.value.uid,
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
          [request.value.uid]: {
            feedbackState: ACTIVE_STATE,
            flags: [],
            name: request.value.name,
            picture: request.value.picture || '',
            lastAction: {
              createdAt: null,
              type: '',
            },
            seenAt: null,
          },
        },
        title: request.value.title,
        form: JSON.parse(JSON.stringify(request.value)),
        status: ACTIVE_STATUS,
        feedbackRequestId: requestId,
      });
      sentFeedbackId.value = sentFeedback.id;
      showSuccessMessage.value = true;
    };

    const submitAfterLogin = async () => {
      try {
        await submitMessage();
        showSignupModal.value = false;
        showSuccessMessage.value = true;
      } catch (e) {
        console.error(e);
      }
    };

    const openFeedback = () => {
      router.push(`/sent/${sentFeedbackId.value}`);
    };

    const updateQuestionAnswer = ({ id, value }) => {
      const questionIndex = request.value.questions.findIndex((question) => question.id === id);
      set(request.value, `questions[${questionIndex}].value`, value);
    };

    return {
      submitAfterLogin,
      showSignupModal,
      showSuccessMessage,
      submitMessage,
      openFeedback,
      isLoading,
      request,
      formErrors,
      removeFormError,
      userData,
      updateQuestionAnswer,
    };
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  align-items: center;
  padding: 16px 32px;
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;

  &__user {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__user-avatar {
    margin-right: 8px;
  }
}

.success-message {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 728px;
  padding: 64px 64px 48px 64px;
  margin-bottom: 24px;
  text-align: center;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: $border-radius;

  &__illustration {
    position: absolute !important;
    top: -36px;
    right: 0;
    left: 0;
    margin: auto;
    border: 3px solid $light;

    &--sent {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: $grey-100;
      border-radius: 50%;
    }
  }

  &__icon {
    width: 40px;
  }

  &__title {
    max-width: 290px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &--success {
      max-width: 600px;
    }
  }

  &__message {
    width: 100%;
    max-width: 592px;

    &--success {
      max-width: 460px;
    }
  }

  &__button-wrapper {
    width: 100%;
    max-width: 208px;
    margin-top: 32px;
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
