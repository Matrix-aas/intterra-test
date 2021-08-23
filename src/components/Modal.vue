<template>
  <teleport to="#modals">
    <transition name="fade">
      <div v-if="modelValue" class="modal-black-screen" @click="dispose"/>
    </transition>

    <transition name="translateX">
      <div v-if="modelValue" class="modal">
        <slot/>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    dispose(): void {
      this.$emit('update:modelValue', false);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-black-screen {
  z-index: 1;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    & {
      display: none;
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: white;
  z-index: 2;
  overflow-y: auto;

  @media (min-width: 768px) {
    & {
      width: 320px;
    }
  }

  @media (max-width: 768px) {
    & {
      width: 100vw;
    }
  }
}

.translateX-enter-active,
.translateX-leave-active {
  transition: transform 0.3s ease;
}

.translateX-enter-from,
.translateX-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
