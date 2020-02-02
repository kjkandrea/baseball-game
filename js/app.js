new Vue({
    el: '#app',
    data: {
        gameIsRunning: false,
        computerArray: [],
        playerArray: [],
        turns: [],
        count: 0
    },
    methods: {
        startGame: function() {
            this.gameIsRunning = true;
            // 옵션. generate 함수에 매개변수로 옵션을 넘겨줍니다.
            this.generate(3, 0, 10);
            this.turns = [];
        },
        // 컴퓨터의 랜덤 배열을 생성합니다.
        generate: function(size, lowest, highest) {
            var numbers = [];
            // 받아온 size만큼 루프를 돌려 생성합니다.
            for(var i = 0; i < size; i++) {
                var add = true;
                // Math 메서드로 랜덤한 값을 만들어냅니다.
                var randomNumber = Math.floor(Math.random() * highest);

                // 루프안에서 루프를 한번 더 돌려 중복된 값이 있는지 검증합니다.
                for(var j = 0; j < highest; j++) {
                    if(numbers[j] == randomNumber) {
                        // 중복되었으면 fail
                        add = false;
                    }
                }

                // 성공시 number 변수에 값을 밀어넣습니다.
                if(add) {
                    numbers.push(randomNumber);
                // 실패시 유효한 동작이 아니였으므로 카운트를 -1 합니다.
                } else {
                    i--;
                }
            }

            // 이 모든 과정이 완료되면 number 변수를 전역변수 computerArray에 올려줍니다.
            this.computerArray = numbers;
            //console.log(this.computerArray)
        },
        // 플레이어가 입력한 값을 체크합니다.
        attack: function(){
            // input의 value를 받아와 배열로 변경한 후(split(',')), 문자열 자료형을 모두 숫자로 바꿉니다.
            var inputVal = document.querySelector("#playerValue").value.split(',').map(i=>Number(i));

            // 배열의 길이가 3이 참인지, 배열이 모두 숫자인지 체크합니다.
            if(inputVal.length !== 3 || inputVal.some(isNaN)){
                alert('0부터 9까지 중복되지않게 따옴표(,)로 구분하여 3가지 입력하여주세요!');
            }else{
                // 혹시 중복된 값이 있는지 체크합니다.
                var isDuplicate = inputVal.some(function(item, idx){
                    return inputVal.indexOf(item) != idx
                });

                // 중복되는 숫자가 있을때 사용자를 혼냅니다.
                if(isDuplicate){
                    alert('중복되는 숫자가 있어욧!');
                    console.log(inputVal);
                }else{
                    // 받아온 값을 playerArray에 넘겨줍니다.
                    this.playerArray = inputVal;
                    // 이 모든 조건이 통과하면 다른 함수에게 계산을 하라고 넘겨줍니다.
                    this.caculate();
                }

            }
        },
        caculate: function() {
            //console.log(this.playerArray);
            var strike = 0;
            var ball = 0;
            // 이 함수가 작동할때마다 플레이어의 시도횟수를 카운트합니다.
            this.count++;

            // 컴퓨터의 값과 플레이어의 값을 비교합니다.
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (this.computerArray[i] == this.playerArray[j]) {
                        if (i === j) {
                            strike++;
                        } else {
                            ball++;
                        }
                        break;
                    }
                }
            }

            // 승리 시
            if (strike === 3) {
                this.turns.unshift({
                    text: '홈런!!! ' + (this.count - 1) + '번 만에 맞추셨습니다'
                });

                if (confirm('홈런!!! ' + (this.count - 1) + '번 만에 맞추셨습니다\n한 게임 더 하실래요?')) {
                    this.startGame();
                }else{
                    this.gameIsRunning = false;
                }

            // 패배 시
            } else if (this.count > 10) {
                this.turns.unshift({
                    isOut: true,
                    text: '시도 횟수를 초과하셨습니다.'
                });

            // 아웃 시
            } else {
                this.turns.unshift({
                    isOut: true,
                    text: this.playerArray + ': ' + strike + '스트라이크 ' + ball + '볼'
                });
            }
        }
    }
});
