<template>
  <div
    class="lzd-message-item card-product"
    :style="lazadaCardData.fromAccountType === 1 ? '' : style"
  >
    <div class="card-product message-card">
      <div class="card-header">
        {{ JSON.parse(JSON.parse(lazadaCardData.content).title).en }}
      </div>
      <div class="card-content">
        <div
          class="background-default lzd-pro-img"
          :style="{
            'background-image':
              'url(' + JSON.parse(lazadaCardData.content).iconUrl + ')'
          }"
        ></div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ JSON.parse(lazadaCardData.content).desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaCardData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        style: {
          border: '0.5px solid rgb(165, 203, 233)',
          'background-color': 'rgb(201, 231, 255)'
        }
      };
    }
  };
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
</style>
