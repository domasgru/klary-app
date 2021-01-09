<template>
  <div class="account-settings">
    <h5
      class="account-settings__title h5"
      v-text="'Account settings'"
    />
    <div class="account-settings__profile">
      <div class="account-settings__profile-title caption">
        Profile photo
      </div>
      <div class="account-settings__profile-actions">
        <BaseAvatar
          size="lg"
          :name="settings.name"
          :picture="settings.picture || userData.googlePicture"
          class="account-settings__profile-photo"
        />
        <input
          id="fileElem"
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          style="display: none;"
          @change="updateProfileImage"
        >
        <BaseButton
          type="secondary"
          class="account-settings__upload-photo"
          @click="$refs.fileInput.click()"
          v-text="'Upload photo'"
        />
        <div
          class="account-settings__remove-photo btn2"
          @click="removeProfileImage"
        >
          Remove photo
        </div>
      </div>
    </div>
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
import { updateUserProfileDocument, storage } from '@/firebase';

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
    async updateProfileImage() {
      try {
        const file = this.$refs.fileInput.files[0];
        const profileImageRef = storage.ref().child(`${this.userData.uid}/images/${file.name}`);
        const uploadedFile = await profileImageRef.put(file);
        const downloadURL = await profileImageRef.getDownloadURL();
        this.settings.picture = downloadURL;
      } catch (e) {
        console.error(e);
      }
    },
    removeProfileImage() {
      this.settings.picture = '';
    },
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

  &__profile {
    margin-bottom: 16px;
  }

  &__profile-title {
    margin-bottom: 8px;
  }

  &__profile-actions {
    display: flex;
    align-items: center;
  }

  &__profile-photo {
    margin-right: 24px;
  }

  &__remove-photo {
    color: $primary;

    &:hover {
      cursor: pointer;
    }
  }

  &__upload-photo {
    margin-right: 24px;
  }

  &__name {
    margin-bottom: 16px;
  }

  &__email {
    margin-bottom: 16px;
  }

  &__save {
    margin-left: auto;
  }
}
</style>
