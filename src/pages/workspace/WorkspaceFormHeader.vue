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
</style>
