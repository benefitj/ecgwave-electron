
import { WaveView, ViewModel, setCanvasPixelRatio, drawGrid } from '../libs/WaveView';
import pahoMqtt from '../libs/paho.javascript-1.0.3/paho-mqtt';
import { random } from 'lodash';

// 40毫秒执行一次
// 心电每秒200个值      每次绘制8个值
// 脉搏波每秒50个值     每次绘制2个值
// 胸腹呼吸每秒25个值   每次绘制1个值
const createWaveView = function (c: HTMLCanvasElement): WaveView {
    return new WaveView(c, {
        // 初始化
        onInit(view: WaveView) {
            let canvas = view.canvas;
            // 添加ViewModel
            view.models.push(
                // 创建心电
                new ViewModel({
                    width: canvas.width, // 宽度
                    height: canvas.height / 2, // 高度
                    drawCount: 8, // 绘制点数
                    median: 512, // 中值 = (最大值 - 最小值) / 2
                    step: 0.5, // 步长
                    baseLine: (canvas.height / 4), // 基线
                    maxCacheSize: 2, // 缓存数量
                    scaleRatio: 0.6, // 缩放比
                    padding: 16, // 空白填充
                    startX: 0,
                    startY: 0,
                    strokeStyle: '#FF0000'
                }),
                // 创建胸呼吸
                new ViewModel({
                    width: canvas.width, // 宽度
                    height: canvas.height / 2, // 高度
                    clearDirty: true, // 清理视图
                    drawCount: 1, // 绘制点数
                    median: 512, // 中值 = (最大值 - 最小值) / 2
                    step: 0.5 * 8, // 步长
                    baseLine: canvas.height * (3 / 4.0), // 基线
                    maxCacheSize: 2, // 缓存数量
                    scaleRatio: 0.4, // 缩放比
                    padding: 16, // 空白填充
                    startX: 0,
                    startY: canvas.height / 2 - 2,
                    strokeStyle: '#00FF00'
                }),
                // 创建腹呼吸
                new ViewModel({
                    width: canvas.width, // 宽度
                    height: canvas.height / 2, // 高度
                    clearDirty: false, // 不清理视图
                    drawCount: 1, // 绘制点数
                    median: 512, // 中值 = (最大值 - 最小值) / 2
                    step: 0.5 * 8, // 步长
                    baseLine: canvas.height * (3 / 4.0), // 基线
                    maxCacheSize: 2, // 缓存数量
                    scaleRatio: 0.4, // 缩放比
                    padding: 16, // 空白填充
                    startX: 0,
                    startY: canvas.height / 2 + 2,
                    strokeStyle: '#FFFF00'
                })
            );


            // let ctx = view.ctx;
            // // 清理视图
            // view.models.forEach(m => m.clear(ctx));
            // 打印参数
            for (const model of view.models) {
                console.log(JSON.stringify(model));
            }

            // view.onDrawBackground = function (ctx: CanvasRenderingContext2D) {
            //     ctx.lineWidth = 3;
            //     ctx.strokeStyle = "#FFFFFFFF";
            //     ctx.lineCap = "round";
            //     ctx.lineJoin = "round";

            //     ctx.beginPath();
            //     ctx.moveTo(0, this.height() / 2);
            //     ctx.lineTo(this.width(), this.height() / 2);
            //     ctx.stroke();
            //     console.log('绘制背景');
            // }

        }
    }, 40);
};

console.log('哈哈哈哈哈');


// export const showWaveView = (window: any) => {

//     let document = window.document;

//     var waveViewCanvas1: HTMLCanvasElement = document.getElementById("ecg-view1") as HTMLCanvasElement;
//     var waveViewCanvas2: HTMLCanvasElement = document.getElementById("ecg-view2") as HTMLCanvasElement;
//     var waveViewCanvas3: HTMLCanvasElement = document.getElementById("ecg-view3") as HTMLCanvasElement;
//     var waveViewCanvas4: HTMLCanvasElement = document.getElementById("ecg-view4") as HTMLCanvasElement;
//     var waveViewCanvas5: HTMLCanvasElement = document.getElementById("ecg-view5") as HTMLCanvasElement;
//     var waveViewCanvas6: HTMLCanvasElement = document.getElementById("ecg-view6") as HTMLCanvasElement;

