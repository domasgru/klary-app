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
    <div class="navigation__user">
      <BaseInitial
        class="navigation__initial"
        :name="userData.name"
      />
      <div class="navigation__user-name base-typography--button2">
        {{ userData.name }}
      </div>
      <BaseSvg
        class="navigation__expand"
        name="arrow-down"
      />
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState('user', ['userData']),
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
  }

  &__initial {
    margin-right: 12px;
  }

  &__user-name {
    margin-right: 16px;
    text-transform: capitalize;
  }

  &__expand {
    width: 8px;
    height: 4px;
  }
}
</style>
