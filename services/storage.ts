import { AppData } from '../types';
import { STORAGE_KEY, INITIAL_DATA } from '../constants';

export const loadData = (): AppData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_DATA, ...parsed };
    } catch (e) {
      console.error('Error loading data', e);
      return INITIAL_DATA;
    }
  }
  return INITIAL_DATA;
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
