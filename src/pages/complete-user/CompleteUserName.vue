<template>
  <div class="complete-name">
    <h5 class="complete-name__title stagger">
      Complete your profile
    </h5>
    <p class="complete-name__subtitle stagger">
      Your email <b>{{ userAuth && userAuth.email }}</b>
    </p>
    <div class="complete-name__wrapper">
      <BaseInput
        v-model="name"
        label="Your name"
        placeholder="Enter your name"
        class="complete-name__input stagger"
        :error="error"
        @input="error=''"
        @keydown.enter="setName"
      />
      <BaseCheckbox
        title="I would like to receive newsletters"
        class="complete-name__checkbox stagger"
      />
      <BaseButton
        fluid
        :disabled="$v.name.$invalid"
        class="complete-name__button stagger"
        @click="setName"
      >
        Continue
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { required, alpha } from '@vuelidate/validators';
import { updateUserProfileDocument } from '@/firebase';

export default {
  data() {
    return {
      name: '',
      error: '',
    };
  },
  validations() {
    return {
      name: {
        required,
        alpha,
      },
    };
  },
  computed: {
    ...mapState('user', ['userAuth']),
  },
  methods: {
    async setName() {
      this.$v.$touch();
      if (this.$v.name.$invalid) {
        this.error = 'This name is invalid, use only alphabet characters';
        return;
      }

      updateUserProfileDocument(this.userAuth.uid, { name: this.name });
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-name {
  text-align: center;

  &__wrapper {
    padding: 0 50px;
  }

  &__title {
    margin-bottom: 24px;
  }

  &__subtitle {
    margin-bottom: 40px;
  }

  &__input {
    margin-bottom: 18px;
  }

  &__checkbox {
    margin-bottom: 40px;
  }
}
</style>
