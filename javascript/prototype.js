const flashcards = document.getElementsByClassName("flashcards")[0];

const createBox = document.getElementsByClassName("create-box")[0];

const question = document.getElementById("question");
const answer = document.getElementById("answer");
var selectmcq = true;
var selectcoderunner = false;
var currentXP = 0;
const progressfill = document.querySelector(".progressbar-fill");

let contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
/*If local storage is already used, get the information from the local storage and fill in the 
 content array. If not, then create a new array.
*/

for (i=0; i<contentArray.length; i++) {
    if (contentArray[i] == null) {
        contentArray.splice(i, 1);
        localStorage.setItem('items', JSON.stringify(contentArray));
        window.location.reload();
    }
}
console.log(contentArray);
function shuffle(array) {
    //shuffle question
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    //shuffle the answers
    for (k=0; k < array.length - 1; k++) {
        for (j=0; j<array[k].my_answer.length; j++) {
            let p = Math.floor(Math.random() * (j + 1));
            [array[k].my_answer[j], array[k].my_answer[p]] = [array[k].my_answer[p], array[k].my_answer[j]];
        }
    }
}

(contentArray.length > 1) ? window.onload = shuffle(contentArray): null;

contentArray.forEach(divMaker);

const iframe = document.querySelector('iframe');
const createbox = document.querySelector('.create-box');
const fcardscontainer = document.querySelector('.flashcards');
const fcard = document.querySelector('.flashcard');
var frameshow = false;
        
function showorhideIframe() {
    if (frameshow === false) { //open
        iframe.style.left = "0px";
        fcardscontainer.style.cssText = 'width: 50%; margin-right: 0%; justify-content: center; margin-top: 100px';
        createbox.style.marginRight = "8%";
        createbox.style.transition = "1s";
        frameshow = true;
    } else if (frameshow === true) { //hide
        fcardscontainer.style.cssText = 'width: 100%; margin-right: auto; justify-content: space-evenly;';
        iframe.style.left = "-800px";
        createbox.style.marginRight = "auto";
        frameshow = false;
    }
}

function addXP() {
    if (currentXP < 100) {
        currentXP += 20;
        document.querySelector("#XP").innerHTML = currentXP + `/100XP`;
        let thewidth = currentXP + "%";
        progressfill.style.width = thewidth;
    }
}

function checkanswer(btn_source) {
    btn_source.disabled = true;
    if (btn_source.classList.contains("obtainXP")) {
        btn_source.style.backgroundColor = "mediumseagreen";
        addXP();
    } else {
        btn_source.style.backgroundColor = "red";
    }
}

function divMaker(text, index) {

    var div = document.createElement("div"); //the flashcard, parent container
    div.className = "flashcard";

    //question-container
    var q_container = document.createElement("div");
    q_container.setAttribute("class", "question-container hide");
    div.appendChild(q_container);

    //div of question text 
    var div_questiontext = document.createElement("div");
    div_questiontext.setAttribute("class", "question");
    div_questiontext.innerHTML = text.my_question;
    q_container.appendChild(div_questiontext);

    //div of answer buttons or text area
    var div_answerbtns = document.createElement("div");
    div_answerbtns.setAttribute("class", "answer-buttons btn-grid");

    //the buttons
    let object = contentArray[index];

    if (object.question_type === "mcq") {
        for (i=0; i<object.question_num; i++) {
            var btns = document.createElement("button");
            btns.setAttribute("class", "btn");
            btns.innerHTML = object.my_answer[i];
            
            (object.my_answer[i] === object.answer_key) ? btns.className = "btn obtainXP": null;

            btns.onclick = function () {checkanswer(this);}
            div_answerbtns.appendChild(btns);
        }
    } else {
        var codingarea = document.createElement("div");
        codingarea.className = "editor";
        div_answerbtns.className = "answer-buttons code-block";
        div_answerbtns.appendChild(codingarea);
    }

    //append the div of answer buttons to question container;
    q_container.appendChild(div_answerbtns);

    //div of controls container
    var ctrl_container = document.createElement("div");
    ctrl_container.className = "controls";
    
    //control buttons
    var del_btn = document.createElement("button");
    del_btn.className = "del-btn";
    del_btn.innerHTML = "Delete"

    del_btn.addEventListener("click", () => {
        let promptText = "Delete this particular question?";
        if (confirm(promptText)) {
            contentArray.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(contentArray));
            window.location.reload();
        }
    })

    //append the control buttons to controls div
    ctrl_container.appendChild(del_btn);
    div.appendChild(ctrl_container);
    
    flashcards.appendChild(div);
}

function delFlashcards() {
    let text = "Are you sure to delete all the cards?";
    if (localStorage.length === 0 || !confirm(text)) {
        return;
    }
    localStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
    alert("Deleted!");
}


