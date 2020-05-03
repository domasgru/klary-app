<template>
  <div class="select-flow">
    <div class="select-flow__create">
      Create workspace
      <BaseButton @click="$router.push('/get-started/create')">
        Create
      </BaseButton>
    </div>
    <div class="select-flow__join">
      Join workspace
      <BaseButton @click="$router.push('/get-started/join')">
        Join
      </BaseButton>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>

</style>
