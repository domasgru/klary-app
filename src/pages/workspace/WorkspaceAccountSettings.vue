<template>
  <div class="account-settings">
    <h5
      class="account-settings__title h5"
      v-text="'Account settings'"
    />
    <BaseInput
      v-model="settings.name"
      :error="settingsErrors.name"
      label="Your full name"
      class="account-settings__name"
      @input="settingsErrors.name = ''"
    />
    <BaseInput
      v-model="email"
      label="Email"
      class="account-settings__email"
      hint="You can't change your email."
      is-disabled
    />
    <BaseButton
      class="account-settings__save"
      :disabled="saved"
      @click="save"
      v-text="'Save'"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { updateUserProfileDocument } from '@/firebase';

export default {
  data() {
    return {
      hasInitialized: false,
      stringifiedSettingsBeforeEdit: null,
      settings: {
        picture: null,
        name: null,
      },
      settingsErrors: {
        name: null,
      },
      email: null,
      saved: true,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  watch: {
    settings: {
      deep: true,
      immediate: false,
      handler(newValue) {
        if (!this.hasInitialized) {
          return;
        }

        if (JSON.stringify(newValue) !== this.stringifiedSettingsBeforeEdit) {
          this.saved = false;
        } else {
          this.saved = true;
        }
      },
    },
  },
  created() {
    this.settings.picture = this.userData.picture;
    this.settings.name = this.userData.name;
    this.email = this.userData.email;
    this.stringifiedSettingsBeforeEdit = JSON.stringify(this.settings);
    this.hasInitialized = true;
  },
  methods: {
    async save() {
      if (!this.settings.name) {
        this.settingsErrors.name = "Full name can't be empty";
        return;
      }

      try {
        await updateUserProfileDocument(this.userData.uid, {
          name: this.settings.name,
          picture: this.settings.picture || '',
        });
        this.stringifiedSettingsBeforeEdit = JSON.stringify(this.settings);
        this.saved = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.account-settings {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }

  &__name {
    margin-bottom: 8px;
  }

  &__email {
    margin-bottom: 8px;
  }

  &__save {
    margin-left: auto;
  }
}
</style>
