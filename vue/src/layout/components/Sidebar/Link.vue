<template>
  <a
    v-if="getExternalLinkTitle(props.title)"
    :href="props.to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <router-link v-else :to="props.to">
    <slot />
  </router-link>
</template>
<script setup>
  // import { isExternal } from '@/utils/validate';
  import CacheKey from '@/constant/index';
  const externalLinkTitle = CacheKey.externalLinkTitle;

  function getExternalLinkTitle(title) {
    return externalLinkTitle.includes(title);
  }

  const props = defineProps({
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  });
</script>
