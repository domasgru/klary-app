<template>
  <div
    v-if="step === 'welcome'"
    class="welcome-content"
  >
    <div class="h4 title">
      Welcome to Klary
    </div>
    <div class="b1 subtitle">
      Use your Google account to sign up or log in.
    </div>
    <button
      class="button-google btn1s"
      @click="loginGoogle"
    >
      <BaseSvg
        class="google-icon"
        name="google-logo"
      />
      Continue with Google
    </button>
    <div class="terms b2">
      By continuing, you agree to our
      <BaseButton is-inline>
        Terms of Service
      </BaseButton>
      and
      <BaseButton is-inline>
        Privacy Policy
      </BaseButton>.
    </div>
  </div>
  <div
    v-else-if="step === 'name'"
    class="name-content"
  >
    <div class="h4 name-content__title">
      Enter your full name
    </div>
    <BaseInput
      v-model="fullName"
      label="Your full name"
      placeholder="Name Username"
      class="name-content__input"
      size="lg"
      autofocus
    />
    <BaseButton
      size="lg"
      is-fluid
      @click="finishSignup"
      v-text="completionText"
    />
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { nanoid } from 'nanoid';
import {
  loginWithGoogle, createUserProfileDocument, createFeedbackRequest, createFeedback, getTime, addAction,
} from '@/firebase';
import { handleLoginAndReturnRedirect } from '@/utils/handleLogin';
import { mapActions, mapState } from 'vuex';
import { getExampleFormData, exampleFeedbackDiscussion } from '@/utils/getExampleFormData';

export default {
  props: {
    completionText: {
      type: String,
      default: 'Finish sign up',
    },
  },
  emits: ['success', 'error'],
  data() {
    return {
      step: 'welcome',
      fullName: '',
    };
  },
  computed: {
    ...mapState('user', ['userAuth', 'userData']),
  },
  methods: {
    ...mapActions('user', ['setUserAuth', 'bindUser']),
    async loginGoogle() {
      try {
        const { user, additionalUserInfo } = await loginWithGoogle();
        this.setUserAuth({ email: user.email, uid: user.uid, additionalUserInfo });
        await this.bindUser(user.uid);

        if (additionalUserInfo.isNewUser || !this.userData) {
          const { name, given_name } = additionalUserInfo.profile;
          this.fullName = name || given_name || '';
          this.step = 'name';
          return;
        }

        this.$emit('success');
      } catch (e) {
        this.$emit('error');
        console.error(e);
      }
    },
    async finishSignup() {
      const picture = this.userAuth.additionalUserInfo.profile?.picture
        ? { picture: this.userAuth.additionalUserInfo.profile?.picture } : {};
      await createUserProfileDocument(this.userAuth, {
        ...picture,
        name: this.fullName,
        status: 'NEW',
      });
      await this.addGettingStartedData();
      this.$emit('success');
    },
    async addGettingStartedData() {
      const formId = nanoid(10);

      try {
        const [feedbackRequest, exampleFeedback] = await Promise.all([
          createFeedbackRequest(
            formId,
            getExampleFormData(this.userData.uid, this.userData.name, this.userData.picture),
          ),
          createFeedback({
            authorId: 'author',
            receiverId: this.userData.uid,
            participants: {
              author: {
                feedbackState: 'ACTIVE',
                flags: [],
                lastAction: {
                  createdAt: getTime(2021, 6, 21, 16, 20),
                  type: 'CREATE',
                },
                picture: 'https://firebasestorage.googleapis.com/v0/b/feedback-2263b.appspot.com/o/9Ofe3K6QuMS48m8kUlKMLZkypcw1%2Fimages%2FprofileImage.png?alt=media&token=b076fbb3-9b19-445e-b67e-23b1991f7f5d',
                name: 'Dominykas Grubys',
                seenAt: getTime(2021, 6, 21, 16, 20),
              },
              receiver: {
                feedbackState: 'ACTIVE',
                flags: [],
                lastAction: {
                  createdAt: getTime(2021, 6, 21, 16, 21),
                  type: '',
                },
                picture: 'https://lh3.googleusercontent.com/a-/AOh14GjElxDOkr2xBF19YlRDZcz67WUeFE9VW1Nc7A_-hQ=s96-c',
                name: 'Justinas Guliokas',
                seenAt: getTime(2021, 6, 21, 16, 21),
              },
              [this.userData.uid]: {
                feedbackState: 'ACTIVE',
                flags: [],
                lastAction: {
                  createdAt: null,
                  type: '',
                },
                picture: this.userData.picture,
                name: this.userData.name,
                seenAt: null,
              },
              klaryTeam: {
                picture: 'https://lh3.googleusercontent.com/a-/AOh14GiDUPrjN4nc_05UHRztl40JwwVENn3JFgJi7YEw=s96-c',
                name: 'Klary Team',
                lastAction: {
                  createdAt: null,
                  type: '',
                },
                seenAt: null,
              },
            },
            feedbackRequestId: formId,
            status: 'CLOSED',
            title: 'Feedback example',
            form: getExampleFormData('receiver', 'Justinas Guliokas', 'https://lh3.googleusercontent.com/a-/AOh14GjElxDOkr2xBF19YlRDZcz67WUeFE9VW1Nc7A_-hQ=s96-c', true),
            exampleAuthorId: 'klaryTeam',
          }),
        ]);

        await Promise.all([
          exampleFeedbackDiscussion.map(({
            type, content, replies, authorUid, createdAt,
          }) => addAction({
            feedbackId: exampleFeedback.id,
            type,
            content,
            replies,
            authorUid,
            createdAt,
          })),
        ]);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.google-icon {
  width: 24px;
  height: 24px;
  padding: 2px;
  margin-right: 8px;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  margin-bottom: 16px;
}

.subtitle {
  margin-bottom: 40px;
}

.button-google {
  display: flex;
  align-items: center;
  padding: 11px 98px;
  margin-bottom: 40px;
  cursor: pointer;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
  transition: 0.2s ease;

  &:hover {
    background: $grey-100;
  }

  &:active {
    background: $grey-150;
  }
}

.terms {
  max-width: 244px;
}

.name-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 384px;
  margin: auto;
  text-align: center;

  &__title {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 40px;
  }
}
</style>
