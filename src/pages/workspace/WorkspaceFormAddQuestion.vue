<template>
  <BasePopup
    position="bottom"
    width="216px"
    padding="8px"
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
          <BaseSvg
            :name="$options.QUESTION_INFO[item.id].illustration"
            class="add-question__icon"
          />
          <div class="add-question__right">
            <div class="add-question__title b2s">
              {{ $options.QUESTION_INFO[item.id].questionName }}
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
    illustration: 'short-answer',
  },
  longAnswer: {
    questionName: 'Long answer',
    illustration: 'long-answer',
  },
  opinionScale: {
    questionName: 'Opinion scale',
    illustration: 'opinion-scale',
  },
  multiSelect: {
    questionName: 'Checklist',
    illustration: 'multiple-select',
  },
  singleSelect: {
    questionName: 'Select',
    illustration: 'single-select',
  },
};

const QUESTION_TYPES = [
  {
    id: 'shortAnswer',
    component: 'WorkspaceFormShortAnswer',
    options: {
      title: '',
      decription: '',
      placeholder: 'Type your answer',
      isRequired: false,
    },
    value: null,
  },
  {
    id: 'longAnswer',
    component: 'WorkspaceFormLongAnswer',
    options: {
      title: '',
      decription: '',
      placeholder: 'Type your answer',
      isRequired: false,
    },
    value: null,
  },
  {
    id: 'opinionScale',
    component: 'WorkspaceFormOpinionScale',
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
  {
    id: 'multiSelect',
    component: 'WorkspaceFormSelect',
    options: {
      title: '',
      description: '',
      items: [
        {
          title: '',
        },
      ],
      isRequired: false,
      isSingleSelect: false,
    },
    value: [],
    customOptionValue: '',
  },
  {
    id: 'singleSelect',
    component: 'WorkspaceFormSelect',
    options: {
      title: '',
      description: '',
      items: [
        {
          title: '',
        },
      ],
      isRequired: false,
      isSingleSelect: true,
    },
    value: null,
    customOptionValue: '',
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
  &__item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    background: $grey-100;
    border-radius: 8px;
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
