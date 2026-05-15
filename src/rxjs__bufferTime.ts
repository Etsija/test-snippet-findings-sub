import { Subscription, Observable, operate } from '@rxjs/observable';
import type { OperatorFunction, SchedulerLike } from '../types.js';
import { arrRemove } from '../util/arrRemove.js';
import { asyncScheduler } from '../scheduler/async.js';
import { popScheduler } from '../util/args.js';
import { executeSchedule } from '../util/executeSchedule.js';

export function bufferTime<T>(bufferTimeSpan: number, ...otherArgs: any[]): OperatorFunction<T, T[]> {
  const scheduler = popScheduler(otherArgs) ?? asyncScheduler;
  const bufferCreationInterval = (otherArgs[0] as number) ?? null;
  const maxBufferSize = (otherArgs[1] as number) || Infinity;

  return (source) =>
    new Observable((destination) => {
      // The active buffers, their related subscriptions, and removal functions.
      let bufferRecords: { buffer: T[]; subs: Subscription }[] | null = [];
      // If true, it means that every time we emit a buffer, we want to start a new buffer
      // this is only really used for when *just* the buffer time span is passed.
      let restartOnEmit = false;

      /**
       * Does the work of emitting the buffer from the record, ensuring that the
       * record is removed before the emission so reentrant code (from some custom scheduling, perhaps)
       * does not alter the buffer. Also checks to see if a new buffer needs to be started
       * after the emit.
       */
      const emit = (record: { buffer: T[]; subs: Subscription }) => {
        const { buffer, subs } = record;
        subs.unsubscribe();
        arrRemove(bufferRecords, record);
        destination.next(buffer);
        restartOnEmit && startBuffer();
      };

      /**
       * Called every time we start a new buffer. This does
       * the work of scheduling a job at the requested bufferTimeSpan
       * that will emit the buffer (if it's not unsubscribed before then).
       */
      const startBuffer = () => {
        if (bufferRecords) {
          const subs = new Subscription();
          destination.add(subs);
          const buffer: T[] = [];
          const record = {
            buffer,
            subs,
          };
          bufferRecords.push(record);
          executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
        }
      };

      if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
        // The user passed both a bufferTimeSpan (required), and a creation interval
        // That means we need to start new buffers on the interval, and those buffers need
        // to wait the required time span before emitting.
        executeSchedule(destination, scheduler, startBuffer, bufferCreationInterval, true);
      } else {
        restartOnEmit = true;
      }

      startBuffer();

      const bufferTimeSubscriber = operate({
        destination,
        next: (value: T) => {
          // Copy the records, so if we need to remove one we
          // don't mutate the array. It's hard, but not impossible to
          // set up a buffer time that could mutate the array and
          // cause issues here.
          const recordsCopy = bufferRecords!.slice();
          for (const record of recordsCopy) {
            // Loop over all buffers and
            const { buffer } = record;
            buffer.push(value);
            // If the buffer is over the max size, we need to emit it.
            maxBufferSize <= buffer.length && emit(record);
          }
        },
        // Clean up
        finalize: () => (bufferRecords = null),
      });

      source.subscribe(bufferTimeSubscriber);
    });
}
