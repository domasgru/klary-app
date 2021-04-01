<template>
  <BasePopup
    position="bottom"
    width="360px"
    :offset="[0, 4]"
    :is-open="showAddQuestion"
    @close="showAddQuestion = false"
  >
    <BaseButton
      type="secondary"
      class="add-question-button"
      @click="showAddQuestion = !showAddQuestion"
      v-text="'+ Add new question'"
    />
    <template #content>
      <div class="add-question">
        <div
          v-for="item in $options.QUESTION_TYPES"
          :key="item.type"
          class="add-question__item"
          @click="$emit('add-form-question', item.data), showAddQuestion = false"
        >
          <div class="add-question__icon" />
          <div class="add-question__right">
            <div class="add-question__title b2s">
              {{ item.questionName }}
            </div>
            <div class="add-question__description b2">
              {{ item.questionDescription }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopup>
</template>

<script>
const QUESTION_TYPES = [
  {
    questionName: 'Short answer',
    questionDescription: 'Use this for question.',
    data: {
      type: 'shortAnswer',
      options: {
        title: '',
        decription: '',
        placeholder: 'Type your answer',
        isRequired: false,
      },
    },
  },
  {
    questionName: 'Long answer',
    questionDescription: 'Use this for question.',
    data: {
      type: 'longAnswer',
      options: {
        title: '',
        decription: '',
        placeholder: 'Type your answer',
        isRequired: false,
      },
    },
  },
  {
    questionName: 'Opinion scale',
    questionDescription: 'Use this for question.',
    data: {
      type: 'opinionScale',
      options: {
        title: '',
        description: '',
        scaleSize: 10,
        scaleLabels: {
          low: '',
          medium: '',
          high: '',
        },
        isRequired: false,
      },
    },
  },
];

export default {
  emits: ['add-form-question'],
  data() {
    return {
      showAddQuestion: false,
    };
  },
  QUESTION_TYPES,
};
</script>

<style lang="scss" scoped>
.add-question {
  padding: 16px;

  &__item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &:hover {
      cursor: pointer;
    }
  }
  &__icon {
    background: $grey-100;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    margin-right: 16px;
  }
  &__right {
    display: flex;
    flex-direction: column;
  }
}

.add-question-button {
    margin-top: 32px;
}
</style>
