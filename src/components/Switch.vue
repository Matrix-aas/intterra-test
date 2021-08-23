<template>
  <div class="switch-container">
    <button
      v-for="(variant, index) of variants"
      :key="index"
      type="button"
      :class="{switch: true, selected: variant.value === modelValue, disabled}"
      :style="style(variant)"
      @click="clicked(variant)"
    >
      {{ variant.label }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export type VariantValue = number | string;

export interface Variant {
  label: string,
  value: VariantValue,
  color: string,
}

export type Variants = Array<Variant>;

export default defineComponent({
  name: 'Switch',

  props: {
    variants: {
      type: Array as PropType<Variants>,
      required: true,
    },

    modelValue: {
      type: Object as PropType<VariantValue>,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    nullable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    clicked(variant: Variant) {
      if (this.disabled) {
        return;
      }

      if (this.nullable && this.modelValue === variant.value) {
        this.$emit('update:modelValue', null);
      } else {
        this.$emit('update:modelValue', variant.value);
      }
    },

    style(variant: Variant): any {
      return { width: `calc(100% / ${this.variants.length})`, '--bgColor': variant.color };
    },
  },
});
</script>

<style lang="scss" scoped>
.switch-container {
  width: 100%;

  .switch {
    border: none;
    border-right: 1px solid #EFF0F0;
    padding: 15px 10px;
    background: #f9f9f9;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;

    .disabled {
      background: #9d9d9d !important;
    }

    &.selected:not(.disabled) {
      background: #dedede;
      background: var(--bgColor) !important;
    }

    &:hover:not(.disabled, .selected) {
      background: #f3f2f2;
    }

    &:first-child {
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    &:last-child {
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      border-right: none;
    }
  }
}
</style>
