<template>
  <BaseModal
    v-bind="$props"
    max-width="456px"
    @close="$emit('close'), currentlyShowedModal = 'list', message = ''"
  >
    <slot />
    <template #content>
      <div class="modal">
        <!-- List modal -->
        <div
          v-if="currentlyShowedModal === 'list'"
          class="modal-list"
        >
          <div class="modal-list__title h5">
            Help & Support
          </div>
          <div
            v-for="item in $options.listItems"
            :key="item.id"
            class="modal-list__item"
            @click="handleItemClick(item.id)"
          >
            <BaseIcon
              class="modal-list__icon"
              :name="item.iconName"
            />
            <div class="modal-list__text">
              <div
                class="modal-list__item-title b2s"
                v-text="item.title"
              />
              <div
                class="modal-list__item-description b2"
                v-text="item.description"
              />
            </div>
            <BaseIcon
              color="grey-600"
              name="right"
            />
          </div>
        </div>

        <!-- Support modal -->
        <div
          v-else-if="currentlyShowedModal === 'support'"
          class="modal-support"
        >
          <h5 class="h5 mb-8">
            Contact us
          </h5>
          <p class="b2 mb-24">
            Let us know if there's an issue or a question
          </p>
          <BaseTextarea
            v-model="message"
            label="Your message"
            class="modal-support__input mb-16"
            rows="5"
            padding="10px 12px"
            font-size="14px"
            line-height="20px"
          />
          <BaseButton
            class="modal-support__submit"
            :disabled="!message"
            @click="sendContactUsMessage"
            v-text="'Send'"
          />
        </div>

        <!-- Success modal -->
        <div
          v-else-if="currentlyShowedModal === 'success'"
          class="modal-success"
        >
          <h5 class="h5 mb-8">
            Message sent
          </h5>
          <p class="b2">
            We’ll be in touch with you soon over email.
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { addSupportMessage } from '@/firebase';

const listItems = [
  {
    id: 'guide',
    iconName: 'book-open',
    title: 'Klary Guide',
    description: "Read more about Klary's features",
  },
  {
    id: 'contact',
    iconName: 'comment',
    title: 'Contact us',
    description: "Let us know if there's an issue or a question",
  },
];

export default {
  emits: ['close'],
  data() {
    return {
      currentlyShowedModal: 'list',
      message: '',
    };
  },
  methods: {
    handleItemClick(id) {
      if (id === 'contact') {
        this.currentlyShowedModal = 'support';
      } else if (id === 'guide') {
        window.open('https://klaryapp.notion.site/Klary-guide-dfccd1ae915343df87f5a3ac55f81e71');
      }
    },
    async sendContactUsMessage() {
      await addSupportMessage(this.message);
      this.currentlyShowedModal = 'success';
    },
  },
  listItems,
};
</script>

<style lang="scss" scoped>
.modal-list {
  padding: 24px 12px;

  &__title {
    padding-left: 12px;
    margin-bottom: 26px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 12px;
    border-radius: 10px;

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__icon {
    margin-right: 12px;
  }

  &__text {
    margin-right: auto;
  }

  &__item-title {
    margin-bottom: 4px;
  }

  &__item-description {
    color: $grey-600;
  }
}

.modal-support {
  padding: 24px;

  &__submit {
    margin-left: auto;
  }
}

.modal-success {
  padding: 24px;
}
</style>
