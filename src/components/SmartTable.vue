<template>
  <div>
    <table>
      <thead>
      <tr>
        <th
          v-for="column of columns"
          :key="column.id"
          scope="col"
          :style="{width: column.width || 'auto', whiteSpace: column.width ? 'no-wrap' : 'normal'}"
        >
          <component
            :is="column.sortable === true ? 'btn' : 'div'"
            btn
            plain
            class="flex-start"
            style="width: auto"
            @click="sortChanged(column)"
          >
            <div class="mr-3">
              {{ column.title }}
            </div>
            <div v-if="column.sortable === true" style="margin-top: -2px">
              <img
                :src="`/images/arrow-down${activeSorting.field === column.id ? '-blue' : ''}-icon.svg`"
                :style="{transform: `rotate(${activeSorting.field === column.id && activeSorting.direction ? 180 : 0}deg)`}"
                alt="sort"/>
            </div>
          </component>
        </th>
        <th v-if="actions && actions.length" scope="col"/>
      </tr>
      </thead>

      <tbody>
      <template v-if="!loading">
        <tr v-for="row of rows" :key="row.id">
          <td v-for="column of columns" :key="`${row.id} ${column.id}`">
            <slot :name="`cell-${column.id}`" :item="row[column.id]" :column="column" :row="row">
              {{ row[column.id] }}
            </slot>
          </td>

          <td v-if="actions && actions.length" class="actions">
            <btn v-if="actions.includes('edit')" plain icon="/images/pencil-icon.svg" @click="$emit('action:edit', row)"/>
            <btn v-if="actions.includes('delete')" plain icon="/images/trash-icon.svg" @click="$emit('action:delete', row)"/>
          </td>
        </tr>
      </template>
      </tbody>
    </table>

    <div v-if="loading" class="table-loader mt-8">
      <loader message="Обновление..."/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Btn from './Btn.vue';
import Loader from './Loader.vue';

export interface ColumnInfo {
  id: string,
  title: string,
  sortable?: boolean,
  width?: string,
}

export type Columns = Array<ColumnInfo>;

export type Actions = Array<string>;

export interface Sort {
  field?: string | null,
  direction: boolean;
}

export default defineComponent({
  name: 'SmartTable',

  components: {
    Btn,
    Loader,
  },

  props: {
    columns: {
      type: Array as PropType<Columns>,
      required: true,
    },

    rows: {
      type: Array as PropType<Array<any>>,
      required: true,
    },

    sort: {
      type: Object as PropType<Sort>,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    actions: {
      type: Array as PropType<Actions>,
      default: null,
    },
  },

  emits: ['update:sort', 'action:edit', 'action:delete'],

  data: () => ({
    activeSorting: {
      field: null,
      direction: false,
    } as Sort,
  }),

  watch: {
    sort(val: Sort) {
      if (
        val
        && val !== this.activeSorting
        && Object.prototype.hasOwnProperty.call(val, 'field')
        && Object.prototype.hasOwnProperty.call(val, 'direction')
      ) {
        this.activeSorting.field = val.field;
        this.activeSorting.direction = val.direction;
      } else if (!val) {
        this.activeSorting.field = null;
        this.activeSorting.direction = false;
      }
    },
  },

  methods: {
    sortChanged(column: ColumnInfo) {
      if (column.sortable !== true) {
        return;
      }

      if (this.activeSorting.field === column.id) {
        this.activeSorting.direction = !this.activeSorting.direction;
      } else {
        this.activeSorting.field = column.id;
        this.activeSorting.direction = false;
      }

      this.$emit('update:sort', {
        field: this.activeSorting.field,
        direction: this.activeSorting.direction,
      } as Sort);
    },
  },
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-spacing: 0;

  thead {
    tr {
      background-color: #EDEEEE;
    }

    th {
      text-align: left;
      font-weight: normal;

      & div {
        font-size: 11px !important;
      }
    }
  }

  td, th {
    padding: 20px 10px;
  }

  td {
    border-bottom: 1px solid #EDEEEE;

    &.actions {
      display: flex;
    }
  }
}
</style>

<style lang="scss">
td.actions img {
  width: 16px !important;
  height: 16px !important;
  margin-right: 10px;
}
</style>
