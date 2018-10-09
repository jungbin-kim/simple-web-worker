let count = 0;
onmessage = function({data}) {

  // worker 내 상태 변화
  count++;
  // Send Response
  postMessage('Received ' + data.index + ' Message. Count = ' + count);
};