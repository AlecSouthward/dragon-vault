export class DragonVaultError extends Error {
  debugMessage;

  constructor(
    message: string,
    opts?: { debugMessage?: string; cause?: Error }
  ) {
    super(message ?? 'No error message provided', { cause: opts?.cause });

    this.debugMessage = opts?.debugMessage;
  }
}

export const throwDragonVaultError = (message: string) => () =>
  new DragonVaultError(message);
