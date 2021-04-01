<template>
  <div class="header">
    <template v-if="viewMode === 'edit'">
      <button
        class="header__back-button"
        @click="$router.push(`/form/${$route.params.id}`)"
      >
        <BaseSvg
          class="header__back-icon"
          name="back"
        />
      </button>

      <p
        class="header__title btn2"
        v-text="title || 'Untitled'"
      />
      <BaseButton
        class="header__preview"
        type="secondary"
        @click="$router.push(`/preview-form/${$route.params.id}`)"
        v-text="'Preview'"
      />
      <BasePopup
        :is-open="showShare"
        position="bottom-end"
        :offset="[0, 4]"
        width="472px"
        @close="showShare = false"
      >
        <BaseButton
          class="header__share"
          @click="showShare = true"
          v-text="'Share'"
        />
        <template #content>
          <div class="share-popup">
            <div class="share-popup__title b1s">
              <BaseSvg
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
    <template v-else-if="viewMode === 'active'">
      <p class="btn2 header__preview-mode-text">
        Preview mode
      </p>
      <BaseButton
        class="header__back-to-editor"
        type="secondary"
        @click="$router.push(`/edit-form/${$route.params.id}`)"
        v-text="'Back to editor'"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    viewMode: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showShare: false,
    };
  },
  computed: {
    shareLink() {
      return `${window.origin}/f/${this.$route.params.id}`;
    },
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.shareLink);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  padding: 8px;
  background: $light;
  border-bottom: $stroke;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  &__back-button {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background: $grey-100;
      transition: 0.2s ease;
    }
  }

  &__back-icon {
    width: 24px;
    height: 24px;
    padding: 2px;
  }

  &__title {
    margin-right: auto;
  }

  &__preview {
    margin-right: 8px;
  }

  &__preview-mode-text {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
  &__back-to-editor {
    margin-left: auto;
    cursor: pointer;
    z-index: 1;
  }
}
.share-popup {
  padding: 20px;

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  &__link-icon {
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-right: 4px;
  }

  &__description {
    color: $grey-600;
    margin-bottom: 16px;
  }

  &__bottom {
    display: flex;
    align-items: center;
  }

  &__link {
    padding: 10px 12px;
    flex-grow: 1;
    background: $grey-50;
    border-radius: 10px;
    border: 1px solid $grey-200;
    margin-right: 8px;
    font-size: 14px;
    line-height: 20px;
    @include text-overflow-ellipsis;
  }

  &__copy {
    flex-shrink: 0;
  }
}
</style>
