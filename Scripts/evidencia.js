document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxt8tSUWIcx0K4FXke7H4ExPYpSMfGW3EvSbHKoYwmJcpesecVpzRWMMgU3sIw-YKLSyQ/exec';

    const form = document.getElementById('formularioEvidencia');
    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const cuatrimestreInput = document.getElementById('cuatrimestre');
    const matriculaInput = document.getElementById('matricula');
    const carreraInput = document.getElementById('carrera');
    const evidenciaInput = document.getElementById('evidencia');

    const dropArea = document.getElementById('dropArea');
    const filePlaceholder = document.getElementById('filePlaceholder');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImgBtn = document.getElementById('removeImgBtn');
    const successBanner = document.getElementById('successBanner');

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,})*$/;
    const regexApellidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,})+$/;
    const regexCuatrimestre = /^(1[0-2]|[1-9])[A-Z]{2,6}\s*-\s*G\d{1,2}$/;
    const regexMatricula = /^\d{8}$/;
    const regexCarrera = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü./\s-]{4,80}$/;

    function setError(input, message) {
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.error-msg');
        group.classList.remove('valid');
        group.classList.add('invalid');
        if (errorEl) errorEl.textContent = message;
    }

    function setValid(input) {
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.error-msg');
        group.classList.remove('invalid');
        group.classList.add('valid');
        if (errorEl) errorEl.textContent = '';
    }

    function validarNombre() {
        const valor = nombreInput.value.trim().replace(/\s+/g, ' ');
        if (!valor) {
            setError(nombreInput, 'Ingresa tu(s) nombre(s).');
            return false;
        }
        if (!regexNombre.test(valor)) {
            setError(nombreInput, 'Escribe un nombre válido (solo letras, mínimo 2 caracteres).');
            return false;
        }
        setValid(nombreInput);
        return true;
    }

    function validarApellidos() {
        const valor = apellidosInput.value.trim().replace(/\s+/g, ' ');
        if (!valor) {
            setError(apellidosInput, 'Ingresa tus apellidos.');
            return false;
        }
        if (!regexApellidos.test(valor)) {
            setError(apellidosInput, 'Escribe ambos apellidos separados por espacio (solo letras).');
            return false;
        }
        setValid(apellidosInput);
        return true;
    }

    function validarCuatrimestre() {
        cuatrimestreInput.value = cuatrimestreInput.value.toUpperCase();
        const valor = cuatrimestreInput.value.trim();
        if (!valor) {
            setError(cuatrimestreInput, 'Ingresa tu cuatrimestre y grupo.');
            return false;
        }
        if (!regexCuatrimestre.test(valor)) {
            setError(cuatrimestreInput, 'Formato inválido. Ejemplo: 1DSM - G1');
            return false;
        }
        setValid(cuatrimestreInput);
        return true;
    }

    function validarMatricula() {
        matriculaInput.value = matriculaInput.value.replace(/\D/g, '');
        const valor = matriculaInput.value;
        if (!valor) {
            setError(matriculaInput, 'La matrícula es obligatoria.');
            return false;
        }
        if (!regexMatricula.test(valor)) {
            setError(matriculaInput, `Debe tener exactamente 8 números (llevas ${valor.length}).`);
            return false;
        }
        setValid(matriculaInput);
        return true;
    }

    function validarCarrera() {
        const valor = carreraInput.value.trim().replace(/\s+/g, ' ');
        if (!valor) {
            setError(carreraInput, 'Escribe el nombre de tu carrera.');
            return false;
        }
        if (!regexCarrera.test(valor)) {
            setError(carreraInput, 'Ingresa un nombre de carrera válido (mínimo 4 letras, sin números).');
            return false;
        }
        setValid(carreraInput);
        return true;
    }

    function validarEvidencia() {
        const archivo = evidenciaInput.files[0];
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
        const maxBytes = 5 * 1024 * 1024; 

        if (!archivo) {
            setError(evidenciaInput, 'Adjunta una fotografía de evidencia.');
            return false;
        }
        if (!tiposPermitidos.includes(archivo.type)) {
            setError(evidenciaInput, 'Formato no válido. Usa JPG, PNG o WEBP.');
            limpiarVistaPrevia();
            return false;
        }
        if (archivo.size > maxBytes) {
            setError(evidenciaInput, 'La foto pesa más de 5 MB.');
            limpiarVistaPrevia();
            return false;
        }

        setValid(evidenciaInput);
        mostrarVistaPrevia(archivo);
        return true;
    }

    function mostrarVistaPrevia(archivo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            filePlaceholder.hidden = true;
            previewContainer.hidden = false;
        };
        reader.readAsDataURL(archivo);
    }

    function limpiarVistaPrevia() {
        evidenciaInput.value = '';
        imagePreview.src = '';
        previewContainer.hidden = true;
        filePlaceholder.hidden = false;
    }

    function convertirABase64(archivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    }

    function formatearTexto(texto) {
        return texto
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (letra) => letra.toUpperCase());
    }

    nombreInput.addEventListener('input', validarNombre);
    apellidosInput.addEventListener('input', validarApellidos);
    cuatrimestreInput.addEventListener('input', validarCuatrimestre);
    matriculaInput.addEventListener('input', validarMatricula);
    carreraInput.addEventListener('input', validarCarrera);
    evidenciaInput.addEventListener('change', validarEvidencia);

    removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        limpiarVistaPrevia();
        setError(evidenciaInput, 'Selecciona una nueva fotografía.');
    });

    ['dragenter', 'dragover'].forEach(evt => {
        dropArea.addEventListener(evt, (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropArea.addEventListener(evt, () => {
            dropArea.classList.remove('dragover');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        successBanner.hidden = true;

        const esValido = [
            validarNombre(),
            validarApellidos(),
            validarCuatrimestre(),
            validarMatricula(),
            validarCarrera(),
            validarEvidencia()
        ].every(Boolean);

        if (!esValido) return;

        const btnSubmit = form.querySelector('.btn-submit');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo evidencia...';

        try {
            const archivo = evidenciaInput.files[0];
            const imagenBase64 = await convertirABase64(archivo);
            const extension = archivo.name.split('.').pop();

            const nombreLimpio = formatearTexto(nombreInput.value);
            const apellidosLimpios = formatearTexto(apellidosInput.value);
            const carreraLimpia = carreraInput.value.trim().replace(/\s+/g, ' ');

            const payload = {
                nombre: `${nombreLimpio} ${apellidosLimpios}`,
                cuatrimestre: cuatrimestreInput.value.trim(),
                matricula: matriculaInput.value.trim(),
                carrera: carreraLimpia,
                imagenBase64: imagenBase64,
                mimeType: archivo.type,
                extension: extension
            };

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            successBanner.hidden = false;
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            form.reset();
            limpiarVistaPrevia();
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('valid'));

        } catch (error) {
            alert('No se pudo enviar la evidencia. Revisa tu conexión e inténtalo de nuevo.');
            console.error(error);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = textoOriginal;
        }
    });
});