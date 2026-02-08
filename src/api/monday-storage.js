// src/api/monday-storage.js
import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();

/**
 * Usage:
 * storage().key('foo').get()
 * storage().key('foo').set(value)
 * storage().key('foo').version(version).set(value)
 */
export const storage = () => {
  let currentKey = null;
  let currentVersion = null;

  return {
    key: (key) => {
      currentKey = key;
      return {
        get: async () => {
          const res = await monday.storage.getItem(currentKey);
          return {
            value: res?.value ?? null,
            version: res?.version ?? null,
          };
        },

        set: async (value) => {
          await monday.storage.setItem(currentKey, value);
        },

        version: (version) => {
          currentVersion = version;
          return {
            set: async (value) => {
              await monday.storage.setItem(currentKey, value, currentVersion);
            },
          };
        },
      };
    },
  };
};