//     // 设置canvas
//     let width = 700, height = 220;
//     setCanvasPixelRatio(waveViewCanvas1, window.devicePixelRatio, width, height);
//     setCanvasPixelRatio(waveViewCanvas2, window.devicePixelRatio, width, height);
//     setCanvasPixelRatio(waveViewCanvas3, window.devicePixelRatio, width, height);
//     setCanvasPixelRatio(waveViewCanvas4, window.devicePixelRatio, width, height);
//     setCanvasPixelRatio(waveViewCanvas5, window.devicePixelRatio, width, height);
//     setCanvasPixelRatio(waveViewCanvas6, window.devicePixelRatio, width, height);

//     // // 绘制背景网格
//     // var bgGridCanvas: HTMLCanvasElement = document.getElementById("bg-grid") as HTMLCanvasElement;
//     // setCanvasPixelRatio(bgGridCanvas, window.devicePixelRatio, 1200, 300);
//     // drawGrid(bgGridCanvas, 20);

//     /**
//      * 设备对应的波形图
//      */
//     const deviceWaveViewMap = new Map<string, WaveView>();
//     deviceWaveViewMap.set('01000341', createWaveView(waveViewCanvas1));
//     deviceWaveViewMap.set('01000342', createWaveView(waveViewCanvas2));
//     deviceWaveViewMap.set('01000343', createWaveView(waveViewCanvas3));
//     deviceWaveViewMap.set('01000344', createWaveView(waveViewCanvas4));
//     deviceWaveViewMap.set('01000345', createWaveView(waveViewCanvas5));
//     deviceWaveViewMap.set('01000346', createWaveView(waveViewCanvas6));

//     // // 监听是否在当前页，并置为已读
//     // document.addEventListener("visibilitychange", function () {
//     //     // if (document.hidden) {
//     //     //     waveView.pause();
//     //     //     waveView2.pause();
//     //     //     console.log('pause');
//     //     // } else {
//     //     //     //处于当前页面
//     //     //     waveView.resume();
//     //     //     waveView2.resume();
//     //     //     console.log('resume');
//     //     // }
//     // });

//     // // 开始绘制
//     // deviceWaveViewMap.forEach((view, id) => view.start());

//     // // // 挂载到window
//     // // (window as any).waveView = waveView;
//     // // (window as any).waveView2 = waveView2;


//     // deviceWaveViewMap.forEach((view, id) => view.models.forEach(m => m.maxCacheSize = 2));
//     // // Create a client instance
//     // var client = new pahoMqtt.Client('192.168.232.128', Number(28083), '/mqtt', "mqtt-device-ecg-" + random(1, 10000, false));
//     // // set callback handlers
//     // // called when the client loses its connection
//     // client.onConnectionLost = function (responseObject: any) {
//     //     if (responseObject.errorCode !== 0) {
//     //         console.log("onConnectionLost:" + responseObject.errorMessage);
//     //     }
//     // };
//     // // called when a message arrives
//     // client.onMessageArrived = function (message: any) {
//     //     //console.log("onMessageArrived:" + message.payloadString);
//     //     let packet = JSON.parse(message.payloadString);
//     //     let view = deviceWaveViewMap.get(packet.deviceId);
//     //     if (view) {
//     //         view.push([packet.ecgList, packet.respList, packet.abdominalList]);
//     //     }
//     // };

//     // // connect the client
//     // client.connect({
//     //     userName: 'admin',
//     //     password: 'public',
//     //     //   onSuccess: onConnect 
//     //     onSuccess: function () {
//     //         // called when the client connects
//     //         // Once a connection has been made, make a subscription and send a message.
//     //         console.log("onConnect");
//     //         // 订阅主题
//     //         client.subscribe("/device/collector/+", null as any);
//     //         // message = new Paho.MQTT.Message("Hello");
//     //         // message.destinationName = "World";
//     //         // client.send(message);
//     //     }
//     // });
//     // console.log('连接MQTT服务');

// };

// showWaveView(window);