var createcardshow = false;
function showCreateCardBox() {
    createBox.style.display = "block";
    createcardshow = true;
    fcardscontainer.style.marginTop = "10px";
}

function hideCreateBox() {
    createcardshow = false;
    createBox.style.display = "none";
    fcardscontainer.style.marginTop = "100px";
}


function showMcqCardBox() {
    var mcq_div =  document.querySelector("#choices-container");
    let text = '';
    if (mcq_div.innerHTML === '') {
        text += `<label>Total Answer Choices: &nbsp;</label>`;
        text += `<div class="choices">`
            text += `<p>2</p>`;
            text += `<input type="radio" value="2" id="choice1" name="choices" onchange="handleChange(this);">`;
            text += `<p>4</p>`;
            text += `<input type="radio" value="4" id="choice2" name="choices" onchange="handleChange(this);">`;
            text += `<p>6</p>`;
            text += `<input type="radio" value="6" id="choice3" name="choices" onchange="handleChange(this);">`;
        text += `</div>`
    } else {
        mcq_div.innerHTML = '';
    }
    mcq_div.innerHTML = text;
    document.querySelector('#answer-type').innerHTML = '';
    document.querySelector("#answer").style.display = "block";
    selectmcq = true;
    selectcoderunner = false;
}

var numofchoices = 0;
function handleChange(source) {
    let text2 = '';
    numofchoices = source.value;
    switch(source.value) {
        case "2":
            text2 += `<input type="text" id="answer1" placeholder="first choice">`;
            text2 += `<input type="text" id="answer2" placeholder="second choice">`;
            break;
        case "4":
            text2 += `<input type="text" id="answer1" placeholder="first choice">`;
            text2 += `<input type="text" id="answer2" placeholder="second choice">`;
            text2 += `<input type="text" id="answer3" placeholder="third choice">`;
            text2 += `<input type="text" id="answer4" placeholder="fourth choice">`;
            break;
        case "6":
            text2 += `<input type="text" id="answer1" placeholder="first choice">`;
            text2 += `<input type="text" id="answer2" placeholder="second choice">`;
            text2 += `<input type="text" id="answer3" placeholder="third choice">`;
            text2 += `<input type="text" id="answer4" placeholder="fourth choice">`;
            text2 += `<input type="text" id="answer5" placeholder="fifth choice">`;
            text2 += `<input type="text" id="answer6" placeholder="sixth choice">`;
            break;
    }
    document.querySelector('#answer-type').innerHTML = text2;
}

function showCodeRunnerBox() {
    document.querySelector('#answer-type').innerHTML = `<div id="editor"></div>`;
    document.querySelector("#choices-container").innerHTML = '';
    document.querySelector("#answer").style.display = "none";
    selectcoderunner = true;
    selectmcq = false;
}

function addFlashcard() {
    let question_text = question.value.replace(/\n/g, '<br>');
    
    if (selectcoderunner && !selectmcq) {
        var flashcard_info = {
            'my_question' : question_text,
            'my_answer' : answer.value,
            'question_type': "code",
        }

    } else if (selectmcq && !selectcoderunner) {
        switch (numofchoices) {
            case "2":
                var flashcard_info = {
                    'my_question' : question_text,
                    'my_answer' : [
                        document.querySelector('#answer1').value,
                        document.querySelector('#answer2').value,
                    ],
                    'answer_key': document.querySelector("#answer").value,
                    'question_type': "mcq",
                    'question_num' : "2",
                }
                break;
            case "4":
                var flashcard_info = {
                    'my_question' : question_text,
                    'my_answer' : [
                        document.querySelector('#answer1').value,
                        document.querySelector('#answer2').value,
                        document.querySelector('#answer3').value,
                        document.querySelector('#answer4').value,
                    ],
                    'answer_key': document.querySelector("#answer").value,
                    'question_type': "mcq",
                    'question_num' : "4",
                }
                break;
            case "6":
                var flashcard_info = {
                    'my_question' : question_text,
                    'my_answer' : [
                        document.querySelector('#answer1').value,
                        document.querySelector('#answer2').value,
                        document.querySelector('#answer3').value,
                        document.querySelector('#answer4').value,
                        document.querySelector('#answer5').value,
                        document.querySelector('#answer6').value,
                    ],
                    'answer_key': document.querySelector("#answer").value,
                    'question_type': "mcq",
                    'question_num' : "6",
                }
                break;
        }
        
    }
    contentArray.push(flashcard_info);
    localStorage.setItem('items', JSON.stringify(contentArray));

    divMaker(contentArray[contentArray.length - 1], contentArray.length - 1); //the content of the last index of the current dictionary, the index
    
    alert("Question added!");
    question.value = '';
    answer.value = '';
}