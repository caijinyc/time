import React, { useEffect, useRef, useState } from "react";
import "./statics/css/basic.scss";
import "./statics/css/normalize.css";
import styles from "./App.module.scss";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

const padLeft = (v: number): string => {
  if (v < 10) {
    return "0" + v;
  }
  return String(v);
};

function App() {
  const d = dayjs();
  const currentDay = d.format("YYYYMMDD");
  const currentRealTime = d.format("HH:mm");
  const [, foreRender] = useState(0);

  const [counterStatus, setCounterStatus] = useState(false);

  const counterIntervalRef = useRef<any>();
  const counterRef = useRef<number>(
    Number(localStorage.getItem("counter")) || 0
  );

  const appRef = useRef<HTMLDivElement>(null);

  const [clickCounter, setClickCounter] = useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      foreRender(Math.random());
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("clickCounterl", clickCounter);
    if (clickCounter === 1) {
      setTimeout(() => {
        setClickCounter(0);
      }, 2000);
    }
    if (clickCounter > 5) {
      counterRef.current = 0;
      localStorage.setItem("counter", String(counterRef.current));
      foreRender(Math.random());
      setCounterStatus(false);
    }
  }, [clickCounter]);

  const counterToggle = () => {
    setCounterStatus(!counterStatus);
  };

  useEffect(() => {
    // 如果关闭计时器，就清除之前的
    if (!counterStatus) {
      clearInterval(counterIntervalRef.current);
    } else {
      // 如果打开计时器
      counterIntervalRef.current = setInterval(() => {
        counterRef.current += 1000;
        localStorage.setItem("counter", String(counterRef.current));
      }, 1000);
    }
  }, [counterStatus]);

  return (
    <div className={styles.App} ref={appRef}>
      <div className={styles.realTime}>
        <span className={styles.minuteAndHour}>{currentRealTime}</span>
        <span className={styles.second}>{d.format("ss")}</span>
      </div>

      <div
        className={styles.timeCounter}
        onClick={() => {
          counterToggle();
        }}
      >
        <span className={styles.hour}>
          {padLeft(dayjs.duration(counterRef.current).hours())}
        </span>
        <span>{padLeft(dayjs.duration(counterRef.current).minutes())}</span>
        <span className={styles.second}>
          {padLeft(dayjs.duration(counterRef.current).seconds())}
        </span>
      </div>
      <div className={styles.day} onClick={() => {}}>
        {currentDay} {dayjs().format("ddd")}.
      </div>
      <div className={styles.controlWrapper}>
        <div
          onClick={() => {
            if (appRef.current) {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                appRef.current.requestFullscreen();
              }
            }
          }}
        >
          T
        </div>
        <div>I</div>
        <div
          onClick={() => {
            setClickCounter(clickCounter + 1);
          }}
        >
          M
        </div>
        <div
          onClick={() => {
            counterToggle();
          }}
        >
          E
        </div>
      </div>
    </div>
  );
}

export default App;
