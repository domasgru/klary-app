<template>
  <div
    v-if="showGuide"
    class="guide"
  >
    <BasePopup
      is-open
      position="bottom"
      width="366px"
      padding="16px"
      :offset="[0, 8]"
    >
      <div class="guide__pulsing-marker" />
      <template #content>
        <div class="guide__popup">
          <p class="guide__text b2">
            Hey there 👋, to help you better understand how Klary works,
            here’s an example of actual feedback between co-founders of Klary.
          </p>
          <p class="guide__text b2">
            Take a look at the new way to share feedback 🚀
          </p>
          <BaseButton
            @click="hideGuide"
            v-text="'Got it'"
          />
        </div>
      </template>
    </BasePopup>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const HIDE_GUIDE_KEY = 'hideExampleFeedbackGuide';

export default {
  data() {
    return {
      showGuide: false,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    localStorageHideGuideKey: ({ userData }) => `HIDE_GUIDE_KEY-${userData.uid}`,
  },
  created() {
    this.handleShowGuide();
  },
  methods: {
    handleShowGuide() {
      const hideGuide = !!localStorage.getItem(this.localStorageHideGuideKey);

      if (!hideGuide) {
        this.showGuide = true;
      }
    },
    hideGuide() {
      localStorage.setItem(this.localStorageHideGuideKey, 'true');
      this.showGuide = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.guide {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__pulsing-marker {
    width: 16px;
    height: 16px;
    margin: 8px;
    background: rgba(81, 31, 220, 1);
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(81, 31, 220, 1);
    transform: scale(1);
    animation: pulse-purple 2s infinite;
  }

  &__popup {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    background: $light;
  }

  &__text {
    margin-bottom: 16px;
  }
}

@keyframes pulse-purple {
  0% {
    box-shadow: 0 0 0 0 rgba(81, 31, 220, 0.7);
    transform: scale(0.95);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(81, 31, 220, 0);
    transform: scale(1);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(81, 31, 220, 0);
    transform: scale(0.95);
  }
}
</style>
