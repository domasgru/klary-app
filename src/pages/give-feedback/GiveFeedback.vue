<template>
  <div
    v-if="!isLoading && request"
    class="give-feedback"
  >
    <div class="give-feedback__gradient">
      <div class="give-feedback__navigation">
        <BaseSvg
          class="give-feedback__logo"
          name="logo"
        />
        <div
          v-if="userData"
          class="give-feedback__user b2s"
        >
          <BaseAvatar
            class="give-feedback__user-avatar"
            size="sm"
            :name="userData.name"
            :picture="userData.picture || userData.googlePicture"
          />
          {{ userData.name }}
        </div>
      </div>
    </div>
    <div
      v-if="request"
      class="give-feedback__content"
    >
      <!-- Success message -->
      <div
        v-if="showSuccessMessage"
        class="give-feedback__background"
      >
        <div class="give-feedback__avatar give-feedback__avatar--sent">
          <BaseSvg
            class="give-feedback__icon"
            name="paper-plain"
          />
        </div>
        <div class="give-feedback__title give-feedback__title--success h5">
          Your feedback for {{ request.name }} has been sent
        </div>
        <div class="give-feedback__message--success b1">
          You can view your given feedback and discuss about it through the Kuri platform.
        </div>
        <div class="give-feedback__button-wrapper">
          <BaseButton
            fluid
            size="lg"
            @click="openFeedback"
            v-text="'View feedback'"
          />
        </div>
      </div>
      <!-- Feedback request message -->
      <template v-else>
        <div class="give-feedback__background">
          <BaseAvatar
            class="give-feedback__avatar"
            size="lg"
            :name="request.name"
            :picture="request.picture || request.googlePicture"
          />

          <div class="give-feedback__title h5">
            Give feedback for {{ request.name }}
          </div>
          <div
            v-if="request.message"
            class="give-feedback__message b1"
          >
            {{ request.message }}
          </div>
        </div>
        <BaseTextarea
          v-model="message"
          class="give-feedback__message"
          padding="16px 24px"
          rows="9"
          placeholder="Write feedback..."
          has-submit
          autofocus
          submit-button-text="Send"
          :allow-shortcut-submit="false"
          @submit="submitMessage"
        />
      </template>
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
  </div>
  <div
    v-if="!isLoading && !request"
    class="error"
  >
    <BaseSvg
      class="error__logo"
      name="logo"
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
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getFeedbackRequestById, createFeedback, getTimeNow } from '@/firebase';
import { CREATE_ACTION } from '@/constants';
import { ACTIVE_STATE, ACTIVE_STATUS } from '@/constants/feedback';
import Signup from '@/pages/Signup.vue';

export default {
  components: {
    Signup,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const message = ref('');
    const request = ref(null);
    const { requestId } = router.currentRoute.value.params;
    const userData = computed(() => store.state.user.userData);

    const sentFeedbackId = ref(null);

    const showSignupModal = ref(false);
    const showSuccessMessage = ref(false);

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
            googlePicture: userData.value.googlePicture || '',
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
            googlePicture: request.value.googlePicture || '',
            lastAction: {
              createdAt: null,
              type: '',
            },
            seenAt: null,
          },
        },
        title: 'Personal feedback',
        content: message.value.replace(/^\s+|\s+$/g, ''),
        status: ACTIVE_STATUS,
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
      router.push(`/workspace/sent/${sentFeedbackId.value}`);
    };

    return {
      submitAfterLogin,
      showSignupModal,
      showSuccessMessage,
      submitMessage,
      openFeedback,
      isLoading,
      message,
      request,
      userData,
    };
  },
};
</script>

<style lang="scss" scoped>
.give-feedback {
  min-height: 100%;
  padding-bottom: 64px;
  background: $grey-100;

  &__gradient {
    height: 240px;
    background: linear-gradient(267.05deg, #8ec5fc 0%, #e0c3fc 100%);
  }

  &__navigation {
    display: flex;
    align-items: center;
    padding: 16px 32px;
  }

  &__logo {
    width: 44px;
    height: 24px;
    margin-right: auto;
  }

  &__nav-items {
    display: flex;
  }

  &__user {
    display: flex;
    align-items: center;
  }

  &__user-avatar {
    margin-right: 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__background {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 592px;
    padding: 60px 40px 32px 40px;
    margin-top: -125px;
    margin-bottom: 24px;
    text-align: center;
    background: $light;
    border: 1px solid $grey-200;
    border-radius: $border-radius;
  }

  &__avatar {
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
      background: #ede8fa;
      border-radius: 50%;
    }
  }

  &__button-wrapper {
    width: 100%;
    max-width: 384px;
    margin-top: 32px;
  }

  &__icon {
    width: 32px;
    height: 32px;
  }

  &__title {
    max-width: 290px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &--success {
      max-width: 464px;
    }
  }

  &__message {
    width: 100%;
    max-width: 592px;

    &--success {
      max-width: 464px;
    }
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
    width: 44px;
    height: 24px;
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
