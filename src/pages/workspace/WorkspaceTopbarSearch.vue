<template>
  <div
    v-click-outside="{
      handler: () => showComingSoon = false,
      events: ['mousedown']
    }"
    class="search-indicator base-typography--b-14-20"
    @click="show"
  >
    <BaseSvg
      class="search-indicator__icon"
      name="search"
    />
    Search
    <div class="search-indicator__shortcut">
      ⌘+K
    </div>
    <div
      v-show="showComingSoon"
      class="search-indicator__tooltip btn2"
    >
      Coming soon 👀
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showComingSoon: false,
    };
  },
  methods: {
    show() {
      this.showComingSoon = true;
      setTimeout(() => { this.showComingSoon = false; }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-indicator {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 248px;
  padding: 10px 8px;
  color: $grey-500;
  background: transparent;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    cursor: pointer;
    background: $grey-100;
  }

  &__icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 8px;
  }

  &__shortcut {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover &__shortcut {
    opacity: 1;
  }

  &__tooltip {
    position: absolute;
    right: 0;
    bottom: -36px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 121px;
    height: 32px;
    margin: auto;
    color: $light;
    background: $grey-900;
    border-radius: 8px;
  }
}
</style>
