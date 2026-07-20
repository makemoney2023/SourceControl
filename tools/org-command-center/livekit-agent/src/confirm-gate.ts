export type ConfirmGate = {
  isWaiting: () => boolean;
  setWaiting: (waiting: boolean) => void;
};

export function createConfirmGate(initial = false): ConfirmGate {
  let waiting = initial;
  return {
    isWaiting: () => waiting,
    setWaiting: (next) => {
      waiting = next;
    },
  };
}
