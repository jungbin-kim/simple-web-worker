// TODO input delay 값 받아서 동적으로 실행해보기
let Delay1InputElement = document.querySelector('#number1');
let Delay2InputElement = document.querySelector('#number2');

let result = document.querySelector('.result');

// Check if Browser supports the Worker api.
if (window.Worker) {
	// Init Worker
	let myWorker = new Worker("worker.js");

	// worker 에서 요청 처리 후, 응답 처리 하는 함수
	myWorker.onmessage = function ({data}) {
		console.log(data);
	};

	const promises = [];
	const Delay1= 500;
	const Delay2= 300;

	// TODO 비동기 묶음 제조 함수 만들기
	// 첫번째 비동기
	for(let i = 1; i < 11; i++){
        const myPromise = new Promise((resolve, reject) => {
        	let result = {index: i};
            setTimeout(function() {
                console.log('Post message: ' + i);
                myWorker.postMessage(result);
                resolve(result);
            }, Delay1);
        });
        promises.push(myPromise);
    }

    // 두번째 비동기
    for(let j = 21; j < 31; j++){
        const myPromise = new Promise((resolve, reject) => {
            let result = {index: j};
            setTimeout(function() {
                console.log('Post message: ' + j);
                myWorker.postMessage(result);
                resolve(result);
            }, Delay2);
        });
        promises.push(myPromise);
    }

    Promise.all(promises).then((resArray) => {
    	console.log(resArray);
	});

} else {
 // TODO 화면에 worker 지원 안하는 브라우저 나타내기
}
