         startTest()

		 function startTest(){
            for(var i = 0; i < 10000 ; i++){
                postMessage(i)
                sleep(50);
            }
        }

        /**
        *  睡眠函数
        *  @param numberMillis -- 要睡眠的毫秒数
        */
        function sleep(numberMillis) {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
                }
        }
