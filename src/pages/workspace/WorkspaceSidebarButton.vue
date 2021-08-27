<template>
  <BasePopup
    :is-open="showFeedbackRequestRenamePopup"
    :position="'bottom-start'"
    :offset="[0, 4]"
    @close="showFeedbackRequestRenamePopup = false"
  >
    <router-link
      class="sidebar-button base-typography--button2"
      :to="to"
      :class="{
        'is-fluid': isFluid,
        'is-active': isActive,
        'is-selected': showOptions || showFeedbackRequestRenamePopup
      }"
      @dblclick="showFeedbackRequestRenamePopup = true"
    >
      <WorkspaceSidebarButtonIcon
        :is-active="isActive"
        :emoji="emoji"
        :icon="icon"
        :is-editable="!!options"
        @update-emoji="$emit('update-emoji', $event)"
      />
      <div
        v-if="text"
        class="sidebar-button__title"
      >
        {{ text }} {{ notificationsCount ? `(${notificationsCount})` : '' }}
      </div>
      <BaseDropdown
        v-if="options"
        class="sidebar-button__options"
        :items="options"
        :is-open="showOptions"
        position="bottom-start"
        :offset="[0, 10]"
        @close="showOptions = false"
        @rename="showFeedbackRequestRenamePopup = true"
        @duplicate="$emit('duplicate')"
        @copy-link="$emit('copy-link')"
        @delete="$emit('delete')"
        @click.stop.prevent
      >
        <BaseIcon
          size="sm"
          name="more"
          :color="isActive ? 'primary' : 'dark'"
          @click="handleOptionsClick"
        />
      </BaseDropdown>
      <slot />
    </router-link>
    <template #content>
      <div class="settings">
        <WorkspaceSidebarButtonIcon
          :is-active="isActive"
          :emoji="emoji"
          :icon="icon"
          :is-editable="!!options"
          emoji-select-theme
          @update-emoji="$emit('update-emoji', $event)"
        />
        <BaseInput
          class="settings__title"
          autofocus
          :model-value="text"
          @input="$emit('update-title', $event.target.value)"
        />
      </div>
    </template>
  </BasePopup>
</template>

<script>
import WorkspaceSidebarButtonIcon from './WorkspaceSidebarButtonIcon.vue';

export default {
  components: {
    WorkspaceSidebarButtonIcon,
  },
  props: {
    to: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    emoji: {
      type: String,
      default: '',
    },
    isFluid: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    notificationsCount: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array,
      default: null,
    },
  },
  emits: ['delete', 'update-emoji', 'rename', 'close', 'update-title', 'duplicate', 'copy-link'],
  data() {
    return {
      showOptions: false,
      showFeedbackRequestRenamePopup: false,
    };
  },
  methods: {
    handleOptionsClick() {
      if (this.showFeedbackRequestRenamePopup) {
        this.showFeedbackRequestRenamePopup = false;
        return;
      }

      this.showOptions = !this.showOptions;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-button {
  $this: &;

  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 8px;
  color: $dark;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: $grey-100;
  }

  &.is-selected {
    background: $grey-100;
  }

  &.is-active {
    color: $primary-100;
    background: rgba($primary, 0.1);
  }

  &--is-fluid {
    width: 100%;
  }

  &__title {
    max-width: 152px;

    @include text-overflow-ellipsis;
  }

  &__options {
    position: absolute;
    top: 6px;
    right: 8px;
    border-radius: 4px;
    opacity: 0;

    #{$this}:hover &, #{$this}.is-selected & {
      opacity: 1;
    }

    &:hover {
      background: $grey-200;
      opacity: 1;
    }

    #{$this}.is-active &:hover {
      background: $primary-light-20;
    }

    #{$this}.is-selected & {
      background: $grey-200;
    }

    #{$this}.is-selected.is-active & {
      background: $primary-light-20;
    }
  }
}

.settings {
  display: flex;
  align-items: center;
  width: 360px;
  padding: 4px;

  &__icon {
    width: 16px;
    height: 16px;
    fill: none;
  }
}
</style>
