<template>
  <div class="empty-state">
    <BaseSvg
      class="empty-state__illustration"
      :name="illustrationName"
    />
    <h5
      class="empty-state__title"
      v-text="title"
    />
    <p
      class="empty-state__description base-typography--b-14-20"
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
     default: 'man-type',
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
  }
}
</style>
