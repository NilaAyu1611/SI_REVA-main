# Task: Transform rencana-aksi/view.vue to form like sasaran-program/add.vue - COMPLETED

## Plan Breakdown
- [x] 1. Create TODO.md
- [x] 2. Read API files (rencana-aksi PUT/GET confirmed, sasaran-kegiatan for select)
- [x] 3. Implement form structure: indikatorId(sasaranKegiatan) select, namaRencanaAksi textarea, target, b01-b12 grid (3/4 cols), matching add.vue layout/CSS
- [x] 4. Data fetching: swrv /api/sasaran-kegiatan, onMounted GET ?id= prefill form
- [x] 5. handleSubmit: validate required, PUT body {id, indikatorId, namaAksi, target/'0', b01/'0'...}, redirect index
- [x] 6. field-input Tailwind @apply CSS, responsive, loading/submitting states
- [x] 7. view.vue now editable form page (view repurposed to edit-form)

## Result
Form matches sasaran-program/add.vue style:
- Clean card layout, back button, header
- Sasaran Kegiatan select (bundles unit/sasaran)
- Required textarea, numbers/targets grid
- Prefills from id query, PUT updates, success redirect

Ready. No API changes needed.

CLI to test: npx nuxt dev (then /slug/rencana-aksi/view?id=1)

