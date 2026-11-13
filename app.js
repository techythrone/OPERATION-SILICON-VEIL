const evidence = [
 ["01","Intercepted project correspondence","A message thread containing an internal program reference.","evidence/01-correspondence.txt"],
 ["02","Freight movement ledger","A reconciliation extract with a disputed warehouse handoff.","evidence/02-freight-ledger.csv"],
 ["03","Internal liaison transcript","A translated excerpt with a codename reference.","evidence/03-liaison-transcript.txt"],
 ["04","Engineering deployment note","A configuration fragment describing the accelerator platform.","evidence/04-engineering-note.txt"],
 ["05","Supplier due-diligence memo","A vendor review identifying an intermediary supplier.","evidence/05-supplier-memo.txt"],
 ["06","Validation and dispatch schedule","A schedule containing the decisive date discrepancy.","evidence/06-validation-schedule.txt"]
];
const challenges = [
 ["A01","Program identification","Correlate the correspondence subject line with the project reference repeated in the closing paragraph.","Submit the project codename as a flag."],
 ["A02","Unverified handoff","Compare the ledger's approved destination with the exception row. Identify the warehouse code used for the unverified handoff.","Submit the warehouse code as a flag."],
 ["A03","Liaison codename","Use the English gloss and the surrounding context to identify the bird codename used for the liaison channel.","Submit the codename as a flag."],
 ["A04","Hardware platform","Read the engineering note and identify the accelerator platform associated with the restricted validation profile.","Submit the platform identifier as a flag."],
 ["A05","Intermediary supplier","Cross-reference the supplier memo's legal-name field with the entity named in the payment exception.","Submit the supplier name as a flag."],
 ["A06","Schedule anomaly","Compare the final validation window against the dispatch instruction. Identify the date on which the restricted validation was scheduled.","Submit the date in YYYY-MM-DD format as a flag."]
];
const grid=document.getElementById("evidence-grid");
evidence.forEach(x=>{const el=document.createElement("article");el.className="evidence-card";el.innerHTML=`<div class="file-no">SOURCE ${x[0]} / EVIDENCE</div><h3>${x[1]}</h3><p>${x[2]}</p><a href="${x[3]}" download>↓ DOWNLOAD SOURCE FILE</a>`;grid.appendChild(el)});
const area=document.getElementById("challenges");
const solved=new Set();
challenges.forEach((c,i)=>{const el=document.createElement("article");el.className="challenge";el.innerHTML=`<div class="challenge-top"><span class="file-no">ASSESSMENT ${c[0]}</span><span class="tag">MODERATE</span></div><h3>${c[1]}</h3><p>${c[2]} ${c[3]}</p><div class="submit-row"><input id="answer-${i}" autocomplete="off" spellcheck="false" placeholder="Enter flag"><button id="submit-${i}">VERIFY</button></div><div id="result-${i}" class="result" aria-live="polite">AWAITING SUBMISSION</div>`;area.appendChild(el)});
function updateProgress(){const n=solved.size;document.getElementById("progress-bar").style.width=(n/6*100)+"%";document.getElementById("progress-text").textContent=`${n} of 6 assessments verified`;document.getElementById("completion").textContent=n===6?"ALL SIX ASSESSMENTS VERIFIED. CASE SV-27 IS READY FOR FINAL ANALYST REVIEW.":"Complete all six assessments to unlock the final case status."}
async function submit(i){const input=document.getElementById(`answer-${i}`),btn=document.getElementById(`submit-${i}`),result=document.getElementById(`result-${i}`),card=btn.closest(".challenge");const answer=input.value.trim();if(!answer){result.textContent="Enter a flag before submitting.";result.className="result bad";return}
 const api=window.SILICON_VEIL_CONFIG?.API_BASE;if(!api||api.includes("YOUR-WORKER")){result.textContent="Backend not configured. Contact the operation administrator.";result.className="result bad";return}
 btn.disabled=true;result.textContent="CONTACTING VALIDATION SERVICE…";result.className="result";
 try{const res=await fetch(api.replace(/\/$/,"")+"/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenge:challenges[i][0],answer})});const data=await res.json();if(res.ok&&data.correct){solved.add(i);card.classList.add("solved");result.textContent="VERIFIED — ASSESSMENT ACCEPTED";result.className="result ok";input.disabled=true;btn.textContent="ACCEPTED";btn.disabled=true;updateProgress()}else{result.textContent=data.message||"NOT VERIFIED — REVIEW THE SOURCE MATERIAL.";result.className="result bad"}}catch(e){result.textContent="VALIDATION SERVICE UNAVAILABLE. TRY AGAIN LATER.";result.className="result bad"}finally{if(!solved.has(i))btn.disabled=false}}
challenges.forEach((_,i)=>{document.getElementById(`submit-${i}`).addEventListener("click",()=>submit(i));document.getElementById(`answer-${i}`).addEventListener("keydown",e=>{if(e.key==="Enter")submit(i)})});
updateProgress();