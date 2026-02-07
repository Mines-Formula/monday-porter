// src/api/BoardSDK.js
import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();

export default class OrderingQueueBoard {
  constructor(boardId) {
    // You can hardcode this if you want,
    // or pass it in from the hook
    this.boardId = boardId || 9377407776; // 🔴 replace with real board ID
  }

  aggregate() {
    const state = {
      groupBy: null,
      sumColumn: null,
      sumAlias: null,
      countAlias: null,
    };

    return {
      groupBy: (columnId) => {
        state.groupBy = columnId;
        return this.aggregateChain(state);
      },
    };
  }

  aggregateChain(state) {
    return {
      sum: (columnId, alias) => {
        state.sumColumn = columnId;
        state.sumAlias = alias;
        return this.aggregateChain(state);
      },

      countItems: (alias) => {
        state.countAlias = alias;
        return this.aggregateChain(state);
      },

      execute: async () => {
        return this.executeAggregation(state);
      },
    };
  }

  async executeAggregation(state) {
    const query = `
      query {
        boards(ids: ${this.boardId}) {
          items {
            column_values {
              id
              text
            }
          }
        }
      }
    `;

    const res = await monday.api(query);
    const items = res.data.boards[0].items;

    const resultMap = {};

    items.forEach(item => {
      const groupValue = item.column_values.find(
        c => c.id === state.groupBy
      )?.text;

      const sumValueRaw = item.column_values.find(
        c => c.id === state.sumColumn
      )?.text;

      const sumValue = parseFloat(sumValueRaw) || 0;

      if (!groupValue) return;

      if (!resultMap[groupValue]) {
        resultMap[groupValue] = {
          [state.groupBy]: groupValue,
          [state.sumAlias]: 0,
          [state.countAlias]: 0,
        };
      }

      resultMap[groupValue][state.sumAlias] += sumValue;
      resultMap[groupValue][state.countAlias] += 1;
    });

    return Object.values(resultMap);
  }
}
