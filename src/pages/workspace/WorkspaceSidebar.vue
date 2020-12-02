<template>
  <div class="workspace-sidebar">
    <div class="workspace-sidebar__user base-typography--b-14-20">
      <BaseAvatar
        size="sm"
        :name="userData.name"
        :picture="userData.googlePicture || ''"
        class="workspace-sidebar__user-avatar"
      />
      {{ userData.name }}
      <BaseSvg
        name="arrow-down"
        class="workspace-sidebar__user-icon"
      />
    </div>
    <div class="workspace-sidebar__buttons">
      <WorkspaceSidebarButton
        v-for="(ITEM, ITEM_ID) in $options.INBOX"
        :key="ITEM_ID"
        :icon="ITEM.icon"
        :text="ITEM.text"
        :to="ITEM.path"
        :is-active="isActive(ITEM.path, $route.path)"
        :notifications-count="getNotificationsCount(ITEM)"
        class="workspace-sidebar__button"
      />
    </div>
    <BaseButton
      size="md"
      fluid
      to="/workspace/request-feedback"
      v-text="'Request feedback'"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import WorkspaceSidebarButton from './WorkspaceSidebarButton.vue';

const INBOX = {
  RECEIVED: {
    icon: 'received',
    text: 'Received',
    storeState: 'receivedFeedbacks',
    path: '/workspace/received',
  },
  SENT: {
    icon: 'sent',
    text: 'Sent',
    storeState: 'sentFeedbacks',
    path: '/workspace/sent',
  },
  FAVORITES: {
    icon: 'favorites',
    text: 'Favorites',
    path: '/workspace/favorites',
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
  computed: {
    ...mapState('user', ['userData']),
    ...mapGetters('feedback', ['receivedFeedbacks', 'sentFeedbacks']),
  },
  methods: {
    isActive(path, currentRoute) {
      return currentRoute.includes(path);
    },
    getNotificationsCount({ storeState: feedbacksType }) {
      return feedbacksType
      ? this[feedbacksType].filter((feedback) => !isFeedbackSeen(feedback, this.userData.uid)).length
      : 0;
    },
  },
  INBOX,
  ACTIONS,
};
</script>

<style lang="scss" scoped>
.workspace-sidebar {
  padding: 12px;

  &__user {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  &__user-icon {
    width: 24px;
    height: 24px;
    padding: 6px;
    margin-left: auto;
  }

  &__user-avatar {
    margin-right: 8px;
  }

  &__buttons {
    margin-bottom: 24px;
  }

  &__button {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
}
</style>
