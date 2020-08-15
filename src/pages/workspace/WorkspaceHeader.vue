<template>
  <nav class="navigation">
    <div class="navigation__logo">
      <BaseSvg
        name="logo-icon"
        class="navigation__logo-icon"
      />
      <BaseSvg
        name="logo"
        class="navigation__logo-text"
      />
    </div>
    <ul class="navigation__items base-typography--button2">
      <BaseLink
        theme="navigation"
        class="navigation__item"
        to="/workspace"
      >
        Inbox
      </BaseLink>
      <BaseLink
        theme="navigation"
        class="navigation__item"
        to="/workspace/request-feedback"
      >
        Request feedback
      </BaseLink>
      <BaseLink
        theme="navigation"
        class="navigation__item"
        to="/workspace/give-feedback"
      >
        Give feedback
      </BaseLink>
    </ul>

    <BasePopup bottom="-4px">
      <div
        class="navigation__user"
      >
        <BaseInitial
          class="navigation__workspace-initial"
          :name="currentWorkspace.name"
        />
        <div class="navigation__workspace-name base-typography--button2">
          {{ currentWorkspace.name }}
        </div>
        <BaseInitial
          class="navigation__user-initial"
          :name="userData.name"
        />
      </div>
      <template v-slot:content>
        <div class="user-popup base-typography--b-14-16">
          <div class="user-popup__user-info">
            <BaseInitial
              class="user-popup__initial"
              :name="userData.name"
            />
            <div class="user-popup__name-email">
              <div class="user-popup__name">
                {{ userData.name }}
              </div>
              <div class="user-popup__email">
                {{ userData.email }}
              </div>
            </div>
          </div>
          <div class="user-popup__item">
            My account
          </div>
          <div class="user-popup__item">
            Preferences
          </div>
          <div class="user-popup__workspace">
            <div class="user-popup__workspace-title">
              Workspace:
            </div>
            <div class="user-popup__workspace-info">
              <BaseInitial
                class="user-popup__workspace-initial"
                :name="currentWorkspace.name"
              />
              <div class="user-popup__workspace-name">
                {{ currentWorkspace.name }}
              </div>
            </div>
            <div class="user-popup__item">
              Workspace settings
            </div>
            <div class="user-popup__item">
              Members
            </div>
          </div>
          <div
            class="user-popup__item"
            @click="userSignout"
          >
            Sign out
          </div>
        </div>
      </template>
    </BasePopup>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import { logout } from '@/firebase';

export default {
  computed: {
    ...mapState('user', ['userData']),
    ...mapState('workspace', ['currentWorkspace']),
  },
  methods: {
    userSignout() {
      logout();
      window.location.replace(window.location.origin);
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 32px;

  &__logo {
    display: flex;
    align-items: center;
    margin-right: 32px;
    cursor: pointer;
  }

  &__logo-icon {
    width: 19px;
    height: 24px;
    margin-right: 10px;
  }

  &__logo-text {
    width: 36px;
    height: 26px;
  }

  &__items {
    display: flex;
    margin-right: auto;
  }

  &__item {
    list-style: none;

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  &__user {
    display: flex;
    align-items: center;
    padding: 6px;
    border: $stroke;
    border-radius: 24px;
  }

  &__workspace-initial {
    width: 28px !important;
    height: 28px !important;
    margin-right: 8px;
    font-size: 14px !important;
  }

  &__user-initial {
    width: 36px !important;
    height: 36px !important;
  }

  &__workspace-name {
    margin-right: 16px;
  }

  &__expand {
    width: 8px;
    height: 4px;
  }
}

.user-popup {
  width: 300px;
  padding-bottom: 12px;
  box-shadow: 0 2px 4px rgba(23, 23, 26, 0.08);

  &__user-info {
    display: flex;
    align-items: center;
    padding: 16px 20px;
  }

  &__initial {
    margin-right: 12px;
  }

  &__name-email{

  }

  &__name {

  }

  &__email {
    color: $grey-500;
  }

  &__item {
    padding: 8px 20px;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }
  }

  &__workspace {
    padding: 12px 0;
    margin: 12px 0;
    background: $grey-50;
    border-top: $stroke;
    border-bottom: $stroke;
  }

  &__workspace-title {
    padding: 0 20px;
    margin-bottom: 12px;
    font-size: 12px;
    color: $grey-500;
    text-transform: uppercase;
  }

  &__workspace-info {
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 8px;
  }

  &__workspace-initial {
    margin-right: 12px;
  }

  &__workspace-name {

  }
}
</style>
