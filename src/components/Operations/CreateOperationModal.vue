<template>
  <modal v-model="createOperationModal">
    <div class="flex-col" style="height: 100%; justify-content: space-between;">
      <div>
        <section>
          <h2 class="text-h2 no-mp">
            {{ form.id ? 'Обновление' : 'Добавление' }} операции
          </h2>
        </section>

        <section>
          <div class="flex-row" style="justify-content: space-between">
            <div class="flex-row">
              <div class="green-box mr-4"/>
              <div class="flex-col">
                <div class="text-hint uppercase">Поле</div>
                <div class="text-bold" style="font-size: 15px">112</div>
              </div>
            </div>

            <div class="flex-row" style="align-items: flex-end">
              <div class="flex-col mr-4">
                <div class="text-h3 text-right mb-3">Озимая пшеница</div>
                <div class="uppercase text-right text-hint">Победа 50</div>
              </div>
              <div>
                <img src="/images/wheat-icon.svg" alt="wheat">
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-6">
            <label for="operation" class="text-hint uppercase">
              Операция
            </label>
            <select id="operation" v-model="form.operation" :disabled="loading">
              <option disabled selected value="-1">Выберите</option>
              <template v-for="(value, label) of OperationType">
                <option v-if="isNaN(Number(label))" :value="value" :key="value">
                  {{ $t(label) }}
                </option>
              </template>
            </select>
          </div>

          <div class="flex-row">
            <div class="flex-col mr-4">
              <label for="date" class="text-hint uppercase">
                Дата проведения
              </label>
              <input id="date" type="date" style="width: 150px;" :disabled="loading" v-model="form.date">
            </div>

            <div class="flex-col">
              <label for="area" class="text-hint uppercase">
                Кол-во ГА к обработке
              </label>
              <input id="area" type="number" min="1" style="width: 100%" placeholder="Задайте" :disabled="loading" v-model="form.area">
            </div>
          </div>
        </section>

        <section>
          <textarea placeholder="Комментарий к операции..." :disabled="loading" v-model="form.comment"/>
        </section>

        <section>
          <div class="uppercase mb-5" style="font-size: 11px">
            Качество выполнения операции
          </div>

          <Switch :variants="assessmentVariants" :disabled="loading" nullable v-model="form.assessment"/>
        </section>
      </div>

      <div class="flex-col" style="justify-content: flex-end">
        <btn
          :label="`${form.id ? 'Обновить' : 'Добавить'} операцию`"
          class="create-button uppercase"
          :disabled="loading || !allowSubmit"
          :loading="loading"
          @click="submit"
        />
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Modal from '../Modal.vue';
import Switch, { Variants } from '../Switch.vue';
import Btn from '../Btn.vue';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Assessment, OperationType } from '../../models/Operation';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export interface OperationForm {
  id?: string,
  operation: number,
  date?: string,
  area?: number,
  comment?: string,
  assessment?: Assessment,
}

export default defineComponent({
  name: 'CreateOperationModal',

  components: {
    Modal,
    Switch,
    Btn,
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'submit'],

  data() {
    return {
      createOperationModal: false,

      assessmentVariants: [{
        label: this.$t('EXCELLENT'),
        value: Assessment.EXCELLENT,
        color: '#66CC66',
      }, {
        label: this.$t('SATISFACT'),
        value: Assessment.SATISFACTORILY,
        color: '#FFE06D',
      }, {
        label: this.$t('BADLY'),
        value: Assessment.BADLY,
        color: '#ff7360',
      }] as Variants,

      form: {
        id: undefined,
        operation: -1,
        date: undefined,
        area: undefined,
        comment: undefined,
        assessment: undefined,
      } as OperationForm,

      loading: false,
    };
  },

  inject: ['operationsService'],

  computed: {
    OperationType(): typeof OperationType {
      return OperationType;
    },

    allowSubmit(): boolean {
      return Boolean(Number(this.form.operation) > -1 && this.form.date && this.form.area);
    },
  },

  watch: {
    modelValue(val: boolean) {
      this.createOperationModal = val;
      this.clear();
      this.loading = false;
    },

    createOperationModal(val: boolean) {
      this.$emit('update:modelValue', val);
    },

    $route(to: RouteLocationNormalizedLoaded) {
      if (to.params.id && typeof to.params.id === 'string') {
        this.loadOperationData(to.params.id);
      }
    },
  },

  mounted() {
    this.createOperationModal = this.modelValue;

    if (this.$route.params.id && typeof this.$route.params.id === 'string') {
      this.loadOperationData(this.$route.params.id);
    }
  },

  methods: {
    submit(): void {
      this.loading = true;
      this.$emit('submit', this.form);
    },

    clear(): void {
      this.form.id = undefined;
      this.form.operation = -1;
      this.form.date = undefined;
      this.form.area = undefined;
      this.form.comment = undefined;
      this.form.assessment = undefined;
    },

    async loadOperationData(id: string | null) {
      this.loading = true;
      const operation = await (this as any).operationsService.getOperation(id);
      console.log(operation);
      if (operation) {
        this.form.id = operation.id;
        this.form.operation = Number(operation.type);
        this.form.date = (this as any).$moment(`${operation.date.day}.${operation.date.month}.${operation.date.year}`, 'DD.MM.YYYY').format('YYYY-MM-DD');
        this.form.area = operation.area;
        this.form.comment = operation.comment;
        this.form.assessment = operation.assessment;
      } else {
        this.clear();
      }
      this.loading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  border-bottom: 1px solid #EDEEEE;
  padding: 12px 20px;
}

.green-box {
  width: 25px;
  height: 25px;
  background: #73FF82;
  border: 1px solid #66CC66;
}

select#operation {
  width: 100%;
  border: none;
  padding: 10px 0;
  font-size: 13px;
  color: #333333;
}

input {
  border: none;
  padding: 5px 2px;
  font-size: 18px;

  &::placeholder {
    color: #C7C7CD;
    font-size: 18px;
  }
}

textarea {
  width: 100%;
  border: none;
  min-height: 140px;
  resize: vertical;

  &::placeholder {
    color: #C7C7CD;
    font-size: 18px;
  }
}

.create-button {
  width: 100%;
  background: #66CC66;
  color: white;
  font-size: 11px;
  padding: 24px 0;
}
</style>
