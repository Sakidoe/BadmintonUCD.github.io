/**
 * Tiny HTML helpers so data files can be rendered safely without a framework.
 */

/** Escape a string for safe insertion into HTML. */
export function escape(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Marks a string as already-safe HTML so `html` will not escape it. */
export class Raw {
  constructor(public readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export const raw = (s: string): Raw => new Raw(s);

/**
 * Tagged template: interpolated values are escaped unless they are `Raw`
 * (or arrays of Raw), so you can nest `html` calls safely.
 *
 *   html`<li>${officer.name}</li>`
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): Raw {
  let out = '';
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < values.length) out += render(values[i]);
  });
  return new Raw(out);
}

function render(v: unknown): string {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof Raw) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return escape(v);
}

/** Render a `Raw` into a mount point selected by `[data-mount="name"]`. */
export function mount(name: string, content: Raw): void {
  const el = document.querySelector<HTMLElement>(`[data-mount="${name}"]`);
  if (el) el.innerHTML = content.value;
}

/** Shorthand querySelector with a non-null assertion. */
export function $<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}
