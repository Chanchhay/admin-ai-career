export const delay = (ms = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));