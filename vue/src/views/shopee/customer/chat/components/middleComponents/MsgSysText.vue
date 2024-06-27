<template>
  <div class="message-row row-card-system">
    <div class="avatar-holder"></div>
    <div class="message-contain">
      <div class="lzd-message-item card-system">
        <div class="lzd-system-text">
          <span data-spm-anchor-id="a1zawi.15103027.0.i6.45844edfmxLWfi">{{
            sysTextData.notificationForSender
          }}</span>
        </div>
      </div>
      <div class="message-read-type"></div>
    </div>
    <div class="avatar-holder"></div>
  </div>
</template>

<script setup>
  defineProps({
    sysTextData: {
      type: Object,
      default: () => ({})
    }
  });
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
</style>
