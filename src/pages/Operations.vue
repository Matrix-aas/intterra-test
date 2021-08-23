<template>
  <template v-if="operations.list">
    <section>
      <h1 class="text-h1">Операции на поле 112</h1>
    </section>

    <section class="nav mb-8">
      <div>
        <btn label="Запланированные операции" class="mr-9 uppercase" plain switch name="planned" v-model:selected="operations.selected.filter"/>
        <btn label="Выполненные операции" class="mr-9 uppercase" plain switch name="executed" v-model:selected="operations.selected.filter"/>
      </div>
      <div>
        <btn
          label="Добавить операцию"
          raised
          rounded
          neutral
          icon="/images/plus-icon.svg"
          @click="$router.push({ name: 'operations.create' });"
        />
      </div>
    </section>

    <section>
      <smart-table
        :columns="tableColumns"
        :rows="operations.list"
        :loading="operations.isLoading"
        :actions="['edit', 'delete']"
        v-model:sort="operations.selected.sort"
        @action:edit="row => $router.push({name: 'operations.edit', params: {id: row.id}})"
        @action:delete="deleteModel"
      >
        <template #cell-date="{ row }">
          {{ row.dateMoment.format('DD MMM YYYY') }}
        </template>

        <template #cell-type="{ row }">
          {{ $t(row['typeName']) }}
        </template>

        <template #cell-assessment="{ row }">
          <div class="assessment">
            <div class="assessment-visual mr-5" :style="{backgroundColor: row['assessmentInfo'].color}"/>
            {{ $t(row['assessmentInfo'].label) }}
          </div>
        </template>
      </smart-table>
    </section>

    <create-operation-modal v-model="createOperationModal" @submit="processOperationForm"/>
  </template>
  <loader v-else message="Получение операций..." class="mt-8"/>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import Loader from '../components/Loader.vue';
import SmartTable, { Columns } from '../components/SmartTable.vue';
import Btn from '../components/Btn.vue';
import CreateOperationModal, { OperationForm } from '../components/Operations/CreateOperationModal.vue';
import Operation from '../models/Operation';
import TDate from '../models/TDate';
import { OperationInfo, useOperations } from '../uses/useOperations';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export default defineComponent({
  name: 'Operations',

  components: {
    Loader,
    SmartTable,
    Btn,
    CreateOperationModal,
  },

  data() {
    return {
      tableColumns: [
        {
          id: 'date',
          title: this.$t('date'),
          sortable: true,
        },
        {
          id: 'type',
          title: this.$t('operation'),
          sortable: true,
          width: '50%',
        },
        {
          id: 'culture',
          title: this.$t('culture'),
          sortable: false,
        },
        {
          id: 'assessment',
          title: this.$t('assessment'),
          sortable: true,
        },
      ] as Columns,

      createOperationModal: false,
    };
  },

  setup() {
    return {
      ...useOperations(),
    };
  },

  watch: {
    createOperationModal(val: boolean) {
      if (!val) {
        this.$router.push({ name: 'operations' });
      }
    },

    $route(to: RouteLocationNormalizedLoaded) {
      nextTick(() => {
        this.createOperationModal = to.meta?.create === true;
      });
    },
  },

  mounted() {
    if (this.$route.meta?.create === true) {
      nextTick(() => {
        this.createOperationModal = true;
      });
    }
  },

  methods: {
    async processOperationForm(form: OperationForm) {
      const date = this.$moment(form.date, 'YYYY-MM-DD');

      await this.operations.service.saveOperation(new Operation({
        id: form.id,
        type: form.operation!,
        date: new TDate({
          year: date.year(),
          month: date.month() + 1,
          day: date.date(),
        }),
        area: form.area!,
        comment: form.comment,
        assessment: form.assessment,
      }));

      this.createOperationModal = false;

      this.operations.reload();
    },

    async deleteModel(row: OperationInfo) {
      await this.operations.service.deleteOperation(row.id as string | null);
      this.operations.reload();
    },
  },
});
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-plain {
  font-size: 11px;
}

.assessment {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .assessment-visual {
    width: 20px;
    height: 10px;
    border-radius: 30px;
  }
}
</style>
