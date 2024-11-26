<template>
  <div
    v-click-outside="{
      handler: () => isOpen = false,
      events: ['mousedown']
    }"
    class="base-select"
  >
    <BaseInput
      ref="input"
      :type="type"
      v-bind="$attrs"
      :model-value="modelValue"
      :autocomplete="false"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :selected-value="selectedValue"
      :selected-values="selectedValues"
      @remove="$emit('remove', $event)"
      @update:modelValue="$emit('update:modelValue', $event), search($event)"
      @keydown.up.prevent="handleArrowSelect('up')"
      @keydown.down.prevent="handleArrowSelect('down')"
      @keydown="openResultsIfClosed"
      @keydown.enter="select()"
      @focus="handleFocus"
      @keydown.esc="isOpen = false"
    />
    <div
      v-if="isOpen && results.length"
      class="base-select__results"
    >
      <div
        v-for="(user, index) in results"
        :ref="user.item.uid"
        :key="user.item.uid"
        class="base-select__result"
        :class="{'base-select__result--active': index === activeResultIndex}"
        @click="select(user.item)"
      >
        <BaseAvatar
          class="base-select__initial"
          size="xs"
          :name="user.item.name"
        />
        <div class="base-select__name">
          {{ user.item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js';

export default {
  // emits: ['remove', 'update:modelValue'],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    autofocus: {
      type: Boolean,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    searchKeys: {
      type: Array,
      required: true,
    },
    selectedValue: {
      type: Object,
      default: () => ({}),
    },
    selectedValues: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      isOpen: false,
      results: [],
      activeResultIndex: 0,
      fuseSearcher: null,
    };
  },
  watch: {
    list(newValue) {
      this.initSearcher();
      this.results = [];
    },
  },
  created() {
    this.initSearcher();
  },
  methods: {
    initSearcher() {
      this.fuseSearcher = new Fuse(
        this.list,
        {
          keys: this.searchKeys,
          threshold: 0.2,
          useExtendedSearch: true,
        },
      );
    },
    async search(value) {
      this.results = await this.fuseSearcher.search(value);
    },
    handleArrowSelect(direction) {
      if (direction === 'down') {
        if (this.activeResultIndex === this.results.length - 1) {
          this.activeResultIndex = 0;
        } else {
          this.activeResultIndex += 1;
        }
      } else if (direction === 'up') {
        if (this.activeResultIndex === 0) {
          this.activeResultIndex = this.results.length - 1;
        } else {
          this.activeResultIndex -= 1;
        }
      }
      this.$refs[this.results[this.activeResultIndex].item.uid][0].scrollIntoView({ block: 'nearest' });
    },
    select(user) {
      const selectedUser = user || this.results[this.activeResultIndex]?.item || null;
      if (selectedUser) {
        this.$emit('select', selectedUser);
        this.isOpen = false;
      }
    },
    openResultsIfClosed() {
      if (this.isOpen) {
        return;
      }

      this.isOpen = true;
    },
    handleFocus() {
      this.isOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-select {
  position: relative;

  &__results {
    position: absolute;
    bottom: 24px;
    left: 0;
    z-index: 1;
    width: 100%;
    max-height: 208px;
    padding: 8px 0;
    overflow-y: scroll;
    background: $light;
    border: $stroke;
    border-radius: 10px;
    transform: translateY(100%);
  }

  &__result {
    display: flex;
    align-items: center;
    padding: 8px 15px;

    &--active {
      background: $grey-100;
    }

    &:hover {
      cursor: pointer;
      background: $grey-100;
    }
  }

  &__initial {
    margin-right: 8px;
  }
}
</style>
