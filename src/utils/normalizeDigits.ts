/**
 * Converts Arabic-Indic (٠١٢٣٤٥٦٧٨٩) and Persian (۰۱۲۳۴۵۶۷۸۹)
 * digits to ASCII/English digits (0123456789).
 * Also normalizes Arabic/Persian decimal separators to a dot.
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٫٬]/g, (separator) => separator === '٫' ? '.' : ',');
}

export function normalizeNumericInput(value: string): string {
  return normalizeDigits(value);
}

/**
 * Installs one global input listener so every text/number input is normalized
 * before the application receives or stores its value. This covers typing,
 * paste, autofill and programmatic input events without changing the UI.
 */
export function installGlobalInputNormalization(): () => void {
  const handleInput = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    const original = target.value;
    const normalized = normalizeNumericInput(original);
    if (normalized === original) return;

    const start = target.selectionStart;
    const end = target.selectionEnd;
    target.value = normalized;

    // Preserve the cursor as closely as possible after replacing digits.
    if (start !== null && end !== null) {
      const delta = normalized.length - original.length;
      const nextStart = Math.max(0, Math.min(normalized.length, start + delta));
      const nextEnd = Math.max(0, Math.min(normalized.length, end + delta));
      try { target.setSelectionRange(nextStart, nextEnd); } catch { /* non-text input */ }
    }

    // Make React controlled inputs receive the normalized value.
    target.dispatchEvent(new Event('change', { bubbles: true }));
  };

  document.addEventListener('input', handleInput, true);
  return () => document.removeEventListener('input', handleInput, true);
}
