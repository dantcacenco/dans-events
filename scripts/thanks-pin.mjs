#!/usr/bin/env node
// Make a PIN for /admin/thanks. The PIN is shown on STDERR only; STDOUT is the salted hash for the env var THANKS_PIN_HASH.
//   node scripts/thanks-pin.mjs                random PIN (no patterns, no dates)
//   node scripts/thanks-pin.mjs --pin 482917   your own PIN
// Change the live PIN: ask the bot "change the thank-you PIN", or run
//   node scripts/thanks-pin.mjs 2>pin.txt | vercel env add THANKS_PIN_HASH production --force   (then redeploy)
// The PIN is never stored: only the hash goes in Vercel. Changing it signs every device out.
import { randomBytes, randomInt, scryptSync } from "node:crypto";

export function weak(pin) {
  if (!/^\d{6}$/.test(pin)) return "not 6 digits";
  const d = [...pin].map(Number);
  if (new Set(d).size < 4) return "too few different digits";
  for (let i = 0; i < 4; i++) {
    const [a, b, c] = [d[i], d[i + 1], d[i + 2]];
    if (a === b && b === c) return "repeated digit";
    if (b - a === c - b && Math.abs(b - a) === 1) return "run of 3 in a row";
  }
  if (pin.slice(0, 3) === pin.slice(3)) return "repeating block";
  if (pin.slice(0, 2) === pin.slice(2, 4) && pin.slice(2, 4) === pin.slice(4)) return "repeating block";
  if (pin === [...pin].reverse().join("")) return "palindrome";
  const [x, y, z] = [pin.slice(0, 2), pin.slice(2, 4), pin.slice(4)].map(Number);
  const dateish = (m, dd) => m >= 1 && m <= 12 && dd >= 1 && dd <= 31;
  if (dateish(x, y) || dateish(y, x) || dateish(y, z)) return "looks like a date";
  if (/^(19|20)\d\d/.test(pin) || /(19|20)\d\d$/.test(pin)) return "contains a year";
  return null;
}

export function randomPin() {
  for (;;) {
    const pin = String(randomInt(0, 1000000)).padStart(6, "0");
    if (!weak(pin)) return pin;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const at = process.argv.indexOf("--pin");
  const given = at > -1 ? process.argv[at + 1] : null;
  const pin = given ?? randomPin();
  if (given && weak(pin)) {
    console.error(`Refusing that PIN: ${weak(pin)}`);
    process.exit(1);
  }
  const salt = randomBytes(16);
  process.stdout.write(`scrypt$${salt.toString("hex")}$${scryptSync(pin, salt, 64).toString("hex")}`);
  console.error(`PIN: ${pin}`);
}
