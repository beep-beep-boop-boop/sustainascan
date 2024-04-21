// @ts-nocheck

"use client";

import { RefObject, useCallback, useLayoutEffect } from "react";
import Quagga, {
  QuaggaJSCodeReader,
  QuaggaJSReaderConfig,
  QuaggaJSConfigObject,
} from "@ericblade/quagga2";

const getMedian = (arr: number[]) => {
  const newArr = [...arr]; // copy the array before sorting, otherwise it mutates the array passed in, which is generally undesireable
  newArr.sort((a, b) => a - b);
  const half = Math.floor(newArr.length / 2);
  if (newArr.length % 2 === 1) {
    return newArr[half];
  }
  return (newArr[half - 1] + newArr[half]) / 2;
};

const getMedianOfCodeErrors = (decodedCodes) => {
  const errors = decodedCodes.flatMap((x) => x.error);
  const medianOfErrors = getMedian(errors);
  return medianOfErrors;
};

const defaultConstraints = {
  width: 640,
  height: 480,
};

const defaultLocatorSettings = {
  patchSize: "medium",
  halfSample: true,
  willReadFrequently: true,
};

const defaultDecoders: (QuaggaJSReaderConfig | QuaggaJSCodeReader)[] = [
  "upc_reader",
  "upc_e_reader",
];

interface Props {
  onDetected: () => void;
  scannerRef: RefObject<HTMLCanvasElement>;
  onScannerReady: () => void;
  cameraId: string;
  facingMode: string;
  constraints: {
    width: number;
    height: number;
  };
  locator: QuaggaJSConfigObject["locator"];
  decoders: (QuaggaJSReaderConfig | QuaggaJSCodeReader)[];
  locate: boolean;
}

export default function Scanner({
  onDetected,
  scannerRef,
  onScannerReady,
  cameraId,
  facingMode = "environment",
  constraints = defaultConstraints,
  locator = defaultLocatorSettings,
  decoders = defaultDecoders,
  locate = true,
}: Props) {
  const errorCheck = useCallback(
    (result) => {
      if (!onDetected) {
        return;
      }
      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      // if Quagga is at least 75% certain that it read correctly, then accept the code.
      if (err < 0.25) {
        onDetected(result.codeResult.code);
      }
    },
    [onDetected]
  );

  const handleProcessed = (result) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    drawingCtx.font = "24px Arial";
    drawingCtx.fillStyle = "green";
  };

  useLayoutEffect(() => {
    // if this component gets unmounted in the same tick that it is mounted, then all hell breaks loose,
    // so we need to wait 1 tick before calling init().  I'm not sure how to fix that, if it's even possible,
    // given the asynchronous nature of the camera functions, the non asynchronous nature of React, and just how
    // awful browsers are at dealing with cameras.
    let ignoreStart = false;
    const init = async () => {
      // wait for one tick to see if we get unmounted before we can possibly even begin cleanup
      await new Promise((resolve) => setTimeout(resolve, 1));
      if (ignoreStart) {
        return;
      }
      // begin scanner initialization
      await Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              ...constraints,
              ...(cameraId && { deviceId: cameraId }),
              ...(!cameraId && { facingMode }),
            },
            target: scannerRef.current,
            willReadFrequently: true,
          },
          locator,
          decoder: { readers: decoders },
          locate,
        },
        async (err) => {
          Quagga.onProcessed(handleProcessed);

          if (err) {
            return console.error("Error starting Quagga:", err);
          }
          if (scannerRef && scannerRef.current) {
            await Quagga.start();
            if (onScannerReady) {
              onScannerReady();
            }
          }
        }
      );
      Quagga.onDetected(errorCheck);
    };
    init();
    // cleanup by turning off the camera and any listeners
    return () => {
      ignoreStart = true;
      Quagga.stop();
      Quagga.offDetected(errorCheck);
      Quagga.offProcessed(handleProcessed);
    };
  }, [
    cameraId,
    onDetected,
    onScannerReady,
    scannerRef,
    errorCheck,
    constraints,
    locator,
    decoders,
    locate,
    facingMode,
  ]);
  return null;
}
