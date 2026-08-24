/**
 * UI-only compliance controls for each IPC recipe sheet.
 * Does not modify recipe data, Supabase, app state, or existing form data.
 */
type ComplianceState = { status: 'compliant' | 'noncompliant' | null; reason: string };

const states = new Map<string, ComplianceState>();
let observer: MutationObserver | null = null;
let installed = false;
let scanQueued = false;
let delegatedClickHandler: ((event: MouseEvent) => void) | null = null;
let delegatedInputHandler: ((event: Event) => void) | null = null;

const getKey = (heading: HTMLElement) => {
  const text = heading.textContent?.trim() || '';
  return text.replace(/^مكونات عجنة:\s*/, '') || text;
};

const findRecipeCard = (heading: HTMLElement): HTMLElement | null => {
  let node: HTMLElement | null = heading;
  while (node && node !== document.body) {
    if ((node.className || '').toString().includes('bg-slate-50/70')) return node;
    node = node.parentElement;
  }
  return heading.parentElement;
};

const updateVisualState = (root: HTMLElement, state: ComplianceState) => {
  root.dataset.status = state.status || '';
  const compliant = root.querySelector<HTMLButtonElement>('[data-ipc-option="compliant"]');
  const noncompliant = root.querySelector<HTMLButtonElement>('[data-ipc-option="noncompliant"]');
  const reason = root.querySelector<HTMLTextAreaElement>('[data-ipc-reason="true"]');
  if (!compliant || !noncompliant || !reason) return;

  const apply = (button: HTMLButtonElement, active: boolean, type: 'check' | 'cross') => {
    const box = button.querySelector<HTMLElement>('[data-ipc-box="true"]');
    if (!box) return;
    box.textContent = active ? (type === 'check' ? '✓' : '×') : '';
    box.style.borderColor = active ? (type === 'check' ? '#059669' : '#e11d48') : '#94a3b8';
    box.style.background = active ? (type === 'check' ? '#ecfdf5' : '#fff1f2') : '#fff';
  };

  apply(compliant, state.status === 'compliant', 'check');
  apply(noncompliant, state.status === 'noncompliant', 'cross');
  reason.disabled = state.status !== 'noncompliant';
  reason.style.background = reason.disabled ? '#f1f5f9' : '#fff';
  reason.style.color = reason.disabled ? '#94a3b8' : '#0f172a';
  reason.style.cursor = reason.disabled ? 'not-allowed' : 'text';
  if (reason.value !== state.reason && document.activeElement !== reason) reason.value = state.reason;
};

const getRootFromTarget = (target: Element): HTMLElement | null =>
  target.closest<HTMLElement>('[data-ipc-compliance-controls="true"]');

const getStateKeyFromRoot = (root: HTMLElement): string => root.dataset.ipcKey || '';

