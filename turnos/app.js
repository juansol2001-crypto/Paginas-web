// Me Encargo · Turnos — configuración y utilidades compartidas
window.ME = (function () {
  const SB_URL = 'https://bjuvyrugqfwmvhileqrn.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdXZ5cnVncWZ3bXZoaWxlcXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0ODMzMTYsImV4cCI6MjExMDA1OTMxNn0.SMNAV6xR1mvO3tMxZZ7545THOldRYNLGOeQ1_JAuQhA';
  const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, storageKey: 'me-turnos' } });
  const TZ_DEF = 'America/Argentina/Buenos_Aires';

  const money = n => n == null ? '' : '$' + Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Partes de una fecha en la zona del negocio
  function parts(d, tz) {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz || TZ_DEF, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' }).formatToParts(new Date(d));
    const o = {}; p.forEach(x => o[x.type] = x.value);
    return { ymd: `${o.year}-${o.month}-${o.day}`, hm: `${o.hour === '24' ? '00' : o.hour}:${o.minute}`, h: +o.hour % 24, m: +o.minute };
  }
  const hora = (d, tz) => parts(d, tz).hm;
  const ymd = (d, tz) => parts(d, tz).ymd;
  const hoyYMD = tz => ymd(new Date(), tz);
  function addDays(ymdStr, n) { const d = new Date(ymdStr + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function fechaLarga(ymdStr) {
    const d = new Date(ymdStr + 'T12:00:00Z');
    const s = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const diaSemana = ymdStr => new Date(ymdStr + 'T12:00:00Z').getUTCDay();
  // "2026-11-13" + "10:30" en la zona del negocio -> Date (UTC)
  function zoned(ymdStr, hm, tz) {
    const guess = new Date(`${ymdStr}T${hm}:00Z`);
    const p = parts(guess, tz);
    const asUTC = Date.UTC(+p.ymd.slice(0, 4), +p.ymd.slice(5, 7) - 1, +p.ymd.slice(8, 10), p.h, p.m);
    return new Date(guess.getTime() - (asUTC - guess.getTime()));
  }
  function err(e) {
    const m = (e && (e.message || e.error_description)) || String(e);
    if (/turnos_sin_superposicion|exclusion/i.test(m)) return 'Ese profesional ya tiene un turno en ese horario.';
    if (/Invalid login/i.test(m)) return 'Mail o contraseña incorrectos.';
    return m;
  }
  function toast(msg, kind) {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg;
    box.appendChild(t); setTimeout(() => t.classList.add('out'), 4200); setTimeout(() => t.remove(), 4700);
  }
  function gcal(titulo, ini, fin, lugar) {
    const f = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(titulo) +
      '&dates=' + f(ini) + '/' + f(fin) + '&location=' + encodeURIComponent(lugar || '');
  }
  return { sb, money, esc, parts, hora, ymd, hoyYMD, addDays, fechaLarga, diaSemana, zoned, err, toast, gcal, TZ_DEF };
})();
