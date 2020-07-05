<template>
  <div class="action-dialog">
    <h5 class="actiono-dialog__title">
      {{ title }}
    </h5>
    <div class="action-dialog__subtitle">
      {{ subtitle }}
    </div>
    <BaseInput
      v-model="email"
      placeholder="Enter your email"
      label="Your email"
      class="login__input"
      :error="error"
      @input="error=''"
      @keydown.enter="submit(), showHint()"
    />
    <BaseButton
      class="login__button"
      :disabled="$v.email.$invalid"
      fluid
      @click="submit"
    />
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
//
</style>
