import { Component, createEffect, createSignal, onCleanup, Show } from "solid-js";
import NoSleep from "nosleep.js";

import styles from "./App.module.css";
import { beep, wait } from "./beep";
import { TimeDisplay } from "./TimeDisplay";
import { formatRoundDuration } from "./format-round-duration";

const noSleep = new NoSleep();

const App: Component = () => {
  const DEFAULT_ROUND_TIME = 5 * 60;
  const DEFAULT_REST_TIME = 1 * 60;
  const COUNTDOWN_TIME = 10
  // @ts-expect-error
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const [roundTimeInSeconds, setRoundTimeInSeconds] = createSignal(DEFAULT_ROUND_TIME);
  const [restTimeInSeconds, setRestTimeInSeconds] = createSignal(DEFAULT_REST_TIME);
  const [countdownTimeInSeconds, setCountdownTimeInSeconds] = createSignal(COUNTDOWN_TIME);
  const [visibleTime, setVisibleTime] = createSignal<"round" | "rest" | "countdown">("round");
  const [isTimerTicking, setIsTimerTicking] = createSignal(false);

  const [capturedRoundTime, setCapturedRoundTime] = createSignal(DEFAULT_ROUND_TIME);
  const [capturedRestTime, setCapturedRestTime] = createSignal(DEFAULT_REST_TIME);


  let timer = setInterval(() => setVisibleTimeInSeconds((prev) => prev - 1, false), 1000);
  onCleanup(() => clearInterval(timer));
  createEffect(() => {
    if (isTimerTicking() === false) clearInterval(timer);
    else timer = setInterval(() => setVisibleTimeInSeconds((prev) => prev - 1, false), 1000);
  });

  createEffect(() => {
    if (restTimeInSeconds() === 0 && roundTimeInSeconds() === 0) {
      setRoundTimeInSeconds(capturedRoundTime());
      setRestTimeInSeconds(capturedRestTime());
      setVisibleTime("round");
    }
  });

  createEffect(() => {
    if (countdownTimeInSeconds() < 5 && countdownTimeInSeconds() > 1) {
      beep(audioCtx, 300, 440, 100);
    }
    if (countdownTimeInSeconds() === 1) {
      beep(audioCtx, 1000, 880, 100);
    }

    if (countdownTimeInSeconds() === 0) setVisibleTime("round");
  });

  createEffect(() => {
    if (roundTimeInSeconds() === 0) {
      playFiveBeeps();
    }
  });

  createEffect(() => {
    if (restTimeInSeconds() < 5 && restTimeInSeconds() > 1) {
      beep(audioCtx, 300, 440, 100);
    }
    if (restTimeInSeconds() === 1) {
      beep(audioCtx, 1000, 880, 100);
    }
  });

  createEffect(() => {
    if (roundTimeInSeconds() === 0) {
      setVisibleTime("rest");
    }
  });

  const setVisibleTimeInSeconds = (fn: (prev: number) => number, capture: boolean = true) => {
    if (visibleTime() === "rest") {
      setRestTimeInSeconds(fn);
      if (capture) setCapturedRestTime(fn);
    } else if (visibleTime() === "round") {
      setRoundTimeInSeconds(fn);
      if (capture) setCapturedRoundTime(fn);
    } else if (visibleTime() === "countdown") {
      setCountdownTimeInSeconds(fn);
    }
  };

  const incrementMinutes = () => {
    setVisibleTimeInSeconds((prev) => {
      if (prev + 60 > 60 * 60) {
        return prev;
      }
      return prev + 60;
    });
  };
  const decrementMinutes = () => {
    setVisibleTimeInSeconds((prev) => {
      if (prev > 60) {
        return prev - 60;
      }
      return prev;
    });
  };
  const incrementSeconds = () => {
    setVisibleTimeInSeconds((prev) => {
      if (prev + 5 > 60 * 60) {
        return prev;
      }
      return prev + 5;
    });
  };

  const decrementSeconds = () => {
    setVisibleTimeInSeconds((prev) => {
      if (prev - 5 === 0) {
        return prev;
      }
      return prev - 5;
    });
  };

  const playFiveBeeps = async () => {
    await beep(audioCtx, 200, 440, 100);
    await wait(100);
    await beep(audioCtx, 200, 440, 100);
    await wait(100);
    await beep(audioCtx, 200, 440, 100);
    await wait(100);
    await beep(audioCtx, 200, 440, 100);
    await wait(100);
    await beep(audioCtx, 200, 440, 100);
    await wait(100);
  };

  const getTimeToDisplay = () => {
    switch (visibleTime()) {
      case "countdown":
        return formatRoundDuration(countdownTimeInSeconds());
      case "rest":
        return formatRoundDuration(restTimeInSeconds());
      case "round":
        return formatRoundDuration(roundTimeInSeconds());
    }
  };

  return (
    <div class={[styles.App, styles[visibleTime()]].join(" ")}>
      <div class={styles.timeDescription}>{visibleTime()}</div>
      <div class={styles.time}>
        <TimeDisplay
          time={getTimeToDisplay}
          timeControls={{ decrementMinutes, decrementSeconds, incrementMinutes, incrementSeconds }}
          isTimerTicking={isTimerTicking}
        />
      </div>

      <div class={styles.controlButtonContainer}>
        <Show when={isTimerTicking() === false}>
          <button
            class={styles.controlButton}
            onClick={() =>
              setVisibleTime((prevValue) => {
                return prevValue === "round" ? "rest" : "round";
              })
            }
          >
            {visibleTime() === "round" ? "Set Rest Time" : "Set Round Time"}
          </button>
        </Show>
        <button
          class={styles.controlButton}
          onClick={() => {
            if (audioCtx.state === "suspended") {
              audioCtx.resume();
            }
            setIsTimerTicking((prevValue) => {
              if (prevValue === true) {
                noSleep.disable();
                setVisibleTime("round");
                setRestTimeInSeconds(capturedRestTime);
                setRoundTimeInSeconds(capturedRoundTime);
                setCountdownTimeInSeconds(10);
              } else {
                noSleep.enable();
                setVisibleTime("countdown");
              }
              return !prevValue;
            });
          }}
        >
          {isTimerTicking() ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default App;
