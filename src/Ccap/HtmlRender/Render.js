import pretty from "pretty";

export function _pretty(str) {
  return () => {
    return pretty(str);
  };
}
