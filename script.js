const url=`http://api.quotable.io/random`;
const timerRef=document.getElementById("timer");
const wpmRef=document.getElementById("wpm");
const containerRef=document.getElementById("container");
const quoteRef=document.getElementById("quote");
let interval=null;
let qq=null;
let startTime=null;
let correctStrokes=0;
const typedChars=[];
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
function highLight(index){
    let text=quoteRef.innerText.split('');
    const mark=document.createElement("mark");
    mark.innerHTML=text[index];
    text[index]=mark.outerHTML;
    quoteRef.innerHTML=text.join('');
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
    qq=quoteRef.innerText;
    highLight(0);
    startTime=new Date();
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
    quoteRef.innerText='';
    containerRef.setAttribute("data-char",quoteRef.innerText.charAt(0));
    correctStrokes=0;
    wpmRef.innerText=0;
    typedChars.splice(0,typedChars.length);
}   


containerRef.addEventListener("click",start);
document.getElementById("play").addEventListener("click",start);
document.getElementById("reset").addEventListener("click",reset);
containerRef.addEventListener("keydown",(event)=>{
    event.preventDefault();
    
    
});

function renderTypedChar(){
    containerRef.innerHTML='';
    for(let i=0;i<typedChars.length;i++){
        const span=document.createElement("span");
        if(typedChars[i]==' '){
            span.innerHTML='&nbsp;';
        }else{
            span.innerHTML=typedChars[i];
        }
        
        if(qq.charAt(i)==typedChars[i]){
            span.className="correct";
        }else{
            span.className="incorrect";
        }
        containerRef.appendChild(span);
    }
}

containerRef.addEventListener("keyup",(event)=>{
    event.preventDefault();
    const keys=["Enter","CapsLock","Delete","Control","Shift","Tab"];
    const key=event.key;
    const index=parseInt(containerRef.getAttribute("data-index"));
    if(keys.includes(key)){
        return;
    }else if(key=="Backspace"){
        containerRef.setAttribute("data-index",index-1);
        highLight(index-1);
        typedChars.pop();
    }
    else{
        containerRef.setAttribute("data-index",index+1);
        typedChars.push(key);
        highLight(index+1);
    }
    
    renderTypedChar();

    let sel = window.getSelection();
    sel.selectAllChildren(containerRef);
    sel.collapseToEnd();

    quoteRef.innerText=qq;
    const timeElapsed=Math.floor((new Date() - startTime) / 1000);
    let correctStrokes=0;
    containerRef.querySelectorAll("span").forEach((span)=>{
        if(span.classList.contains("correct")){
            correctStrokes++;
        }
    });
    const wpm=Math.round(parseFloat(correctStrokes) / 5.0 / (parseFloat(timeElapsed) / 60.0));
    wpmRef.innerText=wpm;


    if(index>=qq.length-1){
        reset();
        alert("Your typing spped is "+wpm+" wpm");
        containerRef.innerText='Click here to start Typing...';
        containerRef.blur();
    }else{
        highLight(index+1);
    }
    
});


