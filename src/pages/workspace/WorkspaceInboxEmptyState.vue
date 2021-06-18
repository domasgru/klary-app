<template>
  <div class="full-height-wrapper">
    <div class="empty-state">
      <component
        :is="`${$options.capitalize(illustration)}Illustration`"
        v-if="illustration"
        class="empty-state__illustration"
      />
      <h5
        class="empty-state__title h6"
        v-text="title"
      />
      <slot />
    </div>
  </div>
</template>

<script>
import SentIllustration from '@/components/illustrations/SentIllustration.vue';
import ReceivedIllustration from '@/components/illustrations/ReceivedIllustration.vue';
import { capitalize } from '@/utils/stringUtils';

export default {
  components: {
    SentIllustration,
    ReceivedIllustration,
  },
  props: {
    illustration: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  capitalize,
};
</script>

<style lang="scss" scoped>
.full-height-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-grow: 1;
  margin-top: -4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  max-height: 400px;
  text-align: center;

  &__illustration {
    width: 280px;
    height: 280px;
    margin-bottom: 32px;
  }

  &__title {
    margin-bottom: 16px;
  }
}
</style>
