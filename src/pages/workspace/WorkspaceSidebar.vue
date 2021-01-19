<template>
  <div class="workspace-sidebar">
    <BaseDropdown
      v-click-outside="{
        handler: () => showUserDropdown = false,
        events: ['mousedown']
      }"
      class="workspace-sidebar__user-wrapper"
      :is-open="showUserDropdown"
      :items="$options.userDropdownItems"
      side="left"
      margin-top="-12"
      width="256px"
      position="bottom-right"
      @open-settings="openSettings"
      @logout="logoutAndRedirectToHomepage"
    >
      <button
        class="workspace-sidebar__user base-typography--b-14-20"
        @click="showUserDropdown = !showUserDropdown"
      >
        <BaseAvatar
          size="sm"
          :name="userData.name"
          :picture="userData.picture || userData.googlePicture || ''"
          class="workspace-sidebar__user-avatar"
        />
        {{ userData.name }}
        <BaseSvg
          name="arrow-down"
          class="workspace-sidebar__user-icon"
        />
      </button>
    </BaseDropdown>
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
    <WorkspaceRequestFeedbackUI>
      <BaseButton
        size="md"
        fluid
        v-text="'Request feedback'"
      />
    </WorkspaceRequestFeedbackUI>

    <BaseModal
      :show-modal="showAccountSettingsModal"
      max-width="600px"
      @close="showAccountSettingsModal = false"
    >
      <template #content>
        <WorkspaceAccountSettings />
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import {
 logout, createFeedbackRequest, getFeedbackRequest, updateFeedbackRequest,
} from '@/firebase';
import WorkspaceSidebarButton from './WorkspaceSidebarButton.vue';
import WorkspaceAccountSettings from './WorkspaceAccountSettings.vue';
import WorkspaceRequestFeedbackUI from './WorkspaceRequestFeedbackUI.vue';

const INBOX = {
  RECEIVED: {
    icon: 'received',
    text: 'Received',
    storeState: 'receivedFeedbacks',
    path: '/received',
  },
  SENT: {
    icon: 'sent',
    text: 'Sent',
    storeState: 'sentFeedbacks',
    path: '/sent',
  },
  FAVORITES: {
    icon: 'favorites',
    text: 'Favorites',
    path: '/favorites',
  },
  HIGHLIGHTS: {
    icon: 'highlights',
    text: 'Highlights',
    path: '/highlights',
  },
  TRASH: {
    icon: 'trash',
    text: 'Trash',
    path: '/trash',
  },
};

const userDropdownItems = [
  {
    name: 'Account settings',
    action: 'open-settings',
    icon: 'profile',
    separator: true,
  },
  {
    name: 'Sign out',
    action: 'logout',
    icon: 'logout',
  },
];

export default {
  components: {
    WorkspaceSidebarButton,
    WorkspaceRequestFeedbackUI,
    WorkspaceAccountSettings,
  },
  data() {
    return {
      showUserDropdown: false,
      showRequestModal: false,
      showAccountSettingsModal: false,
      feedbackRequestId: null,
      feedbackRequestDataLoading: false,
      feedbackRequestMessage: '',
      feedbackRequestLink: null,
    };
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
    openSettings() {
      this.showAccountSettingsModal = true;
    },
    logoutAndRedirectToHomepage() {
      logout();
      window.location.replace(window.location.origin);
    },
  },
  INBOX,
  userDropdownItems,
};
</script>

<style lang="scss" scoped>
.workspace-sidebar {
  padding: 8px 12px;

  &__user-wrapper {
    margin-bottom: 16px;
  }

  &__user {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 4px;
    border-radius: 8px;
    transition: background 0.2s ease;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }
  }

  &__user-icon {
    width: 24px;
    height: 24px;
    padding: 6px;
    margin-left: auto;
  }

  &__user-avatar {
    margin-right: 8px;
    cursor: pointer;
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
