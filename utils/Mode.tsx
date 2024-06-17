export let Mode = 'Chat';

export function setModeValue(newValue: string) {
  Mode = newValue;
}

export function getModeValue() {
  return Mode
}