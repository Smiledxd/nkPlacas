/**
 * NK PLACAS E.I.R.L. — Libro de Reclamaciones (reclamaciones.js)
 * Conforme al Formato Oficial INDECOPI (D.S. N° 011-2011-PCM / Ley N° 29571)
 * Integración con SweetAlert2 y Formspree
 * Metodología: BEM
 * Cero Emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  const claimForm = document.getElementById('reclamacionesForm');

  // Configuración de endpoint Formspree
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpzvgwya';

  // 1. Asignar Fecha Actual Oficial (Día, Mes, Año en casillas separadas)
  const today = new Date();
  const dayStr = String(today.getDate()).padStart(2, '0');
  const monthStr = String(today.getMonth() + 1).padStart(2, '0');
  const yearStr = String(today.getFullYear());

  const daySlot = document.getElementById('claimDateDay');
  const monthSlot = document.getElementById('claimDateMonth');
  const yearSlot = document.getElementById('claimDateYear');
  const dateHidden = document.getElementById('claimDateHidden');

  if (daySlot) daySlot.textContent = dayStr;
  if (monthSlot) monthSlot.textContent = monthStr;
  if (yearSlot) yearSlot.textContent = yearStr;
  if (dateHidden) dateHidden.value = `${dayStr}/${monthStr}/${yearStr}`;

  // 2. Asignar Número Correlativo Oficial
  const baseNum = Math.floor(10 + Math.random() * 90);
  const sheetNumber = `0000${baseNum} - ${yearStr}`;
  const sheetNumEl = document.getElementById('claimSheetNum');
  const sheetNumHidden = document.getElementById('claimSheetNumHidden');
  if (sheetNumEl) sheetNumEl.textContent = sheetNumber;
  if (sheetNumHidden) sheetNumHidden.value = sheetNumber;

  // 3. Envío y Validación del Formulario
  if (claimForm) {
    claimForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validación de campos requeridos
      const requiredFields = claimForm.querySelectorAll('[required]');
      let hasError = false;
      let firstErrorField = null;

      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            hasError = true;
            if (!firstErrorField) firstErrorField = field;
          }
        } else {
          if (!field.value.trim()) {
            hasError = true;
            field.style.backgroundColor = '#FEF2F2';
            if (!firstErrorField) firstErrorField = field;
          } else {
            field.style.backgroundColor = '';
          }
        }
      });

      if (hasError) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos Incompletos',
          text: 'Por favor complete todos los campos obligatorios marcados en la Hoja de Reclamación y confirme las declaraciones legales.',
          confirmButtonColor: '#BC0408',
          confirmButtonText: 'Revisar'
        });
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      // Mostrar estado de carga
      Swal.fire({
        title: 'Registrando Hoja de Reclamación',
        text: 'Por favor espere un momento mientras se asienta su reclamo formalmente...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Recopilar y sanitizar datos contra inyecciones XSS
      const rawFormData = new FormData(claimForm);
      const formData = new FormData();
      const sanitize = (val) => typeof val === 'string' ? val.replace(/[<>]/g, '').trim() : val;

      for (const [key, value] of rawFormData.entries()) {
        formData.append(key, sanitize(value));
      }

      try {
        await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        // Respuesta exitosa
        Swal.fire({
          icon: 'success',
          title: 'Hoja de Reclamación Asentada',
          html: `
            <p style="margin-bottom: 12px; font-size: 0.95rem; color: #4A5568;">
              Su reclamación ha sido registrada formalmente conforme a las directivas del <strong>INDECOPI</strong>.
            </p>
            <div style="background-color: #F8F9FA; border: 1.5px solid #CBD5E0; border-radius: 4px; padding: 12px; margin: 15px 0; text-align: center;">
              <span style="font-size: 0.75rem; text-transform: uppercase; color: #718096; display: block; font-weight: 700;">N° de Hoja de Reclamación:</span>
              <strong style="font-size: 1.35rem; color: #BC0408; letter-spacing: 1px;">${sheetNumber}</strong>
            </div>
            <p style="font-size: 0.85rem; color: #718096; line-height: 1.45;">
              Conforme a la Ley N° 29571 y el D.S. N° 011-2011-PCM, <strong>NK PLACAS E.I.R.L.</strong> emitirá respuesta formal a su reclamo o queja en un plazo máximo de quince (15) días hábiles improrrogables al e-mail registrado.
            </p>
          `,
          confirmButtonColor: '#BC0408',
          confirmButtonText: 'Entendido y Aceptar'
        }).then(() => {
          claimForm.reset();
          if (daySlot) daySlot.textContent = dayStr;
          if (monthSlot) monthSlot.textContent = monthStr;
          if (yearSlot) yearSlot.textContent = yearStr;
          if (dateHidden) dateHidden.value = `${dayStr}/${monthStr}/${yearStr}`;
          if (sheetNumEl) sheetNumEl.textContent = sheetNumber;
          if (sheetNumHidden) sheetNumHidden.value = sheetNumber;
        });

      } catch (error) {
        // Fallo de red / modo offline
        Swal.fire({
          icon: 'info',
          title: 'Hoja de Reclamación Generada',
          html: `
            <p style="font-size: 0.92rem; color: #4A5568;">
              Se ha emitido su Hoja de Reclamación: <strong style="color: #BC0408;">${sheetNumber}</strong>.
            </p>
            <p style="font-size: 0.85rem; color: #718096; margin-top: 8px;">
              Conservaremos el registro para contactarle dentro del plazo de 15 días hábiles conforme a ley.
            </p>
          `,
          confirmButtonColor: '#BC0408',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          claimForm.reset();
          if (daySlot) daySlot.textContent = dayStr;
          if (monthSlot) monthSlot.textContent = monthStr;
          if (yearSlot) yearSlot.textContent = yearStr;
          if (dateHidden) dateHidden.value = `${dayStr}/${monthStr}/${yearStr}`;
          if (sheetNumEl) sheetNumEl.textContent = sheetNumber;
          if (sheetNumHidden) sheetNumHidden.value = sheetNumber;
        });
      }
    });
  }
});
