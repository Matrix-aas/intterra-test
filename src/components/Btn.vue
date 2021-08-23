<template>
  <div :class="classes" @click.self="click">
    <div class="button-body">
      <template v-if="!loading">
        <slot name="icon">
          <img v-if="icon" alt="icon" :src="icon" class="mr-3">
        </slot>
        <slot>
          {{ label }}
        </slot>
      </template>
      <loader v-else/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from './Loader.vue';

export default defineComponent({
  name: 'Btn',

  components: {
    Loader,
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: null,
    },

    plain: {
      type: Boolean,
      default: false,
    },

    raised: {
      type: Boolean,
      default: false,
    },

    rounded: {
      type: Boolean,
      default: false,
    },

    neutral: {
      type: Boolean,
      default: false,
    },

    switch: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click', 'update:selected'],

  computed: {
    classes() {
      return {
        btn: true,
        'btn-plain': this.plain,
        'btn-raised': this.raised,
        'btn-rounded': this.rounded,
        'btn-neutral': this.neutral,
        'btn-switch': this.switch && this.name,
        'btn-switch-selected': this.switch && this.selected && this.name && this.selected === this.name,
        'btn-disabled': this.disabled,
      };
    },
  },

  methods: {
    click(e: Event) {
      if (this.disabled) {
        return;
      }

      this.$emit('click', e);

      if (this.switch) {
        this.$emit('update:selected', this.name);
      }
    },
  },
});
</script>

<style scoped>
.button-body {
  pointer-events: none;
  display: flex;
}
</style>
