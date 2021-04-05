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
          @click="$emit('add-form-question', item), showAddQuestion = false"
        >
          <div class="add-question__icon" />
          <div class="add-question__right">
            <div class="add-question__title b2s">
              {{ $options.QUESTION_INFO[item.type].questionName }}
            </div>
            <div class="add-question__description b2">
              {{ $options.QUESTION_INFO[item.type].questionDescription }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopup>
</template>

<script>
const QUESTION_INFO = {
  shortAnswer: {
    questionName: 'Short answer',
    questionDescription: 'Use this for question.',
  },
  longAnswer: {
    questionName: 'Long answer',
    questionDescription: 'Use this for question.',
  },
  opinionScale: {
    questionName: 'Opinion scale',
    questionDescription: 'Use this for question.',
  },
};

const QUESTION_TYPES = [
  {
    type: 'shortAnswer',
    options: {
      title: '',
      decription: '',
      placeholder: 'Type your answer',
      isRequired: false,
    },
    value: null,
  },
  {
    type: 'longAnswer',
    options: {
      title: '',
      decription: '',
      placeholder: 'Type your answer',
      isRequired: false,
    },
    value: null,
  },
  {
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
    value: null,
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
  QUESTION_INFO,
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
