<template>
  <div class="workspace-sidebar">
    <div class="workspace-sidebar__top">
      <!-- USER PROFILE DROPDOWN -->
      <BaseDropdown
        class="workspace-sidebar__user-wrapper"
        :is-open="showUserDropdown"
        :items="$options.userDropdownItems"
        width="256px"
        position="bottom-start"
        :offset="[0, 4]"
        @open-settings="openSettings"
        @logout="logoutAndRedirectToHomepage"
        @close="showUserDropdown = false"
      >
        <button
          class="workspace-sidebar__user base-typography--b-14-20"
          :class="{'workspace-sidebar__user--active': showUserDropdown}"
          @click="showUserDropdown = !showUserDropdown"
        >
          <BaseAvatar
            size="sm"
            :name="userData.name"
            :picture="userData.picture"
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
    </div>

    <div class="workspace-sidebar__my-forms overline">
      My forms:
    </div>
    <div class="workspace-sidebar__forms-scroll">
      <WorkspaceSidebarButton
        v-for="request in feedbackRequests"
        :key="request.id"
        :icon="request.icon || 'blank'"
        :text="request.title"
        :emoji="request.emoji"
        :to="`/form/${request.id}`"
        :is-active="isActive(request.id, $route.path)"
        :options="$options.feedbackRequestOptions"
        class="workspace-sidebar__form-button"
        @copy-link="copyFeedbackRequestLink(request)"
        @duplicate="duplicateFeedbackRequest(request)"
        @delete="deleteForm(request.id)"
        @update-emoji="updateFormEmoji(request.id, $event)"
        @update-title="updateFeedbackRequestTitle(request.id, $event)"
      />

      <div
        class="workspace-sidebar__create-form btn2"
        @click="createForm"
      >
        <BaseSvg
          class="workspace-sidebar__plus-icon"
          name="plus"
        />
        Create new form
      </div>
    </div>
    <div
      class="workspace-sidebar__create btn2"
      @click="createForm"
    >
      <BaseSvg
        class="workspace-sidebar__plus"
        name="plus"
      />
      Create new form
    </div>
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
import { nanoid } from 'nanoid';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import {
 logout, updateFeedbackRequest, createFeedbackRequest, deleteFeedbackRequest,
} from '@/firebase';
import WorkspaceAccountSettings from './WorkspaceAccountSettings.vue';
import WorkspaceSidebarButton from './WorkspaceSidebarButton.vue';

const INBOX = {
  RECEIVED: {
    icon: 'received',
    text: 'All Received',
    storeState: 'receivedFeedbacks',
    path: '/received',
  },
  SENT: {
    icon: 'sent',
    text: 'All Sent',
    storeState: 'sentFeedbacks',
    path: '/sent',
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

const feedbackRequestOptions = [
  {
    name: 'Rename', icon: 'edit', action: 'rename',
  },
  {
    name: 'Duplicate', icon: 'duplicate', action: 'duplicate',
  },
  {
    name: 'Copy form link', icon: 'link', action: 'copy-link',
  },
  {
    name: 'Delete', icon: 'trash', action: 'delete', theme: 'alarm',
  },
];

export default {
  components: {
    WorkspaceAccountSettings,
    WorkspaceSidebarButton,
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
    ...mapState('feedback', ['feedbackRequests']),
    ...mapGetters('feedback', ['receivedFeedbacks', 'sentFeedbacks']),
  },
  methods: {
    ...mapActions('feedback', ['bindFeedbackRequests']),
    isActive(path, currentRoute) {
      return currentRoute.includes(path);
    },
    getNotificationsCount({ storeState: feedbacksType }) {
      return feedbacksType
        ? this[feedbacksType]?.filter((feedback) => !isFeedbackSeen(feedback, this.userData.uid)).length
        : 0;
    },
    openSettings() {
      this.showAccountSettingsModal = true;
    },
    logoutAndRedirectToHomepage() {
      logout();
      window.location.replace(window.location.origin);
    },
    async createForm() {
      const id = nanoid(10);
      await createFeedbackRequest(id, {
        uid: this.userData.uid,
        name: this.userData.name,
        title: 'Untitled',
        message: '',
        picture: this.userData.picture || '',
      });
      this.$router.push(`/edit-form/${id}`);
    },
    deleteForm(id) {
      deleteFeedbackRequest(id);
      if (this.$router.currentRoute.value.params.id === id) {
        const requestsAfterDelete = this.feedbackRequests.filter((request) => request.id !== id);
        if (!requestsAfterDelete.length) {
          this.$router.push('/received');
        }

        this.$router.push(`/form/${requestsAfterDelete[0].id}`);
      }
    },
    updateFormEmoji(requestId, emoji) {
      updateFeedbackRequest(requestId, {
        emoji,
      });
    },
    updateFeedbackRequestTitle(requestId, title) {
      updateFeedbackRequest(requestId, {
        title,
      });
    },
    duplicateFeedbackRequest(request) {
      const { id, ...requestCopy } = request;
      createFeedbackRequest(nanoid(10), {
        ...requestCopy,
        title: `Copy of ${request.title}`,
      });
    },
    copyFeedbackRequestLink(request) {
      navigator.clipboard.writeText(`${window.origin}/f/${request.id}`);
    },
  },
  INBOX,
  userDropdownItems,
  deleteFeedbackRequest,
  feedbackRequestOptions,
};
</script>

<style lang="scss" scoped>
.workspace-sidebar {
  display: flex;
  flex-direction: column;

  &__top {
    padding: 8px;
    margin-bottom: 16px;
  }

  &__user-wrapper {
    margin-bottom: 16px;
    width: 100%;
  }

  &__user {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 4px;
    border-radius: 8px;
    transition: background 0.2s ease;

    &--active {
      background: $grey-100;
    }

    &:active {
      color: $dark;
    }

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
    //margin-bottom: 24px;
  }

  &__button {
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }

  &__forms-scroll {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 8px 20px 8px;
  }

  &__my-forms {
    margin-bottom: 8px;
    color: $grey-600;
    padding: 0 16px;
  }

  &__form-button {
    margin-bottom: 4px;
  }

  &__create-form {
    display: flex;
    padding: 6px 8px;
    align-items: center;
    color: $grey-600;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
    background: $grey-100;
  }
  }

  &__plus-icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 8px;
  }

  &__create {
    display: flex;
    align-items: center;
    padding: 22px 16px;
    color: $grey-600;
    border-top: 1px solid $grey-200;
    transition: all 0.2s ease;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }

    &:active {
      background: $grey-150;
    }
  }

  &__plus {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}
</style>
