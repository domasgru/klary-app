<template>
  <div class="header">
    <template v-if="viewMode === 'edit'">
      <button
        class="header__back-button"
        @click="$router.push(`/form/${$route.params.id}`)"
      >
        <BaseIcon
          color="grey-600"
          class="header__back-icon"
          name="left"
        />
      </button>

      <p
        contenteditable="true"
        class="header__title btn2"
        @keydown.enter.prevent
        @blur="updateFeedbackTitle($event.target.textContent)"
        v-text="title || 'Untitled'"
      />
      <BaseButton
        class="header__preview"
        type="secondary"
        @click="$router.push(`/preview-form/${$route.params.id}`)"
        v-text="'Preview'"
      />
      <WorkspaceShareFormPopup class="header__share" />
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
import { updateFeedbackRequest } from '@/firebase';
import WorkspaceShareFormPopup from './WorkspaceShareFormPopup.vue';

export default {
  components: {
    WorkspaceShareFormPopup,
  },
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
  methods: {
    updateFeedbackTitle(title) {
      updateFeedbackRequest(this.$route.params.id, {
        title,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  background: $light;
  border-bottom: $stroke;

  &__back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background: $grey-100;
      transition: 0.2s ease;
    }
  }

  &__title {
    padding: 10px 12px;
    margin-right: auto;
    border-radius: 8px;
    outline: none;

    &:focus-within {
      background: $grey-100;
    }

    &:hover {
      background: $grey-100;
    }
  }

  &__preview {
    margin-right: 8px;
  }

  &__preview-mode-text {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    text-align: center;
  }

  &__back-to-editor {
    z-index: 1;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
