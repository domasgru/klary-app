<template>
  <div class="container--md">
    <div class="request__title base-typography--h6">
      Request feedback
    </div>
    <div class="request__form">
      <WorkspaceSelectTeamate
        label="Request feedback from?"
        class="request__input"
      />
      <BaseTextarea
        v-model="message"
        class="request__message"
        label="Message"
        hint="Specify what kind of feedback you are asking for."
        rows="4"
      />
      <BaseButton class="request__submit">
        Send request
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WorkspaceSelectTeamate from './WorkspaceSelectTeamate.vue';

export default {
  components: {
    WorkspaceSelectTeamate,
  },
  data() {
    return {
      teamate: '',
      message: 'I’m gathering professional feedback from a handful of my peers to help me learn my strengths and opportunities to improve. I’m using a new app called Matter and it should only take a few minutes.',
    };
  },
  computed: {
    ...mapState('workspace', ['team']),
    teamArray() {
      return Object.values(this.team);
    },
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.request {
  &__title {
    margin-bottom: 32px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    padding: 28px 32px;
    background: $light;
    border: $stroke;
    border-radius: 10px;
  }

  &__input {
    margin-bottom: 22px;
  }

  &__message {
    margin-bottom: 32px;
  }

  &__submit {
    margin-left: auto;
  }
}
</style>
