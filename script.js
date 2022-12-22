const url=`http://api.quotable.io/random`;
const timerRef=document.getElementById("timer");
const wpmRef=document.getElementById("wpm");
const containerRef=document.getElementById("container");
const quoteRef=document.getElementById("quote");
let interval=null;
// async function getData(){
//     var data = await (await fetch(url)).json();
//     document.getElementById("container").innerHTML=data["content"];
// }

function getData(){
    return new Promise((resolve,reject)=>{
        const data=fetch(url)
            .then((response) => response.json())
            .then((data)=>{
                resolve(data);
            }).catch((error)=>{
                reject(error);
            });

    })
}

getData().then((data)=>{
    quoteRef.innerHTML=data["content"];
});

function startTimer(){
    let seconds=parseInt(timerRef.innerText);
    seconds++;
    timerRef.innerText=seconds;
}

function start(){
    const play=document.getElementById("play");
    if(interval){
        interval=clearInterval(interval);
        play.style.backgroundColor="green";
        play.innerHTML="Start";
        containerRef.contentEditable=false;
        containerRef.style.opacity="0.5";
        return;
    }
    play.style.backgroundColor="red";
    play.innerHTML="Pause";
    containerRef.contentEditable=true;
    containerRef.style.opacity="1";
    containerRef.innerText='';
    containerRef.focus();
    containerRef.setAttribute("data-index","0");
    interval=setInterval(startTimer,1000);
}

function reset(){
    getData().then((data)=>{
        document.getElementById("quote").innerHTML=data["content"];
    });
    interval=clearInterval(interval);
    play.style.backgroundColor="green";
    play.innerHTML="Start";
    timerRef.innerText=0;
    containerRef.style.opacity="0.5";
    containerRef.innerText='';
    containerRef.setAttribute("data-index","0");
    
}


containerRef.addEventListener("click",start);
document.getElementById("play").addEventListener("click",start);
document.getElementById("reset").addEventListener("click",reset);
containerRef.addEventListener("keydown",(event)=>{
    event.preventDefault();
    
    
});
containerRef.addEventListener("keyup",(event)=>{
    event.preventDefault();
    const keys=["Enter","CapsLock","Backspace","Delete","Control","Shift"];
    const key=event.key;
    if(keys.includes(key)){
        return;
    }else if(key==" "){
        containerRef.innerHTML+='&nbsp';
    }
    const span=document.createElement("span");
    if(key!="Shift"){
        event.preventDefault();
        span.innerText=key;
    }
    
    const index=parseInt(containerRef.getAttribute("data-index"));

    if(quoteRef.innerText.charAt(index)==key){
        span.classList.add("correct");
    }else{
        span.classList.add("incorrect");
    }
    containerRef.setAttribute("data-index",index+1);
    containerRef.innerHTML+=span.outerHTML;
    let sel = window.getSelection();
    sel.selectAllChildren(containerRef);
    sel.collapseToEnd();
    
});


