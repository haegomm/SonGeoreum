import { CountdownCircleTimer } from "react-countdown-circle-timer";

const renderTime = ({ remainingTime }) => {
  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
};

const Timer = () => {
  <div className="timer-wrapper">
    <CountdownCircleTimer
      isPlaying
      duration={5}
      colors={["#0ea5e9", "#34d399", "#d9f99d"]}
      colorsTime={[5, 3, 0]}
      onComplete={() => [true, 1000]}
    >
      {renderTime}
    </CountdownCircleTimer>
  </div>;
};

export default Timer;
