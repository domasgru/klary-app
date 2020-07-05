<template>
  <div class="create-workspace">
    <h1>Choose a name for your workspace</h1>
    <BaseInput
      v-model="name"
      type="text"
      class="create-workspace__input"
    />
    <BaseButton @click="create">
      Create workspace
    </BaseButton>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { db } from '@/firebase';

export default {
  data() {
    return {
      name: '',
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  methods: {
    create() {
      if (!this.user) {
        return;
      }
      db.collection('workspaces').add({
        name: this.name,
        team: [
          this.user.uid,
        ],
      }).then((docRef) => {
        console.log('Document written with: ', docRef);
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 20px;
}

.create-workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  &__input {
    margin-bottom: 5px;
  }
}
</style>
