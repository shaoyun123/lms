<template>
  <div
    :ref="setRef"
    class="card"
    :style="{ opacity }"
    :data-handler-id="handlerId"
  >
    <slot></slot>
  </div>
</template>

<script setup>
  import { computed, ref, unref, toRefs } from 'vue';
  import { useDrag, useDrop } from 'vue3-dnd';

  const props = defineProps({
    id: {
      type: [Number, String],
      default: ''
    },
    index: {
      type: Number,
      default: null
    },
    moveCard: {
      type: Function,
      default: () => {}
    },
    type: {
      type: String,
      default: 'card'
    }
  });

  const card = ref();
  const [dropCollect, drop] = useDrop({
    accept: props.type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!card.value) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = card.value?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [collect, drag] = useDrag({
    type: props.type,
    item: () => {
      return { id: props.id, index: props.index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const { handlerId } = toRefs(dropCollect.value);
  const { isDragging } = toRefs(collect.value);
  const opacity = computed(() => (unref(isDragging) ? 0.5 : 1));

  const setRef = (el) => {
    card.value = drag(drop(el));
  };
</script>

<style lang="scss" scoped></style>
