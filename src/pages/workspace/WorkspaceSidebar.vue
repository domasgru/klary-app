<template>
  <div class="workspace-sidebar">
    <WorkspaceSidebarButton
      v-for="(ITEM, ITEM_ID) in $options.INBOX"
      :key="ITEM_ID"
      :icon="ITEM.icon"
      :text="ITEM.text"
      :to="ITEM.path"
      :is-active="ITEM.path === $route.path"
      class="workspace-sidebar__button"
    />
  </div>
</template>

<script>
import WorkspaceSidebarButton from './WorkspaceSidebarButton.vue';

const INBOX = {
  RECEIVED: {
    icon: 'received',
    text: 'Received',
    path: '/workspace',
  },
  SENT: {
    icon: 'sent',
    text: 'Sent',
    path: '/workspace/sent',
  },
  FAVORITES: {
    icon: 'favorites',
    text: 'Favorites',
    path: '/workspace/favorite',
  },
  HIGHLIGHTS: {
    icon: 'highlights',
    text: 'Highlights',
    path: '/workspace/highlights',
  },
  ARCHIVE: {
    icon: 'archive',
    text: 'Archive',
    path: '/workspace/archived',
  },
};

const ACTIONS = {
  GIVE: {
    icon: 'give',
    text: 'Give feedback',
    path: '/workspace/give-feedback',
  },
  REQUEST: {
    icon: 'request',
    text: 'Request feedback',
    path: '/workspace/request-feedback',
  },
};

export default {
  components: {
    WorkspaceSidebarButton,
  },
  INBOX,
  ACTIONS,
};
</script>

<style lang="scss" scoped>
.workspace-sidebar {
  &__button {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
}
</style>
