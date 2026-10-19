"use strict";
(function () {
  const E = globalThis.FIAPEngine, R = globalThis.FIAPRender, curriculum = globalThis.FIAPCurriculum;
  const get = id => document.getElementById(id);
  const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let semester, bank, state, storageKey, tabs = [], persistent = true, selectedAttempt = 0;
  let printing = false, lastActivity = performance.now(), lastTick = lastActivity, printedDetails = [];
  const selections = new Map();
  function notice(text) { get('study-notice').textContent = text; get('study-notice').hidden = !text; }
  function storageNotice() {
    get('storage-warning').hidden = persistent;
    get('storage-warning').textContent = 'O navegador não permitiu salvar seu progresso. Você pode continuar nesta sessão; respostas e leituras podem ser perdidas ao fechar a página.';
  }
  function readLatest() {
    if (!persistent) return;
    try {
      const incoming = E.restore(localStorage.getItem(storageKey), bank);
      if (incoming.updatedAt > state.updatedAt) { incoming.activeTab = state.activeTab; state = incoming; }
    } catch { persistent = false; storageNotice(); }
  }
  function mutate(change) {
    readLatest();
    const result = change(state);
    state.updatedAt = Math.max(Date.now(), state.updatedAt + 1);
    if (persistent) try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { persistent = false; storageNotice(); }
    return result;
  }
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    get('theme-toggle').textContent = state.theme === 'dark' ? 'Tema claro' : 'Tema escuro';
    get('theme-toggle').setAttribute('aria-pressed', String(state.theme === 'light'));
    document.querySelector('meta[name="theme-color"]').content = state.theme === 'dark' ? '#131516' : '#f5f5f5';
  }
  const compact = matchMedia('(max-width:760px)');
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  let drawerOpen = false, drawerReturn = null, pageInert = [];
  // Gaveta aberta no celular é modal: o resto da página fica inerte, menos o fundo, que fecha a gaveta ao clicar.
  function setPageInert(on) {
    pageInert.forEach(node => { node.inert = false; });
    pageInert = [];
    if (!on) return;
    const aside = get('library-sidebar'), backdrop = get('sidebar-backdrop');
    for (let node = aside; node.parentElement && node !== document.body; node = node.parentElement)
      for (const sibling of node.parentElement.children)
        if (sibling !== node && !sibling.contains(backdrop) && !sibling.inert && sibling.tagName !== 'SCRIPT') { sibling.inert = true; pageInert.push(sibling); }
  }
  function applySidebar() {
    const layout = document.querySelector('.library-layout'), aside = get('library-sidebar'), toggle = get('sidebar-toggle');
    const collapsed = state.sidebar === 'collapsed';
    const visible = compact.matches ? drawerOpen : !collapsed, modal = compact.matches && drawerOpen;
    layout.dataset.sidebar = collapsed ? 'collapsed' : 'expanded';
    document.documentElement.classList.toggle('drawer-open', modal);
    setPageInert(modal);
    if (modal) { aside.setAttribute('role', 'dialog'); aside.setAttribute('aria-modal', 'true'); }
    else { aside.removeAttribute('role'); aside.removeAttribute('aria-modal'); }
    // Menu some com o foco dentro: o foco vai para o botão que o reabre, nunca para o <body>.
    if (!visible && aside.contains(document.activeElement)) toggle.focus({preventScroll:true});
    aside.inert = !visible;
    toggle.setAttribute('aria-expanded', String(visible));
    get('sidebar-close').setAttribute('aria-expanded', String(visible));
    get('sidebar-toggle-label').textContent = compact.matches ? (drawerOpen ? 'Fechar assuntos' : 'Assuntos') : collapsed ? 'Mostrar menu' : 'Ocultar menu';
    get('sidebar-shortcut').textContent = isMac ? '⌘ B' : 'Ctrl B';
  }
  function setDrawer(open, {restoreFocus=true}={}) {
    if (open === drawerOpen) return;
    drawerOpen = open;
    if (open) drawerReturn = document.activeElement;
    applySidebar();
    if (open) (get('course-tree').querySelector('[aria-current="page"]') || get('sidebar-close')).focus({preventScroll:true});
    else if (restoreFocus) (drawerReturn?.isConnected && drawerReturn !== document.body ? drawerReturn : get('sidebar-toggle')).focus({preventScroll:true});
  }
  function toggleSidebar() {
    if (compact.matches) { setDrawer(!drawerOpen); return; }
    mutate(current => { current.sidebar = current.sidebar === 'collapsed' ? 'expanded' : 'collapsed'; });
    applySidebar();
  }
  function questionsFor(quiz) {
    if (quiz.setId.startsWith('mini-')) return bank.minis[quiz.setId.slice(5)];
    if (quiz.setId.startsWith('chapter-')) return bank.chapters[quiz.setId.slice(8)];
    return bank.finals.find(set => set.id === quiz.setId)?.questions || [];
  }
  function quizFor(kind, reference) { return kind === 'mini' ? state.minis[reference] : kind === 'chapter' ? state.practices[reference] : state.attempts[Number(reference)]; }
  function quizMarkup(quiz, key, kind, reference) { return R.form(quiz, questionsFor(quiz), key, kind, reference) + R.feedback(quiz, questionsFor(quiz), E, key, { sources: semester.sources, phases: semester.phases }); }
  function renderMini(phase) {
    const quiz = state.minis[phase];
    get(`mini-quiz-${phase}`).innerHTML = quiz ? quizMarkup(quiz, `mini-${phase}`, 'mini', phase) : '';
    document.querySelector(`[data-mini-reset="${phase}"]`).hidden = !quiz?.submitted;
  }
  function renderPractice(key) {
    const quiz = state.practices[key], questions = bank.chapters[key];
    const button = document.querySelector(`[data-practice="${key}"]`);
    const description = document.querySelector(`[data-practice-description="${key}"]`);
    description.textContent = questions.length ? `${questions.length} questões comentadas. Responda todas antes de consultar as explicações. Você pode refazer quando quiser.` : 'Este capítulo contextualiza o projeto. Pratique os conceitos nos demais capítulos da fase.';
    button.hidden = !questions.length || (quiz && !quiz.submitted);
    button.textContent = quiz?.submitted ? 'Refazer a prática deste capítulo' : 'Praticar este capítulo';
    get(`practice-${key}`).innerHTML = quiz ? quizMarkup(quiz, key, 'chapter', key) : '';
  }
  function updateProgress() {
    const total = semester.phases.reduce((sum, p) => sum + p.chapters.length, 0);
    get('reading-summary').textContent = `${Object.values(state.readChapters).filter(Boolean).length} de ${total} leituras marcadas`;
    document.querySelectorAll('[data-read]').forEach(input => { input.checked = state.readChapters[input.dataset.read] === true; });
    document.querySelectorAll('[data-read-status]').forEach(node => { node.textContent = state.readChapters[node.dataset.readStatus] ? 'Leitura marcada' : 'Não marcado como lido'; });
    document.querySelectorAll('[data-check]').forEach(input => { input.checked = state.checks[input.dataset.check] === true; });
    document.querySelectorAll('[data-tree-key]').forEach(node => { node.classList.toggle('is-read', state.readChapters[node.dataset.treeKey] === true); });
    updateRoadmap();
  }
  function isReviewVisible() {
    if (!semester.phases.length || !state.activeTab.startsWith('phase-')) return false;
    const lesson = get(`panel-${state.activeTab}`)?.querySelector('.lesson:not([hidden])');
    if (!lesson) return false;
    const rect = lesson.getBoundingClientRect(), practice = lesson.querySelector('.chapter-practice').getBoundingClientRect();
    const top = document.querySelector('.site-header').getBoundingClientRect().bottom;
    return rect.top < innerHeight && practice.top > top && rect.bottom > top;
  }
  function updateTimes() {
    if (!semester.phases.length) return;
    const paused = document.hidden || !document.hasFocus() || !isReviewVisible() || performance.now() - lastActivity >= E.IDLE_MS || printing;
    for (const phase of semester.phases) {
      document.querySelector(`[data-time="${phase.id}"]`).textContent = R.clock(state.studyMs[phase.id - 1]);
      document.querySelector(`[data-time-status="${phase.id}"]`).textContent = state.activeTab !== `phase-${phase.id}` ? 'Tempo acumulado.' : paused ? 'Contagem pausada.' : 'Contando enquanto você revisa.';
    }
    const open = E.unlocked(state, bank);
    get('final-tab-state').textContent = open ? `${state.attempts.length}/${E.MAX_ATTEMPTS} tentativas` : 'Após a revisão';
    get('exam-gate').hidden = open;
    get('final-ready').hidden = !open || state.attempts.length > 0;
    for (const id of semester.reviewPhases) {
      const value = Math.min(state.studyMs[id - 1], E.REQUIRED_MS);
      get(`gate-${id}`).value = value;
      get(`gate-label-${id}`).textContent = `Fase ${id}: ${R.clock(value)} / 10:00`;
    }
  }
  function renderFinal() {
    if (!semester.phases.length) return;
    updateTimes();
    const visible = E.unlocked(state, bank), history = get('attempt-history');
    history.hidden = !visible;
    history.innerHTML = state.attempts.length ? '<h3>Suas tentativas</h3><div>' + state.attempts.map((quiz,index) => `<button type="button" class="text-button" data-attempt="${index}" aria-pressed="${index===selectedAttempt}">Tentativa ${index+1} · ${quiz.submitted ? E.grade(quiz, questionsFor(quiz)).correct+'/10' : 'em andamento'}</button>`).join('') + '</div>' : '';
    const quiz = state.attempts[selectedAttempt];
    get('final-quiz').hidden = !visible;
    get('final-quiz').innerHTML = quiz && visible ? quizMarkup(quiz, `final-${selectedAttempt}`, 'final', selectedAttempt) : '';
    get('next-attempt').hidden = !visible || !state.attempts.at(-1)?.submitted;
    const limit = state.attempts.length >= E.MAX_ATTEMPTS;
    get('new-attempt').disabled = limit;
    get('new-attempt').textContent = limit ? 'Três tentativas concluídas' : `Iniciar tentativa ${state.attempts.length+1} de 3`;
    get('attempt-limit').textContent = limit ? 'Seus resultados continuam disponíveis. Retome os capítulos ou refaça as práticas.' : 'A próxima versão tem dez enunciados diferentes das outras versões finais. O histórico será preservado.';
  }
  function tick() {
    if (!state) return;
    const now = performance.now(), delta = now-lastTick, idleFor = Math.max(0,lastTick-lastActivity);
    lastTick = now;
    const phase = state.activeTab.startsWith('phase-') ? Number(state.activeTab.slice(6)) : 0;
    const open = E.unlocked(state, bank);
    if (phase && !printing && isReviewVisible() && !document.hidden && document.hasFocus() && idleFor<E.IDLE_MS && delta>0 && delta<=5000) {
      mutate(current => E.creditStudy(current,phase,delta,{visible:true, focused:true, idleFor}));
    }
    updateTimes();
    if (!open && E.unlocked(state,bank)) { notice('Tempo de revisão concluído. O simulado final está disponível. Revise também as outras fases.'); renderFinal(); }
  }
  function route(phase, chapter) {
    const hash = new URLSearchParams({semestre:semester.id, fase:String(phase), capitulo:String(chapter)});
    try { history.replaceState(null,'', '#'+hash); } catch { /* File browsers may restrict history updates. */ }
  }
  function scrollToStudy(target) {
    const node = target || get('estudo');
    node.scrollIntoView({block:'start', behavior:'instant'});
  }
  function activateTab(tab, {scroll=true, focus=false}={}) {
    if (!tabs.some(button=>button.dataset.tab===tab)) return;
    tick(); mutate(current=>{current.activeTab=tab;});
    tabs.forEach(button=>{const active=button.dataset.tab===tab; button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1; get(`panel-${button.dataset.tab}`).hidden=!active;});
    notice('');
    if (tab==='final') { renderFinal(); get('breadcrumbs').textContent=semester.title+' / Simulado final'; route('final','overview'); }
    else {
      const phase=Number(tab.slice(6));
      const selection=selections.get(phase)||{chapter:'overview',subject:'all'};
      showChapter(phase,selection.chapter,selection.subject,false);
    }
    if(focus)get(`tab-${tab}`).focus();
    if(scroll)scrollToStudy(get(`panel-${tab}`));
    lastActivity=performance.now(); updateTimes();
  }
  function showChapter(phaseId, value='overview', subjectId='all', focus=true) {
    const phase=semester.phases.find(p=>p.id===Number(phaseId));
    if(!phase)return;
    const subject=phase.subjects.find(s=>s.id===subjectId);
    const chapter=phase.chapters.find(ch=>String(ch.number)===String(value));
    const selected=chapter?String(chapter.number):value==='mini'?'mini':'overview';
    const actualSubject=chapter?chapter.subjectId:(subject?.id||'all');
    selections.set(phase.id,{chapter:selected,subject:actualSubject});
    const panel=get(`panel-phase-${phase.id}`);
    const subjectSelect=panel.querySelector('[data-subject-filter]'), chapterSelect=panel.querySelector('[data-chapter-filter]');
    subjectSelect.value=actualSubject;
    const options=actualSubject==='all'?phase.subjects.flatMap(s=>s.chapters):phase.subjects.find(s=>s.id===actualSubject).chapters;
    chapterSelect.innerHTML='<option value="overview">Visão geral do assunto</option>'+options.map(ch=>`<option value="${ch.number}">${ch.number}. ${R.escape(ch.title)}</option>`).join('')+'<option value="mini">Mini simulado da fase</option>';
    chapterSelect.value=selected;
    panel.querySelector('[data-overview]').hidden=selected!=='overview';
    panel.querySelectorAll('.chapter-row').forEach(row=>{row.hidden=actualSubject!=='all'&&row.dataset.subject!==actualSubject;});
    panel.querySelectorAll('.lesson').forEach(lesson=>{lesson.hidden=lesson.dataset.chapter!==selected;if(!lesson.hidden){globalThis.FIAPMath?.renderIn(lesson);globalThis.FIAPMaps?.enhance(lesson);mountLabs(lesson);}});
    get(`mini-${phase.id}`).hidden=selected!=='mini';
    if(selected==='mini') { if(!state.minis[phase.id])mutate(current=>E.startMini(current,phase.id,bank)); renderMini(phase.id); }
    document.querySelectorAll('[data-open-chapter]').forEach(link=>{
      const active=Number(link.dataset.openPhase)===phase.id&&link.dataset.openChapter===selected;
      if(active)link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    const treePhase=document.querySelector(`[data-tree-phase="${phase.id}"]`);
    if(treePhase)treePhase.open=true;
    if(chapter) {
      const link=document.querySelector(`[data-tree-key="p${phase.id}-c${chapter.number}"]`);
      if(link)link.closest('details').open=true;
    }
    get('breadcrumbs').textContent=[semester.title,`Fase ${phase.id}`,subjectSelect.selectedOptions[0].textContent,chapter?`Capítulo ${chapter.number}`:selected==='mini'?'Prática':'Visão geral'].join(' / ');
    route(phase.id,selected);
    if(focus) {
      const heading=chapter?get(`heading-${phase.id}-${chapter.number}`):selected==='mini'?get(`mini-title-${phase.id}`):panel;
      heading.focus({preventScroll:true}); scrollToStudy(chapter?heading.closest('article'):heading);
    }
    updateTimes();
  }
  function openChapter(phase,chapter,excerpt) {
    selections.set(Number(phase),{chapter:String(chapter),subject:'all'});
    activateTab(`phase-${phase}`,{scroll:false}); showChapter(Number(phase),String(chapter),'all',true);
    get('study-search').value=''; get('search-results').hidden=true;
    setDrawer(false,{restoreFocus:false});
    const target=excerpt&&get(excerpt);
    if(target){
      const details=target.closest('details');if(details)details.open=true;
      target.tabIndex=-1;target.focus({preventScroll:true});scrollToStudy(target);
      globalThis.FIAPMotion?.flash(target);
    }
  }
  function mountLabs(root) {
    const labs = { bases: globalThis.FIAPBases, surface: globalThis.FIAPSurface };
    for (const element of root.querySelectorAll('.lab[data-lab]:not([data-mounted])')) {
      const lab = labs[element.dataset.lab];
      if (lab?.mount) { element.dataset.mounted = 'true'; lab.mount(element); }
    }
  }
  function roadmapStatus() {
    const status = {};
    for (const key of bank.chapterIds || []) {
      const quiz = state.practices[key];
      status[key] = { read: state.readChapters[key] === true, score: quiz?.submitted ? E.grade(quiz, bank.chapters[key]).score : null };
    }
    return status;
  }
  function renderRoadmap() {
    get('roadmap').innerHTML = R.roadmap(semester, roadmapStatus());
    globalThis.FIAPMaps?.drawRoadmap(get('semester-map'));
  }
  function updateRoadmap() {
    const status = roadmapStatus();
    document.querySelectorAll('#roadmap [data-node]').forEach(node => {
      const [phase, chapter] = node.dataset.node.split('-'), entry = status[`p${phase}-c${chapter}`] || {};
      node.classList.toggle('is-read', entry.read === true);
      node.querySelector('.rm-state').textContent = R.roadmapState(entry);
    });
  }
  function renderTree() {
    get('course-tree').innerHTML=`<p class="tree-semester">${R.escape(semester.title)}</p>`+semester.phases.map(p=>`<details data-tree-phase="${p.id}" ${p.id===Number(state.activeTab.slice(6))?'open':''}><summary>Fase ${p.id} · ${R.escape(p.shortTitle)}</summary>${p.subjects.map(s=>`<details class="tree-subject"><summary>${R.escape(s.title)}</summary>${s.chapters.map(ch=>`<a href="#phase-${p.id}-chapter-${ch.number}" data-open-phase="${p.id}" data-open-chapter="${ch.number}" data-tree-key="p${p.id}-c${ch.number}"><span>${String(ch.number).padStart(2,'0')}</span>${R.escape(ch.title)}</a>`).join('')}</details>`).join('')}</details>`).join('');
  }
  function selectSemester(id, prefs={}) {
    semester=curriculum.semesters.find(s=>s.id===id)||curriculum.semesters[0];bank=semester.bank;storageKey=E.storageKey(semester.id);selections.clear();persistent=true;
    let raw=null;
    try { raw=localStorage.getItem(storageKey);if(raw===null&&semester.id==='semestre-1')raw=localStorage.getItem(E.LEGACY_STORAGE_KEY); } catch { persistent=false; }
    state=E.restore(raw,bank);if(prefs.theme)state.theme=prefs.theme;if(prefs.sidebar)state.sidebar=prefs.sidebar;applySidebar();
    selectedAttempt=Math.max(0,state.attempts.length-1);get('semester-select').value=semester.id;
    get('semester-empty').hidden=semester.status==='available';get('semester-content').hidden=semester.status!=='available';
    get('study-search').value='';get('search-results').hidden=true;applyTheme();storageNotice();
    get('source-catalog').innerHTML=semester.sources.length?semester.phases.map(p=>`<h3>Fase ${p.id}</h3><ol>${semester.sources.filter(s=>s.phase===p.id).map(s=>`<li>${R.escape(s.file)} <small>(${s.pages} páginas)</small></li>`).join('')}</ol>`).join(''):'Nenhum PDF catalogado neste semestre.';
    if(!semester.phases.length){route('','');return;}
    get('phase-panels').innerHTML=semester.phases.map(p=>R.phase(p,{sources:semester.sources})).join('');
    get('phase-tabs').innerHTML=semester.phases.map(p=>`<button id="tab-phase-${p.id}" role="tab" aria-controls="panel-phase-${p.id}" aria-selected="false" tabindex="-1" data-tab="phase-${p.id}" type="button">Fase ${p.id}<span>${R.escape(p.shortTitle)}</span></button>`).join('')+'<button id="tab-final" class="final-tab" role="tab" aria-controls="panel-final" aria-selected="false" tabindex="-1" data-tab="final" type="button">Simulado final<span id="final-tab-state">Após a revisão</span></button>';
    tabs=[...document.querySelectorAll('[data-tab]')];
    get('gate-progress').innerHTML=semester.reviewPhases.map(id=>`<div class="gate-phase"><label id="gate-label-${id}" for="gate-${id}"></label><progress id="gate-${id}" value="0" max="${E.REQUIRED_MS}"></progress></div>`).join('');
    const total=Object.values(bank.chapters).reduce((sum,list)=>sum+list.length,0);
    get('catalog-summary').textContent=`${semester.phases.length} fases · ${semester.phases.reduce((n,p)=>n+p.chapters.length,0)} capítulos · ${total} questões autorais`;
    renderTree();renderRoadmap();for(const key of bank.chapterIds)renderPractice(key);updateProgress();renderFinal();activateTab(state.activeTab,{scroll:false});
  }
  function search() {
    const query=get('study-search').value.trim(), target=get('search-results');
    target.hidden=!query;if(!query)return;
    const terms=normalized(query).split(/\s+/);
    const hits=semester.phases.flatMap(p=>p.chapters.map(ch=>({p,ch}))).filter(({p,ch})=>terms.every(term=>normalized(`${p.shortTitle} ${ch.title} ${ch.focus} ${ch.body} ${ch.extension||''}`).includes(term)));
    target.innerHTML=`<p>${hits.length} ${hits.length===1?'capítulo encontrado':'capítulos encontrados'} para “${R.escape(query)}”.</p>`+(hits.length?'<ul>'+hits.map(({p,ch})=>`<li><a href="#phase-${p.id}-chapter-${ch.number}" data-open-phase="${p.id}" data-open-chapter="${ch.number}"><strong>${R.escape(ch.title)}</strong><span>Fase ${p.id} · Capítulo ${ch.number} · ${R.escape(ch.focus)}</span></a></li>`).join('')+'</ul>':'<p>Tente outro termo ou uma palavra mais curta, como “derivada” ou “lista”.</p>')+'<button class="text-button" type="button" id="clear-search">Limpar busca</button>';
  }
  function beginFinal() {
    tick();try{mutate(current=>E.startFinal(current,bank));selectedAttempt=state.attempts.length-1;notice('');renderFinal();get(`form-final-${selectedAttempt}`).querySelector('input').focus();}
    catch(error){const messages={REVIEW_REQUIRED:'Continue a leitura das fases indicadas. As práticas dos capítulos já estão disponíveis.',ATTEMPT_LIMIT:'Você já concluiu as três tentativas. Consulte o histórico.',ATTEMPT_IN_PROGRESS:'Conclua a tentativa atual antes de iniciar outra.'};notice(messages[error.message]||'Não foi possível iniciar. Recarregue para recuperar o progresso salvo.');renderFinal();}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button)return;
    if(button.dataset.tab){activateTab(button.dataset.tab,{focus:true});return;}
    if(button.dataset.openPhase||button.dataset.reviewPhase){event.preventDefault();openChapter(Number(button.dataset.openPhase||button.dataset.reviewPhase),button.dataset.openChapter||button.dataset.reviewChapter,button.dataset.reviewExcerpt);return;}
    if(button.dataset.overviewLink){showChapter(Number(button.dataset.overviewLink),'overview','all');return;}
    if(button.dataset.openMini){showChapter(Number(button.dataset.openMini),'mini','all');return;}
    if(button.dataset.practice){const key=button.dataset.practice;mutate(current=>E.startPractice(current,key,bank));renderPractice(key);get(`form-${key}`).querySelector('input').focus();return;}
    if(button.dataset.miniReset){const phase=Number(button.dataset.miniReset);mutate(current=>E.startMini(current,phase,bank));renderMini(phase);get(`form-mini-${phase}`).querySelector('input').focus();return;}
    if(button.dataset.attempt!==undefined){selectedAttempt=Number(button.dataset.attempt);renderFinal();(get(`result-final-${selectedAttempt}`)||get(`form-final-${selectedAttempt}`)?.querySelector('input'))?.focus();return;}
    if(button.id==='clear-search'){get('study-search').value='';search();get('study-search').focus();}
  });
  document.addEventListener('keydown',event=>{
    const index=tabs.indexOf(event.target);if(index<0)return;let next;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
    if(next!==undefined){event.preventDefault();activateTab(tabs[next].dataset.tab,{focus:true});}
  });
  document.addEventListener('change',event=>{
    const input=event.target;
    if(input.id==='semester-select'){tick();selectSemester(input.value,{theme:state.theme,sidebar:state.sidebar});return;}
    if(input.dataset.subjectFilter){showChapter(Number(input.dataset.subjectFilter),'overview',input.value,false);return;}
    if(input.dataset.chapterFilter){showChapter(Number(input.dataset.chapterFilter),input.value,input.closest('.phase-panel').querySelector('[data-subject-filter]').value);return;}
    if(input.dataset.read){mutate(current=>{current.readChapters[input.dataset.read]=input.checked;});updateProgress();return;}
    if(input.dataset.check){mutate(current=>{current.checks[input.dataset.check]=input.checked;});return;}
    if(!input.matches('input[data-question]'))return;
    const form=input.closest('form[data-quiz]'),key=form.id.slice(5);
    mutate(()=>E.answer(quizFor(form.dataset.quiz,form.dataset.reference),input.dataset.question,Number(input.value)));
    const quiz=quizFor(form.dataset.quiz,form.dataset.reference);get(`count-${key}`).textContent=`${Object.keys(quiz.answers).length} de ${quiz.items.length} respondidas`;
    input.closest('fieldset').classList.remove('needs-answer');get(`status-${key}`).hidden=true;
  });
  document.addEventListener('submit',event=>{
    const form=event.target.closest('form[data-quiz]');if(!form)return;event.preventDefault();readLatest();
    const kind=form.dataset.quiz,reference=form.dataset.reference,key=form.id.slice(5),quiz=quizFor(kind,reference);
    if(!quiz)return;
    if(kind==='final'&&!E.unlocked(state,bank)){notice('Continue a revisão antes de enviar o simulado.');return;}
    const unanswered=quiz.items.filter(item=>!Object.prototype.hasOwnProperty.call(quiz.answers,item.id));
    if(unanswered.length){get(`status-${key}`).hidden=false;get(`status-${key}`).textContent=`Faltam ${unanswered.length} respostas. Complete todas para consultar a correção.`;unanswered.forEach(item=>get(`${key}-${item.id}`).classList.add('needs-answer'));get(`${key}-${unanswered[0].id}`).querySelector('input').focus();return;}
    mutate(()=>E.submit(quizFor(kind,reference)));
    if(kind==='mini')renderMini(reference);else if(kind==='chapter'){renderPractice(reference);updateRoadmap();}else{selectedAttempt=Number(reference);renderFinal();}
    get(`result-${key}`).focus();
  });
  get('study-search').addEventListener('input',search);
  const showFinal=()=>{if(!semester.phases.length)selectSemester(curriculum.semesters[0].id,{theme:state.theme,sidebar:state.sidebar});activateTab('final',{focus:true});};
  get('hero-exam').addEventListener('click',showFinal);get('header-exam').addEventListener('click',showFinal);
  get('return-review').addEventListener('click',()=>{const id=semester.reviewPhases.find(id=>state.studyMs[id-1]<E.REQUIRED_MS)||semester.phases[0].id;openChapter(id,semester.phases.find(p=>p.id===id).subjects[0].chapters[0].number);});
  get('back-semester').addEventListener('click',()=>selectSemester(curriculum.semesters[0].id,{theme:state.theme,sidebar:state.sidebar}));
  get('start-final').addEventListener('click',beginFinal);get('new-attempt').addEventListener('click',beginFinal);
  get('theme-toggle').addEventListener('click',()=>{mutate(current=>{current.theme=current.theme==='dark'?'light':'dark';});applyTheme();});
  get('print-guide').addEventListener('click',()=>window.print());
  window.addEventListener('beforeprint',()=>{tick();printing=true;globalThis.FIAPMath?.renderIn(get('phase-panels'));printedDetails=[...document.querySelectorAll('.phase-panel details,.source-notes')].map(d=>[d,d.open]);printedDetails.forEach(([d])=>{d.open=true;});});
  window.addEventListener('afterprint',()=>{printedDetails.forEach(([d,open])=>{d.open=open;});printing=false;lastTick=performance.now();});
  ['pointerdown','keydown','wheel','touchstart'].forEach(type=>document.addEventListener(type,event=>{if(event.isTrusted)lastActivity=performance.now();},{passive:true}));
  document.addEventListener('visibilitychange',()=>{lastTick=performance.now();updateTimes();});
  window.addEventListener('blur',()=>{tick();lastTick=performance.now();});
  window.addEventListener('focus',()=>{readLatest();lastActivity=performance.now();lastTick=lastActivity;updateTimes();});
  window.addEventListener('pagehide',tick);
  window.addEventListener('storage',event=>{
    if(event.key!==storageKey||!event.newValue)return;
    const incoming=E.restore(event.newValue,bank);if(incoming.updatedAt<=state.updatedAt)return;
    const changed=JSON.stringify([state.attempts,state.minis,state.practices])!==JSON.stringify([incoming.attempts,incoming.minis,incoming.practices]);incoming.activeTab=state.activeTab;state=incoming;
    selectedAttempt=Math.min(selectedAttempt,Math.max(0,state.attempts.length-1));
    if(changed&&semester.phases.length){semester.phases.forEach(p=>renderMini(p.id));bank.chapterIds.forEach(renderPractice);renderFinal();}updateProgress();applyTheme();applySidebar();updateTimes();
  });
  get('semester-select').innerHTML=curriculum.semesters.map(s=>`<option value="${s.id}">${R.escape(s.title)}${s.status==='planned'?' · em preparação':''}</option>`).join('');
  const initialRoute=new URLSearchParams(location.hash.slice(1));selectSemester(initialRoute.get('semestre'));
  const initialPhase=initialRoute.get('fase'),initialChapter=initialRoute.get('capitulo');
  if(initialPhase==='final'&&semester.phases.length)activateTab('final',{scroll:false});
  else if(semester.phases.some(p=>String(p.id)===initialPhase)){selections.set(Number(initialPhase),{chapter:initialChapter||'overview',subject:'all'});activateTab(`phase-${initialPhase}`,{scroll:false});}
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'b') {
      if (event.target.closest('input, select, textarea, [contenteditable="true"]') || get('semester-content').hidden) return;
      event.preventDefault(); toggleSidebar(); return;
    }
    if (event.key === 'Escape' && drawerOpen) { event.preventDefault(); setDrawer(false); }
  });
  get('sidebar-toggle').addEventListener('click', toggleSidebar);
  get('sidebar-close').addEventListener('click', () => { if (compact.matches) setDrawer(false); else toggleSidebar(); });
  get('sidebar-backdrop').addEventListener('click', () => setDrawer(false));
  compact.addEventListener('change', () => { drawerOpen = false; applySidebar(); });
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector('.library-layout').classList.add('is-ready')));
  const header = document.querySelector('.site-header'), toolbar = document.querySelector('.reading-toolbar');
  // No celular o cabeçalho rola junto (position: static): só a barra de leitura desconta altura.
  const measureOffsets = () => {
    const root = document.documentElement.style;
    root.setProperty('--header-offset', `${getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().height : 0}px`);
    root.setProperty('--toolbar-offset', `${toolbar.getBoundingClientRect().height}px`);
  };
  const offsets = new ResizeObserver(measureOffsets);
  offsets.observe(header);
  offsets.observe(toolbar);
  compact.addEventListener('change', measureOffsets);
  window.setInterval(tick,1000);
})();