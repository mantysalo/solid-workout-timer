import { Show } from "solid-js";
import styles from "./App.module.css";
import { TimeAdjustmentButtons, TimeAdjustmentButtonsProps } from "./TimeAdjustmentButtons";

export function TimeDisplay({
  time,
  timeControls,
  isTimerTicking,
}: {
  time: () => string;
  timeControls: TimeAdjustmentButtonsProps;
  isTimerTicking: () => boolean;
}) {
  return (
    <div class={styles.time}>
      <div>{time()}</div>
      <Show when={isTimerTicking() === false}>
        <TimeAdjustmentButtons {...timeControls} />
      </Show>
    </div>
  );
}
