export const validateIdentification = (str: string): string | undefined => {
  let [suma, mul, chars] = [0, 1, str.length]

  for (let idx = 0; idx < chars; idx += 1) {
    let num = Number(str[idx]) * mul

    suma += num - Number(num > 9) * 9
    mul = 1 << idx % 2
  }

  if ((suma % 10 === 0) && (suma > 0)) {
    return
  }

  return 'Cédula de identidad no válida'
}
