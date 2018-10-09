// input delay 값 받아서 동적으로 실행
let delay1InputElement = document.querySelector('#number1');
let delay2InputElement = document.querySelector('#number2');

let result = document.querySelector('.result');

function appendTextToResult(text) {
    let textElement = document.createElement("p");
    textElement.textContent = text;
    result.append(textElement);
}

function clearResult(){
    result.innerHTML = "";
}

// 비동기로 worker 여러 메시지 보내는 함수
function postMessagesAsync(worker, startIndex, endIndex, delay) {
    const promises = [];
    for(let i = startIndex; i < endIndex + 1; i++){
        const myPromise = new Promise((resolve, reject) => {
            let result = {index: i};
            setTimeout(function() {
                let m = 'Post message: ' + i;
                console.log(m);
                appendTextToResult(m);
                worker.postMessage(result);
                resolve(result);
            }, delay);
        });
        promises.push(myPromise);
    }
    return promises;
}

// Check if Browser supports the Worker api.
if (window.Worker) {
	// Init Worker
	let myWorker = new Worker("worker.js");

	// worker 에서 요청 처리 후, 응답 처리 하는 함수
	myWorker.onmessage = function ({data}) {
		console.log(data);
        appendTextToResult(data);
	};

    delay1InputElement.onchange = function() {
        testAsyncWorker(myWorker, delay1InputElement.value, delay2InputElement.value);
    };

    delay2InputElement.onchange = function() {
        testAsyncWorker(myWorker, delay1InputElement.value, delay2InputElement.value);
    };

    function testAsyncWorker(worker, delay1, delay2) {
        if(delay1 > 0 && delay2 > 0) {
            clearResult();
            let promises = [];

            // 첫번째 비동기 묶음
            promises = promises.concat(postMessagesAsync(worker, 1, 10, delay1));

            // 두번째 비동기 묶음
            promises = promises.concat(postMessagesAsync(worker, 20, 30, delay2));

            // 비동기 요청 묶음
            console.log("Start Promises request", promises);
            appendTextToResult("Start Promises request");
            Promise.all(promises).then((resArray) => {
                console.log("End Promises request", resArray);
                appendTextToResult("End Promises request");
            });
        }
    }

} else {
    // 화면에 worker 지원 안하는 브라우저 나타내기
    result.textContent = 'This Browser don\'t support web worker';
}
