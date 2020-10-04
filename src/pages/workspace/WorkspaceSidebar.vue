<template>
  <div class="workspace-sidebar">
    <WorkspaceSidebarButton
      v-for="(ITEM, ITEM_ID) in $options.INBOX"
      :key="ITEM_ID"
      :icon="ITEM.icon"
      :text="ITEM.text"
      :to="ITEM.path"
      :is-active="isActive(ITEM.path, $route.path)"
      class="workspace-sidebar__button"
    />
    <div class="workspace-sidebar__separator" />
    <WorkspaceSidebarButton
      v-for="(ITEM, ITEM_ID) in $options.ACTIONS"
      :key="ITEM_ID"
      :icon="ITEM.icon"
      :text="ITEM.text"
      :to="ITEM.path"
      :is-active="isActive(ITEM.path, $route.path)"
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
    path: '/workspace/received',
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
  methods: {
    isActive(path, currentRoute) {
      return currentRoute.includes(path);
    },
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

  &__separator {
    width: 100%;
    height: 1px;
    margin: 16px 0;
    background: $grey-200;
  }
}
</style>
