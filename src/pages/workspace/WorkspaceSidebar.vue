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
          <BaseIcon
            size="sm"
            name="down"
            color="grey-600"
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
      <div
        ref="sidebarButtonsSortable"
        class="workspace-sidebar__form-buttons"
      >
        <WorkspaceSidebarButton
          v-for="request in orderedFeedbackRequests"
          :key="request.id"
          :icon="request.icon || 'doc'"
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
      </div>

      <div
        class="workspace-sidebar__create-form btn2"
        @click="createForm"
      >
        <BaseIcon
          size="sm"
          color="grey-600"
          class="workspace-sidebar__plus-icon"
          name="plus"
        />
        Create new form
      </div>
    </div>
    <div class="workspace-sidebar__guide-button-container">
      <BasePopup
        :is-open="showGuidePopup"
        position="right-end"
        :offset="[0, 17]"
        padding="16px"
        width="350px"
        popup-z-index="1001"
        @close="showGuidePopup = false"
      >
        <button
          class="workspace-sidebar__guide-button btn2"
          :class="{'workspace-sidebar__guide-button--active': showGuidePopup}"
          @click="showGuidePopup = true"
        >
          How to start?
          <BaseIcon
            name="right"
            size="sm"
            color="grey-600"
          />
        </button>
        <template #content>
          <div class="workspace-sidebar__guide">
            <p class="b2s workspace-sidebar__guide-title">
              How to start?
            </p>
            <p class="b2 workspace-sidebar__guide-description">
              Quick steps to get started.
            </p>
            <p class="b2 workspace-sidebar__guide-item">
              1. Create feedabck form.
            </p>
            <p class="b2 workspace-sidebar__guide-item">
              2. Send a form link to the people you want to get feedback from.
            </p>
            <p class="b2 workspace-sidebar__guide-item">
              3. Get to know the feedback you received.
            </p>
            <p class="b2 workspace-sidebar__guide-item">
              4. Dicuss right in the feedback if something is unclear or you want to dive deeper.
            </p>
            <p class="b2 workspace-sidebar__guide-item">
              5. Create action items in your notes based on feedback. Klary's own solution coming soon.
            </p>
            <BaseButton
              type="secondary"
              href="https://klaryapp.notion.site/Klary-Guide-dfccd1ae915343df87f5a3ac55f81e71"
              target="_blank"
              v-text="'Learn more'"
            />
            <BaseIcon
              class="workspace-sidebar__guide-close"
              name="close"
              color="grey-600"
              @click="showGuidePopup = false"
            />
          </div>
        </template>
      </BasePopup>
    </div>
    <HelpAndSupportModal
      :show-modal="showHelpAndSupportModal"
      @close="showHelpAndSupportModal = false"
    >
      <div
        class="workspace-sidebar__create btn2"
        @click="showHelpAndSupportModal = true"
      >
        <BaseIcon
          size="sm"
          color="grey-600"
          class="workspace-sidebar__plus"
          name="help-circle"
        />
        Help & Support
      </div>
    </HelpAndSupportModal>
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
import Sortable from 'sortablejs';
import { mapGetters, mapState } from 'vuex';
import { isFeedbackSeen } from '@/utils/isFeedbackSeen';
import {
  logout, updateFeedbackRequest, createFeedbackRequest, deleteFeedbackRequest, setCustomUI,
} from '@/firebase';
import arrayMove from 'array-move';
import HelpAndSupportModal from '@/pages/HelpAndSupportModal.vue';
import WorkspaceAccountSettings from './WorkspaceAccountSettings.vue';
import WorkspaceSidebarButton from './WorkspaceSidebarButton.vue';

const INBOX = {
  RECEIVED: {
    icon: 'received',
    text: 'All received',
    storeState: 'receivedFeedbacks',
    path: '/received',
  },
  SENT: {
    icon: 'sent',
    text: 'All sent',
    storeState: 'sentFeedbacks',
    path: '/sent',
  },
};

const userDropdownItems = [
  {
    name: 'Account settings',
    action: 'open-settings',
    icon: 'user',
    separator: true,
  },
  {
    name: 'Sign out',
    action: 'logout',
    icon: 'sign-out',
  },
];

const feedbackRequestOptions = [
  {
    name: 'Rename', icon: 'edit', action: 'rename',
  },
  {
    name: 'Duplicate', icon: 'copy', action: 'duplicate',
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
    HelpAndSupportModal,
  },
  data() {
    return {
      showUserDropdown: false,
      showRequestModal: false,
      showHelpAndSupportModal: false,
      showAccountSettingsModal: false,
      showGuidePopup: false,
      feedbackRequestId: null,
      feedbackRequestDataLoading: false,
      feedbackRequestMessage: '',
      feedbackRequestLink: null,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('feedback', ['feedbackRequests']),
    ...mapGetters('feedback', ['receivedFeedbacks', 'sentFeedbacks', 'orderedFeedbackRequests']),
  },
  mounted() {
    try {
      const sortable = Sortable.create(this.$refs.sidebarButtonsSortable, {
        onUpdate: async ({ oldIndex, newIndex }) => {
          const updatedIdsOrder = arrayMove(this.orderedFeedbackRequests.map((request) => request.id), oldIndex, newIndex);
          setCustomUI({
            userId: this.userData.uid,
            key: 'sidebarFormsOrder',
            value: updatedIdsOrder,
          });
        },
      });
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
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
    createForm() {
      const id = nanoid(10);
      createFeedbackRequest({
        id,
        data: {
          uid: this.userData.uid,
          name: this.userData.name,
          title: 'Untitled',
          message: '',
          picture: this.userData.picture || '',
        },
      });
      window.umami.trackEvent(this.userData.email, 'create-form');
      this.$router.push(`/edit-form/${id}`);
    },
    deleteForm(id) {
      deleteFeedbackRequest(id);
      if (this.$router.currentRoute.value.params.id === id) {
        const requestsAfterDelete = this.orderedFeedbackRequests.filter((request) => request.id !== id);
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
      createFeedbackRequest({
        data: {
          ...requestCopy,
          title: `Copy of ${request.title}`,
        },
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
    width: 100%;
    margin-bottom: 16px;
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
    padding: 0 8px 20px;
    overflow-y: auto;
  }

  &__my-forms {
    padding: 0 16px;
    margin-bottom: 8px;
    color: $grey-600;
  }

  &__form-button {
    margin-bottom: 4px;
  }

  &__guide {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__guide-title {
    margin-bottom: 4px;
  }

  &__guide-description {
    margin-bottom: 16px;
    color: $grey-600;
  }

  &__guide-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 16px;
    }
  }

  &__guide-close {
    position: absolute;
    top: 16px;
    right: 16px;
    border-radius: 8px;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }
  }

  &__guide-button-container {
    width: 100%;
    padding: 16px 8px;
  }

  &__guide-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
    background: $light;
    border: 1px solid #e1e1e6;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(23, 23, 26, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    &:hover {
      background: $grey-100;
    }

    &--active {
      background: $grey-100;
    }
  }

  &__create-form {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    color: $grey-600;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background: $grey-100;
    }
  }

  &__plus-icon {
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
    margin-right: 8px;
  }
}
</style>
