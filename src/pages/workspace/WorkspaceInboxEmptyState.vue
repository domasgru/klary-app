<template>
  <div class="empty-state">
    <BaseSvg
      v-if="illustrationName"
      class="empty-state__illustration"
      :name="illustrationName"
    />
    <h5
      class="empty-state__title h5"
      v-text="title"
    />
    <p
      class="empty-state__description b2"
      v-text="description"
    />
    <slot />
  </div>
</template>

<script>
export default {
 props: {
   illustrationName: {
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
   cta: {
     type: Object,
     default: null,
   },
 },
};
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  &__illustration {
    width: 266px;
    height: 210px;
    margin-bottom: 32px;
  }

  &__title {
    margin-bottom: 16px;
  }

  &__description {
    margin-bottom: 32px;
    color: $grey-600;
  }
}
</style>
