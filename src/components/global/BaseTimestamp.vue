<template>
  <div class="base-timestamp base-typography--b3">
    {{ time }}
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    timestamp: {
      type: Number,
      required: true,
    },
  },
  computed: {
    time() {
      const today = dayjs();
      const feedbackCreatedDate = dayjs(this.timestamp * 1000);

      const isTodayFeedback = today.date() === feedbackCreatedDate.date()
        && today.month() === feedbackCreatedDate.month()
        && today.year() === feedbackCreatedDate.year();

      if (isTodayFeedback) {
        return feedbackCreatedDate.format('h:m A');
      }
      return feedbackCreatedDate.format('MMM D');
    },
  },
};
</script>

<style lang="scss" scoped>
.base-timestamp {
  color: $grey-500;
}
</style>
