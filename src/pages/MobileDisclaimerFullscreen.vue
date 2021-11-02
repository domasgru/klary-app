<template>
  <div class="mobile-disclaimer">
    <BaseSvg
      class="mobile-disclaimer__logo"
      name="klaryLogo"
    />
    <div class="mobile-disclaimer__message">
      <BaseSvg
        class="mobile-disclaimer__icon"
        name="mobile-disclaimer"
      />
      <h4 class="h4 mb-16">
        Mobile experience is on the way
      </h4>
      <p class="b1">
        For now, please use the desktop device. 🙏
      </p>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>

.mobile-disclaimer {
  position: relative;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: white;

  &__logo {
    position: absolute;
    top: 24px;
    right: 0;
    left: 0;
    width: 106px;
    height: 40px;
    margin: auto;
  }

  &__icon {
    width: 56px;
    height: 93px;
    margin-bottom: 24px;
  }

  &__message {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 350px;
    text-align: center;
  }

  @media screen and (max-width: 950px) {
    display: flex;
  }
}

</style>
