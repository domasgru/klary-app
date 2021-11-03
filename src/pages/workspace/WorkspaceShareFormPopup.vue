<template>
  <BasePopup
    :is-open="showShare"
    position="bottom-end"
    :offset="[0, 4]"
    width="472px"
    padding="20px"
    @close="showShare = false"
  >
    <BaseButton
      @click="showShare = true"
      v-text="'Share'"
    />
    <template #content>
      <div class="share-popup">
        <div class="share-popup__title b1s">
          <BaseIcon
            class="share-popup__link-icon"
            name="link"
          />
          Share your form
        </div>
        <div class="share-popup__description b2">
          Anyone with the link can view and fill out the form.
        </div>
        <div class="share-popup__bottom">
          <div
            class="share-popup__link"
            :title="shareLink"
          >
            {{ shareLink }}
          </div>
          <BaseButton
            class="share-popup__copy"
            @click="copyLink"
            v-text="'Copy link'"
          />
        </div>
      </div>
    </template>
  </BasePopup>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      showShare: false,
    };
  },
  computed: {
    ...mapState(['userData']),
    shareLink() {
      return `${window.origin}/f/${this.$route.params.id}`;
    },
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.shareLink);
      window.umami.trackEvent(this.userData.value.email, 'copy-form-link');
    },
  },
};
</script>

<style lang="scss" scoped>
.share-popup {
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  &__link-icon {
    margin-right: 4px;
  }

  &__description {
    margin-bottom: 16px;
    color: $grey-600;
  }

  &__bottom {
    display: flex;
    align-items: center;
  }

  &__link {
    flex-grow: 1;
    padding: 10px 12px;
    margin-right: 8px;
    font-size: 14px;
    line-height: 20px;
    background: $grey-50;
    border: 1px solid $grey-200;
    border-radius: 10px;

    @include text-overflow-ellipsis;
  }

  &__copy {
    flex-shrink: 0;
  }
}
</style>
