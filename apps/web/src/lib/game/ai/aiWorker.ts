import * as Comlink from 'comlink';
import { selectAiMove, updateAiState, generateAiFleet } from './aiEngine';

const aiEngineWorker = {
  selectAiMove,
  updateAiState,
  generateAiFleet
};

Comlink.expose(aiEngineWorker);
export type AIEngineWorker = typeof aiEngineWorker;
