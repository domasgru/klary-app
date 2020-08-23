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
      type="multi"
      v-bind="$attrs"
      :autocomplete="false"
      :autofocus="autofocus"
      :selected-values="selectedUsers"
      @remove="$emit('remove', $event)"
      @input="$emit('input', $event), search($event)"
      @keydown.up.prevent="handleArrowSelect('up')"
      @keydown.down.prevent="handleArrowSelect('down')"
      @keydown="openResultsIfClosed"
      @keydown.enter="select()"
      @focus="isOpen = true"
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
        <BaseInitial
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
  props: {
    list: {
      type: Array,
      required: true,
    },
    autofocus: {
      type: Boolean,
      required: true,
    },
    searchKeys: {
      type: Array,
      required: true,
    },
    selectedUsers: {
      type: Array,
      required: true,
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
