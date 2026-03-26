export type AnalysisStoreState = {
  isAnalyzing: boolean;
  selectedScenario: string | null;
};

export const analysisStoreInitialState: AnalysisStoreState = {
  isAnalyzing: false,
  selectedScenario: null
};
