<template>
  <nav class="navigation">
    <div class="navigation__container">
      <div class="navigation__logo-container">
        <div
          class="navigation__logo"
          @click="$router.push('/workspace')"
        >
          <!-- <BaseSvg
        name="logo-icon"
        class="navigation__logo-icon"
      /> -->
          <BaseSvg
            name="logo"
            class="navigation__logo-text"
          />
        </div>
      </div>

      <BasePopup bottom="-4px">
        <BaseAvatar
          class="navigation__user-initial"
          :name="userData.name"
          size="sm"
          :picture="userData.googlePicture || ''"
        />
        <template v-slot:content>
          <div class="user-popup ">
            <div class="user-popup__user-info base-typography--b-14-20">
              <BaseAvatar
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
            <div class="user-popup__item base-typography--b-14-16">
              My account
            </div>
            <div class="user-popup__item base-typography--b-14-16">
              Preferences
            </div>
            <div class="user-popup__workspace base-typography--b-14-16">
              <div class="user-popup__workspace-title">
                Workspace:
              </div>
              <div class="user-popup__workspace-info">
                <BaseAvatar
                  class="user-popup__workspace-initial"
                  :name="currentWorkspace.name"
                />
                <div class="user-popup__workspace-name">
                  {{ currentWorkspace.name }}
                </div>
                <button
                  class="user-popup__change base-typography--b-14-16"
                  @click="$router.push('/select-workspace')"
                >
                  Change
                </button>
              </div>
              <div class="user-popup__item">
                Workspace settings
              </div>
              <div class="user-popup__item">
                Members
              </div>
            </div>
            <div
              class="user-popup__item base-typography--b-14-16"
              @click="userSignout"
            >
              Sign out
            </div>
          </div>
        </template>
      </BasePopup>
    </div>
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
  width: 100%;
  border-bottom: 1px solid $grey-200;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: $container;
    padding: 8px 32px;
    margin: 0 auto;
  }

  &__logo-container {
    width: 200px;
    margin-right: 8.54%;
  }

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

  &__user-initial {
    cursor: pointer;
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
    margin-right: auto;
  }

  &__change {
    padding: 5px 0;
    color: $grey-500;
    cursor: pointer;
  }
}
</style>
