export function sleep(millis: number): Promise<boolean> {
  return new Promise(resolve => {
    const handler = () => {
      resolve(true);
    };
    setTimeout(handler, millis);
  });
}
