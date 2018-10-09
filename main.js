// TODO input delay 값 받아서 동적으로 실행해보기
let delay1InputElement = document.querySelector('#number1');
let delay2InputElement = document.querySelector('#number2');

let result = document.querySelector('.result');

// 비동기로 worker 여러 메시지 보내는 함수
function postMessagesAsync(worker, startIndex, endIndex, delay) {
    const promises = [];
    for(let i = startIndex; i < endIndex + 1; i++){
        const myPromise = new Promise((resolve, reject) => {
            let result = {index: i};
            setTimeout(function() {
                console.log('Post message: ' + i);
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
	};

	let promises = [];
	const Delay1= 500;
	const Delay2= 300;

	// 첫번째 비동기 묶음
    promises = promises.concat(postMessagesAsync(myWorker, 1, 10, Delay1));

    // 두번째 비동기 묶음
    promises = promises.concat(postMessagesAsync(myWorker, 20, 30, Delay2));

    // 비동기 요청 묶음
    console.log("Start Promises request", promises);
    Promise.all(promises).then((resArray) => {
    	console.log("End Promises request", resArray);
	});

} else {
 // TODO 화면에 worker 지원 안하는 브라우저 나타내기
}
