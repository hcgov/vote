console.log("dsafk");
console.log("mmmmm test")
declare var Sortable:any;
console.log("test 9388");

document.addEventListener('DOMContentLoaded', async (event) => {
    const submit:HTMLButtonElement = document.getElementById("submit") as HTMLButtonElement;
    const list = document.getElementById('candidateList') as HTMLUListElement;
    const response = await fetch("data.json");
    const data = await response.json();
    const electionStart:number = Number(data.electionStart);
    const electionEnd:number = Number(data.electionEnd);
    const now = Math.floor(Date.now()/1000);
    const timeTil = document.getElementById("timeTil") as HTMLSpanElement;

    const beforeEl = document.getElementById("before") as HTMLDivElement;
    const afterEl = document.getElementById("after") as HTMLDivElement;
    const x:HTMLDivElement = document.getElementById("x") as HTMLDivElement;

    if(now > electionEnd){
        afterEl.style.display = "block";
        submit.disabled = true;
        x.style.display="none";
    }

    if(now < electionStart){
        beforeEl.style.display = "block";
        submit.disabled = true;
        x.style.display="none";
        const updateCountdown = ()=>{
            const nowx = Math.floor(Date.now()/1000);
            const diff = electionStart - nowx;
            if(diff<=0){
                beforeEl.style.display = "none";
                submit.disabled = false;
                clearInterval(interval);
                return;
            }
            const days = Math.floor(diff/86400);
            const hours = Math.floor((diff % 86400)/3600);
            const minutes = Math.floor((diff % 3600)/60);
            const seconds = diff % 60;

            timeTil.innerText = `${days} days, ${hours}h, ${minutes}m, ${seconds}s`;
        }

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
    }

    for(const key in data.candidates){
        const candidate = data.candidates[key];
        const li = document.createElement("li");
        li.innerHTML = `<div class="candidateContainer">
<div class="dragIndicator">⠿</div>
<div class="candidateDetailsContainer"><div class="candidateName">${candidate.fullName}</div><div class="candidateAbbreviation">${candidate.abbreviation}</div></div>
</div>`;
        // candidate.fullName;
        li.dataset.fullName = candidate.fullName;

        list.appendChild(li);
    }
    console.log("test 73910");

    try{
        new Sortable(list, {
            animation: 150
        });
    }catch(err){
        alert(`${err} Please check your internet connection.`);
    }


    const electionCycle:Date = new Date(data.electionCycle);

    let bodyHeader: HTMLElement = document.getElementById("body-header") as HTMLElement;
    bodyHeader.innerText = `${electionCycle.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    })} National General Elections`;

    console.log("test9999");

    submit.addEventListener("click", async () => {
        console.log("dsfakjfs");
        const slackId = (document.getElementById("slackId") as HTMLInputElement).value;
        const voterId = (document.getElementById("voterId") as HTMLInputElement).value;

        if(!slackId || !voterId){
            alert("Slack ID or Voter ID missing. Please fill these fields in, as they are required.");
            return;
        }

        const rankedCandidates = Array.from(list.children).map(li => {
            return (li as HTMLElement).dataset.fullName;
        });

        console.log(rankedCandidates);

        alert("eBallot submitted successfully");

        submit.disabled = true;
        submit.innerText = "Ballot already submitted"

        await fetch("http://parliament-eballot.astr.ac/submit-vote", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                slackId,voterId, rankedCandidates
            })
        });

        window.open("submitted.html", "_self");
    })

    console.log("test 0987");
    const here:HTMLElement = document.getElementById("here") as HTMLElement;
    const iframe:HTMLIFrameElement = document.getElementById("iframeContainer") as HTMLIFrameElement;
    let iframeShowing:boolean = false;

    here.addEventListener("click", async () => {
        console.log("test1234");
        if(!iframeShowing){
            iframe.style.display = "block";
            iframeShowing = true;
        }else{
            iframe.style.display = "none";
            iframeShowing = false;
        }
    })
})
