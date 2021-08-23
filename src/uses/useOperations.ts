import { inject, reactive, ref, watch } from 'vue';
import moment from 'moment';
import Operation, { Assessment, OperationType } from '../models/Operation';
import FieldService from '../FieldService';
import { Sort } from '../components/SmartTable.vue';

export interface AssessmentInfo {
  color: string,
  label: string,
}

export class OperationInfo extends Operation {
  constructor(
    args: Operation,
    public typeName: string,
    public assessmentInfo: AssessmentInfo,
    public dateMoment: moment.Moment,
    public culture: string,
  ) {
    super(args);
  }
}

const getOperationTypeKeyName = (type: number): string => {
  return Object.keys(OperationType)[Object.values(OperationType).indexOf(type)];
};

const getAssessmentInfo = (assessment: Assessment | null | undefined): AssessmentInfo => {
  switch (assessment) {
    case Assessment.EXCELLENT:
      return { color: '#66CC66', label: 'EXCELLENT' };
    case Assessment.SATISFACTORILY:
      return { color: '#FFE06D', label: 'SATISFACTORILY' };
    case Assessment.BADLY:
      return { color: '#FF7360', label: 'BADLY' };
    default:
      return { color: '#EDEEEE', label: 'NO_ASSESSMENT' };
  }
};

export function useOperations() {
  const loading = ref(false as boolean);
  const operations = ref(null as unknown as Array<OperationInfo>);

  const selectedFilter = ref('executed' as string);
  const selectedSort = ref(null as unknown as Sort);

  const operationsService: FieldService = inject('operationsService', null) as unknown as FieldService;

  const resortOperations = (sort: Sort): void => {
    selectedSort.value = sort;

    const direction = sort.direction ? 1 : -1;

    operations.value.sort((op1, op2): number => {
      const at1 = Number(op1.assessment !== null ? op1.assessment : 3);
      const at2 = Number(op2.assessment !== null ? op2.assessment : 3);

      switch (sort.field) {
        case 'date':
          return op1.dateMoment.diff(op2.dateMoment, 'days') * direction;
        case 'type':
          return (op2.type - op1.type) * direction;
        case 'culture':
          return 0;
        case 'assessment':
          return (at2 - at1) * direction;
        default:
          return 0;
      }
    });
  };

  const loadOperations = async (): Promise<void> => {
    loading.value = true;

    const now = moment();

    try {
      operations.value = (await operationsService.getOperations())
        .map((op) => (new OperationInfo(op,
          getOperationTypeKeyName(op.type),
          getAssessmentInfo(op.assessment),
          moment(`${op.date.day}.${op.date.month}.${op.date.year}`, 'DD.MM.YYYY'),
          'Пшеница озимая',
        )))
        .filter((op) => {
          const isAfter = op.dateMoment.isAfter(now);
          return selectedFilter.value === 'planned' ? isAfter : !isAfter;
        });

      if (selectedSort.value) {
        resortOperations(selectedSort.value);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      loading.value = false;
    }
  };

  watch([selectedFilter, selectedSort], () => {
    loadOperations();
  });

  loadOperations();

  return {
    operations: reactive({
      isLoading: loading,
      list: operations,
      selected: reactive({
        sort: selectedSort,
        filter: selectedFilter,
      }),
      reload: loadOperations,
      service: operationsService,
    }),
  };
}
