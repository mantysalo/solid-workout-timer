import styles from "./App.module.css";

export type TimeAdjustmentButtonsProps = {
  incrementMinutes: () => void;
  decrementMinutes: () => void;
  incrementSeconds: () => void;
  decrementSeconds: () => void;
};

export function TimeAdjustmentButtons({
  incrementMinutes,
  decrementMinutes,
  incrementSeconds,
  decrementSeconds,
}: TimeAdjustmentButtonsProps) {
  return (
    <div class={styles.timeButtons}>
      <div class={styles.timeButtonGroup}>
        <button class={styles.timeButton} onClick={incrementMinutes}>
        ＋
        </button>
        <button class={styles.timeButton} onClick={decrementMinutes}>
        －
        </button>
      </div>
      <div class={styles.timeButtonGroup}>
        <button class={styles.timeButton} onClick={incrementSeconds}>
        ＋
        </button>
        <button class={styles.timeButton} onClick={decrementSeconds}>
        －
        </button>
      </div>
    </div>
  );
}