const createRoot = (card: HTMLElement, key: string) => {
  let root = card.querySelector<HTMLElement>('[data-ipc-compliance-controls="true"]');
  if (root) {
    root.dataset.ipcKey = key;
    return root;
  }

  root = document.createElement('div');
  root.dataset.ipcComplianceControls = 'true';
  root.dataset.ipcKey = key;
  root.style.cssText = 'margin-top:14px;padding-top:12px;border-top:1px solid #e2e8f0;width:100%;direction:rtl;display:flex;justify-content:flex-start;position:relative;z-index:99999;pointer-events:auto;';

  const panel = document.createElement('div');
  panel.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;width:100%;direction:rtl;pointer-events:auto;';

  const title = document.createElement('div');
  title.textContent = 'حالة المطابقة للصنف';
  title.style.cssText = 'font-size:12px;font-weight:800;color:#334155;align-self:flex-start;';
  panel.appendChild(title);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:18px;flex-wrap:wrap;pointer-events:auto;';

  const makeOption = (label: string, status: 'compliant' | 'noncompliant') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.ipcOption = status;
    button.title = label;
    button.setAttribute('aria-label', label);
    button.style.cssText = 'display:inline-flex;align-items:center;gap:7px;border:0;background:transparent;padding:4px 2px;cursor:pointer;font-size:13px;font-weight:800;color:#334155;font-family:inherit;position:relative;z-index:100000;pointer-events:auto;user-select:none;touch-action:manipulation;';

    const box = document.createElement('span');
    box.dataset.ipcBox = 'true';
    box.style.cssText = 'width:22px;height:22px;min-width:22px;border:2px solid #94a3b8;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;line-height:1;box-sizing:border-box;background:#fff;pointer-events:none;';
    button.appendChild(box);
    button.appendChild(document.createTextNode(label));
    return button;
  };

  row.appendChild(makeOption('مطابق', 'compliant'));
  row.appendChild(makeOption('غير مطابق', 'noncompliant'));
  panel.appendChild(row);

  const reason = document.createElement('textarea');
  reason.dataset.ipcReason = 'true';
  reason.rows = 2;
  reason.placeholder = 'اكتب سبب عدم المطابقة...';
  reason.disabled = true;
  reason.style.cssText = 'width:360px;max-width:100%;min-height:64px;resize:vertical;padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;font-size:12px;font-family:inherit;direction:rtl;outline:none;position:relative;z-index:100000;pointer-events:auto;background:#f1f5f9;color:#94a3b8;cursor:not-allowed;';
  panel.appendChild(reason);

  root.appendChild(panel);
  card.appendChild(root);
  return root;
};

const scan = () => {
  scanQueued = false;
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h4')).filter(h => (h.textContent || '').trim().startsWith('مكونات عجنة:'));
  headings.forEach(heading => {
    const card = findRecipeCard(heading);
    if (!card) return;
    const key = getKey(heading);
    const state = states.get(key) || { status: null, reason: '' };
    states.set(key, state);
    const root = createRoot(card, key);
    updateVisualState(root, state);
  });
};

const scheduleScan = () => {
  if (scanQueued) return;
  scanQueued = true;
  window.requestAnimationFrame(scan);
};

export const installIpcComplianceControls = () => {
  if (installed) return;
  installed = true;

  delegatedClickHandler = (event: MouseEvent) => {
    const rawTarget = event.target;
    if (!(rawTarget instanceof Element)) return;
    const option = rawTarget.closest<HTMLButtonElement>('[data-ipc-option]');
    if (!option) return;
    const root = getRootFromTarget(option);
    if (!root) return;
    const key = getStateKeyFromRoot(root);
    if (!key) return;
    event.preventDefault();
    event.stopPropagation();
    const status = option.dataset.ipcOption as 'compliant' | 'noncompliant';
    const previous = states.get(key) || { status: null, reason: '' };
    const next: ComplianceState = status === 'compliant'
      ? { status: 'compliant', reason: '' }
      : { status: 'noncompliant', reason: previous.reason };
    states.set(key, next);
    updateVisualState(root, next);
  };

  delegatedInputHandler = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement) || target.dataset.ipcReason !== 'true') return;
    const root = target.closest<HTMLElement>('[data-ipc-compliance-controls="true"]');
    if (!root) return;
    const key = getStateKeyFromRoot(root);
    if (!key) return;
    const previous = states.get(key) || { status: 'noncompliant' as const, reason: '' };
    states.set(key, { status: previous.status === 'noncompliant' ? 'noncompliant' : previous.status, reason: target.value });
  };

  document.addEventListener('click', delegatedClickHandler, true);
  document.addEventListener('input', delegatedInputHandler, true);

  if (document.body) {
    observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.body, { childList: true, subtree: true });
  }
  scheduleScan();
};

export const uninstallIpcComplianceControls = () => {
  observer?.disconnect();
  observer = null;
  if (delegatedClickHandler) document.removeEventListener('click', delegatedClickHandler, true);
  if (delegatedInputHandler) document.removeEventListener('input', delegatedInputHandler, true);
  delegatedClickHandler = null;
  delegatedInputHandler = null;
  installed = false;
};
