<template>
  <div class="full-height-wrapper">
    <div class="empty-state">
      <BaseSvg
        v-if="illustration"
        class="empty-state__illustration"
        :name="illustration"
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
export default {
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
};
</script>

<style lang="scss" scoped>
.full-height-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: -56px;
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
