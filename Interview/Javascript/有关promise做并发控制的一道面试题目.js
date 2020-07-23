// JS实现一个带并发限制的异步调度器Scheduler，保证同时运行最多两个任务，完成下类的Scheduler，使得程序按照要求输出：
class Scheduler {
    constructor() {
        this.list = [];
        this.maxRequst = 2;
        this.tempCurrentIndex = 0;
    }
    add(promiseCeator) {
        this.list.push(promiseCeator)
    }
    taskStart() {
        for (let i = 0; i < this.maxRequst; i++) {
            this.request();
        }
    }
    request() { 
        if (!this.list || !this.list.length || this.tempCurrentIndex > this.maxRequst) return;
        this.tempCurrentIndex++;
        this.list.shift()().then(res => {
            this.tempCurrentIndex--;
            this.request()
        });
    }
}

const timeout = (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const scheduler = new Scheduler()

const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)))
}
// output 2 3 1 4
// 一开始，1 2两个任务进入队列
// 500ms时，2 完成,输出2 3进入队列
// 800ms, 3完成，输出3 4进入队列
// 1000ms 1完成，输出1
// 最后输出 4
addTask(1000, 1)
addTask(500, 2)
addTask(300, 3)
addTask(400, 4)
scheduler.taskStart()
