/*global drawConnectors, HAND_CONNECTIONS, drawLandmarks, Hands, Camera*/
/*eslint no-undef: "error"*/

// import { useEffect } from "react";
// import useScript from "./useScript";
import $script from "scriptjs";
// import { useState } from "react";

// export default function MotionTest({ children }) {
//   const [loading, error] = useScript("https://unpkg.com/lodash");

//   if (error) {
//     console.log(error);
//     return <p>Error!</p>;
//   }
//   if (loading) {
//     console.log(loading);
//     return <p>Loading...</p>;
//   } else {
//     return <p>{_.camelCase(children)}</p>;
//   }
// }

export default function MotionTest() {
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
      let url = `ws://i8b106.p.ssafy.io/ws/socket-server`;

      const handSocket = new WebSocket(url);

      handSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        console.log("Data from server:", data);
      };

      function sendMessage(msg) {
        handSocket.send(
          JSON.stringify({
            message: msg,
          })
        );
      }

      /*
    Mediapipe - callback, configs
  */

      function onResults(results) {
        canvasCtx.save();
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
          sendMessage(oneHandLandMarks);

          // draw detected hand boundary
          if (oneHandLandMarks) {
            drawHandBoundary(oneHandLandMarks, canvasCtx, results.image);
          }

          // draw connections and connectors of landmarks
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
              color: "#00FF00",
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
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
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
    <div className="">
      <div>이곳은 손동작 테스트 페이지 입니다.</div>
      <div className="container">
        <video className="input_video"></video>
        <canvas
          className="output_canvas"
          width="1280px"
          height="720px"
        ></canvas>
      </div>
    </div>
  );
}
