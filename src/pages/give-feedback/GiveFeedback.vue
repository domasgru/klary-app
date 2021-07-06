<template>
  <WorkspaceFormLayout v-if="isReady">
    <template #content>
      <div
        v-if="!showSuccessMessage"
        class="cover"
        :class="{'cover--ready': showCoverCanvas}"
      >
        <img
          class="cover__image"
          :src="require('@/assets/images/form-cover-placeholder.png')"
          alt="Klary dashboard"
        >
        <div
          class="cover cover__wrapper"
        >
          <canvas
            id="canvas3d"
            class="cover__canvas"
          />
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
        <div class="success-message__title success-message__title--success h4">
          Thank you
        </div>
        <div class="success-message__message--success b1">
          Your answers will help us a lot in creating Klary. We wish you a good day.
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
import {
  ref, computed, watch, nextTick,
} from 'vue';
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
    const isReady = computed(() => !isLoading.value && request.value);

    // Form tracking
    const { trackingMark } = router.currentRoute.value.params;
    const formTestVariant = trackingMark.replace(/[0-9]/g, '');
    if (formTestVariant) {
      window.umami.trackEvent(formTestVariant, 'feedback-culture-form-variant');
    }

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

    // Canvas logic
    const showCoverCanvas = ref(false);
    watch(isReady, async (value) => {
      await nextTick();

      if (value) {
        const canvasElement = document.getElementById('canvas3d');
        const resizeObserver = new ResizeObserver(async ([entry]) => {
          const { width, height } = Array.isArray(entry.contentRect) ? entry.contentRect[0] : entry.contentRect;
          if ((height / width) > 0.9 || true) {
            console.log('wtf');
            showCoverCanvas.value = true;
          }
        });

        if (canvasElement) {
          resizeObserver.observe(canvasElement);
        }

        const app = new window.SpeRuntime.Application();
        app.start('/scene.json');
      }
    });

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

      const timeNow = getTimeNow();
      const sentFeedback = await createFeedback({
        authorId: 'notLoggedInUser',
        receiverId: request.value.uid,
        participants: {
          notLoggedInUser: {
            feedbackState: ACTIVE_STATE,
            flags: [],
            name: 'Guest',
            picture: '',
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

    const updateQuestionAnswer = ({ id, key, value }) => {
      const questionIndex = request.value.questions.findIndex((question) => question.id === id);
      set(request.value, `questions[${questionIndex}].${key || 'value'}`, value);
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
      updateQuestionAnswer,
      isReady,
      showCoverCanvas,
    };
  },
};
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
  width: 100%;
  min-height: 320px;
  padding: 27px 34px 0 34px;
  margin: 32px 0;
  background: linear-gradient(90deg, #e3d9ff 0%, #f5d9ff 98.96%);
  border: 1px solid #dcd2f8;
  border-radius: 16px;
  opacity: 0.2;
  transform: translateY(32px);
  animation: resetTransform 0.3s ease forwards;

  @media screen and (max-width: 836px) {
    min-height: auto;
    padding: 20px 12px 0 12px;
    margin: 16px 0;
  }

  .cover__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
  }

  &--ready .cover__wrapper {
    opacity: 1;
  }

  &__image,
  &__canvas {
    width: 100% !important;
    max-width: 720px;
    height: auto !important;
  }
}

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

.success-message {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
  padding: 64px 100px;
  margin: auto;
  margin-bottom: 24px;
  text-align: center;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 836px) {
    width: 90%;
    padding: 56px 32px;
  }

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
      margin-bottom: 16px;
    }

    &--success {
      max-width: 600px;
    }
  }

  &__message {
    width: 100%;
    max-width: 592px;

    &--success {
      max-width: 360px;
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

@keyframes resetTransform {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
