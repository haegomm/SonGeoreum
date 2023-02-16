/*global drawConnectors, HAND_CONNECTIONS, drawLandmarks, Hands, Camera*/
/*eslint no-undef: "error"*/
import React from "react";
import $script from "scriptjs";
import "./MotionTest.scss";

function customCompare(prev, next) {
  const pr = JSON.stringify(prev);
  const ne = JSON.stringify(next);
  return pr === ne;
}

const MotionTest = ({ categoryNum, startCorrect }) => {
  console.log("리렌더링 테스트");
  $script(
    [
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
    ],
    () => {
      console.log("succeess script loading");

      const videoElement = document.getElementsByClassName("input_video")[0];
      const canvasElement = document.getElementsByClassName("output_canvas")[0];
      const canvasCtx = canvasElement.getContext("2d");

      /*
    Websocket Connect
  */
      if (categoryNum === -1) categoryNum = 3;
      let url = `wss://i8b106.p.ssafy.io/ws/socket-server/${categoryNum}`;

      const handSocket = new WebSocket(url);
      let status = false;
      let count = 0;
      let word = "";
      handSocket.onmessage = function (e) {
        let data = JSON.parse(e.data).response;
        status = true;
        // console.log(JSON.parse(e.data));
        // console.log(JSON.parse(e.data).response);
        if (word !== data) {
          count = 0;
          word = data;
        } else {
          console.log("같다");
          count = count + 1;
          if (count > 20) {
            console.log(word);
            count = 0;
            startCorrect(word);
          }
        }
      };

      function sendMessage(msg) {
        if (status) {
          handSocket.send(
            JSON.stringify({
              message: msg,
            })
          );
        }
      }

      /*
    Mediapipe - callback, configs
  */
      function onResults(results) {
        canvasCtx.save();
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-640, 0);
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // detect number of hands
        if (results.multiHandLandmarks.length > 0) {
          // select one hand
          let oneHandLandMarks = results.multiHandLandmarks[0];
          // send data to server for prediction

          // handSocket.current.onopen = () => {
          //webSocket이 맺어지고 난 후, 실행
          sendMessage(oneHandLandMarks);
          // };

          // draw connections and connectors of landmarks
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: "#90de8a",
              lineWidth: 5,
            });
            drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 1,
            });
          }
        }
        canvasCtx.restore();
      }

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();

      /*
    My Functions
  */

      function drawHandBoundary(oneHandLandMarks, canvasCtx, myImage) {
        let minX = 1;
        let minY = 1;
        let maxX = 0;
        let maxY = 0;
        for (var mark of oneHandLandMarks) {
          if (mark.x < minX) minX = mark.x;
          if (mark.y < minY) minY = mark.y;
          if (mark.x > maxX) maxX = mark.x;
          if (mark.y > maxY) maxY = mark.y;
        }
        let percentX = maxX - minX;
        let percentY = maxY - minY;
        let drawWidth = canvasElement.width * percentX;
        let drawHeight = canvasElement.height * percentY;

        let startX = minX * canvasElement.width;
        let startY = minY * canvasElement.height;

        canvasCtx.strokeRect(
          startX - 20,
          startY - 20,
          drawWidth + 40,
          drawHeight + 40
        );
      }
    }
  );

  return (
    <div className="canvasBox">
      <canvas className="output_canvas" width="640px" height="460px"></canvas>
      <div>
        <video className="input_video"></video>
      </div>
    </div>
  );
};
export default React.memo(MotionTest, customCompare);
