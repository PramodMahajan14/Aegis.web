// Wraps static demo data as a fake async fetch so pages can be driven by
// react-query today and swapped onto a real API later without touching
// component code.
export function fetchMock<T>(data: T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}
