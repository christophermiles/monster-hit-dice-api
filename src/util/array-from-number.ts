export default function (number: number): number[] {
  return Array.from({ length: Math.floor(number) }, (_, i) => i + 1)
}
