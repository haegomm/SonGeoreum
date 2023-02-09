import { CountdownCircleTimer } from 'react-countdown-circle-timer'

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
      colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
      onComplete={() => [true, 1000]}
    >
      {renderTime}
    </CountdownCircleTimer>
  </div>
}

export default Timer