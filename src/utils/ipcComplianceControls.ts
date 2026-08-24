/**
 * UI-only compliance controls for each IPC recipe sheet.
 * Does not modify recipe data, Supabase, app state, or existing form data.
 */

type ComplianceState = {
  status: 'compliant' | 'noncompliant' | null;
  reason: string;
};

const states = new Map<string, ComplianceState>();
let observer: MutationObserver | null = null;
let scheduled = false;

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

const makeSquare = (active: boolean, type: 'check' | 'cross') => {
  const box = document.createElement('span');
  box.style.cssText = [
    'width:22px','height:22px','min-width:22px','border:2px solid',
    active ? (type === 'check' ? '#059669' : '#e11d48') : '#94a3b8',
    'border-radius:5px','display:inline-flex','align-items:center',
    'justify-content:center','font-weight:900','font-size:14px','line-height:1',
    'box-sizing:border-box',
    active ? (type === 'check' ? 'background:#ecfdf5' : 'background:#fff1f2') : 'background:#fff'
  ].join(';');
  box.textContent = active ? (type === 'check' ? '✓' : '×') : '';
  return box;
};

const renderControls = (card: HTMLElement, key: string) => {
  const state = states.get(key) || { status: null, reason: '' };
  states.set(key, state);

  let root = card.querySelector<HTMLElement>('[data-ipc-compliance-controls="true"]');
  if (!root) {
    root = document.createElement('div');
    root.dataset.ipcComplianceControls = 'true';
    root.style.cssText = [
      'margin-top:14px','padding-top:12px','border-top:1px solid #e2e8f0',
      'width:100%','direction:rtl','display:flex','justify-content:flex-start'
    ].join(';');
    card.appendChild(root);
  }

  root.innerHTML = '';
  const panel = document.createElement('div');
  panel.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;width:100%;direction:rtl;';

  const title = document.createElement('div');
  title.textContent = 'حالة المطابقة للصنف';
  title.style.cssText = 'font-size:12px;font-weight:800;color:#334155;align-self:flex-start;';
  panel.appendChild(title);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:18px;flex-wrap:wrap;';

  const makeOption = (label: string, type: 'check' | 'cross', active: boolean, onClick: () => void) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = label;
    button.style.cssText = 'display:inline-flex;align-items:center;gap:7px;border:0;background:transparent;padding:3px 0;cursor:pointer;font-size:13px;font-weight:800;color:#334155;font-family:inherit;';
    button.appendChild(document.createTextNode(label));
    button.appendChild(makeSquare(active, type));
    button.addEventListener('click', onClick);
    return button;
  };

  row.appendChild(makeOption('مطابق', 'check', state.status === 'compliant', () => {
    states.set(key, { status: 'compliant', reason: '' });
    renderControls(card, key);
  }));

  row.appendChild(makeOption('غير مطابق', 'cross', state.status === 'noncompliant', () => {
    states.set(key, { status: 'noncompliant', reason: states.get(key)?.reason || '' });
    renderControls(card, key);
  }));

  panel.appendChild(row);

  const reason = document.createElement('textarea');
  reason.rows = 2;
  reason.placeholder = 'اكتب سبب عدم المطابقة...';
  reason.value = state.status === 'noncompliant' ? state.reason : '';
  reason.disabled = state.status !== 'noncompliant';
  reason.style.cssText = [
    'width:360px','max-width:100%','min-height:64px','resize:vertical',
    'padding:9px 11px','border:1px solid #cbd5e1','border-radius:9px','font-size:12px',
    'font-family:inherit','direction:rtl','outline:none',
    reason.disabled ? 'background:#f1f5f9;color:#94a3b8;cursor:not-allowed' : 'background:#fff;color:#0f172a;cursor:text'
  ].join(';');
  reason.addEventListener('input', () => {
    const current = states.get(key) || { status: 'noncompliant' as const, reason: '' };
    states.set(key, { status: current.status, reason: reason.value });
  });
  panel.appendChild(reason);

  root.appendChild(panel);
};

const scan = () => {
  scheduled = false;
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h4')).filter(h =>
    (h.textContent || '').trim().startsWith('مكونات عجنة:')
  );

  headings.forEach(heading => {
    const card = findRecipeCard(heading);
    if (card) renderControls(card, getKey(heading));
  });
};

const scheduleScan = () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(scan);
};

export const installIpcComplianceControls = () => {
  if (observer) return;
  observer = new MutationObserver(scheduleScan);
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  scheduleScan();
};

// Force a fresh Git integration deployment for the latest IPC UI changes.
