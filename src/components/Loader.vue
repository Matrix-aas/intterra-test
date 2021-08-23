<template>
  <div>
    <div class="spinner"/>
    <div v-if="message.length > 0" class="spinner-text">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loader',

  props: {
    message: {
      type: String,
      default: '',
    },
  },
});
</script>

<style>
.spinner {
  margin: 0 auto;
  border-radius: 100%;
  border: 4px solid #eee;
  border-top: 4px solid #2196f3;
  width: 32px;
  height: 32px;
  animation: spin 0.8s linear infinite;
  transition: all 0.3s linear;
}

.spinner-text {
  margin-top: 4px;
  color: #555;
  font-size: 13px;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
