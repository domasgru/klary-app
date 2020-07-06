<template>
  <div class="container">
    <Header class="header" />
    <slot />
  </div>
</template>

<script>
import Header from '@/components/ui/HeaderAuth.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.header {
  margin-bottom: 8vh;
}
</style>
