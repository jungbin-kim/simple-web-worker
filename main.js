// input delay 값 받아서 동적으로 실행
// let inputElement = document.querySelector('#number1');

let result = document.querySelector('.result');

function appendTextToResult(text) {
    let textElement = document.createElement("p");
    textElement.textContent = text;
    result.append(textElement);
}

function clearResult(){
    result.innerHTML = "";
}

function randomInt3() {
    return parseInt(Math.random() * 1000);
}

// 비동기로 worker 여러 메시지 보내는 함수
function postMessagesAsync(worker, startIndex, endIndex) {
    const promises = [];
    for(let i = startIndex; i < endIndex + 1; i++){
        const myPromise = new Promise((resolve, reject) => {
            let delay = randomInt3();
            let result = {index: i, delay: delay};
            setTimeout(function() {
                let m = 'Post message: ' + i + ', Delay: ' + delay;
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

    function testAsyncRequestToWorker(worker, reqNum) {
        if (reqNum <= 0) return;
        clearResult();
        let promises = postMessagesAsync(worker, 1, reqNum);
        console.log("Start Promises request", promises);
        appendTextToResult("Start Promises request");
        Promise.all(promises).then((resArray) => {
            console.log("End Promises request", resArray);
            appendTextToResult("End Promises request");
        });
    }

    // test
    testAsyncRequestToWorker(myWorker, 15);

} else {
    // 화면에 worker 지원 안하는 브라우저 나타내기
    result.textContent = 'This Browser don\'t support web worker';
}
