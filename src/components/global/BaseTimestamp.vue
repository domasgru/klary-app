<template>
  <div
    class="base-timestamp base-typography--b-14-20"
    v-text="time"
  />
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
        return feedbackCreatedDate.format('h:mm A');
      }
      return feedbackCreatedDate.format('MMM D');
    },
  },
};
</script>

<style lang="scss" scoped>
.base-timestamp {
  color: $grey-600;
}
</style>
