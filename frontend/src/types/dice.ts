export type RollVO = {
  value: number;
  drop: boolean;
};

export type RollResultVO = {
  rolls: RollVO[];
  output: string;
  result: number;
};
