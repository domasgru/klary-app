<template>
  <div class="base-select">
    <BaseInput
      v-bind="$attrs"
      :autocomplete="false"
      v-on="{
        ...$listeners,
        input: value => $emit('input', value)
      }"
      @keydown.up="handleArrowSelect('up')"
      @keydown.down="handleArrowSelect('down')"
      @keydown.enter="select"
      @input="search"
    />
    <div
      v-if="results.length"
      class="base-select__results"
    >
      <div
        v-for="user in results"
        :key="user.uid"
        class="base-select__result"
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
    searchKeys: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      results: [],
      fuseSearcher: null,
    };
  },
  watch: {
    list(newVal) {
      if (newVal) {
        this.fuseSearcher = new Fuse(
          this.list,
          {
            keys: this.searchKeys,
            threshold: 0.2,
            useExtendedSearch: true,
          },
        );
      }
    },
  },
  created() {

  },
  methods: {
    async search(value) {
      this.results = await this.fuseSearcher.search(value);
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
    width: 100%;
    padding: 8px 0;
    background: $light;
    border: $stroke;
    border-radius: 10px;
    transform: translateY(100%);
  }

  &__result {
    display: flex;
    align-items: center;
    padding: 8px 15px;

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
